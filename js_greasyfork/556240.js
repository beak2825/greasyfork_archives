// ==UserScript==
// @name         anime-sama Plus
// @namespace    http://tampermonkey.net/
// @version      0.1.5
// @description  Sauvegarde/restauration chiffrée du profil (.sama) + Next/Prev auto & contrôles clavier adaptatifs
// @author       MASTERD
// @include      /^https?\:\/\/.*\.anime-sama\..*\/.*$/
// @include      /^https?\:\/\/.*\anime-sama\..*\/.*$/
// @match        *://*.dingtezuni.com/*
// @match        *://*.embed4me.com/*
// @match        *://*.oneupload.to/*
// @match        *://*.oneupload.net/*
// @match        *://*.sendvid.com/*
// @match        *://*.sibnet.ru/*
// @match        *://*.smoothpre.com/*
// @match        *://*.vk.com/*
// @match        *://*.vkvideo.ru/*
// @match        *://*.vidmoly.net/*
// @match        *://*.vidmoly.to/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=anime-sama.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/556240/anime-sama%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/556240/anime-sama%20Plus.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --------------------------------------------------------------------------
    // Configuration
    // Domaines "parent" (site Anime-Sama)
    const P_DOMAINS = ['anime-sama'];
    // Domaines lecteurs sans contrôles clavier natifs : flèches/espace/plein écran forcés
    const C_DOMAINS = ['sendvid.com'];

    // --------------------------------------------------------------------------
    // UI - Choix restauration (Remplacer/Annuler)
    function showChoiceDialog() {
        return new Promise(resolve => {
            const overlay = document.createElement('div');
            Object.assign(overlay.style, {
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(0,0,0,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10000
            });
            const box = document.createElement('div');
            Object.assign(box.style, {
                background: '#111',
                color: '#fff',
                padding: '20px',
                borderRadius: '10px',
                width: 'min(92vw, 360px)',
                textAlign: 'center',
                fontFamily: 'sans-serif',
                boxShadow: '0 10px 30px rgba(0,0,0,.4)'
            });
            box.innerHTML = '<p style="margin-bottom:12px;font-weight:700">Comment voulez-vous restaurer&nbsp;?</p>';
            const mk = (label, code, bg) => {
                const b = document.createElement('button');
                b.textContent = label;
                Object.assign(b.style, {
                    margin: '0 8px', padding: '8px 12px',
                    border: 'none', borderRadius: '6px',
                    cursor: 'pointer', fontWeight: 700, background: bg, color: '#fff'
                });
                b.onclick = () => { document.body.removeChild(overlay); resolve(code); };
                return b;
            };
            box.appendChild(mk('Restaurer', 'R', '#0b6'));
            box.appendChild(mk('Annuler', 'C', '#e53e3e'));
            overlay.appendChild(box);
            document.body.appendChild(overlay);
        });
    }

    // --------------------------------------------------------------------------
    // UI - Mot de passe avec fallback "SAMA" + mémorisation
    async function showPasswordDialog(mode /* 'backup'|'restore' */) {
        return new Promise(resolve => {
            const overlay = document.createElement('div');
            Object.assign(overlay.style, {
                position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000
            });
            const box = document.createElement('div');
            Object.assign(box.style, {
                background: '#111', color: '#fff', padding: '18px 16px',
                borderRadius: '10px', width: 'min(92vw, 360px)',
                fontFamily: 'sans-serif', boxShadow: '0 10px 30px rgba(0,0,0,.4)'
            });
            box.innerHTML = `
                <div style="font-weight:700;font-size:16px;margin-bottom:8px">
                    ${mode === 'backup' ? 'Mot de passe de sauvegarde' : 'Mot de passe de restauration'}
            </div>
            <div style="font-size:13px;opacity:.9;margin-bottom:10px">
                Laissez vide pour utiliser <b>SAMA</b> par défaut.
            </div>

            <input id="asplus-pass" type="password" autocomplete="current-password"
            placeholder="(vide = SAMA)"
            style="width:100%;padding:8px;border-radius:6px;border:1px solid #333;background:#0b0b0b;color:#fff;margin-bottom:10px"/>

                <!-- Avertissement ultra visible -->
                <div id="asplus-risk-banner"
            style="
            display:block;
            margin:10px 0 12px 0;
            padding:10px 12px;
            border-radius:10px;
            border:2px solid #ff5252;
            background:linear-gradient(90deg,#3a0000,#180000);
            box-shadow:0 0 0 2px rgba(255,82,82,.25) inset, 0 0 18px rgba(255,82,82,.2);
            ">
            <label for="asplus-remember"
            style="display:flex;gap:12px;align-items:flex-start;cursor:pointer;">
                <input id="asplus-remember" type="checkbox"
            style="transform:scale(1.35);margin-top:2px"/>
                <div>
                <div style="color:#ff5252;font-weight:900;letter-spacing:.3px;text-transform:uppercase;font-size:14px;">
                    ⚠️ MÉMORISER (LOCAL SANS CHIFFREMENT)
            </div>
            <div style="color:#ffb3b3;font-size:12px;margin-top:2px;line-height:1.25;">
                Le mot de passe sera stocké tel quel dans ce navigateur.
                N’activez que si vous comprenez le risque.
                    </div>
            </div>
            </label>
            </div>

            <div style="display:flex;gap:8px;justify-content:flex-end">
                <button id="asplus-cancel"
            style="padding:8px 10px;border:0;border-radius:6px;background:#555;color:#fff;cursor:pointer">
                Annuler
            </button>
            <button id="asplus-ok"
            style="padding:8px 10px;border:0;border-radius:6px;background:#0c6;color:#000;font-weight:700;cursor:pointer">
                OK
            </button>
            </div>
            `;
            overlay.appendChild(box);
            document.body.appendChild(overlay);
            const $ = (s) => box.querySelector(s);
            $('#asplus-cancel').onclick = () => { document.body.removeChild(overlay); resolve({ pass: null, remember: false }); };
            $('#asplus-ok').onclick = () => {
                const val = $('#asplus-pass').value || '';
                const remember = $('#asplus-remember').checked;
                document.body.removeChild(overlay);
                resolve({ pass: val, remember });
            };
            $('#asplus-pass').addEventListener('keydown', e => { if (e.key === 'Enter') $('#asplus-ok').click(); });
            $('#asplus-pass').focus();
        });
    }

    async function getPassphrase(mode /* 'backup'|'restore' */) {
        const sess = localStorage.getItem('asplus.passphrase');
        if (sess && sess.length) return sess;
        const { pass, remember } = await showPasswordDialog(mode);
        const chosen = (pass && pass.length) ? pass : 'SAMA';
        if (remember) localStorage.setItem('asplus.passphrase', chosen);
        return chosen;
    }

    // --------------------------------------------------------------------------
    // Fichiers .sama (MIME dédié)
    async function pickFileToSave(blob) {
        const EXT = '.sama';
        const MIME = 'application/vnd.animesama.backup';
        if (window.showSaveFilePicker) {
            const opts = {
                suggestedName: 'Profil Anime-Sama' + EXT,
                excludeAcceptAllOption: true,
                types: [{ description: 'Backup Anime-Sama (*.sama)', accept: { [MIME]: [EXT] } }]
            };
            let handle = await window.showSaveFilePicker(opts);
            if (!handle.name.toLowerCase().endsWith(EXT)) {
                handle = await window.showSaveFilePicker({ ...opts, suggestedName: handle.name.replace(/\.[^.]*$/, '') + EXT });
            }
            const writer = await handle.createWritable();
            await writer.write(blob);
            await writer.close();
            return;
        }
        const url = URL.createObjectURL(blob);
        const a = Object.assign(document.createElement('a'), { href: url, download: 'Profil Anime-Sama' + EXT });
        document.body.append(a); a.click(); a.remove();
        URL.revokeObjectURL(url);
    }

    async function pickFileToOpen() {
        const EXT = '.sama';
        const MIME = 'application/vnd.animesama.backup';
        if (window.showOpenFilePicker) {
            const [handle] = await window.showOpenFilePicker({
                excludeAcceptAllOption: true,
                types: [{ description: 'Backup Anime-Sama (*.sama)', accept: { [MIME]: [EXT] } }]
            });
            return await handle.getFile();
        }
        return new Promise(resolve => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = EXT;
            input.onchange = () => resolve(input.files[0]);
            input.click();
        });
    }

    // --------------------------------------------------------------------------
    // Sauvegarde / Restauration (AES-GCM 256, IV = salt pour PBKDF2)
    async function backupProfile() {
        try {
            const data = {};
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                data[key] = localStorage.getItem(key);
            }
            const json = JSON.stringify(data);
            const encoder = new TextEncoder();
            const passphrase = await getPassphrase('backup');
            const iv = crypto.getRandomValues(new Uint8Array(12));
            const baseKey = await crypto.subtle.importKey('raw', encoder.encode(passphrase), { name: 'PBKDF2' }, false, ['deriveKey']);
            const aesKey = await crypto.subtle.deriveKey({ name: 'PBKDF2', salt: iv, iterations: 100000, hash: 'SHA-256' },
                                                         baseKey, { name: 'AES-GCM', length: 256 }, false, ['encrypt']);
            const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, aesKey, encoder.encode(json));
            const payload = new Uint8Array(iv.byteLength + encrypted.byteLength);
            payload.set(iv, 0);
            payload.set(new Uint8Array(encrypted), iv.byteLength);
            const blob = new Blob([payload], { type: 'application/vnd.animesama.backup' });
            await pickFileToSave(blob);
        } catch (e) {
            console.error('Backup failed:', e);
            alert('Sauvegarde échouée.');
        }
    }

    async function restoreProfile() {
        try {
            const file = await pickFileToOpen();
            const array = await file.arrayBuffer();
            const iv = new Uint8Array(array.slice(0, 12));
            const ciphertext = array.slice(12);
            const encoder = new TextEncoder();
            const passphrase = await getPassphrase('restore');
            const baseKey = await crypto.subtle.importKey('raw', encoder.encode(passphrase), { name: 'PBKDF2' }, false, ['deriveKey']);
            const aesKey = await crypto.subtle.deriveKey({ name: 'PBKDF2', salt: iv, iterations: 100000, hash: 'SHA-256' },
                                                         baseKey, { name: 'AES-GCM', length: 256 }, false, ['decrypt']);
            const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, aesKey, ciphertext);
            const data = JSON.parse(new TextDecoder().decode(decrypted));
            const choice = await showChoiceDialog();
            if (choice === 'C') return;
            const doReplace = choice === 'R';
            if (doReplace) localStorage.clear();
            Object.keys(data).forEach(key => { if (doReplace) localStorage.setItem(key, data[key]); });
            location.reload();
        } catch (e) {
            console.error('Restore failed:', e);
            alert('Restauration échouée — mot de passe incorrect ou fichier corrompu ?');
        }
    }

    // --------------------------------------------------------------------------
    // Menu Profil (robuste SPA + recréation si supprimé)
    function createProfileDropdown() {
        const nav = document.querySelector('.asn-nav-desktop');
        if (!nav) return;
        if (nav.querySelector('#tampered-dropdown')) return;

        // supprime le lien profil d'origine s'il existe
        const oldLink = nav.querySelector('a[href*="/profil"]');
        if (oldLink) oldLink.remove();

        const wrapper = document.createElement('div');
        wrapper.id = 'tampered-dropdown';
        wrapper.className = 'relative inline-block text-left';
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'inline-flex uppercase text-base font-extrabold text-white hover:text-sky-500 hover:bg-gray-700 transition-all duration-200 focus:outline-none';
        btn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 my-3.5 mx-3 xl:mr-0 text-white" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clip-rule="evenodd"/></svg>
            <p class="hidden xl:block p-3 m-1">profil</p>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 my-3.5 mx-3 xl:mr-0 text-white transform transition-transform duration-200" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.293l3.71-4.06a.75.75 0 111.08 1.04l-4.25 4.656a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clip-rule="evenodd"/></svg>`;
        wrapper.appendChild(btn);

        const menu = document.createElement('div');
        Object.assign(menu.style, {
            display: 'none', position: 'absolute', right: '0', marginTop: '0.5rem',
            backgroundColor: 'rgba(0,0,0,0.9)', borderRadius: '0.25rem', border: 'inset',
            boxShadow: '0 2px 8px rgba(0,0,0,0.5)'
        });

        [['Voir Profil', () => window.location.href = '/profil'],
         ['Sauvegarde Profil', backupProfile],
         ['Restauration Profil', restoreProfile]
        ].forEach(([label, action]) => {
            const item = document.createElement('button');
            item.textContent = label;
            Object.assign(item.style, {
                display: 'block', width: '100%', padding: '0.5rem 1rem',
                textAlign: 'left', color: 'white', background: 'transparent', border: 'none', cursor: 'pointer'
            });
            item.addEventListener('mouseenter', () => item.style.background = 'rgba(255,255,255,0.1)');
            item.addEventListener('mouseleave', () => item.style.background = 'transparent');
            item.addEventListener('click', () => { action(); menu.style.display = 'none'; btn.querySelector('svg:last-child').style.transform = ''; });
            menu.appendChild(item);
        });

        wrapper.appendChild(menu);
        nav.appendChild(wrapper);

        btn.addEventListener('click', e => {
            e.stopPropagation();
            const open = menu.style.display === 'block';
            menu.style.display = open ? 'none' : 'block';
            btn.querySelector('svg:last-child').style.transform = open ? '' : 'rotate(180deg)';
            btn.setAttribute('aria-expanded', String(!open));
        });
        document.addEventListener('click', () => { menu.style.display = 'none'; btn.querySelector('svg:last-child').style.transform = ''; btn.setAttribute('aria-expanded', 'false'); });
    }

    function ensureProfileDropdown() {
        const nav = document.querySelector('.asn-nav-desktop');
        const exists = !!document.querySelector('#tampered-dropdown');
        if (nav && !exists) createProfileDropdown();
    }
    let _ensureTimer = null;
    function scheduleEnsure() {
        if (_ensureTimer) return;
        _ensureTimer = setTimeout(() => { _ensureTimer = null; ensureProfileDropdown(); }, 100);
    }
    if (document.readyState !== 'loading') ensureProfileDropdown();
    else window.addEventListener('DOMContentLoaded', ensureProfileDropdown);
    const domObserver = new MutationObserver(scheduleEnsure);
    domObserver.observe(document.documentElement, { childList: true, subtree: true });
    (function hookHistory() {
        const fire = () => window.dispatchEvent(new Event('asplus:navigation'));
        const _push = history.pushState, _replace = history.replaceState;
        history.pushState = function (...a) { const r = _push.apply(this, a); fire(); return r; };
        history.replaceState = function (...a) { const r = _replace.apply(this, a); fire(); return r; };
        window.addEventListener('popstate', fire);
        window.addEventListener('asplus:navigation', scheduleEnsure);
    })();
    document.addEventListener('visibilitychange', () => { if (!document.hidden) scheduleEnsure(); });

    // --------------------------------------------------------------------------
    // Réactiver la sélection de texte (global)
    (function enableSelection() {
        const css = `
      html, body, * {
        -webkit-user-select: text !important;
        -moz-user-select: text !important;
        -ms-user-select: text !important;
        user-select: text !important;
        -webkit-touch-callout: default !important;
      }`;
        const style = document.createElement('style');
        style.id = 'asplus-enable-selection';
        style.appendChild(document.createTextNode(css));
        (document.head || document.documentElement).appendChild(style);

        const unblock = e => { e.stopImmediatePropagation(); };
        ['copy','cut','paste','contextmenu','selectstart','dragstart']
            .forEach(t => document.addEventListener(t, unblock, true));

        const fixInline = el => {
            if (!el || !el.style) return;
            el.style.setProperty('user-select','text','important');
            el.style.setProperty('-webkit-user-select','text','important');
            el.style.setProperty('-moz-user-select','text','important');
            el.style.setProperty('-ms-user-select','text','important');
            el.style.setProperty('-webkit-touch-callout','default','important');
        };
        fixInline(document.body);
        new MutationObserver(muts => {
            for (const m of muts) {
                if (m.type === 'attributes' && m.attributeName === 'style') fixInline(m.target);
                if (m.addedNodes) m.addedNodes.forEach(n => { if (n.nodeType === 1) fixInline(n); });
            }
        }).observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['style'] });
    })();

    // --------------------------------------------------------------------------
    // Injection lecteur (parent/iframe) + auto-next + raccourcis
    const injectedCode =`
          (function () {
              const CONTROL_DOMAINS = ${JSON.stringify(C_DOMAINS)};
              const PARENT_DOMAINS  = ${JSON.stringify(P_DOMAINS)};

              const SITE = location.hostname;
              const isTop = (window.self === window.top);
              function matchHost(host, pattern) {
                  if (!host || !pattern) return false;
                  if (pattern.indexOf('.') !== -1) {
                      return host === pattern || host.endsWith('.' + pattern);
                  }
                  var esc = pattern.replace(/[-/\\^$*+?.()|[\\]{}]/g, '\\$&');
                  return new RegExp('(?:^|\\.)' + esc + '\\.', 'i').test(host);
              }

              var isParentHost = PARENT_DOMAINS.some(function(p){ return matchHost(SITE, p); });

              var ref = document.referrer || '';
              var refHost = '';
              try { refHost = new URL(ref).hostname; } catch (_) {}
              var refIsParent = PARENT_DOMAINS.some(function(p){ return matchHost(refHost, p); });

              var fromAnimeParent = isTop && (isParentHost || !!document.getElementById('playerDF'));
              var fromAnimeIframe = !isTop && refIsParent;

              console.log('[ASP][init]', { host:SITE, isTop, fromAnimeParent, fromAnimeIframe, refHost, cDomains: CONTROL_DOMAINS });

              let pendingToggle = false;
              const prevEp = window.prevEp || (() => console.warn('[ASP] prevEp non défini'));
              const nextEp = window.nextEp || (() => console.warn('[ASP] nextEp non défini'));

              function messageHandler(e) {
                  const action = e && e.data && e.data.action;
                  const iframe = document.getElementById('playerDF');
                  if (action === 'prevEp') { pendingToggle = true; prevEp(); }
                  else if (action === 'nextEp') { pendingToggle = true; nextEp(); }
                  if (pendingToggle && action === 'Istart') {
                      if (iframe && iframe.contentWindow) iframe.contentWindow.postMessage({ action: 'togglePlay' }, '*');
                      pendingToggle = false;
                  }
              }

              function iframeKeyHandler(e) {
                  if (/input|textarea/i.test(e.target && e.target.tagName)) return;
                  const host = window.location.hostname;
                  const isControlSite = CONTROL_DOMAINS.some(d => host === d || host.endsWith('.' + d));
                  const video = document.querySelector('video');

                  if (isControlSite && video) {
                      switch (e.key) {
                          case 'ArrowRight': e.preventDefault(); video.currentTime = Math.min(video.duration, video.currentTime + 5); break;
                          case 'ArrowLeft':  e.preventDefault(); video.currentTime = Math.max(0, video.currentTime - 5); break;
                          case ' ': case 'Spacebar': e.preventDefault(); video.paused ? video.play() : video.pause(); break;
                          case 'f': case 'F':
                              e.preventDefault();
                              const fsBtn = document.querySelector('.vjs-fullscreen-control');
                              if (fsBtn) fsBtn.click();
                              else {
                                  if (!document.fullscreenElement && video.requestFullscreen) video.requestFullscreen();
                                  else if (document.exitFullscreen) document.exitFullscreen();
                              }
                              break;
                          case 'ArrowUp':   e.preventDefault(); video.volume = Math.min(1, +(video.volume + 0.1).toFixed(2)); break;
                          case 'ArrowDown': e.preventDefault(); video.volume = Math.max(0, +(video.volume - 0.1).toFixed(2)); break;
                      }
                  }
                  if (e.key === 'p') window.parent.postMessage({ action: 'prevEp' }, '*');
                  else if (e.key === 'n') { console.log('[ASP][iframe] nextEp'); window.parent.postMessage({ action: 'nextEp' }, '*'); }
              }

              function togglePlayPauseAfterDelay() {
                  setTimeout(() => {
                      const video = document.querySelector('video');
                      if (video) video.paused ? video.play() : video.pause();
                  }, 0);
              }

              function addVideoEndDetectors() {
                  const v = document.querySelector('video');
                  if (!v) { setTimeout(addVideoEndDetectors, 500); return; }
                  let sent = false;
                  const sendNext = (reason) => { if (sent) return; sent = true; console.log('[ASP][AutoNext]', reason || 'unknown'); window.parent.postMessage({ action: 'nextEp' }, '*'); };
                  v.addEventListener('ended', () => sendNext('ended'));
                  try {
                      if (window.jwplayer) {
                          const p = window.jwplayer();
                          if (p && typeof p.on === 'function') {
                              p.on('complete', () => sendNext('jw:complete'));
                              p.on('playlistComplete', () => sendNext('jw:playlistComplete'));
                          }
                      }
                  } catch (_) {}
                  const EPS = 1.0, NEED = 3; let nearTicks = 0;
                  v.addEventListener('timeupdate', () => {
                      if (sent) return;
                      const d = v.duration; if (!isFinite(d) || !d) return;
                      const rem = d - v.currentTime;
                      if (rem <= EPS) { if (++nearTicks >= NEED) sendNext('near-end'); }
                      else nearTicks = 0;
                  });
                  let lastT = v.currentTime;
                  const stallTimer = setInterval(() => {
                      if (sent) { clearInterval(stallTimer); return; }
                      const d = v.duration; if (!isFinite(d) || !d) return;
                      const now = v.currentTime;
                      if (now === lastT && (d - now) <= EPS && v.paused) { sendNext('stall-end'); clearInterval(stallTimer); }
                      lastT = now;
                  }, 1000);
              }

              function enablePlayerLogging() {
                  function attach() {
                      const v = document.querySelector('video');
                      if (!v) { setTimeout(attach, 400); return; }
                      if (v.dataset.logAttached) return;
                      v.dataset.logAttached = '1';
                      function stamp(){ return new Date().toLocaleTimeString(); }
                      function log(msg, extra){ console.log('[Player][' + stamp() + '] ' + msg + (extra ? ' ' + extra : '')); }
                      const events = ['play','pause','ended','seeking','seeked','waiting','stalled','error','loadedmetadata','loadeddata','canplay','ratechange','volumechange','timeupdate'];
                      let lastTU = 0;
                      events.forEach((ev) => v.addEventListener(ev, () => {
                          if (ev === 'timeupdate') {
                              const now = performance.now();
                              if (now - lastTU > 1000) { lastTU = now; log('timeupdate', 't=' + v.currentTime.toFixed(1) + '/' + ((v.duration||0).toFixed(1))); }
                              return;
                          }
                          if (ev === 'volumechange') return log('volume', '=' + Math.round(v.volume*100) + '% muted=' + v.muted);
                          if (ev === 'ratechange')   return log('rate', '=' + v.playbackRate);
                          if (ev === 'error')        return log('error', v.error ? ('code=' + v.error.code) : '');
                          log(ev);
                      }, true));
                      v.addEventListener('click', () => log('click(video)'), true);
                      document.addEventListener('fullscreenchange', () => log(document.fullscreenElement ? 'fullscreen:enter' : 'fullscreen:exit'), true);
                      window.addEventListener('message', (e) => { if (e.data && e.data.action) log('postMessage:' + e.data.action); }, true);
                  }
                  attach();
              }

              function attachParentHandlers() {
                  console.log('[ASP] context=parent');
                  window.addEventListener('message', messageHandler);
              }
              function attachIframeHandlers() {
                  console.log('[ASP] context=iframe');
                  document.addEventListener('keydown', iframeKeyHandler, true);
                  window.addEventListener('message', (e) => {
                      if (e.data && e.data.action === 'togglePlay') {
                          try { window.focus(); } catch (_e) {}
                          const v = document.querySelector('video'); if (v) v.focus();
                          togglePlayPauseAfterDelay();
                      }
                  });
                  window.addEventListener('load', () => { setTimeout(() => window.parent.postMessage({ action: 'Istart' }, '*'), 100); });
                  addVideoEndDetectors();
                  //enablePlayerLogging();
              }

              if (fromAnimeParent)      attachParentHandlers();
              else if (fromAnimeIframe) attachIframeHandlers();
              else {
                  const hasPlayerIframeId = !!document.getElementById('playerDF');
                  const hasVideo = !!document.querySelector('video');
                  console.warn('[ASP] context unknown -> fallback', { hasPlayerIframeId, hasVideo });
                  if (isTop && hasPlayerIframeId) attachParentHandlers();
                  else if (!isTop && hasVideo)    attachIframeHandlers();
                  else                             console.warn('[ASP] fallback -> nothing to attach');
              }
          })();
    `;

    const script = document.createElement('script');
    script.defer = true;
    script.textContent = injectedCode;
    document.documentElement.appendChild(script);
    script.remove();
})();
