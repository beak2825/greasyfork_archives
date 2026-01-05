// ==UserScript==
// @name         Rust Docs Code Highlight
// @name:zh-CN   Rust Docs 代码高亮补全
// @namespace    https://github.com/SuniRein/scripts
// @version      1.0.0
// @description  Highlight code blocks in other languages on docs.rs that are currently missing syntax highlighting
// @description:zh-CN 高亮 docs.rs 中缺少高亮的其他语言块的代码
// @author       SuniRein
// @match        https://docs.rs/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=docs.rs
// @license      GPL3
// @supportURL   https://github.com/SuniRein/scripts/blob/main/CHANGELOG.md
// @downloadURL https://update.greasyfork.org/scripts/559354/Rust%20Docs%20Code%20Highlight.user.js
// @updateURL https://update.greasyfork.org/scripts/559354/Rust%20Docs%20Code%20Highlight.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@arborium/arborium/dist/arborium.iife.js';
    document.head.appendChild(script);
})();
