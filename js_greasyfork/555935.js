// ==UserScript==
// @name         CRYSTAL'S CLAWS OC Highlighter
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Highlights empty OC roles; shows pass/fail badges — CLAWS Edition
// @author       Crystal
// @match        https://www.torn.com/factions.php?step=your*
// @grant        GM_xmlhttpRequest
// @icon         https://raw.githubusercontent.com/Crystallized22/torn-assets/main/paw-icon.png
// @connect      *
// @connect      docs.google.com
// @connect      *.googleusercontent.com
// @connect      doc-10-18-sheets.googleusercontent.com
// @connect      doc-0c-88-sheets.googleusercontent.com
// @connect      raw.githubusercontent.com
// @downloadURL https://update.greasyfork.org/scripts/555935/CRYSTAL%27S%20CLAWS%20OC%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/555935/CRYSTAL%27S%20CLAWS%20OC%20Highlighter.meta.js
// ==/UserScript==

(function () {
    'use strict';
    console.log("CRYSTAL: CLAWS Script initializing...");

    // === CSV URL (CLAWS sheet you provided) ===
    const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQX3Vkl4Ogw-tXxox8L9VHuJAv9DpKYXyx54zx7rfHQwsNyx8UHbJzDXdCCbrP9WU9Q-_abllAWFPxS/pub?gid=1635969979&single=true&output=csv";

    let roleMinimums = null;
    let alertsBlocked = [];
    let alertsNotes = [];

    // CLAWS green defaults and storage key changed to avoid collisions with PAWS
    let settings = JSON.parse(localStorage.getItem("claws_oc_settings") || "{}");
    settings = Object.assign({
        enabled: true,
        highlightFullSlots: false,
        passColor: "#8FBC8B",  // CLAWS green
        failColor: "#ff4444",
        pausedColor: "#FFD700",
        compactBadgeText: false,
        showPayouts: true // show/hide payout info
    }, settings);

    function saveSettings() {
        localStorage.setItem("claws_oc_settings", JSON.stringify(settings));
    }

    function normalizeName(name) {
        if (!name) return "";

        // Remove accents, trim, lowercase, and normalize spaces
        let normalized = name
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            .replace(/\s+/g, " ")
            .replace(/\u00A0/g, " ")
            .trim()
            .toLowerCase();

        // Scenario-specific fixes
        const scenarioAliases = {
            "guardian angels": "guardian angels",
            "guardian ángels": "guardian angels",
            "guardianá ngels": "guardian angels",
            "crimescene x": "crimescene x"
        };

        if (scenarioAliases[normalized]) {
            normalized = scenarioAliases[normalized];
        }

        return normalized;
    }

    function resetSettings() {
        settings = {
            enabled: true,
            highlightFullSlots: false,
            passColor: "#8FBC8B",
            failColor: "#ff4444",
            pausedColor: "#FFD700",
            compactBadgeText: false,
            showPayouts: true
        };
        saveSettings();
        buildUI();
        highlightRoles();
    }

    const style = document.createElement("style");
    style.textContent = `
    #crystal-oc-main-container { margin:8px 0; font-family: Arial, sans-serif; font-size:12px; display:flex; gap:6px; align-items:center;}
    .crystal-button {
        display:inline-flex; align-items:center; justify-content:center; gap:6px;
        height:28px; padding:0 8px; font-size:12px; font-weight:700; color:#fff;
        background: linear-gradient(to bottom, #cfead8, #8FBC8B); border: none; border-radius:6px; cursor:pointer;
        box-shadow: 0 2px 6px rgba(0,0,0,0.12), inset 0 0 2px rgba(255,255,255,0.04); transition: transform .08s ease;
        line-height:1;
    }
    .crystal-button.secondary {
        background: linear-gradient(to bottom, rgba(120,200,160,0.12), rgba(90,150,110,0.08));
        border:1px solid rgba(255,255,255,0.04);
    }
    .crystal-button:hover { transform: translateY(-1px); box-shadow: 0 4px 10px rgba(0,0,0,0.12); filter:brightness(1.02); }
    .crystal-button img { width:18px; height:18px; object-fit:contain; display:block; }

    #crystal-oc-panel {
        display:none; margin-top:6px;
        background: rgba(40,40,40,0.96); padding:8px 10px; border-radius:6px; color:#fff;
        width:100%; max-width:680px; box-sizing:border-box; box-shadow: 0 6px 22px rgba(0,0,0,0.45);
    }
    #crystal-oc-panel p { margin:6px 0 8px; padding-top:6px; color:#e6e6e6; line-height:1.25; }

    #crystal-oc-panel details { margin:10px 0; background: transparent; padding:0; border:none; }
    #crystal-oc-panel summary { cursor:pointer; font-weight:700; color:#dff7e9; padding:6px; border-radius:4px; display:block; }
    #crystal-oc-panel summary:hover { background: rgba(143,188,139,0.06); }
    #crystal-oc-panel .section-header { background: rgba(143,188,139,0.06); padding:6px; border-radius:4px; color:#dff7e9; font-weight:700; margin-bottom:6px; }

    .crystal-color-row { display:flex; gap:10px; align-items:center; flex-wrap:wrap; }
    .crystal-color-row label { display:flex; gap:6px; align-items:center; font-weight:600; color:#fff; font-size:12px; }
    .crystal-color-row input[type="color"] { width:26px; height:20px; padding:0; border:none; background:transparent; cursor:pointer; }

    #crystal-oc-panel .reset-btn { padding:6px 8px; font-weight:700; border-radius:6px; }

    .oc-highlight-badge {
        position:absolute; top:-12px; left:50%; transform:translateX(-50%);
        border-radius:10px; padding:0 4px; font-weight:700; font-size:11px; line-height:1; white-space:nowrap;
        z-index:6; box-sizing:border-box; border:2px solid transparent;
    }
    .oc-highlight-badge.paused { color:#222 !important; }

    /* Payout element near the title */
    .oc-payout-info {
        display: inline-block;
        margin-left: 8px;
        font-size: 11px;
        font-weight: 700;
        opacity: 0.85;
        color: #8FBC8B;
    }

    .oc-payout-info.hidden { display:none; }

    /* Alerts table background to increase contrast/readability */
    #crystal-oc-panel .alerts-table { width:100%; border-collapse:collapse; background: rgba(28,28,28,0.6); border-radius:6px; overflow:hidden; margin-bottom:8px; }
    #crystal-oc-panel .alerts-table td { padding:6px 8px; border-bottom:1px solid rgba(255,255,255,0.03); color:#fff; }
    #crystal-oc-panel .alerts-heading { font-weight:800; color:#dff7e9; margin-bottom:6px; }
    `;
    document.head.appendChild(style);

    function loadCSV(callback) {
        GM_xmlhttpRequest({
            method: "GET",
            url: CSV_URL,
            onload: resp => {
                try {
                    const text = resp.responseText || "";
                    const lines = text.trim().split("\n");
                    const temp = {};
                    alertsBlocked = [];
                    alertsNotes = [];

                    const startAt = lines.length > 0 && /scenario/i.test(lines[0].toLowerCase()) ? 1 : 0;
                    for (let i = startAt; i < lines.length; i++) {
                        const line = lines[i];
                        if (!line) continue;

                        // conservative split: handle simple CSV rows (if more complex quoting required, adjust)
                        const parts = line.split(",").map(s => s?.trim());

                        const scenario = normalizeName(parts[0] || "");
                        if (!scenario) continue;

                        const role = parts[1] || "";
                        const minStr = parts[2] || "";
                        const ifPausedStr = parts[3] || "";
                        const notes = parts[4] || "";

                        // Try to detect optional payout column placed AFTER notes
                        // If parts[5] looks numeric and parts[6] looks like a crimeId (or empty), treat parts[5] as payout.
                        let payout = undefined;
                        let crimeId = parts[5] || "";
                        let status = (parts[8] || parts[6] || parts[7] || "").trim();

                        if (parts.length >= 6) {
                            const possiblePayout = (parts[5] || "").replace("%", "").trim();
                            if (/^\d+(\.\d+)?$/.test(possiblePayout)) {
                                // treat as payout column
                                payout = Number(possiblePayout);
                                crimeId = parts[6] || "";
                                status = (parts[9] || parts[7] || parts[8] || "").trim() || status;
                            } else {
                                // no payout column, keep crimeId as parts[5]
                                crimeId = parts[5] || "";
                                status = (parts[8] || parts[6] || parts[7] || "").trim() || status;
                            }
                        }

                        const min = parseInt(minStr, 10);
                        const ifPaused = parseInt(ifPausedStr, 10);

                        if (!temp[scenario]) temp[scenario] = { roles: {} };

                        if (role) {
                            temp[scenario].roles[role] = {
                                min: Number.isFinite(min) ? min : 0,
                                ifPaused: Number.isFinite(ifPaused) ? ifPaused : undefined,
                                notes: notes || ""
                            };

                            if (/blocked/i.test(status)) {
                                alertsBlocked.push({
                                    scenario,
                                    role,
                                    min: Number.isFinite(min) ? min : 0,
                                    notes: notes || "",
                                    crimeId,
                                    status
                                });
                            }
                            if (notes && notes.trim()) {
                                alertsNotes.push({
                                    scenario,
                                    role,
                                    min: Number.isFinite(min) ? min : 0,
                                    notes,
                                    crimeId
                                });
                            }
                        } else {
                            temp[scenario].defaultMin = Number.isFinite(min) ? min : 0;
                            temp[scenario].defaultIfPaused = Number.isFinite(ifPaused) ? ifPaused : undefined;
                            temp[scenario].notes = notes || "";

                            // store payout if present
                            if (payout !== undefined && !Number.isNaN(payout)) {
                                temp[scenario].payout = payout;
                            }

                            if (notes && notes.trim()) {
                                alertsNotes.push({
                                    scenario,
                                    role: "(All Roles)",
                                    min: temp[scenario].defaultMin,
                                    notes,
                                    crimeId
                                });
                            }
                            if (/blocked/i.test(status)) {
                                alertsBlocked.push({
                                    scenario,
                                    role: "(All Roles)",
                                    min: temp[scenario].defaultMin,
                                    notes: temp[scenario].notes || "",
                                    crimeId,
                                    status
                                });
                            }
                        }
                    }

                    // ensure guardian alias and assign
                    roleMinimums = temp;

                    if (temp["guardian angels"]) {
                        roleMinimums["guardian angels"] = temp["guardian angels"];
                    } else {
                        const guardianKey = Object.keys(temp).find(k => k.includes("guardian"));
                        if (guardianKey) roleMinimums["guardian angels"] = temp[guardianKey];
                    }

                    console.log("CRYSTAL: Role minimums loaded.", roleMinimums, { alertsBlocked, alertsNotes });
                    callback();
                } catch (e) {
                    console.error("CRYSTAL: CSV parse error", e);
                    roleMinimums = {};
                    alertsBlocked = [];
                    alertsNotes = [];
                    callback();
                }
            },
            onerror: resp => {
                console.error("CRYSTAL: CSV load failed", resp);
                roleMinimums = {};
                alertsBlocked = [];
                alertsNotes = [];
                callback();
            }
        });
    }

    function highlightRoles() {
        // remove previous badges & payout elements
        document.querySelectorAll(".oc-highlight-badge").forEach(b => b.remove());
        document.querySelectorAll(".oc-payout-info").forEach(p => p.remove());

        document.querySelectorAll("[data-oc-id]").forEach(wrapper => {
            wrapper.querySelectorAll("div[class*='g3mPt'] > div").forEach(c => {
                c.style.border = "";
                c.style.backgroundColor = "";
            });
        });

        if (!roleMinimums || !settings.enabled) return;

        const wrappers = document.querySelectorAll("[data-oc-id]");
        wrappers.forEach(wrapper => {
            const panelTitleEl = wrapper.querySelector("p[class*='panelTitle']");
            const scenarioNameRaw = panelTitleEl ? panelTitleEl.textContent : "";
            let scenarioName = normalizeName(
                scenarioNameRaw.replace(/payout.*$/i, '').replace(/no rate.*$/i, '').trim()
            );

            // Force guardian substring match
            if (scenarioName.includes("guardian")) {
                console.log("⚠️ Forcing Guardian Angels scenario match:", scenarioNameRaw, "→ guardian angels");
                scenarioName = "guardian angels";
            }

            // Show payout if setting enabled and we have it
            try {
                if (settings.showPayouts && panelTitleEl) {
                    const payoutVal = roleMinimums?.[scenarioName]?.payout;
                    // create payout element if payoutVal defined
                    if (payoutVal !== undefined && payoutVal !== null && payoutVal !== 0) {
                        let payoutEl = panelTitleEl.querySelector(".oc-payout-info");
                        if (!payoutEl) {
                            payoutEl = document.createElement("span");
                            payoutEl.className = "oc-payout-info";
                            panelTitleEl.appendChild(payoutEl);
                        }
                        payoutEl.textContent = `Payout: ${payoutVal}%`;
                        payoutEl.classList.remove("hidden");
                    } else {
                        // if payout missing, we can still show "No rate" if you want; currently hide if undefined
                        const existing = panelTitleEl.querySelector(".oc-payout-info");
                        if (existing) existing.classList.add("hidden");
                    }
                }
            } catch (e) {
                /* ignore display issues */
                console.warn("CRYSTAL: payout display error", e);
            }

            const roles = wrapper.querySelectorAll("div[class*='g3mPt'] > div");
            const isPaused = !!wrapper.querySelector("[class*='paused']");

            roles.forEach(container => {
                const isSlotEmpty = container.textContent.includes("Join");
                const roleEl = container.querySelector("span[class*='title']");
                const scoreEl = container.querySelector("div[class*='successChance']");
                if (!roleEl) return;

                const roleName = (roleEl.textContent || "").trim();
                const scoreText = (scoreEl?.textContent || "").replace("%", "").trim();
                const score = /^\d+$/.test(scoreText) ? parseInt(scoreText, 10) : null;

                // Use null checks (not undefined/0)
                const roleData = roleMinimums?.[scenarioName]?.roles?.[roleName];
                const defaultEntry = roleMinimums?.[scenarioName];

                const min = (roleData && roleData.min != null)
                    ? roleData.min
                    : (defaultEntry && defaultEntry.defaultMin != null) ? defaultEntry.defaultMin : null;

                const defaultIfPaused = (roleData && roleData.ifPaused != null)
                    ? roleData.ifPaused
                    : (defaultEntry && defaultEntry.defaultIfPaused != null) ? defaultEntry.defaultIfPaused : (min != null ? min : null);

                const showMinLabel = !settings.compactBadgeText;

                // Badge & alert matching: normalize role when comparing to alertsNotes
                const roleAlerts = alertsNotes.find(a => normalizeName(a.scenario) === scenarioName && normalizeName(a.role) === normalizeName(roleName));

                // Badge text / color logic
                let badgeText, badgeColor;

                if (roleAlerts) {
                    // show ⚠️ and the minimum (if present)
                    badgeText = `⚠️ ${showMinLabel ? "MIN: " : ""}${min != null ? min : "—"}%`;
                    badgeColor = "#FFAA00"; // amber for notes
                } else if (isPaused) {
                    badgeText = `⚠️ ${showMinLabel ? "MIN: " : ""}${defaultIfPaused != null ? defaultIfPaused : "—"}%`;
                    badgeColor = settings.pausedColor;
                } else if (score === null) {
                    badgeText = "--";
                    badgeColor = settings.failColor;
                } else if (min != null) {
                    badgeText = (score >= min ? "✅ " : "❌ ") + (showMinLabel ? `MIN: ${min}%` : `${min}%`);
                    badgeColor = (score >= min ? settings.passColor : settings.failColor);
                } else {
                    badgeText = "--";
                    badgeColor = settings.failColor;
                }

                if (isSlotEmpty || settings.highlightFullSlots) {
                    const badge = document.createElement("div");
                    badge.className = "oc-highlight-badge";
                    badge.textContent = badgeText;
                    badge.style.backgroundColor = badgeColor;
                    badge.style.border = `2px solid ${badgeColor}`;
                    badge.style.boxShadow = `0 0 4px ${badgeColor}66`;
                    badge.style.fontSize = "11px";
                    badge.style.padding = "0 4px";
                    badge.style.color = (isPaused || roleAlerts) ? "#222" : "#fff";

                    if (!container.style.position) container.style.position = "relative";

                    // Tooltip only for paused or note
                    if (isPaused || roleAlerts) {
                        let tooltipText = `MIN: ${min != null ? min : "—"}`;
                        if (isPaused) tooltipText += `\nIF PAUSED: ${defaultIfPaused != null ? defaultIfPaused : "—"}`;
                        if (roleAlerts && roleAlerts.notes) tooltipText += `\nNOTE: ${roleAlerts.notes}`;
                        badge.title = tooltipText;
                    }

                    container.prepend(badge);
                }

                // ✅ Highlight logic (background/border should be green/red based on threshold)
                let threshold = isPaused ? defaultIfPaused : min;
                let borderColor, bgColor;

                if (score !== null && threshold != null) {
                    const isPass = score >= threshold;
                    borderColor = isPass ? settings.passColor : settings.failColor;
                    bgColor = isPass ? "rgba(143,188,139,0.12)" : "rgba(255,68,68,0.12)";
                } else {
                    // if we don't have a proper threshold, fallback to red/highlight as "unknown / fail"
                    borderColor = settings.failColor;
                    bgColor = "rgba(255,68,68,0.12)";
                }

                container.style.border = `2px solid ${borderColor}`;
                container.style.backgroundColor = bgColor;
            });
        });

        console.log("CRYSTAL: Role highlighting complete.");
    }

    function updateAlertRowColors() {
        const panel = document.getElementById("crystal-oc-panel");
        if (!panel) return;

        panel.querySelectorAll(".alerts-table tbody tr").forEach(row => {
            const scenarioRoleText = row.cells[0]?.textContent || "";
            const textCell = row.cells[1];
            if (!textCell) return;

            const [scenarioRaw, roleRaw] = scenarioRoleText.split("—").map(s => s.trim());
            const scenario = normalizeName(scenarioRaw || "");
            const role = roleRaw || "";

            const roleData = roleMinimums?.[scenario]?.roles?.[role];
            const defaultEntry = roleMinimums?.[scenario];
            const min = (roleData && roleData.min !== undefined)
                ? roleData.min
                : (defaultEntry && defaultEntry.defaultMin !== undefined) ? defaultEntry.defaultMin : null;

            const defaultIfPaused = (roleData && roleData.ifPaused !== undefined)
                ? roleData.ifPaused
                : (defaultEntry && defaultEntry.defaultIfPaused !== undefined) ? defaultEntry.defaultIfPaused : (min !== null ? min : null);

            const roleAlert = alertsNotes.find(a => normalizeName(a.scenario) === scenario && normalizeName(a.role) === normalizeName(role));

            let bgColor;

            // Yellow if paused, orange if note, green/red otherwise
            if (roleAlert) {
                bgColor = "#FFAA00"; // amber for notes
            } else if (row.textContent.includes("Paused")) {
                bgColor = "rgba(255,215,0,0.12)"; // paused yellow
            } else if (min !== null) {
                const score = parseInt((textCell.textContent.match(/\d+/) || [0])[0], 10);
                bgColor = score >= min ? "rgba(143,188,139,0.12)" : "rgba(255,68,68,0.12)";
            } else {
                bgColor = "rgba(255,68,68,0.12)";
            }

            row.style.backgroundColor = bgColor;
        });
    }

    function buildUI() {
        const buttonsContainer = document.querySelector("[class*='buttonsContainer']");
        if (!buttonsContainer || !roleMinimums) return;

        const existing = document.getElementById("crystal-oc-main-container");
        if (existing) existing.remove();
        const existingPanel = document.getElementById("crystal-oc-panel");
        if (existingPanel) existingPanel.remove();

        const main = document.createElement("div");
        main.id = "crystal-oc-main-container";
        Object.assign(main.style, { display: "flex", gap: "6px", alignItems: "center" });

        const reloadBtn = document.createElement("button");
        reloadBtn.className = "crystal-button";
        reloadBtn.textContent = "HIGHLIGHT";
        reloadBtn.title = "Run OC highlighter";
        reloadBtn.onclick = () => highlightRoles();
        main.appendChild(reloadBtn);

        const clawBtn = document.createElement("button");
        clawBtn.className = "crystal-button secondary";
        clawBtn.style.padding = "0 6px";
        const clawImg = document.createElement("img");
        clawImg.src = "https://raw.githubusercontent.com/Crystallized22/torn-assets/refs/heads/main/claw-icon.png";
        clawImg.alt = "Guidelines";
        clawImg.style.width = "18px";
        clawImg.style.height = "18px";
        clawBtn.appendChild(clawImg);
        main.appendChild(clawBtn);

        const panel = document.createElement("div");
        panel.id = "crystal-oc-panel";
        panel.style.display = "none";
        panel.setAttribute('aria-hidden', 'true');

        const intro = document.createElement("p");
        intro.textContent = "To use this script, go to the Recruiting OC tab and press the HIGHLIGHT button to run the highlighter script. Use these guidelines to quickly check if members meet minimum OC role requirements. Green = pass, Red = fail, Yellow = paused, Orange = Error (Contact Crystal)";
        panel.appendChild(intro);

        const alertsDetails = document.createElement("details");
        alertsDetails.open = true;
        const alertsSummary = document.createElement("summary");
        alertsSummary.textContent = "🚨 Alerts";
        alertsSummary.className = "section-header";
        alertsDetails.appendChild(alertsSummary);

        const alertsContainer = document.createElement("div");
        alertsContainer.style.padding = "6px 2px 2px 2px";

        if (alertsBlocked.length > 0) {
            const blockedHeading = document.createElement("div");
            blockedHeading.className = "alerts-heading";
            blockedHeading.textContent = "Blocked (🚫)";
            alertsContainer.appendChild(blockedHeading);

            const blockedTable = document.createElement("table");
            blockedTable.className = "alerts-table";
            const bTbody = blockedTable.createTBody();
            alertsBlocked.forEach(item => {
                const row = bTbody.insertRow();
                const cell1 = row.insertCell(); cell1.textContent = item.crimeId ? `🚫 ${item.scenario} — ${item.role}` : `🚫 ${item.scenario} — ${item.role}`;
                const cell2 = row.insertCell(); cell2.textContent = `Min: ${item.min}%`;
                const cell3 = row.insertCell(); cell3.textContent = item.notes || '';
            });
            alertsContainer.appendChild(blockedTable);
        }

        if (alertsNotes.length > 0) {
            const notesHeading = document.createElement("div");
            notesHeading.className = "alerts-heading";
            notesHeading.textContent = "Notes (⚠️)";
            alertsContainer.appendChild(notesHeading);

            const notesTable = document.createElement("table");
            notesTable.className = "alerts-table";
            const nTbody = notesTable.createTBody();
            alertsNotes.forEach(item => {
                const row = nTbody.insertRow();
                const cell1 = row.insertCell(); cell1.textContent = `${item.scenario} — ${item.role}`;
                const cell2 = row.insertCell(); cell2.textContent = `Min: ${item.min}%`;
                const cell3 = row.insertCell(); cell3.textContent = item.notes || '';
            });
            alertsContainer.appendChild(notesTable);
        }
        updateAlertRowColors();
        if (alertsBlocked.length === 0 && alertsNotes.length === 0) {
            const empty = document.createElement("div");
            empty.textContent = "No alerts (no blocked scenarios and no role notes).";
            empty.style.color = "#ddd";
            alertsContainer.appendChild(empty);
        }

        alertsDetails.appendChild(alertsContainer);
        panel.appendChild(alertsDetails);

        const settingsDetails = document.createElement("details");
        settingsDetails.open = false;
        const settingsSummary = document.createElement("summary");
        settingsSummary.textContent = "⚙️ Settings";
        settingsSummary.className = "section-header";
        settingsDetails.appendChild(settingsSummary);

        const settingsInner = document.createElement("div");
        settingsInner.style.padding = "6px 2px 2px 2px";

        const toggles = document.createElement("div");
        toggles.style.display = "flex";
        toggles.style.flexDirection = "column";
        toggles.style.gap = "8px";

        const lblEnable = document.createElement("label");
        lblEnable.style.display = "flex"; lblEnable.style.alignItems = "center"; lblEnable.style.gap = "8px";
        const enableChk = document.createElement("input");
        enableChk.type = "checkbox"; enableChk.checked = !!settings.enabled;
        enableChk.onchange = () => { settings.enabled = enableChk.checked; saveSettings(); highlightRoles(); };
        lblEnable.appendChild(enableChk);
        const enableText = document.createElement("span"); enableText.textContent = "Enable OC Highlighter";
        lblEnable.appendChild(enableText);
        toggles.appendChild(lblEnable);

        const lblFull = document.createElement("label");
        lblFull.style.display = "flex"; lblFull.style.alignItems = "center"; lblFull.style.gap = "8px";
        const fullChk = document.createElement("input");
        fullChk.type = "checkbox"; fullChk.checked = !!settings.highlightFullSlots;
        fullChk.onchange = () => { settings.highlightFullSlots = fullChk.checked; saveSettings(); highlightRoles(); };
        lblFull.appendChild(fullChk);
        const fullText = document.createElement("span"); fullText.textContent = "Highlight full slot minimums";
        lblFull.appendChild(fullText);
        toggles.appendChild(lblFull);

        const lblCompact = document.createElement("label");
        lblCompact.style.display = "flex"; lblCompact.style.alignItems = "center"; lblCompact.style.gap = "8px";
        const compactChk = document.createElement("input");
        compactChk.type = "checkbox"; compactChk.checked = !!settings.compactBadgeText;
        compactChk.onchange = () => { settings.compactBadgeText = compactChk.checked; saveSettings(); highlightRoles(); };
        lblCompact.appendChild(compactChk);
        const compactText = document.createElement("span"); compactText.textContent = "Compact badge text (remove 'MIN:')";
        lblCompact.appendChild(compactText);
        toggles.appendChild(lblCompact);

        // NEW: show/hide payout toggle
        const lblPayouts = document.createElement("label");
        lblPayouts.style.display = "flex"; lblPayouts.style.alignItems = "center"; lblPayouts.style.gap = "8px";
        const payoutChk = document.createElement("input");
        payoutChk.type = "checkbox"; payoutChk.checked = !!settings.showPayouts;
        payoutChk.onchange = () => { settings.showPayouts = payoutChk.checked; saveSettings(); highlightRoles(); };
        lblPayouts.appendChild(payoutChk);
        const payoutText = document.createElement("span"); payoutText.textContent = "Show OC Payouts";
        lblPayouts.appendChild(payoutText);
        toggles.appendChild(lblPayouts);

        settingsInner.appendChild(toggles);

        const colorRow = document.createElement("div");
        colorRow.className = "crystal-color-row";
        colorRow.style.marginTop = "8px";

        const makeColorLabel = (labelText, key) => {
            const lbl = document.createElement("label");
            lbl.style.display = "flex"; lbl.style.alignItems = "center"; lbl.style.gap = "6px";
            const span = document.createElement("span"); span.textContent = labelText; span.style.color = "#fff"; span.style.fontWeight = "600"; span.style.fontSize = "12px";
            const input = document.createElement("input"); input.type = "color"; input.value = settings[key];
            input.style.width = "26px"; input.style.height = "20px";
            input.onchange = () => { settings[key] = input.value; saveSettings(); highlightRoles(); };
            lbl.appendChild(span); lbl.appendChild(input);
            return lbl;
        };

        colorRow.appendChild(makeColorLabel("Pass", "passColor"));
        colorRow.appendChild(makeColorLabel("Fail", "failColor"));
        colorRow.appendChild(makeColorLabel("Paused", "pausedColor"));
        settingsInner.appendChild(colorRow);

        const resetBtn = document.createElement("button");
        resetBtn.className = "crystal-button reset-btn";
        resetBtn.textContent = "Reset to Defaults";
        resetBtn.onclick = () => resetSettings();
        settingsInner.appendChild(resetBtn);

        settingsDetails.appendChild(settingsInner);
        panel.appendChild(settingsDetails);

        const blurbDetails = document.createElement("details");
        blurbDetails.open = false;
        const bSum = document.createElement("summary");
        bSum.textContent = "📘 CLAWS OC GUIDELINES";
        bSum.className = "section-header";
        blurbDetails.appendChild(bSum);

        const blurb = document.createElement("div");
        blurb.style.padding = "6px 2px 2px 2px";
        blurb.innerHTML = `
            <p style="margin:0 0 8px;">
                Join <a href="http://discord.gg/RzrH85A" target="_blank" style="color:#8FBC8B; text-decoration:none;">PAWS FAMILY DISCORD #oc-info</a>
                for the latest info (prioritized OCs, blocked OCs, etc).<br>
                <p><b>Help us better organize OCs:</b><br>Install the <a href="https://greasyfork.org/en/scripts/538377-torn-stats-faction-cpr-tracker" target="_blank" style="color:#8FBC8B; text-decoration:none;">Faction CPR Tracker by IceBlueFire</a> to automatically fetch and pass your rates into TornStats whenever you visit the Faction Crimes page.</p>
        `;
        blurbDetails.appendChild(blurb);
        panel.appendChild(blurbDetails);

        buttonsContainer.parentNode.insertBefore(main, buttonsContainer.nextSibling);
        buttonsContainer.parentNode.insertBefore(panel, main.nextSibling);

        clawBtn.onclick = () => {
            const isHidden = panel.style.display === "none";
            panel.style.display = isHidden ? "block" : "none";
            panel.setAttribute('aria-hidden', isHidden ? 'false' : 'true');
            if (isHidden) {
                const alerts = panel.querySelector("details");
                if (alerts) alerts.open = true;
            }
        };

        function updateAlertColors() {
            panel.querySelectorAll(".alerts-table a").forEach(a => {
                a.style.color = "#bdbdbd";
            });
        }
        updateAlertColors();
    }

    loadCSV(() => { buildUI(); highlightRoles(); });

    // also re-run highlight occasionally in case Torn updates the DOM after navigation
    let lastRun = 0;
    function schedulePeriodicRun() {
        const now = Date.now();
        if (now - lastRun > 2500) {
            lastRun = now;
            try { highlightRoles(); } catch (e) { /* ignore */ }
        }
        requestAnimationFrame(schedulePeriodicRun);
    }
    schedulePeriodicRun();

})();
