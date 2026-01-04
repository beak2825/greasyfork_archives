// ==UserScript==
// @name        B站弹幕显示发送次数与点赞数
// @namespace   https://tampermonkey.net/
// @description 在弹幕旁边显示发送次数（合并同文本弹幕）与点赞数。
// @version     1.1.1
// @author      ZBpine
// @icon        https://www.bilibili.com/favicon.ico
// @match       https://www.bilibili.com/video/*
// @match       https://www.bilibili.com/bangumi/play/*
// @match       https://www.bilibili.com/list/watchlater*
// @grant       GM_addStyle
// @grant       GM_xmlhttpRequest
// @connect     api.bilibili.com
// @run-at      document-start
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/561067/B%E7%AB%99%E5%BC%B9%E5%B9%95%E6%98%BE%E7%A4%BA%E5%8F%91%E9%80%81%E6%AC%A1%E6%95%B0%E4%B8%8E%E7%82%B9%E8%B5%9E%E6%95%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/561067/B%E7%AB%99%E5%BC%B9%E5%B9%95%E6%98%BE%E7%A4%BA%E5%8F%91%E9%80%81%E6%AC%A1%E6%95%B0%E4%B8%8E%E7%82%B9%E8%B5%9E%E6%95%B0.meta.js
// ==/UserScript==

