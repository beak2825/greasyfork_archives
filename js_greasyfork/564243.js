// ==UserScript==
// @name         观麦样式控制器（菜单开关版）
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  使用菜单命令控制字体和表格样式开关
// @match        https://station.guanmai.cn/*
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/564243/%E8%A7%82%E9%BA%A6%E6%A0%B7%E5%BC%8F%E6%8E%A7%E5%88%B6%E5%99%A8%EF%BC%88%E8%8F%9C%E5%8D%95%E5%BC%80%E5%85%B3%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/564243/%E8%A7%82%E9%BA%A6%E6%A0%B7%E5%BC%8F%E6%8E%A7%E5%88%B6%E5%99%A8%EF%BC%88%E8%8F%9C%E5%8D%95%E5%BC%80%E5%85%B3%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    // 默认值
    const fontKey = 'enableFontStyle';
    const tableKey = 'enableTableStyle';

    const enableFontStyle = await GM_getValue(fontKey, true);
    const enableTableStyle = await GM_getValue(tableKey, true);

    // 注册菜单命令：切换字体设置
    GM_registerMenuCommand(
        `字体设置：${enableFontStyle ? '✅启用' : '❌禁用'}`,
        async () => {
            await GM_setValue(fontKey, !enableFontStyle);
            alert(`字体设置已${!enableFontStyle ? '启用' : '禁用'}，请刷新页面生效`);
        }
    );

    // 注册菜单命令：切换表格背景色
    GM_registerMenuCommand(
        `表格双行背景：${enableTableStyle ? '✅启用' : '❌禁用'}`,
        async () => {
            await GM_setValue(tableKey, !enableTableStyle);
            alert(`表格背景色已${!enableTableStyle ? '启用' : '禁用'}，请刷新页面生效`);
        }
    );

    // 注入样式
    let css = "";

    if (enableFontStyle) {
        css += `
            html, body {
                font-family: sans-serif !important;
                font-weight: 600 !important;
            }
        `;
    }

    if (enableTableStyle) {
        css += `
            .gm-table-x-tr-even .gm-table-x-td {
                background-color: #f0fff0 !important;
            }
        `;
    }
    css += `
    .gm-modal .gm-modal-sm {
    margin-top: 400px !important;
    }
    `;

    if (css.trim()) {
        GM_addStyle(css);
    }
})();
