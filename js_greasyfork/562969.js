// ==UserScript==
// @name         Gemini Enterprise Full Exporter (All Chats)
// @namespace    https://github.com/lueluelue2006
// @version      0.1.0
// @author       schweigen
// @description  Export ALL Gemini Enterprise chats to Markdown/HTML, including images (optionally embedded as base64), with visible progress.
// @match        https://business.gemini.google/*
// @match        https://*.business.gemini.google/*
// @run-at       document-idle
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/562969/Gemini%20Enterprise%20Full%20Exporter%20%28All%20Chats%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562969/Gemini%20Enterprise%20Full%20Exporter%20%28All%20Chats%29.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const APP_ID = 'gemini-enterprise-full-exporter';
  // If a previous run crashed after setting the flag (e.g., due to Trusted Types),
  // allow re-mounting when UI elements are missing.
  const existingBtn = document.getElementById(`${APP_ID}__btn`);
  if (window[APP_ID] && existingBtn) return;
  window[APP_ID] = true;

  const API_BASE = 'https://biz-discoveryengine.googleapis.com';
  const API_WIDGET = `${API_BASE}/v1alpha/locations/global`;

  const UI = {
    rootId: `${APP_ID}__root`,
    btnId: `${APP_ID}__btn`,
  };

  const state = {
    running: false,
    aborted: false,
    abortController: null,
    logLines: [],
    maxLogLines: 400,
  };

  function nowStamp() {
    const d = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
  }

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function htmlEscape(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function sanitizeFilename(name) {
    const s = String(name || '')
      .trim()
      .replace(/[\\/:*?\"<>|]/g, '_')
      .replace(/\s+/g, ' ')
      .slice(0, 140);
    return s || 'untitled';
  }

  function getConfigIdFromUrl() {
    return location.pathname.match(/\/home\/cid\/([^/]+)/)?.[1] || null;
  }

  function extractSessionId(sessionName) {
    const m = String(sessionName || '').match(/\/sessions\/(\d+)$/);
    return m ? m[1] : null;
  }

  function base64ToUint8Array(base64) {
    const bin = atob(base64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return bytes;
  }

  function extForMime(mimeType) {
    const mt = String(mimeType || '').toLowerCase();
    if (mt === 'image/png') return 'png';
    if (mt === 'image/jpeg') return 'jpg';
    if (mt === 'image/webp') return 'webp';
    if (mt === 'image/gif') return 'gif';
    if (mt === 'image/svg+xml') return 'svg';
    if (mt === 'text/plain') return 'txt';
    if (mt === 'application/pdf') return 'pdf';
    return 'bin';
  }

  function log(line) {
    state.logLines.push(`[${new Date().toLocaleTimeString()}] ${line}`);
    if (state.logLines.length > state.maxLogLines) state.logLines.splice(0, state.logLines.length - state.maxLogLines);
    const el = document.getElementById(`${APP_ID}__log`);
    if (el) el.textContent = state.logLines.join('\n');
  }

  function setStatus(text) {
    const el = document.getElementById(`${APP_ID}__status`);
    if (el) el.textContent = text;
  }

  function setProgress(value, max) {
    const bar = document.getElementById(`${APP_ID}__progress`);
    const label = document.getElementById(`${APP_ID}__progress_label`);
    if (bar) {
      bar.max = max || 1;
      bar.value = Math.min(Math.max(value || 0, 0), bar.max);
    }
    if (label) label.textContent = `${value}/${max}`;
  }

  function setRunning(running) {
    state.running = running;
    const startBtn = document.getElementById(`${APP_ID}__start`);
    const cancelBtn = document.getElementById(`${APP_ID}__cancel`);
    const closeBtn = document.getElementById(`${APP_ID}__close`);
    if (startBtn) startBtn.disabled = running;
    if (closeBtn) closeBtn.disabled = running;
    if (cancelBtn) cancelBtn.disabled = !running;
  }

  async function postJson(url, body, signal) {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
      signal,
    });
    if (!res.ok) {
      const txt = await res.text().catch(() => '');
      throw new Error(`HTTP ${res.status} ${res.statusText} for ${url} :: ${txt.slice(0, 200)}`);
    }
    return res.json();
  }

  async function fetchDownloadAsBase64(url, signal) {
    const res = await fetch(url, { method: 'GET', signal });
    if (!res.ok) {
      const txt = await res.text().catch(() => '');
      throw new Error(`Download failed: HTTP ${res.status} ${res.statusText} :: ${txt.slice(0, 200)}`);
    }
    const safetyMime = res.headers.get('x-goog-safety-content-type') || '';
    const safetyEncoding = res.headers.get('x-goog-safety-encoding') || '';
    const contentType = safetyMime || (res.headers.get('content-type') || '').split(';')[0];

    if (String(safetyEncoding).toLowerCase() === 'base64') {
      const base64 = (await res.text()).trim();
      return { mimeType: contentType || 'application/octet-stream', base64 };
    }

    const blob = await res.blob();
    const dataUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('Failed to read blob as data URL'));
      reader.onload = () => resolve(String(reader.result || ''));
      reader.readAsDataURL(blob);
    });
    const base64 = dataUrl.split(',')[1] || '';
    return { mimeType: blob.type || contentType || 'application/octet-stream', base64 };
  }

  async function getProjectNumber(configId, signal) {
    const cacheKey = `${APP_ID}:projectNumber:${configId}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) return cached;

    const body = { configId, additionalParams: { token: '-' }, getEngineUserDataRequest: {} };
    const json = await postJson(`${API_WIDGET}/widgetGetEngineUserData`, body, signal);
    const m = JSON.stringify(json).match(/projects\/(\d+)\//);
    if (!m) throw new Error('Unable to determine project number (projects/<digits>/ not found)');
    localStorage.setItem(cacheKey, m[1]);
    return m[1];
  }

  async function listSessionsPage({ configId, pageSize, pageToken, filter, orderBy }, signal) {
    const body = {
      configId,
      additionalParams: { token: '-' },
      listSessionsRequest: {
        pageSize,
        pageToken: pageToken || '',
        orderBy: orderBy || 'update_time desc',
        filter: filter || '',
      },
    };
    const json = await postJson(`${API_WIDGET}/widgetListSessions`, body, signal);
    const resp = json.listSessionsResponse || {};
    return { sessions: resp.sessions || [], nextPageToken: resp.nextPageToken || '' };
  }

  async function listAllSessions({ configId, pageSize, filter, orderBy, delayMs }, signal) {
    let pageToken = '';
    let pageIdx = 0;
    const sessions = [];
    while (true) {
      if (state.aborted) throw new Error('Aborted');
      setStatus(`Listing sessions… page ${pageIdx + 1}`);
      const { sessions: page, nextPageToken } = await listSessionsPage(
        { configId, pageSize, pageToken, filter, orderBy },
        signal,
      );
      sessions.push(...page);
      log(`Listed page ${pageIdx + 1}: +${page.length}, total=${sessions.length}`);
      if (!nextPageToken) break;
      pageToken = nextPageToken;
      pageIdx++;
      await sleep(delayMs);
    }
    return sessions;
  }

  async function getSession({ configId, sessionId }, signal) {
    const body = {
      configId,
      additionalParams: { token: '-' },
      getSessionRequest: {
        name: sessionId,
        includeAnswerDetails: true,
        includeMostRecentSearchResponseDetails: true,
      },
    };
    return postJson(`${API_WIDGET}/widgetGetSession`, body, signal);
  }

  async function listSessionFileMetadata({ configId, sessionName }, signal) {
    const body = {
      configId,
      additionalParams: { token: '-' },
      listSessionFileMetadataRequest: { name: sessionName },
    };
    const json = await postJson(`${API_WIDGET}/widgetListSessionFileMetadata`, body, signal);
    return json.listSessionFileMetadataResponse || {};
  }

  function extractAssistantSegments(turn) {
    const segs = [];
    const replies = turn?.detailedAssistAnswer?.replies || [];
    for (const r of replies) {
      const c = r?.groundedContent?.content;
      if (!c) continue;
      if (c.thought === true) continue;

      if (c.text) segs.push({ type: 'text', text: c.text });
      if (c.executableCode?.code) segs.push({ type: 'code', language: c.executableCode.language || 'CODE', code: c.executableCode.code });
      if (c.file?.fileId) segs.push({ type: 'generated_file', fileId: c.file.fileId, mimeType: c.file.mimeType || 'application/octet-stream' });

      const parts = c.parts || [];
      for (const p of parts) {
        if (p?.text) segs.push({ type: 'text', text: p.text });
        if (p?.executableCode?.code) segs.push({ type: 'code', language: p.executableCode.language || 'CODE', code: p.executableCode.code });
        if (p?.file?.fileId) segs.push({ type: 'generated_file', fileId: p.file.fileId, mimeType: p.file.mimeType || 'application/octet-stream' });
      }
    }
    return segs;
  }

  async function ensureDir(parentHandle, name) {
    return parentHandle.getDirectoryHandle(name, { create: true });
  }

  async function writeTextFile(dirHandle, filename, text) {
    const fileHandle = await dirHandle.getFileHandle(filename, { create: true });
    const writable = await fileHandle.createWritable();
    await writable.write(text);
    await writable.close();
  }

  async function writeBinaryFile(dirHandle, filename, bytes) {
    const fileHandle = await dirHandle.getFileHandle(filename, { create: true });
    const writable = await fileHandle.createWritable();
    await writable.write(bytes);
    await writable.close();
  }

  async function withTextWriter(dirHandle, filename, fn) {
    const fileHandle = await dirHandle.getFileHandle(filename, { create: true });
    const writable = await fileHandle.createWritable();
    const write = async (chunk) => {
      await writable.write(chunk);
    };
    try {
      await fn({ write });
    } finally {
      await writable.close();
    }
  }

  async function exportOneSession({
    configId,
    projectNumber,
    sessionMeta,
    sessionsDir,
    assetsDir,
    options,
    signal,
    indexEntries,
    failures,
    ordinal,
    total,
  }) {
    const sessionId = extractSessionId(sessionMeta?.name);
    const displayName = sessionMeta?.displayName || `session-${sessionId || 'unknown'}`;
    setStatus(`Exporting ${ordinal}/${total}: ${displayName}`);
    log(`Exporting session ${sessionId} (${displayName})`);

    if (!sessionId) {
      failures.push({ sessionId: null, displayName, error: 'Could not extract sessionId' });
      return;
    }

    const sessionJson = await getSession({ configId, sessionId }, signal);
    const session = sessionJson.session;
    const sessionName = session?.name;
    if (!sessionName) {
      failures.push({ sessionId, displayName, error: 'widgetGetSession returned no session.name' });
      return;
    }

    let fileMetadataResp = {};
    try {
      fileMetadataResp = await listSessionFileMetadata({ configId, sessionName }, signal);
    } catch (e) {
      log(`Warning: listSessionFileMetadata failed for ${sessionId}: ${String(e)}`);
    }
    const fileMeta = fileMetadataResp.fileMetadata || [];
    const contextFileById = new Map(fileMeta.map((fm) => [String(fm.fileId), fm]));

    const fullSessionResource = `projects/${projectNumber}/locations/global/${sessionName}`;
    const ext = options.format === 'html' ? 'html' : 'md';
    const safeTitle = sanitizeFilename(session.displayName || displayName);
    const filename = `${String(ordinal).padStart(4, '0')}-${safeTitle}-${sessionId}.${ext}`;

    const sessionUrl = `${location.origin}/home/cid/${encodeURIComponent(configId)}/r/session/${encodeURIComponent(sessionId)}`;

    await withTextWriter(sessionsDir, filename, async ({ write }) => {
      if (options.format === 'html') {
        await write(`<!doctype html>\n<html>\n<head>\n<meta charset=\"utf-8\" />\n<title>${htmlEscape(safeTitle)}</title>\n<style>\nbody{font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;line-height:1.5;max-width:1100px;margin:24px auto;padding:0 16px;color:#111}\n.meta{color:#555;font-size:13px;margin-bottom:18px}\n.turn{border:1px solid #e6e6e6;border-radius:10px;padding:14px;margin:14px 0}\n.role{font-weight:700;margin:0 0 8px 0}\n.pre{white-space:pre-wrap;background:#fafafa;border:1px solid #eee;border-radius:8px;padding:10px}\n.code{white-space:pre;overflow:auto;background:#0b1020;color:#e6e6e6;border-radius:8px;padding:10px}\n.files{margin-top:8px}\nimg{max-width:100%;height:auto;border-radius:8px;border:1px solid #eee}\nhr{border:0;border-top:1px solid #eee;margin:18px 0}\n</style>\n</head>\n<body>\n`);
        await write(`<h1>${htmlEscape(session.displayName || displayName)}</h1>\n`);
        await write(`<div class=\"meta\">sessionId: ${htmlEscape(sessionId)}<br/>url: <a href=\"${htmlEscape(sessionUrl)}\">${htmlEscape(sessionUrl)}</a><br/>startTime: ${htmlEscape(session.startTime || '')}<br/>endTime: ${htmlEscape(session.endTime || '')}</div>\n`);
      } else {
        await write(`# ${session.displayName || displayName}\n\n`);
        await write(`- sessionId: ${sessionId}\n- url: ${sessionUrl}\n- startTime: ${session.startTime || ''}\n- endTime: ${session.endTime || ''}\n\n---\n\n`);
      }

      const turns = session.turns || [];
      for (let i = 0; i < turns.length; i++) {
        if (state.aborted) throw new Error('Aborted');
        const turn = turns[i];
        const createdAt = turn.createdAt || '';
        const userTextParts = (turn?.query?.parts || []).map((p) => p?.text).filter(Boolean);
        const userText = userTextParts.join('\n');
        const contextFiles = (turn?.query?.contextFiles || []).map((f) => String(f?.sessionContextFileId || '')).filter(Boolean);
        const assistantSegs = extractAssistantSegments(turn);

        if (options.format === 'html') {
          await write(`<div class=\"turn\">\n<div class=\"meta\">turn ${i + 1}${createdAt ? ` · createdAt: ${htmlEscape(createdAt)}` : ''}</div>\n`);
          await write(`<div class=\"role\">User</div>\n<div class=\"pre\">${htmlEscape(userText)}</div>\n`);
        } else {
          await write(`## Turn ${i + 1}${createdAt ? ` (${createdAt})` : ''}\n\n### User\n\n${userText}\n\n`);
        }

        if (options.includeContextFiles && contextFiles.length) {
          if (options.format === 'html') await write(`<div class=\"files\"><div class=\"meta\">Context files</div>\n`);
          else await write(`#### Context files\n\n`);

          for (const fileId of contextFiles) {
            const meta = contextFileById.get(fileId);
            const name = meta?.name || `context-${fileId}`;
            const mimeType = meta?.mimeType || 'application/octet-stream';
            const downloadUri = meta?.downloadUri || '';

            if (!downloadUri) {
              const line = `- ${name} (${mimeType}) [fileId=${fileId}] (no downloadUri)\n`;
              if (options.format === 'html') await write(`<div class=\"meta\">${htmlEscape(line)}</div>`);
              else await write(line);
              continue;
            }

            if (mimeType.startsWith('image/') && (options.embedImagesAsBase64 || !assetsDir)) {
              setStatus(`Downloading context image… ${name}`);
              const { mimeType: dlMime, base64 } = await fetchDownloadAsBase64(downloadUri, signal);
              const dataUri = `data:${dlMime};base64,${base64}`;
              if (options.format === 'html') {
                await write(`<div class=\"meta\">${htmlEscape(name)} (${htmlEscape(dlMime)})</div>\n<img src=\"${dataUri}\" alt=\"${htmlEscape(name)}\" />\n`);
              } else {
                await write(`- ${name} (${dlMime})\n\n<img src=\"${dataUri}\" alt=\"${htmlEscape(name)}\" />\n\n`);
              }
            } else {
              setStatus(`Downloading context file… ${name}`);
              const { mimeType: dlMime, base64 } = await fetchDownloadAsBase64(downloadUri, signal);
              const ext = extForMime(dlMime);
              const assetName = `${sanitizeFilename(name)}-${fileId}.${ext}`;
              const bytes = base64ToUint8Array(base64);
              await writeBinaryFile(assetsDir, assetName, bytes);

              const rel = `../assets/${assetName}`;
              if (options.format === 'html') {
                await write(`<div class=\"meta\"><a href=\"${htmlEscape(rel)}\">${htmlEscape(name)}</a> (${htmlEscape(dlMime)})</div>\n`);
              } else if (dlMime.startsWith('image/')) {
                await write(`- ${name} (${dlMime})\n\n![${name}](${rel})\n\n`);
              } else {
                await write(`- [${name}](${rel}) (${dlMime})\n`);
              }
            }
          }

          if (options.format === 'html') await write(`</div>\n`);
          else await write(`\n`);
        }

        if (options.format === 'html') {
          await write(`<div class=\"role\" style=\"margin-top:12px\">Assistant</div>\n`);
        } else {
          await write(`### Assistant\n\n`);
        }

        for (const seg of assistantSegs) {
          if (state.aborted) throw new Error('Aborted');

          if (seg.type === 'text') {
            if (options.format === 'html') await write(`<div class=\"pre\">${htmlEscape(seg.text)}</div>\n`);
            else await write(`${seg.text}\n\n`);
            continue;
          }

          if (seg.type === 'code') {
            const lang = String(seg.language || 'CODE').toLowerCase();
            if (options.format === 'html') await write(`<div class=\"code\">${htmlEscape(seg.code)}</div>\n`);
            else await write(`\n\`\`\`${lang}\n${seg.code}\n\`\`\`\n\n`);
            continue;
          }

          if (seg.type === 'generated_file') {
            const fileId = seg.fileId;
            const guessedMime = seg.mimeType || 'application/octet-stream';
            const downloadUrl = `${API_BASE}/download/v1alpha/${fullSessionResource}:downloadFile?fileId=${encodeURIComponent(fileId)}&alt=media`;

            if (guessedMime.startsWith('image/') && (options.embedImagesAsBase64 || !assetsDir)) {
              setStatus(`Downloading generated image… ${fileId}`);
              const { mimeType: dlMime, base64 } = await fetchDownloadAsBase64(downloadUrl, signal);
              const dataUri = `data:${dlMime};base64,${base64}`;
              if (options.format === 'html') {
                await write(`<div class=\"meta\">generated image (${htmlEscape(dlMime)}) · fileId=${htmlEscape(fileId)}</div>\n<img src=\"${dataUri}\" alt=\"${htmlEscape(fileId)}\" />\n`);
              } else {
                await write(`\n- generated image (${dlMime}) fileId=${fileId}\n\n<img src=\"${dataUri}\" alt=\"${htmlEscape(fileId)}\" />\n\n`);
              }
            } else {
              setStatus(`Downloading generated file… ${fileId}`);
              const { mimeType: dlMime, base64 } = await fetchDownloadAsBase64(downloadUrl, signal);
              const ext = extForMime(dlMime);
              const assetName = `generated-${fileId}.${ext}`;
              const bytes = base64ToUint8Array(base64);
              await writeBinaryFile(assetsDir, assetName, bytes);

              const rel = `../assets/${assetName}`;
              if (options.format === 'html') {
                await write(`<div class=\"meta\"><a href=\"${htmlEscape(rel)}\">generated-${htmlEscape(fileId)}</a> (${htmlEscape(dlMime)})</div>\n`);
              } else if (dlMime.startsWith('image/')) {
                await write(`\n- generated file (${dlMime}) fileId=${fileId}\n\n![generated-${fileId}](${rel})\n\n`);
              } else {
                await write(`\n- [generated-${fileId}](${rel}) (${dlMime})\n\n`);
              }
            }
          }
        }

        if (options.format === 'html') await write(`</div>\n`);
        else await write(`---\n\n`);

        await sleep(options.delayMs);
      }

      if (options.format === 'html') await write(`</body>\n</html>\n`);
    });

    indexEntries.push({ ordinal, sessionId, title: session.displayName || displayName, filename });
  }

  async function exportAll(options) {
    const configId = getConfigIdFromUrl();
    if (!configId) throw new Error('No configId found in URL (expected /home/cid/<id>/...)');
    if (!('showDirectoryPicker' in window)) throw new Error('showDirectoryPicker not available in this browser');

    state.aborted = false;
    state.abortController = new AbortController();
    const { signal } = state.abortController;

    const delayMs = Math.max(0, Number(options.delayMs) || 0);
    const pageSize = Math.min(200, Math.max(1, Number(options.pageSize) || 100));

    setProgress(0, 1);
    setStatus('Select output folder…');
    log('Waiting for directory selection…');
    const outputRoot = await window.showDirectoryPicker({ mode: 'readwrite' });

    const exportDirName = `GeminiExport-${nowStamp()}`;
    const exportDir = await ensureDir(outputRoot, exportDirName);
    const sessionsDir = await ensureDir(exportDir, 'sessions');
    const assetsDir = await ensureDir(exportDir, 'assets');

    log(`Output directory: ${exportDirName}`);
    setStatus('Resolving project number…');
    const projectNumber = await getProjectNumber(configId, signal);
    log(`Project number: ${projectNumber}`);

    setStatus('Listing all sessions…');
    const sessions = await listAllSessions(
      {
        configId,
        pageSize,
        filter: options.filter || '',
        orderBy: options.orderBy || 'update_time desc',
        delayMs,
      },
      signal,
    );

    if (!sessions.length) {
      setStatus('No sessions found.');
      log('No sessions found.');
      return;
    }

    setProgress(0, sessions.length);
    log(`Total sessions: ${sessions.length}`);

    const indexEntries = [];
    const failures = [];

    for (let i = 0; i < sessions.length; i++) {
      if (state.aborted) throw new Error('Aborted');
      setProgress(i, sessions.length);
      try {
        await exportOneSession({
          configId,
          projectNumber,
          sessionMeta: sessions[i],
          sessionsDir,
          assetsDir,
          options: { ...options, delayMs },
          signal,
          indexEntries,
          failures,
          ordinal: i + 1,
          total: sessions.length,
        });
      } catch (e) {
        const sessionId = extractSessionId(sessions[i]?.name);
        failures.push({ sessionId, displayName: sessions[i]?.displayName || '', error: String(e) });
        log(`Failed session ${sessionId}: ${String(e)}`);
      }
      await sleep(delayMs);
    }

    setProgress(sessions.length, sessions.length);
    setStatus('Writing index…');

    const meta = {
      exportedAt: new Date().toISOString(),
      origin: location.origin,
      configId,
      projectNumber,
      options: { ...options, pageSize, delayMs },
      exportedCount: indexEntries.length,
      failedCount: failures.length,
    };
    await writeTextFile(exportDir, 'export-meta.json', JSON.stringify(meta, null, 2));
    await writeTextFile(exportDir, 'export-index.json', JSON.stringify(indexEntries, null, 2));
    await writeTextFile(exportDir, 'export-failures.json', JSON.stringify(failures, null, 2));

    if (options.format === 'html') {
      const rows = indexEntries
        .map((e) => `<li><a href=\"sessions/${encodeURIComponent(e.filename)}\">${htmlEscape(e.title)}</a> <span class=\"meta\">(${htmlEscape(e.sessionId)})</span></li>`)
        .join('\n');
      const fails = failures.length
        ? `<h2>Failures</h2><pre>${htmlEscape(JSON.stringify(failures, null, 2))}</pre>`
        : '';
      const html = `<!doctype html><html><head><meta charset=\"utf-8\"/><title>Gemini Export Index</title><style>body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;max-width:900px;margin:24px auto;padding:0 16px} .meta{color:#666;font-size:12px}</style></head><body><h1>Gemini Export Index</h1><div class=\"meta\">exportedAt: ${htmlEscape(meta.exportedAt)}<br/>total: ${indexEntries.length}<br/>failed: ${failures.length}</div><ol>${rows}</ol>${fails}</body></html>`;
      await writeTextFile(exportDir, 'index.html', html);
    } else {
      let md = `# Gemini Export Index\n\n- exportedAt: ${meta.exportedAt}\n- total: ${indexEntries.length}\n- failed: ${failures.length}\n\n`;
      md += indexEntries.map((e) => `- [${e.title}](sessions/${e.filename}) (${e.sessionId})`).join('\n');
      md += '\n\n';
      if (failures.length) {
        md += `## Failures\n\n\`\`\`json\n${JSON.stringify(failures, null, 2)}\n\`\`\`\n`;
      }
      await writeTextFile(exportDir, 'index.md', md);
    }

    setStatus(`Done. Exported ${indexEntries.length}/${sessions.length}. Failed: ${failures.length}.`);
    log(`Done. Exported ${indexEntries.length}/${sessions.length}. Failed: ${failures.length}.`);
  }

  function mountUi() {
    if (document.getElementById(UI.rootId)) return;

    const btn = document.createElement('button');
    btn.id = UI.btnId;
    btn.textContent = 'Export ALL Chats';
    Object.assign(btn.style, {
      position: 'fixed',
      right: '16px',
      bottom: '16px',
      zIndex: 2147483647,
      padding: '10px 12px',
      borderRadius: '12px',
      border: '1px solid rgba(0,0,0,0.15)',
      background: '#111827',
      color: '#fff',
      fontSize: '13px',
      cursor: 'pointer',
      boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
    });

    const root = document.createElement('div');
    root.id = UI.rootId;
    root.hidden = true;
    Object.assign(root.style, {
      position: 'fixed',
      inset: '0',
      zIndex: 2147483647,
      background: 'rgba(0,0,0,0.35)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
    });

    const card = document.createElement('div');
    Object.assign(card.style, {
      width: 'min(860px, 96vw)',
      maxHeight: '92vh',
      overflow: 'auto',
      background: '#fff',
      borderRadius: '16px',
      border: '1px solid rgba(0,0,0,0.12)',
      boxShadow: '0 18px 60px rgba(0,0,0,0.35)',
      padding: '16px',
    });

    const style = (el, obj) => {
      Object.assign(el.style, obj);
      return el;
    };

    const make = (tag, { id, text, html, attrs, styleObj } = {}) => {
      const el = document.createElement(tag);
      if (id) el.id = id;
      if (text != null) el.textContent = String(text);
      if (attrs) {
        for (const [k, v] of Object.entries(attrs)) {
          if (v == null) continue;
          el.setAttribute(k, String(v));
        }
      }
      if (styleObj) style(el, styleObj);
      // Never use innerHTML here: Gemini Enterprise enforces Trusted Types.
      if (html != null) throw new Error('Unexpected html assignment (Trusted Types blocked)');
      return el;
    };

    const header = make('div', {
      styleObj: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        marginBottom: '10px',
      },
    });

    const headerLeft = make('div');
    headerLeft.append(
      make('div', { text: APP_ID, styleObj: { fontWeight: '700', fontSize: '15px' } }),
      make('div', {
        text: 'Exports ALL chats via official internal APIs (no Share links). Shows progress, supports images.',
        styleObj: { color: '#555', fontSize: '12px' },
      }),
    );

    const closeBtn = make('button', {
      id: `${APP_ID}__close`,
      text: 'Close',
      styleObj: {
        padding: '8px 10px',
        borderRadius: '10px',
        border: '1px solid #ddd',
        background: '#fff',
        cursor: 'pointer',
      },
    });
    header.append(headerLeft, closeBtn);

    const grid = make('div', {
      styleObj: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' },
    });

    const makeField = ({ label, child }) => {
      const wrap = make('label', { styleObj: { display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px' } });
      wrap.append(make('span', { text: label }), child);
      return wrap;
    };

    const formatSelect = make('select', { id: `${APP_ID}__format`, styleObj: { padding: '8px', border: '1px solid #ddd', borderRadius: '10px' } });
    formatSelect.append(
      make('option', { text: 'HTML (recommended)', attrs: { value: 'html' } }),
      make('option', { text: 'Markdown', attrs: { value: 'md' } }),
    );

    const imagesSelect = make('select', { id: `${APP_ID}__images`, styleObj: { padding: '8px', border: '1px solid #ddd', borderRadius: '10px' } });
    imagesSelect.append(
      make('option', { text: 'Embed as base64 (single-file per session)', attrs: { value: 'base64' } }),
      make('option', { text: 'Save as files (assets/)', attrs: { value: 'files' } }),
    );

    const includeContextLabel = make('label', { styleObj: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' } });
    const includeContextInput = make('input', { id: `${APP_ID}__include_context`, attrs: { type: 'checkbox' } });
    includeContextInput.checked = true;
    includeContextLabel.append(includeContextInput, make('span', { text: 'Include context files (uploads)' }));

    const pageSizeInput = make('input', {
      id: `${APP_ID}__pagesize`,
      attrs: { type: 'number', min: '1', max: '200', value: '100' },
      styleObj: { padding: '8px', border: '1px solid #ddd', borderRadius: '10px' },
    });

    const delayInput = make('input', {
      id: `${APP_ID}__delay`,
      attrs: { type: 'number', min: '0', max: '5000', value: '150' },
      styleObj: { padding: '8px', border: '1px solid #ddd', borderRadius: '10px' },
    });

    const filterInput = make('input', {
      id: `${APP_ID}__filter`,
      attrs: { type: 'text', value: '', placeholder: 'Leave empty to export ALL (including unnamed/hidden)' },
      styleObj: { padding: '8px', border: '1px solid #ddd', borderRadius: '10px' },
    });

    grid.append(
      makeField({ label: 'Format', child: formatSelect }),
      makeField({ label: 'Images', child: imagesSelect }),
      includeContextLabel,
      makeField({ label: 'Page size (list sessions)', child: pageSizeInput }),
      makeField({ label: 'Delay (ms) between requests', child: delayInput }),
      makeField({ label: 'List filter (advanced)', child: filterInput }),
    );

    const actions = make('div', { styleObj: { display: 'flex', gap: '10px', alignItems: 'center', margin: '14px 0' } });
    const startBtn = make('button', {
      id: `${APP_ID}__start`,
      text: 'Start export',
      styleObj: {
        padding: '10px 12px',
        borderRadius: '12px',
        border: '1px solid #0ea5e9',
        background: '#0ea5e9',
        color: '#fff',
        cursor: 'pointer',
      },
    });
    const cancelBtn = make('button', {
      id: `${APP_ID}__cancel`,
      text: 'Cancel',
      styleObj: {
        padding: '10px 12px',
        borderRadius: '12px',
        border: '1px solid #ef4444',
        background: '#fff',
        color: '#ef4444',
        cursor: 'pointer',
      },
    });
    cancelBtn.disabled = true;
    const spacer = make('div', { styleObj: { flex: '1' } });
    const status = make('div', { id: `${APP_ID}__status`, text: 'Idle', styleObj: { fontSize: '12px', color: '#666' } });
    actions.append(startBtn, cancelBtn, spacer, status);

    const progressRow = make('div', { styleObj: { display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px' } });
    const progress = make('progress', { id: `${APP_ID}__progress`, attrs: { value: '0', max: '1' }, styleObj: { width: '100%' } });
    const progressLabel = make('div', {
      id: `${APP_ID}__progress_label`,
      text: '0/0',
      styleObj: { width: '90px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: '#444', fontSize: '12px' },
    });
    progressRow.append(progress, progressLabel);

    const logBox = make('pre', {
      id: `${APP_ID}__log`,
      text: '',
      styleObj: {
        whiteSpace: 'pre-wrap',
        background: '#0b1020',
        color: '#e6e6e6',
        borderRadius: '12px',
        padding: '12px',
        fontSize: '11px',
        minHeight: '120px',
        maxHeight: '240px',
        overflow: 'auto',
        margin: '0',
      },
    });

    card.append(header, grid, actions, progressRow, logBox);

    root.appendChild(card);
    document.documentElement.appendChild(btn);
    document.documentElement.appendChild(root);

    const close = () => {
      if (state.running) return;
      root.hidden = true;
    };

    btn.addEventListener('click', () => {
      root.hidden = false;
    });

    closeBtn.addEventListener('click', close);
    root.addEventListener('click', (e) => {
      if (e.target === root) close();
    });

    cancelBtn.addEventListener('click', () => {
      if (!state.running) return;
      state.aborted = true;
      state.abortController?.abort();
      log('Cancel requested.');
      setStatus('Cancel requested…');
    });

    startBtn.addEventListener('click', async () => {
      if (state.running) return;
      setRunning(true);
      state.logLines = [];
      log('Starting…');

      const format = formatSelect.value === 'md' ? 'md' : 'html';
      const images = imagesSelect.value === 'files' ? 'files' : 'base64';
      const includeContextFiles = Boolean(includeContextInput.checked);
      const pageSize = Number(pageSizeInput.value || 100);
      const delayMs = Number(delayInput.value || 150);
      const filter = String(filterInput.value || '');

      try {
        await exportAll({
          format,
          embedImagesAsBase64: images === 'base64',
          includeContextFiles,
          pageSize,
          delayMs,
          filter,
        });
      } catch (e) {
        if (state.aborted) {
          setStatus('Canceled.');
          log('Canceled.');
        } else {
          setStatus(`Error: ${String(e)}`);
          log(`Error: ${String(e)}`);
        }
      } finally {
        setRunning(false);
        state.abortController = null;
      }
    });
  }

  mountUi();
})();
