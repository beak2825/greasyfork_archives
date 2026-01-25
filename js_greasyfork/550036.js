// ==UserScript==
// @name         FANBOX Post Images Downloader
// @description  Adds a button to download all FANBOX post images as a ZIP archive
// @version      1.0.4
// @author       BreatFR
// @namespace    http://breat.fr
// @homepageURL  https://usercssjs.breat.fr/f/fanbox
// @match        *://*.fanbox.cc/*
// @require      https://cdn.jsdelivr.net/npm/fflate@0.7.4/umd/index.min.js
// @copyright    2025, BreatFR (https://breat.fr)
// @icon         https://breat.fr/static/images/userscripts-et-userstyles/f/fanbox/icon.jpg
// @license      AGPL-3.0-or-later; https://www.gnu.org/licenses/agpl-3.0.txt
// @grant        GM_download
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/550036/FANBOX%20Post%20Images%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/550036/FANBOX%20Post%20Images%20Downloader.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const LOG = '[FANBOX Post Images Downloader]';

  console.log(`${LOG} Script loaded`);

  // =========================
  // CONFIG + MENU
  // =========================
  const DEFAULT_MAX_PART_MB = 500;
  const MAX_PART_MB = Number(GM_getValue('max_part_mb', DEFAULT_MAX_PART_MB));
  const MAX_PART_BYTES = MAX_PART_MB * 1024 * 1024;

  const BASE_LABEL = `Download images<br>(Configurable ${MAX_PART_MB}MB ZIP parts)`;

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
    h1[class*="styled__PostTitle"] {
        align-items: center !important;
        display: inline-flex !important;
        justify-content: space-between !important;
        position: relative !important;
        width: 100% !important;
    }
    .fanbox-download-btn {
      align-items: center;
      background-color: rgba(24, 24, 24, .2);
      border: none;
      border-radius: .5em;
      color: #fff;
      display: inline-flex;
      font-family: poppins, cursive;
      font-size: 1.2rem;
      gap: .5em;
      line-height: 1.5;
      padding: .5em 1em .5em .25em;
      transition: background-color .3s ease, box-shadow .3s ease;
      z-index: 9999;
    }
    .fanbox-download-btn:hover {
      background-color: rgba(255, 80, 80, .85);
      box-shadow: 0 0 2em rgba(255, 80, 80, .85);
    }
    .fanbox-btn-icon{
      font-size: 3em !important;
    }
    .fanbox-btn-icon.spin {
      animation: spinLoop 1s linear infinite;
    }
    @keyframes spinLoop {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
    @keyframes pulseLoop {
      0% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.1); opacity: 0.7; }
      100% { transform: scale(1); opacity: 1; }
    }
    .fanbox-btn-icon.pulse { animation: pulseLoop 1.8s ease-in-out infinite; }

    .fanbox-btn-icon { font-size: 3em; line-height: 1em; }

    #top {
      aspect-ratio: 1 / 1;
      background: transparent;
      border: none;
      bottom: 1em;
      box-sizing: border-box;
      height: auto;
      font-size: 1.2em !important;
      left: 1em;
      line-height: 1 !important;
      padding: 0;
      position: fixed;
      display: none;
      z-index: 9999;
    }
  `;
  document.head.appendChild(style);

  // =========================
  // HELPERS
  // =========================
  function setButtonContent(btn, icon, label) {
    let iconEl = btn.querySelector('.fanbox-btn-icon');
    let labelEl = btn.querySelector('.fanbox-btn-label');

    if (!iconEl) {
      iconEl = document.createElement('div');
      iconEl.className = 'fanbox-btn-icon';
      btn.appendChild(iconEl);
    }
    if (!labelEl) {
      labelEl = document.createElement('div');
      labelEl.className = 'fanbox-btn-label';
      btn.appendChild(labelEl);
    }

    iconEl.textContent = icon;
    labelEl.innerHTML = label;
  }

  function setIconAnimation(btn, type) {
    const icon = btn.querySelector('.fanbox-btn-icon');
    if (!icon) return;
    icon.classList.remove('spin', 'pulse');
    void icon.offsetWidth;
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
  // FANBOX URL CLEANUP
  // =========================
  function cleanFanboxDownloadLink(url) {
    // downloads.fanbox.cc/images/post/<id>/w/1200/<file>  ->  /images/post/<id>/<file>
    return url.replace(
      /https:\/\/downloads\.fanbox\.cc\/images\/post\/(\d+)\/w\/1200\/([^/]+)$/,
      'https://downloads.fanbox.cc/images/post/$1/$2'
    );
  }

  function cleanPixivCoverUrl(url) {
    return url.replace(
      /https:\/\/pixiv\.pximg\.net\/c\/[^/]+\/(fanbox\/public\/images\/post\/\d+\/cover\/[^.]+\.\w+)/,
      'https://pixiv.pximg.net/$1'
    );
  }

  // =========================
  // NETWORK
  // =========================
  function downloadImage(url) {
    console.log(`${LOG} Requesting image: ${url}`);
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

  // HEAD -> Content-Length, fallback Range 0-0 -> Content-Range
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

  function triggerDownloadBlob(filename, blob) {
    const url = URL.createObjectURL(blob);
    try {
      GM_download({
        url,
        name: filename,
        saveAs: true,
        onerror: (err) => console.error(`${LOG} ❌ GM_download error:`, err)
      });
    } finally {
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
    }
  }

  // =========================
  // FANBOX: force lazy load
  // =========================
  async function forceScrollToLoadContent() {
    console.log(`${LOG} Auto-scroll to load lazy images...`);
    const step = 350;
    const delay = 450;

    // scroll down
    const maxScroll = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
    for (let y = 0; y < maxScroll; y += step) {
      window.scrollTo({ top: y, behavior: 'smooth' });
      await new Promise(r => setTimeout(r, delay));
    }

    // small wait + scroll back a bit (some lazy loaders trigger on upward too)
    await new Promise(r => setTimeout(r, 1000));
    window.scrollTo({ top: 0, behavior: 'smooth' });
    await new Promise(r => setTimeout(r, 600));

    console.log(`${LOG} Scroll done`);
  }

  // =========================
  // COVER FIX
  // =========================
  (function () {
    const cleanUrl = location.href.split('?')[0];
    const isPostPage = /^https:\/\/(?:www\.fanbox\.cc\/@[^/]+|[^.]+\.fanbox\.cc)\/posts\/\d+$/.test(cleanUrl);
    if (!isPostPage) return;

    const selector = 'div[class*="Cover__CoverImage"]';

    function cleanPixivCoverUrl(url) {
      return url.replace(
        /https:\/\/pixiv\.pximg\.net\/c\/[^/]+\/(fanbox\/public\/images\/post\/\d+\/cover\/[^.]+\.\w+)/,
        'https://pixiv.pximg.net/$1'
      );
    }

    function transformCoverDiv(div) {
      if (!div || div.tagName !== 'DIV') return;

      // ✅ guard: already handled
      if (div.dataset.fbCoverDone === '1') return;

      const styleAttr = div.getAttribute('style') || '';
      if (!styleAttr.includes('url(')) return;

      const match = styleAttr.match(/url\(["']?(.*?)["']?\)/);
      if (!match) return;

      const rawUrl = match[1];
      if (!rawUrl) return;

      const cleanedUrl = cleanPixivCoverUrl(rawUrl);
      if (!cleanedUrl) return;

      // ✅ If React swaps nodes, avoid breaking: only replace if still in DOM
      if (!div.isConnected) return;

      const link = document.createElement('a');
      link.href = cleanedUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.className = div.className;
      link.style.opacity = '1';

      const img = document.createElement('img');
      img.src = cleanedUrl;
      img.alt = 'Cover';
      img.style.width = '100%';
      img.style.display = 'block';
      img.style.height = 'auto';

      link.appendChild(img);

      // ✅ mark done (on BOTH nodes)
      div.dataset.fbCoverDone = '1';
      link.dataset.fbCoverDone = '1';

      div.replaceWith(link);

      console.log(`${LOG} ✅ Cover replaced: ${cleanedUrl}`);
    }

    const observer = new MutationObserver(() => {
      // ✅ If already replaced, stop
      const already = document.querySelector('a[data-fb-cover-done="1"] img');
      if (already) {
        observer.disconnect();
        return;
      }

      const div = document.querySelector(selector);
      if (!div) return;

      // ✅ Don’t touch if React already wrapped it differently
      if (div.closest('a')) return;

      const styleAttr = div.getAttribute('style') || '';
      if (styleAttr.includes('url(')) {
        transformCoverDiv(div);
        observer.disconnect(); // ✅ replace once and stop
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style']
    });

    // ✅ safety timeout: don't keep observers forever
    setTimeout(() => observer.disconnect(), 15000);
  })();

  // =========================
  // COLLECT IMAGE URLS
  // =========================
  function isImageUrl(href) {
    return href && /\.(jpeg|jpg|png|webp|gif)$/i.test(href);
  }

  function collectImageUrls() {
    const urls = new Set();

    // A) anchors
    for (const a of document.querySelectorAll('a[href]')) {
      const href = a.href;
      if (!href) continue;

      if (href.includes('downloads.fanbox.cc/images/post/')) {
        const cleaned = cleanFanboxDownloadLink(href);
        if (isImageUrl(cleaned)) urls.add(cleaned);
      } else if (href.includes('pixiv.pximg.net/fanbox/public/images/post/')) {
        // cover / inline pixiv image
        const cleaned = cleanPixivCoverUrl(href);
        if (isImageUrl(cleaned)) urls.add(cleaned);
      }
    }

    // B) imgs (sometimes direct)
    for (const img of document.querySelectorAll('img[src]')) {
      const src = img.src;
      if (!src) continue;
      if (src.includes('downloads.fanbox.cc/images/post/')) {
        const cleaned = cleanFanboxDownloadLink(src);
        if (isImageUrl(cleaned)) urls.add(cleaned);
      } else if (src.includes('pixiv.pximg.net/fanbox/public/images/post/')) {
        const cleaned = cleanPixivCoverUrl(src);
        if (isImageUrl(cleaned)) urls.add(cleaned);
      }
    }

    return Array.from(urls);
  }

  function getPostTitleForZip() {
    const h1 = document.querySelector('h1[class*="styled__PostTitle"]');
    if (!h1) return null;

    const clone = h1.cloneNode(true);      // copie du h1
    clone.querySelectorAll('button').forEach(b => b.remove()); // enlève le bouton
    return sanitizeFilename(clone.textContent.trim()) || null;
  }

  // =========================
  // MAIN
  // =========================
  function injectButtonNearTitle() {
    const cleanUrl = location.href.split('?')[0];
    const isPostPage = /^https:\/\/(?:www\.fanbox\.cc\/@[^/]+|[^.]+\.fanbox\.cc)\/posts\/\d+$/.test(cleanUrl);
    if (!isPostPage) return false;

    const titleH1 = document.querySelector('h1[class*="styled__PostTitle"]');
    if (!titleH1) return false;

    // ✅ guard STRICT : bouton déjà dans ce H1
    if (titleH1.querySelector('.fanbox-download-btn')) return true;

    console.log(`${LOG} Injecting download button next to title`);

    const btn = document.createElement('button');
    btn.className = 'fanbox-download-btn';
    btn.innerHTML = `
      <div class="fanbox-btn-icon">📦</div>
      <div class="fanbox-btn-label">${BASE_LABEL}</div>
    `;
    btn.title = `Downloads images as ZIP file(s). Parts are limited to ${MAX_PART_MB}MB (configurable in your userscript manager).`;

    // ✅ IMPORTANT: on met dans le H1
    titleH1.appendChild(btn);

    // ✅ IMPORTANT: colle ICI ton handler click actuel (ton gros bloc)
    btn.addEventListener('click', async () => {
      btn.disabled = true;
      updateIconWithAnimation(btn, '🌀', 'Scrolling to load images...', 'spin');

      try {
        await forceScrollToLoadContent();

        updateIconWithAnimation(btn, '🔎', 'Collecting image links...', 'pulse');
        const anchors = collectImageUrls();

        console.log(`${LOG} Found ${anchors.length} image link(s)`, anchors);

        if (anchors.length === 0) {
          alert('No FANBOX image links found.');
          return;
        }

        const zipBaseName = getPostTitleForZip() || 'fanbox-post';

        updateIconWithAnimation(btn, '🧮', `Estimating total size (0/${anchors.length})...`, 'spin');

        let totalBytes = 0;
        let unknownCount = 0;

        for (let i = 0; i < anchors.length; i++) {
          const size = await getRemoteSizeBytes(anchors[i]);
          if (typeof size === 'number' && isFinite(size)) {
            totalBytes += size;
            console.log(`${LOG} Size estimate ${i + 1}/${anchors.length}: ${(size / 1024 / 1024).toFixed(2)} MB`);
          } else {
            unknownCount++;
            console.warn(`${LOG} Size unknown for image ${i + 1}/${anchors.length}`);
          }
          updateIconWithAnimation(btn, '🧮', `Estimating total size (${i + 1}/${anchors.length})...`, 'spin');
        }

        if (unknownCount) console.warn(`${LOG} ⚠️ ${unknownCount} image(s) without size info. Total is a partial estimate.`);

        const splitMode = totalBytes > MAX_PART_BYTES;
        const totalMB = (totalBytes / 1024 / 1024).toFixed(1);

        updateIconWithAnimation(btn, '✅', splitMode ? `Total ~${totalMB}MB → SPLIT` : `Total ~${totalMB}MB → Single ZIP`, null);

        await new Promise(r => setTimeout(r, 400));

        let batchFiles = {};
        let batchBytes = 0;
        let part = 1;
        let okCount = 0;
        let failCount = 0;

        function flushBatch() {
          if (!Object.keys(batchFiles).length) return;

          const zipped = fflate.zipSync(batchFiles);
          const blob = new Blob([zipped], { type: 'application/zip' });

          const filename = splitMode ? `${zipBaseName}.part${pad3(part)}.zip` : `${zipBaseName}.zip`;
          triggerDownloadBlob(filename, blob);

          console.log(`${LOG} ✅ Created ${filename} (${(blob.size / 1024 / 1024).toFixed(2)}MB)`);

          batchFiles = {};
          batchBytes = 0;
          if (splitMode) part++;
        }

        updateIconWithAnimation(btn, '🌀', 'Downloading images...', 'spin');

        for (let i = 0; i < anchors.length; i++) {
          const url = anchors[i];
          const rawName = (url.split('/').pop() || '').split('?')[0];
          const ext = rawName.includes('.') ? rawName.split('.').pop().toLowerCase() : 'jpg';

          const randomName = `${generateRandomHex()}.${ext}`;
          let finalName = randomName;

          try {
            const { blob } = await downloadImage(url);
            if (!blob || blob.size === 0) { failCount++; continue; }

            console.log(`${LOG} Downloaded blob: ${(blob.size / 1024 / 1024).toFixed(2)} MB`);

            let uint8;

            if (ext === 'png') {
              try {
                const img = await loadImageFromBlob(blob);
                if (!hasTransparency(img)) {
                  const jpegDataUrl = convertToJPEG(img);
                  const jpegBlob = await (await fetch(jpegDataUrl)).blob();
                  uint8 = await blobToUint8Array(jpegBlob);
                  finalName = randomName.replace(/\.png$/i, '.jpg');
                } else {
                  uint8 = await blobToUint8Array(blob);
                }
              } catch (e) {
                console.warn(`${LOG} Transparency check failed for ${randomName}`, e);
                uint8 = await blobToUint8Array(blob);
              }
            } else {
              uint8 = await blobToUint8Array(blob);
            }

            if (url.includes('pixiv.pximg.net/fanbox/public/images/post/')) {
              const extFinal = finalName.split('.').pop().toLowerCase();
              finalName = `cover.${extFinal}`;
            }

            console.log(`${LOG} Final image size: ${(uint8.byteLength / 1024 / 1024).toFixed(2)} MB`);

            if (splitMode && batchBytes + uint8.byteLength > MAX_PART_BYTES && Object.keys(batchFiles).length) flushBatch();

            batchFiles[finalName] = uint8;
            batchBytes += uint8.byteLength;
            okCount++;

            updateIconWithAnimation(
              btn,
              '📥',
              splitMode
                ? `Downloaded ${okCount}/${anchors.length} • part ${pad3(part)} ~${Math.round(batchBytes / 1024 / 1024)}MB`
                : `Downloaded ${okCount}/${anchors.length} • zip ~${Math.round(batchBytes / 1024 / 1024)}MB`,
              'pulse'
            );

          } catch (e) {
            failCount++;
            if (String(e?.message || '').toLowerCase().includes('quota')) {
              console.warn(`${LOG} Quota reached, aborting download.`);
              updateIconWithAnimation(btn, '⏳', 'Quota reached, try again later', null);
              break;
            }
            console.warn(`${LOG} Failed to download ${url}`, e);
          }
        }

        if (Object.keys(batchFiles).length) flushBatch();

        console.log(`${LOG} Done: ${okCount} image(s), estimated total ~${(totalBytes / 1024 / 1024).toFixed(2)} MB, split=${splitMode}, unknownSizes=${unknownCount}`);

        updateIconWithAnimation(
          btn,
          '✅',
          splitMode ? `${okCount} images saved in ${part - 1} ZIP part(s)` : `${okCount} images saved in 1 ZIP`,
          null
        );

        if (failCount) console.warn(`${LOG} Done with ${failCount} failure(s).`);

      } catch (e) {
        console.error(`${LOG} ❌ Fatal error:`, e);
        alert('Download failed. Check console for details.');
      } finally {
        setTimeout(() => {
          updateIconWithAnimation(btn, '📦', BASE_LABEL, null);
          btn.disabled = false;
        }, 2000);
      }
    });

    return true;
  }

  // 1) tentative immédiate
  injectButtonNearTitle();

  // 2) fallback: retry loop (au cas où le H1 arrive tard)
  (function retryInject(retries = 200) {
    let tries = 0;
    const t = setInterval(() => {
      if (injectButtonNearTitle() || ++tries >= retries) clearInterval(t);
    }, 250);
  })();

  // 3) React: observer (si React détruit/recrée le H1, on ré-injecte)
  (function observeReinjection() {
    const obs = new MutationObserver(() => {
      injectButtonNearTitle();
    });
    obs.observe(document.body, { childList: true, subtree: true });
  })();

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
