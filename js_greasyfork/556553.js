// ==UserScript==
// @name         タグオートコンプリート for android
// @version      1.4
// @description  webおすすめ
// @author       ぶいぶい
// @match        https://novelai.net/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @license MIT
// @namespace https://greasyfork.org/users/1496724
// @downloadURL https://update.greasyfork.org/scripts/556553/%E3%82%BF%E3%82%B0%E3%82%AA%E3%83%BC%E3%83%88%E3%82%B3%E3%83%B3%E3%83%97%E3%83%AA%E3%83%BC%E3%83%88%20for%20android.user.js
// @updateURL https://update.greasyfork.org/scripts/556553/%E3%82%BF%E3%82%B0%E3%82%AA%E3%83%BC%E3%83%88%E3%82%B3%E3%83%B3%E3%83%97%E3%83%AA%E3%83%BC%E3%83%88%20for%20android.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- Constants ---
    const DB_NAME = 'AITagDB';
    const DB_VERSION = 1;
    const STORE_NAME = 'tags';
    const TRIGGER_CHARS = 3;

    // --- Helper: ContentEditable & Insertion Logic ---
    const EditorUtils = {
        isEditable(el) {
            if (!el) return false;
            return el.tagName === 'TEXTAREA' || 
                   (el.tagName === 'INPUT' && el.type === 'text') || 
                   el.isContentEditable;
        },
        getValue(el) {
            if (el.tagName === 'TEXTAREA' || el.tagName === 'INPUT') return el.value;
            return el.textContent; 
        },
        getCursorPos(el) {
            if (el.tagName === 'TEXTAREA' || el.tagName === 'INPUT') return el.selectionStart;
            let pos = 0;
            const sel = window.getSelection();
            if (sel.rangeCount > 0) {
                const range = sel.getRangeAt(0);
                const preCaretRange = range.cloneRange();
                preCaretRange.selectNodeContents(el);
                preCaretRange.setEnd(range.endContainer, range.endOffset);
                pos = preCaretRange.toString().length;
            }
            return pos;
        },
        replaceLastWord(el, wordLengthToReplace, textToInsert) {
            el.focus();
            if (el.tagName === 'TEXTAREA' || el.tagName === 'INPUT') {
                const start = el.selectionStart - wordLengthToReplace;
                const end = el.selectionEnd;
                if (typeof el.setRangeText === 'function') {
                    el.setRangeText(textToInsert, start, end, 'end');
                    el.dispatchEvent(new Event('input', { bubbles: true }));
                } else {
                    el.setSelectionRange(start, end);
                    document.execCommand('insertText', false, textToInsert);
                }
            } else {
                const sel = window.getSelection();
                if (sel.rangeCount > 0) {
                    const range = sel.getRangeAt(0);
                    if (range.startContainer.nodeType === 3) { 
                        const newStart = Math.max(0, range.startOffset - wordLengthToReplace);
                        range.setStart(range.startContainer, newStart);
                        sel.removeAllRanges();
                        sel.addRange(range);
                    }
                }
                document.execCommand('insertText', false, textToInsert);
            }
        },
        sendShiftEnter(el) {
            el.focus();
            const eventParams = {
                key: 'Enter', code: 'Enter', keyCode: 13, which: 13,
                bubbles: true, cancelable: true, shiftKey: true, composed: true
            };
            el.dispatchEvent(new KeyboardEvent('keydown', eventParams));
            el.dispatchEvent(new KeyboardEvent('keypress', eventParams));
            el.dispatchEvent(new KeyboardEvent('keyup', eventParams));
            el.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        }
    };

    // --- Helper: CSV Parser ---
    function parseCSVLine(text) {
        const result = [];
        let startValueIndex = 0;
        let inQuotes = false;
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            if (char === '"') inQuotes = !inQuotes;
            else if (char === ',' && !inQuotes) {
                let val = text.substring(startValueIndex, i).trim();
                if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1).replace(/""/g, '"');
                result.push(val);
                startValueIndex = i + 1;
            }
        }
        let val = text.substring(startValueIndex).trim();
        if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1).replace(/""/g, '"');
        result.push(val);
        return result;
    }

    // --- Snippet Manager ---
    class SnippetManager {
        constructor() { this.snippets = GM_getValue('snippets', {}); }
        save(key, value) { this.snippets[key] = value; GM_setValue('snippets', this.snippets); }
        remove(key) { delete this.snippets[key]; GM_setValue('snippets', this.snippets); }
        get(key) { return this.snippets[key]; }
        search(query) {
            const keys = Object.keys(this.snippets);
            const matched = keys.filter(k => k.startsWith(query));
            return matched.map(k => ({ name: k, value: this.snippets[k], type: 'snippet', count: 99999999 }));
        }
        getAll() { return this.snippets; }
    }

    // --- IndexedDB Manager ---
    class IndexedDBManager {
        constructor() { 
            this.db = null; 
            this.cache = null; 
            this.useMemory = GM_getValue('useMemory', true); 
        }

        setMode(useMemory) {
            this.useMemory = useMemory;
            if (this.useMemory && !this.cache) {
                this.loadCacheToMemory();
            } else if (!this.useMemory) {
                this.cache = null; 
            }
        }

        async init() {
            return new Promise((resolve, reject) => {
                const request = indexedDB.open(DB_NAME, DB_VERSION);
                request.onerror = (e) => reject(e.target.error);
                request.onsuccess = (e) => { 
                    this.db = e.target.result; 
                    if (this.useMemory) this.loadCacheToMemory();
                    resolve(this.db); 
                };
                request.onupgradeneeded = (e) => {
                    const db = e.target.result;
                    if (!db.objectStoreNames.contains(STORE_NAME)) {
                        const store = db.createObjectStore(STORE_NAME, { keyPath: 'name' });
                        store.createIndex('count', 'count', { unique: false });
                    }
                };
            });
        }

        async loadCacheToMemory() {
            if (!this.db) return;
            const tx = this.db.transaction([STORE_NAME], 'readonly');
            const store = tx.objectStore(STORE_NAME);
            const req = store.getAll();
            req.onsuccess = () => {
                this.cache = req.result;
                console.log(`Cache loaded: ${this.cache ? this.cache.length : 0} tags`);
            };
        }

        async importCSV(csvText) {
            if (!this.db) await this.init();
            return new Promise((resolve, reject) => {
                const tx = this.db.transaction([STORE_NAME], 'readwrite');
                const store = tx.objectStore(STORE_NAME);
                tx.oncomplete = () => {
                    if (this.useMemory) this.loadCacheToMemory();
                    resolve();
                };
                tx.onerror = (e) => reject(e.target.error);
                const lines = csvText.split(/\r?\n/);
                lines.forEach(line => {
                    if (!line.trim()) return;
                    const parts = parseCSVLine(line);
                    if (parts.length >= 1) {
                        store.put({
                            name: parts[0],
                            category: parseInt(parts[1]) || 0,
                            count: parseInt(parts[2]) || 0,
                            description: parts.slice(3).join(' ')
                        });
                    }
                });
            });
        }

        async search(query, useDesc, limit = 30) {
            if (!this.db) await this.init();
            
            const lowerQueryRaw = query.toLowerCase();
            const lowerQueryNorm = lowerQueryRaw.replace(/ /g, '_');

            if (this.useMemory && this.cache) {
                const results = [];
                for (let i = 0; i < this.cache.length; i++) {
                    const val = this.cache[i];
                    const valName = val.name.toLowerCase();
                    const matchNamePart = valName.includes(lowerQueryNorm);
                    const matchDesc = useDesc && val.description && val.description.toLowerCase().includes(lowerQueryRaw);

                    if (matchNamePart || matchDesc) {
                        let item = val; 
                        if (valName === lowerQueryNorm) item = { ...val, count: val.count + 100000000 };
                        results.push(item);
                    }
                }
                return results.sort((a, b) => b.count - a.count).slice(0, limit);
            } else {
                return new Promise((resolve) => {
                    const tx = this.db.transaction([STORE_NAME], 'readonly');
                    const store = tx.objectStore(STORE_NAME);
                    const results = [];
                    const req = store.openCursor();
                    req.onsuccess = (e) => {
                        const cursor = e.target.result;
                        if (cursor) {
                            const val = cursor.value;
                            const valName = val.name.toLowerCase();
                            
                            const matchName = valName.startsWith(lowerQueryNorm); 
                            const matchNamePart = valName.includes(lowerQueryNorm); 
                            const matchDesc = useDesc && val.description && val.description.toLowerCase().includes(lowerQueryRaw);

                            if (matchName || matchDesc || matchNamePart) {
                                if (valName === lowerQueryNorm) val.count += 100000000;
                                results.push(val);
                            }
                            if (results.length < limit * 4) cursor.continue();
                            else resolve(results.sort((a, b) => b.count - a.count).slice(0, limit));
                        } else {
                            resolve(results.sort((a, b) => b.count - a.count).slice(0, limit));
                        }
                    };
                    req.onerror = () => resolve([]);
                });
            }
        }
    }

    // --- Settings UI ---
    class SettingsUI {
        constructor(dbMgr, snipMgr) {
            this.dbMgr = dbMgr; this.snipMgr = snipMgr; this.overlay = null;
            this.config = {
                searchDesc: GM_getValue('searchDesc', false),
                rowCount: GM_getValue('rowCount', 1),
                useMemory: GM_getValue('useMemory', true)
            };
        }
        createOverlay() {
            if (this.overlay) return;
            this.overlay = document.createElement('div');
            Object.assign(this.overlay.style, {
                position: 'fixed', top: '0', left: '0', width: '100%', height: '100%',
                backgroundColor: 'rgba(0,0,0,0.8)', zIndex: '100000', display: 'none',
                justifyContent: 'center', alignItems: 'flex-start', paddingTop: '50px',
                color: '#fff', fontFamily: 'sans-serif', fontSize: '14px'
            });
            const container = document.createElement('div');
            Object.assign(container.style, {
                backgroundColor: '#222', padding: '20px', borderRadius: '8px',
                width: '90%', maxWidth: '400px', maxHeight: '80%', overflowY: 'auto',
                border: '1px solid #444'
            });
            const btnStyle = "background: #444; color: white; border: 1px solid #666; padding: 8px; border-radius: 4px; width: 100%; margin-top: 5px;";
            const inputStyle = "background: #333; color: white; border: 1px solid #555; padding: 5px; border-radius: 4px;";
            container.innerHTML = '<h3 style="margin-top:0;">AI Tag Config</h3>';

            // --- Mode ---
            const modeDiv = document.createElement('div');
            modeDiv.style.marginBottom = '10px';
            modeDiv.innerHTML = '<h4>Search Mode</h4>';
            const modeLabel = document.createElement('label'); 
            modeLabel.style.display = 'flex'; modeLabel.style.alignItems = 'center';
            const modeCheck = document.createElement('input'); modeCheck.type = 'checkbox';
            modeCheck.checked = this.config.useMemory; modeCheck.style.marginRight = '10px';
            modeCheck.onchange = () => {
                this.config.useMemory = modeCheck.checked;
                GM_setValue('useMemory', modeCheck.checked);
                this.dbMgr.setMode(modeCheck.checked);
            };
            modeLabel.appendChild(modeCheck); 
            modeLabel.appendChild(document.createTextNode('In-Memory (Fast, High RAM)'));
            modeDiv.appendChild(modeLabel);
            container.appendChild(modeDiv);
            container.appendChild(document.createElement('hr'));

            // --- UI ---
            const uiDiv = document.createElement('div'); uiDiv.innerHTML = '<h4>UI Settings</h4>';
            const rowLabel = document.createElement('div'); rowLabel.textContent = `Display Rows: ${this.config.rowCount}`;
            rowLabel.style.marginBottom = '5px';
            const rowRange = document.createElement('input');
            rowRange.type = 'range'; rowRange.min = '1'; rowRange.max = '4'; rowRange.step = '1';
            rowRange.value = this.config.rowCount; rowRange.style.width = '100%';
            rowRange.oninput = () => {
                this.config.rowCount = parseInt(rowRange.value);
                rowLabel.textContent = `Display Rows: ${this.config.rowCount}`;
                GM_setValue('rowCount', this.config.rowCount);
            };
            uiDiv.appendChild(rowLabel); uiDiv.appendChild(rowRange); container.appendChild(uiDiv);

            const optDiv = document.createElement('div'); optDiv.style.marginTop = '15px';
            const descLabel = document.createElement('label'); descLabel.style.display = 'flex'; descLabel.style.alignItems = 'center';
            const descCheck = document.createElement('input'); descCheck.type = 'checkbox';
            descCheck.checked = this.config.searchDesc; descCheck.style.marginRight = '10px';
            descCheck.onchange = () => { this.config.searchDesc = descCheck.checked; GM_setValue('searchDesc', descCheck.checked); };
            descLabel.appendChild(descCheck); descLabel.appendChild(document.createTextNode('Search Description'));
            optDiv.appendChild(descLabel); container.appendChild(optDiv); container.appendChild(document.createElement('hr'));

            // --- CSV ---
            const hCsv = document.createElement('h4'); hCsv.textContent = 'CSV Import'; container.appendChild(hCsv);
            const fileIn = document.createElement('input'); fileIn.type = 'file'; fileIn.accept = '.csv';
            fileIn.style.cssText = inputStyle + "width:95%;"; container.appendChild(fileIn);
            const loadBtn = document.createElement('button'); loadBtn.textContent = 'Load CSV'; loadBtn.style.cssText = btnStyle;
            loadBtn.onclick = () => {
                if(!fileIn.files[0]) return alert('Select CSV');
                const r = new FileReader(); loadBtn.textContent = 'Loading...'; loadBtn.disabled = true;
                r.onload = async (e) => { await this.dbMgr.importCSV(e.target.result); alert('Done'); loadBtn.textContent = 'Load CSV'; loadBtn.disabled = false; };
                r.readAsText(fileIn.files[0]);
            };
            container.appendChild(loadBtn);
            container.appendChild(document.createElement('hr'));

            // --- Snippets ---
            const hSnip = document.createElement('h4'); hSnip.textContent = 'Snippets Manage'; container.appendChild(hSnip);
            
            const snipInputDiv = document.createElement('div');
            snipInputDiv.style.display = 'flex';
            snipInputDiv.style.gap = '5px';
            const snipK = document.createElement('input'); snipK.placeholder = 'Key'; snipK.style.cssText = inputStyle + "flex: 1;";
            const snipV = document.createElement('input'); snipV.placeholder = 'Value'; snipV.style.cssText = inputStyle + "flex: 2;";
            snipInputDiv.append(snipK, snipV);
            container.appendChild(snipInputDiv);

            const snipAdd = document.createElement('button'); snipAdd.textContent = 'Add Snippet'; snipAdd.style.cssText = btnStyle;
            container.appendChild(snipAdd);

            const snipListDiv = document.createElement('div');
            snipListDiv.style.cssText = "margin-top: 15px; max-height: 150px; overflow-y: auto; border: 1px solid #444; border-radius: 4px; padding: 5px; background: #1a1a1a;";
            container.appendChild(snipListDiv);

            const renderSnipList = () => {
                snipListDiv.innerHTML = '';
                const all = this.snipMgr.getAll();
                const keys = Object.keys(all).sort();
                if (keys.length === 0) {
                    snipListDiv.innerHTML = '<div style="color:#666; padding:5px; font-style:italic;">No snippets</div>';
                    return;
                }
                keys.forEach(k => {
                    const row = document.createElement('div');
                    row.style.cssText = "display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #333; padding: 4px;";
                    const info = document.createElement('div');
                    info.style.overflow = 'hidden';
                    info.innerHTML = `<span style="color:#ffeb3b; font-weight:bold;">${k}</span> <span style="color:#aaa;">→</span> <span style="color:#ddd;">${all[k]}</span>`;
                    const delBtn = document.createElement('button');
                    delBtn.textContent = '×';
                    delBtn.style.cssText = "background:#d32f2f; color:white; border:none; border-radius:4px; width:24px; height:24px; font-weight:bold; margin-left:10px; cursor:pointer;";
                    delBtn.onclick = () => {
                        this.snipMgr.remove(k);
                        renderSnipList();
                    };
                    row.append(info, delBtn);
                    snipListDiv.appendChild(row);
                });
            };

            snipAdd.onclick = () => {
                if(snipK.value && snipV.value) {
                    this.snipMgr.save(snipK.value.trim(), snipV.value.trim());
                    snipK.value=''; snipV.value='';
                    renderSnipList();
                }
            };
            renderSnipList();

            // --- Close ---
            const closeBtn = document.createElement('button'); closeBtn.textContent = 'Close';
            closeBtn.style.cssText = btnStyle + "margin-top:20px; background: #666;";
            closeBtn.onclick = () => this.hide();
            container.appendChild(closeBtn);
            
            this.overlay.appendChild(container); document.body.appendChild(this.overlay);
        }
        show() { if(!this.overlay) this.createOverlay(); this.overlay.style.display='flex'; }
        hide() { if(this.overlay) this.overlay.style.display='none'; }
        getConfig() { return this.config; }
    }

    // --- Suggestion UI ---
    class SuggestionUI {
        constructor(snipMgr) {
            this.snipMgr = snipMgr; 
            this.container = null; 
            this.enterBtn = null;
            this.visible = false; 
            this.activeInput = null; 
            this.lastQueryLength = 0;
            this.rowCount = 1;
            this.initStyles();
        }
        initStyles() {
            GM_addStyle(`
                #ai-tag-ui {
                    position: fixed; z-index: 999999; background: #121212; color: #e0e0e0;
                    border-top: 1px solid #333; box-shadow: 0 -4px 12px rgba(0,0,0,0.5);
                    display: none; left: 0; width: 100%; box-sizing: border-box;
                    display: grid; grid-auto-flow: column; gap: 4px 8px; padding: 8px;
                    overflow-x: auto; overflow-y: hidden; touch-action: pan-x;
                    -webkit-overflow-scrolling: touch; scrollbar-width: none;
                    padding-bottom: max(8px, env(safe-area-inset-bottom, 0px));
                }
                .ai-tag-chip {
                    display: inline-block; padding: 6px 12px; margin: 0;
                    border-radius: 4px; font-size: 14px; cursor: pointer; background: #2c2c2c;
                    border-left: 3px solid #555; user-select: none;
                    white-space: nowrap; height: 32px; line-height: 20px; box-sizing: border-box;
                }
                .ai-tag-snip { border-left-color: #ffeb3b; background: #424220; }
                .ai-tag-c0 { border-left-color: #9e9e9e; } .ai-tag-c1 { border-left-color: #f44336; }
                .ai-tag-c3 { border-left-color: #e040fb; } .ai-tag-c4 { border-left-color: #00e676; }
                .ai-tag-count { font-size: 0.75em; opacity: 0.7; margin-left: 4px; }
                
                #ai-tag-enter-btn {
                    position: fixed; z-index: 1000000;
                    width: 44px; height: 44px;
                    background: #d32f2f; color: white;
                    border-radius: 50%; border: 2px solid #ff5252;
                    display: none; align-items: center; justify-content: center;
                    font-size: 20px; font-weight: bold; cursor: pointer;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.5);
                    touch-action: none;
                }
            `);
        }
        createContainer() {
            if (this.container) return;
            
            this.container = document.createElement('div'); this.container.id = 'ai-tag-ui';
            document.body.appendChild(this.container);
            this.container.addEventListener('mousedown', e => e.preventDefault());
            this.container.addEventListener('click', (e) => {
                e.preventDefault(); e.stopPropagation();
                const chip = e.target.closest('.ai-tag-chip');
                if (chip) {
                    const val = chip.dataset.value;
                    if (val) this.insert(val);
                }
            });

            this.enterBtn = document.createElement('div');
            this.enterBtn.id = 'ai-tag-enter-btn';
            this.enterBtn.innerHTML = '⏎';
            
            const handleTouch = (e) => {
                e.preventDefault();
                e.stopPropagation(); 
                e.stopImmediatePropagation();
                if (this.activeInput) EditorUtils.sendShiftEnter(this.activeInput);
            };

            this.enterBtn.addEventListener('touchstart', handleTouch, { passive: false });
            this.enterBtn.addEventListener('mousedown', (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (this.activeInput) EditorUtils.sendShiftEnter(this.activeInput);
            });
            this.enterBtn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); });

            document.body.appendChild(this.enterBtn);
        }
        render(results, inputElement, queryLength, rowCount) {
            if (!this.container) this.createContainer();
            this.activeInput = inputElement;
            this.lastQueryLength = queryLength;
            if (this.rowCount !== rowCount) {
                this.rowCount = rowCount;
                this.container.style.gridTemplateRows = `repeat(${rowCount}, auto)`;
            }
            let html = ''; 
            results.forEach(item => {
                const typeClass = item.type === 'snippet' ? 'ai-tag-snip' : `ai-tag-c${item.category}`;
                const dispName = item.name.replace(/_/g, ' ');
                const val = item.type === 'snippet' ? item.value : item.name;
                const countHtml = item.count > 0 ? `<span class="ai-tag-count">${(item.count/1000).toFixed(0)}k</span>` : '';
                const icon = item.type === 'snippet' ? '★ ' : '';
                html += `<div class="ai-tag-chip ${typeClass}" data-value="${val}">${icon}${dispName}${countHtml}</div>`;
            });
            this.container.innerHTML = html;
            this.show();
        }
        insert(text) {
            if (!this.activeInput) return;
            const el = this.activeInput;
            const cleanText = text.replace(/_/g, ' ');
            const finalText = cleanText + ', ';
            EditorUtils.replaceLastWord(el, this.lastQueryLength, finalText);
            this.hide();
        }
        show() { 
            this.visible = true; 
            this.container.style.display = 'grid'; 
            this.updatePos(); 
        }
        hide() { 
            this.visible = false; 
            if (this.container) this.container.style.display = 'none'; 
        }
        
        showButton(show) {
            if (!this.container) this.createContainer();
            if (this.enterBtn) {
                this.enterBtn.style.display = show ? 'flex' : 'none';
                if (show) this.updatePos();
            }
        }

        updatePos() {
            if (!this.container) return;
            const vv = window.visualViewport;
            if (vv) {
                const top = vv.offsetTop + vv.height - this.container.offsetHeight;
                this.container.style.top = `${top}px`;
                
                if (this.enterBtn && this.enterBtn.style.display !== 'none') {
                    const btnTop = vv.offsetTop + vv.height - 120; 
                    this.enterBtn.style.top = `${btnTop}px`;
                    this.enterBtn.style.right = '10px';
                }
            } else {
                this.container.style.bottom = '0';
                if (this.enterBtn) {
                    this.enterBtn.style.bottom = '80px';
                    this.enterBtn.style.right = '10px';
                }
            }
        }
    }

    // --- Input Logic ---
    class InputHandler {
        constructor(dbMgr, snipMgr, ui, settingsUI) {
            this.db = dbMgr; this.snip = snipMgr; this.ui = ui; this.settings = settingsUI; this.timer = null;
            if (window.visualViewport) {
                const up = () => this.ui.updatePos();
                window.visualViewport.addEventListener('resize', up); 
                window.visualViewport.addEventListener('scroll', up);
            }
            
            document.addEventListener('input', e => this.onInput(e));
            document.addEventListener('click', e => {
                if (this.ui.visible && !this.ui.container.contains(e.target) && e.target !== this.ui.activeInput) {
                    this.ui.hide();
                }
            });

            document.addEventListener('focus', (e) => {
                if (EditorUtils.isEditable(e.target)) {
                    this.ui.activeInput = e.target;
                    this.ui.showButton(true);
                }
            }, true);

            document.addEventListener('blur', (e) => {
                setTimeout(() => {
                    const active = document.activeElement;
                    if (!EditorUtils.isEditable(active)) {
                        this.ui.showButton(false);
                    } else {
                        this.ui.activeInput = active;
                    }
                }, 200);
            }, true);
        }
        
        onInput(e) {
            const t = e.target;
            if (!EditorUtils.isEditable(t)) return;
            
            this.ui.showButton(true);
            this.ui.activeInput = t;

            if (this.timer) clearTimeout(this.timer);
            this.timer = setTimeout(async () => {
                const val = EditorUtils.getValue(t);
                const cur = EditorUtils.getCursorPos(t);
                const prev = val.substring(0, cur);
                const lastComma = prev.lastIndexOf(',');
                const word = prev.substring(lastComma + 1).trim();
                
                if (word.length >= TRIGGER_CHARS) {
                    const snipRes = this.snip.search(word);
                    const config = this.settings.getConfig();
                    const tagRes = await this.db.search(word, config.searchDesc);
                    const combined = [...snipRes, ...tagRes];
                    if (combined.length > 0) this.ui.render(combined, t, word.length, config.rowCount); 
                    else this.ui.hide();
                } else {
                    this.ui.hide();
                }
            }, 100);
        }
    }

    // --- Boot ---
    const snipMgr = new SnippetManager();
    const dbMgr = new IndexedDBManager();
    const settings = new SettingsUI(dbMgr, snipMgr);
    const ui = new SuggestionUI(snipMgr);
    new InputHandler(dbMgr, snipMgr, ui, settings);

    GM_registerMenuCommand('Tag Autocomplete Settings', () => settings.show());
    console.log('AI Tag Autocomplete v1.4 Ready');
})();