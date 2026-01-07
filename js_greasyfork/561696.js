// ==UserScript==
// @name         UnknownCheats Live Preview
// @namespace    https://www.unknowncheats.me/
// @version      0.2.1
// @description  Live post preview while composing messages on UnknownCheats (BBCode rendering + smilies)
// @author       Payson
// @match        https://www.unknowncheats.me/forum/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js
// @license      MIT
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561696/UnknownCheats%20Live%20Preview.user.js
// @updateURL https://update.greasyfork.org/scripts/561696/UnknownCheats%20Live%20Preview.meta.js
// ==/UserScript==

(() => {
  'use strict';
  const C = {
    editorId: 'vB_Editor_001',
    kMap: 'uc_smiley_map_v3',
    ttl: 24 * 60 * 60 * 1000,
    kCollapsed: 'uc_preview_collapsed_v1',
    d: 80,
  };

  const $ = (s) => document.querySelector(s);
  const escRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const now = () => Date.now();

  const lsGet = (k) => {
    try {
      return localStorage.getItem(k);
    } catch {
      return null;
    }
  };
  const lsSet = (k, v) => {
    try {
      localStorage.setItem(k, v);
    } catch { }
  };

  const isCollapsed = () => lsGet(C.kCollapsed) === '1';
  const setCollapsed = (v) => lsSet(C.kCollapsed, v ? '1' : '0');

  const setStatus = (t) => {
    const el = $('#ucSmileyPreviewStatus');
    if (el) el.textContent = t;
  };

  const readCache = () => {
    try {
      const raw = lsGet(C.kMap);
      if (!raw) return null;
      const v = JSON.parse(raw);
      if (!v || typeof v !== 'object') return null;
      if (typeof v.ts !== 'number' || typeof v.editorId !== 'string' || typeof v.map !== 'object') return null;
      return v;
    } catch {
      return null;
    }
  };

  const writeCache = (v) => {
    try {
      lsSet(C.kMap, JSON.stringify(v));
    } catch { }
  };

  const isCode = (s) => /^:[^:\s]{1,38}:$/.test(s) || /^:[^\s:]{1,3}$/i.test(s);

  const parseSmilies = (html) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const base = new URL('/forum/', location.origin);
    const map = {};
    for (const img of doc.querySelectorAll('img')) {
      const code = (img.getAttribute('alt') || '').trim();
      if (!code || !isCode(code)) continue;
      const rawSrc = (img.getAttribute('src') || '').trim();
      if (!rawSrc) continue;
      const src = rawSrc.startsWith('/images/') ? `/forum${rawSrc}` : rawSrc;
      try {
        if (!map[code]) map[code] = new URL(src, base).href;
      } catch { }
    }
    return map;
  };

  const normalizeMap = (m) => {
    const out = { ...m };
    for (const [k, src] of Object.entries(m)) {
      const c = (k || '').trim();
      if (!c) continue;
      if (/^[a-z0-9_+-]{2,}$/i.test(c) && !out[`:${c}:`]) out[`:${c}:`] = src;
      if (/^:[^\s:]{1,3}$/i.test(c) && !c.endsWith(':') && !out[`${c}:`]) out[`${c}:`] = src;
    }
    return out;
  };

  const replaceMap = (m) => {
    const out = {};
    for (const [k, v] of Object.entries(m)) {
      const c = (k || '').trim();
      if (c.startsWith(':') && c.endsWith(':') && c.length >= 3) out[c] = v;
    }
    return out;
  };

  const compileRe = (m) => {
    const keys = Object.keys(m);
    if (!keys.length) return null;
    keys.sort((a, b) => b.length - a.length);
    return new RegExp(keys.map(escRe).join('|'), 'g');
  };

  const fetchSmilies = async () => {
    const url = new URL('/forum/misc.php', location.origin);
    url.searchParams.set('do', 'getsmilies');
    url.searchParams.set('editorid', C.editorId);
    const r = await fetch(url.toString(), { credentials: 'same-origin', cache: 'no-store' });
    if (!r.ok) throw new Error(String(r.status));
    return r.text();
  };

  const mountUi = (ta) => {
    if ($('#ucSmileyPreviewRoot')) return;
    if (!$('#ucSmileyPreviewStyle')) {
      const st = document.createElement('style');
      st.id = 'ucSmileyPreviewStyle';
      st.textContent = `
        #ucSmileyPreviewRoot{margin-top:10px;border:1px solid rgba(255,255,255,.12);border-radius:6px;background:rgba(255,255,255,.03);overflow:hidden}
        #ucSmileyPreviewHeader{display:flex;align-items:center;justify-content:space-between;padding:6px 10px;border-bottom:1px solid rgba(255,255,255,.10);gap:10px}
        #ucSmileyPreviewTitle{font-weight:600}
        #ucSmileyPreviewRight{display:flex;gap:10px;align-items:center;flex-wrap:wrap;justify-content:flex-end}
        #ucSmileyPreviewRight a{font-size:12px;text-decoration:underline;opacity:.9}
        #ucSmileyPreviewStatus{opacity:.8;font-size:12px;white-space:nowrap}
        #ucSmileyPreviewBody{padding:10px;font-size:13px;line-height:1.35;overflow-wrap:anywhere;word-break:break-word}
        #ucSmileyPreviewBody *{overflow-wrap:anywhere}
        #ucSmileyPreviewBody a{word-break:break-all}
        #ucSmileyPreviewBody blockquote{border-left:3px solid rgba(255,255,255,.18);margin:6px 0;padding:6px 10px;background:rgba(255,255,255,.03)}
        #ucSmileyPreviewBody pre{margin:6px 0}
        #ucSmileyPreviewBody pre.ucCode{white-space:pre;overflow-x:auto;padding:8px 10px;background:rgba(0,0,0,.25);border:1px solid rgba(255,255,255,.10);border-radius:6px}
        #ucSmileyPreviewBody pre.ucCode code{font-family:Consolas,Monaco,ui-monospace,Menlo,monospace;font-size:12px;line-height:1.35;display:block}
        #ucSmileyPreviewBody .hljs{color:#e6e6e6}
        #ucSmileyPreviewBody .hljs-keyword,#ucSmileyPreviewBody .hljs-selector-tag,#ucSmileyPreviewBody .hljs-literal{color:#c792ea}
        #ucSmileyPreviewBody .hljs-string,#ucSmileyPreviewBody .hljs-regexp{color:#c3e88d}
        #ucSmileyPreviewBody .hljs-number{color:#f78c6c}
        #ucSmileyPreviewBody .hljs-title,#ucSmileyPreviewBody .hljs-section{color:#82aaff}
        #ucSmileyPreviewBody .hljs-comment{color:#616161}
        #ucSmileyPreviewBody .hljs-built_in,#ucSmileyPreviewBody .hljs-type{color:#ffcb6b}
        #ucSmileyPreviewBody .hljs-attr,#ucSmileyPreviewBody .hljs-attribute{color:#addb67}
        #ucAc{position:absolute;z-index:2147483647;display:none;min-width:190px;max-width:340px;max-height:220px;overflow:auto;border:1px solid rgba(255,255,255,.14);border-radius:8px;background:rgba(20,20,20,.98);box-shadow:0 10px 30px rgba(0,0,0,.45);padding:4px}
        #ucAc .ucAcItem{display:flex;align-items:center;gap:8px;padding:6px 8px;border-radius:6px;cursor:pointer}
        #ucAc .ucAcItem:hover,#ucAc .ucAcItem.ucAcActive{background:rgba(255,255,255,.08)}
        #ucAc .ucAcItem img{width:18px;height:18px;object-fit:contain;image-rendering:auto}
        #ucAc .ucAcCode{font-family:Consolas,Monaco,ui-monospace,Menlo,monospace;font-size:12px;opacity:.95}
      `;
      document.head.appendChild(st);
    }

    const root = document.createElement('div');
    root.id = 'ucSmileyPreviewRoot';

    const header = document.createElement('div');
    header.id = 'ucSmileyPreviewHeader';

    const title = document.createElement('div');
    title.id = 'ucSmileyPreviewTitle';
    title.textContent = 'Preview';

    const right = document.createElement('div');
    right.id = 'ucSmileyPreviewRight';

    const toggle = document.createElement('a');
    toggle.href = '#';
    toggle.id = 'ucSmileyPreviewToggle';
    toggle.textContent = isCollapsed() ? 'Show preview' : 'Hide preview';

    const status = document.createElement('span');
    status.id = 'ucSmileyPreviewStatus';
    status.textContent = 'Loading smiliesâ€¦';

    const refresh = document.createElement('a');
    refresh.href = '#';
    refresh.textContent = 'Refresh smilies';

    const body = document.createElement('div');
    body.id = 'ucSmileyPreviewBody';
    if (isCollapsed()) body.style.display = 'none';

    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      const next = body.style.display !== 'none';
      body.style.display = next ? 'none' : '';
      toggle.textContent = next ? 'Show preview' : 'Hide preview';
      setCollapsed(next);
      if (!next) document.dispatchEvent(new CustomEvent('ucPreviewRender'));
    });

    refresh.addEventListener('click', (e) => {
      e.preventDefault();
      document.dispatchEvent(new CustomEvent('ucPreviewRefresh'));
    });

    right.appendChild(toggle);
    right.appendChild(status);
    right.appendChild(refresh);

    header.appendChild(title);
    header.appendChild(right);
    root.appendChild(header);
    root.appendChild(body);

    ta.insertAdjacentElement('afterend', root);
  };

  const bb = (input) => {
    const frag = document.createDocumentFragment();
    const root = document.createElement('div');
    root.style.whiteSpace = 'pre-wrap';
    root.style.wordBreak = 'break-word';
    frag.appendChild(root);

    const safeUrl = (u) => {
      const s = (u || '').trim();
      if (!s) return null;
      if (/^\s*(javascript|data):/i.test(s)) return null;
      return s;
    };
    const safeColor = (v) => {
      const s = (v || '').trim();
      if (!s) return null;
      if (/^#[0-9a-f]{3,8}$/i.test(s)) return s;
      if (/^[a-z]+$/i.test(s)) return s;
      return null;
    };
    const safeSize = (v) => {
      const s = (v || '').trim();
      if (!s) return null;
      if (/^[1-7]$/.test(s)) {
        return { 1: '10px', 2: '12px', 3: '14px', 4: '16px', 5: '18px', 6: '24px', 7: '32px' }[s];
      }
      const m = s.match(/^(\d{1,2})px$/i);
      if (m) {
        const n = Number(m[1]);
        if (n >= 8 && n <= 72) return `${n}px`;
      }
      return null;
    };

    const stack = [{ t: '__', el: root }];
    const mode = () => {
      for (let i = stack.length - 1; i >= 0; i--) if (stack[i].m) return stack[i].m;
      return null;
    };
    const addText = (t) => t && stack[stack.length - 1].el.appendChild(document.createTextNode(t));

    const open = (tag, param) => {
      const t = tag.toLowerCase();
      const p = param ? param.trim().replace(/^"(.*)"$/, '$1') : null;
      let el;
      const fr = { t, el: null };

      if (t === 'b') el = document.createElement('strong');
      else if (t === 'i') el = document.createElement('em');
      else if (t === 'u') el = document.createElement('u');
      else if (t === 's') el = document.createElement('s');
      else if (t === 'color') {
        el = document.createElement('span');
        const c = safeColor(p);
        if (c) el.style.color = c;
      } else if (t === 'size') {
        el = document.createElement('span');
        const sz = safeSize(p);
        if (sz) el.style.fontSize = sz;
      } else if (t === 'center' || t === 'left' || t === 'right') {
        el = document.createElement('div');
        el.style.textAlign = t;
      } else if (t === 'quote') {
        el = document.createElement('blockquote');
        if (p) {
          const h = document.createElement('div');
          h.textContent = `${p} wrote:`;
          h.style.fontWeight = '600';
          h.style.marginBottom = '4px';
          el.appendChild(h);
        }
      } else if (t === 'code') {
        const pre = document.createElement('pre');
        pre.className = 'ucCode';
        const code = document.createElement('code');
        if (p) {
          const lang = String(p).toLowerCase().replace(/[^a-z0-9_+-]/g, '');
          if (lang) code.className = `language-${lang}`;
        }
        pre.appendChild(code);
        fr.m = 'code';
        fr.el = code;
        return { el: pre, fr };
      } else if (t === 'noparse') {
        el = document.createElement('span');
        fr.m = 'noparse';
      } else if (t === 'spoiler') {
        const det = document.createElement('details');
        det.style.margin = '6px 0';
        const sum = document.createElement('summary');
        sum.textContent = p ? `Spoiler: ${p}` : 'Spoiler';
        sum.style.cursor = 'pointer';
        det.appendChild(sum);
        const inner = document.createElement('div');
        inner.style.padding = '6px 10px';
        inner.style.border = '1px solid rgba(255,255,255,0.12)';
        inner.style.borderRadius = '6px';
        inner.style.background = 'rgba(255,255,255,0.03)';
        det.appendChild(inner);
        fr.el = inner;
        return { el: det, fr };
      } else if (t === 'url') {
        el = document.createElement('a');
        el.rel = 'noreferrer noopener';
        el.target = '_blank';
        const href = safeUrl(p || '');
        if (href) el.href = href;
      } else if (t === 'img') {
        el = document.createElement('span');
      } else if (t === 'list') {
        const ordered = p && /^[1aAiI]$/.test(p);
        el = document.createElement(ordered ? 'ol' : 'ul');
        el.style.margin = '6px 0 6px 22px';
        fr.list = el;
      } else return null;

      fr.el = el;
      return { el, fr };
    };

    const close = (tag) => {
      const t = tag.toLowerCase();
      for (let i = stack.length - 1; i >= 1; i--) {
        if (stack[i].t !== t) continue;
        if (t === 'img') {
          const box = stack[i].el;
          const u = safeUrl((box.textContent || '').trim());
          box.textContent = '';
          if (u) {
            const img = document.createElement('img');
            img.src = u;
            img.loading = 'lazy';
            img.style.maxWidth = '100%';
            img.style.height = 'auto';
            img.style.display = 'block';
            img.style.margin = '6px 0';
            box.appendChild(img);
          } else {
            box.appendChild(document.createTextNode((box.textContent || '').trim()));
          }
        }
        stack.splice(i, stack.length - i);
        return true;
      }
      return false;
    };

    const re = /\[([\/]?)(\*|[a-z]+)(?:=([^\]]+))?\]/gi;
    let last = 0;
    let m;
    while ((m = re.exec(input)) !== null) {
      const raw = m[0];
      const isClose = m[1] === '/';
      const tag = m[2];
      const param = m[3] || null;
      const idx = m.index;

      const md = mode();
      if (md === 'code' && !(isClose && tag.toLowerCase() === 'code')) continue;
      if (md === 'noparse' && !(isClose && tag.toLowerCase() === 'noparse')) continue;

      if (idx > last) addText(input.slice(last, idx));
      last = idx + raw.length;

      if (!isClose) {
        if (tag === '*') {
          for (let i = stack.length - 1; i >= 0; i--) {
            const fr = stack[i];
            if (fr.t === 'list' && fr.list) {
              const li = document.createElement('li');
              fr.list.appendChild(li);
              stack.splice(i + 1, stack.length - (i + 1));
              stack.push({ t: 'li', el: li });
              break;
            }
          }
          continue;
        }
        const opened = open(tag, param);
        if (!opened) {
          addText(raw);
          continue;
        }
        stack[stack.length - 1].el.appendChild(opened.el);
        stack.push(opened.fr);
      } else {
        if (!close(tag)) addText(raw);
      }
    }
    if (last < input.length) addText(input.slice(last));

    for (const a of root.querySelectorAll('a')) {
      if (!a.getAttribute('href')) {
        const u = safeUrl(a.textContent || '');
        if (u) a.href = u;
      }
    }

    return frag;
  };

  const applySmilies = (rootNode, map, re) => {
    if (!re) return;
    const w = document.createTreeWalker(rootNode, NodeFilter.SHOW_TEXT);
    const hits = [];
    let n;
    while ((n = w.nextNode())) {
      const p = n.parentNode;
      if (!p || !(p instanceof HTMLElement)) continue;
      if (p.closest('pre, code')) continue;
      if (re.test(n.nodeValue || '')) hits.push(n);
      re.lastIndex = 0;
    }

    for (const t of hits) {
      const s = t.nodeValue || '';
      re.lastIndex = 0;
      let m;
      let last = 0;
      const frag = document.createDocumentFragment();
      while ((m = re.exec(s)) !== null) {
        const hit = m[0];
        const idx = m.index;
        if (idx > last) frag.appendChild(document.createTextNode(s.slice(last, idx)));
        const src = map[hit];
        if (src) {
          const img = document.createElement('img');
          img.src = src;
          img.alt = hit;
          img.title = hit;
          img.loading = 'lazy';
          img.style.maxHeight = '20px';
          img.style.verticalAlign = 'text-bottom';
          img.style.margin = '0 1px';
          frag.appendChild(img);
        } else {
          frag.appendChild(document.createTextNode(hit));
        }
        last = idx + hit.length;
        if (re.lastIndex === idx) re.lastIndex++;
      }
      if (last < s.length) frag.appendChild(document.createTextNode(s.slice(last)));
      t.parentNode?.replaceChild(frag, t);
    }
  };

  const main = async () => {
    const ta = $('textarea[name="message"]');
    if (!ta) return;
    mountUi(ta);

    const body = $('#ucSmileyPreviewBody');
    if (!body) return;

    let raw = {};
    let map = {};
    let re = null;

    let ac;
    let acMirror;
    let acItems = [];
    let acSel = 0;
    let acTok = null;

    const acEnsure = () => {
      if (!ac) {
        ac = document.createElement('div');
        ac.id = 'ucAc';
        document.body.appendChild(ac);

        document.addEventListener('mousedown', (e) => {
          if (!ac || ac.style.display === 'none') return;
          if (e.target === ta || ac.contains(e.target)) return;
          acHide();
        });

        window.addEventListener('resize', () => acPos());
        window.addEventListener('scroll', () => acPos(), true);
      }

      if (!acMirror) {
        acMirror = document.createElement('div');
        acMirror.style.position = 'absolute';
        acMirror.style.visibility = 'hidden';
        acMirror.style.whiteSpace = 'pre-wrap';
        acMirror.style.overflowWrap = 'anywhere';
        acMirror.style.wordBreak = 'break-word';
        acMirror.style.top = '0';
        acMirror.style.left = '0';
        acMirror.style.pointerEvents = 'none';
        document.body.appendChild(acMirror);
      }
    };

    const acTokAt = () => {
      if (ta.selectionStart !== ta.selectionEnd) return null;
      const pos = ta.selectionStart || 0;
      const v = ta.value || '';
      if (!pos) return null;

      let i = pos - 1;
      while (i >= 0 && /[a-z0-9_+\-]/i.test(v[i])) i--;
      if (i < 0 || v[i] !== ':') return null;
      const start = i;
      const q = v.slice(start + 1, pos);
      if (!q || q.length > 40) return null;
      return { start, end: pos, q };
    };

    const acSuggest = (q) => {
      const needle = q.toLowerCase();
      const out = [];
      for (const code of acItems) {
        const inner = code.slice(1, -1).toLowerCase();
        if (inner.startsWith(needle)) out.push(code);
        if (out.length >= 18) break;
      }
      return out;
    };

    const acSyncMirror = () => {
      if (!acMirror) return;
      const cs = getComputedStyle(ta);
      const props = [
        'boxSizing',
        'width',
        'fontSize',
        'fontFamily',
        'fontWeight',
        'fontStyle',
        'letterSpacing',
        'textTransform',
        'padding',
        'border',
        'lineHeight',
        'textAlign',
      ];
      for (const p of props) acMirror.style[p] = cs[p];
      const r = ta.getBoundingClientRect();
      acMirror.style.left = `${r.left + window.scrollX}px`;
      acMirror.style.top = `${r.top + window.scrollY}px`;
    };

    const acCaretXY = (pos) => {
      acEnsure();
      acSyncMirror();
      acMirror.scrollTop = ta.scrollTop;
      acMirror.textContent = '';
      acMirror.appendChild(document.createTextNode((ta.value || '').slice(0, pos)));
      const mark = document.createElement('span');
      mark.textContent = '\u200b';
      acMirror.appendChild(mark);
      const r = mark.getBoundingClientRect();
      return { x: r.left + window.scrollX, y: r.bottom + window.scrollY };
    };

    const acHide = () => {
      if (!ac) return;
      ac.style.display = 'none';
      ac.replaceChildren();
      acSel = 0;
      acTok = null;
    };

    const acShow = (list, tok) => {
      acEnsure();
      if (!list.length) return acHide();
      acTok = tok;
      acSel = Math.min(acSel, list.length - 1);

      ac.replaceChildren();
      for (let i = 0; i < list.length; i++) {
        const code = list[i];
        const row = document.createElement('div');
        row.className = `ucAcItem${i === acSel ? ' ucAcActive' : ''}`;
        row.dataset.idx = String(i);

        const img = document.createElement('img');
        img.loading = 'lazy';
        img.src = map[code] || '';
        img.alt = code;

        const txt = document.createElement('span');
        txt.className = 'ucAcCode';
        txt.textContent = code;

        row.appendChild(img);
        row.appendChild(txt);

        row.addEventListener('mouseenter', () => {
          acSel = i;
          acRefreshActive();
        });
        row.addEventListener('mousedown', (e) => {
          e.preventDefault();
          acPick();
        });

        ac.appendChild(row);
      }

      ac.style.display = 'block';
      acPos();
    };

    const acRefreshActive = () => {
      if (!ac) return;
      const rows = Array.from(ac.querySelectorAll('.ucAcItem'));
      for (let i = 0; i < rows.length; i++) {
        rows[i].classList.toggle('ucAcActive', i === acSel);
      }
      const active = rows[acSel];
      if (active) active.scrollIntoView({ block: 'nearest' });
    };

    const acPos = () => {
      if (!ac || ac.style.display === 'none' || !acTok) return;
      const p = acCaretXY(acTok.end);
      const m = 6;
      const vw = window.scrollX + document.documentElement.clientWidth;
      const vh = window.scrollY + document.documentElement.clientHeight;
      const w = Math.min(ac.offsetWidth || 280, 340);
      let left = p.x;
      let top = p.y + 4;
      if (left + w + m > vw) left = Math.max(window.scrollX + m, vw - w - m);
      if (top + 220 + m > vh) top = Math.max(window.scrollY + m, p.y - 220 - m);
      ac.style.left = `${left}px`;
      ac.style.top = `${top}px`;
    };

    const acPick = () => {
      if (!ac || ac.style.display === 'none' || !acTok) return;
      const rows = Array.from(ac.querySelectorAll('.ucAcItem'));
      const row = rows[acSel];
      if (!row) return;
      const code = (row.querySelector('.ucAcCode')?.textContent || '').trim();
      if (!code) return;
      const v = ta.value || '';
      const out = v.slice(0, acTok.start) + code + v.slice(acTok.end);
      ta.value = out;
      const caret = acTok.start + code.length;
      ta.setSelectionRange(caret, caret);
      ta.dispatchEvent(new Event('input', { bubbles: true }));
      acHide();
    };

    const acUpdate = () => {
      if (!map || !Object.keys(map).length) return acHide();
      const tok = acTokAt();
      if (!tok) return acHide();
      const list = acSuggest(tok.q);
      return acShow(list, tok);
    };

    const acKey = (e) => {
      if (!ac || ac.style.display === 'none') return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        acSel = Math.min(acSel + 1, ac.childElementCount - 1);
        acRefreshActive();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        acSel = Math.max(acSel - 1, 0);
        acRefreshActive();
      } else if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        acPick();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        acHide();
      }
    };

    const load = async (force) => {
      setStatus('Loading smiliesâ€¦');
      const c = !force ? readCache() : null;
      if (c && now() - c.ts < C.ttl) {
        raw = normalizeMap(c.map || {});
        map = replaceMap(raw);
        re = compileRe(map);
        acItems = Object.keys(map).sort((a, b) => a.length - b.length);
        setStatus(`Smilies loaded: ${Object.keys(map).length} (cached)`);
        return;
      }
      const html = await fetchSmilies();
      raw = normalizeMap(parseSmilies(html));
      map = replaceMap(raw);
      re = compileRe(map);
      acItems = Object.keys(map).sort((a, b) => a.length - b.length);
      writeCache({ ts: now(), editorId: C.editorId, map: raw });
      setStatus(`Smilies loaded: ${Object.keys(map).length}`);
    };

    let t = 0;
    const render = () => {
      if (isCollapsed()) return;
      if (t) clearTimeout(t);
      t = setTimeout(() => {
        t = 0;
        const frag = bb(ta.value || '');
        applySmilies(frag, map, re);
        body.replaceChildren(frag);
        try {
          if (window.hljs && typeof window.hljs.highlightElement === 'function') {
            for (const code of body.querySelectorAll('pre.ucCode > code')) window.hljs.highlightElement(code);
          } else if (typeof window.prettyPrint === 'function') {
            for (const pre of body.querySelectorAll('pre.ucCode')) pre.classList.add('prettyprint');
            window.prettyPrint();
          }
        } catch { }
      }, C.d);
    };

    ta.addEventListener('input', () => {
      render();
      acUpdate();
    });
    ta.addEventListener('change', render);
    ta.addEventListener('keydown', acKey);
    ta.addEventListener('click', acUpdate);
    document.addEventListener('ucPreviewRender', render);
    document.addEventListener('ucPreviewRefresh', async () => {
      try {
        await load(true);
      } catch {
        setStatus('Failed to load smilies');
      }
      render();
    });

    try {
      await load(false);
    } catch {
      setStatus('Failed to load smilies');
    }
    render();
  };

  main();
})();