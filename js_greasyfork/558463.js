// ==UserScript==
// @name          Elimination Chat Buttons (Clipboard Stable Version)
// @namespace     https://torn.com/
// @version       3.0.0
// @author        yoyoYossarian
// @license       MIT
// @description   Adds Elimination war buttons with Primary/Secondary/Farm target links.
// @match         https://www.torn.com/*
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/558463/Elimination%20Chat%20Buttons%20%28Clipboard%20Stable%20Version%29.user.js
// @updateURL https://update.greasyfork.org/scripts/558463/Elimination%20Chat%20Buttons%20%28Clipboard%20Stable%20Version%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /****************************************
     * TEAM DEFINITIONS
     ****************************************/
    const TEAM_LINKS = {
        "🩷 Pink Power":      { url: "https://www.torn.com/page.php?sid=competition#/team/1"  },
        "🧲 Metal Heads":     { url: "https://www.torn.com/page.php?sid=competition#/team/68" },
        "🪓 Lumberjacks":     { url: "https://www.torn.com/page.php?sid=competition#/team/32" },
        "🧔 Peasants":        { url: "https://www.torn.com/page.php?sid=competition#/team/50" },
        "👊 Punchbags":       { url: "https://www.torn.com/page.php?sid=competition#/team/34" },
        "☮️ Pacifists":       { url: "https://www.torn.com/page.php?sid=competition#/team/14" },
        "🧁 Team Cupcake":    { url: "https://www.torn.com/page.php?sid=competition#/team/33" },
        "🐝 Murder Hornets":  { url: "https://www.torn.com/page.php?sid=competition#/team/47" },
        "💰 Total Bankers":   { url: "https://www.torn.com/page.php?sid=competition#/team/52" },
        "🍳 Breakfast Club":  { url: "https://www.torn.com/page.php?sid=competition#/team/36" },
        "🤡 Terror Bytes":    { url: "https://www.torn.com/page.php?sid=competition#/team/49" }
    };

    const TEAM_OPTIONS = ["None", ...Object.keys(TEAM_LINKS)];
    const STORAGE_KEY = "elim_chat_targets";
    const PRESETS_KEY = "elim_chat_presets";
    const HISTORY_KEY = "elim_chat_history";
    const FOOTER_KEY = "elim_chat_footer";

    /****************************************
     * LOAD/SAVE DATA
     ****************************************/
    function loadTargets() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) return JSON.parse(saved);
        } catch (e) {
            console.warn("Failed to load targets:", e);
        }
        return { primary: "None", secondary: "None", farm: "None" };
    }

    function saveTargets(targets) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(targets));
            addToHistory(targets);
        } catch (e) {
            console.warn("Failed to save targets:", e);
        }
    }

    function loadPresets() {
        try {
            const saved = localStorage.getItem(PRESETS_KEY);
            if (saved) return JSON.parse(saved);
        } catch (e) {}
        return [];
    }

    function savePresets(presets) {
        try {
            localStorage.setItem(PRESETS_KEY, JSON.stringify(presets));
        } catch (e) {}
    }

    function loadHistory() {
        try {
            const saved = localStorage.getItem(HISTORY_KEY);
            if (saved) return JSON.parse(saved);
        } catch (e) {}
        return [];
    }

    function addToHistory(targets) {
        let history = loadHistory();
        const key = JSON.stringify(targets);

        // Remove if exists
        history = history.filter(h => JSON.stringify(h) !== key);

        // Add to front
        history.unshift(targets);

        // Keep only last 5
        history = history.slice(0, 5);

        try {
            localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
        } catch (e) {}
    }

    function loadFooter() {
        try {
            const saved = localStorage.getItem(FOOTER_KEY);
            return saved || "";
        } catch (e) {}
        return "";
    }

    function saveFooter(text) {
        try {
            localStorage.setItem(FOOTER_KEY, text);
        } catch (e) {}
    }

    let targets = loadTargets();
    let presets = loadPresets();
    let customFooter = loadFooter();

    /****************************************
     * HELPERS
     ****************************************/
    function linkify(team) {
        if (team === "None") return "";
        return `<b><a href="${TEAM_LINKS[team].url}">${team}</a></b>`;
    }

    async function insertChat(chatBox, text) {
        const area = chatBox.querySelector('textarea, .textarea___V8HsV');
        if (!area) return;

        try { await navigator.clipboard.writeText(text); } catch (e) {}

        area.focus();
        area.setRangeText(text, 0, area.value.length, "end");
        area.dispatchEvent(new Event("input", { bubbles: true }));
    }

    function isElimChat(chatBox) {
        return chatBox.id && chatBox.id.startsWith("elimination-");
    }

    /****************************************
     * QUICK EDIT MENU (right-click gear)
     ****************************************/
    function createQuickEditMenu(e) {
        e.preventDefault();

        const existing = document.getElementById("quick-edit-menu");
        if (existing) existing.remove();

        const menu = document.createElement("div");
        menu.id = "quick-edit-menu";
        menu.style.cssText = `
            position: fixed;
            left: ${e.clientX}px;
            top: ${e.clientY}px;
            transform: translateY(-100%);
            background: #2a2a2a;
            border: 1px solid #555;
            border-radius: 6px;
            padding: 8px;
            z-index: 99999999;
            min-width: 180px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.5);
        `;

        const header = document.createElement("div");
        header.textContent = "Quick Primary Target";
        header.style.cssText = "color: #aaa; font-size: 11px; margin-bottom: 6px; text-align: center;";
        menu.appendChild(header);

        TEAM_OPTIONS.forEach(team => {
            const item = document.createElement("div");
            item.textContent = team;
            item.style.cssText = `
                padding: 6px 10px;
                cursor: pointer;
                color: white;
                border-radius: 4px;
                font-size: 13px;
                ${targets.primary === team ? 'background: #4CAF50;' : ''}
            `;
            item.onmouseenter = () => {
                if (targets.primary !== team) item.style.background = "#444";
            };
            item.onmouseleave = () => {
                if (targets.primary !== team) item.style.background = "";
            };
            item.onclick = () => {
                targets.primary = team;
                saveTargets(targets);
                updateButtonStates();
                menu.remove();
            };
            menu.appendChild(item);
        });

        document.body.appendChild(menu);

        const closeMenu = () => menu.remove();
        setTimeout(() => document.addEventListener("click", closeMenu, { once: true }), 100);
    }

    /****************************************
     * TARGET SELECTOR POPUP
     ****************************************/
    function createSetTargetsPanel() {
        const existing = document.getElementById("targets-panel");
        if (existing) existing.remove();

        const panel = document.createElement("div");
        panel.id = "targets-panel";
        panel.style.cssText = `
            position: fixed;
            top: 50%; left: 50%;
            transform: translate(-50%, -50%);
            background: #222;
            color: white;
            padding: 20px;
            border-radius: 8px;
            width: 320px;
            z-index: 9999999;
            box-shadow: 0 4px 20px rgba(0,0,0,0.5);
            max-height: 80vh;
            overflow-y: auto;
        `;

        let historyHtml = "";
        const history = loadHistory();
        if (history.length > 0) {
            historyHtml = `
                <div style="margin-bottom:15px;padding-bottom:15px;border-bottom:1px solid #444;">
                    <label style="display:block;margin-bottom:8px;font-weight:bold;color:#4CAF50;">Recent Targets:</label>
                    ${history.map((h, i) => `
                        <div class="history-item" data-index="${i}" style="padding:6px;background:#333;margin-bottom:4px;border-radius:4px;cursor:pointer;font-size:12px;">
                            <div>P: ${h.primary} ${h.secondary !== "None" ? "| S: " + h.secondary : ""} ${h.farm !== "None" ? "| F: " + h.farm : ""}</div>
                        </div>
                    `).join("")}
                </div>
            `;
        }

        let presetsHtml = "";
        if (presets.length > 0) {
            presetsHtml = `
                <div style="margin-bottom:15px;padding-bottom:15px;border-bottom:1px solid #444;">
                    <label style="display:block;margin-bottom:8px;font-weight:bold;color:#2196F3;">Saved Presets:</label>
                    ${presets.map((p, i) => `
                        <div style="display:flex;gap:4px;margin-bottom:4px;">
                            <div class="preset-item" data-index="${i}" style="flex:1;padding:6px;background:#333;border-radius:4px;cursor:pointer;font-size:12px;">
                                <b>${p.name}</b>: ${p.targets.primary}
                            </div>
                            <button class="preset-delete" data-index="${i}" style="padding:4px 8px;background:#8b0000;color:white;border:none;border-radius:4px;cursor:pointer;">✕</button>
                        </div>
                    `).join("")}
                </div>
            `;
        }

        panel.innerHTML = `
            <h3 style="margin:0 0 15px 0;text-align:center;">Set Targets</h3>

            ${historyHtml}
            ${presetsHtml}

            <div style="margin-bottom:10px;">
                <label style="display:block;margin-bottom:4px;font-weight:bold;">Primary:</label>
                <select id="t-primary" style="width:100%;padding:6px;background:#333;color:white;border:1px solid #555;border-radius:4px;">
                    ${TEAM_OPTIONS.map(t=>`<option value="${t}">${t}</option>`).join("")}
                </select>
            </div>

            <div style="margin-bottom:10px;">
                <label style="display:block;margin-bottom:4px;font-weight:bold;">Secondary:</label>
                <select id="t-secondary" style="width:100%;padding:6px;background:#333;color:white;border:1px solid #555;border-radius:4px;">
                    ${TEAM_OPTIONS.map(t=>`<option value="${t}">${t}</option>`).join("")}
                </select>
            </div>

            <div style="margin-bottom:10px;">
                <label style="display:block;margin-bottom:4px;font-weight:bold;">Farm:</label>
                <select id="t-farm" style="width:100%;padding:6px;background:#333;color:white;border:1px solid #555;border-radius:4px;">
                    ${TEAM_OPTIONS.map(t=>`<option value="${t}">${t}</option>`).join("")}
                </select>
            </div>

            <div style="margin-bottom:15px;">
                <label style="display:block;margin-bottom:4px;font-weight:bold;">Custom Footer Text:</label>
                <textarea id="t-footer" style="width:100%;padding:6px;background:#333;color:white;border:1px solid #555;border-radius:4px;resize:vertical;min-height:50px;" placeholder="Optional text to append to all messages...">${customFooter}</textarea>
            </div>

            <div style="display:flex;gap:6px;margin-bottom:10px;">
                <input id="preset-name" type="text" placeholder="Preset name..." style="flex:1;padding:6px;background:#333;color:white;border:1px solid #555;border-radius:4px;">
                <button id="save-preset" style="padding:6px 12px;background:#2196F3;color:white;border:none;border-radius:4px;cursor:pointer;white-space:nowrap;">Save Preset</button>
            </div>

            <button id="t-save" style="width:100%;padding:8px;background:#4CAF50;color:white;border:none;border-radius:4px;cursor:pointer;font-weight:bold;margin-bottom:6px;">
                Save
            </button>
            <button id="t-close" style="width:100%;padding:8px;background:#555;color:white;border:none;border-radius:4px;cursor:pointer;">
                Cancel
            </button>
        `;

        document.body.appendChild(panel);

        document.getElementById("t-primary").value = targets.primary;
        document.getElementById("t-secondary").value = targets.secondary;
        document.getElementById("t-farm").value = targets.farm;

        // History items
        panel.querySelectorAll(".history-item").forEach(item => {
            item.onclick = () => {
                const h = history[parseInt(item.dataset.index)];
                document.getElementById("t-primary").value = h.primary;
                document.getElementById("t-secondary").value = h.secondary;
                document.getElementById("t-farm").value = h.farm;
            };
            item.onmouseenter = () => item.style.background = "#444";
            item.onmouseleave = () => item.style.background = "#333";
        });

        // Preset items
        panel.querySelectorAll(".preset-item").forEach(item => {
            item.onclick = () => {
                const p = presets[parseInt(item.dataset.index)];
                document.getElementById("t-primary").value = p.targets.primary;
                document.getElementById("t-secondary").value = p.targets.secondary;
                document.getElementById("t-farm").value = p.targets.farm;
            };
            item.onmouseenter = () => item.style.background = "#444";
            item.onmouseleave = () => item.style.background = "#333";
        });

        // Preset delete
        panel.querySelectorAll(".preset-delete").forEach(btn => {
            btn.onclick = () => {
                presets.splice(parseInt(btn.dataset.index), 1);
                savePresets(presets);
                panel.remove();
                createSetTargetsPanel();
            };
        });

        // Save preset
        document.getElementById("save-preset").onclick = () => {
            const name = document.getElementById("preset-name").value.trim();
            if (!name) {
                alert("Please enter a preset name");
                return;
            }
            const newPreset = {
                name: name,
                targets: {
                    primary: document.getElementById("t-primary").value,
                    secondary: document.getElementById("t-secondary").value,
                    farm: document.getElementById("t-farm").value
                }
            };
            presets.push(newPreset);
            savePresets(presets);
            panel.remove();
            createSetTargetsPanel();
        };

        document.getElementById("t-save").onclick = () => {
            targets.primary = document.getElementById("t-primary").value;
            targets.secondary = document.getElementById("t-secondary").value;
            targets.farm = document.getElementById("t-farm").value;
            customFooter = document.getElementById("t-footer").value;
            saveTargets(targets);
            saveFooter(customFooter);
            panel.remove();
            updateButtonStates();
        };

        document.getElementById("t-close").onclick = () => panel.remove();

        const escHandler = (e) => {
            if (e.key === "Escape") {
                panel.remove();
                document.removeEventListener("keydown", escHandler);
            }
        };
        document.addEventListener("keydown", escHandler);
    }

    /****************************************
     * MESSAGE TEMPLATES
     ****************************************/
    function addFooter(text) {
        if (customFooter) {
            return text + "\n\n" + customFooter;
        }
        return text;
    }

    function message_Hosp() {
        let out = [];
        out.push(`\nChoose HOSP Only`);
        out.push(`Primary: ${linkify(targets.primary)}`);
        if (targets.secondary !== "None")
            out.push(`Secondary: ${linkify(targets.secondary)}`);
        if (targets.farm !== "None")
            out.push(`Third: ${linkify(targets.farm)}`);
        return addFooter(out.join("\n"));
    }

    function message_Leave() {
        let out = [];
        out.push(`\nChoose LEAVE Only`);
        out.push(`Primary: ${linkify(targets.primary)}`);
        if (targets.secondary !== "None")
            out.push(`Secondary: ${linkify(targets.secondary)}`);
        if (targets.farm !== "None")
            out.push(`Third: ${linkify(targets.farm)}`);
        return addFooter(out.join("\n"));
    }

    function message_Tick(minutes) {
        let out = [];
        out.push(`\n${minutes} minute${minutes !== 1 ? 's' : ''} to next tick`);
        out.push(`Primary: ${linkify(targets.primary)}`);
        if (targets.secondary !== "None")
            out.push(`Secondary: ${linkify(targets.secondary)}`);
        if (targets.farm !== "None")
            out.push(`Third: ${linkify(targets.farm)}`);
        return addFooter(out.join("\n"));
    }

    function message_30s() {
        return addFooter(`\n30 seconds to PUSH!\nMED, Attack and HOLD`);
    }

    function message_1m() {
        let out = [`\n1 MINUTE WARNING!`];
        if (targets.primary !== "None")
            out.push(`Primary: ${linkify(targets.primary)}`);
        return addFooter(out.join("\n"));
    }

    function message_TargetList() {
        let out = [];
        if (targets.primary !== "None")
            out.push(`Primary: ${linkify(targets.primary)}`);
        if (targets.secondary !== "None")
            out.push(`Secondary: ${linkify(targets.secondary)}`);
        if (targets.farm !== "None")
            out.push(`Third: ${linkify(targets.farm)}`);
        return out.join("\n") || "No targets set";
    }

    /****************************************
     * BUTTON STATE MANAGEMENT
     ****************************************/
    function updateButtonStates() {
        document.querySelectorAll(".elim-gear-btn").forEach(btn => {
            const hasTargets = targets.primary !== "None" || targets.secondary !== "None" || targets.farm !== "None";
            btn.style.background = hasTargets ? "#2196F3" : "#333";
        });
    }

    /****************************************
     * PREVIEW TOOLTIP
     ****************************************/
    function showPreview(btn, messageFunc) {
        const preview = document.createElement("div");
        preview.className = "elim-preview";
        preview.style.cssText = `
            position: absolute;
            background: #1a1a1a;
            color: #fff;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 11px;
            white-space: pre-line;
            max-width: 300px;
            z-index: 999999;
            border: 1px solid #444;
            box-shadow: 0 2px 8px rgba(0,0,0,0.5);
            pointer-events: none;
        `;

        const rect = btn.getBoundingClientRect();
        preview.style.left = rect.left + "px";
        preview.style.top = (rect.top - 10) + "px";
        preview.style.transform = "translateY(-100%)";

        // Strip HTML for preview
        const msg = messageFunc().replace(/<[^>]*>/g, '');
        preview.textContent = msg;

        document.body.appendChild(preview);

        return preview;
    }

    /****************************************
     * BUTTONS
     ****************************************/
    function addButtonsToChat(chatBox) {
        if (!isElimChat(chatBox)) return;
        if (chatBox.querySelector(".elim-btn-container")) return;

        const footer = chatBox.querySelector('.root___WUd1h, .chat-box-footer___YK914');
        if (!footer) return;

        const row = document.createElement("div");
        row.className = "elim-btn-container";
        row.style = "display:flex;flex-wrap:wrap;gap:4px;margin:4px 0;";

        function btn(label, color="#555") {
            const b = document.createElement("button");
            b.textContent = label;
            b.style = `
                padding:3px 6px;
                background:${color};
                color:white;
                border:none;
                border-radius:4px;
                cursor:pointer;
                font-size:12px;
                transition:opacity 0.2s;
            `;
            b.onmouseenter = () => b.style.opacity = "0.8";
            b.onmouseleave = () => b.style.opacity = "1";
            return b;
        }

        // Target settings
        const hasTargets = targets.primary !== "None" || targets.secondary !== "None" || targets.farm !== "None";
        const gear = btn("⚙️", hasTargets ? "#2196F3" : "#333");
        gear.className = "elim-gear-btn";
        gear.onclick = createSetTargetsPanel;
        gear.oncontextmenu = createQuickEditMenu;
        gear.title = "Left: Settings | Right: Quick Primary";

        // Copy button
        const copyBtn = btn("📋", "#555");
        copyBtn.onclick = async () => {
            const text = message_TargetList();
            try {
                await navigator.clipboard.writeText(text);
                copyBtn.textContent = "✓";
                setTimeout(() => copyBtn.textContent = "📋", 1000);
            } catch (e) {}
        };
        copyBtn.title = "Copy target list";

        // Hosp
        const hospBtn = btn("Hosp", "#6a0dad");
        hospBtn.onclick = () => insertChat(chatBox, message_Hosp());
        hospBtn.title = "Send Hosp targets";
        let hospPreview = null;
        hospBtn.onmouseenter = () => hospPreview = showPreview(hospBtn, message_Hosp);
        hospBtn.onmouseleave = () => hospPreview?.remove();

        // Leave
        const leaveBtn = btn("Leave", "#b30000");
        leaveBtn.onclick = () => insertChat(chatBox, message_Leave());
        leaveBtn.title = "Send Leave targets";
        let leavePreview = null;
        leaveBtn.onmouseenter = () => leavePreview = showPreview(leaveBtn, message_Leave);
        leaveBtn.onmouseleave = () => leavePreview?.remove();

        // Timer buttons
        const b10 = btn("10m", "#444");
        b10.onclick = () => insertChat(chatBox, message_Tick(10));
        b10.title = "10 minute warning";
        let p10 = null;
        b10.onmouseenter = () => p10 = showPreview(b10, () => message_Tick(10));
        b10.onmouseleave = () => p10?.remove();

        const b5 = btn("5m", "#444");
        b5.onclick = () => insertChat(chatBox, message_Tick(5));
        b5.title = "5 minute warning";
        let p5 = null;
        b5.onmouseenter = () => p5 = showPreview(b5, () => message_Tick(5));
        b5.onmouseleave = () => p5?.remove();

        const b3 = btn("3m", "#444");
        b3.onclick = () => insertChat(chatBox, message_Tick(3));
        b3.title = "3 minute warning";
        let p3 = null;
        b3.onmouseenter = () => p3 = showPreview(b3, () => message_Tick(3));
        b3.onmouseleave = () => p3?.remove();

        const b2 = btn("2m", "#444");
        b2.onclick = () => insertChat(chatBox, message_Tick(2));
        b2.title = "2 minute warning";
        let p2 = null;
        b2.onmouseenter = () => p2 = showPreview(b2, () => message_Tick(2));
        b2.onmouseleave = () => p2?.remove();

        const b1 = btn("1m", "#ff6b00");
        b1.onclick = () => insertChat(chatBox, message_1m());
        b1.title = "1 minute warning";
        let p1 = null;
        b1.onmouseenter = () => p1 = showPreview(b1, message_1m);
        b1.onmouseleave = () => p1?.remove();

        const b30 = btn("30s PUSH", "#8b0000");
        b30.onclick = () => insertChat(chatBox, message_30s());
        b30.title = "30 second push warning";
        let p30 = null;
        b30.onmouseenter = () => p30 = showPreview(b30, message_30s);
        b30.onmouseleave = () => p30?.remove();

        row.append(gear, copyBtn, hospBtn, leaveBtn, b10, b5, b3, b2, b1, b30);
        footer.insertAdjacentElement("beforebegin", row);
    }

    /****************************************
     * OBSERVER
     ****************************************/
    const obs = new MutationObserver(() => {
        document.querySelectorAll('[id^="elimination-"]').forEach(addButtonsToChat);
    });
    obs.observe(document.body, { childList: true, subtree: true });

})();