/******/ (() => { // webpackBootstrap
/******/ 	"use strict";

;// ./src/ui.css
const ui_namespaceObject = "/* 弹幕角标 */\r\n.tm-danmaku-badge {\r\n    position: absolute;\r\n    left: 100%;\r\n    top: 50%;\r\n    transform: translateY(-50%);\r\n    margin-left: .28em;\r\n    font-size: .86em;\r\n    pointer-events: none;\r\n    user-select: none;\r\n    white-space: nowrap;\r\n    display: inline-flex;\r\n    align-items: center;\r\n    gap: .18em;\r\n    text-shadow: var(--textShadow, 1px 0 1px #000000, 0 1px 1px #000000, 0 -1px 1px #000000, -1px 0 1px #000000);\r\n}\r\n\r\n.tm-danmaku-badge svg {\r\n    width: 1em;\r\n    height: 1em;\r\n    flex: 0 0 auto;\r\n}\r\n\r\n.tm-danmaku-badge.tm-danmaku-badge-hl {\r\n    padding: .06em .22em;\r\n    border-radius: .28em;\r\n}\r\n\r\n.tm-danmaku-merged-hide {\r\n    opacity: 0 !important;\r\n    visibility: hidden !important;\r\n    pointer-events: none !important;\r\n}\r\n\r\n/* 可折叠面板外壳 */\r\n.tm-dm-adapt-panel {\r\n    width: 100%;\r\n    box-sizing: border-box;\r\n    flex: 0 0 100%;\r\n    margin: 8px 0 16px;\r\n}\r\n\r\n/* 面板头 */\r\n.tm-dm-adapt-panel-header {\r\n    width: 100%;\r\n    box-sizing: border-box;\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: space-between;\r\n    gap: 10px;\r\n    cursor: pointer;\r\n    user-select: none;\r\n    padding: 6px;\r\n}\r\n\r\n.tm-dm-adapt-panel-title {\r\n    font-size: 14px;\r\n    line-height: 20px;\r\n    color: var(--text1, #18191C);\r\n}\r\n\r\n/* 小箭头 */\r\n.tm-dm-adapt-panel-caret {\r\n    width: 6px;\r\n    height: 6px;\r\n    flex: 0 0 auto;\r\n    opacity: .75;\r\n    border-right: 2px solid currentColor;\r\n    border-bottom: 2px solid currentColor;\r\n    transform: rotate(45deg);\r\n    /* 向下 */\r\n    transition: transform .18s ease;\r\n    margin-right: 2px;\r\n}\r\n\r\n.tm-dm-adapt-panel.closed .tm-dm-adapt-panel-caret {\r\n    transform: rotate(-45deg);\r\n}\r\n\r\n/* 面板体：用 max-height 做动画 */\r\n.tm-dm-adapt-panel-body {\r\n    overflow: hidden;\r\n    max-height: 999px;\r\n    transform-origin: top;\r\n    transform: scaleY(1);\r\n    opacity: 1;\r\n    transition: max-height .22s ease, transform .18s ease, opacity .18s ease;\r\n    will-change: max-height, transform, opacity;\r\n}\r\n\r\n.tm-dm-adapt-panel.closed .tm-dm-adapt-panel-body {\r\n    max-height: 0;\r\n    transform: scaleY(0);\r\n    opacity: 0;\r\n}\r\n\r\n/* 控制栏容器：强制竖向 + 占满宽度，避免被父级 flex 横排影响 */\r\n.tm-dm-adapt-controls {\r\n    width: 100%;\r\n    box-sizing: border-box;\r\n    flex: 0 0 100%;\r\n    display: flex;\r\n    flex-direction: column;\r\n    gap: 10px;\r\n    padding: 10px 0 6px 10px;\r\n}\r\n\r\n/* 每一行：左文字右开关 */\r\n.tm-dm-adapt-toggle {\r\n    width: 100%;\r\n    box-sizing: border-box;\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: space-between;\r\n    gap: 12px;\r\n    cursor: pointer;\r\n    user-select: none;\r\n}\r\n\r\n.tm-dm-adapt-toggle-txt {\r\n    font-size: 14px;\r\n    line-height: 20px;\r\n    color: var(--text2, #61666D);\r\n}\r\n\r\n/* 自画开关（接近B站自动连播） */\r\n.tm-dm-adapt-switch {\r\n    width: 30px;\r\n    height: 20px;\r\n    border-radius: 999px;\r\n    background: var(--graph_bg_thick, #E3E5E7);\r\n    /* off 灰 */\r\n    position: relative;\r\n    flex: 0 0 auto;\r\n    transition: background .18s ease;\r\n}\r\n\r\n.tm-dm-adapt-switch.on {\r\n    background: var(--brand_blue, #00AEEC);\r\n    /* on 蓝（B站主蓝） */\r\n}\r\n\r\n.tm-dm-adapt-switch-block {\r\n    width: 16px;\r\n    height: 16px;\r\n    border-radius: 999px;\r\n    background: #fff;\r\n    position: absolute;\r\n    top: 2px;\r\n    left: 2px;\r\n    transition: transform .18s ease;\r\n    box-shadow: 0 1px 4px rgba(0, 0, 0, .18);\r\n    /* 小圆点阴影 */\r\n}\r\n\r\n.tm-dm-adapt-switch.on .tm-dm-adapt-switch-block {\r\n    transform: translateX(10px);\r\n}\r\n\r\n.tm-dm-adapt-settings {\r\n    padding-left: 10px;\r\n    display: grid;\r\n    grid-template-columns: 1fr;\r\n    gap: 6px;\r\n    color: var(--text2, #61666D);\r\n    font-size: 12px;\r\n}\r\n\r\n.tm-dm-adapt-tip {\r\n    color: var(--text3, #9499A0);\r\n    font-size: 12px;\r\n    line-height: 16px;\r\n}\r\n\r\n\r\n.tm-dm-adapt-like-row {\r\n    display: flex;\r\n    align-items: center;\r\n    gap: 8px;\r\n}\r\n\r\n.tm-dm-adapt-like-row label {\r\n    min-width: 84px;\r\n    color: var(--text2, #61666D);\r\n}\r\n\r\n.tm-dm-adapt-like-row select,\r\n.tm-dm-adapt-like-row input {\r\n    flex: 1 1 auto;\r\n    height: 28px;\r\n    border-radius: 6px;\r\n    border: 1px solid var(--line_regular, rgba(0, 0, 0, .08));\r\n    background: var(--bg1, #fff);\r\n    padding: 0 8px;\r\n    outline: none;\r\n}";
;// ./src/ui.js
// src/ui.js


const LIKE_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" fill="none" data-pointer="none" viewBox="0 0 24 25" aria-hidden="true">
    <path fill="currentColor" stroke="rgba(0,0,0,.8)" stroke-width="1.2" paint-order="stroke fill" vector-effect="non-scaling-stroke" d="M13.925 3.415a.798.798 0 0 0-.683.254c-.605.708-.744 1.748-1.198 2.553-.598 1.059-1.156 1.7-1.843 2.302-.565.496-1.138.828-1.701.983v10.587a107.173 107.173 0 0 0 7.937-.11c.91-.046 1.7-.496 2.113-1.229.577-1.028 1.29-2.535 1.721-4.31.402-1.654.586-3.014.668-3.973.038-.444-.313-.852-.859-.852h-4.982a.75.75 0 0 1-.623-.332c-.17-.255-.135-.544-.028-.813.229-.584.529-1.456.647-2.248.117-.783.088-1.411-.218-1.993-.33-.625-.704-.79-.95-.819ZM16.16 8.12h3.92c1.324 0 2.476 1.063 2.354 2.48a28.047 28.047 0 0 1-.705 4.2c-.473 1.946-1.25 3.583-1.872 4.69-.698 1.242-1.992 1.923-3.343 1.993-1.304.067-3.236.14-5.514.14-2.207 0-4.223-.069-5.652-.134-1.608-.073-2.957-1.267-3.13-2.904A38.233 38.233 0 0 1 2 14.622c0-1.369.087-2.61.19-3.595.179-1.722 1.656-2.907 3.318-2.907H7.75c.319 0 .814-.155 1.462-.724.563-.493 1.013-1.003 1.526-1.912.515-.913.668-1.976 1.364-2.79a2.297 2.297 0 0 1 1.997-.769c.826.097 1.588.632 2.103 1.61.521.987.514 1.988.376 2.913-.087.582-.265 1.2-.418 1.672ZM7 20.053V9.62H5.508c-.964 0-1.734.672-1.826 1.562a33.591 33.591 0 0 0-.182 3.44c0 1.428.1 2.766.21 3.805.091.864.803 1.523 1.706 1.564.468.021 1.001.043 1.584.062Z"></path>
</svg>`;
const SEND_SVG = `
<svg viewBox="0 0 1024 1024" aria-hidden="true">
    <path fill="currentColor" stroke="rgba(0,0,0,.8)" stroke-width="1.2" paint-order="stroke fill" vector-effect="non-scaling-stroke" d="M392.021333 925.013333a34.133333 34.133333 0 0 1-34.133333-34.133333V579.242667c0-10.24 4.608-19.968 12.629333-26.453334l276.48-224.085333a34.0992 34.0992 0 0 1 43.008 52.906667L426.154667 595.456v192.853333l82.944-110.592c10.069333-13.482667 28.672-17.578667 43.52-9.557333l137.557333 73.728L853.333333 156.16c3.242667-11.434667-3.413333-18.602667-6.485333-21.162667-3.072-2.56-11.093333-7.850667-21.845333-2.901333L206.336 422.4l80.213333 46.08c16.384 9.386667 22.016 30.208 12.629334 46.592s-30.208 22.016-46.592 12.629333l-137.045334-78.677333a33.979733 33.979733 0 0 1-17.066666-31.061333c0.512-12.8 8.021333-24.064 19.626666-29.525334L795.989333 70.314667c31.744-14.848 68.096-10.069333 94.890667 12.629333a87.790933 87.790933 0 0 1 28.16 91.477333L744.277333 801.28a34.082133 34.082133 0 0 1-48.981333 20.821333L546.133333 742.058667l-126.805333 169.301333c-6.656 8.704-16.896 13.653333-27.306667 13.653333z"></path>
</svg>`;


function injectStyles() {
    // 避免重复注入
    if (document.getElementById("tm-dm-adapt-style")) return;

    const style = document.createElement("style");
    style.id = "tm-dm-adapt-style";
    style.textContent = ui_namespaceObject;

    // document-start 可能 head 还没出来，兜底到 documentElement
    document.documentElement.appendChild(style);
}

function createUI({ config, saveConfig, rebuildAll, refreshAll, castToInteger }) {
    /***********************
     * UI 面板：页面开关注入（弹幕列表下方）
     ***********************/
    let uiMounted = false;
    let uiPanel = null;
    let mergeSwitchBtn = null;
    let mergeSettingsWrap = null;
    let mergeWindowInput = null;

    let likesSwitchBtn = null;
    let likesSettingsWrap = null;
    let likeScopeSel = null;
    let likeMinInput = null;

    let badgeHighlightSwitchBtn = null;
    let badgeHighlightAdaptiveSwitchBtn = null;

    function setSwitchOn(swEl, on) {
        if (!swEl) return;
        swEl.classList.toggle("on", !!on);
    }

    function createSettingsWrap(innerHTML, extraClass) {
        const wrap = document.createElement("div");
        wrap.className = "tm-dm-adapt-settings" + (extraClass ? ` ${extraClass}` : "");
        wrap.innerHTML = innerHTML;
        return wrap;
    }
    function setWrapVisible(wrap, visible) {
        if (!wrap) return;
        wrap.style.display = visible ? "" : "none";
    }

    function applyCfgToUi() {
        setSwitchOn(mergeSwitchBtn, config.mergeSame);
        setSwitchOn(likesSwitchBtn, config.showLikes);
        setSwitchOn(badgeHighlightSwitchBtn, config.badgeHighlightEnabled);
        setSwitchOn(badgeHighlightAdaptiveSwitchBtn, config.badgeHighlightAdaptive);

        if (mergeWindowInput) mergeWindowInput.value = String(config.mergeWindowSec ?? 0);
        if (likeScopeSel) likeScopeSel.value = config.likeScope;
        if (likeMinInput) likeMinInput.value = String(config.likeMin);

        setWrapVisible(mergeSettingsWrap, config.mergeSame);
        setWrapVisible(likesSettingsWrap, config.showLikes);
    }

    function findDanmakuArea() {
        const areas = Array.from(document.querySelectorAll(".bui-area"));
        for (const a of areas) {
            const header = a.querySelector(".bui-collapse-header");
            if (header && /弹幕/.test(header.textContent || "")) return a;
        }
        return areas.find((a) => a.querySelector(".bui-collapse-wrap")) || null;
    }

    function setPanelOpen(open) {
        if (!uiPanel) return;
        uiPanel.classList.toggle("closed", !open);
    }

    function mountUI() {
        if (uiMounted && uiPanel && uiPanel.isConnected) return true;

        const area = findDanmakuArea();
        if (!area) return false;

        const collapse =
            area.querySelector(":scope > .bui-collapse-wrap") || area.querySelector(".bui-collapse-wrap");
        if (!collapse) return false;

        uiMounted = true;

        // ====== 外层：可折叠面板 ======
        uiPanel = document.createElement("div");
        uiPanel.className = "tm-dm-adapt-panel";

        const header = document.createElement("div");
        header.className = "tm-dm-adapt-panel-header";
        header.setAttribute("role", "button");
        header.tabIndex = 0;
        header.innerHTML = `
<div class="tm-dm-adapt-panel-title">弹幕显示设置</div>
<span class="tm-dm-adapt-panel-caret" aria-hidden="true"></span>
`;

        const panelBodyWrap = document.createElement("div");
        panelBodyWrap.className = "tm-dm-adapt-panel-body";

        const panelControls = document.createElement("div");
        panelControls.className = "tm-dm-adapt-controls";

        function makeToggleRow(label, getOn, setOn) {
            const row = document.createElement("div");
            row.className = "tm-dm-adapt-toggle";
            row.setAttribute("role", "button");
            row.tabIndex = 0;

            row.innerHTML = `
<div class="tm-dm-adapt-toggle-txt"></div>
<div class="tm-dm-adapt-switch"><div class="tm-dm-adapt-switch-block"></div></div>
`;

            row.querySelector(".tm-dm-adapt-toggle-txt").textContent = label;
            const sw = row.querySelector(".tm-dm-adapt-switch");

            const render = () => sw.classList.toggle("on", !!getOn());

            const toggle = () => {
                setOn(!getOn());
                render();
            };

            row.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                toggle();
            });

            row.addEventListener("keydown", (e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggle();
                }
            });

            render();
            return { row, sw, render };
        }

        // 合并弹幕
        const mergeUI = makeToggleRow("合并弹幕", () => config.mergeSame, (v) => {
            config.mergeSame = v;
            saveConfig();
            applyCfgToUi();
            rebuildAll("toggle-merge");
        });

        // 显示点赞数
        const likesUI = makeToggleRow("显示点赞数", () => config.showLikes, (v) => {
            config.showLikes = v;
            saveConfig();
            applyCfgToUi();
            refreshAll("toggle-likes");
        });

        // 记录引用，applyCfgToUi 里用
        mergeSwitchBtn = mergeUI.sw;
        likesSwitchBtn = likesUI.sw;

        panelControls.appendChild(mergeUI.row);

        // 合并时间阈值（秒，支持小数；0=不限制）
        mergeSettingsWrap = createSettingsWrap(`
<div class="tm-dm-adapt-like-row">
  <label>多少秒以内合并</label>
  <input class="tm-dm-adapt-merge-window" type="number" step="0.1" min="0" value="0" />
</div>
<!--<div class="tm-dm-adapt-tip">单位：秒，支持小数；0 表示不限制</div>-->
`, "tm-dm-adapt-merge-settings");

        mergeWindowInput = mergeSettingsWrap.querySelector(".tm-dm-adapt-merge-window");

        let mergeWinTimer = null;
        mergeWindowInput.addEventListener("input", () => {
            if (mergeWinTimer) clearTimeout(mergeWinTimer);
            mergeWinTimer = setTimeout(() => {
                const n = Number(mergeWindowInput.value);
                let v = Number.isFinite(n) ? n : 0;
                if (v < 0) v = 0;
                // 最多保留 3 位小数，避免存储噪声
                v = Math.round(v * 1000) / 1000;

                config.mergeWindowSec = v;
                mergeWindowInput.value = String(config.mergeWindowSec);
                saveConfig();
                rebuildAll("merge-window changed");
            }, 200);
        });

        panelControls.appendChild(mergeSettingsWrap);

        panelControls.appendChild(likesUI.row);

        likesSettingsWrap = createSettingsWrap(`
<div class="tm-dm-adapt-like-row">
  <label>显示范围</label>
  <select class="tm-dm-adapt-like-scope">
    <option value="all">全部弹幕</option>
    <option value="high">高赞弹幕</option>
  </select>
</div>
<div class="tm-dm-adapt-like-row">
  <label>多少赞以上显示</label>
  <input class="tm-dm-adapt-like-min" type="number" step="1" value="0" />
</div>
`, "tm-dm-adapt-like-settings");

        likeScopeSel = likesSettingsWrap.querySelector(".tm-dm-adapt-like-scope");
        likeMinInput = likesSettingsWrap.querySelector(".tm-dm-adapt-like-min");

        likeScopeSel.addEventListener("change", () => {
            config.likeScope = likeScopeSel.value || "all";
            saveConfig();
            refreshAll("like-scope");
        });

        let likeMinTimer = null;
        likeMinInput.addEventListener("input", () => {
            if (likeMinTimer) clearTimeout(likeMinTimer);
            likeMinTimer = setTimeout(() => {
                config.likeMin = castToInteger(likeMinInput.value);
                likeMinInput.value = String(config.likeMin);
                saveConfig();
                refreshAll("like-min");
            }, 200);
        });

        panelControls.appendChild(likesSettingsWrap);

        // 高亮角标背景
        const badgeHlUI = makeToggleRow("高亮角标", () => config.badgeHighlightEnabled, (v) => {
            config.badgeHighlightEnabled = v;
            saveConfig();
            applyCfgToUi();
            refreshAll("toggle-badge-highlight");
        });

        // 按热度增亮（点赞+重复）
        const badgeHlAdaptiveUI = makeToggleRow("角标按热度(合并数+点赞数)增亮", () => config.badgeHighlightAdaptive, (v) => {
            config.badgeHighlightAdaptive = v;
            saveConfig();
            applyCfgToUi();
            refreshAll("toggle-badge-highlight-adaptive");
        });

        badgeHighlightSwitchBtn = badgeHlUI.sw;
        badgeHighlightAdaptiveSwitchBtn = badgeHlAdaptiveUI.sw;

        panelControls.appendChild(badgeHlUI.row);
        panelControls.appendChild(badgeHlAdaptiveUI.row);

        // 组装面板
        panelBodyWrap.appendChild(panelControls);
        uiPanel.appendChild(header);
        uiPanel.appendChild(panelBodyWrap);

        // ✅插入到弹幕列表下面：放在 bui-collapse-body 后面
        const body =
            collapse.querySelector(":scope > .bui-collapse-body") ||
            collapse.querySelector(".bui-collapse-body");
        if (body) body.insertAdjacentElement("afterend", uiPanel);
        else collapse.appendChild(uiPanel);

        // 面板头点击展开/收起（可持久化）
        header.addEventListener("click", () => {
            config.panelOpen = !config.panelOpen;
            saveConfig();
            setPanelOpen(config.panelOpen);
        });

        header.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                config.panelOpen = !config.panelOpen;
                saveConfig();
                setPanelOpen(config.panelOpen);
            }
        });

        applyCfgToUi();

        // 初始展开状态（没配过就默认 true）
        if (typeof config.panelOpen !== "boolean") config.panelOpen = true;
        setPanelOpen(config.panelOpen);

        return true;
    }

    function bootUI() {
        const tryMount = () => mountUI();

        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", tryMount, { once: true });
        } else {
            tryMount();
        }

        // B站页面经常局部重建：兜底轮询
        setInterval(() => {
            if (!uiPanel || !uiPanel.isConnected) mountUI();
        }, 1500);
    }

    return { bootUI };
}

;// ./src/index.js
// src/index.js


"use strict";

/**
 * =========================
 * 0) 小工具：日志 / 配置
 * =========================
 */
const console = new Proxy(window.console, {
    get(target, prop) {
        const original = target[prop];
        if (typeof original === "function" && (prop === "log" || prop === "error" || prop === "warn")) {
            return (...args) =>
                original.call(
                    target,
                    "%cDanmaku Adapt",
                    {
                        log: "background:#01a1d6;",
                        warn: "background:#d6a001;",
                        error: "background:#d63601;",
                    }[prop] + "color:#fff;padding:2px 6px;border-radius:3px;font-weight:bold;",
                    ...args
                );
        }
        return original;
    },
});

const STORAGE_KEY = "tm_dm_adapt_cfg_v1";
const DEFAULT_CFG = {
    mergeSame: true,   // 合并同文同模式弹幕
    mergeWindowSec: 3, // 合并时间阈值（秒；0=不限制）
    showLikes: true,   // badge 显示点赞
    likeScope: "all",  // all | high
    likeMin: 0,        // 仅展示 likesSum > likeMin

    // 角标背景高亮
    badgeHighlightEnabled: true,   // 开启后为角标添加与弹幕同色的背景
    badgeHighlightAdaptive: true,  // 开启后按“热度”增亮；否则亮度固定 0.5
    badgeHighlightCurve: {
        baselineOpacity: 0.2,       // n=0 时的透明度
        hotnessAtOpacity90: 500,   // n 达到该值时透明度=0.9
        sendMultiplier: 5,          // 发送侧倍率：n += (count-1) * sendMultiplier
        likeMultiplier: 1,          // 点赞侧倍率：仅当点赞角标显示时 n += likesSum * likeMultiplier
    },

    panelOpen: false,
};

function loadConfig() {
    const isObj = (v) => v && typeof v === "object" && !Array.isArray(v);

    const clone = (v) =>
        (typeof structuredClone === "function")
            ? structuredClone(v)
            : JSON.parse(JSON.stringify(v));

    const apply = (dst, src) => {
        if (!isObj(src)) return dst;
        for (const k in src) {
            const sv = src[k], dv = dst[k];
            if (isObj(dv) && isObj(sv)) apply(dv, sv);
            else dst[k] = sv;
        }
        return dst;
    };

    const cfg = clone(DEFAULT_CFG);
    try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null") || {};
        return apply(cfg, saved);
    } catch {
        return cfg;
    }
}
const config = loadConfig();

function normalizeBadgeHighlightCurve(curve) {
    const c = curve || {};
    const clampNumber = (v, min, max, fallback) => {
        const n = Number(v);
        if (!Number.isFinite(n)) return fallback;
        return Math.max(min, Math.min(max, n));
    };
    return {
        baselineOpacity: clampNumber(c.baselineOpacity, 0.01, 0.89, DEFAULT_CFG.badgeHighlightCurve.baselineOpacity),
        hotnessAtOpacity90: clampNumber(c.hotnessAtOpacity90, 1, 1e9, DEFAULT_CFG.badgeHighlightCurve.hotnessAtOpacity90),
        sendMultiplier: clampNumber(c.sendMultiplier, 0, 1e6, DEFAULT_CFG.badgeHighlightCurve.sendMultiplier),
        likeMultiplier: clampNumber(c.likeMultiplier, 0, 1e6, DEFAULT_CFG.badgeHighlightCurve.likeMultiplier),
    };
}

function computeBadgeHighlightK(curve) {
    const b0 = curve.baselineOpacity;
    const n90 = curve.hotnessAtOpacity90;

    // 0.9 = 1 - (1-b0) * e^(-k*n90)
    const k = Math.log(10 - 10 * b0) / n90;
    return Number.isFinite(k) && k > 0 ? k : 0.0001;
}

let badgeHighlightCurve = normalizeBadgeHighlightCurve(config.badgeHighlightCurve);
config.badgeHighlightCurve = badgeHighlightCurve;
let badgeHighlightK = computeBadgeHighlightK(badgeHighlightCurve);

function opacityFromHotness(sendCount, likes) {
    const count = (config.mergeSame && sendCount > 1) ? (sendCount - 1) : 0; // 发送次数 A：重复次数
    const n =
        (count * badgeHighlightCurve.sendMultiplier) +
        (likes * badgeHighlightCurve.likeMultiplier);

    const b0 = badgeHighlightCurve.baselineOpacity;
    const v = 1 - (1 - b0) * Math.exp(-badgeHighlightK * n);
    return Math.max(0, Math.min(1, v));
}

function saveConfig() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch { }
}

injectStyles();

/**
 * =========================
 * 1) Hook：在页面上下文中拦截 render，把 textData 写到 data-*
 *    目的：拿到 dmid/oid/mode/text/color/isHighLike/likes/stime
 * =========================
 */
function injectToPageContext(fn) {
    const s = document.createElement("script");
    s.textContent = `(${fn.toString()})();`;
    (document.head || document.documentElement).appendChild(s);
    s.remove();
}

injectToPageContext(function () {
    if (window.__DM_ADAPT_HOOK_INSTALLED__) return;
    window.__DM_ADAPT_HOOK_INSTALLED__ = true;

    const FINGERPRINT = ["aria-live", "role", "comment", "--fontSize"]; // render源码指纹
    const define = Object.defineProperty;
    const orig = Object.getOwnPropertyDescriptor(Object.prototype, "render");

    function fnStr(fn) {
        try { return Function.prototype.toString.call(fn); } catch { return ""; }
    }
    function looksLikeDanmakuRender(fn) {
        if (typeof fn !== "function") return false;
        const s = fnStr(fn);
        let hit = 0;
        for (const k of FINGERPRINT) if (s.includes(k)) hit++;
        return hit >= 2;
    }
    function toHexColor(c) {
        try {
            if (typeof c === "number" && Number.isFinite(c)) {
                const v = (c >>> 0) & 0xffffff;
                return "#" + v.toString(16).padStart(6, "0");
            }
            if (typeof c === "string") {
                const s = c.trim();
                if (s.startsWith("#") && (s.length === 7 || s.length === 4)) {
                    if (s.length === 4) return ("#" + s[1] + s[1] + s[2] + s[2] + s[3] + s[3]).toLowerCase();
                    return s.toLowerCase();
                }
                if (/^\d+$/.test(s)) {
                    const n = Number(s);
                    if (Number.isFinite(n)) return toHexColor(n);
                }
            }
        } catch { }
        return null;
    }

    function wrapRender(fn) {
        if (fn.__DM_ADAPT_WRAPPED__) return fn;
        const wrapped = function (...args) {
            const ret = fn.apply(this, args);
            try {
                const el = this?.element;
                const td = this?.textData;
                if (!(el instanceof HTMLElement) || !td) return ret;

                const dmid = td.dmid ?? td.id_str;
                const oid = td.oid ?? td.cid;
                const mode = td.rawMode ?? td.mode;
                const stime = td.stime;
                const colorHex = toHexColor(td.color);

                if (dmid != null) el.dataset.dmid = String(dmid);
                if (oid != null) el.dataset.oid = String(oid);
                if (mode != null) el.dataset.mode = String(mode);

                // 弹幕时间（秒；支持小数）
                if (typeof stime === "number" && Number.isFinite(stime)) el.dataset.stime = String(stime);

                // 合并文本 key 用 textData.text，比 textContent 稳（emoji / prefix / suffix）
                if (td.text != null) el.dataset.dmText = String(td.text);
                if (colorHex) el.dataset.color = colorHex;

                // 有时 textData 自带 likes
                if (typeof td.likes === "number") el.dataset.likes = String(td.likes);

                if (typeof td.isHighLike === "boolean") el.dataset.isHighLike = td.isHighLike ? "1" : "0";
            } catch { }
            return ret;
        };
        wrapped.__DM_ADAPT_WRAPPED__ = true;
        return wrapped;
    }

    function restore() {
        try {
            if (orig) define(Object.prototype, "render", orig);
            else delete Object.prototype.render;
        } catch { }
    }

    define(Object.prototype, "render", {
        configurable: true,
        enumerable: false,
        get() { return undefined; },
        set(v) {
            if (looksLikeDanmakuRender(v)) {
                define(this, "render", { value: wrapRender(v), writable: true, enumerable: true, configurable: true });
                console.log("Danmaku render hooked.");
                restore(); // 命中一次就恢复
                return;
            }
            define(this, "render", { value: v, writable: true, enumerable: true, configurable: true });
        },
    });
});

/**
 * =========================
 * 2) DOM / 文本 / 颜色 / badge 工具
 * =========================
 */
const DM_CONTAINER_SELECTOR = ".bpx-player-row-dm-wrap";
const DM_SELECTOR = ".bili-danmaku-x-dm";
const DM_SHOW_CLASS = "bili-danmaku-x-show";

function isShowing(el) {
    return !!(el?.classList?.contains(DM_SHOW_CLASS));
}

function normalizeText(s) {
    return String(s || "").replace(/\s+/g, " ").trim();
}

function formatCount(n) {
    const num = Number(n) || 0;
    if (num >= 1e8) return (num / 1e8).toFixed(1).replace(/\.0$/, "") + "亿";
    if (num >= 1e4) return (num / 1e4).toFixed(1).replace(/\.0$/, "") + "万";
    return String(num);
}

function parseHexToRgb(hex) {
    const m = /^#([0-9a-f]{6})$/i.exec(hex || "");
    if (!m) return null;
    const v = parseInt(m[1], 16);
    return [(v >> 16) & 255, (v >> 8) & 255, v & 255];
}
function rgbToHex(r, g, b) {
    const to2 = (x) => Math.max(0, Math.min(255, x | 0)).toString(16).padStart(2, "0");
    return `#${to2(r)}${to2(g)}${to2(b)}`;
}

function ensureBadge(el) {
    if (getComputedStyle(el).position === "static") el.style.position = "relative";
    let b = el.querySelector(".tm-danmaku-badge");
    if (!b) {
        b = document.createElement("span");
        b.className = "tm-danmaku-badge";
        el.appendChild(b);
    }
    return b;
}
function removeBadge(el) {
    const b = el?.querySelector?.(".tm-danmaku-badge");
    if (b) b.remove();
}

function hideMerged(el) {
    el.classList.add("tm-danmaku-merged-hide");
    el.dataset.merged = "1";
}
function showMerged(el) {
    el.classList.remove("tm-danmaku-merged-hide");
    delete el.dataset.merged;
}

function dmType(el) {
    if (el.classList.contains("bili-danmaku-x-high") || el.classList.contains("bili-danmaku-x-high-top") || el.dataset.isHighLike === "1") return "high";
    if (el.classList.contains("bili-danmaku-x-center")) return "center";
    if (el.classList.contains("bili-danmaku-x-roll")) return "roll";
    return "other";
}
function shouldShowLikes(el) {
    if (!config.showLikes) return false;
    if (config.likeScope === "high") return dmType(el) === "high";
    return true;
}
function castToInteger(v) {
    const n = Number(v);
    return Number.isFinite(n) ? Math.trunc(n) : 0;
}

/**
 * =========================
 * 3) 核心状态：Group / ElementMeta
 *
 * Group = “可被合并的一组弹幕”
 * - mergeSame=true：同 oid + 同 mode + 同文本
 * - mergeSame=false：退化成每条一个 group（用 oid+dmid）
 *
 * - 只允许 stime >= firstStime
 * - 且 stime - firstStime <= mergeWindowSec 才能并进该组
 * - 超出则新开组（新的 firstStime）
 * =========================
 */
let groupMap = new Map();   // groupId -> group
let elMeta = new WeakMap(); // el -> { groupId, memberId, isMaster }

let baseKeyGroups = new Map(); // baseKey -> Set<gid>

function getMergeWindowSec() {
    const n = Number(config.mergeWindowSec);
    return Number.isFinite(n) && n > 0 ? n : 0;
}

function memberIdOf(oid, dmid) {
    return `${oid}:${dmid}`;
}
function baseKeyOf(oid, mode, text) {
    return `${oid}|${mode}|${text}`;
}
function allocGroupId(baseKey, stime) {
    // stime 是 seconds(float)，用尽量稳定的字符串，避免科学计数法
    const t = Number.isFinite(stime) ? stime.toFixed(6).replace(/0+$/, "").replace(/\.$/, "") : String(Date.now());
    return `${baseKey}|t${t}`;
}
function registerGroupId(baseKey, gid) {
    if (!baseKey || !gid) return;
    let set = baseKeyGroups.get(baseKey);
    if (!set) baseKeyGroups.set(baseKey, (set = new Set()));
    set.add(gid);
}
function unregisterGroupId(baseKey, gid) {
    if (!baseKey || !gid) return;
    const set = baseKeyGroups.get(baseKey);
    if (!set) return;
    set.delete(gid);
    if (set.size === 0) baseKeyGroups.delete(baseKey);
}
function dropGroup(g) {
    if (!g || !groupMap.has(g.id)) return;
    groupMap.delete(g.id);
    if (g.baseKey) unregisterGroupId(g.baseKey, g.id);
}
function chooseGroupId(oid, mode, text, dmid, stime) {
    // 不合并：每条一个 group
    if (!config.mergeSame) return `${oid}|${dmid}`;

    const baseKey = baseKeyOf(oid, mode, text);
    const win = getMergeWindowSec();

    // 0=不限制 或 拿不到 stime：退化成旧逻辑（同文同模式全并）
    if (win <= 0 || !Number.isFinite(stime)) return baseKey;

    // ✅ 单向固定窗口：在同 baseKey 的现存组里，找 firstStime 距离最近且在阈值内的组
    const set = baseKeyGroups.get(baseKey);
    if (set && set.size) {
        let bestGid = null;
        let bestDiff = Infinity;

        // Set 保留插入顺序，转数组后倒序遍历，更容易命中“新建”的组
        const arr = Array.from(set);
        for (let i = arr.length - 1; i >= 0; i--) {
            const gid = arr[i];
            const g = groupMap.get(gid);
            if (!g || g.members.size === 0) continue;
            if (!Number.isFinite(g.firstStime)) continue;

            const diff = stime - g.firstStime;
            if (diff < 0) continue;

            if (diff <= win && diff < bestDiff) {
                bestDiff = diff;
                bestGid = gid;
                if (bestDiff === 0) break;
            }
        }

        if (bestGid) return bestGid;
    }

    // 新开一个组（该组 firstStime = 当前 stime）
    return allocGroupId(baseKey, stime);
}

/**
 * =========================
 * 4) 点赞请求：按 oid 分桶批量请求 / 回填
 * =========================
 */
const likesCache = new Map();     // memberId -> likes
const likesPending = new Map();   // oid -> Set<dmid>
let likesFlushTimer = null;
let likesInflight = false;

function queueLikes(oid, dmid) {
    if (!oid || !dmid) return;
    const mid = memberIdOf(oid, dmid);
    if (likesCache.has(mid)) return;

    let set = likesPending.get(oid);
    if (!set) likesPending.set(oid, (set = new Set()));
    set.add(String(dmid));

    if (!likesFlushTimer) likesFlushTimer = setTimeout(flushLikes, 200);
}

function requestThumbupStats(oid, ids) {
    const url =
        "https://api.bilibili.com/x/v2/dm/thumbup/stats" +
        `?oid=${encodeURIComponent(oid)}` +
        `&ids=${encodeURIComponent(ids.join(","))}`;

    const headers = {
        "User-Agent": navigator.userAgent,
        "Referer": "https://www.bilibili.com/",
    };

    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: "GET",
            url,
            headers,
            responseType: "json",
            withCredentials: true,
            timeout: 8000,
            onload: (res) => {
                try {
                    const json = res.response || JSON.parse(res.responseText);
                    if (!json || json.code !== 0) return reject(new Error("bad resp"));
                    resolve(json.data || {});
                } catch (e) {
                    reject(e);
                }
            },
            onerror: reject,
            ontimeout: () => reject(new Error("timeout")),
        });
    });
}

