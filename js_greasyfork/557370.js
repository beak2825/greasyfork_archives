// ==UserScript==
// @name         百度贴吧自动签到助手
// @namespace    https://aiotieba.cc
// @version      0.1.0
// @description  🚀 百度贴吧自动签到脚本：基于移动端接口，支持一键签到 + 智能补签。内置现代化暗黑风 UI 面板，可视化日志，安全稳定。
// @match        https://tieba.baidu.com/*
// @match        https://tiebac.baidu.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_log
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @connect      tieba.baidu.com
// @connect      tiebac.baidu.com
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557370/%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/557370/%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(() => {
    "use strict";

    const APP_HOST = "https://tiebac.baidu.com";
    const WEB_HOST = "https://tieba.baidu.com";
    const CLIENT_VERSION = "12.64.1.1";
    const SIGN_SUFFIX = "tiebaclient!!!";
    const STORAGE_KEY = "tieba_autosign_bduss";
    const MAX_RN = 200;
    const SLEEP_MS = 600;

    const state = {
        running: false,
        logBuffer: [],
        dom: {},
    };

    function setStatus(text, type = "info") {
        if (state.dom.status) {
            state.dom.status.textContent = text;
            state.dom.status.dataset.type = type;
        }
    }

    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    function toUtf8Bytes(str) {
        if (typeof TextEncoder !== "undefined") {
            return new TextEncoder().encode(str);
        }
        const utf8 = unescape(encodeURIComponent(str));
        const arr = new Uint8Array(utf8.length);
        for (let i = 0; i < utf8.length; i++) arr[i] = utf8.charCodeAt(i);
        return arr;
    }

    function leftRotate(x, c) {
        return (x << c) | (x >>> (32 - c));
    }

    function md5(input) {
        const bytes = toUtf8Bytes(input);
        const originalBitLength = bytes.length * 8;
        const withPadding = new Uint8Array(((bytes.length + 9 + 63) >> 6) << 6);
        withPadding.set(bytes);
        withPadding[bytes.length] = 0x80;
        const dv = new DataView(withPadding.buffer);
        dv.setUint32(withPadding.length - 8, originalBitLength, true);

        let a = 0x67452301;
        let b = 0xefcdab89;
        let c = 0x98badcfe;
        let d = 0x10325476;

        const k = new Uint32Array(64);
        for (let i = 0; i < 64; i++) {
            k[i] = Math.floor(Math.abs(Math.sin(i + 1)) * 2 ** 32);
        }

        const r = [
            7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
            5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20,
            4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
            6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21,
        ];

        for (let offset = 0; offset < withPadding.length; offset += 64) {
            const chunk = new Uint32Array(16);
            for (let i = 0; i < 16; i++) {
                chunk[i] = dv.getUint32(offset + i * 4, true);
            }

            let A = a;
            let B = b;
            let C = c;
            let D = d;

            for (let i = 0; i < 64; i++) {
                let F, g;
                if (i < 16) {
                    F = (B & C) | (~B & D);
                    g = i;
                } else if (i < 32) {
                    F = (D & B) | (~D & C);
                    g = (5 * i + 1) % 16;
                } else if (i < 48) {
                    F = B ^ C ^ D;
                    g = (3 * i + 5) % 16;
                } else {
                    F = C ^ (B | ~D);
                    g = (7 * i) % 16;
                }
                const tmp = D;
                D = C;
                C = B;
                const sum = (A + F + k[i] + chunk[g]) >>> 0;
                B = (B + leftRotate(sum, r[i])) >>> 0;
                A = tmp;
            }

            a = (a + A) >>> 0;
            b = (b + B) >>> 0;
            c = (c + C) >>> 0;
            d = (d + D) >>> 0;
        }

        const digest = new Uint8Array(16);
        const words = [a, b, c, d];
        for (let i = 0; i < 4; i++) {
            const w = words[i];
            digest[i * 4] = w & 0xff;
            digest[i * 4 + 1] = (w >>> 8) & 0xff;
            digest[i * 4 + 2] = (w >>> 16) & 0xff;
            digest[i * 4 + 3] = (w >>> 24) & 0xff;
        }
        return Array.from(digest, (b) => b.toString(16).padStart(2, "0")).join("");
    }

    function signParams(pairs) {
        const body = pairs.map(([k, v]) => `${k}=${v}`).join("") + SIGN_SUFFIX;
        return md5(body);
    }

    function gmRequest(method, url, data, { headers = {}, cookie = "" } = {}) {
        return new Promise((resolve, reject) => {
            const opts = {
                method,
                url,
                data,
                headers: {
                    Accept: "application/json, text/plain, */*",
                    ...headers,
                },
                onload: (resp) => resolve(resp),
                onerror: () => reject(new Error("Network error")),
                ontimeout: () => reject(new Error("Request timeout")),
                timeout: 15000,
            };
            if (cookie) {
                opts.headers.Cookie = cookie;
            }
            GM_xmlhttpRequest(opts);
        });
    }

    function truncate(str, max = 500) {
        if (typeof str !== "string") return "";
        return str.length > max ? `${str.slice(0, max)}...(${str.length} chars)` : str;
    }

    function parseJsonSafe(resp, ctx) {
        try {
            return JSON.parse(resp.responseText);
        } catch (e) {
            throw new Error(`${ctx}：返回内容非 JSON，status=${resp.status}，片段=${truncate(resp.responseText)}`);
        }
    }

    function log(...args) {
        const msg = args.map(String).join(" ");
        state.logBuffer.push(msg);
        if (state.logBuffer.length > 500) state.logBuffer.shift();
        GM_log(msg);
        if (state.dom.logArea) {
            state.dom.logArea.value = state.logBuffer.join("\n");
            state.dom.logArea.scrollTop = state.dom.logArea.scrollHeight;
        }
    }

    async function getTbs(bduss) {
        log("获取 tbs...");
        const resp = await gmRequest("GET", `${WEB_HOST}/dc/common/tbs`, null, {
            cookie: `BDUSS=${bduss};`,
        });
        const data = parseJsonSafe(resp, "获取 tbs");
        if (!data || data.is_login !== 1 || !data.tbs) {
            throw new Error("获取 tbs 失败，可能 BDUSS 无效或未登录。");
        }
        log("tbs 获取成功");
        return data.tbs;
    }

    async function multiSign(bduss) {
        log("尝试网页一键签到...");
        const form = new URLSearchParams();
        form.append("_client_version", CLIENT_VERSION);
        form.append("subapp_type", "hybrid");
        const resp = await gmRequest("POST", `${WEB_HOST}/c/c/forum/msign`, form.toString(), {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Subapp-Type": "hybrid",
            },
            cookie: `BDUSS=${bduss};`,
        });
        log(`一键签到响应状态：${resp.status}, length=${resp.responseText?.length ?? 0}`);
        const data = parseJsonSafe(resp, "一键签到");
        if (Number(data.error_code || 0) !== 0) {
            throw new Error(`一键签到失败：${data.error_msg || resp.status}，raw=${truncate(resp.responseText)}`);
        }
        if (Number(data.error?.errno || 0) !== 0) {
            const errno = Number(data.error.errno);
            const msg = data.error.errmsg || data.error.usermsg || "未知错误";
            // 340011: 签得太快；340016: 频控
            if (errno === 340011 || errno === 340016) {
                log(`一键签到被限速（errno=${errno}, msg=${msg}），将跳过一键改为逐吧签到`);
                return { ok: false, errno, msg };
            }
            throw new Error(`一键签到失败：${msg} (errno=${errno})，raw=${truncate(resp.responseText)}`);
        }
        log("网页一键签到完成");
        return { ok: true };
    }

    async function fetchFollowForums(bduss, tbs) {
        const unsigned = [];
        for (let page = 1; page < 9999; page++) {
            const form = new URLSearchParams();
            form.append("tbs", tbs);
            form.append("sort_type", "3");
            form.append("call_from", "3");
            form.append("page_no", String(page));
            form.append("res_num", String(MAX_RN));
            const resp = await gmRequest("POST", `${WEB_HOST}/c/f/forum/forumGuide`, form.toString(), {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Subapp-Type": "hybrid",
                },
                cookie: `BDUSS=${bduss};`,
            });
            const data = parseJsonSafe(resp, "获取关注列表");
            if (data.error_code && Number(data.error_code) !== 0) {
                throw new Error(`获取关注列表失败：${data.error_msg || data.error_code}，raw=${truncate(resp.responseText)}`);
            }
            const forums = data.like_forum || [];
            for (const forum of forums) {
                if (!forum.is_sign) {
                    unsigned.push(forum.forum_name);
                }
            }
            const hasMore = data.like_forum_has_more;
            log(`关注列表第 ${page} 页，新增未签 ${forums.filter((f) => !f.is_sign).length}`);
            if (!hasMore) break;
            await sleep(200);
        }
        log(`共发现未签到贴吧 ${unsigned.length} 个`);
        return unsigned;
    }

    async function signOne(bduss, tbs, fname) {
        const pairs = [
            ["BDUSS", bduss],
            ["_client_version", CLIENT_VERSION],
            ["kw", fname],
            ["tbs", tbs],
        ];
        const sign = signParams(pairs);
        const form = new URLSearchParams();
        for (const [k, v] of pairs) form.append(k, v);
        form.append("sign", sign);
        const resp = await gmRequest("POST", `${APP_HOST}/c/c/forum/sign`, form.toString(), {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });
        const data = parseJsonSafe(resp, `签到 ${fname}`);
        if (Number(data.error_code || 0) !== 0) {
            const err = data.error_msg || data.error_code;
            throw new Error(`${err}，raw=${truncate(resp.responseText)}`);
        }
        if (Number(data.user_info?.sign_bonus_point || 0) === 0) {
            throw new Error("sign_bonus_point 为 0（重复签到或频率限制）");
        }
    }

    async function run() {
        if (state.running) return;
        const bduss = state.dom.bdussInput.value.trim();
        if (!bduss) {
            log("缺少 BDUSS，请先填写后点击保存");
            setStatus("请填写 BDUSS", "warn");
            return;
        }
        GM_setValue(STORAGE_KEY, bduss);
        state.running = true;
        state.dom.startBtn.disabled = true;
        state.dom.saveBtn.disabled = true;
        state.logBuffer.length = 0;
        log("开始签到流程");
        setStatus("运行中...", "info");
        try {
            const tbs = await getTbs(bduss);
            const msignRes = await multiSign(bduss);
            const unsigned = await fetchFollowForums(bduss, tbs);
            let success = 0;
            let skipped = 0;
            let failed = 0;
            for (const fname of unsigned) {
                await sleep(SLEEP_MS);
                try {
                    await signOne(bduss, tbs, fname);
                    success++;
                    log(`✓ 签到成功：${fname}`);
                } catch (err) {
                    const msg = String(err?.message || err);
                    if (msg.includes("160002") || msg.includes("重复") || msg.includes("sign_bonus_point 为 0")) {
                        skipped++;
                        log(`⟳ 已签到 / 频控：${fname} -> ${msg}`);
                    } else {
                        failed++;
                        log(`✗ 失败：${fname} -> ${msg}`);
                    }
                }
            }
            log(`完成。成功 ${success}，已签/跳过 ${skipped}，失败 ${failed}`);
            setStatus(`完成：成功${success} 跳过${skipped} 失败${failed}`, failed === 0 ? "success" : "warn");
        } catch (err) {
            log("流程中断：", err?.message || err);
            setStatus(`失败：${err?.message || err}`, "error");
        } finally {
            state.running = false;
            state.dom.startBtn.disabled = false;
            state.dom.saveBtn.disabled = false;
        }
    }

    function togglePanel() {
        const panel = state.dom.panel;
        if (!panel) return;
        const hidden = panel.dataset.hidden === "1";
        panel.dataset.hidden = hidden ? "0" : "1";
        panel.style.transform = "translateY(0)";
    }

    function buildUI() {
        const panel = document.createElement("div");
        panel.id = "aiotieba-autosign-panel";
        panel.dataset.hidden = "1";
        panel.tabIndex = 0;
        panel.innerHTML = `
            <div class="aia-header">
                <span class="aia-title">贴吧自动签到</span>
                <div class="aia-actions">
                    <button type="button" id="aia-save">保存</button>
                    <button type="button" id="aia-start">开始</button>
                    <button type="button" id="aia-toggle">折叠</button>
                </div>
            </div>
            <div class="aia-body">
                <div class="aia-status" id="aia-status" data-type="idle">待机</div>
                <label class="aia-row">
                    <span>BDUSS</span>
                    <input id="aia-bduss" type="password" placeholder="粘贴 BDUSS" autocomplete="off" />
                </label>
                <textarea id="aia-log" readonly placeholder="日志输出..."></textarea>
            </div>
            <div class="aia-dot" title="点击展开签到面板"></div>
        `;

        const style = `
            #aiotieba-autosign-panel {
                position: fixed;
                right: 12px;
                bottom: 16px;
                width: min(360px, 90vw);
                background: #0b172a;
                color: #e8f0ff;
                border-radius: 12px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.35);
                font-family: "Segoe UI", "PingFang SC", sans-serif;
                font-size: 13px;
                z-index: 2147483647;
                overflow: hidden;
                transition: transform 0.28s ease;
            }
            #aiotieba-autosign-panel[data-hidden="1"] {
                width: 36px;
                height: 36px;
                padding: 0;
                border-radius: 50%;
                background: #1b3566;
                box-shadow: 0 8px 24px rgba(0,0,0,0.35);
            }
            #aiotieba-autosign-panel[data-hidden="1"] .aia-header,
            #aiotieba-autosign-panel[data-hidden="1"] .aia-body {
                display: none;
            }
            #aiotieba-autosign-panel .aia-dot {
                display: none;
                width: 18px;
                height: 18px;
                border-radius: 50%;
                background: #1f6feb;
                margin: 9px;
                box-shadow: 0 0 0 3px rgba(31,111,235,0.25), 0 4px 10px rgba(0,0,0,0.35);
                cursor: pointer;
            }
            #aiotieba-autosign-panel[data-hidden="1"] .aia-dot {
                display: block;
            }
            #aiotieba-autosign-panel .aia-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 8px 10px;
                background: linear-gradient(135deg, #1b3566, #122441);
            }
            #aiotieba-autosign-panel .aia-title {
                font-weight: 700;
                letter-spacing: 0.3px;
            }
            #aiotieba-autosign-panel .aia-actions button {
                margin-left: 6px;
                background: #1f6feb;
                color: #fff;
                border: none;
                border-radius: 6px;
                padding: 6px 10px;
                cursor: pointer;
            }
            #aiotieba-autosign-panel .aia-actions button:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }
            #aiotieba-autosign-panel .aia-body {
                padding: 10px;
            }
            #aiotieba-autosign-panel .aia-row {
                display: flex;
                align-items: center;
                gap: 8px;
                margin-bottom: 8px;
            }
            #aiotieba-autosign-panel .aia-status {
                display: inline-block;
                margin-bottom: 6px;
                padding: 4px 8px;
                border-radius: 8px;
                font-size: 12px;
                background: #203659;
                color: #dbe7ff;
            }
            #aiotieba-autosign-panel .aia-status[data-type="success"] { background: #1d6337; }
            #aiotieba-autosign-panel .aia-status[data-type="warn"] { background: #7a4b0f; }
            #aiotieba-autosign-panel .aia-status[data-type="error"] { background: #7a1b1b; }
            #aiotieba-autosign-panel input#aia-bduss {
                flex: 1;
                padding: 6px 8px;
                border: 1px solid #2b3f66;
                border-radius: 6px;
                background: #0f1f3b;
                color: #e8f0ff;
            }
            #aiotieba-autosign-panel textarea#aia-log {
                width: 100%;
                height: 180px;
                resize: vertical;
                border: 1px solid #2b3f66;
                border-radius: 8px;
                background: #0f1f3b;
                color: #dbe7ff;
                padding: 8px;
                box-sizing: border-box;
            }
            #aiotieba-autosign-panel button#aia-toggle {
                background: #25395e;
            }
        `;
        GM_addStyle(style);

        document.body.appendChild(panel);

        state.dom = {
            panel,
            bdussInput: panel.querySelector("#aia-bduss"),
            logArea: panel.querySelector("#aia-log"),
            saveBtn: panel.querySelector("#aia-save"),
            startBtn: panel.querySelector("#aia-start"),
            toggleBtn: panel.querySelector("#aia-toggle"),
            dot: panel.querySelector(".aia-dot"),
            status: panel.querySelector("#aia-status"),
        };

        const saved = GM_getValue(STORAGE_KEY, "");
        if (saved) {
            state.dom.bdussInput.value = saved;
            log("已加载保存的 BDUSS");
        }
        setStatus("待机", "idle");

        state.dom.saveBtn.addEventListener("click", () => {
            const val = state.dom.bdussInput.value.trim();
            GM_setValue(STORAGE_KEY, val);
            log("BDUSS 已保存");
        });
        state.dom.startBtn.addEventListener("click", () => run());
        state.dom.toggleBtn.addEventListener("click", togglePanel);
        state.dom.dot.addEventListener("click", togglePanel);
        panel.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                togglePanel();
            }
        });
    }

    function registerMenu() {
        GM_registerMenuCommand("打开/折叠签到面板", togglePanel);
        GM_registerMenuCommand("开始签到", run);
    }

    buildUI();
    registerMenu();
})();
