// ==UserScript==
// @name         Torn Mission Mod Price Evaluator
// @namespace    https://www.torn.com/
// @version      1.4
// @description  Shows whether weapon mod mission credit costs are good, medium, or bad based on standard or special-offer price ranges
// @author       Rick-Grimes
// @match        https://www.torn.com/loader.php?sid=missions
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/562804/Torn%20Mission%20Mod%20Price%20Evaluator.user.js
// @updateURL https://update.greasyfork.org/scripts/562804/Torn%20Mission%20Mod%20Price%20Evaluator.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Standard price ranges
    const MOD_RANGES = {
        // Sights
        "reflex-sight":        { min: 599, max: 1049 },
        "holographic-sight":   { min: 1450, max: 2098 },
        "acog-sight":          { min: 2947, max: 4197 },
        "thermal-sight":       { min: 5926, max: 8399 },
        // Lasers
        "1mw-laser":           { min: 441, max: 749 },
        "5mw-laser":           { min: 1033, max: 1498 },
        "30mw-laser":          { min: 2120, max: 2999 },
        "100mw-laser":         { min: 4207, max: 6000 },
        // Suppressors
        "small-suppressor":    { min: 493, max: 899 },
        "standard-suppressor": { min: 1288, max: 1799 },
        "large-suppressor":    { min: 5042, max: 7197 },
        // Magazines
        "extended-mags":       { min: 474, max: 673 },
        "high-capacity-mags":  { min: 244, max: 472 },
        // Extra Magazines
        "extra-clip-x1":       { min: 316, max: 644 },
        "extra-clip-x2":       { min: 631, max: 899 },
        // Triggers
        "adjustable-trigger":  { min: 449, max: 675 },
        "hair-trigger":        { min: 1914, max: 2700 },
        // Mounts
        "bipod":               { min: 369, max: 522 },
        "tripod":              { min: 1493, max: 2099 },
        // Grips
        "custom-grip":         { min: 263, max: 374 },
        // Chokes
        "skeet-choke":         { min: 579, max: 824 },
        "improved-choke":      { min: 1169, max: 1649 },
        "full-choke":          { min: 2323, max: 3291 },
        // Pads
        "recoil-pad":          { min: 526, max: 748 },
        // Muzzles
        "standard-brake":      { min: 418, max: 599 },
        "heavy-duty-brake":    { min: 840, max: 1199 },
        "tactical-brake":      { min: 1719, max: 2389 },
        // Lights
        "small-light":         { min: 407, max: 598 },
        "precision-light":     { min: 841, max: 1200 },
        "tactical-illuminator":{ min: 3383, max: 4799 },
    };

    // Special offer price ranges
    const SPECIAL_RANGES = { ...MOD_RANGES };
    SPECIAL_RANGES["reflex-sight"] = { min: 402, max: 734 };
    SPECIAL_RANGES["holographic-sight"] = { min: 708, max: 1468 };
    SPECIAL_RANGES["acog-sight"] = { min: 1597, max: 2921 };
    SPECIAL_RANGES["thermal-sight"] = { min: 2146, max: 5872 };
    SPECIAL_RANGES["1mw-laser"] = { min: 239, max: 520 };
    SPECIAL_RANGES["5mw-laser"] = { min: 645, max: 1029 };
    SPECIAL_RANGES["30mw-laser"] = { min: 1075, max: 2095 };
    SPECIAL_RANGES["100mw-laser"] = { min: 2284, max: 4200 };
    SPECIAL_RANGES["small-suppressor"] = { min: 265, max: 630 };
    SPECIAL_RANGES["standard-suppressor"] = { min: 622, max: 1258 };
    SPECIAL_RANGES["large-suppressor"] = { min: 2848, max: 5029 };
    SPECIAL_RANGES["extended-mags"] = { min: 244, max: 472 };
    SPECIAL_RANGES["high-capacity-mags"] = { min: 1068, max: 1885 };
    SPECIAL_RANGES["extra-clip-x1"] = { min: 104, max: 312 };
    SPECIAL_RANGES["extra-clip-x2"] = { min: 422, max: 629 };
    SPECIAL_RANGES["adjustable-trigger"] = { min: 250, max: 471 };
    SPECIAL_RANGES["hair-trigger"] = { min: 991, max: 1880 };
    SPECIAL_RANGES["bipod"] = { min: 202, max: 364 };
    SPECIAL_RANGES["tripod"] = { min: 721, max: 1452 };
    SPECIAL_RANGES["custom-grip"] = { min: 101, max: 261 };
    SPECIAL_RANGES["skeet-choke"] = { min: 241, max: 576 };
    SPECIAL_RANGES["improved-choke"] = { min: 786, max: 1150 };
    SPECIAL_RANGES["full-choke"] = { min: 1294, max: 2264 };
    SPECIAL_RANGES["recoil-pad"] = { min: 220, max: 524 };
    SPECIAL_RANGES["standard-brake"] = { min: 213, max: 419 };
    SPECIAL_RANGES["heavy-duty-brake"] = { min: 252, max: 839 };
    SPECIAL_RANGES["tactical-brake"] = { min: 946, max: 1655 };
    SPECIAL_RANGES["small-light"] = { min: 184, max: 419 };
    SPECIAL_RANGES["precision-light"] = { min: 533, max: 837 };
    SPECIAL_RANGES["tactical-illuminator"] = { min: 2364, max: 3334 };

    function run() {
        document.querySelectorAll("li.mod-wrap[data-ammo-info]").forEach(processMod);
    }

    function processMod(li) {
        const data = getModData(li);
        if (!data) return;

        const range = getRange(li, data);
        if (!range) return;

        const percent = getPercent(data.points, range.min, range.max);
        const verdict = classifyRoll(percent);

        const label = isSpecialOffer(li, data)
            ? `SPECIAL (${verdict.label} ${Math.round(percent)}%)`
            : `${verdict.label} (${Math.round(percent)}%)`;

        injectVerdict(li, label, verdict.color, { points: data.points, range });
    }

    function getModData(li) {
        try {
            return JSON.parse(li.getAttribute("data-ammo-info"));
        } catch {
            return null;
        }
    }


    function isSpecialOffer(li, data) {
        if (data && typeof data.label === "string" && data.label.toLowerCase() === "special-offer") {
            return true;
        }

        if (li.querySelector(".award-discount-special-offer")) {
            return true;
        }

        const btn = li.querySelector("button[aria-label]");
        const aria = btn ? btn.getAttribute("aria-label") : "";
        if (aria && aria.toLowerCase().includes("special offer")) {
            return true;
        }

        return false;
    }

    function getRange(li, data) {
        const modKey = data.className;
        if (!modKey) return null;

        if (isSpecialOffer(li, data) && SPECIAL_RANGES[modKey]) return SPECIAL_RANGES[modKey];
        return MOD_RANGES[modKey] || null;
    }

    function getPercent(price, min, max) {
        const raw = ((price - min) / (max - min)) * 100;
        return Math.max(0, Math.min(100, raw));
    }

    function classifyRoll(percent) {
        if (percent <= 33) return { label: "GOOD", color: "#2ecc71" };
        if (percent <= 66) return { label: "MEDIUM", color: "#f1c40f" };
        return { label: "BAD", color: "#e74c3c" };
    }

    function injectVerdict(li, text, color, data) {
        if (li.querySelector(".mod-verdict")) return;

        li.style.position = "relative";

        const circle = document.createElement("div");
        circle.className = "mod-verdict";

        circle.title = `Cost: ${data.points} | Range: ${data.range.min}–${data.range.max} | ${text}`;

        circle.style.cssText = `
            position: absolute;
            top: 4px;
            right: 4px;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background-color: ${color};
            border: 1px solid #00000055;
            pointer-events: auto;
            z-index: 10;
        `;

        li.appendChild(circle);
    }

    setTimeout(run, 500);
})();
