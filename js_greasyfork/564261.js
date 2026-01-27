// ==UserScript==
// @name         百度贴吧自动签到 (极简·空气悬浮版)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  无感空气动效，纯白底适配，带自动存储清理机制，每天仅运行一次
// @author       Gemini Revised
// @match        https://tieba.baidu.com/*
// @grant        GM_xmlhttpRequest
// @connect      tieba.baidu.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/564261/%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0%20%28%E6%9E%81%E7%AE%80%C2%B7%E7%A9%BA%E6%B0%94%E6%82%AC%E6%B5%AE%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/564261/%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0%20%28%E6%9E%81%E7%AE%80%C2%B7%E7%A9%BA%E6%B0%94%E6%82%AC%E6%B5%AE%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = "tieba_sign_done_v1_1"; // 当前版本唯一键
    const today = new Date().toLocaleDateString();

    // --- 洁癖逻辑：清理旧版残留数据 ---
    Object.keys(localStorage).forEach(key => {
        if (key.startsWith("tieba_sign_done") && key !== STORAGE_KEY) {
            localStorage.removeItem(key);
        }
    });

    // --- 每日运行一次时间锁 ---
    if (localStorage.getItem(STORAGE_KEY) === today) return;

    const style = document.createElement('style');
    style.innerHTML = `
        #tieba-sign-ui {
            position: fixed; top: 120px; right: 40px; z-index: 20000;
            width: 160px; height: 120px; padding: 20px; border-radius: 28px;
            background: rgba(255, 255, 255, 0.82);
            backdrop-filter: blur(25px) saturate(170%);
            -webkit-backdrop-filter: blur(25px) saturate(170%);
            border: 1px solid rgba(255, 255, 255, 0.5);
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.05);
            display: flex; flex-direction: column;
            align-items: center; justify-content: space-between;
            opacity: 0;
            transform: translateY(10px) scale(0.98);
            transition: all 0.8s cubic-bezier(0.2, 1, 0.2, 1);
            pointer-events: none;
        }
        #tieba-sign-ui.show { opacity: 1; transform: translateY(0) scale(1); }
        #tieba-sign-ui.hide { opacity: 0; transform: translateY(-20px); filter: blur(10px); }
        .ui-row { flex: 1; width: 100%; display: flex; align-items: center; justify-content: center; overflow: hidden; }
        .ui-text { font-family: "PingFang SC", "Microsoft YaHei", sans-serif; transition: all 0.4s ease; }
        .ui-title { font-size: 14px; font-weight: 600; color: #1a1a1a; }
        .ui-name { font-size: 12px; color: #999; white-space: nowrap; text-overflow: ellipsis; overflow: hidden; }
        .ui-exp {
            font-size: 11px; font-weight: 700; color: #007aff;
            background: rgba(0, 122, 255, 0.06);
            padding: 2px 12px; border-radius: 20px;
        }
        .ui-progress-bar { width: 100%; height: 3px; background: rgba(0,0,0,0.04); border-radius: 10px; margin-top: 5px; }
        .ui-progress-inner { height: 100%; width: 0%; background: #007aff; border-radius: 10px; transition: width 0.6s ease; }
    `;
    document.head.appendChild(style);

    const statusDiv = document.createElement('div');
    statusDiv.id = "tieba-sign-ui";
    statusDiv.innerHTML = `
        <div class="ui-row"><div class="ui-text ui-title">初始化...</div></div>
        <div class="ui-row"><div class="ui-text ui-name">获取列表中</div></div>
        <div class="ui-row"><div class="ui-text ui-exp">准备绪</div></div>
        <div class="ui-progress-bar"><div class="ui-progress-inner" id="ui-bar"></div></div>
    `;
    document.body.appendChild(statusDiv);

    setTimeout(() => statusDiv.classList.add('show'), 500);

    const request = (details) => new Promise((res, rej) => GM_xmlhttpRequest({ ...details, onload: res, onerror: rej }));
    const sleep = (ms) => new Promise(r => setTimeout(r, ms));

    async function startSigning() {
        try {
            const tbsRes = await request({ method: "GET", url: "https://tieba.baidu.com/dc/common/tbs" });
            const tbs = JSON.parse(tbsRes.responseText).tbs;

            if (!tbs || tbs === "000000000000000000") {
                statusDiv.classList.replace('show', 'hide');
                return;
            }

            const listRes = await request({ method: "GET", url: "https://tieba.baidu.com/f/like/mylike?pn=1" });
            const parser = new DOMParser();
            const doc = parser.parseFromString(listRes.responseText, 'text/html');
            const links = doc.querySelectorAll('a[title]');
            const forumList = Array.from(new Set(Array.from(links).filter(l => l.href.includes('/f?kw=')).map(l => l.title)));

            if (forumList.length === 0) {
                localStorage.setItem(STORAGE_KEY, today);
                statusDiv.classList.replace('show', 'hide');
                return;
            }

            statusDiv.querySelector('.ui-title').innerText = "自动签到中";

            for (let i = 0; i < forumList.length; i++) {
                const kw = forumList[i];
                const nameEl = statusDiv.querySelector('.ui-name');
                const expEl = statusDiv.querySelector('.ui-exp');

                nameEl.style.opacity = "0";

                const res = await request({
                    method: "POST",
                    url: "https://tieba.baidu.com/sign/add",
                    data: `ie=utf-8&kw=${encodeURIComponent(kw)}&tbs=${tbs}`,
                    headers: { "Content-Type": "application/x-www-form-urlencoded" }
                });

                const data = JSON.parse(res.responseText);
                document.getElementById('ui-bar').style.width = Math.round(((i + 1) / forumList.length) * 100) + "%";

                setTimeout(() => {
                    nameEl.innerText = kw;
                    nameEl.style.opacity = "1";
                    if (data.no === 0) {
                        let expNum = (data.data && data.data.uinfo && data.data.uinfo.cont_sign_num >= 3) ? 4 : 2;
                        expEl.innerText = `经验 +${expNum}`;
                    } else {
                        expEl.innerText = "今日已签过";
                    }
                }, 200);

                await sleep(Math.floor(Math.random() * 500 + 800));
            }

            localStorage.setItem(STORAGE_KEY, today);
            statusDiv.querySelector('.ui-title').innerText = "签到完成";
            statusDiv.querySelector('.ui-name').innerText = "又是 +3 的一天";
            statusDiv.querySelector('.ui-name').style.color = "#007aff";
            statusDiv.querySelector('.ui-name').style.fontWeight = "600";
            statusDiv.querySelector('.ui-exp').innerText = "任务达成";

            setTimeout(() => {
                statusDiv.classList.replace('show', 'hide');
                setTimeout(() => statusDiv.remove(), 1000);
            }, 2500);

        } catch (err) {
            statusDiv.classList.replace('show', 'hide');
        }
    }

    setTimeout(startSigning, 1500);
})();