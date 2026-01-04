// ==UserScript==
// @name         Timers & Reminders
// @namespace    dev.chib.Timers&Reminders
// @version      1.37.5
// @description  Floating timers, + checklist 🐸✌️
// @author       Chib
// @match        https://www.torn.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550465/Timers%20%20Reminders.user.js
// @updateURL https://update.greasyfork.org/scripts/550465/Timers%20%20Reminders.meta.js
// ==/UserScript==

/* global $ */
/* eslint-disable no-multi-spaces */

// --- GLOBAL STATE VARIABLES ---
let tornAPI = GM_getValue("tornApiKey", "");
let energy_current = 0;
let energy_max = 0;
let nerve_current = 0;
let nerve_max = 0;
let originalTitle = document.title;
let autoApiInterval = null;

const __intervals = [];
const __observers = [];

// --- Travel helper config ---
function getTravelQuantity() {
    return GM_getValue("travelQuantity", 29);
}
function setTravelQuantity(v) {
    GM_setValue("travelQuantity", v);
}
function getStockLink() {
    return GM_getValue("foreignStockLink", "https://arsonwarehouse.com/foreign-stock");
}
function setStockLink(v) {
    GM_setValue("foreignStockLink", v);
}

const TRAVEL_ITEMS = {
    mexico: [
        { name: "Dahlia", price: 300 },
        { name: "Jaguar Plushie", price: 10000 },
    ],
    cayman: [
        { name: "Banana Orchid", price: 4000 },
        { name: "Stingray Plushie", price: 400 },
    ],
    canada: [
        { name: "Crocus", price: 600 },
        { name: "Wolverine Plushie", price: 30 },
    ],
    hawaii: [
        { name: "Orchid", price: 700 },
    ],
    england: [
        { name: "Heather", price: 5000 },
        { name: "Nessie Plushie", price: 200 },
        { name: "Red Fox Plushie", price: 1000 },
    ],
    argentina: [
        { name: "Ceibo Flower", price: 500 },
        { name: "Monkey Plushie", price: 400 },
    ],
    switzerland: [
        { name: "Edelweiss", price: 900 },
        { name: "Chamois Plushie", price: 400 },
    ],
    japan: [
        { name: "Cherry Blossom", price: 500 },
    ],
    china: [
        { name: "Peony", price: 5000 },
        { name: "Panda Plushie", price: 400 },
    ],
    uae: [
        { name: "Tribulus Omanense", price: 6000 },
        { name: "Camel Plushie", price: 14000 },
    ],
    "south africa": [
        { name: "African Violet", price: 2000 },
        { name: "Lion Plushie", price: 400 },
    ],
};

// Official country/city mapping
const OFFICIAL_DESTS = [
    { country: "China", city: "Beijing", key: "china" },
    { country: "Japan", city: "Tokyo", key: "japan" },
    { country: "Hawaii", city: "Honolulu", key: "hawaii" },
    { country: "Mexico", city: "Ciudad Juarez", key: "mexico" },
    { country: "Canada", city: "Toronto", key: "canada" },
    { country: "Cayman Islands", city: "George Town", key: "cayman" },
    { country: "Argentina", city: "Buenos Aires", key: "argentina" },
    { country: "South Africa", city: "Johannesburg", key: "south africa" },
    { country: "UAE", city: "Dubai", key: "uae" },
    { country: "Switzerland", city: "Zurich", key: "switzerland" },
    { country: "United Kingdom", city: "London", key: "england" },
];

// Loose fallback matcher
function resolveDestinationKeyLoose(name = "") {
    const n = name.toLowerCase();
    if (n.includes("mexico")) return "mexico";
    if (n.includes("cayman")) return "cayman";
    if (n.includes("canada")) return "canada";
    if (n.includes("hawaii")) return "hawaii";
    if (n.includes("london") || n.includes("uk") || n.includes("united kingdom") || n.includes("england")) return "england";
    if (n.includes("argentina") || n.includes("buenos")) return "argentina";
    if (n.includes("switzerland") || n.includes("swiss")) return "switzerland";
    if (n.includes("japan") || n.includes("tokyo")) return "japan";
    if (n.includes("china") || n.includes("beijing")) return "china";
    if (n.includes("uae") || n.includes("dubai")) return "uae";
    if (n.includes("south africa") || n.includes("cape town") || n.includes("johannesburg")) return "south africa";
    return null;
}
function resolveDestinationKeyFromDom(country, city) {
    const c = (country || "").trim();
    const ci = (city || "").trim();
    const hit = OFFICIAL_DESTS.find(
        (d) => d.country.toLowerCase() === c.toLowerCase() && d.city.toLowerCase() === ci.toLowerCase()
    );
    return hit ? hit.key : null;
}

function addInterval(id) { if (id) __intervals.push(id); }
function removeInterval(id) {
    const idx = __intervals.indexOf(id);
    if (idx !== -1) __intervals.splice(idx, 1);
}

// --- stall alert
function showFloatingAlert(msg, color = "orange") {
    let alertDiv = document.getElementById("script-alert-banner");
    if (!alertDiv) {
        alertDiv = document.createElement("div");
        alertDiv.id = "script-alert-banner";
        alertDiv.style.position = "fixed";
        alertDiv.style.top = "0";
        alertDiv.style.left = "50%";
        alertDiv.style.transform = "translateX(-50%)";
        alertDiv.style.zIndex = "99999";
        alertDiv.style.background = color;
        alertDiv.style.color = "black";
        alertDiv.style.fontWeight = "bold";
        alertDiv.style.padding = "8px 30px";
        alertDiv.style.borderRadius = "0 0 10px 10px";
        alertDiv.style.boxShadow = "0 4px 12px #000a";
        alertDiv.style.fontSize = "1.1em";
        document.body.appendChild(alertDiv);
    }
    alertDiv.textContent = msg;
    alertDiv.style.display = "block";
}
function hideFloatingAlert() {
    const alertDiv = document.getElementById("script-alert-banner");
    if (alertDiv) alertDiv.style.display = "none";
}

let notificationAsked = false;
function notifyUser(title, body) {
    try {
        if (typeof Notification === "undefined") return;
        if (Notification.permission === "granted") { new Notification(title, { body }); return; }
        if (Notification.permission === "default" && !notificationAsked) {
            notificationAsked = true;
            Notification.requestPermission().then((perm) => { if (perm === "granted") new Notification(title, { body }); }).catch(() => {});
            return;
        }
    } catch (e) {}
}

let lastDataUpdate = Date.now();
function markApiUpdate() { lastDataUpdate = Date.now(); }

function checkForCaptcha() {
    const isCaptcha = document.querySelector('.captcha-wrap');
    if (isCaptcha) {
        showFloatingAlert("⚠️ CAPTCHA detected! Script is paused.", "yellow");
        notifyUser("Torn Script Paused", "CAPTCHA detected - solve it to resume timers!");
    } else hideFloatingAlert();
    return isCaptcha;
}
const captchaInterval = setInterval(checkForCaptcha, 2000);
addInterval(captchaInterval);

// ---------- Tasks storage ----------
function getTasks() { try { return GM_getValue("customTasks", []) || []; } catch { return []; } }
function saveTasks(tasks) { try { GM_setValue("customTasks", tasks); } catch (e) {} }
function sec2str(t) {
    const d = Math.floor(t / 86400); t %= 86400;
    const h = ("0" + Math.floor(t / 3600)).slice(-2);
    const m = ("0" + Math.floor((t % 3600) / 60)).slice(-2);
    const s = ("0" + (t % 60)).slice(-2);
    return (d > 0 ? d + 'd ' : '') + h + ':' + m + ':' + s;
}
function getOcTimerSeconds() {
    const el = document.querySelector("#oc2Timer .countdown[data-seconds]");
    return el ? parseInt(el.getAttribute("data-seconds")) || 0 : 0;
}
function saveOcTimerFromDom() {
    const el = Array.from(document.querySelectorAll('span[aria-hidden="true"]'))
        .find(e => /^\d{2}:\d{2}:\d{2}:\d{2}$/.test(e.textContent.trim()));
    if (el) {
        const [days, hours, minutes, seconds] = el.textContent.trim().split(":").map(Number);
        const secs = days * 86400 + hours * 3600 + minutes * 60 + seconds;
        if (secs > 0) { try { GM_setValue("ocEnd", Date.now() + secs * 1000); } catch (e) {} return; }
    }
    const fallback = document.querySelector('span.countdown[data-seconds], span.countdown[data-end], .countdown[data-seconds], .countdown[data-end]');
    if (fallback) {
        let secs = 0;
        const ds = fallback.getAttribute('data-seconds');
        const de = fallback.getAttribute('data-end');
        if (ds) {
            const parsed = parseInt(ds, 10);
            if (!Number.isNaN(parsed)) secs = parsed;
        } else if (de) {
            const parsed = parseInt(de, 10);
            if (!Number.isNaN(parsed)) {
                if (parsed > 1e12) secs = Math.max(0, Math.floor((parsed - Date.now()) / 1000));
                else if (parsed > 1e9) secs = Math.max(0, Math.floor((parsed * 1000 - Date.now()) / 1000));
                else secs = Math.max(0, parsed);
            }
        }
        if (secs > 0) { try { GM_setValue("ocEnd", Date.now() + secs * 1000); } catch (e) {} return; }
    }
}
function getOcTimerFromStorage() {
    const ocEnd = GM_getValue("ocEnd", 0);
    return Math.max(0, Math.floor((ocEnd - Date.now()) / 1000));
}

