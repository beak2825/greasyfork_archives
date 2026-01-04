// ==UserScript==
// @name         Grok Auto-Retry + Prompt Snippets + History + Favorites (v36 - History Nav)
// @namespace    http://tampermonkey.net/
// @version      36
// @description  Navigation arrows cycle through permanent prompt history with clear at end
// @author       You
// @license      MIT
// @match        https://grok.com/*
// @match        https://*.grok.com/*
// @match        https://grok.x.ai/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/557842/Grok%20Auto-Retry%20%2B%20Prompt%20Snippets%20%2B%20History%20%2B%20Favorites%20%28v36%20-%20History%20Nav%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557842/Grok%20Auto-Retry%20%2B%20Prompt%20Snippets%20%2B%20History%20%2B%20Favorites%20%28v36%20-%20History%20Nav%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- CONFIGURATION ---
    // User provided selector for video:
    const TARGET_TEXTAREA_SELECTOR = 'textarea[aria-label="Make a video"]';
    // Image selectors
    const IMAGE_EDITOR_SELECTOR = 'textarea[aria-label="Type to edit image..."]';
    const IMAGE_PROMPT_SELECTOR = 'textarea[aria-label="Image prompt"]';
    const IMAGE_IMAGINE_SELECTOR = 'p[data-placeholder="Type to imagine"]';

    // Buttons
    const RETRY_BUTTON_SELECTOR = 'button[aria-label="Make video"]';
    const IMAGE_EDITOR_BUTTON_SELECTOR = 'button[aria-label="Generate"]';
    const IMAGE_SUBMIT_BUTTON_SELECTOR = 'button[aria-label="Submit"]';

    const MODERATION_PATTERNS = [
        "content moderated",
        "try a different idea",
        "moderated",
        "content policy",
        "cannot generate",
        "unable to generate"
    ];

    const RETRY_DELAY_MS = 1500;
    const OBSERVER_THROTTLE_MS = 300;
    const MAX_HISTORY_ITEMS = 500;
    const DEBUG_MODE = true;

    // --- DEFAULT SNIPPETS ---
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

    // --- LOAD SAVED SETTINGS ---
    let maxRetries = GM_getValue('maxRetries', 5);
    let uiToggleKey = GM_getValue('uiToggleKey', 'h');
    let autoClickEnabled = GM_getValue('autoClickEnabled', true);
    let isUiVisible = GM_getValue('isUiVisible', true);
    let savedSnippets = GM_getValue('savedSnippets', DEFAULT_SNIPPETS);
    let videoPromptHistory = GM_getValue('videoPromptHistory', []);
    let imagePromptHistory = GM_getValue('imagePromptHistory', []);
    let videoFavorites = GM_getValue('videoFavorites', []);
    let imageFavorites = GM_getValue('imageFavorites', []);
    let panelSize = GM_getValue('panelSize', { width: '300px', height: '460px' });

    // --- LOAD SAVED POSITIONS ---
    let mainPos = GM_getValue('pos_main', { top: 'auto', left: 'auto', bottom: '20px', right: '20px' });
    let libPos = GM_getValue('pos_lib', { top: '100px', left: '100px' });
    let favPos = GM_getValue('pos_fav', { top: '120px', left: '120px' });
    let histPos = GM_getValue('pos_hist', { top: '140px', left: '140px' });

    let isRetryEnabled = true;
    let limitReached = false;
    let currentRetryCount = 0;
    let lastTypedPrompt = "";
    let lastGenerationTimestamp = 0;
    const GENERATION_COOLDOWN_MS = 3000;

    let observerThrottle = false;
    let moderationDetected = false;
    let processingModeration = false;
    let currentHistoryTab = 'video';
    let currentFavoritesTab = 'video';
    let currentEditingFavId = null;
    let lastModerationCheck = 0;
    let errorWaitInterval = null;

    // --- HISTORY NAVIGATION VARIABLES ---
    let historyNavIndex = -1; // -1 means current (not navigating), 0+ means position in history

    // --- DEBUG LOGGER ---
    function debugLog(...args) {
        if (DEBUG_MODE) {
            console.log('[Grok Tools]', ...args);
        }
    }

    // --- STYLES ---
    GM_addStyle(`
        #grok-control-panel {
            position: fixed;
            width: ${panelSize.width}; height: ${panelSize.height};
            min-width: 280px; min-height: 250px; max-width: 90vw; max-height: 90vh;
            background: linear-gradient(145deg, #0a0a0a 0%, #1a1a1a 100%);
            border: 1px solid #2a2a2a;
            border-radius: 16px;
            padding: 15px;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            color: #e0e0e0;
            z-index: 99990;
            box-shadow: 0 8px 32px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.05);
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        #grok-control-panel.hidden { display: none !important; }

        .grok-header, .gl-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-shrink: 0;
            margin-left: 10px;
            padding-bottom: 8px;
            border-bottom: 1px solid #2a2a2a;
            cursor: move;
            user-select: none;
        }
        .gl-header {
            padding: 12px 15px;
            margin-left: 0;
            background: linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%);
            border-radius: 16px 16px 0 0;
            font-weight: bold; font-size: 13px; color: #f0f0f0;
        }

        #grok-resize-handle {
            position: absolute; top: 0; left: 0; width: 15px; height: 15px;
            cursor: nwse-resize; z-index: 99999;
        }
        #grok-resize-handle::after {
            content: ''; position: absolute; top: 2px; left: 2px;
            border-top: 6px solid #3b82f6; border-right: 6px solid transparent;
            width: 0; height: 0; opacity: 0.7;
        }
        #grok-resize-handle:hover::after { opacity: 1; border-top-color: #60a5fa; }

        .grok-title {
            font-weight: bold; font-size: 14px; color: #f0f0f0;
            text-shadow: 0 2px 4px rgba(0,0,0,0.5); pointer-events: none;
        }
        .grok-toggle-btn {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            border: none; color: white; padding: 6px 14px; border-radius: 20px;
            font-size: 11px; font-weight: bold; cursor: pointer;
            box-shadow: 0 2px 8px rgba(16, 185, 129, 0.4);
            transition: all 0.2s ease;
        }
        .grok-toggle-btn.off {
            background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
            box-shadow: 0 2px 8px rgba(239, 68, 68, 0.4);
        }
        .grok-controls {
            display: flex; align-items: center; justify-content: space-between;
            font-size: 12px; color: #9ca3af; flex-shrink: 0; padding: 8px 0;
        }
        .grok-checkbox { display: flex; align-items: center; cursor: pointer; color: #d1d5db; }
        .grok-checkbox input { margin-right: 6px; cursor: pointer; accent-color: #3b82f6; }
        .grok-num-input {
            width: 40px; background: #1f1f1f; border: 1px solid #2a2a2a;
            color: #e0e0e0; border-radius: 6px; padding: 4px 6px; text-align: center;
        }

        /* NAV BUTTON STYLES */
        .grok-prompt-header-row {
            display: flex; justify-content: space-between; align-items: center; margin-bottom: -5px; flex-shrink: 0;
        }
        .grok-prompt-label {
            font-size: 11px; font-weight: bold; color: #9ca3af;
        }
        .grok-nav-container { display: flex; gap: 4px; align-items: center; }
        .grok-nav-btn {
            background: #1f1f1f; border: 1px solid #333; color: #888;
            cursor: pointer; padding: 2px 8px; border-radius: 4px;
            font-size: 10px; transition: all 0.2s; min-width: 25px;
        }
        .grok-nav-btn:hover:not(:disabled) { background: #333; color: #fff; border-color: #555; }
        .grok-nav-btn:disabled { opacity: 0.3; cursor: default; }
        .grok-nav-counter {
            font-size: 9px; color: #666; min-width: 50px; text-align: center;
        }

        #grok-panel-prompt {
            width: 100%; flex-grow: 1; background: #0f0f0f; border: 1px solid #2a2a2a;
            border-radius: 8px; color: #e0e0e0; padding: 10px; font-size: 12px;
            font-family: 'SF Mono', 'Monaco', 'Consolas', monospace; resize: none;
            box-sizing: border-box; transition: all 0.2s ease; margin-top: 5px;
        }
        #grok-panel-prompt:focus {
            border-color: #3b82f6; outline: none; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
        }
        .grok-btn-row { display: flex; gap: 8px; flex-shrink: 0; }
        .grok-action-btn {
            flex: 1; padding: 10px; border-radius: 8px; border: none; cursor: pointer;
            font-weight: 600; font-size: 12px; transition: all 0.2s ease;
            position: relative; overflow: hidden;
        }
        .grok-action-btn:hover { transform: translateY(-1px); }

        #btn-open-library { background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; }
        #btn-open-favorites { background: linear-gradient(135deg, #ec4899 0%, #db2777 100%); color: white; }
        #btn-open-history { background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); color: white; }
        #btn-generate { background: linear-gradient(135deg, #1f1f1f 0%, #2a2a2a 100%); color: #e0e0e0; border: 1px solid #3a3a3a; }

        #grok-status {
            text-align: center; font-size: 11px; color: #10b981; padding-top: 8px;
            border-top: 1px solid #2a2a2a; flex-shrink: 0; font-weight: 500;
        }
        .status-error { color: #ef4444 !important; }
        .status-warning { color: #f59e0b !important; }

        /* Import/Export Panel */
        #grok-io-container.io-hidden { display: none; }
        #grok-io-container {
            display: flex; gap: 8px; margin-top: 5px; padding-top: 5px; border-top: 1px solid #2a2a2a;
        }
        .io-btn {
            flex: 1; background: #1f1f1f; color: #9ca3af; border: 1px solid #2a2a2a;
            border-radius: 6px; padding: 5px; font-size: 10px; cursor: pointer;
        }
        .io-btn:hover { background: #333; color: #fff; }

        /* Modal Styles */
        .grok-modal {
            position: fixed;
            width: 350px; height: 400px;
            background: linear-gradient(145deg, #0a0a0a 0%, #1a1a1a 100%);
            border: 1px solid #2a2a2a;
            border-radius: 16px;
            display: none; flex-direction: column;
            z-index: 99995;
            box-shadow: 0 8px 32px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.05);
            font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        }
        .grok-modal.active { display: flex; }
        .gl-close {
            cursor: pointer; font-size: 20px; line-height: 1; color: #6b7280;
            width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;
        }
        .gl-close:hover { color: #f0f0f0; }

        /* History Tab Styles */
        .history-tabs { display: flex; background: #0f0f0f; border-bottom: 1px solid #2a2a2a; }
        .history-tab {
            flex: 1; padding: 10px; text-align: center; cursor: pointer;
            font-size: 11px; font-weight: 600; color: #6b7280; border-bottom: 2px solid transparent;
        }
        .history-tab:hover { color: #9ca3af; background: #1a1a1a; }
        .history-tab.active { color: #8b5cf6; border-bottom-color: #8b5cf6; background: #1a1a1a; }

        .gl-view-list { display: flex; flex-direction: column; height: 100%; overflow: hidden; }
        .gl-list-content { overflow-y: auto; padding: 12px; flex: 1; display: flex; flex-direction: column; gap: 8px; }
        .gl-list-content::-webkit-scrollbar { width: 8px; }
        .gl-list-content::-webkit-scrollbar-thumb { background: #2a2a2a; border-radius: 4px; }

        .gl-item {
            background: linear-gradient(135deg, #1a1a1a 0%, #151515 100%);
            border: 1px solid #2a2a2a; padding: 10px; border-radius: 8px;
            display: flex; justify-content: space-between; align-items: center;
            font-size: 12px; color: #e0e0e0; transition: all 0.2s ease;
        }
        .gl-item:hover { border-color: #3b82f6; background: linear-gradient(135deg, #1f1f1f 0%, #1a1a1a 100%); }
        .gl-item-text { cursor: pointer; flex: 1; margin-right: 10px; }
        .gl-item-text b { display: block; margin-bottom: 4px; color: #f0f0f0; }
        .gl-item-text span {
            color: #9ca3af; font-size: 10px; display: -webkit-box;
            -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
        }
        .gl-item-actions { display: flex; gap: 6px; }
        .gl-icon-btn {
            background: #1f1f1f; border: 1px solid #2a2a2a; cursor: pointer;
            font-size: 14px; color: #9ca3af; padding: 6px; border-radius: 6px;
            width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;
        }
        .gl-icon-btn:hover { color: #f0f0f0; background: #2a2a2a; transform: scale(1.1); }
        .gl-icon-btn.favorite { color: #ec4899; }

        .gl-create-btn, .history-clear-btn {
            margin: 12px; padding: 10px; background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white; text-align: center; border-radius: 8px; cursor: pointer;
            font-weight: 600; font-size: 12px;
        }
        .history-clear-btn { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); }

        .gl-view-editor { display: none; flex-direction: column; padding: 15px; height: 100%; gap: 10px; }
        .gl-view-editor.active { display: flex; }
        .history-viewer { display: none; }
        .history-viewer.active { display: flex; }
        .gl-input, .gl-textarea {
            background: #0f0f0f; border: 1px solid #2a2a2a; color: #e0e0e0;
            padding: 10px; border-radius: 8px; font-size: 12px; width: 100%; box-sizing: border-box;
        }
        .gl-input:focus, .gl-textarea:focus { border-color: #3b82f6; outline: none; }
        .gl-textarea { flex-grow: 1; resize: none; font-family: 'SF Mono', 'Monaco', 'Consolas', monospace; }

        .gl-editor-buttons { display: flex; gap: 10px; margin-top: auto; }
        .gl-btn { flex: 1; padding: 10px; border-radius: 8px; border: none; cursor: pointer; font-weight: 600; color: white; font-size: 12px; }
        .gl-btn-save { background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); }
        .gl-btn-cancel { background: linear-gradient(135deg, #374151 0%, #1f2937 100%); }

        .history-item-time { font-size: 9px; color: #6b7280; margin-top: 3px; }
    `);

    // --- DOM CREATION (MAIN PANEL) ---
    const panel = document.createElement('div');
    panel.id = 'grok-control-panel';

    // Apply saved position
    if (mainPos.top !== 'auto') {
        panel.style.top = mainPos.top;
        panel.style.left = mainPos.left;
        panel.style.bottom = 'auto';
        panel.style.right = 'auto';
    } else {
        panel.style.bottom = mainPos.bottom;
        panel.style.right = mainPos.right;
    }

    if (!isUiVisible) panel.classList.add('hidden');
    panel.innerHTML = `
        <div id="grok-resize-handle" title="Drag to Resize"></div>
        <div class="grok-header" id="grok-main-header">
            <span class="grok-title">Grok Tools v34</span>
            <button id="grok-toggle-btn" class="grok-toggle-btn">ON</button>
        </div>
        <div class="grok-controls">
            <label class="grok-checkbox">
                <input type="checkbox" id="grok-autoclick-cb" ${autoClickEnabled ? 'checked' : ''}> Auto-Retry
            </label>
            <div>
                Max: <input type="number" id="grok-retry-limit" value="${maxRetries}" class="grok-num-input" min="1">
            </div>
        </div>
        <div class="grok-prompt-header-row">
            <div class="grok-prompt-label">Prompt Editor</div>
            <div class="grok-nav-container">
                <button id="btn-hist-prev" class="grok-nav-btn" title="Previous in History (Alt+Left)">◀</button>
                <span id="hist-nav-counter" class="grok-nav-counter">-</span>
                <button id="btn-hist-next" class="grok-nav-btn" title="Next in History (Alt+Right)">▶</button>
            </div>
        </div>
        <textarea id="grok-panel-prompt" placeholder="Type or paste prompt here..."></textarea>
        <div class="grok-btn-row">
            <button id="btn-open-library" class="grok-action-btn">Snippets</button>
            <button id="btn-open-favorites" class="grok-action-btn">❤️</button>
            <button id="btn-open-history" class="grok-action-btn">History</button>
            <button id="btn-generate" class="grok-action-btn">Generate</button>
        </div>
        <div id="grok-status">Ready</div>
        <div id="grok-io-container" class="io-hidden">
            <button id="btn-export-all" class="io-btn">Export Data ⬇️</button>
            <button id="btn-import-all" class="io-btn">Import Data ⬆️</button>
            <input type="file" id="grok-import-file" style="display:none" accept=".json">
        </div>
        <div style="font-size:9px; color:#555; text-align:center;">UI: Alt+${uiToggleKey.toUpperCase()} | I/O: Alt+I</div>
    `;
    document.body.appendChild(panel);

    // --- LIBRARY MODAL ---
    const modal = document.createElement('div');
    modal.id = 'grok-library-modal';
    modal.className = 'grok-modal';
    modal.style.top = libPos.top;
    modal.style.left = libPos.left;
    modal.innerHTML = `
        <div class="gl-header" id="lib-header"><span>Snippets Library</span><span class="gl-close">&times;</span></div>
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

    // --- FAVORITES MODAL ---
    const favoritesModal = document.createElement('div');
    favoritesModal.id = 'grok-favorites-modal';
    favoritesModal.className = 'grok-modal';
    favoritesModal.style.top = favPos.top;
    favoritesModal.style.left = favPos.left;
    favoritesModal.innerHTML = `
        <div class="gl-header" id="fav-header"><span>Favorites ❤️</span><span class="gl-close favorites-close">&times;</span></div>
        <div class="history-tabs">
            <div class="history-tab active" data-tab="video">🎥 Video</div>
            <div class="history-tab" data-tab="image">🖼️ Image</div>
        </div>
        <div class="gl-view-list" id="favorites-view-list">
            <div class="gl-list-content" id="favorites-list-container"></div>
        </div>
        <div class="gl-view-editor" id="favorites-view-viewer">
            <label style="font-size:11px; color:#8b98a5;">Name / Label</label>
            <input type="text" class="gl-input" id="fav-edit-label" placeholder="Favorite Name">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px; margin-top:10px;">
                <label style="font-size:11px; color:#8b98a5;">Prompt Text</label>
                <span id="favorites-viewer-time" style="font-size:9px; color:#6b7280;"></span>
            </div>
            <textarea class="gl-textarea" id="favorites-viewer-text"></textarea>
            <div class="gl-editor-buttons">
                <button class="gl-btn gl-btn-cancel" id="btn-fav-viewer-back">Cancel</button>
                <button class="gl-btn gl-btn-save" id="btn-fav-viewer-save">Save Changes</button>
            </div>
        </div>
    `;
    document.body.appendChild(favoritesModal);

    // --- HISTORY MODAL ---
    const historyModal = document.createElement('div');
    historyModal.id = 'grok-history-modal';
    historyModal.className = 'grok-modal';
    historyModal.style.top = histPos.top;
    historyModal.style.left = histPos.left;
    historyModal.innerHTML = `
        <div class="gl-header" id="hist-header"><span>Prompt History (500 max)</span><span class="gl-close history-close">&times;</span></div>
        <div class="history-tabs">
            <div class="history-tab active" data-tab="video">🎥 Video</div>
            <div class="history-tab" data-tab="image">🖼️ Image</div>
        </div>
        <div class="gl-view-list" id="history-view-list">
            <div class="gl-list-content" id="history-list-container"></div>
            <div style="display: flex; gap: 8px; margin: 12px;">
                <div class="gl-create-btn" id="btn-create-history-prompt" style="flex: 1;">Create New Prompt</div>
                <div class="history-clear-btn" id="btn-clear-history" style="flex: 1;">Clear History</div>
            </div>
        </div>
        <div class="gl-view-editor history-viewer" id="history-view-viewer">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                <label style="font-size:11px; color:#9ca3af; font-weight: 600;">Full Prompt</label>
                <span id="history-viewer-time" style="font-size:9px; color:#6b7280;"></span>
            </div>
            <textarea class="gl-textarea" id="history-viewer-text" readonly></textarea>
            <div class="gl-editor-buttons">
                <button class="gl-btn gl-btn-cancel" id="btn-viewer-back">← Back</button>
                <button class="gl-btn gl-btn-save" id="btn-viewer-use">Use This Prompt</button>
            </div>
        </div>
        <div class="gl-view-editor" id="history-view-creator">
            <label style="font-size:11px; color:#8b98a5; margin-bottom: 5px;">Create New Prompt</label>
            <textarea class="gl-textarea" id="history-creator-text" placeholder="Enter your prompt here..."></textarea>
            <div class="gl-editor-buttons">
                <button class="gl-btn gl-btn-cancel" id="btn-creator-cancel">Cancel</button>
                <button class="gl-btn gl-btn-save" id="btn-creator-save">Save to History</button>
            </div>
        </div>
    `;
    document.body.appendChild(historyModal);


    // --- DRAGGABLE FUNCTIONALITY ---
    function makeDraggable(element, handleSelector, saveKey) {
        const handle = element.querySelector(handleSelector);
        let isDragging = false;
        let startX, startY, initialLeft, initialTop;

        handle.addEventListener('mousedown', (e) => {
            const allModals = document.querySelectorAll('.grok-modal, #grok-control-panel');
            let maxZ = 99990;
            allModals.forEach(el => {
                const z = parseInt(window.getComputedStyle(el).zIndex) || 0;
                if(z > maxZ) maxZ = z;
            });
            element.style.zIndex = maxZ + 1;

            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;

            const rect = element.getBoundingClientRect();
            initialLeft = rect.left;
            initialTop = rect.top;

            element.style.right = 'auto';
            element.style.bottom = 'auto';
            element.style.width = rect.width + 'px';

            document.body.style.cursor = 'move';
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;

            element.style.left = `${initialLeft + dx}px`;
            element.style.top = `${initialTop + dy}px`;
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                document.body.style.cursor = '';
                const rect = element.getBoundingClientRect();
                const pos = { top: rect.top + 'px', left: rect.left + 'px' };
                GM_setValue(saveKey, pos);
            }
        });
    }

    makeDraggable(panel, '#grok-main-header', 'pos_main');
    makeDraggable(modal, '#lib-header', 'pos_lib');
    makeDraggable(favoritesModal, '#fav-header', 'pos_fav');
    makeDraggable(historyModal, '#hist-header', 'pos_hist');


    // --- RESIZE LOGIC ---
    const resizeHandle = document.getElementById('grok-resize-handle');
    let isResizing = false;
    let rStartX, rStartY, rStartW, rStartH;

    resizeHandle.addEventListener('mousedown', (e) => {
        isResizing = true;
        rStartX = e.clientX;
        rStartY = e.clientY;
        const rect = panel.getBoundingClientRect();
        rStartW = rect.width;
        rStartH = rect.height;
        e.preventDefault();
        e.stopPropagation();
        document.body.style.cursor = 'nwse-resize';
    });

    document.addEventListener('mousemove', (e) => {
        if (!isResizing) return;
        const deltaX = rStartX - e.clientX;
        const deltaY = rStartY - e.clientY;
        const newWidth = Math.max(280, rStartW + deltaX);
        const newHeight = Math.max(250, rStartH + deltaY);
        panel.style.width = newWidth + 'px';
        panel.style.height = newHeight + 'px';
    });

    document.addEventListener('mouseup', () => {
        if (isResizing) {
            isResizing = false;
            document.body.style.cursor = '';
            GM_setValue('panelSize', { width: panel.style.width, height: panel.style.height });
        }
    });

    // --- HELPER FUNCTIONS ---
    function nativeValueSet(el, value) {
        if (!el) return;
        const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
        setter.call(el, value);
        el.dispatchEvent(new Event('input', { bubbles: true }));
    }

    function resetState(msg) {
        limitReached = false;
        currentRetryCount = 0;
        moderationDetected = false;
        processingModeration = false;
        if (errorWaitInterval) {
            clearInterval(errorWaitInterval);
            errorWaitInterval = null;
        }
        updateStatus(msg);
    }

    function updateStatus(msg, type) {
        const statusText = document.getElementById('grok-status');
        if (!statusText) return;
        statusText.textContent = msg;
        statusText.className = '';
        if (type === 'error') statusText.classList.add('status-error');
        if (type === 'warning') statusText.classList.add('status-warning');
    }

    function formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        if (diff < 60000) return 'Just now';
        if (diff < 3600000) {
            const mins = Math.floor(diff / 60000);
            return `${mins} min${mins > 1 ? 's' : ''} ago`;
        }
        if (diff < 86400000) {
            const hours = Math.floor(diff / 3600000);
            return `${hours} hr${hours > 1 ? 's' : ''} ago`;
        }
        return date.toLocaleDateString();
    }

    function escapeHtml(text) {
        return text ? text.replace(/&/g, "&amp;").replace(/</g, "&lt;") : '';
    }

    function toggleModal(targetModal) {
        const allModals = document.querySelectorAll('.grok-modal, #grok-control-panel');
        let maxZ = 99990;
        allModals.forEach(el => {
            const z = parseInt(window.getComputedStyle(el).zIndex) || 0;
            if(z > maxZ) maxZ = z;
        });
        targetModal.style.zIndex = maxZ + 1;

        if (targetModal.classList.contains('active')) {
            targetModal.classList.remove('active');
        } else {
            targetModal.classList.add('active');
        }
    }

    // Helper to find the active grok input easily
    function getGrokInput() {
        return document.querySelector(TARGET_TEXTAREA_SELECTOR) ||
               document.querySelector(IMAGE_EDITOR_SELECTOR) ||
               document.querySelector(IMAGE_PROMPT_SELECTOR);
    }
    function getGrokImagine() {
        return document.querySelector(IMAGE_IMAGINE_SELECTOR);
    }


    // --- HISTORY NAVIGATION LOGIC ---
    const promptBox = document.getElementById('grok-panel-prompt');
    const btnHistPrev = document.getElementById('btn-hist-prev');
    const btnHistNext = document.getElementById('btn-hist-next');
    const histNavCounter = document.getElementById('hist-nav-counter');

    // Combined history from both video and image, sorted by timestamp
    function getCombinedHistory() {
        const combined = [
            ...videoPromptHistory.map(h => ({...h, source: 'video'})),
            ...imagePromptHistory.map(h => ({...h, source: 'image'}))
        ];
        // Sort by timestamp descending (newest first)
        return combined.sort((a, b) => b.timestamp - a.timestamp);
    }

    function updateHistoryNavButtons() {
        const history = getCombinedHistory();
        
        if (history.length === 0) {
            btnHistPrev.disabled = true;
            btnHistNext.disabled = true;
            histNavCounter.textContent = '-';
            return;
        }

        // If we're at -1 (current/not navigating)
        if (historyNavIndex === -1) {
            btnHistPrev.disabled = false;
            btnHistNext.disabled = false; // Allow clearing
            histNavCounter.textContent = 'current';
        } else {
            // We're navigating history
            btnHistPrev.disabled = (historyNavIndex >= history.length - 1);
            btnHistNext.disabled = false;
            histNavCounter.textContent = `${historyNavIndex + 1}/${history.length}`;
        }
    }

    function navigateHistory(direction) {
        const history = getCombinedHistory();
        
        if (history.length === 0) {
            updateStatus('No history available', 'warning');
            setTimeout(() => updateStatus('Ready'), 2000);
            return;
        }

        if (direction === -1) {
            // Going backwards (older)
            if (historyNavIndex === -1) {
                // Start from the beginning
                historyNavIndex = 0;
            } else if (historyNavIndex < history.length - 1) {
                historyNavIndex++;
            } else {
                // Already at the oldest
                return;
            }
            
            promptBox.value = history[historyNavIndex].text;
            
        } else if (direction === 1) {
            // Going forwards (newer) or clearing
            if (historyNavIndex === -1) {
                // Already at current - clear the prompt
                promptBox.value = '';
                updateStatus('Cleared', 'warning');
                setTimeout(() => updateStatus('Ready'), 1500);
            } else if (historyNavIndex === 0) {
                // Next would be "current" - go to current
                historyNavIndex = -1;
                promptBox.value = '';
            } else {
                // Move to newer prompt
                historyNavIndex--;
                promptBox.value = history[historyNavIndex].text;
            }
        }

        updateHistoryNavButtons();
        
        // Sync to website input if user wants
        const grokTA = getGrokInput();
        const imagineP = getGrokImagine();
        if (grokTA) {
            nativeValueSet(grokTA, promptBox.value);
        } else if (imagineP) {
            imagineP.textContent = promptBox.value;
            if (imagineP.classList.contains('is-empty') && promptBox.value) {
                imagineP.classList.remove('is-empty');
            } else if (!promptBox.value) {
                imagineP.classList.add('is-empty');
            }
        }
    }

    btnHistPrev.addEventListener('click', () => navigateHistory(-1));
    btnHistNext.addEventListener('click', () => navigateHistory(1));

    // Keyboard Shortcuts for Nav (Alt+Left / Alt+Right) inside prompt box
    promptBox.addEventListener('keydown', (e) => {
        if (e.altKey && e.key === 'ArrowLeft') {
            e.preventDefault();
            navigateHistory(-1);
        }
        if (e.altKey && e.key === 'ArrowRight') {
            e.preventDefault();
            navigateHistory(1);
        }
    });

    // When user types in prompt box, reset navigation to "current"
    promptBox.addEventListener('input', () => {
        if (document.activeElement === promptBox) {
            // User is typing, reset to current
            historyNavIndex = -1;
            updateHistoryNavButtons();
            
            const grokTA = getGrokInput();
            const imagineP = getGrokImagine();

            lastTypedPrompt = promptBox.value;

            if (grokTA) {
                nativeValueSet(grokTA, lastTypedPrompt);
                resetState("Ready");
            } else if (imagineP) {
                imagineP.textContent = lastTypedPrompt;
                if (imagineP.classList.contains('is-empty') && lastTypedPrompt) imagineP.classList.remove('is-empty');
                resetState("Ready");
            }
        }
    });


    // --- STATE MANAGEMENT (Favorites/Permanent History) ---
    function addToHistory(prompt, type) {
        if (!prompt || !prompt.trim()) return;
        const arr = type === 'image' ? imagePromptHistory : videoPromptHistory;
        const filtered = arr.filter(item => item.text !== prompt);
        filtered.unshift({ id: Date.now().toString(), text: prompt, timestamp: Date.now(), type: type });
        const limited = filtered.slice(0, MAX_HISTORY_ITEMS);

        if (type === 'image') { imagePromptHistory = limited; GM_setValue('imagePromptHistory', imagePromptHistory); }
        else { 
            videoPromptHistory = limited; 
            GM_setValue('videoPromptHistory', videoPromptHistory);
            // Reset navigation when new history is added
            historyNavIndex = -1;
            updateHistoryNavButtons();
        }
    }

    function addToFavorites(prompt, type) {
        if (!prompt || !prompt.trim()) return;
        const arr = type === 'image' ? imageFavorites : videoFavorites;
        if (arr.some(item => item.text === prompt)) {
            updateStatus(`Already in favorites!`, 'error');
            setTimeout(() => updateStatus('Ready'), 2000);
            return;
        }
        arr.unshift({
            id: Date.now().toString(),
            text: prompt,
            label: prompt.length > 40 ? prompt.substring(0, 40) + '...' : prompt,
            timestamp: Date.now(),
            type: type
        });
        if (type === 'image') GM_setValue('imageFavorites', arr);
        else GM_setValue('videoFavorites', arr);
        updateStatus(`Added to favorites! ❤️`);
        setTimeout(() => updateStatus('Ready'), 2000);
    }

    // --- IMPORT / EXPORT LOGIC ---
    function getAllData() {
        return {
            savedSnippets,
            videoPromptHistory,
            imagePromptHistory,
            videoFavorites,
            imageFavorites,
            settings: {
                maxRetries,
                uiToggleKey,
                autoClickEnabled,
                panelSize,
                mainPos, libPos, favPos, histPos
            },
            version: 34
        };
    }

    function restoreData(data) {
        if (!data) return alert("Invalid data");
        try {
            if (data.savedSnippets) GM_setValue('savedSnippets', data.savedSnippets);
            if (data.videoPromptHistory) GM_setValue('videoPromptHistory', data.videoPromptHistory);
            if (data.imagePromptHistory) GM_setValue('imagePromptHistory', data.imagePromptHistory);
            if (data.videoFavorites) GM_setValue('videoFavorites', data.videoFavorites);
            if (data.imageFavorites) GM_setValue('imageFavorites', data.imageFavorites);
            if (data.settings) {
                const s = data.settings;
                if (s.maxRetries) GM_setValue('maxRetries', s.maxRetries);
                if (s.uiToggleKey) GM_setValue('uiToggleKey', s.uiToggleKey);
                if (s.autoClickEnabled !== undefined) GM_setValue('autoClickEnabled', s.autoClickEnabled);
                if (s.panelSize) GM_setValue('panelSize', s.panelSize);
                if (s.mainPos) GM_setValue('pos_main', s.mainPos);
            }
            alert("Import successful! Reloading page...");
            location.reload();
        } catch (e) {
            console.error(e);
            alert("Error importing data. Check console.");
        }
    }

    document.getElementById('btn-export-all').addEventListener('click', () => {
        const data = getAllData();
        const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `grok_tools_backup_${new Date().toISOString().slice(0,10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
        updateStatus("Export complete!");
    });

    const fileInput = document.getElementById('grok-import-file');
    document.getElementById('btn-import-all').addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (evt) => {
            try {
                const json = JSON.parse(evt.target.result);
                if (confirm("This will overwrite your current saved snippets/history/favorites. Continue?")) {
                    restoreData(json);
                }
            } catch (err) {
                alert("Invalid JSON file.");
            }
        };
        reader.readAsText(file);
        fileInput.value = '';
    });


    // --- RENDER FUNCTIONS (Snippets/Favorites/History) ---
    function renderSnippets() {
        const listContainer = document.getElementById('gl-list-container');
        listContainer.innerHTML = '';
        savedSnippets.forEach(item => {
            const el = document.createElement('div');
            el.className = 'gl-item';
            el.innerHTML = `
                <div class="gl-item-text"><b>${escapeHtml(item.label)}</b><span>${escapeHtml(item.text)}</span></div>
                <div class="gl-item-actions"><button class="gl-icon-btn gl-btn-edit">✎</button><button class="gl-icon-btn gl-btn-del">🗑</button></div>`;
            el.querySelector('.gl-item-text').addEventListener('click', () => {
                const cur = promptBox.value;
                const newText = cur + (cur && !cur.endsWith(' ') ? ' ' : '') + item.text;
                promptBox.value = newText;
                historyNavIndex = -1;
                updateHistoryNavButtons();
                modal.classList.remove('active');
            });
            el.querySelector('.gl-btn-edit').addEventListener('click', (e) => { e.stopPropagation(); showEditor(item); });
            el.querySelector('.gl-btn-del').addEventListener('click', (e) => {
                e.stopPropagation();
                if (confirm(`Delete "${item.label}"?`)) {
                    savedSnippets = savedSnippets.filter(s => s.id !== item.id);
                    GM_setValue('savedSnippets', savedSnippets);
                    renderSnippets();
                }
            });
            listContainer.appendChild(el);
        });
    }

    const editLabel = document.getElementById('gl-edit-label');
    const editText = document.getElementById('gl-edit-text');
    let editingSnippetId = null;

    function showEditor(item = null) {
        document.getElementById('gl-view-list').style.display = 'none';
        document.getElementById('gl-view-editor').classList.add('active');
        editingSnippetId = item ? item.id : null;
        editLabel.value = item ? item.label : '';
        editText.value = item ? item.text : '';
        editText.focus();
    }

    document.getElementById('btn-create-snippet').addEventListener('click', () => showEditor(null));
    document.getElementById('btn-edit-cancel').addEventListener('click', () => {
        document.getElementById('gl-view-editor').classList.remove('active');
        document.getElementById('gl-view-list').style.display = 'flex';
    });
    document.getElementById('btn-edit-save').addEventListener('click', () => {
        const label = editLabel.value.trim() || 'Untitled';
        const text = editText.value.trim();
        if (!text) return alert("Empty text");
        if (editingSnippetId) {
            const idx = savedSnippets.findIndex(s => s.id === editingSnippetId);
            if (idx > -1) { savedSnippets[idx].label = label; savedSnippets[idx].text = text; }
        } else {
            savedSnippets.push({ id: Date.now().toString(), label, text });
        }
        GM_setValue('savedSnippets', savedSnippets);
        document.getElementById('btn-edit-cancel').click();
        renderSnippets();
    });

    // Favorites
    function renderFavorites() {
        const listContainer = document.getElementById('favorites-list-container');
        listContainer.innerHTML = '';
        const favArray = currentFavoritesTab === 'image' ? imageFavorites : videoFavorites;

        if (favArray.length === 0) {
            listContainer.innerHTML = `<div style="text-align:center; padding:20px; color:#555;">No favorites</div>`;
            return;
        }

        favArray.forEach(item => {
            const el = document.createElement('div');
            el.className = 'gl-item';
            el.innerHTML = `
                <div class="gl-item-text">
                    <b>${escapeHtml(item.label)}</b>
                    <span>${escapeHtml(item.text)}</span>
                    <div class="history-item-time">${formatTimestamp(item.timestamp)}</div>
                </div>
                <div class="gl-item-actions"><button class="gl-icon-btn fav-btn-edit">✎</button><button class="gl-icon-btn fav-btn-del">🗑</button></div>`;
            el.querySelector('.gl-item-text').addEventListener('click', () => {
                promptBox.value = item.text;
                historyNavIndex = -1;
                updateHistoryNavButtons();
                favoritesModal.classList.remove('active');
            });
            el.querySelector('.fav-btn-edit').addEventListener('click', (e) => { e.stopPropagation(); editFavorite(item); });
            el.querySelector('.fav-btn-del').addEventListener('click', (e) => {
                e.stopPropagation();
                if (confirm(`Remove favorite?`)) {
                    if (currentFavoritesTab === 'image') imageFavorites = imageFavorites.filter(h => h.id !== item.id);
                    else videoFavorites = videoFavorites.filter(h => h.id !== item.id);
                    GM_setValue(currentFavoritesTab === 'image' ? 'imageFavorites' : 'videoFavorites', currentFavoritesTab === 'image' ? imageFavorites : videoFavorites);
                    renderFavorites();
                }
            });
            listContainer.appendChild(el);
        });
    }

    function editFavorite(item) {
        document.getElementById('favorites-view-list').style.display = 'none';
        document.getElementById('favorites-view-viewer').classList.add('active');
        document.getElementById('fav-edit-label').value = item.label || item.text.substring(0,20);
        document.getElementById('favorites-viewer-text').value = item.text;
        document.getElementById('favorites-viewer-time').textContent = formatTimestamp(item.timestamp);
        currentEditingFavId = item.id;
    }

    document.getElementById('btn-fav-viewer-back').addEventListener('click', () => {
        document.getElementById('favorites-view-viewer').classList.remove('active');
        document.getElementById('favorites-view-list').style.display = 'flex';
    });
    document.getElementById('btn-fav-viewer-save').addEventListener('click', () => {
        const newLabel = document.getElementById('fav-edit-label').value.trim() || "Untitled";
        const newText = document.getElementById('favorites-viewer-text').value.trim();
        if (!newText || !currentEditingFavId) return;

        let favArray = currentFavoritesTab === 'image' ? imageFavorites : videoFavorites;
        const idx = favArray.findIndex(f => f.id === currentEditingFavId);
        if (idx !== -1) {
            favArray[idx].label = newLabel;
            favArray[idx].text = newText;
            GM_setValue(currentFavoritesTab === 'image' ? 'imageFavorites' : 'videoFavorites', favArray);
            renderFavorites();
            document.getElementById('btn-fav-viewer-back').click();
        }
    });

    favoritesModal.querySelectorAll('.history-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            favoritesModal.querySelectorAll('.history-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentFavoritesTab = tab.dataset.tab;
            renderFavorites();
        });
    });

    // History
    function renderHistory() {
        const listContainer = document.getElementById('history-list-container');
        listContainer.innerHTML = '';
        const historyArray = currentHistoryTab === 'image' ? imagePromptHistory : videoPromptHistory;

        if (historyArray.length === 0) {
            listContainer.innerHTML = `<div style="text-align:center; padding:20px; color:#555;">No history</div>`;
            return;
        }

        historyArray.forEach(item => {
            const el = document.createElement('div');
            el.className = 'gl-item';
            const isFavorited = (currentHistoryTab === 'image' ? imageFavorites : videoFavorites).some(f => f.text === item.text);

            el.innerHTML = `
                <div class="gl-item-text">
                    <span>${escapeHtml(item.text)}</span>
                    <div class="history-item-time">${formatTimestamp(item.timestamp)}</div>
                </div>
                <div class="gl-item-actions">
                    <button class="gl-icon-btn history-btn-fav ${isFavorited ? 'favorite' : ''}">❤️</button>
                    <button class="gl-icon-btn history-btn-view">👁</button>
                    <button class="gl-icon-btn history-btn-del">🗑</button>
                </div>`;

            el.querySelector('.gl-item-text').addEventListener('click', () => {
                promptBox.value = item.text;
                historyNavIndex = -1;
                updateHistoryNavButtons();
                historyModal.classList.remove('active');
            });
            el.querySelector('.history-btn-fav').addEventListener('click', (e) => {
                e.stopPropagation();
                addToFavorites(item.text, item.type);
                renderHistory();
            });
            el.querySelector('.history-btn-view').addEventListener('click', (e) => {
                e.stopPropagation();
                document.getElementById('history-view-list').style.display = 'none';
                document.getElementById('history-view-viewer').classList.add('active');
                document.getElementById('history-viewer-text').value = item.text;
                document.getElementById('history-viewer-time').textContent = formatTimestamp(item.timestamp);
            });
            el.querySelector('.history-btn-del').addEventListener('click', (e) => {
                e.stopPropagation();
                if (currentHistoryTab === 'image') {
                    imagePromptHistory = imagePromptHistory.filter(h => h.id !== item.id);
                    GM_setValue('imagePromptHistory', imagePromptHistory);
                } else {
                    videoPromptHistory = videoPromptHistory.filter(h => h.id !== item.id);
                    GM_setValue('videoPromptHistory', videoPromptHistory);
                    updateHistoryNavButtons();
                }
                renderHistory();
            });
            listContainer.appendChild(el);
        });
    }

    document.getElementById('btn-viewer-back').addEventListener('click', () => {
        document.getElementById('history-view-viewer').classList.remove('active');
        document.getElementById('history-view-list').style.display = 'flex';
    });
    document.getElementById('btn-viewer-use').addEventListener('click', () => {
        const text = document.getElementById('history-viewer-text').value;
        promptBox.value = text;
        historyNavIndex = -1;
        updateHistoryNavButtons();
        historyModal.classList.remove('active');
        document.getElementById('btn-viewer-back').click();
    });
    
    // Create new prompt functionality
    document.getElementById('btn-create-history-prompt').addEventListener('click', () => {
        debugLog('Create new prompt clicked');
        document.getElementById('history-view-list').style.display = 'none';
        const creatorView = document.getElementById('history-view-creator');
        creatorView.classList.add('active');
        creatorView.style.display = 'flex';
        document.getElementById('history-creator-text').value = '';
        setTimeout(() => {
            document.getElementById('history-creator-text').focus();
        }, 100);
    });

    document.getElementById('btn-creator-cancel').addEventListener('click', () => {
        const creatorView = document.getElementById('history-view-creator');
        creatorView.classList.remove('active');
        creatorView.style.display = 'none';
        document.getElementById('history-view-list').style.display = 'flex';
    });

    document.getElementById('btn-creator-save').addEventListener('click', () => {
        const text = document.getElementById('history-creator-text').value.trim();
        if (!text) {
            updateStatus('Prompt cannot be empty', 'error');
            setTimeout(() => updateStatus('Ready'), 2000);
            return;
        }

        // Save to the current tab's history
        addToHistory(text, currentHistoryTab);
        
        updateStatus(`Saved to ${currentHistoryTab} history!`);
        setTimeout(() => updateStatus('Ready'), 2000);
        
        // Go back to list view
        document.getElementById('btn-creator-cancel').click();
        renderHistory();
    });
    
    document.getElementById('btn-clear-history').addEventListener('click', () => {
        if(confirm('Clear history for this tab?')) {
            if(currentHistoryTab === 'image') { imagePromptHistory=[]; GM_setValue('imagePromptHistory', []); }
            else { 
                videoPromptHistory=[]; 
                GM_setValue('videoPromptHistory', []); 
                historyNavIndex = -1;
                updateHistoryNavButtons();
            }
            renderHistory();
        }
    });

    historyModal.querySelectorAll('.history-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            historyModal.querySelectorAll('.history-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentHistoryTab = tab.dataset.tab;
            renderHistory();
        });
    });


    // --- BUTTON EVENT LISTENERS ---
    document.getElementById('btn-open-library').addEventListener('click', () => {
        toggleModal(modal);
        if(modal.classList.contains('active')) renderSnippets();
    });
    document.getElementById('btn-open-favorites').addEventListener('click', () => {
        toggleModal(favoritesModal);
        if(favoritesModal.classList.contains('active')) renderFavorites();
    });
    document.getElementById('btn-open-history').addEventListener('click', () => {
        toggleModal(historyModal);
        if(historyModal.classList.contains('active')) renderHistory();
    });

    modal.querySelector('.gl-close').addEventListener('click', () => modal.classList.remove('active'));
    favoritesModal.querySelector('.favorites-close').addEventListener('click', () => favoritesModal.classList.remove('active'));
    historyModal.querySelector('.history-close').addEventListener('click', () => historyModal.classList.remove('active'));


    // --- STRICT SYNC & CAPTURE LOGIC ---

    // Website -> UI Panel sync
    document.addEventListener('input', (e) => {
        if (e.target.matches(TARGET_TEXTAREA_SELECTOR) ||
            e.target.matches(IMAGE_EDITOR_SELECTOR) ||
            e.target.matches(IMAGE_PROMPT_SELECTOR)) {

            if (document.activeElement === e.target) {
                promptBox.value = e.target.value;
                lastTypedPrompt = e.target.value;
                historyNavIndex = -1;
                updateHistoryNavButtons();
            }
        }
    }, { capture: true, passive: true });

    // Generate Button Logic
    document.getElementById('btn-generate').addEventListener('click', () => {
        let type = 'video';
        const vidEl = document.querySelector(TARGET_TEXTAREA_SELECTOR);
        const imgEl = document.querySelector(IMAGE_PROMPT_SELECTOR);
        const imgIm = document.querySelector(IMAGE_IMAGINE_SELECTOR);

        if (vidEl) {
            type = 'video';
        } else if (imgEl || imgIm) {
            type = 'image';
        }

        const grokTA = vidEl || document.querySelector(IMAGE_EDITOR_SELECTOR) || imgEl;
        const realBtn = document.querySelector(RETRY_BUTTON_SELECTOR) ||
                        document.querySelector(IMAGE_EDITOR_BUTTON_SELECTOR) ||
                        document.querySelector(IMAGE_SUBMIT_BUTTON_SELECTOR);
        const imagineP = imgIm;

        if (!realBtn) return updateStatus("Button not found", "error");

        const promptVal = promptBox.value.trim();
        if (promptVal) {
            addToHistory(promptVal, type);
        }

        // FORCE SYNC NOW
        if (grokTA) nativeValueSet(grokTA, promptBox.value);
        else if (imagineP) imagineP.textContent = promptBox.value;

        setTimeout(() => {
            if (!realBtn.disabled) {
                realBtn.click();
                lastGenerationTimestamp = Date.now();
                updateStatus("Generation Started...");
            } else {
                updateStatus("Grok button disabled/processing.", "error");
            }
        }, 50);
    });

    // Image Capture (For clicks outside panel)
    document.addEventListener('mousedown', (e) => {
        const submitBtn = e.target.closest('button[aria-label="Submit"]');
        if (submitBtn) {
            const val = promptBox.value.trim() || lastTypedPrompt.trim();
            if (val.length > 2) {
                addToHistory(val, 'image');
                updateStatus("Prompt captured!");
            }
        }
    }, true);


    // --- MODERATION & RETRY LOGIC ---
    function checkForModerationContent() {
        const now = Date.now();
        if (now - lastModerationCheck < 200) return null;
        lastModerationCheck = now;

        const toastSelectors = ['section[aria-label*="Notification"]', '[role="alert"]', '.toast'];
        for (const sel of toastSelectors) {
            const els = document.querySelectorAll(sel);
            for (const el of els) {
                const txt = (el.textContent || '').toLowerCase();
                if (MODERATION_PATTERNS.some(p => txt.includes(p))) return { element: el, text: txt };
            }
        }
        return null;
    }

    function waitForErrorDisappearance(element) {
        if (errorWaitInterval) clearInterval(errorWaitInterval);

        let safetyCounter = 0;
        const POLL_MS = 500;
        const MAX_WAIT_MS = 10000;

        errorWaitInterval = setInterval(() => {
            safetyCounter += POLL_MS;

            const isConnected = document.body.contains(element);
            let isVisible = false;
            if (isConnected) {
                const style = window.getComputedStyle(element);
                isVisible = style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
            }

            if (!isConnected || !isVisible || safetyCounter >= MAX_WAIT_MS) {
                clearInterval(errorWaitInterval);
                errorWaitInterval = null;
                updateStatus('Message cleared. Retrying...');
                handleRetry(Date.now());
            }
        }, POLL_MS);
    }

    function handleRetry(now) {
        if (!isRetryEnabled || limitReached) return;
        if (now - lastGenerationTimestamp < GENERATION_COOLDOWN_MS) return;

        const grokTA = getGrokInput();
        const btn = document.querySelector(RETRY_BUTTON_SELECTOR) ||
                    document.querySelector(IMAGE_EDITOR_BUTTON_SELECTOR) ||
                    document.querySelector(IMAGE_SUBMIT_BUTTON_SELECTOR);
        const imagineP = getGrokImagine();

        if ((grokTA || imagineP) && lastTypedPrompt) {
            if (grokTA) nativeValueSet(grokTA, lastTypedPrompt);
            else if (imagineP) imagineP.textContent = lastTypedPrompt;

            if (autoClickEnabled && currentRetryCount >= maxRetries) {
                updateStatus(`Limit Reached (${maxRetries})`, "error");
                limitReached = true;
                return;
            }

            if (autoClickEnabled && btn) {
                currentRetryCount++;
                updateStatus(`Retrying (${currentRetryCount}/${maxRetries})...`, 'warning');
                setTimeout(() => {
                    if (!btn.disabled) {
                        btn.click();
                        lastGenerationTimestamp = Date.now();
                    }
                    processingModeration = false;
                    moderationDetected = false;
                }, RETRY_DELAY_MS);
            }
        }
    }

    const observer = new MutationObserver(() => {
        if (observerThrottle || !isRetryEnabled || limitReached) return;
        observerThrottle = true;
        setTimeout(() => { observerThrottle = false; }, OBSERVER_THROTTLE_MS);

        if (!processingModeration) {
            const mod = checkForModerationContent();
            if (mod) {
                debugLog('Moderation detected:', mod.text);
                processingModeration = true;
                moderationDetected = true;
                updateStatus(`Moderation detected! Waiting...`, 'warning');
                waitForErrorDisappearance(mod.element);
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true, attributes: true, characterData: true });


    // --- TOGGLES & SETTINGS ---
    const toggleBtn = document.getElementById('grok-toggle-btn');
    toggleBtn.addEventListener('click', () => {
        isRetryEnabled = !isRetryEnabled;
        toggleBtn.textContent = isRetryEnabled ? "ON" : "OFF";
        toggleBtn.classList.toggle('off', !isRetryEnabled);
        resetState(isRetryEnabled ? "Ready" : "Disabled");
        if (!isRetryEnabled) updateStatus("Disabled", "error");
    });

    document.getElementById('grok-autoclick-cb').addEventListener('change', (e) => {
        autoClickEnabled = e.target.checked;
        GM_setValue('autoClickEnabled', autoClickEnabled);
    });

    document.getElementById('grok-retry-limit').addEventListener('change', (e) => {
        maxRetries = parseInt(e.target.value);
        GM_setValue('maxRetries', maxRetries);
    });

    // Keybinds
    document.addEventListener('keydown', (e) => {
        // Toggle Main UI
        if (e.altKey && e.key.toLowerCase() === uiToggleKey) {
            isUiVisible = !isUiVisible;
            GM_setValue('isUiVisible', isUiVisible);
            panel.classList.toggle('hidden', !isUiVisible);
            e.preventDefault();
        }
        // Toggle Import/Export Buttons
        if (e.altKey && e.key.toLowerCase() === 'i') {
            const ioRow = document.getElementById('grok-io-container');
            if (ioRow) {
                ioRow.classList.toggle('io-hidden');
                e.preventDefault();
            }
        }
    });

    window.addEventListener('beforeunload', () => {
        observer.disconnect();
        if (errorWaitInterval) clearInterval(errorWaitInterval);
    });

    // Initialize navigation buttons
    updateHistoryNavButtons();

    debugLog('Grok Tools v34 Initialized - History Navigation Active');

})();