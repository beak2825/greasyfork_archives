// ==UserScript==
// @name         Ebay regex filter for search results + Price sort (S-Card Layout)
// @namespace    ebay-regex-filter-scard
// @version      1.1
// @description  Regex results filter + price sorting for eBay S-Card layout
// @match        https://www.ebay.com/sch/*
// @grant        none
// @license MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/556724/Ebay%20regex%20filter%20for%20search%20results%20%2B%20Price%20sort%20%28S-Card%20Layout%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556724/Ebay%20regex%20filter%20for%20search%20results%20%2B%20Price%20sort%20%28S-Card%20Layout%29.meta.js
// ==/UserScript==

(function () {
'use strict';

const ROW_ID = "ebay-regex-row-scard";
const LS_KEY = "ebay_regex_filter_scard";
let activeRegex = null;
let savedPattern = localStorage.getItem(LS_KEY) || "";
let sortState = 0;
let originalOrder = [];

let dynamicStyle = document.createElement("style");
document.head.appendChild(dynamicStyle);

function getListings() {
    return [...document.querySelectorAll("li.s-card")];
}

function getVisibleListings() {
    return getListings().filter(el => !el.closest(".s-clipped[aria-hidden='true']"));
}

function getContainer() {
    const vis = getVisibleListings();
    if (!vis.length) return null;
    return vis[0].parentElement;
}

function extractPrice(item) {
    const priceEl = item.querySelector(".s-card__price");
    if (!priceEl) return Infinity;
    const raw = priceEl.innerText.trim();
    const m = raw.match(/([\$£€]?\s*\d[\d,\.]*)/);
    if (!m) return Infinity;
    const cleaned = m[1].replace(/[^0-9.]/g, '');
    const num = parseFloat(cleaned);
    return isNaN(num) ? Infinity : num;
}

function getSearchableText(item) {
    const t = item.querySelector(".s-card__title");
    const s = item.querySelector(".s-card__subtitle");
    return ((t ? t.innerText : "") + "\n" + (s ? s.innerText : "")).toLowerCase();
}

function rebuildStyleFilter() {
    if (!activeRegex) {
        dynamicStyle.textContent = "";
        return;
    }

    const items = getListings();
    let css = "";

    items.forEach((item, i) => {
        item.setAttribute("data-regex-uid", i);
        const txt = getSearchableText(item);

        if (!activeRegex.test(txt)) {
            css += `li.s-card[data-regex-uid="${i}"]{display:none!important;}`;
        }
    });

    dynamicStyle.textContent = css;
}

function sortListings() {
    const container = getContainer();
    if (!container) return;

    const items = getVisibleListings();
    if (!items.length) return;

    if (sortState === 0) originalOrder = [...items];

    sortState = sortState === 0 ? 1 : sortState === 1 ? 2 : 0;

    let out;
    if (sortState === 0) {
        out = originalOrder;
    } else {
        out = [...items].sort((a, b) => {
            const pa = extractPrice(a);
            const pb = extractPrice(b);
            return sortState === 1 ? pa - pb : pb - pa;
        });
    }

    out.forEach(el => container.appendChild(el));
    rebuildStyleFilter();
}

function buildUI() {
    const row = document.createElement("div");
    row.id = ROW_ID;

    row.style.margin = "12px 0";
    row.style.padding = "8px 0";
    row.style.display = "flex";
    row.style.alignItems = "center";
    row.style.gap = "12px";

    const label = document.createElement("span");
    label.textContent = "Regex Filter:";
    label.style.fontSize = "16px";
    label.style.fontWeight = "600";

    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "sony|jbl|adam|whatever";
    input.value = savedPattern;

    input.style.flex = "1";
    input.style.height = "32px";
    input.style.padding = "4px 6px";
    input.style.border = "1px solid #bbb";
    input.style.borderRadius = "6px";
    input.style.fontSize = "14px";

    if (savedPattern.trim()) {
        try {
            activeRegex = new RegExp(savedPattern, "i");
            input.style.borderColor = "#0a0";
        } catch {
            activeRegex = null;
            input.style.borderColor = "#c00";
        }
    }

    input.addEventListener("input", () => {
        const v = input.value.trim();
        localStorage.setItem(LS_KEY, v);

        if (!v) {
            activeRegex = null;
            input.style.borderColor = "#bbb";
            rebuildStyleFilter();
            return;
        }

        try {
            activeRegex = new RegExp(v, "i");
            input.style.borderColor = "#0a0";
        } catch {
            activeRegex = null;
            input.style.borderColor = "#c00";
        }

        rebuildStyleFilter();
    });

    const b = document.createElement("button");
    b.textContent = "Sort Price";
    b.style.padding = "6px 10px";
    b.style.border = "1px solid #bbb";
    b.style.borderRadius = "6px";
    b.style.cursor = "pointer";

    b.onclick = () => sortListings();

    row.appendChild(label);
    row.appendChild(input);
    row.appendChild(b);

    return row;
}

function insertRow() {
    if (document.getElementById(ROW_ID)) return;

    const t =
        document.querySelector("#srp-river-main") ||
        document.querySelector("#mainContent") ||
        document.querySelector("#content") ||
        document.body;

    const r = buildUI();
    t.insertBefore(r, t.firstChild);
}

insertRow();
rebuildStyleFilter();

})();
