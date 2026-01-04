// ==UserScript==
// @name         NodeLoc++
// @namespace    http://tampermonkey.net/
// @version      1.2
// @author       红色塑料袋
// @description  NodeLoc 增强脚本。去除右侧广告栏，优化宽屏显示
// @match        *://www.nodeloc.com/*
// @match        *://www.nodeloc.cc/*
// @run-at       document-start
// @grant        GM_addStyle
// @noframes
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549961/NodeLoc%2B%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/549961/NodeLoc%2B%2B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 去广告的目标区域：右侧栏容器
    var RIGHT_RAIL_SEL = [
        '.sidebar-ads-wrapper',
        '#right-sidebar',
        '.right-sidebar',
        '[data-region="right-sidebar"]',
        '.discourse-right-sidebar'
    ].join(',');

    // 需要拉伸的主内容候选节点
    var MAIN_CONTENT_SEL = [
        '#main-outlet',
        '#main-outlet-wrapper > #main-outlet',
        '#main-outlet-wrapper > .contents',
        '#main-outlet-wrapper > .wrap',
        '#main-outlet-wrapper > .container',
        '#main-outlet-wrapper > main'
    ].join(',');

    var GRID_WRAP_SEL = '#main-outlet-wrapper';

    function scopeSelectors(base, csv) {
        var parts = csv.split(',');
        for (var i = 0; i < parts.length; i++) {
            var item = parts[i].trim();
            if (item.indexOf(base) === 0) {
                parts[i] = item;
            } else {
                parts[i] = base + ' ' + item;
            }
        }
        return parts.join(', ');
    }

    var MAIN_CONTENT_SCOPED = scopeSelectors(GRID_WRAP_SEL, MAIN_CONTENT_SEL);

    // 去广告：将右侧栏统一隐藏
    var adBlockCss = [
        RIGHT_RAIL_SEL + ' { display: none !important; }'
    ];

    // 宽屏优化：扩展主内容并放宽页面宽度
    var layoutCss = [
        // 调整页面最大宽度
        ':root { --d-max-width: 1320px !important; }',
        // 扩展主内容区域
        MAIN_CONTENT_SCOPED + ' { grid-column: 2 / 4 !important; min-width: 0 !important; }',
        GRID_WRAP_SEL + ' > * { grid-column: auto; }',
        GRID_WRAP_SEL + ' { grid-auto-columns: 0 !important; grid-auto-flow: row !important; }'
    ];

    var css = adBlockCss.concat(layoutCss).join('\n');

    if (typeof GM_addStyle === 'function') {
        GM_addStyle(css);
    } else {
        var s = document.createElement('style');
        s.textContent = css;
        (document.head || document.documentElement).appendChild(s);
    }
})();
