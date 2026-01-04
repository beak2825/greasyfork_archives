// ==UserScript==
// @name         ChatGPT Custom Instructions Manager
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Advanced save and manage custom instructions for ChatGPT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chatgpt.com
// @author       Dramorian
// @match        https://chatgpt.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559754/ChatGPT%20Custom%20Instructions%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/559754/ChatGPT%20Custom%20Instructions%20Manager.meta.js
// ==/UserScript==

(() => {
    'use strict';

    const CONFIG = Object.freeze({
        storagePrefix: 'ci_',
        charLimit: 1500,
        charWarning: 1200,
        categories: ['All', 'Coding', 'Writing', 'Analysis', 'Creative', 'Learning', 'Other'],
        selectors: {
            personalizationHash: 'settings/Personalization',
            pageSection: 'section.flex.flex-col.gap-2.pt-7',
            chatgptTextarea: 'textarea[name="traits_model_message"]',
            toggleBtn: '.ci-toggle-btn',
            panel: '.ci-manager',
            list: '.ci-list',
            contentInput: '.ci-content-input',
            charCounter: '.ci-char-counter',
            nameInput: '.ci-name-input',
            categorySelect: '.ci-category-select',
            saveBtn: '.ci-save-btn',
            loadCurrentBtn: '.ci-load-current-btn',
            closeBtn: '.ci-close',
            exportBtn: '.ci-export-btn',
            importBtn: '.ci-import-btn',
            fileInput: '.ci-file-input',
            searchInput: '.ci-search-input',
            searchClear: '.ci-search-clear',
            sortSelect: '.ci-sort-select',
            filterBtn: '.ci-filter-btn',
        },
    });

    const styles = `
    .ci-manager {
      background: #fff;
      border: 1px solid #d1d5db;
      border-radius: 12px;
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
      padding: 16px;
      max-width: 450px;
      font-family: system-ui, -apple-system, sans-serif;
      margin-top: 16px;
    }
    .ci-manager-dark {
      background: #2d2d2d;
      border-color: #4a4a4a;
      color: #e5e5e5;
    }
    .ci-toggle-btn {
      background: #10a37f;
      color: white;
      border: none;
      border-radius: 8px;
      padding: 10px 16px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 600;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      margin-top: 12px;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }
    .ci-toggle-btn:hover { background: #0d8f6f; }

    .ci-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }
    .ci-title { font-size: 16px; font-weight: 600; margin: 0; }
    .ci-close {
      background: none;
      border: none;
      font-size: 20px;
      cursor: pointer;
      color: #6b7280;
      padding: 0;
      width: 24px;
      height: 24px;
    }

    .ci-message {
      border-radius: 8px;
      padding: 10px 12px;
      margin: 0 0 12px;
      font-size: 13px;
      border: 1px solid transparent;
    }
    .ci-message-success { color: #065f46; background: #ecfdf5; border-color: #a7f3d0; }
    .ci-message-error { color: #7f1d1d; background: #fef2f2; border-color: #fecaca; }

    .ci-toolbar { display: flex; gap: 8px; margin-bottom: 12px; flex-wrap: wrap; }
    .ci-toolbar-btn {
      padding: 6px 12px;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      background: white;
      cursor: pointer;
      font-size: 12px;
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }
    .ci-manager-dark .ci-toolbar-btn {
      background: #3a3a3a;
      border-color: #4a4a4a;
      color: #e5e5e5;
    }
    .ci-toolbar-btn:hover { background: #f3f4f6; }
    .ci-manager-dark .ci-toolbar-btn:hover { background: #4a4a4a; }

    .ci-input {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font-size: 14px;
      margin-bottom: 12px;
      box-sizing: border-box;
    }
    .ci-manager-dark .ci-input {
      background: #3a3a3a;
      border-color: #4a4a4a;
      color: #e5e5e5;
    }
    .ci-textarea { min-height: 100px; resize: vertical; font-family: inherit; }

    .ci-search-box { position: relative; margin-bottom: 12px; }
    .ci-search-input {
      width: 100%;
      padding: 8px 32px 8px 12px;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font-size: 14px;
      box-sizing: border-box;
    }
    .ci-manager-dark .ci-search-input {
      background: #3a3a3a;
      border-color: #4a4a4a;
      color: #e5e5e5;
    }
    .ci-search-clear {
      position: absolute;
      right: 8px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      cursor: pointer;
      color: #9ca3af;
      font-size: 16px;
    }

    .ci-filters { display: flex; gap: 8px; margin-bottom: 12px; flex-wrap: wrap; }
    .ci-filter-btn {
      padding: 4px 10px;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      background: white;
      cursor: pointer;
      font-size: 12px;
    }
    .ci-filter-btn.active { background: #10a37f; color: white; border-color: #10a37f; }
    .ci-manager-dark .ci-filter-btn { background: #3a3a3a; border-color: #4a4a4a; color: #e5e5e5; }
    .ci-manager-dark .ci-filter-btn.active { background: #10a37f; border-color: #10a37f; }

    .ci-btn {
      width: 100%;
      padding: 8px 16px;
      border: none;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      margin-bottom: 8px;
    }
    .ci-btn-primary { background: #10a37f; color: white; }
    .ci-btn-primary:hover { background: #0d8f6f; }
    .ci-btn-secondary { background: #6b7280; color: white; }
    .ci-btn-secondary:hover { background: #4b5563; }

    .ci-sort-select {
      padding: 6px 12px;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font-size: 12px;
      background: white;
    }
    .ci-manager-dark .ci-sort-select {
      background: #3a3a3a;
      border-color: #4a4a4a;
      color: #e5e5e5;
    }

    .ci-divider { height: 1px; background: #e5e7eb; margin: 16px 0; }
    .ci-manager-dark .ci-divider { background: #4a4a4a; }

    .ci-list { margin-top: 16px; max-height: 350px; overflow-y: auto; }

    .ci-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      margin-bottom: 8px;
      background: #f9fafb;
      transition: all 0.2s;
    }
    .ci-item.pinned { border-color: #fbbf24; background: #fffbeb; }
    .ci-manager-dark .ci-item { background: #3a3a3a; border-color: #4a4a4a; }
    .ci-manager-dark .ci-item.pinned { border-color: #fbbf24; background: #3d3520; }

    .ci-item-left { flex: 1; min-width: 0; }
    .ci-item-header { display: flex; align-items: center; gap: 6px; margin-bottom: 4px; }
    .ci-item-name { font-weight: 500; font-size: 14px; cursor: pointer; }
    .ci-item-name:hover { color: #10a37f; }

    .ci-item-tag {
      font-size: 11px;
      padding: 2px 6px;
      border-radius: 4px;
      background: #e5e7eb;
      color: #374151;
      white-space: nowrap;
    }
    .ci-manager-dark .ci-item-tag { background: #4a4a4a; color: #d1d5db; }

    .ci-item-meta { font-size: 11px; color: #9ca3af; }

    .ci-item-actions { display: flex; gap: 4px; margin-left: 8px; }
    .ci-icon-btn {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 16px;
      padding: 4px;
      color: #6b7280;
      min-width: 24px;
    }
    .ci-icon-btn:hover { color: #374151; }
    .ci-manager-dark .ci-icon-btn:hover { color: #e5e5e5; }
    .ci-icon-btn.pinned { color: #fbbf24; }

    .ci-hidden { display: none; }

    .ci-char-counter {
      font-size: 11px;
      color: #6b7280;
      text-align: right;
      margin-top: -8px;
      margin-bottom: 12px;
    }
    .ci-char-counter.warning { color: #f59e0b; }
    .ci-char-counter.error { color: #ef4444; }

    .ci-file-input { display: none; }
  `;

    /** @returns {HTMLElement|null} */
    const qs = (sel, root = document) => root.querySelector(sel);
    /** @returns {HTMLElement[]} */
    const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));

    const debounce = (fn, waitMs) => {
        let t = 0;
        return (...args) => {
            window.clearTimeout(t);
            t = window.setTimeout(() => fn(...args), waitMs);
        };
    };

    const raf = (fn) => window.requestAnimationFrame(fn);

    const isPersonalizationPage = () => window.location.hash.includes(CONFIG.selectors.personalizationHash);

    const isDarkMode = () =>
    document.documentElement.classList.contains('dark') || document.body.classList.contains('dark');

    const injectStylesOnce = (() => {
        let done = false;
        return () => {
            if (done) return;
            const styleEl = document.createElement('style');
            styleEl.textContent = styles;
            document.head.appendChild(styleEl);
            done = true;
        };
    })();

    const formatDate = (ts) => {
        try {
            return new Intl.DateTimeFormat(undefined, {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
            }).format(new Date(ts));
        } catch {
            return new Date(ts).toLocaleString();
        }
    };

    // ---- Storage ----

    /**
   * @typedef {{
   *  content: string,
   *  category: string,
   *  isPinned: boolean,
   *  createdAt: number,
   *  lastUsed: number
   * }} Instruction
   */

    const Storage = {
        /** @returns {Record<string, Instruction>} */
        loadAll() {
            /** @type {Record<string, Instruction>} */
            const out = {};
            const keys = GM_listValues();
            for (const key of keys) {
                if (!key.startsWith(CONFIG.storagePrefix)) continue;
                const name = key.slice(CONFIG.storagePrefix.length);
                try {
                    const raw = GM_getValue(key);
                    const parsed = JSON.parse(raw);
                    if (parsed && typeof parsed.content === 'string') out[name] = parsed;
                } catch (e) {
                    // Ignore corrupt entries
                    // eslint-disable-next-line no-console
                    console.error('Failed to parse instruction:', key, e);
                }
            }
            return out;
        },

        /** @param {string} name @param {Instruction} instruction */
        set(name, instruction) {
            GM_setValue(CONFIG.storagePrefix + name, JSON.stringify(instruction));
        },

        /** @param {string} name */
        remove(name) {
            GM_deleteValue(CONFIG.storagePrefix + name);
        },
    };

    // ---- UI ----

    const UI = (() => {
        /**
     * Central state holder.
     * Keeping mutable state in one object avoids "shadow" variables and event-handler mismatches.
     */
        const state = {
            mounted: false,
            dark: false,
            visible: false,
            loaded: false,
            abort: /** @type {AbortController|null} */ (null),

            toggleBtn: /** @type {HTMLButtonElement|null} */ (null),
            panel: /** @type {HTMLDivElement|null} */ (null),

            instructions: /** @type {Record<string, Instruction>} */ ({}),

            searchQuery: '',
            selectedCategory: 'All',
            sortBy: 'lastUsed',

            editMode: /** @type {{ active: boolean, originalName: string|null }} */ ({ active: false, originalName: null }),

            messageTimeoutId: 0,
        };

        const dom = {
            /** @returns {HTMLTextAreaElement|null} */
            chatgptTextarea() {
                return /** @type {HTMLTextAreaElement|null} */ (qs(CONFIG.selectors.chatgptTextarea));
            },

            /** @returns {HTMLTextAreaElement|null} */
            contentInput() {
                return /** @type {HTMLTextAreaElement|null} */ (qs(CONFIG.selectors.contentInput, state.panel ?? undefined));
            },

            /** @returns {HTMLDivElement|null} */
            charCounter() {
                return /** @type {HTMLDivElement|null} */ (qs(CONFIG.selectors.charCounter, state.panel ?? undefined));
            },

            /** @returns {HTMLInputElement|null} */
            nameInput() {
                return /** @type {HTMLInputElement|null} */ (qs(CONFIG.selectors.nameInput, state.panel ?? undefined));
            },

            /** @returns {HTMLSelectElement|null} */
            categorySelect() {
                return /** @type {HTMLSelectElement|null} */ (qs(CONFIG.selectors.categorySelect, state.panel ?? undefined));
            },

            /** @returns {HTMLButtonElement|null} */
            saveBtn() {
                return /** @type {HTMLButtonElement|null} */ (qs(CONFIG.selectors.saveBtn, state.panel ?? undefined));
            },

            /** @returns {HTMLDivElement|null} */
            list() {
                return /** @type {HTMLDivElement|null} */ (qs(CONFIG.selectors.list, state.panel ?? undefined));
            },

            /** @returns {HTMLInputElement|null} */
            fileInput() {
                return /** @type {HTMLInputElement|null} */ (qs(CONFIG.selectors.fileInput, state.panel ?? undefined));
            },

            /** @returns {HTMLInputElement|null} */
            searchInput() {
                return /** @type {HTMLInputElement|null} */ (qs(CONFIG.selectors.searchInput, state.panel ?? undefined));
            },

            /** @returns {HTMLButtonElement|null} */
            searchClear() {
                return /** @type {HTMLButtonElement|null} */ (qs(CONFIG.selectors.searchClear, state.panel ?? undefined));
            },

            /** @returns {HTMLSelectElement|null} */
            sortSelect() {
                return /** @type {HTMLSelectElement|null} */ (qs(CONFIG.selectors.sortSelect, state.panel ?? undefined));
            },
        };

        const showMessage = (text, type = 'success') => {
            if (!state.panel) return;
            const existing = qs('.ci-message', state.panel);
            if (existing) existing.remove();
            window.clearTimeout(state.messageTimeoutId);

            const msg = document.createElement('div');
            msg.className = `ci-message ci-message-${type === 'error' ? 'error' : 'success'}`;
            msg.textContent = text;
            const header = qs('.ci-header', state.panel);
            header?.insertAdjacentElement('afterend', msg);

            state.messageTimeoutId = window.setTimeout(() => msg.remove(), 3000);
        };

        const updateCharCounter = () => {
            const input = dom.contentInput();
            const counter = dom.charCounter();
            if (!input || !counter) return;

            const len = (input.value || '').length;
            counter.textContent = `${len} / ${CONFIG.charLimit} characters`;
            counter.className = 'ci-char-counter';

            if (len >= CONFIG.charLimit) counter.classList.add('error');
            else if (len >= CONFIG.charWarning) counter.classList.add('warning');
        };

        const setContentInputValue = (value) => {
            const input = dom.contentInput();
            if (!input) return;
            input.value = value;
            // Programmatic set does not trigger input events.
            raf(updateCharCounter);
        };

        const loadIfNeeded = () => {
            if (state.loaded) return;
            state.instructions = Storage.loadAll();
            state.loaded = true;
        };

        const getSortedFilteredNames = () => {
            const q = state.searchQuery.trim().toLowerCase();
            const names = Object.keys(state.instructions).filter((name) => {
                const instr = state.instructions[name];
                const matchesSearch =
                      !q ||
                      name.toLowerCase().includes(q) ||
                      (instr.content || '').toLowerCase().includes(q);
                const matchesCategory = state.selectedCategory === 'All' || instr.category === state.selectedCategory;
                return matchesSearch && matchesCategory;
            });

            names.sort((a, b) => {
                const A = state.instructions[a];
                const B = state.instructions[b];

                // Pinned first
                if (A.isPinned !== B.isPinned) return A.isPinned ? -1 : 1;

                switch (state.sortBy) {
                    case 'name':
                        return a.localeCompare(b);
                    case 'dateCreated':
                        return (B.createdAt || 0) - (A.createdAt || 0);
                    case 'lastUsed':
                    default:
                        return (B.lastUsed || 0) - (A.lastUsed || 0);
                }
            });

            return names;
        };

        const renderList = () => {
            const list = dom.list();
            if (!list) return;

            const names = getSortedFilteredNames();
            if (names.length === 0) {
                list.innerHTML = '<p style="text-align:center;color:#9ca3af;font-size:14px;padding:20px;">No instructions found</p>';
                return;
            }

            const html = names
            .map((name) => {
                const instr = state.instructions[name];
                const pinned = instr.isPinned ? 'pinned' : '';
                const pinCls = instr.isPinned ? 'pinned' : '';
                const created = formatDate(instr.createdAt);
                const used = formatDate(instr.lastUsed);

                // Use data-name for event delegation.
                return `
            <div class="ci-item ${pinned}" data-name="${escapeHtml(name)}">
              <div class="ci-item-left">
                <div class="ci-item-header">
                  <span class="ci-item-name" title="Click to apply" data-action="apply">${escapeHtml(name)}</span>
                  <span class="ci-item-tag">${escapeHtml(instr.category || 'Other')}</span>
                </div>
                <div class="ci-item-meta">Created: ${created} • Last used: ${used}</div>
              </div>
              <div class="ci-item-actions">
                <button class="ci-icon-btn ci-pin-btn ${pinCls}" data-action="pin" title="${instr.isPinned ? 'Unpin' : 'Pin'}">📌</button>
                <button class="ci-icon-btn ci-edit-btn" data-action="edit" title="Edit">✏️</button>
                <button class="ci-icon-btn ci-copy-btn" data-action="copy" title="Copy content">📋</button>
                <button class="ci-icon-btn ci-share-btn" data-action="share" title="Share">🔗</button>
                <button class="ci-icon-btn ci-apply-btn" data-action="apply" title="Apply">✓</button>
                <button class="ci-icon-btn ci-delete-btn" data-action="delete" title="Delete">🗑</button>
              </div>
            </div>
          `;
        })
      .join('');

        list.innerHTML = html;
    };

      const resetEditor = () => {
          state.editMode = { active: false, originalName: null };
          const nameInput = dom.nameInput();
          const catSelect = dom.categorySelect();
          const saveBtn = dom.saveBtn();

          if (nameInput) nameInput.value = '';
          if (catSelect) catSelect.value = CONFIG.categories[1] || 'Other';
          setContentInputValue('');

          if (saveBtn) saveBtn.textContent = '💾 Save New Instruction';
      };

      const upsertInstructionFromEditor = () => {
          const nameInput = dom.nameInput();
          const catSelect = dom.categorySelect();
          const contentInput = dom.contentInput();
          if (!nameInput || !catSelect || !contentInput) return;

          const name = nameInput.value.trim();
          const category = catSelect.value;
          const content = contentInput.value.trim();

          if (!name || !content) {
              showMessage('Please provide both name and content', 'error');
              return;
          }

          // Rename handling
          const original = state.editMode.active ? state.editMode.originalName : null;
          const preservePinned = original && state.instructions[original] ? !!state.instructions[original].isPinned : false;
          const preserveCreatedAt = original && state.instructions[original] ? state.instructions[original].createdAt : Date.now();

          if (original && original !== name) {
              Storage.remove(original);
              delete state.instructions[original];
          }

          /** @type {Instruction} */
          const next = {
              content,
              category,
              isPinned: preservePinned,
              createdAt: preserveCreatedAt,
              lastUsed: Date.now(),
          };

          Storage.set(name, next);
          state.instructions[name] = next;

          showMessage(state.editMode.active ? 'Instruction updated' : 'Instruction saved', 'success');
          resetEditor();
          renderList();
      };

      const loadEditorFromInstruction = (name) => {
          const instr = state.instructions[name];
          if (!instr) return;

          state.editMode = { active: true, originalName: name };

          const nameInput = dom.nameInput();
          const catSelect = dom.categorySelect();
          const saveBtn = dom.saveBtn();

          if (nameInput) nameInput.value = name;
          if (catSelect) catSelect.value = instr.category || 'Other';
          setContentInputValue(instr.content || '');

          if (saveBtn) saveBtn.textContent = '💾 Update Instruction';

          nameInput?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      };

      const applyInstructionToChatGPT = (name) => {
          const instr = state.instructions[name];
          const textarea = dom.chatgptTextarea();
          if (!instr || !textarea) {
              showMessage('Could not find ChatGPT instructions textarea', 'error');
              return;
          }

          try {
              const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value')?.set;
              if (setter) setter.call(textarea, instr.content);
              else textarea.value = instr.content;

              textarea.dispatchEvent(new Event('input', { bubbles: true }));
              textarea.dispatchEvent(new Event('change', { bubbles: true }));

              // Update last-used
              const updated = { ...instr, lastUsed: Date.now() };
              Storage.set(name, updated);
              state.instructions[name] = updated;

              showMessage(`Applied: ${name}`, 'success');
              renderList();
          } catch (e) {
              // eslint-disable-next-line no-console
              console.error('Failed to apply instruction:', e);
              showMessage('Error applying instruction', 'error');
          }
      };

      const copyToClipboard = (text) => {
          try {
              GM_setClipboard(text);
              showMessage('Copied to clipboard', 'success');
          } catch (e) {
              // eslint-disable-next-line no-console
              console.error('Failed to copy:', e);
              showMessage('Error copying to clipboard', 'error');
          }
      };

      const exportInstructions = () => {
          try {
              const data = JSON.stringify(state.instructions, null, 2);
              const blob = new Blob([data], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `chatgpt-instructions-${Date.now()}.json`;
              a.click();
              URL.revokeObjectURL(url);
              showMessage('Instructions exported successfully', 'success');
          } catch (e) {
              // eslint-disable-next-line no-console
              console.error('Export failed:', e);
              showMessage('Error exporting instructions', 'error');
          }
      };

      const importInstructions = (file) => {
          const reader = new FileReader();
          reader.onload = (e) => {
              try {
                  const imported = JSON.parse(String(e.target?.result ?? ''));
                  let count = 0;
                  for (const name of Object.keys(imported || {})) {
                      const instr = imported[name];
                      if (!instr || typeof instr.content !== 'string') continue;

                      /** @type {Instruction} */
                      const next = {
                          content: instr.content,
                          category: instr.category || 'Other',
                          isPinned: !!instr.isPinned,
                          createdAt: typeof instr.createdAt === 'number' ? instr.createdAt : Date.now(),
                          lastUsed: typeof instr.lastUsed === 'number' ? instr.lastUsed : Date.now(),
                      };

                      Storage.set(name, next);
                      state.instructions[name] = next;
                      count++;
                  }
                  showMessage(`Imported ${count} instructions successfully`, 'success');
                  renderList();
              } catch (err) {
                  // eslint-disable-next-line no-console
                  console.error('Import parse failed:', err);
                  showMessage('Invalid import file format', 'error');
              }
          };
          reader.readAsText(file);
      };

      const shareInstruction = (name) => {
          try {
              const instr = state.instructions[name];
              if (!instr) return;
              const data = btoa(unescape(encodeURIComponent(JSON.stringify({ name, ...instr }))));
              const url = `${window.location.origin}${window.location.pathname}#ci-share=${data}`;
              GM_setClipboard(url);
              showMessage('Share link copied to clipboard', 'success');
          } catch (e) {
              // eslint-disable-next-line no-console
              console.error('Share failed:', e);
              showMessage('Error creating share link', 'error');
          }
      };

      const checkSharedInstructionInHash = () => {
          const hash = window.location.hash;
          if (!hash.includes('ci-share=')) return;

          try {
              const data = hash.split('ci-share=')[1].split('&')[0];
              const decoded = JSON.parse(decodeURIComponent(escape(atob(data))));
              const name = decoded.name;
              delete decoded.name;

              if (name && typeof decoded.content === 'string' && window.confirm(`Import shared instruction "${name}"?`)) {
                  /** @type {Instruction} */
                  const next = {
                      content: decoded.content,
                      category: decoded.category || 'Other',
                      isPinned: false,
                      createdAt: Date.now(),
                      lastUsed: Date.now(),
                  };
                  Storage.set(name, next);
                  state.instructions[name] = next;
                  showMessage('Instruction imported successfully', 'success');

                  window.location.hash = hash.replace(/ci-share=[^&]*&?/, '');
                  renderList();
              }
          } catch (e) {
              // eslint-disable-next-line no-console
              console.error('Failed to import shared instruction:', e);
          }
      };

      const handleListClick = (evt) => {
          const target = /** @type {HTMLElement|null} */ (evt.target);
          const actionEl = target?.closest('[data-action]');
          const itemEl = target?.closest('.ci-item');
          const action = actionEl?.getAttribute('data-action');
          const name = itemEl?.getAttribute('data-name');

          if (!action || !name) return;

          const instr = state.instructions[name];
          if (!instr) return;

          switch (action) {
              case 'apply':
                  applyInstructionToChatGPT(name);
                  break;
              case 'edit':
                  loadEditorFromInstruction(name);
                  break;
              case 'copy':
                  copyToClipboard(instr.content || '');
                  break;
              case 'share':
                  shareInstruction(name);
                  break;
              case 'pin': {
                  const updated = { ...instr, isPinned: !instr.isPinned };
                  Storage.set(name, updated);
                  state.instructions[name] = updated;
                  renderList();
                  break;
              }
              case 'delete':
                  if (window.confirm(`Delete "${name}"?`)) {
                      Storage.remove(name);
                      delete state.instructions[name];
                      renderList();
                      // If currently editing this instruction, reset.
                      if (state.editMode.originalName === name) resetEditor();
                  }
                  break;
              default:
                  break;
          }
      };

      const togglePanel = () => {
          if (!state.panel || !state.toggleBtn) return;

          state.visible = !state.visible;
          state.panel.style.display = state.visible ? 'block' : 'none';

          if (state.visible) {
              state.dark = isDarkMode();
              state.panel.className = `ci-manager ${state.dark ? 'ci-manager-dark' : ''}`;

              loadIfNeeded();
              renderList();

              // Ensure char counter is correct on open
              raf(updateCharCounter);
              window.setTimeout(updateCharCounter, 0);

              checkSharedInstructionInHash();
          }
      };

      const mount = () => {
          if (!isPersonalizationPage()) return;
          if (qs(CONFIG.selectors.toggleBtn) || qs(CONFIG.selectors.panel)) return;

          injectStylesOnce();

          const section = qs(CONFIG.selectors.pageSection);
          if (!section) return;

          state.dark = isDarkMode();

          const toggleBtn = document.createElement('button');
          toggleBtn.className = 'ci-toggle-btn';
          toggleBtn.innerHTML = '📝 Manage Instructions';

          const panel = document.createElement('div');
          panel.className = `ci-manager ${state.dark ? 'ci-manager-dark' : ''}`;
          panel.style.display = 'none';

          panel.innerHTML = `
        <div class="ci-header">
          <h3 class="ci-title">Saved Instructions</h3>
          <button class="ci-close" type="button">×</button>
        </div>

        <div class="ci-toolbar">
          <button class="ci-toolbar-btn ci-export-btn" type="button" title="Export all">💾 Export</button>
          <button class="ci-toolbar-btn ci-import-btn" type="button" title="Import">📥 Import</button>
          <select class="ci-sort-select" title="Sort">
            <option value="lastUsed">Sort: Last Used</option>
            <option value="name">Sort: Name</option>
            <option value="dateCreated">Sort: Date Created</option>
          </select>
        </div>

        <div class="ci-search-box">
          <input type="text" class="ci-search-input" placeholder="Search instructions..." />
          <button class="ci-search-clear ci-hidden" type="button" title="Clear">×</button>
        </div>

        <div class="ci-filters">
          ${CONFIG.categories
          .map((cat) => `<button class="ci-filter-btn ${cat === 'All' ? 'active' : ''}" data-category="${escapeHtml(cat)}" type="button">${escapeHtml(cat)}</button>`)
          .join('')}
        </div>

        <input type="text" class="ci-input ci-name-input" placeholder="Instruction name" />

        <select class="ci-input ci-category-select">
          ${CONFIG.categories
          .slice(1)
          .map((cat) => `<option value="${escapeHtml(cat)}">${escapeHtml(cat)}</option>`)
          .join('')}
        </select>

        <textarea class="ci-input ci-textarea ci-content-input" placeholder="Enter custom instructions here..."></textarea>
        <div class="ci-char-counter">0 / ${CONFIG.charLimit} characters</div>

        <button class="ci-btn ci-btn-primary ci-save-btn" type="button">💾 Save New Instruction</button>
        <button class="ci-btn ci-btn-secondary ci-load-current-btn" type="button">📥 Load Current to Editor</button>

        <input type="file" class="ci-file-input" accept=".json" />

        <div class="ci-divider"></div>
        <div class="ci-list"></div>
      `;

        section.appendChild(toggleBtn);
        section.appendChild(panel);

        state.toggleBtn = toggleBtn;
        state.panel = panel;
        state.mounted = true;

        // Bind listeners
        state.abort = new AbortController();
        const { signal } = state.abort;

        toggleBtn.addEventListener('click', togglePanel, { signal });
        qs(CONFIG.selectors.closeBtn, panel)?.addEventListener('click', togglePanel, { signal });

        // Editor
        dom.saveBtn()?.addEventListener('click', upsertInstructionFromEditor, { signal });

        const contentInput = dom.contentInput();
        contentInput?.addEventListener('input', updateCharCounter, { signal });
        contentInput?.addEventListener('change', updateCharCounter, { signal });
        contentInput?.addEventListener('keyup', updateCharCounter, { signal });
        contentInput?.addEventListener('paste', () => raf(updateCharCounter), { signal });

        // Load current
        qs(CONFIG.selectors.loadCurrentBtn, panel)?.addEventListener(
            'click',
            () => {
                const t = dom.chatgptTextarea();
                const current = t?.value ?? '';
                if (!current) {
                    showMessage('No instructions found in textarea', 'error');
                    return;
                }
                setContentInputValue(current);
            },
            { signal }
        );

        // Export/Import
        qs(CONFIG.selectors.exportBtn, panel)?.addEventListener('click', exportInstructions, { signal });
        qs(CONFIG.selectors.importBtn, panel)?.addEventListener(
            'click',
            () => {
                dom.fileInput()?.click();
            },
            { signal }
        );

        dom.fileInput()?.addEventListener(
            'change',
            (e) => {
                const file = /** @type {HTMLInputElement} */ (e.currentTarget).files?.[0];
                if (file) importInstructions(file);
                // Reset so importing the same file again triggers change.
                /** @type {HTMLInputElement} */ (e.currentTarget).value = '';
            },
            { signal }
        );

        // Search
        const searchInput = dom.searchInput();
        const searchClear = dom.searchClear();

        searchInput?.addEventListener(
            'input',
            debounce((e) => {
                state.searchQuery = /** @type {HTMLInputElement} */ (e.target).value;
                searchClear?.classList.toggle('ci-hidden', !state.searchQuery);
                renderList();
            }, 250),
            { signal }
        );

        searchClear?.addEventListener(
            'click',
            () => {
                if (searchInput) searchInput.value = '';
                state.searchQuery = '';
                searchClear.classList.add('ci-hidden');
                renderList();
            },
            { signal }
        );

        // Sort
        dom.sortSelect()?.addEventListener(
            'change',
            (e) => {
                state.sortBy = /** @type {HTMLSelectElement} */ (e.target).value;
                renderList();
            },
            { signal }
        );

        // Filters (delegation)
        panel.querySelector('.ci-filters')?.addEventListener(
            'click',
            (e) => {
                const btn = /** @type {HTMLElement|null} */ (e.target)?.closest(CONFIG.selectors.filterBtn);
                if (!btn) return;

                const cat = btn.getAttribute('data-category') || 'All';
                state.selectedCategory = cat;

                qsa(CONFIG.selectors.filterBtn, panel).forEach((b) => b.classList.remove('active'));
                btn.classList.add('active');
                renderList();
            },
            { signal }
        );

        // List actions (delegation)
        dom.list()?.addEventListener('click', handleListClick, { signal });

        // Initial counter (covers browser restoring form value)
        raf(updateCharCounter);

        // Load shared instruction if present
        checkSharedInstructionInHash();
    };

      const unmount = () => {
          state.abort?.abort();
          state.abort = null;

          state.toggleBtn?.remove();
          state.panel?.remove();

          state.toggleBtn = null;
          state.panel = null;
          state.mounted = false;
          state.visible = false;
          state.loaded = false;
          state.instructions = {};
          state.searchQuery = '';
          state.selectedCategory = 'All';
          state.sortBy = 'lastUsed';
          state.editMode = { active: false, originalName: null };

          window.clearTimeout(state.messageTimeoutId);
          state.messageTimeoutId = 0;
      };

      return {
          mount,
          unmount,
          isMounted: () => state.mounted,
      };
  })();

    // ---- Utilities ----

    // Minimal escaping to keep list rendering safe.
    function escapeHtml(str) {
        return String(str)
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;')
            .replaceAll("'", '&#039;');
    }

    // ---- SPA navigation handling ----

    const init = () => {
        if (isPersonalizationPage()) {
            window.setTimeout(UI.mount, 500);
        }

        let lastUrl = window.location.href;
        const observer = new MutationObserver(
            debounce(() => {
                const url = window.location.href;

                const onTargetPage = isPersonalizationPage();
                if (url !== lastUrl) {
                    lastUrl = url;
                    UI.unmount();
                    if (onTargetPage) window.setTimeout(UI.mount, 500);
                    return;
                }

                // If still on page but UI got removed by re-render, mount again.
                if (onTargetPage && !UI.isMounted()) UI.mount();
                if (!onTargetPage && UI.isMounted()) UI.unmount();
            }, 250)
        );

        observer.observe(document.body, { childList: true, subtree: true });
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