async function flushLikes() {
    likesFlushTimer = null;
    if (!config.showLikes) { likesPending.clear(); return; }
    if (likesInflight || likesPending.size === 0) return;
    likesInflight = true;

    try {
        for (const [oid, set] of likesPending) {
            while (set.size) {
                const chunk = Array.from(set).slice(0, 50);
                chunk.forEach((x) => set.delete(x));

                const data = await requestThumbupStats(oid, chunk);

                // 回填 cache
                for (const [dmid, info] of Object.entries(data || {})) {
                    const likes = typeof info === "number" ? info : Number(info?.likes ?? 0);
                    const mid = memberIdOf(oid, dmid);
                    likesCache.set(mid, likes);
                }

                // 回填到 group member，并标记 group dirty
                for (const g of groupMap.values()) {
                    let touched = false;
                    for (const dmid of chunk) {
                        const mid = memberIdOf(oid, dmid);
                        const rec = g.members.get(mid);
                        if (rec && !rec.likesKnown && likesCache.has(mid)) {
                            rec.likesKnown = true;
                            rec.likes = likesCache.get(mid);
                            touched = true;
                        }
                    }
                    if (touched) scheduleGroupUpdate(g);
                }
            }
            if (set.size === 0) likesPending.delete(oid);
        }
    } catch (e) {
        console.warn("flushLikes failed, retry later", String(e));
        if (likesPending.size) likesFlushTimer = setTimeout(flushLikes, 1200);
    } finally {
        likesInflight = false;
    }
}

