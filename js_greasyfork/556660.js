// ==UserScript==
// @name         Wanikani Show Level-up Time (Timeline + Collapsible)
// @namespace    http://tampermonkey.net/
// @version      2024-11-23-v5-collapsible
// @description  Adds the earliest date and time you can level-up to the dashboard, with a critical path timeline and collapsible kanji list.
// @author       https://www.wanikani.com/users/ctmf (updated for new dashboard)
// @match        https://www.wanikani.com/*
// @match        https://www.wanikani.com/dashboard
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wanikani.com
// @license      Don't post me on coding horror websites. Other than that, knock yourself out.
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/556660/Wanikani%20Show%20Level-up%20Time%20%28Timeline%20%2B%20Collapsible%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556660/Wanikani%20Show%20Level-up%20Time%20%28Timeline%20%2B%20Collapsible%29.meta.js
// ==/UserScript==

(function() {
    // Configuration
    const START_COLLAPSED = false; // Set to true if you want the kanji list hidden by default

    // Time constants
    const TIME_ON_4 = 169200000;
    const TIME_ON_3 = 82800000;
    const TIME_ON_2 = 28800000;
    const TIME_ON_1 = 14400000;

    var TTLU_output_date;

    function fetch_items() {
        var config = {
            wk_items: {
                options: {assignments: true},
                filters: {item_type: 'kan, rad',}
            }};
        wkof.ItemData.get_items(config)
            .then(process_items)
            .then(display_results);
    }

    function process_items(items) {
        // [Logic remains the same as previous version]
        function time_until_guru(obj) {
            if (obj.assignments == undefined) obj.assignments = {'srs_stage': 0};
            return obj.assignments.srs_stage >= 5 ? 0
                : obj.assignments.srs_stage > 0 ? add_levels_time(obj.assignments.srs_stage, obj.assignments.available_at)
                : obj.data.component_subject_ids == undefined ? TIME_ON_1 + TIME_ON_2 + TIME_ON_3 + TIME_ON_4
                : add_longest_radical(obj.data.component_subject_ids) + TIME_ON_1 + TIME_ON_2 + TIME_ON_3 + TIME_ON_4;
        }

        function add_levels_time(stage, next_rev) {
            var result = new Date(Date.parse(next_rev)) - new Date();
            if (result < 0) result = 0;
            switch (stage) {
                case 1: result += TIME_ON_2;
                case 2: result += TIME_ON_3;
                case 3: result += TIME_ON_4;
            }
            return result;
        }

        function add_longest_radical(components) {
            function isInList(element, list) {return !((list.find((e) => e === element)) == undefined);}
            var relevant_rads = items.filter((e) => isInList(e.id, components));
            if (relevant_rads.length === 0) return 0;
            return relevant_rads.map(time_until_guru).reduce((a, b) => Math.max(a, b), 0);
        }

        function ttg_to_date(obj) {
            if (obj.ttg == 0) {
                obj.guru_date = new Date(obj.assignments.passed_at);
            } else {
                obj.guru_date = new Date(Date.now() + obj.ttg);
                obj.guru_date.setMinutes(0); obj.guru_date.setSeconds(0); obj.guru_date.setMilliseconds(0);
            }
            return obj;
        }

        function generate_timeline(target_kanji) {
            let timeline = [];
            function project_reviews(item_name, start_stage, start_date) {
                let current_time = new Date(start_date);
                if (current_time < new Date()) current_time = new Date();
                let loop_stage = start_stage;

                if (loop_stage === 0) {
                    timeline.push({ date: new Date(current_time), name: item_name, info: "Unlock / Lesson" });
                    current_time = new Date(current_time.getTime() + TIME_ON_1);
                    loop_stage = 1;
                } else if (item_name.includes("Kanji") && target_kanji.assignments.available_at) {
                    let next_rev = new Date(target_kanji.assignments.available_at);
                     if (next_rev < new Date()) next_rev = new Date();
                    current_time = next_rev;
                }

                if (loop_stage === 1) { timeline.push({ date: new Date(current_time), name: item_name, info: "Apprentice 1 → 2" }); current_time = new Date(current_time.getTime() + TIME_ON_2); loop_stage++; }
                if (loop_stage === 2) { timeline.push({ date: new Date(current_time), name: item_name, info: "Apprentice 2 → 3" }); current_time = new Date(current_time.getTime() + TIME_ON_3); loop_stage++; }
                if (loop_stage === 3) { timeline.push({ date: new Date(current_time), name: item_name, info: "Apprentice 3 → 4" }); current_time = new Date(current_time.getTime() + TIME_ON_4); loop_stage++; }
                if (loop_stage === 4) { timeline.push({ date: new Date(current_time), name: item_name, info: "Apprentice 4 → Guru" }); }
                return current_time;
            }

            let limiting_radical = null;
            if (target_kanji.assignments.srs_stage === 0 && target_kanji.data.component_subject_ids) {
                let max_ttg = -1;
                target_kanji.data.component_subject_ids.forEach(rid => {
                    let rad = items.find(i => i.id === rid);
                    if (rad) {
                        let ttg = time_until_guru(rad);
                        if (ttg > max_ttg) { max_ttg = ttg; limiting_radical = rad; }
                    }
                });
            }

            let chain_start_date = new Date();

            if (limiting_radical && limiting_radical.assignments.srs_stage < 5) {
                let rad_next_rev = limiting_radical.assignments.available_at ? new Date(limiting_radical.assignments.available_at) : new Date();
                let r_stage = limiting_radical.assignments.srs_stage;
                let r_time = rad_next_rev;
                let r_name = "Radical: " + limiting_radical.data.slug;

                if (r_stage === 1) { timeline.push({ date: new Date(r_time), name: r_name, info: "Appr 1 → 2" }); r_time = new Date(r_time.getTime() + TIME_ON_2); r_stage++; }
                if (r_stage === 2) { timeline.push({ date: new Date(r_time), name: r_name, info: "Appr 2 → 3" }); r_time = new Date(r_time.getTime() + TIME_ON_3); r_stage++; }
                if (r_stage === 3) { timeline.push({ date: new Date(r_time), name: r_name, info: "Appr 3 → 4" }); r_time = new Date(r_time.getTime() + TIME_ON_4); r_stage++; }
                if (r_stage === 4) { timeline.push({ date: new Date(r_time), name: r_name, info: "Appr 4 → Guru" }); }

                chain_start_date = r_time;
            } else if (target_kanji.assignments.srs_stage > 0) {
                chain_start_date = new Date(target_kanji.assignments.available_at);
            }

            let k_name = "Kanji: " + target_kanji.data.slug;
            let k_stage = target_kanji.assignments.srs_stage;
            project_reviews(k_name, k_stage, chain_start_date);

            return timeline.sort((a,b) => a.date - b.date);
        }

        var sorted = items
            .filter((item) => item.object == "kanji" && item.data.level == wkof.user.level)
            .map(function(e) { e.ttg = time_until_guru(e); return ttg_to_date(e);})
            .sort((a, b) => a.guru_date - b.guru_date);

        var last_index = Math.ceil(sorted.length * .9) - 1;
        sorted[last_index].guru_last = 1;

        TTLU_output_date = sorted[last_index].guru_date;

        var pending = sorted.filter(item => item.assignments.srs_stage < 5);
        var timeline_data = generate_timeline(sorted[last_index]);

        return {
            pending: pending,
            levelup_date: TTLU_output_date,
            level_start: sorted[0].assignments.unlocked_at,
            timeline: timeline_data
        };
    }

    function display_results(data) {
        const srs_level_classes = ["not-started", "apprentice", "apprentice", "apprentice", "apprentice", "guru", "guru", "master", "enlightened", "burned"];
        const level_start = new Date(data.level_start);

        function toBetterString(date_obj) {
            const today = new Date();
            const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);
            let dateStr = date_obj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
            if (date_obj.toDateString() === today.toDateString()) dateStr = "Today";
            if (date_obj.toDateString() === tomorrow.toDateString()) dateStr = "Tomorrow";
            let min = date_obj.getMinutes();
            if (min < 10) min = "0" + min;
            return `${dateStr} @ ${date_obj.getHours()}:${min}`;
        }

        function levelElapsed (start, end) {
            start = new Date(start);
            start.setDate(start.getDate()+1);
            start.setHours(0); start.setMinutes(0); start.setSeconds(0); start.setMilliseconds(0);
            return Math.ceil((end - start) / 1000 / 60 / 60 / 24);
        }

        if (data.pending.length === 0) {
            let html = `<div class="ttlu-section"><div class="ttlu-levelup-ready"><span class="ttlu-levelup-icon">🎉</span><span class="ttlu-levelup-text">All kanji guru'd! Ready to level up!</span></div></div>`;
            insertHTML(html);
            return;
        }

        const levelupText = `Earliest Level-Up: ${toBetterString(data.levelup_date)} (${levelElapsed(level_start, data.levelup_date)} days on level)`;

        let html = '<div class="ttlu-section">';
        html += `<div class="ttlu-levelup-info">
            <span class="ttlu-levelup-text">${levelupText}</span>
        </div>`;

        // -- COLLAPSIBLE HEADER --
        const initialArrowClass = START_COLLAPSED ? 'ttlu-arrow-collapsed' : '';
        const initialTableClass = START_COLLAPSED ? 'ttlu-hidden' : '';

        html += `<div class="ttlu-pending-header" id="ttlu-toggle-btn">
            <span class="ttlu-arrow ${initialArrowClass}">▼</span> Kanji needed for level-up
        </div>`;

        html += `<div class="ttlu-table ${initialTableClass}" id="ttlu-table-content">`;

        data.pending.forEach(function(kanji) {
            const display_class = srs_level_classes[kanji.assignments.srs_stage];
            const next_review = kanji.assignments.available_at ? new Date(kanji.assignments.available_at) : null;
            let tooltip = `SRS Stage: ${kanji.assignments.srs_stage}\n`;
            tooltip += `Guru time: ${toBetterString(kanji.guru_date)}`;
            if (next_review && kanji.assignments.srs_stage > 0) tooltip += `\nNext review: ${next_review.toLocaleString('en-US')}`;

            html += `<div class="${display_class}" title="${tooltip}">${kanji.data.slug}</div>`;
        });
        html += '</div>';

        // -- TIMELINE --
        if (data.timeline && data.timeline.length > 0) {
            html += '<div class="ttlu-timeline-header">Critical Path Timeline</div>';
            html += '<div class="ttlu-timeline">';
            data.timeline.forEach(item => {
                let isNow = item.date <= new Date();
                let timeClass = isNow ? "ttlu-time-now" : "";
                html += `<div class="ttlu-timeline-row ${timeClass}">`;
                html += `<div class="ttlu-time-date">${toBetterString(item.date)}</div>`;
                html += `<div class="ttlu-time-item">${item.name}</div>`;
                html += `<div class="ttlu-time-info">${item.info}</div>`;
                html += `</div>`;
            });
            html += '</div>';
        }

        html += '</div>';
        insertHTML(html);
    }

    function insertHTML(html) {
        const possibleSelectors = [
            '[data-widget-type="level-progress"]', '.level-progress-widget', '[class*="level-progress"]',
            '.widget[data-type="level-progress"]', '.widget-container', '[class*="widget"]'
        ];

        let location = null;
        for (const selector of possibleSelectors) {
            location = document.querySelector(selector);
            if (location) break;
        }

        if (!location) {
            const dashboardContent = document.querySelector('.dashboard-content, [class*="dashboard"], main');
            if (dashboardContent) {
                const widgets = dashboardContent.querySelectorAll('[class*="widget"], [data-widget]');
                for (const widget of widgets) {
                    if (widget.textContent.includes('Level') || widget.querySelector('[class*="level"]')) {
                        location = widget; break;
                    }
                }
            }
        }

        if (!location) return;

        const existing = document.querySelector(".ttlu-section");
        if (existing) existing.remove();

        location.insertAdjacentHTML("beforeend", html);

        // -- ADD EVENT LISTENER FOR TOGGLE --
        const toggleBtn = document.getElementById('ttlu-toggle-btn');
        const content = document.getElementById('ttlu-table-content');
        if (toggleBtn && content) {
            toggleBtn.addEventListener('click', function() {
                content.classList.toggle('ttlu-hidden');
                toggleBtn.querySelector('.ttlu-arrow').classList.toggle('ttlu-arrow-collapsed');
            });
        }
    }

    function install_css() {
        var ttlu_css = `
            .ttlu-section { margin-top: 16px; padding: 12px 0; border-top: 1px solid rgba(0, 0, 0, 0.08); }
            .ttlu-levelup-info { margin-bottom: 12px; padding: 12px 16px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px; display: flex; align-items: center; gap: 12px; box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3); }
            .ttlu-levelup-ready { padding: 12px 16px; background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); border-radius: 8px; display: flex; align-items: center; gap: 12px; box-shadow: 0 2px 8px rgba(17, 153, 142, 0.3); }
            .ttlu-levelup-icon { font-size: 20px; filter: drop-shadow(0 1px 2px rgba(0,0,0,0.2)); }
            .ttlu-levelup-text { color: white; font-size: 14px; font-weight: 500; line-height: 1.4; flex: 1; }

            /* Toggle Header */
            .ttlu-pending-header { font-size: 13px; color: #666; margin-bottom: 8px; font-weight: 500; cursor: pointer; user-select: none; display: flex; align-items: center; }
            .ttlu-pending-header:hover { color: #333; }
            .ttlu-arrow { display: inline-block; margin-right: 6px; font-size: 10px; transition: transform 0.2s ease; }
            .ttlu-arrow-collapsed { transform: rotate(-90deg); }

            /* Grid */
            .ttlu-table { display: grid; grid-template-columns: repeat(auto-fill, minmax(36px, 1fr)); gap: 6px; transition: all 0.3s ease; }
            .ttlu-hidden { display: none; }

            .ttlu-table div { aspect-ratio: 1; display: flex; align-items: center; justify-content: center; border-radius: 6px; font-size: 20px; font-weight: 500; transition: transform 0.15s ease, box-shadow 0.15s ease; cursor: default; }
            .ttlu-table div:hover { transform: translateY(-2px); box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15); }
            .ttlu .not-started { color: #666; background-color: #e8e8e8; }
            .ttlu .apprentice { color: white; background-color: #f100a0; }
            .ttlu .guru { color: white; background-color: #882d9e; }
            .ttlu .master { color: white; background-color: #294ddb; }
            .ttlu .enlightened { color: white; background-color: #0093dd; }
            .ttlu .burned { color: white; background-color: #434343; }

            /* Timeline */
            .ttlu-timeline-header { font-size: 13px; color: #666; margin-top: 16px; margin-bottom: 8px; font-weight: 500; border-top: 1px dashed rgba(0,0,0,0.1); padding-top: 12px; }
            .ttlu-timeline { display: flex; flex-direction: column; gap: 4px; font-size: 12px; }
            .ttlu-timeline-row { display: flex; gap: 10px; padding: 4px 8px; background: rgba(0,0,0,0.03); border-radius: 4px; align-items: center; }
            .ttlu-time-now { background: rgba(118, 75, 162, 0.1); border-left: 3px solid #764ba2; }
            .ttlu-time-date { font-family: monospace; color: #555; width: 110px; flex-shrink: 0; }
            .ttlu-time-item { font-weight: bold; color: #333; flex: 1; }
            .ttlu-time-info { color: #888; font-size: 11px; }

            @media (prefers-color-scheme: dark) {
                .ttlu-section { border-top-color: rgba(255, 255, 255, 0.1); }
                .ttlu-pending-header, .ttlu-timeline-header { color: #aaa; }
                .ttlu-pending-header:hover { color: #ddd; }
                .ttlu .not-started { color: #ccc; background-color: #3a3a3a; }
                .ttlu-timeline-row { background: rgba(255,255,255,0.05); }
                .ttlu-time-date { color: #aaa; }
                .ttlu-time-item { color: #ddd; }
                .ttlu-time-info { color: #888; }
                .ttlu-time-now { background: rgba(118, 75, 162, 0.3); border-left: 3px solid #a876d6; }
            }
        `;
        const style_element = document.createElement("style");
        const inserted_css = document.head.appendChild(style_element);
        inserted_css.innerHTML = ttlu_css;
    }

    function init(turbo = false) {
        if (!turbo) {
            install_css();
            if (!window.wkof) { alert('"Wanikani Show Level-up Time" requires Wanikani Open Framework.'); return; }
            wkof.include('ItemData');
        };
        if (!(document.URL.endsWith("wanikani.com/") || document.URL.endsWith("/dashboard"))) return;
        if (document.querySelector(".ttlu-section")) return;
        wkof.ready('ItemData').then(fetch_items);
    }

    addEventListener("turbo:render", (e) => setTimeout(() => init(true), 500));
    addEventListener("turbo:load", (e) => setTimeout(() => init(true), 500));
    setTimeout(() => init(), 1000);
})();