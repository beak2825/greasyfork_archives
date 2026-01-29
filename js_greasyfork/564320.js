// ==UserScript==
// @name         KG Helper
// @namespace    http://tampermonkey.net/
// @version      v1.0
// @description  KG Helper: Freeleech Downloader + Request Matcher + Uploader Tipper + Upgrade Announcer
// @author       evafans
// @match        https://karagarga.in/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/564320/KG%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/564320/KG%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const SETTINGS_KEY = 'kg-helper:settings:v1';
    const DEBUG = true;

    const DEFAULT_SETTINGS = {
        fl: {
            enabled: true,
            downloadIntervalMs: 1000,
            pageFetchIntervalMs: 500,
            maxDownloadsPerRun: 0,
        },
        requestMatcher: {
            enabled: true,
        },
        uploaderTipper: {
            enabled: true,
            presetsGb: [1, 5, 10],
            commentTemplate: 'Thanks for the upload! {url}',
        },
        upgradeAnnouncer: {
            enabled: true,
            commonMods: ['120days', 'Aw', 'hjulien44', 'mproust87', 'ronnie', 'SalineLibations', 'sjostrom27', 'zappo'],
        },
    };

    function isPlainObject(value) {
        return value != null && typeof value === 'object' && !Array.isArray(value);
    }

    function deepMergeDefaults(defaults, overrides) {
        if (Array.isArray(defaults)) {
            return Array.isArray(overrides) ? overrides.slice() : defaults.slice();
        }
        if (!isPlainObject(defaults)) {
            return overrides === undefined ? defaults : overrides;
        }

        const result = {};
        const src = isPlainObject(overrides) ? overrides : {};
        for (const key of Object.keys(defaults)) {
            result[key] = deepMergeDefaults(defaults[key], src[key]);
        }
        return result;
    }

    function clampInt(value, min, max, fallback) {
        const n = Number(value);
        if (!Number.isFinite(n)) return fallback;
        const i = Math.trunc(n);
        if (i < min) return min;
        if (i > max) return max;
        return i;
    }

    function normalizePresetsGb(value) {
        let raw = value;
        if (typeof raw === 'string') {
            raw = raw.split(/[,\s]+/).filter(Boolean);
        }
        if (!Array.isArray(raw)) raw = DEFAULT_SETTINGS.uploaderTipper.presetsGb;

        const nums = raw
            .map((v) => parseInt(v, 10))
            .filter((n) => Number.isFinite(n) && n > 0)
            .filter((n, idx, arr) => arr.indexOf(n) === idx)
            .slice(0, 8);

        return nums.length ? nums : DEFAULT_SETTINGS.uploaderTipper.presetsGb.slice();
    }

    function normalizeCommentTemplate(value) {
        const t = String(value || '').replace(/\s+/g, ' ').trim() || DEFAULT_SETTINGS.uploaderTipper.commentTemplate;
        return t.includes('{url}') ? t : `${t} {url}`.trim();
    }

    function normalizeCommonMods(value) {
        let raw = value;
        if (typeof raw === 'string') {
            raw = raw.split(/[,\n]+/).map((s) => s.trim()).filter(Boolean);
        }
        if (!Array.isArray(raw)) raw = DEFAULT_SETTINGS.upgradeAnnouncer.commonMods;

        const mods = raw
            .map((v) => String(v || '').trim())
            .filter(Boolean)
            .filter((m, idx, arr) => arr.indexOf(m) === idx)
            .slice(0, 30);

        return mods.length ? mods : DEFAULT_SETTINGS.upgradeAnnouncer.commonMods.slice();
    }

    function sanitizeSettings(value) {
        const rawPresetsGb = value?.uploaderTipper?.presetsGb;
        const rawCommonMods = value?.upgradeAnnouncer?.commonMods;
        const merged = deepMergeDefaults(DEFAULT_SETTINGS, value);
        return {
            fl: {
                enabled: Boolean(merged.fl.enabled),
                downloadIntervalMs: clampInt(merged.fl.downloadIntervalMs, 100, 60000, DEFAULT_SETTINGS.fl.downloadIntervalMs),
                pageFetchIntervalMs: clampInt(merged.fl.pageFetchIntervalMs, 100, 60000, DEFAULT_SETTINGS.fl.pageFetchIntervalMs),
                maxDownloadsPerRun: clampInt(merged.fl.maxDownloadsPerRun, 0, 100000, DEFAULT_SETTINGS.fl.maxDownloadsPerRun),
            },
            requestMatcher: {
                enabled: Boolean(merged.requestMatcher.enabled),
            },
            uploaderTipper: {
                enabled: Boolean(merged.uploaderTipper.enabled),
                presetsGb: normalizePresetsGb(rawPresetsGb ?? merged.uploaderTipper.presetsGb),
                commentTemplate: normalizeCommentTemplate(merged.uploaderTipper.commentTemplate),
            },
            upgradeAnnouncer: {
                enabled: Boolean(merged.upgradeAnnouncer.enabled),
                commonMods: normalizeCommonMods(rawCommonMods ?? merged.upgradeAnnouncer.commonMods),
            },
        };
    }

    function loadSettings() {
        const raw = localStorage.getItem(SETTINGS_KEY);
        if (!raw) return sanitizeSettings(DEFAULT_SETTINGS);
        try {
            return sanitizeSettings(JSON.parse(raw));
        } catch {
            return sanitizeSettings(DEFAULT_SETTINGS);
        }
    }

    function saveSettings(next) {
        const sanitized = sanitizeSettings(next);
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(sanitized));
        return sanitized;
    }

    function clearSettings() {
        localStorage.removeItem(SETTINGS_KEY);
    }

    let settings = loadSettings();

    function log(...args) {
        if (DEBUG) console.log('[KG Helper]', ...args);
    }

    const SettingsUI = (() => {
        const IDS = {
            root: 'kg-settings-root',
            style: 'kg-settings-style',
            toggle: 'kg-settings-toggle',
            overlay: 'kg-settings-overlay',
            drawer: 'kg-settings-drawer',
            close: 'kg-settings-close',
            save: 'kg-settings-save',
            reset: 'kg-settings-reset',
            toast: 'kg-settings-toast',
            tabBtns: 'kg-settings-tab-btn',
            tabPanels: 'kg-settings-panel',
            flEnabled: 'kg-set-fl-enabled',
            flDownloadInterval: 'kg-set-fl-download-interval',
            flPageFetchInterval: 'kg-set-fl-page-fetch-interval',
            flMaxDownloads: 'kg-set-fl-max-downloads',
            flEnabledLabel: 'kg-set-fl-enabled-label',
            reqEnabled: 'kg-set-req-enabled',
            reqEnabledLabel: 'kg-set-req-enabled-label',
            tipEnabled: 'kg-set-tip-enabled',
            tipEnabledLabel: 'kg-set-tip-enabled-label',
            tipPresets: 'kg-set-tip-presets',
            tipTemplate: 'kg-set-tip-template',
            tipPreview: 'kg-set-tip-preview',
            upgEnabled: 'kg-set-upg-enabled',
            upgEnabledLabel: 'kg-set-upg-enabled-label',
            upgMods: 'kg-set-upg-mods',
        };

        const GEAR_SVG_DATA_URI = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">' +
                '<path fill="#8a8a8a" d="M19.14,12.94c0.04,-0.3 0.06,-0.62 0.06,-0.94 0,-0.32 -0.02,-0.64 -0.07,-0.94l2.03,-1.58c0.18,-0.23 0.23,-0.56 0.05,-0.82l-1.92,-3.32c-0.12,-0.26 -0.43,-0.35 -0.7,-0.25l-2.39,0.96c-0.5,-0.38 -1.04,-0.69 -1.64,-0.92l-0.36,-2.54c-0.04,-0.28 -0.28,-0.49 -0.57,-0.49h-3.84c-0.29,0 -0.53,0.21 -0.57,0.49l-0.36,2.54c-0.6,0.23 -1.14,0.54 -1.64,0.92l-2.39,-0.96c-0.27,-0.1 -0.58,-0.01 -0.7,0.25l-1.92,3.32c-0.12,0.26 -0.07,0.59 0.05,0.82l2.03,1.58c-0.05,0.3 -0.07,0.62 -0.07,0.94 0,0.32 0.02,0.64 0.07,0.94l-2.03,1.58c-0.18,0.23 -0.23,0.56 -0.05,0.82l1.92,3.32c0.12,0.26 0.43,0.35 0.7,0.25l2.39,-0.96c0.5,0.38 1.04,0.69 1.64,0.92l0.36,2.54c0.04,0.28 0.28,0.49 0.57,0.49h3.84c0.29,0 0.53,-0.21 0.57,-0.49l0.36,-2.54c0.6,-0.23 1.14,-0.54 1.64,-0.92l2.39,0.96c0.27,0.1 0.58,0.01 0.7,-0.25l1.92,-3.32c0.12,-0.26 0.07,-0.59 -0.05,-0.82l-2.03,-1.58Zm-7.14,2.06c-1.65,0 -3,-1.35 -3,-3 0,-1.65 1.35,-3 3,-3 1.65,0 3,1.35 3,3 0,1.65 -1.35,3 -3,3Z"/>' +
            '</svg>'
        );

        let initialized = false;
        let activeTab = 'fl';
        let onChange = () => {};
        let toastTimer = null;
        let toggleSpacerNode = null;

        function $(id) {
            return document.getElementById(id);
        }

        function ensureStyle() {
            if ($(IDS.style)) return;
            const style = document.createElement('style');
            style.id = IDS.style;
            style.textContent = `
                #${IDS.root} {
                    position: fixed;
                    inset: 0;
                    pointer-events: none;
                    z-index: 100000;
                    --kg-overlay: rgba(0,0,0,0.22);
                    --kg-drawer-bg: linear-gradient(180deg, #f7f7f7 0%, #ececec 100%);
                    --kg-surface: rgba(255,255,255,0.92);
                    --kg-border: rgba(0,0,0,0.14);
                    --kg-border-soft: rgba(0,0,0,0.08);
                    --kg-text: #1f1f1f;
                    --kg-muted: #6a6a6a;
                    --kg-shadow: rgba(0,0,0,0.22);
                    --kg-focus: rgba(0,0,0,0.12);
                    --kg-primary-bg: #2c2c2c;
                    --kg-primary-border: #2c2c2c;
                    --kg-primary-text: #ffffff;
                }
                #${IDS.toggle} {
                    pointer-events: auto;
                    position: relative;
                    display: inline-block;
                    padding: 0;
                    border: 0;
                    margin: 0;
                    background: transparent;
                    cursor: pointer;
                    vertical-align: middle;
                    text-decoration: none;
                    line-height: 0;
                }
                #${IDS.toggle} img { width: 100%; height: 100%; display: block; }

                #${IDS.overlay} {
                    pointer-events: none;
                    position: fixed;
                    inset: 0;
                    background: var(--kg-overlay);
                    opacity: 0;
                    transition: opacity 0.2s ease;
                }
                #${IDS.root}.open #${IDS.overlay} { pointer-events: auto; opacity: 1; }

                #${IDS.drawer} {
                    pointer-events: auto;
                    position: fixed;
                    top: 0;
                    right: 0;
                    height: 100vh;
                    width: 460px;
                    max-width: calc(100vw - 40px);
                    transform: translateX(104%);
                    transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
                    background: var(--kg-drawer-bg);
                    color: var(--kg-text);
                    border-left: 1px solid var(--kg-border);
                    box-shadow: -22px 0 60px var(--kg-shadow);
                    font: 12px/1.35 Verdana, Arial, sans-serif;
                }
                #${IDS.drawer}::before {
                    content: '';
                    display: none;
                }
                #${IDS.root}.open #${IDS.drawer} { transform: translateX(0); }

                #${IDS.drawer} .kg-head {
                    position: relative;
                    padding: 14px 14px 12px;
                    border-bottom: 1px solid var(--kg-border-soft);
                    display: flex;
                    align-items: flex-start;
                    justify-content: space-between;
                    gap: 10px;
                }
                #${IDS.drawer} .kg-head .title {
                    font: 700 11px/1.2 Verdana, Arial, sans-serif;
                    letter-spacing: 0.08em;
                    text-transform: uppercase;
                    color: var(--kg-muted);
                }
                #${IDS.drawer} .kg-head .sub {
                    margin-top: 6px;
                    font: 700 16px/1.25 Verdana, Arial, sans-serif;
                    color: var(--kg-text);
                }
                #${IDS.drawer} .kg-close {
                    position: relative;
                    border: 1px solid var(--kg-border);
                    background: rgba(255,255,255,0.85);
                    color: var(--kg-muted);
                    border-radius: 10px;
                    width: 34px;
                    height: 34px;
                    cursor: pointer;
                    font: 700 16px/1 Verdana, Arial, sans-serif;
                }
                #${IDS.drawer} .kg-close:hover { border-color: rgba(0,0,0,0.28); background: rgba(255,255,255,0.98); color: var(--kg-text); }

                #${IDS.drawer} .kg-body {
                    position: relative;
                    display: grid;
                    grid-template-columns: 180px 1fr;
                    height: calc(100vh - 64px - 62px);
                }
                #${IDS.drawer} .kg-tabs {
                    padding: 8px;
                    background: rgba(0,0,0,0.03);
                    border-right: 1px solid var(--kg-border-soft);
                }
                #${IDS.drawer} .kg-tab {
                    width: 100%;
                    text-align: left;
                    padding: 9px 8px;
                    border-radius: 12px;
                    border: 1px solid transparent;
                    background: transparent;
                    color: var(--kg-muted);
                    cursor: pointer;
                    white-space: normal;
                    overflow: visible;
                    text-overflow: clip;
                    transition: background 0.12s ease, border-color 0.12s ease, color 0.12s ease;
                }
                #${IDS.drawer} .kg-tab small { display: block; margin-top: 4px; color: rgba(0,0,0,0.55); font-weight: normal; }
                #${IDS.drawer} .kg-tab.active {
                    background: var(--kg-surface);
                    border-color: var(--kg-border);
                    color: var(--kg-text);
                    box-shadow: 0 10px 24px rgba(0,0,0,0.08);
                }
                #${IDS.drawer} .kg-main {
                    padding: 14px 16px 18px;
                    overflow: auto;
                }
                #${IDS.drawer} .kg-panel { display: none; }
                #${IDS.drawer} .kg-panel.active { display: block; }

                #${IDS.drawer} .kg-card {
                    border: 1px solid var(--kg-border-soft);
                    background: var(--kg-surface);
                    border-radius: 14px;
                    padding: 12px;
                    margin-bottom: 12px;
                    box-shadow: 0 10px 26px rgba(0,0,0,0.09);
                }
                #${IDS.drawer} .kg-row { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
                #${IDS.drawer} .kg-row label { font-weight: bold; color: var(--kg-text); }
                #${IDS.drawer} label.kg-switch {
                    position: relative;
                    width: 40px;
                    height: 22px;
                    flex: 0 0 auto;
                    cursor: pointer;
                    user-select: none;
                }
                #${IDS.drawer} label.kg-switch input {
                    position: absolute;
                    width: 1px;
                    height: 1px;
                    opacity: 0;
                    pointer-events: none;
                }
                #${IDS.drawer} label.kg-switch .kg-switch-track {
                    position: absolute;
                    inset: 0;
                    border-radius: 999px;
                    border: 1px solid rgba(0,0,0,0.22);
                    background: linear-gradient(180deg, rgba(148,163,184,0.30) 0%, rgba(148,163,184,0.18) 100%);
                    box-shadow: inset 0 1px 2px rgba(0,0,0,0.16);
                    transition: background 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease;
                }
                #${IDS.drawer} label.kg-switch .kg-switch-track::after {
                    content: "";
                    position: absolute;
                    top: 50%;
                    left: 2px;
                    width: 18px;
                    height: 18px;
                    border-radius: 999px;
                    background: radial-gradient(circle at 35% 30%, rgba(255,255,255,1) 0%, rgba(248,250,252,0.98) 42%, rgba(226,232,240,0.96) 100%);
                    border: 1px solid rgba(15,23,42,0.14);
                    box-shadow: 0 1px 1px rgba(15,23,42,0.20), 0 6px 10px rgba(15,23,42,0.16);
                    transform: translate(0, -50%);
                    transition: transform 0.18s ease, box-shadow 0.18s ease;
                    will-change: transform;
                }
                #${IDS.drawer} label.kg-switch input:checked + .kg-switch-track {
                    border-color: rgba(37,99,235,0.65);
                    background: linear-gradient(180deg, rgba(96,165,250,0.98) 0%, rgba(59,130,246,0.96) 45%, rgba(37,99,235,0.98) 100%);
                    box-shadow: inset 0 1px 2px rgba(0,0,0,0.18), 0 10px 18px rgba(37,99,235,0.18);
                }
                #${IDS.drawer} label.kg-switch input:checked + .kg-switch-track::after {
                    transform: translate(16px, -50%);
                }
                #${IDS.drawer} label.kg-switch input:focus-visible + .kg-switch-track {
                    outline: none;
                    box-shadow: 0 0 0 3px rgba(59,130,246,0.30), inset 0 1px 2px rgba(0,0,0,0.18);
                }
                #${IDS.drawer} label.kg-switch input:checked:focus-visible + .kg-switch-track {
                    outline: none;
                    box-shadow: 0 0 0 3px rgba(37,99,235,0.30), inset 0 1px 2px rgba(0,0,0,0.18), 0 10px 18px rgba(37,99,235,0.18);
                }
                #${IDS.drawer} label.kg-switch:active .kg-switch-track::after { box-shadow: 0 1px 1px rgba(15,23,42,0.18), 0 4px 8px rgba(15,23,42,0.14); }
                #${IDS.drawer} label.kg-switch input:disabled + .kg-switch-track { opacity: 0.55; cursor: not-allowed; }
                @media (prefers-reduced-motion: reduce) {
                    #${IDS.drawer} label.kg-switch .kg-switch-track,
                    #${IDS.drawer} label.kg-switch .kg-switch-track::after { transition: none; }
                }
                #${IDS.drawer} .kg-help { margin-top: 6px; color: var(--kg-muted); font-size: 11px; }
                #${IDS.drawer} input[type="text"],
                #${IDS.drawer} input[type="number"],
                #${IDS.drawer} textarea {
                    width: 100%;
                    box-sizing: border-box;
                    padding: 8px 10px;
                    border-radius: 10px;
                    border: 1px solid rgba(0,0,0,0.18);
                    background: rgba(255,255,255,0.96);
                    color: var(--kg-text);
                    outline: none;
                }
                #${IDS.drawer} textarea { min-height: 70px; resize: vertical; }
                #${IDS.drawer} input[type="text"]:focus,
                #${IDS.drawer} input[type="number"]:focus,
                #${IDS.drawer} textarea:focus { border-color: rgba(0,0,0,0.32); box-shadow: 0 0 0 3px var(--kg-focus); }
                #${IDS.drawer} .kg-field { margin-top: 10px; }
                #${IDS.drawer} .kg-field label { display: block; margin-bottom: 6px; font-weight: bold; color: var(--kg-text); }
                #${IDS.drawer} .kg-preview {
                    margin-top: 8px;
                    padding: 10px;
                    border-radius: 12px;
                    border: 1px dashed rgba(0,0,0,0.22);
                    background: rgba(0,0,0,0.03);
                    color: var(--kg-text);
                    font-size: 11px;
                    word-break: break-word;
                }

                #${IDS.drawer} .kg-foot {
                    position: relative;
                    height: 62px;
                    padding: 10px 12px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    border-top: 1px solid var(--kg-border-soft);
                }
                #${IDS.drawer} .kg-foot .spacer { flex: 1; }
                #${IDS.drawer} .kg-btn {
                    border-radius: 12px;
                    border: 1px solid var(--kg-border);
                    background: rgba(255,255,255,0.86);
                    color: var(--kg-text);
                    padding: 9px 12px;
                    cursor: pointer;
                    font: 700 12px/1 Verdana, Arial, sans-serif;
                }
                #${IDS.drawer} .kg-btn:hover { border-color: rgba(0,0,0,0.28); background: rgba(255,255,255,0.98); }
                #${IDS.drawer} .kg-btn.primary {
                    background: var(--kg-primary-bg);
                    border-color: var(--kg-primary-border);
                    color: var(--kg-primary-text);
                    box-shadow: 0 12px 26px rgba(0,0,0,0.16);
                }
                #${IDS.drawer} .kg-btn.primary:hover { box-shadow: 0 14px 30px rgba(0,0,0,0.22); }

                #${IDS.toast} {
                    pointer-events: none;
                    position: fixed;
                    right: 25px;
                    bottom: 92px;
                    padding: 10px 12px;
                    border-radius: 12px;
                    border: 1px solid var(--kg-border);
                    background: rgba(255,255,255,0.94);
                    color: var(--kg-text);
                    font: 700 12px/1.2 Verdana, Arial, sans-serif;
                    box-shadow: 0 12px 36px rgba(0,0,0,0.2);
                    opacity: 0;
                    transform: translateY(6px);
                    transition: opacity 0.2s ease, transform 0.2s ease;
                    z-index: 100003;
                }
                #${IDS.toast}.show { opacity: 1; transform: translateY(0); }
                #${IDS.toast}.ok { border-color: rgba(46, 204, 113, 0.45); }
                #${IDS.toast}.bad { border-color: rgba(231, 76, 60, 0.55); }
            `;
            document.head.appendChild(style);
        }

        function ensureDom() {
            if ($(IDS.root)) return;

            const root = document.createElement('div');
            root.id = IDS.root;
            root.innerHTML = `
                <div id="${IDS.overlay}"></div>
                <aside id="${IDS.drawer}" role="dialog" aria-modal="true" aria-label="KG Helper Settings">
                    <div class="kg-head">
                        <div>
                            <div class="title">KG Helper</div>
                            <div class="sub">Settings</div>
                        </div>
                        <button id="${IDS.close}" class="kg-close" type="button" aria-label="Close">&times;</button>
                    </div>
                    <div class="kg-body">
                        <div class="kg-tabs" role="tablist">
                            <button class="kg-tab ${IDS.tabBtns}" type="button" data-tab="fl">Freeleech Downloader</button>
                            <button class="kg-tab ${IDS.tabBtns}" type="button" data-tab="req">Request Matcher</button>
                            <button class="kg-tab ${IDS.tabBtns}" type="button" data-tab="tip">Uploader Tipper</button>
                            <button class="kg-tab ${IDS.tabBtns}" type="button" data-tab="upg">Upgrade Announcer</button>
                        </div>
                        <div class="kg-main">
                            <div class="kg-panel ${IDS.tabPanels}" data-tab="fl">
                                <div class="kg-card">
                                    <div class="kg-row">
                                        <label id="${IDS.flEnabledLabel}" for="${IDS.flEnabled}">Enable</label>
                                        <label class="kg-switch">
                                            <input id="${IDS.flEnabled}" type="checkbox" />
                                            <span class="kg-switch-track" aria-hidden="true"></span>
                                        </label>
                                    </div>
                                </div>
                                <div class="kg-card">
                                    <div class="kg-field">
                                        <label for="${IDS.flPageFetchInterval}">Page fetch interval (ms)</label>
                                        <input id="${IDS.flPageFetchInterval}" type="number" min="100" max="60000" step="50" />
                                        <div class="kg-help">Delay between fetching each browse page.</div>
                                    </div>
                                    <div class="kg-field">
                                        <label for="${IDS.flDownloadInterval}">Download interval (ms)</label>
                                        <input id="${IDS.flDownloadInterval}" type="number" min="100" max="60000" step="50" />
                                        <div class="kg-help">Delay between each download action.</div>
                                    </div>
                                    <div class="kg-field">
                                        <label for="${IDS.flMaxDownloads}">Max downloads per run (0 = unlimited)</label>
                                        <input id="${IDS.flMaxDownloads}" type="number" min="0" max="100000" step="1" />
                                    </div>
                                </div>
                            </div>

                            <div class="kg-panel ${IDS.tabPanels}" data-tab="req">
                                <div class="kg-card">
                                    <div class="kg-row">
                                        <label id="${IDS.reqEnabledLabel}" for="${IDS.reqEnabled}">Enable</label>
                                        <label class="kg-switch">
                                            <input id="${IDS.reqEnabled}" type="checkbox" />
                                            <span class="kg-switch-track" aria-hidden="true"></span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div class="kg-panel ${IDS.tabPanels}" data-tab="tip">
                                <div class="kg-card">
                                    <div class="kg-row">
                                        <label id="${IDS.tipEnabledLabel}" for="${IDS.tipEnabled}">Enable</label>
                                        <label class="kg-switch">
                                            <input id="${IDS.tipEnabled}" type="checkbox" />
                                            <span class="kg-switch-track" aria-hidden="true"></span>
                                        </label>
                                    </div>
                                </div>
                                <div class="kg-card">
                                    <div class="kg-field">
                                        <label for="${IDS.tipPresets}">Preset amounts (GB)</label>
                                        <input id="${IDS.tipPresets}" type="text" placeholder="1, 5, 10" />
                                        <div class="kg-help">Comma-separated numbers. Example: 1,5,10</div>
                                    </div>
                                    <div class="kg-field">
                                        <label for="${IDS.tipTemplate}">Comment template</label>
                                        <textarea id="${IDS.tipTemplate}" placeholder="Thanks for the upload! {url}"></textarea>
                                        <div class="kg-help">Use <code>{url}</code> as a placeholder for the torrent link.</div>
                                        <div class="kg-preview" id="${IDS.tipPreview}"></div>
                                    </div>
                                </div>
                            </div>

                            <div class="kg-panel ${IDS.tabPanels}" data-tab="upg">
                                <div class="kg-card">
                                    <div class="kg-row">
                                        <label id="${IDS.upgEnabledLabel}" for="${IDS.upgEnabled}">Enable</label>
                                        <label class="kg-switch">
                                            <input id="${IDS.upgEnabled}" type="checkbox" />
                                            <span class="kg-switch-track" aria-hidden="true"></span>
                                        </label>
                                    </div>
                                </div>
                                <div class="kg-card">
                                    <div class="kg-field">
                                        <label for="${IDS.upgMods}">Preset Mods</label>
                                        <input id="${IDS.upgMods}" type="text" placeholder="ModA, ModB, ModC" />
                                        <div class="kg-help">Comma-separated list used for the <b>Approved by</b> dropdown on <code>upload.php</code>. You can still type a name manually.</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="kg-foot">
                        <button id="${IDS.reset}" class="kg-btn" type="button">Reset</button>
                        <div class="spacer"></div>
                        <button class="kg-btn" type="button" data-action="close">Close</button>
                        <button id="${IDS.save}" class="kg-btn primary" type="button">Save</button>
                    </div>
                </aside>
                <div id="${IDS.toast}"></div>
            `;

            document.body.appendChild(root);

            if (!$(IDS.toggle)) {
                const toggleLink = document.createElement('a');
                toggleLink.id = IDS.toggle;
                toggleLink.href = '#';
                toggleLink.title = 'KG Helper Settings';
                toggleLink.setAttribute('role', 'button');
                toggleLink.setAttribute('aria-haspopup', 'dialog');
                toggleLink.setAttribute('aria-expanded', 'false');

                const icon = document.createElement('img');
                icon.alt = 'Settings';
                icon.decoding = 'async';
                icon.src = GEAR_SVG_DATA_URI;
                toggleLink.appendChild(icon);

                toggleLink.style.display = 'none';
                document.body.appendChild(toggleLink);
            }
        }

        function findActivityLink() {
            const img = document.querySelector('img[alt="Show my current activity"], img[title="Show my current activity"], img[src*="current.png"]');
            if (img) {
                const a = img.closest('a');
                if (a) return a;
            }
            return document.querySelector('a[href*="current.php?id="], a[href*="current.php?"]');
        }

        function placeToggle() {
            const toggle = $(IDS.toggle);
            if (!toggle) return;

            const anchor = findActivityLink();
            if (!anchor || !anchor.parentNode) {
                toggle.style.display = 'none';
                toggle.style.transform = '';
                return;
            }

            anchor.parentNode.insertBefore(toggle, anchor);

            const refImg = anchor.querySelector('img') || anchor;
            const rect = refImg.getBoundingClientRect();
            const refH = Math.round(rect.height || refImg.naturalHeight || refImg.height || 0);
            const refW = Math.round(rect.width || refImg.naturalWidth || refImg.width || 0);
            const size = Math.max(16, Math.min(48, refH || refW || 24));
            toggle.style.width = `${size}px`;
            toggle.style.height = `${size}px`;
            toggle.style.display = 'inline-block';
            toggle.style.transform = '';

            if (refImg instanceof HTMLImageElement && !refImg.complete) {
                refImg.addEventListener('load', () => refreshPosition(), { once: true });
            }

            const siblingSpacer = anchor.nextSibling && anchor.nextSibling.nodeType === Node.TEXT_NODE ? anchor.nextSibling.textContent : '\u00A0\u00A0\u00A0';
            if (!toggleSpacerNode) toggleSpacerNode = document.createTextNode(siblingSpacer);
            toggleSpacerNode.textContent = siblingSpacer;
            if (toggleSpacerNode.parentNode !== anchor.parentNode) {
                toggleSpacerNode.remove();
                anchor.parentNode.insertBefore(toggleSpacerNode, anchor);
            } else if (toggleSpacerNode.nextSibling !== anchor) {
                toggleSpacerNode.remove();
                anchor.parentNode.insertBefore(toggleSpacerNode, anchor);
            }

            requestAnimationFrame(() => {
                try {
                    const refRect = refImg.getBoundingClientRect();
                    const toggleRect = toggle.getBoundingClientRect();
                    if (!refRect.height || !toggleRect.height) return;
                    const refCenter = refRect.top + refRect.height / 2;
                    const toggleCenter = toggleRect.top + toggleRect.height / 2;
                    const deltaPx = Math.round(refCenter - toggleCenter);
                    if (Math.abs(deltaPx) <= 8 && deltaPx !== 0) toggle.style.transform = `translateY(${deltaPx}px)`;
                } catch (_) {}
            });
        }

        function setOpen(open) {
            const root = $(IDS.root);
            const toggle = $(IDS.toggle);
            if (!root || !toggle) return;
            if (open) {
                root.classList.add('open');
                toggle.setAttribute('aria-expanded', 'true');
            } else {
                root.classList.remove('open');
                toggle.setAttribute('aria-expanded', 'false');
            }
        }

        function isOpen() {
            return $(IDS.root)?.classList.contains('open') || false;
        }

        function selectTab(tab) {
            activeTab = tab;
            document.querySelectorAll(`.${IDS.tabBtns}`).forEach((btn) => {
                btn.classList.toggle('active', btn.dataset.tab === tab);
            });
            document.querySelectorAll(`.${IDS.tabPanels}`).forEach((panel) => {
                panel.classList.toggle('active', panel.dataset.tab === tab);
            });
        }

        function showToast(message, ok) {
            const el = $(IDS.toast);
            if (!el) return;
            if (toastTimer) clearTimeout(toastTimer);
            el.className = '';
            el.textContent = message;
            el.classList.add('show', ok ? 'ok' : 'bad');
            toastTimer = setTimeout(() => {
                el.classList.remove('show');
            }, 2200);
        }

        function updateEnableLabels() {
            const pairs = [
                [IDS.flEnabled, IDS.flEnabledLabel],
                [IDS.reqEnabled, IDS.reqEnabledLabel],
                [IDS.tipEnabled, IDS.tipEnabledLabel],
                [IDS.upgEnabled, IDS.upgEnabledLabel],
            ];

            for (const [toggleId, labelId] of pairs) {
                const toggle = $(toggleId);
                const label = $(labelId);
                if (!toggle || !label) continue;
                label.textContent = toggle.checked ? 'Enable' : 'Disable';
            }
        }

        function updateTipPreview(template) {
            const el = $(IDS.tipPreview);
            if (!el) return;
            const sampleUrl = `${location.origin}/details.php?id=123`;
            const preview = normalizeCommentTemplate(template).replace('{url}', sampleUrl).slice(0, 240);
            el.textContent = preview;
        }

        function render(current) {
            if (!current) return;
            const s = sanitizeSettings(current);
            const flEnabled = $(IDS.flEnabled);
            const flDownload = $(IDS.flDownloadInterval);
            const flFetch = $(IDS.flPageFetchInterval);
            const flMax = $(IDS.flMaxDownloads);
            const reqEnabled = $(IDS.reqEnabled);
            const tipEnabled = $(IDS.tipEnabled);
            const tipPresets = $(IDS.tipPresets);
            const tipTemplate = $(IDS.tipTemplate);
            const upgEnabled = $(IDS.upgEnabled);
            const upgMods = $(IDS.upgMods);

            if (flEnabled) flEnabled.checked = s.fl.enabled;
            if (flDownload) flDownload.value = String(s.fl.downloadIntervalMs);
            if (flFetch) flFetch.value = String(s.fl.pageFetchIntervalMs);
            if (flMax) flMax.value = String(s.fl.maxDownloadsPerRun);
            if (reqEnabled) reqEnabled.checked = s.requestMatcher.enabled;
            if (tipEnabled) tipEnabled.checked = s.uploaderTipper.enabled;
            if (tipPresets) tipPresets.value = s.uploaderTipper.presetsGb.join(', ');
            if (tipTemplate) tipTemplate.value = s.uploaderTipper.commentTemplate;
            if (upgEnabled) upgEnabled.checked = s.upgradeAnnouncer.enabled;
            if (upgMods) upgMods.value = s.upgradeAnnouncer.commonMods.join(', ');

            updateTipPreview(s.uploaderTipper.commentTemplate);
            updateEnableLabels();
            selectTab(activeTab);
        }

        function readForm() {
            return {
                fl: {
                    enabled: Boolean($(IDS.flEnabled)?.checked),
                    downloadIntervalMs: $(IDS.flDownloadInterval)?.value,
                    pageFetchIntervalMs: $(IDS.flPageFetchInterval)?.value,
                    maxDownloadsPerRun: $(IDS.flMaxDownloads)?.value,
                },
                requestMatcher: {
                    enabled: Boolean($(IDS.reqEnabled)?.checked),
                },
                uploaderTipper: {
                    enabled: Boolean($(IDS.tipEnabled)?.checked),
                    presetsGb: $(IDS.tipPresets)?.value,
                    commentTemplate: $(IDS.tipTemplate)?.value,
                },
                upgradeAnnouncer: {
                    enabled: Boolean($(IDS.upgEnabled)?.checked),
                    commonMods: $(IDS.upgMods)?.value,
                },
            };
        }

        function open(tab) {
            if (tab) selectTab(tab);
            render(settings);
            setOpen(true);
        }

        function close() {
            setOpen(false);
        }

        function toggle() {
            if (isOpen()) close();
            else open(activeTab);
        }

        function refreshPosition() {
            placeToggle();
        }

        function init({ onChange: onChangeCb } = {}) {
            if (initialized) return;
            initialized = true;
            onChange = typeof onChangeCb === 'function' ? onChangeCb : () => {};

            ensureStyle();
            ensureDom();

            const root = $(IDS.root);
            const overlay = $(IDS.overlay);
            const toggleBtn = $(IDS.toggle);
            const closeBtn = $(IDS.close);
            const saveBtn = $(IDS.save);
            const resetBtn = $(IDS.reset);
            const closeAction = document.querySelector(`#${IDS.drawer} [data-action="close"]`);

            if (!root || !overlay || !toggleBtn || !closeBtn || !saveBtn || !resetBtn || !closeAction) return;

            toggleBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                toggle();
            });

            overlay.addEventListener('click', () => close());
            closeBtn.addEventListener('click', () => close());
            closeAction.addEventListener('click', () => close());

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && isOpen()) close();
            });

            document.querySelectorAll(`.${IDS.tabBtns}`).forEach((btn) => {
                btn.addEventListener('click', () => {
                    selectTab(btn.dataset.tab || 'core');
                });
            });

            $(IDS.tipTemplate)?.addEventListener('input', (e) => updateTipPreview(e.target.value));
            [IDS.flEnabled, IDS.reqEnabled, IDS.tipEnabled, IDS.upgEnabled].forEach((id) => {
                $(id)?.addEventListener('change', () => updateEnableLabels());
            });

            saveBtn.addEventListener('click', () => {
                const candidate = readForm();
                const saved = saveSettings(candidate);
                onChange(saved);
                render(saved);
                showToast('Settings saved', true);
            });

            resetBtn.addEventListener('click', () => {
                clearSettings();
                const reset = loadSettings();
                onChange(reset);
                render(reset);
                showToast('Settings reset', true);
            });

            refreshPosition();
            render(settings);
            selectTab(activeTab);
        }

        return { init, refreshPosition, openTab: open, close };
    })();

    // --- Freeleech Downloader ---
    const FreeleechDownloader = (() => {

    const DEFAULT_CONFIG = {
        downloadIntervalMs: DEFAULT_SETTINGS.fl.downloadIntervalMs,
        pageFetchIntervalMs: DEFAULT_SETTINGS.fl.pageFetchIntervalMs,
        maxDownloadsPerRun: DEFAULT_SETTINGS.fl.maxDownloadsPerRun,
    };

    let config = { ...DEFAULT_CONFIG };

    function applyConfig(overrides) {
        const merged = { ...DEFAULT_CONFIG, ...(isPlainObject(overrides) ? overrides : {}) };
        config = {
            downloadIntervalMs: clampInt(merged.downloadIntervalMs, 100, 60000, DEFAULT_CONFIG.downloadIntervalMs),
            pageFetchIntervalMs: clampInt(merged.pageFetchIntervalMs, 100, 60000, DEFAULT_CONFIG.pageFetchIntervalMs),
            maxDownloadsPerRun: clampInt(merged.maxDownloadsPerRun, 0, 100000, DEFAULT_CONFIG.maxDownloadsPerRun),
        };
    }

    function applySettings(flSettings) {
        applyConfig(flSettings);
    }

    function delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    function scanTorrentsFromDoc(doc, pageNum) {
        const torrents = [];
        const seenIds = new Set();

        doc.querySelectorAll('tr').forEach(row => {
            const tdCount = row.querySelectorAll('td').length;
            if (tdCount < 10 || tdCount > 25) return;

            const downloadLink = row.querySelector('a[href*="down.php/"]');
            if (!downloadLink) return;

            const idMatch = downloadLink.href.match(/down\.php\/(\d+)/);
            if (!idMatch) return;

            const torrentId = idMatch[1];

            if (seenIds.has(torrentId)) {
                if (row.classList.contains('snatchedrow')) {
                    const existing = torrents.find(t => t.id === torrentId);
                    if (existing) existing.isSnatched = true;
                }
                return;
            }
            seenIds.add(torrentId);

            const titleLink = row.querySelector(`a[href*="details.php?id=${torrentId}"]`);
            torrents.push({
                id: torrentId,
                title: titleLink?.textContent?.trim() || `Torrent ${torrentId}`,
                downloadUrl: downloadLink.href,
                isSnatched: row.classList.contains('snatchedrow'),
                page: pageNum
            });
        });

        return torrents;
    }

    function getPaginationInfo(doc) {
        const pages = new Set([0]);
        doc.querySelectorAll('a[href*="page="]').forEach(link => {
            const match = link.href.match(/page=(\d+)/);
            if (match) pages.add(parseInt(match[1]));
        });
        return {
            totalPages: Math.max(...pages) + 1,
            pageNumbers: [...pages].sort((a, b) => a - b)
        };
    }

    async function fetchPage(pageNum) {
        const params = new URLSearchParams({ fl: '1' });
        if (pageNum > 0) params.set('page', pageNum);

        log(`Fetching page ${pageNum + 1}...`);
        const response = await fetch(`https://karagarga.in/browse.php?${params}`, { credentials: 'include' });
        const parser = new DOMParser();
        return parser.parseFromString(await response.text(), 'text/html');
    }

    async function scanAllPages(progressCallback, ringCallback) {
        const allTorrents = [];
        const seenIds = new Set();
        const isFreeleechPage = new URLSearchParams(window.location.search).get('fl') === '1';

        let firstPageDoc = isFreeleechPage ? document : await fetchPage(0);
        scanTorrentsFromDoc(firstPageDoc, 0).forEach(t => {
            if (!seenIds.has(t.id)) { seenIds.add(t.id); allTorrents.push(t); }
        });

        const { totalPages, pageNumbers } = getPaginationInfo(firstPageDoc);
        log(`Detected ${totalPages} pages`);
        if (progressCallback) progressCallback(`Scanning... Page 1/${totalPages}`);
        const pagesToFetch = pageNumbers.filter((n) => n !== 0).length;
        let attemptedFetches = 0;
        if (ringCallback) ringCallback(pagesToFetch ? 0 : 100);

        for (const pageNum of pageNumbers) {
            if (pageNum === 0) continue;
            if (progressCallback) progressCallback(`Scanning... Page ${pageNum + 1}/${totalPages}`);
            await delay(config.pageFetchIntervalMs);

            try {
                const pageTorrents = scanTorrentsFromDoc(await fetchPage(pageNum), pageNum);
                pageTorrents.forEach(t => {
                    if (!seenIds.has(t.id)) { seenIds.add(t.id); allTorrents.push(t); }
                });
                log(`Page ${pageNum + 1}: ${pageTorrents.length} torrents`);
            } catch (e) {
                log(`Failed to fetch page ${pageNum + 1}:`, e);
            } finally {
                attemptedFetches++;
                if (ringCallback && pagesToFetch) ringCallback((attemptedFetches / pagesToFetch) * 100);
            }
        }

        return { torrents: allTorrents, totalPages };
    }

    function highlightCurrentPage(allTorrents) {
        document.querySelectorAll('tr').forEach(row => {
            const tdCount = row.querySelectorAll('td').length;
            if (tdCount < 10 || tdCount > 25) return;

            const downloadLink = row.querySelector('a[href*="down.php/"]');
            if (!downloadLink) return;

            const idMatch = downloadLink.href.match(/down\.php\/(\d+)/);
            if (!idMatch) return;

            const torrent = allTorrents.find(t => t.id === idMatch[1]);
            if (!torrent) return;

            const titleLink = row.querySelector(`a[href*="details.php?id=${torrent.id}"]`);
            if (titleLink) {
                titleLink.style.cssText = torrent.isSnatched
                    ? 'color: #9b59b6 !important; text-decoration: line-through;'
                    : 'color: #27ae60 !important; font-weight: bold;';
            }
        });
    }

    function createControlPanel() {
        document.getElementById('kg-fl-panel')?.remove();
        document.getElementById('kg-fl-toggle')?.remove();

        const toggleBtn = document.createElement('div');
        toggleBtn.id = 'kg-fl-toggle';
        toggleBtn.innerHTML = `
            <span class="fab-free">FREE</span>
            <div class="fab-arrow"></div>
            <svg class="fab-progress" viewBox="0 0 52 52">
                <defs>
                    <linearGradient id="kg-fl-ring-scan" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stop-color="#34d399"/>
                        <stop offset="60%" stop-color="#22c55e"/>
                        <stop offset="100%" stop-color="#16a34a"/>
                    </linearGradient>
                    <linearGradient id="kg-fl-ring-download" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stop-color="#60a5fa"/>
                        <stop offset="55%" stop-color="#3b82f6"/>
                        <stop offset="100%" stop-color="#1d4ed8"/>
                    </linearGradient>
                </defs>
                <circle class="progress-bg" cx="26" cy="26" r="24"/>
                <circle class="progress-ring" cx="26" cy="26" r="24"/>
                <circle class="scan-sweep" cx="26" cy="26" r="24"/>
            </svg>
        `;
        toggleBtn.title = 'Freeleech Downloader';

        const panel = document.createElement('div');
        panel.id = 'kg-fl-panel';
        panel.innerHTML = `
            <style>
                #kg-fl-toggle {
                    position: fixed; bottom: 25px; right: 25px; z-index: 10000;
                    width: 52px; height: 52px;
                    background:
                        radial-gradient(120% 120% at 30% 20%, rgba(255,255,255,0.40), rgba(255,255,255,0) 58%),
                        linear-gradient(180deg, rgba(205, 210, 215, 0.82) 0%, rgba(165, 170, 175, 0.74) 100%);
                    border: 1px solid rgba(100, 110, 120, 0.4);
                    border-radius: 50%;
                    display: flex; flex-direction: column; align-items: center; justify-content: center;
                    cursor: pointer;
                    box-shadow: 0 2px 12px rgba(0,0,0,0.2);
                    backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                #kg-fl-toggle:hover {
                    transform: scale(1.08);
                    background:
                        radial-gradient(120% 120% at 30% 20%, rgba(255,255,255,0.48), rgba(255,255,255,0) 58%),
                        linear-gradient(180deg, rgba(215, 220, 225, 0.90) 0%, rgba(175, 180, 185, 0.80) 100%);
                    box-shadow: 0 4px 20px rgba(0,0,0,0.25);
                    border-color: rgba(80, 90, 100, 0.5);
                }
                #kg-fl-toggle.active {
                    background:
                        radial-gradient(120% 120% at 30% 20%, rgba(255,255,255,0.35), rgba(255,255,255,0) 60%),
                        linear-gradient(180deg, rgba(185, 190, 195, 0.82) 0%, rgba(150, 155, 160, 0.76) 100%);
                    box-shadow: 0 1px 8px rgba(0,0,0,0.15), inset 0 1px 3px rgba(0,0,0,0.1);
                    transform: scale(0.98);
                }
                #kg-fl-toggle .fab-free {
                    font: bold 9px/1 'Segoe UI', Verdana, sans-serif;
                    color: #2a8a2a; letter-spacing: 0.5px; margin-bottom: 2px;
                }
                #kg-fl-toggle .fab-arrow {
                    width: 18px; height: 16px; position: relative;
                    transition: transform 0.2s ease;
                }
                #kg-fl-toggle:hover .fab-arrow { transform: translateY(2px); }
                #kg-fl-toggle .fab-arrow::before {
                    content: ''; position: absolute; left: 50%; top: 0;
                    width: 3px; height: 10px; background: #445672;
                    transform: translateX(-50%); border-radius: 1px;
                    transition: all 0.2s ease;
                }
                #kg-fl-toggle:hover .fab-arrow::before { background: #2a3a4a; height: 11px; }
                #kg-fl-toggle .fab-arrow::after {
                    content: ''; position: absolute; bottom: 0; left: 50%;
                    transform: translateX(-50%);
                    width: 0; height: 0;
                    border-left: 8px solid transparent;
                    border-right: 8px solid transparent;
                    border-top: 8px solid #445672;
                    transition: all 0.2s ease;
                }
                #kg-fl-toggle:hover .fab-arrow::after {
                    border-top-color: #2a3a4a;
                    border-left-width: 9px; border-right-width: 9px; border-top-width: 9px;
                }
                #kg-fl-toggle.active .fab-free { color: #1a7a1a; }
                #kg-fl-toggle.active .fab-arrow::before { background: #5a6a7a; }
                #kg-fl-toggle.active .fab-arrow::after { border-top-color: #5a6a7a; }

                #kg-fl-toggle .fab-progress {
                    position: absolute;
                    top: 0; left: 0;
                    width: 52px; height: 52px;
                    transform: rotate(-90deg);
                    opacity: 0;
                    transition: opacity 0.3s ease;
                    pointer-events: none;
                }
                #kg-fl-toggle.scanning .fab-progress,
                #kg-fl-toggle.downloading .fab-progress { opacity: 1; }
                #kg-fl-toggle .progress-bg {
                    fill: none;
                    stroke: rgba(100, 116, 139, 0.18);
                    stroke-width: 3;
                }
                #kg-fl-toggle .progress-ring {
                    fill: none;
                    stroke: #94a3b8;
                    stroke-width: 3;
                    stroke-linecap: round;
                    stroke-dasharray: 150.8;
                    stroke-dashoffset: 150.8;
                    transition: stroke-dashoffset 0.3s ease;
                }
                #kg-fl-toggle .scan-sweep {
                    fill: none;
                    stroke: url(#kg-fl-ring-scan);
                    stroke-width: 3;
                    stroke-linecap: round;
                    stroke-dasharray: 18 132.8;
                    stroke-dashoffset: 150.8;
                    opacity: 0;
                }
                @keyframes kg-fl-scan-sweep {
                    from { stroke-dashoffset: 150.8; }
                    to { stroke-dashoffset: 0; }
                }
                #kg-fl-toggle.scanning .progress-bg { stroke: rgba(42, 138, 42, 0.15); }
                #kg-fl-toggle.scanning .progress-ring {
                    stroke: url(#kg-fl-ring-scan);
                    opacity: 0.28;
                    filter: none;
                }
                #kg-fl-toggle.scanning .scan-sweep {
                    opacity: 0.9;
                    animation: kg-fl-scan-sweep 1.05s linear infinite;
                    filter: drop-shadow(0 0 4px rgba(42, 138, 42, 0.55));
                }
                #kg-fl-toggle.downloading .progress-bg { stroke: rgba(59, 130, 246, 0.18); }
                #kg-fl-toggle.downloading .progress-ring {
                    stroke: url(#kg-fl-ring-download);
                    filter: drop-shadow(0 0 3px rgba(59, 130, 246, 0.6));
                }
                #kg-fl-toggle.downloading .scan-sweep { opacity: 0; animation: none; filter: none; }
                #kg-fl-toggle.scanning .fab-free,
                #kg-fl-toggle.scanning .fab-arrow,
                #kg-fl-toggle.downloading .fab-free,
                #kg-fl-toggle.downloading .fab-arrow { opacity: 0.3; }
                @media (prefers-reduced-motion: reduce) {
                    #kg-fl-toggle .progress-ring { transition: none; }
                    #kg-fl-toggle.scanning .scan-sweep { animation: none; }
                }

                #kg-fl-panel {
                    position: fixed; bottom: 85px; right: 25px; z-index: 9999;
                    background: #f7f7f7; border: 1px solid #445672;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.25);
                    font: 11px/1.4 Verdana, Arial, sans-serif;
                    width: 260px; display: none; border-radius: 6px; overflow: hidden;
                }
                #kg-fl-panel .panel-header {
                    background: linear-gradient(180deg, #5a6a7a 0%, #445672 100%);
                    color: #e8eef4; padding: 6px 10px;
                    font-weight: bold; font-size: 11px;
                    border-bottom: 1px solid #3a4652;
                    display: flex; justify-content: space-between; align-items: center;
                }
                #kg-fl-panel .panel-header .ver { font-weight: normal; color: #9ab; font-size: 9px; }
                #kg-fl-panel .panel-close { color: #9ab; cursor: pointer; font-size: 14px; line-height: 1; }
                #kg-fl-panel .panel-close:hover { color: #fff; }
                #kg-fl-panel .panel-body { padding: 8px; }
                #kg-fl-panel .stats-table { width: 100%; border-collapse: collapse; margin-bottom: 8px; font-size: 11px; }
                #kg-fl-panel .stats-table td { padding: 4px 6px; border: 1px solid #ccc; background: #eee; }
                #kg-fl-panel .stats-table td:first-child { color: #445672; width: 50%; }
                #kg-fl-panel .stats-table td:last-child { text-align: right; font-weight: bold; }
                #kg-fl-panel .stats-table .new-count { color: #2a7b2a; }
                #kg-fl-panel .stats-table .old-count { color: #9932cc; }
                #kg-fl-panel .status-bar {
                    background: #e8e8e8; border: 1px solid #ccc;
                    padding: 5px 8px; margin-bottom: 8px;
                    font-size: 10px; color: #666; min-height: 14px;
                }
                #kg-fl-panel .status-bar.working { color: #445672; }
                #kg-fl-panel .status-bar.success { color: #2a7b2a; }
                #kg-fl-panel .status-bar.error { color: #c33; }
                #kg-fl-panel .btn-row { display: flex; gap: 4px; margin-bottom: 6px; }
                #kg-fl-panel .kg-btn {
                    flex: 1; padding: 5px 8px;
                    font: bold 10px Verdana, sans-serif;
                    cursor: pointer; border: 1px solid;
                    border-radius: 10px;
                    position: relative;
                    overflow: hidden;
                    white-space: nowrap;
                    transition:
                        background 0.22s ease,
                        box-shadow 0.22s ease,
                        border-color 0.22s ease,
                        filter 0.22s ease,
                        transform 0.22s ease,
                        color 0.22s ease;
                }
                #kg-fl-panel .btn-scan {
                    background: linear-gradient(180deg, #ffffff 0%, #f1f5f9 100%);
                    border-color: #cbd5e1;
                    color: #334155;
                    box-shadow:
                        0 1px 2px rgba(15,23,42,0.08),
                        0 10px 18px rgba(15,23,42,0.10),
                        inset 0 1px 0 rgba(255,255,255,0.7);
                }
                #kg-fl-panel .btn-scan:hover {
                    border-color: #94a3b8;
                    box-shadow:
                        0 2px 4px rgba(15,23,42,0.10),
                        0 12px 22px rgba(15,23,42,0.12),
                        inset 0 1px 0 rgba(255,255,255,0.75);
                }
                #kg-fl-panel .btn-scan:active {
                    transform: translateY(1px);
                    filter: brightness(0.99);
                }
                #kg-fl-panel .kg-btn:focus-visible {
                    outline: none;
                    box-shadow:
                        0 0 0 3px rgba(59,130,246,0.30),
                        0 10px 18px rgba(15,23,42,0.10);
                }
                #kg-fl-panel .btn-download {
                    border-color: #15803d;
                    background: linear-gradient(180deg, #34d399 0%, #22c55e 48%, #16a34a 100%);
                    color: #fff;
                    box-shadow:
                        0 1px 2px rgba(0,0,0,0.18),
                        0 14px 24px rgba(22,163,74,0.28),
                        inset 0 1px 0 rgba(255,255,255,0.22);
                }
                #kg-fl-panel .btn-download::after {
                    content: '';
                    position: absolute;
                    inset: 1px;
                    border-radius: 9px;
                    background: radial-gradient(120% 180% at 20% 0%, rgba(255,255,255,0.22), rgba(255,255,255,0) 55%);
                    pointer-events: none;
                    opacity: 0.9;
                }
                #kg-fl-panel .btn-download:hover {
                    filter: brightness(1.02);
                    box-shadow:
                        0 2px 6px rgba(0,0,0,0.18),
                        0 18px 30px rgba(22,163,74,0.32),
                        inset 0 1px 0 rgba(255,255,255,0.25);
                }
                #kg-fl-panel .btn-download:active {
                    transform: translateY(1px);
                    filter: brightness(0.99);
                    box-shadow:
                        0 1px 3px rgba(0,0,0,0.18),
                        0 12px 22px rgba(22,163,74,0.24),
                        inset 0 1px 0 rgba(255,255,255,0.18);
                }
                #kg-fl-panel .btn-download:focus-visible {
                    outline: none;
                    box-shadow:
                        0 0 0 3px rgba(34,197,94,0.32),
                        0 18px 30px rgba(22,163,74,0.32),
                        inset 0 1px 0 rgba(255,255,255,0.22);
                }
                #kg-fl-panel .btn-download:disabled {
                    background: linear-gradient(180deg, #e2e8f0 0%, #cbd5e1 100%);
                    border-color: #cbd5e1;
                    color: #94a3b8;
                    cursor: not-allowed;
                    box-shadow: none;
                    filter: none;
                    transform: none;
                }
                #kg-fl-panel .btn-download:disabled::after { opacity: 0; }

                /* In-progress state: keep the primary button vivid while disabled */
                #kg-fl-panel .btn-download.kg-progressing:disabled {
                    border-color: #15803d;
                    background: linear-gradient(180deg, #34d399 0%, #22c55e 48%, #16a34a 100%);
                    color: rgba(255,255,255,0.95);
                    cursor: wait;
                    box-shadow:
                        0 1px 2px rgba(0,0,0,0.18),
                        0 14px 24px rgba(22,163,74,0.26),
                        inset 0 1px 0 rgba(255,255,255,0.20);
                }
                #kg-fl-panel .btn-download.kg-progressing:disabled::after { opacity: 0.9; }
                #kg-fl-panel .progress-wrap {
                    height: 3px;
                    background: rgba(148,163,184,0.25);
                    box-shadow: inset 0 0 0 1px rgba(100,116,139,0.35);
                    border-radius: 999px;
                    margin-top: 6px;
                    display: none;
                    overflow: visible;
                }
                #kg-fl-panel .progress-wrap.show { display: none; }
                #kg-fl-panel .progress-bar {
                    height: 100%;
                    width: 0;
                    border-radius: 999px;
                    background: linear-gradient(90deg, #34d399 0%, #22c55e 55%, #16a34a 100%);
                    transition: width 0.3s ease;
                    position: relative;
                    will-change: width;
                }
                @media (prefers-reduced-motion: reduce) {
                    #kg-fl-panel .kg-btn,
                    #kg-fl-panel .progress-bar { transition: none; }
                }
            </style>
            <div class="panel-header">
                <span>Freeleech Downloader <span class="ver">v1.0</span></span>
                <span class="panel-close" id="kg-panel-close">&times;</span>
            </div>
            <div class="panel-body">
                <table class="stats-table" id="kg-stats" style="display:none;">
                    <tr><td>Total torrents</td><td id="kg-stat-total">-</td></tr>
                    <tr><td>Not downloaded</td><td class="new-count" id="kg-stat-new">-</td></tr>
                    <tr><td>Downloaded</td><td class="old-count" id="kg-stat-old">-</td></tr>
                </table>
                <div class="status-bar" id="kg-status"></div>
                <div class="btn-row">
                    <button class="kg-btn btn-scan" id="kg-btn-scan">Scan</button>
                    <button class="kg-btn btn-download" id="kg-btn-download" disabled>Download</button>
                </div>
                <div class="progress-wrap" id="kg-progress-wrap">
                    <div class="progress-bar" id="kg-progress-bar"></div>
                </div>
            </div>
        `;
        document.body.appendChild(toggleBtn);
        document.body.appendChild(panel);

        toggleBtn.onclick = () => {
            const toggle = document.getElementById('kg-fl-toggle');
            if (toggle?.classList.contains('scanning') || toggle?.classList.contains('downloading')) return;
            startScan();
        };
        document.getElementById('kg-panel-close').onclick = () => {
            panel.style.display = 'none';
            toggleBtn.classList.remove('active');
        };
        document.getElementById('kg-btn-scan').onclick = startScan;
        document.getElementById('kg-btn-download').onclick = startDownload;

        return panel;
    }

    function updateStatus(text, type = '') {
        const el = document.getElementById('kg-status');
        if (el) { el.textContent = text; el.className = 'status-bar' + (type ? ' ' + type : ''); }
    }

    function updateProgress(percent) {
        const clamped = Math.max(0, Math.min(100, percent));
        const toggle = document.getElementById('kg-fl-toggle');
        const ring = toggle?.querySelector('.progress-ring');
        const scanBtn = document.getElementById('kg-btn-scan');
        const isActive = clamped < 100 && (clamped > 0 || scanBtn?.disabled);
        if (toggle && ring) {
            const circumference = 150.8;
            const offset = circumference - (clamped / 100) * circumference;
            ring.style.strokeDashoffset = offset;
            toggle.classList.remove('scanning');
            toggle.classList.toggle('downloading', isActive);
        }

        const downloadBtn = document.getElementById('kg-btn-download');
        if (downloadBtn) {
            downloadBtn.classList.toggle('kg-progressing', isActive);
        }
    }

    function updateScanRing(percent) {
        const toggle = document.getElementById('kg-fl-toggle');
        const ring = toggle?.querySelector('.progress-ring');
        if (!ring) return;

        const circumference = 150.8;
        const clamped = Math.max(0, Math.min(100, percent));
        const offset = circumference - (clamped / 100) * circumference;
        ring.style.strokeDashoffset = offset;
    }

    function updateStats(torrents, totalPages) {
        const snatched = torrents.filter(t => t.isSnatched);
        const notSnatched = torrents.filter(t => !t.isSnatched);

        const statsTable = document.getElementById('kg-stats');
        if (statsTable) statsTable.style.display = 'table';

        const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
        setVal('kg-stat-total', torrents.length);
        setVal('kg-stat-new', notSnatched.length);
        setVal('kg-stat-old', snatched.length);

        const downloadBtn = document.getElementById('kg-btn-download');
        if (downloadBtn) {
            downloadBtn.disabled = notSnatched.length === 0;
            downloadBtn.textContent = notSnatched.length > 0 ? `Download (${notSnatched.length})` : 'Done';
        }

        window.kgAllTorrents = torrents;
        window.kgNotSnatched = notSnatched;
    }

    async function startScan() {
        const scanBtn = document.getElementById('kg-btn-scan');
        const panel = document.getElementById('kg-fl-panel');
        const toggle = document.getElementById('kg-fl-toggle');

        scanBtn.disabled = true;
        scanBtn.textContent = 'Scanning...';
        toggle.classList.remove('downloading');
        toggle.classList.add('scanning');
        updateScanRing(0);
        await new Promise(requestAnimationFrame);

        try {
            const { torrents, totalPages } = await scanAllPages(
                null,
                percent => updateScanRing(percent)
            );
            updateScanRing(100);
            await delay(220);
            toggle.classList.remove('scanning');
            updateScanRing(0);

            panel.style.display = 'block';
            toggle.classList.add('active');

            updateStats(torrents, totalPages);
            highlightCurrentPage(torrents);
            const notSnatched = torrents.filter(t => !t.isSnatched);
            updateStatus(`${notSnatched.length} available to download`, 'success');
            log(`Scan complete: ${torrents.length} torrents, ${notSnatched.length} not downloaded`);
        } catch (e) {
            toggle.classList.remove('scanning');
            updateScanRing(0);
            panel.style.display = 'block';
            toggle.classList.add('active');
            updateStatus(`Error: ${e.message}`, 'error');
            log('Scan failed:', e);
        }

        scanBtn.disabled = false;
        scanBtn.textContent = 'Rescan';
    }

    async function startDownload() {
        const torrents = window.kgNotSnatched || [];
        if (torrents.length === 0) return;

        const downloadBtn = document.getElementById('kg-btn-download');
        const scanBtn = document.getElementById('kg-btn-scan');
        downloadBtn.disabled = true;
        scanBtn.disabled = true;

        let downloaded = 0, failed = 0;

        for (let i = 0; i < torrents.length; i++) {
            const torrent = torrents[i];
            if (config.maxDownloadsPerRun > 0 && downloaded >= config.maxDownloadsPerRun) break;

            updateStatus(`Downloading ${i + 1}/${torrents.length}: ${torrent.title.substring(0, 25)}...`, 'working');
            updateProgress((i / torrents.length) * 100);

            try {
                const iframe = document.createElement('iframe');
                iframe.style.display = 'none';
                iframe.src = torrent.downloadUrl;
                document.body.appendChild(iframe);
                downloaded++;
                torrent.isSnatched = true;
                log(`Downloaded [${downloaded}/${torrents.length}]: ${torrent.title}`);
                await delay(config.downloadIntervalMs);
                setTimeout(() => iframe.remove(), 5000);
            } catch (e) {
                failed++;
                log(`Download failed: ${torrent.id}`, e);
            }
        }

        updateProgress(100);
        setTimeout(() => updateProgress(0), 1000);
        updateStatus(`Download complete! Success: ${downloaded}, Failed: ${failed}`, 'success');
        downloadBtn.textContent = 'Done';
        scanBtn.disabled = false;
        highlightCurrentPage(window.kgAllTorrents || []);
    }

    function isActivePage() {
        if (!/\/browse\.php$/i.test(window.location.pathname)) return false;
        return new URLSearchParams(window.location.search).get('fl') === '1';
    }

    function init() {
        createControlPanel();
    }

    function teardown() {
        document.getElementById('kg-fl-panel')?.remove();
        document.getElementById('kg-fl-toggle')?.remove();
    }

    return { isActivePage, init, teardown, applySettings };
    })();

    // --- Request Matcher ---
    const RequestMatcher = (() => {

    let enabled = true;

    function teardown() {
        document.getElementById('kg-request-banner')?.remove();
    }

    function applySettings(next) {
        enabled = Boolean(next?.enabled);
        if (!enabled) teardown();
    }

    function normalizeText(str) {
        return String(str || '').replace(/\s+/g, ' ').trim();
    }

    function findFirstUnfilledRequest(doc) {
        const tables = Array.from(doc.querySelectorAll('table'));
        for (const table of tables) {
            if (!table.querySelector('a[href*="reqdetails.php?id="]')) continue;

            const rows = Array.from(table.querySelectorAll('tr'));
            const headerRow = rows.find((tr) => {
                const text = normalizeText(tr.textContent).toLowerCase();
                return text.includes('request title') && text.includes('filled');
            });
            if (!headerRow) continue;

            const headerCells = Array.from(headerRow.querySelectorAll('th,td')).map((cell) =>
                normalizeText(cell.textContent).toLowerCase()
            );
            const filledIndex = headerCells.findIndex((t) => t === 'filled');
            if (filledIndex < 0) continue;

            for (const row of rows) {
                if (row === headerRow) continue;
                const reqLink = row.querySelector('a[href*="reqdetails.php?id="]');
                if (!reqLink) continue;

                const cells = Array.from(row.querySelectorAll('th,td'));
                const filledText = normalizeText(cells[filledIndex]?.textContent || '');
                if (filledText) continue;

                const href = reqLink.getAttribute('href') || '';
                const url = href ? new URL(href, 'https://karagarga.in/').href : '';
                if (!url) continue;

                return { url, title: normalizeText(reqLink.textContent) };
            }
        }

        return null;
    }

    async function checkForMatch() {
        const href = window.location.href;
        if (!href.startsWith('https://karagarga.in/details.php')) return;
        if (!enabled) return;

        const imdbLink = document.querySelector('a[href*="imdb.com/title/tt"]');
        if (!imdbLink) return;

        const match = imdbLink.href.match(/\/tt(\d+)/);
        if (!match) return;

        const imdbNum = match[1];
        log(`Request Matcher: IMDB ${imdbNum}`);

        try {
            const response = await fetch(`https://karagarga.in/viewrequests.php?search=${imdbNum}`, { credentials: 'include' });
            const doc = new DOMParser().parseFromString(await response.text(), 'text/html');
            const matchInfo = findFirstUnfilledRequest(doc);
            if (!matchInfo) return;

            log(`Request Matcher: unfilled request found: ${matchInfo.title}`);

            const titleElement = document.querySelector('h1, .pager + table td[align="center"] > b');
            if (!titleElement) return;
            if (document.getElementById('kg-request-banner')) return;

            const banner = document.createElement('div');
            banner.id = 'kg-request-banner';
            banner.innerHTML = `
                <style>
                    #kg-request-banner {
                        background: linear-gradient(135deg, #e74c3c, #c0392b);
                        color: white; padding: 8px 15px; margin: 10px 0;
                        border-radius: 4px; font-size: 13px; font-weight: bold;
                        cursor: pointer; display: inline-block;
                        box-shadow: 0 2px 8px rgba(231, 76, 60, 0.4);
                        transition: all 0.2s ease;
                        animation: kg-banner-pulse 2s ease-in-out infinite;
                    }
                    #kg-request-banner:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 4px 15px rgba(231, 76, 60, 0.5);
                    }
                    @keyframes kg-banner-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.85; } }
                </style>
                There is an unfilled request for this title. Click to view.
            `;
            banner.onclick = () => window.open(matchInfo.url, '_blank');
            banner.title = `Request: ${matchInfo.title}`;
            titleElement.parentNode.insertBefore(banner, titleElement);
        } catch (e) {
            log('Request Matcher error:', e);
        }
    }

    function init() {
        checkForMatch();
    }

    return { init, applySettings, teardown };
    })();

    // --- Uploader Tipper ---
    const UploaderTipper = (() => {

    let enabled = true;
    let tipWrapEl = null;
    let tipBtnEl = null;
    let tipMenuEl = null;
    let currentUploader = '';
    let currentUploaderId = null;
    let globalHandlersInstalled = false;

    const DEFAULT_CONFIG = {
        presetsGb: DEFAULT_SETTINGS.uploaderTipper.presetsGb.slice(),
        commentTemplate: DEFAULT_SETTINGS.uploaderTipper.commentTemplate,
    };

    let config = { ...DEFAULT_CONFIG };

    function closeTipMenu() {
        if (!tipWrapEl || !tipBtnEl) return;
        tipWrapEl.classList.remove('kg-tip-open');
        tipBtnEl.setAttribute('aria-expanded', 'false');
    }

    function teardown() {
        closeTipMenu();
        tipWrapEl?.remove();
        tipWrapEl = null;
        tipBtnEl = null;
        tipMenuEl = null;
        currentUploader = '';
        currentUploaderId = null;
        document.getElementById('kg-tip-style')?.remove();
        document.getElementById('kg-tip-notify')?.remove();
    }

    function renderTipMenu() {
        if (!tipMenuEl) return;
        const presetHtml = config.presetsGb
            .map((gb) => `<a class="kg-tip-item" data-gb="${gb}">${gb} GB</a>`)
            .join('');
        tipMenuEl.innerHTML = presetHtml;
    }

    function applySettings(next) {
        enabled = Boolean(next?.enabled);
        config = {
            presetsGb: normalizePresetsGb(next?.presetsGb ?? DEFAULT_CONFIG.presetsGb),
            commentTemplate: normalizeCommentTemplate(next?.commentTemplate ?? DEFAULT_CONFIG.commentTemplate),
        };

        if (!enabled) teardown();
        else renderTipMenu();
    }

    function installGlobalHandlers() {
        if (globalHandlersInstalled) return;
        globalHandlersInstalled = true;

        document.addEventListener('click', (e) => {
            if (!tipWrapEl || !tipWrapEl.classList.contains('kg-tip-open')) return;
            if (tipWrapEl.contains(e.target)) return;
            closeTipMenu();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key !== 'Escape') return;
            if (!tipWrapEl || !tipWrapEl.classList.contains('kg-tip-open')) return;
            closeTipMenu();
        });
    }

    async function sendTip({ userId, username, gb, comment }) {
        const body = new URLSearchParams();
        body.set('sub2', 'y');
        body.set('userto', String(userId));
        body.set('transferamount', String(gb));
        body.set('comment', comment || '');

        try {
            const res = await fetch('https://karagarga.in/bonustransfer.php', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
                body,
            });

            const html = await res.text();
            const doc = new DOMParser().parseFromString(html, 'text/html');
            const h2 = doc.querySelector('h2')?.textContent?.replace(/\s+/g, ' ').trim() || '';
            const embedded = doc.querySelector('td.embedded')?.textContent?.replace(/\s+/g, ' ').trim() || '';
            const text = (doc.body?.innerText || '').replace(/\s+/g, ' ').trim();

            const hasErrorHeading = /^error$/i.test(h2);
            const hasErrorText = /\berror\b/i.test(embedded) || /\berror\b/i.test(text);
            const errorMsg = embedded || (hasErrorHeading ? h2 : '');

            if (!res.ok || hasErrorHeading || hasErrorText) {
                log('Tip transfer failed', { status: res.status, h2, embedded });
                return { ok: false, msg: errorMsg || `Transfer failed: HTTP ${res.status}` };
            }

            const transferMatch = text.match(/(\d+)\s*GB\s*transferred\s*to\s*([a-z0-9_]+)/i);
            if (transferMatch) return { ok: true, msg: transferMatch[0] };

            return { ok: true, msg: `Submitted ${gb} GB to ${username} (check bonus history)` };
        } catch (e) {
            return { ok: false, msg: e.message };
        }
    }

    function showNotify(msg, ok) {
        document.getElementById('kg-tip-notify')?.remove();
        const el = document.createElement('div');
        el.id = 'kg-tip-notify';
        el.style.cssText = `position:fixed;top:20px;right:20px;padding:12px 20px;border-radius:6px;font:bold 13px Verdana;z-index:100000;color:#fff;background:${ok ? '#27ae60' : '#e74c3c'}`;
        el.textContent = msg;
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 3000);
    }

    function initUploaderTipper() {
        const path = window.location.pathname;
        if (!path.includes('details.php') || path.includes('reqdetails.php')) return;
        if (!enabled) return;

        const allLinks = document.querySelectorAll('a[href*="userdetails.php"]');

        let targetLink = null;
        for (const link of allLinks) {
            const prevText = link.previousSibling?.textContent || '';
            if (prevText.includes('Upped by')) {
                targetLink = link;
                break;
            }
            const parentPrevText = link.parentElement?.previousElementSibling?.textContent?.trim() || '';
            if (parentPrevText === 'Upped by') {
                targetLink = link;
                break;
            }
        }

        if (!targetLink) {
            log('Uploader Tipper: uploader link not found');
            return;
        }

        const uploader = targetLink.textContent.trim();
        const uploaderIdMatch = targetLink.href.match(/[?&]id=(\d+)/);
        const uploaderId = uploaderIdMatch ? uploaderIdMatch[1] : null;
        log(`Uploader Tipper: ${uploader}`);

        currentUploader = uploader;
        currentUploaderId = uploaderId;

        if (tipWrapEl && document.body.contains(tipWrapEl)) {
            renderTipMenu();
            installGlobalHandlers();
            return;
        }

        if (!document.getElementById('kg-tip-style')) {
            const style = document.createElement('style');
            style.id = 'kg-tip-style';
            style.textContent = `
                .kg-tip-wrap {
                    display: inline-block;
                    position: relative;
                    margin-left: 8px;
                    vertical-align: middle;
                }
                .kg-tip-btn {
                    background: linear-gradient(135deg, #f5a623, #e8930c);
                    color: #fff;
                    border: none;
                    padding: 2px 8px;
                    font: bold 10px Verdana, sans-serif;
                    border-radius: 3px;
                    cursor: pointer;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.2);
                    transition: all 0.2s ease;
                }
                .kg-tip-btn:hover {
                    background: linear-gradient(135deg, #ffb840, #f5a623);
                    transform: translateY(-1px);
                    box-shadow: 0 2px 6px rgba(245, 166, 35, 0.4);
                }
                .kg-tip-btn:disabled { background: #999; cursor: wait; }
                .kg-tip-menu {
                    display: none;
                    position: absolute;
                    top: 100%;
                    left: 0;
                    margin-top: 4px;
                    background: #fff;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    box-shadow: 0 3px 12px rgba(0,0,0,0.15);
                    z-index: 1000;
                    min-width: 100px;
                    overflow: hidden;
                }
                .kg-tip-wrap.kg-tip-open .kg-tip-menu { display: block; }
                .kg-tip-item {
                    display: block;
                    padding: 6px 12px;
                    font: 11px Verdana, sans-serif;
                    color: #333;
                    text-decoration: none;
                    border-bottom: 1px solid #eee;
                    transition: background 0.15s ease;
                    cursor: pointer;
                }
                .kg-tip-item:last-child { border-bottom: none; }
                .kg-tip-item:hover { background: #fff8e8; color: #e8930c; }
            `;
            document.head.appendChild(style);
        }

        const existingWrap = targetLink.parentNode.querySelector('.kg-tip-wrap');
        if (existingWrap) {
            tipWrapEl = existingWrap;
            tipBtnEl = existingWrap.querySelector('.kg-tip-btn');
            tipMenuEl = existingWrap.querySelector('.kg-tip-menu');
        } else {
            const tipWrap = document.createElement('span');
            tipWrap.className = 'kg-tip-wrap';
            tipWrap.innerHTML = `
                <button class="kg-tip-btn">Tip</button>
                <div class="kg-tip-menu" role="menu"></div>
            `;

            targetLink.parentNode.insertBefore(tipWrap, targetLink.nextSibling);
            tipWrapEl = tipWrap;
            tipBtnEl = tipWrap.querySelector('.kg-tip-btn');
            tipMenuEl = tipWrap.querySelector('.kg-tip-menu');
        }

        if (!tipWrapEl || !tipBtnEl || !tipMenuEl) return;

        tipBtnEl.type = 'button';
        tipBtnEl.textContent = 'Tip';
        tipBtnEl.setAttribute('aria-haspopup', 'menu');
        tipBtnEl.setAttribute('aria-expanded', 'false');

        renderTipMenu();
        installGlobalHandlers();

        tipBtnEl.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            const isOpen = tipWrapEl.classList.toggle('kg-tip-open');
            tipBtnEl.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        };

        tipMenuEl.onclick = async (e) => {
            const item = e.target.closest('.kg-tip-item');
            if (!item) return;
            e.preventDefault();
            e.stopPropagation();
            closeTipMenu();

            const gb = item.dataset.gb;

            if (!/^\d+$/.test(gb) || Number(gb) <= 0) {
                showNotify('Invalid amount', false);
                return;
            }
            if (!currentUploaderId) {
                showNotify('Cannot resolve uploader user id', false);
                return;
            }

            const torrentUrl = `${location.origin}${location.pathname}${location.search}`;
            const comment = config.commentTemplate.split('{url}').join(torrentUrl).slice(0, 240);

            tipBtnEl.disabled = true;
            const prevText = tipBtnEl.textContent;
            tipBtnEl.textContent = 'Sending...';
            const r = await sendTip({ userId: currentUploaderId, username: currentUploader, gb, comment });
            tipBtnEl.disabled = false;
            tipBtnEl.textContent = prevText;
            showNotify(r.msg, r.ok);
        };

        log('Uploader Tipper: button injected');
    }

    function init() {
        initUploaderTipper();
    }

    return { init, applySettings, teardown };
    })();

    // --- Upgrade Announcer ---
    const UpgradeAnnouncer = (() => {
        const IDS = {
            style: 'kg-upgrade-style',
            btn: 'kg-upgrade-btn',
            btnWrap: 'kg-upgrade-btnwrap',
            row: 'kg-upgrade-row',
            link: 'kg-upgrade-link',
            approve: 'kg-upgrade-approve',
            approveList: 'kg-upgrade-approve-list',
            confirm: 'kg-upgrade-confirm',
        };

        const UPGRADE_TEMPLATE_HEAD = `[center][quote]
[b][color=MediumSeaGreen]♻ UPGRADE[/color][/b] | [b]Replace:[/b] [url=REPLACE_WITH_LINK]Old Torrent ID/Link[/url]`;
        const UPGRADE_TEMPLATE_TAIL = `
[/quote][/center]`;

        let enabled = true;
        let injected = false;
        let retryTimer = null;

        const DEFAULT_CONFIG = {
            commonMods: DEFAULT_SETTINGS.upgradeAnnouncer.commonMods.slice(),
        };

        let config = { ...DEFAULT_CONFIG };

        let upgradeBtnEl = null;
        let rowEl = null;
        let linkEl = null;
        let approveEl = null;
        let approveListEl = null;
        let confirmEl = null;

        function isActivePage() {
            if (!/\/upload\.php$/i.test(location.pathname)) return false;
            if (!/KG\s*-\s*Upload\s*2/i.test(document.title || '')) return false;
            return Boolean(document.getElementById('bbcodetextarea') || document.querySelector('textarea[name="descr"]'));
        }

        function ensureStyle() {
            if (document.getElementById(IDS.style)) return;
            const style = document.createElement('style');
            style.id = IDS.style;
            style.textContent = `
                #${IDS.row} {
                    display: none;
                    margin: 6px 0 8px;
                    align-items: center;
                    gap: 6px;
                    flex-wrap: nowrap;
                    font: 11px Verdana, Arial, sans-serif;
                    color: #222;
                }
                #${IDS.row} .kg-upgrade-label { font-weight: 700; margin-right: 2px; }
                #${IDS.row} input[type="text"] {
                    font: 11px Verdana, Arial, sans-serif;
                    padding: 2px 6px;
                    border: 1px solid #9a9a9a;
                    border-radius: 4px;
                    outline: none;
                    background: #fff;
                }
                #${IDS.row} input[type="text"]:focus {
                    border-color: #4b78ff;
                    box-shadow: 0 0 0 2px rgba(75, 120, 255, 0.18);
                }
                #${IDS.link} { flex: 1 1 auto; min-width: 140px; width: auto; }
                #${IDS.approve} { flex: 0 0 128px; width: 128px; }
                #${IDS.confirm} { margin-left: auto; flex: 0 0 auto; }
                #${IDS.btnWrap} { white-space: nowrap; display: inline-block; vertical-align: middle; }
            `;
            document.head.appendChild(style);
        }

        function renderCommonMods() {
            if (!approveListEl) return;
            approveListEl.innerHTML = '';
            for (const mod of config.commonMods) {
                const option = document.createElement('option');
                option.value = mod;
                approveListEl.appendChild(option);
            }
        }

        function normalizeOldTorrentLink(rawInput) {
            const raw = String(rawInput || '').trim();
            if (!raw) return '';

            const idOnlyMatch = raw.match(/^id=(\d+)$/i);
            if (idOnlyMatch) return `https://karagarga.in/details.php?id=${idOnlyMatch[1]}`;
            if (/^\d+$/.test(raw)) return `https://karagarga.in/details.php?id=${raw}`;

            const looksLikeDetailsPath = /^\/?details\.php\?id=\d+/i.test(raw);
            const looksLikeUrl = /^https?:\/\//i.test(raw);

            if (looksLikeUrl || looksLikeDetailsPath) {
                try {
                    const u = new URL(raw, location.origin);

                    if (/(\.|^)karagarga\.in$/i.test(u.hostname)) u.protocol = 'https:';

                    u.searchParams.delete('dllist');
                    if ((u.hash || '').toLowerCase() === '#seeders') u.hash = '';

                    return u.toString();
                } catch (_) {
                    // Fall through to string-based cleaning.
                }
            }

            return raw
                .replace(/&dllist=1(?=#seeders$)/i, '')
                .replace(/#seeders$/i, '');
        }

        function buildUpgradeBbcode({ replacesLink, approvedBy }) {
            const link = normalizeOldTorrentLink(replacesLink);
            const by = String(approvedBy || '').trim();

            const replaced = (UPGRADE_TEMPLATE_HEAD)
                .replaceAll('REPLACE_WITH_LINK', link || 'REPLACE_WITH_LINK')
                .replaceAll('Old Torrent ID/Link', link || 'Old Torrent ID/Link');

            const approved = by ? ` | [size=2]Approved by [b]${by}[/b][/size]` : '';
            return `${replaced}${approved}${UPGRADE_TEMPLATE_TAIL}`;
        }

        function insertAtTop(textarea, text) {
            const snippet = String(text || '').trim();
            if (!textarea || !snippet) return false;

            const original = textarea.value || '';
            const insertion = `${snippet}\n\n`;
            textarea.value = insertion + original;

            try {
                textarea.dispatchEvent(new Event('input', { bubbles: true }));
                textarea.dispatchEvent(new Event('change', { bubbles: true }));
            } catch (_) {}

            try {
                textarea.focus();
                textarea.setSelectionRange(insertion.length, insertion.length);
            } catch (_) {}

            return true;
        }

        function setRowOpen(open) {
            if (!rowEl) return;
            rowEl.style.display = open ? 'flex' : 'none';
            if (open) linkEl?.focus();
        }

        function toggleRow() {
            if (!rowEl) return;
            setRowOpen(rowEl.style.display === 'none' || !rowEl.style.display);
        }

        function findNextBrSibling(el) {
            let n = el?.nextSibling || null;
            while (n) {
                if (n.nodeType === Node.ELEMENT_NODE && n.tagName === 'BR') return n;
                n = n.nextSibling;
            }
            return null;
        }

        function inject() {
            if (injected) return true;

            const compose = document.getElementById('bbcodecompose');
            const spoilerBtn = compose?.querySelector('input[type="button"].codebuttons[name="SPOILER"]') || null;
            const textarea = document.getElementById('bbcodetextarea') || document.querySelector('textarea[name="descr"]');
            if (!compose || !spoilerBtn || !textarea) return false;

            if (document.getElementById(IDS.btn) || document.getElementById(IDS.row)) {
                injected = true;
                return true;
            }

            ensureStyle();

            const btn = document.createElement('input');
            btn.id = IDS.btn;
            btn.type = 'button';
            btn.name = 'UPGRADE';
            btn.className = spoilerBtn.className || 'codebuttons';
            btn.value = ' UPGRADE ';
            btn.style.marginLeft = '4px';
            btn.style.display = 'inline-block';
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleRow();
            });

            let wrap = document.getElementById(IDS.btnWrap);
            if (!wrap) {
                wrap = document.createElement('span');
                wrap.id = IDS.btnWrap;
                spoilerBtn.insertAdjacentElement('beforebegin', wrap);
            } else if (!wrap.contains(spoilerBtn)) {
                spoilerBtn.insertAdjacentElement('beforebegin', wrap);
            }
            if (!wrap.contains(spoilerBtn)) wrap.appendChild(spoilerBtn);
            wrap.appendChild(btn);

            const row = document.createElement('div');
            row.id = IDS.row;
            row.innerHTML = `
                <span class="kg-upgrade-label">Upgrade:</span>
                <input id="${IDS.link}" type="text" placeholder="Old torrent link / ID" size="30" />
                <input id="${IDS.approve}" type="text" placeholder="Approved by" size="16" list="${IDS.approveList}" />
                <datalist id="${IDS.approveList}"></datalist>
                <input id="${IDS.confirm}" type="button" class="${btn.className}" value=" CONFIRM " />
            `;

            const brAfterButtonsLine = findNextBrSibling(wrap) || compose.querySelector('br');
            (brAfterButtonsLine || wrap).insertAdjacentElement('afterend', row);

            const linkInput = document.getElementById(IDS.link);
            const approveInput = document.getElementById(IDS.approve);
            const approveList = document.getElementById(IDS.approveList);
            const confirmBtn = document.getElementById(IDS.confirm);

            if (!linkInput || !approveInput || !approveList || !confirmBtn) {
                row.remove();
                btn.remove();
                return false;
            }

            approveListEl = approveList;
            renderCommonMods();

            const onConfirm = (e) => {
                e?.preventDefault?.();
                e?.stopPropagation?.();

                const bbcode = buildUpgradeBbcode({
                    replacesLink: linkInput.value,
                    approvedBy: approveInput.value,
                });

                insertAtTop(textarea, bbcode);
            };

            confirmBtn.addEventListener('click', onConfirm);
            [linkInput, approveInput].forEach((el) => {
                el.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') onConfirm(e);
                    if (e.key === 'Escape') setRowOpen(false);
                });
            });

            upgradeBtnEl = btn;
            rowEl = row;
            linkEl = linkInput;
            approveEl = approveInput;
            approveListEl = approveList;
            confirmEl = confirmBtn;
            injected = true;
            return true;
        }

        function init() {
            if (!enabled) return;
            if (!isActivePage()) return;
            if (inject()) return;

            let attempts = 0;
            const tick = () => {
                if (!enabled || injected || !isActivePage()) return;
                attempts += 1;
                if (inject()) return;
                if (attempts >= 30) return;
                retryTimer = setTimeout(tick, 250);
            };

            retryTimer = setTimeout(tick, 250);
        }

        function teardown() {
            if (retryTimer) clearTimeout(retryTimer);
            retryTimer = null;
            injected = false;

            upgradeBtnEl?.remove();
            rowEl?.remove();
            document.getElementById(IDS.style)?.remove();
            const wrap = document.getElementById(IDS.btnWrap);
            if (wrap && wrap.parentNode) {
                while (wrap.firstChild) wrap.parentNode.insertBefore(wrap.firstChild, wrap);
                wrap.remove();
            }

            upgradeBtnEl = null;
            rowEl = null;
            linkEl = null;
            approveEl = null;
            approveListEl = null;
            confirmEl = null;
        }

        function applySettings(next) {
            enabled = Boolean(next?.enabled);
            config = {
                commonMods: normalizeCommonMods(next?.commonMods ?? DEFAULT_CONFIG.commonMods),
            };
            if (injected) renderCommonMods();
            if (!enabled) teardown();
        }

        return { init, applySettings, teardown };
    })();

    function applySettingsToModules(next) {
        settings = sanitizeSettings(next);

        FreeleechDownloader.applySettings(settings.fl);
        RequestMatcher.applySettings(settings.requestMatcher);
        UploaderTipper.applySettings(settings.uploaderTipper);
        UpgradeAnnouncer.applySettings(settings.upgradeAnnouncer);

        if (settings.fl.enabled && FreeleechDownloader.isActivePage()) {
            FreeleechDownloader.init();
        } else {
            FreeleechDownloader.teardown();
        }

        if (settings.requestMatcher.enabled) {
            RequestMatcher.init();
        } else {
            RequestMatcher.teardown();
        }

        if (settings.uploaderTipper.enabled) {
            UploaderTipper.init();
        } else {
            UploaderTipper.teardown();
        }

        if (settings.upgradeAnnouncer.enabled) {
            UpgradeAnnouncer.init();
        } else {
            UpgradeAnnouncer.teardown();
        }

        SettingsUI.refreshPosition();
    }

    function init() {
        log('KG Helper v1.0');
        SettingsUI.init({ onChange: (next) => applySettingsToModules(next) });
        applySettingsToModules(settings);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
