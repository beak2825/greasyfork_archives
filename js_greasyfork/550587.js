// ==UserScript==
// @name         Collapse ChatGPT Code Blocks (robust)
// @namespace    https://github.com/you/collapse-chatgpt-code
// @version      1.2.1
// @description  Collapse/expand user & assistant code blocks on chat.openai.com/chatgpt.com
// @author       Chef D
// @match        https://chat.openai.com/*
// @match        https://chatgpt.com/*
// @run-at       document-end
// @grant        none
// @noframes
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/550587/Collapse%20ChatGPT%20Code%20Blocks%20%28robust%29.user.js
// @updateURL https://update.greasyfork.org/scripts/550587/Collapse%20ChatGPT%20Code%20Blocks%20%28robust%29.meta.js
// ==/UserScript==

(() => {
    'use strict';
    let __cgptId = 0;
    const nextId = () => String(++__cgptId);

    // small badge to confirm load
    (function addLoadedBadge(){
        const id = 'cgpt-collapse-loaded-badge';
        if (document.getElementById(id)) return;
        const b = document.createElement('div');
        b.id = id;
        b.textContent = 'collapse-code: active';
        b.style.cssText = [
            'position:fixed;','bottom:6px;','right:8px;',
            'padding:2px 6px;','font:11px/1 system-ui,sans-serif;',
            'background:rgba(0,0,0,.5);','color:#fff;','border-radius:4px;',
            'z-index:999999;','pointer-events:none;','opacity:.35;'
        ].join('');
        document.body.appendChild(b);
        setTimeout(()=> b.remove(), 2000);
    })();

    // icons
    const TOGGLE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" style="transition:transform 120ms ease"><path d="M8.12 9.29L12 13.17l3.88-3.88a1 1 0 011.41 1.41l-4.59 4.59a1 1 0 01-1.41 0L6.71 10.7a1 1 0 111.41-1.41z" fill="currentColor"/></svg>`;
    const COPY_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"><path d="M16 1H4a2 2 0 00-2 2v12h2V3h12V1zm3 4H8a2 2 0 00-2 2v14a2 2 0 002 2h11a2 2 0 002-2V7a2 2 0 00-2-2zm0 16H8V7h11v14z" fill="currentColor"/></svg>`;

    // utils
    const debounce = (fn, wait=150) => { let t; return (...a)=>{ clearTimeout(t); t=setTimeout(()=>fn(...a), wait); }; };

    function createBtn({ label='', onClick, title='', style='' }) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.title = title || label;
        btn.textContent = label;
        btn.style.cssText = [
            'font:12px/1 system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif;',
            'padding:4px 8px;','border-radius:6px;',
            'border:1px solid rgba(0,0,0,.2);',
            'background:rgba(240,240,240,.9);','color:#111;',
            'cursor:pointer;','user-select:none;',
            'display:inline-flex;','align-items:center;','gap:6px;',
            'transition:background 120ms ease,transform 60ms ease;',
            style
        ].join('');
        btn.addEventListener('mouseenter', () => { btn.style.background = 'rgba(230,230,230,1)'; });
        btn.addEventListener('mouseleave', () => { btn.style.background = 'rgba(240,240,240,.9)'; });
        btn.addEventListener('mousedown', () => { btn.style.transform = 'translateY(1px)'; });
        btn.addEventListener('mouseup', () => { btn.style.transform = 'translateY(0)'; });
        if (onClick) btn.addEventListener('click', onClick);
        return btn;
    }

    function createIconLabelBtn({ iconSVG, label, onClick, title }) {
        const btn = createBtn({ label:'', onClick, title });
        const span = document.createElement('span');
        span.textContent = label;
        btn.insertAdjacentHTML('afterbegin', iconSVG);
        btn.appendChild(span);
        return btn;
    }

    // DOM helpers
    function findMessageBubbleFrom(pre) {
        let bubble = pre.closest('[data-message-author-role]');
        if (bubble) return bubble;
        bubble = pre.closest('article,[data-message-id],[data-testid="conversation-turn"]');
        return bubble || pre.parentElement;
    }
    const getRole = (bubble) => bubble?.getAttribute?.('data-message-author-role') || null;

    // cleanup (shared legacy cleanup only)
    function cleanupPreCommon(preEl) {
        try {
            const sib = preEl.previousElementSibling;
            if (sib && (sib.tagName==='DIV'||sib.tagName==='SECTION') && sib.childElementCount<=6 &&
                /Copy|Show code|Hide code/i.test(sib.textContent||'')) sib.remove();
            preEl.querySelectorAll('div').forEach(div=>{
                if (div.dataset?.cgptControls==='bottom-left' || div.dataset?.cgptPreview==='1') return;
                const cs = getComputedStyle(div);
                if (cs.position==='absolute' && cs.top==='6px' && cs.right==='8px' &&
                    /Copy|Show|Hide/i.test(div.textContent||'')) div.remove();
            });
        } catch(_) {}
    }
    // extra cleanup only for user <pre> (remove any in-pre bottom-left bars from old versions)
    function cleanupUserPreExtras(preEl) {
        preEl.querySelectorAll('div[data-cgpt-controls="bottom-left"]').forEach(el => el.remove());
    }

    // controls placement
    function addBottomLeftControls(containerEl, ...controls) {
        containerEl.style.position = containerEl.style.position || 'relative';
        let ctr = containerEl.querySelector('div[data-cgpt-controls="bottom-left"]');
        if (!ctr) {
            ctr = document.createElement('div');
            ctr.dataset.cgptControls = 'bottom-left';
            ctr.style.cssText = [
                'position:absolute;','bottom:6px;','left:8px;',
                'display:flex;','gap:6px;','z-index:2;'
            ].join('');
            containerEl.appendChild(ctr);
        } else {
            ctr.innerHTML = '';
        }
        controls.forEach(c=> ctr.appendChild(c));
        return ctr;
    }
    function addBelowBubbleControls(bubble, ...controls) {
        bubble.style.position = bubble.style.position || 'relative';
        const rows = bubble.querySelectorAll('div[data-cgpt-controls="user-pre"]').length;
        const ctr = document.createElement('div');
        ctr.dataset.cgptControls = 'user-pre';
        ctr.style.cssText = [
            'position:absolute;','left:8px;',`bottom:${-32 - (rows*32)}px;`,
            'display:flex;','gap:6px;','z-index:2;'
        ].join('');
        controls.forEach(c=> ctr.appendChild(c));
        bubble.appendChild(ctr);
        const newRows = rows + 1;
        const needed = 16 + newRows*32;
        const cur = parseInt(getComputedStyle(bubble).marginBottom||'0',10)||0;
        if (cur < needed) bubble.style.marginBottom = `${needed}px`;
        return ctr;
    }

    function createToggle(setHidden, getHidden, texts={show:'Show', hide:'Hide'}) {
        const btn = createIconLabelBtn({
            iconSVG: TOGGLE_SVG,
            label: getHidden() ? texts.show : texts.hide,
            title: 'Toggle',
            onClick: (e)=>{
                e.stopPropagation();
                const h = !getHidden();
                setHidden(h);
                btn.querySelector('span').textContent = h ? texts.show : texts.hide;
                const svg = btn.querySelector('svg');
                if (svg) svg.style.transform = h ? 'rotate(-90deg)' : 'rotate(0deg)';
            }
        });
        const svg = btn.querySelector('svg');
        if (svg) svg.style.transform = getHidden() ? 'rotate(-90deg)' : 'rotate(0deg)';
        return btn;
    }

    function buildPreviewEl(codeEl) {
        const preview = document.createElement('div');
        preview.dataset.cgptPreview = '1';
        preview.style.cssText = [
            'font:12px/1.35 ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace;',
            'background:rgba(240,240,240,.6);','color:#444;',
            'border:1px dashed rgba(0,0,0,.25);','border-radius:6px;',
            'padding:6px 8px;','white-space:pre-wrap;','overflow:hidden;',
            'text-overflow:ellipsis;','max-height:7.2em;','margin:6px 0 0 0;'
        ].join('');
        const raw = (codeEl.innerText || codeEl.textContent || '').trim();
        const lines = raw.split('\n').slice(0, 5);
        let text = lines.join('\n');
        if (raw.length > text.length) text += '\n…';
        preview.textContent = text || '(empty)';
        return preview;
    }

    function buildMessagePreviewElFrom(node) {
        // Extract a compact snippet from the message body
        const getText = (n) =>
        (n.innerText || n.textContent || '')
        .replace(/\s+/g, ' ')
        .trim();

        let text = getText(node);
        if (text.length > 280) text = text.slice(0, 240) + '…';

        const preview = document.createElement('div');
        preview.dataset.cgptMsgPreview = '1';
        preview.textContent = text || '(empty)';
        preview.style.cssText = [
            'font:12px/1.35 system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif;',
            'background:rgba(240,240,240,.6);','color:#444;',
            'border:1px dashed rgba(0,0,0,.25);','border-radius:6px;',
            'padding:6px 8px;','white-space:normal;','overflow:hidden;',
            'text-overflow:ellipsis;','max-height:7.2em;','margin:6px 0 0 0;'
        ].join('');
        return preview;
    }

    // processors
    function processAssistantPre(pre) {
        const code = pre.querySelector('code'); if (!code) return;

        // skip cleanup after first time, otherwise we remove our own controls
        if (pre.dataset.__cgptProcessed==='assistant-pre') return;

        // first-time: clean legacy stuff, then add controls
        cleanupPreCommon(pre);

        let hidden = true;
        code.style.display = 'none';
        const toggleBtn = createToggle(
            (h)=>{ hidden=h; code.style.display = h?'none':''; },
            ()=> hidden,
            { show:'Show code', hide:'Hide code' }
        );
        addBottomLeftControls(pre, toggleBtn);
        pre.dataset.__cgptProcessed = 'assistant-pre';
    }

    function processUserPre(pre) {
        const code = pre.querySelector('code'); if (!code) return;

        // strong de-dupe: one control row per <pre>
        if (!pre.dataset.cgptId) pre.dataset.cgptId = nextId();
        const preId = pre.dataset.cgptId;
        const bubble = findMessageBubbleFrom(pre);
        if (bubble.querySelector(`div[data-cgpt-controls="user-pre"][data-for-pre="${preId}"]`)) return;

        // clean user legacy in-pre controls/previews (safe to do each scan)
        cleanupPreCommon(pre);
        cleanupUserPreExtras(pre);
        pre.querySelectorAll('div[data-cgpt-preview="1"]').forEach((el, i) => { if (i > 0) el.remove(); });

        // preview (build once)
        let preview = pre.querySelector('div[data-cgpt-preview="1"]');
        if (!preview) {
            preview = buildPreviewEl(code);
            pre.appendChild(preview);
        }

        // start collapsed with preview
        let hidden = true;
        code.style.display = 'none';
        preview.style.display = 'block';

        const copyBtn = createIconLabelBtn({
            iconSVG: COPY_SVG,
            label: 'Copy',
            title: 'Copy code',
            onClick: (e) => {
                e.stopPropagation();
                const text = code.innerText || code.textContent || '';
                navigator.clipboard.writeText(text).then(() => {
                    const lbl = copyBtn.querySelector('span');
                    const old = lbl.textContent;
                    lbl.textContent = 'Copied';
                    setTimeout(() => { lbl.textContent = old; }, 900);
                }).catch(() => {});
            }
        });

        const toggleBtn = createToggle(
            (h) => { hidden = h; code.style.display = h ? 'none' : ''; preview.style.display = h ? 'block' : 'none'; },
            () => hidden,
            { show: 'Show', hide: 'Hide' }
        );

        const ctr = addBelowBubbleControls(bubble, copyBtn, toggleBtn);
        ctr.setAttribute('data-for-pre', preId);
        pre.dataset.__cgptProcessed = 'user-pre';
    }

    function processUserMessageBubble(bubble) {
        if (!bubble || bubble.dataset.__cgptProcessed === 'user-bubble') return;

        // Find main message content
        let content =
            bubble.querySelector(':scope .markdown') ||
            bubble.querySelector(':scope [data-testid="markdown"]') ||
            bubble.querySelector(':scope [data-message-content]') ||
            bubble.querySelector(':scope [data-prose]');

        if (!content) {
            const wrap = document.createElement('div');
            wrap.dataset.cgptUserContent = '1';
            while (bubble.firstChild) { wrap.appendChild(bubble.firstChild); }
            bubble.appendChild(wrap);
            content = wrap;
        }

        // Ensure a single preview node exists
        let preview = bubble.querySelector('div[data-cgpt-msg-preview="1"]');
        if (!preview) {
            preview = buildMessagePreviewElFrom(content);
            preview.style.display = 'none'; // start expanded, so hide preview initially
            bubble.appendChild(preview);
        }

        // Toggle: when collapsing, update + show preview; when expanding, hide it
        let hidden = false;
        const msgToggle = createToggle(
            (h) => {
                hidden = h;
                if (hidden) {
                    // refresh preview text in case user edited the message
                    const fresh = buildMessagePreviewElFrom(content);
                    preview.textContent = fresh.textContent;
                }
                content.style.display = hidden ? 'none' : '';
                preview.style.display = hidden ? 'block' : 'none';
            },
            () => hidden,
            { show: 'Show message', hide: 'Hide message' }
        );

        addBottomLeftControls(bubble, msgToggle);
        bubble.dataset.__cgptProcessed = 'user-bubble';
    }

    // scanner
    function scan() {
        const pres = document.querySelectorAll('pre');

        pres.forEach((pre) => {
            const bubble = findMessageBubbleFrom(pre);
            const role = getRole(bubble);
            if (role === 'assistant') {
                processAssistantPre(pre);
            } else if (role === 'user') {
                processUserPre(pre);
            } else {
                // unknown => treat as User to avoid injecting assistant controls in user bubbles
                processUserPre(pre);
            }
        });

        document.querySelectorAll('[data-message-author-role="user"]').forEach(processUserMessageBubble);
    }

    const start = ()=> { try { scan(); } catch(e){ console.error(e); } };
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start, { once:true });
    } else { start(); }

    const mo = new MutationObserver(debounce(scan, 200));
    mo.observe(document.documentElement, { childList:true, subtree:true });
    window.addEventListener('resize', debounce(scan, 300));
})();