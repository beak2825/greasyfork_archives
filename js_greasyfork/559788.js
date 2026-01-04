// ==UserScript==
// @name         daguofan - Torn OC Work Score Display
// @namespace    SMTH-CONCORD
// @version      0.4.3
// @description  In Torn Faction -> Organized Crimes page, display "work score" on vacant slots of 7/8 level OCs in Recruiting tab, and support "total score/daily score" two modes.
// @author       brbbswd[2727286]
// @match        https://www.torn.com/factions.php*
// @run-at       document-idle
// @grant        GM_xmlhttpRequest
// @connect      tornweb.tysnode.uk
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/559788/daguofan%20-%20Torn%20OC%20Work%20Score%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/559788/daguofan%20-%20Torn%20OC%20Work%20Score%20Display.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const LANG = "en";
  const I18N = {
    zh: {
      // UI
      mode_toggle_title: "切换显示模式：日均或总工分",
      mode_toggle_label_daily: "日均工分模式",
      mode_toggle_hint: "(关=总工分)",

      // Badge
      badge_total: "工分 {value}",
      badge_daily: "{value}/天",

      // Warnings
      warn_chance_too_low: "成功率低",

      // Logs / console
      err_load_mode: "读取模式失败：",
      err_save_mode: "保存模式失败：",
      err_process_failed: "处理失败：",
      warn_missing_tabs: "未找到 Recruiting/Planning/Completed tab 容器，默认按 Recruiting 处理",
      log_not_target_page: "非目标页面，跳过。pathname/search/hash =",
      warn_missing_oc_area: "未找到 OC 列表容器（#faction-crimes-root .tt-oc2-list），等待页面渲染...",
      log_not_in_recruiting: "不在 Recruiting，清理后退出。",
      log_found_cards: "找到 OC 卡片数量：",
      log_current_tab: "当前 tab =",
      log_oc_slot_stats: "OC：",
      log_write_profit: "写入工分：",
      warn_parse_level: "无法解析 OC 等级，ocName =",
      log_skip_non_78: "跳过非7/8级 OC：",
      warn_parse_chance: "无法解析成功率，ocName/role =",
      log_xishu_missing_oc: "系数表未命中 ocName：",
      log_xishu_missing_level: "系数表未命中 level：",
      log_xishu_missing_role: "系数表未命中 role：",
      log_xishu_no_hit: "未命中系数：",
      log_label_oc_name: "ocName：",
      log_label_level: "level：",
      err_get_computed_style: "读取样式失败：",
    },
    en: {
      // UI
      mode_toggle_title: "Switch mode: daily score (default) or total score",
      mode_toggle_label_daily: "Daily score mode",
      mode_toggle_hint: "(off = total score)",

      // Badge
      badge_total: "Score {value}",
      badge_daily: "{value}/day",

      // Warnings
      warn_chance_too_low: "Low success chance. Pick another OC.",

      // Logs / console
      err_load_mode: "Failed to load mode:",
      err_save_mode: "Failed to save mode:",
      err_process_failed: "Processing failed:",
      warn_missing_tabs: "Cannot find Recruiting/Planning/Completed tabs, defaulting to Recruiting",
      log_not_target_page: "Not target page, skipped. pathname/search/hash =",
      warn_missing_oc_area: "Cannot find OC list container (#faction-crimes-root .tt-oc2-list), waiting...",
      log_not_in_recruiting: "Not in Recruiting tab, cleaned and exited.",
      log_found_cards: "Found OC cards:",
      log_current_tab: "Current tab =",
      log_oc_slot_stats: "OC:",
      log_write_profit: "Write score:",
      warn_parse_level: "Cannot parse OC level, ocName =",
      log_skip_non_78: "Skip non-level 7/8 OC:",
      warn_parse_chance: "Cannot parse success chance, ocName/role =",
      log_xishu_missing_oc: "Xishu table missing ocName:",
      log_xishu_missing_level: "Xishu table missing level:",
      log_xishu_missing_role: "Xishu table missing role:",
      log_xishu_no_hit: "Xishu not matched:",
      log_label_oc_name: "ocName:",
      log_label_level: "level:",
      err_get_computed_style: "Failed to read computed style:",
    },
  };

  function formatTemplate(template, vars) {
    return String(template).replace(/\{(\w+)\}/g, (_, k) => {
      const v = vars?.[k];
      return v === undefined || v === null ? `{${k}}` : String(v);
    });
  }

  function t(key, vars) {
    const pack = I18N[LANG] || I18N.zh;
    const raw = pack[key] ?? I18N.zh[key] ?? key;
    return vars ? formatTemplate(raw, vars) : String(raw);
  }

  const STYLE_ID = "dgf-oc-profit-style";
  const PROFIT_CLASS = "dgf-oc-profit";
  const DEBUG = false; // 排查问题时设为 true；稳定后可改回 false

  const BADGE_KIND_ATTR = "data-dgf-kind"; // profit | warn
  const BADGE_SCORE_ATTR = "data-dgf-score"; // 数字字符串（用于排序/高亮的“分数”）

  const MODE_STORAGE_KEY = "dgf-oc-profit-mode"; // daily | total
  const MODE_DAILY = "daily";
  const MODE_TOTAL = "total";

  const MODE_TOGGLE_ID = "dgf-oc-mode-toggle";

  let currentMode = MODE_DAILY; // 默认：日均收益

  const WARN_CLASS = "dgf-oc-warn";
  const HIGH_CLASS = "dgf-oc-high";
  const TOP_CLASS = "dgf-oc-top";
  const CARD_TOP_CLASS = "dgf-oc-card-top";

  const BADGE_RUN_ATTR = "data-dgf-run";
  let isMutatingByScript = false; // 避免 MutationObserver 因为我们自己的 DOM 写入而递归触发
  let lastRecruitingState = null; // null/true/false
  let lastTopCard = null;
  let runSeq = 0;

  function dlog(...args) {
    if (!DEBUG) return;
    // 统一前缀，便于在控制台过滤
    console.log("[daguofan][oc-profit]", ...args);
  }

  function dwarn(...args) {
    if (!DEBUG) return;
    console.warn("[daguofan][oc-profit]", ...args);
  }

  // 数据结构：
  // XISHU_TABLE[ocName][level][role] = [[min, max, a], ...]
  // 其中 role 会做“去空格”归一化（例如 "Bomber #1" => "Bomber#1"）
  // 系数表来源：远端 JSON（公共只读），本地只保留“兜底空表”以避免脚本体积过大
  const DEFAULT_XISHU_TABLE = {};
  let XISHU_TABLE = DEFAULT_XISHU_TABLE;

  const XISHU_REMOTE_URL = "https://tornweb.tysnode.uk/xishu.json";
  const XISHU_CACHE_KEY = "dgf-xishu-cache-v1";
  const XISHU_CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24小时

  function isValidXishuTable(obj) {
    return obj && typeof obj === "object" && !Array.isArray(obj);
  }

  function loadXishuCache() {
    try {
      const raw = localStorage.getItem(XISHU_CACHE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      const ts = Number(parsed?.ts || 0);
      const data = parsed?.data;
      if (!ts || !isValidXishuTable(data)) return null;
      if (Date.now() - ts > XISHU_CACHE_TTL_MS) return null;
      return data;
    } catch (e) {
      console.error("[daguofan][xishu] load cache failed:", e);
      return null;
    }
  }

  function saveXishuCache(data) {
    try {
      localStorage.setItem(XISHU_CACHE_KEY, JSON.stringify({ ts: Date.now(), data }));
    } catch (e) {
      console.error("[daguofan][xishu] save cache failed:", e);
    }
  }

  function gmFetchJson(url) {
    return new Promise((resolve, reject) => {
      if (typeof GM_xmlhttpRequest !== "function") {
        reject(new Error("GM_xmlhttpRequest is not available (missing @grant?)"));
        return;
      }
      GM_xmlhttpRequest({
        method: "GET",
        url,
        headers: { "Cache-Control": "no-cache" },
        onload: (resp) => {
          try {
            const status = Number(resp?.status || 0);
            if (!(status >= 200 && status < 300)) {
              reject(new Error(`gm http ${status}`));
              return;
            }
            const text = String(resp?.responseText ?? "");
            resolve(JSON.parse(text));
          } catch (e) {
            reject(e);
          }
        },
        onerror: () => reject(new Error("gm request error")),
        ontimeout: () => reject(new Error("gm request timeout")),
      });
    });
  }

  async function refreshXishuTable() {
    // 1) 先用缓存（加速启动/抗网络故障）
    const cached = loadXishuCache();
    if (cached) XISHU_TABLE = cached;

    // 2) 再拉远端（成功则覆盖并刷新缓存）
    // Torn 页面 CSP 会拦截 fetch 到非白名单域名，所以这里用 GM_xmlhttpRequest 绕过页面 CSP
    const data = await gmFetchJson(XISHU_REMOTE_URL);
    if (!isValidXishuTable(data)) throw new Error("invalid xishu json shape");

    XISHU_TABLE = data;
    saveXishuCache(data);
    return true;
  }

  let xishuLoadPromise = null;
  function ensureXishuLoaded() {
    if (xishuLoadPromise) return xishuLoadPromise;
    xishuLoadPromise = refreshXishuTable()
      .then(() => true)
      .catch((e) => {
        // CORS/网络失败时：继续用缓存/空表，不阻塞插件主逻辑
        console.warn("[daguofan][xishu] load remote failed, use cache/fallback:", e);
        return false;
      });
    return xishuLoadPromise;
  }

  let observer = null;
  let scheduled = false;

  function cssm(prefix) {
    // Torn 前端大量使用 CSS Modules：class 形如 `${prefix}___<hash>`
    // 不同电脑/不同版本 hash 可能变化，所以这里统一用“按前缀匹配”的选择器
    return `[class^="${prefix}___"],[class*=" ${prefix}___"]`;
  }

  function hasClassPrefix(el, prefix) {
    if (!el || !el.classList) return false;
    const p = `${prefix}___`;
    for (const c of el.classList) {
      if (c.startsWith(p)) return true;
    }
    return false;
  }

  function getCrimesRoot() {
    // 优先找 PC 端的 ID，如果没有（移动端），则返回 body 以便后续搜索
    return document.getElementById("faction-crimes-root") || document.body;
  }

  function findOcArea() {
    const root = getCrimesRoot();
    
    // 1. 尝试 PC 端原本的列表 class
    const pcList = root.querySelector(".tt-oc2-list");
    if (pcList) return pcList;

    // 2. 移动端兼容模式：反向查找
    // 只要能找到任意一张有 data-oc-id 属性的卡片，就取它的父级作为容器
    const anyCard = root.querySelector("[data-oc-id]");
    if (anyCard) {
      return anyCard.parentElement;
    }

    return null;
  }

  function getCards(ocArea) {
    //卡片有 data-oc-id（比 class 稳定）
    return Array.from(ocArea.querySelectorAll("[data-oc-id]"));
  }

  function getSlotWrappers(card) {
    // 以 slotHeader 按钮为锚点，向上取“包含 slotBody 的父级 div”
    const btns = card.querySelectorAll(`button${cssm("slotHeader")}`);
    const wrappers = [];
    const seen = new Set();

    for (const btn of btns) {
      const p = btn.parentElement;
      let w = null;
      if (p && p.querySelector(`:scope > div${cssm("slotBody")}`)) {
        w = p;
      } else {
        w = btn.closest("div");
      }

      if (!w) continue;
      if (seen.has(w)) continue;
      seen.add(w);
      wrappers.push(w);
    }
    return wrappers;
  }

  function isTargetPage() {
    // 只要是在 faction 页面，且 URL 包含 step=your
    const baseOk = location.pathname.includes("factions.php") && 
                   location.search.includes("step=your");
    
    // 并且页面里确实能找到 OC 卡片（或者 PC 容器），就认为是目标页面
    const hasContent = Boolean(document.getElementById("faction-crimes-root")) || 
                       Boolean(document.querySelector("[data-oc-id]"));

    const ok = baseOk && hasContent;

    if (DEBUG) {
      dlog("isTargetPage =", ok, "pathname/search =", location.pathname, location.search);
    }
    return ok;
  }

  function ensureStyle() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      .${PROFIT_CLASS}{
        margin-left: 6px;
        font-size: 12px;
        opacity: .9;
        color: #cfcfcf;
        white-space: nowrap;
        padding: 1px 6px;
        border-radius: 6px;
      }
      .${PROFIT_CLASS}.${WARN_CLASS}{
        color: #111;
        background: #ff6b6b;
        border: 1px solid rgba(0,0,0,.25);
        font-weight: 700;
        opacity: 1;
      }
      .${PROFIT_CLASS}.${HIGH_CLASS}{
        color: #111;
        background: #ffd43b;
        border: 1px solid rgba(0,0,0,.25);
        font-weight: 700;
        opacity: 1;
      }
      .${PROFIT_CLASS}.${TOP_CLASS}{
        color: #111;
        background: #ffe066;
        border: 1px solid rgba(0,0,0,.35);
        font-weight: 800;
        opacity: 1;
        box-shadow: 0 0 0 2px rgba(255, 224, 102, .35), 0 0 10px rgba(255, 224, 102, .55);
      }
      .${CARD_TOP_CLASS}{
        outline: 2px solid rgba(255, 224, 102, .45);
        box-shadow: 0 0 0 3px rgba(255, 224, 102, .15);
      }
      #${MODE_TOGGLE_ID}{
        display: inline-flex;
        align-items: center;
        gap: 6px;
        margin-left: 10px;
        padding: 2px 6px;
        border-radius: 8px;
        background: rgba(0,0,0,.18);
        border: 1px solid rgba(255,255,255,.08);
        color: #cfcfcf;
        font-size: 12px;
        line-height: 1.2;
        white-space: nowrap;
        user-select: none;
      }
      #${MODE_TOGGLE_ID} input{ cursor: pointer; }
      #${MODE_TOGGLE_ID} .dgf-oc-mode-label{ cursor: pointer; }

      /* 核心修改：移除 #faction-crimes-root 限定，改为通用属性选择器，适配移动端 */
      [data-dgf-flex="1"]{
        display: flex;
        flex-direction: column;
      }
    `;
    document.head.appendChild(style);
  }

  function parseIntSafe(v) {
    const m = String(v ?? "").match(/-?\d+/);
    return m ? Number.parseInt(m[0], 10) : NaN;
  }

  function parseFloatSafe(v) {
    const m = String(v ?? "").match(/-?\d+(?:\.\d+)?/);
    return m ? Number.parseFloat(m[0]) : NaN;
  }

  function normalizeOcName(name) {
    // OC 名称保持空格，但要把各种空白统一成单空格，避免 key 对不上
    return String(name ?? "")
      .replace(/\u00A0/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function normalizeRole(role) {
    // DOM 里常见 "Bomber #1" / "Picklock #2"；表里是 "Bomber#1"
    return String(role ?? "").replace(/\s+/g, "").trim();
  }

  function formatProfitValue(value) {
    // 系数表里有 20.933 这样的三位小数；显示时最多保留 3 位并去掉尾随 0
    const s = Number(value).toFixed(3);
    return s.replace(/\.?0+$/, "");
  }

  function loadMode() {
    try {
      const v = localStorage.getItem(MODE_STORAGE_KEY);
      if (v === MODE_DAILY || v === MODE_TOTAL) return v;
    } catch (e) {
      console.error("[daguofan][oc-profit]", t("err_load_mode"), e);
    }
    return MODE_DAILY;
  }

  function saveMode(mode) {
    try {
      localStorage.setItem(MODE_STORAGE_KEY, mode);
    } catch (e) {
      console.error("[daguofan][oc-profit]", t("err_save_mode"), e);
    }
  }

  function ensureModeToggle() {
    const root = getCrimesRoot() || document;
    const container =
      root.querySelector(`#faction-crimes-root ${cssm("buttonsContainer")}`) ||
      root.querySelector(cssm("buttonsContainer")) ||
      null;
    if (!container) return;

    if (container.querySelector(`#${MODE_TOGGLE_ID}`)) return;

    const wrap = document.createElement("label");
    wrap.id = MODE_TOGGLE_ID;
    wrap.title = t("mode_toggle_title");

    const input = document.createElement("input");
    input.type = "checkbox";
    input.checked = currentMode === MODE_DAILY;
    input.addEventListener(
      "change",
      () => {
        currentMode = input.checked ? MODE_DAILY : MODE_TOTAL;
        saveMode(currentMode);
        scheduleProcess();
      },
      { passive: true }
    );

    const text = document.createElement("span");
    text.className = "dgf-oc-mode-label";
    text.textContent = t("mode_toggle_label_daily");

    const hint = document.createElement("span");
    hint.style.opacity = "0.7";
    hint.textContent = t("mode_toggle_hint");

    wrap.appendChild(input);
    wrap.appendChild(text);
    wrap.appendChild(hint);

    // 放到 tab 容器最后面
    container.appendChild(wrap);
  }

  function parseRemainingDaysFromAriaLabel(label) {
    const s = String(label || "").trim();
    // e.g. "5 days 17 hours 43 minutes 14 seconds"
    const m = s.match(
      /(\d+)\s*days?\s+(\d+)\s*hours?\s+(\d+)\s*minutes?\s+(\d+)\s*seconds?/i
    );
    if (!m) return null;
    const days = Number.parseInt(m[1], 10);
    const hours = Number.parseInt(m[2], 10);
    const mins = Number.parseInt(m[3], 10);
    const secs = Number.parseInt(m[4], 10);
    if (![days, hours, mins, secs].every((x) => Number.isFinite(x))) return null;
    const totalSeconds = days * 86400 + hours * 3600 + mins * 60 + secs;
    if (!(totalSeconds > 0)) return null;
    return totalSeconds / 86400;
  }

  function parseRemainingDaysFromClockText(clockText) {
    // e.g. "05:17:43:14" => DD:HH:MM:SS；有时也可能只有 "HH:MM:SS"
    const s = String(clockText || "").trim();
    if (!s) return null;

    const parts = s.split(":").map((x) => Number.parseInt(x, 10));
    if (parts.some((x) => !Number.isFinite(x))) return null;

    let days = 0;
    let hours = 0;
    let mins = 0;
    let secs = 0;

    if (parts.length === 4) {
      [days, hours, mins, secs] = parts;
    } else if (parts.length === 3) {
      [hours, mins, secs] = parts;
    } else {
      return null;
    }

    const totalSeconds = days * 86400 + hours * 3600 + mins * 60 + secs;
    if (!(totalSeconds > 0)) return null;
    return totalSeconds / 86400;
  }

  function getOcRemainingDays(card, vacantCount) {
    // recruiting：按空位数估算剩余天数（你给的规则）
    if (card.querySelector('[aria-label="recruiting"]')) {
      return vacantCount > 0 ? vacantCount : null;
    }

    // active/planning：优先从 aria-label 解析
    const clockEl =
      card.querySelector(`div${cssm("title")}[aria-label]`) ||
      card.querySelector(`div${cssm("title")}`) ||
      null;
    if (!clockEl) return null;

    const byLabel = parseRemainingDaysFromAriaLabel(clockEl.getAttribute("aria-label"));
    if (Number.isFinite(byLabel) && byLabel > 0) return byLabel;

    const clockText = (clockEl.textContent || "").trim();
    const byText = parseRemainingDaysFromClockText(clockText);
    if (Number.isFinite(byText) && byText > 0) return byText;

    return null;
  }

  function isRecruitingTabActive() {
    // Torn OC 页面顶部 tab：Recruiting / Planning / Completed
    // 只在 tab 容器里找“当前激活”的按钮，避免页面其他地方也有 active 类导致误判
    const root = getCrimesRoot() || document;
    const container =
      root.querySelector(`#faction-crimes-root ${cssm("buttonsContainer")}`) ||
      root.querySelector(cssm("buttonsContainer")) ||
      null;
    if (!container) {
      // 有些情况下（或未来 UI 改动）可能没有这个容器；此时宁可继续处理，也不要直接失效
      dwarn(t("warn_missing_tabs"));
      return true;
    }

    const activeBtn =
      container.querySelector('button[aria-selected="true"]') ||
      container.querySelector('button[aria-current="true"]') ||
      container.querySelector(`button${cssm("active")}`) ||
      null;

    const nameEl =
      activeBtn?.querySelector(cssm("tabName")) ||
      activeBtn?.querySelector(".tabName___DdwH3") ||
      activeBtn;
    const text = (nameEl?.textContent || "").trim().toLowerCase();
    const isRecruiting = text === "recruiting";
    dlog(t("log_current_tab"), JSON.stringify(text), "isRecruiting =", isRecruiting);
    return isRecruiting;
  }

  function removeAllBadges(root) {
    root.querySelectorAll(`.${PROFIT_CLASS}`).forEach((el) => el.remove());
  }

  function ensureOcAreaFlex(ocArea) {
    if (!ocArea) return;
    if (ocArea.getAttribute("data-dgf-flex") === "1") return;

    // 只在原本不是 flex/grid 时才强制改为 flex，尽量少干预页面布局
    let display = "";
    try {
      display = window.getComputedStyle(ocArea).display || "";
    } catch (e) {
      // getComputedStyle 出错时宁可不改布局
      console.error("[daguofan][oc-profit]", t("err_get_computed_style"), e);
      return;
    }

    const d = display.toLowerCase();
    if (d.includes("flex") || d.includes("grid")) {
      ocArea.setAttribute("data-dgf-flex", "1");
      return;
    }

    ocArea.setAttribute("data-dgf-flex", "1");
  }

  function isSlotVacant(slotWrapperEl) {
    // 空缺岗位：外层常见 waitingJoin___*，slotBody 不带 validSlot，并出现 joinContainer/joinButton
    if (!slotWrapperEl) return false;

    // 强特征：出现 Join 区域 / Join 按钮 -> 认为空缺
    if (
      hasClassPrefix(slotWrapperEl, "waitingJoin") ||
      slotWrapperEl.querySelector(cssm("joinContainer")) ||
      slotWrapperEl.querySelector(`button${cssm("joinButton")}`) ||
      null
    ) {
      return true;
    }

    // 强特征：出现成员信息 / 个人主页链接 -> 认为已有人
    if (
      slotWrapperEl.querySelector(cssm("badgeContainer")) ||
      slotWrapperEl.querySelector(`${cssm("badge")}, ${cssm("textName")}`) ||
      slotWrapperEl.querySelector('a[href*="profiles.php?XID="]')
    ) {
      return false;
    }

    const body =
      slotWrapperEl.querySelector(`div${cssm("slotBody")}`);
    if (!body) return false;

    if (hasClassPrefix(body, "validSlot")) return false;

    // 兜底：宁可不显示，也不要误显示在“已有人岗位”
    return false;
  }

  function upsertBadge(slotHeaderBtn, { text, kind, profitValue, runId }) {
    const existing = slotHeaderBtn.querySelector(`.${PROFIT_CLASS}`);

    const badge = existing || document.createElement("span");
    badge.className = PROFIT_CLASS;
    badge.textContent = text;
    badge.setAttribute(BADGE_KIND_ATTR, kind);
    if (runId) badge.setAttribute(BADGE_RUN_ATTR, String(runId));

    if (kind === "warn") {
      badge.classList.add(WARN_CLASS);
      badge.removeAttribute(BADGE_SCORE_ATTR);
    } else {
      badge.classList.remove(WARN_CLASS, HIGH_CLASS, TOP_CLASS);
      if (Number.isFinite(profitValue)) {
        badge.setAttribute(BADGE_SCORE_ATTR, String(profitValue));
      } else {
        badge.removeAttribute(BADGE_SCORE_ATTR);
      }
    }

    if (existing) return;

    // 优先放在成功率数字后面；如果结构变化，再兜底插到标题后
    const chanceEl =
      slotHeaderBtn.querySelector(`div${cssm("successChance")}`);
    if (chanceEl && chanceEl.parentNode) {
      chanceEl.insertAdjacentElement("afterend", badge);
    } else {
      const titleEl =
        slotHeaderBtn.querySelector(`span${cssm("title")}`);
      if (titleEl) titleEl.insertAdjacentElement("afterend", badge);
      else slotHeaderBtn.appendChild(badge);
    }
  }

  function getXishuCoeff(ocName, level, role, chance) {
    const nameKey = normalizeOcName(ocName);
    const roleKey = normalizeRole(role);
    const levelKey = String(level);

    const byOc = XISHU_TABLE[nameKey];
    if (!byOc) {
      dlog(t("log_xishu_missing_oc"), JSON.stringify(nameKey));
      return null;
    }
    const byLevel = byOc[levelKey];
    if (!byLevel) {
      dlog(t("log_xishu_missing_level"), levelKey, t("log_label_oc_name"), JSON.stringify(nameKey));
      return null;
    }
    const ranges = byLevel[roleKey];
    if (!Array.isArray(ranges) || ranges.length === 0) {
      dlog(
        t("log_xishu_missing_role"),
        JSON.stringify(roleKey),
        t("log_label_oc_name"),
        JSON.stringify(nameKey),
        t("log_label_level"),
        levelKey
      );
      return null;
    }

    // 约定：r 是 [min, max, a]
    for (const r of ranges) {
      if (!Array.isArray(r) || r.length < 3) continue;
      const min = parseFloatSafe(r[0]);
      const max = parseFloatSafe(r[1]);
      const a = parseFloatSafe(r[2]);
      if (!Number.isFinite(min) || !Number.isFinite(max) || !Number.isFinite(a)) continue;
      if (chance >= min && chance <= max) return a;
    }
    return null;
  }

  function getXishuMatchResult(ocName, level, role, chance) {
    const nameKey = normalizeOcName(ocName);
    const roleKey = normalizeRole(role);
    const levelKey = String(level);

    const byOc = XISHU_TABLE[nameKey];
    if (!byOc) return { a: null, reason: "missing_oc" };
    const byLevel = byOc[levelKey];
    if (!byLevel) return { a: null, reason: "missing_level" };
    const ranges = byLevel[roleKey];
    if (!Array.isArray(ranges) || ranges.length === 0) return { a: null, reason: "missing_role" };

    let minAll = Infinity;
    let maxAll = -Infinity;
    for (const r of ranges) {
      if (!Array.isArray(r) || r.length < 3) continue;
      const min = parseFloatSafe(r[0]);
      const max = parseFloatSafe(r[1]);
      if (Number.isFinite(min)) minAll = Math.min(minAll, min);
      if (Number.isFinite(max)) maxAll = Math.max(maxAll, max);
    }

    const a = getXishuCoeff(nameKey, levelKey, roleKey, chance);
    if (Number.isFinite(a)) return { a, reason: "ok" };

    if (Number.isFinite(minAll) && chance < minAll) return { a: null, reason: "chance_too_low", minAll, maxAll };
    if (Number.isFinite(maxAll) && chance > maxAll) return { a: null, reason: "chance_too_high", minAll, maxAll };
    return { a: null, reason: "no_match", minAll, maxAll };
  }

  function applyProfitHighlights(root) {
    const scoreBadges = root.querySelectorAll(`.${PROFIT_CLASS}[${BADGE_KIND_ATTR}="profit"]`);
    let maxScore = 0;
    for (const el of scoreBadges) {
      const v = Number.parseFloat(el.getAttribute(BADGE_SCORE_ATTR) || "");
      if (Number.isFinite(v)) maxScore = Math.max(maxScore, v);
    }
    if (!(maxScore > 0)) return;

    for (const el of scoreBadges) {
      el.classList.remove(HIGH_CLASS, TOP_CLASS);
      const v = Number.parseFloat(el.getAttribute(BADGE_SCORE_ATTR) || "");
      if (!Number.isFinite(v)) continue;
      if (v === maxScore) el.classList.add(TOP_CLASS);
      else if (v >= maxScore * 0.8) el.classList.add(HIGH_CLASS);
    }
  }

  function applyCardOrderByScore(ocArea, scoredCards) {
    // 不移动 DOM（React 页面移动节点风险大），仅用 CSS order 做视觉排序
    ensureOcAreaFlex(ocArea);

    const sorted = [...scoredCards].sort((a, b) => {
      const as = Number.isFinite(a.score) ? a.score : -1;
      const bs = Number.isFinite(b.score) ? b.score : -1;
      if (bs !== as) return bs - as;
      return a.originalIndex - b.originalIndex;
    });

    // order 必须是整数：按名次赋值即可
    for (let i = 0; i < sorted.length; i++) {
      const el = sorted[i].el;
      if (!el) continue;
      const nextOrder = String(i);
      if (el.style.order !== nextOrder) el.style.order = nextOrder;
    }
  }

  function cleanupStaleBadges(root, runId) {
    const rid = String(runId);
    root.querySelectorAll(`.${PROFIT_CLASS}`).forEach((el) => {
      const v = el.getAttribute(BADGE_RUN_ATTR) || "";
      if (v !== rid) el.remove();
    });
  }

  function processOnce() {
    if (!isTargetPage()) {
      dlog(t("log_not_target_page"), location.pathname, location.search, location.hash);
      return;
    }

    const ocArea = findOcArea();
    if (!ocArea) {
      dwarn(t("warn_missing_oc_area"));
      return;
    }

    ensureStyle();
    ensureModeToggle();

    // 只在 Recruiting 栏位显示
    const isRecruiting = isRecruitingTabActive();
    if (!isRecruiting) {
      // 只有在“从 recruiting -> 非 recruiting”切换时才做一次性清理，避免每帧都删 DOM
      if (lastRecruitingState !== false) {
        isMutatingByScript = true;
        try {
          removeAllBadges(ocArea);
          if (lastTopCard) lastTopCard.classList.remove(CARD_TOP_CLASS);
          lastTopCard = null;
        } finally {
          isMutatingByScript = false;
        }
      }
      lastRecruitingState = false;
      dlog(t("log_not_in_recruiting"));
      return;
    }
    lastRecruitingState = true;

    const cards = getCards(ocArea);
    dlog(t("log_found_cards"), cards.length);

    // 先做读/算，最后集中写 DOM，减少抖动
    const badgeOps = [];
    const scoredCards = [];
    const runId = ++runSeq;

    for (let cardIndex = 0; cardIndex < cards.length; cardIndex++) {
      const card = cards[cardIndex];
      const ocNameEl = card.querySelector(`p${cssm("panelTitle")}`);
      const ocName = normalizeOcName(ocNameEl?.textContent);

      const levelEl = card.querySelector(`span${cssm("levelValue")}`);
      const level = parseIntSafe(levelEl?.textContent);
      if (!Number.isFinite(level)) {
        dwarn(t("warn_parse_level"), JSON.stringify(ocName), "levelText =", levelEl?.textContent);
        continue;
      }

      // 仅 7/8 级 OC 显示收益
      if (level !== 7 && level !== 8) {
        dlog(t("log_skip_non_78"), JSON.stringify(ocName), "level =", level);
        scoredCards.push({ el: card, score: -1, originalIndex: cardIndex });
        continue;
      }

      // 统计同一个 OC 的空缺岗位数 n
      const slotWrappers = getSlotWrappers(card);
      let vacantCount = 0;
      for (const w of slotWrappers) if (isSlotVacant(w)) vacantCount += 1;
      dlog(t("log_oc_slot_stats"), JSON.stringify(ocName), "level =", level, "slots =", slotWrappers.length, "vacant =", vacantCount);
      if (vacantCount <= 0) {
        scoredCards.push({ el: card, score: -1, originalIndex: cardIndex });
        continue;
      }

      const remainingDays = getOcRemainingDays(card, vacantCount);
      let cardMaxScore = -1;

      // 只对“岗位空缺”的岗位显示收益：总收益 = a * n；日均收益 = 总收益 / 剩余天数
      for (const slotWrapper of slotWrappers) {
        const btn =
          slotWrapper.querySelector(`:scope > button${cssm("slotHeader")}`) ||
          slotWrapper.querySelector(`button${cssm("slotHeader")}`);
        if (!btn) continue;

        if (!isSlotVacant(slotWrapper)) continue;

        const roleEl = btn.querySelector(`span${cssm("title")}`);
        const role = normalizeRole(roleEl?.textContent);

        const chanceEl = btn.querySelector(`div${cssm("successChance")}`);
        const chance = parseIntSafe(chanceEl?.textContent);
        if (!Number.isFinite(chance)) {
          dwarn(t("warn_parse_chance"), JSON.stringify(ocName), JSON.stringify(role), "chanceText =", chanceEl?.textContent);
          continue;
        }

        const match = getXishuMatchResult(ocName, level, role, chance);
        if (match.reason === "chance_too_low") {
          badgeOps.push({ btn, text: t("warn_chance_too_low"), kind: "warn", profitValue: NaN, runId });
          continue;
        }
        if (match.reason !== "ok" || !Number.isFinite(match.a)) {
          dlog(t("log_xishu_no_hit"), { ocName, level, role, chance, vacantCount, reason: match.reason });
          continue;
        }

        const totalProfit = match.a * vacantCount;

        let score = totalProfit;
        let text = t("badge_total", { value: formatProfitValue(totalProfit) });

        if (currentMode === MODE_DAILY) {
          if (Number.isFinite(remainingDays) && remainingDays > 0) {
            score = totalProfit / remainingDays;
          } else {
            // 解析不到剩余时间时，兜底仍按总收益（避免除 0/NaN 导致排序全乱）
            score = totalProfit;
          }
          text = t("badge_daily", { value: formatProfitValue(score) });
        }

        cardMaxScore = Math.max(cardMaxScore, score);
        dlog(t("log_write_profit"), {
          mode: currentMode,
          ocName,
          level,
          role,
          chance,
          a: match.a,
          vacantCount,
          remainingDays,
          totalProfit,
          score,
          text,
        });
        badgeOps.push({ btn, text, kind: "profit", profitValue: score, runId });
      }

      scoredCards.push({ el: card, score: cardMaxScore, originalIndex: cardIndex });
    }

    // ====== 集中写 DOM（并在此阶段抑制 observer） ======
    isMutatingByScript = true;
    try {
      // 更新/插入 badge（尽量复用既有节点，避免 remove+insert）
      for (const op of badgeOps) {
        upsertBadge(op.btn, op);
      }
      // 清理本次没更新到的旧 badge（例如某岗位不再空缺/卡片被替换）
      cleanupStaleBadges(ocArea, runId);

      // 按“分数”做视觉排序（不移动节点）
      applyCardOrderByScore(ocArea, scoredCards);

      // 让高收益岗位更显眼（按当前页面最大分数做阈值）
      applyProfitHighlights(ocArea);

      // 高亮最高分卡片（只处理上一张和新一张，减少 class 抖动）
      const sortedByScore = [...scoredCards]
        .filter((x) => Number.isFinite(x.score) && x.score > 0)
        .sort((a, b) => b.score - a.score);
      const top = sortedByScore.length > 0 ? sortedByScore[0].el : null;
      if (lastTopCard && lastTopCard !== top) lastTopCard.classList.remove(CARD_TOP_CLASS);
      if (top) top.classList.add(CARD_TOP_CLASS);
      lastTopCard = top;
    } finally {
      isMutatingByScript = false;
    }
  }

  function scheduleProcess() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      try {
        processOnce();
      } catch (e) {
        // 油猴脚本里直接输出，便于定位页面结构变化
        console.error("[daguofan][oc-profit]", t("err_process_failed"), e);
      }
    });
  }

  function setupObserver() {
    if (observer) {
      observer.disconnect();
      observer = null;
    }

    const target = findOcArea() || getCrimesRoot();
    if (!target) return false;

    observer = new MutationObserver(() => {
      if (isMutatingByScript) return;
      scheduleProcess();
    });
    observer.observe(target, { childList: true, subtree: true });
    return true;
  }

  function boot() {
    currentMode = loadMode();
    // 初次处理 + 监听后续变化
    scheduleProcess();

    // ocArea 可能延迟出现：先用 body 兜底观察，等 ocArea 出现再切换到精确观察
    if (!setupObserver()) {
      const tmp = new MutationObserver(() => {
        if (setupObserver()) {
          tmp.disconnect();
          scheduleProcess();
        }
      });
      tmp.observe(document.body, { childList: true, subtree: true });
    }
  }

  // Torn 是 SPA：hash 变化时重跑
  function bootEntry() {
    // 确保首次渲染前系数表已准备好；失败则降级继续跑（只是命中率会低/无显示）
    ensureXishuLoaded().finally(() => boot());
  }

  window.addEventListener("hashchange", () => bootEntry(), { passive: true });
  bootEntry();
})();



