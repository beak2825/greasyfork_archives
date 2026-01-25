// ==UserScript==
// @name         Patreon Post Images Downloader
// @description  Adds a button to download all Patreon post images as ZIP (optionally split into parts)
// @version      1.0.2
// @author       BreatFR
// @namespace    http://breat.fr
// @homepageURL  https://usercssjs.breat.fr/p/patreon
// @supportURL   https://discord.gg/Q8KSHzdBxs
// @match        *://*.patreon.com/*
// @require      https://cdn.jsdelivr.net/npm/fflate@0.7.4/umd/index.min.js
// @copyright    2025, BreatFR (https://breat.fr)
// @icon         https://breat.fr/static/images/userscripts-et-userstyles/p/patreon/icon.jpg
// @license      AGPL-3.0-or-later; https://www.gnu.org/licenses/agpl-3.0.txt
// @grant        GM_download
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/550220/Patreon%20Post%20Images%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/550220/Patreon%20Post%20Images%20Downloader.meta.js
// ==/UserScript==

/* ==Credits==
Website         https://breat.fr
Bluesky			https://bsky.app/profile/breatfroff.bsky.social
facebook        https://www.facebook.com/breatfroff
mastodon        https://mastodon.social/@breat_fr
telegram        https://t.me/breatfr
vk              https://vk.com/breatfroff
X (twitter)     https://x.com/breatfroff
==/Credits== */

/* ==Support==
brave Creators  https://publishers.basicattentiontoken.org/c/breatfr
Buy me a coffee https://buymeacoffee.com/breatfr
ko-fi           https://ko-fi.com/breatfr
PayPal          https://paypal.me/breat
==/Support== */

