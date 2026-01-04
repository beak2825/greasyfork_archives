// ==UserScript==
// @name         Prompt Your Grok Genius
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  L'estensione definitiva per gestire, organizzare e inviare i tuoi prompt su Grok.
// @author       Anam Orion
// @match        *://grok.com/*
// @match        *://x.com/i/grok*
// @icon         https://i.imgur.com/p26jpdo.png
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560100/Prompt%20Your%20Grok%20Genius.user.js
// @updateURL https://update.greasyfork.org/scripts/560100/Prompt%20Your%20Grok%20Genius.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const DB_KEY = 'gpm_prompts_v2';
    let prompts = GM_getValue(DB_KEY) || GM_getValue('gpm_prompts') || [];

    const APP_ICON = `https://i.imgur.com/p26jpdo.png`;
    const COLORS = { DEFAULT: "#1d9bf0", PHOTO: "#f91880", VIDEO: "#7856ff", ALL: "#00ba7c", CLEAR: "#f44336" };
    const PALETTE = ["#1d9bf0", "#f91880", "#7856ff", "#00ba7c", "#ffa000", "#ffffff"];

    let lang = GM_getValue('gpm_lang', 'it');
    let currentSort = GM_getValue('gpm_sort_mode', 'recent');
    let currentMode = "ALL";
    let activeTagFilter = null;
    let editIdx = -1;
    let selectedColor = COLORS.DEFAULT;
    let fontSize = GM_getValue('gpm_font_size', 13);
    let isCompactView = GM_getValue('gpm_compact_view', false);

    const i18n = {
        it: { title: "PROMPT YOUR GROK GENIUS", search: "Cerca...", recent: "RECENTI", alpha: "A-Z", fav: "PREFERITI ❤️", newBtn: "+ NUOVO", save: "SALVA", cancel: "ANNULLA", charCount: "Caratteri", edit: "EDIT", del: "DEL", copy: "COPIA", repl: "REPL", send: "SEND", confirmDel: "Eliminare?", exp: "EXP", imp: "IMP", compact: "COMPACT", lang: "🇮🇹", tags: "Tag (es: cinematic, neon)", allTags: "TUTTI I TAG" },
        en: { title: "PROMPT YOUR GROK GENIUS", search: "Search...", recent: "RECENT", alpha: "A-Z", fav: "FAVORITES ❤️", newBtn: "+ NEW", save: "SAVE", cancel: "CANCEL", charCount: "Characters", edit: "EDIT", del: "DEL", copy: "COPY", repl: "REPL", send: "SEND", confirmDel: "Delete?", exp: "EXP", imp: "IMP", compact: "COMPACT", lang: "🇬🇧", tags: "Tags (eg: cinematic, neon)", allTags: "ALL TAGS" }
    };

    function t(key) { return i18n[lang][key]; }

    GM_addStyle(`
        #gpm-launcher { position: fixed !important; bottom: 25px; right: 25px; width: 62px; height: 62px; background: #000; border-radius: 14px; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 2147483647; box-shadow: 0 0 10px rgba(29,155,240,0.5), 0 0 0 1px ${COLORS.DEFAULT}; background-image: url('${APP_ICON}'); background-size: cover; }
        #gpm-panel { position: fixed !important; bottom: 100px; right: 25px; width: 380px; height: 720px; background: #000; border: 1px solid ${COLORS.DEFAULT}; border-radius: 20px; z-index: 2147483646; display: none; flex-direction: column; color: #eff3f4; font-family: 'Inter', sans-serif; overflow: hidden; box-shadow: 0 0 20px rgba(29,155,240,0.3); }

        .gpm-header { padding: 12px 18px; border-bottom: 1px solid #333; display: flex; justify-content: space-between; align-items: center; }
        .gpm-content { flex: 1; overflow-y: auto; background: #000; }

        .gpm-item { padding: 12px 20px; border-bottom: 1px solid #2f3336; transition: background 0.1s; position: relative; }
        .gpm-item:nth-child(odd) { background: #0a0a0a; }
        .gpm-item:nth-child(even) { background: #121417; }
        .gpm-item:hover { background: #1f2124 !important; }

        .compact-mode .gpm-prompt-text, .compact-mode .gpm-char-count { display: none !important; }
        .compact-mode .gpm-item { padding: 10px 20px !important; }

        .media-btn { flex: 1; padding: 10px; border-radius: 8px; border: 1px solid #333; cursor: pointer; text-align: center; font-size: 11px; font-weight: 700; color: #71767b; transition: 0.2s; }
        .media-btn:hover { color: #fff; border-color: #555; }
        .media-btn.active.all { border-color: ${COLORS.ALL}; color: ${COLORS.ALL}; background: rgba(0,186,124,0.1); }
        .media-btn.active.photo { border-color: ${COLORS.PHOTO}; color: ${COLORS.PHOTO}; background: rgba(249,24,128,0.1); }
        .media-btn.active.video { border-color: ${COLORS.VIDEO}; color: ${COLORS.VIDEO}; background: rgba(120,86,255,0.1); }

        .sort-pill { background: #000; border: 1px solid #333; color: #71767b; padding: 8px; border-radius: 10px; font-size: 10px; cursor: pointer; text-align: center; font-weight: 700; flex: 1; transition: 0.2s; }
        .sort-pill:hover { color: #fff; border-color: #555; }
        .sort-pill.active { border-color: ${COLORS.DEFAULT}; color: ${COLORS.DEFAULT}; background: rgba(29, 155, 240, 0.15); }

        .act-link { font-size: 10px; font-weight: 800; color: #71767b; cursor: pointer; margin-right: 12px; text-transform: uppercase; transition: color 0.2s; display: inline-block; }
        .act-link:hover { color: #fff !important; }

        .clicked { opacity: 0.5; transform: scale(0.95); transition: 0.1s; }

        #gpm-editor { display: none; padding: 15px; flex-direction: column; height: 100%; background: #000; }
        #gpm-inp-text { width: 100%; background: #0a0a0a; border: 1px solid #333; color: #fff; border-radius: 12px; padding: 12px; resize: none; font-size: 14px; flex: 1; margin-bottom: 10px; outline: none; }
        .gpm-input { width: 100%; background: #111; border: 1px solid #333; color: #fff; border-radius: 10px; padding: 10px; margin-bottom: 8px; font-family: inherit; outline: none; }

        .color-dot { width: 26px; height: 26px; border-radius: 50%; cursor: pointer; border: 2px solid transparent; }
        .color-dot.active { border-color: #fff; transform: scale(1.1); }
    `);

    const panel = document.createElement('div');
    panel.id = 'gpm-panel';

    function initUI() {
        panel.innerHTML = `
            <div id="gpm-main-view" style="display:flex; flex-direction:column; height:100%;">
                <div class="gpm-header">
                    <div style="display:flex; align-items:center; gap:10px;">
                        <span id="lang-switcher" style="cursor:pointer; font-size:16px;">${t('lang')}</span>
                        <span id="font-dec" style="cursor:pointer; color:#71767b; font-size:14px;">A-</span>
                        <span id="font-inc" style="cursor:pointer; color:#71767b; font-size:14px;">A+</span>
                    </div>
                    <b style="font-size:10px; color:${COLORS.DEFAULT}; letter-spacing:1.5px; font-weight:900;">${t('title')}</b>
                    <span id="gpm-close" style="cursor:pointer; font-size:20px; color:#71767b;">✕</span>
                </div>
                <div class="media-switcher" style="display:flex; gap:8px; padding:10px 18px;">
                    <div class="media-btn" id="mode-all">🚀 ALL</div>
                    <div class="media-btn" id="mode-photo">📸 FOTO</div>
                    <div class="media-btn" id="mode-video">🎥 VIDEO</div>
                </div>
                <div style="padding: 0 18px 10px; display: flex; gap: 8px; align-items: center;">
                    <div id="gpm-clear-grok" class="sort-pill" style="max-width:42px; height:42px; display:flex; align-items:center; justify-content:center; font-size:16px; color:${COLORS.CLEAR};">🗑️</div>
                    <input type="text" id="gpm-search" class="gpm-input" style="flex:1; margin-bottom:0;" placeholder="${t('search')}">
                    <div id="tag-menu-btn" class="sort-pill" style="max-width:42px; height:42px; display:flex; align-items:center; justify-content:center; font-size:16px;">🏷️</div>
                </div>
                <div id="tag-dropdown" style="position:absolute; top:185px; right:18px; width:220px; max-height:250px; background:#16181c; border:1px solid ${COLORS.DEFAULT}; border-radius:12px; display:none; flex-direction:column; z-index:9999; overflow-y:auto;"></div>
                <div style="padding:0 18px 12px; display:flex; gap:6px;">
                    <div id="sort-recent" class="sort-pill">${t('recent')}</div>
                    <div id="sort-alpha" class="sort-pill">${t('alpha')}</div>
                    <div id="sort-fav" class="sort-pill">${t('fav')}</div>
                </div>
                <div class="gpm-content ${isCompactView ? 'compact-mode' : ''}" id="gpm-list"></div>
                <div style="padding:15px 18px; border-top:1px solid #333; display:flex; flex-wrap:wrap; gap:8px;">
                    <button id="gpm-add-new" style="flex:100%; background:#eff3f4; color:#000; border:none; padding:12px; border-radius:25px; font-weight:800; cursor:pointer; margin-bottom:5px;">${t('newBtn')}</button>
                    <button id="gpm-compact-toggle" class="sort-pill ${isCompactView?'active':''}" style="flex:1.5;">${t('compact')}</button>
                    <button id="gpm-export" class="sort-pill" style="flex:1;">${t('exp')}</button>
                    <button id="gpm-import-trigger" class="sort-pill" style="flex:1;">${t('imp')}</button>
                </div>
            </div>
            <div id="gpm-editor">
                 <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                    <b style="font-size:14px;">EDITOR</b>
                    <div id="gpm-editor-chars" style="font-size:11px; color:#71767b;">0 ${t('charCount')}</div>
                 </div>
                 <div id="color-picker" style="display:flex; gap:12px; margin-bottom:12px; justify-content:center;"></div>
                 <input type="text" id="gpm-inp-title" class="gpm-input" placeholder="Titolo">
                 <input type="text" id="gpm-inp-tags" class="gpm-input" placeholder="${t('tags')}">
                 <textarea id="gpm-inp-text" placeholder="Prompt..."></textarea>
                 <div style="display:flex; gap:10px; padding-top:5px;">
                    <button id="gpm-save" style="flex:1; background:${COLORS.DEFAULT}; color:white; border:none; padding:12px; border-radius:25px; font-weight:800; cursor:pointer;">${t('save')}</button>
                    <button id="gpm-cancel" style="flex:1; background:#16181c; color:white; border:none; padding:12px; border-radius:25px; cursor:pointer;">${t('cancel')}</button>
                 </div>
            </div>
            <input type="file" id="gpm-import-file" style="display:none;" accept=".json">
        `;
        setupEvents();
        render();
    }

    function setupEvents() {
        document.getElementById('gpm-close').onclick = togglePanel;
        document.getElementById('gpm-compact-toggle').onclick = (e) => { triggerFlash(e.currentTarget); isCompactView = !isCompactView; GM_setValue('gpm_compact_view', isCompactView); document.getElementById('gpm-list').classList.toggle('compact-mode'); e.currentTarget.classList.toggle('active'); render(); };
        document.getElementById('lang-switcher').onclick = () => { lang = (lang==='it'?'en':'it'); GM_setValue('gpm_lang', lang); initUI(); };
        document.getElementById('font-inc').onclick = () => { fontSize++; GM_setValue('gpm_font_size', fontSize); render(); };
        document.getElementById('font-dec').onclick = () => { fontSize--; GM_setValue('gpm_font_size', fontSize); render(); };
        document.getElementById('gpm-clear-grok').onclick = (e) => { triggerFlash(e.currentTarget); const box = document.querySelector('div[contenteditable="true"], textarea'); if(box) { box.innerHTML = ''; box.innerText = ''; if(box.value !== undefined) box.value = ''; box.focus(); } };
        document.getElementById('mode-all').onclick = () => { currentMode='ALL'; render(); };
        document.getElementById('mode-photo').onclick = () => { currentMode='PHOTO'; render(); };
        document.getElementById('mode-video').onclick = () => { currentMode='VIDEO'; render(); };
        document.getElementById('sort-recent').onclick = () => { currentSort='recent'; render(); };
        document.getElementById('sort-alpha').onclick = () => { currentSort='alpha'; render(); };
        document.getElementById('sort-fav').onclick = () => { currentSort='fav'; render(); };
        document.getElementById('gpm-export').onclick = (e) => { triggerFlash(e.currentTarget); const blob = new Blob([JSON.stringify(prompts)], {type: 'application/json'}); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'grok_prompts.json'; a.click(); };
        document.getElementById('gpm-import-trigger').onclick = (e) => { triggerFlash(e.currentTarget); document.getElementById('gpm-import-file').click(); };
        document.getElementById('gpm-import-file').onchange = (e) => { const reader = new FileReader(); reader.onload = (ev) => { try { prompts = JSON.parse(ev.target.result); GM_setValue(DB_KEY, prompts); render(); } catch(err) { alert("Errore"); } }; reader.readAsText(e.target.files[0]); };
        document.getElementById('tag-menu-btn').onclick = (e) => { e.stopPropagation(); triggerFlash(e.currentTarget); const dd = document.getElementById('tag-dropdown'); dd.style.display = dd.style.display === 'flex' ? 'none' : 'flex'; updateTagDropdown(); };
        document.getElementById('gpm-add-new').onclick = (e) => { triggerFlash(e.currentTarget); apriEditor(); };
        document.getElementById('gpm-save').onclick = salvaPrompt;
        document.getElementById('gpm-cancel').onclick = chiudiEditor;
        document.getElementById('gpm-search').addEventListener('input', (e) => render(e.target.value.toLowerCase()));
    }

    function render(searchTerm = '') {
        const list = document.getElementById('gpm-list');
        if(!list) return;
        list.innerHTML = '';
        let listToDisplay = [...prompts];
        if (currentMode !== "ALL") listToDisplay = listToDisplay.filter(p => p.type === currentMode);
        if (activeTagFilter) listToDisplay = listToDisplay.filter(p => p.tags && p.tags.toLowerCase().includes(activeTagFilter));
        if (searchTerm) listToDisplay = listToDisplay.filter(p => p.title.toLowerCase().includes(searchTerm) || p.content.toLowerCase().includes(searchTerm));
        if (currentSort === 'alpha') listToDisplay.sort((a,b) => a.title.localeCompare(b.title));
        else if (currentSort === 'fav') listToDisplay.sort((a,b) => (b.fav?1:0) - (a.fav?1:0));
        else listToDisplay.sort((a,b) => (b.time || 0) - (a.time || 0));

        listToDisplay.forEach((p) => {
            const realIdx = prompts.indexOf(p);
            const div = document.createElement('div');
            div.className = 'gpm-item';
            div.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span style="color:${p.color || COLORS.DEFAULT}; font-size:${fontSize+2}px; font-weight:800;">${p.title}</span>
                    <span id="fav-${realIdx}" style="color:${p.fav?'#f91880':'#333'}; font-size:16px; cursor:pointer;">❤</span>
                </div>
                <div class="gpm-char-count" style="color:#71767b; font-size:${fontSize-2}px; margin: 4px 0; font-weight:600;">${p.content.length} characters</div>
                <div class="gpm-prompt-text" style="color:#71767b; font-size:${fontSize}px; line-height:1.4; display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden; margin-bottom:10px;">${p.content}</div>
                <div style="display:flex; align-items:center; margin-top:5px;">
                   <span class="act-link" id="copy-${realIdx}">${t('copy')}</span>
                   <span class="act-link" id="repl-${realIdx}" style="color:#ffa000">${t('repl')}</span>
                   <span class="act-link" id="edit-${realIdx}">${t('edit')}</span>
                   <span class="act-link" id="del-${realIdx}" style="color:#f44336">${t('del')}</span>
                   <span class="act-link" id="send-${realIdx}" style="color:#00ba7c; font-size:16px; margin-left:auto;">🚀</span>
                </div>
            `;
            list.appendChild(div);

            const bindAct = (id, fn) => { const el = document.getElementById(id); if(el) el.onclick = (e) => { e.stopPropagation(); triggerFlash(el); fn(); }; };
            bindAct(`copy-${realIdx}`, () => navigator.clipboard.writeText(p.content));
            bindAct(`edit-${realIdx}`, () => apriEditor(realIdx));
            bindAct(`del-${realIdx}`, () => { if(confirm(t('confirmDel'))) { prompts.splice(realIdx,1); GM_setValue(DB_KEY, prompts); render(); } });
            bindAct(`fav-${realIdx}`, () => { prompts[realIdx].fav = !prompts[realIdx].fav; GM_setValue(DB_KEY, prompts); render(); });
            bindAct(`repl-${realIdx}`, () => inserisci(p.content, true));
            bindAct(`send-${realIdx}`, () => { inserisci(p.content); setTimeout(() => { const btn = document.querySelector('button[aria-label*="Send"], button[type="submit"]'); if(btn) btn.click(); }, 150); });
        });
        updateTabUI();
    }

    function updateTagDropdown() {
        const dropdown = document.getElementById('tag-dropdown');
        const stats = {};
        prompts.forEach(p => { if(p.tags) p.tags.split(',').forEach(t => { const tag = t.trim().toLowerCase(); if(tag) stats[tag] = (stats[tag] || 0) + 1; }); });
        let html = `<div class="tag-opt" id="filter-tag-clear" style="padding:12px; cursor:pointer; color:${COLORS.DEFAULT}">× ${t('allTags')}</div>`;
        Object.keys(stats).sort().forEach(tag => { html += `<div class="tag-opt" data-tag="${tag}" style="padding:12px; cursor:pointer; border-bottom:1px solid #222; display:flex; justify-content:space-between;"><span>#${tag}</span><span style="opacity:0.5;">${stats[tag]}</span></div>`; });
        dropdown.innerHTML = html;
        dropdown.querySelectorAll('.tag-opt').forEach(opt => { opt.onclick = (e) => { e.stopPropagation(); activeTagFilter = opt.getAttribute('data-tag'); dropdown.style.display = 'none'; render(); }; });
    }

    function apriEditor(idx = -1) {
        editIdx = idx;
        document.getElementById('gpm-main-view').style.display = 'none';
        document.getElementById('gpm-editor').style.display = 'flex';
        const p = prompts[idx] || {title:'', content:'', tags:'', color: COLORS.DEFAULT};
        document.getElementById('gpm-inp-title').value = p.title;
        document.getElementById('gpm-inp-text').value = p.content;
        document.getElementById('gpm-inp-tags').value = p.tags || '';
        document.getElementById('gpm-editor-chars').innerText = `${p.content.length} ${t('charCount')}`;
        selectedColor = p.color || COLORS.DEFAULT;
        const cp = document.getElementById('color-picker'); cp.innerHTML = '';
        PALETTE.forEach(c => {
            const dot = document.createElement('div');
            dot.className = `color-dot ${c === selectedColor ? 'active' : ''}`;
            dot.style.backgroundColor = c;
            dot.onclick = () => { selectedColor = c; document.querySelectorAll('.color-dot').forEach(d => d.classList.remove('active')); dot.classList.add('active'); };
            cp.appendChild(dot);
        });
    }

    function salvaPrompt() {
        const tVal = document.getElementById('gpm-inp-title').value.trim();
        const cVal = document.getElementById('gpm-inp-text').value.trim();
        if(!tVal || !cVal) return;
        const newObj = { title: tVal, content: cVal, tags: document.getElementById('gpm-inp-tags').value, type: currentMode, color: selectedColor, time: Date.now(), fav: (editIdx>-1 ? prompts[editIdx].fav : false) };
        if(editIdx > -1) prompts[editIdx] = newObj; else prompts.push(newObj);
        GM_setValue(DB_KEY, prompts); chiudiEditor(); render();
    }

    function updateTabUI() {
        document.querySelectorAll('.media-btn').forEach(b => b.classList.remove('active', 'all', 'photo', 'video'));
        const mBtn = document.getElementById(`mode-${currentMode.toLowerCase()}`);
        if(mBtn) mBtn.classList.add('active', currentMode.toLowerCase());
        document.querySelectorAll('.sort-pill').forEach(b => b.classList.remove('active'));
        const sBtn = document.getElementById(`sort-${currentSort}`);
        if(sBtn) sBtn.classList.add('active');
    }

    function chiudiEditor() { document.getElementById('gpm-main-view').style.display='flex'; document.getElementById('gpm-editor').style.display='none'; }
    function triggerFlash(el) { el.classList.add('clicked'); setTimeout(() => el.classList.remove('clicked'), 150); }
    function togglePanel() { panel.style.display = panel.style.display === 'flex' ? 'none' : 'flex'; }
    function inserisci(testo, replace = false) {
        const box = document.querySelector('div[contenteditable="true"], textarea');
        if (box) { box.focus(); if(replace) { box.innerHTML = ''; box.innerText = ''; if(box.value !== undefined) box.value = ''; } document.execCommand('insertText', false, testo); }
    }

    document.body.appendChild(panel);
    const launcher = document.createElement('div');
    launcher.id = 'gpm-launcher';
    launcher.onclick = togglePanel;
    document.body.appendChild(launcher);
    initUI();
})();