// ==UserScript==
// @name         链接点击记录器
// @namespace    http://tampermonkey.net/
// @version      0.0.4
// @author       seepine
// @description  记录点击链接的信息
// @license      MIT
// @icon         data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="%23F3F3F3"><path d="m678-134 46-46-64-64-46 46q-14 14-14 32t14 32q14 14 32 14t32-14Zm102-102 46-46q14-14 14-32t-14-32q-14-14-32-14t-32 14l-46 46 64 64ZM735-77q-37 37-89 37t-89-37q-37-37-37-89t37-89l148-148q37-37 89-37t89 37q37 37 37 89t-37 89L735-77ZM200-200v-560 560Zm0 80q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h168q13-36 43.5-58t68.5-22q38 0 68.5 22t43.5 58h168q33 0 56.5 23.5T840-760v245q-20-5-40-5t-40 3v-243H200v560h243q-3 20-3 40t5 40H200Zm280-670q13 0 21.5-8.5T510-820q0-13-8.5-21.5T480-850q-13 0-21.5 8.5T450-820q0 13 8.5 21.5T480-790ZM280-600v-80h400v80H280Zm0 160v-80h400v34q-8 5-15.5 11.5T649-460l-20 20H280Zm0 160v-80h269l-49 49q-8 8-14.5 15.5T474-280H280Z"/></svg>
// @match        *://*/*
// @require      https://registry.npmmirror.com/vue/3.5.22/files/dist/vue.global.prod.js
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/554108/%E9%93%BE%E6%8E%A5%E7%82%B9%E5%87%BB%E8%AE%B0%E5%BD%95%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/554108/%E9%93%BE%E6%8E%A5%E7%82%B9%E5%87%BB%E8%AE%B0%E5%BD%95%E5%99%A8.meta.js
// ==/UserScript==

(function (vue) {
  'use strict';

  const d=new Set;const importCSS = async e=>{d.has(e)||(d.add(e),(t=>{typeof GM_addStyle=="function"?GM_addStyle(t):document.head.appendChild(document.createElement("style")).append(t);})(e));};

  importCSS(" .list-item[data-v-35e1587b]{display:flex;align-items:center;justify-content:space-between;width:100%;-webkit-user-select:none;user-select:none}.t-list-item[data-v-35e1587b]{cursor:pointer}.t-list-item[data-v-35e1587b]:hover{background-color:var(--td-bg-color-container-hover)}.group-title[data-v-35e1587b]{margin-top:0!important} ");

  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var require_main_001 = __commonJS({
    "main-CCxxAABS.js"(exports, module) {
      const indexCss$c = ':root{--td-screen-xs: 320px;--td-screen-sm: 768px;--td-screen-md: 992px;--td-screen-lg: 1200px;--td-screen-xl: 1400px;--td-screen-xxl: 1880px}@-moz-document url-prefix(){.narrow-scrollbar{scrollbar-color:var(--td-scrollbar-color) transparent;scrollbar-width:thin}}.narrow-scrollbar::-webkit-scrollbar{width:8px;height:8px}.narrow-scrollbar::-webkit-scrollbar-thumb{border:2px solid transparent;background-clip:content-box;background-color:var(--td-scrollbar-color);border-radius:15px}.narrow-scrollbar::-webkit-scrollbar-thumb:vertical:hover,.narrow-scrollbar::-webkit-scrollbar-thumb:horizontal:hover{background-color:var(--td-scrollbar-hover-color)}.t-fake-arrow path{transition:d .2s;stroke:currentcolor}.t-fake-arrow--active path{d:path("M3.75 10.2002L7.99274 5.7998L12.2361 10.0425")}.t-slide-down-enter-active,.t-slide-down-leave-active{transition:height .2s cubic-bezier(.38,0,.24,1),max-height .2s cubic-bezier(.38,0,.24,1)}:root,:root[theme-mode=light]{--td-brand-color-1: #f2f3ff;--td-brand-color-2: #d9e1ff;--td-brand-color-3: #b5c7ff;--td-brand-color-4: #8eabff;--td-brand-color-5: #618dff;--td-brand-color-6: #366ef4;--td-brand-color-7: #0052d9;--td-brand-color-8: #003cab;--td-brand-color-9: #002a7c;--td-brand-color-10: #001a57;--td-warning-color-1: #fff1e9;--td-warning-color-2: #ffd9c2;--td-warning-color-3: #ffb98c;--td-warning-color-4: #fa9550;--td-warning-color-5: #e37318;--td-warning-color-6: #be5a00;--td-warning-color-7: #954500;--td-warning-color-8: #713300;--td-warning-color-9: #532300;--td-warning-color-10: #3b1700;--td-error-color-1: #fff0ed;--td-error-color-2: #ffd8d2;--td-error-color-3: #ffb9b0;--td-error-color-4: #ff9285;--td-error-color-5: #f6685d;--td-error-color-6: #d54941;--td-error-color-7: #ad352f;--td-error-color-8: #881f1c;--td-error-color-9: #68070a;--td-error-color-10: #490002;--td-success-color-1: #e3f9e9;--td-success-color-2: #c6f3d7;--td-success-color-3: #92dab2;--td-success-color-4: #56c08d;--td-success-color-5: #2ba471;--td-success-color-6: #008858;--td-success-color-7: #006c45;--td-success-color-8: #005334;--td-success-color-9: #003b23;--td-success-color-10: #002515;--td-gray-color-1: #f3f3f3;--td-gray-color-2: #eee;--td-gray-color-3: #e8e8e8;--td-gray-color-4: #ddd;--td-gray-color-5: #c6c6c6;--td-gray-color-6: #a6a6a6;--td-gray-color-7: #8b8b8b;--td-gray-color-8: #777;--td-gray-color-9: #5e5e5e;--td-gray-color-10: #4b4b4b;--td-gray-color-11: #393939;--td-gray-color-12: #2c2c2c;--td-gray-color-13: #242424;--td-gray-color-14: #181818;--td-font-white-1: #ffffff;--td-font-white-2: rgba(255, 255, 255, .55);--td-font-white-3: rgba(255, 255, 255, .35);--td-font-white-4: rgba(255, 255, 255, .22);--td-font-gray-1: rgba(0, 0, 0, .9);--td-font-gray-2: rgba(0, 0, 0, .6);--td-font-gray-3: rgba(0, 0, 0, .4);--td-font-gray-4: rgba(0, 0, 0, .26);--td-brand-color: var(--td-brand-color-7);--td-warning-color: var(--td-warning-color-5);--td-error-color: var(--td-error-color-6);--td-success-color: var(--td-success-color-5);--td-brand-color-hover: var(--td-brand-color-6);--td-brand-color-focus: var(--td-brand-color-2);--td-brand-color-active: var(--td-brand-color-8);--td-brand-color-disabled: var(--td-brand-color-3);--td-brand-color-light: var(--td-brand-color-1);--td-brand-color-light-hover: var(--td-brand-color-2);--td-warning-color-hover: var(--td-warning-color-4);--td-warning-color-focus: var(--td-warning-color-2);--td-warning-color-active: var(--td-warning-color-6);--td-warning-color-disabled: var(--td-warning-color-3);--td-warning-color-light: var(--td-warning-color-1);--td-warning-color-light-hover: var(--td-warning-color-2);--td-error-color-hover: var(--td-error-color-5);--td-error-color-focus: var(--td-error-color-2);--td-error-color-active: var(--td-error-color-7);--td-error-color-disabled: var(--td-error-color-3);--td-error-color-light: var(--td-error-color-1);--td-error-color-light-hover: var(--td-error-color-2);--td-success-color-hover: var(--td-success-color-4);--td-success-color-focus: var(--td-success-color-2);--td-success-color-active: var(--td-success-color-6);--td-success-color-disabled: var(--td-success-color-3);--td-success-color-light: var(--td-success-color-1);--td-success-color-light-hover: var(--td-success-color-2);--td-mask-active: rgba(0, 0, 0, .6);--td-mask-disabled: rgba(255, 255, 255, .6);--td-mask-background: rgba(255, 255, 255, .96);--td-bg-color-page: var(--td-gray-color-2);--td-bg-color-container: #fff;--td-bg-color-container-hover: var(--td-gray-color-1);--td-bg-color-container-active: var(--td-gray-color-3);--td-bg-color-container-select: #fff;--td-bg-color-secondarycontainer: var(--td-gray-color-1);--td-bg-color-secondarycontainer-hover: var(--td-gray-color-2);--td-bg-color-secondarycontainer-active: var(--td-gray-color-4);--td-bg-color-component: var(--td-gray-color-3);--td-bg-color-component-hover: var(--td-gray-color-4);--td-bg-color-component-active: var(--td-gray-color-6);--td-bg-color-secondarycomponent: var(--td-gray-color-4);--td-bg-color-secondarycomponent-hover: var(--td-gray-color-5);--td-bg-color-secondarycomponent-active: var(--td-gray-color-6);--td-bg-color-component-disabled: var(--td-gray-color-2);--td-bg-color-specialcomponent: #fff;--td-text-color-primary: var(--td-font-gray-1);--td-text-color-secondary: var(--td-font-gray-2);--td-text-color-placeholder: var(--td-font-gray-3);--td-text-color-disabled: var(--td-font-gray-4);--td-text-color-anti: #fff;--td-text-color-brand: var(--td-brand-color-7);--td-text-color-link: var(--td-brand-color-8);--td-text-color-watermark: rgba(0, 0, 0, .1);--td-border-level-1-color: var(--td-gray-color-3);--td-component-stroke: var(--td-gray-color-3);--td-border-level-2-color: var(--td-gray-color-4);--td-component-border: var(--td-gray-color-4);--td-shadow-1: 0 1px 10px rgba(0, 0, 0, .05), 0 4px 5px rgba(0, 0, 0, .08), 0 2px 4px -1px rgba(0, 0, 0, .12);--td-shadow-2: 0 3px 14px 2px rgba(0, 0, 0, .05), 0 8px 10px 1px rgba(0, 0, 0, .06), 0 5px 5px -3px rgba(0, 0, 0, .1);--td-shadow-3: 0 6px 30px 5px rgba(0, 0, 0, .05), 0 16px 24px 2px rgba(0, 0, 0, .04), 0 8px 10px -5px rgba(0, 0, 0, .08);--td-shadow-inset-top: inset 0 .5px 0 #dcdcdc;--td-shadow-inset-right: inset .5px 0 0 #dcdcdc;--td-shadow-inset-bottom: inset 0 -.5px 0 #dcdcdc;--td-shadow-inset-left: inset -.5px 0 0 #dcdcdc;--td-table-shadow-color: rgba(0, 0, 0, .08);--td-scrollbar-color: rgba(0, 0, 0, .1);--td-scrollbar-hover-color: rgba(0, 0, 0, .3);--td-scroll-track-color: #fff}:root[theme-mode=dark]{--td-brand-color-1: #1b2f51;--td-brand-color-2: #173463;--td-brand-color-3: #143975;--td-brand-color-4: #103d88;--td-brand-color-5: #0d429a;--td-brand-color-6: #054bbe;--td-brand-color-7: #2667d4;--td-brand-color-8: #4582e6;--td-brand-color-9: #699ef5;--td-brand-color-10: #96bbf8;--td-warning-color-1: #4f2a1d;--td-warning-color-2: #582f21;--td-warning-color-3: #733c23;--td-warning-color-4: #a75d2b;--td-warning-color-5: #cf6e2d;--td-warning-color-6: #dc7633;--td-warning-color-7: #e8935c;--td-warning-color-8: #ecbf91;--td-warning-color-9: #eed7bf;--td-warning-color-10: #f3e9dc;--td-error-color-1: #472324;--td-error-color-2: #5e2a2d;--td-error-color-3: #703439;--td-error-color-4: #83383e;--td-error-color-5: #a03f46;--td-error-color-6: #c64751;--td-error-color-7: #de6670;--td-error-color-8: #ec888e;--td-error-color-9: #edb1b6;--td-error-color-10: #eeced0;--td-success-color-1: #193a2a;--td-success-color-2: #1a4230;--td-success-color-3: #17533d;--td-success-color-4: #0d7a55;--td-success-color-5: #059465;--td-success-color-6: #43af8a;--td-success-color-7: #46bf96;--td-success-color-8: #80d2b6;--td-success-color-9: #b4e1d3;--td-success-color-10: #deede8;--td-gray-color-1: #f3f3f3;--td-gray-color-2: #eee;--td-gray-color-3: #e8e8e8;--td-gray-color-4: #ddd;--td-gray-color-5: #c6c6c6;--td-gray-color-6: #a6a6a6;--td-gray-color-7: #8b8b8b;--td-gray-color-8: #777;--td-gray-color-9: #5e5e5e;--td-gray-color-10: #4b4b4b;--td-gray-color-11: #393939;--td-gray-color-12: #2c2c2c;--td-gray-color-13: #242424;--td-gray-color-14: #181818;--td-font-white-1: rgba(255, 255, 255, .9);--td-font-white-2: rgba(255, 255, 255, .55);--td-font-white-3: rgba(255, 255, 255, .35);--td-font-white-4: rgba(255, 255, 255, .22);--td-font-gray-1: rgba(0, 0, 0, .9);--td-font-gray-2: rgba(0, 0, 0, .6);--td-font-gray-3: rgba(0, 0, 0, .4);--td-font-gray-4: rgba(0, 0, 0, .26);--td-brand-color: var(--td-brand-color-8);--td-warning-color: var(--td-warning-color-5);--td-error-color: var(--td-error-color-6);--td-success-color: var(--td-success-color-5);--td-brand-color-hover: var(--td-brand-color-7);--td-brand-color-focus: var(--td-brand-color-2);--td-brand-color-active: var(--td-brand-color-9);--td-brand-color-disabled: var(--td-brand-color-3);--td-brand-color-light: var(--td-brand-color-1);--td-brand-color-light-hover: var(--td-brand-color-2);--td-warning-color-hover: var(--td-warning-color-4);--td-warning-color-focus: var(--td-warning-color-2);--td-warning-color-active: var(--td-warning-color-6);--td-warning-color-disabled: var(--td-warning-color-3);--td-warning-color-light: var(--td-warning-color-1);--td-warning-color-light-hover: var(--td-warning-color-2);--td-error-color-hover: var(--td-error-color-5);--td-error-color-focus: var(--td-error-color-2);--td-error-color-active: var(--td-error-color-7);--td-error-color-disabled: var(--td-error-color-3);--td-error-color-light: var(--td-error-color-1);--td-error-color-light-hover: var(--td-error-color-2);--td-success-color-hover: var(--td-success-color-4);--td-success-color-focus: var(--td-success-color-2);--td-success-color-active: var(--td-success-color-6);--td-success-color-disabled: var(--td-success-color-3);--td-success-color-light: var(--td-success-color-1);--td-success-color-light-hover: var(--td-success-color-2);--td-mask-active: rgba(0, 0, 0, .4);--td-mask-disabled: rgba(0, 0, 0, .6);--td-mask-background: rgba(36, 36, 36, .96);--td-bg-color-page: var(--td-gray-color-14);--td-bg-color-container: var(--td-gray-color-13);--td-bg-color-container-hover: var(--td-gray-color-12);--td-bg-color-container-active: var(--td-gray-color-10);--td-bg-color-container-select: var(--td-gray-color-9);--td-bg-color-secondarycontainer: var(--td-gray-color-12);--td-bg-color-secondarycontainer-hover: var(--td-gray-color-11);--td-bg-color-secondarycontainer-active: var(--td-gray-color-9);--td-bg-color-component: var(--td-gray-color-11);--td-bg-color-component-hover: var(--td-gray-color-10);--td-bg-color-component-active: var(--td-gray-color-9);--td-bg-color-secondarycomponent: var(--td-gray-color-10);--td-bg-color-secondarycomponent-hover: var(--td-gray-color-9);--td-bg-color-secondarycomponent-active: var(--td-gray-color-8);--td-bg-color-component-disabled: var(--td-gray-color-12);--td-bg-color-specialcomponent: transparent;--td-text-color-primary: var(--td-font-white-1);--td-text-color-secondary: var(--td-font-white-2);--td-text-color-placeholder: var(--td-font-white-3);--td-text-color-disabled: var(--td-font-white-4);--td-text-color-anti: #fff;--td-text-color-brand: var(--td-brand-color-8);--td-text-color-link: var(--td-brand-color-8);--td-text-color-watermark: rgba(255, 255, 255, .1);--td-border-level-1-color: var(--td-gray-color-11);--td-component-stroke: var(--td-gray-color-11);--td-border-level-2-color: var(--td-gray-color-9);--td-component-border: var(--td-gray-color-9);--td-shadow-1: 0 4px 6px rgba(0, 0, 0, .06), 0 1px 10px rgba(0, 0, 0, .08), 0 2px 4px rgba(0, 0, 0, .12);--td-shadow-2: 0 8px 10px rgba(0, 0, 0, .12), 0 3px 14px rgba(0, 0, 0, .1), 0 5px 5px rgba(0, 0, 0, .16);--td-shadow-3: 0 16px 24px rgba(0, 0, 0, .14), 0 6px 30px rgba(0, 0, 0, .12), 0 8px 10px rgba(0, 0, 0, .2);--td-shadow-inset-top: inset 0 .5px 0 #5e5e5e;--td-shadow-inset-right: inset .5px 0 0 #5e5e5e;--td-shadow-inset-bottom: inset 0 -.5px 0 #5e5e5e;--td-shadow-inset-left: inset -.5px 0 0 #5e5e5e;--td-table-shadow-color: rgba(0, 0, 0, .55);--td-scrollbar-color: rgba(255, 255, 255, .1);--td-scrollbar-hover-color: rgba(255, 255, 255, .3);--td-scroll-track-color: #333}:root{--td-radius-small: 2px;--td-radius-default: 3px;--td-radius-medium: 6px;--td-radius-large: 9px;--td-radius-extraLarge: 12px;--td-radius-round: 999px;--td-radius-circle: 50%}:root{--td-font-family: PingFang SC, Microsoft YaHei, Arial Regular;--td-font-family-medium: PingFang SC, Microsoft YaHei, Arial Medium;--td-font-size-link-small: 12px;--td-font-size-link-medium: 14px;--td-font-size-link-large: 16px;--td-font-size-mark-small: 12px;--td-font-size-mark-medium: 14px;--td-font-size-body-small: 12px;--td-font-size-body-medium: 14px;--td-font-size-body-large: 16px;--td-font-size-title-small: 14px;--td-font-size-title-medium: 16px;--td-font-size-title-large: 18px;--td-font-size-title-extraLarge: 20px;--td-font-size-headline-small: 24px;--td-font-size-headline-medium: 28px;--td-font-size-headline-large: 36px;--td-font-size-display-medium: 48px;--td-font-size-display-large: 64px;--td-line-height-link-small: 20px;--td-line-height-link-medium: 22px;--td-line-height-link-large: 24px;--td-line-height-mark-small: 20px;--td-line-height-mark-medium: 22px;--td-line-height-body-small: 20px;--td-line-height-body-medium: 22px;--td-line-height-body-large: 24px;--td-line-height-title-small: 22px;--td-line-height-title-medium: 24px;--td-line-height-title-large: 26px;--td-line-height-title-extraLarge: 28px;--td-line-height-headline-small: 32px;--td-line-height-headline-medium: 36px;--td-line-height-headline-large: 44px;--td-line-height-display-medium: 56px;--td-line-height-display-large: 72px;--td-font-link-small: var(--td-font-size-link-small) / var(--td-line-height-link-small) var(--td-font-family);--td-font-link-medium: var(--td-font-size-link-medium) / var(--td-line-height-link-medium) var(--td-font-family);--td-font-link-large: var(--td-font-size-link-large) / var(--td-line-height-link-large) var(--td-font-family);--td-font-mark-small: 600 var(--td-font-size-mark-small) / var(--td-line-height-mark-small) var(--td-font-family);--td-font-mark-medium: 600 var(--td-font-size-mark-medium) / var(--td-line-height-mark-medium) var(--td-font-family);--td-font-body-small: var(--td-font-size-body-small) / var(--td-line-height-body-small) var(--td-font-family);--td-font-body-medium: var(--td-font-size-body-medium) / var(--td-line-height-body-medium) var(--td-font-family);--td-font-body-large: var(--td-font-size-body-large) / var(--td-line-height-body-large) var(--td-font-family);--td-font-title-small: 600 var(--td-font-size-title-small) / var(--td-line-height-title-small) var(--td-font-family);--td-font-title-medium: 600 var(--td-font-size-title-medium) / var(--td-line-height-title-medium) var(--td-font-family);--td-font-title-large: 600 var(--td-font-size-title-large) / var(--td-line-height-title-large) var(--td-font-family);--td-font-title-extraLarge: 600 var(--td-font-size-title-extraLarge) / var(--td-line-height-title-extraLarge) var(--td-font-family);--td-font-headline-small: 600 var(--td-font-size-headline-small) / var(--td-line-height-headline-small) var(--td-font-family);--td-font-headline-medium: 600 var(--td-font-size-headline-medium) / var(--td-line-height-headline-medium) var(--td-font-family);--td-font-headline-large: 600 var(--td-font-size-headline-large) / var(--td-line-height-headline-large) var(--td-font-family);--td-font-display-medium: 600 var(--td-font-size-display-medium) / var(--td-line-height-display-medium) var(--td-font-family);--td-font-display-large: 600 var(--td-font-size-display-large) / var(--td-line-height-display-large) var(--td-font-family)}:root{--td-size-1: 2px;--td-size-2: 4px;--td-size-3: 6px;--td-size-4: 8px;--td-size-5: 12px;--td-size-6: 16px;--td-size-7: 20px;--td-size-8: 24px;--td-size-9: 28px;--td-size-10: 32px;--td-size-11: 36px;--td-size-12: 40px;--td-size-13: 48px;--td-size-14: 56px;--td-size-15: 64px;--td-size-16: 72px;--td-comp-size-xxxs: var(--td-size-6);--td-comp-size-xxs: var(--td-size-7);--td-comp-size-xs: var(--td-size-8);--td-comp-size-s: var(--td-size-9);--td-comp-size-m: var(--td-size-10);--td-comp-size-l: var(--td-size-11);--td-comp-size-xl: var(--td-size-12);--td-comp-size-xxl: var(--td-size-13);--td-comp-size-xxxl: var(--td-size-14);--td-comp-size-xxxxl: var(--td-size-15);--td-comp-size-xxxxxl: var(--td-size-16);--td-pop-padding-s: var(--td-size-2);--td-pop-padding-m: var(--td-size-3);--td-pop-padding-l: var(--td-size-4);--td-pop-padding-xl: var(--td-size-5);--td-pop-padding-xxl: var(--td-size-6);--td-comp-paddingLR-xxs: var(--td-size-1);--td-comp-paddingLR-xs: var(--td-size-2);--td-comp-paddingLR-s: var(--td-size-4);--td-comp-paddingLR-m: var(--td-size-5);--td-comp-paddingLR-l: var(--td-size-6);--td-comp-paddingLR-xl: var(--td-size-8);--td-comp-paddingLR-xxl: var(--td-size-10);--td-comp-paddingTB-xxs: var(--td-size-1);--td-comp-paddingTB-xs: var(--td-size-2);--td-comp-paddingTB-s: var(--td-size-4);--td-comp-paddingTB-m: var(--td-size-5);--td-comp-paddingTB-l: var(--td-size-6);--td-comp-paddingTB-xl: var(--td-size-8);--td-comp-paddingTB-xxl: var(--td-size-10);--td-comp-margin-xxs: var(--td-size-1);--td-comp-margin-xs: var(--td-size-2);--td-comp-margin-s: var(--td-size-4);--td-comp-margin-m: var(--td-size-5);--td-comp-margin-l: var(--td-size-6);--td-comp-margin-xl: var(--td-size-7);--td-comp-margin-xxl: var(--td-size-8);--td-comp-margin-xxxl: var(--td-size-10);--td-comp-margin-xxxxl: var(--td-size-12)}';
      importCSS(indexCss$c);
      /**
       * tdesign v1.17.1
       * (c) 2025 tdesign
       * @license MIT
       */
      function _arrayLikeToArray$1(r, a) {
        (null == a || a > r.length) && (a = r.length);
        for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
        return n;
      }
      function _unsupportedIterableToArray$1(r, a) {
        if (r) {
          if ("string" == typeof r) return _arrayLikeToArray$1(r, a);
          var t2 = {}.toString.call(r).slice(8, -1);
          return "Object" === t2 && r.constructor && (t2 = r.constructor.name), "Map" === t2 || "Set" === t2 ? Array.from(r) : "Arguments" === t2 || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t2) ? _arrayLikeToArray$1(r, a) : void 0;
        }
      }
      /**
       * tdesign v1.17.1
       * (c) 2025 tdesign
       * @license MIT
       */
      function _arrayWithoutHoles(r) {
        if (Array.isArray(r)) return _arrayLikeToArray$1(r);
      }
      function _iterableToArray(r) {
        if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r);
      }
      function _nonIterableSpread() {
        throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
      }
      function _toConsumableArray(r) {
        return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray$1(r) || _nonIterableSpread();
      }
      /**
       * tdesign v1.17.1
       * (c) 2025 tdesign
       * @license MIT
       */
      function _typeof(o) {
        "@babel/helpers - typeof";
        return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
          return typeof o2;
        } : function(o2) {
          return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
        }, _typeof(o);
      }
      /**
       * tdesign v1.17.1
       * (c) 2025 tdesign
       * @license MIT
       */
      function toPrimitive(t2, r) {
        if ("object" != _typeof(t2) || !t2) return t2;
        var e = t2[Symbol.toPrimitive];
        if (void 0 !== e) {
          var i2 = e.call(t2, r);
          if ("object" != _typeof(i2)) return i2;
          throw new TypeError("@@toPrimitive must return a primitive value.");
        }
        return ("string" === r ? String : Number)(t2);
      }
      function toPropertyKey(t2) {
        var i2 = toPrimitive(t2, "string");
        return "symbol" == _typeof(i2) ? i2 : i2 + "";
      }
      /**
       * tdesign v1.17.1
       * (c) 2025 tdesign
       * @license MIT
       */
      function _defineProperty$1(e, r, t2) {
        return (r = toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
          value: t2,
          enumerable: true,
          configurable: true,
          writable: true
        }) : e[r] = t2, e;
      }
      var freeGlobal = typeof global == "object" && global && global.Object === Object && global;
      var freeSelf = typeof self == "object" && self && self.Object === Object && self;
      var root$1 = freeGlobal || freeSelf || Function("return this")();
      var Symbol$1 = root$1.Symbol;
      var objectProto$f = Object.prototype;
      var hasOwnProperty$d = objectProto$f.hasOwnProperty;
      var nativeObjectToString$1 = objectProto$f.toString;
      var symToStringTag$1 = Symbol$1 ? Symbol$1.toStringTag : void 0;
      function getRawTag(value) {
        var isOwn = hasOwnProperty$d.call(value, symToStringTag$1), tag = value[symToStringTag$1];
        try {
          value[symToStringTag$1] = void 0;
          var unmasked = true;
        } catch (e) {
        }
        var result = nativeObjectToString$1.call(value);
        if (unmasked) {
          if (isOwn) {
            value[symToStringTag$1] = tag;
          } else {
            delete value[symToStringTag$1];
          }
        }
        return result;
      }
      var objectProto$e = Object.prototype;
      var nativeObjectToString = objectProto$e.toString;
      function objectToString(value) {
        return nativeObjectToString.call(value);
      }
      var nullTag = "[object Null]", undefinedTag = "[object Undefined]";
      var symToStringTag = Symbol$1 ? Symbol$1.toStringTag : void 0;
      function baseGetTag(value) {
        if (value == null) {
          return value === void 0 ? undefinedTag : nullTag;
        }
        return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
      }
      function isObjectLike(value) {
        return value != null && typeof value == "object";
      }
      var symbolTag$3 = "[object Symbol]";
      function isSymbol(value) {
        return typeof value == "symbol" || isObjectLike(value) && baseGetTag(value) == symbolTag$3;
      }
      function arrayMap(array, iteratee) {
        var index = -1, length = array == null ? 0 : array.length, result = Array(length);
        while (++index < length) {
          result[index] = iteratee(array[index], index, array);
        }
        return result;
      }
      var isArray = Array.isArray;
      var symbolProto$2 = Symbol$1 ? Symbol$1.prototype : void 0, symbolToString = symbolProto$2 ? symbolProto$2.toString : void 0;
      function baseToString(value) {
        if (typeof value == "string") {
          return value;
        }
        if (isArray(value)) {
          return arrayMap(value, baseToString) + "";
        }
        if (isSymbol(value)) {
          return symbolToString ? symbolToString.call(value) : "";
        }
        var result = value + "";
        return result == "0" && 1 / value == -Infinity ? "-0" : result;
      }
      var reWhitespace = /\s/;
      function trimmedEndIndex(string) {
        var index = string.length;
        while (index-- && reWhitespace.test(string.charAt(index))) {
        }
        return index;
      }
      var reTrimStart = /^\s+/;
      function baseTrim(string) {
        return string ? string.slice(0, trimmedEndIndex(string) + 1).replace(reTrimStart, "") : string;
      }
      function isObject(value) {
        var type = typeof value;
        return value != null && (type == "object" || type == "function");
      }
      var NAN = 0 / 0;
      var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
      var reIsBinary = /^0b[01]+$/i;
      var reIsOctal = /^0o[0-7]+$/i;
      var freeParseInt = parseInt;
      function toNumber(value) {
        if (typeof value == "number") {
          return value;
        }
        if (isSymbol(value)) {
          return NAN;
        }
        if (isObject(value)) {
          var other = typeof value.valueOf == "function" ? value.valueOf() : value;
          value = isObject(other) ? other + "" : other;
        }
        if (typeof value != "string") {
          return value === 0 ? value : +value;
        }
        value = baseTrim(value);
        var isBinary = reIsBinary.test(value);
        return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
      }
      var INFINITY = 1 / 0, MAX_INTEGER = 17976931348623157e292;
      function toFinite(value) {
        if (!value) {
          return value === 0 ? value : 0;
        }
        value = toNumber(value);
        if (value === INFINITY || value === -INFINITY) {
          var sign = value < 0 ? -1 : 1;
          return sign * MAX_INTEGER;
        }
        return value === value ? value : 0;
      }
      function identity(value) {
        return value;
      }
      var asyncTag = "[object AsyncFunction]", funcTag$2 = "[object Function]", genTag$1 = "[object GeneratorFunction]", proxyTag = "[object Proxy]";
      function isFunction(value) {
        if (!isObject(value)) {
          return false;
        }
        var tag = baseGetTag(value);
        return tag == funcTag$2 || tag == genTag$1 || tag == asyncTag || tag == proxyTag;
      }
      var coreJsData = root$1["__core-js_shared__"];
      var maskSrcKey = (function() {
        var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || "");
        return uid ? "Symbol(src)_1." + uid : "";
      })();
      function isMasked(func) {
        return !!maskSrcKey && maskSrcKey in func;
      }
      var funcProto$2 = Function.prototype;
      var funcToString$2 = funcProto$2.toString;
      function toSource(func) {
        if (func != null) {
          try {
            return funcToString$2.call(func);
          } catch (e) {
          }
          try {
            return func + "";
          } catch (e) {
          }
        }
        return "";
      }
      var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
      var reIsHostCtor = /^\[object .+?Constructor\]$/;
      var funcProto$1 = Function.prototype, objectProto$d = Object.prototype;
      var funcToString$1 = funcProto$1.toString;
      var hasOwnProperty$c = objectProto$d.hasOwnProperty;
      var reIsNative = RegExp(
        "^" + funcToString$1.call(hasOwnProperty$c).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
      );
      function baseIsNative(value) {
        if (!isObject(value) || isMasked(value)) {
          return false;
        }
        var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
        return pattern.test(toSource(value));
      }
      function getValue(object, key2) {
        return object == null ? void 0 : object[key2];
      }
      function getNative(object, key2) {
        var value = getValue(object, key2);
        return baseIsNative(value) ? value : void 0;
      }
      var WeakMap$1 = getNative(root$1, "WeakMap");
      var objectCreate = Object.create;
      var baseCreate = (function() {
        function object() {
        }
        return function(proto) {
          if (!isObject(proto)) {
            return {};
          }
          if (objectCreate) {
            return objectCreate(proto);
          }
          object.prototype = proto;
          var result = new object();
          object.prototype = void 0;
          return result;
        };
      })();
      function apply(func, thisArg, args) {
        switch (args.length) {
          case 0:
            return func.call(thisArg);
          case 1:
            return func.call(thisArg, args[0]);
          case 2:
            return func.call(thisArg, args[0], args[1]);
          case 3:
            return func.call(thisArg, args[0], args[1], args[2]);
        }
        return func.apply(thisArg, args);
      }
      function copyArray(source, array) {
        var index = -1, length = source.length;
        array || (array = Array(length));
        while (++index < length) {
          array[index] = source[index];
        }
        return array;
      }
      var HOT_COUNT = 800, HOT_SPAN = 16;
      var nativeNow = Date.now;
      function shortOut(func) {
        var count = 0, lastCalled = 0;
        return function() {
          var stamp = nativeNow(), remaining = HOT_SPAN - (stamp - lastCalled);
          lastCalled = stamp;
          if (remaining > 0) {
            if (++count >= HOT_COUNT) {
              return arguments[0];
            }
          } else {
            count = 0;
          }
          return func.apply(void 0, arguments);
        };
      }
      function constant(value) {
        return function() {
          return value;
        };
      }
      var defineProperty = (function() {
        try {
          var func = getNative(Object, "defineProperty");
          func({}, "", {});
          return func;
        } catch (e) {
        }
      })();
      var baseSetToString = !defineProperty ? identity : function(func, string) {
        return defineProperty(func, "toString", {
          "configurable": true,
          "enumerable": false,
          "value": constant(string),
          "writable": true
        });
      };
      var setToString = shortOut(baseSetToString);
      function arrayEach(array, iteratee) {
        var index = -1, length = array == null ? 0 : array.length;
        while (++index < length) {
          if (iteratee(array[index], index, array) === false) {
            break;
          }
        }
        return array;
      }
      var MAX_SAFE_INTEGER$1 = 9007199254740991;
      var reIsUint = /^(?:0|[1-9]\d*)$/;
      function isIndex(value, length) {
        var type = typeof value;
        length = length == null ? MAX_SAFE_INTEGER$1 : length;
        return !!length && (type == "number" || type != "symbol" && reIsUint.test(value)) && (value > -1 && value % 1 == 0 && value < length);
      }
      function baseAssignValue(object, key2, value) {
        if (key2 == "__proto__" && defineProperty) {
          defineProperty(object, key2, {
            "configurable": true,
            "enumerable": true,
            "value": value,
            "writable": true
          });
        } else {
          object[key2] = value;
        }
      }
      function eq(value, other) {
        return value === other || value !== value && other !== other;
      }
      var objectProto$c = Object.prototype;
      var hasOwnProperty$b = objectProto$c.hasOwnProperty;
      function assignValue(object, key2, value) {
        var objValue = object[key2];
        if (!(hasOwnProperty$b.call(object, key2) && eq(objValue, value)) || value === void 0 && !(key2 in object)) {
          baseAssignValue(object, key2, value);
        }
      }
      function copyObject(source, props2, object, customizer) {
        var isNew = !object;
        object || (object = {});
        var index = -1, length = props2.length;
        while (++index < length) {
          var key2 = props2[index];
          var newValue = void 0;
          if (newValue === void 0) {
            newValue = source[key2];
          }
          if (isNew) {
            baseAssignValue(object, key2, newValue);
          } else {
            assignValue(object, key2, newValue);
          }
        }
        return object;
      }
      var nativeMax$2 = Math.max;
      function overRest(func, start2, transform) {
        start2 = nativeMax$2(start2 === void 0 ? func.length - 1 : start2, 0);
        return function() {
          var args = arguments, index = -1, length = nativeMax$2(args.length - start2, 0), array = Array(length);
          while (++index < length) {
            array[index] = args[start2 + index];
          }
          index = -1;
          var otherArgs = Array(start2 + 1);
          while (++index < start2) {
            otherArgs[index] = args[index];
          }
          otherArgs[start2] = transform(array);
          return apply(func, this, otherArgs);
        };
      }
      function baseRest(func, start2) {
        return setToString(overRest(func, start2, identity), func + "");
      }
      var MAX_SAFE_INTEGER = 9007199254740991;
      function isLength(value) {
        return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
      }
      function isArrayLike(value) {
        return value != null && isLength(value.length) && !isFunction(value);
      }
      function isIterateeCall(value, index, object) {
        if (!isObject(object)) {
          return false;
        }
        var type = typeof index;
        if (type == "number" ? isArrayLike(object) && isIndex(index, object.length) : type == "string" && index in object) {
          return eq(object[index], value);
        }
        return false;
      }
      function createAssigner(assigner) {
        return baseRest(function(object, sources) {
          var index = -1, length = sources.length, customizer = length > 1 ? sources[length - 1] : void 0, guard = length > 2 ? sources[2] : void 0;
          customizer = assigner.length > 3 && typeof customizer == "function" ? (length--, customizer) : void 0;
          if (guard && isIterateeCall(sources[0], sources[1], guard)) {
            customizer = length < 3 ? void 0 : customizer;
            length = 1;
          }
          object = Object(object);
          while (++index < length) {
            var source = sources[index];
            if (source) {
              assigner(object, source, index, customizer);
            }
          }
          return object;
        });
      }
      var objectProto$b = Object.prototype;
      function isPrototype(value) {
        var Ctor = value && value.constructor, proto = typeof Ctor == "function" && Ctor.prototype || objectProto$b;
        return value === proto;
      }
      function baseTimes(n, iteratee) {
        var index = -1, result = Array(n);
        while (++index < n) {
          result[index] = iteratee(index);
        }
        return result;
      }
      var argsTag$3 = "[object Arguments]";
      function baseIsArguments(value) {
        return isObjectLike(value) && baseGetTag(value) == argsTag$3;
      }
      var objectProto$a = Object.prototype;
      var hasOwnProperty$a = objectProto$a.hasOwnProperty;
      var propertyIsEnumerable$1 = objectProto$a.propertyIsEnumerable;
      var isArguments = baseIsArguments( (function() {
        return arguments;
      })()) ? baseIsArguments : function(value) {
        return isObjectLike(value) && hasOwnProperty$a.call(value, "callee") && !propertyIsEnumerable$1.call(value, "callee");
      };
      function stubFalse() {
        return false;
      }
      var freeExports$2 = typeof exports == "object" && exports && !exports.nodeType && exports;
      var freeModule$2 = freeExports$2 && typeof module == "object" && module && !module.nodeType && module;
      var moduleExports$2 = freeModule$2 && freeModule$2.exports === freeExports$2;
      var Buffer$1 = moduleExports$2 ? root$1.Buffer : void 0;
      var nativeIsBuffer = Buffer$1 ? Buffer$1.isBuffer : void 0;
      var isBuffer = nativeIsBuffer || stubFalse;
      var argsTag$2 = "[object Arguments]", arrayTag$2 = "[object Array]", boolTag$4 = "[object Boolean]", dateTag$3 = "[object Date]", errorTag$2 = "[object Error]", funcTag$1 = "[object Function]", mapTag$5 = "[object Map]", numberTag$4 = "[object Number]", objectTag$4 = "[object Object]", regexpTag$3 = "[object RegExp]", setTag$5 = "[object Set]", stringTag$4 = "[object String]", weakMapTag$2 = "[object WeakMap]";
      var arrayBufferTag$3 = "[object ArrayBuffer]", dataViewTag$4 = "[object DataView]", float32Tag$2 = "[object Float32Array]", float64Tag$2 = "[object Float64Array]", int8Tag$2 = "[object Int8Array]", int16Tag$2 = "[object Int16Array]", int32Tag$2 = "[object Int32Array]", uint8Tag$2 = "[object Uint8Array]", uint8ClampedTag$2 = "[object Uint8ClampedArray]", uint16Tag$2 = "[object Uint16Array]", uint32Tag$2 = "[object Uint32Array]";
      var typedArrayTags = {};
      typedArrayTags[float32Tag$2] = typedArrayTags[float64Tag$2] = typedArrayTags[int8Tag$2] = typedArrayTags[int16Tag$2] = typedArrayTags[int32Tag$2] = typedArrayTags[uint8Tag$2] = typedArrayTags[uint8ClampedTag$2] = typedArrayTags[uint16Tag$2] = typedArrayTags[uint32Tag$2] = true;
      typedArrayTags[argsTag$2] = typedArrayTags[arrayTag$2] = typedArrayTags[arrayBufferTag$3] = typedArrayTags[boolTag$4] = typedArrayTags[dataViewTag$4] = typedArrayTags[dateTag$3] = typedArrayTags[errorTag$2] = typedArrayTags[funcTag$1] = typedArrayTags[mapTag$5] = typedArrayTags[numberTag$4] = typedArrayTags[objectTag$4] = typedArrayTags[regexpTag$3] = typedArrayTags[setTag$5] = typedArrayTags[stringTag$4] = typedArrayTags[weakMapTag$2] = false;
      function baseIsTypedArray(value) {
        return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
      }
      function baseUnary(func) {
        return function(value) {
          return func(value);
        };
      }
      var freeExports$1 = typeof exports == "object" && exports && !exports.nodeType && exports;
      var freeModule$1 = freeExports$1 && typeof module == "object" && module && !module.nodeType && module;
      var moduleExports$1 = freeModule$1 && freeModule$1.exports === freeExports$1;
      var freeProcess = moduleExports$1 && freeGlobal.process;
      var nodeUtil = (function() {
        try {
          var types = freeModule$1 && freeModule$1.require && freeModule$1.require("util").types;
          if (types) {
            return types;
          }
          return freeProcess && freeProcess.binding && freeProcess.binding("util");
        } catch (e) {
        }
      })();
      var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;
      var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;
      var objectProto$9 = Object.prototype;
      var hasOwnProperty$9 = objectProto$9.hasOwnProperty;
      function arrayLikeKeys(value, inherited) {
        var isArr = isArray(value), isArg = !isArr && isArguments(value), isBuff = !isArr && !isArg && isBuffer(value), isType = !isArr && !isArg && !isBuff && isTypedArray(value), skipIndexes = isArr || isArg || isBuff || isType, result = skipIndexes ? baseTimes(value.length, String) : [], length = result.length;
        for (var key2 in value) {
          if ((inherited || hasOwnProperty$9.call(value, key2)) && !(skipIndexes &&
(key2 == "length" ||
isBuff && (key2 == "offset" || key2 == "parent") ||
isType && (key2 == "buffer" || key2 == "byteLength" || key2 == "byteOffset") ||
isIndex(key2, length)))) {
            result.push(key2);
          }
        }
        return result;
      }
      function overArg(func, transform) {
        return function(arg) {
          return func(transform(arg));
        };
      }
      var nativeKeys = overArg(Object.keys, Object);
      var objectProto$8 = Object.prototype;
      var hasOwnProperty$8 = objectProto$8.hasOwnProperty;
      function baseKeys(object) {
        if (!isPrototype(object)) {
          return nativeKeys(object);
        }
        var result = [];
        for (var key2 in Object(object)) {
          if (hasOwnProperty$8.call(object, key2) && key2 != "constructor") {
            result.push(key2);
          }
        }
        return result;
      }
      function keys(object) {
        return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
      }
      function nativeKeysIn(object) {
        var result = [];
        if (object != null) {
          for (var key2 in Object(object)) {
            result.push(key2);
          }
        }
        return result;
      }
      var objectProto$7 = Object.prototype;
      var hasOwnProperty$7 = objectProto$7.hasOwnProperty;
      function baseKeysIn(object) {
        if (!isObject(object)) {
          return nativeKeysIn(object);
        }
        var isProto = isPrototype(object), result = [];
        for (var key2 in object) {
          if (!(key2 == "constructor" && (isProto || !hasOwnProperty$7.call(object, key2)))) {
            result.push(key2);
          }
        }
        return result;
      }
      function keysIn(object) {
        return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
      }
      var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, reIsPlainProp = /^\w*$/;
      function isKey(value, object) {
        if (isArray(value)) {
          return false;
        }
        var type = typeof value;
        if (type == "number" || type == "symbol" || type == "boolean" || value == null || isSymbol(value)) {
          return true;
        }
        return reIsPlainProp.test(value) || !reIsDeepProp.test(value) || object != null && value in Object(object);
      }
      var nativeCreate = getNative(Object, "create");
      function hashClear() {
        this.__data__ = nativeCreate ? nativeCreate(null) : {};
        this.size = 0;
      }
      function hashDelete(key2) {
        var result = this.has(key2) && delete this.__data__[key2];
        this.size -= result ? 1 : 0;
        return result;
      }
      var HASH_UNDEFINED$2 = "__lodash_hash_undefined__";
      var objectProto$6 = Object.prototype;
      var hasOwnProperty$6 = objectProto$6.hasOwnProperty;
      function hashGet(key2) {
        var data = this.__data__;
        if (nativeCreate) {
          var result = data[key2];
          return result === HASH_UNDEFINED$2 ? void 0 : result;
        }
        return hasOwnProperty$6.call(data, key2) ? data[key2] : void 0;
      }
      var objectProto$5 = Object.prototype;
      var hasOwnProperty$5 = objectProto$5.hasOwnProperty;
      function hashHas(key2) {
        var data = this.__data__;
        return nativeCreate ? data[key2] !== void 0 : hasOwnProperty$5.call(data, key2);
      }
      var HASH_UNDEFINED$1 = "__lodash_hash_undefined__";
      function hashSet(key2, value) {
        var data = this.__data__;
        this.size += this.has(key2) ? 0 : 1;
        data[key2] = nativeCreate && value === void 0 ? HASH_UNDEFINED$1 : value;
        return this;
      }
      function Hash(entries) {
        var index = -1, length = entries == null ? 0 : entries.length;
        this.clear();
        while (++index < length) {
          var entry = entries[index];
          this.set(entry[0], entry[1]);
        }
      }
      Hash.prototype.clear = hashClear;
      Hash.prototype["delete"] = hashDelete;
      Hash.prototype.get = hashGet;
      Hash.prototype.has = hashHas;
      Hash.prototype.set = hashSet;
      function listCacheClear() {
        this.__data__ = [];
        this.size = 0;
      }
      function assocIndexOf(array, key2) {
        var length = array.length;
        while (length--) {
          if (eq(array[length][0], key2)) {
            return length;
          }
        }
        return -1;
      }
      var arrayProto = Array.prototype;
      var splice = arrayProto.splice;
      function listCacheDelete(key2) {
        var data = this.__data__, index = assocIndexOf(data, key2);
        if (index < 0) {
          return false;
        }
        var lastIndex = data.length - 1;
        if (index == lastIndex) {
          data.pop();
        } else {
          splice.call(data, index, 1);
        }
        --this.size;
        return true;
      }
      function listCacheGet(key2) {
        var data = this.__data__, index = assocIndexOf(data, key2);
        return index < 0 ? void 0 : data[index][1];
      }
      function listCacheHas(key2) {
        return assocIndexOf(this.__data__, key2) > -1;
      }
      function listCacheSet(key2, value) {
        var data = this.__data__, index = assocIndexOf(data, key2);
        if (index < 0) {
          ++this.size;
          data.push([key2, value]);
        } else {
          data[index][1] = value;
        }
        return this;
      }
      function ListCache(entries) {
        var index = -1, length = entries == null ? 0 : entries.length;
        this.clear();
        while (++index < length) {
          var entry = entries[index];
          this.set(entry[0], entry[1]);
        }
      }
      ListCache.prototype.clear = listCacheClear;
      ListCache.prototype["delete"] = listCacheDelete;
      ListCache.prototype.get = listCacheGet;
      ListCache.prototype.has = listCacheHas;
      ListCache.prototype.set = listCacheSet;
      var Map$1 = getNative(root$1, "Map");
      function mapCacheClear() {
        this.size = 0;
        this.__data__ = {
          "hash": new Hash(),
          "map": new (Map$1 || ListCache)(),
          "string": new Hash()
        };
      }
      function isKeyable(value) {
        var type = typeof value;
        return type == "string" || type == "number" || type == "symbol" || type == "boolean" ? value !== "__proto__" : value === null;
      }
      function getMapData(map, key2) {
        var data = map.__data__;
        return isKeyable(key2) ? data[typeof key2 == "string" ? "string" : "hash"] : data.map;
      }
      function mapCacheDelete(key2) {
        var result = getMapData(this, key2)["delete"](key2);
        this.size -= result ? 1 : 0;
        return result;
      }
      function mapCacheGet(key2) {
        return getMapData(this, key2).get(key2);
      }
      function mapCacheHas(key2) {
        return getMapData(this, key2).has(key2);
      }
      function mapCacheSet(key2, value) {
        var data = getMapData(this, key2), size = data.size;
        data.set(key2, value);
        this.size += data.size == size ? 0 : 1;
        return this;
      }
      function MapCache(entries) {
        var index = -1, length = entries == null ? 0 : entries.length;
        this.clear();
        while (++index < length) {
          var entry = entries[index];
          this.set(entry[0], entry[1]);
        }
      }
      MapCache.prototype.clear = mapCacheClear;
      MapCache.prototype["delete"] = mapCacheDelete;
      MapCache.prototype.get = mapCacheGet;
      MapCache.prototype.has = mapCacheHas;
      MapCache.prototype.set = mapCacheSet;
      var FUNC_ERROR_TEXT$2 = "Expected a function";
      function memoize(func, resolver) {
        if (typeof func != "function" || resolver != null && typeof resolver != "function") {
          throw new TypeError(FUNC_ERROR_TEXT$2);
        }
        var memoized = function() {
          var args = arguments, key2 = resolver ? resolver.apply(this, args) : args[0], cache = memoized.cache;
          if (cache.has(key2)) {
            return cache.get(key2);
          }
          var result = func.apply(this, args);
          memoized.cache = cache.set(key2, result) || cache;
          return result;
        };
        memoized.cache = new (memoize.Cache || MapCache)();
        return memoized;
      }
      memoize.Cache = MapCache;
      var MAX_MEMOIZE_SIZE = 500;
      function memoizeCapped(func) {
        var result = memoize(func, function(key2) {
          if (cache.size === MAX_MEMOIZE_SIZE) {
            cache.clear();
          }
          return key2;
        });
        var cache = result.cache;
        return result;
      }
      var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
      var reEscapeChar = /\\(\\)?/g;
      var stringToPath = memoizeCapped(function(string) {
        var result = [];
        if (string.charCodeAt(0) === 46) {
          result.push("");
        }
        string.replace(rePropName, function(match, number, quote, subString) {
          result.push(quote ? subString.replace(reEscapeChar, "$1") : number || match);
        });
        return result;
      });
      function toString(value) {
        return value == null ? "" : baseToString(value);
      }
      function castPath(value, object) {
        if (isArray(value)) {
          return value;
        }
        return isKey(value, object) ? [value] : stringToPath(toString(value));
      }
      function toKey(value) {
        if (typeof value == "string" || isSymbol(value)) {
          return value;
        }
        var result = value + "";
        return result == "0" && 1 / value == -Infinity ? "-0" : result;
      }
      function baseGet(object, path) {
        path = castPath(path, object);
        var index = 0, length = path.length;
        while (object != null && index < length) {
          object = object[toKey(path[index++])];
        }
        return index && index == length ? object : void 0;
      }
      function get(object, path, defaultValue) {
        var result = object == null ? void 0 : baseGet(object, path);
        return result === void 0 ? defaultValue : result;
      }
      function arrayPush(array, values) {
        var index = -1, length = values.length, offset2 = array.length;
        while (++index < length) {
          array[offset2 + index] = values[index];
        }
        return array;
      }
      var spreadableSymbol = Symbol$1 ? Symbol$1.isConcatSpreadable : void 0;
      function isFlattenable(value) {
        return isArray(value) || isArguments(value) || !!(spreadableSymbol && value && value[spreadableSymbol]);
      }
      function baseFlatten(array, depth, predicate, isStrict, result) {
        var index = -1, length = array.length;
        predicate || (predicate = isFlattenable);
        result || (result = []);
        while (++index < length) {
          var value = array[index];
          if (predicate(value)) {
            {
              arrayPush(result, value);
            }
          } else {
            result[result.length] = value;
          }
        }
        return result;
      }
      function flatten(array) {
        var length = array == null ? 0 : array.length;
        return length ? baseFlatten(array) : [];
      }
      function flatRest(func) {
        return setToString(overRest(func, void 0, flatten), func + "");
      }
      var getPrototype = overArg(Object.getPrototypeOf, Object);
      var objectTag$3 = "[object Object]";
      var funcProto = Function.prototype, objectProto$4 = Object.prototype;
      var funcToString = funcProto.toString;
      var hasOwnProperty$4 = objectProto$4.hasOwnProperty;
      var objectCtorString = funcToString.call(Object);
      function isPlainObject(value) {
        if (!isObjectLike(value) || baseGetTag(value) != objectTag$3) {
          return false;
        }
        var proto = getPrototype(value);
        if (proto === null) {
          return true;
        }
        var Ctor = hasOwnProperty$4.call(proto, "constructor") && proto.constructor;
        return typeof Ctor == "function" && Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString;
      }
      function baseSlice(array, start2, end2) {
        var index = -1, length = array.length;
        if (start2 < 0) {
          start2 = -start2 > length ? 0 : length + start2;
        }
        end2 = end2 > length ? length : end2;
        if (end2 < 0) {
          end2 += length;
        }
        length = start2 > end2 ? 0 : end2 - start2 >>> 0;
        start2 >>>= 0;
        var result = Array(length);
        while (++index < length) {
          result[index] = array[index + start2];
        }
        return result;
      }
      function castSlice(array, start2, end2) {
        var length = array.length;
        end2 = end2 === void 0 ? length : end2;
        return !start2 && end2 >= length ? array : baseSlice(array, start2, end2);
      }
      var rsAstralRange$2 = "\\ud800-\\udfff", rsComboMarksRange$3 = "\\u0300-\\u036f", reComboHalfMarksRange$3 = "\\ufe20-\\ufe2f", rsComboSymbolsRange$3 = "\\u20d0-\\u20ff", rsComboRange$3 = rsComboMarksRange$3 + reComboHalfMarksRange$3 + rsComboSymbolsRange$3, rsVarRange$2 = "\\ufe0e\\ufe0f";
      var rsZWJ$2 = "\\u200d";
      var reHasUnicode = RegExp("[" + rsZWJ$2 + rsAstralRange$2 + rsComboRange$3 + rsVarRange$2 + "]");
      function hasUnicode(string) {
        return reHasUnicode.test(string);
      }
      function asciiToArray(string) {
        return string.split("");
      }
      var rsAstralRange$1 = "\\ud800-\\udfff", rsComboMarksRange$2 = "\\u0300-\\u036f", reComboHalfMarksRange$2 = "\\ufe20-\\ufe2f", rsComboSymbolsRange$2 = "\\u20d0-\\u20ff", rsComboRange$2 = rsComboMarksRange$2 + reComboHalfMarksRange$2 + rsComboSymbolsRange$2, rsVarRange$1 = "\\ufe0e\\ufe0f";
      var rsAstral = "[" + rsAstralRange$1 + "]", rsCombo$2 = "[" + rsComboRange$2 + "]", rsFitz$1 = "\\ud83c[\\udffb-\\udfff]", rsModifier$1 = "(?:" + rsCombo$2 + "|" + rsFitz$1 + ")", rsNonAstral$1 = "[^" + rsAstralRange$1 + "]", rsRegional$1 = "(?:\\ud83c[\\udde6-\\uddff]){2}", rsSurrPair$1 = "[\\ud800-\\udbff][\\udc00-\\udfff]", rsZWJ$1 = "\\u200d";
      var reOptMod$1 = rsModifier$1 + "?", rsOptVar$1 = "[" + rsVarRange$1 + "]?", rsOptJoin$1 = "(?:" + rsZWJ$1 + "(?:" + [rsNonAstral$1, rsRegional$1, rsSurrPair$1].join("|") + ")" + rsOptVar$1 + reOptMod$1 + ")*", rsSeq$1 = rsOptVar$1 + reOptMod$1 + rsOptJoin$1, rsSymbol = "(?:" + [rsNonAstral$1 + rsCombo$2 + "?", rsCombo$2, rsRegional$1, rsSurrPair$1, rsAstral].join("|") + ")";
      var reUnicode = RegExp(rsFitz$1 + "(?=" + rsFitz$1 + ")|" + rsSymbol + rsSeq$1, "g");
      function unicodeToArray(string) {
        return string.match(reUnicode) || [];
      }
      function stringToArray(string) {
        return hasUnicode(string) ? unicodeToArray(string) : asciiToArray(string);
      }
      function createCaseFirst(methodName) {
        return function(string) {
          string = toString(string);
          var strSymbols = hasUnicode(string) ? stringToArray(string) : void 0;
          var chr = strSymbols ? strSymbols[0] : string.charAt(0);
          var trailing = strSymbols ? castSlice(strSymbols, 1).join("") : string.slice(1);
          return chr[methodName]() + trailing;
        };
      }
      var upperFirst = createCaseFirst("toUpperCase");
      function capitalize(string) {
        return upperFirst(toString(string).toLowerCase());
      }
      function arrayReduce(array, iteratee, accumulator, initAccum) {
        var index = -1, length = array == null ? 0 : array.length;
        while (++index < length) {
          accumulator = iteratee(accumulator, array[index], index, array);
        }
        return accumulator;
      }
      function basePropertyOf(object) {
        return function(key2) {
          return object == null ? void 0 : object[key2];
        };
      }
      var deburredLetters = {
"À": "A",
        "Á": "A",
        "Â": "A",
        "Ã": "A",
        "Ä": "A",
        "Å": "A",
        "à": "a",
        "á": "a",
        "â": "a",
        "ã": "a",
        "ä": "a",
        "å": "a",
        "Ç": "C",
        "ç": "c",
        "Ð": "D",
        "ð": "d",
        "È": "E",
        "É": "E",
        "Ê": "E",
        "Ë": "E",
        "è": "e",
        "é": "e",
        "ê": "e",
        "ë": "e",
        "Ì": "I",
        "Í": "I",
        "Î": "I",
        "Ï": "I",
        "ì": "i",
        "í": "i",
        "î": "i",
        "ï": "i",
        "Ñ": "N",
        "ñ": "n",
        "Ò": "O",
        "Ó": "O",
        "Ô": "O",
        "Õ": "O",
        "Ö": "O",
        "Ø": "O",
        "ò": "o",
        "ó": "o",
        "ô": "o",
        "õ": "o",
        "ö": "o",
        "ø": "o",
        "Ù": "U",
        "Ú": "U",
        "Û": "U",
        "Ü": "U",
        "ù": "u",
        "ú": "u",
        "û": "u",
        "ü": "u",
        "Ý": "Y",
        "ý": "y",
        "ÿ": "y",
        "Æ": "Ae",
        "æ": "ae",
        "Þ": "Th",
        "þ": "th",
        "ß": "ss",
"Ā": "A",
        "Ă": "A",
        "Ą": "A",
        "ā": "a",
        "ă": "a",
        "ą": "a",
        "Ć": "C",
        "Ĉ": "C",
        "Ċ": "C",
        "Č": "C",
        "ć": "c",
        "ĉ": "c",
        "ċ": "c",
        "č": "c",
        "Ď": "D",
        "Đ": "D",
        "ď": "d",
        "đ": "d",
        "Ē": "E",
        "Ĕ": "E",
        "Ė": "E",
        "Ę": "E",
        "Ě": "E",
        "ē": "e",
        "ĕ": "e",
        "ė": "e",
        "ę": "e",
        "ě": "e",
        "Ĝ": "G",
        "Ğ": "G",
        "Ġ": "G",
        "Ģ": "G",
        "ĝ": "g",
        "ğ": "g",
        "ġ": "g",
        "ģ": "g",
        "Ĥ": "H",
        "Ħ": "H",
        "ĥ": "h",
        "ħ": "h",
        "Ĩ": "I",
        "Ī": "I",
        "Ĭ": "I",
        "Į": "I",
        "İ": "I",
        "ĩ": "i",
        "ī": "i",
        "ĭ": "i",
        "į": "i",
        "ı": "i",
        "Ĵ": "J",
        "ĵ": "j",
        "Ķ": "K",
        "ķ": "k",
        "ĸ": "k",
        "Ĺ": "L",
        "Ļ": "L",
        "Ľ": "L",
        "Ŀ": "L",
        "Ł": "L",
        "ĺ": "l",
        "ļ": "l",
        "ľ": "l",
        "ŀ": "l",
        "ł": "l",
        "Ń": "N",
        "Ņ": "N",
        "Ň": "N",
        "Ŋ": "N",
        "ń": "n",
        "ņ": "n",
        "ň": "n",
        "ŋ": "n",
        "Ō": "O",
        "Ŏ": "O",
        "Ő": "O",
        "ō": "o",
        "ŏ": "o",
        "ő": "o",
        "Ŕ": "R",
        "Ŗ": "R",
        "Ř": "R",
        "ŕ": "r",
        "ŗ": "r",
        "ř": "r",
        "Ś": "S",
        "Ŝ": "S",
        "Ş": "S",
        "Š": "S",
        "ś": "s",
        "ŝ": "s",
        "ş": "s",
        "š": "s",
        "Ţ": "T",
        "Ť": "T",
        "Ŧ": "T",
        "ţ": "t",
        "ť": "t",
        "ŧ": "t",
        "Ũ": "U",
        "Ū": "U",
        "Ŭ": "U",
        "Ů": "U",
        "Ű": "U",
        "Ų": "U",
        "ũ": "u",
        "ū": "u",
        "ŭ": "u",
        "ů": "u",
        "ű": "u",
        "ų": "u",
        "Ŵ": "W",
        "ŵ": "w",
        "Ŷ": "Y",
        "ŷ": "y",
        "Ÿ": "Y",
        "Ź": "Z",
        "Ż": "Z",
        "Ž": "Z",
        "ź": "z",
        "ż": "z",
        "ž": "z",
        "Ĳ": "IJ",
        "ĳ": "ij",
        "Œ": "Oe",
        "œ": "oe",
        "ŉ": "'n",
        "ſ": "s"
      };
      var deburrLetter = basePropertyOf(deburredLetters);
      var reLatin = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g;
      var rsComboMarksRange$1 = "\\u0300-\\u036f", reComboHalfMarksRange$1 = "\\ufe20-\\ufe2f", rsComboSymbolsRange$1 = "\\u20d0-\\u20ff", rsComboRange$1 = rsComboMarksRange$1 + reComboHalfMarksRange$1 + rsComboSymbolsRange$1;
      var rsCombo$1 = "[" + rsComboRange$1 + "]";
      var reComboMark = RegExp(rsCombo$1, "g");
      function deburr(string) {
        string = toString(string);
        return string && string.replace(reLatin, deburrLetter).replace(reComboMark, "");
      }
      var reAsciiWord = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g;
      function asciiWords(string) {
        return string.match(reAsciiWord) || [];
      }
      var reHasUnicodeWord = /[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/;
      function hasUnicodeWord(string) {
        return reHasUnicodeWord.test(string);
      }
      var rsAstralRange = "\\ud800-\\udfff", rsComboMarksRange = "\\u0300-\\u036f", reComboHalfMarksRange = "\\ufe20-\\ufe2f", rsComboSymbolsRange = "\\u20d0-\\u20ff", rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange, rsDingbatRange = "\\u2700-\\u27bf", rsLowerRange = "a-z\\xdf-\\xf6\\xf8-\\xff", rsMathOpRange = "\\xac\\xb1\\xd7\\xf7", rsNonCharRange = "\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf", rsPunctuationRange = "\\u2000-\\u206f", rsSpaceRange = " \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000", rsUpperRange = "A-Z\\xc0-\\xd6\\xd8-\\xde", rsVarRange = "\\ufe0e\\ufe0f", rsBreakRange = rsMathOpRange + rsNonCharRange + rsPunctuationRange + rsSpaceRange;
      var rsApos$1 = "['’]", rsBreak = "[" + rsBreakRange + "]", rsCombo = "[" + rsComboRange + "]", rsDigits = "\\d+", rsDingbat = "[" + rsDingbatRange + "]", rsLower = "[" + rsLowerRange + "]", rsMisc = "[^" + rsAstralRange + rsBreakRange + rsDigits + rsDingbatRange + rsLowerRange + rsUpperRange + "]", rsFitz = "\\ud83c[\\udffb-\\udfff]", rsModifier = "(?:" + rsCombo + "|" + rsFitz + ")", rsNonAstral = "[^" + rsAstralRange + "]", rsRegional = "(?:\\ud83c[\\udde6-\\uddff]){2}", rsSurrPair = "[\\ud800-\\udbff][\\udc00-\\udfff]", rsUpper = "[" + rsUpperRange + "]", rsZWJ = "\\u200d";
      var rsMiscLower = "(?:" + rsLower + "|" + rsMisc + ")", rsMiscUpper = "(?:" + rsUpper + "|" + rsMisc + ")", rsOptContrLower = "(?:" + rsApos$1 + "(?:d|ll|m|re|s|t|ve))?", rsOptContrUpper = "(?:" + rsApos$1 + "(?:D|LL|M|RE|S|T|VE))?", reOptMod = rsModifier + "?", rsOptVar = "[" + rsVarRange + "]?", rsOptJoin = "(?:" + rsZWJ + "(?:" + [rsNonAstral, rsRegional, rsSurrPair].join("|") + ")" + rsOptVar + reOptMod + ")*", rsOrdLower = "\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])", rsOrdUpper = "\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])", rsSeq = rsOptVar + reOptMod + rsOptJoin, rsEmoji = "(?:" + [rsDingbat, rsRegional, rsSurrPair].join("|") + ")" + rsSeq;
      var reUnicodeWord = RegExp([
        rsUpper + "?" + rsLower + "+" + rsOptContrLower + "(?=" + [rsBreak, rsUpper, "$"].join("|") + ")",
        rsMiscUpper + "+" + rsOptContrUpper + "(?=" + [rsBreak, rsUpper + rsMiscLower, "$"].join("|") + ")",
        rsUpper + "?" + rsMiscLower + "+" + rsOptContrLower,
        rsUpper + "+" + rsOptContrUpper,
        rsOrdUpper,
        rsOrdLower,
        rsDigits,
        rsEmoji
      ].join("|"), "g");
      function unicodeWords(string) {
        return string.match(reUnicodeWord) || [];
      }
      function words(string, pattern, guard) {
        string = toString(string);
        pattern = pattern;
        if (pattern === void 0) {
          return hasUnicodeWord(string) ? unicodeWords(string) : asciiWords(string);
        }
        return string.match(pattern) || [];
      }
      var rsApos = "['’]";
      var reApos = RegExp(rsApos, "g");
      function createCompounder(callback) {
        return function(string) {
          return arrayReduce(words(deburr(string).replace(reApos, "")), callback, "");
        };
      }
      var camelCase = createCompounder(function(result, word, index) {
        word = word.toLowerCase();
        return result + (index ? capitalize(word) : word);
      });
      function stackClear() {
        this.__data__ = new ListCache();
        this.size = 0;
      }
      function stackDelete(key2) {
        var data = this.__data__, result = data["delete"](key2);
        this.size = data.size;
        return result;
      }
      function stackGet(key2) {
        return this.__data__.get(key2);
      }
      function stackHas(key2) {
        return this.__data__.has(key2);
      }
      var LARGE_ARRAY_SIZE = 200;
      function stackSet(key2, value) {
        var data = this.__data__;
        if (data instanceof ListCache) {
          var pairs = data.__data__;
          if (!Map$1 || pairs.length < LARGE_ARRAY_SIZE - 1) {
            pairs.push([key2, value]);
            this.size = ++data.size;
            return this;
          }
          data = this.__data__ = new MapCache(pairs);
        }
        data.set(key2, value);
        this.size = data.size;
        return this;
      }
      function Stack(entries) {
        var data = this.__data__ = new ListCache(entries);
        this.size = data.size;
      }
      Stack.prototype.clear = stackClear;
      Stack.prototype["delete"] = stackDelete;
      Stack.prototype.get = stackGet;
      Stack.prototype.has = stackHas;
      Stack.prototype.set = stackSet;
      var freeExports = typeof exports == "object" && exports && !exports.nodeType && exports;
      var freeModule = freeExports && typeof module == "object" && module && !module.nodeType && module;
      var moduleExports = freeModule && freeModule.exports === freeExports;
      var Buffer2 = moduleExports ? root$1.Buffer : void 0, allocUnsafe = Buffer2 ? Buffer2.allocUnsafe : void 0;
      function cloneBuffer(buffer, isDeep) {
        if (isDeep) {
          return buffer.slice();
        }
        var length = buffer.length, result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);
        buffer.copy(result);
        return result;
      }
      function arrayFilter(array, predicate) {
        var index = -1, length = array == null ? 0 : array.length, resIndex = 0, result = [];
        while (++index < length) {
          var value = array[index];
          if (predicate(value, index, array)) {
            result[resIndex++] = value;
          }
        }
        return result;
      }
      function stubArray() {
        return [];
      }
      var objectProto$3 = Object.prototype;
      var propertyIsEnumerable = objectProto$3.propertyIsEnumerable;
      var nativeGetSymbols$1 = Object.getOwnPropertySymbols;
      var getSymbols = !nativeGetSymbols$1 ? stubArray : function(object) {
        if (object == null) {
          return [];
        }
        object = Object(object);
        return arrayFilter(nativeGetSymbols$1(object), function(symbol) {
          return propertyIsEnumerable.call(object, symbol);
        });
      };
      var nativeGetSymbols = Object.getOwnPropertySymbols;
      var getSymbolsIn = !nativeGetSymbols ? stubArray : function(object) {
        var result = [];
        while (object) {
          arrayPush(result, getSymbols(object));
          object = getPrototype(object);
        }
        return result;
      };
      function baseGetAllKeys(object, keysFunc, symbolsFunc) {
        var result = keysFunc(object);
        return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
      }
      function getAllKeys(object) {
        return baseGetAllKeys(object, keys, getSymbols);
      }
      function getAllKeysIn(object) {
        return baseGetAllKeys(object, keysIn, getSymbolsIn);
      }
      var DataView = getNative(root$1, "DataView");
      var Promise$1 = getNative(root$1, "Promise");
      var Set$1 = getNative(root$1, "Set");
      var mapTag$4 = "[object Map]", objectTag$2 = "[object Object]", promiseTag = "[object Promise]", setTag$4 = "[object Set]", weakMapTag$1 = "[object WeakMap]";
      var dataViewTag$3 = "[object DataView]";
      var dataViewCtorString = toSource(DataView), mapCtorString = toSource(Map$1), promiseCtorString = toSource(Promise$1), setCtorString = toSource(Set$1), weakMapCtorString = toSource(WeakMap$1);
      var getTag = baseGetTag;
      if (DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag$3 || Map$1 && getTag(new Map$1()) != mapTag$4 || Promise$1 && getTag(Promise$1.resolve()) != promiseTag || Set$1 && getTag(new Set$1()) != setTag$4 || WeakMap$1 && getTag(new WeakMap$1()) != weakMapTag$1) {
        getTag = function(value) {
          var result = baseGetTag(value), Ctor = result == objectTag$2 ? value.constructor : void 0, ctorString = Ctor ? toSource(Ctor) : "";
          if (ctorString) {
            switch (ctorString) {
              case dataViewCtorString:
                return dataViewTag$3;
              case mapCtorString:
                return mapTag$4;
              case promiseCtorString:
                return promiseTag;
              case setCtorString:
                return setTag$4;
              case weakMapCtorString:
                return weakMapTag$1;
            }
          }
          return result;
        };
      }
      var objectProto$2 = Object.prototype;
      var hasOwnProperty$3 = objectProto$2.hasOwnProperty;
      function initCloneArray(array) {
        var length = array.length, result = new array.constructor(length);
        if (length && typeof array[0] == "string" && hasOwnProperty$3.call(array, "index")) {
          result.index = array.index;
          result.input = array.input;
        }
        return result;
      }
      var Uint8Array2 = root$1.Uint8Array;
      function cloneArrayBuffer(arrayBuffer) {
        var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
        new Uint8Array2(result).set(new Uint8Array2(arrayBuffer));
        return result;
      }
      function cloneDataView(dataView, isDeep) {
        var buffer = cloneArrayBuffer(dataView.buffer);
        return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
      }
      var reFlags = /\w*$/;
      function cloneRegExp(regexp) {
        var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
        result.lastIndex = regexp.lastIndex;
        return result;
      }
      var symbolProto$1 = Symbol$1 ? Symbol$1.prototype : void 0, symbolValueOf$1 = symbolProto$1 ? symbolProto$1.valueOf : void 0;
      function cloneSymbol(symbol) {
        return symbolValueOf$1 ? Object(symbolValueOf$1.call(symbol)) : {};
      }
      function cloneTypedArray(typedArray, isDeep) {
        var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
        return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
      }
      var boolTag$3 = "[object Boolean]", dateTag$2 = "[object Date]", mapTag$3 = "[object Map]", numberTag$3 = "[object Number]", regexpTag$2 = "[object RegExp]", setTag$3 = "[object Set]", stringTag$3 = "[object String]", symbolTag$2 = "[object Symbol]";
      var arrayBufferTag$2 = "[object ArrayBuffer]", dataViewTag$2 = "[object DataView]", float32Tag$1 = "[object Float32Array]", float64Tag$1 = "[object Float64Array]", int8Tag$1 = "[object Int8Array]", int16Tag$1 = "[object Int16Array]", int32Tag$1 = "[object Int32Array]", uint8Tag$1 = "[object Uint8Array]", uint8ClampedTag$1 = "[object Uint8ClampedArray]", uint16Tag$1 = "[object Uint16Array]", uint32Tag$1 = "[object Uint32Array]";
      function initCloneByTag(object, tag, isDeep) {
        var Ctor = object.constructor;
        switch (tag) {
          case arrayBufferTag$2:
            return cloneArrayBuffer(object);
          case boolTag$3:
          case dateTag$2:
            return new Ctor(+object);
          case dataViewTag$2:
            return cloneDataView(object);
          case float32Tag$1:
          case float64Tag$1:
          case int8Tag$1:
          case int16Tag$1:
          case int32Tag$1:
          case uint8Tag$1:
          case uint8ClampedTag$1:
          case uint16Tag$1:
          case uint32Tag$1:
            return cloneTypedArray(object, isDeep);
          case mapTag$3:
            return new Ctor();
          case numberTag$3:
          case stringTag$3:
            return new Ctor(object);
          case regexpTag$2:
            return cloneRegExp(object);
          case setTag$3:
            return new Ctor();
          case symbolTag$2:
            return cloneSymbol(object);
        }
      }
      function initCloneObject(object) {
        return typeof object.constructor == "function" && !isPrototype(object) ? baseCreate(getPrototype(object)) : {};
      }
      var mapTag$2 = "[object Map]";
      function baseIsMap(value) {
        return isObjectLike(value) && getTag(value) == mapTag$2;
      }
      var nodeIsMap = nodeUtil && nodeUtil.isMap;
      var isMap = nodeIsMap ? baseUnary(nodeIsMap) : baseIsMap;
      var setTag$2 = "[object Set]";
      function baseIsSet(value) {
        return isObjectLike(value) && getTag(value) == setTag$2;
      }
      var nodeIsSet = nodeUtil && nodeUtil.isSet;
      var isSet = nodeIsSet ? baseUnary(nodeIsSet) : baseIsSet;
      var CLONE_DEEP_FLAG$1 = 1;
      var argsTag$1 = "[object Arguments]", arrayTag$1 = "[object Array]", boolTag$2 = "[object Boolean]", dateTag$1 = "[object Date]", errorTag$1 = "[object Error]", funcTag = "[object Function]", genTag = "[object GeneratorFunction]", mapTag$1 = "[object Map]", numberTag$2 = "[object Number]", objectTag$1 = "[object Object]", regexpTag$1 = "[object RegExp]", setTag$1 = "[object Set]", stringTag$2 = "[object String]", symbolTag$1 = "[object Symbol]", weakMapTag = "[object WeakMap]";
      var arrayBufferTag$1 = "[object ArrayBuffer]", dataViewTag$1 = "[object DataView]", float32Tag = "[object Float32Array]", float64Tag = "[object Float64Array]", int8Tag = "[object Int8Array]", int16Tag = "[object Int16Array]", int32Tag = "[object Int32Array]", uint8Tag = "[object Uint8Array]", uint8ClampedTag = "[object Uint8ClampedArray]", uint16Tag = "[object Uint16Array]", uint32Tag = "[object Uint32Array]";
      var cloneableTags = {};
      cloneableTags[argsTag$1] = cloneableTags[arrayTag$1] = cloneableTags[arrayBufferTag$1] = cloneableTags[dataViewTag$1] = cloneableTags[boolTag$2] = cloneableTags[dateTag$1] = cloneableTags[float32Tag] = cloneableTags[float64Tag] = cloneableTags[int8Tag] = cloneableTags[int16Tag] = cloneableTags[int32Tag] = cloneableTags[mapTag$1] = cloneableTags[numberTag$2] = cloneableTags[objectTag$1] = cloneableTags[regexpTag$1] = cloneableTags[setTag$1] = cloneableTags[stringTag$2] = cloneableTags[symbolTag$1] = cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] = cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
      cloneableTags[errorTag$1] = cloneableTags[funcTag] = cloneableTags[weakMapTag] = false;
      function baseClone(value, bitmask, customizer, key2, object, stack) {
        var result, isDeep = bitmask & CLONE_DEEP_FLAG$1;
        if (customizer) {
          result = object ? customizer(value, key2, object, stack) : customizer(value);
        }
        if (result !== void 0) {
          return result;
        }
        if (!isObject(value)) {
          return value;
        }
        var isArr = isArray(value);
        if (isArr) {
          result = initCloneArray(value);
        } else {
          var tag = getTag(value), isFunc = tag == funcTag || tag == genTag;
          if (isBuffer(value)) {
            return cloneBuffer(value, isDeep);
          }
          if (tag == objectTag$1 || tag == argsTag$1 || isFunc && !object) {
            result = {};
          } else {
            if (!cloneableTags[tag]) {
              return object ? value : {};
            }
            result = initCloneByTag(value, tag, isDeep);
          }
        }
        stack || (stack = new Stack());
        var stacked = stack.get(value);
        if (stacked) {
          return stacked;
        }
        stack.set(value, result);
        if (isSet(value)) {
          value.forEach(function(subValue) {
            result.add(baseClone(subValue, bitmask, customizer, subValue, value, stack));
          });
        } else if (isMap(value)) {
          value.forEach(function(subValue, key3) {
            result.set(key3, baseClone(subValue, bitmask, customizer, key3, value, stack));
          });
        }
        var keysFunc = getAllKeysIn;
        var props2 = isArr ? void 0 : keysFunc(value);
        arrayEach(props2 || value, function(subValue, key3) {
          if (props2) {
            key3 = subValue;
            subValue = value[key3];
          }
          assignValue(result, key3, baseClone(subValue, bitmask, customizer, key3, value, stack));
        });
        return result;
      }
      var HASH_UNDEFINED = "__lodash_hash_undefined__";
      function setCacheAdd(value) {
        this.__data__.set(value, HASH_UNDEFINED);
        return this;
      }
      function setCacheHas(value) {
        return this.__data__.has(value);
      }
      function SetCache(values) {
        var index = -1, length = values == null ? 0 : values.length;
        this.__data__ = new MapCache();
        while (++index < length) {
          this.add(values[index]);
        }
      }
      SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
      SetCache.prototype.has = setCacheHas;
      function arraySome(array, predicate) {
        var index = -1, length = array == null ? 0 : array.length;
        while (++index < length) {
          if (predicate(array[index], index, array)) {
            return true;
          }
        }
        return false;
      }
      function cacheHas(cache, key2) {
        return cache.has(key2);
      }
      var COMPARE_PARTIAL_FLAG$5 = 1, COMPARE_UNORDERED_FLAG$3 = 2;
      function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
        var isPartial = bitmask & COMPARE_PARTIAL_FLAG$5, arrLength = array.length, othLength = other.length;
        if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
          return false;
        }
        var arrStacked = stack.get(array);
        var othStacked = stack.get(other);
        if (arrStacked && othStacked) {
          return arrStacked == other && othStacked == array;
        }
        var index = -1, result = true, seen = bitmask & COMPARE_UNORDERED_FLAG$3 ? new SetCache() : void 0;
        stack.set(array, other);
        stack.set(other, array);
        while (++index < arrLength) {
          var arrValue = array[index], othValue = other[index];
          if (customizer) {
            var compared = isPartial ? customizer(othValue, arrValue, index, other, array, stack) : customizer(arrValue, othValue, index, array, other, stack);
          }
          if (compared !== void 0) {
            if (compared) {
              continue;
            }
            result = false;
            break;
          }
          if (seen) {
            if (!arraySome(other, function(othValue2, othIndex) {
              if (!cacheHas(seen, othIndex) && (arrValue === othValue2 || equalFunc(arrValue, othValue2, bitmask, customizer, stack))) {
                return seen.push(othIndex);
              }
            })) {
              result = false;
              break;
            }
          } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
            result = false;
            break;
          }
        }
        stack["delete"](array);
        stack["delete"](other);
        return result;
      }
      function mapToArray(map) {
        var index = -1, result = Array(map.size);
        map.forEach(function(value, key2) {
          result[++index] = [key2, value];
        });
        return result;
      }
      function setToArray(set) {
        var index = -1, result = Array(set.size);
        set.forEach(function(value) {
          result[++index] = value;
        });
        return result;
      }
      var COMPARE_PARTIAL_FLAG$4 = 1, COMPARE_UNORDERED_FLAG$2 = 2;
      var boolTag$1 = "[object Boolean]", dateTag = "[object Date]", errorTag = "[object Error]", mapTag = "[object Map]", numberTag$1 = "[object Number]", regexpTag = "[object RegExp]", setTag = "[object Set]", stringTag$1 = "[object String]", symbolTag = "[object Symbol]";
      var arrayBufferTag = "[object ArrayBuffer]", dataViewTag = "[object DataView]";
      var symbolProto = Symbol$1 ? Symbol$1.prototype : void 0, symbolValueOf = symbolProto ? symbolProto.valueOf : void 0;
      function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
        switch (tag) {
          case dataViewTag:
            if (object.byteLength != other.byteLength || object.byteOffset != other.byteOffset) {
              return false;
            }
            object = object.buffer;
            other = other.buffer;
          case arrayBufferTag:
            if (object.byteLength != other.byteLength || !equalFunc(new Uint8Array2(object), new Uint8Array2(other))) {
              return false;
            }
            return true;
          case boolTag$1:
          case dateTag:
          case numberTag$1:
            return eq(+object, +other);
          case errorTag:
            return object.name == other.name && object.message == other.message;
          case regexpTag:
          case stringTag$1:
            return object == other + "";
          case mapTag:
            var convert = mapToArray;
          case setTag:
            var isPartial = bitmask & COMPARE_PARTIAL_FLAG$4;
            convert || (convert = setToArray);
            if (object.size != other.size && !isPartial) {
              return false;
            }
            var stacked = stack.get(object);
            if (stacked) {
              return stacked == other;
            }
            bitmask |= COMPARE_UNORDERED_FLAG$2;
            stack.set(object, other);
            var result = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
            stack["delete"](object);
            return result;
          case symbolTag:
            if (symbolValueOf) {
              return symbolValueOf.call(object) == symbolValueOf.call(other);
            }
        }
        return false;
      }
      var COMPARE_PARTIAL_FLAG$3 = 1;
      var objectProto$1 = Object.prototype;
      var hasOwnProperty$2 = objectProto$1.hasOwnProperty;
      function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
        var isPartial = bitmask & COMPARE_PARTIAL_FLAG$3, objProps = getAllKeys(object), objLength = objProps.length, othProps = getAllKeys(other), othLength = othProps.length;
        if (objLength != othLength && !isPartial) {
          return false;
        }
        var index = objLength;
        while (index--) {
          var key2 = objProps[index];
          if (!(isPartial ? key2 in other : hasOwnProperty$2.call(other, key2))) {
            return false;
          }
        }
        var objStacked = stack.get(object);
        var othStacked = stack.get(other);
        if (objStacked && othStacked) {
          return objStacked == other && othStacked == object;
        }
        var result = true;
        stack.set(object, other);
        stack.set(other, object);
        var skipCtor = isPartial;
        while (++index < objLength) {
          key2 = objProps[index];
          var objValue = object[key2], othValue = other[key2];
          if (customizer) {
            var compared = isPartial ? customizer(othValue, objValue, key2, other, object, stack) : customizer(objValue, othValue, key2, object, other, stack);
          }
          if (!(compared === void 0 ? objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack) : compared)) {
            result = false;
            break;
          }
          skipCtor || (skipCtor = key2 == "constructor");
        }
        if (result && !skipCtor) {
          var objCtor = object.constructor, othCtor = other.constructor;
          if (objCtor != othCtor && ("constructor" in object && "constructor" in other) && !(typeof objCtor == "function" && objCtor instanceof objCtor && typeof othCtor == "function" && othCtor instanceof othCtor)) {
            result = false;
          }
        }
        stack["delete"](object);
        stack["delete"](other);
        return result;
      }
      var COMPARE_PARTIAL_FLAG$2 = 1;
      var argsTag = "[object Arguments]", arrayTag = "[object Array]", objectTag = "[object Object]";
      var objectProto = Object.prototype;
      var hasOwnProperty$1 = objectProto.hasOwnProperty;
      function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
        var objIsArr = isArray(object), othIsArr = isArray(other), objTag = objIsArr ? arrayTag : getTag(object), othTag = othIsArr ? arrayTag : getTag(other);
        objTag = objTag == argsTag ? objectTag : objTag;
        othTag = othTag == argsTag ? objectTag : othTag;
        var objIsObj = objTag == objectTag, othIsObj = othTag == objectTag, isSameTag = objTag == othTag;
        if (isSameTag && isBuffer(object)) {
          if (!isBuffer(other)) {
            return false;
          }
          objIsArr = true;
          objIsObj = false;
        }
        if (isSameTag && !objIsObj) {
          stack || (stack = new Stack());
          return objIsArr || isTypedArray(object) ? equalArrays(object, other, bitmask, customizer, equalFunc, stack) : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
        }
        if (!(bitmask & COMPARE_PARTIAL_FLAG$2)) {
          var objIsWrapped = objIsObj && hasOwnProperty$1.call(object, "__wrapped__"), othIsWrapped = othIsObj && hasOwnProperty$1.call(other, "__wrapped__");
          if (objIsWrapped || othIsWrapped) {
            var objUnwrapped = objIsWrapped ? object.value() : object, othUnwrapped = othIsWrapped ? other.value() : other;
            stack || (stack = new Stack());
            return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
          }
        }
        if (!isSameTag) {
          return false;
        }
        stack || (stack = new Stack());
        return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
      }
      function baseIsEqual(value, other, bitmask, customizer, stack) {
        if (value === other) {
          return true;
        }
        if (value == null || other == null || !isObjectLike(value) && !isObjectLike(other)) {
          return value !== value && other !== other;
        }
        return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
      }
      var COMPARE_PARTIAL_FLAG$1 = 1, COMPARE_UNORDERED_FLAG$1 = 2;
      function baseIsMatch(object, source, matchData, customizer) {
        var index = matchData.length, length = index;
        if (object == null) {
          return !length;
        }
        object = Object(object);
        while (index--) {
          var data = matchData[index];
          if (data[2] ? data[1] !== object[data[0]] : !(data[0] in object)) {
            return false;
          }
        }
        while (++index < length) {
          data = matchData[index];
          var key2 = data[0], objValue = object[key2], srcValue = data[1];
          if (data[2]) {
            if (objValue === void 0 && !(key2 in object)) {
              return false;
            }
          } else {
            var stack = new Stack();
            var result;
            if (!(result === void 0 ? baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG$1 | COMPARE_UNORDERED_FLAG$1, customizer, stack) : result)) {
              return false;
            }
          }
        }
        return true;
      }
      function isStrictComparable(value) {
        return value === value && !isObject(value);
      }
      function getMatchData(object) {
        var result = keys(object), length = result.length;
        while (length--) {
          var key2 = result[length], value = object[key2];
          result[length] = [key2, value, isStrictComparable(value)];
        }
        return result;
      }
      function matchesStrictComparable(key2, srcValue) {
        return function(object) {
          if (object == null) {
            return false;
          }
          return object[key2] === srcValue && (srcValue !== void 0 || key2 in Object(object));
        };
      }
      function baseMatches(source) {
        var matchData = getMatchData(source);
        if (matchData.length == 1 && matchData[0][2]) {
          return matchesStrictComparable(matchData[0][0], matchData[0][1]);
        }
        return function(object) {
          return object === source || baseIsMatch(object, source, matchData);
        };
      }
      function baseHasIn(object, key2) {
        return object != null && key2 in Object(object);
      }
      function hasPath(object, path, hasFunc) {
        path = castPath(path, object);
        var index = -1, length = path.length, result = false;
        while (++index < length) {
          var key2 = toKey(path[index]);
          if (!(result = object != null && hasFunc(object, key2))) {
            break;
          }
          object = object[key2];
        }
        if (result || ++index != length) {
          return result;
        }
        length = object == null ? 0 : object.length;
        return !!length && isLength(length) && isIndex(key2, length) && (isArray(object) || isArguments(object));
      }
      function hasIn(object, path) {
        return object != null && hasPath(object, path, baseHasIn);
      }
      var COMPARE_PARTIAL_FLAG = 1, COMPARE_UNORDERED_FLAG = 2;
      function baseMatchesProperty(path, srcValue) {
        if (isKey(path) && isStrictComparable(srcValue)) {
          return matchesStrictComparable(toKey(path), srcValue);
        }
        return function(object) {
          var objValue = get(object, path);
          return objValue === void 0 && objValue === srcValue ? hasIn(object, path) : baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG);
        };
      }
      function baseProperty(key2) {
        return function(object) {
          return object == null ? void 0 : object[key2];
        };
      }
      function basePropertyDeep(path) {
        return function(object) {
          return baseGet(object, path);
        };
      }
      function property(path) {
        return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
      }
      function baseIteratee(value) {
        if (typeof value == "function") {
          return value;
        }
        if (value == null) {
          return identity;
        }
        if (typeof value == "object") {
          return isArray(value) ? baseMatchesProperty(value[0], value[1]) : baseMatches(value);
        }
        return property(value);
      }
      function createBaseFor(fromRight) {
        return function(object, iteratee, keysFunc) {
          var index = -1, iterable = Object(object), props2 = keysFunc(object), length = props2.length;
          while (length--) {
            var key2 = props2[++index];
            if (iteratee(iterable[key2], key2, iterable) === false) {
              break;
            }
          }
          return object;
        };
      }
      var baseFor = createBaseFor();
      function baseForOwn(object, iteratee) {
        return object && baseFor(object, iteratee, keys);
      }
      var now$1 = function() {
        return root$1.Date.now();
      };
      var FUNC_ERROR_TEXT$1 = "Expected a function";
      var nativeMax$1 = Math.max, nativeMin$1 = Math.min;
      function debounce$1(func, wait, options) {
        var lastArgs, lastThis, maxWait, result, timerId, lastCallTime, lastInvokeTime = 0, leading = false, maxing = false, trailing = true;
        if (typeof func != "function") {
          throw new TypeError(FUNC_ERROR_TEXT$1);
        }
        wait = toNumber(wait) || 0;
        if (isObject(options)) {
          leading = !!options.leading;
          maxing = "maxWait" in options;
          maxWait = maxing ? nativeMax$1(toNumber(options.maxWait) || 0, wait) : maxWait;
          trailing = "trailing" in options ? !!options.trailing : trailing;
        }
        function invokeFunc(time) {
          var args = lastArgs, thisArg = lastThis;
          lastArgs = lastThis = void 0;
          lastInvokeTime = time;
          result = func.apply(thisArg, args);
          return result;
        }
        function leadingEdge(time) {
          lastInvokeTime = time;
          timerId = setTimeout(timerExpired, wait);
          return leading ? invokeFunc(time) : result;
        }
        function remainingWait(time) {
          var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime, timeWaiting = wait - timeSinceLastCall;
          return maxing ? nativeMin$1(timeWaiting, maxWait - timeSinceLastInvoke) : timeWaiting;
        }
        function shouldInvoke(time) {
          var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime;
          return lastCallTime === void 0 || timeSinceLastCall >= wait || timeSinceLastCall < 0 || maxing && timeSinceLastInvoke >= maxWait;
        }
        function timerExpired() {
          var time = now$1();
          if (shouldInvoke(time)) {
            return trailingEdge(time);
          }
          timerId = setTimeout(timerExpired, remainingWait(time));
        }
        function trailingEdge(time) {
          timerId = void 0;
          if (trailing && lastArgs) {
            return invokeFunc(time);
          }
          lastArgs = lastThis = void 0;
          return result;
        }
        function cancel() {
          if (timerId !== void 0) {
            clearTimeout(timerId);
          }
          lastInvokeTime = 0;
          lastArgs = lastCallTime = lastThis = timerId = void 0;
        }
        function flush() {
          return timerId === void 0 ? result : trailingEdge(now$1());
        }
        function debounced() {
          var time = now$1(), isInvoking = shouldInvoke(time);
          lastArgs = arguments;
          lastThis = this;
          lastCallTime = time;
          if (isInvoking) {
            if (timerId === void 0) {
              return leadingEdge(lastCallTime);
            }
            if (maxing) {
              clearTimeout(timerId);
              timerId = setTimeout(timerExpired, wait);
              return invokeFunc(lastCallTime);
            }
          }
          if (timerId === void 0) {
            timerId = setTimeout(timerExpired, wait);
          }
          return result;
        }
        debounced.cancel = cancel;
        debounced.flush = flush;
        return debounced;
      }
      function assignMergeValue(object, key2, value) {
        if (value !== void 0 && !eq(object[key2], value) || value === void 0 && !(key2 in object)) {
          baseAssignValue(object, key2, value);
        }
      }
      function isArrayLikeObject(value) {
        return isObjectLike(value) && isArrayLike(value);
      }
      function safeGet(object, key2) {
        if (key2 === "constructor" && typeof object[key2] === "function") {
          return;
        }
        if (key2 == "__proto__") {
          return;
        }
        return object[key2];
      }
      function toPlainObject(value) {
        return copyObject(value, keysIn(value));
      }
      function baseMergeDeep(object, source, key2, srcIndex, mergeFunc, customizer, stack) {
        var objValue = safeGet(object, key2), srcValue = safeGet(source, key2), stacked = stack.get(srcValue);
        if (stacked) {
          assignMergeValue(object, key2, stacked);
          return;
        }
        var newValue = customizer ? customizer(objValue, srcValue, key2 + "", object, source, stack) : void 0;
        var isCommon = newValue === void 0;
        if (isCommon) {
          var isArr = isArray(srcValue), isBuff = !isArr && isBuffer(srcValue), isTyped = !isArr && !isBuff && isTypedArray(srcValue);
          newValue = srcValue;
          if (isArr || isBuff || isTyped) {
            if (isArray(objValue)) {
              newValue = objValue;
            } else if (isArrayLikeObject(objValue)) {
              newValue = copyArray(objValue);
            } else if (isBuff) {
              isCommon = false;
              newValue = cloneBuffer(srcValue, true);
            } else if (isTyped) {
              isCommon = false;
              newValue = cloneTypedArray(srcValue, true);
            } else {
              newValue = [];
            }
          } else if (isPlainObject(srcValue) || isArguments(srcValue)) {
            newValue = objValue;
            if (isArguments(objValue)) {
              newValue = toPlainObject(objValue);
            } else if (!isObject(objValue) || isFunction(objValue)) {
              newValue = initCloneObject(srcValue);
            }
          } else {
            isCommon = false;
          }
        }
        if (isCommon) {
          stack.set(srcValue, newValue);
          mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
          stack["delete"](srcValue);
        }
        assignMergeValue(object, key2, newValue);
      }
      function baseMerge(object, source, srcIndex, customizer, stack) {
        if (object === source) {
          return;
        }
        baseFor(source, function(srcValue, key2) {
          stack || (stack = new Stack());
          if (isObject(srcValue)) {
            baseMergeDeep(object, source, key2, srcIndex, baseMerge, customizer, stack);
          } else {
            var newValue = customizer ? customizer(safeGet(object, key2), srcValue, key2 + "", object, source, stack) : void 0;
            if (newValue === void 0) {
              newValue = srcValue;
            }
            assignMergeValue(object, key2, newValue);
          }
        }, keysIn);
      }
      function last$1(array) {
        var length = array == null ? 0 : array.length;
        return length ? array[length - 1] : void 0;
      }
      function baseGt(value, other) {
        return value > other;
      }
      var nativeMax = Math.max, nativeMin = Math.min;
      function baseInRange(number, start2, end2) {
        return number >= nativeMin(start2, end2) && number < nativeMax(start2, end2);
      }
      function inRange(number, start2, end2) {
        start2 = toFinite(start2);
        if (end2 === void 0) {
          end2 = start2;
          start2 = 0;
        } else {
          end2 = toFinite(end2);
        }
        number = toNumber(number);
        return baseInRange(number, start2, end2);
      }
      var stringTag = "[object String]";
      function isString(value) {
        return typeof value == "string" || !isArray(value) && isObjectLike(value) && baseGetTag(value) == stringTag;
      }
      function parent(object, path) {
        return path.length < 2 ? object : baseGet(object, baseSlice(path, 0, -1));
      }
      var boolTag = "[object Boolean]";
      function isBoolean(value) {
        return value === true || value === false || isObjectLike(value) && baseGetTag(value) == boolTag;
      }
      function isEqual(value, other) {
        return baseIsEqual(value, other);
      }
      var numberTag = "[object Number]";
      function isNumber(value) {
        return typeof value == "number" || isObjectLike(value) && baseGetTag(value) == numberTag;
      }
      function isNull(value) {
        return value === null;
      }
      function isUndefined(value) {
        return value === void 0;
      }
      var kebabCase = createCompounder(function(result, word, index) {
        return result + (index ? "-" : "") + word.toLowerCase();
      });
      function baseLt(value, other) {
        return value < other;
      }
      function mapKeys(object, iteratee) {
        var result = {};
        iteratee = baseIteratee(iteratee);
        baseForOwn(object, function(value, key2, object2) {
          baseAssignValue(result, iteratee(value, key2, object2), value);
        });
        return result;
      }
      function baseExtremum(array, iteratee, comparator) {
        var index = -1, length = array.length;
        while (++index < length) {
          var value = array[index], current = iteratee(value);
          if (current != null && (computed2 === void 0 ? current === current && !isSymbol(current) : comparator(current, computed2))) {
            var computed2 = current, result = value;
          }
        }
        return result;
      }
      function max$1(array) {
        return array && array.length ? baseExtremum(array, identity, baseGt) : void 0;
      }
      function baseSum(array, iteratee) {
        var result, index = -1, length = array.length;
        while (++index < length) {
          var current = iteratee(array[index]);
          if (current !== void 0) {
            result = result === void 0 ? current : result + current;
          }
        }
        return result;
      }
      var merge = createAssigner(function(object, source, srcIndex) {
        baseMerge(object, source, srcIndex);
      });
      function min$1(array) {
        return array && array.length ? baseExtremum(array, identity, baseLt) : void 0;
      }
      function baseUnset(object, path) {
        path = castPath(path, object);
        object = parent(object, path);
        return object == null || delete object[toKey(last$1(path))];
      }
      function customOmitClone(value) {
        return isPlainObject(value) ? void 0 : value;
      }
      var CLONE_DEEP_FLAG = 1, CLONE_FLAT_FLAG = 2, CLONE_SYMBOLS_FLAG = 4;
      var omit = flatRest(function(object, paths) {
        var result = {};
        if (object == null) {
          return result;
        }
        var isDeep = false;
        paths = arrayMap(paths, function(path) {
          path = castPath(path, object);
          isDeep || (isDeep = path.length > 1);
          return path;
        });
        copyObject(object, getAllKeysIn(object), result);
        if (isDeep) {
          result = baseClone(result, CLONE_DEEP_FLAG | CLONE_FLAT_FLAG | CLONE_SYMBOLS_FLAG, customOmitClone);
        }
        var length = paths.length;
        while (length--) {
          baseUnset(result, paths[length]);
        }
        return result;
      });
      function sum(array) {
        return array && array.length ? baseSum(array, identity) : 0;
      }
      var FUNC_ERROR_TEXT = "Expected a function";
      function throttle(func, wait, options) {
        var leading = true, trailing = true;
        if (typeof func != "function") {
          throw new TypeError(FUNC_ERROR_TEXT);
        }
        if (isObject(options)) {
          leading = "leading" in options ? !!options.leading : leading;
          trailing = "trailing" in options ? !!options.trailing : trailing;
        }
        return debounce$1(func, wait, {
          "leading": leading,
          "maxWait": wait,
          "trailing": trailing
        });
      }
      /**
       * tdesign v1.17.1
       * (c) 2025 tdesign
       * @license MIT
       */
      function _arrayWithHoles(r) {
        if (Array.isArray(r)) return r;
      }
      function _iterableToArrayLimit(r, l) {
        var t2 = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
        if (null != t2) {
          var e, n, i2, u, a = [], f = true, o = false;
          try {
            if (i2 = (t2 = t2.call(r)).next, 0 === l) {
              if (Object(t2) !== t2) return;
              f = false;
            } else for (; !(f = (e = i2.call(t2)).done) && (a.push(e.value), a.length !== l); f = true) ;
          } catch (r2) {
            o = true, n = r2;
          } finally {
            try {
              if (!f && null != t2["return"] && (u = t2["return"](), Object(u) !== u)) return;
            } finally {
              if (o) throw n;
            }
          }
          return a;
        }
      }
      function _nonIterableRest() {
        throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
      }
      function _slicedToArray(r, e) {
        return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray$1(r, e) || _nonIterableRest();
      }
      /**
       * tdesign v1.17.1
       * (c) 2025 tdesign
       * @license MIT
       */
      var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
      /**
       * tdesign v1.17.1
       * (c) 2025 tdesign
       * @license MIT
       */
      var raf$2 = { exports: {} };
      var performanceNow$2 = { exports: {} };
      (function() {
        var getNanoSeconds, hrtime, loadTime, moduleLoadTime, nodeLoadTime, upTime;
        if (typeof performance !== "undefined" && performance !== null && performance.now) {
          performanceNow$2.exports = function() {
            return performance.now();
          };
        } else if (typeof process !== "undefined" && process !== null && process.hrtime) {
          performanceNow$2.exports = function() {
            return (getNanoSeconds() - nodeLoadTime) / 1e6;
          };
          hrtime = process.hrtime;
          getNanoSeconds = function getNanoSeconds2() {
            var hr;
            hr = hrtime();
            return hr[0] * 1e9 + hr[1];
          };
          moduleLoadTime = getNanoSeconds();
          upTime = process.uptime() * 1e9;
          nodeLoadTime = moduleLoadTime - upTime;
        } else if (Date.now) {
          performanceNow$2.exports = function() {
            return Date.now() - loadTime;
          };
          loadTime = Date.now();
        } else {
          performanceNow$2.exports = function() {
            return ( new Date()).getTime() - loadTime;
          };
          loadTime = ( new Date()).getTime();
        }
      }).call(commonjsGlobal);
      var performanceNowExports = performanceNow$2.exports;
      var now = performanceNowExports, root = typeof window === "undefined" ? commonjsGlobal : window, vendors = ["moz", "webkit"], suffix = "AnimationFrame", raf = root["request" + suffix], caf = root["cancel" + suffix] || root["cancelRequest" + suffix];
      for (var i = 0; !raf && i < vendors.length; i++) {
        raf = root[vendors[i] + "Request" + suffix];
        caf = root[vendors[i] + "Cancel" + suffix] || root[vendors[i] + "CancelRequest" + suffix];
      }
      if (!raf || !caf) {
        var last = 0, id = 0, queue = [], frameDuration = 1e3 / 60;
        raf = function raf2(callback) {
          if (queue.length === 0) {
            var _now = now(), next = Math.max(0, frameDuration - (_now - last));
            last = next + _now;
            setTimeout(function() {
              var cp = queue.slice(0);
              queue.length = 0;
              var _loop = function _loop2() {
                if (!cp[i2].cancelled) {
                  try {
                    cp[i2].callback(last);
                  } catch (e) {
                    setTimeout(function() {
                      throw e;
                    }, 0);
                  }
                }
              };
              for (var i2 = 0; i2 < cp.length; i2++) {
                _loop();
              }
            }, Math.round(next));
          }
          queue.push({
            handle: ++id,
            callback,
            cancelled: false
          });
          return id;
        };
        caf = function caf2(handle) {
          for (var i2 = 0; i2 < queue.length; i2++) {
            if (queue[i2].handle === handle) {
              queue[i2].cancelled = true;
            }
          }
        };
      }
      raf$2.exports = function(fn) {
        return raf.call(root, fn);
      };
      raf$2.exports.cancel = function() {
        caf.apply(root, arguments);
      };
      raf$2.exports.polyfill = function(object) {
        if (!object) {
          object = root;
        }
        object.requestAnimationFrame = raf;
        object.cancelAnimationFrame = caf;
      };
      var isServer = typeof window === "undefined";
      var trim = function trim2(str) {
        return (str || "").replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, "");
      };
      var on = (function() {
        if (!isServer && document.addEventListener) {
          return function(element2, event, handler, options) {
            if (element2 && event && handler) {
              element2.addEventListener(event, handler, options);
            }
          };
        }
        return function(element2, event, handler) {
          if (element2 && event && handler) {
            element2.attachEvent("on".concat(event), handler);
          }
        };
      })();
      var off = (function() {
        if (!isServer && document.removeEventListener) {
          return function(element2, event, handler, options) {
            if (element2 && event) {
              element2.removeEventListener(event, handler, options);
            }
          };
        }
        return function(element2, event, handler) {
          if (element2 && event) {
            element2.detachEvent("on".concat(event), handler);
          }
        };
      })();
      function once(element2, event, handler, options) {
        var handlerFn = isFunction(handler) ? handler : handler.handleEvent;
        var _callback = function callback(evt) {
          handlerFn(evt);
          off(element2, event, _callback, options);
        };
        on(element2, event, _callback, options);
      }
      function hasClass(el, cls) {
        if (!el || !cls) return false;
        if (cls.indexOf(" ") !== -1) throw new Error("className should not contain space.");
        if (el.classList) {
          return el.classList.contains(cls);
        }
        return " ".concat(el.className, " ").indexOf(" ".concat(cls, " ")) > -1;
      }
      function addClass(el, cls) {
        if (!el) return;
        var curClass = el.className;
        var classes = (cls || "").split(" ");
        for (var i2 = 0, j = classes.length; i2 < j; i2++) {
          var clsName = classes[i2];
          if (!clsName) continue;
          if (el.classList) {
            el.classList.add(clsName);
          } else if (!hasClass(el, clsName)) {
            curClass += " ".concat(clsName);
          }
        }
        if (!el.classList) {
          el.className = curClass;
        }
      }
      function removeClass(el, cls) {
        if (!el || !cls) return;
        var classes = cls.split(" ");
        var curClass = " ".concat(el.className, " ");
        for (var i2 = 0, j = classes.length; i2 < j; i2++) {
          var clsName = classes[i2];
          if (!clsName) continue;
          if (el.classList) {
            el.classList.remove(clsName);
          } else if (hasClass(el, clsName)) {
            curClass = curClass.replace(" ".concat(clsName, " "), " ");
          }
        }
        if (!el.classList) {
          el.className = trim(curClass);
        }
      }
      var getAttach = function getAttach2(node, triggerNode) {
        var attachNode = isFunction(node) ? node(triggerNode) : node;
        if (!attachNode) {
          return document.body;
        }
        if (isString(attachNode)) {
          return document.querySelector(attachNode);
        }
        if (attachNode instanceof HTMLElement) {
          return attachNode;
        }
        return document.body;
      };
      var isCommentVNode = function isCommentVNode2(node) {
        return vue.isVNode(node) && node.type === vue.Comment;
      };
      function withInstall(comp, alias, directive) {
        var componentPlugin = comp;
        componentPlugin.install = function(app, name) {
          app.component(alias || name || componentPlugin.name, comp);
          directive && app.directive(directive.name, directive.comp);
        };
        return componentPlugin;
      }
      function getDefaultNode(options) {
        var defaultNode;
        if (isObject(options) && "defaultNode" in options) {
          defaultNode = options.defaultNode;
        } else if (vue.isVNode(options) || isString(options)) {
          defaultNode = options;
        }
        return defaultNode;
      }
      function getChildren(content) {
        var childList = [];
        var _innerGetChildren = function innerGetChildren(content2) {
          if (!isArray(content2)) return;
          content2.forEach(function(item) {
            if (item.children && isArray(item.children)) {
              if (item.type !== vue.Fragment) return;
              _innerGetChildren(item.children);
            } else {
              childList.push(item);
            }
          });
          return childList;
        };
        return _innerGetChildren(content);
      }
      function getParams(options) {
        return isObject(options) && "params" in options ? options.params : {};
      }
      function getSlotFirst(options) {
        return isObject(options) && "slotFirst" in options ? options.slotFirst : false;
      }
      /**
       * tdesign v1.17.1
       * (c) 2025 tdesign
       * @license MIT
       */
      var dayjs_min$1 = { exports: {} };
      (function(module2, exports2) {
        !(function(t2, e) {
          module2.exports = e();
        })(commonjsGlobal, function() {
          var t2 = 1e3, e = 6e4, n = 36e5, r = "millisecond", i2 = "second", s = "minute", u = "hour", a = "day", o = "week", c = "month", f = "quarter", h2 = "year", d = "date", l = "Invalid Date", $ = /^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/, y = /\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g, M = {
            name: "en",
            weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),
            months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_"),
            ordinal: function ordinal(t3) {
              var e2 = ["th", "st", "nd", "rd"], n2 = t3 % 100;
              return "[" + t3 + (e2[(n2 - 20) % 10] || e2[n2] || e2[0]) + "]";
            }
          }, m = function m2(t3, e2, n2) {
            var r2 = String(t3);
            return !r2 || r2.length >= e2 ? t3 : "" + Array(e2 + 1 - r2.length).join(n2) + t3;
          }, v = {
            s: m,
            z: function z(t3) {
              var e2 = -t3.utcOffset(), n2 = Math.abs(e2), r2 = Math.floor(n2 / 60), i3 = n2 % 60;
              return (e2 <= 0 ? "+" : "-") + m(r2, 2, "0") + ":" + m(i3, 2, "0");
            },
            m: function t3(e2, n2) {
              if (e2.date() < n2.date()) return -t3(n2, e2);
              var r2 = 12 * (n2.year() - e2.year()) + (n2.month() - e2.month()), i3 = e2.clone().add(r2, c), s2 = n2 - i3 < 0, u2 = e2.clone().add(r2 + (s2 ? -1 : 1), c);
              return +(-(r2 + (n2 - i3) / (s2 ? i3 - u2 : u2 - i3)) || 0);
            },
            a: function a2(t3) {
              return t3 < 0 ? Math.ceil(t3) || 0 : Math.floor(t3);
            },
            p: function p2(t3) {
              return {
                M: c,
                y: h2,
                w: o,
                d: a,
                D: d,
                h: u,
                m: s,
                s: i2,
                ms: r,
                Q: f
              }[t3] || String(t3 || "").toLowerCase().replace(/s$/, "");
            },
            u: function u2(t3) {
              return void 0 === t3;
            }
          }, g = "en", D = {};
          D[g] = M;
          var p = "$isDayjsObject", S = function S2(t3) {
            return t3 instanceof _ || !(!t3 || !t3[p]);
          }, w = function t3(e2, n2, r2) {
            var i3;
            if (!e2) return g;
            if ("string" == typeof e2) {
              var s2 = e2.toLowerCase();
              D[s2] && (i3 = s2), n2 && (D[s2] = n2, i3 = s2);
              var u2 = e2.split("-");
              if (!i3 && u2.length > 1) return t3(u2[0]);
            } else {
              var a2 = e2.name;
              D[a2] = e2, i3 = a2;
            }
            return !r2 && i3 && (g = i3), i3 || !r2 && g;
          }, O = function O2(t3, e2) {
            if (S(t3)) return t3.clone();
            var n2 = "object" == _typeof(e2) ? e2 : {};
            return n2.date = t3, n2.args = arguments, new _(n2);
          }, b = v;
          b.l = w, b.i = S, b.w = function(t3, e2) {
            return O(t3, {
              locale: e2.$L,
              utc: e2.$u,
              x: e2.$x,
              $offset: e2.$offset
            });
          };
          var _ = (function() {
            function M2(t3) {
              this.$L = w(t3.locale, null, true), this.parse(t3), this.$x = this.$x || t3.x || {}, this[p] = true;
            }
            var m2 = M2.prototype;
            return m2.parse = function(t3) {
              this.$d = (function(t4) {
                var e2 = t4.date, n2 = t4.utc;
                if (null === e2) return new Date(NaN);
                if (b.u(e2)) return new Date();
                if (e2 instanceof Date) return new Date(e2);
                if ("string" == typeof e2 && !/Z$/i.test(e2)) {
                  var r2 = e2.match($);
                  if (r2) {
                    var i3 = r2[2] - 1 || 0, s2 = (r2[7] || "0").substring(0, 3);
                    return n2 ? new Date(Date.UTC(r2[1], i3, r2[3] || 1, r2[4] || 0, r2[5] || 0, r2[6] || 0, s2)) : new Date(r2[1], i3, r2[3] || 1, r2[4] || 0, r2[5] || 0, r2[6] || 0, s2);
                  }
                }
                return new Date(e2);
              })(t3), this.init();
            }, m2.init = function() {
              var t3 = this.$d;
              this.$y = t3.getFullYear(), this.$M = t3.getMonth(), this.$D = t3.getDate(), this.$W = t3.getDay(), this.$H = t3.getHours(), this.$m = t3.getMinutes(), this.$s = t3.getSeconds(), this.$ms = t3.getMilliseconds();
            }, m2.$utils = function() {
              return b;
            }, m2.isValid = function() {
              return !(this.$d.toString() === l);
            }, m2.isSame = function(t3, e2) {
              var n2 = O(t3);
              return this.startOf(e2) <= n2 && n2 <= this.endOf(e2);
            }, m2.isAfter = function(t3, e2) {
              return O(t3) < this.startOf(e2);
            }, m2.isBefore = function(t3, e2) {
              return this.endOf(e2) < O(t3);
            }, m2.$g = function(t3, e2, n2) {
              return b.u(t3) ? this[e2] : this.set(n2, t3);
            }, m2.unix = function() {
              return Math.floor(this.valueOf() / 1e3);
            }, m2.valueOf = function() {
              return this.$d.getTime();
            }, m2.startOf = function(t3, e2) {
              var n2 = this, r2 = !!b.u(e2) || e2, f2 = b.p(t3), l2 = function l3(t4, e3) {
                var i3 = b.w(n2.$u ? Date.UTC(n2.$y, e3, t4) : new Date(n2.$y, e3, t4), n2);
                return r2 ? i3 : i3.endOf(a);
              }, $2 = function $3(t4, e3) {
                return b.w(n2.toDate()[t4].apply(n2.toDate("s"), (r2 ? [0, 0, 0, 0] : [23, 59, 59, 999]).slice(e3)), n2);
              }, y2 = this.$W, M3 = this.$M, m3 = this.$D, v2 = "set" + (this.$u ? "UTC" : "");
              switch (f2) {
                case h2:
                  return r2 ? l2(1, 0) : l2(31, 11);
                case c:
                  return r2 ? l2(1, M3) : l2(0, M3 + 1);
                case o:
                  var g2 = this.$locale().weekStart || 0, D2 = (y2 < g2 ? y2 + 7 : y2) - g2;
                  return l2(r2 ? m3 - D2 : m3 + (6 - D2), M3);
                case a:
                case d:
                  return $2(v2 + "Hours", 0);
                case u:
                  return $2(v2 + "Minutes", 1);
                case s:
                  return $2(v2 + "Seconds", 2);
                case i2:
                  return $2(v2 + "Milliseconds", 3);
                default:
                  return this.clone();
              }
            }, m2.endOf = function(t3) {
              return this.startOf(t3, false);
            }, m2.$set = function(t3, e2) {
              var n2, o2 = b.p(t3), f2 = "set" + (this.$u ? "UTC" : ""), l2 = (n2 = {}, n2[a] = f2 + "Date", n2[d] = f2 + "Date", n2[c] = f2 + "Month", n2[h2] = f2 + "FullYear", n2[u] = f2 + "Hours", n2[s] = f2 + "Minutes", n2[i2] = f2 + "Seconds", n2[r] = f2 + "Milliseconds", n2)[o2], $2 = o2 === a ? this.$D + (e2 - this.$W) : e2;
              if (o2 === c || o2 === h2) {
                var y2 = this.clone().set(d, 1);
                y2.$d[l2]($2), y2.init(), this.$d = y2.set(d, Math.min(this.$D, y2.daysInMonth())).$d;
              } else l2 && this.$d[l2]($2);
              return this.init(), this;
            }, m2.set = function(t3, e2) {
              return this.clone().$set(t3, e2);
            }, m2.get = function(t3) {
              return this[b.p(t3)]();
            }, m2.add = function(r2, f2) {
              var d2, l2 = this;
              r2 = Number(r2);
              var $2 = b.p(f2), y2 = function y3(t3) {
                var e2 = O(l2);
                return b.w(e2.date(e2.date() + Math.round(t3 * r2)), l2);
              };
              if ($2 === c) return this.set(c, this.$M + r2);
              if ($2 === h2) return this.set(h2, this.$y + r2);
              if ($2 === a) return y2(1);
              if ($2 === o) return y2(7);
              var M3 = (d2 = {}, d2[s] = e, d2[u] = n, d2[i2] = t2, d2)[$2] || 1, m3 = this.$d.getTime() + r2 * M3;
              return b.w(m3, this);
            }, m2.subtract = function(t3, e2) {
              return this.add(-1 * t3, e2);
            }, m2.format = function(t3) {
              var e2 = this, n2 = this.$locale();
              if (!this.isValid()) return n2.invalidDate || l;
              var r2 = t3 || "YYYY-MM-DDTHH:mm:ssZ", i3 = b.z(this), s2 = this.$H, u2 = this.$m, a2 = this.$M, o2 = n2.weekdays, c2 = n2.months, f2 = n2.meridiem, h3 = function h4(t4, n3, i4, s3) {
                return t4 && (t4[n3] || t4(e2, r2)) || i4[n3].slice(0, s3);
              }, d2 = function d3(t4) {
                return b.s(s2 % 12 || 12, t4, "0");
              }, $2 = f2 || function(t4, e3, n3) {
                var r3 = t4 < 12 ? "AM" : "PM";
                return n3 ? r3.toLowerCase() : r3;
              };
              return r2.replace(y, function(t4, r3) {
                return r3 || (function(t5) {
                  switch (t5) {
                    case "YY":
                      return String(e2.$y).slice(-2);
                    case "YYYY":
                      return b.s(e2.$y, 4, "0");
                    case "M":
                      return a2 + 1;
                    case "MM":
                      return b.s(a2 + 1, 2, "0");
                    case "MMM":
                      return h3(n2.monthsShort, a2, c2, 3);
                    case "MMMM":
                      return h3(c2, a2);
                    case "D":
                      return e2.$D;
                    case "DD":
                      return b.s(e2.$D, 2, "0");
                    case "d":
                      return String(e2.$W);
                    case "dd":
                      return h3(n2.weekdaysMin, e2.$W, o2, 2);
                    case "ddd":
                      return h3(n2.weekdaysShort, e2.$W, o2, 3);
                    case "dddd":
                      return o2[e2.$W];
                    case "H":
                      return String(s2);
                    case "HH":
                      return b.s(s2, 2, "0");
                    case "h":
                      return d2(1);
                    case "hh":
                      return d2(2);
                    case "a":
                      return $2(s2, u2, true);
                    case "A":
                      return $2(s2, u2, false);
                    case "m":
                      return String(u2);
                    case "mm":
                      return b.s(u2, 2, "0");
                    case "s":
                      return String(e2.$s);
                    case "ss":
                      return b.s(e2.$s, 2, "0");
                    case "SSS":
                      return b.s(e2.$ms, 3, "0");
                    case "Z":
                      return i3;
                  }
                  return null;
                })(t4) || i3.replace(":", "");
              });
            }, m2.utcOffset = function() {
              return 15 * -Math.round(this.$d.getTimezoneOffset() / 15);
            }, m2.diff = function(r2, d2, l2) {
              var $2, y2 = this, M3 = b.p(d2), m3 = O(r2), v2 = (m3.utcOffset() - this.utcOffset()) * e, g2 = this - m3, D2 = function D3() {
                return b.m(y2, m3);
              };
              switch (M3) {
                case h2:
                  $2 = D2() / 12;
                  break;
                case c:
                  $2 = D2();
                  break;
                case f:
                  $2 = D2() / 3;
                  break;
                case o:
                  $2 = (g2 - v2) / 6048e5;
                  break;
                case a:
                  $2 = (g2 - v2) / 864e5;
                  break;
                case u:
                  $2 = g2 / n;
                  break;
                case s:
                  $2 = g2 / e;
                  break;
                case i2:
                  $2 = g2 / t2;
                  break;
                default:
                  $2 = g2;
              }
              return l2 ? $2 : b.a($2);
            }, m2.daysInMonth = function() {
              return this.endOf(c).$D;
            }, m2.$locale = function() {
              return D[this.$L];
            }, m2.locale = function(t3, e2) {
              if (!t3) return this.$L;
              var n2 = this.clone(), r2 = w(t3, e2, true);
              return r2 && (n2.$L = r2), n2;
            }, m2.clone = function() {
              return b.w(this.$d, this);
            }, m2.toDate = function() {
              return new Date(this.valueOf());
            }, m2.toJSON = function() {
              return this.isValid() ? this.toISOString() : null;
            }, m2.toISOString = function() {
              return this.$d.toISOString();
            }, m2.toString = function() {
              return this.$d.toUTCString();
            }, M2;
          })(), k = _.prototype;
          return O.prototype = k, [["$ms", r], ["$s", i2], ["$m", s], ["$H", u], ["$W", a], ["$M", c], ["$y", h2], ["$D", d]].forEach(function(t3) {
            k[t3[1]] = function(e2) {
              return this.$g(e2, t3[0], t3[1]);
            };
          }), O.extend = function(t3, e2) {
            return t3.$i || (t3(e2, _, O), t3.$i = true), O;
          }, O.locale = w, O.isDayjs = S, O.unix = function(t3) {
            return O(1e3 * t3);
          }, O.en = D[g], O.Ls = D, O.p = {}, O;
        });
      })(dayjs_min$1);
      var dayjs_minExports = dayjs_min$1.exports;
      /**
       * tdesign v1.17.1
       * (c) 2025 tdesign
       * @license MIT
       */
      var zhCn$3 = { exports: {} };
      (function(module2, exports2) {
        !(function(e, _) {
          module2.exports = _(dayjs_minExports);
        })(commonjsGlobal, function(e) {
          function _(e2) {
            return e2 && "object" == _typeof(e2) && "default" in e2 ? e2 : {
              "default": e2
            };
          }
          var t2 = _(e), d = {
            name: "zh-cn",
            weekdays: "星期日_星期一_星期二_星期三_星期四_星期五_星期六".split("_"),
            weekdaysShort: "周日_周一_周二_周三_周四_周五_周六".split("_"),
            weekdaysMin: "日_一_二_三_四_五_六".split("_"),
            months: "一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月".split("_"),
            monthsShort: "1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split("_"),
            ordinal: function ordinal(e2, _2) {
              return "W" === _2 ? e2 + "周" : e2 + "日";
            },
            weekStart: 1,
            yearStart: 4,
            formats: {
              LT: "HH:mm",
              LTS: "HH:mm:ss",
              L: "YYYY/MM/DD",
              LL: "YYYY年M月D日",
              LLL: "YYYY年M月D日Ah点mm分",
              LLLL: "YYYY年M月D日ddddAh点mm分",
              l: "YYYY/M/D",
              ll: "YYYY年M月D日",
              lll: "YYYY年M月D日 HH:mm",
              llll: "YYYY年M月D日dddd HH:mm"
            },
            relativeTime: {
              future: "%s内",
              past: "%s前",
              s: "几秒",
              m: "1 分钟",
              mm: "%d 分钟",
              h: "1 小时",
              hh: "%d 小时",
              d: "1 天",
              dd: "%d 天",
              M: "1 个月",
              MM: "%d 个月",
              y: "1 年",
              yy: "%d 年"
            },
            meridiem: function meridiem(e2, _2) {
              var t3 = 100 * e2 + _2;
              return t3 < 600 ? "凌晨" : t3 < 900 ? "早上" : t3 < 1100 ? "上午" : t3 < 1300 ? "中午" : t3 < 1800 ? "下午" : "晚上";
            }
          };
          return t2["default"].locale(d, null, true), d;
        });
      })(zhCn$3);
      var zhCn = {
        autoComplete: {
          empty: "暂无数据"
        },
        pagination: {
          itemsPerPage: "{size} 条/页",
          jumpTo: "跳至",
          page: "页",
          total: "共 {count} 条数据"
        },
        cascader: {
          empty: "暂无数据",
          loadingText: "加载中",
          placeholder: "请选择"
        },
        calendar: {
          yearSelection: "{year} 年",
          monthSelection: "{month} 月",
          yearRadio: "年",
          monthRadio: "月",
          hideWeekend: "隐藏周末",
          showWeekend: "显示周末",
          today: "今天",
          thisMonth: "本月",
          week: "一,二,三,四,五,六,日",
          cellMonth: "1 月,2 月,3 月,4 月,5 月,6 月,7 月,8 月,9 月,10 月,11 月,12 月"
        },
        transfer: {
          title: "{checked} / {total} 项",
          empty: "暂无数据",
          placeholder: "请输入关键词搜索"
        },
        timePicker: {
          dayjsLocale: "zh-cn",
          now: "此刻",
          confirm: "确定",
          anteMeridiem: "上午",
          postMeridiem: "下午",
          placeholder: "选择时间"
        },
        dialog: {
          confirm: "确认",
          cancel: "取消"
        },
        drawer: {
          confirm: "确认",
          cancel: "取消"
        },
        popconfirm: {
          confirm: {
            content: "确定"
          },
          cancel: {
            content: "取消"
          }
        },
        table: {
          empty: "暂无数据",
          loadingText: "正在加载中，请稍后",
          loadingMoreText: "点击加载更多",
          filterInputPlaceholder: "请输入内容（无默认值）",
          sortAscendingOperationText: "点击升序",
          sortCancelOperationText: "点击取消排序",
          sortDescendingOperationText: "点击降序",
          clearFilterResultButtonText: "清空筛选",
          columnConfigButtonText: "列配置",
          columnConfigTitleText: "表格列配置",
          columnConfigDescriptionText: "请选择需要在表格中显示的数据列",
          confirmText: "确认",
          cancelText: "取消",
          resetText: "重置",
          selectAllText: "全选",
          searchResultText: "搜索“{result}”，找到 {count} 条结果"
        },
        select: {
          empty: "暂无数据",
          loadingText: "加载中",
          placeholder: "请选择"
        },
        tree: {
          empty: "暂无数据"
        },
        treeSelect: {
          empty: "暂无数据",
          loadingText: "加载中",
          placeholder: "请选择"
        },
        datePicker: {
          dayjsLocale: "zh-cn",
          placeholder: {
            date: "请选择日期",
            month: "请选择月份",
            year: "请选择年份",
            quarter: "请选择季度",
            week: "请选择周"
          },
          weekdays: ["一", "二", "三", "四", "五", "六", "日"],
          months: ["1 月", "2 月", "3 月", "4 月", "5 月", "6 月", "7 月", "8 月", "9 月", "10 月", "11 月", "12 月"],
          quarters: ["一季度", "二季度", "三季度", "四季度"],
          rangeSeparator: " - ",
          direction: "ltr",
          format: "YYYY-MM-DD",
          dayAriaLabel: "日",
          weekAbbreviation: "周",
          yearAriaLabel: "年",
          monthAriaLabel: "月",
          confirm: "确定",
          selectTime: "选择时间",
          selectDate: "选择日期",
          nextYear: "下一年",
          preYear: "上一年",
          nextMonth: "下个月",
          preMonth: "上个月",
          preDecade: "上个十年",
          nextDecade: "下个十年",
          now: "当前"
        },
        upload: {
          sizeLimitMessage: "文件大小不能超过 {sizeLimit}",
          cancelUploadText: "取消上传",
          triggerUploadText: {
            fileInput: "选择文件",
            image: "点击上传图片",
            normal: "点击上传",
            reupload: "重新选择",
            continueUpload: "继续选择",
            "delete": "删除",
            uploading: "上传中"
          },
          dragger: {
            dragDropText: "释放鼠标",
            draggingText: "拖拽到此区域",
            clickAndDragText: "点击上方“选择文件”或将文件拖拽到此区域"
          },
          file: {
            fileNameText: "文件名",
            fileSizeText: "文件大小",
            fileStatusText: "状态",
            fileOperationText: "操作",
            fileOperationDateText: "上传日期"
          },
          progress: {
            uploadingText: "上传中",
            waitingText: "待上传",
            failText: "上传失败",
            successText: "上传成功"
          }
        },
        form: {
          errorMessage: {
            date: "请输入正确的${name}",
            url: "请输入正确的${name}",
            required: "${name}必填",
            whitespace: "${name}不能为空",
            max: "${name}字符长度不能超过 ${validate} 个字符，一个中文等于两个字符",
            min: "${name}字符长度不能少于 ${validate} 个字符，一个中文等于两个字符",
            len: "${name}字符长度必须是 ${validate}",
            "enum": "${name}只能是${validate}等",
            idcard: "请输入正确的${name}",
            telnumber: "请输入正确的${name}",
            pattern: "请输入正确的${name}",
            validator: "${name}不符合要求",
            "boolean": "${name}数据类型必须是布尔类型",
            number: "${name}必须是数字"
          },
          colonText: "："
        },
        input: {
          placeholder: "请输入"
        },
        list: {
          loadingText: "正在加载中，请稍等",
          loadingMoreText: "点击加载更多"
        },
        alert: {
          expandText: "展开更多",
          collapseText: "收起"
        },
        anchor: {
          copySuccessText: "链接复制成功",
          copyText: "复制链接"
        },
        colorPicker: {
          swatchColorTitle: "系统预设颜色",
          recentColorTitle: "最近使用颜色",
          clearConfirmText: "确定清空最近使用的颜色吗？",
          singleColor: "单色",
          gradientColor: "渐变"
        },
        guide: {
          finishButtonProps: {
            content: "完成",
            theme: "primary"
          },
          nextButtonProps: {
            content: "下一步",
            theme: "primary"
          },
          skipButtonProps: {
            content: "跳过",
            theme: "default"
          },
          prevButtonProps: {
            content: "上一步",
            theme: "default"
          }
        },
        image: {
          errorText: "图片无法显示",
          loadingText: "图片加载中"
        },
        imageViewer: {
          errorText: "图片加载失败，可尝试重新加载",
          mirrorTipText: "镜像",
          rotateTipText: "旋转",
          originalSizeTipText: "原始大小"
        },
        typography: {
          expandText: "展开",
          collapseText: "收起",
          copiedText: "复制成功"
        },
        rate: {
          rateText: ["极差", "失望", "一般", "满意", "惊喜"]
        },
        empty: {
          titleText: {
            maintenance: "建设中",
            success: "成功",
            fail: "失败",
            empty: "暂无数据",
            networkError: "网络错误"
          }
        },
        descriptions: {
          colonText: "："
        },
        chat: {
          placeholder: "请输入消息...",
          stopBtnText: "中止",
          refreshTipText: "重新生成",
          copyTipText: "复制",
          likeTipText: "点赞",
          dislikeTipText: "点踩",
          copyCodeBtnText: "复制代码",
          copyCodeSuccessText: "已复制",
          clearHistoryBtnText: "清空历史记录",
          copyTextSuccess: "已成功复制到剪贴板",
          copyTextFail: "复制到剪贴板失败",
          confirmClearHistory: "确定要清空所有的消息吗？",
          loadingText: "思考中...",
          loadingEndText: "已深度思考",
          uploadImageText: "上传图片",
          uploadAttachmentText: "上传附件"
        },
        qrcode: {
          expiredText: "二维码过期",
          refreshText: "点击刷新",
          scannedText: "已扫描"
        }
      };
      /**
       * tdesign v1.17.1
       * (c) 2025 tdesign
       * @license MIT
       */
      var defaultConfig = {
        classPrefix: "t",
        animation: {
          include: ["ripple", "expand", "fade"],
          exclude: []
        },
        attach: null,
        calendar: {
          firstDayOfWeek: 1,
          fillWithZero: true,
          controllerConfig: void 0
        },
        icon: {},
        input: {
          autocomplete: ""
        },
        dialog: {
          closeOnEscKeydown: true,
          closeOnOverlayClick: true,
          confirmBtnTheme: {
            "default": "primary",
            info: "primary",
            warning: "primary",
            danger: "primary",
            success: "primary"
          }
        },
        message: {},
        popconfirm: {
          confirmBtnTheme: {
            "default": "primary",
            warning: "primary",
            danger: "primary"
          }
        },
        table: {
          expandIcon: void 0,
          sortIcon: void 0,
          filterIcon: void 0,
          treeExpandAndFoldIcon: void 0,
          hideSortTips: false,
          size: "medium"
        },
        select: {
          clearIcon: void 0,
          filterable: false
        },
        drawer: {
          closeOnEscKeydown: true,
          closeOnOverlayClick: true,
          size: "small"
        },
        tree: {
          folderIcon: void 0
        },
        datePicker: {
          firstDayOfWeek: 1
        },
        steps: {
          checkIcon: void 0,
          errorIcon: void 0
        },
        tag: {
          closeIcon: void 0
        },
        form: {
          requiredMark: void 0
        },
        empty: {
          titleText: {
            maintenance: void 0,
            success: void 0,
            fail: void 0,
            empty: void 0,
            networkError: void 0
          },
          image: {
            maintenance: void 0,
            success: void 0,
            fail: void 0,
            empty: void 0,
            networkError: void 0
          }
        }
      };
      var EAnimationType = (function(EAnimationType2) {
        EAnimationType2["ripple"] = "ripple";
        EAnimationType2["expand"] = "expand";
        EAnimationType2["fade"] = "fade";
        return EAnimationType2;
      })(EAnimationType || {});
      var defaultGlobalConfig = merge(defaultConfig, zhCn);
      var configProviderInjectKey = Symbol("configProvide");
      /**
       * tdesign v1.17.1
       * (c) 2025 tdesign
       * @license MIT
       */
      function getPluralIndex(count) {
        if (count === 0) return 0;
        if (count === 1) return 1;
        return 2;
      }
      function t(pattern) {
        if (isString(pattern)) {
          var text = pattern;
          var count;
          var data = {};
          for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
          }
          if (args.length > 0) {
            var firstArg = args[0], secondArg = args[1];
            if (typeof firstArg === "number") {
              count = firstArg;
              if (secondArg && _typeof(secondArg) === "object") {
                data = secondArg;
              } else {
                data.count = count;
              }
            } else if (_typeof(firstArg) === "object" && firstArg !== null) {
              data = firstArg;
            }
          }
          if (text.includes("|")) {
            var pluralParts = text.split("|").map(function(part) {
              return part.trim();
            });
            if (typeof count === "number") {
              var pluralIndex = getPluralIndex(count);
              if (pluralIndex < pluralParts.length) {
                text = pluralParts[pluralIndex];
              } else {
                text = pluralParts[pluralParts.length - 1];
              }
            } else {
              var _pluralParts = _slicedToArray(pluralParts, 1), firstPart = _pluralParts[0];
              text = firstPart;
            }
          }
          if (data && Object.keys(data).length > 0) {
            var regular = /\{\s*([\w-]+)\s*\}/g;
            text = text.replace(regular, function(match, key2) {
              if (Object.prototype.hasOwnProperty.call(data, key2)) {
                return String(data[key2]);
              }
              return match;
            });
          }
          return text;
        }
        return "";
      }
      var globalConfigCopy = vue.ref();
      function useConfig() {
        var componentName = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : void 0;
        var componentLocale = arguments.length > 1 ? arguments[1] : void 0;
        var injectGlobalConfig = vue.getCurrentInstance() ? vue.inject(configProviderInjectKey, null) : globalConfigCopy;
        var mergedGlobalConfig = vue.computed(function() {
          return (injectGlobalConfig === null || injectGlobalConfig === void 0 ? void 0 : injectGlobalConfig.value) || defaultGlobalConfig;
        });
        var globalConfig = vue.computed(function() {
          return Object.assign({}, mergedGlobalConfig.value[componentName], componentLocale);
        });
        var classPrefix = vue.computed(function() {
          return mergedGlobalConfig.value.classPrefix;
        });
        var t$1 = function t$12(pattern) {
          for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
          }
          if (isFunction(pattern)) {
            if (!args.length) return pattern(vue.h);
            return pattern.apply(void 0, args);
          }
          return t.apply(void 0, [pattern].concat(args));
        };
        return {
          t: t$1,
          global: globalConfig,
          globalConfig,
          classPrefix
        };
      }
      /**
       * tdesign v1.17.1
       * (c) 2025 tdesign
       * @license MIT
       */
      var logSet = new Set();
      var log = {
        warn: function warn(componentName, message) {
          console.warn("TDesign ".concat(componentName, " Warn: ").concat(message));
        },
        warnOnce: function warnOnce(componentName, message) {
          var msgContent = "TDesign ".concat(componentName, " Warn: ").concat(message);
          if (logSet.has(msgContent)) return;
          logSet.add(msgContent);
          console.warn(msgContent);
        },
        error: function error(componentName, message) {
          console.error("TDesign ".concat(componentName, " Error: ").concat(message));
        },
        errorOnce: function errorOnce(componentName, message) {
          var msgContent = "TDesign ".concat(componentName, " Error: ").concat(message);
          if (logSet.has(msgContent)) return;
          logSet.add(msgContent);
          console.error(msgContent);
        },
        info: function info(componentName, message) {
          console.info("TDesign ".concat(componentName, " Info: ").concat(message));
        }
      };
      /**
       * tdesign v1.17.1
       * (c) 2025 tdesign
       * @license MIT
       */
      function _createClass(e, r, t2) {
        return Object.defineProperty(e, "prototype", {
          writable: false
        }), e;
      }
      function _classCallCheck(a, n) {
        if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function");
      }
      /**
       * tdesign v1.17.1
       * (c) 2025 tdesign
       * @license MIT
       */
      function useChildComponentSlots() {
        var instance = vue.getCurrentInstance();
        return function(childComponentName, slots) {
          var _slots, _slots$default;
          if (!slots) {
            slots = instance.slots;
          }
          var content = ((_slots = slots) === null || _slots === void 0 || (_slots$default = _slots["default"]) === null || _slots$default === void 0 ? void 0 : _slots$default.call(_slots)) || [];
          return getChildren(content).filter(function(item) {
            var _item$type$name;
            return (_item$type$name = item.type.name) === null || _item$type$name === void 0 ? void 0 : _item$type$name.endsWith(childComponentName);
          });
        };
      }
      var hasOwnProperty = Object.prototype.hasOwnProperty;
      var hasOwn = function hasOwn2(val, key2) {
        return hasOwnProperty.call(val, key2);
      };
      var getPropertyValFromObj = function getPropertyValFromObj2(val, key2) {
        return hasOwn(val, key2) ? val[key2] : void 0;
      };
      function handleSlots(instance, name, params) {
        var _instance$slots$camel, _instance$slots, _instance$slots$kebab, _instance$slots2;
        var node = (_instance$slots$camel = (_instance$slots = instance.slots)[camelCase(name)]) === null || _instance$slots$camel === void 0 ? void 0 : _instance$slots$camel.call(_instance$slots, params);
        if (node && node.filter(function(t2) {
          return !isCommentVNode(t2);
        }).length) return node;
        node = (_instance$slots$kebab = (_instance$slots2 = instance.slots)[kebabCase(name)]) === null || _instance$slots$kebab === void 0 ? void 0 : _instance$slots$kebab.call(_instance$slots2, params);
        if (node && node.filter(function(t2) {
          return !isCommentVNode(t2);
        }).length) return node;
        return null;
      }
      function isEmptyNode(node) {
        if ([void 0, null, ""].includes(node)) return true;
        var innerNodes = node instanceof Array ? node : [node];
        var r = innerNodes.filter(function(node2) {
          var _node2$type;
          return (node2 === null || node2 === void 0 || (_node2$type = node2.type) === null || _node2$type === void 0 ? void 0 : _node2$type.toString()) !== "Symbol(Comment)";
        });
        return !r.length;
      }
      function isPropExplicitlySet(instance, propName) {
        var vProps = (instance === null || instance === void 0 ? void 0 : instance.vnode.props) || {};
        return hasOwn(vProps, camelCase(propName)) || hasOwn(vProps, kebabCase(propName));
      }
      var useTNodeJSX = function useTNodeJSX2() {
        var instance = vue.getCurrentInstance();
        return function(name, options) {
          var renderParams = getParams(options);
          var defaultNode = getDefaultNode(options);
          var isSlotFirst = getSlotFirst(options);
          var renderSlot = instance.slots[camelCase(name)] || instance.slots[kebabCase(name)];
          if (isSlotFirst && renderSlot) {
            return handleSlots(instance, name, renderParams);
          } else {
            if (isPropExplicitlySet(instance, name)) {
              var _instance$type$props$;
              var propsNode2 = instance.props[camelCase(name)] || instance.props[kebabCase(name)];
              var types = (_instance$type$props$ = instance.type.props[name]) === null || _instance$type$props$ === void 0 ? void 0 : _instance$type$props$.type;
              if ((types === null || types === void 0 ? void 0 : types.length) > 1) {
                if (types.includes(Boolean) && types.includes(Function)) {
                  if (propsNode2 === "" && !renderSlot) return defaultNode;
                }
              }
              if (propsNode2 === false || propsNode2 === null) return;
              if (propsNode2 === true) {
                return handleSlots(instance, name, renderParams) || defaultNode;
              }
              if (isFunction(propsNode2)) return propsNode2(vue.h, renderParams);
              var isPropsEmpty = [void 0, ""].includes(propsNode2);
              if (isPropsEmpty && renderSlot) {
                return handleSlots(instance, name, renderParams);
              }
              return propsNode2;
            }
            if (renderSlot) {
              return handleSlots(instance, name, renderParams);
            }
            var propsNode = instance.props[camelCase(name)] || instance.props[kebabCase(name)];
            if (propsNode === false || propsNode === null) return;
            if (propsNode === true) {
              return defaultNode;
            }
            if (isFunction(propsNode)) return propsNode(vue.h, renderParams);
            return propsNode;
          }
        };
      };
      var useContent = function useContent2() {
        var renderTNodeJSX = useTNodeJSX();
        return function(name1, name2, options) {
          var params = getParams(options);
          var defaultNode = getDefaultNode(options);
          var toParams = params ? {
            params
          } : void 0;
          var node1 = renderTNodeJSX(name1, toParams);
          var node2 = renderTNodeJSX(name2, toParams);
          var res = isEmptyNode(node1) ? node2 : node1;
          return isEmptyNode(res) ? defaultNode : res;
        };
      };
      function usePrefixClass(componentName) {
        var _useConfig = useConfig("classPrefix"), classPrefix = _useConfig.classPrefix;
        return vue.computed(function() {
          return componentName ? "".concat(classPrefix.value, "-").concat(componentName) : classPrefix.value;
        });
      }
      function useCommonClassName$1() {
        var _useConfig = useConfig("classPrefix"), classPrefix = _useConfig.classPrefix;
        return {
          classPrefix,
          SIZE: vue.computed(function() {
            return {
              small: "".concat(classPrefix.value, "-size-s"),
              medium: "".concat(classPrefix.value, "-size-m"),
              large: "".concat(classPrefix.value, "-size-l"),
              "default": "",
              xs: "".concat(classPrefix.value, "-size-xs"),
              xl: "".concat(classPrefix.value, "-size-xl"),
              block: "".concat(classPrefix.value, "-size-full-width")
            };
          }),
          STATUS: vue.computed(function() {
            return {
              loading: "".concat(classPrefix.value, "-is-loading"),
              loadMore: "".concat(classPrefix.value, "-is-load-more"),
              disabled: "".concat(classPrefix.value, "-is-disabled"),
              focused: "".concat(classPrefix.value, "-is-focused"),
              success: "".concat(classPrefix.value, "-is-success"),
              error: "".concat(classPrefix.value, "-is-error"),
              warning: "".concat(classPrefix.value, "-is-warning"),
              selected: "".concat(classPrefix.value, "-is-selected"),
              active: "".concat(classPrefix.value, "-is-active"),
              checked: "".concat(classPrefix.value, "-is-checked"),
              current: "".concat(classPrefix.value, "-is-current"),
              hidden: "".concat(classPrefix.value, "-is-hidden"),
              visible: "".concat(classPrefix.value, "-is-visible"),
              expanded: "".concat(classPrefix.value, "-is-expanded"),
              indeterminate: "".concat(classPrefix.value, "-is-indeterminate")
            };
          })
        };
      }
      var TDisplayNoneElementRefresh = "t-display-none-element-refresh";
      function useDestroyOnClose() {
        var refresh = vue.ref(0);
        vue.provide(TDisplayNoneElementRefresh, refresh);
        vue.onUpdated(function() {
          refresh.value += 1;
        });
      }
      function useDisabled(context) {
        var currentInstance = vue.getCurrentInstance();
        var componentDisabled = vue.computed(function() {
          return currentInstance.props.disabled;
        });
        var formDisabled = vue.inject("formDisabled", Object.create(null));
        return vue.computed(function() {
          var _formDisabled$disable;
          if (isBoolean(void 0)) return context.beforeDisabled.value;
          if (isBoolean(componentDisabled.value)) return componentDisabled.value;
          if (isBoolean(void 0)) return context.afterDisabled.value;
          if (isBoolean((_formDisabled$disable = formDisabled.disabled) === null || _formDisabled$disable === void 0 ? void 0 : _formDisabled$disable.value)) return formDisabled.disabled.value;
          return false;
        });
      }
      function useGlobalIcon(tdIcon) {
        var _useConfig = useConfig("icon"), globalConfig = _useConfig.globalConfig;
        var resultIcon = {};
        Object.keys(tdIcon).forEach(function(key2) {
          var _globalConfig$value;
          resultIcon[key2] = ((_globalConfig$value = globalConfig.value) === null || _globalConfig$value === void 0 ? void 0 : _globalConfig$value[key2]) || tdIcon[key2];
        });
        return resultIcon;
      }
      var expand = EAnimationType.expand, ripple = EAnimationType.ripple, fade = EAnimationType.fade;
      function useKeepAnimation() {
        var _useConfig = useConfig("animation"), globalConfig = _useConfig.globalConfig;
        var keepAnimation = function keepAnimation2(type) {
          var _animationConfig$excl, _animationConfig$incl;
          var animationConfig = globalConfig.value;
          return animationConfig && !((_animationConfig$excl = animationConfig.exclude) !== null && _animationConfig$excl !== void 0 && _animationConfig$excl.includes(type)) && ((_animationConfig$incl = animationConfig.include) === null || _animationConfig$incl === void 0 ? void 0 : _animationConfig$incl.includes(type));
        };
        return {
          keepExpand: keepAnimation(expand),
          keepRipple: keepAnimation(ripple),
          keepFade: keepAnimation(fade)
        };
      }
      var popupStackType = ["dialog", "drawer"];
      var POPUP_BASE_Z_INDEX = 1e3;
      var MESSAGE_BASE_Z_INDEX = 5e3;
      var Z_INDEX_STEP = 1;
      var PopupManager = _createClass(function PopupManager2() {
        var _this = this;
        _classCallCheck(this, PopupManager2);
        _defineProperty$1(this, "popupStack", {
          popup: new Set(),
          dialog: new Set(),
          message: new Set(),
          drawer: new Set()
        });
        _defineProperty$1(this, "zIndexStack", []);
        _defineProperty$1(this, "getNextZIndex", function(type) {
          var current = type === "message" ? Array.from(_this.popupStack.message).pop() || MESSAGE_BASE_Z_INDEX : Array.from(_this.popupStack.popup).pop() || POPUP_BASE_Z_INDEX;
          return current + Z_INDEX_STEP;
        });
        _defineProperty$1(this, "add", function(type) {
          var zIndex = _this.getNextZIndex(type);
          _this.popupStack[type].add(zIndex);
          if (popupStackType.includes(type)) {
            _this.popupStack.popup.add(zIndex);
          }
          _this.zIndexStack.push(zIndex);
          return zIndex;
        });
        _defineProperty$1(this, "delete", function(zIndex, type) {
          _this.popupStack[type]["delete"](zIndex);
          if (popupStackType.includes(type)) {
            _this.popupStack.popup["delete"](zIndex);
          }
          var index = _this.zIndexStack.indexOf(zIndex);
          if (index !== -1) {
            _this.zIndexStack.splice(index, 1);
          }
        });
        _defineProperty$1(this, "isTopInteractivePopup", function(popupType, zIndex) {
          var _this$popupStack$popu;
          if (popupStackType.includes(popupType)) {
            var lastZIndex = _this.zIndexStack[_this.zIndexStack.length - 1];
            return zIndex === lastZIndex;
          }
          if (((_this$popupStack$popu = _this.popupStack[popupType]) === null || _this$popupStack$popu === void 0 ? void 0 : _this$popupStack$popu.size) > 1) {
            return zIndex === Array.from(_this.popupStack[popupType]).pop();
          }
          return true;
        });
        _defineProperty$1(this, "getLastZIndex", function() {
          return _this.zIndexStack[_this.zIndexStack.length - 1];
        });
      });
      var popupManager = new PopupManager();
      function usePopupManager(type) {
        var _ref = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, visible = _ref.visible, runOnMounted = _ref.runOnMounted;
        var zIndex = vue.ref(0);
        var open = function open2() {
          zIndex.value = popupManager.add(type);
        };
        var close2 = function close3() {
          popupManager["delete"](zIndex.value, type);
        };
        var isTopInteractivePopup = function isTopInteractivePopup2() {
          if (popupStackType.includes(type)) {
            return popupManager.isTopInteractivePopup(type, zIndex.value);
          }
          return false;
        };
        vue.watch(function() {
          return visible === null || visible === void 0 ? void 0 : visible.value;
        }, function(visible2) {
          if (visible2) {
            open();
          } else {
            close2();
          }
        }, {
          immediate: true
        });
        if (runOnMounted) {
          vue.onMounted(function() {
            open();
          });
          vue.onBeforeUnmount(function() {
            close2();
          });
        }
        return {
          zIndex: vue.readonly(zIndex),
          open,
          close: close2,
          isTopInteractivePopup
        };
      }
      function useReadonly(context) {
        var currentInstance = vue.getCurrentInstance();
        var componentReadonly = vue.computed(function() {
          return currentInstance.props.readonly;
        });
        var formReadonly = vue.inject("formReadonly", Object.create(null));
        return vue.computed(function() {
          var _formReadonly$readonl;
          if (isBoolean(void 0)) return context.beforeReadonly.value;
          if (isBoolean(componentReadonly === null || componentReadonly === void 0 ? void 0 : componentReadonly.value)) return componentReadonly.value;
          if (isBoolean(void 0)) return context.afterReadonly.value;
          if (isBoolean((_formReadonly$readonl = formReadonly.readonly) === null || _formReadonly$readonl === void 0 ? void 0 : _formReadonly$readonl.value)) return formReadonly.readonly.value;
          return false;
        });
      }
      function useResizeObserver(container, callback) {
        if (typeof window === "undefined") return;
        var isSupport = window && window.ResizeObserver;
        if (!isSupport) return;
        var containerObserver = null;
        var cleanupObserver = function cleanupObserver2() {
          if (!containerObserver || !container.value) return;
          containerObserver.unobserve(container.value);
          containerObserver.disconnect();
          containerObserver = null;
        };
        var addObserver = function addObserver2(el) {
          containerObserver = new ResizeObserver(callback);
          containerObserver.observe(el);
        };
        container && vue.watch(container, function(el) {
          cleanupObserver();
          el && addObserver(el);
        }, {
          immediate: true,
          flush: "post"
        });
        vue.onBeforeUnmount(function() {
          cleanupObserver();
        });
      }
      function setStyle(el, styles) {
        var keys2 = Object.keys(styles);
        keys2.forEach(function(key2) {
          el.style[key2] = styles[key2];
        });
      }
      var period = 200;
      var noneRippleBg = "rgba(0, 0, 0, 0)";
      var defaultRippleColor = "rgba(0, 0, 0, 0.35)";
      var getRippleColor = function getRippleColor2(el, fixedRippleColor) {
        var _el$dataset;
        if (el !== null && el !== void 0 && (_el$dataset = el.dataset) !== null && _el$dataset !== void 0 && _el$dataset.ripple) {
          var rippleColor = el.dataset.ripple;
          return rippleColor;
        }
        var cssVariable = getComputedStyle(el).getPropertyValue("--ripple-color");
        if (cssVariable) {
          return cssVariable;
        }
        return defaultRippleColor;
      };
      function useRipple(el, fixedRippleColor) {
        var rippleContainer = vue.ref(null);
        var classPrefix = usePrefixClass();
        var _useKeepAnimation = useKeepAnimation(), keepRipple = _useKeepAnimation.keepRipple;
        var handleAddRipple = function handleAddRipple2(e) {
          var dom = el.value;
          var rippleColor = getRippleColor(dom);
          if (e.button !== 0 || !el || !keepRipple) return;
          if (dom.classList.contains("".concat(classPrefix.value, "-is-active")) || dom.classList.contains("".concat(classPrefix.value, "-is-disabled")) || dom.classList.contains("".concat(classPrefix.value, "-is-checked")) || dom.classList.contains("".concat(classPrefix.value, "-is-loading"))) return;
          var elStyle = getComputedStyle(dom);
          var elBorder = parseInt(elStyle.borderWidth, 10);
          var border = elBorder > 0 ? elBorder : 0;
          var width = dom.offsetWidth;
          var height = dom.offsetHeight;
          if (rippleContainer.value.parentNode === null) {
            setStyle(rippleContainer.value, {
              position: "absolute",
              left: "".concat(0 - border, "px"),
              top: "".concat(0 - border, "px"),
              width: "".concat(width, "px"),
              height: "".concat(height, "px"),
              borderRadius: elStyle.borderRadius,
              pointerEvents: "none",
              overflow: "hidden"
            });
            dom.appendChild(rippleContainer.value);
          }
          var ripple2 = document.createElement("div");
          setStyle(ripple2, {
            marginTop: "0",
            marginLeft: "0",
            right: "".concat(width, "px"),
            width: "".concat(width + 20, "px"),
            height: "100%",
            transition: "transform ".concat(period, "ms cubic-bezier(.38, 0, .24, 1), background ").concat(period * 2, "ms linear"),
            transform: "skewX(-8deg)",
            pointerEvents: "none",
            position: "absolute",
            zIndex: 0,
            backgroundColor: rippleColor,
            opacity: "0.9"
          });
          var elMap = new WeakMap();
          for (var n = dom.children.length, i2 = 0; i2 < n; ++i2) {
            var child = dom.children[i2];
            if (child.style.zIndex === "" && child !== rippleContainer.value) {
              child.style.zIndex = "1";
              elMap.set(child, true);
            }
          }
          var initPosition = dom.style.position ? dom.style.position : getComputedStyle(dom).position;
          if (initPosition === "" || initPosition === "static") {
            dom.style.position = "relative";
          }
          rippleContainer.value.insertBefore(ripple2, rippleContainer.value.firstChild);
          setTimeout(function() {
            ripple2.style.transform = "translateX(".concat(width, "px)");
          }, 0);
          var _handleClearRipple = function handleClearRipple() {
            ripple2.style.backgroundColor = noneRippleBg;
            if (!el.value) return;
            el.value.removeEventListener("pointerup", _handleClearRipple, false);
            el.value.removeEventListener("pointerleave", _handleClearRipple, false);
            setTimeout(function() {
              ripple2.remove();
              if (rippleContainer.value.children.length === 0) rippleContainer.value.remove();
            }, period * 2 + 100);
          };
          el.value.addEventListener("pointerup", _handleClearRipple, false);
          el.value.addEventListener("pointerleave", _handleClearRipple, false);
        };
        vue.onMounted(function() {
          var dom = el === null || el === void 0 ? void 0 : el.value;
          if (!dom) return;
          rippleContainer.value = document.createElement("div");
          dom.addEventListener("pointerdown", handleAddRipple, false);
        });
        vue.onUnmounted(function() {
          var _el$value;
          el === null || el === void 0 || (_el$value = el.value) === null || _el$value === void 0 || _el$value.removeEventListener("pointerdown", handleAddRipple, false);
        });
      }
      function useTeleport(attach, triggerNode) {
        var to = isFunction(attach) ? vue.computed(attach) : vue.ref(attach);
        var innerTriggerNode = isFunction(triggerNode) ? vue.computed(triggerNode) : vue.ref(triggerNode);
        var element2 = vue.ref();
        var getElement = function getElement2() {
          element2.value = getAttach(to.value, innerTriggerNode.value);
        };
        vue.onMounted(function() {
          return getElement();
        });
        vue.watch([to, innerTriggerNode], function() {
          return getElement();
        });
        return element2;
      }
      function useVModel(value, modelValue, defaultValue, onChange) {
        var propName = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : "value";
        var _getCurrentInstance = vue.getCurrentInstance(), emit = _getCurrentInstance.emit, vnode = _getCurrentInstance.vnode;
        var internalValue = vue.ref();
        var vProps = vnode.props || {};
        var isVM = Object.prototype.hasOwnProperty.call(vProps, "modelValue") || Object.prototype.hasOwnProperty.call(vProps, "model-value");
        var isVMP = Object.prototype.hasOwnProperty.call(vProps, propName) || Object.prototype.hasOwnProperty.call(vProps, kebabCase(propName));
        if (isVM) {
          return [modelValue, function(newValue) {
            emit("update:modelValue", newValue);
            for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
              args[_key - 1] = arguments[_key];
            }
            onChange === null || onChange === void 0 || onChange.apply(void 0, [newValue].concat(args));
          }];
        }
        if (isVMP) {
          return [value, function(newValue) {
            emit("update:".concat(propName), newValue);
            for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
              args[_key2 - 1] = arguments[_key2];
            }
            onChange === null || onChange === void 0 || onChange.apply(void 0, [newValue].concat(args));
          }];
        }
        internalValue.value = defaultValue;
        return [internalValue, function(newValue) {
          internalValue.value = newValue;
          for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
            args[_key3 - 1] = arguments[_key3];
          }
          onChange === null || onChange === void 0 || onChange.apply(void 0, [newValue].concat(args));
        }];
      }
      function useVirtualScrollNew(container, params) {
        var _params$value$data, _params$value$scroll;
        var visibleData = vue.ref([]);
        var translateY = vue.ref((((_params$value$data = params.value.data) === null || _params$value$data === void 0 ? void 0 : _params$value$data.length) || 0) * (((_params$value$scroll = params.value.scroll) === null || _params$value$scroll === void 0 ? void 0 : _params$value$scroll.rowHeight) || 50));
        var scrollHeight = vue.ref(0);
        var trHeightList = [];
        var containerHeight = vue.ref(0);
        var containerWidth = vue.ref(0);
        var startAndEndIndex = vue.ref([0, 15]);
        var tScroll = vue.computed(function() {
          var _scroll$isFixedRowHei, _scroll$fixedRows;
          var scroll = params.value.scroll;
          if (!scroll) return {};
          return {
            bufferSize: scroll.bufferSize || 10,
            isFixedRowHeight: (_scroll$isFixedRowHei = scroll.isFixedRowHeight) !== null && _scroll$isFixedRowHei !== void 0 ? _scroll$isFixedRowHei : false,
            rowHeight: scroll.rowHeight || 47,
            threshold: scroll.threshold || 100,
            type: scroll.type,
            fixedRows: (_scroll$fixedRows = scroll.fixedRows) !== null && _scroll$fixedRows !== void 0 ? _scroll$fixedRows : [0, 0]
          };
        });
        var isVirtualScroll = vue.computed(function() {
          var data = params.value.data;
          return tScroll.value.type === "virtual" && tScroll.value.threshold < data.length;
        });
        function getVisibleRangeConfig() {
          var _container$value$scro, _container$value;
          var scrollTop = (_container$value$scro = (_container$value = container.value) === null || _container$value === void 0 ? void 0 : _container$value.scrollTop) !== null && _container$value$scro !== void 0 ? _container$value$scro : 0;
          var fixedStart = tScroll.value.fixedRows[0];
          var prevBufferHeightList = [];
          var hiddenHeight = 0;
          var visibleStart = -1;
          var visibleEnd = -1;
          var totalHeight = 0;
          for (var i2 = 0, len = params.value.data.length; i2 < len; i2++) {
            var _trHeightList$i;
            var rowHeight = (_trHeightList$i = trHeightList[i2]) !== null && _trHeightList$i !== void 0 ? _trHeightList$i : tScroll.value.rowHeight;
            totalHeight = totalHeight + rowHeight;
            if (totalHeight > scrollTop && visibleStart === -1) {
              visibleStart = i2;
              if (visibleStart - tScroll.value.bufferSize > 0) {
                hiddenHeight = totalHeight - rowHeight - sum(prevBufferHeightList);
              }
            }
            if (visibleStart === -1) {
              prevBufferHeightList.push(rowHeight);
              if (prevBufferHeightList.length > tScroll.value.bufferSize) {
                prevBufferHeightList.shift();
              }
            }
            if (visibleEnd === -1 && (totalHeight > containerHeight.value + scrollTop || i2 === params.value.data.length - 1)) {
              visibleEnd = i2;
            }
            if (visibleStart !== -1 && visibleEnd !== -1) {
              break;
            }
          }
          var startIndex = max$1([visibleStart - tScroll.value.bufferSize, 0]);
          var endIndex = min$1([visibleEnd + tScroll.value.bufferSize, params.value.data.length]);
          var stickyHeight = sum(trHeightList.slice(0, Math.min(startIndex, fixedStart)));
          return {
            startIndex,
            endIndex,
            translateY: hiddenHeight - stickyHeight
          };
        }
        var updateVisibleData = throttle(function() {
          var _getVisibleRangeConfi = getVisibleRangeConfig(), startIndex = _getVisibleRangeConfi.startIndex, endIndex = _getVisibleRangeConfi.endIndex, translateYValue = _getVisibleRangeConfi.translateY;
          var fixedRows = tScroll.value.fixedRows;
          var _fixedRows = _slicedToArray(fixedRows, 2), fixedStart = _fixedRows[0], fixedEnd = _fixedRows[1];
          var fixedStartData = fixedStart ? params.value.data.slice(0, fixedStart) : [];
          if (fixedStart && startIndex < fixedStart) {
            fixedStartData = fixedStartData.slice(0, startIndex);
          }
          var fixedEndData = fixedEnd ? params.value.data.slice(params.value.data.length - fixedEnd) : [];
          var bottomStartIndex = endIndex - params.value.data.length + 1 + (fixedEnd !== null && fixedEnd !== void 0 ? fixedEnd : 0);
          if (fixedEnd && bottomStartIndex > 0) {
            fixedEndData = fixedEndData.slice(bottomStartIndex);
          }
          if (startAndEndIndex.value.join() !== [startIndex, endIndex].join() && startIndex >= 0) {
            translateY.value = translateYValue;
            visibleData.value = fixedStartData.concat(params.value.data.slice(startIndex, endIndex), fixedEndData);
            startAndEndIndex.value = [startIndex, endIndex];
          }
        }, 100);
        var handleRowMounted = function handleRowMounted2(rowData) {
          var _rowData$ref$value;
          if (!isVirtualScroll.value || !rowData || tScroll.value.isFixedRowHeight || !container.value) return;
          var trHeight = ((_rowData$ref$value = rowData.ref.value) === null || _rowData$ref$value === void 0 ? void 0 : _rowData$ref$value.getBoundingClientRect().height) || tScroll.value.rowHeight;
          var rowIndex = rowData.data.VIRTUAL_SCROLL_INDEX;
          if (trHeightList[rowIndex] !== trHeight) {
            var diff = trHeight - trHeightList[rowIndex];
            trHeightList[rowIndex] = trHeight;
            scrollHeight.value = scrollHeight.value + diff;
          }
        };
        var handleScroll = function handleScroll2() {
          if (!isVirtualScroll.value) return;
          updateVisibleData();
        };
        var refreshVirtualScroll = function refreshVirtualScroll2(_ref) {
          var _ref2 = _slicedToArray(_ref, 1), contentRect = _ref2[0].contentRect;
          if (params.value.preventResizeRefresh) return;
          var maxScrollbarWidth = 16;
          if (Math.abs(contentRect.width - containerWidth.value) > maxScrollbarWidth && !!container.value) {
            container.value.scrollTop = 0;
            translateY.value = 0;
          }
          containerWidth.value = contentRect.width;
          containerHeight.value = contentRect.height;
        };
        var addIndexToData = function addIndexToData2(data) {
          data.forEach(function(item, index) {
            item["VIRTUAL_SCROLL_INDEX"] = index;
          });
        };
        var updateScrollTop = function updateScrollTop2(_ref3) {
          var index = _ref3.index, _ref3$top = _ref3.top, top2 = _ref3$top === void 0 ? 0 : _ref3$top, behavior = _ref3.behavior;
          var scrollTop = sum(trHeightList.slice(0, index + 1)) - top2;
          container.value.scrollTo({
            top: scrollTop,
            behavior: behavior || "auto"
          });
        };
        var scrollToElement = function scrollToElement2(p) {
          updateScrollTop(p);
          if (!tScroll.value.isFixedRowHeight) {
            var _p$time;
            var duration = (_p$time = p.time) !== null && _p$time !== void 0 ? _p$time : 60;
            var timer = setTimeout(function() {
              updateScrollTop(p);
              clearTimeout(timer);
            }, duration);
          }
        };
        useResizeObserver(vue.computed(function() {
          return isVirtualScroll.value ? container.value : void 0;
        }), refreshVirtualScroll);
        vue.watch(function() {
          return [_toConsumableArray(params.value.data), tScroll.value, isVirtualScroll.value, container.value];
        }, function() {
          if (!isVirtualScroll.value || !container.value) return;
          var data = params.value.data;
          addIndexToData(data);
          containerHeight.value = container.value.getBoundingClientRect().height;
          if (trHeightList.length !== params.value.data.length) {
            var initHeightList = Array.from(trHeightList);
            initHeightList.length = params.value.data.length;
            initHeightList.fill(tScroll.value.rowHeight || 47);
            trHeightList = initHeightList;
          }
          scrollHeight.value = sum(trHeightList);
          startAndEndIndex.value = [0, 0];
          updateVisibleData();
        }, {
          immediate: true
        });
        vue.watch(function() {
          return containerHeight.value;
        }, function() {
          updateVisibleData();
        });
        return {
          visibleData,
          translateY,
          scrollHeight,
          isVirtualScroll,
          handleScroll,
          handleRowMounted,
          scrollToElement
        };
      }
      /**
       * tdesign v1.17.1
       * (c) 2025 tdesign
       * @license MIT
       */
      function _objectWithoutPropertiesLoose(r, e) {
        if (null == r) return {};
        var t2 = {};
        for (var n in r) if ({}.hasOwnProperty.call(r, n)) {
          if (-1 !== e.indexOf(n)) continue;
          t2[n] = r[n];
        }
        return t2;
      }
      function _objectWithoutProperties(e, t2) {
        if (null == e) return {};
        var o, r, i2 = _objectWithoutPropertiesLoose(e, t2);
        if (Object.getOwnPropertySymbols) {
          var n = Object.getOwnPropertySymbols(e);
          for (r = 0; r < n.length; r++) o = n[r], -1 === t2.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i2[o] = e[o]);
        }
        return i2;
      }
      /**
       * tdesign v1.17.1
       * (c) 2025 tdesign
       * @license MIT
       */
      function getValidAttrs(obj) {
        var newObj = {};
        Object.keys(obj).forEach(function(key2) {
          if (!isUndefined(obj[key2]) || isNull(obj[key2])) {
            newObj[key2] = obj[key2];
          }
        });
        return newObj;
      }
      function getIEVersion() {
        if (typeof navigator === "undefined" || !navigator) return Number.MAX_SAFE_INTEGER;
        var _navigator = navigator, userAgent = _navigator.userAgent;
        var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1;
        var isIE11 = userAgent.indexOf("Trident") > -1 && userAgent.indexOf("rv:11.0") > -1;
        if (isIE) {
          var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
          var match = userAgent.match(reIE);
          if (!match) return -1;
          var fIEVersion = parseFloat(match[1]);
          return fIEVersion < 7 ? 6 : fIEVersion;
        }
        if (isIE11) {
          return 11;
        }
        return Number.MAX_SAFE_INTEGER;
      }
      function getCharacterLength(str, maxCharacter) {
        var hasMaxCharacter = isNumber(maxCharacter);
        if (!str || str.length === 0) {
          if (hasMaxCharacter) {
            return {
              length: 0,
              characters: str
            };
          }
          return 0;
        }
        var len = 0;
        for (var i2 = 0; i2 < str.length; i2++) {
          var currentStringLength = 0;
          if (str.charCodeAt(i2) > 127) {
            currentStringLength = 2;
          } else {
            currentStringLength = 1;
          }
          if (hasMaxCharacter && len + currentStringLength > maxCharacter) {
            return {
              length: len,
              characters: str.slice(0, i2)
            };
          }
          len += currentStringLength;
        }
        if (hasMaxCharacter) {
          return {
            length: len,
            characters: str
          };
        }
        return len;
      }
      function getUnicodeLength(str) {
        return _toConsumableArray(str !== null && str !== void 0 ? str : "").length;
      }
      function limitUnicodeMaxLength(str, maxLength, oldStr) {
        if (_toConsumableArray("").slice().length === maxLength) return oldStr || "";
        return _toConsumableArray(str !== null && str !== void 0 ? str : "").slice(0, maxLength).join("");
      }
      var DOM_STYLE_PROPS = ["padding-top", "padding-bottom", "padding-left", "padding-right", "font-family", "font-weight", "font-size", "font-variant", "text-rendering", "text-transform", "width", "text-indent", "border-width", "box-sizing", "line-height", "letter-spacing"];
      function calculateNodeSize(targetElement) {
        if (typeof window === "undefined") {
          return {
            paddingSize: 0,
            borderSize: 0,
            boxSizing: 0,
            sizingStyle: ""
          };
        }
        var style = window.getComputedStyle(targetElement);
        var boxSizing = style.getPropertyValue("box-sizing") || style.getPropertyValue("-moz-box-sizing") || style.getPropertyValue("-webkit-box-sizing");
        var paddingSize = parseFloat(style.getPropertyValue("padding-bottom")) + parseFloat(style.getPropertyValue("padding-top"));
        var borderSize = parseFloat(style.getPropertyValue("border-bottom-width")) + parseFloat(style.getPropertyValue("border-top-width"));
        var sizingStyle = DOM_STYLE_PROPS.map(function(name) {
          return "".concat(name, ":").concat(style.getPropertyValue(name));
        }).join(";");
        return {
          paddingSize,
          borderSize,
          boxSizing,
          sizingStyle
        };
      }
      /**
       * tdesign v1.17.1
       * (c) 2025 tdesign
       * @license MIT
       */
      function ownKeys$r(e, r) {
        var t2 = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
          var o = Object.getOwnPropertySymbols(e);
          r && (o = o.filter(function(r2) {
            return Object.getOwnPropertyDescriptor(e, r2).enumerable;
          })), t2.push.apply(t2, o);
        }
        return t2;
      }
      function _objectSpread$r(e) {
        for (var r = 1; r < arguments.length; r++) {
          var t2 = null != arguments[r] ? arguments[r] : {};
          r % 2 ? ownKeys$r(Object(t2), true).forEach(function(r2) {
            _defineProperty$1(e, r2, t2[r2]);
          }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t2)) : ownKeys$r(Object(t2)).forEach(function(r2) {
            Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t2, r2));
          });
        }
        return e;
      }
      function circleAdapter(circleElem) {
        var _window, _window$getComputedSt2, _window2;
        var basicStyle = {};
        if (!circleElem || typeof window === "undefined") {
          return;
        }
        var _window$getComputedSt = (_window = window) === null || _window === void 0 || (_window$getComputedSt2 = _window.getComputedStyle) === null || _window$getComputedSt2 === void 0 ? void 0 : _window$getComputedSt2.call(_window, circleElem), color = _window$getComputedSt.color, fontSize = _window$getComputedSt.fontSize;
        var ua = (_window2 = window) === null || _window2 === void 0 || (_window2 = _window2.navigator) === null || _window2 === void 0 ? void 0 : _window2.userAgent;
        var isSafari = /Safari/.test(ua) && !/Chrome/.test(ua);
        var isIosWechat = /(?=.*iPhone)[?=.*MicroMessenger]/.test(ua) && !/Chrome/.test(ua);
        var isIpadWechat = /(?=.*iPad)[?=.*MicroMessenger]/.test(ua) && !/Chrome/.test(ua);
        if (isSafari || isIosWechat || isIpadWechat) {
          basicStyle = {
            transformOrigin: "0px 0px",
            transform: "scale(".concat(parseInt(fontSize, 10) / 12, ")")
          };
        }
        if (color && getIEVersion() > 11) {
          var matched = color.match(/[\d.]+/g);
          var endColor = matched ? "rgba(".concat(matched[0], ", ").concat(matched[1], ", ").concat(matched[2], ", 0)") : "";
          setStyle(circleElem, _objectSpread$r(_objectSpread$r({}, basicStyle), {}, {
            background: "conic-gradient(from 90deg at 50% 50%,".concat(endColor, " 0deg, ").concat(color, " 360deg)")
          }));
        } else {
          setStyle(circleElem, _objectSpread$r(_objectSpread$r({}, basicStyle), {}, {
            background: ""
          }));
        }
      }
      var GradientIcon = vue.defineComponent({
        name: "TLoadingGradient",
        setup: function setup() {
          var classPrefix = usePrefixClass();
          var circleRef = vue.ref();
          vue.onMounted(function() {
            vue.nextTick(function() {
              circleAdapter(circleRef.value);
            });
          });
          return function() {
            var name = "".concat(classPrefix.value, "-loading__gradient");
            var classes = [name, "".concat(classPrefix.value, "-icon-loading")];
            return vue.createVNode("svg", {
              "class": classes,
              "viewBox": "0 0 12 12",
              "version": "1.1",
              "width": "1em",
              "height": "1em",
              "xmlns": "http://www.w3.org/2000/svg"
            }, [vue.createVNode("foreignObject", {
              "x": "0",
              "y": "0",
              "width": "12",
              "height": "12"
            }, [vue.createVNode("div", {
              "class": "".concat(name, "-conic"),
              "ref": circleRef
            }, null)])]);
          };
        }
      });
      /**
       * tdesign v1.17.1
       * (c) 2025 tdesign
       * @license MIT
       */
      var props$d = {
        attach: {
          type: [String, Function],
          "default": ""
        },
        content: {
          type: [String, Function]
        },
        "default": {
          type: [String, Function]
        },
        delay: {
          type: Number,
          "default": 0
        },
        fullscreen: Boolean,
        indicator: {
          type: [Boolean, Function],
          "default": true
        },
        inheritColor: Boolean,
        loading: {
          type: Boolean,
          "default": true
        },
        preventScrollThrough: {
          type: Boolean,
          "default": true
        },
        showOverlay: {
          type: Boolean,
          "default": true
        },
        size: {
          type: String,
          "default": "medium"
        },
        text: {
          type: [String, Function]
        },
        zIndex: {
          type: Number
        }
      };
      /**
       * tdesign v1.17.1
       * (c) 2025 tdesign
       * @license MIT
       */
      var useComponentClassName = function useComponentClassName2() {
        return {
          name: usePrefixClass("loading"),
          centerClass: usePrefixClass("loading--center"),
          fullscreenClass: usePrefixClass("loading__fullscreen"),
          lockClass: usePrefixClass("loading--lock"),
          overlayClass: usePrefixClass("loading__overlay"),
          relativeClass: usePrefixClass("loading__parent"),
          fullClass: usePrefixClass("loading--full"),
          inheritColorClass: usePrefixClass("loading--inherit-color")
        };
      };
      var _Loading = vue.defineComponent({
        name: "TLoading",
        inheritAttrs: false,
        props: props$d,
        setup: function setup(props2, _ref) {
          var slots = _ref.slots, attrs = _ref.attrs;
          var delayShowLoading = vue.ref(false);
          var _useComponentClassNam = useComponentClassName(), name = _useComponentClassNam.name, centerClass = _useComponentClassNam.centerClass, fullscreenClass = _useComponentClassNam.fullscreenClass, lockClass = _useComponentClassNam.lockClass, overlayClass = _useComponentClassNam.overlayClass, relativeClass = _useComponentClassNam.relativeClass, fullClass = _useComponentClassNam.fullClass, inheritColorClass = _useComponentClassNam.inheritColorClass;
          var classPrefix = usePrefixClass();
          var renderTNodeJSX = useTNodeJSX();
          var renderContent = useContent();
          var _useCommonClassName = useCommonClassName$1(), SIZE = _useCommonClassName.SIZE;
          var countDelay = function countDelay2() {
            delayShowLoading.value = false;
            var timer = setTimeout(function() {
              delayShowLoading.value = true;
              clearTimeout(timer);
            }, props2.delay);
          };
          var teleportElement = useTeleport(function() {
            return props2.attach;
          });
          var delayCounted = vue.computed(function() {
            return Boolean(!props2.delay || props2.delay && delayShowLoading.value);
          });
          var styles = vue.computed(function() {
            var styles2 = {};
            if (props2.zIndex !== void 0) {
              styles2.zIndex = props2.zIndex;
            }
            if (!["small", "medium", "large"].includes(props2.size)) {
              styles2["font-size"] = props2.size;
            }
            return styles2;
          });
          var hasContent = vue.computed(function() {
            return Boolean(props2["default"] || slots["default"] || props2.content || slots.content);
          });
          var lockFullscreen = vue.computed(function() {
            return props2.preventScrollThrough && props2.fullscreen;
          });
          var showText = vue.computed(function() {
            return Boolean(props2.text || slots.text);
          });
          var showWrapLoading = vue.computed(function() {
            return hasContent.value && props2.loading && delayCounted.value;
          });
          var showFullScreenLoading = vue.computed(function() {
            return props2.fullscreen && props2.loading && delayCounted.value;
          });
          var showAttachedLoading = vue.computed(function() {
            return props2.attach && props2.loading && delayCounted.value;
          });
          var classes = vue.computed(function() {
            var baseClasses = [centerClass.value, getPropertyValFromObj(SIZE.value, props2.size), _defineProperty$1({}, inheritColorClass.value, props2.inheritColor)];
            var fullScreenClasses = [name.value, fullscreenClass.value, centerClass.value, overlayClass.value];
            return {
              baseClasses,
              attachClasses: baseClasses.concat([name.value, fullClass.value, _defineProperty$1({}, overlayClass.value, props2.showOverlay)]),
              withContentClasses: baseClasses.concat([name.value, fullClass.value, _defineProperty$1({}, overlayClass.value, props2.showOverlay)]),
              fullScreenClasses,
              normalClasses: baseClasses.concat([name.value])
            };
          });
          var _toRefs = vue.toRefs(props2), loading = _toRefs.loading;
          vue.watch([loading], function(_ref5) {
            var _ref6 = _slicedToArray(_ref5, 1), isLoading = _ref6[0];
            if (isLoading) {
              countDelay();
              lockFullscreen.value && addClass(document.body, lockClass.value);
            } else {
              lockFullscreen.value && removeClass(document.body, lockClass.value);
            }
          });
          vue.onMounted(function() {
            props2.delay && countDelay();
          });
          return function() {
            var _classes$value = classes.value, fullScreenClasses = _classes$value.fullScreenClasses, baseClasses = _classes$value.baseClasses, withContentClasses = _classes$value.withContentClasses, attachClasses = _classes$value.attachClasses, normalClasses = _classes$value.normalClasses;
            var defaultIndicator = vue.createVNode(GradientIcon, {
              "size": props2.size
            }, null);
            var indicator = loading.value && renderTNodeJSX("indicator", defaultIndicator);
            var text = showText.value && vue.createVNode("div", {
              "class": "".concat(classPrefix.value, "-loading__text")
            }, [renderTNodeJSX("text")]);
            if (props2.fullscreen) {
              if (!showFullScreenLoading.value || !props2.loading) return null;
              return vue.createVNode(vue.Teleport, {
                "disabled": !props2.attach || !teleportElement.value,
                "to": teleportElement.value
              }, {
                "default": function _default() {
                  return [vue.createVNode("div", vue.mergeProps({
                    "class": fullScreenClasses,
                    "style": styles.value
                  }, attrs), [vue.createVNode("div", {
                    "class": baseClasses
                  }, [indicator, text])])];
                }
              });
            }
            if (hasContent.value) {
              return vue.createVNode("div", vue.mergeProps({
                "class": relativeClass.value
              }, attrs), [renderContent("default", "content"), showWrapLoading.value && vue.createVNode("div", {
                "class": withContentClasses,
                "style": styles.value
              }, [indicator, text])]);
            }
            if (props2.attach) {
              if (!showAttachedLoading.value || !loading.value) return null;
              return vue.createVNode(vue.Teleport, {
                "disabled": !props2.attach || !teleportElement.value,
                "to": teleportElement.value
              }, {
                "default": function _default() {
                  return [vue.createVNode("div", vue.mergeProps({
                    "class": attachClasses,
                    "style": styles.value
                  }, attrs), [indicator, text])];
                }
              });
            }
            return loading.value ? vue.createVNode("div", vue.mergeProps({
              "class": normalClasses,
              "style": styles.value
            }, attrs), [indicator, text]) : null;
          };
        }
      });
      /**
       * tdesign v1.17.1
       * (c) 2025 tdesign
       * @license MIT
       */
      var fullScreenLoadingInstance = null;
      function mergeDefaultProps(props2) {
        var options = merge({
          fullscreen: false,
          attach: "body",
          loading: true,
          preventScrollThrough: true
        }, props2);
        return options;
      }
      function createLoading(props2, context) {
        var mergedProps = mergeDefaultProps(props2);
        if (mergedProps.fullscreen && fullScreenLoadingInstance) {
          return fullScreenLoadingInstance;
        }
        var component = vue.defineComponent({
          setup: function setup() {
            var loadingOptions = vue.reactive(mergedProps);
            return function() {
              return vue.h(_Loading, loadingOptions);
            };
          }
        });
        var attach = getAttach(mergedProps.fullscreen ? "body" : mergedProps.attach);
        var instance = vue.createVNode(component);
        if (context !== null && context !== void 0 ? context : LoadingPlugin._context) {
          instance.appContext = context !== null && context !== void 0 ? context : LoadingPlugin._context;
        }
        var wrapper = document.createElement("div");
        vue.render(instance, wrapper);
        var parentRelativeClass = usePrefixClass("loading__parent--relative").value;
        var lockClass = usePrefixClass("loading--lock");
        var lockFullscreen = mergedProps.preventScrollThrough && mergedProps.fullscreen;
        if (lockFullscreen) {
          addClass(document.body, lockClass.value);
        }
        if (attach) {
          addClass(attach, parentRelativeClass);
        } else {
          console.error("attach is not exist");
        }
        var loadingInstance = {
          hide: function hide2() {
            removeClass(attach, parentRelativeClass);
            removeClass(document.body, lockClass.value);
            vue.render(null, wrapper);
            wrapper.remove();
          }
        };
        return loadingInstance;
      }
      function produceLoading(props2, context) {
        if (props2 === true) {
          fullScreenLoadingInstance = createLoading({
            fullscreen: true,
            loading: true,
            attach: "body",
            preventScrollThrough: true
          }, context);
          return fullScreenLoadingInstance;
        }
        if (props2 === false) {
          var _fullScreenLoadingIns;
          (_fullScreenLoadingIns = fullScreenLoadingInstance) === null || _fullScreenLoadingIns === void 0 || _fullScreenLoadingIns.hide();
          fullScreenLoadingInstance = null;
          return;
        }
        return createLoading(props2);
      }
      var LoadingPlugin = produceLoading;
      LoadingPlugin.install = function(app) {
        app.config.globalProperties.$loading = produceLoading;
        LoadingPlugin._context = app._context;
      };
      /**
       * tdesign v1.17.1
       * (c) 2025 tdesign
       * @license MIT
       */
      var INSTANCE_KEY = Symbol("TdLoading");
      var createInstance = function createInstance2(el, binding) {
        var _binding$modifiers = binding.modifiers, fullscreen = _binding$modifiers.fullscreen, inheritColor = _binding$modifiers.inheritColor;
        var options = {
          attach: function attach() {
            return el;
          },
          fullscreen: fullscreen !== null && fullscreen !== void 0 ? fullscreen : false,
          inheritColor: inheritColor !== null && inheritColor !== void 0 ? inheritColor : false,
          loading: binding.value
        };
        if (isObject(binding.value)) {
          mapKeys(binding.value, function(value, key2) {
            options[key2] = value;
          });
        }
        el[INSTANCE_KEY] = {
          options,
          instance: LoadingPlugin(options)
        };
      };
      var vLoading = {
        mounted: function mounted(el, binding) {
          if (binding.value) {
            createInstance(el, binding);
          }
        },
        updated: function updated(el, binding) {
          var instance = el[INSTANCE_KEY];
          var value = binding.value, oldValue = binding.oldValue;
          if (!isEqual(value, oldValue)) {
            var _value$loading;
            var loading = (_value$loading = value === null || value === void 0 ? void 0 : value.loading) !== null && _value$loading !== void 0 ? _value$loading : value;
            if (loading) {
              createInstance(el, binding);
            } else {
              instance === null || instance === void 0 || instance.instance.hide();
            }
          }
        },
        unmounted: function unmounted(el) {
          var _el$INSTANCE_KEY;
          (_el$INSTANCE_KEY = el[INSTANCE_KEY]) === null || _el$INSTANCE_KEY === void 0 || _el$INSTANCE_KEY.instance.hide();
        }
      };
      const indexCss$b = "@keyframes t-fade-in{0%{opacity:0}to{opacity:1}}@keyframes t-fade-out{0%{opacity:1}to{opacity:0}}@keyframes t-spin{0%{transform:rotate(0)}to{transform:rotate(360deg)}}.t-icon-loading{animation:t-spin 1s linear infinite}@keyframes t-zoom-out{0%{transform:scale(.2)}to{transform:scale(1)}}.t-loading{font:var(--td-font-body-medium);color:var(--td-text-color-primary);box-sizing:border-box;margin:0;padding:0;list-style:none;position:relative;color:var(--td-brand-color);font-size:var(--td-comp-size-l)}.t-loading--lock{overflow:hidden}.t-loading.t-size-s{font-size:var(--td-comp-size-xxxs)}.t-loading.t-size-l{font-size:var(--td-comp-size-xxxl)}.t-loading__parent--relative{position:relative!important}.t-loading__fullscreen{position:fixed;top:0;left:0;width:100%;height:100%;z-index:3500}.t-loading--center{display:inline-flex;align-items:center;vertical-align:middle;justify-content:center}.t-loading__content{position:absolute;left:48%;top:20%}.t-loading--inherit-color{color:inherit}.t-loading__parent{position:relative}.t-loading__overlay{background-color:var(--td-mask-disabled)}.t-loading--full{position:absolute;top:0;left:0;width:100%;height:100%;z-index:3500}.t-loading--hidden{visibility:hidden}.t-loading--visible{visibility:visible}.t-loading__text{width:auto;display:inline-block;vertical-align:middle;font:var(--td-font-body-medium);margin-left:var(--td-comp-margin-xs)}.t-loading__gradient{display:inline-flex;justify-content:center;align-items:center;vertical-align:middle}.t-loading__gradient-conic{width:100%;height:100%;border-radius:var(--td-radius-circle);background:conic-gradient(from 90deg at 50% 50%,#fff 0deg,currentcolor 360deg);-webkit-mask:radial-gradient(transparent calc(50% - .5px),#fff 50%);mask:radial-gradient(transparent calc(50% - .5px),#fff 50%)}";
      importCSS(indexCss$b);
      /**
       * tdesign v1.17.1
       * (c) 2025 tdesign
       * @license MIT
       */
      var Loading = withInstall(_Loading, _Loading.name, {
        name: "loading",
        comp: vLoading
      });
      /**
       * tdesign v1.17.1
       * (c) 2025 tdesign
       * @license MIT
       */
      var props$c = {
        block: Boolean,
        content: {
          type: [String, Function]
        },
        "default": {
          type: [String, Function]
        },
        disabled: {
          type: Boolean,
          "default": void 0
        },
        form: {
          type: String,
          "default": void 0
        },
        ghost: Boolean,
        href: {
          type: String,
          "default": ""
        },
        icon: {
          type: Function
        },
        loading: Boolean,
        loadingProps: {
          type: Object
        },
        shape: {
          type: String,
          "default": "rectangle",
          validator: function validator(val) {
            if (!val) return true;
            return ["rectangle", "square", "round", "circle"].includes(val);
          }
        },
        size: {
          type: String,
          "default": "medium",
          validator: function validator(val) {
            if (!val) return true;
            return ["extra-small", "small", "medium", "large"].includes(val);
          }
        },
        suffix: {
          type: Function
        },
        tag: {
          type: String,
          validator: function validator(val) {
            if (!val) return true;
            return ["button", "a", "div"].includes(val);
          }
        },
        theme: {
          type: String,
          validator: function validator(val) {
            if (!val) return true;
            return ["default", "primary", "danger", "warning", "success"].includes(val);
          }
        },
        type: {
          type: String,
          "default": "button",
          validator: function validator(val) {
            if (!val) return true;
            return ["submit", "reset", "button"].includes(val);
          }
        },
        variant: {
          type: String,
          "default": "base",
          validator: function validator(val) {
            if (!val) return true;
            return ["base", "outline", "dashed", "text"].includes(val);
          }
        },
        onClick: Function
      };
      const indexCss$a = ".t-button{font:var(--td-font-body-medium);color:var(--td-text-color-primary);box-sizing:border-box;margin:0;padding:0;list-style:none;position:relative;z-index:0;overflow:hidden;font-size:var(--td-font-body-medium);outline:none;border-width:1px;border-style:solid;border-color:transparent;background-color:transparent;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;vertical-align:middle;white-space:nowrap;border-radius:var(--td-radius-default);transition:all .2s linear;touch-action:manipulation;text-decoration:none}.t-button .t-button__text,.t-button .t-icon{position:relative;z-index:1;display:inline-flex}.t-button .t-icon,.t-button .t-loading{font-size:var(--td-font-size-body-large)}.t-button .t-icon+.t-button__text:not(:empty){margin-left:8px}.t-button .t-loading+.t-button__text:not(:empty){margin-left:8px}.t-button .t-button__suffix:not(:empty){display:inline-flex;margin-left:8px}.t-button--variant-base{color:var(--td-text-color-anti);height:var(--td-comp-size-m);font:var(--td-font-body-medium);padding-left:calc(var(--td-comp-paddingLR-l) - 1px);padding-right:calc(var(--td-comp-paddingLR-l) - 1px);background-color:var(--td-bg-color-component);border-color:var(--td-bg-color-component);color:var(--td-text-color-primary)}.t-button--variant-base .t-icon,.t-button--variant-base .t-loading{font-size:var(--td-font-size-body-large)}.t-button--variant-base:hover,.t-button--variant-base:focus-visible{background-color:var(--td-bg-color-component-hover)}.t-button--variant-base.t-is-loading,.t-button--variant-base.t-is-disabled{background-color:var(--td-bg-color-component-disabled)}.t-button--variant-base:hover,.t-button--variant-base:focus-visible{border-color:var(--td-bg-color-component-hover)}.t-button--variant-base.t-is-loading,.t-button--variant-base.t-is-disabled{border-color:var(--td-bg-color-component-disabled)}.t-button--variant-base:hover,.t-button--variant-base:focus-visible{color:var(--td-text-color-primary)}.t-button--variant-base.t-is-loading,.t-button--variant-base.t-is-disabled{color:var(--td-text-color-disabled)}.t-button--variant-base.t-button--theme-primary{color:var(--td-text-color-anti);background-color:var(--td-brand-color);border-color:var(--td-brand-color)}.t-button--variant-base.t-button--theme-primary:hover,.t-button--variant-base.t-button--theme-primary:focus-visible{background-color:var(--td-brand-color-hover)}.t-button--variant-base.t-button--theme-primary.t-is-loading,.t-button--variant-base.t-button--theme-primary.t-is-disabled{background-color:var(--td-brand-color-disabled)}.t-button--variant-base.t-button--theme-primary:hover,.t-button--variant-base.t-button--theme-primary:focus-visible{border-color:var(--td-brand-color-hover)}.t-button--variant-base.t-button--theme-primary.t-is-loading,.t-button--variant-base.t-button--theme-primary.t-is-disabled{border-color:var(--td-brand-color-disabled)}.t-button--variant-base.t-button--theme-success{color:var(--td-text-color-anti);background-color:var(--td-success-color);border-color:var(--td-success-color)}.t-button--variant-base.t-button--theme-success:hover,.t-button--variant-base.t-button--theme-success:focus-visible{background-color:var(--td-success-color-hover)}.t-button--variant-base.t-button--theme-success.t-is-loading,.t-button--variant-base.t-button--theme-success.t-is-disabled{background-color:var(--td-success-color-disabled)}.t-button--variant-base.t-button--theme-success:hover,.t-button--variant-base.t-button--theme-success:focus-visible{border-color:var(--td-success-color-hover)}.t-button--variant-base.t-button--theme-success.t-is-loading,.t-button--variant-base.t-button--theme-success.t-is-disabled{border-color:var(--td-success-color-disabled)}.t-button--variant-base.t-button--theme-warning{color:var(--td-text-color-anti);background-color:var(--td-warning-color);border-color:var(--td-warning-color)}.t-button--variant-base.t-button--theme-warning:hover,.t-button--variant-base.t-button--theme-warning:focus-visible{background-color:var(--td-warning-color-hover)}.t-button--variant-base.t-button--theme-warning.t-is-loading,.t-button--variant-base.t-button--theme-warning.t-is-disabled{background-color:var(--td-warning-color-disabled)}.t-button--variant-base.t-button--theme-warning:hover,.t-button--variant-base.t-button--theme-warning:focus-visible{border-color:var(--td-warning-color-hover)}.t-button--variant-base.t-button--theme-warning.t-is-loading,.t-button--variant-base.t-button--theme-warning.t-is-disabled{border-color:var(--td-warning-color-disabled)}.t-button--variant-base.t-button--theme-danger{color:var(--td-text-color-anti);background-color:var(--td-error-color);border-color:var(--td-error-color)}.t-button--variant-base.t-button--theme-danger:hover,.t-button--variant-base.t-button--theme-danger:focus-visible{background-color:var(--td-error-color-hover)}.t-button--variant-base.t-button--theme-danger.t-is-loading,.t-button--variant-base.t-button--theme-danger.t-is-disabled{background-color:var(--td-error-color-disabled)}.t-button--variant-base.t-button--theme-danger:hover,.t-button--variant-base.t-button--theme-danger:focus-visible{border-color:var(--td-error-color-hover)}.t-button--variant-base.t-button--theme-danger.t-is-loading,.t-button--variant-base.t-button--theme-danger.t-is-disabled{border-color:var(--td-error-color-disabled)}.t-button--variant-base.t-button--ghost{background-color:transparent;color:var(--td-text-color-anti);border-color:var(--td-text-color-anti)}.t-button--variant-base.t-button--ghost:hover,.t-button--variant-base.t-button--ghost:focus-visible{background-color:transparent}.t-button--variant-base.t-button--ghost:active,.t-button--variant-base.t-button--ghost.t-is-loading{background-color:transparent}.t-button--variant-base.t-button--ghost.t-is-disabled{background-color:#ffffff38;background-color:transparent}.t-button--variant-base.t-button--ghost:hover,.t-button--variant-base.t-button--ghost:focus-visible{color:var(--td-brand-color-hover)}.t-button--variant-base.t-button--ghost:active{color:var(--td-brand-color-active)}.t-button--variant-base.t-button--ghost.t-is-loading{color:var(--td-text-color-anti)}.t-button--variant-base.t-button--ghost.t-is-disabled{color:#ffffff38;background-color:transparent}.t-button--variant-base.t-button--ghost:hover,.t-button--variant-base.t-button--ghost:focus-visible{border-color:var(--td-brand-color-hover)}.t-button--variant-base.t-button--ghost:active{border-color:var(--td-brand-color-active)}.t-button--variant-base.t-button--ghost.t-is-loading{border-color:var(--td-text-color-anti)}.t-button--variant-base.t-button--ghost.t-is-disabled{border-color:#ffffff38;background-color:transparent}.t-button--variant-base.t-button--ghost.t-button--theme-primary{color:var(--td-brand-color);border-color:var(--td-brand-color)}.t-button--variant-base.t-button--ghost.t-button--theme-primary:hover,.t-button--variant-base.t-button--ghost.t-button--theme-primary:focus-visible{color:var(--td-brand-color-hover)}.t-button--variant-base.t-button--ghost.t-button--theme-primary:active{color:var(--td-brand-color-active)}.t-button--variant-base.t-button--ghost.t-button--theme-primary.t-is-loading{color:var(--td-brand-color)}.t-button--variant-base.t-button--ghost.t-button--theme-primary.t-is-disabled{color:#ffffff38;background-color:transparent}.t-button--variant-base.t-button--ghost.t-button--theme-primary:hover,.t-button--variant-base.t-button--ghost.t-button--theme-primary:focus-visible{border-color:var(--td-brand-color-hover)}.t-button--variant-base.t-button--ghost.t-button--theme-primary:active{border-color:var(--td-brand-color-active)}.t-button--variant-base.t-button--ghost.t-button--theme-primary.t-is-loading{border-color:var(--td-brand-color)}.t-button--variant-base.t-button--ghost.t-button--theme-primary.t-is-disabled{border-color:#ffffff38;background-color:transparent}.t-button--variant-base.t-button--ghost.t-button--theme-success{color:var(--td-success-color);border-color:var(--td-success-color)}.t-button--variant-base.t-button--ghost.t-button--theme-success:hover,.t-button--variant-base.t-button--ghost.t-button--theme-success:focus-visible{color:var(--td-success-color-hover)}.t-button--variant-base.t-button--ghost.t-button--theme-success:active{color:var(--td-success-color-active)}.t-button--variant-base.t-button--ghost.t-button--theme-success.t-is-loading{color:var(--td-success-color)}.t-button--variant-base.t-button--ghost.t-button--theme-success.t-is-disabled{color:#ffffff38;background-color:transparent}.t-button--variant-base.t-button--ghost.t-button--theme-success:hover,.t-button--variant-base.t-button--ghost.t-button--theme-success:focus-visible{border-color:var(--td-success-color-hover)}.t-button--variant-base.t-button--ghost.t-button--theme-success:active{border-color:var(--td-success-color-active)}.t-button--variant-base.t-button--ghost.t-button--theme-success.t-is-loading{border-color:var(--td-success-color)}.t-button--variant-base.t-button--ghost.t-button--theme-success.t-is-disabled{border-color:#ffffff38;background-color:transparent}.t-button--variant-base.t-button--ghost.t-button--theme-warning{color:var(--td-warning-color);border-color:var(--td-warning-color)}.t-button--variant-base.t-button--ghost.t-button--theme-warning:hover,.t-button--variant-base.t-button--ghost.t-button--theme-warning:focus-visible{color:var(--td-warning-color-hover)}.t-button--variant-base.t-button--ghost.t-button--theme-warning:active{color:var(--td-warning-color-active)}.t-button--variant-base.t-button--ghost.t-button--theme-warning.t-is-loading{color:var(--td-warning-color)}.t-button--variant-base.t-button--ghost.t-button--theme-warning.t-is-disabled{color:#ffffff38;background-color:transparent}.t-button--variant-base.t-button--ghost.t-button--theme-warning:hover,.t-button--variant-base.t-button--ghost.t-button--theme-warning:focus-visible{border-color:var(--td-warning-color-hover)}.t-button--variant-base.t-button--ghost.t-button--theme-warning:active{border-color:var(--td-warning-color-active)}.t-button--variant-base.t-button--ghost.t-button--theme-warning.t-is-loading{border-color:var(--td-warning-color)}.t-button--variant-base.t-button--ghost.t-button--theme-warning.t-is-disabled{border-color:#ffffff38;background-color:transparent}.t-button--variant-base.t-button--ghost.t-button--theme-danger{color:var(--td-error-color);border-color:var(--td-error-color)}.t-button--variant-base.t-button--ghost.t-button--theme-danger:hover,.t-button--variant-base.t-button--ghost.t-button--theme-danger:focus-visible{color:var(--td-error-color-hover)}.t-button--variant-base.t-button--ghost.t-button--theme-danger:active{color:var(--td-error-color-active)}.t-button--variant-base.t-button--ghost.t-button--theme-danger.t-is-loading{color:var(--td-error-color)}.t-button--variant-base.t-button--ghost.t-button--theme-danger.t-is-disabled{color:#ffffff38;background-color:transparent}.t-button--variant-base.t-button--ghost.t-button--theme-danger:hover,.t-button--variant-base.t-button--ghost.t-button--theme-danger:focus-visible{border-color:var(--td-error-color-hover)}.t-button--variant-base.t-button--ghost.t-button--theme-danger:active{border-color:var(--td-error-color-active)}.t-button--variant-base.t-button--ghost.t-button--theme-danger.t-is-loading{border-color:var(--td-error-color)}.t-button--variant-base.t-button--ghost.t-button--theme-danger.t-is-disabled{border-color:#ffffff38;background-color:transparent}.t-button--variant-base.t-is-loading:not(.t-button--variant-base.t-button--ghost).t-button--theme-default{color:var(--td-text-color-primary)}.t-button--variant-outline{height:var(--td-comp-size-m);font:var(--td-font-body-medium);padding-left:calc(var(--td-comp-paddingLR-l) - 1px);padding-right:calc(var(--td-comp-paddingLR-l) - 1px);color:var(--td-text-color-primary);background-color:var(--td-bg-color-specialcomponent);border-color:var(--td-border-level-2-color)}.t-button--variant-outline .t-icon,.t-button--variant-outline .t-loading{font-size:var(--td-font-size-body-large)}.t-button--variant-outline:hover,.t-button--variant-outline:focus-visible{color:var(--td-brand-color-hover)}.t-button--variant-outline.t-is-loading,.t-button--variant-outline.t-is-disabled{color:var(--td-text-color-disabled)}.t-button--variant-outline:hover,.t-button--variant-outline:focus-visible{background-color:var(--td-bg-color-specialcomponent)}.t-button--variant-outline.t-is-loading,.t-button--variant-outline.t-is-disabled{background-color:var(--td-bg-color-component-disabled)}.t-button--variant-outline:hover,.t-button--variant-outline:focus-visible{border-color:var(--td-brand-color-hover)}.t-button--variant-outline.t-is-loading,.t-button--variant-outline.t-is-disabled{border-color:var(--td-border-level-2-color)}.t-button--variant-outline.t-button--theme-primary{color:var(--td-brand-color);border-color:var(--td-brand-color)}.t-button--variant-outline.t-button--theme-primary:hover,.t-button--variant-outline.t-button--theme-primary:focus-visible{color:var(--td-brand-color-hover)}.t-button--variant-outline.t-button--theme-primary.t-is-loading,.t-button--variant-outline.t-button--theme-primary.t-is-disabled{color:var(--td-brand-color-disabled)}.t-button--variant-outline.t-button--theme-primary:hover,.t-button--variant-outline.t-button--theme-primary:focus-visible{border-color:var(--td-brand-color-hover)}.t-button--variant-outline.t-button--theme-primary.t-is-loading,.t-button--variant-outline.t-button--theme-primary.t-is-disabled{border-color:var(--td-brand-color-disabled)}.t-button--variant-outline.t-button--theme-success{color:var(--td-success-color);border-color:var(--td-success-color)}.t-button--variant-outline.t-button--theme-success:hover,.t-button--variant-outline.t-button--theme-success:focus-visible{color:var(--td-success-color-hover)}.t-button--variant-outline.t-button--theme-success.t-is-loading,.t-button--variant-outline.t-button--theme-success.t-is-disabled{color:var(--td-success-color-disabled)}.t-button--variant-outline.t-button--theme-success:hover,.t-button--variant-outline.t-button--theme-success:focus-visible{border-color:var(--td-success-color-hover)}.t-button--variant-outline.t-button--theme-success.t-is-loading,.t-button--variant-outline.t-button--theme-success.t-is-disabled{border-color:var(--td-success-color-disabled)}.t-button--variant-outline.t-button--theme-warning{color:var(--td-warning-color);border-color:var(--td-warning-color)}.t-button--variant-outline.t-button--theme-warning:hover,.t-button--variant-outline.t-button--theme-warning:focus-visible{color:var(--td-warning-color-hover)}.t-button--variant-outline.t-button--theme-warning.t-is-loading,.t-button--variant-outline.t-button--theme-warning.t-is-disabled{color:var(--td-warning-color-disabled)}.t-button--variant-outline.t-button--theme-warning:hover,.t-button--variant-outline.t-button--theme-warning:focus-visible{border-color:var(--td-warning-color-hover)}.t-button--variant-outline.t-button--theme-warning.t-is-loading,.t-button--variant-outline.t-button--theme-warning.t-is-disabled{border-color:var(--td-warning-color-disabled)}.t-button--variant-outline.t-button--theme-danger{color:var(--td-error-color);border-color:var(--td-error-color)}.t-button--variant-outline.t-button--theme-danger:hover,.t-button--variant-outline.t-button--theme-danger:focus-visible{color:var(--td-error-color-hover)}.t-button--variant-outline.t-button--theme-danger.t-is-loading,.t-button--variant-outline.t-button--theme-danger.t-is-disabled{color:var(--td-error-color-disabled)}.t-button--variant-outline.t-button--theme-danger:hover,.t-button--variant-outline.t-button--theme-danger:focus-visible{border-color:var(--td-error-color-hover)}.t-button--variant-outline.t-button--theme-danger.t-is-loading,.t-button--variant-outline.t-button--theme-danger.t-is-disabled{border-color:var(--td-error-color-disabled)}.t-button--variant-outline.t-button--ghost{background-color:transparent;color:var(--td-text-color-anti);border-color:var(--td-text-color-anti)}.t-button--variant-outline.t-button--ghost:hover,.t-button--variant-outline.t-button--ghost:focus-visible{background-color:transparent}.t-button--variant-outline.t-button--ghost:active,.t-button--variant-outline.t-button--ghost.t-is-loading{background-color:transparent}.t-button--variant-outline.t-button--ghost.t-is-disabled{background-color:#ffffff38;background-color:transparent}.t-button--variant-outline.t-button--ghost:hover,.t-button--variant-outline.t-button--ghost:focus-visible{color:var(--td-brand-color-hover)}.t-button--variant-outline.t-button--ghost:active{color:var(--td-brand-color-active)}.t-button--variant-outline.t-button--ghost.t-is-loading{color:var(--td-text-color-anti)}.t-button--variant-outline.t-button--ghost.t-is-disabled{color:#ffffff38;background-color:transparent}.t-button--variant-outline.t-button--ghost:hover,.t-button--variant-outline.t-button--ghost:focus-visible{border-color:var(--td-brand-color-hover)}.t-button--variant-outline.t-button--ghost:active{border-color:var(--td-brand-color-active)}.t-button--variant-outline.t-button--ghost.t-is-loading{border-color:var(--td-text-color-anti)}.t-button--variant-outline.t-button--ghost.t-is-disabled{border-color:#ffffff38;background-color:transparent}.t-button--variant-outline.t-button--ghost.t-button--theme-primary{color:var(--td-brand-color);border-color:var(--td-brand-color)}.t-button--variant-outline.t-button--ghost.t-button--theme-primary:hover,.t-button--variant-outline.t-button--ghost.t-button--theme-primary:focus-visible{color:var(--td-brand-color-hover)}.t-button--variant-outline.t-button--ghost.t-button--theme-primary:active{color:var(--td-brand-color-active)}.t-button--variant-outline.t-button--ghost.t-button--theme-primary.t-is-loading{color:var(--td-brand-color)}.t-button--variant-outline.t-button--ghost.t-button--theme-primary.t-is-disabled{color:#ffffff38;background-color:transparent}.t-button--variant-outline.t-button--ghost.t-button--theme-primary:hover,.t-button--variant-outline.t-button--ghost.t-button--theme-primary:focus-visible{border-color:var(--td-brand-color-hover)}.t-button--variant-outline.t-button--ghost.t-button--theme-primary:active{border-color:var(--td-brand-color-active)}.t-button--variant-outline.t-button--ghost.t-button--theme-primary.t-is-loading{border-color:var(--td-brand-color)}.t-button--variant-outline.t-button--ghost.t-button--theme-primary.t-is-disabled{border-color:#ffffff38;background-color:transparent}.t-button--variant-outline.t-button--ghost.t-button--theme-success{color:var(--td-success-color);border-color:var(--td-success-color)}.t-button--variant-outline.t-button--ghost.t-button--theme-success:hover,.t-button--variant-outline.t-button--ghost.t-button--theme-success:focus-visible{color:var(--td-success-color-hover)}.t-button--variant-outline.t-button--ghost.t-button--theme-success:active{color:var(--td-success-color-active)}.t-button--variant-outline.t-button--ghost.t-button--theme-success.t-is-loading{color:var(--td-success-color)}.t-button--variant-outline.t-button--ghost.t-button--theme-success.t-is-disabled{color:#ffffff38;background-color:transparent}.t-button--variant-outline.t-button--ghost.t-button--theme-success:hover,.t-button--variant-outline.t-button--ghost.t-button--theme-success:focus-visible{border-color:var(--td-success-color-hover)}.t-button--variant-outline.t-button--ghost.t-button--theme-success:active{border-color:var(--td-success-color-active)}.t-button--variant-outline.t-button--ghost.t-button--theme-success.t-is-loading{border-color:var(--td-success-color)}.t-button--variant-outline.t-button--ghost.t-button--theme-success.t-is-disabled{border-color:#ffffff38;background-color:transparent}.t-button--variant-outline.t-button--ghost.t-button--theme-warning{color:var(--td-warning-color);border-color:var(--td-warning-color)}.t-button--variant-outline.t-button--ghost.t-button--theme-warning:hover,.t-button--variant-outline.t-button--ghost.t-button--theme-warning:focus-visible{color:var(--td-warning-color-hover)}.t-button--variant-outline.t-button--ghost.t-button--theme-warning:active{color:var(--td-warning-color-active)}.t-button--variant-outline.t-button--ghost.t-button--theme-warning.t-is-loading{color:var(--td-warning-color)}.t-button--variant-outline.t-button--ghost.t-button--theme-warning.t-is-disabled{color:#ffffff38;background-color:transparent}.t-button--variant-outline.t-button--ghost.t-button--theme-warning:hover,.t-button--variant-outline.t-button--ghost.t-button--theme-warning:focus-visible{border-color:var(--td-warning-color-hover)}.t-button--variant-outline.t-button--ghost.t-button--theme-warning:active{border-color:var(--td-warning-color-active)}.t-button--variant-outline.t-button--ghost.t-button--theme-warning.t-is-loading{border-color:var(--td-warning-color)}.t-button--variant-outline.t-button--ghost.t-button--theme-warning.t-is-disabled{border-color:#ffffff38;background-color:transparent}.t-button--variant-outline.t-button--ghost.t-button--theme-danger{color:var(--td-error-color);border-color:var(--td-error-color)}.t-button--variant-outline.t-button--ghost.t-button--theme-danger:hover,.t-button--variant-outline.t-button--ghost.t-button--theme-danger:focus-visible{color:var(--td-error-color-hover)}.t-button--variant-outline.t-button--ghost.t-button--theme-danger:active{color:var(--td-error-color-active)}.t-button--variant-outline.t-button--ghost.t-button--theme-danger.t-is-loading{color:var(--td-error-color)}.t-button--variant-outline.t-button--ghost.t-button--theme-danger.t-is-disabled{color:#ffffff38;background-color:transparent}.t-button--variant-outline.t-button--ghost.t-button--theme-danger:hover,.t-button--variant-outline.t-button--ghost.t-button--theme-danger:focus-visible{border-color:var(--td-error-color-hover)}.t-button--variant-outline.t-button--ghost.t-button--theme-danger:active{border-color:var(--td-error-color-active)}.t-button--variant-outline.t-button--ghost.t-button--theme-danger.t-is-loading{border-color:var(--td-error-color)}.t-button--variant-outline.t-button--ghost.t-button--theme-danger.t-is-disabled{border-color:#ffffff38;background-color:transparent}.t-button--variant-outline.t-is-loading:not(.t-button--variant-outline.t-button--ghost){color:var(--td-text-color-primary)}.t-button--variant-outline.t-is-loading:not(.t-button--variant-outline.t-button--ghost).t-button--theme-primary{color:var(--td-brand-color);background-color:transparent}.t-button--variant-outline.t-is-loading:not(.t-button--variant-outline.t-button--ghost).t-button--theme-success{color:var(--td-success-color);background-color:transparent}.t-button--variant-outline.t-is-loading:not(.t-button--variant-outline.t-button--ghost).t-button--theme-warning{color:var(--td-warning-color);background-color:transparent}.t-button--variant-outline.t-is-loading:not(.t-button--variant-outline.t-button--ghost).t-button--theme-danger{color:var(--td-error-color);background-color:transparent}.t-button--variant-dashed{height:var(--td-comp-size-m);font:var(--td-font-body-medium);padding-left:calc(var(--td-comp-paddingLR-l) - 1px);padding-right:calc(var(--td-comp-paddingLR-l) - 1px);color:var(--td-text-color-primary);background-color:var(--td-bg-color-specialcomponent);border-color:var(--td-border-level-2-color);border-style:dashed}.t-button--variant-dashed .t-icon,.t-button--variant-dashed .t-loading{font-size:var(--td-font-size-body-large)}.t-button--variant-dashed:hover,.t-button--variant-dashed:focus-visible{color:var(--td-brand-color-hover)}.t-button--variant-dashed.t-is-loading,.t-button--variant-dashed.t-is-disabled{color:var(--td-text-color-disabled)}.t-button--variant-dashed:hover,.t-button--variant-dashed:focus-visible{background-color:var(--td-bg-color-specialcomponent)}.t-button--variant-dashed.t-is-loading,.t-button--variant-dashed.t-is-disabled{background-color:var(--td-bg-color-component-disabled)}.t-button--variant-dashed:hover,.t-button--variant-dashed:focus-visible{border-color:var(--td-brand-color-hover)}.t-button--variant-dashed.t-is-loading,.t-button--variant-dashed.t-is-disabled{border-color:var(--td-border-level-2-color)}.t-button--variant-dashed.t-button--theme-primary{color:var(--td-brand-color);border-color:var(--td-brand-color)}.t-button--variant-dashed.t-button--theme-primary:hover,.t-button--variant-dashed.t-button--theme-primary:focus-visible{color:var(--td-brand-color-hover)}.t-button--variant-dashed.t-button--theme-primary.t-is-loading,.t-button--variant-dashed.t-button--theme-primary.t-is-disabled{color:var(--td-brand-color-disabled)}.t-button--variant-dashed.t-button--theme-primary:hover,.t-button--variant-dashed.t-button--theme-primary:focus-visible{border-color:var(--td-brand-color-hover)}.t-button--variant-dashed.t-button--theme-primary.t-is-loading,.t-button--variant-dashed.t-button--theme-primary.t-is-disabled{border-color:var(--td-brand-color-disabled)}.t-button--variant-dashed.t-button--theme-success{color:var(--td-success-color);border-color:var(--td-success-color)}.t-button--variant-dashed.t-button--theme-success:hover,.t-button--variant-dashed.t-button--theme-success:focus-visible{color:var(--td-success-color-hover)}.t-button--variant-dashed.t-button--theme-success.t-is-loading,.t-button--variant-dashed.t-button--theme-success.t-is-disabled{color:var(--td-success-color-disabled)}.t-button--variant-dashed.t-button--theme-success:hover,.t-button--variant-dashed.t-button--theme-success:focus-visible{border-color:var(--td-success-color-hover)}.t-button--variant-dashed.t-button--theme-success.t-is-loading,.t-button--variant-dashed.t-button--theme-success.t-is-disabled{border-color:var(--td-success-color-disabled)}.t-button--variant-dashed.t-button--theme-warning{color:var(--td-warning-color);border-color:var(--td-warning-color)}.t-button--variant-dashed.t-button--theme-warning:hover,.t-button--variant-dashed.t-button--theme-warning:focus-visible{color:var(--td-warning-color-hover)}.t-button--variant-dashed.t-button--theme-warning.t-is-loading,.t-button--variant-dashed.t-button--theme-warning.t-is-disabled{color:var(--td-warning-color-disabled)}.t-button--variant-dashed.t-button--theme-warning:hover,.t-button--variant-dashed.t-button--theme-warning:focus-visible{border-color:var(--td-warning-color-hover)}.t-button--variant-dashed.t-button--theme-warning.t-is-loading,.t-button--variant-dashed.t-button--theme-warning.t-is-disabled{border-color:var(--td-warning-color-disabled)}.t-button--variant-dashed.t-button--theme-danger{color:var(--td-error-color);border-color:var(--td-error-color)}.t-button--variant-dashed.t-button--theme-danger:hover,.t-button--variant-dashed.t-button--theme-danger:focus-visible{color:var(--td-error-color-hover)}.t-button--variant-dashed.t-button--theme-danger.t-is-loading,.t-button--variant-dashed.t-button--theme-danger.t-is-disabled{color:var(--td-error-color-disabled)}.t-button--variant-dashed.t-button--theme-danger:hover,.t-button--variant-dashed.t-button--theme-danger:focus-visible{border-color:var(--td-error-color-hover)}.t-button--variant-dashed.t-button--theme-danger.t-is-loading,.t-button--variant-dashed.t-button--theme-danger.t-is-disabled{border-color:var(--td-error-color-disabled)}.t-button--variant-dashed.t-button--ghost{background-color:transparent;color:var(--td-text-color-anti);border-color:var(--td-text-color-anti)}.t-button--variant-dashed.t-button--ghost:hover,.t-button--variant-dashed.t-button--ghost:focus-visible{background-color:transparent}.t-button--variant-dashed.t-button--ghost:active,.t-button--variant-dashed.t-button--ghost.t-is-loading{background-color:transparent}.t-button--variant-dashed.t-button--ghost.t-is-disabled{background-color:#ffffff38;background-color:transparent}.t-button--variant-dashed.t-button--ghost:hover,.t-button--variant-dashed.t-button--ghost:focus-visible{color:var(--td-brand-color-hover)}.t-button--variant-dashed.t-button--ghost:active{color:var(--td-brand-color-active)}.t-button--variant-dashed.t-button--ghost.t-is-loading{color:var(--td-text-color-anti)}.t-button--variant-dashed.t-button--ghost.t-is-disabled{color:#ffffff38;background-color:transparent}.t-button--variant-dashed.t-button--ghost:hover,.t-button--variant-dashed.t-button--ghost:focus-visible{border-color:var(--td-brand-color-hover)}.t-button--variant-dashed.t-button--ghost:active{border-color:var(--td-brand-color-active)}.t-button--variant-dashed.t-button--ghost.t-is-loading{border-color:var(--td-text-color-anti)}.t-button--variant-dashed.t-button--ghost.t-is-disabled{border-color:#ffffff38;background-color:transparent}.t-button--variant-dashed.t-button--ghost.t-button--theme-primary{color:var(--td-brand-color);border-color:var(--td-brand-color)}.t-button--variant-dashed.t-button--ghost.t-button--theme-primary:hover,.t-button--variant-dashed.t-button--ghost.t-button--theme-primary:focus-visible{color:var(--td-brand-color-hover)}.t-button--variant-dashed.t-button--ghost.t-button--theme-primary:active{color:var(--td-brand-color-active)}.t-button--variant-dashed.t-button--ghost.t-button--theme-primary.t-is-loading{color:var(--td-brand-color)}.t-button--variant-dashed.t-button--ghost.t-button--theme-primary.t-is-disabled{color:#ffffff38;background-color:transparent}.t-button--variant-dashed.t-button--ghost.t-button--theme-primary:hover,.t-button--variant-dashed.t-button--ghost.t-button--theme-primary:focus-visible{border-color:var(--td-brand-color-hover)}.t-button--variant-dashed.t-button--ghost.t-button--theme-primary:active{border-color:var(--td-brand-color-active)}.t-button--variant-dashed.t-button--ghost.t-button--theme-primary.t-is-loading{border-color:var(--td-brand-color)}.t-button--variant-dashed.t-button--ghost.t-button--theme-primary.t-is-disabled{border-color:#ffffff38;background-color:transparent}.t-button--variant-dashed.t-button--ghost.t-button--theme-success{color:var(--td-success-color);border-color:var(--td-success-color)}.t-button--variant-dashed.t-button--ghost.t-button--theme-success:hover,.t-button--variant-dashed.t-button--ghost.t-button--theme-success:focus-visible{color:var(--td-success-color-hover)}.t-button--variant-dashed.t-button--ghost.t-button--theme-success:active{color:var(--td-success-color-active)}.t-button--variant-dashed.t-button--ghost.t-button--theme-success.t-is-loading{color:var(--td-success-color)}.t-button--variant-dashed.t-button--ghost.t-button--theme-success.t-is-disabled{color:#ffffff38;background-color:transparent}.t-button--variant-dashed.t-button--ghost.t-button--theme-success:hover,.t-button--variant-dashed.t-button--ghost.t-button--theme-success:focus-visible{border-color:var(--td-success-color-hover)}.t-button--variant-dashed.t-button--ghost.t-button--theme-success:active{border-color:var(--td-success-color-active)}.t-button--variant-dashed.t-button--ghost.t-button--theme-success.t-is-loading{border-color:var(--td-success-color)}.t-button--variant-dashed.t-button--ghost.t-button--theme-success.t-is-disabled{border-color:#ffffff38;background-color:transparent}.t-button--variant-dashed.t-button--ghost.t-button--theme-warning{color:var(--td-warning-color);border-color:var(--td-warning-color)}.t-button--variant-dashed.t-button--ghost.t-button--theme-warning:hover,.t-button--variant-dashed.t-button--ghost.t-button--theme-warning:focus-visible{color:var(--td-warning-color-hover)}.t-button--variant-dashed.t-button--ghost.t-button--theme-warning:active{color:var(--td-warning-color-active)}.t-button--variant-dashed.t-button--ghost.t-button--theme-warning.t-is-loading{color:var(--td-warning-color)}.t-button--variant-dashed.t-button--ghost.t-button--theme-warning.t-is-disabled{color:#ffffff38;background-color:transparent}.t-button--variant-dashed.t-button--ghost.t-button--theme-warning:hover,.t-button--variant-dashed.t-button--ghost.t-button--theme-warning:focus-visible{border-color:var(--td-warning-color-hover)}.t-button--variant-dashed.t-button--ghost.t-button--theme-warning:active{border-color:var(--td-warning-color-active)}.t-button--variant-dashed.t-button--ghost.t-button--theme-warning.t-is-loading{border-color:var(--td-warning-color)}.t-button--variant-dashed.t-button--ghost.t-button--theme-warning.t-is-disabled{border-color:#ffffff38;background-color:transparent}.t-button--variant-dashed.t-button--ghost.t-button--theme-danger{color:var(--td-error-color);border-color:var(--td-error-color)}.t-button--variant-dashed.t-button--ghost.t-button--theme-danger:hover,.t-button--variant-dashed.t-button--ghost.t-button--theme-danger:focus-visible{color:var(--td-error-color-hover)}.t-button--variant-dashed.t-button--ghost.t-button--theme-danger:active{color:var(--td-error-color-active)}.t-button--variant-dashed.t-button--ghost.t-button--theme-danger.t-is-loading{color:var(--td-error-color)}.t-button--variant-dashed.t-button--ghost.t-button--theme-danger.t-is-disabled{color:#ffffff38;background-color:transparent}.t-button--variant-dashed.t-button--ghost.t-button--theme-danger:hover,.t-button--variant-dashed.t-button--ghost.t-button--theme-danger:focus-visible{border-color:var(--td-error-color-hover)}.t-button--variant-dashed.t-button--ghost.t-button--theme-danger:active{border-color:var(--td-error-color-active)}.t-button--variant-dashed.t-button--ghost.t-button--theme-danger.t-is-loading{border-color:var(--td-error-color)}.t-button--variant-dashed.t-button--ghost.t-button--theme-danger.t-is-disabled{border-color:#ffffff38;background-color:transparent}.t-button--variant-dashed.t-is-loading:not(.t-button--variant-dashed.t-button--ghost){color:var(--td-text-color-primary)}.t-button--variant-dashed.t-is-loading:not(.t-button--variant-dashed.t-button--ghost).t-button--theme-primary{color:var(--td-brand-color);background-color:transparent}.t-button--variant-dashed.t-is-loading:not(.t-button--variant-dashed.t-button--ghost).t-button--theme-success{color:var(--td-success-color);background-color:transparent}.t-button--variant-dashed.t-is-loading:not(.t-button--variant-dashed.t-button--ghost).t-button--theme-warning{color:var(--td-warning-color);background-color:transparent}.t-button--variant-dashed.t-is-loading:not(.t-button--variant-dashed.t-button--ghost).t-button--theme-danger{color:var(--td-error-color);background-color:transparent}.t-button--variant-text{height:var(--td-comp-size-m);font:var(--td-font-body-medium);padding-left:calc(var(--td-comp-paddingLR-l) - 1px);padding-right:calc(var(--td-comp-paddingLR-l) - 1px);color:var(--td-text-color-primary);background-color:transparent;border-color:transparent}.t-button--variant-text .t-icon,.t-button--variant-text .t-loading{font-size:var(--td-font-size-body-large)}.t-button--variant-text:hover,.t-button--variant-text:focus-visible{color:var(--td-text-color-primary)}.t-button--variant-text.t-is-loading,.t-button--variant-text.t-is-disabled{color:var(--td-text-color-disabled)}.t-button--variant-text:hover,.t-button--variant-text:focus-visible{background-color:var(--td-bg-color-container-hover)}.t-button--variant-text.t-is-loading,.t-button--variant-text.t-is-disabled{background-color:transparent}.t-button--variant-text:hover,.t-button--variant-text:focus-visible{border-color:var(--td-bg-color-container-hover)}.t-button--variant-text.t-is-loading,.t-button--variant-text.t-is-disabled{border-color:transparent}.t-button--variant-text.t-button--theme-primary{color:var(--td-brand-color)}.t-button--variant-text.t-button--theme-primary:hover,.t-button--variant-text.t-button--theme-primary:focus-visible{color:var(--td-brand-color-hover)}.t-button--variant-text.t-button--theme-primary.t-is-loading,.t-button--variant-text.t-button--theme-primary.t-is-disabled{color:var(--td-brand-color-disabled)}.t-button--variant-text.t-button--theme-success{color:var(--td-success-color)}.t-button--variant-text.t-button--theme-success:hover,.t-button--variant-text.t-button--theme-success:focus-visible{color:var(--td-success-color-hover)}.t-button--variant-text.t-button--theme-success.t-is-loading,.t-button--variant-text.t-button--theme-success.t-is-disabled{color:var(--td-success-color-disabled)}.t-button--variant-text.t-button--theme-warning{color:var(--td-warning-color)}.t-button--variant-text.t-button--theme-warning:hover,.t-button--variant-text.t-button--theme-warning:focus-visible{color:var(--td-warning-color-hover)}.t-button--variant-text.t-button--theme-warning.t-is-loading,.t-button--variant-text.t-button--theme-warning.t-is-disabled{color:var(--td-warning-color-disabled)}.t-button--variant-text.t-button--theme-danger{color:var(--td-error-color)}.t-button--variant-text.t-button--theme-danger:hover,.t-button--variant-text.t-button--theme-danger:focus-visible{color:var(--td-error-color-hover)}.t-button--variant-text.t-button--theme-danger.t-is-loading,.t-button--variant-text.t-button--theme-danger.t-is-disabled{color:var(--td-error-color-disabled)}.t-button--variant-text.t-button--ghost{background:none;color:var(--td-text-color-anti)}.t-button--variant-text.t-button--ghost:hover,.t-button--variant-text.t-button--ghost:focus-visible{color:var(--td-brand-color-hover)}.t-button--variant-text.t-button--ghost:active{color:var(--td-brand-color-active)}.t-button--variant-text.t-button--ghost.t-is-loading{color:var(--td-text-color-anti)}.t-button--variant-text.t-button--ghost.t-is-disabled{color:#ffffff38;background-color:transparent}.t-button--variant-text.t-button--ghost.t-button--theme-primary{color:var(--td-brand-color)}.t-button--variant-text.t-button--ghost.t-button--theme-primary:hover,.t-button--variant-text.t-button--ghost.t-button--theme-primary:focus-visible{color:var(--td-brand-color-hover)}.t-button--variant-text.t-button--ghost.t-button--theme-primary:active{color:var(--td-brand-color-active)}.t-button--variant-text.t-button--ghost.t-button--theme-primary.t-is-loading{color:var(--td-brand-color)}.t-button--variant-text.t-button--ghost.t-button--theme-primary.t-is-disabled{color:#ffffff38;background-color:transparent}.t-button--variant-text.t-button--ghost.t-button--theme-success{color:var(--td-success-color)}.t-button--variant-text.t-button--ghost.t-button--theme-success:hover,.t-button--variant-text.t-button--ghost.t-button--theme-success:focus-visible{color:var(--td-success-color-hover)}.t-button--variant-text.t-button--ghost.t-button--theme-success:active{color:var(--td-success-color-active)}.t-button--variant-text.t-button--ghost.t-button--theme-success.t-is-loading{color:var(--td-success-color)}.t-button--variant-text.t-button--ghost.t-button--theme-success.t-is-disabled{color:#ffffff38;background-color:transparent}.t-button--variant-text.t-button--ghost.t-button--theme-warning{color:var(--td-warning-color)}.t-button--variant-text.t-button--ghost.t-button--theme-warning:hover,.t-button--variant-text.t-button--ghost.t-button--theme-warning:focus-visible{color:var(--td-warning-color-hover)}.t-button--variant-text.t-button--ghost.t-button--theme-warning:active{color:var(--td-warning-color-active)}.t-button--variant-text.t-button--ghost.t-button--theme-warning.t-is-loading{color:var(--td-warning-color)}.t-button--variant-text.t-button--ghost.t-button--theme-warning.t-is-disabled{color:#ffffff38;background-color:transparent}.t-button--variant-text.t-button--ghost.t-button--theme-danger{color:var(--td-error-color)}.t-button--variant-text.t-button--ghost.t-button--theme-danger:hover,.t-button--variant-text.t-button--ghost.t-button--theme-danger:focus-visible{color:var(--td-error-color-hover)}.t-button--variant-text.t-button--ghost.t-button--theme-danger:active{color:var(--td-error-color-active)}.t-button--variant-text.t-button--ghost.t-button--theme-danger.t-is-loading{color:var(--td-error-color)}.t-button--variant-text.t-button--ghost.t-button--theme-danger.t-is-disabled{color:#ffffff38;background-color:transparent}.t-button--variant-text.t-is-loading:not(.t-button--variant-text.t-button--ghost){color:var(--td-text-color-primary)}.t-button--variant-text.t-is-loading:not(.t-button--variant-text.t-button--ghost).t-button--theme-primary{color:var(--td-brand-color)}.t-button--variant-text.t-is-loading:not(.t-button--variant-text.t-button--ghost).t-button--theme-success{color:var(--td-success-color)}.t-button--variant-text.t-is-loading:not(.t-button--variant-text.t-button--ghost).t-button--theme-warning{color:var(--td-warning-color)}.t-button--variant-text.t-is-loading:not(.t-button--variant-text.t-button--ghost).t-button--theme-danger{color:var(--td-error-color)}.t-button.t-is-loading,.t-button.t-is-disabled{cursor:not-allowed}.t-button.t-size-s{height:var(--td-comp-size-xs);font:var(--td-font-body-small);padding-left:calc(var(--td-comp-paddingLR-s) - 1px);padding-right:calc(var(--td-comp-paddingLR-s) - 1px)}.t-button.t-size-s .t-icon,.t-button.t-size-s .t-loading{font-size:var(--td-font-size-body-medium)}.t-button.t-size-l{height:var(--td-comp-size-xl);font:var(--td-font-body-large);padding-left:calc(var(--td-comp-paddingLR-xl) - 1px);padding-right:calc(var(--td-comp-paddingLR-xl) - 1px)}.t-button.t-size-l .t-icon,.t-button.t-size-l .t-loading{font-size:var(--td-font-size-title-large)}.t-button--shape-square{width:var(--td-comp-size-m);padding:0}.t-button--shape-square.t-size-s{width:var(--td-comp-size-xs);padding:0}.t-button--shape-square.t-size-l{width:var(--td-comp-size-xl);padding:0}.t-button--shape-round{border-radius:var(--td-radius-round)}.t-button--shape-round.t-size-s{border-radius:calc(var(--td-comp-size-xs) / 2)}.t-button--shape-round.t-size-l{border-radius:calc(var(--td-comp-size-xl) / 2)}.t-button--shape-circle{width:var(--td-comp-size-m);padding:0;text-align:center;border-radius:calc(var(--td-comp-size-m) / 2)}.t-button--shape-circle .t-icon,.t-button--shape-circle .t-loading{font-size:var(--td-font-size-body-large)}.t-button--shape-circle.t-size-s{width:var(--td-comp-size-xs);border-radius:calc(var(--td-comp-size-xs) / 2)}.t-button--shape-circle.t-size-l{width:var(--td-comp-size-xl);padding:0;border-radius:calc(var(--td-comp-size-xl) / 2)}.t-button.t-size-full-width{display:flex;width:100%}.t-button--ghost{--ripple-color: var(--td-gray-color-10)}.t-button:not(.t-is-disabled):not(.t-button--ghost){--ripple-color: var(--td-bg-color-container-active)}.t-button--variant-base:not(.t-is-disabled):not(.t-button--ghost){--ripple-color: var(--td-bg-color-component-active)}.t-button--variant-base.t-button--theme-primary:not(.t-is-disabled):not(.t-button--ghost){--ripple-color: var(--td-brand-color-active)}.t-button--variant-base.t-button--theme-success:not(.t-is-disabled):not(.t-button--ghost){--ripple-color: var(--td-success-color-active)}.t-button--variant-base.t-button--theme-warning:not(.t-is-disabled):not(.t-button--ghost){--ripple-color: var(--td-warning-color-active)}.t-button--variant-base.t-button--theme-danger:not(.t-is-disabled):not(.t-button--ghost){--ripple-color: var(--td-error-color-active)}";
      importCSS(indexCss$a);
      /**
       * tdesign v1.17.1
       * (c) 2025 tdesign
       * @license MIT
       */
      function ownKeys$q(e, r) {
        var t2 = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
          var o = Object.getOwnPropertySymbols(e);
          r && (o = o.filter(function(r2) {
            return Object.getOwnPropertyDescriptor(e, r2).enumerable;
          })), t2.push.apply(t2, o);
        }
        return t2;
      }
      function _objectSpread$q(e) {
        for (var r = 1; r < arguments.length; r++) {
          var t2 = null != arguments[r] ? arguments[r] : {};
          r % 2 ? ownKeys$q(Object(t2), true).forEach(function(r2) {
            _defineProperty$1(e, r2, t2[r2]);
          }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t2)) : ownKeys$q(Object(t2)).forEach(function(r2) {
            Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t2, r2));
          });
        }
        return e;
      }
      var TButton = vue.defineComponent({
        name: "TButton",
        props: props$c,
        setup: function setup(props2, _ref) {
          var attrs = _ref.attrs, slots = _ref.slots;
          var renderTNodeJSX = useTNodeJSX();
          var renderContent = useContent();
          var COMPONENT_NAME = usePrefixClass("button");
          var _useCommonClassName = useCommonClassName$1(), STATUS = _useCommonClassName.STATUS, SIZE = _useCommonClassName.SIZE;
          var btnRef = vue.ref();
          useRipple(btnRef);
          var isDisabled = useDisabled();
          var mergeTheme = vue.computed(function() {
            var theme = props2.theme, variant = props2.variant;
            if (theme) return theme;
            if (variant === "base") return "primary";
            return "default";
          });
          var buttonClass = vue.computed(function() {
            return ["".concat(COMPONENT_NAME.value), "".concat(COMPONENT_NAME.value, "--variant-").concat(props2.variant), "".concat(COMPONENT_NAME.value, "--theme-").concat(mergeTheme.value), "".concat(COMPONENT_NAME.value, "--shape-").concat(props2.shape), _defineProperty$1(_defineProperty$1(_defineProperty$1(_defineProperty$1(_defineProperty$1({}, SIZE.value[props2.size], props2.size !== "medium"), STATUS.value.disabled, isDisabled.value), STATUS.value.loading, props2.loading), "".concat(COMPONENT_NAME.value, "--ghost"), props2.ghost), SIZE.value.block, props2.block)];
          });
          return function() {
            var buttonContent = renderContent("default", "content");
            var icon = props2.loading ? vue.createVNode(Loading, _objectSpread$q({
              inheritColor: true
            }, props2.loadingProps), null) : renderTNodeJSX("icon");
            var iconOnly = icon && !buttonContent;
            var suffix2 = props2.suffix || slots.suffix ? vue.createVNode("span", {
              "class": "".concat(COMPONENT_NAME.value, "__suffix")
            }, [renderTNodeJSX("suffix")]) : null;
            buttonContent = buttonContent ? vue.createVNode("span", {
              "class": "".concat(COMPONENT_NAME.value, "__text")
            }, [buttonContent]) : "";
            if (icon) {
              buttonContent = [icon, buttonContent];
            }
            if (suffix2) {
              buttonContent = [buttonContent].concat(suffix2);
            }
            var renderTag = function renderTag2() {
              if (!props2.tag && props2.href) return "a";
              return props2.tag || "button";
            };
            var buttonAttrs = {
              "class": [].concat(_toConsumableArray(buttonClass.value), [_defineProperty$1({}, "".concat(COMPONENT_NAME.value, "--icon-only"), iconOnly)]),
              type: props2.type,
              disabled: isDisabled.value || props2.loading,
              href: props2.href,
              tabindex: isDisabled.value ? void 0 : "0",
              form: props2.form
            };
            return vue.h(renderTag(), _objectSpread$q(_objectSpread$q(_objectSpread$q({
              ref: btnRef
            }, attrs), buttonAttrs), {}, {
              onClick: props2.onClick
            }), [buttonContent]);
          };
        }
      });
      /**
       * tdesign v1.17.1
       * (c) 2025 tdesign
       * @license MIT
       */
      var Button = withInstall(TButton);
      function _defineProperty(obj, key2, value) {
        if (key2 in obj) {
          Object.defineProperty(obj, key2, {
            value,
            enumerable: true,
            configurable: true,
            writable: true
          });
        } else {
          obj[key2] = value;
        }
        return obj;
      }
      var camel2Kebab = (camelString) => {
        var covertArr = ["strokeLinecap", "fillRule", "clipRule", "strokeWidth"];
        if (covertArr.includes(camelString)) {
          return camelString.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, "$1-$2").toLowerCase();
        }
        return camelString;
      };
      var renderNode = (node, props2) => {
        var processedAttrs = {};
        if (node.attrs) {
          for (var [key2, value] of Object.entries(node.attrs)) {
            if (typeof value === "string" && value.startsWith("props.")) {
              var propName = value.split(".")[1];
              processedAttrs[camel2Kebab(key2)] = props2[propName];
            } else {
              processedAttrs[camel2Kebab(key2)] = value;
            }
          }
        }
        if (node.tag === "svg") {
          processedAttrs.class = props2.class;
          processedAttrs.style = props2.style;
          processedAttrs.onClick = props2.onClick;
        }
        var children = node.children ? node.children.map((child) => renderNode(child, props2)) : [];
        return vue.h(node.tag, processedAttrs, children);
      };
      var DEFAULT_CLASS_PREFIX = "t";
      var ConfigContext = {
        classPrefix: DEFAULT_CLASS_PREFIX
      };
      function useCommonClassName() {
        var {
          classPrefix
        } = ConfigContext;
        return {
          SIZE: {
            default: "",
            xs: "".concat(classPrefix, "-size-xs"),
            small: "".concat(classPrefix, "-size-s"),
            medium: "".concat(classPrefix, "-size-m"),
            large: "".concat(classPrefix, "-size-l"),
            xl: "".concat(classPrefix, "-size-xl"),
            block: "".concat(classPrefix, "-size-full-width")
          },
          STATUS: {
            loading: "".concat(classPrefix, "-is-loading"),
            disabled: "".concat(classPrefix, "-is-disabled"),
            focused: "".concat(classPrefix, "-is-focused"),
            success: "".concat(classPrefix, "-is-success"),
            error: "".concat(classPrefix, "-is-error"),
            warning: "".concat(classPrefix, "-is-warning"),
            selected: "".concat(classPrefix, "-is-selected"),
            active: "".concat(classPrefix, "-is-active"),
            checked: "".concat(classPrefix, "-is-checked"),
            current: "".concat(classPrefix, "-is-current"),
            hidden: "".concat(classPrefix, "-is-hidden"),
            visible: "".concat(classPrefix, "-is-visible"),
            expanded: "".concat(classPrefix, "-is-expanded"),
            indeterminate: "".concat(classPrefix, "-is-indeterminate")
          }
        };
      }
      function useSizeProps(size) {
        var COMMON_SIZE_CLASS_NAMES = useCommonClassName().SIZE;
        var className = vue.computed(() => {
          if (size.value in COMMON_SIZE_CLASS_NAMES) {
            return COMMON_SIZE_CLASS_NAMES[size.value];
          }
          return "";
        });
        var style = vue.computed(() => {
          if (size.value === void 0 || size.value in COMMON_SIZE_CLASS_NAMES) {
            return {};
          }
          return {
            fontSize: size.value
          };
        });
        return {
          style,
          className
        };
      }
      const indexCss$9 = "@keyframes t-spin{0%{transform:rotate(0)}to{transform:rotate(360deg)}}.t-icon{display:inline-block;vertical-align:middle;width:1em;height:1em}.t-icon:before{font-family:unset}.t-icon-loading{animation:t-spin 1s linear infinite}.t-icon.t-size-s,i.t-size-s{font-size:14px}.t-icon.t-size-m,i.t-size-m{font-size:16px}.t-icon.t-size-l,i.t-size-l{font-size:18px}";
      importCSS(indexCss$9);
      function ownKeys$p(object, enumerableOnly) {
        var keys2 = Object.keys(object);
        if (Object.getOwnPropertySymbols) {
          var symbols = Object.getOwnPropertySymbols(object);
          enumerableOnly && (symbols = symbols.filter(function(sym) {
            return Object.getOwnPropertyDescriptor(object, sym).enumerable;
          })), keys2.push.apply(keys2, symbols);
        }
        return keys2;
      }
      function _objectSpread$p(target) {
        for (var i2 = 1; i2 < arguments.length; i2++) {
          var source = null != arguments[i2] ? arguments[i2] : {};
          i2 % 2 ? ownKeys$p(Object(source), true).forEach(function(key2) {
            _defineProperty(target, key2, source[key2]);
          }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$p(Object(source)).forEach(function(key2) {
            Object.defineProperty(target, key2, Object.getOwnPropertyDescriptor(source, key2));
          });
        }
        return target;
      }
      var element$a = {
        "tag": "svg",
        "attrs": {
          "fill": "none",
          "viewBox": "0 0 24 24",
          "width": "1em",
          "height": "1em"
        },
        "children": [{
          "tag": "g",
          "attrs": {
            "id": "browse-off"
          },
          "children": [{
            "tag": "path",
            "attrs": {
              "id": "stroke1",
              "stroke": "props.strokeColor1",
              "d": "M13.1758 8.17578C14.4396 8.56376 15.4368 9.56096 15.8247 10.8247M21.2858 15.2856C22.0085 14.2983 22.5776 13.1913 22.9578 12C21.4771 7.36017 17.131 4 12.0001 4C11.3698 4 10.7513 4.05072 10.1484 4.1483M5.80747 5.80786C3.57225 7.23888 1.86478 9.42193 1.04199 12.0001C2.52275 16.6399 6.86881 20.0001 11.9997 20.0001C14.2796 20.0001 16.4045 19.3367 18.1919 18.1923L5.80747 5.80786ZM8 12.0003C8 10.8957 8.44771 9.89573 9.17157 9.17188L14.8284 14.8287C14.1046 15.5526 13.1046 16.0003 12 16.0003C9.79086 16.0003 8 14.2094 8 12.0003Z",
              "strokeLinecap": "square",
              "strokeWidth": "props.strokeWidth"
            }
          }, {
            "tag": "path",
            "attrs": {
              "id": "stroke2",
              "stroke": "props.strokeColor2",
              "d": "M20.9996 21L3 3",
              "strokeLinecap": "square",
              "strokeWidth": "props.strokeWidth"
            }
          }]
        }]
      };
      var browseOff = vue.defineComponent({
        name: "BrowseOffIcon",
        props: {
          size: {
            type: String
          },
          onClick: {
            type: Function
          },
          fillColor: {
            type: [Array, String]
          },
          strokeColor: {
            type: [Array, String]
          },
          strokeWidth: {
            type: Number
          }
        },
        setup(props2, _ref) {
          var {
            attrs
          } = _ref;
          var propsSize = vue.computed(() => props2.size);
          var strokeColor1 = vue.computed(() => {
            if (!props2.strokeColor) return "currentColor";
            return Array.isArray(props2.strokeColor) ? props2.strokeColor[0] : props2.strokeColor;
          });
          var strokeColor2 = vue.computed(() => {
            var _props$strokeColor$;
            if (!props2.strokeColor) return "currentColor";
            return Array.isArray(props2.strokeColor) ? (_props$strokeColor$ = props2.strokeColor[1]) !== null && _props$strokeColor$ !== void 0 ? _props$strokeColor$ : props2.strokeColor[0] : props2.strokeColor;
          });
          var fillColor1 = vue.computed(() => {
            if (!props2.fillColor) return "transparent";
            return Array.isArray(props2.fillColor) ? props2.fillColor[0] : props2.fillColor;
          });
          var fillColor2 = vue.computed(() => {
            var _props$fillColor$;
            if (!props2.fillColor) return "transparent";
            return Array.isArray(props2.fillColor) ? (_props$fillColor$ = props2.fillColor[1]) !== null && _props$fillColor$ !== void 0 ? _props$fillColor$ : props2.fillColor[0] : props2.fillColor;
          });
          var filledColor = vue.computed(() => {
            if (!props2.fillColor) return "currentColor";
            return Array.isArray(props2.fillColor) ? props2.fillColor[0] : props2.fillColor;
          });
          var {
            className,
            style
          } = useSizeProps(propsSize);
          var finalCls = vue.computed(() => ["t-icon", "t-icon-browse-off", className.value]);
          var finalStyle = vue.computed(() => _objectSpread$p(_objectSpread$p({
            fill: "none"
          }, style.value), attrs.style));
          var finalProps = vue.computed(() => ({
            class: finalCls.value,
            style: finalStyle.value,
            onClick: (e) => {
              var _props$onClick;
              return (_props$onClick = props2.onClick) === null || _props$onClick === void 0 ? void 0 : _props$onClick.call(props2, {
                e
              });
            },
            strokeColor1: strokeColor1.value,
            strokeColor2: strokeColor2.value,
            fillColor1: fillColor1.value,
            fillColor2: fillColor2.value,
            strokeWidth: props2.strokeWidth || 2,
            filledColor: filledColor.value
          }));
          return () => renderNode(element$a, finalProps.value);
        }
      });
      function ownKeys$o(object, enumerableOnly) {
        var keys2 = Object.keys(object);
        if (Object.getOwnPropertySymbols) {
          var symbols = Object.getOwnPropertySymbols(object);
          enumerableOnly && (symbols = symbols.filter(function(sym) {
            return Object.getOwnPropertyDescriptor(object, sym).enumerable;
          })), keys2.push.apply(keys2, symbols);
        }
        return keys2;
      }
      function _objectSpread$o(target) {
        for (var i2 = 1; i2 < arguments.length; i2++) {
          var source = null != arguments[i2] ? arguments[i2] : {};
          i2 % 2 ? ownKeys$o(Object(source), true).forEach(function(key2) {
            _defineProperty(target, key2, source[key2]);
          }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$o(Object(source)).forEach(function(key2) {
            Object.defineProperty(target, key2, Object.getOwnPropertyDescriptor(source, key2));
          });
        }
        return target;
      }
      var element$9 = {
        "tag": "svg",
        "attrs": {
          "fill": "none",
          "viewBox": "0 0 24 24",
          "width": "1em",
          "height": "1em"
        },
        "children": [{
          "tag": "g",
          "attrs": {
            "id": "browse",
            "clipPath": "url(#clip0_543_7945)"
          },
          "children": [{
            "tag": "path",
            "attrs": {
              "id": "fill1",
              "fill": "props.fillColor1",
              "d": "M11.9997 4C6.86881 4 2.52275 7.36017 1.04199 12C2.52275 16.6398 6.86881 20 11.9997 20C17.1306 20 21.4766 16.6398 22.9574 12C21.4766 7.36017 17.1306 4 11.9997 4Z"
            }
          }, {
            "tag": "path",
            "attrs": {
              "id": "fill2",
              "fill": "props.fillColor2",
              "d": "M16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12Z"
            }
          }, {
            "tag": "path",
            "attrs": {
              "id": "stroke1",
              "stroke": "props.strokeColor1",
              "d": "M11.9997 4C6.86881 4 2.52275 7.36017 1.04199 12C2.52275 16.6398 6.86881 20 11.9997 20C17.1306 20 21.4766 16.6398 22.9574 12C21.4766 7.36017 17.1306 4 11.9997 4Z",
              "strokeLinecap": "square",
              "strokeWidth": "props.strokeWidth"
            }
          }, {
            "tag": "path",
            "attrs": {
              "id": "stroke2",
              "stroke": "props.strokeColor2",
              "d": "M16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12Z",
              "strokeLinecap": "square",
              "strokeWidth": "props.strokeWidth"
            }
          }]
        }]
      };
      var browse = vue.defineComponent({
        name: "BrowseIcon",
        props: {
          size: {
            type: String
          },
          onClick: {
            type: Function
          },
          fillColor: {
            type: [Array, String]
          },
          strokeColor: {
            type: [Array, String]
          },
          strokeWidth: {
            type: Number
          }
        },
        setup(props2, _ref) {
          var {
            attrs
          } = _ref;
          var propsSize = vue.computed(() => props2.size);
          var strokeColor1 = vue.computed(() => {
            if (!props2.strokeColor) return "currentColor";
            return Array.isArray(props2.strokeColor) ? props2.strokeColor[0] : props2.strokeColor;
          });
          var strokeColor2 = vue.computed(() => {
            var _props$strokeColor$;
            if (!props2.strokeColor) return "currentColor";
            return Array.isArray(props2.strokeColor) ? (_props$strokeColor$ = props2.strokeColor[1]) !== null && _props$strokeColor$ !== void 0 ? _props$strokeColor$ : props2.strokeColor[0] : props2.strokeColor;
          });
          var fillColor1 = vue.computed(() => {
            if (!props2.fillColor) return "transparent";
            return Array.isArray(props2.fillColor) ? props2.fillColor[0] : props2.fillColor;
          });
          var fillColor2 = vue.computed(() => {
            var _props$fillColor$;
            if (!props2.fillColor) return "transparent";
            return Array.isArray(props2.fillColor) ? (_props$fillColor$ = props2.fillColor[1]) !== null && _props$fillColor$ !== void 0 ? _props$fillColor$ : props2.fillColor[0] : props2.fillColor;
          });
          var filledColor = vue.computed(() => {
            if (!props2.fillColor) return "currentColor";
            return Array.isArray(props2.fillColor) ? props2.fillColor[0] : props2.fillColor;
          });
          var {
            className,
            style
          } = useSizeProps(propsSize);
          var finalCls = vue.computed(() => ["t-icon", "t-icon-browse", className.value]);
          var finalStyle = vue.computed(() => _objectSpread$o(_objectSpread$o({
            fill: "none"
          }, style.value), attrs.style));
          var finalProps = vue.computed(() => ({
            class: finalCls.value,
            style: finalStyle.value,
            onClick: (e) => {
              var _props$onClick;
              return (_props$onClick = props2.onClick) === null || _props$onClick === void 0 ? void 0 : _props$onClick.call(props2, {
                e
              });
            },
            strokeColor1: strokeColor1.value,
            strokeColor2: strokeColor2.value,
            fillColor1: fillColor1.value,
            fillColor2: fillColor2.value,
            strokeWidth: props2.strokeWidth || 2,
            filledColor: filledColor.value
          }));
          return () => renderNode(element$9, finalProps.value);
        }
      });
      function ownKeys$n(object, enumerableOnly) {
        var keys2 = Object.keys(object);
        if (Object.getOwnPropertySymbols) {
          var symbols = Object.getOwnPropertySymbols(object);
          enumerableOnly && (symbols = symbols.filter(function(sym) {
            return Object.getOwnPropertyDescriptor(object, sym).enumerable;
          })), keys2.push.apply(keys2, symbols);
        }
        return keys2;
      }
      function _objectSpread$n(target) {
        for (var i2 = 1; i2 < arguments.length; i2++) {
          var source = null != arguments[i2] ? arguments[i2] : {};
          i2 % 2 ? ownKeys$n(Object(source), true).forEach(function(key2) {
            _defineProperty(target, key2, source[key2]);
          }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$n(Object(source)).forEach(function(key2) {
            Object.defineProperty(target, key2, Object.getOwnPropertyDescriptor(source, key2));
          });
        }
        return target;
      }
      var element$8 = {
        "tag": "svg",
        "attrs": {
          "fill": "none",
          "viewBox": "0 0 24 24",
          "width": "1em",
          "height": "1em"
        },
        "children": [{
          "tag": "path",
          "attrs": {
            "fill": "props.filledColor",
            "d": "M12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1C5.92487 1 1 5.92487 1 12C1 18.0751 5.92487 23 12 23ZM7.49985 10.5858L10.4999 13.5858L16.4999 7.58578L17.9141 8.99999L10.4999 16.4142L6.08564 12L7.49985 10.5858Z"
          }
        }]
      };
      var checkCircleFilled = vue.defineComponent({
        name: "CheckCircleFilledIcon",
        props: {
          size: {
            type: String
          },
          onClick: {
            type: Function
          },
          fillColor: {
            type: [Array, String]
          },
          strokeColor: {
            type: [Array, String]
          },
          strokeWidth: {
            type: Number
          }
        },
        setup(props2, _ref) {
          var {
            attrs
          } = _ref;
          var propsSize = vue.computed(() => props2.size);
          var strokeColor1 = vue.computed(() => {
            if (!props2.strokeColor) return "currentColor";
            return Array.isArray(props2.strokeColor) ? props2.strokeColor[0] : props2.strokeColor;
          });
          var strokeColor2 = vue.computed(() => {
            var _props$strokeColor$;
            if (!props2.strokeColor) return "currentColor";
            return Array.isArray(props2.strokeColor) ? (_props$strokeColor$ = props2.strokeColor[1]) !== null && _props$strokeColor$ !== void 0 ? _props$strokeColor$ : props2.strokeColor[0] : props2.strokeColor;
          });
          var fillColor1 = vue.computed(() => {
            if (!props2.fillColor) return "transparent";
            return Array.isArray(props2.fillColor) ? props2.fillColor[0] : props2.fillColor;
          });
          var fillColor2 = vue.computed(() => {
            var _props$fillColor$;
            if (!props2.fillColor) return "transparent";
            return Array.isArray(props2.fillColor) ? (_props$fillColor$ = props2.fillColor[1]) !== null && _props$fillColor$ !== void 0 ? _props$fillColor$ : props2.fillColor[0] : props2.fillColor;
          });
          var filledColor = vue.computed(() => {
            if (!props2.fillColor) return "currentColor";
            return Array.isArray(props2.fillColor) ? props2.fillColor[0] : props2.fillColor;
          });
          var {
            className,
            style
          } = useSizeProps(propsSize);
          var finalCls = vue.computed(() => ["t-icon", "t-icon-check-circle-filled", className.value]);
          var finalStyle = vue.computed(() => _objectSpread$n(_objectSpread$n({
            fill: "none"
          }, style.value), attrs.style));
          var finalProps = vue.computed(() => ({
            class: finalCls.value,
            style: finalStyle.value,
            onClick: (e) => {
              var _props$onClick;
              return (_props$onClick = props2.onClick) === null || _props$onClick === void 0 ? void 0 : _props$onClick.call(props2, {
                e
              });
            },
            strokeColor1: strokeColor1.value,
            strokeColor2: strokeColor2.value,
            fillColor1: fillColor1.value,
            fillColor2: fillColor2.value,
            strokeWidth: props2.strokeWidth || 2,
            filledColor: filledColor.value
          }));
          return () => renderNode(element$8, finalProps.value);
        }
      });
      function ownKeys$m(object, enumerableOnly) {
        var keys2 = Object.keys(object);
        if (Object.getOwnPropertySymbols) {
          var symbols = Object.getOwnPropertySymbols(object);
          enumerableOnly && (symbols = symbols.filter(function(sym) {
            return Object.getOwnPropertyDescriptor(object, sym).enumerable;
          })), keys2.push.apply(keys2, symbols);
        }
        return keys2;
      }
      function _objectSpread$m(target) {
        for (var i2 = 1; i2 < arguments.length; i2++) {
          var source = null != arguments[i2] ? arguments[i2] : {};
          i2 % 2 ? ownKeys$m(Object(source), true).forEach(function(key2) {
            _defineProperty(target, key2, source[key2]);
          }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$m(Object(source)).forEach(function(key2) {
            Object.defineProperty(target, key2, Object.getOwnPropertyDescriptor(source, key2));
          });
        }
        return target;
      }
      var element$7 = {
        "tag": "svg",
        "attrs": {
          "fill": "none",
          "viewBox": "0 0 24 24",
          "width": "1em",
          "height": "1em"
        },
        "children": [{
          "tag": "g",
          "attrs": {
            "id": "check"
          },
          "children": [{
            "tag": "path",
            "attrs": {
              "id": "stroke1",
              "stroke": "props.strokeColor1",
              "d": "M19.5708 7.37842L10.3785 16.5708L5.42871 11.6211",
              "strokeLinecap": "square",
              "strokeWidth": "props.strokeWidth"
            }
          }]
        }]
      };
      var check = vue.defineComponent({
        name: "CheckIcon",
        props: {
          size: {
            type: String
          },
          onClick: {
            type: Function
          },
          fillColor: {
            type: [Array, String]
          },
          strokeColor: {
            type: [Array, String]
          },
          strokeWidth: {
            type: Number
          }
        },
        setup(props2, _ref) {
          var {
            attrs
          } = _ref;
          var propsSize = vue.computed(() => props2.size);
          var strokeColor1 = vue.computed(() => {
            if (!props2.strokeColor) return "currentColor";
            return Array.isArray(props2.strokeColor) ? props2.strokeColor[0] : props2.strokeColor;
          });
          var strokeColor2 = vue.computed(() => {
            var _props$strokeColor$;
            if (!props2.strokeColor) return "currentColor";
            return Array.isArray(props2.strokeColor) ? (_props$strokeColor$ = props2.strokeColor[1]) !== null && _props$strokeColor$ !== void 0 ? _props$strokeColor$ : props2.strokeColor[0] : props2.strokeColor;
          });
          var fillColor1 = vue.computed(() => {
            if (!props2.fillColor) return "transparent";
            return Array.isArray(props2.fillColor) ? props2.fillColor[0] : props2.fillColor;
          });
          var fillColor2 = vue.computed(() => {
            var _props$fillColor$;
            if (!props2.fillColor) return "transparent";
            return Array.isArray(props2.fillColor) ? (_props$fillColor$ = props2.fillColor[1]) !== null && _props$fillColor$ !== void 0 ? _props$fillColor$ : props2.fillColor[0] : props2.fillColor;
          });
          var filledColor = vue.computed(() => {
            if (!props2.fillColor) return "currentColor";
            return Array.isArray(props2.fillColor) ? props2.fillColor[0] : props2.fillColor;
          });
          var {
            className,
            style
          } = useSizeProps(propsSize);
          var finalCls = vue.computed(() => ["t-icon", "t-icon-check", className.value]);
          var finalStyle = vue.computed(() => _objectSpread$m(_objectSpread$m({
            fill: "none"
          }, style.value), attrs.style));
          var finalProps = vue.computed(() => ({
            class: finalCls.value,
            style: finalStyle.value,
            onClick: (e) => {
              var _props$onClick;
              return (_props$onClick = props2.onClick) === null || _props$onClick === void 0 ? void 0 : _props$onClick.call(props2, {
                e
              });
            },
            strokeColor1: strokeColor1.value,
            strokeColor2: strokeColor2.value,
            fillColor1: fillColor1.value,
            fillColor2: fillColor2.value,
            strokeWidth: props2.strokeWidth || 2,
            filledColor: filledColor.value
          }));
          return () => renderNode(element$7, finalProps.value);
        }
      });
      function ownKeys$l(object, enumerableOnly) {
        var keys2 = Object.keys(object);
        if (Object.getOwnPropertySymbols) {
          var symbols = Object.getOwnPropertySymbols(object);
          enumerableOnly && (symbols = symbols.filter(function(sym) {
            return Object.getOwnPropertyDescriptor(object, sym).enumerable;
          })), keys2.push.apply(keys2, symbols);
        }
        return keys2;
      }
      function _objectSpread$l(target) {
        for (var i2 = 1; i2 < arguments.length; i2++) {
          var source = null != arguments[i2] ? arguments[i2] : {};
          i2 % 2 ? ownKeys$l(Object(source), true).forEach(function(key2) {
            _defineProperty(target, key2, source[key2]);
          }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$l(Object(source)).forEach(function(key2) {
            Object.defineProperty(target, key2, Object.getOwnPropertyDescriptor(source, key2));
          });
        }
        return target;
      }
      var element$6 = {
        "tag": "svg",
        "attrs": {
          "fill": "none",
          "viewBox": "0 0 24 24",
          "width": "1em",
          "height": "1em"
        },
        "children": [{
          "tag": "g",
          "attrs": {
            "id": "chevron-right"
          },
          "children": [{
            "tag": "path",
            "attrs": {
              "id": "stroke1",
              "stroke": "props.strokeColor1",
              "d": "M9.5 17.5L15 12L9.5 6.5",
              "strokeLinecap": "square",
              "strokeWidth": "props.strokeWidth"
            }
          }]
        }]
      };
      var chevronRight = vue.defineComponent({
        name: "ChevronRightIcon",
        props: {
          size: {
            type: String
          },
          onClick: {
            type: Function
          },
          fillColor: {
            type: [Array, String]
          },
          strokeColor: {
            type: [Array, String]
          },
          strokeWidth: {
            type: Number
          }
        },
        setup(props2, _ref) {
          var {
            attrs
          } = _ref;
          var propsSize = vue.computed(() => props2.size);
          var strokeColor1 = vue.computed(() => {
            if (!props2.strokeColor) return "currentColor";
            return Array.isArray(props2.strokeColor) ? props2.strokeColor[0] : props2.strokeColor;
          });
          var strokeColor2 = vue.computed(() => {
            var _props$strokeColor$;
            if (!props2.strokeColor) return "currentColor";
            return Array.isArray(props2.strokeColor) ? (_props$strokeColor$ = props2.strokeColor[1]) !== null && _props$strokeColor$ !== void 0 ? _props$strokeColor$ : props2.strokeColor[0] : props2.strokeColor;
          });
          var fillColor1 = vue.computed(() => {
            if (!props2.fillColor) return "transparent";
            return Array.isArray(props2.fillColor) ? props2.fillColor[0] : props2.fillColor;
          });
          var fillColor2 = vue.computed(() => {
            var _props$fillColor$;
            if (!props2.fillColor) return "transparent";
            return Array.isArray(props2.fillColor) ? (_props$fillColor$ = props2.fillColor[1]) !== null && _props$fillColor$ !== void 0 ? _props$fillColor$ : props2.fillColor[0] : props2.fillColor;
          });
          var filledColor = vue.computed(() => {
            if (!props2.fillColor) return "currentColor";
            return Array.isArray(props2.fillColor) ? props2.fillColor[0] : props2.fillColor;
          });
          var {
            className,
            style
          } = useSizeProps(propsSize);
          var finalCls = vue.computed(() => ["t-icon", "t-icon-chevron-right", className.value]);
          var finalStyle = vue.computed(() => _objectSpread$l(_objectSpread$l({
            fill: "none"
          }, style.value), attrs.style));
          var finalProps = vue.computed(() => ({
            class: finalCls.value,
            style: finalStyle.value,
            onClick: (e) => {
              var _props$onClick;
              return (_props$onClick = props2.onClick) === null || _props$onClick === void 0 ? void 0 : _props$onClick.call(props2, {
                e
              });
            },
            strokeColor1: strokeColor1.value,
            strokeColor2: strokeColor2.value,
            fillColor1: fillColor1.value,
            fillColor2: fillColor2.value,
            strokeWidth: props2.strokeWidth || 2,
            filledColor: filledColor.value
          }));
          return () => renderNode(element$6, finalProps.value);
        }
      });
      function ownKeys$k(object, enumerableOnly) {
        var keys2 = Object.keys(object);
        if (Object.getOwnPropertySymbols) {
          var symbols = Object.getOwnPropertySymbols(object);
          enumerableOnly && (symbols = symbols.filter(function(sym) {
            return Object.getOwnPropertyDescriptor(object, sym).enumerable;
          })), keys2.push.apply(keys2, symbols);
        }
        return keys2;
      }
      function _objectSpread$k(target) {
        for (var i2 = 1; i2 < arguments.length; i2++) {
          var source = null != arguments[i2] ? arguments[i2] : {};
          i2 % 2 ? ownKeys$k(Object(source), true).forEach(function(key2) {
            _defineProperty(target, key2, source[key2]);
          }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$k(Object(source)).forEach(function(key2) {
            Object.defineProperty(target, key2, Object.getOwnPropertyDescriptor(source, key2));
          });
        }
        return target;
      }
      var element$5 = {
        "tag": "svg",
        "attrs": {
          "fill": "none",
          "viewBox": "0 0 24 24",
          "width": "1em",
          "height": "1em"
        },
        "children": [{
          "tag": "path",
          "attrs": {
            "fill": "props.filledColor",
            "d": "M12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1C5.92487 1 1 5.92487 1 12C1 18.0751 5.92487 23 12 23ZM8.81753 7.40346L11.9999 10.5858L15.1815 7.40414L16.5957 8.81835L13.4141 12L16.5957 15.1816L15.1815 16.5958L11.9999 13.4142L8.81753 16.5965L7.40332 15.1823L10.5856 12L7.40332 8.81767L8.81753 7.40346Z"
          }
        }]
      };
      var closeCircleFilled = vue.defineComponent({
        name: "CloseCircleFilledIcon",
        props: {
          size: {
            type: String
          },
          onClick: {
            type: Function
          },
          fillColor: {
            type: [Array, String]
          },
          strokeColor: {
            type: [Array, String]
          },
          strokeWidth: {
            type: Number
          }
        },
        setup(props2, _ref) {
          var {
            attrs
          } = _ref;
          var propsSize = vue.computed(() => props2.size);
          var strokeColor1 = vue.computed(() => {
            if (!props2.strokeColor) return "currentColor";
            return Array.isArray(props2.strokeColor) ? props2.strokeColor[0] : props2.strokeColor;
          });
          var strokeColor2 = vue.computed(() => {
            var _props$strokeColor$;
            if (!props2.strokeColor) return "currentColor";
            return Array.isArray(props2.strokeColor) ? (_props$strokeColor$ = props2.strokeColor[1]) !== null && _props$strokeColor$ !== void 0 ? _props$strokeColor$ : props2.strokeColor[0] : props2.strokeColor;
          });
          var fillColor1 = vue.computed(() => {
            if (!props2.fillColor) return "transparent";
            return Array.isArray(props2.fillColor) ? props2.fillColor[0] : props2.fillColor;
          });
          var fillColor2 = vue.computed(() => {
            var _props$fillColor$;
            if (!props2.fillColor) return "transparent";
            return Array.isArray(props2.fillColor) ? (_props$fillColor$ = props2.fillColor[1]) !== null && _props$fillColor$ !== void 0 ? _props$fillColor$ : props2.fillColor[0] : props2.fillColor;
          });
          var filledColor = vue.computed(() => {
            if (!props2.fillColor) return "currentColor";
            return Array.isArray(props2.fillColor) ? props2.fillColor[0] : props2.fillColor;
          });
          var {
            className,
            style
          } = useSizeProps(propsSize);
          var finalCls = vue.computed(() => ["t-icon", "t-icon-close-circle-filled", className.value]);
          var finalStyle = vue.computed(() => _objectSpread$k(_objectSpread$k({
            fill: "none"
          }, style.value), attrs.style));
          var finalProps = vue.computed(() => ({
            class: finalCls.value,
            style: finalStyle.value,
            onClick: (e) => {
              var _props$onClick;
              return (_props$onClick = props2.onClick) === null || _props$onClick === void 0 ? void 0 : _props$onClick.call(props2, {
                e
              });
            },
            strokeColor1: strokeColor1.value,
            strokeColor2: strokeColor2.value,
            fillColor1: fillColor1.value,
            fillColor2: fillColor2.value,
            strokeWidth: props2.strokeWidth || 2,
            filledColor: filledColor.value
          }));
          return () => renderNode(element$5, finalProps.value);
        }
      });
      function ownKeys$j(object, enumerableOnly) {
        var keys2 = Object.keys(object);
        if (Object.getOwnPropertySymbols) {
          var symbols = Object.getOwnPropertySymbols(object);
          enumerableOnly && (symbols = symbols.filter(function(sym) {
            return Object.getOwnPropertyDescriptor(object, sym).enumerable;
          })), keys2.push.apply(keys2, symbols);
        }
        return keys2;
      }
      function _objectSpread$j(target) {
        for (var i2 = 1; i2 < arguments.length; i2++) {
          var source = null != arguments[i2] ? arguments[i2] : {};
          i2 % 2 ? ownKeys$j(Object(source), true).forEach(function(key2) {
            _defineProperty(target, key2, source[key2]);
          }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$j(Object(source)).forEach(function(key2) {
            Object.defineProperty(target, key2, Object.getOwnPropertyDescriptor(source, key2));
          });
        }
        return target;
      }
      var element$4 = {
        "tag": "svg",
        "attrs": {
          "fill": "none",
          "viewBox": "0 0 24 24",
          "width": "1em",
          "height": "1em"
        },
        "children": [{
          "tag": "g",
          "attrs": {
            "id": "close"
          },
          "children": [{
            "tag": "path",
            "attrs": {
              "id": "stroke1",
              "stroke": "props.strokeColor1",
              "d": "M16.9503 7.05029L12.0005 12M12.0005 12L7.05078 16.9498M12.0005 12L16.9503 16.9498M12.0005 12L7.05078 7.05029",
              "strokeLinecap": "square",
              "strokeWidth": "props.strokeWidth"
            }
          }]
        }]
      };
      var close = vue.defineComponent({
        name: "CloseIcon",
        props: {
          size: {
            type: String
          },
          onClick: {
            type: Function
          },
          fillColor: {
            type: [Array, String]
          },
          strokeColor: {
            type: [Array, String]
          },
          strokeWidth: {
            type: Number
          }
        },
        setup(props2, _ref) {
          var {
            attrs
          } = _ref;
          var propsSize = vue.computed(() => props2.size);
          var strokeColor1 = vue.computed(() => {
            if (!props2.strokeColor) return "currentColor";
            return Array.isArray(props2.strokeColor) ? props2.strokeColor[0] : props2.strokeColor;
          });
          var strokeColor2 = vue.computed(() => {
            var _props$strokeColor$;
            if (!props2.strokeColor) return "currentColor";
            return Array.isArray(props2.strokeColor) ? (_props$strokeColor$ = props2.strokeColor[1]) !== null && _props$strokeColor$ !== void 0 ? _props$strokeColor$ : props2.strokeColor[0] : props2.strokeColor;
          });
          var fillColor1 = vue.computed(() => {
            if (!props2.fillColor) return "transparent";
            return Array.isArray(props2.fillColor) ? props2.fillColor[0] : props2.fillColor;
          });
          var fillColor2 = vue.computed(() => {
            var _props$fillColor$;
            if (!props2.fillColor) return "transparent";
            return Array.isArray(props2.fillColor) ? (_props$fillColor$ = props2.fillColor[1]) !== null && _props$fillColor$ !== void 0 ? _props$fillColor$ : props2.fillColor[0] : props2.fillColor;
          });
          var filledColor = vue.computed(() => {
            if (!props2.fillColor) return "currentColor";
            return Array.isArray(props2.fillColor) ? props2.fillColor[0] : props2.fillColor;
          });
          var {
            className,
            style
          } = useSizeProps(propsSize);
          var finalCls = vue.computed(() => ["t-icon", "t-icon-close", className.value]);
          var finalStyle = vue.computed(() => _objectSpread$j(_objectSpread$j({
            fill: "none"
          }, style.value), attrs.style));
          var finalProps = vue.computed(() => ({
            class: finalCls.value,
            style: finalStyle.value,
            onClick: (e) => {
              var _props$onClick;
              return (_props$onClick = props2.onClick) === null || _props$onClick === void 0 ? void 0 : _props$onClick.call(props2, {
                e
              });
            },
            strokeColor1: strokeColor1.value,
            strokeColor2: strokeColor2.value,
            fillColor1: fillColor1.value,
            fillColor2: fillColor2.value,
            strokeWidth: props2.strokeWidth || 2,
            filledColor: filledColor.value
          }));
          return () => renderNode(element$4, finalProps.value);
        }
      });
      function ownKeys$i(object, enumerableOnly) {
        var keys2 = Object.keys(object);
        if (Object.getOwnPropertySymbols) {
          var symbols = Object.getOwnPropertySymbols(object);
          enumerableOnly && (symbols = symbols.filter(function(sym) {
            return Object.getOwnPropertyDescriptor(object, sym).enumerable;
          })), keys2.push.apply(keys2, symbols);
        }
        return keys2;
      }
      function _objectSpread$i(target) {
        for (var i2 = 1; i2 < arguments.length; i2++) {
          var source = null != arguments[i2] ? arguments[i2] : {};
          i2 % 2 ? ownKeys$i(Object(source), true).forEach(function(key2) {
            _defineProperty(target, key2, source[key2]);
          }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$i(Object(source)).forEach(function(key2) {
            Object.defineProperty(target, key2, Object.getOwnPropertyDescriptor(source, key2));
          });
        }
        return target;
      }
      var element$3 = {
        "tag": "svg",
        "attrs": {
          "fill": "none",
          "viewBox": "0 0 24 24",
          "width": "1em",
          "height": "1em"
        },
        "children": [{
          "tag": "g",
          "attrs": {
            "id": "copy"
          },
          "children": [{
            "tag": "path",
            "attrs": {
              "id": "fill1",
              "fill": "props.fillColor1",
              "d": "M10 10H21V21H10z"
            }
          }, {
            "tag": "path",
            "attrs": {
              "id": "stroke1",
              "stroke": "props.strokeColor1",
              "d": "M10 10H21V21H10V10Z",
              "strokeLinecap": "square",
              "strokeWidth": "props.strokeWidth"
            }
          }, {
            "tag": "path",
            "attrs": {
              "id": "stroke2",
              "stroke": "props.strokeColor2",
              "d": "M14 6.5V3L3 3L3 14H6.5",
              "strokeLinecap": "square",
              "strokeWidth": "props.strokeWidth"
            }
          }]
        }]
      };
      var copy$1 = vue.defineComponent({
        name: "CopyIcon",
        props: {
          size: {
            type: String
          },
          onClick: {
            type: Function
          },
          fillColor: {
            type: [Array, String]
          },
          strokeColor: {
            type: [Array, String]
          },
          strokeWidth: {
            type: Number
          }
        },
        setup(props2, _ref) {
          var {
            attrs
          } = _ref;
          var propsSize = vue.computed(() => props2.size);
          var strokeColor1 = vue.computed(() => {
            if (!props2.strokeColor) return "currentColor";
            return Array.isArray(props2.strokeColor) ? props2.strokeColor[0] : props2.strokeColor;
          });
          var strokeColor2 = vue.computed(() => {
            var _props$strokeColor$;
            if (!props2.strokeColor) return "currentColor";
            return Array.isArray(props2.strokeColor) ? (_props$strokeColor$ = props2.strokeColor[1]) !== null && _props$strokeColor$ !== void 0 ? _props$strokeColor$ : props2.strokeColor[0] : props2.strokeColor;
          });
          var fillColor1 = vue.computed(() => {
            if (!props2.fillColor) return "transparent";
            return Array.isArray(props2.fillColor) ? props2.fillColor[0] : props2.fillColor;
          });
          var fillColor2 = vue.computed(() => {
            var _props$fillColor$;
            if (!props2.fillColor) return "transparent";
            return Array.isArray(props2.fillColor) ? (_props$fillColor$ = props2.fillColor[1]) !== null && _props$fillColor$ !== void 0 ? _props$fillColor$ : props2.fillColor[0] : props2.fillColor;
          });
          var filledColor = vue.computed(() => {
            if (!props2.fillColor) return "currentColor";
            return Array.isArray(props2.fillColor) ? props2.fillColor[0] : props2.fillColor;
          });
          var {
            className,
            style
          } = useSizeProps(propsSize);
          var finalCls = vue.computed(() => ["t-icon", "t-icon-copy", className.value]);
          var finalStyle = vue.computed(() => _objectSpread$i(_objectSpread$i({
            fill: "none"
          }, style.value), attrs.style));
          var finalProps = vue.computed(() => ({
            class: finalCls.value,
            style: finalStyle.value,
            onClick: (e) => {
              var _props$onClick;
              return (_props$onClick = props2.onClick) === null || _props$onClick === void 0 ? void 0 : _props$onClick.call(props2, {
                e
              });
            },
            strokeColor1: strokeColor1.value,
            strokeColor2: strokeColor2.value,
            fillColor1: fillColor1.value,
            fillColor2: fillColor2.value,
            strokeWidth: props2.strokeWidth || 2,
            filledColor: filledColor.value
          }));
          return () => renderNode(element$3, finalProps.value);
        }
      });
      function ownKeys$h(object, enumerableOnly) {
        var keys2 = Object.keys(object);
        if (Object.getOwnPropertySymbols) {
          var symbols = Object.getOwnPropertySymbols(object);
          enumerableOnly && (symbols = symbols.filter(function(sym) {
            return Object.getOwnPropertyDescriptor(object, sym).enumerable;
          })), keys2.push.apply(keys2, symbols);
        }
        return keys2;
      }
      function _objectSpread$h(target) {
        for (var i2 = 1; i2 < arguments.length; i2++) {
          var source = null != arguments[i2] ? arguments[i2] : {};
          i2 % 2 ? ownKeys$h(Object(source), true).forEach(function(key2) {
            _defineProperty(target, key2, source[key2]);
          }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$h(Object(source)).forEach(function(key2) {
            Object.defineProperty(target, key2, Object.getOwnPropertyDescriptor(source, key2));
          });
        }
        return target;
      }
      var element$2 = {
        "tag": "svg",
        "attrs": {
          "fill": "none",
          "viewBox": "0 0 24 24",
          "width": "1em",
          "height": "1em"
        },
        "children": [{
          "tag": "path",
          "attrs": {
            "fill": "props.filledColor",
            "d": "M12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12C1 5.92487 5.92487 1 12 1ZM11.0001 14H13.0001V6.49998H11.0001V14ZM13.004 15.5H11.0001V17.5039H13.004V15.5Z"
          }
        }]
      };
      var errorCircleFilled = vue.defineComponent({
        name: "ErrorCircleFilledIcon",
        props: {
          size: {
            type: String
          },
          onClick: {
            type: Function
          },
          fillColor: {
            type: [Array, String]
          },
          strokeColor: {
            type: [Array, String]
          },
          strokeWidth: {
            type: Number
          }
        },
        setup(props2, _ref) {
          var {
            attrs
          } = _ref;
          var propsSize = vue.computed(() => props2.size);
          var strokeColor1 = vue.computed(() => {
            if (!props2.strokeColor) return "currentColor";
            return Array.isArray(props2.strokeColor) ? props2.strokeColor[0] : props2.strokeColor;
          });
          var strokeColor2 = vue.computed(() => {
            var _props$strokeColor$;
            if (!props2.strokeColor) return "currentColor";
            return Array.isArray(props2.strokeColor) ? (_props$strokeColor$ = props2.strokeColor[1]) !== null && _props$strokeColor$ !== void 0 ? _props$strokeColor$ : props2.strokeColor[0] : props2.strokeColor;
          });
          var fillColor1 = vue.computed(() => {
            if (!props2.fillColor) return "transparent";
            return Array.isArray(props2.fillColor) ? props2.fillColor[0] : props2.fillColor;
          });
          var fillColor2 = vue.computed(() => {
            var _props$fillColor$;
            if (!props2.fillColor) return "transparent";
            return Array.isArray(props2.fillColor) ? (_props$fillColor$ = props2.fillColor[1]) !== null && _props$fillColor$ !== void 0 ? _props$fillColor$ : props2.fillColor[0] : props2.fillColor;
          });
          var filledColor = vue.computed(() => {
            if (!props2.fillColor) return "currentColor";
            return Array.isArray(props2.fillColor) ? props2.fillColor[0] : props2.fillColor;
          });
          var {
            className,
            style
          } = useSizeProps(propsSize);
          var finalCls = vue.computed(() => ["t-icon", "t-icon-error-circle-filled", className.value]);
          var finalStyle = vue.computed(() => _objectSpread$h(_objectSpread$h({
            fill: "none"
          }, style.value), attrs.style));
          var finalProps = vue.computed(() => ({
            class: finalCls.value,
            style: finalStyle.value,
            onClick: (e) => {
              var _props$onClick;
              return (_props$onClick = props2.onClick) === null || _props$onClick === void 0 ? void 0 : _props$onClick.call(props2, {
                e
              });
            },
            strokeColor1: strokeColor1.value,
            strokeColor2: strokeColor2.value,
            fillColor1: fillColor1.value,
            fillColor2: fillColor2.value,
            strokeWidth: props2.strokeWidth || 2,
            filledColor: filledColor.value
          }));
          return () => renderNode(element$2, finalProps.value);
        }
      });
      function ownKeys$g(object, enumerableOnly) {
        var keys2 = Object.keys(object);
        if (Object.getOwnPropertySymbols) {
          var symbols = Object.getOwnPropertySymbols(object);
          enumerableOnly && (symbols = symbols.filter(function(sym) {
            return Object.getOwnPropertyDescriptor(object, sym).enumerable;
          })), keys2.push.apply(keys2, symbols);
        }
        return keys2;
      }
      function _objectSpread$g(target) {
        for (var i2 = 1; i2 < arguments.length; i2++) {
          var source = null != arguments[i2] ? arguments[i2] : {};
          i2 % 2 ? ownKeys$g(Object(source), true).forEach(function(key2) {
            _defineProperty(target, key2, source[key2]);
          }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$g(Object(source)).forEach(function(key2) {
            Object.defineProperty(target, key2, Object.getOwnPropertyDescriptor(source, key2));
          });
        }
        return target;
      }
      var element$1 = {
        "tag": "svg",
        "attrs": {
          "fill": "none",
          "viewBox": "0 0 24 24",
          "width": "1em",
          "height": "1em"
        },
        "children": [{
          "tag": "path",
          "attrs": {
            "fill": "props.filledColor",
            "d": "M12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1C5.92487 1 1 5.92487 1 12C1 18.0751 5.92487 23 12 23ZM11.8265 11.8902C12.2582 11.3593 12.8004 10.9159 13.2365 10.5723C13.7034 10.2045 14.0002 9.63718 14.0002 9C14.0002 7.89543 13.1048 7 12.0002 7C11.131 7 10.3888 7.5551 10.1138 8.33325L9.78055 9.27609L7.89487 8.6096L8.22811 7.66676C8.77675 6.11451 10.2571 5 12.0002 5C14.2094 5 16.0002 6.79086 16.0002 9C16.0002 10.2759 15.4018 11.4125 14.4742 12.1433C14.0426 12.4834 13.6573 12.8088 13.3783 13.1519C13.1038 13.4896 13.0002 13.762 13.0002 14V15.25H11.0002V14C11.0002 13.1334 11.3905 12.4265 11.8265 11.8902ZM11.0001 18.2539V16.25H13.004V18.2539H11.0001Z"
          }
        }]
      };
      var helpCircleFilled = vue.defineComponent({
        name: "HelpCircleFilledIcon",
        props: {
          size: {
            type: String
          },
          onClick: {
            type: Function
          },
          fillColor: {
            type: [Array, String]
          },
          strokeColor: {
            type: [Array, String]
          },
          strokeWidth: {
            type: Number
          }
        },
        setup(props2, _ref) {
          var {
            attrs
          } = _ref;
          var propsSize = vue.computed(() => props2.size);
          var strokeColor1 = vue.computed(() => {
            if (!props2.strokeColor) return "currentColor";
            return Array.isArray(props2.strokeColor) ? props2.strokeColor[0] : props2.strokeColor;
          });
          var strokeColor2 = vue.computed(() => {
            var _props$strokeColor$;
            if (!props2.strokeColor) return "currentColor";
            return Array.isArray(props2.strokeColor) ? (_props$strokeColor$ = props2.strokeColor[1]) !== null && _props$strokeColor$ !== void 0 ? _props$strokeColor$ : props2.strokeColor[0] : props2.strokeColor;
          });
          var fillColor1 = vue.computed(() => {
            if (!props2.fillColor) return "transparent";
            return Array.isArray(props2.fillColor) ? props2.fillColor[0] : props2.fillColor;
          });
          var fillColor2 = vue.computed(() => {
            var _props$fillColor$;
            if (!props2.fillColor) return "transparent";
            return Array.isArray(props2.fillColor) ? (_props$fillColor$ = props2.fillColor[1]) !== null && _props$fillColor$ !== void 0 ? _props$fillColor$ : props2.fillColor[0] : props2.fillColor;
          });
          var filledColor = vue.computed(() => {
            if (!props2.fillColor) return "currentColor";
            return Array.isArray(props2.fillColor) ? props2.fillColor[0] : props2.fillColor;
          });
          var {
            className,
            style
          } = useSizeProps(propsSize);
          var finalCls = vue.computed(() => ["t-icon", "t-icon-help-circle-filled", className.value]);
          var finalStyle = vue.computed(() => _objectSpread$g(_objectSpread$g({
            fill: "none"
          }, style.value), attrs.style));
          var finalProps = vue.computed(() => ({
            class: finalCls.value,
            style: finalStyle.value,
            onClick: (e) => {
              var _props$onClick;
              return (_props$onClick = props2.onClick) === null || _props$onClick === void 0 ? void 0 : _props$onClick.call(props2, {
                e
              });
            },
            strokeColor1: strokeColor1.value,
            strokeColor2: strokeColor2.value,
            fillColor1: fillColor1.value,
            fillColor2: fillColor2.value,
            strokeWidth: props2.strokeWidth || 2,
            filledColor: filledColor.value
          }));
          return () => renderNode(element$1, finalProps.value);
        }
      });
      function ownKeys$f(object, enumerableOnly) {
        var keys2 = Object.keys(object);
        if (Object.getOwnPropertySymbols) {
          var symbols = Object.getOwnPropertySymbols(object);
          enumerableOnly && (symbols = symbols.filter(function(sym) {
            return Object.getOwnPropertyDescriptor(object, sym).enumerable;
          })), keys2.push.apply(keys2, symbols);
        }
        return keys2;
      }
      function _objectSpread$f(target) {
        for (var i2 = 1; i2 < arguments.length; i2++) {
          var source = null != arguments[i2] ? arguments[i2] : {};
          i2 % 2 ? ownKeys$f(Object(source), true).forEach(function(key2) {
            _defineProperty(target, key2, source[key2]);
          }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$f(Object(source)).forEach(function(key2) {
            Object.defineProperty(target, key2, Object.getOwnPropertyDescriptor(source, key2));
          });
        }
        return target;
      }
      var element = {
        "tag": "svg",
        "attrs": {
          "fill": "none",
          "viewBox": "0 0 24 24",
          "width": "1em",
          "height": "1em"
        },
        "children": [{
          "tag": "path",
          "attrs": {
            "fill": "props.filledColor",
            "d": "M12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1C5.92487 1 1 5.92487 1 12C1 18.0751 5.92487 23 12 23ZM10.996 8.50002V6.49611H12.9999V8.50002H10.996ZM12.9999 10L12.9999 17.5H10.9999V10L12.9999 10Z"
          }
        }]
      };
      var infoCircleFilled = vue.defineComponent({
        name: "InfoCircleFilledIcon",
        props: {
          size: {
            type: String
          },
          onClick: {
            type: Function
          },
          fillColor: {
            type: [Array, String]
          },
          strokeColor: {
            type: [Array, String]
          },
          strokeWidth: {
            type: Number
          }
        },
        setup(props2, _ref) {
          var {
            attrs
          } = _ref;
          var propsSize = vue.computed(() => props2.size);
          var strokeColor1 = vue.computed(() => {
            if (!props2.strokeColor) return "currentColor";
            return Array.isArray(props2.strokeColor) ? props2.strokeColor[0] : props2.strokeColor;
          });
          var strokeColor2 = vue.computed(() => {
            var _props$strokeColor$;
            if (!props2.strokeColor) return "currentColor";
            return Array.isArray(props2.strokeColor) ? (_props$strokeColor$ = props2.strokeColor[1]) !== null && _props$strokeColor$ !== void 0 ? _props$strokeColor$ : props2.strokeColor[0] : props2.strokeColor;
          });
          var fillColor1 = vue.computed(() => {
            if (!props2.fillColor) return "transparent";
            return Array.isArray(props2.fillColor) ? props2.fillColor[0] : props2.fillColor;
          });
          var fillColor2 = vue.computed(() => {
            var _props$fillColor$;
            if (!props2.fillColor) return "transparent";
            return Array.isArray(props2.fillColor) ? (_props$fillColor$ = props2.fillColor[1]) !== null && _props$fillColor$ !== void 0 ? _props$fillColor$ : props2.fillColor[0] : props2.fillColor;
          });
          var filledColor = vue.computed(() => {
            if (!props2.fillColor) return "currentColor";
            return Array.isArray(props2.fillColor) ? props2.fillColor[0] : props2.fillColor;
          });
          var {
            className,
            style
          } = useSizeProps(propsSize);
          var finalCls = vue.computed(() => ["t-icon", "t-icon-info-circle-filled", className.value]);
          var finalStyle = vue.computed(() => _objectSpread$f(_objectSpread$f({
            fill: "none"
          }, style.value), attrs.style));
          var finalProps = vue.computed(() => ({
            class: finalCls.value,
            style: finalStyle.value,
            onClick: (e) => {
              var _props$onClick;
              return (_props$onClick = props2.onClick) === null || _props$onClick === void 0 ? void 0 : _props$onClick.call(props2, {
                e
              });
            },
            strokeColor1: strokeColor1.value,
            strokeColor2: strokeColor2.value,
            fillColor1: fillColor1.value,
            fillColor2: fillColor2.value,
            strokeWidth: props2.strokeWidth || 2,
            filledColor: filledColor.value
          }));
          return () => renderNode(element, finalProps.value);
        }
      });
      /**
       * tdesign v1.17.1
       * (c) 2025 tdesign
       * @license MIT
       */
      var THEME_LIST = ["info", "success", "warning", "error", "question", "loading"];
      var DISTANCE = "32px";
      var PLACEMENT_OFFSET = {
        top: {
          top: DISTANCE,
          left: "50%",
          transform: "translateX(-50%)"
        },
        center: {
          left: "50%",
          top: "50%",
          transform: "translateX(-50%) translateY(-50%)"
        },
        left: {
          left: DISTANCE,
          top: "50%",
          transform: "translateY(-50%)"
        },
        bottom: {
          bottom: DISTANCE,
          left: "50%",
          transform: "translateX(-50%)"
        },
        right: {
          right: DISTANCE,
          top: "50%",
          transform: "translateY(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end"
        },
        "top-left": {
          left: DISTANCE,
          top: DISTANCE
        },
        "top-right": {
          right: DISTANCE,
          top: DISTANCE,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end"
        },
        "bottom-right": {
          right: DISTANCE,
          bottom: DISTANCE,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end"
        },
        "bottom-left": {
          left: DISTANCE,
          bottom: DISTANCE
        }
      };
      var PLACEMENT_LIST = Object.keys(PLACEMENT_OFFSET);
      /**
       * tdesign v1.17.1
       * (c) 2025 tdesign
       * @license MIT
       */
      var props$b = {
        closeBtn: {
          type: [String, Boolean, Function],
          "default": void 0
        },
        content: {
          type: [String, Function]
        },
        duration: {
          type: Number,
          "default": 3e3
        },
        icon: {
          type: [Boolean, Function],
          "default": true
        },
        theme: {
          type: String,
          "default": "info",
          validator: function validator(val) {
            if (!val) return true;
            return ["info", "success", "warning", "error", "question", "loading"].includes(val);
          }
        },
        onClose: Function,
        onCloseBtnClick: Function,
        onDurationEnd: Function
      };
      /**
       * tdesign v1.17.1
       * (c) 2025 tdesign
       * @license MIT
       */
      var ANIMATION_OPTION = {
        duration: 200,
        easing: "linear"
      };
      function fadeIn(dom, placement) {
        if (!dom) return;
        var offsetWidth = (dom === null || dom === void 0 ? void 0 : dom.offsetWidth) || 0;
        var offsetHeight = (dom === null || dom === void 0 ? void 0 : dom.offsetHeight) || 0;
        var fadeInKeyframes = getFadeInKeyframes(placement, offsetWidth, offsetHeight);
        if (!fadeInKeyframes) return;
        var styleAfterFadeIn = fadeInKeyframes[fadeInKeyframes.length - 1];
        setDomStyleAfterAnimation(dom, styleAfterFadeIn);
        dom.animate && dom.animate(fadeInKeyframes, ANIMATION_OPTION);
      }
      function fadeOut(dom, placement, onFinish) {
        if (!dom) return;
        var offsetHeight = (dom === null || dom === void 0 ? void 0 : dom.offsetHeight) || 0;
        var fadeOutKeyframes = getFadeOutKeyframes(placement, offsetHeight);
        if (!fadeOutKeyframes) return onFinish();
        var styleAfterFadeOut = fadeOutKeyframes[fadeOutKeyframes.length - 1];
        setDomStyleAfterAnimation(dom, styleAfterFadeOut);
        var animation = dom.animate && dom.animate(fadeOutKeyframes, ANIMATION_OPTION);
        if (animation) {
          animation.onfinish = function() {
            dom.style.display = "none";
            onFinish();
          };
        } else {
          dom.style.display = "none";
          onFinish();
        }
      }
      function setDomStyleAfterAnimation(dom, styleAfterAnimation) {
        var keys2 = Object.keys(styleAfterAnimation);
        for (var i2 = 0; i2 < keys2.length; i2 += 1) {
          var key2 = keys2[i2];
          dom.style[key2] = styleAfterAnimation[key2];
        }
      }
      function getFadeInKeyframes(placement, offsetWidth, offsetHeight) {
        if (!PLACEMENT_LIST.includes(placement)) return null;
        if (["top-left", "left", "bottom-left"].includes(placement)) {
          return [{
            opacity: 0,
            marginLeft: "-".concat(offsetWidth, "px")
          }, {
            opacity: 1,
            marginLeft: "0"
          }];
        }
        if (["top-right", "right", "bottom-right"].includes(placement)) {
          return [{
            opacity: 0,
            marginRight: "-".concat(offsetWidth, "px")
          }, {
            opacity: 1,
            marginRight: "0"
          }];
        }
        if (["top", "center"].includes(placement)) {
          return [{
            opacity: 0,
            marginTop: "-".concat(offsetHeight, "px")
          }, {
            opacity: 1,
            marginTop: "0"
          }];
        }
        if (["bottom"].includes(placement)) {
          return [{
            opacity: 0,
            transform: "translate3d(0, ".concat(offsetHeight, "px, 0)")
          }, {
            opacity: 1,
            transform: "translate3d(0, 0, 0)"
          }];
        }
      }
      function getFadeOutKeyframes(placement, offsetHeight) {
        if (!PLACEMENT_LIST.includes(placement)) return null;
        if (["bottom-left", "bottom", "bottom-right"].includes(placement)) {
          var marginOffset2 = "".concat(offsetHeight, "px");
          return [{
            opacity: 1,
            marginTop: "0px"
          }, {
            opacity: 0,
            marginTop: marginOffset2
          }];
        }
        var marginOffset = "-".concat(offsetHeight, "px");
        return [{
          opacity: 1,
          marginTop: "0px"
        }, {
          opacity: 0,
          marginTop: marginOffset
        }];
      }
      const indexCss$8 = ".t-message{margin:0;padding:0;list-style:none;width:fit-content;outline:0;border-radius:var(--td-radius-medium);background-color:var(--td-bg-color-container);box-shadow:var(--td-shadow-3),var(--td-shadow-inset-top),var(--td-shadow-inset-right),var(--td-shadow-inset-bottom),var(--td-shadow-inset-left);box-sizing:border-box;display:flex;align-items:center;color:var(--td-text-color-primary);font:var(--td-font-body-medium);padding:var(--td-comp-paddingTB-m) var(--td-comp-paddingLR-l)}.t-message>.t-icon,.t-message>[data-t-icon]>.t-icon,.t-message .t-loading{color:var(--td-brand-color);margin-right:var(--td-comp-margin-s);flex-shrink:0;font-size:calc(var(--td-font-size-body-medium) + 6px)}.t-message.t-is-success>.t-icon,.t-message.t-is-success>[data-t-icon]>.t-icon,.t-message.t-is-success .t-loading{color:var(--td-success-color)}.t-message.t-is-warning>.t-icon,.t-message.t-is-warning>[data-t-icon]>.t-icon,.t-message.t-is-warning .t-loading{color:var(--td-warning-color)}.t-message.t-is-error>.t-icon,.t-message.t-is-error>[data-t-icon]>.t-icon,.t-message.t-is-error .t-loading{color:var(--td-error-color)}.t-message.t-is-closable .t-message__close{display:inline-flex;margin-right:0;margin-left:var(--td-comp-margin-xxl);cursor:pointer;color:var(--td-text-color-secondary)}.t-message.t-is-closable .t-message__close .t-icon-close{font-size:calc(var(--td-font-size-body-medium) + 2px);border-radius:var(--td-radius-default);transition:all .2s linear}.t-message.t-is-closable .t-message__close .t-icon-close:hover{background:var(--td-bg-color-container-hover)}.t-message.t-is-closable .t-message__close .t-icon-close:active{background:var(--td-bg-color-container-active)}.t-message__list{position:fixed;z-index:6000;pointer-events:none}.t-message__list .t-message{margin-bottom:var(--td-comp-margin-s);word-break:break-all;pointer-events:auto}";
      importCSS(indexCss$8);
      /**
       * tdesign v1.17.1
       * (c) 2025 tdesign
       * @license MIT
       */
      function ownKeys$e(e, r) {
        var t2 = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
          var o = Object.getOwnPropertySymbols(e);
          r && (o = o.filter(function(r2) {
            return Object.getOwnPropertyDescriptor(e, r2).enumerable;
          })), t2.push.apply(t2, o);
        }
        return t2;
      }
      function _objectSpread$e(e) {
        for (var r = 1; r < arguments.length; r++) {
          var t2 = null != arguments[r] ? arguments[r] : {};
          r % 2 ? ownKeys$e(Object(t2), true).forEach(function(r2) {
            _defineProperty$1(e, r2, t2[r2]);
          }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t2)) : ownKeys$e(Object(t2)).forEach(function(r2) {
            Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t2, r2));
          });
        }
        return e;
      }
      var _Message = vue.defineComponent({
        name: "TMessage",
        props: _objectSpread$e(_objectSpread$e({}, props$b), {}, {
          placement: String
        }),
        setup: function setup(props2, _ref) {
          var slots = _ref.slots, expose = _ref.expose;
          var COMPONENT_NAME = usePrefixClass("message");
          var _useGlobalIcon = useGlobalIcon({
            InfoCircleFilledIcon: infoCircleFilled,
            CheckCircleFilledIcon: checkCircleFilled,
            ErrorCircleFilledIcon: errorCircleFilled,
            HelpCircleFilledIcon: helpCircleFilled,
            CloseIcon: close
          }), InfoCircleFilledIcon$1 = _useGlobalIcon.InfoCircleFilledIcon, CheckCircleFilledIcon$1 = _useGlobalIcon.CheckCircleFilledIcon, ErrorCircleFilledIcon$1 = _useGlobalIcon.ErrorCircleFilledIcon, HelpCircleFilledIcon$1 = _useGlobalIcon.HelpCircleFilledIcon, CloseIcon$1 = _useGlobalIcon.CloseIcon;
          var classPrefix = usePrefixClass();
          var renderTNode = useTNodeJSX();
          var renderContent = useContent();
          var msgRef = vue.ref(null);
          var timer = vue.ref(null);
          var classes = vue.computed(function() {
            var status = {};
            THEME_LIST.forEach(function(t2) {
              return status["".concat(classPrefix.value, "-is-").concat(t2)] = props2.theme === t2;
            });
            return [COMPONENT_NAME.value, status, _defineProperty$1({}, "".concat(classPrefix.value, "-is-closable"), props2.closeBtn || slots.closeBtn)];
          });
          var close$1 = function close2(e) {
            var _props2$onClose, _props2$onCloseBtnCli;
            (_props2$onClose = props2.onClose) === null || _props2$onClose === void 0 || _props2$onClose.call(props2, {
              trigger: "close-click",
              e
            });
            (_props2$onCloseBtnCli = props2.onCloseBtnClick) === null || _props2$onCloseBtnCli === void 0 || _props2$onCloseBtnCli.call(props2, {
              e
            });
          };
          var clearTimer = function clearTimer2() {
            props2.duration && clearTimeout(timer.value);
          };
          var setTimer = function setTimer2() {
            if (!props2.duration) {
              return;
            }
            timer.value = Number(setTimeout(function() {
              clearTimer();
              var msgDom = msgRef.value;
              fadeOut(msgDom, props2.placement, function() {
                var _props2$onClose2, _props2$onDurationEnd;
                (_props2$onClose2 = props2.onClose) === null || _props2$onClose2 === void 0 || _props2$onClose2.call(props2, {
                  trigger: "duration-end"
                });
                (_props2$onDurationEnd = props2.onDurationEnd) === null || _props2$onDurationEnd === void 0 || _props2$onDurationEnd.call(props2);
              });
            }, props2.duration));
          };
          var renderClose = function renderClose2() {
            var defaultClose = vue.createVNode(CloseIcon$1, null, null);
            return vue.createVNode("span", {
              "class": "".concat(COMPONENT_NAME.value, "__close"),
              "onClick": close$1
            }, [renderTNode("closeBtn", defaultClose)]);
          };
          var renderIcon = function renderIcon2() {
            if (props2.icon === false) return;
            if (isFunction(props2.icon)) return props2.icon(vue.h);
            if (slots.icon) {
              return slots.icon(null);
            }
            var Icon = {
              info: InfoCircleFilledIcon$1,
              success: CheckCircleFilledIcon$1,
              warning: ErrorCircleFilledIcon$1,
              error: ErrorCircleFilledIcon$1,
              question: HelpCircleFilledIcon$1,
              loading: Loading
            }[props2.theme];
            return vue.createVNode(Icon, null, null);
          };
          vue.onBeforeMount(function() {
            props2.duration && setTimer();
          });
          vue.onMounted(function() {
            var msgDom = msgRef.value;
            fadeIn(msgDom, props2.placement);
          });
          expose({
            close: close$1
          });
          return function() {
            return vue.createVNode("div", {
              "ref": msgRef,
              "class": classes.value,
              "onMouseenter": clearTimer,
              "onMouseleave": setTimer
            }, [renderIcon(), renderContent("content", "default"), renderClose()]);
          };
        }
      });
      /**
       * tdesign v1.17.1
       * (c) 2025 tdesign
       * @license MIT
       */
      function ownKeys$d(e, r) {
        var t2 = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
          var o = Object.getOwnPropertySymbols(e);
          r && (o = o.filter(function(r2) {
            return Object.getOwnPropertyDescriptor(e, r2).enumerable;
          })), t2.push.apply(t2, o);
        }
        return t2;
      }
      function _objectSpread$d(e) {
        for (var r = 1; r < arguments.length; r++) {
          var t2 = null != arguments[r] ? arguments[r] : {};
          r % 2 ? ownKeys$d(Object(t2), true).forEach(function(r2) {
            _defineProperty$1(e, r2, t2[r2]);
          }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t2)) : ownKeys$d(Object(t2)).forEach(function(r2) {
            Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t2, r2));
          });
        }
        return e;
      }
      var DEFAULT_Z_INDEX = 6e3;
      var getUniqueId = (function() {
        var id2 = 0;
        return function() {
          id2 += 1;
          return id2;
        };
      })();
      var MessageList = vue.defineComponent({
        name: "TMessageList",
        props: {
          zIndex: {
            type: Number,
            "default": 0
          },
          placement: {
            type: String,
            "default": ""
          }
        },
        setup: function setup(props2, _ref) {
          var expose = _ref.expose;
          var COMPONENT_NAME = usePrefixClass("message__list");
          var list = vue.ref([]);
          var messageList = vue.ref([]);
          var styles = vue.computed(function() {
            return _objectSpread$d(_objectSpread$d({}, PLACEMENT_OFFSET[props2.placement]), {}, {
              zIndex: props2.zIndex !== DEFAULT_Z_INDEX ? props2.zIndex : DEFAULT_Z_INDEX
            });
          });
          var add = function add2(msg) {
            var mg = _objectSpread$d(_objectSpread$d({}, msg), {}, {
              key: getUniqueId()
            });
            list.value.push(mg);
            return mg.key;
          };
          var remove = function remove2(index) {
            list.value.splice(index, 1);
          };
          var removeAll = function removeAll2() {
            list.value = [];
          };
          var getOffset = function getOffset2(val) {
            if (!val) return;
            return isNaN(Number(val)) ? val : "".concat(val, "px");
          };
          var msgStyles = function msgStyles2(item) {
            return item.offset && {
              position: "relative",
              left: getOffset(item.offset[0]),
              top: getOffset(item.offset[1])
            };
          };
          var getProps = function getProps2(index, item) {
            return _objectSpread$d(_objectSpread$d({}, item), {}, {
              onCloseBtnClick: function onCloseBtnClick(e) {
                if (item.onCloseBtnClick) {
                  item.onCloseBtnClick(e);
                }
                return remove(index);
              },
              onDurationEnd: function onDurationEnd() {
                if (item.onDurationEnd) {
                  item.onDurationEnd();
                }
                return remove(index);
              }
            });
          };
          var addChild = function addChild2(el) {
            if (el) {
              messageList.value.push(el);
            }
          };
          expose({
            add,
            removeAll,
            list,
            messageList
          });
          return function() {
            if (!list.value.length) return;
            return vue.createVNode("div", {
              "class": COMPONENT_NAME.value,
              "style": styles.value
            }, [list.value.map(function(item, index) {
              return vue.createVNode(_Message, vue.mergeProps({
                "key": item.key,
                "style": msgStyles(item),
                "ref": addChild
              }, getProps(index, item)), null);
            })]);
          };
        }
      });
      /**
       * tdesign v1.17.1
       * (c) 2025 tdesign
       * @license MIT
       */
      function ownKeys$c(e, r) {
        var t2 = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
          var o = Object.getOwnPropertySymbols(e);
          r && (o = o.filter(function(r2) {
            return Object.getOwnPropertyDescriptor(e, r2).enumerable;
          })), t2.push.apply(t2, o);
        }
        return t2;
      }
      function _objectSpread$c(e) {
        for (var r = 1; r < arguments.length; r++) {
          var t2 = null != arguments[r] ? arguments[r] : {};
          r % 2 ? ownKeys$c(Object(t2), true).forEach(function(r2) {
            _defineProperty$1(e, r2, t2[r2]);
          }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t2)) : ownKeys$c(Object(t2)).forEach(function(r2) {
            Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t2, r2));
          });
        }
        return e;
      }
      var instanceMap = new Map();
      function handleParams(params) {
        var options = _objectSpread$c({
          duration: 3e3,
          attach: "body",
          zIndex: DEFAULT_Z_INDEX,
          placement: "top"
        }, params);
        options.content = params.content;
        return options;
      }
      var MessageFunction = function MessageFunction2(props2, context) {
        var options = handleParams(props2);
        var attach = options.attach, placement = options.placement;
        var attachDom = getAttach(attach);
        if (!instanceMap.get(attachDom)) {
          instanceMap.set(attachDom, {});
        }
        var p = instanceMap.get(attachDom)[placement];
        var mgKey;
        if (!p || !attachDom.contains(p.el)) {
          var wrapper = document.createElement("div");
          var instance = vue.createVNode(MessageList, {
            zIndex: options.zIndex,
            placement: options.placement
          });
          if (context !== null && context !== void 0 ? context : MessagePlugin._context) {
            instance.appContext = context !== null && context !== void 0 ? context : MessagePlugin._context;
          }
          attachDom.appendChild(wrapper);
          vue.render(instance, wrapper);
          mgKey = instance.component.exposed.add(options);
          instanceMap.get(attachDom)[placement] = instance;
        } else {
          mgKey = p.component.exposed.add(options);
        }
        return new Promise(function(resolve) {
          var ins = instanceMap.get(attachDom)[placement];
          vue.nextTick(function() {
            var msg = ins.component.exposed.messageList.value;
            resolve(msg === null || msg === void 0 ? void 0 : msg.find(function(mg) {
              var _mg$$;
              return ((_mg$$ = mg.$) === null || _mg$$ === void 0 || (_mg$$ = _mg$$.vnode) === null || _mg$$ === void 0 ? void 0 : _mg$$.key) === mgKey;
            }));
          });
        });
      };
      var showThemeMessage = function showThemeMessage2(theme, params, duration, context) {
        var options = {
          theme
        };
        if (isString(params)) {
          options.content = params;
        } else if (isObject(params) && !(params instanceof Array)) {
          options = _objectSpread$c(_objectSpread$c({}, options), params);
        }
        (duration || duration === 0) && (options.duration = duration);
        return MessageFunction(options, context);
      };
      var extraApi$1 = {
        info: function info(params, duration, context) {
          return showThemeMessage("info", params, duration, context);
        },
        success: function success(params, duration, context) {
          return showThemeMessage("success", params, duration, context);
        },
        warning: function warning(params, duration, context) {
          return showThemeMessage("warning", params, duration, context);
        },
        error: function error(params, duration, context) {
          return showThemeMessage("error", params, duration, context);
        },
        question: function question(params, duration, context) {
          return showThemeMessage("question", params, duration, context);
        },
        loading: function loading(params, duration, context) {
          return showThemeMessage("loading", params, duration, context);
        },
        close: function close2(promise) {
          promise.then(function(instance) {
            return instance === null || instance === void 0 ? void 0 : instance.close();
          });
        },
        closeAll: function closeAll() {
          if (instanceMap instanceof Map) {
            instanceMap.forEach(function(attach) {
              Object.keys(attach).forEach(function(placement) {
                var instance = attach[placement];
                instance.component.exposed.removeAll();
              });
            });
          }
        }
      };
      var MessagePlugin = showThemeMessage;
      MessagePlugin.install = function(app) {
        app.config.globalProperties.$message = showThemeMessage;
        Object.keys(extraApi$1).forEach(function(funcName) {
          app.config.globalProperties.$message[funcName] = extraApi$1[funcName];
        });
        MessagePlugin._context = app._context;
      };
      Object.keys(extraApi$1).forEach(function(funcName) {
        MessagePlugin[funcName] = extraApi$1[funcName];
      });
      var top = "top";
      var bottom = "bottom";
      var right = "right";
      var left = "left";
      var auto = "auto";
      var basePlacements = [top, bottom, right, left];
      var start = "start";
      var end = "end";
      var clippingParents = "clippingParents";
      var viewport = "viewport";
      var popper = "popper";
      var reference = "reference";
      var variationPlacements = basePlacements.reduce(function(acc, placement) {
        return acc.concat([placement + "-" + start, placement + "-" + end]);
      }, []);
      var placements = [].concat(basePlacements, [auto]).reduce(function(acc, placement) {
        return acc.concat([placement, placement + "-" + start, placement + "-" + end]);
      }, []);
      var beforeRead = "beforeRead";
      var read = "read";
      var afterRead = "afterRead";
      var beforeMain = "beforeMain";
      var main = "main";
      var afterMain = "afterMain";
      var beforeWrite = "beforeWrite";
      var write = "write";
      var afterWrite = "afterWrite";
      var modifierPhases = [beforeRead, read, afterRead, beforeMain, main, afterMain, beforeWrite, write, afterWrite];
      function getNodeName(element2) {
        return element2 ? (element2.nodeName || "").toLowerCase() : null;
      }
      function getWindow(node) {
        if (node == null) {
          return window;
        }
        if (node.toString() !== "[object Window]") {
          var ownerDocument = node.ownerDocument;
          return ownerDocument ? ownerDocument.defaultView || window : window;
        }
        return node;
      }
      function isElement(node) {
        var OwnElement = getWindow(node).Element;
        return node instanceof OwnElement || node instanceof Element;
      }
      function isHTMLElement(node) {
        var OwnElement = getWindow(node).HTMLElement;
        return node instanceof OwnElement || node instanceof HTMLElement;
      }
      function isShadowRoot(node) {
        if (typeof ShadowRoot === "undefined") {
          return false;
        }
        var OwnElement = getWindow(node).ShadowRoot;
        return node instanceof OwnElement || node instanceof ShadowRoot;
      }
      function applyStyles(_ref) {
        var state = _ref.state;
        Object.keys(state.elements).forEach(function(name) {
          var style = state.styles[name] || {};
          var attributes = state.attributes[name] || {};
          var element2 = state.elements[name];
          if (!isHTMLElement(element2) || !getNodeName(element2)) {
            return;
          }
          Object.assign(element2.style, style);
          Object.keys(attributes).forEach(function(name2) {
            var value = attributes[name2];
            if (value === false) {
              element2.removeAttribute(name2);
            } else {
              element2.setAttribute(name2, value === true ? "" : value);
            }
          });
        });
      }
      function effect$2(_ref2) {
        var state = _ref2.state;
        var initialStyles = {
          popper: {
            position: state.options.strategy,
            left: "0",
            top: "0",
            margin: "0"
          },
          arrow: {
            position: "absolute"
          },
          reference: {}
        };
        Object.assign(state.elements.popper.style, initialStyles.popper);
        state.styles = initialStyles;
        if (state.elements.arrow) {
          Object.assign(state.elements.arrow.style, initialStyles.arrow);
        }
        return function() {
          Object.keys(state.elements).forEach(function(name) {
            var element2 = state.elements[name];
            var attributes = state.attributes[name] || {};
            var styleProperties = Object.keys(state.styles.hasOwnProperty(name) ? state.styles[name] : initialStyles[name]);
            var style = styleProperties.reduce(function(style2, property2) {
              style2[property2] = "";
              return style2;
            }, {});
            if (!isHTMLElement(element2) || !getNodeName(element2)) {
              return;
            }
            Object.assign(element2.style, style);
            Object.keys(attributes).forEach(function(attribute) {
              element2.removeAttribute(attribute);
            });
          });
        };
      }
      const applyStyles$1 = {
        name: "applyStyles",
        enabled: true,
        phase: "write",
        fn: applyStyles,
        effect: effect$2,
        requires: ["computeStyles"]
      };
      function getBasePlacement(placement) {
        return placement.split("-")[0];
      }
      var max = Math.max;
      var min = Math.min;
      var round = Math.round;
      function getUAString() {
        var uaData = navigator.userAgentData;
        if (uaData != null && uaData.brands && Array.isArray(uaData.brands)) {
          return uaData.brands.map(function(item) {
            return item.brand + "/" + item.version;
          }).join(" ");
        }
        return navigator.userAgent;
      }
      function isLayoutViewport() {
        return !/^((?!chrome|android).)*safari/i.test(getUAString());
      }
      function getBoundingClientRect(element2, includeScale, isFixedStrategy) {
        if (includeScale === void 0) {
          includeScale = false;
        }
        if (isFixedStrategy === void 0) {
          isFixedStrategy = false;
        }
        var clientRect = element2.getBoundingClientRect();
        var scaleX = 1;
        var scaleY = 1;
        if (includeScale && isHTMLElement(element2)) {
          scaleX = element2.offsetWidth > 0 ? round(clientRect.width) / element2.offsetWidth || 1 : 1;
          scaleY = element2.offsetHeight > 0 ? round(clientRect.height) / element2.offsetHeight || 1 : 1;
        }
        var _ref = isElement(element2) ? getWindow(element2) : window, visualViewport = _ref.visualViewport;
        var addVisualOffsets = !isLayoutViewport() && isFixedStrategy;
        var x = (clientRect.left + (addVisualOffsets && visualViewport ? visualViewport.offsetLeft : 0)) / scaleX;
        var y = (clientRect.top + (addVisualOffsets && visualViewport ? visualViewport.offsetTop : 0)) / scaleY;
        var width = clientRect.width / scaleX;
        var height = clientRect.height / scaleY;
        return {
          width,
          height,
          top: y,
          right: x + width,
          bottom: y + height,
          left: x,
          x,
          y
        };
      }
      function getLayoutRect(element2) {
        var clientRect = getBoundingClientRect(element2);
        var width = element2.offsetWidth;
        var height = element2.offsetHeight;
        if (Math.abs(clientRect.width - width) <= 1) {
          width = clientRect.width;
        }
        if (Math.abs(clientRect.height - height) <= 1) {
          height = clientRect.height;
        }
        return {
          x: element2.offsetLeft,
          y: element2.offsetTop,
          width,
          height
        };
      }
      function contains(parent2, child) {
        var rootNode = child.getRootNode && child.getRootNode();
        if (parent2.contains(child)) {
          return true;
        } else if (rootNode && isShadowRoot(rootNode)) {
          var next = child;
          do {
            if (next && parent2.isSameNode(next)) {
              return true;
            }
            next = next.parentNode || next.host;
          } while (next);
        }
        return false;
      }
      function getComputedStyle$1(element2) {
        return getWindow(element2).getComputedStyle(element2);
      }
      function isTableElement(element2) {
        return ["table", "td", "th"].indexOf(getNodeName(element2)) >= 0;
      }
      function getDocumentElement(element2) {
        return ((isElement(element2) ? element2.ownerDocument : (
element2.document
        )) || window.document).documentElement;
      }
      function getParentNode(element2) {
        if (getNodeName(element2) === "html") {
          return element2;
        }
        return (


element2.assignedSlot ||
element2.parentNode ||
(isShadowRoot(element2) ? element2.host : null) ||

getDocumentElement(element2)
        );
      }
      function getTrueOffsetParent(element2) {
        if (!isHTMLElement(element2) ||
getComputedStyle$1(element2).position === "fixed") {
          return null;
        }
        return element2.offsetParent;
      }
      function getContainingBlock(element2) {
        var isFirefox = /firefox/i.test(getUAString());
        var isIE = /Trident/i.test(getUAString());
        if (isIE && isHTMLElement(element2)) {
          var elementCss = getComputedStyle$1(element2);
          if (elementCss.position === "fixed") {
            return null;
          }
        }
        var currentNode = getParentNode(element2);
        if (isShadowRoot(currentNode)) {
          currentNode = currentNode.host;
        }
        while (isHTMLElement(currentNode) && ["html", "body"].indexOf(getNodeName(currentNode)) < 0) {
          var css = getComputedStyle$1(currentNode);
          if (css.transform !== "none" || css.perspective !== "none" || css.contain === "paint" || ["transform", "perspective"].indexOf(css.willChange) !== -1 || isFirefox && css.willChange === "filter" || isFirefox && css.filter && css.filter !== "none") {
            return currentNode;
          } else {
            currentNode = currentNode.parentNode;
          }
        }
        return null;
      }
      function getOffsetParent(element2) {
        var window2 = getWindow(element2);
        var offsetParent = getTrueOffsetParent(element2);
        while (offsetParent && isTableElement(offsetParent) && getComputedStyle$1(offsetParent).position === "static") {
          offsetParent = getTrueOffsetParent(offsetParent);
        }
        if (offsetParent && (getNodeName(offsetParent) === "html" || getNodeName(offsetParent) === "body" && getComputedStyle$1(offsetParent).position === "static")) {
          return window2;
        }
        return offsetParent || getContainingBlock(element2) || window2;
      }
      function getMainAxisFromPlacement(placement) {
        return ["top", "bottom"].indexOf(placement) >= 0 ? "x" : "y";
      }
      function within(min$12, value, max$12) {
        return max(min$12, min(value, max$12));
      }
      function withinMaxClamp(min2, value, max2) {
        var v = within(min2, value, max2);
        return v > max2 ? max2 : v;
      }
      function getFreshSideObject() {
        return {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0
        };
      }
      function mergePaddingObject(paddingObject) {
        return Object.assign({}, getFreshSideObject(), paddingObject);
      }
      function expandToHashMap(value, keys2) {
        return keys2.reduce(function(hashMap, key2) {
          hashMap[key2] = value;
          return hashMap;
        }, {});
      }
      var toPaddingObject = function toPaddingObject2(padding, state) {
        padding = typeof padding === "function" ? padding(Object.assign({}, state.rects, {
          placement: state.placement
        })) : padding;
        return mergePaddingObject(typeof padding !== "number" ? padding : expandToHashMap(padding, basePlacements));
      };
      function arrow(_ref) {
        var _state$modifiersData$;
        var state = _ref.state, name = _ref.name, options = _ref.options;
        var arrowElement = state.elements.arrow;
        var popperOffsets2 = state.modifiersData.popperOffsets;
        var basePlacement = getBasePlacement(state.placement);
        var axis = getMainAxisFromPlacement(basePlacement);
        var isVertical = [left, right].indexOf(basePlacement) >= 0;
        var len = isVertical ? "height" : "width";
        if (!arrowElement || !popperOffsets2) {
          return;
        }
        var paddingObject = toPaddingObject(options.padding, state);
        var arrowRect = getLayoutRect(arrowElement);
        var minProp = axis === "y" ? top : left;
        var maxProp = axis === "y" ? bottom : right;
        var endDiff = state.rects.reference[len] + state.rects.reference[axis] - popperOffsets2[axis] - state.rects.popper[len];
        var startDiff = popperOffsets2[axis] - state.rects.reference[axis];
        var arrowOffsetParent = getOffsetParent(arrowElement);
        var clientSize = arrowOffsetParent ? axis === "y" ? arrowOffsetParent.clientHeight || 0 : arrowOffsetParent.clientWidth || 0 : 0;
        var centerToReference = endDiff / 2 - startDiff / 2;
        var min2 = paddingObject[minProp];
        var max2 = clientSize - arrowRect[len] - paddingObject[maxProp];
        var center = clientSize / 2 - arrowRect[len] / 2 + centerToReference;
        var offset2 = within(min2, center, max2);
        var axisProp = axis;
        state.modifiersData[name] = (_state$modifiersData$ = {}, _state$modifiersData$[axisProp] = offset2, _state$modifiersData$.centerOffset = offset2 - center, _state$modifiersData$);
      }
      function effect$1(_ref2) {
        var state = _ref2.state, options = _ref2.options;
        var _options$element = options.element, arrowElement = _options$element === void 0 ? "[data-popper-arrow]" : _options$element;
        if (arrowElement == null) {
          return;
        }
        if (typeof arrowElement === "string") {
          arrowElement = state.elements.popper.querySelector(arrowElement);
          if (!arrowElement) {
            return;
          }
        }
        if (!contains(state.elements.popper, arrowElement)) {
          return;
        }
        state.elements.arrow = arrowElement;
      }
      const arrow$1 = {
        name: "arrow",
        enabled: true,
        phase: "main",
        fn: arrow,
        effect: effect$1,
        requires: ["popperOffsets"],
        requiresIfExists: ["preventOverflow"]
      };
      function getVariation(placement) {
        return placement.split("-")[1];
      }
      var unsetSides = {
        top: "auto",
        right: "auto",
        bottom: "auto",
        left: "auto"
      };
      function roundOffsetsByDPR(_ref, win) {
        var x = _ref.x, y = _ref.y;
        var dpr = win.devicePixelRatio || 1;
        return {
          x: round(x * dpr) / dpr || 0,
          y: round(y * dpr) / dpr || 0
        };
      }
      function mapToStyles(_ref2) {
        var _Object$assign2;
        var popper2 = _ref2.popper, popperRect = _ref2.popperRect, placement = _ref2.placement, variation = _ref2.variation, offsets = _ref2.offsets, position = _ref2.position, gpuAcceleration = _ref2.gpuAcceleration, adaptive = _ref2.adaptive, roundOffsets = _ref2.roundOffsets, isFixed = _ref2.isFixed;
        var _offsets$x = offsets.x, x = _offsets$x === void 0 ? 0 : _offsets$x, _offsets$y = offsets.y, y = _offsets$y === void 0 ? 0 : _offsets$y;
        var _ref3 = typeof roundOffsets === "function" ? roundOffsets({
          x,
          y
        }) : {
          x,
          y
        };
        x = _ref3.x;
        y = _ref3.y;
        var hasX = offsets.hasOwnProperty("x");
        var hasY = offsets.hasOwnProperty("y");
        var sideX = left;
        var sideY = top;
        var win = window;
        if (adaptive) {
          var offsetParent = getOffsetParent(popper2);
          var heightProp = "clientHeight";
          var widthProp = "clientWidth";
          if (offsetParent === getWindow(popper2)) {
            offsetParent = getDocumentElement(popper2);
            if (getComputedStyle$1(offsetParent).position !== "static" && position === "absolute") {
              heightProp = "scrollHeight";
              widthProp = "scrollWidth";
            }
          }
          offsetParent = offsetParent;
          if (placement === top || (placement === left || placement === right) && variation === end) {
            sideY = bottom;
            var offsetY = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.height : (
offsetParent[heightProp]
            );
            y -= offsetY - popperRect.height;
            y *= gpuAcceleration ? 1 : -1;
          }
          if (placement === left || (placement === top || placement === bottom) && variation === end) {
            sideX = right;
            var offsetX = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.width : (
offsetParent[widthProp]
            );
            x -= offsetX - popperRect.width;
            x *= gpuAcceleration ? 1 : -1;
          }
        }
        var commonStyles = Object.assign({
          position
        }, adaptive && unsetSides);
        var _ref4 = roundOffsets === true ? roundOffsetsByDPR({
          x,
          y
        }, getWindow(popper2)) : {
          x,
          y
        };
        x = _ref4.x;
        y = _ref4.y;
        if (gpuAcceleration) {
          var _Object$assign;
          return Object.assign({}, commonStyles, (_Object$assign = {}, _Object$assign[sideY] = hasY ? "0" : "", _Object$assign[sideX] = hasX ? "0" : "", _Object$assign.transform = (win.devicePixelRatio || 1) <= 1 ? "translate(" + x + "px, " + y + "px)" : "translate3d(" + x + "px, " + y + "px, 0)", _Object$assign));
        }
        return Object.assign({}, commonStyles, (_Object$assign2 = {}, _Object$assign2[sideY] = hasY ? y + "px" : "", _Object$assign2[sideX] = hasX ? x + "px" : "", _Object$assign2.transform = "", _Object$assign2));
      }
      function computeStyles(_ref5) {
        var state = _ref5.state, options = _ref5.options;
        var _options$gpuAccelerat = options.gpuAcceleration, gpuAcceleration = _options$gpuAccelerat === void 0 ? true : _options$gpuAccelerat, _options$adaptive = options.adaptive, adaptive = _options$adaptive === void 0 ? true : _options$adaptive, _options$roundOffsets = options.roundOffsets, roundOffsets = _options$roundOffsets === void 0 ? true : _options$roundOffsets;
        var commonStyles = {
          placement: getBasePlacement(state.placement),
          variation: getVariation(state.placement),
          popper: state.elements.popper,
          popperRect: state.rects.popper,
          gpuAcceleration,
          isFixed: state.options.strategy === "fixed"
        };
        if (state.modifiersData.popperOffsets != null) {
          state.styles.popper = Object.assign({}, state.styles.popper, mapToStyles(Object.assign({}, commonStyles, {
            offsets: state.modifiersData.popperOffsets,
            position: state.options.strategy,
            adaptive,
            roundOffsets
          })));
        }
        if (state.modifiersData.arrow != null) {
          state.styles.arrow = Object.assign({}, state.styles.arrow, mapToStyles(Object.assign({}, commonStyles, {
            offsets: state.modifiersData.arrow,
            position: "absolute",
            adaptive: false,
            roundOffsets
          })));
        }
        state.attributes.popper = Object.assign({}, state.attributes.popper, {
          "data-popper-placement": state.placement
        });
      }
      const computeStyles$1 = {
        name: "computeStyles",
        enabled: true,
        phase: "beforeWrite",
        fn: computeStyles,
        data: {}
      };
      var passive = {
        passive: true
      };
      function effect(_ref) {
        var state = _ref.state, instance = _ref.instance, options = _ref.options;
        var _options$scroll = options.scroll, scroll = _options$scroll === void 0 ? true : _options$scroll, _options$resize = options.resize, resize = _options$resize === void 0 ? true : _options$resize;
        var window2 = getWindow(state.elements.popper);
        var scrollParents = [].concat(state.scrollParents.reference, state.scrollParents.popper);
        if (scroll) {
          scrollParents.forEach(function(scrollParent) {
            scrollParent.addEventListener("scroll", instance.update, passive);
          });
        }
        if (resize) {
          window2.addEventListener("resize", instance.update, passive);
        }
        return function() {
          if (scroll) {
            scrollParents.forEach(function(scrollParent) {
              scrollParent.removeEventListener("scroll", instance.update, passive);
            });
          }
          if (resize) {
            window2.removeEventListener("resize", instance.update, passive);
          }
        };
      }
      const eventListeners = {
        name: "eventListeners",
        enabled: true,
        phase: "write",
        fn: function fn() {
        },
        effect,
        data: {}
      };
      var hash$1 = {
        left: "right",
        right: "left",
        bottom: "top",
        top: "bottom"
      };
      function getOppositePlacement(placement) {
        return placement.replace(/left|right|bottom|top/g, function(matched) {
          return hash$1[matched];
        });
      }
      var hash = {
        start: "end",
        end: "start"
      };
      function getOppositeVariationPlacement(placement) {
        return placement.replace(/start|end/g, function(matched) {
          return hash[matched];
        });
      }
      function getWindowScroll(node) {
        var win = getWindow(node);
        var scrollLeft = win.pageXOffset;
        var scrollTop = win.pageYOffset;
        return {
          scrollLeft,
          scrollTop
        };
      }
      function getWindowScrollBarX(element2) {
        return getBoundingClientRect(getDocumentElement(element2)).left + getWindowScroll(element2).scrollLeft;
      }
      function getViewportRect(element2, strategy) {
        var win = getWindow(element2);
        var html = getDocumentElement(element2);
        var visualViewport = win.visualViewport;
        var width = html.clientWidth;
        var height = html.clientHeight;
        var x = 0;
        var y = 0;
        if (visualViewport) {
          width = visualViewport.width;
          height = visualViewport.height;
          var layoutViewport = isLayoutViewport();
          if (layoutViewport || !layoutViewport && strategy === "fixed") {
            x = visualViewport.offsetLeft;
            y = visualViewport.offsetTop;
          }
        }
        return {
          width,
          height,
          x: x + getWindowScrollBarX(element2),
          y
        };
      }
      function getDocumentRect(element2) {
        var _element$ownerDocumen;
        var html = getDocumentElement(element2);
        var winScroll = getWindowScroll(element2);
        var body = (_element$ownerDocumen = element2.ownerDocument) == null ? void 0 : _element$ownerDocumen.body;
        var width = max(html.scrollWidth, html.clientWidth, body ? body.scrollWidth : 0, body ? body.clientWidth : 0);
        var height = max(html.scrollHeight, html.clientHeight, body ? body.scrollHeight : 0, body ? body.clientHeight : 0);
        var x = -winScroll.scrollLeft + getWindowScrollBarX(element2);
        var y = -winScroll.scrollTop;
        if (getComputedStyle$1(body || html).direction === "rtl") {
          x += max(html.clientWidth, body ? body.clientWidth : 0) - width;
        }
        return {
          width,
          height,
          x,
          y
        };
      }
      function isScrollParent(element2) {
        var _getComputedStyle = getComputedStyle$1(element2), overflow = _getComputedStyle.overflow, overflowX = _getComputedStyle.overflowX, overflowY = _getComputedStyle.overflowY;
        return /auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX);
      }
      function getScrollParent(node) {
        if (["html", "body", "#document"].indexOf(getNodeName(node)) >= 0) {
          return node.ownerDocument.body;
        }
        if (isHTMLElement(node) && isScrollParent(node)) {
          return node;
        }
        return getScrollParent(getParentNode(node));
      }
      function listScrollParents(element2, list) {
        var _element$ownerDocumen;
        if (list === void 0) {
          list = [];
        }
        var scrollParent = getScrollParent(element2);
        var isBody = scrollParent === ((_element$ownerDocumen = element2.ownerDocument) == null ? void 0 : _element$ownerDocumen.body);
        var win = getWindow(scrollParent);
        var target = isBody ? [win].concat(win.visualViewport || [], isScrollParent(scrollParent) ? scrollParent : []) : scrollParent;
        var updatedList = list.concat(target);
        return isBody ? updatedList : (
updatedList.concat(listScrollParents(getParentNode(target)))
        );
      }
      function rectToClientRect(rect) {
        return Object.assign({}, rect, {
          left: rect.x,
          top: rect.y,
          right: rect.x + rect.width,
          bottom: rect.y + rect.height
        });
      }
      function getInnerBoundingClientRect(element2, strategy) {
        var rect = getBoundingClientRect(element2, false, strategy === "fixed");
        rect.top = rect.top + element2.clientTop;
        rect.left = rect.left + element2.clientLeft;
        rect.bottom = rect.top + element2.clientHeight;
        rect.right = rect.left + element2.clientWidth;
        rect.width = element2.clientWidth;
        rect.height = element2.clientHeight;
        rect.x = rect.left;
        rect.y = rect.top;
        return rect;
      }
      function getClientRectFromMixedType(element2, clippingParent, strategy) {
        return clippingParent === viewport ? rectToClientRect(getViewportRect(element2, strategy)) : isElement(clippingParent) ? getInnerBoundingClientRect(clippingParent, strategy) : rectToClientRect(getDocumentRect(getDocumentElement(element2)));
      }
      function getClippingParents(element2) {
        var clippingParents2 = listScrollParents(getParentNode(element2));
        var canEscapeClipping = ["absolute", "fixed"].indexOf(getComputedStyle$1(element2).position) >= 0;
        var clipperElement = canEscapeClipping && isHTMLElement(element2) ? getOffsetParent(element2) : element2;
        if (!isElement(clipperElement)) {
          return [];
        }
        return clippingParents2.filter(function(clippingParent) {
          return isElement(clippingParent) && contains(clippingParent, clipperElement) && getNodeName(clippingParent) !== "body";
        });
      }
      function getClippingRect(element2, boundary, rootBoundary, strategy) {
        var mainClippingParents = boundary === "clippingParents" ? getClippingParents(element2) : [].concat(boundary);
        var clippingParents2 = [].concat(mainClippingParents, [rootBoundary]);
        var firstClippingParent = clippingParents2[0];
        var clippingRect = clippingParents2.reduce(function(accRect, clippingParent) {
          var rect = getClientRectFromMixedType(element2, clippingParent, strategy);
          accRect.top = max(rect.top, accRect.top);
          accRect.right = min(rect.right, accRect.right);
          accRect.bottom = min(rect.bottom, accRect.bottom);
          accRect.left = max(rect.left, accRect.left);
          return accRect;
        }, getClientRectFromMixedType(element2, firstClippingParent, strategy));
        clippingRect.width = clippingRect.right - clippingRect.left;
        clippingRect.height = clippingRect.bottom - clippingRect.top;
        clippingRect.x = clippingRect.left;
        clippingRect.y = clippingRect.top;
        return clippingRect;
      }
      function computeOffsets(_ref) {
        var reference2 = _ref.reference, element2 = _ref.element, placement = _ref.placement;
        var basePlacement = placement ? getBasePlacement(placement) : null;
        var variation = placement ? getVariation(placement) : null;
        var commonX = reference2.x + reference2.width / 2 - element2.width / 2;
        var commonY = reference2.y + reference2.height / 2 - element2.height / 2;
        var offsets;
        switch (basePlacement) {
          case top:
            offsets = {
              x: commonX,
              y: reference2.y - element2.height
            };
            break;
          case bottom:
            offsets = {
              x: commonX,
              y: reference2.y + reference2.height
            };
            break;
          case right:
            offsets = {
              x: reference2.x + reference2.width,
              y: commonY
            };
            break;
          case left:
            offsets = {
              x: reference2.x - element2.width,
              y: commonY
            };
            break;
          default:
            offsets = {
              x: reference2.x,
              y: reference2.y
            };
        }
        var mainAxis = basePlacement ? getMainAxisFromPlacement(basePlacement) : null;
        if (mainAxis != null) {
          var len = mainAxis === "y" ? "height" : "width";
          switch (variation) {
            case start:
              offsets[mainAxis] = offsets[mainAxis] - (reference2[len] / 2 - element2[len] / 2);
              break;
            case end:
              offsets[mainAxis] = offsets[mainAxis] + (reference2[len] / 2 - element2[len] / 2);
              break;
          }
        }
        return offsets;
      }
      function detectOverflow(state, options) {
        if (options === void 0) {
          options = {};
        }
        var _options = options, _options$placement = _options.placement, placement = _options$placement === void 0 ? state.placement : _options$placement, _options$strategy = _options.strategy, strategy = _options$strategy === void 0 ? state.strategy : _options$strategy, _options$boundary = _options.boundary, boundary = _options$boundary === void 0 ? clippingParents : _options$boundary, _options$rootBoundary = _options.rootBoundary, rootBoundary = _options$rootBoundary === void 0 ? viewport : _options$rootBoundary, _options$elementConte = _options.elementContext, elementContext = _options$elementConte === void 0 ? popper : _options$elementConte, _options$altBoundary = _options.altBoundary, altBoundary = _options$altBoundary === void 0 ? false : _options$altBoundary, _options$padding = _options.padding, padding = _options$padding === void 0 ? 0 : _options$padding;
        var paddingObject = mergePaddingObject(typeof padding !== "number" ? padding : expandToHashMap(padding, basePlacements));
        var altContext = elementContext === popper ? reference : popper;
        var popperRect = state.rects.popper;
        var element2 = state.elements[altBoundary ? altContext : elementContext];
        var clippingClientRect = getClippingRect(isElement(element2) ? element2 : element2.contextElement || getDocumentElement(state.elements.popper), boundary, rootBoundary, strategy);
        var referenceClientRect = getBoundingClientRect(state.elements.reference);
        var popperOffsets2 = computeOffsets({
          reference: referenceClientRect,
          element: popperRect,
          placement
        });
        var popperClientRect = rectToClientRect(Object.assign({}, popperRect, popperOffsets2));
        var elementClientRect = elementContext === popper ? popperClientRect : referenceClientRect;
        var overflowOffsets = {
          top: clippingClientRect.top - elementClientRect.top + paddingObject.top,
          bottom: elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom,
          left: clippingClientRect.left - elementClientRect.left + paddingObject.left,
          right: elementClientRect.right - clippingClientRect.right + paddingObject.right
        };
        var offsetData = state.modifiersData.offset;
        if (elementContext === popper && offsetData) {
          var offset2 = offsetData[placement];
          Object.keys(overflowOffsets).forEach(function(key2) {
            var multiply = [right, bottom].indexOf(key2) >= 0 ? 1 : -1;
            var axis = [top, bottom].indexOf(key2) >= 0 ? "y" : "x";
            overflowOffsets[key2] += offset2[axis] * multiply;
          });
        }
        return overflowOffsets;
      }
      function computeAutoPlacement(state, options) {
        if (options === void 0) {
          options = {};
        }
        var _options = options, placement = _options.placement, boundary = _options.boundary, rootBoundary = _options.rootBoundary, padding = _options.padding, flipVariations = _options.flipVariations, _options$allowedAutoP = _options.allowedAutoPlacements, allowedAutoPlacements = _options$allowedAutoP === void 0 ? placements : _options$allowedAutoP;
        var variation = getVariation(placement);
        var placements$1 = variation ? flipVariations ? variationPlacements : variationPlacements.filter(function(placement2) {
          return getVariation(placement2) === variation;
        }) : basePlacements;
        var allowedPlacements = placements$1.filter(function(placement2) {
          return allowedAutoPlacements.indexOf(placement2) >= 0;
        });
        if (allowedPlacements.length === 0) {
          allowedPlacements = placements$1;
        }
        var overflows = allowedPlacements.reduce(function(acc, placement2) {
          acc[placement2] = detectOverflow(state, {
            placement: placement2,
            boundary,
            rootBoundary,
            padding
          })[getBasePlacement(placement2)];
          return acc;
        }, {});
        return Object.keys(overflows).sort(function(a, b) {
          return overflows[a] - overflows[b];
        });
      }
      function getExpandedFallbackPlacements(placement) {
        if (getBasePlacement(placement) === auto) {
          return [];
        }
        var oppositePlacement = getOppositePlacement(placement);
        return [getOppositeVariationPlacement(placement), oppositePlacement, getOppositeVariationPlacement(oppositePlacement)];
      }
      function flip(_ref) {
        var state = _ref.state, options = _ref.options, name = _ref.name;
        if (state.modifiersData[name]._skip) {
          return;
        }
        var _options$mainAxis = options.mainAxis, checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis, _options$altAxis = options.altAxis, checkAltAxis = _options$altAxis === void 0 ? true : _options$altAxis, specifiedFallbackPlacements = options.fallbackPlacements, padding = options.padding, boundary = options.boundary, rootBoundary = options.rootBoundary, altBoundary = options.altBoundary, _options$flipVariatio = options.flipVariations, flipVariations = _options$flipVariatio === void 0 ? true : _options$flipVariatio, allowedAutoPlacements = options.allowedAutoPlacements;
        var preferredPlacement = state.options.placement;
        var basePlacement = getBasePlacement(preferredPlacement);
        var isBasePlacement = basePlacement === preferredPlacement;
        var fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipVariations ? [getOppositePlacement(preferredPlacement)] : getExpandedFallbackPlacements(preferredPlacement));
        var placements2 = [preferredPlacement].concat(fallbackPlacements).reduce(function(acc, placement2) {
          return acc.concat(getBasePlacement(placement2) === auto ? computeAutoPlacement(state, {
            placement: placement2,
            boundary,
            rootBoundary,
            padding,
            flipVariations,
            allowedAutoPlacements
          }) : placement2);
        }, []);
        var referenceRect = state.rects.reference;
        var popperRect = state.rects.popper;
        var checksMap = new Map();
        var makeFallbackChecks = true;
        var firstFittingPlacement = placements2[0];
        for (var i2 = 0; i2 < placements2.length; i2++) {
          var placement = placements2[i2];
          var _basePlacement = getBasePlacement(placement);
          var isStartVariation = getVariation(placement) === start;
          var isVertical = [top, bottom].indexOf(_basePlacement) >= 0;
          var len = isVertical ? "width" : "height";
          var overflow = detectOverflow(state, {
            placement,
            boundary,
            rootBoundary,
            altBoundary,
            padding
          });
          var mainVariationSide = isVertical ? isStartVariation ? right : left : isStartVariation ? bottom : top;
          if (referenceRect[len] > popperRect[len]) {
            mainVariationSide = getOppositePlacement(mainVariationSide);
          }
          var altVariationSide = getOppositePlacement(mainVariationSide);
          var checks = [];
          if (checkMainAxis) {
            checks.push(overflow[_basePlacement] <= 0);
          }
          if (checkAltAxis) {
            checks.push(overflow[mainVariationSide] <= 0, overflow[altVariationSide] <= 0);
          }
          if (checks.every(function(check2) {
            return check2;
          })) {
            firstFittingPlacement = placement;
            makeFallbackChecks = false;
            break;
          }
          checksMap.set(placement, checks);
        }
        if (makeFallbackChecks) {
          var numberOfChecks = flipVariations ? 3 : 1;
          var _loop = function _loop2(_i2) {
            var fittingPlacement = placements2.find(function(placement2) {
              var checks2 = checksMap.get(placement2);
              if (checks2) {
                return checks2.slice(0, _i2).every(function(check2) {
                  return check2;
                });
              }
            });
            if (fittingPlacement) {
              firstFittingPlacement = fittingPlacement;
              return "break";
            }
          };
          for (var _i = numberOfChecks; _i > 0; _i--) {
            var _ret = _loop(_i);
            if (_ret === "break") break;
          }
        }
        if (state.placement !== firstFittingPlacement) {
          state.modifiersData[name]._skip = true;
          state.placement = firstFittingPlacement;
          state.reset = true;
        }
      }
      const flip$1 = {
        name: "flip",
        enabled: true,
        phase: "main",
        fn: flip,
        requiresIfExists: ["offset"],
        data: {
          _skip: false
        }
      };
      function getSideOffsets(overflow, rect, preventedOffsets) {
        if (preventedOffsets === void 0) {
          preventedOffsets = {
            x: 0,
            y: 0
          };
        }
        return {
          top: overflow.top - rect.height - preventedOffsets.y,
          right: overflow.right - rect.width + preventedOffsets.x,
          bottom: overflow.bottom - rect.height + preventedOffsets.y,
          left: overflow.left - rect.width - preventedOffsets.x
        };
      }
      function isAnySideFullyClipped(overflow) {
        return [top, right, bottom, left].some(function(side) {
          return overflow[side] >= 0;
        });
      }
      function hide(_ref) {
        var state = _ref.state, name = _ref.name;
        var referenceRect = state.rects.reference;
        var popperRect = state.rects.popper;
        var preventedOffsets = state.modifiersData.preventOverflow;
        var referenceOverflow = detectOverflow(state, {
          elementContext: "reference"
        });
        var popperAltOverflow = detectOverflow(state, {
          altBoundary: true
        });
        var referenceClippingOffsets = getSideOffsets(referenceOverflow, referenceRect);
        var popperEscapeOffsets = getSideOffsets(popperAltOverflow, popperRect, preventedOffsets);
        var isReferenceHidden = isAnySideFullyClipped(referenceClippingOffsets);
        var hasPopperEscaped = isAnySideFullyClipped(popperEscapeOffsets);
        state.modifiersData[name] = {
          referenceClippingOffsets,
          popperEscapeOffsets,
          isReferenceHidden,
          hasPopperEscaped
        };
        state.attributes.popper = Object.assign({}, state.attributes.popper, {
          "data-popper-reference-hidden": isReferenceHidden,
          "data-popper-escaped": hasPopperEscaped
        });
      }
      const hide$1 = {
        name: "hide",
        enabled: true,
        phase: "main",
        requiresIfExists: ["preventOverflow"],
        fn: hide
      };
      function distanceAndSkiddingToXY(placement, rects, offset2) {
        var basePlacement = getBasePlacement(placement);
        var invertDistance = [left, top].indexOf(basePlacement) >= 0 ? -1 : 1;
        var _ref = typeof offset2 === "function" ? offset2(Object.assign({}, rects, {
          placement
        })) : offset2, skidding = _ref[0], distance = _ref[1];
        skidding = skidding || 0;
        distance = (distance || 0) * invertDistance;
        return [left, right].indexOf(basePlacement) >= 0 ? {
          x: distance,
          y: skidding
        } : {
          x: skidding,
          y: distance
        };
      }
      function offset(_ref2) {
        var state = _ref2.state, options = _ref2.options, name = _ref2.name;
        var _options$offset = options.offset, offset2 = _options$offset === void 0 ? [0, 0] : _options$offset;
        var data = placements.reduce(function(acc, placement) {
          acc[placement] = distanceAndSkiddingToXY(placement, state.rects, offset2);
          return acc;
        }, {});
        var _data$state$placement = data[state.placement], x = _data$state$placement.x, y = _data$state$placement.y;
        if (state.modifiersData.popperOffsets != null) {
          state.modifiersData.popperOffsets.x += x;
          state.modifiersData.popperOffsets.y += y;
        }
        state.modifiersData[name] = data;
      }
      const offset$1 = {
        name: "offset",
        enabled: true,
        phase: "main",
        requires: ["popperOffsets"],
        fn: offset
      };
      function popperOffsets(_ref) {
        var state = _ref.state, name = _ref.name;
        state.modifiersData[name] = computeOffsets({
          reference: state.rects.reference,
          element: state.rects.popper,
          placement: state.placement
        });
      }
      const popperOffsets$1 = {
        name: "popperOffsets",
        enabled: true,
        phase: "read",
        fn: popperOffsets,
        data: {}
      };
      function getAltAxis(axis) {
        return axis === "x" ? "y" : "x";
      }
      function preventOverflow(_ref) {
        var state = _ref.state, options = _ref.options, name = _ref.name;
        var _options$mainAxis = options.mainAxis, checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis, _options$altAxis = options.altAxis, checkAltAxis = _options$altAxis === void 0 ? false : _options$altAxis, boundary = options.boundary, rootBoundary = options.rootBoundary, altBoundary = options.altBoundary, padding = options.padding, _options$tether = options.tether, tether = _options$tether === void 0 ? true : _options$tether, _options$tetherOffset = options.tetherOffset, tetherOffset = _options$tetherOffset === void 0 ? 0 : _options$tetherOffset;
        var overflow = detectOverflow(state, {
          boundary,
          rootBoundary,
          padding,
          altBoundary
        });
        var basePlacement = getBasePlacement(state.placement);
        var variation = getVariation(state.placement);
        var isBasePlacement = !variation;
        var mainAxis = getMainAxisFromPlacement(basePlacement);
        var altAxis = getAltAxis(mainAxis);
        var popperOffsets2 = state.modifiersData.popperOffsets;
        var referenceRect = state.rects.reference;
        var popperRect = state.rects.popper;
        var tetherOffsetValue = typeof tetherOffset === "function" ? tetherOffset(Object.assign({}, state.rects, {
          placement: state.placement
        })) : tetherOffset;
        var normalizedTetherOffsetValue = typeof tetherOffsetValue === "number" ? {
          mainAxis: tetherOffsetValue,
          altAxis: tetherOffsetValue
        } : Object.assign({
          mainAxis: 0,
          altAxis: 0
        }, tetherOffsetValue);
        var offsetModifierState = state.modifiersData.offset ? state.modifiersData.offset[state.placement] : null;
        var data = {
          x: 0,
          y: 0
        };
        if (!popperOffsets2) {
          return;
        }
        if (checkMainAxis) {
          var _offsetModifierState$;
          var mainSide = mainAxis === "y" ? top : left;
          var altSide = mainAxis === "y" ? bottom : right;
          var len = mainAxis === "y" ? "height" : "width";
          var offset2 = popperOffsets2[mainAxis];
          var min$12 = offset2 + overflow[mainSide];
          var max$12 = offset2 - overflow[altSide];
          var additive = tether ? -popperRect[len] / 2 : 0;
          var minLen = variation === start ? referenceRect[len] : popperRect[len];
          var maxLen = variation === start ? -popperRect[len] : -referenceRect[len];
          var arrowElement = state.elements.arrow;
          var arrowRect = tether && arrowElement ? getLayoutRect(arrowElement) : {
            width: 0,
            height: 0
          };
          var arrowPaddingObject = state.modifiersData["arrow#persistent"] ? state.modifiersData["arrow#persistent"].padding : getFreshSideObject();
          var arrowPaddingMin = arrowPaddingObject[mainSide];
          var arrowPaddingMax = arrowPaddingObject[altSide];
          var arrowLen = within(0, referenceRect[len], arrowRect[len]);
          var minOffset = isBasePlacement ? referenceRect[len] / 2 - additive - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis : minLen - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis;
          var maxOffset = isBasePlacement ? -referenceRect[len] / 2 + additive + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis : maxLen + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis;
          var arrowOffsetParent = state.elements.arrow && getOffsetParent(state.elements.arrow);
          var clientOffset = arrowOffsetParent ? mainAxis === "y" ? arrowOffsetParent.clientTop || 0 : arrowOffsetParent.clientLeft || 0 : 0;
          var offsetModifierValue = (_offsetModifierState$ = offsetModifierState == null ? void 0 : offsetModifierState[mainAxis]) != null ? _offsetModifierState$ : 0;
          var tetherMin = offset2 + minOffset - offsetModifierValue - clientOffset;
          var tetherMax = offset2 + maxOffset - offsetModifierValue;
          var preventedOffset = within(tether ? min(min$12, tetherMin) : min$12, offset2, tether ? max(max$12, tetherMax) : max$12);
          popperOffsets2[mainAxis] = preventedOffset;
          data[mainAxis] = preventedOffset - offset2;
        }
        if (checkAltAxis) {
          var _offsetModifierState$2;
          var _mainSide = mainAxis === "x" ? top : left;
          var _altSide = mainAxis === "x" ? bottom : right;
          var _offset = popperOffsets2[altAxis];
          var _len = altAxis === "y" ? "height" : "width";
          var _min = _offset + overflow[_mainSide];
          var _max = _offset - overflow[_altSide];
          var isOriginSide = [top, left].indexOf(basePlacement) !== -1;
          var _offsetModifierValue = (_offsetModifierState$2 = offsetModifierState == null ? void 0 : offsetModifierState[altAxis]) != null ? _offsetModifierState$2 : 0;
          var _tetherMin = isOriginSide ? _min : _offset - referenceRect[_len] - popperRect[_len] - _offsetModifierValue + normalizedTetherOffsetValue.altAxis;
          var _tetherMax = isOriginSide ? _offset + referenceRect[_len] + popperRect[_len] - _offsetModifierValue - normalizedTetherOffsetValue.altAxis : _max;
          var _preventedOffset = tether && isOriginSide ? withinMaxClamp(_tetherMin, _offset, _tetherMax) : within(tether ? _tetherMin : _min, _offset, tether ? _tetherMax : _max);
          popperOffsets2[altAxis] = _preventedOffset;
          data[altAxis] = _preventedOffset - _offset;
        }
        state.modifiersData[name] = data;
      }
      const preventOverflow$1 = {
        name: "preventOverflow",
        enabled: true,
        phase: "main",
        fn: preventOverflow,
        requiresIfExists: ["offset"]
      };
      function getHTMLElementScroll(element2) {
        return {
          scrollLeft: element2.scrollLeft,
          scrollTop: element2.scrollTop
        };
      }
      function getNodeScroll(node) {
        if (node === getWindow(node) || !isHTMLElement(node)) {
          return getWindowScroll(node);
        } else {
          return getHTMLElementScroll(node);
        }
      }
      function isElementScaled(element2) {
        var rect = element2.getBoundingClientRect();
        var scaleX = round(rect.width) / element2.offsetWidth || 1;
        var scaleY = round(rect.height) / element2.offsetHeight || 1;
        return scaleX !== 1 || scaleY !== 1;
      }
      function getCompositeRect(elementOrVirtualElement, offsetParent, isFixed) {
        if (isFixed === void 0) {
          isFixed = false;
        }
        var isOffsetParentAnElement = isHTMLElement(offsetParent);
        var offsetParentIsScaled = isHTMLElement(offsetParent) && isElementScaled(offsetParent);
        var documentElement = getDocumentElement(offsetParent);
        var rect = getBoundingClientRect(elementOrVirtualElement, offsetParentIsScaled, isFixed);
        var scroll = {
          scrollLeft: 0,
          scrollTop: 0
        };
        var offsets = {
          x: 0,
          y: 0
        };
        if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
          if (getNodeName(offsetParent) !== "body" ||
isScrollParent(documentElement)) {
            scroll = getNodeScroll(offsetParent);
          }
          if (isHTMLElement(offsetParent)) {
            offsets = getBoundingClientRect(offsetParent, true);
            offsets.x += offsetParent.clientLeft;
            offsets.y += offsetParent.clientTop;
          } else if (documentElement) {
            offsets.x = getWindowScrollBarX(documentElement);
          }
        }
        return {
          x: rect.left + scroll.scrollLeft - offsets.x,
          y: rect.top + scroll.scrollTop - offsets.y,
          width: rect.width,
          height: rect.height
        };
      }
      function order(modifiers) {
        var map = new Map();
        var visited = new Set();
        var result = [];
        modifiers.forEach(function(modifier) {
          map.set(modifier.name, modifier);
        });
        function sort(modifier) {
          visited.add(modifier.name);
          var requires = [].concat(modifier.requires || [], modifier.requiresIfExists || []);
          requires.forEach(function(dep) {
            if (!visited.has(dep)) {
              var depModifier = map.get(dep);
              if (depModifier) {
                sort(depModifier);
              }
            }
          });
          result.push(modifier);
        }
        modifiers.forEach(function(modifier) {
          if (!visited.has(modifier.name)) {
            sort(modifier);
          }
        });
        return result;
      }
      function orderModifiers(modifiers) {
        var orderedModifiers = order(modifiers);
        return modifierPhases.reduce(function(acc, phase) {
          return acc.concat(orderedModifiers.filter(function(modifier) {
            return modifier.phase === phase;
          }));
        }, []);
      }
      function debounce(fn) {
        var pending;
        return function() {
          if (!pending) {
            pending = new Promise(function(resolve) {
              Promise.resolve().then(function() {
                pending = void 0;
                resolve(fn());
              });
            });
          }
          return pending;
        };
      }
      function mergeByName(modifiers) {
        var merged = modifiers.reduce(function(merged2, current) {
          var existing = merged2[current.name];
          merged2[current.name] = existing ? Object.assign({}, existing, current, {
            options: Object.assign({}, existing.options, current.options),
            data: Object.assign({}, existing.data, current.data)
          }) : current;
          return merged2;
        }, {});
        return Object.keys(merged).map(function(key2) {
          return merged[key2];
        });
      }
      var DEFAULT_OPTIONS = {
        placement: "bottom",
        modifiers: [],
        strategy: "absolute"
      };
      function areValidElements() {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }
        return !args.some(function(element2) {
          return !(element2 && typeof element2.getBoundingClientRect === "function");
        });
      }
      function popperGenerator(generatorOptions) {
        if (generatorOptions === void 0) {
          generatorOptions = {};
        }
        var _generatorOptions = generatorOptions, _generatorOptions$def = _generatorOptions.defaultModifiers, defaultModifiers2 = _generatorOptions$def === void 0 ? [] : _generatorOptions$def, _generatorOptions$def2 = _generatorOptions.defaultOptions, defaultOptions = _generatorOptions$def2 === void 0 ? DEFAULT_OPTIONS : _generatorOptions$def2;
        return function createPopper2(reference2, popper2, options) {
          if (options === void 0) {
            options = defaultOptions;
          }
          var state = {
            placement: "bottom",
            orderedModifiers: [],
            options: Object.assign({}, DEFAULT_OPTIONS, defaultOptions),
            modifiersData: {},
            elements: {
              reference: reference2,
              popper: popper2
            },
            attributes: {},
            styles: {}
          };
          var effectCleanupFns = [];
          var isDestroyed = false;
          var instance = {
            state,
            setOptions: function setOptions(setOptionsAction) {
              var options2 = typeof setOptionsAction === "function" ? setOptionsAction(state.options) : setOptionsAction;
              cleanupModifierEffects();
              state.options = Object.assign({}, defaultOptions, state.options, options2);
              state.scrollParents = {
                reference: isElement(reference2) ? listScrollParents(reference2) : reference2.contextElement ? listScrollParents(reference2.contextElement) : [],
                popper: listScrollParents(popper2)
              };
              var orderedModifiers = orderModifiers(mergeByName([].concat(defaultModifiers2, state.options.modifiers)));
              state.orderedModifiers = orderedModifiers.filter(function(m) {
                return m.enabled;
              });
              runModifierEffects();
              return instance.update();
            },




forceUpdate: function forceUpdate() {
              if (isDestroyed) {
                return;
              }
              var _state$elements = state.elements, reference3 = _state$elements.reference, popper3 = _state$elements.popper;
              if (!areValidElements(reference3, popper3)) {
                return;
              }
              state.rects = {
                reference: getCompositeRect(reference3, getOffsetParent(popper3), state.options.strategy === "fixed"),
                popper: getLayoutRect(popper3)
              };
              state.reset = false;
              state.placement = state.options.placement;
              state.orderedModifiers.forEach(function(modifier) {
                return state.modifiersData[modifier.name] = Object.assign({}, modifier.data);
              });
              for (var index = 0; index < state.orderedModifiers.length; index++) {
                if (state.reset === true) {
                  state.reset = false;
                  index = -1;
                  continue;
                }
                var _state$orderedModifie = state.orderedModifiers[index], fn = _state$orderedModifie.fn, _state$orderedModifie2 = _state$orderedModifie.options, _options = _state$orderedModifie2 === void 0 ? {} : _state$orderedModifie2, name = _state$orderedModifie.name;
                if (typeof fn === "function") {
                  state = fn({
                    state,
                    options: _options,
                    name,
                    instance
                  }) || state;
                }
              }
            },

update: debounce(function() {
              return new Promise(function(resolve) {
                instance.forceUpdate();
                resolve(state);
              });
            }),
            destroy: function destroy() {
              cleanupModifierEffects();
              isDestroyed = true;
            }
          };
          if (!areValidElements(reference2, popper2)) {
            return instance;
          }
          instance.setOptions(options).then(function(state2) {
            if (!isDestroyed && options.onFirstUpdate) {
              options.onFirstUpdate(state2);
            }
          });
          function runModifierEffects() {
            state.orderedModifiers.forEach(function(_ref) {
              var name = _ref.name, _ref$options = _ref.options, options2 = _ref$options === void 0 ? {} : _ref$options, effect2 = _ref.effect;
              if (typeof effect2 === "function") {
                var cleanupFn = effect2({
                  state,
                  name,
                  instance,
                  options: options2
                });
                var noopFn = function noopFn2() {
                };
                effectCleanupFns.push(cleanupFn || noopFn);
              }
            });
          }
          function cleanupModifierEffects() {
            effectCleanupFns.forEach(function(fn) {
              return fn();
            });
            effectCleanupFns = [];
          }
          return instance;
        };
      }
      var defaultModifiers = [eventListeners, popperOffsets$1, computeStyles$1, applyStyles$1, offset$1, flip$1, preventOverflow$1, arrow$1, hide$1];
      var createPopper = popperGenerator({
        defaultModifiers
      });
      /**
       * tdesign v1.17.1
       * (c) 2025 tdesign
       * @license MIT
       */
      var popupProps = {
        attach: {
          type: [String, Function],
          "default": "body"
        },
        content: {
          type: [String, Function]
        },
        "default": {
          type: [String, Function]
        },
        delay: {
          type: [Number, Array]
        },
        destroyOnClose: Boolean,
        disabled: Boolean,
        hideEmptyPopup: Boolean,
        overlayClassName: {
          type: [String, Object, Array]
        },
        overlayInnerClassName: {
          type: [String, Object, Array]
        },
        overlayInnerStyle: {
          type: [Boolean, Object, Function]
        },
        overlayStyle: {
          type: [Boolean, Object, Function]
        },
        placement: {
          type: String,
          "default": "top"
        },
        popperOptions: {
          type: Object
        },
        showArrow: Boolean,
        trigger: {
          type: String,
          "default": "hover",
          validator: function validator(val) {
            if (!val) return true;
            return ["hover", "click", "focus", "mousedown", "context-menu"].includes(val);
          }
        },
        triggerElement: {
          type: [String, Function]
        },
        visible: {
          type: Boolean,
          "default": void 0
        },
        modelValue: {
          type: Boolean,
          "default": void 0
        },
        defaultVisible: Boolean,
        zIndex: {
          type: Number
        },
        onOverlayClick: Function,
        onScroll: Function,
        onScrollToBottom: Function,
        onVisibleChange: Function
      };
      /**
       * tdesign v1.17.1
       * (c) 2025 tdesign
       * @license MIT
       */
      function _isSlot$5(s) {
        return typeof s === "function" || Object.prototype.toString.call(s) === "[object Object]" && !vue.isVNode(s);
      }
      function filterEmpty() {
        var children = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [];
        var vnodes = [];
        children.forEach(function(child) {
          if (isArray(child)) {
            vnodes.push.apply(vnodes, _toConsumableArray(child));
          } else if (child.type === vue.Fragment) {
            vnodes.push.apply(vnodes, _toConsumableArray(filterEmpty(child.children)));
          } else {
            vnodes.push(child);
          }
        });
        return vnodes.filter(function(c) {
          return !(c && (c.type === vue.Comment || c.type === vue.Fragment && c.children.length === 0 || c.type === vue.Text && c.children.trim() === ""));
        });
      }
      function isRectChanged(rect1, rect2) {
        if (!rect1 && !rect2) return false;
        if (!rect1 || !rect2) return true;
        if (["width", "height", "x", "y"].some(function(k) {
          return rect1[k] !== rect2[k];
        })) {
          return true;
        }
        return false;
      }
      function useElement(getter) {
        var instance = vue.getCurrentInstance();
        var el = vue.ref();
        vue.onMounted(function() {
          el.value = getter(instance);
        });
        vue.onUpdated(function() {
          var newEl = getter(instance);
          if (el.value !== newEl) {
            el.value = newEl;
          }
        });
        return el;
      }
      var Trigger = vue.defineComponent({
        name: "TPopupTrigger",
        props: {
          forwardRef: Function
        },
        emits: ["resize"],
        setup: function setup(props2, _ref) {
          var emit = _ref.emit, slots = _ref.slots;
          var el = useElement(function(vm) {
            var containerNode = vm.parent.vnode;
            return containerNode.el.nextElementSibling;
          });
          var contentRect = vue.ref();
          vue.watch(el, function() {
            var _props2$forwardRef;
            (_props2$forwardRef = props2.forwardRef) === null || _props2$forwardRef === void 0 || _props2$forwardRef.call(props2, el.value);
          });
          useResizeObserver(el, function(_ref2) {
            var _ref3 = _slicedToArray(_ref2, 1), newContentRect = _ref3[0].contentRect;
            contentRect.value = newContentRect;
          });
          vue.watch(contentRect, function(newRect, oldRect) {
            if (isRectChanged(newRect, oldRect)) {
              emit("resize");
            }
          });
          return function() {
            var _slots$default, _children$;
            var children = filterEmpty((_slots$default = slots["default"]) === null || _slots$default === void 0 ? void 0 : _slots$default.call(slots));
            if (children.length > 1 || ((_children$ = children[0]) === null || _children$ === void 0 ? void 0 : _children$.type) === vue.Text) {
              return vue.createVNode("span", null, [children]);
            }
            return children[0];
          };
        }
      });
      var Content = vue.defineComponent({
        name: "TPopupContent",
        emits: ["resize"],
        setup: function setup(props2, _ref4) {
          var emit = _ref4.emit, slots = _ref4.slots;
          var contentEl = useElement(function(vm) {
            return vm.vnode.el.children[0];
          });
          useResizeObserver(contentEl, function() {
            emit("resize");
          });
          return function() {
            return vue.createVNode("div", {
              "style": "position: absolute; top: 0px; left: 0px; width: 100%"
            }, [slots["default"]()]);
          };
        }
      });
      var Container = vue.defineComponent({
        name: "TPopupContainer",
        inheritAttrs: false,
        props: {
          parent: Object,
          visible: Boolean,
          attach: popupProps.attach,
          forwardRef: Function
        },
        emits: ["resize", "contentMounted"],
        setup: function setup(props2, _ref5) {
          var emit = _ref5.emit, attrs = _ref5.attrs, slots = _ref5.slots, expose = _ref5.expose;
          var triggerEl = vue.ref();
          var mountContent = vue.ref(false);
          function emitResize() {
            emit("resize");
          }
          vue.onMounted(function() {
            requestAnimationFrame(function() {
              mountContent.value = props2.visible;
            });
          });
          vue.watch(function() {
            return props2.visible;
          }, function(visible) {
            if (visible) {
              mountContent.value = props2.visible;
            }
          });
          expose({
            unmountContent: function unmountContent() {
              mountContent.value = false;
            }
          });
          return function() {
            var _slot;
            var getElement = function getElement2() {
              return getAttach(props2.attach, triggerEl.value);
            };
            return vue.createVNode(vue.Fragment, null, [vue.createVNode(Trigger, {
              "class": attrs["class"],
              "forwardRef": function forwardRef(el) {
                props2.forwardRef(el);
                triggerEl.value = el;
              },
              "onResize": emitResize
            }, _isSlot$5(_slot = slots["default"]()) ? _slot : {
              "default": function _default() {
                return [_slot];
              }
            }), mountContent.value && vue.createVNode(vue.Teleport, {
              "disabled": !getElement(),
              "to": getElement()
            }, {
              "default": function _default() {
                return [vue.createVNode(Content, {
                  "onResize": emitResize,
                  "onVnodeMounted": function onVnodeMounted() {
                    return emit("contentMounted");
                  }
                }, {
                  "default": function _default2() {
                    return [slots.content && slots.content()];
                  }
                })];
              }
            })]);
          };
        }
      });
      var define_process_env_default = {};
      function ownKeys$b(e, r) {
        var t2 = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
          var o = Object.getOwnPropertySymbols(e);
          r && (o = o.filter(function(r2) {
            return Object.getOwnPropertyDescriptor(e, r2).enumerable;
          })), t2.push.apply(t2, o);
        }
        return t2;
      }
      function _objectSpread$b(e) {
        for (var r = 1; r < arguments.length; r++) {
          var t2 = null != arguments[r] ? arguments[r] : {};
          r % 2 ? ownKeys$b(Object(t2), true).forEach(function(r2) {
            _defineProperty$1(e, r2, t2[r2]);
          }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t2)) : ownKeys$b(Object(t2)).forEach(function(r2) {
            Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t2, r2));
          });
        }
        return e;
      }
      function _isSlot$4(s) {
        return typeof s === "function" || Object.prototype.toString.call(s) === "[object Object]" && !vue.isVNode(s);
      }
      var POPUP_ATTR_NAME = "data-td-popup";
      var POPUP_PARENT_ATTR_NAME = "data-td-popup-parent";
      function getPopperTree(id2, upwards) {
        var list = [];
        var selectors = [POPUP_PARENT_ATTR_NAME, POPUP_ATTR_NAME];
        if (!id2) return list;
        if (upwards) {
          selectors.unshift(selectors.pop());
        }
        recurse(id2);
        return list;
        function recurse(id22) {
          var children = document.querySelectorAll("[".concat(selectors[0], '="').concat(id22, '"]'));
          children.forEach(function(el) {
            list.push(el);
            var childId = el.getAttribute(selectors[1]);
            if (childId && childId !== id22) {
              recurse(childId);
            }
          });
        }
      }
      var parentKey = Symbol();
      function getPopperPlacement(placement) {
        return placement.replace(/-(left|top)$/, "-start").replace(/-(right|bottom)$/, "-end");
      }
      function attachListeners(elm) {
        var offs = [];
        return {
          add: function add(type, listener) {
            if (!type) return;
            on(elm.value, type, listener);
            offs.push(function() {
              off(elm.value, type, listener);
            });
          },
          clean: function clean() {
            offs.forEach(function(handler) {
              return handler === null || handler === void 0 ? void 0 : handler();
            });
            offs.length = 0;
          }
        };
      }
      var _Popup = vue.defineComponent({
        name: "TPopup",
        props: _objectSpread$b(_objectSpread$b({}, popupProps), {}, {
          expandAnimation: {
            type: Boolean
          }
        }),
        setup: function setup(props2, _ref) {
          var _process$env;
          var expose = _ref.expose;
          var _toRefs = vue.toRefs(props2), propVisible = _toRefs.visible, modelValue = _toRefs.modelValue;
          var _useVModel = useVModel(propVisible, modelValue, props2.defaultVisible, props2.onVisibleChange, "visible"), _useVModel2 = _slicedToArray(_useVModel, 2), visible = _useVModel2[0], setVisible = _useVModel2[1];
          var renderTNodeJSX = useTNodeJSX();
          var renderContent = useContent();
          var popper2;
          var showTimeout;
          var hideTimeout;
          var triggerEl = vue.ref(null);
          var overlayEl = vue.ref(null);
          var popperEl = vue.ref(null);
          var containerRef = vue.ref(null);
          var isOverlayHover = vue.ref(false);
          var arrowStyle = vue.ref({});
          var id2 = typeof process !== "undefined" && (_process$env = define_process_env_default) !== null && _process$env !== void 0 && _process$env.TEST ? "" : Date.now().toString(36);
          var parent2 = vue.inject(parentKey, void 0);
          vue.provide(parentKey, {
            id: id2,
            assertMouseLeave: onMouseLeave
          });
          var prefixCls = usePrefixClass("popup");
          var _useCommonClassName = useCommonClassName$1(), commonCls = _useCommonClassName.STATUS;
          var delay = vue.computed(function() {
            var _props2$delay, _delay2$;
            var delay2 = props2.trigger !== "hover" ? [0, 0] : [].concat((_props2$delay = props2.delay) !== null && _props2$delay !== void 0 ? _props2$delay : [250, 150]);
            return {
              show: delay2[0],
              hide: (_delay2$ = delay2[1]) !== null && _delay2$ !== void 0 ? _delay2$ : delay2[0]
            };
          });
          var trigger = attachListeners(triggerEl);
          vue.watch(function() {
            return [props2.trigger, triggerEl.value];
          }, function() {
            if (!triggerEl.value) return;
            trigger.clean();
            trigger.add({
              hover: "mouseenter",
              focus: "focusin",
              "context-menu": "contextmenu",
              click: "click"
            }[props2.trigger], function(ev) {
              if (props2.disabled) return;
              if (ev.type === "contextmenu") {
                ev.preventDefault();
              }
              if ((ev.type === "click" || ev.type === "contextmenu") && visible.value) {
                hide2(ev);
                return;
              }
              show(ev);
            });
            trigger.add({
              hover: "mouseleave",
              focus: "focusout"
            }[props2.trigger], hide2);
          });
          vue.watch(function() {
            return [props2.overlayStyle, props2.overlayInnerStyle, overlayEl.value];
          }, function() {
            updateOverlayInnerStyle();
            updatePopper();
          }, {
            immediate: true
          });
          vue.watch(function() {
            return props2.triggerElement;
          }, function(v) {
            if (typeof v === "string") {
              vue.nextTick(function() {
                triggerEl.value = document.querySelector(v);
              });
            }
          }, {
            immediate: true
          });
          vue.watch(function() {
            return props2.placement;
          }, function() {
            destroyPopper();
            updatePopper();
          });
          vue.watch(function() {
            return visible.value;
          }, function(visible2) {
            if (visible2) {
              on(document, "mousedown", onDocumentMouseDown, true);
              if (props2.trigger === "focus") {
                once(triggerEl.value, "keydown", function(ev) {
                  var _process$env2;
                  var code = typeof process !== "undefined" && (_process$env2 = define_process_env_default) !== null && _process$env2 !== void 0 && _process$env2.TEST ? "27" : "Escape";
                  if (ev.code === code) {
                    hide2(ev);
                  }
                });
              }
              return;
            }
            off(document, "mousedown", onDocumentMouseDown, true);
          }, {
            immediate: true
          });
          vue.watch(function() {
            return [visible.value, overlayEl.value];
          }, function() {
            if (visible.value && overlayEl.value && updateScrollTop) {
              updateScrollTop === null || updateScrollTop === void 0 || updateScrollTop(overlayEl.value);
            }
          });
          vue.onUnmounted(function() {
            destroyPopper();
            clearAllTimeout();
            off(document, "mousedown", onDocumentMouseDown, true);
          });
          expose({
            update: updatePopper,
            getOverlay: function getOverlay() {
              return overlayEl.value;
            },
            getOverlayState: function getOverlayState() {
              return {
                hover: isOverlayHover.value
              };
            },
            close: function close2() {
              return hide2();
            }
          });
          function getOverlayStyle() {
            var overlayStyle = props2.overlayStyle;
            if (!triggerEl.value || !overlayEl.value) return;
            if (isFunction(overlayStyle)) {
              return overlayStyle(triggerEl.value, overlayEl.value);
            }
            if (isObject(overlayStyle)) {
              return overlayStyle;
            }
          }
          function updateOverlayInnerStyle() {
            var overlayInnerStyle = props2.overlayInnerStyle;
            if (!triggerEl.value || !overlayEl.value) return;
            if (isFunction(overlayInnerStyle)) {
              setStyle(overlayEl.value, overlayInnerStyle(triggerEl.value, overlayEl.value));
            } else if (isObject(overlayInnerStyle)) {
              setStyle(overlayEl.value, overlayInnerStyle);
            }
          }
          function getArrowStyle() {
            var _popperEl$value$offse2;
            if (!triggerEl.value || !popperEl.value) {
              return {};
            }
            var triggerRect = triggerEl.value.getBoundingClientRect();
            var popupRect = popperEl.value.getBoundingClientRect();
            var position = props2.placement;
            if (position.startsWith("top") || position.startsWith("bottom")) {
              var _popperEl$value$offse;
              var offsetLeft = Math.abs(triggerRect.left + triggerRect.width / 2 - popupRect.left);
              var popupWidth = (_popperEl$value$offse = popperEl.value.offsetWidth) !== null && _popperEl$value$offse !== void 0 ? _popperEl$value$offse : popperEl.value.offsetWidth;
              var maxPopupOffsetLeft = popupWidth - 4;
              var minPopupOffsetLeft = 12;
              if (inRange(offsetLeft, 0, popupWidth)) {
                return {
                  left: "".concat(max$1([minPopupOffsetLeft, min$1([maxPopupOffsetLeft, offsetLeft])]) - 4, "px"),
                  marginLeft: 0
                };
              } else {
                return {};
              }
            }
            var offsetTop = triggerRect.top + triggerRect.height / 2 - popupRect.top;
            var popupHeight = (_popperEl$value$offse2 = popperEl.value.offsetHeight) !== null && _popperEl$value$offse2 !== void 0 ? _popperEl$value$offse2 : popperEl.value.clientHeight;
            var maxPopupOffsetTop = popupHeight - 8;
            var minPopupOffsetTop = 8;
            if (inRange(offsetTop, 0, popupHeight)) {
              return {
                top: "".concat(max$1([minPopupOffsetTop, min$1([maxPopupOffsetTop, offsetTop])]) - 4, "px"),
                marginTop: 0
              };
            } else {
              return {};
            }
          }
          function updatePopper() {
            if (!popperEl.value || !visible.value) return;
            if (popper2) {
              if (triggerEl.value.getRootNode() instanceof ShadowRoot) {
                popper2.state.elements.reference = triggerEl.value;
                popper2.update();
              } else {
                var rect = triggerEl.value.getBoundingClientRect();
                var parent22 = triggerEl.value;
                while (parent22 && parent22 !== document.body) {
                  parent22 = parent22.parentElement;
                }
                var isHidden = parent22 !== document.body || rect.width === 0 && rect.height === 0;
                if (!isHidden) {
                  popper2.state.elements.reference = triggerEl.value;
                  popper2.update();
                } else {
                  setVisible(false, {
                    trigger: getTriggerType({
                      type: "mouseenter"
                    })
                  });
                }
              }
              if (props2.showArrow) {
                arrowStyle.value = getArrowStyle();
              }
              return;
            }
            popper2 = createPopper(triggerEl.value, popperEl.value, _objectSpread$b({
              placement: getPopperPlacement(props2.placement),
              onFirstUpdate: function onFirstUpdate() {
                vue.nextTick(updatePopper);
              }
            }, props2.popperOptions));
            if (props2.showArrow) {
              arrowStyle.value = getArrowStyle();
            }
          }
          function destroyPopper() {
            if (popper2) {
              var _popper;
              (_popper = popper2) === null || _popper === void 0 || _popper.destroy();
              popper2 = null;
            }
            if (props2.destroyOnClose) {
              var _containerRef$value;
              (_containerRef$value = containerRef.value) === null || _containerRef$value === void 0 || _containerRef$value.unmountContent();
            }
          }
          function show(ev) {
            clearAllTimeout();
            showTimeout = setTimeout(function() {
              setVisible(true, {
                trigger: getTriggerType(ev)
              });
            }, delay.value.show);
          }
          function hide2(ev) {
            clearAllTimeout();
            hideTimeout = setTimeout(function() {
              setVisible(false, {
                trigger: getTriggerType(ev),
                e: ev
              });
            }, delay.value.hide);
          }
          function clearAllTimeout() {
            clearTimeout(showTimeout);
            clearTimeout(hideTimeout);
          }
          function getTriggerType(ev) {
            switch (ev === null || ev === void 0 ? void 0 : ev.type) {
              case "mouseenter":
                return "trigger-element-hover";
              case "mouseleave":
                return "trigger-element-hover";
              case "focusin":
                return "trigger-element-focus";
              case "focusout":
                return "trigger-element-blur";
              case "click":
                return "trigger-element-click";
              case "context-menu":
              case "keydown":
                return "keydown-esc";
              case "mousedown":
                return "document";
              default:
                return "trigger-element-close";
            }
          }
          function onDocumentMouseDown(ev) {
            var _popperEl$value, _triggerEl$value;
            if ((_popperEl$value = popperEl.value) !== null && _popperEl$value !== void 0 && _popperEl$value.contains(ev.target)) {
              return;
            }
            if ((_triggerEl$value = triggerEl.value) !== null && _triggerEl$value !== void 0 && _triggerEl$value.contains(ev.target)) {
              return;
            }
            var activedPopper = getPopperTree(id2).find(function(el) {
              return el.contains(ev.target);
            });
            if (activedPopper && getPopperTree(activedPopper.getAttribute(POPUP_PARENT_ATTR_NAME), true).some(function(el) {
              return el === popperEl.value;
            })) {
              return;
            }
            hide2(ev);
          }
          function onMouseLeave(ev) {
            isOverlayHover.value = false;
            if (props2.trigger !== "hover" || triggerEl.value.contains(ev.target)) return;
            var isCursorOverlaps = getPopperTree(id2).some(function(el) {
              var rect = el.getBoundingClientRect();
              return ev.x > rect.x && ev.x < rect.x + rect.width && ev.y > rect.y && ev.y < rect.y + rect.height;
            });
            if (!isCursorOverlaps) {
              hide2(ev);
              parent2 === null || parent2 === void 0 || parent2.assertMouseLeave(ev);
            }
          }
          function onMouseenter() {
            isOverlayHover.value = true;
            if (visible.value && props2.trigger === "hover") {
              clearAllTimeout();
            }
          }
          function onOverlayClick(e) {
            var _props2$onOverlayClic;
            (_props2$onOverlayClic = props2.onOverlayClick) === null || _props2$onOverlayClic === void 0 || _props2$onOverlayClic.call(props2, {
              e
            });
          }
          var updateScrollTop = vue.inject("updateScrollTop", void 0);
          function handleOnScroll(e) {
            var _props2$onScroll;
            var _e$target = e.target, scrollTop = _e$target.scrollTop, clientHeight = _e$target.clientHeight, scrollHeight = _e$target.scrollHeight;
            var debounceOnScrollBottom = debounce$1(function(e2) {
              var _props2$onScrollToBot;
              return (_props2$onScrollToBot = props2.onScrollToBottom) === null || _props2$onScrollToBot === void 0 ? void 0 : _props2$onScrollToBot.call(props2, {
                e: e2
              });
            }, 100);
            if (clientHeight + Math.floor(scrollTop) === scrollHeight) {
              debounceOnScrollBottom(e);
            }
            (_props2$onScroll = props2.onScroll) === null || _props2$onScroll === void 0 || _props2$onScroll.call(props2, {
              e
            });
          }
          return function() {
            var content = renderTNodeJSX("content");
            var hidePopup = props2.hideEmptyPopup && ["", void 0, null].includes(content);
            var overlay = visible.value || !props2.destroyOnClose ? vue.withDirectives(vue.createVNode("div", vue.mergeProps(_defineProperty$1(_defineProperty$1({}, POPUP_ATTR_NAME, id2), POPUP_PARENT_ATTR_NAME, parent2 === null || parent2 === void 0 ? void 0 : parent2.id), {
              "class": [prefixCls.value, props2.overlayClassName],
              "ref": function ref2(ref22) {
                return popperEl.value = ref22;
              },
              "style": [{
                zIndex: props2.zIndex
              }, getOverlayStyle(), hidePopup && {
                visibility: "hidden"
              }],
              "onClick": onOverlayClick,
              "onMouseenter": onMouseenter,
              "onMouseleave": onMouseLeave
            }), [vue.createVNode("div", {
              "class": ["".concat(prefixCls.value, "__content"), _defineProperty$1(_defineProperty$1(_defineProperty$1({}, "".concat(prefixCls.value, "__content--text"), isString(props2.content)), "".concat(prefixCls.value, "__content--arrow"), props2.showArrow), commonCls.value.disabled, props2.disabled), props2.overlayInnerClassName],
              "ref": overlayEl,
              "onScroll": handleOnScroll
            }, [content, props2.showArrow && vue.createVNode("div", {
              "class": "".concat(prefixCls.value, "__arrow"),
              "style": arrowStyle.value
            }, null)])]), [[vue.vShow, visible.value]]) : null;
            return vue.createVNode(Container, {
              "ref": function ref2(ref22) {
                return containerRef.value = ref22;
              },
              "forwardRef": function forwardRef(ref2) {
                if (typeof props2.triggerElement !== "string") triggerEl.value = ref2;
              },
              "onContentMounted": function onContentMounted() {
                if (visible.value) {
                  updatePopper();
                  var timer = setTimeout(function() {
                    updateOverlayInnerStyle();
                    clearTimeout(timer);
                  }, 60);
                }
              },
              "onResize": function onResize() {
                if (visible.value) {
                  updatePopper();
                }
              },
              "visible": visible.value,
              "attach": props2.attach
            }, {
              content: function content2() {
                return vue.createVNode(vue.Transition, {
                  "name": "".concat(prefixCls.value, "--animation").concat(props2.expandAnimation ? "-expand" : ""),
                  "appear": true,
                  "onEnter": updatePopper,
                  "onAfterLeave": destroyPopper
                }, _isSlot$4(overlay) ? overlay : {
                  "default": function _default() {
                    return [overlay];
                  }
                });
              },
              "default": function _default() {
                if (typeof props2.triggerElement === "string") return null;
                return renderContent("default", "triggerElement");
              }
            });
          };
        }
      });
      const indexCss$7 = '.content-placement-top .t-popup[data-popper-placement^=top] .t-popup__content{margin-bottom:var(--td-comp-margin-s)}.content-placement-top .t-popup[data-popper-placement^=top] .t-popup__content--arrow{margin-bottom:var(--td-comp-margin-l)}.content-placement-bottom .t-popup[data-popper-placement^=bottom] .t-popup__content{margin-top:var(--td-comp-margin-s)}.content-placement-bottom .t-popup[data-popper-placement^=bottom] .t-popup__content--arrow{margin-top:var(--td-comp-margin-l)}.content-placement-left .t-popup[data-popper-placement^=left] .t-popup__content{margin-right:var(--td-comp-margin-s)}.content-placement-left .t-popup[data-popper-placement^=left] .t-popup__content--arrow{margin-right:var(--td-comp-margin-l)}.content-placement-left .t-popup[data-popper-placement^=left] .t-popup__content--text{max-width:480px}.content-placement-right .t-popup[data-popper-placement^=right] .t-popup__content{margin-left:var(--td-comp-margin-s)}.content-placement-right .t-popup[data-popper-placement^=right] .t-popup__content--arrow{margin-left:var(--td-comp-margin-l)}.content-placement-right .t-popup[data-popper-placement^=right] .t-popup__content--text{max-width:480px}.t-popup{font:var(--td-font-body-medium);box-sizing:border-box;margin:0;padding:0;list-style:none;color:var(--td-text-color-primary);display:inline-block;z-index:5500}.t-popup__content{position:relative;background:var(--td-bg-color-container);box-shadow:var(--td-shadow-2),var(--td-shadow-inset-top),var(--td-shadow-inset-right),var(--td-shadow-inset-bottom),var(--td-shadow-inset-left);border-radius:var(--td-radius-medium);padding:var(--td-comp-paddingTB-xs) var(--td-comp-paddingLR-s);font-size:var(--td-font-size-body-medium);line-height:var(--td-line-height-body-medium);box-sizing:border-box;word-break:break-all}.t-popup__arrow{position:absolute;z-index:1;width:8px;height:8px}.t-popup__arrow:before{position:absolute;content:"";width:8px;height:8px;transform:rotate(45deg);background:var(--td-bg-color-container)}.t-popup[data-popper-placement^=top] .t-popup__content{margin-bottom:var(--td-comp-margin-s)}.t-popup[data-popper-placement^=top] .t-popup__content--arrow{margin-bottom:var(--td-comp-margin-l)}.t-popup[data-popper-placement^=bottom] .t-popup__content{margin-top:var(--td-comp-margin-s)}.t-popup[data-popper-placement^=bottom] .t-popup__content--arrow{margin-top:var(--td-comp-margin-l)}.t-popup[data-popper-placement^=left] .t-popup__content{margin-right:var(--td-comp-margin-s)}.t-popup[data-popper-placement^=left] .t-popup__content--arrow{margin-right:var(--td-comp-margin-l)}.t-popup[data-popper-placement^=left] .t-popup__content--text{max-width:480px}.t-popup[data-popper-placement^=right] .t-popup__content{margin-left:var(--td-comp-margin-s)}.t-popup[data-popper-placement^=right] .t-popup__content--arrow{margin-left:var(--td-comp-margin-l)}.t-popup[data-popper-placement^=right] .t-popup__content--text{max-width:480px}.t-popup[data-popper-placement^=top] .t-popup__arrow:before{border-top-left-radius:100%;box-shadow:var(--td-shadow-inset-left),var(--td-shadow-inset-bottom)}.t-popup[data-popper-placement=top-start] .t-popup__arrow{left:8px}.t-popup[data-popper-placement=top] .t-popup__arrow{left:50%;margin-left:-4px}.t-popup[data-popper-placement=top-end] .t-popup__arrow{left:calc(100% - 16px)}.t-popup[data-popper-placement^=bottom] .t-popup__arrow{top:-4px}.t-popup[data-popper-placement^=bottom] .t-popup__arrow:before{border-bottom-right-radius:100%;box-shadow:var(--td-shadow-inset-top),var(--td-shadow-inset-right)}.t-popup[data-popper-placement=bottom-start] .t-popup__arrow{left:8px}.t-popup[data-popper-placement=bottom] .t-popup__arrow{left:50%;margin-left:-4px}.t-popup[data-popper-placement=bottom-end] .t-popup__arrow{left:calc(100% - 16px)}.t-popup[data-popper-placement^=left] .t-popup__arrow{right:-4px}.t-popup[data-popper-placement^=left] .t-popup__arrow:before{box-shadow:var(--td-shadow-inset-left),var(--td-shadow-inset-top)}.t-popup[data-popper-placement=left-start] .t-popup__arrow{top:8px}.t-popup[data-popper-placement=left] .t-popup__arrow{top:50%;margin-top:-4px}.t-popup[data-popper-placement=left-end] .t-popup__arrow{top:calc(100% - 16px)}.t-popup[data-popper-placement^=right] .t-popup__arrow{left:-4px}.t-popup[data-popper-placement^=right] .t-popup__arrow:before{box-shadow:var(--td-shadow-inset-right),var(--td-shadow-inset-bottom)}.t-popup[data-popper-placement=right-start] .t-popup__arrow{top:8px}.t-popup[data-popper-placement=right] .t-popup__arrow{top:50%;margin-top:-4px}.t-popup[data-popper-placement=right-end] .t-popup__arrow{top:calc(100% - 16px)}.t-popup--animation-enter,.t-popup--animation-enter-from,.t-popup--animation-exiting,.t-popup--animation-leave-to{opacity:0;visibility:hidden}.t-popup--animation-enter-to,.t-popup--animation-entering,.t-popup--animation-leave-from,.t-popup--animation-leave{opacity:1;visibility:visible;transform:none}.t-popup--animation-enter-active{transition:opacity .2s linear}.t-popup--animation-leave-active{transition:opacity .2s cubic-bezier(0,0,.15,1),visibility .2s cubic-bezier(.82,0,1,.9)}.t-popup--animation-expand-enter-active[data-popper-placement^=top]{animation:t-popup-animation-expand-in-top .2s cubic-bezier(.38,0,.24,1),t-fade-in .2s linear}.t-popup--animation-expand-leave-active[data-popper-placement^=top]{animation:t-popup-animation-expand-out-top .2s cubic-bezier(.38,0,.24,1),t-fade-out .2s cubic-bezier(0,0,.15,1)}@keyframes t-popup-animation-expand-in-top{0%{clip-path:polygon(-20% 120%,120% 120%,120% 120%,-20% 120%)}to{clip-path:polygon(-20% 0,120% 0,120% 120%,-20% 120%)}}@keyframes t-popup-animation-expand-out-top{0%{clip-path:polygon(-20% 0,120% 0,120% 120%,-20% 120%)}to{clip-path:polygon(-20% 120%,120% 120%,120% 120%,-20% 120%)}}.t-popup--animation-expand-enter-active[data-popper-placement^=bottom]{animation:t-popup-animation-expand-in-bottom .2s cubic-bezier(.38,0,.24,1),t-fade-in .2s linear}.t-popup--animation-expand-leave-active[data-popper-placement^=bottom]{animation:t-popup-animation-expand-out-bottom .2s cubic-bezier(.38,0,.24,1),t-fade-out .2s cubic-bezier(0,0,.15,1)}@keyframes t-popup-animation-expand-in-bottom{0%{clip-path:polygon(-20% 0,120% 0,120% 0,-20% 0)}to{clip-path:polygon(-20% 0,120% 0,120% 120%,-20% 120%)}}@keyframes t-popup-animation-expand-out-bottom{0%{clip-path:polygon(-20% 0,120% 0,120% 120%,-20% 120%)}to{clip-path:polygon(-20% 0,120% 0,120% 0,-20% 0)}}';
      importCSS(indexCss$7);
      /**
       * tdesign v1.17.1
       * (c) 2025 tdesign
       * @license MIT
       */
      var Popup = withInstall(_Popup);
      /**
       * tdesign v1.17.1
       * (c) 2025 tdesign
       * @license MIT
       */
      var props$a = {
        delay: {
          type: Number
        },
        destroyOnClose: {
          type: Boolean,
          "default": true
        },
        duration: {
          type: Number
        },
        placement: {
          type: String,
          "default": "top"
        },
        showArrow: {
          type: Boolean,
          "default": true
        },
        theme: {
          type: String,
          "default": "default",
          validator: function validator(val) {
            if (!val) return true;
            return ["default", "primary", "success", "danger", "warning", "light"].includes(val);
          }
        }
      };
      /**
       * tdesign v1.17.1
       * (c) 2025 tdesign
       * @license MIT
       */
      var useMouse = function useMouse2() {
        var x = vue.ref(0);
        var y = vue.ref(0);
        var onMouseMove = function onMouseMove2(e) {
          x.value = e.clientX;
          y.value = e.clientY;
        };
        if (!isServer) {
          vue.onMounted(function() {
            window.addEventListener("mousemove", onMouseMove, {
              passive: true
            });
          });
          vue.onUnmounted(function() {
            window.removeEventListener("mousemove", onMouseMove);
          });
        }
        return {
          x,
          y
        };
      };
      const indexCss$6 = ".t-tooltip .t-popup__content{display:inline-block;border:0;z-index:5600;margin-bottom:1px;max-width:480px;word-break:break-word;box-sizing:border-box;border-radius:var(--td-radius-medium);color:var(--td-text-color-primary)}.t-tooltip--default .t-popup__content{color:var(--td-text-color-anti);background:var(--td-gray-color-13);box-shadow:inset 0 .5px 0 var(--td-gray-color-9),inset .5px 0 0 var(--td-gray-color-9),inset 0 -.5px 0 var(--td-gray-color-9),inset -.5px 0 0 var(--td-gray-color-9)}.t-tooltip--default[data-popper-placement^=left] .t-popup__arrow:before{box-shadow:inset -.5px 0 0 var(--td-gray-color-9),inset 0 .5px 0 var(--td-gray-color-9)}.t-tooltip--default[data-popper-placement^=right] .t-popup__arrow:before{box-shadow:inset .5px 0 0 var(--td-gray-color-9),inset 0 -.5px 0 var(--td-gray-color-9)}.t-tooltip--default[data-popper-placement^=top] .t-popup__arrow:before{box-shadow:inset 0 -.5px 0 var(--td-gray-color-9),inset -.5px 0 0 var(--td-gray-color-9)}.t-tooltip--default[data-popper-placement^=bottom] .t-popup__arrow:before{box-shadow:inset .5px 0 0 var(--td-gray-color-9),inset 0 .5px 0 var(--td-gray-color-9)}.t-tooltip--primary .t-popup__content{color:var(--td-brand-color);background:var(--td-brand-color-light)}.t-tooltip--success .t-popup__content{color:var(--td-success-color);background:var(--td-success-color-light)}.t-tooltip--danger .t-popup__content{color:var(--td-error-color);background:var(--td-error-color-light)}.t-tooltip--warning .t-popup__content{color:var(--td-warning-color);background:var(--td-warning-color-light)}.t-tooltip .t-popup__arrow{background:inherit;height:auto}.t-tooltip .t-popup__arrow:before{background:inherit}.t-tooltip--noshadow .t-popup__content,.t-tooltip--noshadow[data-popper-placement] .t-popup__arrow:before{box-shadow:none}";
      importCSS(indexCss$6);
      /**
       * tdesign v1.17.1
       * (c) 2025 tdesign
       * @license MIT
       */
      function ownKeys$a(e, r) {
        var t2 = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
          var o = Object.getOwnPropertySymbols(e);
          r && (o = o.filter(function(r2) {
            return Object.getOwnPropertyDescriptor(e, r2).enumerable;
          })), t2.push.apply(t2, o);
        }
        return t2;
      }
      function _objectSpread$a(e) {
        for (var r = 1; r < arguments.length; r++) {
          var t2 = null != arguments[r] ? arguments[r] : {};
          r % 2 ? ownKeys$a(Object(t2), true).forEach(function(r2) {
            _defineProperty$1(e, r2, t2[r2]);
          }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t2)) : ownKeys$a(Object(t2)).forEach(function(r2) {
            Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t2, r2));
          });
        }
        return e;
      }
      var _Tooltip = vue.defineComponent({
        name: "TTooltip",
        props: _objectSpread$a(_objectSpread$a({}, popupProps), props$a),
        setup: function setup(props2, ctx) {
          var timer = vue.ref(null);
          var popupRef = vue.ref(null);
          var _toRefs = vue.toRefs(props2), visible = _toRefs.visible, modelValue = _toRefs.modelValue;
          var _useVModel = useVModel(visible, modelValue, props2.defaultVisible, props2.onVisibleChange, "visible"), _useVModel2 = _slicedToArray(_useVModel, 2), innerVisible = _useVModel2[0], setInnerVisible = _useVModel2[1];
          var vm = vue.getCurrentInstance();
          var innerTooltipVisible = vue.ref(props2.visible || props2.defaultVisible);
          var classPrefix = usePrefixClass();
          var renderTNodeJSX = useTNodeJSX();
          var renderContent = useContent();
          var _useMouse = useMouse(), x = _useMouse.x;
          var offsetX = vue.ref(x.value);
          vue.onMounted(function() {
            if (props2.duration && innerTooltipVisible.value) {
              timer.value = setTimeout(function() {
                setInnerVisible(false, {});
                clearTimeout(timer.value);
                timer.value = null;
              }, props2.duration);
            }
          });
          var onTipVisibleChange = function onTipVisibleChange2(val, ctx2) {
            if (timer.value && (ctx2 === null || ctx2 === void 0 ? void 0 : ctx2.trigger) !== "document") return;
            if (val) {
              offsetX.value = x.value;
            }
            setInnerVisible(val, ctx2);
          };
          var tooltipOverlayClassName = vue.computed(function() {
            return ["".concat(classPrefix.value, "-tooltip"), _defineProperty$1({}, "".concat(classPrefix.value, "-tooltip--").concat(props2.theme), props2.theme), props2.overlayClassName];
          });
          var popupProps2 = vue.computed(function() {
            return _objectSpread$a(_objectSpread$a({}, (vm === null || vm === void 0 ? void 0 : vm.vnode.props) || {}), {}, {
              placement: props2.placement === "mouse" ? "bottom-left" : props2.placement,
              showArrow: props2.placement === "mouse" ? false : props2.showArrow,
              overlayClassName: tooltipOverlayClassName.value,
              onVisibleChange: onTipVisibleChange,
              disabled: props2.disabled
            });
          });
          var overlayInnerStyle = vue.computed(function() {
            if (props2.placement !== "mouse" || offsetX.value === 0) {
              return props2.overlayInnerStyle;
            }
            var offsetStyle = function offsetStyle2(triggerEl) {
              return {
                transform: "translateX(".concat(offsetX.value - triggerEl.getBoundingClientRect().left, "px)")
              };
            };
            if (props2.overlayInnerStyle) {
              return function(triggerEl, popupEl) {
                return _objectSpread$a(_objectSpread$a({}, offsetStyle(triggerEl)), isFunction(props2.overlayInnerStyle) ? props2.overlayInnerStyle(triggerEl, popupEl) : props2.overlayInnerStyle);
              };
            }
            return offsetStyle;
          });
          vue.watch(function() {
            return innerTooltipVisible.value;
          }, function() {
            if (timer.value && !innerTooltipVisible.value) {
              clearTimeout(timer.value);
              timer.value = null;
            }
          });
          var onPopupUpdate = function onPopupUpdate2() {
            var _popupRef$value, _popupRef$value$updat;
            (_popupRef$value = popupRef.value) === null || _popupRef$value === void 0 || (_popupRef$value$updat = _popupRef$value.update) === null || _popupRef$value$updat === void 0 || _popupRef$value$updat.call(_popupRef$value);
          };
          ctx.expose({
            updatePopper: onPopupUpdate
          });
          return function() {
            var _content = renderTNodeJSX("content");
            if (!_content && !props2.content) {
              return renderContent("default", "triggerElement");
            }
            return vue.createVNode(Popup, vue.mergeProps(omit(popupProps2.value, ["content", "default"]), {
              "ref": popupRef,
              "overlayInnerStyle": overlayInnerStyle.value,
              "visible": innerVisible.value
            }), {
              "default": function _default() {
                return [renderContent("default", "triggerElement")];
              },
              content: function content() {
                return _content;
              }
            });
          };
        }
      });
      /**
       * tdesign v1.17.1
       * (c) 2025 tdesign
       * @license MIT
       */
      var Tooltip = withInstall(_Tooltip);
      /**
       * tdesign v1.17.1
       * (c) 2025 tdesign
       * @license MIT
       */
      var props$9 = {
        align: {
          type: String,
          "default": "left",
          validator: function validator(val) {
            if (!val) return true;
            return ["left", "center", "right"].includes(val);
          }
        },
        allowInputOverMax: Boolean,
        autoWidth: Boolean,
        autocomplete: {
          type: String,
          "default": void 0
        },
        autofocus: Boolean,
        borderless: Boolean,
        clearable: Boolean,
        disabled: {
          type: Boolean,
          "default": void 0
        },
        format: {
          type: Function
        },
        inputClass: {
          type: [String, Object, Array]
        },
        label: {
          type: [String, Function]
        },
        maxcharacter: {
          type: Number
        },
        maxlength: {
          type: [String, Number]
        },
        name: {
          type: String,
          "default": ""
        },
        placeholder: {
          type: String,
          "default": void 0
        },
        prefixIcon: {
          type: Function
        },
        readonly: {
          type: Boolean,
          "default": void 0
        },
        showClearIconOnEmpty: Boolean,
        showLimitNumber: Boolean,
        size: {
          type: String,
          "default": "medium",
          validator: function validator(val) {
            if (!val) return true;
            return ["small", "medium", "large"].includes(val);
          }
        },
        spellCheck: Boolean,
        status: {
          type: String,
          "default": "default",
          validator: function validator(val) {
            if (!val) return true;
            return ["default", "success", "warning", "error"].includes(val);
          }
        },
        suffix: {
          type: [String, Function]
        },
        suffixIcon: {
          type: Function
        },
        tips: {
          type: [String, Function]
        },
        type: {
          type: String,
          "default": "text",
          validator: function validator(val) {
            if (!val) return true;
            return ["text", "number", "url", "tel", "password", "search", "submit", "hidden"].includes(val);
          }
        },
        value: {
          type: [String, Number],
          "default": void 0
        },
        modelValue: {
          type: [String, Number],
          "default": void 0
        },
        defaultValue: {
          type: [String, Number]
        },
        onBlur: Function,
        onChange: Function,
        onClear: Function,
        onClick: Function,
        onCompositionend: Function,
        onCompositionstart: Function,
        onEnter: Function,
        onFocus: Function,
        onKeydown: Function,
        onKeypress: Function,
        onKeyup: Function,
        onMouseenter: Function,
        onMouseleave: Function,
        onPaste: Function,
        onValidate: Function,
        onWheel: Function
      };
      /**
       * tdesign v1.17.1
       * (c) 2025 tdesign
       * @license MIT
       */
      var FormItemInjectionKey = Symbol("FormItemProvide");
      /**
       * tdesign v1.17.1
       * (c) 2025 tdesign
       * @license MIT
       */
      function useLengthLimit(params) {
        var getValueByLimitNumber = function getValueByLimitNumber2(inputValue) {
          var _params$value = params.value, allowInputOverMax = _params$value.allowInputOverMax, maxlength = _params$value.maxlength, maxcharacter = _params$value.maxcharacter;
          if (!(maxlength || maxcharacter) || allowInputOverMax || !inputValue) return inputValue;
          if (maxlength) {
            return limitUnicodeMaxLength(inputValue, maxlength);
          }
          if (maxcharacter) {
            var r = getCharacterLength(inputValue, maxcharacter);
            if (isObject(r)) {
              return r.characters;
            }
          }
        };
        var limitNumber = vue.computed(function() {
          var _params$value2 = params.value, maxlength = _params$value2.maxlength, maxcharacter = _params$value2.maxcharacter, value = _params$value2.value;
          if (isNumber(value)) return String(value);
          if (maxlength && maxcharacter) {
            log.warn("Input", "Pick one of maxlength and maxcharacter please.");
          }
          if (maxlength) {
            var length = value !== null && value !== void 0 && value.length ? getUnicodeLength(value) : 0;
            return "".concat(length, "/").concat(maxlength);
          }
          if (maxcharacter) {
            return "".concat(getCharacterLength(value || ""), "/").concat(maxcharacter);
          }
          return "";
        });
        var innerStatus = vue.computed(function() {
          if (limitNumber.value) {
            var _limitNumber$value$sp = limitNumber.value.split("/"), _limitNumber$value$sp2 = _slicedToArray(_limitNumber$value$sp, 2), current = _limitNumber$value$sp2[0], total = _limitNumber$value$sp2[1];
            return Number(current) > Number(total) ? "error" : "";
          }
          return "";
        });
        var tStatus = vue.computed(function() {
          var status = params.value.status;
          return status || innerStatus.value;
        });
        var onValidateChange = function onValidateChange2() {
          var _params$value$onValid, _params$value3;
          (_params$value$onValid = (_params$value3 = params.value).onValidate) === null || _params$value$onValid === void 0 || _params$value$onValid.call(_params$value3, {
            error: innerStatus.value ? "exceed-maximum" : void 0
          });
        };
        vue.watch(innerStatus, onValidateChange);
        vue.onMounted(function() {
          innerStatus.value && onValidateChange();
        });
        return {
          tStatus,
          limitNumber,
          getValueByLimitNumber
        };
      }
      /**
       * tdesign v1.17.1
       * (c) 2025 tdesign
       * @license MIT
       */
      function getOutputValue(val, type) {
        if (type === "number") {
          return val || val === 0 ? Number(val) : void 0;
        }
        return val;
      }
      function useInput(props2, expose) {
        var _toRefs = vue.toRefs(props2), value = _toRefs.value, modelValue = _toRefs.modelValue;
        var inputValue = vue.ref();
        var isComposition = vue.ref(false);
        var compositionValue = vue.ref();
        var clearIconRef = vue.ref(null);
        var innerClickElement = vue.ref();
        var disabled = useDisabled();
        var readonly2 = useReadonly();
        var _useVModel = useVModel(value, modelValue, props2.defaultValue, props2.onChange), _useVModel2 = _slicedToArray(_useVModel, 2), innerValue = _useVModel2[0], setInnerValue = _useVModel2[1];
        var isHover = vue.ref(false);
        var focused = vue.ref(false);
        var renderType = vue.ref(props2.type);
        var inputRef = vue.ref(null);
        var limitParams = vue.computed(function() {
          return {
            value: [void 0, null].includes(innerValue.value) ? void 0 : String(innerValue.value),
            status: props2.status,
            maxlength: Number(props2.maxlength),
            maxcharacter: props2.maxcharacter,
            allowInputOverMax: props2.allowInputOverMax,
            onValidate: props2.onValidate
          };
        });
        var _useLengthLimit = useLengthLimit(limitParams), limitNumber = _useLengthLimit.limitNumber, getValueByLimitNumber = _useLengthLimit.getValueByLimitNumber, tStatus = _useLengthLimit.tStatus;
        var showClear = vue.computed(function() {
          return (innerValue.value && !disabled.value && props2.clearable && !readonly2.value || props2.showClearIconOnEmpty) && isHover.value;
        });
        var focus = function focus2() {
          var _inputRef$value;
          focused.value = true;
          (_inputRef$value = inputRef.value) === null || _inputRef$value === void 0 || _inputRef$value.focus();
        };
        var blur = function blur2() {
          var _inputRef$value2;
          focused.value = false;
          (_inputRef$value2 = inputRef.value) === null || _inputRef$value2 === void 0 || _inputRef$value2.blur();
        };
        var emitFocus = function emitFocus2(e) {
          var _props$onFocus;
          if (isHover.value && focused.value) return;
          inputValue.value = innerValue.value;
          if (props2.disabled) return;
          focused.value = true;
          (_props$onFocus = props2.onFocus) === null || _props$onFocus === void 0 || _props$onFocus.call(props2, innerValue.value, {
            e
          });
        };
        var emitClear = function emitClear2(_ref) {
          var _props$onClear;
          var e = _ref.e;
          var val = props2.type === "number" ? void 0 : "";
          setInnerValue(val, {
            e,
            trigger: "clear"
          });
          (_props$onClear = props2.onClear) === null || _props$onClear === void 0 || _props$onClear.call(props2, {
            e
          });
        };
        var onClearIconMousedown = function onClearIconMousedown2(e) {
          innerClickElement.value = e.target;
        };
        var emitPassword = function emitPassword2() {
          if (disabled.value) return;
          var toggleType = renderType.value === "password" ? "text" : "password";
          renderType.value = toggleType;
        };
        var setInputElValue = function setInputElValue2() {
          var v = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
          var inputEl = inputRef.value;
          if (!inputEl) return;
          var sV = String(v);
          if (!inputEl.value) {
            return;
          }
          if (inputEl.value !== sV) {
            inputEl.value = sV;
          }
        };
        var inputValueChangeHandle = function inputValueChangeHandle2(e) {
          var _innerValue$value;
          var target = e.target;
          var val = target.value;
          if (props2.type !== "number" && typeof innerValue.value === "string" && val.length > ((_innerValue$value = innerValue.value) === null || _innerValue$value === void 0 ? void 0 : _innerValue$value.length)) {
            val = getValueByLimitNumber(val);
          }
          setInnerValue(getOutputValue(val, props2.type), {
            e,
            trigger: "input"
          });
          vue.nextTick(function() {
            if (props2.type === "number" && /\.(\d+)?0$/.test(val)) {
              setInputElValue(val);
            } else {
              setInputElValue(innerValue.value);
            }
          });
        };
        var handleInput = function handleInput2(e) {
          var checkInputType = e.inputType && e.inputType === "insertCompositionText";
          var val = e.currentTarget.value;
          if (checkInputType || isComposition.value) {
            compositionValue.value = val;
            return;
          }
          inputValueChangeHandle(e);
        };
        var isClearIcon = function isClearIcon2() {
          var _clearIconRef$value;
          var tmp = innerClickElement.value;
          if (!tmp || !tmp.tagName || !((_clearIconRef$value = clearIconRef.value) !== null && _clearIconRef$value !== void 0 && _clearIconRef$value.$el) || !["path", "svg"].includes(tmp.tagName)) return false;
          while (tmp) {
            var _clearIconRef$value2;
            if (((_clearIconRef$value2 = clearIconRef.value) === null || _clearIconRef$value2 === void 0 ? void 0 : _clearIconRef$value2.$el) === tmp) {
              return true;
            }
            tmp = tmp.parentNode;
          }
          return false;
        };
        var formItem = vue.inject(FormItemInjectionKey, void 0);
        var formatAndEmitBlur = function formatAndEmitBlur2(e) {
          if (!isClearIcon()) {
            var _props$onBlur;
            if (props2.format) {
              inputValue.value = typeof innerValue.value === "number" || props2.type === "number" ? innerValue.value : props2.format(innerValue.value);
            }
            focused.value = false;
            if (isComposition.value) {
              isComposition.value = false;
              compositionValue.value = "";
            }
            (_props$onBlur = props2.onBlur) === null || _props$onBlur === void 0 || _props$onBlur.call(props2, innerValue.value, {
              e
            });
            formItem === null || formItem === void 0 || formItem.handleBlur();
          } else {
            focus();
          }
        };
        var onHandleCompositionend = function onHandleCompositionend2(e) {
          var _props$onCompositione;
          isComposition.value = false;
          compositionValue.value = "";
          inputValueChangeHandle(e);
          (_props$onCompositione = props2.onCompositionend) === null || _props$onCompositione === void 0 || _props$onCompositione.call(props2, String(innerValue.value), {
            e
          });
        };
        var onHandleCompositionstart = function onHandleCompositionstart2(e) {
          var _props$onCompositions;
          isComposition.value = true;
          var value2 = e.currentTarget.value;
          compositionValue.value = value2;
          (_props$onCompositions = props2.onCompositionstart) === null || _props$onCompositions === void 0 || _props$onCompositions.call(props2, String(innerValue.value), {
            e
          });
        };
        var onRootClick = function onRootClick2(e) {
          var _inputRef$value3, _props$onClick;
          (_inputRef$value3 = inputRef.value) === null || _inputRef$value3 === void 0 || _inputRef$value3.focus();
          (_props$onClick = props2.onClick) === null || _props$onClick === void 0 || _props$onClick.call(props2, {
            e
          });
        };
        vue.watch(function() {
          return props2.autofocus;
        }, function(value2) {
          if (value2 === true) {
            vue.nextTick(function() {
              var _inputRef$value4;
              (_inputRef$value4 = inputRef.value) === null || _inputRef$value4 === void 0 || _inputRef$value4.focus();
            });
          }
        }, {
          immediate: true
        });
        vue.watch(innerValue, function(val, oldVal) {
          var isNumberType = props2.type === "number";
          if (oldVal === void 0 && props2.format && typeof val !== "number" && !isNumberType) {
            inputValue.value = props2.format(val);
          } else {
            inputValue.value = val;
          }
          var newVal = typeof val === "number" ? val : getValueByLimitNumber(val);
          if (newVal !== val && !isNumberType) {
            setInnerValue(newVal, {
              trigger: "initial"
            });
          }
        }, {
          immediate: true
        });
        vue.watch(function() {
          return props2.type;
        }, function(v) {
          renderType.value = v;
        }, {
          immediate: true
        });
        expose({
          inputRef,
          focus,
          blur
        });
        return {
          isHover,
          focused,
          renderType,
          showClear,
          inputRef,
          clearIconRef,
          inputValue,
          isComposition,
          compositionValue,
          limitNumber,
          tStatus,
          emitFocus,
          formatAndEmitBlur,
          onHandleCompositionend,
          onHandleCompositionstart,
          onRootClick,
          emitPassword,
          handleInput,
          emitClear,
          onClearIconMousedown,
          innerValue
        };
      }
      /**
       * tdesign v1.17.1
       * (c) 2025 tdesign
       * @license MIT
       */
      function useInputEventHandler(props2, isHover, isComposition) {
        var handleKeydown = function handleKeydown2(e) {
          if (props2.disabled) return;
          var code = e.code;
          var tmpValue = getOutputValue(e.currentTarget.value, props2.type);
          if (/enter/i.test(code) || /enter/i.test(e.key)) {
            if (!(isComposition !== null && isComposition !== void 0 && isComposition.value)) {
              var _props$onEnter;
              (_props$onEnter = props2.onEnter) === null || _props$onEnter === void 0 || _props$onEnter.call(props2, tmpValue, {
                e
              });
            }
          } else {
            var _props$onKeydown;
            (_props$onKeydown = props2.onKeydown) === null || _props$onKeydown === void 0 || _props$onKeydown.call(props2, tmpValue, {
              e
            });
          }
        };
        var handleKeyUp = function handleKeyUp2(e) {
          var _props$onKeyup;
          if (props2.disabled) return;
          var tmpValue = getOutputValue(e.currentTarget.value, props2.type);
          (_props$onKeyup = props2.onKeyup) === null || _props$onKeyup === void 0 || _props$onKeyup.call(props2, tmpValue, {
            e
          });
        };
        var handleKeypress = function handleKeypress2(e) {
          var _props$onKeypress;
          if (props2.disabled) return;
          var tmpValue = getOutputValue(e.currentTarget.value, props2.type);
          (_props$onKeypress = props2.onKeypress) === null || _props$onKeypress === void 0 || _props$onKeypress.call(props2, tmpValue, {
            e
          });
        };
        var onHandlePaste = function onHandlePaste2(e) {
          var _props$onPaste;
          if (props2.disabled) return;
          var clipData = e.clipboardData || window.clipboardData;
          (_props$onPaste = props2.onPaste) === null || _props$onPaste === void 0 || _props$onPaste.call(props2, {
            e,
            pasteValue: clipData === null || clipData === void 0 ? void 0 : clipData.getData("text/plain")
          });
        };
        var mouseEvent = function mouseEvent2(v) {
          return isHover.value = v;
        };
        var onHandleMousewheel = function onHandleMousewheel2(e) {
          var _props$onWheel;
          return (_props$onWheel = props2.onWheel) === null || _props$onWheel === void 0 ? void 0 : _props$onWheel.call(props2, {
            e
          });
        };
        var onInputMouseenter = function onInputMouseenter2(e) {
          var _props$onMouseenter;
          mouseEvent(true);
          (_props$onMouseenter = props2.onMouseenter) === null || _props$onMouseenter === void 0 || _props$onMouseenter.call(props2, {
            e
          });
        };
        var onInputMouseleave = function onInputMouseleave2(e) {
          var _props$onMouseleave;
          mouseEvent(false);
          (_props$onMouseleave = props2.onMouseleave) === null || _props$onMouseleave === void 0 || _props$onMouseleave.call(props2, {
            e
          });
        };
        return {
          isHover,
          handleKeydown,
          handleKeyUp,
          handleKeypress,
          onHandlePaste,
          onHandleMousewheel,
          onInputMouseenter,
          onInputMouseleave
        };
      }
      /**
       * tdesign v1.17.1
       * (c) 2025 tdesign
       * @license MIT
       */
      var ANIMATION_TIME = 100;
      function useInputWidth(props2, inputRef, innerValue) {
        var _toRefs = vue.toRefs(props2), autoWidth = _toRefs.autoWidth, placeholder = _toRefs.placeholder;
        var inputPreRef = vue.ref(null);
        var observerTimer = vue.ref(null);
        var updateInputWidth = function updateInputWidth2() {
          if (!inputPreRef.value || !inputRef.value) return;
          inputRef.value.style.width = getComputedStyle(inputPreRef.value).width;
        };
        useResizeObserver(inputPreRef, function() {
          if (autoWidth.value) {
            observerTimer.value = setTimeout(function() {
              updateInputWidth();
              clearTimeout(observerTimer.value);
            }, ANIMATION_TIME);
          }
        });
        vue.onBeforeUnmount(function() {
          clearTimeout(observerTimer.value);
        });
        var addListeners = function addListeners2() {
          vue.watch([innerValue, placeholder], function() {
            if (!autoWidth.value) return;
            vue.nextTick(function() {
              updateInputWidth();
            });
          }, {
            immediate: true
          });
        };
        vue.onMounted(function() {
          if (autoWidth.value) {
            addListeners();
          }
        });
        return {
          inputPreRef
        };
      }
      /**
       * tdesign v1.17.1
       * (c) 2025 tdesign
       * @license MIT
       */
      var _excluded$1 = ["isHover", "tStatus", "inputRef", "renderType", "showClear", "focused", "inputValue", "isComposition", "compositionValue", "innerValue", "limitNumber"];
      function ownKeys$9(e, r) {
        var t2 = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
          var o = Object.getOwnPropertySymbols(e);
          r && (o = o.filter(function(r2) {
            return Object.getOwnPropertyDescriptor(e, r2).enumerable;
          })), t2.push.apply(t2, o);
        }
        return t2;
      }
      function _objectSpread$9(e) {
        for (var r = 1; r < arguments.length; r++) {
          var t2 = null != arguments[r] ? arguments[r] : {};
          r % 2 ? ownKeys$9(Object(t2), true).forEach(function(r2) {
            _defineProperty$1(e, r2, t2[r2]);
          }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t2)) : ownKeys$9(Object(t2)).forEach(function(r2) {
            Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t2, r2));
          });
        }
        return e;
      }
      var _Input = vue.defineComponent({
        name: "TInput",
        props: _objectSpread$9(_objectSpread$9({}, props$9), {}, {
          showInput: {
            type: Boolean,
            "default": true
          },
          keepWrapperWidth: {
            type: Boolean,
            "default": false
          }
        }),
        setup: function setup(props2, _ref) {
          var expose = _ref.expose;
          var _useConfig = useConfig("input"), globalConfig = _useConfig.globalConfig;
          var _useGlobalIcon = useGlobalIcon({
            BrowseIcon: browse,
            BrowseOffIcon: browseOff,
            CloseCircleFilledIcon: closeCircleFilled
          }), BrowseIcon$1 = _useGlobalIcon.BrowseIcon, BrowseOffIcon$1 = _useGlobalIcon.BrowseOffIcon, CloseCircleFilledIcon$1 = _useGlobalIcon.CloseCircleFilledIcon;
          var readonly2 = useReadonly();
          var disabled = useDisabled();
          var COMPONENT_NAME = usePrefixClass("input");
          var INPUT_WRAP_CLASS = usePrefixClass("input__wrap");
          var INPUT_TIPS_CLASS = usePrefixClass("input__tips");
          var _useCommonClassName = useCommonClassName$1(), STATUS = _useCommonClassName.STATUS, SIZE = _useCommonClassName.SIZE;
          var classPrefix = usePrefixClass();
          var renderTNodeJSX = useTNodeJSX();
          var _useInput = useInput(props2, expose), isHover = _useInput.isHover, tStatus = _useInput.tStatus, inputRef = _useInput.inputRef, renderType = _useInput.renderType, showClear = _useInput.showClear, focused = _useInput.focused, inputValue = _useInput.inputValue, isComposition = _useInput.isComposition, compositionValue = _useInput.compositionValue, innerValue = _useInput.innerValue, limitNumber = _useInput.limitNumber, inputHandle = _objectWithoutProperties(_useInput, _excluded$1);
          var _useInputWidth = useInputWidth(props2, inputRef, innerValue), inputPreRef = _useInputWidth.inputPreRef;
          var inputEventHandler = useInputEventHandler(props2, isHover, isComposition);
          var tPlaceholder = vue.computed(function() {
            var _props2$placeholder;
            return (_props2$placeholder = props2.placeholder) !== null && _props2$placeholder !== void 0 ? _props2$placeholder : globalConfig.value.placeholder;
          });
          var inputAttrs = vue.computed(function() {
            var _props2$autocomplete;
            var value = {
              autofocus: props2.autofocus,
              disabled: disabled.value,
              readonly: readonly2.value,
              placeholder: tPlaceholder.value,
              name: props2.name || void 0,
              type: renderType.value,
              autocomplete: (_props2$autocomplete = props2.autocomplete) !== null && _props2$autocomplete !== void 0 ? _props2$autocomplete : globalConfig.value.autocomplete || void 0,
              unselectable: readonly2.value ? "on" : "off",
              spellcheck: props2.spellCheck
            };
            return getValidAttrs(value);
          });
          var wrapClasses = vue.computed(function() {
            return [INPUT_WRAP_CLASS.value, _defineProperty$1({}, "".concat(COMPONENT_NAME.value, "--auto-width"), props2.autoWidth && !props2.keepWrapperWidth)];
          });
          var inputEvents = getValidAttrs({
            onFocus: inputHandle.emitFocus,
            onBlur: inputHandle.formatAndEmitBlur,
            onKeydown: inputEventHandler.handleKeydown,
            onKeyup: inputEventHandler.handleKeyUp,
            onKeypress: inputEventHandler.handleKeypress,
            onPaste: inputEventHandler.onHandlePaste,
            onCompositionend: inputHandle.onHandleCompositionend,
            onCompositionstart: inputHandle.onHandleCompositionstart
          });
          return function() {
            var _compositionValue$val, _inputValue$value, _compositionValue$val2;
            var prefixIcon = renderTNodeJSX("prefixIcon");
            var suffixIcon = renderTNodeJSX("suffixIcon");
            var passwordIcon = renderTNodeJSX("passwordIcon");
            var label = renderTNodeJSX("label", {
              silent: true
            });
            var suffix2 = renderTNodeJSX("suffix");
            var limitNode = limitNumber.value && props2.showLimitNumber ? vue.createVNode("div", {
              "class": ["".concat(classPrefix.value, "-input__limit-number"), _defineProperty$1({}, "".concat(classPrefix.value, "-is-disabled"), disabled.value)]
            }, [limitNumber.value]) : null;
            var labelContent = label ? vue.createVNode("div", {
              "class": "".concat(COMPONENT_NAME.value, "__prefix")
            }, [label]) : null;
            var suffixContent = suffix2 || limitNode ? vue.createVNode("div", {
              "class": "".concat(COMPONENT_NAME.value, "__suffix")
            }, [suffix2, limitNode]) : null;
            if (props2.type === "password") {
              var passwordClass = [_defineProperty$1({}, "".concat(COMPONENT_NAME.value, "__suffix-clear"), !disabled.value)];
              if (renderType.value === "password") {
                suffixIcon = vue.createVNode(BrowseOffIcon$1, {
                  "class": passwordClass,
                  "onClick": inputHandle.emitPassword
                }, null);
              } else if (renderType.value === "text") {
                suffixIcon = vue.createVNode(BrowseIcon$1, {
                  "class": passwordClass,
                  "onClick": inputHandle.emitPassword
                }, null);
              }
            }
            if (showClear.value) {
              if (props2.type === "password") {
                passwordIcon = vue.createVNode(CloseCircleFilledIcon$1, {
                  "ref": inputHandle.clearIconRef,
                  "class": "".concat(COMPONENT_NAME.value, "__suffix-clear"),
                  "onClick": inputHandle.emitClear,
                  "onMousedown": inputHandle.onClearIconMousedown
                }, null);
              } else {
                suffixIcon = vue.createVNode(CloseCircleFilledIcon$1, {
                  "ref": inputHandle.clearIconRef,
                  "class": "".concat(COMPONENT_NAME.value, "__suffix-clear"),
                  "onClick": inputHandle.emitClear,
                  "onMousedown": inputHandle.onClearIconMousedown
                }, null);
              }
            }
            var classes = [COMPONENT_NAME.value, props2.inputClass, _defineProperty$1(_defineProperty$1(_defineProperty$1(_defineProperty$1(_defineProperty$1(_defineProperty$1(_defineProperty$1(_defineProperty$1(_defineProperty$1(_defineProperty$1({}, SIZE.value[props2.size], props2.size !== "medium"), STATUS.value.disabled, disabled.value), STATUS.value.focused, disabled.value ? false : focused.value), "".concat(classPrefix.value, "-is-").concat(tStatus.value), tStatus.value && tStatus.value !== "default"), "".concat(classPrefix.value, "-align-").concat(props2.align), props2.align !== "left"), "".concat(classPrefix.value, "-is-readonly"), readonly2.value), "".concat(COMPONENT_NAME.value, "--prefix"), prefixIcon || labelContent), "".concat(COMPONENT_NAME.value, "--suffix"), suffixIcon || suffixContent), "".concat(COMPONENT_NAME.value, "--borderless"), props2.borderless), "".concat(COMPONENT_NAME.value, "--focused"), focused.value)];
            var tips = renderTNodeJSX("tips");
            var tipsClasses = [INPUT_TIPS_CLASS.value, "".concat(classPrefix.value, "-tips"), "".concat(classPrefix.value, "-is-").concat(tStatus.value || "default")];
            return vue.withDirectives(vue.createVNode("div", {
              "class": wrapClasses.value
            }, [vue.createVNode("div", {
              "class": classes,
              "onClick": inputHandle.onRootClick,
              "onMouseenter": inputEventHandler.onInputMouseenter,
              "onMouseleave": inputEventHandler.onInputMouseleave,
              "onWheel": inputEventHandler.onHandleMousewheel
            }, [prefixIcon ? vue.createVNode("span", {
              "class": ["".concat(COMPONENT_NAME.value, "__prefix"), "".concat(COMPONENT_NAME.value, "__prefix-icon")]
            }, [prefixIcon]) : null, labelContent, vue.createVNode("input", vue.mergeProps({
              "class": ["".concat(COMPONENT_NAME.value, "__inner"), _defineProperty$1({}, "".concat(COMPONENT_NAME.value, "--soft-hidden"), !props2.showInput)]
            }, inputAttrs.value, inputEvents, {
              "ref": inputRef,
              "value": isComposition.value ? (_compositionValue$val = compositionValue.value) !== null && _compositionValue$val !== void 0 ? _compositionValue$val : "" : (_inputValue$value = inputValue.value) !== null && _inputValue$value !== void 0 ? _inputValue$value : "",
              "onInput": function onInput(e) {
                return inputHandle.handleInput(e);
              }
            }), null), props2.autoWidth && vue.createVNode("span", {
              "ref": inputPreRef,
              "class": "".concat(classPrefix.value, "-input__input-pre")
            }, [isComposition.value ? (_compositionValue$val2 = compositionValue.value) !== null && _compositionValue$val2 !== void 0 ? _compositionValue$val2 : "" : innerValue.value || tPlaceholder.value]), suffixContent, passwordIcon ? vue.createVNode("span", {
              "class": ["".concat(COMPONENT_NAME.value, "__suffix"), "".concat(COMPONENT_NAME.value, "__suffix-icon"), "".concat(COMPONENT_NAME.value, "__clear")]
            }, [passwordIcon]) : null, suffixIcon ? vue.createVNode("span", {
              "class": ["".concat(COMPONENT_NAME.value, "__suffix"), "".concat(COMPONENT_NAME.value, "__suffix-icon"), _defineProperty$1({}, "".concat(COMPONENT_NAME.value, "__clear"), showClear.value)]
            }, [suffixIcon]) : null]), tips && vue.createVNode("div", {
              "class": tipsClasses
            }, [tips])]), [[vue.vShow, props2.type !== "hidden"]]);
          };
        }
      });
      /**
       * tdesign v1.17.1
       * (c) 2025 tdesign
       * @license MIT
       */
      var inputGroupProps = {
        separate: Boolean
      };
      /**
       * tdesign v1.17.1
       * (c) 2025 tdesign
       * @license MIT
       */
      var _InputGroup = vue.defineComponent({
        name: "TInputGroup",
        props: inputGroupProps,
        setup: function setup(props2) {
          var COMPONENT_NAME = usePrefixClass("input-group");
          var renderTNodeJSX = useTNodeJSX();
          var CLASS = vue.computed(function() {
            return [COMPONENT_NAME.value, _defineProperty$1({}, "".concat(COMPONENT_NAME.value, "--separate"), props2.separate)];
          });
          return function() {
            return vue.createVNode("div", {
              "class": CLASS.value
            }, [renderTNodeJSX("default")]);
          };
        }
      });
      const indexCss$5 = ".input-readonly.t-is-readonly{color:var(--td-text-color-primary);background-color:var(--td-bg-color-specialcomponent)}.input-readonly.t-is-readonly .t-input__inner{cursor:pointer}.input-disabled.t-is-disabled{color:var(--td-text-color-disabled);background-color:var(--td-bg-color-component-disabled)}.input-disabled.t-is-disabled:hover{border-color:var(--td-border-level-2-color)}.input-disabled.t-is-disabled .t-input__inner{cursor:not-allowed;color:var(--td-text-color-disabled);text-overflow:initial}.input-disabled.t-is-disabled .t-input__inner::placeholder{color:var(--td-text-color-disabled)}.input-disabled.t-is-disabled>.t-input__prefix .t-icon,.input-disabled.t-is-disabled>.t-input__suffix .t-icon{color:var(--td-text-color-disabled)}.input-disabled.t-is-disabled>.t-input__prefix .t-icon:hover,.input-disabled.t-is-disabled>.t-input__suffix .t-icon:hover{color:var(--td-text-color-disabled)}.t-tips{font-size:var(--td-font-size-body-small)}.t-tips.t-is-default{color:var(--td-text-color-placeholder)}.t-tips.t-is-error{color:var(--td-error-color)}.t-tips.t-is-warning{color:var(--td-warning-color)}.t-tips.t-is-success{color:var(--td-success-color)}.t-input{margin:0;padding:0;list-style:none;position:relative;height:var(--td-comp-size-m);border-width:1px;border-style:solid;border-radius:var(--td-radius-default);border-color:var(--td-border-level-2-color);padding:0 var(--td-comp-paddingLR-s);background-color:var(--td-bg-color-specialcomponent);outline:none;color:var(--td-text-color-primary);font:var(--td-font-body-medium);width:100%;box-sizing:border-box;transition:border cubic-bezier(.38,0,.24,1) .2s,box-shadow cubic-bezier(.38,0,.24,1) .2s,background-color cubic-bezier(.38,0,.24,1) .2s;display:flex;align-items:center;overflow:hidden}.t-input:hover{border-color:var(--td-brand-color)}.t-input:focus{z-index:1;border-color:var(--td-brand-color);box-shadow:0 0 0 2px var(--td-brand-color-focus)}.t-input--borderless:not(.t-input--focused){border-color:transparent;transition:border cubic-bezier(.38,0,.24,1) .2s,box-shadow cubic-bezier(.38,0,.24,1) .2s,background-color cubic-bezier(.38,0,.24,1) .2s}.t-input--borderless:not(.t-input--focused):hover{border-color:var(--td-component-border);background-color:var(--td-bg-color-container-hover);cursor:pointer}.t-input--borderless:not(.t-input--focused).t-is-disabled{border:none;background-color:var(--td-bg-color-component-disabled)}.t-input--focused{border-color:var(--td-brand-color);box-shadow:0 0 0 2px var(--td-brand-color-focus);z-index:1}.t-input :focus-visible{outline:none}.t-input__inner{flex:1;border:none;outline:none;padding:0;max-width:100%;min-width:0;color:var(--td-text-color-primary);font:inherit;background-color:transparent;box-sizing:border-box;white-space:nowrap;word-wrap:normal;overflow:hidden;text-overflow:ellipsis}.t-input__inner::placeholder{color:var(--td-text-color-placeholder)}.t-input__inner:placeholder-shown{text-overflow:ellipsis;width:100%}.t-input__inner[type=password]::-ms-reveal{display:none}.t-input__inner[type=search]::-webkit-search-decoration,.t-input__inner[type=search]::-webkit-search-cancel-button,.t-input__inner[type=search]::-webkit-search-results-button,.t-input__inner[type=search]::-webkit-search-results-decoration{appearance:none}.t-input__inner.t-input--soft-hidden{width:0}.t-input__extra{font:var(--td-font-body-small);color:var(--td-text-color-placeholder)}.t-input__status{position:absolute;right:-24px;top:0}.t-input.t-input--suffix>span.t-input__clear{opacity:0;visibility:hidden;transition:border cubic-bezier(.38,0,.24,1) .2s,box-shadow cubic-bezier(.38,0,.24,1) .2s,background-color cubic-bezier(.38,0,.24,1) .2s}.t-input.t-input--suffix:hover>span.t-input__clear{opacity:1;visibility:visible}.t-input.t-is-success{border-color:var(--td-success-color)}.t-input.t-is-success:focus{box-shadow:0 0 0 2px var(--td-success-color-focus)}.t-input.t-is-success.t-input--focused{box-shadow:0 0 0 2px var(--td-success-color-focus)}.t-input.t-is-success>.t-input__extra{color:var(--td-success-color)}.t-input.t-is-warning{border-color:var(--td-warning-color)}.t-input.t-is-warning:focus{box-shadow:0 0 0 2px var(--td-warning-color-focus)}.t-input.t-is-warning.t-input--focused{box-shadow:0 0 0 2px var(--td-warning-color-focus)}.t-input.t-is-warning>.t-input__extra{color:var(--td-warning-color)}.t-input.t-is-error{border-color:var(--td-error-color)}.t-input.t-is-error:focus{box-shadow:0 0 0 2px var(--td-error-color-focus)}.t-input.t-is-error.t-input--focused{box-shadow:0 0 0 2px var(--td-error-color-focus)}.t-input.t-is-error>.t-input__extra{color:var(--td-error-color)}.t-input.t-is-readonly{color:var(--td-text-color-primary);background-color:var(--td-bg-color-specialcomponent)}.t-input.t-is-readonly .t-input__inner{cursor:pointer}.t-input.t-is-disabled{color:var(--td-text-color-disabled);background-color:var(--td-bg-color-component-disabled)}.t-input.t-is-disabled:hover{border-color:var(--td-border-level-2-color)}.t-input.t-is-disabled .t-input__inner{cursor:not-allowed;color:var(--td-text-color-disabled);text-overflow:initial}.t-input.t-is-disabled .t-input__inner::placeholder{color:var(--td-text-color-disabled)}.t-input.t-is-disabled>.t-input__prefix .t-icon,.t-input.t-is-disabled>.t-input__suffix .t-icon{color:var(--td-text-color-disabled)}.t-input.t-is-disabled>.t-input__prefix .t-icon:hover,.t-input.t-is-disabled>.t-input__suffix .t-icon:hover{color:var(--td-text-color-disabled)}.t-input.t-input--prefix>.t-input__prefix{z-index:2;height:100%;text-align:center;display:flex;align-items:center}.t-input.t-input--prefix>.t-input__prefix-icon{font-size:var(--td-font-size-body-large)}.t-input.t-input--prefix.t-size-s .t-input__prefix-icon{font-size:var(--td-font-size-body-medium)}.t-input.t-input--prefix.t-size-l .t-input__prefix-icon{font-size:var(--td-font-size-title-large)}.t-input.t-input--suffix>.t-input__suffix{z-index:2;height:100%;text-align:center;display:flex;align-items:center}.t-input.t-input--suffix>.t-input__suffix-icon{font-size:var(--td-font-size-body-large)}.t-input.t-input--suffix.t-size-s .t-input__suffix-icon{font-size:var(--td-font-size-body-medium)}.t-input.t-input--suffix.t-size-l .t-input__suffix-icon{font-size:var(--td-font-size-title-large)}.t-input .t-input__suffix-clear{cursor:pointer}.t-input.t-size-l{height:var(--td-comp-size-xl);font:var(--td-font-body-large);padding:var(--td-comp-paddingTB-m) var(--td-comp-paddingLR-m)}.t-input.t-size-s{height:var(--td-comp-size-xs);font:var(--td-font-body-small)}.t-input .t-input__prefix>.t-icon,.t-input .t-input__suffix>.t-icon{font-size:inherit}.t-input .t-input__prefix>.t-icon{color:var(--td-text-color-placeholder)}.t-input .t-input__prefix:not(:empty){margin-right:var(--td-comp-margin-s)}.t-input .t-input__suffix>.t-icon{color:var(--td-text-color-placeholder);transition:all .2s linear}.t-input .t-input__suffix>.t-icon:hover{color:var(--td-text-color-secondary);transition:all .2s linear}.t-input .t-input__suffix:not(:empty){margin-left:var(--td-comp-margin-s)}.t-input.t-is-focused .t-input__prefix>.t-icon{color:var(--td-brand-color)}.t-input.t-is-focused .t-input__suffix>.t-icon-time,.t-input.t-is-focused .t-input__suffix .t-icon-calendar{color:var(--td-brand-color)}.t-input-group{position:relative;display:inline-flex;align-items:stretch}.t-input-group .t-input__wrap{border-radius:0}.t-input-group .t-input__wrap:first-child{border-radius:var(--td-radius-default) 0 0 var(--td-radius-default)}.t-input-group .t-input__wrap:last-child{border-radius:0 var(--td-radius-default) var(--td-radius-default) 0}.t-input-group .t-button,.t-input-group .t-select{border-radius:0}.t-input-group .t-button:not(:first-child),.t-input-group .t-select:not(:first-child){margin-left:-1px}.t-input-group .t-input__wrap:not(:first-child) .t-input{margin-left:-1px}.t-input-group .t-input__wrap:first-child .t-input{border-radius:var(--td-radius-default) 0 0 var(--td-radius-default)}.t-input-group .t-input__wrap:last-child .t-input{border-radius:0 var(--td-radius-default) var(--td-radius-default) 0}.t-input-group .t-button:first-child,.t-input-group .t-select:first-child{border-radius:var(--td-radius-default) 0 0 var(--td-radius-default)}.t-input-group .t-button:last-child,.t-input-group .t-select:last-child{border-radius:0 var(--td-radius-default) var(--td-radius-default) 0}.t-input-group--separate .t-input__wrap+.t-input__wrap{margin-left:var(--td-comp-margin-xxxl)}.t-input-group--separate .t-button,.t-input-group--separate .t-select{border-radius:var(--td-radius-default)}.t-input-group--separate .t-button:first-child,.t-input-group--separate .t-select:first-child{border-radius:var(--td-radius-default) 0 0 var(--td-radius-default)}.t-input-group--separate .t-button:last-child,.t-input-group--separate .t-select:last-child{border-radius:0 var(--td-radius-default) var(--td-radius-default) 0}.t-input-group--separate .t-input__wrap .t-input,.t-input-group--separate .t-input__wrap .t-input:first-child{border-radius:var(--td-radius-default)}.t-input-group--separate .t-input__wrap .t-input:last-child{border-radius:var(--td-radius-default)}.t-input-group .t-input__inner,.t-input-group .t-button,.t-input-group .t-select{position:relative;z-index:0}.t-input-group .t-input__inner:hover,.t-input-group .t-button:hover,.t-input-group .t-select:hover,.t-input-group .t-input__inner:focus,.t-input-group .t-button:focus,.t-input-group .t-select:focus,.t-input-group .t-input__inner:active,.t-input-group .t-button:active,.t-input-group .t-select:active{z-index:1}.t-input__wrap{width:100%}.t-input__tips{height:auto;min-height:var(--td-line-height-body-small);font:var(--td-font-body-small);position:absolute}.t-input__tips--default{color:var(--td-text-color-placeholder)}.t-input__tips--success{color:var(--td-success-color)}.t-input__tips--warning{color:var(--td-warning-color)}.t-input__tips--error{color:var(--td-error-color)}.t-align-center>.t-input__inner{text-align:center}.t-align-right>.t-input__inner{text-align:right}.t-input__input-pre{position:absolute;visibility:hidden;white-space:pre;display:block}.t-input--auto-width{width:fit-content;min-width:60px}.t-input__limit-number{font:var(--td-font-body-medium);color:var(--td-text-color-placeholder);background:var(--td-bg-color-specialcomponent)}.t-input__limit-number.t-is-disabled{background:var(--td-bg-color-component-disabled)}";
      importCSS(indexCss$5);
      /**
       * tdesign v1.17.1
       * (c) 2025 tdesign
       * @license MIT
       */
      var Input = withInstall(_Input);
      withInstall(_InputGroup);
      /**
       * tdesign v1.17.1
       * (c) 2025 tdesign
       * @license MIT
       */
      var props$8 = {
        allowInputOverMax: Boolean,
        autofocus: Boolean,
        autosize: {
          type: [Boolean, Object],
          "default": false
        },
        disabled: {
          type: Boolean,
          "default": void 0
        },
        maxcharacter: {
          type: Number
        },
        maxlength: {
          type: [String, Number]
        },
        name: {
          type: String,
          "default": ""
        },
        placeholder: {
          type: String,
          "default": void 0
        },
        readonly: {
          type: Boolean,
          "default": void 0
        },
        status: {
          type: String,
          "default": "default",
          validator: function validator(val) {
            if (!val) return true;
            return ["default", "success", "warning", "error"].includes(val);
          }
        },
        tips: {
          type: [String, Function]
        },
        value: {
          type: [String, Number],
          "default": void 0
        },
        modelValue: {
          type: [String, Number],
          "default": void 0
        },
        defaultValue: {
          type: [String, Number]
        },
        onBlur: Function,
        onChange: Function,
        onFocus: Function,
        onKeydown: Function,
        onKeypress: Function,
        onKeyup: Function,
        onValidate: Function
      };
      /**
       * tdesign v1.17.1
       * (c) 2025 tdesign
       * @license MIT
       */
      var TEXTAREA_STYLE = "\n  min-height:0 !important;\n  max-height:none !important;\n  height:0 !important;\n  visibility:hidden !important;\n  overflow:hidden !important;\n  position:absolute !important;\n  z-index:-1000 !important;\n  top:0 !important;\n  right:0 !important\n";
      var hiddenTextarea;
      function calcTextareaHeight(targetElement) {
        var _hiddenTextarea;
        var minRows = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 1;
        var maxRows = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : null;
        if (!hiddenTextarea) {
          hiddenTextarea = document.createElement("textarea");
          document.body.appendChild(hiddenTextarea);
        }
        var _calculateNodeSize = calculateNodeSize(targetElement), paddingSize = _calculateNodeSize.paddingSize, borderSize = _calculateNodeSize.borderSize, boxSizing = _calculateNodeSize.boxSizing, sizingStyle = _calculateNodeSize.sizingStyle;
        hiddenTextarea.setAttribute("style", "".concat(sizingStyle, ";").concat(TEXTAREA_STYLE));
        hiddenTextarea.value = targetElement.value || targetElement.placeholder || "";
        var height = hiddenTextarea.scrollHeight;
        var result = {};
        var isBorderbox = boxSizing === "border-box";
        var isContentbox = boxSizing === "content-box";
        if (isBorderbox) {
          height += borderSize;
        } else if (isContentbox) {
          height -= paddingSize;
        }
        hiddenTextarea.value = "";
        var singleRowHeight = hiddenTextarea.scrollHeight - paddingSize;
        (_hiddenTextarea = hiddenTextarea) === null || _hiddenTextarea === void 0 || (_hiddenTextarea = _hiddenTextarea.parentNode) === null || _hiddenTextarea === void 0 || _hiddenTextarea.removeChild(hiddenTextarea);
        hiddenTextarea = null;
        var calcHeight = function calcHeight2(rows) {
          var rowsHeight = singleRowHeight * rows;
          if (isBorderbox) {
            rowsHeight = rowsHeight + paddingSize + borderSize;
          }
          return rowsHeight;
        };
        if (!isNull(minRows)) {
          var minHeight = calcHeight(minRows);
          height = Math.max(minHeight, height);
          result.minHeight = "".concat(minHeight, "px");
        }
        if (!isNull(maxRows)) {
          height = Math.min(calcHeight(maxRows), height);
        }
        result.height = "".concat(height, "px");
        return result;
      }
      var _Textarea = vue.defineComponent({
        name: "TTextarea",
        inheritAttrs: false,
        props: props$8,
        setup: function setup(props2, _ref) {
          var attrs = _ref.attrs, expose = _ref.expose;
          var prefix = usePrefixClass();
          var name = usePrefixClass("textarea");
          var TEXTAREA_TIPS_CLASS = vue.computed(function() {
            return "".concat(name.value, "__tips");
          });
          var TEXTAREA_LIMIT = vue.computed(function() {
            return "".concat(name.value, "__limit");
          });
          var _toRefs = vue.toRefs(props2), value = _toRefs.value, modelValue = _toRefs.modelValue;
          var _useVModel = useVModel(value, modelValue, props2.defaultValue, props2.onChange), _useVModel2 = _slicedToArray(_useVModel, 2), innerValue = _useVModel2[0], setInnerValue = _useVModel2[1];
          var disabled = useDisabled();
          var isReadonly = useReadonly();
          var textareaStyle = vue.ref({});
          var refTextareaElem = vue.ref();
          var focused = vue.ref(false);
          var isComposing = vue.ref(false);
          var focus = function focus2() {
            var _refTextareaElem$valu;
            return (_refTextareaElem$valu = refTextareaElem.value) === null || _refTextareaElem$valu === void 0 ? void 0 : _refTextareaElem$valu.focus();
          };
          var blur = function blur2() {
            var _refTextareaElem$valu2;
            return (_refTextareaElem$valu2 = refTextareaElem.value) === null || _refTextareaElem$valu2 === void 0 ? void 0 : _refTextareaElem$valu2.blur();
          };
          var adjustTextareaHeight = function adjustTextareaHeight2() {
            var _refTextareaElem$valu3;
            if (props2.autosize === true) {
              vue.nextTick(function() {
                textareaStyle.value = calcTextareaHeight(refTextareaElem.value);
              });
            } else if (props2.autosize && _typeof(props2.autosize) === "object") {
              var _props2$autosize = props2.autosize, minRows = _props2$autosize.minRows, maxRows = _props2$autosize.maxRows;
              vue.nextTick(function() {
                textareaStyle.value = calcTextareaHeight(refTextareaElem.value, minRows, maxRows);
              });
            } else if (attrs.rows) {
              textareaStyle.value = {
                height: "auto",
                minHeight: "auto"
              };
            } else if (attrs.style && (_refTextareaElem$valu3 = refTextareaElem.value) !== null && _refTextareaElem$valu3 !== void 0 && (_refTextareaElem$valu3 = _refTextareaElem$valu3.style) !== null && _refTextareaElem$valu3 !== void 0 && _refTextareaElem$valu3.height) {
              textareaStyle.value = {
                height: refTextareaElem.value.style.height
              };
            }
          };
          var setInputValue = function setInputValue2() {
            var v = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
            var textareaElem = refTextareaElem.value;
            var sV = String(v);
            if (!textareaElem) {
              return;
            }
            if (textareaElem.value !== sV) {
              textareaElem.value = sV;
              innerValue.value = sV;
            }
          };
          var inputValueChangeHandle = function inputValueChangeHandle2(e) {
            var target = e.target;
            var val = target.value;
            if (props2.maxcharacter && props2.maxcharacter >= 0) {
              var stringInfo = getCharacterLength(val, props2.maxcharacter);
              if (!props2.allowInputOverMax) {
                val = _typeof(stringInfo) === "object" && stringInfo.characters;
              }
            }
            !isComposing.value && setInnerValue(val, {
              e
            });
            vue.nextTick(function() {
              return setInputValue(val);
            });
            adjustTextareaHeight();
          };
          var handleInput = function handleInput2(e) {
            inputValueChangeHandle(e);
          };
          var onCompositionstart = function onCompositionstart2() {
            isComposing.value = true;
          };
          var onCompositionend = function onCompositionend2(e) {
            isComposing.value = false;
            inputValueChangeHandle(e);
          };
          var eventDeal = function eventDeal2(name2, e) {
            var _props2$eventName;
            if (disabled.value) return;
            var eventName = "on".concat(name2[0].toUpperCase()).concat(name2.slice(1));
            (_props2$eventName = props2[eventName]) === null || _props2$eventName === void 0 || _props2$eventName.call(props2, innerValue.value, {
              e
            });
          };
          var emitKeyDown = function emitKeyDown2(e) {
            eventDeal("keydown", e);
          };
          var emitKeyUp = function emitKeyUp2(e) {
            eventDeal("keyup", e);
          };
          var emitKeypress = function emitKeypress2(e) {
            eventDeal("keypress", e);
          };
          var emitFocus = function emitFocus2(e) {
            var _props2$onFocus;
            adjustTextareaHeight();
            if (disabled.value) return;
            focused.value = true;
            (_props2$onFocus = props2.onFocus) === null || _props2$onFocus === void 0 || _props2$onFocus.call(props2, innerValue.value, {
              e
            });
          };
          var formItem = vue.inject(FormItemInjectionKey, void 0);
          var emitBlur = function emitBlur2(e) {
            var _props2$onBlur;
            if (!e.target) return;
            adjustTextareaHeight();
            focused.value = false;
            (_props2$onBlur = props2.onBlur) === null || _props2$onBlur === void 0 || _props2$onBlur.call(props2, innerValue.value, {
              e
            });
            formItem === null || formItem === void 0 || formItem.handleBlur();
          };
          var textareaClasses = vue.computed(function() {
            return [name.value, _defineProperty$1(_defineProperty$1({}, "".concat(prefix.value, "-is-disabled"), disabled.value), "".concat(prefix.value, "-is-readonly"), isReadonly.value)];
          });
          var inputAttrs = vue.computed(function() {
            return getValidAttrs({
              autofocus: props2.autofocus,
              disabled: disabled.value,
              readonly: isReadonly.value,
              placeholder: props2.placeholder,
              maxlength: !props2.allowInputOverMax && props2.maxlength || void 0,
              name: props2.name || void 0
            });
          });
          var characterNumber = vue.computed(function() {
            var characterInfo = getCharacterLength(String(innerValue.value || ""));
            if (_typeof(characterInfo) === "object") {
              return characterInfo.length;
            }
            return characterInfo;
          });
          var limitParams = vue.computed(function() {
            return {
              value: [void 0, null].includes(innerValue.value) ? void 0 : String(innerValue.value),
              status: props2.status,
              maxlength: Number(props2.maxlength),
              maxcharacter: props2.maxcharacter,
              allowInputOverMax: props2.allowInputOverMax,
              onValidate: props2.onValidate
            };
          });
          var _useLengthLimit = useLengthLimit(limitParams), tStatus = _useLengthLimit.tStatus;
          vue.watch(function() {
            return innerValue.value;
          }, function() {
            return adjustTextareaHeight();
          });
          vue.watch(refTextareaElem, function(el) {
            if (!el) return;
            adjustTextareaHeight();
            if (props2.autofocus) {
              el.focus();
            }
          });
          vue.watch(textareaStyle, function(val) {
            var style = attrs.style;
            if (isObject(style)) {
              setStyle(refTextareaElem.value, merge(style, val));
            } else {
              setStyle(refTextareaElem.value, val);
            }
          });
          vue.watch(innerValue, function() {
            vue.nextTick(function() {
              return adjustTextareaHeight();
            });
          });
          vue.watch(function() {
            return props2.autosize;
          }, adjustTextareaHeight, {
            deep: true
          });
          expose({
            focus,
            blur
          });
          vue.onMounted(function() {
            adjustTextareaHeight();
          });
          var renderTNodeJSX = useTNodeJSX();
          return function() {
            var _String;
            var inputEvents = getValidAttrs({
              onFocus: emitFocus,
              onBlur: emitBlur,
              onKeydown: emitKeyDown,
              onKeyup: emitKeyUp,
              onKeypress: emitKeypress
            });
            var _useCommonClassName = useCommonClassName$1(), STATUS = _useCommonClassName.STATUS;
            var classes = vue.computed(function() {
              return ["".concat(name.value, "__inner"), _defineProperty$1(_defineProperty$1(_defineProperty$1(_defineProperty$1(_defineProperty$1({}, "".concat(prefix.value, "-is-").concat(tStatus.value), tStatus.value), STATUS.value.disabled, disabled.value), STATUS.value.focused, focused.value), "".concat(prefix.value, "-resize-none"), _typeof(props2.autosize) === "object"), "".concat(prefix.value, "-hide-scrollbar"), props2.autosize === true)];
            });
            var tips = renderTNodeJSX("tips");
            var textTips = tips && vue.createVNode("div", {
              "class": "".concat(TEXTAREA_TIPS_CLASS.value, " ").concat(name.value, "__tips--").concat(props2.status || "normal")
            }, [tips]);
            var limitText = props2.maxcharacter && vue.createVNode("span", {
              "class": TEXTAREA_LIMIT.value
            }, ["".concat(characterNumber.value, "/").concat(props2.maxcharacter)]) || !props2.maxcharacter && props2.maxlength && vue.createVNode("span", {
              "class": TEXTAREA_LIMIT.value
            }, ["".concat(innerValue.value ? (_String = String(innerValue.value)) === null || _String === void 0 ? void 0 : _String.length : 0, "/").concat(props2.maxlength)]);
            return vue.createVNode("div", vue.mergeProps({
              "class": textareaClasses.value
            }, omit(attrs, ["style"])), [vue.createVNode("textarea", vue.mergeProps({
              "onInput": handleInput,
              "onCompositionstart": onCompositionstart,
              "onCompositionend": onCompositionend,
              "ref": refTextareaElem,
              "value": innerValue.value,
              "class": classes.value
            }, inputEvents, inputAttrs.value), null), textTips || limitText ? vue.createVNode("div", {
              "class": ["".concat(name.value, "__info_wrapper"), _defineProperty$1({}, "".concat(name.value, "__info_wrapper_align"), !textTips)]
            }, [textTips, limitText]) : null]);
          };
        }
      });
      const indexCss$4 = ".t-textarea{font:var(--td-font-body-medium);color:var(--td-text-color-primary);box-sizing:border-box;margin:0;padding:0;list-style:none;position:relative;width:100%}.t-textarea__inner{display:flex;width:100%;height:var(--td-comp-size-xxxl);border:1px solid var(--td-border-level-2-color);border-radius:var(--td-radius-default);padding:calc(calc(var(--td-comp-size-m) - var(--td-line-height-body-medium)) / 2) var(--td-comp-paddingLR-s);background-color:var(--td-bg-color-specialcomponent);font:var(--td-font-body-medium);color:var(--td-text-color-primary);resize:vertical;outline:none;transition:all cubic-bezier(.38,0,.24,1) .2s,height 0s;box-sizing:border-box}@-moz-document url-prefix(){.t-textarea__inner{scrollbar-color:var(--td-scrollbar-color) transparent;scrollbar-width:thin}}.t-textarea__inner::-webkit-scrollbar{width:6px;height:6px}.t-textarea__inner::-webkit-scrollbar-thumb{border:0px solid transparent;background-clip:content-box;background-color:var(--td-scrollbar-color);border-radius:11px}.t-textarea__inner::-webkit-scrollbar-thumb:vertical:hover,.t-textarea__inner::-webkit-scrollbar-thumb:horizontal:hover{background-color:var(--td-scrollbar-hover-color)}.t-textarea__inner:hover{border-color:var(--td-brand-color)}.t-textarea__inner:focus{border-color:var(--td-brand-color);box-shadow:0 0 0 2px var(--td-brand-color-focus)}.t-textarea__inner::placeholder{color:var(--td-text-color-placeholder)}.t-textarea__inner.t-is-success{border-color:var(--td-success-color)}.t-textarea__inner.t-is-success:focus{box-shadow:0 0 0 2px var(--td-success-color-focus)}.t-textarea__inner.t-is-warning{border-color:var(--td-warning-color)}.t-textarea__inner.t-is-warning:focus{box-shadow:0 0 0 2px var(--td-warning-color-focus)}.t-textarea__inner.t-is-error{border-color:var(--td-error-color)}.t-textarea__inner.t-is-error:focus{box-shadow:0 0 0 2px var(--td-error-color-focus)}.t-textarea__info_wrapper{display:flex;column-gap:var(--td-comp-margin-s);justify-content:space-between}.t-textarea__info_wrapper_align{justify-content:end}.t-textarea__limit{font:var(--td-font-body-small);color:var(--td-text-color-placeholder)}.t-textarea .t-is-disabled{color:var(--td-text-color-disabled);background-color:var(--td-bg-color-component-disabled);cursor:not-allowed}.t-textarea .t-is-disabled:hover{border-color:var(--td-border-level-2-color)}.t-textarea .t-is-disabled::placeholder{color:var(--td-text-color-disabled)}.t-textarea .t-resize-none{resize:none}.t-textarea .t-hide-scrollbar{-ms-overflow-style:none}@-moz-document url-prefix(){.t-textarea .t-hide-scrollbar{scrollbar-width:none;overflow:-moz-scrollbars-none}}.t-textarea .t-hide-scrollbar::-webkit-scrollbar{display:none;width:0!important}.t-textarea__tips{height:auto;min-height:var(--td-comp-size-xs);font:var(--td-font-body-small);display:inline-block}.t-textarea__tips--normal{color:var(--td-text-color-placeholder)}.t-textarea__tips--success{color:var(--td-success-color)}.t-textarea__tips--warning{color:var(--td-warning-color)}.t-textarea__tips--error{color:var(--td-error-color)}";
      importCSS(indexCss$4);
      /**
       * tdesign v1.17.1
       * (c) 2025 tdesign
       * @license MIT
       */
      var Textarea = withInstall(_Textarea);
      /**
       * tdesign v1.17.1
       * (c) 2025 tdesign
       * @license MIT
       */
      var props$7 = {
        attach: {
          type: [String, Function]
        },
        body: {
          type: [String, Function]
        },
        cancelBtn: {
          type: [String, Object, Function, null]
        },
        closeBtn: {
          type: [String, Boolean, Function],
          "default": true
        },
        closeOnEscKeydown: {
          type: Boolean,
          "default": void 0
        },
        closeOnOverlayClick: {
          type: Boolean,
          "default": void 0
        },
        confirmBtn: {
          type: [String, Object, Function, null]
        },
        confirmLoading: {
          type: Boolean,
          "default": void 0
        },
        confirmOnEnter: Boolean,
        "default": {
          type: [String, Function]
        },
        destroyOnClose: Boolean,
        dialogClassName: {
          type: String,
          "default": ""
        },
        dialogStyle: {
          type: Object
        },
        draggable: Boolean,
        footer: {
          type: [Boolean, Function],
          "default": true
        },
        header: {
          type: [String, Boolean, Function],
          "default": true
        },
        lazy: Boolean,
        mode: {
          type: String,
          "default": "modal",
          validator: function validator(val) {
            if (!val) return true;
            return ["modal", "modeless", "normal", "full-screen"].includes(val);
          }
        },
        placement: {
          type: String,
          "default": "top",
          validator: function validator(val) {
            if (!val) return true;
            return ["top", "center"].includes(val);
          }
        },
        preventScrollThrough: {
          type: Boolean,
          "default": true
        },
        showInAttachedElement: Boolean,
        showOverlay: {
          type: Boolean,
          "default": true
        },
        theme: {
          type: String,
          "default": "default",
          validator: function validator(val) {
            if (!val) return true;
            return ["default", "info", "warning", "danger", "success"].includes(val);
          }
        },
        top: {
          type: [String, Number]
        },
        visible: Boolean,
        width: {
          type: [String, Number]
        },
        zIndex: {
          type: Number
        },
        onBeforeClose: Function,
        onBeforeOpen: Function,
        onCancel: Function,
        onClose: Function,
        onCloseBtnClick: Function,
        onClosed: Function,
        onConfirm: Function,
        onEscKeydown: Function,
        onOpened: Function,
        onOverlayClick: Function
      };
      const indexCss$3 = "@keyframes tDialogZoomIn{0%{opacity:0;transform:scale(.01)}to{opacity:1}}@keyframes tDialogZoomOut{0%{opacity:1}to{opacity:0;transform:scale(.01)}}@keyframes tDialogMaskIn{0%{opacity:0}to{opacity:1}}@keyframes tDialogMaskOut{0%{opacity:1}to{opacity:0}}.t-dialog-zoom .animation-enter{animation-duration:.2s;animation-fill-mode:both;animation-timing-function:cubic-bezier(0,0,.15,1);animation-play-state:paused}.t-dialog-zoom .animation-exit{animation-duration:.2s;animation-fill-mode:both;animation-timing-function:cubic-bezier(.38,0,.24,1);animation-play-state:paused}.t-dialog-zoom .animation-active{animation-play-state:running;animation-fill-mode:both}.t-dialog-zoom-enter,.t-dialog-zoom-enter-from,.t-dialog-zoom-appear{animation-duration:.2s;animation-fill-mode:both;animation-timing-function:cubic-bezier(0,0,.15,1);animation-play-state:paused}.t-dialog-zoom-exit{animation-duration:.2s;animation-fill-mode:both;animation-timing-function:cubic-bezier(.38,0,.24,1);animation-play-state:paused}.t-dialog-zoom-enter-active,.t-dialog-zoom-appear-active{animation-name:tDialogZoomIn;animation-play-state:running;animation-fill-mode:both}.t-dialog-zoom-exit-active{animation-name:tDialogZoomOut;animation-play-state:running;animation-fill-mode:both}.t-dialog-zoom__vue-enter-active .t-dialog{animation-name:tDialogZoomIn;animation-duration:.2s;animation-fill-mode:both;animation-timing-function:cubic-bezier(0,0,.15,1);animation-play-state:paused}.t-dialog-zoom__vue-enter-active .t-dialog__mask{animation-name:tDialogMaskIn;animation-duration:.2s;animation-timing-function:linear;animation-play-state:running;animation-fill-mode:both}.t-dialog-zoom__vue-leave-active .t-dialog{animation-name:tDialogZoomOut;animation-duration:.2s;animation-fill-mode:both;animation-timing-function:cubic-bezier(.38,0,.24,1);animation-play-state:paused}.t-dialog-zoom__vue-leave-active .t-dialog__mask{animation-name:tDialogMaskOut;animation-duration:.2s;animation-timing-function:linear;animation-play-state:running;animation-fill-mode:both}.t-dialog-zoom__vue-enter-to .t-dialog,.t-dialog-zoom__vue-leave-to .t-dialog{animation-play-state:running;animation-fill-mode:both}.t-dialog-fade-enter,.t-dialog-fade-appear{opacity:0;animation-duration:.2s;animation-fill-mode:both;animation-timing-function:cubic-bezier(0,0,.15,1);animation-play-state:paused}.t-dialog-fade-exit{animation-duration:.2s;animation-fill-mode:both;animation-timing-function:cubic-bezier(0,0,.15,1);animation-play-state:paused}.t-dialog-fade-enter.t-dialog-fade-enter-active,.t-dialog-fade-appear.t-dialog-fade-appear-active{animation-name:tDialogFadeIn;animation-play-state:running}.t-dialog-fade-exit.t-dialog-fade-exit-active{animation-name:tDialogFadeOut;animation-play-state:running}@keyframes tDialogFadeIn{0%{opacity:0}to{opacity:1}}@keyframes tDialogFadeOut{0%{opacity:1}to{opacity:0}}.t-dialog{font:var(--td-font-body-medium);color:var(--td-text-color-primary);box-sizing:border-box;margin:0;padding:0;list-style:none;width:480px;background-color:var(--td-bg-color-container);position:relative;border:1px solid var(--td-border-level-1-color);border-radius:var(--td-radius-large)}.t-dialog .t-icon.t-is-info{color:var(--td-brand-color)}.t-dialog .t-icon.t-is-success{color:var(--td-success-color)}.t-dialog .t-icon.t-is-warning{color:var(--td-warning-color)}.t-dialog .t-icon.t-is-error{color:var(--td-error-color)}.t-dialog--lock{overflow:hidden}.t-dialog__header{color:var(--td-text-color-primary);font:var(--td-font-title-medium);font-weight:600;display:flex;align-items:center;word-break:break-word;gap:var(--td-comp-margin-s);box-sizing:border-box}.t-dialog__header .t-dialog__header-content{display:flex;align-items:flex-start;width:100%}.t-dialog__header .t-icon:not(.t-icon-close){font-size:calc(var(--td-font-size-body-large) + 8px);display:inline-flex;align-items:center;margin-right:var(--td-comp-margin-s);flex-shrink:0}.t-dialog__header--fullscreen{background-color:var(--td-bg-color-secondarycontainer);min-height:var(--td-comp-size-xxxl);justify-content:flex-end;display:flex;align-items:center;flex-direction:row;padding:0 var(--td-comp-paddingLR-xxl)}.t-dialog__header--fullscreen .t-dialog__header-content{box-sizing:border-box;display:flex;justify-content:center;align-items:center}.t-dialog__body{color:var(--td-text-color-secondary);font:var(--td-font-body-medium);overflow:auto;padding:var(--td-comp-paddingTB-l) 0;word-break:break-word}@-moz-document url-prefix(){.t-dialog__body{scrollbar-color:var(--td-scrollbar-color) transparent;scrollbar-width:thin}}.t-dialog__body::-webkit-scrollbar{width:6px;height:6px}.t-dialog__body::-webkit-scrollbar-thumb{border:0px solid transparent;background-clip:content-box;background-color:var(--td-scrollbar-color);border-radius:11px}.t-dialog__body::-webkit-scrollbar-thumb:vertical:hover,.t-dialog__body::-webkit-scrollbar-thumb:horizontal:hover{background-color:var(--td-scrollbar-hover-color)}.t-dialog__body__icon,.t-dialog__body--icon{padding:var(--td-comp-paddingTB-l) 0}.t-dialog__body--fullscreen{box-sizing:border-box;padding:var(--td-comp-paddingTB-xl) var(--td-comp-paddingLR-xxl);height:calc(100% - var(--td-comp-size-xxxl) - var(--td-comp-size-xxxxl));overflow:auto}@-moz-document url-prefix(){.t-dialog__body--fullscreen{scrollbar-color:var(--td-scrollbar-color) transparent;scrollbar-width:thin}}.t-dialog__body--fullscreen::-webkit-scrollbar{width:6px;height:6px}.t-dialog__body--fullscreen::-webkit-scrollbar-thumb{border:0px solid transparent;background-clip:content-box;background-color:var(--td-scrollbar-color);border-radius:11px}.t-dialog__body--fullscreen::-webkit-scrollbar-thumb:vertical:hover,.t-dialog__body--fullscreen::-webkit-scrollbar-thumb:horizontal:hover{background-color:var(--td-scrollbar-hover-color)}.t-dialog__body--fullscreen--without-footer{box-sizing:border-box;padding:var(--td-comp-paddingTB-xl) var(--td-comp-paddingLR-xxl);height:calc(100% - var(--td-comp-size-xxxl));overflow:auto}.t-dialog__footer{width:100%;text-align:right;padding:var(--td-comp-paddingTB-l) 0 0}.t-dialog__footer .t-button+.t-button{margin-left:var(--td-comp-margin-s)}.t-dialog__footer--fullscreen{min-height:var(--td-comp-size-xxxxl);padding:0 var(--td-comp-paddingLR-xxl) var(--td-comp-paddingTB-xxl);box-sizing:border-box}.t-dialog--default{padding:var(--td-comp-paddingTB-xxl) var(--td-comp-paddingLR-xxl)}.t-dialog__close{font-size:calc(var(--td-font-size-body-large) + 4px);color:var(--td-text-color-secondary);display:flex;width:calc(var(--td-font-size-body-large) + 4px);height:calc(var(--td-font-size-body-large) + 4px);align-items:center;border-radius:var(--td-radius-default);transition:all .2s linear;padding:var(--td-comp-paddingTB-xxs) var(--td-comp-paddingLR-xxs)}.t-dialog__close:hover{cursor:pointer;background:var(--td-bg-color-container-hover)}.t-dialog__close:active{background:var(--td-bg-color-container-active)}.t-dialog__close--fullscreen{display:flex;background:transparent}.t-dialog__close--fullscreen:hover{cursor:pointer;background:var(--td-bg-color-secondarycontainer-hover)}.t-dialog__close--fullscreen:active{background:var(--td-bg-color-secondarycontainer-active)}.t-dialog.t-dialog--draggable:hover{cursor:move}.t-dialog.t-dialog--draggable .t-dialog__header:hover,.t-dialog.t-dialog--draggable .t-dialog__body:hover,.t-dialog.t-dialog--draggable .t-dialog__footer:hover{cursor:auto}.t-dialog__fullscreen{width:100%;border-radius:0}.t-dialog__ctx{pointer-events:auto;outline:none;top:0;left:0;width:100%;height:100%}.t-dialog__ctx.t-dialog__ctx--modeless{pointer-events:none}.t-dialog__ctx.t-dialog__ctx--fixed{position:fixed;z-index:2500}.t-dialog__ctx.t-dialog__ctx--absolute,.t-dialog__ctx.t-dialog__ctx--absolute .t-dialog__mask,.t-dialog__ctx.t-dialog__ctx--absolute .t-dialog__wrap{position:absolute}.t-dialog__ctx.t-is-visible{visibility:visible}.t-dialog__ctx.t-is-hidden{visibility:hidden}.t-dialog__ctx.t-is-display{display:block}.t-dialog__ctx.t-not-display{display:none}.t-dialog__ctx .t-dialog__mask{position:fixed;top:0;left:0;width:100%;height:100%;z-index:1;background:var(--td-mask-active);pointer-events:auto}.t-dialog__ctx .t-dialog__wrap{position:fixed;top:0;left:0;width:100%;height:100%;z-index:1;overflow:auto}@-moz-document url-prefix(){.t-dialog__ctx .t-dialog__wrap{scrollbar-color:var(--td-scrollbar-color) transparent;scrollbar-width:thin}}.t-dialog__ctx .t-dialog__wrap::-webkit-scrollbar{width:8px;height:8px}.t-dialog__ctx .t-dialog__wrap::-webkit-scrollbar-thumb{border:2px solid transparent;background-clip:content-box;background-color:var(--td-scrollbar-color);border-radius:15px}.t-dialog__ctx .t-dialog__wrap::-webkit-scrollbar-thumb:vertical:hover,.t-dialog__ctx .t-dialog__wrap::-webkit-scrollbar-thumb:horizontal:hover{background-color:var(--td-scrollbar-hover-color)}.t-dialog__ctx .t-dialog__position{display:flex;justify-content:center;min-height:100%;width:100%;position:relative;padding:48px 0;box-sizing:border-box}.t-dialog__ctx .t-dialog__position.t-dialog--top{align-items:flex-start;padding-top:20vh}.t-dialog__ctx .t-dialog__position.t-dialog--center{align-items:center}.t-dialog__ctx .t-dialog__position_fullscreen{display:flex;justify-content:center;min-height:100%;width:100%;position:relative;box-sizing:border-box}.t-dialog__ctx .t-is-hidden{background:none}.t-dialog__ctx .t-dialog{pointer-events:auto;z-index:2500}.t-dialog__ctx.t-dialog__ctx--modeless .t-dialog{box-shadow:var(--td-shadow-3)}";
      importCSS(indexCss$3);
      /**
       * tdesign v1.17.1
       * (c) 2025 tdesign
       * @license MIT
       */
      function ownKeys$8(e, r) {
        var t2 = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
          var o = Object.getOwnPropertySymbols(e);
          r && (o = o.filter(function(r2) {
            return Object.getOwnPropertyDescriptor(e, r2).enumerable;
          })), t2.push.apply(t2, o);
        }
        return t2;
      }
      function _objectSpread$8(e) {
        for (var r = 1; r < arguments.length; r++) {
          var t2 = null != arguments[r] ? arguments[r] : {};
          r % 2 ? ownKeys$8(Object(t2), true).forEach(function(r2) {
            _defineProperty$1(e, r2, t2[r2]);
          }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t2)) : ownKeys$8(Object(t2)).forEach(function(r2) {
            Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t2, r2));
          });
        }
        return e;
      }
      function useAction(action) {
        var instance = vue.getCurrentInstance();
        var renderTNodeJSX = useTNodeJSX();
        var getDefaultConfirmBtnProps = function getDefaultConfirmBtnProps2(options) {
          var globalConfirm = options.globalConfirm, theme = options.theme, globalConfirmBtnTheme = options.globalConfirmBtnTheme;
          var defaultTheme = getPropertyValFromObj(omit(globalConfirmBtnTheme, ["info"]), theme) || "primary";
          var props2 = {
            theme: defaultTheme,
            size: options.size,
            onClick: function onClick(e) {
              action.confirmBtnAction(e);
            }
          };
          if (isString(globalConfirm)) {
            props2.content = globalConfirm;
          } else if (isObject(globalConfirm)) {
            props2 = _objectSpread$8(_objectSpread$8({}, props2), globalConfirm);
          }
          return props2;
        };
        var getDefaultCancelBtnProps = function getDefaultCancelBtnProps2(options) {
          var globalCancel = options.globalCancel;
          var props2 = {
            theme: "default",
            size: options.size,
            onClick: function onClick(e) {
              action.cancelBtnAction(e);
            }
          };
          if (isString(globalCancel)) {
            props2.content = globalCancel;
          } else if (isObject(globalCancel)) {
            props2 = _objectSpread$8(_objectSpread$8({}, props2), globalCancel);
          }
          return props2;
        };
        var getButtonByProps = function getButtonByProps2(button, params) {
          var defaultButtonProps = params.defaultButtonProps, className = params.className, confirmLoading = params.confirmLoading;
          var newOptions = defaultButtonProps;
          if (isString(button)) {
            newOptions.content = button;
          } else if (isObject(button)) {
            newOptions = _objectSpread$8(_objectSpread$8({}, newOptions), button);
          }
          if (confirmLoading !== void 0) {
            newOptions.loading = confirmLoading;
          }
          return vue.createVNode(Button, vue.mergeProps({
            "class": className
          }, newOptions), null);
        };
        var getConfirmBtn = function getConfirmBtn2(options) {
          var confirmBtn = options.confirmBtn, className = options.className, confirmLoading = options.confirmLoading;
          if (confirmBtn === null) return null;
          if (confirmBtn && instance.slots.confirmBtn) {
            console.warn("Both $props.confirmBtn and $scopedSlots.confirmBtn exist, $props.confirmBtn is preferred.");
          }
          var defaultButtonProps = getDefaultConfirmBtnProps(options);
          if (!confirmBtn && !instance.slots.confirmBtn) {
            return vue.createVNode(Button, vue.mergeProps({
              "class": className,
              "loading": confirmLoading
            }, defaultButtonProps), null);
          }
          if (confirmBtn && ["string", "object"].includes(_typeof(confirmBtn))) {
            return getButtonByProps(confirmBtn, {
              defaultButtonProps,
              className,
              confirmLoading
            });
          }
          return renderTNodeJSX("confirmBtn");
        };
        var getCancelBtn = function getCancelBtn2(options) {
          var cancelBtn = options.cancelBtn, className = options.className;
          if (cancelBtn === null) return null;
          if (cancelBtn && instance.slots.cancelBtn) {
            console.warn("Both $props.cancelBtn and $scopedSlots.cancelBtn exist, $props.cancelBtn is preferred.");
          }
          var defaultButtonProps = getDefaultCancelBtnProps(options);
          if (!cancelBtn && !instance.slots.cancelBtn) {
            return vue.createVNode(Button, vue.mergeProps({
              "class": className
            }, defaultButtonProps), null);
          }
          if (cancelBtn && ["string", "object"].includes(_typeof(cancelBtn))) {
            return getButtonByProps(cancelBtn, {
              defaultButtonProps,
              className
            });
          }
          return renderTNodeJSX("cancelBtn");
        };
        return {
          getConfirmBtn,
          getCancelBtn
        };
      }
      /**
       * tdesign v1.17.1
       * (c) 2025 tdesign
       * @license MIT
       */
      function useSameTarget(handleClick) {
        var MOUSEDOWN_TARGET = false;
        var MOUSEUP_TARGET = false;
        var onClick = function onClick2(e) {
          if (MOUSEDOWN_TARGET && MOUSEUP_TARGET) {
            handleClick === null || handleClick === void 0 || handleClick(e);
          }
          MOUSEDOWN_TARGET = false;
          MOUSEUP_TARGET = false;
        };
        var onMousedown = function onMousedown2(e) {
          MOUSEDOWN_TARGET = e.target === e.currentTarget;
        };
        var onMouseup = function onMouseup2(e) {
          MOUSEUP_TARGET = e.target === e.currentTarget;
        };
        return {
          onClick,
          onMousedown,
          onMouseup
        };
      }
      /**
       * tdesign v1.17.1
       * (c) 2025 tdesign
       * @license MIT
       */
      function getScrollbarWidth() {
        var container = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : document.body;
        if (container === document.body) {
          return window.innerWidth - document.documentElement.clientWidth;
        }
        return container.offsetWidth - container.clientWidth;
      }
      /**
       * tdesign v1.17.1
       * (c) 2025 tdesign
       * @license MIT
       */
      function getCSSValue(v) {
        return Number.isNaN(Number(v)) ? v : "".concat(Number(v), "px");
      }
      function initDragEvent(dragBox) {
        var target = dragBox;
        var windowInnerWidth = window.innerWidth || document.documentElement.clientWidth;
        var windowInnerHeight = window.innerHeight || document.documentElement.clientHeight;
        target.addEventListener("mousedown", function(targetEvent) {
          var disX = targetEvent.clientX - target.offsetLeft;
          var disY = targetEvent.clientY - target.offsetTop;
          var dialogW = target.offsetWidth;
          var dialogH = target.offsetHeight;
          if (dialogW > windowInnerWidth || dialogH > windowInnerHeight) return;
          function mouseMoverHandler(documentEvent) {
            var left2 = documentEvent.clientX - disX;
            var top2 = documentEvent.clientY - disY;
            if (left2 < 0) left2 = 0;
            if (top2 < 0) top2 = 0;
            if (windowInnerWidth - target.offsetWidth - left2 < 0) left2 = windowInnerWidth - target.offsetWidth;
            if (windowInnerHeight - target.offsetHeight - top2 < 0) top2 = windowInnerHeight - target.offsetHeight;
            target.style.position = "absolute";
            target.style.left = "".concat(left2, "px");
            target.style.top = "".concat(top2, "px");
          }
          function mouseUpHandler() {
            document.removeEventListener("mousemove", mouseMoverHandler);
            document.removeEventListener("mouseup", mouseUpHandler);
          }
          document.addEventListener("mousemove", mouseMoverHandler);
          document.addEventListener("mouseup", mouseUpHandler);
          document.addEventListener("dragend", mouseUpHandler);
        });
      }
      /**
       * tdesign v1.17.1
       * (c) 2025 tdesign
       * @license MIT
       */
      var dialogCardProps = {
        body: {
          type: [String, Function]
        },
        cancelBtn: {
          type: [String, Object, Function]
        },
        closeBtn: {
          type: [String, Boolean, Function],
          "default": true
        },
        confirmBtn: {
          type: [String, Object, Function]
        },
        confirmLoading: {
          type: Boolean,
          "default": void 0
        },
        footer: {
          type: [Boolean, Function]
        },
        header: {
          type: [String, Boolean, Function],
          "default": true
        },
        theme: {
          type: String,
          "default": "default",
          validator: function validator(val) {
            if (!val) return true;
            return ["default", "info", "warning", "danger", "success"].includes(val);
          }
        },
        onCancel: Function,
        onCloseBtnClick: Function,
        onConfirm: Function
      };
      /**
       * tdesign v1.17.1
       * (c) 2025 tdesign
       * @license MIT
       */
      function ownKeys$7(e, r) {
        var t2 = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
          var o = Object.getOwnPropertySymbols(e);
          r && (o = o.filter(function(r2) {
            return Object.getOwnPropertyDescriptor(e, r2).enumerable;
          })), t2.push.apply(t2, o);
        }
        return t2;
      }
      function _objectSpread$7(e) {
        for (var r = 1; r < arguments.length; r++) {
          var t2 = null != arguments[r] ? arguments[r] : {};
          r % 2 ? ownKeys$7(Object(t2), true).forEach(function(r2) {
            _defineProperty$1(e, r2, t2[r2]);
          }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t2)) : ownKeys$7(Object(t2)).forEach(function(r2) {
            Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t2, r2));
          });
        }
        return e;
      }
      var _DialogCard = vue.defineComponent({
        name: "TDialogCard",
        directives: {
          draggable: function draggable(el, binding) {
            if (el && binding && binding.value) {
              initDragEvent(el);
            }
          }
        },
        props: _objectSpread$7(_objectSpread$7({}, props$7), dialogCardProps),
        setup: function setup(props2, _ref) {
          var expose = _ref.expose;
          var rootRef = vue.ref(null);
          var COMPONENT_NAME = usePrefixClass("dialog");
          var classPrefix = usePrefixClass();
          var renderTNodeJSX = useTNodeJSX();
          var renderContent = useContent();
          var _useConfig = useConfig("dialog"), globalConfig = _useConfig.globalConfig;
          var _useGlobalIcon = useGlobalIcon({
            CloseIcon: close,
            InfoCircleFilledIcon: infoCircleFilled,
            CheckCircleFilledIcon: checkCircleFilled,
            ErrorCircleFilledIcon: errorCircleFilled
          }), CloseIcon$1 = _useGlobalIcon.CloseIcon, InfoCircleFilledIcon$1 = _useGlobalIcon.InfoCircleFilledIcon, CheckCircleFilledIcon$1 = _useGlobalIcon.CheckCircleFilledIcon, ErrorCircleFilledIcon$1 = _useGlobalIcon.ErrorCircleFilledIcon;
          var _toRefs = vue.toRefs(props2), cancelBtn = _toRefs.cancelBtn, confirmBtn = _toRefs.confirmBtn, confirmLoading = _toRefs.confirmLoading;
          var confirmBtnAction = function confirmBtnAction2(e) {
            var _props$onConfirm;
            return (_props$onConfirm = props2.onConfirm) === null || _props$onConfirm === void 0 ? void 0 : _props$onConfirm.call(props2, {
              e
            });
          };
          var cancelBtnAction = function cancelBtnAction2(e) {
            var _props$onCancel;
            return (_props$onCancel = props2.onCancel) === null || _props$onCancel === void 0 ? void 0 : _props$onCancel.call(props2, {
              e
            });
          };
          var _useAction = useAction({
            confirmBtnAction,
            cancelBtnAction
          }), getConfirmBtn = _useAction.getConfirmBtn, getCancelBtn = _useAction.getCancelBtn;
          var isModeLess = vue.computed(function() {
            return props2.mode === "modeless";
          });
          var isFullScreen = vue.computed(function() {
            return props2.mode === "full-screen";
          });
          var closeBtnAction = function closeBtnAction2(e) {
            var _props$onCloseBtnClic;
            return props2 === null || props2 === void 0 || (_props$onCloseBtnClic = props2.onCloseBtnClick) === null || _props$onCloseBtnClic === void 0 ? void 0 : _props$onCloseBtnClic.call(props2, {
              e
            });
          };
          var onStopDown = function onStopDown2(e) {
            if (isModeLess.value && props2 !== null && props2 !== void 0 && props2.draggable) e.stopPropagation();
          };
          var resetPosition = function resetPosition2() {
            if (!rootRef.value && isModeLess.value && props2.draggable) return;
            rootRef.value.style.position = "relative";
            rootRef.value.style.left = "unset";
            rootRef.value.style.top = "unset";
          };
          expose({
            $el: rootRef,
            resetPosition
          });
          var dialogClass = vue.computed(function() {
            var dialogClass2 = ["".concat(COMPONENT_NAME.value), "".concat(COMPONENT_NAME.value, "__modal-").concat(props2.theme), isModeLess.value && props2.draggable && "".concat(COMPONENT_NAME.value, "--draggable"), props2.dialogClassName];
            if (isFullScreen.value) {
              dialogClass2.push("".concat(COMPONENT_NAME.value, "__fullscreen"));
            } else {
              dialogClass2.push.apply(dialogClass2, ["".concat(COMPONENT_NAME.value, "--default"), "".concat(COMPONENT_NAME.value, "--").concat(props2.placement)]);
            }
            return dialogClass2;
          });
          var dialogStyle = vue.computed(function() {
            return !isFullScreen.value ? _objectSpread$7({
              width: getCSSValue(props2.width)
            }, props2.dialogStyle) : _objectSpread$7({}, props2.dialogStyle);
          });
          var renderCard = function renderCard2() {
            var confirmBtnLoading = vue.computed(function() {
              var _confirmBtn$value;
              return ((_confirmBtn$value = confirmBtn.value) === null || _confirmBtn$value === void 0 ? void 0 : _confirmBtn$value.loading) || confirmLoading.value;
            });
            var defaultFooter = vue.createVNode("div", null, [getCancelBtn({
              cancelBtn: cancelBtn.value,
              globalCancel: globalConfig.value.cancel,
              className: "".concat(COMPONENT_NAME.value, "__cancel")
            }), getConfirmBtn({
              theme: props2 === null || props2 === void 0 ? void 0 : props2.theme,
              confirmBtn: confirmBtn.value,
              globalConfirm: globalConfig.value.confirm,
              globalConfirmBtnTheme: globalConfig.value.confirmBtnTheme,
              className: "".concat(COMPONENT_NAME.value, "__confirm"),
              confirmLoading: confirmBtnLoading.value
            })]);
            var footerContent = renderTNodeJSX("footer", defaultFooter);
            var renderHeader = function renderHeader2() {
              var _renderTNodeJSX;
              var header = (_renderTNodeJSX = renderTNodeJSX("header", vue.createVNode("h5", {
                "class": "title"
              }, null))) !== null && _renderTNodeJSX !== void 0 ? _renderTNodeJSX : false;
              var headerClassName = isFullScreen.value ? ["".concat(COMPONENT_NAME.value, "__header"), "".concat(COMPONENT_NAME.value, "__header--fullscreen")] : "".concat(COMPONENT_NAME.value, "__header");
              var closeClassName = isFullScreen.value ? ["".concat(COMPONENT_NAME.value, "__close"), "".concat(COMPONENT_NAME.value, "__close--fullscreen")] : "".concat(COMPONENT_NAME.value, "__close");
              var getIcon = function getIcon2() {
                var icon = {
                  info: vue.createVNode(InfoCircleFilledIcon$1, {
                    "class": "".concat(classPrefix.value, "-is-info")
                  }, null),
                  warning: vue.createVNode(ErrorCircleFilledIcon$1, {
                    "class": "".concat(classPrefix.value, "-is-warning")
                  }, null),
                  danger: vue.createVNode(ErrorCircleFilledIcon$1, {
                    "class": "".concat(classPrefix.value, "-is-error")
                  }, null),
                  success: vue.createVNode(CheckCircleFilledIcon$1, {
                    "class": "".concat(classPrefix.value, "-is-success")
                  }, null)
                };
                return icon[props2 === null || props2 === void 0 ? void 0 : props2.theme];
              };
              return (header || (props2 === null || props2 === void 0 ? void 0 : props2.closeBtn)) && vue.createVNode("div", {
                "class": headerClassName,
                "onMousedown": onStopDown
              }, [vue.createVNode("div", {
                "class": "".concat(COMPONENT_NAME.value, "__header-content")
              }, [getIcon(), header]), props2 !== null && props2 !== void 0 && props2.closeBtn ? vue.createVNode("span", {
                "class": closeClassName,
                "onClick": closeBtnAction
              }, [renderTNodeJSX("closeBtn", vue.createVNode(CloseIcon$1, null, null))]) : null]);
            };
            var renderBody = function renderBody2() {
              var body = renderContent("default", "body");
              var bodyClassName = (props2 === null || props2 === void 0 ? void 0 : props2.theme) === "default" ? ["".concat(COMPONENT_NAME.value, "__body")] : ["".concat(COMPONENT_NAME.value, "__body__icon")];
              if (isFullScreen.value && footerContent) {
                bodyClassName.push("".concat(COMPONENT_NAME.value, "__body--fullscreen"));
              } else if (isFullScreen.value) {
                bodyClassName.push("".concat(COMPONENT_NAME.value, "__body--fullscreen--without-footer"));
              }
              return vue.createVNode("div", {
                "class": bodyClassName,
                "onMousedown": onStopDown
              }, [body]);
            };
            var renderFooter = function renderFooter2() {
              var footerClassName = isFullScreen.value ? ["".concat(COMPONENT_NAME.value, "__footer"), "".concat(COMPONENT_NAME.value, "__footer--fullscreen")] : "".concat(COMPONENT_NAME.value, "__footer");
              return footerContent && vue.createVNode("div", {
                "class": footerClassName,
                "onMousedown": onStopDown
              }, [footerContent]);
            };
            return vue.createVNode(vue.Fragment, null, [renderHeader(), renderBody(), !!props2.footer && renderFooter()]);
          };
          return function() {
            return vue.withDirectives(vue.createVNode("div", {
              "key": "dialog",
              "ref": rootRef,
              "class": dialogClass.value,
              "style": dialogStyle.value
            }, [renderCard()]), [[vue.resolveDirective("draggable"), isModeLess.value && props2.draggable]]);
          };
        }
      });
      /**
       * tdesign v1.17.1
       * (c) 2025 tdesign
       * @license MIT
       */
      var _excluded = ["theme", "onConfirm", "onCancel", "onCloseBtnClick"];
      var mousePosition;
      var getClickPosition = function getClickPosition2(e) {
        mousePosition = {
          x: e.clientX,
          y: e.clientY
        };
        setTimeout(function() {
          mousePosition = null;
        }, 100);
      };
      if (typeof window !== "undefined" && window.document && window.document.documentElement) {
        document.documentElement.addEventListener("click", getClickPosition, true);
      }
      var key$1 = 1;
      var _Dialog = vue.defineComponent({
        name: "TDialog",
        inheritAttrs: false,
        props: props$7,
        emits: ["update:visible"],
        setup: function setup(props2, context) {
          var COMPONENT_NAME = usePrefixClass("dialog");
          var classPrefix = usePrefixClass();
          var dialogCardRef = vue.ref(null);
          var _useConfig = useConfig("dialog"), globalConfig = _useConfig.globalConfig;
          var confirmBtnAction = function confirmBtnAction2(context2) {
            var _props2$onConfirm;
            (_props2$onConfirm = props2.onConfirm) === null || _props2$onConfirm === void 0 || _props2$onConfirm.call(props2, context2);
          };
          var cancelBtnAction = function cancelBtnAction2(context2) {
            var _props2$onCancel;
            (_props2$onCancel = props2.onCancel) === null || _props2$onCancel === void 0 || _props2$onCancel.call(props2, context2);
            emitCloseEvent({
              e: context2.e,
              trigger: "cancel"
            });
          };
          var teleportElement = useTeleport(function() {
            return props2.attach;
          });
          useDestroyOnClose();
          var timer = vue.ref();
          var styleEl = vue.ref();
          var isModal = vue.computed(function() {
            return props2.mode === "modal";
          });
          var isModeLess = vue.computed(function() {
            return props2.mode === "modeless";
          });
          var isFullScreen = vue.computed(function() {
            return props2.mode === "full-screen";
          });
          var computedVisible = vue.computed(function() {
            return props2.visible;
          });
          var maskClass = vue.computed(function() {
            return ["".concat(COMPONENT_NAME.value, "__mask"), !props2.showOverlay && "".concat(classPrefix.value, "-is-hidden")];
          });
          var positionClass = vue.computed(function() {
            if (isFullScreen.value) return ["".concat(COMPONENT_NAME.value, "__position_fullscreen")];
            if (isModal.value || isModeLess.value) {
              return ["".concat(COMPONENT_NAME.value, "__position"), !!props2.top && "".concat(COMPONENT_NAME.value, "--top"), "".concat(props2.placement && !props2.top ? "".concat(COMPONENT_NAME.value, "--").concat(props2.placement) : "")];
            }
            return [];
          });
          var wrapClass = vue.computed(function() {
            return isFullScreen.value || isModal.value || isModeLess.value ? ["".concat(COMPONENT_NAME.value, "__wrap")] : null;
          });
          var positionStyle = vue.computed(function() {
            if (isFullScreen.value) return {};
            var top2 = props2.top;
            var topStyle = {};
            if (top2 !== void 0) {
              var topValue = getCSSValue(top2);
              topStyle = {
                paddingTop: topValue
              };
            }
            return topStyle;
          });
          var _usePopupManager = usePopupManager("dialog", {
            visible: computedVisible
          }), isTopInteractivePopup = _usePopupManager.isTopInteractivePopup;
          var isMounted = vue.ref(false);
          vue.watch(function() {
            return props2.visible;
          }, function(value) {
            if (value) {
              var _document$activeEleme;
              isMounted.value = true;
              if (isModal.value && !props2.showInAttachedElement || isFullScreen.value) {
                if (props2.preventScrollThrough) {
                  document.body.appendChild(styleEl.value);
                }
                vue.nextTick(function() {
                  var _dialogCardRef$value;
                  if (mousePosition && (_dialogCardRef$value = dialogCardRef.value) !== null && _dialogCardRef$value !== void 0 && _dialogCardRef$value.$el) {
                    var el = dialogCardRef.value.$el;
                    el.style.transformOrigin = "".concat(mousePosition.x - el.offsetLeft, "px ").concat(mousePosition.y - el.offsetTop, "px");
                  }
                });
              }
              (_document$activeEleme = document.activeElement) === null || _document$activeEleme === void 0 || _document$activeEleme.blur();
            } else {
              clearStyleFunc();
            }
            addKeyboardEvent(value);
          });
          function destroySelf() {
            var _styleEl$value$parent, _styleEl$value$parent2;
            (_styleEl$value$parent = styleEl.value.parentNode) === null || _styleEl$value$parent === void 0 || (_styleEl$value$parent2 = _styleEl$value$parent.removeChild) === null || _styleEl$value$parent2 === void 0 || _styleEl$value$parent2.call(_styleEl$value$parent, styleEl.value);
          }
          function clearStyleFunc() {
            clearTimeout(timer.value);
            timer.value = setTimeout(function() {
              destroySelf();
            }, 150);
          }
          var addKeyboardEvent = function addKeyboardEvent2(status) {
            if (status) {
              document.addEventListener("keydown", keyboardEvent);
              props2.confirmOnEnter && document.addEventListener("keydown", keyboardEnterEvent);
            } else {
              document.removeEventListener("keydown", keyboardEvent);
              props2.confirmOnEnter && document.removeEventListener("keydown", keyboardEnterEvent);
            }
          };
          var keyboardEnterEvent = function keyboardEnterEvent2(e) {
            var eventSrc = e.target;
            if (eventSrc.tagName.toLowerCase() === "input") return;
            var code = e.code;
            if ((code === "Enter" || code === "NumpadEnter") && isTopInteractivePopup()) {
              var _props2$onConfirm2;
              (_props2$onConfirm2 = props2.onConfirm) === null || _props2$onConfirm2 === void 0 || _props2$onConfirm2.call(props2, {
                e
              });
            }
          };
          var keyboardEvent = function keyboardEvent2(e) {
            if (e.code === "Escape" && isTopInteractivePopup()) {
              var _props2$onEscKeydown, _props2$closeOnEscKey;
              (_props2$onEscKeydown = props2.onEscKeydown) === null || _props2$onEscKeydown === void 0 || _props2$onEscKeydown.call(props2, {
                e
              });
              if ((_props2$closeOnEscKey = props2.closeOnEscKeydown) !== null && _props2$closeOnEscKey !== void 0 ? _props2$closeOnEscKey : globalConfig.value.closeOnEscKeydown) {
                emitCloseEvent({
                  e,
                  trigger: "esc"
                });
                e.stopImmediatePropagation();
              }
            }
          };
          var overlayAction = function overlayAction2(e) {
            var _props2$closeOnOverla;
            if (props2.showOverlay && ((_props2$closeOnOverla = props2.closeOnOverlayClick) !== null && _props2$closeOnOverla !== void 0 ? _props2$closeOnOverla : globalConfig.value.closeOnOverlayClick)) {
              var _props2$onOverlayClic;
              (_props2$onOverlayClic = props2.onOverlayClick) === null || _props2$onOverlayClic === void 0 || _props2$onOverlayClic.call(props2, {
                e
              });
              emitCloseEvent({
                e,
                trigger: "overlay"
              });
            }
          };
          var _useSameTarget = useSameTarget(overlayAction), onClick = _useSameTarget.onClick, onMousedown = _useSameTarget.onMousedown, onMouseup = _useSameTarget.onMouseup;
          var closeBtnAction = function closeBtnAction2(context2) {
            var _props2$onCloseBtnCli;
            (_props2$onCloseBtnCli = props2.onCloseBtnClick) === null || _props2$onCloseBtnCli === void 0 || _props2$onCloseBtnCli.call(props2, context2);
            emitCloseEvent({
              trigger: "close-btn",
              e: context2.e
            });
          };
          var beforeEnter = function beforeEnter2() {
            var _props2$onBeforeOpen;
            (_props2$onBeforeOpen = props2.onBeforeOpen) === null || _props2$onBeforeOpen === void 0 || _props2$onBeforeOpen.call(props2);
          };
          var afterEnter = function afterEnter2() {
            var _props2$onOpened;
            (_props2$onOpened = props2.onOpened) === null || _props2$onOpened === void 0 || _props2$onOpened.call(props2);
          };
          var beforeLeave = function beforeLeave2() {
            var _props2$onBeforeClose;
            (_props2$onBeforeClose = props2.onBeforeClose) === null || _props2$onBeforeClose === void 0 || _props2$onBeforeClose.call(props2);
          };
          var afterLeave = function afterLeave2() {
            var _dialogCardRef$value2, _dialogCardRef$value3, _props2$onClosed;
            (_dialogCardRef$value2 = dialogCardRef.value) === null || _dialogCardRef$value2 === void 0 || (_dialogCardRef$value3 = _dialogCardRef$value2.resetPosition) === null || _dialogCardRef$value3 === void 0 || _dialogCardRef$value3.call(_dialogCardRef$value2);
            (_props2$onClosed = props2.onClosed) === null || _props2$onClosed === void 0 || _props2$onClosed.call(props2);
          };
          var emitCloseEvent = function emitCloseEvent2(ctx) {
            var _props2$onClose;
            (_props2$onClose = props2.onClose) === null || _props2$onClose === void 0 || _props2$onClose.call(props2, ctx);
            context.emit("update:visible", false);
          };
          var renderDialog = function renderDialog2() {
            var theme = props2.theme;
            props2.onConfirm;
            props2.onCancel;
            props2.onCloseBtnClick;
            var otherProps = _objectWithoutProperties(props2, _excluded);
            return vue.createVNode("div", {
              "class": wrapClass.value
            }, [vue.createVNode("div", {
              "class": positionClass.value,
              "style": positionStyle.value,
              "onClick": onClick,
              "onMousedown": onMousedown,
              "onMouseup": onMouseup
            }, [vue.createVNode(_DialogCard, vue.mergeProps({
              "ref": dialogCardRef,
              "theme": theme
            }, otherProps, {
              "onConfirm": confirmBtnAction,
              "onCancel": cancelBtnAction,
              "onCloseBtnClick": closeBtnAction
            }), context.slots)])]);
          };
          vue.onMounted(function() {
            var hasScrollBar = document.documentElement.scrollHeight > document.documentElement.clientHeight;
            var scrollWidth = hasScrollBar ? getScrollbarWidth() : 0;
            styleEl.value = document.createElement("style");
            styleEl.value.dataset.id = "td_dialog_".concat(+ new Date(), "_").concat(key$1 += 1);
            styleEl.value.innerHTML = "\n        html body {\n          overflow-y: hidden;\n          width: calc(100% - ".concat(scrollWidth, "px);\n        }\n      ");
          });
          vue.onBeforeUnmount(function() {
            addKeyboardEvent(false);
            destroySelf();
          });
          var shouldRender = vue.computed(function() {
            var destroyOnClose = props2.destroyOnClose, visible = props2.visible, lazy = props2.lazy;
            if (!isMounted.value) {
              return !lazy;
            } else {
              return visible || !destroyOnClose;
            }
          });
          return function() {
            var maskView = (isModal.value || isFullScreen.value) && vue.createVNode("div", {
              "key": "mask",
              "class": maskClass.value
            }, null);
            var dialogView = renderDialog();
            var view = [maskView, dialogView];
            var ctxStyle = {
              zIndex: props2.zIndex
            };
            var ctxClass = ["".concat(COMPONENT_NAME.value, "__ctx"), _defineProperty$1(_defineProperty$1(_defineProperty$1({}, "".concat(COMPONENT_NAME.value, "__ctx--fixed"), isModal.value || isFullScreen.value), "".concat(COMPONENT_NAME.value, "__ctx--absolute"), isModal.value && props2.showInAttachedElement), "".concat(COMPONENT_NAME.value, "__ctx--modeless"), isModeLess.value)];
            return vue.createVNode(vue.Teleport, {
              "disabled": !props2.attach || !teleportElement.value,
              "to": teleportElement.value
            }, {
              "default": function _default() {
                return [vue.createVNode(vue.Transition, {
                  "duration": 300,
                  "name": "".concat(COMPONENT_NAME.value, "-zoom__vue"),
                  "onBeforeEnter": beforeEnter,
                  "onAfterEnter": afterEnter,
                  "onBeforeLeave": beforeLeave,
                  "onAfterLeave": afterLeave
                }, {
                  "default": function _default2() {
                    return [shouldRender.value && vue.withDirectives(vue.createVNode("div", vue.mergeProps({
                      "class": ctxClass,
                      "style": ctxStyle
                    }, context.attrs), [view]), [[vue.vShow, props2.visible]])];
                  }
                })];
              }
            });
          };
        }
      });
      /**
       * tdesign v1.17.1
       * (c) 2025 tdesign
       * @license MIT
       */
      function ownKeys$6(e, r) {
        var t2 = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
          var o = Object.getOwnPropertySymbols(e);
          r && (o = o.filter(function(r2) {
            return Object.getOwnPropertyDescriptor(e, r2).enumerable;
          })), t2.push.apply(t2, o);
        }
        return t2;
      }
      function _objectSpread$6(e) {
        for (var r = 1; r < arguments.length; r++) {
          var t2 = null != arguments[r] ? arguments[r] : {};
          r % 2 ? ownKeys$6(Object(t2), true).forEach(function(r2) {
            _defineProperty$1(e, r2, t2[r2]);
          }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t2)) : ownKeys$6(Object(t2)).forEach(function(r2) {
            Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t2, r2));
          });
        }
        return e;
      }
      var createDialog = function createDialog2(props2, context) {
        var options = _objectSpread$6({}, props2);
        var wrapper = document.createElement("div");
        var visible = vue.ref(false);
        var className = options.className, style = options.style;
        var preClassName = className;
        var updateClassNameStyle = function updateClassNameStyle2(className2, style2) {
          if (className2) {
            if (preClassName && preClassName !== className2) {
              var _wrapper$firstElement;
              (_wrapper$firstElement = wrapper.firstElementChild.classList).remove.apply(_wrapper$firstElement, _toConsumableArray(preClassName.split(" ").map(function(name) {
                return name.trim();
              })));
            }
            className2.split(" ").forEach(function(name) {
              wrapper.firstElementChild.classList.add(name.trim());
            });
          }
          if (style2) {
            wrapper.firstElementChild.style.cssText += style2;
          }
          preClassName = className2;
        };
        function destroySelf() {
          vue.render(null, wrapper);
          wrapper.remove();
        }
        var component = vue.defineComponent({
          setup: function setup(props22, _ref) {
            var expose = _ref.expose;
            var dialogOptions = vue.ref(options);
            vue.onMounted(function() {
              visible.value = true;
              document.activeElement.blur();
              vue.nextTick(function() {
                updateClassNameStyle(className, style);
              });
            });
            var update = function update2(newOptions) {
              dialogOptions.value = _objectSpread$6(_objectSpread$6({}, options), newOptions);
            };
            expose({
              update
            });
            return function() {
              var onClose = options.onClose || function() {
                visible.value = false;
                if (options.destroyOnClose) {
                  setTimeout(function() {
                    destroySelf();
                  }, 300);
                }
              };
              delete options.className;
              delete options.style;
              return vue.h(_Dialog, _objectSpread$6({
                onClose,
                visible: visible.value
              }, dialogOptions.value));
            };
          }
        });
        var dialog = vue.createVNode(component);
        if (context !== null && context !== void 0 ? context : DialogPlugin._context) {
          dialog.appContext = context !== null && context !== void 0 ? context : DialogPlugin._context;
        }
        var container = getAttach(options.attach);
        if (container) {
          container.appendChild(wrapper);
        } else {
          console.error("attach is not exist");
        }
        vue.render(dialog, wrapper);
        var dialogNode = {
          show: function show() {
            visible.value = true;
          },
          hide: function hide2() {
            visible.value = false;
          },
          update: function update(newOptions) {
            dialog.component.exposed.update(omit(newOptions, ["className", "style"]));
            updateClassNameStyle(newOptions.className, newOptions.style);
          },
          destroy: function destroy() {
            visible.value = false;
            setTimeout(function() {
              destroySelf();
            }, 300);
          },
          setConfirmLoading: function setConfirmLoading(val) {
            dialog.component.exposed.update({
              confirmLoading: val
            });
          }
        };
        return dialogNode;
      };
      var confirm = function confirm2(props2, context) {
        return createDialog(props2, context);
      };
      var alert = function alert2(props2, context) {
        var options = _objectSpread$6({}, props2);
        options.cancelBtn = null;
        return createDialog(options, context);
      };
      var extraApi = {
        confirm,
        alert
      };
      var DialogPlugin = createDialog;
      DialogPlugin.install = function(app) {
        app.config.globalProperties.$dialog = createDialog;
        DialogPlugin._context = app._context;
        Object.keys(extraApi).forEach(function(funcName) {
          app.config.globalProperties.$dialog[funcName] = extraApi[funcName];
        });
      };
      Object.keys(extraApi).forEach(function(funcName) {
        DialogPlugin[funcName] = extraApi[funcName];
      });
      /**
       * tdesign v1.17.1
       * (c) 2025 tdesign
       * @license MIT
       */
      var props$6 = {
        action: {
          type: [String, Function]
        },
        content: {
          type: [String, Function]
        },
        "default": {
          type: [String, Function]
        }
      };
      /**
       * tdesign v1.17.1
       * (c) 2025 tdesign
       * @license MIT
       */
      var _ListItem = vue.defineComponent({
        name: "TListItem",
        props: props$6,
        setup: function setup() {
          var COMPONENT_NAME = usePrefixClass("list-item");
          var renderTNodeJSX = useTNodeJSX();
          return function() {
            var propsContent = renderTNodeJSX("content");
            var propsDefaultContent = renderTNodeJSX("default");
            var propsActionContent = renderTNodeJSX("action");
            return vue.createVNode("li", {
              "class": COMPONENT_NAME.value
            }, [vue.createVNode("div", {
              "class": "".concat(COMPONENT_NAME.value, "-main")
            }, [propsDefaultContent || propsContent, propsActionContent && vue.createVNode("li", {
              "class": "".concat(COMPONENT_NAME.value, "__action")
            }, [propsActionContent])])]);
          };
        }
      });
      /**
       * tdesign v1.17.1
       * (c) 2025 tdesign
       * @license MIT
       */
      var props$5 = {
        asyncLoading: {
          type: [String, Function]
        },
        footer: {
          type: [String, Function]
        },
        header: {
          type: [String, Function]
        },
        layout: {
          type: String,
          "default": "horizontal",
          validator: function validator(val) {
            if (!val) return true;
            return ["horizontal", "vertical"].includes(val);
          }
        },
        scroll: {
          type: Object
        },
        size: {
          type: String,
          "default": "medium",
          validator: function validator(val) {
            if (!val) return true;
            return ["small", "medium", "large"].includes(val);
          }
        },
        split: Boolean,
        stripe: Boolean,
        onLoadMore: Function,
        onScroll: Function
      };
      /**
       * tdesign v1.17.1
       * (c) 2025 tdesign
       * @license MIT
       */
      var LOAD_MORE = "load-more";
      var LOADING = "loading";
      /**
       * tdesign v1.17.1
       * (c) 2025 tdesign
       * @license MIT
       */
      function ownKeys$5(e, r) {
        var t2 = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
          var o = Object.getOwnPropertySymbols(e);
          r && (o = o.filter(function(r2) {
            return Object.getOwnPropertyDescriptor(e, r2).enumerable;
          })), t2.push.apply(t2, o);
        }
        return t2;
      }
      function _objectSpread$5(e) {
        for (var r = 1; r < arguments.length; r++) {
          var t2 = null != arguments[r] ? arguments[r] : {};
          r % 2 ? ownKeys$5(Object(t2), true).forEach(function(r2) {
            _defineProperty$1(e, r2, t2[r2]);
          }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t2)) : ownKeys$5(Object(t2)).forEach(function(r2) {
            Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t2, r2));
          });
        }
        return e;
      }
      function _createForOfIteratorHelper(r, e) {
        var t2 = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
        if (!t2) {
          if (Array.isArray(r) || (t2 = _unsupportedIterableToArray(r)) || e) {
            t2 && (r = t2);
            var _n = 0, F = function F2() {
            };
            return { s: F, n: function n() {
              return _n >= r.length ? { done: true } : { done: false, value: r[_n++] };
            }, e: function e2(r2) {
              throw r2;
            }, f: F };
          }
          throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
        }
        var o, a = true, u = false;
        return { s: function s() {
          t2 = t2.call(r);
        }, n: function n() {
          var r2 = t2.next();
          return a = r2.done, r2;
        }, e: function e2(r2) {
          u = true, o = r2;
        }, f: function f() {
          try {
            a || null == t2["return"] || t2["return"]();
          } finally {
            if (u) throw o;
          }
        } };
      }
      function _unsupportedIterableToArray(r, a) {
        if (r) {
          if ("string" == typeof r) return _arrayLikeToArray(r, a);
          var t2 = {}.toString.call(r).slice(8, -1);
          return "Object" === t2 && r.constructor && (t2 = r.constructor.name), "Map" === t2 || "Set" === t2 ? Array.from(r) : "Arguments" === t2 || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t2) ? _arrayLikeToArray(r, a) : void 0;
        }
      }
      function _arrayLikeToArray(r, a) {
        (null == a || a > r.length) && (a = r.length);
        for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
        return n;
      }
      var useListItems = function useListItems2() {
        var getChildComponentSlots = useChildComponentSlots();
        var listItems = vue.computed(function() {
          var computedListItems = [];
          var listItemSlots = getChildComponentSlots("ListItem");
          if (isArray(listItemSlots)) {
            var _iterator = _createForOfIteratorHelper(listItemSlots), _step;
            try {
              for (_iterator.s(); !(_step = _iterator.n()).done; ) {
                var child = _step.value;
                computedListItems.push(_objectSpread$5(_objectSpread$5({}, child.props), {}, {
                  slots: child.children
                }));
              }
            } catch (err) {
              _iterator.e(err);
            } finally {
              _iterator.f();
            }
          }
          return computedListItems;
        });
        return {
          listItems
        };
      };
      /**
       * tdesign v1.17.1
       * (c) 2025 tdesign
       * @license MIT
       */
      function ownKeys$4(e, r) {
        var t2 = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
          var o = Object.getOwnPropertySymbols(e);
          r && (o = o.filter(function(r2) {
            return Object.getOwnPropertyDescriptor(e, r2).enumerable;
          })), t2.push.apply(t2, o);
        }
        return t2;
      }
      function _objectSpread$4(e) {
        for (var r = 1; r < arguments.length; r++) {
          var t2 = null != arguments[r] ? arguments[r] : {};
          r % 2 ? ownKeys$4(Object(t2), true).forEach(function(r2) {
            _defineProperty$1(e, r2, t2[r2]);
          }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t2)) : ownKeys$4(Object(t2)).forEach(function(r2) {
            Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t2, r2));
          });
        }
        return e;
      }
      var useListVirtualScroll = function useListVirtualScroll2(scroll, listRef, listItems) {
        var virtualScrollParams = vue.computed(function() {
          return {
            data: listItems.value,
            scroll
          };
        });
        var virtualConfig = useVirtualScrollNew(listRef, virtualScrollParams);
        var isVirtualScroll = vue.computed(function() {
          return virtualConfig.isVirtualScroll.value;
        });
        var lastScrollY = -1;
        var onInnerVirtualScroll = function onInnerVirtualScroll2(e) {
          var target = e.target || e.srcElement;
          var top2 = target.scrollTop;
          if (lastScrollY !== top2) {
            virtualConfig.isVirtualScroll.value && virtualConfig.handleScroll();
          } else {
            lastScrollY = -1;
          }
          lastScrollY = top2;
        };
        var cursorStyle = vue.computed(function() {
          return {
            position: "absolute",
            width: "1px",
            height: "1px",
            transition: "transform 0.2s",
            transform: "translate(0, ".concat(virtualConfig.scrollHeight.value, "px)"),
            "-ms-transform": "translate(0, ".concat(virtualConfig.scrollHeight.value, "px)"),
            "-moz-transform": "translate(0, ".concat(virtualConfig.scrollHeight.value, "px)"),
            "-webkit-transform": "translate(0, ".concat(virtualConfig.scrollHeight.value, "px)")
          };
        });
        var listStyle = vue.computed(function() {
          return {
            transform: "translate(0, ".concat(virtualConfig.translateY.value, "px)"),
            "-ms-transform": "translate(0, ".concat(virtualConfig.translateY.value, "px)"),
            "-moz-transform": "translate(0, ".concat(virtualConfig.translateY.value, "px)"),
            "-webkit-transform": "translate(0, ".concat(virtualConfig.translateY.value, "px)")
          };
        });
        var handleScrollTo = function handleScrollTo2(params) {
          var index = params.index, key2 = params.key;
          var targetIndex = index === 0 ? index : index !== null && index !== void 0 ? index : Number(key2);
          if (!targetIndex && targetIndex !== 0) {
            log.error("List", "scrollTo: `index` or `key` must exist.");
            return;
          }
          if (targetIndex < 0 || targetIndex >= listItems.value.length) {
            log.error("List", "".concat(targetIndex, " does not exist in data, check `index` or `key` please."));
            return;
          }
          virtualConfig.scrollToElement(_objectSpread$4(_objectSpread$4({}, params), {}, {
            index: targetIndex - 1
          }));
        };
        return {
          virtualConfig,
          cursorStyle,
          listStyle,
          isVirtualScroll,
          onInnerVirtualScroll,
          scrollToElement: handleScrollTo
        };
      };
      const indexCss$2 = '.t-list{font:var(--td-font-body-medium);box-sizing:border-box;margin:0;padding:0;list-style:none;overflow:auto;color:var(--td-text-color-primary);background:var(--td-bg-color-container)}@-moz-document url-prefix(){.t-list{scrollbar-color:var(--td-scrollbar-color) transparent;scrollbar-width:thin}}.t-list::-webkit-scrollbar{width:6px;height:6px}.t-list::-webkit-scrollbar-thumb{border:0px solid transparent;background-clip:content-box;background-color:var(--td-scrollbar-color);border-radius:11px}.t-list::-webkit-scrollbar-thumb:vertical:hover,.t-list::-webkit-scrollbar-thumb:horizontal:hover{background-color:var(--td-scrollbar-hover-color)}.t-list__inner{list-style:none;padding:0;margin:0}.t-list-item{font:var(--td-font-body-medium);padding:var(--td-comp-paddingTB-m) var(--td-comp-paddingLR-l);display:flex;justify-content:space-between;align-items:center;position:relative}.t-list-item:after{content:"";position:absolute;left:0;bottom:0;width:100%;height:1px}.t-list-item-main{display:flex;align-items:center;justify-content:space-between;width:100%;flex:1}.t-list-item__meta{display:flex}.t-list-item__meta-avatar{width:var(--td-comp-size-xxxl);height:var(--td-comp-size-xxxl);border-radius:calc(var(--td-comp-size-xxxl) / 2);overflow:hidden;background:var(--td-bg-color-page);margin-right:var(--td-comp-margin-l);flex-shrink:0}.t-list-item__meta-avatar img{max-width:100%;width:100%;height:100%}.t-list-item__meta-title{padding:0;font:var(--td-font-title-medium);margin:0 0 var(--td-comp-margin-s);color:var(--td-text-color-primary)}.t-list-item__meta-description{margin-right:var(--td-comp-margin-xxl);color:var(--td-text-color-primary)}.t-list-item__action{list-style:none;padding:0;flex-shrink:0}.t-list-item__action>li{display:inline-block}.t-list-item__action>li:not(:last-child){margin-right:var(--td-comp-margin-l)}.t-list-item__action>li .t-icon{color:var(--td-text-color-secondary);font-size:var(--td-comp-size-xxxs)}.t-list-item__action>li .t-icon:hover{color:var(--td-text-color-link);cursor:pointer}.t-list-item__action>li>a{text-decoration:none;color:var(--td-brand-color)}.t-list--split .t-list-item:after{background:var(--td-border-level-1-color)}.t-list--stripe .t-list-item:nth-child(2n){background:var(--td-bg-color-secondarycontainer)}.t-list--vertical-action .t-list-item{flex-direction:column}.t-list.t-size-s .t-list-item{padding:var(--td-comp-paddingTB-s) var(--td-comp-paddingLR-m)}.t-list.t-size-l .t-list-item{padding:var(--td-comp-paddingTB-l) var(--td-comp-paddingLR-xl)}.t-list__header,.t-list__footer{background:var(--td-bg-color-container);padding:var(--td-comp-paddingTB-m) var(--td-comp-paddingLR-l)}.t-list__load{background:var(--td-bg-color-container);text-align:center;line-height:var(--td-line-height-body-medium)}.t-list__load>div{display:flex;align-items:center;justify-content:center}.t-list__load:not(:empty){padding:var(--td-comp-paddingTB-m) var(--td-comp-paddingLR-l)}.t-list__load .t-loading{font-size:var(--td-comp-size-xxxs);margin-right:var(--td-comp-margin-s)}.t-list__load .t-loading.t-is-load-more{cursor:pointer}';
      importCSS(indexCss$2);
      /**
       * tdesign v1.17.1
       * (c) 2025 tdesign
       * @license MIT
       */
      var _List = vue.defineComponent({
        name: "TList",
        props: props$5,
        setup: function setup(props2, _ref) {
          var expose = _ref.expose;
          var listRef = vue.ref();
          var _useConfig = useConfig("list"), globalConfig = _useConfig.globalConfig;
          var COMPONENT_NAME = usePrefixClass("list");
          var _useCommonClassName = useCommonClassName$1(), SIZE = _useCommonClassName.SIZE;
          var renderTNodeJSX = useTNodeJSX();
          var _useListItems = useListItems(), listItems = _useListItems.listItems;
          var _useListVirtualScroll = useListVirtualScroll(props2.scroll, listRef, listItems), virtualConfig = _useListVirtualScroll.virtualConfig, cursorStyle = _useListVirtualScroll.cursorStyle, listStyle = _useListVirtualScroll.listStyle, isVirtualScroll = _useListVirtualScroll.isVirtualScroll, onInnerVirtualScroll = _useListVirtualScroll.onInnerVirtualScroll, scrollToElement = _useListVirtualScroll.scrollToElement;
          var listClass = vue.computed(function() {
            return ["".concat(COMPONENT_NAME.value), SIZE.value[props2.size], _defineProperty$1(_defineProperty$1(_defineProperty$1({}, "".concat(COMPONENT_NAME.value, "--split"), props2.split), "".concat(COMPONENT_NAME.value, "--stripe"), props2.stripe), "".concat(COMPONENT_NAME.value, "--vertical-action"), props2.layout === "vertical")];
          });
          var renderContent = function renderContent2() {
            var propsHeaderContent = renderTNodeJSX("header");
            var propsFooterContent = renderTNodeJSX("footer");
            var isVirtualScroll2 = virtualConfig.isVirtualScroll.value;
            return vue.createVNode(vue.Fragment, null, [propsHeaderContent ? vue.createVNode("div", {
              "class": "".concat(COMPONENT_NAME.value, "__header")
            }, [propsHeaderContent]) : null, isVirtualScroll2 ? vue.createVNode(vue.Fragment, null, [vue.createVNode("div", {
              "style": cursorStyle.value
            }, null), vue.createVNode("ul", {
              "class": "".concat(COMPONENT_NAME.value, "__inner"),
              "style": listStyle.value
            }, [virtualConfig.visibleData.value.map(function(item) {
              return vue.createVNode(vue.Fragment, null, [vue.createVNode(_ListItem, omit(item, "slots"), item.slots)]);
            })])]) : vue.createVNode("ul", {
              "class": "".concat(COMPONENT_NAME.value, "__inner")
            }, [renderTNodeJSX("default")]), propsFooterContent ? vue.createVNode("div", {
              "class": "".concat(COMPONENT_NAME.value, "__footer")
            }, [propsFooterContent]) : null]);
          };
          var handleScroll = function handleScroll2(e) {
            var _props2$onScroll;
            var listElement = e.target;
            var scrollTop = listElement.scrollTop, scrollHeight = listElement.scrollHeight, clientHeight = listElement.clientHeight;
            if (isVirtualScroll.value) onInnerVirtualScroll(e);
            (_props2$onScroll = props2.onScroll) === null || _props2$onScroll === void 0 || _props2$onScroll.call(props2, {
              e,
              scrollTop,
              scrollBottom: scrollHeight - clientHeight - scrollTop
            });
          };
          var loadingClass = vue.computed(function() {
            return isString(props2.asyncLoading) && ["loading", "load-more"].includes(props2.asyncLoading) ? "".concat(COMPONENT_NAME.value, "__load ").concat(COMPONENT_NAME.value, "__load--").concat(props2.asyncLoading) : "".concat(COMPONENT_NAME.value, "__load");
          });
          var renderLoading = function renderLoading2() {
            if (props2.asyncLoading && isString(props2.asyncLoading)) {
              if (props2.asyncLoading === LOADING) {
                return vue.createVNode("div", null, [vue.createVNode(Loading, null, null), vue.createVNode("span", null, [globalConfig.value.loadingText])]);
              }
              if (props2.asyncLoading === LOAD_MORE) {
                return vue.createVNode("span", null, [globalConfig.value.loadingMoreText]);
              }
            }
            return renderTNodeJSX("asyncLoading");
          };
          var handleLoadMore = function handleLoadMore2(e) {
            var _props2$onLoadMore;
            if (isString(props2.asyncLoading) && props2.asyncLoading !== LOAD_MORE) return;
            (_props2$onLoadMore = props2.onLoadMore) === null || _props2$onLoadMore === void 0 || _props2$onLoadMore.call(props2, {
              e
            });
          };
          expose({
            scrollTo: scrollToElement
          });
          return function() {
            var listContent = [renderContent(), vue.createVNode("div", {
              "class": loadingClass.value,
              "onClick": handleLoadMore
            }, [renderLoading()])];
            return vue.createVNode("div", {
              "class": listClass.value,
              "onScroll": handleScroll,
              "ref": listRef,
              "style": isVirtualScroll.value ? "position:relative" : void 0
            }, [listContent]);
          };
        }
      });
      /**
       * tdesign v1.17.1
       * (c) 2025 tdesign
       * @license MIT
       */
      var props$4 = {
        avatar: {
          type: [String, Function]
        },
        description: {
          type: [String, Function]
        },
        image: {
          type: [String, Function]
        },
        title: {
          type: [String, Function]
        }
      };
      /**
       * tdesign v1.17.1
       * (c) 2025 tdesign
       * @license MIT
       */
      var _ListItemMeta = vue.defineComponent({
        name: "TListItemMeta",
        props: props$4,
        setup: function setup(props2, ctx) {
          var COMPONENT_NAME = usePrefixClass("list-item__meta");
          var renderContent = useContent();
          var renderTNodeJSX = useTNodeJSX();
          var renderAvatar = function renderAvatar2() {
            if (props2.avatar || ctx.slots.avatar) {
              console.warn("`avatar` is going to be deprecated, please use `image` instead");
            }
            var thumbnail = renderContent("avatar", "image");
            if (!thumbnail) return;
            if (isString(thumbnail)) {
              return vue.createVNode("div", {
                "class": "".concat(COMPONENT_NAME.value, "-avatar")
              }, [vue.createVNode("img", {
                "src": thumbnail
              }, null)]);
            }
            return vue.createVNode("div", {
              "class": "".concat(COMPONENT_NAME.value, "-avatar")
            }, [thumbnail]);
          };
          return function() {
            var propsTitleContent = renderTNodeJSX("title");
            var propsDescriptionContent = renderTNodeJSX("description");
            var listItemMetaContent = [renderAvatar(), vue.createVNode("div", {
              "class": "".concat(COMPONENT_NAME.value, "-content")
            }, [propsTitleContent && vue.createVNode("h3", {
              "class": "".concat(COMPONENT_NAME.value, "-title")
            }, [propsTitleContent]), propsDescriptionContent && vue.createVNode("p", {
              "class": "".concat(COMPONENT_NAME.value, "-description")
            }, [propsDescriptionContent])])];
            return vue.createVNode("div", {
              "class": COMPONENT_NAME.value
            }, [listItemMetaContent]);
          };
        }
      });
      /**
       * tdesign v1.17.1
       * (c) 2025 tdesign
       * @license MIT
       */
      var List = withInstall(_List);
      var ListItem = withInstall(_ListItem);
      withInstall(_ListItemMeta);
      /**
       * tdesign v1.17.1
       * (c) 2025 tdesign
       * @license MIT
       */
      var props$3 = {
        code: Boolean,
        content: {
          type: [String, Function]
        },
        copyable: {
          type: [Boolean, Object],
          "default": false
        },
        "default": {
          type: [String, Function]
        },
        "delete": Boolean,
        disabled: Boolean,
        ellipsis: {
          type: [Boolean, Object],
          "default": false
        },
        italic: Boolean,
        keyboard: Boolean,
        mark: {
          type: [String, Boolean],
          "default": false
        },
        strong: Boolean,
        theme: {
          type: String,
          validator: function validator(val) {
            if (!val) return true;
            return ["primary", "secondary", "success", "warning", "error"].includes(val);
          }
        },
        underline: Boolean
      };
      /**
       * tdesign v1.17.1
       * (c) 2025 tdesign
       * @license MIT
       */
      var defaultMessage = "Copy to clipboard: #{key}, Enter";
      var format = function format2(message) {
        var copyKey = (/mac os x/i.test(navigator.userAgent) ? "⌘" : "Ctrl") + "+C";
        return message.replace(/#{\s*key\s*}/g, copyKey);
      };
      var deselectCurrent = function deselectCurrent2() {
        var selection = document.getSelection();
        if (!selection.rangeCount) {
          return function() {
          };
        }
        var active = document.activeElement;
        var ranges = [];
        for (var i2 = 0; i2 < selection.rangeCount; i2++) {
          ranges.push(selection.getRangeAt(i2));
        }
        var tagName = active.tagName.toUpperCase();
        switch (tagName) {
          case "INPUT":
          case "TEXTAREA":
            active.blur();
            break;
          default:
            active = null;
            break;
        }
        selection.removeAllRanges();
        return function() {
          selection.type === "Caret" && selection.removeAllRanges();
          if (!selection.rangeCount) {
            ranges.forEach(function(range) {
              selection.addRange(range);
            });
          }
          active && active.focus();
        };
      };
      var copy = function copy2(text, options) {
        var message, reselectPrevious, range, selection, mark, success = false;
        if (!options) {
          options = {};
        }
        try {
          reselectPrevious = deselectCurrent();
          range = document.createRange();
          selection = document.getSelection();
          mark = document.createElement("span");
          mark.textContent = text;
          mark.style.all = "unset";
          mark.style.position = "fixed";
          mark.style.top = "0";
          mark.style.clip = "rect(0, 0, 0, 0)";
          mark.style.whiteSpace = "pre";
          mark.style.webkitUserSelect = "text";
          mark.style.userSelect = "text";
          mark.addEventListener("copy", function(e) {
            e.stopPropagation();
            if (options.format) {
              e.preventDefault();
              e.clipboardData.clearData();
              e.clipboardData.setData(options.format, text);
            }
            if (options.onCopy) {
              e.preventDefault();
              options.onCopy(e.clipboardData);
            }
          });
          document.body.appendChild(mark);
          range.selectNodeContents(mark);
          selection.addRange(range);
          var successful = document.execCommand("copy");
          if (!successful) {
            throw new Error("copy command was unsuccessful");
          }
          success = true;
        } catch (err) {
          try {
            window.clipboardData.setData(options.format || "text", text);
            options.onCopy && options.onCopy(window.clipboardData);
            success = true;
          } catch (err2) {
            message = format("message" in options ? options.message : defaultMessage);
            window.prompt(message, text);
          }
        } finally {
          if (selection) {
            if (typeof selection.removeRange == "function") {
              selection.removeRange(range);
            } else {
              selection.removeAllRanges();
            }
          }
          if (mark) {
            document.body.removeChild(mark);
          }
          reselectPrevious();
        }
        return success;
      };
      /**
       * tdesign v1.17.1
       * (c) 2025 tdesign
       * @license MIT
       */
      var props$2 = {
        content: {
          type: [String, Function]
        },
        "default": {
          type: [String, Function]
        },
        ellipsis: {
          type: [Boolean, Object],
          "default": false
        }
      };
      const indexCss$1 = ".t-typography{color:var(--td-text-color-primary);font:var(--td-font-body-medium);margin:var(--td-comp-margin-m) 0}h1.t-typography{font:var(--td-font-headline-large);margin-top:var(--td-comp-margin-xxxxl);margin-bottom:var(--td-comp-margin-l)}h2.t-typography{font:var(--td-font-headline-medium);margin-top:var(--td-comp-margin-xxxl);margin-bottom:var(--td-comp-margin-l)}h3.t-typography{font:var(--td-font-headline-small);margin-top:var(--td-comp-margin-xxl);margin-bottom:var(--td-comp-margin-m)}h4.t-typography{font:var(--td-font-title-large);margin-top:var(--td-comp-margin-xl);margin-bottom:var(--td-comp-margin-m)}h5.t-typography{font:var(--td-font-title-medium);margin-top:var(--td-comp-margin-l);margin-bottom:var(--td-comp-margin-m)}h6.t-typography{font:var(--td-font-title-small)}.t-typography strong{font-weight:600}.t-typography mark{background-color:#fcdf47}.t-typography code{border-radius:var(--td-radius-default);border:1px solid var(--td-component-border);margin:0 var(--td-comp-margin-xs);background-color:var(--td-bg-color-secondarycontainer);padding:1px var(--td-comp-paddingLR-s);transition:background-color .2s;white-space:nowrap;font:var(--td-font-body-small);font-family:Source Code Pro,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Hiragino Sans GB,Microsoft YaHei UI,Microsoft YaHei;display:inline-block}.t-typography code:hover{border-radius:var(--td-radius-default);border:1px solid var(--td-component-border);background-color:var(--td-bg-color-secondarycontainer-hover)}.t-typography kbd{border-radius:var(--td-radius-default);border:1px solid var(--td-component-border);margin:0 var(--td-comp-margin-xs);background-color:var(--td-bg-color-secondarycontainer);padding:1px var(--td-comp-paddingLR-s);box-shadow:0 1px 0 0 var(--td-component-border);font:var(--td-font-body-small);font-family:Source Code Pro,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Hiragino Sans GB,Microsoft YaHei UI,Microsoft YaHei;display:inline-block}.t-typography--disabled{color:var(--td-text-color-disabled);cursor:not-allowed}.t-typography--success{color:var(--td-success-color)}.t-typography--warning{color:var(--td-warning-color)}.t-typography--error{color:var(--td-error-color)}.t-typography--secondary{color:var(--td-text-color-secondary)}.t-typography-ellipsis-symbol,.t-typography .t-icon-copy{color:var(--td-brand-color);cursor:pointer}.t-typography-ellipsis-symbol:hover,.t-typography .t-icon-copy:hover{color:var(--td-brand-color-hover)}.t-typography .t-icon-checked{color:var(--td-success-color)}";
      importCSS(indexCss$1);
      /**
       * tdesign v1.17.1
       * (c) 2025 tdesign
       * @license MIT
       */
      function ownKeys$3(e, r) {
        var t2 = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
          var o = Object.getOwnPropertySymbols(e);
          r && (o = o.filter(function(r2) {
            return Object.getOwnPropertyDescriptor(e, r2).enumerable;
          })), t2.push.apply(t2, o);
        }
        return t2;
      }
      function _objectSpread$3(e) {
        for (var r = 1; r < arguments.length; r++) {
          var t2 = null != arguments[r] ? arguments[r] : {};
          r % 2 ? ownKeys$3(Object(t2), true).forEach(function(r2) {
            _defineProperty$1(e, r2, t2[r2]);
          }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t2)) : ownKeys$3(Object(t2)).forEach(function(r2) {
            Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t2, r2));
          });
        }
        return e;
      }
      function _isSlot$3(s) {
        return typeof s === "function" || Object.prototype.toString.call(s) === "[object Object]" && !vue.isVNode(s);
      }
      var Ellipsis = vue.defineComponent({
        name: "TEllipsis",
        components: {
          TTooltip: Tooltip
        },
        props: props$2,
        setup: function setup(props2, _ref) {
          var slots = _ref.slots;
          var COMPONENT_NAME = usePrefixClass("typography");
          var _useConfig = useConfig("typography"), globalConfig = _useConfig.globalConfig;
          var content = vue.computed(function() {
            return props2.content || (slots === null || slots === void 0 ? void 0 : slots["default"]());
          });
          var ellipsisState = vue.computed(function() {
            var ellipsis = props2.ellipsis;
            return _objectSpread$3({
              row: 1,
              expandable: false
            }, _typeof(ellipsis) === "object" ? ellipsis : null);
          });
          var ellipsisStyles = vue.computed(function() {
            var ellipsis = ellipsisState.value;
            var def = {
              overflow: props2.ellipsis ? "hidden" : "visible",
              textOverflow: props2.ellipsis ? "ellipsis" : "initial",
              whiteSpace: props2.ellipsis ? "normal" : "nowrap",
              display: "-webkit-box",
              WebkitLineClamp: ellipsis.row,
              WebkitBoxOrient: "vertical"
            };
            if (isExpand.value) {
              def.overflow = "visible";
              def.whiteSpace = "normal";
              def.display = "initial";
            }
            return def;
          });
          var isExpand = vue.ref(false);
          var onExpand = function onExpand2() {
            var _props2$ellipsis$onEx, _props2$ellipsis;
            isExpand.value = true;
            if (_typeof(props2.ellipsis) === "object") (_props2$ellipsis$onEx = (_props2$ellipsis = props2.ellipsis).onExpand) === null || _props2$ellipsis$onEx === void 0 || _props2$ellipsis$onEx.call(_props2$ellipsis, true);
          };
          var onCollapse = function onCollapse2() {
            var _props2$ellipsis$onEx2, _props2$ellipsis2;
            isExpand.value = false;
            if (_typeof(props2.ellipsis) === "object") (_props2$ellipsis$onEx2 = (_props2$ellipsis2 = props2.ellipsis).onExpand) === null || _props2$ellipsis$onEx2 === void 0 || _props2$ellipsis$onEx2.call(_props2$ellipsis2, false);
          };
          var renderEllipsisExpand = function renderEllipsisExpand2() {
            var suffix2 = ellipsisState.value.suffix;
            var moreNode = vue.createVNode("span", {
              "class": "".concat(COMPONENT_NAME.value, "-ellipsis-symbol"),
              "onClick": onExpand,
              "style": "text-decoration:none;white-space:nowrap;flex: 1;"
            }, [suffix2 || globalConfig.value.expandText]);
            var _ellipsisState$value = ellipsisState.value, tooltipProps = _ellipsisState$value.tooltipProps, expandable = _ellipsisState$value.expandable, collapsible = _ellipsisState$value.collapsible;
            if (!isExpand.value && expandable) {
              return tooltipProps && tooltipProps.content ? vue.createVNode(Tooltip, vue.mergeProps(tooltipProps, {
                "content": tooltipProps.content
              }), _isSlot$3(moreNode) ? moreNode : {
                "default": function _default() {
                  return [moreNode];
                }
              }) : moreNode;
            }
            if (expandable && isExpand.value && collapsible) {
              return vue.createVNode("span", {
                "class": "".concat(COMPONENT_NAME.value, "-ellipsis-symbol"),
                "onClick": onCollapse,
                "style": "text-decoration:none;white-space:nowrap;flex: 1;"
              }, [globalConfig.value.collapseText]);
            }
          };
          return function() {
            var tooltipProps = ellipsisState.value.tooltipProps;
            return vue.createVNode("div", {
              "style": {
                display: "flex",
                alignItems: "flex-end"
              }
            }, [tooltipProps && vue.createVNode(Tooltip, {
              "content": tooltipProps.content,
              "placement": "top-right"
            }, null), vue.createVNode("p", {
              "style": props2.ellipsis ? ellipsisStyles.value : {}
            }, [content.value]), renderEllipsisExpand()]);
          };
        }
      });
      /**
       * tdesign v1.17.1
       * (c) 2025 tdesign
       * @license MIT
       */
      function _isSlot$2(s) {
        return typeof s === "function" || Object.prototype.toString.call(s) === "[object Object]" && !vue.isVNode(s);
      }
      var _Text = vue.defineComponent({
        name: "TTypographyText",
        props: props$3,
        setup: function setup(props2, _ref) {
          var slots = _ref.slots;
          var COMPONENT_NAME = usePrefixClass("typography");
          var _useConfig = useConfig("typography"), globalConfig = _useConfig.globalConfig;
          var isCopied = vue.ref(false);
          var renderContent = useContent();
          var wrapperDecorations = function wrapperDecorations2(_ref2, content2) {
            var code = _ref2.code, underline = _ref2.underline, del = _ref2["delete"], strong = _ref2.strong, keyboard = _ref2.keyboard, mark = _ref2.mark, italic = _ref2.italic;
            var currentContent = content2;
            function wrap(needed, Tag) {
              var styles = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
              if (!needed) return;
              var _currentContent = (function() {
                return currentContent;
              })();
              currentContent = vue.createVNode(Tag, {
                "style": styles
              }, _isSlot$2(currentContent) ? currentContent : {
                "default": function _default() {
                  return [_currentContent];
                }
              });
            }
            wrap(strong, "strong");
            wrap(underline, "u");
            wrap(del, "del");
            wrap(code, "code");
            wrap(mark !== false, "mark", mark ? {
              backgroundColor: mark
            } : {});
            wrap(keyboard, "kbd");
            wrap(italic, "i");
            return currentContent;
          };
          var classList = vue.computed(function() {
            var theme = props2.theme, disabled = props2.disabled;
            var prefix = COMPONENT_NAME.value;
            var list = [prefix];
            if (disabled) {
              list.push("".concat(prefix, "--disabled"));
            } else if (theme && ["primary", "secondary", "success", "warning", "error"].includes(theme)) {
              list.push("".concat(prefix, "--").concat(theme));
            }
            return list;
          });
          var tooltipText = vue.computed(function() {
            var _copyable$tooltipProp;
            var copyable = props2.copyable;
            if (isCopied.value) return globalConfig.value.copiedText;
            else if (_typeof(copyable) === "object") return (_copyable$tooltipProp = copyable.tooltipProps) === null || _copyable$tooltipProp === void 0 ? void 0 : _copyable$tooltipProp.content;
            return null;
          });
          var content = vue.computed(function() {
            return props2.content || (slots === null || slots === void 0 ? void 0 : slots["default"]());
          });
          var renderCopy = function renderCopy2() {
            var copyable = props2.copyable;
            var icon = isCopied.value ? function() {
              return vue.createVNode(check, null, null);
            } : function() {
              return vue.createVNode(copy$1, null, null);
            };
            var tooltipConf = {
              theme: "default"
            };
            var onCopy = function onCopy2() {
            };
            if (_typeof(copyable) === "object") {
              if (copyable.suffix && !isCopied.value) {
                icon = copyable.suffix;
              }
              if (copyable.tooltipProps) {
                tooltipConf = copyable.tooltipProps;
              }
              if (typeof copyable.onCopy === "function") {
                onCopy = copyable.onCopy;
              }
            }
            return vue.createVNode(Tooltip, vue.mergeProps(tooltipConf, {
              "content": tooltipText.value
            }), {
              "default": function _default() {
                return [vue.createVNode(Button, {
                  "icon": icon,
                  "shape": "square",
                  "theme": "primary",
                  "variant": "text",
                  "onClick": function onClick(e) {
                    return onCopyClick(e, onCopy);
                  }
                }, null)];
              }
            });
          };
          var getChildrenText = function getChildrenText2() {
            var copyable = props2.copyable;
            if (_typeof(copyable) === "object" && copyable !== null && copyable !== void 0 && copyable.text) {
              return copyable.text;
            }
            if (typeof content.value === "string") {
              return content.value;
            } else if (Array.isArray(content.value)) {
              return content.value.map(function(v) {
                return v.children;
              }).join("");
            }
          };
          var onCopyClick = function onCopyClick2(e, cb) {
            e.preventDefault();
            e.stopPropagation();
            isCopied.value = true;
            setTimeout(function() {
              isCopied.value = false;
            }, 1500);
            copy(getChildrenText());
            cb === null || cb === void 0 || cb();
          };
          return function() {
            var content2 = renderContent("default", "content");
            return props2.ellipsis ? vue.createVNode(Ellipsis, vue.mergeProps(props2, {
              "class": classList.value
            }), {
              "default": function _default() {
                return [wrapperDecorations(props2, content2), props2.copyable ? renderCopy() : null];
              }
            }) : vue.createVNode("span", {
              "class": classList.value
            }, [wrapperDecorations(props2, content2), props2.copyable ? renderCopy() : null]);
          };
        }
      });
      /**
       * tdesign v1.17.1
       * (c) 2025 tdesign
       * @license MIT
       */
      function _isSlot$1(s) {
        return typeof s === "function" || Object.prototype.toString.call(s) === "[object Object]" && !vue.isVNode(s);
      }
      var _Typography = vue.defineComponent({
        name: "TTypography",
        setup: function setup() {
          var renderTNodeJSX = useTNodeJSX();
          return function() {
            var _slot;
            return vue.createVNode(_Text, null, _isSlot$1(_slot = renderTNodeJSX("default")) ? _slot : {
              "default": function _default() {
                return [_slot];
              }
            });
          };
        }
      });
      /**
       * tdesign v1.17.1
       * (c) 2025 tdesign
       * @license MIT
       */
      var props$1 = {
        content: {
          type: [String, Function]
        },
        "default": {
          type: [String, Function]
        },
        ellipsis: {
          type: [Boolean, Object],
          "default": false
        },
        level: {
          type: String,
          "default": "h1",
          validator: function validator(val) {
            if (!val) return true;
            return ["h1", "h2", "h3", "h4", "h5", "h6"].includes(val);
          }
        }
      };
      /**
       * tdesign v1.17.1
       * (c) 2025 tdesign
       * @license MIT
       */
      function ownKeys$2(e, r) {
        var t2 = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
          var o = Object.getOwnPropertySymbols(e);
          r && (o = o.filter(function(r2) {
            return Object.getOwnPropertyDescriptor(e, r2).enumerable;
          })), t2.push.apply(t2, o);
        }
        return t2;
      }
      function _objectSpread$2(e) {
        for (var r = 1; r < arguments.length; r++) {
          var t2 = null != arguments[r] ? arguments[r] : {};
          r % 2 ? ownKeys$2(Object(t2), true).forEach(function(r2) {
            _defineProperty$1(e, r2, t2[r2]);
          }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t2)) : ownKeys$2(Object(t2)).forEach(function(r2) {
            Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t2, r2));
          });
        }
        return e;
      }
      function _isSlot(s) {
        return typeof s === "function" || Object.prototype.toString.call(s) === "[object Object]" && !vue.isVNode(s);
      }
      var _Title = vue.defineComponent({
        name: "TTypographyTitle",
        props: props$1,
        setup: function setup(props2, _ref) {
          var attrs = _ref.attrs;
          var COMPONENT_NAME = usePrefixClass("typography");
          var renderContent = useContent();
          return function() {
            var _slot;
            var Tag = props2.level;
            var content = renderContent("default", "content");
            return props2.ellipsis ? vue.createVNode(Ellipsis, vue.mergeProps(props2, {
              "class": COMPONENT_NAME.value
            }), _isSlot(_slot = vue.h.apply(void 0, [Tag].concat(_toConsumableArray(content)))) ? _slot : {
              "default": function _default() {
                return [_slot];
              }
            }) : vue.createVNode(vue.Fragment, null, [vue.h.apply(void 0, [Tag, _objectSpread$2(_objectSpread$2({}, attrs), {}, {
              "class": [COMPONENT_NAME.value, attrs["class"]]
            })].concat(_toConsumableArray(content)))]);
          };
        }
      });
      /**
       * tdesign v1.17.1
       * (c) 2025 tdesign
       * @license MIT
       */
      function ownKeys$1(e, r) {
        var t2 = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
          var o = Object.getOwnPropertySymbols(e);
          r && (o = o.filter(function(r2) {
            return Object.getOwnPropertyDescriptor(e, r2).enumerable;
          })), t2.push.apply(t2, o);
        }
        return t2;
      }
      function _objectSpread$1(e) {
        for (var r = 1; r < arguments.length; r++) {
          var t2 = null != arguments[r] ? arguments[r] : {};
          r % 2 ? ownKeys$1(Object(t2), true).forEach(function(r2) {
            _defineProperty$1(e, r2, t2[r2]);
          }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t2)) : ownKeys$1(Object(t2)).forEach(function(r2) {
            Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t2, r2));
          });
        }
        return e;
      }
      var _Paragraph = vue.defineComponent({
        name: "TTypographyParagraph",
        props: _objectSpread$1({
          style: {
            type: Object,
            "default": function _default() {
              return {};
            }
          }
        }, props$2),
        setup: function setup(props2, _ref) {
          var slots = _ref.slots;
          var COMPONENT_NAME = usePrefixClass("typography");
          var content = vue.computed(function() {
            return props2.content || (slots === null || slots === void 0 ? void 0 : slots["default"]());
          });
          return function() {
            return props2.ellipsis ? vue.createVNode(Ellipsis, vue.mergeProps(props2, {
              "class": COMPONENT_NAME.value
            }), {
              "default": function _default() {
                return [content.value];
              }
            }) : vue.createVNode("p", {
              "class": COMPONENT_NAME.value
            }, [content.value]);
          };
        }
      });
      /**
       * tdesign v1.17.1
       * (c) 2025 tdesign
       * @license MIT
       */
      withInstall(_Typography);
      withInstall(_Text);
      var Title = withInstall(_Title);
      withInstall(_Paragraph);
      /**
       * tdesign v1.17.1
       * (c) 2025 tdesign
       * @license MIT
       */
      var props = {
        attach: {
          type: [String, Function]
        },
        body: {
          type: [String, Function]
        },
        cancelBtn: {
          type: [String, Object, Function]
        },
        closeBtn: {
          type: [String, Boolean, Function]
        },
        closeOnEscKeydown: {
          type: Boolean,
          "default": void 0
        },
        closeOnOverlayClick: {
          type: Boolean,
          "default": void 0
        },
        confirmBtn: {
          type: [String, Object, Function]
        },
        "default": {
          type: [String, Function]
        },
        destroyOnClose: Boolean,
        drawerClassName: {
          type: String,
          "default": ""
        },
        footer: {
          type: [Boolean, Function],
          "default": true
        },
        header: {
          type: [String, Boolean, Function],
          "default": true
        },
        lazy: Boolean,
        mode: {
          type: String,
          "default": "overlay",
          validator: function validator(val) {
            if (!val) return true;
            return ["overlay", "push"].includes(val);
          }
        },
        placement: {
          type: String,
          "default": "right",
          validator: function validator(val) {
            if (!val) return true;
            return ["left", "right", "top", "bottom"].includes(val);
          }
        },
        preventScrollThrough: {
          type: Boolean,
          "default": true
        },
        showInAttachedElement: Boolean,
        showOverlay: {
          type: Boolean,
          "default": true
        },
        size: {
          type: String,
          "default": void 0
        },
        sizeDraggable: {
          type: [Boolean, Object],
          "default": false
        },
        visible: Boolean,
        zIndex: {
          type: Number
        },
        onBeforeClose: Function,
        onBeforeOpen: Function,
        onCancel: Function,
        onClose: Function,
        onCloseBtnClick: Function,
        onConfirm: Function,
        onEscKeydown: Function,
        onOverlayClick: Function,
        onSizeDragEnd: Function
      };
      /**
       * tdesign v1.17.1
       * (c) 2025 tdesign
       * @license MIT
       */
      function getSizeDraggable(sizeDraggable, limit) {
        if (typeof sizeDraggable === "boolean") {
          return {
            allowSizeDraggable: sizeDraggable,
            max: limit.max,
            min: limit.min
          };
        }
        return {
          allowSizeDraggable: true,
          max: sizeDraggable.max,
          min: sizeDraggable.min
        };
      }
      function calcSizeRange(size, min2, max2) {
        return Math.min(Math.max(size, min2), max2);
      }
      function calcMoveSize(placement, opts) {
        var x = opts.x, y = opts.y, max2 = opts.max, min2 = opts.min, maxWidth = opts.maxWidth, maxHeight = opts.maxHeight;
        var moveSize;
        switch (placement) {
          case "right":
            moveSize = calcSizeRange(maxWidth - x, min2, max2);
            break;
          case "left":
            moveSize = calcSizeRange(x, min2, max2);
            break;
          case "top":
            moveSize = calcSizeRange(y, min2, max2);
            break;
          case "bottom":
            moveSize = calcSizeRange(maxHeight - y, min2, max2);
            break;
          default:
            return moveSize;
        }
        return moveSize;
      }
      var useDrag = function useDrag2(props2) {
        var isSizeDragging = vue.ref(false);
        var draggedSizeValue = vue.ref(null);
        var enableDrag = function enableDrag2(e) {
          e.stopPropagation();
          document.addEventListener("mouseup", _handleMouseup, true);
          document.addEventListener("mousemove", handleMousemove, true);
          isSizeDragging.value = true;
        };
        var _handleMouseup = function handleMouseup() {
          document.removeEventListener("mouseup", _handleMouseup, true);
          document.removeEventListener("mousemove", handleMousemove, true);
          isSizeDragging.value = false;
        };
        var handleMousemove = function handleMousemove2(e) {
          var _props$onSizeDragEnd;
          var x = e.x, y = e.y;
          var maxHeight = document.documentElement.clientHeight;
          var maxWidth = document.documentElement.clientWidth;
          var offsetHeight = 8;
          var offsetWidth = 8;
          var max2 = props2.placement === "left" || props2.placement === "right" ? maxWidth : maxHeight;
          var min2 = props2.placement === "left" || props2.placement === "right" ? offsetWidth : offsetHeight;
          var _getSizeDraggable = getSizeDraggable(props2.sizeDraggable, {
            max: max2,
            min: min2
          }), allowSizeDraggable = _getSizeDraggable.allowSizeDraggable, limitMax = _getSizeDraggable.max, limitMin = _getSizeDraggable.min;
          if (!allowSizeDraggable || !isSizeDragging.value) return;
          var moveSize = calcMoveSize(props2.placement, {
            x,
            y,
            maxWidth,
            maxHeight,
            max: limitMax,
            min: limitMin
          });
          if (typeof moveSize === "undefined") return;
          draggedSizeValue.value = "".concat(moveSize, "px");
          (_props$onSizeDragEnd = props2.onSizeDragEnd) === null || _props$onSizeDragEnd === void 0 || _props$onSizeDragEnd.call(props2, {
            e,
            size: moveSize
          });
        };
        var draggableLineStyles = vue.computed(function() {
          var isHorizontal = ["right", "left"].includes(props2.placement);
          var oppositeMap = {
            left: "right",
            right: "left",
            top: "bottom",
            bottom: "top"
          };
          return _defineProperty$1(_defineProperty$1(_defineProperty$1(_defineProperty$1({
            zIndex: 1,
            position: "absolute",
            background: "transparent"
          }, oppositeMap[props2.placement], 0), "width", isHorizontal ? "16px" : "100%"), "height", isHorizontal ? "100%" : "16px"), "cursor", isHorizontal ? "col-resize" : "row-resize");
        });
        var draggingStyles = vue.computed(function() {
          return isSizeDragging.value ? {
            userSelect: "none"
          } : {};
        });
        return {
          draggedSizeValue,
          enableDrag,
          draggableLineStyles,
          draggingStyles
        };
      };
      const indexCss = '.t-drawer-fade-enter,.t-drawer-fade-appear{opacity:0;animation-duration:.2s;animation-fill-mode:both;animation-timing-function:linear;animation-play-state:paused}.t-drawer-fade-exit{animation-duration:.2s;animation-fill-mode:both;animation-timing-function:linear;animation-play-state:paused}.t-drawer-fade-enter.t-drawer-fade-enter-active,.t-drawer-fade-enter.t-drawer-fade-enter-active.t-drawer-fade-enter-to,.t-drawer-fade-appear.t-drawer-fade-appear-active,.t-drawer-fade-appear.t-drawer-fade-appear-active.t-drawer-fade-appear-to{animation-name:tDrawerFadeIn;animation-duration:.2s;animation-play-state:running}.t-drawer-fade-exit.t-drawer-fade-exit-active,.t-drawer-fade-leave-active.t-drawer-fade-leave-to{animation-name:tDrawerFadeOut;animation-duration:.2s;animation-play-state:running}@keyframes tDrawerFadeIn{0%{opacity:0}to{opacity:1}}@keyframes tDrawerFadeOut{0%{opacity:1}to{opacity:0}}.t-drawer{font:var(--td-font-body-medium);color:var(--td-text-color-primary);box-sizing:border-box;margin:0;padding:0;list-style:none;position:fixed;z-index:1500;width:100%;height:100%;pointer-events:none;overflow:hidden;outline:none}.t-drawer--lock{overflow:hidden}.t-drawer--attach{position:absolute}.t-drawer--left,.t-drawer--right{top:0}.t-drawer--left{left:0}.t-drawer--right{right:0}.t-drawer--top,.t-drawer--bottom{left:0}.t-drawer--top{top:0}.t-drawer--bottom{bottom:0}.t-drawer__mask{position:absolute;top:0;left:0;width:100%;height:100%;background-color:var(--td-mask-active);transition:opacity .2s cubic-bezier(.38,0,.24,1);opacity:0}.t-drawer__content-wrapper{display:flex;flex-direction:column;background:var(--td-bg-color-container);width:16px;height:16px;font-size:var(--td-font-body-medium);color:var(--td-text-color-secondary);box-shadow:var(--td-shadow-2);overflow:hidden;pointer-events:auto;transition:transform .28s cubic-bezier(.38,0,.24,1),visibility .28s cubic-bezier(.38,0,.24,1);position:relative}.t-drawer .t-drawer__content-wrapper{position:absolute;width:100%;height:100%;visibility:hidden}.t-drawer .t-drawer__content-wrapper--left,.t-drawer .t-drawer__content-wrapper--right{top:0}.t-drawer .t-drawer__content-wrapper--left{left:0;transform:translate(-100%)}.t-drawer .t-drawer__content-wrapper--right{right:0;transform:translate(100%)}.t-drawer .t-drawer__content-wrapper--top,.t-drawer .t-drawer__content-wrapper--bottom{left:0}.t-drawer .t-drawer__content-wrapper--top{top:0;transform:translateY(-100%)}.t-drawer .t-drawer__content-wrapper--bottom{bottom:0;transform:translateY(100%)}.t-drawer__header{display:flex;align-items:center;min-height:var(--td-comp-size-xxxl);padding:0 var(--td-comp-paddingLR-l);font:var(--td-font-title-medium);color:var(--td-text-color-primary);border-bottom:1px solid var(--td-border-level-1-color);border-radius:var(--td-radius-small) var(--td-radius-small) 0 0;box-sizing:border-box}.t-drawer__body{padding:var(--td-comp-paddingTB-l) var(--td-comp-paddingLR-l);overflow:auto;flex:1}.t-drawer__footer{width:100%;padding:var(--td-comp-paddingTB-l) var(--td-comp-paddingLR-l);text-align:left;border-top:1px solid var(--td-border-level-1-color);background-color:var(--td-bg-color-container);box-sizing:border-box}.t-drawer__footer .t-button{margin-left:var(--td-comp-margin-s)}.t-drawer__footer .t-button:first-child{margin-left:0}.t-drawer__close-btn{position:absolute;display:flex;justify-content:center;align-items:center;width:var(--td-comp-size-xs);height:var(--td-comp-size-xs);top:calc((var(--td-comp-size-xxxl) - var(--td-comp-size-xs)) / 2);right:var(--td-comp-margin-s);color:var(--td-text-color-primary);background-color:var(--td-bg-color-container);border-radius:var(--td-radius-default);cursor:pointer;transition:background-color .2s}.t-drawer__close-btn:hover{background-color:var(--td-bg-color-container-hover)}.t-drawer__close-btn:active{background-color:var(--td-bg-color-container-active)}.t-drawer__close-btn .t-icon{font-size:calc(var(--td-font-size-body-medium) + 2px);vertical-align:unset}.t-drawer--open{width:100%;height:100%;pointer-events:auto}.t-drawer--open>.t-drawer__content-wrapper{visibility:visible}.t-drawer--open>.t-drawer__mask{opacity:1;width:100%;height:100%}.t-drawer--without-mask{pointer-events:none}[tabindex="-1"]:focus{outline:none!important}';
      importCSS(indexCss);
      /**
       * tdesign v1.17.1
       * (c) 2025 tdesign
       * @license MIT
       */
      function ownKeys(e, r) {
        var t2 = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
          var o = Object.getOwnPropertySymbols(e);
          r && (o = o.filter(function(r2) {
            return Object.getOwnPropertyDescriptor(e, r2).enumerable;
          })), t2.push.apply(t2, o);
        }
        return t2;
      }
      function _objectSpread(e) {
        for (var r = 1; r < arguments.length; r++) {
          var t2 = null != arguments[r] ? arguments[r] : {};
          r % 2 ? ownKeys(Object(t2), true).forEach(function(r2) {
            _defineProperty$1(e, r2, t2[r2]);
          }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t2)) : ownKeys(Object(t2)).forEach(function(r2) {
            Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t2, r2));
          });
        }
        return e;
      }
      var key = 1;
      var _Drawer = vue.defineComponent({
        name: "TDrawer",
        inheritAttrs: false,
        props,
        emits: ["update:visible"],
        setup: function setup(props2, context) {
          var destroyOnCloseVisible = vue.ref(false);
          var isVisible = vue.ref(false);
          var styleEl = vue.ref();
          var styleTimer = vue.ref();
          var _useConfig = useConfig("drawer"), globalConfig = _useConfig.globalConfig;
          var _useGlobalIcon = useGlobalIcon({
            CloseIcon: close
          }), CloseIcon$1 = _useGlobalIcon.CloseIcon;
          var renderTNodeJSX = useTNodeJSX();
          var renderContent = useContent();
          var COMPONENT_NAME = usePrefixClass("drawer");
          var _useDrag = useDrag(props2), draggedSizeValue = _useDrag.draggedSizeValue, enableDrag = _useDrag.enableDrag, draggableLineStyles = _useDrag.draggableLineStyles, draggingStyles = _useDrag.draggingStyles;
          var computedVisible = vue.computed(function() {
            return props2.visible;
          });
          var isMounted = vue.ref(false);
          var teleportElement = useTeleport(function() {
            return props2.attach;
          });
          var confirmBtnAction = function confirmBtnAction2(e) {
            var _props2$onConfirm;
            (_props2$onConfirm = props2.onConfirm) === null || _props2$onConfirm === void 0 || _props2$onConfirm.call(props2, {
              e
            });
          };
          var cancelBtnAction = function cancelBtnAction2(e) {
            var _props2$onCancel;
            (_props2$onCancel = props2.onCancel) === null || _props2$onCancel === void 0 || _props2$onCancel.call(props2, {
              e
            });
            closeDrawer({
              trigger: "cancel",
              e
            });
          };
          var _useAction = useAction({
            confirmBtnAction,
            cancelBtnAction
          }), getConfirmBtn = _useAction.getConfirmBtn, getCancelBtn = _useAction.getCancelBtn;
          var drawerEle = vue.ref(null);
          var drawerClasses = vue.computed(function() {
            return [COMPONENT_NAME.value, "".concat(COMPONENT_NAME.value, "--").concat(props2.placement), _defineProperty$1(_defineProperty$1(_defineProperty$1({}, "".concat(COMPONENT_NAME.value, "--open"), isVisible.value), "".concat(COMPONENT_NAME.value, "--attach"), props2.showInAttachedElement), "".concat(COMPONENT_NAME.value, "--without-mask"), !props2.showOverlay), props2.drawerClassName];
          });
          var sizeValue = vue.computed(function() {
            var _props2$size;
            if (draggedSizeValue.value) return draggedSizeValue.value;
            var size = (_props2$size = props2.size) !== null && _props2$size !== void 0 ? _props2$size : globalConfig.value.size;
            var defaultSize = isNaN(Number(size)) ? size : "".concat(size, "px");
            return {
              small: "300px",
              medium: "500px",
              large: "760px"
            }[size] || defaultSize;
          });
          var wrapperStyles = vue.computed(function() {
            return {
              transform: isVisible.value ? "translateX(0)" : void 0,
              width: ["left", "right"].includes(props2.placement) ? sizeValue.value : "",
              height: ["top", "bottom"].includes(props2.placement) ? sizeValue.value : ""
            };
          });
          var wrapperClasses = vue.computed(function() {
            return ["".concat(COMPONENT_NAME.value, "__content-wrapper"), "".concat(COMPONENT_NAME.value, "__content-wrapper--").concat(props2.placement)];
          });
          var parentNode = vue.computed(function() {
            var _drawerEle$value;
            return (_drawerEle$value = drawerEle.value) === null || _drawerEle$value === void 0 ? void 0 : _drawerEle$value.parentNode;
          });
          var modeAndPlacement = vue.computed(function() {
            return [props2.mode, props2.placement].join();
          });
          var footerStyle = vue.computed(function() {
            return {
              display: "flex",
              justifyContent: props2.placement === "right" ? "flex-start" : "flex-end"
            };
          });
          var handleEscKeydown = function handleEscKeydown2(e) {
            var _props2$closeOnEscKey;
            if (((_props2$closeOnEscKey = props2.closeOnEscKeydown) !== null && _props2$closeOnEscKey !== void 0 ? _props2$closeOnEscKey : globalConfig.value.closeOnEscKeydown) && e.key === "Escape" && isVisible.value && isTopInteractivePopup()) {
              var _props2$onEscKeydown;
              (_props2$onEscKeydown = props2.onEscKeydown) === null || _props2$onEscKeydown === void 0 || _props2$onEscKeydown.call(props2, {
                e
              });
              closeDrawer({
                trigger: "esc",
                e
              });
              e.stopImmediatePropagation();
            }
          };
          var clearStyleEl = function clearStyleEl2() {
            clearTimeout(styleTimer.value);
            styleTimer.value = setTimeout(function() {
              var _styleEl$value, _styleEl$value$remove;
              (_styleEl$value = styleEl.value) === null || _styleEl$value === void 0 || (_styleEl$value = _styleEl$value.parentNode) === null || _styleEl$value === void 0 || (_styleEl$value$remove = _styleEl$value.removeChild) === null || _styleEl$value$remove === void 0 || _styleEl$value$remove.call(_styleEl$value, styleEl.value);
              styleEl.value = null;
            }, 150);
            vue.nextTick(function() {
              var _drawerEle$value2, _drawerEle$value2$foc;
              (_drawerEle$value2 = drawerEle.value) === null || _drawerEle$value2 === void 0 || (_drawerEle$value2$foc = _drawerEle$value2.focus) === null || _drawerEle$value2$foc === void 0 || _drawerEle$value2$foc.call(_drawerEle$value2);
            });
          };
          var createStyleEl = function createStyleEl2() {
            if (!styleEl.value) return;
            var hasScrollBar = window.innerWidth > document.documentElement.clientWidth;
            var scrollWidth = hasScrollBar ? getScrollbarWidth() : 0;
            styleEl.value = document.createElement("style");
            styleEl.value.dataset.id = "td_drawer_".concat(+ new Date(), "_").concat(key += 1);
            styleEl.value.innerHTML = "\n        html body {\n          overflow-y: hidden;\n          transition: margin 300ms cubic-bezier(0.7, 0.3, 0.1, 1) 0s;\n          ".concat(props2.mode === "push" ? "" : "width: calc(100% - ".concat(scrollWidth, "px);"), "\n        }\n      ");
          };
          var handlePushMode = function handlePushMode2() {
            if (props2.mode !== "push") return;
            vue.nextTick(function() {
              if (!parentNode.value) return;
              parentNode.value.style.cssText = "transition: margin 300ms cubic-bezier(0.7, 0.3, 0.1, 1) 0s;";
            });
          };
          var updatePushMode = function updatePushMode2() {
            if (!parentNode.value || props2.mode !== "push") return;
            var marginValueData = {
              left: {
                name: "margin-left",
                value: sizeValue.value
              },
              right: {
                name: "margin-right",
                value: "-".concat(sizeValue.value)
              },
              top: {
                name: "margin-top",
                value: sizeValue.value
              },
              bottom: {
                name: "margin-bottom",
                value: "-".concat(sizeValue.value)
              }
            }[props2.placement];
            if (isVisible.value) {
              parentNode.value.style.setProperty(marginValueData.name, marginValueData.value);
            } else {
              parentNode.value.style.removeProperty(marginValueData.name);
            }
          };
          var getDefaultFooter = function getDefaultFooter2() {
            var confirmBtn = getConfirmBtn({
              confirmBtn: props2.confirmBtn,
              globalConfirm: globalConfig.value.confirm,
              className: "".concat(COMPONENT_NAME.value, "__confirm")
            });
            var cancelBtn = getCancelBtn({
              cancelBtn: props2.cancelBtn,
              globalCancel: globalConfig.value.cancel,
              className: "".concat(COMPONENT_NAME.value, "__cancel")
            });
            return vue.createVNode("div", {
              "style": footerStyle.value
            }, [props2.placement === "right" ? confirmBtn : null, cancelBtn, props2.placement !== "right" ? confirmBtn : null]);
          };
          var _usePopupManager = usePopupManager("drawer", {
            visible: computedVisible
          }), isTopInteractivePopup = _usePopupManager.isTopInteractivePopup;
          vue.watch(modeAndPlacement, handlePushMode, {
            immediate: true
          });
          var updateVisibleState = function updateVisibleState2(value) {
            if (value) {
              isMounted.value = true;
            }
            if (props2.destroyOnClose) {
              if (value) {
                destroyOnCloseVisible.value = false;
                setTimeout(function() {
                  return isVisible.value = true;
                });
              } else {
                isVisible.value = false;
                if (destroyOnCloseVisible.value) {
                  destroyOnCloseVisible.value = false;
                }
                setTimeout(function() {
                  return destroyOnCloseVisible.value = true;
                }, 300);
              }
              return;
            }
            if (destroyOnCloseVisible.value && value) {
              destroyOnCloseVisible.value = false;
              setTimeout(function() {
                return isVisible.value = true;
              });
              return;
            }
            setTimeout(function() {
              return isVisible.value = value;
            });
          };
          var addStyleElToHead = function addStyleElToHead2() {
            if (!props2.showInAttachedElement && props2.preventScrollThrough && isVisible.value && (isMounted.value || !props2.lazy)) {
              if (!styleEl.value) {
                createStyleEl();
              }
              if (styleEl.value && !document.head.contains(styleEl.value)) {
                document.head.appendChild(styleEl.value);
              }
            }
          };
          vue.watch(function() {
            return props2.visible;
          }, function(value) {
            if (isServer) return;
            if (value) {
              var _props2$onBeforeOpen;
              addStyleElToHead();
              (_props2$onBeforeOpen = props2.onBeforeOpen) === null || _props2$onBeforeOpen === void 0 || _props2$onBeforeOpen.call(props2);
            } else {
              var _props2$onBeforeClose;
              clearStyleEl();
              (_props2$onBeforeClose = props2.onBeforeClose) === null || _props2$onBeforeClose === void 0 || _props2$onBeforeClose.call(props2);
            }
            updateVisibleState(value);
          }, {
            immediate: true
          });
          var handleCloseBtnClick = function handleCloseBtnClick2(e) {
            var _props2$onCloseBtnCli;
            (_props2$onCloseBtnCli = props2.onCloseBtnClick) === null || _props2$onCloseBtnCli === void 0 || _props2$onCloseBtnCli.call(props2, {
              e
            });
            closeDrawer({
              trigger: "close-btn",
              e
            });
          };
          var handleWrapperClick = function handleWrapperClick2(e) {
            var _props2$onOverlayClic, _props2$closeOnOverla;
            (_props2$onOverlayClic = props2.onOverlayClick) === null || _props2$onOverlayClic === void 0 || _props2$onOverlayClic.call(props2, {
              e
            });
            if ((_props2$closeOnOverla = props2.closeOnOverlayClick) !== null && _props2$closeOnOverla !== void 0 ? _props2$closeOnOverla : globalConfig.value.closeOnOverlayClick) {
              closeDrawer({
                trigger: "overlay",
                e
              });
            }
          };
          var closeDrawer = function closeDrawer2(params) {
            var _props2$onClose;
            (_props2$onClose = props2.onClose) === null || _props2$onClose === void 0 || _props2$onClose.call(props2, params);
            context.emit("update:visible", false);
          };
          vue.onUpdated(updatePushMode);
          vue.onMounted(function() {
            addStyleElToHead();
            window.addEventListener("keydown", handleEscKeydown);
          });
          vue.onBeforeUnmount(function() {
            clearStyleEl();
            window.removeEventListener("keydown", handleEscKeydown);
          });
          var shouldRender = vue.computed(function() {
            if (!isMounted.value) {
              return !props2.lazy;
            } else {
              return isVisible.value || !destroyOnCloseVisible.value;
            }
          });
          return function() {
            if (!shouldRender.value) return;
            var body = renderContent("body", "default");
            var headerContent = renderTNodeJSX("header");
            var defaultFooter = getDefaultFooter();
            return vue.createVNode(vue.Teleport, {
              "disabled": !props2.attach || !teleportElement.value,
              "to": teleportElement.value
            }, {
              "default": function _default() {
                return [vue.createVNode("div", vue.mergeProps({
                  "ref": drawerEle,
                  "class": drawerClasses.value,
                  "style": {
                    zIndex: props2.zIndex
                  },
                  "onKeydown": handleEscKeydown,
                  "tabindex": 0
                }, context.attrs), [props2.showOverlay && vue.createVNode("div", {
                  "class": "".concat(COMPONENT_NAME.value, "__mask"),
                  "onClick": handleWrapperClick
                }, null), vue.createVNode("div", {
                  "class": wrapperClasses.value,
                  "style": _objectSpread(_objectSpread({}, wrapperStyles.value), draggingStyles.value)
                }, [headerContent && vue.createVNode("div", {
                  "class": "".concat(COMPONENT_NAME.value, "__header")
                }, [headerContent]), props2.closeBtn && vue.createVNode("div", {
                  "class": "".concat(COMPONENT_NAME.value, "__close-btn"),
                  "onClick": handleCloseBtnClick
                }, [renderTNodeJSX("closeBtn", vue.createVNode(CloseIcon$1, null, null))]), vue.createVNode("div", {
                  "class": ["".concat(COMPONENT_NAME.value, "__body"), "narrow-scrollbar"]
                }, [body]), props2.footer && vue.createVNode("div", {
                  "class": "".concat(COMPONENT_NAME.value, "__footer")
                }, [renderTNodeJSX("footer", defaultFooter)]), props2.sizeDraggable && vue.createVNode("div", {
                  "style": draggableLineStyles.value,
                  "onMousedown": enableDrag
                }, null)])])];
              }
            });
          };
        }
      });
      /**
       * tdesign v1.17.1
       * (c) 2025 tdesign
       * @license MIT
       */
      var Drawer = withInstall(_Drawer);
      const useClickListener = (callback) => {
        const clickEvent = (target, from) => {
          if (!target || target.closest === void 0) {
            return;
          }
          const link = target.closest("a");
          if (link && link.href) {
            callback({
              ref: link,
              origin: link.origin,
              pathname: link.pathname,
              url: `${link.origin}${link.pathname}`,
              target: from
            });
          }
        };
        const clickListener = (e) => {
          clickEvent(e.target, "click");
        };
        const contextmenuListener = (e) => {
          clickEvent(e.target, "contextmenu");
        };
        vue.onMounted(() => {
          document.addEventListener("click", clickListener);
          document.addEventListener("contextmenu", contextmenuListener);
        });
        vue.onUnmounted(() => {
          document.removeEventListener("click", clickListener);
          document.removeEventListener("contextmenu", contextmenuListener);
        });
      };
      var _GM_getValue = (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)();
      var _GM_registerMenuCommand = (() => typeof GM_registerMenuCommand != "undefined" ? GM_registerMenuCommand : void 0)();
      var _GM_setClipboard = (() => typeof GM_setClipboard != "undefined" ? GM_setClipboard : void 0)();
      var _GM_setValue = (() => typeof GM_setValue != "undefined" ? GM_setValue : void 0)();
      const CLICKED_LINKS_PREFIX = "clicked_links_";
      const DOMAINS_KEY = "clicked_links_domains";
      const useStorage = () => {
        const DomainKey = CLICKED_LINKS_PREFIX + window.location.origin;
        const updateDomainsList = () => {
          const domains = _GM_getValue(DOMAINS_KEY, []);
          const currentDomain = window.location.origin;
          if (!domains.includes(currentDomain)) {
            domains.push(currentDomain);
            _GM_setValue(DOMAINS_KEY, domains);
          }
          return domains;
        };
        const updateDomains = (domains) => {
          _GM_setValue(DOMAINS_KEY, domains);
        };
        const getAllDomains = () => {
          return _GM_getValue(DOMAINS_KEY, []);
        };
        const getCurrentDomainLinks = () => {
          return _GM_getValue(DomainKey, {});
        };
        const getLinksByDomain = (domain) => {
          const domainKey = CLICKED_LINKS_PREFIX + domain;
          return _GM_getValue(domainKey, {});
        };
        const setLinksByDomain = (domain, data) => {
          _GM_setValue(CLICKED_LINKS_PREFIX + domain, data);
        };
        const getAllDomainsLinks = () => {
          const domains = getAllDomains();
          const allData = {};
          domains.forEach((domain) => {
            const domainKey = CLICKED_LINKS_PREFIX + domain;
            const domainData = _GM_getValue(domainKey, {});
            allData[domain] = domainData;
          });
          return allData;
        };
        const saveLink = (url) => {
          updateDomainsList();
          const clickedLinks = getCurrentDomainLinks();
          clickedLinks[url] = {
            timestamp: Date.now()
          };
          _GM_setValue(DomainKey, clickedLinks);
        };
        const removeLink = (pathname) => {
          const clickedLinks = getCurrentDomainLinks();
          if (clickedLinks[pathname]) {
            delete clickedLinks[pathname];
            _GM_setValue(DomainKey, clickedLinks);
            return true;
          }
          return false;
        };
        const saveDomainData = (domain, data) => {
          const domainKey = CLICKED_LINKS_PREFIX + domain;
          _GM_setValue(domainKey, data);
        };
        const clearCurrentDomainData = () => {
          _GM_setValue(DomainKey, {});
        };
        const clearAllDomainsData = () => {
          const domains = getAllDomains();
          domains.forEach((domain) => {
            const domainKey = CLICKED_LINKS_PREFIX + domain;
            _GM_setValue(domainKey, {});
          });
          _GM_setValue(DOMAINS_KEY, []);
        };
        return {
          updateDomainsList,
          updateDomains,
          getLinksByDomain,
          setLinksByDomain,
          getAllDomains,
          getCurrentDomainLinks,
          getAllDomainsLinks,
          saveLink,
          removeLink,
          saveDomainData,
          clearCurrentDomainData,
          clearAllDomainsData
        };
      };
      const clearLink = (onConfirm) => {
        const value = vue.ref("");
        const dialog = DialogPlugin.confirm({
          header: "请输入要清除的链接",
          confirmBtn: "清除",
          placement: "center",
          body: () => {
            return vue.h(Input, {
              style: { marginTop: "16px" },
              placeholder: "例如：https://example.com/path/link",
              onChange(val) {
                value.value = val.toString();
              }
            });
          },
          onClosed: () => {
            dialog.destroy();
          },
          onConfirm: async () => {
            if (!value.value) {
              MessagePlugin.error("请输入要清除的链接");
              return;
            }
            try {
              await onConfirm(
                value.value.startsWith("http") ? value.value.replace(window.location.origin, "") : value.value
              );
              MessagePlugin.success("清除成功");
              dialog.destroy();
            } catch (e) {
              MessagePlugin.error("清除失败，链接不存在");
            }
          }
        });
      };
      const RECORD_DOMAINS_KEY = "record_domains";
      const useRecordStatus = () => {
        const needRecord = vue.ref(false);
        const resetRecordStatus = () => {
          const recordDomains = _GM_getValue(RECORD_DOMAINS_KEY, []);
          const currentDomain = window.location.origin;
          needRecord.value = recordDomains.includes(currentDomain);
        };
        resetRecordStatus();
        const switchRecordStatus = () => {
          const recordDomains = _GM_getValue(RECORD_DOMAINS_KEY, []);
          const currentDomain = window.location.origin;
          const idx = recordDomains.indexOf(currentDomain);
          if (idx > -1) {
            recordDomains.splice(idx, 1);
          } else {
            recordDomains.push(currentDomain);
          }
          _GM_setValue(RECORD_DOMAINS_KEY, recordDomains);
          resetRecordStatus();
        };
        return {
          needRecord,
          switchRecordStatus
        };
      };
      const _hoisted_1 = { class: "list-item" };
      const _hoisted_2 = { class: "list-item" };
      const _hoisted_3 = { style: { "display": "flex", "align-items": "center" } };
      const _sfc_main = vue.defineComponent({
        __name: "App",
        setup(__props) {
          const CLICKED_LINK_STYLE = {
            color: "rgba(180, 180, 180, 0.5)",
            textDecoration: "none"
          };
          const { needRecord, switchRecordStatus } = useRecordStatus();
          const storage = useStorage();
          useClickListener((e) => {
            storage.saveLink(e.pathname);
            if (needRecord.value) {
              Object.assign(e.ref.style, CLICKED_LINK_STYLE);
            }
          });
          const initLinks = (focus = false) => {
            if (!needRecord.value && focus === false) {
              return;
            }
            const clickedLinks = storage.getCurrentDomainLinks();
            const links = document.querySelectorAll("a");
            links.forEach((link) => {
              if (clickedLinks[link.pathname] && needRecord.value) {
                Object.assign(link.style, CLICKED_LINK_STYLE);
              } else {
                console.log("重置", link.pathname);
                if (link.style.color === CLICKED_LINK_STYLE.color) {
                  link.style.color = "";
                  link.style.textDecoration = "";
                }
              }
            });
          };
          initLinks();
          const handleSwitchStatus = () => {
            switchRecordStatus();
            initLinks(true);
          };
          const visible = vue.ref(false);
          _GM_registerMenuCommand("导入导出功能", () => {
            visible.value = true;
          });
          _GM_registerMenuCommand("清除指定链接", () => {
            clearLink(async (link) => {
              if (!storage.removeLink(link)) {
                return Promise.reject("Remove Storage Failure");
              }
              initLinks();
            });
          });
          const menus = [
            {
              title: "导入导出",
              items: [
                {
                  title: "导入数据",
                  action: () => {
                    const value = vue.ref("");
                    const dialog = DialogPlugin.confirm({
                      header: "请输入要导入的链接",
                      confirmBtn: "导入",
                      placement: "center",
                      body: () => {
                        return vue.h(Textarea, {
                          style: { marginTop: "16px" },
                          placeholder: `例如：
{
  "domains": [
    "https://example.com"
  ],
  "data": {
    "https://example.com": {
      "/path/link": { "timestamp": 1761747737985 }
    }
  }
}`,
                          autosize: {
                            minRows: 10,
                            maxRows: 20
                          },
                          onChange(val) {
                            value.value = val.toString();
                          }
                        });
                      },
                      onClosed: () => {
                        dialog.destroy();
                      },
                      onConfirm: () => {
                        if (!value.value) {
                          MessagePlugin.error("导入数据不能为空");
                          return;
                        }
                        let data;
                        try {
                          data = JSON.parse(value.value);
                        } catch (e) {
                          MessagePlugin.error("导入数据格式错误");
                          return;
                        }
                        if (!data.data || typeof data.data !== "object") {
                          MessagePlugin.error("导入数据格式错误");
                          return;
                        }
                        const allDomains = storage.getAllDomains();
                        Object.keys(data.data).forEach((domain) => {
                          const linkMap = data.data[domain];
                          if (typeof linkMap === "object") {
                            const src = storage.getLinksByDomain(domain);
                            Object.assign(src, linkMap);
                            storage.setLinksByDomain(domain, src);
                            if (!allDomains.includes(domain)) {
                              allDomains.push(domain);
                              storage.updateDomains(allDomains);
                            }
                          }
                        });
                        initLinks();
                        MessagePlugin.success("导入成功");
                        dialog.destroy();
                        visible.value = false;
                      }
                    });
                  }
                },
                {
                  title: "导出当前网站数据",
                  action: () => {
                    const clickedLinks = storage.getCurrentDomainLinks();
                    const exportData = {
                      timestamp: Date.now(),
                      domains: [window.location.origin],
                      data: { [window.location.origin]: clickedLinks }
                    };
                    const jsonString = JSON.stringify(exportData, null, 2);
                    _GM_setClipboard(jsonString, "text");
                    MessagePlugin.success("导出成功，已将当前数据复制到剪贴板");
                  }
                },
                {
                  title: "导出所有网站数据",
                  action: () => {
                    const allData = storage.getAllDomainsLinks();
                    const exportData = {
                      timestamp: Date.now(),
                      domains: Object.keys(allData),
                      data: allData
                    };
                    const jsonString = JSON.stringify(exportData, null, 2);
                    _GM_setClipboard(jsonString, "text");
                    MessagePlugin.success("导出成功，已将所有数据复制到剪贴板");
                  }
                }
              ]
            },
            {
              title: "清除数据",
              items: [
                {
                  title: "清除指定链接",
                  action: () => {
                    clearLink(async (link) => {
                      if (!storage.removeLink(link)) {
                        return Promise.reject("Remove Storage Failure");
                      }
                      initLinks();
                    });
                  }
                },
                {
                  title: "清除当前网站数据",
                  action: () => {
                    const dialog = DialogPlugin.confirm({
                      header: "提示",
                      body: "请确认是否清除当前网站的所有点击数据",
                      confirmBtn: "清除",
                      placement: "center",
                      onConfirm: () => {
                        storage.clearCurrentDomainData();
                        MessagePlugin.success("清除当前网站点击数据成功");
                        dialog.destroy();
                        initLinks();
                      },
                      onClosed: () => dialog.destroy()
                    });
                  }
                },
                {
                  title: "清除所有网站数据",
                  action: () => {
                    const dialog = DialogPlugin.confirm({
                      header: "提示",
                      body: "请确认是否清除所有网站的所有点击数据",
                      confirmBtn: "清除",
                      placement: "center",
                      onConfirm: () => {
                        storage.clearAllDomainsData();
                        MessagePlugin.success("清除所有网站点击数据成功");
                        dialog.destroy();
                        initLinks();
                      },
                      onClosed: () => dialog.destroy()
                    });
                  }
                }
              ]
            }
          ];
          vue.onMounted(() => {
            const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
            if (isDarkMode) {
              document.documentElement.setAttribute("theme-mode", "dark");
            } else {
              document.documentElement.removeAttribute("theme-mode");
            }
          });
          return (_ctx, _cache) => {
            const _component_t_typography_title = Title;
            const _component_t_list_item = ListItem;
            const _component_t_list = List;
            const _component_t_drawer = Drawer;
            return vue.openBlock(), vue.createElementBlock("div", null, [
              vue.createVNode(_component_t_drawer, {
                visible: vue.unref(visible),
                "onUpdate:visible": _cache[0] || (_cache[0] = ($event) => vue.isRef(visible) ? visible.value = $event : null),
                attach: "body",
                header: "链接点击记录器",
                footer: false,
                closeBtn: true,
                lazy: true,
                "z-index": 2499
              }, {
                default: vue.withCtx(() => [
                  (vue.openBlock(), vue.createElementBlock(vue.Fragment, null, vue.renderList(menus, (menu, idx) => {
                    return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
                      vue.createVNode(_component_t_typography_title, {
                        level: "h6",
                        class: "group-title",
                        style: vue.normalizeStyle({ "margin-top": idx === 0 ? "0" : "40px" })
                      }, {
                        default: vue.withCtx(() => [
                          vue.createTextVNode(vue.toDisplayString(menu.title), 1)
                        ]),
                        _: 2
                      }, 1032, ["style"]),
                      vue.createVNode(_component_t_list, {
                        split: "",
                        style: { "margin-bottom": "40px" }
                      }, {
                        default: vue.withCtx(() => [
                          (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(menu.items, (item) => {
                            return vue.openBlock(), vue.createBlock(_component_t_list_item, {
                              key: item.title,
                              onClick: item.action
                            }, {
                              default: vue.withCtx(() => [
                                vue.createElementVNode("div", _hoisted_1, [
                                  vue.createElementVNode("span", null, vue.toDisplayString(item.title), 1),
                                  vue.createVNode(vue.unref(chevronRight), { "stroke-width": 2 })
                                ])
                              ]),
                              _: 2
                            }, 1032, ["onClick"]);
                          }), 128))
                        ]),
                        _: 2
                      }, 1024)
                    ], 64);
                  }), 64)),
                  vue.createVNode(_component_t_typography_title, {
                    level: "h6",
                    class: "group-title",
                    style: { "margin-top": "40px" }
                  }, {
                    default: vue.withCtx(() => [..._cache[1] || (_cache[1] = [
                      vue.createTextVNode(" 是否显示当前网站点击痕迹 ", -1)
                    ])]),
                    _: 1
                  }),
                  vue.createVNode(_component_t_list, {
                    split: "",
                    style: { "margin-bottom": "40px" }
                  }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_t_list_item, { onClick: handleSwitchStatus }, {
                        default: vue.withCtx(() => [
                          vue.createElementVNode("div", _hoisted_2, [
                            vue.createElementVNode("span", null, vue.toDisplayString(vue.unref(needRecord) ? "显示" : "不显示"), 1),
                            vue.createElementVNode("div", _hoisted_3, [
                              _cache[2] || (_cache[2] = vue.createElementVNode("span", { style: { "color": "var(--td-text-color-placeholder)" } }, "切换", -1)),
                              vue.createVNode(vue.unref(chevronRight), { "stroke-width": 2 })
                            ])
                          ])
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }, 8, ["visible"])
            ]);
          };
        }
      });
      const _export_sfc = (sfc, props2) => {
        const target = sfc.__vccOpts || sfc;
        for (const [key2, val] of props2) {
          target[key2] = val;
        }
        return target;
      };
      const App = _export_sfc(_sfc_main, [["__scopeId", "data-v-35e1587b"]]);
      vue.createApp(App).mount(
        (() => {
          const app = document.createElement("div");
          return app;
        })()
      );
    }
  });
  require_main_001();

})(Vue);