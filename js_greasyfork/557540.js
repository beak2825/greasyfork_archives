// ==UserScript==
// @name         TIXUISID 工具
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  TIXUISID 管理工具 - 讀取、設定、複製 TIXUISID cookie
// @author       You
// @match        *://tixcraft.com/*
// @match        *://*.tixcraft.com/*
// @match        *://kevin930808.github.io/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_cookie
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @grant        GM_getClipboard
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/557540/TIXUISID%20%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/557540/TIXUISID%20%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("TIXUISID 工具腳本載入");

    // ========================
    //  工具函數
    // ========================

    // 讀取 cookie（模擬 Chrome 插件的 chrome.cookies.get 方式）
    function getCookie(name, url) {
        return new Promise((resolve) => {
            console.log(`Getting cookie ${name} from ${url} (like Chrome extension)`);
            
            // 使用 GM_cookie.list 來模擬 chrome.cookies.get（可以讀取 httpOnly cookie）
            if (typeof GM_cookie !== 'undefined' && GM_cookie.list) {
                // 嘗試兩種回調參數順序
                GM_cookie.list({ url: url }, (error, cookies) => {
                    if (error) {
                        // 嘗試另一種順序 (cookies, error)
                        GM_cookie.list({ url: url }, (cookies2, error2) => {
                            if (error2) {
                                console.error("GM_cookie.list error:", error2);
                                resolve(null);
                            } else if (cookies2 && Array.isArray(cookies2)) {
                                console.log(`Found ${cookies2.length} cookies (like Chrome cookies.get):`);
                                console.log("All cookies:", cookies2.map(c => `${c.name} (httpOnly: ${c.httpOnly || false})`).join(", "));
                                const cookie = cookies2.find(c => c && c.name === name);
                                if (cookie && cookie.value) {
                                    console.log(`✓ Found ${name} (like Chrome extension)`);
                                    resolve(cookie.value);
                                } else {
                                    console.log(`✗ ${name} not found in ${cookies2.length} cookies`);
                                    resolve(null);
                                }
                            } else {
                                resolve(null);
                            }
                        });
                    } else if (cookies && Array.isArray(cookies)) {
                        console.log(`Found ${cookies.length} cookies (like Chrome cookies.get):`);
                        console.log("All cookies:", cookies.map(c => `${c.name} (httpOnly: ${c.httpOnly || false})`).join(", "));
                        const cookie = cookies.find(c => c && c.name === name);
                        if (cookie && cookie.value) {
                            console.log(`✓ Found ${name} (like Chrome extension)`);
                            resolve(cookie.value);
                        } else {
                            console.log(`✗ ${name} not found in ${cookies.length} cookies`);
                            resolve(null);
                        }
                    } else {
                        resolve(null);
                    }
                });
            } else {
                console.log("GM_cookie not available, falling back to document.cookie");
                // 降級方案：使用 document.cookie（無法讀取 httpOnly）
                const current_cookies = document.cookie;
                if (!current_cookies) {
                    resolve(null);
                    return;
                }
                const allCookies = current_cookies.split(';');
                for (let cookie of allCookies) {
                    const [cookieName, cookieValue] = cookie.trim().split('=');
                    if (cookieName === name) {
                        console.log(`✓ Found ${name} via document.cookie (not httpOnly)`);
                        resolve(cookieValue);
                        return;
                    }
                }
                resolve(null);
            }
        });
    }

    // 設定 cookie（使用 GM_cookie API，並保存到本地存儲）
    function setCookie(name, value, url, options = {}) {
        return new Promise((resolve, reject) => {
            // 同時保存到本地存儲（用於手機裝置或無法讀取 cookie 時）
            try {
                GM_setValue(`tixuisid_${name}`, value);
                GM_setValue(`tixuisid_${name}_url`, url);
                GM_setValue(`tixuisid_${name}_time`, Date.now());
                console.log(`Saved ${name} to local storage`);
            } catch (e) {
                console.log("Could not save to local storage:", e);
            }

            // 嘗試使用 GM_cookie.set
            if (typeof GM_cookie !== 'undefined' && GM_cookie.set) {
                const cookieDetails = {
                    url: url,
                    name: name,
                    value: value,
                    path: options.path || "/",
                    secure: options.secure !== false,
                    httpOnly: options.httpOnly !== false,
                    sameSite: options.sameSite || "no_restriction"
                };

                GM_cookie.set(cookieDetails, (cookie, error) => {
                    if (error) {
                        console.error("GM_cookie.set error:", error);
                        // 即使設定失敗，也因為已保存到本地存儲而 resolve
                        resolve({ value: value, saved: true });
                    } else {
                        console.log(`Cookie ${name} set successfully`);
                        resolve(cookie || { value: value, saved: true });
                    }
                });
            } else {
                console.log("GM_cookie.set not available, only saved to local storage");
                resolve({ value: value, saved: true });
            }
        });
    }

    // 移除 cookie
    function removeCookie(name, url) {
        return new Promise((resolve, reject) => {
            GM_cookie.delete({ url: url, name: name }, (details, error) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(details);
                }
            });
        });
    }

    // 讀取剪貼簿
    async function readClipboard() {
        try {
            return await GM_getClipboard();
        } catch (e) {
            // 降級方案：使用 navigator.clipboard
            try {
                return await navigator.clipboard.readText();
            } catch (e2) {
                throw new Error("無法讀取剪貼簿");
            }
        }
    }

    // 寫入剪貼簿
    async function writeClipboard(text) {
        try {
            await GM_setClipboard(text);
        } catch (e) {
            // 降級方案：使用 navigator.clipboard
            try {
                await navigator.clipboard.writeText(text);
            } catch (e2) {
                throw new Error("無法寫入剪貼簿");
            }
        }
    }

    // ========================
    //  UI 面板
    // ========================

    function createPanel() {
        // 檢查是否已存在面板
        if (document.getElementById('tixuisid-tool-panel')) {
            return;
        }

        const panel = document.createElement('div');
        panel.id = 'tixuisid-tool-panel';
        panel.innerHTML = `
            <style>
                #tixuisid-tool-panel {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    width: 300px;
                    background: #111;
                    color: #f5f5f5;
                    border: 1px solid #555;
                    border-radius: 8px;
                    padding: 12px;
                    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
                    font-size: 12px;
                    z-index: 999999;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.5);
                }
                #tixuisid-tool-panel .title-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 8px;
                    padding-bottom: 8px;
                    border-bottom: 1px solid #555;
                }
                #tixuisid-tool-panel .title-row span {
                    font-weight: 600;
                    font-size: 14px;
                }
                #tixuisid-tool-panel .close-btn {
                    background: transparent;
                    border: none;
                    color: #fff;
                    cursor: pointer;
                    font-size: 18px;
                    padding: 0;
                    width: 24px;
                    height: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                #tixuisid-tool-panel .close-btn:hover {
                    background: rgba(255,255,255,0.1);
                    border-radius: 4px;
                }
                #tixuisid-tool-panel .section {
                    margin-top: 10px;
                }
                #tixuisid-tool-panel .label {
                    margin-bottom: 4px;
                    font-size: 11px;
                    color: #aaa;
                }
                #tixuisid-tool-panel .box {
                    border: 1px solid #555;
                    border-radius: 4px;
                    padding: 6px 8px;
                    min-height: 20px;
                    background: rgba(255, 255, 255, 0.06);
                    word-break: break-all;
                    font-size: 11px;
                }
                #tixuisid-tool-panel .btn-row {
                    margin-top: 6px;
                    display: flex;
                    gap: 6px;
                }
                #tixuisid-tool-panel button {
                    border-radius: 4px;
                    border: 1px solid #888;
                    background: #333;
                    color: #fff;
                    cursor: pointer;
                    padding: 4px 8px;
                    font-size: 11px;
                    flex: 1;
                }
                #tixuisid-tool-panel button:hover {
                    background: #444;
                }
                #tixuisid-tool-panel button.primary {
                    border-color: #00b894;
                    background: #00cec9;
                    color: #000;
                    font-weight: 600;
                }
                #tixuisid-tool-panel button.primary:hover {
                    background: #00b894;
                }
                #tixuisid-tool-panel input[type="text"] {
                    width: 100%;
                    box-sizing: border-box;
                    padding: 6px 8px;
                    border-radius: 4px;
                    border: 1px solid #555;
                    font-size: 12px;
                    margin-bottom: 6px;
                    background: #000;
                    color: #fff;
                }
                #tixuisid-tool-panel #status {
                    margin-top: 6px;
                    font-size: 11px;
                    color: #aaa;
                    min-height: 16px;
                }
                #tixuisid-tool-toggle {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    width: 50px;
                    height: 50px;
                    background: #00cec9;
                    color: #000;
                    border: 3px solid #fff;
                    border-radius: 50%;
                    cursor: pointer;
                    font-size: 20px;
                    font-weight: bold;
                    z-index: 999999;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                }
                #tixuisid-tool-toggle:hover {
                    background: #00b894;
                    transform: scale(1.1);
                    box-shadow: 0 6px 16px rgba(0,0,0,0.6);
                }
            </style>
            <div class="title-row">
                <span>TIXUISID 工具</span>
                <button class="close-btn" id="close-panel">×</button>
            </div>

            <div class="section">
                <div class="label">拓元使用者：</div>
                <div id="username" class="box"></div>
            </div>

            <div class="section">
                <div class="label">目前 tixcraft.com 的 TIXUISID：</div>
                <div id="current" class="box"></div>
                <div class="btn-row">
                    <button id="refresh">重新讀取</button>
                    <button id="copy">複製當前</button>
                </div>
            </div>

            <div class="section">
                <div class="label">輸入或貼上 TIXUISID：</div>
                <input id="input" type="text" />
                <div class="btn-row">
                    <button id="paste">貼上剪貼簿</button>
                    <button id="open" class="primary">設定並開啟 /order</button>
                </div>
                <div id="status"></div>
            </div>
        `;

        document.body.appendChild(panel);

        // 綁定事件
        const closeBtn = panel.querySelector('#close-panel');
        closeBtn.addEventListener('click', () => {
            panel.style.display = 'none';
            toggleBtn.style.display = 'block';
        });

        return panel;
    }

    function createToggleButton() {
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'tixuisid-tool-toggle';
        toggleBtn.textContent = 'T';
        toggleBtn.title = '開啟 TIXUISID 工具';
        toggleBtn.addEventListener('click', () => {
            const panel = document.getElementById('tixuisid-tool-panel');
            if (panel) {
                panel.style.display = 'block';
                toggleBtn.style.display = 'none';
            } else {
                const newPanel = createPanel();
                if (newPanel) {
                    toggleBtn.style.display = 'none';
                    initPanel(newPanel);
                }
            }
        });
        document.body.appendChild(toggleBtn);
        return toggleBtn;
    }

    // ========================
    //  面板功能邏輯
    // ========================

    function setStatus(text) {
        const statusEl = document.getElementById('status');
        if (statusEl) {
            statusEl.textContent = text || "";
        }
    }

    function loadUsername() {
        const usernameEl = document.getElementById('username');
        if (!usernameEl) return;

        if (!window.location.hostname.includes("tixcraft.com")) {
            usernameEl.textContent = "未登入";
            return;
        }

        const el = document.querySelector("a.user-name");
        if (el) {
            usernameEl.textContent = (el.textContent || "").trim() || "未登入";
        } else {
            usernameEl.textContent = "未登入";
        }
    }

    async function loadCurrentTixuisid() {
        setStatus("讀取中...");
        const currentEl = document.getElementById('current');
        const inputEl = document.getElementById('input');
        
        if (!currentEl || !inputEl) return;

        try {
            // 使用與 Chrome 插件相同的 URL 格式
            const baseUrls = [
                "https://tixcraft.com",  // 與 Chrome 版本完全相同
                "https://tixcraft.com/",
                window.location.href,  // 當前完整 URL
                window.location.origin + "/",
                "https://www.tixcraft.com",
                "https://www.tixcraft.com/"
            ];
            
            console.log("Current page URL:", window.location.href);
            console.log("Attempting to read TIXUISID cookie...");
            
            let value = null;
            for (const url of baseUrls) {
                try {
                    console.log(`Trying to get TIXUISID from: ${url}`);
                    value = await getCookie("TIXUISID", url);
                    if (value) {
                        console.log(`✓ Found TIXUISID from ${url}: ${value.substring(0, 20)}...`);
                        break;
                    } else {
                        console.log(`✗ TIXUISID not found in ${url}`);
                    }
                } catch (e) {
                    console.log(`✗ Failed to get cookie from ${url}:`, e);
                }
            }
            
            
            if (value) {
                currentEl.textContent = value;
                inputEl.value = value;
                setStatus("已讀取目前 TIXUISID");
            } else {
                currentEl.textContent = "(無法讀取 httpOnly cookie)";
                setStatus("提示：httpOnly cookie 無法直接讀取，請手動輸入 TIXUISID 並點擊「設定並開啟 /order」，之後會自動保存");
            }
        } catch (error) {
            console.error("getCookie error:", error);
            currentEl.textContent = "(讀取失敗)";
            setStatus("讀取失敗：" + (error.message || error));
        }
    }

    function initPanel(panel) {
        const refreshBtn = panel.querySelector('#refresh');
        const copyBtn = panel.querySelector('#copy');
        const pasteBtn = panel.querySelector('#paste');
        const openBtn = panel.querySelector('#open');

        // 等待頁面完全載入後再讀取 cookies
        function loadDataAfterPageLoad() {
            if (document.readyState === 'complete') {
                // 頁面已完全載入
                setTimeout(() => {
                    loadUsername();
                    loadCurrentTixuisid();
                }, 500); // 額外等待 500ms 確保 cookies 已設定
            } else {
                // 等待頁面載入完成
                window.addEventListener('load', () => {
                    setTimeout(() => {
                        loadUsername();
                        loadCurrentTixuisid();
                    }, 500);
                }, { once: true });
            }
        }
        
        loadDataAfterPageLoad();

        // 重新讀取（等待頁面載入完成）
        refreshBtn.addEventListener("click", () => {
            setStatus("等待頁面載入...");
            if (document.readyState === 'complete') {
                setTimeout(() => {
                    loadCurrentTixuisid();
                }, 300);
            } else {
                window.addEventListener('load', () => {
                    setTimeout(() => {
                        loadCurrentTixuisid();
                    }, 300);
                }, { once: true });
            }
        });

        // 複製
        copyBtn.addEventListener("click", async () => {
            const currentEl = document.getElementById('current');
            const value = currentEl ? currentEl.textContent || "" : "";
            if (!value || value.startsWith("(")) {
                setStatus("沒有可複製的 TIXUISID");
                return;
            }
            try {
                await writeClipboard(value);
                setStatus("已複製 TIXUISID");
            } catch (e) {
                console.error("Clipboard write failed:", e);
                setStatus("複製失敗，請確認瀏覽器允許剪貼簿權限");
            }
        });

        // 貼上
        pasteBtn.addEventListener("click", async () => {
            const inputEl = document.getElementById('input');
            if (!inputEl) return;
            try {
                const text = await readClipboard();
                if (!text) {
                    setStatus("剪貼簿沒有內容");
                    return;
                }
                inputEl.value = text.trim();
                setStatus("已貼上剪貼簿內容");
            } catch (e) {
                console.error("Clipboard read failed:", e);
                setStatus("無法讀取剪貼簿，請手動貼上");
            }
        });

        // 設定並開啟
        openBtn.addEventListener("click", () => {
            const inputEl = document.getElementById('input');
            if (!inputEl) return;

            const newValue = (inputEl.value || "").trim();
            if (!newValue) {
                setStatus("請先輸入 TIXUISID");
                return;
            }

            setStatus("正在開啟空白頁面設定 cookie...");

            // 先跳轉到空白頁面，並在 URL 參數中傳遞 TIXUISID 和目標 URL
            const targetUrl = "https://tixcraft.com/order";
            const cookies = { TIXUISID: newValue };
            const cookiesJson = encodeURIComponent(JSON.stringify(cookies));
            const redirectUrl = `https://kevin930808.github.io/TEST.HTML?target=${encodeURIComponent(targetUrl)}&cookies=${cookiesJson}`;

            // 在當前標籤頁跳轉
            window.location.href = redirectUrl;
        });
    }

    // ========================
    //  github.io 參數注入流程
    // ========================

    function checkAndProcessURL() {
        const host = window.location.hostname || "";
        if (!host.includes("github.io")) {
            return;
        }

        const urlParams = new URLSearchParams(window.location.search);
        const target = urlParams.get("target");
        const cookiesJson = urlParams.get("cookies");

        console.log("Target:", target);
        console.log("Cookies JSON:", cookiesJson);

        if (target && cookiesJson) {
            try {
                const cookies = JSON.parse(decodeURIComponent(cookiesJson));
                console.log("Parsed cookies:", cookies);
                console.log("Target URL:", decodeURIComponent(target));
                console.log("Cookies count:", Object.keys(cookies).length);

                injectCookiesAndRedirect(decodeURIComponent(target), cookies);
            } catch (error) {
                console.error("Error parsing cookies:", error);
            }
        } else {
            console.log("Missing parameters - Target:", target, "Cookies:", cookiesJson);
        }
    }

    async function injectCookiesAndRedirect(targetUrl, cookies) {
        const targetDomain = new URL(targetUrl).hostname;
        console.log("Target domain:", targetDomain);

        // 清除舊的 cookies
        for (const [name, value] of Object.entries(cookies)) {
            console.log(`Clearing old cookie: ${name}`);
            const urls = [
                `https://${targetDomain}`,
                `https://www.${targetDomain}`,
                targetUrl
            ];

            for (const url of urls) {
                try {
                    await removeCookie(name, url);
                } catch (e) {
                    console.error(`Failed to remove cookie ${name} from ${url}:`, e);
                }
            }
        }

        // 等待清除完成
        await new Promise(resolve => setTimeout(resolve, 200));

        // 設定新的 cookies
        for (const [name, value] of Object.entries(cookies)) {
            console.log(`Setting cookie: ${name} = ${value}`);

            const urls = [
                `https://${targetDomain}`,
                `https://www.${targetDomain}`
            ];

            for (const url of urls) {
                try {
                    const isKKTIX = targetDomain.includes('kktix.com');
                    await setCookie(name, value, url, {
                        path: "/",
                        secure: true,
                        httpOnly: !isKKTIX,
                        sameSite: "no_restriction"
                    });
                    console.log(`Cookie ${name} set for ${url}`);
                } catch (e) {
                    console.error(`Failed to set cookie ${name} for ${url}:`, e);
                }
            }
        }

        // 等待 cookies 設定完成後跳轉（在當前標籤頁）
        setTimeout(() => {
            console.log("Redirecting to:", targetUrl);
            window.location.href = targetUrl;
        }, 1000);
    }

    // ========================
    //  初始化
    // ========================

    let toggleBtn;

    function init() {
        // 確保 body 已存在
        if (!document.body) {
            console.log("Body not ready, waiting...");
            setTimeout(init, 100);
            return;
        }

        // 在 tixcraft.com 上創建切換按鈕和面板
        if (window.location.hostname.includes("tixcraft.com")) {
            console.log("Initializing TIXUISID tool for tixcraft.com");
            try {
                toggleBtn = createToggleButton();
                console.log("Toggle button created");
                const panel = createPanel();
                if (panel) {
                    panel.style.display = 'none';
                    initPanel(panel);
                    console.log("Panel created and initialized");
                }
            } catch (e) {
                console.error("Error initializing panel:", e);
            }
        }

        // 在 github.io 上處理 URL 參數
        if (window.location.hostname.includes("github.io")) {
            if (document.readyState === "loading") {
                document.addEventListener("DOMContentLoaded", () => {
                    checkAndProcessURL();
                });
            } else {
                checkAndProcessURL();
            }
        }
    }

    // 等待頁面載入完成
    function waitForBody() {
        if (document.body) {
            init();
        } else {
            setTimeout(waitForBody, 50);
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", waitForBody);
    } else {
        waitForBody();
    }

})();

