// ==UserScript==
// @name         YouTube Filter Titles by Regex. Block Users by list or regex (Hides videos)
// @namespace    jjenkx
// @version      1.1
// @license      MIT
// @description  Blocks channels, title regex, channel regex. Hides videos that match list or regex
// @match        https://www.youtube.com/*
// @exclude      https://www.youtube.com/watch*
// @grant        GM.getValue
// @grant        GM.setValue
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/557036/YouTube%20Filter%20Titles%20by%20Regex%20Block%20Users%20by%20list%20or%20regex%20%28Hides%20videos%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557036/YouTube%20Filter%20Titles%20by%20Regex%20Block%20Users%20by%20list%20or%20regex%20%28Hides%20videos%29.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    // PAUSE LOGIC ADDED
    let tabActive = !document.hidden;
    document.addEventListener("visibilitychange", () => {
        tabActive = !document.hidden;
    });

    const KEY_ENABLED = "yt_filters_enabled";
    const KEY_BLOCKED_CHANNELS = "yt_blocked_channels";
    const KEY_CHANNEL_REGEXES = "yt_channel_regexes";
    const KEY_TITLE_REGEXES = "yt_title_regexes";
    const KEY_MIN_VIEWS = "yt_min_views";

    const KEY_EN_BLOCKED = "yt_en_blocked";
    const KEY_EN_CHAN_REGEX = "yt_en_chan_regex";
    const KEY_EN_TITLE_REGEX = "yt_en_title_regex";
    const KEY_EN_MIN_VIEWS = "yt_en_min_views";

    let filtersEnabled = await GM.getValue(KEY_ENABLED, true);
    let blockedChannels = new Set(await GM.getValue(KEY_BLOCKED_CHANNELS, []));
    let channelRegexes = await GM.getValue(KEY_CHANNEL_REGEXES, []);
    let titleRegexes = await GM.getValue(KEY_TITLE_REGEXES, []);
    let minViews = await GM.getValue(KEY_MIN_VIEWS, 0);

    let enBlocked = await GM.getValue(KEY_EN_BLOCKED, true);
    let enChanRegex = await GM.getValue(KEY_EN_CHAN_REGEX, true);
    let enTitleRegex = await GM.getValue(KEY_EN_TITLE_REGEX, true);
    let enMinViews = await GM.getValue(KEY_EN_MIN_VIEWS, true);

    const counts = {
        blocked: 0,
        chanRegex: 0,
        titleRegex: 0,
        minViews: 0,
        total: 0
    };

    function resetCounts() {
        counts.blocked = 0;
        counts.chanRegex = 0;
        counts.titleRegex = 0;
        counts.minViews = 0;
        counts.total = 0;
    }

    function compile(list) {
        const out = [];
        for (const s of list) {
            try { out.push(new RegExp(s, "i")); } catch {}
        }
        return out;
    }

    let rChan = compile(channelRegexes);
    let rTitle = compile(titleRegexes);

    async function saveAll() {
        await GM.setValue(KEY_BLOCKED_CHANNELS, [...blockedChannels]);
        await GM.setValue(KEY_CHANNEL_REGEXES, channelRegexes);
        await GM.setValue(KEY_TITLE_REGEXES, titleRegexes);
        await GM.setValue(KEY_MIN_VIEWS, minViews);

        await GM.setValue(KEY_EN_BLOCKED, enBlocked);
        await GM.setValue(KEY_EN_CHAN_REGEX, enChanRegex);
        await GM.setValue(KEY_EN_TITLE_REGEX, enTitleRegex);
        await GM.setValue(KEY_EN_MIN_VIEWS, enMinViews);

        rChan = compile(channelRegexes);
        rTitle = compile(titleRegexes);

        textByKey.clear();
        viewsByKey.clear();
    }

    (function disableScrollAnchor() {
        const st = document.createElement("style");
        st.textContent = "html,body,ytd-app,#content,#page-manager{overflow-anchor:none !important;}";
        document.head.appendChild(st);
    })();

    let lockedY = window.scrollY;
    let restoring = false;

    window.addEventListener("scroll", () => {
        if (!tabActive) return;  // ADDED
        if (!restoring) lockedY = window.scrollY;
    }, { passive: true });

    function restoreY() {
        const target = lockedY;
        let frames = 6;
        function step() {
            restoring = true;
            window.scrollTo(0, target);
            frames--;
            if (frames > 0) requestAnimationFrame(step);
            else restoring = false;
        }
        requestAnimationFrame(step);
    }

    let lastScrollY = window.scrollY;
    let lastDirection = 0;
    let antiJumpActive = false;

    window.addEventListener("scroll", () => {
        if (!tabActive) return;  // ADDED

        const y = window.scrollY;
        const diff = y - lastScrollY;
        if (diff > 0) lastDirection = 1;
        else if (diff < 0) lastDirection = -1;
        if (lastDirection === 1 && diff < -250) {
            antiJumpActive = true;
            lockedY = lastScrollY;
            hardRestoreScrollStabilized();
        }
        lastScrollY = y;
    }, { passive: true });

    function hardRestoreScrollStabilized() {
        let frames = 10;
        function loop() {
            restoring = true;
            window.scrollTo(0, lockedY);
            frames--;
            if (frames > 0 && antiJumpActive) requestAnimationFrame(loop);
            else {
                antiJumpActive = false;
                restoring = false;
            }
        }
        requestAnimationFrame(loop);
    }

    function strongHide(node) {
        node.style.display = "none";
        node.style.visibility = "hidden";
        node.style.height = "0";
        node.style.margin = "0";
        node.style.padding = "0";
        node.style.border = "0";
        node.style.overflow = "hidden";
    }

    function strongUnhide(node) {
        node.style.display = "";
        node.style.visibility = "";
        node.style.height = "";
        node.style.margin = "";
        node.style.padding = "";
        node.style.border = "";
        node.style.overflow = "";
        node.style.outline = "";
        node.style.outlineOffset = "";
        node.style.background = "";
    }

    function highlight(node) {
        strongUnhide(node);
        node.style.outline = "3px solid yellow";
        node.style.outlineOffset = "-3px";
        node.style.background = "rgba(255,255,0,0.2)";
    }

    function extractDeep(node) {
        let out = "";
        function walk(n) {
            if (!n) return;
            if (n.nodeType === 3) {
                const t = n.textContent.trim();
                if (t) out += " " + t;
                return;
            }
            if (n.shadowRoot) for (const c of n.shadowRoot.childNodes) walk(c);
            for (const c of n.childNodes) walk(c);
        }
        walk(node);
        return out.trim();
    }

    function getVideoKey(node) {
        const a = node.querySelector('a#thumbnail, a[href*="watch?v="], a[href^="/shorts/"]');
        let href = "";
        if (a) {
            href = a.getAttribute("href") || "";
            if (!href && a.href) href = a.href;
        }
        if (!href) {
            const t = node.querySelector("#video-title");
            const title = t ? (t.textContent || "").trim() : "";
            const c = node.querySelector('a.yt-core-attributed-string__link[href^="/@"]');
            const ch = c ? (c.textContent || "").trim() : "";
            return "fallback:" + ch + "|" + title;
        }
        if (href.startsWith("/")) href = location.origin + href;
        const m1 = href.match(/[?&]v=([a-zA-Z0-9_-]{6,})/);
        if (m1) return "v:" + m1[1];
        const m2 = href.match(/\/shorts\/([a-zA-Z0-9_-]{6,})/);
        if (m2) return "s:" + m2[1];
        return "u:" + href;
    }

    function getTitleText(node) {
        const t = node.querySelector("#video-title");
        if (t && t.textContent) return t.textContent.trim();
        const a = node.querySelector('a#video-title-link, a[href*="watch?v="][title]');
        if (a) {
            const tt = a.getAttribute("title");
            if (tt) return tt.trim();
            if (a.textContent) return a.textContent.trim();
        }
        return "";
    }

    function getChannelName(node) {
        const a = node.querySelector('a.yt-core-attributed-string__link[href^="/@"]');
        return a ? (a.textContent || "").trim() : "";
    }

    function parseViewsFast(node) {
        const meta = node.querySelector("#metadata-line");
        if (meta) {
            const spans = meta.querySelectorAll("span");
            for (const s of spans) {
                const t = (s.textContent || "");
                if (!t.includes("view")) continue;
                const m = t.replace(/,/g, "").match(/([\d.]+)\s*(K|M)?\s*view/i);
                if (!m) continue;
                let v = parseFloat(m[1]);
                if (m[2] === "K") v *= 1000;
                if (m[2] === "M") v *= 1000000;
                return Math.floor(v);
            }
        }
        const spans2 = node.querySelectorAll("span");
        for (const s of spans2) {
            const t = (s.textContent || "");
            if (!t.includes("view")) continue;
            const m = t.replace(/,/g, "").match(/([\d.]+)\s*(K|M)?\s*view/i);
            if (!m) continue;
            let v = parseFloat(m[1]);
            if (m[2] === "K") v *= 1000;
            if (m[2] === "M") v *= 1000000;
            return Math.floor(v);
        }
        return null;
    }

    const textByKey = new Map();
    const viewsByKey = new Map();

    function pruneMap(m) {
        if (m.size <= 6000) return;
        let n = 0;
        for (const k of m.keys()) {
            m.delete(k);
            n++;
            if (n >= 1200) break;
        }
    }

    function getTitleMatchText(node, key) {
        let v = textByKey.get(key);
        if (v !== undefined) return v;

        const title = getTitleText(node);
        const ch = getChannelName(node);
        const meta = node.querySelector("#metadata-line");
        const metaTxt = meta ? (meta.textContent || "").trim() : "";

        v = (title + " " + ch + " " + metaTxt).trim();

        if (!v) v = extractDeep(node);

        textByKey.set(key, v);
        pruneMap(textByKey);
        return v;
    }

    function getViewsCached(node, key) {
        let v = viewsByKey.get(key);
        if (v !== undefined) return v;
        v = parseViewsFast(node);
        viewsByKey.set(key, v);
        pruneMap(viewsByKey);
        return v;
    }

    const SELECT = "ytd-rich-item-renderer";

    let toggleBtn = null;
    let cntBlockedSpan = null;
    let cntChanSpan = null;
    let cntTitleSpan = null;
    let cntViewsSpan = null;

    function updateCountUI() {
        if (toggleBtn) {
            toggleBtn.textContent = filtersEnabled ? "Filter: ON (" + counts.total + ")" : "Filter: OFF (" + counts.total + ")";
        }
        if (cntBlockedSpan) cntBlockedSpan.textContent = String(counts.blocked);
        if (cntChanSpan) cntChanSpan.textContent = String(counts.chanRegex);
        if (cntTitleSpan) cntTitleSpan.textContent = String(counts.titleRegex);
        if (cntViewsSpan) cntViewsSpan.textContent = String(counts.minViews);
    }

    function evalHitReason(node, key, name) {
        if (enBlocked && name && blockedChannels.has(name)) return "blocked";
        if (enChanRegex && name) {
            for (const r of rChan) {
                if (r.test(name)) return "chanRegex";
            }
        }
        if (enTitleRegex && rTitle.length) {
            const txt = getTitleMatchText(node, key);
            for (const r of rTitle) {
                if (r.test(txt)) return "titleRegex";
            }
        }
        if (enMinViews && minViews > 0) {
            const views = getViewsCached(node, key);
            if (views !== null && views < minViews) return "minViews";
        }
        return null;
    }

    function process(node) {
        const key = getVideoKey(node);
        const name = getChannelName(node);

        const reason = evalHitReason(node, key, name);
        const hit = !!reason;

        if (hit) {
            if (filtersEnabled) strongHide(node);
            else highlight(node);
        } else {
            strongUnhide(node);
        }
    }

    function recountAll() {
        resetCounts();
        for (const n of document.querySelectorAll(SELECT)) {
            const key = getVideoKey(n);
            const name = getChannelName(n);
            const reason = evalHitReason(n, key, name);
            if (!reason) continue;
            counts.total++;
            if (reason === "blocked") counts.blocked++;
            else if (reason === "chanRegex") counts.chanRegex++;
            else if (reason === "titleRegex") counts.titleRegex++;
            else if (reason === "minViews") counts.minViews++;
        }
        updateCountUI();
    }

    function rerunAll() {
        const prev = lockedY;
        for (const n of document.querySelectorAll(SELECT)) process(n);
        lockedY = prev;
        restoreY();
        recountAll();
    }

    let recountTimer = null;
    function scheduleRecount() {
        if (recountTimer) clearTimeout(recountTimer);
        recountTimer = setTimeout(() => {
            recountTimer = null;
            recountAll();
        }, 80);
    }

    // MUTATION OBSERVER WRAPPED WITH TAB PAUSE

    new MutationObserver(muts => {
        if (!tabActive) return;  // ADDED

        let added = false;
        for (const m of muts) {
            for (const n of m.addedNodes || []) {
                if (!(n instanceof HTMLElement)) continue;
                if (n.matches && n.matches(SELECT)) {
                    process(n);
                    added = true;
                }
                if (n.querySelectorAll) {
                    const found = n.querySelectorAll(SELECT);
                    if (found.length) {
                        for (const f of found) process(f);
                        added = true;
                    }
                }
            }
        }
        if (added) {
            restoreY();
            scheduleRecount();
        }
    }).observe(document.body, { childList: true, subtree: true });

    function findEnd() {
        return document.querySelector("ytd-masthead #end") || document.querySelector("#end");
    }

    function makeUI() {
        const mount = findEnd();
        if (!mount || document.querySelector(".yt-filter-button-wrap")) return;

        const wrap = document.createElement("div");
        wrap.className = "yt-filter-button-wrap";
        wrap.style.display = "flex";
        wrap.style.gap = "8px";
        wrap.style.alignItems = "center";
        wrap.style.marginLeft = "12px";

        const toggle = document.createElement("button");
        toggleBtn = toggle;
        toggle.textContent = filtersEnabled ? "Filter: ON (0)" : "Filter: OFF (0)";
        toggle.style.padding = "6px 10px";
        toggle.style.fontSize = "12px";
        toggle.style.color = "#fff";
        toggle.style.borderRadius = "6px";
        toggle.style.cursor = "pointer";
        toggle.style.background = filtersEnabled ? "#c00" : "#0a0";

        toggle.onclick = async () => {
            filtersEnabled = !filtersEnabled;
            await GM.setValue(KEY_ENABLED, filtersEnabled);
            toggle.textContent = filtersEnabled ? "Filter: ON (" + counts.total + ")" : "Filter: OFF (" + counts.total + ")";
            toggle.style.background = filtersEnabled ? "#c00" : "#0a0";
            rerunAll();
        };

        const filtersBtn = document.createElement("button");
        filtersBtn.textContent = "Filters";
        filtersBtn.style.padding = "6px 10px";
        filtersBtn.style.fontSize = "12px";
        filtersBtn.style.background = "#333";
        filtersBtn.style.color = "#fff";
        filtersBtn.style.borderRadius = "6px";
        filtersBtn.style.cursor = "pointer";

        const box = document.createElement("div");
        Object.assign(box.style, {
            position: "fixed",
            top: "60px",
            right: "20px",
            background: "#222",
            color: "#fff",
            padding: "12px",
            border: "1px solid #444",
            borderRadius: "8px",
            zIndex: 999999,
            minWidth: "320px",
            display: "none"
        });

        filtersBtn.onclick = () => {
            box.style.display = box.style.display === "none" ? "block" : "none";
        };

        function makeCountLabel(base, spanRefSetter) {
            const span = document.createElement("span");
            span.textContent = "0";
            spanRefSetter(span);
            const label = document.createElement("span");
            label.append(base, " (", span, ")");
            return label;
        }

        function section(label, enabled, onToggle, body) {
            const wrap = document.createElement("div");
            const head = document.createElement("label");
            const cb = document.createElement("input");
            cb.type = "checkbox";
            cb.checked = enabled;
            cb.onchange = () => {
                onToggle(cb.checked);
                body.style.display = cb.checked ? "" : "none";
                rerunAll();
            };
            head.append(cb, " ", label);
            body.style.display = enabled ? "" : "none";
            wrap.append(head, body);
            return wrap;
        }

        function ta(value) {
            const t = document.createElement("textarea");
            t.style.width = "100%";
            t.style.height = "70px";
            t.value = value;
            return t;
        }

        const a1 = ta([...blockedChannels].join("\n"));
        const a2 = ta(channelRegexes.join("\n"));
        const a3 = ta(titleRegexes.join("\n"));

        const mv = document.createElement("input");
        mv.type = "number";
        mv.style.width = "100%";
        mv.value = minViews;

        const save = document.createElement("button");
        save.textContent = "Save";
        save.style.marginTop = "8px";
        save.onclick = async () => {
            blockedChannels = new Set(a1.value.split(/\r?\n/).map(s => s.trim()).filter(Boolean));
            channelRegexes = a2.value.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
            titleRegexes = a3.value.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
            minViews = parseInt(mv.value) || 0;
            await saveAll();
            box.style.display = "none";
            rerunAll();
        };

        const lblBlocked = makeCountLabel("Blocked Channels", s => { cntBlockedSpan = s; });
        const lblChan = makeCountLabel("Channel Regex", s => { cntChanSpan = s; });
        const lblTitle = makeCountLabel("Title Regex", s => { cntTitleSpan = s; });
        const lblViews = makeCountLabel("Min Views", s => { cntViewsSpan = s; });

        box.append(
            section(lblBlocked, enBlocked, v => enBlocked = v, a1),
            section(lblChan, enChanRegex, v => enChanRegex = v, a2),
            section(lblTitle, enTitleRegex, v => enTitleRegex = v, a3),
            section(lblViews, enMinViews, v => enMinViews = v, mv),
            save
        );

        wrap.append(toggle, filtersBtn);
        mount.append(wrap);
        document.body.append(box);

        recountAll();
    }

    makeUI();
})();
