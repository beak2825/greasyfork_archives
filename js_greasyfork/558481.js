// ==UserScript==
// @name         Jisho2Anki
// @namespace    https://github.com/tontyoutoure/jisho2anki
// @version      1.0.1
// @description  Capture Jisho data and send to Anki via AnkiConnect
// @author       https://www.github.com/tontyoutoure with help from Gemini
// @match        https://jisho.org/search/*
// @match        https://jisho.org/word/*
// @grant        GM_xmlhttpRequest
// @connect      127.0.0.1
// @connect      localhost
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558481/Jisho2Anki.user.js
// @updateURL https://update.greasyfork.org/scripts/558481/Jisho2Anki.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- Configuration Constants ---
    const STORAGE_KEY = 'jisho2anki_config';
    const DEFAULT_CONFIG = {
        ankiUrl: 'http://127.0.0.1:8765',
        deckName: '',
        modelName: '',
        tags: 'jisho.org',
        fieldMapping: {}
    };

    // --- State Management ---
    let currentConfig = loadConfig();
    let availableDecks = [];
    let availableModels = [];
    let currentModelFields = [];

    // --- UI Constants ---
    const BUTTON_SIZE = '20px';
    const ICON_COLOR = '#999';
    const ICON_HOVER_COLOR = '#555';

    // Icons
    const UPLOAD_ICON = `<svg viewBox="0 0 24 24" width="${BUTTON_SIZE}" height="${BUTTON_SIZE}" stroke="${ICON_COLOR}" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>`;
    const CONFIG_ICON = `<svg viewBox="0 0 24 24" width="${BUTTON_SIZE}" height="${BUTTON_SIZE}" stroke="${ICON_COLOR}" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`;
    const SUCCESS_ICON = `<svg viewBox="0 0 24 24" width="${BUTTON_SIZE}" height="${BUTTON_SIZE}" stroke="#47DB27" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
    const ERROR_ICON = `<svg viewBox="0 0 24 24" width="${BUTTON_SIZE}" height="${BUTTON_SIZE}" stroke="#FF0000" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
    const LOADING_ICON = `<svg viewBox="0 0 24 24" width="${BUTTON_SIZE}" height="${BUTTON_SIZE}" stroke="#FFA500" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>`;

    // --- AnkiConnect Helper Functions ---

    function ankiInvoke(action, params = {}) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "POST",
                url: currentConfig.ankiUrl,
                data: JSON.stringify({ action, version: 6, params }),
                headers: { "Content-Type": "application/json" },
                onload: (response) => {
                    try {
                        const res = JSON.parse(response.responseText);
                        if (res.error) {
                            reject(res.error);
                        } else {
                            resolve(res.result);
                        }
                    } catch (e) {
                        reject("Failed to parse response: " + response.responseText);
                    }
                },
                onerror: (err) => {
                    reject("Network Error: Ensure Anki is running and AnkiConnect is installed.");
                }
            });
        });
    }

    async function checkConnection() {
        try {
            await ankiInvoke('version');
            return true;
        } catch (e) {
            return false;
        }
    }

    async function fetchAnkiData() {
        try {
            const [decks, models] = await Promise.all([
                ankiInvoke('deckNames'),
                ankiInvoke('modelNames')
            ]);
            availableDecks = decks || [];
            availableModels = models || [];
            return true;
        } catch (e) {
            console.error("Failed to fetch Anki data:", e);
            return false;
        }
    }

    async function fetchModelFields(modelName) {
        try {
            const fields = await ankiInvoke('modelFieldNames', { modelName });
            currentModelFields = fields || [];
            return currentModelFields;
        } catch (e) {
            console.error(`Failed to fetch fields for model ${modelName}:`, e);
            return [];
        }
    }

    // --- Local Storage Helpers ---
    function loadConfig() {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? { ...DEFAULT_CONFIG, ...JSON.parse(stored) } : DEFAULT_CONFIG;
    }

    function saveConfig() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(currentConfig));
    }

    // --- Data Extraction Logic (Fixed Reading Logic) ---
    function extractJishoData(context) {
        if (!context) return null;

        const textElement = context.querySelector('.concept_light-representation .text');
        const expression = textElement ? textElement.textContent.trim() : "";

        // --- Reading Extraction (Robust Fix) ---
        let reading = "";
        const furiganaElement = context.querySelector('.concept_light-representation .furigana');

        if (furiganaElement && textElement) {
            const fChildren = Array.from(furiganaElement.children);
            // 移除空白字符以确保字符索引对齐
            const cleanExpression = expression.replace(/\s+/g, '');

            // 策略 A: 字符数与假名块数完全一致 (适用于 "大切", "思い", "海沿い")
            if (fChildren.length === cleanExpression.length) {
                for (let i = 0; i < fChildren.length; i++) {
                    const fText = fChildren[i].textContent.trim();
                    if (fText) {
                        // 有假名就用假名 (例如 "たい", "おも")
                        reading += fText;
                    } else {
                        // 假名为空，说明是送假名，回退到使用原文对应的字符 (例如 "い")
                        reading += cleanExpression[i];
                    }
                }
            }
            // 策略 B: 数量不一致 (例如熟字训 "大人" -> "おとな": 1个假名块 vs 2个字符)
            // 此时回退到基于 DOM 文本节点的旧逻辑，或者简单拼接所有假名
            else {
                const tChildren = Array.from(textElement.childNodes).filter(node => {
                    return node.textContent.trim().length > 0;
                });

                for (let i = 0; i < fChildren.length; i++) {
                    const fText = fChildren[i].textContent.trim();
                    if (fText) {
                        reading += fText;
                    } else {
                        // 尝试匹配 DOM 节点
                        if (i < tChildren.length) {
                            reading += tChildren[i].textContent.trim();
                        }
                    }
                }
            }
        } else {
            reading = expression;
        }

        let formattedMeanings = [];
        let otherFormsRaw = [];
        let notesRaw = [];

        const meaningsWrapper = context.querySelector('.meanings-wrapper');
        if (meaningsWrapper) {
            let currentPOS = "";

            for (const child of meaningsWrapper.children) {
                if (child.classList.contains('meaning-tags')) {
                    const tagText = child.textContent.trim();
                    if (tagText === 'Notes') currentPOS = 'Notes';
                    else if (tagText.includes('Other forms')) currentPOS = 'Other forms';
                    else currentPOS = tagText;
                }
                else if (child.classList.contains('meaning-wrapper')) {
                    if (currentPOS === 'Other forms') {
                        const formText = child.querySelector('.meaning-meaning');
                        if (formText) otherFormsRaw.push(formText.textContent.trim());
                    }
                    else if (currentPOS === 'Notes') {
                        const defSection = child.querySelector('.meaning-definition');
                        if (defSection) {
                            const clone = defSection.cloneNode(true);
                            const readMore = clone.querySelector('a');
                            if (readMore && readMore.textContent.includes('Read more')) readMore.remove();
                            notesRaw.push(clone.textContent.trim());
                        }
                    }
                    else {
                        // --- Building Meaning Entry (HTML) ---
                        let entryHtml = `<div style="text-align: left; margin-bottom: 12px;">`;

                        if (currentPOS) {
                            entryHtml += `<div style="font-size: 0.85em; color: #666; margin-bottom: 2px;">[${currentPOS}]</div>`;
                        }

                        const defSection = child.querySelector('.meaning-definition');
                        if (defSection) {
                            const readMoreLink = defSection.querySelector('a');
                            if (readMoreLink && readMoreLink.textContent.includes('Read more')) readMoreLink.remove();

                            const meaningTextElem = defSection.querySelector('.meaning-meaning');
                            let defText = meaningTextElem ? meaningTextElem.textContent.trim() : defSection.textContent.trim();
                            const defNumberElement = defSection.querySelector('.meaning-definition-section_divider');
                            const defNumber = defNumberElement ? defNumberElement.textContent.trim() + " " : "";

                            entryHtml += `<div>${defNumber}${defText}</div>`;
                        }

                        const sentenceDiv = child.querySelector('.sentence');
                        if (sentenceDiv) {
                            const japSentence = sentenceDiv.querySelector('.japanese');
                            const engSentence = sentenceDiv.querySelector('.english');
                            if (japSentence && engSentence) {
                                const jClone = japSentence.cloneNode(true);
                                jClone.querySelectorAll('.furigana').forEach(f => f.remove());

                                const jpText = jClone.textContent.replace(/\s+/g, '').trim();

                                entryHtml += `<div style="margin-top: 5px; padding-left: 10px; border-left: 2px solid #ddd; font-size: 0.9em;">
                                                <div style="margin-bottom: 2px;">${jpText}</div>
                                                <div style="color: #555; font-style: italic;">${engSentence.textContent.trim()}</div>
                                              </div>`;
                            }
                        }

                        entryHtml += `</div>`;
                        formattedMeanings.push(entryHtml);
                    }
                }
            }
        }

        let otherFormsFormatted = "";
        if (otherFormsRaw.length > 0) {
            otherFormsFormatted = `<div style="text-align: left; margin-bottom: 5px;">
                                     <strong>Other forms:</strong> ${otherFormsRaw.join('; ')}
                                   </div>`;
        }

        let notesFormatted = "";
        if (notesRaw.length > 0) {
            notesFormatted = `<div style="text-align: left; margin-bottom: 5px;">
                                <strong>Notes:</strong><br>${notesRaw.join('<br>')}
                              </div>`;
        }

        return {
            expression,
            reading,
            meanings: formattedMeanings.join(''),
            otherForms: otherFormsFormatted,
            notes: notesFormatted
        };
    }

    // --- Step 4: Upload Logic ---

    async function uploadToAnki(entry, btnElement) {
        if (!currentConfig.deckName || !currentConfig.modelName) {
            alert("❌ Please configure Deck and Model first by clicking the gear icon.");
            createModal();
            return;
        }

        const jishoData = extractJishoData(entry);
        if (!jishoData) {
            alert("❌ Failed to extract data from this entry.");
            return;
        }

        const originalIcon = btnElement.innerHTML;
        btnElement.innerHTML = LOADING_ICON;

        try {
            const modelMapping = currentConfig.fieldMapping[currentConfig.modelName];
            const ankiFields = {};

            if (!modelMapping) {
                throw new Error(`No field mapping found for model: ${currentConfig.modelName}. Please configure mapping.`);
            }

            for (const [ankiField, jishoKeys] of Object.entries(modelMapping)) {
                if (Array.isArray(jishoKeys) && jishoKeys.length > 0) {
                    const values = jishoKeys
                        .map(key => jishoData[key])
                        .filter(val => val && val.trim() !== "");

                    if (values.length > 0) {
                        ankiFields[ankiField] = values.join('<br>');
                    }
                }
            }

            const tags = currentConfig.tags.split(' ').map(t => t.trim()).filter(t => t !== "");
            tags.push('jisho2anki');

            const note = {
                deckName: currentConfig.deckName,
                modelName: currentConfig.modelName,
                fields: ankiFields,
                options: {
                    allowDuplicate: false,
                    duplicateScope: "deck",
                    duplicateScopeOptions: {
                        deckName: currentConfig.deckName,
                        checkChildren: false,
                        checkAllModels: false
                    }
                },
                tags: tags
            };

            console.log("[Jisho2Anki] Sending Note:", note);

            const noteId = await ankiInvoke('addNote', { note });

            if (noteId === null) {
                throw new Error("Duplicate note likely exists.");
            }

            console.log(`[Jisho2Anki] Success! Note ID: ${noteId}`);
            btnElement.innerHTML = SUCCESS_ICON;

        } catch (e) {
            console.error("[Jisho2Anki] Upload Failed:", e);
            btnElement.innerHTML = ERROR_ICON;
            alert(`❌ Upload Failed:\n${e}`);
            setTimeout(() => { btnElement.innerHTML = originalIcon; }, 3000);
        }
    }

    // --- UI Helpers for Dynamic Mapping ---

    const JISHO_KEYS = ['expression', 'reading', 'meanings', 'otherForms', 'notes'];

    function createMappingSelect(selectedValue = "") {
        const sel = document.createElement('select');
        // Core modification: Add boxSizing and margin: 0 to eliminate alignment errors
        Object.assign(sel.style, {
            width: '100%',             // Fill the container
            height: '30px',            // Fixed height
            boxSizing: 'border-box',   // Include padding and border in width
            margin: '0',               // Remove default browser margin
            padding: '0 5px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            backgroundColor: '#fff',
            fontSize: '13px',
            verticalAlign: 'middle'
        });

        const emptyOpt = document.createElement('option');
        emptyOpt.text = '-- Ignore --';
        emptyOpt.value = '';
        sel.appendChild(emptyOpt);

        JISHO_KEYS.forEach(key => {
            const opt = document.createElement('option');
            opt.value = key;
            opt.text = key;
            if (selectedValue === key) opt.selected = true;
            sel.appendChild(opt);
        });
        return sel;
    }

    function createMappingRow(ankiField, initialValues = []) {
        const container = document.createElement('div');
        Object.assign(container.style, {
            marginBottom: '10px',
            borderBottom: '1px dashed #eee',
            paddingBottom: '8px'
        });
        container.dataset.ankiField = ankiField;

        // Label
        const label = document.createElement('div');
        label.textContent = ankiField;
        Object.assign(label.style, {
            fontWeight: 'bold',
            fontSize: '0.9em',
            marginBottom: '4px',
            color: '#333'
        });
        container.appendChild(label);

        // Input control container
        const inputsDiv = document.createElement('div');
        container.appendChild(inputsDiv);

        // Style constants
        const ROW_STYLE = {
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            width: '100%',
            marginBottom: '5px'
        };

        const BUTTON_STYLE = {
            flex: '0 0 30px',          // Fixed width 30px
            width: '30px',
            height: '30px',
            boxSizing: 'border-box',
            margin: '0',
            padding: '0',
            cursor: 'pointer',
            backgroundColor: '#f8f8f8',
            border: '1px solid #ccc',
            borderRadius: '4px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '16px',
            lineHeight: '1',
            color: '#555'
        };

        // Helper function: Create a single row of input (with optional right element)
        const createRowElement = (selectedValue, rightElement) => {
            const row = document.createElement('div');
            Object.assign(row.style, ROW_STYLE);

            const select = createMappingSelect(selectedValue);
            select.style.flex = '1'; // Automatically fill remaining space

            row.appendChild(select);
            if (rightElement) {
                row.appendChild(rightElement);
            }
            return row;
        };

        // Helper function: Create spacer (for aligning rows without buttons)
        const createSpacer = () => {
            const spacer = document.createElement('div');
            // Copy button layout attributes but make it invisible
            Object.assign(spacer.style, BUTTON_STYLE, {
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'default',
                visibility: 'hidden' // Key: Invisible but occupies space
            });
            return spacer;
        };

        // --- First row: Dropdown + Real "+" button ---
        const values = (initialValues && initialValues.length > 0) ? initialValues : [''];

        const addBtn = document.createElement('button');
        addBtn.textContent = '+';
        addBtn.title = "Add another source field";
        Object.assign(addBtn.style, BUTTON_STYLE);

        // Button interaction
        addBtn.onmouseover = () => {
            addBtn.style.backgroundColor = '#e8e8e8';
            addBtn.style.borderColor = '#bbb';
        };
        addBtn.onmouseout = () => {
            addBtn.style.backgroundColor = '#f8f8f8';
            addBtn.style.borderColor = '#ccc';
        };

        // Add first row
        inputsDiv.appendChild(createRowElement(values[0], addBtn));

        // --- Subsequent rows: Dropdown + Spacer ---
        for (let i = 1; i < values.length; i++) {
            inputsDiv.appendChild(createRowElement(values[i], createSpacer()));
        }

        // --- Button Click Event: Add new row (with spacer) ---
        addBtn.onclick = () => {
            // New rows must also have a spacer to maintain alignment
            inputsDiv.appendChild(createRowElement('', createSpacer()));
        };

        return container;
    }

    // --- Modal UI Construction ---

    function createModal() {
        if (document.getElementById('jisho2anki-modal')) return;

        const modalOverlay = document.createElement('div');
        modalOverlay.id = 'jisho2anki-modal';
        Object.assign(modalOverlay.style, {
            position: 'fixed', top: '0', left: '0', width: '100%', height: '100%',
            backgroundColor: 'rgba(0,0,0,0.5)', zIndex: '10000', display: 'flex',
            justifyContent: 'center', alignItems: 'center'
        });

        const modalContent = document.createElement('div');
        Object.assign(modalContent.style, {
            backgroundColor: 'white', padding: '20px', borderRadius: '8px',
            width: '500px', maxWidth: '90%', maxHeight: '90vh',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            fontFamily: 'sans-serif', fontSize: '14px',
            display: 'flex', flexDirection: 'column'
        });

        const header = document.createElement('h2');
        header.textContent = 'Jisho2Anki Configuration';
        header.style.marginTop = '0';
        header.style.borderBottom = '1px solid #eee';
        header.style.paddingBottom = '10px';
        header.style.flexShrink = '0';

        const scrollableContent = document.createElement('div');
        Object.assign(scrollableContent.style, {
            overflowY: 'auto', paddingRight: '5px', flexGrow: '1'
        });

        const urlGroup = createInputGroup('AnkiConnect URL:', 'text', currentConfig.ankiUrl);
        const urlInput = urlGroup.querySelector('input');
        const statusSpan = document.createElement('span');
        statusSpan.style.marginLeft = '10px';
        statusSpan.style.fontWeight = 'bold';
        urlGroup.appendChild(statusSpan);

        const updateStatus = (isConnected, msg) => {
            statusSpan.textContent = msg;
            statusSpan.style.color = isConnected ? 'green' : 'red';
            deckSelect.disabled = !isConnected;
            modelSelect.disabled = !isConnected;
            if (isConnected) refreshDropdowns();
        };

        const tryConnect = async () => {
            statusSpan.textContent = 'Checking...';
            statusSpan.style.color = 'orange';
            currentConfig.ankiUrl = urlInput.value;
            const connected = await checkConnection();
            if (connected) {
                const dataFetched = await fetchAnkiData();
                if (dataFetched) {
                    updateStatus(true, 'Connected!');
                } else {
                    updateStatus(false, 'Connected, but failed to fetch data.');
                }
            } else {
                updateStatus(false, 'Connection Failed');
            }
        };

        urlInput.addEventListener('blur', tryConnect);

        const deckGroup = createSelectGroup('Target Deck:', 'Loading...');
        const deckSelect = deckGroup.querySelector('select');
        deckSelect.disabled = true;

        const modelGroup = createSelectGroup('Note Type (Model):', 'Loading...');
        const modelSelect = modelGroup.querySelector('select');
        modelSelect.disabled = true;

        const tagGroup = createInputGroup('Tags (space separated):', 'text', currentConfig.tags);
        const tagInput = tagGroup.querySelector('input');

        const mappingContainer = document.createElement('div');
        Object.assign(mappingContainer.style, {
            marginTop: '15px', padding: '10px', backgroundColor: '#f9f9f9',
            border: '1px solid #eee',
            maxHeight: '300px', overflowY: 'auto'
        });
        mappingContainer.innerHTML = '<strong>Field Mapping</strong><br><small style="color:#666">Select a Model first to map fields.</small>';

        const refreshDropdowns = () => {
            deckSelect.innerHTML = '';
            availableDecks.forEach(d => {
                const opt = document.createElement('option');
                opt.value = d;
                opt.textContent = d;
                if (d === currentConfig.deckName) opt.selected = true;
                deckSelect.appendChild(opt);
            });

            modelSelect.innerHTML = '';
            availableModels.forEach(m => {
                const opt = document.createElement('option');
                opt.value = m;
                opt.textContent = m;
                if (m === currentConfig.modelName) opt.selected = true;
                modelSelect.appendChild(opt);
            });

            if (modelSelect.value) generateMappingInputs(modelSelect.value);
        };

        const generateMappingInputs = async (modelName) => {
            mappingContainer.innerHTML = 'Loading fields...';
            const fields = await fetchModelFields(modelName);
            mappingContainer.innerHTML = `<strong>Mapping for: ${modelName}</strong><br><small>Click [+] to map multiple sources to one field (joined by newlines).</small><hr style="margin:5px 0 10px 0; border:0; border-top:1px solid #ddd;">`;

            if (fields.length === 0) {
                mappingContainer.innerHTML += '<span style="color:red">No fields found.</span>';
                return;
            }

            const savedMapping = currentConfig.fieldMapping[modelName] || {};

            fields.forEach(field => {
                const row = createMappingRow(field, savedMapping[field]);
                mappingContainer.appendChild(row);
            });
        };

        modelSelect.addEventListener('change', (e) => {
            generateMappingInputs(e.target.value);
        });

        const footer = document.createElement('div');
        Object.assign(footer.style, { marginTop: '20px', textAlign: 'right', flexShrink: '0', paddingTop: '10px', borderTop: '1px solid #eee' });

        const saveBtn = document.createElement('button');
        saveBtn.textContent = 'Save & Close';
        Object.assign(saveBtn.style, {
            padding: '8px 16px', backgroundColor: '#47DB27', color: 'white',
            border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold'
        });

        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = 'Cancel';
        Object.assign(cancelBtn.style, {
            padding: '8px 16px', backgroundColor: '#ccc', color: 'white',
            border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '10px'
        });

        saveBtn.onclick = () => {
            currentConfig.ankiUrl = urlInput.value;
            currentConfig.deckName = deckSelect.value;
            currentConfig.modelName = modelSelect.value;
            currentConfig.tags = tagInput.value;

            if (modelSelect.value) {
                if (!currentConfig.fieldMapping) currentConfig.fieldMapping = {};
                const newModelMapping = {};
                const rows = mappingContainer.querySelectorAll('div[data-anki-field]');
                rows.forEach(row => {
                    const ankiField = row.dataset.ankiField;
                    const selects = row.querySelectorAll('select');
                    const values = [];
                    selects.forEach(s => {
                        if (s.value) values.push(s.value);
                    });
                    if (values.length > 0) newModelMapping[ankiField] = values;
                });
                currentConfig.fieldMapping[modelSelect.value] = newModelMapping;
            }

            saveConfig();
            document.body.removeChild(modalOverlay);
        };

        cancelBtn.onclick = () => {
            document.body.removeChild(modalOverlay);
        };

        footer.appendChild(cancelBtn);
        footer.appendChild(saveBtn);

        scrollableContent.appendChild(urlGroup);
        scrollableContent.appendChild(deckGroup);
        scrollableContent.appendChild(modelGroup);
        scrollableContent.appendChild(tagGroup);
        scrollableContent.appendChild(mappingContainer);

        modalContent.appendChild(header);
        modalContent.appendChild(scrollableContent);
        modalContent.appendChild(footer);

        modalOverlay.appendChild(modalContent);
        document.body.appendChild(modalOverlay);

        tryConnect();
    }

    function createInputGroup(labelText, type, value) {
        const div = document.createElement('div');
        div.style.marginBottom = '10px';
        const label = document.createElement('label');
        label.textContent = labelText;
        label.style.display = 'block';
        label.style.marginBottom = '5px';
        label.style.fontWeight = 'bold';

        const input = document.createElement('input');
        input.type = type;
        input.value = value || '';
        input.style.width = '100%';
        input.style.padding = '5px';
        input.style.boxSizing = 'border-box';

        div.appendChild(label);
        div.appendChild(input);
        return div;
    }

    function createSelectGroup(labelText, placeholder) {
        const div = document.createElement('div');
        div.style.marginBottom = '10px';
        const label = document.createElement('label');
        label.textContent = labelText;
        label.style.display = 'block';
        label.style.marginBottom = '5px';
        label.style.fontWeight = 'bold';

        const select = document.createElement('select');
        select.style.width = '100%';
        select.style.padding = '5px';

        const opt = document.createElement('option');
        opt.textContent = placeholder;
        select.appendChild(opt);

        div.appendChild(label);
        div.appendChild(select);
        return div;
    }

    function createButton(htmlIcon, title, onClickHandler) {
        const btn = document.createElement('button');
        btn.innerHTML = htmlIcon;
        btn.title = title;
        btn.className = 'jisho2anki-btn';
        Object.assign(btn.style, {
            background: 'none', border: 'none', cursor: 'pointer',
            padding: '2px 5px', transition: 'all 0.2s ease', verticalAlign: 'middle'
        });

        btn.onmouseover = () => {
            const svg = btn.querySelector('svg');
            if (svg && svg.style.stroke === 'rgb(153, 153, 153)')
                svg.style.stroke = ICON_HOVER_COLOR;
        };
        btn.onmouseout = () => {
            const svg = btn.querySelector('svg');
            if (svg && svg.style.stroke === 'rgb(85, 85, 85)')
                svg.style.stroke = ICON_COLOR;
        };

        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            onClickHandler(e, btn);
        });

        return btn;
    }

    function injectControls() {
        const wordEntries = document.querySelectorAll('.concept_light');

        wordEntries.forEach(entry => {
            if (entry.querySelector('.jisho2anki-controls')) return;

            const container = document.createElement('div');
            container.className = 'jisho2anki-controls';
            Object.assign(container.style, {
                display: 'inline-block', marginLeft: '10px'
            });

            const uploadBtn = createButton(UPLOAD_ICON, "Upload this word to Anki", (e, btn) => {
                uploadToAnki(entry, btn);
            });

            const configBtn = createButton(CONFIG_ICON, "Configure AnkiConnect", () => {
                createModal();
            });

            container.appendChild(uploadBtn);
            container.appendChild(configBtn);

            const statusDiv = entry.querySelector('.concept_light-status');
            if (statusDiv) {
                statusDiv.insertBefore(container, statusDiv.firstChild);
            } else {
                const wrapper = entry.querySelector('.concept_light-wrapper');
                if (wrapper) wrapper.appendChild(container);
            }
        });
    }

    const observer = new MutationObserver((mutations) => {
        injectControls();
    });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            injectControls();
            observer.observe(document.body, { childList: true, subtree: true });
        });
    } else {
        injectControls();
        observer.observe(document.body, { childList: true, subtree: true });
    }

})();