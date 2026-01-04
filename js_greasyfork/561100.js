// ==UserScript==
// @name         Lemonade Project Planner
// @namespace    http://tampermonkey.net/
// @version      4.9.1
// @description  Project planner with tasks, subtasks, priorities, due dates, and floating popout
// @author       Silverfox0338
// @match        https://lemonade.gg/code*
// @grant        none
// @run-at       document-idle
// @license      CC-BY-NC-ND-4.0
// @downloadURL https://update.greasyfork.org/scripts/561100/Lemonade%20Project%20Planner.user.js
// @updateURL https://update.greasyfork.org/scripts/561100/Lemonade%20Project%20Planner.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        headerHeight: 56,
        minWidth: 340,
        maxWidth: 800,
        defaultWidth: 420,
        floatingWidth: 480,
        floatingHeight: 600,
        checkInterval: 300
    };

const state = {
    panel: null,
    isOpen: false,
    position: localStorage.getItem('planner-pos') || 'right',
    width: parseInt(localStorage.getItem('planner-w')) || CONFIG.defaultWidth,
    floating: { active: false, el: null, x: 100, y: 100, dragging: false },
    data: {
        projects: [],
        openTabs: ['home'],
        activeTab: 'home',
        searchQuery: ''
    },
    editingTask: null,
    addingSubtask: null,
    collapsedTasks: new Set()
};

    function load() {
        try {
            const saved = JSON.parse(localStorage.getItem('planner-data-v4') || '{}');
            state.data.projects = saved.projects || [];
            state.data.openTabs = saved.openTabs || ['home'];
            state.data.activeTab = saved.activeTab || 'home';
            if (!state.data.openTabs.includes('home')) state.data.openTabs.unshift('home');
            state.data.openTabs = state.data.openTabs.filter(id => id === 'home' || state.data.projects.find(p => p.id === id));
            if (!state.data.openTabs.includes(state.data.activeTab)) state.data.activeTab = 'home';
        } catch(e) {}
    }

    function save() {
        localStorage.setItem('planner-data-v4', JSON.stringify({
            projects: state.data.projects,
            openTabs: state.data.openTabs,
            activeTab: state.data.activeTab
        }));
        syncFloating();
    }

    function genId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 6);
    }

    const icons = {
        check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
        home: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
        folder: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/></svg>`,
        plus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
        trash: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>`,
        edit: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>`,
        x: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
        swap: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m16 3 4 4-4 4"/><path d="M20 7H4"/><path d="m8 21-4-4 4-4"/><path d="M4 17h16"/></svg>`,
        float: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/></svg>`,
        dock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M15 3v18"/></svg>`,
        search: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>`,
        calendar: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
        flag: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>`,
        list: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>`,
        chevron: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`,
        chevronDown: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>`,
        planner: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`,
        checkCircle: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`
    };

    const css = `
        :root { --planner-w: ${state.width}px; }

        #planner-panel {
            position: fixed;
            top: ${CONFIG.headerHeight}px;
            bottom: 0;
            width: var(--planner-w);
            z-index: 9998;
            display: flex;
            flex-direction: column;
            font-family: inherit;
            font-size: 13px;
            color: var(--foreground, #ffffff);
            background: color-mix(in srgb, var(--background, #0a0a0a) 90%, transparent);
            backdrop-filter: blur(20px) saturate(180%);
            -webkit-backdrop-filter: blur(20px) saturate(180%);
            border-color: color-mix(in srgb, var(--border, #333) 60%, transparent);
            transform: translateX(100%);
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: -8px 0 32px rgba(0, 0, 0, 0.2);
        }
        #planner-panel.right { right: 0; border-left: 1px solid color-mix(in srgb, var(--border, #333) 60%, transparent); }
        #planner-panel.left { left: 0; border-right: 1px solid color-mix(in srgb, var(--border, #333) 60%, transparent); transform: translateX(-100%); box-shadow: 8px 0 32px rgba(0, 0, 0, 0.2); }
        #planner-panel.open { transform: translateX(0); }
        #planner-panel.resizing { transition: none; }

        .planner-open-right .flex.flex-col.h-screen.w-full.relative { padding-right: var(--planner-w) !important; transition: padding 0.3s; }
        .planner-open-left .flex.flex-col.h-screen.w-full.relative { padding-left: var(--planner-w) !important; transition: padding 0.3s; }
        body.planner-resizing * { cursor: ew-resize !important; user-select: none !important; }

        #planner-panel .resize-handle {
            position: absolute; top: 0; bottom: 0; width: 5px; cursor: ew-resize; z-index: 5;
            background: transparent; transition: background 0.2s;
        }
        #planner-panel.right .resize-handle { left: 0; }
        #planner-panel.left .resize-handle { right: 0; }
        #planner-panel .resize-handle::after {
            content: ''; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
            width: 3px; height: 40px; border-radius: 2px;
            background: var(--muted-foreground, #888); opacity: 0; transition: opacity 0.2s;
        }
        #planner-panel .resize-handle:hover::after { opacity: 0.5; }
        #planner-panel .resize-handle.active::after { opacity: 0.8; }

        .p-header {
            padding: 12px 12px 12px 16px;
            display: flex; align-items: center; gap: 10px;
            border-bottom: 1px solid color-mix(in srgb, var(--border, #333) 50%, transparent);
            background: linear-gradient(135deg,
                color-mix(in srgb, var(--muted, #1a1a1a) 80%, transparent) 0%,
                color-mix(in srgb, var(--muted, #1a1a1a) 60%, transparent) 100%);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            position: relative; overflow: hidden;
        }
        .p-header::before {
            content: ''; position: absolute; inset: 0;
            background: linear-gradient(135deg, rgba(255,255,255,0.02) 0%, transparent 100%);
            pointer-events: none;
        }
        .p-header-title {
            font-weight: 700; font-size: 15px;
            display: flex; align-items: center; gap: 8px; flex: 1;
            position: relative; z-index: 1;
        }
        .p-header-title svg { width: 18px; height: 18px; color: var(--accent, #f59e0b); }
        .p-header-actions { display: flex; gap: 4px; position: relative; z-index: 1; }

        .p-tabs {
            display: flex; overflow-x: auto; padding: 8px 12px 0;
            background: linear-gradient(180deg,
                color-mix(in srgb, var(--background, #0a0a0a) 40%, var(--muted, #1a1a1a)) 0%,
                color-mix(in srgb, var(--background, #0a0a0a) 30%, transparent) 100%);
            border-bottom: 1px solid color-mix(in srgb, var(--border, #333) 40%, transparent);
            scrollbar-width: none; gap: 3px;
        }
        .p-tabs::-webkit-scrollbar { display: none; }
        .p-tab {
            padding: 8px 14px; border-radius: 8px 8px 0 0; font-size: 13px; font-weight: 500;
            display: flex; align-items: center; gap: 8px; cursor: pointer;
            color: var(--muted-foreground, #888);
            background: transparent;
            border: 1px solid transparent; border-bottom: none;
            transition: all 0.2s; max-width: 160px; flex-shrink: 0;
            position: relative;
        }
        .p-tab::before {
            content: ''; position: absolute; inset: 0; border-radius: 8px 8px 0 0;
            background: linear-gradient(180deg, rgba(255,255,255,0.03) 0%, transparent 100%);
            opacity: 0; transition: opacity 0.2s; pointer-events: none;
        }
        .p-tab:hover {
            color: var(--foreground, #ffffff);
            background: color-mix(in srgb, var(--muted, #1a1a1a) 50%, transparent);
        }
        .p-tab:hover::before { opacity: 1; }
        .p-tab.active {
            color: var(--foreground, #ffffff);
            background: color-mix(in srgb, var(--background, #0a0a0a) 95%, transparent);
            border-color: color-mix(in srgb, var(--border, #333) 60%, transparent);
            box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1), 0 1px 0 rgba(255, 255, 255, 0.05) inset;
        }
        .p-tab svg { width: 14px; height: 14px; flex-shrink: 0; }
        .p-tab-name { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .p-tab-badge {
            font-size: 11px; padding: 2px 7px; border-radius: 12px;
            background: var(--accent, #f59e0b); color: var(--accent-foreground, #000); font-weight: 600;
            box-shadow: 0 0 8px color-mix(in srgb, var(--accent, #f59e0b) 30%, transparent);
        }
        .p-tab-close {
            width: 16px; height: 16px; display: flex; align-items: center; justify-content: center;
            border-radius: 4px; flex-shrink: 0; opacity: 0; transition: opacity 0.2s;
        }
        .p-tab:hover .p-tab-close { opacity: 0.6; }
        .p-tab-close:hover {
            opacity: 1 !important;
            background: color-mix(in srgb, var(--destructive, #ef4444) 20%, transparent);
            color: var(--destructive, #ef4444);
        }
        .p-tab-close svg { width: 12px; height: 12px; }

        .p-body { flex: 1; overflow: hidden; display: flex; flex-direction: column; position: relative; }
        .p-body::before {
            content: ''; position: absolute; inset: 0;
            background: radial-gradient(circle at top right, color-mix(in srgb, var(--accent, #f59e0b) 3%, transparent) 0%, transparent 50%);
            pointer-events: none; z-index: 0;
        }
        .p-view { display: none; flex-direction: column; flex: 1; overflow: hidden; position: relative; z-index: 1; }
        .p-view.active { display: flex; }

        .p-home { flex: 1; overflow-y: auto; padding: 16px; }
        .p-home::-webkit-scrollbar { width: 6px; }
        .p-home::-webkit-scrollbar-track { background: transparent; }
        .p-home::-webkit-scrollbar-thumb {
            background: color-mix(in srgb, var(--muted-foreground, #888) 30%, transparent);
            border-radius: 3px;
        }
        .p-home::-webkit-scrollbar-thumb:hover {
            background: color-mix(in srgb, var(--muted-foreground, #888) 50%, transparent);
        }

        .p-home-header {
            margin-bottom: 16px; padding: 12px 14px;
            border-radius: 10px;
            background: linear-gradient(135deg,
                color-mix(in srgb, var(--muted, #1a1a1a) 80%, transparent) 0%,
                color-mix(in srgb, var(--muted, #1a1a1a) 60%, transparent) 100%);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border: 1px solid color-mix(in srgb, var(--border, #333) 50%, transparent);
            position: relative; overflow: hidden;
        }
        .p-home-header::before {
            content: ''; position: absolute; inset: 0;
            background: linear-gradient(135deg, rgba(255,255,255,0.02) 0%, transparent 100%);
            pointer-events: none;
        }
        .p-home-title {
            font-size: 16px;
            font-weight: 700;
            color: var(--foreground, #fff);
            position: relative; z-index: 1;
        }

        .p-create {
            display: flex; gap: 8px; margin-bottom: 16px; padding: 14px;
            border-radius: 12px;
            background: linear-gradient(135deg,
                color-mix(in srgb, var(--accent, #f59e0b) 12%, transparent) 0%,
                color-mix(in srgb, var(--accent, #f59e0b) 6%, transparent) 100%);
            border: 1px solid color-mix(in srgb, var(--accent, #f59e0b) 40%, transparent);
            box-shadow: 0 0 20px color-mix(in srgb, var(--accent, #f59e0b) 8%, transparent),
                        0 1px 0 rgba(255, 255, 255, 0.05) inset;
            position: relative; overflow: hidden;
        }
        .p-create::before {
            content: ''; position: absolute; inset: 0;
            background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 100%);
            pointer-events: none;
        }
        .p-create input { flex: 1; position: relative; z-index: 1; }

        .p-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 10px; }
        .p-card {
            padding: 14px; border-radius: 12px; cursor: pointer;
            background: linear-gradient(135deg,
                color-mix(in srgb, var(--muted, #1a1a1a) 60%, transparent) 0%,
                color-mix(in srgb, var(--muted, #1a1a1a) 40%, transparent) 100%);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            border: 1px solid color-mix(in srgb, var(--border, #333) 50%, transparent);
            transition: all 0.2s; position: relative; overflow: hidden;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1), 0 1px 0 rgba(255, 255, 255, 0.03) inset;
        }
        .p-card::before {
            content: ''; position: absolute; inset: 0; border-radius: 12px;
            background: linear-gradient(135deg,
                color-mix(in srgb, var(--foreground, #fff) 5%, transparent) 0%,
                transparent 100%);
            opacity: 0; transition: opacity 0.2s; pointer-events: none;
        }
        .p-card:hover::before { opacity: 1; }
        .p-card:hover {
            border-color: color-mix(in srgb, var(--accent, #f59e0b) 70%, transparent);
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15),
                        0 0 20px color-mix(in srgb, var(--accent, #f59e0b) 10%, transparent),
                        0 1px 0 rgba(255, 255, 255, 0.05) inset;
        }
        .p-card-icon {
            width: 32px; height: 32px; border-radius: 8px; margin-bottom: 10px;
            display: flex; align-items: center; justify-content: center;
            background: color-mix(in srgb, var(--accent, #f59e0b) 20%, transparent);
            color: var(--accent, #f59e0b);
            box-shadow: 0 0 12px color-mix(in srgb, var(--accent, #f59e0b) 15%, transparent);
        }
        .p-card-icon svg { width: 16px; height: 16px; }
        .p-card-name {
            font-size: 14px; font-weight: 600; margin-bottom: 6px;
            white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .p-card-stats { font-size: 11px; color: var(--muted-foreground, #888); display: flex; gap: 10px; }
        .p-card-bar {
            height: 4px; border-radius: 2px; margin-top: 8px;
            background: color-mix(in srgb, var(--foreground, #fff) 10%, transparent);
            overflow: hidden; border-radius: 4px;
        }
        .p-card-bar-fill {
            height: 100%; border-radius: 4px;
            background: linear-gradient(90deg, var(--accent, #f59e0b), color-mix(in srgb, var(--accent, #f59e0b) 80%, #fff));
            transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 0 8px color-mix(in srgb, var(--accent, #f59e0b) 40%, transparent);
        }
        .p-card-actions {
            position: absolute; top: 8px; right: 8px; display: flex; gap: 3px;
            opacity: 0; transition: opacity 0.2s;
        }
        .p-card:hover .p-card-actions { opacity: 1; }

        .p-project { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
        .p-toolbar {
            padding: 12px 16px; display: flex; gap: 8px;
            border-bottom: 1px solid color-mix(in srgb, var(--border, #333) 40%, transparent);
            align-items: center; flex-wrap: wrap;
            background: linear-gradient(180deg,
                color-mix(in srgb, var(--background, #0a0a0a) 30%, var(--muted, #1a1a1a)) 0%,
                color-mix(in srgb, var(--background, #0a0a0a) 20%, transparent) 100%);
            box-shadow: 0 1px 0 rgba(255, 255, 255, 0.03) inset;
        }
        .p-search { position: relative; flex: 1; min-width: 120px; }
        .p-search svg {
            position: absolute; left: 10px; top: 50%; transform: translateY(-50%);
            width: 14px; height: 14px; color: var(--muted-foreground, #888); pointer-events: none;
        }
        .p-search input { padding-left: 34px; width: 100%; }
        .p-tasks {
            flex: 1; overflow-y: auto; padding: 12px 16px;
            display: flex; flex-direction: column; gap: 8px;
        }
        .p-tasks::-webkit-scrollbar { width: 6px; }
        .p-tasks::-webkit-scrollbar-track { background: transparent; }
        .p-tasks::-webkit-scrollbar-thumb {
            background: color-mix(in srgb, var(--muted-foreground, #888) 30%, transparent);
            border-radius: 3px;
        }

        .p-task {
            border-radius: 12px;
            background: linear-gradient(135deg,
                color-mix(in srgb, var(--muted, #1a1a1a) 50%, transparent) 0%,
                color-mix(in srgb, var(--muted, #1a1a1a) 35%, transparent) 100%);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border: 1px solid color-mix(in srgb, var(--border, #333) 45%, transparent);
            transition: all 0.2s; overflow: hidden;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08), 0 1px 0 rgba(255, 255, 255, 0.03) inset;
            position: relative;
        }
        .p-task::before {
            content: ''; position: absolute; inset: 0;
            background: linear-gradient(135deg, rgba(255,255,255,0.02) 0%, transparent 100%);
            opacity: 0; transition: opacity 0.2s; pointer-events: none;
        }
        .p-task:hover::before { opacity: 1; }
        .p-task:hover {
            border-color: color-mix(in srgb, var(--border, #333) 70%, transparent);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12), 0 1px 0 rgba(255, 255, 255, 0.05) inset;
        }
        .p-task.done { opacity: 0.6; }
        .p-task-main { padding: 12px 14px; display: flex; align-items: flex-start; gap: 10px; position: relative; z-index: 1; }
        .p-task-info { flex: 1; min-width: 0; }
        .p-task-name { font-weight: 600; font-size: 14px; line-height: 1.4; margin-bottom: 6px; }
        .p-task-meta-row {
            display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
        }
        .p-task-meta {
            display: flex; align-items: center; gap: 8px;
            font-size: 11px; color: var(--muted-foreground, #888); flex-wrap: wrap;
        }
        .p-task-meta svg { width: 11px; height: 11px; }
        .p-task-actions { display: flex; gap: 3px; }

        /* Edit panel - styled like create project */
        .p-task-edit-panel {
            padding: 12px 14px;
            margin: 0 14px 12px 14px;
            border-radius: 10px;
            background: linear-gradient(135deg,
                color-mix(in srgb, var(--accent, #f59e0b) 10%, transparent) 0%,
                color-mix(in srgb, var(--accent, #f59e0b) 5%, transparent) 100%);
            border: 1px solid color-mix(in srgb, var(--accent, #f59e0b) 30%, transparent);
            display: flex; gap: 8px; align-items: center; flex-wrap: wrap;
            position: relative; overflow: hidden;
        }
        .p-task-edit-panel::before {
            content: ''; position: absolute; inset: 0;
            background: linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 100%);
            pointer-events: none;
        }
        .p-task-edit-panel > * { position: relative; z-index: 1; }
        .p-task-edit-panel .p-edit-label {
            font-size: 11px; color: var(--muted-foreground, #888); font-weight: 500;
        }
        .p-task-edit-panel .p-edit-group {
            display: flex; align-items: center; gap: 6px;
        }

        /* Priority badge - consistent style with date */
        .p-badge {
            display: inline-flex; align-items: center; gap: 4px; padding: 3px 8px;
            border-radius: 6px; font-size: 10px; font-weight: 600;
            background: color-mix(in srgb, var(--muted-foreground, #888) 15%, transparent);
            border: 1px solid color-mix(in srgb, var(--muted-foreground, #888) 30%, transparent);
        }
        .p-badge svg { width: 10px; height: 10px; }

        .p-badge.priority-high {
            color: var(--destructive, #ef4444);
            background: color-mix(in srgb, var(--destructive, #ef4444) 15%, transparent);
            border-color: color-mix(in srgb, var(--destructive, #ef4444) 30%, transparent);
        }
        .p-badge.priority-medium {
            color: var(--accent, #f59e0b);
            background: color-mix(in srgb, var(--accent, #f59e0b) 15%, transparent);
            border-color: color-mix(in srgb, var(--accent, #f59e0b) 30%, transparent);
        }
        .p-badge.priority-low {
            color: #3b82f6;
            background: color-mix(in srgb, #3b82f6 15%, transparent);
            border-color: color-mix(in srgb, #3b82f6 30%, transparent);
        }

        .p-badge.date-overdue {
            color: var(--destructive, #ef4444);
            background: color-mix(in srgb, var(--destructive, #ef4444) 15%, transparent);
            border-color: color-mix(in srgb, var(--destructive, #ef4444) 30%, transparent);
        }
        .p-badge.date-soon {
            color: var(--accent, #f59e0b);
            background: color-mix(in srgb, var(--accent, #f59e0b) 15%, transparent);
            border-color: color-mix(in srgb, var(--accent, #f59e0b) 30%, transparent);
        }

        /* Subtasks section */
        .p-subs {
            background: linear-gradient(180deg,
                color-mix(in srgb, var(--background, #0a0a0a) 50%, transparent) 0%,
                color-mix(in srgb, var(--background, #0a0a0a) 35%, transparent) 100%);
            border-top: 1px solid color-mix(in srgb, var(--border, #333) 30%, transparent);
            margin: 0 10px 10px 10px;
            border-radius: 8px;
            overflow: hidden;
        }
        .p-sub {
            padding: 10px 12px 10px 12px; display: flex; align-items: center; gap: 10px;
            font-size: 13px;
            border-bottom: 1px solid color-mix(in srgb, var(--border, #333) 20%, transparent);
            transition: background 0.15s; position: relative;
        }
        .p-sub:last-child { border-bottom: none; }
        .p-sub:hover { background: color-mix(in srgb, var(--muted, #1a1a1a) 30%, transparent); }
        .p-sub-name { flex: 1; }
        .p-sub-actions { display: flex; gap: 3px; opacity: 0; transition: opacity 0.2s; }
        .p-sub:hover .p-sub-actions { opacity: 1; }

        /* Add subtask - no border, subtle background */
        .p-add-sub {
            padding: 12px 14px;
            margin: 0 14px 12px 14px;
            border-radius: 10px;
            background: linear-gradient(135deg,
                color-mix(in srgb, var(--muted, #1a1a1a) 60%, transparent) 0%,
                color-mix(in srgb, var(--muted, #1a1a1a) 40%, transparent) 100%);
            border: 1px solid color-mix(in srgb, var(--border, #333) 40%, transparent);
            display: flex; gap: 8px; align-items: center;
            position: relative; overflow: hidden;
        }
        .p-add-sub::before {
            content: ''; position: absolute; inset: 0;
            background: linear-gradient(135deg, rgba(255,255,255,0.02) 0%, transparent 100%);
            pointer-events: none;
        }
        .p-add-sub > * { position: relative; z-index: 1; }
        .p-add-sub input { flex: 1; font-size: 12px; padding: 8px 10px; }

        /* Collapse toggle for subtasks */
.p-collapse-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    cursor: pointer;
    border-radius: 5px;
    transition: all 0.2s;
    background: transparent;
    border: none;
    color: var(--muted-foreground, #888);
    margin-right: -4px;
    flex-shrink: 0;
}
.p-collapse-toggle:hover {
    background: color-mix(in srgb, var(--muted, #1a1a1a) 60%, transparent);
    color: var(--foreground, #fff);
}
.p-collapse-toggle svg {
    width: 14px;
    height: 14px;
    transition: transform 0.2s ease;
}
.p-collapse-toggle.collapsed svg {
    transform: rotate(-90deg);
}
.p-subs {
    transition: all 0.2s ease;
    max-height: 1000px;
    overflow: hidden;
}
.p-subs.collapsed {
    max-height: 0;
    margin: 0;
    border-top: none;
    opacity: 0;
}

        /* Checkbox - always show checkmark */
        .p-check {
            width: 22px; height: 22px; border-radius: 6px; flex-shrink: 0;
            border: 2px solid var(--muted-foreground, #888); background: transparent;
            display: flex; align-items: center; justify-content: center;
            cursor: pointer; transition: all 0.2s; margin-top: 1px;
        }
        .p-check svg {
            width: 14px; height: 14px;
            color: var(--muted-foreground, #888);
            opacity: 0.3;
            transition: all 0.2s;
        }
        .p-check:hover {
            border-color: var(--accent, #f59e0b);
            background: color-mix(in srgb, var(--accent, #f59e0b) 10%, transparent);
        }
        .p-check:hover svg {
            color: var(--accent, #f59e0b);
            opacity: 0.6;
        }
        .p-check.checked {
            background: linear-gradient(135deg, var(--accent, #f59e0b), color-mix(in srgb, var(--accent, #f59e0b) 85%, #fff));
            border-color: var(--accent, #f59e0b);
        }
        .p-check.checked svg {
            opacity: 1;
            color: var(--accent-foreground, #000);
        }
        .p-check.partial {
            border-color: var(--accent, #f59e0b);
            background: linear-gradient(135deg,
                color-mix(in srgb, var(--accent, #f59e0b) 40%, transparent) 0%,
                color-mix(in srgb, var(--accent, #f59e0b) 20%, transparent) 100%);
        }
        .p-check.partial svg {
            color: var(--accent, #f59e0b);
            opacity: 0.8;
        }

        /* Small checkbox for subtasks */
        .p-check-sm {
            width: 18px; height: 18px; border-radius: 5px;
        }
        .p-check-sm svg { width: 12px; height: 12px; }

        .p-btn {
            display: inline-flex; align-items: center; justify-content: center; gap: 6px;
            padding: 8px 12px; font-size: 13px; font-weight: 500; border-radius: 7px;
            cursor: pointer; transition: all 0.2s;
            background: linear-gradient(135deg,
                color-mix(in srgb, var(--muted, #1a1a1a) 60%, transparent) 0%,
                color-mix(in srgb, var(--muted, #1a1a1a) 45%, transparent) 100%);
            backdrop-filter: blur(4px);
            -webkit-backdrop-filter: blur(4px);
            border: 1px solid color-mix(in srgb, var(--border, #333) 50%, transparent);
            color: var(--foreground, #fff);
            box-shadow: 0 1px 0 rgba(255, 255, 255, 0.03) inset;
            position: relative; overflow: hidden;
        }
        .p-btn::before {
            content: ''; position: absolute; inset: 0;
            background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 100%);
            opacity: 0; transition: opacity 0.2s;
        }
        .p-btn:hover::before { opacity: 1; }
        .p-btn svg { width: 14px; height: 14px; }
        .p-btn:hover {
            background: linear-gradient(135deg,
                color-mix(in srgb, var(--muted, #1a1a1a) 75%, transparent) 0%,
                color-mix(in srgb, var(--muted, #1a1a1a) 60%, transparent) 100%);
            border-color: color-mix(in srgb, var(--border, #333) 70%, transparent);
            transform: translateY(-1px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15), 0 1px 0 rgba(255, 255, 255, 0.05) inset;
        }
        .p-btn:active { transform: translateY(0); }
        .p-btn-icon { width: 32px; height: 32px; padding: 0; }
        .p-btn-icon svg { width: 16px; height: 16px; }
        .p-btn-sm { width: 26px; height: 26px; padding: 0; border-radius: 6px; }
        .p-btn-sm svg { width: 13px; height: 13px; }
        .p-btn-xs {
            width: 20px; height: 20px; padding: 0; border-radius: 5px;
            background: transparent; border: none; box-shadow: none;
        }
        .p-btn-xs svg { width: 12px; height: 12px; }
        .p-btn-primary {
            background: linear-gradient(135deg, var(--accent, #f59e0b), color-mix(in srgb, var(--accent, #f59e0b) 85%, #fff));
            border-color: var(--accent, #f59e0b);
            color: var(--accent-foreground, #000); font-weight: 600;
            box-shadow: 0 0 16px color-mix(in srgb, var(--accent, #f59e0b) 25%, transparent),
                        0 1px 0 rgba(255, 255, 255, 0.1) inset;
        }
        .p-btn-primary:hover {
            background: linear-gradient(135deg, color-mix(in srgb, var(--accent, #f59e0b) 90%, black), var(--accent, #f59e0b));
            box-shadow: 0 4px 20px color-mix(in srgb, var(--accent, #f59e0b) 40%, transparent),
                        0 1px 0 rgba(255, 255, 255, 0.15) inset;
        }
        .p-btn-success {
            background: linear-gradient(135deg, #22c55e, color-mix(in srgb, #22c55e 85%, #fff));
            border-color: #22c55e;
            color: #000; font-weight: 600;
        }
        .p-btn-success:hover {
            background: linear-gradient(135deg, color-mix(in srgb, #22c55e 90%, black), #22c55e);
        }
        .p-btn-ghost { background: transparent; border-color: transparent; box-shadow: none; }
        .p-btn-ghost:hover {
            background: color-mix(in srgb, var(--muted, #1a1a1a) 50%, transparent);
            border-color: color-mix(in srgb, var(--border, #333) 40%, transparent);
        }
        .p-btn-danger:hover {
            background: color-mix(in srgb, var(--destructive, #ef4444) 20%, transparent);
            color: var(--destructive, #ef4444);
            border-color: color-mix(in srgb, var(--destructive, #ef4444) 50%, transparent);
        }

        .p-input {
            padding: 8px 12px; font-size: 13px; border-radius: 7px;
            background: color-mix(in srgb, var(--background, #0a0a0a) 85%, transparent);
            backdrop-filter: blur(4px);
            -webkit-backdrop-filter: blur(4px);
            border: 1px solid color-mix(in srgb, var(--border, #333) 50%, transparent);
            color: var(--foreground, #fff);
            transition: all 0.2s;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) inset;
        }
        .p-input:focus {
            outline: none;
            border-color: var(--accent, #f59e0b);
            box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent, #f59e0b) 20%, transparent),
                        0 2px 4px rgba(0, 0, 0, 0.1) inset;
            background: color-mix(in srgb, var(--background, #0a0a0a) 95%, transparent);
        }
        .p-input::placeholder { color: var(--muted-foreground, #888); }

        .p-select {
            padding: 6px 10px; font-size: 12px; border-radius: 6px;
            background: color-mix(in srgb, var(--background, #0a0a0a) 80%, transparent);
            border: 1px solid color-mix(in srgb, var(--border, #333) 50%, transparent);
            color: var(--foreground, #fff); cursor: pointer;
            transition: all 0.2s;
        }
        .p-select:hover {
            background: color-mix(in srgb, var(--background, #0a0a0a) 90%, transparent);
            border-color: color-mix(in srgb, var(--border, #333) 70%, transparent);
        }
        .p-select:focus {
            outline: none;
            border-color: var(--accent, #f59e0b);
        }

        .p-empty {
            flex: 1; display: flex; flex-direction: column; align-items: center;
            justify-content: center; text-align: center; padding: 40px 24px;
            color: var(--muted-foreground, #888);
        }
        .p-empty svg { width: 48px; height: 48px; margin-bottom: 12px; opacity: 0.25; }
        .p-empty-title { font-size: 15px; font-weight: 700; color: var(--foreground, #fff); margin-bottom: 4px; }
        .p-empty-sub { font-size: 13px; line-height: 1.5; }

        .done-text { text-decoration: line-through; opacity: 0.5; }

        #planner-float {
            position: fixed; z-index: 10000;
            width: ${CONFIG.floatingWidth}px; height: ${CONFIG.floatingHeight}px;
            display: none; flex-direction: column;
            background: color-mix(in srgb, var(--background, #0a0a0a) 95%, transparent);
            backdrop-filter: blur(24px) saturate(180%);
            -webkit-backdrop-filter: blur(24px) saturate(180%);
            border: 1px solid color-mix(in srgb, var(--border, #333) 60%, transparent);
            border-radius: 14px;
            box-shadow: 0 16px 64px rgba(0, 0, 0, 0.3),
                        0 0 0 1px rgba(255, 255, 255, 0.05) inset,
                        0 0 32px color-mix(in srgb, var(--accent, #f59e0b) 5%, transparent);
            overflow: hidden; resize: both; min-width: 320px; min-height: 360px;
        }
        #planner-float.active { display: flex; }
        #planner-float .p-header { cursor: move; border-radius: 14px 14px 0 0; }
        #planner-float .p-body { border-radius: 0 0 14px 14px; }
    `;

    function injectStyles() {
        if (document.getElementById('planner-css')) return;
        const el = document.createElement('style');
        el.id = 'planner-css';
        el.textContent = css;
        document.head.appendChild(el);
    }

    function esc(t) { const d = document.createElement('div'); d.textContent = t; return d.innerHTML; }
    function find(id) { return state.data.projects.find(p => p.id === id); }
    function findTask(p, tid) { return p?.tasks?.find(t => t.id === tid); }
    function findSub(t, sid) { return t?.subtasks?.find(s => s.id === sid); }

    function getStats(p) {
        const tasks = p.tasks || [];
        const total = tasks.length;
        const done = tasks.filter(t => t.done).length;
        let subs = 0, subsDone = 0;
        tasks.forEach(t => { subs += (t.subtasks || []).length; subsDone += (t.subtasks || []).filter(s => s.done).length; });
        const all = total + subs;
        const allDone = done + subsDone;
        return { total, done, subs, subsDone, progress: all > 0 ? Math.round((allDone / all) * 100) : 0 };
    }

    function getTaskProgress(t) {
        const subs = t.subtasks || [];
        if (!subs.length) return null;
        return { done: subs.filter(s => s.done).length, total: subs.length };
    }

    function formatDate(d) {
        if (!d) return null;
        const parts = d.split('-');
        const date = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        const diff = Math.floor((date - now) / (1000 * 60 * 60 * 24));
        const str = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        return { str, overdue: diff < 0, soon: diff >= 0 && diff <= 2 };
    }

    function matchesSearch(t, q) {
        if (!q) return true;
        const lq = q.toLowerCase();
        if (t.name.toLowerCase().includes(lq)) return true;
        return (t.subtasks || []).some(s => s.name.toLowerCase().includes(lq));
    }

    function getConsolePos() {
        const c = document.getElementById('console-panel');
        if (!c || !c.classList.contains('open')) return null;
        return c.classList.contains('position-right') ? 'right' : 'left';
    }

    function setConsolePos(pos) {
        const c = document.getElementById('console-panel');
        if (!c) return;
        c.classList.remove('position-left', 'position-right');
        c.classList.add('position-' + pos);
        localStorage.setItem('roblox-console-position', pos);
        if (c.classList.contains('open')) {
            document.body.classList.remove('console-panel-open-left', 'console-panel-open-right');
            document.body.classList.add('console-panel-open-' + pos);
        }
    }

    function setPlannerPos(pos) {
        state.position = pos;
        localStorage.setItem('planner-pos', pos);
        if (state.panel) {
            state.panel.classList.remove('left', 'right');
            state.panel.classList.add(pos);
        }
        if (state.isOpen) {
            document.body.classList.remove('planner-open-left', 'planner-open-right');
            document.body.classList.add('planner-open-' + pos);
        }
    }

    function swapPositions() {
        const newPos = state.position === 'right' ? 'left' : 'right';
        setPlannerPos(newPos);
        const consolePos = newPos === 'right' ? 'left' : 'right';
        setConsolePos(consolePos);
    }

    function autoPosition() {
        const consolePos = getConsolePos();
        if (consolePos && consolePos === state.position) {
            setPlannerPos(consolePos === 'right' ? 'left' : 'right');
        }
    }

    setInterval(() => {
        if (state.isOpen && !state.floating.active) autoPosition();
    }, 500);

    function toggleTask(pid, tid) {
        const p = find(pid);
        const t = findTask(p, tid);
        if (!t) return;
        t.done = !t.done;
        if (t.subtasks) t.subtasks.forEach(s => s.done = t.done);
        save(); render();
    }

    function toggleSub(pid, tid, sid) {
        const t = findTask(find(pid), tid);
        const s = findSub(t, sid);
        if (!s) return;
        s.done = !s.done;
        if (t.subtasks?.length) t.done = t.subtasks.every(x => x.done);
        save(); render();
    }

    function addProject(name) {
        const id = genId();
        state.data.projects.push({ id, name, tasks: [] });
        openTab(id);
        save(); render();
    }

    function deleteProject(pid) {
        if (!confirm('Delete project and all tasks?')) return;
        state.data.projects = state.data.projects.filter(p => p.id !== pid);
        state.data.openTabs = state.data.openTabs.filter(id => id !== pid);
        if (state.data.activeTab === pid) state.data.activeTab = 'home';
        save(); render();
    }

    function renameProject(pid) {
        const p = find(pid);
        const name = prompt('Rename project:', p.name);
        if (name?.trim()) { p.name = name.trim(); save(); render(); }
    }

    function addTask(pid, name, priority = 'none', due = null) {
        const p = find(pid);
        if (!p) return;
        p.tasks = p.tasks || [];
        p.tasks.push({ id: genId(), name, done: false, priority, due, subtasks: [] });
        save(); render();
    }

    function deleteTask(pid, tid) {
        const p = find(pid);
        if (p) { p.tasks = p.tasks.filter(t => t.id !== tid); save(); render(); }
    }

    function renameTask(pid, tid) {
        const t = findTask(find(pid), tid);
        const name = prompt('Rename task:', t.name);
        if (name?.trim()) { t.name = name.trim(); save(); render(); }
    }

    function setTaskPriority(pid, tid, priority) {
        const t = findTask(find(pid), tid);
        if (t) { t.priority = priority; save(); render(); }
    }

    function setTaskDue(pid, tid, due) {
        const t = findTask(find(pid), tid);
        if (t) { t.due = due || null; save(); render(); }
    }

    function toggleEditTask(pid, tid) {
        const key = `${pid}-${tid}`;
        if (state.editingTask === key) {
            state.editingTask = null;
        } else {
            state.editingTask = key;
            state.addingSubtask = null;
        }
        render();
    }

    function toggleAddSubtask(pid, tid) {
        const key = `${pid}-${tid}`;
        if (state.addingSubtask === key) {
            state.addingSubtask = null;
        } else {
            state.addingSubtask = key;
            state.editingTask = null;
        }
        render();
    }
function toggleCollapse(pid, tid) {
    const key = `${pid}-${tid}`;
    if (state.collapsedTasks.has(key)) {
        state.collapsedTasks.delete(key);
    } else {
        state.collapsedTasks.add(key);
    }
    render();
}
    function addSub(pid, tid, name) {
        const t = findTask(find(pid), tid);
        if (!t) return;
        t.subtasks = t.subtasks || [];
        t.subtasks.push({ id: genId(), name, done: false });
        if (t.done) t.done = false;
        save(); render();
    }

    function deleteSub(pid, tid, sid) {
        const t = findTask(find(pid), tid);
        if (t) {
            t.subtasks = t.subtasks.filter(s => s.id !== sid);
            if (t.subtasks.length) t.done = t.subtasks.every(s => s.done);
            save(); render();
        }
    }

    function renameSub(pid, tid, sid) {
        const s = findSub(findTask(find(pid), tid), sid);
        const name = prompt('Rename subtask:', s.name);
        if (name?.trim()) { s.name = name.trim(); save(); render(); }
    }

    function openTab(pid) {
        if (!state.data.openTabs.includes(pid)) state.data.openTabs.push(pid);
        state.data.activeTab = pid;
        save();
    }

    function closeTab(id) {
        if (id === 'home') return;
        state.data.openTabs = state.data.openTabs.filter(t => t !== id);
        if (state.data.activeTab === id) state.data.activeTab = state.data.openTabs[state.data.openTabs.length - 1] || 'home';
        save(); render();
    }

    function switchTab(id) {
        state.data.activeTab = id;
        state.editingTask = null;
        state.addingSubtask = null;
        save(); render();
    }

    function render() {
        renderTabs();
        renderBody();
        syncFloating();
    }

    function renderTabs() {
        const container = state.panel?.querySelector('.p-tabs');
        if (!container) return;
        container.innerHTML = '';

        state.data.openTabs.forEach(id => {
            const tab = document.createElement('div');
            tab.className = 'p-tab' + (id === state.data.activeTab ? ' active' : '');

            if (id === 'home') {
                tab.innerHTML = `${icons.home}<span class="p-tab-name">Projects</span>`;
                tab.onclick = () => switchTab('home');
            } else {
                const p = find(id);
                if (!p) return;
                const stats = getStats(p);
                tab.innerHTML = `
                    <span class="p-tab-name" title="${esc(p.name)}">${esc(p.name)}</span>
                    <span class="p-tab-badge">${stats.progress}%</span>
                    <span class="p-tab-close">${icons.x}</span>
                `;
                tab.querySelector('.p-tab-name').onclick = () => switchTab(id);
                tab.querySelector('.p-tab-badge').onclick = () => switchTab(id);
                tab.querySelector('.p-tab-close').onclick = e => { e.stopPropagation(); closeTab(id); };
            }
            container.appendChild(tab);
        });
    }

    function renderBody() {
        const body = state.panel?.querySelector('.p-body');
        if (!body) return;
        body.innerHTML = '<div class="p-view"></div>';

        if (state.data.activeTab === 'home') {
            body.querySelector('.p-view').replaceWith(renderHome());
        } else {
            const p = find(state.data.activeTab);
            if (p) body.querySelector('.p-view').replaceWith(renderProject(p));
        }
    }

    function renderHome() {
        const view = document.createElement('div');
        view.className = 'p-view active';
        const projectCount = state.data.projects.length;
        view.innerHTML = `
            <div class="p-home">
                <div class="p-home-header">
                    <div class="p-home-title">Your Projects | ${projectCount} Project${projectCount !== 1 ? 's' : ''}</div>
                </div>
                <div class="p-create">
                    <input class="p-input" placeholder="Create a new project..." style="flex:1">
                    <button class="p-btn p-btn-primary">${icons.plus} Create</button>
                </div>
                <div class="p-grid"></div>
            </div>
        `;

        const input = view.querySelector('.p-create input');
        const btn = view.querySelector('.p-create button');
        const submit = () => { if (input.value.trim()) { addProject(input.value.trim()); input.value = ''; } };
        btn.onclick = submit;
        input.onkeypress = e => { if (e.key === 'Enter') submit(); };

        const grid = view.querySelector('.p-grid');
        if (!state.data.projects.length) {
            grid.innerHTML = `<div class="p-empty" style="grid-column:1/-1">${icons.folder}<div class="p-empty-title">No projects yet</div><div class="p-empty-sub">Create your first project to get started</div></div>`;
        } else {
            state.data.projects.forEach(p => {
                const stats = getStats(p);
                const card = document.createElement('div');
                card.className = 'p-card';
                card.innerHTML = `
                    <div class="p-card-actions">
                        <button class="p-btn p-btn-xs p-btn-ghost edit">${icons.edit}</button>
                        <button class="p-btn p-btn-xs p-btn-ghost p-btn-danger del">${icons.trash}</button>
                    </div>
                    <div class="p-card-icon">${icons.folder}</div>
                    <div class="p-card-name">${esc(p.name)}</div>
                    <div class="p-card-stats"><span>${stats.total} tasks</span><span>${stats.done} done</span></div>
                    <div class="p-card-bar"><div class="p-card-bar-fill" style="width:${stats.progress}%"></div></div>
                `;
                card.onclick = e => { if (!e.target.closest('.p-card-actions')) { openTab(p.id); render(); } };
                card.querySelector('.edit').onclick = e => { e.stopPropagation(); renameProject(p.id); };
                card.querySelector('.del').onclick = e => { e.stopPropagation(); deleteProject(p.id); };
                grid.appendChild(card);
            });
        }
        return view;
    }

    function renderProject(p) {
        const view = document.createElement('div');
        view.className = 'p-view active';
        view.innerHTML = `
            <div class="p-project">
                <div class="p-toolbar">
                    <div class="p-search">
                        ${icons.search}
                        <input class="p-input" placeholder="Search tasks...">
                    </div>
                    <input class="p-input new-task" placeholder="Add a task..." style="flex:1;min-width:100px">
                    <button class="p-btn p-btn-primary add-task">${icons.plus} Add</button>
                </div>
                <div class="p-tasks"></div>
            </div>
        `;

        const searchInput = view.querySelector('.p-search input');
        searchInput.value = state.data.searchQuery;
        searchInput.oninput = () => { state.data.searchQuery = searchInput.value; renderTasks(view, p); };

        const newTask = view.querySelector('.new-task');
        const addBtn = view.querySelector('.add-task');
        const submit = () => {
            if (newTask.value.trim()) {
                addTask(p.id, newTask.value.trim(), 'none', null);
                newTask.value = '';
            }
        };
        addBtn.onclick = submit;
        newTask.onkeypress = e => { if (e.key === 'Enter') submit(); };

        renderTasks(view, p);
        return view;
    }

function renderTasks(view, p) {
    const container = view.querySelector('.p-tasks');
    container.innerHTML = '';

    const tasks = (p.tasks || []).filter(t => matchesSearch(t, state.data.searchQuery));
    if (!tasks.length) {
        container.innerHTML = `<div class="p-empty">${icons.list}<div class="p-empty-title">No tasks found</div><div class="p-empty-sub">${state.data.searchQuery ? 'Try a different search term' : 'Add your first task above'}</div></div>`;
        return;
    }

    tasks.forEach(t => {
        const prog = getTaskProgress(t);
        const hasSubs = t.subtasks?.length > 0;
        let checkClass = t.done ? 'checked' : '';
        if (!t.done && hasSubs && t.subtasks.some(s => s.done)) checkClass = 'partial';
        const due = formatDate(t.due);
        const isEditing = state.editingTask === `${p.id}-${t.id}`;
        const isAddingSub = state.addingSubtask === `${p.id}-${t.id}`;
        const isCollapsed = state.collapsedTasks.has(`${p.id}-${t.id}`);

        const card = document.createElement('div');
        card.className = 'p-task' + (t.done ? ' done' : '');

        // Main task content with collapse toggle
        let mainHTML = `
            <div class="p-task-main">
                ${hasSubs ? `<button class="p-collapse-toggle ${isCollapsed ? 'collapsed' : ''}">${icons.chevronDown}</button>` : ''}
                <button class="p-check ${checkClass}">${icons.check}</button>
                <div class="p-task-info">
                    <div class="p-task-name ${t.done ? 'done-text' : ''}">${esc(t.name)}</div>
                    <div class="p-task-meta-row">
                        ${hasSubs ? `<span class="p-badge">${icons.list} ${prog.done}/${prog.total}</span>` : ''}
                        ${t.priority !== 'none' ? `<span class="p-badge priority-${t.priority}">${icons.flag} ${t.priority}</span>` : ''}
                        ${due ? `<span class="p-badge ${due.overdue ? 'date-overdue' : ''} ${due.soon ? 'date-soon' : ''}">${icons.calendar} ${due.str}</span>` : ''}
                    </div>
                </div>
                <div class="p-task-actions">
                    <button class="p-btn p-btn-sm p-btn-ghost add-sub" title="Add subtask">${icons.plus}</button>
                    <button class="p-btn p-btn-sm p-btn-ghost edit-task" title="Edit">${icons.edit}</button>
                    <button class="p-btn p-btn-sm p-btn-ghost p-btn-danger del" title="Delete">${icons.trash}</button>
                </div>
            </div>
        `;

        // Add edit panel if editing
        if (isEditing) {
            mainHTML += `
                <div class="p-task-edit-panel">
                    <div class="p-edit-group">
                        <span class="p-edit-label">Priority</span>
                        <select class="p-select task-priority">
                            <option value="none" ${t.priority === 'none' ? 'selected' : ''}>None</option>
                            <option value="high" ${t.priority === 'high' ? 'selected' : ''}>High</option>
                            <option value="medium" ${t.priority === 'medium' ? 'selected' : ''}>Medium</option>
                            <option value="low" ${t.priority === 'low' ? 'selected' : ''}>Low</option>
                        </select>
                    </div>
                    <div class="p-edit-group">
                        <span class="p-edit-label">Due</span>
                        <input type="date" class="p-input task-due" value="${t.due || ''}" style="width:auto;padding:6px 10px;font-size:12px">
                    </div>
                    <button class="p-btn p-btn-sm p-btn-success save-edit">${icons.checkCircle} Done</button>
                </div>
            `;
        }

        // Add subtask input if adding
        if (isAddingSub) {
            mainHTML += `
                <div class="p-add-sub">
                    <input class="p-input" placeholder="Enter subtask name...">
                    <button class="p-btn p-btn-sm p-btn-primary add-sub-btn">${icons.plus}</button>
                    <button class="p-btn p-btn-sm cancel-sub-btn">${icons.x}</button>
                </div>
            `;
        }

        // Add subtasks section (with collapsed class if needed)
        if (hasSubs) {
            mainHTML += `<div class="p-subs ${isCollapsed ? 'collapsed' : ''}"></div>`;
        }

        card.innerHTML = mainHTML;

        // Event handlers
        card.querySelector('.p-check').onclick = () => toggleTask(p.id, t.id);

        // Collapse toggle handler
        if (hasSubs) {
            card.querySelector('.p-collapse-toggle').onclick = () => toggleCollapse(p.id, t.id);
        }

        card.querySelector('.add-sub').onclick = () => toggleAddSubtask(p.id, t.id);
        card.querySelector('.edit-task').onclick = () => toggleEditTask(p.id, t.id);
        card.querySelector('.del').onclick = () => deleteTask(p.id, t.id);

        // Edit panel handlers
        if (isEditing) {
            const prioritySelect = card.querySelector('.task-priority');
            const dueInput = card.querySelector('.task-due');
            const saveBtn = card.querySelector('.save-edit');

            prioritySelect.onchange = (e) => setTaskPriority(p.id, t.id, e.target.value);
            dueInput.onchange = (e) => setTaskDue(p.id, t.id, e.target.value);
            saveBtn.onclick = () => toggleEditTask(p.id, t.id);
        }

        // Add subtask handlers
        if (isAddingSub) {
            const subInput = card.querySelector('.p-add-sub input');
            const addSubBtn = card.querySelector('.add-sub-btn');
            const cancelSubBtn = card.querySelector('.cancel-sub-btn');

            const subSubmit = () => {
                if (subInput.value.trim()) {
                    addSub(p.id, t.id, subInput.value.trim());
                    subInput.value = '';
                }
            };
            addSubBtn.onclick = subSubmit;
            subInput.onkeypress = e => { if (e.key === 'Enter') subSubmit(); };
            cancelSubBtn.onclick = () => toggleAddSubtask(p.id, t.id);

            // Auto-focus the input
            setTimeout(() => subInput.focus(), 0);
        }

        if (hasSubs) {
            const subsContainer = card.querySelector('.p-subs');
            t.subtasks.forEach(s => {
                const sub = document.createElement('div');
                sub.className = 'p-sub';
                sub.innerHTML = `
                    <button class="p-check p-check-sm ${s.done ? 'checked' : ''}">${icons.check}</button>
                    <span class="p-sub-name ${s.done ? 'done-text' : ''}">${esc(s.name)}</span>
                    <div class="p-sub-actions">
                        <button class="p-btn p-btn-xs p-btn-ghost edit">${icons.edit}</button>
                        <button class="p-btn p-btn-xs p-btn-ghost p-btn-danger del">${icons.trash}</button>
                    </div>
                `;
                sub.querySelector('.p-check').onclick = () => toggleSub(p.id, t.id, s.id);
                sub.querySelector('.edit').onclick = () => renameSub(p.id, t.id, s.id);
                sub.querySelector('.del').onclick = () => deleteSub(p.id, t.id, s.id);
                subsContainer.appendChild(sub);
            });
        }

        container.appendChild(card);
    });
}

    function toggleFloat() {
        state.floating.active = !state.floating.active;
        if (state.floating.active) {
            closePanel();
            if (!state.floating.el) createFloat();
            state.floating.el.classList.add('active');
            renderFloat();
        } else {
            state.floating.el?.classList.remove('active');
        }
    }

    function createFloat() {
        const el = document.createElement('div');
        el.id = 'planner-float';
        el.style.left = state.floating.x + 'px';
        el.style.top = state.floating.y + 'px';
        el.innerHTML = `
            <div class="p-header">
                <div class="p-header-title">${icons.planner} Planner</div>
                <div class="p-header-actions">
                    <button class="p-btn p-btn-icon p-btn-ghost dock" title="Dock">${icons.dock}</button>
                    <button class="p-btn p-btn-icon p-btn-ghost close" title="Close">${icons.x}</button>
                </div>
            </div>
            <div class="p-tabs"></div>
            <div class="p-body"></div>
        `;

        const header = el.querySelector('.p-header');
        header.onmousedown = e => {
            if (e.target.closest('button')) return;
            state.floating.dragging = true;
            const rect = el.getBoundingClientRect();
            const ox = e.clientX - rect.left;
            const oy = e.clientY - rect.top;
            const move = ev => {
                state.floating.x = ev.clientX - ox;
                state.floating.y = ev.clientY - oy;
                el.style.left = state.floating.x + 'px';
                el.style.top = state.floating.y + 'px';
            };
            const up = () => { state.floating.dragging = false; document.removeEventListener('mousemove', move); document.removeEventListener('mouseup', up); };
            document.addEventListener('mousemove', move);
            document.addEventListener('mouseup', up);
        };

        el.querySelector('.dock').onclick = () => { state.floating.active = false; el.classList.remove('active'); openPanel(); };
        el.querySelector('.close').onclick = () => { state.floating.active = false; el.classList.remove('active'); };

        document.body.appendChild(el);
        state.floating.el = el;
    }

    function renderFloat() {
        if (!state.floating.el || !state.floating.active) return;
        const oldPanel = state.panel;
        state.panel = state.floating.el;
        renderTabs();
        renderBody();
        state.panel = oldPanel;
    }

    function syncFloating() {
        if (state.floating.active) renderFloat();
    }

    function createPanel() {
        if (document.getElementById('planner-panel')) return;

        const panel = document.createElement('div');
        panel.id = 'planner-panel';
        panel.className = state.position;
        panel.innerHTML = `
            <div class="resize-handle"></div>
            <div class="p-header">
                <div class="p-header-title">${icons.planner} Project Planner</div>
                <div class="p-header-actions">
                    <button class="p-btn p-btn-icon p-btn-ghost float" title="Float">${icons.float}</button>
                    <button class="p-btn p-btn-icon p-btn-ghost swap" title="Swap sides">${icons.swap}</button>
                    <button class="p-btn p-btn-icon p-btn-ghost close" title="Close">${icons.x}</button>
                </div>
            </div>
            <div class="p-tabs"></div>
            <div class="p-body"></div>
        `;

        panel.querySelector('.float').onclick = toggleFloat;
        panel.querySelector('.swap').onclick = swapPositions;
        panel.querySelector('.close').onclick = closePanel;

        setupResize(panel);
        document.body.appendChild(panel);
        state.panel = panel;
        render();
    }

    function setupResize(panel) {
        const handle = panel.querySelector('.resize-handle');
        let startX, startW;
        handle.onmousedown = e => {
            startX = e.clientX;
            startW = state.width;
            document.body.classList.add('planner-resizing');
            panel.classList.add('resizing');
            handle.classList.add('active');
            const move = ev => {
                const delta = state.position === 'right' ? startX - ev.clientX : ev.clientX - startX;
                state.width = Math.max(CONFIG.minWidth, Math.min(CONFIG.maxWidth, startW + delta));
                document.documentElement.style.setProperty('--planner-w', state.width + 'px');
            };
            const up = () => {
                document.body.classList.remove('planner-resizing');
                panel.classList.remove('resizing');
                handle.classList.remove('active');
                localStorage.setItem('planner-w', state.width);
                document.removeEventListener('mousemove', move);
                document.removeEventListener('mouseup', up);
            };
            document.addEventListener('mousemove', move);
            document.addEventListener('mouseup', up);
        };
    }

    function openPanel() {
        if (state.floating.active) return;
        autoPosition();
        document.body.classList.add('planner-open-' + state.position);
        state.panel.classList.add('open');
        state.isOpen = true;
        updateBtn(true);
    }

    function closePanel() {
        state.panel?.classList.remove('open');
        setTimeout(() => document.body.classList.remove('planner-open-left', 'planner-open-right'), 300);
        state.isOpen = false;
        updateBtn(false);
    }

    function togglePanel() {
        if (state.floating.active) {
            state.floating.el?.classList.toggle('active');
            state.floating.active = state.floating.el?.classList.contains('active');
            if (state.floating.active) renderFloat();
        } else {
            state.isOpen ? closePanel() : openPanel();
        }
    }

    function createHeaderBtn() {
        if (document.getElementById('planner-btn')) return true;

        const container = document.querySelector('.flex.items-center.h-full.space-x-2');
        if (!container) return false;

        const btn = document.createElement('button');
        btn.id = 'planner-btn';
        btn.className = 'rounded-xl border flex flex-row items-center justify-center gap-2 border-amber-700/50 bg-amber-600 hover:bg-amber-700 px-4 py-1.5 text-sm font-medium text-white transition-colors';
        btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>Planner`;
        btn.onclick = togglePanel;
        container.insertBefore(btn, container.firstChild);
        return true;
    }

    function updateBtn(open) {
        const btn = document.getElementById('planner-btn');
        if (!btn) return;
        const off = ['border-amber-700/50', 'bg-amber-600', 'hover:bg-amber-700'];
        const on = ['border-green-700/50', 'bg-green-600', 'hover:bg-green-700'];
        off.forEach(c => btn.classList.toggle(c, !open));
        on.forEach(c => btn.classList.toggle(c, open));
    }

    function initHeaderBtn() {
        let attempts = 0;
        const maxAttempts = 100;

        const tryCreate = () => {
            if (createHeaderBtn()) {
                console.log('Planner button created successfully');
                return;
            }

            attempts++;
            if (attempts < maxAttempts) {
                setTimeout(tryCreate, CONFIG.checkInterval);
            } else {
                console.warn('Failed to create planner button after max attempts');
            }
        };

        tryCreate();
    }

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            if (state.editingTask || state.addingSubtask) {
                state.editingTask = null;
                state.addingSubtask = null;
                render();
            } else if (state.isOpen) {
                closePanel();
            } else if (state.floating.active) {
                state.floating.active = false;
                state.floating.el?.classList.remove('active');
            }
        }
    });

    injectStyles();
    load();
    createPanel();
    initHeaderBtn();

    new MutationObserver(() => {
        if (!document.getElementById('planner-btn')) {
            setTimeout(() => createHeaderBtn(), 100);
        }
    }).observe(document.body, { childList: true, subtree: true });

})();