// ---------- Styles ----------
const pulseStyle = document.createElement("style");
document.head.appendChild(pulseStyle);
const extraStyle = document.createElement("style");
extraStyle.innerHTML = `
#toggle-drug-msg:hover { text-shadow: 0 0 5px lime; }
@keyframes colorCycle {
    0%   { color: lime; text-shadow: 0 0 5px lime; }
    33%  { color: cyan; text-shadow: 0 0 5px cyan; }
    66%  { color: magenta; text-shadow: 0 0 5px magenta; }
    100% { color: lime; text-shadow: 0 0 5px lime; }
}
#drug-alert { animation: colorCycle 2s infinite linear; }
#cooldown-timer-drug > div:first-child > div:first-child:hover,
#cooldown-timer-medical > div:first-child > div:first-child:hover,
#cooldown-timer-booster > div:first-child > div:first-child:hover,
#hospital-timer > div:first-child > div:first-child:hover,
#education-timer > div:first-child > div:first-child:hover,
#bank-timer > div:first-child > div:first-child:hover,
#oc-timer-label:hover {
    text-decoration: underline;
    color: #90ee90;
    cursor: pointer;
}
#open-settings-panel:hover,
#add-task-btn:hover,
#remove-task-btn:hover,
#cdtimer-toggle:hover { text-shadow: 0 0 5px white; }
#external-toolbar-box,
#custom-task-panel,
#remove-task-panel,
#settings-panel {
    border: 1px solid #555 !important;
    box-sizing: border-box !important;
    background: rgba(0,0,0,0.75) !important;
    padding: 2px !important;
    border-radius: 6px !important;
}
#cdtimer-toggle:hover { text-shadow: 0 0 5px white; }
`;
document.head.appendChild(extraStyle);

const enforceMinimalBorders = document.createElement("style");
enforceMinimalBorders.innerHTML = `
div#external-toolbar-box,
div#custom-task-panel,
div#remove-task-panel,
div#settings-panel {
    border: 1px solid #555 !important;
    background: rgba(0,0,0,0.75) !important;
    padding: 2px !important;
    border-radius: 6px !important;
    box-shadow: none !important;
    box-sizing: border-box !important;
}
`;
document.head.appendChild(enforceMinimalBorders);

const reviveGlowStyle = document.createElement('style');
reviveGlowStyle.innerHTML = `
.revive-glow{position:relative;z-index:1;color:#9ef6ff!important;-webkit-font-smoothing:antialiased;cursor:pointer;isolation:isolate;text-shadow:0 0 6px rgba(158,246,255,.85),0 0 12px rgba(0,234,255,.55);transition:transform .12s ease,box-shadow .18s ease}
.revive-glow::before,.revive-glow::after{content:"";position:absolute;left:50%;top:50%;width:18px;height:18px;border-radius:50%;transform:translate(-50%,-50%) scale(1);pointer-events:none;z-index:-1;background:radial-gradient(circle,rgba(158,246,255,.85) 0%,rgba(0,234,255,.6) 30%,rgba(0,234,255,.28) 55%,transparent 75%);filter:blur(5px);opacity:.9}
.revive-glow::before{animation:ripple-inner 1.1s cubic-bezier(.22,.9,.35,1) infinite}
.revive-glow::after{animation:ripple-inner 1.1s cubic-bezier(.22,.9,.35,1) infinite;animation-delay:.55s}
.revive-glow.ring{box-shadow:0 0 8px rgba(0,234,255,.32),0 0 20px rgba(0,234,255,.18)}
.revive-glow.heartbeat{animation:heartbeat-scale 1.8s cubic-bezier(.2,.8,.2,1) infinite}
@keyframes ripple-inner{0%{transform:translate(-50%,-50%) scale(.7);opacity:1}40%{opacity:.65}100%{transform:translate(-50%,-50%) scale(2.6);opacity:0}}
@keyframes heartbeat-scale{0%{transform:scale(1)}6%{transform:scale(1.12)}12%{transform:scale(1)}20%{transform:scale(1.06)}26%{transform:scale(1)}100%{transform:scale(1)}
}
.revive-glow:active{transform:translateY(1px) scale(.995)}
`;
document.head.appendChild(reviveGlowStyle);

const style = document.createElement('style');
style.innerHTML = `
.flash-chain-row { animation: flash-row-cy-red 0.2s steps(1) infinite alternate; }
@keyframes flash-row-cy-red {
    from { background: rgba(0,255,255,0.22); color: #ff2222; }
    to   { background: rgba(255,0,0,0.22); color: #00ffff; }
}
`;
document.head.appendChild(style);

