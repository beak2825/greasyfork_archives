// ==UserScript==
// @name         WTFightArmouryTracker
// @namespace    http://tampermonkey.net/
// @version      4.3
// @description  Tracks Faction Armory Ownership with WTFight API Integration
// @match        https://www.torn.com/factions.php?*
// @grant        GM.xmlHttpRequest
// @connect      wtfight.net
// @connect      www.wtfight.net
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558157/WTFightArmouryTracker.user.js
// @updateURL https://update.greasyfork.org/scripts/558157/WTFightArmouryTracker.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const API_KEY_STORAGE = "WTFight_API_Key";
    const clean = s => s ? s.replace(/\s+/g, " ").trim() : "";

    function getApiKey() {
        return localStorage.getItem(API_KEY_STORAGE) || "";
    }

    function apiUrl(path) {
        const key = getApiKey();
        return key ? `https://www.wtfight.net/api/${path}.php?key=${encodeURIComponent(key)}` : null;
    }

    function API_SELECT_URL() { return apiUrl("armourySelect"); }
    function API_SET_URL()   { return apiUrl("armourySet"); }
    function API_GET_URL()   { return apiUrl("armouryGet"); }

    function insertApiKeyUI() {
        if (document.getElementById("wtfight-api-panel")) return;

        const tabsContainer = document.getElementById("faction-armoury-tabs");
        if (!tabsContainer) return;

        const wrapper = document.createElement("div");
        wrapper.id = "wtfight-api-panel";
        wrapper.style.cssText = `
            background: rgba(0,0,0,0.28);
            padding: 6px 8px;
            margin: 6px 0 10px 0;
            border: 1px solid #0077aa;
            border-radius: 5px;
            font-size: 12px;
            color: #aee7ff;
        `;

        const savedKey = getApiKey();

        wrapper.innerHTML = `
            <div id="wtfight-api-toggle" style="cursor:pointer;font-weight:bold;">
                WTFight API Key ⯈
            </div>
            <div id="wtfight-api-content" style="display:none;margin-top:4px;">
                <input id="wtfight-api-input" type="text"
                    placeholder="Enter WTFight API Key"
                    value="${savedKey}"
                    style="width:280px;padding:2px;font-size:12px;color:black;border-radius:3px;">
                <button id="wtfight-api-save" style="
                    margin-left:6px;padding:2px 8px;font-size:11px;
                    background:#004d6f;border:1px solid #0099dd;color:#aee7ff;
                    border-radius:3px;cursor:pointer;">
                    Save
                </button>
            </div>
        `;

        tabsContainer.parentNode.insertBefore(wrapper, tabsContainer);

        const toggle  = wrapper.querySelector("#wtfight-api-toggle");
        const content = wrapper.querySelector("#wtfight-api-content");
        const input   = wrapper.querySelector("#wtfight-api-input");
        const saveBtn = wrapper.querySelector("#wtfight-api-save");

        toggle.addEventListener("click", () => {
            const open = content.style.display !== "none";
            content.style.display = open ? "none" : "block";
            toggle.textContent = open ? "WTFight API Key ▶" : "WTFight API Key ▼";
        });

        saveBtn.addEventListener("click", () => {
            const newKey = input.value.trim();
            if (!newKey) {
                localStorage.removeItem(API_KEY_STORAGE);
                alert("WTFight API key cleared.");
            } else {
                localStorage.setItem(API_KEY_STORAGE, newKey);
                alert("WTFight API key saved.");
            }
            location.reload();
        });
    }

    const panelObserver = new MutationObserver(insertApiKeyUI);
    panelObserver.observe(document.body, { childList: true, subtree: true });
    insertApiKeyUI();

    if (!getApiKey()) {
        console.warn("WTFightArmouryTracker: No API key set. Ownership tracking disabled.");
        return;
    }

    let factionUsers    = [];
    let ownershipMap    = {};
    let usersLoaded     = false;
    let ownershipLoaded = false;
    let armoryObserver  = null;
    let observerScheduled = false;

    function loadFactionUsers(callback) {
        const url = API_SELECT_URL();
        if (!url) { usersLoaded = true; callback && callback(); return; }

        GM.xmlHttpRequest({
            method: "GET",
            url,
            onload: res => {
                try {
                    const json = JSON.parse(res.responseText);
                    factionUsers = json.data || [];
                } catch (e) {
                    console.error("WTFightArmouryTracker: Failed to parse armourySelect", e);
                    factionUsers = [];
                }
                usersLoaded = true;
                callback && callback();
            },
            onerror: err => {
                console.error("WTFightArmouryTracker: armourySelect request failed", err);
                factionUsers = [];
                usersLoaded = true;
                callback && callback();
            }
        });
    }

    function loadOwnership(callback) {
        const url = API_GET_URL();
        if (!url) { ownershipLoaded = true; callback && callback(); return; }

        GM.xmlHttpRequest({
            method: "GET",
            url,
            onload: res => {
                try {
                    const json = JSON.parse(res.responseText);
                    ownershipMap = {};
                    if (json.status === "success" && Array.isArray(json.data)) {
                        json.data.forEach(row => {
                            const armoryID = String(row.armoryID);
                            let bonuses = [];
                            try {
                                bonuses = row.bonuses ? JSON.parse(row.bonuses) : [];
                            } catch {
                                bonuses = [];
                            }
                            ownershipMap[armoryID] = {
                                ownerPlayerID: row.ownerPlayerID ? String(row.ownerPlayerID) : "",
                                itemName: row.itemName || "",
                                damage: row.damage,
                                accuracy: row.accuracy,
                                bonuses
                            };
                        });
                    }
                } catch (e) {
                    console.error("WTFightArmouryTracker: Failed to parse armouryGet", e);
                    ownershipMap = {};
                }
                ownershipLoaded = true;
                callback && callback();
            },
            onerror: err => {
                console.error("WTFightArmouryTracker: armouryGet request failed", err);
                ownershipLoaded = true;
                callback && callback();
            }
        });
    }

    function populateSelect(selectEl, savedVal) {
        selectEl.innerHTML = `<option value="">-- Select --</option>`;
        factionUsers.forEach(u => {
            const opt = document.createElement("option");
            opt.value = String(u.playerID);
            opt.textContent = u.PlayerName;
            if (savedVal && savedVal === String(u.playerID)) {
                opt.selected = true;
            }
            selectEl.appendChild(opt);
        });
    }

    function insertOwnershipPanel(li, armoryId) {
        if (!armoryId) return null;
        let row = li.querySelector(".wtfight-ownership-row");
        if (row) return row;

        const entry = ownershipMap[armoryId];
        const savedOwner = entry ? entry.ownerPlayerID : "";

        row = document.createElement("div");
        row.className = "wtfight-ownership-row";
        row.style.cssText = `
            display:none;
            background:rgba(0,0,0,0.15);
            padding:4px 6px;
            margin-top:3px;
            font-size:10px;
            border-radius:3px;
        `;
        row.innerHTML = `
            Owner:
            <select class="wtfight-owner-select" style="margin-left:4px;"></select>
            <button class="wtfight-owner-save" style="
                margin-left:6px;
                font-size:9px;
                padding:1px 4px;
                background:#003a55;
                border:1px solid #0077aa;
                color:#9ed7ff;
                border-radius:3px;
                cursor:pointer;
                text-shadow:0 0 3px #000;
            ">Save</button>
        `;

        li.appendChild(row);

        const sel = row.querySelector(".wtfight-owner-select");
        const btn = row.querySelector(".wtfight-owner-save");
        populateSelect(sel, savedOwner);

        btn.addEventListener("click", () => {
            const url = API_SET_URL();
            if (!url) return;

            const payload = {
                armoryID: armoryId,
                itemName: li.dataset.itemName || "",
                damage: li.dataset.damage || null,
                accuracy: li.dataset.accuracy || null,
                bonuses: JSON.parse(li.dataset.bonuses || "[]"),
                ownerPlayerID: sel.value || null
            };

            btn.textContent = "Saving...";
            btn.disabled = true;

            GM.xmlHttpRequest({
                method: "POST",
                url,
                headers: { "Content-Type": "application/json" },
                data: JSON.stringify(payload),
                onload: res => {
                    let ok = false;
                    try {
                        const json = JSON.parse(res.responseText);
                        if (json.status === "success") {
                            ok = true;
                        } else if (json.msg) {
                            console.warn("WTFightArmouryTracker: armourySet error:", json.msg);
                            btn.textContent = json.msg;
                        }
                    } catch {
                        console.warn("WTFightArmouryTracker: Could not parse armourySet response.");
                    }

                    loadOwnership(() => {
                        updateRow(li);
                        btn.textContent = ok ? "Saved!" : (btn.textContent || "Error");
                        setTimeout(() => {
                            btn.textContent = "Save";
                            btn.disabled = false;
                        }, 1300);
                    });
                },
                onerror: err => {
                    console.error("WTFightArmouryTracker: armourySet failed", err);
                    btn.textContent = "Error";
                    setTimeout(() => {
                        btn.textContent = "Save";
                        btn.disabled = false;
                    }, 1500);
                }
            });
        });

        return row;
    }
    function updateRow(li) {
        const imgWrap = li.querySelector(".img-wrap");
        const armoryId = imgWrap?.dataset.armoryid;
        if (!armoryId) return;

        const entry   = ownershipMap[armoryId] || {};
        const ownerId = entry.ownerPlayerID || "";

        if (li.dataset.wtfightArmoryId === armoryId &&
            li.dataset.wtfightLastOwner === ownerId &&
            li.dataset.wtfightInit === "1") {
            return;
        }

        const nameDiv = li.querySelector(".name");
        if (!nameDiv) return;

        li.dataset.itemName = clean(nameDiv.childNodes[0]?.textContent || nameDiv.textContent);
        const dmgSpan = li.querySelector(".bonus-attachment-item-damage-bonus + span");
        const accSpan = li.querySelector(".bonus-attachment-item-accuracy-bonus + span");
        const dmg = clean(dmgSpan?.textContent);
        const acc = clean(accSpan?.textContent);
        const bonuses = [...li.querySelectorAll(".bonuses .bonus i[title]")]
            .map(i => clean(i.title.replace(/<[^>]*>/g, "")));

        li.dataset.damage = dmg || "";
        li.dataset.accuracy = acc || "";
        li.dataset.bonuses = JSON.stringify(bonuses);

        let ownerLabel = li.querySelector(".wtfight-owner-label");
        if (ownerId) {
            const user = factionUsers.find(u => String(u.playerID) === ownerId);
            if (user) {
                if (!ownerLabel) {
                    ownerLabel = document.createElement("div");
                    ownerLabel.className = "wtfight-owner-label";
                    ownerLabel.style.cssText = `
                        position:absolute;
                        top:-2px;
                        left:50%;
                        transform:translateX(-50%);
                        background:rgba(0,0,0,0.55);
                        padding:1px 4px;
                        font-size:10px;
                        color:#00aaff;
                        border-radius:3px;
                        pointer-events:none;
                        text-shadow:0 0 3px #000;
                        white-space:nowrap;
                        z-index:99;
                    `;
                    li.style.position = "relative";
                    li.insertBefore(ownerLabel, li.firstChild);
                }
                ownerLabel.textContent = `Owned by: ${user.PlayerName}`;
            }
        } else if (ownerLabel) {
            ownerLabel.remove();
        }

        const panel = insertOwnershipPanel(li, armoryId);

        if (!li.querySelector(".wtfight-own-toggle")) {
            const tbtn = document.createElement("span");
            tbtn.className = "wtfight-own-toggle";
            tbtn.textContent = " ▶";
            tbtn.style.cssText = "margin-left:4px;font-size:11px;color:#00aaff;cursor:pointer;user-select:none;";
            nameDiv.appendChild(tbtn);

            tbtn.addEventListener("click", () => {
                if (!panel) return;
                const open = panel.style.display !== "none";
                panel.style.display = open ? "none" : "block";
                tbtn.textContent = open ? " ▶" : " ▼";
            });
        }

        const giveBtn        = li.querySelector(".item-action .give");
        const giveConfirmBtn = li.querySelector(".give-cont button.torn-btn");
        const giveInput      = li.querySelector('.give-cont input[name="user"]');

        if (giveBtn && giveConfirmBtn && giveInput && !li.dataset.wtfightGiveBound) {
            li.dataset.wtfightGiveBound = "1";

            giveBtn.addEventListener("click", () => {
                if (!ownerId) return;
                const user = factionUsers.find(u => String(u.playerID) === ownerId);
                if (user) {
                    giveInput.value = `${user.PlayerName} [${user.playerID}]`;
                }
            });

            giveConfirmBtn.addEventListener("click", () => {
                const match = giveInput.value.match(/\[(\d+)\]/);
                const giveToID = match ? match[1] : null;

                if (ownerId && giveToID !== ownerId) {
                    alert("⚠ This is NOT the recorded owner!");
                }

                delete ownershipMap[armoryId];

                const labelEl = li.querySelector(".wtfight-owner-label");
                if (labelEl) labelEl.remove();

                const ownerSelect = li.querySelector(".wtfight-owner-select");
                if (ownerSelect) ownerSelect.value = "";

                li.dataset.wtfightLastOwner = "";
                li.dataset.wtfightInit = "0";
                updateRow(li);

                const url = API_SET_URL();
                if (!url) return;

                GM.xmlHttpRequest({
                    method: "POST",
                    url,
                    headers: { "Content-Type": "application/json" },
                    data: JSON.stringify({ armoryID: armoryId, ownerPlayerID: null }),
                    onload: () => {
                        loadOwnership(() => {
                            li.dataset.wtfightInit = "0";
                            updateRow(li);
                        });
                    },
                    onerror: err => {
                        console.error("WTFightArmouryTracker: Failed to clear ownership on give", err);
                    }
                });
            });
        }

        li.dataset.wtfightArmoryId = armoryId;
        li.dataset.wtfightLastOwner = ownerId;
        li.dataset.wtfightInit = "1";
    }
 
    function processAllRows() {
        document
            .querySelectorAll("#armoury-weapons ul.item-list > li")
            .forEach(updateRow);
    }

    function scheduleProcess() {
        if (observerScheduled) return;
        observerScheduled = true;
        requestAnimationFrame(() => {
            observerScheduled = false;
            processAllRows();
        });
    }

    function initObservers() {
        if (!usersLoaded || !ownershipLoaded) return;

        const listRoot = document.querySelector("#armoury-weapons ul.item-list");
        if (!listRoot) return;

        processAllRows();

        armoryObserver = new MutationObserver(scheduleProcess);
        armoryObserver.observe(listRoot, {
            childList: true,
            subtree: true
        });
    }

        // Track current armoury list root
    let currentListRoot = null;
    let dataLoading = false;

    function initObserversFor(listRoot) {
        // Make sure we have data before wiring observers
        if (!usersLoaded || !ownershipLoaded) return;

        processAllRows();

        if (armoryObserver) {
            armoryObserver.disconnect();
        }

        armoryObserver = new MutationObserver(scheduleProcess);
        armoryObserver.observe(listRoot, {
            childList: true,
            subtree: true
        });
    }

    // Watch the document for (re)creation of the weapons list – PDA-safe
    const armouryRootWatcher = new MutationObserver(() => {
        const listRoot = document.querySelector("#armoury-weapons ul.item-list");
        if (!listRoot) return;

        // New or replaced list root (PDA tab change / AJAX)
        if (listRoot !== currentListRoot) {
            currentListRoot = listRoot;

            // First time: load data, then wire observers
            if (!usersLoaded || !ownershipLoaded) {
                if (dataLoading) return;
                dataLoading = true;

                loadFactionUsers(() => {
                    loadOwnership(() => {
                        dataLoading = false;
                        initObserversFor(listRoot);
                    });
                });
            } else {
                // Data already loaded: just init observers on new DOM
                initObserversFor(listRoot);
            }
        }
    });

    armouryRootWatcher.observe(document.body, {
        childList: true,
        subtree: true
    });


})();
