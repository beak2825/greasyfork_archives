// ==UserScript==
// @name         SetupVPN自动重连
// @license      MIT
// @namespace    https://tampermonkey.net/
// @version      0.0.7
// @description  SetupVPN 网页端自动选择服务器并连接，遇到验证码会暂停等待，自动处理重试/错误页，同时实时监控剩余时长并在到期前自动重连（列表未加载时默认 United States）
// @match        https://uaia.scanners.fun/ui/*
// @match        https://www2.agentsless.org/ui/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559780/SetupVPN%E8%87%AA%E5%8A%A8%E9%87%8D%E8%BF%9E.user.js
// @updateURL https://update.greasyfork.org/scripts/559780/SetupVPN%E8%87%AA%E5%8A%A8%E9%87%8D%E8%BF%9E.meta.js
// ==/UserScript==

(function () {

    /******** 配置 ********/
    const DEFAULT_COUNTRY = "United States"; // ✅ 选择框为空时默认值
    const RECONNECT_BEFORE_SEC = parseInt(localStorage.getItem("UAIA_RECONNECT_BEFORE_SEC") || "20", 10); // <= 20s 自动重连（可在 localStorage 改）

    let TARGET_COUNTRY = localStorage.getItem("UAIA_TARGET_COUNTRY") || DEFAULT_COUNTRY;

    if (!location.href.includes("/ui/")) return;

    /******** UI ********/
    const host = document.createElement("div");
    host.style.position = "fixed";
    host.style.bottom = "20px";
    host.style.right = "20px";
    host.style.zIndex = "2147483647";
    document.documentElement.appendChild(host);

    const shadow = host.attachShadow({ mode: "closed" });
    shadow.innerHTML = `
        <style>
            #panel {
                background: rgba(0,0,0,0.85);
                color: white;
                padding: 12px 16px;
                border-radius: 12px;
                width: 280px;
                font-family: Arial;
                font-size: 14px;
                cursor: move;
                user-select: none;
            }
            select, button {
                width: 100%;
                padding: 6px;
                border-radius: 6px;
                margin-top: 6px;
            }
            button {
                background: #2b8fff;
                color: #fff;
                border: none;
                cursor: pointer;
            }
            .hint { opacity: .85; font-size: 12px; margin-top: 6px; }
        </style>
        <div id="panel">
            <div><b>VPN 管理系统</b></div>
            <select id="countrySelector"></select>
            <div id="body">状态：初始化...</div>
            <div class="hint">默认国家：${DEFAULT_COUNTRY}</div>
            <div class="hint">自动重连阈值：${RECONNECT_BEFORE_SEC}s（localStorage: UAIA_RECONNECT_BEFORE_SEC）</div>
            <button id="connectBtn">手动重连 VPN</button>
        </div>
    `;

    const panel = shadow.getElementById("panel");
    const body = shadow.getElementById("body");
    const selector = shadow.getElementById("countrySelector");
    const connectBtn = shadow.getElementById("connectBtn");

    // 拖拽（fixed 元素用 left/top 更稳）
    panel.onmousedown = e => {
        const rect = host.getBoundingClientRect();
        const dx = e.clientX - rect.left;
        const dy = e.clientY - rect.top;

        host.style.right = "auto";
        host.style.bottom = "auto";
        host.style.left = rect.left + "px";
        host.style.top = rect.top + "px";

        document.onmousemove = ev => {
            host.style.left = (ev.clientX - dx) + "px";
            host.style.top = (ev.clientY - dy) + "px";
        };
        document.onmouseup = () => document.onmousemove = null;
    };

    /******** DOM 工具 ********/
    const sleep = ms => new Promise(r => setTimeout(r, ms));

    function findClickable(textOrRegex) {
        const nodes = [...document.querySelectorAll(
            "button, a, [role='button'], .ant-btn, span"
        )];

        const match = (s) => {
            const t = (s || "").replace(/\s+/g, " ").trim();
            if (!t) return false;
            if (textOrRegex instanceof RegExp) return textOrRegex.test(t);
            return t.toLowerCase() === String(textOrRegex).toLowerCase();
        };

        const priority = nodes.filter(n =>
            n.matches("button, a, [role='button'], .ant-btn")
        );
        const rest = nodes.filter(n => !priority.includes(n));

        return [...priority, ...rest].find(el => match(el.innerText));
    }

    function isConnectedByButton() {
        return !!findClickable(/^disconnect$/i);
    }

    function getCountryLi() {
        if (!TARGET_COUNTRY) return null;
        return [...document.querySelectorAll("h4.ant-list-item-meta-title")]
            .find(n => n.innerText.trim() === TARGET_COUNTRY)
            ?.closest("li.ant-list-item");
    }

    /******** ⭐ 动态国家列表 & 下拉框同步（为空默认 United States） ********/
    function getVisibleServerCountries() {
        return [...new Set(
            [...document.querySelectorAll("h4.ant-list-item-meta-title")]
                .map(el => el.innerText.trim())
                .filter(Boolean)
        )];
    }

    function syncCountrySelector() {
        const countries = getVisibleServerCountries();

        // ✅ 列表为空：下拉框至少放一个 United States
        if (!countries.length) {
            if (!selector.options.length) {
                selector.innerHTML = "";
                const o = document.createElement("option");
                o.value = DEFAULT_COUNTRY;
                o.textContent = DEFAULT_COUNTRY;
                selector.appendChild(o);
            }

            TARGET_COUNTRY = TARGET_COUNTRY || DEFAULT_COUNTRY;
            selector.value = TARGET_COUNTRY;

            localStorage.setItem("UAIA_TARGET_COUNTRY", TARGET_COUNTRY);
            return;
        }

        const old = TARGET_COUNTRY || DEFAULT_COUNTRY;
        selector.innerHTML = "";

        countries.forEach(c => {
            const o = document.createElement("option");
            o.value = c;
            o.textContent = c;
            selector.appendChild(o);
        });

        TARGET_COUNTRY = countries.includes(old) ? old : countries[0];
        selector.value = TARGET_COUNTRY;
        localStorage.setItem("UAIA_TARGET_COUNTRY", TARGET_COUNTRY);
    }

    selector.onchange = () => {
        TARGET_COUNTRY = selector.value || DEFAULT_COUNTRY;
        localStorage.setItem("UAIA_TARGET_COUNTRY", TARGET_COUNTRY);
        body.innerHTML = `状态：已选择 ${TARGET_COUNTRY}`;
    };

    /******** ✅ 实时读取 “Time remaining” ********/
    function parseCountdownSeconds(text) {
        const t = (text || "").replace(/\s+/g, " ").trim();
        if (!t) return null;

        // hh:mm:ss 或 mm:ss（常见：00:07:22）
        const m = t.match(/\b(\d{1,2}):(\d{2})(?::(\d{2}))?\b/);
        if (m) {
            const a = parseInt(m[1], 10);
            const b = parseInt(m[2], 10);
            const c = m[3] != null ? parseInt(m[3], 10) : null;
            const sec = (c == null) ? (a * 60 + b) : (a * 3600 + b * 60 + c);
            return Number.isFinite(sec) ? sec : null;
        }

        // 兜底：123s / 123 秒
        const s = t.match(/\b(\d+)\s*(?:s|sec|seconds|秒)\b/i);
        if (s) {
            const sec = parseInt(s[1], 10);
            return Number.isFinite(sec) ? sec : null;
        }
        return null;
    }

    function getTimeRemainingSeconds() {
        // 优先：找 title=Time remaining 的 ant-statistic（最稳）
        const stats = [...document.querySelectorAll(".ant-statistic")];
        for (const st of stats) {
            const title = st.querySelector(".ant-statistic-title")?.innerText?.trim() || "";
            if (/time remaining/i.test(title) || /剩余|倒计时/i.test(title)) {
                const v = st.querySelector(".ant-statistic-content-value")?.innerText?.trim();
                const sec = parseCountdownSeconds(v);
                if (sec != null) return sec;
            }
        }

        // 兜底：页面只有一个统计值
        const v = document.querySelector("span.ant-statistic-content-value")?.innerText?.trim();
        const sec = parseCountdownSeconds(v);
        return sec != null ? sec : null;
    }

    function formatHMS(sec) {
        sec = Math.max(0, Math.floor(sec));
        const h = Math.floor(sec / 3600);
        const m = Math.floor((sec % 3600) / 60);
        const s = sec % 60;
        const pad = (n) => String(n).padStart(2, "0");
        return `${pad(h)}:${pad(m)}:${pad(s)}`;
    }

    /******** 验证码暂停 ********/
    let captchaPaused = false;

    function detectCaptchaPage() {
        const input = document.querySelector("input#captcha");
        const btn = findClickable(/^continue$/i);
        return !!(input && btn);
    }

    function handleCaptchaPause() {
        if (detectCaptchaPage()) {
            if (!captchaPaused) {
                captchaPaused = true;
                body.innerHTML = `⚠️ 检测到验证码<br>已暂停自动操作<br>请手动完成后点击 Continue`;
            }
            return true;
        }
        if (captchaPaused) {
            captchaPaused = false;
            body.innerHTML = `状态：验证码完成，恢复中...`;
        }
        return false;
    }

    /******** ✅ 重试页：自动点 Try again / Try aging ********/
    function handleRetryPage() {
        const retryBtn = findClickable(/try\s*ag/i);
        if (retryBtn) {
            body.innerHTML = `状态：检测到重试按钮，已点击 Try again`;
            retryBtn.click();
            return true;
        }
        return false;
    }

    /******** 错误页 ********/
    function handleErrorPage() {
        const backBtn = findClickable(/^back to server list$/i);
        if (backBtn) {
            body.innerHTML = `状态：连接失败，返回列表`;
            backBtn.click();
            return true;
        }
        return false;
    }

    /******** 跳回 Servers（侧边栏） ********/
    function gotoServersPage() {
        const serversBtn = findClickable(/^servers$/i) || findClickable(/servers/i);
        if (serversBtn) {
            serversBtn.click();
            return true;
        }
        return false;
    }

    /******** 统一重连流程 ********/
    let reconnecting = false;

    async function doReconnect(reason) {
        if (reconnecting) return;
        reconnecting = true;

        try {
            body.innerHTML = `🔄 ${reason}<br>准备重连...`;

            // 确保在 Servers 页
            gotoServersPage();
            await sleep(400);

            // 断开（如果有）
            const d = findClickable(/^disconnect$/i);
            if (d) {
                d.click();
                const t0 = Date.now();
                while (Date.now() - t0 < 8000 && isConnectedByButton()) {
                    await sleep(300);
                }
            }

            // 选择目标国家
            const t1 = Date.now();
            while (Date.now() - t1 < 5000) {
                const li = getCountryLi();
                if (li) {
                    body.innerHTML = `状态：重连中 → ${TARGET_COUNTRY}`;
                    li.click();
                    break;
                }
                await sleep(250);
            }
        } finally {
            reconnecting = false;
        }
    }

    /******** 手动 ********/
    connectBtn.onclick = async () => {
        if (detectCaptchaPage()) return;
        await doReconnect("手动触发");
    };

    /******** 主循环 ********/
    setInterval(async () => {

        syncCountrySelector();

        if (handleCaptchaPause()) return;
        if (handleRetryPage()) return;
        if (handleErrorPage()) return;

        // ✅ 已连接成功页：实时倒计时 + 快到期自动重连
        const remain = getTimeRemainingSeconds();
        if (remain != null) {
            body.innerHTML = `✅ 已连接<br>⏳ 剩余：${formatHMS(remain)}（${remain} 秒）`;

            if (remain <= RECONNECT_BEFORE_SEC) {
                await doReconnect(`剩余时间 ≤ ${RECONNECT_BEFORE_SEC}s`);
            }
            return; // 已连接时不做“自动点国家列表”
        }

        // 非已连接页：按原逻辑自动连接
        if (!isConnectedByButton() && !reconnecting) {
            const li = getCountryLi();
            if (li) {
                body.innerHTML = `状态：自动连接 → ${TARGET_COUNTRY}`;
                li.click();
            }
        }

    }, 500);

})();