// ---------- UI Creation ----------
function addUI() {
    tornAPI = GM_getValue("tornApiKey", "");
    const timerBox = document.createElement("div");
    timerBox.id = "floating-timer-box";
    timerBox.style.overflow = "hidden";
    timerBox.style.position = "fixed";
    timerBox.style.top = GM_getValue("timerTop", "120px");
    timerBox.style.left = GM_getValue("timerLeft", "10px");
    timerBox.style.zIndex = "9999";
    timerBox.style.background = "rgba(0,0,0,0.75)";
    timerBox.style.border = tornAPI ? "1px solid #555" : "2px solid red";
    timerBox.style.padding = "10px";
    timerBox.style.borderRadius = "8px";
    timerBox.style.fontSize = "0.85rem";
    timerBox.style.fontFamily = "Arial, sans-serif";
    timerBox.style.color = "white";
    timerBox.style.width = "220px";
    timerBox.style.cursor = "move";

    const drugIcon = "💊";

    function updateDrugToggleButton() {
        const showDrug = GM_getValue("showDrugAlert", true);
        const toggleBtn = document.getElementById("toggle-drug-msg");
        if (toggleBtn) {
            toggleBtn.textContent = drugIcon;
            toggleBtn.style.color = showDrug ? "lime" : "#444";
            toggleBtn.style.filter = showDrug ? "none" : "grayscale(100%) brightness(0.6)";
            toggleBtn.style.cursor = "pointer";
        }
    }
    if (!tornAPI) {
        timerBox.innerHTML = `
            <div id="empty-box-drag"
                style="height: 60px; width: 100%; display: flex; align-items: center; justify-content: center; cursor: move; pointer-events: auto;">
                <button id="settings-btn"
                    title="Set API Key"
                    style="background: none; border: none; color: white; font-size: 20px; cursor: pointer;">🔑</button>
            </div>
        `;
    } else {
        timerBox.innerHTML = `
           <div id="cooldown-timer-drug"><div style="display:grid;grid-template-columns:1fr 1fr;border-bottom:1px solid #333;padding-bottom:2px;margin-bottom:4px;"><div style="color:orange;font-weight:bold;">Drug</div><div id="cooldown-timer-drug-value">–:–:–</div></div></div>
           <div id="cooldown-timer-medical"><div style="display:grid;grid-template-columns:1fr 1fr;border-bottom:1px solid #333;padding-bottom:2px;margin-bottom:4px;"><div style="color:lightblue;font-weight:bold;">Medical</div><div id="cooldown-timer-medical-value">–:–:–</div></div></div>
           <div id="cooldown-timer-booster"><div style="display:grid;grid-template-columns:1fr 1fr;border-bottom:1px solid #333;padding-bottom:2px;margin-bottom:4px;"><div style="color:violet;font-weight:bold;">Booster</div><div id="cooldown-timer-booster-value">–:–:–</div></div></div>
           <div id="hospital-timer" style="display:none;"><div style="display:grid;grid-template-columns:1fr 1fr;border-bottom:1px solid #333;padding-bottom:2px;margin-bottom:4px;"><div style="color:cyan;font-weight:bold;">Hospital</div><div id="hospital-timer-value"></div></div></div>
           <div id="education-timer"><div style="display:grid;grid-template-columns:1fr 1fr;border-bottom:1px solid #333;padding-bottom:2px;margin-bottom:4px;"><div style="color:white;font-weight:bold;">Education</div><div id="education-timer-value">–:–:–</div></div></div>
           <div id="bank-timer"><div style="display:grid;grid-template-columns:1fr 1fr;"><div style="color:lime;font-weight:bold;">Bank</div><div id="bank-timer-value">–:–:–</div></div></div>
           <hr style="margin:4px 0 2px 0;border:none;border-top:1px solid #333">
           <div id="oc-timer"><div style="display:grid;grid-template-columns:1fr 1fr;border-bottom:1px solid #333;padding-bottom:2px;margin-bottom:4px;"><div id="oc-timer-label" style="color:gold;font-weight:bold;cursor:pointer;" title="Open Faction Crimes Tab">OC</div><div id="oc-timer-value">–:–:–</div></div></div>
           <div id="chain-timer-row"><div style="display:grid;grid-template-columns:1fr 1fr;border-bottom:1px solid #900;padding-bottom:2px;margin-bottom:4px;"><div style="color:#ff4444;font-weight:bold;">Chain</div><div id="chain-timer-value" style="color:#ff4444;">–:–</div></div></div>
           <hr style="margin:6px 0;border:none;border-top:1px solid #444">
<div id="drug-alert" style="margin-top:8px;color:lime;font-weight:bold;display:none;">You can use drugs now!</div>
<div id="custom-task-container"></div>
<div id="custom-task-list" style="margin-top:4px;display:flex;flex-direction:column;gap:4px;"></div>
        `;
        function makeLabelClickable(id, title, url, clickTab = null) {
            const label = document.querySelector(`#${id} > div:first-child > div:first-child`);
            if (!label) return;
            label.style.cursor = "pointer";
            label.title = title;
            label.addEventListener("click", () => {
                window.open(url, "_blank");
                if (clickTab) { try { GM_setValue("autoClickTab", clickTab); } catch (e) {} }
            });
        }
        setTimeout(() => {
            makeLabelClickable("cooldown-timer-drug", "Open Inventory → Drugs", "https://www.torn.com/item.php#drugs-items", "drugs");
            makeLabelClickable("cooldown-timer-medical", "Open Inventory → Medical", "https://www.torn.com/item.php#medical-items", "medical");
            makeLabelClickable("cooldown-timer-booster", "Open Inventory → Boosters", "https://www.torn.com/item.php#boosters-items", "boosters");
            makeLabelClickable("education-timer", "Open Education Page", "https://www.torn.com/education.php");
            makeLabelClickable("bank-timer", "Open Bank Page", "https://www.torn.com/bank.php");
            makeLabelClickable("hospital-timer", "Open Hospital View", "https://www.torn.com/hospitalview.php");
            makeLabelClickable("oc-timer", "Open Faction View", "https://www.torn.com/factions.php?step=your#/tab=crimes");
            makeLabelClickable("chain-timer-row", "Open Chain Page", "https://www.torn.com/factions.php?step=your&type=1#/war/chain");
        }, 100);
    }

    document.addEventListener("click", (e) => {
        if (e.target && e.target.id === "open-settings-panel") {
            const panel = document.getElementById("settings-panel");
            if (panel) panel.style.display = panel.style.display === "none" ? "flex" : "none";
        }
        if (e.target && e.target.id === "settings-btn") {
            const newKey = prompt("Limited API key required:");
            if (newKey !== null && newKey.trim().length > 0) { GM_setValue("tornApiKey", newKey.trim()); location.reload(); }
        }
        if (e.target && e.target.id === "toggle-travel-panel") {
            const travelWin = document.getElementById("travel-window");
            if (travelWin) travelWin.style.display = travelWin.style.display === "none" ? "block" : "none";
        }
        if (e.target && e.target.id === "toggle-drug-msg") {
            const newState = !GM_getValue("showDrugAlert", true);
            GM_setValue("showDrugAlert", newState);
            updateDrugToggleButton();
            const drugAlert = document.getElementById("drug-alert");
            const drugSecs = secondsLeft("cooldownDrugEnd");
            if (!tornAPI || drugSecs > 0 || !newState) { if (drugAlert) drugAlert.style.display = "none"; }
            else { if (drugAlert) drugAlert.style.display = "block"; }
        }
    });

    const customTaskContainer = document.createElement("div");
    customTaskContainer.id = "custom-task-container";
    timerBox.appendChild(customTaskContainer);

    renderCustomTasks();
    document.body.appendChild(timerBox);

    function renderCustomTasks() {
        const tasks = getTasks();
        customTaskContainer.innerHTML = "";
        tasks.forEach((task, index) => {
            if (task.hidden) return;
            const row = document.createElement("div");
            row.style.display = "flex";
            row.style.alignItems = "center";
            row.style.gap = "6px";
            row.style.marginBottom = "2px";
            row.style.fontSize = "0.85rem";

            const input = document.createElement("input");
            input.autocomplete = "off";
            input.type = "text";
            input.value = task.label;
            input.style.cssText = "flex: 1; font-size: 0.85rem; background: transparent; color: white; border: none; border-bottom: 1px solid #555; outline: none; padding: 0 2px; min-width: 100px;";

            input.addEventListener("input", () => {
                const updated = getTasks();
                updated[index].label = input.value;
                saveTasks(updated);
            });
            input.addEventListener("mousedown", e => e.stopPropagation());
            input.addEventListener("click", e => e.stopPropagation());
            input.addEventListener("click", (e) => {
                const text = input.value.trim();
                const urlMatch = text.match(/https?:\/\/\S+/);
                if (e.ctrlKey && urlMatch) { e.stopPropagation(); window.location.href = urlMatch[0]; }
            });
            input.addEventListener("mousedown", (e) => {
                if (e.button === 1) {
                    const text = input.value.trim();
                    const urlMatch = text.match(/https?:\/\/\S+/);
                    if (urlMatch) { e.stopPropagation(); window.open(urlMatch[0], "_blank"); }
                }
            });

            row.appendChild(input);
            customTaskContainer.appendChild(row);
        });
    }

    // Task buttons panel
    const taskPanel = document.createElement("div");
    taskPanel.id = "custom-task-panel";
    taskPanel.style.position = "fixed";
    taskPanel.style.top = `calc(${GM_getValue("timerTop", "120px")} + 74px)`;
    taskPanel.style.left = `calc(${GM_getValue("timerLeft", "10px")} + 242px)`;
    taskPanel.style.zIndex = "9998";
    taskPanel.style.background = "rgba(0,0,0,0.75)";
    taskPanel.style.border = "1px solid #555";
    taskPanel.style.borderRadius = "6px";
    taskPanel.style.padding = "2px";
    taskPanel.style.width = "24px";
    taskPanel.style.display = "flex";
    taskPanel.style.flexDirection = "column";
    taskPanel.style.alignItems = "center";
    taskPanel.style.justifyContent = "center";
    taskPanel.style.gap = "2px";

    const addBtn = document.createElement("button");
    addBtn.id = "add-task-btn";
    addBtn.textContent = "➕";
    addBtn.title = "Add Task";
    addBtn.style.cssText = "background: none; border: none; color: white; font-size: 12px; cursor: pointer;";

    const removeBtn = document.createElement("button");
    removeBtn.id = "remove-task-btn";
    removeBtn.textContent = "➖";
    removeBtn.title = "Hide Task";
    removeBtn.style.cssText = "background: none; border: none; color: white; font-size: 12px; cursor: pointer; transform: translateY(-2px);";

    taskPanel.appendChild(addBtn);
    taskPanel.appendChild(removeBtn);
    document.body.appendChild(taskPanel);

    function renderTaskPanel() {
        const tasks = getTasks();
        const visibleCount = tasks.filter(t => !t.hidden).length;
        addBtn.disabled = visibleCount >= 20;
        addBtn.style.opacity = visibleCount >= 20 ? "0.4" : "1.0";
        addBtn.style.cursor = visibleCount >= 20 ? "default" : "pointer";
        removeBtn.disabled = visibleCount === 0;
        removeBtn.style.opacity = visibleCount === 0 ? "0.4" : "1.0";
        removeBtn.style.cursor = visibleCount === 0 ? "default" : "pointer";
    }
    addBtn.addEventListener("click", () => {
        const tasks = getTasks();
        const hiddenIndex = tasks.findIndex(t => t.hidden);
        if (hiddenIndex !== -1) tasks[hiddenIndex].hidden = false;
        else if (tasks.length < 20) tasks.push({ label: "", checked: false, hidden: false });
        saveTasks(tasks);
        renderCustomTasks();
        renderTaskPanel();
    });
    removeBtn.addEventListener("click", () => {
        const tasks = getTasks();
        const visibleTasks = tasks.filter(t => !t.hidden);
        if (visibleTasks.length > 0) {
            const lastVisibleIndex = tasks.map(t => !t.hidden).lastIndexOf(true);
            tasks[lastVisibleIndex].hidden = true;
            saveTasks(tasks);
            renderCustomTasks();
            renderTaskPanel();
        }
    });
    renderTaskPanel();

    // Toolbar
    const toolbarBox = document.createElement("div");
    toolbarBox.id = "external-toolbar-box";
    toolbarBox.style.position = "fixed";
    toolbarBox.style.top = `calc(${GM_getValue("timerTop", "120px")} + 0px)`;
    toolbarBox.style.left = `calc(${GM_getValue("timerLeft", "10px")} + 242px)`;
    toolbarBox.style.zIndex = "9998";
    toolbarBox.style.background = "rgba(0,0,0,0.75)";
    toolbarBox.style.border = "1px solid #555";
    toolbarBox.style.borderRadius = "6px";
    toolbarBox.style.padding = "2px";
    toolbarBox.style.width = "24px";
    toolbarBox.style.display = "flex";
    toolbarBox.style.flexDirection = "column";
    toolbarBox.style.alignItems = "center";
    toolbarBox.style.justifyContent = "center";
    toolbarBox.style.gap = "2px";

    const settingsToggleBtn = document.createElement("button");
    settingsToggleBtn.id = "open-settings-panel";
    settingsToggleBtn.title = "Open Settings";
    settingsToggleBtn.textContent = "⚙";
    settingsToggleBtn.style.cssText = "background: none; border: none; color: white; font-size: 13px; padding: 2px 0; cursor: pointer; width: 100%;";
    toolbarBox.appendChild(settingsToggleBtn);

    const toggleDrugBtn = document.createElement("button");
    toggleDrugBtn.id = "toggle-drug-msg";
    toggleDrugBtn.title = "Toggle drug alert";
    toggleDrugBtn.textContent = "💊";
    toggleDrugBtn.style.color = GM_getValue("showDrugAlert", true) ? "lime" : "gray";
    toggleDrugBtn.style.cssText = "background: none; border: none; font-size: 13px; padding: 2px 0; cursor: pointer; width: 100%;";
    toolbarBox.appendChild(toggleDrugBtn);

    let backupFactionRows = document.getElementById('backup-faction-rows');
    if (!backupFactionRows) {
        backupFactionRows = document.createElement('div');
        backupFactionRows.id = 'backup-faction-rows';
        backupFactionRows.style.display = 'none';
        document.body.appendChild(backupFactionRows);
    }
    const hideUnrevivablesBtn = document.createElement("button");
    hideUnrevivablesBtn.textContent = "⚕️";
    hideUnrevivablesBtn.style.cssText =
        "background: none; border: none; font-size: 13px; padding: 2px 0; cursor: pointer; color: white; width: 100%;";

    const reviveFilterActive = GM_getValue("reviveFilterActive", false);
    hideUnrevivablesBtn.classList.toggle("revive-glow", reviveFilterActive);
    hideUnrevivablesBtn.title = reviveFilterActive ?
        "Show all faction members (disable revive filter)" :
        "Hide faction members with revives disabled";

    hideUnrevivablesBtn.addEventListener("click", async () => {
        const active = !GM_getValue("reviveFilterActive", false);
        GM_setValue("reviveFilterActive", active);
        hideUnrevivablesBtn.textContent = "⚕️";
        hideUnrevivablesBtn.classList.toggle("revive-glow", active);
        hideUnrevivablesBtn.title = active ?
            "Show all faction members (disable revive filter)" :
            "Hide faction members with revives disabled";
        const factionId = getFactionId();
        const table = document.querySelector('.table-body');

        if (active) {
            if (backupFactionRows.innerHTML.trim() === "" && table) backupFactionRows.innerHTML = table.innerHTML;
            hideUnrevivablesBtn.textContent = "⏳";
            hideUnrevivablesBtn.classList.remove("revive-glow");
            try {
                const revivableIds = await getRevivableFactionMembers(factionId);
                applyReviveFilter(revivableIds);
            } catch (e) {
                showFloatingAlert("Failed to load faction revive data.", "orange");
                setTimeout(hideFloatingAlert, 5000);
            } finally {
                hideUnrevivablesBtn.textContent = "⚕️";
                hideUnrevivablesBtn.classList.add("revive-glow");
            }
        } else {
            if (table && backupFactionRows.innerHTML.trim() !== "") table.innerHTML = backupFactionRows.innerHTML;
        }
    });
    toolbarBox.appendChild(hideUnrevivablesBtn);

    if (GM_getValue("reviveFilterActive", false)) {
        const factionId = getFactionId();
        const waitForTableAndApplyFilter = () => {
            const table = document.querySelector('.table-body');
            if (table && table.children.length > 0) {
                if (backupFactionRows.innerHTML.trim() === "") backupFactionRows.innerHTML = table.innerHTML;
                hideUnrevivablesBtn.textContent = "⏳";
                getRevivableFactionMembers(factionId).then(revivableIds => {
                    applyReviveFilter(revivableIds);
                    hideUnrevivablesBtn.textContent = "⚕️";
                    hideUnrevivablesBtn.classList.add("revive-glow");
                }).catch(() => {
                    showFloatingAlert("Failed to load faction revive data.", "orange");
                    setTimeout(hideFloatingAlert, 5000);
                    hideUnrevivablesBtn.textContent = "⚕️";
                });
                return true;
            }
            return false;
        };
        if (!waitForTableAndApplyFilter()) {
            let tries = 0;
            const maxTries = 25;
            const intervalId = setInterval(() => {
                tries++;
                if (waitForTableAndApplyFilter() || tries >= maxTries) {
                    clearInterval(intervalId);
                    removeInterval(intervalId);
                }
            }, 200);
            addInterval(intervalId);
        }
    }

    const apiCooldownBtn = document.createElement("button");
    apiCooldownBtn.id = "auto-api-cooldown-btn";
    apiCooldownBtn.title = "Manual API refresh";
    apiCooldownBtn.style.cssText = `
    background: none;
    border: none;
    color: #ffe55e;
    font-size: 12px;
    padding: 1px 0 2px 0;
    cursor: pointer;
    width: 100%;
    min-width: 24px;
    text-align: center;
    opacity: 1.0;
    font-family: monospace;
    margin-top: 5px;
`;

    let nextManualApiCallTime = 0;
    const API_INTERVAL = 2000;

    function updateApiCooldownBtn() {
        let until = Math.ceil((nextManualApiCallTime - Date.now()) / 1000);
        if (until < 0) until = 0;
        apiCooldownBtn.innerHTML = until === 0 ? `<span style="font-size:1.2em;">✔️</span>` : `${until}<span style="font-size:8px;">s</span>`;
        apiCooldownBtn.disabled = until > 0;
        apiCooldownBtn.style.opacity = until > 0 ? "0.7" : "1.0";
        apiCooldownBtn.style.cursor = until > 0 ? "not-allowed" : "pointer";
    }
    const apiCooldownInterval = setInterval(updateApiCooldownBtn, 500);
    addInterval(apiCooldownInterval);
    apiCooldownBtn.addEventListener("click", () => {
        if (Date.now() < nextManualApiCallTime) return;
        getData();
        nextManualApiCallTime = Date.now() + API_INTERVAL;
        updateApiCooldownBtn();

        const intervalSec = GM_getValue("autoApiIntervalSec", 22);
        const nextAuto = Date.now() + intervalSec * 1000;
        try { GM_setValue("autoApiNextCall", nextAuto); } catch (e) {}
        if (GM_getValue("autoApiEnabled", false)) {
            if (autoApiInterval) { clearInterval(autoApiInterval); removeInterval(autoApiInterval); autoApiInterval = null; }
            startAutoApiRefresh();
        }
    });

    document.body.appendChild(toolbarBox);

    // Travel window
    if (window.location.pathname === "/page.php" && window.location.search.includes("sid=travel")) {
        const baseTopPx = parseInt(GM_getValue("timerTop", "120px"), 10) || 120;
        const baseLeftPx = parseInt(GM_getValue("timerLeft", "10px"), 10) || 10;
        const defaultTravelTop = `${baseTopPx + 260}px`;
        const defaultTravelLeft = `${baseLeftPx}px`;

        const travelWindow = document.createElement("div");
        travelWindow.id = "travel-window";
        travelWindow.style.position = "fixed";
        travelWindow.style.top = GM_getValue("travelTop", defaultTravelTop);
        travelWindow.style.left = GM_getValue("travelLeft", defaultTravelLeft);
        travelWindow.style.zIndex = "9999";
        travelWindow.style.minWidth = "240px";
        travelWindow.style.width = "fit-content";
        travelWindow.style.height = "auto";
        travelWindow.style.maxWidth = "90vw";
        travelWindow.style.padding = "10px";
        travelWindow.style.backgroundColor = "#222";
        travelWindow.style.color = "#fff";
        travelWindow.style.border = "1px solid #555";
        travelWindow.style.borderRadius = "10px";
        travelWindow.style.fontSize = "13px";
        travelWindow.style.boxShadow = "0 0 6px rgba(0,0,0,0.4)";
        travelWindow.style.userSelect = "none";
        travelWindow.style.display = "none";
        travelWindow.style.flexDirection = "column";
        travelWindow.style.alignItems = "center";
        travelWindow.style.justifyContent = "center";
        travelWindow.style.textAlign = "left";
        travelWindow.innerHTML = `<div></div>`;
        document.body.appendChild(travelWindow);
    }
    initTravelWindowDrag();

    // Settings panel
    const settingsPanel = document.createElement("div");
    settingsPanel.id = "settings-panel";
    settingsPanel.style.position = "fixed";
    settingsPanel.style.top = `calc(${GM_getValue("timerTop", "120px")} + 0px)`;
    settingsPanel.style.left = `calc(${GM_getValue("timerLeft", "10px")} + 266px)`;
    settingsPanel.style.zIndex = "9998";
    settingsPanel.style.background = "rgba(0,0,0,0.75)";
    settingsPanel.style.border = "1px solid #555";
    settingsPanel.style.borderRadius = "6px";
    settingsPanel.style.padding = "6px";
    settingsPanel.style.fontSize = "0.8rem";
    settingsPanel.style.color = "white";
    settingsPanel.style.display = "none";
    settingsPanel.style.flexDirection = "column";
    settingsPanel.style.gap = "3px";
    settingsPanel.style.width = "125px";

    const apiBtn = document.createElement("button");
    apiBtn.textContent = "🔑";
    apiBtn.title = "Set API Key";
    apiBtn.style.cssText = "background: none; border: none; color: white; font-size: 0.9rem; cursor: pointer; padding: 0; margin-left: 6px;";
    apiBtn.addEventListener("click", () => {
        const newKey = prompt("Limited API key required:");
        if (newKey !== null && newKey.trim().length > 0) { GM_setValue("tornApiKey", newKey.trim()); location.reload(); }
    });
    const resetApiBtn = document.createElement("button");
    resetApiBtn.textContent = "🗑️";
    resetApiBtn.title = "Remove API Key";
    resetApiBtn.style.cssText = "background: none; border: none; color: #e55; font-size: 0.9rem; cursor: pointer; padding: 0; margin-left: 3px;";
    resetApiBtn.addEventListener("click", () => {
        if (confirm("Are you sure you want to delete your API key? This will disable script features until you set a new one.")) {
            GM_setValue("tornApiKey", ""); location.reload();
        }
    });
    const apiContainer = document.createElement("div");
    apiContainer.style.display = "grid";
    apiContainer.style.gridTemplateColumns = "1fr 1fr";
    apiContainer.style.gridTemplateRows = "1fr";
    apiContainer.style.gap = "4px";
    apiContainer.style.justifyItems = "center";
    apiContainer.style.alignItems = "center";
    apiContainer.appendChild(apiBtn);
    apiContainer.appendChild(resetApiBtn);

    const cooldownToggle = document.createElement("label");
    cooldownToggle.style.display = "flex";
    cooldownToggle.style.alignItems = "center";
    cooldownToggle.style.gap = "6px";
    const cooldownCheckbox = document.createElement("input");
    cooldownCheckbox.type = "checkbox";
    cooldownCheckbox.checked = GM_getValue("showAllCooldowns", true);
    cooldownCheckbox.addEventListener("change", () => {
        GM_setValue("showAllCooldowns", cooldownCheckbox.checked);
        cooldownLabel.textContent = cooldownCheckbox.checked ? "ON" : "OFF";
        cooldownLabel.style.color = cooldownCheckbox.checked ? "lime" : "#666";
    });
    const cooldownText = document.createElement("span");
    cooldownText.textContent = "Timers";
    cooldownText.style.flex = "1";
    const cooldownLabel = document.createElement("span");
    cooldownLabel.textContent = cooldownCheckbox.checked ? "ON" : "OFF";
    cooldownLabel.style.color = cooldownCheckbox.checked ? "lime" : "#666";
    cooldownLabel.style.fontWeight = "bold";
    cooldownLabel.style.marginLeft = "auto";
    cooldownLabel.style.minWidth = "24px";
    cooldownLabel.style.textAlign = "right";
    cooldownToggle.append(cooldownCheckbox, cooldownText, cooldownLabel);

    settingsPanel.appendChild(apiContainer);
    settingsPanel.appendChild(cooldownToggle);

    const autoApiToggle = document.createElement("label");
    autoApiToggle.style.display = "flex";
    autoApiToggle.style.alignItems = "center";
    autoApiToggle.style.gap = "6px";
    const autoApiCheckbox = document.createElement("input");
    autoApiCheckbox.type = "checkbox";
    autoApiCheckbox.checked = GM_getValue("autoApiEnabled", false);
    autoApiCheckbox.addEventListener("change", () => {
        GM_setValue("autoApiEnabled", autoApiCheckbox.checked);
        autoApiLabel.textContent = autoApiCheckbox.checked ? "ON" : "OFF";
        autoApiLabel.style.color = autoApiCheckbox.checked ? "lime" : "#666";
        autoApiCountdownRow.style.display = autoApiCheckbox.checked ? "block" : "none";
        if (autoApiCheckbox.checked) startAutoApiRefresh();
        else stopAutoApiRefresh();
    });
    const autoApiText = document.createElement("span");
    autoApiText.textContent = "Auto API";
    autoApiText.style.flex = "1";
    const autoApiLabel = document.createElement("span");
    autoApiLabel.textContent = autoApiCheckbox.checked ? "ON" : "OFF";
    autoApiLabel.style.color = autoApiCheckbox.checked ? "lime" : "#666";
    autoApiLabel.style.fontWeight = "bold";
    autoApiLabel.style.marginLeft = "auto";
    autoApiLabel.style.minWidth = "24px";
    autoApiLabel.style.textAlign = "right";
    autoApiToggle.append(autoApiCheckbox, autoApiText, autoApiLabel);
    settingsPanel.appendChild(autoApiToggle);

    const autoApiIntervalWrap = document.createElement("div");
    autoApiIntervalWrap.style.display = "flex";
    autoApiIntervalWrap.style.alignItems = "center";
    autoApiIntervalWrap.style.gap = "6px";
    const autoApiIntervalLabel = document.createElement("span");
    autoApiIntervalLabel.textContent = "Interval:";
    autoApiIntervalLabel.style.flex = "none";
    const autoApiIntervalInput = document.createElement("input");
    autoApiIntervalInput.type = "number";
    autoApiIntervalInput.min = 10;
    autoApiIntervalInput.max = 90;
    autoApiIntervalInput.value = GM_getValue("autoApiIntervalSec", 22);
    autoApiIntervalInput.style.width = "38px";
    autoApiIntervalInput.style.background = "#222";
    autoApiIntervalInput.style.color = "#efe";
    autoApiIntervalInput.style.border = "1px solid #444";
    autoApiIntervalInput.style.borderRadius = "4px";
    autoApiIntervalInput.style.fontSize = "0.95em";
    autoApiIntervalInput.style.padding = "1px 4px";
    autoApiIntervalInput.addEventListener("change", () => {
        let val = parseInt(autoApiIntervalInput.value, 10);
        if (isNaN(val) || val < 10) val = 10;
        if (val > 90) val = 90;
        autoApiIntervalInput.value = val;
        GM_setValue("autoApiIntervalSec", val);
        resetAutoApiCountdown();
    });
    const autoApiCountdown = document.createElement("span");
    autoApiCountdown.id = "auto-api-countdown";
    autoApiCountdown.textContent = "";

    autoApiIntervalWrap.append(autoApiIntervalLabel, autoApiIntervalInput, document.createTextNode("s"));
    settingsPanel.appendChild(autoApiIntervalWrap);
    const autoApiCountdownRow = document.createElement("div");
    autoApiCountdownRow.id = "auto-api-countdown-row";
    autoApiCountdownRow.style.fontSize = '0.95em';
    autoApiCountdownRow.style.color = '#bbe';
    autoApiCountdownRow.style.marginLeft = '36px';
    autoApiCountdownRow.appendChild(autoApiCountdown);
    settingsPanel.appendChild(autoApiCountdownRow);
    settingsPanel.appendChild(apiCooldownBtn);

    document.body.appendChild(settingsPanel);

    updateDrugToggleButton();

    // Drag timers/settings/toolbars
    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;
    timerBox.addEventListener("mousedown", (e) => {
        if (["INPUT", "BUTTON"].includes(e.target.tagName)) return;
        isDragging = true;
        offsetX = e.clientX - timerBox.getBoundingClientRect().left;
        offsetY = e.clientY - timerBox.getBoundingClientRect().top;
        e.preventDefault();
    });
    document.addEventListener("mousemove", (e) => {
        if (isDragging) {
            const newLeft = e.clientX - offsetX;
            const newTop = e.clientY - offsetY;
            timerBox.style.left = `${newLeft}px`;
            timerBox.style.top = `${newTop}px`;
            settingsPanel.style.left = `${newLeft + 266}px`;
            settingsPanel.style.top = `${newTop}px`;
            toolbarBox.style.left = `${newLeft + 242}px`;
            toolbarBox.style.top = `${newTop}px`;
            taskPanel.style.left = `${newLeft + 242}px`;
            taskPanel.style.top = `${newTop + 74}px`;
        }
    });
    document.addEventListener("mouseup", () => {
        if (isDragging) {
            try {
                GM_setValue("timerLeft", timerBox.style.left);
                GM_setValue("timerTop", timerBox.style.top);
                const travelWin = document.getElementById("travel-window");
                if (travelWin) {
                    GM_setValue("travelTop", travelWin.style.top);
                    GM_setValue("travelLeft", travelWin.style.left);
                }
            } catch (e) {}
        }
        isDragging = false;
    });
}

