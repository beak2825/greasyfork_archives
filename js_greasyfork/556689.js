// ==UserScript==
// @name         Ups - Armory report
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Search items that needs to be refilled in armory.
// @author       Upsilon [3212478]
// @match        https://www.torn.com/factions.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @connect      api.torn.com
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556689/Ups%20-%20Armory%20report.user.js
// @updateURL https://update.greasyfork.org/scripts/556689/Ups%20-%20Armory%20report.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const UPS_DEFAULT_STRUCTURE = {
        Temporary: ["Book" , "Brick" , "Claymore Mine" , "Concussion Grenade" , "Epinephrine" , "Fireworks" , "Flash Grenade" , "Glitter Bomb" , "Grenade" , "HEG" , "Melatonin" , "Molotov Cocktail" , "Nail Bomb" , "Nerve Gas" , "Ninja Stars" , "Party Popper" , "Pepper Spray" , "Serotonin" , "Smoke Grenade" , "Snowball" , "Stick Grenade" , "Tear Gas" , "Throwing Knife" , "Trout" , "Tyrosine" , "Wrench" ],
        Drugs: ["Cannabis", "Ecstasy", "Ketamine", "LSD", "Love Juice", "Opium", "PCP", "Shrooms", "Speed", "Vicodin", "Xanax"],
        Alcohol: ["Bottle of Beer", "Bottle of Champagne", "Bottle of Christmas Cocktail", "Bottle of Christmas Spirit", "Bottle of Green Stout", "Bottle of Kandy Kane", "Bottle of Minty Mayhem", "Bottle of Mistletoe Madness", "Bottle of Moonshine", "Bottle of Pumpkin Brew", "Bottle of Sake", "Bottle of Stinky Swamp Punch", "Bottle of Tequila", "Bottle of Wicked Witch", "Glass of Beer"],
        Candies: ["Bag of Bloody Eyeballs", "Bag of Bon Bons" , "Bag of Candy Kisses" , "Bag of Chocolate Kisses" , "Bag of Chocolate Truffles" , "Bag of Humbugs" , "Bag of Reindeer Droppings" , "Bag of Sherbet" , "Bag of Tootsie Rolls" , "Big Box of Chocolate Bars" , "Birthday Cupcake" , "Box of Bon Bons", "Box of Chocolate Bars" , "Box of Sweet Hearts" , "Chocolate Egg" , "Jawbreaker" , "Lollipop" , "Pixie Sticks" ],
        Medical: ["Antidote", "Blood Bag : A+", "Blood Bag : A-", "Blood Bag : AB+", "Blood Bag : AB-", "Blood Bag : B+", "Blood Bag : B-", "Blood Bag : Irradiated", "Blood Bag : O+", "Blood Bag : O-", "Empty Blood Bag", "First Aid Kit", "Ipecac Syrup", "Morphine", "Neumune Tablet", "Small First Aid Kit"],
        Booster: ["Can of Goose Juice", "Can of Damp Valley", "Can of Crocozade", "Can of Munster", "Can of Santa Shooters", "Can of Red Cow", "Can of Rockstar Rudolph", "Can of Taurine Elite", "Can of X-MASS", "Erotic DVD", "Feathery Hotel Coupon", "Lawyer's Business Card"],
        Utilities: [ "ID Badge" , "ATM Key", "Cut-Throat Razor", "Cigar Cutter", "Car Battery", "Thermite", "Remote Detonator", "Blood Bag : Irradiated", "Syringe", "Lockpicks" , "Police Badge" , "Gasoline" , "RF Detector" , "DSLR Camera" , "Construction Helmet" , "Binoculars" , "PCP" , "Hand Drill" , "Zip Ties" , "Spray Paint : Black" , "Wire Cutters" , "Bolt Cutters" , "Chloroform" , "Polymorphic Virus" , "Jemmy" , "Tunneling Virus" , "Wireless Dongle" , "Billfold" , "Dental Mirror" , "C4 Explosive" , "Flash Grenade" , "Firewalk Virus" , "Core Drill" , "Shaped Charge" , "Smoke Grenade" , "Stealth Virus"]
    };

    const DEFAULT_CATEGORY_CONFIG = {
        Drugs: true,
        Alcohol: true,
        Medical: true,
        Candies: true,
        Booster: true,
        Utilities: true,
        Temporary: true
    };

    const waitFor = (selector, timeout = 10000) =>
    new Promise(resolve => {
        const start = Date.now();
        const int = setInterval(() => {
            const el = document.querySelector(selector);
            if (el) {
                clearInterval(int);
                resolve(el);
            } else if (Date.now() - start > timeout) {
                clearInterval(int);
                resolve(null);
            }
        }, 100);
    });

    function gmFetch(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url,
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        resolve(data);
                    } catch (e) {
                        reject(e);
                    }
                },
                onerror: function(err) {
                    reject(err);
                }
            });
        });
    }

    function loadCategoryConfig() {
        return GM_getValue("ups_armory_report_category_config", DEFAULT_CATEGORY_CONFIG);
    }

    function saveCategoryConfig(cfg) {
        GM_setValue("ups_armory_report_category_config", cfg);
    }

    const DEFAULT_ITEM_VISIBILITY = (() => {
        const vis = {};
        for (const cat in UPS_DEFAULT_STRUCTURE) {
            vis[cat] = {};
            for (const item of UPS_DEFAULT_STRUCTURE[cat]) {
                vis[cat][item] = true;
            }
        }
        return vis;
    })();

    function loadItemVisibility() {
        const saved = GM_getValue("ups_armory_report_item_visibility", null);
        if (!saved) return DEFAULT_ITEM_VISIBILITY;

        let updated = false;

        for (const cat in UPS_DEFAULT_STRUCTURE) {
            if (!saved[cat]) { saved[cat] = {}; updated = true; }
            for (const item of UPS_DEFAULT_STRUCTURE[cat]) {
                if (saved[cat][item] === undefined) { saved[cat][item] = true; updated = true; }
            }
        }
        for (const cat in saved) {
            if (!UPS_DEFAULT_STRUCTURE[cat]) { delete saved[cat]; updated = true; continue; }
            for (const item in saved[cat]) {
                if (!UPS_DEFAULT_STRUCTURE[cat].includes(item)) { delete saved[cat][item]; updated = true; }
            }
        }

        if (updated) GM_setValue("ups_armory_report_item_visibility", saved);
        return saved;
    }

    function saveItemVisibility(vis) {
        GM_setValue("ups_armory_report_item_visibility", vis);
    }

    function closeAllPanels(container) {
        const defaults = container.querySelector(".ups-default-root");
        const report = container.querySelector(".ups-report-root");

        if (defaults) defaults.remove();
        if (report) report.remove();
    }

    function syncDefaults(saved, structure) {
        let updated = false;

        for (const cat in structure) {
            if (!saved[cat]) {
                saved[cat] = {};
                updated = true;
            }

            for (const item of structure[cat]) {
                if (saved[cat][item] === undefined) {
                    saved[cat][item] = 0;
                    updated = true;
                }
            }
        }

        for (const cat in saved) {
            if (!structure[cat]) {
                delete saved[cat];
                updated = true;
                continue;
            }

            for (const item in saved[cat]) {
                if (!structure[cat].includes(item)) {
                    delete saved[cat][item];
                    updated = true;
                }
            }
        }

        return updated;
    }

    function renderDefaultValuesUI(container) {
        let saved = GM_getValue("ups_armory_report_defaults", null);
        const vis = loadItemVisibility();

        if (!saved) {
            saved = {};
            for (const cat in UPS_DEFAULT_STRUCTURE) {
                saved[cat] = {};
                for (const item of UPS_DEFAULT_STRUCTURE[cat]) {
                    saved[cat][item] = 0;
                }
            }
            GM_setValue("ups_armory_report_defaults", saved);
        }

        if (syncDefaults(saved, UPS_DEFAULT_STRUCTURE)) {
            GM_setValue("ups_armory_report_defaults", saved);
        }


        container.innerHTML = `
        <div class="ups-default-wrapper"></div>
    `;

        const wrapper = container.querySelector(".ups-default-wrapper");

        const cfg = loadCategoryConfig();

        for (const category in UPS_DEFAULT_STRUCTURE) {
            if (!cfg[category]) continue;
            const section = document.createElement("div");
            section.className = "ups-default-section";

            section.innerHTML = `
            <div class="ups-default-header">
    <span>${category}</span>
    <span class="ups-default-arrow">▼</span>
</div>
<div class="ups-default-content"></div>
        `;

            const content = section.querySelector(".ups-default-content");
            const arrow = section.querySelector(".ups-default-arrow");

            let opened = false;

            section.querySelector(".ups-default-header").addEventListener("click", () => {
                opened = !opened;
                content.style.display = opened ? "block" : "none";
                arrow.style.transform = opened ? "rotate(180deg)" : "rotate(0deg)";
            });

            const itemsSorted = [...UPS_DEFAULT_STRUCTURE[category]].sort((a, b) => a.localeCompare(b));
            for (const item of itemsSorted) {
                if (vis?.[category]?.[item] === false) continue;
                const row = document.createElement("div");
                row.className = "ups-default-row";

                row.innerHTML = `
                <label>${item}</label>
                <input type="number" min="0" value="${saved[category][item]}" />
            `;

                row.querySelector("input").addEventListener("input", (e) => {
                    saved[category][item] = parseInt(e.target.value || "0", 10);
                    GM_setValue("ups_armory_report_defaults", saved);
                });

                content.appendChild(row);
            }

            wrapper.appendChild(section);
        }
    }

    async function generateArmoryReport(apiKey) {
        const cfg = loadCategoryConfig();
        const itemVisibility = loadItemVisibility();

        const endpointMap = {
            Medical: "medical",
            Drugs: "drugs",
            Booster: "boosters",
            Utilities: "utilities",
            Temporary: "temporary"
        };

        const activeEndpoints = Object.keys(endpointMap)
        .filter(cat => cfg[cat])
        .map(cat => endpointMap[cat]);

        const calls = await Promise.all(
            activeEndpoints.map(sel =>
                                gmFetch(`https://api.torn.com/faction/?key=${apiKey}&comment=ArmoryReport&selections=${sel}`)
                                .catch(() => null)
                               )
        );

        let itemsData = {};
        try {
            const itemsResp = await gmFetch(`https://api.torn.com/torn/?key=${apiKey}&comment=ArmoryReport&selections=items`);
            itemsData = itemsResp.items || {};
        } catch (e) {
            console.error("Error loading item data", e);
        }

        const defaults = GM_getValue("ups_armory_report_defaults", {});

        const armoryData = {};

        for (const cat in defaults) {
            for (const item in defaults[cat]) {
                armoryData[item] = 0;
            }
        }

        calls.forEach((data, index) => {
            const endpointName = activeEndpoints[index];
            const items = data?.[endpointName];

            if (!items) return;

            items.forEach(item => {
                if (armoryData[item.name] !== undefined) {
                    armoryData[item.name] = item.quantity;
                }
            });
        });

        const missing = {};

        for (const category in defaults) {
            if (!cfg[category]) continue;

            missing[category] = {};

            for (const item in defaults[category]) {
                const isVisible = itemVisibility?.[category]?.[item] !== false;
                if (!isVisible) continue;

                const target = defaults[category][item];
                const current = armoryData[item] || 0;

                if (current < target) {
                    missing[category][item] = target - current;
                }
            }
        }

        return { missing, itemsData };
    }

    function renderReportUI(root, data) {

        const { missing, itemsData } = data;

        let grandTotal = 0;

        let html = `
        <div class="ups-report-header">
            <div class="ups-report-title">Items to Refill</div>
            <button class="ups-copy-btn">Copy shopping list</button>
        </div>

        <div class="ups-report-list">
    `;

        let empty = true;

        for (const category in missing) {
            let catItems = missing[category];
            let countMissing = Object.values(catItems).reduce((a, b) => a + b, 0);

            if (countMissing === 0) continue;
            empty = false;

            html += `
            <div class="ups-report-category">
                <div class="ups-report-cat-title">${category}</div>
        `;

            for (const item of Object.keys(catItems).sort((a, b) => a.localeCompare(b))) {
                const qty = catItems[item];
                let marketValue = 0;
                let itemTotal = 0;

                for (const id in itemsData) {
                    if (itemsData[id].name === item) {
                        marketValue = itemsData[id].market_value || 0;
                        break;
                    }
                }

                itemTotal = marketValue * qty;
                grandTotal += itemTotal;
                let itemId = null;
                for (const id in itemsData) {
                    if (itemsData[id].name === item) {
                        itemId = id;
                        break;
                    }
                }

                const marketUrl = itemId
                ? `https://www.torn.com/page.php?sid=ItemMarket#/market/view=search&itemID=${itemId}`
                : null;

                html += `
<div class="ups-report-row">
    <span class="ups-item-name">${item}</span>
    <span>${qty}</span>
    <span class="ups-report-qty">$${itemTotal.toLocaleString()}</span>
    <span class="ups-report-action">
        ${marketUrl ? `<a href="${marketUrl}" target="_blank" class="ups-market-btn">Market</a>` : ""}
    </span>
</div>
`;
            }

            html += `</div>`;
        }

        if (empty) {
            html = `<div class="ups-report-empty">Armory is fully stocked ✔️</div>`;
        }

        if (!empty) {
            html += `
        <div class="ups-report-total">
            Grand Total Value: <strong>$${grandTotal.toLocaleString()}</strong>
        </div>
    `;
        }

        root.innerHTML = html;

        const copyBtn = root.querySelector(".ups-copy-btn");
        if (copyBtn) {
            copyBtn.addEventListener("click", () => {

                let text = "";
                for (const category in missing) {
                    for (const item in missing[category]) {
                        const qty = missing[category][item];
                        text += `${item}: ${qty}\n`;
                    }
                }

                if (!text.trim()) {
                    text = "Nothing missing ✔️";
                }
                text += `\nGrand Total: $${grandTotal.toLocaleString()}`;


                GM_setClipboard(text.trim(), { type: "text", mimetype: "text/plain" });
                copyBtn.textContent = "Copied ✔️";
                setTimeout(() => copyBtn.textContent = "Copy shopping list", 1000);
            });
        }
    }

    function renderArmoryContent(container) {
        const savedKey = GM_getValue("ups_armory_report_api", "");

        container.innerHTML = `
        <div class="ups-section">

            <label class="ups-label">API Key</label>
            <input type="text" id="ups-api-key" class="ups-input" placeholder="Enter API key" value="${savedKey}">

            <div class="ups-btn-row">
                <button id="ups-create-report" class="ups-btn primary">Create report</button>
                <button id="ups-setup-default" class="ups-btn secondary">Setup default values</button>
            </div>

        </div>
    `;

        const input = document.getElementById("ups-api-key");

        input.addEventListener("input", () => {
            GM_setValue("ups_armory_report_api", input.value);
            console.log("[Ups Armory] API key saved:", input.value);
        });

        document.getElementById("ups-create-report").addEventListener("click", async () => {
            const apiKey = input.value.trim();
            if (!apiKey) {
                alert("Please enter an API key.");
                return;
            }

            GM_setValue("ups_armory_report_api", apiKey);

            let reportBox = container.querySelector(".ups-report-root");
            if (reportBox) {
                reportBox.remove();
                return;
            }

            closeAllPanels(container);

            reportBox = document.createElement("div");
            reportBox.className = "ups-report-root";
            reportBox.style.marginTop = "20px";
            container.appendChild(reportBox);

            reportBox.innerHTML = "<div class='ups-loading'>Generating report...</div>";

            const result = await generateArmoryReport(apiKey);
            renderReportUI(reportBox, result);
        });


        document.getElementById("ups-setup-default").addEventListener("click", () => {
            let defaultsBox = container.querySelector(".ups-default-root");
            if (defaultsBox) {
                defaultsBox.remove();
                return;
            }

            closeAllPanels(container);
            defaultsBox = document.createElement("div");
            defaultsBox.className = "ups-default-root";
            defaultsBox.style.marginTop = "15px";
            container.appendChild(defaultsBox);

            renderDefaultValuesUI(defaultsBox);
        });
    }

    async function init() {
        if (document.querySelector('.ups-accordion')) {
            console.log("[Ups Armory] Accordion already exists — skip init()");
            return;
        }

        const firstDelimiter = await waitFor('.delimiter-999');
        if (!firstDelimiter) return;

        const hr = document.createElement('hr');
        hr.className = 'delimiter-999 m-top10';
        firstDelimiter.parentElement.insertBefore(hr, firstDelimiter);

        const wrapper = document.createElement("div");
        wrapper.innerHTML = `
            <div class="ups-accordion">

            <div class="ups-header">
    <span class="ups-title">Ups - Armory report</span>

    <div class="ups-icons">
        <span class="ups-arrow">▼</span>
        <span class="ups-gear">⚙️</span>
    </div>
</div>
<div class="ups-content"></div>
    </div>
        `;

        hr.after(wrapper);

        const header = wrapper.querySelector(".ups-header");
        const content = wrapper.querySelector(".ups-content");
        const arrow = wrapper.querySelector(".ups-arrow");
        const gear = wrapper.querySelector(".ups-gear");

        let isRendered = false;

        header.addEventListener("click", (e) => {

            if (e.target.closest(".ups-gear")) {
                return;
            }

            const open = content.classList.toggle("open");
            arrow.style.transform = open ? "rotate(180deg)" : "rotate(0deg)";

            if (open && !isRendered) {
                renderArmoryContent(content);
                isRendered = true;
            }
        });

        const settingsMenu = document.createElement("div");
        settingsMenu.className = "ups-settings-menu";
        settingsMenu.style.display = "none";
        header.appendChild(settingsMenu);

        function renderSettingsMenu() {
            const cfg = loadCategoryConfig();
            const vis = loadItemVisibility();

            settingsMenu.innerHTML = "";

            const catsTitle = document.createElement("div");
            catsTitle.style.fontWeight = "700";
            catsTitle.style.marginBottom = "6px";
            catsTitle.textContent = "Categories";
            settingsMenu.appendChild(catsTitle);

            for (const cat in DEFAULT_CATEGORY_CONFIG) {
                const row = document.createElement("div");
                row.className = "ups-settings-row";
                row.innerHTML = `
            <input type="checkbox" data-cat="${cat}" ${cfg[cat] ? "checked" : ""}>
            <label>${cat}</label>
        `;
                row.querySelector("input").addEventListener("change", (e) => {
                    cfg[cat] = e.target.checked;
                    saveCategoryConfig(cfg);
                });
                settingsMenu.appendChild(row);
            }

            const hr = document.createElement("div");
            hr.style.height = "1px";
            hr.style.background = "#2d3037";
            hr.style.margin = "8px 0";
            settingsMenu.appendChild(hr);

            const itemsTitle = document.createElement("div");
            itemsTitle.style.fontWeight = "700";
            itemsTitle.style.marginBottom = "6px";
            itemsTitle.textContent = "Items visibility";
            settingsMenu.appendChild(itemsTitle);

            const hint = document.createElement("div");
            hint.style.fontSize = "12px";
            hint.style.opacity = "0.85";
            hint.style.marginBottom = "6px";
            hint.textContent = "Uncheck items to hide them from the report.";
            settingsMenu.appendChild(hint);

            for (const cat in UPS_DEFAULT_STRUCTURE) {
                const block = document.createElement("div");
                block.style.border = "1px solid #2d3037";
                block.style.borderRadius = "5px";
                block.style.marginTop = "6px";
                block.style.overflow = "hidden";

                block.innerHTML = `
            <div class="ups-settings-row" style="justify-content:space-between; cursor:pointer; padding:6px 8px; background:#1a1c20;">
                <span style="font-weight:700;">${cat}</span>
                <span class="ups-item-arrow" style="opacity:0.8;">▼</span>
            </div>
            <div class="ups-items-list" style="display:none; padding:6px 8px; max-height:220px; overflow:auto;"></div>
        `;

                const headerRow = block.querySelector(".ups-settings-row");
                const list = block.querySelector(".ups-items-list");
                const arrow = block.querySelector(".ups-item-arrow");
                let open = false;

                headerRow.addEventListener("click", () => {
                    open = !open;
                    list.style.display = open ? "block" : "none";
                    arrow.style.transform = open ? "rotate(180deg)" : "rotate(0deg)";
                });

                for (const item of UPS_DEFAULT_STRUCTURE[cat]) {
                    const r = document.createElement("div");
                    r.className = "ups-settings-row";
                    r.style.padding = "3px 0";
                    const checked = vis?.[cat]?.[item] !== false;

                    r.innerHTML = `
                <input type="checkbox" data-cat="${cat}" data-item="${item}" ${checked ? "checked" : ""}>
                <label style="font-size:12px;">${item}</label>
            `;

                    r.querySelector("input").addEventListener("change", (e) => {
                        const c = e.target.getAttribute("data-cat");
                        const it = e.target.getAttribute("data-item");
                        vis[c][it] = e.target.checked;
                        saveItemVisibility(vis);
                    });

                    list.appendChild(r);
                }

                settingsMenu.appendChild(block);
            }
        }

        gear.addEventListener("click", () => {
            const visible = settingsMenu.style.display === "block";
            settingsMenu.style.display = visible ? "none" : "block";
            if (!visible) renderSettingsMenu();
        });

        settingsMenu.addEventListener("click", (e) => {
            e.stopPropagation();
        });

        settingsMenu.addEventListener("mousedown", (e) => {
            e.stopPropagation();
        });

        const style = document.createElement("style");
        style.textContent = `
            .ups-accordion {
                background: #1d1f24;
                border: 1px solid #2c2f36;
                border-radius: 6px;
                margin-top: 10px;
                box-shadow: 0 2px 5px rgba(0,0,0,0.3);
            }

            .ups-header {
padding: 12px 15px;
cursor: pointer;
display: flex;
justify-content: space-between;
align-items: center;
font-size: 15px;
color: #e6e6e6;
font-weight: 600;
transition: background 0.2s ease;
position: relative;
}

            .ups-header:hover {
                background: #262a30;
            }

            .ups-icons {
    display: flex;
    align-items: center;
    gap: 10px;
}

            .ups-arrow {
    transition: transform 0.2s ease;
    font-size: 13px;
}

            .ups-content {
                max-height: 0;
                overflow: hidden;
                transition: max-height 0.50s ease;
                padding: 0 15px;
                color: #ddd;
                font-size: 14px;
            }

            .ups-content.open {
                max-height: 15000px;
                padding-bottom: 15px;
            }

            .ups-section {
                margin-top: 12px;
                display: flex;
                flex-direction: column;
                gap: 12px;
            }

            .ups-label {
                font-size: 14px;
                color: #c7c7c7;
                font-weight: 600;
            }

            .ups-input {
                background: #2a2d34;
                border: 1px solid #3a3d44;
                padding: 8px 10px;
                color: #eaeaea;
                border-radius: 4px;
                font-size: 14px;
                width: 260px;
            }

            .ups-input:focus {
                outline: none;
                border-color: #4d73ff;
                box-shadow: 0 0 3px rgba(77,115,255,0.5);
            }

            .ups-btn-row {
                display: flex;
                gap: 10px;
                margin-top: 5px;
            }

            .ups-btn {
                padding: 7px 14px;
                border-radius: 4px;
                font-size: 14px;
                cursor: pointer;
                transition: background 0.2s ease;
                font-weight: 600;
            }

            .ups-btn.primary {
                background: #4d73ff;
                color: white;
                border: none;
            }

            .ups-btn.primary:hover {
                background: #3e5ed4;
            }

            .ups-btn.secondary {
                background: #2f333b;
                color: #ccc;
                border: 1px solid #474b52;
            }

            .ups-btn.secondary:hover {
                background: #3c414a;
            }
            .ups-default-section {
                background: #24272d;
                border: 1px solid #2f3239;
                margin-top: 10px;
                border-radius: 5px;
            }

.ups-default-header {
    padding: 10px;
    display: flex;
    justify-content: space-between;
    cursor: pointer;
    font-weight: 600;
    color: #e4e4e4;
}

.ups-default-header:hover {
    background: #2e3239;
}

.ups-default-arrow {
    transition: transform 0.2s ease;
}

.ups-default-content {
    display: none;
    padding: 10px;
    border-top: 1px solid #383b43;
}

.ups-default-row {
    display: flex;
    justify-content: space-between;
    padding: 5px 0;
}

.ups-default-row label {
    color: #ccc;
    font-size: 14px;
}

.ups-default-row input {
    width: 70px;
    background: #2a2d34;
    border: 1px solid #3a3d44;
    color: #eaeaea;
    border-radius: 4px;
    padding: 3px 6px;
}
.ups-loading {
    color: #bbb;
    padding: 10px;
}

.ups-report-title {
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 10px;
    color: #eaeaea;
}

.ups-report-category {
    background: #24272d;
    border: 1px solid #2f3239;
    border-radius: 5px;
    margin-bottom: 10px;
    padding: 8px;
}

.ups-report-cat-title {
    font-weight: 700;
    margin-bottom: 8px;
    color: #d6d6d6;
}

.ups-report-row {
    display: flex;
    justify-content: space-between;
    padding: 4px 0;
    border-bottom: 1px solid #33363d;
    color: #ccc;
}

.ups-report-row:last-child {
    border-bottom: none;
}

.ups-report-qty {
    color: #ff6d6d;
    font-weight: 600;
}

.ups-report-empty {
    color: #8eff8e;
    font-size: 15px;
    padding: 10px;
}

.ups-report-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
}

.ups-copy-btn {
    padding: 6px 12px;
    font-size: 13px;
    background: #3a78ff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 600;
    transition: background 0.2s ease;
}

.ups-copy-btn:hover {
    background: #2f63d1;
}
#ups-api-key {
    filter: blur(4px);
    transition: filter 0.2s ease;
}

#ups-api-key:focus {
    filter: none;
}

.ups-report-row {
    display: grid;
    grid-template-columns: 1fr 50px 120px 80px;
    padding: 4px 0;
    border-bottom: 1px solid #33363d;
    color: #ccc;
}

.ups-report-total {
    margin-top: 15px;
    padding: 10px;
    background: #24272d;
    color: #fff;
    border: 1px solid #2f3239;
    font-size: 16px;
    border-radius: 6px;
    text-align: right;
}

.ups-gear {
    cursor: pointer;
    font-size: 15px;
    opacity: 0.75;
    transition: opacity 0.2s ease, transform 0.15s ease;
}

.ups-gear:hover {
    opacity: 1;
    transform: rotate(20deg);
}

.ups-settings-menu {
    position: absolute;
    right: 10px;
    top: 100%;
    background: #1e2025;
    border: 1px solid #2d3037;
    padding: 10px;
    border-radius: 5px;
    z-index: 9999;
    display: none;
}


.ups-settings-row {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #ddd;
    padding: 4px 0;
}

.ups-market-btn {
    display: inline-block;
    padding: 4px 8px;
    font-size: 12px;
    background: #2f7cff;
    color: #fff;
    border-radius: 4px;
    text-decoration: none;
    font-weight: 600;
    text-align: center;
    transition: background 0.15s ease;
}

.ups-market-btn:hover {
    background: #215fd1;
}
        `;
        document.head.appendChild(style);
    }

    if (location.hash.includes("tab=armoury")) {
        init();
    }

    window.addEventListener("hashchange", () => {
        const hash = location.hash;

        if (hash.includes("tab=armoury")) {
            init();
        }
    });
})();