/**
 * =========================
 * 5) 核心流程：onStart/onUpdate/onEnd + group render（合并 & badge）
 * =========================
 */
function cleanupElForReuse(el) {
    removeBadge(el);
    showMerged(el);
    delete el.dataset.dmAdaptProcessed;
}

function scheduleGroupUpdate(g) {
    if (g._scheduled) return;
    g._scheduled = true;
    requestAnimationFrame(() => {
        g._scheduled = false;
        if (!groupMap.has(g.id)) return;

        const master = g.masterEl;
        if (!(master instanceof HTMLElement) || !master.isConnected) {
            // master 不在了：尽量从仍在显示的成员里挑一个顶上
            g.masterEl = null;
            for (const el of g.memberEls.values()) {
                if (!(el instanceof HTMLElement)) continue;
                if (!el.isConnected) continue;
                if (!isShowing(el)) continue;
                g.masterEl = el;
                break;
            }

            if (!g.masterEl) {
                dropGroup(g);
                return;
            }
        }

        // 重新聚合（count/likes/颜色）
        let count = 0;
        let likesSum = 0;
        let pending = 0;

        let rSum = 0, gSum = 0, bSum = 0, colorCount = 0;

        for (const rec of g.members.values()) {
            count++;
            if (rec.likesKnown) likesSum += rec.likes;
            else pending++;

            if (rec.rgb) {
                rSum += rec.rgb[0];
                gSum += rec.rgb[1];
                bSum += rec.rgb[2];
                colorCount++;
            }
        }

        g.count = count;
        g.likesSum = likesSum;
        g.pending = pending;
        g.colorCount = colorCount;
        g.rSum = rSum;
        g.gSum = gSum;
        g.bSum = bSum;

        // master 的 DOM 更新
        const el = g.masterEl;
        if (!(el instanceof HTMLElement) || !el.isConnected) return;

        // master 永远保持可见
        showMerged(el);

        // 只有当前设置下“可能显示点赞角标”时，才去请求缺失点赞
        if (shouldShowLikes(el)) {
            for (const rec of g.members.values()) {
                if (rec.likesKnown) continue;
                if (rec.likesQueued) continue;

                const dmid = rec.dmid;
                if (!dmid) continue;

                rec.likesQueued = true;
                queueLikes(g.oid, dmid);
            }
        }

        // 合并模式下：颜色平均混合
        let avgRgb = null;
        if (colorCount > 0) {
            avgRgb = [
                Math.round(rSum / colorCount),
                Math.round(gSum / colorCount),
                Math.round(bSum / colorCount)
            ];
        }
        if (config.mergeSame && colorCount > 0) {
            el.style.setProperty("--color", rgbToHex(avgRgb[0], avgRgb[1], avgRgb[2]));
        }

        // badge：likes + count
        const threshold = castToInteger(config.likeMin);

        let likePart = "";
        if (shouldShowLikes(el)) {
            const likeText = pending > 0 ? (likesSum > 0 ? `${formatCount(likesSum)}+` : "…") : `${formatCount(likesSum)}`;
            const pass = pending > 0 ? (threshold <= 0 || likesSum > threshold) : (likesSum > threshold);
            if (pass) likePart = `${LIKE_SVG}<span>${likeText}</span>`;
        }

        const sendPart = (config.mergeSame && count > 1) ? `${SEND_SVG}<span>${count}</span>` : "";

        if (!likePart && !sendPart) {
            removeBadge(el);
        } else {
            const badge = ensureBadge(el);
            badge.innerHTML = `${sendPart}${likePart}`;

            // 角标背景高亮：背景颜色与弹幕颜色一致，透明度可调
            if (config.badgeHighlightEnabled) {
                badge.classList.add("tm-danmaku-badge-hl");

                const alpha = config.badgeHighlightAdaptive
                    ? opacityFromHotness(count, (likePart ? likesSum : 0))
                    : 0.5;

                const rgb = avgRgb || parseHexToRgb(el.dataset.color);
                badge.style.backgroundColor = rgb ? `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha})` : "";
            } else {
                badge.classList.remove("tm-danmaku-badge-hl");
                badge.style.backgroundColor = "";
            }
        }
    });
}

