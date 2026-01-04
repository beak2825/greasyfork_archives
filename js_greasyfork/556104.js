// ==UserScript==
// @name         Anti-Visibility-Detection
// @match        *.yuketang.cn/*
// @run-at       document-start
// @description Anti Visibility Detection
// @author EthanDong
// @license MIT

// @version 0.0.1.20251117150128
// @namespace https://greasyfork.org/users/1526411
// @downloadURL https://update.greasyfork.org/scripts/556104/Anti-Visibility-Detection.user.js
// @updateURL https://update.greasyfork.org/scripts/556104/Anti-Visibility-Detection.meta.js
// ==/UserScript==

(function() {
    // 1. 阻止事件监听
    const blockEvents = ["visibilitychange", "webkitvisibilitychange", "blur", "focusout"];
    blockEvents.forEach(ev => {
        document.addEventListener(ev, e => e.stopImmediatePropagation(), true);
        window.addEventListener(ev, e => e.stopImmediatePropagation(), true);
    });

    // 2. 伪造属性
    Object.defineProperty(document, "visibilityState", {
        get: () => "visible"
    });

    Object.defineProperty(document, "hidden", {
        get: () => false
    });
})();
