// ==UserScript==
// @name         anki helper-SRT Audio Slicer + CSV Exporter (WAV)
// @namespace   marcpl.tools.srt-audio-slicer
// @version      1.0.0
// @description  Drag in one audio + one SRT → slice WAV clips per timestamps and export UTF-8 CSV for Anki
// @author       Copilot
// @match        *://*/*
// @grant        GM_download
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/550056/anki%20helper-SRT%20Audio%20Slicer%20%2B%20CSV%20Exporter%20%28WAV%29.user.js
// @updateURL https://update.greasyfork.org/scripts/550056/anki%20helper-SRT%20Audio%20Slicer%20%2B%20CSV%20Exporter%20%28WAV%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ---------------------------
  // UI
  // ---------------------------
  GM_addStyle(`
#srt-audio-slicer {
  position: fixed; z-index: 999999; right: 16px; bottom: 16px;
  width: 360px; max-height: 70vh; overflow: auto;
  background: #0f172a; color: #e2e8f0; font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji";
  border: 1px solid #334155; border-radius: 10px; box-shadow: 0 10px 30px rgba(0,0,0,.35);
}
#srt-audio-slicer header {
  display:flex; align-items:center; justify-content:space-between;
  padding: 10px 12px; border-bottom: 1px solid #334155; font-weight: 600;
}
#srt-audio-slicer .body { padding: 12px; }
#srt-audio-slicer .row { margin-bottom: 10px; }
#srt-audio-slicer .dropzone {
  border: 2px dashed #475569; border-radius: 8px; padding: 12px; text-align: center; cursor: pointer;
  background: #0b1220;
}
#srt-audio-slicer .dropzone.dragover { border-color:#22d3ee; background:#07111a; }
#srt-audio-slicer .hint { color:#94a3b8; font-size:12px; margin-top:6px; }
#srt-audio-slicer input[type="text"] {
  width:100%; padding:8px; background:#0b1220; color:#e2e8f0; border:1px solid #334155; border-radius:6px;
}
#srt-audio-slicer button {
  background:#22c55e; color:#0b1220; border:none; padding:10px 12px; border-radius:8px; font-weight:600; cursor:pointer;
}
#srt-audio-slicer button[disabled] { opacity:.5; cursor:not-allowed; }
#srt-audio-slicer .muted { color:#94a3b8; }
#srt-audio-slicer .log {
  background:#0b1220; border:1px solid #334155; border-radius:6px; padding:8px; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; font-size:12px; white-space:pre-wrap; max-height:180px; overflow:auto;
}
#srt-audio-slicer .row.inline { display:flex; gap:8px; align-items:center; }
#srt-audio-slicer .close { background:transparent; color:#94a3b8; border:none; font-size:16px; cursor:pointer; }
  `);

  const el = document.createElement('div');
  el.id = 'srt-audio-slicer';
  el.innerHTML = `
  <header>
    <div>SRT Audio Slicer</div>
    <button class="close" title="Hide">✕</button>
  </header>
  <div class="body">
    <div class="row">
      <div id="dropzone" class="dropzone">
        <div><strong>Drop one audio file + one SRT</strong></div>
        <div class="hint">Or click to choose</div>
      </div>
      <input id="fileInput" type="file" accept=".srt,.wav,.mp3,.m4a,.aac,.flac,.ogg,.webm" multiple style="display:none" />
    </div>

    <div class="row">
      <label class="muted">Output base name</label>
      <input id="basename" type="text" value="clip" />
      <div class="hint">Files will be named like: clip_0001_00m00s000-00m03s200.wav</div>
    </div>

    <div class="row inline">
      <button id="runBtn" disabled>Slice & export</button>
      <div id="status" class="muted">Waiting for files…</div>
    </div>

    <div class="row">
      <div class="log" id="log"></div>
    </div>
  </div>
  `;
  document.documentElement.appendChild(el);

  const $ = (sel) => el.querySelector(sel);
  const logEl = $('#log');

  function log(line) {
    console.log('[SRT Slicer]', line);
    logEl.textContent += (logEl.textContent ? '\n' : '') + line;
    logEl.scrollTop = logEl.scrollHeight;
  }

  $('.close').addEventListener('click', () => el.remove());

  const dropzone = $('#dropzone');
  const fileInput = $('#fileInput');
  const runBtn = $('#runBtn');
  const statusEl = $('#status');
  const basenameEl = $('#basename');

  let audioFile = null;
  let srtFile = null;

  function updateStatus() {
    const parts = [];
    parts.push(audioFile ? `Audio: ${audioFile.name}` : 'Audio: —');
    parts.push(srtFile ? `SRT: ${srtFile.name}` : 'SRT: —');
    statusEl.textContent = parts.join(' | ');
    runBtn.disabled = !(audioFile && srtFile);
  }

  function pickFilesDialog() {
    fileInput.value = '';
    fileInput.click();
  }

  dropzone.addEventListener('click', pickFilesDialog);
  fileInput.addEventListener('change', () => {
    for (const f of fileInput.files) absorbFile(f);
    updateStatus();
  });

  dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.classList.add('dragover');
  });
  dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));
  dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('dragover');
    if (!e.dataTransfer) return;
    for (const f of e.dataTransfer.files) absorbFile(f);
    updateStatus();
  });

  function absorbFile(f) {
    const name = f.name.toLowerCase();
    if (name.endsWith('.srt')) {
      srtFile = f;
      log(`Loaded SRT: ${f.name}`);
    } else if (/\.(wav|mp3|m4a|aac|flac|ogg|webm)$/.test(name)) {
      audioFile = f;
      log(`Loaded audio: ${f.name}`);
    } else {
      log(`Ignored file (unsupported): ${f.name}`);
    }
  }

  // ---------------------------
  // Core
  // ---------------------------

  runBtn.addEventListener('click', async () => {
    try {
      runBtn.disabled = true;
      const base = (basenameEl.value || 'clip').trim();
      if (!base) throw new Error('Invalid base name');

      log('Parsing SRT…');
      const cues = await parseSRTFile(srtFile);
      if (!cues.length) throw new Error('No cues found in SRT');
      log(`Cues: ${cues.length}`);

      log('Decoding audio…');
      const audioData = await audioFile.arrayBuffer();
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const audioBuffer = await audioCtx.decodeAudioData(audioData);
      log(`Audio decoded: ${formatSeconds(audioBuffer.duration)} • ${audioBuffer.numberOfChannels}ch @ ${audioBuffer.sampleRate}Hz`);

      // Guard: ensure timestamps within audio duration
      const duration = audioBuffer.duration;
      const safeCues = cues.map((c, i) => {
        const start = clamp(c.start, 0, duration);
        const end = clamp(c.end, 0, duration);
        if (end < start) {
          log(`Adjusted cue ${i + 1}: end < start, swapping`);
          return { ...c, start: end, end: start, lines: c.lines };
        }
        return { ...c, start, end };
      });

      // Slice + download WAV per cue
      const csvRows = [];
      let digits = String(safeCues.length).length;
      digits = Math.max(3, digits);

      for (let i = 0; i < safeCues.length; i++) {
        const cue = safeCues[i];
        const indexStr = String(i + 1).padStart(digits, '0');
        const stamp = `${fmtStamp(cue.start)}-${fmtStamp(cue.end)}`;
        const fname = sanitizeFilename(`${base}_${indexStr}_${stamp}.wav`);

        const seg = sliceAudioBuffer(audioBuffer, cue.start, cue.end);
        const wavBlob = encodeWAV(seg);

        await downloadBlob(wavBlob, fname);
        log(`Saved: ${fname}`);

        const line1 = cue.lines[0] || '';
        const line2 = cue.lines[1] || '';
        csvRows.push([
          `[sound:${fname}]`,
          line1,
          line2
        ]);
      }

      // Build CSV (UTF-8 with BOM)
      const csvText = buildCSV(csvRows);
      const csvBlob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvText], { type: 'text/csv;charset=utf-8' });
      const csvName = sanitizeFilename(`${base}_segments.csv`);
      await downloadBlob(csvBlob, csvName);
      log(`Exported CSV: ${csvName}`);

      statusEl.textContent = 'Done';
    } catch (err) {
      console.error(err);
      log(`ERROR: ${err.message || err}`);
      statusEl.textContent = 'Failed';
    } finally {
      runBtn.disabled = !(audioFile && srtFile);
    }
  });

  // ---------------------------
  // Utilities
  // ---------------------------

  function clamp(v, a, b) { return Math.min(Math.max(v, a), b); }

  function formatSeconds(sec) {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = Math.floor(sec % 60);
    const ms = Math.floor((sec - Math.floor(sec)) * 1000);
    if (h > 0) return `${h}h ${String(m).padStart(2,'0')}m ${String(s).padStart(2,'0')}s ${String(ms).padStart(3,'0')}ms`;
    return `${m}m ${String(s).padStart(2,'0')}s ${String(ms).padStart(3,'0')}ms`;
  }

  function fmtStamp(sec) {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    const ms = Math.round((sec - Math.floor(sec)) * 1000);
    return `${String(m).padStart(2,'0')}m${String(s).padStart(2,'0')}s${String(ms).padStart(3,'0')}`;
  }

  function sanitizeFilename(name) {
    return name.replace(/[\\/:*?"<>|]+/g, '_').replace(/\s+/g, ' ').trim();
  }

  async function parseSRTFile(file) {
    const text = await file.text();
    return parseSRT(text);
  }

  function parseSRT(s) {
    // Normalize newlines
    const text = s.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim();

    const blocks = text.split(/\n{2,}/);
    const cues = [];

    for (let block of blocks) {
      const lines = block.split('\n').map(l => l.trim());
      if (!lines.length) continue;

      // Some SRTs start with numeric index line
      let i = 0;
      if (/^\d+$/.test(lines[0])) i = 1;

      // Timestamp line
      if (!lines[i] || !/-->/i.test(lines[i])) continue;

      const tsLine = lines[i];
      const [rawStart, rawEnd] = tsLine.split(/-->/i).map(x => x.trim());
      const start = parseSrtTime(rawStart);
      const end = parseSrtTime(rawEnd);

      const subLines = lines.slice(i + 1)
        .map(stripTags)           // remove simple HTML tags
        .map(x => x.replace(/\s+/g, ' ').trim())
        .filter(x => x.length > 0);

      // Expect bilingual: take first two non-empty lines
      const ln1 = subLines[0] || '';
      const ln2 = subLines[1] || '';

      if (Number.isFinite(start) && Number.isFinite(end)) {
        cues.push({ start, end, lines: [ln1, ln2] });
      }
    }
    return cues;
  }

  function stripTags(s) {
    return s.replace(/<[^>]+>/g, '');
  }

  function parseSrtTime(t) {
    // Supports "HH:MM:SS,mmm" or "H:MM:SS.mmm"
    const m = t.match(/(\d{1,2}):(\d{2}):(\d{2})[.,](\d{1,3})/);
    if (!m) return NaN;
    const h = parseInt(m[1], 10);
    const min = parseInt(m[2], 10);
    const sec = parseInt(m[3], 10);
    const ms = parseInt(m[4].padEnd(3, '0'), 10); // normalize to ms
    return h * 3600 + min * 60 + sec + ms / 1000;
  }

  function sliceAudioBuffer(buffer, startSec, endSec) {
    const rate = buffer.sampleRate;
    const channels = buffer.numberOfChannels;

    const start = Math.max(0, Math.floor(startSec * rate));
    const end = Math.max(start, Math.floor(endSec * rate));
    const frames = end - start;

    const out = new AudioBuffer({ length: frames, numberOfChannels: channels, sampleRate: rate });
    for (let ch = 0; ch < channels; ch++) {
      const src = buffer.getChannelData(ch).subarray(start, end);
      out.copyToChannel(src, ch, 0);
    }
    return out;
  }

  function encodeWAV(audioBuffer) {
    const numChannels = audioBuffer.numberOfChannels;
    const sampleRate = audioBuffer.sampleRate;
    const length = audioBuffer.length;

    // Interleave (for stereo) after converting to 16-bit PCM
    const channelData = [];
    for (let ch = 0; ch < numChannels; ch++) {
      channelData.push(audioBuffer.getChannelData(ch));
    }

    // If mono, interleaved == data; if stereo, L R L R...
    const interleaved = (numChannels === 2)
      ? interleave(channelData[0], channelData[1])
      : channelData[0];

    const bytesPerSample = 2; // 16-bit
    const blockAlign = numChannels * bytesPerSample;
    const byteRate = sampleRate * blockAlign;
    const dataSize = interleaved.length * bytesPerSample;
    const buffer = new ArrayBuffer(44 + dataSize);
    const view = new DataView(buffer);

    // RIFF header
    writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + dataSize, true);
    writeString(view, 8, 'WAVE');

    // fmt subchunk
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);       // Subchunk1Size (16 for PCM)
    view.setUint16(20, 1, true);        // AudioFormat (1 = PCM)
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, byteRate, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, 16, true);       // BitsPerSample

    // data subchunk
    writeString(view, 36, 'data');
    view.setUint32(40, dataSize, true);

    // PCM samples
    floatTo16BitPCM(view, 44, interleaved);

    return new Blob([view], { type: 'audio/wav' });

    function writeString(view, offset, str) {
      for (let i = 0; i < str.length; i++) {
        view.setUint8(offset + i, str.charCodeAt(i));
      }
    }

    function interleave(L, R) {
      const len = L.length + R.length;
      const out = new Float32Array(len);
      let i = 0, j = 0;
      while (i < L.length && i < R.length) {
        out[j++] = L[i];
        out[j++] = R[i];
        i++;
      }
      return out;
    }

    function floatTo16BitPCM(view, offset, input) {
      let pos = offset;
      for (let i = 0; i < input.length; i++, pos += 2) {
        let s = Math.max(-1, Math.min(1, input[i]));
        view.setInt16(pos, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
      }
    }
  }

  function buildCSV(rows) {
    const esc = (v) => {
      const s = String(v ?? '');
      if (/[",\n\r]/.test(s)) {
        return '"' + s.replace(/"/g, '""') + '"';
      }
      return s;
    };
    return rows.map(r => r.map(esc).join(',')).join('\r\n') + '\r\n';
  }

  async function downloadBlob(blob, filename) {
    return new Promise((resolve, reject) => {
      // Prefer GM_download to avoid popup blockers
      if (typeof GM_download === 'function') {
        GM_download({
          url: URL.createObjectURL(blob),
          name: filename,
          saveAs: false,
          ontimeout: () => reject(new Error('Download timeout')),
          onerror: (e) => reject(new Error(e && e.error ? e.error : 'Download failed')),
          ontimeout: null,
          onprogress: null,
          onload: () => resolve()
        });
      } else {
        // Fallback: anchor click
        const a = document.createElement('a');
        const url = URL.createObjectURL(blob);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => {
          URL.revokeObjectURL(url);
          resolve();
        }, 100);
      }
    });
  }

})();
