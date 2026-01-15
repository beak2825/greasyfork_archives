// ==UserScript==
// @name         MilkyWayIdle Dungeon Key Notifier (Discord Embed)
// @namespace    https://github.com/yourname/mwidle-key-notifier
// @version      2.0
// @description  發送地下城鑰匙數量到 Discord（Embed + 5 分鐘時間過濾）
// @author       YourName
// @match        https://www.milkywayidle.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/562614/MilkyWayIdle%20Dungeon%20Key%20Notifier%20%28Discord%20Embed%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562614/MilkyWayIdle%20Dungeon%20Key%20Notifier%20%28Discord%20Embed%29.meta.js
// ==/UserScript==
(function () {
    'use strict';

    const WEBHOOK_URL = "[URL]"; // ← 換成你的 Discord Webhook
    const MAX_MINUTES = 5; // 只允許幾分鐘內的訊息

    const sentMessages = new Set();

    // 發送 Discord Embed
    function sendEmbed(timeText, players) {
        const fields = players.map(p => ({
            name: p.name,
            value: `🗝 ${p.keys}`,
            inline: true
        }));

        fetch(WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                embeds: [{
                    title: "🗝 Milky Way Idle — 海賊基地",//可自行更改想要的名稱
                    color: 3447003, // Discord 藍
                    fields: fields,
                    footer: {
                        text: `時間：${timeText}`
                    }
                }]
            })
        });
    }

    // 解析 [1/13 下午5:00:09] → Date
    function parseChatTime(timeStr) {
        const now = new Date();
        const year = now.getFullYear();

        const match = timeStr.match(/(\d+)\/(\d+)\s+(上午|下午)(\d+):(\d+):(\d+)/);
        if (!match) return null;

        let [, month, day, ap, hour, min, sec] = match;
        hour = parseInt(hour, 10);
        min = parseInt(min, 10);
        sec = parseInt(sec, 10);

        if (ap === "下午" && hour < 12) hour += 12;
        if (ap === "上午" && hour === 12) hour = 0;

        return new Date(year, month - 1, day, hour, min, sec);
    }

    function isRecent(date) {
        const diffMin = (Date.now() - date.getTime()) / 1000 / 60;
        return diffMin <= MAX_MINUTES;
    }

    const observer = new MutationObserver(mutations => {
        for (const m of mutations) {
            for (const node of m.addedNodes) {
                if (!node.innerText) continue;
                if (!node.innerText.includes("钥匙数量:")) continue;
                if (sentMessages.has(node.innerText)) continue;

                const raw = node.innerText;

                // 解析時間
                const timeMatch = raw.match(/\[(.*?)\]/);
                if (!timeMatch) continue;

                const chatDate = parseChatTime(timeMatch[1]);
                if (!chatDate || !isRecent(chatDate)) {
                    sentMessages.add(raw);
                    continue;
                }

                // 解析玩家資料
                const data = raw.split("钥匙数量:")[1];
                const matches = [...data.matchAll(/\[(.*?) - (\d+)\]/g)];
                if (!matches.length) continue;

                const players = matches.map(m => ({
                    name: m[1],
                    keys: m[2]
                }));

                console.log("✅ 發送 Embed Discord 通知");
                sendEmbed(timeMatch[1], players);
                sentMessages.add(raw);
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
    console.log("🔔 MWI Discord Embed Notifier 已啟動");
})();