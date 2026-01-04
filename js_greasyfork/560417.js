// ==UserScript==
// @name         drrrkari Users Overlay
// @namespace    http://tampermonkey.net/
// @version      7.7
// @description  Overlay
// @match        https://drrrkari.com/room/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560417/drrrkari%20Users%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/560417/drrrkari%20Users%20Overlay.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE = {
        KEYWORDS: 'drrrkari_kick_keywords',
        ENCIP_HISTORY: 'drrrkari_encip_history',
        ALL_USERS: 'drrrkari_all_users_history',
        TALK_CACHE: 'drrrkari_talk_cache',
        UPDATE_INTERVAL: 'drrrkari_update_interval'
    };

    const storage = {
        get: (key, def) => JSON.parse(localStorage.getItem(key) || JSON.stringify(def)),
        set: (key, val) => localStorage.setItem(key, JSON.stringify(val))
    };

    const COLORS = ['#0ff', '#ff0', '#f0f', '#f80', '#8ff', '#ff8'];
    const BAN_URL = 'https://drrrkari.com/room/?ajax=1';
    let updateIntervalMs = Math.max(100, Math.min(5000, (storage.get(STORAGE.UPDATE_INTERVAL, 0.1) * 1000)));
    let intervalId = null;
    let lastUpdateTime = Date.now();

    const overlay = document.createElement('div');
    Object.assign(overlay.style, {
        position: 'fixed', top: '5px', right: '10px',
        backgroundColor: 'rgba(0,0,0,0.85)', color: '#0f0',
        padding: '12px', borderRadius: '8px', fontFamily: 'monospace',
        fontSize: '13px', zIndex: '2147483647', height: '95vh', maxWidth: '380px',
        overflowY: 'hidden', boxShadow: '0 0 10px rgba(0,255,0,0.5)',
        border: '1px solid #0f0', display: 'flex', flexDirection: 'column'
    });
    document.body.appendChild(overlay);

    const helpBtn = document.createElement('div');
    helpBtn.textContent = '?';
    Object.assign(helpBtn.style, {
        position: 'absolute', top: '8px', right: '58px',
        width: '24px', height: '24px', backgroundColor: '#0f0', color: '#000',
        borderRadius: '50%', textAlign: 'center', lineHeight: '24px',
        fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', zIndex: '10'
    });
    overlay.appendChild(helpBtn);

    const settingsBtn = document.createElement('div');
    settingsBtn.textContent = '⚙️';
    Object.assign(settingsBtn.style, {
        position: 'absolute', top: '8px', right: '28px',
        width: '24px', height: '24px', backgroundColor: '#0f0', color: '#000',
        borderRadius: '50%', textAlign: 'center', lineHeight: '24px',
        fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', zIndex: '10'
    });
    overlay.appendChild(settingsBtn);

    const modal = document.createElement('div');
    Object.assign(modal.style, {
        display: 'none', position: 'fixed', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)', backgroundColor: 'rgba(0,0,0,0.95)',
        color: '#0f0', padding: '20px', border: '2px solid #0f0', borderRadius: '10px',
        zIndex: '2147483648', maxWidth: '440px', maxHeight: '80vh', overflowY: 'auto',
        boxShadow: '0 0 20px rgba(0,255,0,0.8)', fontSize: '14px'
    });
    modal.innerHTML = `
        <div style="position:relative;">
            <div id="m-title" style="text-align:center;font-weight:bold;font-size:16px;margin-bottom:12px;padding-right:30px;"></div>
            <button id="m-close" style="position:absolute;top:0;right:0;padding:4px 10px;background:#f00;color:#fff;border:none;border-radius:50%;cursor:pointer;font-weight:bold;font-size:14px;">×</button>
        </div>
        <div id="m-content" style="margin:15px 0;"></div>
    `;
    document.body.appendChild(modal);

    const mTitle = modal.querySelector('#m-title');
    const mContent = modal.querySelector('#m-content');
    modal.querySelector('#m-close').onclick = () => modal.style.display = 'none';

    function openModal(title, contentHTML) {
        mTitle.textContent = title;
        mContent.innerHTML = contentHTML;
        modal.style.display = 'block';
    }

    const keywordHelpHTML = `
        <div style="line-height:1.6;">
            <strong>Auto BAN キーワードの使い方</strong><br><br>
            ・<strong>通常キーワード</strong><br>
            　例: <code>たぬき</code><br>
            　→ 名前の一部に「たぬき」を含むユーザーを自動BAN（通常BAN）<br><br>
            ・<strong>永久BAN（再入室不可）</strong><br>
            　例: <code>たぬき id</code>（末尾に半角スペース＋id）<br>
            　→ 名前一致 + block=1 で永久BAN<br><br>
            ・<strong>ENCIP完全一致BAN</strong><br>
            　例: <code>@encip MxIg32hjSnqUcE5bV6dwQg==</code><br>
            　→ そのENCIPのユーザーを名前に関係なく自動BAN<br><br>
            ・<strong>ENCIP + 永久BAN</strong><br>
            　例: <code>@encip MxIg32hjSnqUcE5bV6dwQg== id</code><br>
            　→ ENCIP一致 + block=1 で永久BAN<br><br>
            <strong>注意</strong>:<br>
            ・<code>id</code>の前には必ず半角スペースが必要です<br>
            ・<code>たぬきid</code>（スペースなし）は通常の名前一致BANになります<br>
            ・リストの×ボタンでいつでも削除可能
        </div>
    `;

    helpBtn.onclick = () => openModal('Auto BAN キーワードの使い方', keywordHelpHTML);

    settingsBtn.onclick = () => {
        const currentSec = (updateIntervalMs / 1000).toFixed(1);
        const nextUpdate = new Date(lastUpdateTime + updateIntervalMs);
        const jstNext = new Date(nextUpdate.getTime() + 9*60*60*1000);
        const timeStr = jstNext.toLocaleTimeString('ja-JP', {hour: '2-digit', minute: '2-digit', second: '2-digit'});

        openModal('更新頻度設定', `
            <div style="text-align:center;">
                <p>更新間隔（秒）を入力（0.1〜5.0）</p>
                <input id="interval-input" type="number" min="0.1" max="5.0" step="0.1" value="${currentSec}" style="width:100px;padding:6px;background:#222;color:#0f0;border:1px solid #0f0;border-radius:4px;text-align:center;">
                <p style="margin-top:12px;"><button id="apply-interval" style="padding:6px 12px;background:#0f0;color:#000;border:none;border-radius:6px;cursor:pointer;font-weight:bold;">適用</button></p>
                <hr style="border-color:#0f0;margin:20px 0;">
                <p>現在の更新間隔: <strong>${currentSec}秒</strong></p>
                <p>次回更新予定: <strong>${timeStr}</strong></p>
                <p style="margin-top:12px;"><button id="test-update" style="padding:6px 12px;background:#ff0;color:#000;border:none;border-radius:6px;cursor:pointer;font-weight:bold;">テスト</button></p>
            </div>
        `);

        const input = document.getElementById('interval-input');
        const applyBtn = document.getElementById('apply-interval');
        const testBtn = document.getElementById('test-update');

        const apply = () => {
            let val = parseFloat(input.value);
            if (isNaN(val) || val < 0.1 || val > 5.0) {
                alert('0.1〜5.0の範囲で入力してください');
                return;
            }
            updateIntervalMs = val * 1000;
            storage.set(STORAGE.UPDATE_INTERVAL, val);
            clearInterval(intervalId);
            lastUpdateTime = Date.now();
            intervalId = setInterval(() => {
                lastUpdateTime = Date.now();
                fetchUsersAndAutoBan();
            }, updateIntervalMs);
            modal.style.display = 'none';
        };

        applyBtn.onclick = apply;
        input.onkeydown = e => e.key === 'Enter' && apply();
        input.focus();
        input.select();

        testBtn.onclick = () => {
            const testSec = (updateIntervalMs / 1000).toFixed(1);
            alert(`テスト開始！\n\n${testSec}秒後に「更新テスト完了！」と表示されます。\n（実際の更新処理も実行されます）`);

            setTimeout(() => {
                openModal('更新テスト完了！', `
                    <div style="text-align:center;">
                        <p style="font-size:18px;color:#0f0;">✅ 更新テスト完了！</p>
                        <p>設定された間隔（${testSec}秒）で正しく更新されました。</p>
                    </div>
                `);
                fetchUsersAndAutoBan();
            }, updateIntervalMs);
        };
    };

    overlay.addEventListener('click', e => {
        if (e.target.dataset.history) {
            const names = JSON.parse(e.target.dataset.history);
            openModal('過去の名前履歴', names.map(n => `<div style="padding:4px 0;">・ ${n}</div>`).join(''));
        }
    });

    function setupAccordionAndButtons() {
        mContent.querySelectorAll('.acc-h').forEach(h => {
            h.onclick = e => {
                if (e.target.classList.contains('copy-btn') || e.target.classList.contains('delete-btn') || e.target.classList.contains('talk-btn')) return;
                const b = h.nextElementSibling;
                b.style.display = b.style.display === 'block' ? 'none' : 'block';
            };
        });

        mContent.addEventListener('click', e => {
            if (e.target.classList.contains('copy-btn')) {
                const encip = e.target.dataset.encip;
                navigator.clipboard.writeText(encip).then(() => {
                    const old = e.target.textContent;
                    e.target.textContent = 'コピー済み！';
                    e.target.style.background = '#00f';
                    setTimeout(() => {
                        e.target.textContent = old;
                        e.target.style.background = '#0f0';
                    }, 1000);
                }).catch(() => alert('コピー失敗'));
            } else if (e.target.classList.contains('delete-btn')) {
                const encip = e.target.dataset.encip;
                if (confirm(`ENCIP ${encip.substring(0,20)}... の履歴と発言を削除しますか？`)) {
                    let history = storage.get(STORAGE.ENCIP_HISTORY, {});
                    let talkCache = storage.get(STORAGE.TALK_CACHE, []);
                    const names = history[encip]?.names || [];
                    talkCache = talkCache.filter(t => !names.includes(t.name));
                    delete history[encip];
                    storage.set(STORAGE.ENCIP_HISTORY, history);
                    storage.set(STORAGE.TALK_CACHE, talkCache);
                    showAllDuplicates();
                }
            } else if (e.target.id === 'clear-all-duplicates') {
                if (confirm('すべての重複ユーザー履歴と関連発言を削除しますか？')) {
                    storage.set(STORAGE.ENCIP_HISTORY, {});
                    storage.set(STORAGE.TALK_CACHE, []);
                    showAllDuplicates();
                }
            } else if (e.target.classList.contains('talk-btn') || e.target.classList.contains('name-link')) {
                const name = e.target.dataset.name;
                const talks = storage.get(STORAGE.TALK_CACHE, []).filter(t => t.name === name);
                const formatted = talks.reverse().map(t => {
                    const time = new Date(t.time * 1000);
                    const jstTime = new Date(time.getTime() + 9*60*60*1000);
                    const hours = jstTime.getHours().toString().padStart(2, '0');
                    const mins = jstTime.getMinutes().toString().padStart(2, '0');
                    return `<div style="padding:4px 0;">・ ${hours}:${mins} ${t.message}</div>`;
                }).join('');
                openModal(`発言履歴 - ${name}`, formatted || '<div style="color:#888;">この名前での発言はありません</div>');
            }
        }, { once: false });
    }

    function showAllDuplicates() {
        let history = storage.get(STORAGE.ENCIP_HISTORY, {});
        const now = new Date();
        const jstOffset = 9 * 60 * 60 * 1000;
        const jstNow = new Date(now.getTime() + jstOffset);
        const today = jstNow.toISOString().split('T')[0];

        Object.keys(history).forEach(encip => {
            if (history[encip].lastUpdate !== today) {
                delete history[encip];
            }
        });
        storage.set(STORAGE.ENCIP_HISTORY, history);

        const duplicates = Object.entries(history)
            .filter(([,d]) => d.names.length > 1)
            .sort(([,a], [,b]) => b.names.length - a.names.length);

        const clearAllBtn = '<button id="clear-all-duplicates" style="padding:6px 12px;background:#f00;color:#fff;border:none;border-radius:6px;cursor:pointer;font-weight:bold;float:left;">全てクリア</button>';

        const talkCache = storage.get(STORAGE.TALK_CACHE, []);

        openModal(
            duplicates.length ? `すべての重複ユーザー (${duplicates.length}件)` : '重複ユーザーなし',
            `<div style="margin-bottom:12px;">${clearAllBtn}</div><div style="clear:both;"></div>` +
            (duplicates.length === 0
                ? '<div style="text-align:center;color:#888;">過去に名前を変えたユーザーはいません</div>'
                : duplicates.map(([encip, d]) => `
                    <div style="margin-bottom:8px;border:1px solid #0f0;border-radius:6px;overflow:hidden;">
                        <div class="acc-h" style="background:rgba(0,100,0,0.5);padding:8px;cursor:pointer;font-weight:bold;display:flex;align-items:center;">
                            <button class="copy-btn" data-encip="${encip}" style="margin-right:6px;padding:2px 6px;background:#0f0;color:#000;border:none;border-radius:4px;cursor:pointer;font-size:11px;">コピー</button>
                            <button class="delete-btn" data-encip="${encip}" style="margin-right:6px;padding:2px 6px;background:#f00;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:11px;">削除</button>
                            <span>ENCIP: ${encip.substring(0,20)}... (${d.names.length}名)</span>
                        </div>
                        <div class="acc-b" style="display:none;padding:8px;background:rgba(0,255,0,0.05);">
                            ${d.names.map(name => {
                                const count = talkCache.filter(t => t.name === name).length;
                                return `<div class="name-link" data-name="${name}" style="cursor:pointer;color:#ff0;padding:4px 0;font-weight:bold;">・ ${name} (${count}回)</div>`;
                            }).join('')}
                        </div>
                    </div>
                `).join(''))
        );
        setupAccordionAndButtons();
    }

    function showAllUsers() {
        let users = storage.get(STORAGE.ALL_USERS, []).slice().reverse();
        const talkCache = storage.get(STORAGE.TALK_CACHE, []);

        openModal(
            `すべてのユーザー履歴 (${users.length}件)`,
            users.length === 0
                ? '<div style="text-align:center;color:#888;">記録されたユーザーはいません</div>' + '<div style="text-align:center;margin-top:20px;"><button id="clear-all-users" style="padding:8px 16px;background:#f00;color:#fff;border:none;border-radius:6px;cursor:pointer;font-weight:bold;">履歴をクリア</button></div>'
                : users.map(u => {
                    const count = talkCache.filter(t => t.name === u.name).length;
                    return `
                    <div style="margin-bottom:8px;border:1px solid #0f0;border-radius:6px;overflow:hidden;">
                        <div class="acc-h" style="background:rgba(0,80,100,0.5);padding:8px;cursor:pointer;font-weight:bold;display:flex;align-items:center;justify-content:space-between;">
                            <span>名前: ${u.name} (${count}回)</span>
                            <button class="talk-btn" data-name="${u.name}" style="padding:2px 8px;background:#ff0;color:#000;border:none;border-radius:4px;cursor:pointer;font-size:11px;font-weight:bold;">発言</button>
                        </div>
                        <div class="acc-b" style="display:none;padding:8px;background:rgba(0,255,255,0.05);">
                            <div><strong>ID:</strong> ${u.id || 'N/A'}</div>
                            <div style="word-break:break-all;"><strong>ENCIP:</strong> ${u.encip || 'N/A'}</div>
                        </div>
                    </div>
                `;
                }).join('') + '<div style="text-align:center;margin-top:20px;"><button id="clear-all-users" style="padding:8px 16px;background:#f00;color:#fff;border:none;border-radius:6px;cursor:pointer;font-weight:bold;">履歴をクリア</button></div>'
        );
        setupAccordionAndButtons();

        document.getElementById('clear-all-users')?.addEventListener('click', () => {
            if (confirm('すべてのユーザー履歴と関連発言を完全に削除しますか？')) {
                storage.set(STORAGE.ALL_USERS, []);
                storage.set(STORAGE.TALK_CACHE, []);
                showAllUsers();
            }
        });
    }

    const btnContainer = document.createElement('div');
    btnContainer.style.cssText = 'margin-top:auto;display:flex;gap:8px;flex-wrap:wrap;';

    const dupBtn = document.createElement('button');
    dupBtn.textContent = 'すべての重複ユーザー';
    dupBtn.onclick = showAllDuplicates;

    const allBtn = document.createElement('button');
    allBtn.textContent = 'すべてのユーザー';
    allBtn.onclick = showAllUsers;

    [dupBtn, allBtn].forEach(b => {
        Object.assign(b.style, {
            padding:'8px', color:'#fff', border:'none', borderRadius:'6px',
            cursor:'pointer', fontWeight:'bold', fontSize:'13px', flex:'1'
        });
    });
    dupBtn.style.background = '#008f00';
    allBtn.style.background = '#006f88';

    btnContainer.append(dupBtn, allBtn);

    const kickSection = document.createElement('div');
    kickSection.innerHTML = '<div style="margin-bottom:8px;font-weight:bold;color:#ff0;">● Auto BAN Keywords</div>';

    const kwInput = document.createElement('input');
    kwInput.type = 'text';
    kwInput.placeholder = '';
    Object.assign(kwInput.style, {width:'68%',padding:'4px',background:'#222',color:'#0f0',border:'1px solid #0f0',borderRadius:'4px'});

    const kwAdd = document.createElement('button');
    kwAdd.textContent = '追加';
    Object.assign(kwAdd.style, {marginLeft:'4px',padding:'4px 8px',background:'#0f0',color:'#000',border:'none',borderRadius:'4px',cursor:'pointer'});

    const kwList = document.createElement('div');
    kwList.style.marginTop = '8px';

    function renderKeywordList() {
        const kws = storage.get(STORAGE.KEYWORDS, []);
        kwList.innerHTML = kws.length === 0
            ? ''
            : kws.map(kw => {
                let disp = kw;
                if (kw.startsWith('@encip ')) {
                    const enc = kw.replace('@encip ', '');
                    disp = `@encip ${enc.substring(0,16)}...${enc.endsWith(' id') ? ' id' : ''}`;
                }
                return `
                    <div style="display:flex;align-items:center;margin-bottom:4px;">
                        <span style="word-break:break-all;">${disp}</span>
                        <button style="margin-left:auto;padding:0 6px;background:#f00;color:#fff;border:none;border-radius:4px;cursor:pointer;"
                                onclick="removeKeyword('${kw.replace(/'/g, "\\'")}')">×</button>
                    </div>
                `;
            }).join('');
    }

    window.removeKeyword = kw => {
        const kws = storage.get(STORAGE.KEYWORDS, []).filter(k => k !== kw);
        storage.set(STORAGE.KEYWORDS, kws);
        renderKeywordList();
    };

    kwAdd.onclick = () => {
        const val = kwInput.value.trim();
        if (val && !storage.get(STORAGE.KEYWORDS, []).includes(val)) {
            const kws = storage.get(STORAGE.KEYWORDS, []);
            kws.push(val);
            storage.set(STORAGE.KEYWORDS, kws);
            renderKeywordList();
            kwInput.value = '';
        }
    };

    kickSection.append(kwInput, kwAdd, kwList);

    const usersHeader = document.createElement('div');
    usersHeader.style.marginTop = '16px';
    usersHeader.innerHTML = '<div style="margin-bottom:8px;font-weight:bold;color:#0f0;">● Users in Room (0)</div>';

    const usersContainer = document.createElement('div');
    usersContainer.style.flex = '1';
    usersContainer.style.overflowY = 'auto';

    overlay.append(kickSection, usersHeader, usersContainer, btnContainer);
    renderKeywordList();

    const banUser = async (userId, auto = false, permanent = false) => {
        // 手動BAN時は確認なし、Auto BANも当然なし
        try {
            const body = `ban_user=${encodeURIComponent(userId)}${permanent ? '&block=1' : ''}`;
            const res = await fetch(BAN_URL, {method:'POST', credentials:'include', headers:{'Content-Type':'application/x-www-form-urlencoded'}, body});
            if (!auto) alert(res.ok ? `${permanent ? '永久' : ''}BAN成功` : 'BAN失敗');
            fetchUsersAndAutoBan();
        } catch (e) {
            if (!auto) alert('BANエラー: ' + e.message);
        }
    };
    window.banUser = banUser;

    let talkCache = storage.get(STORAGE.TALK_CACHE, []);
    let nameToEncip = {};

    async function fetchUsersAndAutoBan() {
        try {
            const res = await fetch('https://drrrkari.com/ajax.php', {
                method: 'POST', credentials: 'include',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                body: 'a=update'
            });
            if (!res.ok) throw new Error('Update failed');
            const data = await res.json();
            const users = data.users ? Object.values(data.users) : [];
            const talks = data.talks || [];

            usersHeader.innerHTML = `<div style="margin-bottom:8px;font-weight:bold;color:#0f0;">● Users in Room (${users.length})</div>`;
            if (users.length === 0) { usersContainer.innerHTML = 'No users'; return; }

            let encipHist = storage.get(STORAGE.ENCIP_HISTORY, {});
            let allHist = storage.get(STORAGE.ALL_USERS, []);
            const keywords = storage.get(STORAGE.KEYWORDS, []);

            users.forEach(u => u.name && u.encip && (nameToEncip[u.name] = u.encip));

            talks.forEach(t => {
                if (t.message && t.name && !t.message.startsWith('ーー')) {
                    const entry = {name: t.name, message: t.message, time: t.time};
                    if (!talkCache.some(c => c.time === entry.time && c.message === entry.message && c.name === entry.name)) {
                        talkCache.push(entry);
                        storage.set(STORAGE.TALK_CACHE, talkCache);
                    }
                }
            });

            const nameRules = {};
            const encipRules = {};
            keywords.forEach(k => {
                if (k.startsWith('@encip ')) {
                    let val = k.replace('@encip ', '').trim();
                    const perm = val.endsWith(' id');
                    if (perm) val = val.slice(0, -3).trim();
                    encipRules[val] = perm;
                } else {
                    let val = k.trim();
                    const perm = val.endsWith(' id');
                    if (perm) val = val.slice(0, -3).trim();
                    nameRules[val.toLowerCase()] = perm;
                }
            });

            const existing = {};
            Array.from(usersContainer.children).forEach(el => el.dataset.id && (existing[el.dataset.id] = el));

            const current = {};

            users.forEach(u => {
                const uid = u.id || 'no-id-' + (u.encip || Math.random());
                current[uid] = true;

                const entry = {name: u.name || 'Unknown', id: u.id || null, encip: u.encip || null};
                if (!allHist.some(e => e.name === entry.name && e.id === entry.id && e.encip === entry.encip)) {
                    allHist.push(entry);
                    storage.set(STORAGE.ALL_USERS, allHist);
                }

                const nameLow = (u.name || '').toLowerCase();
                let ban = false, perm = false;
                Object.keys(nameRules).forEach(k => { if (nameLow.includes(k)) { ban = true; perm = nameRules[k]; } });
                // ENCIP BAN修正：u.encip が存在する場合は完全一致判定
                if (u.encip && encipRules[u.encip]) {
                    ban = true;
                    perm = encipRules[u.encip];
                }
                if (ban && u.id) banUser(u.id, true, perm);

                if (u.encip) {
                    const e = u.encip;
                    if (!encipHist[e]) encipHist[e] = {names: []};
                    if (!encipHist[e].names.includes(u.name)) encipHist[e].names.push(u.name);
                    const now = new Date();
                    const jstOffset = 9 * 60 * 60 * 1000;
                    const jstNow = new Date(now.getTime() + jstOffset);
                    encipHist[e].lastUpdate = jstNow.toISOString().split('T')[0];
                    storage.set(STORAGE.ENCIP_HISTORY, encipHist);
                }

                let nameHTML = u.name || 'Unknown';
                if (u.encip && encipHist[u.encip]?.names.length > 1) {
                    const idx = encipHist[u.encip].names.indexOf(u.name) % COLORS.length;
                    const hist = JSON.stringify(encipHist[u.encip].names);
                    nameHTML = `<span style="color:${COLORS[idx]};font-weight:bold;cursor:pointer;text-decoration:underline;" data-history='${hist}'>${u.name}</span>`;
                }

                const banBtn = u.id
                    ? `<button style="margin-left:8px;padding:2px 6px;font-size:11px;background:#f00;color:#fff;border:none;border-radius:4px;cursor:pointer;" onclick="banUser('${u.id}', false)">BAN</button>`
                    : '<span style="color:#888;">(no ID)</span>';

                const html = `<div style="margin-bottom:8px;padding:6px;background:rgba(255,255,255,0.05);border-radius:4px;">
                    <strong>${nameHTML}</strong>${banBtn}<br>ID: ${u.id || 'N/A'}<br>ENCIP: ${u.encip || 'N/A'}
                </div>`;

                let el = existing[uid];
                if (el) {
                    if (el.innerHTML !== html) el.innerHTML = html;
                } else {
                    el = document.createElement('div');
                    el.dataset.id = uid;
                    el.innerHTML = html;
                    usersContainer.appendChild(el);
                }
            });

            Object.keys(existing).forEach(id => !current[id] && usersContainer.removeChild(existing[id]));

        } catch (e) {
            usersContainer.innerHTML = `<div style="color:#f00;">Error: ${e.message}</div>`;
            console.error(e);
        }
    }

    fetchUsersAndAutoBan();
    intervalId = setInterval(() => {
        lastUpdateTime = Date.now();
        fetchUsersAndAutoBan();
    }, updateIntervalMs);
})();