function initTravelWindowDrag() {
    const travelWin = document.getElementById("travel-window");
    if (!travelWin) return;
    let dragging = false;
    let offsetX = 0;
    let offsetY = 0;
    travelWin.addEventListener("mousedown", (e) => {
        if (["INPUT","BUTTON"].includes(e.target.tagName)) return;
        dragging = true;
        offsetX = e.clientX - travelWin.offsetLeft;
        offsetY = e.clientY - travelWin.offsetTop;
        e.preventDefault();
    });
    document.addEventListener("mousemove", (e) => {
        if (!dragging) return;
        travelWin.style.left = (e.clientX - offsetX) + "px";
        travelWin.style.top = (e.clientY - offsetY) + "px";
    });
    document.addEventListener("mouseup", () => {
        if (dragging) {
            try {
                GM_setValue("travelLeft", travelWin.style.left);
                GM_setValue("travelTop", travelWin.style.top);
            } catch (e) {}
        }
        dragging = false;
    });
}

// ---------- API fetch ----------
async function getData(callback) {
    tornAPI = GM_getValue("tornApiKey", "");
    if (!tornAPI) return;
    const url = `https://api.torn.com/user/?selections=cooldowns,profile,education,money,bars&key=${tornAPI}`;
    try {
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (data.error) throw new Error(data.error.error || "API error");

        energy_current = parseInt(data.energy.current);
        energy_max     = parseInt(data.energy.maximum);
        nerve_current  = parseInt(data.nerve.current);
        nerve_max      = parseInt(data.nerve.maximum);
        markApiUpdate();

        try { GM_setValue("cooldownDrugEnd",    Date.now() + parseInt(data.cooldowns.drug || 0)    * 1000); } catch(e){}
        try { GM_setValue("cooldownMedicalEnd", Date.now() + parseInt(data.cooldowns.medical || 0) * 1000); } catch(e){}
        try { GM_setValue("cooldownBoosterEnd", Date.now() + parseInt(data.cooldowns.booster || 0) * 1000); } catch(e){}

        try {
            const hospital_timer_str = data.basicicons?.icon15?.split(" - ")[2]?.trim()?.split(":");
            if (hospital_timer_str && hospital_timer_str.length === 3) {
                const h = parseInt(hospital_timer_str[0]) || 0;
                const m = parseInt(hospital_timer_str[1]) || 0;
                const s = parseInt(hospital_timer_str[2]) || 0;
                const total = h * 3600 + m * 60 + s;
                GM_setValue("hospitalEnd", Date.now() + total * 1000);
            } else GM_setValue("hospitalEnd", 0);
        } catch { GM_setValue("hospitalEnd", 0); }

        try {
            const ed = parseInt(data.education_timeleft || 0);
            GM_setValue("educationEnd", Date.now() + ed * 1000);
        } catch {}

        try {
            const b = parseInt(data.city_bank?.time_left || 0);
            GM_setValue("bankEnd", Date.now() + b * 1000);
        } catch {}

        const showDrug = GM_getValue("showDrugAlert", true);
        const drugAlert = document.getElementById("drug-alert");
        if (drugAlert) {
            const drugSecs = secondsLeft("cooldownDrugEnd");
            drugAlert.style.display = (!tornAPI || drugSecs > 0 || !showDrug) ? "none" : "block";
        }
        setApiStatus(true);
        if (typeof callback === "function") callback();
    } catch (err) {
        console.warn("[Timers & Reminders] API error:", err);
        setApiStatus(false, err.message || "");
    }
}

