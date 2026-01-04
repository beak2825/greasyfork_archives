// ==UserScript==
// @name         Jp Manga Translator
// @author       moony
// @license      MIT
// @version      2.6
// @description  Translate manga from Japanese/Chinese to English using Gemini, or optionally with a Python server (YOLO+MangaOCR+mBART+Colorization)/in-browser CTD/Google.
// @namespace    JpMangaTranslator
// @match        *.mangadex.org/*
// @match        *.mangapark.net/*
// @match        *.weebcentral.com/*
// @match        *.mangahere.cc/*
// @match        *.mangafox.fun/*
// @match        *.fanfox.net/*
// @match        *.webtoons.com/*
// @match        *.bato.to.*/*
// @match        *.asuracomic.net/*
// @match        *.tapas.io/*
// @match        *.dynasty-scans.com/*
// @match        *.comic-walker.com/*
// @match        *.pixiv.net/*/artworks/*
// @match        *.8muses.com/*
// @match        *.hentai2read.com/*
// @match        *.e-hentai.org/*
// @match        *.exhentai.*
// @match        *.nhentai.net/*
// @match        *.hitomi.la/*
// @match        *.raw.senmanga.com/*
// @exclude      *.mangaplus.shueisha.co.jp/*
// @exclude      *.battwo.com/*
// @exclude      *.natomanga.com/*
// @exclude      *.mangakakalot.gg/*
// @icon         https://i.imgur.com/9Oym4Cp.png
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @connect      localhost
// @connect      ocrt.iwanhae.kr
// @connect      generativelanguage.googleapis.com
// @connect      translate.googleapis.com
// @connect      api.mymemory.translated.net
// @connect      huggingface.co
// @connect      cdn.jsdelivr.net
// @connect      fonts.googleapis.com
// @connect      fonts.gstatic.com
// @connect      *
// @require      https://cdn.jsdelivr.net/npm/onnxruntime-web@1.19.0/dist/ort.all.min.js
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/552603/Jp%20Manga%20Translator.user.js
// @updateURL https://update.greasyfork.org/scripts/552603/Jp%20Manga%20Translator.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const log = (...a) => console.log('[MT]', ...a);
  const API_BASE = GM_getValue('server_url', 'http://localhost:8000');
  const DETECT_MIN_IMAGE_SIZE = 600;
  const CTD_INPUT_SIZE = 1024, CTD_CONF_THR = 0.25, CTD_IOU_THR = 0.50;
  const OCR_BASE_PADDING = 8, OCR_MAX_BATCH = 24;

  const fontStyle = document.createElement('style');
  fontStyle.textContent = `@import url('https://fonts.googleapis.com/css2?family=Comic+Neue:wght@700&display=swap');`;
  document.head.appendChild(fontStyle);

  const ORT_BASE = 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.19.0/dist/';
  try {
    if (typeof ort !== 'undefined' && ort.env) {
      if (typeof ort.setWasmPaths === 'function') ort.setWasmPaths(ORT_BASE);
      else if (ort.env.wasm) ort.env.wasm.wasmPaths = ORT_BASE;
      if (ort.env.wasm) {
        ort.env.wasm.simd = true;
        ort.env.wasm.numThreads = 1; // Force single thread to avoid issues
      }
      if (ort.env.webgpu) {
        ort.env.webgpu.preferredLayout = 'NCHW';
        ort.env.webgpu.powerPreference = 'high-performance';
      }
    }
  } catch (e) { log('ORT env warn:', e.message); }

  // === FIX: Persistent state across soft navigations ===
  if (!window._MT) window._MT = {
    ctdSession: null, ctdBytes: null,
    dbSession: null, dbBytes: null,
    mangaOCR: null,
    queue: [], processing: false, processed: new Set()
  };
  const MT = window._MT;

  // === FIX: WebGPU-first session creation ===
  async function createSession(bytes, name) {
    if (navigator.gpu) {
      try {
        const adapter = await navigator.gpu.requestAdapter();
        if (adapter) {
          const sess = await ort.InferenceSession.create(bytes, { executionProviders: ['webgpu'], graphOptimizationLevel: 'all' });
          log(`${name}: WebGPU ready`);
          return sess;
        }
      } catch (e) { log(`${name}: WebGPU failed, trying WASM:`, e.message); }
    }
    const sess = await ort.InferenceSession.create(bytes, { executionProviders: ['wasm'], graphOptimizationLevel: 'all' });
    log(`${name}: WASM ready`);
    return sess;
  }

  if (!GM_getValue('_init')) {
    GM_setValue('mode', 'browser');        // Pipeline mode: 'gemini' (API-Key) | 'external' (iwanhae.kr) by Default | 'server' (local) | 'browser' (WebGPU)
    GM_setValue('aio', false);             // All-In-One: single API call for detect+OCR+translate vs modular pipeline
    GM_setValue('colorize', false);        // Server-only: colorize B&W manga
    GM_setValue('detector', 'ctd');        // Bubble detector: 'yolo' (server) | 'ctd' (WebGPU, bubble-focused) | 'db' (WIP text-focused) | 'none'
    GM_setValue('ocr', 'manga2025');       // OCR jp/zh engine: 'server' | 'manga2025' (WebGPU) | 'none'
    GM_setValue('translator', 'google');   // Translator: 'mbart' (server) | 'google' (free API) | 'mymemory' | 'none'
    GM_setValue('target_lang', 'English'); // Gemini-only: target language
    GM_setValue('_init', 1);
  }

  GM_registerMenuCommand('Preset: Gemini API (All-in-One)', async () => {
    let key = GM_getValue('gemini_key');
    if (!key) { key = prompt('Enter GEMINI_API_KEY from https://aistudio.google.com/app/apikey:'); if (key) GM_setValue('gemini_key', key); }
    setPreset('Gemini', { mode: 'gemini', aio: true, detector: 'none', ocr: 'none', translator: 'none', colorize: false });
  });
  GM_registerMenuCommand('Preset: iwanhae.kr (All-in-One, free)', () => setPreset('iwanhae', { mode: 'external', aio: true, detector: 'none', ocr: 'none', translator: 'none', colorize: false }));
  GM_registerMenuCommand('Preset: Server (YOLO+MangaOCR+mBART+Colorize)', () => setPreset('Server', { mode: 'server', aio: false, detector: 'yolo', ocr: 'server', translator: 'mbart', colorize: true }));
  GM_registerMenuCommand('Preset: Browser (CTD+MangaOCR-2025+Google)', () => setPreset('Browser', { mode: 'browser', aio: false, detector: 'ctd', ocr: 'manga2025', translator: 'google', colorize: false }));
  GM_registerMenuCommand('Process visible image', processVisibleImage);
  function setPreset(name, flags) { Object.entries(flags).forEach(([k, v]) => GM_setValue(k, v)); log('✓ Preset:', name); setTimeout(() => location.reload(), 100); }

  function resolveUrl(img) {
    if (!img) return null;
    if (img.toDataURL) return img.toDataURL('image/png');
    let u = img.currentSrc || img.src || img.getAttribute('data-src') || img.getAttribute('data-original');
    if (!u) return null;
    if (u.startsWith('//')) u = location.protocol + u;
    return u;
  }

  function getVisibleMangaImage() {
    let best = null, bestArea = 0;
    for (const el of document.querySelectorAll('img, canvas')) {
      const r = el.getBoundingClientRect();
      if (r.top >= window.innerHeight || r.bottom <= 0) continue;
      const w = el.naturalWidth || el.width, h = el.naturalHeight || el.height;
      if (w < DETECT_MIN_IMAGE_SIZE && h < DETECT_MIN_IMAGE_SIZE) continue;
      const u = resolveUrl(el);
      if (!u || (u.startsWith('data:') && !el.getContext)) continue;
      const area = w * h;
      if (area > bestArea) { best = el; bestArea = area; }
    }
    return best;
  }

  function gmFetch(url, opts = {}) {
    return new Promise((ok, err) => GM_xmlhttpRequest({
      method: opts.method || 'GET', url, headers: opts.headers || {}, data: opts.body,
      responseType: opts.responseType || 'json', timeout: opts.timeout || 120000,
      onload: r => (r.status >= 200 && r.status < 300) ? ok(r.response) : err(new Error(`HTTP ${r.status}`)),
      onerror: () => err(new Error('Network error')), ontimeout: () => err(new Error('Timeout'))
    }));
  }
  function fetchBlob(url) {
    if (url.startsWith('data:')) return fetch(url).then(r => r.blob());
    return new Promise((ok, err) => GM_xmlhttpRequest({
      method: 'GET', url, responseType: 'blob', headers: { 'Referer': window.location.origin }, timeout: 60000,
      onload: r => ok(r.response), onerror: () => err(new Error('Blob error')), ontimeout: () => err(new Error('Blob timeout'))
    }));
  }
  function fetchBase64(url) {
    return new Promise((ok, err) => GM_xmlhttpRequest({
      method: 'GET', url, responseType: 'blob', headers: { 'Referer': window.location.origin }, timeout: 60000,
      onload: r => { const rd = new FileReader(); rd.onloadend = () => ok(rd.result.split(',')[1]); rd.onerror = () => err(new Error('FileReader failed')); rd.readAsDataURL(r.response); },
      onerror: () => err(new Error('Image error')), ontimeout: () => err(new Error('Image timeout'))
    }));
  }

  const bitmapCache = new Map();
  async function getBitmap(url) {
    if (bitmapCache.has(url)) return bitmapCache.get(url);
    const bl = await fetchBlob(url), bm = await createImageBitmap(bl);
    bitmapCache.set(url, bm);
    return bm;
  }

  const iou = (a, b) => {
    const x1 = Math.max(a[0], b[0]), y1 = Math.max(a[1], b[1]);
    const x2 = Math.min(a[2], b[2]), y2 = Math.min(a[3], b[3]);
    const inter = Math.max(0, x2 - x1) * Math.max(0, y2 - y1);
    const A = (a[2] - a[0]) * (a[3] - a[1]), B = (b[2] - b[0]) * (b[3] - b[1]);
    return inter / Math.max(A + B - inter, 1);
  };
  const nms = (boxes, scores, thr) => {
    const idx = boxes.map((_, i) => i).sort((a, b) => scores[b] - scores[a]);
    const kept = [];
    for (const i of idx) { let keep = true; for (const j of kept) if (iou(boxes[i], boxes[j]) > thr) { keep = false; break; } if (keep) kept.push(i); }
    return kept;
  };

  function sortReadingOrder(boxes, rtl = true) {
    const items = boxes.map(b => ({ b, cy: (b[1] + b[3]) / 2, h: (b[3] - b[1]) })).sort((a, b) => a.cy - b.cy);
    const rows = [];
    for (const it of items) {
      const r = rows.find(x => Math.abs(x.cy - it.cy) < Math.min(x.h, it.h) * 0.6);
      if (r) { r.items.push(it); r.cy = (r.cy * r.items.length + it.cy) / (r.items.length + 1); r.h = (r.h + it.h) / 2; }
      else rows.push({ cy: it.cy, h: it.h, items: [it] });
    }
    rows.forEach(r => r.items.sort((a, b) => rtl ? b.b[0] - a.b[0] : a.b[0] - b.b[0]));
    return rows.flatMap(r => r.items.map(i => i.b));
  }

  function findNearbyBoxIndices(boxes) {
    const nearby = new Set();
    for (let i = 0; i < boxes.length; i++) {
      for (let j = i + 1; j < boxes.length; j++) {
        const [x1a, y1a, x2a, y2a] = boxes[i], [x1b, y1b, x2b, y2b] = boxes[j];
        const gapX = Math.max(0, Math.max(x1a, x1b) - Math.min(x2a, x2b));
        const gapY = Math.max(0, Math.max(y1a, y1b) - Math.min(y2a, y2b));
        if (gapX < OCR_BASE_PADDING * 2 && gapY < OCR_BASE_PADDING * 2) { nearby.add(i); nearby.add(j); }
      }
    }
    return nearby;
  }

  async function createCanvasFromBlob(blob, width, height) {
    return new Promise((ok, err) => {
      const url = URL.createObjectURL(blob), img = new Image();
      img.onload = () => { const c = document.createElement('canvas'); c.width = width; c.height = height; c.getContext('2d').drawImage(img, 0, 0); URL.revokeObjectURL(url); ok(c); };
      img.onerror = () => { URL.revokeObjectURL(url); err(new Error('img load')); };
      img.src = url;
    });
  }

  const CJK_RE = /[\u3000-\u303F\u3040-\u30FF\u3400-\u4DBF\u4E00-\u9FFF]/;
  function wrapCJK(ctx, text, maxWidth) { const out = []; let line = ''; for (const ch of text) { const t = line + ch; if (ctx.measureText(t).width > maxWidth && line) { out.push(line); line = ch; } else line = t; } if (line) out.push(line); return out; }
  function wrapLatin(ctx, text, maxWidth) { const words = text.split(/\s+/); const out = []; let line = ''; for (const w of words) { const t = line ? (line + ' ' + w) : w; if (ctx.measureText(t).width > maxWidth && line) { out.push(line); line = w; } else line = t; } if (line) out.push(line); return out; }

  function drawTextOnCanvas(canvas, region) {
    const ctx = canvas.getContext('2d');
    const [x1, y1, x2, y2] = region.box; const rw = Math.max(1, x2 - x1), rh = Math.max(1, y2 - y1);
    const pad = 4; ctx.save(); ctx.fillStyle = '#fff'; ctx.fillRect(x1 - pad, y1 - pad, rw + 2 * pad, rh + 2 * pad);
    const fs = Math.min(28, Math.max(12, Math.floor(rh * 0.35)));
    ctx.font = `bold ${fs}px "Comic Neue","Bangers","Impact","Arial Black",sans-serif`; // Wait for font to load before applying
    ctx.textBaseline = 'middle'; ctx.fillStyle = '#000';
    const text = String(region.text || ''); if (!text.trim()) { ctx.restore(); return; }
    const isCJK = CJK_RE.test(text), tall = rh > rw * 1.25;
    if (isCJK && tall) {
      const chars = [...text]; const maxPerCol = Math.max(1, Math.floor(rh / (fs * 1.1)));
      const cols = Math.ceil(chars.length / maxPerCol); const colW = Math.min(fs * 1.05, rw / cols);
      for (let c = 0; c < cols; c++) { const colX = x2 - (c + 0.5) * colW; for (let i = 0; i < maxPerCol; i++) { const idx = c * maxPerCol + i; if (idx >= chars.length) break; ctx.fillText(chars[idx], colX, y1 + (i + 0.5) * (fs * 1.1)); } }
    } else {
      const lines = (isCJK ? wrapCJK(ctx, text, rw - 12) : wrapLatin(ctx, text, rw - 12));
      ctx.textAlign = 'center'; const lh = fs * 1.2; const total = lines.length * lh; let yy = y1 + (rh - total) / 2 + lh / 2;
      for (const L of lines) { ctx.fillText(L, x1 + rw / 2, Math.round(yy)); yy += lh; }
    }
    ctx.restore();
  }

  function deviceId() {
    let id = GM_getValue('device_id');
    if (!id) {
      id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => ((c === 'x' ? Math.random() * 16 : (Math.random() * 16 & 3) | 8) | 0).toString(16));
      GM_setValue('device_id', id);
    }
    return id;
  }

  async function externalAPI(url, lang = 'English') {
    const blob = await fetchBlob(url);
    const resp = await new Promise((ok, err) => GM_xmlhttpRequest({
      method: 'POST', url: `https://ocrt.iwanhae.kr/ocrv1?lang=${lang}`,
      headers: { 'X-DEVICE-ID': deviceId(), 'X-REFERER': location.hostname, 'X-REFERER-PATH': location.pathname, 'Content-Type': blob.type || 'image/webp' },
      data: blob, timeout: 120000, onload: r => ok(r.responseText || ''), onerror: () => err(new Error('external net')), ontimeout: () => err(new Error('external timeout'))
    }));
    const segments = [];
    for (const line of resp.split(/\r?\n/)) {
      const match = line.match(/^data:\s*(\{.*\})\s*$/); if (!match) continue;
      try { const obj = JSON.parse(match[1]); if (obj?.type === 'segment' && obj.segment?.box_2d) segments.push({ text: obj.segment.text || '', translation: obj.segment.translation || '', box: obj.segment.box_2d }); } catch {}
    }
    return segments;
  }

  async function geminiAPI(url, W, H) {
    const key = GM_getValue('gemini_key'); if (!key) throw new Error('Set Gemini key via preset');
    const targetLang = GM_getValue('target_lang', 'English');
    const b64 = await fetchBase64(url);
    const body = { contents: [{ parts: [ // prompt complexity: percentages > pixel
      { text: `Detect ALL text in manga image (include partial edges). Extract original text and translate to ${targetLang}. Return JSON:
{"regions":[{"text":"original text","translation":"translated text","position":{"x":20.5,"y":30.2,"width":15.3,"height":10.1}}]}
Position values are percentages (0-100).` },
      { inline_data: { mime_type: 'image/jpeg', data: b64 } }
    ]}]};
    const text = await new Promise((ok, err) => GM_xmlhttpRequest({
      method: 'POST',
      url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite-preview-09-2025:generateContent?key=${key}`,
      headers: { 'Content-Type': 'application/json' }, data: JSON.stringify(body), timeout: 60000,
      onload: r => { if (r.status >= 200 && r.status < 300) { try { const j = JSON.parse(r.responseText); ok(j.candidates?.[0]?.content?.parts?.[0]?.text || ''); } catch { err(new Error('Gemini parse')); } } else err(new Error('Gemini HTTP ' + r.status)); },
      onerror: () => err(new Error('Gemini net')), ontimeout: () => err(new Error('Gemini timeout'))
    }));
    const m = text.match(/\{[\s\S]*\}/); if (!m) throw new Error('Gemini JSON missing');
    const res = JSON.parse(m[0]), out = [];
    for (const r of (res?.regions || [])) {
      const p = r.position || { x: 0, y: 0, width: 0, height: 0 };
      const x1 = Math.round(p.x / 100 * W), y1 = Math.round(p.y / 100 * H);
      const x2 = Math.round(x1 + p.width / 100 * W), y2 = Math.round(y1 + p.height / 100 * H);
      out.push({ text: r.text || '', translation: r.translation || '', box: [x1, y1, x2, y2] });
    }
    return out;
  }

  async function serverDetect(url) {
    const b64 = await fetchBase64(url);
    const r = await gmFetch(`${API_BASE}/detect`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ image: b64 }) });
    if (r?.status !== 'ok') throw new Error('detect failed');
    return r.boxes || [];
  }
  async function serverOCR(url, boxes) {
    const b64 = await fetchBase64(url);
    const r = await gmFetch(`${API_BASE}/ocr`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ image: b64, boxes }) });
    if (r?.status !== 'ok') throw new Error('ocr failed');
    return r.texts || [];
  }
  async function serverTranslateMBART(texts) {
    const r = await gmFetch(`${API_BASE}/translate_mbart`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ texts }) });
    if (r?.status !== 'ok') throw new Error('mbart failed');
    return r.translations;
  }

  async function serverColorize(url, sigma = 15) {
    const b64 = await fetchBase64(url);
    const r = await gmFetch(`${API_BASE}/colorize`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ image: b64, denoise_sigma: sigma }), timeout: 180000 });
    if (r?.status !== 'ok') throw new Error('colorize failed');
    return 'data:image/png;base64,' + r.image;
  }

  const CTD_URL = 'https://huggingface.co/mayocream/comic-text-detector-onnx/resolve/main/comic-text-detector.onnx';
  let ctdInputName = 'images';

  // === FIX: Use MT state for CTD session ===
  async function ensureCTD() {
    if (MT.ctdSession) return;
    if (!MT.ctdBytes) {
      log('CTD: downloading...');
      MT.ctdBytes = await gmFetch(CTD_URL, { responseType: 'arraybuffer' });
      log(`CTD: ${(MT.ctdBytes.byteLength / 1e6).toFixed(1)}MB`);
    }
    MT.ctdSession = await createSession(MT.ctdBytes, 'CTD');
    ctdInputName = MT.ctdSession.inputNames?.[0] || 'images';
  }

  function chwFromBitmap(bitmap, size) {
    const c = (typeof OffscreenCanvas !== 'undefined') ? new OffscreenCanvas(size, size) : document.createElement('canvas');
    c.width = size; c.height = size;
    const g = c.getContext('2d'); g.drawImage(bitmap, 0, 0, size, size);
    const d = g.getImageData(0, 0, size, size).data;
    const plane = size * size, out = new Float32Array(3 * plane);
    for (let i = 0; i < plane; i++) { out[i] = d[i * 4] / 255; out[plane + i] = d[i * 4 + 1] / 255; out[2 * plane + i] = d[i * 4 + 2] / 255; }
    return out;
  }

  function decodeCTD(tensor, inSize, natW, natH) {
    const dims = tensor.dims, data = tensor.data;
    const N = dims[1], D = dims[2]; const sx = natW / inSize, sy = natH / inSize;
    let boxes = [], scores = [];
    for (let i = 0; i < N; i++) {
      const off = i * D;
      const cx = data[off], cy = data[off + 1], ww = data[off + 2], hh = data[off + 3];
      const norm = Math.max(cx, cy, ww, hh) <= 1.5;
      const scaleX = norm ? inSize : 1, scaleY = norm ? inSize : 1;
      let obj = 0.5, cls = 1.0;
      if (D >= 5) obj = data[off + 4];
      if (D >= 6) { let mx = -1e9; for (let k = 5; k < D; k++) if (data[off + k] > mx) mx = data[off + k]; cls = mx; }
      const conf = obj * cls; if (conf < CTD_CONF_THR) continue;
      const x = cx * scaleX, y = cy * scaleY, w = ww * scaleX, h = hh * scaleY;
      const x1 = Math.round(Math.max(0, Math.min(inSize, x - w / 2)) * sx);
      const y1 = Math.round(Math.max(0, Math.min(inSize, y - h / 2)) * sy);
      const x2 = Math.round(Math.max(0, Math.min(inSize, x + w / 2)) * sx);
      const y2 = Math.round(Math.max(0, Math.min(inSize, y + h / 2)) * sy);
      if ((x2 - x1) >= 6 && (y2 - y1) >= 6) { boxes.push([x1, y1, x2, y2]); scores.push(conf); }
    }
    if (!boxes.length) return [];
    const keep = nms(boxes, scores, CTD_IOU_THR);
    return keep.map(i => boxes[i]);
  }

  async function detectCTD(url, W, H) {
    await ensureCTD();
    const bm = await getBitmap(url);
    const chw = chwFromBitmap(bm, CTD_INPUT_SIZE);
    const out = await MT.ctdSession.run({ [ctdInputName]: new ort.Tensor('float32', chw, [1, 3, CTD_INPUT_SIZE, CTD_INPUT_SIZE]) });
    const outName = MT.ctdSession.outputNames?.[0] || Object.keys(out)[0];
    const tensor = out[outName];
    return (!tensor || tensor.dims.length !== 3 || tensor.dims[2] < 6) ? [] : decodeCTD(tensor, CTD_INPUT_SIZE, W, H);
  }

  // DB text detector (PP-OCRv3): self-contained with hardcoded thresholds
  const DB_URL = 'https://cdn.jsdelivr.net/npm/paddle-ocr-onnx-models@0.2.0/models/en_PP-OCRv3_det_infer.onnx';
  const DB_SIZE = 640;
  let dbInputName = 'x';

  // === FIX: Use MT state for DB session ===
  async function ensureDB() {
    if (MT.dbSession) return;
    if (!MT.dbBytes) {
      log('DB: downloading...');
      MT.dbBytes = await gmFetch(DB_URL, { responseType: 'arraybuffer' });
    }
    MT.dbSession = await createSession(MT.dbBytes, 'DB');
    dbInputName = MT.dbSession.inputNames?.[0] || 'x';
  }

  function dbPreprocess(bmp) {
    const W = bmp.width, H = bmp.height;
    const scale = Math.min(DB_SIZE / W, DB_SIZE / H);
    const newW = Math.round(W * scale), newH = Math.round(H * scale);
    const padX = Math.floor((DB_SIZE - newW) / 2), padY = Math.floor((DB_SIZE - newH) / 2);
    const oc = (typeof OffscreenCanvas !== 'undefined') ? new OffscreenCanvas(DB_SIZE, DB_SIZE) : document.createElement('canvas');
    oc.width = DB_SIZE; oc.height = DB_SIZE;
    const ctx = oc.getContext('2d');
    ctx.fillStyle = '#000'; ctx.fillRect(0, 0, DB_SIZE, DB_SIZE);
    ctx.drawImage(bmp, 0, 0, W, H, padX, padY, newW, newH);
    const d = ctx.getImageData(0, 0, DB_SIZE, DB_SIZE).data;
    const plane = DB_SIZE * DB_SIZE, chw = new Float32Array(plane * 3);
    for (let i = 0, j = 0; j < plane; j++, i += 4) {
      chw[j] = d[i] / 255; chw[plane + j] = d[i + 1] / 255; chw[2 * plane + j] = d[i + 2] / 255;
    }
    return { tensorData: chw, padX, padY, scale };
  }

  function dbPostprocess(prob, W, H, thr, meanKeep, unclipRatio, nmsIou) {
    const bins = new Uint8Array(W * H);
    for (let i = 0; i < W * H; i++) bins[i] = prob[i] >= thr ? 1 : 0;
    const visited = new Uint8Array(W * H);
    const id = (x, y) => y * W + x;
    const dirs = [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
    const comps = [];
    const qx = new Int32Array(W * H), qy = new Int32Array(W * H);
    const MIN_W = Math.max(6, Math.floor(W * 0.01)), MIN_H = Math.max(6, Math.floor(H * 0.01));

    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const p = id(x, y);
        if (!bins[p] || visited[p]) continue;
        let qh = 0, qt = 0; qx[qt] = x; qy[qt] = y; qt++; visited[p] = 1;
        let minx = x, miny = y, maxx = x, maxy = y, sum = 0, cnt = 0;
        while (qh < qt) {
          const cx = qx[qh], cy = qy[qh]; qh++;
          const ip = id(cx, cy); sum += prob[ip]; cnt++;
          if (cx < minx) minx = cx; if (cy < miny) miny = cy;
          if (cx > maxx) maxx = cx; if (cy > maxy) maxy = cy;
          for (const [dx, dy] of dirs) {
            const nx = cx + dx, ny = cy + dy;
            if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
            const np = id(nx, ny);
            if (!bins[np] || visited[np]) continue;
            visited[np] = 1; qx[qt] = nx; qy[qt] = ny; qt++;
          }
        }
        const mean = sum / Math.max(1, cnt);
        if (mean < meanKeep) continue;
        const bw = maxx - minx + 1, bh = maxy - miny + 1;
        if (bw < MIN_W || bh < MIN_H) continue;
        const cx = minx + bw / 2, cy = miny + bh / 2;
        const sx = bw * unclipRatio, sy = bh * unclipRatio;
        const x1 = Math.max(0, Math.round(cx - sx / 2)), y1 = Math.max(0, Math.round(cy - sy / 2));
        const x2 = Math.min(W, Math.round(cx + sx / 2)), y2 = Math.min(H, Math.round(cy + sy / 2));
        comps.push({ xyxy: [x1, y1, x2, y2], score: mean });
      }
    }
    comps.sort((a, b) => b.score - a.score);
    const kept = [];
    for (const c of comps) {
      let ok = true;
      for (const k of kept) if (iou(c.xyxy, k.xyxy) > nmsIou) { ok = false; break; }
      if (ok) kept.push(c);
    }
    return kept.map(c => c.xyxy);
  }

  function mergeDbBoxes(boxes) {
    if (boxes.length <= 1) return boxes;
    const n = boxes.length, parent = [...Array(n).keys()];
    const find = i => parent[i] === i ? i : (parent[i] = find(parent[i]));
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const [ax1, ay1, ax2, ay2] = boxes[i], [bx1, by1, bx2, by2] = boxes[j];
        const gapX = Math.max(0, Math.max(ax1, bx1) - Math.min(ax2, bx2));
        const gapY = Math.max(0, Math.max(ay1, by1) - Math.min(ay2, by2));
        if (gapX < 10 && gapY < 10) parent[find(i)] = find(j);
      }
    }
    const groups = new Map();
    for (let i = 0; i < n; i++) {
      const r = find(i), b = boxes[i];
      if (!groups.has(r)) groups.set(r, [...b]);
      else { const g = groups.get(r); g[0] = Math.min(g[0], b[0]); g[1] = Math.min(g[1], b[1]); g[2] = Math.max(g[2], b[2]); g[3] = Math.max(g[3], b[3]); }
    }
    return [...groups.values()];
  }

  async function detectDB(url, W, H) {
    await ensureDB();
    const bm = await getBitmap(url);
    const prep = dbPreprocess(bm);
    const feeds = {}; feeds[dbInputName] = new ort.Tensor('float32', prep.tensorData, [1, 3, DB_SIZE, DB_SIZE]);
    const out = await MT.dbSession.run(feeds);
    let outTensor = null;
    for (const k of Object.keys(out)) {
      const t = out[k], d = t.dims || [];
      if ((d.length === 4 && d[0] === 1 && d[1] === 1 && d[2] === DB_SIZE && d[3] === DB_SIZE) ||
          (d.length === 3 && d[0] === 1 && d[1] === DB_SIZE && d[2] === DB_SIZE)) { outTensor = t; break; }
    }
    if (!outTensor) outTensor = out[Object.keys(out)[0]];
    let probData;
    try { probData = await outTensor.getData(true); } catch { probData = outTensor.data; }
    const prob = probData.length === DB_SIZE * DB_SIZE ? probData : probData.slice(0, DB_SIZE * DB_SIZE);
    const boxes640 = dbPostprocess(prob, DB_SIZE, DB_SIZE, 0.30, 0.55, 1.60, 0.2);
    let boxes = boxes640.map(b => {
      const [x1, y1, x2, y2] = b;
      const rx1 = Math.max(0, Math.min(W, Math.round((x1 - prep.padX) / prep.scale)));
      const ry1 = Math.max(0, Math.min(H, Math.round((y1 - prep.padY) / prep.scale)));
      const rx2 = Math.max(0, Math.min(W, Math.round((x2 - prep.padX) / prep.scale)));
      const ry2 = Math.max(0, Math.min(H, Math.round((y2 - prep.padY) / prep.scale)));
      return [rx1, ry1, rx2, ry2];
    });
    return mergeDbBoxes(boxes);
  }

  const MANGA_OCR = {
    encoder: 'https://huggingface.co/l0wgear/manga-ocr-2025-onnx/resolve/main/encoder_model.onnx',
    decoder: 'https://huggingface.co/l0wgear/manga-ocr-2025-onnx/resolve/main/decoder_model.onnx',
    tokenizer: 'https://huggingface.co/l0wgear/manga-ocr-2025-onnx/resolve/main/tokenizer.json'
  };

  class MangaOCRWeb {
    constructor() { this.encoder = null; this.decoder = null; this.vocab = []; this.V = 0; this.maxLen = 50; this.encBytes = null; this.decBytes = null; }
    async init() {
      if (this.encoder && this.decoder) return;
      log('MangaOCR: downloading...');
      const [tok, enc, dec] = await Promise.all([
        this.vocab.length ? Promise.resolve(null) : gmFetch(MANGA_OCR.tokenizer, { responseType: 'json' }),
        this.encBytes || gmFetch(MANGA_OCR.encoder, { responseType: 'arraybuffer' }),
        this.decBytes || gmFetch(MANGA_OCR.decoder, { responseType: 'arraybuffer' })
      ]);
      if (tok) { const arr = Object.entries(tok.model.vocab).sort((a, b) => a[1] - b[1]); this.vocab = arr.map(([t]) => t); this.V = this.vocab.length; }
      if (!this.encBytes) this.encBytes = enc;
      if (!this.decBytes) this.decBytes = dec;
      log(`MangaOCR: vocab=${this.V}, enc=${(this.encBytes.byteLength / 1e6).toFixed(1)}MB, dec=${(this.decBytes.byteLength / 1e6).toFixed(1)}MB`);
      this.encoder = await createSession(this.encBytes, 'OCR-Enc');
      this.decoder = await createSession(this.decBytes, 'OCR-Dec');
    }
    async ensure() { if (!this.encoder || !this.decoder) await this.init(); return this; }

    cropTensor(bm, box, imgW, imgH, useLowPadding = false) {
      const [x1, y1, x2, y2] = box;
      const pad = useLowPadding ? Math.floor(OCR_BASE_PADDING / 2) : OCR_BASE_PADDING;
      const px1 = Math.max(0, x1 - pad), py1 = Math.max(0, y1 - pad);
      const px2 = Math.min(imgW, x2 + pad), py2 = Math.min(imgH, y2 + pad);
      const c = (typeof OffscreenCanvas !== 'undefined') ? new OffscreenCanvas(256, 256) : document.createElement('canvas');
      c.width = 256; c.height = 256;
      const g = c.getContext('2d'); g.drawImage(bm, px1, py1, px2 - px1, py2 - py1, 0, 0, 256, 256);
      const d = g.getImageData(16, 16, 224, 224).data; const N = 224 * 224;
      const R = new Float32Array(N), G = new Float32Array(N), B = new Float32Array(N);
      for (let i = 0, j = 0; i < d.length; i += 4, j++) { R[j] = d[i] / 255 * 2 - 1; G[j] = d[i + 1] / 255 * 2 - 1; B[j] = d[i + 2] / 255 * 2 - 1; }
      return { R, G, B };
    }

    // === FIX: Process one box at a time to avoid session conflicts ===
    async ocrOneBox(bm, box, imgW, imgH, useLowPadding) {
      const { R, G, B } = this.cropTensor(bm, box, imgW, imgH, useLowPadding);
      const plane = 224 * 224, batch = new Float32Array(3 * plane);
      batch.set(R, 0); batch.set(G, plane); batch.set(B, 2 * plane);
      const encOut = await this.encoder.run({ pixel_values: new ort.Tensor('float32', batch, [1, 3, 224, 224]) });
      const hs = encOut.last_hidden_state, seq = hs.dims[1], hid = hs.dims[2];
      const hsTensor = new ort.Tensor('float32', hs.data, [1, seq, hid]);
      const ids = [2n];
      for (let step = 0; step < this.maxLen; step++) {
        const decOut = await this.decoder.run({ input_ids: new ort.Tensor('int64', new BigInt64Array(ids), [1, ids.length]), encoder_hidden_states: hsTensor });
        const logits = decOut.logits.data, off = (ids.length - 1) * this.V;
        let mx = -1e9, idx = 0; for (let j = 0; j < this.V; j++) if (logits[off + j] > mx) { mx = logits[off + j]; idx = j; }
        if (idx === 3) break;
        ids.push(BigInt(idx));
      }
      return ids.slice(1).filter(n => n > 14n).map(i => this.vocab[Number(i)]).join('');
    }

    async ocrBatchWithBitmap(bm, imgW, imgH, boxes) {
      const out = [], nearbyIndices = findNearbyBoxIndices(boxes);
      for (let i = 0; i < boxes.length; i++) {
        out.push(await this.ocrOneBox(bm, boxes[i], imgW, imgH, nearbyIndices.has(i)));
      }
      return out;
    }
  }

  // === FIX: Use MT state for MangaOCR ===
  async function ensureMangaOCR() {
    if (!MT.mangaOCR) MT.mangaOCR = new MangaOCRWeb();
    await MT.mangaOCR.ensure();
    return MT.mangaOCR;
  }

  function deduplicateTexts(texts, boxes) {
    const seen = new Map(), result = [];
    for (let i = 0; i < texts.length; i++) {
      const text = texts[i], box = boxes[i];
      if (seen.has(text) && text.trim()) {
        const prevIdx = seen.get(text);
        if (iou(box, boxes[prevIdx]) > 0.3) { result.push(''); continue; }
      }
      seen.set(text, i); result.push(text);
    }
    return result;
  }

  function isJapanese(text) { return CJK_RE.test(text); } // Filter out Japanese text (translation failed)

  async function translateGoogle(texts) {
    if (!texts.length) return [];
    const SEP = '\u241E', esc = s => s.replaceAll(SEP, ' ');
    const indices = [], nonEmpty = [];
    for (let i = 0; i < texts.length; i++) if (texts[i].trim()) { indices.push(i); nonEmpty.push(texts[i]); }
    if (!nonEmpty.length) return new Array(texts.length).fill('');
    const q = nonEmpty.map(esc).join(SEP);
    const p = new URLSearchParams({ client: 'gtx', sl: 'auto', tl: 'en', dt: 't', q });
    const r = await gmFetch(`https://translate.googleapis.com/translate_a/single?${p}`, { timeout: 15000, responseType: 'json' });
    let out = '';
    if (Array.isArray(r?.[0])) for (const seg of r[0]) if (seg?.[0]) out += seg[0];
    const translated = out.split(SEP);
    const result = new Array(texts.length).fill('');
    const minLen = Math.min(indices.length, translated.length); // mapping: handle separator split mismatches
    for (let i = 0; i < minLen; i++) {
      const tr = translated[i] || ''; // Only use translation if it's not empty and not still Japanese
      result[indices[i]] = (tr.trim() && !isJapanese(tr)) ? tr : '';
    }
    return result;
  }

  async function translateMyMemory(texts) {
    if (!texts.length) return [];
    const url = 'https://api.mymemory.translated.net/get';
    const params = new URLSearchParams({ q: texts.join('\n'), langpair: 'ja|en', de: 'manga@translator.com' });
    try {
      const r = await gmFetch(`${url}?${params}`, { timeout: 15000, responseType: 'json' });
      if (r?.responseStatus === 200) {
        const translated = r.responseData?.translatedText || '';
        if (!translated || translated.includes('MetaMask')) return translateGoogle(texts);
        const arr = translated.split('\n'); while (arr.length < texts.length) arr.push('');
        return arr.slice(0, texts.length);
      }
      return translateGoogle(texts);
    } catch { return translateGoogle(texts); }
  }

  async function getSegmentsFromAIO(url, W, H) {
    const mode = GM_getValue('mode'), override = GM_getValue('translator', 'none');
    let segs = (mode === 'gemini') ? await geminiAPI(url, W, H) : await externalAPI(url);
    if (override !== 'none') {
      const src = segs.map(s => s.text || '');
      const tr = override === 'mbart' ? await serverTranslateMBART(src)
        : override === 'google' ? await translateGoogle(src)
        : override === 'mymemory' ? await translateMyMemory(src) : src;
      segs = segs.map((s, i) => ({ ...s, translation: tr[i] || s.translation || '' }));
    }
    return segs;
  }

  async function detectBoxes(url, W, H) {
    const d = GM_getValue('detector'); let raw = [];
    if (d === 'yolo') raw = await serverDetect(url);
    else if (d === 'ctd') raw = await detectCTD(url, W, H);
    else if (d === 'db') raw = await detectDB(url, W, H);
    return sortReadingOrder(raw, true);
  }

  async function ocrTexts(url, W, H, boxes) {
    const o = GM_getValue('ocr');
    if (o === 'server') return await serverOCR(url, boxes);
    if (o === 'manga2025') {
      const m = await ensureMangaOCR(), bm = await getBitmap(url);
      const rawTexts = await m.ocrBatchWithBitmap(bm, W, H, boxes);
      return deduplicateTexts(rawTexts, boxes);
    }
    return [];
  }

  async function translateTexts(texts) {
    const t = GM_getValue('translator');
    if (t === 'mbart') return await serverTranslateMBART(texts);
    if (t === 'google') return await translateGoogle(texts);
    if (t === 'mymemory') return await translateMyMemory(texts);
    return texts;
  }

  // === FIX: Main processing function with queue support ===
  async function run(img) {
    const startUrl = resolveUrl(img);
    if (!startUrl) { log('No valid image URL'); return; }
    if (startUrl.startsWith('data:') && !img.getContext) return;
    if (MT.processed.has(startUrl)) return;

    MT.processed.add(startUrl);
    const t0 = performance.now();

    if (!img.getContext && (!img.complete || !img.naturalWidth)) {
      img.addEventListener('load', () => queueImage(img), { once: true });
      MT.processed.delete(startUrl);
      return;
    }

    const W = img.naturalWidth || img.width, H = img.naturalHeight || img.height;
    log(`Processing ${W}x${H}...`);

    try {
      let base = await fetchBlob(startUrl);
      if (GM_getValue('mode') === 'server' && GM_getValue('colorize', true)) {
        try { const b64 = await serverColorize(startUrl); base = await fetch(b64).then(r => r.blob()); }
        catch (e) { log('⚠️ Colorize:', e.message || e); }
      }
      const canvas = await createCanvasFromBlob(base, W, H);

      if (GM_getValue('aio', true)) {
        const segs = await getSegmentsFromAIO(startUrl, W, H);
        for (const s of segs) {
          const text = s.translation || s.text || '';
          if (text.trim() && !isJapanese(text)) drawTextOnCanvas(canvas, { box: s.box, text });
        }
      } else {
        const boxes = await detectBoxes(startUrl, W, H);
        log(`Found ${boxes.length} boxes`);
        if (boxes.length) {
          await getBitmap(startUrl);
          const texts = await ocrTexts(startUrl, W, H, boxes);
          log(`OCR: ${texts.filter(t => t).length} texts`);
          const trans = await translateTexts(texts);
          log(`Translated: ${trans.filter(t => t).length}`);
          const items = boxes.map((box, i) => ({ box, text: trans[i] || '', area: (box[2] - box[0]) * (box[3] - box[1]) }));
          items.sort((a, b) => b.area - a.area);
          for (const it of items) {
            if (it.text.trim() && !isJapanese(it.text)) drawTextOnCanvas(canvas, { box: it.box, text: it.text });
          }
        }
      }

      const currentUrl = resolveUrl(img);
      if (currentUrl !== startUrl) { log('Image changed, discarding'); bitmapCache.delete(startUrl); return; }

      if (img.getContext) {
        const x = img.getContext('2d'); img.width = W; img.height = H;
        x.clearRect(0, 0, W, H); x.drawImage(canvas, 0, 0);
      } else { img.src = canvas.toDataURL('image/png'); }

      bitmapCache.delete(startUrl);
      log(`✓ Done in ${((performance.now() - t0) / 1000).toFixed(2)}s`);
    } catch (e) {
      log('ERR:', e.message || e);
      MT.processed.delete(startUrl); // Allow retry on error
    }
  }

  // === FIX: Queue processor - one image at a time ===
  async function processQueue() {
    if (MT.processing || !MT.queue.length) return;
    MT.processing = true;
    while (MT.queue.length) {
      const img = MT.queue.shift();
      if (img.isConnected) await run(img);
    }
    MT.processing = false;
  }

  function queueImage(img) {
    const url = resolveUrl(img);
    if (!url || url.startsWith('data:') || MT.processed.has(url)) return;
    if (!MT.queue.includes(img)) MT.queue.push(img);
    processQueue();
  }

  function processVisibleImage() {
    const img = getVisibleMangaImage();
    if (!img) return;
    queueImage(img);
  }

  let autoTimer = null;

  function tryAutoProcess() {
    const img = getVisibleMangaImage();
    if (!img) return;
    const notReady = !img.getContext && (!img.complete || !img.naturalWidth);
    if (notReady) { img.addEventListener('load', () => tryAutoProcess(), { once: true }); return; }
    queueImage(img);
  }

  const observer = new MutationObserver(() => {
    if (autoTimer) return;
    autoTimer = setTimeout(() => { autoTimer = null; tryAutoProcess(); }, 150);
  });

  setTimeout(() => {
    ensureCTD().catch(() => {});
    ensureMangaOCR().catch(() => {});
    const container = document.querySelector('.reader-images, .comic-container, .chapter-content, main, article, #content, #viewer') || document.body;
    observer.observe(container, { childList: true, subtree: true, attributes: true, attributeFilter: ['src', 'data-src'] });
    tryAutoProcess();
    log('Auto-watch active');
  }, 500);
})();