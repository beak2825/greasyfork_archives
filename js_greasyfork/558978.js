// ==UserScript==
// @name         ChatGPT Usage Monitor
// @name:zh-CN   ChatGPT 使用情况监控
// @name:zh-TW   ChatGPT 使用狀態監控
// @name:ja      ChatGPT 使用状況モニター
// @namespace    https://github.com/yoyoithink/ChatGPT-Usage-monitor
// @version      1.0.2

// @description      ChatGPT Plus usage monitor with bucketed model counts, rolling/calendar windows, and analytics.
// @description:zh-CN  ChatGPT Plus 使用量监控，按模型分桶统计，支持滚动/自然周期与分析。
// @description:zh-TW  ChatGPT Plus 使用量監控，依模型分桶統計，支援滾動/自然週期與分析。
// @description:ja     ChatGPT Plus の使用量をモデル別に監視し、期間別分析を提供します。

// @author       schweigen
// @match        https://chatgpt.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chatgpt.com
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/558978/ChatGPT%20Usage%20Monitor.user.js
// @updateURL https://update.greasyfork.org/scripts/558978/ChatGPT%20Usage%20Monitor.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // Theme tokens (align with ChatGPT)
    GM_addStyle(`
      :root {
        --usage-bg: var(--surface-primary, var(--token-main-surface-primary, var(--token-surface-primary, #f7f7f8)));
        --usage-surface: var(--surface-secondary, var(--token-main-surface-secondary, var(--token-surface-secondary, #ececf1)));
        --usage-surface-strong: var(--surface-tertiary, var(--token-main-surface-tertiary, var(--token-surface-tertiary, #e3e3e8)));
        --usage-border: var(--border-medium, var(--token-border-medium, rgba(0, 0, 0, 0.08)));
        --usage-text: var(--text-primary, var(--token-text-primary, #111827));
        --usage-subtle: var(--text-secondary, var(--token-text-secondary, #4b5563));
        --usage-muted: var(--text-tertiary, var(--token-text-tertiary, #9ca3af));
        --usage-accent: var(--brand-green, var(--token-brand-green, #10a37f));
        --usage-warning: var(--amber-600, var(--token-warning, #b76b00));
        --usage-danger: var(--red-500, var(--token-danger, #d93025));
        --usage-shadow: var(--shadow-medium, var(--token-shadow-medium, 0 12px 30px rgba(0, 0, 0, 0.18)));
      }
      :root[data-theme="dark"], .dark {
        --usage-bg: var(--surface-primary, var(--token-main-surface-primary, var(--token-surface-primary, #2f2f2f)));
        --usage-surface: var(--surface-secondary, var(--token-main-surface-secondary, var(--token-surface-secondary, #353535)));
        --usage-surface-strong: var(--surface-tertiary, var(--token-main-surface-tertiary, var(--token-surface-tertiary, #3d3d3d)));
        --usage-border: var(--border-medium, var(--token-border-medium, rgba(255, 255, 255, 0.08)));
        --usage-text: var(--text-primary, var(--token-text-primary, #f9fafb));
        --usage-subtle: var(--text-secondary, var(--token-text-secondary, #d1d5db));
        --usage-muted: var(--text-tertiary, var(--token-text-tertiary, #9ca3af));
        --usage-accent: var(--brand-green, var(--token-brand-green, #10a37f));
        --usage-warning: var(--amber-600, var(--token-warning, #fbbf24));
        --usage-danger: var(--red-500, var(--token-danger, #f87171));
        --usage-shadow: var(--shadow-large, var(--token-shadow-large, 0 18px 40px rgba(0, 0, 0, 0.5)));
      }
      @media (prefers-color-scheme: dark) {
        :root:not([data-theme]):not(.light) {
          --usage-bg: #2f2f2f;
          --usage-surface: #353535;
          --usage-surface-strong: #3d3d3d;
          --usage-border: rgba(255, 255, 255, 0.08);
          --usage-text: #f9fafb;
          --usage-subtle: #d1d5db;
          --usage-muted: #9ca3af;
          --usage-accent: #10a37f;
          --usage-warning: #fbbf24;
          --usage-danger: #f87171;
          --usage-shadow: 0 18px 40px rgba(0, 0, 0, 0.5);
        }
      }
    `);

    const STYLE = {
        borderRadius: "12px",
        spacing: { xs: "4px", sm: "8px", md: "16px", lg: "24px" },
        textSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" },
    };

    const COLORS = {
        primary: "var(--usage-accent)",
        background: "var(--usage-bg)",
        surface: "var(--usage-surface)",
        surfaceStrong: "var(--usage-surface-strong)",
        border: "var(--usage-border)",
        text: "var(--usage-text)",
        secondaryText: "var(--usage-subtle)",
        muted: "var(--usage-muted)",
        success: "var(--usage-accent)",
        warning: "var(--usage-warning)",
        danger: "var(--usage-danger)",
    };

    const I18N = {
        en: {
            "button.usage": "Usage",
            "tab.usage": "Usage",
            "tab.analytics": "Analytics",
            "tab.debug": "Debug",
            "title.minimize": "Minimize",
            "button.export": "Export",
            "button.import": "Import",
            "button.clear": "Clear",
            "confirm.clearData": "Clear all usage data? This cannot be undone.",
            "button.language": "Language",
            "lang.auto": "Auto (ChatGPT)",
            "lang.en": "English",
            "lang.zh": "中文",
            "debug.showEvents": "Show debug events",
            "debug.noEvents": "No events yet",
            "debug.info.main": "Plus plan only. Bucketed counting. Failed/canceled attempts are counted at dispatch.",
            "debug.info.sub": "Time zone: {tz}. 3h buckets use rolling windows; day/week buckets use calendar windows.",
            "toast.positionReset": "Position reset",
            "toast.exported": "Usage data exported",
            "toast.imported": "Import successful",
            "toast.cleared": "Usage data cleared",
            "import.failed": "Import failed: {message}",
            "import.invalidFile": "Invalid file",
            "import.missingBuckets": "Missing buckets",
            "usage.resetsIn": "Resets in {timeLeft}",
            "usage.noCalls": "No calls yet",
            "usage.last": "Last: {last}",
            "analytics.summary": "Summary",
            "analytics.range": "{start} to {end}",
            "analytics.totalRequests": "Total requests",
            "analytics.avgActive": "Avg / active day",
            "analytics.peakDay": "Peak day",
            "analytics.activeModels": "Active models",
            "analytics.topBucket": "Top bucket",
            "analytics.topModel": "Top model",
            "analytics.days": "{n} days",
            "analytics.activeDays": "{n} active days",
            "analytics.requests": "{n} requests",
            "analytics.distinctModels": "Distinct model variants",
            "analytics.dailyTrend": "Daily trend",
            "analytics.byBucket": "By bucket",
            "analytics.dailyBreakdown": "Daily breakdown",
            "analytics.noData": "No data in this time range yet.",
            "table.date": "Date",
            "table.total": "Total",
            "table.auto": "5 Auto",
            "table.thinking": "5 Thinking",
            "table.mini": "5 Mini",
            "table.gpt4": "4.x",
            "table.o3": "o3",
            "table.o4mini": "o4-mini",
            "table.totalRow": "Total",
            "window.calendar": "Calendar",
            "window.rolling": "Rolling",
            "unit.hourShort": "h",
            "unit.dayShort": "d",
            "unit.weekShort": "w",
        },
        zh: {
            "button.usage": "用量",
            "tab.usage": "用量",
            "tab.analytics": "分析",
            "tab.debug": "调试",
            "title.minimize": "最小化",
            "button.export": "导出",
            "button.import": "导入",
            "button.clear": "清空",
            "confirm.clearData": "清空所有用量数据？此操作不可撤销。",
            "button.language": "语言",
            "lang.auto": "自动（跟随 ChatGPT）",
            "lang.en": "English",
            "lang.zh": "中文",
            "debug.showEvents": "显示调试事件面板",
            "debug.noEvents": "暂无事件",
            "debug.info.main": "仅 Plus 套餐，按桶计数，失败/取消也计入尝试次数（dispatch 即计数）。",
            "debug.info.sub": "时区：{tz}；3h 窗口为滚动，天/周为自然日/自然周。",
            "toast.positionReset": "位置已重置",
            "toast.exported": "用量数据已导出",
            "toast.imported": "导入成功",
            "toast.cleared": "用量数据已清空",
            "import.failed": "导入失败：{message}",
            "import.invalidFile": "格式错误",
            "import.missingBuckets": "缺少 buckets",
            "usage.resetsIn": "剩余 {timeLeft}",
            "usage.noCalls": "暂无调用",
            "usage.last": "最新：{last}",
            "analytics.summary": "概览",
            "analytics.range": "{start} 至 {end}",
            "analytics.totalRequests": "总请求数",
            "analytics.avgActive": "日均使用",
            "analytics.peakDay": "高峰日",
            "analytics.activeModels": "活跃模型数",
            "analytics.topBucket": "最常用桶",
            "analytics.topModel": "最常用模型",
            "analytics.days": "最近{n}天",
            "analytics.activeDays": "{n}个活跃日",
            "analytics.requests": "{n}次",
            "analytics.distinctModels": "有使用记录的模型变体",
            "analytics.dailyTrend": "每日趋势",
            "analytics.byBucket": "按桶分布",
            "analytics.dailyBreakdown": "每日明细",
            "analytics.noData": "该时间范围内暂无数据。",
            "table.date": "日期",
            "table.total": "总计",
            "table.auto": "5 Auto",
            "table.thinking": "5 Thinking",
            "table.mini": "5 Mini",
            "table.gpt4": "4.x",
            "table.o3": "o3",
            "table.o4mini": "o4-mini",
            "table.totalRow": "总计",
            "window.calendar": "自然",
            "window.rolling": "滚动",
            "unit.hourShort": "小时",
            "unit.dayShort": "天",
            "unit.weekShort": "周",
        }
    };

    let currentLocale = "en";

    function normalizeLocaleTag(tag) {
        const lower = String(tag || "").toLowerCase();
        if (lower.startsWith("zh")) return "zh";
        return "en";
    }

    function computeLocale() {
        const docLang = document.documentElement?.getAttribute?.("lang") || navigator.language || "en";
        return normalizeLocaleTag(docLang);
    }

    function t(key, vars) {
        const dict = I18N[currentLocale] || I18N.en;
        let out = dict[key] || I18N.en[key] || key;
        if (vars) {
            for (const [k, v] of Object.entries(vars)) {
                out = out.split(`{${k}}`).join(String(v));
            }
        }
        return out;
    }

    function applyLocaleToUI() {
        const monitor = document.getElementById("chatUsageMonitor");
        if (monitor) monitor.setAttribute("data-label", t("button.usage"));

        if (usageLauncher) {
            const labelEl = usageLauncher.querySelector?.('[data-usage-label="true"]');
            if (labelEl) labelEl.textContent = t("button.usage");
            else if (usageLauncher.getAttribute?.("data-usage-label") === "true") usageLauncher.textContent = t("button.usage");
            usageLauncher.setAttribute?.("aria-label", t("button.usage"));
        }

        if (monitor) {
            const minimize = monitor.querySelector?.(".minimize-btn");
            if (minimize) minimize.title = t("title.minimize");
            monitor.querySelectorAll?.('header button[data-tab="usage"]').forEach(b => { b.textContent = t("tab.usage"); });
            monitor.querySelectorAll?.('header button[data-tab="analytics"]').forEach(b => { b.textContent = t("tab.analytics"); });
            monitor.querySelectorAll?.('header button[data-tab="debug"]').forEach(b => { b.textContent = t("tab.debug"); });
        }

        updateUI();
    }

    let _localeObserverInstalled = false;
    function setupLocaleObserver() {
        if (_localeObserverInstalled) return;
        _localeObserverInstalled = true;
        try {
            const obs = new MutationObserver(() => {
                const next = computeLocale();
                if (next === currentLocale) return;
                currentLocale = next;
                applyLocaleToUI();
            });
            obs.observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
        } catch {
            // ignore
        }
        applyLocaleToUI();
    }

    // Bucket definitions (Plus only)
    const BUCKET_CONFIG = {
        gpt5_auto: {
            name: "GPT-5.x Auto/Instant",
            limit: 160,
            window: { type: "rolling", size: 3, unit: "hour" }
        },
        gpt5_thinking: {
            name: "GPT-5.x Thinking",
            limit: 3000,
            window: { type: "calendar", size: 1, unit: "week" }
        },
        gpt4: {
            name: "GPT-4.x",
            limit: 80,
            window: { type: "rolling", size: 3, unit: "hour" },
            tooltip: "Includes GPT-4o (and future GPT-4 variants) and shares the same quota."
        },
        o3: {
            name: "o3",
            limit: 100,
            window: { type: "calendar", size: 1, unit: "week" }
        },
        o4mini: {
            name: "o4-mini",
            limit: 300,
            window: { type: "calendar", size: 1, unit: "day" }
        },
        thinking_mini: {
            name: "GPT-5.x Thinking Mini",
            limit: Infinity,
            // Shown as ∞; progress bar is estimated at ~1000/week
            window: { type: "calendar", size: 1, unit: "week" },
            tooltip: "Shown as ∞; progress bar is estimated at ~1000/week."
        }
    };

    const BUCKET_ORDER = [
        "gpt5_auto",
        "gpt5_thinking",
        "thinking_mini",
        "gpt4",
        "o3",
        "o4mini"
    ];

    const MODEL_BUCKET_MAP = {
        gpt5_auto: [
            "gpt-5.2", "gpt-5.2-auto", "gpt-5.2-instant", "gpt-5-2", "gpt-5-2-auto", "gpt-5-2-instant",
            "gpt-5.1", "gpt-5-1", "gpt-5-1-instant", "gpt-5-1-auto",
            "gpt-5", "gpt-5-instant", "gpt-5-auto", "gpt5", "gpt5.2", "gpt5-2", "gpt5-1", "auto"
        ],
        gpt5_thinking: [
            "gpt-5.2-thinking", "gpt-5-2-thinking", "gpt-5.2-reasoning", "gpt-5-2-reasoning",
            "gpt-5.1-thinking", "gpt-5-1-thinking", "gpt-5-thinking", "gpt5-thinking"
        ],
        thinking_mini: [
            "gpt-5-thinking-mini", "gpt-5-t-mini", "gpt-5-mini-thinking"
        ],
        gpt4: [
            "gpt-4o", "gpt-4-1", "gpt-4.1", "gpt-4"
        ],
        o3: [
            "o3"
        ],
        o4mini: [
            "o4-mini", "o4-mini-high"
        ]
    };

    const MAX_EVENTS = 200;
    const TZ = (() => {
        try {
            const tz = Intl?.DateTimeFormat?.().resolvedOptions?.().timeZone;
            return typeof tz === "string" && tz ? tz : null;
        } catch {
            return null;
        }
    })();
    const MS_PER_DAY = 86400000;
    const HISTORY_RETENTION_DAYS = 45;

    const defaultUsageData = {
        position: { x: null, y: null },
        size: { width: 420, height: 520 },
        minimized: true,
        buckets: createDefaultBuckets(),
        events: [],
        pending: {},
        settings: { showDebug: false, analysisRangeDays: 7 }
    };

    function createDefaultBuckets() {
        const buckets = {};
        Object.entries(BUCKET_CONFIG).forEach(([id, cfg]) => {
            buckets[id] = { requests: [], limit: cfg.limit, window: { ...cfg.window } };
        });
        return buckets;
    }
    // Storage & migration
    const Storage = {
        key: "usageData",
        get() {
            let data = GM_getValue(this.key, null);
            if (!data) data = defaultUsageData;
            if (data.planType || data.models || data.sharedQuotaGroups) data = migrateFromLegacy(data);
            if (!data.buckets) data.buckets = createDefaultBuckets();
            Object.entries(BUCKET_CONFIG).forEach(([id, cfg]) => {
                if (!data.buckets[id]) data.buckets[id] = { requests: [], limit: cfg.limit, window: { ...cfg.window } };
                else {
                    data.buckets[id].limit = cfg.limit;
                    data.buckets[id].window = { ...cfg.window };
                    if (!Array.isArray(data.buckets[id].requests)) data.buckets[id].requests = [];
                }
            });
            data.events = Array.isArray(data.events) ? data.events : [];
            data.pending = data.pending || {};
            data.settings = { showDebug: false, analysisRangeDays: 7, ...(data.settings || {}) };
            if (data.settings && data.settings.languageMode !== undefined) delete data.settings.languageMode;
            ["planType", "PLAN_CONFIGS", "addons", "entitlements"].forEach(f => { if (data[f] !== undefined) { console.warn("[monitor] Legacy field ignored:", f); delete data[f]; } });
            GM_setValue(this.key, data);
            return data;
        },
        set(newData) { GM_setValue(this.key, newData); },
        update(mutator) { const d = this.get(); mutator(d); this.set(d); return d; }
    };

    function migrateFromLegacy(data) {
        const fresh = JSON.parse(JSON.stringify(defaultUsageData));
        const legacyModels = data.models || {};
        Object.entries(legacyModels).forEach(([modelId, model]) => {
            const bucketId = resolveBucketForModel(modelId);
            if (!bucketId) return;
            const target = fresh.buckets[bucketId];
            if (!target) return;
            const reqs = Array.isArray(model.requests) ? model.requests : [];
            reqs.forEach(r => {
                const ts = tsOf(r);
                if (!Number.isFinite(ts)) return;
                target.requests.push({ t: ts, status: "legacy", variant: modelId, idempotencyKey: `legacy-${modelId}-${ts}` });
            });
        });
        return fresh;
    }

    // Helpers
    function tsOf(req) {
        if (typeof req === "number") return req;
        if (req && typeof req.t === "number") return req.t;
        if (req && typeof req.timestamp === "number") return req.timestamp;
        return NaN;
    }
    function normalizeModelId(modelId) { return modelId ? String(modelId).toLowerCase().trim() : ""; }
    function resolveBucketForModel(modelId) {
        const normalized = normalizeModelId(modelId); if (!normalized) return null;
        for (const [bucketId, variants] of Object.entries(MODEL_BUCKET_MAP)) {
            if (variants.some(v => normalized === v)) return bucketId;
        }
        return null;
    }

    function formatOffsetMinutes(totalMinutes) {
        if (!Number.isFinite(totalMinutes)) return "";
        const sign = totalMinutes >= 0 ? "+" : "-";
        const abs = Math.abs(totalMinutes);
        const hh = String(Math.floor(abs / 60)).padStart(2, "0");
        const mm = String(abs % 60).padStart(2, "0");
        return `${sign}${hh}:${mm}`;
    }

    function timeZoneLabel() {
        if (TZ) return TZ;
        const offset = formatOffsetMinutes(-new Date().getTimezoneOffset());
        return offset ? `UTC${offset}` : "UTC";
    }

    function addDaysLocal(ts, days) {
        const d = new Date(ts);
        if (Number.isNaN(d.getTime())) return ts + days * MS_PER_DAY;
        d.setDate(d.getDate() + days);
        d.setHours(0, 0, 0, 0);
        return d.getTime();
    }

    const TZ_FORMATTER = (() => {
        try {
            const options = {
                hour12: false,
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                weekday: "short",
            };
            if (TZ) options.timeZone = TZ;
            return new Intl.DateTimeFormat("en-US", options);
        } catch {
            return null;
        }
    })();

    function tzParts(ts = Date.now()) {
        if (!TZ_FORMATTER) {
            const d = new Date(ts);
            return {
                year: String(d.getFullYear()),
                month: String(d.getMonth() + 1).padStart(2, "0"),
                day: String(d.getDate()).padStart(2, "0"),
                hour: String(d.getHours()).padStart(2, "0"),
                minute: String(d.getMinutes()).padStart(2, "0"),
                second: String(d.getSeconds()).padStart(2, "0"),
                weekday: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d.getDay()],
            };
        }
        const parts = TZ_FORMATTER.formatToParts(new Date(ts));
        const out = {};
        for (const p of parts) {
            if (p.type !== "literal") out[p.type] = p.value;
        }
        return out;
    }

    function tzOffsetMs(ts) {
        if (!TZ_FORMATTER) return 0;
        const p = tzParts(ts);
        const asUTC = Date.UTC(
            Number(p.year),
            Number(p.month) - 1,
            Number(p.day),
            Number(p.hour),
            Number(p.minute),
            Number(p.second)
        );
        return asUTC - ts;
    }

    function startOfDayTZ(ts = Date.now()) {
        if (!TZ_FORMATTER) {
            const d = new Date(ts);
            d.setHours(0, 0, 0, 0);
            return d.getTime();
        }
        const p = tzParts(ts);
        const utcGuess = Date.UTC(Number(p.year), Number(p.month) - 1, Number(p.day), 0, 0, 0);
        let start = utcGuess - tzOffsetMs(utcGuess);
        const corrected = utcGuess - tzOffsetMs(start);
        if (corrected !== start) start = corrected;
        return start;
    }

    function startOfWeekTZ(ts = Date.now()) {
        const dayStart = startOfDayTZ(ts);
        const d = new Date(dayStart);
        if (Number.isNaN(d.getTime())) return dayStart;
        const daysSinceMonday = (d.getDay() + 6) % 7;
        d.setDate(d.getDate() - daysSinceMonday);
        d.setHours(0, 0, 0, 0);
        return d.getTime();
    }
    function windowDurationMs(w) { const unitMs = w.unit === "hour" ? 3600000 : w.unit === "day" ? MS_PER_DAY : 7 * MS_PER_DAY; return (w.size || 1) * unitMs; }
    function windowStart(bucket) { const w = bucket.window || {}; if (w.type === "calendar") { if (w.unit === "day") return startOfDayTZ(); if (w.unit === "week") return startOfWeekTZ(); } return Date.now() - windowDurationMs(w); }
    function windowEnd(bucket) {
        const w = bucket.window || {};
        const start = windowStart(bucket);
        if (w.type === "calendar") {
            if (w.unit === "day") return addDaysLocal(start, w.size || 1);
            if (w.unit === "week") return addDaysLocal(start, (w.size || 1) * 7);
        }
        return start + windowDurationMs(w);
    }
    function formatTimeLeft(ts) {
        const diff = ts - Date.now();
        if (diff <= 0) return currentLocale === "zh" ? "0小时 0分" : "0h 0m";
        const h = Math.floor(diff / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        return currentLocale === "zh" ? `${h}小时 ${m}分` : `${h}h ${m}m`;
    }
    function formatWindowLabel(w) {
        if (!w) return "";
        const typeLabel = w.type === "calendar" ? t("window.calendar") : t("window.rolling");
        const unitLabel = w.unit === "hour" ? t("unit.hourShort") : w.unit === "day" ? t("unit.dayShort") : t("unit.weekShort");
        return `${typeLabel} ${w.size}${unitLabel}`;
    }

    function formatTimeAgo(ts) {
        const seconds = Math.floor((Date.now() - ts) / 1000);
        if (currentLocale === "zh") {
            if (seconds < 60) return `${seconds}秒前`;
            const minutes = Math.floor(seconds / 60);
            if (minutes < 60) return `${minutes}分钟前`;
            const hours = Math.floor(minutes / 60);
            if (hours < 24) return `${hours}小时前`;
            const days = Math.floor(hours / 24);
            return `${days}天前`;
        }
        if (seconds < 60) return `${seconds}s ago`;
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        return `${days}d ago`;
    }

    function recordEvent(type, detail) {
        usageData.events = usageData.events || [];
        usageData.events.unshift({ type, detail, t: Date.now() });
        if (usageData.events.length > MAX_EVENTS) usageData.events.length = MAX_EVENTS;
    }

    function registerDispatch(variantId, bucketId, idempotencyKey) {
        if (!bucketId || !usageData.buckets[bucketId]) { recordEvent("warn", `Unrecognized model: ${variantId}`); return; }
        usageData.pending = usageData.pending || {};
        const existingPending = usageData.pending[idempotencyKey];
        if (existingPending && existingPending.bucketId === bucketId) return;
        const bucket = usageData.buckets[bucketId]; if (!bucket.requests) bucket.requests = [];
        if (bucket.requests.find(r => r.idempotencyKey === idempotencyKey)) return;
        bucket.requests.push({ t: Date.now(), status: "dispatched", variant: variantId, idempotencyKey });
        usageData.pending[idempotencyKey] = { bucketId, variant: variantId, status: "dispatched", t: Date.now() };
        recordEvent("dispatched", `${variantId} -> ${bucketId}`);
        Storage.set(usageData);
        updateUsageLauncher();
    }

    function updateRequestStatus(idempotencyKey, status) {
        const pend = usageData.pending?.[idempotencyKey];
        if (!pend) return;
        const bucket = usageData.buckets[pend.bucketId];
        if (bucket && Array.isArray(bucket.requests)) {
            const target = bucket.requests.find(r => r.idempotencyKey === idempotencyKey);
            if (target) target.status = status;
        }
        usageData.pending[idempotencyKey] = { ...pend, status };
        recordEvent(status, `${pend.variant} -> ${pend.bucketId}`);
        Storage.set(usageData);
    }

    function cleanupExpired() {
        const cutoff = Date.now() - HISTORY_RETENTION_DAYS * MS_PER_DAY;
        Object.values(usageData.buckets || {}).forEach(bucket => {
            bucket.requests = (bucket.requests || []).filter(r => tsOf(r) >= cutoff);
        });
        if (usageData.pending && typeof usageData.pending === "object") {
            for (const [key, value] of Object.entries(usageData.pending)) {
                if (value && typeof value.t === "number" && value.t < cutoff) delete usageData.pending[key];
            }
        }
        Storage.set(usageData);
    }
    // UI styles
    GM_addStyle(`
      #chatUsageMonitor {
        position: fixed;
        bottom: 100px;
        left: ${STYLE.spacing.lg};
        width: 420px;
        height: 520px;
        max-height: 80vh;
        overflow: hidden;
        background: var(--usage-bg);
        color: var(--usage-text);
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        font-size: 14px;
        line-height: 20px;
        border-radius: ${STYLE.borderRadius};
        box-shadow: var(--usage-shadow);
        z-index: 9999;
        border: 1px solid var(--usage-border);
        user-select: none;
        resize: both;
        transition: box-shadow 0.2s ease, opacity 0.2s ease, background-color 0.2s ease;
        transform-origin: top left;
      }
      #chatUsageMonitor.hidden { display: none !important; }
      #chatUsageMonitor.minimized {
        width: auto !important;
        min-width: 44px;
        height: 36px !important;
        padding: 0 12px;
        border-radius: 9999px;
        overflow: visible;
        resize: none;
        opacity: 0.92;
        cursor: pointer;
        background-color: var(--usage-surface);
        border: 1px solid var(--usage-border);
        box-shadow: var(--usage-shadow);
        bottom: auto;
        top: 100px;
        left: ${STYLE.spacing.lg};
      }
      #chatUsageMonitor.minimized > * { display: none !important; }
      #chatUsageMonitor.minimized::before {
        content: attr(data-label);
        color: var(--usage-subtle);
        position: absolute; inset: 0;
        display: flex; align-items: center; justify-content: center;
        font-size: 13px; font-weight: 600;
      }
      #chatUsageMonitor header {
        padding: 6px 12px;
        display: flex;
        border-radius: ${STYLE.borderRadius} ${STYLE.borderRadius} 0 0;
        background: var(--usage-bg);
        align-items: center;
        height: 42px;
        cursor: move;
        border-bottom: 1px solid var(--usage-border);
      }
      #chatUsageMonitor .minimize-btn {
        margin-right: 12px;
        width: 26px;
        height: 26px;
        display: grid;
        place-items: center;
        border-radius: 8px;
        color: var(--usage-muted);
        cursor: pointer;
        font-size: 18px;
        transition: color 0.2s ease, background 0.2s ease;
      }
      #chatUsageMonitor .minimize-btn:hover { color: var(--usage-text); background: var(--usage-surface); }
      #chatUsageMonitor header button {
        border: none; background: none; color: var(--usage-muted);
        cursor: pointer; font-weight: 600; padding: 8px 12px;
        font-size: 14px;
        border-radius: 10px; transition: color 0.2s ease, background 0.2s ease;
      }
      #chatUsageMonitor header button.active { color: var(--usage-text); background: var(--usage-surface); }
      #chatUsageMonitor header button:hover { color: var(--usage-text); background: var(--usage-surface); }
      #chatUsageMonitor .content { padding: 10px 14px 16px 14px; overflow-y: auto; max-height: calc(520px - 42px); }
      #chatUsageMonitor .bucket-row {
        display: grid; grid-template-columns: 1fr auto; gap: 6px; align-items: center;
        padding: 10px 12px; border: 1px solid var(--usage-border); border-radius: 10px; background: var(--usage-surface); margin-bottom: 8px;
      }
      #chatUsageMonitor .bucket-row:hover { background: var(--usage-surface-strong); }
      #chatUsageMonitor .bucket-title { font-weight: 700; color: var(--usage-text); font-size: 14px; line-height: 20px; }
      #chatUsageMonitor .bucket-sub { color: var(--usage-muted); font-size: 12px; }
      #chatUsageMonitor .progress { grid-column: 1 / span 2; height: 8px; border-radius: 999px; background: var(--usage-surface-strong); overflow: hidden; }
      #chatUsageMonitor .progress-fill { height: 100%; background: var(--usage-accent); width: 0%; transition: width 0.2s ease; }
      #chatUsageMonitor .progress-fill.warn { background: var(--usage-warning); }
      #chatUsageMonitor .progress-fill.danger { background: var(--usage-danger); }
      #chatUsageMonitor .stat-line { display: flex; justify-content: space-between; font-size: 12px; color: var(--usage-muted); }
      #chatUsageMonitor .actions { display: flex; gap: 8px; margin: 12px 0 8px 0; }
      #chatUsageMonitor .btn { padding: 8px 12px; border-radius: 10px; border: 1px solid var(--usage-border); background: var(--usage-surface); color: var(--usage-text); cursor: pointer; font-weight: 600; transition: background 0.2s ease, border-color 0.2s ease; }
      #chatUsageMonitor .btn:hover { background: var(--usage-surface-strong); }
      #chatUsageMonitor .btn.danger { color: var(--usage-danger); }
      #chatUsageMonitor .btn.danger:hover { border-color: color-mix(in srgb, var(--usage-danger) 40%, var(--usage-border)); }
      #chatUsageMonitor .debug-list { background: var(--usage-surface); border: 1px solid var(--usage-border); border-radius: 10px; padding: 8px; max-height: 220px; overflow: auto; font-size: 12px; }
      #chatUsageMonitor .debug-item { display: grid; grid-template-columns: auto 1fr; gap: 6px; padding: 4px 0; border-bottom: 1px solid var(--usage-border); }
      #chatUsageMonitor .debug-item:last-child { border-bottom: none; }
      #chatUsageMonitor .debug-type { font-weight: 700; color: var(--usage-text); }
      #chatUsageMonitor .debug-detail { color: var(--usage-muted); word-break: break-all; }
      #chatUsageMonitor .analytics-toolbar { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin: 4px 0 12px 0; }
      #chatUsageMonitor .segmented { display: inline-flex; padding: 2px; border: 1px solid var(--usage-border); background: var(--usage-surface); border-radius: 999px; gap: 2px; }
      #chatUsageMonitor .segmented button { border: none; background: transparent; color: var(--usage-muted); padding: 6px 10px; border-radius: 999px; cursor: pointer; font-weight: 600; font-size: 12px; }
      #chatUsageMonitor .segmented button.active { background: var(--usage-surface-strong); color: var(--usage-text); }
      #chatUsageMonitor .analytics-cards { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; margin-bottom: 12px; }
      #chatUsageMonitor .analytics-card { background: var(--usage-surface); border: 1px solid var(--usage-border); border-radius: 12px; padding: 10px 12px; }
      #chatUsageMonitor .analytics-card-title { font-size: 12px; color: var(--usage-muted); }
      #chatUsageMonitor .analytics-card-value { margin-top: 4px; font-size: 16px; font-weight: 700; color: var(--usage-text); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      #chatUsageMonitor .analytics-card-sub { margin-top: 2px; font-size: 12px; color: var(--usage-muted); }
      #chatUsageMonitor .analytics-section-title { font-size: 12px; font-weight: 700; color: var(--usage-subtle); margin: 8px 0 6px 0; }
      #chatUsageMonitor .analytics-bars { display: flex; flex-direction: column; gap: 6px; background: var(--usage-surface); border: 1px solid var(--usage-border); border-radius: 12px; padding: 10px; }
      #chatUsageMonitor .analytics-bars-row { display: flex; position: relative; align-items: flex-end; gap: 4px; height: 120px; }
      #chatUsageMonitor .analytics-avg-line { position: absolute; left: 0; right: 0; border-top: 1px dashed var(--usage-border); opacity: 0.85; pointer-events: none; }
      #chatUsageMonitor .analytics-bar { flex: 1 1 0; height: 100%; background: var(--usage-surface-strong); border-radius: 6px; position: relative; overflow: hidden; }
      #chatUsageMonitor .analytics-bar-fill { position: absolute; inset: auto 0 0 0; background: var(--usage-accent); height: 0%; transition: height 0.2s ease; }
      #chatUsageMonitor .analytics-bar[data-today="true"] { outline: 2px solid var(--usage-border); }
      #chatUsageMonitor .analytics-bar-labels { display: flex; gap: 4px; font-size: 10px; color: var(--usage-muted); }
      #chatUsageMonitor .analytics-bar-label { flex: 1 1 0; text-align: center; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; opacity: 0.92; }
      #chatUsageMonitor .analytics-dist { margin-top: 12px; background: var(--usage-surface); border: 1px solid var(--usage-border); border-radius: 12px; padding: 10px 12px; }
      #chatUsageMonitor .analytics-dist-row { display: grid; grid-template-columns: 1fr auto; gap: 8px; align-items: center; padding: 6px 0; }
      #chatUsageMonitor .analytics-dist-row + .analytics-dist-row { border-top: 1px solid var(--usage-border); }
      #chatUsageMonitor .analytics-dist-name { font-size: 13px; color: var(--usage-text); font-weight: 600; }
      #chatUsageMonitor .analytics-dist-count { font-size: 13px; color: var(--usage-subtle); font-weight: 700; }
      #chatUsageMonitor .analytics-dist-bar { grid-column: 1 / span 2; height: 6px; background: var(--usage-surface-strong); border-radius: 999px; overflow: hidden; }
      #chatUsageMonitor .analytics-dist-bar-fill { height: 100%; width: 0%; background: var(--usage-accent); transition: width 0.2s ease; }
      #chatUsageMonitor .analytics-table-wrap { margin-top: 12px; background: var(--usage-surface); border: 1px solid var(--usage-border); border-radius: 12px; overflow: auto; }
      #chatUsageMonitor table.analytics-table { width: 100%; border-collapse: collapse; font-size: 12px; min-width: 560px; }
      #chatUsageMonitor table.analytics-table th, #chatUsageMonitor table.analytics-table td { padding: 8px 10px; border-bottom: 1px solid var(--usage-border); text-align: left; white-space: nowrap; }
      #chatUsageMonitor table.analytics-table th { position: sticky; top: 0; background: var(--usage-bg); color: var(--usage-subtle); font-weight: 700; }
      #chatUsageMonitor table.analytics-table tr:last-child td { border-bottom: none; }
      #chatUsageMonitor table.analytics-table tfoot td { font-weight: 700; }
      .usage-monitor-portal { display: flex; align-items: center; gap: 8px; position: relative; min-height: 40px; }
      #chatUsageMonitor.inline-mode {
        position: fixed;
        top: 0;
        left: 0;
        right: auto;
        bottom: auto;
        width: 420px;
        height: auto;
        max-height: 70vh;
        resize: none;
        padding-top: 6px;
        background: var(--usage-bg);
        border: 1px solid var(--usage-border);
        box-shadow: var(--usage-shadow);
        backdrop-filter: blur(6px);
        z-index: 10000;
        opacity: 0;
        transform: translateY(-4px);
        pointer-events: none;
        visibility: hidden;
        transition: opacity 160ms ease, transform 160ms ease, visibility 160ms ease;
      }
      #chatUsageMonitor.inline-mode.open {
        opacity: 1;
        transform: translateY(0);
        pointer-events: auto;
        visibility: visible;
      }
      #chatUsageMonitor.inline-mode header { cursor: default; }
      #chatUsageMonitor.inline-mode .minimize-btn { display: none; }
      #chatUsageMonitor.inline-mode .content { max-height: 60vh; }
      .usage-trigger { display: inline-flex; align-items: center; gap: 6px; padding: 8px 12px; border-radius: 999px; border: 1px solid var(--usage-border); background: var(--usage-surface); color: var(--usage-text); cursor: pointer; box-shadow: var(--usage-shadow); font-weight: 700; transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.1s ease; }
      .usage-trigger:hover { transform: translateY(-1px); box-shadow: var(--usage-shadow); }
      .usage-trigger__label { font-size: 13px; }
      .usage-trigger__plan { font-size: 12px; color: var(--usage-muted); letter-spacing: 0.4px; }
      .usage-trigger__value { font-size: 13px; color: var(--usage-text); }
      .usage-trigger__meter { position: relative; width: 72px; height: 6px; background: var(--usage-surface-strong); border-radius: 999px; overflow: hidden; }
      .usage-trigger__fill { position: absolute; inset: 0 auto 0 0; width: 0%; background: var(--usage-accent); transition: width 0.3s ease; }
      .usage-trigger.is-warning .usage-trigger__fill { background: var(--usage-warning); }
      .usage-trigger:focus-visible { outline: 2px solid var(--usage-accent); outline-offset: 2px; }
      [data-usage-trigger="true"][data-usage-ready="false"] { visibility: hidden; }
      [data-usage-trigger="true"] [data-usage-label="true"],
      [data-usage-trigger="true"][data-usage-label="true"] {
        color: var(--usage-subtle) !important;
        opacity: 0.92;
      }
    `);

    // State
    let usageData = Storage.get();

    // Menu commands
    GM_registerMenuCommand("Reset position", () => {
        Storage.update(d => { d.position = { x: null, y: null }; d.minimized = false; });
        const existing = document.getElementById("chatUsageMonitor");
        if (existing) existing.remove();
        scheduleInitialize(100);
        setTimeout(() => showToast(t("toast.positionReset")), 400);
    });
    GM_registerMenuCommand("Export usage data", exportUsageData);
    GM_registerMenuCommand("Import usage data", importUsageData);
    GM_registerMenuCommand("Clear usage data", clearUsageData);

    // Export/import
    function exportUsageData() {
        const json = JSON.stringify(Storage.get(), null, 2);
        const blob = new Blob([json], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `chatgpt-usage-${formatTimestampForFilename()}.json`;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 100);
        showToast(t("toast.exported"));
    }

    function importUsageData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json';
        input.style.display = 'none';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (evt) => {
                try {
                    const parsed = JSON.parse(evt.target.result);
                    if (!parsed || typeof parsed !== "object") throw new Error(t("import.invalidFile"));
                    if (!parsed.buckets) throw new Error(t("import.missingBuckets"));
                    Storage.set(parsed);
                    usageData = Storage.get();
                    updateUI();
                    showToast(t("toast.imported"));
                } catch (err) { alert(t("import.failed", { message: err.message })); }
            };
            reader.readAsText(file);
        };
        document.body.appendChild(input);
        input.click();
        setTimeout(() => document.body.removeChild(input), 0);
    }

    function clearUsageData() {
        if (!confirm(t("confirm.clearData"))) return;
        Storage.update(d => {
            d.buckets = createDefaultBuckets();
            d.events = [];
            d.pending = {};
        });
        usageData = Storage.get();
        updateUI();
        updateUsageLauncher();
        showToast(t("toast.cleared"), "warning");
    }

    function formatTimestampForFilename(date = new Date()) {
        const pad = (n) => String(n).padStart(2, '0');
        const y = date.getFullYear();
        const m = pad(date.getMonth() + 1);
        const d = pad(date.getDate());
        const hh = pad(date.getHours());
        const mm = pad(date.getMinutes());
        const ss = pad(date.getSeconds());
        return `${y}-${m}-${d}_${hh}-${mm}-${ss}`;
    }
    // UI creation
    let usageLauncher = null;
    let usagePortal = null;
    let _inlineCloseAttached = false;
    let _inlineRepositionAttached = false;
    let _uiUpdateIntervalId = null;
    const UI_BOOT_TS = Date.now();
    const UI_INLINE_WAIT_MS = 5000;
    const UI_THEME_WAIT_MS = 5000;

    function hasChatGPTThemeTokens() {
        try {
            const cs = getComputedStyle(document.documentElement);
            const v =
                cs.getPropertyValue("--surface-primary") ||
                cs.getPropertyValue("--token-main-surface-primary") ||
                cs.getPropertyValue("--token-surface-primary") ||
                cs.getPropertyValue("--background-primary");
            return Boolean(v && v.trim());
        } catch {
            return false;
        }
    }

    function createMonitorUI() {
        const existingMonitor = document.getElementById("chatUsageMonitor");
        const existingLauncher = document.querySelector('[data-usage-trigger="true"]');
        const launcherPresent = !!(existingLauncher && document.contains(existingLauncher));
        const existingIsInline = !!(existingMonitor && existingMonitor.classList.contains("inline-mode"));
        const anchor = findModelSwitcherAnchor();

        const bootAge = Date.now() - UI_BOOT_TS;
        if (!existingMonitor && !launcherPresent) {
            if (!hasChatGPTThemeTokens() && bootAge < UI_THEME_WAIT_MS) { scheduleInitialize(200); return; }
            if (!anchor && bootAge < UI_INLINE_WAIT_MS) { scheduleInitialize(200); return; }
        }

        if (existingIsInline && !anchor) {
            usageLauncher = existingLauncher || usageLauncher;
            usagePortal = usageLauncher || usagePortal;
            if (!launcherPresent) scheduleInitialize(200);
            return;
        }

        const inlineMode = Boolean(anchor);

        // Rebuild when: monitor missing, launcher missing (inline mode), or mode changed
        const modeChanged = !!(existingMonitor && existingIsInline !== inlineMode);
        const needsRebuild = !existingMonitor || modeChanged || (inlineMode && !launcherPresent);

        if (!needsRebuild) {
            // Keep globals in sync
            usageLauncher = existingLauncher || usageLauncher;
            usagePortal = usageLauncher || usagePortal;
            if (inlineMode && anchor && usageLauncher) {
                ensureUsageLauncherPlacement(anchor);
                markUsageLauncherReady();
            }
            return;
        }

        if (existingMonitor) existingMonitor.remove();
        if (usagePortal && usagePortal.parentElement) usagePortal.remove();
        if (existingLauncher && existingLauncher.parentElement) existingLauncher.remove();
        usagePortal = null; usageLauncher = null;

        const container = document.createElement("div");
        container.id = "chatUsageMonitor";
        container.setAttribute("data-label", t("button.usage"));
        if (!inlineMode && usageData.minimized) container.classList.add("minimized");
        if (!inlineMode && usageData.size.width && usageData.size.height && !usageData.minimized) {
            container.style.width = `${usageData.size.width}px`;
            container.style.height = `${usageData.size.height}px`;
        }
        if (!inlineMode) {
            if (usageData.position.x !== null && usageData.position.y !== null) {
                container.style.setProperty('left', `${usageData.position.x}px`, 'important');
                container.style.setProperty('top', `${usageData.position.y}px`, 'important');
            }
        } else {
            container.classList.add("inline-mode");
        }

        const header = document.createElement("header");
        const minimizeBtn = document.createElement("div");
        minimizeBtn.className = "minimize-btn";
        minimizeBtn.innerHTML = "-";
        minimizeBtn.title = t("title.minimize");
        minimizeBtn.addEventListener("click", (e) => { e.stopPropagation(); toggleMonitorVisibility(false); });
        header.appendChild(minimizeBtn);

        const usageTabBtn = document.createElement("button"); usageTabBtn.textContent = t("tab.usage"); usageTabBtn.classList.add("active"); usageTabBtn.setAttribute("data-tab", "usage");
        const analyticsTabBtn = document.createElement("button"); analyticsTabBtn.textContent = t("tab.analytics"); analyticsTabBtn.setAttribute("data-tab", "analytics");
        const debugTabBtn = document.createElement("button"); debugTabBtn.textContent = t("tab.debug"); debugTabBtn.setAttribute("data-tab", "debug");
        header.appendChild(usageTabBtn); header.appendChild(analyticsTabBtn); header.appendChild(debugTabBtn); container.appendChild(header);

        const usageContent = document.createElement("div"); usageContent.className = "content"; usageContent.id = "usageContent"; container.appendChild(usageContent);
        const debugContent = document.createElement("div"); debugContent.className = "content"; debugContent.id = "debugContent"; debugContent.style.display = "none"; container.appendChild(debugContent);
        const analyticsContent = document.createElement("div"); analyticsContent.className = "content"; analyticsContent.id = "analyticsContent"; analyticsContent.style.display = "none"; container.appendChild(analyticsContent);

        const setActiveTab = (tab) => {
            const isUsage = tab === "usage";
            const isDebug = tab === "debug";
            const isAnalytics = tab === "analytics";

            usageTabBtn.classList.toggle("active", isUsage);
            debugTabBtn.classList.toggle("active", isDebug);
            analyticsTabBtn.classList.toggle("active", isAnalytics);

            usageContent.style.display = isUsage ? "" : "none";
            debugContent.style.display = isDebug ? "" : "none";
            analyticsContent.style.display = isAnalytics ? "" : "none";
        };

        usageTabBtn.addEventListener("click", () => { setActiveTab("usage"); updateUI(); });
        analyticsTabBtn.addEventListener("click", () => { setActiveTab("analytics"); updateUI(); });
        debugTabBtn.addEventListener("click", () => { setActiveTab("debug"); updateUI(); });

        if (!inlineMode) {
            container.addEventListener("click", (e) => {
                if (container.classList.contains("minimized")) { toggleMonitorVisibility(true); e.stopPropagation(); }
            });
        }

        if (inlineMode && anchor) {
            usageLauncher = createUsageLauncherButton(anchor);
            usageLauncher.style.marginLeft = "6px";
            usagePortal = usageLauncher;
            ensureUsageLauncherPlacement(anchor);
            markUsageLauncherReady();
            document.body.appendChild(container);
            if (!_inlineCloseAttached) {
                document.addEventListener('click', handleInlineOutsideClick, true);
                document.addEventListener('keydown', handleEscapeClose, true);
                _inlineCloseAttached = true;
            }
            if (!_inlineRepositionAttached) {
                const maybeReposition = () => {
                    const anchorNow = findModelSwitcherAnchor();
                    if (anchorNow && usageLauncher) ensureUsageLauncherPlacement(anchorNow);
                    const monitor = document.getElementById('chatUsageMonitor');
                    if (!monitor || !monitor.classList.contains('inline-mode') || !monitor.classList.contains('open')) return;
                    positionInlinePopover();
                };
                window.addEventListener('resize', maybeReposition, true);
                document.addEventListener('scroll', maybeReposition, true);
                if (window.visualViewport) {
                    window.visualViewport.addEventListener('resize', maybeReposition);
                    window.visualViewport.addEventListener('scroll', maybeReposition);
                }
                _inlineRepositionAttached = true;
            }
        } else {
            container.classList.add("floating-mode");
            document.body.appendChild(container);
            setupDraggable(container);
        }

        updateUI();
        updateUsageLauncher();
        toggleMonitorVisibility(!usageData.minimized);

        if (typeof ResizeObserver !== 'undefined' && !container.classList.contains('inline-mode')) {
            const resizeObserver = new ResizeObserver(() => {
                if (!container.classList.contains('minimized')) {
                    const width = container.offsetWidth; const height = container.offsetHeight;
                    if (width > 50 && height > 50) Storage.update(data => { data.size = { width, height }; });
                }
            });
            resizeObserver.observe(container);
        }

        if (_uiUpdateIntervalId) clearInterval(_uiUpdateIntervalId);
        _uiUpdateIntervalId = setInterval(updateUI, 60000);
    }

    function handleInlineOutsideClick(e) {
        const monitor = document.getElementById('chatUsageMonitor');
        if (!monitor || !monitor.classList.contains('inline-mode') || !monitor.classList.contains('open')) return;
        if (monitor.contains(e.target)) return;
        if (usageLauncher && usageLauncher.contains(e.target)) return;
        toggleMonitorVisibility(false);
    }
    function handleEscapeClose(e) { if (e.key === "Escape") toggleMonitorVisibility(false); }

    function toggleMonitorVisibility(open) {
        const monitor = document.getElementById("chatUsageMonitor"); if (!monitor) return;
        const inlineMode = monitor.classList.contains("inline-mode");
        const currentOpen = inlineMode ? monitor.classList.contains("open") : !monitor.classList.contains("minimized");
        const shouldOpen = typeof open === "boolean" ? open : !currentOpen;
        if (inlineMode) { monitor.classList.toggle("open", shouldOpen); monitor.setAttribute('aria-hidden', String(!shouldOpen)); }
        else {
            monitor.classList.toggle("minimized", !shouldOpen);
            if (shouldOpen && usageData.size.width && usageData.size.height) { monitor.style.width = `${usageData.size.width}px`; monitor.style.height = `${usageData.size.height}px`; }
        }
        Storage.update(d => { d.minimized = !shouldOpen; });
        usageData.minimized = !shouldOpen;
        if (usageLauncher) {
            usageLauncher.setAttribute('aria-pressed', String(shouldOpen));
            usageLauncher.setAttribute('aria-expanded', String(shouldOpen));
            usageLauncher.setAttribute('data-state', shouldOpen ? 'open' : 'closed');
        }
        if (shouldOpen) {
            updateUI();
            if (inlineMode) positionInlinePopover();
        }
    }

    function resolveReferenceButton(referenceEl) {
        return referenceEl?.tagName === "BUTTON"
            ? referenceEl
            : (referenceEl?.querySelector?.("button") || referenceEl?.closest?.("button") || null);
    }

    function ensureUsageLauncherPlacement(referenceEl) {
        if (!usageLauncher) return;
        const modelButton = resolveReferenceButton(referenceEl);
        if (!modelButton || !modelButton.parentElement) return;

        const parent = modelButton.parentElement;
        const flexDir = window.getComputedStyle(parent)?.flexDirection || "";
        const wantsBefore = flexDir.includes("row-reverse");

        let moved = false;
        if (wantsBefore) {
            if (usageLauncher.nextSibling !== modelButton) { parent.insertBefore(usageLauncher, modelButton); moved = true; }
        } else {
            if (modelButton.nextSibling !== usageLauncher) { modelButton.insertAdjacentElement("afterend", usageLauncher); moved = true; }
        }
        if (!moved) return;

        requestAnimationFrame(() => {
            if (!usageLauncher || !modelButton.isConnected) return;
            const lr = usageLauncher.getBoundingClientRect();
            const mr = modelButton.getBoundingClientRect();
            if (!Number.isFinite(lr.left) || !Number.isFinite(mr.left)) return;
            const sameRow = Math.abs(lr.top - mr.top) < 6;
            const isRight = lr.left > mr.left;
            if (sameRow && !isRight) {
                if (wantsBefore) modelButton.insertAdjacentElement("afterend", usageLauncher);
                else parent.insertBefore(usageLauncher, modelButton);
            }
        });
    }

    function positionInlinePopover() {
        const monitor = document.getElementById("chatUsageMonitor");
        if (!monitor || !usageLauncher) return;
        if (!monitor.classList.contains("inline-mode")) return;

        const rect = usageLauncher.getBoundingClientRect();
        const margin = 10;
        let minLeft = margin;
        try {
            const main = document.querySelector("main, [role=\"main\"]");
            const mainRect = main?.getBoundingClientRect?.();
            if (mainRect && Number.isFinite(mainRect.left) && mainRect.left > 0 && mainRect.left < window.innerWidth - 220) {
                minLeft = Math.max(minLeft, Math.floor(mainRect.left) + margin);
            }
        } catch {
            // ignore
        }

        let desiredWidth = Math.min(420, Math.max(280, Math.floor(window.innerWidth - margin * 2)));
        const maxWidthByBoundary = Math.floor(window.innerWidth - minLeft - margin);
        if (Number.isFinite(maxWidthByBoundary) && maxWidthByBoundary > 0) desiredWidth = Math.min(desiredWidth, maxWidthByBoundary);

        const maxLeft = window.innerWidth - desiredWidth - margin;
        const left = Math.min(Math.max(minLeft, rect.right - desiredWidth), maxLeft);

        monitor.style.position = 'fixed';
        monitor.style.left = `${left}px`;
        monitor.style.right = 'auto';
        monitor.style.width = `${desiredWidth}px`;
        monitor.style.height = 'auto';

        const belowSpace = window.innerHeight - rect.bottom - margin;
        const aboveSpace = rect.top - margin;
        const openBelow = belowSpace >= 260 || belowSpace >= aboveSpace;

        if (openBelow) {
            monitor.style.top = `${rect.bottom + margin}px`;
            monitor.style.bottom = 'auto';
            monitor.style.maxHeight = `${Math.max(160, belowSpace)}px`;
        } else {
            monitor.style.bottom = `${window.innerHeight - rect.top + margin}px`;
            monitor.style.top = 'auto';
            monitor.style.maxHeight = `${Math.max(160, aboveSpace)}px`;
        }
    }

    function createUsageLauncherButton(referenceEl) {
        const usageLabel = t("button.usage");
        const referenceButton = referenceEl?.tagName === 'BUTTON'
            ? referenceEl
            : (referenceEl?.querySelector?.('button') || referenceEl?.closest?.('button') || null);

        // Preferred: clone model-switcher button HTML/classes so hover/active effects match 1:1
        if (referenceButton) {
            const btn = referenceButton.cloneNode(true);
            btn.type = "button";
            btn.removeAttribute('id');
            btn.removeAttribute('data-testid');
            btn.removeAttribute('aria-controls');
            btn.removeAttribute('aria-describedby');
            btn.removeAttribute('aria-labelledby');
            btn.removeAttribute('tabindex');
            btn.disabled = false;

            btn.setAttribute('aria-label', usageLabel);
            btn.setAttribute('aria-haspopup', 'dialog');
            btn.setAttribute('aria-expanded', 'false');
            btn.setAttribute('data-usage-trigger', 'true');
            btn.setAttribute('data-state', 'closed');
            btn.setAttribute('data-usage-ready', 'false');

            // Replace the visible label text while keeping the chevron/icon structure
            const textHosts = Array.from(btn.querySelectorAll('span,div')).filter(el => {
                if (!(el instanceof HTMLElement)) return false;
                if (el.querySelector('svg')) return false;
                const t = (el.textContent || '').trim();
                return t.length > 0 && t.length <= 40;
            });
            const primary = textHosts.find(el => /GPT|ChatGPT|Model|\u6a21\u578b/i.test(el.textContent || '')) || textHosts[0] || null;
            textHosts.forEach(el => { el.textContent = ''; });
            if (primary) {
                primary.textContent = usageLabel;
                primary.setAttribute('data-usage-label', 'true');
            } else {
                btn.textContent = usageLabel;
                btn.setAttribute('data-usage-label', 'true');
            }

            btn.addEventListener("click", (e) => { e.stopPropagation(); toggleMonitorVisibility(); });
            return btn;
        }

        // Fallback (rare): simple pill
        const fallback = document.createElement("button");
        fallback.type = "button";
        fallback.className = "usage-trigger";
        fallback.setAttribute("aria-label", usageLabel);
        fallback.setAttribute('aria-haspopup', 'dialog');
        fallback.setAttribute('aria-expanded', 'false');
        fallback.setAttribute('data-usage-trigger', 'true');
        fallback.setAttribute('data-usage-label', 'true');
        fallback.setAttribute('data-state', 'closed');
        fallback.setAttribute('data-usage-ready', 'false');
        fallback.textContent = usageLabel;
        fallback.addEventListener("click", (e) => { e.stopPropagation(); toggleMonitorVisibility(); });
        return fallback;
    }

    function markUsageLauncherReady() {
        if (!usageLauncher) return;
        if (usageLauncher.getAttribute("data-usage-ready") === "true") return;
        requestAnimationFrame(() => {
            if (!usageLauncher) return;
            usageLauncher.setAttribute("data-usage-ready", "true");
        });
    }

    function updateUsageLauncher() {
        if (!usageLauncher) return;
        const isOpen = !usageData.minimized;
        usageLauncher.setAttribute('aria-expanded', String(isOpen));
        usageLauncher.setAttribute('aria-pressed', String(isOpen));
        usageLauncher.setAttribute('data-state', isOpen ? 'open' : 'closed');
        markUsageLauncherReady();
    }

    function getTopBucketSnapshot() {
        let top = { bucket: null, percent: 0 };
        BUCKET_ORDER.forEach(id => { const stats = getBucketStats(id); if (!stats) return; if (stats.percent >= top.percent) top = { bucket: id, percent: stats.percent }; });
        return top;
    }

    function updateUI() {
        const monitor = document.getElementById("chatUsageMonitor");
        if (monitor) {
            const inlineMode = monitor.classList.contains("inline-mode");
            const isOpen = inlineMode ? monitor.classList.contains("open") : !monitor.classList.contains("minimized");
            if (!isOpen) return;
        }
        const usageContent = document.getElementById("usageContent");
        const debugContent = document.getElementById("debugContent");
        const analyticsContent = document.getElementById("analyticsContent");
        if (usageContent && usageContent.style.display !== "none") updateUsageContent(usageContent);
        if (debugContent && debugContent.style.display !== "none") updateDebugContent(debugContent);
        if (analyticsContent && analyticsContent.style.display !== "none") updateAnalyticsContent(analyticsContent);
    }
    function updateUsageContent(container) {
        container.innerHTML = "";
        BUCKET_ORDER.forEach(bucketId => {
            const stats = getBucketStats(bucketId);
            if (!stats) return;
            const row = document.createElement("div"); row.className = "bucket-row";
            const title = document.createElement("div"); title.className = "bucket-title"; title.textContent = BUCKET_CONFIG[bucketId].name; row.appendChild(title);
            const usageText = document.createElement("div"); usageText.style.textAlign = "right"; usageText.style.fontWeight = "700"; usageText.textContent = stats.limit === Infinity ? `${stats.used}/∞` : `${stats.used}/${stats.limit}`; row.appendChild(usageText);
            const sub = document.createElement("div"); sub.className = "bucket-sub"; sub.textContent = `${formatWindowLabel(BUCKET_CONFIG[bucketId].window)} \u00b7 ${t("usage.resetsIn", { timeLeft: stats.timeLeft })}`; if (BUCKET_CONFIG[bucketId].tooltip) sub.title = BUCKET_CONFIG[bucketId].tooltip; row.appendChild(sub);
            const sub2 = document.createElement("div"); sub2.className = "bucket-sub"; sub2.style.textAlign = "right"; sub2.textContent = ""; row.appendChild(sub2);
            const progress = document.createElement("div"); progress.className = "progress"; const fill = document.createElement("div"); fill.className = "progress-fill"; fill.style.width = `${Math.min(stats.percent * 100, 100)}%`; if (stats.percent >= 1) fill.classList.add("danger"); else if (stats.percent >= 0.85) fill.classList.add("warn"); progress.appendChild(fill); row.appendChild(progress);
            const statLine = document.createElement("div"); statLine.className = "stat-line"; const last = stats.lastUsed ? `${formatTimeAgo(stats.lastUsed)} \u2022 ${new Date(stats.lastUsed).toLocaleString()}` : t("usage.noCalls"); statLine.textContent = t("usage.last", { last }); row.appendChild(statLine);
            container.appendChild(row);
        });
        const actions = document.createElement("div"); actions.className = "actions";
        const exportBtn = document.createElement("button"); exportBtn.className = "btn"; exportBtn.textContent = t("button.export"); exportBtn.addEventListener("click", exportUsageData);
        const importBtn = document.createElement("button"); importBtn.className = "btn"; importBtn.textContent = t("button.import"); importBtn.addEventListener("click", importUsageData);
        const clearBtn = document.createElement("button"); clearBtn.className = "btn danger"; clearBtn.textContent = t("button.clear"); clearBtn.addEventListener("click", clearUsageData);
        actions.appendChild(exportBtn); actions.appendChild(importBtn); actions.appendChild(clearBtn); container.appendChild(actions);
    }

    function updateDebugContent(container) {
        container.innerHTML = "";
        const info = document.createElement("p");
        info.style.fontSize = STYLE.textSize.sm;
        const main = document.createElement("div");
        main.textContent = t("debug.info.main");
        info.appendChild(main);
        const sub = document.createElement("div");
        sub.style.color = COLORS.secondaryText;
        sub.style.fontSize = STYLE.textSize.xs;
        sub.textContent = t("debug.info.sub", { tz: timeZoneLabel() });
        info.appendChild(sub);
        container.appendChild(info);

        const debugToggle = document.createElement("label"); debugToggle.style.display = "flex"; debugToggle.style.alignItems = "center"; debugToggle.style.gap = "8px"; debugToggle.style.margin = "8px 0";
        const dbgCheckbox = document.createElement("input"); dbgCheckbox.type = "checkbox"; dbgCheckbox.checked = !!usageData.settings.showDebug;
        dbgCheckbox.addEventListener("change", () => { Storage.update(d => { d.settings.showDebug = dbgCheckbox.checked; }); usageData = Storage.get(); updateUI(); });
        debugToggle.appendChild(dbgCheckbox); debugToggle.appendChild(document.createTextNode(t("debug.showEvents"))); container.appendChild(debugToggle);
        if (usageData.settings.showDebug) {
            const debugBox = document.createElement("div"); debugBox.className = "debug-list";
            const events = usageData.events || [];
            if (events.length === 0) debugBox.textContent = t("debug.noEvents");
            else {
                events.slice(0, 60).forEach(ev => {
                    const item = document.createElement("div"); item.className = "debug-item";
                    const type = document.createElement("div"); type.className = "debug-type"; type.textContent = ev.type;
                    const detail = document.createElement("div"); detail.className = "debug-detail"; detail.textContent = `${ev.detail || ""} \u2022 ${new Date(ev.t).toLocaleTimeString()}`;
                    item.appendChild(type); item.appendChild(detail); debugBox.appendChild(item);
                });
            }
            container.appendChild(debugBox);
        }
    }

    function getAllRequests() {
        const all = [];
        for (const bucketId of BUCKET_ORDER) {
            const bucket = usageData.buckets?.[bucketId];
            if (!bucket) continue;
            const requests = bucket.requests || [];
            for (const req of requests) {
                const t = tsOf(req);
                if (!Number.isFinite(t)) continue;
                all.push({
                    t,
                    bucketId,
                    variant: req?.variant || "unknown",
                    status: req?.status || "unknown",
                });
            }
        }
        return all;
    }

    function dateKeyTZ(ts) {
        const p = tzParts(ts);
        return `${p.year}-${p.month}-${p.day}`;
    }

    function formatDateTZ(ts) {
        const p = tzParts(ts);
        return `${p.year}/${p.month}/${p.day}`;
    }

    function computeAnalytics(rangeDays) {
        const safeDays = rangeDays === 30 ? 30 : 7;
        const todayStart = startOfDayTZ();
        const start = addDaysLocal(todayStart, -(safeDays - 1));
        const endExclusive = addDaysLocal(todayStart, 1);

        const days = [];
        for (let i = 0; i < safeDays; i++) {
            const dayStart = addDaysLocal(start, i);
            const p = tzParts(dayStart);
            days.push({
                startTs: dayStart,
                key: `${p.year}-${p.month}-${p.day}`,
                label: `${p.year}/${p.month}/${p.day}`,
                weekday: p.weekday,
            });
        }

        const totalsByDay = Object.fromEntries(days.map(d => [d.key, 0]));
        const byDayByBucket = Object.fromEntries(
            days.map(d => [d.key, Object.fromEntries(BUCKET_ORDER.map(b => [b, 0]))])
        );
        const bucketTotals = Object.fromEntries(BUCKET_ORDER.map(b => [b, 0]));
        const variantTotals = {};
        const hourTotals = Array.from({ length: 24 }, () => 0);

        let total = 0;
        for (const req of getAllRequests()) {
            if (req.t < start || req.t >= endExclusive) continue;
            total += 1;

            const key = dateKeyTZ(req.t);
            if (totalsByDay[key] !== undefined) {
                totalsByDay[key] += 1;
                byDayByBucket[key][req.bucketId] += 1;
            }
            bucketTotals[req.bucketId] += 1;

            const variant = req.variant || "unknown";
            variantTotals[variant] = (variantTotals[variant] || 0) + 1;

            const hour = new Date(req.t).getHours();
            if (Number.isFinite(hour) && hour >= 0 && hour < 24) hourTotals[hour] += 1;
        }

        const activeDays = days.filter(d => totalsByDay[d.key] > 0).length;
        const avgPerActiveDay = activeDays ? total / activeDays : 0;

        let peakDay = null;
        let peakCount = 0;
        for (const d of days) {
            const c = totalsByDay[d.key];
            if (c > peakCount) { peakDay = d; peakCount = c; }
        }

        const activeVariants = Object.keys(variantTotals).length;

        let topBucket = null;
        let topBucketCount = 0;
        for (const b of BUCKET_ORDER) {
            const c = bucketTotals[b] || 0;
            if (c > topBucketCount) { topBucket = b; topBucketCount = c; }
        }

        const topVariant = Object.entries(variantTotals).sort((a, b) => b[1] - a[1])[0]?.[0] || null;

        let peakHour = 0;
        for (let h = 1; h < hourTotals.length; h++) {
            if (hourTotals[h] > hourTotals[peakHour]) peakHour = h;
        }

        return {
            rangeDays: safeDays,
            startTs: start,
            endExclusiveTs: endExclusive,
            days,
            total,
            activeDays,
            avgPerActiveDay,
            peakDay,
            peakCount,
            activeVariants,
            bucketTotals,
            totalsByDay,
            byDayByBucket,
            topBucket,
            topVariant,
            peakHour,
        };
    }

    function updateAnalyticsContent(container) {
        container.innerHTML = "";

        const rangeDays = usageData.settings.analysisRangeDays === 30 ? 30 : 7;
        const data = computeAnalytics(rangeDays);

        const toolbar = document.createElement("div");
        toolbar.className = "analytics-toolbar";

        const left = document.createElement("div");
        left.style.display = "flex";
        left.style.alignItems = "center";
        left.style.gap = "8px";

        const title = document.createElement("div");
        title.style.fontWeight = "700";
        title.style.color = "var(--usage-text)";
        title.textContent = t("analytics.summary");
        left.appendChild(title);

        const segmented = document.createElement("div");
        segmented.className = "segmented";

        const btn7 = document.createElement("button");
        btn7.type = "button";
        btn7.textContent = "7d";
        btn7.classList.toggle("active", rangeDays === 7);

        const btn30 = document.createElement("button");
        btn30.type = "button";
        btn30.textContent = "30d";
        btn30.classList.toggle("active", rangeDays === 30);

        btn7.addEventListener("click", () => {
            Storage.update(d => { d.settings.analysisRangeDays = 7; });
            usageData = Storage.get();
            updateUI();
        });
        btn30.addEventListener("click", () => {
            Storage.update(d => { d.settings.analysisRangeDays = 30; });
            usageData = Storage.get();
            updateUI();
        });

        segmented.appendChild(btn7);
        segmented.appendChild(btn30);
        left.appendChild(segmented);
        toolbar.appendChild(left);

        const rangeText = document.createElement("div");
        rangeText.style.fontSize = "12px";
        rangeText.style.color = "var(--usage-muted)";
        const startLabel = formatDateTZ(data.startTs);
        const endLabel = data.days.length ? formatDateTZ(data.days[data.days.length - 1].startTs) : "";
        rangeText.textContent = endLabel ? t("analytics.range", { start: startLabel, end: endLabel }) : startLabel;
        toolbar.appendChild(rangeText);

        container.appendChild(toolbar);

        const cards = document.createElement("div");
        cards.className = "analytics-cards";

        const makeCard = (titleText, valueText, subText, valueTitle) => {
            const card = document.createElement("div");
            card.className = "analytics-card";
            const t = document.createElement("div");
            t.className = "analytics-card-title";
            t.textContent = titleText;
            const v = document.createElement("div");
            v.className = "analytics-card-value";
            v.textContent = valueText;
            if (valueTitle) v.title = valueTitle;
            card.appendChild(t);
            card.appendChild(v);
            if (subText) {
                const s = document.createElement("div");
                s.className = "analytics-card-sub";
                s.textContent = subText;
                card.appendChild(s);
            }
            return card;
        };

        const avg = data.avgPerActiveDay ? data.avgPerActiveDay.toFixed(1) : "0.0";
        cards.appendChild(makeCard(t("analytics.totalRequests"), String(data.total), t("analytics.days", { n: data.rangeDays })));
        cards.appendChild(makeCard(t("analytics.avgActive"), avg, t("analytics.activeDays", { n: data.activeDays })));
        cards.appendChild(
            makeCard(
                t("analytics.peakDay"),
                data.peakDay ? data.peakDay.label : "-",
                data.peakDay ? t("analytics.requests", { n: data.peakCount }) : ""
            )
        );
        cards.appendChild(makeCard(t("analytics.activeModels"), String(data.activeVariants), t("analytics.distinctModels")));
        cards.appendChild(
            makeCard(
                t("analytics.topBucket"),
                data.topBucket ? (BUCKET_CONFIG[data.topBucket]?.name || data.topBucket) : "-",
                data.topBucket ? t("analytics.requests", { n: data.bucketTotals[data.topBucket] || 0 }) : "",
                data.topBucket ? (BUCKET_CONFIG[data.topBucket]?.name || data.topBucket) : ""
            )
        );
        cards.appendChild(makeCard(t("analytics.topModel"), data.topVariant || "-", "", data.topVariant || ""));
        container.appendChild(cards);

        const trendTitle = document.createElement("div");
        trendTitle.className = "analytics-section-title";
        trendTitle.textContent = t("analytics.dailyTrend");
        container.appendChild(trendTitle);

        const trend = document.createElement("div");
        trend.className = "analytics-bars";

        const barsRow = document.createElement("div");
        barsRow.className = "analytics-bars-row";

        const labelsRow = document.createElement("div");
        labelsRow.className = "analytics-bar-labels";

        const todayKey = dateKeyTZ(Date.now());
        const maxDay = Math.max(1, ...data.days.map(d => data.totalsByDay[d.key] || 0));
        const avgPerDay = data.rangeDays ? (data.total / data.rangeDays) : 0;
        const avgPct = Math.max(0, Math.min(100, (avgPerDay / maxDay) * 100));
        const avgLine = document.createElement("div");
        avgLine.className = "analytics-avg-line";
        avgLine.style.bottom = `${avgPct}%`;
        barsRow.appendChild(avgLine);

        data.days.forEach((d, idx) => {
            const count = data.totalsByDay[d.key] || 0;
            const bar = document.createElement("div");
            bar.className = "analytics-bar";
            bar.setAttribute("data-today", String(d.key === todayKey));
            const fill = document.createElement("div");
            fill.className = "analytics-bar-fill";
            const rawPct = (count / maxDay) * 100;
            const pct = count === 0 ? 0 : Math.max(1, Math.round(rawPct));
            fill.style.height = `${pct}%`;
            bar.title = `${d.label} ${d.weekday} - ${t("analytics.requests", { n: count })}`;
            bar.appendChild(fill);
            barsRow.appendChild(bar);

            const label = document.createElement("div");
            label.className = "analytics-bar-label";
            const labelText = data.rangeDays <= 7
                ? d.weekday
                : ((idx === 0 || idx === data.days.length - 1 || idx % 5 === 0) ? d.label.slice(5) : "");
            label.textContent = labelText;
            labelsRow.appendChild(label);
        });

        trend.appendChild(barsRow);
        trend.appendChild(labelsRow);
        container.appendChild(trend);

        const distTitle = document.createElement("div");
        distTitle.className = "analytics-section-title";
        distTitle.textContent = t("analytics.byBucket");
        container.appendChild(distTitle);

        const dist = document.createElement("div");
        dist.className = "analytics-dist";
        const maxBucket = Math.max(1, ...BUCKET_ORDER.map(b => data.bucketTotals[b] || 0));
        BUCKET_ORDER.forEach(bucketId => {
            const row = document.createElement("div");
            row.className = "analytics-dist-row";
            const name = document.createElement("div");
            name.className = "analytics-dist-name";
            name.textContent = BUCKET_CONFIG[bucketId]?.name || bucketId;
            const count = document.createElement("div");
            count.className = "analytics-dist-count";
            count.textContent = String(data.bucketTotals[bucketId] || 0);
            row.appendChild(name);
            row.appendChild(count);

            const bar = document.createElement("div");
            bar.className = "analytics-dist-bar";
            const fill = document.createElement("div");
            fill.className = "analytics-dist-bar-fill";
            const widthPct = Math.round(((data.bucketTotals[bucketId] || 0) / maxBucket) * 100);
            fill.style.width = `${widthPct}%`;
            bar.appendChild(fill);
            row.appendChild(bar);

            dist.appendChild(row);
        });
        container.appendChild(dist);

        const tableTitle = document.createElement("div");
        tableTitle.className = "analytics-section-title";
        tableTitle.textContent = t("analytics.dailyBreakdown");
        container.appendChild(tableTitle);

        const tableWrap = document.createElement("div");
        tableWrap.className = "analytics-table-wrap";

        const table = document.createElement("table");
        table.className = "analytics-table";

        const thead = document.createElement("thead");
        const headRow = document.createElement("tr");
        const headers = [
            t("table.date"),
            t("table.total"),
            t("table.auto"),
            t("table.thinking"),
            t("table.mini"),
            t("table.gpt4"),
            t("table.o3"),
            t("table.o4mini"),
        ];
        headers.forEach(h => {
            const th = document.createElement("th");
            th.textContent = h;
            headRow.appendChild(th);
        });
        thead.appendChild(headRow);
        table.appendChild(thead);

        const tbody = document.createElement("tbody");
        const totals = { total: 0, gpt5_auto: 0, gpt5_thinking: 0, thinking_mini: 0, gpt4: 0, o3: 0, o4mini: 0 };
        data.days.forEach(d => {
            const tr = document.createElement("tr");
            const total = data.totalsByDay[d.key] || 0;
            const byBucket = data.byDayByBucket[d.key] || {};
            totals.total += total;
            for (const b of BUCKET_ORDER) totals[b] += byBucket[b] || 0;

            const cells = [
                `${d.label} ${d.weekday}`,
                String(total),
                String(byBucket.gpt5_auto || 0),
                String(byBucket.gpt5_thinking || 0),
                String(byBucket.thinking_mini || 0),
                String(byBucket.gpt4 || 0),
                String(byBucket.o3 || 0),
                String(byBucket.o4mini || 0),
            ];
            cells.forEach((c, i) => {
                const td = document.createElement("td");
                td.textContent = c;
                if (i === 1) td.style.fontWeight = "700";
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });
        table.appendChild(tbody);

        const tfoot = document.createElement("tfoot");
        const footRow = document.createElement("tr");
        const footCells = [
            t("table.totalRow"),
            String(totals.total),
            String(totals.gpt5_auto),
            String(totals.gpt5_thinking),
            String(totals.thinking_mini),
            String(totals.gpt4),
            String(totals.o3),
            String(totals.o4mini),
        ];
        footCells.forEach((c, i) => {
            const td = document.createElement("td");
            td.textContent = c;
            if (i === 1) td.style.fontWeight = "700";
            footRow.appendChild(td);
        });
        tfoot.appendChild(footRow);
        table.appendChild(tfoot);

        tableWrap.appendChild(table);
        container.appendChild(tableWrap);

        if (data.total === 0) {
            const empty = document.createElement("div");
            empty.style.marginTop = "12px";
            empty.style.fontSize = "12px";
            empty.style.color = "var(--usage-muted)";
            empty.textContent = t("analytics.noData");
            container.appendChild(empty);
        }
    }

    function getBucketStats(bucketId) {
        const bucket = usageData.buckets[bucketId]; if (!bucket) return null;
        const limit = bucket.limit ?? Infinity;
        const start = windowStart(bucket); const end = windowEnd(bucket);
        const active = (bucket.requests || []).filter(r => tsOf(r) >= start);
        const used = active.length; const lastUsed = active.length ? Math.max(...active.map(r => tsOf(r))) : null;
        const pseudoLimit = bucketId === "thinking_mini" ? 1000 : limit;
        const percent = pseudoLimit === Infinity ? 0 : (used / pseudoLimit);
        return { used, limit, percent, windowStart: start, windowEnd: end, timeLeft: formatTimeLeft(end), lastUsed };
    }

    function showToast(message, type = "success") {
        const container = document.getElementById('chatUsageMonitor'); if (!container) return;
        const existing = container.querySelector('.toast'); if (existing) existing.remove();
        const toast = document.createElement('div'); toast.className = 'toast'; toast.textContent = message;
        toast.setAttribute("role", "status");
        toast.setAttribute("aria-live", "polite");
        toast.setAttribute("aria-atomic", "true");
        toast.style.position = 'absolute'; toast.style.bottom = '14px'; toast.style.left = '50%'; toast.style.transform = 'translateX(-50%)';
        toast.style.background = COLORS.surface; toast.style.color = type === "error" ? COLORS.danger : (type === "warning" ? COLORS.warning : COLORS.success);
        toast.style.border = `1px solid ${COLORS.border}`; toast.style.padding = '8px 12px'; toast.style.borderRadius = '12px'; toast.style.boxShadow = 'var(--usage-shadow)'; toast.style.opacity = '0'; toast.style.transition = 'opacity 0.2s ease';
        container.appendChild(toast); requestAnimationFrame(() => toast.style.opacity = '1');
        setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 200); }, 2600);
    }

    function setupDraggable(element) {
        let isDragging = false; let startX, startY, origLeft, origTop; let prevTransition = ''; let prevUserSelect = '';
        const handle = element.querySelector('header'); if (handle) handle.addEventListener('mousedown', startDrag);
        element.addEventListener('mousedown', (e) => { if (element.classList.contains('minimized')) startDrag(e); });
        function startDrag(e) {
            if (element.classList.contains('inline-mode')) return;
            if (e.target.classList.contains('minimize-btn') || e.target.tagName === 'BUTTON') return;
            isDragging = false; startX = e.clientX; startY = e.clientY;
            const rect = element.getBoundingClientRect(); origLeft = rect.left; origTop = rect.top;
            prevTransition = element.style.transition; element.style.transition = 'none';
            prevUserSelect = document.body.style.userSelect; document.body.style.userSelect = 'none';
            document.addEventListener('mousemove', handleDrag); document.addEventListener('mouseup', stopDrag);
            e.preventDefault();
        }
        function handleDrag(e) {
            const dx = e.clientX - startX; const dy = e.clientY - startY;
            if (!isDragging && (Math.abs(dx) > 5 || Math.abs(dy) > 5)) isDragging = true;
            if (isDragging) {
                const newLeft = Math.min(Math.max(0, origLeft + dx), window.innerWidth - element.offsetWidth);
                const newTop = Math.min(Math.max(0, origTop + dy), window.innerHeight - element.offsetHeight);
                element.style.setProperty('left', `${newLeft}px`, 'important');
                element.style.setProperty('top', `${newTop}px`, 'important');
            }
        }
        function stopDrag(e) {
            document.removeEventListener('mousemove', handleDrag); document.removeEventListener('mouseup', stopDrag);
            if (isDragging) { Storage.update(d => { d.position = { x: parseInt(element.style.left), y: parseInt(element.style.top) }; }); isDragging = false; e.preventDefault(); e.stopPropagation(); }
            element.style.transition = prevTransition; document.body.style.userSelect = prevUserSelect;
        }
    }

    let _keyboardInstalled = false;
    function setupKeyboardShortcuts() {
        if (_keyboardInstalled) return; _keyboardInstalled = true;
        document.addEventListener('keydown', (e) => {
            if (e.key === "Escape") toggleMonitorVisibility(false);
        }, true);
    }

    const target_window = typeof unsafeWindow === "undefined" ? window : unsafeWindow;
    const originalFetch = target_window.fetch;

    function isConversationSendEndpoint(fetchUrl, method) {
        if (method !== "POST") return false;
        if (!fetchUrl) return false;
        try {
            const url = new URL(fetchUrl, window.location.origin);
            return url.pathname.endsWith("/conversation");
        } catch {
            return String(fetchUrl).endsWith("/conversation");
        }
    }

    target_window.fetch = new Proxy(originalFetch, {
        apply: async function (target, thisArg, args) {
            const [requestInfo, requestInit] = args;
            const fetchUrl = typeof requestInfo === "string" ? requestInfo : (requestInfo?.href || requestInfo?.url || "");
            const method = (requestInit?.method || requestInfo?.method || "GET").toUpperCase();
            let idempotencyKey = null; let bucketId = null; let variantId = null;
            try {
                if (isConversationSendEndpoint(fetchUrl, method)) {
                    const bodyText = requestInit?.body;
                    if (typeof bodyText === "string" && bodyText) {
                        const bodyObj = JSON.parse(bodyText);
                        variantId = bodyObj?.model || bodyObj?.model_slug || bodyObj?.selected_model;
                        bucketId = resolveBucketForModel(variantId);
                        idempotencyKey = buildIdempotencyKey(bodyObj);
                        if (bucketId) { registerDispatch(variantId, bucketId, idempotencyKey); cleanupExpired(); }
                    }
                }
            } catch (e) { console.warn("[monitor] dispatch parse failed:", e); }
            try {
                const response = await target.apply(thisArg, args);
                if (idempotencyKey) updateRequestStatus(idempotencyKey, response.ok ? "completed" : "failed");
                return response;
            } catch (err) { if (idempotencyKey) updateRequestStatus(idempotencyKey, "failed"); throw err; }
        }
    });

    function buildIdempotencyKey(bodyObj) {
        const convId = bodyObj?.conversation_id || bodyObj?.conversationId || "";
        const msgId = bodyObj?.message_id || bodyObj?.messageId || bodyObj?.messages?.[0]?.id || "";
        if (convId || msgId) return `${convId}-${msgId}`;
        return `anon-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
    }

    let _pendingInit = null;
    function scheduleInitialize(delay = 200) { if (_pendingInit) return; _pendingInit = setTimeout(() => { _pendingInit = null; initialize(); }, delay); }

    function initialize() {
        if (!document || !document.body) { scheduleInitialize(300); return; }
        usageData = Storage.get();
        currentLocale = computeLocale();
        cleanupExpired();
        createMonitorUI();
        setupKeyboardShortcuts();
        setupLocaleObserver();
    }

    if (document.readyState === "loading") target_window.addEventListener("DOMContentLoaded", () => scheduleInitialize(0)); else scheduleInitialize(0);
    const observer = new MutationObserver(() => {
        const monitor = document.getElementById("chatUsageMonitor");
        const isInline = !!(monitor && monitor.classList.contains("inline-mode"));
        const anchor = findModelSwitcherAnchor();
        const launcherPresent = !!(usageLauncher && document.contains(usageLauncher));
        if (!monitor || ((anchor || isInline) && !launcherPresent)) scheduleInitialize(300);
    });
    observer.observe(document.documentElement || document.body, { childList: true, subtree: true });
    window.addEventListener("popstate", () => scheduleInitialize(300));
    scheduleInitialize(300);

    function findModelSwitcherAnchor() {
        const modelLabelZh = "\u6a21\u578b";
        const selectors = [
            '[data-testid="model-switcher"]',
            '[data-testid="model-selector"]',
            'button[data-testid="model-switcher"]',
            'button[aria-label*="Model"]',
            `button[aria-label*="${modelLabelZh}"]`
        ];
        for (const sel of selectors) { const el = document.querySelector(sel); if (el) return el; }
        const fuzzy = Array.from(document.querySelectorAll('header button')).find(btn => (/GPT|ChatGPT|Model|\u6a21\u578b/i).test(btn.textContent || ''));
        return fuzzy || null;
    }
    console.log("[usage-monitor] ChatGPT Usage Monitor loaded");
})();
