// ==UserScript==
// @name         Local NNs for lolzik
// @namespace    http://tampermonkey.net/
// @version      1.0
// @author       taskill
// @description  Локальные ники для лолза
// @license      MIT
// @match        https://lolz.live/*
// @match        https://zelenka.guru/*
// @match        https://lzt.market/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/561841/Local%20NNs%20for%20lolzik.user.js
// @updateURL https://update.greasyfork.org/scripts/561841/Local%20NNs%20for%20lolzik.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        .local-nick-badge { font-size: 12px!important; color: #00ce8e!important; margin-left: 8px!important; font-weight: 600!important; background: rgba(0,206,142,.12)!important; padding: 1px 8px!important; border-radius: 6px!important; border: 1px solid rgba(0,206,142,.4)!important; display: inline-block!important; vertical-align: middle; line-height: 1.5!important; }
        .conversation_local_nick { margin-left: 15px!important; }
        .local-nick-edit { display: inline-flex!important; margin-left: 8px!important; cursor: pointer!important; opacity: .4; transition: .2s; vertical-align: middle; }
        .local-nick-edit:hover { opacity: 1; transform: scale(1.2); }
        .local-nick-edit svg { width: 14px; height: 14px; fill: #8c8c8c; pointer-events: none; }
        #local-nick-modal { position: fixed; top: 50%; left: 50%; transform: translate(-50%,-50%); background: #222; border: 1px solid #3d3d3d; border-radius: 10px; padding: 20px; z-index: 999999; display: none; flex-direction: column; gap: 12px; box-shadow: 0 15px 40px rgba(0,0,0,.9); width: 320px; font-family: sans-serif; }
        #local-nick-modal input { background: #151515; border: 1px solid #444; color: #fff; padding: 10px; border-radius: 6px; outline: none; width: 100%; box-sizing: border-box; }
        .btns-row { display: flex; gap: 8px; justify-content: space-between; }
        .btn-l { padding: 8px 0; border-radius: 6px; border: none; cursor: pointer; font-weight: 600; flex: 1; text-align: center; font-size: 13px; }
        .btn-trash { background: #442222; color: #ff5555; border: 1px solid #663333; }
    `);

    const getSlug = (h) => {
        if (!h) return null;
        let s = h.replace(/https?:\/\/(lolz\.live|zelenka\.guru|lzt\.market)\//, '').replace(/\/$/, '');
        s = s.replace('members/', '').replace(/^user\//, '');
        if (s.includes('/')) s = s.split('/')[0];
        return s;
    };

    function getUserIdFromProfile() {
        const r = document.querySelector('a[href*="members%2F"]');
        if (r) {
            const m = decodeURIComponent(r.href).match(/members\/(\d+)/);
            if (m) return m[1];
        }
        return document.querySelector('link[rel="canonical"]')?.href.match(/members\/(\d+)/)?.[1] || null;
    }

    function apply() {
        const nicks = GM_getValue('local_nicks', {}), s2i = GM_getValue('slug_to_id', {});
        const h1 = document.querySelector('h1[itemprop="name"]'), uid = getUserIdFromProfile();

        if (h1 && uid) {
            const slug = getSlug(window.location.href);
            if (slug && s2i[slug] !== uid) { s2i[slug] = uid; GM_setValue('slug_to_id', s2i); }

            if (!document.getElementById('nick-edit-btn')) {
                const btn = document.createElement('span');
                btn.id = 'nick-edit-btn'; btn.className = 'local-nick-edit';
                btn.innerHTML = `<svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>`;
                (h1.querySelector('div[style*="inline-flex"]') || h1).appendChild(btn);
                btn.onclick = (e) => { e.preventDefault(); showModal(uid); };
            }
            let b = document.getElementById('local-nick-badge-profile');
            if (nicks[uid]) {
                if (!b) { b = document.createElement('span'); b.id = 'local-nick-badge-profile'; b.className = 'local-nick-badge'; h1.appendChild(b); }
                if (b.innerText !== nicks[uid]) b.innerText = nicks[uid];
            } else b?.remove();
        }

        document.querySelectorAll('li[id^="conversation-"]').forEach(li => {
            const avatarLink = li.querySelector('.conversation-avatar-block a[href*="members/"]');
            const targetContainer = li.querySelector('.username_message_with_icon');
            if (avatarLink && targetContainer) {
                const cid = avatarLink.getAttribute('href').match(/members\/(\d+)/)?.[1];
                if (cid && nicks[cid]) {
                    let b = targetContainer.querySelector('.local-nick-badge');
                    if (!b) targetContainer.insertAdjacentHTML('beforeend', `<span class="local-nick-badge conversation_local_nick">${nicks[cid]}</span>`);
                    else if (b.innerText !== nicks[cid]) b.innerText = nicks[cid];
                } else {
                    targetContainer.querySelector('.local-nick-badge')?.remove();
                }
            }
        });

        const links = document.querySelectorAll('a.username, a[href*="members/"], a[href^="user/"]');
        for (let i = 0; i < links.length; i++) {
            const a = links[i];
            const h = a.getAttribute('href') || '';

            if (a.querySelector('img') || a.classList.contains('avatar') || a.classList.contains('crumb') || a.closest('h1') ||
                a.classList.contains('bold') || a.classList.contains('counter') || a.classList.contains('depositUsername') ||
                h.includes('/ignore') || h.includes('/follow') || h.includes('/messages') || a.innerText.includes('Объявления')) {
                a.querySelector('.local-nick-badge')?.remove();
                continue;
            }

            const s = getSlug(h);
            if (!s) continue;
            const tid = s.match(/^\d+$/) ? s : (s.match(/\.(\d+)$/)?.[1] || s2i[s]);

            let b = a.querySelector('.local-nick-badge');
            if (tid && nicks[tid]) {
                if (!b) a.insertAdjacentHTML('beforeend', `<span class="local-nick-badge">${nicks[tid]}</span>`);
                else if (b.innerText !== nicks[tid]) b.innerText = nicks[tid];
            } else if (b) b.remove();
        }
    }

    function showModal(userId) {
        let m = document.getElementById('local-nick-modal');
        if (!m) {
            m = document.createElement('div'); m.id = 'local-nick-modal';
            m.innerHTML = `<div style="color:#ccc;font-size:14px;font-weight:700">Локальное имя</div><input type="text" id="l-n-i"><div class="btns-row"><button class="btn-l btn-trash" id="btn-tr">Удалить</button><button class="btn-l" id="btn-cn" style="background:#333;color:#eee">Отмена</button><button class="btn-l" id="btn-sv" style="background:#00ce8e;color:#000">ОК</button></div>`;
            document.body.appendChild(m);
        }
        const inp = m.querySelector('#l-n-i'), nicks = GM_getValue('local_nicks', {});
        inp.value = nicks[userId] || '';
        m.style.display = 'flex'; inp.focus();

        m.querySelector('#btn-tr').onclick = () => {
            const n = GM_getValue('local_nicks', {}); delete n[userId];
            GM_setValue('local_nicks', n); m.style.display = 'none'; apply();
        };
        m.querySelector('#btn-cn').onclick = () => m.style.display = 'none';
        m.querySelector('#btn-sv').onclick = () => {
            const v = inp.value.trim(), n = GM_getValue('local_nicks', {});
            if (v) n[userId] = v; else delete n[userId];
            GM_setValue('local_nicks', n); m.style.display = 'none'; apply();
        };
    }

    apply();
    setInterval(apply, 1000);
})();