// ==UserScript==
// @name         NodeSeek Callout
// @namespace    http://www.nodeseek.com/
// @version      1.0
// @description  NodeSeek & DeepFlood 论坛 Obsidian 风格 Callout 渲染 + 编辑器快捷插入
// @author       dabao
// @license      GPL-3.0
// @match        *://www.nodeseek.com/post-*
// @match        *://www.nodeseek.com/new-discussion
// @match        *://www.deepflood.com/post-*
// @match        *://www.deepflood.com/new-discussion
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/557635/NodeSeek%20Callout.user.js
// @updateURL https://update.greasyfork.org/scripts/557635/NodeSeek%20Callout.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==================== 配置 ====================
    const COLORS = {
        blue: '8, 109, 224', green: '8, 185, 78', orange: '236, 117, 0',
        red: '233, 49, 71', cyan: '0, 191, 188', grey: '158, 158, 158', purple: '120, 82, 238'
    };

    const TYPES = {
        note:    { n: '笔记', c: 'blue', i: 'M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Zm-2 2 4 4', show: 1 },
        info:    { n: '信息', c: 'blue', i: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 14v-4m0-4h.01', show: 1 },
        todo:    { n: '待办', c: 'blue', i: 'M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4 12 14.01l-3-3', show: 1 },
        success: { n: '成功', c: 'green', i: 'M20 6 9 17l-5-5', show: 1 },
        done:    { n: '完成', c: 'green', i: 'M20 6 9 17l-5-5', show: 1 },
        warning: { n: '警告', c: 'orange', i: 'm21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3ZM12 9v4m0 4h.01', show: 1 },
        caution: { n: '注意', c: 'orange', i: 'm21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3ZM12 9v4m0 4h.01' },
        error:   { n: '错误', c: 'red', i: 'M7.86 2h8.28L22 7.86v8.28L16.14 22H7.86L2 16.14V7.86L7.86 2ZM15 9l-6 6m0-6 6 6', show: 1 },
        danger:  { n: '危险', c: 'red', i: 'M13 2 3 14h9l-1 8 10-12h-9l1-8', show: 1 },
        fail:    { n: '失败', c: 'red', i: 'M18 6 6 18M6 6l12 12', show: 1 },
        bug:     { n: 'Bug', c: 'red', i: 'm8 2 1.88 1.88M14.12 3.88 16 2M9 7.13v-1a3 3 0 1 1 6 0v1M12 20a6 6 0 0 1-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3a6 6 0 0 1-6 6Zm0 0v-9', show: 1 },
        tip:     { n: '提示', c: 'cyan', i: 'M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-5 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.1.2-2.1.5-3z', show: 1 },
        hint:    { n: '线索', c: 'cyan', i: 'M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-5 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.1.2-2.1.5-3z' },
        cite:    { n: '引述', c: 'grey', i: 'M3 21c3 0 7-1 7-8V5c0-1.25-.76-2-2-2H4c-1.25 0-2 .75-2 1.97V11c0 1.25.75 2 2 2s1 1 1 2-1 2-2 2-1 0-1 1v3c0 1 0 1 1 1zm12 0c3 0 7-1 7-8V5c0-1.25-.76-2-2-2h-4c-1.25 0-2 .75-2 1.97V11c0 1.25.75 2 2 2s1 1 1 2-1 2-2 2-1 0-1 1v3c0 1 0 1 1 1z' },
        example: { n: '示例', c: 'purple', i: 'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01', show: 1 },
        important: { n: '重要', c: 'orange', i: 'm21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3ZM12 9v4m0 4h.01', show: 1 }
    };

    const MENU_TYPES = Object.keys(TYPES).filter(k => TYPES[k].show);
    const CALLOUT_RE = /^\[!(\w+)\]([+-])?(?:\s+([^<\n]+))?(?:<br\s*\/?>)?([\s\S]*)$/i;

    // ==================== 工具函数 ====================
    const $ = (s, p = document) => p.querySelector(s);
    const $$ = (s, p = document) => p.querySelectorAll(s);
    const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html) e.innerHTML = html; return e; };
    const svg = (d) => `<svg viewBox="0 0 24 24"><path d="${d}"/></svg>`;
    const debounce = (fn, ms) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };
    const getVAttr = (e) => e && [...e.attributes].find(a => a.name.startsWith('data-v-'))?.name;
    const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

    // ==================== 样式 ====================
    const CSS = `
.obsidian-callout{--c:8,109,224;background:rgba(var(--c),.1)!important;border-left:4px solid rgb(var(--c))!important;border-radius:4px!important;margin:1em!important;padding:0!important;overflow:hidden!important;font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif}
.obsidian-callout .obsidian-callout{margin:8px 0!important}
.obsidian-callout-title{display:flex;align-items:center;padding:12px 16px;font-weight:600;color:rgb(var(--c));line-height:1.5}
.obsidian-callout-icon{width:20px;height:20px;margin-right:10px;flex-shrink:0}
.obsidian-callout-icon svg{width:100%;height:100%;fill:none;stroke:currentColor;stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round}
.obsidian-callout-content{padding:0 16px 12px;font-size:.95em;line-height:1.6;opacity:.9}
.obsidian-callout-content>:first-child{margin-top:0}.obsidian-callout-content>:last-child{margin-bottom:0}
details.obsidian-callout>summary{list-style:none;cursor:pointer;user-select:none}
details.obsidian-callout[open]>summary{padding:0!important;margin:0!important}
details.obsidian-callout summary::-webkit-details-marker{display:none}
details.obsidian-callout summary:hover{background:rgba(var(--c),.05)}
details.obsidian-callout>summary .obsidian-callout-title::after{content:"";width:18px;height:18px;margin-left:auto;background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2.5'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E") no-repeat;transition:transform .2s;opacity:.5;flex-shrink:0}
details.obsidian-callout[open]>summary .obsidian-callout-title::after{transform:rotate(180deg)}
.callout-inserter-wrapper{position:relative;display:inline-flex;align-items:center}
.callout-inserter-btn{padding:0;border:none;background:0 0;cursor:pointer;display:flex;color:currentColor}
.callout-inserter-btn:hover{opacity:.7}
.callout-inserter-dropdown{position:absolute;top:100%;left:50%;transform:translateX(-50%);margin-top:8px;background:#fff;border:1px solid #e0e0e0;border-radius:6px;box-shadow:0 4px 12px rgba(0,0,0,.15);z-index:1000;min-width:120px;display:none;overflow:hidden}
.callout-inserter-dropdown.show{display:block}
.callout-inserter-item{padding:8px 12px;cursor:pointer;display:flex;align-items:center;gap:8px;font-size:13px;transition:background .15s}
.callout-inserter-item:hover{background:#f5f5f5}
.callout-inserter-dot{width:10px;height:10px;border-radius:50%;flex-shrink:0}
@media(prefers-color-scheme:dark){.obsidian-callout{background:rgba(var(--c),.2)!important}details.obsidian-callout .obsidian-callout-title::after{filter:invert(1)}.callout-inserter-dropdown{background:#2d2d2d;border-color:#444}.callout-inserter-item{color:#ddd}.callout-inserter-item:hover{background:#3d3d3d}}`;

    function injectStyles() {
        if ($('#obsidian-callout-styles')) return;
        const s = el('style'); s.id = 'obsidian-callout-styles'; s.textContent = CSS;
        document.head.appendChild(s);
    }

    // ==================== 渲染 ====================
    function renderCallout(bq) {
        if (bq.classList.contains('oc-done')) return;
        bq.classList.add('oc-done');
        $$(':scope > blockquote', bq).forEach(renderCallout);

        const p = $(':scope > p', bq);
        const m = (p?.innerHTML.trim() || '').match(CALLOUT_RE);
        if (!m) return;

        const [, type, fold, title, content] = m;
        const t = TYPES[type.toLowerCase()] || TYPES.note;
        const isFold = fold === '+' || fold === '-';

        const wrap = el(isFold ? 'details' : 'div', 'obsidian-callout');
        wrap.style.setProperty('--c', COLORS[t.c]);
        if (fold === '+') wrap.open = true;

        const titleEl = el('div', 'obsidian-callout-title', `<span class="obsidian-callout-icon">${svg(t.i)}</span>${title?.trim() || cap(type)}`);
        if (isFold) { const sum = el('summary'); sum.appendChild(titleEl); wrap.appendChild(sum); }
        else wrap.appendChild(titleEl);

        const cont = el('div', 'obsidian-callout-content');
        if (content?.trim()) { const d = el('div'); d.innerHTML = content.trim(); cont.appendChild(d); }
        $$(':scope > .obsidian-callout', bq).forEach(n => cont.appendChild(n));
        if (cont.childNodes.length) wrap.appendChild(cont);

        bq.replaceWith(wrap);
    }

    function render() {
        $$('.post-content blockquote:not(.oc-done)').forEach(bq => {
            if (!bq.closest('blockquote.oc-done')) renderCallout(bq);
        });
    }

    // ==================== 编辑器 ====================
    function insertCallout(editor, type) {
        try {
            const cm = $('.CodeMirror', editor)?.CodeMirror;
            if (!cm) return;
            const doc = cm.getDoc();
            let cur = doc.getCursor();
            const lvl = (doc.getLine(cur.line).match(/^(>\s*)+/)?.[0].match(/>/g) || []).length;

            if (lvl > 0) {
                let last = cur.line;
                for (let i = cur.line + 1; i < doc.lineCount(); i++) {
                    if (doc.getLine(i).match(/^>\s*/)) last = i; else break;
                }
                cur = { line: last, ch: doc.getLine(last).length };
            }

            const pre = lvl > 0 ? '>'.repeat(lvl + 1) + ' ' : '> ';
            doc.replaceRange((lvl > 0 ? '\n' : '') + `${pre}[!${type}] \n${pre}`, cur);
            doc.setCursor({ line: cur.line + (lvl > 0 ? 1 : 0), ch: `${pre}[!${type}] `.length });
            cm.focus();
        } catch (e) { console.error('[Callout]', e); }
    }

    let clickBound = false;
    function createInserter(editor) {
        const bar = $('.mde-toolbar', editor);
        if (!bar || $('.callout-inserter-wrapper', bar)) return;

        const vAttr = getVAttr($('.toolbar-item', bar));
        const setV = (e) => vAttr && e.setAttribute(vAttr, '');

        const wrap = el('span', 'callout-inserter-wrapper toolbar-item');
        wrap.title = 'Callout'; setV(wrap);

        const btn = el('span', 'callout-inserter-btn i-icon', `<svg width="16" height="16" viewBox="0 0 48 48" fill="none"><path d="M44 8H4v30h15l5 5 5-5h15V8Z" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M24 18v10" stroke="currentColor" stroke-width="4" stroke-linecap="round"/><circle cx="24" cy="33" r="2" fill="currentColor"/></svg>`);
        setV(btn);

        const drop = el('div', 'callout-inserter-dropdown');
        MENU_TYPES.forEach(type => {
            const t = TYPES[type];
            const item = el('div', 'callout-inserter-item', `<span class="callout-inserter-dot" style="background:rgb(${COLORS[t.c]})"></span>${t.n || cap(type)}`);
            item.onclick = (e) => { e.stopPropagation(); insertCallout(editor, type); drop.classList.remove('show'); };
            drop.appendChild(item);
        });

        btn.onclick = (e) => { e.stopPropagation(); $$('.callout-inserter-dropdown.show').forEach(d => d !== drop && d.classList.remove('show')); drop.classList.toggle('show'); };
        if (!clickBound) { document.addEventListener('click', () => $$('.callout-inserter-dropdown.show').forEach(d => d.classList.remove('show'))); clickBound = true; }

        const sep = el('div', 'sep'); setV(sep);
        wrap.append(btn, drop);
        bar.append(sep, wrap);
    }

    // ==================== 初始化 ====================
    const update = debounce(() => { render(); const e = $('.md-editor'); if (e) createInserter(e); }, 100);

    injectStyles();
    window.addEventListener('load', update);

    new MutationObserver(() => { update(); }).observe($('.nsk-post-wrapper,.post-content,#editor-body'), { childList: true, subtree: true });
})();
