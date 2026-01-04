// ==UserScript==
// @name         冰枫论坛跳转助手
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  自动提取并访问冰枫论坛跳转页面的目标链接
// @author       Antigravity
// @match        *://bingfong.com/redirect/*
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/557390/%E5%86%B0%E6%9E%AB%E8%AE%BA%E5%9D%9B%E8%B7%B3%E8%BD%AC%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/557390/%E5%86%B0%E6%9E%AB%E8%AE%BA%E5%9D%9B%E8%B7%B3%E8%BD%AC%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log("冰枫论坛跳转助手已启动");

    // 从页面源码中提取 API 地址
    function getApiUrl() {
        const html = document.body.innerHTML;
        // 匹配 fetch 调用中的 URL
        const regex = /fetch\(['"](\.\/redirect\/[^'"]+)['"]\)/;
        const match = html.match(regex);
        if (match && match[1]) {
            return match[1];
        }
        // 如果 body 中没找到，尝试在 script 标签中查找
        const scripts = document.getElementsByTagName('script');
        for (let script of scripts) {
            const scriptContent = script.innerHTML;
            const scriptMatch = scriptContent.match(regex);
            if (scriptMatch && scriptMatch[1]) {
                return scriptMatch[1];
            }
        }
        return null;
    }

    // 请求目标 URL
    async function fetchTargetUrl(apiUrl) {
        try {
            console.log("正在请求 API:", apiUrl);
            const fetchFn = (typeof unsafeWindow !== 'undefined' && unsafeWindow.fetch) ? unsafeWindow.fetch : window.fetch;

            const response = await fetchFn(apiUrl, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    // 移除 X-Requested-With 以避免 403 错误
                }
            });

            if (response.status === 403) {
                console.error("403 禁止访问");
                return null;
            }

            const data = await response.json();
            console.log("API 响应:", data);
            return data;
        } catch (error) {
            console.error("请求出错:", error);
            return null;
        }
    }

    // 创建操作按钮
    function createButton() {
        const btn = document.createElement('button');
        btn.textContent = '🔓 解锁并跳转';
        btn.style.position = 'fixed';
        btn.style.top = '20px';
        btn.style.left = '50%';
        btn.style.transform = 'translateX(-50%)';
        btn.style.zIndex = '9999';
        btn.style.backgroundColor = '#2196F3'; // 蓝色
        btn.style.color = '#fff';
        btn.style.padding = '10px 20px';
        btn.style.border = 'none';
        btn.style.borderRadius = '5px';
        btn.style.fontSize = '16px';
        btn.style.fontWeight = 'bold';
        btn.style.cursor = 'pointer';
        btn.style.boxShadow = '0 4px 6px rgba(0,0,0,0.2)';

        btn.onclick = async () => {
            // 1. 加速原生页面的倒计时
            try {
                if (typeof unsafeWindow !== 'undefined') {
                    unsafeWindow.waiting_sec = 0;
                }
            } catch (e) {
                console.log("无法修改 waiting_sec", e);
            }

            // 2. 获取目标链接
            btn.textContent = '⏳ 获取中...';
            btn.disabled = true;
            btn.style.backgroundColor = '#9E9E9E'; // 灰色

            const apiUrl = getApiUrl();
            if (!apiUrl) {
                btn.textContent = '❌ 未找到 API 地址';
                btn.style.backgroundColor = '#f44336'; // 红色
                btn.disabled = false;
                return;
            }

            const data = await fetchTargetUrl(apiUrl);

            if (data && data.code == "200" && data.target_url) {
                // 成功！将按钮变为跳转链接
                btn.textContent = '🚀 前往目标页面';
                btn.style.backgroundColor = '#4CAF50'; // 绿色
                btn.disabled = false;
                btn.onclick = () => {
                    window.location.href = data.target_url;
                };

                // 尝试更新页面原有的跳转提示
                const redirectElem = document.getElementById("redirect");
                if (redirectElem) {
                    redirectElem.innerHTML = '准备就绪！点击上方按钮跳转。';
                    redirectElem.onclick = function () {
                        window.location.href = data.target_url;
                    };
                }
            } else {
                btn.textContent = '❌ 失败 (403?). 重试?';
                btn.style.backgroundColor = '#f44336'; // 红色
                btn.disabled = false;
            }
        };

        document.body.appendChild(btn);
    }

    // 页面加载完成后运行
    window.addEventListener('load', createButton);

})();
