// ==UserScript==
// @name         FlorIA - Plant Identifier
// @namespace    https://greasyfork.org/en/users/1518176-math56
// @version      1.1
// @description  Street View plant ID with PlantNet: paste/drag image, top results + iNat/GBIF/POWO/Wiki links, history gallery, auto-open, local iNat check, and full settings (language, organ, thresholds, iNat radius, privacy, enhance, debug). Requires a PlantNet API key.
// @author       Math56 + AI (Perplexity/Codex)
// @icon         https://static.wixstatic.com/media/774bbe_f3ddb022c16c4884948409a3a56a590e~mv2.png
// @include      *://maps.google.com/*
// @include      *://*.google.*/maps/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      my-api.plantnet.org
// @connect      api.inaturalist.org
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550383/FlorIA%20-%20Plant%20Identifier.user.js
// @updateURL https://update.greasyfork.org/scripts/550383/FlorIA%20-%20Plant%20Identifier.meta.js
// ==/UserScript==


(function () {
'use strict';

/* =============================
   CONFIG
   ============================= */
const PLANTNET_API_KEY = "PASTE_YOUR_KEY_HERE"

/*
   🔑 How to get your PlantNet API key:

   1. Create an account at https://my.plantnet.org/ if you don't have one yet.
   2. Open your account/API page and copy your API key.
   3. Paste it between the quotes above, replacing "".

   ⚠️ Notes:
   - Keep your API key private, never publish it.
   - Free plans include a limited number of identifications per month.
   - If you leave the key empty, the script will show a popup reminding you to add it.
*/

const ENDPOINT = 'https://my-api.plantnet.org/v2/identify/all';
const ICON_URL = 'https://static.wixstatic.com/media/774bbe_f3ddb022c16c4884948409a3a56a590e~mv2.png';

/* =============================
   SETTINGS (condensed storage)
   ============================= */
const ST = {
  language:        ['en',          'plantnet_language'],     // "en" | "fr" | "en,fr"
  nameFormat:      ['both',        'floria_nameFormat'],    // 'scientific' | 'common' | 'both'
  organ:           ['leaf',        'plantnet_organ'],        // PlantNet organ: leaf | flower | fruit | bark | habit
  noReject:        [true,          'plantnet_noReject'],     // PlantNet no-reject
  includeRelatedImages: [false,    'plantnet_includeRelatedImages'], // PlantNet include-related-images
  topResults:      ['5',           'plantnet_topResults'],   // '3' | '5' | '10' | 'all'
  minScore:        [2,             'plantnet_minScore'],     // % (filter low-confidence results)
  minConf:         [20,            'floria_minConf'],      // %
  autoOpen:        [0,             'floria_autoOpen'],     // 0 disables
  inatRadiusKm:    [10,            'floria_inatRadiusKm'], // km
  inatMapTab:      [true,          'floria_inatMapTab'],   // open iNat map tab by default
  privacyNoCoords: [false,         'plantnet_privacyNoCoords'],
  debug:           [false,         'plantnet_debug'],       // log debug info
  dynamicGap:      [10,            'floria_dynamicGap'],   // %
  highCertain:     [80,            'floria_highCertain'],  // %
  enhanceLocal:    [true,          'floria_enhanceLocal'], // mild sharpen
  history:         ['[]',          'floria_history']       // array, capped 50
};
const get = k => {
  const [d, key] = ST[k]; const v = GM_getValue(key, null);
  if (v === null) return d;
  if (typeof d === 'number') return +v;
  if (typeof d === 'boolean') return !!v;
  return v;
};
const set = (k, v) => GM_setValue(ST[k][1], typeof ST[k][0] === 'boolean' ? !!v : v);
const getHistory = () => {
  try { return JSON.parse(GM_getValue(ST.history[1], '[]')) || []; } catch { return []; }
};
const saveHistory = arr => GM_setValue(ST.history[1], JSON.stringify(arr.slice(0, 50)));

/* =============================
   SMALL HELPERS
   ============================= */
const el = (tag, attrs = {}, ...kids) => {
  const e = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => (k in e ? e[k] = v : e.setAttribute(k, v)));
  for (const k of kids) e.appendChild(typeof k === 'string' ? document.createTextNode(k) : k);
  return e;
};
const css = (e, o) => Object.assign(e.style, o);
const $ = sel => document.querySelector(sel);
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function retryFetch(url, opts = {}, retries = 2, backoffMs = 500) {
  let lastErr;
  for (let i = 0; i <= retries; i++) {
    try {
      const res = await fetch(url, opts);
      if (!res.ok && (res.status === 429 || res.status >= 500)) {
        throw new Error(`HTTP ${res.status}`);
      }
      return res;
    } catch (err) {
      lastErr = err;
      if (i === retries) throw lastErr;
      await sleep(backoffMs * (i + 1));
    }
  }
  throw lastErr;
}

async function gmRequestWithRetry(options, retries = 2, backoffMs = 500) {
  let lastErr;
  for (let i = 0; i <= retries; i++) {
    try {
      const resp = await new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
          ...options,
          onload: r => resolve({
            ok: r.status >= 200 && r.status < 300,
            status: r.status,
            responseText: r.responseText,
            response: r.response
          }),
          onerror: err => {
            const e = new Error('Network error');
            e.details = { url: options.url, error: err };
            reject(e);
          }
        });
      });
      if (!resp.ok && (resp.status === 429 || resp.status >= 500) && i < retries) {
        await sleep(backoffMs * (i + 1));
        continue;
      }
      return resp;
    } catch (err) {
      lastErr = err;
      if (i === retries) throw lastErr;
      await sleep(backoffMs * (i + 1));
    }
  }
  throw lastErr;
}

