// ==UserScript==
// @name X Userscript
// @description X/Twitter Userscript
// @author qzda
// @version 0.0.2
// @match https://x.com/*
// @namespace https://github.com/qzda/x-userscript/
// @supportURL https://github.com/qzda/x-userscript/issues/new
// @icon https://raw.githubusercontent.com/qzda/x-userscript/main/image/logo.svg
// @copyright MIT
// @run-at document-end
// @connect raw.githubusercontent.com
// @connect github.com
// @grant GM_registerMenuCommand
// @grant GM_unregisterMenuCommand
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_addStyle
// @grant GM_addElement
// @downloadURL https://update.greasyfork.org/scripts/552483/X%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/552483/X%20Userscript.meta.js
// ==/UserScript==

// node_modules/@qzda/prolog/dist/index.js
var Colors = {
  black: 30,
  red: 31,
  green: 32,
  yellow: 33,
  blue: 34,
  magenta: 35,
  cyan: 36,
  white: 37,
  gray: 90,
  brightBlack: 90,
  brightRed: 91,
  brightGreen: 92,
  brightYellow: 93,
  brightBlue: 94,
  brightMagenta: 95,
  brightCyan: 96,
  brightWhite: 97
};
var Backgrounds = {
  bgBlack: 40,
  bgRed: 41,
  bgGreen: 42,
  bgYellow: 43,
  bgBlue: 44,
  bgMagenta: 45,
  bgCyan: 46,
  bgWhite: 47,
  bgGray: 100,
  bgBrightBlack: 100,
  bgBrightRed: 101,
  bgBrightGreen: 102,
  bgBrightYellow: 103,
  bgBrightBlue: 104,
  bgBrightMagenta: 105,
  bgBrightCyan: 106,
  bgBrightWhite: 107
};
var OtherStyles = {
  bold: 1,
  italic: 3,
  underline: 4
};
var Obj = Object.assign(Object.assign(Object.assign({}, Object.keys(Colors).reduce((_obj, color) => {
  _obj[color] = (str) => `\x1B[${Colors[color]}m${str}\x1B[0m`;
  return _obj;
}, {})), Object.keys(Backgrounds).reduce((_obj, bg) => {
  _obj[bg] = (str) => `\x1B[${Backgrounds[bg]}m${str}\x1B[0m`;
  return _obj;
}, {})), Object.keys(OtherStyles).reduce((_obj, style) => {
  _obj[style] = (str) => `\x1B[${OtherStyles[style]}m${str}\x1B[0m`;
  return _obj;
}, {}));
var dist_default = Obj;

// package.json
var name = "x-userscript";
var version = "0.0.2";

// utils/dev.ts
var isDev = false;

// utils/log.ts
function log(...arg) {
  console.log(dist_default.bgBlack(dist_default.brightYellow(`${name} v${version}`)), ...arg);
}
function devLog(...arg) {
  if (isDev) {
    log(...arg);
  }
}

// user-script/nav.ts
var navItems = [
  { key: "Grok", selector: "nav a[href='/i/grok']", defaultValue: true },
  { key: "Messages", selector: "nav a[href='/messages']", defaultValue: true },
  {
    key: "Communities",
    selector: "nav a[href$='/communities']",
    defaultValue: true
  },
  { key: "List", selector: "nav a[href$='/lists']" },
  {
    key: "Bookmarks",
    selector: "nav a[href='/i/bookmarks']"
  },
  { key: "Premium", selector: "nav a[href^='/i/premium']", defaultValue: true },
  {
    key: "Organization",
    selector: "nav a[href^='/i/verified-orgs-signup']",
    defaultValue: true
  }
];
function applyVisibility() {
  devLog("applyVisibility");
  navItems.forEach((nav) => {
    const hidden = GM_getValue(nav.key, nav.defaultValue || false);
    const navEle = document.querySelector(nav.selector);
    if (navEle) {
      navEle.style.display = hidden ? "none" : "inherit";
    }
  });
}

// user-script/menu.ts
var menuIds = [];
function initMenu() {
  while (menuIds.length) {
    const id = menuIds.pop();
    if (id) {
      GM_unregisterMenuCommand(id);
    }
  }
  navItems.forEach((nav) => {
    const hidden = GM_getValue(nav.key, nav.defaultValue || false);
    const id = GM_registerMenuCommand(`${hidden ? "✅" : "❌"} Hidden ${nav.key}`, () => {
      GM_setValue(nav.key, !hidden);
      initMenu();
      applyVisibility();
    }, { autoClose: false });
    menuIds.push(id);
  });
  devLog("initMenu");
}

// user-script/index.ts
log();
initMenu();
var navInterval = setInterval(() => {
  if (document.querySelector("nav")) {
    clearInterval(navInterval);
    applyVisibility();
  }
}, 200);
window.addEventListener("click", () => {
  const navInterval2 = setInterval(() => {
    if (document.querySelector("nav")) {
      clearInterval(navInterval2);
      applyVisibility();
    }
  }, 200);
});