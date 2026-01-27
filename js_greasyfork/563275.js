// ==UserScript==
// @name         98堂-搜索优化
// @namespace    https://www.sehuatang.net
// @version      0.5.0
// @description  搜索结果页：本地排序 + 本地过滤（版块/关键词），分段拉取后统一展示。
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
// @license      GPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/563275/98%E5%A0%82-%E6%90%9C%E7%B4%A2%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/563275/98%E5%A0%82-%E6%90%9C%E7%B4%A2%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(async function () {
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

    const ORDERBY_VALUES = new Set(["latest", "replies", "views"]);
    const PREFETCH_DELAY_MS = 5000;
    const MAX_PREFETCH_PAGES = 15;
    const MAX_MORE_PAGES = 15;
    const SEGMENT_SIZE = 5;
    const SEGMENT_GAP_MS = 10000;
    const EXIT_COUNTDOWN_SEC = 5;

    // 当前“排序/过滤”作用域根节点（必须在所有函数/事件之前初始化，避免 TDZ）
    let activeRoot = document;
    // 聚合分段状态：用 let 避免在“总开关关闭”分支里留下 TDZ
    let segmentState = null;

    const STORAGE_MASTER_ENABLED = "bgsh-master-enabled";
    const STORAGE_ORDERBY = "bgsh-sort-fix-orderby";
    const STORAGE_EXCLUDE_FID_143 = "bgsh-sort-fix-exclude-fid-143";
    const STORAGE_EXCLUDE_FIDS = "bgsh-sort-fix-exclude-fids";
    const STORAGE_INCLUDE_FIDS = "bgsh-sort-fix-include-fids";
    const STORAGE_EXCLUDE_KEYWORDS = "bgsh-sort-fix-exclude-keywords";
    const STORAGE_INCLUDE_KEYWORDS = "bgsh-sort-fix-include-keywords";
    const STORAGE_KEYWORD_PRESET_STATE = "bgsh-sort-fix-keyword-preset-state";
    const STORAGE_AGG_ENABLED = "bgsh-agg-enabled";
    const STORAGE_ADVANCED_MODAL_POS = "bgsh-sort-fix-advanced-modal-pos";
    // 校时：用于按“北京时间”窗口禁用聚合（避免本机时钟不准/时区差异）
    const STORAGE_TIME_DELTA_MS = "bgsh-time-delta-ms";
    const STORAGE_TIME_DELTA_AT = "bgsh-time-delta-at";
    const AGG_PARAM = "bgshagg";
    const DEFAULT_ORDERBY = "replies";
    const EXCLUDE_FID = "143";
    const DEFAULT_EXCLUDE_KEYWORDS = "";
    const DEFAULT_INCLUDE_KEYWORDS = "";
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

    const normalizeOrderby = (value) => {
        // migration: old values -> new values
        // - none => latest
        // - hot => replies
        if (value === "none") return "latest";
        if (value === "hot") return "replies";
        return ORDERBY_VALUES.has(value) ? value : DEFAULT_ORDERBY;
    };
    const normalizeBool = (value) =>
        value === true || value === "true" || value === 1 || value === "1";
    const clamp01 = (value) => Math.max(0, Math.min(1, value));

    const TIME_SYNC_TTL_MS = 6 * 60 * 60 * 1000; // 6h 内不重复校时
    const TIME_SYNC_TIMEOUT_MS = 1500; // 校时请求超时（毫秒）
    const AGG_RESTRICT_REASON =
        "北京时间 21:00-01:30 限制搜索间隔 40 秒，已禁用聚合模式";

    let timeDeltaMs = 0;

    const fetchServerDateMs = async () => {
        // 同域取 Date 响应头：无需额外权限，不受不同时区影响
        const controller = new AbortController();
        const timer = window.setTimeout(() => controller.abort(), TIME_SYNC_TIMEOUT_MS);
        try {
            const url = new URL(location.href);
            // 加随机参数避免被缓存
            url.searchParams.set("_bgsh_time", String(Date.now()));
            let res = null;
            try {
                res = await fetch(url.toString(), {
                    method: "HEAD",
                    cache: "no-store",
                    signal: controller.signal,
                });
            } catch {
                // 某些站点可能不支持 HEAD；降级 GET（只会在首次/过期时触发一次）
                res = await fetch(url.toString(), {
                    method: "GET",
                    cache: "no-store",
                    signal: controller.signal,
                });
            }
            const dateHeader = res?.headers?.get?.("Date") || res?.headers?.get?.("date");
            const ms = Date.parse(String(dateHeader || ""));
            return Number.isFinite(ms) ? ms : null;
        } catch {
            return null;
        } finally {
            window.clearTimeout(timer);
        }
    };

    const ensureTimeDeltaMs = async () => {
        const cachedDelta = Number(GM_getValue(STORAGE_TIME_DELTA_MS, 0));
        const cachedAt = Number(GM_getValue(STORAGE_TIME_DELTA_AT, 0));
        const fresh =
            Number.isFinite(cachedDelta) &&
            Number.isFinite(cachedAt) &&
            Date.now() - cachedAt < TIME_SYNC_TTL_MS;
        if (fresh) return cachedDelta;

        const serverMs = await fetchServerDateMs();
        if (serverMs == null) return 0;
        const delta = serverMs - Date.now();
        GM_setValue(STORAGE_TIME_DELTA_MS, delta);
        GM_setValue(STORAGE_TIME_DELTA_AT, Date.now());
        return delta;
    };

    const getBeijingMinutes = (nowMs) => {
        try {
            const parts = new Intl.DateTimeFormat("en-GB", {
                timeZone: "Asia/Shanghai",
                hour12: false,
                hour: "2-digit",
                minute: "2-digit",
            }).formatToParts(new Date(nowMs));
            const hour = Number(parts.find((p) => p.type === "hour")?.value || 0);
            const minute = Number(parts.find((p) => p.type === "minute")?.value || 0);
            if (!Number.isFinite(hour) || !Number.isFinite(minute)) return 0;
            return hour * 60 + minute;
        } catch {
            // 极老环境兜底：按本机时间（仍可用，但不保证跨时区准确）
            const d = new Date(nowMs);
            return d.getHours() * 60 + d.getMinutes();
        }
    };

    const isAggRestrictedNow = () => {
        const m = getBeijingMinutes(Date.now() + timeDeltaMs);
        // 21:00 - 01:30（跨天）
        return m >= 21 * 60 || m < 1 * 60 + 30;
    };

    const masterEnabled = normalizeBool(
        GM_getValue(STORAGE_MASTER_ENABLED, true)
    );

    const readAggDesired = () => {
        // 显式 URL 参数优先，其次读本地记忆
        const qp = params.get(AGG_PARAM);
        if (qp === "1") return true;
        if (qp === "0") return false;
        return normalizeBool(GM_getValue(STORAGE_AGG_ENABLED, false));
    };

    const setAggRemembered = (enabled) => {
        GM_setValue(STORAGE_AGG_ENABLED, Boolean(enabled));
    };

    const buildAggUrl = ({ enabled, page = 1 }) => {
        const url = new URL(location.href);
        if (page != null) url.searchParams.set("page", String(page));
        if (enabled) url.searchParams.set(AGG_PARAM, "1");
        else url.searchParams.delete(AGG_PARAM);
        return url.toString();
    };

    const updateAggUrlInline = (enabled) => {
        try {
            history.replaceState(
                null,
                "",
                buildAggUrl({ enabled, page: getCurrentPageNumber() })
            );
        } catch {
            // ignore
        }
    };
    const removeAggParamFromUrl = () => {
        try {
            const url = new URL(location.href);
            url.searchParams.delete(AGG_PARAM);
            history.replaceState(null, "", url.toString());
        } catch {
            // ignore
        }
    };

    const navigateToAgg = () => {
        setAggRemembered(true);
        aggEnabled = true;
        updateAggUrlInline(true);

        if (!hasResults()) return;
        // 启用时先对当前页做本地排序/过滤
        applyClientSort(document);

        const hasAggCache =
            segmentState?.aggRoot &&
            segmentState.aggRoot.isConnected &&
            segmentState.segments?.length;
        if (!hasAggCache) {
            panelState.setAggSwitchPending?.(true, "开启中");
            // 从当前页开始聚合（含当前页往后 5 页）
            initSegmentMode();
            return;
        }

        resumeAggRequests();
        if (!segmentState.firstBatchRevealed) {
            segmentState.progressMode = "aggload";
            panelState.setAggProgressVisible?.(true);
            panelState.setAggSwitchPending?.(true, "开启中");
            updateFirstBatchProgress(getSegProgress(segmentState.segments[0]));
            void startAutoLoad();
            return;
        }

        panelState.setAggProgressVisible?.(false);
        panelState.setAggSwitchPending?.(false, "聚合模式");
        displaySegment(segmentState.activeIndex || 0);
        void startAutoLoad();
    };

    const navigateToPlain = () => {
        setAggRemembered(false);
        aggEnabled = false;
        updateAggUrlInline(false);

        pauseAggRequests();
        if (segmentState) segmentState.progressMode = "none";
        panelState.setAggProgressVisible?.(false);
        panelState.setAggSwitchPending?.(false, "聚合模式");

        setResultsVisible(true);
        setPaginationVisible(true);
        activeRoot = document;
        if (segmentState?.aggRoot) setElementVisible(segmentState.aggRoot, false);
    };

    if (!masterEnabled) {
        // 总开关关闭：不执行任何功能逻辑，仅保留一个开关用于重新启用
        GM_setValue(STORAGE_AGG_ENABLED, false);
        if (params.has(AGG_PARAM)) {
            removeAggParamFromUrl();
        }

        const panelState = createPanel({ masterEnabled });
        attachPanel(panelState.panel);
        return;
    }

    let currentOrderby = normalizeOrderby(
        GM_getValue(STORAGE_ORDERBY, DEFAULT_ORDERBY)
    );
    let excludeFid143 = normalizeBool(
        GM_getValue(STORAGE_EXCLUDE_FID_143, true)
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

    // 校时：首次/过期时用同域 Date 响应头校准（6 小时内复用）
    timeDeltaMs = await ensureTimeDeltaMs();

    // 模式：默认单页；可记忆为“聚合模式”
    const aggRestrictedInitial = isAggRestrictedNow();
    let aggEnabled = readAggDesired();
    if (aggRestrictedInitial && aggEnabled) {
        // 受限时段强制禁用聚合（避免触发站点 40s 间隔限制）
        setAggRemembered(false);
        aggEnabled = false;
        // 如果 URL 带了聚合参数，去掉它（不强制刷新）
        if (params.has(AGG_PARAM)) {
            removeAggParamFromUrl();
        }
    }
    // 若 URL 显式带了参数，则同步到本地记忆（便于分享链接/跨设备使用）
    if (params.has(AGG_PARAM)) setAggRemembered(aggEnabled);

    const panelState = createPanel({ masterEnabled, aggRestrictedInitial });
    attachPanel(panelState.panel);

    // 周期性刷新受限状态（跨入/跨出窗口时更新开关；若已在聚合中则强制退出）
    const updateAggRestriction = () => {
        const restricted = isAggRestrictedNow();
        panelState.setAggRestricted?.(restricted, AGG_RESTRICT_REASON);
        if (restricted && aggEnabled) navigateToPlain();
    };
    updateAggRestriction();
    window.setInterval(updateAggRestriction, 60 * 1000);

    segmentState = {
        aggRoot: null,
        aggList: null,
        originalContainer: null,
        segBars: [],
        loadingEl: null,
        loadingFill: null,
        progressMode: "none", // none|aggload|exit
        segments: [],
        activeIndex: 0,
        fetchingIndex: -1,
        isFetching: false,
        pendingIndex: null,
        userSelected: false,
        autoLoading: false,
        pauseNetwork: false,
        fetchAbortController: null,
        segBtnEls: new Map(),
        moreBtnEls: [],
        startPage: 1,
        detectedTotalPages: 1,
        cappedEndPage: 1,
        capPages: MAX_PREFETCH_PAGES,
        firstBatchRevealed: false,
    };

    if (hasResults()) {
        // 记录原始顺序，支持“时间/最新”恢复
        markOriginalOrder();

        const detectedTotal = getTotalPages();
        insertTotalPagesHint(detectedTotal);

        // 聚合模式：从当前页开始往后 5 页（含当前页）
        if (aggEnabled) {
            // 首次开始缓存时，先对当前页做本地排序/过滤（并保持可见）
            applyClientSort(document);
            panelState.setAggSwitchPending?.(true, "开启中");

            // 规范化 URL：进入聚合时补上参数，方便刷新/分享
            if (params.get(AGG_PARAM) !== "1") {
                try {
                    history.replaceState(
                        null,
                        "",
                        buildAggUrl({
                            enabled: true,
                            page: getCurrentPageNumber(),
                        })
                    );
                } catch {
                    // ignore
                }
            }
            initSegmentMode();
        } else {
            applyClientSort(document);
        }
    }

    function hasResults() {
        return Boolean(document.querySelector(".slst, #threadlist, .pbw"));
    }

    function delay(ms) {
        return new Promise((resolve) => window.setTimeout(resolve, ms));
    }

    function getPaginationRoot() {
        return (
            document.querySelector(".pgt .pg") ||
            document.querySelector(".pg") ||
            document.querySelector(".pgs .pg")
        );
    }

    function setElementVisible(el, visible) {
        if (!el) return;
        if (!("bgshOrigDisplay" in el.dataset)) {
            el.dataset.bgshOrigDisplay = el.style.display || "";
        }
        el.style.display = visible ? el.dataset.bgshOrigDisplay : "none";
    }

    function getResultsContainer() {
        if (
            segmentState.originalContainer &&
            segmentState.originalContainer.isConnected
        ) {
            return segmentState.originalContainer;
        }
        return (
            document.querySelector("#threadlist") ||
            Array.from(document.querySelectorAll(".slst")).find(
                (el) => el && el.id !== "bgsh-agg-root"
            ) ||
            (() => {
                const pbws = Array.from(document.querySelectorAll(".pbw"));
                const pbw = pbws.find(
                    (el) =>
                        !segmentState.aggRoot || !segmentState.aggRoot.contains(el)
                );
                return pbw ? pbw.parentElement : null;
            })() ||
            null
        );
    }

    function getPaginationContainers() {
        const els = Array.from(document.querySelectorAll(".pgt, .pgs, .pg"));
        // 去重（有些节点可能重复命中）
        return Array.from(new Set(els));
    }

    function setResultsVisible(visible) {
        setElementVisible(getResultsContainer(), visible);
        // 也把“无结果提示”等一起隐藏/显示
        Array.from(document.querySelectorAll(".pbw")).forEach((el) => {
            // 不影响聚合区里的 pbw（避免切换/刷新时被误伤）
            if (segmentState.aggRoot && segmentState.aggRoot.contains(el)) return;
            setElementVisible(el, visible);
        });
    }

    function setPaginationVisible(visible) {
        getPaginationContainers().forEach((el) => setElementVisible(el, visible));
    }

    function getCurrentPageNumber() {
        const pg = getPaginationRoot();
        const curEl = pg?.querySelector(".cur") || pg?.querySelector("strong");
        const curText = (curEl?.textContent || "").trim();
        if (curText) {
            const n = Number.parseInt(curText, 10);
            if (Number.isFinite(n) && n > 0) return n;
        }
        const pageParam = new URLSearchParams(location.search).get("page");
        const parsed = Number.parseInt(String(pageParam || ""), 10);
        return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
    }

    function parsePageNumberFromHref(href) {
        if (!href) return 0;
        try {
            const url = new URL(href, location.href);
            const pageParam = url.searchParams.get("page");
            const parsed = Number.parseInt(String(pageParam || ""), 10);
            if (Number.isFinite(parsed) && parsed > 0) return parsed;
            const m = url.pathname.match(/page-(\d+)/i);
            if (m) return Number.parseInt(m[1], 10);
        } catch (err) {
            return 0;
        }
        return 0;
    }

    function getTotalPages() {
        const current = getCurrentPageNumber();
        const pg = getPaginationRoot();
        if (!pg) return current;
        const candidates = [current];
        Array.from(pg.querySelectorAll("a[href], .cur, strong")).forEach((el) => {
            const href = el.getAttribute?.("href") || "";
            const fromHref = parsePageNumberFromHref(href);
            if (fromHref) candidates.push(fromHref);
            const fromText = Number.parseInt(String(el.textContent || "").trim(), 10);
            if (Number.isFinite(fromText) && fromText > 0) candidates.push(fromText);
        });
        return Math.max(...candidates);
    }

    function buildPageUrl(page) {
        const url = new URL(location.href);
        url.searchParams.set("page", String(page));
        // 拉取页面内容时不需要携带脚本自己的参数，避免干扰站点逻辑/缓存
        url.searchParams.delete(AGG_PARAM);
        return url.toString();
    }

    function buildPageUrls(fromPage, toPage) {
        const out = [];
        for (let p = fromPage; p <= toPage; p += 1) out.push(buildPageUrl(p));
        return out;
    }

    function initSegmentMode() {
        const detectedTotal = getTotalPages();
        const startPage = getCurrentPageNumber();
        const remaining = Math.max(0, detectedTotal - startPage + 1);
        const cappedCount = Math.min(remaining, segmentState.capPages);
        const cappedEnd = Math.max(
            startPage,
            Math.min(detectedTotal, startPage + cappedCount - 1)
        );
        segmentState.detectedTotalPages = detectedTotal;
        segmentState.startPage = startPage;
        segmentState.cappedEndPage = cappedEnd;

        const originalContainer = getResultsContainer();
        if (!originalContainer || !originalContainer.parentNode) return;
        segmentState.originalContainer = originalContainer;

        // 复用 Discuz 原本的 DOM 结构：.slst > ul > li.pbw
        // 否则论坛自带 CSS（字体/颜色/间距）会不命中，看起来“美术不一样”
        const aggRoot = document.createElement("div");
        aggRoot.id = "bgsh-agg-root";
        aggRoot.className = originalContainer.className || "slst mtw";
        const aggList = document.createElement("ul");
        aggList.id = "bgsh-agg-list";
        const segBarTop = document.createElement("div");
        segBarTop.className = "bgsh-segbar is-top";
        const segBarBottom = document.createElement("div");
        segBarBottom.className = "bgsh-segbar is-bottom";
        aggRoot.appendChild(segBarTop);
        aggRoot.appendChild(aggList);
        aggRoot.appendChild(segBarBottom);

        originalContainer.parentNode.insertBefore(aggRoot, originalContainer);
        // 首次开始缓存时，保留当前页原内容不遮挡；聚合容器先隐藏
        setElementVisible(aggRoot, false);
        segmentState.aggRoot = aggRoot;
        segmentState.aggList = aggList;
        segmentState.segBars = [segBarTop, segBarBottom];
        // 首段加载进度改放到面板按钮右侧
        segmentState.loadingEl = null;
        segmentState.loadingFill = panelState.aggProgressFill || null;
        segmentState.progressMode = "aggload";
        panelState.setAggProgressVisible?.(true);
        updateFirstBatchProgress(0);

        segmentState.segments = buildSegmentsRange(startPage, cappedEnd, SEGMENT_SIZE);
        buildSegBar();
        insertTotalPagesHint(detectedTotal);

        const capHint =
            remaining > MAX_PREFETCH_PAGES
                ? `（已限制最多${MAX_PREFETCH_PAGES}页）`
                : "";
        panelState.setProgressText(
            `开始聚合：共${detectedTotal}页${capHint}，先读取 ${startPage}-${Math.min(
                startPage + SEGMENT_SIZE - 1,
                cappedEnd
            )} 页…`
        );

        // 自动读取第一段并展示
        void startAutoLoad();
    }

    function buildSegments(totalPages, size) {
        const segments = [];
        for (let start = 1; start <= totalPages; start += size) {
            const end = Math.min(totalPages, start + size - 1);
            segments.push({
                start,
                end,
                status: "idle", // idle|loading|ready|error
                pbws: [],
                loadedPages: new Set(),
                errorPages: new Set(),
            });
        }
        return segments;
    }

    function buildSegmentsRange(startPage, endPage, size) {
        const segments = [];
        const s = Number.parseInt(String(startPage || ""), 10);
        const e = Number.parseInt(String(endPage || ""), 10);
        if (!Number.isFinite(s) || !Number.isFinite(e) || e < s) return segments;
        for (let start = s; start <= e; start += size) {
            const end = Math.min(e, start + size - 1);
            segments.push({
                start,
                end,
                status: "idle", // idle|loading|ready|error
                pbws: [],
                loadedPages: new Set(),
                errorPages: new Set(),
            });
        }
        return segments;
    }

    function segmentLabel(seg) {
        // 单页段：1-1 / 16-16 这种显示为 1 / 16
        if (seg.start === seg.end) return String(seg.start);
        return `${seg.start}-${seg.end}`;
    }

    function buildSegBar() {
        const bars = segmentState.segBars || [];
        if (!bars.length) return;
        bars.forEach((bar) => {
            bar.innerHTML = "";
            bar.style.display = "none";
        });
        segmentState.segBtnEls.clear();
        segmentState.moreBtnEls = [];
        segmentState.segments.forEach((seg, idx) => {
            const btnList = [];
            bars.forEach((bar) => {
                const btn = document.createElement("button");
                btn.type = "button";
                btn.className = "bgsh-segbtn";
                const fill = document.createElement("span");
                fill.className = "bgsh-segbtn-fill";
                const text = document.createElement("span");
                text.className = "bgsh-segbtn-text";
                text.textContent = segmentLabel(seg);
                btn.appendChild(fill);
                btn.appendChild(text);
                btn.dataset.index = String(idx);
                btn.addEventListener("click", () => {
                    void activateSegment(idx);
                });
                bar.appendChild(btn);
                btnList.push({ btn, fill, text });
            });
            segmentState.segBtnEls.set(idx, btnList);
        });
        // 追加“更多”按钮
        bars.forEach((bar) => {
            const moreBtn = document.createElement("button");
            moreBtn.type = "button";
            moreBtn.className = "bgsh-segbtn is-more";
            const text = document.createElement("span");
            text.className = "bgsh-segbtn-text";
            text.textContent = "更多";
            moreBtn.appendChild(text);
            moreBtn.addEventListener("click", () => {
                expandMorePages();
            });
            bar.appendChild(moreBtn);
            segmentState.moreBtnEls.push(moreBtn);
        });
        updateSegBar();
    }

    async function activateSegment(index) {
        segmentState.userSelected = true;
        segmentState.activeIndex = index;
        updateSegBar();
        const seg = segmentState.segments[index];
        if (!seg) return;
        if (seg.status === "ready") {
            displaySegment(index);
            scrollToTop();
            return;
        }
        if (segmentState.isFetching) {
            segmentState.pendingIndex = index;
            panelState.setProgressText(
                `排队中：将切换到 ${segmentLabel(seg)}（等待当前分区加载结束）`
            );
            return;
        }
        await fetchSegment(index, { autoDisplay: true });
        scrollToTop();
    }

    function getSegProgress(seg) {
        const total = seg.end - seg.start + 1;
        const done = seg.loadedPages.size + seg.errorPages.size;
        return total > 0 ? Math.min(1, done / total) : 0;
    }

    function updateSegBar() {
        segmentState.segments.forEach((seg, idx) => {
            const list = segmentState.segBtnEls.get(idx);
            if (!list || !list.length) return;
            const progress = getSegProgress(seg);
            list.forEach(({ btn, fill }) => {
                fill.style.width = `${Math.round(progress * 100)}%`;
                btn.classList.toggle("is-selected", idx === segmentState.activeIndex);
                btn.classList.toggle("is-ready", seg.status === "ready");
                btn.classList.toggle("is-loading", seg.status === "loading");
                btn.classList.toggle("is-error", seg.status === "error");
                // loading 时禁用；idle 可点（会触发加载）
                btn.disabled = seg.status === "loading";
            });
        });
        updateMoreButtons();
    }

    async function startAutoLoad() {
        if (segmentState.autoLoading) return;
        segmentState.autoLoading = true;
        try {
            for (let i = 0; i < segmentState.segments.length; i += 1) {
                // 优先处理用户点选的分区
                if (segmentState.pendingIndex != null) {
                    const idx = segmentState.pendingIndex;
                    segmentState.pendingIndex = null;
                    await fetchSegment(idx, { autoDisplay: true });
                    continue;
                }
                const seg = segmentState.segments[i];
                if (!seg || seg.status === "ready" || seg.status === "error")
                    continue;
                // 每个 batch 之间留出间隔（首个 batch 不等待）
                if (i > 0) await delay(SEGMENT_GAP_MS);
                // 第一段加载完自动展示；后续段只预取，不自动切换
                await fetchSegment(i, { autoDisplay: i === 0 && !segmentState.userSelected });
                if (i === 0 && !segmentState.userSelected) {
                    // 选中第一段
                    segmentState.activeIndex = 0;
                    updateSegBar();
                }
            }
        } finally {
            segmentState.autoLoading = false;
        }
    }

    function canExpandMore() {
        return segmentState.cappedEndPage < segmentState.detectedTotalPages;
    }

    function expandMorePages() {
        if (!canExpandMore()) return;
        const start = segmentState.cappedEndPage + 1;
        const end = Math.min(
            segmentState.detectedTotalPages,
            segmentState.cappedEndPage + MAX_MORE_PAGES
        );
        if (end < start) return;
        // 追加新的分区（从当前已覆盖范围继续向后）
        const newSegs = buildSegmentsRange(start, end, SEGMENT_SIZE);
        segmentState.segments.push(...newSegs);
        segmentState.cappedEndPage = end;
        buildSegBar();
        updateTotalPagesHint();
        if (segmentState.firstBatchRevealed) {
            revealSegBars();
        }
        void startAutoLoad();
    }

    function scrollToTop() {
        try {
            window.scrollTo({ top: 0, behavior: "smooth" });
        } catch {
            window.scrollTo(0, 0);
        }
    }

    function insertTotalPagesHint(totalPages) {
        const title = document.querySelector(".tl .sttl h2");
        if (!title) return;
        if (title.querySelector(".bgsh-total-pages")) return;
        const hint = document.createElement("span");
        hint.className = "bgsh-total-pages";
        hint.textContent = ` 共${totalPages}页`;
        title.appendChild(hint);
    }

    function updateTotalPagesHint() {
        const title = document.querySelector(".tl .sttl h2");
        if (!title) return;
        const hint = title.querySelector(".bgsh-total-pages");
        if (!hint) return;
        const total = segmentState.detectedTotalPages || getTotalPages();
        hint.textContent = ` 共${total}页`;
    }

    function updateMoreButtons() {
        const hasMore = canExpandMore();
        segmentState.moreBtnEls.forEach((btn) => {
            btn.style.display = hasMore ? "" : "none";
            btn.disabled = !hasMore;
        });
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

    function getActiveRoot() {
        return activeRoot || document;
    }

    function applyClientSort(root = getActiveRoot()) {
        const pbws = Array.from(root.querySelectorAll(".pbw"));
        if (!pbws.length) return false;

        const groups = new Map();
        pbws.forEach((item) => {
            const parent = item.parentElement;
            if (!parent) return;
            const list = groups.get(parent) || [];
            list.push(item);
            groups.set(parent, list);
        });

        if (currentOrderby === "latest") {
            // 按首次渲染顺序恢复“时间”排序
            groups.forEach((items, parent) => {
                if (items.length < 2) return;
                const decorated = items.map((el, idx) => {
                    const raw = Number.parseInt(el.dataset.bgshOrder || "", 10);
                    const key = Number.isFinite(raw) ? raw : idx;
                    return { el, key };
                });
                decorated.sort((a, b) => a.key - b.key);
                decorated.forEach(({ el }) => parent.appendChild(el));
            });
            applyFilter(pbws);
            return false;
        }

        const getKey = (pbw) => {
            const keys = extractSortKeys(pbw);
            switch (currentOrderby) {
                case "views":
                    return keys.views || 0;
                case "replies":
                default:
                    return keys.replies || 0;
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

    function markOriginalOrder(root = document) {
        const pbws = Array.from(root.querySelectorAll(".pbw"));
        pbws.forEach((pbw, idx) => {
            if (!pbw || !pbw.dataset) return;
            if (pbw.dataset.bgshOrder) return;
            pbw.dataset.bgshOrder = String(idx);
        });
    }

    function extractThreadId(pbw) {
        const link =
            pbw.querySelector('a[href*="viewthread"]') ||
            pbw.querySelector('a[href*="thread-"]') ||
            pbw.querySelector("a[href]");
        const href = link?.getAttribute("href") || "";
        const tidMatch =
            href.match(/(?:\btid=)(\d+)/i) ||
            href.match(/thread-(\d+)-/i);
        return tidMatch ? String(Number.parseInt(tidMatch[1], 10)) : "";
    }

    async function fetchPagePbws(url) {
        if (segmentState?.pauseNetwork) throw new Error("bgsh: paused");
        const signal = segmentState?.fetchAbortController?.signal;
        const res = await fetch(url, { credentials: "include", signal });
        if (!res.ok) throw new Error(`fetch failed: ${res.status}`);
        const html = await res.text();
        const doc = new DOMParser().parseFromString(html, "text/html");
        return Array.from(doc.querySelectorAll(".pbw"));
    }

    function pauseAggRequests() {
        if (!segmentState) return;
        segmentState.pauseNetwork = true;
        try {
            segmentState.fetchAbortController?.abort?.();
        } catch {
            // ignore
        }
    }
    function resumeAggRequests() {
        if (!segmentState) return;
        segmentState.pauseNetwork = false;
    }

    function clearAggList() {
        const list = segmentState.aggList;
        if (!list) return;
        list.innerHTML = "";
    }

    function appendPbwsToAggList(
        pbws,
        { clear = false, setOrderFromIndex = false, orderBase = 0 } = {}
    ) {
        const list = segmentState.aggList;
        if (!list || !pbws.length) return 0;
        if (clear) clearAggList();

        const existingIds = new Set(
            Array.from(list.querySelectorAll(".pbw"))
                .map(extractThreadId)
                .filter(Boolean)
        );
        let appended = 0;
        pbws.forEach((pbw, idx) => {
            const tid = extractThreadId(pbw);
            if (tid && existingIds.has(tid)) return;
            const node = document.importNode(pbw, true);
            if (setOrderFromIndex) {
                node.dataset.bgshOrder = String(orderBase + idx);
            }
            list.appendChild(node);
            appended += 1;
            if (tid) existingIds.add(tid);
        });
        return appended;
    }

    function collectCurrentPagePbws() {
        return Array.from(document.querySelectorAll(".pbw")).map((el) =>
            el.cloneNode(true)
        );
    }

    async function fetchSegment(index, { autoDisplay } = { autoDisplay: false }) {
        const seg = segmentState.segments[index];
        if (!seg) return;
        if (seg.status === "loading") return;
        if (segmentState.isFetching) return;
        if (segmentState.pauseNetwork) return;

        segmentState.isFetching = true;
        segmentState.fetchingIndex = index;
        seg.status = "loading";
        updateSegBar();

        segmentState.fetchAbortController = new AbortController();

        const totalPagesInSeg = seg.end - seg.start + 1;
        let loadedCount = seg.loadedPages.size;
        const currentPage = getCurrentPageNumber();

        // 把当前页（如果在该段）先纳入
        if (
            currentPage >= seg.start &&
            currentPage <= seg.end &&
            !seg.loadedPages.has(currentPage)
        ) {
            seg.pbws.push(...collectCurrentPagePbws());
            seg.loadedPages.add(currentPage);
            loadedCount += 1;
        }

        panelState.setProgressText(
            `读取 ${segmentLabel(seg)} 页：${loadedCount}/${totalPagesInSeg}`
        );
        if (index === 0 && !segmentState.firstBatchRevealed) {
            updateFirstBatchProgress(getSegProgress(seg));
        }

        for (let p = seg.start; p <= seg.end; p += 1) {
            if (segmentState.pauseNetwork) break;
            if (seg.loadedPages.has(p)) continue;
            if (seg.errorPages.has(p)) continue;
            if (p !== seg.start) await delay(PREFETCH_DELAY_MS);
            if (segmentState.pauseNetwork) break;
            try {
                const pbws = await fetchPagePbws(buildPageUrl(p));
                seg.pbws.push(...pbws);
                seg.loadedPages.add(p);
                loadedCount += 1;
            } catch (err) {
                // 切换中 / 被 abort：不记为错误，不继续拉取
                if (segmentState.pauseNetwork || err?.name === "AbortError") break;
                seg.errorPages.add(p);
                console.warn("[bgsh] segment fetch failed", p, err);
            }
            updateSegBar();
            panelState.setProgressText(
                `读取 ${segmentLabel(seg)} 页：${loadedCount}/${totalPagesInSeg}`
            );
            if (index === 0 && !segmentState.firstBatchRevealed) {
                updateFirstBatchProgress(getSegProgress(seg));
            }
        }

        if (segmentState.pauseNetwork) {
            // 切换中：停止拉取，恢复可再次触发加载
            seg.status = "idle";
            segmentState.fetchingIndex = -1;
            segmentState.isFetching = false;
            segmentState.fetchAbortController = null;
            updateSegBar();
            return;
        }

        seg.status = seg.errorPages.size > 0 ? "error" : "ready";
        segmentState.fetchingIndex = -1;
        segmentState.isFetching = false;
        segmentState.fetchAbortController = null;
        updateSegBar();

        if (index === 0 && !segmentState.firstBatchRevealed) {
            revealSegBars();
        }

        if (autoDisplay) {
            displaySegment(index);
        }
    }

    function revealSegBars() {
        segmentState.firstBatchRevealed = true;
        if (segmentState.progressMode !== "exit") {
            segmentState.progressMode = "none";
            panelState.setAggProgressVisible?.(false);
        }
        panelState.setAggSwitchPending?.(false, "聚合模式");
        (segmentState.segBars || []).forEach((bar) => {
            bar.style.display = "";
        });
        updateSegBar();
    }

    function updateFirstBatchProgress(progress) {
        if (segmentState.progressMode !== "aggload") return;
        const fill = segmentState.loadingFill;
        if (!fill) return;
        const clamped = clamp01(progress || 0);
        fill.style.setProperty(
            "--bgsh-progress",
            `${Math.round(clamped * 100)}%`
        );
    }

    function displaySegment(index) {
        const seg = segmentState.segments[index];
        if (!seg) return;
        segmentState.activeIndex = index;
        updateSegBar();

        // 切换为聚合展示：隐藏原始列表/页码
        setResultsVisible(false);
        setPaginationVisible(false);
        if (segmentState.aggRoot) {
            setElementVisible(segmentState.aggRoot, true);
            activeRoot = segmentState.aggRoot;
        }

        appendPbwsToAggList(seg.pbws, {
            clear: true,
            setOrderFromIndex: true,
            orderBase: 0,
        });
        applyClientSort(segmentState.aggRoot);
        panelState.setProgressText("");
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

    function applyFilter(
        pbws = Array.from(getActiveRoot().querySelectorAll(".pbw"))
    ) {
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
:root{
  /* 聚合视觉：红-紫-蓝渐变（用于进度/胶囊/开关） */
  --bgsh-agg-grad: linear-gradient(90deg,
    rgba(239,68,68,.22),
    rgba(168,85,247,.22),
    rgba(59,130,246,.22)
  );
  --bgsh-agg-grad-soft: linear-gradient(90deg,
    rgba(239,68,68,.16),
    rgba(168,85,247,.16),
    rgba(59,130,246,.16)
  );
  --bgsh-agg-grad-strong: linear-gradient(90deg,
    rgba(239,68,68,.75),
    rgba(168,85,247,.75),
    rgba(59,130,246,.75)
  );
}
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
.bgsh-right{
  margin-left:auto;
  display:flex;
  align-items:center;
  gap:8px;
}
.bgsh-progress-inline{
  width: 18px;
  height: 18px;
  flex: 0 0 auto;
}
.bgsh-switch.bgsh-agg-switch input:checked + .bgsh-switch-ui{
  background: var(--bgsh-agg-grad);
  border-color: rgba(168,85,247,.55);
}
/* 切换中：立刻滑动，但底色灰（未完成） */
.bgsh-switch.bgsh-agg-switch.is-pending .bgsh-switch-ui{
  background: rgba(15,23,42,.12) !important;
  border-color: rgba(15,23,42,.22) !important;
}
.bgsh-title{
  font-weight:800;
  letter-spacing:.4px;
}
.bgsh-switch-text{
  font-weight:800;
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
.bgsh-chip:disabled{
  opacity:.6;
  cursor:not-allowed;
}
.bgsh-segbtn{
  appearance:none;
  border:1px solid var(--bgsh-border);
  border-radius:12px;
  /* 统一胶囊底色：介于“带白蒙版/不带”之间的中间值 */
  background: rgba(15,23,42,.05);
  padding:7px 10px;
  cursor:pointer;
  color: var(--bgsh-sub);
  font-size:12px;
  position: relative;
  overflow: hidden;
}
.bgsh-segbtn:hover{
  color: var(--bgsh-text);
  background: rgba(15,23,42,.07);
}
.bgsh-segbtn-fill{
  position:absolute;
  left:0;
  top:0;
  bottom:0;
  width:0%;
  background: var(--bgsh-agg-grad);
  transition: width .18s ease;
  z-index:0;
}
.bgsh-segbtn.is-loading .bgsh-segbtn-fill{
  background: var(--bgsh-agg-grad-soft);
}
.bgsh-segbtn.is-error .bgsh-segbtn-fill{
  background: rgba(239,68,68,.14);
}
.bgsh-segbtn-text{
  position:relative;
  z-index:1;
}
.bgsh-segbtn.is-selected{
  /* 选中态：用紫色边框表示（不再切换底色） */
  color: var(--bgsh-text);
  border-width:3px;
  border-color: rgba(168,85,247,.96);
  /* 额外一圈 outline：更粗更明显，且不影响布局 */
  outline: 2px solid rgba(168,85,247,.30);
  outline-offset: 0;
  box-shadow:
    inset 0 0 0 1px rgba(168,85,247,.78),
    0 0 0 2px rgba(168,85,247,.16);
}
.bgsh-segbtn.is-ready:not(.is-selected){
  /* 已就绪：仅做轻提示，不改变底色（避免出现两套“蒙版”观感） */
  border-color: rgba(168,85,247,.35);
}
.bgsh-segbtn.is-error{
  border-color: rgba(239,68,68,.35);
}
.bgsh-segbtn.is-loading{
  opacity:.65;
  cursor:not-allowed;
}
.bgsh-segbtn.is-more{
  background: rgba(15,23,42,.06);
  color: var(--bgsh-sub);
}
.bgsh-segbtn.is-more:hover{
  color: var(--bgsh-text);
  background: rgba(15,23,42,.10);
}
.bgsh-segbar{
  display:flex;
  flex-wrap:wrap;
  gap:8px;
  margin: 10px 0 16px;
}
.bgsh-segbar.is-top{
  margin: 8px 0 10px;
}
.bgsh-segbar.is-bottom{
  margin: 12px 0 18px;
}
.bgsh-total-pages{
  font: inherit;
  color: inherit;
  margin-left: 6px;
}
.bgsh-loading{
  display:flex;
  align-items:center;
  justify-content:center;
  padding: 16px 0 8px;
}
.bgsh-progress-circle{
  --bgsh-progress: 0%;
  display:inline-block;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background:
    /* 上层：已完成彩色+未完成灰色；mask 镂空成圆环 */
    conic-gradient(
      from 0deg,
      rgba(239,68,68,.92) 0%,
      rgba(168,85,247,.92) var(--bgsh-progress),
      rgba(15,23,42,.15) var(--bgsh-progress),
      rgba(15,23,42,.15) 100%
    );
  mask: radial-gradient(farthest-side, transparent 55%, #000 56%);
  -webkit-mask: radial-gradient(farthest-side, transparent 55%, #000 56%);
}
/* 总开关进度：同一套圆环，但用蓝色 */
.bgsh-progress-circle.is-master{
  background:
    conic-gradient(
      from 0deg,
      rgba(var(--bgsh-accent-rgb), .92) 0%,
      rgba(var(--bgsh-accent-rgb), .92) var(--bgsh-progress),
      rgba(15,23,42,.15) var(--bgsh-progress),
      rgba(15,23,42,.15) 100%
    );
}
.bgsh-spinner{
  width: 18px;
  height: 18px;
  flex: 0 0 auto;
  display:inline-flex;
  align-items:center;
  justify-content:center;
}
.bgsh-spinner::after{
  content:"";
  width: 14px;
  height: 14px;
  border-radius: 999px;
  /* 分段“短线环”旋转（对齐你给的示例图样式） */
  background: conic-gradient(
    from 0deg,
    rgba(15,23,42,.92) 0deg,
    rgba(15,23,42,.92) 16deg,
    transparent 16deg,
    transparent 30deg,

    rgba(15,23,42,.78) 30deg,
    rgba(15,23,42,.78) 46deg,
    transparent 46deg,
    transparent 60deg,

    rgba(15,23,42,.66) 60deg,
    rgba(15,23,42,.66) 76deg,
    transparent 76deg,
    transparent 90deg,

    rgba(15,23,42,.54) 90deg,
    rgba(15,23,42,.54) 106deg,
    transparent 106deg,
    transparent 120deg,

    rgba(15,23,42,.44) 120deg,
    rgba(15,23,42,.44) 136deg,
    transparent 136deg,
    transparent 150deg,

    rgba(15,23,42,.36) 150deg,
    rgba(15,23,42,.36) 166deg,
    transparent 166deg,
    transparent 180deg,

    rgba(15,23,42,.30) 180deg,
    rgba(15,23,42,.30) 196deg,
    transparent 196deg,
    transparent 210deg,

    rgba(15,23,42,.24) 210deg,
    rgba(15,23,42,.24) 226deg,
    transparent 226deg,
    transparent 240deg,

    rgba(15,23,42,.19) 240deg,
    rgba(15,23,42,.19) 256deg,
    transparent 256deg,
    transparent 270deg,

    rgba(15,23,42,.15) 270deg,
    rgba(15,23,42,.15) 286deg,
    transparent 286deg,
    transparent 300deg,

    rgba(15,23,42,.12) 300deg,
    rgba(15,23,42,.12) 316deg,
    transparent 316deg,
    transparent 330deg,

    rgba(15,23,42,.10) 330deg,
    rgba(15,23,42,.10) 346deg,
    transparent 346deg,
    transparent 360deg
  );
  /* 镂空中心，只保留外圈短段 */
  mask: radial-gradient(farthest-side, transparent 58%, #000 59%);
  -webkit-mask: radial-gradient(farthest-side, transparent 58%, #000 59%);
  animation: bgsh-spin .9s linear infinite;
}
@keyframes bgsh-spin{
  to{ transform: rotate(360deg); }
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
.bgsh-chip-text{
  display:inline-flex;
  align-items:center;
}
.bgsh-dot{
  width:6px;
  height:6px;
  border-radius:999px;
  background: rgba(16,185,129,.95);
  display:none;
}
.bgsh-advanced-btn{
  display:inline-flex;
  align-items:center;
  gap:6px;
}
.bgsh-modal-backdrop{
  /* 弹窗面板本体更透明一些，避免遮挡视线 */
  --bgsh-bg: rgba(255,255,255,.78);
  --bgsh-border: rgba(15,23,42,.12);
  --bgsh-text: #0f172a;
  --bgsh-sub: rgba(15,23,42,.62);
  --bgsh-accent-rgb: 37, 99, 235;
  --bgsh-accent: rgb(var(--bgsh-accent-rgb));
  --bgsh-accent-bg: rgba(var(--bgsh-accent-rgb), .14);
  position:fixed;
  inset:0;
  /* 背景遮罩更淡一些 */
  /* 不加模糊，仅通过遮罩降低亮度 */
  background: rgba(15,23,42,.30);
  z-index:2147483647;
  display:none;
  padding:16px;
  box-sizing:border-box;
}
.bgsh-modal{
  /* 侧边栏：靠右，不居中 */
  position:absolute;
  /* 贴着遮罩层 padding（也就是离屏幕 16px） */
  top:0;
  right:0;
  margin:0;
  /* 默认宽度：后面 JS 会按导航栏宽度的 1/2 动态覆盖 */
  width:min(50vw, 760px);
  max-width:none;
  background: var(--bgsh-bg);
  border:1px solid var(--bgsh-border);
  border-radius:16px;
  box-shadow: 0 20px 60px rgba(15,23,42,.25);
  color: var(--bgsh-text);
  overflow:hidden;
  display:flex;
  flex-direction:column;
  /* 紧凑：内容自适应高度，但不超过视口 */
  height:auto;
  max-height: calc(100vh - 32px);
}
.bgsh-modal-header{
  display:flex;
  align-items:center;
  justify-content:space-between;
  padding:12px 12px;
  border-bottom:1px solid rgba(15,23,42,.10);
  cursor: move;
  user-select:none;
}
.bgsh-modal-title{
  font-weight:900;
  letter-spacing:.2px;
}
.bgsh-modal-actions{
  display:flex;
  align-items:center;
  gap:8px;
}
.bgsh-modal-close{
  appearance:none;
  border:1px solid var(--bgsh-border);
  border-radius:12px;
  background: rgba(15,23,42,.04);
  padding:7px 10px;
  cursor:pointer;
  color: var(--bgsh-sub);
  font-size:12px;
  line-height:1;
}
.bgsh-modal-close:hover{
  color: var(--bgsh-text);
  background: rgba(15,23,42,.06);
}
.bgsh-modal-body{
  padding:12px;
  overflow:auto;
  display:flex;
  flex-direction:column;
  gap:10px;
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
  overflow:hidden;
  flex: 0 0 auto;
  transition: background .15s ease, border-color .15s ease;
}
.bgsh-switch-fill{
  --bgsh-progress: 0%;
  position:absolute;
  left:1px;
  top:1px;
  bottom:1px;
  width: var(--bgsh-progress);
  border-radius:999px;
  background: var(--bgsh-agg-grad);
  z-index:0;
  transition: width .18s ease;
  pointer-events:none;
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
  z-index:1;
}
.bgsh-switch input:checked + .bgsh-switch-ui{
  background: rgba(var(--bgsh-accent-rgb), .35);
  border-color: rgba(var(--bgsh-accent-rgb), .55);
}
.bgsh-switch input:checked + .bgsh-switch-ui::after{
  transform: translate(16px,-50%);
}
.bgsh-switch-indicator{
  position:absolute;
  top:50%;
  left:2px;
  width:18px;
  height:18px;
  transform: translate(0,-50%);
  pointer-events:none;
  z-index:2;
}
.bgsh-switch input:checked + .bgsh-switch-ui .bgsh-switch-indicator{
  transform: translate(16px,-50%);
}
.bgsh-switch-text{
  color: var(--bgsh-text);
}
`;
        document.head.appendChild(style);
    }

    function createPanel({ masterEnabled = true, aggRestrictedInitial = false } = {}) {
        ensureStyles();
        const panel = document.createElement("div");
        panel.id = "bgsh-sort-fix-panel";

        const masterLabel = document.createElement("label");
        masterLabel.className = "bgsh-switch bgsh-master-switch";

        const masterCheckbox = document.createElement("input");
        masterCheckbox.type = "checkbox";
        masterCheckbox.checked = Boolean(masterEnabled);

        const masterUi = document.createElement("span");
        masterUi.className = "bgsh-switch-ui";

        const masterIndicator = document.createElement("span");
        masterIndicator.className = "bgsh-switch-indicator";

        const masterSpinner = document.createElement("span");
        masterSpinner.className = "bgsh-spinner";
        masterSpinner.style.display = "none";
        masterIndicator.appendChild(masterSpinner);
        masterUi.appendChild(masterIndicator);

        const masterText = document.createElement("span");
        masterText.className = "bgsh-switch-text";
        masterText.textContent = "开关";
        masterText.title = "关闭后停用脚本所有功能";

        masterLabel.appendChild(masterCheckbox);
        masterLabel.appendChild(masterUi);
        masterLabel.appendChild(masterText);
        panel.appendChild(masterLabel);

        // 右侧：总开关切换进度（蓝色）
        const right = document.createElement("div");
        right.className = "bgsh-right";

        const setMasterSpinnerVisible = (visible) => {
            masterSpinner.style.display = visible ? "" : "none";
        };

        let masterToggleTimer = 0;
        function stopMasterCountdown() {
            if (masterToggleTimer) window.clearInterval(masterToggleTimer);
            masterToggleTimer = 0;
            setMasterSpinnerVisible(false);
            masterCheckbox.disabled = false;
            masterText.title = "关闭后停用脚本所有功能";
        }
        function startMasterCountdown(targetEnabled) {
            if (masterToggleTimer) return;
            // 切换中：立刻暂停/中止聚合拉取，避免“点了就继续发请求”的观感
            pauseAggRequests();

            masterCheckbox.disabled = true;
            setMasterSpinnerVisible(true);

            const totalMs = Math.max(1, Number(EXIT_COUNTDOWN_SEC || 5) * 1000);
            const start = Date.now();
            masterText.title = `总开关切换（${Math.ceil(totalMs / 1000)}s）`;

            masterToggleTimer = window.setInterval(() => {
                const elapsed = Date.now() - start;
                const p = clamp01(elapsed / totalMs);

                const remainMs = Math.max(0, totalMs - elapsed);
                const remainSec = Math.max(0, Math.ceil(remainMs / 1000));
                masterText.title = `总开关切换（${remainSec}s）`;

                if (p >= 1) {
                    stopMasterCountdown();
                    GM_setValue(STORAGE_MASTER_ENABLED, Boolean(targetEnabled));
                    if (!targetEnabled) {
                        // 关闭总开关：强制退出聚合（清掉 URL 参数 + 取消本地记忆）
                        GM_setValue(STORAGE_AGG_ENABLED, false);
                        try {
                            const url = new URL(location.href);
                            url.searchParams.delete(AGG_PARAM);
                            location.assign(url.toString());
                        } catch {
                            location.reload();
                        }
                        return;
                    }
                    location.reload();
                }
            }, 100);
        }

        masterCheckbox.addEventListener("change", () => {
            const enabled = Boolean(masterCheckbox.checked);
            // 总开关切换：延迟 5s 生效，并在右侧显示蓝色进度圈
            if (typeof startMasterCountdown === "function") {
                startMasterCountdown(enabled);
                return;
            }
            // 极少数情况下（逻辑尚未初始化）兜底：立即生效
            GM_setValue(STORAGE_MASTER_ENABLED, enabled);
            location.reload();
        });

        if (!masterEnabled) {
            const setProgressText = () => {};
            const setAggProgressVisible = () => {};
            const setAggSwitchPending = () => {};
            const setAggSwitchText = () => {};
            const setAggRestricted = () => {};
            panel.appendChild(right);
            return {
                panel,
                setProgressText,
                aggProgressFill: null,
                setAggProgressVisible,
                setAggSwitchPending,
                setAggSwitchText,
                setAggRestricted,
            };
        }

        const title = document.createElement("div");
        title.className = "bgsh-title";
        title.textContent = "排序";
        panel.appendChild(title);

        // 分区模式下不再需要“开始/继续”按钮，改用列表底部的分区按钮条

        const seg = document.createElement("div");
        seg.className = "bgsh-seg";

        const btnLatest = document.createElement("button");
        btnLatest.type = "button";
        btnLatest.className = "bgsh-btn";
        btnLatest.textContent = "发布时间";

        const btnReplies = document.createElement("button");
        btnReplies.type = "button";
        btnReplies.className = "bgsh-btn";
        btnReplies.textContent = "回复量";

        const btnViews = document.createElement("button");
        btnViews.type = "button";
        btnViews.className = "bgsh-btn";
        btnViews.textContent = "查看量";

        seg.appendChild(btnLatest);
        seg.appendChild(btnReplies);
        seg.appendChild(btnViews);
        panel.appendChild(seg);

        const updateActive = () => {
            btnLatest.classList.toggle("is-active", currentOrderby === "latest");
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
        btnLatest.addEventListener("click", () => setOrderby("latest"));
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

        const advancedBtn = document.createElement("button");
        advancedBtn.type = "button";
        advancedBtn.className = "bgsh-chip bgsh-advanced-btn";
        const advancedText = document.createElement("span");
        advancedText.className = "bgsh-chip-text";
        advancedText.textContent = "高级过滤";
        const advancedDot = document.createElement("span");
        advancedDot.className = "bgsh-dot";
        advancedDot.title = "已启用过滤规则";
        advancedBtn.appendChild(advancedText);
        advancedBtn.appendChild(advancedDot);

        const modalBackdrop = document.createElement("div");
        modalBackdrop.className = "bgsh-modal-backdrop";

        const modal = document.createElement("div");
        modal.className = "bgsh-modal";

        const modalHeader = document.createElement("div");
        modalHeader.className = "bgsh-modal-header";
        const modalTitle = document.createElement("div");
        modalTitle.className = "bgsh-modal-title";
        modalTitle.textContent = "高级过滤";

        const modalActions = document.createElement("div");
        modalActions.className = "bgsh-modal-actions";

        const resetBtn = document.createElement("button");
        resetBtn.type = "button";
        resetBtn.className = "bgsh-chip";
        resetBtn.textContent = "清空过滤";
        resetBtn.title = "清空所有高级过滤项";

        const closeBtn = document.createElement("button");
        closeBtn.type = "button";
        closeBtn.className = "bgsh-modal-close";
        closeBtn.textContent = "关闭";
        closeBtn.setAttribute("aria-label", "关闭");

        modalActions.appendChild(resetBtn);
        modalActions.appendChild(closeBtn);
        modalHeader.appendChild(modalTitle);
        modalHeader.appendChild(modalActions);

        const modalBody = document.createElement("div");
        modalBody.className = "bgsh-modal-body";

        modal.appendChild(modalHeader);
        modal.appendChild(modalBody);
        modalBackdrop.appendChild(modal);
        document.body.appendChild(modalBackdrop);

        const readAdvancedModalPos = () => {
            const raw = GM_getValue(STORAGE_ADVANCED_MODAL_POS, null);
            if (!raw || typeof raw !== "object") return null;
            const x = Number(raw.x);
            const y = Number(raw.y);
            if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
            return { x, y };
        };
        let advancedModalPos = readAdvancedModalPos();

        const getBackdropPadding = () => {
            const cs = window.getComputedStyle(modalBackdrop);
            const pl = Number.parseFloat(cs.paddingLeft) || 0;
            const pr = Number.parseFloat(cs.paddingRight) || 0;
            const pt = Number.parseFloat(cs.paddingTop) || 0;
            const pb = Number.parseFloat(cs.paddingBottom) || 0;
            return { pl, pr, pt, pb };
        };
        const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
        const applyAdvancedModalPosition = () => {
            if (!advancedModalPos) {
                // 使用 CSS 默认：右上角（贴遮罩 padding）
                modal.style.left = "";
                modal.style.top = "";
                modal.style.right = "";
                return;
            }

            const { pl, pr, pt, pb } = getBackdropPadding();
            const availW = Math.max(0, window.innerWidth - pl - pr);
            const availH = Math.max(0, window.innerHeight - pt - pb);
            const maxX = Math.max(0, availW - modal.offsetWidth);
            const maxY = Math.max(0, availH - modal.offsetHeight);
            const x = clamp(advancedModalPos.x, 0, maxX);
            const y = clamp(advancedModalPos.y, 0, maxY);
            advancedModalPos = { x, y };
            modal.style.left = `${x}px`;
            modal.style.top = `${y}px`;
            modal.style.right = "auto";
        };

        const chipRefreshers = [];
        let refreshAdvancedIndicator = () => {};

        // 右侧：聚合模式按钮 + 首段加载进度
        const aggLabel = document.createElement("label");
        aggLabel.className = "bgsh-switch bgsh-agg-switch";

        const aggCheckbox = document.createElement("input");
        aggCheckbox.type = "checkbox";
        aggCheckbox.checked = aggEnabled;

        const aggUi = document.createElement("span");
        aggUi.className = "bgsh-switch-ui";

        const aggProgressFill = document.createElement("span");
        aggProgressFill.className = "bgsh-switch-fill";
        aggProgressFill.style.display = "none";
        aggUi.appendChild(aggProgressFill);

        const aggIndicator = document.createElement("span");
        aggIndicator.className = "bgsh-switch-indicator";

        const aggProgressSpinner = document.createElement("span");
        aggProgressSpinner.className = "bgsh-spinner";
        aggProgressSpinner.style.display = "none";

        aggIndicator.appendChild(aggProgressSpinner);
        aggUi.appendChild(aggIndicator);

        const aggText = document.createElement("span");
        aggText.className = "bgsh-switch-text";
        aggText.textContent = "聚合模式";
        aggText.title = "聚合：从本页开始往后 5 页";

        // 聚合受限窗口（北京时间 21:00-01:30）下禁用聚合：统一管理开关 UI 状态
        let aggPending = false;
        let aggRestricted = Boolean(aggRestrictedInitial);
        const aggTextDesired = "聚合模式";
        const aggTitleDesired = "聚合：从本页开始往后 5 页";

        const syncAggSwitchUI = (reason) => {
            if (aggRestricted) {
                aggCheckbox.checked = false;
                aggCheckbox.disabled = true;
                aggLabel.classList.remove("is-pending");
                aggText.textContent = "当前禁用聚合模式";
                aggText.title = "当前禁用聚合模式";
                return;
            }
            // 倒计时中也允许再次点击（用于立刻取消开启/关闭）
            aggCheckbox.disabled = false;
            aggLabel.classList.toggle("is-pending", aggPending);
            aggText.textContent = aggTextDesired;
            aggText.title = aggTitleDesired;
        };

        const setAggRestricted = (restricted, reason) => {
            aggRestricted = Boolean(restricted);
            if (aggRestricted) stopToggleCountdown();
            syncAggSwitchUI(reason);
        };

        const setAggSwitchPending = (pending) => {
            aggPending = Boolean(pending);
            syncAggSwitchUI();
        };

        const setAggSwitchText = (text) => {
            // 保持文本固定，避免“开启中/关闭中”变化
            syncAggSwitchUI();
        };

        // 初始化一次：若当前处于受限时段，直接禁用开关并提示原因
        setAggRestricted(aggRestricted, AGG_RESTRICT_REASON);

        aggLabel.appendChild(aggCheckbox);
        aggLabel.appendChild(aggUi);
        aggLabel.appendChild(aggText);

        let toggleCountdownTimer = 0;

        function stopToggleCountdown() {
            if (toggleCountdownTimer) window.clearInterval(toggleCountdownTimer);
            toggleCountdownTimer = 0;
            if (segmentState?.progressMode === "toggle") {
                segmentState.progressMode = "none";
                setAggSpinnerVisible(false);
            }
            resumeAggRequests();
            setAggSwitchPending(false);
        }

        function startToggleCountdown(sec, targetEnabled, onDone) {
            if (toggleCountdownTimer) return;
            if (aggRestricted && targetEnabled) return;
            pauseAggRequests();

            // 覆盖首段加载进度显示，避免两个逻辑同时写进度圈
            if (segmentState) segmentState.progressMode = "toggle";
            setAggProgressVisible(false);
            setAggSpinnerVisible(true);

            const totalMs = Math.max(1, Number(sec || 0) * 1000);
            const start = Date.now();
            setAggSwitchPending(true);

            toggleCountdownTimer = window.setInterval(() => {
                const elapsed = Date.now() - start;
                const p = clamp01(elapsed / totalMs);

                if (p >= 1) {
                    stopToggleCountdown();
                    onDone?.();
                }
            }, 100);
        }

        resetBtn.addEventListener("click", () => {
            const ok = window.confirm("确定要清空所有高级过滤项吗？");
            if (!ok) return;

            // 板块：清空 include/exclude
            includePresetFids.clear();
            excludePresetFids.clear();
            syncPresetFidsToStorage();

            // 关键词预设：清空
            keywordPresetState = {};
            GM_setValue(STORAGE_KEYWORD_PRESET_STATE, keywordPresetState);

            // 自定义关键词：清空成空字符串（按你的选择）
            excludeKeywordsText = "";
            includeKeywordsText = "";
            GM_setValue(STORAGE_EXCLUDE_KEYWORDS, excludeKeywordsText);
            GM_setValue(STORAGE_INCLUDE_KEYWORDS, includeKeywordsText);
            excludeKeywordsInput.value = "";
            includeKeywordsInput.value = "";

            // 悬赏区：恢复默认（不排除）
            excludeFid143 = false;
            GM_setValue(STORAGE_EXCLUDE_FID_143, excludeFid143);
            filterCheckbox.checked = false;

            rebuildFilterState();
            applyFilter();
            chipRefreshers.forEach((fn) => fn());
            refreshAdvancedIndicator();
        });

        aggCheckbox.addEventListener("change", () => {
            // 倒计时中：再次点击视为取消，立刻恢复到当前真实状态
            if (toggleCountdownTimer) {
                stopToggleCountdown();
                aggCheckbox.checked = Boolean(aggEnabled);
                syncAggSwitchUI();
                return;
            }
            // 受限窗口：禁止开启聚合
            if (aggCheckbox.checked && isAggRestrictedNow()) {
                setAggRemembered(false);
                setAggRestricted(true, AGG_RESTRICT_REASON);
                return;
            }
            // 开启：延迟 5s，再进入聚合（UI 先立刻滑动）
            if (aggCheckbox.checked && !aggEnabled) {
                startToggleCountdown(EXIT_COUNTDOWN_SEC, true, navigateToAgg);
                return;
            }
            // 关闭：立刻退出聚合（不等待）
            if (!aggCheckbox.checked && aggEnabled) {
                navigateToPlain();
            }
        });

        right.appendChild(aggLabel);
        // “高级过滤”按钮放最右侧（紧跟聚合开关）
        right.appendChild(advancedBtn);
        panel.appendChild(right);
        const applyAdvancedModalLayout = () => {
            // 以“当前导航栏”(脚本面板) 宽度为基准，取 1/2 作为弹窗宽度
            const rect = panel.getBoundingClientRect();
            const half = Math.round((rect.width || 0) / 2);
            if (half > 0) modal.style.width = `${half}px`;
            // 高度由 CSS 控制：紧凑自适应 + max-height 滚动
        };

        const setModalOpen = (open) => {
            // 这里不能用 ""，因为 CSS 里 .bgsh-modal-backdrop 默认 display:none
            modalBackdrop.style.display = open ? "block" : "none";
            advancedBtn.classList.toggle("is-open", open);
            if (open) {
                applyAdvancedModalLayout();
                applyAdvancedModalPosition();
            }
        };
        setModalOpen(false);

        advancedBtn.addEventListener("click", () => setModalOpen(true));
        closeBtn.addEventListener("click", () => setModalOpen(false));
        modalBackdrop.addEventListener("click", (e) => {
            if (e.target === modalBackdrop) setModalOpen(false);
        });
        window.addEventListener("keydown", (e) => {
            if (e.key !== "Escape") return;
            if (modalBackdrop.style.display === "none") return;
            setModalOpen(false);
        });
        window.addEventListener("resize", () => {
            if (modalBackdrop.style.display === "none") return;
            applyAdvancedModalLayout();
            applyAdvancedModalPosition();
        });

        // 允许拖动标题栏移动弹窗（并记住位置）
        (() => {
            let dragging = false;
            let pointerId = 0;
            let startX = 0;
            let startY = 0;
            let startLeft = 0;
            let startTop = 0;

            const getModalXY = () => {
                const { pl, pt } = getBackdropPadding();
                const r = modal.getBoundingClientRect();
                // modal 的 left/top 以遮罩 padding 边缘为 0
                return { x: r.left - pl, y: r.top - pt };
            };

            const onMove = (e) => {
                if (!dragging) return;
                const dx = e.clientX - startX;
                const dy = e.clientY - startY;

                const { pl, pr, pt, pb } = getBackdropPadding();
                const availW = Math.max(0, window.innerWidth - pl - pr);
                const availH = Math.max(0, window.innerHeight - pt - pb);
                const maxX = Math.max(0, availW - modal.offsetWidth);
                const maxY = Math.max(0, availH - modal.offsetHeight);

                const x = clamp(startLeft + dx, 0, maxX);
                const y = clamp(startTop + dy, 0, maxY);
                modal.style.left = `${x}px`;
                modal.style.top = `${y}px`;
                modal.style.right = "auto";
                advancedModalPos = { x, y };
            };

            const endDrag = () => {
                if (!dragging) return;
                dragging = false;
                window.removeEventListener("pointermove", onMove);
                window.removeEventListener("pointerup", endDrag);
                window.removeEventListener("pointercancel", endDrag);
                if (advancedModalPos) GM_setValue(STORAGE_ADVANCED_MODAL_POS, advancedModalPos);
            };

            modalHeader.addEventListener("pointerdown", (e) => {
                if (e.button != null && e.button !== 0) return;
                if (e.target?.closest?.("button, a, input, textarea, select")) return;
                if (modalBackdrop.style.display === "none") return;

                e.preventDefault();
                dragging = true;
                pointerId = e.pointerId;
                modalHeader.setPointerCapture(pointerId);
                startX = e.clientX;
                startY = e.clientY;
                const p = getModalXY();
                startLeft = p.x;
                startTop = p.y;

                window.addEventListener("pointermove", onMove);
                window.addEventListener("pointerup", endDrag);
                window.addEventListener("pointercancel", endDrag);
            });
        })();

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
            refreshAdvancedIndicator();
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

        refreshAdvancedIndicator = () => {
            const hasBoardRules =
                includePresetFids.size > 0 || excludePresetFids.size > 0;
            const hasKeywordPresets =
                Object.keys(keywordPresetState || {}).length > 0;
            const hasCustom =
                Boolean(String(excludeKeywordsText || "").trim()) ||
                Boolean(String(includeKeywordsText || "").trim());
            const active = hasBoardRules || hasKeywordPresets || hasCustom;
            advancedDot.style.display = active ? "" : "none";
        };
        refreshAdvancedIndicator();

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
                chipRefreshers.push(refresh);

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
                        refreshAdvancedIndicator();
                    }
                )
            )
        );

        modalBody.appendChild(boards);

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
                        refreshAdvancedIndicator();
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

        modalBody.appendChild(keywordGroup);

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

        const setProgressText = () => {};
        const setAggProgressVisible = (visible) => {
            aggProgressFill.style.display = visible ? "" : "none";
            if (!visible) {
                aggProgressFill.style.setProperty("--bgsh-progress", "0%");
            }
        };
        const setAggSpinnerVisible = (visible) => {
            aggProgressSpinner.style.display = visible ? "" : "none";
        };

        return {
            panel,
            setProgressText,
            aggProgressFill,
            setAggProgressVisible,
            setAggSpinnerVisible,
            setAggSwitchPending,
            setAggSwitchText,
            setAggRestricted,
        };
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