function onDanmakuStart(el) {
    if (!(el instanceof HTMLElement)) return;
    if (!el.classList.contains("bili-danmaku-x-dm")) return;
    if (!isShowing(el)) return; // ✅ 只处理 show 状态，避免对象池旧值

    const oid = el.dataset.oid;
    const dmid = el.dataset.dmid;
    const mode = el.dataset.mode;
    const stimeRaw = Number(el.dataset.stime);
    const stime = Number.isFinite(stimeRaw) ? stimeRaw : NaN;
    if (!oid || !dmid) return;
    if (config.mergeSame && mode == null) return;

    const mid = memberIdOf(oid, dmid);

    // DOM 复用：同一个 el 之前绑定过别的 member -> 先结束旧的
    const prev = elMeta.get(el);
    if (prev && prev.memberId !== mid) {
        onDanmakuEnd(el, "reuse");
    }

    // 幂等：同一 member 只处理一次（避免属性震荡反复进组）
    if (el.dataset.dmAdaptProcessed === mid) return;
    el.dataset.dmAdaptProcessed = mid;

    const text = normalizeText(el.dataset.dmText ?? el.textContent ?? "");
    if (!text) return;

    const gid = chooseGroupId(oid, mode, text, dmid, stime);
    const baseKey = config.mergeSame ? baseKeyOf(oid, mode, text) : null;
    const win = getMergeWindowSec();

    // 建/取 group
    let g = groupMap.get(gid);
    if (!g) {
        g = {
            id: gid,
            baseKey,
            oid: String(oid),
            mode: mode == null ? null : String(mode),
            text,
            firstStime: Number.isFinite(stime) ? stime : NaN,
            masterEl: null,
            members: new Map(),   // mid -> { likesKnown, likes, rgb, stime }
            memberEls: new Map(), // mid -> el（便于迁移 master & 清理）
            count: 0,
            likesSum: 0,
            pending: 0,
            colorCount: 0,
            rSum: 0, gSum: 0, bSum: 0,
            _scheduled: false,
            lastSeen: Date.now(),
        };
        groupMap.set(gid, g);
    }

    // 仅在“合并时间阈值”开启且 gid != baseKey 时登记（允许同 baseKey 多组并存）
    if (config.mergeSame && win > 0 && gid !== baseKey) registerGroupId(baseKey, gid);

    g.lastSeen = Date.now();

    // 注册 member 记录
    if (!g.members.has(mid)) {
        const rec = { likesQueued: false, likesKnown: false, likes: 0, rgb: null, stime, dmid: String(dmid) };

        const rgb = parseHexToRgb(el.dataset.color);
        if (rgb) rec.rgb = rgb;

        if (el.dataset.likes != null && el.dataset.likes !== "") {
            rec.likesKnown = true;
            rec.likes = Number(el.dataset.likes) || 0;
        } else if (likesCache.has(mid)) {
            rec.likesKnown = true;
            rec.likes = likesCache.get(mid);
        } else {
            // queueLikes(oid, dmid);
            // scheduleGroupUpdate里再请求
        }

        g.members.set(mid, rec);
    }

    // 记录 member -> el
    g.memberEls.set(mid, el);

    // 选 master：优先第一个出现/当前 master
    let isMaster = false;
    if (!g.masterEl || g.masterEl === el || !g.masterEl.isConnected) {
        g.masterEl = el;
        isMaster = true;
    }

    // 合并：隐藏非 master
    if (config.mergeSame && !isMaster) hideMerged(el);
    else showMerged(el);

    elMeta.set(el, { groupId: gid, memberId: mid, isMaster });

    // 更新（合并渲染 + badge）
    scheduleGroupUpdate(g);
}

