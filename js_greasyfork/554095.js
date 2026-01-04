// ==UserScript==
// @name         [chat.gta.world] LS Chat Group Sender
// @version      1.0
// @description  Send messages to multiple group chats, with preset management.
// @author       kuromi
// @match        https://chat.gta.world/*
// @grant        none
// @namespace https://greasyfork.org/users/1531967
// @downloadURL https://update.greasyfork.org/scripts/554095/%5Bchatgtaworld%5D%20LS%20Chat%20Group%20Sender.user.js
// @updateURL https://update.greasyfork.org/scripts/554095/%5Bchatgtaworld%5D%20LS%20Chat%20Group%20Sender.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const S = {
            P: 'lscms_presets',
            L: 'lscms_last_used',
            T: 'lscms_timestamps',
            D: 'lscms_delay'
        },
        Store = {
            get: k => {
                try {
                    return JSON.parse(localStorage.getItem(k))
                } catch {
                    return null
                }
            },
            set: (k, v) => {
                try {
                    localStorage.setItem(k, JSON.stringify(v));
                    return !0
                } catch {
                    return !1
                }
            },
            remove: k => {
                try {
                    localStorage.removeItem(k);
                    return !0
                } catch {
                    return !1
                }
            },
            clear: () => Object.values(S).forEach(k => Store.remove(k))
        },
        Presets = {
            getAll: () => Store.get(S.P) || [],
            save: (n, g, m) => {
                const p = Presets.getAll(),
                    i = p.findIndex(x => x.name === n);
                p[i >= 0 ? i : p.length] = {
                    name: n,
                    groups: g,
                    message: m,
                    updated: Date.now()
                };
                return Store.set(S.P, p)
            },
            delete: n => Store.set(S.P, Presets.getAll().filter(x => x.name !== n))
        },
        Timestamps = {
            get: () => Store.get(S.T) || {},
            set: id => {
                const ts = Timestamps.get();
                ts[id] = Date.now();
                Store.set(S.T, ts)
            },
            format: id => {
                const ts = Timestamps.get()[id];
                if (!ts) return '';
                const d = Date.now() - ts,
                    m = ~~(d / 6e4),
                    h = ~~(m / 60),
                    dy = ~~(h / 24),
                    w = ~~(dy / 7),
                    mo = ~~(dy / 30),
                    y = ~~(dy / 365);
                return m < 1 ? 'just now' : m < 60 ? m + 'm ago' : h < 24 ? h + 'h ' + m % 60 + 'm ago' : dy < 7 ? dy + 'd ago' : w < 4 ? w + 'w ago' : mo < 12 ? mo + 'mo ago' : y + 'y ago'
            }
        },
        validateId = id => /^[\w-]+$/.test(id),
        validateName = n => /^[\w\s-]+$/.test(n) && n.length <= 30;
    document.head.appendChild(Object.assign(document.createElement('style'), {
        textContent: '.lscms-btn{position:fixed;bottom:15px;right:15px;padding:10px;background:#3db16b;color:#fff;border:0;border-radius:6px;cursor:pointer;font-size:20px;box-shadow:0 2px 8px rgba(0,0,0,.3);z-index:10000;transition:all .2s;line-height:1;width:44px;height:44px;display:flex;align-items:center;justify-content:center}.lscms-btn:hover{background:#2d9d5b;transform:translateY(-1px);box-shadow:0 4px 12px rgba(0,0,0,.4)}#lscmsModal{display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.7);z-index:999999;align-items:center;justify-content:center}#lscmsModal.active{display:flex}.lscms-content{background:#1e1e1e;margin:10px;padding:0;width:90%;max-width:700px;max-height:95vh;border-radius:6px;box-shadow:0 8px 32px rgba(0,0,0,.8);overflow:hidden;display:flex;flex-direction:column}.lscms-header{display:flex;justify-content:space-between;align-items:center;padding:10px 16px;background:#151515;border-bottom:1px solid #2a2a2a}.lscms-header h2{margin:0;color:#fff;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:.5px}.lscms-close{background:0 0;border:0;font-size:20px;cursor:pointer;color:#888;transition:color .2s;padding:0;width:28px;height:28px;display:flex;align-items:center;justify-content:center}.lscms-close:hover{color:#fff}.lscms-tabs{display:flex;background:#151515;border-bottom:1px solid #2a2a2a;overflow-x:auto}.lscms-tab{padding:8px 14px;background:0 0;border:0;color:#888;cursor:pointer;font-size:10px;font-weight:600;transition:all .2s;border-bottom:2px solid transparent;white-space:nowrap;text-transform:uppercase;letter-spacing:.5px}.lscms-tab:hover{color:#ccc;background:rgba(255,255,255,.02)}.lscms-tab.active{color:#3db16b;border-bottom-color:#3db16b}.lscms-body{padding:12px 16px;overflow-y:auto;flex:1;background:#1e1e1e}.lscms-body::-webkit-scrollbar{width:6px}.lscms-body::-webkit-scrollbar-track{background:#1e1e1e}.lscms-body::-webkit-scrollbar-thumb{background:#2a2a2a;border-radius:3px}.lscms-panel{display:none}.lscms-panel.active{display:block}.lscms-info-btn{display:inline-flex;align-items:center;justify-content:center;width:14px;height:14px;border-radius:50%;background:#2a2a2a;color:#888;font-size:9px;font-weight:700;cursor:help;border:0;margin-left:6px;transition:all .2s}.lscms-info-btn:hover{background:#3db16b;color:#fff}.lscms-tooltip{position:fixed;padding:8px 12px;background:#000;color:#ccc;border:1px solid #2a2a2a;border-radius:4px;font-size:10px;z-index:9999999;box-shadow:0 4px 16px rgba(0,0,0,.9);pointer-events:none;max-width:250px;line-height:1.3;display:none}.lscms-tooltip.show{display:block}.lscms-filter input{width:100%;padding:6px 10px;background:#2a2a2a;border:1px solid #333;border-radius:4px;color:#ccc;font-size:11px;transition:border-color .2s;margin-bottom:8px;text-transform:uppercase}.lscms-filter input:focus{outline:0;border-color:#3db16b}.lscms-filter input::placeholder{color:#666;text-transform:uppercase}.lscms-controls{margin-bottom:8px;display:flex;gap:8px;justify-content:space-between;align-items:center}.lscms-controls-left{display:flex;align-items:center;gap:8px}.lscms-controls-right{display:flex;gap:6px}.lscms-btn-sm{padding:5px 10px;border:0;background:#2a2a2a;color:#ccc;border-radius:4px;cursor:pointer;font-size:9px;font-weight:600;transition:background .2s;text-transform:uppercase;letter-spacing:.5px}.lscms-btn-sm:hover{background:#333}.lscms-btn-sm.primary{background:#3db16b;color:#fff}.lscms-btn-sm.primary:hover{background:#2d9d5b}.lscms-btn-sm.danger{background:#e74c3c;color:#fff}.lscms-btn-sm.danger:hover{background:#c0392b}.lscms-list{max-height:280px;overflow-y:auto;border:1px solid #2a2a2a;border-radius:4px;padding:4px;margin-bottom:8px;background:#252525}.lscms-list::-webkit-scrollbar{width:6px}.lscms-list::-webkit-scrollbar-track{background:#1e1e1e;border-radius:3px}.lscms-list::-webkit-scrollbar-thumb{background:#2a2a2a;border-radius:3px}.lscms-item{display:flex;align-items:center;padding:6px 8px;margin:2px 0;background:#1e1e1e;border-radius:3px;transition:background .15s}.lscms-item:hover{background:#2a2a2a}.lscms-item input[type=checkbox]{margin:0 8px 0 0;width:16px;height:16px;cursor:pointer;accent-color:#3db16b;flex-shrink:0}.lscms-item label{cursor:pointer;flex:1;font-size:11px;color:#ccc;text-transform:uppercase;display:flex;align-items:center;line-height:16px}.lscms-timestamp{font-size:9px;color:#666;margin-left:8px;text-transform:uppercase}.lscms-count{color:#888;font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.5px;line-height:14px}.lscms-textarea-wrapper{position:relative;margin-bottom:8px}.lscms-textarea{width:100%;height:100px;padding:8px;border:1px solid #2a2a2a;border-radius:4px;font-size:11px;resize:vertical;font-family:inherit;background:#252525;color:#ccc;line-height:1.4;transition:border-color .2s}.lscms-textarea:focus{outline:0;border-color:#3db16b}.lscms-textarea::placeholder{color:#666}.lscms-char-count{position:absolute;bottom:6px;right:8px;font-size:9px;color:#666;pointer-events:none;text-transform:uppercase}.lscms-send-wrapper{display:flex;gap:8px;align-items:center;margin-bottom:8px}.lscms-delay-wrapper{display:flex;align-items:center;gap:6px;background:#252525;padding:6px 10px;border-radius:4px;white-space:nowrap}.lscms-delay-wrapper label{color:#888;font-size:9px;font-weight:600;text-transform:uppercase;letter-spacing:.5px;line-height:10px}.lscms-delay-wrapper input{width:60px;padding:4px 6px;background:#1e1e1e;border:1px solid #2a2a2a;border-radius:3px;color:#ccc;font-size:10px;text-align:center;line-height:10px}.lscms-delay-wrapper input:focus{outline:0;border-color:#3db16b}.lscms-send{flex:1;padding:8px 16px;background:#3db16b;color:#fff;border:0;border-radius:4px;cursor:pointer;font-size:11px;font-weight:700;transition:all .2s;text-transform:uppercase;letter-spacing:.5px}.lscms-send:hover:not(:disabled){background:#2d9d5b}.lscms-send:disabled{background:#2a2a2a;color:#666;cursor:not-allowed}.lscms-send.cancelling{background:#e74c3c;animation:pulse .5s ease-in-out infinite}.lscms-send.cancelling:hover{background:#c0392b}@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.02)}}.lscms-status{margin-top:8px;padding:8px 12px;border-radius:4px;display:none;font-size:10px;white-space:pre-line;line-height:1.4;text-transform:uppercase}.lscms-status.success{background:rgba(61,177,107,.15);color:#3db16b;border:1px solid rgba(61,177,107,.3)}.lscms-status.error{background:rgba(231,76,60,.15);color:#e74c3c;border:1px solid rgba(231,76,60,.3)}.lscms-status.info{background:rgba(52,152,219,.15);color:#3498db;border:1px solid rgba(52,152,219,.3)}.lscms-preset-list{display:flex;flex-direction:column;gap:8px;margin-bottom:12px}.lscms-preset-item{display:flex;justify-content:space-between;align-items:center;padding:8px 12px;background:#252525;border:1px solid #2a2a2a;border-radius:4px;transition:all .15s}.lscms-preset-item:hover{background:#2a2a2a}.lscms-preset-info{flex:1;display:flex;flex-direction:column;gap:2px}.lscms-preset-name{color:#fff;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.5px}.lscms-preset-meta{font-size:9px;color:#888;text-transform:uppercase}.lscms-preset-actions{display:flex;gap:6px}.lscms-preset-load{padding:5px 12px;background:#3db16b;color:#fff;border:0;border-radius:3px;cursor:pointer;font-size:9px;font-weight:700;transition:background .2s;text-transform:uppercase;letter-spacing:.5px}.lscms-preset-load:hover{background:#2d9d5b}.lscms-preset-delete{padding:5px 12px;background:#e74c3c;color:#fff;border:0;border-radius:3px;cursor:pointer;font-size:9px;font-weight:700;transition:background .2s;text-transform:uppercase;letter-spacing:.5px}.lscms-preset-delete:hover{background:#c0392b}.lscms-preset-save{display:flex;gap:8px;padding-top:12px;border-top:1px solid #2a2a2a}.lscms-preset-save input{flex:1;padding:6px 10px;background:#252525;border:1px solid #2a2a2a;border-radius:4px;color:#ccc;font-size:10px;transition:border-color .2s;text-transform:uppercase}.lscms-preset-save input:focus{outline:0;border-color:#3db16b}.lscms-preset-save input::placeholder{color:#666;text-transform:uppercase}.lscms-preset-save button{padding:6px 14px;background:#3db16b;color:#fff;border:0;border-radius:4px;cursor:pointer;font-size:10px;font-weight:700;transition:background .2s;white-space:nowrap;text-transform:uppercase;letter-spacing:.5px}.lscms-preset-save button:hover{background:#2d9d5b}.lscms-preset-save button:disabled{opacity:.5;cursor:not-allowed}.lscms-section-header{display:flex;align-items:center;margin:0;color:#fff;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;line-height:14px}.lscms-section-header.standalone{margin-bottom:8px}.lscms-empty{text-align:center;padding:30px 15px;color:#666;font-size:10px;line-height:1.5;text-transform:uppercase}.lscms-joiner-list{max-height:350px;overflow-y:auto;border:1px solid #2a2a2a;border-radius:4px;padding:4px;margin-bottom:8px;background:#252525}.lscms-joiner-item{display:flex;align-items:center;justify-content:space-between;padding:8px 10px;margin:2px 0;background:#1e1e1e;border-radius:3px}.lscms-joiner-name{flex:1;color:#ccc;font-size:10px;font-weight:600;text-transform:uppercase}.lscms-joiner-status{font-size:9px;padding:3px 8px;border-radius:3px;font-weight:700;text-transform:uppercase;letter-spacing:.5px}.lscms-joiner-status.pending{color:#888;background:#2a2a2a}.lscms-joiner-status.processing{color:#3498db;background:rgba(52,152,219,.2)}.lscms-joiner-status.retrying{color:#f39c12;background:rgba(243,156,18,.2)}.lscms-joiner-status.success{color:#3db16b;background:rgba(61,177,107,.2)}.lscms-joiner-status.error{color:#e74c3c;background:rgba(231,76,60,.2)}.lscms-joiner-progress{margin-bottom:8px;color:#888;font-size:10px;text-transform:uppercase}.lscms-progress-bar{width:100%;height:6px;background:#2a2a2a;border-radius:3px;overflow:hidden;margin-top:12px}.lscms-progress-fill{height:100%;background:#3db16b;transition:width .3s}@media(max-width:768px){.lscms-content{width:98%;margin:5px}.lscms-header{padding:8px 12px}.lscms-body{padding:10px 12px}.lscms-list{max-height:200px}.lscms-textarea{height:80px}}'
    }));
    const btn = Object.assign(document.createElement('button'), {
            className: 'lscms-btn',
            textContent: '📲'
        }),
        tooltip = Object.assign(document.createElement('div'), {
            className: 'lscms-tooltip'
        }),
        modal = Object.assign(document.createElement('div'), {
            id: 'lscmsModal',
            innerHTML: '<div class="lscms-content"><div class="lscms-header"><h2>📲 LS CHAT GROUP SENDER</h2><button class="lscms-close">✕</button></div><div class="lscms-tabs"><button class="lscms-tab active" data-tab="dashboard">DASHBOARD</button><button class="lscms-tab" data-tab="presets">PRESETS</button><button class="lscms-tab" data-tab="joiner">LS CENTRAL</button></div><div class="lscms-body"><div class="lscms-panel active" id="dashboard"><div class="lscms-controls"><div class="lscms-controls-left"><div class="lscms-section-header">SELECT GROUPS<button class="lscms-info-btn" data-tooltip="Choose which group chats will receive your message. Use the filter to quickly find specific groups. Please respect admin-only groups.">i</button></div><div class="lscms-count" id="lscmsCount">LOADING...</div></div><div class="lscms-controls-right"><button id="lscmsSelectAll" class="lscms-btn-sm primary">SELECT ALL</button><button id="lscmsDeselectAll" class="lscms-btn-sm">DESELECT ALL</button></div></div><div class="lscms-filter"><input type="text" id="lscmsFilter" placeholder="🔍 FILTER GROUPS..."></div><div class="lscms-list" id="lscmsList"></div><div class="lscms-section-header standalone">COMPOSE MESSAGE<button class="lscms-info-btn" data-tooltip="Type the message that will be sent to all selected groups.">i</button></div><div class="lscms-textarea-wrapper"><textarea class="lscms-textarea" id="lscmsMsg" placeholder="TYPE YOUR MESSAGE..."></textarea><div class="lscms-char-count" id="lscmsCharCount">0</div></div><div class="lscms-send-wrapper"><div class="lscms-delay-wrapper"><label>DELAY (MS):</label><input type="number" id="lscmsDelay" value="500" min="0" step="50"></div><button class="lscms-send" id="lscmsSend">SEND TO SELECTED GROUPS</button></div><div class="lscms-status" id="lscmsStatus"></div></div><div class="lscms-panel" id="presets"><div class="lscms-section-header standalone">SAVED PRESETS<button class="lscms-info-btn" data-tooltip="Presets save your selected groups and message for quick access. Click LOAD to apply a preset.">i</button></div><div class="lscms-preset-list" id="lscmsPresetList"></div><div class="lscms-preset-save"><input type="text" id="lscmsPresetName" placeholder="ENTER PRESET NAME..." maxlength="30"><button id="lscmsSavePreset">💾 SAVE</button></div><div style="margin-top:16px;padding-top:16px;border-top:1px solid #2a2a2a"><div class="lscms-section-header standalone">DANGER ZONE<button class="lscms-info-btn" data-tooltip="Clear all extension data including presets, timestamps, and settings. This action cannot be undone and will refresh the page.">i</button></div><button id="lscmsClearStorage" class="lscms-btn-sm danger" style="width:100%">🗑️ CLEAR ALL DATA</button></div></div><div class="lscms-panel" id="joiner"><div class="lscms-section-header standalone">LS CENTRAL COLLECTION<button class="lscms-info-btn" data-tooltip="Join all groups from the LS Central collection. This will open each invite link in the background.">i</button></div><div class="lscms-joiner-progress" id="lscmsJoinerProgress">CLICK "JOIN ALL GROUPS" TO START</div><div class="lscms-controls" style="margin-top:12px"><button id="lscmsJoinAll" class="lscms-btn-sm primary">JOIN ALL GROUPS</button><button id="lscmsStopJoin" class="lscms-btn-sm danger" style="display:none">STOP</button></div><div class="lscms-progress-bar"><div class="lscms-progress-fill" id="lscmsProgressFill" style="width:0%"></div></div><div class="lscms-joiner-list" id="lscmsJoinerList"></div></div></div></div>'
        });
    document.body.append(btn, tooltip, modal);
    let allGroups = [],
        joinStop = !1,
        saveTimer = 0,
        cancelTimeout = null,
        isCancelling = !1;
    const sent = new Set(),
        $ = id => document.getElementById(id),
        $$ = s => document.querySelectorAll(s),
        showStatus = (msg, type = 'info') => {
            const el = $('lscmsStatus');
            if (!el) return;
            el.textContent = msg;
            el.className = 'lscms-status ' + type;
            el.style.display = 'block';
            type !== 'info' && setTimeout(() => el.style.display = 'none', 5e3)
        },
        getSelected = () => Array.from($$('#lscmsList input:checked')).map(cb => cb.value).filter(validateId),
        setSelected = groups => {
            $$('#lscmsList input').forEach(cb => cb.checked = groups.includes(cb.value));
            updateBtn()
        },
        updateBtn = () => {
            const b = $('lscmsSend'),
                cnt = getSelected().length;
            b && !isCancelling && (b.textContent = 'SEND TO SELECTED GROUPS' + (cnt > 0 ? ' (' + cnt + ')' : ''))
        },
        updateChar = () => {
            const txt = $('lscmsMsg'),
                cnt = $('lscmsCharCount');
            txt && cnt && (cnt.textContent = txt.value.length)
        },
        saveLast = () => Store.set(S.L, {
            groups: getSelected(),
            message: $('lscmsMsg')?.value || ''
        }),
        loadLast = () => {
            const last = Store.get(S.L);
            if (!last) return;
            last.groups && setSelected(last.groups);
            if (last.message) {
                const el = $('lscmsMsg');
                el && (el.value = last.message);
                updateChar()
            }
        },
        loadGroups = () => {
            const list = $('lscmsList'),
                count = $('lscmsCount');
            if (!list || !count) return;
            allGroups = [];
            $$('.conversationbar').forEach(conv => {
                if (!conv.querySelector('.avatar-group')) return;
                const id = conv.id.replace('conversation_', ''),
                    name = (conv.querySelector('h5')?.textContent || 'Unknown').trim();
                id && name && validateId(id) && allGroups.push({
                    id,
                    name
                })
            });
            allGroups.sort((a, b) => a.name.localeCompare(b.name));
            filterGroups('')
        },
        filterGroups = query => {
            const list = $('lscmsList'),
                count = $('lscmsCount');
            if (!list || !count) return;
            const q = query.toLowerCase(),
                filtered = allGroups.filter(g => g.name.toLowerCase().includes(q));
            count.textContent = filtered.length + ' GROUP' + (filtered.length !== 1 ? 'S' : '') + ' AVAILABLE';
            if (!filtered.length) {
                list.innerHTML = '<div class="lscms-empty">NO GROUPS FOUND</div>';
                return
            }
            const frag = document.createDocumentFragment();
            filtered.forEach(({
                id,
                name
            }) => {
                const item = document.createElement('div'),
                    cb = Object.assign(document.createElement('input'), {
                        type: 'checkbox',
                        id: 'chat_' + id,
                        value: id,
                        onchange: updateBtn
                    }),
                    lbl = Object.assign(document.createElement('label'), {
                        htmlFor: 'chat_' + id,
                        textContent: '👥 ' + name
                    });
                item.className = 'lscms-item';
                item.append(cb, lbl);
                const ts = Timestamps.format(id);
                ts && item.appendChild(Object.assign(document.createElement('span'), {
                    className: 'lscms-timestamp',
                    textContent: ts
                }));
                frag.appendChild(item)
            });
            list.innerHTML = '';
            list.appendChild(frag)
        },
        updatePresets = () => {
            const cont = $('lscmsPresetList');
            if (!cont) return;
            const presets = Presets.getAll();
            if (!presets.length) {
                cont.innerHTML = '<div class="lscms-empty">NO SAVED PRESETS YET.<br><br>TO CREATE A PRESET:<br>1. GO TO DASHBOARD TAB<br>2. SELECT YOUR GROUPS<br>3. TYPE YOUR MESSAGE<br>4. RETURN TO PRESETS<br>5. ENTER PRESET NAME AND SAVE</div>';
                return
            }
            const frag = document.createDocumentFragment();
            presets.sort((a, b) => b.updated - a.updated).forEach(p => {
                const item = document.createElement('div'),
                    info = document.createElement('div'),
                    name = Object.assign(document.createElement('div'), {
                        className: 'lscms-preset-name',
                        textContent: p.name
                    }),
                    meta = Object.assign(document.createElement('div'), {
                        className: 'lscms-preset-meta',
                        textContent: p.groups.length + ' GROUPS • ' + new Date(p.updated).toLocaleDateString()
                    }),
                    acts = document.createElement('div'),
                    load = Object.assign(document.createElement('button'), {
                        className: 'lscms-preset-load',
                        textContent: 'LOAD',
                        onclick: () => {
                            document.querySelector('[data-tab="dashboard"]').click();
                            setTimeout(() => {
                                loadGroups();
                                setTimeout(() => {
                                    setSelected(p.groups);
                                    const el = $('lscmsMsg');
                                    el && (el.value = p.message);
                                    updateChar();
                                    showStatus('LOADED PRESET "' + p.name + '"', 'success')
                                }, 100)
                            }, 50)
                        }
                    }),
                    del = Object.assign(document.createElement('button'), {
                        className: 'lscms-preset-delete',
                        textContent: 'DELETE',
                        onclick: () => {
                            confirm('DELETE PRESET "' + p.name + '"?') && (Presets.delete(p.name), updatePresets(), showStatus('DELETED PRESET "' + p.name + '"', 'success'))
                        }
                    });
                item.className = 'lscms-preset-item';
                info.className = 'lscms-preset-info';
                acts.className = 'lscms-preset-actions';
                info.append(name, meta);
                acts.append(load, del);
                item.append(info, acts);
                frag.appendChild(item)
            });
            cont.innerHTML = '';
            cont.appendChild(frag)
        },
        sendWithRetry = async (id, msg, max = 2) => {
            if (!validateId(id)) return {
                success: !1,
                error: 'invalid id'
            };
            for (let i = 0; i <= max; i++) {
                try {
                    const res = await fetch('https://chat.gta.world/app/ajax/send_message.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                            'X-Requested-With': 'XMLHttpRequest'
                        },
                        body: new URLSearchParams({
                            msg,
                            picture: '',
                            chat: id,
                            user_id: '0',
                            type: '0'
                        }),
                        credentials: 'include'
                    });
                    if (res.ok) {
                        const txt = await res.text();
                        if (txt.includes('error') || txt.includes('fail')) {
                            if (i < max) {
                                await new Promise(r => setTimeout(r, 2 ** i * 1e3));
                                continue
                            }
                            return {
                                success: !1,
                                error: 'rejected'
                            }
                        }
                        return {
                            success: !0
                        }
                    }
                    if (i < max) {
                        await new Promise(r => setTimeout(r, 2 ** i * 1e3));
                        continue
                    }
                    return {
                        success: !1,
                        error: res.status
                    }
                } catch (e) {
                    if (i < max) {
                        await new Promise(r => setTimeout(r, 2 ** i * 1e3));
                        continue
                    }
                    return {
                        success: !1,
                        error: e.message
                    }
                }
            }
            return {
                success: !1,
                error: 'max retries'
            }
        }, fetchWithRetry = async (url, max = 2) => {
            for (let i = 0; i <= max; i++) {
                try {
                    const res = await fetch(url, {
                        signal: AbortSignal.timeout(8e3)
                    });
                    if (res.ok) return {
                        success: !0,
                        response: res
                    };
                    if (i < max) {
                        await new Promise(r => setTimeout(r, 2 ** i * 1e3));
                        continue
                    }
                    return {
                        success: !1,
                        status: res.status
                    }
                } catch (e) {
                    if (i < max) {
                        await new Promise(r => setTimeout(r, 2 ** i * 1e3));
                        continue
                    }
                    return {
                        success: !1,
                        error: e.message
                    }
                }
            }
            return {
                success: !1,
                error: 'max retries'
            }
        }, loadJoiner = async () => {
            const cont = $('lscmsJoinerList'),
                prog = $('lscmsJoinerProgress'),
                fill = $('lscmsProgressFill'),
                jBtn = $('lscmsJoinAll'),
                sBtn = $('lscmsStopJoin');
            if (!cont || !prog || !fill || !jBtn || !sBtn) return;
            jBtn.disabled = !0;
            sBtn.style.display = 'inline-block';
            joinStop = !1;
            prog.textContent = 'LOADING GROUPS FROM LS CENTRAL...';
            try {
                const fetchRes = await fetchWithRetry('https://raw.githubusercontent.com/chipigtaw/chipigtaw.github.io/refs/heads/main/chats.js');
                if (!fetchRes.success) throw new Error('Failed to fetch: ' + (fetchRes.error || fetchRes.status));
                const txt = await fetchRes.response.text();
                if (txt.length > 5e5) throw new Error('Response too large');
                const match = txt.match(/const\s+c\s*=\s*(\[[\s\S]*?\]);/);
                if (!match) throw new Error('Failed to parse');
                const groups = new Function('return ' + match[1])();
                if (!Array.isArray(groups) || !groups.length) throw new Error('Invalid data');
                cont.innerHTML = '';
                const frag = document.createDocumentFragment();
                groups.forEach(g => {
                    const item = Object.assign(document.createElement('div'), {
                            className: 'lscms-joiner-item',
                            id: 'joiner_' + g.id
                        }),
                        name = Object.assign(document.createElement('div'), {
                            className: 'lscms-joiner-name',
                            textContent: g.name
                        }),
                        stat = Object.assign(document.createElement('div'), {
                            className: 'lscms-joiner-status pending',
                            textContent: 'PENDING'
                        });
                    item.append(name, stat);
                    frag.appendChild(item)
                });
                cont.appendChild(frag);
                prog.textContent = 'READY TO JOIN ' + groups.length + ' GROUPS';
                fill.style.width = '0%';
                for (let i = 0; i < groups.length; i++) {
                    if (joinStop) {
                        prog.textContent = 'STOPPED BY USER';
                        break
                    }
                    const g = groups[i],
                        stat = $('joiner_' + g.id)?.querySelector('.lscms-joiner-status');
                    prog.textContent = 'JOINING ' + (i + 1) + '/' + groups.length + ': ' + g.name.toUpperCase();
                    fill.style.width = (i + 1) / groups.length * 100 + '%';
                    let success = !1;
                    for (let retry = 0; retry <= 2; retry++) {
                        if (retry > 0 && stat) {
                            stat.className = 'lscms-joiner-status retrying';
                            stat.textContent = 'RETRYING...'
                        } else if (stat) {
                            stat.className = 'lscms-joiner-status processing';
                            stat.textContent = 'PROCESSING...'
                        }
                        try {
                            const ifr = Object.assign(document.createElement('iframe'), {
                                style: 'display:none',
                                src: g.link,
                                sandbox: 'allow-same-origin allow-scripts allow-top-navigation'
                            });
                            document.body.appendChild(ifr);
                            await new Promise((resolve, reject) => {
                                const to = setTimeout(() => reject(new Error('Timeout')), 8e3);
                                ifr.onload = () => {
                                    clearTimeout(to);
                                    resolve()
                                };
                                ifr.onerror = () => {
                                    clearTimeout(to);
                                    reject(new Error('Failed'))
                                }
                            });
                            setTimeout(() => ifr.remove(), 2e3);
                            success = !0;
                            break
                        } catch (e) {
                            if (retry < 2) await new Promise(r => setTimeout(r, 2e3))
                        }
                    }
                    stat && (stat.className = success ? 'lscms-joiner-status success' : 'lscms-joiner-status error', stat.textContent = success ? 'COMPLETE' : 'FAILED');
                    i < groups.length - 1 && await new Promise(r => setTimeout(r, 2e3))
                }
                joinStop || (prog.textContent = 'COMPLETED! REFRESH YOUR CHAT LIST.', fill.style.width = '100%')
            } catch (e) {
                prog.textContent = 'ERROR: ' + e.message.toUpperCase();
                cont.innerHTML = '<div class="lscms-empty">FAILED TO LOAD GROUPS FROM LS CENTRAL</div>'
            } finally {
                jBtn.disabled = !1;
                sBtn.style.display = 'none'
            }
        };
    btn.onclick = () => {
        modal.classList.add('active');
        loadGroups();
        updatePresets();
        setTimeout(loadLast, 100);
        const sd = Store.get(S.D);
        sd !== null && ($('lscmsDelay').value = sd);
        updateChar()
    };
    modal.querySelector('.lscms-close').onclick = () => {
        saveLast();
        modal.classList.remove('active')
    };
    modal.onclick = e => {
        e.target === modal && (saveLast(), modal.classList.remove('active'))
    };
    $$('.lscms-tab').forEach(tab => {
        tab.onclick = () => {
            $$('.lscms-tab').forEach(t => t.classList.remove('active'));
            $$('.lscms-panel').forEach(p => p.classList.remove('active'));
            tab.classList.add('active');
            $(tab.dataset.tab).classList.add('active');
            tab.dataset.tab === 'presets' && updatePresets()
        }
    });
    document.addEventListener('mouseover', e => {
        if (e.target.classList.contains('lscms-info-btn')) {
            tooltip.textContent = e.target.dataset.tooltip;
            tooltip.classList.add('show');
            const rect = e.target.getBoundingClientRect();
            tooltip.style.left = rect.left + rect.width / 2 + 'px';
            tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
            tooltip.style.transform = 'translateX(-50%)'
        }
    });
    document.addEventListener('mouseout', e => {
        e.target.classList.contains('lscms-info-btn') && tooltip.classList.remove('show')
    });
    const f = $('lscmsFilter');
    f && f.addEventListener('input', e => filterGroups(e.target.value));
    const sa = $('lscmsSelectAll');
    sa && sa.addEventListener('click', () => {
        $$('#lscmsList input').forEach(cb => cb.checked = !0);
        updateBtn()
    });
    const da = $('lscmsDeselectAll');
    da && da.addEventListener('click', () => {
        $$('#lscmsList input').forEach(cb => cb.checked = !1);
        updateBtn()
    });
    const msg = $('lscmsMsg');
    msg && msg.addEventListener('input', () => {
        updateChar();
        clearTimeout(saveTimer);
        saveTimer = setTimeout(saveLast, 1e3)
    });
    const lst = $('lscmsList');
    lst && lst.addEventListener('change', () => {
        clearTimeout(saveTimer);
        saveTimer = setTimeout(saveLast, 1e3)
    });
    const dly = $('lscmsDelay');
    dly && dly.addEventListener('change', e => {
        const v = Math.max(0, parseInt(e.target.value) || 0);
        e.target.value = v;
        Store.set(S.D, v)
    });
    const sp = $('lscmsSavePreset');
    sp && sp.addEventListener('click', () => {
        const inp = $('lscmsPresetName'),
            name = inp.value.trim().substring(0, 30);
        if (!name) return showStatus('⚠️ ENTER PRESET NAME', 'error');
        if (!validateName(name)) return showStatus('⚠️ INVALID PRESET NAME', 'error');
        const sel = getSelected(),
            m = $('lscmsMsg')?.value.trim();
        if (!sel.length) return showStatus('⚠️ SELECT AT LEAST ONE GROUP', 'error');
        if (!m) return showStatus('⚠️ ENTER MESSAGE', 'error');
        Presets.save(name, sel, m) ? (inp.value = '', updatePresets(), showStatus('PRESET "' + name + '" SAVED', 'success')) : showStatus('FAILED TO SAVE PRESET', 'error')
    });
    const cs = $('lscmsClearStorage');
    cs && cs.addEventListener('click', () => {
        confirm('⚠️ This will delete this extension\'s data. This action cannot be undone and it will cause a page refresh. Continue?') && (Store.clear(), location.reload())
    });
    const ja = $('lscmsJoinAll');
    ja && ja.addEventListener('click', loadJoiner);
    const sj = $('lscmsStopJoin');
    sj && sj.addEventListener('click', () => {
        joinStop = !0
    });
    const sb = $('lscmsSend');
    sb && sb.addEventListener('click', async () => {
        if (isCancelling) {
            cancelTimeout && clearTimeout(cancelTimeout);
            isCancelling = !1;
            sb.classList.remove('cancelling');
            updateBtn();
            showStatus('SEND CANCELLED', 'info');
            return
        }
        const m = $('lscmsMsg')?.value.trim(),
            sel = getSelected(),
            dly = Math.max(0, parseInt($('lscmsDelay')?.value) || 500);
        if (!m) return showStatus('⚠️ ENTER MESSAGE', 'error');
        if (!sel.length) return showStatus('⚠️ SELECT AT LEAST ONE GROUP', 'error');
        if (m.length > 5e3) return showStatus('⚠️ MESSAGE TOO LONG', 'error');
        isCancelling = !0;
        sb.classList.add('cancelling');
        sb.textContent = 'SENDING. CLICK TO CANCEL...';
        await new Promise(resolve => {
            cancelTimeout = setTimeout(resolve, 3e3)
        });
        if (!isCancelling) {
            updateBtn();
            return
        }
        isCancelling = !1;
        sb.classList.remove('cancelling');
        sb.disabled = !0;
        updateBtn();
        showStatus('SENDING TO ' + sel.length + ' GROUP' + (sel.length !== 1 ? 'S' : '') + '...', 'info');
        let succ = 0,
            fail = 0,
            skip = 0;
        const errs = [];
        for (let i = 0; i < sel.length; i++) {
            const id = sel[i],
                name = document.querySelector('label[for="chat_' + id + '"]')?.textContent?.replace('👥 ', '') || id,
                key = id + '-' + m;
            if (sent.has(key)) {
                skip++;
                continue
            }
            const res = await sendWithRetry(id, m);
            res.success ? (succ++, sent.add(key), Timestamps.set(id)) : (fail++, errs.push(name + ' (' + res.error + ')'));
            const stat = $('lscmsStatus');
            stat && (stat.textContent = 'SENDING... ' + (i + 1) + '/' + sel.length + ' (' + succ + ' ✓' + (fail > 0 ? ', ' + fail + ' ✗' : '') + (skip > 0 ? ', ' + skip + ' SKIPPED' : '') + ')');
            i < sel.length - 1 && await new Promise(r => setTimeout(r, dly))
        }
        sb.disabled = !1;
        let result = '';
        if (!fail && !skip) {
            result = '✓ SUCCESSFULLY SENT TO ALL ' + succ + ' GROUPS!';
            showStatus(result, 'success');
            setTimeout(() => {
                const el = $('lscmsMsg');
                el && (el.value = '');
                $$('#lscmsList input').forEach(cb => cb.checked = !1);
                Store.remove(S.L);
                loadGroups();
                updateBtn();
                updateChar();
                sent.clear()
            }, 2500)
        } else {
            const parts = [];
            succ > 0 && parts.push(succ + ' SENT');
            fail > 0 && parts.push(fail + ' FAILED');
            skip > 0 && parts.push(skip + ' SKIPPED');
            result = parts.join(', ');
            errs.length && (result += '\n\n' + (errs.length <= 3 ? errs.join(', ') : errs.slice(0, 2).join(', ') + ' +' + (errs.length - 2) + ' MORE'));
            showStatus(result, fail > 0 ? 'error' : 'success');
            loadGroups()
        }
    })
})();