// ==UserScript==
// @name         B站直播跨房弹幕屏蔽器
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  通过劫持JSON.parse，解析DANMU_MSG中的extra字段，识别并拦截跨房弹幕
// @author       hiback
// @match        https://live.bilibili.com/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557909/B%E7%AB%99%E7%9B%B4%E6%92%AD%E8%B7%A8%E6%88%BF%E5%BC%B9%E5%B9%95%E5%B1%8F%E8%94%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/557909/B%E7%AB%99%E7%9B%B4%E6%92%AD%E8%B7%A8%E6%88%BF%E5%BC%B9%E5%B9%95%E5%B1%8F%E8%94%BD%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("B站直播跨房弹幕屏蔽器已启动");

    const originalParse = JSON.parse;

    JSON.parse = function(text, reviver) {
        const data = originalParse(text, reviver);

        if (!data || typeof data !== 'object') return data;

        // 仅处理弹幕消息 (DANMU_MSG)
        if (data.cmd && data.cmd.startsWith('DANMU_MSG')) {
            try {
                // 安全检查数据结构
                // data.info[0] 存放弹幕元数据
                if (data.info && Array.isArray(data.info) && data.info[0]) {
                    const meta = data.info[0];

                    // 核心逻辑：检查 index 15 的 extra 字段
                    // 结构：meta[15] = { "extra": "{\"is_mirror\":true...}" }
                    if (meta[15] && meta[15].extra) {
                        // 为了性能，用字符串匹配快速筛查（避免每次都二次 parse）
                        const extraStr = meta[15].extra;

                        // 包含 "is_mirror":true
                        if (extraStr.includes('"is_mirror":true')) {
                            return null; // 拦截
                        }
                    }
                }
            } catch (e) {
                console.warn("拦截逻辑异常，放行弹幕", e);
            }
        }

        // 其他消息一律放行
        return data;
    };

})();