function setApiStatus(ok, msg = "") {
    const btn = document.getElementById("auto-api-cooldown-btn");
    if (!btn) return;
    if (ok) { btn.style.border = "1px solid #444"; btn.title = "API OK"; }
    else { btn.style.border = "1px solid red"; btn.title = "API ERROR: " + msg; }
}
function secondsLeft(keyName) {
    const end = GM_getValue(keyName, 0);
    if (!end) return 0;
    const diff = end - Date.now();
    return diff > 0 ? Math.floor(diff / 1000) : 0;
}
function formatDash(secs) { return secs > 0 ? sec2str(secs) : "–:–:–"; }
function updateCooldownRow(containerId, secs, highlightThresholdSeconds = 3600, highlightColor = "#90ee90") {
    const wrap = document.getElementById(containerId);
    const val = document.getElementById(containerId + "-value");
    if (!wrap || !val) return;
    const show = GM_getValue("showAllCooldowns", true);
    wrap.style.display = show ? "block" : "none";
    val.textContent = formatDash(secs);
    val.style.color = (secs > 0 && secs < highlightThresholdSeconds) ? highlightColor : "white";
}

// ---------- Render data ----------
function renderData() {
    const energyFull = energy_current >= energy_max;
    const nerveFull = nerve_current >= nerve_max;
    if (document.querySelector(".captcha-wrap")) return;

    const timerBox = document.getElementById("floating-timer-box");
    if (timerBox) {
        timerBox.classList.toggle("pulse-energy", energyFull);
        timerBox.classList.toggle("pulse-nerve", nerveFull);
    }
    if (!tornAPI) return;

    const drugSecs      = secondsLeft("cooldownDrugEnd");
    const medicalSecs   = secondsLeft("cooldownMedicalEnd");
    const boosterSecs   = secondsLeft("cooldownBoosterEnd");
    const educationSecs = secondsLeft("educationEnd");
    const bankSecs      = secondsLeft("bankEnd");
    const hospitalSecs  = secondsLeft("hospitalEnd");
    const ocSecs        = getOcTimerFromStorage();

    updateCooldownRow("cooldown-timer-drug",    drugSecs);
    updateCooldownRow("cooldown-timer-medical", medicalSecs);
    updateCooldownRow("cooldown-timer-booster", boosterSecs);
    updateCooldownRow("education-timer",        educationSecs);
    updateCooldownRow("bank-timer",             bankSecs);

    (function renderHospital() {
        const wrap = document.getElementById("hospital-timer");
        const val  = document.getElementById("hospital-timer-value");
        if (!wrap || !val) return;
        if (hospitalSecs > 0) {
            wrap.style.display = "block";
            val.textContent = sec2str(hospitalSecs);
            val.style.color = hospitalSecs < 3600 ? "#90ee90" : "white";
        } else wrap.style.display = "none";
    })();

    (function renderOC() {
        const wrap = document.getElementById("oc-timer");
        const val  = document.getElementById("oc-timer-value");
        if (!wrap || !val) return;
        const show = GM_getValue("showAllCooldowns", true);
        wrap.style.display = show ? "block" : "none";
        if (ocSecs > 0) { val.textContent = sec2str(ocSecs); val.style.color  = ocSecs < 3600 ? "#FFD700" : "white"; }
        else { val.textContent = "–:–:–"; val.style.color = "white"; }
        const chainRow = document.getElementById("chain-timer-row");
        if (chainRow) chainRow.style.display = show ? "block" : "none";
    })();

    const showDrug = GM_getValue("showDrugAlert", true);
    const drugAlert = document.getElementById("drug-alert");
    const drugReady = drugSecs === 0;
    if (drugReady && showDrug && document.hidden) {
        if (!window.countdownBlinkInterval) {
            let blink = true;
            window.countdownBlinkInterval = setInterval(() => {
                document.title = blink ? "💊 Drug Ready!" : originalTitle;
                blink = !blink;
            }, 500);
            addInterval(window.countdownBlinkInterval);
        }
    } else {
        if (window.countdownBlinkInterval) {
            clearInterval(window.countdownBlinkInterval);
            removeInterval(window.countdownBlinkInterval);
            window.countdownBlinkInterval = null;
            document.title = originalTitle;
        }
    }
    if (drugReady && showDrug) { showFloatingAlert("💊 You can use drugs now!", "red"); notifyUser("Drug Cooldown Ready!", "You can use drugs now!"); }
    else {
        const alertDiv = document.getElementById("script-alert-banner");
        if (alertDiv && alertDiv.textContent === "💊 You can use drugs now!") hideFloatingAlert();
    }
}

