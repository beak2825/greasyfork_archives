// ==UserScript==
// @name         YouTube Filter Titles by Regex. Block Users by list or regex (Hides videos)
// @namespace    jjenkx
// @version      1.0
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

    // -------------------------------------------------------------------------
    // STORAGE KEYS
    // Persistent user settings are saved under these keys. They store:
    //  - Whether filtering is on or off
    //  - A set of blocked channel names
    //  - Regex lists for channel names
    //  - Regex lists for video titles
    // -------------------------------------------------------------------------
    const KEY_ENABLED = "yt_filters_enabled";
    const KEY_BLOCKED_CHANNELS = "yt_blocked_channels";
    const KEY_CHANNEL_REGEXES = "yt_channel_regexes";
    const KEY_TITLE_REGEXES = "yt_title_regexes";

    // -------------------------------------------------------------------------
    // LOAD USER SETTINGS
    // These are pulled from Greasemonkey storage asynchronously.
    // blockedChannels is stored as a Set for fast exact-match lookups.
    // Regex lists are stored as plain arrays and turned into RegExp later.
    // -------------------------------------------------------------------------
    let filtersEnabled = await GM.getValue(KEY_ENABLED, true);
    let blockedChannels = new Set(await GM.getValue(KEY_BLOCKED_CHANNELS, []));
    let channelRegexes = await GM.getValue(KEY_CHANNEL_REGEXES, []);
    let titleRegexes = await GM.getValue(KEY_TITLE_REGEXES, []);

    // -------------------------------------------------------------------------
    // compile(list)
    // Safely builds an array of RegExp objects. Invalid patterns are ignored.
    // All regexes use the "i" flag to make matching case-insensitive.
    // -------------------------------------------------------------------------
    function compile(list) {
        const out = [];
        for (const s of list) {
            try {
                out.push(new RegExp(s, "i"));
            } catch {}
        }
        return out;
    }

    // Precompiled regex lists used for filtering
    let rChan = compile(channelRegexes);
    let rTitle = compile(titleRegexes);

    // -------------------------------------------------------------------------
    // SAVE FUNCTIONS
    // These update both GM storage and the compiled regex arrays.
    // -------------------------------------------------------------------------
    async function saveBlocked() {
        await GM.setValue(KEY_BLOCKED_CHANNELS, [...blockedChannels]);
    }

    async function saveChannelRegex() {
        await GM.setValue(KEY_CHANNEL_REGEXES, channelRegexes);
        rChan = compile(channelRegexes);
    }

    async function saveTitleRegex() {
        await GM.setValue(KEY_TITLE_REGEXES, titleRegexes);
        rTitle = compile(titleRegexes);
    }

    // -------------------------------------------------------------------------
    // DISABLE NATIVE SCROLL ANCHORING
    // YouTube dynamically inserts rows into the main grid. Overflow anchoring
    // tries to auto-preserve the scroll position but behaves unpredictably
    // when nodes are aggressively hidden. We disable it and take full control.
    // -------------------------------------------------------------------------
    (function disableScrollAnchor() {
        const st = document.createElement("style");
        st.textContent = "html,body,ytd-app,#content,#page-manager{overflow-anchor:none !important;}";
        document.head.appendChild(st);
    })();

    // -------------------------------------------------------------------------
    // HARD PIXEL SCROLL LOCK
    // lockedY always holds the last known good scroll position. When jumps
    // occur due to YouTube reflowing content, restoreY() forcibly resets the
    // viewport over several animation frames to eliminate jitter.
    // -------------------------------------------------------------------------
    let lockedY = window.scrollY;
    let restoring = false;

    window.addEventListener("scroll", () => {
        if (!restoring) lockedY = window.scrollY;
    }, { passive: true });

    // restoreY() repeatedly locks the scroll position for a few frames
    function restoreY() {
        const target = lockedY;
        let frames = 6;
        function step() {
            restoring = true;
            window.scrollTo(0, target);
            frames--;
            if (frames > 0) {
                requestAnimationFrame(step);
            } else {
                restoring = false;
            }
        }
        requestAnimationFrame(step);
    }

    // -------------------------------------------------------------------------
    // ANTI-JUMP DELTA STABILIZER
    // YouTube sometimes loads many new tiles above the current viewport when
    // scrolling quickly downward, causing a massive sudden jump upward.
    //
    // The logic here:
    //  - Track scroll direction
    //  - Detect large negative delta while direction is downward
    //  - Trigger multi-frame stabilization restoring lockedY repeatedly
    // -------------------------------------------------------------------------
    let lastScrollY = window.scrollY;
    let lastDirection = 0;       // 1 = down, -1 = up
    let antiJumpActive = false;

    window.addEventListener("scroll", () => {
        const y = window.scrollY;
        const diff = y - lastScrollY;

        if (diff > 0) lastDirection = 1;
        else if (diff < 0) lastDirection = -1;

        // Large upward spike while scrolling down = YouTube grid jump
        if (lastDirection === 1 && diff < -250) {
            antiJumpActive = true;
            lockedY = lastScrollY;
            hardRestoreScrollStabilized();
        }

        lastScrollY = y;
    }, { passive: true });

    // Hard stabilization over many frames
    function hardRestoreScrollStabilized() {
        let frames = 10;
        function loop() {
            restoring = true;
            window.scrollTo(0, lockedY);
            frames--;
            if (frames > 0 && antiJumpActive) {
                requestAnimationFrame(loop);
            } else {
                antiJumpActive = false;
                restoring = false;
            }
        }
        requestAnimationFrame(loop);
    }

    // -------------------------------------------------------------------------
    // extract(node)
    // Recursively extracts all visible text from a DOM subtree, including
    // shadow DOM. This is necessary because many YouTube components
    // use shadow roots and nested spans.
    // -------------------------------------------------------------------------
    function extract(node) {
        let out = "";

        function walk(n) {
            if (!n) return;

            // Text node
            if (n.nodeType === 3) {
                const t = n.textContent.trim();
                if (t) out += " " + t;
                return;
            }

            // Shadow root support
            if (n.shadowRoot) {
                for (const c of n.shadowRoot.childNodes) walk(c);
            }

            // Regular children
            for (const c of n.childNodes) walk(c);
        }

        walk(node);
        return out.trim();
    }

    // -------------------------------------------------------------------------
    // MATCH LOGIC
    // matchChannel(name): true if channel is blocked by exact name or regex.
    // matchTitle(text):   true if any title regex matches.
    // -------------------------------------------------------------------------
    function matchChannel(name) {
        if (!name) return false;
        if (blockedChannels.has(name)) return true;
        for (const r of rChan) if (r.test(name)) return true;
        return false;
    }

    function matchTitle(txt) {
        if (!txt) return false;
        for (const r of rTitle) if (r.test(txt)) return true;
        return false;
    }

    // -------------------------------------------------------------------------
    // strongHide(node)
    // Correct node to hide is the full ytd-rich-item-renderer element.
    // We collapse height, margins, borders, and overflow so the grid layout
    // shows no gaps whatsoever.
    // -------------------------------------------------------------------------
    function strongHide(node) {
        node.style.display = "none";
        node.style.visibility = "hidden";
        node.style.height = "0";
        node.style.margin = "0";
        node.style.padding = "0";
        node.style.border = "0";
        node.style.overflow = "hidden";
    }

    // Remove forced styles to make node visible again
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

    // Visual highlight for debug when filters are disabled
    function highlight(node) {
        strongUnhide(node);
        node.style.outline = "3px solid yellow";
        node.style.outlineOffset = "-3px";
        node.style.background = "rgba(255,255,0,0.2)";
    }

    // -------------------------------------------------------------------------
    // INLINE BLOCK BUTTON
    // Inserts a tiny "[Block]" or "[Unblock]" button next to channel names.
    // Clicking toggles their presence in blockedChannels and reruns filters.
    // -------------------------------------------------------------------------
    function addBlockButton(anchor, name) {
        if (!anchor) return;
        if (anchor.nextSibling && anchor.nextSibling.className === "yt-block-inline-btn") return;

        const b = document.createElement("button");
        b.className = "yt-block-inline-btn";
        b.textContent = blockedChannels.has(name) ? "[Unblock]" : "[Block]";

        Object.assign(b.style, {
            marginLeft: "6px",
            fontSize: "12px",
            cursor: "pointer",
            padding: "0 4px",
            border: "1px solid #666",
            background: blockedChannels.has(name) ? "#444" : "#c00",
            color: "#fff",
            borderRadius: "2px"
        });

        b.onclick = async e => {
            e.stopPropagation();
            e.preventDefault();

            if (blockedChannels.has(name)) {
                blockedChannels.delete(name);
            } else {
                blockedChannels.add(name);
            }

            await saveBlocked();
            rerunAll();
        };

        anchor.insertAdjacentElement("afterend", b);
    }

    // -------------------------------------------------------------------------
    // MAIN SELECTOR
    // ytd-rich-item-renderer is the official grid cell on homepage/explore/etc.
    // This is the only reliable and stable node for actual video items.
    // -------------------------------------------------------------------------
    const SELECT = "ytd-rich-item-renderer";

    // -------------------------------------------------------------------------
    // process(node)
    // Extracts text, finds channel anchor, tests filters, hides or highlights,
    // attaches block button. Called for both existing and newly inserted nodes.
    // -------------------------------------------------------------------------
    function process(node) {
        const txt = extract(node);
        const anchor = node.querySelector('a.yt-core-attributed-string__link[href^="/@"]');
        const name = anchor ? anchor.textContent.trim() : "";

        const hit = matchChannel(name) || matchTitle(txt);

        if (hit) {
            if (filtersEnabled) strongHide(node);
            else highlight(node);
        } else {
            strongUnhide(node);
        }

        if (anchor && name) addBlockButton(anchor, name);
    }

    // -------------------------------------------------------------------------
    // rerunAll()
    // Re-applies filtering to every video tile on the page and then restores
    // the scroll position to prevent layout shift.
    // -------------------------------------------------------------------------
    function rerunAll() {
        const prev = lockedY;
        const list = document.querySelectorAll(SELECT);

        for (const n of list) process(n);

        lockedY = prev;
        restoreY();
    }

    // -------------------------------------------------------------------------
    // MUTATION OBSERVER
    // YouTube loads grid items dynamically (infinite scroll). This observer
    // listens for any new DOM insertions anywhere inside <body>. When
    // ytd-rich-item-renderer nodes appear, they are immediately processed.
    // -------------------------------------------------------------------------
    new MutationObserver(muts => {
        let added = false;

        for (const m of muts) {
            if (!m.addedNodes) continue;

            for (const n of m.addedNodes) {
                if (!(n instanceof HTMLElement)) continue;

                // Direct match
                if (n.matches && n.matches(SELECT)) {
                    process(n);
                    added = true;
                }

                // Deep match
                if (n.querySelectorAll) {
                    const found = n.querySelectorAll(SELECT);
                    if (found.length > 0) {
                        for (const f of found) process(f);
                        added = true;
                    }
                }
            }
        }

        if (added) {
            const prev = lockedY;
            lockedY = prev;
            restoreY();
        }
    }).observe(document.body, { childList: true, subtree: true });

    // -------------------------------------------------------------------------
    // UI CREATION
    // Adds two buttons in the top-right:
    //  - Filter: ON/OFF   (toggles filtering)
    //  - Rules            (opens settings panel)
    //
    // The panel contains:
    //  - Blocked channels list
    //  - Channel regex list
    //  - Title regex list
    //  - Save button
    //
    // The UI auto-heals by respawning if YouTube re-renders the masthead.
    // -------------------------------------------------------------------------

    function findEnd() {
        return (
            document.querySelector("ytd-masthead #end") ||
            document.querySelector("#masthead #end") ||
            document.querySelector("#end")
        );
    }

    function makeUI() {
        const mount = findEnd();
        if (!mount) {
            requestAnimationFrame(makeUI);
            return;
        }

        if (document.querySelector(".yt-filter-button-wrap")) return;

        const wrap = document.createElement("div");
        wrap.className = "yt-filter-button-wrap";
        wrap.style.display = "flex";
        wrap.style.gap = "8px";
        wrap.style.alignItems = "center";
        wrap.style.marginLeft = "12px";

        // Filter toggle button
        const toggle = document.createElement("button");
        toggle.textContent = filtersEnabled ? "Filter: ON" : "Filter: OFF";
        toggle.style.padding = "6px 10px";
        toggle.style.fontSize = "12px";
        toggle.style.background = filtersEnabled ? "#c00" : "#0a0";
        toggle.style.color = "#fff";
        toggle.style.border = "1px solid rgba(255,255,255,0.3)";
        toggle.style.borderRadius = "6px";
        toggle.style.cursor = "pointer";

        toggle.onclick = async () => {
            filtersEnabled = !filtersEnabled;
            await GM.setValue(KEY_ENABLED, filtersEnabled);
            toggle.textContent = filtersEnabled ? "Filter: ON" : "Filter: OFF";
            toggle.style.background = filtersEnabled ? "#c00" : "#0a0";
            rerunAll();
        };

        // Rules button (opens panel)
        const rules = document.createElement("button");
        rules.textContent = "Rules";
        rules.style.padding = "6px 10px";
        rules.style.fontSize = "12px";
        rules.style.background = "#333";
        rules.style.color = "#fff";
        rules.style.border = "1px solid rgba(255,255,255,0.3)";
        rules.style.borderRadius = "6px";
        rules.style.cursor = "pointer";

        // Settings panel
        const box = document.createElement("div");
        box.style.position = "fixed";
        box.style.top = "60px";
        box.style.right = "20px";
        box.style.background = "#222";
        box.style.color = "#fff";
        box.style.padding = "12px";
        box.style.border = "1px solid #444";
        box.style.borderRadius = "8px";
        box.style.zIndex = 999999;
        box.style.minWidth = "300px";
        box.style.display = "none";

        rules.onclick = () => {
            box.style.display = box.style.display === "none" ? "block" : "none";
        };

        const l1 = document.createElement("div");
        l1.textContent = "Blocked Channels:";
        const a1 = document.createElement("textarea");
        a1.style.width = "100%";
        a1.style.height = "80px";
        a1.value = [...blockedChannels].join("\n");

        const l2 = document.createElement("div");
        l2.textContent = "Channel Regex:";
        const a2 = document.createElement("textarea");
        a2.style.width = "100%";
        a2.style.height = "80px";
        a2.value = channelRegexes.join("\n");

        const l3 = document.createElement("div");
        l3.textContent = "Title Regex:";
        const a3 = document.createElement("textarea");
        a3.style.width = "100%";
        a3.style.height = "80px";
        a3.value = titleRegexes.join("\n");

        const save = document.createElement("button");
        save.textContent = "Save";
        save.style.marginTop = "10px";
        save.style.padding = "6px 10px";
        save.style.background = "#0066cc";
        save.style.color = "#fff";
        save.style.border = "1px solid #444";
        save.style.borderRadius = "6px";
        save.style.cursor = "pointer";

        save.onclick = async () => {
            blockedChannels = new Set(a1.value.split(/\r?\n/).map(s => s.trim()).filter(Boolean));
            channelRegexes = a2.value.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
            titleRegexes = a3.value.split(/\r?\n/).map(s => s.trim()).filter(Boolean);

            await saveBlocked();
            await saveChannelRegex();
            await saveTitleRegex();

            rChan = compile(channelRegexes);
            rTitle = compile(titleRegexes);

            box.style.display = "none";
            rerunAll();
        };

        box.append(l1, a1, l2, a2, l3, a3, save);

        wrap.append(toggle, rules);
        mount.append(wrap);
        document.body.append(box);
    }

    // Build UI once
    makeUI();

    // Auto-heal loop: if YouTube destroys the masthead and rebuilds,
    // reinitialize the UI. Runs once per animation frame.
    (function uiLoop() {
        if (findEnd() && !document.querySelector(".yt-filter-button-wrap")) {
            makeUI();
        }
        requestAnimationFrame(uiLoop);
    })();

})();
