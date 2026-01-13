// ==UserScript==
// @name         Torn Item Master (Drug Details + First Sentence Inline)
// @namespace    https://torn.com/
// @version      2.6.4
// @description  Shows ONLY the first sentence of drug effect inline. Replaces popup drug bullet line with Pros/Cons/Cooldown/Overdose. Fixes weapon/armor value alignment + mobile value placement.
// @match        https://www.torn.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/562308/Torn%20Item%20Master%20%28Drug%20Details%20%2B%20First%20Sentence%20Inline%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562308/Torn%20Item%20Master%20%28Drug%20Details%20%2B%20First%20Sentence%20Inline%29.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const TT_DEBUG = false;
    const log = (...a) => TT_DEBUG && console.log("[TT]", ...a);

    // -------------------- CACHE --------------------
    function getCache() {
        const keys = ["tt_shared_item_data", "tt_master_item_cache", "tt_item_data_v2"];
        for (const key of keys) {
            const raw = localStorage.getItem(key);
            if (!raw) continue;
            try { return JSON.parse(raw); } catch (e) { log("Bad cache JSON:", key, e); }
        }
        return null;
    }

    let _lastCacheRef = null;
    let _nameToId = null;

    function buildNameIndex(cache) {
        if (!cache || cache === _lastCacheRef) return;
        _lastCacheRef = cache;
        _nameToId = Object.create(null);

        for (const [id, item] of Object.entries(cache)) {
            if (!item || !item.name) continue;
            const key = String(item.name).toLowerCase().trim();
            if (!key) continue;
            if (!_nameToId[key]) _nameToId[key] = id;
        }
    }

    // -------------------- DRUG INFORMATION (structured) --------------------
    const DRUG_INFORMATION_BY_NAME = {
        "cannabis": { pros: ["+8-12 Nerve"], cons: ["-20% Strength", "-25% Defense", "-35% Speed"], cooldown: "1-1.5 hours", overdose: { bars: ["-100% Energy & Nerve"], hosp_time: "300-350 minutes", extra: "Spaced Out honor bar" } },
        "ecstasy": { pros: ["Doubles Happy"], cons: [], cooldown: "3h 20m - 3h 50m", overdose: { bars: ["-100% Energy & Happy"] } },
        "ketamine": { pros: ["+50% Defense"], cons: ["-20% Strength", "-20% Speed"], cooldown: "45-60 minutes", overdose: { bars: ["-100% Energy, Nerve & Happy", "-20% Strength & Speed"], hosp_time: "1,000 minutes", extra: "Increased cooldown (24-27 hours)" } },
        "lsd": { pros: ["+30% Strength", "+50% Defense", "+50 Energy", "+200-500 Happy", "+5 Nerve"], cons: ["-30% Speed & Dexterity"], cooldown: "6h 40m - 7h 30m", overdose: { bars: ["-100% Energy & Nerve", "-50% Happy", "-30% Speed & Dexterity"], extra: "Drug Cooldown up to 590 minutes (~10 hours)" } },
        "opium": { pros: ["+30% Defense", "Removes hospital time", "Replenishes life to 50%"], cons: [], cooldown: "2-3 hours", overdose: null },
        "pcp": { pros: ["+20% Strength & Dexterity", "+250 Happy"], cons: [], cooldown: "4h 20m - 6h 40m", overdose: { bars: ["-100% Energy, Nerve & Happy"], hosp_time: "1,620 minutes", extra: "-10 x (current level) to Speed (permanent)" } },
        "shrooms": { pros: ["+500 Happy"], cons: ["-20% All Battle Stats", "-25 Energy (caps at 0)"], cooldown: "3h 02m - 3h 57m", overdose: { bars: ["-100% Energy, Nerve & Happy"], hosp_time: "100 minutes" } },
        "speed": { pros: ["+20% Speed", "+50 Happy"], cons: ["-20% Dexterity"], cooldown: "4h 10m - 5h 52m", overdose: { bars: ["-100% Energy, Nerve & Happiness"], hosp_time: "150 minutes", extra: "-6 x (current level) to Strength & Defense (permanent)" } },
        "vicodin": { pros: ["+25% All Battle Stats", "+75 Happy"], cons: [], cooldown: "4-6 hours", overdose: { bars: ["-150 Happy"] } },
        "xanax": { pros: ["+250 Energy", "+75 Happy"], cons: ["-35% All Battle Stats"], cooldown: "6-8 hours", overdose: { bars: ["-100% Energy, Nerve & Happy"], hosp_time: "3 days 12 hours", extra: "24 hours of cooldown and increased addiction." } },
        "love juice": { pros: ["Reduces attack & revive energy cost by 10", "+50% Speed", "+25% Dexterity"], cons: [], cooldown: "5-8 hours", overdose: null },
    };

    function getDrugInfoForName(name) {
        const key = String(name || "").toLowerCase().trim();
        return DRUG_INFORMATION_BY_NAME[key] || null;
    }

    // -------------------- TEXT HELPERS --------------------
    function normalizeText(text) { return String(text || "").replace(/\s+/g, " ").trim(); }
    function splitSentences(text) {
        const s = normalizeText(text);
        if (!s) return [];
        const parts = s.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [];
        return parts.map(p => p.trim()).filter(Boolean);
    }
    function stripIncludesSideEffects(text) { return normalizeText(String(text || "").replace(/includes side effects\.?/ig, "")); }
    function firstSentence(text) { return splitSentences(text)[0] || ""; }

    // -------------------- RESPONSIVE HELPERS --------------------
    function isMobileLayout() {
        return window.matchMedia && window.matchMedia("(max-width: 784px)").matches;
    }

    // -------------------- PRICE PLACEMENT --------------------
    function upsertPrice(row, html, rightPx) {
        const host = row.querySelector(".info-wrap") || row;
        host.style.position = host.style.position || "relative";

        let priceWrap = host.querySelector(":scope > .tt-v-align");
        if (!priceWrap) {
            priceWrap = document.createElement("div");
            priceWrap.className = "tt-v-align";
            host.appendChild(priceWrap);

            const priceSpan = document.createElement("span");
            priceSpan.className = "tt-v-text";
            priceWrap.appendChild(priceSpan);
        }

        priceWrap.style.right = `${rightPx}px`;
        const span = priceWrap.querySelector(".tt-v-text");
        span.innerHTML = html;
    }

    function computeRightOffset(row) {
        const category = String(row.dataset.category || "").toLowerCase();

        // Desktop defaults
        let right = 150;
        if (["armor", "primary", "secondary", "melee"].includes(category)) right = 95;

        // Mobile: your screenshot shows the value sitting too far LEFT and overlapping text.
        // So we anchor it closer to the RIGHT-side action icons by using a *larger* right offset.
        if (isMobileLayout()) {
            right = 18; // move toward far-right edge (less inset)
            if (["armor", "primary", "secondary", "melee"].includes(category)) right = 22;
        }

        return right;
    }

    // -------------------- INLINE ROW ENHANCEMENTS --------------------
    function applyEnhancements() {
        const cache = getCache();
        if (!cache) return;

        const rows = document.querySelectorAll("li[data-item]");
        rows.forEach(row => {
            if (row.hasAttribute("data-tt-v264")) return;

            const id = row.dataset.item;
            const item = cache[id];
            if (!item) return;

            row.setAttribute("data-tt-v264", "true");

            const nameWrap = row.querySelector(".name-wrap") || row.querySelector(".name") || row.querySelector(".title");
            if (!nameWrap) return;

            if (isMobileLayout()) row.classList.add("tt-mobile-row");

            const effectNum = (item.effect?.match(/\d+/) || [0])[0];

            if (effectNum > 0 && ["Alcohol", "Energy Drink", "Candy"].includes(item.type)) {
                const suffix = item.type === "Alcohol" ? "N" : (item.type === "Candy" ? "H" : "E");
                const gainSpan = document.createElement("span");
                gainSpan.className = "tt-inline-effect";
                gainSpan.textContent = `- ${effectNum}${suffix}`;
                nameWrap.appendChild(gainSpan);
            } else if (item.type === "Book") {
                const bookSpan = document.createElement("span");
                bookSpan.className = "tt-inline-effect tt-book";
                bookSpan.textContent = `- ${(item.effect || "Active").split(".")[0]}`;
                bookSpan.style.cssText = "display:inline-block;vertical-align:baseline;margin:0 0 0;margin-top: -10px;transform:translateY(-3px);font-size:10px;color:#4dabf7;";
                nameWrap.appendChild(bookSpan);
            }
            // Drugs: ONLY first sentence inline (DO NOT CHANGE)
            else if (item.type === "Drug") {
                const cleaned = stripIncludesSideEffects(item.effect || "");
                const first = firstSentence(cleaned);
                const hasSE = /side effects?/i.test(String(item.effect || ""));

                const drugSpan = document.createElement("span");
                drugSpan.className = "tt-inline-effect tt-drug";
                drugSpan.textContent = first ? `- ${first}` : "- Drug";
                nameWrap.appendChild(drugSpan);

                if (hasSE) {
                    const seSpan = document.createElement("span");
                    seSpan.className = "tt-inline-effect tt-sidefx";
                    seSpan.textContent = "⚠ side effects";
                    //nameWrap.appendChild(seSpan);
                }
            }

            // Market Value
            const price = item.market_price || item.price || 0;
            if (price > 0) {
                const qtyEl = row.querySelector(".qty, .amount, .item-amount");
                const qty = parseInt(qtyEl?.textContent.replace(/\D/g, ""), 10) || 1;

                const html = qty > 1
                    ? `$${price.toLocaleString()} | <span class="tt-green">${qty}x = </span><span class="tt-green">$${(price * qty).toLocaleString()}</span>`
                    : `$${price.toLocaleString()}`;

                upsertPrice(row, html, computeRightOffset(row));
            }
        });
    }

    // -------------------- POPUP DRUG DETAILS --------------------
    function isLoading(node) {
        if (!node) return true;
        if (node.querySelector(".ajax-preloader, .ajax-placeholder")) return true;
        if (node.querySelector("[class*='ajax-preloader'], [class*='ajax-placeholder']")) return true;
        if (node.querySelector("[class*='preloader_'], [class*='ajaxPreloader_']")) return true;
        if (node.querySelector("[class*='preloader']")) return true;
        return false;
    }

    function findStableDescriptionNode(start) {
        if (!start) return null;
        if (start.matches("[class*='description___']")) return start;
        const desc = start.querySelector("[class*='description___']");
        if (desc) return desc;

        if (start.matches(".info-msg")) return start;
        const info = start.querySelector(".info-msg");
        if (info) return info;

        return start;
    }

    function resolveItemIdFromBox(box) {
        const li = box.closest("li[data-item]");
        if (li?.dataset?.item) return li.dataset.item;

        const li2 = box.closest("li[itemid]");
        const itemid = li2?.getAttribute?.("itemid");
        if (itemid && /^\d+$/.test(itemid)) return itemid;

        const ariaNode =
            box.closest(".info-wrap[aria-labelledby]") ||
            box.closest("[aria-labelledby*='armory-info-']") ||
            box.querySelector(".info-wrap[aria-labelledby]") ||
            box.querySelector("[aria-labelledby*='armory-info-']");
        const aria = ariaNode?.getAttribute?.("aria-labelledby") || "";
        const m = aria.match(/armory-info-(\d+)/i);
        if (m) return m[1];

        const img =
            box.querySelector("img") ||
            box.closest(".show-item-info, .view-item-info, .details-wrap, .info-wrap, [class*='view_']")?.querySelector("img");
        const src = img?.getAttribute?.("src") || "";
        const mi = src.match(/\/items\/(\d+)\/(?:large|medium|small).*?\.(?:png|jpg|jpeg|webp)/i);
        if (mi) return mi[1];

        return null;
    }

    function extractDrugNameFromPanelText(target) {
        const txt = normalizeText(target.textContent || "");
        const m = txt.match(/\bThe\s+(.+?)\s+is\s+a\s+Drug\s+Item\./i);
        return m ? m[1].trim() : null;
    }

    function findItemForPanel(target, cache) {
        const id = resolveItemIdFromBox(target);
        if (id && cache[id]) return { id, item: cache[id] };

        const name = extractDrugNameFromPanelText(target);
        if (name) {
            buildNameIndex(cache);
            const byNameId = _nameToId?.[String(name).toLowerCase().trim()];
            if (byNameId && cache[byNameId]) return { id: byNameId, item: cache[byNameId] };
        }

        return { id: null, item: null };
    }

    function removeTornEffectBullet(parent, item) {
        const rawEffect = normalizeText(item?.effect || "");
        if (!rawEffect) return;

        const rawEffectNoSE = stripIncludesSideEffects(rawEffect);

        const children = Array.from(parent.children);
        for (const el of children) {
            const t = normalizeText(el.textContent || "");
            if (!t) continue;

            const noBullet = t.replace(/^[•\-\*]\s*/g, "").trim();

            if (noBullet === rawEffect || noBullet === rawEffectNoSE) {
                el.remove();
                continue;
            }

            if (/includes side effects/i.test(t) && (t.includes("Increases") || t.includes("Doubles") || t.includes("Temporarily") || t.includes("Removes") || t.includes("Reduces"))) {
                el.remove();
                continue;
            }
        }
    }

    function showDrugDetailsLikeTornTools(parent, info) {
        parent.classList.add("tt-modified");
        parent.querySelectorAll(".tt-drug-details").forEach(n => n.remove());

        const wrap = document.createElement("div");
        wrap.className = "tt-drug-details";
        wrap.style.cssText = "margin-top:10px;";

        const makeLine = (text, color, marginLeft = 0) => {
            const d = document.createElement("div");
            d.textContent = text;
            d.style.cssText = `font-size:${isMobileLayout() ? 12 : 13}px; line-height:1.35; color:${color}; font-weight:bold;` + (marginLeft ? `margin-left:${marginLeft}px;` : "");
            return d;
        };

        wrap.appendChild(makeLine("Pros:", "#75a832", 0));
        (info.pros || []).forEach(p => wrap.appendChild(makeLine(p, "#75a832", 15)));

        wrap.appendChild(makeLine("Cons:", "#ff3b3b", 0));
        (info.cons || []).forEach(c => wrap.appendChild(makeLine(c, "#ff3b3b", 15)));

        if (info.cooldown) wrap.appendChild(makeLine(`Cooldown : ${info.cooldown}`, "#ff3b3b", 0));

        if (info.overdose) {
            wrap.appendChild(makeLine("Overdose:", "#ff3b3b", 0));

            if (info.overdose.bars && info.overdose.bars.length) {
                wrap.appendChild(makeLine("Bars", "#ff3b3b", 15));
                info.overdose.bars.forEach(b => wrap.appendChild(makeLine(b, "#ff3b3b", 30)));
            }

            if (info.overdose.stats) wrap.appendChild(makeLine(`Stats : ${info.overdose.stats}`, "#ff3b3b", 15));
            if (info.overdose.hosp_time) wrap.appendChild(makeLine(`Hospital : ${info.overdose.hosp_time}`, "#ff3b3b", 15));
            if (info.overdose.extra) wrap.appendChild(makeLine(`Extra : ${info.overdose.extra}`, "#ff3b3b", 15));
        }

        parent.appendChild(wrap);
    }

    function injectDrugPopup() {
        const cache = getCache();
        if (!cache) return;
        buildNameIndex(cache);

        const candidates = document.querySelectorAll(".info-msg, [class*='description___']");
        candidates.forEach((candidate) => {
            const target = findStableDescriptionNode(candidate);
            if (!target) return;
            if (isLoading(target)) return;

            const { id, item } = findItemForPanel(target, cache);
            if (!item || item.type !== "Drug") return;

            const info = getDrugInfoForName(item.name);
            if (!info) return;

            const stamp = `tt-drug-popup-v264-${id || item.name}`;
            if (target.getAttribute("data-tt-drug-stamp") === stamp && target.querySelector(".tt-drug-details")) return;
            target.setAttribute("data-tt-drug-stamp", stamp);

            removeTornEffectBullet(target, item);
            showDrugDetailsLikeTornTools(target, info);
        });
    }

    // -------------------- STYLES --------------------
    const style = document.createElement("style");
    style.textContent = `
        .tt-v-align { position: absolute !important; top: 50% !important; transform: translateY(-50%) !important; pointer-events: none; }
    .tt-v-text { color: #888; font-size: 11px; white-space: nowrap; -webkit-font-smoothing: antialiased; }
    .tt-green { color: #75a832 !important; font-weight: bold !important; }

    .tt-inline-effect { margin-left:10px; font-weight:bold; font-size:11px; color:#75a832; }
    .tt-inline-effect.tt-book { color:#4dabf7; font-size:10px; }
    .tt-inline-effect.tt-sidefx { margin-left:6px; color:#ff3b3b; }
    .d .items-cont .title span {
         margin: auto;
        }

    @media screen and (max-width: 784px) {
        .tt-v-text { font-size:10px; }

        /* Force Drug Effects to a new line on mobile */
        .tt-inline-effect.tt-drug {
            /* display: block !important; */
            margin-left: 0 !important;
            font-size: 10px;
            margin-top: 2px;
        }

        li.tt-mobile-row .name-wrap {
            display: block !important; /* Changed from inline-block to prevent overlap */
            max-width: calc(100% - 150px) !important; /* Increased buffer for prices */
            white-space: normal !important;
            line-height: 1.2 !important;
        }

        .tt-inline-effect.tt-book {
        display: block !important;
        margin: 0 0 0 0 !important; /* remove big top margin */
        margin-top: -10px !important; /* tiny gap */ /* OR use top shift instead of margin if you prefer */ /* position: relative; top: -2px; */
        font-size: 10px; line-height: 1.2;
        color: #4dabf7 !important;
        white-space: normal !important;
        word-break: break-word;
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        }
        .d .items-cont .title span {
         margin: auto;
        }
    }
    `;
    document.head.appendChild(style);

    // -------------------- RUNTIME --------------------
    setInterval(() => {
        applyEnhancements();
        injectDrugPopup();
    }, 600);

    const observer = new MutationObserver(() => {
        applyEnhancements();
        injectDrugPopup();
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
})();