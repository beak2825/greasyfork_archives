// ==UserScript==
// @name        🍭 Smart Auto-Use Items
// @namespace   chk.pop.locale.autouse.smart
// @version     2.6
// @description 🍣 Smart scanning first, then auto-using only existing items (Added Consumables)
// @match       https://*.popmundo.com/World/Popmundo.aspx/Character/Items/*
// @match       https://*.popmundo.com/World/Popmundo.aspx/Character/ShoppingAssistant
// @match       https://*.popmundo.com/World/Popmundo.aspx/Locale/*
// @run-at      document-end
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/560875/%F0%9F%8D%AD%20Smart%20Auto-Use%20Items.user.js
// @updateURL https://update.greasyfork.org/scripts/560875/%F0%9F%8D%AD%20Smart%20Auto-Use%20Items.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- Configuration ---
    const PAGE_WIDTH = 120;
    const DELAY_BEFORE_CLICK = 300;
    const MAX_RETRIES = 3;
    const RETRY_KEY = "autouse-retry-count";

    // Keywords for Item Combo 0 (The "Chocolate" Style Loop)
    const CONSUMABLE_KEYWORDS = [
        "Heart Shaped Box of Chocolates",
        "Glowstick",
        "Melvin Cola",
        "Pregnancy Test",
        "Pop Cola"
    ];

    // Keywords for Item Combo 1
    const COMBO1_ITEMS = [
        { keyword: "snowglobe of kadath", emoji: "❄️", status: "Using Snowglobe", color: "#333366", btnTitle: "Use", step: "snow" },
        { keyword: "rubik", emoji: "🧩", status: "Using Rubik's Cube", color: "#9933cc", btnTitle: "Use", step: "rubik" },
        { keyword: "microphone", emoji: "🎤", status: "Using Microphone", color: "#0066cc", btnTitle: "Tune", step: "mic" },
        { keyword: "anti-stress ball", emoji: "🟠", status: "Using Anti-Stress Ball", color: "#cc6600", btnTitle: "Use", step: "ball" },
        { keyword: "skateboard", emoji: "🛹", status: "Using Skateboard", color: "#cc3399", btnTitle: "Use", step: "skate" },
        { keyword: "illuminati puzzle pyramid", emoji: "🔺", status: "Using Illuminati Puzzle Pyramid", color: "#c0d018", btnTitle: "Use", step: "pyramid" },
        { keyword: "cuddly grinch", emoji: "🦖", status: "Cuddling Grinch", color: "#32cd32", btnTitle: "Use", step: "grinch" },
        { keyword: "cuddly santa", emoji: "🎅", status: "Cuddling Santa", color: "#ff0000", btnTitle: "Use", step: "santa" },
        { keyword: "cuddly snowman", emoji: "⛄", status: "Cuddling Snowman", color: "#ffffff", btnTitle: "Use", step: "snowman" },
        { keyword: "drums", emoji: "🥁", status: "Tuning Drums", color: "#8b0000", btnTitle: "Tune", step: "drums" },
        { keyword: "electric guitar", emoji: "🎸", status: "Tuning Guitar", color: "#1a1a1a", btnTitle: "Tune", step: "guitar" }
    ];

    // Keywords for Item Combo 2
    const COMBO2_ITEMS = [
        { name: "Pom-Poms", keyword: "pom-poms", emoji: "🎀", color: "#ff8591" },
        { name: "Captain's Dancing Slippers", keyword: "captain's dancing slippers", emoji: "🩰", color: "#A491D3" },
        { name: "Joke", keyword: "joke", emoji: "🎭", color: "#33ccff" },
        { name: "Teenage Diary", keyword: "teenage diary", emoji: "📓", color: "#3C6997" },
        { name: "Tickle Me Elvis", keyword: "tickle me elvis", emoji: "🐣", color: "#ff9933" },
        { name: "Meal", keyword: "meal", emoji: "🍉", color: "#3aaf98" },
    ];

    const USED_KEY_COMBO2 = "autouse-used-items";
    const STEP_KEY_COMBO1 = "autouse-step";
    const CONSUMABLE_LOOP_KEY = "choco-loop"; // Keeping key name for session persistence compatibility

    // Shopping Assistant Mirror Picker
    const STORAGE_KEY_MIRROR = "pm_selected_item";
    const TRIGGER_KEY_MIRROR = "pm_trigger_loop";

    // ---------------- Item Scanner ----------------
    let ITEM_CACHE = {
        available: new Map(), // keyword -> {element, button, rowText}
        scanned: false
    };

    function scanAvailableItems() {
        ITEM_CACHE.available.clear();
        const rows = Array.from(document.querySelectorAll("tr"));

        rows.forEach(row => {
            const rowText = normalize(row.textContent);
            if (!rowText) return;

            const useBtn = row.querySelector('input[title="Use"], input[title="Tune"], input[id*="btnUse"]');
            if (!useBtn) return;

            ITEM_CACHE.available.set(rowText, { element: row, button: useBtn, rowText });
        });

        ITEM_CACHE.scanned = true;
        log(`📊 Scanned ${ITEM_CACHE.available.size} usable items`);
        return ITEM_CACHE.available;
    }

    function itemExistsInCache(keyword) {
        if (!ITEM_CACHE.scanned) {
            scanAvailableItems();
        }

        const normalizedKeyword = normalize(keyword);

        for (const [cachedText, data] of ITEM_CACHE.available.entries()) {
            if (normalize(cachedText).includes(normalizedKeyword) ||
                normalizedKeyword.includes(normalize(cachedText))) {
                return data;
            }
        }
        return null;
    }

    // Check if any item from a list of keywords exists
    function findFirstAvailableConsumable() {
        for (const kw of CONSUMABLE_KEYWORDS) {
            const data = itemExistsInCache(kw);
            if (data) return { keyword: kw, data: data };
        }
        return null;
    }

    // ---------------- Smart Execution Functions ----------------

    // 🍫 Consumables loop (Chocolates, Colas, etc.)
    function autoUseConsumables() {
        const found = findFirstAvailableConsumable();

        if (!found) {
            log("No consumables found in inventory, stopping.");
            updateStatusBox("❌ No items left", "#ff0000");
            sessionStorage.removeItem(CONSUMABLE_LOOP_KEY);
            sessionStorage.removeItem(RETRY_KEY);
            return;
        }

        sessionStorage.setItem(CONSUMABLE_LOOP_KEY, "true");

        delayedAction(
            () => {
                if (found.data.button) {
                    found.data.button.click();
                    log(`✅ Clicked item (Smart): ${found.keyword}`);
                    sessionStorage.removeItem(RETRY_KEY);
                    return true;
                }
                return false;
            },
            `Using ${found.keyword}`,
            "#cc3366",
            "🍣"
        );
    }

    // 🛹 Six-item sequence (Combo 1)
    function runCombo1() {
        const availableItems = [];
        for (let item of COMBO1_ITEMS) {
            const itemData = itemExistsInCache(item.keyword);
            if (itemData) {
                availableItems.push({...item, itemData});
            } else {
                log(`${item.keyword} not found in inventory, skipping.`);
            }
        }

        if (availableItems.length === 0) {
            updateStatusBox("❌ No Combo 1 items found", "#ff0000");
            sessionStorage.removeItem(STEP_KEY_COMBO1);
            sessionStorage.removeItem(RETRY_KEY);
            return;
        }

        log(`🎯 Combo 1: Found ${availableItems.length} of ${COMBO1_ITEMS.length} items`);

        const step = sessionStorage.getItem(STEP_KEY_COMBO1) || availableItems[0].step;
        let foundStep = false;

        for (let i = 0; i < availableItems.length; i++) {
            const item = availableItems[i];

            if (foundStep || step === item.step) {
                foundStep = true;

                const nextItem = availableItems[i + 1];
                const nextStepValue = nextItem ? nextItem.step : "done";
                sessionStorage.setItem(STEP_KEY_COMBO1, nextStepValue);

                delayedAction(
                    () => {
                        if (item.itemData.button) {
                            item.itemData.button.click();
                            log(`✅ Clicked item (Smart): ${item.keyword}`);
                            sessionStorage.removeItem(RETRY_KEY);
                            return true;
                        }
                        return false;
                    },
                    item.status,
                    item.color,
                    item.emoji
                );
                return;
            }
        }

        updateStatusBox("✅ Combo 1 DONE", "#009933");
        log("Combo 1 DONE");
        sessionStorage.removeItem(STEP_KEY_COMBO1);
        sessionStorage.removeItem(RETRY_KEY);
    }

    // 🍭 Six-item sequence (Combo 2)
    function runCombo2() {
        const availableItems = [];
        for (let item of COMBO2_ITEMS) {
            const keyword = item.keyword || item.name;
            const itemData = itemExistsInCache(keyword);
            if (itemData) {
                availableItems.push({...item, itemData});
            } else {
                log(`${item.name} not found in inventory, skipping.`);
            }
        }

        if (availableItems.length === 0) {
            updateStatusBox("❌ No Combo 2 items found", "#ff0000");
            sessionStorage.removeItem(USED_KEY_COMBO2);
            sessionStorage.removeItem(RETRY_KEY);
            return;
        }

        log(`🎯 Combo 2: Found ${availableItems.length} of ${COMBO2_ITEMS.length} items`);

        let usedItems = JSON.parse(sessionStorage.getItem(USED_KEY_COMBO2) || "[]");

        for (let item of availableItems) {
            if (usedItems.includes(item.name)) continue;

            usedItems.push(item.name);
            sessionStorage.setItem(USED_KEY_COMBO2, JSON.stringify(usedItems));

            delayedAction(
                () => {
                    if (item.itemData.button) {
                        item.itemData.button.click();
                        log(`✅ Clicked item (Smart): ${item.name}`);
                        sessionStorage.removeItem(RETRY_KEY);
                        return true;
                    }
                    return false;
                },
                `Using ${item.name}`,
                item.color,
                item.emoji
            );
            return;
        }

        updateStatusBox("✅ Combo 2 DONE", "#009933");
        log("Combo 2 DONE");
        sessionStorage.removeItem(USED_KEY_COMBO2);
        sessionStorage.removeItem(RETRY_KEY);
    }

    // ---------------- Shared helpers ----------------
    function log(msg) { console.log(`[SmartAutoUse] ${msg}`); }

    function updateStatusBox(status, color) {
        let box = document.getElementById("autouse-status");
        if (!box) {
            box = document.createElement("div");
            box.id = "autouse-status";
            box.style.cssText = `
                position: fixed; top: 50px; right: 10px;
                padding: 10px 14px;
                background: ${color || '#333'};
                color: white; font-weight: bold; border-radius: 6px;
                box-shadow: 0 0 10px rgba(0,0,0,0.3);
                z-index: 9999; font-size: 14px; text-align: center;
                will-change: transform, opacity;
                opacity: 0; transition: opacity 0.2s ease-in;
            `;
            document.body.appendChild(box);
            requestAnimationFrame(() => { box.style.opacity = 1; });
        }
        box.style.background = color || '#333';
        box.innerHTML = status;
    }

    function normalize(text) {
        if (!text) return "";
        return text.replace(/['']/g, "'").toLowerCase().trim().replace(/\s+/g, ' ');
    }

    function checkRetryLimit() {
        const retries = parseInt(sessionStorage.getItem(RETRY_KEY) || "0");
        if (retries >= MAX_RETRIES) {
            log("⚠️ Max retries reached, stopping to prevent logout");
            updateStatusBox("⚠️ Stopped (too many retries)", "#ff6600");
            sessionStorage.removeItem(RETRY_KEY);
            sessionStorage.removeItem(CONSUMABLE_LOOP_KEY);
            sessionStorage.removeItem(STEP_KEY_COMBO1);
            sessionStorage.removeItem(USED_KEY_COMBO2);
            return false;
        }
        sessionStorage.setItem(RETRY_KEY, (retries + 1).toString());
        return true;
    }

    function delayedAction(actionFn, itemName, color, emoji) {
        if (!checkRetryLimit()) return;

        let countdown = Math.floor(DELAY_BEFORE_CLICK / 1000);
        updateStatusBox(`${emoji} ${itemName}...`, color);

        const countdownInterval = setInterval(() => {
            countdown--;
            if (countdown > 0) {
                updateStatusBox(`${emoji} ${itemName}...`, color);
            }
        }, 1000);

        setTimeout(() => {
            clearInterval(countdownInterval);
            updateStatusBox(`${emoji} ${itemName}...`, color);

            const success = actionFn();

            if (success) {
                log(`🔄 Action completed, reloading page...`);
                setTimeout(() => { window.location.href = window.location.href; }, 500);
            } else {
                log(`❌ Action failed for ${itemName}`);
                updateStatusBox(`❌ ${itemName} failed`, "#ff0000");
            }
        }, DELAY_BEFORE_CLICK);
    }

    // ---------------- Carousel UI ----------------
    const CAROUSEL_ID = "autouse-carousel";
    const CONTAINER_ID = "autouse-carousel-container";
    const PAGE_CONTAINER_ID = "autouse-page-container";
    let currentPage = 1;
    let totalPages = 2;

    function setupCarouselUI() {
        scanAvailableItems();

        // Check if ANY consumable in our list exists
        const hasConsumables = !!findFirstAvailableConsumable();

        const page1Buttons = [
            // Consumable button shows if any item in the list exists
            ...(hasConsumables ? [{ text: "🍣", title: "Auto-use Consumables (Chocolate, Cola, etc.)", action: autoUseConsumables, color: "#cc3366" }] : []),
            { text: "🛹", title: "Auto-use Combo 1 (Snowglobe, Skateboard, etc.)", action: runCombo1, color: "#339966" }
        ];

        const page2Buttons = [
            { text: "🍭", title: "Auto-use Combo 2 (Pom-Poms, Meal, etc.)", action: runCombo2, color: "#d94672" }
        ];

        totalPages = 2;

        const wrapper = document.createElement("div");
        wrapper.id = CAROUSEL_ID;
        wrapper.style.cssText = `
            position: fixed; bottom: 20px; right: 20px;
            display: flex; align-items: center;
            z-index: 9999;
        `;
        document.body.appendChild(wrapper);

        const createNavButton = (symbol, handler) => {
            const btn = document.createElement("button");
            btn.textContent = symbol;
            btn.onclick = handler;
            btn.style.cssText = `
                width: 20px; height: 40px;
                background: rgba(0,0,0,0.05);
                border: none;
                color: #7c8f99;
                border-radius: 4px;
                cursor: pointer;
                font-size: 16px;
                font-weight: bold;
                transition: background 0.2s;
            `;
            btn.onmouseover = () => btn.style.background = 'rgba(0,0,0,0.1)';
            btn.onmouseleave = () => btn.style.background = 'rgba(0,0,0,0.05)';
            return btn;
        };

        const prevBtn = createNavButton('<', () => navigateCarousel(-1));
        const nextBtn = createNavButton('>', () => navigateCarousel(1));

        prevBtn.style.marginRight = '2px';
        nextBtn.style.marginLeft = '2px';
        prevBtn.disabled = true;

        const container = document.createElement("div");
        container.id = CONTAINER_ID;
        container.style.cssText = `
            width: ${PAGE_WIDTH}px;
            height: 54px;
            overflow: hidden;
            border-radius: 6px;
            position: relative;
        `;

        const pageContainer = document.createElement("div");
        pageContainer.id = PAGE_CONTAINER_ID;
        pageContainer.style.cssText = `
            display: flex; width: ${totalPages * PAGE_WIDTH}px;
            height: 100%; position: absolute; left: 0;
            transition: transform 0.3s ease-in-out;
        `;
        container.appendChild(pageContainer);

        const page1Div = document.createElement("div");
        page1Div.className = "autouse-carousel-page";
        page1Div.style.cssText = `
            width: ${PAGE_WIDTH}px; height: 100%; flex-shrink: 0;
            display: flex; justify-content: space-around; align-items: center;
        `;

        if (page1Buttons.length === 1) {
            page1Div.style.justifyContent = "center";
        }

        page1Buttons.forEach(btnConfig => {
            const btn = createActionButton(btnConfig);
            page1Div.appendChild(btn);
        });
        pageContainer.appendChild(page1Div);

        const page2Div = document.createElement("div");
        page2Div.className = "autouse-carousel-page";
        page2Div.style.cssText = `
            width: ${PAGE_WIDTH}px; height: 100%; flex-shrink: 0;
            display: flex; justify-content: space-around; align-items: center;
        `;

        page2Div.style.justifyContent = "center";

        page2Buttons.forEach(btnConfig => {
            const btn = createActionButton(btnConfig);
            page2Div.appendChild(btn);
        });
        pageContainer.appendChild(page2Div);

        wrapper.appendChild(prevBtn);
        wrapper.appendChild(container);
        wrapper.appendChild(nextBtn);

        updateCarousel();
    }

    function createActionButton(config) {
        const size = 50;
        const fontSize = 28;

        const btn = document.createElement("div");
        btn.textContent = config.text;
        btn.title = config.title;

        btn.style.cssText = `
            width: ${size}px; height: ${size}px;
            background: #fff;
            border: 2px solid ${config.color || '#6a0dad'};
            border-radius: 50%;
            font-size: ${fontSize}px; text-align: center; line-height: ${size}px;
            cursor: pointer;
            z-index: 10;
            box-shadow: 0 0 10px rgba(0,0,0,0.2);
            transition: transform 0.1s, box-shadow 0.2s;
        `;

        btn.onmousedown = () => {
            btn.style.transform = 'scale(0.9)';
            btn.style.boxShadow = '0 0 5px rgba(0,0,0,0.3)';
        };
        btn.onmouseup = () => {
            btn.style.transform = 'scale(1)';
            btn.style.boxShadow = '0 0 10px rgba(0,0,0,0.2)';
        };
        btn.onclick = () => {
            log(`Button clicked: ${config.title}`);
            config.action();
        };

        btn.onmouseenter = () => { btn.style.transform = 'scale(1.05)'; };
        btn.onmouseleave = () => { btn.style.transform = 'scale(1)'; };

        return btn;
    }

    function navigateCarousel(direction) {
        const newPage = currentPage + direction;
        if (newPage >= 1 && newPage <= totalPages) {
            currentPage = newPage;
            updateCarousel();
        }
    }

    function updateCarousel() {
        const pageContainer = document.getElementById(PAGE_CONTAINER_ID);
        const prevBtn = document.querySelector(`#${CAROUSEL_ID} button:first-child`);
        const nextBtn = document.querySelector(`#${CAROUSEL_ID} button:last-child`);

        if (pageContainer) {
            const offset = (currentPage - 1) * -PAGE_WIDTH;
            pageContainer.style.transform = `translateX(${offset}px)`;
        }

        if (prevBtn) prevBtn.disabled = (currentPage === 1);
        if (nextBtn) nextBtn.disabled = (currentPage === totalPages);
    }

    // ---------------- Shopping Assistant Logic ----------------
    function setupStrawberryButton() {
        const strawberryBtn = document.createElement("div");
        strawberryBtn.textContent = "🍓";
        strawberryBtn.title = "Run Mirror Picker: Capture selection and go shopping";
        strawberryBtn.style.cssText = `
            position: fixed; bottom: 20px; right: 20px;
            width: 50px; height: 50px; background: #fff0f6;
            border: 2px solid #ff6699; border-radius: 50%;
            font-size: 26px; text-align: center; line-height: 50px;
            cursor: pointer; z-index: 9999;
            box-shadow: 0 0 10px rgba(255,100,150,0.5);
            transition: transform 0.1s;
        `;
        strawberryBtn.onmousedown = () => strawberryBtn.style.transform = 'scale(0.95)';
        strawberryBtn.onmouseup = () => strawberryBtn.style.transform = 'scale(1)';

        strawberryBtn.onclick = () => {
            log("▶️ Mirror loop triggered manually");
            localStorage.setItem(TRIGGER_KEY_MIRROR, "true");
            runMirrorLoop();
        };
        document.body.appendChild(strawberryBtn);
    }

    const waitFor = (selector, pred, interval = 300) => new Promise(resolve => {
        const tick = () => {
            const el = document.querySelector(selector);
            if (el && (!pred || pred(el))) resolve(el);
            else setTimeout(tick, interval);
        };
        tick();
    });

    const captureSelection = async () => {
        const cat = await waitFor("#ctl00_cphLeftColumn_ctl00_ddlShopItemCategories", el => el.value !== "0");
        const type = await waitFor("#ctl00_cphLeftColumn_ctl00_ddlShopItemTypes", el => el.value !== "0");
        const selected = {
            catValue: cat.value,
            typeValue: type.value,
            catText: cat.options[cat.selectedIndex].text,
            typeText: type.options[type.selectedIndex].text
        };
        localStorage.setItem(STORAGE_KEY_MIRROR, JSON.stringify(selected));
        log(`Captured selection: ${selected.catText} / ${selected.typeText}`);

        const localeLink = document.querySelector('a[id^="ctl00_cphLeftColumn_ctl00_repShopItemTypes_"]');
        if (localeLink) {
            const localeId = localeLink.href.match(/Locale\/(\d+)/)?.[1];
            if (localeId) {
                updateStatusBox("🍓 Moving to locale...", "#ff6699");
                setTimeout(() => {
                    window.location.href = `/World/Popmundo.aspx/Locale/MoveToLocale/${localeId}`;
                }, 2000);
                return;
            }
        }
        localStorage.removeItem(TRIGGER_KEY_MIRROR);
    };

    const goShopping = async () => {
        const link = await waitFor('a[href*="GoShopping"]');
        updateStatusBox("🍓 Entering shop...", "#ff6699");
        setTimeout(() => {
            window.location.href = link.href;
        }, 2000);
    };

    const reselectAndStop = async () => {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY_MIRROR));
        if (!saved) return;

        updateStatusBox("🍓 Applying selection...", "#ff6699");
        const cat = await waitFor("#ctl00_cphLeftColumn_ctl00_ddlItemCategories", el => el.options.length > 1);
        if (cat.value !== saved.catValue) {
            cat.value = saved.catValue;
            cat.dispatchEvent(new Event("change", { bubbles: true }));
        }

        const type = await waitFor("#ctl00_cphLeftColumn_ctl00_ddlItemTypes", el => !el.disabled && el.options.length > 1);
        if (type.value !== saved.typeValue) {
            if ([...type.options].some(o => o.value === saved.typeValue)) {
                type.value = saved.typeValue;
                type.dispatchEvent(new Event("change", { bubbles: true }));
                log("✅ Reselected:", saved.catText, "/", saved.typeText);
            }
        }

        localStorage.removeItem(TRIGGER_KEY_MIRROR);
        updateStatusBox("✅ Mirror Picker Done", "#009933");
    };

    const runMirrorLoop = () => {
        const url = window.location.href;
        if (url.includes("/ShoppingAssistant")) captureSelection();
        else if (url.includes("/MoveToLocale") || (url.includes("/Locale/") && !url.includes("/GoShopping"))) goShopping();
        else if (url.includes("/GoShopping")) reselectAndStop();
    };

    // ---------------- Initialization ----------------
    const href = window.location.href;

    if (href.includes("/Character/Items/")) {
        setupCarouselUI();

        if (sessionStorage.getItem(CONSUMABLE_LOOP_KEY)) {
            autoUseConsumables();
        } else if (sessionStorage.getItem(STEP_KEY_COMBO1)) {
            runCombo1();
        } else if (JSON.parse(sessionStorage.getItem(USED_KEY_COMBO2) || "[]").length > 0) {
            runCombo2();
        }
    }

    if (href.includes("/ShoppingAssistant")) {
        setupStrawberryButton();
    }

    if (localStorage.getItem(TRIGGER_KEY_MIRROR)) {
        runMirrorLoop();
    }

    if (location.href.includes("CharacterSelect")) {
        sessionStorage.removeItem(CONSUMABLE_LOOP_KEY);
        sessionStorage.removeItem(STEP_KEY_COMBO1);
        sessionStorage.removeItem(USED_KEY_COMBO2);
        sessionStorage.removeItem(RETRY_KEY);
        localStorage.removeItem(TRIGGER_KEY_MIRROR);
        console.log("🛑 AutoUse stopped after logout redirect.");
    }
})();