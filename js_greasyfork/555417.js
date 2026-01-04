// ==UserScript==
// @name         解除HUST课程平台作业复制粘贴限制
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  解除HUST作业页面的所有限制：1. 文本复制粘贴；2. 图片粘贴；3. 图片拖拽上传。
// @author       dy_boat
// @match        *://smartcourse.hust.edu.cn/mooc-ans/*
// @grant        unsafeWindow
// @grant        GM_addStyle
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/555417/%E8%A7%A3%E9%99%A4HUST%E8%AF%BE%E7%A8%8B%E5%B9%B3%E5%8F%B0%E4%BD%9C%E4%B8%9A%E5%A4%8D%E5%88%B6%E7%B2%98%E8%B4%B4%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/555417/%E8%A7%A3%E9%99%A4HUST%E8%AF%BE%E7%A8%8B%E5%B9%B3%E5%8F%B0%E4%BD%9C%E4%B8%9A%E5%A4%8D%E5%88%B6%E7%B2%98%E8%B4%B4%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Part 1: 通用限制解除 (立即执行) ---
    console.log('[解除HUST课程平台作业复制粘贴限制] 脚本启动。');
    GM_addStyle(`* { user-select: auto !important; -webkit-user-select: auto !important; }`);

    const eventsToBypass = ['copy', 'paste', 'cut', 'contextmenu', 'selectstart'];
    eventsToBypass.forEach(eventName => {
        document.addEventListener(eventName, event => {
            event.stopImmediatePropagation();
        }, true);
    });
    console.log('通用事件拦截器已部署。');

    // --- Part 2: 针对 UEditor 的高级拦截与配置修改 (智能监控并执行) ---

    // 持续监控，直到成功修改 UE 核心对象和配置
    const observer = new MutationObserver((mutations, obs) => {
        const UE = unsafeWindow.UE;
        const UEDITOR_CONFIG = unsafeWindow.UEDITOR_CONFIG;

        let isUEPatched = false;
        let isConfigPatched = false;

        // --- 模块 A: 破解文本粘贴限制 ---
        if (UE && UE.Editor && UE.Editor.prototype.addListener && !UE.Editor.prototype._addListener_original) {
            UE.Editor.prototype._addListener_original = UE.Editor.prototype.addListener;
            UE.Editor.prototype.addListener = function(types, listener) {
                if (types === 'beforepaste') {
                    console.log('成功拦截并阻止 "beforepaste" (文本粘贴限制) 事件绑定！');
                    return;
                }
                return this._addListener_original(types, listener);
            };
            console.log('已劫持 UEditor 的 addListener 方法。');
            isUEPatched = true;
        }

        // --- 模块 B: 破解图片粘贴/拖拽限制 ---
        if (UEDITOR_CONFIG) {
            let configChanged = false;
            // 检查并强制开启图片粘贴功能
            if (UEDITOR_CONFIG.disablePasteImage === true) {
                UEDITOR_CONFIG.disablePasteImage = false;
                console.log('发现图片粘贴被禁用，已强制开启！');
                configChanged = true;
            }
            // 检查并强制开启图片拖拽功能
            if (UEDITOR_CONFIG.disableDraggable === true) {
                UEDITOR_CONFIG.disableDraggable = false;
                console.log('发现图片拖拽被禁用，已强制开启！');
                configChanged = true;
            }
            if (configChanged) {
                 isConfigPatched = true;
            }
        }

        // 如果两个任务都完成了，就停止监控
        // (注意：配置项可能在UE对象出现前就已存在，所以分开判断)
        if ( (UE && UE.Editor && UE.Editor.prototype._addListener_original) && UEDITOR_CONFIG && UEDITOR_CONFIG.disablePasteImage === false) {
             console.log('所有破解任务完成，停止监控。');
             obs.disconnect();
        }
    });

    // 启动监控
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });
})();