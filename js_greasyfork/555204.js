// ==UserScript==
// @name         传智教育答题脚本
// @namespace    https://stu.ityxb.com/
// @version      14.1-20251228
// @description  多源一致性+置信度、题目指纹增强、失败诊断面板；默认自动填入（可在配置中切换为仅提示）
// @author       多AI增强版
// @match        https://stu.ityxb.com/*
// @connect      *
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        unsafeWindow
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555204/%E4%BC%A0%E6%99%BA%E6%95%99%E8%82%B2%E7%AD%94%E9%A2%98%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/555204/%E4%BC%A0%E6%99%BA%E6%95%99%E8%82%B2%E7%AD%94%E9%A2%98%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // =========================
    // 版本 & 存储 Key（v14 独立，避免污染旧版）
    // =========================
    const SCRIPT_VERSION = "14.1";
    const STORE = {
        CACHE_KEY: "tiku_cache_v14",
        CONFIG_KEY: "chuanzhi_config_v14",
        DIAG_KEY: "chuanzhi_diag_v14",
    };

    // 指纹规则版本：改规则时 bump，避免旧缓存误命中
    const FINGERPRINT_RULE_VERSION = "v14r1";

    // =========================
    // AI 模型配置
    // =========================
    const AI_MODELS = {
        openai: {
            name: "OpenAI (GPT)",
            endpoint: "https://api.openai.com/v1/chat/completions",
            defaultModel: "gpt-4o-mini",
            authType: "Bearer",
            formatRequest: (config, prompt) => ({
                model: config.ai_model,
                temperature: 0.1,
                max_tokens: 700,
                messages: [
                    { role: "system", content: "你是专业答题助手。严格按用户要求输出。" },
                    { role: "user", content: prompt },
                ],
            }),
            parseResponse: (data) => data.choices?.[0]?.message?.content?.trim?.() || "",
        },

        claude: {
            name: "Claude (Anthropic)",
            endpoint: "https://api.anthropic.com/v1/messages",
            defaultModel: "claude-3-5-sonnet-20241022",
            authType: "x-api-key",
            formatRequest: (config, prompt) => ({
                model: config.ai_model,
                max_tokens: 700,
                messages: [{ role: "user", content: prompt }],
            }),
            parseResponse: (data) => data?.content?.[0]?.text?.trim?.() || "",
            extraHeaders: () => ({ "anthropic-version": "2023-06-01" }),
        },

        gemini: {
            name: "Google Gemini",
            endpoint: "https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent",
            defaultModel: "gemini-2.0-flash-exp",
            authType: "query",
            formatRequest: (config, prompt) => ({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { temperature: 0.1, maxOutputTokens: 700 },
            }),
            parseResponse: (data) => data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim?.() || "",
            buildUrl: (config) => {
                let url = (config.ai_url || "").trim();
                const model = (config.ai_model || "").trim();
                const key = (config.ai_key || "").trim();
                if (!url) url = AI_MODELS.gemini.endpoint;
                if (url.includes("{model}")) url = url.replace("{model}", encodeURIComponent(model));

                const keyPlaceholders = ["{key}", "{apiKey}", "{apikey}"];
                for (const ph of keyPlaceholders) {
                    if (url.includes(ph)) return url.replace(ph, encodeURIComponent(key));
                }
                const hasKeyParam = /[?&]key=/.test(url);
                if (!hasKeyParam) url += (url.includes("?") ? "&" : "?") + "key=" + encodeURIComponent(key);
                return url;
            },
        },

        deepseek: {
            name: "DeepSeek",
            endpoint: "https://api.deepseek.com/chat/completions",
            defaultModel: "deepseek-chat",
            authType: "Bearer",
            formatRequest: (config, prompt) => ({
                model: config.ai_model,
                temperature: 0.1,
                max_tokens: 700,
                messages: [
                    { role: "system", content: "你是专业答题助手。严格按用户要求输出。" },
                    { role: "user", content: prompt },
                ],
            }),
            parseResponse: (data) => data.choices?.[0]?.message?.content?.trim?.() || "",
        },

        custom: {
            name: "自定义 API",
            endpoint: "",
            defaultModel: "custom-model",
            authType: "Bearer",
            formatRequest: (config, prompt) => ({
                model: config.ai_model,
                temperature: 0.1,
                max_tokens: 700,
                messages: [
                    { role: "system", content: "你是专业答题助手。严格按用户要求输出。" },
                    { role: "user", content: prompt },
                ],
            }),
            parseResponse: (data) => {
                if (data.choices?.[0]?.message?.content) return data.choices[0].message.content.trim();
                if (data.content?.[0]?.text) return data.content[0].text.trim();
                if (data.response) return String(data.response).trim();
                return JSON.stringify(data);
            },
        },
    };

    // =========================
    // 工具函数
    // =========================
    const Utils = {
        sanitizeHTML(str) {
            const div = document.createElement("div");
            div.textContent = str ?? "";
            return div.innerHTML;
        },

        escapeAttr(str) {
            return String(str ?? "")
                .replace(/&/g, "&amp;")
                .replace(/"/g, "&quot;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;");
        },

        normalizeText(text) {
            return (text || "")
                .replace(/^[A-Z]\.?\s*/i, "")
                .replace(/[\s\n\r\t]+/g, "")
                .toLowerCase()
                .trim();
        },

        normalizeForCache(text) {
            return (text || "")
                .replace(/[\u00A0]/g, " ")
                .replace(/[\s\n\r\t]+/g, " ")
                .replace(/[【】\[\]（）(){}<>《》]/g, " ")
                .replace(/[，。；;：:、]/g, " ")
                .trim()
                .toLowerCase();
        },

        normalizeOptionForFingerprint(text) {
            return (text || "")
                .replace(/^\s*[A-Z][\.、\)]\s*/i, "")
                .replace(/[\u00A0]/g, " ")
                .replace(/[\s\n\r\t]+/g, " ")
                .replace(/[【】\[\]（）(){}<>《》]/g, " ")
                .replace(/[，。；;：:、]/g, " ")
                .trim()
                .toLowerCase();
        },

        hash32(str) {
            let h = 0x811c9dc5;
            for (let i = 0; i < str.length; i++) {
                h ^= str.charCodeAt(i);
                h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0;
            }
            return ("00000000" + h.toString(16)).slice(-8);
        },

        buildQuestionFingerprintV14({ questionText, optionTexts, qType, blankCount = 0 }) {
            const q = this.normalizeForCache(questionText);
            // 选项无序化：降低“选项顺序变化”导致缓存 miss
            const opts = (optionTexts || [])
                .map((t) => this.normalizeOptionForFingerprint(t))
                .filter(Boolean)
                .sort()
                .join("|");
            const raw = [
                `rule=${FINGERPRINT_RULE_VERSION}`,
                `type=${qType}`,
                `blankCount=${blankCount || 0}`,
                `q=${q}`,
                `opts=${opts}`,
            ].join("||");
            return "QF_" + this.hash32(raw);
        },

        sleep(ms) {
            return new Promise((resolve) => setTimeout(resolve, ms));
        },

        encrypt(text, salt = "chuanzhi_v14") {
            try {
                return btoa(
                    String(text || "")
                        .split("")
                        .map((c, i) => String.fromCharCode(c.charCodeAt(0) ^ salt.charCodeAt(i % salt.length)))
                        .join("")
                );
            } catch (_) {
                return String(text || "");
            }
        },

        decrypt(encrypted, salt = "chuanzhi_v14") {
            try {
                return atob(String(encrypted || ""))
                    .split("")
                    .map((c, i) => String.fromCharCode(c.charCodeAt(0) ^ salt.charCodeAt(i % salt.length)))
                    .join("");
            } catch (_) {
                return String(encrypted || "");
            }
        },

        safeJsonExtract(text) {
            const s = (text || "").trim();
            if (!s) return null;

            try {
                return JSON.parse(s);
            } catch (_) { }

            const firstObj = s.indexOf("{");
            const lastObj = s.lastIndexOf("}");
            if (firstObj !== -1 && lastObj !== -1 && lastObj > firstObj) {
                const sub = s.slice(firstObj, lastObj + 1);
                try {
                    return JSON.parse(sub);
                } catch (_) { }
            }

            const firstArr = s.indexOf("[");
            const lastArr = s.lastIndexOf("]");
            if (firstArr !== -1 && lastArr !== -1 && lastArr > firstArr) {
                const sub = s.slice(firstArr, lastArr + 1);
                try {
                    return JSON.parse(sub);
                } catch (_) { }
            }
            return null;
        },
    };

    // =========================
    // 诊断模块（结构化失败原因 + 导出）
    // =========================
    const Diagnostics = {
        counters: {
            extract_question_fail: 0,
            extract_option_fail: 0,
            bank_request_fail: 0,
            bank_parse_fail: 0,
            bank_no_answer: 0,
            ai_request_fail: 0,
            ai_json_repair_used: 0,
            ai_parse_fail: 0,
            consensus_conflict: 0,
            cache_write_skipped_low_conf: 0,
        },
        events: [],
        maxEvents: 200,

        reset() {
            this.counters = Object.fromEntries(Object.keys(this.counters).map((k) => [k, 0]));
            this.events = [];
            this.persist();
        },

        record(code, meta = {}) {
            if (this.counters[code] != null) this.counters[code] += 1;
            this.events.unshift({
                time: new Date().toLocaleString("zh-CN", { hour12: false }),
                code,
                ...meta,
            });
            if (this.events.length > this.maxEvents) this.events.length = this.maxEvents;
            this.persist();
        },

        persist() {
            try {
                GM_setValue(STORE.DIAG_KEY, {
                    counters: this.counters,
                    events: this.events,
                    timestamp: Date.now(),
                    version: SCRIPT_VERSION,
                });
            } catch (_) { }
        },

        load() {
            const d = GM_getValue(STORE.DIAG_KEY, null);
            if (d?.counters) this.counters = { ...this.counters, ...d.counters };
            if (Array.isArray(d?.events)) this.events = d.events.slice(0, this.maxEvents);
        },

        export() {
            const data = {
                version: SCRIPT_VERSION,
                time: new Date().toISOString(),
                counters: this.counters,
                events: this.events,
            };
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `chuanzhi_diag_${Date.now()}.json`;
            a.click();
            URL.revokeObjectURL(url);
        },
    };

    // =========================
    // 答案解析模块
    // =========================
    const AnswerParser = {
        typeName(qType) {
            if (qType === "0") return "单选";
            if (qType === "1") return "多选";
            if (qType === "2") return "填空";
            if (qType === "3") return "判断";
            return "单选";
        },

        buildAIPrompt({ questionText, qType, optionMap }) {
            const typeName = this.typeName(qType);
            const lines = [];

            lines.push("你是专业答题助手。");
            lines.push("任务：根据题目和选项给出正确答案。");
            lines.push("重要：只输出 JSON，不要输出任何解释、前后缀文本、代码块标记。");
            lines.push("");
            lines.push(`题型：${typeName}`);
            lines.push(`题目：${questionText}`);

            if (qType === "0" || qType === "1" || qType === "3") {
                lines.push("选项：");
                for (const item of optionMap) lines.push(`${item.letter}. ${item.text}`);
            }

            lines.push("");
            lines.push("输出 JSON 格式要求：");
            lines.push('1) 单选/多选：{"answers":["A"]} 或 {"answers":["A","C"]}');
            lines.push('2) 判断：{"answers":["正确"]} 或 {"answers":["错误"]}');
            lines.push('3) 填空：{"answers":["第1空","第2空"]}（按空的顺序）');
            lines.push("");
            lines.push("再次强调：只输出 JSON。");

            return lines.join("\n");
        },

        normalizeRawToAnswers(raw) {
            if (raw == null) return { answers: [] };

            if (typeof raw === "object") {
                const arr = raw.answers || raw.answer || raw.data || raw.result;
                if (Array.isArray(arr)) return { answers: arr.map((x) => String(x).trim()).filter(Boolean) };
                if (typeof arr === "string") return { answers: arr.split("#").map((x) => x.trim()).filter(Boolean) };
                return { answers: [JSON.stringify(raw)] };
            }

            const s = String(raw).trim();
            if (!s) return { answers: [] };

            const js = Utils.safeJsonExtract(s);
            if (js) {
                if (Array.isArray(js)) return { answers: js.map((x) => String(x).trim()).filter(Boolean) };
                if (typeof js === "object") {
                    const a = js.answers ?? js.answer ?? js.data ?? js.result;
                    if (Array.isArray(a)) return { answers: a.map((x) => String(x).trim()).filter(Boolean) };
                    if (typeof a === "string") return { answers: a.split("#").map((x) => x.trim()).filter(Boolean) };
                }
            }

            return { answers: s.split("#").map((x) => x.trim()).filter(Boolean) };
        },

        // 判断题语义解析：先否定后肯定，避免“不对/不正确”被误判为“对”
        normalizeJudgeToken(token) {
            const raw0 = String(token ?? "");
            if (!raw0.trim()) return null;

            let t = Utils.normalizeText(raw0);
            t = t
                .replace(/["'`]/g, "")
                .replace(/[()（）\[\]【】{}<>《》]/g, "")
                .replace(/[，。；;：:、,.!?！?]/g, "");

            if (!t) return null;

            // 否定优先
            if (
                t.includes("错误") ||
                t.includes("错") ||
                t === "否" ||
                t.includes("不对") ||
                t.includes("不正确") ||
                t.includes("不是") ||
                t.includes("不成立") ||
                t.includes("不是真") ||
                t.includes("非正确") ||
                t.includes("非对") ||
                t.includes("非真") ||
                t.includes("未成立") ||
                t.includes("未正确") ||
                t.includes("未对") ||
                t.includes("未真") ||
                t.includes("假")
            ) {
                return "错误";
            }

            if (
                t === "false" ||
                t === "no" ||
                t.includes("wrong") ||
                t.includes("incorrect") ||
                t.includes("nottrue") ||
                t.includes("notcorrect") ||
                t.includes("notright") ||
                t.includes("notyes")
            ) {
                return "错误";
            }

            if (raw0.includes("×") || raw0.includes("✗") || raw0.includes("✘")) return "错误";
            if (t === "n" || t === "f") return "错误";

            // 肯定
            if (
                t === "正确" ||
                t === "对" ||
                t === "是" ||
                t.includes("成立") ||
                t === "真" ||
                t === "true" ||
                t === "yes" ||
                t.includes("right") ||
                t.includes("correct")
            ) {
                return "正确";
            }

            if (raw0.includes("√") || raw0.includes("✓") || raw0.includes("✔")) return "正确";
            if (t === "y" || t === "t") return "正确";

            return null;
        },

        judgeFromLetterByOptions(letter, optionMap) {
            const L = String(letter).trim().toUpperCase();
            const opt = optionMap.find((x) => x.letter.toUpperCase() === L);
            if (!opt) return null;
            return this.normalizeJudgeToken(opt.text);
        },

        resolveChoiceLetters({ qType, answers, optionMap }) {
            // 判断题
            if (qType === "3") {
                let judge = null;

                for (const a of answers || []) {
                    judge = this.normalizeJudgeToken(a);
                    if (judge) break;
                }
                if (!judge) {
                    const combined = (answers || []).join(" ");
                    judge = this.normalizeJudgeToken(combined);
                }
                if (!judge) return [];

                const judgeBool = judge === "正确";

                const pick = (wantCorrect) => {
                    for (const opt of optionMap || []) {
                        const t = this.normalizeJudgeToken(opt.text);
                        if (!t) continue;
                        if (wantCorrect && t === "正确") return opt.letter;
                        if (!wantCorrect && t === "错误") return opt.letter;
                    }
                    return null;
                };

                const byText = pick(judgeBool);
                if (byText) return [byText];

                if ((optionMap || []).length === 2) {
                    return [judgeBool ? optionMap[0].letter : optionMap[1].letter];
                }
                return [];
            }

            // 单选/多选
            const letters = [];
            for (const a of answers || []) {
                const token = String(a).trim().toUpperCase();
                const m = token.match(/[A-Z]/g);
                if (m) letters.push(...m);
            }
            const uniq = Array.from(new Set(letters)).filter(Boolean);

            if (qType === "0") return uniq.length ? [uniq[0]] : [];
            return uniq;
        },

        resolveBlankAnswers({ answers, blankCount }) {
            let arr = answers.slice();
            if (blankCount > 1 && arr.length === 1) {
                const one = String(arr[0] || "");
                const spl = one
                    .split(/[#\n\r\t]|、|，|,|；|;|\|\|/g)
                    .map((x) => x.trim())
                    .filter(Boolean);
                if (spl.length >= 2) arr = spl;
            }
            return arr;
        },

        toDisplayString(qType, resolved) {
            if (!resolved || !resolved.answers || resolved.answers.length === 0) return "";
            return resolved.answers.join("#");
        },
    };

    // =========================
    // 缓存管理（存 meta：confidence/sources）
    // =========================
    const CacheManager = {
        MAX_SIZE: 1200,
        EXPIRE_DAYS: 30,

        get(key) {
            const cache = GM_getValue(STORE.CACHE_KEY, {});
            const item = cache[key];
            if (!item) return null;

            if (item.timestamp) {
                const now = Date.now();
                const expireTime = this.EXPIRE_DAYS * 86400000;
                if (now - item.timestamp > expireTime) {
                    delete cache[key];
                    GM_setValue(STORE.CACHE_KEY, cache);
                    return null;
                }
            }
            return item; // {answer, confidence, sources, timestamp}
        },

        set(key, payload) {
            const cache = GM_getValue(STORE.CACHE_KEY, {});
            if (Object.keys(cache).length >= this.MAX_SIZE) {
                const entries = Object.entries(cache)
                    .sort((a, b) => (a[1].timestamp || 0) - (b[1].timestamp || 0))
                    .slice(Math.floor(this.MAX_SIZE * 0.2));
                const newCache = {};
                entries.forEach(([k, v]) => (newCache[k] = v));
                GM_setValue(STORE.CACHE_KEY, newCache);
            }

            cache[key] = { ...payload, timestamp: Date.now() };
            GM_setValue(STORE.CACHE_KEY, cache);
        },

        clear() {
            GM_setValue(STORE.CACHE_KEY, {});
        },

        getSize() {
            return Object.keys(GM_getValue(STORE.CACHE_KEY, {})).length;
        },
    };

    // =========================
    // 配置管理
    // =========================
    const ConfigManager = {
        DEFAULT_CONFIG: {
            ai_enabled: false,
            ai_provider: "openai",
            ai_key: "",
            ai_url: "https://api.openai.com/v1/chat/completions",
            ai_model: "gpt-4o-mini",

            // v14: 多源一致性
            consensus_mode: "bank_first_ai_review", // bank_first_ai_review | multi_source_vote | bank_only | ai_only
            review_with_ai: true,
            cache_min_confidence: 0.67,

            // 默认自动答题/自动填入（不是仅提示）
            assist_only: false,

            auto_fill_delay_ms: 120,

            banks: [
                {
                    name: "言溪题库",
                    enabled: false,
                    homepage: "https://tk.enncy.cn/",
                    url: "https://tk.enncy.cn/query",
                    method: "GET",
                    token: "",
                },
            ],

            logLevel: "INFO",
        },

        load() {
            const raw = GM_getValue(STORE.CONFIG_KEY, this.DEFAULT_CONFIG);
            return { ...this.DEFAULT_CONFIG, ...raw, banks: raw?.banks || this.DEFAULT_CONFIG.banks };
        },

        save(config) {
            const saveConfig = JSON.parse(JSON.stringify(config));
            if (saveConfig.ai_key) saveConfig.ai_key = Utils.encrypt(saveConfig.ai_key);
            (saveConfig.banks || []).forEach((bank) => {
                if (bank.token) bank.token = Utils.encrypt(bank.token);
            });
            GM_setValue(STORE.CONFIG_KEY, saveConfig);
        },

        decrypt(config) {
            if (config.ai_key) config.ai_key = Utils.decrypt(config.ai_key);
            (config.banks || []).forEach((bank) => {
                if (bank.token) bank.token = Utils.decrypt(bank.token);
            });
            return config;
        },

        validate(config) {
            const errors = [];
            if (config.ai_enabled) {
                if (!config.ai_key || config.ai_key.length < 5) errors.push("AI API Key 格式不正确(至少5个字符)");
                if (!config.ai_model) errors.push("AI 模型名称不能为空");
                if (!config.ai_url || !config.ai_url.match(/^https?:\/\/.+/)) errors.push("AI API 地址(URL) 格式不正确");
            }

            (config.banks || []).forEach((bank, i) => {
                if (bank.enabled) {
                    if (!bank.url || !bank.url.match(/^https?:\/\/.+/)) errors.push(`题库 ${i + 1} URL 格式不正确`);
                }
            });

            if (config.cache_min_confidence < 0 || config.cache_min_confidence > 1) errors.push("缓存置信度阈值需在 0~1 之间");
            return errors;
        },

        export() {
            const config = this.load();
            const data = JSON.stringify(config, null, 2);
            const blob = new Blob([data], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `chuanzhi_config_${Date.now()}.json`;
            a.click();
            URL.revokeObjectURL(url);
        },
    };

    // =========================
    // 日志模块
    // =========================
    const Logger = {
        LEVELS: { DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3 },
        currentLevel: 1,
        maxLogs: 160,
        logs: [],

        init(level = "INFO") {
            this.currentLevel = this.LEVELS[level] ?? this.LEVELS.INFO;
        },

        log(msg, level = "INFO") {
            const levelValue = this.LEVELS[level] ?? this.LEVELS.INFO;
            if (levelValue < this.currentLevel) return;

            const logDiv = document.getElementById("fix_log");
            if (!logDiv) return;

            const colors = {
                DEBUG: "#94a3b8",
                INFO: "#22d3ee",
                WARN: "#f59e0b",
                ERROR: "#fb7185",
                SUCCESS: "#22c55e",
                CACHE: "#a78bfa",
            };

            const entry = document.createElement("div");
            entry.className = "log-e";
            const time = new Date().toLocaleTimeString("zh-CN", { hour12: false });
            entry.innerHTML = `
          <span class="log-tag" style="color:${colors[level] || "#22d3ee"};">[${time}] [${level}]</span>
          ${Utils.sanitizeHTML(msg)}
        `;

            logDiv.insertBefore(entry, logDiv.firstChild);
            while (logDiv.children.length > this.maxLogs) logDiv.removeChild(logDiv.lastChild);

            const consoleMethod = level === "ERROR" ? "error" : level === "WARN" ? "warn" : "log";
            console[consoleMethod](`[传智助手] ${msg}`);

            this.logs.push({ time, level, msg });
            if (this.logs.length > this.maxLogs) this.logs.shift();
        },

        debug(msg) { this.log(msg, "DEBUG"); },
        info(msg) { this.log(msg, "INFO"); },
        warn(msg) { this.log(msg, "WARN"); },
        error(msg) { this.log(msg, "ERROR"); },
        success(msg) { this.log(msg, "SUCCESS"); },
        cache(msg) { this.log(msg, "CACHE"); },

        export() {
            const content = this.logs.map((log) => `[${log.time}] [${log.level}] ${log.msg}`).join("\n");
            const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `chuanzhi_logs_${Date.now()}.txt`;
            a.click();
            URL.revokeObjectURL(url);
        },

        clear() {
            const logDiv = document.getElementById("fix_log");
            if (logDiv) logDiv.innerHTML = "";
            this.logs = [];
        },
    };

    // =========================
    // 请求限流器
    // =========================
    const RateLimiter = {
        requests: [],
        maxRequests: 10,
        timeWindow: 60000,

        async throttle() {
            const now = Date.now();
            this.requests = this.requests.filter((t) => now - t < this.timeWindow);

            if (this.requests.length >= this.maxRequests) {
                const waitTime = this.timeWindow - (now - this.requests[0]);
                Logger.warn(`API限流:等待 ${Math.ceil(waitTime / 1000)} 秒`);
                await Utils.sleep(waitTime);
            }

            this.requests.push(Date.now());
        },
    };

    // =========================
    // API 客户端
    // =========================
    const APIClient = {
        async requestWithRetry(options, maxRetries = 3) {
            for (let i = 0; i < maxRetries; i++) {
                try {
                    return await this.request(options);
                } catch (error) {
                    if (i === maxRetries - 1) throw error;
                    const delay = Math.pow(2, i) * 1000;
                    Logger.warn(`请求失败,${delay}ms 后重试 (${i + 1}/${maxRetries})`);
                    await Utils.sleep(delay);
                }
            }
        },

        request(options) {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    ...options,
                    onload: (response) => {
                        if (response.status >= 200 && response.status < 300) resolve(response);
                        else reject(new Error(`HTTP ${response.status}: ${response.statusText}`));
                    },
                    onerror: (error) => reject(new Error(`网络错误: ${error.error || "未知错误"}`)),
                    ontimeout: () => reject(new Error("请求超时")),
                });
            });
        },

        async queryBank(bank, question, options, type) {
            await RateLimiter.throttle();

            let url = bank.url;
            const params = { token: bank.token || "", title: question, options, type };

            if ((bank.method || "GET").toUpperCase() === "GET") {
                const query = new URLSearchParams(params);
                url += (url.includes("?") ? "&" : "?") + query.toString();
            }

            const response = await this.requestWithRetry({
                method: bank.method || "GET",
                url,
                headers: { "Content-Type": "application/json" },
                data: (bank.method || "GET").toUpperCase() === "POST" ? JSON.stringify(params) : undefined,
                timeout: 10000,
            });

            const data = JSON.parse(response.responseText);
            let answer = null;
            if (data.code === 0 && data.data) answer = data.data.answer || data.data;
            else if (data.answer) answer = data.answer;
            else if (data.data) answer = data.data;

            if (answer && typeof answer === "string" && answer.length > 0) return answer;
            throw new Error("未找到答案");
        },

        async queryAI(config, prompt) {
            await RateLimiter.throttle();

            const provider = AI_MODELS[config.ai_provider] || AI_MODELS.openai;
            const requestData = provider.formatRequest(config, prompt);

            const headers = { "Content-Type": "application/json" };
            if (provider.authType === "Bearer") headers.Authorization = `Bearer ${config.ai_key}`;
            else if (provider.authType === "x-api-key") headers["x-api-key"] = config.ai_key;
            if (provider.extraHeaders) Object.assign(headers, provider.extraHeaders(config));

            let url = config.ai_url;
            if (provider.buildUrl) url = provider.buildUrl(config);

            const response = await this.requestWithRetry({
                method: "POST",
                url,
                headers,
                data: JSON.stringify(requestData),
                timeout: 30000,
            });

            const data = JSON.parse(response.responseText);
            return provider.parseResponse(data);
        },

        async queryAIWithRepair(config, prompt, repairContext = "") {
            const raw = await this.queryAI(config, prompt);
            const js = Utils.safeJsonExtract(raw);
            if (js) return { raw, repaired: false };

            const repairPrompt = [
                "把下面内容转换为 JSON，且只输出 JSON（不要解释/不要代码块）。",
                '目标格式：{"answers":[...]}',
                repairContext ? `上下文：${repairContext}` : "",
                "内容：",
                raw,
            ]
                .filter(Boolean)
                .join("\n");

            Logger.warn("AI输出非JSON，启动修复请求一次...");
            Diagnostics.record("ai_json_repair_used", { preview: String(raw).slice(0, 120) });

            const raw2 = await this.queryAI(config, repairPrompt);
            return { raw: raw2, repaired: true };
        },
    };

    // =========================
    // 一致性/置信度聚合
    // =========================
    const Consensus = {
        aggregate(candidates) {
            const norm = (s) => String(s || "").trim().toUpperCase();
            const map = new Map(); // ans -> {count, sources[]}
            for (const c of candidates) {
                const a = norm(c.answer);
                if (!a) continue;
                if (!map.has(a)) map.set(a, { count: 0, sources: [] });
                const item = map.get(a);
                item.count += 1;
                item.sources.push(c.source || c.kind || "unknown");
            }

            const entries = Array.from(map.entries()).map(([answer, v]) => ({
                answer,
                count: v.count,
                sources: v.sources,
            }));
            entries.sort((x, y) => y.count - x.count);

            if (entries.length === 0) return { ok: false, reason: "no_candidate" };

            const best = entries[0];
            const total = candidates.length || best.count;
            const confidence = total > 0 ? best.count / total : 1;

            const conflict = entries.length >= 2 && entries[0].count === entries[1].count;
            return { ok: true, answer: best.answer, confidence, conflict, top: best, all: entries };
        },
    };

    // =========================
    // 题目处理模块
    // =========================
    const QuestionProcessor = {
        config: null,

        init(config) {
            this.config = config;
        },

        detectQuestions() {
            const selectors = [".questionItem", ".question-item-box", ".question-item", ".item-box"];
            for (const sel of selectors) {
                const questions = document.querySelectorAll(sel);
                if (questions.length > 0) {
                    Logger.debug(`使用选择器: ${sel}`);
                    return Array.from(questions);
                }
            }
            return [];
        },

        extractQuestionText(element) {
            const selectors = [".question-title-box .myEditorTxt", ".stem", ".title", ".question-title", ".question-stem"];
            for (const sel of selectors) {
                const el = element.querySelector(sel);
                if (el && el.innerText.trim()) return el.innerText.trim();
            }
            const lines = (element.innerText || "").split("\n").filter((l) => l.trim());
            return lines[0] || "";
        },

        extractOptionElements(element) {
            const nodes = Array.from(element.querySelectorAll("label"))
                .filter((lb) => lb.querySelector('input[type="radio"], input[type="checkbox"]'))
                .filter((lb) => !lb.closest(".answer-mark"));

            const uniq = [];
            const seen = new Set();
            for (const n of nodes) {
                const key = (n.innerText || "").trim();
                if (!key) continue;
                if (seen.has(key)) continue;
                seen.add(key);
                uniq.push(n);
            }
            return uniq;
        },

        buildOptionMap(element) {
            const optionEls = this.extractOptionElements(element);
            const optionMap = [];

            for (let i = 0; i < optionEls.length; i++) {
                const el = optionEls[i];
                const rawText = (el.innerText || "").trim();
                if (!rawText) continue;

                const m = rawText.match(/^\s*([A-Z])[\.、\)]\s*/i);
                let letter = m ? m[1].toUpperCase() : null;
                if (!letter) letter = String.fromCharCode("A".charCodeAt(0) + optionMap.length);

                const text = rawText.replace(/^\s*[A-Z][\.、\)]\s*/i, "").trim();
                optionMap.push({ letter, text: text || rawText, el });
            }

            return optionMap;
        },

        extractOptionsForBank(optionMap) {
            return optionMap.map((o) => `${o.letter}. ${o.text}`).join("###");
        },

        detectQuestionType(element) {
            const text = element.innerText || "";
            if (text.includes("多选") || element.querySelectorAll('input[type="checkbox"]').length > 0) return "1";
            if (text.includes("判断")) return "3";
            if (text.includes("填空") || element.querySelectorAll('input[type="text"]').length > 0) return "2";
            if (text.includes("单选") || element.querySelectorAll('input[type="radio"]').length > 0) return "0";
            return "0";
        },

        getBlankInputs(element) {
            return Array.from(element.querySelectorAll('input[type="text"], textarea'));
        },

        hasMarked(element) {
            return !!element.querySelector(".answer-mark");
        },

        normalizeAndValidateAnswer(rawAnswer, qType, optionMap, element) {
            const { answers } = AnswerParser.normalizeRawToAnswers(rawAnswer);

            if (qType === "2") {
                const blankCount = this.getBlankInputs(element).length;
                const blanks = AnswerParser.resolveBlankAnswers({ answers, blankCount });
                const out = { answers: blanks };
                const display = AnswerParser.toDisplayString(qType, out);
                return display || null;
            }

            if (qType === "3") {
                const judgeOnly = optionMap.filter((o) => AnswerParser.normalizeJudgeToken(o.text));
                const safeOptionMap = judgeOnly.length >= 2 ? judgeOnly : optionMap;

                let judge = null;
                for (const ans of answers) {
                    judge = AnswerParser.normalizeJudgeToken(ans);
                    if (judge) break;
                }

                if (!judge && answers.length > 0) {
                    const firstAns = String(answers[0]).trim().toUpperCase();
                    if (/^[A-Z]$/.test(firstAns)) {
                        judge = AnswerParser.judgeFromLetterByOptions(firstAns, safeOptionMap);
                    }
                }

                if (!judge) {
                    const combined = answers.join(" ");
                    judge = AnswerParser.normalizeJudgeToken(combined);
                }

                if (!judge) return null;

                const letters = AnswerParser.resolveChoiceLetters({
                    qType,
                    answers: [judge],
                    optionMap: safeOptionMap,
                });
                if (!letters || letters.length === 0) return null;
                return letters[0];
            }

            const letters = AnswerParser.resolveChoiceLetters({ qType, answers, optionMap });
            if (!letters || letters.length === 0) return null;

            const sorted = letters
                .map((x) => x.toUpperCase())
                .filter(Boolean)
                .sort((a, b) => a.charCodeAt(0) - b.charCodeAt(0));
            const out = { answers: sorted };
            const display = AnswerParser.toDisplayString(qType, out);
            return display || null;
        },

        applyAnswerIfEnabled(element, answerDisplay, qType, optionMap) {
            if (this.config.assist_only) return;

            if (qType === "2") {
                const blanks = (answerDisplay || "").split("#").map((x) => x.trim()).filter(Boolean);
                const inputs = this.getBlankInputs(element);
                inputs.forEach((input, i) => {
                    if (blanks[i] != null && String(blanks[i]).trim() !== "") {
                        input.value = String(blanks[i]).trim();
                        input.dispatchEvent(new Event("input", { bubbles: true }));
                        input.dispatchEvent(new Event("change", { bubbles: true }));
                    }
                });
                return;
            }

            const letters = (answerDisplay || "").split("#").map((x) => x.trim().toUpperCase()).filter(Boolean);
            const target = new Set(qType === "1" ? letters : [letters[0]]);
            if (target.size === 0) return;

            const clickOne = async (opt) => {
                const el = opt.el;
                let input = el.querySelector("input");
                if (!input) input = el.closest("label")?.querySelector("input") || null;

                for (let attempt = 0; attempt < 2; attempt++) {
                    try {
                        el.click();
                        el.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
                    } catch (_) { }

                    await Utils.sleep(this.config.auto_fill_delay_ms || 120);
                    if (input && input.checked) return true;
                    if (!input) return true;
                }
                return false;
            };

            (async () => {
                for (const L of target) {
                    const opt = optionMap.find((x) => x.letter.toUpperCase() === L);
                    if (!opt) continue;
                    const ok = await clickOne(opt);
                    if (!ok) Logger.warn(`选项 ${L} 点击后未确认选中（页面结构可能变化）`);
                }
            })();
        },

        renderMark(element, payload) {
            const mark = document.createElement("div");
            mark.className = "answer-mark";

            const confPct = payload.confidence != null ? (payload.confidence * 100).toFixed(0) + "%" : "--";
            const badge = payload.conflict
                ? `<span class="badge badge-warn">冲突</span>`
                : `<span class="badge badge-ok">一致</span>`;
            const sources = (payload.sources || []).slice(0, 8).join(" / ");

            mark.innerHTML = `
          <div class="am-row">
            <div class="am-title">建议答案：<span class="am-ans">${Utils.sanitizeHTML(payload.answer || "")}</span></div>
            <div class="am-right">${badge}</div>
          </div>
          <div class="am-sub">
            <span class="am-kv">置信度：<b>${confPct}</b></span>
            <span class="am-kv">来源：${Utils.sanitizeHTML(sources || "-")}</span>
            <span class="am-kv">${this.config.assist_only ? "模式：仅提示" : "模式：自动填入"}</span>
          </div>
          ${payload.detailsText ? `<div class="am-detail">${Utils.sanitizeHTML(payload.detailsText)}</div>` : ""}
        `;

            const titleBox = element.querySelector(".question-title-box, .stem, .title");
            if (titleBox) titleBox.appendChild(mark);
            else element.insertBefore(mark, element.firstChild);
        },

        async processQuestion(element, num, total) {
            try {
                if (this.hasMarked(element)) return { status: "skipped", num };

                const questionText = this.extractQuestionText(element);
                if (!questionText || questionText.length < 5) {
                    Diagnostics.record("extract_question_fail", { num, preview: String(questionText || "").slice(0, 80) });
                    Logger.warn(`第${num}题无法提取题目文本`);
                    return { status: "failed", num, reason: "无法提取题目" };
                }

                let qType = this.detectQuestionType(element);
                const optionMap = this.buildOptionMap(element);

                if (qType === "0") {
                    const radioCount = element.querySelectorAll('input[type="radio"]').length;
                    const judgeOnly = optionMap.filter((o) => AnswerParser.normalizeJudgeToken(o.text));
                    if (radioCount === 2 && judgeOnly.length === 2) qType = "3";
                }

                const optionTexts = optionMap.map((o) => o.text);
                const blankCount = qType === "2" ? this.getBlankInputs(element).length : 0;
                const fingerprint = Utils.buildQuestionFingerprintV14({ questionText, optionTexts, qType, blankCount });

                Logger.info(`第${num}/${total}题: ${questionText.substring(0, 40)}...`);

                const cached = CacheManager.get(fingerprint);
                if (cached?.answer) {
                    Logger.cache(`第${num}题 [缓存] ${cached.answer} (${((cached.confidence || 1) * 100).toFixed(0)}%)`);
                    this.renderMark(element, {
                        answer: cached.answer,
                        confidence: cached.confidence ?? 1,
                        sources: cached.sources || ["cache"],
                        conflict: false,
                        detailsText: cached.detailsText || "",
                    });
                    this.applyAnswerIfEnabled(element, cached.answer, qType, optionMap);
                    return { status: "success", num, source: "cache", answer: cached.answer };
                }

                const candidates = [];
                const enabledBanks = (this.config.banks || []).filter((b) => b.enabled);
                const optionsForBank = this.extractOptionsForBank(optionMap);

                const mode = this.config.consensus_mode || "bank_first_ai_review";
                const shouldUseAI = !!(this.config.ai_enabled && this.config.ai_key);

                // 1) 题库侧
                if (mode !== "ai_only" && enabledBanks.length > 0) {
                    for (const bank of enabledBanks) {
                        try {
                            const rawAnswer = await APIClient.queryBank(bank, questionText, optionsForBank, qType);
                            const normalized = this.normalizeAndValidateAnswer(rawAnswer, qType, optionMap, element);
                            if (!normalized) {
                                Diagnostics.record("bank_parse_fail", { num, bank: bank.name, preview: String(rawAnswer).slice(0, 120) });
                                Logger.warn(`第${num}题 [${bank.name}] 返回无法解析: ${String(rawAnswer).slice(0, 80)}`);
                                continue;
                            }
                            candidates.push({ answer: normalized, source: bank.name, kind: "bank", raw: rawAnswer });
                            if (mode === "bank_first_ai_review") break;
                        } catch (e) {
                            const msg = e?.message || "未知错误";
                            Diagnostics.record(msg.includes("超时") ? "bank_request_fail" : "bank_no_answer", {
                                num,
                                bank: bank.name,
                                error: msg,
                            });
                            Logger.debug(`第${num}题 [${bank.name}] 未命中/失败: ${msg}`);
                        }
                    }
                }

                // 2) AI 侧（复核/补全）
                if (shouldUseAI && mode !== "bank_only") {
                    const shouldReview =
                        (mode === "bank_first_ai_review" && this.config.review_with_ai && candidates.length > 0) ||
                        mode === "ai_only" ||
                        mode === "multi_source_vote";

                    if (shouldReview || (candidates.length === 0 && mode !== "bank_only")) {
                        try {
                            const providerName = AI_MODELS[this.config.ai_provider]?.name || "AI";
                            Logger.info(`第${num}题 使用${providerName}答题(JSON模式)`);

                            const prompt = AnswerParser.buildAIPrompt({ questionText, qType, optionMap });
                            const { raw, repaired } = await APIClient.queryAIWithRepair(
                                this.config,
                                prompt,
                                `题型=${AnswerParser.typeName(qType)}`
                            );

                            const normalized = this.normalizeAndValidateAnswer(raw, qType, optionMap, element);
                            if (!normalized) {
                                Diagnostics.record("ai_parse_fail", { num, provider: providerName, preview: String(raw).slice(0, 150) });
                                Logger.error(`第${num}题 AI返回无法解析: ${String(raw).slice(0, 150)}`);
                            } else {
                                candidates.push({ answer: normalized, source: providerName, kind: "ai", raw, repaired });
                            }
                        } catch (e) {
                            const msg = e?.message || "未知错误";
                            Diagnostics.record("ai_request_fail", { num, error: msg });
                            Logger.error(`第${num}题 AI请求失败: ${msg}`);
                        }
                    }
                }

                if (candidates.length === 0) {
                    Logger.error(`第${num}题 所有方式均未找到可用答案`);
                    return { status: "failed", num, reason: "未找到答案" };
                }

                // 3) 聚合一致性
                const agg = Consensus.aggregate(candidates);
                if (!agg.ok) {
                    Logger.error(`第${num}题 聚合失败: ${agg.reason}`);
                    return { status: "failed", num, reason: "聚合失败" };
                }

                const details = agg.all.map((x) => `${x.answer} ×${x.count}（${x.sources.slice(0, 5).join(",")}）`).join("；");

                if (agg.conflict && candidates.length >= 2) {
                    Diagnostics.record("consensus_conflict", { num, details: details.slice(0, 300) });
                    Logger.warn(`第${num}题 多源冲突: ${details}`);
                }

                this.renderMark(element, {
                    answer: agg.answer,
                    confidence: agg.confidence,
                    sources: agg.top.sources,
                    conflict: !!agg.conflict,
                    detailsText: agg.conflict ? `候选：${details}` : "",
                });

                const minConf = Number(this.config.cache_min_confidence ?? 0.67);
                const canCache = !agg.conflict && agg.confidence >= minConf;
                if (canCache) {
                    CacheManager.set(fingerprint, {
                        answer: agg.answer,
                        confidence: agg.confidence,
                        sources: agg.top.sources,
                        detailsText: "",
                    });
                } else {
                    Diagnostics.record("cache_write_skipped_low_conf", {
                        num,
                        confidence: agg.confidence,
                        conflict: !!agg.conflict,
                        minConf,
                    });
                }

                this.applyAnswerIfEnabled(element, agg.answer, qType, optionMap);

                Logger.success(
                    `第${num}题 结果=${agg.answer} 置信度=${(agg.confidence * 100).toFixed(0)}%${agg.conflict ? "（冲突）" : ""}`
                );
                return { status: "success", num, source: "consensus", answer: agg.answer };
            } catch (error) {
                Logger.error(`第${num}题 处理异常: ${error.message}`);
                return { status: "error", num, error: error.message };
            }
        },
    };

    // =========================
    // 样式（Modern / Glass / 更现代）
    // =========================
    GM_addStyle(`
      :root{
        --cz-bg0: rgba(12, 14, 20, .55);
        --cz-bg1: rgba(16, 18, 28, .74);
        --cz-surface: rgba(255,255,255,.06);
        --cz-surface2: rgba(255,255,255,.10);
        --cz-border: rgba(255,255,255,.14);
        --cz-border2: rgba(255,255,255,.22);
        --cz-text: rgba(245,247,255,.92);
        --cz-muted: rgba(245,247,255,.62);
        --cz-primary: #60a5fa;
        --cz-success: #34d399;
        --cz-warn: #f59e0b;
        --cz-danger: #fb7185;
        --cz-purple: #a78bfa;
        --cz-shadow: 0 18px 70px rgba(0,0,0,.55);
        --cz-shadow2: 0 10px 30px rgba(0,0,0,.35);
        --cz-radius: 16px;
        --cz-radius2: 14px;
        --cz-font: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif;
        --cz-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace;
      }
      @media (prefers-color-scheme: light){
        :root{
          --cz-bg0: rgba(255,255,255,.55);
          --cz-bg1: rgba(255,255,255,.70);
          --cz-surface: rgba(0,0,0,.04);
          --cz-surface2: rgba(0,0,0,.07);
          --cz-border: rgba(0,0,0,.08);
          --cz-border2: rgba(0,0,0,.14);
          --cz-text: rgba(18, 24, 40, .92);
          --cz-muted: rgba(18, 24, 40, .58);
          --cz-shadow: 0 18px 70px rgba(0,0,0,.15);
          --cz-shadow2: 0 10px 30px rgba(0,0,0,.10);
        }
      }

      #CZ_MASK{
        display:none;
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,.38);
        backdrop-filter: blur(2px);
        -webkit-backdrop-filter: blur(2px);
        z-index: 9999999998;
      }
      #CZ_MASK.show{ display:block; }

      #CZ_PANEL{
        position: fixed;
        top: 14px;
        right: 14px;
        width: 420px;
        max-width: 92vw;
        max-height: 90vh;
        border-radius: var(--cz-radius);
        background:
          radial-gradient(1200px 500px at 20% -10%, rgba(96,165,250,.25), transparent 50%),
          radial-gradient(900px 380px at 95% 0%, rgba(167,139,250,.18), transparent 45%),
          linear-gradient(180deg, var(--cz-bg1), var(--cz-bg0));
        border: 1px solid var(--cz-border);
        box-shadow: var(--cz-shadow);
        color: var(--cz-text);
        font-family: var(--cz-font);
        z-index: 999999999;
        overflow: hidden;
        user-select: none;
        backdrop-filter: blur(18px);
        -webkit-backdrop-filter: blur(18px);
      }
      #CZ_PANEL:after{
        content:"";
        position:absolute;
        inset:0;
        pointer-events:none;
        border-radius: inherit;
        background: linear-gradient(135deg, rgba(255,255,255,.10), transparent 45%, rgba(255,255,255,.06));
        opacity:.55;
      }
      #CZ_PANEL.min{ width: 220px; height:auto; }
      #CZ_PANEL.min #cz_body{ display:none; }

      #cz_head{
        position: relative;
        display:flex;
        justify-content: space-between;
        align-items:center;
        padding: 10px 12px;
        cursor: move;
        border-bottom: 1px solid var(--cz-border);
        background: linear-gradient(135deg, rgba(255,255,255,.10), rgba(255,255,255,.04));
        backdrop-filter: blur(18px);
        -webkit-backdrop-filter: blur(18px);
        z-index: 1;
      }
      #cz_title{
        font-weight: 800;
        letter-spacing: .2px;
        font-size: 14px;
        color: var(--cz-text);
        display:flex;
        align-items: baseline;
        gap: 8px;
      }
      #cz_title small{
        font-family: var(--cz-mono);
        font-size: 12px;
        color: var(--cz-muted);
        font-weight: 650;
      }

      .cz_iconbtn{
        position: relative;
        border: 1px solid var(--cz-border);
        background: rgba(255,255,255,.08);
        color: var(--cz-text);
        border-radius: 12px;
        padding: 7px 10px;
        cursor: pointer;
        transition: transform .12s ease, box-shadow .12s ease, background .12s ease, border-color .12s ease;
        font-size: 12px;
        user-select: none;
        backdrop-filter: blur(18px);
        -webkit-backdrop-filter: blur(18px);
      }
      .cz_iconbtn:hover{
        transform: translateY(-1px);
        border-color: var(--cz-border2);
        background: rgba(255,255,255,.12);
        box-shadow: var(--cz-shadow2);
      }
      .cz_iconbtn:active{ transform: translateY(0px); }

      #cz_body{
        position: relative;
        padding: 12px;
        overflow:auto;
        max-height: calc(90vh - 52px);
        user-select: text;
        z-index: 1;
      }

      #cz_body::-webkit-scrollbar,
      #fix_log::-webkit-scrollbar,
      #cz_diag_events::-webkit-scrollbar,
      .cz_modal::-webkit-scrollbar{
        width: 10px;
        height: 10px;
      }
      #cz_body::-webkit-scrollbar-thumb,
      #fix_log::-webkit-scrollbar-thumb,
      #cz_diag_events::-webkit-scrollbar-thumb,
      .cz_modal::-webkit-scrollbar-thumb{
        background: rgba(255,255,255,.16);
        border: 2px solid rgba(0,0,0,0);
        background-clip: padding-box;
        border-radius: 999px;
      }
      #cz_body::-webkit-scrollbar-track,
      #fix_log::-webkit-scrollbar-track,
      #cz_diag_events::-webkit-scrollbar-track,
      .cz_modal::-webkit-scrollbar-track{
        background: rgba(255,255,255,.04);
        border-radius: 999px;
      }

      .cz_row{ display:flex; gap:8px; flex-wrap: wrap; margin: 8px 0; }

      .cz_btn{
        flex:1;
        min-width: 120px;
        border: 1px solid var(--cz-border);
        background: rgba(255,255,255,.08);
        color: var(--cz-text);
        border-radius: 14px;
        padding: 10px 12px;
        cursor:pointer;
        transition: transform .12s ease, box-shadow .12s ease, background .12s ease, border-color .12s ease;
        font-weight: 750;
        font-size: 13px;
        letter-spacing: .2px;
        user-select: none;
        backdrop-filter: blur(18px);
        -webkit-backdrop-filter: blur(18px);
      }
      .cz_btn:hover{
        transform: translateY(-1px);
        border-color: var(--cz-border2);
        background: rgba(255,255,255,.12);
        box-shadow: var(--cz-shadow2);
      }
      .cz_btn:active{ transform: translateY(0px); }
      .cz_btn:disabled{
        opacity: .55;
        cursor: not-allowed;
        transform: none;
        box-shadow:none;
      }
      .cz_btn.primary{
        border-color: rgba(96,165,250,.32);
        background: linear-gradient(135deg, rgba(96,165,250,.24), rgba(255,255,255,.06));
      }
      .cz_btn.warn{
        border-color: rgba(245,158,11,.35);
        background: linear-gradient(135deg, rgba(245,158,11,.22), rgba(255,255,255,.06));
      }
      .cz_btn.purple{
        border-color: rgba(167,139,250,.35);
        background: linear-gradient(135deg, rgba(167,139,250,.22), rgba(255,255,255,.06));
      }

      .cz_stats{
        border: 1px solid var(--cz-border);
        border-radius: 14px;
        padding: 10px 12px;
        background: rgba(255,255,255,.06);
        backdrop-filter: blur(18px);
        -webkit-backdrop-filter: blur(18px);
      }
      .cz_kv{
        display:flex;
        justify-content: space-between;
        gap:10px;
        font-size: 12px;
        padding: 5px 0;
        color: var(--cz-text);
      }
      .cz_kv span:nth-child(1){ color: var(--cz-muted); }
      .cz_kv span:nth-child(2){
        color: var(--cz-text);
        font-weight: 800;
        font-family: var(--cz-mono);
      }

      #cz_progress{
        height: 10px;
        background: rgba(255,255,255,.06);
        border: 1px solid var(--cz-border);
        border-radius: 999px;
        overflow: hidden;
        margin: 12px 0 10px 0;
        backdrop-filter: blur(18px);
        -webkit-backdrop-filter: blur(18px);
      }
      #cz_progress_fill{
        height: 100%;
        width: 0%;
        background: linear-gradient(90deg, rgba(96,165,250,.35), rgba(52,211,153,.55), rgba(167,139,250,.45));
        transition: width .15s ease;
        border-radius: 999px;
      }

      #cz_status{
        font-size: 12px;
        color: var(--cz-muted);
        padding: 4px 2px 10px 2px;
      }

      #fix_log{
        max-height: 34vh;
        overflow: auto;
        border: 1px solid var(--cz-border);
        border-radius: 14px;
        padding: 10px;
        background: rgba(255,255,255,.05);
        backdrop-filter: blur(18px);
        -webkit-backdrop-filter: blur(18px);
      }
      .log-e{
        margin: 10px 0;
        padding: 10px 12px 10px 14px;
        border-radius: 14px;
        border: 1px solid rgba(255,255,255,.10);
        background: rgba(255,255,255,.06);
        box-shadow: 0 8px 22px rgba(0,0,0,.14);
        word-break: break-all;
        font-size: 12px;
        line-height: 1.55;
        position: relative;
      }
      .log-e:before{
        content:"";
        position:absolute;
        left: 0;
        top: 10px;
        bottom: 10px;
        width: 3px;
        border-radius: 999px;
        background: linear-gradient(180deg, rgba(96,165,250,.9), rgba(167,139,250,.9));
        opacity:.9;
      }
      .log-tag{
        margin-right: 8px;
        font-family: var(--cz-mono);
        font-weight: 750;
      }

      .answer-mark{
        margin: 10px 0;
        padding: 12px 12px;
        border-radius: 14px;
        background: rgba(255,255,255,.06);
        border: 1px solid var(--cz-border);
        box-shadow: 0 10px 24px rgba(0,0,0,.14);
        backdrop-filter: blur(14px);
        -webkit-backdrop-filter: blur(14px);
      }
      .am-row{ display:flex; justify-content: space-between; gap: 10px; align-items: center; }
      .am-title{ font-size: 13px; color: var(--cz-text); font-weight: 850; }
      .am-ans{
        color: rgba(96,165,250,.95);
        font-weight: 900;
        font-family: var(--cz-mono);
      }
      .am-sub{
        margin-top: 8px;
        display:flex;
        flex-wrap:wrap;
        gap: 10px;
        font-size: 12px;
        color: var(--cz-muted);
      }
      .am-kv b{ color: var(--cz-text); font-family: var(--cz-mono); }
      .am-detail{
        margin-top: 10px;
        color: var(--cz-text);
        font-size: 12px;
        opacity: .88;
        border-top: 1px dashed rgba(255,255,255,.16);
        padding-top: 8px;
      }

      .badge{
        display:inline-flex;
        align-items:center;
        font-size: 11px;
        padding: 4px 10px;
        border-radius: 999px;
        border: 1px solid rgba(255,255,255,.16);
        background: rgba(255,255,255,.08);
        color: var(--cz-text);
        user-select:none;
        font-weight: 800;
        letter-spacing: .2px;
        font-family: var(--cz-mono);
      }
      .badge-ok{
        border-color: rgba(52,211,153,.35);
        color: rgba(52,211,153,.92);
        background: rgba(52,211,153,.10);
      }
      .badge-warn{
        border-color: rgba(245,158,11,.40);
        color: rgba(245,158,11,.92);
        background: rgba(245,158,11,.12);
      }

      .cz_modal{
        display:none;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        width: 720px;
        max-width: 92vw;
        max-height: 86vh;
        overflow:auto;
        z-index: 9999999999;
        border-radius: 18px;
        background:
          radial-gradient(900px 420px at 10% 0%, rgba(96,165,250,.22), transparent 55%),
          radial-gradient(800px 380px at 100% 0%, rgba(167,139,250,.18), transparent 48%),
          linear-gradient(180deg, var(--cz-bg1), var(--cz-bg0));
        border: 1px solid var(--cz-border);
        box-shadow: var(--cz-shadow);
        color: var(--cz-text);
        padding: 14px 14px 16px 14px;
        user-select: text;
        backdrop-filter: blur(18px);
        -webkit-backdrop-filter: blur(18px);
      }
      .cz_modal.show{ display:block; }

      .cz_modal_head{
        display:flex;
        justify-content: space-between;
        align-items: center;
        gap: 10px;
        padding: 4px 2px 10px 2px;
        border-bottom: 1px solid var(--cz-border);
        margin-bottom: 10px;
      }
      .cz_modal_title{
        font-weight: 900;
        letter-spacing: .2px;
        color: var(--cz-text);
      }

      .cz_sec{
        border: 1px solid var(--cz-border);
        border-radius: 16px;
        padding: 12px;
        background: rgba(255,255,255,.05);
        margin: 10px 0;
      }
      .cz_sec h3{
        margin: 0 0 10px 0;
        font-size: 13px;
        color: var(--cz-text);
        letter-spacing: .2px;
      }

      .cz_field{
        display:flex;
        gap:10px;
        align-items:center;
        margin: 8px 0;
        flex-wrap: wrap;
      }
      .cz_field label{
        font-size: 12px;
        color: var(--cz-muted);
        min-width: 130px;
      }
      .cz_field input[type="text"],
      .cz_field input[type="password"],
      .cz_field input[type="number"],
      .cz_field select{
        flex:1;
        min-width: 260px;
        background: rgba(255,255,255,.06);
        border: 1px solid var(--cz-border);
        color: var(--cz-text);
        border-radius: 14px;
        padding: 10px 10px;
        outline: none;
        font-family: var(--cz-font);
        transition: border-color .12s ease, background .12s ease, box-shadow .12s ease;
      }
      .cz_field input[type="text"]:focus,
      .cz_field input[type="password"]:focus,
      .cz_field input[type="number"]:focus,
      .cz_field select:focus{
        border-color: rgba(96,165,250,.55);
        background: rgba(255,255,255,.08);
        box-shadow: 0 0 0 4px rgba(96,165,250,.18);
      }

      .cz_field input[type="checkbox"]{
        width: 18px;
        height: 18px;
        accent-color: var(--cz-primary);
      }

      .cz_help{
        font-size: 12px;
        color: var(--cz-muted);
        line-height: 1.45;
        margin-top: 6px;
      }

      .cz_split{
        height: 1px;
        background: rgba(255,255,255,.10);
        margin: 10px 0;
      }

      .cz_tag{
        display:inline-flex;
        align-items:center;
        gap:6px;
        padding: 4px 10px;
        border-radius: 999px;
        border: 1px solid var(--cz-border);
        background: rgba(255,255,255,.06);
        font-size: 12px;
        color: var(--cz-muted);
        font-family: var(--cz-mono);
        user-select:none;
      }

      .cz_grid2{
        display:grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
      }
      @media (max-width: 720px){
        .cz_grid2{ grid-template-columns: 1fr; }
      }

      .cz_bank_row{
        border: 1px solid var(--cz-border);
        border-radius: 14px;
        padding: 10px;
        background: rgba(255,255,255,.05);
        margin: 10px 0;
      }
      .cz_bank_head{
        display:flex;
        justify-content: space-between;
        align-items:center;
        gap:10px;
        margin-bottom: 8px;
      }
      .cz_bank_head .name{
        font-weight: 900;
        color: var(--cz-text);
        font-size: 13px;
      }
      .cz_bank_head .ops{
        display:flex;
        gap:8px;
        align-items:center;
        flex-wrap: wrap;
      }
      .cz_bank_row .cz_field label{ min-width: 110px; }

      .cz_table{
        width:100%;
        border-collapse: collapse;
        overflow: hidden;
        border-radius: 14px;
        border: 1px solid var(--cz-border);
        background: rgba(255,255,255,.04);
      }
      .cz_table th, .cz_table td{
        padding: 10px 10px;
        border-bottom: 1px solid rgba(255,255,255,.10);
        font-size: 12px;
        color: var(--cz-text);
        vertical-align: top;
      }
      .cz_table th{
        color: var(--cz-muted);
        font-weight: 900;
        text-align:left;
        background: rgba(255,255,255,.05);
      }
      .cz_table tr:last-child td{ border-bottom: none; }

      #cz_diag_events{
        max-height: 44vh;
        overflow:auto;
        border: 1px solid var(--cz-border);
        border-radius: 14px;
        background: rgba(255,255,255,.04);
        padding: 10px;
      }
      .cz_evt{
        border: 1px solid rgba(255,255,255,.10);
        background: rgba(255,255,255,.05);
        border-radius: 14px;
        padding: 10px 12px;
        margin: 10px 0;
        font-size: 12px;
        color: var(--cz-text);
        word-break: break-word;
      }
      .cz_evt .t{
        font-family: var(--cz-mono);
        color: var(--cz-muted);
        margin-bottom: 6px;
      }

      /* 让 panel 不遮挡页面点击（仅自身可点击） */
      #CZ_PANEL, .cz_modal{ pointer-events: auto; }
      #CZ_MASK{ pointer-events: auto; }
    `);

    // =========================
    // UI 管理器
    // =========================
    const UI = {
        config: null,
        running: false,
        stopFlag: false,
        stats: {
            total: 0,
            done: 0,
            success: 0,
            failed: 0,
            cacheHit: 0,
            startAt: 0,
        },

        init(config) {
            this.config = config;
            this.mountBase();
            this.mountPanel();
            this.mountConfigModal();
            this.mountDiagModal();
            this.bindDrag();
            this.refreshAll();
        },

        mountBase() {
            if (!document.getElementById("CZ_MASK")) {
                const mask = document.createElement("div");
                mask.id = "CZ_MASK";
                mask.addEventListener("click", () => this.hideAllModals());
                document.body.appendChild(mask);
            }
        },

        mountPanel() {
            if (document.getElementById("CZ_PANEL")) return;

            const panel = document.createElement("div");
            panel.id = "CZ_PANEL";
            panel.innerHTML = `
      <div id="cz_head">
        <div id="cz_title">传智教育答题脚本 <small>v${Utils.sanitizeHTML(SCRIPT_VERSION)}</small></div>
        <div style="display:flex; gap:8px; align-items:center;">
          <button class="cz_iconbtn" id="cz_btn_min" title="主面板（折叠/展开）">主面板</button>
          <button class="cz_iconbtn" id="cz_btn_cfg" title="配置">配置</button>
          <button class="cz_iconbtn" id="cz_btn_diag" title="诊断">诊断</button>
        </div>
      </div>

      <div id="cz_body">
        <div class="cz_row">
          <button class="cz_btn primary" id="cz_btn_start">开始刷题</button>
          <button class="cz_btn warn" id="cz_btn_stop" disabled>停止</button>
        </div>

        <div class="cz_row">
          <button class="cz_btn purple" id="cz_btn_clear_cache">清空缓存</button>
          <button class="cz_btn" id="cz_btn_export_log">导出日志</button>
        </div>

        <div class="cz_stats">
          <div class="cz_kv"><span>缓存条目</span><span id="cz_stat_cache">0</span></div>
          <div class="cz_kv"><span>本次进度</span><span id="cz_stat_prog">0/0</span></div>
          <div class="cz_kv"><span>成功/失败</span><span id="cz_stat_sf">0/0</span></div>
          <div class="cz_kv"><span>缓存命中</span><span id="cz_stat_hit">0</span></div>
          <div class="cz_kv"><span>耗时</span><span id="cz_stat_time">0s</span></div>
        </div>

        <div id="cz_progress"><div id="cz_progress_fill"></div></div>
        <div id="cz_status">就绪</div>

        <div id="fix_log"></div>

        <div class="cz_help">
          - 若页面结构变化导致无法勾选，可切换为“仅提示模式”。<br/>
          - 判断题优先按“正确/错误”语义匹配选项文本。<br/>
          - 多源冲突时不会写入缓存，避免污染。
        </div>
      </div>
    `;
            document.body.appendChild(panel);

            // 恢复位置/状态
            const pos = GM_getValue("cz_panel_pos_v14", null);
            if (pos && typeof pos.x === "number" && typeof pos.y === "number") {
                panel.style.left = pos.x + "px";
                panel.style.top = pos.y + "px";
                panel.style.right = "auto";
            }
            const isMin = GM_getValue("cz_panel_min_v14", false);
            if (isMin) panel.classList.add("min");

            // 绑定事件
            panel.querySelector("#cz_btn_min").addEventListener("click", () => {
                panel.classList.toggle("min");
                GM_setValue("cz_panel_min_v14", panel.classList.contains("min"));
            });

            panel.querySelector("#cz_btn_cfg").addEventListener("click", () => this.showModal("CZ_CONFIG"));
            panel.querySelector("#cz_btn_diag").addEventListener("click", () => {
                this.refreshDiag();
                this.showModal("CZ_DIAG");
            });

            // 只保留一次：导出日志
            panel.querySelector("#cz_btn_export_log").addEventListener("click", () => Logger.export());

            panel.querySelector("#cz_btn_clear_cache").addEventListener("click", () => {
                CacheManager.clear();
                Logger.warn("已清空缓存");
                this.refreshAll();
            });

            panel.querySelector("#cz_btn_start").addEventListener("click", () => this.start());
            panel.querySelector("#cz_btn_stop").addEventListener("click", () => this.stop());
        },

        mountConfigModal() {
            if (document.getElementById("CZ_CONFIG")) return;

            const modal = document.createElement("div");
            modal.className = "cz_modal";
            modal.id = "CZ_CONFIG";
            modal.innerHTML = `
          <div class="cz_modal_head">
            <div class="cz_modal_title">配置</div>
            <div style="display:flex; gap:8px;">
              <button class="cz_iconbtn" id="cz_cfg_export">导出配置</button>
              <button class="cz_iconbtn" id="cz_cfg_close">关闭</button>
            </div>
          </div>

          <div class="cz_sec">
            <h3>运行模式</h3>
            <div class="cz_field">
              <label>仅提示（不自动填）</label>
              <input type="checkbox" id="cfg_assist_only"/>
            </div>

            <div class="cz_field">
              <label>自动填入延迟(ms)</label>
              <input type="number" id="cfg_delay" min="0" max="2000" step="10"/>
            </div>

            <div class="cz_field">
              <label>日志等级</label>
              <select id="cfg_log_level">
                <option value="DEBUG">DEBUG</option>
                <option value="INFO">INFO</option>
                <option value="WARN">WARN</option>
                <option value="ERROR">ERROR</option>
              </select>
            </div>
          </div>

          <div class="cz_sec">
            <h3>一致性策略</h3>
            <div class="cz_field">
              <label>策略模式</label>
              <select id="cfg_consensus_mode">
                <option value="bank_first_ai_review">题库优先 + AI复核</option>
                <option value="multi_source_vote">多源投票</option>
                <option value="bank_only">只用题库</option>
                <option value="ai_only">只用AI</option>
              </select>
            </div>

            <div class="cz_field">
              <label>题库命中后仍用AI复核</label>
              <input type="checkbox" id="cfg_review_ai"/>
            </div>

            <div class="cz_field">
              <label>写入缓存最低置信度(0~1)</label>
              <input type="number" id="cfg_min_conf" min="0" max="1" step="0.01"/>
            </div>

            <div class="cz_help">
              - 置信度 = 最高票答案 / 候选来源总数。<br/>
              - “冲突”或低于阈值时不写缓存。
            </div>
          </div>

          <div class="cz_sec">
            <h3>AI 设置</h3>
            <div class="cz_field">
              <label>启用 AI</label>
              <input type="checkbox" id="cfg_ai_enabled"/>
            </div>

            <div class="cz_field">
              <label>提供商</label>
              <select id="cfg_ai_provider">
                <option value="openai">OpenAI</option>
                <option value="claude">Claude</option>
                <option value="gemini">Gemini</option>
                <option value="deepseek">DeepSeek</option>
                <option value="custom">自定义</option>
              </select>
            </div>

            <div class="cz_field">
              <label>API Key</label>
              <input type="password" id="cfg_ai_key" placeholder="粘贴你的 key"/>
            </div>

            <div class="cz_field">
              <label>API URL</label>
              <input type="text" id="cfg_ai_url" placeholder="https://..."/>
            </div>

            <div class="cz_field">
              <label>模型</label>
              <input type="text" id="cfg_ai_model" placeholder="例如 gpt-4o-mini / deepseek-chat / gemini-..."/>
            </div>

            <div class="cz_help">
              - Gemini 可用 URL 模板：.../models/{model}:generateContent 或在 URL 后自动追加 ?key=。<br/>
              - Claude 使用 x-api-key，并自动带 anthropic-version。
            </div>

            <!-- 补回：AI 连通性测试按钮 -->
            <div class="cz_row">
              <button class="cz_btn" id="cfg_ai_test">测试AI连通性</button>
            </div>
          </div>

          <div class="cz_sec">
            <h3>题库设置</h3>
            <div id="cfg_banks"></div>
            <div class="cz_row">
              <button class="cz_btn" id="cfg_add_bank">添加题库</button>
              <button class="cz_btn primary" id="cfg_save">保存</button>
            </div>
            <div class="cz_help">
              - GET 参数：token/title/options/type。<br/>
              - options 使用 ### 连接（A. xxx###B. xxx...）。
            </div>
          </div>
        `;
            document.body.appendChild(modal);

            modal.querySelector("#cz_cfg_close").addEventListener("click", () => this.hideAllModals());
            modal.querySelector("#cz_cfg_export").addEventListener("click", () => ConfigManager.export());

            // 补回：AI 连通性测试逻辑（读取当前输入框，不要求先保存）
            modal.querySelector("#cfg_ai_test").addEventListener("click", async () => {
                try {
                    this.readConfigFromUI();

                    if (!this.config.ai_enabled) {
                        Logger.warn("请先勾选：启用 AI");
                        return;
                    }
                    if (!this.config.ai_key || String(this.config.ai_key).trim().length < 5) {
                        Logger.error("AI Key 为空或太短");
                        return;
                    }

                    // provider 默认值补齐（避免用户没填 URL/模型）
                    const provider = AI_MODELS[this.config.ai_provider] || AI_MODELS.openai;
                    if (!this.config.ai_model) this.config.ai_model = provider.defaultModel;
                    if (!this.config.ai_url) this.config.ai_url = provider.endpoint;

                    const prompt = '只回复一个词：pong';
                    Logger.info("正在测试 AI 连通性...");

                    const t0 = Date.now();
                    const raw = await APIClient.queryAI(this.config, prompt);
                    const ms = Date.now() - t0;

                    Logger.success(`AI 连通：OK（${ms}ms）返回：${String(raw).slice(0, 120)}`);
                } catch (e) {
                    Logger.error("AI 连通失败：" + (e?.message || String(e)));
                }
            });

            modal.querySelector("#cfg_add_bank").addEventListener("click", () => {
                this.config.banks = this.config.banks || [];
                this.config.banks.push({
                    name: "新题库",
                    enabled: false,
                    homepage: "",
                    url: "",
                    method: "GET",
                    token: "",
                });
                this.renderBanks();
            });

            modal.querySelector("#cfg_save").addEventListener("click", () => {
                this.readConfigFromUI();
                const errs = ConfigManager.validate(this.config);
                if (errs.length) {
                    Logger.error("保存失败：" + errs.join("；"));
                    return;
                }
                ConfigManager.save(this.config);
                Logger.success("配置已保存（刷新页面后同样生效）");
                Logger.init(this.config.logLevel || "INFO");
                QuestionProcessor.init(this.config);
                this.hideAllModals();
                this.refreshAll();
            });
        },

        mountDiagModal() {
            if (document.getElementById("CZ_DIAG")) return;

            const modal = document.createElement("div");
            modal.className = "cz_modal";
            modal.id = "CZ_DIAG";
            modal.innerHTML = `
          <div class="cz_modal_head">
            <div class="cz_modal_title">诊断 / 失败原因统计</div>
            <div style="display:flex; gap:8px;">
              <button class="cz_iconbtn" id="cz_diag_export">导出</button>
              <button class="cz_iconbtn" id="cz_diag_reset">清空</button>
              <button class="cz_iconbtn" id="cz_diag_close">关闭</button>
            </div>
          </div>

          <div class="cz_sec">
            <h3>计数器</h3>
            <table class="cz_table" id="cz_diag_table">
              <thead><tr><th>代码</th><th>次数</th></tr></thead>
              <tbody></tbody>
            </table>
          </div>

          <div class="cz_sec">
            <h3>最近事件</h3>
            <div id="cz_diag_events"></div>
          </div>
        `;
            document.body.appendChild(modal);

            modal.querySelector("#cz_diag_close").addEventListener("click", () => this.hideAllModals());
            modal.querySelector("#cz_diag_export").addEventListener("click", () => Diagnostics.export());
            modal.querySelector("#cz_diag_reset").addEventListener("click", () => {
                Diagnostics.reset();
                Logger.warn("诊断数据已清空");
                this.refreshDiag();
            });
        },

        showModal(id) {
            const mask = document.getElementById("CZ_MASK");
            const modal = document.getElementById(id);
            if (!mask || !modal) return;
            mask.classList.add("show");
            modal.classList.add("show");
            if (id === "CZ_CONFIG") this.refreshConfigUI();
        },

        hideAllModals() {
            const mask = document.getElementById("CZ_MASK");
            if (mask) mask.classList.remove("show");
            document.querySelectorAll(".cz_modal.show").forEach((m) => m.classList.remove("show"));
        },

        setStatus(text) {
            const el = document.getElementById("cz_status");
            if (el) el.textContent = text;
        },

        setProgress(done, total) {
            const fill = document.getElementById("cz_progress_fill");
            const prog = document.getElementById("cz_stat_prog");
            const pct = total > 0 ? Math.min(100, Math.round((done / total) * 100)) : 0;
            if (fill) fill.style.width = pct + "%";
            if (prog) prog.textContent = `${done}/${total}`;
        },

        refreshAll() {
            const cacheEl = document.getElementById("cz_stat_cache");
            if (cacheEl) cacheEl.textContent = String(CacheManager.getSize());

            const sf = document.getElementById("cz_stat_sf");
            if (sf) sf.textContent = `${this.stats.success}/${this.stats.failed}`;

            const hit = document.getElementById("cz_stat_hit");
            if (hit) hit.textContent = String(this.stats.cacheHit);

            const t = document.getElementById("cz_stat_time");
            if (t) t.textContent = this.stats.startAt ? `${Math.floor((Date.now() - this.stats.startAt) / 1000)}s` : "0s";

            this.setProgress(this.stats.done, this.stats.total);
        },

        refreshConfigUI() {
            const cfg = this.config;

            const q = (id) => document.getElementById(id);

            q("cfg_assist_only").checked = !!cfg.assist_only;
            q("cfg_delay").value = String(cfg.auto_fill_delay_ms ?? 120);
            q("cfg_log_level").value = cfg.logLevel || "INFO";

            q("cfg_consensus_mode").value = cfg.consensus_mode || "bank_first_ai_review";
            q("cfg_review_ai").checked = !!cfg.review_with_ai;
            q("cfg_min_conf").value = String(cfg.cache_min_confidence ?? 0.67);

            q("cfg_ai_enabled").checked = !!cfg.ai_enabled;
            q("cfg_ai_provider").value = cfg.ai_provider || "openai";
            q("cfg_ai_key").value = cfg.ai_key || "";
            q("cfg_ai_url").value = cfg.ai_url || "";
            q("cfg_ai_model").value = cfg.ai_model || "";

            this.renderBanks();
        },

        readConfigFromUI() {
            const q = (id) => document.getElementById(id);

            this.config.assist_only = !!q("cfg_assist_only").checked;
            this.config.auto_fill_delay_ms = Number(q("cfg_delay").value || 0);
            this.config.logLevel = q("cfg_log_level").value || "INFO";

            this.config.consensus_mode = q("cfg_consensus_mode").value || "bank_first_ai_review";
            this.config.review_with_ai = !!q("cfg_review_ai").checked;
            this.config.cache_min_confidence = Number(q("cfg_min_conf").value || 0.67);

            this.config.ai_enabled = !!q("cfg_ai_enabled").checked;
            this.config.ai_provider = q("cfg_ai_provider").value || "openai";
            this.config.ai_key = String(q("cfg_ai_key").value || "");
            this.config.ai_url = String(q("cfg_ai_url").value || "");
            this.config.ai_model = String(q("cfg_ai_model").value || "");

            // banks 读取在 renderBanks() 的事件里实时写回 config
            this.config.banks = this.config.banks || [];
        },

        renderBanks() {
            const box = document.getElementById("cfg_banks");
            if (!box) return;
            box.innerHTML = "";

            this.config.banks = this.config.banks || [];
            this.config.banks.forEach((bank, idx) => {
                const row = document.createElement("div");
                row.className = "cz_bank_row";
                row.innerHTML = `
            <div class="cz_bank_head">
              <div class="name">${Utils.sanitizeHTML(bank.name || `题库${idx + 1}`)}</div>
              <div class="ops">
                <label class="cz_tag"><input type="checkbox" data-k="enabled" data-i="${idx}" ${bank.enabled ? "checked" : ""}/> 启用</label>
                <button class="cz_iconbtn" data-act="del" data-i="${idx}">删除</button>
              </div>
            </div>

            <div class="cz_grid2">
              <div class="cz_field">
                <label>名称</label>
                <input type="text" data-k="name" data-i="${idx}" value="${Utils.escapeAttr(bank.name || "")}"/>
              </div>
              <div class="cz_field">
                <label>方法</label>
                <select data-k="method" data-i="${idx}">
                  <option value="GET" ${String(bank.method || "GET").toUpperCase() === "GET" ? "selected" : ""}>GET</option>
                  <option value="POST" ${String(bank.method || "").toUpperCase() === "POST" ? "selected" : ""}>POST</option>
                </select>
              </div>
            </div>

            <div class="cz_field">
              <label>URL</label>
              <input type="text" data-k="url" data-i="${idx}" value="${Utils.escapeAttr(bank.url || "")}" placeholder="https://..."/>
            </div>

            <div class="cz_field">
              <label>Token（可空）</label>
              <input type="password" data-k="token" data-i="${idx}" value="${Utils.escapeAttr(bank.token || "")}"/>
            </div>

            <div class="cz_field">
              <label>主页（可空）</label>
              <input type="text" data-k="homepage" data-i="${idx}" value="${Utils.escapeAttr(bank.homepage || "")}"/>
            </div>
          `;

                row.addEventListener("input", (e) => {
                    const t = e.target;
                    const i = Number(t.getAttribute("data-i"));
                    const k = t.getAttribute("data-k");
                    if (!Number.isFinite(i) || !k) return;

                    if (t.type === "checkbox") this.config.banks[i][k] = !!t.checked;
                    else this.config.banks[i][k] = t.value;
                });

                row.addEventListener("change", (e) => {
                    const t = e.target;
                    const i = Number(t.getAttribute("data-i"));
                    const k = t.getAttribute("data-k");
                    if (!Number.isFinite(i) || !k) return;

                    if (t.type === "checkbox") this.config.banks[i][k] = !!t.checked;
                    else this.config.banks[i][k] = t.value;
                });

                row.querySelector('[data-act="del"]').addEventListener("click", (e) => {
                    const i = Number(e.currentTarget.getAttribute("data-i"));
                    this.config.banks.splice(i, 1);
                    this.renderBanks();
                });

                box.appendChild(row);
            });
        },

        refreshDiag() {
            const tableBody = document.querySelector("#cz_diag_table tbody");
            const eventsBox = document.getElementById("cz_diag_events");
            if (!tableBody || !eventsBox) return;

            tableBody.innerHTML = "";
            const entries = Object.entries(Diagnostics.counters || {});
            entries.sort((a, b) => (b[1] || 0) - (a[1] || 0));

            for (const [k, v] of entries) {
                const tr = document.createElement("tr");
                tr.innerHTML = `<td>${Utils.sanitizeHTML(k)}</td><td>${Utils.sanitizeHTML(String(v))}</td>`;
                tableBody.appendChild(tr);
            }

            eventsBox.innerHTML = "";
            (Diagnostics.events || []).slice(0, 80).forEach((evt) => {
                const div = document.createElement("div");
                div.className = "cz_evt";
                const meta = { ...evt };
                delete meta.time;
                delete meta.code;
                div.innerHTML = `
            <div class="t">${Utils.sanitizeHTML(evt.time || "")} / ${Utils.sanitizeHTML(evt.code || "")}</div>
            <div>${Utils.sanitizeHTML(JSON.stringify(meta))}</div>
          `;
                eventsBox.appendChild(div);
            });
        },

        setButtons() {
            const start = document.getElementById("cz_btn_start");
            const stop = document.getElementById("cz_btn_stop");
            if (start) start.disabled = this.running;
            if (stop) stop.disabled = !this.running;
        },

        async start() {
            if (this.running) return;

            this.running = true;
            this.stopFlag = false;
            this.stats = { total: 0, done: 0, success: 0, failed: 0, cacheHit: 0, startAt: Date.now() };
            this.setButtons();

            try {
                Logger.info("开始扫描题目...");
                const questions = QuestionProcessor.detectQuestions();
                if (!questions || questions.length === 0) {
                    Logger.warn("未检测到题目节点（可能不在练习页面或页面结构变化）");
                    this.setStatus("未检测到题目");
                    this.running = false;
                    this.setButtons();
                    return;
                }

                this.stats.total = questions.length;
                this.setStatus(`检测到 ${questions.length} 题，开始处理...`);
                this.refreshAll();

                for (let i = 0; i < questions.length; i++) {
                    if (this.stopFlag) break;

                    const el = questions[i];
                    const num = i + 1;

                    // 每题刷新一下耗时/进度
                    this.stats.done = i;
                    this.refreshAll();

                    const ret = await QuestionProcessor.processQuestion(el, num, questions.length);

                    if (ret?.source === "cache") this.stats.cacheHit += 1;
                    if (ret?.status === "success") this.stats.success += 1;
                    else if (ret?.status === "failed" || ret?.status === "error") this.stats.failed += 1;

                    this.stats.done = num;
                    this.refreshAll();

                    // 稍微让 UI 有喘息
                    await Utils.sleep(30);
                }

                if (this.stopFlag) {
                    this.setStatus("已停止");
                    Logger.warn("用户停止运行");
                } else {
                    this.setStatus("完成");
                    Logger.success("全部处理完成");
                }
            } catch (e) {
                Logger.error("运行异常：" + (e?.message || String(e)));
                this.setStatus("异常中止");
            } finally {
                this.running = false;
                this.setButtons();
                this.refreshAll();
            }
        },

        stop() {
            if (!this.running) return;
            this.stopFlag = true;
            this.setStatus("正在停止...");
        },

        bindDrag() {
            const panel = document.getElementById("CZ_PANEL");
            const head = document.getElementById("cz_head");
            if (!panel || !head) return;

            let dragging = false;
            let startX = 0, startY = 0;
            let baseLeft = 0, baseTop = 0;

            const onDown = (e) => {
                // 右上角按钮区不触发拖拽
                const target = e.target;
                if (target && target.closest && target.closest(".cz_iconbtn")) return;

                dragging = true;
                const rect = panel.getBoundingClientRect();
                startX = e.clientX;
                startY = e.clientY;
                baseLeft = rect.left;
                baseTop = rect.top;
                panel.style.right = "auto";
                panel.style.left = baseLeft + "px";
                panel.style.top = baseTop + "px";
                e.preventDefault();
            };

            const onMove = (e) => {
                if (!dragging) return;
                const dx = e.clientX - startX;
                const dy = e.clientY - startY;

                const x = Math.max(6, Math.min(window.innerWidth - 80, baseLeft + dx));
                const y = Math.max(6, Math.min(window.innerHeight - 60, baseTop + dy));
                panel.style.left = x + "px";
                panel.style.top = y + "px";
            };

            const onUp = () => {
                if (!dragging) return;
                dragging = false;
                const rect = panel.getBoundingClientRect();
                GM_setValue("cz_panel_pos_v14", { x: rect.left, y: rect.top });
            };

            head.addEventListener("mousedown", onDown);
            window.addEventListener("mousemove", onMove);
            window.addEventListener("mouseup", onUp);
        },
    };

    // =========================
    // 启动入口
    // =========================
    function bootstrap() {
        Diagnostics.load();

        let config = ConfigManager.load();
        config = ConfigManager.decrypt(config);

        // provider 默认值补齐
        const provider = AI_MODELS[config.ai_provider] || AI_MODELS.openai;
        if (!config.ai_model) config.ai_model = provider.defaultModel;
        if (!config.ai_url) config.ai_url = provider.endpoint;

        Logger.init(config.logLevel || "INFO");
        QuestionProcessor.init(config);
        UI.init(config);

        // 暴露一些调试入口（可选）
        try {
            unsafeWindow.CZ_HELPER_V14 = {
                start: () => UI.start(),
                stop: () => UI.stop(),
                clearCache: () => CacheManager.clear(),
                exportDiag: () => Diagnostics.export(),
                exportLog: () => Logger.export(),
                getConfig: () => ({ ...config }),
            };
        } catch (_) { }

        Logger.success("脚本已加载：面板右上角可配置/诊断");
    }

    // 等待 DOM 稳定一点再启动（兼容 SPA 轻微延迟）
    setTimeout(bootstrap, 80);
})();

