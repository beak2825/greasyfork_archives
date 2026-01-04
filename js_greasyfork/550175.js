// ==UserScript==
// @name         🧠 Memory Deck Helper
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Reveals and remembers card faces, paints them on their backs permanently.
// @author       GPT-5
// @match        https://eclesiar.com/dashboard
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550175/%F0%9F%A7%A0%20Memory%20Deck%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/550175/%F0%9F%A7%A0%20Memory%20Deck%20Helper.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const DEBUG = false; // set to true to enable console logs

    // === 1. STORAGE FUNCTIONS ===
    let cardMemory = {};

    function loadMemory() {
        if (DEBUG) console.log("[DEBUG][loadMemory] Loading memory from storage...");
        cardMemory = GM_getValue("memoryDeck", {});
        if (DEBUG) console.log("[DEBUG][loadMemory] Loaded memory:", cardMemory);
    }

    function saveMemory() {
        if (DEBUG) console.log("[DEBUG][saveMemory] Saving memory...");
        GM_setValue("memoryDeck", cardMemory);
    }

    // === 2. CARD DATA HANDLING ===
    function paintCardBack(index, imgUrl, qtyText) {
        console.log(`[DEBUG][paintCardBack] Painting card back for index=${index}`);
        const cardBack = document.querySelector(`.memory-card[data-index="${index}"] .card-back`);
        if (!cardBack) {
            console.warn(`[DEBUG][paintCardBack] Card back not found for index ${index}`);
            return;
        }

        if (cardBack.dataset.processedImg === imgUrl && cardBack.dataset.processedQty === qtyText) {
            console.log(`[DEBUG][paintCardBack] Skipping (already painted) for index ${index}`);
            return;
        }

        cardBack.dataset.processedImg = imgUrl || "";
        cardBack.dataset.processedQty = qtyText || "";

        if (imgUrl) {
            cardBack.style.backgroundImage = `url("${imgUrl}")`;
            cardBack.style.backgroundSize = "contain";
            cardBack.style.backgroundRepeat = "no-repeat";
            cardBack.style.backgroundPosition = "center";
            cardBack.style.backgroundColor = "#cd983d";
            console.log(`[DEBUG][paintCardBack] Applied image and background to card ${index}`);
        }

        if (getComputedStyle(cardBack).position === "static") {
            cardBack.style.position = "relative";
            console.log(`[DEBUG][paintCardBack] Set position: relative for card ${index}`);
        }

        let overlay = cardBack.querySelector(".memory-qty-overlay");
        if (!overlay) {
            overlay = document.createElement("div");
            overlay.className = "memory-qty-overlay";
            overlay.style.position = "absolute";
            overlay.style.bottom = "5px";
            overlay.style.left = "0";
            overlay.style.width = "100%";
            overlay.style.textAlign = "center";
            overlay.style.fontSize = "14px";
            overlay.style.fontWeight = "bold";
            overlay.style.color = "white";
            overlay.style.textShadow = "0 0 3px black";
            cardBack.appendChild(overlay);
            console.log(`[DEBUG][paintCardBack] Created new overlay for card ${index}`);
        }
        overlay.textContent = qtyText || "";
    }

    function recordCard(cardEl) {
        if (!cardEl) return;
        const index = cardEl.dataset.index;
        if (DEBUG) console.log(`[DEBUG][recordCard] Recording card index=${index}`);
        if (!index) return;

        const imgEl = cardEl.querySelector("img");
        const qtyEl = cardEl.querySelector(".memory-qty");
        const imgUrl = imgEl ? imgEl.getAttribute("src") : null;
        const qtyText = qtyEl ? qtyEl.textContent.trim() : "";

        if (DEBUG) console.log(`[DEBUG][recordCard] Extracted imgUrl=${imgUrl}, qtyText=${qtyText}`);

        if (!imgUrl) {
            if (DEBUG) console.log(`[DEBUG][recordCard] No imgUrl found for card ${index}, skipping`);
            return;
        }

        if (!cardMemory[index] ||
            cardMemory[index].imgUrl !== imgUrl ||
            cardMemory[index].qtyText !== qtyText) {
            cardMemory[index] = { imgUrl, qtyText };
            if (DEBUG) console.log(`[DEBUG][recordCard] Stored card ${index}:`, cardMemory[index]);
            saveMemory();
        } else {
            if (DEBUG) console.log(`[DEBUG][recordCard] Card ${index} already recorded, skipping update`);
        }

        paintCardBack(index, imgUrl, qtyText);
    }

    function repaintAllCards() {
        console.log("[DEBUG][repaintAllCards] Repainting all stored cards...");
        for (const index in cardMemory) {
            const { imgUrl, qtyText } = cardMemory[index];
            paintCardBack(index, imgUrl, qtyText);
        }
    }

    // === 3. DETECTION FUNCTIONS ===
    function scanFlippedCards() {
        if (DEBUG) console.log("[DEBUG][scanFlippedCards] Scanning for flipped cards...");
        const flippedCards = document.querySelectorAll(".memory-card.is-flipped");
        if (DEBUG) console.log(`[DEBUG][scanFlippedCards] Found ${flippedCards.length} flipped cards`);

        flippedCards.forEach(cardEl => {
            if (DEBUG) console.log("[DEBUG][scanFlippedCards] Card HTML:", cardEl.outerHTML);
            recordCard(cardEl);
        });
    }

    function observeGrid(grid) {
        console.log("[DEBUG][observeGrid] Starting MutationObserver...");
        const observer = new MutationObserver(() => {
            console.log("[DEBUG][observeGrid] Mutation detected, rescanning...");
            scanFlippedCards();
        });
        observer.observe(grid, { childList: true, subtree: true, attributes: true });
    }

    // === 4. INITIALIZATION ===
    function init() {
        console.log("[DEBUG][init] Script started");
        const grid = document.querySelector("#memoryGridDesktop");
        if (!grid) {
            console.warn("[DEBUG][init] Memory grid not found, aborting");
            return;
        }

        loadMemory();
        repaintAllCards();
        scanFlippedCards();
        observeGrid(grid);

        console.log("[DEBUG][init] Initialization complete");
    }

    function clearMemory() {
        console.log("[DEBUG][clearMemory] Clearing saved memory...");
        cardMemory = {};
        GM_setValue("memoryDeck", cardMemory);

        // Also visually reset all card backs
        const allCards = document.querySelectorAll(".memory-card .card-back");
        allCards.forEach(cardBack => {
            cardBack.style.backgroundImage = "";
            cardBack.style.backgroundColor = "";
            const overlay = cardBack.querySelector(".memory-qty-overlay");
            if (overlay) overlay.remove();
            delete cardBack.dataset.processedImg;
            delete cardBack.dataset.processedQty;
        });

        console.log("[DEBUG][clearMemory] Memory cleared and card backs reset");
    }

    // === Add Clear Memory Button ===
    const header = document.querySelector(".memory-deck-header");
    if (header) {
        const btn = document.createElement("button");
        btn.textContent = "Clear Memory";
        btn.style.marginLeft = "10px";
        btn.style.padding = "5px 10px";
        btn.style.borderRadius = "6px";
        btn.style.border = "1px solid #ccc";
        btn.style.background = "#c33";
        btn.style.color = "white";
        btn.style.cursor = "pointer";
        btn.addEventListener("click", clearMemory);
        header.appendChild(btn);
        console.log("[DEBUG][init] Added Clear Memory button");
    }

    window.addEventListener("load", init);
})();