// ---------- Auto API helpers ----------
function resetAutoApiCountdown(forceNow = false) {
    const interval = GM_getValue("autoApiIntervalSec", 22);
    let next;
    if (forceNow || !GM_getValue("autoApiNextCall")) next = Date.now() + interval * 1000;
    else next = GM_getValue("autoApiNextCall");
    GM_setValue("autoApiNextCall", next);
}
function getCountdownSeconds() {
    const next = GM_getValue("autoApiNextCall", 0);
    return Math.max(0, Math.ceil((next - Date.now()) / 1000));
}
function startAutoApiRefresh() {
    if (autoApiInterval) { clearInterval(autoApiInterval); removeInterval(autoApiInterval); autoApiInterval = null; }
    if (!GM_getValue("autoApiNextCall") || GM_getValue("autoApiNextCall") < Date.now()) resetAutoApiCountdown(true);
    const row = document.getElementById("auto-api-countdown-row");
    if (row) row.style.display = "block";
    autoApiInterval = setInterval(() => {
        let secs = getCountdownSeconds();
        const el = document.getElementById("auto-api-countdown");
        if (el) el.textContent = `(Next: ${secs}s)`;
        if (secs <= 0) {
            getData();
            GM_setValue("autoApiNextCall", Date.now() + GM_getValue("autoApiIntervalSec", 22) * 1000);
        }
    }, 1000);
    addInterval(autoApiInterval);
    if (getCountdownSeconds() <= 0) {
        getData();
        GM_setValue("autoApiNextCall", Date.now() + GM_getValue("autoApiIntervalSec", 22) * 1000);
    }
}
function stopAutoApiRefresh() {
    if (autoApiInterval) { clearInterval(autoApiInterval); removeInterval(autoApiInterval); autoApiInterval = null; }
    const row = document.getElementById("auto-api-countdown-row");
    if (row) row.style.display = "none";
    const el = document.getElementById("auto-api-countdown");
    if (el) el.textContent = "";
}

// ---------- Init UI and start ----------
addUI();
if (GM_getValue("autoApiEnabled", false)) startAutoApiRefresh();

// ---------- Main tick and page load ----------
$(window).on("load", () => {
    const isCaptchaPage = document.title.includes("Just a moment...") || document.body.innerText.includes("Prebieha overovanie");
    if (isCaptchaPage) { console.warn("Cloudflare page detected. Pausing script."); return; }
    if (window.location.href.includes("factions.php?step=your") && window.location.href.includes("tab=crimes")) {
        setTimeout(saveOcTimerFromDom, 2000);
    }
    function mainTick() {
        renderData();
        if (typeof window.updateChainTimerFromDom === "function") window.updateChainTimerFromDom();
    }
    const mainTickInterval = setInterval(mainTick, 1000);
    addInterval(mainTickInterval);
});

document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
        if (window.countdownBlinkInterval) {
            clearInterval(window.countdownBlinkInterval);
            removeInterval(window.countdownBlinkInterval);
            window.countdownBlinkInterval = null;
        }
        document.title = originalTitle;
    }
});

