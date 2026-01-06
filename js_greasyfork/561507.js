// ==UserScript==
// @name         Copy MD + LaTeX (Self-contained, KaTeX/MathJax) - v2.5.0
// @name:zh-TW   複製為 Markdown + LaTeX（支援 KaTeX/MathJax）
// @namespace    mdltx.copy.self
// @version      2.5.0
// @description  Copy selection/article/page as Markdown, preserving LaTeX from KaTeX/MathJax. Self-contained. Works with Trusted Types.
// @description:zh-TW  將選取範圍／文章／整頁複製為 Markdown，完整保留 KaTeX/MathJax 數學公式。獨立運作，相容 Trusted Types。
// @license      CC0-1.0
// @match        *://*/*
// @match        file:///*
// @run-at       document-idle
// @noframes
// @grant        unsafeWindow
// @grant        GM_setClipboard
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/561507/Copy%20MD%20%2B%20LaTeX%20%28Self-contained%2C%20KaTeXMathJax%29%20-%20v250.user.js
// @updateURL https://update.greasyfork.org/scripts/561507/Copy%20MD%20%2B%20LaTeX%20%28Self-contained%2C%20KaTeXMathJax%29%20-%20v250.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const DEFAULTS = {
    hotkeyAltM: true,
    showButton: true,
    noSelectionMode: 'page', // 'page' | 'article'
    stripCommonIndentInBlockMath: true,
    absoluteUrls: true,
    waitMathJax: true,
    articleMinChars: 600,
    articleMinRatio: 0.55,
    hiddenScanMaxElements: 9000,

    // nav 通常是頁面雜訊，預設略過（同時略過 role="navigation"）
    ignoreNav: true,
  };

  const S = {
    get(k) { return GM_getValue(k, DEFAULTS[k]); },
    set(k, v) { GM_setValue(k, v); },
  };

  GM_addStyle(`
#mdltx-btn{
  position:fixed; right:16px; bottom:16px; z-index:2147483647;
  font:14px/1.2 system-ui,-apple-system,"Segoe UI",Arial;
  padding:10px 12px; border-radius:999px;
  border:1px solid rgba(0,0,0,.18);
  background:rgba(255,255,255,.92);
  box-shadow:0 6px 24px rgba(0,0,0,.15);
  cursor:pointer; user-select:none;
}
#mdltx-toast{
  position:fixed; left:50%; bottom:18px; transform:translateX(-50%);
  z-index:2147483647; padding:10px 12px; border-radius:10px;
  background:rgba(0,0,0,.80); color:#fff;
  font:13px/1.35 system-ui,-apple-system,"Segoe UI",Arial;
  opacity:0; transition:opacity .18s ease;
  pointer-events:none;
  max-width:min(820px, 92vw);
  white-space:pre-wrap;
}
  `);

  function toast(msg, ms = 2200) {
    const id = 'mdltx-toast';
    let el = document.getElementById(id);
    if (!el) {
      el = document.createElement('div');
      el.id = id;
      el.setAttribute('data-mdltx-ui', '1');
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.style.opacity = '1';
    setTimeout(() => {
      el.style.opacity = '0';
      setTimeout(() => { el.textContent = ''; }, 260);
    }, ms);
  }

  function getPageMathJax() {
    try {
      return (typeof unsafeWindow !== 'undefined' && unsafeWindow.MathJax) || window.MathJax || null;
    } catch {
      return window.MathJax || null;
    }
  }

  function hasSelection() {
    const sel = window.getSelection?.();
    return !!(sel && sel.rangeCount && sel.toString().trim());
  }
  function getSelectionRange() {
    const sel = window.getSelection?.();
    if (!sel || !sel.rangeCount) return null;
    if (!sel.toString().trim()) return null;
    return sel.getRangeAt(0);
  }

  function absUrl(url, base) {
    if (!S.get('absoluteUrls')) return url || '';
    try { return new URL(url, base || document.baseURI || location.href).href; }
    catch { return url || ''; }
  }

  // 保留同頁錨點（避免 href="#" 變成 file:///...#）
  function hrefForA(aEl) {
    const raw = (aEl.getAttribute?.('href') || '').trim();
    if (!raw) return '';
    if (raw.startsWith('#')) return raw;
    if (/^javascript:/i.test(raw)) return '';
    if (!S.get('absoluteUrls')) return raw;
    return absUrl(aEl.href || raw);
  }

  function wrapInlineCode(text) {
    text = String(text ?? '');
    const ticks = text.match(/`+/g) || [];
    let max = 0;
    for (const t of ticks) max = Math.max(max, t.length);
    return '`'.repeat(max + 1) + text + '`'.repeat(max + 1);
  }

  function stripCommonIndent(tex) {
    tex = String(tex || '').replace(/\r\n/g, '\n');
    let lines = tex.split('\n');
    while (lines.length && lines[0].trim() === '') lines.shift();
    while (lines.length && lines[lines.length - 1].trim() === '') lines.pop();

    let min = null;
    for (const l of lines) {
      if (!l.trim()) continue;
      const m = l.match(/^[ \t]*/);
      const n = m ? m[0].length : 0;
      min = (min === null) ? n : Math.min(min, n);
    }
    if (min && min > 0) lines = lines.map(l => l.slice(min));
    return lines.join('\n');
  }

  function normalizeOutput(md) {
    return String(md || '')
      .replace(/\u00a0/g, ' ') // NBSP -> space
      // 移除常見零寬/不可見字元（ZWSP/ZWJ/ZWNJ/word-joiner/BOM）
      .replace(/[\u200B\u200C\u200D\u2060\uFEFF]/g, '')
      .replace(/([^\n \t])[ \t]+\n/g, '$1\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }
  function trimNewlinesOnly(s) {
    return String(s || '').replace(/^\n+/, '').replace(/\n+$/, '');
  }

  function isOurUI(el) {
    try {
      if (!el) return false;
      if (el.getAttribute?.('data-mdltx-ui') === '1') return true;
      if (el.id && (el.id === 'mdltx-btn' || el.id === 'mdltx-toast' || el.id.startsWith('mdltx-'))) return true;
      if (el.closest?.('[data-mdltx-ui="1"]')) return true;
      return false;
    } catch { return false; }
  }

  // Math infra should not be removed as hidden
  function isMathInfra(el) {
    if (!el || el.nodeType !== 1) return false;
    const T = el.tagName;

    if (el.closest?.('.katex,.katex-display,.katex-mathml,mjx-container,.MathJax,span.MathJax')) return true;

    const MATH_TAGS = new Set([
      'MATH','SEMANTICS','ANNOTATION','MROW','MI','MN','MO','MTEXT','MSUP','MSUB','MSUBSUP',
      'MFRAC','MSQRT','MROOT','MTABLE','MTR','MTD','MSTYLE','MPADDED',
      'MUNDER','MOVER','MUNDROVER','MERROR','MFENCED','MENCLOSE'
    ]);
    return MATH_TAGS.has(T);
  }

  function isNavLike(el) {
    if (!el || el.nodeType !== 1) return false;
    const T = el.tagName;
    if (T === 'NAV') return true;
    const role = (el.getAttribute?.('role') || '').toLowerCase();
    if (role === 'navigation') return true;
    return false;
  }

  // ---------- Hidden annotation (on live DOM) ----------
  function annotateHidden(scope) {
    const tagged = [];
    try {
      const root = scope || document.body;
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);
      let n = 0;

      while (walker.nextNode()) {
        const el = walker.currentNode;
        if (!el || isOurUI(el)) continue;

        if (isMathInfra(el)) continue;

        const inDetails = !!el.closest?.('details');

        const ariaHidden = (el.getAttribute?.('aria-hidden') || '').toLowerCase() === 'true';
        if (el.hidden === true || el.getAttribute?.('hidden') !== null || ariaHidden) {
          el.setAttribute('data-mdltx-hidden', '1');
          tagged.push(el);
          continue;
        }

        if (!inDetails) {
          const cs = window.getComputedStyle?.(el);
          if (cs && (cs.display === 'none' || cs.visibility === 'hidden' || cs.visibility === 'collapse')) {
            el.setAttribute('data-mdltx-hidden', '1');
            tagged.push(el);
          }
        }

        if (++n > S.get('hiddenScanMaxElements')) break;
      }
    } catch (_) {}
    return tagged;
  }

  function cleanupHiddenAnnotations(nodes) {
    for (const n of nodes || []) {
      try { n.removeAttribute('data-mdltx-hidden'); } catch (_) {}
    }
  }

  // ---------- MathJax wait / annotate ----------
  function getMathItemsWithin(scope) {
    const MJ = getPageMathJax();
    const doc = MJ?.startup?.document;
    if (!doc) return [];
    if (typeof doc.getMathItemsWithin === 'function') return doc.getMathItemsWithin(scope || document.body) || [];
    if (Array.isArray(doc.math)) return doc.math;
    return [];
  }

  async function waitForMathJax(scope) {
    if (!S.get('waitMathJax')) return;
    const MJ = getPageMathJax();
    if (!MJ) return;

    const hasMjx = !!document.querySelector('mjx-container');
    if (!hasMjx) return;

    for (let i = 0; i < 10; i++) {
      try {
        if (MJ.startup?.promise) await MJ.startup.promise;
        if (typeof MJ.typesetPromise === 'function') {
          try { await MJ.typesetPromise(scope ? [scope] : undefined); }
          catch { await MJ.typesetPromise(); }
        }
      } catch (_) {}

      const items = getMathItemsWithin(scope);
      if (items && items.length) return;

      await new Promise(r => setTimeout(r, 200));
    }
  }

  function annotateMathJax(scope) {
    const added = [];
    try {
      const items = getMathItemsWithin(scope);
      for (const it of items) {
        const root = it?.typesetRoot;
        if (!root || !root.setAttribute) continue;
        if (scope && scope !== document.body && scope.contains && !scope.contains(root)) continue;

        const tex = it.math;
        if (typeof tex !== 'string' || !tex.trim()) continue;

        if (!root.hasAttribute('data-mdltx-tex')) {
          root.setAttribute('data-mdltx-tex', tex);
          root.setAttribute('data-mdltx-display', it.display ? 'block' : 'inline');
          added.push(root);
        }
      }
    } catch (_) {}
    return added;
  }

  function cleanupMathJaxAnnotations(nodes) {
    for (const n of nodes || []) {
      try { n.removeAttribute('data-mdltx-tex'); n.removeAttribute('data-mdltx-display'); } catch (_) {}
    }
  }

  function extractTex(el) {
    if (!el) return '';
    const dt = el.getAttribute?.('data-mdltx-tex');
    if (dt) return String(dt).trim();

    try {
      const ann = el.querySelector?.('annotation[encoding*="tex"],annotation[encoding*="TeX"],annotation[encoding*="latex"],annotation[encoding*="LaTeX"],annotation');
      if (ann?.textContent) return ann.textContent.trim();
    } catch (_) {}

    const ds = el.dataset || {};
    if (ds.latex) return String(ds.latex).trim();
    if (ds.tex) return String(ds.tex).trim();

    if (el.tagName === 'SCRIPT' && /^math\/tex/i.test(el.type || '')) return (el.textContent || '').trim();
    try {
      const sc = el.querySelector?.('script[type^="math/tex"]');
      if (sc?.textContent) return sc.textContent.trim();
    } catch (_) {}

    return (el.textContent || '').trim();
  }

  function isDisplayMath(el, tex) {
    tex = String(tex || '');
    const disp = el.getAttribute?.('data-mdltx-display');
    if (disp) return disp === 'block';
    if (el.classList?.contains('katex-display')) return true;
    if (el.closest?.('.katex-display,.MathJax_Display,.math-display,[data-math-display="block"]')) return true;
    if (el.tagName === 'MJX-CONTAINER') {
      const a = el.getAttribute?.('display');
      if (a === 'true' || a === 'block') return true;
    }
    if (/\\begin\{(align|aligned|equation|gather|multline|cases)\}/.test(tex)) return true;
    if (tex.includes('\n') && tex.length > 20) return true;
    return false;
  }

  // ---------- Article heuristic ----------
  function findArticleRoot() {
    const candidates = [];
    const selectors = [
      'article', 'main', '[role="main"]',
      '#content', '#main', '#article', '#post',
      '.content', '.main', '.article', '.post', '.entry', '.markdown-body'
    ];
    for (const sel of selectors) document.querySelectorAll(sel).forEach(el => candidates.push(el));
    const extra = Array.from(document.querySelectorAll('section,div')).slice(0, 250);
    for (const el of extra) candidates.push(el);

    function bad(el) {
      const tag = el.tagName;
      if (['NAV','ASIDE','FOOTER','HEADER','FORM'].includes(tag)) return true;
      if (el.closest('nav,aside,footer,header,form')) return true;
      const role = (el.getAttribute?.('role') || '').toLowerCase();
      if (role === 'navigation') return true;
      if (el.closest?.('[role="navigation"]')) return true;
      return false;
    }
    function score(el) {
      if (!el || bad(el)) return -1e9;
      const text = (el.innerText || '').trim();
      if (text.length < 200) return -1e9;
      const links = el.querySelectorAll('a').length || 0;
      const paras = el.querySelectorAll('p').length || 0;
      const code = el.querySelectorAll('pre,code').length || 0;
      return text.length + paras * 120 + code * 60 - links * 30;
    }

    let best = null, bestScore = -1e9;
    for (const el of candidates) {
      const sc = score(el);
      if (sc > bestScore) { bestScore = sc; best = el; }
    }
    return best || document.body;
  }

  function isArticleTooSmall(articleEl) {
    try {
      const a = (articleEl?.innerText || '').trim().length;
      const b = (document.body?.innerText || '').trim().length || 1;
      const ratio = a / b;
      return a < S.get('articleMinChars') || ratio < S.get('articleMinRatio');
    } catch {
      return true;
    }
  }

  // ---------- Image src selection ----------
  function parseSrcset(srcset) {
    srcset = String(srcset || '').trim();
    if (!srcset) return '';
    const parts = srcset.split(',').map(s => s.trim()).filter(Boolean);
    let bestUrl = '';
    let bestScore = -1;

    for (const p of parts) {
      const m = p.match(/^(\S+)(?:\s+(\d+(?:\.\d+)?)(w|x))?$/i);
      if (!m) continue;
      const url = m[1];
      const num = m[2] ? parseFloat(m[2]) : 0;
      const unit = m[3] ? m[3].toLowerCase() : '';

      let score = 0;
      if (unit === 'w') score = num;
      else if (unit === 'x') score = num * 10000;
      else score = 1;

      if (score > bestScore) { bestScore = score; bestUrl = url; }
    }
    return bestUrl;
  }

  function pickImgSrc(node) {
    const c = node.currentSrc;
    if (c) return c;

    const attrs = [
      'src','data-src','data-original','data-orig','data-lazy-src','data-url',
      'data-image','data-src-url','data-zoom-src','data-hires'
    ];
    for (const a of attrs) {
      const v = node.getAttribute?.(a);
      if (v) return v;
    }

    const srcset = node.getAttribute?.('srcset') || node.getAttribute?.('data-srcset') || '';
    const best = parseSrcset(srcset);
    if (best) return best;

    return '';
  }

  // ---------- Markdown helpers ----------
  function escapeBracketText(s) {
    // 用在 [] 內（link text / image alt）
    return String(s ?? '')
      .replace(/\\/g, '\\\\')
      .replace(/\[/g, '\\[')
      .replace(/\]/g, '\\]');
  }

  function escapeLinkDest(url) {
    url = String(url || '').trim();
    if (!url) return '';

    // 盡量用 <...> 包起來，避免 () / 空白 等破壞 Markdown link dest
    // CommonMark 的 link destination 可以是 <...>，允許括號與許多字元
    if (/[()\s"]/g.test(url)) {
      return `<${url.replace(/>/g, '%3E')}>`;
    }

    // 否則在 (...) 裡把容易結束的字元跳脫
    return url
      .replace(/\\/g, '\\\\')
      .replace(/\)/g, '\\)');
  }

  function mdLink(text, href) {
    const t = escapeBracketText(text || '');
    const h = escapeLinkDest(href || '');
    return h ? `[${t}](${h})` : t;
  }

  function maxRunOfChar(s, ch) {
    s = String(s || '');
    let max = 0, cur = 0;
    for (let i = 0; i < s.length; i++) {
      if (s[i] === ch) { cur++; if (cur > max) max = cur; }
      else cur = 0;
    }
    return max;
  }

  function chooseFence(content) {
    // 在 ` 或 ~ 中選一個，並且長度 = maxRun + 1（至少 3）
    const maxTick = maxRunOfChar(content, '`');
    const maxTilde = maxRunOfChar(content, '~');
    const ch = (maxTick <= maxTilde) ? '`' : '~';
    const maxRun = (ch === '`') ? maxTick : maxTilde;
    const len = Math.max(3, maxRun + 1);
    return ch.repeat(len);
  }

  // ---------- Markdown conversion ----------
  const LANGS = ("python|javascript|js|typescript|ts|java|c|cpp|csharp|cs|go|rust|ruby|php|sql|bash|sh|shell|html|css|json|xml|yaml|yml|markdown|md|r|swift|kotlin|scala|perl|lua|matlab|powershell|ps1|text").split("|");

  function detectLang(codeEl) {
    if (!codeEl) return '';
    let cl = (codeEl.className || '') + ' ' + (codeEl.getAttribute?.('data-language') || '') + ' ' + (codeEl.getAttribute?.('data-lang') || '');
    cl = String(cl || '');
    let m = cl.match(/language-([a-z0-9_+-]+)/i) || cl.match(/lang-([a-z0-9_+-]+)/i);
    if (m && m[1]) return m[1];
    for (const l of LANGS) if (cl.includes(l)) return l;
    return '';
  }

  const INLINE_PARENT = new Set(['A','SPAN','SMALL','LABEL','EM','I','STRONG','B','DEL','S','U','MARK','SUB','SUP','KBD','CITE','Q','ABBR']);
  const INLINEISH_TAGS = new Set(['A','SPAN','SMALL','LABEL','EM','I','STRONG','B','DEL','S','U','MARK','SUB','SUP','KBD','CITE','Q','ABBR','CODE','IMG','TIME','INPUT']);

  function isHiddenInClone(node) {
    try {
      if (node?.getAttribute?.('data-mdltx-hidden') === '1') return true;
      if (node?.closest?.('[data-mdltx-hidden="1"]')) return true;
      return false;
    } catch { return false; }
  }

  function isInlineishNode(n) {
    if (!n) return false;
    if (n.nodeType === 3) return !!(n.nodeValue || '').trim();
    if (n.nodeType !== 1) return false;
    if (INLINEISH_TAGS.has(n.tagName)) return true;
    if (n.matches?.('.katex,.katex-display,mjx-container,.MathJax,span.MathJax,math')) return true;
    return false;
  }

  // 保留 inline 之間的空白（避免 *斜體A**斜體B*）
  function wsTextNodeToSpace(textNode) {
    const prev = textNode.previousSibling;
    const next = textNode.nextSibling;
    if (!prev || !next) return '';
    return (isInlineishNode(prev) && isInlineishNode(next)) ? ' ' : '';
  }

  // 合併「相鄰且同格式」的標記，避免 **A****B**
  function smartConcat(out, part) {
    if (!out) return part;
    if (!part) return out;

    if (out.endsWith('***') && part.startsWith('***')) return out.slice(0, -3) + part.slice(3);
    if (out.endsWith('**') && part.startsWith('**')) return out.slice(0, -2) + part.slice(2);
    if (out.endsWith('~~') && part.startsWith('~~')) return out.slice(0, -2) + part.slice(2);
    if (out.endsWith('*') && part.startsWith('*')) return out.slice(0, -1) + part.slice(1);

    return out + part;
  }

  // inline-ish renderer used in table cells / summary etc (no paragraph wrappers)
  function mdInline(node) {
    if (!node) return '';
    if (isHiddenInClone(node)) return '';

    if (node.nodeType === 3) {
      const raw = node.nodeValue || '';
      const ptag = node.parentElement?.tagName || '';
      if (ptag === 'PRE' || ptag === 'CODE') return raw;
      if (/^\s+$/.test(raw)) {
        return wsTextNodeToSpace(node) || (INLINE_PARENT.has(ptag) ? ' ' : '');
      }
      return String(raw).replace(/\s+/g, ' ');
    }
    if (node.nodeType !== 1) return '';

    const T = node.tagName;
    if (/^(SCRIPT|STYLE|NOSCRIPT|SVG|MJX-ASSISTIVE-MML|TEMPLATE)$/.test(T)) return '';
    if (isOurUI(node)) return '';
    if (S.get('ignoreNav') && (T === 'NAV' || isNavLike(node))) return '';

    const kids = () => {
      let r = '';
      for (const c of Array.from(node.childNodes)) r = smartConcat(r, mdInline(c));
      return r;
    };

    if (T === 'BR') return '<br>';

    if (T === 'INPUT') {
      const type = (node.getAttribute('type') || '').toLowerCase();
      if (type === 'checkbox') {
        const checked = node.checked || node.defaultChecked || node.getAttribute('checked') !== null;
        return checked ? '[x] ' : '[ ] ';
      }
      return '';
    }

    if (T === 'STRONG' || T === 'B') {
      const inner = kids().trim();
      return inner ? `**${inner}**` : '';
    }
    if (T === 'EM' || T === 'I') {
      const inner = kids().trim();
      return inner ? `*${inner}*` : '';
    }
    if (T === 'DEL' || T === 'S') {
      const inner = kids().trim();
      return inner ? `~~${inner}~~` : '';
    }

    if (T === 'Q') {
      const inner = kids().trim();
      return inner ? `「${inner}」` : '';
    }

    if (T === 'CODE') {
      const txt = node.textContent || '';
      return txt.trim() ? wrapInlineCode(txt) : '';
    }

    if (T === 'A') {
      const text = kids().trim() || (node.getAttribute('href') || '');
      const href = hrefForA(node);
      return href ? mdLink(text, href) : escapeBracketText(text);
    }

    if (T === 'IMG') {
      const altRaw = (node.getAttribute('alt') || '').trim();
      const alt = escapeBracketText(altRaw);
      const src = pickImgSrc(node);
      const u = src ? absUrl(src) : '';
      return u ? `![${alt}](${escapeLinkDest(u)})` : (altRaw || '');
    }

    if (T === 'SUB') return `<sub>${kids().trim()}</sub>`;
    if (T === 'SUP') return `<sup>${kids().trim()}</sup>`;
    if (T === 'KBD') return `<kbd>${kids().trim()}</kbd>`;
    if (T === 'U') return `<u>${kids()}</u>`;
    if (T === 'MARK') return `<mark>${kids()}</mark>`;

    if (node.matches?.('.katex,.katex-display,mjx-container,.MathJax,span.MathJax,script[type^="math/tex"],math')) {
      if (node.closest?.('pre,code')) return node.textContent || '';
      let tex = extractTex(node);
      if (!tex) return '';
      const block = isDisplayMath(node, tex);
      if (block && S.get('stripCommonIndentInBlockMath')) tex = stripCommonIndent(tex);
      return block ? `<br>$$ ${tex} $$<br>` : `$${tex}$`;
    }

    if (['P','DIV','SECTION','ARTICLE','MAIN','HEADER','FOOTER','ASIDE','FIGCAPTION','DT','DD'].includes(T)) {
      return kids().trim();
    }

    return kids();
  }

  // table cell: use mdInline so <br> preserved, keep formatting
  function cellToMd(cell) {
    let s = mdInline(cell);
    s = s.replace(/(?:<br>\s*){3,}/g, '<br><br>');
    s = s.replace(/\|/g, '\\|');
    return s.trim();
  }

  function tableToMd(t) {
    const rows = [];
    let hasHr = false;
    t.querySelectorAll('tr').forEach((tr, i) => {
      const cells = [];
      tr.querySelectorAll('th,td').forEach(td => cells.push(cellToMd(td)));
      if (!cells.length) return;
      rows.push(`| ${cells.join(' | ')} |`);
      if (!hasHr && (tr.querySelector('th') || i === 0)) {
        rows.push(`| ${cells.map(() => '---').join(' | ')} |`);
        hasHr = true;
      }
    });
    return rows.join('\n');
  }

  function dlToMd(dl) {
    const items = [];
    let currentTerm = null;
    let defs = [];

    const flush = () => {
      if (!currentTerm) return;
      const term = currentTerm.trim();
      const defText = defs.map(d => d.trim()).filter(Boolean).join('<br>');
      if (term && defText) items.push(`- **${term}**：${defText}`);
      else if (term) items.push(`- **${term}**`);
      currentTerm = null;
      defs = [];
    };

    for (const ch of Array.from(dl.children)) {
      if (ch.tagName === 'DT') {
        flush();
        currentTerm = mdInline(ch);
      } else if (ch.tagName === 'DD') {
        defs.push(mdInline(ch));
      }
    }
    flush();

    return items.length ? `\n\n${items.join('\n')}\n\n` : '';
  }

  function figureToMd(fig) {
    const imgs = Array.from(fig.querySelectorAll('img')).map(img => md(img, { depth: 0 }).trim()).filter(Boolean);
    const capEl = fig.querySelector('figcaption');
    const cap = capEl ? mdInline(capEl).trim() : '';
    let out = '';
    if (imgs.length) out += imgs.join('\n\n');
    if (cap) out += (out ? '\n\n' : '') + `*${cap}*`;
    return out ? `\n\n${out}\n\n` : '';
  }

  function md(node, ctx) {
    ctx = ctx || { depth: 0 };
    if (!node) return '';
    if (isOurUI(node) || isHiddenInClone(node)) return '';

    if (node.nodeType === 3) {
      const raw = node.nodeValue || '';
      const ptag = node.parentElement?.tagName || '';
      if (ptag === 'PRE' || ptag === 'CODE') return raw;
      if (/^\s+$/.test(raw)) {
        return wsTextNodeToSpace(node) || (INLINE_PARENT.has(ptag) ? ' ' : '');
      }
      return String(raw).replace(/\s+/g, ' ');
    }
    if (node.nodeType !== 1) return '';

    const T = node.tagName;
    if (/^(SCRIPT|STYLE|NOSCRIPT|SVG|MJX-ASSISTIVE-MML|TEMPLATE)$/.test(T)) return '';
    if (S.get('ignoreNav') && (T === 'NAV' || isNavLike(node))) return '';

    const children = (cctx) => {
      let r = '';
      for (const c of Array.from(node.childNodes)) r = smartConcat(r, md(c, cctx ?? ctx));
      return r;
    };

    if (T === 'FIGURE') return figureToMd(node);
    if (T === 'DL') return dlToMd(node);

    if (T === 'DIV' && node.hasAttribute('data-code-block')) {
      const header = node.querySelector(':scope > div:first-child');
      const lang = (header?.textContent || '').trim().toLowerCase();
      const codeEl = node.querySelector('pre code') || node.querySelector('pre');
      const content = (codeEl?.textContent || '').replace(/\n+$/g, '');
      const fence = chooseFence(content);
      return `\n\n${fence}${lang ? lang : ''}\n${content}\n${fence}\n\n`;
    }

    if (T === 'DETAILS') {
      const open = node.hasAttribute('open') ? ' open' : '';
      const summary = node.querySelector(':scope > summary');
      const summaryText = summary ? mdInline(summary).trim() : 'Details';
      let inner = '';
      for (const ch of Array.from(node.childNodes)) {
        if (ch.nodeType === 1 && ch.tagName === 'SUMMARY') continue;
        inner += md(ch, ctx);
      }
      inner = trimNewlinesOnly(inner);
      return `\n\n<details${open}>\n<summary>${summaryText}</summary>\n\n${inner}\n\n</details>\n\n`;
    }

    if (T === 'TABLE') return `\n\n${tableToMd(node)}\n\n`;

    if (T === 'PRE') {
      const cd = node.querySelector('code');
      const lang = detectLang(cd || node);
      const content = (cd || node).textContent || '';
      const body = content.replace(/\n+$/g, '');
      const fence = chooseFence(body);
      return `\n\n${fence}${lang}\n${body}\n${fence}\n\n`;
    }

    if (T === 'INPUT') {
      const type = (node.getAttribute('type') || '').toLowerCase();
      if (type === 'checkbox') {
        const checked = node.checked || node.defaultChecked || node.getAttribute('checked') !== null;
        return checked ? '[x] ' : '[ ] ';
      }
      return '';
    }

    if (T === 'CODE' && node.parentElement?.tagName !== 'PRE') {
      const txt = node.textContent || '';
      return txt.trim() ? wrapInlineCode(txt) : '';
    }

    if (/^H[1-6]$/.test(T)) {
      const lvl = parseInt(T.slice(1), 10);
      const inner = children().trim();
      return inner ? `\n\n${'#'.repeat(lvl)} ${inner}\n\n` : '';
    }

    // 保留硬換行：用 <br>（比單純 \n 更穩，避免 renderer 把換行吃掉）
    if (T === 'BR') return '<br>\n';
    if (T === 'HR') return '\n\n---\n\n';

    if (T === 'A') {
      const text = children().trim() || (node.getAttribute('href') || '');
      const href = hrefForA(node);
      return href ? mdLink(text, href) : escapeBracketText(text);
    }

    if (T === 'IMG') {
      const altRaw = (node.getAttribute('alt') || '').trim();
      const alt = escapeBracketText(altRaw);
      const src = pickImgSrc(node);
      const u = src ? absUrl(src) : '';
      return u ? `![${alt}](${escapeLinkDest(u)})` : (altRaw || '');
    }

    if (T === 'STRONG' || T === 'B') {
      const inner = children().trim();
      return inner ? `**${inner}**` : '';
    }
    if (T === 'EM' || T === 'I') {
      const inner = children().trim();
      return inner ? `*${inner}*` : '';
    }
    if (T === 'DEL' || T === 'S') {
      const inner = children().trim();
      return inner ? `~~${inner}~~` : '';
    }

    if (T === 'Q') {
      const inner = children().trim();
      return inner ? `「${inner}」` : '';
    }

    if (T === 'SUB') return `<sub>${children().trim()}</sub>`;
    if (T === 'SUP') return `<sup>${children().trim()}</sup>`;
    if (T === 'KBD') return `<kbd>${children().trim()}</kbd>`;
    if (T === 'U') return `<u>${children()}</u>`;
    if (T === 'MARK') return `<mark>${children()}</mark>`;

    if (node.matches?.('.katex,.katex-display,mjx-container,.MathJax,span.MathJax,script[type^="math/tex"],math')) {
      if (node.closest?.('pre,code')) return node.textContent || '';
      let tex = extractTex(node);
      if (!tex) return '';
      const block = isDisplayMath(node, tex);
      if (block && S.get('stripCommonIndentInBlockMath')) tex = stripCommonIndent(tex);
      return block ? `\n\n$$\n${tex}\n$$\n\n` : `$${tex}$`;
    }

    if (T === 'BLOCKQUOTE') {
      let inner = children().replace(/\n{3,}/g, '\n\n').trim();

      // 修正：blockquote 內清單如果出現 4 空格縮排，部分 renderer 會誤判成 code block
      // 只針對「行首 4 空格 + list marker」做退一層縮排
      inner = inner.replace(/^\s{4}([-*+] |\d+\. )/gm, '$1');

      const lines = inner.split('\n');
      const out = lines.map(l => (l.trim() === '' ? '> ' : `> ${l}`)).join('\n');
      return `\n\n${out}\n\n`;
    }

    if (T === 'UL' || T === 'OL') {
      const ordered = (T === 'OL');
      let idx = 1, out = '';
      for (const li of Array.from(node.children)) {
        if (li.tagName !== 'LI') continue;
        out += renderLi(li, ctx.depth || 0, ordered ? idx++ : 0);
      }
      return out.trim() ? `\n\n${out}\n\n` : '';
    }

    if (T === 'P') {
      const inner = children().trim();
      return inner ? `\n\n${inner}\n\n` : '';
    }

    if (T === 'DIV' || T === 'SECTION' || T === 'ARTICLE' || T === 'MAIN') {
      return `\n${children()}\n`;
    }

    return children();
  }

  function renderLi(li, depth, olIndex) {
    const indent = ' '.repeat(depth * 4);
    const prefix = olIndex ? `${olIndex}. ` : '- ';

    let contentParts = '';
    let nestedParts = '';

    for (const ch of Array.from(li.childNodes)) {
      if (ch.nodeType === 1 && (ch.tagName === 'UL' || ch.tagName === 'OL')) nestedParts += md(ch, { depth: depth + 1 });
      else contentParts += md(ch, { depth });
    }

    const content = String(contentParts).replace(/\n{3,}/g, '\n\n').trim();
    const nested = nestedParts && nestedParts.trim() ? trimNewlinesOnly(nestedParts) : '';
    if (!content && !nested) return '';

    const lines = content ? content.split('\n') : [''];
    let out = `${indent}${prefix}${lines[0] || ''}\n`;
    for (let i = 1; i < lines.length; i++) out += `${indent}    ${lines[i]}\n`;
    if (nested) out += `${nested}\n`;
    return out;
  }

  // IMPORTANT: block math gets extra blank lines to prevent "$$$$" when adjacent
  function replaceMathWithPlaceholders(container) {
    const map = {};
    let id = 0;

    container.querySelectorAll('.katex,.katex-display,mjx-container,.MathJax,span.MathJax,script[type^="math/tex"],math')
      .forEach(el => {
        if (el.closest('pre,code')) return;
        if (el.closest?.('[data-mdltx-ui="1"]')) return;
        if (el.closest?.('[data-mdltx-hidden="1"]')) return;

        const tex0 = extractTex(el);
        if (!tex0) return;

        const block = isDisplayMath(el, tex0);
        let tex = tex0;
        if (block && S.get('stripCommonIndentInBlockMath')) tex = stripCommonIndent(tex);

        const key = `\u0000MATH${id++}\u0000`;
        map[key] = block ? `\n\n$$\n${tex}\n$$\n\n` : `$${tex}$`;

        const sp = document.createElement('span');
        sp.textContent = key;
        el.replaceWith(sp);
      });

    return map;
  }

  function decideModeNoSelection() {
    const m = String(S.get('noSelectionMode') || 'page');
    return (m === 'article') ? 'article' : 'page';
  }

  async function makeRoot(mode) {
    const rng = (mode === 'selection') ? getSelectionRange() : null;
    const scope = rng
      ? ((rng.commonAncestorContainer.nodeType === 1 ? rng.commonAncestorContainer : rng.commonAncestorContainer.parentElement) || document.body)
      : document.body;

    const hiddenTagged = annotateHidden(scope);
    await waitForMathJax(scope);
    const mjTagged = annotateMathJax(scope);

    let root;
    let actualMode = mode;

    if (mode === 'selection' && rng) {
      const box = document.createElement('div');
      box.appendChild(rng.cloneContents());
      root = box;
    } else if (mode === 'article') {
      const art = findArticleRoot();
      if (!art || art === document.body || isArticleTooSmall(art)) {
        root = document.body.cloneNode(true);
        actualMode = 'page';
      } else {
        root = art.cloneNode(true);
      }
    } else {
      root = document.body.cloneNode(true);
    }

    cleanupMathJaxAnnotations(mjTagged);
    cleanupHiddenAnnotations(hiddenTagged);

    try {
      root.querySelectorAll?.('[data-mdltx-ui="1"],#mdltx-btn,#mdltx-toast').forEach(n => n.remove());
      root.querySelectorAll?.('[data-mdltx-hidden="1"]').forEach(n => {
        if (isMathInfra(n)) {
          n.removeAttribute('data-mdltx-hidden');
          return;
        }
        n.remove();
      });
    } catch (_) {}

    return { root, actualMode };
  }

  async function copyMarkdown(mode) {
    try {
      const { root, actualMode } = await makeRoot(mode);

      const mathMap = replaceMathWithPlaceholders(root);

      let out = md(root, { depth: 0 });

      for (const k of Object.keys(mathMap)) out = out.split(k).join(mathMap[k]);

      out = normalizeOutput(out);

      GM_setClipboard(out);
      toast(`✅ 已複製 Markdown（${actualMode}）\n字元數：${out.length}`);
    } catch (e) {
      console.error('[mdltx] error:', e);
      toast('❌ 轉換失敗：' + (e?.message || String(e)));
    }
  }

  function addButton() {
    if (!S.get('showButton')) return;
    if (document.getElementById('mdltx-btn')) return;

    const btn = document.createElement('div');
    btn.id = 'mdltx-btn';
    btn.setAttribute('data-mdltx-ui', '1');
    btn.textContent = 'Copy MD';
    btn.title = [
      'Click: selection / default',
      'Shift+Click: page',
      'Alt+M: selection/default',
      'Alt+Shift+M: page',
      'Alt+Ctrl+M: article',
    ].join('\n');

    btn.addEventListener('click', async (e) => {
      const mode = e.shiftKey ? 'page' : (hasSelection() ? 'selection' : decideModeNoSelection());
      await copyMarkdown(mode);
    });
    document.body.appendChild(btn);
  }

  function installHotkey() {
    if (!S.get('hotkeyAltM')) return;

    window.addEventListener('keydown', async (e) => {
      if (!e.altKey || e.metaKey) return;
      if ((e.key || '').toLowerCase() !== 'm') return;

      const t = e.target;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;

      e.preventDefault();

      let mode;
      if (e.shiftKey) mode = 'page';
      else if (e.ctrlKey) mode = 'article';
      else mode = hasSelection() ? 'selection' : decideModeNoSelection();

      await copyMarkdown(mode);
    }, true);
  }

  function installMenu() {
    GM_registerMenuCommand('📋 Copy Selection → Markdown', () => copyMarkdown('selection'));
    GM_registerMenuCommand('📰 Copy Article (smart) → Markdown', () => copyMarkdown('article'));
    GM_registerMenuCommand('🌐 Copy Whole Page → Markdown', () => copyMarkdown('page'));

    GM_registerMenuCommand('⚙️ Set default (no selection): PAGE', () => {
      S.set('noSelectionMode', 'page');
      toast('Default no-selection mode: PAGE');
    });
    GM_registerMenuCommand('⚙️ Set default (no selection): ARTICLE', () => {
      S.set('noSelectionMode', 'article');
      toast('Default no-selection mode: ARTICLE (with fallback)');
    });

    GM_registerMenuCommand('⚙️ Toggle ignore <nav> / role="navigation"', () => {
      const v = !S.get('ignoreNav');
      S.set('ignoreNav', v);
      toast(`ignoreNav = ${v}`);
    });
  }

  addButton();
  installHotkey();
  installMenu();
})();
