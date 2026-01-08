// ==UserScript==
// @name         Colby Course Planner (V22 - Gold Master)
// @namespace    http://tampermonkey.net/
// @version      22.0
// @description  The complete planner with saved filters, smart chips, and conflict management.
// @match        https://wd5.myworkday.com/colby/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/561872/Colby%20Course%20Planner%20%28V22%20-%20Gold%20Master%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561872/Colby%20Course%20Planner%20%28V22%20-%20Gold%20Master%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let config = {
        paginationUri: null,
        clientRequestID: "init_id"
    };
    let isRunning = false;

    // --- 1. INJECT BUTTON ---
    const btn = document.createElement("button");
    btn.innerText = "⏳ WAITING... (Scroll down once)";
    btn.style.cssText = "position:fixed; bottom:20px; right:20px; z-index:99999; padding:15px 20px; background:#555; color:white; font-weight:bold; border:none; border-radius:8px; font-family:sans-serif; box-shadow:0 4px 12px rgba(0,0,0,0.3); cursor:not-allowed; transition:all 0.3s ease;";
    document.body.appendChild(btn);

    // --- 2. API SNIFFER ---
    const XHR = XMLHttpRequest.prototype;
    const open = XHR.open;
    const send = XHR.send;

    XHR.open = function(method, url) {
        this._url = url;
        return open.apply(this, arguments);
    };

    XHR.send = function(postData) {
        this.addEventListener('load', function() {
            if (this.responseText && (this._url.includes("flowController") || this._url.includes("faceted-search"))) {
                try {
                    const data = JSON.parse(this.responseText);
                    let endpoints = data.body?.endPoints || data.endPoints || [];
                    const paginator = endpoints.find(e => e.type === "Pagination");

                    if (paginator && !config.paginationUri) {
                        config.paginationUri = paginator.uri;
                        console.log("✅ API Found:", config.paginationUri);

                        btn.innerText = "🚀 DOWNLOAD & LAUNCH PLANNER";
                        btn.style.backgroundColor = "#005cb9";
                        btn.style.cursor = "pointer";
                        btn.onclick = startScrape;
                    }
                } catch (e) {}
            }
        });
        return send.apply(this, arguments);
    };

    // --- 3. SCRAPER ---
    async function startScrape() {
        if (isRunning) return;
        isRunning = true;
        btn.disabled = true;

        let rawData = [];
        let offset = 0;
        const batchSize = 50;
        let keepGoing = true;
        const sessionID = crypto.randomUUID().replace(/-/g, '');

        while (keepGoing) {
            btn.innerText = `🔄 Fetching ${offset}... (${rawData.length} found)`;

            const url = `${config.paginationUri}/${offset}.htmld?clientRequestID=${sessionID}`;
            try {
                const res = await fetch(url, { headers: { "Content-Type": "application/json" } });
                const json = await res.json();

                let items = [];
                if (json.body?.children?.[0]?.listItems) items = json.body.children[0].listItems;
                else if (json.children?.[0]?.listItems) items = json.children[0].listItems;
                else if (Array.isArray(json) && json[0]?.widget === 'templatedListItem') items = json;

                if (items.length === 0) {
                    keepGoing = false;
                } else {
                    rawData = rawData.concat(items);
                    offset += batchSize;
                    await new Promise(r => setTimeout(r, 200));
                }
            } catch (e) {
                console.error("Scrape Error", e);
                keepGoing = false;
            }
        }

        btn.innerText = "⚡ Processing...";
        const processedCourses = processCourses(rawData);
        localStorage.setItem("colby_course_db", JSON.stringify(processedCourses));

        launchPlanner();

        btn.innerText = "✅ LAUNCHED";
        btn.style.backgroundColor = "#28a745";
    }

    // --- 4. PARSER ---
    function processCourses(rawItems) {
        return rawItems.map(item => {
            const allFields = [...(item.subtitles || []), ...(item.detailResultFields || [])];

            const getVal = (label) => {
                const f = allFields.find(x => x.label && x.label.toLowerCase().includes(label.toLowerCase()));
                if (!f) return "";
                if (f.instances) return f.instances.map(i => i.text).join(" | ");
                if (f.value) return String(f.value).replace(/<[^>]*>?/gm, '');
                return "";
            };

            const titleFull = item.title?.instances?.[0]?.text || "Unknown";
            const parts = titleFull.split(" - ");
            const code = parts[0] || "UNK";
            const name = parts.slice(1).join(" - ") || titleFull;

            // Time Parsing
            const scheduleField = allFields.find(x => x.label && x.label.includes("Section Details"));
            let timeBlocks = [];
            let displayTime = "TBA";

            if (scheduleField && scheduleField.instances) {
                timeBlocks = scheduleField.instances.map(inst => parseTime(inst.text)).filter(x => x !== null).flat();
                displayTime = scheduleField.instances.map(inst => {
                    const p = inst.text.split('|').map(s => s.trim());
                    return p.length >= 2 ? `${p[0]} ${p[1]}` : p[0];
                }).join(", ");
            }

            // Credits Parsing
            let creds = 0;
            const credStr = getVal("Credits");
            const credMatch = credStr.match(/\d+/);
            if (credMatch) creds = parseInt(credMatch[0]);

            // Tag Parsing
            const tagField = allFields.find(x => x.label && x.label.includes("Course Tags"));
            let cleanTags = [];
            if (tagField && tagField.instances) {
                cleanTags = tagField.instances.map(t => {
                    let tag = t.text.replace(/Distribution :: |Theme :: /g, "").trim();
                    // Shorten common long tags
                    if (tag === "Quantitative Reasoning") return "Quant";
                    if (tag === "Historical Studies") return "Hist";
                    if (tag === "Natural Sciences") return "Sci";
                    if (tag === "Social Sciences") return "SocSci";
                    if (tag === "Literature") return "Lit";
                    return tag;
                });
            }

            return {
                id: code,
                name: name,
                instructor: getVal("Instructor"),
                status: getVal("Status"),
                credits: creds,
                displayTime: displayTime,
                description: getVal("Description"),
                prereqs: getVal("Eligibility Rule"),
                tags: cleanTags,
                blocks: timeBlocks
            };
        });
    }

    function parseTime(timeStr) {
        const parts = timeStr.split('|').map(s => s.trim());
        if (parts.length < 2) return null;

        const dayStr = parts[0];
        const timeRange = parts[1];
        if (!timeRange.includes('-')) return null;

        const [startStr, endStr] = timeRange.split('-').map(s => s.trim());

        const getRow = (t) => {
            const [h, m] = t.split(':').map(Number);
            return (h - 8) * 4 + (m / 15) + 1;
        };

        const startRow = Math.floor(getRow(startStr));
        const endRow = Math.ceil(getRow(endStr));

        const dayMap = { 'M': 1, 'T': 2, 'W': 3, 'R': 4, 'F': 5 };
        const days = dayStr.split('').filter(d => dayMap[d]);

        return days.map(d => ({
            day: dayMap[d],
            start: startRow,
            end: endRow,
            text: timeRange
        }));
    }

    // --- 5. PLANNER UI ---
    function launchPlanner() {
        const win = window.open("", "_blank");
        if (!win) { alert("Pop-up blocked! Allow pop-ups for Workday."); return; }

        const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Colby Course Planner</title>
            <style>
                :root { --bg: #f4f6f8; --card: #fff; --primary: #005cb9; --border: #dfe3e6; --red: #d32f2f; --orange: #f57f17; --highlight: #9c27b0; }
                body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background: var(--bg); height: 100vh; display: flex; overflow: hidden; }

                #sidebar { width: 380px; background: var(--card); border-right: 1px solid var(--border); display: flex; flex-direction: column; z-index: 5; box-shadow: 2px 0 10px rgba(0,0,0,0.05); }
                #controls { padding: 15px; border-bottom: 1px solid var(--border); background: #fcfcfc; }

                #tabs { display: flex; margin-bottom: 10px; gap: 5px; }
                .tab { flex: 1; padding: 8px; text-align: center; background: #eee; border-radius: 4px; cursor: pointer; font-size: 13px; font-weight: 500; color: #666; transition: 0.2s; }
                .tab.active { background: var(--primary); color: white; }

                /* Filter Bar */
                .filters-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px; }
                .filters-header span { font-size: 11px; font-weight: bold; color: #888; text-transform: uppercase; }
                .reset-link { font-size: 11px; color: var(--red); cursor: pointer; text-decoration: none; }
                .reset-link:hover { text-decoration: underline; }

                #quick-filters { display: flex; gap: 5px; overflow-x: auto; padding-bottom: 8px; margin-bottom: 5px; scrollbar-width: none; }
                #quick-filters::-webkit-scrollbar { display: none; }
                .chip {
                    padding: 4px 10px; font-size: 11px; background: #eee; border-radius: 12px; white-space: nowrap; cursor: pointer; border: 1px solid transparent; user-select: none;
                }
                .chip:hover { background: #e0e0e0; }
                .chip.active { background: #e3f2fd; color: var(--primary); border-color: var(--primary); font-weight: 600; }

                #search-input { width: 100%; padding: 10px; border: 1px solid var(--border); border-radius: 6px; font-size: 14px; margin-bottom: 5px; box-sizing: border-box; }
                #result-count { font-size: 11px; color: #666; margin-bottom: 10px; text-align: right; }

                .filter-row { display: flex; gap: 10px; margin-bottom: 5px; }
                .toggle-btn {
                    flex: 1; padding: 6px; font-size: 11px; border: 1px solid var(--border); border-radius: 4px;
                    background: #fff; cursor: pointer; text-align: center; color: #555; user-select: none;
                }
                .toggle-btn.active { background: #e3f2fd; color: var(--primary); border-color: var(--primary); font-weight: 600; }

                #filter-status { font-size: 12px; color: var(--highlight); margin-top: 5px; font-weight: 600; display: none; cursor: pointer; text-align: center; padding: 5px; background: #f3e5f5; border-radius: 4px; }

                #course-list { flex: 1; overflow-y: auto; padding: 10px; }

                .course-card { padding: 12px; border: 1px solid var(--border); border-radius: 6px; margin-bottom: 8px; cursor: pointer; transition: all 0.1s; background: #fff; position: relative; }
                .course-card:hover { border-color: var(--primary); transform: translateY(-1px); box-shadow: 0 2px 5px rgba(0,0,0,0.05); }
                .course-card.added { background: #e3f2fd; border-color: var(--primary); }
                .course-card h4 { margin: 0 0 4px 0; font-size: 14px; color: #333; font-weight: 600; }
                .course-card .meta { font-size: 12px; color: #666; margin-bottom: 4px; display: flex; justify-content: space-between; }
                .course-card .time { font-size: 11px; color: #444; font-weight: 500; background: #f0f0f0; padding: 2px 6px; border-radius: 3px; display: inline-block; }

                .badge { padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: bold; text-transform: uppercase; }
                .badge.Open { background: #e6fffa; color: #00796b; }
                .badge.Waitlist { background: #fff8e1; color: #f57f17; }
                .badge.Closed { background: #ffebee; color: #c62828; }
                .badge.req { background: #eee; color: #666; border: 1px solid #ddd; text-transform: none; font-weight: normal; cursor: help; }
                .badge.noprereq { background: #f1f8e9; color: #33691e; border: 1px solid #dcedc8; text-transform: none; }
                .tags-row { margin-top: 6px; display: flex; flex-wrap: wrap; gap: 4px; }
                .tag-chip { font-size: 10px; background: #f5f5f5; color: #555; padding: 2px 6px; border-radius: 4px; border: 1px solid #eee; }
                .prereq-row { font-size: 11px; margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 4px; }

                #main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
                #header { height: 50px; background: var(--card); border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; padding: 0 20px; }
                #stats { font-size: 14px; font-weight: 500; color: #444; }
                #clear-btn { padding: 6px 12px; background: #fff; border: 1px solid var(--red); color: var(--red); border-radius: 4px; cursor: pointer; font-size: 12px; }
                #clear-btn:hover { background: var(--red); color: white; }

                #tba-container { padding: 10px 20px; background: #fff8e1; border-bottom: 1px solid #ffecb3; display: none; font-size: 13px; color: #663c00; }
                #calendar-wrapper { flex: 1; overflow-y: auto; padding: 20px; position: relative; }

                #grid { display: grid; grid-template-columns: 50px repeat(5, 1fr); grid-template-rows: 30px repeat(60, 20px); gap: 1px; background: var(--border); border: 1px solid var(--border); min-width: 800px; margin-bottom: 50px; user-select: none; }
                .cell { background: var(--card); cursor: pointer; }
                .cell:hover { background: #fafafa; }
                .header-day { background: #f8f9fa; font-weight: bold; text-align: center; padding: 5px; font-size: 13px; position: sticky; top: 0; z-index: 10; border-bottom: 1px solid var(--border); }
                .time-col { grid-column: 1; font-size: 11px; color: #888; text-align: right; padding-right: 8px; transform: translateY(-7px); }

                .event { margin: 1px; padding: 4px; font-size: 11px; border-radius: 4px; color: #fff; overflow: hidden; display: flex; flex-direction: column; justify-content: center; box-shadow: 0 1px 3px rgba(0,0,0,0.2); cursor: pointer; z-index: 5; border: 1px solid transparent; }
                .event.conflict-hard { box-shadow: inset 0 0 0 2px var(--red); z-index: 20; }
                .event.conflict-soft { box-shadow: inset 0 0 0 2px var(--orange); z-index: 15; }
                .type-waitlist { background-image: repeating-linear-gradient(45deg, rgba(255,255,255,0.3) 0px, rgba(255,255,255,0.3) 10px, transparent 10px, transparent 20px); opacity: 0.95; }

                .ghost { background: rgba(100, 100, 100, 0.2); border: 2px dashed #666; pointer-events: none; z-index: 4; border-radius: 4px; }
                .ghost.conflict { background: rgba(211, 47, 47, 0.2); border-color: var(--red); }
                .filter-highlight { background: rgba(156, 39, 176, 0.15); border: 2px solid var(--highlight); z-index: 3; pointer-events: auto; cursor: pointer; border-radius: 4px; }

                .wl-badge { display: inline-block; background: rgba(0,0,0,0.3); padding: 1px 3px; border-radius: 3px; font-size: 9px; font-weight: bold; margin-left: 4px; vertical-align: text-top; }

            </style>
        </head>
        <body>
            <div id="sidebar">
                <div id="controls">
                    <div id="tabs">
                        <div class="tab active" id="tab-all" onclick="setTab('all')">All Courses</div>
                        <div class="tab" id="tab-my" onclick="setTab('my')">My List</div>
                    </div>

                    <div class="filters-header">
                        <span>Filters</span>
                        <span class="reset-link" onclick="resetFilters()">Reset</span>
                    </div>
                    <div id="quick-filters"></div>

                    <input type="text" id="search-input" placeholder="Search code, title, prof...">
                    <div id="result-count"></div>

                    <div class="filter-row">
                        <div id="btn-conflict" class="toggle-btn" onclick="toggleFilter('conflict')">Hide Conflicts</div>
                        <div id="btn-prereq" class="toggle-btn" onclick="toggleFilter('prereq')">No Prereqs</div>
                    </div>
                    <div id="filter-status" onclick="clearSlotFilter()">FILTER ACTIVE: Click to Clear ✕</div>
                </div>
                <div id="course-list"></div>
            </div>
            <div id="main">
                <div id="header">
                    <h3>Colby Planner</h3>
                    <div style="display:flex; gap:15px; align-items:center;">
                        <div id="stats">0 Courses | 0 Credits</div>
                        <button id="clear-btn" onclick="clearSchedule()">Clear All</button>
                    </div>
                </div>
                <div id="tba-container">⚠️ <b>TBA / Unscheduled:</b> <span id="tba-list"></span></div>
                <div id="calendar-wrapper">
                    <div id="grid">
                        <div class="cell"></div>
                        <div class="header-day">Mon</div><div class="header-day">Tue</div><div class="header-day">Wed</div><div class="header-day">Thu</div><div class="header-day">Fri</div>
                    </div>
                </div>
            </div>

            <script>
                let db = [];
                let mySchedule = [];
                let currentTab = 'all';
                let currentOccupied = new Set();
                let selectedSlot = null;
                let activeFilters = { conflict: false, prereq: false };
                let activeTags = new Set();

                function init() {
                    try {
                        db = JSON.parse(localStorage.getItem('colby_course_db'));
                        if(!db) throw new Error();
                    } catch(e) { document.body.innerHTML = "<h1>No data. Run script on Workday first.</h1>"; return; }

                    // Load State
                    mySchedule = JSON.parse(localStorage.getItem('colby_draft_schedule')) || [];
                    const savedState = JSON.parse(localStorage.getItem('colby_planner_state')) || {};

                    if(savedState.tab) setTab(savedState.tab, false);
                    if(savedState.filters) {
                        activeFilters = savedState.filters;
                        if(activeFilters.conflict) document.getElementById('btn-conflict').classList.add('active');
                        if(activeFilters.prereq) document.getElementById('btn-prereq').classList.add('active');
                    }
                    if(savedState.tags) activeTags = new Set(savedState.tags);

                    initTagFilters();
                    buildGridStructure();
                    renderApp();

                    document.getElementById('search-input').addEventListener('input', () => renderList());
                }

                function saveState() {
                    const state = {
                        tab: currentTab,
                        filters: activeFilters,
                        tags: [...activeTags]
                    };
                    localStorage.setItem('colby_planner_state', JSON.stringify(state));
                }

                function initTagFilters() {
                    const tagCounts = {};
                    db.forEach(c => c.tags.forEach(t => tagCounts[t] = (tagCounts[t]||0) + 1));
                    const sortedTags = Object.keys(tagCounts).sort((a,b) => tagCounts[b] - tagCounts[a]).slice(0, 15);

                    // Manually add "4 Credits" to the front
                    const displayTags = ["4 Credits", ...sortedTags];

                    const container = document.getElementById('quick-filters');
                    container.innerHTML = "";

                    displayTags.forEach(t => {
                        const chip = document.createElement('div');
                        chip.className = 'chip' + (activeTags.has(t) ? ' active' : '');
                        chip.innerText = t;
                        chip.onclick = () => {
                            if(activeTags.has(t)) {
                                activeTags.delete(t);
                                chip.classList.remove('active');
                            } else {
                                activeTags.add(t);
                                chip.classList.add('active');
                            }
                            saveState();
                            renderList();
                        };
                        container.appendChild(chip);
                    });
                }

                function resetFilters() {
                    activeTags.clear();
                    activeFilters = { conflict: false, prereq: false };
                    document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
                    document.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
                    clearSlotFilter();
                    saveState();
                    renderList();
                }

                function setTab(tab, render=true) {
                    currentTab = tab;
                    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                    document.getElementById('tab-'+tab).classList.add('active');
                    if(render) {
                        document.getElementById('search-input').value = "";
                        saveState();
                        renderList();
                    }
                }

                function toggleFilter(type) {
                    activeFilters[type] = !activeFilters[type];
                    document.getElementById('btn-'+type).classList.toggle('active');
                    saveState();
                    renderList();
                }

                function renderApp() {
                    renderCalendar();
                    renderList();
                    updateStats();
                }

                function isOpen(c) {
                    return c.status && c.status.toLowerCase().includes("open");
                }

                function renderList() {
                    const container = document.getElementById('course-list');
                    container.innerHTML = "";
                    const term = document.getElementById('search-input').value.toLowerCase();

                    let source = currentTab === 'my' ? db.filter(c => mySchedule.includes(c.id)) : db;

                    let filtered = source.filter(c => {
                        if (!c.id.toLowerCase().includes(term) &&
                            !c.name.toLowerCase().includes(term) &&
                            !c.instructor.toLowerCase().includes(term)) return false;

                        if (activeFilters.prereq && c.prereqs && c.prereqs.trim() !== "") return false;

                        // Tag Filters
                        if (activeTags.size > 0) {
                            const hasAllTags = [...activeTags].every(tag => {
                                if (tag === '4 Credits') return c.credits === 4;
                                return c.tags.includes(tag);
                            });
                            if (!hasAllTags) return false;
                        }

                        if (activeFilters.conflict && !mySchedule.includes(c.id)) {
                             const hasConflict = c.blocks.some(b => {
                                for (let r = b.start; r < b.end; r++) {
                                    if (currentOccupied.has(\`\${b.day}-\${r}\`)) return true;
                                }
                                return false;
                             });
                             if (hasConflict) return false;
                        }

                        return true;
                    });

                    if (selectedSlot) {
                        filtered = filtered.filter(c => {
                            const slotStart = selectedSlot.row;
                            const slotEnd = selectedSlot.row + 4;
                            return c.blocks.some(b =>
                                b.day === selectedSlot.day &&
                                Math.max(b.start, slotStart) < Math.min(b.end, slotEnd)
                            );
                        });
                        document.getElementById('filter-status').style.display = 'block';
                        const days = ['Mon','Tue','Wed','Thu','Fri'];
                        const h = Math.floor((selectedSlot.row-1)/4) + 8;
                        const timeStr = \`\${h > 12 ? h-12 : h}:00 \${h>=12?'PM':'AM'}\`;
                        document.getElementById('filter-status').innerText = \`FILTERING: \${days[selectedSlot.day-1]} @ \${timeStr} (Click to Clear)\`;
                    } else {
                        document.getElementById('filter-status').style.display = 'none';
                    }

                    document.getElementById('result-count').innerText = \`Showing \${filtered.length} of \${source.length} courses\`;

                    filtered.slice(0, 100).forEach(c => {
                        const div = document.createElement('div');
                        const isAdded = mySchedule.includes(c.id);
                        div.className = "course-card" + (isAdded ? " added" : "");

                        let prereqHtml = (!c.prereqs || c.prereqs.trim() === "")
                            ? '<span class="badge noprereq">🟢 No Prereqs</span>'
                            : \`<span class="badge req" title="\${c.prereqs}">🔒 \${c.prereqs}</span>\`;

                        let tagHtml = c.tags.slice(0, 4).map(t => \`<span class="tag-chip">\${t}</span>\`).join("");

                        div.innerHTML = \`
                            <h4>\${c.id} \${c.name}</h4>
                            <div class="meta">
                                <span>\${c.instructor}</span>
                                <span class="badge \${c.status.split(' ')[0]}">\${c.status}</span>
                            </div>
                            <div class="tags-row">\${tagHtml}</div>
                            <div class="prereq-row">\${prereqHtml}</div>
                            <div class="time">\${c.displayTime || 'TBA'}</div>
                        \`;
                        div.onclick = () => toggleCourse(c.id);
                        div.onmouseenter = () => showGhost(c);
                        div.onmouseleave = () => removeGhost();
                        container.appendChild(div);
                    });

                    if (filtered.length === 0) container.innerHTML = "<div style='padding:20px; text-align:center; color:#888'>No courses found.</div>";
                }

                // ... [Standard Grid/Calendar Logic] ...
                function buildGridStructure() {
                    const grid = document.getElementById('grid');
                    for (let i = 0; i < 60; i+=4) {
                        const hour = 8 + (i/4);
                        const timeDiv = document.createElement('div');
                        timeDiv.className = "time-col";
                        timeDiv.style.gridRow = \`\${i+2}\`;
                        timeDiv.innerText = \`\${hour > 12 ? hour-12 : hour} \${hour >= 12 ? 'PM' : 'AM'}\`;
                        grid.appendChild(timeDiv);
                    }
                    for (let col=1; col<=5; col++) {
                        const cell = document.createElement('div');
                        cell.className = "cell";
                        cell.style.gridColumn = col + 1;
                        cell.style.gridRow = "2 / span 60";
                        cell.onclick = (e) => handleSlotClick(e, col);
                        grid.appendChild(cell);
                    }
                }

                function handleSlotClick(e, day) {
                    if (e.target.classList.contains('event')) return;
                    const rect = e.target.getBoundingClientRect();
                    const y = e.clientY - rect.top;
                    const rawRow = Math.floor(y / 20) + 1;
                    const snappedRow = Math.floor((rawRow - 1) / 4) * 4 + 1;

                    if (selectedSlot && selectedSlot.day === day && selectedSlot.row === snappedRow) {
                        clearSlotFilter();
                    } else {
                        selectedSlot = { day: day, row: snappedRow };
                        renderFilterHighlight();
                        renderList();
                    }
                }

                function clearSlotFilter() {
                    selectedSlot = null;
                    document.querySelectorAll('.filter-highlight').forEach(el => el.remove());
                    renderList();
                }

                function renderFilterHighlight() {
                    document.querySelectorAll('.filter-highlight').forEach(el => el.remove());
                    if (!selectedSlot) return;
                    const el = document.createElement('div');
                    el.className = 'filter-highlight';
                    el.style.gridColumn = selectedSlot.day + 1;
                    el.style.gridRow = \`\${selectedSlot.row + 1} / span 4\`;
                    el.title = "Click to Clear Filter";
                    el.onclick = clearSlotFilter;
                    document.getElementById('grid').appendChild(el);
                }

                function renderCalendar() {
                    document.querySelectorAll('.event').forEach(e => e.remove());
                    const grid = document.getElementById('grid');
                    if(selectedSlot) renderFilterHighlight();

                    const activeCourses = db.filter(c => mySchedule.includes(c.id));
                    currentOccupied = new Set();
                    let tbaCourses = [];

                    activeCourses.forEach(c => {
                        if (c.blocks.length === 0) tbaCourses.push(c.id);
                        else c.blocks.forEach(b => {
                            for (let r = b.start; r < b.end; r++) currentOccupied.add(\`\${b.day}-\${r}\`);
                        });
                    });

                    activeCourses.forEach(c => {
                        const color = getColor(c.id);
                        const isThisOpen = isOpen(c);

                        c.blocks.forEach(b => {
                            let conflictClass = "";
                            const otherCourses = activeCourses.filter(oc => oc.id !== c.id);

                            otherCourses.forEach(oc => {
                                const isOtherOpen = isOpen(oc);
                                oc.blocks.forEach(ob => {
                                    if (ob.day === b.day && Math.max(b.start, ob.start) < Math.min(b.end, ob.end)) {
                                        if (isThisOpen && isOtherOpen) conflictClass = "conflict-hard";
                                        else if (conflictClass !== "conflict-hard") conflictClass = "conflict-soft";
                                    }
                                });
                            });

                            const el = document.createElement('div');
                            const typeClass = isThisOpen ? "" : "type-waitlist";
                            const wlBadge = isThisOpen ? "" : "<span class='wl-badge'>WL</span>";

                            el.className = \`event \${typeClass} \${conflictClass}\`;
                            el.style.backgroundColor = color;
                            el.style.gridColumn = b.day + 1;
                            el.style.gridRow = \`\${b.start + 1} / span \${b.end - b.start}\`;
                            el.innerHTML = \`<b>\${c.id}</b>\${wlBadge}<br>\${c.name.substring(0,25)}...\`;
                            el.title = \`\${c.name}\\n\${c.instructor}\\n\${b.text}\`;
                            el.onclick = () => toggleCourse(c.id);
                            grid.appendChild(el);
                        });
                    });

                    const tbaContainer = document.getElementById('tba-container');
                    if (tbaCourses.length > 0) {
                        tbaContainer.style.display = 'block';
                        document.getElementById('tba-list').innerText = tbaCourses.join(", ");
                    } else {
                        tbaContainer.style.display = 'none';
                    }
                }

                function showGhost(course) {
                    if (mySchedule.includes(course.id)) return;
                    const grid = document.getElementById('grid');
                    course.blocks.forEach(b => {
                        const el = document.createElement('div');
                        el.className = 'ghost';
                        for (let r = b.start; r < b.end; r++) {
                            if (currentOccupied.has(\`\${b.day}-\${r}\`)) {
                                el.classList.add('conflict');
                                break;
                            }
                        }
                        el.style.gridColumn = b.day + 1;
                        el.style.gridRow = \`\${b.start + 1} / span \${b.end - b.start}\`;
                        grid.appendChild(el);
                    });
                }

                function removeGhost() {
                    document.querySelectorAll('.ghost').forEach(e => e.remove());
                }

                function toggleCourse(id) {
                    if (mySchedule.includes(id)) {
                        mySchedule = mySchedule.filter(x => x !== id);
                    } else {
                        mySchedule.push(id);
                    }
                    localStorage.setItem('colby_draft_schedule', JSON.stringify(mySchedule));
                    renderApp();
                    removeGhost();
                }

                function updateStats() {
                    const active = db.filter(c => mySchedule.includes(c.id));
                    const totalCreds = active.reduce((acc, c) => acc + (c.credits||0), 0);
                    document.getElementById('stats').innerText = \`\${active.length} Courses | \${totalCreds} Credits\`;
                }

                function getColor(str) {
                    let hash = 0;
                    for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
                    const hue = Math.abs(hash % 360);
                    return \`hsl(\${hue}, 65%, 40%)\`;
                }

                function clearSchedule() {
                    if(confirm("Clear your entire schedule?")) {
                        mySchedule = [];
                        localStorage.setItem('colby_draft_schedule', "[]");
                        renderApp();
                    }
                }

                init();
            </script>
        </body>
        </html>
        `;

        win.document.write(html);
        win.document.close();
    }

})();