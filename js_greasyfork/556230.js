// ==UserScript==
// @name         Grok Ultimate Manager + v15.8 Side Panel 
// @namespace    http://tampermonkey.net/
// @version      45
// @description  Complete Grok Tool: Main Manager (History/Saved) AND the specific v15.8 Side Panel (Auto-Retry, Toast Removal, Snippets).
// @author       You
// @license      MIT
// @match        https://grok.com/*
// @match        https://*.grok.com/*
// @match        https://grok.x.ai/*
// @match        https://*.grok.x.ai/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/556230/Grok%20Ultimate%20Manager%20%2B%20v158%20Side%20Panel.user.js
// @updateURL https://update.greasyfork.org/scripts/556230/Grok%20Ultimate%20Manager%20%2B%20v158%20Side%20Panel.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (window.grokPromptManagerLoaded) return;
    window.grokPromptManagerLoaded = true;

    function initScript() {
        // --- MODERN CSS (MERGED) ---
        GM_addStyle(`
            :root {
                --grok-bg: #000000;
                --grok-surface: #16181c;
                --grok-surface-trans: rgba(22, 24, 28, 0.95);
                --grok-surface-hover: #1d1f23;
                --grok-border: #2f3336;
                --grok-primary: #1d9bf0;
                --grok-primary-hover: #1a8cd8;
                --grok-text-main: #e7e9ea;
                --grok-text-muted: #71767b;
                --grok-danger: #f4212e;
                --grok-warning: #ffd400;
                --grok-success: #00ba7c;
                --grok-image-history: #ff8c00;
                --grok-radius: 16px;
            }
            /* --- MAIN MODAL STYLES (Existing) --- */
            .grok-prompt-overlay { position: fixed; inset: 0; z-index: 10000; display: none; opacity: 0; transition: opacity 0.2s ease; isolation: isolate; }
            .grok-prompt-overlay.open { display: flex; opacity: 1; pointer-events: auto; }
            .grok-prompt-overlay.mode-centered { background: rgba(0, 0, 0, 0.4); backdrop-filter: blur(4px); align-items: center; justify-content: center; }
            .grok-prompt-overlay.mode-centered .grok-prompt-modal { position: relative; width: 1463px; height: 809px; transform: scale(0.95); transition: transform 0.2s; }
            .grok-prompt-overlay.mode-centered.open .grok-prompt-modal { transform: scale(1); }
            .grok-prompt-overlay.mode-floating { background: transparent; pointer-events: none; display: none; }
            .grok-prompt-overlay.mode-floating.open { display: block; }
            .grok-prompt-overlay.mode-floating .grok-prompt-modal {
                position: fixed; pointer-events: auto;
                box-shadow: 0 0 0 1px rgba(255,255,255,0.1), 0 20px 60px rgba(0,0,0,0.8);
                backdrop-filter: blur(10px);
            }
            .grok-prompt-modal {
                background: var(--grok-surface-trans);
                border: 1px solid var(--grok-border);
                border-radius: var(--grok-radius);
                display: flex; flex-direction: column;
                color: var(--grok-text-main);
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                min-width: 380px; min-height: 200px;
                overflow: hidden;
            }
            .grok-prompt-header { display: flex; align-items: center; justify-content: space-between; padding: 14px 20px; border-bottom: 1px solid var(--grok-border); cursor: move; background: rgba(255,255,255,0.02); user-select: none; }
            .grok-prompt-title { font-size: 16px; font-weight: 700; display: flex; align-items: center; gap: 10px; }
            .grok-header-actions { display: flex; align-items: center; gap: 8px; }
            .grok-icon-btn { background: transparent; border: none; color: var(--grok-text-muted); cursor: pointer; padding: 6px; border-radius: 6px; transition: all 0.2s; display: flex; align-items: center; justify-content: center; }
            .grok-icon-btn:hover { background: rgba(255,255,255,0.1); color: var(--grok-text-main); }
            .grok-icon-btn.close:hover { background: rgba(239, 68, 68, 0.15); color: var(--grok-danger); }
            .grok-prompt-tabs { display: flex; padding: 0 16px; border-bottom: 1px solid var(--grok-border); background: var(--grok-bg); overflow-x: auto; }
            .grok-prompt-tab { padding: 16px; background: none; border: none; color: var(--grok-text-muted); font-weight: 600; font-size: 14px; cursor: pointer; border-bottom: 3px solid transparent; transition: all 0.2s; white-space: nowrap; }
            .grok-prompt-tab:hover { color: var(--grok-text-main); background: rgba(255,255,255,0.03); }
            .grok-prompt-tab.active { color: var(--grok-primary); border-bottom-color: var(--grok-primary); }
            .grok-prompt-content { flex: 1; overflow-y: auto; padding: 24px; scroll-behavior: smooth; }
            .grok-prompt-content::-webkit-scrollbar { width: 8px; }
            .grok-prompt-content::-webkit-scrollbar-track { background: transparent; }
            .grok-prompt-content::-webkit-scrollbar-thumb { background: var(--grok-border); border-radius: 4px; }
            .grok-prompt-form { display: flex; flex-direction: column; gap: 20px; }
            .grok-prompt-label { display: block; font-size: 13px; font-weight: 600; color: var(--grok-text-muted); margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px; }
            .grok-prompt-select, .grok-prompt-textarea, .grok-prompt-category-input { width: 100%; background: black; border: 1px solid var(--grok-border); border-radius: 8px; padding: 12px; color: var(--grok-text-main); font-size: 15px; font-family: inherit; transition: border-color 0.2s, box-shadow 0.2s; box-sizing: border-box; }
            .grok-prompt-select:focus, .grok-prompt-textarea:focus, .grok-prompt-category-input:focus { outline: none; border-color: var(--grok-primary); box-shadow: 0 0 0 2px rgba(29, 155, 240, 0.2); }
            .grok-prompt-textarea { height: 140px; line-height: 1.5; resize: vertical; }
            .grok-form-actions { display: flex; gap: 10px; align-items: center; }
            .grok-prompt-button, .grok-prompt-add-btn { background: var(--grok-primary); color: white; border: none; padding: 12px 20px; border-radius: 24px; font-weight: 700; cursor: pointer; transition: transform 0.1s, background 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px; flex: 1; }
            .grok-prompt-button:hover { background: var(--grok-primary-hover); transform: translateY(-1px); }
            .grok-cancel-btn { background: rgba(244, 33, 46, 0.1); color: var(--grok-danger); border: 1px solid transparent; padding: 12px 20px; border-radius: 24px; font-weight: 700; cursor: pointer; display: none; align-items: center; justify-content: center;}
            .grok-cancel-btn:hover { background: rgba(244, 33, 46, 0.2); }
            .grok-prompt-list { display: flex; flex-direction: column; gap: 12px; }
            .grok-prompt-item { display: flex; gap: 12px; align-items: flex-start; background: transparent; border: 1px solid var(--grok-border); border-radius: 12px; padding: 16px; transition: background 0.2s, border-color 0.2s; }
            .grok-prompt-item:hover { background: rgba(255,255,255,0.02); border-color: #555; }
            .grok-item-check-wrapper { padding-top: 4px; display: flex; align-items: center; justify-content: center; }
            .grok-item-checkbox { width: 18px; height: 18px; accent-color: var(--grok-primary); cursor: pointer; }
            .grok-item-content-wrapper { flex: 1; width: 100%; min-width: 0; }
            .grok-prompt-item-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 15px; margin-bottom: 10px; }
            .grok-prompt-item-text { flex: 1; color: var(--grok-text-main); line-height: 1.5; font-size: 15px; white-space: pre-wrap; }
            .grok-prompt-item-delete { opacity: 0; color: var(--grok-text-muted); background: none; border: none; cursor: pointer; transition: opacity 0.2s, color 0.2s; padding: 4px; }
            .grok-prompt-item:hover .grok-prompt-item-delete { opacity: 1; }
            .grok-prompt-item-delete:hover { color: var(--grok-danger); }
            .grok-prompt-item-footer { display: flex; align-items: center; gap: 12px; margin-top: 12px; flex-wrap: wrap; }
            .grok-prompt-source-alt { font-size: 12px; color: var(--grok-text-muted); margin-top: 8px; padding: 6px 10px; background: rgba(255, 140, 0, 0.08); border-left: 3px solid var(--grok-image-history); border-radius: 4px; line-height: 1.4; }
            .grok-prompt-source-alt strong { color: var(--grok-image-history); }
            .grok-prompt-category-badge { background: rgba(29, 155, 240, 0.1); color: var(--grok-primary); padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: 700; text-transform: uppercase; flex-shrink: 0; }
            .grok-prompt-category-badge.image-tag { background: rgba(255, 212, 0, 0.1); color: var(--grok-warning); }
            .grok-prompt-category-badge.auto { background: rgba(0, 186, 124, 0.1); color: var(--grok-success); }
            .grok-prompt-category-badge.auto.image-tag { background: rgba(255, 140, 0, 0.15); color: var(--grok-image-history); border: 1px solid rgba(255, 140, 0, 0.2); }
            .grok-prompt-copy-btn { flex-shrink: 0; background: transparent; border: 1px solid var(--grok-border); color: var(--grok-text-muted); padding: 6px 12px; border-radius: 16px; font-size: 12px; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: all 0.2s; }
            .grok-prompt-copy-btn:hover { border-color: var(--grok-text-main); color: var(--grok-text-main); background: rgba(255,255,255,0.05); }
            .grok-split-view { display: flex; gap: 24px; width: 100%; flex-wrap: wrap; }
            .grok-tag-section { flex: 1; min-width: 300px; background: rgba(255,255,255,0.02); border: 1px solid var(--grok-border); border-radius: 12px; padding: 20px; }
            .grok-tag-header { font-size: 16px; font-weight: 700; color: var(--grok-text-main); margin-bottom: 15px; border-bottom: 1px solid var(--grok-border); padding-bottom: 10px; display: flex; align-items: center; gap: 8px; }
            .grok-tag-header svg { color: var(--grok-text-muted); }
            .grok-video-section { margin-top: 12px; background: rgba(255, 255, 255, 0.03); padding: 10px; border-radius: 8px; border: 1px dashed var(--grok-border); }
            .grok-video-input { width: 100%; background: transparent; border: none; color: var(--grok-text-muted); font-size: 13px; font-family: inherit; resize: none; outline: none; height: 32px; transition: height 0.2s; }
            .grok-video-input:focus { color: var(--grok-text-main); height: 60px; }
            .grok-video-label { font-size: 11px; color: var(--grok-primary); font-weight: 700; text-transform: uppercase; margin-bottom: 4px; display: block; }
            .grok-image-item-grid { display: flex; gap: 16px; }
            .grok-image-content-col { flex: 1; }
            .grok-image-preview-col { width: 120px; display: flex; flex-direction: column; gap: 8px; align-items: center; justify-content: flex-start; }
            .grok-snapshot-thumb { width: 100%; height: 100px; object-fit: cover; border-radius: 8px; border: 1px solid var(--grok-border); cursor: zoom-in; transition: transform 0.2s; background: #000; }
            .grok-snapshot-thumb:hover { transform: scale(1.05); border-color: var(--grok-primary); }
            .grok-snapshot-upload-btn { position: relative; width: 100%; height: 100px; border: 1px dashed var(--grok-border); border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-direction: column; color: var(--grok-text-muted); cursor: pointer; font-size: 12px; transition: 0.2s; background: rgba(255,255,255,0.02); }
            .grok-snapshot-input { position: absolute; inset: 0; opacity: 0; cursor: pointer; }
            .grok-snapshot-del { background: rgba(0,0,0,0.7); color: white; border: none; border-radius: 50%; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; cursor: pointer; position: absolute; top: -5px; right: -5px; font-size: 12px; line-height: 1; }
            .grok-snapshot-wrapper { position: relative; width: 100%; }
            .grok-mod-wrapper { display: flex; align-items: center; gap: 10px; flex-grow: 1; min-width: 140px; max-width: 300px; background: rgba(0,0,0,0.2); padding: 4px 10px; border-radius: 20px; border: 1px solid var(--grok-border); margin-right: 8px; }
            .grok-mod-label { font-size: 10px; text-transform: uppercase; color: var(--grok-text-muted); font-weight: 700; white-space: nowrap; }
            .grok-mod-slider { -webkit-appearance: none; appearance: none; flex: 1; height: 4px; background: #333; border-radius: 2px; outline: none; cursor: ew-resize; }
            .grok-mod-slider::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 14px; height: 14px; background: var(--grok-text-main); border-radius: 50%; cursor: pointer; transition: 0.2s; }
            .grok-mod-val { font-size: 12px; font-weight: 700; min-width: 35px; text-align: right; font-variant-numeric: tabular-nums; }
            .grok-mod-val.low { color: var(--grok-danger); }
            .grok-mod-val.med { color: var(--grok-warning); }
            .grok-mod-val.high { color: var(--grok-success); }
            .grok-stats-bar-container { display: flex; align-items: center; gap: 10px; flex-grow: 1; min-width: 140px; margin-right: 8px; background: rgba(0,0,0,0.2); padding: 4px 10px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.05); }
            .grok-stats-pill { font-size: 10px; font-weight: 700; text-transform: uppercase; padding: 3px 6px; border-radius: 4px; color: #fff; white-space: nowrap; }
            .grok-stats-pill.success { color: var(--grok-success); background: rgba(0, 186, 124, 0.15); }
            .grok-stats-pill.fail { color: var(--grok-danger); background: rgba(244, 33, 46, 0.15); }
            .grok-stats-text { font-size: 11px; color: var(--grok-text-muted); font-variant-numeric: tabular-nums; white-space: nowrap; }
            .grok-success-rate-bar { flex: 1; height: 4px; background: #333; border-radius: 2px; overflow: hidden; position: relative; min-width: 40px; }
            .grok-success-rate-fill { height: 100%; background: var(--grok-success); transition: width 0.3s; }
            .grok-toast-container { position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); display: flex; flex-direction: column; gap: 8px; z-index: 11000; pointer-events: none; }
            .grok-toast { background: var(--grok-primary); color: white; padding: 10px 20px; border-radius: 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.3); font-weight: 600; font-size: 14px; animation: slideUpFade 0.3s ease forwards; display: flex; align-items: center; gap: 8px; }
            @keyframes slideUpFade { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            .grok-prompt-category-list { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }
            .grok-prompt-category-tag { background: var(--grok-surface-hover); border: 1px solid var(--grok-border); color: var(--grok-text-main); padding: 8px 14px; border-radius: 20px; font-size: 13px; display: flex; align-items: center; gap: 8px; }
            .grok-prompt-category-tag.image-type { border-color: rgba(255, 212, 0, 0.3); color: #ffeeaa; }
            .grok-prompt-resize-handle {
                position: absolute; width: 24px; height: 24px; right: 0; bottom: 0; cursor: se-resize; z-index: 10;
                background: linear-gradient(135deg, transparent 50%, #555 50%, #555 55%, transparent 55%, transparent 70%, #555 70%, #555 75%, transparent 75%);
                opacity: 0.7; border-bottom-right-radius: var(--grok-radius);
            }
            .grok-prompt-resize-handle:hover { opacity: 1; }
            .grok-checkbox-wrapper { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; padding: 16px; background: rgba(255,255,255,0.03); border-radius: 12px; }
            .grok-checkbox { width: 20px; height: 20px; accent-color: var(--grok-primary); cursor: pointer; }
            .grok-keybind-wrapper { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; background: black; border: 1px solid var(--grok-border); padding: 10px; border-radius: 8px; }
            .grok-keybind-display { font-family: monospace; background: #222; color: var(--grok-primary); padding: 4px 8px; border-radius: 4px; border: 1px solid #333; min-width: 80px; text-align: center; font-weight: 700; }
            .grok-keybind-btn { background: var(--grok-surface-hover); border: 1px solid var(--grok-border); color: white; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px; }
            .grok-keybind-btn.recording { background: var(--grok-danger); border-color: var(--grok-danger); animation: pulse 1s infinite; }
            @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.7; } 100% { opacity: 1; } }
            .grok-info-box {
                background: rgba(29, 155, 240, 0.08); border: 1px solid rgba(29, 155, 240, 0.3);
                border-radius: 8px; padding: 12px; margin-bottom: 20px; display: flex; flex-direction: column; gap: 10px;
            }
            .grok-info-icon { color: var(--grok-primary); flex-shrink: 0; }
            .grok-lightbox { position: fixed; inset: 0; z-index: 12000; background: rgba(0,0,0,0.9); display: none; align-items: center; justify-content: center; cursor: zoom-out; }
            .grok-lightbox.open { display: flex; animation: fadeIn 0.2s; }
            .grok-lightbox img { max-width: 90%; max-height: 90%; border-radius: 4px; box-shadow: 0 0 50px rgba(0,0,0,0.5); }
            .grok-bulk-bar { display: flex; justify-content: space-between; align-items: center; padding: 10px 16px; background: rgba(29, 155, 240, 0.05); border: 1px solid var(--grok-border); border-radius: 12px; margin-bottom: 16px; flex-wrap: wrap; gap:10px; }
            .grok-control-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 10px; }
            .grok-filter-group { display: flex; gap: 6px; flex-wrap: wrap; }
            .grok-sort-group { display: flex; gap: 4px; align-items: center; padding-left: 10px; border-left: 1px solid var(--grok-border); }
            .grok-prompt-filter-btn { background: transparent; border: 1px solid var(--grok-border); color: var(--grok-text-muted); padding: 6px 14px; border-radius: 20px; cursor: pointer; font-size: 13px; font-weight: 500; transition: 0.2s; }
            .grok-prompt-filter-btn.active { background: var(--grok-primary); border-color: var(--grok-primary); color: white; }
            .grok-prompt-sort-btn { background: transparent; border: none; color: var(--grok-text-muted); padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 11px; font-weight: 600; text-transform: uppercase; transition: 0.2s; }
            .grok-prompt-sort-btn:hover { color: var(--grok-text-main); background: rgba(255,255,255,0.05); }
            .grok-prompt-sort-btn.active { color: var(--grok-primary); background: rgba(29, 155, 240, 0.1); }
            .grok-bulk-delete-btn { background: rgba(244, 33, 46, 0.1); color: var(--grok-danger); border: 1px solid transparent; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 700; cursor: pointer; transition: 0.2s; display: flex; align-items: center; gap: 6px;}
            .grok-bulk-delete-btn:disabled { opacity: 0.5; cursor: not-allowed; background: transparent; color: var(--grok-text-muted); }
            /* CLEAN MODE (Hide Controls) */
            body.grok-clean-mode button[aria-label="More options"],
            body.grok-clean-mode div[aria-label="Text alignment"],
            body.grok-clean-mode button:has(.lucide-volume-off),
            body.grok-clean-mode button:has(.lucide-volume-2),
            body.grok-clean-mode button:has(.lucide-image) {
                display: none !important;
            }
            .grok-num-input { background: #000; border: 1px solid var(--grok-border); color: white; padding: 4px 8px; border-radius: 4px; width: 60px; text-align: center; }

            /* --- SIDE PANEL STYLES (v15.8) --- */
            #grok-control-panel {
                position: fixed; bottom: 20px; right: 20px; min-width: 280px; min-height: 250px;
                max-width: 90vw; max-height: 90vh; background-color: #15202b; border: 1px solid #38444d;
                border-radius: 12px; padding: 15px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                color: white; z-index: 199998; box-shadow: 0 4px 12px rgba(0,0,0,0.6);
                display: flex; flex-direction: column; gap: 10px;
            }
            #grok-control-panel.hidden { display: none !important; }
            /* RESIZE HANDLE (Top-Left) */
            #grok-side-resize-handle {
                position: absolute; top: 0; left: 0; width: 15px; height: 15px;
                cursor: nwse-resize; z-index: 99999;
            }
            #grok-side-resize-handle::after {
                content: ''; position: absolute; top: 2px; left: 2px;
                border-top: 6px solid #1d9bf0; border-right: 6px solid transparent;
                width: 0; height: 0; opacity: 0.7;
            }
            #grok-side-resize-handle:hover::after { opacity: 1; border-top-color: #fff; }
            /* HEADER */
            .grok-side-header { display: flex; justify-content: space-between; align-items: center; flex-shrink: 0; margin-left: 10px; }
            .grok-side-title { font-weight: bold; font-size: 14px; color: #fff; }
            .grok-side-toggle-btn {
                background: #00ba7c; border: none; color: white;
                padding: 4px 12px; border-radius: 15px;
                font-size: 11px; font-weight: bold; cursor: pointer;
            }
            .grok-side-toggle-btn.off { background: #f4212e; }
            /* CONTROLS */
            .grok-side-controls { display: flex; align-items: center; justify-content: space-between; font-size: 12px; color: #8b98a5; flex-shrink: 0; }
            .grok-side-checkbox { display: flex; align-items: center; cursor: pointer; color: #fff; }
            .grok-side-checkbox input { margin-right: 6px; }
            .grok-side-num-input { width: 40px; background: #273340; border: 1px solid #38444d; color: white; border-radius: 4px; padding: 2px 5px; text-align: center; }
            /* PROMPT BOX */
            .grok-side-prompt-label { font-size: 11px; font-weight: bold; color: #8b98a5; margin-bottom: -5px; flex-shrink: 0; }
            #grok-panel-prompt {
                width: 100%; flex-grow: 1;
                background: #000; border: 1px solid #38444d; border-radius: 6px;
                color: #fff; padding: 8px; font-size: 12px; font-family: sans-serif;
                resize: none; box-sizing: border-box;
            }
            #grok-panel-prompt:focus { border-color: #1d9bf0; outline: none; }
            /* BUTTONS ROW */
            .grok-side-btn-row { display: flex; gap: 8px; flex-shrink: 0; }
            .grok-side-action-btn {
                flex: 1; padding: 8px; border-radius: 6px; border: none;
                cursor: pointer; font-weight: bold; font-size: 12px;
                transition: background 0.2s, border-color 0.2s;
            }
            #btn-open-library { background: #1d9bf0; color: white; }
            #btn-open-library:hover { background: #1a8cd8; }
            #btn-generate { background: #273340; color: #eff3f4; border: 1px solid #38444d; }
            #btn-generate:hover { background: #38444d; border-color: #6b7d8c; }
            /* STATUS */
            #grok-side-status { text-align: center; font-size: 11px; color: #00ba7c; padding-top: 5px; border-top: 1px solid #38444d; flex-shrink: 0; }
            .status-error { color: #f4212e !important; }

            /* --- LIBRARY MODAL (v15.8) --- */
            #grok-library-modal {
                position: fixed; right: 20px; width: 350px; height: 400px;
                background: #15202b; border: 1px solid #38444d; border-radius: 12px;
                display: none; flex-direction: column; z-index: 199999;
                box-shadow: 0 4px 20px rgba(0,0,0,0.8);
                font-family: -apple-system, BlinkMacSystemFont, sans-serif;
            }
            #grok-library-modal.active { display: flex; }
            .gl-header { padding: 10px; background: #192734; display: flex; justify-content: space-between; align-items: center; font-weight: bold; font-size: 13px; color: white; border-bottom: 1px solid #38444d; }
            .gl-close { cursor: pointer; font-size: 18px; line-height: 1; color: #8b98a5; }
            .gl-view-list { display: flex; flex-direction: column; height: 100%; overflow: hidden; }
            .gl-list-content { overflow-y: auto; padding: 10px; flex: 1; display: flex; flex-direction: column; gap: 6px; }
            .gl-item { background: #192734; border: 1px solid #38444d; padding: 8px; border-radius: 4px; display: flex; justify-content: space-between; align-items: center; font-size: 12px; color: white; }
            .gl-item:hover { border-color: #1d9bf0; }
            .gl-item-text { cursor: pointer; flex: 1; margin-right: 10px; }
            .gl-item-text b { display: block; margin-bottom: 2px; }
            .gl-item-text span { color: #888; font-size: 10px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
            .gl-item-actions { display: flex; gap: 5px; }
            .gl-icon-btn { background: none; border: none; cursor: pointer; font-size: 14px; color: #8b98a5; padding: 2px; }
            .gl-icon-btn:hover { color: white; }
            .gl-create-btn { margin: 10px; padding: 8px; background: #00ba7c; color: white; text-align: center; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 12px; }
            .gl-view-editor { display: none; flex-direction: column; padding: 15px; height: 100%; gap: 10px; }
            .gl-view-editor.active { display: flex; }
            .gl-input, .gl-textarea { background: #273340; border: 1px solid #38444d; color: white; padding: 8px; border-radius: 4px; font-size: 12px; width: 100%; box-sizing: border-box; }
            .gl-textarea { flex-grow: 1; resize: none; }
            .gl-editor-buttons { display: flex; gap: 10px; margin-top: auto; }
            .gl-btn { flex: 1; padding: 8px; border-radius: 6px; border: none; cursor: pointer; font-weight: bold; color: white; }
            .gl-btn-save { background: #1d9bf0; }
            .gl-btn-cancel { background: #38444d; }
        `);

        // --- STATE ---
        let isOpen = false;
        let currentCategory = '';
        let videoFilterCategory = 'all';
        let imageFilterCategory = 'all';
        let historyFilterMode = 'all';
        let videoSortMode = 'newest';
        let imageSortMode = 'newest';
        let historySortMode = 'newest';
        let isDragging = false, isResizing = false;
        let dragOffset = { x: 0, y: 0 };
        let modalElement = null;
        let isRecordingKeybind = false;
        let recordingTarget = 'main'; // 'main' or 'side'
        let selectedPromptIds = new Set();
        let lastActivePromptId = null;
        let editingPromptId = null;
        let moderationLockUntil = 0; // Timestamp-based lock

        // --- AUTO RETRY STATE (Main Window) ---
        let retryCount = 0;
        let lastRetryTime = 0;
        let isAutoRetryClick = false; // Flag to prevent self-logging
        // Stores text specifically for restoration logic
        let currentVideoInputText = '';

        // --- HELPERS ---
        function showToast(message, type = 'success') {
            let container = document.querySelector('.grok-toast-container');
            if (!container) {
                container = document.createElement('div');
                container.className = 'grok-toast-container';
                document.body.appendChild(container);
            }
            const toast = document.createElement('div');
            toast.className = 'grok-toast';
            if(type === 'error' || type === 'mod') toast.style.background = 'var(--grok-danger)';
            if(type === 'retry') toast.style.background = 'var(--grok-warning)';
            if(type === 'mod') toast.innerHTML = `⚠️ <span>${message}</span>`;
            else if(type === 'retry') toast.innerHTML = `🔄 <span>${message}</span>`;
            else toast.innerHTML = `
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                <span>${message}</span>
            `;
            container.appendChild(toast);
            setTimeout(() => {
                toast.style.opacity = '0';
                toast.style.transform = 'translateY(10px)';
                setTimeout(() => toast.remove(), 300);
            }, 3000);
        }

        function getCategories() {
            let cats = JSON.parse(GM_getValue('grok_categories_v2', 'null'));
            if (!cats) {
                const oldCats = JSON.parse(GM_getValue('grok_categories', '["General"]'));
                cats = oldCats.map(c => {
                    if (c === 'Image') return null;
                    return { name: c, type: 'video' };
                }).filter(c => c !== null);
                if (!cats.some(c => c.name === 'General Image')) {
                    cats.push({ name: 'General Image', type: 'image' });
                }
                saveCategories(cats);
            }
            return cats;
        }
        function saveCategories(cats) {
            GM_setValue('grok_categories_v2', JSON.stringify(cats));
            GM_setValue('grok_categories', JSON.stringify(cats.map(c => c.name)));
        }
        function getPrompts() { return JSON.parse(GM_getValue('grok_prompts', '[]')); }
        function savePrompts(prompts) { GM_setValue('grok_prompts', JSON.stringify(prompts)); }
        function migratePrompt(p) {
            if (!p.stats) p.stats = { attempts: 0, moderated: 0 };
            if (typeof p.moderation === 'undefined') p.moderation = 0;
            if (p.category === 'Image') p.category = 'General Image';
            return p;
        }
        function getSettings() {
            const defaults = {
                autoTrack: true,
                silentMode: false,
                floatingMode: false,
                useAutoStats: true,
                disableVideoLoop: false,
                hideVideoControls: false,
                openOnLaunch: true,
                retryEnabled: false,
                maxRetries: 3,
                keybind: { key: 'l', altKey: false, ctrlKey: true, shiftKey: false, metaKey: false },
                sidePanelKeybind: { key: 'k', altKey: true, ctrlKey: false, shiftKey: false, metaKey: false }
            };
            const saved = JSON.parse(GM_getValue('grok_settings', '{}'));
            return { ...defaults, ...saved };
        }
        function saveSettings(s) { GM_setValue('grok_settings', JSON.stringify(s)); }
        function getKeybindString(kb) {
            if (!kb) return 'Ctrl + L';
            const parts = [];
            if (kb.ctrlKey) parts.push('Ctrl');
            if (kb.altKey) parts.push('Alt');
            if (kb.shiftKey) parts.push('Shift');
            if (kb.metaKey) parts.push('Meta');
            parts.push((kb.key === ' ' ? 'Space' : kb.key).toUpperCase());
            return parts.join(' + ');
        }
        function compressImage(file, callback) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    const MAX_SIZE = 400;
                    let width = img.width;
                    let height = img.height;
                    if (width > height) { if (width > MAX_SIZE) { height *= MAX_SIZE / width; width = MAX_SIZE; } }
                    else { if (height > MAX_SIZE) { width *= MAX_SIZE / height; height = MAX_SIZE; } }
                    canvas.width = width;
                    canvas.height = height;
                    ctx.drawImage(img, 0, 0, width, height);
                    callback(canvas.toDataURL('image/jpeg', 0.7));
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
        function enforceVideoLoopState() {
            const s = getSettings();
            const loopDisabled = s.disableVideoLoop;
            const videos = document.querySelectorAll('video');
            videos.forEach(video => {
                if (loopDisabled) {
                    if (video.hasAttribute('loop') || video.loop) {
                        video.removeAttribute('loop');
                        video.loop = false;
                    }
                } else {
                    if (!video.hasAttribute('loop')) {
                        video.setAttribute('loop', '');
                        video.loop = true;
                    }
                }
            });
        }
        function checkForModeration() {
            const s = getSettings();
            const now = Date.now();

            const allSpans = Array.from(document.querySelectorAll('span'));
            const hasModerationSpan = allSpans.some(span => span.textContent.trim() === "Content Moderated. Try a different idea.");

             if (hasModerationSpan) {
                // --- ROBUST RETRY LOGIC V35 ---
                if (s.retryEnabled) {
                     const btn = document.querySelector('button[aria-label="Make video"]');
                     const vidInput = document.querySelector('textarea[aria-label="Make a video"]');

                     if (btn && retryCount < s.maxRetries && (now - lastRetryTime > 3000)) {

                         // RESTORE TEXT: USE NATIVE SETTER TO BYPASS REACT
                         if (vidInput && currentVideoInputText) {
                             const nativeTextAreaValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
                             nativeTextAreaValueSetter.call(vidInput, currentVideoInputText);
                             vidInput.dispatchEvent(new Event('input', { bubbles: true }));
                         }

                         // DELAYED CLICK TO ALLOW UI UPDATE
                         setTimeout(() => {
                            isAutoRetryClick = true;
                            btn.click();
                            // Reset flag after generation starts
                            setTimeout(() => { isAutoRetryClick = false; }, 5000);
                         }, 800); // 800ms delay for stability

                         retryCount++;
                         lastRetryTime = now;
                         updateRetryStatus();
                         showToast(`Auto-Retry ${retryCount}/${s.maxRetries}`, 'retry');
                     } else if (retryCount >= s.maxRetries && (now - lastRetryTime > 8000)) {
                         // Max reached, no more clicks
                     }
                }

                if (!s.useAutoStats) return;
                if (!lastActivePromptId) return;
                // ABSOLUTE TIMESTAMP CHECK - Cannot proceed if locked
                if (now < moderationLockUntil) {
                    return; // Still in cooldown period - completely ignore stats
                }

                // --- IMMEDIATE ACTION ---
                let prompts = getPrompts();
                const pIndex = prompts.findIndex(x => x.id === lastActivePromptId);
                if (pIndex !== -1) {
                    prompts[pIndex] = migratePrompt(prompts[pIndex]);
                    prompts[pIndex].stats.moderated++;
                    savePrompts(prompts);
                    lastActivePromptId = null; // Prevent double counting
                    if (isOpen) refreshActiveTab();
                }
                // --- SET 8-SECOND ABSOLUTE LOCK ---
                moderationLockUntil = Date.now() + 8000;
                console.log(`[Grok Manager] Moderation lock active until: ${new Date(moderationLockUntil).toLocaleTimeString()}`);
            }
        }
        // --- HELPER: Get context image from screen ---
        function getContextImageAlt() {
            let img = document.querySelector('img.col-start-1.row-start-1.object-cover');
            if (!img) img = document.querySelector('img.object-cover.invisible.pointer-events-none');
            if (!img) {
                const candidates = document.querySelectorAll('img.object-cover');
                for (let i of candidates) {
                    if (i.alt && i.alt.length > 15) {
                        img = i;
                        break;
                    }
                }
            }
            return (img && img.alt && img.alt.length > 0) ? img.alt : '';
        }
        function setupAutoTracker() {
            const sendIconPath = "M5 11L12 4M12 4L19 11M12 4V21";
            // State to lock tracking during a generation (prevents 5% -> 6% -> 7% counting)
            let isGenerationActive = false;
            // Timestamp to prevent double counting (Click -> 5% detection race condition)
            let lastCaptureTime = 0;

            const capture = (specificText = null, specificType = null) => {
                const now = Date.now();

                // --- FIX: 3-SECOND DELAY TO PREVENT DOUBLE COUNTING ---
                if (now - lastCaptureTime < 3000) return;

                // Also check generation lock if this isn't a manual force
                if (isGenerationActive && !specificText) return;

                let text = specificText || '';
                let sourceType = specificType || 'Image';
                if (!text) {
                    const editor = document.querySelector('.tiptap.ProseMirror');
                    const videoInput = document.querySelector('textarea[aria-label="Make a video"]');
                    const imageInput = document.querySelector('textarea[aria-label="Image prompt"]');
                    if (videoInput && (document.activeElement === videoInput || (videoInput.value.trim().length > 0))) {
                        text = videoInput.value.trim(); sourceType = 'Video';
                    }
                    else if (imageInput && imageInput.value.trim().length > 0) {
                        text = imageInput.value.trim(); sourceType = 'Image';
                    }
                    else if (editor && editor.textContent.trim().length > 0) {
                        text = editor.textContent.trim(); sourceType = 'Image';
                    }
                }
                if (!text || text.length < 2) return;

                // Mark successful capture time and lock generation
                lastCaptureTime = now;
                if (sourceType === 'Video') isGenerationActive = true;

                let attachedImageAlt = getContextImageAlt();
                if (sourceType === 'Image') {
                    attachedImageAlt = '';
                }
                let prompts = getPrompts();
                let existingIndex = prompts.findIndex(p => {
                    const sameText = p.text.trim() === text.trim();
                    const sameType = p.sourceType === sourceType;
                    return sameText && sameType;
                });
                let promptId;
                if (existingIndex !== -1) {
                    prompts[existingIndex] = migratePrompt(prompts[existingIndex]);
                    prompts[existingIndex].timestamp = Date.now();
                    prompts[existingIndex].stats.attempts++;
                    if(attachedImageAlt) {
                         prompts[existingIndex].attachedAlt = attachedImageAlt;
                    }
                    promptId = prompts[existingIndex].id;
                } else {
                    if (!getSettings().autoTrack) return;
                    promptId = 'auto_' + Date.now().toString();
                    prompts.push({
                        id: promptId,
                        text: text,
                        rating: 0,
                        category: 'Auto-History',
                        sourceType: sourceType,
                        attachedAlt: attachedImageAlt,
                        timestamp: Date.now(),
                        stats: { attempts: 1, moderated: 0 },
                        moderation: 0
                    });
                    const msg = attachedImageAlt ? `Auto-Captured (${sourceType} + Source)` : `Auto-Captured (${sourceType})`;
                    if (!getSettings().silentMode) showToast(msg);
                }
                savePrompts(prompts);
                lastActivePromptId = promptId;
                // Reset Retry Count ONLY if this is a manual submission (not auto-retry)
                if (!isAutoRetryClick) {
                    retryCount = 0;
                    updateRetryStatus();
                }

                if (isOpen && document.querySelector('.grok-prompt-tab.active[data-tab="recent"]')) {
                    renderPromptsList('grokRecentTab', p => p.category === 'Auto-History', (a,b) => b.timestamp - a.timestamp);
                }
            };

            // --- PROGRESS DETECTOR ---
            const detectGenerationProgress = () => {
                const progressEl = document.querySelector('.text-xs.font-semibold.w-\\[4ch\\].mb-\\[1px\\].tabular-nums');

                if (progressEl) {
                    const txt = progressEl.textContent.trim();
                    if (txt.includes('%')) {
                        const val = parseInt(txt);
                        if (!isNaN(val) && val >= 5 && val < 100) {
                            if (!isGenerationActive) {
                                capture(null, 'Video');
                            }
                        }
                    }
                } else {
                    if (isGenerationActive) {
                        isGenerationActive = false;
                    }
                }
            };

            const observer = new MutationObserver(() => {
                checkForModeration();
                enforceVideoLoopState();
                detectGenerationProgress();
            });
            observer.observe(document.body, { childList: true, subtree: true, characterData: true });

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    if(e.target.matches('textarea[aria-label="Image prompt"]')) {
                        capture(e.target.value.trim(), 'Image');
                    }
                    // --- NEW: CAPTURE MAIN PROSEMIRROR INPUT AS IMAGE ---
                    else if (e.target.closest('.ProseMirror')) {
                         const el = e.target.closest('.ProseMirror');
                         if(el && el.textContent.trim().length > 0) {
                             capture(el.textContent.trim(), 'Image');
                         }
                    }
                }
            }, true);

            document.addEventListener('mousedown', (e) => {
                // --- FIX: IGNORE CLICKS IF FLAG IS SET ---
                if (isAutoRetryClick) return;

                const submitBtn = e.target.closest('button[aria-label="Submit"]');
                // Removed videoBtn detection
                if (submitBtn) {
                    let targetInput = document.querySelector('textarea[aria-label="Image prompt"]');
                    if (targetInput && targetInput.value.trim().length > 0) { capture(targetInput.value.trim(), 'Image'); return; }

                    // --- NEW: CHECK PROSEMIRROR ON SUBMIT CLICK ---
                    const editor = document.querySelector('.tiptap.ProseMirror');
                    if (editor && editor.textContent.trim().length > 0) {
                        capture(editor.textContent.trim(), 'Image');
                        return;
                    }
                }
            }, true);

            // --- CONTINUOUS INPUT TRACKER FOR RESTORE LOGIC ---
            document.addEventListener('input', (e) => {
                if (e.target.matches('textarea[aria-label="Make a video"]')) {
                    const val = e.target.value;
                    if (val && val.trim().length > 0) {
                        currentVideoInputText = val;
                    }
                }
            }, true);
        }
        // --- UI CREATION ---
        function createUI() {
            document.querySelector('.grok-prompt-overlay')?.remove();
            document.querySelector('.grok-lightbox')?.remove();
            const lightbox = document.createElement('div');
            lightbox.className = 'grok-lightbox';
            lightbox.innerHTML = '<img src="" id="grokLightboxImg">';
            lightbox.onclick = () => { lightbox.classList.remove('open'); setTimeout(()=>lightbox.style.display='none', 200); };
            document.body.appendChild(lightbox);
            const overlay = document.createElement('div');
            overlay.setAttribute('data-darkreader-ignore', 'true');
            const s = getSettings();
            overlay.className = `grok-prompt-overlay ${s.floatingMode ? 'mode-floating' : 'mode-centered'}`;
            overlay.onclick = (e) => {
                 if(!getSettings().floatingMode && e.target === overlay) document.getElementById('grokCloseBtn').click();
            };
            const modal = document.createElement('div');
            modal.className = 'grok-prompt-modal';
            modal.setAttribute('data-darkreader-ignore', 'true');
            modalElement = modal;
            const kbString = getKeybindString(s.keybind);
            const sideKbString = getKeybindString(s.sidePanelKeybind || { key: 'k', altKey: true, ctrlKey: false, shiftKey: false, metaKey: false });

            if (s.floatingMode) {
                const sidekickDefaults = JSON.parse(GM_getValue('grok_sidekick_defaults', 'null'));
                const sidekickPos = GM_getValue('grok_modal_pos_sidekick', null);
                if (sidekickPos) {
                     modal.style.top = sidekickPos.top; modal.style.left = sidekickPos.left;
                     modal.style.width = sidekickPos.width; modal.style.height = sidekickPos.height;
                } else if (sidekickDefaults) {
                     modal.style.top = sidekickDefaults.top; modal.style.left = sidekickDefaults.left;
                     modal.style.width = sidekickDefaults.width; modal.style.height = sidekickDefaults.height;
                } else {
                     modal.style.top = '130px'; modal.style.left = Math.max(0, window.innerWidth - 585) + 'px';
                     modal.style.width = '565px'; modal.style.height = '745px';
                }
            } else {
                const stdDefaults = JSON.parse(GM_getValue('grok_custom_defaults', 'null'));
                const stdPos = GM_getValue('grok_modal_pos_std', null);
                modal.style.position = 'absolute';
                modal.style.margin = '0';
                if (stdPos) {
                     modal.style.top = stdPos.top; modal.style.left = stdPos.left;
                     modal.style.width = stdPos.width; modal.style.height = stdPos.height;
                } else if (stdDefaults) {
                     modal.style.top = stdDefaults.top; modal.style.left = stdDefaults.left;
                     modal.style.width = stdDefaults.width; modal.style.height = stdDefaults.height;
                } else {
                     modal.style.width = '1463px'; modal.style.height = '809px';
                }
            }
            modal.innerHTML = `
                <div class="grok-prompt-header" id="grokDragHandle">
                    <div class="grok-prompt-title">
                        <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24" style="color: var(--grok-primary);">
                            <path d="M2 21L23 12L2 3V10L17 12L2 14V21Z"/>
                        </svg>
                        <span>Grok Manager Ultimate</span>
                    </div>
                    <div class="grok-header-actions">
                        <button class="grok-icon-btn" id="grokResetSizeBtn" title="Reset to Your Default">
                            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <rect x="3" y="3" width="18" height="18" rx="2" stroke-width="2"/>
                            </svg>
                        </button>
                        <button class="grok-icon-btn close" id="grokCloseBtn" title="Close (Esc)">
                            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                        </button>
                    </div>
                </div>
                <div class="grok-prompt-tabs">
                    <button class="grok-prompt-tab active" data-tab="generate">New</button>
                    <button class="grok-prompt-tab" data-tab="recent">History</button>
                    <button class="grok-prompt-tab" data-tab="saved">Video</button>
                    <button class="grok-prompt-tab" data-tab="quick">Images</button>
                    <button class="grok-prompt-tab" data-tab="categories">Tags</button>
                    <button class="grok-prompt-tab" data-tab="settings">Settings</button>
                </div>
                <div class="grok-prompt-content">
                    <div id="grokGenerateTab" class="grok-prompt-form">
                        <div>
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                                <label class="grok-prompt-label" style="margin-bottom:0;">Category</label>
                                <button id="grokToggleQuickAdd" style="background:none; border:none; color:var(--grok-primary); font-size:11px; font-weight:700; cursor:pointer;">+ Create New</button>
                            </div>
                            <select class="grok-prompt-select" id="grokCategorySelect"></select>
                            <div id="grokQuickAddArea" style="display:none; margin-top:10px; background:rgba(255,255,255,0.05); padding:10px; border-radius:8px;">
                                <input type="text" id="grokQuickAddInput" class="grok-prompt-category-input" placeholder="New Tag Name..." style="margin-bottom:8px;">
                                <div style="display:flex; gap:8px;">
                                    <button id="grokQuickAddVidBtn" class="grok-prompt-copy-btn" style="flex:1; justify-content:center;">Video Tag</button>
                                    <button id="grokQuickAddImgBtn" class="grok-prompt-copy-btn" style="flex:1; justify-content:center;">Image Tag</button>
                                </div>
                            </div>
                        </div>
                        <div>
                            <label class="grok-prompt-label">Your Prompt</label>
                            <textarea class="grok-prompt-textarea" id="grokPromptInput" placeholder="What do you want to see?"></textarea>
                        </div>
                        <div class="grok-form-actions">
                            <button class="grok-prompt-button" id="grokSaveBtn">Save Prompt</button>
                            <button class="grok-cancel-btn" id="grokCancelEditBtn">Cancel Edit</button>
                        </div>
                    </div>
                    <div id="grokRecentTab" class="grok-prompt-list" style="display: none;"></div>
                    <div id="grokSavedTab" class="grok-prompt-list" style="display: none;"></div>
                    <div id="grokQuickTab" class="grok-prompt-list" style="display: none;"></div>
                    <div id="grokCategoriesTab" style="display: none; flex-direction: column; gap: 20px;">
                        <div class="grok-split-view">
                            <div class="grok-tag-section">
                                <div class="grok-tag-header">Video / General Tags</div>
                                <div style="display:flex; gap:10px; margin-bottom:12px;">
                                    <input type="text" class="grok-prompt-category-input" id="grokNewVideoCat" placeholder="e.g. Sci-Fi...">
                                    <button class="grok-prompt-add-btn" id="grokAddVideoCatBtn">Add</button>
                                </div>
                                <div class="grok-prompt-category-list" id="grokVideoCatList"></div>
                            </div>
                            <div class="grok-tag-section">
                                <div class="grok-tag-header">Image Tags</div>
                                <div style="display:flex; gap:10px; margin-bottom:12px;">
                                    <input type="text" class="grok-prompt-category-input" id="grokNewImageCat" placeholder="e.g. Portraits...">
                                    <button class="grok-prompt-add-btn" id="grokAddImageCatBtn">Add</button>
                                </div>
                                <div class="grok-prompt-category-list" id="grokImageCatList"></div>
                            </div>
                        </div>
                    </div>
                    <div id="grokSettingsTab" style="display: none;">
                         <label class="grok-prompt-label">Video Auto-Retry (Main Window)</label>
                         <div class="grok-checkbox-wrapper">
                            <input type="checkbox" id="grokRetryEnableToggle" class="grok-checkbox">
                            <div>
                                <div style="font-weight:600; color:var(--grok-text-main);">Enable Auto-Retry on Moderation</div>
                                <div style="font-size:12px; color:var(--grok-text-muted);">Automatically clicks "Make video" if content is moderated.</div>
                            </div>
                        </div>
                        <div class="grok-info-box" style="flex-direction:row; align-items:center; justify-content:space-between;">
                            <div style="display:flex; align-items:center; gap:10px;">
                                <span style="font-size:12px; font-weight:600;">Max Retries:</span>
                                <input type="number" id="grokMaxRetryInput" class="grok-num-input" value="${s.maxRetries}" min="1" max="50">
                            </div>
                            <div style="font-size:12px; color:var(--grok-text-muted); font-weight:600;">Status: <span id="grokRetryStatus" style="color:var(--grok-primary);">${retryCount}/${s.maxRetries}</span></div>
                            <button id="grokRetryResetBtn" class="grok-keybind-btn">Reset Count</button>
                        </div>

                         <label class="grok-prompt-label">Start Up</label>
                         <div class="grok-checkbox-wrapper">
                            <input type="checkbox" id="grokAutoOpenToggle" class="grok-checkbox">
                            <div>
                                <div style="font-weight:600; color:var(--grok-text-main);">Auto-Open on Load</div>
                                <div style="font-size:12px; color:var(--grok-text-muted);">Open this menu automatically when visiting Grok.</div>
                            </div>
                        </div>
                         <label class="grok-prompt-label">Tracking Mode</label>
                        <div class="grok-checkbox-wrapper">
                            <input type="checkbox" id="grokAutoStatsToggle" class="grok-checkbox">
                            <div>
                                <div style="font-weight:600; color:var(--grok-text-main);">Enable Auto-Stats & Detection (Video)</div>
                                <div style="font-size:12px; color:var(--grok-text-muted);"><strong>ON:</strong> Auto-detects moderation for videos.</div>
                            </div>
                        </div>
                        <label class="grok-prompt-label">Video Playback</label>
                        <div class="grok-checkbox-wrapper">
                            <input type="checkbox" id="grokVideoLoopToggle" class="grok-checkbox">
                            <div>
                                <div style="font-weight:600; color:var(--grok-text-main);">Disable Video Looping</div>
                                <div style="font-size:12px; color:var(--grok-text-muted);">Prevent videos from replaying. (Shortcut: Alt+L)</div>
                            </div>
                        </div>
                        <div class="grok-checkbox-wrapper" style="margin-left: 20px; border-left: 2px solid var(--grok-border); padding-left: 10px; margin-top: -10px;">
                            <input type="checkbox" id="grokHideControlsToggle" class="grok-checkbox">
                            <div>
                                <div style="font-weight:600; color:var(--grok-text-main);">Hide Overlay Controls</div>
                                <div style="font-size:12px; color:var(--grok-text-muted);">Hides mute, more options, and format toggles on videos.</div>
                            </div>
                        </div>
                         <label class="grok-prompt-label">View Mode</label>
                        <div class="grok-checkbox-wrapper">
                            <input type="checkbox" id="grokFloatingModeToggle" class="grok-checkbox">
                            <div>
                                <div style="font-weight:600; color:var(--grok-text-main);">Floating Sidekick Mode</div>
                                <div style="font-size:12px; color:var(--grok-text-muted);">Floating window that stays open.</div>
                            </div>
                        </div>
                        <label class="grok-prompt-label">External Tools</label>
                        <div class="grok-info-box">
                             <div style="display:flex; gap:10px; width:100%; align-items: center;">
                                <div style="flex:1;">
                                    <div style="font-weight:600; font-size:13px; color:var(--grok-text-main);">Side Panel (Snippets/Retry)</div>
                                    <div style="font-size:11px; color:var(--grok-text-muted);">Open the mini-tool panel.</div>
                                </div>
                                <button id="grokOpenSidePanelBtn" class="grok-keybind-btn">Toggle Panel</button>
                             </div>
                        </div>
                        <label class="grok-prompt-label">Window Preferences</label>
                        <div class="grok-info-box">
                             <div style="display:flex; gap:10px; width:100%;">
                                <button id="grokSetDefaultBtn" class="grok-keybind-btn" style="flex:1; background:rgba(29, 155, 240, 0.15); border-color:rgba(29, 155, 240, 0.3);">
                                    ${s.floatingMode ? 'Set Sidekick Default' : 'Set Standard Default'}
                                </button>
                                <button id="grokFactoryResetBtn" class="grok-keybind-btn" style="background:transparent; color:var(--grok-text-muted);" title="Restore Factory Settings">
                                    Reset
                                </button>
                             </div>
                        </div>
                        <label class="grok-prompt-label">Shortcuts</label>
                        <div class="grok-keybind-wrapper" style="flex-direction:column; align-items:stretch; gap:12px;">
                            <div style="display:flex; justify-content:space-between; align-items:center;">
                                <span style="font-size:12px; color:#ccc;">Main Window:</span>
                                <div style="display:flex; gap:10px;">
                                    <div class="grok-keybind-display" id="grokKeybindDisplay">${kbString}</div>
                                    <button class="grok-keybind-btn" id="grokKeybindBtn">Change</button>
                                </div>
                            </div>
                            <div style="display:flex; justify-content:space-between; align-items:center;">
                                <span style="font-size:12px; color:#ccc;">Side Panel Toggle:</span>
                                <div style="display:flex; gap:10px;">
                                    <div class="grok-keybind-display" id="grokSideKeybindDisplay">${sideKbString}</div>
                                    <button class="grok-keybind-btn" id="grokSideKeybindBtn">Change</button>
                                </div>
                            </div>
                        </div>
                        <label class="grok-prompt-label">Automation</label>
                        <div class="grok-checkbox-wrapper">
                            <input type="checkbox" id="grokAutoTrackToggle" class="grok-checkbox">
                            <div>
                                <div style="font-weight:600; color:var(--grok-text-main);">Auto-Capture Prompts</div>
                                <div style="font-size:12px; color:var(--grok-text-muted);">Save prompts from inputs automatically.</div>
                            </div>
                        </div>
                        <div class="grok-checkbox-wrapper">
                            <input type="checkbox" id="grokSilentModeToggle" class="grok-checkbox">
                            <div>
                                <div style="font-weight:600; color:var(--grok-text-main);">Silent Mode</div>
                                <div style="font-size:12px; color:var(--grok-text-muted);">Disable save notifications.</div>
                            </div>
                        </div>
                        <label class="grok-prompt-label">Data</label>
                        <div style="display:flex; gap:10px; align-items:center;">
                            <button class="grok-prompt-copy-btn" id="grokExportBtn">Export</button>
                            <button class="grok-prompt-copy-btn" id="grokImportBtn">Import</button>
                            <input type="file" id="grokImportFile" style="display:none" accept=".json">
                            <button class="grok-prompt-copy-btn" id="grokClearBtn" style="color:var(--grok-danger); border-color:var(--grok-danger); margin-left:auto;">Reset Data</button>
                        </div>
                    </div>
                </div>
                <div class="grok-prompt-resize-handle" id="grokResizeHandle" title="Drag to Resize"></div>
            `;
            overlay.appendChild(modal);
            document.body.appendChild(overlay);
            return overlay;
        }
        function generatePromptHTML(p, renderMode, useAutoStats) {
            p = migratePrompt(p);
            const isAuto = p.category === 'Auto-History' || p.id.startsWith('auto_');
            const videoPromptValue = p.videoPrompt || '';
            let badgeLabel = isAuto ? (p.sourceType || 'Auto-History') : p.category;
            const cats = getCategories();
            const catObj = cats.find(c => c.name === p.category);
            const isImageCat = catObj && catObj.type === 'image';
            const isHistoryMode = renderMode === 'history';
            const isSelected = isHistoryMode && selectedPromptIds.has(p.id) ? 'checked' : '';
            let snapshotHtml = '';
            let videoInputHtml = '';
            const dateString = new Date(p.timestamp).toLocaleString();
            if (renderMode === 'image') {
                snapshotHtml = p.snapshot
                    ? `<div class="grok-snapshot-wrapper"><img src="${p.snapshot}" class="grok-snapshot-thumb" data-src="${p.snapshot}" title="Click to Zoom"><button class="grok-snapshot-del" data-id="${p.id}" title="Remove Snapshot">&times;</button></div>`
                    : `<label class="grok-snapshot-upload-btn">+ Snapshot<input type="file" class="grok-snapshot-input" data-id="${p.id}" accept="image/jpeg, image/png, image/webp"></label>`;
            }
            if (renderMode === 'video') {
                 videoInputHtml = `<div class="grok-video-section"><label class="grok-video-label">Video Prompt</label><textarea class="grok-video-input" data-id="${p.id}" placeholder="Add video description...">${videoPromptValue}</textarea></div>`;
            }
            const previewCol = renderMode === 'image' ? `<div class="grok-image-preview-col">${snapshotHtml}</div>` : '';
            let statsHtml = '';
            const isImagePrompt = renderMode === 'image' || p.sourceType === 'Image' || isImageCat;
            if (useAutoStats && !isImagePrompt) {
                const attempts = p.stats.attempts || 0;
                const mods = p.stats.moderated || 0;
                const successCount = Math.max(0, attempts - mods);
                let rate = 0;
                if (attempts > 0) rate = Math.round((successCount / attempts) * 100);
                let pillClass = rate === 100 ? 'success' : (rate < 50 ? 'fail' : '');
                let barColor = 'var(--grok-success)';
                if (rate < 50) barColor = 'var(--grok-danger)'; else if (rate < 80) barColor = 'var(--grok-warning)';
                statsHtml = `
                    <div class="grok-stats-bar-container">
                        <div class="grok-stats-pill ${pillClass}">${rate}% Success</div>
                        <div class="grok-success-rate-bar"><div class="grok-success-rate-fill" style="width: ${rate}%; background: ${barColor};"></div></div>
                        <div class="grok-stats-text">${successCount} Success / ${mods} Moderated</div>
                    </div>`;
            } else {
                const modVal = p.moderation || 0;
                const modClass = modVal < 40 ? 'low' : (modVal < 80 ? 'med' : 'high');
                if (!isAuto || isImagePrompt) {
                    statsHtml = `<div class="grok-mod-wrapper"><label class="grok-mod-label">Mod Pass:</label><input type="range" min="0" max="100" value="${modVal}" class="grok-mod-slider" data-id="${p.id}"><span class="grok-mod-val ${modClass}">${modVal}%</span></div>`;
                }
            }
            // SOURCE IMAGE ALT DISPLAY
            let sourceImageHtml = '';
            if (p.attachedAlt && p.sourceType !== 'Image' && !isImageCat) {
                sourceImageHtml = `<div class="grok-prompt-source-alt"><strong>Source Image:</strong> ${p.attachedAlt}</div>`;
            }
            return `
            <div class="grok-prompt-item">
                ${isHistoryMode ? `<div class="grok-item-check-wrapper"><input type="checkbox" class="grok-item-checkbox grok-select-item" data-id="${p.id}" ${isSelected}></div>` : ''}
                <div class="grok-item-content-wrapper">
                    <div class="grok-image-item-grid">
                        <div class="grok-image-content-col">
                            <div class="grok-prompt-item-header">
                                <div class="grok-prompt-item-text">${p.text}</div>
                                <button class="grok-prompt-item-delete" data-id="${p.id}" title="Delete"><svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg></button>
                            </div>
                            ${sourceImageHtml}
                            ${videoInputHtml}
                        </div>
                        ${previewCol}
                    </div>
                    <div class="grok-prompt-item-footer">
                        <span class="grok-prompt-category-badge ${isAuto ? 'auto' : ''} ${(isImageCat || p.sourceType === 'Image') ? 'image-tag' : ''}">${badgeLabel}</span>
                        ${statsHtml}
                        <button class="grok-prompt-copy-btn" data-text="${p.text.replace(/"/g, '&quot;')}">Copy</button>
                        ${isAuto ? `<button class="grok-prompt-copy-btn save-btn" data-id="${p.id}" style="color:var(--grok-primary); border-color:var(--grok-primary);">Save</button>` : ''}
                        <span style="margin-left:auto; font-size:11px; color:#555;">${dateString}</span>
                    </div>
                </div>
            </div>`;
        }
        // --- RENDERERS ---
        function renderPromptsList(targetId, filterFn, sortFn) {
            const container = document.getElementById(targetId);
            const s = getSettings();
            let prompts = getPrompts();
            if (filterFn) prompts = prompts.filter(filterFn);
            if (targetId === 'grokRecentTab') {
                const retryStyle = s.retryEnabled ? 'display:inline;' : 'display:none;';
                const retryText = s.retryEnabled ? `Auto-Retry: ${retryCount}/${s.maxRetries}` : '';

                const bulkBarHTML = `
                    <div class="grok-bulk-bar">
                        <div style="display:flex; align-items:center; gap:12px; flex-wrap:wrap;">
                            <div style="display:flex; align-items:center; gap:8px;">
                                 <input type="checkbox" id="grokSelectAll-${targetId}" class="grok-item-checkbox">
                                 <label for="grokSelectAll-${targetId}" style="font-size:13px; font-weight:600; cursor:pointer; color:var(--grok-text-main);">Select All</label>
                            </div>
                            <div class="grok-filter-group" style="border-left:1px solid var(--grok-border); padding-left:10px;">
                                <button class="grok-prompt-filter-btn ${historyFilterMode === 'all' ? 'active' : ''}" data-f="all" data-mode="history-type">All</button>
                                <button class="grok-prompt-filter-btn ${historyFilterMode === 'video' ? 'active' : ''}" data-f="video" data-mode="history-type">Video</button>
                                <button class="grok-prompt-filter-btn ${historyFilterMode === 'image' ? 'active' : ''}" data-f="image" data-mode="history-type">Image</button>
                            </div>
                        </div>
                        <div style="display:flex; align-items:center; gap:12px;">
                            <div class="grok-sort-group">
                                 <span style="font-size:10px; color:#555; font-weight:700; text-transform:uppercase; margin-right:4px;">Sort:</span>
                                 <button class="grok-prompt-sort-btn ${historySortMode === 'newest' ? 'active' : ''}" data-sort="newest" data-target="history">Newest</button>
                                 <button class="grok-prompt-sort-btn ${historySortMode === 'high' ? 'active' : ''}" data-sort="high" data-target="history">High Success</button>
                                 <button class="grok-prompt-sort-btn ${historySortMode === 'low' ? 'active' : ''}" data-sort="low" data-target="history">Low Success</button>
                            </div>
                            <span id="grokRetryStatus-history" style="font-size:11px; font-weight:700; color:var(--grok-warning); margin-right:4px; ${retryStyle}">${retryText}</span>
                            <button id="grokBulkDeleteBtn-${targetId}" class="grok-bulk-delete-btn" disabled>Delete Selected</button>
                        </div>
                    </div>
                `;
                const allCats = getCategories();
                if (historyFilterMode === 'video') {
                    prompts = prompts.filter(p => {
                        const m = migratePrompt(p);
                        const isVidCat = allCats.some(c => c.name === m.category && c.type === 'video');
                        return m.sourceType === 'Video' || (isVidCat && m.sourceType !== 'Image');
                    });
                } else if (historyFilterMode === 'image') {
                    prompts = prompts.filter(p => {
                        const m = migratePrompt(p);
                        const isImgCat = allCats.some(c => c.name === m.category && c.type === 'image');
                        return m.sourceType === 'Image' || isImgCat;
                    });
                }
                if (historySortMode === 'high') {
                    prompts.sort((a, b) => {
                         const pA = migratePrompt(a), pB = migratePrompt(b);
                         const rA = pA.stats.attempts ? ((pA.stats.attempts - pA.stats.moderated)/pA.stats.attempts) : 0;
                         const rB = pB.stats.attempts ? ((pB.stats.attempts - pB.stats.moderated)/pB.stats.attempts) : 0;
                         if (rA !== rB) return rB - rA; // Descending pct
                         return pB.stats.attempts - pA.stats.attempts; // Tie-break: More attempts = Higher confidence
                    });
                } else if (historySortMode === 'low') {
                    prompts.sort((a, b) => {
                         const pA = migratePrompt(a), pB = migratePrompt(b);
                         const rA = pA.stats.attempts ? ((pA.stats.attempts - pA.stats.moderated)/pA.stats.attempts) : 0;
                         const rB = pB.stats.attempts ? ((pB.stats.attempts - pB.stats.moderated)/pB.stats.attempts) : 0;
                         if (rA !== rB) return rA - rB; // Ascending pct
                         return pB.stats.moderated - pA.stats.moderated; // Descending Moderation Count (Higher count first)
                    });
                } else {
                    prompts.sort((a, b) => b.timestamp - a.timestamp);
                }
                if (prompts.length === 0) { container.innerHTML = bulkBarHTML + `<div style="text-align:center; color:#666; padding:40px;">History is empty.</div>`; bindControls(); return; }
                container.innerHTML = bulkBarHTML + '<div class="grok-prompt-list">' + prompts.map(p => generatePromptHTML(p, 'history', s.useAutoStats)).join('') + '</div>';
                bindMediaEvents(container);
                bindBulkEvents(container, targetId, prompts);
                bindControls();
            } else if (targetId === 'grokSavedTab') {
                const videoCats = getCategories().filter(c => c.type === 'video').map(c => c.name);
                const controlsHTML = `
                    <div class="grok-control-bar">
                        <div class="grok-filter-group">
                            <button class="grok-prompt-filter-btn ${videoFilterCategory === 'all' ? 'active' : ''}" data-f="all" data-mode="video">All</button>
                            ${videoCats.map(c => `<button class="grok-prompt-filter-btn ${videoFilterCategory === c ? 'active' : ''}" data-f="${c}" data-mode="video">${c}</button>`).join('')}
                        </div>
                        <div class="grok-sort-group">
                             <span style="font-size:10px; color:#555; font-weight:700; text-transform:uppercase; margin-right:4px;">Sort:</span>
                             <button class="grok-prompt-sort-btn ${videoSortMode === 'newest' ? 'active' : ''}" data-sort="newest" data-target="video">Newest</button>
                             <button class="grok-prompt-sort-btn ${videoSortMode === 'high' ? 'active' : ''}" data-sort="high" data-target="video">${s.useAutoStats ? 'High Success' : 'High Mod'}</button>
                             <button class="grok-prompt-sort-btn ${videoSortMode === 'low' ? 'active' : ''}" data-sort="low" data-target="video">${s.useAutoStats ? 'Low Success' : 'Low Mod'}</button>
                        </div>
                    </div>`;
                if (videoFilterCategory !== 'all') prompts = prompts.filter(p => p.category === videoFilterCategory);
                if (videoSortMode === 'high') {
                    prompts.sort((a, b) => {
                         const pA = migratePrompt(a), pB = migratePrompt(b);
                         if(s.useAutoStats) {
                             const rA = pA.stats.attempts ? ((pA.stats.attempts - pA.stats.moderated)/pA.stats.attempts) : 0;
                             const rB = pB.stats.attempts ? ((pB.stats.attempts - pB.stats.moderated)/pB.stats.attempts) : 0;
                             if (rA !== rB) return rB - rA;
                             return pB.stats.attempts - pA.stats.attempts;
                         }
                         return (pB.moderation || 0) - (pA.moderation || 0);
                    });
                }
                else if (videoSortMode === 'low') {
                    prompts.sort((a, b) => {
                         const pA = migratePrompt(a), pB = migratePrompt(b);
                         if(s.useAutoStats) {
                             const rA = pA.stats.attempts ? ((pA.stats.attempts - pA.stats.moderated)/pA.stats.attempts) : 0;
                             const rB = pB.stats.attempts ? ((pB.stats.attempts - pB.stats.moderated)/pB.stats.attempts) : 0;
                             if (rA !== rB) return rA - rB;
                             return pB.stats.moderated - pA.stats.moderated;
                         }
                         return (pA.moderation || 0) - (pB.moderation || 0);
                    });
                }
                else prompts.sort((a, b) => b.timestamp - a.timestamp);
                if (prompts.length === 0) {
                    container.innerHTML = controlsHTML + `<div style="text-align:center; color:#666; padding:40px;">No saved video prompts found.</div>`;
                    bindControls(); return;
                }
                container.innerHTML = controlsHTML + '<div class="grok-prompt-list">' + prompts.map(p => generatePromptHTML(p, 'video', s.useAutoStats)).join('') + '</div>';
                bindControls(); bindMediaEvents(container);
            } else if (targetId === 'grokQuickTab') {
                 const imageCats = getCategories().filter(c => c.type === 'image').map(c => c.name);
                 const controlsHTML = `
                    <div class="grok-control-bar">
                        <div class="grok-filter-group">
                            <button class="grok-prompt-filter-btn ${imageFilterCategory === 'all' ? 'active' : ''}" data-f="all" data-mode="image">All</button>
                            ${imageCats.map(c => `<button class="grok-prompt-filter-btn ${imageFilterCategory === c ? 'active' : ''}" data-f="${c}" data-mode="image">${c}</button>`).join('')}
                        </div>
                         <div class="grok-sort-group">
                             <span style="font-size:10px; color:#555; font-weight:700; text-transform:uppercase; margin-right:4px;">Sort:</span>
                             <button class="grok-prompt-sort-btn ${imageSortMode === 'newest' ? 'active' : ''}" data-sort="newest" data-target="image">Newest</button>
                             <button class="grok-prompt-sort-btn ${imageSortMode === 'high' ? 'active' : ''}" data-sort="high" data-target="image">High Success</button>
                             <button class="grok-prompt-sort-btn ${imageSortMode === 'low' ? 'active' : ''}" data-sort="low" data-target="image">Low Success</button>
                        </div>
                    </div>`;
                if (imageFilterCategory !== 'all') prompts = prompts.filter(p => p.category === imageFilterCategory);
                if (imageSortMode === 'high') {
                     prompts.sort((a, b) => (migratePrompt(b).moderation || 0) - (migratePrompt(a).moderation || 0));
                } else if (imageSortMode === 'low') {
                    prompts.sort((a, b) => (migratePrompt(a).moderation || 0) - (migratePrompt(b).moderation || 0));
                } else {
                    prompts.sort((a, b) => b.timestamp - a.timestamp);
                }
                if (prompts.length === 0) {
                     container.innerHTML = controlsHTML + `<div style="text-align:center; color:#666; padding:40px;">No image prompts saved yet.</div>`;
                     bindControls();
                     return;
                }
                container.innerHTML = controlsHTML + '<div class="grok-prompt-list">' + prompts.map(p => generatePromptHTML(p, 'image', s.useAutoStats)).join('') + '</div>';
                bindControls();
                bindMediaEvents(container);
            }
            bindPromptEvents(container);
        }
        function bindBulkEvents(container, targetId, currentVisiblePrompts) {
            const selectAllCb = container.querySelector(`#grokSelectAll-${targetId}`);
            const deleteBtn = container.querySelector(`#grokBulkDeleteBtn-${targetId}`);
            const itemCheckboxes = container.querySelectorAll('.grok-select-item');
            const updateBulkUI = () => {
                const allVisibleSelected = currentVisiblePrompts.length > 0 && currentVisiblePrompts.every(p => selectedPromptIds.has(p.id));
                if(selectAllCb) selectAllCb.checked = allVisibleSelected;
                const selectedCount = selectedPromptIds.size;
                if(deleteBtn) {
                    deleteBtn.disabled = selectedCount === 0;
                    deleteBtn.innerText = selectedCount > 0 ? `Delete Selected (${selectedCount})` : `Delete Selected`;
                }
            };
            if(selectAllCb) selectAllCb.onclick = (e) => {
                const isChecked = e.target.checked;
                currentVisiblePrompts.forEach(p => isChecked ? selectedPromptIds.add(p.id) : selectedPromptIds.delete(p.id));
                itemCheckboxes.forEach(cb => cb.checked = isChecked);
                updateBulkUI();
            };
            itemCheckboxes.forEach(cb => cb.onclick = (e) => {
                e.target.checked ? selectedPromptIds.add(e.target.dataset.id) : selectedPromptIds.delete(e.target.dataset.id);
                updateBulkUI();
            });
            if(deleteBtn) deleteBtn.onclick = () => {
                const count = selectedPromptIds.size;
                if (confirm(`Delete ${count} prompts?`)) {
                    let allPrompts = getPrompts().filter(p => !selectedPromptIds.has(p.id));
                    savePrompts(allPrompts);
                    selectedPromptIds.clear();
                    showToast(`Deleted ${count} prompts`);
                    refreshActiveTab();
                }
            };
            updateBulkUI();
        }
        function bindControls() {
            document.querySelectorAll('.grok-prompt-filter-btn').forEach(b => b.onclick = () => {
                const mode = b.dataset.mode;
                if (mode === 'image') {
                     imageFilterCategory = b.dataset.f;
                     selectedPromptIds.clear();
                     refreshActiveTab();
                } else if (mode === 'history-type') {
                     historyFilterMode = b.dataset.f;
                     selectedPromptIds.clear();
                     refreshActiveTab();
                } else {
                     videoFilterCategory = b.dataset.f;
                     selectedPromptIds.clear();
                     refreshActiveTab();
                }
            });
            document.querySelectorAll('.grok-prompt-sort-btn').forEach(b => b.onclick = () => {
                const target = b.dataset.target;
                const sortType = b.dataset.sort;
                if (target === 'history') {
                    historySortMode = sortType;
                } else if (target === 'image') {
                    imageSortMode = sortType;
                } else {
                    videoSortMode = sortType;
                }
                refreshActiveTab();
            });
        }
        function bindMediaEvents(container) {
             container.querySelectorAll('.grok-video-input').forEach(input => {
                 input.addEventListener('blur', (e) => {
                     const id = e.target.dataset.id, val = e.target.value;
                     let prompts = getPrompts(), p = prompts.find(x => x.id === id);
                     if (p && p.videoPrompt !== val) { p.videoPrompt = val; savePrompts(prompts); showToast('Video prompt saved'); }
                 });
             });
             container.querySelectorAll('.grok-mod-slider').forEach(slider => {
                 slider.addEventListener('input', (e) => {
                    const val = e.target.value;
                    const display = e.target.parentElement.querySelector('.grok-mod-val');
                    if(display) { display.innerText = val + '%'; display.className = `grok-mod-val ${val < 40 ? 'low' : (val < 80 ? 'med' : 'high')}`; }
                 });
                 slider.addEventListener('change', (e) => {
                     let prompts = getPrompts(), p = prompts.find(x => x.id === e.target.dataset.id);
                     if (p) { p.moderation = parseInt(e.target.value); savePrompts(prompts); }
                 });
             });
             container.querySelectorAll('.grok-snapshot-input').forEach(input => {
                 input.addEventListener('change', (e) => {
                     const file = e.target.files[0]; if (!file) return;
                     compressImage(file, (base64) => {
                         let prompts = getPrompts(), p = prompts.find(x => x.id === e.target.dataset.id);
                         if (p) { p.snapshot = base64; savePrompts(prompts); refreshActiveTab(); showToast('Snapshot attached!'); }
                     });
                 });
             });
             container.querySelectorAll('.grok-snapshot-del').forEach(btn => btn.addEventListener('click', (e) => {
                 if (!confirm('Remove snapshot?')) return;
                 let prompts = getPrompts(), p = prompts.find(x => x.id === e.target.dataset.id);
                 if (p) { delete p.snapshot; savePrompts(prompts); refreshActiveTab(); }
             }));
             container.querySelectorAll('.grok-snapshot-thumb').forEach(img => img.addEventListener('click', (e) => {
                 const lightbox = document.querySelector('.grok-lightbox'), lbImg = document.getElementById('grokLightboxImg');
                 lbImg.src = e.target.dataset.src;
                 lightbox.style.display = 'flex'; lightbox.offsetHeight; lightbox.classList.add('open');
             }));
        }
       function bindPromptEvents(container) {
            container.onclick = (e) => {
                const btn = e.target.closest('button');
                if (!btn || btn.classList.contains('grok-bulk-delete-btn')) return;

                if (btn.classList.contains('grok-prompt-copy-btn') && btn.dataset.text) {
                    const txt = btn.dataset.text;
                    navigator.clipboard.writeText(txt).then(() => showToast('Copied to clipboard!'));

                    // --- NEW: Auto-fill Side Panel if it is open ---
                    const sidePanel = document.getElementById('grok-control-panel');
                    const sideInput = document.getElementById('grok-panel-prompt');
                    if (sidePanel && !sidePanel.classList.contains('hidden') && sideInput) {
                        sideInput.value = txt;
                        // Trigger input event so the Side Panel syncs with Grok main input
                        sideInput.dispatchEvent(new Event('input', { bubbles: true }));
                    }
                }
                else if (btn.classList.contains('grok-prompt-item-delete')) {
                    if (confirm('Delete this prompt?')) { savePrompts(getPrompts().filter(p => p.id !== btn.dataset.id)); refreshActiveTab(); }
                }
                else if (btn.classList.contains('save-btn')) {
                    let prompts = getPrompts();
                    let p = prompts.find(x => x.id === btn.dataset.id);
                    if (p) {
                        editingPromptId = p.id;
                        document.querySelector('[data-tab="generate"]').click();
                        document.getElementById('grokPromptInput').value = p.text;
                        const saveBtn = document.getElementById('grokSaveBtn');
                        saveBtn.innerText = "Update Saved Prompt";
                        saveBtn.style.background = "var(--grok-image-history)";
                        document.getElementById('grokCancelEditBtn').style.display = 'inline-flex';
                        showToast('Select a Category and click Update');
                    }
                }
            };
        }
        function refreshActiveTab() {
            const active = document.querySelector('.grok-prompt-tab.active').dataset.tab;
            const allCats = getCategories();
            const videoCatNames = allCats.filter(c => c.type === 'video').map(c => c.name);
            const imageCatNames = allCats.filter(c => c.type === 'image').map(c => c.name);
            if (active === 'saved') {
                renderPromptsList('grokSavedTab', p => {
                    const pMigrated = migratePrompt(p);
                    if (pMigrated.category === 'Auto-History') return false;
                    if (imageCatNames.includes(pMigrated.category)) return false;
                    return true;
                });
            }
            else if (active === 'recent') {
                renderPromptsList('grokRecentTab', p => p.category === 'Auto-History' || p.id.startsWith('auto_'));
            }
            else if (active === 'quick') {
                renderPromptsList('grokQuickTab', p => {
                     const pMigrated = migratePrompt(p);
                     if (pMigrated.category === 'Auto-History') return false;
                     return imageCatNames.includes(pMigrated.category) || pMigrated.snapshot || pMigrated.sourceType === 'Image';
                });
            }
            else if (active === 'categories') renderCategories();
            updateCounts();
            updateRetryStatus();
        }

        function updateRetryStatus() {
            const s = getSettings();
            const text = `${retryCount}/${s.maxRetries}`;

            // Update Settings Tab
            const el = document.getElementById('grokRetryStatus');
            if(el) el.innerText = text;

            // Update History Tab
            const elHist = document.getElementById('grokRetryStatus-history');
            if(elHist) {
                if(s.retryEnabled) {
                    elHist.style.display = 'inline';
                    elHist.innerText = `Auto-Retry: ${text}`;
                } else {
                    elHist.style.display = 'none';
                }
            }

            // --- FIX: Sync with Side Panel Status ---
            const sideStatus = document.getElementById('grok-side-status');
            if (sideStatus) {
                if (!s.retryEnabled) {
                    sideStatus.textContent = "Auto-Retry Disabled";
                    sideStatus.className = 'status-error';
                } else if (retryCount >= s.maxRetries) {
                    sideStatus.textContent = "Max Limit Reached";
                    sideStatus.className = 'status-error';
                } else {
                    sideStatus.textContent = `Retrying (${retryCount}/${s.maxRetries})`;
                    sideStatus.className = '';
                }
            }
        }

        function renderCategories() {
            const videoList = document.getElementById('grokVideoCatList');
            const imageList = document.getElementById('grokImageCatList');
            const cats = getCategories();
            videoList.innerHTML = cats.filter(c => c.type === 'video').map(c =>
                `<div class="grok-prompt-category-tag">${c.name}<span style="cursor:pointer; color:#666; padding:0 4px;" data-rem="${c.name}">&times;</span></div>`
            ).join('');
            imageList.innerHTML = cats.filter(c => c.type === 'image').map(c =>
                `<div class="grok-prompt-category-tag image-type">${c.name}<span style="cursor:pointer; color:#666; padding:0 4px;" data-rem="${c.name}">&times;</span></div>`
            ).join('');
            document.querySelectorAll('.grok-prompt-category-list [data-rem]').forEach(span => span.onclick = () => {
                let cName = span.dataset.rem;
                let cats = getCategories();
                if (cats.length <= 1) return alert('Keep at least one category.');
                saveCategories(cats.filter(x => x.name !== cName));
                renderCategories();
                updateCategorySelect();
            });
        }

        function updateCategorySelect() {
            const sel = document.getElementById('grokCategorySelect');
            const cats = getCategories();
            const vidCats = cats.filter(c => c.type === 'video');
            const imgCats = cats.filter(c => c.type === 'image');
            const currentVal = sel.value;
            sel.innerHTML = `
                <optgroup label="Video / General">
                    ${vidCats.map(c => `<option value="${c.name}">${c.name}</option>`).join('')}
                </optgroup>
                <optgroup label="Image">
                    ${imgCats.map(c => `<option value="${c.name}">${c.name}</option>`).join('')}
                </optgroup>
            `;
            if(currentVal && cats.some(c => c.name === currentVal)) sel.value = currentVal;
            else if (!currentCategory && vidCats.length > 0) currentCategory = vidCats[0].name;
        }

        function updateCounts() {
            const p = getPrompts();
            const allCats = getCategories();
            const imageCatNames = allCats.filter(c => c.type === 'image').map(c => c.name);
            const imgCount = p.filter(x => {
                const m = migratePrompt(x);
                return m.category !== 'Auto-History' && (imageCatNames.includes(m.category) || m.snapshot || m.sourceType === 'Image');
            }).length;
            const vidCount = p.filter(x => {
                 const m = migratePrompt(x);
                 return m.category !== 'Auto-History' && !imageCatNames.includes(m.category);
            }).length;
            document.querySelector('[data-tab="saved"]').innerText = `Video (${vidCount})`;
            document.querySelector('[data-tab="quick"]').innerText = `Images (${imgCount})`;
        }

     // --- SIDE PANEL LOGIC (v15.8 Implementation) ---
        function initSidePanel() {
             const TARGET_TEXTAREA_SELECTOR = 'textarea[aria-label="Make a video"]';
             const RETRY_BUTTON_SELECTOR = 'button[aria-label="Make video"]';
             const MODERATION_TEXT = "Content Moderated. Try a different idea.";
             const RETRY_DELAY_MS = 1000;
             const COOLDOWN_MS = 2000;
             const GENERATION_COOLDOWN_MS = 3000;

             const DEFAULT_SNIPPETS = [
                {
                    id: 'b1', label: 'Anime Stickers (Provocative)',
                    text: 'Surrounding the central image: thick decorative border made of overlapping colorful anime-style stickers featuring nude anime girls with exaggerated proportions in various provocative poses. Each sticker has a white outline and slight drop shadow. The stickers completely frame all four edges of the image with some overlap into the main content.'
                },
                {
                    id: 'b2', label: 'Anime Stickers (SFW)',
                    text: 'Surrounding the central image: thick decorative border made of overlapping colorful anime-style stickers featuring anime girls with exaggerated proportions in various poses. Each sticker has a white outline and slight drop shadow. The stickers completely frame all four edges of the image with some overlap into the main content.'
                },
                { id: '1', label: 'Motion: Slow Mo', text: 'slow motion, high frame rate, smooth movement' },
                { id: '2', label: 'Style: Photorealistic', text: 'photorealistic, 8k resolution, highly detailed, unreal engine 5 render' },
                { id: '3', label: 'Lighting: Golden Hour', text: 'golden hour lighting, warm sun rays, lens flare, soft shadows' },
             ];

             // --- FIX: USE GLOBAL SETTINGS (No Independent State) ---
             // We load the initial state from the global manager settings
             const initS = getSettings();
             let savedSnippets = GM_getValue('savedSnippets', DEFAULT_SNIPPETS);
             let panelSize = GM_getValue('panelSize', { width: '300px', height: '400px' });

             let isRetryEnabled = true; // Side Panel "Master Switch" (Visual mostly)
             let lastTypedPrompt = "";
             let lastRetryTimestamp = 0;
             let lastGenerationTimestamp = 0;
             let moderationDetected = false;

             // Get keybind string for display
             const s = getSettings();
             const sideKbString = getKeybindString(s.sidePanelKeybind || { key: 'k', altKey: true, ctrlKey: false, shiftKey: false, metaKey: false });

             // --- DOM CREATION ---
             const panel = document.createElement('div');
             panel.id = 'grok-control-panel';
             panel.classList.add('hidden'); // Start hidden
             // We apply the saved size immediately
             panel.style.width = panelSize.width;
             panel.style.height = panelSize.height;

             panel.innerHTML = `
                 <div id="grok-side-resize-handle" title="Drag to Resize"></div>
                 <div class="grok-side-header">
                     <span class="grok-side-title">Grok Tools v15.8</span>
                     <button id="grok-side-toggle-btn" class="grok-side-toggle-btn">ON</button>
                     <button id="grok-side-close-x" style="background:none; border:none; color:#8b98a5; cursor:pointer; font-size:16px; font-weight:bold; line-height:1; padding:0 4px;" title="Hide Panel">&times;</button>
                 </div>
                 <div class="grok-side-controls">
                     <label class="grok-side-checkbox">
                         <input type="checkbox" id="grok-autoclick-cb" ${initS.retryEnabled ? 'checked' : ''}> Auto-Retry
                     </label>
                     <div>
                         Max: <input type="number" id="grok-retry-limit" value="${initS.maxRetries}" class="grok-side-num-input" min="1">
                     </div>
                 </div>
                 <div class="grok-side-prompt-label">Prompt Editor</div>
                 <textarea id="grok-panel-prompt" placeholder="Type or paste prompt here..."></textarea>
                 <div class="grok-side-btn-row">
                     <button id="btn-open-library" class="grok-side-action-btn">+ Snippets</button>
                     <button id="btn-generate" class="grok-side-action-btn">Generate</button>
                 </div>
                 <div id="grok-side-status">Ready</div>
                 <div style="font-size:9px; color:#555; text-align:center; flex-shrink:0;">Hide: ${sideKbString}</div>
             `;
             document.body.appendChild(panel);

             // --- LIBRARY MODAL ---
             const modal = document.createElement('div');
             modal.id = 'grok-library-modal';
             modal.innerHTML = `
                 <div class="gl-header"><span>Snippets Library</span><span class="gl-close">&times;</span></div>
                 <div class="gl-view-list" id="gl-view-list">
                     <div class="gl-list-content" id="gl-list-container"></div>
                     <div class="gl-create-btn" id="btn-create-snippet">Create New Snippet</div>
                 </div>
                 <div class="gl-view-editor" id="gl-view-editor">
                     <label style="font-size:11px; color:#8b98a5;">Label</label>
                     <input type="text" class="gl-input" id="gl-edit-label" placeholder="e.g. Cinematic Lighting">
                     <label style="font-size:11px; color:#8b98a5;">Prompt Text</label>
                     <textarea class="gl-textarea" id="gl-edit-text" placeholder="Content to append..."></textarea>
                     <div class="gl-editor-buttons">
                         <button class="gl-btn gl-btn-cancel" id="btn-edit-cancel">Cancel</button>
                         <button class="gl-btn gl-btn-save" id="btn-edit-save">Save Snippet</button>
                     </div>
                 </div>
             `;
             document.body.appendChild(modal);

             // --- RESIZE LOGIC ---
             const resizeHandle = document.getElementById('grok-side-resize-handle');
             let isResizing = false, startX, startY, startWidth, startHeight;

             function updateModalPosition() {
                 const pHeight = panel.offsetHeight;
                 modal.style.bottom = (20 + pHeight + 10) + 'px';
             }

             resizeHandle.addEventListener('mousedown', (e) => {
                 isResizing = true; startX = e.clientX; startY = e.clientY;
                 const rect = panel.getBoundingClientRect(); startWidth = rect.width; startHeight = rect.height;
                 e.preventDefault(); document.body.style.cursor = 'nwse-resize';
             });
             document.addEventListener('mousemove', (e) => {
                 if (!isResizing) return;
                 const deltaX = startX - e.clientX;
                 const deltaY = startY - e.clientY;
                 panel.style.width = Math.max(280, startWidth + deltaX) + 'px';
                 panel.style.height = Math.max(250, startHeight + deltaY) + 'px';
                 updateModalPosition();
             });
             document.addEventListener('mouseup', () => {
                 if (isResizing) {
                     isResizing = false; document.body.style.cursor = '';
                     const rect = panel.getBoundingClientRect();
                     GM_setValue('panelSize', { width: rect.width + 'px', height: rect.height + 'px' });
                     updateModalPosition();
                 }
             });

             // --- REFS ---
             const toggleBtn = document.getElementById('grok-side-toggle-btn');
             const promptBox = document.getElementById('grok-panel-prompt');
             const statusText = document.getElementById('grok-side-status');
             const listContainer = document.getElementById('gl-list-container');
             const editLabel = document.getElementById('gl-edit-label');
             const editText = document.getElementById('gl-edit-text');
             let editingId = null;

             function nativeValueSet(el, value) {
                 const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
                 setter.call(el, value); el.dispatchEvent(new Event('input', { bubbles: true }));
             }

             function escapeHtml(text) { return text ? text.replace(/&/g, "&amp;").replace(/</g, "&lt;") : ''; }

             // Prompt Sync: Panel -> Grok
             promptBox.addEventListener('input', () => {
                 const grokTA = document.querySelector(TARGET_TEXTAREA_SELECTOR);
                 if (grokTA) { lastTypedPrompt = promptBox.value; nativeValueSet(grokTA, lastTypedPrompt); resetState("Ready"); }
             });

             // Prompt Sync: Grok -> Panel (ADDED)
             document.addEventListener('input', (e) => {
                 if (e.target.matches(TARGET_TEXTAREA_SELECTOR)) {
                     const val = e.target.value;
                     if (val !== promptBox.value) {
                         promptBox.value = val;
                         lastTypedPrompt = val;
                     }
                     if (val.trim()) resetState("Ready");
                 }
             }, true);

             // --- GENERATE LOGIC ---
             document.getElementById('btn-generate').addEventListener('click', () => {
                 const grokTA = document.querySelector(TARGET_TEXTAREA_SELECTOR);
                 const realBtn = document.querySelector(RETRY_BUTTON_SELECTOR);
                 if (!grokTA || !realBtn) { updateStatus("Grok elements not found!", "error"); return; }

                 const now = Date.now();
                 if (now - lastGenerationTimestamp < GENERATION_COOLDOWN_MS) {
                    const remaining = Math.ceil((GENERATION_COOLDOWN_MS - (now - lastGenerationTimestamp)) / 1000);
                    updateStatus(`Cooldown: ${remaining}s remaining`, "error");
                    return;
                 }

                 nativeValueSet(grokTA, promptBox.value);
                 setTimeout(() => {
                     if(!realBtn.disabled) {
                         realBtn.click();
                         lastGenerationTimestamp = Date.now();
                         updateStatus("Generation Started...");
                     } else {
                         updateStatus("Grok button disabled.", "error");
                     }
                 }, 50);
             });

             // --- LIBRARY LOGIC ---
             function renderSnippets() {
                 listContainer.innerHTML = '';
                 savedSnippets.forEach(item => {
                     const el = document.createElement('div'); el.className = 'gl-item';
                     el.innerHTML = `<div class="gl-item-text"><b>${escapeHtml(item.label)}</b><span>${escapeHtml(item.text)}</span></div><div class="gl-item-actions"><button class="gl-icon-btn gl-btn-edit">✎</button><button class="gl-icon-btn gl-btn-del">🗑</button></div>`;
                     el.querySelector('.gl-item-text').addEventListener('click', () => {
                         const cur = promptBox.value; promptBox.value = cur + (cur && !cur.endsWith(' ') ? ' ' : '') + item.text; promptBox.dispatchEvent(new Event('input')); modal.classList.remove('active');
                     });
                     el.querySelector('.gl-btn-edit').addEventListener('click', (e) => { e.stopPropagation(); showEditor(item); });
                     el.querySelector('.gl-btn-del').addEventListener('click', (e) => { e.stopPropagation(); if(confirm('Delete?')) { savedSnippets = savedSnippets.filter(s=>s.id!==item.id); GM_setValue('savedSnippets', savedSnippets); renderSnippets(); }});
                     listContainer.appendChild(el);
                 });
             }
             function showEditor(item) {
                 document.getElementById('gl-view-list').style.display = 'none'; document.getElementById('gl-view-editor').classList.add('active');
                 editingId = item ? item.id : null; editLabel.value = item ? item.label : ''; editText.value = item ? item.text : ''; editText.focus();
             }
             document.getElementById('btn-create-snippet').onclick = () => showEditor(null);
             document.getElementById('btn-edit-save').onclick = () => {
                 const label = editLabel.value.trim() || 'Untitled', text = editText.value.trim();
                 if(!text) return;
                 if(editingId) { const idx = savedSnippets.findIndex(s=>s.id===editingId); if(idx>-1) { savedSnippets[idx].label = label; savedSnippets[idx].text = text; }}
                 else savedSnippets.push({ id: Date.now().toString(), label, text });
                 GM_setValue('savedSnippets', savedSnippets);
                 document.getElementById('gl-view-editor').classList.remove('active'); document.getElementById('gl-view-list').style.display = 'flex'; renderSnippets();
             };
             document.getElementById('btn-edit-cancel').onclick = () => { document.getElementById('gl-view-editor').classList.remove('active'); document.getElementById('gl-view-list').style.display = 'flex'; };
             document.getElementById('btn-open-library').onclick = () => { modal.classList.add('active'); updateModalPosition(); renderSnippets(); };
             document.querySelector('.gl-close').onclick = () => modal.classList.remove('active');

             // Toggle Button Logic (Master Visual Switch)
             toggleBtn.onclick = () => {
                 isRetryEnabled = !isRetryEnabled;
                 toggleBtn.textContent = isRetryEnabled ? "ON" : "OFF";
                 toggleBtn.classList.toggle('off', !isRetryEnabled);
                 resetState(isRetryEnabled ? "Ready" : "Panel Paused");
                 if(!isRetryEnabled) statusText.className = 'status-error';
             };

             // --- FIX: BIND SIDE PANEL INPUTS TO GLOBAL SETTINGS ---
             // This ensures that when you toggle auto-retry in the side panel,
             // it updates the main manager settings, preventing conflicts.
             document.getElementById('grok-autoclick-cb').onchange = (e) => {
                 const s = getSettings();
                 saveSettings({...s, retryEnabled: e.target.checked});
                 updateRetryStatus(); // Syncs status across both
                 showToast(e.target.checked ? "Auto-Retry Enabled" : "Auto-Retry Disabled");
             };

             document.getElementById('grok-retry-limit').onchange = (e) => {
                 const val = parseInt(e.target.value);
                 const s = getSettings();
                 saveSettings({...s, maxRetries: val});
                 updateRetryStatus(); // Update status text
             };

             // Close Button Logic
             document.getElementById('grok-side-close-x').onclick = () => {
                 panel.classList.add('hidden');
             };

             // --- RETRY OBSERVER (Fixed for Synchronization) ---
// This observer handles VISUAL updates (status text, cleaning DOM)
// It does NOT click the button anymore (Main Manager does that)
const observer = new MutationObserver(() => {
    // Only handle UI cleanup when panel master switch is on
    if (!isRetryEnabled) return;

    // 1. Find and remove toast notification (Side Panel Feature)
    const toastContainer = document.querySelector('section[aria-label="Notifications alt+T"]');
    if (toastContainer) {
        const errorToast = toastContainer.querySelector('li[data-type="error"]');
        if (errorToast && !moderationDetected) {
            moderationDetected = true;
            setTimeout(() => {
                if (errorToast && errorToast.parentElement) {
                    errorToast.remove();
                }
            }, 2000);
        }
    }

    // 2. Find and handle moderation message text
    const modSpan = Array.from(document.querySelectorAll('span')).find(s => s.textContent.trim() === MODERATION_TEXT);
    if (modSpan && moderationDetected) {
        const now = Date.now();
        if (now - lastRetryTimestamp < COOLDOWN_MS) return;

        // Remove the moderation message after 2 seconds
        setTimeout(() => {
            if (modSpan && modSpan.parentElement) {
                modSpan.parentElement.remove();
            }
            moderationDetected = false; // Reset flag after cleanup
        }, 2000);

        lastRetryTimestamp = now;
    }
});
observer.observe(document.body, {childList:true, subtree:true, characterData:true});

function resetState(msg) { updateStatus(msg); }
function updateStatus(msg, type) {
    statusText.textContent = msg;
    statusText.className = type === 'error' ? 'status-error' : '';
}

// Link Toggle Event
window.addEventListener('grokToggleSidePanel', () => {
    const isHidden = panel.classList.contains('hidden');
    panel.classList.toggle('hidden');
    if(isHidden) {
        // Sync input values when opening
        const s = getSettings();
        document.getElementById('grok-autoclick-cb').checked = s.retryEnabled;
        document.getElementById('grok-retry-limit').value = s.maxRetries;
        // Update status display to match current state
        updateRetryStatus();
    }
});
}

