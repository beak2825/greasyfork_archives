// ==UserScript==
// @name         Grok Feature Flag Assist
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  allows you to test experimental fetaures on grok.com
// @author       Blankspeaker
// @match        https://grok.com/*
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/554136/Grok%20Feature%20Flag%20Assist.user.js
// @updateURL https://update.greasyfork.org/scripts/554136/Grok%20Feature%20Flag%20Assist.meta.js
// ==/UserScript==


(function () {
    'use strict';

    const FLAGS_KEY = 'local_feature_flags';
    const ZUSTAND_STORE_KEY = 'xai-ff-bu';
    const NEW_FLAG_EXPIRATION = 24 * 60 * 60 * 1000;
    const KNOWN_FLAGS_KEY = 'known_feature_flags';

    // Intercept fetch to modify config responses
    const originalFetch = unsafeWindow.fetch;
    unsafeWindow.fetch = function(...args) {
        return originalFetch.apply(this, args).then(response => {
            // Check if this is a config request
            if (args[0] && args[0].includes('/_data') || args[0].includes('getConfig')) {
                return response.clone().json().then(data => {
                    // Apply our overrides
                    const userFlags = JSON.parse(localStorage.getItem(FLAGS_KEY) || '{}');
                    if (data.config && typeof data.config === 'object' && Object.keys(userFlags).length > 0) {
                        Object.entries(userFlags).forEach(([key, value]) => {
                            const lowerKey = key.toLowerCase();
                            if (data.config.hasOwnProperty(lowerKey)) {
                                data.config[lowerKey] = value;
                                console.log('[Grok Flags] Overriding', lowerKey, 'to', value);
                            }
                        });
                    }
                    // Return modified response
                    return new Response(JSON.stringify(data), {
                        status: response.status,
                        statusText: response.statusText,
                        headers: response.headers
                    });
                }).catch(() => response);
            }
            return response;
        });
    };

    // Also apply to localStorage reads
    const originalGetItem = Storage.prototype.getItem;
    Storage.prototype.getItem = function(key) {
        const value = originalGetItem.call(this, key);
        if (key === ZUSTAND_STORE_KEY && value) {
            try {
                const data = JSON.parse(value);
                const userFlags = JSON.parse(localStorage.getItem(FLAGS_KEY) || '{}');
                if (data.config && typeof data.config === 'object' && Object.keys(userFlags).length > 0) {
                    Object.entries(userFlags).forEach(([flagKey, flagValue]) => {
                        const lowerKey = flagKey.toLowerCase();
                        if (data.config.hasOwnProperty(lowerKey)) {
                            data.config[lowerKey] = flagValue;
                        }
                    });
                    return JSON.stringify(data);
                }
            } catch (e) {
                // Return original if parsing fails
            }
        }
        return value;
    };

    function injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            :root {
                --gff-surface-base: #171717;
                --gff-surface-l1: #202020;
                --gff-surface-l2: #2a2a2a;
                --gff-border-l1: #363636;
                --gff-text-primary: #f9fafb;
                --gff-text-secondary: #9ca3af;
                --gff-placeholder-text: rgba(249, 250, 251, 0.5);
                --gff-primary: #4f46e5;
                --gff-primary-hover: #4338ca;
                --gff-danger: #ef4444;
                --gff-warning: #facc15;
                --gff-icon-neutral: #b5b5b5;
                --gff-button-ghost-hover: rgba(255, 255, 255, 0.05);
                --gff-badge-bg: #28282a;
                --gff-switch-checked-bg: #f9f8f6;
                --gff-switch-unchecked-bg: #515153;
                --gff-switch-checked-thumb-bg: #171717;
                --gff-switch-unchecked-thumb-bg: #2b2b2c;
                --gff-save-bg: #e2e2e0;
                --gff-save-text: #111827;
                --gff-save-hover-bg: #d4d4d8;
            }
            .gff-overlay {
                position: fixed; inset: 0;
                background-color: rgba(0, 0, 0, 0.5);
                backdrop-filter: blur(2px);
                z-index: 9998; opacity: 0;
                transition: opacity 0.2s ease;
                pointer-events: none;
            }
            .gff-overlay.visible { opacity: 1; pointer-events: auto; }
            .gff-modal {
                position: fixed; left: 50%; top: 50%;
                width: 90vw; max-width: 640px;
                height: 80vh; max-height: 700px;
                background-color: var(--gff-surface-base);
                border: 1px solid var(--gff-border-l1);
                border-radius: 1.5rem;
                z-index: 9999;
                display: flex; flex-direction: column;
                gap: 1rem; padding: 1.5rem;
                opacity: 0;
                transform: translate(-50%, -48%) scale(0.95);
                transition: opacity 0.2s ease, transform 0.2s ease;
                pointer-events: none;
            }
            .gff-modal.visible { opacity: 1; transform: translate(-50%, -50%) scale(1); pointer-events: auto; }
            .gff-modal * { box-sizing: border-box; }
            .gff-modal-header { display: flex; justify-content: space-between; align-items: center; }
            .gff-modal-header h2 { font-size: 1.125rem; font-weight: 600; color: var(--gff-text-primary); margin: 0; }
            .gff-controls-wrapper { display: flex; gap: 0.5rem; align-items: center; }
            .gff-flags-container {
                flex: 1; overflow-y: auto; padding-right: 0.5rem;
                display: flex; flex-direction: column; gap: 0.25rem;
            }
            .gff-modal-content {
                flex: 1; min-height: 0;
                overflow-y: hidden;
                display: flex; flex-direction: column; gap: 1rem;
            }
            .gff-modal-footer {
                display: flex; justify-content: flex-end; gap: 0.5rem;
                padding-top: 1rem; border-top: 1px solid var(--gff-border-l1);
            }
            .gff-search-input {
                flex: 1;
                display: flex; align-items: center; gap: 0.75rem;
                padding: 0 0.75rem;
                height: 40px;
                border-radius: 0.75rem;
                border: 1px solid var(--gff-border-l1);
                background-color: var(--gff-surface-l1);
            }
            .gff-search-input input {
                width: 100%; background: transparent; border: none; outline: none;
                color: var(--gff-text-primary); font-size: 0.875rem;
            }
            .gff-flag-row {
                display: flex; justify-content: space-between; align-items: center;
                gap: 1rem; padding: 0.5rem; border-radius: 0.5rem;
                transition: background-color 0.1s ease;
            }
            .gff-flag-row:hover { background-color: var(--gff-surface-l1); }
            .gff-flag-row label {
                display: flex; align-items: center; gap: 0.5rem;
                font-family: monospace; font-size: 0.875rem;
                color: var(--gff-text-secondary); cursor: default;
                flex: 1; min-width: 0;
            }
            .gff-new-badge {
                display: inline-flex; align-items: center; gap: 4px;
                padding: 2px 6px; border-radius: 6px;
                font-family: monospace; font-size: 0.8em;
                text-transform: uppercase; margin-left: 0.5rem;
                color: var(--gff-text-secondary);
                background-color: var(--gff-badge-bg);
            }
            .gff-flag-row-label.modified { font-weight: 600; color: var(--gff-text-primary); }
            .gff-flag-row-label.new { color: var(--gff-text-primary); }
            .gff-switch {
                display: inline-flex; height: 1.5rem; width: 2.75rem;
                flex-shrink: 0; cursor: pointer; align-items: center;
                border-radius: 9999px;
                transition: background-color 0.2s ease-in-out;
            }
            .gff-switch[data-state="unchecked"] { background-color: var(--gff-switch-unchecked-bg); }
            .gff-switch[data-state="checked"] { background-color: var(--gff-switch-checked-bg); }
            .gff-switch-thumb {
                display: block; height: 1rem; width: 1rem; border-radius: 9999px;
                background-color: var(--gff-switch-unchecked-thumb-bg);
                transition: transform 0.2s ease-in-out, background-color 0.2s ease-in-out;
                transform: translateX(2px);
            }
            .gff-switch[data-state="checked"] .gff-switch-thumb {
                background-color: var(--gff-switch-checked-thumb-bg);
                transform: translateX(22px);
            }
            .gff-button {
                display: inline-flex; align-items: center; justify-content: center;
                gap: 0.5rem; height: 40px; padding: 0 1rem;
                border-radius: 0.5rem; font-weight: 500; font-size: 0.875rem;
                cursor: pointer; transition: all 0.1s ease;
                border: 1px solid transparent;
            }
            .gff-button.icon-only { width: 40px; padding: 0; }
            .gff-button.variant-solid { background-color: var(--gff-primary); color: white; }
            .gff-button.variant-solid:hover { background-color: var(--gff-primary-hover); }
            .gff-button.variant-outline { border-color: var(--gff-border-l1); color: var(--gff-text-primary); }
            .gff-button.variant-ghost { color: var(--gff-text-secondary); }
            .gff-button.variant-ghost:hover { background-color: var(--gff-button-ghost-hover); }
            .gff-button.color-warning {
                background-color: rgba(250, 204, 21, 0.15);
                color: var(--gff-warning);
            }
            .gff-button.save-button { background-color: var(--gff-save-bg); color: var(--gff-save-text); }
            .gff-notification {
                display: flex; padding: 1rem; border-radius: 0.5rem;
                border: 1px solid rgba(34, 211, 238, 0.3);
                background-image: linear-gradient(to right, rgba(34, 211, 238, 0.1), rgba(34, 211, 238, 0.05));
            }
            .gff-notification-content h3 { font-weight: 500; color: var(--gff-text-primary); margin:0; font-size: 0.9rem; }
            .gff-notification-content p { font-size: 0.8rem; color: var(--gff-text-secondary); margin-top: 0.25rem; margin-bottom: 0; }
            .gff-instructions {
                flex: 1;
                display: flex;
                flex-direction: column;
                gap: 1rem;
                color: var(--gff-text-secondary);
            }
            .gff-instructions h3 {
                color: var(--gff-text-primary);
                margin: 0 0 1rem 0;
                font-size: 1.125rem;
                font-weight: 600;
            }
            .gff-instructions ol {
                margin: 0;
                padding-left: 1.5rem;
                line-height: 1.5;
            }
            .gff-instructions li {
                margin-bottom: 0.5rem;
            }
            .gff-instructions code {
                font-family: monospace;
                background: var(--gff-surface-l1);
                padding: 0.125rem 0.25rem;
                border-radius: 0.25rem;
                color: var(--gff-primary);
                border: 1px solid var(--gff-border-l1);
            }
            .gff-instructions p {
                font-style: italic;
                margin-top: 1rem;
                color: var(--gff-text-secondary);
            }
        `;
        document.head.append(style);
    }

    function createModal() {
        const overlay = document.createElement('div');
        overlay.className = 'gff-overlay';
        const modal = document.createElement('div');
        modal.className = 'gff-modal';
        const header = document.createElement('div');
        header.className = 'gff-modal-header';
        const title = document.createElement('h2');
        const closeBtn = createButton({
            icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>',
            variant: 'ghost', isIconOnly: true,
            onClick: () => toggle(false)
        });
        header.append(title, closeBtn);
        const content = document.createElement('div');
        content.className = 'gff-modal-content';
        const footer = document.createElement('div');
        footer.className = 'gff-modal-footer';
        modal.append(header, content, footer);
        document.body.append(overlay, modal);
        const toggle = (visible) => {
            overlay.classList.toggle('visible', visible);
            modal.classList.toggle('visible', visible);
        };
        overlay.onclick = () => toggle(false);
        return { modal, content, footer, title, toggle };
    }

    function createSwitch(key, checked, onToggle) {
        const button = document.createElement('button');
        button.className = 'gff-switch';
        const thumb = document.createElement('span');
        thumb.className = 'gff-switch-thumb';
        button.append(thumb);
        const setState = (isChecked) => {
            button.dataset.state = isChecked ? 'checked' : 'unchecked';
        };
        setState(checked);
        button.onclick = () => {
            const newState = button.dataset.state === 'unchecked';
            setState(newState);
            onToggle(key, newState);
        };
        return button;
    }

    function createButton({ text, icon, variant = 'ghost', color, isIconOnly = false, className = '', onClick }) {
        const btn = document.createElement('button');
        btn.className = `gff-button variant-${variant}`;
        if (color) btn.classList.add(`color-${color}`);
        if (isIconOnly) btn.classList.add('icon-only');
        if (className) btn.classList.add(...className.split(' '));
        if (icon) {
            btn.innerHTML = icon;
            if (text) {
                const textSpan = document.createElement('span');
                textSpan.textContent = text;
                btn.append(textSpan);
            }
        } else if (text) {
            btn.textContent = text;
        }
        btn.onclick = onClick;
        return btn;
    }

    const FlagManager = (function() {
        let _flags = {};
        let _defaults = {};
        let _knownFlags = {};
        let _overrides = {};

        const _get = (key) => JSON.parse(localStorage.getItem(key) || '{}');
        const _set = (key, data) => localStorage.setItem(key, JSON.stringify(data));

        return {
            init: () => {
                _knownFlags = _get(KNOWN_FLAGS_KEY);
                _overrides = _get(FLAGS_KEY);

                try {
                    const zustandData = originalGetItem.call(localStorage, ZUSTAND_STORE_KEY);
                    if (zustandData) {
                        const parsed = JSON.parse(zustandData);
                        if (parsed.config && typeof parsed.config === 'object') {
                            _defaults = {};
                            _flags = {};

                            Object.entries(parsed.config).forEach(([key, value]) => {
                                if (typeof value === 'boolean') {
                                    const upperKey = key.toUpperCase();
                                    _defaults[upperKey] = value;
                                    _flags[upperKey] = _overrides[upperKey] !== undefined
                                        ? _overrides[upperKey]
                                        : value;

                                    if (_knownFlags[upperKey] === undefined) {
                                        _knownFlags[upperKey] = Date.now();
                                    }
                                }
                            });
                        }
                    }
                } catch (e) {
                    console.error('Failed to parse Zustand store:', e);
                }

                _set(KNOWN_FLAGS_KEY, _knownFlags);
            },
            getFlags: () => _flags,
            getDefaults: () => _defaults,
            getOverrides: () => _overrides,
            saveFlags: (flags, elements) => {
                const newOverrides = {};
                Object.entries(flags).forEach(([key, value]) => {
                    if (value !== _defaults[key]) {
                        newOverrides[key] = value;
                    }
                });

                _overrides = newOverrides;
                _set(FLAGS_KEY, _overrides);

                // Generate clipboard content for manual overrides
                let clipboardContent = '';
                Object.entries(newOverrides).forEach(([key, value]) => {
                    clipboardContent += `t.${key.toLowerCase()} = ${value};\n`;
                });

                // Copy to clipboard immediately
                if (navigator.clipboard && clipboardContent.trim()) {
                    navigator.clipboard.writeText(clipboardContent).then(() => {
                        console.log('[Grok Flags] Copied override commands to clipboard');
                    }).catch(err => {
                        console.error('[Grok Flags] Failed to copy to clipboard:', err);
                    });
                }

                console.log('[Grok Flags] Saved', Object.keys(newOverrides).length, 'overrides');

                if (Object.keys(newOverrides).length > 0 && elements) {
                    const instructionsHtml = `
                        <div class="gff-instructions">
                            <h3>Instructions to Apply Flags</h3>
                            <ol>
                                <li>Open dev tools (F12) and go to the Sources tab</li>
                                <li>Search (Ctrl+P or Cmd+P) for <code>"e(\\"disable_edu_discount\\")"</code></li>
                                <li>Put a breakpoint on the line above disable_edu_discount (it should say return) (click line number)</li>
                                <li>Click the "Reload Page" button below and remove the breakpoint after it reloads</li>
                                <li>Go to the Console tab, paste the clipboard content and press Enter then hit resume execution (F8)</li>
                            </ol>
                            <p><em>Note: The flags have been copied to your clipboard.</em></p>
                        </div>
                    `;
                    elements.content.innerHTML = instructionsHtml;
                    elements.footer.innerHTML = '';
                    const reloadBtn = document.createElement('button');
                    reloadBtn.className = 'gff-button variant-solid';
                    reloadBtn.textContent = 'Reload Page';
                    reloadBtn.onclick = () => {
                        // Re-copy to clipboard before reload
                        if (navigator.clipboard && clipboardContent.trim()) {
                            navigator.clipboard.writeText(clipboardContent).then(() => {
                                console.log('[Grok Flags] Re-copied override commands to clipboard');
                            }).catch(err => {
                                console.error('[Grok Flags] Failed to re-copy to clipboard:', err);
                            });
                        }
                        window.location.reload();
                    };
                    elements.footer.appendChild(reloadBtn);
                    elements.title.textContent = 'Apply Feature Flags';
                    elements.toggle(true);
                } else {
                    window.location.reload();
                }
            },
            isNew: (key) => {
                const discoveredAt = _knownFlags[key];
                if (!discoveredAt || discoveredAt === 1) return false;
                return (Date.now() - discoveredAt) < NEW_FLAG_EXPIRATION;
            },
            isModified: (key) => _overrides.hasOwnProperty(key),
            reset: () => {
                localStorage.removeItem(FLAGS_KEY);
                window.location.reload();
            },
            export: () => {
                const json = JSON.stringify(_overrides, null, 2);
                const blob = new Blob([json], { type: 'application/json' });
                const a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.download = 'grok_flags.json';
                a.click();
            },
            import: () => new Promise((resolve) => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = '.json';
                input.onchange = (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return resolve(null);
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        try {
                            const imported = JSON.parse(event.target.result);
                            const merged = { ..._flags };
                            Object.entries(imported).forEach(([key, value]) => {
                                merged[key.toUpperCase()] = value;
                            });
                            resolve(merged);
                        } catch { resolve(null); }
                    };
                    reader.readAsText(file);
                };
                input.click();
            }),
        };
    })();

    function init() {
        FlagManager.init();
        let state = {
            flags: FlagManager.getFlags(),
            defaults: FlagManager.getDefaults(),
            overrides: FlagManager.getOverrides(),
            searchTerm: '',
        };

        injectStyles();

        const { content, footer, title, toggle } = createModal();
        const elements = { content, footer, title, toggle };

        const controlsWrapper = document.createElement('div');
        controlsWrapper.className = 'gff-controls-wrapper';

        const searchInput = document.createElement('div');
        searchInput.className = 'gff-search-input';
        searchInput.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>';
        const input = document.createElement('input');
        input.placeholder = 'Search flags...';
        input.oninput = (e) => {
            state.searchTerm = e.target.value;
            renderFlagList();
        };
        searchInput.append(input);
        controlsWrapper.append(searchInput);

        const notificationArea = document.createElement('div');
        const flagsContainer = document.createElement('div');
        flagsContainer.className = 'gff-flags-container';
        content.append(controlsWrapper, notificationArea, flagsContainer);

        function renderNotification() {
            notificationArea.innerHTML = '';
            const overrideCount = Object.keys(state.overrides).length;
            if (overrideCount > 0) {
                const notification = document.createElement('div');
                notification.className = 'gff-notification';
                notification.innerHTML = `<div class="gff-notification-content">
                    <h3>${overrideCount} Flag${overrideCount > 1 ? 's' : ''} Modified</h3>
                    <p>Changes will take effect after clicking Save and reloading.</p>
                </div>`;
                notificationArea.append(notification);
            }
        }

        function renderFlagList() {
            const filteredKeys = Object.keys(state.flags)
                .filter(key => key.toLowerCase().includes(state.searchTerm.toLowerCase()))
                .sort((a, b) => {
                    const aIsModified = FlagManager.isModified(a);
                    const bIsModified = FlagManager.isModified(b);
                    if (aIsModified && !bIsModified) return -1;
                    if (!aIsModified && bIsModified) return 1;

                    const aIsNew = FlagManager.isNew(a);
                    const bIsNew = FlagManager.isNew(b);
                    if (aIsNew && !bIsNew) return -1;
                    if (!aIsNew && bIsNew) return 1;

                    return a.localeCompare(b);
                });

            title.textContent = `Feature Flags (${filteredKeys.length})`;
            flagsContainer.innerHTML = '';

            filteredKeys.forEach(key => {
                const row = document.createElement('div');
                row.className = 'gff-flag-row';
                const label = document.createElement('label');

                const updateLabel = () => {
                    label.innerHTML = '';
                    const isNew = FlagManager.isNew(key);
                    const isModified = FlagManager.isModified(key);

                    const labelText = document.createElement('span');
                    labelText.className = 'gff-flag-row-label';
                    if (isModified) labelText.classList.add('modified');
                    else if (isNew) labelText.classList.add('new');
                    labelText.textContent = key;
                    label.append(labelText);

                    if (isNew) {
                        const badge = document.createElement('span');
                        badge.className = 'gff-new-badge';
                        badge.textContent = 'NEW';
                        label.append(badge);
                    }
                };

                updateLabel();

                const switchEl = createSwitch(key, state.flags[key], (k, v) => {
                    state.flags[k] = v;

                    if (v !== state.defaults[k]) {
                        state.overrides[k] = v;
                    } else {
                        delete state.overrides[k];
                    }

                    updateLabel();
                    renderNotification();
                });
                row.append(label, switchEl);
                flagsContainer.append(row);
            });
        }

        renderNotification();
        renderFlagList(); // Initial render

        footer.append(
            createButton({ text: 'Reset All', color: 'warning', onClick: FlagManager.reset }),
            createButton({ text: 'Import', variant: 'outline', onClick: async () => {
                const imported = await FlagManager.import();
                if (imported) {
                    state.flags = imported;
                    state.overrides = FlagManager.getOverrides();
                    renderFlagList();
                    renderNotification();
                }
            }}),
            createButton({ text: 'Export', variant: 'outline', onClick: FlagManager.export }),
            createButton({ text: 'Save', variant: 'solid', className: 'save-button', onClick: () => FlagManager.saveFlags(state.flags, elements) })
        );

        const observer = new MutationObserver(() => {
            const menu = document.querySelector('div[role="menu"][data-state="open"]');
            if (menu && !menu.querySelector('#gff-menu-item')) {
                const items = menu.querySelectorAll('div[role="menuitem"]');
                const settingsItem = Array.from(items).find(item => item.textContent?.includes('Settings'));
                if (settingsItem) {
                    const flagItem = document.createElement('div');
                    flagItem.id = 'gff-menu-item';
                    flagItem.role = 'menuitem';
                    flagItem.style.cssText = 'display:flex;align-items:center;padding:0.5rem 0.75rem;cursor:pointer;border-radius:0.75rem;background:#3e3f42;color:#f9fafb;font-size:0.875rem;margin-top:0.25rem';
                    flagItem.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:0.5rem"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg>Flags';
                    flagItem.onclick = () => {
                        document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
                        setTimeout(() => {
                            input.value = '';
                            state.searchTerm = '';
                            state.flags = FlagManager.getFlags();
                            state.overrides = FlagManager.getOverrides();
                            renderFlagList();
                            renderNotification();
                            toggle(true);
                        }, 100);
                    };
                    settingsItem.after(flagItem);
                }
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });

        // Initial render to show flags
        renderFlagList();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();