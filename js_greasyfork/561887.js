// ==UserScript==
// @name         NeoGAF Project Zero
// @namespace    http://tampermonkey.net/
// @version      0.9.23
// @description  NeoGAF EQ
// @author       bj00rn & Gemini
// @match        https://www.neogaf.com/*
// @license      MIT
// @homepageURL  https://greasyfork.org/en/scripts/561887-neogaf-project-zero
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561887/NeoGAF%20Project%20Zero.user.js
// @updateURL https://update.greasyfork.org/scripts/561887/NeoGAF%20Project%20Zero.meta.js
// ==/UserScript==
 
/*
 * MIT License
 * Copyright (c) 2025 bj00rn
 */

(function() {
    'use strict';

    const loadM = () => JSON.parse(localStorage.getItem('ng_muted') || "{}");
    const loadB = () => JSON.parse(localStorage.getItem('ng_boosted') || "{}");
    const saveD = (k, v) => localStorage.setItem(k, JSON.stringify(v));
    const getS = (k) => localStorage.getItem(k) === 'true';

    // --- 1. CORE ENGINE (CSS) ---
    const style = document.createElement('style');
    style.id = 'ng-core-styles';
    style.innerHTML = `
        /* OLED BASE */
        html, body, .p-pageWrapper, .p-body, .block-container { background-color: #0a0a0a !important; color: #aaa !important; }
        .p-header, .p-nav, .p-sectionLinks, .p-footer { background: #0d0d0d !important; border-bottom: 1px solid #1a1a1a !important; }
        .structItem, .message { background: #0d0d0d !important; border: 1px solid #1a1a1a !important; position: relative !important; }
        .structItem-title a, .p-title-value { color: #4881ad !important; text-decoration: none !important; }

        /* MENU NEUTRALIZER */
        .p-navgroup-link, .p-navgroup-link.badgeContainer, .p-navgroup-link--iconic, .p-nav-list .p-navEl, .p-nav-list .p-navEl-link, .p-nav-list .p-navEl.is-selected {
            background: transparent !important; background-color: transparent !important; border: none !important; box-shadow: none !important; outline: none !important;
        }
        .p-navgroup-link:hover, .p-navEl:hover { background: rgba(255,255,255,0.05) !important; }

        /* SILENCE ENGINE */
        .ng-is-hidden { display: none !important; }
        .ng-force-visible { display: block !important; visibility: visible !important; opacity: 1 !important; height: auto !important; }
        .bbCodeBlock--quote { border-left: 3px solid #1a1a1a !important; background: #080808 !important; margin: 5px 0 !important; }
        .ng-quote-placeholder { font-size: 11px; padding: 8px 15px; border: 1px solid #221111; background: #0d0808; border-radius: 3px; display: flex; justify-content: space-between; align-items: center; color: #885555; }
        .ng-mute-placeholder { background: #111; border: 1px solid #222; padding: 10px 15px; margin: 5px 0; font-size: 12px; color: #888; display: flex; justify-content: space-between; align-items: center; border-radius: 4px; }

        /* ROW NEUTRALIZATION */
        .structItem.is-mod-highlight, .structItem.is-highlighted, .structItem.structItem--thread.is-prefix64, .structItemContainer-group--sticky .structItem, .structItem.is-unread {
            background-color: transparent !important; background-image: none !important; border-top: 1px solid #1a1a1a !important;
        }

        /* HOVERS & BREADCRUMBS */
        .structItem-title a:hover, .p-breadcrumbs li a:hover, .p-title-value:hover { color: #b36b24 !important; text-decoration: none !important; }
        .p-breadcrumbs > li { border-color: #b36b24 !important; }

        /* WATCHED & BOOST HIGHLIGHTS */
        .ng-watched-thread { border-left: 3px solid #4881ad !important; }
        .message.ng-boost-edge { border-left: 3px solid #28a745 !important; }

        /* M|B BUTTONS */
        .ng-action-container { display: flex; justify-content: center; align-items: center; gap: 4px; margin-top: 8px; color: #444; font-size: 12px; }
        .ng-action-btn { color: #777 !important; font-weight: bold; text-decoration: none !important; font-size: 12px !important; padding: 2px 4px !important; background: transparent !important; border: none !important; transition: color 0.1s ease; }
        .ng-action-btn[data-action="mute"]:hover { color: #cc3333 !important; }
        .ng-action-btn[data-action="boost"]:hover { color: #58b971 !important; }

        /* USER PAINTING */
        a.username[data-ng-status="boosted"] { color: #58b971 !important; -webkit-text-fill-color: #58b971 !important; }
        a.username[data-ng-status="muted"] { color: #cc3333 !important; -webkit-text-fill-color: #cc3333 !important; }
        a.username { color: #bbbbbb !important; font-weight: bold; -webkit-text-fill-color: #bbbbbb !important; }

        /* EQ EQUALIZER (Visibility) */
        .ng-hide-labels .label { display: none !important; }
        .ng-hide-orbs .structItem-cell--icon, .ng-hide-orbs .structItem-status, .ng-hide-orbs .structItem-statuses { display: none !important; }
        .ng-hide-meta .structItem-cell--meta, .ng-hide-meta .p-description, .ng-hide-meta .structItem-minor > li:not(.structItem-parts) { display: none !important; }

        /* HUB & UI */
        #ng-hub { background: #141414; border: 1px solid #222; padding: 12px 18px; margin: 10px 0; font-family: monospace; font-size: 12px; color: #888; border-radius: 4px; border-left: 3px solid #4881ad; }
        #ng-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.95); z-index: 999999; display: flex; align-items: center; justify-content: center; display: none; }
        #ng-window { background:#111; border:1px solid #333; width: 850px; height: 650px; display: flex; border-radius: 4px; overflow: hidden; border-top: 3px solid #4881ad; }
        .ng-btn { cursor: pointer !important; }
        .ng-input { background: #000; border: 1px solid #333; color: #ccc; padding: 8px; font-size: 12px; width: 380px; font-family: monospace; }
        .ng-reg-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #1a1a1a; }
        .ng-del-btn { color: #cc3333 !important; margin-left: 20px; font-size: 16px !important; line-height: 1 !important; display: inline-flex; align-items: center; height: 30px; }
    `;
    document.documentElement.appendChild(style);

    const applyEQ = () => {
        const root = document.documentElement;
        root.classList.toggle('ng-hide-labels', getS('ng_labels'));
        root.classList.toggle('ng-hide-orbs', getS('ng_orbs'));
        root.classList.toggle('ng-hide-meta', getS('ng_meta'));
    };
    applyEQ();

    const pulse = () => {
        if (!document.body || document.getElementById('ng-overlay')?.style.display === 'flex') return;
        const [mD, bD] = [loadM(), loadB()];

        let hub = document.getElementById('ng-hub');
        if (!hub) {
            const t = document.querySelector('.p-body-main');
            if (t) { hub = document.createElement('div'); hub.id = 'ng-hub'; t.parentNode.insertBefore(hub, t); }
        }
        if (hub) hub.innerHTML = `PROJECT ZERO | <span class="ng-btn" data-action="openCP" style="color:#4881ad">CONTROL PANEL</span> | M: ${Object.keys(mD).length} | B: ${Object.keys(bD).length}`;

        document.querySelectorAll('.structItem--thread').forEach(thread => {
            if (thread.querySelector('.structItem-status--watched')) thread.classList.add('ng-watched-thread');
            else thread.classList.remove('ng-watched-thread');
        });

        document.querySelectorAll('a.username').forEach(uLink => {
            const u = uLink.innerText.trim();
            if (bD[u]) uLink.setAttribute('data-ng-status', 'boosted');
            else if (mD[u]) uLink.setAttribute('data-ng-status', 'muted');
            else uLink.removeAttribute('data-ng-status');
        });

        document.querySelectorAll('.bbCodeBlock--quote:not(.ng-quote-ok)').forEach(q => {
            let user = q.getAttribute('data-quote')?.split(',')[0].trim();
            if (user && mD[user]) {
                const content = q.querySelector('.bbCodeBlock-content');
                if (content && !q.querySelector('.ng-quote-placeholder')) {
                    content.classList.add('ng-is-hidden');
                    const ph = document.createElement('div'); ph.className = 'ng-quote-placeholder';
                    ph.innerHTML = `<span>Scrubbed Quote: <b>${user}</b></span> <span class="ng-btn" data-action="t-q" style="color:#4881ad">[Peek]</span>`;
                    content.parentNode.insertBefore(ph, content);
                }
            }
            q.classList.add('ng-quote-ok');
        });

        document.querySelectorAll('.message:not(.ng-ok)').forEach(msg => {
            const uEl = msg.querySelector('.username'), tA = msg.querySelector('.message-userTitle, .userTitle');
            if (!uEl) return;
            const u = uEl.innerText.trim();
            if (bD[u]) msg.classList.add('ng-boost-edge');
            if (tA && !msg.querySelector('.ng-action-container')) {
                const c = document.createElement('div'); c.className = 'ng-action-container';
                c.innerHTML = `<span class="ng-btn ng-action-btn" data-action="mute" data-u="${u}">[M]</span><span>|</span><span class="ng-btn ng-action-btn" data-action="boost" data-u="${u}">[B]</span>`;
                tA.parentNode.insertBefore(c, tA.nextSibling);
            }
            if (mD[u]) {
                msg.classList.add('ng-is-hidden');
                if (!msg.previousElementSibling?.classList.contains('ng-mute-placeholder')) {
                    const ph = document.createElement('div'); ph.className = 'ng-mute-placeholder';
                    const reason = mD[u].reason ? ` — ${mD[u].reason}` : "";
                    ph.innerHTML = `<span>Muted: <b>${u}</b>${reason}</span><div><span class="ng-btn" data-action="t-m" style="color:#4881ad">[Show]</span> | <span class="ng-btn" data-action="mute" data-u="${u}" style="color:#4881ad">[Unmute]</span></div>`;
                    msg.parentNode.insertBefore(ph, msg);
                }
            }
            msg.classList.add('ng-ok');
        });
    };

    document.addEventListener('click', (e) => {
        // --- EQ TOGGLE FIX ---
        if (e.target.classList.contains('ng-eq-check')) {
            localStorage.setItem(e.target.getAttribute('data-k'), e.target.checked);
            applyEQ();
            return;
        }

        const btn = e.target.closest('.ng-btn');
        if (!btn) return;
        const a = btn.getAttribute('data-action'), u = btn.getAttribute('data-u'), t = btn.getAttribute('data-t');

        if (a === 't-q') {
            const c = btn.closest('.bbCodeBlock--quote').querySelector('.bbCodeBlock-content');
            c.classList.toggle('ng-force-visible'); btn.innerText = c.classList.contains('ng-force-visible') ? '[Hide]' : '[Peek]'; return;
        }
        if (a === 't-m') {
            const m = btn.closest('.ng-mute-placeholder').nextElementSibling;
            m.classList.toggle('ng-force-visible'); btn.innerText = m.classList.contains('ng-force-visible') ? '[Hide]' : '[Show]'; return;
        }
        if (a === 'openCP') {
            let over = document.getElementById('ng-overlay') || document.createElement('div');
            over.id = 'ng-overlay'; document.body.appendChild(over);
            const [mD, bD] = [loadM(), loadB()];
            const row = (user, data, type) => `<div class="ng-reg-row"><span style="color:${type === 'b' ? '#58b971' : '#cc3333'}; min-width:140px; font-weight:bold; font-size:13px;">${user}</span><div style="display:flex; align-items:center;"><input type="text" class="ng-input ng-edit" data-u="${user}" data-t="${type}" value="${type === 'b' ? (data.note || '') : (data.reason || '')}"><span class="ng-btn ng-del-btn" data-action="del" data-u="${user}" data-t="${type}">✕</span></div></div>`;
            over.innerHTML = `<div id="ng-window">
                <div style="width:240px; background:#050505; border-right:1px solid #222; padding:25px; display:flex; flex-direction:column; gap:20px;">
                    <b style="color:#444; font-size:11px;">PROJECT ZERO</b><hr style="border:0; border-top:1px dotted #222;">
                    <label style="font-size:12px; color:#aaa; cursor:pointer;"><input type="checkbox" class="ng-eq-check" data-k="ng_labels" ${getS('ng_labels')?'checked':''}> Hide Prefixes</label>
                    <label style="font-size:12px; color:#aaa; cursor:pointer;"><input type="checkbox" class="ng-eq-check" data-k="ng_orbs" ${getS('ng_orbs')?'checked':''}> Hide Orbs</label>
                    <label style="font-size:12px; color:#aaa; cursor:pointer;"><input type="checkbox" class="ng-eq-check" data-k="ng_meta" ${getS('ng_meta')?'checked':''}> Hide Meta</label>
                    <hr style="border:0; border-top:1px dotted #222;">
                    <div class="ng-btn" data-action="download" style="font-size:12px; color:#58b971 !important;">[↓] BACKUP</div>
                    <div class="ng-btn" data-action="restore" style="font-size:12px; color:#d4af37 !important;">[↑] RESTORE</div>
                    <div class="ng-btn" data-action="save" style="background:#cc3333; color:white !important; text-align:center; padding:12px; border-radius:3px; margin-top:auto; font-weight:bold;">REFRESH</div>
                    <div class="ng-btn" data-action="close" style="text-align:center; color:#555; font-size:11px;">[CLOSE]</div>
                </div>
                <div style="flex-grow:1; padding:35px; overflow-y:auto; background:#0a0a0a;">
                    <div class="ng-reg-header">BOOSTED USERS</div><div style="margin-bottom:35px;">${Object.keys(bD).sort().map(u => row(u, bD[u], 'b')).join('') || 'None'}</div>
                    <div class="ng-reg-header">MUTED USERS</div><div>${Object.keys(mD).sort().map(u => row(u, mD[u], 'm')).join('') || 'None'}</div>
                </div>
            </div>`;
            over.style.display = 'flex';
        }
        if (a === 'download') {
            const data = { m: loadM(), b: loadB() };
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url; link.download = `pz-registry-${new Date().toISOString().split('T')[0]}.json`;
            link.click(); URL.revokeObjectURL(url);
        }
        if (a === 'restore') {
            const input = document.createElement('input'); input.type = 'file'; input.accept = '.json';
            input.onchange = (ev) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const content = JSON.parse(e.target.result);
                    if (content.m) saveD('ng_muted', content.m); if (content.b) saveD('ng_boosted', content.b);
                    location.reload();
                };
                reader.readAsText(ev.target.files[0]);
            };
            input.click();
        }
        if (a === 'close') document.getElementById('ng-overlay').style.display = 'none';
        if (a === 'save') location.reload();
        if (a === 'del') {
            let d = (t === 'm' ? loadM() : loadB());
            delete d[u]; saveD(t === 'm' ? 'ng_muted' : 'ng_boosted', d);
            btn.closest('.ng-reg-row').remove();
        }
        if (a === 'mute' || a === 'boost') {
            let m = loadM(), b = loadB();
            if (a === 'mute') { if (m[u]) delete m[u]; else { const r = prompt("Reason?"); if (r !== null) { m[u]={reason:r}; delete b[u]; } } }
            else { if (b[u]) delete b[u]; else { b[u]={note:""}; delete m[u]; } }
            saveD('ng_muted', m); saveD('ng_boosted', b); location.reload();
        }
    });

    document.addEventListener('input', (e) => {
        if (e.target.classList.contains('ng-edit')) {
            const u = e.target.getAttribute('data-u'), t = e.target.getAttribute('data-t');
            let d = (t === 'm' ? loadM() : loadB());
            if (t === 'm') d[u].reason = e.target.value; else d[u].note = e.target.value;
            saveD(t === 'm' ? 'ng_muted' : 'ng_boosted', d);
        }
    });

    setInterval(pulse, 1000);
})();