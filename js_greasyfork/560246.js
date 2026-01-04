// ==UserScript==
// @name         abdullah-abbas City Mass Select
// @namespace    https://github.com/abdullah-abbas/wme-script
// @version      5.4
// @description  WME tool to select Segments and Venues by City Name
// @author       Abdullah Abbas
// @match        https://www.waze.com/editor*
// @match        https://www.waze.com/*/editor*
// @match        https://beta.waze.com/editor*
// @exclude      https://www.waze.com/user/editor*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560246/abdullah-abbas%20City%20Mass%20Select.user.js
// @updateURL https://update.greasyfork.org/scripts/560246/abdullah-abbas%20City%20Mass%20Select.meta.js
// ==/UserScript==

/* global W */

(function() {
    'use strict';

    const SCRIPT_TITLE = "abdullah-abbas City Mass Select";
    const UI_ID = "wme-abdullah-abbas-window";
    const CONTENT_ID = "wme-aa-content-area";
    const SETTINGS_KEY = "wme_aa_settings_en_v3";

    // --- UI Colors & Style ---
    const COLORS = {
        primary: "linear-gradient(135deg, #0078d7 0%, #00c6fb 100%)",
        bg: "#ffffff",
        text: "#333333",
        border: "#e0e0e0",
        btnScan: "#0078d7",
        btnDeselect: "#d32f2f"
    };

    let settings = {
        top: "80px",
        left: "350px",
        minimized: false,
        checkSegments: true,
        checkVenues: true
    };

    function bootstrap() {
        if (typeof W === 'undefined' || !W.map || !W.model) {
            setTimeout(bootstrap, 500);
            return;
        }
        init();
    }

    function init() {
        console.log(`${SCRIPT_TITLE}: Ready (v5.4)`);
        loadSettings();
        createUI();
    }

    function loadSettings() {
        const saved = localStorage.getItem(SETTINGS_KEY);
        if (saved) {
            try {
                settings = { ...settings, ...JSON.parse(saved) };
            } catch (e) {
                console.error("Error loading settings", e);
            }
        }
    }

    function saveSettings() {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    }

    function createUI() {
        if (document.getElementById(UI_ID)) return;

        const panel = document.createElement('div');
        panel.id = UI_ID;

        // Base Panel CSS
        panel.style.cssText = `
            position: fixed;
            top: ${settings.top};
            left: ${settings.left};
            z-index: 9999999;
            background: ${COLORS.bg};
            border-radius: 12px;
            font-family: "Rubik", "Boing", sans-serif;
            box-shadow: 0 8px 25px rgba(0,0,0,0.25);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            transition: width 0.3s, height 0.3s, border-radius 0.3s;
        `;

        if (settings.minimized) {
            applyMinimizedStyle(panel);
        } else {
            applyMaximizedStyle(panel);
        }

        // --- Header (Draggable) ---
        const header = document.createElement('div');
        header.id = UI_ID + "header";
        header.style.cssText = `
            padding: 0 15px;
            cursor: move;
            background: ${COLORS.primary};
            color: white;
            font-weight: bold;
            font-size: 13px;
            user-select: none;
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 45px;
            width: 100%;
            box-sizing: border-box;
        `;

        // Script Title Display
        const titleSpan = document.createElement('span');
        titleSpan.id = UI_ID + "title";
        titleSpan.innerText = SCRIPT_TITLE;
        // هنا نجعل النص يظهر كاملاً ولا ينكسر
        titleSpan.style.whiteSpace = "nowrap";
        titleSpan.style.flexGrow = "1"; // يأخذ المساحة المتاحة
        titleSpan.style.display = settings.minimized ? "none" : "block";
        header.appendChild(titleSpan);

        // Toggle Button (Icon)
        const toggleBtn = document.createElement('div');
        toggleBtn.id = UI_ID + "toggle";
        toggleBtn.innerHTML = settings.minimized ? "AA" : "—";
        toggleBtn.title = "Minimize/Maximize";
        toggleBtn.style.cssText = `
            cursor: pointer;
            font-weight: bold;
            font-size: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            min-width: 24px; height: 24px;
            background: rgba(255,255,255,0.2);
            border-radius: 50%;
            margin-left: 10px; /* مسافة بين الاسم والزر */
            transition: background 0.2s;
        `;
        toggleBtn.onmouseover = () => toggleBtn.style.background = "rgba(255,255,255,0.4)";
        toggleBtn.onmouseout = () => toggleBtn.style.background = "rgba(255,255,255,0.2)";

        toggleBtn.onclick = (e) => {
            e.stopPropagation();
            toggleWindowMode(panel);
        };
        header.ondblclick = () => toggleWindowMode(panel);

        header.appendChild(toggleBtn);
        panel.appendChild(header);

        // --- Content Area ---
        const content = document.createElement('div');
        content.id = CONTENT_ID;
        content.style.padding = "15px";
        content.style.display = settings.minimized ? "none" : "block";

        // Checkbox Options
        const optionsDiv = document.createElement('div');
        optionsDiv.style.cssText = "display:flex; justify-content:space-between; margin-bottom:12px; font-size:13px; color:#555;";

        const segLabel = document.createElement('label');
        segLabel.style.cursor = "pointer";
        segLabel.style.display = "flex";
        segLabel.style.alignItems = "center";
        segLabel.innerHTML = `<input type='checkbox' id='aa-opt-segments' ${settings.checkSegments ? "checked" : ""} style="margin-right:5px;"> Segments`;
        segLabel.onchange = saveCheckboxState;

        const venLabel = document.createElement('label');
        venLabel.style.cursor = "pointer";
        venLabel.style.display = "flex";
        venLabel.style.alignItems = "center";
        venLabel.innerHTML = `<input type='checkbox' id='aa-opt-venues' ${settings.checkVenues ? "checked" : ""} style="margin-right:5px;"> Venues`;
        venLabel.onchange = saveCheckboxState;

        optionsDiv.appendChild(segLabel);
        optionsDiv.appendChild(venLabel);
        content.appendChild(optionsDiv);

        // Scan Button
        const scanBtn = document.createElement('button');
        scanBtn.innerText = "🔎 Scan Map";
        scanBtn.style.cssText = `
            width: 100%; padding: 10px; margin-bottom: 8px; cursor: pointer;
            background: ${COLORS.btnScan}; color: white; border: none; border-radius: 6px;
            font-weight: bold; font-family: inherit; font-size: 13px;
            box-shadow: 0 2px 5px rgba(0,120,215,0.3);
            transition: transform 0.1s;
        `;
        scanBtn.onactive = () => scanBtn.style.transform = "scale(0.98)";
        scanBtn.onclick = runRobustScan;
        content.appendChild(scanBtn);

        // Deselect Button
        const deselectBtn = document.createElement('button');
        deselectBtn.innerText = "❌ Deselect All";
        deselectBtn.style.cssText = `
            width: 100%; padding: 8px; margin-bottom: 12px; cursor: pointer;
            background: white; border: 1px solid ${COLORS.btnDeselect}; color: ${COLORS.btnDeselect};
            border-radius: 6px; font-size: 12px; font-weight: bold;
        `;
        deselectBtn.onclick = () => W.selectionManager.unselectAll();
        content.appendChild(deselectBtn);

        // Results List
        const resultDiv = document.createElement('div');
        resultDiv.id = "aa-results-list";
        resultDiv.style.cssText = "max-height: 250px; overflow-y: auto; border-top: 1px solid #eee; padding-top: 10px;";
        resultDiv.innerHTML = "<div style='text-align:center; color:#999; font-size:12px; margin-top:10px;'>Results will appear here</div>";
        content.appendChild(resultDiv);

        panel.appendChild(content);
        document.body.appendChild(panel);

        makeDraggable(panel);
    }

    function applyMinimizedStyle(panel) {
        panel.style.width = "50px";
        panel.style.height = "50px";
        panel.style.borderRadius = "50%";
        panel.style.border = "3px solid #fff";
    }

    function applyMaximizedStyle(panel) {
        // --- التغيير هنا: زيادة العرض إلى 320px ---
        panel.style.width = "320px";
        panel.style.height = "auto";
        panel.style.borderRadius = "12px";
        panel.style.border = "none";
    }

    function toggleWindowMode(panel) {
        const content = document.getElementById(CONTENT_ID);
        const title = document.getElementById(UI_ID + "title");
        const toggleBtn = document.getElementById(UI_ID + "toggle");
        const header = document.getElementById(UI_ID + "header");

        settings.minimized = !settings.minimized;

        if (settings.minimized) {
            content.style.display = "none";
            title.style.display = "none";
            toggleBtn.innerHTML = "AA";
            toggleBtn.style.width = "100%";
            toggleBtn.style.height = "100%";
            toggleBtn.style.background = "transparent";
            toggleBtn.style.fontSize = "16px";
            toggleBtn.style.color = "white";
            header.style.padding = "0";
            header.style.height = "100%";
        } else {
            content.style.display = "block";
            title.style.display = "block";
            toggleBtn.innerHTML = "—";
            toggleBtn.style.width = "24px";
            toggleBtn.style.height = "24px";
            toggleBtn.style.background = "rgba(255,255,255,0.2)";
            header.style.padding = "0 15px";
            header.style.height = "45px";
        }

        updatePanelState(panel);
        saveSettings();
    }

    function updatePanelState(panel) {
        if (settings.minimized) applyMinimizedStyle(panel);
        else applyMaximizedStyle(panel);
    }

    function saveCheckboxState() {
        settings.checkSegments = document.getElementById('aa-opt-segments').checked;
        settings.checkVenues = document.getElementById('aa-opt-venues').checked;
        saveSettings();
    }

    function makeDraggable(elmnt) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        const header = document.getElementById(elmnt.id + "header");

        if (header) {
            header.onmousedown = dragMouseDown;
        }

        function dragMouseDown(e) {
            e = e || window.event;
            if(e.target.id === UI_ID + "toggle" && !settings.minimized) return;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
            elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
            settings.top = elmnt.style.top;
            settings.left = elmnt.style.left;
            saveSettings();
        }
    }

    function getRepo(repo) {
        if (!repo) return [];
        if (typeof repo.getObjectArray === 'function') return repo.getObjectArray();
        if (repo.objects) return Object.values(repo.objects);
        return [];
    }

    function resolveCityNameForEntity(entity, cityCache) {
        const attr = entity.attributes || entity;
        let streetID = attr.primaryStreetID || attr.streetID;

        if (!streetID) return "Unlinked";

        let st = W.model.streets.getObjectById(streetID);
        if (!st && W.model.streets.objects) st = W.model.streets.objects[streetID];

        if (st) {
            const cID = st.attributes ? st.attributes.cityID : st.cityID;
            if (cID && cityCache[cID]) return cityCache[cID];
            else if (cID) return "City not loaded";
            else return "No City";
        }
        return "Street not loaded";
    }

    function runRobustScan() {
        const resultDiv = document.getElementById('aa-results-list');
        resultDiv.innerHTML = "<div style='text-align:center; padding:10px; color:#888;'>Processing...</div>";

        const doSegments = document.getElementById('aa-opt-segments').checked;
        const doVenues = document.getElementById('aa-opt-venues').checked;

        if (!doSegments && !doVenues) {
            resultDiv.innerHTML = "<div style='color:red; text-align:center;'>Please select a type!</div>";
            return;
        }

        setTimeout(() => {
            try {
                const cityCache = {};
                const cities = getRepo(W.model.cities);
                cities.forEach(c => {
                    const a = c.attributes || c;
                    cityCache[a.id] = a.isEmpty ? "No City" : (a.name || "Unknown Name");
                });

                const extent = W.map.getExtent();
                const groups = {};
                let visibleCount = 0;

                const processEntity = (entity) => {
                    if (entity.geometry && extent.intersectsBounds(entity.geometry.getBounds())) {
                        visibleCount++;
                        const cName = resolveCityNameForEntity(entity, cityCache);
                        if (!groups[cName]) groups[cName] = [];
                        groups[cName].push(entity);
                    }
                };

                if (doSegments) getRepo(W.model.segments).forEach(processEntity);
                if (doVenues) getRepo(W.model.venues).forEach(processEntity);

                resultDiv.innerHTML = "";
                if (visibleCount === 0) {
                    resultDiv.innerHTML = "<div style='text-align:center; color:#999; font-size:12px; padding:15px;'>No visible items found.</div>";
                    return;
                }

                Object.keys(groups).sort().forEach(name => {
                    const count = groups[name].length;
                    const isNoCity = (name === "No City" || name === "Unlinked");

                    const btn = document.createElement('div');
                    btn.innerHTML = `
                        <span style="font-weight:bold;">${name}</span>
                        <span style="background:rgba(0,0,0,0.06); padding:2px 8px; border-radius:12px; font-size:11px; color:#555;">${count}</span>
                    `;

                    btn.style.cssText = `
                        display: flex; justify-content: space-between; align-items: center;
                        width: 100%; margin-bottom: 6px; padding: 10px;
                        cursor: pointer; border-radius: 6px; box-sizing: border-box;
                        border: 1px solid ${isNoCity ? '#eee' : '#bce8f1'};
                        background-color: ${isNoCity ? '#f9f9f9' : '#e3f2fd'};
                        color: ${isNoCity ? '#777' : '#1565c0'};
                        font-size: 13px; transition: all 0.2s;
                    `;

                    btn.onmouseover = () => {
                        btn.style.backgroundColor = isNoCity ? '#f0f0f0' : '#bbdefb';
                        btn.style.transform = "translateX(2px)";
                    };
                    btn.onmouseout = () => {
                        btn.style.backgroundColor = isNoCity ? '#f9f9f9' : '#e3f2fd';
                        btn.style.transform = "none";
                    };

                    btn.onclick = () => W.selectionManager.setSelectedModels(groups[name]);
                    resultDiv.appendChild(btn);
                });

            } catch (e) {
                console.error(e);
                resultDiv.innerHTML = `<div style='color:red; font-size:11px;'>Error: ${e.message}</div>`;
            }
        }, 50);
    }

    bootstrap();
})();