function getFallbackTerms(primaryTerm, secondaryTerm) {
  const terms = [];
  const pushUnique = term => {
    const t = (term || '').trim();
    if (!t || terms.includes(t)) return;
    terms.push(t);
  };
  const addShortened = term => {
    const words = (term || '').trim().split(/\s+/).filter(Boolean);
    for (let i = words.length - 1; i > 0 && terms.length < 4; i--) {
      pushUnique(words.slice(0, i).join(' '));
    }
  };

  pushUnique(primaryTerm);
  if (secondaryTerm && secondaryTerm.trim() !== (primaryTerm || '').trim()) {
    pushUnique(secondaryTerm);
  }
  addShortened(secondaryTerm);
  if (terms.length < 4) addShortened(primaryTerm);

  return terms.slice(0, 4);
}

function extractLatLng() {
  const m = location.href.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  return m ? { lat: +m[1], lng: +m[2] } : null;
}
function formatNetworkError(err) {
  if (!err) return 'Unknown error';
  const status = err?.details?.status;
  const statusText = err?.details?.statusText;
  const base = err.message || String(err);
  if (status) return `${base} (${status}${statusText ? ` ${statusText}` : ''})`;
  return base;
}
async function toDataURLFromBlobOrFile(file) {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(fr.result);
    fr.onerror = reject;
    fr.readAsDataURL(file);
  });
}
// PlantNet expects a binary file; convert base64 data URLs to a Blob.
async function dataURLtoBlob(dataUrl) {
  return new Promise(resolve => {
    fetch(dataUrl)
      .then(res => res.blob())
      .then(blob => resolve(blob));
  });
}
async function makeThumb(dataUrl, maxW = 320) {
  return new Promise(res => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxW / img.width);
      const w = Math.round(img.width * scale), h = Math.round(img.height * scale);
      const c = document.createElement('canvas'); c.width = w; c.height = h;
      c.getContext('2d').drawImage(img, 0, 0, w, h);
      res(c.toDataURL('image/jpeg', 0.85));
    };
    img.crossOrigin = 'anonymous';
    img.src = dataUrl;
  });
}
// mild local contrast/saturation + sharpen
async function enhanceDataUrl(dataUrl) {
  if (!get('enhanceLocal')) return dataUrl;
  return new Promise(res => {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
      const ctx = c.getContext('2d');
      const t = document.createElement('canvas'); t.width = img.width; t.height = img.height;
      const tx = t.getContext('2d'); tx.filter = 'contrast(110%) saturate(110%)'; tx.drawImage(img, 0, 0);
      ctx.drawImage(t, 0, 0);
      const id = ctx.getImageData(0, 0, c.width, c.height), out = ctx.createImageData(c.width, c.height);
      const k = [0,-1,0,-1,5,-1,0,-1,0], src = id.data, dst = out.data, w = id.width, h = id.height;
      for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) {
        for (let ch = 0; ch < 3; ch++) {
          let sum = 0, idx = 0;
          for (let ky = -1; ky <= 1; ky++) for (let kx = -1; kx <= 1; kx++)
            sum += src[((y + ky) * w + (x + kx)) * 4 + ch] * k[idx++];
          dst[(y * w + x) * 4 + ch] = Math.max(0, Math.min(255, sum));
        }
        dst[(y * w + x) * 4 + 3] = src[(y * w + x) * 4 + 3];
      }
      ctx.putImageData(out, 0, 0);
      res(c.toDataURL('image/jpeg', 0.9));
    };
    img.crossOrigin = 'anonymous';
    img.src = dataUrl;
  });
}

/* =============================
   PLANTNET & iNAT
   ============================= */
