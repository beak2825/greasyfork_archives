// ==UserScript==
// @name         豆包AI生图去水印（增强版）
// @namespace    http://tampermonkey.net/
// @version      1.2.0
// @description  豆包AI生图下载原图去水印，并添加用户提示
// @author       mzh
// @homepage https://blog.csdn.net/u011027547
// @match        https://www.doubao.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=doubao.com
// @grant        none
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/558800/%E8%B1%86%E5%8C%85AI%E7%94%9F%E5%9B%BE%E5%8E%BB%E6%B0%B4%E5%8D%B0%EF%BC%88%E5%A2%9E%E5%BC%BA%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/558800/%E8%B1%86%E5%8C%85AI%E7%94%9F%E5%9B%BE%E5%8E%BB%E6%B0%B4%E5%8D%B0%EF%BC%88%E5%A2%9E%E5%BC%BA%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let scriptActive = false;

    function showActivationMessage() {
        // 避免重复提示
        if (scriptActive) return;
        scriptActive = true;

        // 控制台日志
        console.log('🚫 豆包AI去水印脚本已激活，正在监控图片数据...');

        // 页面顶部状态栏
        const statusBar = document.createElement('div');
        statusBar.textContent = '豆包AI去水印：已启用（检测到图片生成时会自动去除水印）';
        statusBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            background: #4CAF50;
            color: white;
            padding: 8px;
            text-align: center;
            font-size: 14px;
            z-index: 9999;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        `;
        document.body.appendChild(statusBar);

        // 5秒后淡出状态栏
        setTimeout(() => {
            statusBar.style.transition = 'opacity 0.5s';
            statusBar.style.opacity = '0';
            setTimeout(() => {
                if (document.body.contains(statusBar)) {
                    document.body.removeChild(statusBar);
                }
            }, 500);
        }, 5000);
    }

    function showSuccessToast() {
        const toast = document.createElement('div');
        toast.innerHTML = '✅ 已成功去除图片水印，可下载无水印原图';
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #2196F3;
            color: white;
            padding: 12px 16px;
            border-radius: 4px;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            font-size: 14px;
            max-width: 300px;
        `;
        document.body.appendChild(toast);

        setTimeout(() => {
            if (document.body.contains(toast)) {
                toast.style.transition = 'opacity 0.5s';
                toast.style.opacity = '0';
                setTimeout(() => {
                    if (document.body.contains(toast)) {
                        document.body.removeChild(toast);
                    }
                }, 500);
            }
        }, 3000);
    }

    function findAllKeysInJson(obj, key) {
        const results = [];
        function search(current) {
            if (current && typeof current === 'object') {
                if (!Array.isArray(current) && Object.prototype.hasOwnProperty.call(current, key)) {
                    results.push(current[key]);
                }
                const items = Array.isArray(current) ? current : Object.values(current);
                for (const item of items) {
                    search(item);
                }
            }
        }
        search(obj);
        return results;
    }

    let _parse = JSON.parse;
    JSON.parse = function(data) {
        let jsonData = _parse(data);
        if (!data.match('creations')) return jsonData;

        let creations = findAllKeysInJson(jsonData, 'creations');
        if (creations.length > 0) {
            creations.forEach((creation) => {
                creation.map((item) => {
                    if (item.image && item.image.image_ori_raw && item.image.image_ori_raw.url) {
                        const rawUrl = item.image.image_ori_raw.url;
                        item.image.image_ori.url = rawUrl;
                        // 预览时也去水印
                        item.image.image_preview.url = rawUrl;
                        item.image.image_thumb.url = rawUrl;
                    }
                    return item;
                });
            });

            // 显示成功提示
            setTimeout(showSuccessToast, 500);
        }
        return jsonData;
    }

    // 页面加载后显示激活提示
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', showActivationMessage);
    } else {
        setTimeout(showActivationMessage, 1000);
    }
})();