(function () {
  'use strict';

  const LOG_PREFIX = '[Patreon Post Images Downloader]';

  console.log(`${LOG_PREFIX} Script loaded`);

  // =========================
  // CONFIG
  // =========================
  const DEFAULT_MAX_PART_MB = 500;
  const MAX_PART_MB = Number(GM_getValue('max_part_mb', DEFAULT_MAX_PART_MB));
  const MAX_PART_BYTES = MAX_PART_MB * 1024 * 1024;

  // =========================
  // MENU
  // =========================
  GM_registerMenuCommand(`Set max ZIP part size (current: ${MAX_PART_MB} MB)`, () => {
    const input = prompt('Max size per ZIP part (MB):', String(MAX_PART_MB));
    if (input == null) return;

    const n = Number(input);
    if (!Number.isFinite(n) || n < 10) {
      alert('Please enter a number >= 10 (MB).');
      return;
    }

    GM_setValue('max_part_mb', Math.round(n));
    alert(`Saved: ${Math.round(n)} MB\nReload the page to apply.`);
  });

  // =========================
  // STYLES
  // =========================
  const style = document.createElement('style');
  style.textContent = `
    .patreon-download-btn {
      align-items: center;
      background-color: rgba(24, 24, 24, .2);
      border: none;
      border-radius: .5em;
      color: #fff;
      cursor: pointer;
      display: inline-flex;
      flex-direction: column;
      font-family: poppins, cursive;
      font-size: 1.5rem !important;
      line-height: 1em;
      gap: 1em;
      justify-content: center;
      padding: .5em 1em;
      pointer-events: auto;
      transition: background-color .3s ease, box-shadow .3s ease;
      white-space: nowrap;
    }
    .patreon-download-btn:hover {
      background-color: rgba(255, 80, 80, .85);
      box-shadow: 0 0 2em rgba(255, 80, 80, .85);
    }
    @keyframes spinLoop { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    .patreon-btn-icon.spin { animation: spinLoop 1s linear infinite; }

    @keyframes pulseLoop {
      0%   { transform: scale(1); opacity: 1; }
      50%  { transform: scale(1.1); opacity: 0.7; }
      100% { transform: scale(1); opacity: 1; }
    }
    .patreon-btn-icon.pulse { animation: pulseLoop 1.8s ease-in-out infinite; }

    .patreon-btn-icon { font-size: 3em !important; line-height: 1em; }

    #top {
      aspect-ratio: 1 / 1;
      background: transparent;
      border: none;
      bottom: 1em;
      box-sizing: border-box;
      height: auto;
      font-size: 1.2em !important;
      line-height: 1 !important;
      padding: 0;
      position: fixed;
      right: 1em;
      display: none;
    }

    div[elementtiming="Post : Post Title"] { position: relative; }
  `;
  document.head.appendChild(style);

  // =========================
  // HELPERS
  // =========================
  function setButtonContent(btn, icon, label) {
    let iconEl = btn.querySelector('.patreon-btn-icon');
    let labelEl = btn.querySelector('.patreon-btn-label');

    if (!iconEl) {
      iconEl = document.createElement('div');
      iconEl.className = 'patreon-btn-icon';
      btn.appendChild(iconEl);
    }
    if (!labelEl) {
      labelEl = document.createElement('div');
      labelEl.className = 'patreon-btn-label';
      btn.appendChild(labelEl);
    }

    iconEl.textContent = icon;
    labelEl.textContent = label;
  }

  function setIconAnimation(btn, type) {
    const icon = btn.querySelector('.patreon-btn-icon');
    if (!icon) return;
    icon.classList.remove('spin', 'pulse');
    void icon.offsetWidth; // restart animation
    if (type) icon.classList.add(type);
  }

  function updateIconWithAnimation(btn, icon, label, animationClass) {
    setButtonContent(btn, icon, label);
    requestAnimationFrame(() => setIconAnimation(btn, animationClass));
  }

  function pad3(n) { return String(n).padStart(3, '0'); }

  function sanitizeFilename(name) {
    return (name ?? '')
      .replace(/[\\/:*?"<>|]/g, '_')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function generateRandomHex(length = 8) {
    return [...crypto.getRandomValues(new Uint8Array(length / 2))]
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  function blobToUint8Array(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(new Uint8Array(reader.result));
      reader.onerror = reject;
      reader.readAsArrayBuffer(blob);
    });
  }

  function loadImageFromBlob(blob) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = URL.createObjectURL(blob);
    });
  }

  function hasTransparency(img) {
    // NOTE: full-res scan can be heavy on huge images; kept as-is since you had it.
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] < 255) return true;
    }
    return false;
  }

  function convertToJPEG(img) {
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    return canvas.toDataURL('image/jpeg', 1.0);
  }

  // =========================
  // NETWORK
  // =========================
  function downloadImage(url) {
    console.log(`${LOG_PREFIX} Requesting image: ${url}`);
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'GET',
        url,
        responseType: 'blob',
        onload: (response) => {
          if (response.status === 200 && response.response?.size > 0) {
            resolve({ blob: response.response });
          } else {
            reject(new Error(`Download failed or empty blob for ${url}`));
          }
        },
        onerror: reject
      });
    });
  }

  // HEAD -> Content-Length, fallback GET Range 0-0 -> Content-Range
  function getRemoteSizeBytes(url) {
    return new Promise((resolve) => {
      GM_xmlhttpRequest({
        method: 'HEAD',
        url,
        onload: (resp) => {
          const headers = (resp.responseHeaders || '').toLowerCase();
          const m = headers.match(/content-length:\s*(\d+)/i);
          if (m) return resolve(Number(m[1]));

          GM_xmlhttpRequest({
            method: 'GET',
            url,
            headers: { Range: 'bytes=0-0' },
            onload: (r2) => {
              const h2 = (r2.responseHeaders || '').toLowerCase();
              const cr = h2.match(/content-range:\s*bytes\s+\d+-\d+\/(\d+)/i);
              if (cr) return resolve(Number(cr[1]));
              resolve(null);
            },
            onerror: () => resolve(null)
          });
        },
        onerror: () => resolve(null)
      });
    });
  }

  // Do not wait for GM_download.onload (often unreliable in script managers).
  function triggerDownloadBlob(filename, blob) {
    const url = URL.createObjectURL(blob);
    try {
      GM_download({
        url,
        name: filename,
        saveAs: true,
        onerror: (err) => console.error(`${LOG_PREFIX} ❌ GM_download error:`, err)
      });
    } finally {
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
    }
  }

  // =========================
  // LIGHTBOX FULL SIZE URL
  // =========================
  async function getFullSizeFromLightbox(img) {
    img.scrollIntoView({ behavior: 'smooth', block: 'center' });
    img.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));

    if (!document.getElementById('patreon-lightbox-mask')) {
      const maskStyle = document.createElement('style');
      maskStyle.id = 'patreon-lightbox-mask';
      maskStyle.textContent = `
        [data-focus-lock-disabled="false"],
        [data-focus-lock-disabled="false"] * {
          opacity: 0 !important;
          pointer-events: none !important;
          visibility: hidden !important;
          transition: opacity 0.3s ease !important;
        }
      `;
      document.head.appendChild(maskStyle);
      console.log(`${LOG_PREFIX} 🫥 Lightbox mask injected`);
    }

    await new Promise(r => setTimeout(r, 100));

    const timeout = 3000;
    const start = Date.now();
    let fullImg = null;

    while (Date.now() - start < timeout) {
      fullImg = document.querySelector('[data-target="lightbox-content"] img');
      if (fullImg?.src) break;
      await new Promise(r => setTimeout(r, 100));
    }

    const closeBtn = document.querySelector('button[data-tag="close"]');
    if (closeBtn) {
      closeBtn.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
      console.log(`${LOG_PREFIX} 🧯 Lightbox closed`);
    }

    return fullImg?.src || null;
  }

  // =========================
  // MAIN BUTTON LOGIC
  // =========================
  function addDownloadButton(btn) {
    btn.addEventListener('click', async () => {
      btn.disabled = true;
      updateIconWithAnimation(btn, '🌀', 'Collecting image URLs...', 'spin');

      const rawImages = Array.from(document.querySelectorAll('.image-grid > img, .image-carousel > img'));
      console.log(`${LOG_PREFIX} 🎯 Targeted: ${rawImages.length} image(s)`);

      const titleElement = document.querySelector('[data-tag="post-card"] div[elementtiming="Post : Post Title"]');
      const rawTitle = titleElement?.textContent?.trim();
      const zipBaseName = sanitizeFilename(rawTitle) || 'patreon-post';

      const seen = new Set();
      const urls = [];

      try {
        // 1) Collect full-size URLs (lightbox)
        for (let i = 0; i < rawImages.length; i++) {
          const img = rawImages[i];
          const fullSize = await getFullSizeFromLightbox(img);
          const finalUrl = fullSize || img.src;
          if (!finalUrl || seen.has(finalUrl)) continue;
          seen.add(finalUrl);
          urls.push(finalUrl);

          updateIconWithAnimation(btn, '🔎', `Found ${urls.length} image(s)...`, 'pulse');
        }

        if (!urls.length) {
          alert('No images found.');
          return;
        }

        // 2) Estimate TOTAL size (HEAD / Range)
        updateIconWithAnimation(btn, '🧮', `Estimating total size (0/${urls.length})...`, 'spin');

        let totalBytes = 0;
        let unknownCount = 0;

        for (let i = 0; i < urls.length; i++) {
          const size = await getRemoteSizeBytes(urls[i]);

          if (typeof size === 'number' && isFinite(size)) {
            totalBytes += size;
            console.log(`${LOG_PREFIX} Size estimate ${i + 1}/${urls.length}: ${(size / 1024 / 1024).toFixed(2)} MB`);
          } else {
            unknownCount++;
            console.warn(`${LOG_PREFIX} Size unknown for image ${i + 1}/${urls.length}`);
          }

          updateIconWithAnimation(btn, '🧮', `Estimating total size (${i + 1}/${urls.length})...`, 'spin');
        }

        // Decision:
        // - strict: split only if estimated total > limit
        // - if sizes are unknown, we still DON'T force split automatically (keeps your original intent).
        const splitMode = totalBytes > MAX_PART_BYTES;

        if (unknownCount) {
          console.warn(`${LOG_PREFIX} ⚠️ ${unknownCount} image(s) without size info. Total is a partial estimate.`);
        }

        const totalMB = (totalBytes / 1024 / 1024).toFixed(1);
        updateIconWithAnimation(
          btn,
          '✅',
          splitMode ? `Total ~${totalMB}MB → SPLIT` : `Total ~${totalMB}MB → Single ZIP`,
          null
        );

        await new Promise(r => setTimeout(r, 400));

        // 3) Download & zip
        let batchFiles = {};
        let batchBytes = 0;
        let part = 1;
        let okCount = 0;
        let failCount = 0;

        function flushBatch() {
          const keys = Object.keys(batchFiles);
          if (!keys.length) return;

          const zipped = fflate.zipSync(batchFiles);
          const blob = new Blob([zipped], { type: 'application/zip' });

          const filename = splitMode
            ? `${zipBaseName}.part${pad3(part)}.zip`
            : `${zipBaseName}.zip`;

          triggerDownloadBlob(filename, blob);

          console.log(`${LOG_PREFIX} ✅ Created ${filename} (${(blob.size / 1024 / 1024).toFixed(2)}MB)`);

          batchFiles = {};
          batchBytes = 0;
          if (splitMode) part++;
        }

        updateIconWithAnimation(btn, '🌀', 'Downloading images...', 'spin');

        for (let i = 0; i < urls.length; i++) {
          const finalUrl = urls[i];

          const rawName = (finalUrl.split('/').pop() || '');
          const baseName = rawName.split('?')[0];
          const ext = baseName.includes('.') ? baseName.split('.').pop().toLowerCase() : 'jpg';
          const filename = `${generateRandomHex()}.${ext}`;

          try {
            const { blob } = await downloadImage(finalUrl);
            if (!blob || blob.size === 0) { failCount++; continue; }

            console.log(`${LOG_PREFIX} Downloaded blob: ${(blob.size / 1024 / 1024).toFixed(2)} MB`);

            let uint8;
            let finalFilename = filename;

            if (ext === 'png') {
              try {
                const imgEl = await loadImageFromBlob(blob);
                if (!hasTransparency(imgEl)) {
                  const jpegDataUrl = convertToJPEG(imgEl);
                  const jpegBlob = await (await fetch(jpegDataUrl)).blob();
                  uint8 = await blobToUint8Array(jpegBlob);
                  finalFilename = filename.replace(/\.png$/i, '.jpg');
                } else {
                  uint8 = await blobToUint8Array(blob);
                }
              } catch (e) {
                console.warn(`${LOG_PREFIX} Transparency check failed for ${filename}`, e);
                uint8 = await blobToUint8Array(blob);
              }
            } else {
              uint8 = await blobToUint8Array(blob);
            }

            console.log(`${LOG_PREFIX} Final image size: ${(uint8.byteLength / 1024 / 1024).toFixed(2)} MB`);

            if (splitMode && batchBytes + uint8.byteLength > MAX_PART_BYTES && Object.keys(batchFiles).length) {
              flushBatch();
            }

            batchFiles[finalFilename] = uint8;
            batchBytes += uint8.byteLength;
            okCount++;

            updateIconWithAnimation(
              btn,
              '📥',
              splitMode
                ? `Downloaded ${okCount}/${urls.length} • part ${pad3(part)} ~${Math.round(batchBytes / 1024 / 1024)}MB`
                : `Downloaded ${okCount}/${urls.length} • zip ~${Math.round(batchBytes / 1024 / 1024)}MB`,
              'pulse'
            );

          } catch (e) {
            failCount++;
            console.warn(`${LOG_PREFIX} Failed to download ${finalUrl}`, e);
          }
        }

        // flush final
        if (Object.keys(batchFiles).length) flushBatch();

        console.log(
          `${LOG_PREFIX} Done: ${okCount} image(s), estimated total ~${(totalBytes / 1024 / 1024).toFixed(2)} MB, ` +
          `split=${splitMode}, unknownSizes=${unknownCount}`
        );

        updateIconWithAnimation(
          btn,
          '✅',
          splitMode
            ? `${okCount} images saved in ${part - 1} ZIP part(s)`
            : `${okCount} images saved in 1 ZIP`,
          null
        );

        if (failCount) console.warn(`${LOG_PREFIX} Done with ${failCount} failure(s).`);

      } catch (e) {
        console.error(`${LOG_PREFIX} ❌ Fatal error:`, e);
        alert('Download failed. Check console for details.');
      } finally {
        setTimeout(() => {
          document.getElementById('patreon-lightbox-mask')?.remove();
          console.log(`${LOG_PREFIX} 🧼 Lightbox mask removed`);
          updateIconWithAnimation(btn, '📦', 'Download all post images', null);
          btn.disabled = false;
        }, 1500);
      }
    });
  }

  // =========================
  // INJECT BUTTON
  // =========================
  function waitForTitleAndInjectButton(retries = 20) {
    const isPostPage = location.pathname.startsWith('/posts/');
    if (!isPostPage) return;

    const tryInject = () => {
      const titleDiv = document.querySelector('[data-tag="post-card"] div[elementtiming="Post : Post Title"]');
      if (titleDiv && titleDiv.parentNode) {
        const h1 = titleDiv.parentNode;
        h1.style.alignItems = 'flex-start';
        h1.style.display = 'flex';
        h1.style.flexDirection = 'column';
        h1.style.gap = '.2em';
        h1.style.position = 'relative';

        if (!h1.querySelector('.patreon-download-btn')) {
          const btn = document.createElement('button');
          btn.className = 'patreon-download-btn';
          btn.innerHTML = `
            <div class="patreon-btn-icon">📦</div>
            <div class="patreon-btn-label">Download all post images<br>(Configurable ${MAX_PART_MB}MB ZIP parts)</div>
          `;
          // Tooltip short + helpful
          btn.title = `Downloads images as ZIP file(s). Parts are limited to ${MAX_PART_MB}MB (configurable in your userscript manager).`;

          h1.appendChild(btn);
          addDownloadButton(btn);
        }
        return true;
      }
      return false;
    };

    let attempts = 0;
    const interval = setInterval(() => {
      if (tryInject() || ++attempts >= retries) clearInterval(interval);
    }, 300);
  }

  waitForTitleAndInjectButton();

  // =========================
  // BACK TO TOP
  // =========================
  const topBtn = document.createElement('button');
  topBtn.id = 'top';
  topBtn.setAttribute('aria-label', 'Scroll to top');
  topBtn.setAttribute('title', 'Scroll to top');
  setButtonContent(topBtn, '🔝', '');
  document.body.appendChild(topBtn);

  window.addEventListener('scroll', () => {
    const show = document.body.scrollTop > 20 || document.documentElement.scrollTop > 20;
    topBtn.style.display = show ? 'block' : 'none';
  });

  topBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();
