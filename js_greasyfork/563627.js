// ==UserScript==
// @name         百度贴吧自动签到 (记忆版)
// @namespace    http://tampermonkey.net/
// @version      2026.01.21.3
// @description  签到一次后当天不再运行，支持新版页面
// @author       Gemini Revised
// @match        https://tieba.baidu.com/*
// @grant        GM_xmlhttpRequest
// @connect      tieba.baidu.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563627/%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0%20%28%E8%AE%B0%E5%BF%86%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563627/%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0%20%28%E8%AE%B0%E5%BF%86%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const url = "https://tieba.baidu.com";
    const today = new Date().toLocaleDateString(); // 获取当前日期字符串 (如 "2026/1/21")
    const STORAGE_KEY = "tieba_sign_last_date";

    // 1. 检查今天是否已经签到过
    const lastSignDate = localStorage.getItem(STORAGE_KEY);
    if (lastSignDate === today) {
        console.log("贴吧助手：今日已签到，跳过执行。");
        return; // 直接退出，不执行后续逻辑
    }

    // --- 以下是签到核心逻辑，仅在今日未签到时运行 ---

    let tbs = "";
    let forumList = [];

    // 创建可视化状态框
    const statusDiv = document.createElement('div');
    statusDiv.style = "position: fixed; top: 20px; right: 20px; z-index: 10000; background: #fff; border: 2px solid #3b5998; padding: 15px; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.2); font-size: 14px; min-width: 200px; color: #333;";
    statusDiv.innerHTML = "<b>贴吧助手</b>: 准备执行今日签到...";
    document.body.appendChild(statusDiv);

    function request(details) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                ...details,
                onload: resolve,
                onerror: reject
            });
        });
    }

    async function startSigning() {
        try {
            // 获取 TBS
            statusDiv.innerHTML = "<b>贴吧助手</b>: 正在获取身份令牌...";
            const tbsRes = await request({ method: "GET", url: `${url}/dc/common/tbs` });
            const tbsData = JSON.parse(tbsRes.responseText);
            tbs = tbsData.tbs;

            if (!tbs || tbs === "000000000000000000") {
                statusDiv.innerHTML = "<b style='color:red;'>错误</b>: 未登录百度账号";
                return;
            }

            // 获取关注列表
            statusDiv.innerHTML = "<b>贴吧助手</b>: 正在读取贴吧列表...";
            const listRes = await request({ method: "GET", url: `${url}/f/like/mylike?pn=1` });
            const parser = new DOMParser();
            const doc = parser.parseFromString(listRes.responseText, 'text/html');
            const links = doc.querySelectorAll('a[title]');

            const seen = new Set();
            links.forEach(link => {
                if (link.href.includes('/f?kw=')) seen.add(link.title);
            });
            forumList = Array.from(seen);

            if (forumList.length === 0) {
                statusDiv.innerHTML = "<b>提示</b>: 未发现关注的贴吧";
                // 即使没贴吧也标记为已运行，防止没关注贴吧的人一直弹窗
                localStorage.setItem(STORAGE_KEY, today);
                return;
            }

            // 循环签到
            for (let i = 0; i < forumList.length; i++) {
                const kw = forumList[i];
                statusDiv.innerHTML = `<b>进度</b>: [${i+1}/${forumList.length}]<br>正在签到: ${kw}`;

                await request({
                    method: "POST",
                    url: `${url}/sign/add`,
                    data: `ie=utf-8&kw=${encodeURIComponent(kw)}&tbs=${tbs}`,
                    headers: { "Content-Type": "application/x-www-form-urlencoded" }
                });

                await new Promise(r => setTimeout(r, 1500));
            }

            // 签到成功后，记录今天的日期
            localStorage.setItem(STORAGE_KEY, today);
            statusDiv.innerHTML = "<b>完成</b>: 今日签到任务已结束";
            setTimeout(() => statusDiv.remove(), 5000);

        } catch (err) {
            statusDiv.innerHTML = "<b style='color:red;'>运行崩溃</b>: 请按F12查看控制台";
            console.error("脚本执行失败:", err);
        }
    }

    setTimeout(startSigning, 3000);
})();