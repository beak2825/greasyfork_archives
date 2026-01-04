// ==UserScript==
// @name         Bing 自动搜索 - 可视化界面
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  增加更多候选词
// @author       Gemini Assistant (Final Fix)
// @match        https://www.bing.com/*
// @match        https://cn.bing.com/*
// @connect      api.gmya.net
// @connect      top.baidu.com
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/560612/Bing%20%E8%87%AA%E5%8A%A8%E6%90%9C%E7%B4%A2%20-%20%E5%8F%AF%E8%A7%86%E5%8C%96%E7%95%8C%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/560612/Bing%20%E8%87%AA%E5%8A%A8%E6%90%9C%E7%B4%A2%20-%20%E5%8F%AF%E8%A7%86%E5%8C%96%E7%95%8C%E9%9D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONSTANTS = {
        INPUT_DELAY: { min: 80, max: 180 },
        SCROLL_INTERVAL: { min: 3000, max: 6000 },
        SCROLL_DISTANCE: { min: 150, max: 600 },
        OBFUSCATION_PROB: 0.8,
        MOUSE_MOVE_STEPS: 20,
        MAX_HISTORY_LEN: 50,
        MAX_LOGS_LEN: 100,
        ERROR_RETRY_LIMIT: 3,
        ELEMENT_WAIT_TIMEOUT: 10000
    };

    const I18N = {
        STATUS_READY: "准备开始",
        STATUS_FETCH: "获取数据中",
        STATUS_TYPE: "打字中",
        STATUS_AUDIT: "阅读中",
        STATUS_WAIT: "等待中",
        STATUS_SLEEP: "深度休眠",
        STATUS_ERROR: "发生错误",
        TEXT_AUDITING: "模拟浏览网页",
        TEXT_WAITING: "任务冷却中...",
        TEXT_SLEEPING: "模拟下班休息中...",
        BTN_LOG: "历史",
        BTN_SKIP: "跳过",
        BTN_STOP: "停止",
        LOG_TITLE: "搜索历史",
        LOG_CLOSE: "关闭"
    };

    const CONFIG = {
        readTime: [15000, 30000],
        idleTime: [8000, 30000],
        waveSize: 6,
        waveSleepTime: 900000,
        apiHot: "https://api.gmya.net/Api/",
        apiSuffix: "https://api.gmya.net/Api/YiYan",
        backupSuffixes: [" 评测", " 分析", " 指南", " 教程", " 报告", " 攻略", " 对比", " 排名",
 " 购买建议", " 使用技巧", " 入门指南", " 进阶教程", " 深度分析", " 全面解读",
 " 用户体验", " 效果验证", " 质量评估", " 安全检测", " 性能测试", " 功能解析",
 " 2025趋势", " 市场前景", " 投资价值", " 性价比", " 竞品分析",
 " 新手教程", " 实战案例", " 成功经验", " 常见问题", " 解决方案",
 " 技术原理", " 工作机制", " 优缺点", " 品牌对比", " 产品对比",
 " 创新点", " 突破技术", " 发展历程", " 技术演进", " 市场份额",
 " 用户满意度", " 口碑分析", " 社会价值", " 经济效益", " 未来展望",
 " 应用场景", " 适用人群", " 操作指南", " 维护保养", " 故障排除"]
    };

    const KEYS = {
        RUNNING: 'bot_v48_run_state',
        HISTORY: 'bot_v48_hist',
        NEXT_TIME: 'bot_v48_next',
        START: 'bot_v48_start',
        LOGS: 'bot_v48_logs',
        TODAY_COUNT: 'bot_v48_daily_count',
        LAST_DATE: 'bot_v48_last_date',
        LAST_RUN_DATE: 'bot_v48_last_run_date',
        ERROR_COUNT: 'bot_v48_error_count',
        FORCE_NEXT: 'bot_v48_force_next'
    };

    const Utils = {
        sleep: ms => new Promise(r => setTimeout(r, ms)),
        rand: (min, max) => Math.floor(Math.random() * (max - min + 1) + min),

        confuseText(str) {
            const zeroWidthChars = ['\u200B', '\u200C', '\u200D', '\uFEFF'];
            let result = "";
            for (let char of str) {
                result += char;
                if (Math.random() > CONSTANTS.OBFUSCATION_PROB) {
                    const randomChar = zeroWidthChars[Math.floor(Math.random() * zeroWidthChars.length)];
                    result += randomChar;
                }
            }
            return result;
        },

        genCVID: len => {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            return Array.from({ length: len }, () =>
                chars.charAt(Math.floor(Math.random() * chars.length))
            ).join('');
        },

        async getSmartSuffix() {
            return new Promise((resolve) => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: CONFIG.apiSuffix,
                    timeout: 4000,
                    onload: (res) => {
                        try {
                            const json = JSON.parse(res.responseText);
                            const rawText = json?.data?.text;
                            if (!rawText) throw new Error("Empty response");

                            const cleanText = rawText.replace(/[，。！？；：“”（）\s,.\?!]/g, "");
                            const maxLen = Math.min(cleanText.length, 9);
                            const targetLen = Utils.rand(Math.min(2, maxLen), maxLen);
                            const startIdx = Utils.rand(0, Math.max(0, cleanText.length - targetLen));

                            resolve({ text: " " + cleanText.substr(startIdx, targetLen), type: 'api' });
                        } catch(e) {
                            resolve({ text: CONFIG.backupSuffixes[Utils.rand(0, CONFIG.backupSuffixes.length - 1)], type: 'backup' });
                        }
                    },
                    onerror: () => resolve({ text: CONFIG.backupSuffixes[Utils.rand(0, CONFIG.backupSuffixes.length - 1)], type: 'backup' })
                });
            });
        },

        generateBezierPath(startX, startY, endX, endY, steps) {
            const points = [];
            const controlX = (startX + endX) / 2 + Utils.rand(-50, 50);
            const controlY = (startY + endY) / 2 + Utils.rand(-50, 50);

            for (let i = 0; i <= steps; i++) {
                const t = i / steps;
                const x = Math.pow(1-t, 2) * startX + 2 * (1-t) * t * controlX + Math.pow(t, 2) * endX;
                const y = Math.pow(1-t, 2) * startY + 2 * (1-t) * t * controlY + Math.pow(t, 2) * endY;
                points.push({ x: Math.round(x), y: Math.round(y) });
            }
            return points;
        },

        async simulateMouseMovement() {
            const startX = Utils.rand(100, 300);
            const startY = Utils.rand(100, 300);
            const endX = Utils.rand(800, 1000);
            const endY = Utils.rand(400, 600);
            const points = Utils.generateBezierPath(startX, startY, endX, endY, CONSTANTS.MOUSE_MOVE_STEPS);

            for (const point of points) {
                const event = new MouseEvent('mousemove', {
                    clientX: point.x,
                    clientY: point.y,
                    bubbles: true
                });
                document.dispatchEvent(event);
                await Utils.sleep(Utils.rand(10, 30));
            }
        },

        async waitForElement(selector, timeout = CONSTANTS.ELEMENT_WAIT_TIMEOUT) {
            const startTime = Date.now();
            while (Date.now() - startTime < timeout) {
                const element = document.querySelector(selector);
                if (element) return element;
                await this.sleep(100);
            }
            throw new Error(`Element ${selector} not found after ${timeout}ms`);
        }
    };

    const UI = {
        init() {
            if (document.getElementById('bot-container')) return;

            const style = document.createElement('style');
            style.textContent = `
                #bot-container { position: fixed; bottom: 30px; left: 30px; z-index: 2147483647; font-family: 'Segoe UI', system-ui, sans-serif; }
                .bot-launcher { width: 50px; height: 50px; border-radius: 25px; background: rgba(0, 120, 212, 0.85); backdrop-filter: blur(12px); display: flex; align-items: center; justify-content: center; cursor: pointer; color: white; opacity: 0.1; transition: 0.5s; }
                .bot-launcher:hover { opacity: 1; transform: scale(1.1); }
                .glass-card { display: none; width: 300px; background: rgba(255, 255, 255, 0.65); backdrop-filter: blur(25px) saturate(180%); border: 1px solid rgba(255, 255, 255, 0.4); border-radius: 28px; padding: 22px; box-shadow: 0 20px 50px rgba(0,0,0,0.15); }
                .status-badge { font-size: 10px; font-weight: 900; padding: 5px 12px; border-radius: 50px; background: rgba(0,120,212,0.12); color: #005a9e; }
                .status-badge.sleeping { background: rgba(255, 185, 0, 0.2); color: #847500; }
                .status-badge.error { background: rgba(244, 67, 54, 0.2); color: #d32f2f; }
                #bot-source-tag { font-size: 9px; color: #0078d4; font-weight: 800; background: rgba(0,120,212,0.08); padding: 2px 6px; border-radius: 4px; display: none; margin-bottom: 5px; width: fit-content; }
                .kw-text { font-size: 14px; font-weight: 600; color: #111; margin: 10px 0; min-height: 22px; line-height: 1.4; word-break: break-all; }
                .suffix-api { color: #005a9e; font-weight: 700; font-size: 13px; }
                .suffix-backup { color: rgba(0, 120, 212, 0.5); font-weight: 500; font-size: 13px; }
                .progress-container { height: 7px; background: rgba(0,0,0,0.06); border-radius: 10px; overflow: hidden; margin-bottom: 22px; }
                .progress-fill { height: 100%; width: 0%; background: linear-gradient(90deg, #0078d4, #2baffc); transition: width 0.15s linear; }
                .btn-group { display: flex; gap: 10px; }
                .action-btn { flex: 1; border: none; padding: 12px; border-radius: 16px; font-size: 11px; font-weight: 700; cursor: pointer; background: rgba(0,0,0,0.05); color: #333; transition: 0.2s; }
                .action-btn:hover { background: rgba(0,0,0,0.1); }
                .action-btn:active { transform: scale(0.95); }
                #bot-timer { font-family: monospace; font-size: 13px; color: #0078d4; font-weight: 800; }
                #bot-log-modal { display: none; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 380px; background: rgba(255,255,255,0.95); backdrop-filter: blur(30px); z-index: 2147483648; padding: 30px; border-radius: 32px; box-shadow: 0 30px 100px rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.5); }
            `;
            document.head.appendChild(style);

            const container = document.createElement('div');
            container.id = 'bot-container';
            container.innerHTML = `
                <div class="bot-launcher" id="bot-launch-btn" title="启动自动搜索">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                    </svg>
                </div>
                <div class="glass-card" id="bot-panel">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <div>
                            <span class="status-badge" id="bot-status">${I18N.STATUS_READY}</span>
                            <span id="bot-count-ui" style="font-size:11px; font-weight:900; color:#0078d4; margin-left:8px;">0</span>
                        </div>
                        <span id="bot-timer">0.0s</span>
                    </div>
                    <div style="margin-top:15px;"><div id="bot-source-tag"></div></div>
                    <div class="kw-text" id="bot-kw">${I18N.STATUS_READY}</div>
                    <div class="progress-container"><div id="bot-fill" class="progress-fill"></div></div>
                    <div class="btn-group">
                        <button class="action-btn" id="b-log">${I18N.BTN_LOG}</button>
                        <button class="action-btn" id="b-skip" style="background:rgba(0,120,212,0.85); color:white;">${I18N.BTN_SKIP}</button>
                        <button class="action-btn" id="b-stop" style="background:rgba(244,67,54,0.85); color:white;">${I18N.BTN_STOP}</button>
                    </div>
                </div>
                <div id="bot-log-modal">
                    <h3 style="margin-top:0;">${I18N.LOG_TITLE}</h3>
                    <div id="l-content" style="max-height:300px;overflow-y:auto;font-size:12px;"></div>
                    <button id="b-close" style="width:100%;padding:12px;margin-top:15px;border:none;border-radius:16px;background:#f0f0f0;font-weight:700;cursor:pointer;">${I18N.LOG_CLOSE}</button>
                </div>
            `;
            document.body.appendChild(container);

            // 事件绑定 - 在元素创建后执行
            document.getElementById('bot-launch-btn').addEventListener('click', () => {
                GM_setValue(KEYS.RUNNING, true);
                GM_setValue(KEYS.LAST_RUN_DATE, new Date().toLocaleDateString());
                GM_setValue(KEYS.FORCE_NEXT, true); // 强制立即执行
                location.reload();
            });

            document.getElementById('b-skip').addEventListener('click', () => {
                GM_setValue(KEYS.NEXT_TIME, 0);
                location.assign('https://www.bing.com');
            });

            document.getElementById('b-stop').addEventListener('click', () => {
                GM_setValue(KEYS.RUNNING, false);
                location.reload();
            });

            // 关键修复：历史按钮点击事件
            document.getElementById('b-log').addEventListener('click', (e) => {
                e.preventDefault(); // 阻止默认行为
                e.stopPropagation(); // 阻止事件冒泡
                const modal = document.getElementById('bot-log-modal');
                if (modal) {
                    modal.style.display = 'block';
                    this.updateLogs();
                } else {
                    console.error('模态框元素未找到');
                }
            });

            document.getElementById('b-close').addEventListener('click', () => {
                const modal = document.getElementById('bot-log-modal');
                if (modal) modal.style.display = 'none';
            });

            // 初始化显示状态
            const isRunning = GM_getValue(KEYS.RUNNING, false);
            document.getElementById('bot-launch-btn').style.display = isRunning ? 'none' : 'flex';
            document.getElementById('bot-panel').style.display = isRunning ? 'block' : 'none';
        },

        updateCountUI() {
            const count = GM_getValue(KEYS.TODAY_COUNT, 0);
            const element = document.getElementById('bot-count-ui');
            if (element) element.textContent = count;
        },

        renderKW(raw, suffix, type) {
            const className = type === 'api' ? 'suffix-api' : 'suffix-backup';
            return `${raw}${suffix ? `<span class="${className}">${this.escapeHtml(suffix)}</span>` : ''}`;
        },

        escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        },

        update(status, kw, progress, timerText, source, suffix = "", type = "api", isSleeping = false, isError = false) {
            const s = document.getElementById('bot-status');
            const k = document.getElementById('bot-kw');
            const f = document.getElementById('bot-fill');
            const t = document.getElementById('bot-timer');
            const st = document.getElementById('bot-source-tag');

            if (s) {
                s.textContent = status;
                s.className = `status-badge ${isSleeping ? 'sleeping' : ''} ${isError ? 'error' : ''}`;
            }
            if (k && kw) k.innerHTML = this.renderKW(kw, suffix, type);
            if (f && progress !== undefined) f.style.width = Math.max(0, Math.min(100, progress)) + "%";
            if (t && timerText) t.textContent = timerText;
            if (st && source) {
                st.textContent = source;
                st.style.display = 'block';
            }
        },

        updateLogs() {
            const logs = GM_getValue(KEYS.LOGS, []);
            const content = document.getElementById('l-content');
            if (!content) return;

            content.innerHTML = logs.slice().reverse().map(l => `
                <div style="padding:10px 0;border-bottom:1px solid rgba(0,0,0,0.05);">
                    <div style="display:flex; justify-content:space-between; font-size:10px; color:#888; margin-bottom:3px;">
                        <span>${this.escapeHtml(l.time)}</span>
                        <span style="color:#0078d4; font-weight:800;">${this.escapeHtml(l.sourceName)}</span>
                    </div>
                    ${this.renderKW(l.raw, l.suffix, l.suffixType)}
                </div>`).join('');
        }
    };

    const Controller = {
        errorCount: 0,

        async fetch() {
            const sources = ['DouYinHot', 'WeiBoHot', 'TouTiaoHot', 'BaiduHot'];
            const sourceKey = sources[Utils.rand(0, sources.length - 1)];
            const sourceName = {
                'DouYinHot': '抖音热搜',
                'WeiBoHot': '微博热搜',
                'TouTiaoHot': '头条热搜',
                'BaiduHot': '百度热搜'
            }[sourceKey];

            UI.update(I18N.STATUS_FETCH, "正在刷新热搜池...", 50, "GO", sourceName);

            return new Promise((resolve) => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: CONFIG.apiHot + sourceKey,
                    timeout: 5000,
                    onload: async (res) => {
                        try {
                            const json = JSON.parse(res.responseText);
                            const words = json?.data?.map(item => item?.title).filter(Boolean);
                            if (!words || words.length === 0) throw new Error("No data");
                            await this.processWords(words, sourceName);
                            resolve();
                        } catch(e) {
                            await this.fallbackFetch();
                            resolve();
                        }
                    },
                    onerror: async () => {
                        await this.fallbackFetch();
                        resolve();
                    }
                });
            });
        },

        async fallbackFetch() {
            return new Promise((resolve) => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: "https://top.baidu.com/board?tab=realtime",
                    onload: (res) => {
                        try {
                            const doc = new DOMParser().parseFromString(res.responseText, "text/html");
                            const words = Array.from(doc.querySelectorAll('.c-single-text-ellipsis'))
                                .map(e => e.textContent?.trim())
                                .filter(Boolean);
                            this.processWords(words, "百度(备用)");
                        } catch(e) {
                            UI.update(I18N.STATUS_ERROR, "获取失败", 0, "ERR", null, "", "api", false, true);
                        } finally {
                            resolve();
                        }
                    },
                    onerror: () => {
                        UI.update(I18N.STATUS_ERROR, "网络错误", 0, "ERR", null, "", "api", false, true);
                        resolve();
                    }
                });
            });
        },

        async processWords(words, sourceName) {
            try {
                const history = GM_getValue(KEYS.HISTORY, []);
                let pool = words.filter(w => w && !history.includes(w));

                if (pool.length === 0) {
                    GM_setValue(KEYS.HISTORY, []);
                    pool = words;
                }

                const targetRaw = pool[Utils.rand(0, pool.length - 1)];
                const suffixObj = await Utils.getSmartSuffix();
                const targetConfused = Utils.confuseText(targetRaw + suffixObj.text);

                const input = await Utils.waitForElement('#sb_form_q, input[type="search"]');

                await Utils.simulateMouseMovement();

                UI.update(I18N.STATUS_TYPE, targetRaw, 100, "WAIT", sourceName, suffixObj.text, suffixObj.type);

                input.focus();
                input.value = "";
                for (let char of targetConfused) {
                    input.value += char;
                    input.dispatchEvent(new InputEvent('input', { bubbles: true, data: char }));
                    await Utils.sleep(Utils.rand(CONSTANTS.INPUT_DELAY.min, CONSTANTS.INPUT_DELAY.max));
                }

                sessionStorage.setItem('search_pending', 'true');
                sessionStorage.setItem('last_source', sourceName);
                sessionStorage.setItem('last_raw', targetRaw);
                sessionStorage.setItem('last_suffix', suffixObj.text);
                sessionStorage.setItem('last_suffix_type', suffixObj.type);

                history.push(targetRaw);
                GM_setValue(KEYS.HISTORY, history.slice(-CONSTANTS.MAX_HISTORY_LEN));

                const logs = GM_getValue(KEYS.LOGS, []);
                logs.push({
                    time: new Date().toLocaleTimeString(),
                    raw: targetRaw,
                    suffix: suffixObj.text,
                    suffixType: suffixObj.type,
                    sourceName: sourceName
                });
                GM_setValue(KEYS.LOGS, logs.slice(-CONSTANTS.MAX_LOGS_LEN));

                await Utils.sleep(800);

                const searchUrl = `https://www.bing.com/search?q=${encodeURIComponent(targetConfused)}&cvid=${Utils.genCVID(32)}&form=${Utils.genCVID(4)}`;
                location.assign(searchUrl);

            } catch (error) {
                console.error("处理关键词失败:", error);
                UI.update(I18N.STATUS_ERROR, "处理失败", 0, "ERR", null, "", "api", false, true);
                this.errorCount++;
            }
        },

        async startLogic() {
            const isResult = window.location.href.includes('search?q=') || !!document.querySelector('#b_results');

            if (isResult) {
                await this.handleSearchResult();
            } else {
                await this.handleWaiting();
            }
        },

        async handleSearchResult() {
            const duration = Utils.rand(CONFIG.readTime[0], CONFIG.readTime[1]);
            const startTime = Date.now();

            if (sessionStorage.getItem('search_pending') === 'true') {
                GM_setValue(KEYS.TODAY_COUNT, GM_getValue(KEYS.TODAY_COUNT, 0) + 1);
                sessionStorage.removeItem('search_pending');
                UI.updateCountUI();
            }

            const scrollInterval = setInterval(() => {
                if (!GM_getValue(KEYS.RUNNING, false)) {
                    clearInterval(scrollInterval);
                    return;
                }
                window.scrollBy({
                    top: Utils.rand(CONSTANTS.SCROLL_DISTANCE.min, CONSTANTS.SCROLL_DISTANCE.max),
                    behavior: Math.random() > 0.3 ? 'smooth' : 'auto'
                });
            }, Utils.rand(CONSTANTS.SCROLL_INTERVAL.min, CONSTANTS.SCROLL_INTERVAL.max));

            const uiTimer = setInterval(() => {
                if (!GM_getValue(KEYS.RUNNING, false)) {
                    clearInterval(uiTimer);
                    clearInterval(scrollInterval);
                    return;
                }

                const elapsed = Date.now() - startTime;
                const progress = (1 - (elapsed / duration)) * 100;
                const timeStr = ((duration - elapsed) / 1000).toFixed(1) + "s";

                UI.update(
                    I18N.STATUS_AUDIT,
                    sessionStorage.getItem('last_raw') || I18N.TEXT_AUDITING,
                    progress,
                    timeStr,
                    sessionStorage.getItem('last_source'),
                    sessionStorage.getItem('last_suffix'),
                    sessionStorage.getItem('last_suffix_type')
                );

                if (elapsed >= duration) {
                    clearInterval(uiTimer);
                    clearInterval(scrollInterval);

                    const count = GM_getValue(KEYS.TODAY_COUNT, 0);
                    let nextWait = Utils.rand(CONFIG.idleTime[0], CONFIG.idleTime[1]);
                    if (count > 0 && count % CONFIG.waveSize === 0) {
                        nextWait = CONFIG.waveSleepTime;
                    }

                    GM_setValue(KEYS.NEXT_TIME, Date.now() + nextWait);
                    GM_setValue(KEYS.START, Date.now());
                    location.assign('https://www.bing.com');
                }
            }, 100);
        },

        async handleWaiting() {
            const waitTimer = setInterval(() => {
                if (!GM_getValue(KEYS.RUNNING, false)) {
                    clearInterval(waitTimer);
                    return;
                }

                const now = Date.now();
                const next = GM_getValue(KEYS.NEXT_TIME, 0);
                const start = GM_getValue(KEYS.START, now);
                const forceNext = GM_getValue(KEYS.FORCE_NEXT, false);

                if (forceNext || now >= next) {
                    if (!window.isExec) {
                        window.isExec = true;
                        clearInterval(waitTimer);
                        if (forceNext) {
                            GM_setValue(KEYS.FORCE_NEXT, false);
                        }
                        this.fetch();
                    }
                } else {
                    const prog = ((now - start) / (next - start)) * 100;
                    const timeStr = Math.ceil((next - now) / 1000) + "s";
                    const isLongSleep = (next - start) >= CONFIG.waveSleepTime;

                    UI.update(
                        isLongSleep ? I18N.STATUS_SLEEP : I18N.STATUS_WAIT,
                        isLongSleep ? I18N.TEXT_SLEEPING : I18N.TEXT_WAITING,
                        prog,
                        timeStr,
                        null,
                        "",
                        "api",
                        isLongSleep
                    );
                }
            }, 500);
        },

        run() {
            try {
                const today = new Date().toLocaleDateString();

                // 每日重置计数器
                if (today !== GM_getValue(KEYS.LAST_DATE, "")) {
                    GM_setValue(KEYS.TODAY_COUNT, 0);
                    GM_setValue(KEYS.LAST_DATE, today);
                }

                const lastRunDate = GM_getValue(KEYS.LAST_RUN_DATE, "");
                const isRunning = GM_getValue(KEYS.RUNNING, false);

                // 跨天检测
                if (today !== lastRunDate) {
                    if (lastRunDate && isRunning) {
                        GM_setValue(KEYS.RUNNING, false);
                        console.log(`新的一天 (${today})，脚本已自动停止`);
                    }
                }

                UI.init();
                UI.updateCountUI();

                // 如果正在运行，启动逻辑
                if (GM_getValue(KEYS.RUNNING, false)) {
                    this.startLogic();
                }
            } catch (error) {
                console.error("脚本初始化失败:", error);
                UI.update(I18N.STATUS_ERROR, "初始化错误", 0, "ERR", null, "", "api", false, true);
            }
        }
    };

    // 启动脚本
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => Controller.run());
    } else {
        Controller.run();
    }
})();
