// ==UserScript==
// @name         Universal Video Shortcuts
// @namespace    http://tampermonkey.net/
// @version      6.5
// @description  Control any HTML5 video with YouTube-style keyboard shortcuts - notifications centered on video
// @author       You
// @match        *://*/*
// @exclude    *://*.google.com/search?*
// @exclude    *://mail.google.com/*
// @exclude    *://docs.google.com/*
// @exclude    *://*.facebook.com/*
// @exclude    *://*.twitter.com/*
// @exclude    *://*.reddit.com/*
// @exclude    *://github.com/*
// @exclude    *://stackoverflow.com/*
// @exclude    *://*.linkedin.com/*
// @exclude    *://*.wikipedia.org/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/556440/Universal%20Video%20Shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/556440/Universal%20Video%20Shortcuts.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('🎬 Universal Video Shortcuts - Script started (ENHANCED v6.5)');

    // Modern CSS with glassmorphism design - UPDATED WITH NEW STYLES
    GM_addStyle(`
        .settings-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            z-index: 99999;
            backdrop-filter: blur(10px);
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .video-shortcuts-settings {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(15, 15, 20, 0.95);
            color: white;
            border-radius: 20px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            z-index: 100000;
            font-family: 'Segoe UI', system-ui, sans-serif;
            width: 90%;
            max-width: 800px;
            max-height: 85vh;
            box-shadow: 0 25px 50px rgba(0,0,0,0.5);
            backdrop-filter: blur(20px);
            overflow: hidden;
            display: flex;
            flex-direction: column;
        }

        .settings-header {
            padding: 25px 30px 10px 30px;
            border-bottom: 1px solid rgba(255,255,255,0.1);
        }

        .settings-header h3 {
            margin: 0 0 5px 0;
            color: #fff;
            font-size: 24px;
            font-weight: 600;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .settings-subtitle {
            margin: 0;
            color: #8ab4f8;
            font-size: 14px;
        }

        .settings-body {
            display: flex;
            flex: 1;
            overflow: hidden;
        }

        .settings-sidebar {
            width: 200px;
            background: rgba(255,255,255,0.05);
            border-right: 1px solid rgba(255,255,255,0.1);
            padding: 20px 0;
        }

        .nav-item {
            padding: 15px 20px;
            cursor: pointer;
            transition: all 0.3s ease;
            border-left: 3px solid transparent;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .nav-item:hover {
            background: rgba(255,255,255,0.1);
        }

        .nav-item.active {
            background: rgba(66, 133, 244, 0.2);
            border-left-color: #4285f4;
            color: #8ab4f8;
        }

        .settings-content {
            flex: 1;
            padding: 20px;
            overflow-y: auto;
        }

        .tab-content {
            display: none;
        }

        .tab-content.active {
            display: block;
        }

        .settings-group {
            margin-bottom: 25px;
            padding: 20px;
            background: rgba(255,255,255,0.05);
            border-radius: 12px;
            border: 1px solid rgba(255,255,255,0.1);
        }

        .group-header {
            margin-bottom: 20px;
        }

        .group-title {
            font-size: 16px;
            font-weight: 600;
            color: #fbbc05;
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 5px;
        }

        .group-subtitle {
            color: #8ab4f8;
            font-size: 13px;
        }

        .settings-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 15px;
            padding: 12px;
            border-radius: 8px;
            transition: all 0.3s ease;
            background: rgba(255,255,255,0.02);
        }

        .settings-row:hover {
            background: rgba(255,255,255,0.05);
        }

        .row-label {
            flex: 1;
        }

        .label-main {
            display: block;
            font-weight: 600;
            margin-bottom: 4px;
            color: white;
        }

        .label-desc {
            display: block;
            font-size: 12px;
            color: #8ab4f8;
        }

        .toggle-switch {
            width: 50px;
            height: 24px;
            background: rgba(255,255,255,0.2);
            border-radius: 12px;
            position: relative;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .toggle-switch.checked {
            background: #34a853;
        }

        .toggle-switch::after {
            content: '';
            position: absolute;
            width: 20px;
            height: 20px;
            background: white;
            border-radius: 50%;
            top: 2px;
            left: 2px;
            transition: all 0.3s ease;
        }

        .toggle-switch.checked::after {
            left: 28px;
        }

        .settings-select, .settings-input {
            width: 200px;
            padding: 10px;
            border: 1px solid rgba(66, 133, 244, 0.3);
            border-radius: 8px;
            background: rgba(255,255,255,0.08);
            color: white;
            font-size: 14px;
        }

        .settings-range {
            width: 200px;
            margin: 0 10px;
            background: rgba(255,255,255,0.1);
            border-radius: 10px;
            height: 6px;
            accent-color: #4285f4;
        }

        .range-value {
            color: #fbbc05;
            font-weight: bold;
            min-width: 60px;
            font-size: 14px;
        }

        .shortcut-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-top: 15px;
        }

        .shortcut-card {
            background: rgba(255,255,255,0.03);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 12px;
            padding: 20px;
            transition: all 0.3s ease;
        }

        .shortcut-card:hover {
            background: rgba(255,255,255,0.05);
            transform: translateY(-2px);
        }

        .shortcut-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
        }

        .shortcut-icon {
            font-size: 20px;
        }

        .shortcut-keys {
            display: flex;
            flex-wrap: wrap;
            gap: 5px;
            margin-bottom: 10px;
        }

        .key {
            background: linear-gradient(135deg, #4285f4, #34a853);
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
            font-size: 11px;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .key:hover {
            transform: scale(1.05);
        }

        .theme-chooser {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-top: 15px;
        }

        .theme-option {
            padding: 20px;
            border: 2px solid rgba(255,255,255,0.1);
            border-radius: 12px;
            cursor: pointer;
            transition: all 0.3s ease;
            text-align: center;
            background: rgba(255,255,255,0.05);
        }

        .theme-option:hover {
            border-color: #4285f4;
            transform: translateY(-2px);
        }

        .theme-option.selected {
            border-color: #fbbc05;
            background: rgba(251, 188, 5, 0.1);
        }

        .theme-preview {
            font-size: 24px;
            margin-bottom: 10px;
        }

        .theme-name {
            font-weight: 600;
            margin-bottom: 5px;
        }

        .theme-desc {
            font-size: 12px;
            color: #8ab4f8;
        }

        .settings-footer {
            padding: 20px 30px;
            border-top: 1px solid rgba(255,255,255,0.1);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .version-info {
            color: #8ab4f8;
            font-size: 12px;
        }

        .footer-buttons {
            display: flex;
            gap: 10px;
        }

        .settings-button {
            padding: 10px 20px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .button-save {
            background: linear-gradient(135deg, #34a853, #2e8b47);
            color: white;
        }

        .button-save:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(52, 168, 83, 0.4);
        }

        .button-cancel {
            background: rgba(234, 67, 53, 0.9);
            color: white;
        }

        .button-cancel:hover {
            background: #d33426;
            transform: translateY(-2px);
        }

        .button-reset {
            background: linear-gradient(135deg, #fbbc05, #e6a800);
            color: black;
        }

        .button-reset:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(251, 188, 5, 0.4);
        }

        /* Keep existing notification styles */
        .universal-video-notification {
            position: fixed;
            z-index: 10000;
            pointer-events: none;
            opacity: 1;
            transition: opacity 0.4s ease;
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }

        .key-listening-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            z-index: 100001;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            color: white;
            font-size: 18px;
            backdrop-filter: blur(10px);
        }

        .key-listening-message {
            background: rgba(15, 15, 20, 0.95);
            padding: 30px;
            border-radius: 15px;
            text-align: center;
            border: 2px solid #fbbc05;
            max-width: 400px;
        }

        .key-listening-message h4 {
            margin: 0 0 15px 0;
            color: #fbbc05;
        }

        .key-preview {
            font-size: 24px;
            font-weight: bold;
            margin: 15px 0;
            padding: 10px;
            background: rgba(255,255,255,0.1);
            border-radius: 8px;
            font-family: 'Courier New', monospace;
        }

        /* Add any missing styles from original */
        .settings-checkbox {
            margin-right: 12px;
            transform: scale(1.2);
            accent-color: #4285f4;
        }

        .shortcut-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px;
            margin: 6px 0;
            background: rgba(255,255,255,0.05);
            border-radius: 8px;
            transition: all 0.3s ease;
        }

        .shortcut-item:hover {
            background: rgba(255,255,255,0.08);
        }

        .shortcut-key {
            background: linear-gradient(135deg, #4285f4, #34a853);
            color: white;
            padding: 6px 12px;
            border-radius: 6px;
            font-family: 'Courier New', monospace;
            font-weight: bold;
            min-width: 60px;
            text-align: center;
            font-size: 12px;
        }

        .shortcut-description {
            flex-grow: 1;
            margin-left: 15px;
            font-size: 14px;
        }

        .shortcut-toggle {
            margin-left: 10px;
        }
    `);

    // Default settings
    const defaultSettings = {
        // Original settings
        theme: 'dark',
        backgroundShape: 'rounded',
        showLabels: true,
        backgroundOpacity: 0.9,
        notificationDuration: 1200,
        enableSounds: false,
        iconSize: 42,
        showNotification: true,
        notificationPosition: 'auto',
        notificationSize: 'medium',
        textBorder: 'none',
        iconBorder: 'none',
        enableSpaceHold: true,
        holdSpeed: 2.0,

        // New shortcut management
        shortcutsEnabled: true,
        enablePlayPause: true,
        enableSkip: true,
        enableVolume: true,
        enableMute: true,
        enableFullscreen: true,
        enableSpeed: true,
        enableJump: true,

        // Custom key bindings
        keyPlayPause: 'k',
        keyPlayPauseAlt: ' ',
        keyRewind10: 'j',
        keyRewind5: 'arrowleft',
        keyForward10: 'l',
        keyForward5: 'arrowright',
        keyVolumeUp: 'arrowup',
        keyVolumeDown: 'arrowdown',
        keyMute: 'm',
        keyFullscreen: 'f',
        keySpeedDown: 'a',
        keySpeedNormal: 's',
        keySpeedUp: 'd',
        keyHoldSpeed: ' '
    };

    // Load settings from storage
    let settings = {};
    Object.keys(defaultSettings).forEach(key => {
        settings[key] = GM_getValue(key, defaultSettings[key]);
    });

    // Variables for space hold functionality
    let spaceHoldTimeout = null;
    let originalSpeed = 1.0;
    let isSpaceHeld = false;

    // Variables for key listening
    let currentListeningInput = null;
    let keyListener = null;

    // Register menu command - UPDATED TO USE NEW SETTINGS WINDOW
    GM_registerMenuCommand('🎬 Video Shortcuts Settings', showModernSettings);

    // SVG Icons Library (Original preserved)
    const svgIcons = {
    // ===== Red Icons =====
    play: `<svg width="18px" height="18px" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
        <path fill="red" d="M15.5615866,8.10002147 L3.87056367,0.225209313 C3.05219207,-0.33727727 2,0.225209313 2,1.12518784 L2,16.8748122 C2,17.7747907 3.05219207,18.3372773 3.87056367,17.7747907 L15.5615866,9.89997853 C16.1461378,9.44998927 16.1461378,8.55001073 15.5615866,8.10002147 Z"/>
    </svg>`,

    pause: `<svg width="18px" height="18px" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
        <g fill="red">
            <path d="M6,1 L3,1 C2.4,1 2,1.4 2,2 L2,16 C2,16.6 2.4,17 3,17 L6,17 C6.6,17 7,16.6 7,16 L7,2 C7,1.4 6.6,1 6,1 Z"/>
            <path d="M12,1 C11.4,1 11,1.4 11,2 L11,16 C11,16.6 11.4,17 12,17 L15,17 C15.6,17 16,16.6 16,16 L16,2 C16,1.4 15.6,1 15,1 Z"/>
        </g>
    </svg>`,

    mute: `<svg width="18px" height="18px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path fill="red" d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
    </svg>`,

    fullscreen: `<svg width="18px" height="18px" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
        <g fill="red">
            <polygon points="10 3 13.6 3 9.6 7 11 8.4 15 4.4 15 8 17 8 17 1 10 1"/>
            <polygon points="7 9.6 3 13.6 3 10 1 10 1 17 8 17 8 15 4.4 15 8.4 11"/>
        </g>
    </svg>`,

    captions: `<svg width="18px" height="18px" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
        <g fill="red" fill-rule="evenodd">
            <path d="M1,1 C0.4,1 0,1.4 0,2 L0,13 C0,13.6 0.4,14 1,14 L5.6,14 L8.3,16.7 C8.5,16.9 8.7,17 9,17 C9.3,17 9.5,16.9 9.7,16.7 L12.4,14 L17,14 C17.6,14 18,13.6 18,13 L18,2 C18,1.4 17.6,1 17,1 Z M5.52,11.15 C7.51,11.15 8.53,9.83 8.8,8.74 L7.51,8.35 C7.32,9.01 6.73,9.8 5.52,9.8 C4.38,9.8 3.32,8.97 3.32,7.46 C3.32,5.85 4.44,5.09 5.5,5.09 C6.73,5.09 7.28,5.84 7.45,6.52 L8.75,6.11 C8.47,4.96 7.46,3.76 5.5,3.76 C3.6,3.76 1.89,5.2 1.89,7.46 C1.89,9.72 3.54,11.15 5.52,11.15 Z M13.09,11.15 C15.08,11.15 16.1,9.83 16.37,8.74 L15.08,8.35 C14.89,9.01 14.3,9.8 13.09,9.8 C11.95,9.8 10.89,8.97 10.89,7.46 C10.89,5.85 12.01,5.09 13.07,5.09 C14.3,5.09 14.85,5.84 15.02,6.52 L16.32,6.11 C16.04,4.96 15.03,3.76 13.07,3.76 C11.17,3.76 9.46,5.2 9.46,7.46 C9.46,9.72 11.11,11.15 13.09,11.15 Z"/>
        </g>
    </svg>`,

    forward: `<svg width="18px" height="18px" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
        <polygon fill="red" points="7.875 7.17142857 0 1 0 17 7.875 10.8285714 7.875 17 18 9 7.875 1"/>
    </svg>`,

    rewind: `<svg width="18px" height="18px" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
        <polygon fill="red" points="10.125 1 0 9 10.125 17 10.125 10.8285714 18 17 18 1 10.125 7.17142857"/>
    </svg>`,

    volume: `<svg width="18px" height="18px" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
        <path fill="red" d="M11,3 L11,15 C10.7,14.7 10.3,14.5 9.9,14.3 L6.5,12 L3,12 L3,6 L6.5,6 L9.9,3.7 C10.3,3.5 10.7,3.3 11,3 Z M13.5,6.4 C14.3,7.2 14.8,8.3 14.8,9.5 C14.8,10.7 14.3,11.8 13.5,12.6 L12.4,11.5 C12.9,10.9 13.2,10.2 13.2,9.5 C13.2,8.8 12.9,8.1 12.4,7.5 L13.5,6.4 Z M15.7,4.2 C17,5.5 17.7,7.4 17.7,9.5 C17.7,11.6 17,13.5 15.7,14.8 L14.6,13.7 C15.6,12.7 16.2,11.2 16.2,9.5 C16.2,7.8 15.6,6.3 14.6,5.3 L15.7,4.2 Z"/>
    </svg>`,

    speed: `<svg width="18px" height="18px" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 1C4.6 1 1 4.6 1 9s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 14c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6z" fill="red"/>
        <path d="M9 5v4l3 2" fill="transparent" stroke="red" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,

    normal_speed: `<svg width="18px" height="18px" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
        <circle cx="9" cy="9" r="7.5" fill="transparent" stroke="red" stroke-width="1.5"/>
        <text x="9" y="11" font-size="6" font-family="Arial, Helvetica, sans-serif" font-weight="bold" text-anchor="middle" fill="red">1x</text>
    </svg>`,

    skip_forward: `<svg width="18px" height="18px" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
        <g fill="red">
            <polygon points="6 3 6 15 12 9"/>
            <polygon points="12 3 12 15 18 9"/>
        </g>
    </svg>`,

    skip_backward: `<svg width="18px" height="18px" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
        <g fill="red">
            <polygon points="12 3 12 15 6 9"/>
            <polygon points="6 3 6 15 0 9"/>
        </g>
    </svg>`,

    jump: `<svg width="18px" height="18px" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
        <g fill="red">
            <polygon points="6 5 10 9 6 13"/>
            <polygon points="12 5 16 9 12 13"/>
        </g>
    </svg>`,

    // ===== Mono Icons =====
    play_mono: `<svg width="18px" height="18px" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
        <path fill="white" d="M15.5615866,8.10002147 L3.87056367,0.225209313 C3.05219207,-0.33727727 2,0.225209313 2,1.12518784 L2,16.8748122 C2,17.7747907 3.05219207,18.3372773 3.87056367,17.7747907 L15.5615866,9.89997853 C16.1461378,9.44998927 16.1461378,8.55001073 15.5615866,8.10002147 Z"/>
    </svg>`,

    pause_mono: `<svg width="18px" height="18px" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
        <g fill="white">
            <path d="M6,1 L3,1 C2.4,1 2,1.4 2,2 L2,16 C2,16.6 2.4,17 3,17 L6,17 C6.6,17 7,16.6 7,16 L7,2 C7,1.4 6.6,1 6,1 Z"/>
            <path d="M12,1 C11.4,1 11,1.4 11,2 L11,16 C11,16.6 11.4,17 12,17 L15,17 C15.6,17 16,16.6 16,16 L16,2 C16,1.4 15.6,1 15,1 Z"/>
        </g>
    </svg>`,

    mute_mono: `<svg width="18px" height="18px" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
        <path fill="white" d="M11,3 L11,15 C10.7,14.7 10.3,14.5 9.9,14.3 L6.5,12 L3,12 L3,6 L6.5,6 L9.9,3.7 C10.3,3.5 10.7,3.3 11,3 Z M13.5,6.4 C14.3,7.2 14.8,8.3 14.8,9.5 C14.8,10.7 14.3,11.8 13.5,12.6 L12.4,11.5 C12.9,10.9 13.2,10.2 13.2,9.5 C13.2,8.8 12.9,8.1 12.4,7.5 L13.5,6.4 Z M15.7,4.2 C17,5.5 17.7,7.4 17.7,9.5 C17.7,11.6 17,13.5 15.7,14.8 L14.6,13.7 C15.6,12.7 16.2,11.2 16.2,9.5 C16.2,7.8 15.6,6.3 14.6,5.3 L15.7,4.2 Z"/>
    </svg>`,

    fullscreen_mono: `<svg width="18px" height="18px" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
        <g fill="white">
            <polygon points="10 3 13.6 3 9.6 7 11 8.4 15 4.4 15 8 17 8 17 1 10 1"/>
            <polygon points="7 9.6 3 13.6 3 10 1 10 1 17 8 17 8 15 4.4 15 8.4 11"/>
        </g>
    </svg>`,

    captions_mono: `<svg width="18px" height="18px" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
        <g fill="white" fill-rule="evenodd">
            <path d="M1,1 C0.4,1 0,1.4 0,2 L0,13 C0,13.6 0.4,14 1,14 L5.6,14 L8.3,16.7 C8.5,16.9 8.7,17 9,17 C9.3,17 9.5,16.9 9.7,16.7 L12.4,14 L17,14 C17.6,14 18,13.6 18,13 L18,2 C18,1.4 17.6,1 17,1 Z M5.52,11.15 C7.51,11.15 8.53,9.83 8.8,8.74 L7.51,8.35 C7.32,9.01 6.73,9.8 5.52,9.8 C4.38,9.8 3.32,8.97 3.32,7.46 C3.32,5.85 4.44,5.09 5.5,5.09 C6.73,5.09 7.28,5.84 7.45,6.52 L8.75,6.11 C8.47,4.96 7.46,3.76 5.5,3.76 C3.6,3.76 1.89,5.2 1.89,7.46 C1.89,9.72 3.54,11.15 5.52,11.15 Z M13.09,11.15 C15.08,11.15 16.1,9.83 16.37,8.74 L15.08,8.35 C14.89,9.01 14.3,9.8 13.09,9.8 C11.95,9.8 10.89,8.97 10.89,7.46 C10.89,5.85 12.01,5.09 13.07,5.09 C14.3,5.09 14.85,5.84 15.02,6.52 L16.32,6.11 C16.04,4.96 15.03,3.76 13.07,3.76 C11.17,3.76 9.46,5.2 9.46,7.46 C9.46,9.72 11.11,11.15 13.09,11.15 Z"/>
        </g>
    </svg>`,

    forward_mono: `<svg width="18px" height="18px" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
        <polygon fill="white" points="7.875 7.17142857 0 1 0 17 7.875 10.8285714 7.875 17 18 9 7.875 1"/>
    </svg>`,

    rewind_mono: `<svg width="18px" height="18px" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
        <polygon fill="white" points="10.125 1 0 9 10.125 17 10.125 10.8285714 18 17 18 1 10.125 7.17142857"/>
    </svg>`,

    volume_mono: `<svg width="18px" height="18px" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
        <path fill="white" d="M11,3 L11,15 C10.7,14.7 10.3,14.5 9.9,14.3 L6.5,12 L3,12 L3,6 L6.5,6 L9.9,3.7 C10.3,3.5 10.7,3.3 11,3 Z M13.5,6.4 C14.3,7.2 14.8,8.3 14.8,9.5 C14.8,10.7 14.3,11.8 13.5,12.6 L12.4,11.5 C12.9,10.9 13.2,10.2 13.2,9.5 C13.2,8.8 12.9,8.1 12.4,7.5 L13.5,6.4 Z M15.7,4.2 C17,5.5 17.7,7.4 17.7,9.5 C17.7,11.6 17,13.5 15.7,14.8 L14.6,13.7 C15.6,12.7 16.2,11.2 16.2,9.5 C16.2,7.8 15.6,6.3 14.6,5.3 L15.7,4.2 Z"/>
    </svg>`,

    speed_mono: `<svg width="18px" height="18px" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 1C4.6 1 1 4.6 1 9s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 14c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6z" fill="white"/>
        <path d="M9 5v4l3 2" fill="transparent" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,

    normal_speed_mono: `<svg width="18px" height="18px" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
        <circle cx="9" cy="9" r="7.5" fill="transparent" stroke="white" stroke-width="1.5"/>
        <text x="9" y="11" font-size="6" font-family="Arial, Helvetica, sans-serif" font-weight="bold" text-anchor="middle" fill="white">1x</text>
    </svg>`,

    skip_forward_mono: `<svg width="18px" height="18px" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
        <g fill="white">
            <polygon points="6 3 6 15 12 9"/>
            <polygon points="12 3 12 15 18 9"/>
        </g>
    </svg>`,

    skip_backward_mono: `<svg width="18px" height="18px" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
        <g fill="white">
            <polygon points="12 3 12 15 6 9"/>
            <polygon points="6 3 6 15 0 9"/>
        </g>
    </svg>`,

    jump_mono: `<svg width="18px" height="18px" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
        <g fill="white">
            <polygon points="6 5 10 9 6 13"/>
            <polygon points="12 5 16 9 12 13"/>
        </g>
    </svg>`
};

    // Space hold functionality (Original preserved)
    function startSpaceHold() {
        if (!settings.enableSpaceHold || isSpaceHeld || !settings.shortcutsEnabled) return;

        const video = getVideo();
        if (!video) return;

        console.log('⏱️ Space hold started');
        isSpaceHeld = true;

        // Store original speed
        originalSpeed = video.playbackRate;

        // Set to hold speed
        video.playbackRate = settings.holdSpeed;

        if (settings.showNotification) {
            showNotification(`Speed: ${settings.holdSpeed.toFixed(1)}x (Hold)`, getIcon('speed'));
        }
    }

    function endSpaceHold() {
        if (!settings.enableSpaceHold || !isSpaceHeld) return;

        const video = getVideo();
        if (!video) return;

        console.log('⏱️ Space hold ended');
        isSpaceHeld = false;

        // Restore original speed
        video.playbackRate = originalSpeed;

        if (settings.showNotification) {
            showNotification(`Speed: ${originalSpeed.toFixed(1)}x`, getIcon('normal_speed'));
        }

        // Clear any existing timeout
        if (spaceHoldTimeout) {
            clearTimeout(spaceHoldTimeout);
            spaceHoldTimeout = null;
        }
    }

    // Get border styles (Original preserved)
    function getBorderStyles(type, element = 'text') {
        const isText = element === 'text';
        const borderSetting = isText ? settings.textBorder : settings.iconBorder;

        switch (borderSetting) {
            case 'shadow':
                return isText ?
                    'text-shadow: 0 2px 4px rgba(0,0,0,0.8), 0 0 8px rgba(0,0,0,0.6);' :
                    'filter: drop-shadow(0 2px 4px rgba(0,0,0,0.8)) drop-shadow(0 0 8px rgba(0,0,0,0.6));';

            case 'solid':
                const borderColor = type === 'dark' ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)';
                return isText ?
                    `background: rgba(0,0,0,0.7); padding: 4px 12px; border-radius: 6px; border: 2px solid ${borderColor};` :
                    `background: rgba(0,0,0,0.7); padding: 6px; border-radius: 8px; border: 2px solid ${borderColor};`;

            case 'glow':
                const glowColor = type === 'dark' ? 'rgba(255,255,255,0.8)' : 'rgba(66,133,244,0.8)';
                return isText ?
                    `text-shadow: 0 0 10px ${glowColor}, 0 0 20px ${glowColor}, 0 0 30px ${glowColor};` :
                    `filter: drop-shadow(0 0 10px ${glowColor}) drop-shadow(0 0 20px ${glowColor});`;

            case 'none':
            default:
                return isText ?
                    'text-shadow: 0 2px 4px rgba(0,0,0,0.5);' :
                    '';
        }
    }

    // Key listening functionality
    function startKeyListening(keyElement, settingKey) {
        if (currentListeningInput) {
            stopKeyListening();
        }

        currentListeningInput = keyElement;
        const overlay = document.createElement('div');
        overlay.className = 'key-listening-overlay';
        
        // Use DOMParser for overlay content
        const overlayHTML = `
            <div class="key-listening-message">
                <h4>Press any key</h4>
                <p>Press the key you want to use for this shortcut</p>
                <div class="key-preview">...</div>
                <p><small>Press ESC to cancel</small></p>
            </div>
        `;
        const parser = new DOMParser();
        const doc = parser.parseFromString(overlayHTML, 'text/html');
        while (doc.body.firstChild) {
            overlay.appendChild(doc.body.firstChild);
        }

        const keyPreview = overlay.querySelector('.key-preview');

        keyListener = function(e) {
            e.preventDefault();
            e.stopPropagation();

            // Don't capture ESC key for cancellation
            if (e.key === 'Escape') {
                stopKeyListening();
                return;
            }

            // Don't capture modifier keys alone
            if (['Control', 'Shift', 'Alt', 'Meta', 'OS'].includes(e.key)) {
                return;
            }

            let keyValue = e.key.toLowerCase();

            // Handle special keys
            if (e.key === ' ') {
                keyValue = ' ';
            } else if (e.key.startsWith('Arrow')) {
                keyValue = e.key.toLowerCase();
            }

            keyPreview.textContent = keyValue === ' ' ? 'Space' : keyValue;

            // Wait a moment to show the key, then apply it
            setTimeout(() => {
                keyElement.textContent = keyValue === ' ' ? 'Space' : keyValue;
                stopKeyListening();

                // Update the setting immediately for preview
                settings[settingKey] = keyValue;
                GM_setValue(settingKey, keyValue);
            }, 500);
        };

        document.addEventListener('keydown', keyListener, true);
        document.body.appendChild(overlay);
    }

    function stopKeyListening() {
        if (keyListener) {
            document.removeEventListener('keydown', keyListener, true);
            keyListener = null;
        }
        currentListeningInput = null;
        const overlay = document.querySelector('.key-listening-overlay');
        if (overlay) {
            overlay.remove();
        }
    }

    // Enhanced settings window with modern design - FIXED FUNCTION
    function showModernSettings() {
        try {
            // Create overlay
            const overlay = document.createElement('div');
            overlay.className = 'settings-overlay';

            // Create modern settings window - FIXED STRUCTURE
            const settingsWindow = document.createElement('div');
            settingsWindow.className = 'video-shortcuts-settings';
            
            // -----------------
            // --- FIX START ---
            // -----------------
            // Use DOMParser to safely parse HTML and avoid TrustedHTML errors
            const settingsHTML = `
                <div class="settings-header">
                    <h3>🎬 Video Shortcuts</h3>
                    <p class="settings-subtitle">Customize your video playback experience</p>
                </div>

                <div class="settings-body">
                    <div class="settings-sidebar">
                        <div class="nav-item active" data-tab="general">
                            <i>⚙️</i> General
                        </div>
                        <div class="nav-item" data-tab="shortcuts">
                            <i>⌨️</i> Shortcuts
                        </div>
                        <div class="nav-item" data-tab="appearance">
                            <i>🎨</i> Appearance
                        </div>
                        <div class="nav-item" data-tab="advanced">
                            <i>🔧</i> Advanced
                       </div>
                    </div>

                    <div class="settings-content">
                        <!-- General Tab -->
                        <div class="tab-content active" id="general-tab">
                            <div class="settings-group">
                                <div class="group-header">
                                    <div class="group-title"><i>🔧</i> Core Settings</div>
                                    <div class="group-subtitle">Enable or disable the main functionality</div>
                                </div>
                                <div class="group-content">
                                    <div class="settings-row">
                                        <div class="row-label">
                                            <span class="label-main">Enable All Shortcuts</span>
                                            <span class="label-desc">Master switch for all keyboard shortcuts</span>
                                        </div>
                                        <div class="toggle-switch ${settings.shortcutsEnabled ? 'checked' : ''}" id="shortcutsEnabled"></div>
                                    </div>
                                    <div class="settings-row">
                                        <div class="row-label">
                                            <span class="label-main">Show Notifications</span>
                                            <span class="label-desc">Display visual feedback for actions</span>
                                        </div>
                                        <div class="toggle-switch ${settings.showNotification ? 'checked' : ''}" id="showNotification"></div>
                                    </div>
                                </div>
                            </div>

                            <div class="settings-group">
                                <div class="group-header">
                                    <div class="group-title"><i>⏩</i> Speed Control</div>
                                    <div class="group-subtitle">Configure fast-forward and speed settings</div>
                                </div>
                                <div class="group-content">
                                    <div class="settings-row">
                                        <div class="row-label">
                                            <span class="label-main">Hold Speed Feature</span>
                                            <span class="label-desc">Hold spacebar for temporary speed boost</span>
                                        </div>
                                        <div class="toggle-switch ${settings.enableSpaceHold ? 'checked' : ''}" id="enableSpaceHold"></div>
                                    </div>
                                    <div class="settings-row">
                                        <div class="row-label">
                                            <span class="label-main">Hold Speed Multiplier</span>
                                            <span class="label-desc">Playback speed when hold key is pressed</span>
                                        </div>
                                        <select class="settings-select" id="holdSpeedSelect">
                                            <option value="1.5" ${settings.holdSpeed === 1.5 ? 'selected' : ''}>1.5x Speed</option>
                                            <option value="2.0" ${settings.holdSpeed === 2.0 ? 'selected' : ''}>2.0x Speed</option>
                                            <option value="2.5" ${settings.holdSpeed === 2.5 ? 'selected' : ''}>2.5x Speed</option>
                                            <option value="3.0" ${settings.holdSpeed === 3.0 ? 'selected' : ''}>3.0x Speed</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div class="settings-group">
                                <div class="group-header">
                                    <div class="group-title"><i>⏱️</i> Notification Timing</div>
                                    <div class="group-subtitle">Configure how long notifications appear</div>
                                </div>
                                <div class="group-content">
                                    <div class="settings-row">
                                        <div class="row-label">
                                            <span class="label-main">Notification Duration</span>
                                            <span class="label-desc">How long notifications stay visible</span>
                                        </div>
                                        <input type="range" class="settings-range" id="durationRange" min="500" max="3000" step="100" value="${settings.notificationDuration}">
                                        <span class="range-value">${settings.notificationDuration}ms</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Shortcuts Tab -->
                        <div class="tab-content" id="shortcuts-tab">
                            <div class="settings-group">
                                <div class="group-header">
                                    <div class="group-title"><i>⌨️</i> Keyboard Shortcuts</div>
                                    <div class="group-subtitle">Customize your keyboard controls</div>
                                </div>
                                <div class="group-content">
                                    <div class="shortcut-grid">
                                        <div class="shortcut-card">
                                            <div class="shortcut-header">
                                                <div class="shortcut-icon">⏯️</div>
                                                <div class="toggle-switch ${settings.enablePlayPause ? 'checked' : ''}" id="enablePlayPause"></div>
                                            </div>
                                            <div class="shortcut-keys">
                                                <span class="key" data-input="keyPlayPause">${settings.keyPlayPause}</span>
                                                <span class="key" data-input="keyPlayPauseAlt">${settings.keyPlayPauseAlt === ' ' ? 'Space' : settings.keyPlayPauseAlt}</span>
                                            </div>
                                            <div class="label-main">Play/Pause</div>
                                            <div class="label-desc">Toggle video playback</div>
                                        </div>

                                        <div class="shortcut-card">
                                            <div class="shortcut-header">
                                                <div class="shortcut-icon">⏪⏩</div>
                                                <div class="toggle-switch ${settings.enableSkip ? 'checked' : ''}" id="enableSkip"></div>
                                            </div>
                                            <div class="shortcut-keys">
                                                <span class="key" data-input="keyRewind10">${settings.keyRewind10}</span>
                                                <span class="key" data-input="keyForward10">${settings.keyForward10}</span>
                                                <span class="key" data-input="keyRewind5">${settings.keyRewind5}</span>
                                                <span class="key" data-input="keyForward5">${settings.keyForward5}</span>
                                            </div>
                                            <div class="label-main">Skip Controls</div>
                                            <div class="label-desc">Rewind and forward</div>
                                        </div>

                                        <div class="shortcut-card">
                                            <div class="shortcut-header">
                                                <div class="shortcut-icon">🔊</div>
                                                <div class="toggle-switch ${settings.enableVolume ? 'checked' : ''}" id="enableVolume"></div>
                                            </div>
                                            <div class="shortcut-keys">
                                                <span class="key" data-input="keyVolumeUp">${settings.keyVolumeUp}</span>
                                                <span class="key" data-input="keyVolumeDown">${settings.keyVolumeDown}</span>
                                            </div>
                                            <div class="label-main">Volume Control</div>
                                            <div class="label-desc">Adjust volume level</div>
                                        </div>

                                        <div class="shortcut-card">
                                            <div class="shortcut-header">
                                                <div class="shortcut-icon">🔇</div>
                                                <div class="toggle-switch ${settings.enableMute ? 'checked' : ''}" id="enableMute"></div>
                                            </div>
                                            <div class="shortcut-keys">
                                                <span class="key" data-input="keyMute">${settings.keyMute}</span>
                                            </div>
                                            <div class="label-main">Mute Toggle</div>
                                            <div class="label-desc">Toggle sound on/off</div>
                                        </div>

                                        <div class="shortcut-card">
                                            <div class="shortcut-header">
                                                <div class="shortcut-icon">⚡</div>
                                                <div class="toggle-switch ${settings.enableSpeed ? 'checked' : ''}" id="enableSpeed"></div>
                                            </div>
                                            <div class="shortcut-keys">
                                                <span class="key" data-input="keySpeedDown">${settings.keySpeedDown}</span>
                                                <span class="key" data-input="keySpeedNormal">${settings.keySpeedNormal}</span>
                                                <span class="key" data-input="keySpeedUp">${settings.keySpeedUp}</span>
                                            </div>
                                            <div class="label-main">Speed Control</div>
                                            <div class="label-desc">Adjust playback speed</div>
                                        </div>

                                        <div class="shortcut-card">
                                            <div class="shortcut-header">
                                                <div class="shortcut-icon">🖥️</div>
                                                <div class="toggle-switch ${settings.enableFullscreen ? 'checked' : ''}" id="enableFullscreen"></div>
                                            </div>
                                            <div class="shortcut-keys">
                                                <span class="key" data-input="keyFullscreen">${settings.keyFullscreen}</span>
                                            </div>
                                            <div class="label-main">Fullscreen</div>
                                            <div class="label-desc">Toggle fullscreen mode</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Appearance Tab -->
                        <div class="tab-content" id="appearance-tab">
                            <div class="settings-group">
                                <div class="group-header">
                                    <div class="group-title"><i>🎨</i> Theme & Style</div>
                                    <div class="group-subtitle">Customize the visual appearance</div>
                                </div>
                                <div class="group-content">
                                    <div class="settings-row">
                                        <div class="row-label">
                                            <span class="label-main">Interface Theme</span>
                                            <span class="label-desc">Choose your preferred color scheme</span>
                                        </div>
                                    </div>
                                    <div class="theme-chooser">
                                        <div class="theme-option theme-dark ${settings.theme === 'dark' ? 'selected' : ''}" data-theme="dark">
                                            <div class="theme-preview">🌙</div>
                                            <div class="theme-name">Dark Theme</div>
                                            <div class="theme-desc">Colored icons on dark</div>
                                        </div>
                                        <div class="theme-option theme-light ${settings.theme === 'light' ? 'selected' : ''}" data-theme="light">
                                            <div class="theme-preview">☀️</div>
                                            <div class="theme-name">Light Theme</div>
                                            <div class="theme-desc">White icons on light</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="settings-group">
                                <div class="group-header">
                                    <div class="group-title"><i>🔘</i> Notification Style</div>
                                    <div class="group-subtitle">Customize how notifications appear</div>
                                </div>
                                <div class="group-content">
                                    <div class="settings-row">
                                        <div class="row-label">
                                            <span class="label-main">Show Text Labels</span>
                                            <span class="label-desc">Display text with icons</span>
                                        </div>
                                        <div class="toggle-switch ${settings.showLabels ? 'checked' : ''}" id="showLabels"></div>
                                    </div>
                                    <div class="settings-row">
                                        <div class="row-label">
                                            <span class="label-main">Background Shape</span>
                                            <span class="label-desc">Shape of notification background</span>
                                        </div>
                                        <select class="settings-select" id="shapeSelect">
                                            <option value="rounded" ${settings.backgroundShape === 'rounded' ? 'selected' : ''}>Rounded</option>
                                            <option value="circle" ${settings.backgroundShape === 'circle' ? 'selected' : ''}>Circle</option>
                                            <option value="square" ${settings.backgroundShape === 'square' ? 'selected' : ''}>Square</option>
                                        </select>
                                    </div>
                                    <div class="settings-row">
                                        <div class="row-label">
                                            <span class="label-main">Background Opacity</span>
                                            <span class="label-desc">${Math.round(settings.backgroundOpacity * 100)}% - ${settings.backgroundOpacity == 0 ? 'Transparent' : settings.backgroundOpacity < 0.5 ? 'Light' : 'Dark'}</span>
                                        </div>
                                        <input type="range" class="settings-range" id="opacityRange" min="0" max="1" step="0.1" value="${settings.backgroundOpacity}">
                                        <span class="range-value">${Math.round(settings.backgroundOpacity * 100)}%</span>
                                    </div>
                                    <div class="settings-row">
                                        <div class="row-label">
                                            <span class="label-main">Icon Size</span>
                                            <span class="label-desc">Size of notification icons</span>
                                        </div>
                                        <select class="settings-select" id="iconSizeSelect">
                                            <option value="32" ${settings.iconSize === 32 ? 'selected' : ''}>Small (32px)</option>
                                            <option value="42" ${settings.iconSize === 42 ? 'selected' : ''}>Medium (42px)</option>
                                            <option value="52" ${settings.iconSize === 52 ? 'selected' : ''}>Large (52px)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div class="settings-group">
                                <div class="group-header">
                                    <div class="group-title"><i>🎭</i> Border Effects</div>
                                    <div class="group-subtitle">Customize text and icon borders</div>
                                </div>
                                <div class="group-content">
                                    <div class="settings-row">
                                        <div class="row-label">
                                            <span class="label-main">Text Border Style</span>
                                            <span class="label-desc">Border style for notification text</span>
                                        </div>
                                        <select class="settings-select" id="textBorder">
                                            <option value="none" ${settings.textBorder === 'none' ? 'selected' : ''}>None</option>
                                            <option value="shadow" ${settings.textBorder === 'shadow' ? 'selected' : ''}>Shadow</option>
                                            <option value="solid" ${settings.textBorder === 'solid' ? 'selected' : ''}>Solid Border</option>
                                            <option value="glow" ${settings.textBorder === 'glow' ? 'selected' : ''}>Glow Effect</option>
                                        </select>
                                    </div>
                                    <div class="settings-row">
                                        <div class="row-label">
                                            <span class="label-main">Icon Border Style</span>
                                            <span class="label-desc">Border style for notification icons</span>
                                        </div>
                                        <select class="settings-select" id="iconBorder">
                                            <option value="none" ${settings.iconBorder === 'none' ? 'selected' : ''}>None</option>
                                            <option value="shadow" ${settings.iconBorder === 'shadow' ? 'selected' : ''}>Shadow</option>
                                            <option value="solid" ${settings.iconBorder === 'solid' ? 'selected' : ''}>Solid Border</option>
                                            <option value="glow" ${settings.iconBorder === 'glow' ? 'selected' : ''}>Glow Effect</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Advanced Tab - FIXED: No duplicate content -->
                        <div class="tab-content" id="advanced-tab">
                            <div class="settings-group">
                                <div class="group-header">
                                    <div class="group-title"><i>🔧</i> Advanced Settings</div>
                                    <div class="group-subtitle">Fine-tune the extension behavior</div>
                                </div>
                                <div class="group-content">
                                    <div class="settings-row">
                                        <div class="row-label">
                                            <span class="label-main">Auto-detect Videos</span>
                                            <span class="label-desc">Automatically find video elements</span>
                                        </div>
                                        <div class="toggle-switch checked" id="autoDetect"></div>
                                    </div>
                                    <div class="settings-row">
                                        <div class="row-label">
                                            <span class="label-main">YouTube Integration</span>
                                            <span class="label-desc">Enhanced support for YouTube</span>
                                        </div>
                                        <div class="toggle-switch checked" id="youtubeSupport"></div>
                                    </div>
                                    <div class="settings-row">
                                        <div class="row-label">
                                            <span class="label-main">Enable Sounds</span>
                                            <span class="label-desc">Play sounds for notifications</span>
                                        </div>
                                        <div class="toggle-switch ${settings.enableSounds ? 'checked' : ''}" id="enableSounds"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="settings-footer">
                    <div class="version-info">Version 6.5 • Universal Video Shortcuts</div>
                    <div class="footer-buttons">
                        <button class="settings-button button-reset" id="resetSettings">
                            <i>🔄</i> Reset
                        </button>
                        <button class="settings-button button-cancel" id="cancelSettings">
                            <i>✕</i> Cancel
                        </button>
                        <button class="settings-button button-save" id="saveSettings">
                            <i>💾</i> Save
                        </button>
                    </div>
                </div>
            `;
            
            const parser = new DOMParser();
            const doc = parser.parseFromString(settingsHTML, 'text/html');

            while (doc.body.firstChild) {
                settingsWindow.appendChild(doc.body.firstChild);
            }
            // -----------------
            // --- FIX END ---
            // -----------------

            // Add event listeners with error handling
            const cancelBtn = settingsWindow.querySelector('#cancelSettings');
            const saveBtn = settingsWindow.querySelector('#saveSettings');
            const resetBtn = settingsWindow.querySelector('#resetSettings');

            if (cancelBtn) {
                cancelBtn.addEventListener('click', () => {
                    stopKeyListening();
                    if (overlay.parentNode) document.body.removeChild(overlay);
                    if (settingsWindow.parentNode) document.body.removeChild(settingsWindow);
                });
            }

            if (saveBtn) {
                saveBtn.addEventListener('click', () => {
                    saveModernSettings(settingsWindow);
                    stopKeyListening();
                    if (overlay.parentNode) document.body.removeChild(overlay);
                    if (settingsWindow.parentNode) document.body.removeChild(settingsWindow);
                });
            }

            if (resetBtn) {
                resetBtn.addEventListener('click', () => {
                    if (confirm('Reset all settings to default values?')) {
                        Object.keys(defaultSettings).forEach(key => {
                            GM_setValue(key, defaultSettings[key]);
                            settings[key] = defaultSettings[key];
                        });
                        if (settings.showNotification) {
                            showNotification('Settings Reset!', getIcon('normal_speed'));
                        }
                        // Close and reopen to show default values
                        if (overlay.parentNode) document.body.removeChild(overlay);
                        if (settingsWindow.parentNode) document.body.removeChild(settingsWindow);
                        showModernSettings();
                    }
                });
            }

            // Navigation
            settingsWindow.querySelectorAll('.nav-item').forEach(item => {
                item.addEventListener('click', function() {
                    const tabName = this.getAttribute('data-tab');

                    // Update active nav item
                    settingsWindow.querySelectorAll('.nav-item').forEach(nav => {
                        nav.classList.remove('active');
                    });
                    this.classList.add('active');

                    // Show active content
                    settingsWindow.querySelectorAll('.tab-content').forEach(content => {
                        content.classList.remove('active');
                    });
                    const targetTab = settingsWindow.querySelector(`#${tabName}-tab`);
                    if (targetTab) {
                        targetTab.classList.add('active');
                    }
                });
            });

            // Toggle switches
            settingsWindow.querySelectorAll('.toggle-switch').forEach(toggle => {
                toggle.addEventListener('click', function() {
                    this.classList.toggle('checked');
                });
            });

            // Range inputs
            settingsWindow.querySelectorAll('input[type="range"]').forEach(range => {
                range.addEventListener('input', function() {
                    const value = this.value;
                    const display = this.nextElementSibling;
                    if (this.id === 'opacityRange') {
                        if (display) display.textContent = Math.round(value * 100) + '%';
                        const desc = this.parentElement.querySelector('.label-desc');
                        if (desc) desc.textContent = `${Math.round(value * 100)}% - ${value == 0 ? 'Transparent' : value < 0.5 ? 'Light' : 'Dark'}`;
                    } else if (this.id === 'durationRange') {
                        if (display) display.textContent = value + 'ms';
                    }
                });
            });

            // Theme selection
            settingsWindow.querySelectorAll('.theme-option').forEach(option => {
                option.addEventListener('click', function() {
                    settingsWindow.querySelectorAll('.theme-option').forEach(opt => {
                        opt.classList.remove('selected');
                    });
                    this.classList.add('selected');
                });
            });

            // Key configuration - Click on keys in cards
            settingsWindow.querySelectorAll('.shortcut-keys .key').forEach(key => {
                key.addEventListener('click', function() {
                    const inputId = this.getAttribute('data-input');
                    startKeyListening(this, inputId);
                });
            });

            // Close on overlay click
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    stopKeyListening();
                    if (overlay.parentNode) document.body.removeChild(overlay);
                    if (settingsWindow.parentNode) document.body.removeChild(settingsWindow);
                }
            });

            // Add to page
            document.body.appendChild(overlay);
            document.body.appendChild(settingsWindow);

        } catch (error) {
            console.error('Error showing settings:', error);
        }
    }

    // Save settings from modern window
    function saveModernSettings(settingsWindow) {
        try {
            const newSettings = {
                // Core settings
                shortcutsEnabled: settingsWindow.querySelector('#shortcutsEnabled')?.classList.contains('checked') ?? settings.shortcutsEnabled,
                showNotification: settingsWindow.querySelector('#showNotification')?.classList.contains('checked') ?? settings.showNotification,

                // Space hold settings
                enableSpaceHold: settingsWindow.querySelector('#enableSpaceHold')?.classList.contains('checked') ?? settings.enableSpaceHold,
                holdSpeed: parseFloat(settingsWindow.querySelector('#holdSpeedSelect')?.value) || settings.holdSpeed,

                // Timing
                notificationDuration: parseInt(settingsWindow.querySelector('#durationRange')?.value) || settings.notificationDuration,

                // Shortcut toggles
                enablePlayPause: settingsWindow.querySelector('#enablePlayPause')?.classList.contains('checked') ?? settings.enablePlayPause,
                enableSkip: settingsWindow.querySelector('#enableSkip')?.classList.contains('checked') ?? settings.enableSkip,
                enableVolume: settingsWindow.querySelector('#enableVolume')?.classList.contains('checked') ?? settings.enableVolume,
                enableMute: settingsWindow.querySelector('#enableMute')?.classList.contains('checked') ?? settings.enableMute,
                enableSpeed: settingsWindow.querySelector('#enableSpeed')?.classList.contains('checked') ?? settings.enableSpeed,
                enableFullscreen: settingsWindow.querySelector('#enableFullscreen')?.classList.contains('checked') ?? settings.enableFullscreen,

                // Appearance
                theme: settingsWindow.querySelector('.theme-option.selected')?.getAttribute('data-theme') || settings.theme,
                backgroundShape: settingsWindow.querySelector('#shapeSelect')?.value || settings.backgroundShape,
                showLabels: settingsWindow.querySelector('#showLabels')?.classList.contains('checked') ?? settings.showLabels,
                backgroundOpacity: parseFloat(settingsWindow.querySelector('#opacityRange')?.value) || settings.backgroundOpacity,
                iconSize: parseInt(settingsWindow.querySelector('#iconSizeSelect')?.value) || settings.iconSize,
                textBorder: settingsWindow.querySelector('#textBorder')?.value || settings.textBorder,
                iconBorder: settingsWindow.querySelector('#iconBorder')?.value || settings.iconBorder,
                enableSounds: settingsWindow.querySelector('#enableSounds')?.classList.contains('checked') ?? settings.enableSounds
            };

            // Save all settings
            Object.keys(newSettings).forEach(key => {
                if (newSettings[key] !== undefined) {
                    settings[key] = newSettings[key];
                    GM_setValue(key, newSettings[key]);
                }
            });

            // We must also save the custom key bindings, which are not part of newSettings
            Object.keys(settings).forEach(key => {
                if (key.startsWith('key')) {
                    GM_setValue(key, settings[key]);
                }
            });

            console.log('Settings saved successfully!');
            if (settings.showNotification) {
                showNotification('Settings Saved!', getIcon('normal_speed'));
            }
        } catch (error) {
            console.error('Error saving settings:', error);
        }
    }

    // Get the appropriate icon based on theme (Original preserved)
    function getIcon(iconName) {
        const iconKey = settings.theme === 'dark' ? iconName : iconName + '_mono';
        const iconSvg = svgIcons[iconKey] || svgIcons[iconName] || '';
        const borderStyle = getBorderStyles(settings.theme, 'icon');
        return `<div style="${borderStyle}">${iconSvg.replace('<svg', `<svg width="${settings.iconSize}" height="${settings.iconSize}"`)}</div>`;
    }

    // Find the most relevant video element on the page (Original preserved)
    function getVideo() {
        const videos = Array.from(document.querySelectorAll('video'));

        if (videos.length === 0) {
            return null;
        }
        if (videos.length === 1) {
            return videos[0];
        }

        // Prioritize videos that are playing, visible, or larger
        const scoredVideos = videos.map((video, index) => {
            let score = 0;

            try {
                if (!video.paused) {
                    score += 100;
                }

                const rect = video.getBoundingClientRect();
                const area = rect.width * rect.height;

                // Size matters - larger videos are more likely to be main content
                if (area > 100000) {
                    score += 50;
                } else if (area > 50000) {
                    score += 30;
                } else if (area > 10000) {
                    score += 10;
                }

                // Visibility check
                if (rect.top >= 0 && rect.left >= 0 &&
                    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                    rect.right <= (window.innerWidth || document.documentElement.clientWidth)) {
                    score += 20;
                }

                // Check if video has controls
                if (video.controls) {
                    score += 15;
                }
            } catch (e) {
                // Ignore errors from videos in different frames
            }
            
            return { video, score };
        });

        // Return the video with highest score
        scoredVideos.sort((a, b) => b.score - a.score);
        return scoredVideos[0].video;
    }

    // Check if we're on YouTube (Original preserved)
    function isYouTube() {
        return window.location.hostname.includes('youtube.com');
    }

    // Check if shortcut is enabled
    function isShortcutEnabled(category) {
        return settings.shortcutsEnabled && settings[`enable${category}`];
    }

    // All original functions preserved exactly as they were
    function togglePlay() {
        if (!isShortcutEnabled('PlayPause')) return;

        console.log('🎮 Toggle Play/Pause triggered');
        const video = getVideo();
        if (!video) {
            console.log('❌ No video found for play/pause');
            return;
        }

        console.log(`⏯️ Video current state: ${video.paused ? 'Paused' : 'Playing'}`);

        if (video.paused) {
            video.play().then(() => {
                console.log('✅ Video started playing');
                if (settings.showNotification) showNotification('Playing', getIcon('play'));
            }).catch(err => {
                console.log('❌ Play failed:', err);
            });
        } else {
            video.pause();
            console.log('⏸️ Video paused');
            if (settings.showNotification) showNotification('Paused', getIcon('pause'));
        }
    }

    function skip(seconds) {
        if (!isShortcutEnabled('Skip')) return;

        console.log(`⏩ Skip triggered: ${seconds} seconds`);
        const video = getVideo();
        if (!video) {
            console.log('❌ No video found for skip');
            return;
        }

        const oldTime = video.currentTime;
        video.currentTime += seconds;
        console.log(`⏰ Time changed: ${oldTime.toFixed(1)}s → ${video.currentTime.toFixed(1)}s`);
        if (settings.showNotification) {
            showNotification(`${seconds > 0 ? '+' : ''}${seconds}s`, seconds > 0 ? getIcon('skip_forward') : getIcon('skip_backward'));
        }
    }

    function changeVolume(delta) {
        if (!isShortcutEnabled('Volume')) return;

        console.log(`🔊 Volume change: ${delta > 0 ? '+' : ''}${delta}`);
        const video = getVideo();
        if (!video) {
            console.log('❌ No video found for volume change');
            return;
        }

        const oldVolume = video.volume;
        const newVolume = Math.max(0, Math.min(1, video.volume + delta));
        video.volume = newVolume;

        console.log(`🔊 Volume changed: ${Math.round(oldVolume * 100)}% → ${Math.round(newVolume * 100)}%`);

        if (settings.showNotification) {
            const volumeIcon = newVolume === 0 ? getIcon('mute') : getIcon('volume');
            showNotification(`Volume: ${Math.round(newVolume * 100)}%`, volumeIcon);
        }
    }

    function toggleMute() {
        if (!isShortcutEnabled('Mute')) return;

        console.log('🔇 Toggle Mute triggered');
        const video = getVideo();
        if (!video) {
            console.log('❌ No video found for mute');
            return;
        }

        const wasMuted = video.muted;
        video.muted = !video.muted;
        console.log(`🔇 Mute changed: ${wasMuted ? 'Muted' : 'Unmuted'} → ${video.muted ? 'Muted' : 'Unmuted'}`);
        if (settings.showNotification) {
            showNotification(video.muted ? 'Muted' : 'Unmuted', video.muted ? getIcon('mute') : getIcon('volume'));
        }
    }

    function toggleFullscreen() {
        if (!isShortcutEnabled('Fullscreen')) return;

        console.log('🖥️ Toggle Fullscreen triggered');
        const video = getVideo();
        if (!video) {
            console.log('❌ No video found for fullscreen');
            return;
        }

        if (!document.fullscreenElement) {
            console.log('🖥️ Entering fullscreen');
            (video.parentElement || video).requestFullscreen?.().then(() => {
                console.log('✅ Fullscreen entered successfully');
                if (settings.showNotification) showNotification('Fullscreen', getIcon('fullscreen'));
            }).catch(err => {
                console.log('❌ Fullscreen error:', err);
                // Fallback for older browsers
                 if (video.webkitRequestFullscreen) {
                    video.webkitRequestFullscreen();
                }
            });
        } else {
            console.log('🖥️ Exiting fullscreen');
            document.exitFullscreen?.().then(() => {
                console.log('✅ Fullscreen exited successfully');
                if (settings.showNotification) showNotification('Normal Screen', getIcon('fullscreen'));
            }).catch(err => {
                console.log('❌ Exit fullscreen error:', err);
                if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                }
            });
        }
    }

    function jumpToPercent(percent) {
        if (!isShortcutEnabled('Jump')) return;

        console.log(`⏭️ Jump to ${percent}% triggered`);
        const video = getVideo();
        if (!video || !video.duration) {
            console.log('❌ No video or duration for jump');
            return;
        }

        const newTime = (percent / 100) * video.duration;
        console.log(`⏰ Jumping to ${newTime.toFixed(1)}s (${percent}% of ${video.duration.toFixed(1)}s)`);
        video.currentTime = newTime;
        if (settings.showNotification) showNotification(`${percent}%`, getIcon('jump'));
    }

    function changeSpeed(delta) {
        if (!isShortcutEnabled('Speed')) return;

        console.log(`⚡ Speed change: ${delta > 0 ? '+' : ''}${delta}`);
        const video = getVideo();
        if (video) {
            const oldSpeed = video.playbackRate;
            video.playbackRate = Math.max(0.1, Math.min(4, video.playbackRate + delta));
            console.log(`⚡ Speed changed: ${oldSpeed.toFixed(2)}x → ${video.playbackRate.toFixed(2)}x`);
            if (settings.showNotification) showNotification(`Speed: ${video.playbackRate.toFixed(2)}x`, getIcon('speed'));
        } else {
            console.log('❌ No video found for speed change');
        }
    }

    function setNormalSpeed() {
        if (!isShortcutEnabled('Speed')) return;

        console.log('⏱️ Set normal speed triggered');
        const video = getVideo();
        if (video) {
            const oldSpeed = video.playbackRate;
            video.playbackRate = 1;
            console.log(`⏱️ Speed reset: ${oldSpeed.toFixed(2)}x → 1.00x`);
            if (settings.showNotification) showNotification('Speed: 1.00x', getIcon('normal_speed'));
        } else {
            console.log('❌ No video found for speed reset');
        }
    }

    // ✨ ENHANCED: Show notification overlay centered on video (Original preserved)
    function showNotification(text, icon = '') {
        if (!settings.showNotification) return;

        console.log(`📢 Notification: ${text}`);

        const existing = document.querySelector('.universal-video-notification');
        if (existing) {
            console.log('🗑️ Removing existing notification');
            existing.remove();
        }

        // 🎯 ENHANCEMENT: Get the video element to center notification on it
        const video = getVideo();
        let topPosition = '50%';
        let leftPosition = '50%';
        let positionStrategy = 'fixed';

        if (video) {
            try {
                const rect = video.getBoundingClientRect();
                 // Check if video is in an iframe by comparing its document with the top document
                if (video.ownerDocument !== window.top.document) {
                     // Can't reliably get coordinates relative to top viewport from iframe
                     console.log('⚠️ Video is in an iframe, centering on viewport');
                } else if (rect.width > 0 && rect.height > 0) {
                    const videoCenterX = rect.left + (rect.width / 2);
                    const videoCenterY = rect.top + (rect.height / 2);

                    topPosition = `${videoCenterY}px`;
                    leftPosition = `${videoCenterX}px`;
                    positionStrategy = 'fixed'; // Use fixed as rect is relative to viewport

                    console.log(`📍 Centering notification on video at (${videoCenterX.toFixed(0)}, ${videoCenterY.toFixed(0)})`);
                } else {
                     console.log('⚠️ Video has no dimensions, centering on viewport');
                }
            } catch (e) {
                 console.log('⚠️ Error getting video rect (cross-origin iframe?), centering on viewport', e);
            }
        } else {
            console.log('⚠️ No video found, centering on viewport');
        }

        // Determine shape based on settings
        let borderRadius;
        let padding;

        switch(settings.backgroundShape) {
            case 'circle':
                borderRadius = '50%';
                padding = '30px 30px';
                break;
            case 'square':
                borderRadius = '0px';
                padding = '25px 35px';
                break;
            case 'rounded':
            default:
                borderRadius = '15px';
                padding = '25px 35px';
                break;
        }

        const displayText = settings.showLabels ? text : '';
        const textBorderStyle = getBorderStyles(settings.theme, 'text');

        const notification = document.createElement('div');
        notification.className = 'universal-video-notification';

        // -----------------
        // --- FIX START ---
        // -----------------
        // Use DOMParser to safely parse HTML and avoid TrustedHTML errors
        let notificationHTML = '';
        if (icon) {
            notificationHTML = `
                <div style="display: flex; justify-content: center; align-items: center; margin-bottom: ${settings.showLabels ? '10px' : '0'};">
                    ${icon}
                </div>
                ${settings.showLabels ? `<div style="color: white; font-size: 18px; font-weight: bold; ${textBorderStyle}">${displayText}</div>` : ''}
            `;
        } else if (settings.showLabels) {
            notificationHTML = `<div style="color: white; font-size: 18px; font-weight: bold; ${textBorderStyle}">${displayText}</div>`;
        }

        if (notificationHTML) {
            const parser = new DOMParser();
            const doc = parser.parseFromString(notificationHTML, 'text/html');
            while (doc.body.firstChild) {
                notification.appendChild(doc.body.firstChild);
            }
        }
        // -----------------
        // --- FIX END ---
        // -----------------

        notification.style.cssText = `
            position: ${positionStrategy};
            top: ${topPosition};
            left: ${leftPosition};
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, ${settings.backgroundOpacity});
            color: white;
            padding: ${padding};
            border-radius: ${borderRadius};
            font-size: 18px;
            font-family: 'Arial', 'Segoe UI', sans-serif;
            font-weight: bold;
            z-index: 2147483647; /* Max z-index */
            pointer-events: none;
            opacity: 1;
            transition: opacity 0.4s ease;
            text-align: center;
            border: ${settings.backgroundOpacity > 0 ? '3px solid rgba(255, 255, 255, 0.3)' : 'none'};
            backdrop-filter: ${settings.backgroundOpacity > 0 ? 'blur(15px)' : 'none'};
            -webkit-backdrop-filter: ${settings.backgroundOpacity > 0 ? 'blur(15px)' : 'none'};
            box-shadow: ${settings.backgroundOpacity > 0 ? '0 10px 30px rgba(0, 0, 0, 0.3)' : 'none'};
            min-width: ${settings.backgroundShape === 'circle' ? '100px' : '180px'};
            min-height: ${settings.backgroundShape === 'circle' ? '100px' : 'auto'};
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        `;

        document.body.appendChild(notification);
        console.log('✅ Notification created and displayed');

        // Fade out and remove
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                    console.log('🗑️ Notification removed');
                }
            }, 400);
        }, settings.notificationDuration);
    }

    // Handle keyup for hold key release
    document.addEventListener('keyup', function(e) {
        if (e.key.toLowerCase() === settings.keyHoldSpeed && settings.enableSpaceHold && settings.shortcutsEnabled) {
            console.log('🎮 Hold key released');

            // Clear the hold timeout if key was released quickly
            if (spaceHoldTimeout) {
                clearTimeout(spaceHoldTimeout);
                spaceHoldTimeout = null;
            }

            // End the hold if it was active
            endSpaceHold();
        }
    }, true); // Use capture phase

    // Handle keyboard events with custom key bindings
    document.addEventListener('keydown', function(e) {
        // Don't trigger if typing in an input field or if we're listening for a new key
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable || currentListeningInput) {
            console.log(`⌨️ Key ${e.key} ignored (input field or key listening)`);
            return;
        }

        // Do not run if shortcuts are disabled
        if (!settings.shortcutsEnabled) {
            return;
        }
        
        const video = getVideo();
        if (!video) {
            // Only log if key is one we might care about, to avoid console spam
             const allKeys = Object.keys(settings).filter(k => k.startsWith('key')).map(k => settings[k]);
             if (allKeys.includes(e.key.toLowerCase())) {
                console.log(`⌨️ Key ${e.key} ignored (no video)`);
             }
            return;
        }

        console.log(`⌨️ Key pressed: ${e.key} (YouTube: ${isYouTube()})`);

        // Handle hold key with custom key binding
        if (e.key.toLowerCase() === settings.keyHoldSpeed && settings.enableSpaceHold) {
            console.log(`🎮 Hold key pressed (${settings.keyHoldSpeed} for ${settings.holdSpeed}x speed)`);

            // Clear any existing timeout
            if (spaceHoldTimeout) {
                clearTimeout(spaceHoldTimeout);
            }
            
            // Prevent default spacebar action (like scrolling)
            if (e.key === ' ') {
                e.preventDefault();
            }

            // Start hold after a short delay to distinguish from normal key press
            spaceHoldTimeout = setTimeout(() => {
                startSpaceHold();
            }, 300);

            return;
        }

        // On YouTube, only handle speed controls to avoid conflicts
        if (isYouTube()) {
            const key = e.key.toLowerCase();
            if (key === settings.keySpeedDown && isShortcutEnabled('Speed')) {
                console.log('🎮 YouTube: Speed decrease');
                e.preventDefault();
                changeSpeed(-0.25);
            } else if (key === settings.keySpeedNormal && isShortcutEnabled('Speed')) {
                console.log('🎮 YouTube: Normal speed');
                e.preventDefault();
                setNormalSpeed();
            } else if (key === settings.keySpeedUp && isShortcutEnabled('Speed')) {
                console.log('🎮 YouTube: Speed increase');
                e.preventDefault();
                changeSpeed(0.25);
            }
            return;
        }

        // For non-YouTube sites, handle all shortcuts with custom key bindings
        const key = e.key.toLowerCase();

        // Play/Pause
        if ((key === settings.keyPlayPause || (key === settings.keyPlayPauseAlt && !isSpaceHeld)) && isShortcutEnabled('PlayPause')) {
            console.log('🎮 Play/Pause');
            e.preventDefault();
            togglePlay();
        }
        // Skip controls
        else if (key === settings.keyRewind10 && isShortcutEnabled('Skip')) {
            console.log('🎮 Rewind 10s');
            e.preventDefault();
            skip(-10);
        }
        else if (key === settings.keyRewind5 && isShortcutEnabled('Skip')) {
            console.log('🎮 Rewind 5s');
            e.preventDefault();
            skip(-5);
        }
        else if (key === settings.keyForward10 && isShortcutEnabled('Skip')) {
            console.log('🎮 Forward 10s');
            e.preventDefault();
            skip(10);
        }
        else if (key === settings.keyForward5 && isShortcutEnabled('Skip')) {
            console.log('🎮 Forward 5s');
            e.preventDefault();
            skip(5);
        }
        // Volume controls
        else if (key === settings.keyVolumeUp && isShortcutEnabled('Volume')) {
            console.log('🎮 Volume up');
            e.preventDefault();
            changeVolume(0.05);
        }
        else if (key === settings.keyVolumeDown && isShortcutEnabled('Volume')) {
            console.log('🎮 Volume down');
            e.preventDefault();
            changeVolume(-0.05);
        }
        else if (key === settings.keyMute && isShortcutEnabled('Mute')) {
            console.log('🎮 Toggle mute');
            e.preventDefault();
            toggleMute();
        }
        // Fullscreen
        else if (key === settings.keyFullscreen && isShortcutEnabled('Fullscreen')) {
            console.log('🎮 Toggle fullscreen');
            e.preventDefault();
            toggleFullscreen();
        }
        // Speed controls
        else if (key === settings.keySpeedDown && isShortcutEnabled('Speed')) {
            console.log('🎮 Speed down');
            e.preventDefault();
            changeSpeed(-0.25);
        }
        else if (key === settings.keySpeedNormal && isShortcutEnabled('Speed')) {
            console.log('🎮 Normal speed');
            e.preventDefault();
            setNormalSpeed();
        }
        else if (key === settings.keySpeedUp && isShortcutEnabled('Speed')) {
            console.log('🎮 Speed up');
            e.preventDefault();
            changeSpeed(0.25);
        }
        // Jump controls
        else if (key >= '0' && key <= '9' && isShortcutEnabled('Jump')) {
            console.log(`🎮 Jump to ${parseInt(key) * 10}%`);
            e.preventDefault();
            jumpToPercent(parseInt(key) * 10);
        }
        else if (key === 'home' && isShortcutEnabled('Jump')) {
            console.log('🎮 Jump to start');
            e.preventDefault();
            jumpToPercent(0);
        }
        else if (key === 'end' && isShortcutEnabled('Jump')) {
            console.log('🎮 Jump to end');
            e.preventDefault();
            jumpToPercent(100);
        }
    }, true); // Use capture phase

    console.log('✅ Universal Video Shortcuts loaded! ✨ MODERN with tap-to-change shortcuts!');
    console.log('📋 Available shortcuts: K/Space (play/pause), J/L (skip), ←/→ (small skip), ↑/↓ (volume), M (mute), F (fullscreen), A/S/D (speed), 0-9 (jump to %)');
    console.log('🎮 Customizable: Click any key in settings to change shortcuts');
    console.log('⚙️  Click Tampermonkey icon → "Video Shortcuts Settings" to customize');
})();