function onDanmakuEnd(el, reason) {
    if (!(el instanceof HTMLElement)) return;
    const meta = elMeta.get(el);
    if (!meta) {
        cleanupElForReuse(el);
        return;
    }

    const g = groupMap.get(meta.groupId);
    elMeta.delete(el);

    // 清理这个 el 的 UI/标记，避免 DOM 复用残留
    cleanupElForReuse(el);

    if (!g) return;

    // 从组里移除 member
    g.members.delete(meta.memberId);
    g.memberEls.delete(meta.memberId);

    // 组空了：删组
    if (g.members.size === 0) {
        dropGroup(g);
        return;
    }

    // 如果结束的是 master：把 master 迁移到仍在显示的成员
    if (meta.isMaster && g.masterEl === el) {
        g.masterEl = null;
    }

    g.lastSeen = Date.now();
    scheduleGroupUpdate(g);

    if (reason) void reason; // 预留
}

function startShowingDanmaku(els) {
    //先按发送时间排序在处理
    const arr = Array.from(els || []);
    arr.sort((a, b) => {
        const sa = Number(a?.dataset?.stime);
        const sb = Number(b?.dataset?.stime);
        const na = Number.isFinite(sa) ? sa : Number.POSITIVE_INFINITY;
        const nb = Number.isFinite(sb) ? sb : Number.POSITIVE_INFINITY;
        return na - nb;
    });
    for (const el of arr) onDanmakuStart(el);
}