document.addEventListener("keydown", (e) => {
    if (e.shiftKey && e.key === "R") {
        GM_setValue("timerTop", "120px");
        GM_setValue("timerLeft", "10px");
        const box = document.getElementById("floating-timer-box");
        const toolbar = document.getElementById("external-toolbar-box");
        const taskPanel = document.getElementById("custom-task-panel");
        const settingsPanel = document.getElementById("settings-panel");
        const baseTop = 120;
        const baseLeft = 10;
        const travelDefaultTop = `${baseTop + 260}px`;
        const travelDefaultLeft = `${baseLeft}px`;
        if (box) { box.style.top = "120px"; box.style.left = "10px"; }
        if (toolbar) { toolbar.style.top = "120px"; toolbar.style.left = "252px"; }
        if (taskPanel) { taskPanel.style.top = "194px"; taskPanel.style.left = "252px"; }
        if (settingsPanel) { settingsPanel.style.top = "120px"; settingsPanel.style.left = "300px"; settingsPanel.style.display = "none"; }
        const travelWin = document.getElementById("travel-window");
        if (travelWin) { travelWin.style.top = travelDefaultTop; travelWin.style.left = travelDefaultLeft; }
    }
});

if (window.location.href.includes("item.php") && GM_getValue("autoClickTab")) {
    const tab = GM_getValue("autoClickTab");
    GM_setValue("autoClickTab", null);
    setTimeout(() => {
        const tabBtn = document.querySelector(`[data-tab="${tab}"]`);
        if (tabBtn) tabBtn.click();
    }, 1000);
}

function getFactionId() {
    const url = window.location.href;
    const matchProfile = url.match(/factions\.php\?step=profile\/(\d+)/);
    const matchOwnFaction = url.includes("factions.php?step=your") ? document.querySelector("a[href*='/ranked/']")?.href?.split("/ranked/")[1] : null;
    let id =
        document.querySelector('.view-wars')?.href?.split("ranked/")[1] ||
        matchOwnFaction ||
        document.querySelector('#tt-faction-id')?.innerText?.replace(/\D/g, '') ||
        (matchProfile && matchProfile[1]);
    return id;
}
async function getRevivableFactionMembers(factionId) {
    try {
        const res = await fetch(`https://api.torn.com/v2/faction/${factionId}/members?key=${GM_getValue("tornApiKey", "")}&striptags=true`);
        const data = await res.json();
        return data.members ? data.members.filter(m => m.is_revivable).map(m => m.id) : [];
    } catch (e) {
        console.error("Error fetching revivable members:", e);
        throw e;
    }
}
function applyReviveFilter(revivableIds) {
    document.querySelectorAll('.table-body > li').forEach(row => {
        const userHref = row.querySelector('a[href^="/profiles.php?XID="]')?.getAttribute('href');
        const xid = userHref ? new URLSearchParams(userHref.split('?')[1]).get('XID') : null;
        const nextRow = row.nextElementSibling?.classList.contains("tt-stats-estimate") ? row.nextElementSibling : null;
        if (xid && !revivableIds.includes(+xid)) { row.remove(); nextRow?.remove(); }
    });
}

