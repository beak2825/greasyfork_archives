// ==UserScript==
// @name         Turbo.ai – Join Dropped Audio Files (Persistent Panel)
// @namespace    local.joiner
// @license MIT
// @version      1.2
// @description  Drag and drop multiple audio files (.m4a, .mp3, .wav, .ogg, etc.) anywhere on https://www.turbo.ai/dashboard to join them client-side and download as one WAV file. Panel auto-restores if the site re-renders.
// @match        https://www.turbo.ai/dashboard*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/554252/Turboai%20%E2%80%93%20Join%20Dropped%20Audio%20Files%20%28Persistent%20Panel%29.user.js
// @updateURL https://update.greasyfork.org/scripts/554252/Turboai%20%E2%80%93%20Join%20Dropped%20Audio%20Files%20%28Persistent%20Panel%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /* ---------- Core Panel ---------- */
  function createPanel() {
    if (document.getElementById('audio-joiner-panel')) return;
    const panel = document.createElement('div');
    panel.id = 'audio-joiner-panel';
    Object.assign(panel.style, {
      position: 'fixed',
      bottom: '12px',
      right: '12px',
      background: '#fff',
      border: '1px solid #ccc',
      boxShadow: '0 4px 10px rgba(0,0,0,.2)',
      padding: '12px',
      zIndex: 2147483647,
      borderRadius: '6px',
      fontFamily: 'system-ui, sans-serif',
      width: '320px'
    });
    panel.innerHTML = `
      <div style="font-weight:600;margin-bottom:6px;">Audio Joiner</div>
      <div id="dropZone" style="border:2px dashed #888;padding:20px;text-align:center;color:#555;cursor:pointer;">
        Drag & Drop audio files here (.m4a, .mp3, .wav, .ogg, etc.)
      </div>
      <div id="status" style="margin-top:8px;font-size:13px;color:#333;"></div>
    `;
    document.body.appendChild(panel);

    const dropZone = panel.querySelector('#dropZone');
    const status = panel.querySelector('#status');

    /* ---------- Helpers ---------- */

    function encodeWAV(interleaved, sampleRate, numChannels) {
      const buffer = new ArrayBuffer(44 + interleaved.length * 2);
      const view = new DataView(buffer);
      const writeStr = (o, s) => { for (let i = 0; i < s.length; i++) view.setUint8(o + i, s.charCodeAt(i)); };
      let off = 0;
      writeStr(off, 'RIFF'); off += 4;
      view.setUint32(off, 36 + interleaved.length * 2, true); off += 4;
      writeStr(off, 'WAVE'); off += 4;
      writeStr(off, 'fmt '); off += 4;
      view.setUint32(off, 16, true); off += 4;
      view.setUint16(off, 1, true); off += 2;
      view.setUint16(off, numChannels, true); off += 2;
      view.setUint32(off, sampleRate, true); off += 4;
      view.setUint32(off, sampleRate * numChannels * 2, true); off += 4;
      view.setUint16(off, numChannels * 2, true); off += 2;
      view.setUint16(off, 16, true); off += 2;
      writeStr(off, 'data'); off += 4;
      view.setUint32(off, interleaved.length * 2, true); off += 4;
      for (let i = 0; i < interleaved.length; i++) {
        const s = Math.max(-1, Math.min(1, interleaved[i]));
        view.setInt16(44 + i * 2, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
      }
      return new Blob([view], { type: 'audio/wav' });
    }

    async function decodeFiles(fileList) {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const buffers = [];
      for (const file of fileList) {
        const ab = await file.arrayBuffer();
        const buf = await ctx.decodeAudioData(ab);
        buffers.push(buf);
      }
      await ctx.close();
      return buffers;
    }

    function concatAudio(buffers) {
      const sr = buffers[0].sampleRate;
      const chs = Math.max(...buffers.map(b => b.numberOfChannels));
      const total = buffers.reduce((s, b) => s + b.length, 0);
      const out = new Float32Array(total * chs);
      let pos = 0;
      for (const b of buffers) {
        for (let i = 0; i < b.length; i++) {
          for (let c = 0; c < chs; c++) {
            const val = b.getChannelData(Math.min(c, b.numberOfChannels - 1))[i];
            out[pos++] = val;
          }
        }
      }
      return { interleaved: out, sampleRate: sr, numChannels: chs };
    }

    function download(blob, name) {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = name;
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 5000);
    }

    /* ---------- Drop Logic ---------- */
    dropZone.addEventListener('dragover', e => {
      e.preventDefault();
      dropZone.style.borderColor = '#0078d7';
    });
    dropZone.addEventListener('dragleave', e => {
      e.preventDefault();
      dropZone.style.borderColor = '#888';
    });
    dropZone.addEventListener('drop', async e => {
      e.preventDefault();
      dropZone.style.borderColor = '#888';
      const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('audio/'));
      if (!files.length) { status.textContent = 'No audio files dropped.'; return; }
      status.textContent = `Processing ${files.length} file(s)...`;
      try {
        const bufs = await decodeFiles(files);
        status.textContent = 'Concatenating...';
        const joined = concatAudio(bufs);
        status.textContent = 'Encoding WAV...';
        const blob = encodeWAV(joined.interleaved, joined.sampleRate, joined.numChannels);
        download(blob, 'joined_' + Date.now() + '.wav');
        status.textContent = 'Download started.';
      } catch (err) {
        console.error(err);
        status.textContent = 'Error: ' + err.message;
      }
    });
  }

  /* ---------- Persistence Watchdog ---------- */
  createPanel();
  const observer = new MutationObserver(() => {
    if (!document.getElementById('audio-joiner-panel')) createPanel();
  });
  observer.observe(document.body, { childList: true, subtree: true });

})();
// ==UserScript==
// @name         Turbo.ai – Join Dropped Audio Files (Persistent Panel)
// @namespace    local.joiner
// @version      1.2
// @description  Drag and drop multiple audio files (.m4a, .mp3, .wav, .ogg, etc.) anywhere on https://www.turbo.ai/dashboard to join them client-side and download as one WAV file. Panel auto-restores if the site re-renders.
// @match        https://www.turbo.ai/dashboard*
// @run-at       document-idle
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  /* ---------- Core Panel ---------- */
  function createPanel() {
    if (document.getElementById('audio-joiner-panel')) return;
    const panel = document.createElement('div');
    panel.id = 'audio-joiner-panel';
    Object.assign(panel.style, {
      position: 'fixed',
      bottom: '12px',
      right: '12px',
      background: '#fff',
      border: '1px solid #ccc',
      boxShadow: '0 4px 10px rgba(0,0,0,.2)',
      padding: '12px',
      zIndex: 2147483647,
      borderRadius: '6px',
      fontFamily: 'system-ui, sans-serif',
      width: '320px'
    });
    panel.innerHTML = `
      <div style="font-weight:600;margin-bottom:6px;">Audio Joiner</div>
      <div id="dropZone" style="border:2px dashed #888;padding:20px;text-align:center;color:#555;cursor:pointer;">
        Drag & Drop audio files here (.m4a, .mp3, .wav, .ogg, etc.)
      </div>
      <div id="status" style="margin-top:8px;font-size:13px;color:#333;"></div>
    `;
    document.body.appendChild(panel);

    const dropZone = panel.querySelector('#dropZone');
    const status = panel.querySelector('#status');

    /* ---------- Helpers ---------- */

    function encodeWAV(interleaved, sampleRate, numChannels) {
      const buffer = new ArrayBuffer(44 + interleaved.length * 2);
      const view = new DataView(buffer);
      const writeStr = (o, s) => { for (let i = 0; i < s.length; i++) view.setUint8(o + i, s.charCodeAt(i)); };
      let off = 0;
      writeStr(off, 'RIFF'); off += 4;
      view.setUint32(off, 36 + interleaved.length * 2, true); off += 4;
      writeStr(off, 'WAVE'); off += 4;
      writeStr(off, 'fmt '); off += 4;
      view.setUint32(off, 16, true); off += 4;
      view.setUint16(off, 1, true); off += 2;
      view.setUint16(off, numChannels, true); off += 2;
      view.setUint32(off, sampleRate, true); off += 4;
      view.setUint32(off, sampleRate * numChannels * 2, true); off += 4;
      view.setUint16(off, numChannels * 2, true); off += 2;
      view.setUint16(off, 16, true); off += 2;
      writeStr(off, 'data'); off += 4;
      view.setUint32(off, interleaved.length * 2, true); off += 4;
      for (let i = 0; i < interleaved.length; i++) {
        const s = Math.max(-1, Math.min(1, interleaved[i]));
        view.setInt16(44 + i * 2, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
      }
      return new Blob([view], { type: 'audio/wav' });
    }

    async function decodeFiles(fileList) {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const buffers = [];
      for (const file of fileList) {
        const ab = await file.arrayBuffer();
        const buf = await ctx.decodeAudioData(ab);
        buffers.push(buf);
      }
      await ctx.close();
      return buffers;
    }

    function concatAudio(buffers) {
      const sr = buffers[0].sampleRate;
      const chs = Math.max(...buffers.map(b => b.numberOfChannels));
      const total = buffers.reduce((s, b) => s + b.length, 0);
      const out = new Float32Array(total * chs);
      let pos = 0;
      for (const b of buffers) {
        for (let i = 0; i < b.length; i++) {
          for (let c = 0; c < chs; c++) {
            const val = b.getChannelData(Math.min(c, b.numberOfChannels - 1))[i];
            out[pos++] = val;
          }
        }
      }
      return { interleaved: out, sampleRate: sr, numChannels: chs };
    }

    function download(blob, name) {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = name;
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 5000);
    }

    /* ---------- Drop Logic ---------- */
    dropZone.addEventListener('dragover', e => {
      e.preventDefault();
      dropZone.style.borderColor = '#0078d7';
    });
    dropZone.addEventListener('dragleave', e => {
      e.preventDefault();
      dropZone.style.borderColor = '#888';
    });
    dropZone.addEventListener('drop', async e => {
      e.preventDefault();
      dropZone.style.borderColor = '#888';
      const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('audio/'));
      if (!files.length) { status.textContent = 'No audio files dropped.'; return; }
      status.textContent = `Processing ${files.length} file(s)...`;
      try {
        const bufs = await decodeFiles(files);
        status.textContent = 'Concatenating...';
        const joined = concatAudio(bufs);
        status.textContent = 'Encoding WAV...';
        const blob = encodeWAV(joined.interleaved, joined.sampleRate, joined.numChannels);
        download(blob, 'joined_' + Date.now() + '.wav');
        status.textContent = 'Download started.';
      } catch (err) {
        console.error(err);
        status.textContent = 'Error: ' + err.message;
      }
    });
  }

  /* ---------- Persistence Watchdog ---------- */
  createPanel();
  const observer = new MutationObserver(() => {
    if (!document.getElementById('audio-joiner-panel')) createPanel();
  });
  observer.observe(document.body, { childList: true, subtree: true });

})();
