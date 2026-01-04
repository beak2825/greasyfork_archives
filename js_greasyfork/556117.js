// ==UserScript==
// @name         key crusher userscript 
// @namespace    http://tampermonkey.net/
// @version      3.4
// @description   does his work
// @author       Nytralis
// @match        *://*/*
// @grant        GM_setClipboard
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/556117/key%20crusher%20userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/556117/key%20crusher%20userscript.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const isKeyCrusher = location.hostname.includes('keycrusher.xyz');
    const keywords = ['auth', 'plato', 'boost', 'bstshrt'];

    // === BOUTON FLOTTANT (partout sauf keycrusher) ===
    if (!isKeyCrusher) {
        if (!window.name || !window.name.trim()) window.name = location.href;

        const btn = document.createElement('div');
        btn.innerHTML = '🔗';
        btn.title = 'Copier URL + aller sur keycrusher.xyz';
        btn.style.cssText = `
            position:fixed !important;top:12px !important;left:12px !important;z-index:999999 !important;
            width:44px !important;height:44px !important;display:flex !important;align-items:center !important;
            justify-content:center !important;font-size:22px !important;cursor:pointer !important;
            background:rgba(255,255,255,0.15) !important;border-radius:14px !important;
            backdrop-filter:blur(12px) !important;border:1px solid rgba(255,255,255,0.3) !important;
            color:#fff !important;box-shadow:0 4px 15px rgba(0,0,0,0.2) !important;
            transition:all .25s ease !important;
        `;
        btn.onmouseenter = () => btn.style.transform = 'scale(1.15)';
        btn.onmouseleave = () => btn.style.transform = 'scale(1)';
        btn.onclick = () => {
            if (typeof GM_setClipboard === 'function') GM_setClipboard(location.href);
            else navigator.clipboard?.writeText(location.href);
            location.replace('https://keycrusher.xyz/');
        };
        const inject = () => document.body ? document.body.appendChild(btn) : requestAnimationFrame(inject);
        inject();
    }

    // === REDIRECTION AUTO ===
    if (!isKeyCrusher && keywords.some(k => location.href.toLowerCase().includes(k))) {
        if (typeof GM_setClipboard === 'function') GM_setClipboard(location.href);
        else navigator.clipboard?.writeText(location.href);
        location.replace('https://keycrusher.xyz/');
        return;
    }

    // === KEYCRUSHER.XYZ ===
    if (isKeyCrusher) {
        const url = (window.name || '').trim() || 'https://google.com/';

        // Remplissage ultra-agressif
        const fillAll = () => {
            document.querySelectorAll('input, textarea, [contenteditable], [contenteditable="true"]')
                .forEach(el => {
                    if (el.offsetParent === null) return; // caché
                    if (el.disabled || el.readOnly) return;

                    try { el.value = url; } catch(e) {}
                    el.innerText = url;
                    el.textContent = url;

                    ['input', 'change', 'keydown', 'keyup', 'paste', 'focus'].forEach(ev =>
                        el.dispatchEvent(new Event(ev, { bubbles: true, cancelable: true }))
                    );
                });
        };

        // Clique TOUS les éléments contenant "bypass" (même div CSS cliquables)
        let bypassDone = false;
        const clickAllBypass = () => {
            if (bypassDone) return;
            let clicked = 0;
            document.querySelectorAll('*').forEach(el => {
                const txt = (el.textContent || el.innerText || el.ariaLabel || '').toLowerCase();
                if (txt.includes('bypass') && el.offsetParent !== null && el.offsetWidth > 0 && el.offsetHeight > 0) {
                    el.click();
                    clicked++;
                }
            });
            if (clicked > 0) bypassDone = true;
        };

        // Copy Text auto
        let copyDone = false;
        const clickCopy = () => {
            if (copyDone) return;
            document.querySelectorAll('*').forEach(el => {
                const txt = (el.textContent || el.innerText || '').toLowerCase();
                if ((txt.includes('copy text') || txt.includes('copytext')) && el.offsetParent !== null) {
                    el.click();
                    setTimeout(() => el.click(), 300);
                    copyDone = true;
                }
            });
        };

        const loop = () => {
            fillAll();
            if (!bypassDone) {
                setTimeout(clickAllBypass, 5000);
            }
            clickCopy();
        };

        setTimeout(loop, 800);
        setInterval(loop, 1200);

        // Indicateur
        const panel = document.createElement('div');
        panel.textContent = 'KEYCRUSHER 100%';
        panel.style.cssText = 'position:fixed;bottom:10px;left:10px;z-index:999999;background:#000;color:#0f0;padding:12px;border-radius:10px;font-family:monospace;font-weight:bold;';
        document.body.appendChild(panel);
    }
})();