// ==UserScript==
// @name         Force Microsoft YaHei Font (No-Flash Safe)
// @namespace    https://tampermonkey.net/
// @version      1.2.1
// @description  无闪烁强制微软雅黑，安全排除图标/公式/控件，站点/页面级排除在脚本头完成
// @match        *://*/*

// ===== 站点 / 页面排除 =====
// @exclude-match  *://www.google.com/*
// @exclude-match  *://accounts.google.com/*
// @exclude-match  *://docs.google.com/*
// @exclude-match  *://example.com/special/page

// ===== 运行时机 =====
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559074/Force%20Microsoft%20YaHei%20Font%20%28No-Flash%20Safe%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559074/Force%20Microsoft%20YaHei%20Font%20%28No-Flash%20Safe%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const FONT_FALLBACK = [
        '"Microsoft YaHei"',
        '"微软雅黑"',
        '"PingFang SC"',
        'system-ui',
        'sans-serif'
    ].join(',');

    const EXCLUDE_SELECTORS = `
        code, pre, kbd, samp, tt,
        input, textarea, select, option, button,
        [role="button"], [type="button"], [type="submit"], [type="reset"],

        i, i[class],
        svg, svg *, canvas,
        [class*="icon"], [class^="icon-"], [class*="glyph"],
        [class^="fa"], .fa, .fas, .far, .fab, .fal, .fad,
        .material-icons, .material-symbols-outlined,
        .material-symbols-rounded, .material-symbols-sharp,
        .iconfont, [class*="iconfont"],

        math, mjx-container, .MathJax,
        .katex, .katex *,

        .monaco-editor, .monaco-editor *,
        .CodeMirror, .CodeMirror *,
        .ace_editor, .ace_editor *,

        nav, nav *, menu, menu *,
        [role="menu"], [role="menuitem"],
        [role="toolbar"], [role="tab"], [role="tabpanel"],

        progress, meter, summary, details,
        [draggable="true"],
        [aria-hidden="true"]
    `.replace(/\s+/g, ' ');

    const style = document.createElement('style');
    style.id = 'tm-force-yahei-font';
    style.textContent = `
        html, body {
            font-family: ${FONT_FALLBACK} !important;
        }
        body *:not(${EXCLUDE_SELECTORS}) {
            font-family: ${FONT_FALLBACK} !important;
        }
    `;

    document.documentElement.appendChild(style);
})();
