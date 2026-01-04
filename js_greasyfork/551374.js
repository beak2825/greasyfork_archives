// ==UserScript==
// @name         猫耳FM记录与XML弹幕下载
// @namespace    https://github.com/fishhh666
// @version      1.0
// @description  记录猫耳FM / missevan 的 标题和网址，可导出为 JSON 方便后期处理其他任务。脚本支持下载当前页面弹幕 xml 或记录中的所有页面对应 xml（只能逐个下载）
// @author       fishhh666
// @match        https://www.missevan.com/sound/player?id=*
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @downloadURL https://update.greasyfork.org/scripts/551374/%E7%8C%AB%E8%80%B3FM%E8%AE%B0%E5%BD%95%E4%B8%8EXML%E5%BC%B9%E5%B9%95%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/551374/%E7%8C%AB%E8%80%B3FM%E8%AE%B0%E5%BD%95%E4%B8%8EXML%E5%BC%B9%E5%B9%95%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let records = GM_getValue("records", []);
    let recording = GM_getValue("recording", false);
    let lastUrl = location.href;
    let menuIds = [];

    // 保存记录
    function saveRecords() {
        GM_setValue("records", records);
        updateMenu();
    }

    // 添加记录（去重）
    function addRecord(url, title) {
        if (!/^https:\/\/www\.missevan\.com\/sound\/player\?id=\d+$/.test(url)) return;
        if (!records.some(r => r.url === url)) {
            records.push({ url, title });
            saveRecords();
            console.log("记录已添加:", title, url);
        }
    }

    // 安全添加记录（延迟+轮询确认标题更新）
    function safeAddRecord(url) {
        let attempts = 0;
        let oldTitle = document.title.trim();

        let check = () => {
            let nowTitle = document.title.trim();
            if (nowTitle !== oldTitle || attempts >= 5) {
                addRecord(url, nowTitle);
            } else {
                attempts++;
                setTimeout(check, 300); // 每300ms检测一次，最多尝试5次，1.5秒
            }
        };

        setTimeout(check, 500); // 首次延迟0.5秒，避免太早取旧标题
    }

    // 切换记录状态
    function toggleRecording() {
        recording = !recording;
        GM_setValue("recording", recording);
        if (recording) {
            safeAddRecord(location.href);
            alert("开始记录，当前页面已记录！网址变化时也会自动添加。");
        } else {
            alert("已暂停记录。");
        }
        updateMenu();
    }

    // 清空记录
    function clearRecords() {
        if (records.length === 0) {
            alert("记录是空的，不需要清空。");
            return;
        }
        if (confirm("确认要清空所有记录吗？此操作不可恢复！")) {
            records = [];
            saveRecords();
            console.log("记录已清空");
        }
    }

    // 查看记录
    function viewRecords() {
        if (records.length === 0) {
            alert("还没有任何记录。");
        } else {
            let str = records.map((r, i) => `${i + 1}. ${r.title}：${r.url}`).join("\n");
            alert(str);
        }
    }

    // 下载记录到 link.json
    function downloadRecords() {
        if (records.length === 0) return alert("记录为空，无法导出。");
        let jsonArr = records.map(r => ({ title: r.title, link: r.url }));
        let jsonStr = JSON.stringify(jsonArr, null, 2); // 美化缩进
        let blob = new Blob([jsonStr], { type: "application/json;charset=utf-8" });
        window.saveAs(blob, "link.json");
    }

    // 获取 soundid
    function getIdFromUrl(url) {
        let m = url.match(/id=(\d+)/);
        return m ? m[1] : null;
    }

    // 下载 XML
    function downloadXml(apiUrl, filename) {
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: apiUrl,
                responseType: "text",
                onload: function(res) {
                    if (res.status === 200) {
                        let blob = new Blob([res.responseText], { type: "application/xml" });
                        window.saveAs(blob, filename);
                    } else {
                        console.error("请求失败:", apiUrl, res.status);
                    }
                    resolve();
                },
                onerror: function(err) {
                    console.error("请求错误:", apiUrl, err);
                    resolve();
                }
            });
        });
    }

    // 下载当前页面弹幕
    async function downloadCurrent() {
        const url = location.href;
        const id = getIdFromUrl(url);
        if (!id) return alert("未获取到 soundid。");
        const apiUrl = `https://www.missevan.com/sound/getdm?soundid=${id}`;
        const title = document.title.trim().replace(/[\/\\:*?"<>|]/g, "_");
        await downloadXml(apiUrl, `${title}.xml`);
    }

    // 下载所有记录弹幕
    async function downloadAll() {
        if (records.length === 0) return alert("没有记录可下载。");

        for (let r of records) {
            let id = getIdFromUrl(r.url);
            if (!id) {
                console.warn("未找到id:", r.url);
                continue;
            }
            const apiUrl = `https://www.missevan.com/sound/getdm?soundid=${id}`;
            let safeTitle = r.title.trim().replace(/[\/\\:*?"<>|]/g, "_");
            console.log("请求弹幕:", apiUrl);
            await downloadXml(apiUrl, `${safeTitle}.xml`);
        }
    }

    // 更新菜单
    function updateMenu() {
        for (let id of menuIds) GM_unregisterMenuCommand(id);
        menuIds = [];

        menuIds.push(GM_registerMenuCommand("① " + (recording ? "暂停记录" : "开始记录"), toggleRecording));
        menuIds.push(GM_registerMenuCommand("② 清空记录 (" + records.length + ")", clearRecords));
        menuIds.push(GM_registerMenuCommand("③ 查看记录 (" + records.length + ")", viewRecords));
        menuIds.push(GM_registerMenuCommand("④ 下载记录 (link.json)", downloadRecords));
        menuIds.push(GM_registerMenuCommand("⑤ 下载当前弹幕", downloadCurrent));
        menuIds.push(GM_registerMenuCommand("⑥ 下载所有弹幕", downloadAll));
    }

    // 页面加载时：如果正在记录，先安全写一次
    if (recording) {
        safeAddRecord(location.href);
    }

    // 定时检测 url 变化（处理SPA路由切换）
    setInterval(() => {
        if (!recording) return;
        if (location.href !== lastUrl) {
            let newUrl = location.href;
            lastUrl = newUrl;
            safeAddRecord(newUrl);
        }
    }, 1000);

    updateMenu();


})();
