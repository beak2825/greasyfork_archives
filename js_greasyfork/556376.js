// ==UserScript==
// @name         Bilibili Live Auto Play
// @namespace    https://bilibili.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @version      2025.12.31
// @description  直播未开播时自动轮询状态，开播自动刷新并语音播报主播昵称，时刻监控直播间标题
// @match        https://live.bilibili.com/*
// @match        https://live.bilibili.com/blanc/*
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @connect      api.live.bilibili.com
// @connect      api.vc.bilibili.com
// @downloadURL https://update.greasyfork.org/scripts/556376/Bilibili%20Live%20Auto%20Play.user.js
// @updateURL https://update.greasyfork.org/scripts/556376/Bilibili%20Live%20Auto%20Play.meta.js
// ==/UserScript==

(function () {
    'use strict';
    if (window.top !== window.self) {
        console.log("【BLAP】检测到 iframe 内部，不执行脚本");
        return;
    }

    // ---- 提取直播间号 ----
    const match = window.location.pathname.match(/(\d+)$/);
    if (!match) {
        console.warn("【BLAP】无法解析直播间号");
        return;
    }
    const roomId = match[1];
    let userName = "主播";
    const refreshedFlagKey = `bili_live_refreshed_${roomId}`;

    const apiUrl = `https://api.live.bilibili.com/room/v1/Room/get_info?room_id=${roomId}`;

    // 标题监控相关
    let lastTitle = "";
    const titleChangedFlagKey = `bili_live_title_changed_${roomId}`;

    // ---- 获取 UID ----
    async function fetchUID(roomId) {
        const url = apiUrl;
        const res = await fetch(url);
        const json = await res.json();
        return json.data?.uid || null;
    }

    // ---- 获取主播昵称 ----
    async function fetchUserName(uid) {
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: `https://api.vc.bilibili.com/account/v1/user/cards?uids=${uid}`,
                onload: (res) => {
                    try {
                        const json = JSON.parse(res.responseText);
                        resolve(json.data?.[0]?.name || "主播");
                    } catch (e) {
                        console.error("【BLAP】解析昵称失败:", e);
                        resolve("主播");
                    }
                },
                onerror: () => resolve("主播")
            });
        });
    }

    // ---- 语音播报 ----
    function speak(text) {
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = "zh-CN";
        speechSynthesis.speak(utter);
    }

    // ---- 检查直播状态 ----
    function checkLiveStatus() {
        GM_xmlhttpRequest({
            method: "GET",
            url: apiUrl,
            onload: (res) => {
                try {
                    const data = JSON.parse(res.responseText);
                    const status = data?.data?.live_status; // 0未开播、1直播中、2轮播
                    console.log("【BLAP】当前直播状态:", status);
                    if (status === 1) {
                        console.log("【BLAP】检测到开播，刷新页面并播报！");
                        speak(`${userName} 开播了`);
                        showNotify(`${userName} 开播了`);
                        sessionStorage.setItem(refreshedFlagKey, "1");
                        location.reload();
                    }
                } catch (e) {
                    console.error("【BLAP】检查直播状态解析错误:", e);
                }
            },
            onerror: (err) => console.error("【BLAP】请求直播状态失败:", err)
        });
    }
    let pollingStarted = false;

    // ---- 检查标题变化 ----
    function checkTitleChange() {
        GM_xmlhttpRequest({
            method: "GET",
            url: apiUrl,
            onload: (res) => {
                try {
                    const json = JSON.parse(res.responseText);
                    const newTitle = json?.data?.title || "";

                    if (newTitle && lastTitle && newTitle !== lastTitle) {
                        console.log(`【BLAP】检测到标题变化: ${lastTitle} -> ${newTitle}`);
                        if (sessionStorage.getItem(refreshedFlagKey) !== "1") {
                            location.reload();
                        }


                        // 语音播报标题变化
                        speak(`${userName}更改了新标题：${newTitle}`);
                        showNotify(`${userName}更改了新标题：${newTitle}`);
                        // 避免持续重复播报（刷新时 sessionStorage 会重置）
                        sessionStorage.setItem(titleChangedFlagKey, "1");
                    }

                    lastTitle = newTitle;
                } catch (e) {
                    console.error("【BLAP】标题检查解析失败:", e);
                }
            },
            onerror: (err) => console.error("【BLAP】标题检查失败:", err)
        });
    }

    function showNotify(title = '通知', body = '') {
        // 首先尝试 GreaseMonkey/Tampermonkey 提供的 GM_notification（可能是函数或对象签名）
        try {
            if (typeof GM_notification !== 'undefined') {
                // 兼容两种常见签名：
                // 1) GM_notification(text, title, image, onclick)
                // 2) GM_notification({ text, title, image, timeout, onclick })
                try {
                    // 先尝试对象签名（现代 Tampermonkey/GM）
                    GM_notification({
                        text: body,
                        title: title,
                        timeout: 5000
                    });
                    return;
                } catch (e) {
                    // 再尝试传统函数签名
                    try {
                        GM_notification(body, title);
                        return;
                    } catch (e2) {
                        // 如果都失败，继续走回退
                    }
                }
            }
        } catch (e) {
            // 忽略，走浏览器 Notification 回退
        }

        // 回退到浏览器 Notification API
        try {
            if (window.Notification) {
                if (Notification.permission === 'granted') {
                    new Notification(title, { body });
                } else if (Notification.permission !== 'denied') {
                    Notification.requestPermission().then((perm) => {
                        if (perm === 'granted') new Notification(title, { body });
                    });
                } else {
                    // 被拒绝，无法显示通知
                    console.warn('Notification blocked by user.');
                }
                return;
            }
        } catch (e) {
            console.warn('Notification API not available:', e);
        }

        // 最后兜底：使用 alert（不会推荐，但确保用户至少能看到）
        try {
            alert(`${title}\n\n${body}`);
        } catch (e) {
            console.error('无法显示任何通知', e);
        }
    }

    // ---- 开始轮询 ----
    function startPolling() {
        setInterval(() => {
            if (sessionStorage.getItem(refreshedFlagKey) !== "1") {
                checkLiveStatus();
            }
            checkTitleChange();
        }, 10000); // 每10秒检查一次
    }

    // ---- 初始化流程 ----
    async function init() {
        try {
            // 首次检查直播状态
            const res = await fetch(apiUrl);
            const data = await res.json();
            const status = data?.data?.live_status;
            console.log("【BLAP】首次检查直播状态:", status);
            lastTitle = data?.data?.title || "";
            console.log("【BLAP】初始标题:", lastTitle);

            if (status === 1) {
                console.log("【BLAP】正在直播，开始仅监控标题…");
                //                startPollingTitle();
                sessionStorage.setItem(refreshedFlagKey, "1");
                startPolling();
                return;
            }

            console.log("【BLAP】直播未开播，获取主播信息...");
            const uid = await fetchUID(roomId);

            if (uid) {
                userName = await fetchUserName(uid);
                console.log("【BLAP】主播昵称:", userName, "UID:",uid);
            }

            console.log("【BLAP】开始轮询监控标题和开播状态…");
            startPolling();

        } catch (e) {
            console.error("【BLAP】初始化失败:", e);
        }
    }

    init();

})();