/**
 * =========================
 * 6) Observer：以 show class 的“出现/消失”作为生命周期
 * =========================
 */
function collectDanmakuEls(node) {
    const out = [];
    if (!(node instanceof HTMLElement)) return out;
    if (node.matches?.(DM_SELECTOR)) out.push(node);
    node.querySelectorAll?.(DM_SELECTOR)?.forEach((el) => out.push(el));
    return out;
}

function startObserverOn(container) {
    if (!container || container.__dmAdaptObserverInstalled) return false;
    container.__dmAdaptObserverInstalled = true;

    const obs = new MutationObserver((records) => {
        const startSet = new Set(); //收集所有需要start/update的弹幕元素
        for (const m of records) {
            if (m.type === "childList") {
                // 新增：只要是 show，就处理
                for (const n of m.addedNodes) {
                    for (const el of collectDanmakuEls(n)) startSet.add(el);
                }
                // 移除：真 remove 也算结束（少数情况）
                for (const n of m.removedNodes) {
                    for (const el of collectDanmakuEls(n)) onDanmakuEnd(el, "removed");
                }
                continue;
            }

            if (m.type === "attributes") {
                const el = m.target;
                if (!(el instanceof HTMLElement)) continue;
                if (!el.classList.contains("bili-danmaku-x-dm")) continue;

                // ✅ 关键：class 变化判断 show 的出现/消失
                if (m.attributeName === "class") {
                    const oldCls = String(m.oldValue || "");
                    const oldHadShow = oldCls.split(/\s+/).includes(DM_SHOW_CLASS);
                    const nowHasShow = isShowing(el);

                    if (oldHadShow && !nowHasShow) {
                        onDanmakuEnd(el, "hide");
                        continue;
                    }
                    if (!oldHadShow && nowHasShow) {
                        // 新开始
                        startSet.add(el);
                        continue;
                    }

                    // show 中的其它 class 抖动：当作 update
                    if (nowHasShow) startSet.add(el);
                    continue;
                }

                // data-* 变化：只在 show 时更新（避免对象池旧值干扰）
                if (isShowing(el)) startSet.add(el);
            }
        }
        startShowingDanmaku(startSet);
    });

    obs.observe(container, {
        subtree: true,
        childList: true,
        attributes: true,
        attributeOldValue: true,
        attributeFilter: [
            "class",
            "data-dmid",
            "data-oid",
            "data-mode",
            "data-stime",
            "data-likes",
            "data-dm-text",
            "data-color",
            "data-is-high-like",
        ],
    });

    // 初次：只扫 show 的（避免对象池内的旧弹幕）
    startShowingDanmaku(container.querySelectorAll?.(`${DM_SELECTOR}.${DM_SHOW_CLASS}`));

    return true;
}

