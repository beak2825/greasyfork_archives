// ==UserScript==
// @name         excalidraw-file-previewer
// @namespace    npm/vite-plugin-monkey
// @version      0.0.4
// @description  A userscript that renders `.excalidraw` files directly in the browser.
// @license      MIT
// @icon         https://raw.githubusercontent.com/azzgo/excalidraw-file-previewer/d0812af94c620041090aebc5d2ca9b7fc058b244/src/assets/icon.svg
// @match        *://*/*.excalidraw
// @match        file:///*.excalidraw
// @require      https://cdn.jsdelivr.net/gh/azzgo/excalidraw-file-previewer@0.0.2/dist/excalidraw-lib.umd.js#sha256-saaAgmgXKUqt6J9Lj/M8Zv1QCBLNk2LaOImJ0KZ+R8Q=
// @resource     REMOTE_STYLE  https://cdn.jsdelivr.net/npm/@excalidraw/excalidraw@0.18.0/dist/prod/index.min.css
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/563560/excalidraw-file-previewer.user.js
// @updateURL https://update.greasyfork.org/scripts/563560/excalidraw-file-previewer.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const d=new Set;const importCSS = async e=>{d.has(e)||(d.add(e),(t=>{typeof GM_addStyle=="function"?GM_addStyle(t):(document.head||document.documentElement).appendChild(document.createElement("style")).append(t);})(e));};

  var _GM_addStyle = (() => typeof GM_addStyle != "undefined" ? GM_addStyle : void 0)();
  var _GM_getResourceText = (() => typeof GM_getResourceText != "undefined" ? GM_getResourceText : void 0)();
  const indexCss = "html,body{height:100vh;width:100vw;padding:0;margin:0}";
  importCSS(indexCss);
  const EXCALIDRAW_TYPE = "excalidraw";
  const SUPPORT_EXCALIDRAW_VERSION = 2;
  const myCss = _GM_getResourceText("REMOTE_STYLE");
  _GM_addStyle(myCss);
  const isValidExcalidrawFile = (json2) => {
    return typeof json2 === "object" && json2 !== null && json2.type === EXCALIDRAW_TYPE && typeof json2.version === "number" && json2.version === SUPPORT_EXCALIDRAW_VERSION;
  };
  let json;
  try {
    if (document.body.innerText.trim().startsWith("{")) {
      let last = document.body.innerText.lastIndexOf("}");
      json = JSON.parse(document.body.innerText.slice(0, last + 1));
    }
  } catch (e) {
    console.error("[Excalidraw] parse JSON failed:", e);
  }
  if (isValidExcalidrawFile(json)) {
    if (window.ExcalidrawLib?.renderExcalidrawEditor) {
      window.ExcalidrawLib.renderExcalidrawEditor(json);
    } else {
      console.error(
        "[Excalidraw] Library not loaded. Please include excalidraw-lib.umd.js"
      );
    }
  } else {
    console.warn("[Excalidraw] Illegal Excalidraw file structure");
  }

})();