// ==UserScript==
// @name         Hentai.tv Downloader
// @namespace    HentaiCat
// @version      0.2
// @description  Downloads videos from hentai.tv and nhplayer.com
// @author       Cat-Ling
// @license      MIT
// @match        https://hentai.tv/hentai/*
// @match        https://nhplayer.com/*
// @run-at       document-start
// @grant        none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/561646/Hentaitv%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/561646/Hentaitv%20Downloader.meta.js
// ==/UserScript==

(() => {
    'use strict';

    const { hostname, pathname } = window.location;

    // -- UI Helpers --
    const createBtn = (txt, cls, onClick) => {
        const b = document.createElement('button');
        b.className = `btn ${cls} text-white uppercase font-bold text-sm px-4 py-2 rounded shadow-md hover:shadow-lg transition mr-2 mb-2`;
        b.textContent = txt;
        b.type = 'button';
        Object.assign(b.style, { cursor: 'pointer', touchAction: 'manipulation' });
        b.onclick = e => { e.preventDefault(); e.stopPropagation(); onClick(); };
        return b;
    };

    const overlay = (msg, color) => {
        let el = document.getElementById('nv-status');
        if (!el) {
            // inject overlay if missing
            const root = document.body || document.documentElement;
            if (!root) return false;
            
            const div = document.createElement('div');
            div.id = 'nv-ovl';
            Object.assign(div.style, {
                position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                backgroundColor: '#111', color: '#eee', zIndex: 2147483647,
                display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
                fontFamily: 'monospace', textAlign: 'center'
            });
            div.innerHTML = `<h2>Processing...</h2><div id="nv-status" style="color:#888;">Init...</div>`;
            root.appendChild(div);
            el = document.getElementById('nv-status');
        }
        if (msg) { el.textContent = msg; if(color) el.style.color = color; }
        return true;
    };

    // -- Hentai.tv Module --
    if (hostname.includes('hentai.tv')) {
        let found = false;

        // main loop: watch for dom changes to catch the iframe
        const obs = new MutationObserver((_, o) => {
            const h1 = document.querySelector('h1.text-lg');
            if (!h1) return;

            // inject button container if needed
            let wrap = document.getElementById('nv-controls');
            if (!wrap) {
                wrap = document.createElement('div');
                wrap.id = 'nv-controls';
                wrap.className = 'mt-4 mb-4 flex flex-wrap';
                h1.parentNode.insertBefore(wrap, h1.nextSibling);
            }

            const slug = pathname.split('/').filter(Boolean).pop();
            const box = document.querySelector('.aspect-video');
            const frame = box ? box.querySelector('iframe') : null;

            // btn 1: predicitive url (always works unless they change cdn)
            if (slug && !document.getElementById('nv-s1')) {
                const url = `https://r2.1hanime.com/${slug.replace('-episode', '')}.mp4?12`;
                const b = createBtn('📥 Source 1 (Static)', 'bg-red-600 hover:bg-red-500', () => location.href = url);
                b.id = 'nv-s1';
                wrap.appendChild(b);
            }

            // btn 2: grab from iframe src
            if (frame && !document.getElementById('nv-s2')) {
                const b = createBtn('📥 Source 2 (Player)', 'bg-gold-500 hover:bg-gold-400', () => window.open(frame.src, '_blank'));
                b.id = 'nv-s2';
                wrap.appendChild(b);
                
                // we got what we came for, kill the observer
                found = true;
                o.disconnect();
            }
        });

        obs.observe(document, { childList: true, subtree: true });

        // safety net: if site is lagging or iframe fails to render, force the fix
        setTimeout(() => {
            if (found) return;
            
            obs.disconnect(); // stop watching, its hopeless
            
            // manually inject video player if the iframe never showed up
            const box = document.querySelector('.aspect-video');
            const slug = pathname.split('/').filter(Boolean).pop();
            
            if (box && !box.querySelector('iframe') && slug) {
                // console.log('NV: forcing native player');
                const url = `https://r2.1hanime.com/${slug.replace('-episode', '')}.mp4?12`;
                if (!box.querySelector('video')) {
                    box.innerHTML = `<video src="${url}" controls style="width:100%;height:100%;background:#000" playsinline></video>`;
                }
            }
        }, 2500);
    }

    // -- NHPlayer Module --
    else if (hostname.includes('nhplayer.com')) {
        let locked = false;

        // keep trying to resolve the stream
        const check = () => {
            if (locked) return;
            if (!overlay()) return;

            // find the hidden url param
            const li = document.querySelector('.servers li[data-id*="u="]');
            const fr = document.querySelector('iframe[src*="u="]');
            
            let raw = null;
            if (li) raw = li.getAttribute('data-id');
            else if (fr) raw = fr.getAttribute('src');

            if (raw) {
                locked = true;
                try {
                    // url is base64 encoded inside 'u' param
                    const p = new URLSearchParams(raw.includes('?') ? raw.split('?')[1] : raw);
                    const url = atob(p.get('u'));
                    
                    overlay(`Redirecting: ${url.split('/').pop()}`, '#4ade80');
                    location.replace(url);
                } catch (err) {
                    overlay('Decode failed', '#ef4444');
                    locked = false; // let it retry just in case
                }
            }
        };

        // aggressive polling at start
        const timer = setInterval(check, 50);

        // stop polling after 5s so we dont burn cpu
        setTimeout(() => {
            clearInterval(timer);
            if (!locked) {
                overlay('Retrying...', '#fbbf24');
                // one last hail mary
                setTimeout(() => {
                    check();
                    if (!locked) overlay('No source found.', '#ef4444');
                }, 2000);
            }
        }, 5000);
    }
})();
