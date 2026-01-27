// ==UserScript==
// @name         Ascendency Core | Leadership Toolkit
// @namespace    https://ascendency-core.torn
// @version      0.0.2
// @description  Tools to assist leadership in Ascendency Core | Faction Newsletters to Discord | Newsletter Templates
// @author       Ascendency Core Team
// @match        https://www.torn.com/factions.php*
// @icon         https://images2.imgbox.com/c4/7c/C521P6E7_o.png
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @connect      discord.com
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/563906/Ascendency%20Core%20%7C%20Leadership%20Toolkit.user.js
// @updateURL https://update.greasyfork.org/scripts/563906/Ascendency%20Core%20%7C%20Leadership%20Toolkit.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const ID = 'ASC';
    const $ = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => ctx.querySelectorAll(sel);

    /* ========================================
       Styles
    ======================================== */
    const Styles = `
        #${ID}-controls {
            --bg: #1a1a1a; --bg2: #222; --border: #444; --text: #ccc; --accent: #5865F2;
            display: flex; flex-direction: column; gap: 8px; margin-top: 6px; padding: 8px 0; font-size: 12px;
        }
        #${ID}-controls .row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
        #${ID}-controls .label { font-weight: bold; color: #bfdddd; }
        #${ID}-controls .switch {
            position: relative; width: 36px; height: 20px; background: #555;
            border-radius: 10px; cursor: pointer; transition: background 0.2s; flex-shrink: 0;
        }
        #${ID}-controls .switch.on { background: var(--accent); }
        #${ID}-controls .switch::after {
            content: ''; position: absolute; top: 2px; left: 2px; width: 16px; height: 16px;
            background: #fff; border-radius: 50%; transition: left 0.2s;
        }
        #${ID}-controls .switch.on::after { left: 18px; }
        #${ID}-controls .btn {
            background: none; border: none; cursor: pointer; opacity: 0.7;
            transition: opacity 0.2s; padding: 4px; font-size: 14px; line-height: 1;
        }
        #${ID}-controls .btn:hover { opacity: 1; }
        #${ID}-controls .btn:disabled { opacity: 0.3; cursor: not-allowed; }
        #${ID}-controls .input, #${ID}-controls .select {
            padding: 6px 8px; background: var(--bg); border: 1px solid var(--border);
            border-radius: 4px; color: var(--text); font-size: 11px;
        }
        #${ID}-controls .input { flex: 1; min-width: 0; }
        #${ID}-controls .input.full { flex: 1 1 100%; margin-top: 4px; }
        #${ID}-controls .select { min-width: 120px; max-width: 200px; cursor: pointer; font-size: 12px; }
        #${ID}-controls .hide { display: none !important; }
        #${ID}-controls .modal {
            position: fixed; inset: 0; background: rgba(0,0,0,0.7);
            display: flex; align-items: center; justify-content: center; z-index: 10000; padding: 16px;
        }
        #${ID}-controls .modal-box {
            background: var(--bg2); border: 1px solid var(--border); border-radius: 8px;
            padding: 16px; width: 100%; max-width: 400px; max-height: 80vh; overflow-y: auto;
        }
        #${ID}-controls .modal-title { font-size: 14px; font-weight: bold; margin-bottom: 12px; color: #fff; }
        #${ID}-controls .field { margin-bottom: 12px; }
        #${ID}-controls .field label { display: block; margin-bottom: 4px; color: #aaa; font-size: 11px; }
        #${ID}-controls .field input, #${ID}-controls .field textarea {
            width: 100%; padding: 8px; background: var(--bg); border: 1px solid var(--border);
            border-radius: 4px; color: var(--text); font-size: 12px; box-sizing: border-box;
        }
        #${ID}-controls .field textarea { min-height: 150px; resize: vertical; font-family: monospace; }
        #${ID}-controls .modal-btns { display: flex; gap: 8px; justify-content: flex-end; margin-top: 16px; }
        #${ID}-controls .mbtn {
            padding: 6px 12px; background: #333; border: 1px solid var(--border);
            border-radius: 4px; color: var(--text); font-size: 11px; cursor: pointer;
        }
        #${ID}-controls .mbtn:hover { background: #444; }
        #${ID}-controls .mbtn.pri { background: var(--accent); border-color: var(--accent); color: #fff; }
        #${ID}-controls .mbtn.pri:hover { background: #4752c4; }
        #${ID}-controls .list { max-height: 200px; overflow-y: auto; border: 1px solid var(--border); border-radius: 4px; margin-bottom: 12px; }
        #${ID}-controls .item {
            display: flex; align-items: center; gap: 8px; padding: 8px;
            border-bottom: 1px solid #333; background: var(--bg);
        }
        #${ID}-controls .item:last-child { border-bottom: none; }
        #${ID}-controls .item-name { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--text); }
        #${ID}-controls .item-acts { display: flex; gap: 4px; }
    `;

    /* ========================================
       Utilities
    ======================================== */
    const esc = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

    const modal = (parent, title, content, onSave) => {
        const m = document.createElement('div');
        m.className = 'modal';
        m.innerHTML = `<div class="modal-box"><div class="modal-title">${title}</div>${content}<div class="modal-btns"><button class="mbtn" data-x="close">Cancel</button><button class="mbtn pri" data-x="save">Save</button></div></div>`;
        m.onclick = e => { if (e.target === m || e.target.dataset.x === 'close') m.remove(); };
        $('.mbtn.pri', m).onclick = () => onSave(m) !== false && m.remove();
        parent.appendChild(m);
        return m;
    };

    /* ========================================
       Templates Module
    ======================================== */
    const Templates = {
        KEY: `${ID}_templates`,
        DEF_DEL_KEY: `${ID}_def_deleted`,

        DEFAULT: {
            id: 'default',
            name: 'Newsletter Template',
            title: 'Ascendency Core | Faction Newsletter',
            content: `<div style="font-family:Verdana;color:#e6e6e6;background:#1b1b1b;padding:10px;border:2px solid #444;border-radius:8px;max-width:700px;margin:0 auto"><img style="width:100%;display:block;margin-bottom:10px;border-radius:4px" src="https://images2.imgbox.com/26/72/YQORiF9x_o.png" alt="Banner"><div style="font-size:22px;color:#ffcc33;font-weight:bold;text-align:center;margin-bottom:10px">Faction Newsletter</div><div style="font-size:14px;line-height:1.5;text-align:center">Welcome to this week's faction newsletter</div><hr style="border:1px solid #444;margin:14px 0"><div style="font-size:15px;color:#ffcc33;font-weight:bold;text-align:center;margin-bottom:6px">Placeholder</div><div style="font-size:14px;line-height:1.5">Placeholder</div><hr style="border:1px solid #333;margin:14px 0"><div style="font-size:15px;color:#ffcc33;font-weight:bold;text-align:center;margin-bottom:6px">Placeholder</div><div style="font-size:14px;line-height:1.5">Placeholder</div><hr style="border:1px solid #333;margin:14px 0"><div style="text-align:right;font-size:13px;color:#aaa">— Ascendency Core Leadership</div></div>`
        },

        isDefDeleted: () => GM_getValue(Templates.DEF_DEL_KEY, false),
        setDefDeleted: v => { GM_setValue(Templates.DEF_DEL_KEY, v); },
        get: () => GM_getValue(Templates.KEY, []),
        save: t => { GM_setValue(Templates.KEY, t); },

        add(name, title, content) {
            const t = this.get();
            t.push({ id: Date.now(), name, title, content });
            this.save(t);
        },

        update(id, name, title, content) {
            const t = this.get(), i = t.findIndex(x => x.id === id);
            if (i !== -1) { t[i] = { ...t[i], name, title, content }; this.save(t); }
        },

        delete(id) { this.save(this.get().filter(x => x.id !== id)); },

        move(id, dir) {
            const t = this.get(), i = t.findIndex(x => x.id === id), j = i + dir;
            if (i !== -1 && j >= 0 && j < t.length) { [t[i], t[j]] = [t[j], t[i]]; this.save(t); }
        },

        apply(id) {
            const tpl = id === 'default' ? this.DEFAULT : this.get().find(x => x.id === id);
            if (!tpl) return;
            const ti = $('.titleField___Rtn72'), ed = $('.editorContent___uEg52');
            if (ti && tpl.title) { ti.value = tpl.title; ti.dispatchEvent(new Event('input', { bubbles: true })); }
            if (ed && tpl.content) { ed.innerHTML = tpl.content; ed.dispatchEvent(new Event('input', { bubbles: true })); }
        },

        capture: () => ({ title: $('.titleField___Rtn72')?.value || '', content: $('.editorContent___uEg52')?.innerHTML || '' }),

        refreshSelect(sel) {
            const t = this.get(), cur = sel.value;
            sel.innerHTML = '<option value="">-- Select Template --</option>';
            if (!this.isDefDeleted()) sel.innerHTML += `<option value="default">${this.DEFAULT.name}</option>`;
            t.forEach(x => { sel.innerHTML += `<option value="${x.id}">${esc(x.name)}</option>`; });
            if ((cur === 'default' && !this.isDefDeleted()) || t.find(x => x.id == cur)) sel.value = cur;
        },

        showEdit(tpl = null) {
            const isEdit = !!tpl, cur = isEdit ? tpl : this.capture();
            modal($(`#${ID}-controls`), isEdit ? 'Edit Template' : 'Save as Template', `
                <div class="field"><label>Template Name</label><input id="${ID}-n" value="${esc(tpl?.name || '')}" placeholder="e.g., Weekly Update"></div>
                <div class="field"><label>Subject Line</label><input id="${ID}-t" value="${esc(cur.title)}"></div>
                <div class="field"><label>Content (HTML)</label><textarea id="${ID}-c">${esc(cur.content)}</textarea></div>
            `, m => {
                const name = $(`#${ID}-n`, m).value.trim(), title = $(`#${ID}-t`, m).value, content = $(`#${ID}-c`, m).value;
                if (!name) { alert('Enter a template name'); return false; }
                isEdit ? this.update(tpl.id, name, title, content) : this.add(name, title, content);
                this.refreshSelect($(`#${ID}-sel`));
            });
        },

        showManage() {
            const render = () => {
                const t = this.get(), showDef = !this.isDefDeleted();
                if (!t.length && !showDef) return '<div style="padding:16px;color:#666;text-align:center">No templates</div>';
                let h = showDef ? `<div class="item" data-id="default"><span class="item-name">${this.DEFAULT.name} <span style="color:#666;font-size:10px">(default)</span></span><div class="item-acts"><button class="btn" data-a="del">🗑️</button></div></div>` : '';
                h += t.map((x, i) => `<div class="item" data-id="${x.id}"><span class="item-name">${esc(x.name)}</span><div class="item-acts"><button class="btn" data-a="up" ${i === 0 ? 'disabled' : ''}>↑</button><button class="btn" data-a="down" ${i === t.length - 1 ? 'disabled' : ''}>↓</button><button class="btn" data-a="edit">✏️</button><button class="btn" data-a="del">🗑️</button></div></div>`).join('');
                return h;
            };

            const m = document.createElement('div');
            m.className = 'modal';
            m.innerHTML = `<div class="modal-box"><div class="modal-title">Manage Templates</div><div class="list" id="${ID}-list">${render()}</div><div class="modal-btns">${this.isDefDeleted() ? `<button class="mbtn" data-x="restore">Restore Default</button>` : ''}<button class="mbtn" data-x="close">Close</button></div></div>`;

            const refresh = () => {
                $(`#${ID}-list`, m).innerHTML = render();
                const btns = $('.modal-btns', m), rb = $('[data-x="restore"]', m);
                if (this.isDefDeleted() && !rb) {
                    const b = document.createElement('button');
                    b.className = 'mbtn'; b.dataset.x = 'restore'; b.textContent = 'Restore Default';
                    btns.insertBefore(b, btns.firstChild);
                } else if (!this.isDefDeleted() && rb) rb.remove();
                this.refreshSelect($(`#${ID}-sel`));
            };

            m.onclick = e => {
                if (e.target === m || e.target.dataset.x === 'close') { m.remove(); return; }
                if (e.target.dataset.x === 'restore') { this.setDefDeleted(false); refresh(); return; }
                const item = e.target.closest('.item');
                if (!item) return;
                const id = item.dataset.id, a = e.target.dataset.a;
                if (id === 'default') {
                    if (a === 'del' && confirm('Delete default template?')) { this.setDefDeleted(true); refresh(); }
                    return;
                }
                const nid = parseInt(id);
                if (a === 'up') { this.move(nid, -1); refresh(); }
                if (a === 'down') { this.move(nid, 1); refresh(); }
                if (a === 'del' && confirm('Delete this template?')) { this.delete(nid); refresh(); }
                if (a === 'edit') { m.remove(); const tpl = this.get().find(x => x.id === nid); if (tpl) this.showEdit(tpl); }
            };
            $(`#${ID}-controls`).appendChild(m);
        },

        createPanel() {
            const p = document.createElement('div');
            p.className = 'row';
            p.innerHTML = `<span class="label">Templates</span><select class="select" id="${ID}-sel"><option value="">-- Select Template --</option></select><button class="btn" data-t="apply" title="Apply">✅</button><button class="btn" data-t="save" title="Save Current">💾</button><button class="btn" data-t="manage" title="Manage">📋</button>`;
            const sel = $(`#${ID}-sel`, p);
            this.refreshSelect(sel);
            sel.ondblclick = () => sel.value && this.apply(sel.value === 'default' ? 'default' : parseInt(sel.value));
            p.onclick = e => {
                const a = e.target.dataset.t;
                if (a === 'apply') sel.value ? this.apply(sel.value === 'default' ? 'default' : parseInt(sel.value)) : alert('Select a template');
                if (a === 'save') this.showEdit();
                if (a === 'manage') this.showManage();
            };
            return p;
        }
    };

    /* ========================================
       Discord Module
    ======================================== */
    const Discord = {
        DEFAULT_HOOK: 'https://discord.com/api/webhooks/1464524548824367177/DpOuY32ZJasHDn68N0lBMqmZPlA8jn9rpJC4ywBZSm2CKsH67xAJUNJ9SmrZWzhlO5vo',

        getSettings: () => ({ enabled: GM_getValue(`${ID}_dc_on`, true), webhook: GM_getValue(`${ID}_dc_hook`, Discord.DEFAULT_HOOK) }),
        set: (k, v) => { GM_setValue(`${ID}_dc_${k}`, v); },

        toMarkdown(html) {
            const t = document.createElement('div');
            t.innerHTML = html;
            [['strong,b', s => `**${s}**`], ['em,i', s => `*${s}*`], ['u', s => `__${s}__`], ['s,strike', s => `~~${s}~~`], ['br', () => '\n'], ['p', s => `${s}\n\n`]]
                .forEach(([sel, fn]) => $$(sel, t).forEach(el => { el.outerHTML = fn(el.textContent); }));
            $$('a', t).forEach(el => { el.outerHTML = `[${el.textContent}](${el.href})`; });
            $$('blockquote', t).forEach(el => { el.outerHTML = el.textContent.split('\n').map(l => `> ${l}`).join('\n'); });
            return t.textContent.trim();
        },

        async send(title, content) {
            const s = this.getSettings();
            if (!s.enabled || !s.webhook) return { success: false, reason: 'disabled or no webhook' };
            const imgs = [...content.matchAll(/<img[^>]+src=["']([^"']+)["']/gi)].map(m => m[1]);
            const embeds = [{ title: `📰 ${title}`, description: this.toMarkdown(content).substring(0, 4096), color: 0xC83232, footer: { text: 'Kyoto Syndicate Newsletter' }, timestamp: new Date().toISOString(), ...(imgs[0] && { image: { url: imgs[0] } }) }];
            imgs.slice(1, 10).forEach(url => embeds.push({ color: 0xC83232, image: { url } }));

            return new Promise(res => GM_xmlhttpRequest({
                method: 'POST', url: s.webhook, headers: { 'Content-Type': 'application/json' },
                data: JSON.stringify({ embeds }),
                onload: r => res({ success: r.status >= 200 && r.status < 300 }),
                onerror: () => res({ success: false })
            }));
        },

        createPanel() {
            const s = this.getSettings();
            const p = document.createElement('div');
            p.className = 'row';
            p.innerHTML = `<span class="label">Send to Discord?</span><div class="switch ${s.enabled ? 'on' : ''}" data-dc="toggle"></div><button class="btn" data-dc="cfg" title="Configure Webhook">⚙️</button><input type="text" class="input full hide" id="${ID}-hook" placeholder="Webhook URL" value="${s.webhook}">`;
            $('[data-dc="toggle"]', p).onclick = e => { const on = !this.getSettings().enabled; this.set('on', on); e.target.classList.toggle('on', on); };
            $('[data-dc="cfg"]', p).onclick = () => $(`#${ID}-hook`, p).classList.toggle('hide');
            $(`#${ID}-hook`, p).onchange = e => { this.set('hook', e.target.value); };
            return p;
        },

        hook(btn) {
            if (btn.dataset.hooked) return;
            btn.dataset.hooked = '1';
            btn.addEventListener('click', async () => {
                const title = $('.titleField___Rtn72')?.value || 'Faction Newsletter';
                const content = $('.editorContent___uEg52')?.innerHTML;
                if (content) {
                    const res = await this.send(title, content);
                    // Optional: Add visual feedback here
                }
            }, true);
        }
    };

    /* ========================================
       initialization
    ======================================== */
    const init = () => {
        new MutationObserver(() => {
            if (!location.hash.includes('option=newsletter')) return;
            const btn = $('.actionButtonsWrapper___KGo1d button[aria-label="Send newsletter"]');
            const desc = $('.desc');
            if (btn && desc && !$(`#${ID}-controls`)) {
                const c = document.createElement('div');
                c.id = `${ID}-controls`;
                c.innerHTML = `<style>${Styles}</style>`;
                c.appendChild(Discord.createPanel());
                c.appendChild(Templates.createPanel());
                desc.appendChild(c);
                Discord.hook(btn);
            }
        }).observe(document.body, { childList: true, subtree: true });
    };

    init();
})();