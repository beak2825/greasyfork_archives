// ==UserScript==
// @name X/Twitter Clear
// @description X/Twitter Clear userscript.
// @author qzda
// @version 0.0.4
// @match https://x.com/*
// @namespace https://github.com/qzda/x-userscript/
// @supportURL https://github.com/qzda/x-userscript/issues/new
// @icon https://raw.githubusercontent.com/qzda/x-userscript/main/image/logo.svg
// @copyright MIT
// @run-at document-start
// @connect raw.githubusercontent.com
// @connect github.com
// @grant GM_registerMenuCommand
// @grant GM_unregisterMenuCommand
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_addStyle
// @grant GM_addElement
// @downloadURL https://update.greasyfork.org/scripts/552483/XTwitter%20Clear.user.js
// @updateURL https://update.greasyfork.org/scripts/552483/XTwitter%20Clear.meta.js
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
var version = "0.0.4";

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

// user-script/index.ts
log();
var sidebar_testid = "sidebarColumn";
var menuIds = [];
function initMenu() {
  devLog("initMenu");
  function updateMenu(name2, label) {
    const hidden = GM_getValue(name2, false);
    const id = GM_registerMenuCommand(`${hidden ? "❌" : "✅"} ${label}`, () => {
      GM_setValue(name2, !hidden);
      initMenu();
      applyVisibility();
    }, { autoClose: false });
    menuIds.push(id);
  }
  menuIds.forEach((id) => {
    GM_unregisterMenuCommand(id);
  });
  menuIds = [];
  const navs = document.querySelectorAll('nav[role="navigation"] > a');
  navs.forEach((nav) => {
    const testid = nav.getAttribute("data-testid");
    const label = nav.getAttribute("aria-label");
    if (label) {
      updateMenu(testid || label, label);
    }
  });
  const sidebar = document.querySelector(`div[data-testid="${sidebar_testid}"]`);
  if (sidebar) {
    updateMenu(sidebar_testid, "Sidebar");
  }
}
function applyVisibility() {
  devLog("applyVisibility");
  const cssRules = [];
  const navs = document.querySelectorAll('nav[role="navigation"] > a');
  navs.forEach((nav) => {
    const testid = nav.getAttribute("data-testid");
    const label = nav.getAttribute("aria-label");
    if (label) {
      const hidden = GM_getValue(testid || label, false);
      if (hidden) {
        const selector = testid ? `nav[role="navigation"] > a[data-testid="${testid}"]` : `nav[role="navigation"] > a[aria-label="${label}"]`;
        cssRules.push(`${selector} { display: none !important; }`);
      }
    }
  });
  const sidebarHidden = GM_getValue(sidebar_testid, false);
  if (sidebarHidden) {
    cssRules.push(`div[data-testid="${sidebar_testid}"] { display: none !important; }`);
  }
  let styleElement = document.querySelector(`style#${name}`);
  if (!styleElement) {
    styleElement = document.createElement("style");
    styleElement.id = name;
    document.head.appendChild(styleElement);
  }
  styleElement.textContent = cssRules.join(`
`);
}
function main() {
  const mainInterval = setInterval(() => {
    if (document.querySelector("nav")) {
      clearInterval(mainInterval);
      initMenu();
      applyVisibility();
    }
  }, 200);
}
var _pushState = history.pushState;
var _replaceState = history.replaceState;
history.pushState = function(...args) {
  _pushState.apply(this, args);
  main();
};
history.replaceState = function(...args) {
  _replaceState.apply(this, args);
  main();
};
window.addEventListener("popstate", () => {
  main();
});
main();
