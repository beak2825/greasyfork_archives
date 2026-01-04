// ==UserScript==
// @name         Infinite Craft - Auto Combiner V3 
// @namespace    http://tampermonkey.net/
// @version      3
// @description  Automates combining a target element with all others in Infinite Craft, remembering failed combinations to speed up runs.
// @author       AIScriptz
// @match        https://neal.fun/infinite-craft/
// @grant        none
// @run-at       document-idle
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/551717/Infinite%20Craft%20-%20Auto%20Combiner%20V3.user.js
// @updateURL https://update.greasyfork.org/scripts/551717/Infinite%20Craft%20-%20Auto%20Combiner%20V3.meta.js
// ==/UserScript==

(() => {
    // --- CONFIGURATION --- (Adjust delays if needed)
    const CONFIG = {
        // Selectors specific to Infinite Craft (FIXED)
        itemSelector: '.items .item', // FIXED: Was '.item', now '.items .item'
        gameContainerSelector: '.container', // Simplified

        // UI Element IDs & Classes
        panelId: 'auto-combo-panel',
        targetInputId: 'auto-combo-target-input',
        suggestionBoxId: 'auto-combo-suggestion-box',
        suggestionItemClass: 'auto-combo-suggestion-item',
        statusBoxId: 'auto-combo-status',
        startButtonId: 'auto-combo-start-button',
        stopButtonId: 'auto-combo-stop-button',
        clearFailedButtonId: 'auto-combo-clear-failed-button',
        debugMarkerClass: 'auto-combo-debug-marker',

        // Delays (ms) - Tune these based on game responsiveness
        interComboDelay: 100,      // Delay between trying different combinations
        postComboScanDelay: 650,   // Delay AFTER a combo attempt BEFORE checking result
        dragStepDelay: 15,         // Delay between mouse events during a single drag
        scanDebounceDelay: 300,    // Delay before rescanning items after DOM changes
        suggestionHighlightDelay: 50,

        // Behavior
        suggestionLimit: 20,
        debugMarkerDuration: 1000,

        // Keys
        keyArrowUp: 'ArrowUp',
        keyArrowDown: 'ArrowDown',
        keyEnter: 'Enter',
        keyTab: 'Tab',

        // Storage
        storageKeyFailedCombos: 'infCraftAutoComboFailedCombosV2',

        // Styling & Z-Index
        panelZIndex: 10010,
        suggestionZIndex: 10011,
        markerZIndex: 10012,
    };

    // --- CORE CLASS ---
    class AutoTargetCombo {
        constructor() {
            console.log('[AutoCombo] Initializing for Infinite Craft...');
            this.itemElementMap = new Map(); // Map<string, Element>
            this.isRunning = false;
            this.suggestionIndex = -1;
            this.suggestions = [];
            this.scanDebounceTimer = null;
            this.failedCombos = new Set();

            // UI References
            this.panel = null;
            this.targetInput = null;
            this.suggestionBox = null;
            this.statusBox = null;
            this.startButton = null;
            this.stopButton = null;
            this.clearFailedButton = null;

            // --- Initialization Steps ---
            try {
                this._injectStyles();
                this._setupUI();

                 // Check if essential UI elements were found after setup
                 if (!this.panel || !this.targetInput || !this.statusBox || !this.startButton || !this.stopButton || !this.clearFailedButton) {
                    throw new Error("One or more critical UI elements missing after setup. Aborting.");
                 }

                this._setupEventListeners();
                this._loadFailedCombos(); // Load saved failures
                this.observeDOM();
                this.scanItems(); // Perform initial scan
                this.logStatus('Ready.');
                console.log('[AutoCombo] Initialization complete.');
            } catch (error) {
                console.error('[AutoCombo] CRITICAL ERROR during initialization:', error);
                this.logStatus(`❌ INIT FAILED: ${error.message}`, 'status-error');
                // Clean up partial UI if needed
                if (this.panel && this.panel.parentNode) {
                    this.panel.parentNode.removeChild(this.panel);
                }
            }
        }

        // --- Initialization & Setup ---

        _injectStyles() {
            if (document.getElementById(`${CONFIG.panelId}-styles`)) return;
            const css = `
                #${CONFIG.panelId} {
                    position: fixed; top: 15px; left: 15px; z-index: ${CONFIG.panelZIndex};
                    background: rgba(250, 250, 250, 0.97); padding: 12px; border: 1px solid #aaa; border-radius: 8px;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 14px; width: 260px; color: #111;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.25); display: flex; flex-direction: column; gap: 6px;
                }
                #${CONFIG.panelId} * { box-sizing: border-box; }
                #${CONFIG.panelId} div:first-child {
                    font-weight: bold; margin-bottom: 4px; text-align: center; color: #333; font-size: 15px; padding-bottom: 4px; border-bottom: 1px solid #ddd;
                 }
                #${CONFIG.panelId} input, #${CONFIG.panelId} button {
                     width: 100%; padding: 9px 10px; font-size: 14px;
                    border: 1px solid #ccc; border-radius: 4px;
                }
                 #${CONFIG.panelId} input { background-color: #fff; color: #000; }
                 #${CONFIG.panelId} button {
                    cursor: pointer; background-color: #f0f0f0; color: #333; transition: background-color 0.2s ease, transform 0.1s ease;
                    border: 1px solid #bbb; text-align: center;
                 }
                 #${CONFIG.panelId} button:hover { background-color: #e0e0e0; }
                 #${CONFIG.panelId} button:active { transform: scale(0.98); }

                 #${CONFIG.panelId} #${CONFIG.startButtonId} { background-color: #4CAF50; color: white; border-color: #3a8d3d;}
                 #${CONFIG.panelId} #${CONFIG.startButtonId}:hover { background-color: #45a049; }
                 #${CONFIG.panelId} #${CONFIG.stopButtonId} { background-color: #f44336; color: white; border-color: #c4302b;}
                 #${CONFIG.panelId} #${CONFIG.stopButtonId}:hover { background-color: #da190b; }
                 #${CONFIG.panelId} #${CONFIG.clearFailedButtonId} { background-color: #ff9800; color: white; border-color: #c67600;}
                 #${CONFIG.panelId} #${CONFIG.clearFailedButtonId}:hover { background-color: #f57c00; }

                #${CONFIG.suggestionBoxId} {
                    display: none; border: 1px solid #aaa; background: #fff;
                    position: absolute; max-height: 160px; overflow-y: auto;
                    z-index: ${CONFIG.suggestionZIndex}; box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                    border-radius: 0 0 4px 4px; margin-top: -1px; font-size: 13px;
                }
                .${CONFIG.suggestionItemClass} {
                    padding: 7px 12px; cursor: pointer; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: #222;
                }
                .${CONFIG.suggestionItemClass}:hover { background-color: #f0f0f0; }
                .${CONFIG.suggestionItemClass}.highlighted { background-color: #007bff; color: white; }

                #${CONFIG.statusBoxId} {
                    margin-top: 6px; color: #333; font-weight: 500; font-size: 13px; text-align: center;
                    padding: 7px; background-color: #f9f9f9; border-radius: 3px; border: 1px solid #e5e5e5;
                 }
                 #${CONFIG.statusBoxId}.status-running { color: #007bff; }
                 #${CONFIG.statusBoxId}.status-stopped { color: #dc3545; }
                 #${CONFIG.statusBoxId}.status-success { color: #28a745; }
                 #${CONFIG.statusBoxId}.status-warning { color: #ffc107; text-shadow: 0 0 1px #aaa; }
                 #${CONFIG.statusBoxId}.status-error { color: #dc3545; font-weight: bold; }

                .${CONFIG.debugMarkerClass} {
                    position: absolute; width: 10px; height: 10px; border-radius: 50%;
                    z-index: ${CONFIG.markerZIndex}; pointer-events: none; opacity: 0.80;
                    box-shadow: 0 0 5px 2px rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.5);
                    transition: opacity 0.5s ease-out;
                }
            `;
            const styleSheet = document.createElement("style");
            styleSheet.id = `${CONFIG.panelId}-styles`;
            styleSheet.type = "text/css";
            styleSheet.innerText = css;
            document.head.appendChild(styleSheet);
        }

        _setupUI() {
            const existingPanel = document.getElementById(CONFIG.panelId);
            if (existingPanel) existingPanel.remove();

            this.panel = document.createElement('div');
            this.panel.id = CONFIG.panelId;
            this.panel.innerHTML = `
                <div>✨ Infinite Auto Combiner ✨</div>
                <input id="${CONFIG.targetInputId}" placeholder="Target Element (e.g. Water)" autocomplete="off">
                <div id="${CONFIG.suggestionBoxId}"></div>
                <button id="${CONFIG.startButtonId}">▶️ Combine with All Others</button>
                <button id="${CONFIG.clearFailedButtonId}">🗑️ Clear Failed Memory</button>
                <button id="${CONFIG.stopButtonId}">⛔ Stop</button>
                <div id="${CONFIG.statusBoxId}">Initializing...</div>
            `;
            document.body.appendChild(this.panel);

            // Get references using panel.querySelector
            this.targetInput = this.panel.querySelector(`#${CONFIG.targetInputId}`);
            this.suggestionBox = this.panel.querySelector(`#${CONFIG.suggestionBoxId}`);
            this.statusBox = this.panel.querySelector(`#${CONFIG.statusBoxId}`);
            this.startButton = this.panel.querySelector(`#${CONFIG.startButtonId}`);
            this.stopButton = this.panel.querySelector(`#${CONFIG.stopButtonId}`);
            this.clearFailedButton = this.panel.querySelector(`#${CONFIG.clearFailedButtonId}`);

             console.log('[AutoCombo] UI Element References:', {
                panel: !!this.panel, targetInput: !!this.targetInput, suggestionBox: !!this.suggestionBox,
                statusBox: !!this.statusBox, startButton: !!this.startButton, stopButton: !!this.stopButton,
                clearFailedButton: !!this.clearFailedButton
             });
             if (!this.targetInput || !this.statusBox || !this.startButton || !this.stopButton || !this.clearFailedButton) {
                 throw new Error("One or more required UI elements not found within the panel.");
             }
        }

        _setupEventListeners() {
            if (!this.targetInput || !this.startButton || !this.stopButton || !this.clearFailedButton) {
                throw new Error("Cannot setup listeners: Required UI elements missing.");
            }

            this.targetInput.addEventListener('input', () => this._updateSuggestions());
            this.targetInput.addEventListener('keydown', e => this._handleSuggestionKey(e));
            this.targetInput.addEventListener('focus', () => this._updateSuggestions());

            document.addEventListener('click', (e) => {
                 if (this.panel && !this.panel.contains(e.target) && this.suggestionBox && !this.suggestionBox.contains(e.target)) {
                    if (this.suggestionBox.style.display === 'block') this.suggestionBox.style.display = 'none';
                }
            }, true);

            this.startButton.onclick = () => this.startAutoCombo();
            this.stopButton.onclick = () => this.stop();
            this.clearFailedButton.onclick = () => this._clearFailedCombos();
        }

        _loadFailedCombos() {
            const savedCombos = localStorage.getItem(CONFIG.storageKeyFailedCombos);
            let loadedCount = 0;
            if (savedCombos) {
                try {
                    const parsedCombos = JSON.parse(savedCombos);
                    if (Array.isArray(parsedCombos)) {
                        const validCombos = parsedCombos.filter(item => typeof item === 'string');
                        this.failedCombos = new Set(validCombos);
                        loadedCount = this.failedCombos.size;
                        if (loadedCount > 0) {
                             this.logStatus(`📚 Loaded ${loadedCount} failed combos.`, 'status-success');
                        }
                    } else {
                         localStorage.removeItem(CONFIG.storageKeyFailedCombos);
                         this.failedCombos = new Set();
                    }
                } catch (e) {
                    console.error('[AutoCombo] Error parsing failed combos:', e);
                    localStorage.removeItem(CONFIG.storageKeyFailedCombos);
                    this.failedCombos = new Set();
                }
            } else {
                 this.failedCombos = new Set();
            }
             console.log(`[AutoCombo] Failed combos loaded: ${loadedCount}`);
        }

        _saveFailedCombos() {
            if (this.failedCombos.size === 0) {
                localStorage.removeItem(CONFIG.storageKeyFailedCombos);
                return;
            }
            try {
                localStorage.setItem(CONFIG.storageKeyFailedCombos, JSON.stringify(Array.from(this.failedCombos)));
            } catch (e) {
                console.error('[AutoCombo] Error saving failed combos:', e);
                this.logStatus('❌ Error saving fails!', 'status-error');
            }
        }

        _clearFailedCombos() {
            const count = this.failedCombos.size;
            this.failedCombos.clear();
            localStorage.removeItem(CONFIG.storageKeyFailedCombos);
            this.logStatus(`🗑️ Cleared ${count} failed combos.`, 'status-success');
             console.log(`[AutoCombo] Cleared ${count} failed combos.`);
        }

        // --- Core Logic ---

        scanItems() {
            clearTimeout(this.scanDebounceTimer);
            this.scanDebounceTimer = null;

            const items = document.querySelectorAll(CONFIG.itemSelector);
            let changed = false;
            const currentNames = new Set();
            const oldSize = this.itemElementMap.size;

            for (const el of items) {
                if (!el) continue;
                // Use data-item-text attribute for clean element name
                const name = el.getAttribute('data-item-text');
                if (name && typeof name === 'string') {
                    currentNames.add(name);
                    if (!this.itemElementMap.has(name) || this.itemElementMap.get(name) !== el) {
                        this.itemElementMap.set(name, el);
                        changed = true;
                    }
                }
            }

            const currentKeys = Array.from(this.itemElementMap.keys());
            for (const name of currentKeys) {
                if (!currentNames.has(name)) {
                    this.itemElementMap.delete(name);
                    changed = true;
                }
            }

            if (changed && !this.isRunning) {
                const newSize = this.itemElementMap.size;
                const diff = newSize - oldSize;
                let logMsg = `🔍 Scan: ${newSize} items`;
                if (diff > 0) logMsg += ` (+${diff})`; else if (diff < 0) logMsg += ` (${diff})`;
                this.logStatus(logMsg);
                console.log(`[AutoCombo] ${logMsg}`);
                 if (document.activeElement === this.targetInput) {
                     this._updateSuggestions();
                 }
            }
            return changed;
        }

        observeDOM() {
             const targetNode = document.querySelector(CONFIG.gameContainerSelector);
             if (!targetNode) {
                  console.error("[AutoCombo] Cannot observe DOM: Target node not found:", CONFIG.gameContainerSelector);
                  this.logStatus(`❌ Error: Observer target (${CONFIG.gameContainerSelector}) not found!`, "status-error");
                  return;
             }

            const observer = new MutationObserver((mutationsList) => {
                 let potentiallyRelevantChange = false;
                 for (const mutation of mutationsList) {
                     if (mutation.type === 'childList') {
                         const checkNodes = (nodes) => {
                            if (!nodes) return false;
                            for(const node of nodes) {
                                if (node.nodeType === Node.ELEMENT_NODE && node.matches && node.matches(CONFIG.itemSelector)) return true;
                            }
                            return false;
                         }
                         if (checkNodes(mutation.addedNodes) || checkNodes(mutation.removedNodes)) {
                            potentiallyRelevantChange = true;
                            break;
                         }
                     }
                 }

                if (potentiallyRelevantChange) {
                    clearTimeout(this.scanDebounceTimer);
                    this.scanDebounceTimer = setTimeout(() => {
                        this.scanItems();
                    }, CONFIG.scanDebounceDelay);
                }
            });

            observer.observe(targetNode, {
                childList: true,
                subtree: true,
             });
             console.log("[AutoCombo] DOM Observer started on:", targetNode);
        }

        stop() {
            if (!this.isRunning) return;
            this.isRunning = false;
            clearTimeout(this.scanDebounceTimer);
            this.logStatus('⛔ Combo process stopped.', 'status-stopped');
            console.log('[AutoCombo] Stop requested.');
        }

        async startAutoCombo() {
            if (this.isRunning) {
                this.logStatus('⚠️ Already running.', 'status-warning'); return;
            }

            const targetName = this.targetInput.value.trim();
            if (!targetName) {
                this.logStatus('⚠️ Enter Target Element', 'status-warning'); this.targetInput.focus(); return;
            }

            this.scanItems();
            let targetElement = this.getElement(targetName);
            if (!targetElement || !document.body.contains(targetElement)) {
                this.logStatus(`⚠️ Target "${targetName}" not found.`, 'status-warning'); this.targetInput.focus(); return;
            }

            const itemsToProcess = Array.from(this.itemElementMap.keys()).filter(name => name !== targetName);
            if (itemsToProcess.length === 0) {
                this.logStatus(`ℹ️ No other items found to combine with "${targetName}".`); return;
            }

            this.isRunning = true;
            this.logStatus(`🚀 Starting... Target: ${targetName} (${itemsToProcess.length} others)`, 'status-running');
            console.log(`[AutoCombo] Starting combinations for "${targetName}". Items: ${itemsToProcess.length}. Fails: ${this.failedCombos.size}`);

            let processedCount = 0, attemptedCount = 0, successCount = 0, skippedCount = 0;
            const totalPotentialCombos = itemsToProcess.length;

            for (const itemName of itemsToProcess) {
                if (!this.isRunning) break;

                processedCount++;
                const progress = `(${processedCount}/${totalPotentialCombos})`;

                const comboKey = this._getComboKey(targetName, itemName);
                if (this.failedCombos.has(comboKey)) {
                    if (processedCount % 20 === 0 || processedCount === totalPotentialCombos) {
                        this.logStatus(`⏭️ Skipping known fails... ${progress}`, 'status-running');
                    }
                     console.log(`[AutoCombo] ${progress} Skipping known fail: ${targetName} + ${itemName}`);
                     skippedCount++;
                    await new Promise(res => setTimeout(res, 2));
                    continue;
                }

                targetElement = this.getElement(targetName);
                if (!targetElement || !document.body.contains(targetElement)) {
                    this.logStatus(`⛔ Target "${targetName}" lost! Stopping.`, 'status-error');
                    console.error(`[AutoCombo] Target element "${targetName}" disappeared mid-process.`);
                    this.isRunning = false; break;
                }

                const sourceElement = this.getElement(itemName);
                if (!sourceElement || !document.body.contains(sourceElement)) {
                    this.logStatus(`⚠️ Skipping "${itemName}" ${progress}: Elem lost.`, 'status-warning');
                    console.warn(`[AutoCombo] ${progress} Skipping "${itemName}": Element not found/removed.`);
                    continue;
                }

                this.logStatus(`⏳ Trying: ${targetName} + ${itemName} ${progress}`, 'status-running');
                console.log(`[AutoCombo] ${progress} Attempting: ${targetName} + ${itemName}`);
                attemptedCount++;

                const itemsBeforeCombo = new Set(this.itemElementMap.keys());

                try {
                    await this.simulateCombo(sourceElement, targetElement);
                    if (!this.isRunning) break;

                    await new Promise(res => setTimeout(res, CONFIG.postComboScanDelay));
                    if (!this.isRunning) break;

                    this.scanItems();
                    const itemsAfterCombo = new Set(this.itemElementMap.keys());

                    let newItemFound = null;
                    for (const itemAfter of itemsAfterCombo) {
                        if (!itemsBeforeCombo.has(itemAfter)) { newItemFound = itemAfter; break; }
                    }

                    if (newItemFound) {
                        successCount++;
                        this.logStatus(`✨ NEW: ${newItemFound}! (${targetName} + ${itemName})`, 'status-success');
                        console.log(`[AutoCombo] SUCCESS! New: ${newItemFound} from ${targetName} + ${itemName}`);
                    } else {
                        const targetStillExists = itemsAfterCombo.has(targetName);
                        const sourceStillExists = itemsAfterCombo.has(itemName);
                        this.logStatus(`❌ Failed: ${targetName} + ${itemName} (T:${targetStillExists}, S:${sourceStillExists})`, 'status-running');
                        console.log(`[AutoCombo] FAILURE: No new item from ${targetName} + ${itemName}. T:${targetStillExists}, S:${sourceStillExists}`);
                        this.failedCombos.add(comboKey);
                        this._saveFailedCombos();
                    }

                    await new Promise(res => setTimeout(res, CONFIG.interComboDelay));

                } catch (error) {
                    this.logStatus(`❌ Error combining ${itemName}: ${error.message}`, 'status-error');
                    console.error(`[AutoCombo] Error during combo for "${itemName}" + "${targetName}":`, error);
                }
            }

            if (this.isRunning) {
                this.isRunning = false;
                const summary = `✅ Done. Tried: ${attemptedCount}, New: ${successCount}, Skipped: ${skippedCount}.`;
                this.logStatus(summary, 'status-success');
                console.log(`[AutoCombo] ${summary}`);
            } else {
                const summary = `⛔ Stopped. Tried: ${attemptedCount}, New: ${successCount}, Skipped: ${skippedCount}.`;
                console.log(`[AutoCombo] ${summary}`);
            }
        }


        // --- Simulation ---

        async simulateCombo(sourceElement, targetElement) {
            if (!this.isRunning) return;

            // Get center of the canvas/screen for combining
            const centerX = Math.floor(window.innerWidth / 2);
            const centerY = Math.floor(window.innerHeight / 2);

            // Drag target element to center first (offset upward)
            await this.simulateDrag(targetElement, centerX, centerY - 30, 'rgba(255, 100, 50, 0.7)');
            
            // Small delay between drags
            await new Promise(res => setTimeout(res, 200));
            if (!this.isRunning) return;

            // Drag source element to center (offset downward) to combine
            await this.simulateDrag(sourceElement, centerX, centerY + 2, 'rgba(50, 150, 255, 0.7)');
        }

        async simulateDrag(element, dropX, dropY, markerColor) {
            if (!this.isRunning || !element || !document.body.contains(element)) {
                 console.warn("[AutoCombo] simulateDrag: Element invalid or drag stopped.");
                 return;
            }

            const rect = element.getBoundingClientRect();
            if (rect.width === 0 || rect.height === 0) {
                 throw new Error(`Dragged elem "${element.getAttribute('data-item-text') || 'unknown'}" has no size.`);
            }

            // Starting position (center of element)
            const startX = rect.left + rect.width / 2;
            const startY = rect.top + rect.height / 2;

            // Show debug markers
            this.showDebugMarker(startX, startY, markerColor);
            this.showDebugMarker(dropX, dropY, markerColor);

            try {
                // Mouse Down on element
                element.dispatchEvent(new MouseEvent('mousedown', {
                    bubbles: true,
                    clientX: startX,
                    clientY: startY
                }));
                
                await new Promise(res => setTimeout(res, CONFIG.dragStepDelay));
                if (!this.isRunning) return;

                // Mouse Move to drop position
                document.dispatchEvent(new MouseEvent('mousemove', {
                    bubbles: true,
                    clientX: dropX,
                    clientY: dropY
                }));
                
                await new Promise(res => setTimeout(res, CONFIG.dragStepDelay));
                if (!this.isRunning) return;

                // Mouse Up at drop position
                document.dispatchEvent(new MouseEvent('mouseup', {
                    bubbles: true,
                    clientX: dropX,
                    clientY: dropY
                }));
                
                console.log(`[AutoCombo] Dragged ${element.getAttribute('data-item-text') || 'unknown'} from (${Math.round(startX)}, ${Math.round(startY)}) to (${Math.round(dropX)}, ${Math.round(dropY)})`);

            } catch (error) {
                 console.error('[AutoCombo] Error during drag simulation step:', error);
                 throw new Error(`Drag sim failed: ${error.message}`);
            }
        }

        // --- UI & Suggestions ---

        _updateSuggestions() {
            if (!this.targetInput || !this.suggestionBox) return;
            const query = this.targetInput.value.toLowerCase();
            if (!query) {
                this.suggestions = []; this.suggestionBox.style.display = 'none'; return;
            }
            const currentItems = Array.from(this.itemElementMap.keys());
            this.suggestions = currentItems
                .filter(name => name.toLowerCase().includes(query))
                .sort((a, b) => {
                    const aI = a.toLowerCase().indexOf(query), bI = b.toLowerCase().indexOf(query);
                    if (aI !== bI) return aI - bI; return a.localeCompare(b);
                })
                .slice(0, CONFIG.suggestionLimit);
            this.suggestionIndex = -1;
            this._updateSuggestionUI();
        }

        _updateSuggestionUI() {
            if (!this.targetInput || !this.suggestionBox) return;
            this.suggestionBox.innerHTML = '';
            if (!this.suggestions.length) { this.suggestionBox.style.display = 'none'; return; }

            const inputRect = this.targetInput.getBoundingClientRect();
            Object.assign(this.suggestionBox.style, {
                position: 'absolute', display: 'block',
                top: `${inputRect.bottom + window.scrollY}px`, left: `${inputRect.left + window.scrollX}px`,
                width: `${inputRect.width}px`, maxHeight: '160px', overflowY: 'auto', zIndex: CONFIG.suggestionZIndex,
            });

            this.suggestions.forEach((name, index) => {
                const div = document.createElement('div');
                div.textContent = name; div.className = CONFIG.suggestionItemClass; div.title = name;
                div.addEventListener('mousedown', (e) => { e.preventDefault(); this._handleSuggestionSelection(name); });
                this.suggestionBox.appendChild(div);
            });
            this._updateSuggestionHighlight();
        }

        _handleSuggestionKey(e) {
            if (!this.suggestionBox || this.suggestionBox.style.display !== 'block' || !this.suggestions.length) {
                if (e.key === CONFIG.keyEnter) { e.preventDefault(); this.startAutoCombo(); } return;
            }
            const numSuggestions = this.suggestions.length;
            switch (e.key) {
                case CONFIG.keyArrowDown: case CONFIG.keyTab:
                    e.preventDefault(); this.suggestionIndex = (this.suggestionIndex + 1) % numSuggestions; this._updateSuggestionHighlight(); break;
                case CONFIG.keyArrowUp:
                    e.preventDefault(); this.suggestionIndex = (this.suggestionIndex - 1 + numSuggestions) % numSuggestions; this._updateSuggestionHighlight(); break;
                case CONFIG.keyEnter:
                    e.preventDefault();
                    if (this.suggestionIndex >= 0) this._handleSuggestionSelection(this.suggestions[this.suggestionIndex]);
                    else { this.suggestionBox.style.display = 'none'; this.startAutoCombo(); } break;
                case 'Escape':
                    e.preventDefault(); this.suggestionBox.style.display = 'none'; break;
            }
        }

        _updateSuggestionHighlight() {
            if (!this.suggestionBox) return;
            Array.from(this.suggestionBox.children).forEach((child, i) => child.classList.toggle('highlighted', i === this.suggestionIndex));
            this._scrollSuggestionIntoView();
        }

        _scrollSuggestionIntoView() {
             if (!this.suggestionBox) return;
             const highlightedItem = this.suggestionBox.querySelector(`.${CONFIG.suggestionItemClass}.highlighted`);
             if (highlightedItem) {
                 setTimeout(() => highlightedItem.scrollIntoView?.({ block: 'nearest' }), CONFIG.suggestionHighlightDelay);
             }
        }

        _handleSuggestionSelection(name) {
            if (!this.targetInput || !this.suggestionBox) return;
            this.targetInput.value = name; this.suggestionBox.style.display = 'none';
            this.suggestions = []; this.targetInput.focus();
        }

        // --- Utilities ---

        getElement(name) { return this.itemElementMap.get(name) || null; }

        showDebugMarker(x, y, color = 'red', duration = CONFIG.debugMarkerDuration) {
            const dot = document.createElement('div');
            dot.className = CONFIG.debugMarkerClass;
            Object.assign(dot.style, {
                top: `${y - 5}px`, left: `${x - 5}px`, backgroundColor: color, position: 'absolute', opacity: '0.8'
            });
            document.body.appendChild(dot);
            setTimeout(() => {
                dot.style.opacity = '0';
                setTimeout(() => dot.remove(), 500);
            }, duration - 500);
        }

        logStatus(msg, type = 'info') {
             if (!this.statusBox) { console.log('[AutoCombo Status]', msg); return; }
            this.statusBox.textContent = msg;
            this.statusBox.className = `${CONFIG.statusBoxId}`;
            if (type !== 'info') this.statusBox.classList.add(`status-${type}`);
            if (type !== 'info' && type !== 'status-running' || !this.isRunning) {
                 console.log(`[AutoCombo Status - ${type}]`, msg);
            }
        }

        _getComboKey(name1, name2) { return [name1, name2].sort().join('||'); }
    }

    // --- Initialization ---
    if (window.infCraftAutoComboInstance) {
        console.warn("[AutoCombo] Instance already running. Aborting new init.");
    } else {
        console.log("[AutoCombo] Creating new instance...");
        window.infCraftAutoComboInstance = new AutoTargetCombo();
    }

})();