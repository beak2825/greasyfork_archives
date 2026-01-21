// ==UserScript==
// @name         webpackChunkbloxd fixer
// @namespace    http://bloxd.io
// @version      1.0.0
// @description  adds window.webpackChunkbloxd reference
// @author       MakeItOrBreakIt
// @match        *://*.bloxd.io/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/563404/webpackChunkbloxd%20fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/563404/webpackChunkbloxd%20fixer.meta.js
// ==/UserScript==

(() => {
    const descs = Object.getOwnPropertyDescriptors(window);
    const key = Object.keys(descs).find(k => descs[k]?.set?.toString().includes("++"));
    if (key) { try {
            window.webpackChunkbloxd = window[key];
            console.log("Defined webpackChunkbloxd:", window.webpackChunkbloxd);
        } catch (e) {
        console.error("Failed to set webpackChunkbloxd:", e);
     }
    } else { console.warn("webpackChunkbloxd not found"); }
})();
