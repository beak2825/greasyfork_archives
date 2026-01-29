// ==UserScript==
// @name         DeepSeek Chat Code Exporter (Authoritative Lang→Ext)
// @namespace    https://tampermonkey.net/
// @version      1.7.0
// @description  Export DeepSeek chat code blocks with hard language detection, per-block override, and correct file extensions.
// @match        https://chat.deepseek.com/*
// @match        https://*.deepseek.com/*
// @grant        GM_download
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/564272/DeepSeek%20Chat%20Code%20Exporter%20%28Authoritative%20Lang%E2%86%92Ext%29.user.js
// @updateURL https://update.greasyfork.org/scripts/564272/DeepSeek%20Chat%20Code%20Exporter%20%28Authoritative%20Lang%E2%86%92Ext%29.meta.js
// ==/UserScript==

(() => {
  'use strict';

  /* ============================================================
     STATE
  ============================================================ */

  const STORAGE_KEY = 'ds_exporter_state_v7';
  const DEFAULT_STATE = {
    x: 24,
    y: 24,
    prepend: 'none',   // none | timestamp | title | both
    unknownAs: 'txt'   // fallback extension
  };

  let state = loadState();
  let blocks = [];
  let lastSig = '';

  /* ============================================================
     STORAGE
  ============================================================ */

  function loadState() {
    try {
      return { ...DEFAULT_STATE, ...JSON.parse(localStorage.getItem(STORAGE_KEY)) };
    } catch {
      return { ...DEFAULT_STATE };
    }
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  /* ============================================================
     UTIL
  ============================================================ */

  const debounce = (fn, ms = 250) => {
    let t;
    return (...a) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...a), ms);
    };
  };

  const visible = el => {
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  };

  const sanitize = s =>
    (s || '')
      .replace(/\s+/g, '_')
      .replace(/[<>:"/\\|?*\x00-\x1F]/g, '')
      .slice(0, 80);

  const timestamp = () => {
    const d = new Date();
    return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}_${String(d.getHours()).padStart(2, '0')}${String(d.getMinutes()).padStart(2, '0')}${String(d.getSeconds()).padStart(2, '0')}`;
  };

  const hash = s => {
    let h = 5381;
    for (let i = 0; i < s.length; i++) h = ((h << 5) + h) ^ s.charCodeAt(i);
    return (h >>> 0).toString(16);
  };

  /* ============================================================
     LANGUAGE + EXTENSION (SINGLE AUTHORITY)
  ============================================================ */

  const EXT = {
    python: 'py',
    javascript: 'js',
    typescript: 'ts',
    bash: 'sh',
    json: 'json',
    yaml: 'yml',
    markdown: 'md',
    html: 'html',
    xml: 'xml',
    sql: 'sql',
    rust: 'rs',
    go: 'go',
    java: 'java',
    cpp: 'cpp',
    c: 'c',
    csharp: 'cs',
    php: 'php',
    ruby: 'rb'
  };

  function normalizeLang(s) {
    return (s || '').trim().toLowerCase();
  }

  function resolveLangAndExt(block) {
    const raw = block.overrideLang || block.inferredLang || '';
    const lang = normalizeLang(raw);

    // HARD GUARANTEES
    if (lang === 'python') return { lang: 'python', ext: 'py' };

    if (EXT[lang]) return { lang, ext: EXT[lang] };

    return { lang: lang || 'unknown', ext: state.unknownAs || 'txt' };
  }

  /* ============================================================
     HARD PYTHON DOMINANCE
  ============================================================ */

  function hardDetectPython(code) {
    const s = code.replace(/\r\n/g, '\n');

    if (/\bimport\s+\w+/.test(s) && /\bdef\s+\w+\s*\(/.test(s)) return 'python';
    if (/\bclass\s+\w+\s*\(.*TestCase.*\)/.test(s)) return 'python';
    if (/\bif\s+__name__\s*==\s*['"]__main__['"]\s*:/.test(s)) return 'python';
    if (/^\s{4,}\w+/m.test(s) && /\b(self|None|True|False)\b/.test(s)) return 'python';

    return '';
  }

  /* ============================================================
     DETECTION
  ============================================================ */

  function detectBlocks() {
    const out = [];
    const seen = new Set();

    document.querySelectorAll('pre').forEach(pre => {
      if (!visible(pre)) return;

      const codeEl = pre.querySelector('code') || pre;
      const code = codeEl.textContent.replace(/\u00a0/g, ' ');
      if (!code.trim()) return;

      let inferredLang = hardDetectPython(code);

      if (!inferredLang) {
        const cls = `${codeEl.className || ''} ${pre.className || ''}`;
        const m = cls.match(/language-([\w+-]+)/i);
        if (m) inferredLang = m[1];
      }

      const id = hash(code);
      if (seen.has(id)) return;
      seen.add(id);

      out.push({
        id,
        code,
        inferredLang: normalizeLang(inferredLang),
        overrideLang: ''
      });
    });

    return out;
  }

  /* ============================================================
     BUILD
  ============================================================ */

  function prefix() {
    const p = [];
    if (state.prepend === 'timestamp' || state.prepend === 'both') p.push(timestamp());
    if (state.prepend === 'title' || state.prepend === 'both') p.push(sanitize(document.title));
    return p.length ? p.join('__') + '__' : '';
  }

  function build() {
    const detected = detectBlocks();
    const sig = state.prepend + state.unknownAs + detected.map(b => b.id).join('|');
    if (sig === lastSig) return;
    lastSig = sig;

    const pre = prefix();

    blocks = detected.map((b, i) => {
      const idx = String(i + 1).padStart(3, '0');
      const { lang, ext } = resolveLangAndExt(b);

      return {
        ...b,
        idx,
        finalLang: lang,
        filename: `${pre}code_${idx}.${ext}`
      };
    });

    render();
  }

  const refresh = debounce(build);

  /* ============================================================
     UI
  ============================================================ */

  let ui;

  function injectUI() {
    if (document.getElementById('ds-exporter')) return;

    const style = document.createElement('style');
    style.textContent = `
      #ds-exporter {
        position: fixed;
        z-index: 2147483647;
        width: 420px;
        background: #111;
        color: #eee;
        border-radius: 12px;
        border: 1px solid #333;
        font-family: system-ui;
      }
      #ds-exporter header {
        padding: 10px;
        font-weight: 800;
        cursor: move;
        background: #1b1b1b;
      }
      #ds-exporter main { padding: 10px; }
      select, button {
        width: 100%;
        margin: 4px 0;
        padding: 6px;
        background: #222;
        color: #fff;
        border: 1px solid #444;
        border-radius: 6px;
      }
      #preview {
        font-family: monospace;
        font-size: 11px;
        background: #000;
        padding: 6px;
        height: 220px;
        overflow: auto;
      }
    `;
    document.head.appendChild(style);

    const root = document.createElement('div');
    root.id = 'ds-exporter';
    root.style.left = state.x + 'px';
    root.style.top = state.y + 'px';

    root.innerHTML = `
      <header>DeepSeek Code Export</header>
      <main>
        <div id="status">Scanning…</div>

        <select id="prepend">
          <option value="none">No prepend</option>
          <option value="timestamp">Timestamp</option>
          <option value="title">Title</option>
          <option value="both">Timestamp + Title</option>
        </select>

        <select id="unknown">
          <option value="txt">Unknown → .txt</option>
          <option value="py">Unknown → .py</option>
          <option value="md">Unknown → .md</option>
        </select>

        <div id="preview"></div>

        <button id="sep">Export Separate</button>
        <button id="md">Export Markdown</button>
      </main>
    `;

    document.body.appendChild(root);

    ui = {
      root,
      header: root.querySelector('header'),
      status: root.querySelector('#status'),
      preview: root.querySelector('#preview'),
      prepend: root.querySelector('#prepend'),
      unknown: root.querySelector('#unknown'),
      sep: root.querySelector('#sep'),
      md: root.querySelector('#md')
    };

    ui.prepend.value = state.prepend;
    ui.unknown.value = state.unknownAs;

    let dx, dy, drag = false;
    ui.header.onmousedown = e => {
      drag = true;
      dx = e.clientX - root.offsetLeft;
      dy = e.clientY - root.offsetTop;
    };
    document.onmousemove = e => {
      if (!drag) return;
      state.x = e.clientX - dx;
      state.y = e.clientY - dy;
      root.style.left = state.x + 'px';
      root.style.top = state.y + 'px';
      saveState();
    };
    document.onmouseup = () => drag = false;

    ui.prepend.onchange = () => {
      state.prepend = ui.prepend.value;
      saveState();
      build();
    };

    ui.unknown.onchange = () => {
      state.unknownAs = ui.unknown.value;
      saveState();
      build();
    };

    ui.sep.onclick = () => {
      blocks.forEach(b => download(b.filename, b.code));
    };

    ui.md.onclick = () => {
      const md = blocks.map(b => {
        const { lang } = resolveLangAndExt(b);
        return `## ${b.filename}\n\n\`\`\`${lang === 'unknown' ? '' : lang}\n${b.code}\n\`\`\`\n`;
      }).join('\n');

      download(`${sanitize(prefix() + 'deepseek_export')}.md`, md);
    };

    build();
  }

  function render() {
    ui.status.textContent = `Detected ${blocks.length} block(s)`;

    ui.preview.innerHTML = blocks.map((b, i) => {
      const { lang, ext } = resolveLangAndExt(b);
      return `
        <div>
          <b>${b.idx}</b> ${b.filename}<br>
          inferred: <code>${b.inferredLang || 'unknown'}</code>
          →
          <select data-i="${i}">
            <option value="">auto</option>
            ${Object.keys(EXT).map(l =>
              `<option value="${l}" ${b.overrideLang === l ? 'selected' : ''}>${l}</option>`
            ).join('')}
          </select>
          <span style="opacity:.7">[${lang}.${ext}]</span>
        </div>
      `;
    }).join('');

    ui.preview.querySelectorAll('select[data-i]').forEach(sel => {
      sel.onchange = e => {
        blocks[e.target.dataset.i].overrideLang = e.target.value;
        build();
      };
    });
  }

  function download(name, content) {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    GM_download({
      url,
      name,
      saveAs: true,
      onload: () => URL.revokeObjectURL(url)
    });
  }

  /* ============================================================
     BOOT
  ============================================================ */

  injectUI();
  new MutationObserver(refresh).observe(document.body, { childList: true, subtree: true });
  refresh();
})();
