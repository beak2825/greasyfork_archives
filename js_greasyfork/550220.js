// ==UserScript==
// @name         Patreon Post Images Downloader
// @description  Adds a button to download all Patreon post images as a ZIP archive
// @version      1.0.0
// @author       BreatFR
// @namespace    http://gitlab.com/breatfr
// @match        *://*.patreon.com/*
// @require      https://cdn.jsdelivr.net/npm/fflate@0.7.4/umd/index.min.js
// @copyright    2025, BreatFR (https://breat.fr)
// @icon         https://c5.patreon.com/external/favicon/rebrand/pwa-192.png
// @license      AGPL-3.0-or-later; https://www.gnu.org/licenses/agpl-3.0.txt
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/550220/Patreon%20Post%20Images%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/550220/Patreon%20Post%20Images%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('[Patreon Post Images Downloader] Script loaded');

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
        @keyframes spinLoop {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        .patreon-btn-icon.spin {
            animation: spinLoop 1s linear infinite;
        }
        @keyframes pulseLoop {
            0%   { transform: scale(1); opacity: 1; }
            50%  { transform: scale(1.1); opacity: 0.7; }
            100% { transform: scale(1); opacity: 1; }
        }
        .patreon-btn-icon.pulse {
            animation: pulseLoop 1.8s ease-in-out infinite;
        }
        .patreon-btn-icon {
            font-size: 3em !important;
            line-height: 1em;
        }
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
        }
        div[elementtiming="Post : Post Title"] {
            position: relative;
        }
    `;
    document.head.appendChild(style);

    // Download button
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
      icon.classList.remove('spin', 'pulse');
      void icon.offsetWidth;
      if (type) icon.classList.add(type);
    }

    function updateIconWithAnimation(btn, icon, label, animationClass) {
      setButtonContent(btn, icon, label);
      requestAnimationFrame(() => setIconAnimation(btn, animationClass));
    }

    async function getFullSizeFromLightbox(img) {
      img.scrollIntoView({ behavior: 'smooth', block: 'center' });
      img.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));

      if (!document.getElementById('patreon-lightbox-mask')) {
        const style = document.createElement('style');
        style.id = 'patreon-lightbox-mask';
        style.textContent = `
          [data-focus-lock-disabled="false"],
          [data-focus-lock-disabled="false"] * {
            opacity: 0 !important;
            pointer-events: none !important;
            visibility: hidden !important;
            transition: opacity 0.3s ease !important;
          }
        `;
        document.head.appendChild(style);
        console.log('[Patreon Collector] 🫥 Lightbox mask injected');
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
        console.log('[Patreon Collector] 🧯 Lightbox closed');
      }

      return fullImg?.src || null;
    }

    function downloadImage(url) {
      console.log(`[Patreon Collector] Requesting image: ${url}`);
      return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
          method: 'GET',
          url: url,
          responseType: 'blob',
          onload: function(response) {
            if (response.status === 200 && response.response.size > 0) {
              resolve({ blob: response.response });
            } else {
              reject(new Error(`Download failed or empty blob for ${url}`));
            }
          },
          onerror: reject
        });
      });
    }

    function blobToUint8Array(blob) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(new Uint8Array(reader.result));
        reader.onerror = reject;
        reader.readAsArrayBuffer(blob);
      });
    }

    function addDownloadButton(btn) {
      btn.addEventListener('click', async () => {
        btn.disabled = true;
        updateIconWithAnimation(btn, '🌀', 'Collecting full-size images...', 'spin');

        const rawImages = Array.from(document.querySelectorAll('.image-grid > img, .image-carousel > img'));
        console.log(`[Patreon Collector] 🎯 Ciblé : ${rawImages.length} image(s) dans .image-grid ou .image-carousel`);

        const files = {};
        const seen = new Set();
        let index = 1;

        for (const img of rawImages) {
          const fullSize = await getFullSizeFromLightbox(img);
          const finalUrl = fullSize || img.src;
          if (!finalUrl || seen.has(finalUrl)) continue;
          seen.add(finalUrl);

          const rawName = finalUrl.split('/').pop();
          const baseName = rawName.split('?')[0];
          function generateRandomHex(length = 8) {
            return [...crypto.getRandomValues(new Uint8Array(length / 2))]
              .map(b => b.toString(16).padStart(2, '0'))
              .join('');
          }
          const ext = baseName.includes('.') ? baseName.split('.').pop() : 'jpg';
          const filename = `${generateRandomHex()}.${ext}`;

          try {
              const { blob } = await downloadImage(finalUrl);
              if (!blob || blob.size === 0) continue;

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
                    console.log(`[Patreon Collector] Converted PNG to JPEG: ${finalFilename}`);
                  } else {
                    uint8 = await blobToUint8Array(blob);
                    console.log(`[Patreon Collector] PNG with transparency kept: ${filename}`);
                  }
                } catch (e) {
                  console.warn(`[Patreon Collector] Transparency check failed for ${filename}`, e);
                  uint8 = await blobToUint8Array(blob); // fallback
                }
              } else {
                uint8 = await blobToUint8Array(blob);
              }

              files[finalFilename] = uint8;
              updateIconWithAnimation(btn, '📥', `Downloading image ${Object.keys(files).length}/${rawImages.length / 2}`, 'pulse');
              index++;
            } catch (e) {
              console.warn(`[Patreon Collector] Failed to download ${finalUrl}`, e);
            }
        }

        if (index === 1) {
          alert('All image downloads failed.');
          const mask = document.getElementById('patreon-lightbox-mask');
          if (mask) mask.remove();
          btn.disabled = false;
          updateIconWithAnimation(btn, '📦', 'Download all post images', null);
          return;
        }

        updateIconWithAnimation(btn, '📦', `Creating ZIP (${index - 1} images)...`, null);

        try {
            const zipped = fflate.zipSync(files);
            const blob = new Blob([zipped], { type: 'application/zip' });

            const titleElement = document.querySelector('[data-tag="post-card"] div[elementtiming="Post : Post Title"]');
            const zipName = titleElement ? titleElement.textContent.trim().replace(/[\\/:*?"<>|]/g, '_') : 'patreon_images';

            GM_download({
              url: URL.createObjectURL(blob),
              name: `${zipName}.zip`,
              saveAs: true,
              onerror: err => {
                console.error('[Patreon Collector] ❌ GM_download failed:', err);
                alert('ZIP download failed.');
              }
            });

            updateIconWithAnimation(btn, '✅', `${index - 1} images downloaded`, null);

          } catch (e) {
            console.error('[Patreon Collector] ❌ ZIP compression error:', e);
            alert('ZIP creation failed. Check console for details.');
          } finally {
            setTimeout(() => {
              document.getElementById('patreon-lightbox-mask')?.remove();
              console.log('[Patreon Collector] 🧼 Lightbox mask removed');
              updateIconWithAnimation(btn, '📦', 'Download all post images', null);
              btn.disabled = false;
            }, 3000);
          }
      });
    }

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
              <div class="patreon-btn-label">Download all post images</div>
            `;
            h1.appendChild(btn);
            addDownloadButton(btn); // 👈 liaison ici
          }
          return true;
        }
        return false;
      };

      let attempts = 0;
      const interval = setInterval(() => {
        if (tryInject() || ++attempts >= retries) {
          clearInterval(interval);
        }
      }, 300);
    }

    waitForTitleAndInjectButton();

    // Back to top
    const btn = document.createElement('button');
        btn.id = 'top';
        btn.setAttribute('aria-label', 'Scroll to top');
        btn.setAttribute('title', 'Scroll to top');
        setButtonContent(btn, '🔝', '')

    document.body.appendChild(btn);

    const mybutton = document.getElementById("top");

    window.onscroll = function () {
        scrollFunction();
    };

    function scrollFunction() {
        if (
            document.body.scrollTop > 20 ||
            document.documentElement.scrollTop > 20
        ) {
            mybutton.style.display = "block";
        } else {
            mybutton.style.display = "none";
        }
    }

    mybutton.addEventListener("click", backToTop);

    function backToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
})();
