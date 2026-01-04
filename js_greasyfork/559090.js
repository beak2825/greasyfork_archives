// ==UserScript==
// @name         rust练习实践中文代码样式bug修复
// @namespace    http://tampermonkey.net/
// @version      2025-12-16
// @description  // @license MIT
// @author       张鸿运
// @match        https://practice-zh.course.rs/*
// @icon         https://practice-zh.course.rs/favicon.svg
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/559090/rust%E7%BB%83%E4%B9%A0%E5%AE%9E%E8%B7%B5%E4%B8%AD%E6%96%87%E4%BB%A3%E7%A0%81%E6%A0%B7%E5%BC%8Fbug%E4%BF%AE%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/559090/rust%E7%BB%83%E4%B9%A0%E5%AE%9E%E8%B7%B5%E4%B8%AD%E6%96%87%E4%BB%A3%E7%A0%81%E6%A0%B7%E5%BC%8Fbug%E4%BF%AE%E5%A4%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    const str = `
code.editable, .ace_scroller {
    top: 0;
}
`;
    const styleEl = document.createElement('style');
    styleEl.innerHTML = str;
    document.head.append(styleEl);
    })();