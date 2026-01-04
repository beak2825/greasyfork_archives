// ==UserScript==
// @name         Tutorial Online Progress Widget
// @namespace    http://tampermonkey.net/
// @version      5
// @description  Automatically check course names, provides a structured progress for discussions and assignments, also saves progress locally.
// @author       deoffuscated
// @match        https://elearning.ut.ac.id/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557183/Tutorial%20Online%20Progress%20Widget.user.js
// @updateURL https://update.greasyfork.org/scripts/557183/Tutorial%20Online%20Progress%20Widget.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const WIDGET_ICON = 'https://suopmkm.ut.ac.id/uo/statics/logo.png';
    const STORAGE_DATA_KEY = 'tuton_progress_checklist';
    const STORAGE_COURSES_KEY = 'tuton_course_cache_list';
    const STORAGE_AUTODETECT_KEY = 'tuton_auto_detect_enabled';
    const STATE_KEY = 'tuton_widget_minimized_state';
    const defaultCourses = ["Mata Kuliah 1", "Mata Kuliah 2", "Mata Kuliah 3"];

    const colLabels = [
        "DISKUSI 1", "DISKUSI 2", "DISKUSI 3", "DISKUSI 4",
        "DISKUSI 5", "DISKUSI 6", "DISKUSI 7", "DISKUSI 8",
        "TUGAS 1",   "TUGAS 2",   "TUGAS 3"
    ];

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js';
    document.head.appendChild(script);

    function loadCachedCourses() {
        const stored = localStorage.getItem(STORAGE_COURSES_KEY);
        return stored ? JSON.parse(stored) : [...defaultCourses];
    }
    function saveCachedCourses(courses) {
        localStorage.setItem(STORAGE_COURSES_KEY, JSON.stringify(courses));
    }
    function loadProgressData() { return JSON.parse(localStorage.getItem(STORAGE_DATA_KEY) || '{}'); }
    function saveProgressData(data) { localStorage.setItem(STORAGE_DATA_KEY, JSON.stringify(data)); }
    function loadWidgetState() { return localStorage.getItem(STATE_KEY) === 'true'; }
    function saveWidgetState(isMin) { localStorage.setItem(STATE_KEY, isMin); }
    function loadAutoDetectState() {
        const val = localStorage.getItem(STORAGE_AUTODETECT_KEY);
        return val === null ? true : val === 'true';
    }
    function saveAutoDetectState(isEnabled) {
        localStorage.setItem(STORAGE_AUTODETECT_KEY, isEnabled);
    }

    function toTitleCase(str) {
        return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }

    let courseList = loadCachedCourses();
    let progressData = loadProgressData();
    let isAutoDetectEnabled = loadAutoDetectState();

    function cleanUpDummies() {
        const hasRealCourses = courseList.some(c => !defaultCourses.includes(c));

        if (hasRealCourses) {
            const originalLength = courseList.length;
            courseList = courseList.filter(c => !defaultCourses.includes(c));
            if (courseList.length !== originalLength) {
                saveCachedCourses(courseList);
                return true;
            }
        }
        return false;
    }

    cleanUpDummies();

    function scanForCourses() {
        if (!isAutoDetectEnabled) return;

        const courseCards = document.querySelectorAll('.dashboard-card-deck .course-card[data-course-id]');

        if (courseCards.length > 0) {
            const foundIds = new Set();
            let isUpdated = false;

            courseCards.forEach(card => {
                const courseId = card.getAttribute('data-course-id');
                if (!courseId || foundIds.has(courseId)) return;
                foundIds.add(courseId);

                const nameElement = card.querySelector('.coursename .multiline');

                if (nameElement) {
                    let rawName = nameElement.textContent.trim();
                    let cleanName = rawName.replace(/\s+\d+$/, '');
                    cleanName = toTitleCase(cleanName);

                    if (cleanName && !courseList.includes(cleanName)) {
                        const hadDummies = courseList.some(c => defaultCourses.includes(c));
                        if (hadDummies) {
                            courseList = courseList.filter(c => !defaultCourses.includes(c));
                        }

                        courseList.push(cleanName);
                        isUpdated = true;
                    }
                }
            });

            if (cleanUpDummies()) {
                isUpdated = true;
            }

            if (isUpdated) {
                saveCachedCourses(courseList);
                const mainPanel = document.getElementById('ut-main-panel');
                if (mainPanel) {
                    if (typeof window.reRenderTable === 'function') window.reRenderTable();
                    if (typeof window.renderSettingsList === 'function') window.renderSettingsList();
                }
            }
        }
    }

    const observer = new MutationObserver((mutations) => {
        if (isAutoDetectEnabled && document.querySelector('.dashboard-card-deck')) {
            scanForCourses();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    const style = document.createElement('style');
    style.innerHTML = `
        :root {
            --primary-color: #1859BC;
            --accent-tugas: #e67e22;
            --success-color: #2ecc71;
            --danger-color: #e74c3c;
            --text-dark: #2d3748;
            --text-light: #718096;
            --glass-bg: linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.5));
            --glass-border: 1px solid rgba(255, 255, 255, 0.8);
            --glass-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
            --glass-blur: blur(12px);
        }
        #ut-helper-wrapper {
            position: fixed; z-index: 10000;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
        }
        #ut-helper-wrapper.minimized { bottom: 30px; right: 30px; }
        #ut-helper-wrapper.expanded { bottom: 30px; right: 30px; }
        #ut-widget-trigger {
            width: 55px; height: 55px; border-radius: 50%;
            background: rgba(255, 255, 255, 0.85);
            backdrop-filter: blur(8px);
            border: 2px solid #1859BC;
            box-shadow: 0 4px 20px rgba(24, 89, 188, 0.35);
            display: flex; align-items: center; justify-content: center;
            cursor: pointer;
            padding: 10px; box-sizing: border-box;
            transition: all 0.3s ease;
        }
        #ut-widget-trigger:hover {
            transform: scale(1.08);
            background: #fff;
            box-shadow: 0 8px 25px rgba(24, 89, 188, 0.65);
        }
        #ut-widget-trigger img { width: 100%; height: 100%; object-fit: contain; pointer-events: none; }
        #ut-main-panel {
            background: var(--glass-bg);
            backdrop-filter: var(--glass-blur); -webkit-backdrop-filter: var(--glass-blur);
            border: var(--glass-border);
            box-shadow: var(--glass-shadow);
            border-radius: 16px;
            padding: 20px;
            display: none; flex-direction: column;
            min-width: 420px; max-width: 95vw;
            animation: slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
            max-height: 80vh; overflow-y: auto;
            position: relative;
        }
        @keyframes slideUp {
            from { opacity: 0; transform: translateY(40px) scale(0.95); }
            to { opacity: 1; transform: translateY(0) scale(1); }
        }
        #ut-main-panel::-webkit-scrollbar { width: 6px; height: 6px; }
        #ut-main-panel::-webkit-scrollbar-track { background: transparent; }
        #ut-main-panel::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.15); border-radius: 10px; }
        #ut-main-panel::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,0.25); }
        .ut-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
        .ut-title {
            font-weight: 800; color: var(--text-dark); font-size: 16px;
            display: flex; align-items: center; letter-spacing: -0.5px;
            text-shadow: 0 1px 0 rgba(255,255,255,0.6);
        }
        .ut-title img { margin-right: 10px; height: 26px; filter: drop-shadow(0 2px 3px rgba(0,0,0,0.1)); }
        .ut-controls { display: flex; gap: 8px; }
        .ut-icon-btn {
            cursor: pointer; color: var(--text-dark);
            width: 30px; height: 30px; border-radius: 10px;
            display: flex; align-items: center; justify-content: center;
            transition: all 0.2s; background: rgba(255,255,255,0.4);
            border: 1px solid rgba(255,255,255,0.3);
        }
        .ut-icon-btn:hover { background: #fff; transform: translateY(-1px); box-shadow: 0 2px 5px rgba(0,0,0,0.05); }
        .ut-icon-btn.danger:hover { color: #e74c3c; background: rgba(231, 76, 60, 0.1); }
        .ut-nav-tabs {
            display: flex;
            background: rgba(0, 0, 0, 0.05);
            padding: 5px; border-radius: 12px; margin-bottom: 15px; gap: 6px;
            box-shadow: inset 0 2px 4px rgba(0,0,0,0.03);
        }
        .ut-tab-item {
            flex: 1; text-align: center; padding: 8px; font-size: 12px; font-weight: 700;
            cursor: pointer; border-radius: 8px; color: var(--text-light); transition: all 0.25s ease;
        }
        .ut-tab-item:hover { color: var(--primary-color); background: rgba(255,255,255,0.5); }
        .ut-tab-item.active {
            background: #fff; color: var(--primary-color);
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
            transform: scale(1.02);
        }
        .ut-table-container {
            overflow-x: auto;
            border-radius: 10px;
            background: rgba(255,255,255,0.4);
            border: 1px solid rgba(255,255,255,0.4);
        }
        .ut-table { width: 100%; border-collapse: separate; border-spacing: 0; margin-bottom: 5px; }
        .ut-table th, .ut-table td { padding: 8px 6px; text-align: center; vertical-align: middle; }
        .ut-table tr { transition: background 0.2s; }
        .ut-table tr:hover td { background-color: rgba(255, 255, 255, 0.5); }
        .ut-table tr:last-child td { border-bottom: none; }
        .ut-table td { border-bottom: 1px solid rgba(0,0,0,0.05); }
        .ut-table.mode-diskusi .type-tugas { display: none; }
        .ut-table.mode-tugas .type-diskusi { display: none; }
        .col-head {
            font-size: 10px; font-weight: 800; color: var(--primary-color);
            border-bottom: 2px solid rgba(24, 89, 188, 0.3) !important;
            background: rgba(24, 89, 188, 0.05);
        }
        .col-head-tugas {
            font-size: 10px; font-weight: 800; color: var(--accent-tugas);
            border-bottom: 2px solid rgba(230, 126, 34, 0.3) !important;
            background: rgba(230, 126, 34, 0.05);
        }
        .bg-tugas { background-color: rgba(230, 126, 34, 0.03); }
        .row-label {
            font-size: 11px; font-weight: 600; text-align: left !important;
            min-width: 120px; max-width: 180px;
            color: var(--text-dark);
            padding-left: 10px !important;
            overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }
        .btn-reset {
            cursor: pointer; font-size: 10px; font-weight: 900;
            color: var(--danger-color);
            border-bottom: 2px solid rgba(231, 76, 60, 0.3) !important;
            background: rgba(231, 76, 60, 0.05);
            transition: 0.2s;
        }
        .btn-reset:hover { background: rgba(231, 76, 60, 0.15); }
        .ut-chk-wrap { display: inline-block; position: relative; cursor: pointer; width: 18px; height: 18px; top: 2px; }
        .ut-chk-wrap input { opacity: 0; width: 0; height: 0; }
        .checkmark {
            position: absolute; top: 0; left: 0; height: 18px; width: 18px;
            background-color: #fff;
            border: 2px solid #a0aec0;
            border-radius: 5px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            transition: all 0.2s ease;
        }
        .ut-chk-wrap:not(.disabled):hover .checkmark {
            border-color: var(--primary-color);
            transform: scale(1.1);
        }
        .ut-chk-wrap.chk-tugas:not(.disabled):hover .checkmark {
            border-color: var(--accent-tugas);
        }
        .ut-chk-wrap:not(.disabled):hover input:not(:checked) ~ .checkmark {
            background: #f7fafc;
        }
        .ut-chk-wrap:not(.disabled):hover input:checked ~ .checkmark {
            background-color: var(--primary-color);
            box-shadow: 0 0 8px rgba(24, 89, 188, 0.5);
        }
        .ut-chk-wrap.chk-tugas:not(.disabled):hover input:checked ~ .checkmark {
            background-color: var(--accent-tugas);
            border-color: var(--accent-tugas);
            box-shadow: 0 0 8px rgba(230, 126, 34, 0.5);
        }
        .ut-chk-wrap.disabled { cursor: not-allowed; opacity: 0.8; }
        .ut-chk-wrap.disabled .checkmark {
            background-color: #cbd5e0;
            border-color: #a0aec0;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23718096' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='11' width='18' height='11' rx='2' ry='2'%3E%3C/rect%3E%3Cpath d='M7 11V7a5 5 0 0 1 10 0v4'%3E%3C/path%3E%3C/svg%3E");
            background-size: 12px; background-repeat: no-repeat; background-position: center;
        }
        .ut-chk-wrap input:checked ~ .checkmark {
            background-color: var(--primary-color);
            border-color: var(--primary-color);
            box-shadow: 0 2px 6px rgba(24, 89, 188, 0.4);
        }
        .chk-tugas input:checked ~ .checkmark {
            background-color: var(--accent-tugas);
            border-color: var(--accent-tugas);
            box-shadow: 0 2px 6px rgba(230, 126, 34, 0.4);
        }
        .checkmark:after {
            content: ""; position: absolute; display: none;
            left: 5px; top: 1px; width: 4px; height: 9px;
            border: solid white; border-width: 0 2px 2px 0;
            transform: rotate(45deg);
        }
        .ut-chk-wrap input:checked ~ .checkmark:after { display: block; }
        .prog-cont { margin-top: 15px; }
        .prog-bg {
            background: rgba(0,0,0,0.08); border-radius: 20px;
            height: 8px; width: 100%; overflow: hidden;
            box-shadow: inset 0 1px 2px rgba(0,0,0,0.1);
        }
        .prog-fill {
            height: 100%; background: linear-gradient(90deg, #2ecc71, #27ae60);
            width: 0%; transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
            border-radius: 20px;
            box-shadow: 0 0 10px rgba(46, 204, 113, 0.4);
        }
        .prog-text { font-size: 11px; text-align: right; margin-top: 5px; color: var(--text-dark); font-weight: 700; }
        #ut-settings-view { display: none; flex-direction: column; gap: 10px; padding: 5px; }
        .st-setting-row {
            display: flex; justify-content: space-between; align-items: center;
            background: rgba(255,255,255,0.6);
            padding: 10px 12px; border-radius: 10px; margin-bottom: 5px;
            border: 1px solid rgba(255,255,255,0.7);
            box-shadow: 0 2px 5px rgba(0,0,0,0.02);
        }
        .st-input-group { display: flex; gap: 8px; }
        .st-input {
            flex: 1; padding: 8px 12px; border: 1px solid rgba(0,0,0,0.15);
            border-radius: 8px; font-size: 12px;
            background: rgba(255,255,255,0.8);
            backdrop-filter: blur(5px);
        }
        .st-input:focus { outline: none; border-color: var(--primary-color); background: #fff; }
        .st-btn {
            padding: 8px 14px; border: none; border-radius: 8px;
            font-size: 12px; font-weight: 600; cursor: pointer; color: white;
            transition: transform 0.1s;
        }
        .st-btn:active { transform: scale(0.96); }
        .st-btn-add { background: linear-gradient(135deg, #2ecc71, #27ae60); box-shadow: 0 2px 6px rgba(46, 204, 113, 0.3); }
        .st-btn-back { background: var(--text-dark); width: 100%; margin-top: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
        .st-course-list {
            max-height: 200px; overflow-y: auto;
            border: 1px solid rgba(255,255,255,0.5); border-radius: 10px; margin-top: 5px;
            background: rgba(255,255,255,0.4);
        }
        .st-course-item {
            display: flex; justify-content: space-between; align-items: center;
            padding: 10px; border-bottom: 1px solid rgba(0,0,0,0.05);
            font-size: 12px; color: var(--text-dark);
        }
        .st-course-item:last-child { border-bottom: none; }
        .st-del-btn {
            color: var(--danger-color); cursor: pointer; font-weight: bold;
            padding: 4px 8px; border-radius: 6px; font-size: 11px; background: rgba(255,255,255,0.5);
        }
        .st-del-btn:hover { background: var(--danger-color); color: white; }
        .st-lbl { font-size: 12px; font-weight: 700; color: var(--text-dark); margin-top: 10px; margin-bottom: 4px; }
        .hidden { display: none !important; }
        .ut-switch { position: relative; display: inline-block; width: 36px; height: 20px; }
        .ut-switch input { opacity: 0; width: 0; height: 0; }
        .ut-slider {
            position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0;
            background-color: rgba(0,0,0,0.25); transition: .4s; border-radius: 20px;
        }
        .ut-slider:before {
            position: absolute; content: ""; height: 16px; width: 16px;
            left: 2px; bottom: 2px; background-color: white; transition: .4s; border-radius: 50%;
            box-shadow: 0 1px 3px rgba(0,0,0,0.2);
        }
        input:checked + .ut-slider { background-color: var(--primary-color); }
        input:checked + .ut-slider:before { transform: translateX(16px); }
        #ut-inner-modal {
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(255, 255, 255, 0.4);
            backdrop-filter: blur(8px);
            z-index: 50;
            display: none;
            justify-content: center; align-items: center;
            border-radius: 16px;
            animation: fadeIn 0.2s ease-in;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .ut-inner-box {
            background: rgba(255, 255, 255, 0.95);
            padding: 24px;
            border-radius: 14px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.15);
            border: 1px solid rgba(255,255,255,1);
            text-align: center;
            width: 80%; max-width: 260px;
        }
        .ut-confirm-btns { display: flex; gap: 10px; margin-top: 18px; }
        .ut-btn { flex:1; border: none; padding: 10px; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 12px; transition: 0.2s; }
        .btn-cancel { background: #edf2f7; color: var(--text-dark); }
        .btn-cancel:hover { background: #e2e8f0; }
        .btn-ok { background: var(--danger-color); color: white; box-shadow: 0 2px 5px rgba(231, 76, 60, 0.3); }
        .btn-ok:hover { background: #c0392b; }
    `;
    document.head.appendChild(style);

    function initUI() {
        const wrapper = document.createElement('div');
        wrapper.id = 'ut-helper-wrapper';

        const widgetTrigger = document.createElement('div');
        widgetTrigger.id = 'ut-widget-trigger';
        widgetTrigger.innerHTML = `<img src="${WIDGET_ICON}" alt="UT Helper">`;
        widgetTrigger.title = 'Buka Progress Widget';

        const mainPanel = document.createElement('div');
        mainPanel.id = 'ut-main-panel';

        mainPanel.innerHTML = `
            <div class="ut-header">
                <span class="ut-title"><img src="${WIDGET_ICON}" alt="icon"> Tutorial Online Progress Widget</span>
                <div class="ut-controls">
                    <div class="ut-icon-btn" id="ut-btn-settings" title="Pengaturan">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                    </div>
                    <div class="ut-icon-btn danger" id="ut-btn-minimize" title="Tutup">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </div>
                </div>
            </div>

            <div id="ut-checklist-view">
                <div class="ut-nav-tabs">
                    <div class="ut-tab-item active" data-mode="mode-all">Semua</div>
                    <div class="ut-tab-item" data-mode="mode-diskusi">Diskusi</div>
                    <div class="ut-tab-item" data-mode="mode-tugas">Tugas</div>
                </div>
                <div id="ut-table-wrapper" class="ut-table-container">
                    <!-- Table generated by JS -->
                </div>
                <div class="prog-cont">
                    <div class="prog-bg"><div class="prog-fill" id="ut-prog-bar"></div></div>
                    <div class="prog-text" id="ut-prog-lbl">0% Selesai</div>
                </div>
            </div>

            <div id="ut-settings-view">
                <div class="st-setting-row">
                    <span style="font-size:12px; font-weight:600; color:var(--text-dark);">Auto-Detect Mata Kuliah</span>
                    <label class="ut-switch">
                        <input type="checkbox" id="st-auto-detect-toggle" ${isAutoDetectEnabled ? 'checked' : ''}>
                        <span class="ut-slider"></span>
                    </label>
                </div>

                <div class="st-lbl">Tambah Mata Kuliah Manual</div>
                <div class="st-input-group">
                    <input type="text" id="st-course-input" class="st-input" placeholder="Misal: Bahasa Inggris Niaga...">
                    <button id="st-add-btn" class="st-btn st-btn-add">Tambah</button>
                </div>
                <div class="st-lbl">Daftar Mata Kuliah (Aktif)</div>
                <div class="st-course-list" id="st-course-list-container">
                    <!-- List generated by JS -->
                </div>
                <button id="st-back-btn" class="st-btn st-btn-back">Tutup</button>
            </div>

            <div id="ut-inner-modal">
                <div class="ut-inner-box">
                    <div style="font-size:16px; font-weight:700; margin-bottom:5px; color:var(--text-dark);">Reset Checklist?</div>
                    <div style="font-size:12px; color:var(--text-light);">Semua progress akan dihapus.</div>
                    <div class="ut-confirm-btns">
                        <button class="ut-btn btn-cancel" id="ut-confirm-cancel">Batal</button>
                        <button class="ut-btn btn-ok" id="ut-confirm-ok">Ya, Hapus</button>
                    </div>
                </div>
            </div>
        `;

        wrapper.appendChild(widgetTrigger);
        wrapper.appendChild(mainPanel);
        document.body.appendChild(wrapper);

        let isMinimized = loadWidgetState();

        const viewChecklist = document.getElementById('ut-checklist-view');
        const viewSettings = document.getElementById('ut-settings-view');
        const innerModal = document.getElementById('ut-inner-modal');

        window.reRenderTable = function() {
            const container = document.getElementById('ut-table-wrapper');
            let tableHTML = `<table class="ut-table mode-all" id="ut-checklist-table">`;

            tableHTML += `<tr><td class="btn-reset" id="ut-btn-reset" title="Reset Semua">RESET</td>`;
            colLabels.forEach((l, index) => {
                const isTugas = index >= 8;
                const headerClass = isTugas ? 'col-head-tugas' : 'col-head';
                const typeClass = isTugas ? 'type-tugas' : 'type-diskusi';
                tableHTML += `<td class="${headerClass} ${typeClass}">${l}</td>`;
            });
            tableHTML += `</tr>`;

            courseList.forEach(row => {
                const cleanRow = row.replace(/[^a-zA-Z0-9]/g, '');
                tableHTML += `<tr><td class="row-label" title="${row}">${row}</td>`;
                for(let i=1; i<=11; i++) {
                    const isTugas = i >= 9;
                    const typeClass = isTugas ? 'type-tugas' : 'type-diskusi';
                    const bgClass = isTugas ? 'bg-tugas' : '';
                    const chkClass = isTugas ? 'ut-chk-wrap chk-tugas' : 'ut-chk-wrap';
                    tableHTML += `<td class="${bgClass} ${typeClass}"><label class="${chkClass}"><input type="checkbox" data-id="${cleanRow}_${i}"><span class="checkmark"></span></label></td>`;
                }
                tableHTML += `</tr>`;
            });
            tableHTML += `</table>`;
            container.innerHTML = tableHTML;

            const tableEl = document.getElementById('ut-checklist-table');
            const chks = tableEl.querySelectorAll('input[type="checkbox"]');
            chks.forEach(chk => {
                const id = chk.getAttribute('data-id');
                if (progressData[id]) chk.checked = true;

                chk.addEventListener('change', (e) => {
                    progressData[id] = e.target.checked;
                    saveProgressData(progressData);
                    applyRules(true);
                });
            });

            document.getElementById('ut-btn-reset').addEventListener('click', () => {
                innerModal.style.display = 'flex';
            });

            const activeTab = document.querySelector('.ut-tab-item.active');
            if(activeTab) {
                const mode = activeTab.getAttribute('data-mode');
                tableEl.className = `ut-table ${mode}`;
            }

            applyRules(false);
        };

        function calculateProgress(isUserAction) {
            const allChks = document.querySelectorAll('#ut-checklist-table input[type="checkbox"]');
            const total = allChks.length;
            if (total === 0) return;
            const checked = Array.from(allChks).filter(c => c.checked).length;
            const pct = Math.round((checked / total) * 100);

            document.getElementById('ut-prog-bar').style.width = `${pct}%`;
            document.getElementById('ut-prog-lbl').innerText = `${pct}% Selesai`;

            if (pct === 100 && isUserAction) {
                if (typeof confetti === 'function') confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, zIndex: 10002 });
            }
        }

        function applyRules(isUserAction) {
            courseList.forEach(row => {
                const cleanRow = row.replace(/[^a-zA-Z0-9]/g, '');
                for (let i = 1; i < 8; i++) toggleLinkedCheck(`${cleanRow}_${i}`, `${cleanRow}_${i+1}`);
                toggleLinkedCheck(`${cleanRow}_3`, `${cleanRow}_9`);
                toggleLinkedCheck(`${cleanRow}_5`, `${cleanRow}_10`);
                toggleLinkedCheck(`${cleanRow}_7`, `${cleanRow}_11`);
            });
            saveProgressData(progressData);
            calculateProgress(isUserAction);
        }

        function toggleLinkedCheck(srcId, targetId) {
            const src = document.querySelector(`input[data-id="${srcId}"]`);
            const tgt = document.querySelector(`input[data-id="${targetId}"]`);
            if(src && tgt) {
                const wrap = tgt.closest('.ut-chk-wrap');
                if(src.checked) {
                    tgt.disabled = false;
                    wrap.classList.remove('disabled');
                } else {
                    tgt.disabled = true;
                    wrap.classList.add('disabled');
                    if(tgt.checked) { tgt.checked = false; progressData[targetId] = false; }
                }
            }
        }

        window.renderSettingsList = function() {
            const listCont = document.getElementById('st-course-list-container');
            listCont.innerHTML = '';
            courseList.forEach((c, idx) => {
                const item = document.createElement('div');
                item.className = 'st-course-item';
                item.innerHTML = `<span>${c}</span> <span class="st-del-btn" data-idx="${idx}">Hapus</span>`;
                listCont.appendChild(item);
            });

            document.querySelectorAll('.st-del-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const idx = e.target.getAttribute('data-idx');
                    courseList.splice(idx, 1);
                    saveCachedCourses(courseList);
                    renderSettingsList();
                });
            });
        };

        document.getElementById('st-add-btn').addEventListener('click', () => {
            const input = document.getElementById('st-course-input');
            let rawVal = input.value.trim();
            if (!rawVal) return;
            const val = toTitleCase(rawVal);
            if(val && !courseList.includes(val)) {
                const hadDummies = courseList.some(c => defaultCourses.includes(c));
                if (hadDummies) {
                    courseList = courseList.filter(c => !defaultCourses.includes(c));
                }
                
                courseList.push(val);
                saveCachedCourses(courseList);
                input.value = '';
                renderSettingsList();
            } else if (courseList.includes(val)) {
                alert('Mata kuliah sudah ada!');
            }
        });

        document.getElementById('st-course-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                document.getElementById('st-add-btn').click();
            }
        });

        document.getElementById('st-auto-detect-toggle').addEventListener('change', (e) => {
            isAutoDetectEnabled = e.target.checked;
            saveAutoDetectState(isAutoDetectEnabled);
            if(isAutoDetectEnabled) {
                scanForCourses();
            }
        });

        document.getElementById('ut-btn-settings').addEventListener('click', () => {
            viewChecklist.classList.add('hidden');
            innerModal.style.display = 'none';
            viewSettings.classList.remove('hidden');
            viewSettings.style.display = 'flex';
            renderSettingsList();
        });

        document.getElementById('st-back-btn').addEventListener('click', () => {
            viewSettings.classList.add('hidden');
            viewSettings.style.display = 'none';
            viewChecklist.classList.remove('hidden');
            reRenderTable();
        });

        const closeInnerModal = () => {
            innerModal.style.display = 'none';
        };

        document.getElementById('ut-confirm-cancel').addEventListener('click', closeInnerModal);
        document.getElementById('ut-confirm-ok').addEventListener('click', () => {
            progressData = {};
            saveProgressData(progressData);
            reRenderTable();
            closeInnerModal();
        });

        const tabItems = document.querySelectorAll('.ut-tab-item');
        tabItems.forEach(tab => {
            tab.addEventListener('click', () => {
                tabItems.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                const mode = tab.getAttribute('data-mode');
                document.getElementById('ut-checklist-table').className = `ut-table ${mode}`;
            });
        });

        function updateWidgetState() {
            if (isMinimized) {
                wrapper.className = 'minimized'; mainPanel.style.display = 'none'; widgetTrigger.style.display = 'flex';
            } else {
                wrapper.className = 'expanded'; mainPanel.style.display = 'flex'; widgetTrigger.style.display = 'none';
            }
            saveWidgetState(isMinimized);
        }

        widgetTrigger.addEventListener('click', () => { isMinimized = false; updateWidgetState(); });
        document.getElementById('ut-btn-minimize').addEventListener('click', () => { isMinimized = true; updateWidgetState(); });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (innerModal.style.display === 'flex') {
                    closeInnerModal();
                } else if (!isMinimized) {
                    isMinimized = true;
                    updateWidgetState();
                }
            }
        });

        updateWidgetState();
        reRenderTable();
    }

    scanForCourses();
    initUI();

})();