// ---------- Chain timer ----------
let chainTimerEndStored = GM_getValue("chainTimerEnd", 0);
(function integrateTitleTimers() {
    const TEXT_TRAVEL = " Traveling | TORN";
    const TEXT_HOSPITAL = " Hospital | TORN";
    const TEXT_RACEWAY = " Racing | TORN";
    const TEXT_CHAIN = " Chain | TORN";
    const ID_HOSPITAL = 'theCounter';
    const ID_RACEWAY = 'infoSpot';
    const SPAN_CHAIN_LENGTH = 'p.bar-value___uxnah';
    const SPAN_CHAIN_TIME = "p.bar-timeleft___B9RGV";
    const URL_HOSPITAL = "https://www.torn.com/hospitalview.php";
    const URL_RACEWAY = "https://www.torn.com/loader.php?sid=racing";
    const URL_CHAIN = "https://www.torn.com/factions.php";
    const URL_TRAVEL = "https://www.torn.com/page.php?sid=travel";

    function observeElement(selector, updateFn, retry = 500) {
        const el = typeof selector === "string" ? document.querySelector(selector) : selector;
        if (!el) return setTimeout(() => observeElement(selector, updateFn, retry), retry);
        const observer = new MutationObserver(updateFn);
        observer.observe(el, { childList: true, subtree: true, characterData: true });
        __observers.push(observer);
        updateFn();
    }

    function isCurrentlyFlying() {
        const root = document.querySelector("#travel-root");
        const txt = (root?.innerText || "").toLowerCase();
        const hasCancel = Array.from(document.querySelectorAll("#travel-root button, #travel-root a")).some(el => /cancel/i.test(el.textContent));
        const hasKeywords = /arriving|returning|landing|in flight|en route|traveling|travelling|on route|on board/.test(txt);
        return hasCancel || hasKeywords;
    }

    function getCountryCityFromDom() {
        const countryEl = document.querySelector("#travel-root .country__wBPip") || document.querySelector("#travel-root [class*='country']");
        const cityEl = countryEl?.nextElementSibling;
        const country = countryEl?.textContent?.trim() || "";
        const city = cityEl?.textContent?.replace(/\u00A0/g, ' ').replace(/^\s*-\s*/, '').trim() || "";
        return { country, city };
    }

    function getSelectedDestinationName() {
        const { country, city } = getCountryCityFromDom();
        if (country || city) return `${country}${city ? " - " + city : ""}`;
        const candidates = [
            '#travel-root button[aria-pressed="true"]',
            '#travel-root .selected',
            '#travel-root .active',
            '#travel-root [class*="selected"]',
            '#travel-root [class*="active"]'
        ];
        for (const sel of candidates) {
            const el = document.querySelector(sel);
            if (el) {
                const txt = el.querySelector('[class*="title"], [class*="name"]')?.textContent || el.textContent;
                if (txt) return txt.trim();
            }
        }
        return "";
    }

          if (window.location.href.startsWith(URL_TRAVEL)) {
        setTimeout(() => {
            const spanTime = document.querySelector("#travel-root time span[aria-hidden='true']");
            if (spanTime) {
                const timeStr = spanTime.textContent.trim();
                const parts = timeStr.split(":").map(Number);
                if (parts.length >= 2 && !parts.some(Number.isNaN)) {
                    const totalSecondsOneWay = (parts[0] * 60 + parts[1]) * 60 + (parts[2] || 0);
                    try { GM_setValue("flightTimeSecondsOneWay", totalSecondsOneWay); } catch (e) {}
                }
            }
        }, 1000);

        observeElement("#travel-root time", () => {
            if (!isCurrentlyFlying()) { document.title = originalTitle; return; }
            const t = document.querySelector("#travel-root time span[aria-hidden='true']") || document.querySelector("#travel-root time");
            if (t) document.title = t.textContent.trim() + TEXT_TRAVEL;
        });
    } else if (window.location.href.startsWith(URL_HOSPITAL)) {
        observeElement(`#${ID_HOSPITAL}`, () => {
            const el = document.getElementById(ID_HOSPITAL);
            if (el) document.title = el.textContent + " " + TEXT_HOSPITAL;
        });
    } else if (window.location.href.startsWith(URL_RACEWAY)) {
        observeElement(`#${ID_RACEWAY}`, () => {
            const el = document.getElementById(ID_RACEWAY);
            if (el) {
                if (el.textContent.includes("Race")) document.title = el.textContent + TEXT_RACEWAY;
                else {
                    const t = el.querySelector("span");
                    if (t) document.title = t.textContent + TEXT_RACEWAY;
                }
            }
        });
    } else if (window.location.href.startsWith(URL_CHAIN)) {
        observeElement(SPAN_CHAIN_TIME, () => {
            const t = document.querySelector(SPAN_CHAIN_TIME)?.textContent;
            const v = document.querySelector(SPAN_CHAIN_LENGTH)?.textContent;
            if (t && v) document.title = `${t} left ${v} ${TEXT_CHAIN}`;
        });
    }

    function formatSeconds(secs) {
        if (secs == null || Number.isNaN(secs)) return "--:--";
        if (secs >= 86400) {
            const d = Math.floor(secs / 86400);
            const h = Math.floor((secs % 86400) / 3600);
            const m = Math.floor((secs % 3600) / 60);
            return `${d}d ${h}h ${m}m`;
        }
        const h = Math.floor(secs / 3600);
        const m = Math.floor((secs % 3600) / 60);
        const s = secs % 60;
        return `${("0"+h).slice(-2)}:${("0"+m).slice(-2)}:${("0"+s).slice(-2)}`;
    }

    function showTravelCooldownPanel() {
        const travelWindow = document.getElementById("travel-window");
        if (!travelWindow) return;

        const spanTime = document.querySelector("#travel-root time span[aria-hidden='true']");
        let flightSecs = null;
        if (spanTime) {
            const tStr = spanTime.textContent.trim();
            const p = tStr.split(":").map(n => parseInt(n, 10));
            if (p.length >= 2 && !p.some(Number.isNaN)) {
                flightSecs = (p[0] * 60 + p[1]) * 60 + (p[2] || 0);
                GM_setValue("flightTimeSecondsOneWay", flightSecs);
            }
        } else {
            const stored = GM_getValue("flightTimeSecondsOneWay", 0);
            flightSecs = stored || null;
        }
        const travelThereBack = flightSecs != null ? flightSecs * 2 : null;

        const { country, city } = getCountryCityFromDom();
        const destKeyExact = resolveDestinationKeyFromDom(country, city);
        const destKeyLoose = resolveDestinationKeyLoose(`${country} ${city}` || getSelectedDestinationName());
        const destKey = destKeyExact || destKeyLoose;

        const qty = getTravelQuantity();

        const colors = {
            Drug: "#ffbb22",
            Medical: "#66d4ff",
            Booster: "#e877ff",
            Education: "#fff",
            Bank: "#96ff96",
            OC: "#ffe55e"
        };
        const timers = [
            { label: "Drug",      secs: secondsLeft("cooldownDrugEnd") },
            { label: "Medical",   secs: secondsLeft("cooldownMedicalEnd") },
            { label: "Booster",   secs: secondsLeft("cooldownBoosterEnd") },
            { label: "Education", secs: secondsLeft("educationEnd") },
            { label: "Bank",      secs: secondsLeft("bankEnd") },
            { label: "OC",        secs: secondsLeft("ocEnd") }
        ];

        const moneyEl = document.querySelector("#user-money");
        const money = parseInt(moneyEl?.getAttribute("data-money") || "0");

        // Timers first
        let out = `
        <div style="font-size:0.95em;font-weight:bold;margin-bottom:6px;display:flex;align-items:center;gap:6px;">
            <span>✈ Total Travel time:</span>
            <span style="color:#ffe55e;">${travelThereBack != null ? formatSeconds(travelThereBack) : "--:--"}</span>
        </div>
        <div style="display:grid;grid-template-columns:90px 110px 22px;gap:4px;font-size:13px;align-items:center;margin-bottom:8px;">
    `;
        timers.forEach(t => {
            const ok = travelThereBack != null ? t.secs > travelThereBack : true;
            out += `
                <span style="font-weight:bold;color:${colors[t.label]};">${t.label}</span>
                <span style="color:${ok ? "#fff" : "#ff4d4d"};font-weight:${ok ? "normal" : "bold"};">${formatSeconds(t.secs)}</span>
                <span style="text-align:center;color:${ok ? "#90ee90" : "#ff4d4d"};">${ok ? "✔️" : "❌"}</span>
            `;
        });
        out += `</div>`;

        // Capacity + items
        out += `
        <div style="font-size:0.9em;margin:4px 0 6px 0;">Travel capacity:
            <span id="travel-qty-edit" style="color:#ffe55e;cursor:pointer;text-decoration:underline;">x${qty}</span>
        </div>
        `;

                     if (destKey && TRAVEL_ITEMS[destKey]) {
            const displayName = country ? `${country}${city ? " - " + city : ""}` : destKey;
            out += `<div style="font-weight:bold;margin:0 0 4px 0;">${displayName}</div>`;
            out += `<div style="display:grid;grid-template-columns:minmax(2px,1fr) minmax(9px,1fr) minmax(15px,1fr);align-items:center;gap:0px 2px;font-size:11.5px;line-height:1.1;">`;
            TRAVEL_ITEMS[destKey].forEach(item => {
                const total = item.price * qty;
                const can = money >= total;
                out += `
                    <span style="color:#eee;white-space:nowrap;">${item.name}</span>
                    <span style="color:#aaa;justify-self:end;white-space:nowrap;">$${item.price.toLocaleString()} × ${qty}</span>
                    <span style="color:${can ? "#8f8" : "#ffdb6e"};justify-self:end;white-space:nowrap;">
                        $${total.toLocaleString()}
                        <span style="margin-left:4px;color:${can ? "#8f8" : "#f55"};">${can ? "✔️" : "❌"}</span>
                    </span>
                `;
            });
            out += `</div>`;
        } else {
            out += `<div style="margin:4px 0 4px 0; color:#bbb; font-size:12px;">Pick a destination to see items.</div>`;
        }

        // Link row (inline, small). Show button only if link present
        const linkVal = getStockLink() || "";
        out += `
        <div style="margin-top:8px;display:flex;align-items:center;gap:6px;font-size:12px;">
            <span style="color:#ccc;">Link:</span>
            <input id="stock-link-input" type="text" value="${linkVal}"
                style="flex:1; min-width:120px; max-width:220px; padding:2px 4px; background:#111; color:#eee; border:1px solid #444; border-radius:4px; font-size:12px;" />
            <button id="stock-link-open" title="Open link"
                style="display:${linkVal.trim() ? "inline-flex" : "none"}; align-items:center; justify-content:center; width:26px; height:22px; border:1px solid #555; background:#333; color:#fff; border-radius:4px; cursor:pointer;">↗</button>
        </div>
        `;

        travelWindow.style.display = "block";
        travelWindow.innerHTML = `${out}`;

        const qtyEl = travelWindow.querySelector("#travel-qty-edit");
        if (qtyEl) {
            qtyEl.addEventListener("click", () => {
                const current = getTravelQuantity();
                const input = prompt("Set travel capacity / multiplier:", current);
                if (input === null) return;
                let val = parseInt(input, 10);
                if (Number.isNaN(val) || val <= 0) { alert("Please enter a positive number."); return; }
                if (val > 200) val = 200;
                setTravelQuantity(val);
            });
        }

        const linkInput = travelWindow.querySelector("#stock-link-input");
        const linkBtn = travelWindow.querySelector("#stock-link-open");
        if (linkInput) {
            linkInput.addEventListener("input", () => {
                const v = linkInput.value.trim();
                setStockLink(v);
                if (linkBtn) linkBtn.style.display = v ? "inline-flex" : "none";
            });
            linkInput.addEventListener("focus", () => linkInput.select());
            linkInput.addEventListener("keydown", (e) => {
                if (e.key === "Enter") {
                    const v = linkInput.value.trim();
                    if (v && linkBtn) linkBtn.click();
                }
            });
        }
        if (linkBtn) {
            linkBtn.addEventListener("click", () => {
                const v = linkInput ? linkInput.value.trim() : getStockLink();
                if (v) window.open(v, "_blank");
            });
        }
    }
    const travelInterval = setInterval(showTravelCooldownPanel, 1000);
    addInterval(travelInterval);

    // Chain timer
    function formatChainTime(secs) {
        if (secs == null || secs < 0) return "--:--";
        const h = Math.floor(secs / 3600);
        const m = Math.floor((secs % 3600) / 60);
        const s = secs % 60;
        if (h > 0) return `${("0"+h).slice(-2)}:${("0"+m).slice(-2)}:${("0"+s).slice(-2)}`;
        return `${("0"+m).slice(-2)}:${("0"+s).slice(-2)}`;
    }
    function findChainTimeElement() {
        const candidates = [
            '.bar-timeleft___B9RGV',
            'p.bar-timeleft',
            'span.timeLow_x23uL',
            '.bar .timeleft',
            '.bar-timeleft',
            '#chain-timer .time'
        ];
        for (const sel of candidates) {
            const el = document.querySelector(sel);
            if (el && /\d{1,2}:\d{2}(:\d{2})?/.test(el.textContent.trim())) return el;
        }
        const possible = Array.from(document.querySelectorAll('span, p, div'));
        for (const el of possible) {
            const txt = (el.textContent || "").trim();
            if (txt && /\b\d{1,2}:\d{2}(:\d{2})?\b/.test(txt) && (el.closest('.bar') || el.closest('.chain') || el.closest('.bar-container'))) return el;
        }
        for (const el of possible) {
            const txt = (el.textContent || "").trim();
            if (txt && /^\d{1,2}:\d{2}(:\d{2})?$/.test(txt)) return el;
        }
        return null;
    }
    function updateChainTimerFromDom() {
        let chainTimeEl = findChainTimeElement();
        const chainTimerRow = document.getElementById('chain-timer-row');
        const chainTimerValue = document.getElementById('chain-timer-value');
        let secs = null;
        if (chainTimeEl) {
            const timeText = chainTimeEl.textContent.trim();
            const parts = timeText.split(':').map(Number);
            let totalSeconds = 0;
            if (parts.length === 2) totalSeconds = parts[0] * 60 + parts[1];
            else if (parts.length === 3) totalSeconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
            secs = totalSeconds;
            chainTimerEndStored = Date.now() + totalSeconds * 1000;
            GM_setValue("chainTimerEnd", chainTimerEndStored);
        } else {
            const storedEnd = GM_getValue("chainTimerEnd", 0);
            const left = Math.max(0, Math.floor((storedEnd - Date.now()) / 1000));
            secs = left > 0 ? left : null;
        }
        if (chainTimerValue) {
            chainTimerValue.textContent = formatChainTime(secs);
            if (secs !== null && secs < 60 && secs > 0) chainTimerRow.classList.add('flash-chain-row');
            else chainTimerRow.classList.remove('flash-chain-row');
        }
    }
    window.updateChainTimerFromDom = updateChainTimerFromDom;
})();

// ---------- Cleanup on unload ----------
function cleanupAll() {
    try {
        __intervals.slice().forEach(id => { try { clearInterval(id); } catch (e) {} });
        __intervals.length = 0;
        __observers.forEach(obs => { try { obs.disconnect(); } catch (e) {} });
        __observers.length = 0;
        if (window.countdownBlinkInterval) { try { clearInterval(window.countdownBlinkInterval); } catch (e) {} window.countdownBlinkInterval = null; }
        if (autoApiInterval) { try { clearInterval(autoApiInterval); } catch (e) {} autoApiInterval = null; }
    } catch (e) {}
}
window.addEventListener('beforeunload', cleanupAll);
window.addEventListener('unload', cleanupAll);