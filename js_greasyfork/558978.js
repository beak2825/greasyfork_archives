// ==UserScript==
// @name         ChatGPT Usage Monitor
// @name:zh-CN   ChatGPT 使用情况监控
// @name:zh-TW   ChatGPT 使用狀態監控
// @name:ja      ChatGPT 使用状況モニター
// @namespace    https://github.com/yoyoithink/ChatGPT-Usage-monitor
// @version      1.5.0

// @description      ChatGPT Plus usage monitor with smart token learning, ROI analysis. Auto-learns your usage patterns with Bayesian-weighted averaging.
// @description:zh-CN  ChatGPT Plus 使用量监控，智能Token学习，ROI分析。使用贝叶斯加权平均自动学习您的使用模式。
// @description:zh-TW  ChatGPT Plus 使用量監控，智能Token學習，ROI分析。使用貝葉斯加權平均自動學習您的使用模式。
// @description:ja     ChatGPT Plus 使用量監視、スマートトークン学習、ROI分析。ベイズ加重平均で使用パターンを自動学習。

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

    // Critical: Hide usage trigger immediately to prevent flash on load
    // This runs at document-start, before any DOM is rendered
    GM_addStyle(`
      [data-usage-trigger="true"]:not([data-usage-ready="true"]) {
        opacity: 0 !important;
        visibility: hidden !important;
        display: none !important;
        background: transparent !important;
        border-color: transparent !important;
        box-shadow: none !important;
        pointer-events: none !important;
      }
      [data-usage-trigger="true"][data-usage-ready="true"] {
        opacity: 1 !important;
        visibility: visible !important;
        display: inline-flex !important;
        transition: opacity 150ms ease, visibility 0s !important;
      }
    `);

    const HEADER_GUARD_ATTR = "data-usage-header-guard";
    const HEADER_INSERT_GUARD_ATTR = "data-usage-header-insert-guard";
    const HEADER_GUARD_DARK_ATTR = "data-usage-prefers-dark";
    const HEADER_GUARD_MAX_MS = 3000;
    const HEADER_INSERT_GUARD_MS = 1200;

    function detectExpectedTheme() {
        try {
            const stored = localStorage.getItem("theme");
            if (stored === "dark" || stored === "light") return stored;
            if (stored === "system" || !stored) {
                const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
                return prefersDark ? "dark" : "light";
            }
        } catch {
            // ignore
        }
        return null;
    }

    GM_addStyle(`
      html[${HEADER_GUARD_ATTR}="true"] #page-header,
      html[${HEADER_GUARD_ATTR}="true"] [data-testid="page-header"],
      html[${HEADER_INSERT_GUARD_ATTR}="true"] #page-header,
      html[${HEADER_INSERT_GUARD_ATTR}="true"] [data-testid="page-header"] {
        opacity: 0 !important;
        visibility: hidden !important;
        pointer-events: none !important;
      }
      html[${HEADER_GUARD_ATTR}="true"][${HEADER_GUARD_DARK_ATTR}="true"],
      html[${HEADER_GUARD_ATTR}="true"][${HEADER_GUARD_DARK_ATTR}="true"] body,
      html[${HEADER_INSERT_GUARD_ATTR}="true"][${HEADER_GUARD_DARK_ATTR}="true"],
      html[${HEADER_INSERT_GUARD_ATTR}="true"][${HEADER_GUARD_DARK_ATTR}="true"] body {
        background-color: #212121 !important;
      }
    `);

    if (document?.documentElement) {
        document.documentElement.setAttribute(HEADER_GUARD_ATTR, "true");
        const expectedTheme = detectExpectedTheme();
        if (expectedTheme === "dark") {
            document.documentElement.setAttribute(HEADER_GUARD_DARK_ATTR, "true");
        }
    }

    const headerGuardStart = Date.now();
    let _headerInsertGuardTimer = null;
    function releaseHeaderGuard() {
        document.documentElement?.removeAttribute(HEADER_GUARD_ATTR);
    }
    function setHeaderInsertGuard() {
        const htmlEl = document.documentElement;
        if (!htmlEl) return;
        htmlEl.setAttribute(HEADER_INSERT_GUARD_ATTR, "true");
        if (_headerInsertGuardTimer) clearTimeout(_headerInsertGuardTimer);
        _headerInsertGuardTimer = setTimeout(() => clearHeaderInsertGuard(), HEADER_INSERT_GUARD_MS);
    }
    function clearHeaderInsertGuard() {
        if (_headerInsertGuardTimer) {
            clearTimeout(_headerInsertGuardTimer);
            _headerInsertGuardTimer = null;
        }
        document.documentElement?.removeAttribute(HEADER_INSERT_GUARD_ATTR);
    }

    function isHeaderGuardReady() {
        const htmlEl = document.documentElement;
        if (!htmlEl) return false;
        if (!hasChatGPTThemeTokens()) return false;
        const isDark = htmlEl.classList.contains("dark");
        const isLight = htmlEl.classList.contains("light");
        if (!isDark && !isLight) return false;

        const header = document.querySelector("#page-header, [data-testid=\"page-header\"]");
        if (!header) return false;

        if (!isDark) return true;

        const bg = getComputedStyle(header).backgroundColor || "";
        if (!bg || bg === "transparent" || bg === "rgba(0, 0, 0, 0)") return false;
        if (bg === "rgb(255, 255, 255)" || bg === "rgba(255, 255, 255, 1)") return false;
        return true;
    }

    function pumpHeaderGuard() {
        if (!document.documentElement) return;
        const elapsed = Date.now() - headerGuardStart;
        if (elapsed >= HEADER_GUARD_MAX_MS || isHeaderGuardReady()) {
            releaseHeaderGuard();
            return;
        }
        requestAnimationFrame(pumpHeaderGuard);
    }

    if (document.readyState === "loading") {
        requestAnimationFrame(pumpHeaderGuard);
        document.addEventListener("DOMContentLoaded", pumpHeaderGuard, { once: true });
    } else {
        pumpHeaderGuard();
    }

    // Theme tokens - Exact ChatGPT native colors with proper theme detection
    // ChatGPT uses html.light/html.dark classes to indicate theme
    GM_addStyle(`
      /* ===== Light Theme (Default) ===== */
      :root, html.light, html:not(.dark) {
        /* Main surfaces - ChatGPT's exact light mode colors */
        --usage-bg: #ffffff;
        --usage-surface: #f4f4f4;
        --usage-surface-hover: #ececec;
        --usage-surface-strong: #e3e3e3;

        /* Borders */
        --usage-border: rgba(0, 0, 0, 0.1);
        --usage-border-light: rgba(0, 0, 0, 0.05);
        --usage-border-heavy: rgba(0, 0, 0, 0.15);

        /* Text hierarchy - ChatGPT's exact text colors */
        --usage-text: #0d0d0d;
        --usage-subtle: #424242;
        --usage-muted: #6e6e6e;
        --usage-placeholder: #8e8e8e;

        /* Brand accent - ChatGPT green */
        --usage-accent: #10a37f;
        --usage-accent-hover: #0d8a6a;
        --usage-accent-light: rgba(16, 163, 127, 0.1);
        --usage-accent-gradient: linear-gradient(135deg, #10a37f 0%, #1a7f64 100%);

        /* Status colors */
        --usage-warning: #d97706;
        --usage-warning-light: rgba(217, 119, 6, 0.1);
        --usage-danger: #dc2626;
        --usage-danger-light: rgba(220, 38, 38, 0.1);
        --usage-success: #059669;
        --usage-success-light: rgba(5, 150, 105, 0.1);

        /* Shadows - Light mode */
        --usage-shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
        --usage-shadow: 0 4px 12px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.05);
        --usage-shadow-lg: 0 10px 40px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05);

        /* Effects */
        --usage-blur: blur(12px);
        --usage-transition-fast: 150ms ease;
        --usage-transition: 200ms ease;
        --usage-transition-slow: 300ms ease;

        /* Interactive states */
        --usage-btn-bg: #f4f4f4;
        --usage-btn-bg-hover: #ececec;
        --usage-btn-border: rgba(0, 0, 0, 0.1);
      }

      /* ===== Dark Theme ===== */
      html.dark {
        /* Main surfaces - ChatGPT's exact dark mode colors */
        --usage-bg: #212121;
        --usage-surface: #2f2f2f;
        --usage-surface-hover: #383838;
        --usage-surface-strong: #424242;

        /* Borders */
        --usage-border: rgba(255, 255, 255, 0.1);
        --usage-border-light: rgba(255, 255, 255, 0.05);
        --usage-border-heavy: rgba(255, 255, 255, 0.15);

        /* Text hierarchy - ChatGPT's exact dark mode text colors */
        --usage-text: #ececec;
        --usage-subtle: #b4b4b4;
        --usage-muted: #8e8e8e;
        --usage-placeholder: #6e6e6e;

        /* Brand accent - slightly brighter for dark mode */
        --usage-accent: #10a37f;
        --usage-accent-hover: #19c294;
        --usage-accent-light: rgba(16, 163, 127, 0.15);
        --usage-accent-gradient: linear-gradient(135deg, #10a37f 0%, #19c294 100%);

        /* Status colors - adjusted for dark mode */
        --usage-warning: #f59e0b;
        --usage-warning-light: rgba(245, 158, 11, 0.15);
        --usage-danger: #ef4444;
        --usage-danger-light: rgba(239, 68, 68, 0.15);
        --usage-success: #10b981;
        --usage-success-light: rgba(16, 185, 129, 0.15);

        /* Shadows - Dark mode */
        --usage-shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
        --usage-shadow: 0 4px 16px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05);
        --usage-shadow-lg: 0 12px 48px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05);

        /* Interactive states */
        --usage-btn-bg: #2f2f2f;
        --usage-btn-bg-hover: #383838;
        --usage-btn-border: rgba(255, 255, 255, 0.1);
      }

      /* System preference fallback when no explicit theme class */
      @media (prefers-color-scheme: dark) {
        html:not(.light):not(.dark) {
          --usage-bg: #212121;
          --usage-surface: #2f2f2f;
          --usage-surface-hover: #383838;
          --usage-surface-strong: #424242;
          --usage-border: rgba(255, 255, 255, 0.1);
          --usage-border-light: rgba(255, 255, 255, 0.05);
          --usage-border-heavy: rgba(255, 255, 255, 0.15);
          --usage-text: #ececec;
          --usage-subtle: #b4b4b4;
          --usage-muted: #8e8e8e;
          --usage-placeholder: #6e6e6e;
          --usage-accent: #10a37f;
          --usage-accent-hover: #19c294;
          --usage-accent-light: rgba(16, 163, 127, 0.15);
          --usage-accent-gradient: linear-gradient(135deg, #10a37f 0%, #19c294 100%);
          --usage-warning: #f59e0b;
          --usage-warning-light: rgba(245, 158, 11, 0.15);
          --usage-danger: #ef4444;
          --usage-danger-light: rgba(239, 68, 68, 0.15);
          --usage-shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
          --usage-shadow: 0 4px 16px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05);
          --usage-shadow-lg: 0 12px 48px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05);
          --usage-btn-bg: #2f2f2f;
          --usage-btn-bg-hover: #383838;
          --usage-btn-border: rgba(255, 255, 255, 0.1);
        }
      }
    `);

    const STYLE = {
        borderRadius: "16px",
        borderRadiusSm: "12px",
        borderRadiusXs: "8px",
        spacing: { xs: "4px", sm: "8px", md: "16px", lg: "24px" },
        textSize: { xs: "0.75rem", sm: "0.8125rem", md: "0.875rem", lg: "1rem" },
    };

    const COLORS = {
        primary: "var(--usage-accent)",
        primaryHover: "var(--usage-accent-hover)",
        primaryLight: "var(--usage-accent-light)",
        primaryGradient: "var(--usage-accent-gradient)",
        background: "var(--usage-bg)",
        surface: "var(--usage-surface)",
        surfaceHover: "var(--usage-surface-hover)",
        surfaceStrong: "var(--usage-surface-strong)",
        border: "var(--usage-border)",
        borderLight: "var(--usage-border-light)",
        borderHeavy: "var(--usage-border-heavy)",
        text: "var(--usage-text)",
        secondaryText: "var(--usage-subtle)",
        muted: "var(--usage-muted)",
        placeholder: "var(--usage-placeholder)",
        success: "var(--usage-success)",
        successLight: "var(--usage-success-light)",
        warning: "var(--usage-warning)",
        warningLight: "var(--usage-warning-light)",
        danger: "var(--usage-danger)",
        dangerLight: "var(--usage-danger-light)",
        btnBg: "var(--usage-btn-bg)",
        btnBgHover: "var(--usage-btn-bg-hover)",
        btnBorder: "var(--usage-btn-border)",
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
            "analytics.roi": "ROI Analysis",
            "analytics.estimatedValue": "Estimated Value",
            "analytics.subscriptionCost": "Subscription Cost",
            "analytics.roiPercent": "ROI",
            "analytics.worthIt": "Worth it!",
            "analytics.notYet": "Not yet",
            "analytics.breakEven": "Break-even",
            "analytics.valuePerRequest": "~${value}/req",
            "analytics.totalValue": "Total API Value",
            "analytics.savings": "Savings",
            "analytics.allTime": "All",
            "analytics.thisMonth": "This month",
            "analytics.estimated": "Estimated",
            "analytics.estimatedNote": "Based on typical token usage",
            "analytics.pricingBasis": "Token estimates",
            "analytics.defaultEstimates": "Default estimates",
            "analytics.tokenNote": "ChatGPT web doesn't expose token counts. Values are industry-typical estimates.",
            "analytics.plusAdvice": "💡 Plus break-even tip: Use 4o/5.x ≥65 times/day, or o3/o4-mini ≥15 times/day to get your money's worth.",
            "analytics.perRequest": "/req",
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
            "shortcut.hint": "Ctrl+U",
            "shortcut.hintMac": "⌘U",
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
            "analytics.roi": "回本分析",
            "analytics.estimatedValue": "估算价值",
            "analytics.subscriptionCost": "订阅费用",
            "analytics.roiPercent": "回报率",
            "analytics.worthIt": "已回本！",
            "analytics.notYet": "继续努力",
            "analytics.breakEven": "刚好持平",
            "analytics.valuePerRequest": "~${value}/次",
            "analytics.totalValue": "API等价价值",
            "analytics.savings": "节省金额",
            "analytics.allTime": "全部",
            "analytics.thisMonth": "本月",
            "analytics.estimated": "估算",
            "analytics.estimatedNote": "基于典型token用量",
            "analytics.pricingBasis": "Token估算",
            "analytics.defaultEstimates": "默认估算值",
            "analytics.tokenNote": "ChatGPT网页版不提供token数据，以下为行业典型估算值。",
            "analytics.plusAdvice": "💡 Plus回本建议：4o/5.x 每天使用 ≥65 次，或 o3/o4-mini 每天 ≥15 次，即可回本。",
            "analytics.perRequest": "/次",
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
            "shortcut.hint": "Ctrl+U",
            "shortcut.hintMac": "⌘U",
        },
        ja: {
            "button.usage": "使用量",
            "tab.usage": "使用量",
            "tab.analytics": "分析",
            "tab.debug": "デバッグ",
            "title.minimize": "最小化",
            "button.export": "エクスポート",
            "button.import": "インポート",
            "button.clear": "クリア",
            "confirm.clearData": "すべての使用データをクリアしますか？この操作は元に戻せません。",
            "button.language": "言語",
            "lang.auto": "自動（ChatGPTに従う）",
            "lang.en": "English",
            "lang.zh": "中文",
            "debug.showEvents": "デバッグイベントを表示",
            "debug.noEvents": "イベントなし",
            "debug.info.main": "Plusプランのみ。バケット単位でカウント。失敗/キャンセルもディスパッチ時にカウント。",
            "debug.info.sub": "タイムゾーン：{tz}。3時間バケットはローリング、日/週バケットはカレンダー。",
            "toast.positionReset": "位置をリセットしました",
            "toast.exported": "使用データをエクスポートしました",
            "toast.imported": "インポート成功",
            "toast.cleared": "使用データをクリアしました",
            "import.failed": "インポート失敗：{message}",
            "import.invalidFile": "無効なファイル",
            "import.missingBuckets": "バケットがありません",
            "usage.resetsIn": "リセットまで {timeLeft}",
            "usage.noCalls": "まだ呼び出しなし",
            "usage.last": "最終：{last}",
            "analytics.summary": "概要",
            "analytics.range": "{start} から {end}",
            "analytics.totalRequests": "総リクエスト数",
            "analytics.avgActive": "アクティブ日平均",
            "analytics.peakDay": "ピーク日",
            "analytics.activeModels": "アクティブモデル数",
            "analytics.topBucket": "最多バケット",
            "analytics.topModel": "最多モデル",
            "analytics.days": "{n}日間",
            "analytics.activeDays": "{n}アクティブ日",
            "analytics.requests": "{n}リクエスト",
            "analytics.distinctModels": "使用されたモデルバリアント",
            "analytics.dailyTrend": "日次トレンド",
            "analytics.byBucket": "バケット別",
            "analytics.dailyBreakdown": "日次内訳",
            "analytics.noData": "この期間のデータはまだありません。",
            "analytics.roi": "ROI分析",
            "analytics.estimatedValue": "推定価値",
            "analytics.subscriptionCost": "サブスクリプション費用",
            "analytics.roiPercent": "ROI",
            "analytics.worthIt": "元が取れました！",
            "analytics.notYet": "まだです",
            "analytics.breakEven": "損益分岐点",
            "analytics.valuePerRequest": "~${value}/リクエスト",
            "analytics.totalValue": "API換算価値",
            "analytics.savings": "節約額",
            "analytics.allTime": "全期間",
            "analytics.thisMonth": "今月",
            "analytics.estimated": "推定",
            "analytics.estimatedNote": "一般的なトークン使用量に基づく",
            "analytics.pricingBasis": "トークン推定",
            "analytics.defaultEstimates": "デフォルト推定値",
            "analytics.tokenNote": "ChatGPTウェブ版はトークン数を公開していません。以下は業界標準の推定値です。",
            "analytics.plusAdvice": "💡 Plus元取りのコツ：4o/5.xを1日65回以上、またはo3/o4-miniを1日15回以上使用すると元が取れます。",
            "analytics.perRequest": "/リクエスト",
            "table.date": "日付",
            "table.total": "合計",
            "table.auto": "5 Auto",
            "table.thinking": "5 Thinking",
            "table.mini": "5 Mini",
            "table.gpt4": "4.x",
            "table.o3": "o3",
            "table.o4mini": "o4-mini",
            "table.totalRow": "合計",
            "window.calendar": "カレンダー",
            "window.rolling": "ローリング",
            "unit.hourShort": "時間",
            "unit.dayShort": "日",
            "unit.weekShort": "週",
            "shortcut.hint": "Ctrl+U",
            "shortcut.hintMac": "⌘U",
        }
    };

    // Detect Mac for keyboard shortcuts
    const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);

    let currentLocale = "en";

    function normalizeLocaleTag(tag) {
        const lower = String(tag || "").toLowerCase();
        if (lower.startsWith("zh")) return "zh";
        if (lower.startsWith("ja")) return "ja";
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
    let _themeObserverInstalled = false;

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

    // Observe theme changes (ChatGPT uses html.light / html.dark classes)
    function setupThemeObserver() {
        if (_themeObserverInstalled) return;
        _themeObserverInstalled = true;
        try {
            const obs = new MutationObserver((mutations) => {
                for (const mutation of mutations) {
                    if (mutation.attributeName === 'class') {
                        // Theme class changed, trigger UI update for any dynamic colors
                        updateUI();
                        break;
                    }
                }
            });
            obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
        } catch {
            // ignore
        }
    }

    let _uploadTrackingInstalled = false;
    function setupUploadTracking() {
        if (_uploadTrackingInstalled) return;
        _uploadTrackingInstalled = true;
        document.addEventListener("change", handleFileInputChange, true);
        document.addEventListener("drop", handleFileDrop, true);
        document.addEventListener("paste", handleFilePaste, true);
    }

    function handleFileInputChange(e) {
        const target = e.target;
        if (!target || target.tagName !== "INPUT" || target.type !== "file") return;
        if (target.closest && target.closest("#chatUsageMonitor")) return;
        if (target.getAttribute && target.getAttribute("data-usage-ignore") === "true") return;
        const files = target.files;
        if (!files || files.length === 0) return;
        registerFileUploads(files, "input");
    }

    function handleFileDrop(e) {
        const target = e.target;
        if (target && target.closest && target.closest("#chatUsageMonitor")) return;
        const files = e.dataTransfer?.files;
        if (!files || files.length === 0) return;
        registerFileUploads(files, "drop");
    }

    function handleFilePaste(e) {
        const target = e.target;
        if (target && target.closest && target.closest("#chatUsageMonitor")) return;
        const files = e.clipboardData?.files;
        if (!files || files.length === 0) return;
        registerFileUploads(files, "paste");
    }

    // Bucket definitions (Plus only)
    const UPLOAD_BUCKET_ID = "file_upload";
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

    BUCKET_CONFIG[UPLOAD_BUCKET_ID] = {
        name: "File uploads",
        limit: 80,
        window: { type: "rolling", size: 3, unit: "hour" },
        tooltip: "Rolling 3h limit across all file types (images, docs, etc.)."
    };

    const BUCKET_ORDER = [
        "gpt5_auto",
        "gpt5_thinking",
        "thinking_mini",
        "gpt4",
        "o3",
        "o4mini"
    ];

    BUCKET_ORDER.push(UPLOAD_BUCKET_ID);
    const ANALYTICS_BUCKET_ORDER = BUCKET_ORDER.filter(id => id !== UPLOAD_BUCKET_ID);

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

    // Model pricing configuration - Token-based pricing (OpenAI API rates)
    // All prices in USD per 1 million tokens
    // Token estimates are based on typical ChatGPT conversation patterns
    // Last updated: 2025-01 (OpenAI API pricing)
    const PRICING_VERSION = "2025-01";
    const MODEL_PRICING = {
        gpt5_auto: {
            name: "GPT-5.x Auto",
            inputPricePerMillion: 2.50,
            outputPricePerMillion: 10.00,
            defaultInputTokens: 1200,
            defaultOutputTokens: 800,
        },
        gpt5_thinking: {
            name: "GPT-5.x Thinking",
            inputPricePerMillion: 15.00,
            outputPricePerMillion: 60.00,
            defaultInputTokens: 1500,
            defaultOutputTokens: 2500,
        },
        thinking_mini: {
            name: "GPT-5.x Thinking Mini",
            inputPricePerMillion: 3.00,
            outputPricePerMillion: 12.00,
            defaultInputTokens: 1200,
            defaultOutputTokens: 1800,
        },
        gpt4: {
            name: "GPT-4.x",
            inputPricePerMillion: 2.50,
            outputPricePerMillion: 10.00,
            defaultInputTokens: 1000,
            defaultOutputTokens: 600,
        },
        o3: {
            name: "o3",
            inputPricePerMillion: 10.00,
            outputPricePerMillion: 40.00,
            defaultInputTokens: 1500,
            defaultOutputTokens: 4000,
        },
        o4mini: {
            name: "o4-mini",
            inputPricePerMillion: 1.10,
            outputPricePerMillion: 4.40,
            defaultInputTokens: 1200,
            defaultOutputTokens: 1200,
        },
    };

    // Subscription cost for ROI calculation
    const SUBSCRIPTION_COST_MONTHLY = 20; // USD

    /**
     * Calculate estimated value per request for a bucket
     */
    function getEstimatedValuePerRequest(bucketId) {
        const pricing = MODEL_PRICING[bucketId];
        if (!pricing) return 0;
        const inputCost = (pricing.defaultInputTokens / 1_000_000) * pricing.inputPricePerMillion;
        const outputCost = (pricing.defaultOutputTokens / 1_000_000) * pricing.outputPricePerMillion;
        return inputCost + outputCost;
    }

    /**
     * Get detailed token breakdown for a bucket with cost calculation
     */
    function getTokenBreakdown(bucketId, count) {
        const pricing = MODEL_PRICING[bucketId];
        if (!pricing) return { inputTokens: 0, outputTokens: 0, inputCost: 0, outputCost: 0, totalCost: 0 };
        const inputTokens = pricing.defaultInputTokens * count;
        const outputTokens = pricing.defaultOutputTokens * count;
        const inputCost = (inputTokens / 1_000_000) * pricing.inputPricePerMillion;
        const outputCost = (outputTokens / 1_000_000) * pricing.outputPricePerMillion;
        return { inputTokens, outputTokens, inputCost, outputCost, totalCost: inputCost + outputCost };
    }

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
    const HISTORY_RETENTION_DAYS = 730; // Extended to 2 years for comprehensive analysis

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
            data.tokenStats = data.tokenStats || {};  // Ensure tokenStats exists
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

    const FILE_UPLOAD_DEDUP_MS = 10000;
    const recentFileUploads = new Map();

    function fileUploadFingerprint(file) {
        if (!file) return "";
        const name = file.name || "";
        const size = Number.isFinite(file.size) ? file.size : 0;
        const lastModified = Number.isFinite(file.lastModified) ? file.lastModified : 0;
        const path = file.webkitRelativePath || "";
        return `${name}|${size}|${lastModified}|${path}`;
    }

    function pruneRecentFileUploads(now = Date.now()) {
        for (const [fp, ts] of recentFileUploads.entries()) {
            if (now - ts > FILE_UPLOAD_DEDUP_MS) recentFileUploads.delete(fp);
        }
    }

    function registerFileUploads(fileList, source = "input") {
        if (!fileList || typeof fileList.length !== "number") return;
        if (!usageData) usageData = Storage.get();
        const bucket = usageData.buckets?.[UPLOAD_BUCKET_ID];
        if (!bucket) return;
        if (!Array.isArray(bucket.requests)) bucket.requests = [];
        const now = Date.now();
        let added = 0;
        for (const file of Array.from(fileList)) {
            const fp = fileUploadFingerprint(file);
            if (!fp) continue;
            const lastSeen = recentFileUploads.get(fp);
            if (lastSeen && now - lastSeen <= FILE_UPLOAD_DEDUP_MS) continue;
            recentFileUploads.set(fp, now);

            bucket.requests.push({
                t: now,
                status: "uploaded",
                variant: UPLOAD_BUCKET_ID,
                fileName: String(file.name || ""),
                fileSize: Number.isFinite(file.size) ? file.size : 0,
                fileType: String(file.type || ""),
                filePath: String(file.webkitRelativePath || file.name || ""),
                source
            });
            added += 1;
        }
        pruneRecentFileUploads(now);
        if (added > 0) {
            recordEvent("file_upload", `${added} file${added === 1 ? "" : "s"} (${source})`);
            Storage.set(usageData);
            cleanupExpired();
            updateUsageLauncher();
            updateUI();
        }
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
        // Periodically clean up recentFileUploads Map to prevent memory leaks
        pruneRecentFileUploads();
        Storage.set(usageData);
    }
    // UI styles - ChatGPT-native design system
    GM_addStyle(`
      /* Keyframes for animations */
      @keyframes usage-fade-in {
        from { opacity: 0; transform: translateY(-8px) scale(0.98); }
        to { opacity: 1; transform: translateY(0) scale(1); }
      }
      @keyframes usage-fade-out {
        from { opacity: 1; transform: translateY(0) scale(1); }
        to { opacity: 0; transform: translateY(-8px) scale(0.98); }
      }
      @keyframes usage-pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.7; }
      }
      @keyframes usage-shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }
      @keyframes usage-progress-glow {
        0%, 100% { box-shadow: 0 0 4px var(--usage-accent); }
        50% { box-shadow: 0 0 8px var(--usage-accent), 0 0 12px var(--usage-accent); }
      }

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
        font-family: "Söhne", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Ubuntu, Cantarell, "Noto Sans", sans-serif;
        font-size: 14px;
        line-height: 1.5;
        letter-spacing: -0.003em;
        border-radius: ${STYLE.borderRadius};
        box-shadow: var(--usage-shadow-lg);
        z-index: 9999;
        border: 1px solid var(--usage-border);
        user-select: none;
        resize: both;
        transition: box-shadow var(--usage-transition), opacity var(--usage-transition), background-color var(--usage-transition), transform var(--usage-transition);
        transform-origin: top left;
      }
      #chatUsageMonitor.hidden { display: none !important; }
      #chatUsageMonitor.minimized {
        width: auto !important;
        min-width: 48px;
        height: 40px !important;
        padding: 0 14px;
        border-radius: 9999px;
        overflow: visible;
        resize: none;
        cursor: pointer;
        background: var(--usage-surface);
        border: 1px solid var(--usage-border);
        box-shadow: var(--usage-shadow);
        bottom: auto;
        top: 100px;
        left: ${STYLE.spacing.lg};
        transition: all var(--usage-transition);
      }
      #chatUsageMonitor.minimized:hover {
        background: var(--usage-surface-hover);
        box-shadow: var(--usage-shadow-lg);
      }
      #chatUsageMonitor.minimized > * { display: none !important; }
      #chatUsageMonitor.minimized::before {
        content: attr(data-label);
        color: var(--usage-subtle);
        position: absolute; inset: 0;
        display: flex; align-items: center; justify-content: center;
        font-size: 13px; font-weight: 500;
        letter-spacing: 0;
      }
      #chatUsageMonitor header {
        padding: 10px 14px;
        display: flex;
        border-radius: ${STYLE.borderRadius} ${STYLE.borderRadius} 0 0;
        background: var(--usage-bg);
        align-items: center;
        height: 52px;
        cursor: move;
        border-bottom: 1px solid var(--usage-border-light);
        gap: 2px;
      }
      #chatUsageMonitor .minimize-btn {
        margin-right: 10px;
        width: 32px;
        height: 32px;
        display: grid;
        place-items: center;
        border-radius: ${STYLE.borderRadiusXs};
        color: var(--usage-muted);
        cursor: pointer;
        font-size: 20px;
        font-weight: 400;
        transition: all var(--usage-transition-fast);
        flex-shrink: 0;
      }
      #chatUsageMonitor .minimize-btn:hover {
        color: var(--usage-text);
        background: var(--usage-surface);
      }
      #chatUsageMonitor .minimize-btn:active {
        background: var(--usage-surface-strong);
      }
      /* Tab buttons - ChatGPT native style */
      #chatUsageMonitor header button {
        border: none;
        background: transparent;
        color: var(--usage-muted);
        cursor: pointer;
        font-weight: 500;
        padding: 8px 14px;
        font-size: 14px;
        border-radius: ${STYLE.borderRadiusXs};
        transition: all var(--usage-transition-fast);
        position: relative;
      }
      #chatUsageMonitor header button::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%) scaleX(0);
        width: calc(100% - 12px);
        height: 2px;
        background: var(--usage-accent);
        border-radius: 1px;
        transition: transform var(--usage-transition-fast);
      }
      #chatUsageMonitor header button.active {
        color: var(--usage-text);
        font-weight: 600;
      }
      #chatUsageMonitor header button.active::after {
        transform: translateX(-50%) scaleX(1);
      }
      #chatUsageMonitor header button:hover:not(.active) {
        color: var(--usage-subtle);
        background: var(--usage-surface);
      }
      #chatUsageMonitor .content {
        padding: 14px 16px 20px 16px;
        overflow-y: auto;
        max-height: calc(520px - 52px);
        scrollbar-width: thin;
        scrollbar-color: var(--usage-surface-strong) transparent;
      }
      #chatUsageMonitor .content::-webkit-scrollbar {
        width: 6px;
      }
      #chatUsageMonitor .content::-webkit-scrollbar-track {
        background: transparent;
      }
      #chatUsageMonitor .content::-webkit-scrollbar-thumb {
        background: var(--usage-surface-strong);
        border-radius: 3px;
      }
      #chatUsageMonitor .content::-webkit-scrollbar-thumb:hover {
        background: var(--usage-muted);
      }
      /* Bucket rows - ChatGPT card style */
      #chatUsageMonitor .bucket-row {
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 6px;
        align-items: center;
        padding: 14px 16px;
        border: 1px solid var(--usage-border-light);
        border-radius: ${STYLE.borderRadiusSm};
        background: var(--usage-surface);
        margin-bottom: 10px;
        transition: all var(--usage-transition-fast);
        position: relative;
        overflow: hidden;
      }
      #chatUsageMonitor .bucket-row:hover {
        border-color: var(--usage-border);
        background: var(--usage-surface-hover);
      }
      #chatUsageMonitor .bucket-title {
        font-weight: 600;
        color: var(--usage-text);
        font-size: 14px;
        line-height: 1.4;
      }
      #chatUsageMonitor .bucket-sub {
        color: var(--usage-muted);
        font-size: 12px;
      }
      /* Progress bar - ChatGPT style */
      #chatUsageMonitor .progress {
        grid-column: 1 / span 2;
        height: 4px;
        border-radius: 999px;
        background: var(--usage-surface-strong);
        overflow: hidden;
        margin-top: 4px;
      }
      #chatUsageMonitor .progress-fill {
        height: 100%;
        background: var(--usage-accent);
        width: 0%;
        transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        border-radius: 999px;
      }
      #chatUsageMonitor .progress-fill.warn {
        background: var(--usage-warning);
      }
      #chatUsageMonitor .progress-fill.danger {
        background: var(--usage-danger);
      }
      #chatUsageMonitor .stat-line {
        display: flex;
        justify-content: space-between;
        font-size: 11px;
        color: var(--usage-muted);
        margin-top: 6px;
        grid-column: 1 / span 2;
      }
      /* Action buttons - ChatGPT native style */
      #chatUsageMonitor .actions {
        display: flex;
        gap: 8px;
        margin: 16px 0 8px 0;
        flex-wrap: wrap;
      }
      #chatUsageMonitor .btn {
        padding: 8px 14px;
        border-radius: ${STYLE.borderRadiusXs};
        border: 1px solid var(--usage-btn-border);
        background: var(--usage-btn-bg);
        color: var(--usage-text);
        cursor: pointer;
        font-weight: 500;
        font-size: 13px;
        transition: all var(--usage-transition-fast);
        display: inline-flex;
        align-items: center;
        gap: 6px;
      }
      #chatUsageMonitor .btn:hover {
        background: var(--usage-btn-bg-hover);
      }
      #chatUsageMonitor .btn:active {
        background: var(--usage-surface-strong);
      }
      #chatUsageMonitor .btn.danger {
        color: var(--usage-danger);
        background: var(--usage-danger-light);
        border-color: transparent;
      }
      #chatUsageMonitor .btn.danger:hover {
        background: var(--usage-danger);
        color: #ffffff;
      }
      /* Debug panel */
      #chatUsageMonitor .debug-list {
        background: var(--usage-surface);
        border: 1px solid var(--usage-border-light);
        border-radius: ${STYLE.borderRadiusSm};
        padding: 12px;
        max-height: 240px;
        overflow: auto;
        font-size: 12px;
        font-family: "Söhne Mono", ui-monospace, "SF Mono", "Cascadia Code", monospace;
      }
      #chatUsageMonitor .debug-item {
        display: grid;
        grid-template-columns: auto 1fr;
        gap: 8px;
        padding: 6px 0;
        border-bottom: 1px solid var(--usage-border-light);
        transition: background var(--usage-transition-fast);
      }
      #chatUsageMonitor .debug-item:hover {
        background: var(--usage-surface-hover);
        margin: 0 -12px;
        padding-left: 12px;
        padding-right: 12px;
      }
      #chatUsageMonitor .debug-item:last-child { border-bottom: none; }
      #chatUsageMonitor .debug-type {
        font-weight: 600;
        color: var(--usage-accent);
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      #chatUsageMonitor .debug-detail { color: var(--usage-muted); word-break: break-all; }

      /* Analytics toolbar */
      #chatUsageMonitor .analytics-toolbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        margin: 4px 0 16px 0;
        flex-wrap: wrap;
      }
      /* Segmented control - ChatGPT native style */
      #chatUsageMonitor .segmented {
        display: inline-flex;
        padding: 4px;
        border: 1px solid var(--usage-border-light);
        background: var(--usage-surface);
        border-radius: ${STYLE.borderRadiusXs};
        gap: 2px;
      }
      #chatUsageMonitor .segmented button {
        border: none;
        background: transparent;
        color: var(--usage-muted);
        padding: 6px 12px;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 500;
        font-size: 12px;
        transition: all var(--usage-transition-fast);
      }
      #chatUsageMonitor .segmented button.active {
        background: var(--usage-bg);
        color: var(--usage-text);
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
      }
      #chatUsageMonitor .segmented button:hover:not(.active) {
        color: var(--usage-subtle);
        background: var(--usage-surface-hover);
      }
      /* Analytics cards */
      #chatUsageMonitor .analytics-cards {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 10px;
        margin-bottom: 16px;
      }
      #chatUsageMonitor .analytics-card {
        background: var(--usage-surface);
        border: 1px solid var(--usage-border-light);
        border-radius: ${STYLE.borderRadiusSm};
        padding: 14px 16px;
        transition: all var(--usage-transition-fast);
      }
      #chatUsageMonitor .analytics-card:hover {
        border-color: var(--usage-border);
      }
      #chatUsageMonitor .analytics-card-title {
        font-size: 11px;
        color: var(--usage-muted);
        text-transform: uppercase;
        letter-spacing: 0.5px;
        font-weight: 500;
      }
      #chatUsageMonitor .analytics-card-value {
        margin-top: 6px;
        font-size: 18px;
        font-weight: 600;
        color: var(--usage-text);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        letter-spacing: -0.02em;
      }
      #chatUsageMonitor .analytics-card-sub {
        margin-top: 4px;
        font-size: 11px;
        color: var(--usage-muted);
      }
      #chatUsageMonitor .analytics-section-title {
        font-size: 12px;
        font-weight: 500;
        color: var(--usage-subtle);
        margin: 14px 0 8px 0;
      }
      /* Analytics bars chart */
      #chatUsageMonitor .analytics-bars {
        display: flex;
        flex-direction: column;
        gap: 8px;
        background: var(--usage-surface);
        border: 1px solid var(--usage-border-light);
        border-radius: ${STYLE.borderRadiusSm};
        padding: 14px;
      }
      #chatUsageMonitor .analytics-bars-row {
        display: flex;
        position: relative;
        align-items: flex-end;
        gap: 4px;
        height: 100px;
      }
      #chatUsageMonitor .analytics-avg-line {
        position: absolute;
        left: 0;
        right: 0;
        border-top: 2px dashed var(--usage-accent);
        opacity: 0.4;
        pointer-events: none;
      }
      #chatUsageMonitor .analytics-bar {
        flex: 1 1 0;
        height: 100%;
        background: var(--usage-surface-strong);
        border-radius: 4px;
        position: relative;
        overflow: hidden;
        transition: all var(--usage-transition-fast);
      }
      #chatUsageMonitor .analytics-bar:hover {
        background: var(--usage-surface-hover);
      }
      #chatUsageMonitor .analytics-bar-fill {
        position: absolute;
        inset: auto 0 0 0;
        background: var(--usage-accent);
        height: 0%;
        transition: height 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        border-radius: 4px;
      }
      #chatUsageMonitor .analytics-bar[data-today="true"] {
        outline: 2px solid var(--usage-accent);
        outline-offset: 1px;
      }
      #chatUsageMonitor .analytics-bar-labels {
        display: flex;
        gap: 4px;
        font-size: 10px;
        color: var(--usage-muted);
      }
      #chatUsageMonitor .analytics-bar-label {
        flex: 1 1 0;
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      /* Distribution section */
      #chatUsageMonitor .analytics-dist {
        margin-top: 12px;
        background: var(--usage-surface);
        border: 1px solid var(--usage-border-light);
        border-radius: ${STYLE.borderRadiusSm};
        padding: 12px 16px;
      }
      #chatUsageMonitor .analytics-dist-row {
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 8px;
        align-items: center;
        padding: 8px 0;
      }
      #chatUsageMonitor .analytics-dist-row + .analytics-dist-row {
        border-top: 1px solid var(--usage-border-light);
      }
      #chatUsageMonitor .analytics-dist-name {
        font-size: 13px;
        color: var(--usage-text);
        font-weight: 500;
      }
      #chatUsageMonitor .analytics-dist-count {
        font-size: 13px;
        color: var(--usage-subtle);
        font-weight: 600;
        font-variant-numeric: tabular-nums;
      }
      #chatUsageMonitor .analytics-dist-bar {
        grid-column: 1 / span 2;
        height: 4px;
        background: var(--usage-surface-strong);
        border-radius: 999px;
        overflow: hidden;
      }
      #chatUsageMonitor .analytics-dist-bar-fill {
        height: 100%;
        width: 0%;
        background: var(--usage-accent);
        transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        border-radius: 999px;
      }
      /* Table styles */
      #chatUsageMonitor .analytics-table-wrap {
        margin-top: 12px;
        background: var(--usage-surface);
        border: 1px solid var(--usage-border-light);
        border-radius: ${STYLE.borderRadiusSm};
        overflow: auto;
      }
      #chatUsageMonitor table.analytics-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 12px;
        min-width: 560px;
      }
      #chatUsageMonitor table.analytics-table th,
      #chatUsageMonitor table.analytics-table td {
        padding: 10px 12px;
        border-bottom: 1px solid var(--usage-border-light);
        text-align: left;
        white-space: nowrap;
        font-variant-numeric: tabular-nums;
      }
      #chatUsageMonitor table.analytics-table th {
        position: sticky;
        top: 0;
        background: var(--usage-bg);
        color: var(--usage-subtle);
        font-weight: 500;
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 0.3px;
      }
      #chatUsageMonitor table.analytics-table tr:last-child td { border-bottom: none; }
      #chatUsageMonitor table.analytics-table tr:hover td {
        background: var(--usage-surface-hover);
      }
      #chatUsageMonitor table.analytics-table tfoot td {
        font-weight: 600;
        background: var(--usage-surface);
      }
      .usage-monitor-portal {
        display: flex;
        align-items: center;
        gap: 8px;
        position: relative;
        min-height: 40px;
      }
      /* Inline mode (popover) */
      #chatUsageMonitor.inline-mode {
        position: fixed;
        top: 0;
        left: 0;
        right: auto;
        bottom: auto;
        width: 420px;
        height: auto;
        max-height: 75vh;
        resize: none;
        padding-top: 4px;
        background: var(--usage-bg);
        border: 1px solid var(--usage-border);
        box-shadow: var(--usage-shadow-lg);
        z-index: 10000;
        opacity: 0;
        transform: translateY(-8px) scale(0.98);
        pointer-events: none;
        visibility: hidden;
        transition: opacity var(--usage-transition), transform var(--usage-transition), visibility var(--usage-transition);
      }
      #chatUsageMonitor.inline-mode.open {
        opacity: 1;
        transform: translateY(0) scale(1);
        pointer-events: auto;
        visibility: visible;
        animation: usage-fade-in var(--usage-transition) ease-out;
      }
      #chatUsageMonitor.inline-mode header { cursor: default; }
      #chatUsageMonitor.inline-mode .minimize-btn { display: none; }
      #chatUsageMonitor.inline-mode .content { max-height: 65vh; }

      /* Trigger button styles - Native ChatGPT appearance */
      .usage-trigger {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 10px 14px;
        border-radius: 9999px;
        border: 1px solid var(--usage-border-light);
        background: var(--usage-btn-bg);
        color: var(--usage-text);
        cursor: pointer;
        box-shadow: none;
        font-weight: 500;
        font-size: 14px;
        transition: all var(--usage-transition-fast);
        height: 40px;
      }
      .usage-trigger:hover {
        background: var(--usage-btn-bg-hover);
      }
      .usage-trigger:active {
        background: var(--usage-surface-strong);
      }
      .usage-trigger__label { font-size: 14px; }
      .usage-trigger__plan { font-size: 12px; color: var(--usage-muted); letter-spacing: 0.3px; }
      .usage-trigger__value { font-size: 14px; color: var(--usage-text); }
      .usage-trigger__meter {
        position: relative;
        width: 72px;
        height: 4px;
        background: var(--usage-surface-strong);
        border-radius: 999px;
        overflow: hidden;
      }
      .usage-trigger__fill {
        position: absolute;
        inset: 0 auto 0 0;
        width: 0%;
        background: var(--usage-accent);
        transition: width var(--usage-transition-slow);
        border-radius: 999px;
      }
      .usage-trigger.is-warning .usage-trigger__fill {
        background: var(--usage-warning);
      }
      .usage-trigger:focus-visible {
        outline: 2px solid var(--usage-accent);
        outline-offset: 2px;
      }
      /* Usage trigger ready state - opacity handled by early-injected CSS */
      [data-usage-trigger="true"][data-usage-ready="false"] {
        pointer-events: none;
      }
      [data-usage-trigger="true"] [data-usage-label="true"],
      [data-usage-trigger="true"][data-usage-label="true"] {
        color: var(--usage-subtle) !important;
      }

      /* Keyboard shortcut hint - ChatGPT style */
      .usage-kbd-hint {
        font-size: 11px;
        color: var(--usage-muted);
        padding: 3px 8px;
        background: var(--usage-surface);
        border: 1px solid var(--usage-border-light);
        border-radius: 6px;
        font-family: "Söhne Mono", ui-monospace, monospace;
        margin-left: auto;
      }

      /* Responsive adjustments */
      @media (max-width: 768px) {
        #chatUsageMonitor {
          width: calc(100vw - 32px) !important;
          max-width: 420px;
          left: 16px !important;
          right: 16px !important;
        }
        #chatUsageMonitor.inline-mode {
          width: calc(100vw - 24px) !important;
          max-width: 400px;
        }
        #chatUsageMonitor .analytics-cards {
          grid-template-columns: 1fr;
        }
      }

      /* Toast notification - ChatGPT native style */
      #chatUsageMonitor .toast {
        font-family: "Söhne", ui-sans-serif, system-ui, sans-serif;
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

    /**
     * Validate imported data structure
     * @param {object} data - The data to validate
     * @returns {{valid: boolean, error?: string}} Validation result
     */
    function validateImportData(data) {
        if (!data || typeof data !== "object") {
            return { valid: false, error: t("import.invalidFile") };
        }
        if (!data.buckets || typeof data.buckets !== "object") {
            return { valid: false, error: t("import.missingBuckets") };
        }
        // Validate bucket structure
        for (const [bucketId, bucket] of Object.entries(data.buckets)) {
            if (!bucket || typeof bucket !== "object") {
                return { valid: false, error: `Invalid bucket: ${bucketId}` };
            }
            if (bucket.requests !== undefined && !Array.isArray(bucket.requests)) {
                return { valid: false, error: `Invalid requests in bucket: ${bucketId}` };
            }
            // Validate each request has required fields
            if (Array.isArray(bucket.requests)) {
                for (const req of bucket.requests) {
                    if (typeof req !== "object" && typeof req !== "number") {
                        return { valid: false, error: `Invalid request format in bucket: ${bucketId}` };
                    }
                    const ts = tsOf(req);
                    if (!Number.isFinite(ts)) {
                        return { valid: false, error: `Invalid timestamp in bucket: ${bucketId}` };
                    }
                }
            }
        }
        return { valid: true };
    }

    function importUsageData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.setAttribute("data-usage-ignore", "true");
        input.accept = 'application/json';
        input.style.display = 'none';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (evt) => {
                try {
                    const parsed = JSON.parse(evt.target.result);
                    const validation = validateImportData(parsed);
                    if (!validation.valid) {
                        throw new Error(validation.error);
                    }
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
            // ChatGPT uses html.light or html.dark class for theme
            const htmlEl = document.documentElement;
            const hasThemeClass = htmlEl.classList.contains('light') || htmlEl.classList.contains('dark');
            if (hasThemeClass) return true;

            // Fallback: check for ChatGPT CSS custom properties
            const cs = getComputedStyle(htmlEl);
            const v =
                cs.getPropertyValue("--text-primary") ||
                cs.getPropertyValue("--main-surface-primary") ||
                cs.getPropertyValue("--token-text-primary");
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
            setHeaderInsertGuard();
            document.body.appendChild(container);

            // Delay entire button creation until page is stable to prevent white flash
            // The white flash happens because the cloned button briefly shows before our styles apply
            setTimeout(() => {
                if (document.querySelector('[data-usage-trigger="true"]')) return; // Already created
                const currentAnchor = findModelSwitcherAnchor();
                if (!currentAnchor) return;

                usageLauncher = createUsageLauncherButton(currentAnchor);
                usageLauncher.style.setProperty('margin-left', '6px', 'important');
                usagePortal = usageLauncher;

                // Insert into DOM while still hidden
                ensureUsageLauncherPlacement(currentAnchor);

                // Reveal after another delay to ensure paint is complete
                setTimeout(() => {
                    markUsageLauncherReady();
                }, 100);
            }, 300);
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
        const margin = 12;
        const minGap = 8;

        // Find the main content area to avoid overlapping sidebar
        let minLeft = margin;
        let maxRight = window.innerWidth - margin;

        try {
            const main = document.querySelector("main, [role=\"main\"], .flex-1");
            const mainRect = main?.getBoundingClientRect?.();
            if (mainRect && Number.isFinite(mainRect.left) && mainRect.left > 0 && mainRect.left < window.innerWidth - 220) {
                minLeft = Math.max(minLeft, Math.floor(mainRect.left) + margin);
            }
            if (mainRect && Number.isFinite(mainRect.right) && mainRect.right > 220) {
                maxRight = Math.min(maxRight, Math.floor(mainRect.right) - margin);
            }
        } catch {
            // ignore
        }

        // Calculate optimal width
        const availableWidth = maxRight - minLeft;
        let desiredWidth = Math.min(420, Math.max(320, availableWidth - margin * 2));

        // Position horizontally - try to align with the trigger button
        let left;
        const triggerCenter = rect.left + rect.width / 2;

        // Try to center under the trigger if possible
        const centeredLeft = triggerCenter - desiredWidth / 2;

        if (centeredLeft >= minLeft && centeredLeft + desiredWidth <= maxRight) {
            left = centeredLeft;
        } else if (rect.right - desiredWidth >= minLeft) {
            // Align right edge with trigger right
            left = rect.right - desiredWidth;
        } else if (rect.left + desiredWidth <= maxRight) {
            // Align left edge with trigger left
            left = rect.left;
        } else {
            // Fallback: fit in available space
            left = Math.max(minLeft, Math.min(maxRight - desiredWidth, rect.left));
        }

        // Ensure within bounds
        left = Math.max(minLeft, Math.min(left, maxRight - desiredWidth));

        monitor.style.position = 'fixed';
        monitor.style.left = `${left}px`;
        monitor.style.right = 'auto';
        monitor.style.width = `${desiredWidth}px`;
        monitor.style.height = 'auto';

        // Position vertically
        const belowSpace = window.innerHeight - rect.bottom - margin;
        const aboveSpace = rect.top - margin;
        const preferBelow = belowSpace >= 320 || belowSpace >= aboveSpace;
        const maxPanelHeight = Math.min(600, window.innerHeight * 0.75);

        if (preferBelow) {
            const gap = minGap;
            monitor.style.top = `${rect.bottom + gap}px`;
            monitor.style.bottom = 'auto';
            monitor.style.maxHeight = `${Math.min(Math.max(200, belowSpace - gap), maxPanelHeight)}px`;
        } else {
            const gap = minGap;
            monitor.style.bottom = `${window.innerHeight - rect.top + gap}px`;
            monitor.style.top = 'auto';
            monitor.style.maxHeight = `${Math.min(Math.max(200, aboveSpace - gap), maxPanelHeight)}px`;
        }

        // Add a subtle arrow indicator pointing to the trigger
        const existingArrow = monitor.querySelector('.usage-popover-arrow');
        if (existingArrow) existingArrow.remove();
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
            btn.setAttribute('title', `${usageLabel} (${isMac ? '⌘U' : 'Ctrl+U'})`);

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

            // Remove any dropdown chevron SVG from the cloned button
            const chevrons = btn.querySelectorAll('svg');
            chevrons.forEach(svg => {
                // Keep only if it looks like a chart/stats icon, remove dropdown arrows
                const pathD = svg.querySelector('path')?.getAttribute('d') || '';
                if (pathD.includes('M6') || pathD.includes('m6') || pathD.toLowerCase().includes('chevron')) {
                    svg.remove();
                }
            });

            // Set aggressive hiding styles inline to prevent flash before CSS loads
            // Use setProperty to ensure !important works and styles persist
            btn.style.setProperty('display', 'none', 'important');
            btn.style.setProperty('opacity', '0', 'important');
            btn.style.setProperty('visibility', 'hidden', 'important');
            btn.style.setProperty('background', 'transparent', 'important');
            btn.style.setProperty('border-color', 'transparent', 'important');
            btn.style.setProperty('box-shadow', 'none', 'important');
            btn.style.setProperty('color', 'transparent', 'important');
            btn.style.setProperty('pointer-events', 'none', 'important');
            btn.addEventListener("click", (e) => { e.stopPropagation(); e.preventDefault(); toggleMonitorVisibility(); });
            return btn;
        }

        // Fallback (rare): styled pill button matching ChatGPT's aesthetic
        const fallback = document.createElement("button");
        fallback.type = "button";
        fallback.className = "usage-trigger";
        // Set aggressive hiding styles inline to prevent flash before CSS loads
        fallback.style.setProperty('display', 'none', 'important');
        fallback.style.setProperty('opacity', '0', 'important');
        fallback.style.setProperty('visibility', 'hidden', 'important');
        fallback.style.setProperty('background', 'transparent', 'important');
        fallback.style.setProperty('border-color', 'transparent', 'important');
        fallback.style.setProperty('box-shadow', 'none', 'important');
        fallback.style.setProperty('color', 'transparent', 'important');
        fallback.style.setProperty('pointer-events', 'none', 'important');
        fallback.setAttribute("aria-label", usageLabel);
        fallback.setAttribute('aria-haspopup', 'dialog');
        fallback.setAttribute('aria-expanded', 'false');
        fallback.setAttribute('data-usage-trigger', 'true');
        fallback.setAttribute('data-usage-label', 'true');
        fallback.setAttribute('data-state', 'closed');
        fallback.setAttribute('data-usage-ready', 'false');
        fallback.setAttribute('title', `${usageLabel} (${isMac ? '⌘U' : 'Ctrl+U'})`);

        // Add a small chart icon
        fallback.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="opacity:0.7;">
                <line x1="18" y1="20" x2="18" y2="10"/>
                <line x1="12" y1="20" x2="12" y2="4"/>
                <line x1="6" y1="20" x2="6" y2="14"/>
            </svg>
            <span data-usage-label="true">${usageLabel}</span>
        `;

        fallback.addEventListener("click", (e) => { e.stopPropagation(); e.preventDefault(); toggleMonitorVisibility(); });
        return fallback;
    }

    function markUsageLauncherReady() {
        if (!usageLauncher) return;
        if (usageLauncher.getAttribute("data-usage-ready") === "true") return;
        // Use multiple RAF + setTimeout to ensure browser has fully painted before reveal
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                setTimeout(() => {
                    requestAnimationFrame(() => {
                        if (!usageLauncher) return;
                        // First set the ready attribute so CSS rules apply
                        usageLauncher.setAttribute("data-usage-ready", "true");
                        // Then clear inline styles one by one to let CSS take over
                        const preserveMargin = usageLauncher.style.marginLeft;
                        usageLauncher.style.removeProperty('display');
                        usageLauncher.style.removeProperty('opacity');
                        usageLauncher.style.removeProperty('visibility');
                        usageLauncher.style.removeProperty('background');
                        usageLauncher.style.removeProperty('border-color');
                        usageLauncher.style.removeProperty('box-shadow');
                        usageLauncher.style.removeProperty('color');
                        usageLauncher.style.removeProperty('pointer-events');
                        // Restore margin if it was set
                        if (preserveMargin) usageLauncher.style.marginLeft = preserveMargin;
                        clearHeaderInsertGuard();
                    });
                }, 50);
            });
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

        BUCKET_ORDER.forEach((bucketId, index) => {
            const stats = getBucketStats(bucketId);
            if (!stats) return;

            const row = document.createElement("div");
            row.className = "bucket-row";
            row.style.animationDelay = `${index * 50}ms`;

            const title = document.createElement("div");
            title.className = "bucket-title";
            title.textContent = BUCKET_CONFIG[bucketId].name;
            row.appendChild(title);

            const usageText = document.createElement("div");
            usageText.style.cssText = "text-align:right;font-weight:700;font-size:15px;font-variant-numeric:tabular-nums;";

            // Color code based on usage
            if (stats.percent >= 1) {
                usageText.style.color = "var(--usage-danger)";
            } else if (stats.percent >= 0.85) {
                usageText.style.color = "var(--usage-warning)";
            } else {
                usageText.style.color = "var(--usage-text)";
            }

            usageText.textContent = stats.limit === Infinity ? `${stats.used}/∞` : `${stats.used}/${stats.limit}`;
            row.appendChild(usageText);

            const sub = document.createElement("div");
            sub.className = "bucket-sub";
            sub.textContent = `${formatWindowLabel(BUCKET_CONFIG[bucketId].window)} · ${t("usage.resetsIn", { timeLeft: stats.timeLeft })}`;
            if (BUCKET_CONFIG[bucketId].tooltip) sub.title = BUCKET_CONFIG[bucketId].tooltip;
            row.appendChild(sub);

            const sub2 = document.createElement("div");
            sub2.className = "bucket-sub";
            sub2.style.textAlign = "right";
            // Show percentage
            if (stats.limit !== Infinity && stats.limit > 0) {
                sub2.textContent = `${Math.round(stats.percent * 100)}%`;
            }
            row.appendChild(sub2);

            const progress = document.createElement("div");
            progress.className = "progress";
            const fill = document.createElement("div");
            fill.className = "progress-fill";
            // Animate the progress bar
            requestAnimationFrame(() => {
                fill.style.width = `${Math.min(stats.percent * 100, 100)}%`;
            });
            if (stats.percent >= 1) fill.classList.add("danger");
            else if (stats.percent >= 0.85) fill.classList.add("warn");
            progress.appendChild(fill);
            row.appendChild(progress);

            const statLine = document.createElement("div");
            statLine.className = "stat-line";
            const last = stats.lastUsed
                ? `${formatTimeAgo(stats.lastUsed)} · ${new Date(stats.lastUsed).toLocaleString()}`
                : t("usage.noCalls");
            statLine.textContent = t("usage.last", { last });
            row.appendChild(statLine);

            container.appendChild(row);
        });

        const actions = document.createElement("div");
        actions.className = "actions";
        actions.style.cssText = "display:flex;gap:10px;margin:16px 0 8px 0;flex-wrap:wrap;align-items:center;";

        const exportBtn = document.createElement("button");
        exportBtn.className = "btn";
        exportBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>${t("button.export")}`;
        exportBtn.addEventListener("click", exportUsageData);

        const importBtn = document.createElement("button");
        importBtn.className = "btn";
        importBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>${t("button.import")}`;
        importBtn.addEventListener("click", importUsageData);

        const clearBtn = document.createElement("button");
        clearBtn.className = "btn danger";
        clearBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>${t("button.clear")}`;
        clearBtn.addEventListener("click", clearUsageData);

        // Keyboard shortcut hint - placed at the end
        const kbdHint = document.createElement("span");
        kbdHint.className = "usage-kbd-hint";
        kbdHint.style.marginLeft = "auto";
        kbdHint.textContent = isMac ? t("shortcut.hintMac") : t("shortcut.hint");
        kbdHint.title = isMac ? "Command+U to toggle" : "Ctrl+U to toggle";

        actions.appendChild(exportBtn);
        actions.appendChild(importBtn);
        actions.appendChild(clearBtn);
        actions.appendChild(kbdHint);
        container.appendChild(actions);
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

    function getAllRequests(bucketOrder = BUCKET_ORDER) {
        const all = [];
        for (const bucketId of bucketOrder) {
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
        // Support: 7, 30, 90, 180, 365, 0 (all time)
        const validRanges = [7, 30, 90, 180, 365, 0];
        const safeDays = validRanges.includes(rangeDays) ? rangeDays : 7;

        const todayStart = startOfDayTZ();
        const bucketOrder = ANALYTICS_BUCKET_ORDER;
        const allRequests = getAllRequests(bucketOrder);

        // Find the earliest request date for "all time" mode
        let earliestTs = todayStart;
        if (allRequests.length > 0) {
            earliestTs = Math.min(...allRequests.map(r => r.t));
        }

        // Calculate actual date range
        let start, endExclusive;
        if (safeDays === 0) {
            // All time mode
            start = startOfDayTZ(earliestTs);
            endExclusive = addDaysLocal(todayStart, 1);
        } else {
            start = addDaysLocal(todayStart, -(safeDays - 1));
            endExclusive = addDaysLocal(todayStart, 1);
        }

        // Calculate actual number of days in range
        const actualDays = Math.max(1, Math.ceil((endExclusive - start) / MS_PER_DAY));

        const days = [];
        for (let i = 0; i < actualDays; i++) {
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
            days.map(d => [d.key, Object.fromEntries(bucketOrder.map(b => [b, 0]))])
        );
        const bucketTotals = Object.fromEntries(bucketOrder.map(b => [b, 0]));
        const variantTotals = {};
        const hourTotals = Array.from({ length: 24 }, () => 0);

        let total = 0;
        for (const req of allRequests) {
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
        for (const b of bucketOrder) {
            const c = bucketTotals[b] || 0;
            if (c > topBucketCount) { topBucket = b; topBucketCount = c; }
        }

        const topVariant = Object.entries(variantTotals).sort((a, b) => b[1] - a[1])[0]?.[0] || null;

        let peakHour = 0;
        for (let h = 1; h < hourTotals.length; h++) {
            if (hourTotals[h] > hourTotals[peakHour]) peakHour = h;
        }

        // Calculate estimated API value (ROI analysis)
        let estimatedValue = 0;
        for (const bucketId of bucketOrder) {
            const count = bucketTotals[bucketId] || 0;
            const valuePerRequest = getEstimatedValuePerRequest(bucketId);
            estimatedValue += count * valuePerRequest;
        }

        // Calculate months covered and subscription cost
        const monthsCovered = actualDays / 30;
        const subscriptionCost = monthsCovered * SUBSCRIPTION_COST_MONTHLY;
        const savings = estimatedValue - subscriptionCost;
        const roiPercent = subscriptionCost > 0 ? (estimatedValue / subscriptionCost) * 100 : 0;

        return {
            rangeDays: safeDays,
            actualDays,
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
            // ROI data
            estimatedValue,
            subscriptionCost,
            savings,
            roiPercent,
            monthsCovered,
        };
    }

    // Calculate ROI for current month specifically
    function computeMonthlyROI() {
        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
        const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999).getTime();

        const bucketOrder = ANALYTICS_BUCKET_ORDER;
        const allRequests = getAllRequests(bucketOrder);
        const bucketTotals = Object.fromEntries(bucketOrder.map(b => [b, 0]));
        let total = 0;

        for (const req of allRequests) {
            if (req.t >= monthStart && req.t <= monthEnd) {
                bucketTotals[req.bucketId] += 1;
                total += 1;
            }
        }

        let estimatedValue = 0;
        for (const bucketId of bucketOrder) {
            const count = bucketTotals[bucketId] || 0;
            const valuePerRequest = getEstimatedValuePerRequest(bucketId);
            estimatedValue += count * valuePerRequest;
        }

        const roiPercent = SUBSCRIPTION_COST_MONTHLY > 0 ? (estimatedValue / SUBSCRIPTION_COST_MONTHLY) * 100 : 0;
        const savings = estimatedValue - SUBSCRIPTION_COST_MONTHLY;

        return {
            total,
            estimatedValue,
            subscriptionCost: SUBSCRIPTION_COST_MONTHLY,
            savings,
            roiPercent,
            bucketTotals,
        };
    }

    function updateAnalyticsContent(container) {
        container.innerHTML = "";

        // Support multiple range options: 7, 30, 90, 180, 365, 0 (all)
        const validRanges = [7, 30, 90, 180, 365, 0];
        const rangeDays = validRanges.includes(usageData.settings.analysisRangeDays)
            ? usageData.settings.analysisRangeDays
            : 7;
        const data = computeAnalytics(rangeDays);
        const monthlyROI = computeMonthlyROI();
        const bucketOrder = ANALYTICS_BUCKET_ORDER;

        // ===== No data state =====
        if (data.total === 0 && monthlyROI.total === 0) {
            const emptyState = document.createElement("div");
            emptyState.style.cssText = "padding:32px 16px;text-align:center;color:var(--usage-muted);font-size:13px;";
            emptyState.textContent = t("analytics.noData");
            container.appendChild(emptyState);
            return;
        }

        // ===== ROI Summary =====
        const roiSection = document.createElement("div");
        roiSection.style.cssText = "margin-bottom:16px;";

        const roiHeader = document.createElement("div");
        roiHeader.style.cssText = "display:flex;align-items:baseline;justify-content:space-between;margin-bottom:8px;";

        const roiTitle = document.createElement("div");
        roiTitle.style.cssText = "font-size:12px;color:var(--usage-muted);";
        roiTitle.innerHTML = `${t("analytics.thisMonth")} <span style="opacity:0.7;">(${t("analytics.estimated")})</span>`;
        roiHeader.appendChild(roiTitle);

        const roiPct = document.createElement("div");
        roiPct.style.cssText = "font-size:12px;font-weight:500;";
        roiPct.style.color = monthlyROI.roiPercent >= 100 ? "var(--usage-accent)" : "var(--usage-muted)";
        roiPct.textContent = `ROI ${Math.round(monthlyROI.roiPercent)}%`;
        roiHeader.appendChild(roiPct);
        roiSection.appendChild(roiHeader);

        // Value and status
        const roiMain = document.createElement("div");
        roiMain.style.cssText = "display:flex;align-items:center;justify-content:space-between;";

        const roiValue = document.createElement("div");
        roiValue.style.cssText = "font-size:24px;font-weight:600;color:var(--usage-text);font-variant-numeric:tabular-nums;";
        roiValue.title = t("analytics.estimatedNote");
        roiValue.textContent = `$${monthlyROI.estimatedValue.toFixed(2)}`;
        roiMain.appendChild(roiValue);

        const roiStatus = document.createElement("div");
        roiStatus.style.cssText = "font-size:12px;padding:4px 8px;border-radius:4px;";
        if (monthlyROI.roiPercent >= 100) {
            roiStatus.style.background = "var(--usage-accent-light)";
            roiStatus.style.color = "var(--usage-accent)";
            roiStatus.textContent = t("analytics.worthIt");
        } else if (monthlyROI.roiPercent >= 80) {
            roiStatus.style.background = "var(--usage-warning-light)";
            roiStatus.style.color = "var(--usage-warning)";
            roiStatus.textContent = t("analytics.breakEven");
        } else {
            roiStatus.style.background = "var(--usage-surface-strong)";
            roiStatus.style.color = "var(--usage-muted)";
            roiStatus.textContent = t("analytics.notYet");
        }
        roiMain.appendChild(roiStatus);
        roiSection.appendChild(roiMain);

        // Progress bar
        const progressBar = document.createElement("div");
        progressBar.style.cssText = "height:4px;background:var(--usage-surface-strong);border-radius:2px;margin-top:8px;overflow:hidden;";
        const progressFill = document.createElement("div");
        progressFill.style.cssText = `height:100%;border-radius:2px;width:${Math.min(monthlyROI.roiPercent, 100)}%;`;
        progressFill.style.background = monthlyROI.roiPercent >= 100 ? "var(--usage-accent)" : "var(--usage-muted)";
        progressBar.appendChild(progressFill);
        roiSection.appendChild(progressBar);

        // Stats line
        const statsLine = document.createElement("div");
        statsLine.style.cssText = "display:flex;gap:16px;margin-top:8px;font-size:12px;color:var(--usage-muted);";
        statsLine.innerHTML = `
            <span>${monthlyROI.total} requests</span>
            <span>$${monthlyROI.subscriptionCost} cost</span>
            <span style="color:${monthlyROI.savings >= 0 ? 'var(--usage-accent)' : 'var(--usage-danger)'}">
                ${monthlyROI.savings >= 0 ? '+' : ''}$${monthlyROI.savings.toFixed(2)}
            </span>
        `;
        roiSection.appendChild(statsLine);

        container.appendChild(roiSection);

        // ===== Divider =====
        const divider = document.createElement("div");
        divider.style.cssText = "height:1px;background:var(--usage-border-light);margin:12px 0;";
        container.appendChild(divider);

        // ===== Time Range Selector =====
        const toolbar = document.createElement("div");
        toolbar.style.cssText = "display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;";

        const segmented = document.createElement("div");
        segmented.className = "segmented";

        const rangeOptions = [
            { days: 7, label: "7d" },
            { days: 30, label: "30d" },
            { days: 90, label: "90d" },
            { days: 180, label: "180d" },
            { days: 365, label: "1y" },
            { days: 0, label: t("analytics.allTime") }
        ];

        rangeOptions.forEach(opt => {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.textContent = opt.label;
            btn.classList.toggle("active", rangeDays === opt.days);
            btn.addEventListener("click", () => {
                Storage.update(d => { d.settings.analysisRangeDays = opt.days; });
                usageData = Storage.get();
                updateUI();
            });
            segmented.appendChild(btn);
        });
        toolbar.appendChild(segmented);
        container.appendChild(toolbar);

        // ===== Summary Stats =====
        const displayDays = rangeDays === 0 ? data.actualDays : rangeDays;
        const avg = data.avgPerActiveDay ? data.avgPerActiveDay.toFixed(1) : "0";

        const summaryGrid = document.createElement("div");
        summaryGrid.style.cssText = "display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--usage-border-light);border-radius:8px;overflow:hidden;margin-bottom:16px;";

        const makeStatCell = (value, label) => {
            const cell = document.createElement("div");
            cell.style.cssText = "background:var(--usage-surface);padding:12px 8px;text-align:center;";
            const v = document.createElement("div");
            v.style.cssText = "font-size:16px;font-weight:600;color:var(--usage-text);font-variant-numeric:tabular-nums;";
            v.textContent = value;
            const l = document.createElement("div");
            l.style.cssText = "font-size:11px;color:var(--usage-muted);margin-top:2px;";
            l.textContent = label;
            cell.appendChild(v);
            cell.appendChild(l);
            return cell;
        };

        summaryGrid.appendChild(makeStatCell(String(data.total), t("analytics.totalRequests")));
        summaryGrid.appendChild(makeStatCell(avg, t("analytics.avgActive")));
        summaryGrid.appendChild(makeStatCell(`$${data.estimatedValue.toFixed(0)}`, t("analytics.estimatedValue")));
        container.appendChild(summaryGrid);

        // ===== Daily Trend Chart =====
        if (displayDays <= 90) {
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

            const maxBars = 45;
            let displayDaysData = data.days;
            if (data.days.length > maxBars) {
                const sampleStep = Math.ceil(data.days.length / maxBars);
                displayDaysData = data.days.filter((_, idx) => idx % sampleStep === 0 || idx === data.days.length - 1);
            }

            const maxDay = Math.max(1, ...displayDaysData.map(d => data.totalsByDay[d.key] || 0));

            displayDaysData.forEach((d, idx) => {
                const count = data.totalsByDay[d.key] || 0;
                const bar = document.createElement("div");
                bar.className = "analytics-bar";
                bar.setAttribute("data-today", String(d.key === todayKey));
                const fill = document.createElement("div");
                fill.className = "analytics-bar-fill";
                const pct = count === 0 ? 0 : Math.max(2, Math.round((count / maxDay) * 100));
                fill.style.height = `${pct}%`;
                bar.title = `${d.label} ${d.weekday}: ${count}`;
                bar.appendChild(fill);
                barsRow.appendChild(bar);

                const label = document.createElement("div");
                label.className = "analytics-bar-label";
                const showLabel = displayDaysData.length <= 7 || idx === 0 || idx === displayDaysData.length - 1 || (displayDaysData.length <= 14 && idx % 2 === 0);
                label.textContent = showLabel ? (displayDaysData.length <= 7 ? d.weekday : d.label.slice(5)) : "";
                labelsRow.appendChild(label);
            });

            trend.appendChild(barsRow);
            trend.appendChild(labelsRow);
            container.appendChild(trend);
        }

        // ===== By Bucket Distribution =====
        const distTitle = document.createElement("div");
        distTitle.className = "analytics-section-title";
        distTitle.textContent = t("analytics.byBucket");
        container.appendChild(distTitle);

        const dist = document.createElement("div");
        dist.className = "analytics-dist";
        const maxBucket = Math.max(1, ...bucketOrder.map(b => data.bucketTotals[b] || 0));

        bucketOrder.forEach(bucketId => {
            const bucketCount = data.bucketTotals[bucketId] || 0;
            if (bucketCount === 0 && displayDays > 30) return;

            const tokenBreakdown = getTokenBreakdown(bucketId, bucketCount);

            const row = document.createElement("div");
            row.className = "analytics-dist-row";

            const name = document.createElement("div");
            name.className = "analytics-dist-name";
            name.textContent = BUCKET_CONFIG[bucketId]?.name || bucketId;

            const count = document.createElement("div");
            count.className = "analytics-dist-count";
            if (bucketCount > 0) {
                count.innerHTML = `${bucketCount} <span style="color:var(--usage-muted);font-weight:400;">(~$${tokenBreakdown.totalCost.toFixed(2)})</span>`;
            } else {
                count.textContent = "0";
            }
            row.appendChild(name);
            row.appendChild(count);

            const bar = document.createElement("div");
            bar.className = "analytics-dist-bar";
            const fill = document.createElement("div");
            fill.className = "analytics-dist-bar-fill";
            fill.style.width = `${Math.round((bucketCount / maxBucket) * 100)}%`;
            bar.appendChild(fill);
            row.appendChild(bar);

            dist.appendChild(row);
        });
        container.appendChild(dist);

        // ===== Daily Breakdown Table =====
        if (data.days.length > 0) {
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
            [t("table.date"), t("table.total"), t("table.auto"), t("table.thinking"), t("table.mini"), t("table.gpt4"), t("table.o3"), t("table.o4mini")].forEach(h => {
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
                for (const b of bucketOrder) totals[b] += byBucket[b] || 0;

                [
                    `${d.label.slice(5)} ${d.weekday}`,
                    String(total),
                    String(byBucket.gpt5_auto || 0),
                    String(byBucket.gpt5_thinking || 0),
                    String(byBucket.thinking_mini || 0),
                    String(byBucket.gpt4 || 0),
                    String(byBucket.o3 || 0),
                    String(byBucket.o4mini || 0),
                ].forEach((c, i) => {
                    const td = document.createElement("td");
                    td.textContent = c;
                    if (i === 1) td.style.fontWeight = "600";
                    tr.appendChild(td);
                });
                tbody.appendChild(tr);
            });
            table.appendChild(tbody);

            // Footer with totals
            const tfoot = document.createElement("tfoot");
            const footRow = document.createElement("tr");
            [
                t("table.totalRow"),
                String(totals.total),
                String(totals.gpt5_auto),
                String(totals.gpt5_thinking),
                String(totals.thinking_mini),
                String(totals.gpt4),
                String(totals.o3),
                String(totals.o4mini),
            ].forEach((c, i) => {
                const td = document.createElement("td");
                td.textContent = c;
                if (i === 1) td.style.fontWeight = "600";
                footRow.appendChild(td);
            });
            tfoot.appendChild(footRow);
            table.appendChild(tfoot);

            tableWrap.appendChild(table);
            container.appendChild(tableWrap);
        }

        // ===== Pricing Info Footer =====
        const pricingFooter = document.createElement("div");
        pricingFooter.style.cssText = "margin-top:12px;padding-top:8px;border-top:1px solid var(--usage-border-light);display:flex;justify-content:flex-end;";

        const pricingBtn = document.createElement("button");
        pricingBtn.type = "button";
        pricingBtn.style.cssText = "background:none;border:none;color:var(--usage-muted);font-size:10px;cursor:pointer;padding:4px 8px;border-radius:4px;display:flex;align-items:center;gap:4px;transition:all 0.15s;";
        pricingBtn.innerHTML = `<span style="font-size:12px;">ℹ</span> ${t("analytics.pricingBasis")}`;
        pricingBtn.addEventListener("mouseenter", () => { pricingBtn.style.background = "var(--usage-surface-strong)"; pricingBtn.style.color = "var(--usage-text)"; });
        pricingBtn.addEventListener("mouseleave", () => { pricingBtn.style.background = "none"; pricingBtn.style.color = "var(--usage-muted)"; });

        // Pricing popup
        const pricingPopup = document.createElement("div");
        pricingPopup.style.cssText = "display:none;position:absolute;right:16px;bottom:60px;width:280px;background:var(--usage-surface);border:1px solid var(--usage-border);border-radius:8px;box-shadow:var(--usage-shadow);padding:12px;font-size:11px;z-index:100;";

        const popupHeader = document.createElement("div");
        popupHeader.style.cssText = "display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;";
        popupHeader.innerHTML = `<span style="font-weight:600;color:var(--usage-text);">${t("analytics.pricingBasis")}</span>`;
        const closeBtn = document.createElement("button");
        closeBtn.type = "button";
        closeBtn.textContent = "×";
        closeBtn.style.cssText = "background:none;border:none;color:var(--usage-muted);font-size:16px;cursor:pointer;line-height:1;padding:0;";
        closeBtn.addEventListener("click", () => { pricingPopup.style.display = "none"; });
        popupHeader.appendChild(closeBtn);
        pricingPopup.appendChild(popupHeader);

        const noteText = document.createElement("div");
        noteText.style.cssText = "color:var(--usage-muted);font-size:10px;margin-bottom:10px;line-height:1.4;";
        noteText.textContent = t("analytics.tokenNote");
        pricingPopup.appendChild(noteText);

        const adviceText = document.createElement("div");
        adviceText.style.cssText = "color:var(--usage-accent);font-size:10px;margin-bottom:10px;line-height:1.4;padding:6px 8px;background:var(--usage-accent-light);border-radius:6px;";
        adviceText.textContent = t("analytics.plusAdvice");
        pricingPopup.appendChild(adviceText);

        bucketOrder.forEach(bucketId => {
            const pricing = MODEL_PRICING[bucketId];
            if (!pricing) return;
            const valuePerReq = getEstimatedValuePerRequest(bucketId);
            const row = document.createElement("div");
            row.style.cssText = "display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid var(--usage-border-light);";
            row.innerHTML = `<span style="color:var(--usage-text);">${pricing.name}</span><span style="color:var(--usage-accent);">$${valuePerReq.toFixed(4)}${t("analytics.perRequest")}</span>`;
            pricingPopup.appendChild(row);
        });

        const sourceNote = document.createElement("div");
        sourceNote.style.cssText = "margin-top:8px;color:var(--usage-muted);font-size:9px;";
        sourceNote.textContent = currentLocale === 'zh' ? "基于 OpenAI API 定价 (2025)" : "Based on OpenAI API rates (2025)";
        pricingPopup.appendChild(sourceNote);

        pricingBtn.addEventListener("click", () => {
            pricingPopup.style.display = pricingPopup.style.display === "none" ? "block" : "none";
        });

        pricingFooter.appendChild(pricingBtn);
        container.appendChild(pricingFooter);
        container.appendChild(pricingPopup);
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
        const toast = document.createElement('div');
        toast.className = 'toast';

        // Add icon based on type
        const icons = {
            success: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
            warning: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
            error: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`
        };

        toast.innerHTML = `<span style="display:flex;align-items:center;gap:8px;">${icons[type] || icons.success}<span>${message}</span></span>`;
        toast.setAttribute("role", "status");
        toast.setAttribute("aria-live", "polite");
        toast.setAttribute("aria-atomic", "true");

        const bgColor = type === "error" ? "var(--usage-danger-light)" : (type === "warning" ? "var(--usage-warning-light)" : "var(--usage-accent-light)");
        const textColor = type === "error" ? "var(--usage-danger)" : (type === "warning" ? "var(--usage-warning)" : "var(--usage-accent)");

        toast.style.cssText = `
            position: absolute;
            bottom: 16px;
            left: 50%;
            transform: translateX(-50%) translateY(10px);
            background: ${bgColor};
            color: ${textColor};
            border: 1px solid currentColor;
            padding: 10px 16px;
            border-radius: 10px;
            box-shadow: var(--usage-shadow);
            opacity: 0;
            transition: all var(--usage-transition);
            font-weight: 500;
            font-size: 13px;
            backdrop-filter: var(--usage-blur);
            -webkit-backdrop-filter: var(--usage-blur);
            z-index: 10;
        `;

        container.appendChild(toast);

        // Animate in
        requestAnimationFrame(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(-50%) translateY(0)';
        });

        // Animate out and remove
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(-50%) translateY(10px)';
            setTimeout(() => toast.remove(), 200);
        }, 2600);
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
            // Escape to close
            if (e.key === "Escape") {
                const monitor = document.getElementById("chatUsageMonitor");
                if (monitor) {
                    const inlineMode = monitor.classList.contains("inline-mode");
                    const isOpen = inlineMode ? monitor.classList.contains("open") : !monitor.classList.contains("minimized");
                    if (isOpen) {
                        toggleMonitorVisibility(false);
                        e.preventDefault();
                        e.stopPropagation();
                    }
                }
            }
            // Ctrl+U / Cmd+U to toggle
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'u' && !e.shiftKey && !e.altKey) {
                // Don't trigger if user is typing in an input
                const activeEl = document.activeElement;
                const isTyping = activeEl && (
                    activeEl.tagName === 'INPUT' ||
                    activeEl.tagName === 'TEXTAREA' ||
                    activeEl.isContentEditable ||
                    activeEl.getAttribute('contenteditable') === 'true'
                );
                if (!isTyping) {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleMonitorVisibility();
                }
            }
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
                        try {
                            const bodyObj = JSON.parse(bodyText);
                            variantId = bodyObj?.model || bodyObj?.model_slug || bodyObj?.selected_model;
                            bucketId = resolveBucketForModel(variantId);
                            idempotencyKey = buildIdempotencyKey(bodyObj);
                            if (bucketId) { registerDispatch(variantId, bucketId, idempotencyKey); cleanupExpired(); }
                        } catch (parseErr) {
                            console.warn("[monitor] JSON parse failed for request body:", parseErr.message);
                        }
                    }
                }
            } catch (e) { console.warn("[monitor] dispatch parse failed:", e); }
            try {
                const response = await target.apply(thisArg, args);
                try {
                    if (idempotencyKey) updateRequestStatus(idempotencyKey, response.ok ? "completed" : "failed");
                } catch (statusErr) {
                    console.warn("[monitor] Failed to update request status:", statusErr);
                }
                return response;
            } catch (err) {
                try {
                    if (idempotencyKey) updateRequestStatus(idempotencyKey, "failed");
                } catch (statusErr) {
                    console.warn("[monitor] Failed to update request status on error:", statusErr);
                }
                throw err;
            }
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
        setupThemeObserver();
        setupUploadTracking();
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
    console.log("%c[Usage Monitor]%c v1.5.0 • ROI Analytics • " + (isMac ? "⌘" : "Ctrl+") + "U to toggle",
        "color:#10a37f;font-weight:bold;",
        "color:inherit;");
})();
