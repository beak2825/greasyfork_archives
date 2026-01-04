// ==UserScript==
// @name         C6自动回复兼容免代
// @namespace    http://tampermonkey.net/
// @version      4.3.2
// @description  懂的自然懂
// @match        http*://*/htm_data/*/*/*
// @match        http*://*/htm_mob/*/*/*
// @match        http*://*/thread0806.php?*
// @match        http*://*/read.php?*
// @match        http*://*/profile.php*
// @license      LGPL-2.0-or-later
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/559515/C6%E8%87%AA%E5%8A%A8%E5%9B%9E%E5%A4%8D%E5%85%BC%E5%AE%B9%E5%85%8D%E4%BB%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/559515/C6%E8%87%AA%E5%8A%A8%E5%9B%9E%E5%A4%8D%E5%85%BC%E5%AE%B9%E5%85%8D%E4%BB%A3.meta.js
// ==/UserScript==

(function() {
'use strict';

/* =========================================================
   ① 全局变量
   ========================================================= */
let serverTimeOffset = 0;
let baseClock = null;
let baseSystem = null;
let clockTimer = null;
let timeFetched = false;

let activeTimers = [];
let isRunning = false;
let completedReplies = 0;
let failedReplies = 0;
let totalReplies = 0;

let accounts = GM_getValue("reply_accounts", []);
if (!Array.isArray(accounts)) accounts = [];

let savedTids = GM_getValue("saved_tids", []);
if (!Array.isArray(savedTids)) savedTids = [];

const UI = {};

/* =========================================================
   ② 工具函数
   ========================================================= */
function addLog(msg) {
    if (!UI.log) return;
    UI.log.style.display = "block";
    UI.log.innerHTML += `<br>${msg}`;
    UI.log.scrollTop = UI.log.scrollHeight;
}

function safeRequest(options) {
    return new Promise((resolve) => {
        // 移除显式的proxy设置，使用浏览器代理设置
        GM_xmlhttpRequest({
            ...options,
            onload: (resp) => resolve({ ok: true, resp }),
            onerror: (err) => resolve({ ok: false, err }),
            ontimeout: (err) => resolve({ ok: false, err })
        });
    });
}

function clearAllTimers() {
    activeTimers.forEach(id => clearTimeout(id));
    activeTimers = [];
}

function formatTime(dateObj) {
    if (!(dateObj instanceof Date)) return "";
    return dateObj.toLocaleTimeString();
}

/* ===== 下注助手：解析表格 ===== */
function extractBetTable(html) {
    const div = document.createElement("div");
    div.innerHTML = html;

    const postContent = div.querySelector('.tpc_content');
    if (!postContent) return null;

    const table = postContent.querySelector('table');
    if (!table) return null;

    const rows = table.querySelectorAll('tr');
    const headerCells = rows[0].querySelectorAll('td');
    const hasDraw = Array.from(headerCells).some(c => c.textContent.includes('平局'));

    const dataRows = Array.from(rows).slice(1);
    const tableData = [];

    dataRows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (hasDraw) {
            tableData.push([
                cells[1].textContent.trim(),
                cells[2].textContent.trim(),
                cells[3].textContent.trim()
            ]);
        } else {
            tableData.push([
                cells[1].textContent.trim(),
                cells[3].textContent.trim()
            ]);
        }
    });

    return tableData;
}

/* ===== 下注助手：随机选择 ===== */
function getRandomBetResult(tableData) {
    const result = [];
    for (let i = 0; i < tableData.length; i++) {
        const row = tableData[i];
        const pick = Math.random() < 0.5 ? 0 : 1;
        result.push(row[pick]);
    }
    return result;
}