function bootObserver() {
    const container = document.querySelector(DM_CONTAINER_SELECTOR);
    if (container) return startObserverOn(container);

    // 容器可能晚出现/被重建：轮询 + body 兜底
    const timer = setInterval(() => {
        const c = document.querySelector(DM_CONTAINER_SELECTOR);
        if (c && startObserverOn(c)) clearInterval(timer);
    }, 300);

    const bodyObs = new MutationObserver(() => {
        const c = document.querySelector(DM_CONTAINER_SELECTOR);
        if (c) startObserverOn(c);
    });

    const startBody = () => bodyObs.observe(document.body, { childList: true, subtree: true });
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", startBody, { once: true });
    else startBody();

    return false;
}
bootObserver();

/**
 * =========================
 * 7) 配置变化：刷新/重建（给 UI 用）
 * =========================
 */
function refreshAll(reason) {
    for (const g of groupMap.values()) scheduleGroupUpdate(g);
    console.log("refresh", reason);
}

function rebuildAll(reason) {
    const container = document.querySelector(DM_CONTAINER_SELECTOR);

    // 先清理 DOM 残留
    container?.querySelectorAll?.(DM_SELECTOR)?.forEach((el) => {
        cleanupElForReuse(el);
    });

    // 清空状态
    groupMap = new Map();
    elMeta = new WeakMap();
    baseKeyGroups = new Map();

    // 只重扫 show
    startShowingDanmaku(container.querySelectorAll?.(`${DM_SELECTOR}.${DM_SHOW_CLASS}`));

    console.log("rebuild", reason);
}

/**
 * =========================
 * 8) 防内存增长：长期不活跃 group 清理
 * =========================
setInterval(() => {
    const now = Date.now();
    for (const [gid, g] of groupMap) {
        if (now - (g.lastSeen || 0) > 60_000) dropGroup(g);
    }
}, 10_000);
 */

/**
 * =========================
 * 9) UI
 * =========================
 */
const { bootUI } = createUI({
    config,
    saveConfig,
    rebuildAll,
    refreshAll,
    castToInteger,
});
bootUI();

// === debug expose ===
const debugAPI = {
    get groupMap() { return groupMap; },
    get elMeta() { return elMeta; },
    get baseKeyGroups() { return baseKeyGroups; },

    // 辅助：把 WeakMap 里某个元素的 meta 取出来
    metaOf(el) { return elMeta.get(el); },

    // 辅助：按 baseKey 看有哪些 gid
    gidsOfBaseKey(baseKey) { return baseKeyGroups.get(baseKey); },

    // 辅助：按 gid 取 group
    groupOf(gid) { return groupMap.get(gid); },

    // 调试：设置角标高亮曲线参数（位置参数）
    // 用法：__DM_ADAPT__.setBadgeHighlightCurve(baselineOpacity, hotnessAtOpacity90, sendMultiplier, likeMultiplier)
    setBadgeHighlightCurve(baselineOpacity, hotnessAtOpacity90, sendMultiplier, likeMultiplier) {
        const cur = config.badgeHighlightCurve || DEFAULT_CFG.badgeHighlightCurve;
        const curve = normalizeBadgeHighlightCurve({
            baselineOpacity: (baselineOpacity !== undefined) ? baselineOpacity : cur.baselineOpacity,
            hotnessAtOpacity90: (hotnessAtOpacity90 !== undefined) ? hotnessAtOpacity90 : cur.hotnessAtOpacity90,
            sendMultiplier: (sendMultiplier !== undefined) ? sendMultiplier : cur.sendMultiplier,
            likeMultiplier: (likeMultiplier !== undefined) ? likeMultiplier : cur.likeMultiplier,
        });

        config.badgeHighlightCurve = curve;
        badgeHighlightCurve = curve;
        badgeHighlightK = computeBadgeHighlightK(curve);

        saveConfig();
        refreshAll("setBadgeHighlightCurve");

        console.log("badgeHighlightCurve updated", curve, "k=", badgeHighlightK);
    },
    opacityFromHotness(sendCount, likes) { return opacityFromHotness(sendCount, likes); },
    // 输入文本片段查询当前在屏幕上的弹幕组（不重算任何参数，只输出已有数据）
    // 用法：__DM_ADAPT__.inspectDanmaku("哈哈", 10)
    inspectDanmaku(queryText, limit = 10) {
        const q = String(queryText ?? "").trim();
        if (!q) {
            console.warn("usage: __DM_ADAPT__.inspectDanmaku('文本片段'[, limit])");
            return [];
        }

        const out = [];
        for (const g of groupMap.values()) {
            if (!g || typeof g.text !== "string") continue;
            if (!g.text.includes(q)) continue;

            // 仅“取已有数据”，不计算
            const masterEl = g.masterEl || null;

            // 为了控制台更好看：把 Map 转成数组（不算重算，只是序列化展示）
            const membersArr = g.members ? Array.from(g.members.entries()) : [];
            const memberElsArr = g.memberEls ? Array.from(g.memberEls.entries()) : [];

            out.push({
                // group 本体（含 count/likesSum/pending/colorCount/rSum... 等你现有缓存字段）
                group: g,

                // 常用入口
                masterEl,
                masterMeta: masterEl ? elMeta.get(masterEl) : null,

                // 原始成员记录
                members: membersArr,       // [ [mid, rec], ... ]
                memberEls: memberElsArr,   // [ [mid, el], ... ]

                // 方便看每个 member 的 meta / dataset（仍然只是读取）
                memberMeta: memberElsArr.map(([mid, el]) => [mid, el ? elMeta.get(el) : null]),
                memberDataset: memberElsArr.map(([mid, el]) => [mid, el ? { ...el.dataset } : null]),
            });

            if (out.length >= limit) break;
        }

        // 控制台给个摘要（读取已有字段，不重算）
        console.table(out.map(x => ({
            gid: x.group?.id,
            mode: x.group?.mode,
            count: x.group?.count,
            likesSum: x.group?.likesSum,
        })));

        // 返回完整对象（里面有 element 引用，方便你继续点进去看）
        return out;
    },
};

try {
    // eslint-disable-next-line no-undef
    unsafeWindow.__DM_ADAPT__ = debugAPI;
} catch {
    window.__DM_ADAPT__ = debugAPI;
}

/******/ })()
;