function buildResultLinks(result) {
  const sci = result?.sci || '';
  const sciEncoded = encodeURIComponent(sci);
  const wikiTitle = encodeURIComponent(sci.replace(/ /g, '_'));
  const lang = (get('language') || 'en').split(',')[0].trim() || 'en';
  const mapTab = get('inatMapTab') ? '#map-tab' : '';
  const wikiFallback = `https://${lang}.wikipedia.org/wiki/${wikiTitle}`;
  const wikiEn = `https://en.wikipedia.org/wiki/${wikiTitle}`;
  const gbifId = result?.gbif != null ? String(result.gbif) : null;
  const powoId = result?.powo != null ? String(result.powo) : null;
  const inatId = result?.inatId ?? result?.inat ?? result?.inat_id ?? null;
  const inatUrl = result?.inatUrl || null;
  const inatSlug = encodeURIComponent(sci.replace(/ /g, '_'));
  return {
    gbif: gbifId ? `https://www.gbif.org/species/${encodeURIComponent(gbifId)}` : null,
    inat: inatUrl || (inatId
      ? `https://www.inaturalist.org/taxa/${encodeURIComponent(String(inatId))}-${inatSlug}${mapTab}`
      : `https://www.inaturalist.org/taxa/search?q=${sciEncoded}`),
    powo: powoId
      ? `https://powo.science.kew.org/taxon/${encodeURIComponent(powoId)}`
      : `https://powo.science.kew.org/results?q=${sciEncoded}`,
    tela: `https://www.tela-botanica.org/?post_type=taxon&tb_nom=${sciEncoded}`,
    wiki: result?.inatWikipedia || wikiFallback || wikiEn
  };
}
async function identifyPlant(dataUrl) {
  if (!ensureApiKey()) return;
  const langPref = (get('language') || 'en').split(',')[0].trim() || 'en';

  const noReject = get('noReject') ? 'true' : 'false';
  const includeRelatedImages = get('includeRelatedImages') ? 'true' : 'false';

  // PlantNet uses multipart/form-data + api-key query param (Plant.id used JSON + header).
  const url = `${ENDPOINT}?api-key=${encodeURIComponent(PLANTNET_API_KEY)}&lang=${encodeURIComponent(langPref)}&no-reject=${encodeURIComponent(noReject)}&include-related-images=${encodeURIComponent(includeRelatedImages)}`;
  // Convert dataUrl to Blob
  const blob = await dataURLtoBlob(dataUrl);

  // Create FormData
  const formData = new FormData();
  formData.append('images', blob, 'image.jpg');
  // PlantNet expects an array; repeating the same key builds that array.
  formData.append('organs', get('organ') || 'leaf');

  if (get('debug')) {
    console.log('PlantNet request:', {
      url: url.replace(PLANTNET_API_KEY, '[HIDDEN]'),
      organ: get('organ') || 'leaf',
      noReject,
      includeRelatedImages
    });
  }

  // Request (use GM_xmlhttpRequest to bypass userscript CORS)
  const response = await gmRequestWithRetry({
    method: 'POST',
    url,
    data: formData,
    headers: {}
  });

  if (get('debug')) {
    console.log('DEBUG: response keys:', Object.keys(response || {}));
    console.log('DEBUG: responseText length:', response?.responseText?.length ?? 0);
  }

  if (!response.ok) {
    const text = response.responseText || '';
    if (get('debug') && text) console.error('PlantNet error response:', text);
    const e = new Error(`HTTP ${response.status}${text ? `: ${text}` : ''}`);
    e.details = { status: response.status, url, responseText: text };
    throw e;
  }

  let r = null;
  try {
    r = JSON.parse(response.responseText || '{}');
  } catch {
    r = null;
  }
  const statusEl = document.getElementById('floria-status');
  const s = Array.isArray(r?.results) ? r.results : [];
  if (get('debug')) {
    const sample = s.slice(0, 3).map(v =>
      v?.species?.scientificName || v?.species?.scientificNameWithoutAuthor || 'Unknown'
    );
    console.log('PlantNet response summary:', {
      results: s.length,
      bestMatch: r?.bestMatch || '',
      sample,
      resultsExists: !!r?.results,
      resultsLength: Array.isArray(r?.results) ? r.results.length : 'not array',
      resultsIsArray: Array.isArray(r?.results)
    });
  }
  if (!s.length) {
    if (statusEl) statusEl.textContent = 'No species found.';
    return [];
  }

  const topResults = get('topResults') || '5';
  const maxResults = topResults === 'all' ? null : parseInt(topResults, 10);
  const useLimit = Number.isFinite(maxResults) && maxResults > 0;
  const minScore = Math.max(0, Number(get('minScore')) || 0);
  const limited = useLimit ? s.slice(0, maxResults) : s;

  const results = limited.map(v => {
    const species = v.species || {};
    const commonNames = species.commonNames;
    let commonName = '';
    if (Array.isArray(commonNames)) {
      const langHit = commonNames.find(n => n && typeof n === 'object' && (n.lang === langPref || n.language === langPref));
      if (langHit) commonName = langHit.name || langHit.commonName || '';
      if (!commonName) {
        const stringHit = commonNames.find(n => typeof n === 'string' && n.trim());
        if (stringHit) commonName = stringHit;
      }
      if (!commonName) {
        const objHit = commonNames.find(n => n && typeof n === 'object' && (n.name || n.commonName));
        if (objHit) commonName = objHit.name || objHit.commonName || '';
      }
    } else if (commonNames && typeof commonNames === 'object') {
      const langList = commonNames[langPref];
      if (Array.isArray(langList) && langList.length) commonName = langList[0];
      if (!commonName) {
        const any = Object.values(commonNames).find(v => Array.isArray(v) && v.length);
        if (any) commonName = any[0];
      }
    } else if (typeof commonNames === 'string') {
      commonName = commonNames;
    }
    if (!commonName) commonName = species.commonName || species.common_name || '';
    return {
      sci: species.scientificName || species.scientificNameWithoutAuthor || 'Unknown',
      prob: Math.round((v.score || 0) * 100),
      com: commonName,
      gbif: v.gbif && v.gbif.id != null ? v.gbif.id : null,
      powo: v.powo && v.powo.id != null ? v.powo.id : null,
      inatId: null,
      inatUrl: null,
      inatWikipedia: null,
      inatMatch: null,
      inat: null
    };
  }).filter(r => r.prob >= minScore);
  if (!results.length) {
    if (statusEl) statusEl.textContent = 'No species above confidence threshold.';
    return [];
  }

  const topSetting = get('topResults') || '5';
  let maxLookups = topSetting === 'all' ? 10 : parseInt(topSetting, 10);
  if (!Number.isFinite(maxLookups) || maxLookups <= 0) maxLookups = 5;
  const topResultsToLookup = results.slice(0, maxLookups);

  const inatPromises = topResultsToLookup.map(async (result, index) => {
    const primaryTerm = (result.com || result.common || result.commonName || '').trim();
    const scientificTerm = (result.scientificName || result.sci || '').trim();
    const searchTerm = primaryTerm || scientificTerm || '';
    const terms = getFallbackTerms(searchTerm, scientificTerm);
    let bestMatch = null;
    let usedTerm = searchTerm;
    try {
      for (let i = 0; i < terms.length; i++) {
        const term = terms[i];
        const res = await retryFetch(
          `https://api.inaturalist.org/v1/taxa/autocomplete?q=${encodeURIComponent(term)}&per_page=1`
        );
        const data = await res.json();
        const total = Number(data?.total_results ?? 0);
        if (get('debug')) {
          console.log(`iNat #${index} try ${i + 1}: "${term}" -> ${total}`);
        }
        if (total > 0) {
          bestMatch = Array.isArray(data?.results) ? data.results[0] : null;
          if (bestMatch) {
            bestMatch.usedTerm = term;
            usedTerm = term;
            if (get('debug')) {
              const wiki = bestMatch.wikipedia_url ? ` + Wikipedia: ${bestMatch.wikipedia_url}` : '';
              console.log(`iNat #${index} match: ID ${bestMatch.id} (${bestMatch.name})${wiki}`);
            }
          }
          break;
        }
      }
      return { index, match: bestMatch, searchTerm: usedTerm };
    } catch (e) {
      if (get('debug')) console.warn(`iNat lookup #${index} failed:`, searchTerm, e);
      return { index, match: null, searchTerm };
    }
  });

  const inatResponses = await Promise.all(inatPromises);
  if (get('debug')) {
    const sample = inatResponses
      .filter(r => r.match)
      .slice(0, 5)
      .map(r => ({ index: r.index, id: r.match?.id, name: r.match?.name, q: r.searchTerm }));
    console.log('iNat autocomplete:', { count: inatResponses.length, sample });
  }

  inatResponses.forEach(({ index, match, searchTerm }) => {
    if (index >= results.length) return;
    results[index].inatMatch = searchTerm || null;
    if (!match) return;
    results[index].inatId = match.id;
    results[index].inatWikipedia = match.wikipedia_url || null;
    const mapTab = get('inatMapTab') ? '#map-tab' : '';
    results[index].inatUrl = `https://www.inaturalist.org/taxa/${match.id}-${encodeURIComponent(match.name.replace(/ /g, '_'))}${mapTab}`;
    results[index].inat = match.id;
  });
  if (get('debug')) console.log('FlorIA mapped results:', results);
  if (statusEl) statusEl.textContent = 'Done.';
  return results;
}
async function inatLocalCount(id) {
  try {
    if (!id || get('privacyNoCoords')) return 0;
    const c = extractLatLng(); if (!c) return 0;
    const r = get('inatRadiusKm');
    const u = `https://api.inaturalist.org/v1/observations?taxon_id=${id}&lat=${c.lat}&lng=${c.lng}&radius=${r}&per_page=1&verifiable=true`;
    const j = await fetch(u).then(x => x.json());
    return j?.total_results ?? 0;
  } catch { return 0; }
}

