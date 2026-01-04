// ==UserScript==
// @name         tl;dv Transcript Downloader
// @namespace    https://raphael.tools/tldv-transcript
// @version      1.0.0
// @description  Adds a button to download the transcript from tl;dv meeting pages as plain text
// @author       Raphael
// @license      MIT
// @match        https://app.tldv.io/*
// @match        https://www.tldv.io/*
// @match        https://tldv.io/*
// @icon         https://tldv.io/favicon.ico
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/551753/tl%3Bdv%20Transcript%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/551753/tl%3Bdv%20Transcript%20Downloader.meta.js
// ==/UserScript==

(function () {
  'use strict';

  if (!document.body) {
    const ready = () => document.readyState === 'interactive' || document.readyState === 'complete';
    const i = setInterval(() => {
      if (ready() && document.body) {
        clearInterval(i);
        try { init(); } catch (e) { console.error('tldv transcript init error:', e); }
      }
    }, 50);
    return;
  }

  try { init(); } catch (e) { console.error('tldv transcript init error:', e); }

  function init() {
    GM_addStyle(`
      .tldv-fab {
        position: fixed;
        right: 24px;
        bottom: 24px;
        width: 64px;
        height: 64px;
        border-radius: 18px;
        background: linear-gradient(135deg, rgba(255,149,0,0.35), rgba(255,94,0,0.18));
        backdrop-filter: blur(12px) saturate(125%);
        -webkit-backdrop-filter: blur(12px) saturate(125%);
        border: 1px solid rgba(255, 255, 255, 0.28);
        color: #fff7ed;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
        cursor: pointer;
        box-shadow: 0 14px 40px rgba(255,120,0,.25), 0 8px 24px rgba(0,0,0,.35), inset 0 1px 0 rgba(255,255,255,.12);
        z-index: 2147483647;
        user-select: none;
        transition: transform .15s ease, filter .2s ease, box-shadow .2s ease;
      }
      .tldv-fab.inline {
        position: static;
        width: 36px;
        height: 36px;
        border-radius: 12px;
        box-shadow: inset 0 1px 0 rgba(255,255,255,.12);
        background: linear-gradient(135deg, rgba(255,149,0,0.30), rgba(255,94,0,0.14));
        border: 1px solid rgba(255,255,255,.22);
      }
      .tldv-fab::after {
        content: '';
        position: absolute;
        inset: -6px;
        border-radius: 22px;
        background: radial-gradient(closest-side, rgba(255,140,0,.25), transparent 80%);
        pointer-events: none;
        opacity: .85;
        animation: tldvPulse 2s ease-in-out infinite;
      }
      @keyframes tldvPulse { 0%,100%{ opacity:.65 } 50%{ opacity:.9 } }
      .tldv-fab:hover { filter: brightness(1.07); transform: translateY(-1px); box-shadow: 0 16px 44px rgba(255,120,0,.32), 0 10px 28px rgba(0,0,0,.4), inset 0 1px 0 rgba(255,255,255,.16); }
      .tldv-fab:active { transform: translateY(0); }
      .tldv-fab svg { width: 28px; height: 28px; opacity: .98; }
      .tldv-fab.inline svg { width: 20px; height: 20px; }
      .tldv-fab-label {
        position: fixed;
        right: 96px;
        bottom: 36px;
        padding: 6px 10px;
        border-radius: 10px;
        font-size: 12px;
        color: #fff7ed;
        background: linear-gradient(135deg, rgba(17,24,39,.75), rgba(17,24,39,.55));
        border: 1px solid rgba(255,255,255,.18);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        box-shadow: 0 10px 24px rgba(0,0,0,.35);
        z-index: 2147483647;
        opacity: 0; transform: translateX(6px); transition: opacity .15s ease, transform .15s ease;
        pointer-events: none;
      }
      .tldv-fab:hover + .tldv-fab-label { opacity: 1; transform: translateX(0); }
      .tldv-inline-wrap { display: flex; align-items: center; gap: 8px; margin-left: auto; }
      .tldv-modal-backdrop {
        position: fixed; inset: 0; background: rgba(0,0,0,.5); z-index: 2147483646; display: none; align-items: center; justify-content: center;
      }
      .tldv-modal {
        background: #111827; color: #e5e7eb; border: 1px solid #374151; border-radius: 10px; box-shadow: 0 10px 30px rgba(0,0,0,.35); width: min(90vw, 420px); padding: 16px; font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
      }
      .tldv-modal h3 { margin: 0 0 8px 0; font-size: 16px; font-weight: 700; }
      .tldv-modal p { margin: 0 0 12px 0; color: #9ca3af; font-size: 14px; }
      .tldv-actions { display: flex; gap: 8px; justify-content: flex-end; }
      .tldv-btn { background: #2563eb; color: #fff; border: 0; padding: 8px 12px; border-radius: 8px; cursor: pointer; font-weight: 600; }
      .tldv-btn.secondary { background: #374151; }
    `);

    const fab = document.createElement('div');
    fab.className = 'tldv-fab';
    fab.title = 'Download tl;dv transcript';
    fab.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <linearGradient id="tldvGrad" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
            <stop stop-color="#ffb357"/>
            <stop offset="1" stop-color="#ff7a1a"/>
          </linearGradient>
        </defs>
        <path d="M12 3v9m0 0l-3.5-3.5M12 12l3.5-3.5" stroke="url(#tldvGrad)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <rect x="4" y="15" width="16" height="5" rx="2.8" stroke="url(#tldvGrad)" stroke-width="1.8"/>
      </svg>`;
    document.body.appendChild(fab);
    const label = document.createElement('div');
    label.className = 'tldv-fab-label';
    label.textContent = 'Download transcript';
    document.body.appendChild(label);

    const downloadTranscript = async () => {
      const title = getMeetingTitle();
      const ts = new Date().toISOString().slice(0,19).replace(/[:T]/g,'-');
      const filename = `${sanitizeFilename(title || 'tldv-meeting')}-${ts}.txt`;
      // Confirm first; only after confirm do we process/scroll
      openConfirm(filename, null, async () => {
        await ensureFullTranscriptVisible();
        const entries = extractTranscript();
        if (!entries.length) {
          alert('No transcript found on this page. Try opening the Transcript panel first.');
          return;
        }
        const content = formatTranscriptBySpeaker(entries);
        triggerDownload(filename, content, 'text/plain;charset=utf-8');
      });
    };

    fab.addEventListener('click', (e) => { e.preventDefault(); downloadTranscript(); });
    // Smart placement: anchor to transcript header area; fallback to transcript panel; else bottom-right
    function positionFab() {
      const headerTabs = (() => {
        // Look for the Video / Transcript tabs container
        const candidates = [
          ...document.querySelectorAll('button, a')
        ].map((el) => el.closest('[class]')).filter(Boolean);
        const scored = candidates.map((el) => ({ el, score: scoreHeader(el) }))
          .filter((x) => x.score > 0)
          .sort((a,b) => b.score - a.score);
        return scored.length ? scored[0].el : null;
      })();

      if (headerTabs && headerTabs.parentElement) {
        // Inline mount to the right of tabs
        try {
          if (!fab.classList.contains('inline')) fab.classList.add('inline');
          label.style.display = 'none';
          headerTabs.style.display = 'flex';
          const wrap = headerTabs.querySelector('.tldv-inline-wrap') || document.createElement('div');
          wrap.className = 'tldv-inline-wrap';
          if (!wrap.contains(fab)) wrap.appendChild(fab);
          if (!headerTabs.contains(wrap)) headerTabs.appendChild(wrap);
        } catch {}
        return;
      }

      const panel = getByXPath('/html/body/div[1]/div/div/div[2]/div[2]/div/div[2]/div[2]')
        || document.querySelector('[data-testid*="transcript" i], [class*="transcript" i], [aria-label*="transcript" i]');
      if (panel) {
        if (fab.classList.contains('inline')) fab.classList.remove('inline');
        label.style.display = '';
        const r = panel.getBoundingClientRect();
        const x = r.right + 16;
        const y = r.top + (r.height / 2) - (fab.offsetHeight / 2);
        fab.style.position = 'fixed'; fab.style.left = `${Math.min(window.innerWidth - fab.offsetWidth - 16, Math.max(16, x))}px`;
        fab.style.top = `${Math.max(16, Math.min(window.innerHeight - fab.offsetHeight - 16, y))}px`;
        label.style.position = 'fixed';
        label.style.top = `${Math.max(16, Math.min(window.innerHeight - label.offsetHeight - 16, y + (fab.offsetHeight/2 - label.offsetHeight/2)))}px`;
        label.style.left = `${parseFloat(fab.style.left) - (label.offsetWidth + 12)}px`;
        return;
      }

      // Fallback bottom-right
      if (fab.classList.contains('inline')) fab.classList.remove('inline');
      label.style.display = '';
      fab.style.position = 'fixed'; fab.style.right = '24px'; fab.style.bottom = '24px';
      label.style.position = 'fixed'; label.style.right = '96px'; label.style.bottom = '36px';
    }
    positionFab();
    window.addEventListener('resize', positionFab);
    window.addEventListener('scroll', () => { if (!document.hidden) positionFab(); }, { passive: true });

    function scoreHeader(el) {
      try {
        const text = (el.textContent || '').toLowerCase();
        let score = 0;
        if (/(video|transkript|transcript)/.test(text)) score += 5;
        if (/tab|pill|segmented|switch|toggle/.test(el.className)) score += 2;
        // Prefer elements near the video player
        const rect = el.getBoundingClientRect();
        const player = document.querySelector('video')?.getBoundingClientRect();
        if (player) {
          const dy = Math.abs(rect.top - player.top);
          if (dy < 120) score += 2;
        }
        return score;
      } catch { return 0; }
    }

    if (typeof GM_registerMenuCommand === 'function') {
      GM_registerMenuCommand('Download transcript (txt)', downloadTranscript);
    }
    // Lightweight confirm modal
    function openConfirm(filename, content, onConfirm) {
      let backdrop = document.querySelector('.tldv-modal-backdrop');
      if (!backdrop) {
        backdrop = document.createElement('div');
        backdrop.className = 'tldv-modal-backdrop';
        backdrop.innerHTML = `
          <div class="tldv-modal" role="dialog" aria-modal="true" aria-label="Confirm download">
            <h3>Download transcript?</h3>
            <p>This will save a .txt file to your device.</p>
            <div class="tldv-actions">
              <button class="tldv-btn secondary" data-act="cancel">Cancel</button>
              <button class="tldv-btn" data-act="confirm">Download</button>
            </div>
          </div>
        `;
        document.body.appendChild(backdrop);
        backdrop.addEventListener('click', (e) => {
          if (e.target === backdrop) backdrop.style.display = 'none';
        });
      }
      const onClick = (e) => {
        const act = e.target.getAttribute && e.target.getAttribute('data-act');
        if (act === 'cancel') { backdrop.style.display = 'none'; cleanup(); }
        if (act === 'confirm') {
          backdrop.style.display = 'none';
          if (typeof onConfirm === 'function') onConfirm();
          cleanup();
        }
      };
      function cleanup() { backdrop.removeEventListener('click', onClick, true); }
      backdrop.addEventListener('click', onClick, true);
      backdrop.style.display = 'flex';
    }


    function formatTranscriptBySpeaker(entries) {
      // Clean speaker labels and unify
      const cleanSpeaker = (s) => {
        const v = (s || '').trim();
        if (!v) return '';
        if (/^(true|false|0|1|unknown|null|undefined)$/i.test(v)) return '';
        return v;
      };

      // Deduplicate exact repeats (some recordings duplicate lines)
      const dedup = [];
      const seen = new Set();
      for (const e of entries) {
        const speaker = cleanSpeaker(e.speaker);
        const text = (e.text || '').replace(/\s+/g, ' ').trim();
        if (!text) continue;
        const key = `${speaker}|${text}`;
        if (seen.has(key)) continue;
        seen.add(key);
        dedup.push({ speaker, text });
      }

      // Merge consecutive same-speaker lines, split into readable paragraphs
      const merged = [];
      let current = null;
      const maxParaLen = 500;
      for (const e of dedup) {
        if (!current || current.speaker !== e.speaker) {
          if (current) merged.push(current);
          current = { speaker: e.speaker, buffer: [] };
        }
        current.buffer.push(e.text);
      }
      if (current) merged.push(current);

      // Convert buffers to paragraphs
      const blocks = merged
        .filter((m) => m.buffer.length > 0)
        .map((m) => {
          const text = normalizeSpacing(m.buffer.join(' ').split(/(?<=[.!?])\s+/));
          const paras = [];
          let acc = '';
          for (const sentence of text.split(/\s+(?=[A-Z(\["'])/).filter(Boolean)) {
            const candidate = acc ? `${acc} ${sentence}` : sentence;
            if (candidate.length > maxParaLen) { if (acc) paras.push(acc); acc = sentence; }
            else acc = candidate;
          }
          if (acc) paras.push(acc);
          return { speaker: m.speaker, paragraphs: paras.length ? paras : [text] };
        });

      // Assemble with speaker headers; skip empty speaker headers when only one speaker is unknown
      const nonEmptySpeakers = new Set(blocks.map((b) => b.speaker).filter(Boolean));
      const showSpeaker = nonEmptySpeakers.size > 0;
      const outBlocks = blocks.map((b) => {
        const header = showSpeaker ? (b.speaker || 'Unknown') + '\n\n' : '';
        return header + b.paragraphs.join('\n\n');
      });
      return outBlocks.join('\n\n\n');
    }

    function sanitizeFilename(name) {
      return String(name || '')
        .replace(/[\\/:*?"<>|]+/g, '-')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 120);
    }

    function triggerDownload(filename, content, type) {
      const blob = new Blob([content], { type });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      a.remove();
    }

    function getMeetingTitle() {
      const h1 = document.querySelector('h1, header h1, [data-testid*="title" i], [class*="title" i]');
      const fromMeta = document.querySelector('meta[property="og:title"], meta[name="title"]');
      const t = (h1 && h1.textContent || fromMeta && fromMeta.getAttribute('content') || document.title || '').trim();
      return t.replace(/\s+\|\s+tl;dv.*$/i, '').replace(/\s+-\s+tldv.*$/i, '');
    }

    function extractTranscript() {
      const results = [];

      const push = (o) => {
        const text = (o && o.text || '').replace(/\s+/g, ' ').trim();
        if (!text) return;
        results.push({
          timestamp: (o.timestamp || '').trim(),
          speaker: (o.speaker || '').trim(),
          text,
        });
      };

      const tryWordTimings = () => {
        const container = getByXPath('/html/body/div[1]/div/div/div[2]/div[2]/div/div[2]/div[2]')
          || document.querySelector('[data-testid*="transcript" i], [class*="transcript" i], [aria-label*="transcript" i]')
          || document.body;

        const words = [...container.querySelectorAll('[data-time]')]
          .map((el) => ({
            t: Number(el.getAttribute('data-time') || '0'),
            w: (el.textContent || '').replace(/\s+/g, ' ').trim(),
            sp: (el.getAttribute('data-speaker') || '').toLowerCase(),
          }))
          .filter((x) => x.w)
          .sort((a, b) => a.t - b.t);

        if (words.length === 0) return;

        // Attempt to group by speaker if speaker markers exist; otherwise single block
        const hasSpeakerInfo = words.some((x) => x.sp && x.sp !== 'false' && x.sp !== '0' && x.sp !== 'no');
        if (!hasSpeakerInfo) {
          const text = normalizeSpacing(words.map((x) => x.w));
          if (text) results.push({ timestamp: '', speaker: '', text });
          return;
        }

        let currentSpeaker = '';
        let buffer = [];
        const flush = () => {
          const text = normalizeSpacing(buffer);
          if (text) results.push({ timestamp: '', speaker: currentSpeaker, text });
          buffer = [];
        };

        for (const x of words) {
          if (x.sp && x.sp !== 'false' && x.sp !== currentSpeaker) {
            if (buffer.length) flush();
            currentSpeaker = x.sp;
          }
          buffer.push(x.w);
        }
        if (buffer.length) flush();
      };

      const tryDomHeuristics = () => {
        const xpathContainer = getByXPath('/html/body/div[1]/div/div/div[2]/div[2]/div/div[2]/div[2]');
        const containers = [
          xpathContainer,
          document.querySelector('[data-testid*="transcript" i]'),
          document.querySelector('[class*="transcript" i]'),
          document.querySelector('[aria-label*="transcript" i]'),
          document.querySelector('[data-panel*="transcript" i]'),
        ].filter(Boolean);

        const root = containers[0] || document.body;
        const items = root.querySelectorAll('[role="listitem"], [data-testid*="line" i], [class*="transcript"] [class*="item"], li');
        for (const item of items) {
          const tsEl = item.querySelector('time, [data-testid*="time" i], [class*="time" i]');
          let ts = tsEl ? (tsEl.getAttribute('datetime') || tsEl.textContent) : '';
          if (!ts) {
            const m = (item.textContent || '').match(/(\b\d{1,2}:\d{2}(?::\d{2})?\b)/);
            if (m) ts = m[1];
          }
          const speakerEl = item.querySelector('[data-testid*="speaker" i], [class*="speaker" i], header strong, .font-bold, strong, b');
          const textEl = item.querySelector('[data-testid*="text" i], [class*="text" i], [class*="content" i], p, span, div');
          const speaker = speakerEl ? speakerEl.textContent : '';
          let line = '';
          if (textEl) line = textEl.textContent;
          else {
            const clone = item.cloneNode(true);
            for (const s of clone.querySelectorAll('time, [data-testid*="time" i], [class*="time" i], strong, b')) s.remove();
            line = clone.textContent || '';
          }
          push({ timestamp: (ts || '').trim(), speaker: (speaker || '').trim(), text: (line || '').trim() });
        }

        // If we found no structured items but we have a container, fallback to raw text blocks
        if (results.length === 0 && containers[0]) {
          const raw = (containers[0].innerText || '').trim();
          if (raw) {
            const blocks = raw.split(/\n\s*\n+/).map((b) => b.trim()).filter(Boolean);
            for (const b of blocks) {
              const lines = b.split(/\n+/).map((l) => l.trim()).filter(Boolean);
              if (lines.length === 0) continue;
              // Heuristic: short first line is a speaker name
              let speaker = '';
              let textLines = lines;
              if (lines[0].length <= 40 && /[A-Za-z]/.test(lines[0]) && !/[.!?]$/.test(lines[0])) {
                speaker = lines[0];
                textLines = lines.slice(1);
              }
              const text = textLines.join(' ').replace(/\s+/g, ' ').trim();
              if (text) push({ timestamp: '', speaker, text });
            }
          }
        }
      };

      const tryStructuredJson = () => {
        const scripts = document.querySelectorAll('script[type="application/json"], script[type="application/ld+json"]');
        for (const s of scripts) {
          const raw = s.textContent || '';
          if (!/transcript|segments|entries|utterances/i.test(raw)) continue;
          try {
            const data = JSON.parse(raw);
            scanObjectForTranscript(data, push);
          } catch {}
        }
      };

      // Prefer word-timing reconstruction if present
      tryWordTimings();
      if (results.length === 0) tryDomHeuristics();
      if (results.length === 0) tryStructuredJson();

      const unique = [];
      const seen = new Set();
      for (const r of results) {
        const key = `${r.timestamp}|${r.speaker}|${r.text}`;
        if (!seen.has(key)) { seen.add(key); unique.push(r); }
      }
      return unique;
    }

    function getByXPath(xpath) {
      try {
        const r = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        return r.singleNodeValue || null;
      } catch { return null; }
    }

    async function ensureFullTranscriptVisible() {
      const wait = (ms) => new Promise((r) => setTimeout(r, ms));
      const container = document.querySelector('[data-testid*="transcript" i], [class*="transcript" i], [aria-label*="transcript" i]');

      // Click any tabs/buttons that open the transcript
      const openers = document.querySelectorAll('button, a');
      for (const btn of openers) {
        const label = (btn.innerText || btn.ariaLabel || '').trim().toLowerCase();
        if (/transcript/.test(label) && /open|show|view|transcript/.test(label)) {
          try { btn.click(); } catch {}
        }
      }

      // Expand "Show more" repeatedly
      for (let i = 0; i < 12; i++) {
        let clicked = false;
        const expanders = document.querySelectorAll('button, a');
        for (const ex of expanders) {
          const t = (ex.innerText || ex.getAttribute('title') || '').trim();
          if (/^(show more|more|expand|see more)$/i.test(t)) {
            try { ex.click(); clicked = true; } catch {}
          }
        }
        if (!clicked) break;
        await wait(300);
      }

      // Scroll to load lazy items
      const scroller = container || document;
      for (let i = 0; i < 20; i++) {
        try {
          if (scroller === document) window.scrollTo(0, document.documentElement.scrollHeight);
          else scroller.scrollTop = scroller.scrollHeight;
        } catch {}
        await wait(250);
      }
    }

    function scanObjectForTranscript(obj, push) {
      if (!obj || typeof obj !== 'object') return;
      if (Array.isArray(obj)) {
        for (const it of obj) scanObjectForTranscript(it, push);
        return;
      }
      const keys = Object.keys(obj).map((k) => k.toLowerCase());
      const looksLikeEntry = (o) => o && (o.text || o.content || o.utterance) && (o.speaker || o.speakerName || o.name || o.user || o.participant || o.role) !== undefined;
      const toTs = (o) => {
        const cand = o.timestamp || o.startTime || o.start || o.time || '';
        if (typeof cand === 'number') return secToClock(cand);
        if (typeof cand === 'string') {
          const m = cand.match(/\d{1,2}:\d{2}(?::\d{2})?/);
          if (m) return m[0];
        }
        return '';
      };
      const toSpeaker = (o) => o.speaker || o.speakerName || o.name || (o.user && (o.user.name || o.user.displayName)) || o.participant || '';
      const toText = (o) => o.text || o.content || o.utterance || o.caption || '';

      for (const k of keys) {
        const v = obj[k];
        if (Array.isArray(v) && v.length && (k.includes('transcript') || k.includes('segments') || k.includes('entries') || k.includes('utterances'))) {
          for (const it of v) {
            if (looksLikeEntry(it)) {
              push({ timestamp: toTs(it), speaker: toSpeaker(it), text: toText(it) });
            } else if (it && typeof it === 'object') {
              const t = toText(it);
              if (t) push({ timestamp: toTs(it), speaker: toSpeaker(it), text: t });
              else scanObjectForTranscript(it, push);
            }
          }
        } else if (v && typeof v === 'object') {
          scanObjectForTranscript(v, push);
        }
      }
    }

    function normalizeSpacing(tokens) {
      const out = [];
      let prev = '';
      for (const raw of tokens) {
        const tok = raw;
        if (!tok) continue;
        const noSpaceBefore = /^[,.;:!?)]/.test(tok);
        const noSpaceAfterPrev = /[(“"']$/.test(prev);
        const needSpace = out.length > 0 && !noSpaceBefore && !noSpaceAfterPrev;
        out.push(needSpace ? ` ${tok}` : tok);
        prev = tok;
      }
      return out.join('').replace(/\s+\n/g, '\n').trim();
    }

    function secToClock(s) {
      const sec = Math.max(0, Math.floor(Number(s) || 0));
      const h = Math.floor(sec / 3600);
      const m = Math.floor((sec % 3600) / 60);
      const r = sec % 60;
      const pad = (n) => String(n).padStart(2, '0');
      return h > 0 ? `${h}:${pad(m)}:${pad(r)}` : `${m}:${pad(r)}`;
    }
  }
})();


