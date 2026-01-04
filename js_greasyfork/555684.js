// ==UserScript==
// @name         B站关注列表认证信息清除
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  [此脚本由AI生成] 想看简介而不是神秘认证（清除B站关注列表中的官方认证描述信息）
// @author       You
// @match        https://space.bilibili.com/*/fans/follow
// @grant        none
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/555684/B%E7%AB%99%E5%85%B3%E6%B3%A8%E5%88%97%E8%A1%A8%E8%AE%A4%E8%AF%81%E4%BF%A1%E6%81%AF%E6%B8%85%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/555684/B%E7%AB%99%E5%85%B3%E6%B3%A8%E5%88%97%E8%A1%A8%E8%AE%A4%E8%AF%81%E4%BF%A1%E6%81%AF%E6%B8%85%E9%99%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 保存原始的 fetch 函数
    const originalFetch = window.fetch;

    // 重写 fetch 函数
    window.fetch = async function(...args) {
        const url = args[0];

        // 检查是否是目标 API
        if (typeof url === 'string' && url.includes('api.bilibili.com/x/relation/followings')) {
            // 调用原始 fetch
            const response = await originalFetch.apply(this, args);

            // 克隆响应以便修改
            const clonedResponse = response.clone();

            try {
                // 获取 JSON 数据
                const data = await clonedResponse.json();

                // 修改 official_verify.desc
                if (data.data && data.data.list && Array.isArray(data.data.list)) {
                    data.data.list.forEach(item => {
                        if (item.official_verify) {
                            item.official_verify.desc = "";
                        }
                    });
                }

                // 返回修改后的响应
                return new Response(JSON.stringify(data), {
                    status: response.status,
                    statusText: response.statusText,
                    headers: response.headers
                });
            } catch (e) {
                console.error('处理响应数据时出错:', e);
                return response;
            }
        }

        // 非目标 API，直接返回原始响应
        return originalFetch.apply(this, args);
    };

    console.log('B站关注列表认证信息清除脚本已加载');
})();