function ensureApiKey() {
  if (!PLANTNET_API_KEY || PLANTNET_API_KEY === "PASTE_YOUR_KEY_HERE") {
    // Popup propre (ou alert minimaliste si tu veux + court)
    const wrap = document.createElement('div');
    wrap.style.cssText = `
      position:fixed;inset:0;z-index:20000;background:rgba(0,0,0,.45);
      display:flex;align-items:center;justify-content:center;
    `;
    const card = document.createElement('div');
    card.style.cssText = `
      width:420px;background:#fff;border-radius:12px;padding:16px;
      box-shadow:0 20px 50px rgba(0,0,0,.35);font:14px/1.4 system-ui;
    `;
    card.innerHTML = `
      <div style="font-weight:700;font-size:16px;margin-bottom:8px;">PlantNet API key required</div>
      <div style="color:#334155;margin-bottom:12px;">
        This userscript needs a PlantNet API key.
        <ol style="margin:6px 0 10px 20px;padding:0;font-size:13px;">
          <li>Create an account at <a href="https://my.plantnet.org/" target="_blank">my.plantnet.org</a></li>
          <li>Open your account/API page and copy your key</li>
          <li>Paste it into <code>PLANTNET_API_KEY</code>.</li>
        </ol>
      </div>
      <div style="display:flex;justify-content:flex-end;gap:8px;">
        <a href="https://my.plantnet.org/" target="_blank"
           style="padding:8px 12px;background:#0ea5e9;color:#fff;text-decoration:none;border-radius:8px;">
          Get API key
        </a>
        <button id="floria-key-close" style="padding:8px 12px;background:#0f172a;color:#fff;border:none;border-radius:8px;cursor:pointer;">
          OK
        </button>
      </div>
    `;
    wrap.appendChild(card);
    document.body.appendChild(wrap);
    wrap.querySelector('#floria-key-close').addEventListener('click', () => document.body.removeChild(wrap));
    return false;
  }
  return true;
}

/* =============================
   UI  (with logo + styles)
   ============================= */
