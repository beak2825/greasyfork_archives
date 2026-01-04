// ==UserScript==
// @name         uid查询-内部
// @namespace    http://yuyehk.cn/
// @version      1.4
// @description  智能数据可视触发脚本 —— 自动识别页面关键信息节点，在动态渲染环境中精准注入交互式操作按钮。点击后，系统将实时请求后端服务接口，自动判定数据状态并以可视化方式展示结果。支持跨域访问、SSL 异常容忍及异步响应处理，为前端信息查询与验证流程带来极致的交互体验。
// @author       yuyehk
// @match        http*://aidp.bytedance.com/*/task-v2/7340264015479983924/*
// @grant        GM_xmlhttpRequest
// @license Private; All rights reserved.
// @downloadURL https://update.greasyfork.org/scripts/554842/uid%E6%9F%A5%E8%AF%A2-%E5%86%85%E9%83%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/554842/uid%E6%9F%A5%E8%AF%A2-%E5%86%85%E9%83%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 等待目标元素出现
    function waitForElement(selector, callback) {
        const observer = new MutationObserver(() => {
            const el = document.querySelector(selector);
            if (el) {
                observer.disconnect();
                callback(el);
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // 目标元素选择器
    const targetSelector = "#main > div > div > div > div > div > div.renderer-zone_GQ2_Nji6.render-zone-only-wrap > div > div > div > div:nth-child(2) > div:nth-child(4) > div:nth-child(1) > div.arco-collapse-item-content.arco-collapse-item-content-expanded > div > div > div > table > tbody > tr:nth-child(1) > td.arco-descriptions-item-value";

    // 请求地址（请修改）
    const apiURL = "http://poi.yuyehk.cn:9017/query-uid"; 

    // SVG 图标（默认搜索 & 成功对勾）
    const ICON_SEARCH = `<?xml version="1.0" encoding="UTF-8"?><svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 7H44" stroke="#333" stroke-width="4" stroke-linecap="round"/><path d="M4 23H15" stroke="#333" stroke-width="4" stroke-linecap="round"/><path d="M4 39H15" stroke="#333" stroke-width="4" stroke-linecap="round"/><path d="M31.5 34C36.1944 34 40 30.1944 40 25.5C40 20.8056 36.1944 17 31.5 17C26.8056 17 23 20.8056 23 25.5C23 30.1944 26.8056 34 31.5 34Z" fill="none" stroke="#333" stroke-width="4"/><path d="M37 32L44 39.0505" stroke="#333" stroke-width="4" stroke-linecap="round"/></svg>`;
    const ICON_SUCCESS = `<?xml version="1.0" encoding="UTF-8"?><svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M4 24L9 19L19 29L39 9L44 14L19 39L4 24Z" fill="#56ff2f" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    const ICON_YES = `<?xml version="1.0" encoding="UTF-8"?><svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 9.25564L24.0086 4L42 9.25564V20.0337C42 31.3622 34.7502 41.4194 24.0026 45.0005C13.2521 41.4195 6 31.36 6 20.0287V9.25564Z" fill="#56ff2f" stroke="#333" stroke-width="4" stroke-linejoin="round"/><path d="M15 23L22 30L34 18" stroke="#FFF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    waitForElement(targetSelector, (targetElement) => {
        // 创建按钮容器
        const container = document.createElement("span");
        container.style.display = "inline-flex";
        container.style.alignItems = "center";
        container.style.marginLeft = "8px";

        // 按钮
        const btn = document.createElement("button");
        btn.innerHTML = ICON_SEARCH;
        btn.style.cssText = `
            width: 24px;
            height: 24px;
            background: none;
            border: none;
            cursor: pointer;
            padding: 0;
        `;
        btn.title = "点击发送查询请求";

        // 结果显示区
        const resultText = document.createElement("span");
        resultText.style.cssText = `
            margin-left: 6px;
            font-size: 14px;
            color: #333;
        `;

        // 点击按钮发送请求
        btn.addEventListener("click", () => {
            const contentEl = document.querySelector(targetSelector);
            if (!contentEl) {
                alert("❌ 未找到目标元素！");
                return;
            }

            const value = encodeURIComponent(contentEl.innerText.trim());
            const url = `${apiURL}?uid=${value}`;

            // 请求中禁用按钮避免重复
            btn.disabled = true;
            btn.style.opacity = "0.6";
            btn.title = "查询中...";

            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                timeout: 10000,
                onload: (response) => {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data?.data?.items && data.data.items.length > 0) {
                            const publishText = data.data.items[0].fields.同步内容[0].text || "未知";
                            btn.innerHTML = ICON_SUCCESS;
                            resultText.textContent = publishText;
                        } else {
                            btn.innerHTML = ICON_YES;
                            resultText.textContent = "不在库内";
                        }
                    } catch (err) {
                        console.error("❌ 解析返回数据失败：", err);
                        resultText.textContent = "返回数据异常";
                    }
                    btn.disabled = true;
                    btn.style.opacity = "0.5";
                    btn.title = "查询完成";
                },
                onerror: () => {
                    resultText.textContent = "请求失败";
                    btn.disabled = false;
                    btn.style.opacity = "1";
                    btn.title = "点击重试";
                },
                ontimeout: () => {
                    resultText.textContent = "请求超时";
                    btn.disabled = false;
                    btn.style.opacity = "1";
                    btn.title = "点击重试";
                },
            });
        });

        // 插入按钮与结果文本
        container.appendChild(btn);
        container.appendChild(resultText);
        targetElement.appendChild(container);

        console.log("✅ 按钮与图标已插入到指定位置！");
    });
})();
