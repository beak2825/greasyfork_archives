// ==UserScript==
// @name          ✒️ Autograph Automation
// @namespace     pop.locale.autograph.vUnified
// @version       10.2
// @description   Autograph bot with unified pastel control panel (status + custom IDs), blacklist, cooldown, loop protection, login, and resilience.
// @match         https://*.popmundo.com/*
// @match         https://*.thegreatheist.com/*
// @match         https://*.popmundo.com/World/Popmundo.aspx/City/PeopleOnline/*
// @match         https://*.popmundo.com/World/Popmundo.aspx/Character/*
// @match         https://*.popmundo.com/World/Popmundo.aspx/Interact/*
// @match         https://*.popmundo.com/World/Popmundo.aspx/Locale/MoveToLocale/*
// @match         https://*.popmundo.com/World/Popmundo.aspx/Locale/*
// @run-at        document-end
// @grant         GM_setValue
// @grant         GM_getValue
// @grant         GM_deleteValue
// @grant         GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/558997/%E2%9C%92%EF%B8%8F%20Autograph%20Automation.user.js
// @updateURL https://update.greasyfork.org/scripts/558997/%E2%9C%92%EF%B8%8F%20Autograph%20Automation.meta.js
// ==/UserScript==

(function() {
"use strict";

// --- CONFIGURATION ---
const DEBUG_MODE = false; // SET TO TRUE FOR DEBUGGING
const COOLDOWN_MS = 350*1000; // 6.5 minutes
const SHORT_COOLDOWN_MS = 15*1000;
const MIN_DELAY_MS = 500;
const MAX_DELAY_MS = 1000;

const BASE_BOOK_IDS = [];
const PEOPLE_ONLINE_URL = "/World/Popmundo.aspx/City/PeopleOnline/";
const BLACKLIST_DURATION_MS = 12*60*60*1000;
const TARGET_NAMES = ["Ollie Bloom","Christian Valo"];

function log(msg){ console.log("[AutographBot]",msg); }
function getRandomDelay(){ return Math.floor(Math.random()*(MAX_DELAY_MS-MIN_DELAY_MS+1))+MIN_DELAY_MS; }

// --- Custom IDs ---
function getCustomBookIds(){
    const customIds = GM_getValue("autograph_custom_book_ids", []);
    return Array.from(new Set(customIds.filter(id => /^\d+$/.test(id))));
}
function setCustomBookIds(ids){ GM_setValue("autograph_custom_book_ids", ids); }

const BOOK_IDS = [...BASE_BOOK_IDS, ...getCustomBookIds()];
const TOTAL_BOOKS = BOOK_IDS.length;

// --- State ---
function getUsedCount(){ return GM_getValue("autograph_used_count",0); }
function setUsedCount(n){ GM_setValue("autograph_used_count",n); }
function getCooldownTime(){ return GM_getValue("autograph_cooldown_until",0); }
function setCooldownTime(time){ GM_setValue("autograph_cooldown_until",time); }
function getTargetId(){ return GM_getValue("autograph_target_id",null); }
function setTargetId(id){ GM_setValue("autograph_target_id",id); }
function getTargetName(){ return GM_getValue("autograph_target_name","Unknown Character"); }
function setTargetName(name){ GM_setValue("autograph_target_name",name); }

// --- Blacklist ---
function getBlacklist(){ return GM_getValue("autograph_blacklist",{}); }
function addToBlacklist(charId){
    const bl = getBlacklist();
    if(!bl[charId]){
        bl[charId] = Date.now();
        GM_setValue("autograph_blacklist",bl);
        log(`Blacklist: added ${charId}`);
    }
}
function cleanBlacklist(){
    const bl = getBlacklist();
    const now = Date.now();
    let changed=false;
    for(const id in bl){
        if(now-bl[id]>BLACKLIST_DURATION_MS){
            delete bl[id]; changed=true;
        }
    }
    if(changed) GM_setValue("autograph_blacklist",bl);
}
function isBlacklisted(charId){ cleanBlacklist(); return !!getBlacklist()[charId]; }

function cooldownReady(){ return Date.now()>getCooldownTime(); }
function goPeopleOnline(){
    const delay = getRandomDelay();
    log(`Navigating to People Online in ${delay}ms...`);
    if (DEBUG_MODE) {
        log("DEBUG MODE: Navigation blocked!");
        return;
    }
    setTimeout(() => location.href=PEOPLE_ONLINE_URL, delay);
}

function isStopped() { return GM_getValue("autograph_stopped", false); }
function setStopped(val) { GM_setValue("autograph_stopped", val); }

function simpleStatus(statusText) {
    log(`STATUS: ${statusText}`);
    let box = document.getElementById("autograph-control-panel");
    if (box) {
        let statusDiv = box.querySelector(".panel-header");
        if (statusDiv) {
            statusDiv.textContent = statusText;
        }
    }
}

// --- Panel Functions ---
function addResetButton(section) {
    let resetButton = section.querySelector("#autograph-reset-btn");
    if (!resetButton) {
        resetButton = document.createElement("button");
        resetButton.id = "autograph-reset-btn";
        resetButton.textContent = "Reset All";
        resetButton.title = "Reset Cooldown, Used Count, Blacklist, AND Custom IDs";
        resetButton.onclick = () => {
            if (confirm("Are you sure you want to reset the Cooldown, Used Count, Blacklist, AND Custom IDs?")) {
                GM_deleteValue("autograph_cooldown_until");
                GM_deleteValue("autograph_used_count");
                GM_deleteValue("autograph_blacklist");
                GM_deleteValue("autograph_custom_book_ids");
                alert("Autograph state has been reset! Reloading page.");
                location.reload();
            }
        };
        section.appendChild(resetButton);
    }
}

function addStopButton(section) {
    let stopButton = section.querySelector("#autograph-stop-btn");
    if (!stopButton) {
        stopButton = document.createElement("button");
        stopButton.id = "autograph-stop-btn";
        stopButton.textContent = isStopped() ? "Resume Bot" : "Stop Bot";
        stopButton.title = "Toggle automation on/off";
        stopButton.onclick = () => {
            const newState = !isStopped();
            setStopped(newState);
            stopButton.textContent = newState ? "Resume Bot" : "Stop Bot";
            alert(`Bot ${newState ? "stopped" : "resumed"}!`);
        };
        section.appendChild(stopButton);
    }
}

function buildUnifiedPanel() {
    let container = document.querySelector("#autograph-control-panel");
    if (container) container.remove();

    container = document.createElement("div");
    container.id = "autograph-control-panel";

    container.innerHTML = `
    <div class="panel-title">Autograph Control Panel</div>
    <div id="autograph-countdown-section"></div>
    <div class="separator"></div>
    <div id="autograph-custom-id-section"></div>
`;

    document.body.appendChild(container);
    addResetButton(container);
    addStopButton(container);
}

function displayStatus() {
    const until = getCooldownTime();
    const delay = until - Date.now();
    const used = getUsedCount();
    const blacklistCount = Object.keys(getBlacklist()).length;
    const booksRemaining = TOTAL_BOOKS - used;
    const section = document.querySelector("#autograph-countdown-section");
    if (!section) return;

    if (delay > 0) {
        function updateTimer() {
            const remaining = getCooldownTime() - Date.now();
            const panel = document.querySelector("#autograph-control-panel");
            panel.classList.remove('cooldown','active');
            panel.classList.add('cooldown');

            if (remaining <= 0) {
                clearInterval(timerInterval);
                section.innerHTML = `
                    <div class="panel-header">CYCLE READY! ✨</div>
                    <div class="panel-body ready">
                        Books Used: ${used}/${TOTAL_BOOKS}<br>
                        Refreshing...<br>
                        Blacklisted: ${blacklistCount}
                    </div>`;
                setTimeout(() => location.reload(), 2000);
                return;
            }

            const totalSeconds = Math.floor(remaining / 1000);
            const minutes = Math.floor(totalSeconds / 60);
            const seconds = totalSeconds % 60;
            const timeStr = `${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;

            section.innerHTML = `
                <div class="panel-header">⏳ Cooldown Active</div>
                <div class="panel-body">
                    Books Used: ${used}/${TOTAL_BOOKS}<br>
                    Next check in: <strong class="countdown-time">${timeStr}</strong><br>
                    Blacklisted: ${blacklistCount}
                </div>`;
        }
        updateTimer();
        const timerInterval = setInterval(updateTimer, 1000);
    } else {
        const panel = document.querySelector("#autograph-control-panel");
        panel.classList.remove('cooldown','active');
        panel.classList.add('active');

        section.innerHTML = booksRemaining > 0
            ? `<div class="panel-header">✒️ Autograph Cycle Active</div>
               <div class="panel-body">
                    Books Used: ${used}/${TOTAL_BOOKS}<br>
                    Books Left: <strong>${booksRemaining}</strong><br>
                    Blacklisted: ${blacklistCount}
               </div>`
            : `<div class="panel-header">CYCLE READY! ✨</div>
               <div class="panel-body ready">
                    Books Used: ${used}/${TOTAL_BOOKS}<br>
                    Launching next autograph...<br>
                    Blacklisted: ${blacklistCount}
               </div>`;
    }
}

function addCustomIdPanel() {
    const section = document.querySelector("#autograph-custom-id-section");
    if (!section) return;

    section.innerHTML = `
        <div class="panel-header">All Book IDs (${getCustomBookIds().length} configured)</div>
        <div id="custom-id-list">
            ${getCustomBookIds().map(id => `
                <span>${id} <button data-id="${id}" class="remove-id-btn">X</button></span>
            `).join('')}
        </div>
        <div class="input-group">
            <input type="text" id="new-custom-id" placeholder="Enter new ID(s)" title="Enter one or more numeric item IDs for your extra autograph books, separated by commas.">
            <button id="add-custom-id-btn">Add</button>
        </div>
    `;

    document.getElementById('add-custom-id-btn').onclick = () => {
        const input = document.getElementById('new-custom-id');
        const rawInput = input.value.trim();
        const newIds = rawInput.split(',').map(id => id.trim()).filter(id => id.length > 0);
        let addedCount = 0, invalidIds = [];
        let currentIds = getCustomBookIds();
        let finalIds = [...currentIds];

        for (const newId of newIds) {
            if (/^\d+$/.test(newId)) {
                if (!finalIds.includes(newId)) {
                    finalIds.push(newId);
                    addedCount++;
                }
            } else {
                invalidIds.push(newId);
            }
        }

        if (addedCount > 0) {
            setCustomBookIds(finalIds);
            input.value = '';
            let msg = `${addedCount} Book ID(s) added successfully!`;
            if (invalidIds.length > 0) {
                msg += ` (Ignored ${invalidIds.length} invalid/duplicate ID(s))`;
            }
            alert(msg + " Reloading...");
            location.reload();
        } else {
            alert('No valid new IDs found to add. Check format or for duplicates.');
        }
    };

    section.querySelectorAll('.remove-id-btn').forEach(btn => {
        btn.onclick = (e) => {
            const idToRemove = e.target.getAttribute('data-id');
            const newIds = getCustomBookIds().filter(id => id !== idToRemove);
            setCustomBookIds(newIds);
            alert(`Book ID ${idToRemove} removed! Reloading...`);
            location.reload();
        };
    });
}

// --- CSS ---
GM_addStyle(`
#autograph-control-panel {
    position: fixed;
    top: 20px;
    right: 10px;
    width: 240px;
    padding: 10px;
    font-family: Bahnschrift, sans-serif;
    font-size: 12px;
    border-radius: 12px;
    border: 1px solid #cce0ff;
    background: #f7faff;
    color: #405a73;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    z-index: 10000;
    transition: background 0.3s, border-color 0.3s;
}
#autograph-control-panel.cooldown {
    background: #f0f7ff;
    border-color: #bbd3f0;
}
#autograph-control-panel.active {
    background: #f7fff7;
    border-color: #cceccb;
}
#autograph-control-panel .panel-header {
    font-weight: bold;
    text-align: center;
    margin-bottom: 6px;
    color: #204060;
    font-size: 14px;
}
#autograph-control-panel .panel-body {
    text-align: center;
    margin-bottom: 10px;
    line-height: 1.5;
}
#autograph-control-panel .countdown-time {
    font-size: 18px;
    color: #1a4d80;
    display: block;
    margin: 4px 0;
    font-weight: bold;
}
#autograph-control-panel .panel-title {
    font-size: 15px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 10px;
    color: #1a3e66;
    border-bottom: 1px solid #cce0ff;
    padding-bottom: 4px;
}
#autograph-control-panel .separator {
    height: 1px;
    background: #e0eaff;
    margin: 10px 0;
}
#custom-id-list {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    max-height: 100px;
    overflow-y: auto;
    padding: 5px;
    border: 1px dashed #e0eaff;
    border-radius: 6px;
    background: #ffffff;
}
#custom-id-list span {
    background: #f0f7ff;
    border: 1px solid #d9e8ff;
    padding: 2px 3px;
    border-radius: 8px;
    font-size: 10px;
    white-space: nowrap;
}
.input-group {
    display: flex;
    margin-top: 8px;
}
#new-custom-id {
    flex-grow: 1;
    padding: 4px 8px;
    border: 1px solid #cce0ff;
    border-right: none;
    border-radius: 6px 0 0 6px;
    font-size: 11px;
}
#add-custom-id-btn {
    padding: 4px 8px;
    cursor: pointer;
    background: #d9e8ff;
    color: #295b8f;
    border: 1px solid #cce0ff;
    border-radius: 0 6px 6px 0;
    font-size: 11px;
    font-weight: bold;
}
#autograph-countdown-section,
#autograph-custom-id-section {
    margin-bottom: 10px;
}
.remove-id-btn {
    margin-left: 4px;
    padding: 0 3px;
    cursor: pointer;
    background: #ffdede;
    color: #cc3333;
    border: 1px solid #ff9999;
    border-radius: 50%;
    line-height: 1;
    font-size: 8px;
    font-weight: bold;
}
#autograph-reset-btn {
    margin-top: 10px;
    padding: 4px 10px;
    font-size: 11px;
    cursor: pointer;
    background: #ffeded;
    color: #cc3333;
    border: 1px solid #ff9999;
    border-radius: 10px;
    transition: background 0.2s ease, transform 0.1s ease;
    width: 100%;
}
#autograph-reset-btn:hover {
    background: #ffcccc;
}
#autograph-stop-btn {
    margin-top: 6px;
    padding: 4px 10px;
    font-size: 11px;
    cursor: pointer;
    background: #fff3cc;
    color: #996600;
    border: 1px solid #ffcc66;
    border-radius: 10px;
    width: 100%;
}
#autograph-stop-btn:hover {
    background: #ffe699;
}
`);

// ------------------------------------------------------------------
// --- CORE LOGIC START ---
// ------------------------------------------------------------------

log("=== SCRIPT STARTED ===");
log(`Current URL: ${location.href}`);

buildUnifiedPanel();
addCustomIdPanel();
displayStatus();
setInterval(displayStatus,1000);

// --- Redirect generic World page to People Online ---
if (location.href.match(/\/World\/Popmundo\.aspx\/?$/)) {
    log("Landed on generic World page (no subpath). Redirecting to People Online.");
    goPeopleOnline();
}

// --- Hide Unwanted Rows ---
function hideUnwantedRows(){
    cleanBlacklist();
    const table=document.querySelector("table#tablepeople tbody");
    if(!table) return;
    const rows=table.querySelectorAll("tr");
    rows.forEach(row=>{
        const link=row.querySelector("a[href*='/Character/']");
        const text=row.textContent.trim();
        let hide=false;
        if(link){
            const charId=link.getAttribute("href").match(/Character\/(\d+)/)?.[1];
            if(charId && isBlacklisted(charId)) hide=true;
        }
        if (text.includes("Traveling") || text.includes("Seyahatte")) hide = true;
        if(TARGET_NAMES.some(name=>text.includes(name))) hide=true;
        if(hide) row.remove();
    });
}

// --- People Online Page ---
if (location.href.includes("/City/PeopleOnline/")) {
    log("=== ON PEOPLE ONLINE PAGE ===");

    if (isStopped()) {
        log("Bot is currently stopped. Skipping automation.");
        return;
    }

    const table = document.querySelector("table#tablepeople tbody");
    if (table) {
        hideUnwantedRows();
        const observer = new MutationObserver(hideUnwantedRows);
        observer.observe(table, { childList: true });
    }

    const chkAuto = document.querySelector("#ctl00_cphLeftColumn_ctl00_chkAutograph");
    const chkRel = document.querySelector("#ctl00_cphLeftColumn_ctl00_chkRelationships");
    const btnFilter = document.querySelector("#ctl00_cphLeftColumn_ctl00_btnFilter");
    const radioNoLang = document.querySelector("#ctl00_cphLeftColumn_ctl00_chkNoLanguage");
    let changed = false;
    if (chkAuto && !chkAuto.checked) { chkAuto.checked = true; changed = true; log("Enabled autograph filter."); }
    if (chkRel && chkRel.checked) { chkRel.checked = false; changed = true; log("Disabled relationship filter."); }
    if (radioNoLang && !radioNoLang.checked) { radioNoLang.checked = true; changed = true; log("Enabled no language filter."); }
    if (changed && btnFilter) { log("Submitting filters."); btnFilter.click(); return; }

    const used = getUsedCount();
    if (!cooldownReady() && used === 0) { log("Cooldown active. Exiting."); return; }
    if (used >= TOTAL_BOOKS) {
        setUsedCount(0);
        setCooldownTime(Date.now() + SHORT_COOLDOWN_MS);
        location.reload();
        return;
    }

    setTimeout(() => {
        if (isStopped()) {
            log("Bot is currently stopped. Skipping character selection.");
            return;
        }

        const myCharId = document.querySelector("#ctl00_cphLeftColumn_ctl00_imgAvatar")?.src.match(/Avatar\/(\d+)/)?.[1];
        const allLinks = Array.from(document.querySelectorAll("table#tablepeople a[href*='/Character/']"));
        const links = allLinks.filter(link => {
            const charId = link.getAttribute("href")?.match(/Character\/(\d+)/)?.[1];
            const visible = !!(link.offsetParent !== null);
            return visible && charId && charId !== myCharId && !isBlacklisted(charId);
        });

        if (links.length > 0) {
            const link = links[Math.floor(Math.random() * links.length)];
            const charId = link.getAttribute("href").match(/Character\/(\d+)/)[1];
            setTargetId(charId);
            setTargetName(link.textContent.trim() || "Unknown Character");
            log(`Target selected (ID: ${charId}, Name: ${getTargetName()}). Navigating...`);
            const delay = getRandomDelay();
            log(`Delaying navigation by ${delay}ms.`);
            setTimeout(() => {
                if (!isStopped()) {
                    location.href = link.href;
                } else {
                    log("Bot was stopped before navigation. Aborting.");
                }
            }, delay);
        } else {
            log("No usable characters. Short cooldown applied.");
            setCooldownTime(Date.now() + SHORT_COOLDOWN_MS);
            location.reload();
        }
    }, 500);
}

// --- Character Page ---
log("Checking if this is a Character page...");
log(`ACTUAL URL: ${location.href}`);
log(`URL includes '/Character/': ${location.href.includes("/Character/")}`);

if (location.href.includes("/Character/") &&
    !location.href.includes("/Character/Achievements/") &&
    !location.href.includes("/Character/Items/") &&
    !location.href.includes("/Character/Diary/") &&
    !location.href.includes("/Character/Blog/") &&
    !location.href.includes("/City/PeopleOnline/")) {

    log("=== ENTERING CHARACTER PAGE HANDLER ===");

    if (isStopped()) {
        log("Bot is currently stopped. Skipping character interaction.");
        // Don't return - let the script continue to show the panel
    } else {
        // Prevent multiple executions
        if (!window.autographCharacterPageHandled) {
            window.autographCharacterPageHandled = true;

            // Store current character ID for fallback blacklisting
            const charId = location.href.match(/Character\/(\d+)/)?.[1];
            if (charId) {
                GM_setValue("autograph_last_character_id", charId);
                log(`Stored last character ID: ${charId}`);
            }

            // Delay to ensure error div is rendered
            setTimeout(() => {
                log("=== CHARACTER PAGE DEBUG START ===");

                const errorDiv = document.querySelector(".notification-real.notification-error");
                log(`Error div found: ${!!errorDiv}`);
                const errorText = errorDiv?.textContent || "";
                log(`Error text: "${errorText}"`);

                const accessDenied = errorText.includes("access code") ||
                                     errorText.includes("menetti") ||
                                     errorText.includes("giremezsiniz") ||
                                     errorText.includes("girmek mümkün değil");
                log(`Access denied: ${accessDenied}`);

                if (accessDenied) {
                    const lastCharId = GM_getValue("autograph_last_character_id", null);
                    if (lastCharId) {
                        log(`Access denied on Character page. Blacklisting ID ${lastCharId}.`);
                        addToBlacklist(lastCharId);
                    } else {
                        log("Access denied, but no character ID was stored.");
                    }

                    if (!isStopped()) {
                        goPeopleOnline();
                    } else {
                        log("Bot is stopped. Not navigating after character page access failure.");
                    }
                    return;
                }

                // Proceed to Interact if no error
                log("Looking for interact link...");
                const interactLink = document.querySelector("#ctl00_cphRightColumn_ctl00_lnkInteract, #ctl00_cphRightColumn_ctl00_btnInteract, #ctl00_cphRightColumn_ctl00_liInteract a");
                log(`Interact link found: ${!!interactLink}`);

                if (interactLink) {
                    log(`Link href: ${interactLink.href}`);
                    log(`Link text: ${interactLink.textContent}`);

                    const delay = getRandomDelay();
                    log(`Found interact link. Navigating in ${delay}ms...`);

                    setTimeout(() => {
                        if (!isStopped()) {
                            if (interactLink.href && interactLink.href.startsWith('javascript:')) {
                                log("Clicking javascript: link");
                                if (DEBUG_MODE) {
                                    log("DEBUG MODE: Click blocked!");
                                } else {
                                    interactLink.click();
                                }
                            } else if (interactLink.href) {
                                log(`Navigating to: ${interactLink.href}`);
                                if (DEBUG_MODE) {
                                    log("DEBUG MODE: Navigation blocked!");
                                } else {
                                    location.href = interactLink.href;
                                }
                            } else {
                                log("Clicking link (no href)");
                                if (DEBUG_MODE) {
                                    log("DEBUG MODE: Click blocked!");
                                } else {
                                    interactLink.click();
                                }
                            }
                        } else {
                            log("Bot was stopped before interaction. Aborting.");
                        }
                    }, delay);
                } else {
                    log("No interact link found. Returning to People Online.");
                    goPeopleOnline();
                }

                log("=== CHARACTER PAGE DEBUG END ===");
            }, 2000);
        }
    }
}

// --- Interact Page ---
if (location.href.includes("/Interact/")) {
    log("=== ON INTERACT PAGE ===");

    if (isStopped()) {
        log("Bot is currently stopped. Skipping item usage.");
        return;
    }

    const nameMatch = document.title.match(/Interact with (.+)/);
    if (nameMatch) setTargetName(nameMatch[1]);

    const errorDiv = document.querySelector(".notification-real.notification-error");
    const bodyText = document.body.innerText;
    const failureMessages = [
        "has blocked you from using items.",
        "You're not allowed to enter this home unless you have the access code.",
        "sizi üzerinde eşya kullanmaktan menetti.",
        "Erişim kodunuz olmadığı sürece bu eve giremezsiniz.",
        "Bu mekâna girmek mümkün değil."
    ];
    const errorDetected =
        failureMessages.some(msg => bodyText.includes(msg)) ||
        (errorDiv && failureMessages.some(msg => errorDiv.textContent.includes(msg)));

    const currentId = getTargetId();
    const lastId = GM_getValue("autograph_last_page_id", null);
    const lastTime = GM_getValue("autograph_last_page_time", 0);
    const now = Date.now();

    if (lastId === currentId && now - lastTime < 60000) {
        const tries = GM_getValue("autograph_repeat_count", 0) + 1;
        GM_setValue("autograph_repeat_count", tries);
        if (tries >= 1) {
            log(`Too many tries for ${currentId}, auto-blacklisting.`);
            addToBlacklist(currentId);
            GM_setValue("autograph_repeat_count", 0);
            goPeopleOnline();
            return;
        }
    } else {
        GM_setValue("autograph_repeat_count", 0);
    }

    GM_setValue("autograph_last_page_id", currentId);
    GM_setValue("autograph_last_page_time", now);

    if (errorDetected) {
        let charId = currentId;
        if (!charId) {
            const refId = document.referrer.match(/Character\/(\d+)/)?.[1];
            if (refId) charId = refId;
        }
        if (charId) {
            log(`Access failure detected, adding ${charId} to blacklist.`);
            addToBlacklist(charId);
        }
        goPeopleOnline();
        return;
    }

    const ddl = document.querySelector("#ctl00_cphTopColumn_ctl00_ddlUseItem");
    const btn = document.querySelector("#ctl00_cphTopColumn_ctl00_btnUseItem");
    if (!ddl || !btn) {
        log("Missing item controls. Returning to People Online.");
        goPeopleOnline();
        return;
    }

    let used = getUsedCount();
    const bookId = BOOK_IDS[used];
    const nextUsed = used + 1;

    if (!bookId) {
        log("No book ID found. Returning to People Online.");
        goPeopleOnline();
        return;
    }

    const bookOption = ddl.querySelector(`option[value="${bookId}"]`);
    if (!bookOption) {
        log(`Book ID ${bookId} unavailable, skipping.`);
        setUsedCount(nextUsed);
        if (nextUsed >= TOTAL_BOOKS) {
            setUsedCount(0);
            setCooldownTime(Date.now() + COOLDOWN_MS);
        }
        goPeopleOnline();
        return;
    }

    ddl.value = bookId;
    if (nextUsed >= TOTAL_BOOKS) {
        setUsedCount(0);
        setCooldownTime(Date.now() + COOLDOWN_MS);
    } else {
        setUsedCount(nextUsed);
    }

    log(`Using book ${used + 1}/${TOTAL_BOOKS} on ${getTargetName()}.`);
    const delay = getRandomDelay();
    log(`Delaying click by ${delay}ms.`);
    setTimeout(() => {
        if (!isStopped()) {
            btn.click();
        } else {
            log("Bot was stopped before item use. Aborting.");
        }
    }, delay);
}

// --- Locale Page ---
if (location.href.includes("/Locale/")) {
    log("=== ON LOCALE PAGE ===");

    setTimeout(() => {
        const errorDiv = document.querySelector(".notification-real.notification-error");
        const errorText = errorDiv?.textContent || "";

        const accessDenied = errorText.includes("access code") ||
                             errorText.includes("menetti") ||
                             errorText.includes("giremezsiniz") ||
                             errorText.includes("girmek mümkün değil");

        if (accessDenied) {
            const lastCharId = GM_getValue("autograph_last_character_id", null);
            if (lastCharId) {
                log(`Access denied. Blacklisting last character ID ${lastCharId}.`);
                addToBlacklist(lastCharId);
            } else {
                log("Access denied, but no character ID was stored.");
            }

            if (!isStopped()) {
                goPeopleOnline();
            } else {
                log("Bot is stopped. Not navigating after locale access failure.");
            }
        }
    }, 500);
}

// --- After using item ---
if ((location.href.includes("/Locale/") || (location.href.includes("/Interact/") && document.referrer.includes("/Interact/")))) {
    if (!isStopped() && !location.href.includes("/City/PeopleOnline/") && !location.href.includes("/Character/")) {
        log("Item used successfully, returning to People Online for next character (with delay).");
        goPeopleOnline();
    }
}

})();