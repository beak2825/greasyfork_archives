// ==UserScript==
// @name         Hentai.tv Downloader
// @namespace   HentaiCat 
// @version      0.1
// @description  Downloads videos from hentai.tv and nhplayer.com
// @author       Cat-Ling
// @license      MIT
// @match        https://hentai.tv/hentai/*
// @match        https://nhplayer.com/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561646/Hentaitv%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/561646/Hentaitv%20Downloader.meta.js
// ==/UserScript==

(() => {
    'use strict';

    const { hostname, pathname } = window.location;

    // --- Core: UI Utilities ---
    const createBtn = (label, theme, fn) => {
        const b = document.createElement('button');
        b.className = `btn ${theme} text-white uppercase font-bold text-sm px-4 py-2 rounded shadow-md hover:shadow-lg transition mr-2 mb-2`;
        b.textContent = label;
        b.type = 'button';
        Object.assign(b.style, { cursor: 'pointer', touchAction: 'manipulation' });
        b.onclick = e => { e.preventDefault(); e.stopPropagation(); fn(); };
        return b;
    };

    const injectOverlay = () => {
        if (document.getElementById('nv-ovl')) return;
        const root = document.body || document.documentElement;
        if (!root) return false;

        const ovl = document.createElement('div');
        ovl.id = 'nv-ovl';
        Object.assign(ovl.style, {
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            backgroundColor: '#111', color: '#eee', zIndex: 2147483647,
            display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
            fontFamily: 'system-ui, sans-serif', textAlign: 'center'
        });
        ovl.innerHTML = `<h2 style="margin-bottom:1rem">Processing Source...</h2><div id="nv-status" style="color:#888;font-family:monospace;font-size:12px">Resolving stream</div>`;
        root.appendChild(ovl);
        return true;
    };

    const updateOverlay = (msg, color = '#eee') => {
        const el = document.getElementById('nv-status');
        if (el) { el.textContent = msg; el.style.color = color; }
    };

    // --- Module: Hentai.tv ---
    if (hostname.includes('hentai.tv')) {
        const init = () => {
            const title = document.querySelector('h1.text-lg');
            if (!title || document.getElementById('nv-controls')) return;

            const wrap = document.createElement('div');
            wrap.id = 'nv-controls';
            wrap.className = 'mt-4 mb-4 flex flex-wrap';

            const slug = pathname.split('/').filter(Boolean).pop();
            const container = document.querySelector('.aspect-video');
            const frame = container ? container.querySelector('iframe') : null;

            if (slug) {
                const mp4 = `https://r2.1hanime.com/${slug.replace('-episode', '')}.mp4?12`;
                
                wrap.appendChild(createBtn('📥 Source 1 (Predicted)', 'bg-red-600 hover:bg-red-500', () => location.href = mp4));

                // Patch: Inject native player if iframe is missing
                if (container && !frame) {
                    container.innerHTML = `<video src="${mp4}" controls style="width:100%;height:100%;background:#000" playsinline webkit-playsinline></video>`;
                }
            }

            if (frame) {
                wrap.appendChild(createBtn('📥 Source 2 (Player)', 'bg-gold-500 hover:bg-gold-400', () => window.open(frame.src, '_blank')));
            }

            title.parentNode.insertBefore(wrap, title.nextSibling);
        };

        const obs = new MutationObserver((_, o) => {
            if (document.querySelector('h1.text-lg')) {
                init();
                o.disconnect();
            }
        });
        obs.observe(document, { childList: true, subtree: true });
        if (document.readyState !== 'loading') init();
    }

    // --- Module: NHPlayer ---
    else if (hostname.includes('nhplayer.com')) {
        let locked = false;
        
        const resolve = () => {
            if (locked) return;
            if (!injectOverlay()) return;

            let raw = null;
            const li = document.querySelector('.servers li[data-id*="u="]');
            const fr = document.querySelector('iframe[src*="u="]');

            if (li) raw = new URLSearchParams(li.getAttribute('data-id').split('?')[1]).get('u');
            else if (fr) raw = new URLSearchParams(fr.getAttribute('src').split('?')[1]).get('u');

            if (raw) {
                locked = true;
                try {
                    const url = atob(raw);
                    updateOverlay(`Redirecting: ${url.split('/').pop()}`, '#4ade80');
                    location.replace(url);
                } catch (e) {
                    updateOverlay('Decode Error', '#ef4444');
                    locked = false;
                }
            }
        };

        const tick = setInterval(resolve, 50);
        
        setTimeout(() => {
            clearInterval(tick);
            if (!locked && document.getElementById('nv-ovl')) {
                updateOverlay('Source not detected.', '#fbbf24');
                const close = document.createElement('button');
                close.textContent = 'Close Overlay';
                Object.assign(close.style, { marginTop: '20px', padding: '8px 16px', background: '#333', color: '#fff', border: '1px solid #555', borderRadius: '4px' });
                close.onclick = () => document.getElementById('nv-ovl').remove();
                document.getElementById('nv-status').appendChild(document.createElement('br'));
                document.getElementById('nv-status').appendChild(close);
            }
        }, 5000);
    }
})();