// --- INITIALIZATION ---
        const overlay = createUI();
        const modal = modalElement;
        setupAutoTracker();
        enforceVideoLoopState();
        initSidePanel();

        const handle = document.getElementById('grokDragHandle');
        handle.onmousedown = (e) => {
            if(e.target.closest('button')) return;
            isDragging = true;
            const rect = modal.getBoundingClientRect();
            dragOffset = { x: e.clientX - rect.left, y: e.clientY - rect.top };
            if (!getSettings().floatingMode) {
                modal.style.margin = '0';
                modal.style.position = 'absolute';
            }
        };
        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                const x = e.clientX - dragOffset.x;
                const y = e.clientY - dragOffset.y;
                modal.style.left = x + 'px';
                modal.style.top = y + 'px';
            }
            if (isResizing) {
                const rect = modal.getBoundingClientRect();
                modal.style.width = Math.max(380, e.clientX - rect.left) + 'px';
                modal.style.height = Math.max(200, e.clientY - rect.top) + 'px';
            }
        });
        document.addEventListener('mouseup', () => {
            if (isDragging || isResizing) {
                const s = getSettings();
                if (s.floatingMode) {
                    GM_setValue('grok_modal_pos_sidekick', { top: modal.style.top, left: modal.style.left, width: modal.style.width, height: modal.style.height });
                } else {
                    GM_setValue('grok_modal_pos_std', { top: modal.style.top, left: modal.style.left, width: modal.style.width, height: modal.style.height });
                }
            }
            isDragging = false; isResizing = false;
        });
        document.getElementById('grokResizeHandle').onmousedown = (e) => { e.preventDefault(); isResizing = true; };
        document.getElementById('grokCloseBtn').onclick = () => {
            overlay.classList.remove('open');
            setTimeout(() => overlay.style.display = 'none', 200);
            isOpen = false;
        };
        document.getElementById('grokSetDefaultBtn').onclick = () => {
            const modal = document.querySelector('.grok-prompt-modal');
            const currentDims = {
                top: modal.style.top,
                left: modal.style.left,
                width: modal.style.width,
                height: modal.style.height
            };
            const isSidekick = getSettings().floatingMode;
            if (isSidekick) {
                GM_setValue('grok_sidekick_defaults', JSON.stringify(currentDims));
                showToast('Sidekick Default Saved!');
            } else {
                GM_setValue('grok_custom_defaults', JSON.stringify(currentDims));
                showToast('Standard Default Saved!');
            }
        };
        document.getElementById('grokFactoryResetBtn').onclick = () => {
            const isSidekick = getSettings().floatingMode;
            if(!confirm(`Reset ${isSidekick ? 'Sidekick' : 'Standard'} window to original factory size?`)) return;
            if (isSidekick) GM_deleteValue('grok_sidekick_defaults');
            else GM_deleteValue('grok_custom_defaults');
            document.getElementById('grokResetSizeBtn').click();
        };
        document.getElementById('grokResetSizeBtn').onclick = (e) => {
            e.stopPropagation();
            const modal = document.querySelector('.grok-prompt-modal');
            const isSidekick = getSettings().floatingMode;
            let target;
            if (isSidekick) {
                const custom = JSON.parse(GM_getValue('grok_sidekick_defaults', 'null'));
                target = custom || { top: '130px', left: Math.max(0, window.innerWidth - 585) + 'px', width: '565px', height: '745px' };
            } else {
                const custom = JSON.parse(GM_getValue('grok_custom_defaults', 'null'));
                target = custom || { top: '100px', left: '100px', width: '1463px', height: '809px' };
            }
            modal.style.position = isSidekick ? 'fixed' : 'absolute';
            modal.style.margin = '0';
            modal.style.top = target.top;
            modal.style.left = target.left;
            modal.style.width = target.width;
            modal.style.height = target.height;
            if (isSidekick) GM_setValue('grok_modal_pos_sidekick', target);
            else GM_setValue('grok_modal_pos_std', target);
            showToast('Window Reset');
        };
        document.querySelectorAll('.grok-prompt-tab').forEach(tab => {
            tab.onclick = () => {
                document.querySelectorAll('.grok-prompt-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                selectedPromptIds.clear();
                const t = tab.dataset.tab;
                ['generate','recent','saved','quick','categories','settings'].forEach(id => {
                    document.getElementById('grok'+id.charAt(0).toUpperCase()+id.slice(1)+'Tab').style.display = (id === t ? (id==='categories' || id==='generate' || id==='settings' ? 'flex' : 'block') : 'none');
                });
                refreshActiveTab();
            };
        });
        // --- KEYBIND UI LOGIC ---
        const kbBtn = document.getElementById('grokKeybindBtn');
        const sideKbBtn = document.getElementById('grokSideKeybindBtn');

        kbBtn.onclick = () => {
            isRecordingKeybind = true; recordingTarget = 'main';
            kbBtn.classList.add('recording'); kbBtn.innerText = 'Press keys...';
        };
        sideKbBtn.onclick = () => {
            isRecordingKeybind = true; recordingTarget = 'side';
            sideKbBtn.classList.add('recording'); sideKbBtn.innerText = 'Press keys...';
        };

        const currentSettings = getSettings();
        if (currentSettings.hideVideoControls) {
            document.body.classList.add('grok-clean-mode');
        }
        document.getElementById('grokAutoTrackToggle').checked = currentSettings.autoTrack;
        document.getElementById('grokSilentModeToggle').checked = currentSettings.silentMode;
        document.getElementById('grokFloatingModeToggle').checked = currentSettings.floatingMode;
        document.getElementById('grokAutoStatsToggle').checked = currentSettings.useAutoStats;
        document.getElementById('grokVideoLoopToggle').checked = currentSettings.disableVideoLoop;
        document.getElementById('grokHideControlsToggle').checked = currentSettings.hideVideoControls;
        document.getElementById('grokAutoOpenToggle').checked = currentSettings.openOnLaunch;
        document.getElementById('grokRetryEnableToggle').checked = currentSettings.retryEnabled;

        document.getElementById('grokAutoTrackToggle').onchange = (e) => { saveSettings({...getSettings(), autoTrack: e.target.checked}); showToast(e.target.checked?'Auto-Capture On':'Auto-Capture Off'); };
        document.getElementById('grokSilentModeToggle').onchange = (e) => { saveSettings({...getSettings(), silentMode: e.target.checked}); showToast(e.target.checked?'Silent Mode On':'Silent Mode Off'); };
        document.getElementById('grokVideoLoopToggle').onchange = (e) => {
            const isDisabled = e.target.checked;
            saveSettings({...getSettings(), disableVideoLoop: isDisabled});
            enforceVideoLoopState();
            showToast(isDisabled ? 'Video Looping Disabled' : 'Video Looping Enabled');
        };
        document.getElementById('grokHideControlsToggle').onchange = (e) => {
            const isHidden = e.target.checked;
            saveSettings({...getSettings(), hideVideoControls: isHidden});
            if (isHidden) document.body.classList.add('grok-clean-mode');
            else document.body.classList.remove('grok-clean-mode');
            showToast(isHidden ? 'Overlay Controls Hidden' : 'Overlay Controls Visible');
        };
        document.getElementById('grokAutoStatsToggle').onchange = (e) => {
            const enabled = e.target.checked;
            saveSettings({...getSettings(), useAutoStats: enabled});
            showToast(enabled ? 'Auto-Stats Detection Enabled' : 'Switched to Manual Sliders');
            refreshActiveTab();
        };
        document.getElementById('grokAutoOpenToggle').onchange = (e) => {
            saveSettings({...getSettings(), openOnLaunch: e.target.checked});
            showToast(e.target.checked ? 'Will Open on Load' : 'Will Stay Hidden on Load');
        };

        // --- SIDE PANEL TRIGGER ---
        document.getElementById('grokOpenSidePanelBtn').onclick = () => {
            window.dispatchEvent(new CustomEvent('grokToggleSidePanel'));
        };

        // --- RETRY UI EVENTS ---
        document.getElementById('grokRetryEnableToggle').onchange = (e) => {
            saveSettings({...getSettings(), retryEnabled: e.target.checked});
            showToast(e.target.checked ? 'Auto-Retry Enabled' : 'Auto-Retry Disabled');
            updateRetryStatus();
        };
        document.getElementById('grokMaxRetryInput').onchange = (e) => {
             let val = parseInt(e.target.value);
             if(val < 1) val = 1;
             if(val > 50) val = 50;
             e.target.value = val;
             saveSettings({...getSettings(), maxRetries: val});
             updateRetryStatus();
        };
        document.getElementById('grokRetryResetBtn').onclick = () => {
            retryCount = 0;
            updateRetryStatus();
            showToast('Retry Count Reset');
        };

        // --- MODE SWITCHING LOGIC ---
        document.getElementById('grokFloatingModeToggle').onchange = (e) => {
            const isFloating = e.target.checked;
            saveSettings({...getSettings(), floatingMode: isFloating});
            overlay.classList.toggle('mode-floating', isFloating);
            overlay.classList.toggle('mode-centered', !isFloating);
            const defBtn = document.getElementById('grokSetDefaultBtn');
            defBtn.innerText = isFloating ? 'Set Sidekick Default' : 'Set Standard Default';
            const modal = document.querySelector('.grok-prompt-modal');
            if(isFloating) {
                 const pos = GM_getValue('grok_modal_pos_sidekick', null);
                 const def = JSON.parse(GM_getValue('grok_sidekick_defaults', 'null'));
                 modal.style.position = 'fixed';
                 if(pos) {
                     modal.style.top = pos.top; modal.style.left = pos.left; modal.style.width = pos.width; modal.style.height = pos.height;
                 } else if (def) {
                     modal.style.top = def.top; modal.style.left = def.left; modal.style.width = def.width; modal.style.height = def.height;
                 } else {
                     modal.style.top = '130px'; modal.style.left = Math.max(0, window.innerWidth - 585) + 'px';
                     modal.style.width = '565px'; modal.style.height = '745px';
                 }
                 showToast('Switched to Sidekick');
            } else {
                 const pos = GM_getValue('grok_modal_pos_std', null);
                 const def = JSON.parse(GM_getValue('grok_custom_defaults', 'null'));
                 modal.style.position = 'absolute';
                 if(pos) {
                     modal.style.top = pos.top; modal.style.left = pos.left; modal.style.width = pos.width; modal.style.height = pos.height;
                 } else if (def) {
                     modal.style.top = def.top; modal.style.left = def.left; modal.style.width = def.width; modal.style.height = def.height;
                 } else {
                     modal.style.top = '100px'; modal.style.left = '100px';
                     modal.style.width = '1463px'; modal.style.height = '809px';
                 }
                 showToast('Switched to Standard');
            }
        };
        document.getElementById('grokToggleQuickAdd').onclick = () => {
            const area = document.getElementById('grokQuickAddArea');
            const isHidden = area.style.display === 'none';
            area.style.display = isHidden ? 'block' : 'none';
            if(isHidden) document.getElementById('grokQuickAddInput').focus();
        };
        function quickAddTag(type) {
            const input = document.getElementById('grokQuickAddInput');
            const val = input.value.trim();
            if(!val) return;
            let cats = getCategories();
            if(cats.some(c => c.name === val)) return alert('Category exists');
            cats.push({ name: val, type: type });
            saveCategories(cats);
            renderCategories();
            updateCategorySelect();
            document.getElementById('grokCategorySelect').value = val;
            input.value = '';
            document.getElementById('grokQuickAddArea').style.display = 'none';
            showToast(`${type === 'video' ? 'Video' : 'Image'} Tag Created!`);
        }
        document.getElementById('grokQuickAddVidBtn').onclick = () => quickAddTag('video');
        document.getElementById('grokQuickAddImgBtn').onclick = () => quickAddTag('image');
        document.getElementById('grokCancelEditBtn').onclick = () => {
            editingPromptId = null;
            document.getElementById('grokPromptInput').value = '';
            const saveBtn = document.getElementById('grokSaveBtn');
            saveBtn.innerText = "Save Prompt";
            saveBtn.style.background = "var(--grok-primary)";
            document.getElementById('grokCancelEditBtn').style.display = 'none';
            showToast('Edit Cancelled');
        };
        // --- SAVE LOGIC ---
        document.getElementById('grokSaveBtn').onclick = () => {
            const text = document.getElementById('grokPromptInput').value.trim();
            if (!text) return alert('Please add text.');
            const cat = document.getElementById('grokCategorySelect').value;
            const prompts = getPrompts();
            // Check if current category is an Image Type
            const catObj = getCategories().find(c => c.name === cat);
            const isImageCat = catObj && catObj.type === 'image';
            // Grab context, BUT if it's an Image Category, force it to empty
            let currentAlt = getContextImageAlt();
            if (isImageCat) currentAlt = '';
            if (editingPromptId) {
                const idx = prompts.findIndex(x => x.id === editingPromptId);
                if (idx !== -1) {
                    prompts[idx].text = text;
                    prompts[idx].category = cat;
                    if (!prompts[idx].attachedAlt && currentAlt) {
                         prompts[idx].attachedAlt = currentAlt;
                    }
                    savePrompts(prompts);
                    showToast('Prompt Updated & Saved!');
                }
                editingPromptId = null;
                document.getElementById('grokSaveBtn').innerText = 'Save Prompt';
                document.getElementById('grokSaveBtn').style.background = 'var(--grok-primary)';
                document.getElementById('grokCancelEditBtn').style.display = 'none';
            } else {
                prompts.push({
                    id: Date.now().toString(),
                    text,
                    rating: 0,
                    category: cat,
                    attachedAlt: currentAlt,
                    timestamp: Date.now(),
                    stats: { attempts: 0, moderated: 0 },
                    moderation: 0
                });
                savePrompts(prompts);
                showToast('Prompt Saved!');
            }
            document.getElementById('grokPromptInput').value = '';
            if (isImageCat) document.querySelector('[data-tab="quick"]').click();
            else document.querySelector('[data-tab="saved"]').click();
        };
        document.getElementById('grokAddVideoCatBtn').onclick = () => {
            const val = document.getElementById('grokNewVideoCat').value.trim();
            if (!val) return;
            let cats = getCategories();
            if (cats.some(c => c.name === val)) return alert('Category exists');
            cats.push({ name: val, type: 'video' });
            saveCategories(cats);
            document.getElementById('grokNewVideoCat').value = '';
            renderCategories(); updateCategorySelect(); showToast('Video Category added');
        };
        document.getElementById('grokAddImageCatBtn').onclick = () => {
            const val = document.getElementById('grokNewImageCat').value.trim();
            if (!val) return;
            let cats = getCategories();
            if (cats.some(c => c.name === val)) return alert('Category exists');
            cats.push({ name: val, type: 'image' });
            saveCategories(cats);
            document.getElementById('grokNewImageCat').value = '';
            renderCategories(); updateCategorySelect(); showToast('Image Category added');
        };
        document.getElementById('grokExportBtn').onclick = () => {
            const blob = new Blob([JSON.stringify({ prompts: getPrompts(), categories: getCategories() }, null, 2)], {type: 'application/json'});
            const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `grok-prompts-${new Date().toISOString().split('T')[0]}.json`; a.click();
        };
        document.getElementById('grokImportBtn').onclick = () => document.getElementById('grokImportFile').click();
        document.getElementById('grokImportFile').onchange = (e) => {
            const fr = new FileReader();
            fr.onload = (ev) => {
                try {
                    const d = JSON.parse(ev.target.result);
                    let importedCats = d.categories || [];
                    if (importedCats.length > 0 && typeof importedCats[0] === 'string') {
                        importedCats = importedCats.map(c => ({ name: c, type: 'video' }));
                    }
                    if (confirm('Merge with existing (OK) or Replace All (Cancel)?')) {
                        let map = new Map(getPrompts().map(p => [p.id, p]));
                        (d.prompts || []).forEach(p => map.set(p.id, { ...map.get(p.id), ...p }));
                        savePrompts(Array.from(map.values()));
                        const currentCats = getCategories();
                        importedCats.forEach(ic => {
                            if (!currentCats.some(cc => cc.name === ic.name)) currentCats.push(ic);
                        });
                        saveCategories(currentCats);
                    } else {
                        savePrompts(d.prompts || []);
                        saveCategories(importedCats.length ? importedCats : [{name:'General', type:'video'}, {name:'General Image', type:'image'}]);
                    }
                    showToast('Import Successful'); refreshActiveTab(); renderCategories(); updateCategorySelect();
                } catch(err) { alert('Invalid file format'); }
            };
            fr.readAsText(e.target.files[0]);
        };
        document.getElementById('grokClearBtn').onclick = () => {
            if (confirm('PERMANENTLY DELETE ALL DATA? (Includes window position)')) {
                savePrompts([]);
                GM_deleteValue('grok_categories');
                GM_deleteValue('grok_categories_v2');
                GM_deleteValue('grok_modal_pos_sidekick');
                GM_deleteValue('grok_modal_pos_std');
                GM_deleteValue('grok_custom_defaults');
                GM_deleteValue('grok_sidekick_defaults');
                GM_deleteValue('grok_settings');
                location.reload();
            }
        };
        document.addEventListener('keydown', (e) => {
            if (isRecordingKeybind) {
                e.preventDefault(); e.stopPropagation();
                if (['Control','Alt','Shift','Meta'].includes(e.key)) return;
                const newKb = { key: e.key, altKey: e.altKey, ctrlKey: e.ctrlKey, shiftKey: e.shiftKey, metaKey: e.metaKey };

                if (recordingTarget === 'side') {
                    saveSettings({...getSettings(), sidePanelKeybind: newKb});
                    document.getElementById('grokSideKeybindDisplay').innerText = getKeybindString(newKb);
                    sideKbBtn.classList.remove('recording'); sideKbBtn.innerText = 'Change';
                } else {
                    saveSettings({...getSettings(), keybind: newKb});
                    document.getElementById('grokKeybindDisplay').innerText = getKeybindString(newKb);
                    kbBtn.classList.remove('recording'); kbBtn.innerText = 'Change';
                }
                isRecordingKeybind = false; showToast('Keybind Saved');
                return;
            }
            if (e.altKey && e.key.toLowerCase() === 'l') {
                e.preventDefault();
                const s = getSettings();
                const newState = !s.disableVideoLoop;
                saveSettings({ ...s, disableVideoLoop: newState });
                document.getElementById('grokVideoLoopToggle').checked = newState;
                enforceVideoLoopState();
                showToast(newState ? 'Video Looping Disabled' : 'Video Looping Enabled');
                return;
            }
            const s = getSettings();
            const kb = s.keybind;
            // MAIN KEYBIND CHECK
            if (e.key.toLowerCase() === kb.key.toLowerCase() && e.altKey === !!kb.altKey && e.ctrlKey === !!kb.ctrlKey && e.shiftKey === !!kb.shiftKey && e.metaKey === !!kb.metaKey) {
                e.preventDefault();
                isOpen = !isOpen;
                if (isOpen) {
                    overlay.style.display = 'flex'; overlay.offsetHeight; overlay.classList.add('open');
                    updateCounts(); updateCategorySelect(); refreshActiveTab();
                } else {
                    overlay.classList.remove('open'); setTimeout(() => overlay.style.display = 'none', 200);
                }
            }
            // SIDE PANEL KEYBIND CHECK (Default Alt+K)
            const sideKb = s.sidePanelKeybind || { key: 'k', altKey: true, ctrlKey: false, shiftKey: false, metaKey: false };
            if (e.key.toLowerCase() === sideKb.key.toLowerCase() && e.altKey === !!sideKb.altKey && e.ctrlKey === !!sideKb.ctrlKey && e.shiftKey === !!sideKb.shiftKey && e.metaKey === !!sideKb.metaKey) {
                 e.preventDefault();
                 window.dispatchEvent(new CustomEvent('grokToggleSidePanel'));
            }

            if (e.key === 'Escape' && isOpen) document.getElementById('grokCloseBtn').click();
        });
        updateCounts(); updateCategorySelect(); updateRetryStatus();
        if (currentSettings.openOnLaunch) {
            isOpen = true;
            overlay.style.display = 'flex';
            overlay.offsetHeight;
            overlay.classList.add('open');
            updateCounts(); updateCategorySelect(); refreshActiveTab();
        }
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initScript);
    else initScript();
})();