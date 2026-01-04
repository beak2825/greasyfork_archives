// ==UserScript==
// @name         CleanGDB
// @namespace    shmVirus-scripts
// @description  Declutters OnlineGDB with Google-styled beautification and local autosave.
// @version      1.1.0
// @author       shmVirus
// @license      MIT
// @match        https://www.onlinegdb.com/*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560330/CleanGDB.user.js
// @updateURL https://update.greasyfork.org/scripts/560330/CleanGDB.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const STYLE_ID = 'ogdb-declutter-css';
  const INDENT = 4;
  const AUTOSAVE_INTERVAL_MS = 5000;
  const KEY_AUTOSAVE_BASE = 'cleangdb:autosave';
  const KEY_MANUAL_BASE = 'cleangdb:manual';

  let lastAutosaveSig = '';
  let autosaveLoopStarted = false;
  let defaultVerticalApplied = false;
  let hotkeysHooked = false;
  let autoRestored = false;

  function injectCSS() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      #left-component{width:0!important;min-width:0!important;overflow:hidden!important;padding:0!important;border:0!important;}
      #my-divider{width:0!important;min-width:0!important;overflow:hidden!important;padding:0!important;border:0!important;}
      #right-component{left:0!important;width:100%!important;}

      #sidebar_adunit_wrapper{display:none!important;}
      #native-inline{display:none!important;}
      #ad_unit_bottom_wrapper,#ad_unit_bottom{display:none!important;}
      a[href*="/upgrade-premium"],a[href="/upgrade-premium"]{display:none!important;}

      #stdin-wrapper>div:first-child{display:flex!important;align-items:center!important;gap:10px!important;}
      #stdin-wrapper>div:first-child>span:first-child{float:none!important;width:auto!important;max-width:55%!important;overflow:visible!important;text-overflow:clip!important;white-space:nowrap!important;}
      #stdin-wrapper>div:first-child>span:nth-of-type(2){display:block!important;flex:1 1 auto!important;}
      #cmd_line_args{width:100%!important;max-width:420px!important;}
    `;
    document.documentElement.appendChild(style);
  }

  function fireResize() {
    window.dispatchEvent(new Event('resize'));
    if (window.$) window.$(window).trigger('resize');
    const ideSplit = document.getElementById('ide-split-pane');
    if (ideSplit) ideSplit.dispatchEvent(new Event('splitpaneresize'));
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
      if (window.$) window.$(window).trigger('resize');
      if (ideSplit) ideSplit.dispatchEvent(new Event('splitpaneresize'));
      if (typeof window.adjustDebugPanSize === 'function') window.adjustDebugPanSize();
    }, 120);
  }

  function openRightPaneIfNeeded() {
    const rightPane = document.getElementById('right-right-component');
    const toggleBtn = document.getElementById('right-sidebar-close');
    if (!rightPane || !toggleBtn) return;
    const w = parseFloat(getComputedStyle(rightPane).width) || 0;
    if (w < 10) toggleBtn.click();
  }

  function isVerticalTerminal() {
    const cw = document.getElementById('console-wrapper');
    if (cw && cw.closest('#right-right-component')) return true;

    const rr = document.getElementById('right-right-component');
    const parent = document.getElementById('ide-split-pane') || rr?.parentElement;
    if (!rr || !parent) return false;

    const rrW = parseFloat(getComputedStyle(rr).width) || 0;
    const rrL = parseFloat(getComputedStyle(rr).left) || 0;
    const parentW = parent.getBoundingClientRect().width || window.innerWidth;

    return rrW > 60 && rrL < (parentW - rrW - 5);
  }

  function ensureVerticalTerminalDefault() {
    if (defaultVerticalApplied) return;
    const fn = window.toggle_input_output_pan_orientation;
    if (typeof fn !== 'function') return;
    if (!isVerticalTerminal()) {
      fn();
      setTimeout(() => { openRightPaneIfNeeded(); fireResize(); }, 80);
    }
    defaultVerticalApplied = true;
  }

  function hookVerticalToggle() {
    const tryHook = () => {
      const fn = window.toggle_input_output_pan_orientation;
      if (typeof fn !== 'function' || fn.__ogdbHooked) return false;

      window.toggle_input_output_pan_orientation = function () {
        const res = fn.apply(this, arguments);
        setTimeout(() => { openRightPaneIfNeeded(); fireResize(); }, 60);
        return res;
      };
      window.toggle_input_output_pan_orientation.__ogdbHooked = true;
      return true;
    };

    if (tryHook()) return;
    const t = setInterval(() => { if (tryHook()) clearInterval(t); }, 200);
    setTimeout(() => clearInterval(t), 10000);
  }

  function getAceEditor() {
    try {
      const el = document.querySelector('.editor_text_panes .tab-pane.active.ace_editor');
      if (!el || !window.ace || typeof window.ace.edit !== 'function') return null;
      return window.ace.edit(el);
    } catch { return null; }
  }

  function getLangLabel() {
    const sel = document.getElementById('lang-select');
    if (!sel) return '';
    const opt = sel.options && sel.selectedIndex >= 0 ? sel.options[sel.selectedIndex] : null;
    const txt = (opt && opt.textContent ? opt.textContent : '') || '';
    const val = (sel.value || '') + '';
    return (txt.trim() || val.trim() || '').trim();
  }

  function getActiveFilename() {
    const selectors = [
      '.editor_text_panes .nav-tabs li.active a',
      '.editor_text_panes .nav-tabs li.active',
      '.nav-tabs li.active a',
      '.nav-tabs li.active',
      '.tabs li.active a',
      '.tabs li.active'
    ];
    for (const s of selectors) {
      const el = document.querySelector(s);
      const t = el && el.textContent ? el.textContent.trim() : '';
      if (t && t.length <= 120) return t;
    }
    return '';
  }

  function normalizeEol(s) { return String(s).replace(/\r\n?/g, '\n'); }
  function stripTrailing(s) { return s.split('\n').map(l => l.replace(/[ \t]+$/g, '')).join('\n'); }
  function ensureFinalNewline(s) { return s.endsWith('\n') ? s : (s + '\n'); }
  function detab(s) { return s.replace(/\t/g, ' '.repeat(INDENT)); }

  function collapseBlankLines(s, maxBlank) {
    const lines = s.split('\n');
    const out = [];
    let blanks = 0;
    for (const line of lines) {
      if (line.trim() === '') {
        blanks += 1;
        if (blanks <= maxBlank) out.push('');
      } else {
        blanks = 0;
        out.push(line);
      }
    }
    return out.join('\n');
  }

  function extOf(name) {
    const n = String(name || '').trim();
    const m = n.match(/\.([A-Za-z0-9]+)$/);
    return m ? m[1].toLowerCase() : '';
  }

  function langKey(label) {
    return String(label || '')
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '')
      .replace(/,/g, '')
      .replace(/_/g, '');
  }

  function classify(kindLabel, filename) {
    const ext = extOf(filename);
    if (ext) {
      if (ext === 'py') return 'python';
      if (['c', 'h', 'cc', 'cpp', 'cxx', 'hpp', 'hh', 'hxx', 'java', 'kt', 'php', 'cs', 'go', 'rs', 'swift', 'js', 'ts', 'jsx', 'tsx', 'css'].includes(ext)) return 'brace';
      return 'text';
    }

    const k = langKey(kindLabel);
    if (!k) return 'text';
    if (k.includes('python')) return 'python';
    if (k.includes('javascript')) return 'brace';
    if (k.includes('c++') || k.includes('cpp')) return 'brace';
    if (k === 'c' || k.startsWith('c(')) return 'brace';
    if (['java', 'kotlin', 'php', 'swift', 'rust', 'go'].includes(k)) return 'brace';
    if (k === 'c#' || k === 'csharp') return 'brace';
    if (k.includes('objectivec') || k.includes('objc')) return 'brace';
    if (k.includes('node') || k.includes('rhino')) return 'brace';
    if (k.includes('html') || k.includes('css')) return 'text';
    return 'text';
  }

  function kAndRLineJoiner(s) {
    const joinAfterBraceWords = new Set(['else', 'catch', 'finally', 'while']);
    const lines = s.split('\n');
    for (let i = 0; i < lines.length - 1;) {
      const at = lines[i].trimEnd();
      const b = lines[i + 1];
      const bt = b.trim();

      if (at.endsWith(')') && bt.startsWith('{')) { lines[i] = at + ' ' + bt; lines.splice(i + 1, 1); continue; }
      if (at.endsWith('}') && bt.length > 0) {
        const head = bt.split(/\s+/)[0];
        if (joinAfterBraceWords.has(head)) { lines[i] = at + ' ' + b.trimStart(); lines.splice(i + 1, 1); continue; }
      }
      if ((/\belse(\s+if\s*\(.*\))?\s*$/.test(at) || /^\s*(catch|finally)\b/.test(at)) && bt.startsWith('{')) {
        lines[i] = at + ' ' + bt; lines.splice(i + 1, 1); continue;
      }
      i += 1;
    }
    return lines.join('\n');
  }

  function isWordChar(ch) { return !!ch && /[A-Za-z0-9_]/.test(ch); }

  function formatParenContent(content, isForHeader) {
    let s = content;
    s = s.replace(/\s*,\s*/g, ', ');
    if (isForHeader) s = s.replace(/\s*;\s*/g, '; ');
    s = s.replace(/\s*(==|!=|<=|>=|&&|\|\|)\s*/g, ' $1 ');
    s = s.replace(/\s*([+\-/%*])\s*/g, ' $1 ');
    s = s.replace(/(^|[^=!<>])=([^=>])/g, '$1 = $2');
    s = s.replace(/\s*(<|>)\s*/g, ' $1 ');
    s = s.replace(/[ \t]+/g, ' ').trim();
    return s;
  }

  function formatControlParens(code) {
    const kwSet = new Set(['if', 'for', 'while', 'switch', 'catch']);
    const out = [];
    let i = 0;

    let inBlock = false, inLine = false, inStr = false, inChar = false;
    let lineStart = true;

    function push(ch) { out.push(ch); }

    while (i < code.length) {
      const ch = code[i];
      const nx = code[i + 1];

      if (lineStart && ch === '#') { while (i < code.length && code[i] !== '\n') { push(code[i]); i++; } continue; }

      if (inLine) { push(ch); if (ch === '\n') { inLine = false; lineStart = true; } i++; continue; }
      if (inBlock) { push(ch); if (ch === '*' && nx === '/') { push(nx); i += 2; inBlock = false; continue; } if (ch === '\n') lineStart = true; i++; continue; }

      if (inStr) { push(ch); if (ch === '\\') { push(code[i + 1] || ''); i += 2; continue; } if (ch === '"') inStr = false; if (ch === '\n') lineStart = true; i++; continue; }
      if (inChar) { push(ch); if (ch === '\\') { push(code[i + 1] || ''); i += 2; continue; } if (ch === "'") inChar = false; if (ch === '\n') lineStart = true; i++; continue; }

      if (ch === '/' && nx === '/') { push(ch); push(nx); i += 2; inLine = true; lineStart = false; continue; }
      if (ch === '/' && nx === '*') { push(ch); push(nx); i += 2; inBlock = true; lineStart = false; continue; }
      if (ch === '"') { push(ch); i++; inStr = true; lineStart = false; continue; }
      if (ch === "'") { push(ch); i++; inChar = true; lineStart = false; continue; }

      if (isWordChar(ch) && (i === 0 || !isWordChar(code[i - 1]))) {
        let j = i;
        while (j < code.length && isWordChar(code[j])) j++;
        const word = code.slice(i, j);

        if (kwSet.has(word)) {
          let k = j;
          while (k < code.length && (code[k] === ' ' || code[k] === '\t')) k++;
          if (code[k] === '(') {
            out.push(word, ' ', '(');
            let depth = 1;
            let p = k + 1;
            let buf = '';
            let pb = false, pl = false, ps = false, pc = false;

            while (p < code.length) {
              const c = code[p];
              const n = code[p + 1];

              if (pl) { buf += c; if (c === '\n') pl = false; p++; continue; }
              if (pb) { buf += c; if (c === '*' && n === '/') { buf += n; p += 2; pb = false; continue; } p++; continue; }
              if (ps) { buf += c; if (c === '\\') { buf += (code[p + 1] || ''); p += 2; continue; } if (c === '"') ps = false; p++; continue; }
              if (pc) { buf += c; if (c === '\\') { buf += (code[p + 1] || ''); p += 2; continue; } if (c === "'") pc = false; p++; continue; }

              if (c === '/' && n === '/') { buf += c + n; p += 2; pl = true; continue; }
              if (c === '/' && n === '*') { buf += c + n; p += 2; pb = true; continue; }
              if (c === '"') { buf += c; p++; ps = true; continue; }
              if (c === "'") { buf += c; p++; pc = true; continue; }

              if (c === '(') { depth++; buf += c; p++; continue; }
              if (c === ')') {
                depth--;
                if (depth === 0) {
                  out.push(formatParenContent(buf, word === 'for'), ')');
                  i = p + 1;
                  buf = '';
                  break;
                }
                buf += c; p++; continue;
              }

              buf += c; p++;
            }
            continue;
          }
        }
      }

      push(ch);
      lineStart = (ch === '\n');
      i++;
    }

    return out.join('');
  }

  function formatBraceLangSpacing(code) {
    const out = [];
    let inBlock = false, inLine = false, inStr = false, inChar = false;
    let paren = 0, brack = 0;
    let lineStart = true;

    const multiOps = ['==', '!=', '<=', '>=', '&&', '||', '+=', '-=', '*=', '/=', '%=', '&=', '|=', '^='];

    function trimOutSpaces() { while (out.length && (out[out.length - 1] === ' ' || out[out.length - 1] === '\t')) out.pop(); }
    function skipSpacesForward(src, idx) { let i = idx; while (i < src.length && (src[i] === ' ' || src[i] === '\t')) i++; return i; }
    function prevNonSpaceChar() { for (let i = out.length - 1; i >= 0; i--) { const c = out[i]; if (c !== ' ' && c !== '\t') return c; } return ''; }
    function nextNonSpaceChar(src, idx) { let i = idx; while (i < src.length && (src[i] === ' ' || src[i] === '\t')) i++; return src[i] || ''; }
    function addSpacedOperator(op) { const prev = prevNonSpaceChar(); if (prev && prev !== '\n' && prev !== '(' && prev !== '[' && prev !== '{' && prev !== ',') out.push(' '); out.push(op); out.push(' '); }
    function isUnaryContext(prev) { return !prev || prev === '\n' || '([,{=:+-/*!~?;'.includes(prev); }

    for (let i = 0; i < code.length;) {
      const ch = code[i];
      const nx = code[i + 1];

      if (lineStart && ch === '#') { while (i < code.length && code[i] !== '\n') { out.push(code[i]); i++; } continue; }

      if (inLine) { out.push(ch); if (ch === '\n') { inLine = false; lineStart = true; } i++; continue; }
      if (inBlock) { out.push(ch); if (ch === '*' && nx === '/') { out.push(nx); i += 2; inBlock = false; continue; } if (ch === '\n') lineStart = true; i++; continue; }

      if (inStr) { out.push(ch); if (ch === '\\') { out.push(code[i + 1] || ''); i += 2; continue; } if (ch === '"') inStr = false; if (ch === '\n') lineStart = true; i++; continue; }
      if (inChar) { out.push(ch); if (ch === '\\') { out.push(code[i + 1] || ''); i += 2; continue; } if (ch === "'") inChar = false; if (ch === '\n') lineStart = true; i++; continue; }

      if (ch === '/' && nx === '/') { out.push(ch, nx); i += 2; inLine = true; lineStart = false; continue; }
      if (ch === '/' && nx === '*') { out.push(ch, nx); i += 2; inBlock = true; lineStart = false; continue; }
      if (ch === '"') { out.push(ch); i++; inStr = true; lineStart = false; continue; }
      if (ch === "'") { out.push(ch); i++; inChar = true; lineStart = false; continue; }

      if (ch === '(') paren++;
      else if (ch === ')') paren = Math.max(0, paren - 1);
      else if (ch === '[') brack++;
      else if (ch === ']') brack = Math.max(0, brack - 1);

      if (ch === ',') {
        trimOutSpaces();
        out.push(',');
        i++;
        i = skipSpacesForward(code, i);
        const n = code[i];
        if (n && n !== '\n' && n !== ')' && n !== ']' && n !== '}') out.push(' ');
        lineStart = false;
        continue;
      }

      if (ch === ';' && paren === 0 && brack === 0) {
        trimOutSpaces();
        out.push(';');
        i++;
        i = skipSpacesForward(code, i);
        const n = code[i];
        if (n && n !== '\n' && n !== ')' && n !== ']' && n !== '}') out.push(' ');
        lineStart = false;
        continue;
      }

      let matched = null;
      for (const op of multiOps) { if (code.startsWith(op, i)) { matched = op; break; } }
      if (matched) {
        trimOutSpaces();
        addSpacedOperator(matched);
        i += matched.length;
        i = skipSpacesForward(code, i);
        lineStart = false;
        continue;
      }

      if (ch === '=' && nx !== '=' && nx !== '>') {
        trimOutSpaces();
        addSpacedOperator('=');
        i++;
        i = skipSpacesForward(code, i);
        lineStart = false;
        continue;
      }

      if (ch === '+' || ch === '-' || ch === '/' || ch === '%' || ch === '*') {
        const prev = prevNonSpaceChar();
        const next = nextNonSpaceChar(code, i + 1);
        if (!isUnaryContext(prev) && next && next !== '\n' && next !== ')' && next !== ']' && next !== '}') {
          trimOutSpaces();
          addSpacedOperator(ch);
          i++;
          i = skipSpacesForward(code, i);
          lineStart = false;
          continue;
        }
      }

      out.push(ch);
      lineStart = (ch === '\n');
      i++;
    }

    return out.join('')
      .replace(/[ \t]+\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n');
  }

  function braceDeltaScan(s, state) {
    let { inBlockComment } = state;
    let inString = false, inChar = false;
    let delta = 0;

    for (let i = 0; i < s.length; i++) {
      const ch = s[i];
      const nx = s[i + 1];

      if (inBlockComment) { if (ch === '*' && nx === '/') { inBlockComment = false; i++; } continue; }
      if (inString) { if (ch === '\\') { i++; continue; } if (ch === '"') inString = false; continue; }
      if (inChar) { if (ch === '\\') { i++; continue; } if (ch === "'") inChar = false; continue; }

      if (ch === '/' && nx === '/') break;
      if (ch === '/' && nx === '*') { inBlockComment = true; i++; continue; }
      if (ch === '"') { inString = true; continue; }
      if (ch === "'") { inChar = true; continue; }

      if (ch === '{') delta++;
      else if (ch === '}') delta--;
    }

    state.inBlockComment = inBlockComment;
    return delta;
  }

  function reindentBraceLang(code) {
    const lines = code.split('\n');
    const out = [];
    let indent = 0;
    const state = { inBlockComment: false };

    for (let idx = 0; idx < lines.length; idx++) {
      const rawLine = lines[idx];
      const trimmedLeft = rawLine.replace(/^\s+/, '');

      if (trimmedLeft === '') { out.push(''); continue; }
      if (trimmedLeft.startsWith('#')) { out.push(trimmedLeft); continue; }

      let leadClose = 0;
      if (!state.inBlockComment) { while (leadClose < trimmedLeft.length && trimmedLeft[leadClose] === '}') leadClose++; }

      indent = Math.max(indent - leadClose, 0);
      out.push(' '.repeat(indent * INDENT) + trimmedLeft);

      const scan = trimmedLeft.slice(leadClose);
      indent += braceDeltaScan(scan, state);
      if (indent < 0) indent = 0;
    }

    return out.join('\n');
  }

  function formatPython(code) {
    const lines = code.split('\n').map((line) => {
      const m = line.match(/^\t+/);
      if (!m) return line;
      return ' '.repeat(m[0].length * INDENT) + line.slice(m[0].length);
    });

    let s = stripTrailing(lines.join('\n').replace(/\t/g, ' '.repeat(INDENT)));

    const out = [];
    let inStr = false, quote = '';

    const skipSpaces = (str, idx) => {
      let i = idx;
      while (i < str.length && (str[i] === ' ' || str[i] === '\t')) i++;
      return i;
    };

    for (let i = 0; i < s.length; i++) {
      const ch = s[i];

      if (!inStr && ch === '#') {
        while (i < s.length && s[i] !== '\n') { out.push(s[i]); i++; }
        if (i < s.length) out.push('\n');
        continue;
      }

      if (inStr) {
        out.push(ch);
        if (ch === '\\') { out.push(s[i + 1] || ''); i++; continue; }
        if (ch === quote) { inStr = false; quote = ''; }
        continue;
      }

      if (ch === '"' || ch === "'") { inStr = true; quote = ch; out.push(ch); continue; }

      if (ch === ',') {
        while (out.length && (out[out.length - 1] === ' ' || out[out.length - 1] === '\t')) out.pop();
        out.push(',');

        const j = skipSpaces(s, i + 1);
        i = j - 1;

        const next = s[i + 1];
        if (next && next !== '\n' && next !== ')' && next !== ']' && next !== '}') out.push(' ');
        continue;
      }

      out.push(ch);
    }

    s = out.join('');
    s = s.replace(/[ \t]+\n/g, '\n');
    s = collapseBlankLines(s, 2);
    s = ensureFinalNewline(s);
    return s;
  }

  function formatTextOnly(code) {
    code = ensureFinalNewline(stripTrailing(detab(normalizeEol(code))));
    code = collapseBlankLines(code, 2);
    return code;
  }

  function applyGoogleishFormat() {
    const ed = getAceEditor();
    if (!ed) return false;

    const raw = ed.getValue();
    const label = getLangLabel();
    const filename = getActiveFilename();
    const kind = classify(label, filename);

    let code = ensureFinalNewline(stripTrailing(detab(normalizeEol(raw))));
    code = collapseBlankLines(code, 2);

    if (kind === 'python') {
      code = formatPython(code);
    } else if (kind === 'brace') {
      code = formatControlParens(code);
      code = kAndRLineJoiner(code);
      code = formatBraceLangSpacing(code);
      code = reindentBraceLang(code);
      code = ensureFinalNewline(stripTrailing(code));
    } else {
      code = formatTextOnly(code);
    }

    if (code !== raw) {
      ed.setValue(code, -1);
      return true;
    }
    return false;
  }

  function wrapBeautifyCode() {
    const tryWrap = () => {
      const fn = window.beautifyCode;
      if (typeof fn !== 'function' || fn.__cleangdbWrapped) return false;

      const wrapped = function () {
        try { applyGoogleishFormat(); } catch {}
        return undefined;
      };

      wrapped.__cleangdbWrapped = true;
      window.beautifyCode = wrapped;
      return true;
    };

    if (tryWrap()) return;

    const t = setInterval(() => { if (tryWrap()) clearInterval(t); }, 200);
    setTimeout(() => clearInterval(t), 10000);
  }

  function isEditMode() {
    return !!document.getElementById('control-btn-save') || !!document.getElementById('control-btn-newfile');
  }

  function keyInfo() {
    try {
      const url = new URL(location.href);
      url.hash = '';
      const sp = url.searchParams;
      const pid = (sp.get('i') || sp.get('id') || sp.get('share') || '').trim();
      const path = (url.pathname || '/').trim() || '/';
      return { pid, path };
    } catch {
      return { pid: '', path: (location.pathname || '/').trim() || '/' };
    }
  }

  function makeKey(base) {
    const { pid, path } = keyInfo();
    if (pid) return `${base}:${path}:i=${pid}`;
    return `${base}:${path}`;
  }

  function storeGet(key) {
    try { return localStorage.getItem(key) || ''; } catch { return ''; }
  }
  function storeSet(key, val) {
    try { localStorage.setItem(key, val); return true; } catch { return false; }
  }
  function storeDel(key) {
    try { localStorage.removeItem(key); return true; } catch { return false; }
  }

  function getIDE() {
    const ide = window.ide;
    if (!ide || !ide.editor) return null;
    if (typeof ide.editor.get_files !== 'function') return null;
    if (typeof ide.editor.set_files !== 'function') return null;
    return ide;
  }

  function snapshotFiles() {
    const ide = getIDE();
    if (!ide) return null;
    try { return ide.editor.get_files(); } catch { return null; }
  }

  function restoreFiles(files) {
    const ide = getIDE();
    if (!ide) return false;

    try { if (typeof ide.editor.clear_all_editors === 'function') ide.editor.clear_all_editors(); } catch {}
    try { ide.editor.set_files(files); } catch { return false; }
    try { if (typeof ide.editor.delete_file === 'function') ide.editor.delete_file(''); } catch {}
    return true;
  }

  function computeSig(obj) {
    try { return JSON.stringify(obj); } catch { return ''; }
  }

  function writeSlot(baseKey, files) {
    const payload = { t: Date.now(), href: location.href, files };
    return storeSet(baseKey, JSON.stringify(payload));
  }

  function readSlot(baseKey) {
    const raw = storeGet(baseKey);
    if (!raw) return null;
    try {
      const payload = JSON.parse(raw);
      if (!payload || !payload.files) return null;
      return payload;
    } catch {
      return null;
    }
  }

  function autosaveOnce() {
    const files = snapshotFiles();
    if (!files) return;

    const sig = computeSig(files);
    if (sig && sig === lastAutosaveSig) return;

    writeSlot(makeKey(KEY_AUTOSAVE_BASE), files);
    if (sig) lastAutosaveSig = sig;
  }

  function restoreAutosaveSilently() {
    const payload = readSlot(makeKey(KEY_AUTOSAVE_BASE));
    if (!payload) return false;
    const ok = restoreFiles(payload.files);
    if (!ok) return false;
    lastAutosaveSig = computeSig(payload.files);
    fireResize();
    return true;
  }

  function manualSave() {
    const files = snapshotFiles();
    if (!files) return;
    writeSlot(makeKey(KEY_MANUAL_BASE), files);
  }

  function manualLoad() {
    const payload = readSlot(makeKey(KEY_MANUAL_BASE));
    if (!payload) return;
    if (!getIDE()) return;
    restoreFiles(payload.files);
    fireResize();
  }

  function manualDelete() {
    storeDel(makeKey(KEY_MANUAL_BASE));
  }

  function setBtnIconText(btn, iconClass, text) {
    btn.textContent = '';
    const icon = document.createElement('span');
    icon.className = iconClass;
    icon.setAttribute('aria-hidden', 'true');
    btn.appendChild(icon);
    btn.appendChild(document.createTextNode(' ' + text));
  }

  function cloneButtonStyle(fromBtn, btn) {
    if (!fromBtn) return;
    btn.className = fromBtn.className || btn.className;
    btn.style.cssText = fromBtn.style.cssText || btn.style.cssText;
    btn.style.marginLeft = '6px';
  }

  function makeToolbarButton(id, iconClass, text, title, onClick) {
    const btn = document.createElement('button');
    btn.id = id;
    btn.type = 'button';
    setBtnIconText(btn, iconClass, text);
    btn.title = title || '';
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      try { onClick(); } catch {}
    }, true);
    return btn;
  }

  function localizeSaveButtonToManual() {
    const orig = document.getElementById('control-btn-save');
    if (!orig || !orig.parentElement) return;
    if (orig.getAttribute('data-cleangdb-manual') === '1') return;

    const clone = orig.cloneNode(true);
    clone.setAttribute('data-cleangdb-manual', '1');
    clone.removeAttribute('onclick');
    try { clone.onclick = null; } catch {}

    clone.title = 'Save locally (manual slot)';
    clone.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      manualSave();
    }, true);

    orig.parentElement.replaceChild(clone, orig);
  }

  function ensureManualButtons() {
    if (!isEditMode()) return;

    localizeSaveButtonToManual();

    const saveBtn = document.getElementById('control-btn-save');
    if (!saveBtn || !saveBtn.parentElement) return;

    const loadId = 'cleangdb-btn-load-manual';
    const delId = 'cleangdb-btn-delete-manual';

    let loadBtn = document.getElementById(loadId);
    let delBtn = document.getElementById(delId);

    if (!loadBtn) {
      loadBtn = makeToolbarButton(loadId, 'glyphicon glyphicon-folder-open', 'Load', 'Load manual local save', manualLoad);
      cloneButtonStyle(saveBtn, loadBtn);
      saveBtn.insertAdjacentElement('afterend', loadBtn);
    }

    if (!delBtn) {
      delBtn = makeToolbarButton(delId, 'glyphicon glyphicon-trash', 'Delete', 'Delete manual local save', manualDelete);
      cloneButtonStyle(saveBtn, delBtn);
      loadBtn.insertAdjacentElement('afterend', delBtn);
    }
  }

  function hookSaveHotkeysOnce() {
    if (hotkeysHooked) return;
    hotkeysHooked = true;

    const isSaveKey = (e) => {
      const key = (e.key || '').toLowerCase();
      const code = (e.code || '').toLowerCase();
      const kc = e.keyCode || 0;
      return (e.ctrlKey || e.metaKey) && !e.altKey && !e.shiftKey && (key === 's' || code === 'keys' || kc === 83);
    };

    const handler = (e) => {
      if (!isEditMode()) return;
      if (!isSaveKey(e)) return;
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      try { e.returnValue = false; } catch {}
      manualSave();
      return false;
    };

    window.addEventListener('keydown', handler, true);
    document.addEventListener('keydown', handler, true);
    window.addEventListener('keypress', handler, true);
    document.addEventListener('keypress', handler, true);
  }

  function startAutosaveLoop() {
    if (autosaveLoopStarted) return;
    autosaveLoopStarted = true;

    const tick = () => {
      autosaveOnce();
      setTimeout(tick, AUTOSAVE_INTERVAL_MS);
    };
    tick();

    window.addEventListener('beforeunload', () => { try { autosaveOnce(); } catch {} }, { capture: true });
  }

  function initAutosaveAndRestore() {
    if (!isEditMode()) return;
    if (!getIDE()) return;

    if (!autoRestored) {
      autoRestored = true;
      restoreAutosaveSilently();
    }

    if (!autosaveLoopStarted) startAutosaveLoop();
  }

  function ensureAll() {
    injectCSS();
    wrapBeautifyCode();
    ensureManualButtons();
    hookSaveHotkeysOnce();
    initAutosaveAndRestore();
  }

  ensureAll();
  hookVerticalToggle();
  fireResize();

  const t2 = setInterval(() => {
    ensureVerticalTerminalDefault();
    ensureManualButtons();
    initAutosaveAndRestore();
    if (defaultVerticalApplied && autosaveLoopStarted) clearInterval(t2);
  }, 200);
  setTimeout(() => clearInterval(t2), 10000);

  const mo = new MutationObserver(() => ensureAll());
  mo.observe(document.documentElement, { childList: true, subtree: true });
})();