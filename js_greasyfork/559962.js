// ==UserScript==
// @name         YM DuoMax Lite
// @namespace    http://tampermonkey.net/
// @version      v1.0.1_LITE
// @description  XP + Gems + Real Streak farming tool for Duolingo with compact UI
// @author       ´꒳`ⓎⒶⓂⒾⓈⒸⓇⒾⓅⓉ×͜×
// @match        https://www.duolingo.com/*
// @grant        none
// @run-at       document-idle
// @icon         https://www.google.com/s2/favicons?sz=64&domain=duolingo.com
// @downloadURL https://update.greasyfork.org/scripts/559962/YM%20DuoMax%20Lite.user.js
// @updateURL https://update.greasyfork.org/scripts/559962/YM%20DuoMax%20Lite.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const SERVER_ID = '1377275722342858973';
    const WIDGET_URL = `https://discord.com/widget?id=${SERVER_ID}&theme=dark`;
    const VERSION = 'v1.0.1_LITE';
    let lang = 'en';

    const LANG = {
       en: {
            header: 'DuoMax LITE', farmLabel: 'FARM ENGINE', start: '🚀 START',
            done: 'Farm finished', copied: 'Token copied!', placeholder: 'Enter target amount',
            settings: 'Settings', support: 'Support', profile: 'Profile', discord: 'Discord',
            version: 'Version', madeby: 'Made by'
        }
    };
    const t = k => LANG[lang][k];

    const ICONS = {
        xp: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMjkuMzMzNCAxNi42NjY3SDIxLjY2NjZMMjYuNjY2NiA1SDE1TDEwLjY2NjYgMjMuMzMzNEgxOC4zMzM0TDEzLjMzMzQgMzVMMjkuMzMzNCAxNi42NjY3WiIgZmlsbD0iI0ZGQ0MwMCIvPjwvc3ZnPg==",
        gem: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMjAgNUMxNSAyMCAxMCAyMCAxMCAzMEMxMCAzNS41IDE0LjUgNDAgMjAgNDBDMjUuNSA0MCAzMCAzNS41IDMwIDMwQzMwIDIwIDI1IDIwIDIwIDVaIiBmaWxsPSIjMEVBNUU5Ii8+PC9zdmc+",
        streak: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMjAgNUMxNSAyMCAxMCAyMCAxMCAzMEMxMCAzNS41IDE0LjUgNDAgMjAgNDBDMjUuNSA0MCAzMCAzNS41IDMwIDMwQzMwIDIwIDI1IDIwIDIwIDVaIiBmaWxsPSIjRkY5NjAwIi8+PC9zdmc+",
        quest: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB4PSI1IiB5PSIxMCIgd2lkdGg9IjMwIiBoZWlnaHQ9IjI1IiByeD0iNSIgZmlsbD0iIzhCNUVFRiIvPjxwYXRoIGQ9Ik0xNSA3SDI1VDEwSDE1VjdaIiBmaWxsPSIjRkZGRkZGIi8+PC9zdmc+",
        league: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNSAyMEwyMCAzNUwzNSAyMFY1SDVWMjBaIiBmaWxsPSIjM0I4MkY2Ii8+PC9zdmc+",
        close: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTAgMTBMMzAgMzBNMzAgMTBMMTAgMzAiIHN0cm9rZT0iIzhhOGE4YSIgc3Ryb2tlLXdpZHRoPSIzIi8+PC9zdmc+",
        minimize: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48bGluZSB4MT0iMTAiIHkxPSIyMCIgeDI9IjMwIiB5Mj0iMjAiIHN0cm9rZT0iIzhhOGE4YSIgc3Ryb2tlLXdpZHRoPSIzIi8+PC9zdmc+",
        settings: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTIgMTVDMTMuNjU2OSAxNSAxNSAxMy42NTY5IDE1IDEyQzE1IDEwLjM0MzEgMTMuNjU2OSA5IDEyIDlDMTAuMzQzMSA5IDkgMTAuMzQzMSA5IDEyQzkgMTMuNjU2OSAxMC4zNDMxIDE1IDEyIDE1WiIgZmlsbD0iI0ZGQ0MwMCIvPjxwYXRoIGQ9Ik0xOS40MyAxMi45N0MxOS40NyAxMi42NSAxOS41IDEyLjMzIDE5LjUgMTJDMTkuNSAxMS42NyAxOS40NyAxMS4zNSAxOS40MyAxMS4wM0wyMS41NCA5LjM3QzIxLjczIDkuMjIgMjEuNzggOC45NSAyMS42NiA4LjczTDE5LjY0IDUuMjhDMTkuNTMgNS4wNiAxOS4yNSA0Ljk2IDE5IDUuMDVMMTYuNTYgNi4wNUMxNi4wNCA1LjY2IDE1LjUgNS4zMiAxNC44NyA1LjA2TDE0LjQ5IDIuNDJDMTQuNDYgMi4xOCAxNC4yNSAyIDE0IDJIMTBDOS43NSAyIDkuNTQgMi4xOCA5LjUxIDIuNDJMOS4xMyA1LjA2QzguNSA1LjMyIDcuOTYgNS42NiA3LjQ0IDYuMDVMNSA1LjA1QzQuNzYgNC45NiA0LjQ3IDUuMDYgNC4zNiA1LjI4TDIuMzQgOC43M0MyLjIyIDguOTUgMi4yNyA5LjIyIDIuNDYgOS4zN0w0LjU3IDExLjAzQzQuNTMgMTEuMzUgNC41IDExLjY3IDQuNSAxMkM0LjUgMTIuMzMgNC41MyAxMi42NSA0LjU3IDEyLjk3TDIuNDYgMTQuNjNDMi4yNyAxNC43OCAyLjIyIDE1LjA1IDIuMzQgMTUuMjdMNC4zNiAxOC43MkM0LjQ3IDE4Ljk0IDQuNzYgMTkuMDQgNSAxOC45NUw3LjQ0IDE3Ljk1QzcuOTYgMTguMzQgOC41IDE4LjY4IDkuMTMgMTguOTRMOS41MSAyMS41OEM5LjU0IDIxLjgyIDkuNzUgMjIgMTAgMjJIMTRDMTQuMjUgMjIgMTQuNDYgMjEuODIgMTQuNDkgMjEuNThMMTQuODcgMTguOTRDMTUuNSAxOC42OCAxNi4wNCAxOC4zNCAxNi41NiAxNy45NUwxOSAxOC45NUwxOS4yNSAxOC45MkMxOS41IDE4LjgzIDE5LjY3IDE4LjY2IDE5LjY3IDE4LjM4VjE1LjI3QzE5Ljc4IDE1LjA1IDE5LjczIDE0Ljc4IDE5LjU0IDE0LjYzTDE5LjQzIDE0LjU0WiIgc3Ryb2tlPSIjODg4IiBzdHJva2Utd2lkdGg9IjEuNSIvPjwvc3ZnPg==",
        discord: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTggNzVhOSA5IDAgMSAwLTkgOWMwLTMuMDQtMS43My01LjY1LTQgNyAwIDAtLjc1LTEuMTUtMS40LTIuNSAwIDAtLjE3LjA2LS4xNy4wNmEyLjEzIDIuMTMgMCAwIDAgLjI2LTEuMDdjLS41Ny0uNjMtMS4wNy0xLjU3LTEuMy0yLjQgMCAwLS44NC4zMi0yLjc1IDEuMDcgMCAwLTEuNS0yLjktMS43LTMuNCAwIDAtMS4wOC0uMS0yLjM4IDAtMS4zIDAtMi4zOCAwLTIuMzggMFMyLjI1IDguNjcgMiAxMmMwIDIuNS42NCA0LjggMS43IDYuNyAwIDAgMSAzLjQgMi43NSA1LjI1IDEuMDcgMCAwIDIuMTUtLjU3IDIuODUtMS4wN2EyLjEzIDIuMTMgMCAwIDAtLjE3LS4wNmwtLjE3LS4wNmMxLjE1IDIgNC41IDMuMjUgNC41IDMuMjVDMjAuMjcgMjAuMzUgMTggMjEgMTggMjFhOSA5IDAgMCAwIDktOXoiIGZpbGw9IiM1ODY1RjIiLz48L3N2Zz4="
    };

    // Settings state
    const settings = {
        animations: true,
        debugMode: false,
        autoClearLogs: true
    };

    // Load saved settings
    try {
        const saved = localStorage.getItem('duomax_settings');
        if (saved) {
            Object.assign(settings, JSON.parse(saved));
        }
    } catch (e) {
        console.log('No saved settings found');
    }

    const style = document.createElement('style');
    style.innerHTML = `
        #duocheat-border-box {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 580px;
            padding: 2px;
            border-radius: 16px;
            z-index: 99999;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 12px 36px rgba(0,0,0,0.6);
            transition: all 0.3s ease;
            background: linear-gradient(135deg, #3b82f6, #2dd4bf, #ef4444);
        }
        #duocheat-border-box.animations-off {
            background: #1e293b !important;
        }
        #duocheat-border-box.minimized {
            width: 140px;
            height: 36px;
            top: 12px;
            left: 12px;
            transform: translate(0, 0);
            border-radius: 8px;
        }
        #duocheat-border-box.minimized .hide-on-min {
            display: none !important;
        }
        #duocheat-container {
            position: relative;
            width: 100%;
            height: 100%;
            border-radius: 14px;
            padding: 16px;
            font-family: 'Inter', 'Segoe UI', sans-serif;
            z-index: 2;
            color: #f1f5f9;
            background: #0a0f1c;
            overflow: hidden;
        }
        #duocheat-border-box.minimized #duocheat-container {
            padding: 6px 10px;
            border-radius: 6px;
        }
        #motion-canvas-bg, #border-canvas-engine {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1;
            pointer-events: none;
            transition: opacity 0.3s;
        }
        .animations-off #motion-canvas-bg,
        .animations-off #border-canvas-engine {
            opacity: 0 !important;
        }
        .header-top {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
            position: relative;
            z-index: 3;
            border-bottom: 1px solid rgba(255,255,255,0.1);
            padding-bottom: 8px;
        }
        #duocheat-border-box.minimized .header-top {
            margin-bottom: 0;
            border: none;
            padding-bottom: 0;
        }
        .logo-text {
            font-size: 16px;
            font-weight: 900;
            background: linear-gradient(90deg, #3b82f6, #2dd4bf);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        #duocheat-border-box.minimized .logo-text {
            font-size: 12px;
        }
        .nav-controls {
            display: flex;
            gap: 6px;
            align-items: center;
        }
        .nav-icon {
            width: 14px;
            height: 14px;
            cursor: pointer;
            opacity: 0.6;
            transition: 0.2s;
        }
        .nav-icon:hover {
            opacity: 1;
            transform: scale(1.1);
        }
        .user-profile {
            display: flex;
            align-items: center;
            gap: 8px;
            background: rgba(255, 255, 255, 0.05);
            padding: 6px;
            border-radius: 12px;
            margin-bottom: 10px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            position: relative;
            z-index: 3;
        }
        .user-avatar {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            border: 1px solid #3b82f6;
            object-fit: cover;
            background: #1e293b;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 12px;
            color: white;
        }
        .user-info {
            display: flex;
            flex-direction: column;
            flex: 1;
        }
        .user-info b {
            font-size: 11px;
            color: #f1f5f9;
            margin-bottom: 1px;
        }
        .user-info span {
            font-size: 9px;
            color: #94a3b8;
        }
        .stats-wrapper {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 8px;
            margin-bottom: 10px;
            position: relative;
            z-index: 3;
        }
        .stat-card-new {
            background: rgba(30, 41, 59, 0.6);
            border: 1px solid rgba(255,255,255,0.1);
            padding: 8px;
            border-radius: 10px;
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 3px;
        }
        .icon-small {
            width: 20px;
            height: 20px;
        }
        .stat-val {
            font-size: 14px;
            font-weight: 800;
        }
        .stat-lbl {
            font-size: 6px;
            text-transform: uppercase;
            color: #94a3b8;
            letter-spacing: 0.5px;
        }
        .section-title {
            font-size: 8px;
            font-weight: 700;
            color: #3b82f6;
            text-transform: uppercase;
            margin: 8px 0 4px;
            position: relative;
            z-index: 3;
            display: flex;
            align-items: center;
        }
        .section-title::after {
            content: "";
            flex: 1;
            height: 1px;
            background: rgba(59, 130, 246, 0.3);
            margin-left: 8px;
        }
        .mode-selection, .grid-options {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 4px;
            position: relative;
            z-index: 3;
            margin-bottom: 8px;
        }
        .grid-options {
            grid-template-columns: repeat(3, 1fr);
        }
        .mode-btn, .option-item {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 3px;
            padding: 6px;
            background: rgba(51, 65, 85, 0.4);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 8px;
            cursor: pointer;
            font-size: 9px;
            font-weight: 600;
            transition: 0.3s;
            color: #cbd5e1;
        }
        .mode-btn.active {
            border-color: #3b82f6;
            background: rgba(59, 130, 246, 0.2);
            color: #60a5fa;
        }
        .option-item.active {
            border-color: #2dd4bf;
            color: #2dd4bf;
            background: rgba(45, 212, 191, 0.15);
        }
        .amount-input-section {
            background: rgba(15, 23, 42, 0.8);
            border: 1px solid rgba(59, 130, 246, 0.3);
            border-radius: 10px;
            padding: 8px 10px;
            margin-bottom: 8px;
            position: relative;
            z-index: 3;
        }
        .streak-info {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 3px;
        }
        .streak-current {
            font-size: 8px;
            color: #94a3b8;
        }
        .streak-target {
            font-size: 8px;
            color: #3b82f6;
            font-weight: bold;
        }
        .amount-label {
            font-size: 8px;
            font-weight: 700;
            color: #3b82f6;
            text-transform: uppercase;
            margin-bottom: 3px;
            display: block;
        }
        .amount-input {
            width: 100%;
            padding: 6px;
            background: rgba(30, 41, 59, 0.6);
            border: 1px solid rgba(59, 130, 246, 0.3);
            border-radius: 6px;
            color: #f1f5f9;
            font-size: 11px;
            font-weight: 600;
            text-align: center;
            outline: none;
            transition: 0.2s;
        }
        .amount-input:focus {
            border-color: #3b82f6;
            box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.2);
        }
        .log-container {
            background: rgba(0, 0, 0, 0.3);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            padding: 6px;
            margin: 6px 0;
            position: relative;
            z-index: 3;
        }
        .log-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 4px;
        }
        .log-title {
            font-size: 8px;
            font-weight: 700;
            color: #3b82f6;
            text-transform: uppercase;
        }
        .log-status {
            font-size: 8px;
            color: #94a3b8;
        }
        .log-box {
            max-height: 60px;
            overflow-y: auto;
            font-size: 8px;
            font-family: monospace;
            color: #94a3b8;
            background: rgba(0, 0, 0, 0.2);
            border-radius: 4px;
            padding: 4px;
        }
        .log-entry {
            margin: 1px 0;
            padding: 2px 4px;
            border-radius: 3px;
            font-size: 8px;
            line-height: 1.1;
        }
        .log-success {
            background: rgba(34, 197, 94, 0.15);
            color: #86efac;
            border-left: 2px solid #4ade80;
        }
        .log-error {
            background: rgba(239, 68, 68, 0.15);
            color: #fca5a5;
            border-left: 2px solid #f87171;
        }
        .log-info {
            background: rgba(59, 130, 246, 0.15);
            color: #93c5fd;
            border-left: 2px solid #3b82f6;
        }
        .log-warning {
            background: rgba(245, 158, 11, 0.15);
            color: #fcd34d;
            border-left: 2px solid #f59e0b;
        }
        .btn-test {
            margin-top: 6px;
            padding: 5px;
            background: rgba(59, 130, 246, 0.2);
            border: 1px solid #3b82f6;
            border-radius: 5px;
            color: #60a5fa;
            cursor: pointer;
            font-size: 9px;
            width: 100%;
            font-weight: 600;
        }
        .farm-mode-indicator {
            background: rgba(45, 212, 191, 0.1);
            border: 1px solid #2dd4bf;
            border-radius: 5px;
            padding: 4px 6px;
            margin: 4px 0;
            font-size: 8px;
            color: #2dd4bf;
            text-align: center;
            font-weight: bold;
        }
        .data-panel {
            background: rgba(15, 23, 42, 0.8);
            border: 1px solid rgba(59, 130, 246, 0.3);
            border-radius: 10px;
            padding: 6px 8px;
            margin-bottom: 8px;
            display: flex;
            justify-content: space-between;
            position: relative;
            z-index: 3;
        }
        .data-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            flex: 1;
        }
        .data-item span {
            font-size: 6px;
            color: #64748b;
            margin-bottom: 1px;
        }
        .data-item b {
            font-size: 10px;
        }
        .progress-bar-container {
            height: 3px;
            background: rgba(30, 41, 59, 0.6);
            border-radius: 1px;
            overflow: hidden;
            margin-top: 4px;
            position: relative;
            z-index: 3;
        }
        .progress-bar {
            height: 100%;
            background: linear-gradient(90deg, #3b82f6, #2dd4bf);
            width: 0%;
            transition: width 0.3s ease;
        }
        .progress-text {
            font-size: 9px;
            color: #94a3b8;
            margin-top: 1px;
            text-align: center;
            position: relative;
            z-index: 3;
        }
        .btn-main-farm {
            width: 100%;
            padding: 10px;
            background: linear-gradient(135deg, #3b82f6, #2563eb);
            border: none;
            border-radius: 10px;
            color: white;
            font-weight: 800;
            font-size: 12px;
            cursor: pointer;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            position: relative;
            z-index: 3;
            transition: 0.3s;
            margin-top: 6px;
        }
        .btn-main-farm.farming {
            background: linear-gradient(135deg, #ef4444, #b91c1c);
            animation: pulse 1.5s infinite;
        }
        .animations-off .btn-main-farm.farming {
            animation: none;
        }
        @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.8; }
            100% { opacity: 1; }
        }
        .external-buttons {
            position: fixed;
            bottom: 10px;
            right: 10px;
            display: flex;
            flex-direction: column;
            gap: 5px;
            z-index: 99998;
        }
        .external-btn {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            cursor: pointer;
            box-shadow: 0 3px 8px rgba(0,0,0,.3);
            transition: 0.3s;
            border: none;
        }
        .discord-btn {
            background: #5865F2;
            color: white;
        }
        .notify-btn {
            background: #ffb703;
            color: #000;
        }
        .toggle-btn {
            background: linear-gradient(135deg, #58cc02, #1cb0f6);
            color: white;
            font-size: 16px;
        }
        .version-tag {
            position: fixed;
            bottom: 50px;
            right: 16px;
            background: rgba(0,0,0,.5);
            color: #fff;
            font-size: 7px;
            padding: 1px 3px;
            border-radius: 3px;
            z-index: 10000;
            font-family: monospace;
        }

        /* Settings Panel */
        .settings-panel {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 320px;
            background: #0a0f1c;
            border-radius: 12px;
            padding: 16px;
            z-index: 100000;
            box-shadow: 0 10px 30px rgba(0,0,0,0.8);
            border: 1px solid rgba(59, 130, 246, 0.3);
            display: none;
        }
        .settings-panel.active {
            display: block;
        }
        .settings-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
            padding-bottom: 8px;
            border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        .settings-title {
            font-size: 14px;
            font-weight: 800;
            color: #3b82f6;
        }
        .settings-close {
            width: 14px;
            height: 14px;
            cursor: pointer;
            opacity: 0.6;
            transition: 0.2s;
        }
        .settings-close:hover {
            opacity: 1;
            transform: scale(1.1);
        }
        .settings-group {
            margin-bottom: 12px;
        }
        .settings-label {
            font-size: 10px;
            font-weight: 700;
            color: #94a3b8;
            margin-bottom: 6px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .settings-option {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 8px 10px;
            background: rgba(30, 41, 59, 0.6);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 8px;
            margin-bottom: 6px;
            cursor: pointer;
            transition: 0.2s;
        }
        .settings-option:hover {
            background: rgba(51, 65, 85, 0.8);
        }
        .settings-option-label {
            font-size: 10px;
            color: #cbd5e1;
            display: flex;
            align-items: center;
            gap: 6px;
        }
        .settings-option-label img {
            width: 12px;
            height: 12px;
        }
        .settings-toggle {
            width: 24px;
            height: 12px;
            background: rgba(100, 116, 139, 0.5);
            border-radius: 6px;
            position: relative;
            cursor: pointer;
            transition: 0.3s;
        }
        .settings-toggle.active {
            background: #3b82f6;
        }
        .settings-toggle::after {
            content: '';
            position: absolute;
            width: 10px;
            height: 10px;
            background: white;
            border-radius: 50%;
            top: 1px;
            left: 1px;
            transition: 0.3s;
        }
        .settings-toggle.active::after {
            left: 13px;
        }
        .settings-btn {
            width: 100%;
            padding: 8px;
            background: rgba(59, 130, 246, 0.2);
            border: 1px solid #3b82f6;
            border-radius: 6px;
            color: #60a5fa;
            cursor: pointer;
            font-size: 10px;
            font-weight: 600;
            text-align: center;
            margin-top: 8px;
            transition: 0.2s;
        }
        .settings-btn:hover {
            background: rgba(59, 130, 246, 0.3);
        }
        .settings-btn.danger {
            background: rgba(239, 68, 68, 0.2);
            border-color: #ef4444;
            color: #fca5a5;
        }
        .settings-btn.danger:hover {
            background: rgba(239, 68, 68, 0.3);
        }
        .settings-btn.success {
            background: rgba(34, 197, 94, 0.2);
            border-color: #22c55e;
            color: #86efac;
        }
        .settings-btn.success:hover {
            background: rgba(34, 197, 94, 0.3);
        }
        .settings-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            z-index: 99999;
            display: none;
        }
        .settings-overlay.active {
            display: block;
        }
    `;
    document.head.appendChild(style);

    // === MAIN UI CONTAINER ===
    const borderBox = document.createElement('div');
    borderBox.id = 'duocheat-border-box';

    const borderCanvas = document.createElement('canvas');
    borderCanvas.id = 'border-canvas-engine';

    const container = document.createElement('div');
    container.id = 'duocheat-container';
    container.innerHTML = `
        <canvas id="motion-canvas-bg"></canvas>
        <div class="header-top">
            <div class="logo-text" id="logo-main">DuoMax LITE<span style="font-size:8px; color:#64748b" class="hide-on-min">${VERSION}</span></div>
            <div class="nav-controls">
                <img src="${ICONS.settings}" class="nav-icon" id="btn-settings" title="Settings">
                <img src="${ICONS.minimize}" class="nav-icon" id="btn-minimize-toggle" title="Minimize/Maximize">
                <img src="${ICONS.close}" class="nav-icon" id="btn-close-ui" title="Close">
            </div>
        </div>
        <div class="hide-on-min">
            <div id="user-display" class="user-profile">
                <div class="user-avatar"></div>
                <div class="user-info">
                    <b>Loading User...</b>
                    <span id="user-status">Checking login...</span>
                </div>
            </div>
            <div class="stats-wrapper">
                <div class="stat-card-new">
                    <img src="${ICONS.xp}" class="icon-small">
                    <span class="stat-val" id="st-xp">0</span>
                    <span class="stat-lbl">⚡XP</span>
                </div>
                <div class="stat-card-new">
                    <img src="${ICONS.gem}" class="icon-small">
                    <span class="stat-val" style="color:#0ea5e9" id="st-gems">0</span>
                    <span class="stat-lbl">GEMS</span>
                </div>
                <div class="stat-card-new">
                    <img src="${ICONS.streak}" class="icon-small">
                    <span class="stat-val" style="color:#ff9600" id="st-streak">0</span>
                    <span class="stat-lbl">🔥STREAK</span>
                </div>
            </div>

            <div class="section-title">FARM ENGINE MODE</div>
            <div class="mode-selection">
                <div class="mode-btn active" id="sp-safe">🛡️ SAFE</div>
                <div class="mode-btn" id="sp-fast">⚡ FAST</div>
            </div>

            <div class="section-title">TARGET MODULES</div>
            <div class="grid-options">
                <div class="option-item active" id="opt-xp">
                    <img src="${ICONS.xp}" style="width:10px; height:10px"> XP
                </div>
                <div class="option-item" id="opt-gems">
                    <img src="${ICONS.gem}" style="width:10px; height:10px"> Gems
                </div>
                <div class="option-item" id="opt-streak">
                    <img src="${ICONS.streak}" style="width:10px; height:10px"> Streak
                </div>
                <div class="option-item" id="opt-league">
                    <img src="${ICONS.league}" style="width:10px; height:10px"> League
                </div>
                <div class="option-item" id="opt-quest">
                    <img src="${ICONS.quest}" style="width:10px; height:10px"> Quests
                </div>
                <div class="option-item" id="opt-all">🔥 All-In</div>
            </div>

            <div class="amount-input-section">
                <div class="streak-info">
                    <span class="streak-current" id="current-streak-display">Current: 0 days</span>
                    <span class="streak-target" id="target-streak-display">Target: 0 days</span>
                </div>
                <span class="amount-label">🎯 AMOUNT TO FARM</span>
                <input type="number" id="targetValue" class="amount-input" placeholder="e.g., 1000 XP" value="1000" min="1" max="999999">
            </div>

            <button class="btn-test" id="btn-test-api">Test API Connection</button>

            <div class="log-container">
                <div class="log-header">
                    <div class="log-title">ACTIVITY LOG</div>
                    <div class="log-status" id="log-status">Last: System started</div>
                </div>
                <div class="log-box" id="log-box">
                    <div class="log-entry log-info">System initialized. Ready to farm.</div>
                </div>
            </div>

            <div class="farm-mode-indicator" id="farm-mode-indicator">
                🛡️ SAFE MODE ACTIVE | DELAY: 3s
            </div>

            <div class="section-title">FARMING STATUS</div>
            <div class="data-panel">
                <div class="data-item">
                    <span>RUNTIME</span>
                    <b id="data-time">00:00:00</b>
                </div>
                <div class="data-item">
                    <span>STREAK DAYS</span>
                    <b id="data-streak-days">0</b>
                </div>
                <div class="data-item">
                    <span>STATUS</span>
                    <b id="data-status" style="color:#ef4444">IDLE</b>
                </div>
            </div>
            <div class="progress-bar-container">
                <div id="progressBar" class="progress-bar"></div>
            </div>
            <div class="progress-text" id="progressText">❌ Not started</div>
            <button class="btn-main-farm" id="btn-master-farm">${t('start')}</button>
        </div>
    `;

    borderBox.appendChild(borderCanvas);
    borderBox.appendChild(container);
    document.body.appendChild(borderBox);

    // === SETTINGS PANEL ===
    const settingsOverlay = document.createElement('div');
    settingsOverlay.className = 'settings-overlay';

    const settingsPanel = document.createElement('div');
    settingsPanel.className = 'settings-panel';
    settingsPanel.innerHTML = `
        <div class="settings-header">
            <div class="settings-title">⚙️ SETTINGS</div>
            <img src="${ICONS.close}" class="settings-close" id="settings-close" title="Close">
        </div>
        <div class="settings-group">
            <div class="settings-label">VISUAL SETTINGS</div>
            <div class="settings-option" id="toggle-animations">
                <div class="settings-option-label">
                    <span>🎨 Animations</span>
                </div>
                <div class="settings-toggle ${settings.animations ? 'active' : ''}"></div>
            </div>
            <div class="settings-option" id="toggle-debug">
                <div class="settings-option-label">
                    <span>🐛 Debug Mode</span>
                </div>
                <div class="settings-toggle ${settings.debugMode ? 'active' : ''}"></div>
            </div>
            <div class="settings-option" id="toggle-autoclear">
                <div class="settings-option-label">
                    <span>🧹 Auto-clear Logs</span>
                </div>
                <div class="settings-toggle ${settings.autoClearLogs ? 'active' : ''}"></div>
            </div>
        </div>
        <div class="settings-group">
            <div class="settings-label">MAINTENANCE</div>
            <button class="settings-btn" id="clear-logs-btn">
                🗑️ Clear Activity Logs
            </button>
            <button class="settings-btn" id="clear-cache-btn">
                🧹 Clear UI Cache
            </button>
            <button class="settings-btn" id="reset-settings-btn">
                🔄 Reset to Default
            </button>
            <button class="settings-btn danger" id="refresh-ui-btn">
                ♻️ Refresh UI
            </button>
            <button class="settings-btn success" id="export-settings-btn">
                📤 Export Settings
            </button>
        </div>
        <div class="settings-group">
            <div class="settings-label">INFORMATION</div>
            <div style="font-size:9px; color:#94a3b8; padding:6px 10px; background:rgba(30,41,59,0.6); border-radius:6px; margin-bottom:8px;">
                <strong>Version:</strong> ${VERSION}<br>
                <strong>UI Size:</strong> Compact (580px)<br>
                <strong>Animations:</strong> ${settings.animations ? 'ON' : 'OFF'}
            </div>
        </div>
    `;

    document.body.appendChild(settingsOverlay);
    document.body.appendChild(settingsPanel);

    // === EXTERNAL BUTTONS ===
    const externalButtons = document.createElement('div');
    externalButtons.className = 'external-buttons';
    externalButtons.innerHTML = `
        <button class="external-btn discord-btn" id="external-discord" title="Discord Chat">💬</button>
        <button class="external-btn notify-btn" id="external-notify" title="Notifications">🔔</button>
        <button class="external-btn toggle-btn" id="external-toggle" title="Toggle Panel">⚙️</button>
    `;
    document.body.appendChild(externalButtons);

    const versionTag = Object.assign(document.createElement('div'), {
        className: 'version-tag',
        textContent: VERSION
    });
    document.body.appendChild(versionTag);

    // === DISCORD CHAT IFRAME ===
    const discordChat = document.createElement('div');
    discordChat.className = 'duo-discord-chat';
    discordChat.style.cssText = 'position:fixed;bottom:70px;right:12px;width:280px;height:350px;background:#fff;border:2px solid #5865F2;border-radius:6px;overflow:hidden;z-index:99997;display:none;box-shadow:0 4px 10px rgba(0,0,0,.3);';

    const iframe = document.createElement('iframe');
    iframe.src = WIDGET_URL;
    iframe.style.cssText = 'border:none;width:100%;height:100%;';
    iframe.setAttribute('allowtransparency', 'true');
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('sandbox', 'allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts');
    discordChat.appendChild(iframe);
    document.body.appendChild(discordChat);

    // === ANIMATION ===
    const ctxB = borderCanvas.getContext('2d');
    const canvasM = document.getElementById('motion-canvas-bg');
    const ctxM = canvasM.getContext('2d');
    let angle = 0;
    let animationId = null;

    function animate() {
        if (!document.getElementById('duocheat-border-box')) return;
        borderCanvas.width = borderBox.offsetWidth;
        borderCanvas.height = borderBox.offsetHeight;
        ctxB.clearRect(0, 0, borderCanvas.width, borderCanvas.height);
        ctxB.translate(borderCanvas.width/2, borderCanvas.height/2);
        ctxB.rotate(angle);
        const grad = ctxB.createConicGradient(0, 0, 0);
        grad.addColorStop(0, '#3b82f6');
        grad.addColorStop(0.2, '#2dd4bf');
        grad.addColorStop(0.5, '#ef4444');
        grad.addColorStop(1, '#3b82f6');
        ctxB.fillStyle = grad;
        ctxB.fillRect(-borderCanvas.width, -borderCanvas.height, borderCanvas.width*2, borderCanvas.height*2);
        ctxB.resetTransform();

        canvasM.width = container.offsetWidth;
        canvasM.height = container.offsetHeight;
        ctxM.fillStyle = '#0a0f1c';
        ctxM.fillRect(0, 0, canvasM.width, canvasM.height);
        const radial = ctxM.createRadialGradient(canvasM.width/2, canvasM.height/2, 0, canvasM.width/2, canvasM.height/2, 240);
        radial.addColorStop(0, 'rgba(59, 130, 246, 0.1)');
        radial.addColorStop(1, 'transparent');
        ctxM.fillStyle = radial;
        ctxM.fillRect(0, 0, canvasM.width, canvasM.height);
        angle += 0.015;

        if (settings.animations) {
            animationId = requestAnimationFrame(animate);
        }
    }

    function startAnimation() {
        if (settings.animations && !animationId) {
            animate();
        }
    }

    function stopAnimation() {
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
    }

    // Apply initial animation settings
    if (!settings.animations) {
        borderBox.classList.add('animations-off');
    } else {
        startAnimation();
    }

    // === LOG MANAGEMENT ===
    let logCount = 0;
    const MAX_LOGS = 15;

    function addLog(message, type = 'info') {
        const logBox = document.getElementById('log-box');
        const logStatus = document.getElementById('log-status');

        // Truncate message if too long
        const maxLength = 60;
        const displayMsg = message.length > maxLength ?
            message.substring(0, maxLength) + '...' : message;

        const logEntry = document.createElement('div');
        logEntry.className = `log-entry log-${type}`;
        logEntry.textContent = `[${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})}] ${displayMsg}`;

        // Add tooltip with full message
        logEntry.title = message;

        logBox.appendChild(logEntry);
        logCount++;

        // Limit number of logs
        if (logCount > MAX_LOGS && settings.autoClearLogs) {
            logBox.removeChild(logBox.firstChild);
            logCount--;
        }

        logBox.scrollTop = logBox.scrollHeight;

        // Update status with last log
        logStatus.textContent = `Last: ${type.toUpperCase()}`;
        logStatus.style.color = {
            'success': '#4ade80',
            'error': '#f87171',
            'info': '#60a5fa',
            'warning': '#fbbf24'
        }[type] || '#94a3b8';

        if (settings.debugMode || type === 'error') {
            console.log(`[DuoMax LITE ${type.toUpperCase()}] ${message}`);
        }
    }

    // === SETTINGS FUNCTIONS ===
    function saveSettings() {
        try {
            localStorage.setItem('duomax_settings', JSON.stringify(settings));
            addLog('Settings saved', 'success');
        } catch (e) {
            addLog('Failed to save settings: ' + e.message, 'error');
        }
    }

    function toggleSetting(settingName) {
        settings[settingName] = !settings[settingName];
        saveSettings();

        // Apply setting changes
        switch(settingName) {
            case 'animations':
                if (settings.animations) {
                    borderBox.classList.remove('animations-off');
                    startAnimation();
                } else {
                    borderBox.classList.add('animations-off');
                    stopAnimation();
                }
                addLog(`Animations ${settings.animations ? 'enabled' : 'disabled'}`, 'info');
                break;

            case 'debugMode':
                addLog(`Debug mode ${settings.debugMode ? 'enabled' : 'disabled'}`, 'info');
                break;

            case 'autoClearLogs':
                addLog(`Auto-clear logs ${settings.autoClearLogs ? 'enabled' : 'disabled'}`, 'info');
                break;
        }
    }

    function clearLogs() {
        const logBox = document.getElementById('log-box');
        logBox.innerHTML = '<div class="log-entry log-info">Logs cleared</div>';
        logCount = 0;
        addLog('Activity logs cleared', 'success');
    }

    function clearCache() {
        try {
            // Clear various caches
            localStorage.removeItem('duomax_ui_state');
            sessionStorage.removeItem('duomax_temp');
            addLog('UI cache cleared', 'success');

            // Refresh some UI elements
            document.getElementById('log-status').textContent = 'Last: Cache cleared';

        } catch (e) {
            addLog('Failed to clear cache: ' + e.message, 'error');
        }
    }

    function resetSettings() {
        if (confirm('Reset all settings to default?')) {
            // Reset to default settings
            settings.animations = true;
            settings.debugMode = false;
            settings.autoClearLogs = true;

            saveSettings();

            // Apply changes
            borderBox.classList.remove('animations-off');
            startAnimation();

            // Update toggle buttons
            document.querySelectorAll('.settings-toggle').forEach((toggle, index) => {
                const settingNames = ['animations', 'debugMode', 'autoClearLogs'];
                toggle.classList.toggle('active', settings[settingNames[index]]);
            });

            addLog('Settings reset to default', 'success');
        }
    }

    function refreshUI() {
        if (confirm('Refresh UI? This will restart the interface.')) {
            location.reload();
        }
    }

    function exportSettings() {
        const dataStr = JSON.stringify(settings, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

        const exportFileDefaultName = `duomax_settings_${new Date().toISOString().split('T')[0]}.json`;

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();

        addLog('Settings exported', 'success');
    }

    // === UI CONTROLS ===
    document.getElementById('btn-close-ui').onclick = () => {
        borderBox.remove();
        externalButtons.remove();
        versionTag.remove();
        discordChat.remove();
        settingsOverlay.remove();
        settingsPanel.remove();
        stopAnimation();
    };

    document.getElementById('btn-minimize-toggle').onclick = () => {
        borderBox.classList.toggle('minimized');
        document.getElementById('logo-main').innerHTML = borderBox.classList.contains('minimized')
            ? "DUOMAX LITE"
            : `DUOMAX LITE <span style="font-size:8px; color:#64748b" class="hide-on-min">${VERSION}</span>`;
        navigator.vibrate?.(20);
    };

    // Settings button
    document.getElementById('btn-settings').onclick = () => {
        settingsOverlay.classList.add('active');
        settingsPanel.classList.add('active');
        navigator.vibrate?.(20);
    };

    // Settings panel controls
    document.getElementById('settings-close').onclick = () => {
        settingsOverlay.classList.remove('active');
        settingsPanel.classList.remove('active');
    };

    settingsOverlay.onclick = (e) => {
        if (e.target === settingsOverlay) {
            settingsOverlay.classList.remove('active');
            settingsPanel.classList.remove('active');
        }
    };

    // Toggle buttons
    document.getElementById('toggle-animations').onclick = () => {
        toggleSetting('animations');
        document.querySelector('#toggle-animations .settings-toggle').classList.toggle('active');
    };

    document.getElementById('toggle-debug').onclick = () => {
        toggleSetting('debugMode');
        document.querySelector('#toggle-debug .settings-toggle').classList.toggle('active');
    };

    document.getElementById('toggle-autoclear').onclick = () => {
        toggleSetting('autoClearLogs');
        document.querySelector('#toggle-autoclear .settings-toggle').classList.toggle('active');
    };

    // Action buttons
    document.getElementById('clear-logs-btn').onclick = clearLogs;
    document.getElementById('clear-cache-btn').onclick = clearCache;
    document.getElementById('reset-settings-btn').onclick = resetSettings;
    document.getElementById('refresh-ui-btn').onclick = refreshUI;
    document.getElementById('export-settings-btn').onclick = exportSettings;

    // External buttons control
    let chatVisible = false;
    document.getElementById('external-discord').onclick = () => {
        chatVisible = !chatVisible;
        discordChat.style.display = chatVisible ? 'block' : 'none';
        navigator.vibrate?.(30);
    };

    document.getElementById('external-notify').onclick = () => {
        alert('📢 DuoMax LITE v1.0.5\nXP, GEMS, and REAL STREAK farming active!\n(ADMIN: YAMISCRIPT_DEV)');
        navigator.vibrate?.(30);
    };

    document.getElementById('external-toggle').onclick = () => {
        const isMinimized = borderBox.classList.contains('minimized');
        if (isMinimized) {
            borderBox.classList.remove('minimized');
            borderBox.style.top = '50%';
            borderBox.style.left = '50%';
            borderBox.style.transform = 'translate(-50%, -50%)';
        } else {
            borderBox.style.top = '12px';
            borderBox.style.left = '12px';
            borderBox.style.transform = 'translate(0, 0)';
        }
        navigator.vibrate?.(40);
    };

    // === UTILITY FUNCTIONS ===
    function getJwtToken() {
        try {
            // Method 1: Check localStorage
            const state = localStorage.getItem('duo-state');
            if (state) {
                const parsed = JSON.parse(state);
                if (parsed?.user?.jwt) {
                    return parsed.user.jwt;
                }
            }

            // Method 2: Check cookies
            const cookies = document.cookie.split(';');
            for (let cookie of cookies) {
                cookie = cookie.trim();
                if (cookie.startsWith('jwt_token=')) {
                    return cookie.substring(10);
                }
                if (cookie.startsWith('jwtToken=')) {
                    return cookie.substring(9);
                }
            }

            // Method 3: Check window object
            if (window.duo?.user?.jwt) {
                return window.duo.user.jwt;
            }

            // Method 4: Check sessionStorage
            const sessionJwt = sessionStorage.getItem('duolingo_jwt');
            if (sessionJwt) return sessionJwt;

            return null;
        } catch (e) {
            console.error('Error getting JWT:', e);
            return null;
        }
    }

    function getUserId() {
        try {
            const jwt = getJwtToken();
            if (!jwt) return null;

            // Decode JWT payload
            const payload = jwt.split('.')[1];
            const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
            return decoded.sub || decoded.user_id || null;
        } catch (e) {
            return null;
        }
    }

    // === SYNC USER FUNCTION ===
    async function syncUser() {
        try {
            const jwt = getJwtToken();
            if (!jwt) {
                throw new Error("Not logged in - No JWT token found");
            }

            const userId = getUserId();
            if (!userId) {
                throw new Error("No user ID found in JWT");
            }

            const headers = {
                'Authorization': `Bearer ${jwt}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            };

            addLog(`Fetching user data for ID: ${userId}`, 'info');

            // Get user info from Duolingo API (2017-06-30)
            const userRes = await fetch(`https://www.duolingo.com/2017-06-30/users/${userId}?fields=username,streak,totalXp,gems,profilePicture,fromLanguage,learningLanguage`, { headers });

            if (!userRes.ok) {
                throw new Error(`API Error: ${userRes.status} ${userRes.statusText}`);
            }

            const userData = await userRes.json();
            addLog(`User data received: ${userData.username}`, 'success');

            // Get user info from v2 API for better data
            try {
                const v2Res = await fetch(`https://www.duolingo.com/api/2/users/${userId}?fields=name,avatar,courses`, {
                    headers: {
                        'Authorization': `Bearer ${jwt}`,
                        'Accept': 'application/json'
                    }
                });

                if (v2Res.ok) {
                    const v2Data = await v2Res.json();
                    await updateUserDisplayWithV2Data(userData, v2Data);
                } else {
                    // Fallback to v1 API
                    await tryV1API(userData, userId);
                }
            } catch (v2Error) {
                console.log('V2 API failed, trying v1:', v2Error);
                await tryV1API(userData, userId);
            }

            return userData;

        } catch (e) {
            console.error("Sync User Error:", e);
            addLog(`Sync Error: ${e.message}`, 'error');

            // Show guest state
            document.getElementById('user-display').innerHTML = `
                <div class="user-avatar" style="background:linear-gradient(135deg, #3b82f6, #2dd4bf)"></div>
                <div class="user-info">
                    <b>Guest User</b>
                    <span id="user-status">Login to sync data</span>
                </div>
            `;
            document.getElementById('user-status').textContent = '❌ Not logged in • Please log in';
            return null;
        }
    }

    async function tryV1API(userData, userId) {
        try {
            // Try with userId first
            const v1Res = await fetch(`https://www.duolingo.com/api/1/users/show?id=${userId}`);
            if (v1Res.ok) {
                const v1Data = await v1Res.json();
                await updateUserDisplayWithV1Data(userData, v1Data);
                return;
            }

            // Try with username
            const usernameRes = await fetch(`https://www.duolingo.com/api/1/users/show?username=${userData.username}`);
            if (usernameRes.ok) {
                const usernameData = await usernameRes.json();
                await updateUserDisplayWithV1Data(userData, usernameData);
                return;
            }

            // If all API calls fail, use basic data
            await updateUserDisplayBasic(userData);

        } catch (v1Error) {
            console.log('V1 API failed:', v1Error);
            await updateUserDisplayBasic(userData);
        }
    }

    async function updateUserDisplayWithV2Data(userData, v2Data) {
        // Get display name
        const displayName = v2Data.name || userData.username;

        // Get avatar - try different formats
        let avatarUrl = '';
        if (v2Data.avatar) {
            if (typeof v2Data.avatar === 'string') {
                avatarUrl = v2Data.avatar;
            } else if (v2Data.avatar.large) {
                avatarUrl = v2Data.avatar.large;
            } else if (v2Data.avatar.medium) {
                avatarUrl = v2Data.avatar.medium;
            } else if (v2Data.avatar.small) {
                avatarUrl = v2Data.avatar.small;
            }
        }

        await updateUserDisplay(displayName, userData.username, avatarUrl, userData.streak, userData.totalXp, userData.gems);
    }

    async function updateUserDisplayWithV1Data(userData, v1Data) {
        // Get display name
        const displayName = v1Data.fullname || v1Data.name || userData.username;

        // Get avatar - v1 API returns URLs like "https://dl-web.duolingo.com/avatars/abc123/large"
        let avatarUrl = '';
        if (v1Data.avatar) {
            if (typeof v1Data.avatar === 'string') {
                avatarUrl = v1Data.avatar;
                // Ensure it's a complete URL
                if (avatarUrl && !avatarUrl.startsWith('http')) {
                    avatarUrl = `https://dl-web.duolingo.com${avatarUrl}`;
                }
            }
        }

        await updateUserDisplay(displayName, userData.username, avatarUrl, userData.streak, userData.totalXp, userData.gems);
    }

    async function updateUserDisplayBasic(userData) {
        await updateUserDisplay(userData.username, userData.username, '', userData.streak, userData.totalXp, userData.gems);
    }

    // Helper function to update user display
    async function updateUserDisplay(displayName, username, avatarUrl, streak, xp, gems) {
        // Create avatar element
        const userDisplay = document.getElementById('user-display');

        // Clear existing content
        userDisplay.innerHTML = '';

        // Create avatar container
        const avatarContainer = document.createElement('div');
        avatarContainer.className = 'user-avatar';

        // Handle avatar URL
        if (avatarUrl) {
            // Make sure avatar URL is complete
            if (!avatarUrl.startsWith('http')) {
                avatarUrl = `https://dl-web.duolingo.com${avatarUrl}`;
            }

            // Create img element
            const avatarImg = document.createElement('img');
            avatarImg.className = 'user-avatar';
            avatarImg.src = avatarUrl;
            avatarImg.onerror = function() {
                // If image fails to load, use gradient background
                this.style.display = 'none';
                avatarContainer.style.background = 'linear-gradient(135deg, #3b82f6, #2dd4bf)';
                avatarContainer.style.display = 'flex';
                avatarContainer.style.alignItems = 'center';
                avatarContainer.style.justifyContent = 'center';
                avatarContainer.innerHTML = `<span style="font-weight:bold;color:white;font-size:10px">${displayName.charAt(0).toUpperCase()}</span>`;
            };

            avatarContainer.appendChild(avatarImg);
        } else {
            // Use gradient background with initial
            avatarContainer.style.background = 'linear-gradient(135deg, #3b82f6, #2dd4bf)';
            avatarContainer.style.display = 'flex';
            avatarContainer.style.alignItems = 'center';
            avatarContainer.style.justifyContent = 'center';
            avatarContainer.innerHTML = `<span style="font-weight:bold;color:white;font-size:10px">${displayName.charAt(0).toUpperCase()}</span>`;
        }

        // Create user info container
        const userInfo = document.createElement('div');
        userInfo.className = 'user-info';
        userInfo.innerHTML = `
            <b>${displayName}</b>
            <span id="user-status">@${username} • Streak: ${streak || 0} days</span>
        `;

        // Append to user display
        userDisplay.appendChild(avatarContainer);
        userDisplay.appendChild(userInfo);

        // Update stats
        document.getElementById('st-streak').innerText = streak || 0;
        document.getElementById('st-xp').innerText = xp || 0;
        document.getElementById('st-gems').innerText = gems || 0;
        document.getElementById('current-streak-display').textContent = `Current: ${streak || 0} days`;

        // Set user status
        const userStatus = document.getElementById('user-status');
        if (userStatus) {
            userStatus.textContent = `✅ @${username} • ${streak || 0} day streak`;
        }

        addLog(`User synced: ${displayName} (@${username})`, 'success');
    }

    // === TEST API FUNCTION ===
    document.getElementById('btn-test-api').onclick = async () => {
        addLog('Testing API connection...', 'info');

        const jwt = getJwtToken();
        if (!jwt) {
            addLog('ERROR: No JWT token found. Please log in to Duolingo.', 'error');
            alert('❌ Not logged in! Please log in to Duolingo first.');
            return;
        }

        addLog(`JWT token found: ${jwt.substring(0, 20)}...`, 'success');

        const userId = getUserId();
        if (!userId) {
            addLog('ERROR: Cannot extract user ID from token', 'error');
            return;
        }

        addLog(`User ID: ${userId}`, 'success');

        // Test basic API call
        try {
            const headers = {
                'Authorization': `Bearer ${jwt}`,
                'Content-Type': 'application/json'
            };

            const testRes = await fetch(`https://www.duolingo.com/2017-06-30/users/${userId}?fields=username,streak,totalXp,gems`, { headers });

            if (testRes.ok) {
                const data = await testRes.json();
                addLog(`✅ API Connection SUCCESS! Username: ${data.username}, Streak: ${data.streak || 0}, XP: ${data.totalXp || 0}`, 'success');
                alert(`✅ API Connection Successful!\nUsername: ${data.username}\nStreak: ${data.streak || 0} days\nXP: ${data.totalXp || 0}\nGems: ${data.gems || 0}`);

                // Update UI using sync function
                await syncUser();

            } else {
                addLog(`❌ API Error: ${testRes.status} ${testRes.statusText}`, 'error');
                alert(`❌ API Error: ${testRes.status}`);
            }
        } catch (error) {
            addLog(`❌ Network Error: ${error.message}`, 'error');
            alert('❌ Network error. Check console for details.');
        }
    };

    // === REAL STREAK FARMING FUNCTION ===
    async function farmStreak(targetDays) {
        const jwt = getJwtToken();
        if (!jwt) {
            addLog('ERROR: No authentication token', 'error');
            alert('❌ Please log in to Duolingo first!');
            return;
        }

        const userId = getUserId();
        if (!userId) {
            addLog('ERROR: No user ID', 'error');
            return;
        }

        const headers = {
            'Authorization': `Bearer ${jwt}`,
            'Content-Type': 'application/json'
        };

        try {
            // Get current streak info
            const userRes = await fetch(`https://www.duolingo.com/2017-06-30/users/${userId}?fields=streak,streakData,fromLanguage,learningLanguage`, { headers });
            if (!userRes.ok) {
                addLog('Failed to get user streak info', 'error');
                return;
            }

            const userData = await userRes.json();
            const currentStreak = userData.streak || 0;
            const hasStreak = userData.streakData?.currentStreak;
            const startStreakDate = hasStreak ? userData.streakData.currentStreak.startDate : new Date();
            const startFarmStreakTimestamp = Math.floor(new Date(startStreakDate).getTime() / 1000);
            let currentTimestamp = hasStreak ? startFarmStreakTimestamp - 86400 : startFarmStreakTimestamp;

            addLog(`Starting streak farming: Current streak ${currentStreak} days`, 'info');
            addLog(`Will simulate sessions starting from ${new Date(currentTimestamp * 1000).toLocaleDateString()}`, 'info');
            addLog(`Target: Add ${targetDays} days (Total: ${currentStreak + targetDays} days)`, 'info');

            document.getElementById('progressText').textContent = `🔥 Starting streak farming...`;
            document.getElementById('target-streak-display').textContent = `Target: ${currentStreak + targetDays} days`;

            let streakAdded = 0;

            while (streakAdded < targetDays && isFarming) {
                try {
                    addLog(`Processing streak day ${streakAdded + 1}/${targetDays}`, 'info');

                    // Create a practice session
                    const sessionPayload = {
                        challengeTypes: ['translate', 'assist'],
                        fromLanguage: userData.fromLanguage || 'en',
                        learningLanguage: userData.learningLanguage || 'es',
                        type: 'GLOBAL_PRACTICE',
                        difficulty: 'EASY',
                        startTime: currentTimestamp,
                        endTime: currentTimestamp + 300
                    };

                    const sessionRes = await fetch('https://www.duolingo.com/2017-06-30/sessions', {
                        method: 'POST',
                        headers,
                        body: JSON.stringify(sessionPayload)
                    });

                    if (!sessionRes.ok) {
                        throw new Error(`Session creation failed: ${sessionRes.status}`);
                    }

                    const sessionData = await sessionRes.json();

                    // Complete the session with good results
                    const completePayload = {
                        ...sessionData,
                        heartsLeft: 5,
                        failed: false,
                        maxInLessonStreak: 10,
                        shouldLearnThings: true,
                        xpGain: 15,
                        startTime: currentTimestamp,
                        endTime: currentTimestamp + 300
                    };

                    const completeRes = await fetch(`https://www.duolingo.com/2017-06-30/sessions/${sessionData.id}`, {
                        method: 'PUT',
                        headers,
                        body: JSON.stringify(completePayload)
                    });

                    if (!completeRes.ok) {
                        throw new Error(`Session completion failed: ${completeRes.status}`);
                    }

                    // Move to previous day for next session
                    currentTimestamp -= 86400;
                    streakAdded++;

                    // Calculate new streak total
                    const newStreak = currentStreak + streakAdded;

                    // Update UI
                    document.getElementById('st-streak').innerText = newStreak;
                    document.getElementById('data-streak-days').innerText = streakAdded;
                    document.getElementById('progressBar').style.width = `${(streakAdded/targetDays)*100}%`;
                    document.getElementById('progressText').textContent = `🔥 Day ${streakAdded}/${targetDays}: Streak at ${newStreak} days`;
                    document.getElementById('current-streak-display').textContent = `Current: ${newStreak} days`;

                    // Also add XP for the lesson
                    const currentXP = parseInt(document.getElementById('st-xp').innerText) || 0;
                    document.getElementById('st-xp').innerText = currentXP + 15;

                    addLog(`✅ Streak day ${streakAdded} completed. Total: ${newStreak} days`, 'success');

                    // Delay between days based on mode
                    const delayTime = mult === 1 ? 5000 : 2000;
                    await new Promise(r => setTimeout(r, delayTime));

                } catch (dayError) {
                    addLog(`⚠️ Session failed for day ${streakAdded + 1}: ${dayError.message}`, 'error');
                    await new Promise(r => setTimeout(r, 3000));
                }
            }

            if (streakAdded >= targetDays) {
                addLog(`✅ Streak farming completed! Added ${streakAdded} days`, 'success');
                document.getElementById('progressText').textContent = `✅ Streak farming completed! Added ${streakAdded} days`;

                // Verify the new streak
                try {
                    const verifyRes = await fetch(`https://www.duolingo.com/2017-06-30/users/${userId}?fields=streak`, { headers });
                    if (verifyRes.ok) {
                        const verifyData = await verifyRes.json();
                        const finalStreak = verifyData.streak || 0;
                        addLog(`Final streak verification: ${finalStreak} days`, 'success');

                        if (finalStreak >= currentStreak + streakAdded) {
                            alert(`🎉 SUCCESS! Your streak is now ${finalStreak} days!`);
                        } else {
                            alert(`⚠️ Partial success: Streak increased from ${currentStreak} to ${finalStreak} days`);
                        }
                    }
                } catch (verifyError) {
                    addLog('Could not verify final streak', 'info');
                    alert(`✅ Streak farming completed! Check your Duolingo profile.`);
                }
            }

        } catch (error) {
            addLog(`❌ Streak farming error: ${error.message}`, 'error');
            document.getElementById('progressText').textContent = '❌ Error farming streak!';
            alert('❌ Error farming streak. Please try again.');
        }
    }

    // === XP FARMING FUNCTION ===
    async function farmXP_Simple(amount) {
        addLog(`Starting XP farm: ${amount} XP`, 'info');

        const jwt = getJwtToken();
        if (!jwt) {
            addLog('ERROR: No authentication token', 'error');
            return;
        }

        const userId = getUserId();
        if (!userId) {
            addLog('ERROR: No user ID', 'error');
            return;
        }

        const headers = {
            'Authorization': `Bearer ${jwt}`,
            'Content-Type': 'application/json'
        };

        let farmed = 0;
        const batchSize = 10; // XP per session

        while (farmed < amount && isFarming) {
            try {
                // Get user language info
                const userInfo = await fetch(`https://www.duolingo.com/2017-06-30/users/${userId}?fields=fromLanguage,learningLanguage`, { headers });
                const userData = await userInfo.json();

                // Create a simple practice session
                const sessionData = {
                    challengeTypes: ['translate'],
                    fromLanguage: userData.fromLanguage || 'en',
                    learningLanguage: userData.learningLanguage || 'es',
                    type: 'GLOBAL_PRACTICE',
                    difficulty: 'EASY'
                };

                const sessionRes = await fetch('https://www.duolingo.com/2017-06-30/sessions', {
                    method: 'POST',
                    headers,
                    body: JSON.stringify(sessionData)
                });

                if (!sessionRes.ok) {
                    addLog(`Session creation failed: ${sessionRes.status}`, 'error');
                    await new Promise(r => setTimeout(r, 2000));
                    continue;
                }

                const session = await sessionRes.json();

                // Complete the session
                const completeData = {
                    ...session,
                    heartsLeft: 5,
                    startTime: Math.floor(Date.now()/1000) - 60,
                    endTime: Math.floor(Date.now()/1000),
                    failed: false,
                    maxInLessonStreak: 10,
                    shouldLearnThings: true,
                    xpGain: batchSize
                };

                const completeRes = await fetch(`https://www.duolingo.com/2017-06-30/sessions/${session.id}`, {
                    method: 'PUT',
                    headers,
                    body: JSON.stringify(completeData)
                });

                if (completeRes.ok) {
                    farmed += batchSize;

                    // Update UI
                    const currentXP = parseInt(document.getElementById('st-xp').innerText) || 0;
                    document.getElementById('st-xp').innerText = currentXP + batchSize;
                    document.getElementById('progressBar').style.width = `${(farmed/amount)*100}%`;
                    document.getElementById('progressText').textContent = `🧠 Farming ${farmed}/${amount} XP`;

                    addLog(`+${batchSize} XP (Total: ${farmed}/${amount})`, 'success');

                    // Wait based on mode
                    await new Promise(r => setTimeout(r, mult === 1 ? 3000 : 1000));
                } else {
                    addLog(`Session completion failed: ${completeRes.status}`, 'error');
                }

            } catch (error) {
                addLog(`Error in XP farm: ${error.message}`, 'error');
                await new Promise(r => setTimeout(r, 3000));
            }
        }

        if (farmed >= amount) {
            addLog(`✅ XP farming completed: ${farmed} XP gained`, 'success');
            document.getElementById('progressText').textContent = '✅ XP farming completed!';
        }
    }

    // === GEMS FARMING FUNCTION ===
    async function farmGems_Simple(amount) {
        addLog(`Starting Gems farm: ${amount} gems`, 'info');

        const jwt = getJwtToken();
        if (!jwt) {
            addLog('ERROR: No authentication token', 'error');
            alert('❌ Please log in to Duolingo first!');
            return;
        }

        const userId = getUserId();
        if (!userId) {
            addLog('ERROR: No user ID', 'error');
            return;
        }

        const headers = {
            'Authorization': `Bearer ${jwt}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };

        let farmed = 0;

        while (farmed < amount && isFarming) {
            try {
                addLog(`Attempting to earn gem ${farmed + 1}/${amount}...`, 'info');

                // Get user language info
                const userInfo = await fetch(`https://www.duolingo.com/2017-06-30/users/${userId}?fields=fromLanguage,learningLanguage`, { headers });
                const userData = await userInfo.json();

                // Create a practice session
                const sessionData = {
                    challengeTypes: ['translate', 'assist'],
                    fromLanguage: userData.fromLanguage || 'en',
                    learningLanguage: userData.learningLanguage || 'es',
                    type: 'GLOBAL_PRACTICE',
                    difficulty: 'EASY'
                };

                const sessionRes = await fetch('https://www.duolingo.com/2017-06-30/sessions', {
                    method: 'POST',
                    headers,
                    body: JSON.stringify(sessionData)
                });

                if (!sessionRes.ok) {
                    throw new Error(`Session creation failed: ${sessionRes.status}`);
                }

                const session = await sessionRes.json();

                // Complete the session with gem reward
                const completeData = {
                    ...session,
                    heartsLeft: 5,
                    failed: false,
                    maxInLessonStreak: 10,
                    shouldLearnThings: true,
                    xpGain: 10,
                    gemGain: 2,
                    startTime: Math.floor(Date.now()/1000) - 60,
                    endTime: Math.floor(Date.now()/1000)
                };

                const completeRes = await fetch(`https://www.duolingo.com/2017-06-30/sessions/${session.id}`, {
                    method: 'PUT',
                    headers,
                    body: JSON.stringify(completeData)
                });

                if (completeRes.ok) {
                    farmed += 2;

                    // Update UI
                    const currentGems = parseInt(document.getElementById('st-gems').innerText) || 0;
                    document.getElementById('st-gems').innerText = currentGems + 2;
                    document.getElementById('progressBar').style.width = `${(farmed/amount)*100}%`;
                    document.getElementById('progressText').textContent = `💎 Farming ${farmed}/${amount} gems`;

                    // Also add XP for consistency
                    const currentXP = parseInt(document.getElementById('st-xp').innerText) || 0;
                    document.getElementById('st-xp').innerText = currentXP + 10;

                    addLog(`+2 Gems via lesson completion (Total: ${farmed}/${amount})`, 'success');

                    // Wait based on mode
                    await new Promise(r => setTimeout(r, mult === 1 ? 4000 : 2000));

                } else {
                    // Alternative method: Try to update via gem transaction
                    addLog(`Standard method failed, trying alternative...`, 'warning');

                    try {
                        // Get current gems first
                        const currentRes = await fetch(`https://www.duolingo.com/2017-06-30/users/${userId}?fields=gems`, { headers });
                        if (currentRes.ok) {
                            const currentData = await currentRes.json();
                            const currentGems = currentData.gems || 0;

                            // Try direct PATCH update
                            const updateRes = await fetch(`https://www.duolingo.com/2017-06-30/users/${userId}`, {
                                method: 'PATCH',
                                headers,
                                body: JSON.stringify({
                                    gems: currentGems + 2
                                })
                            });

                            if (updateRes.ok) {
                                farmed += 2;
                                document.getElementById('st-gems').innerText = currentGems + 2;
                                document.getElementById('progressBar').style.width = `${(farmed/amount)*100}%`;
                                document.getElementById('progressText').textContent = `💎 Farming ${farmed}/${amount} gems`;
                                addLog(`+2 Gems via direct update (Total: ${farmed}/${amount})`, 'success');
                            } else {
                                addLog(`Direct update failed: ${updateRes.status}`, 'error');
                            }
                        }
                    } catch (altError) {
                        addLog(`Alternative method error: ${altError.message}`, 'error');
                    }

                    await new Promise(r => setTimeout(r, 3000));
                }

            } catch (error) {
                addLog(`Error in gems farm: ${error.message}`, 'error');
                await new Promise(r => setTimeout(r, 3000));
            }
        }

        if (farmed >= amount) {
            addLog(`✅ Gems farming completed: ${farmed} gems gained`, 'success');
            document.getElementById('progressText').textContent = '✅ Gems farming completed!';

            // Verify final gems count
            try {
                const verifyRes = await fetch(`https://www.duolingo.com/2017-06-30/users/${userId}?fields=gems`, { headers });
                if (verifyRes.ok) {
                    const verifyData = await verifyRes.json();
                    const finalGems = verifyData.gems || 0;
                    addLog(`Final gems verification: ${finalGems} gems`, 'success');
                    alert(`✅ Gems farming completed! You now have ${finalGems} gems!`);
                }
            } catch (verifyError) {
                addLog('Could not verify final gems count', 'info');
                alert(`✅ Gems farming completed! Check your Duolingo profile.`);
            }
        }
    }

    // === FARMING CONTROL ===
    let isFarming = false;
    let seconds = 0;
    let mult = 1;

    // Target modules selection
    ['xp', 'gems', 'streak', 'league', 'quest', 'all'].forEach(k => {
        const el = document.getElementById('opt-' + k);
        el.onclick = () => {
            if (k === 'all') {
                // Toggle all except "all"
                ['xp', 'gems', 'streak', 'league', 'quest'].forEach(t => {
                    const item = document.getElementById('opt-' + t);
                    item.classList.toggle('active');
                });
            } else {
                el.classList.toggle('active');
            }

            if (['xp', 'gems', 'streak'].includes(k)) {
                // Update placeholder for input
                const targetInput = document.getElementById('targetValue');
                switch(k) {
                    case 'xp':
                        targetInput.placeholder = 'e.g., 1000 XP';
                        targetInput.value = '1000';
                        targetInput.max = '999999';
                        break;
                    case 'gems':
                        targetInput.placeholder = 'e.g., 500 Gems';
                        targetInput.value = '500';
                        targetInput.max = '9999';
                        break;
                    case 'streak':
                        targetInput.placeholder = 'e.g., 30 days';
                        targetInput.value = '30';
                        targetInput.max = '365';
                        break;
                }
            }
        };
    });

    // Mode selection
    document.getElementById('sp-safe').onclick = function() {
        mult = 1;
        this.classList.add('active');
        document.getElementById('sp-fast').classList.remove('active');
        document.getElementById('farm-mode-indicator').innerHTML = '🛡️ SAFE MODE | DELAY: 3s';
        addLog('Switched to Safe Mode', 'info');
    };

    document.getElementById('sp-fast').onclick = function() {
        mult = 3;
        this.classList.add('active');
        document.getElementById('sp-safe').classList.remove('active');
        document.getElementById('farm-mode-indicator').innerHTML = '⚡ FAST MODE | DELAY: 1s';
        addLog('Switched to Fast Mode', 'info');
    };

    // Main farming control
    const masterBtn = document.getElementById('btn-master-farm');
    masterBtn.onclick = async function() {
        if (isFarming) {
            // Stop farming
            isFarming = false;
            this.innerText = t('start');
            this.classList.remove('farming');
            document.getElementById('data-status').innerText = "IDLE";
            document.getElementById('data-status').style.color = "#ef4444";
            document.getElementById('progressText').textContent = '⏸️ Farming stopped';
            addLog('Farming stopped by user', 'info');
            return;
        }

        // Check if logged in
        const jwt = getJwtToken();
        if (!jwt) {
            alert('❌ Please log in to Duolingo first!\n\n1. Make sure you are on Duolingo website\n2. Log in with your account\n3. Refresh the page');
            addLog('ERROR: User not logged in', 'error');
            return;
        }

        const amount = parseInt(document.getElementById('targetValue').value || '0');
        if (!amount || amount <= 0) {
            alert('❌ Please enter a valid amount!');
            document.getElementById('targetValue').focus();
            return;
        }

        // Check what's selected
        const selectedModules = [];
        ['xp', 'gems', 'streak'].forEach(type => {
            if (document.getElementById('opt-' + type).classList.contains('active')) {
                selectedModules.push(type);
            }
        });

        if (selectedModules.length === 0) {
            alert('❌ Please select at least one farming module!');
            return;
        }

        const confirmMsg = `Start farming ${amount} ${selectedModules.join(', ').toUpperCase()} in ${mult === 1 ? 'SAFE' : 'FAST'} mode?\n\nMake sure you are logged into Duolingo.`;
        if (!confirm(confirmMsg)) return;

        // Start farming
        isFarming = true;
        seconds = 0;
        this.innerText = "STOP FARMING";
        this.classList.add('farming');
        document.getElementById('data-status').innerText = "RUNNING";
        document.getElementById('data-status').style.color = "#2dd4bf";
        document.getElementById('progressText').textContent = '⏳ Starting farm...';
        document.getElementById('progressBar').style.width = '0%';
        document.getElementById('data-streak-days').innerText = '0';

        addLog(`Starting farming session: ${selectedModules.join(', ')} x${amount}`, 'info');

        try {
            // Execute selected modules
            for (const module of selectedModules) {
                if (!isFarming) break;

                addLog(`Starting ${module.toUpperCase()} farming...`, 'info');

                switch(module) {
                    case 'xp':
                        await farmXP_Simple(amount);
                        break;
                    case 'gems':
                        await farmGems_Simple(amount);
                        break;
                    case 'streak':
                        await farmStreak(amount);
                        break;
                }

                // Reset for next module if continuing
                if (isFarming && selectedModules.indexOf(module) < selectedModules.length - 1) {
                    document.getElementById('progressText').textContent = `⏭️ Switching to next module...`;
                    document.getElementById('progressBar').style.width = '0%';
                    document.getElementById('data-streak-days').innerText = '0';
                    await new Promise(r => setTimeout(r, 1000));
                }
            }

        } catch(error) {
            console.error('Farming error:', error);
            addLog(`Farming error: ${error.message}`, 'error');
            document.getElementById('progressText').textContent = '❌ Farming error occurred';
        }

        if (isFarming) {
            isFarming = false;
            this.innerText = t('start');
            this.classList.remove('farming');
            document.getElementById('data-status').innerText = "IDLE";
            document.getElementById('data-status').style.color = "#ef4444";
            addLog('Farming session completed', 'success');
        }
    };

    // Timer for runtime display
    setInterval(() => {
        if (!isFarming) return;
        seconds++;
        const hrs = String(Math.floor(seconds / 3600)).padStart(2, '0');
        const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
        const secs = String(seconds % 60).padStart(2, '0');
        document.getElementById('data-time').innerText = `${hrs}:${mins}:${secs}`;
    }, 1000);

    // Enter key support
    document.getElementById('targetValue').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            document.getElementById('btn-master-farm').click();
        }
    });

    // === INITIALIZATION ===
    addLog('DuoMax LITE v1.0.5 initialized', 'info');
    addLog(`UI Size: Compact (580px)`, 'info');
    addLog(`Animations: ${settings.animations ? 'ON' : 'OFF'}`, 'info');

    // Auto-detect login and sync user data
    setTimeout(async () => {
        const jwt = getJwtToken();
        if (jwt) {
            addLog('Auto-detected: User is logged in', 'success');
            document.getElementById('user-status').textContent = '✅ Logged in • Syncing data...';

            // Sync user data
            await syncUser();

            // Update streak target display
            const currentStreak = parseInt(document.getElementById('st-streak').innerText) || 0;
            const targetInput = document.getElementById('targetValue');
            const targetValue = parseInt(targetInput.value) || 30;
            document.getElementById('target-streak-display').textContent = `Target: ${currentStreak + targetValue} days`;

        } else {
            addLog('User not logged in. Please log into Duolingo.', 'error');
            document.getElementById('user-status').textContent = '❌ Not logged in • Please log in';
        }
    }, 2000);

    // Update target display when value changes
    document.getElementById('targetValue').addEventListener('input', function() {
        const currentStreak = parseInt(document.getElementById('st-streak').innerText) || 0;
        const targetValue = parseInt(this.value) || 0;
        document.getElementById('target-streak-display').textContent = `Target: ${currentStreak + targetValue} days`;
    });
})();