function createUI() {
  if (document.getElementById('floria-toggle')) return;

  // Floating button with logo
  const toggle = el('button', { id: 'floria-toggle', title: 'Open FlorIA' },
    el('img', { src: ICON_URL, alt: 'FlorIA', width: 22, height: 22 })
  );
  css(toggle, {
    position: 'fixed', right: '16px', bottom: '16px', zIndex: 10000,
    background: '#0f172a', color: '#fff', border: 'none', borderRadius: '999px',
    padding: '8px 10px', display: 'flex', alignItems: 'center', gap: '8px',
    boxShadow: '0 10px 30px rgba(0,0,0,.25)', cursor: 'pointer'
  });
  document.body.appendChild(toggle);

  // Panel
  const panel = el('div', { id: 'floria-panel' });
  css(panel, {
    position: 'fixed', right: '16px', bottom: '64px', zIndex: 10000,
    width: '440px', background: '#f7fff7', border: '1px solid #cfe3cf',
    borderRadius: '12px', padding: '12px',
    boxShadow: '0 20px 40px rgba(0,0,0,.3)', display: 'none',
    font: '13px/1.4 system-ui, -apple-system, Segoe UI, Roboto, sans-serif'
  });

  // Header with logo + title + settings
  const header = el('div', { className: 'floria-head' },
    el('div', { className: 'left' },
      el('img', { src: ICON_URL, alt: 'logo', width: 20, height: 20 }),
      el('span', { textContent: ' FlorIA - Plant identification', className: 'title' })
    ),
    el('div', { className: 'right' },
      el('button', { id: 'floria-settings', title: 'Settings', textContent: '⚙️' }),
      el('button', { id: 'floria-close', title: 'Close', textContent: 'X' })
    )
  );
  css(header, { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' });
  css(header.querySelector('.left'), { display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700' });
  css(header.querySelector('.right'), { display: 'flex', alignItems: 'center', gap: '6px' });
  const btnSettings = header.querySelector('#floria-settings');
  css(btnSettings, { background: '#e2e8f0', border: 'none', borderRadius: '8px', padding: '6px 8px', cursor: 'pointer' });
  const btnClose = header.querySelector('#floria-close');
  css(btnClose, { background: '#e2e8f0', border: 'none', borderRadius: '8px', padding: '6px 8px', cursor: 'pointer' });

  // Dropzone
  const drop = el('div', { id: 'floria-drop' },
    el('div', { innerHTML: '<b>Paste (Ctrl+V)</b> or drop a file, or choose below.' }),
    el('input', { id: 'floria-file', type: 'file', accept: 'image/*' }),
    el('img', { id: 'floria-preview', style: 'display:none;max-height:260px;object-fit:contain;border-radius:8px;border:1px solid #e5e7eb;background:#fff;margin-top:6px;width:100%;' })
  );
  css(drop, { border: '2px dashed #94a3b8', borderRadius: '10px', padding: '10px', textAlign: 'center', background: '#fff', marginBottom: '8px' });

  // Actions
  const rowActions = el('div', { className: 'row-actions' },
    el('button', { id: 'floria-identify', textContent: 'Identify' }),
    el('button', { id: 'floria-openall', textContent: 'Open all', disabled: true })
  );
  css(rowActions, { display: 'flex', gap: '8px', marginBottom: '8px' });
  const btnIdentify = rowActions.querySelector('#floria-identify');
  const btnOpenAll  = rowActions.querySelector('#floria-openall');
  css(btnIdentify, { flex: 1, padding: '10px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' });
  css(btnOpenAll,  { flex: 1, padding: '10px', background: '#0ea5e9', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'none' });

  // Results
  const results = el('div', { id: 'floria-results' });
  css(results, { display: 'none', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '8px', maxHeight: '260px', overflow: 'auto', marginBottom: '8px' });

  // History thumbnails
  const historyBox = el('div', { id: 'floria-history' },
    el('div', { textContent: 'History', style: 'font-weight:600;margin-bottom:6px;' }),
    el('div', { id: 'floria-history-list' })
  );
  css(historyBox, { background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '8px', padding: '8px', maxHeight: '120px', overflow: 'auto', marginBottom: '8px' });
  const historyList = historyBox.querySelector('#floria-history-list');
  css(historyList, { display: 'flex', gap: '6px', flexWrap: 'wrap' });

  // Status
  const status = el('div', { id: 'floria-status', textContent: 'Ready.' });
  css(status, { fontSize: '12px', color: '#333' });

  const poweredBy = el('div', { id: 'floria-powered-by-plantnet' },
    el('div', {},
      'The image-based plant species identification service is based on the Pl@ntNet recognition API,',
      ' regularly updated and accessible through the site ',
      el('a', { href: 'https://my.plantnet.org/', target: '_blank', rel: 'noopener noreferrer', textContent: 'https://my.plantnet.org/' }),
      '.'
    ),
    el('a', { href: 'https://my.plantnet.org/', target: '_blank', rel: 'noopener noreferrer', style: 'display:inline-block;margin-top:4px;' },
      el('img', { src: 'https://my.plantnet.org/images/powered-by-plantnet-light.png', alt: 'Powered by Pl@ntNet', style: 'height:24px;' })
    )
  );
  css(poweredBy, { marginTop: '6px', fontSize: '11px', opacity: '0.8' });

  panel.append(header, drop, rowActions, results, historyBox, status, poweredBy);
  document.body.appendChild(panel);

  let lastDataUrl = null;
  let urlsAbove = [];
  let currentResults = [];
  let history = getHistory();

  function hideOpenAll() { btnOpenAll.disabled = true; btnOpenAll.style.display = 'none'; urlsAbove = []; }
  function showOpenAllIfEligible() {
    if (urlsAbove.length >= 2) { btnOpenAll.disabled = false; btnOpenAll.style.display = 'inline-block'; }
    else hideOpenAll();
  }
  function renderHistory() {
    historyList.innerHTML = '';
    history.forEach((h, i) => {
      const card = el('div', { className: 'hist-card', title: h.top || '' });
      css(card, { border: '1px solid #e5e7eb', borderRadius: '6px', padding: '3px', cursor: 'pointer', background: '#fff' });
      const img = el('img', { src: h.thumb, width: 80, height: 50 });
      css(img, { objectFit: 'cover', borderRadius: '4px', display: 'block' });
      card.appendChild(img);
      card.addEventListener('click', () => {
        // load minimal – just show results saved (fast)
        lastDataUrl = null; // no re-identify; just display saved lines
        results.style.display = 'block';
        results.innerHTML = '';
        urlsAbove = [];
        (h.results || []).forEach((r, i2) => {
          const links = buildResultLinks(r);
          const row = buildResultRow(r, i2, links);
          results.appendChild(row);
          if (r.pct >= get('minConf')) urlsAbove.push(links.inat);
        });
        showOpenAllIfEligible();
        status.textContent = 'Loaded from history.';
      });
      historyList.appendChild(card);
    });
  }

  function nameTitle(sci, com) {
    const fmt = get('nameFormat');
    if (fmt === 'scientific') return sci;
    if (fmt === 'common') return com || sci;
    return com ? `${com} (${sci})` : sci;
  }
  function linkBar(result, links) {
    const linkSet = links || buildResultLinks(result);
    const wrap = el('div', {});
    css(wrap, { fontSize: '12px', color: '#475569' });
    const aINat = el('a', { href: linkSet.inat, target: '_blank', textContent: 'iNat' });
    const aGBIF = linkSet.gbif ? el('a', { href: linkSet.gbif, target: '_blank', textContent: 'GBIF' }) : null;
    const aPOWO = el('a', { href: linkSet.powo, target: '_blank', textContent: 'POWO' });
    const aTela = el('a', { href: linkSet.tela, target: '_blank', textContent: 'Tela' });
    const aWiki = el('a', { href: linkSet.wiki, target: '_blank', textContent: 'Wiki' });
    [aINat, aGBIF, aPOWO, aTela, aWiki].filter(Boolean).forEach((a, idx) => {
      if (idx) wrap.append(' · ');
      css(a, { textDecoration: 'none', color: '#0369a1' });
      wrap.appendChild(a);
    });
    return wrap;
  }
  function badge(text, bg, fg) {
    const b = el('span', { textContent: text });
    css(b, { marginLeft: '6px', background: bg, color: fg, padding: '2px 6px', borderRadius: '999px', fontSize: '11px' });
    return b;
  }
  function buildResultRow(r, idx, links) {
    const row = el('div', {});
    css(row, { display: 'flex', alignItems: 'center', justifyContent: 'space-between',
               borderBottom: '1px solid #eef2f7', padding: '6px 0', opacity: r.low ? .55 : 1 });

    const linkSet = links || buildResultLinks(r);
    const left = el('div', { style: 'flex:1;min-width:0;' });
    const title = el('div', { innerHTML: `${idx + 1}. ${r.title}` });
    css(title, { fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' });
    const sub = el('div', {}); css(sub, { display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' });
    sub.append(el('span', { innerHTML: `${r.pct}%${r.low ? ' · <span style="color:#ef4444">low confidence</span>' : ''}` }));
    sub.append(linkBar(r, linkSet));
    if (r.localCount > 0) sub.append(badge('local', '#10b981', '#fff'));
    left.append(title, sub);

    const go = el('a', { href: linkSet.inat, target: '_blank', textContent: 'iNaturalist' });
    css(go, { textDecoration: 'none', background: '#0ea5e9', color: '#fff', padding: '6px 10px', borderRadius: '8px', flexShrink: 0 });

    row.append(left, go);
    return row;
  }

  async function setPreviewFromDataUrl(dataUrl) {
    lastDataUrl = dataUrl;
    const thumb = await makeThumb(dataUrl);
    const img = panel.querySelector('#floria-preview');
    img.src = thumb; img.style.display = 'block';
    results.style.display = 'none'; results.innerHTML = '';
    hideOpenAll();
    status.textContent = 'Preview ready. Click “Identify”.';
  }

  // Coller (Ctrl+V) DANS LA DROPZONE UNIQUEMENT
  drop.addEventListener('paste', async (e) => {
    const items = e.clipboardData?.items || [];
    for (const it of items) {
      if (it.kind === 'file' && it.type.startsWith('image/')) {
        const blob = it.getAsFile();
        const dataUrl = await toDataURLFromBlobOrFile(blob);
        await setPreviewFromDataUrl(dataUrl);
        e.preventDefault();
        return;
      }
    }
    status.textContent = 'No image in clipboard.';
  });
  // Drag & drop
  ;['dragenter','dragover'].forEach(t => drop.addEventListener(t, e => { e.preventDefault(); e.stopPropagation(); drop.style.background = '#f1f5f9'; }));
  ;['dragleave','drop'].forEach(t => drop.addEventListener(t, e => { e.preventDefault(); e.stopPropagation(); drop.style.background = '#fff'; }));
  drop.addEventListener('drop', async (e) => {
    const f = e.dataTransfer?.files?.[0]; if (!f || !f.type.startsWith('image/')) return;
    const dataUrl = await toDataURLFromBlobOrFile(f);
    await setPreviewFromDataUrl(dataUrl);
  });
  // File chooser
  const fileInput = drop.querySelector('#floria-file');
  fileInput.addEventListener('change', async () => {
    const f = fileInput.files?.[0]; if (!f || !f.type.startsWith('image/')) return;
    const dataUrl = await toDataURLFromBlobOrFile(f);
    await setPreviewFromDataUrl(dataUrl);
  });

  // Identify
  btnIdentify.addEventListener('click', async () => {
    if (!lastDataUrl) { status.textContent = 'No image yet.'; return; }
    if (!ensureApiKey()) return;

    status.textContent = 'Preparing image…';
    const send = await enhanceDataUrl(lastDataUrl);

    status.textContent = `Identifying… (lang: ${get('language')})`;
    results.style.display = 'none'; results.innerHTML = ''; hideOpenAll();

    try {
      const candidates = await identifyPlant(send);
      if (!candidates.length) {
        if (!/^No species/i.test(status.textContent || '')) status.textContent = 'No species candidate returned.';
        return;
      }

      const topResults = get('topResults') || '5';
      const maxResults = topResults === 'all' ? null : parseInt(topResults, 10);
      const useLimit = Number.isFinite(maxResults) && maxResults > 0;
      const sorted = candidates.sort((a, b) => (b.prob || 0) - (a.prob || 0));
      const shown = useLimit ? sorted.slice(0, maxResults) : sorted;
      const top1 = Math.round(shown[0].prob || 0);
      const top2 = Math.round(shown[1]?.prob || 0);
      let effMin = get('minConf');
      if (top1 - top2 < get('dynamicGap')) effMin = Math.min(100, effMin + 10);
      if (top1 >= get('highCertain'))      effMin = Math.max(5,   effMin - 10);

      const links = shown.map(c => buildResultLinks(c));
      const urls = links.map(link => link.inat);
      const locals = await Promise.all(shown.map(c => inatLocalCount(c.inatId || c.inat)));

      // Auto-open
      const auto = get('autoOpen');
      if (auto > 0 && top1 >= auto) window.open(urls[0], '_blank');

      // Render
      currentResults = [];
      results.style.display = 'block'; results.innerHTML = '';
      urlsAbove = [];
      shown.forEach((c, i) => {
        const pct = Math.round(c.prob || 0);
        const low = pct < effMin;
        const title = nameTitle(c.sci, c.com);
        const linkSet = links[i];
        const url = linkSet.inat;
        const r = {
          title,
          pct,
          url,
          localCount: locals[i] || 0,
          sci: c.sci,
          com: c.com,
          inatId: c.inatId || c.inat,
          inatUrl: c.inatUrl || c.inatMatch?.url || null,
          inatWikipedia: c.inatWikipedia || null,
          inatMatch: c.inatMatch || null,
          gbif: c.gbif,
          powo: c.powo,
          low
        };
        results.appendChild(buildResultRow(r, i, linkSet));
        currentResults.push(r);
        if (pct >= effMin) urlsAbove.push(url);
      });
      showOpenAllIfEligible();

      // Save history (thumb only, not full image)
      const thumb = panel.querySelector('#floria-preview').src;
      const topTitle = currentResults[0]?.title || '';
      history.unshift({ ts: Date.now(), thumb, top: `${topTitle} (${top1}%)`, results: currentResults });
      if (history.length > 50) history = history.slice(0, 50);
      saveHistory(history);
      renderHistory();

      status.textContent = 'Done.';
    } catch (e) {
      if (get('debug')) {
        console.error('FlorIA network error', e);
        if (e?.details?.responseText) console.debug('FlorIA response text', e.details.responseText);
      }
      const msg = formatNetworkError(e);
      status.textContent = `Identification error: ${msg}${get('debug') ? ' (see console)' : ''}`;
    }
  });

  // Open all in new tabs
  btnOpenAll.addEventListener('click', () => {
    if (!urlsAbove || urlsAbove.length < 2) return;
    urlsAbove.forEach(u => window.open(u, '_blank'));
  });

  // Toggle
  toggle.addEventListener('click', () => {
    panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    if (panel.style.display === 'block') renderHistory();
  });

  // Close panel
  btnClose.addEventListener('click', () => { panel.style.display = 'none'; });

  // Settings panel
  btnSettings.addEventListener('click', showSettingsPanel);

  // Initial history render
  renderHistory();
}

/* =============================
   SETTINGS PANEL (with sliders)
   ============================= */
function slider(label, min, max, val, oninput) {
  const wrap = el('div', { className: 'slider-wrap' });
  const lab = el('label', { textContent: `${label}: ${val}%` });
  const s = el('input', { type: 'range', min: String(min), max: String(max), value: String(val) });
  css(wrap, { margin: '8px 0' }); css(s, { width: '100%' });
  s.addEventListener('input', () => { lab.textContent = `${label}: ${s.value}%`; oninput(+s.value); });
  wrap.append(lab, s); return wrap;
}
function select(label, values, current, onchange) {
  const w = el('div', {}); css(w, { margin: '6px 0' });
  const lab = el('label', { textContent: label }); css(lab, { display: 'block', marginBottom: '4px' });
  const sel = el('select', {});
  values.forEach(v => sel.append(el('option', { value: v, textContent: v, selected: v === current })));
  css(sel, { width: '100%', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '8px' });
  sel.addEventListener('change', () => onchange(sel.value));
  w.append(lab, sel); return w;
}
function checkbox(label, checked, onchange) {
  const l = el('label', {}); css(l, { display: 'flex', alignItems: 'center', gap: '8px', margin: '6px 0' });
  const c = el('input', { type: 'checkbox', checked }); const t = el('span', { textContent: label });
  c.addEventListener('change', () => onchange(!!c.checked));
  l.append(c, t); return l;
}
function number(label, value, min, step, onchange) {
  const w = el('div', {}); css(w, { margin: '6px 0' });
  const lab = el('label', { textContent: label }); css(lab, { display: 'block', marginBottom: '4px' });
  const inp = el('input', { type: 'number', value: String(value), min: String(min), step: String(step) });
  css(inp, { width: '100%', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '8px' });
  inp.addEventListener('input', () => onchange(Math.max(min, +inp.value || value)));
  w.append(lab, inp); return w;
}

function showSettingsPanel() {
  if ($('#floria-settings-panel')) return;
  const p = el('div', { id: 'floria-settings-panel' });
  css(p, {
    position: 'fixed', right: '16px', bottom: '64px', zIndex: 11000,
    width: '380px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '12px',
    boxShadow: '0 20px 50px rgba(0,0,0,.25)', padding: '14px', font: '13px/1.4 system-ui'
  });

  const head = el('div', { className: 'floria-settings-head' },
    el('div', { className: 'left' },
      el('img', { src: ICON_URL, width: 20, height: 20, style: 'vertical-align:middle;margin-right:6px;' }),
      el('b', { textContent: 'Settings' })
    ),
    el('div', { className: 'right' },
      el('button', { id: 'floria-settings-close', title: 'Close', textContent: 'X' })
    )
  );
  css(head, { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' });
  const btnSettingsClose = head.querySelector('#floria-settings-close');
  css(btnSettingsClose, { background: '#e2e8f0', border: 'none', borderRadius: '8px', padding: '6px 8px', cursor: 'pointer' });
  btnSettingsClose.addEventListener('click', () => document.body.removeChild(p));

  // Controls
  let lang = get('language'), fmt = get('nameFormat'), organ = get('organ'),
      noReject = get('noReject'), includeRelatedImages = get('includeRelatedImages'),
      topR = get('topResults'), minScore = get('minScore'),
      minC = get('minConf'), auto = get('autoOpen'),
      gap  = get('dynamicGap'), high = get('highCertain'),
      rad  = get('inatRadiusKm'), mapTab = get('inatMapTab'), priv = get('privacyNoCoords'),
      enh  = get('enhanceLocal'), dbg = get('debug');

  const langSel = select('Language (PlantNet common names & Wikipedia)', ['en', 'fr', 'en,fr'], lang, v => lang = v);
  const fmtSel  = select('Name format', ['scientific', 'common', 'both'], fmt, v => fmt = v);
  const organSel = select('Organ (PlantNet)', ['leaf', 'flower', 'fruit', 'bark', 'habit'], organ, v => organ = v);
  const cNoReject = checkbox('No reject (PlantNet)', noReject, v => noReject = v);
  const cRelated = checkbox('Include related images', includeRelatedImages, v => includeRelatedImages = v);
  const topSel = select('Max results to show', ['3', '5', '10', 'all'], topR || '5', v => topR = v);

  const nScore = number('Min score filter (%)', minScore, 0, 1, v => minScore = v);
  const sMin  = slider('Min confidence (highlight/Open all)', 0, 100, minC, v => minC = v);
  const sAuto = slider('Auto-open top-1 if ≥', 0, 100, auto, v => auto = v);
  const sGap  = slider('Dynamic gap (raise min if top1-top2 &lt;)', 0, 30, gap, v => gap = v);
  const sHigh = slider('High certainty threshold (lowers min by 10 when reached)', 50, 100, high, v => high = v);

  const nRad = number('iNaturalist cross-check radius (km)', rad, 1, 1, v => rad = v);
  const cMapTab = checkbox('iNat: Map tab', mapTab, v => mapTab = v);
  const cPriv = checkbox('Never send coordinates (disables local cross-check)', priv, v => priv = v);
  const cEnh  = checkbox('Enhance locally (contrast/saturation + sharpen)', enh, v => enh = v);
  const cDbg  = checkbox('Debug logs (console)', dbg, v => dbg = v);

  const rowBtn = el('div', {}); css(rowBtn, { display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' });
  const save = el('button', { textContent: 'Save' });
  const cancel = el('button', { textContent: 'Cancel' });
  css(save, { padding: '8px 12px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' });
  css(cancel, { padding: '8px 12px', background: '#0f172a', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' });
  save.onclick = () => {
      set('language', lang); set('nameFormat', fmt); set('organ', organ); set('noReject', noReject);
      set('includeRelatedImages', includeRelatedImages); set('topResults', topR); set('minScore', minScore);
      set('minConf', minC); set('autoOpen', auto);
      set('dynamicGap', gap); set('highCertain', high); set('inatRadiusKm', rad);
      set('inatMapTab', mapTab);
      set('privacyNoCoords', priv); set('enhanceLocal', enh); set('debug', dbg);

      const msg = p.querySelector('#settings-msg') || document.createElement('div');
      msg.id = 'settings-msg';
      msg.style.cssText = "margin-top:8px;color:#16a34a;font-size:12px;";
      msg.textContent = "✅ Settings saved";
      p.appendChild(msg);

      // option: auto-hide after 2s
      setTimeout(() => msg.remove(), 2000);
  };

  cancel.onclick = () => document.body.removeChild(p);

  p.append(head, langSel, fmtSel, organSel, cNoReject, cRelated, topSel, nScore, sMin, sAuto, sGap, sHigh, nRad, cMapTab, cPriv, cEnh, cDbg, rowBtn);
  rowBtn.append(cancel, save);
  document.body.appendChild(p);
}

/* =============================
   MOUNT
   ============================= */
function waitForMaps(cb) {
  const t = setInterval(() => { if (location.href.includes('@')) { clearInterval(t); cb(); } }, 600);
}
let lastUrl = location.href;
new MutationObserver(() => {
  const cur = location.href;
  if (cur !== lastUrl) {
    lastUrl = cur;
    setTimeout(() => { if (cur.includes('@')) createUI(); }, 400);
  }
}).observe(document, { subtree: true, childList: true });

waitForMaps(() => createUI());

})();
