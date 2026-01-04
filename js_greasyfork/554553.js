// ==UserScript==
// @name         Website SpeedHack by poule_trempee
// @namespace    http://tampermonkey.net/
// @version      1.3.7
// @description  SpeedHack/FastForward open/close GUI with [Inser]
// @author       poule_trempee
// @match        *://*/*
// @grant        none
// @license      Copyright (c) 2025 poule_trempee - All Rights Reserved
// @downloadURL https://update.greasyfork.org/scripts/554553/Website%20SpeedHack%20by%20poule_trempee.user.js
// @updateURL https://update.greasyfork.org/scripts/554553/Website%20SpeedHack%20by%20poule_trempee.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const TOGGLE_KEY = 'Insert';
    const DEFAULT_SPEED = 1.0;
    const MIN_SPEED = 0.1;
    const MAX_SPEED = 5.0;
    const STEP = 0.1;

    let currentSpeed = DEFAULT_SPEED;
    let enabled = false;

    function el(tag, props = {}, ...children) {
        const e = document.createElement(tag);
        for (const [k, v] of Object.entries(props)) {
            if (k === 'style') Object.assign(e.style, v);
            else if (k.startsWith('on') && typeof v === 'function') e.addEventListener(k.slice(2), v);
            else if (k === 'html') e.innerHTML = v;
            else e.setAttribute(k, v);
        }
        for (const c of children) {
            if (typeof c === 'string') e.appendChild(document.createTextNode(c));
            else if (c) e.appendChild(c);
        }
        return e;
    }

    const overlay = el('div', {
        id: 'ssc-overlay',
        style: {
            position: 'fixed',
            right: '20px',
            top: '20px',
            width: '360px',
            background: 'rgba(30,30,40,0.95)',
            color: '#fff',
            padding: '12px',
            borderRadius: '12px',
            boxShadow: '0 6px 24px rgba(0,0,0,0.6)',
            zIndex: 2147483647,
            fontFamily: 'Segoe UI, Roboto, Arial, sans-serif',
            display: 'none'
        }
    });

    // Titre cliquable
    const title = el('a', {
        href: 'https://guns.lol/poule_trempee',
        target: '_blank',
        style: { fontSize: '16px', fontWeight: '700', marginBottom: '8px', color: '#FFD700', textDecoration: 'none', display: 'block' }
    }, 'Website SpeedHack by poule_trempee');

    const line = el('div', { style: { fontSize: '12px', marginBottom: '8px', opacity: 0.9 } }, `Open/Close : [${TOGGLE_KEY}]`);

    const toggleRow = el('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' } });
    const toggleLabel = el('div', { style: { fontSize: '13px' } }, 'Activer');
    const toggleBtn = el('button', { style: { padding: '6px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '700', background: '#7a0b0b', color: '#fff' } }, 'OFF');
    toggleRow.appendChild(toggleLabel);
    toggleRow.appendChild(toggleBtn);

    const valueRow = el('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' } });
    valueRow.appendChild(el('div', {}, 'Vitesse'));
    const speedBadge = el('div', { style: { fontWeight: '700', color: '#0ff' } }, String(DEFAULT_SPEED));
    valueRow.appendChild(speedBadge);

    const inputRow = el('div', { style: { display: 'flex', flexDirection: 'column', marginBottom: '6px', gap: '4px' } });
    const speedInput = el('input', {
        type: 'number',
        min: '0',
        step: '0.1',
        value: String(DEFAULT_SPEED),
        style: { width: '100%', padding: '6px', borderRadius: '6px', border: '1px solid #888', background: '#222', color: '#0ff', fontWeight: '700' }
    });
    inputRow.appendChild(speedInput);

    const slider = el('input', { type: 'range', min: String(MIN_SPEED), max: String(MAX_SPEED), step: String(STEP), value: String(DEFAULT_SPEED), style: { width: '100%', marginBottom: '10px' } });
    const applyBtn = el('button', { style: { width: '100%', padding: '8px 10px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '700', background: '#2b2b2b', color: '#fff' } }, 'Apply');
    const hint = el('div', { style: { fontSize: '11px', marginTop: '8px', opacity: 0.8 } }, 'API JS : window.siteSpeedController');

    overlay.append(title, line, toggleRow, valueRow, inputRow, slider, applyBtn, hint);

    // PDP en bas
    const pdpContainer = el('a', {
        href: 'https://guns.lol/poule_trempee',
        target: '_blank',
        style: { display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px', textDecoration: 'none' }
    });
    const pdpImg = el('img', { src: 'https://i.imgur.com/LV4w5c4.png', style: { width: '36px', height: '36px', borderRadius: '50%', border: '2px solid #0ff' } });
    const pdpName = el('div', { style: { color: '#0ff', fontWeight: '700', fontSize: '14px' } }, 'poule_trempee');
    pdpContainer.append(pdpImg, pdpName);
    overlay.appendChild(pdpContainer);

    document.body.appendChild(overlay);

    function applyToMedia(speed) { document.querySelectorAll('video,audio').forEach(m => { try { m.playbackRate = speed } catch { } }); }
    function restoreMedia() { document.querySelectorAll('video,audio').forEach(m => { try { m.playbackRate = 1 } catch { } }); }
    function applyAll(speed) { applyToMedia(speed); }
    function restoreAll() { restoreMedia(); }

    function attachVideoListeners(video) {
        if (!video || video.dataset.sscListenerAttached) return;
        video.dataset.sscListenerAttached = '1';
        const applyIfEnabled = () => { if (enabled) try { video.playbackRate = currentSpeed } catch { } };
        video.addEventListener('play', applyIfEnabled);
        video.addEventListener('loadedmetadata', applyIfEnabled);
    }
    function attachExistingVideos() { document.querySelectorAll('video').forEach(v => attachVideoListeners(v)); }

    const observer = new MutationObserver(mutations => {
        for (const m of mutations) {
            for (const node of m.addedNodes) {
                if (node.tagName && node.tagName.toLowerCase() === 'video') { attachVideoListeners(node); if (enabled) applyAll(currentSpeed); }
                if (node.querySelectorAll) { node.querySelectorAll('video').forEach(v => { attachVideoListeners(v); if (enabled) applyAll(currentSpeed); }); }
            }
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    toggleBtn.onclick = () => { enabled = !enabled; toggleBtn.textContent = enabled ? 'ON' : 'OFF'; toggleBtn.style.background = enabled ? '#1a7f00' : '#7a0b0b'; if (enabled) applyAll(currentSpeed); else restoreAll(); };
    slider.oninput = (e) => { const v = parseFloat(e.target.value); speedBadge.textContent = v.toFixed(1); speedInput.value = v.toFixed(1); currentSpeed = v; if (enabled) applyAll(v); };
    speedInput.oninput = (e) => { let v = parseFloat(e.target.value) || 0; if (v > MAX_SPEED) v = MAX_SPEED; slider.value = v; speedBadge.textContent = v.toFixed(1); currentSpeed = v; if (enabled) applyAll(v); };
    applyBtn.onclick = () => { const v = parseFloat(speedInput.value) || DEFAULT_SPEED; currentSpeed = v; if (enabled) applyAll(v); applyBtn.textContent = 'Applied ✓'; setTimeout(() => applyBtn.textContent = 'Apply', 800); };

    let visible = false;
    document.addEventListener('keydown', (ev) => { if (ev.key === TOGGLE_KEY) { visible = !visible; overlay.style.display = visible ? 'block' : 'none'; ev.preventDefault(); } });

    attachExistingVideos();
})();
