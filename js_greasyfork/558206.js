// ==UserScript==
// @name         HBO Max Subtitle Downloader (network-aware, top UI)
// @namespace    https://github.com/copy
// @version      0.2.1
// @description  Extract and download subtitles (WebVTT/TTML) from HBO Max playback pages. Detects browser-exposed textTracks AND subtitle resources visible in the Network panel (m3u8 master/playlist, .vtt/.webvtt/.ttml). UI placed top-right. Best-effort; CORS/encryption may block some fetches.
// @author       copilot
// @match        *://*.hbomax.com/*
// @match        *://hbomax.com/*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558206/HBO%20Max%20Subtitle%20Downloader%20%28network-aware%2C%20top%20UI%29.user.js
// @updateURL https://update.greasyfork.org/scripts/558206/HBO%20Max%20Subtitle%20Downloader%20%28network-aware%2C%20top%20UI%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const UI_ID = 'hbomax-sub-download-ui-v2';
  const SCAN_INTERVAL = 1000;

  // Keep captured network URLs (hook fetch/XHR + performance entries)
  const networkUrls = new Set();
  const networkMeta = {}; // url => {type: 'm3u8'|'vtt'|'ttml'|'other', hint: ...}

  // Utility to add url
  function addNetworkUrl(url) {
    try {
      if (!url) return;
      const u = String(url);
      if (networkUrls.has(u)) return;
      networkUrls.add(u);
      const lower = u.split('?')[0].toLowerCase();
      if (lower.endsWith('.m3u8')) networkMeta[u] = { type: 'm3u8' };
      else if (lower.endsWith('.vtt') || lower.endsWith('.webvtt')) networkMeta[u] = { type: 'vtt' };
      else if (lower.endsWith('.ttml') || lower.endsWith('.xml')) networkMeta[u] = { type: 'ttml' };
      else networkMeta[u] = { type: 'other' };
    } catch (e) {
      // ignore
    }
  }

  // Hook fetch to observe future requests
  (function hookFetch() {
    if (!window.fetch || window._hbomax_fetch_hooked) return;
    window._hbomax_fetch_hooked = true;
    const origFetch = window.fetch;
    window.fetch = function (input, init) {
      try {
        const url = (typeof input === 'string') ? input : (input && input.url) || '';
        addNetworkUrl(url);
      } catch (e) {}
      return origFetch.apply(this, arguments);
    };
  })();

  // Hook XHR to observe future requests
  (function hookXHR() {
    if (window._hbomax_xhr_hooked) return;
    window._hbomax_xhr_hooked = true;
    const origOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url) {
      try { addNetworkUrl(url); } catch (e) {}
      return origOpen.apply(this, arguments);
    };
  })();

  // Scan performance entries (resources already loaded)
  function scanPerformanceEntries() {
    try {
      const ents = performance.getEntriesByType ? performance.getEntriesByType('resource') : [];
      for (const e of ents) {
        if (e && e.name) addNetworkUrl(e.name);
      }
    } catch (e) {}
  }

  // Helpers for filenames & formatting
  function sanitizeFilename(s) {
    return String(s || '').replace(/[\\/:"*?<>|]+/g, '').trim().replace(/\s+/g, ' ');
  }
  function makeFilename(langLabel) {
    let title = (document.querySelector('meta[property="og:title"]') || {}).content || document.title || 'hbo-max-subtitles';
    title = sanitizeFilename(title);
    const langSafe = langLabel ? sanitizeFilename(langLabel) : 'unknown';
    return `${title}.${langSafe}`;
  }

  function downloadBlob(filename, blob) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  }

  function downloadText(filename, text, mime = 'text/vtt;charset=utf-8') {
    const blob = new Blob([text], { type: mime });
    downloadBlob(filename, blob);
  }

  // Build WEBVTT from TextTrack cues
  function formatTimeMS(ms) {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000));
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = ms % 1000;
    return `${String(hours).padStart(2,'0')}:${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}.${String(milliseconds).padStart(3,'0')}`;
  }
  function buildVTTFromCues(track) {
    const cues = track.cues;
    if (!cues || cues.length === 0) return null;
    const lines = ['WEBVTT', ''];
    for (let i = 0; i < cues.length; i++) {
      const c = cues[i];
      const startMs = Math.round((c.startTime || 0) * 1000);
      const endMs = Math.round((c.endTime || 0) * 1000);
      lines.push(`${formatTimeMS(startMs)} --> ${formatTimeMS(endMs)}`);
      const text = (c.text || '').replace(/\r\n/g, '\n');
      lines.push(text);
      lines.push('');
    }
    return lines.join('\n');
  }

  // Parse M3U8 master manifest for subtitle media lines
  function parseMasterForSubtitles(masterText, baseUrl) {
    // Return array of {uri, groupId, language, name}
    const results = [];
    const lines = masterText.split(/\r?\n/);
    for (const l of lines) {
      if (l && l.startsWith('#EXT-X-MEDIA') && /TYPE=SUBTITLES/i.test(l)) {
        // crude attr parsing: KEY=VALUE, values may be quoted
        const attrs = {};
        l.replace(/^#EXT-X-MEDIA:\s*/, '').split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/).forEach(part => {
          const [k, v] = part.split('=');
          if (!k) return;
          attrs[k.trim()] = (v || '').trim().replace(/^"|"$/g, '');
        });
        if (attrs.URI) {
          try {
            const uri = new URL(attrs.URI, baseUrl).toString();
            results.push({ uri, groupId: attrs['GROUP-ID'] || '', language: attrs.LANGUAGE || attrs.NAME || '', name: attrs.NAME || attrs.LANGUAGE || '' });
          } catch (e) {
            // ignore bad URLs
          }
        }
      }
    }
    return results;
  }

  // Parse subtitle playlist (m3u8) to get segment URIs or direct VTT
  function parseSubtitlePlaylist(playlistText, baseUrl) {
    const trimmed = playlistText.trim();
    if (/^WEBVTT/i.test(trimmed)) {
      return { kind: 'vtt-inline', parts: [playlistText] };
    }
    const lines = playlistText.split(/\r?\n/);
    const uris = [];
    for (const l of lines) {
      if (l === '' || l.startsWith('#')) continue;
      try {
        const full = new URL(l, baseUrl).toString();
        uris.push(full);
      } catch (e) {
        // ignore
      }
    }
    if (uris.length > 0) return { kind: 'segments', parts: uris };
    return { kind: 'raw', text: playlistText };
  }

  // Fetch and combine segments (VTT or TTML)
  async function fetchAndCombineVTTParts(parts, filenameBase) {
    try {
      const texts = [];
      for (const p of parts) {
        const resp = await fetch(p, { credentials: 'include' });
        if (!resp.ok) throw new Error(`HTTP ${resp.status} for ${p}`);
        const t = await resp.text();
        texts.push(t);
      }
      // Normalize: ensure single WEBVTT header at top and remove repeated headers
      let combined = '';
      for (let i = 0; i < texts.length; i++) {
        let t = texts[i].replace(/^\uFEFF/, '');
        if (i === 0) {
          if (!/^WEBVTT/i.test(t.trim())) combined += 'WEBVTT\n\n';
          combined += t;
        } else {
          t = t.replace(/^\s*WEBVTT[^\n]*\r?\n\r?\n/, '');
          combined += '\n\n' + t;
        }
      }
      downloadText(`${filenameBase}.vtt`, combined, 'text/vtt;charset=utf-8');
    } catch (err) {
      alert('Failed to fetch subtitle segments. CORS or network error possible. See console for details.');
      console.error('fetchAndCombineVTTParts error', err);
    }
  }

  // Fetch and save a single resource (vtt/ttml or raw)
  async function fetchAndSaveResource(url, filenameBase) {
    try {
      const resp = await fetch(url, { credentials: 'include' });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const text = await resp.text();
      const isTTML = text.trim().startsWith('<?xml') || /<tt[\s>]/i.test(text);
      if (isTTML) {
        downloadText(`${filenameBase}.ttml`, text, 'application/xml;charset=utf-8');
      } else if (/^WEBVTT/i.test(text.trim())) {
        downloadText(`${filenameBase}.vtt`, text, 'text/vtt;charset=utf-8');
      } else if (/^#EXTM3U/.test(text) || text.includes('#EXT')) {
        const parsed = parseSubtitlePlaylist(text, url);
        if (parsed.kind === 'segments') {
          await fetchAndCombineVTTParts(parsed.parts, filenameBase);
        } else if (parsed.kind === 'vtt-inline') {
          downloadText(`${filenameBase}.vtt`, parsed.parts[0], 'text/vtt;charset=utf-8');
        } else {
          downloadText(`${filenameBase}.txt`, text, 'text/plain;charset=utf-8');
        }
      } else {
        downloadText(`${filenameBase}.vtt`, text, 'text/vtt;charset=utf-8');
      }
    } catch (err) {
      alert('Failed to fetch subtitle file directly (CORS or network error). Try the browser-exposed track method (enable captions).');
      console.error('fetchAndSaveResource error', err);
    }
  }

  // Find primary video element (largest)
  function findPrimaryVideo() {
    const vids = Array.from(document.querySelectorAll('video'));
    if (!vids || vids.length === 0) return null;
    const candidates = vids.filter(v => {
      try {
        const rc = v.getBoundingClientRect();
        return rc.width > 50 && rc.height > 30;
      } catch (e) { return false; }
    });
    if (candidates.length === 0) return vids[0];
    candidates.sort((a,b) => {
      const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
      return (rb.width * rb.height) - (ra.width * ra.height);
    });
    return candidates[0];
  }

  // Build the UI (top-right)
  function buildUI() {
    if (document.getElementById(UI_ID)) return;
    const container = document.createElement('div');
    container.id = UI_ID;
    container.style.position = 'fixed';
    container.style.right = '12px';
    container.style.top = '12px'; // UI placed top as requested
    container.style.zIndex = 999999;
    container.style.fontFamily = 'Tahoma, Arial, sans-serif';
    container.style.fontSize = '13px';
    container.style.color = '#111';
    container.style.background = 'rgba(255,255,255,0.97)';
    container.style.border = '1px solid rgba(0,0,0,0.12)';
    container.style.borderRadius = '8px';
    container.style.boxShadow = '0 6px 20px rgba(0,0,0,0.18)';
    container.style.padding = '8px';
    container.style.minWidth = '220px';
    container.style.maxWidth = '460px';
    container.style.maxHeight = '60vh';
    container.style.overflow = 'auto';

    const header = document.createElement('div');
    header.style.display = 'flex';
    header.style.justifyContent = 'space-between';
    header.style.alignItems = 'center';
    header.style.marginBottom = '6px';

    const title = document.createElement('div');
    title.textContent = 'HBO Max Subtitles';
    title.style.fontWeight = '600';
    title.style.fontSize = '13px';

    const tiny = document.createElement('div');
    tiny.textContent = 'v0.2.1';
    tiny.style.fontSize = '11px';
    tiny.style.color = '#666';

    header.appendChild(title);
    header.appendChild(tiny);

    const status = document.createElement('div');
    status.id = `${UI_ID}-status`;
    status.style.color = '#444';
    status.style.fontSize = '12px';
    status.style.marginBottom = '6px';
    status.textContent = 'Initializing...';

    const list = document.createElement('div');
    list.id = `${UI_ID}-list`;
    list.style.display = 'flex';
    list.style.flexDirection = 'column';
    list.style.gap = '6px';

    const hint = document.createElement('div');
    hint.style.fontSize = '11px';
    hint.style.color = '#666';
    hint.style.marginTop = '8px';
    hint.textContent = 'Click a button to download. If a fetch fails, CORS or encryption may be in effect.';

    container.appendChild(header);
    container.appendChild(status);
    container.appendChild(list);
    container.appendChild(hint);
    document.body.appendChild(container);
  }

  function makeButton(label, onClick) {
    const btn = document.createElement('button');
    btn.textContent = label;
    btn.style.padding = '6px 8px';
    btn.style.border = '1px solid rgba(0,0,0,0.12)';
    btn.style.borderRadius = '6px';
    btn.style.background = '#fff';
    btn.style.cursor = 'pointer';
    btn.style.textAlign = 'left';
    btn.style.width = '100%';
    btn.addEventListener('mouseover', () => { btn.style.background = '#f3f4f6'; });
    btn.addEventListener('mouseout',  () => { btn.style.background = '#fff'; });
    btn.addEventListener('click', onClick);
    return btn;
  }

  // Update the UI based on detected resources and video textTracks
  async function updateUI() {
    const status = document.getElementById(`${UI_ID}-status`);
    const list = document.getElementById(`${UI_ID}-list`);
    if (!status || !list) return;

    list.innerHTML = '';
    // 1) browser textTracks
    const video = findPrimaryVideo();
    let textTrackCount = 0;
    if (video) {
      const textTracks = Array.from(video.textTracks || []);
      if (textTracks.length > 0) {
        const header = document.createElement('div');
        header.style.fontSize = '12px';
        header.style.fontWeight = '600';
        header.textContent = 'Browser-exposed tracks';
        list.appendChild(header);
        for (let i = 0; i < textTracks.length; i++) {
          const t = textTracks[i];
          const label = `${t.label || t.language || 'unknown'} (textTrack)`;
          const btn = makeButton(label, async () => {
            try { t.mode = 'hidden'; } catch (e) {}
            await new Promise(r => setTimeout(r, 200));
            const vtt = buildVTTFromCues(t);
            if (vtt) {
              const filename = makeFilename(t.label || t.language || 'subtitle');
              downloadText(`${filename}.vtt`, vtt);
            } else {
              alert('No cues available. Try enabling captions in the player UI.');
            }
          });
          list.appendChild(btn);
        }
        textTrackCount = textTracks.length;
      }
    }

    // 2) network-detected subtitle resources
    scanPerformanceEntries(); // pick up entries
    // scan DOM for candidate links
    try {
      const trackEls = Array.from(document.querySelectorAll('track'));
      for (const te of trackEls) {
        const src = te.src || te.getAttribute('src');
        if (src) addNetworkUrl(new URL(src, location.href).toString());
      }
      const sourceEls = Array.from(document.querySelectorAll('source'));
      for (const se of sourceEls) {
        const src = se.src || se.getAttribute('src');
        if (src) addNetworkUrl(new URL(src, location.href).toString());
      }
      const linkEls = Array.from(document.querySelectorAll('link[href]'));
      for (const le of linkEls) {
        const href = le.href || le.getAttribute('href');
        if (href) addNetworkUrl(new URL(href, location.href).toString());
      }
    } catch (e) {}

    // Gather candidate subtitle-related URLs
    const candidates = Array.from(networkUrls).filter(u => {
      const p = u.split('?')[0].toLowerCase();
      return p.endsWith('.m3u8') || p.endsWith('.vtt') || p.endsWith('.webvtt') || p.endsWith('.ttml') || p.endsWith('.xml') || /subtitle|captions|cc|text/i.test(u);
    });

    if (candidates.length > 0) {
      const header = document.createElement('div');
      header.style.fontSize = '12px';
      header.style.fontWeight = '600';
      header.style.marginTop = '8px';
      header.textContent = 'Network-detected subtitle resources';
      list.appendChild(header);

      for (const u of candidates) {
        const meta = networkMeta[u] || {};
        const short = u.length > 100 ? u.slice(0, 96) + '…' : u;
        const label = `${short} (${meta.type || 'unknown'})`;
        const btn = makeButton(label, async () => {
          const filenameBase = makeFilename(meta.type === 'm3u8' ? 'subtitle' : (meta.type || 'subtitle'));
          // If it's an m3u8, fetch and parse master/playlist
          if (meta.type === 'm3u8' || /\.m3u8(\?|$)/i.test(u)) {
            try {
              const resp = await fetch(u, { credentials: 'include' });
              if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
              const txt = await resp.text();
              if (/^#EXTM3U/.test(txt)) {
                const subs = parseMasterForSubtitles(txt, u);
                if (subs.length > 0) {
                  // If master lists subtitle playlists, show a simple picker by opening a prompt with choices
                  const options = subs.map((s, i) => `${i}: ${s.language || s.name || s.uri}`).join('\n');
                  let pickIndex = 0;
                  try {
                    const input = prompt(`Master playlist lists subtitle playlists:\n${options}\nEnter index to download (default 0):`, '0');
                    if (input !== null) {
                      const n = parseInt(input, 10);
                      if (!isNaN(n) && n >= 0 && n < subs.length) pickIndex = n;
                    } else {
                      return; // user cancelled
                    }
                  } catch (e) {}
                  const pick = subs[pickIndex];
                  const candidateUri = pick.uri;
                  const pResp = await fetch(candidateUri, { credentials: 'include' });
                  if (!pResp.ok) throw new Error(`HTTP ${pResp.status}`);
                  const pTxt = await pResp.text();
                  const parsed = parseSubtitlePlaylist(pTxt, candidateUri);
                  if (parsed.kind === 'vtt-inline') {
                    downloadText(`${filenameBase}.${pick.language || pick.name || 'subtitle'}.vtt`, parsed.parts[0], 'text/vtt;charset=utf-8');
                  } else if (parsed.kind === 'segments') {
                    await fetchAndCombineVTTParts(parsed.parts, `${filenameBase}.${pick.language || pick.name || 'subtitle'}`);
                  } else {
                    downloadText(`${filenameBase}.${pick.language || pick.name || 'subtitle'}.txt`, pTxt, 'text/plain;charset=utf-8');
                  }
                } else {
                  // media playlist containing segments or maybe a subtitle playlist itself
                  const parsed = parseSubtitlePlaylist(txt, u);
                  if (parsed.kind === 'vtt-inline') {
                    downloadText(`${filenameBase}.vtt`, parsed.parts[0], 'text/vtt;charset=utf-8');
                  } else if (parsed.kind === 'segments') {
                    await fetchAndCombineVTTParts(parsed.parts, filenameBase);
                  } else {
                    downloadText(`${filenameBase}.txt`, txt, 'text/plain;charset=utf-8');
                  }
                }
              } else {
                await fetchAndSaveResource(u, filenameBase);
              }
            } catch (err) {
              alert('Failed to process m3u8 resource. See console for details.');
              console.error('m3u8 processing error', err);
            }
          } else {
            await fetchAndSaveResource(u, filenameBase);
          }
        });
        list.appendChild(btn);
      }
    }

    // Update status text
    const total = textTrackCount + candidates.length;
    status.textContent = `Detected ${total} track(s) / resources`;
  }

  // Periodic scanning / updating
  function start() {
    buildUI();
    updateUI();
    setInterval(() => {
      scanPerformanceEntries();
      updateUI();
    }, SCAN_INTERVAL);
  }

  // Kick off
  try {
    start();
  } catch (e) {
    console.error(e);
  }

})();