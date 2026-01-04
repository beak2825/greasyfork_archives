// ==UserScript==
// @name         搜刮动态 v1.0
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  针对B站特定个人动态页面的日期跳转及获取等。
// @author       NINA
// @match        https://space.bilibili.com/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/spark-md5/3.0.2/spark-md5.min.js
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557736/%E6%90%9C%E5%88%AE%E5%8A%A8%E6%80%81%20v10.user.js
// @updateURL https://update.greasyfork.org/scripts/557736/%E6%90%9C%E5%88%AE%E5%8A%A8%E6%80%81%20v10.meta.js
// ==/UserScript==

/* global SparkMD5 */

(function() {
    'use strict';


    const STYLES = `
        #tm-panel {
            position: fixed; bottom: 80px; right: 20px;
            width: 320px; height: 460px;
            min-width: 260px; min-height: 280px;
            background: white; z-index: 99999; border-radius: 8px;
            box-shadow: 0 4px 16px rgba(0,0,0,0.2); font-family: "PingFang SC", sans-serif;
            border: 1px solid #e7e7e7;
            display: flex; flex-direction: column;
            resize: both; overflow: hidden;
        }
        .tm-header {
            padding: 10px; background: #f6f6f6; border-bottom: 1px solid #eee;
            border-radius: 8px 8px 0 0; display: flex; justify-content: space-between; align-items: center;
            cursor: move; user-select: none; flex-shrink: 0;
        }
        .tm-ctrl-group { display: flex; gap: 10px; align-items: center; }
        .tm-icon-btn { cursor: pointer; color: #999; font-weight: bold; font-size: 16px; transition: color 0.2s; line-height: 1; }
        .tm-icon-btn:hover { color: #fb7299; }
        .tm-body { padding: 10px; display: flex; flex-direction: column; flex: 1; overflow: hidden; gap: 8px; }


        .tm-input-row { display: flex; width: 100%; gap: 5px; align-items: center; }
        .tm-input {
            height: 32px; padding: 0 5px; border: 1px solid #ddd; border-radius: 4px;
            text-align: center; box-sizing: border-box; outline: none; font-size: 13px; min-width: 0;
        }
        .tm-input:focus { border-color: #00a1d6; }

        /* 比例分配 */
        #tm-year  { flex: 3; }
        #tm-month { flex: 2; }
        #tm-day   { flex: 2; }
        #tm-btn {
            flex: 2; cursor: pointer; background: #00a1d6; color: white;
            border: none; border-radius: 4px; height: 32px; font-size: 13px;
            white-space: nowrap; transition: background 0.2s;
        }
        #tm-btn:hover { background: #00b5e5; }


        .tm-option-row { display: flex; align-items: center; font-size: 12px; color: #666; user-select: none; }
        .tm-checkbox { margin-right: 4px; vertical-align: middle; }


        .tm-input::-webkit-outer-spin-button, .tm-input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        .tm-input[type=number] { -moz-appearance: textfield; }
        .tm-sep { color: #999; font-weight: bold; flex-shrink: 0; }

        #tm-filter { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 12px; box-sizing: border-box; outline: none; }
        #tm-result-list { flex: 1; overflow-y: auto; border-top: 1px dashed #eee; padding-top: 5px; }
        #tm-result-list::-webkit-scrollbar { width: 5px; }
        #tm-result-list::-webkit-scrollbar-thumb { background: #ddd; border-radius: 3px; }

        #tm-floating-ball {
            position: fixed; bottom: 100px; right: 20px; width: 45px; height: 45px;
            background: #00a1d6; color: white; border-radius: 50%;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3); z-index: 100000;
            display: none; align-items: center; justify-content: center;
            font-size: 22px; cursor: move; user-select: none;
        }
        #tm-floating-ball:active { transform: scale(0.95); }
    `;


    const STATE = {
        isScanning: false,
        foundItems: [],
        targetMid: null
    };

    const CONFIG = { delay: 800, maxPages: 1000 };
    const sleep = (ms) => new Promise(r => setTimeout(r, ms));


    function getTargetMid() { return window.location.pathname.split('/')[1] || null; }

    function getSafePubTime(item) {
        try {
            let ts = null;
            if (item?.modules?.module_author?.pub_ts) ts = item.modules.module_author.pub_ts;
            else if (item?.modules?.module_dynamic?.major?.archive?.pub_ts) ts = item.modules.module_dynamic.major.archive.pub_ts;
            else if (item?.modules?.module_author?.pub_time) {
                const text = item.modules.module_author.pub_time;
                if (typeof text === 'string' && text.indexOf('年') > -1) {
                   const dateStr = text.replace('年','/').replace('月','/').replace('日','');
                   return new Date(dateStr).getTime() / 1000;
                }
            }
            if (ts) return parseInt(ts, 10);
            return null;
        } catch (e) { return null; }
    }
    function formatTs(ts) { return !ts ? "未知" : new Date(ts * 1000).toLocaleString(); }

    const Wbi = {
        mixinKeyEncTab: [46, 47, 18, 2, 53, 8, 23, 32, 15, 50, 10, 31, 58, 3, 45, 35, 27, 43, 5, 49, 33, 9, 42, 19, 29, 28, 14, 39, 12, 38, 41, 13, 37, 48, 7, 16, 24, 55, 40, 61, 26, 17, 0, 1, 60, 51, 30, 4, 22, 25, 54, 21, 56, 59, 6, 63, 57, 62, 11, 36, 20, 34, 44, 52],
        async getWbiKeys() {
            const res = await fetch('https://api.bilibili.com/x/web-interface/nav');
            const json = await res.json();
            const { img_url, sub_url } = json.data.wbi_img;
            return {
                img_key: img_url.substring(img_url.lastIndexOf('/') + 1, img_url.lastIndexOf('.')),
                sub_key: sub_url.substring(sub_url.lastIndexOf('/') + 1, sub_url.lastIndexOf('.'))
            };
        },
        getMixinKey(orig) { return this.mixinKeyEncTab.map(n => orig[n]).join('').slice(0, 32); },
        encode(params, img_key, sub_key) {
            const mixin_key = this.getMixinKey(img_key + sub_key);
            const curr_time = Math.round(Date.now() / 1000);
            const chr_filter = /[!'\(\)*]/g;
            const newParams = { ...params, wts: curr_time };
            const query = Object.keys(newParams).sort().map(key => {
                const value = newParams[key].toString().replace(chr_filter, '');
                return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
            }).join('&');
            const w_rid = SparkMD5.hash(query + mixin_key);
            return query + '&w_rid=' + w_rid;
        }
    };

    async function fetchDynamicHistory(host_mid, offset = '') {
        try {
            const keys = await Wbi.getWbiKeys();
            const params = { host_mid: host_mid, offset: offset, timezone_offset: -480, features: 'itemOpusStyle' };
            const queryString = Wbi.encode(params, keys.img_key, keys.sub_key);
            const url = `https://api.bilibili.com/x/polymer/web-dynamic/v1/feed/space?${queryString}`;
            const response = await fetch(url, {
                method: 'GET', credentials: 'include',
                headers: { 'Accept': 'application/json', 'Referer': window.location.href, 'User-Agent': navigator.userAgent }
            });
            if (!response.ok) return null;
            const data = await response.json();
            return data.code === 0 ? data.data : null;
        } catch (e) { return null; }
    }


    async function startScan(targetYear, targetMonth, targetDay) {
        STATE.targetMid = getTargetMid();
        if (!STATE.targetMid) return updateLog("❌ 未找到UID", "red");


        const collectAll = document.getElementById('tm-collect-all').checked;

        let targetStart, targetEnd, targetName;
        if (targetDay) {
            targetName = `${targetYear}/${targetMonth}/${targetDay}`;
            targetStart = new Date(targetYear, targetMonth - 1, targetDay, 0, 0, 0).getTime() / 1000;
            targetEnd = new Date(targetYear, targetMonth - 1, targetDay, 23, 59, 59).getTime() / 1000;
        } else {
            targetName = `${targetYear}/${targetMonth}`;
            targetStart = new Date(targetYear, targetMonth - 1, 1, 0, 0, 0).getTime() / 1000;
            targetEnd = new Date(targetYear, targetMonth, 0, 23, 59, 59).getTime() / 1000;
        }

        STATE.isScanning = true;
        STATE.foundItems = [];
        updateUIState(true);
        updateLog(`🚀 目标: ${targetName} ${collectAll ? "(收集沿途)" : "(精准模式)"}`, "#00a1d6");
        renderList([]);

        let offset = '';
        let hasMore = true;
        let pageCount = 0;

        while (STATE.isScanning && hasMore && pageCount < CONFIG.maxPages) {
            pageCount++;
            const data = await fetchDynamicHistory(STATE.targetMid, offset);

            if (!data || !data.items || data.items.length === 0) {
                updateLog("⚠️ 数据链结束", "orange");
                break;
            }


            let lastTime = null;
            for (let i = data.items.length - 1; i >= 0; i--) {
                const t = getSafePubTime(data.items[i]);
                if (t && !isNaN(t)) { lastTime = t; break; }
            }

            if (!lastTime) {
                updateLog(`⚠️ P${pageCount} 无有效时间`, "orange");
                offset = data.offset;
                await sleep(CONFIG.delay);
                continue;
            }

            const currStr = formatTs(lastTime);
            updateLog(`扫描 P${pageCount} (达: ${currStr})`, "#666");


            const hitItems = data.items.filter(item => {
                if (collectAll) return true;


                const t = getSafePubTime(item);
                return t && t >= targetStart && t <= targetEnd;
            });

            if (hitItems.length > 0) {
                STATE.foundItems.push(...hitItems);
                renderList(STATE.foundItems);
            }

            // 3. 停止条件 (即使在收集模式，到了日期也该停了)
            if (lastTime < targetStart) {
                updateLog(`✅ 完成！已越过目标日期`, "green");
                break;
            }

            offset = data.offset;
            hasMore = data.has_more;
            await sleep(CONFIG.delay);
        }

        STATE.isScanning = false;
        updateUIState(false);
        if(STATE.foundItems.length > 0) updateLog(`🎉 结束，共 ${STATE.foundItems.length} 条`, "#00a1d6");
        else updateLog(`🏁 结束，未发现动态`, "#999");
    }


    function injectCSS() {
        const style = document.createElement('style');
        style.innerHTML = STYLES;
        document.head.appendChild(style);
    }
    function updateLog(msg, color="black") {
        const el = document.getElementById('tm-log');
        if(el) el.innerHTML = `<span style="color:${color}">${msg}</span>`;
    }
    function updateUIState(scanning) {
        const btn = document.getElementById('tm-btn');
        if(!btn) return;
        if(scanning) {
            btn.innerText = "停止";
            btn.style.background = "#fb7299";
        } else {
            btn.innerText = "Go";
            btn.style.background = "#00a1d6";
        }
    }
    function renderList(items) {
        const listDiv = document.getElementById('tm-result-list');
        const countSpan = document.getElementById('tm-count');
        if(countSpan) countSpan.innerText = items.length;
        if (items.length === 0) {
            listDiv.innerHTML = `<div style="padding:10px;text-align:center;color:#ccc;">暂无结果</div>`;
            return;
        }
        let html = '';
        items.forEach(item => {
            const ts = getSafePubTime(item);
            const timeStr = formatTs(ts);
            const id = item.id_str;
            let text = "分享内容";
            try {
                 text = item.modules.module_dynamic.desc?.text ||
                        item.modules.module_dynamic.major?.archive?.title ||
                        item.modules.module_dynamic.major?.opus?.summary?.text ||
                        "图片/转发/特殊动态";
            } catch(e){}
            if(text.length > 30) text = text.substring(0, 30) + "...";
            html += `
                <div style="border-bottom:1px solid #eee; padding:6px 0; font-size:12px;">
                    <div style="color:#999;font-size:11px;">${timeStr}</div>
                    <div style="margin:2px 0;">${text}</div>
                    <a href="https://t.bilibili.com/${id}" target="_blank" style="color:#00a1d6;text-decoration:none;">🔗 跳转</a>
                </div>
            `;
        });
        listDiv.innerHTML = html;
    }
    function doLocalSearch(keyword) {
        if (STATE.foundItems.length === 0) return;
        const safeKeyword = keyword.trim().toLowerCase();
        if (!safeKeyword) { renderList(STATE.foundItems); return; }
        const filtered = STATE.foundItems.filter(item => {
            const timeStr = formatTs(getSafePubTime(item));
            let descText = JSON.stringify(item).toLowerCase();
            return timeStr.includes(safeKeyword) || descText.includes(safeKeyword);
        });
        renderList(filtered);
    }
    function enableDrag(element, trigger) {
        let isDragging = false, startX, startY, initialLeft, initialTop;
        trigger.addEventListener('mousedown', (e) => {
            isDragging = true; startX = e.clientX; startY = e.clientY;
            const rect = element.getBoundingClientRect(); initialLeft = rect.left; initialTop = rect.top; e.preventDefault();
        });
        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            element.style.left = `${initialLeft + (e.clientX - startX)}px`;
            element.style.top = `${initialTop + (e.clientY - startY)}px`;
            element.style.bottom = 'auto'; element.style.right = 'auto';
        });
        window.addEventListener('mouseup', () => isDragging = false);
    }
    function toggleMinimize() {
        const panel = document.getElementById('tm-panel');
        const ball = document.getElementById('tm-floating-ball');
        if (panel.style.display !== 'none') { panel.style.display = 'none'; ball.style.display = 'flex'; }
        else { panel.style.display = 'flex'; ball.style.display = 'none'; }
    }

    function createUI() {
        if (document.getElementById('tm-panel')) return;
        injectCSS();
        const now = new Date();
        const panel = document.createElement('div');
        panel.id = 'tm-panel';
        panel.innerHTML = `
            <div class="tm-header">
                <span style="font-weight:bold; color:#fb7299;">📅 动态搜刮 v1.0</span>
                <div class="tm-ctrl-group">
                    <span class="tm-icon-btn" id="tm-min-btn" title="最小化">➖</span>
                    <span class="tm-icon-btn" onclick="this.closest('#tm-panel').remove()" title="关闭">✖</span>
                </div>
            </div>
            <div class="tm-body">
                <div class="tm-input-row">
                    <input type="number" id="tm-year" class="tm-input" value="${now.getFullYear()}" placeholder="年">
                    <span class="tm-sep">-</span>
                    <input type="number" id="tm-month" class="tm-input" value="${now.getMonth() + 1}" min="1" max="12" placeholder="月">
                    <span class="tm-sep">-</span>
                    <input type="number" id="tm-day" class="tm-input" placeholder="日" min="1" max="31">
                    <button id="tm-btn">Go</button>
                </div>

                <div class="tm-option-row">
                    <label style="cursor:pointer; display:flex; align-items:center;">
                        <input type="checkbox" id="tm-collect-all" class="tm-checkbox">
                        包含沿途动态 (暂停时保留数据)
                    </label>
                </div>

                <div id="tm-log" style="font-size:12px; color:#666; min-height:18px; overflow:hidden; white-space:nowrap;">准备就绪</div>
                <input type="text" id="tm-filter" placeholder="🔍 结果内搜索...">

                <div style="background:#f9f9f9; padding:5px; font-size:12px; color:#666; border-bottom:1px dashed #eee;">
                    已找到: <span id="tm-count" style="font-weight:bold; color:#00a1d6">0</span> 条
                </div>
                <div id="tm-result-list"></div>
            </div>
        `;
        document.body.appendChild(panel);
        const ball = document.createElement('div');
        ball.id = 'tm-floating-ball'; ball.title = "点击还原"; ball.innerHTML = "🕒";
        ball.onclick = (e) => { if(!ball.hasMoved) toggleMinimize(); ball.hasMoved = false; };
        ball.addEventListener('mousedown', () => ball.hasMoved = false);
        ball.addEventListener('mousemove', () => ball.hasMoved = true);
        document.body.appendChild(ball);

        document.getElementById('tm-btn').onclick = () => {
            if (STATE.isScanning) {
                STATE.isScanning = false;
                updateLog("🛑 已停止", "red");
                updateUIState(false);
            } else {
                const y = parseInt(document.getElementById('tm-year').value);
                const m = parseInt(document.getElementById('tm-month').value);
                const d = parseInt(document.getElementById('tm-day').value);
                if (!y || !m) return alert("请填写年月");
                startScan(y, m, d);
            }
        };
        document.getElementById('tm-filter').addEventListener('input', (e) => doLocalSearch(e.target.value));
        document.getElementById('tm-min-btn').onclick = toggleMinimize;
        enableDrag(panel, panel.querySelector('.tm-header'));
        enableDrag(ball, ball);
    }
    setTimeout(createUI, 1500);
})();