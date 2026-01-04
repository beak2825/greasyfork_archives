// ==UserScript==
// @name         Bonk Mod Settings Core
// @namespace    https://greasyfork.org/users/1552147-ansonii-crypto
// @version      3.0.0
// @description  Shared Generic/Modded Settings UI + mod list + categories for Bonk.io mods.
// @match        https://bonk.io/gameframe-release.html
// @run-at       document-start
// @grant        none
// @license      N/A
// @downloadURL https://update.greasyfork.org/scripts/560457/Bonk%20Mod%20Settings%20Core.user.js
// @updateURL https://update.greasyfork.org/scripts/560457/Bonk%20Mod%20Settings%20Core.meta.js
// ==/UserScript==

(() => {
    'use strict';

    function $(id) {
        return document.getElementById(id);
    }

    function waitForElement(id, cb) {
        const int = setInterval(() => {
            const el = $(id);
            if (el) {
                clearInterval(int);
                cb(el);
            }
        }, 200);
    }

    const global = window;
    global.bonkMods = global.bonkMods || {};
    const bonkMods = global.bonkMods;

    // Registries
    bonkMods._categories = bonkMods._categories || {};
    bonkMods._blocks = bonkMods._blocks || [];
    bonkMods._mods = bonkMods._mods || {};

    const DEFAULT_CATEGORY_ID = 'general';
    const FALLBACK_MOD_ID = 'other';

    let currentCategoryId = null;
    let currentModId = 'all';

    bonkMods.registerMod = function(meta) {
        if (!meta || !meta.id) return;
        const id = meta.id;
        const existing = bonkMods._mods[id] || {};
        bonkMods._mods[id] = Object.assign({
            id,
            name: id,
            version: '',
            author: '',
            description: '',
            homepage: '',
            devHint: ''
        }, existing, meta);

        renderModDropdown();
        renderModInfo();
        renderCategories();
        renderBlocks();
    };

    bonkMods.registerCategory = function(def) {
        if (!def || !def.id) return;
        if (!def.label) def.label = def.id;
        if (typeof def.order !== 'number') def.order = 100;

        if (!bonkMods._categories[def.id]) {
            bonkMods._categories[def.id] = {
                id: def.id,
                label: def.label,
                order: def.order
            };
        } else {
            Object.assign(bonkMods._categories[def.id], def);
        }

        renderCategories();
        renderBlocks();
    };

    bonkMods.addBlock = function(def) {
        if (!def || !def.id || typeof def.render !== 'function') return;
        if (!def.categoryId) def.categoryId = DEFAULT_CATEGORY_ID;
        if (!def.title) def.title = '';
        if (typeof def.order !== 'number') def.order = 100;
        if (!def.modId) def.modId = FALLBACK_MOD_ID;

        bonkMods._blocks.push(def);

        if (!bonkMods._categories[def.categoryId]) {
            bonkMods.registerCategory({
                id: def.categoryId,
                label: def.categoryId.charAt(0).toUpperCase() + def.categoryId.slice(1),
                order: 100
            });
        }

        if (!bonkMods._mods[def.modId] && def.modId === FALLBACK_MOD_ID) {
            bonkMods.registerMod({
                id: FALLBACK_MOD_ID,
                name: 'Other Mods',
                description: 'Blocks from mods that did not register themselves.'
            });
        }

        renderModDropdown();
        renderCategories();
        renderBlocks();
    };

    bonkMods.addModdedBlock = function(def) {
        if (!def) return;
        bonkMods.addBlock(Object.assign({ categoryId: DEFAULT_CATEGORY_ID }, def));
    };

    function setupSettingsShell(settingsContainer) {
        const topBar = $('settings_topBar');
        const closeBtn = $('settings_close');
        if (!topBar || !closeBtn) return;
        if ($('mod_tabs')) {
            renderModDropdown();
            renderModInfo();
            renderCategories();
            renderBlocks();
            return;
        }

        topBar.style.display = 'flex';
        topBar.style.alignItems = 'center';
        topBar.style.padding = '0 10px';
        topBar.style.boxSizing = 'border-box';

        const title = document.createElement('div');
        title.textContent = 'Settings';
        title.style.fontWeight = 'bold';
        title.style.marginRight = '12px';

        const tabs = document.createElement('div');
        tabs.id = 'mod_tabs';
        tabs.style.display = 'flex';
        tabs.style.gap = '6px';
        tabs.style.margin = '0 auto';
        tabs.innerHTML = `
            <div class="brownButton brownButton_classic buttonShadow mod_tab active" data-tab="generic">Generic</div>
            <div class="brownButton brownButton_classic buttonShadow mod_tab mod_tab_modded" data-tab="modded">
                Modded <span id="mod_tab_modname" style="font-weight:normal;opacity:0.7;"></span> ▾
            </div>
        `;

        closeBtn.style.position = 'static';
        closeBtn.style.marginLeft = 'auto';

        topBar.textContent = '';
        topBar.appendChild(title);
        topBar.appendChild(tabs);
        topBar.appendChild(closeBtn);

        if (!$('#bonk_mod_core_css')) {
            const style = document.createElement('style');
            style.id = 'bonk_mod_core_css';
            style.textContent = `
                .mod_tab {
                    padding: 4px 10px !important;
                    font-size: 13px;
                    line-height: normal;
                    height: auto !important;
                    opacity: 0.75;
                    position: relative;
                }
                .mod_tab.active { opacity: 1; }

                #mod_dropdown {
                    position: absolute;
                    top: 100%;
                    left: 0;
                    margin-top: 4px;
                    background: rgba(16,27,38,0.98);
                    border-radius: 6px;
                    box-shadow: 0 8px 20px rgba(0,0,0,0.6);
                    padding: 6px;
                    min-width: 200px;
                    z-index: 100000;
                    display: none;
                }
                #mod_dropdown_title {
                    font-size:11px;
                    text-transform:uppercase;
                    opacity:.8;
                    margin-bottom:4px;
                }
                .mod_dropdown_item {
                    font-size:12px;
                    padding:4px 6px;
                    border-radius:4px;
                    cursor:pointer;
                    display:flex;
                    justify-content:space-between;
                    align-items:center;
                    gap:4px;
                }
                .mod_dropdown_item span {
                    pointer-events:none;
                }
                .mod_dropdown_item small {
                    opacity:.7;
                    font-size:10px;
                }
                .mod_dropdown_item:hover {
                    background:rgba(255,255,255,0.08);
                }
                .mod_dropdown_item.active {
                    background:rgba(121,85,248,0.4);
                }

                #mod_modded_settings {
                    display:flex;
                    flex-direction:column;
                    height:100%;
                    box-sizing:border-box;
                    margin-top:4px;
                }

                #mod_modinfo {
                    padding:4px 7px 6px 7px;
                    margin-bottom:6px;
                    border-radius:4px;
                    background:rgba(0,0,0,0.18);
                    font-size:11px;
                }
                #mod_modinfo_title {
                    font-weight:bold;
                    font-size:12px;
                }
                #mod_modinfo_meta {
                    opacity:.8;
                    margin:1px 0 3px 0;
                }
                #mod_modinfo_desc {
                    opacity:.9;
                }
                #mod_modinfo_link a {
                    color:#9fd4ff;
                    text-decoration:underline;
                }

                #mod_cat_tabs {
                    display:flex;
                    gap:6px;
                    margin:4px 0 6px 0;
                    flex-wrap:wrap;
                }
                .mod_cat_tab {
                    padding:3px 9px !important;
                    font-size:12px;
                    height:auto !important;
                    cursor:pointer;
                    opacity:.75;
                }
                .mod_cat_tab.active {
                    opacity:1;
                    outline:1px solid rgba(255,255,255,0.25);
                }

                #mod_blocks_scroll {
                    position:relative;
                    flex:1 1 auto;
                    overflow-y:auto;
                    overflow-x:hidden;
                    padding-right:6px;
                    border-radius:4px;
                    background:rgba(0,0,0,0.1);
                }

                #mod_blocks_scroll::-webkit-scrollbar {
                    width:8px;
                }
                #mod_blocks_scroll::-webkit-scrollbar-track {
                    background:rgba(0,0,0,0.25);
                    border-radius:4px;
                }
                #mod_blocks_scroll::-webkit-scrollbar-thumb {
                    background:linear-gradient(#32485d,#182430);
                    border-radius:4px;
                    border:1px solid rgba(255,255,255,0.15);
                }
                #mod_blocks_scroll::-webkit-scrollbar-thumb:hover {
                    background:linear-gradient(#3e566d,#1f3140);
                }
                #mod_blocks_scroll {
                    scrollbar-width:thin;
                    scrollbar-color:#32485d rgba(0,0,0,0.25);
                }

                .mod_block {
                    padding:8px 6px 10px 6px;
                    border-bottom:1px solid rgba(255,255,255,0.08);
                }
                .mod_block:first-child {
                    border-top:1px solid rgba(255,255,255,0.08);
                }
                .mod_block_title {
                    font-weight:bold;
                    font-size:13px;
                }
                .mod_block_sub {
                    font-size:11px;
                    opacity:.8;
                    margin-top:2px;
                    margin-bottom:6px;
                }
            `;
            document.head.appendChild(style);
        }

        const genericWrap = document.createElement('div');
        genericWrap.id = 'mod_generic_settings';

        const moddedWrap = document.createElement('div');
        moddedWrap.id = 'mod_modded_settings';
        moddedWrap.style.display = 'none';
        moddedWrap.style.padding = '10px 10px 6px 10px';

        const modInfo = document.createElement('div');
        modInfo.id = 'mod_modinfo';
        modInfo.innerHTML = `
            <div id="mod_modinfo_title"></div>
            <div id="mod_modinfo_meta"></div>
            <div id="mod_modinfo_desc"></div>
            <div id="mod_modinfo_link"></div>
        `;

        const catTabs = document.createElement('div');
        catTabs.id = 'mod_cat_tabs';

        const blocksScroll = document.createElement('div');
        blocksScroll.id = 'mod_blocks_scroll';

        moddedWrap.appendChild(modInfo);
        moddedWrap.appendChild(catTabs);
        moddedWrap.appendChild(blocksScroll);

        [...settingsContainer.children].forEach(el => {
            if (
                el !== topBar &&
                el !== closeBtn &&
                el.id !== 'settings_cancelButton' &&
                el.id !== 'settings_saveButton'
            ) {
                genericWrap.appendChild(el);
            }
        });

        settingsContainer.insertBefore(genericWrap, settingsContainer.children[1]);
        settingsContainer.insertBefore(moddedWrap, $('settings_cancelButton'));

        // Primary tab switching
        tabs.querySelectorAll('.mod_tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const which = tab.dataset.tab;
                tabs.querySelectorAll('.mod_tab').forEach(t =>
                    t.classList.toggle('active', t === tab)
                );
                const isModded = which === 'modded';
                genericWrap.style.display = isModded ? 'none' : 'block';
                moddedWrap.style.display = isModded ? 'flex' : 'none';

                // toggle dropdown when clicking the Modded tab body
                if (which === 'modded') {
                    e.stopPropagation();
                    toggleModDropdown();
                } else {
                    hideModDropdown();
                }
            });
        });

        // Dropdown container under Modded tab
        const moddedTab = topBar.querySelector('.mod_tab_modded');
        const dropdown = document.createElement('div');
        dropdown.id = 'mod_dropdown';
        dropdown.innerHTML = `
            <div id="mod_dropdown_title">Select mod</div>
            <div id="mod_dropdown_list"></div>
        `;
        moddedTab.style.position = 'relative';
        moddedTab.appendChild(dropdown);

        document.addEventListener('click', (e) => {
            if (!dropdown.contains(e.target) && !moddedTab.contains(e.target)) {
                hideModDropdown();
            }
        });

        bonkMods.registerCategory({ id: DEFAULT_CATEGORY_ID, label: 'General', order: 0 });

        bonkMods._mods['all'] = {
            id: 'all',
            name: 'All Mods',
            description: 'Show settings for every registered mod.',
            version: '',
            author: '',
            homepage: ''
        };

        bonkMods.registerMod({
            id: '__dev',
            name: 'Developers',
            version: '',
            author: 'Bonk Mod Settings Core',
            description: 'Information for script developers on how to hook into this UI.',
            homepage: ''
        });

        bonkMods.registerCategory({
            id: '__dev_cat',
            label: 'Developer Docs',
            order: 999
        });

        bonkMods.addBlock({
            id: '__dev_block',
            modId: '__dev',
            categoryId: '__dev_cat',
            title: 'Using Bonk Mod Settings Core',
            order: 0,
            render(container) {
                container.innerHTML = `
                    <div class="mod_block_sub">
                        Your script can register itself as a mod and add settings blocks here.
                    </div>
<pre style="font-size:10px;line-height:1.3;background:rgba(0,0,0,0.25);padding:4px 6px;border-radius:4px;white-space:pre-wrap;">
// Register your mod
bonkMods.registerMod({
  id: 'recolor',
  name: 'Re:Color',
  version: '1.0.0',
  author: 'You',
  description: 'Colour groups for player names.'
});

// (optional) register extra categories
bonkMods.registerCategory({
  id: 'cosmetics',
  label: 'Cosmetics',
  order: 10
});

// Add a block of settings
bonkMods.addBlock({
  id: 'recolor_groups',
  modId: 'recolor',
  categoryId: 'cosmetics',
  title: 'Colour Groups',
  order: 5,
  render(container) {
    // build your UI into container
  }
});</pre>
                    <div style="font-size:10px;opacity:.8;margin-top:4px;">
                        The core fires a <code>bonkModsReady</code> event on <code>window</code> when
                        it has initialised, so you can safely wait for it if load order is uncertain.
                    </div>
                `;
            }
        });

        // signal ready
        global.dispatchEvent(new Event('bonkModsReady'));

        renderModDropdown();
        renderModInfo();
        renderCategories();
        renderBlocks();
    }

    function toggleModDropdown() {
        const dd = $('mod_dropdown');
        if (!dd) return;
        dd.style.display = (dd.style.display === 'none' || dd.style.display === '') ? 'block' : 'none';
    }
    function hideModDropdown() {
        const dd = $('mod_dropdown');
        if (!dd) return;
        dd.style.display = 'none';
    }

    function renderModDropdown() {
        const listEl = $('mod_dropdown_list');
        const modNameSpan = $('mod_tab_modname');
        if (!listEl || !bonkMods._mods) return;

        const modsArr = Object.values(bonkMods._mods);
        if (!modsArr.length) return;

        if (!bonkMods._mods['all']) {
            bonkMods._mods['all'] = {
                id: 'all',
                name: 'All Mods',
                description: '',
                version: '',
                author: ''
            };
        }

        if (!currentModId || !bonkMods._mods[currentModId]) {
            currentModId = 'all';
        }

        modsArr.sort((a, b) => {
            if (a.id === 'all') return -1;
            if (b.id === 'all') return 1;
            if (a.name === b.name) return a.id > b.id ? 1 : -1;
            return a.name.localeCompare(b.name);
        });

        listEl.textContent = '';
        modsArr.forEach(mod => {
            const item = document.createElement('div');
            item.className = 'mod_dropdown_item' + (mod.id === currentModId ? ' active' : '');
            item.dataset.modId = mod.id;
            item.innerHTML = `
                <span>${mod.name}</span>
                <small>${mod.version || ''}</small>
            `;
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                currentModId = mod.id;
                renderModDropdown();
                renderModInfo();
                renderCategories();
                renderBlocks();
                hideModDropdown();
            });
            listEl.appendChild(item);
        });

        if (modNameSpan && bonkMods._mods[currentModId]) {
            const label = currentModId === 'all'
                ? ''
                : '(' + bonkMods._mods[currentModId].name + ')';
            modNameSpan.textContent = label;
        }
    }

    function renderModInfo() {
        const mod = bonkMods._mods[currentModId] || bonkMods._mods['all'];
        const t = $('mod_modinfo_title');
        const m = $('mod_modinfo_meta');
        const d = $('mod_modinfo_desc');
        const l = $('mod_modinfo_link');
        if (!t || !m || !d || !l || !mod) return;

        t.textContent = mod.name || 'All Mods';
        m.textContent = [
            mod.version ? `v${mod.version}` : '',
            mod.author ? `by ${mod.author}` : ''
        ].filter(Boolean).join('  ·  ');
        d.textContent = mod.description || '';

        if (mod.homepage) {
            l.innerHTML = `<a href="${mod.homepage}" target="_blank" rel="noopener">Open page</a>`;
        } else {
            l.textContent = '';
        }

        if (mod.id === '__dev' && mod.devHint) {
            const extra = document.createElement('div');
            extra.style.fontSize = '10px';
            extra.style.opacity = '0.8';
            extra.style.marginTop = '3px';
            extra.textContent = mod.devHint;
            d.appendChild(extra);
        }
    }

    function renderCategories() {
        const catTabs = $('mod_cat_tabs');
        if (!catTabs) return;

        const blocks = bonkMods._blocks || [];

        const usedCatIds = new Set();
        blocks.forEach(b => {
            if (currentModId === 'all' || b.modId === currentModId) {
                usedCatIds.add(b.categoryId);
            }
        });

        const allCats = Object.values(bonkMods._categories)
            .filter(c => usedCatIds.has(c.id));
        if (!allCats.length) {
            catTabs.textContent = '';
            currentCategoryId = null;
            $('mod_blocks_scroll') && ( $('mod_blocks_scroll').textContent = '' );
            return;
        }

        allCats.sort((a, b) => {
            if (a.order === b.order) return a.label > b.label ? 1 : -1;
            return a.order - b.order;
        });

        if (!currentCategoryId || !usedCatIds.has(currentCategoryId)) {
            currentCategoryId = allCats[0].id;
        }

        catTabs.textContent = '';
        allCats.forEach(cat => {
            const btn = document.createElement('div');
            btn.className = 'brownButton brownButton_classic buttonShadow mod_cat_tab' +
                (cat.id === currentCategoryId ? ' active' : '');
            btn.dataset.catId = cat.id;
            btn.textContent = cat.label;
            btn.addEventListener('click', () => {
                currentCategoryId = cat.id;
                renderCategories();
                renderBlocks();
            });
            catTabs.appendChild(btn);
        });
    }

    function renderBlocks() {
        const scroll = $('mod_blocks_scroll');
        if (!scroll) return;
        const blocks = bonkMods._blocks || [];

        scroll.textContent = '';
        scroll.scrollTop = 0;

        if (!blocks.length || !currentCategoryId) return;

        const arr = blocks.slice().sort((a, b) => {
            const ca = bonkMods._categories[a.categoryId] || { order: 999 };
            const cb = bonkMods._categories[b.categoryId] || { order: 999 };
            if (ca.order !== cb.order) return ca.order - cb.order;
            if (a.order === b.order) return a.id > b.id ? 1 : -1;
            return a.order - b.order;
        });

        arr.forEach(def => {
            if (def.categoryId !== currentCategoryId) return;
            if (currentModId !== 'all' && def.modId !== currentModId) return;

            const block = document.createElement('div');
            block.className = 'mod_block';
            block.dataset.blockId = def.id;

            if (def.title) {
                const titleEl = document.createElement('div');
                titleEl.className = 'mod_block_title';
                titleEl.textContent = def.title;
                block.appendChild(titleEl);
            }

            const content = document.createElement('div');
            block.appendChild(content);
            scroll.appendChild(block);

            try {
                def.render(content);
            } catch (e) {
                console.error('[BonkModSettingsCore] error rendering block', def.id, e);
                content.textContent = 'Error loading this mod block.';
            }
        });
    }

    waitForElement('settingsContainer', setupSettingsShell);
})();