/* ===== 一键下注：抓取今日有效 tid ===== */
async function fetchTodayOpenTids(cookieVal, uaVal, uid) {
    const domain = location.origin;
    const host = location.host;

    const { ok, resp } = await safeRequest({
        method: "GET",
        url: `${domain}/thread0806.php?fid=23&search=today`,
        anonymous: true,
        headers: {
            "Host": host,
            "Connection": "keep-alive",
            "Pragma": "no-cache",
            "Cache-Control": "no-cache",
            "Upgrade-Insecure-Requests": "1",
            "User-Agent": uaVal,
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
            "Referer": `${domain}/`,
            "Cookie": cookieVal + "; ismob=0"
        }
    });

    if (!ok || !resp) {
        addLog("❌ 无法访问 thread0806.php");
        return [];
    }

    const html = resp.responseText;
    const blocks = html.match(/<td class="tal"[\s\S]*?<\/td>/gi) || [];
    const now = new Date();
    const tids = [];

    for (const block of blocks) {
        if (!block.includes("[開盤]")) continue;

        // 提取 tid
        const tidMatch = block.match(/id=["']t(\d+)["']/);
        if (!tidMatch) continue;
        const tid = tidMatch[1];

        // 提取真实路径
        const hrefMatch = block.match(/href=["']([^"']+htm_data[^"']+)["']/);
        let realPath = null;
        if (hrefMatch) {
            realPath = hrefMatch[1]; // 例如 /htm_data/2512/23/7081995.html
        }

        // 提取截止时间
        const timeMatch = block.match(/下注截止时间：(\d{4}-\d{2}-\d{2} \d{2}:\d{2})/);
        if (!timeMatch) continue;
        const endTime = new Date(timeMatch[1].replace(/-/g, "/"));

        if (endTime > now && !savedTids.includes(`${tid}_${uid}`)) {
            tids.push({ tid, url: realPath });
        }
    }

    return tids;
}


/* ===== 访问 tid 页面并生成随机下注内容 ===== */
async function fetchTidBetPreview(item, ck, ua, betPoints) {
    const domain = location.origin;
    const host = location.host;

    // 如果有真实路径，直接访问
    const url = item.url ? `${domain}${item.url}` : `${domain}/read.php?tid=${item.tid}`;

    const { ok, resp } = await safeRequest({
        method: "GET",
        url,
        anonymous: true,
        headers: {
            "Host": host,
            "Connection": "keep-alive",
            "Pragma": "no-cache",
            "Cache-Control": "no-cache",
            "Upgrade-Insecure-Requests": "1",
            "User-Agent": ua,
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
            "Referer": `${domain}/read.php?tid=${item.tid}`,
            "Cookie": ck + "; ismob=0"
        }
    });

    if (!ok || !resp) {
        return { tid: item.tid, title: "加载失败", betText: "" };
    }

    const html = resp.responseText;
    let title = "未知标题";
    const m = html.match(/<title>(.*?)<\/title>/i);
    if (m) title = m[1].replace(/ - .*?论坛.*/,"").trim();

    const tableData = extractBetTable(html);
    if (!tableData) {
        return { tid: item.tid, title, betText: "" };
    }

    const picks = getRandomBetResult(tableData);
    let betText = "";
    picks.forEach((p, i) => {
        betText += `${i+1}.下注球隊：${p}\n`;
    });
    betText += `下注点数：${betPoints}`;

    return { tid: item.tid, title, betText };
}


/* ===== 批量下注执行 ===== */
async function startBatchBetting(list, ck, ua, uid) {
    if (!list || list.length === 0) {
        addLog("❌ 没有可下注的 tid");
        return;
    }

    addLog(`▶ 开始批量下注，共 ${list.length} 个`);

    let index = 0;
    let successCount = 0;
    let failCount = 0;

    async function next() {
        if (index >= list.length) {
            addLog(`🎉 批量下注完成：成功 ${successCount} 个，失败 ${failCount} 个`);
            return;
        }

        const item = list[index];
        index++;

        addLog(`▶ 正在下注 tid=${item.tid}`);

        getVerify("23", item.tid, ck, ua, async (verify) => {
            if (!verify) {
                addLog(`❌ 获取 verify 失败，跳过 tid=${item.tid}`);
                failCount++;
                return setTimeout(next, 2000);
            }

            try {
                await sendReply("23", item.tid, item.content, ck, ua, verify, index);
                successCount++;
                // 改造：保存 tid+uid
                savedTids.push(`${item.tid}_${uid}`);
                GM_setValue("saved_tids", savedTids);
            } catch (e) {
                addLog(`❌ 下注失败 tid=${item.tid}`);
                failCount++;
            }

            setTimeout(next, 2000);
        });
    }

    next();
}
/* =========================================================
   统一 headers 构造函数
   ========================================================= */
function buildHeaders(uaVal, cookieVal, isPost = false, tid = "") {
    const headers = {
        "User-Agent": uaVal || navigator.userAgent,
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
        "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
        "Accept-Encoding": "gzip, deflate, br",
        "Connection": "keep-alive",
        "Upgrade-Insecure-Requests": "1"
    };

    if (cookieVal) {
        headers["Cookie"] = cookieVal.endsWith(";") ? cookieVal : cookieVal + ";";
    }

    if (isPost) {
        headers["Content-Type"] = "application/x-www-form-urlencoded";
        headers["Origin"] = location.origin;
        headers["Referer"] = `${location.origin}/read.php?tid=${tid}`;
        headers["Cache-Control"] = "max-age=0";
    }

    return headers;
}

/* =========================================================
   ③ 时间校准模块
   ========================================================= */
function updateTimeDisplay() {
    if (baseClock && baseSystem && UI.timeDisplay) {
        const diff = Date.now() - baseSystem;
        const newClock = new Date(baseClock.getTime() + diff);
        const offsetSec = Math.round(serverTimeOffset / 1000);
        UI.timeDisplay.textContent =
            `服务器时间: ${formatTime(newClock)} (偏移: ${offsetSec} 秒)`;
    }
}

async function calibrateServerTime() {
    const fid = UI.fidInput.value.trim() || "0";
    const tid = UI.tidInput.value.trim() || "0";
    const cookieVal = UI.cookieInput.value.trim();
    const uaVal = UI.uaInput.value.trim() || navigator.userAgent;

    addLog("开始校准服务器时间...");
    const headUrl = `/post.php?action=reply&fid=${fid}&tid=${tid}&_=${Date.now()}`;
    const headRes = await safeRequest({
        method: "HEAD", url: headUrl,
        headers: buildHeaders(uaVal, cookieVal)
    });

    if (headRes.ok && headRes.resp) {
        const rawHeaders = headRes.resp.responseHeaders || "";
        const dateMatch = rawHeaders.match(/Date:\s*(.+?)\r?\n/i);
        if (dateMatch && dateMatch[1]) {
            const serverTime = new Date(dateMatch[1]);
            const localTime = new Date();
            serverTimeOffset = serverTime.getTime() - localTime.getTime();
            baseClock = new Date(serverTime.getTime());
            baseSystem = Date.now();
            addLog(`✔ 校准成功: ${serverTime.toLocaleString()}`);
            if (clockTimer) clearInterval(clockTimer);
            clockTimer = setInterval(updateTimeDisplay, 1000);
            timeFetched = true;
            updateTimeDisplay();
            return;
        }
    }

    addLog("HEAD 未返回时间，尝试 GET...");
    await calibrateServerTimeGET(fid, tid, cookieVal, uaVal);
}

async function calibrateServerTimeGET(fid, tid, cookieVal, uaVal) {
    const url = `/post.php?action=reply&fid=${fid}&tid=${tid}&_=${Date.now()}`;
    const { ok, resp } = await safeRequest({
        method: "GET", url, anonymous: !!cookieVal,
        headers: buildHeaders(uaVal, cookieVal)
    });
    if (!ok || !resp) return;

    const html = resp.responseText;
    let serverTimestamp = null;

    let m10 = html.match(/(\d{10})/);
    if (m10) serverTimestamp = parseInt(m10[1], 10) * 1000;

    if (!serverTimestamp) {
        let m13 = html.match(/(\d{13})/);
        if (m13) serverTimestamp = parseInt(m13[1], 10);
    }

    if (!serverTimestamp) {
        let d = html.match(/20\d{2}[-/]\d{1,2}[-/]\d{1,2}\s+\d{1,2}:\d{1,2}:\d{1,2}/);
        if (d) serverTimestamp = new Date(d[0].replace(/-/g, "/")).getTime();
    }

    if (serverTimestamp) {
        baseClock = new Date(serverTimestamp);
        baseSystem = Date.now();
        serverTimeOffset = serverTimestamp - baseSystem;
        addLog(`✔ 校准成功: ${baseClock.toLocaleString()}`);
        if (clockTimer) clearInterval(clockTimer);
        clockTimer = setInterval(updateTimeDisplay, 1000);
        timeFetched = true;
        updateTimeDisplay();
    } else {
        addLog("❌ 无法解析服务器时间");
    }
}

async function fetchPageTimeOnOpen() {
    if (timeFetched) return;
    const fid = UI.fidInput.value.trim() || "0";
    const tid = UI.tidInput.value.trim() || "0";
    const cookieVal = UI.cookieInput.value.trim();
    const uaVal = UI.uaInput.value.trim() || navigator.userAgent;

    const url = `/post.php?action=reply&fid=${fid}&tid=${tid}`;
    const { ok, resp } = await safeRequest({
        method: "GET", url, anonymous: !!cookieVal,
        headers: buildHeaders(uaVal, cookieVal)
    });
    if (!ok || !resp) return;

    const html = resp.responseText;
    const tsMatch = html.match(/(\d{10})/);
    if (tsMatch) {
        const ts = parseInt(tsMatch[1], 10) * 1000;
        baseClock = new Date(ts);
        baseSystem = Date.now();
        timeFetched = true;
        if (clockTimer) clearInterval(clockTimer);
        clockTimer = setInterval(updateTimeDisplay, 1000);
        updateTimeDisplay();
    }
}

/* =========================================================
   ④ verify 获取模块
   ========================================================= */
let cachedVerify = null;
let verifyTimestamp = 0;

async function getVerify(fid, tid, cookieVal, uaVal, callback) {
    const domain = location.origin;
    const host = location.host;
    const url = `${domain}/post.php?action=reply&fid=${fid}&tid=${tid}&_=${Date.now()}`;

    addLog("开始获取 verify...");

    const { ok, resp } = await safeRequest({
        method: "GET",
        url,
        anonymous: true,
        headers: {
            "Host": host,
            "Connection": "keep-alive",
            "Cache-Control": "max-age=0",
            "Upgrade-Insecure-Requests": "1",
            "User-Agent": uaVal,
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
            "Referer": `${domain}/read.php?tid=${tid}`,
            "Origin": domain,
            "Cookie": cookieVal + "ismob=0"
        }
    });

    if (!ok || !resp) {
        addLog("❌ 获取 verify 请求失败");
        callback(null);
        return;
    }

    const raw = resp.responseText;
    const match = raw.match(/name=["']verify["'][^>]*value=["']([^"']+)["']/i);

    if (match) {
        cachedVerify = match[1];
        verifyTimestamp = Date.now();
        addLog(`✔ 成功获取 verify: ${cachedVerify}`);
        callback(cachedVerify);
    } else {
        addLog("❌ 未找到 verify（可能未登录或线路拒绝请求头）");
        callback(null);
    }
}
/* =========================================================
   ⑤ UI 构建模块 + 事件绑定
   ========================================================= */
function insertUI() {
    if (!document.body) return false;
    const frag = document.createDocumentFragment();

    /* —— 悬浮按钮 —— */
    const btn = document.createElement("button");
    btn.textContent = "自动回复";
    Object.assign(btn.style, {
        position: "fixed", bottom: "20px", right: "20px",
        zIndex: "999999", padding: "10px 15px",
        background: "#007bff", color: "#fff",
        border: "none", borderRadius: "5px",
        cursor: "pointer", fontSize: "14px"
    });
    frag.appendChild(btn);
    UI.floatBtn = btn;

    /* —— 主面板 —— */
    const panel = document.createElement("div");
    Object.assign(panel.style, {
        position: "fixed", top: "20px", right: "20px",
        zIndex: "10000", padding: "12px",
        background: "#f8f9fa", border: "1px solid #ccc",
        borderRadius: "6px", display: "none",
        width: "450px", boxSizing: "border-box"
    });
    frag.appendChild(panel);
    UI.panel = panel;

    const title = document.createElement("div");
    title.textContent = "自动回复设置";
    title.style.cssText = "font-size:14px;font-weight:bold;margin-bottom:8px;";
    panel.appendChild(title);

    const inputStyle = "width:100%;padding:5px;font-size:13px;box-sizing:border-box";

    /* —— 回复内容 —— */
    const textarea = document.createElement("textarea");
    textarea.rows = 5;
    textarea.placeholder = "内容支持多行，末尾自动加序号";
    textarea.style.cssText = inputStyle;
    panel.appendChild(textarea);
    UI.textarea = textarea;

    /* —— fid / tid / 间隔 —— */
    const row2 = document.createElement("div");
    row2.style.cssText = "display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin:10px 0;";
    panel.appendChild(row2);

    const fidInput = document.createElement("input");
    fidInput.placeholder = "Fid"; fidInput.style.cssText = inputStyle;
    row2.appendChild(fidInput); UI.fidInput = fidInput;

    const tidInput = document.createElement("input");
    tidInput.placeholder = "Tid"; tidInput.style.cssText = inputStyle;
    row2.appendChild(tidInput); UI.tidInput = tidInput;

    const intervalInput = document.createElement("input");
    intervalInput.placeholder = "间隔(秒)"; intervalInput.type = "number";
    intervalInput.style.cssText = inputStyle;
    row2.appendChild(intervalInput); UI.intervalInput = intervalInput;

    /* —— 自动识别 fid/tid —— */
    (function autoFillFidTid() {
        const url = location.href;
        const fidParam = url.match(/fid=(\d+)/);
        const tidParam = url.match(/tid=(\d+)/);
        if (fidParam) UI.fidInput.value = fidParam[1];
        if (tidParam) UI.tidInput.value = tidParam[1];

        const pathMatch = url.match(/\/htm_(?:data|mob)\/\d+\/(\d+)\/(\d+)/);
        if (pathMatch) {
            UI.fidInput.value = pathMatch[1];
            UI.tidInput.value = pathMatch[2];
        }

        const scripts = document.querySelectorAll("script");
        for (const s of scripts) {
            const m = s.textContent.match(/var\s+fid\s*=\s*(\d+)/);
            if (m) { UI.fidInput.value = m[1]; break; }
        }

        const searchLink = document.querySelector("a[href*='search.php?fid=']");
        if (searchLink) {
            const m = searchLink.href.match(/fid=(\d+)/);
            if (m) UI.fidInput.value = m[1];
        }

        const replyLink = document.querySelector("a[href*='action=reply'][href*='fid='][href*='tid=']");
        if (replyLink) {
            const m = replyLink.href.match(/fid=(\d+)&tid=(\d+)/);
            if (m) {
                UI.fidInput.value = m[1];
                UI.tidInput.value = m[2];
            }
        }
    })();

    /* —— 开始序号 / 结束序号 / 停止按钮 —— */
    const row3 = document.createElement("div");
    row3.style.cssText = "display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin:10px 0;";
    panel.appendChild(row3);

    const startIndexInput = document.createElement("input");
    startIndexInput.placeholder = "开始序号"; startIndexInput.style.cssText = inputStyle;
    row3.appendChild(startIndexInput); UI.startIndexInput = startIndexInput;

    const endIndexInput = document.createElement("input");
    endIndexInput.placeholder = "结束序号"; endIndexInput.style.cssText = inputStyle;
    row3.appendChild(endIndexInput); UI.endIndexInput = endIndexInput;

    const stopBtn = document.createElement("button");
    stopBtn.textContent = "停止任务";
    stopBtn.style.cssText = "width:100%;padding:6px;background:#dc3545;color:white;border:none;border-radius:4px;cursor:pointer;";
    stopBtn.disabled = true;
    row3.appendChild(stopBtn); UI.stopBtn = stopBtn;

    /* —— Cookie / UA —— */
    const row4 = document.createElement("div");
    row4.style.cssText = "display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:10px 0;";
    panel.appendChild(row4);

    const cookieInput = document.createElement("input");
    cookieInput.placeholder = "Cookie（留空=浏览器）"; cookieInput.style.cssText = inputStyle;
    row4.appendChild(cookieInput); UI.cookieInput = cookieInput;

    const uaInput = document.createElement("input");
    uaInput.placeholder = "UA（留空=浏览器）"; uaInput.style.cssText = inputStyle;
    row4.appendChild(uaInput); UI.uaInput = uaInput;

    /* —— 账号选择 / 保存 / 删除 / 上移 / 下移 —— */
    const row5 = document.createElement("div");
    row5.style.cssText = "display:grid;grid-template-columns:2fr 1fr 1fr 0.25fr 0.25fr;gap:10px;margin:10px 0;";
    panel.appendChild(row5);

    const accountSelect = document.createElement("select");
    accountSelect.style.cssText = inputStyle;
    accountSelect.innerHTML = `<option value="">选择账号</option>`;
    accounts.forEach(acc => {
        accountSelect.innerHTML += `<option value="${acc.username}">${acc.username}</option>`;
    });
    row5.appendChild(accountSelect);
    UI.accountSelect = accountSelect;

    const saveAccountBtn = document.createElement("button");
    saveAccountBtn.textContent = "保存";
    saveAccountBtn.style.cssText = "padding:6px;background:#17a2b8;color:white;border:none;border-radius:4px;cursor:pointer;";
    row5.appendChild(saveAccountBtn);
    UI.saveAccountBtn = saveAccountBtn;

    const deleteAccountBtn = document.createElement("button");
    deleteAccountBtn.textContent = "删除";
    deleteAccountBtn.style.cssText = "padding:6px;background:#dc3545;color:white;border:none;border-radius:4px;cursor:pointer;";
    row5.appendChild(deleteAccountBtn);
    UI.deleteAccountBtn = deleteAccountBtn;

    const upBtn = document.createElement("button");
    upBtn.textContent = "▲";
    upBtn.style.cssText = "padding:2px 4px;font-size:12px;width:28px;height:28px;background:#6c757d;color:white;border:none;border-radius:4px;cursor:pointer;";
    row5.appendChild(upBtn);
    UI.upBtn = upBtn;

    const downBtn = document.createElement("button");
    downBtn.textContent = "▼";
    downBtn.style.cssText = "padding:2px 4px;font-size:12px;width:28px;height:28px;background:#6c757d;color:white;border:none;border-radius:4px;cursor:pointer;";
    row5.appendChild(downBtn);
    UI.downBtn = downBtn;

    /* —— 定时 HH / MM / SS —— */
    const row6 = document.createElement("div");
    row6.style.cssText = "display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin:10px 0;";
    panel.appendChild(row6);

    const hh = document.createElement("input");
    hh.placeholder = "定时HH";
    hh.style.cssText = inputStyle;
    row6.appendChild(hh);
    UI.hh = hh;

    const mm = document.createElement("input");
    mm.placeholder = "MM";
    mm.style.cssText = inputStyle;
    row6.appendChild(mm);
    UI.mm = mm;

    const ss = document.createElement("input");
    ss.placeholder = "SS";
    ss.style.cssText = inputStyle;
    row6.appendChild(ss);
    UI.ss = ss;

    /* —— 时间校准按钮 + 显示 —— */
    const row7 = document.createElement("div");
    row7.style.cssText = "display:grid;grid-template-columns:1fr 2fr;gap:10px;margin:10px 0;";
    panel.appendChild(row7);

    const timeCalibrationBtn = document.createElement("button");
    timeCalibrationBtn.textContent = "校准服务器时间";
    timeCalibrationBtn.style.cssText = "padding:6px;background:#6c757d;color:white;border:none;border-radius:4px;cursor:pointer;";
    row7.appendChild(timeCalibrationBtn);
    UI.timeCalibrationBtn = timeCalibrationBtn;

    const timeDisplay = document.createElement("div");
    timeDisplay.style.cssText = "font-size:13px;color:#333;padding-top:6px;";
    row7.appendChild(timeDisplay);
    UI.timeDisplay = timeDisplay;

    /* —— 开始按钮 —— */
    const startBtn = document.createElement("button");
    startBtn.textContent = "开始回复";
    startBtn.style.cssText = "width:100%;padding:8px;font-size:14px;background:#28a745;color:white;border:none;border-radius:4px;cursor:pointer;";
    panel.appendChild(startBtn);
    UI.startBtn = startBtn;

    /* —— 批量下注按钮 + 点数输入框 —— */
    const betRow = document.createElement("div");
    betRow.style.cssText = "display: grid; grid-template-columns: 4fr 1fr; gap: 10px; margin-top: 10px;";
    panel.appendChild(betRow);

    const betBatchBtn = document.createElement("button");
    betBatchBtn.textContent = "批量下注";
    betBatchBtn.style.cssText = "width:100%;padding:8px;font-size:14px;background:#ff5722;color:white;border:none;border-radius:4px;cursor:pointer;";
    betRow.appendChild(betBatchBtn);
    UI.betBatchBtn = betBatchBtn;

    const betPointsInput = document.createElement("input");
    betPointsInput.placeholder = "点数";
    betPointsInput.type = "number";
    betPointsInput.value = "40";
    betPointsInput.style.cssText = "width:100%;padding:6px;font-size:14px;";
    betRow.appendChild(betPointsInput);
    UI.betPointsInput = betPointsInput;

      // —— 批量下注事件绑定 ——
    betBatchBtn.addEventListener("click", async () => {
        const ck = UI.cookieInput.value.trim();
        const ua = UI.uaInput.value.trim() || navigator.userAgent;
        const betPoints = parseInt(UI.betPointsInput.value.trim() || "40", 10);

        // 获取当前账号 uid
        const profile = await fetchUserProfile(ck, ua);
        if (!profile || !profile.uid) {
            addLog("❌ 无法获取当前账号 UID");
            return;
        }
        const uid = profile.uid;

        const tids = await fetchTodayOpenTids(ck, ua, uid);
        if (tids.length === 0) {
            addLog("❌ 今日没有可下注的 tid");
            return;
        }

        const previews = [];
        for (const tid of tids) {
            const p = await fetchTidBetPreview(tid, ck, ua, betPoints);
            previews.push(p);
            addLog(`✔ 已加载 tid=${tid}`);
        }

        showBetPreviewPopup(previews, (finalList) => {
            if (finalList.length === 0) {
                addLog("❌ 所有内容为空，已取消下注");
                return;
            }
            addLog(`▶ 开始下注 ${finalList.length} 个 tid`);
            startBatchBetting(finalList, ck, ua, uid);
        });
    });

    /* —— 日志面板 —— */
    const log = document.createElement("div");
    Object.assign(log.style, {
        position: "fixed", bottom: "120px", right: "20px",
        zIndex: "9999", width: "300px", maxHeight: "200px",
        overflowY: "auto", padding: "8px",
        background: "rgba(0,0,0,0.8)", color: "#0f0",
        fontSize: "12px", borderRadius: "5px",
        display: "none", boxSizing: "border-box"
    });
    frag.appendChild(log);
    UI.log = log;

    /* —— 插入页面 —— */
    document.body.appendChild(frag);

    /* —— 事件绑定 —— */
    UI.floatBtn.addEventListener("click", () => {
        if (UI.panel.style.display === "block") {
            UI.panel.style.display = "none";
            UI.log.style.display = "none";
        } else {
            UI.panel.style.display = "block";
            UI.log.style.display = "none";
            fetchPageTimeOnOpen();
        }
    });

    UI.timeCalibrationBtn.addEventListener("click", calibrateServerTime);
    UI.stopBtn.addEventListener("click", stopAllReplies);
    UI.upBtn.addEventListener("click", () => moveAccount(-1));
    UI.downBtn.addEventListener("click", () => moveAccount(1));
    UI.startBtn.addEventListener("click", startReplyHandler);

    UI.accountSelect.addEventListener("change", () => {
        const name = UI.accountSelect.value;
        const acc = accounts.find(a => a.username === name);
        if (!acc) return;
        UI.cookieInput.value = acc.ck;
        UI.uaInput.value = acc.ua;
        UI.betPointsInput.value = acc.betPoints || 40;
        addLog(`✔ 已加载账号：${name}`);
    });

    UI.saveAccountBtn.addEventListener("click", async () => {
    const ck = UI.cookieInput.value.trim();
    const ua = UI.uaInput.value.trim();
    if (!ck) { addLog("❌ CK 为空，无法保存账号"); return; }

    addLog("正在访问 profile.php 获取账号信息...");
    const info = await fetchUserProfile(ck, ua);
    if (!info || !info.uid) {
        addLog("❌ 无法获取 UID，账号未保存");
        return;
    }

    const idx = accounts.findIndex(acc => acc.uid === info.uid);
    const newAcc = {
        username: info.username,
        ck,
        ua,
        uid: info.uid,
        title: info.title,
        betPoints: getBetPointsByTitle(info.title)
    };

    if (idx >= 0) {
        accounts[idx] = newAcc;
        addLog(`✔ 已更新账号：${info.username} (UID:${info.uid})`);
    } else {
        accounts.push(newAcc);
        addLog(`✔ 已新增账号：${info.username} (UID:${info.uid})`);
    }

    // 保存账号列表
    GM_setValue("reply_accounts", accounts);

    // 保存 uid→username 映射
    let uidToName = GM_getValue("uidToName", {});
    if (typeof uidToName !== "object") uidToName = {};
    uidToName[newAcc.uid] = newAcc.username;
    GM_setValue("uidToName", uidToName);

    refreshAccountSelect();
});


    UI.deleteAccountBtn.addEventListener("click", () => {
        const name = UI.accountSelect.value;
        if (!name) return;
        const idx = accounts.findIndex(a => a.username === name);
        if (idx < 0) return;
        accounts.splice(idx, 1);
        GM_setValue("reply_accounts", accounts);
        refreshAccountSelect();
        addLog(`✔ 已删除账号：${name}`);
    });

    UI.betBatchBtn.addEventListener("click", async () => {
    addLog("▶ 开始批量下注流程");

    const auth = getAuthInfo();
    if (!auth) return;

    const ck = auth.ck;
    const ua = auth.ua;

    // 自动填充账号绑定的下注点数
    const acc = accounts.find(a => a.username === UI.accountSelect.value);
    if (acc && acc.betPoints !== undefined) {
        UI.betPointsInput.value = acc.betPoints;
    }

    const betPoints = parseInt(UI.betPointsInput?.value || "40", 10);

    // 获取当前账号 uid
    const uid = acc?.uid;
    if (!uid) {
        addLog("❌ 当前账号没有 UID，无法下注");
        return;
    }

    addLog("▶ 正在抓取今日有效 tid…");
    const tids = await fetchTodayOpenTids(ck, ua, uid);

    if (!tids || tids.length === 0) {
        addLog("❌ 今日没有可下注的 tid");
        return;
    }

    addLog(`✔ 获取到 ${tids.length} 个 tid，开始加载内容…`);

    const previews = [];
    for (const item of tids) {
        addLog(`✔ 已加载 tid=${item.tid}`);
        const preview = await fetchTidBetPreview(item, ck, ua, betPoints);
        previews.push(preview);
    }

    // 打开预览弹窗
    showBetPreviewPopup(previews, (finalList) => {
        if (finalList.length === 0) {
            addLog("❌ 所有内容为空，已取消下注");
            return;
        }

        addLog(`▶ 开始下注 ${finalList.length} 个 tid`);
        startBatchBetting(finalList, ck, ua, uid);
    });
});

    fetchPageTimeOnOpen();
}
/* ===== 批量下注预览弹窗 ===== */
function showBetPreviewPopup(previews, onConfirm) {
    const old = document.getElementById("betPreviewPopup");
    if (old) old.remove();

    const wrap = document.createElement("div");
    wrap.id = "betPreviewPopup";
    wrap.style.cssText = `
        position: fixed;
        top: 50px;
        left: 50%;
        transform: translateX(-50%);
        width: 600px;
        max-height: 80vh;
        overflow-y: auto;
        background: #fff;
        border: 2px solid #333;
        padding: 15px;
        z-index: 999999;
    `;

    const title = document.createElement("div");
    title.textContent = "批量下注预览（清空表示跳过该 tid）";
    title.style.cssText = "font-size:16px;font-weight:bold;margin-bottom:10px;";
    wrap.appendChild(title);

    const items = [];

    // 读取 uid→username 映射
    let uidToName = GM_getValue("uidToName", {});
    if (typeof uidToName !== "object") uidToName = {};

    previews.forEach(p => {
        const box = document.createElement("div");
        box.style.cssText = "margin-bottom:20px;padding-bottom:10px;border-bottom:1px solid #ccc;";

        const betUids = savedTids
            .filter(s => s.startsWith(p.tid + "_"))
            .map(s => s.split("_")[1]);

        let statusText = "未下注";
        if (betUids.length > 0) {
            const names = betUids.map(uid => uidToName[uid] || uid);
            statusText = "已下注账号:" + names.join(", ");
        }

        const t1 = document.createElement("div");
        t1.textContent = `TID：${p.tid} [${statusText}]`;
        t1.style.cssText = "font-weight:bold;";
        box.appendChild(t1);

        const t2 = document.createElement("div");
        t2.textContent = `标题：${p.title}`;
        t2.style.cssText = "margin-bottom:5px;";
        box.appendChild(t2);

        const ta = document.createElement("textarea");
        ta.style.cssText = "width:100%;height:100px;";
        ta.value = p.betText;
        box.appendChild(ta);

        items.push({ tid: p.tid, textarea: ta });
        wrap.appendChild(box);
    });

    const btnRow = document.createElement("div");
    btnRow.style.cssText = "text-align:right;margin-top:10px;";

    const cancelBtn = document.createElement("button");
    cancelBtn.textContent = "取消";
    cancelBtn.style.cssText = "margin-right:10px;";
    cancelBtn.onclick = () => wrap.remove();

    const okBtn = document.createElement("button");
    okBtn.textContent = "开始下注";
    okBtn.style.cssText = "background:#28a745;color:#fff;padding:5px 10px;";
    okBtn.onclick = () => {
        const finalList = items
            .map(i => ({ tid: i.tid, content: i.textarea.value.trim() }))
            .filter(i => i.content.length > 0);

        wrap.remove();
        onConfirm(finalList);
    };

    btnRow.appendChild(cancelBtn);
    btnRow.appendChild(okBtn);
    wrap.appendChild(btnRow);

    document.body.appendChild(wrap);
}


/* =========================================================
   ⑥ 停止任务
   ========================================================= */
function stopAllReplies() {
    addLog("⏹ 停止所有回复任务");
    clearAllTimers();
    isRunning = false;
    if (UI.stopBtn) UI.stopBtn.disabled = true;
    completedReplies = 0;
    failedReplies = 0;
    totalReplies = 0;
}

/* =========================================================
   ⑦ 账号管理
   ========================================================= */
function refreshAccountSelect() {
    if (!UI.accountSelect) return;

    accounts = accounts.filter(acc => acc.username);
    GM_setValue("reply_accounts", accounts);

    UI.accountSelect.innerHTML = `<option value="">选择账号</option>`;
    accounts.forEach(acc => {
        UI.accountSelect.innerHTML += `<option value="${acc.username}">${acc.username}</option>`;
    });
}

function moveAccount(direction) {
    const name = UI.accountSelect.value;
    if (!name) return;
    const index = accounts.findIndex(acc => acc.username === name);
    if (index < 0) return;

    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= accounts.length) return;

    const temp = accounts[index];
    accounts[index] = accounts[newIndex];
    accounts[newIndex] = temp;

    GM_setValue("reply_accounts", accounts);
    refreshAccountSelect();
    UI.accountSelect.value = name;
}

/* =========================================================
   ⑧ 获取用户资料
   ========================================================= */
async function fetchUserProfile(cookieVal, uaVal) {
    const domain = location.origin;
    const host = location.host;

    const { ok, resp } = await safeRequest({
        method: "GET",
        url: `${domain}/profile.php`,
        anonymous: true,
        headers: {
            "Host": host,
            "Connection": "keep-alive",
            "Pragma": "no-cache",
            "Cache-Control": "no-cache",
            "Upgrade-Insecure-Requests": "1",
            "User-Agent": uaVal,
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
            "Referer": `${domain}/`,
            "Cookie": cookieVal + "; ismob=0"
        }
    });

    if (!ok || !resp) {
        addLog("❌ 无法访问 profile.php");
        return null;
    }

    const html = resp.responseText;
    let username = null, uid = null, title = "";

    let m1 = html.match(/用戶名[:：]\s*([^（<]+)（UID[:：]?(\d+)）/i);
    if (m1) {
        username = m1[1].trim();
        uid = m1[2].trim();
    }

    if (!uid) {
        let uidMatch = html.match(/UID[:：]?\s*(\d+)/i);
        if (uidMatch) uid = uidMatch[1].trim();
    }

    if (!username) {
        let m2 = html.match(/Username[:：]?\s*([^\s<]+)/i);
        if (m2) username = m2[1].trim();
    }

    if (!username) {
        let m3 = html.match(/<title>([^<]+)的个人资料/i);
        if (m3) username = m3[1].trim();
    }

    let titleMatch = html.match(/會員頭銜[:：]\s*([^<]+)/i);
    if (titleMatch) title = titleMatch[1].trim();

    addLog(`✔ 获取账号成功：${username || "未知"} (UID: ${uid || "未知"})`);
    return { username, uid, title };
}
/* =========================================================
   统一 CK / UA 获取逻辑（双模式）
   ========================================================= */
function getAuthInfo() {
    const ckInput = UI.cookieInput.value.trim();
    const uaInput = UI.uaInput.value.trim();

    if (!ckInput) {
        return {
            ck: document.cookie || "",
            ua: navigator.userAgent,
            mode: "browser"
        };
    }

    if (!uaInput) {
        addLog("❌ 填写了 CK，但未填写 UA");
        return null;
    }

    return {
        ck: ckInput,
        ua: uaInput,
        mode: "manual"
    };
}

/* =========================================================
   ⑨ startReplyHandler
   ========================================================= */
function startReplyHandler() {
    addLog("开始按钮已触发");

    const fid = UI.fidInput.value.trim();
    const tid = UI.tidInput.value.trim();
    const replyBase = UI.textarea.value;
    const startStr = UI.startIndexInput.value.trim();
    const endStr = UI.endIndexInput.value.trim();
    const auth = getAuthInfo();
    if (!auth) return;

    const ck = auth.ck;
    const ua = auth.ua;

    if (!fid || !tid) { addLog("❌ 请填写 fid 和 tid"); return; }
    if (!replyBase) { addLog("❌ 请填写回复内容"); return; }

    const startIndex = parseInt(startStr || "1", 10);
    const endIndex = parseInt(endStr || startIndex.toString(), 10);
    const intervalSec = Math.max(parseInt(UI.intervalInput.value.trim() || "2", 10), 2);

    /* —— 定时启动 —— */
    let startDelay = 0;
    if (UI.hh.value || UI.mm.value || UI.ss.value) {
        const hh = parseInt(UI.hh.value || "0", 10);
        const mm = parseInt(UI.mm.value || "0", 10);
        const ss = parseInt(UI.ss.value || "0", 10);

        const target = new Date(baseClock || new Date());
        target.setHours(hh, mm, ss, 0);

        const diff = target.getTime() - Date.now() - serverTimeOffset;
        if (diff > 0) startDelay = diff;

        addLog(`⏰ 已设置定时启动: ${hh}:${mm}:${ss}`);
    }

    getVerify(fid, tid, ck, ua, (verify) => {
        if (!verify) { addLog("❌ 无法获取 verify"); return; }

        const replyCount = endIndex - startIndex + 1;
        startReply(
            fid, tid, replyBase, replyCount,
            intervalSec, ck, ua, verify,
            startDelay, startIndex, endIndex
        );
    });
}

/* =========================================================
   ⑩ 核心回复执行函数
   ========================================================= */
function startReply(fid, tid, replyBase, replyCount, intervalSec, ck, ua, verify, startDelay, startIndex, endIndex) {
    addLog(`▶ 开始执行回复任务，共 ${replyCount} 次，间隔 ${intervalSec} 秒`);

    isRunning = true;
    if (UI.stopBtn) UI.stopBtn.disabled = false;

    totalReplies = replyCount;
    completedReplies = 0;
    failedReplies = 0;

    const launch = () => {
        for (let i = startIndex; i <= endIndex; i++) {
            let content = replyBase;
            if (replyCount > 1) content += i;

            const delay = (i - startIndex) * intervalSec * 1000;
            const timerId = setTimeout(() => {
                if (!isRunning) return;
                sendReply(fid, tid, content, ck, ua, verify, i);
            }, delay);

            activeTimers.push(timerId);
        }
    };

    if (startDelay > 0) {
        addLog(`⏳ 等待 ${Math.round(startDelay / 1000)} 秒后启动任务...`);
        const timerId = setTimeout(launch, startDelay);
        activeTimers.push(timerId);
    } else {
        launch();
    }
}

/* =========================================================
   ⑪ 单次回复请求
   ========================================================= */
async function sendReply(fid, tid, content, ck, ua, verify, index) {
    const domain = location.origin;
    const host = location.host;

    const postData =
        `atc_usesign=1&atc_convert=1&atc_autourl=1` +
        `&atc_title=${encodeURIComponent("Re:" + tid)}` +
        `&atc_content=${encodeURIComponent(content)}` +
        `&step=2&action=reply&fid=${fid}&tid=${tid}` +
        `&verify=${encodeURIComponent(verify)}`;

    const { ok, resp, err } = await safeRequest({
        method: "POST",
        url: `${domain}/post.php`,
        anonymous: true,
        headers: {
            "Host": host,
            "Connection": "keep-alive",
            "Pragma": "no-cache",
            "Cache-Control": "no-cache",
            "Origin": domain,
            "Upgrade-Insecure-Requests": "1",
            "User-Agent": ua,
            "Content-Type": "application/x-www-form-urlencoded",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
            "Referer": `${domain}/read.php?tid=${tid}`,
            "Cookie": ck + "ismob=0"
        },
        data: postData
    });

    if (!ok || !resp) {
        addLog(`❌ 回复 ${index} 失败: ${err?.statusText || "网络错误"}`);
        failedReplies++;
        return;
    }

    if (resp.status === 200) {
        addLog(`✔ 回复 ${index} 成功`);
        completedReplies++;
    } else {
        addLog(`❌ 回复 ${index} 状态异常: ${resp.status}`);
        failedReplies++;
    }

    if (completedReplies + failedReplies >= totalReplies) {
        finishTask();
    }
}

/* =========================================================
   ⑫ 任务结束处理
   ========================================================= */
function finishTask() {
    isRunning = false;
    if (UI.stopBtn) UI.stopBtn.disabled = true;

    addLog(`🎉 任务完成：成功 ${completedReplies} 次，失败 ${failedReplies} 次`);

    clearAllTimers();
}
/* =========================================================
   ⑬ 脚本入口
   ========================================================= */
function getBetPointsByTitle(title) {
    switch (title.trim()) {
        case "禁止發言": return 0;
        case "聖騎士": return 30;
        case "精靈王": return 30;
        case "風雲使者": return 40;
        case "光明使者": return 40;
        case "天使": return 50;
        default: return 0;
    }
}

// 暴露 UI 方便调试
unsafeWindow.UI = UI;

// 插入 UI 并绑定事件
insertUI();

})();