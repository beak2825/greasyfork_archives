// ==UserScript==
// @name         98堂-搜索优化
// @namespace    https://www.sehuatang.net
// @version      0.3.2
// @description  搜索结果页：本地排序 + 本地过滤（版块/关键词）。
// @author       8jg
// @match        *://sehuatang.net/*
// @match        *://*.sehuatang.net/*
// @match        *://sehuatang.org/*
// @match        *://*.sehuatang.org/*
// 说明：备用网址/镜像域名可能会不定期更换。
// 如脚本在备用网址/镜像域名下不生效或打不开页面，请把下面两行里的 `dmn12.vip` 替换为最新地址（只换域名部分即可）。
// 注意要保留两行格式：`*://主域/*` 与 `*://*.主域/*`（覆盖主域和所有子域）。
// @match        *://dmn12.vip/*
// @match        *://*.dmn12.vip/*
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-end
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/563275/98%E5%A0%82-%E6%90%9C%E7%B4%A2%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/563275/98%E5%A0%82-%E6%90%9C%E7%B4%A2%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function () {
    "use strict";

    if (!/\/search\.php$/i.test(location.pathname)) return;
    const params = new URLSearchParams(location.search);
    const mod = params.get("mod");
    const hasSearchId = params.has("searchid") || params.has("searchmd5");
    const hasSearchForm = Boolean(
        document.querySelector('input[name="srchtxt"]')
    );
    if (mod && mod !== "forum") return;
    if (!hasSearchId && !hasSearchForm) return;

    const ORDERBY_VALUES = new Set(["replies", "views"]);

    const STORAGE_ORDERBY = "bgsh-sort-fix-orderby";
    const STORAGE_EXCLUDE_FID_143 = "bgsh-sort-fix-exclude-fid-143";
    const STORAGE_EXCLUDE_FIDS = "bgsh-sort-fix-exclude-fids";
    const STORAGE_INCLUDE_FIDS = "bgsh-sort-fix-include-fids";
    const STORAGE_EXCLUDE_KEYWORDS = "bgsh-sort-fix-exclude-keywords";
    const STORAGE_INCLUDE_KEYWORDS = "bgsh-sort-fix-include-keywords";
    const STORAGE_KEYWORD_PRESET_STATE = "bgsh-sort-fix-keyword-preset-state";
    const DEFAULT_ORDERBY = "replies";
    const EXCLUDE_FID = "143";
    const DEFAULT_EXCLUDE_KEYWORDS = "sha1, AI";
    const DEFAULT_INCLUDE_KEYWORDS = "115, ed2k, 自转, 整理";
    const KEYWORD_PRESETS = [
        "sha1",
        "AI",
        "ed2k",
        "破解",
        "整理",
        "原档",
        "自转",
        "4K",
        "115",
        "网盘",
        "增强",
        "磁力",
        "BT",
    ];

    const normalizeOrderby = (value) =>
        ORDERBY_VALUES.has(value) ? value : DEFAULT_ORDERBY;
    const normalizeBool = (value) =>
        value === true || value === "true" || value === 1 || value === "1";

    let currentOrderby = normalizeOrderby(
        GM_getValue(STORAGE_ORDERBY, DEFAULT_ORDERBY)
    );
    let excludeFid143 = normalizeBool(
        GM_getValue(STORAGE_EXCLUDE_FID_143, false)
    );
    let excludeFidsText = String(GM_getValue(STORAGE_EXCLUDE_FIDS, "") || "");
    let includeFidsText = String(GM_getValue(STORAGE_INCLUDE_FIDS, "") || "");
    let excludeKeywordsText = String(
        GM_getValue(STORAGE_EXCLUDE_KEYWORDS, DEFAULT_EXCLUDE_KEYWORDS) || ""
    );
    let includeKeywordsText = String(
        GM_getValue(STORAGE_INCLUDE_KEYWORDS, DEFAULT_INCLUDE_KEYWORDS) || ""
    );

    const normalizeKeyword = (s) => String(s || "").trim().toLowerCase();
    const allowedPresetKeywords = new Set(KEYWORD_PRESETS.map(normalizeKeyword));
    const readPresetState = () => {
        const raw = GM_getValue(STORAGE_KEYWORD_PRESET_STATE, {});
        const obj =
            raw && typeof raw === "object"
                ? raw
                : (() => {
                      try {
                          return JSON.parse(String(raw || ""));
                      } catch {
                          return {};
                      }
                  })();
        const out = {};
        Object.entries(obj || {}).forEach(([k, v]) => {
            const key = normalizeKeyword(k);
            if (!allowedPresetKeywords.has(key)) return;
            if (v === "include" || v === "exclude") out[key] = v;
        });
        // 丢弃非预设关键词
        GM_setValue(STORAGE_KEYWORD_PRESET_STATE, out);
        return out;
    };
    let keywordPresetState = readPresetState();

    let excludeFids = new Set();
    let includeFids = new Set();
    let excludeKeywordRules = [];
    let includeKeywordRules = [];

    rebuildFilterState();

    GM_setValue(STORAGE_ORDERBY, currentOrderby);

    const panelState = createPanel();
    attachPanel(panelState.panel);

    if (hasResults()) {
        applyClientSort();
    }

    function hasResults() {
        return Boolean(document.querySelector(".slst, #threadlist, .pbw"));
    }

    function extractSortKeys(pbw) {
        const metaText = (pbw.querySelector(".xg1")?.textContent || "")
            .replace(/\s+/g, " ")
            .trim();
        const bodyText = (pbw.textContent || "").replace(/\s+/g, " ").trim();

        const parseNumberCN = (input) => {
            const raw = String(input).trim().replace(/,/g, "");
            const m = raw.match(/^(\d+(?:\.\d+)?)(万|亿)?$/);
            if (!m) {
                const digits = raw.match(/\d+/g);
                return digits ? Number.parseInt(digits.join(""), 10) : 0;
            }
            const n = Number.parseFloat(m[1]);
            const unit = m[2];
            if (!Number.isFinite(n)) return 0;
            if (unit === "万") return Math.round(n * 10000);
            if (unit === "亿") return Math.round(n * 100000000);
            return Math.round(n);
        };

        const matchFirst = (text, re) => {
            const m = text.match(re);
            return m ? parseNumberCN(m[1]) : 0;
        };

        const replies =
            matchFirst(metaText, /([0-9.万亿,]+)\s*个?回复/) ||
            matchFirst(metaText, /回复[:：]?\s*([0-9.万亿,]+)/) ||
            matchFirst(bodyText, /回复[:：]?\s*([0-9.万亿,]+)/);

        const views =
            matchFirst(metaText, /([0-9.万亿,]+)\s*(?:次)?(?:查看|浏览)/) ||
            matchFirst(metaText, /(?:查看|浏览)[:：]?\s*([0-9.万亿,]+)/) ||
            matchFirst(bodyText, /(?:查看|浏览)[:：]?\s*([0-9.万亿,]+)/);
        return { replies, views };
    }

    function applyClientSort() {
        const pbws = Array.from(document.querySelectorAll(".pbw"));
        if (!pbws.length) return false;

        const groups = new Map();
        pbws.forEach((item) => {
            const parent = item.parentElement;
            if (!parent) return;
            const list = groups.get(parent) || [];
            list.push(item);
            groups.set(parent, list);
        });

        const getKey = (pbw) => {
            const keys = extractSortKeys(pbw);
            switch (currentOrderby) {
                case "views":
                    return keys.views;
                case "replies":
                default:
                    return keys.replies;
            }
        };

        let sortedAny = false;
        groups.forEach((items, parent) => {
            if (items.length < 2) return;
            const decorated = items.map((el) => ({ el, key: getKey(el) }));
            decorated.sort((a, b) => {
                return (b.key || 0) - (a.key || 0);
            });
            decorated.forEach(({ el }) => parent.appendChild(el));
            sortedAny = true;
        });
        applyFilter(pbws);
        return sortedAny;
    }

    function parseFidSet(input) {
        const s = new Set();
        const m = String(input || "").match(/\d+/g) || [];
        m.forEach((n) => s.add(String(Number.parseInt(n, 10))));
        return s;
    }

    function parseKeywordRules(input) {
        const tokens = String(input || "")
            .split(/[,\n，]+/g)
            .map((t) => t.trim())
            .filter(Boolean);
        return tokens.map((t) => t.toLowerCase());
    }

    function matchesKeywordRules(title, rules) {
        if (!title) return false;
        if (!rules.length) return false;
        const t = String(title).toLowerCase();
        return rules.some((kw) => t.includes(kw));
    }

    function extractFidFromPbw(pbw) {
        const links = Array.from(pbw.querySelectorAll("a[href]"));
        for (const link of links) {
            const href = link.getAttribute("href") || "";
            const m = href.match(/(?:\bfid=|forum-)(\d+)/i);
            if (m && m[1]) return String(Number.parseInt(m[1], 10));
        }
        return "";
    }

    function extractTitle(pbw) {
        const el =
            pbw.querySelector("a.xst") ||
            pbw.querySelector("h3 a[href]") ||
            pbw.querySelector(".xs3 a[href]") ||
            pbw.querySelector('a[href*="viewthread"]');
        return (el?.textContent || "").trim();
    }

    function rebuildFilterState() {
        excludeFids = parseFidSet(excludeFidsText);
        if (excludeFid143) excludeFids.add(EXCLUDE_FID);
        includeFids = parseFidSet(includeFidsText);

        const uniq = (arr) => Array.from(new Set((arr || []).filter(Boolean)));
        const manualExclude = parseKeywordRules(excludeKeywordsText);
        const manualInclude = parseKeywordRules(includeKeywordsText);

        const presetInclude = [];
        const presetExclude = [];
        Object.entries(keywordPresetState || {}).forEach(([kw, state]) => {
            if (state === "include") presetInclude.push(kw);
            else if (state === "exclude") presetExclude.push(kw);
        });

        excludeKeywordRules = uniq([...manualExclude, ...presetExclude]);
        const excludeSet = new Set(excludeKeywordRules);
        includeKeywordRules = uniq([...manualInclude, ...presetInclude]).filter(
            (kw) => !excludeSet.has(kw)
        );
    }

    function applyFilter(pbws = Array.from(document.querySelectorAll(".pbw"))) {
        const hasIncludeFids = includeFids.size > 0;
        const hasIncludeKeywords = includeKeywordRules.length > 0;
        const includeActive = hasIncludeFids || hasIncludeKeywords;
        const excludeActive =
            excludeFids.size > 0 || excludeKeywordRules.length > 0;
        if (!includeActive && !excludeActive) {
            pbws.forEach((pbw) => (pbw.style.display = ""));
            return false;
        }

        pbws.forEach((pbw) => {
            const fid = extractFidFromPbw(pbw);
            const title = extractTitle(pbw);
            let okInclude = true;
            if (hasIncludeFids) okInclude = fid && includeFids.has(fid);
            if (okInclude && hasIncludeKeywords) {
                okInclude = matchesKeywordRules(title, includeKeywordRules);
            }
            const okExclude =
                (fid && excludeFids.has(fid)) ||
                matchesKeywordRules(title, excludeKeywordRules);
            pbw.style.display = okInclude && !okExclude ? "" : "none";
        });
        return includeActive || excludeActive;
    }

    function ensureStyles() {
        if (document.getElementById("bgsh-sort-fix-style")) return;
        const style = document.createElement("style");
        style.id = "bgsh-sort-fix-style";
        style.textContent = `
#bgsh-sort-fix-panel{
  --bgsh-bg: rgba(255,255,255,.92);
  --bgsh-border: rgba(15,23,42,.12);
  --bgsh-text: #0f172a;
  --bgsh-sub: rgba(15,23,42,.62);
  --bgsh-accent-rgb: 37, 99, 235;
  --bgsh-accent: rgb(var(--bgsh-accent-rgb));
  --bgsh-accent-bg: rgba(var(--bgsh-accent-rgb), .14);
  display:flex;
  align-items:center;
  gap:10px;
  padding:10px 12px;
  border-radius:14px;
  border:1px solid var(--bgsh-border);
  background: var(--bgsh-bg);
  max-width: 768px;
  box-sizing: border-box;
  backdrop-filter: blur(8px);
  box-shadow: 0 10px 30px rgba(15,23,42,.10);
  color: var(--bgsh-text);
  font-size:12px;
  line-height:1;
  flex-wrap:wrap;
  user-select:none;
}
.bgsh-title{
  font-weight:800;
  letter-spacing:.4px;
}
.bgsh-seg{
  display:inline-flex;
  align-items:center;
  border:1px solid var(--bgsh-border);
  border-radius:12px;
  overflow:hidden;
  background: rgba(15,23,42,.04);
}
.bgsh-btn{
  appearance:none;
  border:0;
  background:transparent;
  padding:7px 10px;
  cursor:pointer;
  color: var(--bgsh-sub);
  font-size:12px;
}
.bgsh-btn:hover{
  color: var(--bgsh-text);
  background: rgba(15,23,42,.04);
}
.bgsh-btn.is-active{
  color: var(--bgsh-accent);
  background: var(--bgsh-accent-bg);
}
.bgsh-chip{
  appearance:none;
  border:1px solid var(--bgsh-border);
  border-radius:12px;
  background: rgba(15,23,42,.04);
  padding:7px 10px;
  cursor:pointer;
  color: var(--bgsh-sub);
  font-size:12px;
}
.bgsh-chip:hover{
  color: var(--bgsh-text);
  background: rgba(15,23,42,.06);
}
.bgsh-chip.is-open{
  color: var(--bgsh-accent);
  background: rgba(var(--bgsh-accent-rgb), .10);
  border-color: rgba(var(--bgsh-accent-rgb), .35);
}
.bgsh-chipgroup{
  display:flex;
  flex-wrap:wrap;
  gap:8px;
}
.bgsh-chip.is-include{
  color: rgba(6,95,70,1);
  border-color: rgba(16,185,129,.35);
  background: rgba(16,185,129,.14);
}
.bgsh-chip.is-exclude{
  color: rgba(127,29,29,1);
  border-color: rgba(239,68,68,.35);
  background: rgba(239,68,68,.10);
  text-decoration: line-through;
}
.bgsh-subcard{
  border:1px dashed rgba(15,23,42,.16);
  border-radius:14px;
  padding:10px;
  background: rgba(15,23,42,.02);
  display:flex;
  flex-direction:column;
  gap:10px;
}
.bgsh-subcard-title{
  font-weight:800;
  color: var(--bgsh-text);
  letter-spacing:.2px;
}
.bgsh-row{
  display:flex;
  align-items:center;
  gap:10px;
}
.bgsh-row-label{
  width:56px;
  flex:0 0 auto;
  font-size:11px;
  font-weight:800;
  color: var(--bgsh-sub);
}
.bgsh-row .bgsh-input{
  flex:1;
  width:auto;
  min-width: 0;
}
.bgsh-collapse{
  display:none;
  width:100%;
  margin-top:8px;
  padding-top:10px;
  border-top:1px dashed rgba(15,23,42,.14);
  gap:10px;
}
.bgsh-collapse.is-open{
  display:flex;
  flex-direction:column;
}
.bgsh-group{
  display:flex;
  flex-direction:column;
  gap:8px;
  min-width: 0;
  border:1px solid var(--bgsh-border);
  border-radius:14px;
  padding:10px 10px 12px;
  background: rgba(255,255,255,.70);
}
.bgsh-field{
  display:flex;
  flex-direction:column;
  gap:6px;
  min-width: 0;
}
.bgsh-label{
  color: var(--bgsh-sub);
  font-size:11px;
}
.bgsh-input{
  width:100%;
  box-sizing:border-box;
  border:1px solid var(--bgsh-border);
  background: rgba(255,255,255,.85);
  border-radius:12px;
  padding:8px 10px;
  font-size:12px;
  color: var(--bgsh-text);
  outline:none;
}
.bgsh-input:focus{
  border-color: rgba(var(--bgsh-accent-rgb), .45);
  box-shadow: 0 0 0 3px rgba(var(--bgsh-accent-rgb), .12);
}
.bgsh-switch{
  position:relative;
  display:flex;
  align-items:center;
  gap:8px;
  cursor:pointer;
  color: var(--bgsh-sub);
}
.bgsh-switch input{
  position:absolute;
  opacity:0;
  width:1px;
  height:1px;
}
.bgsh-switch-ui{
  width:38px;
  height:22px;
  border-radius:999px;
  border:1px solid var(--bgsh-border);
  background: rgba(15,23,42,.10);
  position:relative;
  flex: 0 0 auto;
  transition: background .15s ease, border-color .15s ease;
}
.bgsh-switch-ui::after{
  content:"";
  width:18px;
  height:18px;
  border-radius:999px;
  background:#fff;
  position:absolute;
  top:50%;
  left:2px;
  transform: translateY(-50%);
  box-shadow: 0 6px 16px rgba(15,23,42,.18);
  transition: transform .15s ease;
}
.bgsh-switch input:checked + .bgsh-switch-ui{
  background: rgba(var(--bgsh-accent-rgb), .35);
  border-color: rgba(var(--bgsh-accent-rgb), .55);
}
.bgsh-switch input:checked + .bgsh-switch-ui::after{
  transform: translate(16px,-50%);
}
.bgsh-switch-text{
  color: var(--bgsh-text);
}
`;
        document.head.appendChild(style);
    }

    function createPanel() {
        ensureStyles();
        const panel = document.createElement("div");
        panel.id = "bgsh-sort-fix-panel";

        const title = document.createElement("div");
        title.className = "bgsh-title";
        title.textContent = "排序";
        panel.appendChild(title);

        const seg = document.createElement("div");
        seg.className = "bgsh-seg";

        const btnReplies = document.createElement("button");
        btnReplies.type = "button";
        btnReplies.className = "bgsh-btn";
        btnReplies.textContent = "回复数";

        const btnViews = document.createElement("button");
        btnViews.type = "button";
        btnViews.className = "bgsh-btn";
        btnViews.textContent = "浏览量";

        seg.appendChild(btnReplies);
        seg.appendChild(btnViews);
        panel.appendChild(seg);

        const updateActive = () => {
            btnReplies.classList.toggle("is-active", currentOrderby === "replies");
            btnViews.classList.toggle("is-active", currentOrderby === "views");
        };
        const setOrderby = (value) => {
            const next = normalizeOrderby(value);
            if (next === currentOrderby) return;
            currentOrderby = next;
            GM_setValue(STORAGE_ORDERBY, currentOrderby);
            updateActive();
            applyClientSort();
        };
        btnReplies.addEventListener("click", () => setOrderby("replies"));
        btnViews.addEventListener("click", () => setOrderby("views"));
        updateActive();

        const filterLabel = document.createElement("label");
        filterLabel.className = "bgsh-switch";

        const filterCheckbox = document.createElement("input");
        filterCheckbox.type = "checkbox";
        filterCheckbox.checked = excludeFid143;

        const switchUI = document.createElement("span");
        switchUI.className = "bgsh-switch-ui";

        const filterText = document.createElement("span");
        filterText.className = "bgsh-switch-text";
        filterText.textContent = "排除悬赏区";
        filterText.title = "排除：求片问答悬赏区";

        filterLabel.appendChild(filterCheckbox);
        filterLabel.appendChild(switchUI);
        filterLabel.appendChild(filterText);
        panel.appendChild(filterLabel);

        const toggleBtn = document.createElement("button");
        toggleBtn.type = "button";
        toggleBtn.className = "bgsh-chip";
        toggleBtn.textContent = "自定义过滤";
        panel.appendChild(toggleBtn);

        const collapse = document.createElement("div");
        collapse.className = "bgsh-collapse";

        const makeGroup = () => {
            const group = document.createElement("div");
            group.className = "bgsh-group";
            return group;
        };

        const makeField = (labelText, inputEl) => {
            const field = document.createElement("div");
            field.className = "bgsh-field";
            const label = document.createElement("div");
            label.className = "bgsh-label";
            label.textContent = labelText;
            field.appendChild(label);
            field.appendChild(inputEl);
            return field;
        };

        const debounce = (fn, ms) => {
            let t = 0;
            return (...args) => {
                window.clearTimeout(t);
                t = window.setTimeout(() => fn(...args), ms);
            };
        };

        const applyDebounced = debounce(() => {
            rebuildFilterState();
            applyFilter();
        }, 120);

        const FID_PRESETS = [
            { fid: "95", name: "综合讨论区" },
            { fid: "103", name: "高清中文字幕" },
            { fid: "97", name: "资源出售区" },
            { fid: "166", name: "AI专区" },
            { fid: "155", name: "原创自拍区" },
            { fid: "159", name: "新作区" },
            { fid: "146", name: "自译字幕区" },
            { fid: "2", name: "国产原创" },
            { fid: "141", name: "网友原创区" },
            { fid: "151", name: "4K原版" },
        ];

        const excludeKeywordsInput = document.createElement("input");
        excludeKeywordsInput.className = "bgsh-input";
        excludeKeywordsInput.placeholder = "关键词，逗号分隔";
        excludeKeywordsInput.value = excludeKeywordsText;

        const includeKeywordsInput = document.createElement("input");
        includeKeywordsInput.className = "bgsh-input";
        includeKeywordsInput.placeholder = "关键词，逗号分隔";
        includeKeywordsInput.value = includeKeywordsText;

        const allowedFids = new Set(FID_PRESETS.map((x) => x.fid));

        const sanitizeFidText = (text) => {
            const s = parseFidSet(text);
            const out = [];
            s.forEach((fid) => {
                if (allowedFids.has(fid)) out.push(fid);
            });
            out.sort((a, b) => Number(a) - Number(b));
            return out.join(", ");
        };

        const includePresetFids = parseFidSet(sanitizeFidText(includeFidsText));
        const excludePresetFids = parseFidSet(sanitizeFidText(excludeFidsText));
        // 互斥：排除优先
        excludePresetFids.forEach((fid) => includePresetFids.delete(fid));

        const syncPresetFidsToStorage = () => {
            includeFidsText = Array.from(includePresetFids).join(", ");
            excludeFidsText = Array.from(excludePresetFids).join(", ");
            GM_setValue(STORAGE_INCLUDE_FIDS, includeFidsText);
            GM_setValue(STORAGE_EXCLUDE_FIDS, excludeFidsText);
        };

        // 初次进入时丢弃非预设 fid，并保持互斥
        syncPresetFidsToStorage();

        const buildTriStateChips = (items, getKey, getLabel, getState, setState) => {
            const wrap = document.createElement("div");
            wrap.className = "bgsh-chipgroup";

            const setChipClass = (btn, state) => {
                btn.classList.toggle("is-include", state === "include");
                btn.classList.toggle("is-exclude", state === "exclude");
            };

            items.forEach((item) => {
                const key = getKey(item);
                const btn = document.createElement("button");
                btn.type = "button";
                btn.className = "bgsh-chip";
                btn.textContent = getLabel(item);

                const refresh = () => setChipClass(btn, getState(key));
                refresh();

                btn.addEventListener("click", () => {
                    setState(key, getState(key));
                    refresh();
                    applyDebounced();
                });
                wrap.appendChild(btn);
            });
            return wrap;
        };

        const boards = makeGroup();
        boards.appendChild(
            makeField(
                "板块过滤",
                buildTriStateChips(
                    FID_PRESETS,
                    (x) => x.fid,
                    (x) => x.name,
                    (fid) => {
                        if (includePresetFids.has(fid)) return "include";
                        if (excludePresetFids.has(fid)) return "exclude";
                        return "none";
                    },
                    (fid, cur) => {
                        // 循环：默认 -> 只看 -> 排除 -> 默认
                        if (cur === "none") {
                            excludePresetFids.delete(fid);
                            includePresetFids.add(fid);
                        } else if (cur === "include") {
                            includePresetFids.delete(fid);
                            excludePresetFids.add(fid);
                        } else {
                            includePresetFids.delete(fid);
                            excludePresetFids.delete(fid);
                        }
                        syncPresetFidsToStorage();
                    }
                )
            )
        );

        collapse.appendChild(boards);

        const makeRow = (labelText, inputEl) => {
            const row = document.createElement("div");
            row.className = "bgsh-row";
            const lb = document.createElement("div");
            lb.className = "bgsh-row-label";
            lb.textContent = labelText;
            row.appendChild(lb);
            row.appendChild(inputEl);
            return row;
        };

        const keywordGroup = makeGroup();
        keywordGroup.appendChild(
            makeField(
                "关键词过滤",
                buildTriStateChips(
                    KEYWORD_PRESETS,
                    (label) => normalizeKeyword(label),
                    (label) => label,
                    (key) => keywordPresetState[key] || "none",
                    (key, cur) => {
                        if (cur === "none") keywordPresetState[key] = "include";
                        else if (cur === "include")
                            keywordPresetState[key] = "exclude";
                        else delete keywordPresetState[key];
                        GM_setValue(
                            STORAGE_KEYWORD_PRESET_STATE,
                            keywordPresetState
                        );
                    }
                )
            )
        );

        const custom = document.createElement("div");
        custom.className = "bgsh-subcard";
        const customTitle = document.createElement("div");
        customTitle.className = "bgsh-subcard-title";
        customTitle.textContent = "自定义关键词";
        custom.appendChild(customTitle);
        custom.appendChild(makeRow("排除", excludeKeywordsInput));
        custom.appendChild(makeRow("仅保留", includeKeywordsInput));
        keywordGroup.appendChild(custom);

        collapse.appendChild(keywordGroup);
        panel.appendChild(collapse);

        const setOpen = (open) => {
            toggleBtn.classList.toggle("is-open", open);
            collapse.classList.toggle("is-open", open);
        };
        setOpen(false);

        toggleBtn.addEventListener("click", () => {
            const open = !collapse.classList.contains("is-open");
            setOpen(open);
        });

        excludeKeywordsInput.addEventListener("input", () => {
            excludeKeywordsText = excludeKeywordsInput.value;
            GM_setValue(STORAGE_EXCLUDE_KEYWORDS, excludeKeywordsText);
            applyDebounced();
        });
        includeKeywordsInput.addEventListener("input", () => {
            includeKeywordsText = includeKeywordsInput.value;
            GM_setValue(STORAGE_INCLUDE_KEYWORDS, includeKeywordsText);
            applyDebounced();
        });

        filterCheckbox.addEventListener("change", () => {
            excludeFid143 = filterCheckbox.checked;
            GM_setValue(STORAGE_EXCLUDE_FID_143, excludeFid143);
            rebuildFilterState();
            applyFilter();
        });

        return { panel };
    }

    function attachPanel(panel) {
        const makeWrapper = () => {
            const wrapper = document.createElement("div");
            wrapper.style.cssText =
                "display:flex;justify-content:flex-start;margin:8px 0 12px;";
            wrapper.appendChild(panel);
            return wrapper;
        };

        const header =
            document.querySelector(".tl .sttl") ||
            document.querySelector(".sttl");
        if (header && header.parentNode) {
            header.parentNode.insertBefore(makeWrapper(), header.nextSibling);
            return;
        }

        const list =
            document.querySelector("#threadlist") ||
            document.querySelector(".slst");
        if (list && list.parentNode) {
            list.parentNode.insertBefore(makeWrapper(), list);
            return;
        }

        panel.style.cssText += [
            "position:fixed",
            "left:16px",
            "top:120px",
            "z-index:2147483646",
        ]
            .map((rule) => `;${rule}`)
            .join("");
        document.body.appendChild(panel);
    }
})();
