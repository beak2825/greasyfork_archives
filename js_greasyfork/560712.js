// ==UserScript==
// @name         NeoGAF EQ
// @namespace    http://tampermonkey.net/
// @version      2.9.4
// @author       bj00rn & Gemini AI
// @description  The Forum Equalizer: Restored Import/Export. Full Visual EQ. Live Remarks. Tiered Deep Black.
// @match        *://*.neogaf.com/*
// @license      MIT
// @homepageURL  https://greasyfork.org/scripts/521313-neogaf-eq
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560712/NeoGAF%20EQ.user.js
// @updateURL https://update.greasyfork.org/scripts/560712/NeoGAF%20EQ.meta.js
// ==/UserScript==

/*
 * MIT License
 * Copyright (c) 2025 bj00rn
 */

(function() {
    'use strict';

    const loadData = (key) => {
        try { return JSON.parse(localStorage.getItem(key) || "{}"); } catch(e) { return {}; }
    };

    let mutedData = loadData('ng_muted_users');
    let boostedData = loadData('ng_boosted_users');
    
    let hideLabels = localStorage.getItem('ng_hide_labels') === 'true';
    let hideOrbs = localStorage.getItem('ng_hide_orbs') === 'true'; 
    let muteGifted = localStorage.getItem('ng_mute_gifted') === 'true';
    let symmetricDates = localStorage.getItem('ng_symmetric_dates') === 'true';
    let hideDesc = localStorage.getItem('ng_hide_desc') === 'true';
    let minimalBread = localStorage.getItem('ng_minimal_bread') === 'true';
    let minimalNav = localStorage.getItem('ng_minimal_nav') === 'true';
    let fadedDetails = localStorage.getItem('ng_faded_details') === 'true';
    let use24h = localStorage.getItem('ng_24h_clock') === 'true';
    let useEuroDates = localStorage.getItem('ng_euro_dates') === 'true';
    let cleanTitles = localStorage.getItem('ng_clean_titles') === 'true';
    let greyTitles = localStorage.getItem('ng_grey_titles') === 'true';
    let deepBlack = localStorage.getItem('ng_deep_black') === 'true';
    let showHighlights = localStorage.getItem('ng_show_highlights') !== 'false';
    
    let needsRefresh = false;
    let isLocked = false;

    const injectStyles = () => {
        if (document.getElementById('ng-power-styles')) return;
        const styleSheet = document.createElement("style");
        styleSheet.id = 'ng-power-styles';
        styleSheet.textContent = `
            #ng-management-hub { background: rgba(128, 128, 128, 0.1) !important; border: 1px solid rgba(128, 128, 128, 0.2) !important; padding: 8px 15px !important; margin: 10px 0 !important; color: #aaa !important; font-family: monospace; font-size: 11px; display: flex; justify-content: space-between; align-items: center; border-radius: 4px; clear: both; }
            .ng-muted-row { background: rgba(128, 128, 128, 0.08); border: 1px solid rgba(128, 128, 128, 0.15); padding: 4px 12px; margin: 6px 0 !important; display: flex; justify-content: space-between; color: gray; font-size: 11px; border-radius: 2px; height: 18px; align-items: center; clear: both; }
            
            .ng-deep-black [style*="background-color: #27282a"], .ng-deep-black .p-body, .ng-deep-black .p-pageWrapper { background-color: #0a0a0a !important; }
            .ng-deep-black .p-nav-inner { background-color: #141414 !important; }

            .ng-faded-details .structItem-cell--meta, .ng-faded-details .structItem-cell--latest { opacity: 0.4 !important; transition: opacity 0.2s; }
            .ng-faded-details .structItem:hover .structItem-cell--meta, .ng-faded-details .structItem:hover .structItem-cell--latest { opacity: 1 !important; }

            .ng-clean-titles .structItem-title a:hover { text-decoration: none !important; }
            .ng-grey-titles .structItem-title a { color: #ccc !important; }
            
            .ng-hide-labels .label { display: none !important; }
            .ng-hide-orbs .structItem-cell--statuses, .ng-hide-orbs .icon-orb { display: none !important; }
            .ng-mute-gifted .structItem.is-gifted { background: transparent !important; background-image: none !important; }
            .ng-symmetric-dates .structItem-latestDate { font-size: 85% !important; color: #8c8c8c !important; }
            .ng-hide-desc .p-description { display: none !important; }
            .ng-minimal-bread .p-breadcrumbs { background: transparent !important; border: none !important; box-shadow: none !important; }
            .ng-minimal-nav .structItem-pageJump a { display: none !important; }
            .ng-minimal-nav .structItem-pageJump a:last-child { display: inline-block !important; padding: 1px 12px !important; background: rgba(128,128,128,0.15) !important; }

            .ng-show-highlights .ng-boosted-thread { border-left: 4px solid rgba(40, 167, 69, 0.6) !important; background: rgba(40, 167, 69, 0.03) !important; }
            .ng-show-highlights .ng-muted-thread { border-left: 4px solid rgba(204, 51, 51, 0.4) !important; opacity: 0.6; }
            .ng-boosted-name { color: #28a745 !important; font-weight: bold !important; }
            
            #ng-modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10005; display: none; align-items: center; justify-content: center; }
            #ng-modal-window { background: #1a1a1a; border: 1px solid #444; color: #eee; width: 95%; max-width: 950px; height: 85vh; border-radius: 6px; display: flex; flex-direction: column; overflow: hidden; }
            #ng-modal-sidebar { width: 200px; background: #222; border-right: 1px solid #333; padding: 15px; display: flex; flex-direction: column; gap: 4px; overflow-y: auto; }
            .ng-sidebar-label { font-size: 10px; color: #888; font-weight: bold; text-transform: uppercase; margin-top: 8px; }
            .ng-toggle-item { display: flex; align-items: center; gap: 8px; font-size: 11px; cursor: pointer; color: #ccc; }
            .ng-data-btn { background: #333; color: #fff; border: 1px solid #444; padding: 5px; font-size: 10px; cursor: pointer; text-align: center; border-radius: 3px; margin-top: 5px; }
            .ng-modal-row { background: #2a2a2a; padding: 6px 12px; border-radius: 3px; display: flex; justify-content: space-between; font-size: 11px; align-items: center; border: 1px solid #333; margin-bottom: 3px; }
            .ng-editable-remark { flex-grow: 1; color: #888; font-style: italic; padding: 0 15px; cursor: text; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
            .ng-edit-input { background: #111; color: #fff; border: 1px solid #cc3333; font-size: 11px; width: 100%; }
        `;
        document.head.appendChild(styleSheet);
        applyVisualToggles();
    };

    const applyVisualToggles = () => {
        const doc = document.documentElement;
        doc.classList.toggle('ng-hide-labels', hideLabels);
        doc.classList.toggle('ng-hide-orbs', hideOrbs);
        doc.classList.toggle('ng-mute-gifted', muteGifted);
        doc.classList.toggle('ng-symmetric-dates', symmetricDates);
        doc.classList.toggle('ng-hide-desc', hideDesc);
        doc.classList.toggle('ng-minimal-bread', minimalBread);
        doc.classList.toggle('ng-minimal-nav', minimalNav);
        doc.classList.toggle('ng-faded-details', fadedDetails);
        doc.classList.toggle('ng-clean-titles', cleanTitles);
        doc.classList.toggle('ng-grey-titles', greyTitles);
        doc.classList.toggle('ng-deep-black', deepBlack);
        doc.classList.toggle('ng-show-highlights', showHighlights);
    };

    const updateStorage = (type, data) => {
        localStorage.setItem(type === 'mute' ? 'ng_muted_users' : 'ng_boosted_users', JSON.stringify(data));
        needsRefresh = true;
    };

    const exportData = () => {
        const bundle = { boosted: boostedData, muted: mutedData };
        const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json' });
        const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'NeoGAF_EQ_Backup.json'; a.click();
    };

    const importData = () => {
        const input = document.createElement('input'); input.type = 'file'; input.accept = '.json';
        input.onchange = e => {
            const reader = new FileReader();
            reader.onload = f => {
                const data = JSON.parse(f.target.result);
                if (data.boosted) { boostedData = { ...boostedData, ...data.boosted }; updateStorage('boost', boostedData); }
                if (data.muted) { mutedData = { ...mutedData, ...data.muted }; updateStorage('mute', mutedData); }
                alert("Imported. Reloading..."); location.reload();
            };
            reader.readAsText(e.target.files[0]);
        };
        input.click();
    };

    window.openControlPanel = () => {
        let overlay = document.getElementById('ng-modal-overlay');
        if (!overlay) {
            overlay = document.createElement('div'); overlay.id = 'ng-modal-overlay';
            overlay.innerHTML = `
                <div id="ng-modal-window">
                    <div style="display:flex; justify-content:space-between; background: #111; padding: 12px 20px; border-bottom: 1px solid #333;">
                        <strong>NEOGAF EQ CONTROL PANEL</strong>
                        <span onclick="window.closeControlPanel()" style="cursor:pointer; color:gray; font-size:10px;">[Close]</span>
                    </div>
                    <div style="display:flex; flex-grow:1; overflow:hidden;">
                        <div id="ng-modal-sidebar">
                            <span class="ng-sidebar-label">Visual EQ</span>
                            <label class="ng-toggle-item"><input type="checkbox" id="ng-toggle-labels" ${hideLabels ? 'checked' : ''}> Hide Prefixes</label>
                            <label class="ng-toggle-item"><input type="checkbox" id="ng-toggle-orbs" ${hideOrbs ? 'checked' : ''}> Hide Orbs</label>
                            <label class="ng-toggle-item"><input type="checkbox" id="ng-toggle-gifted" ${muteGifted ? 'checked' : ''}> Mute Gifted</label>
                            <label class="ng-toggle-item"><input type="checkbox" id="ng-toggle-symmetric" ${symmetricDates ? 'checked' : ''}> Symmetry</label>
                            <label class="ng-toggle-item"><input type="checkbox" id="ng-toggle-desc" ${hideDesc ? 'checked' : ''}> Hide Desc</label>
                            <label class="ng-toggle-item"><input type="checkbox" id="ng-toggle-bread" ${minimalBread ? 'checked' : ''}> Min Bread</label>
                            <label class="ng-toggle-item"><input type="checkbox" id="ng-toggle-nav" ${minimalNav ? 'checked' : ''}> Min Nav</label>
                            <label class="ng-toggle-item"><input type="checkbox" id="ng-toggle-fade" ${fadedDetails ? 'checked' : ''}> Fade Details</label>
                            <span class="ng-sidebar-label">Quiet Mode</span>
                            <label class="ng-toggle-item"><input type="checkbox" id="ng-toggle-clean" ${cleanTitles ? 'checked' : ''}> Clean Titles</label>
                            <label class="ng-toggle-item"><input type="checkbox" id="ng-toggle-grey" ${greyTitles ? 'checked' : ''}> Grey Titles</label>
                            <label class="ng-toggle-item"><input type="checkbox" id="ng-toggle-black" ${deepBlack ? 'checked' : ''}> Deep Black</label>
                            <label class="ng-toggle-item"><input type="checkbox" id="ng-toggle-highlights" ${showHighlights ? 'checked' : ''}> Highlights</label>
                            <span class="ng-sidebar-label">Data Utility</span>
                            <div class="ng-data-btn" id="ng-btn-export">Export Data</div>
                            <div class="ng-data-btn" id="ng-btn-import">Import Data</div>
                        </div>
                        <div style="flex-grow:1; overflow-y:auto; padding: 20px;" id="ng-modal-grid"></div>
                    </div>
                </div>`;
            document.body.appendChild(overlay);
            document.getElementById('ng-toggle-labels').onchange = (e) => { hideLabels = e.target.checked; localStorage.setItem('ng_hide_labels', hideLabels); applyVisualToggles(); };
            document.getElementById('ng-toggle-orbs').onchange = (e) => { hideOrbs = e.target.checked; localStorage.setItem('ng_hide_orbs', hideOrbs); applyVisualToggles(); };
            document.getElementById('ng-toggle-gifted').onchange = (e) => { muteGifted = e.target.checked; localStorage.setItem('ng_mute_gifted', muteGifted); applyVisualToggles(); };
            document.getElementById('ng-toggle-symmetric').onchange = (e) => { symmetricDates = e.target.checked; localStorage.setItem('ng_symmetric_dates', symmetricDates); applyVisualToggles(); };
            document.getElementById('ng-toggle-desc').onchange = (e) => { hideDesc = e.target.checked; localStorage.setItem('ng_hide_desc', hideDesc); applyVisualToggles(); };
            document.getElementById('ng-toggle-bread').onchange = (e) => { minimalBread = e.target.checked; localStorage.setItem('ng_minimal_bread', minimalBread); applyVisualToggles(); };
            document.getElementById('ng-toggle-nav').onchange = (e) => { minimalNav = e.target.checked; localStorage.setItem('ng_minimal_nav', minimalNav); applyVisualToggles(); };
            document.getElementById('ng-toggle-fade').onchange = (e) => { fadedDetails = e.target.checked; localStorage.setItem('ng_faded_details', fadedDetails); applyVisualToggles(); };
            document.getElementById('ng-toggle-clean').onchange = (e) => { cleanTitles = e.target.checked; localStorage.setItem('ng_clean_titles', cleanTitles); applyVisualToggles(); };
            document.getElementById('ng-toggle-grey').onchange = (e) => { greyTitles = e.target.checked; localStorage.setItem('ng_grey_titles', greyTitles); applyVisualToggles(); };
            document.getElementById('ng-toggle-black').onchange = (e) => { deepBlack = e.target.checked; localStorage.setItem('ng_deep_black', deepBlack); applyVisualToggles(); };
            document.getElementById('ng-toggle-highlights').onchange = (e) => { showHighlights = e.target.checked; localStorage.setItem('ng_show_highlights', showHighlights); applyVisualToggles(); };
            document.getElementById('ng-btn-export').onclick = exportData;
            document.getElementById('ng-btn-import').onclick = importData;
        }
        const grid = document.getElementById('ng-modal-grid'); grid.innerHTML = '';
        const renderSection = (title, data, type) => {
            const h = document.createElement('div'); h.style.padding = '10px 0'; h.style.color = '#888'; h.innerText = title; grid.appendChild(h);
            Object.keys(data).sort((a,b)=>a.localeCompare(b)).forEach(user => {
                const row = document.createElement('div'); row.className = 'ng-modal-row';
                const remarkSpan = document.createElement('span'); remarkSpan.className = 'ng-editable-remark';
                remarkSpan.innerText = data[user].remark ? `"${data[user].remark}"` : '"Click to add note"';
                remarkSpan.onclick = () => {
                    const input = document.createElement('input'); input.className = 'ng-edit-input'; input.value = data[user].remark || "";
                    input.onblur = () => { data[user].remark = input.value; updateStorage(type, data); remarkSpan.innerText = input.value ? `"${input.value}"` : '"Click to add note"'; input.replaceWith(remarkSpan); };
                    input.onkeydown = (e) => { if (e.key === 'Enter') input.blur(); };
                    remarkSpan.replaceWith(input); input.focus();
                };
                row.innerHTML = `<span style="width: 150px;"><b>${user}</b></span>`;
                row.appendChild(remarkSpan);
                const del = document.createElement('span'); del.style.cursor='pointer'; del.style.color='gray'; del.innerText='✕';
                del.onclick = () => { delete data[user]; updateStorage(type, data); row.remove(); };
                row.appendChild(del);
                grid.appendChild(row);
            });
        };
        renderSection('BOOSTED', boostedData, 'boost'); renderSection('MUTED', mutedData, 'mute');
        overlay.style.display = 'flex';
    };

    window.closeControlPanel = () => { document.getElementById('ng-modal-overlay').style.display = 'none'; if (needsRefresh) location.reload(); };

    function runEQ() {
        if (isLocked) return; isLocked = true; injectStyles();
        let hub = document.getElementById('ng-management-hub');
        if (!hub) {
            const target = document.querySelector('.p-body-main');
            if (target) { hub = document.createElement('div'); hub.id = 'ng-management-hub'; target.parentNode.insertBefore(hub, target); }
        }

        document.querySelectorAll('.structItem--thread').forEach(thread => {
            const userAnchor = thread.querySelector('.structItem-minor li:first-child a.username') || thread.querySelector('.structItem-minor a[data-user-id]');
            if (userAnchor) {
                const user = userAnchor.innerText.trim();
                if (boostedData[user]) { thread.classList.add('ng-boosted-thread'); userAnchor.classList.add('ng-boosted-name'); }
                else if (mutedData[user]) { thread.classList.add('ng-muted-thread'); }
            }
        });

        document.querySelectorAll('.message:not(.ng-processed)').forEach(msg => {
            msg.classList.add('ng-processed');
            const nameEl = msg.querySelector('a[itemprop="name"]') || msg.querySelector('.username');
            const titleArea = msg.querySelector('.message-userTitle') || msg.querySelector('.userTitle');
            if (!nameEl || !titleArea) return;
            const user = nameEl.innerText.trim();
            const isM = !!mutedData[user], isB = !!boostedData[user];
            
            if (isM) {
                msg.style.display = 'none';
                const row = document.createElement('div'); row.className = 'ng-muted-row';
                row.innerHTML = `<span>Muted: <b>${user}</b> ("${mutedData[user].remark || ""}")</span><span style="cursor:pointer;" onclick="this.closest('.ng-muted-row').nextElementSibling.style.display='block'; this.remove();">[Show]</span>`;
                msg.parentNode.insertBefore(row, msg);
            }

            const cl = document.createElement('div'); cl.style.fontSize = '10px'; cl.style.opacity = '0.6';
            cl.innerHTML = `<span style="cursor:pointer;">${isM ? '[UM]' : '[M]'}</span> | <span style="cursor:pointer;">${isB ? '[UB]' : '[B]'}</span>`;
            cl.querySelectorAll('span')[0].onclick = () => { if (isM) delete mutedData[user]; else { const r = prompt("Reason?"); if (r !== null) mutedData[user] = { remark: r || "" }; else return; } updateStorage('mute', mutedData); location.reload(); };
            cl.querySelectorAll('span')[1].onclick = () => { if (isB) delete boostedData[user]; else { boostedData[user] = { remark: "" }; delete mutedData[user]; } updateStorage('boost', boostedData); location.reload(); };
            titleArea.parentNode.insertBefore(cl, titleArea.nextSibling);
        });

        if (hub) hub.innerHTML = `<div>NEOGAF EQ | Muted ${Object.keys(mutedData).length} | Boosted ${Object.keys(boostedData).length}</div><div><span onclick="window.openControlPanel()" style="cursor:pointer; color:gray;">[Control Panel]</span></div>`;
        setTimeout(() => { isLocked = false; }, 100);
    }

    const observer = new MutationObserver(runEQ);
    observer.observe(document.body, { childList: true, subtree: true });
    runEQ();
})();