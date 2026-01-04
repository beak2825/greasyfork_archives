// ==UserScript==
// @name         FANBOX Post Images Downloader
// @description  Adds a button to download all FANBOX post images as a ZIP archive
// @version      1.0.3
// @author       BreatFR
// @namespace    http://gitlab.com/breatfr
// @match        *://*.fanbox.cc/*
// @require      https://cdn.jsdelivr.net/npm/fflate@0.7.4/umd/index.min.js
// @copyright    2025, BreatFR (https://breat.fr)
// @icon         https://s.pximg.net/common/images/fanbox/apple-touch-icon.png
// @license      AGPL-3.0-or-later; https://www.gnu.org/licenses/agpl-3.0.txt
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/550036/FANBOX%20Post%20Images%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/550036/FANBOX%20Post%20Images%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('[FANBOX Post Images Downloader] Script loaded');

    const style = document.createElement('style');
    style.textContent = `
        .fanbox-download-btn {
            align-items: center;
            background-color: rgba(24, 24, 24, .2);
            border: none;
            border-radius: .5em;
            bottom: 1em;
            color: #fff;
            cursor: pointer;
            display: flex;
            flex-direction: column;
            font-family: poppins, cursive;
            font-size: 1.15rem;
            gap: 1em;
            justify-content: center;
            left: 1em;
            line-height: 1.5;
            padding: .5em 1em;
            position: fixed;
            transition: background-color .3s ease, box-shadow .3s ease;
            z-index: 9999;
        }
        .fanbox-download-btn:hover {
            background-color: rgba(255, 80, 80, .85);
            box-shadow: 0 0 2em rgba(255, 80, 80, .85);
        }
        @keyframes spinLoop {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        .fanbox-btn-icon.spin {
            animation: spinLoop 1s linear infinite;
        }
        @keyframes pulseLoop {
            0%   { transform: scale(1); opacity: 1; }
            50%  { transform: scale(1.1); opacity: 0.7; }
            100% { transform: scale(1); opacity: 1; }
        }
        .fanbox-btn-icon.pulse {
            animation: pulseLoop 1.8s ease-in-out infinite;
        }
        .fanbox-btn-icon {
            font-size: 3em;
            line-height: 1em;
        }
        #top {
            bottom: 1em;
            font-size: 1.2em !important;
            position: fixed;
            right: 1em;
        }
    `;
    document.head.appendChild(style);

    // Clean images links
    function cleanFanboxDownloadLink(url) {
        return url.replace(
            /https:\/\/downloads\.fanbox\.cc\/images\/post\/(\d+)\/w\/1200\/([^/]+)$/,
            'https://downloads.fanbox.cc/images/post/$1/$2'
        );
    }

    (function () {
      const selector = 'div[class*="Cover__CoverImage"]';

      function cleanPixivCoverUrl(url) {
        return url.replace(
          /https:\/\/pixiv\.pximg\.net\/c\/[^/]+\/(fanbox\/public\/images\/post\/\d+\/cover\/[^.]+\.\w+)/,
          'https://pixiv.pximg.net/$1'
        );
      }

      function transformCoverDiv(div) {
        if (!div || div.tagName !== 'DIV') return;

        const style = div.getAttribute('style');
        if (!style || !style.includes('url(')) {
          console.warn('[Fanbox Collector] ⏳ Style not ready yet...');
          return;
        }

        const match = style.match(/url\(["']?(.*?)["']?\)/);
        if (!match) return;

        const rawUrl = match[1];
        const cleanedUrl = cleanPixivCoverUrl(rawUrl);

        const link = document.createElement('a');
        link.href = cleanedUrl;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.className = div.className;

        const img = document.createElement('img');
        img.src = cleanedUrl;
        img.alt = 'Cover';
        img.style.width = '100%';
        img.style.height = 'auto';
        img.style.display = 'block';

        link.appendChild(img);
        div.replaceWith(link);

        console.log('[Fanbox Collector] ✅ Cover div replaced with <a><img>:', cleanedUrl);
      }

      const observer = new MutationObserver(() => {
        const div = document.querySelector(selector);
        const alreadyTransformed = document.querySelector(`${selector} img`);
        if (div && !alreadyTransformed) {
          const style = div.getAttribute('style');
          if (style && style.includes('url(')) {
            transformCoverDiv(div);
            observer.disconnect();
          }
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style']
      });
    })();

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
      labelEl.textContent = label;
    }

    function setIconAnimation(btn, type) {
      const icon = btn.querySelector('.fanbox-btn-icon');
      icon.classList.remove('spin', 'pulse');
      void icon.offsetWidth;
      if (type) icon.classList.add(type);
    }

    function updateIconWithAnimation(btn, icon, label, animationClass) {
      setButtonContent(btn, icon, label);
      requestAnimationFrame(() => setIconAnimation(btn, animationClass));
    }

    async function forceScrollToLoadContent() {
      console.log('[Fanbox Collector] Starting auto-scroll to load lazy images');
      const step = 300;
      const delay = 500;
      const maxScroll = document.body.scrollHeight;
      for (let scrollY = 0; scrollY < maxScroll; scrollY += step) {
        window.scrollTo({ top: scrollY, behavior: 'smooth' });
        await new Promise(resolve => setTimeout(resolve, delay));
      }
      console.log('[Fanbox Collector] Scroll complete, waiting for final content');
      await new Promise(resolve => setTimeout(resolve, 1500));
    }

    function downloadImage(url) {
      console.log(`[Fanbox Collector] Requesting image: ${url}`);
      return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
          method: 'GET',
          url: url,
          responseType: 'blob',
          onload: function(response) {
            if (response.status === 200 && response.response.size > 0) {
              resolve({ blob: response.response, filename: url.split('/').pop() });
            } else {
              reject(new Error(`Download failed or empty blob for ${url}`));
            }
          },
          onerror: function(err) {
            reject(err);
          }
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

    function addDownloadButton() {
      const cleanUrl = location.href.split('?')[0];
      const isPostPage = /^https:\/\/(?:www\.fanbox\.cc\/@[^/]+|[^.]+\.fanbox\.cc)\/posts\/\d+$/.test(cleanUrl);
      if (!isPostPage) return;

      console.log('[FANBOX Post Images Downloader] Injecting download button');
      const btn = document.createElement('button');
      btn.className = 'fanbox-download-btn';
      btn.innerHTML = `
        <div class="fanbox-btn-icon">📦</div>
        <div class="fanbox-btn-label">Download all post images</div>
      `;
      document.body.appendChild(btn);

      btn.addEventListener('click', async () => {
        console.log('[FANBOX Post Images Downloader] Button clicked');
        btn.disabled = true;
        updateIconWithAnimation(btn, '🌀', 'Scrolling to load images...', 'spin');

        await forceScrollToLoadContent();

        console.log('[FANBOX Post Images Downloader] Collecting image links...');
        const anchors = Array.from(document.querySelectorAll('a[href]'))
          .map(a => a.href)
          .map(href => {
            if (href.includes('downloads.fanbox.cc/images/post/')) {
              return cleanFanboxDownloadLink(href);
            }
            if (href.includes('pixiv.pximg.net/fanbox/public/images/post/')) {
              return href;
            }
            return null;
          })
          .filter(href => href && /\.(jpeg|jpg|png|webp|gif)$/i.test(href));

        console.log('[FANBOX Post Images Downloader] Final image list:', anchors);
        console.log(`[FANBOX Post Images Downloader] Found ${anchors.length} image links`);

        if (anchors.length === 0) {
          alert('No Fanbox image links found.');
          btn.disabled = false;
          updateIconWithAnimation(btn, '📦', 'Download all post images', null);
          return;
        }

        const files = {};
        let count = 0;

        for (const url of anchors) {
          const filename = url.split('/').pop();
            try {
              const { blob } = await downloadImage(url);
              if (!blob || blob.size === 0) {
                console.warn(`[FANBOX Post Images Downloader] Skipped empty blob: ${filename}`);
                continue;
              }

              let finalName = filename;
              let uint8;

              const ext = filename.split('.').pop().toLowerCase();
              if (ext === 'png') {
                try {
                  const img = await loadImageFromBlob(blob);
                  if (!hasTransparency(img)) {
                    const jpegDataUrl = convertToJPEG(img);
                    const jpegBlob = await (await fetch(jpegDataUrl)).blob();
                    uint8 = await blobToUint8Array(jpegBlob);
                    finalName = filename.replace(/\.png$/i, '.jpeg');
                    console.log(`[FANBOX Post Images Downloader] Converted PNG to JPEG: ${finalName}`);
                  } else {
                    uint8 = await blobToUint8Array(blob);
                    console.log(`[FANBOX Post Images Downloader] PNG with transparency kept: ${filename}`);
                  }
                } catch (e) {
                  console.warn(`[FANBOX Post Images Downloader] Transparency check failed for ${filename}`, e);
                  uint8 = await blobToUint8Array(blob);
                }
              } else {
                uint8 = await blobToUint8Array(blob);
              }

              // ✅ Harmonisation ici
              if (url.includes('pixiv.pximg.net/fanbox/public/images/post/')) {
                const extFinal = finalName.split('.').pop().toLowerCase();
                finalName = `cover.${extFinal === 'jpg' ? 'jpeg' : extFinal}`;
              }

              files[finalName] = uint8;
              console.log(`[FANBOX Post Images Downloader] Added to ZIP: ${finalName} (${uint8.length} bytes)`);
              count++;
              updateIconWithAnimation(btn, '📥', `Downloading image ${count}/${anchors.length}`, 'pulse');

            } catch (e) {
              if (e.message.includes('Quota reached')) {
                console.warn('[FANBOX Post Images Downloader] Quota reached, aborting download.');
                updateIconWithAnimation(btn, '⏳', 'Quota atteint, réessaye demain', null);
                break;
              }
              console.warn(`[FANBOX Post Images Downloader] Failed to download ${url}`, e);
            }
        }

        if (count === 0) {
          alert('All image downloads failed.');
          btn.disabled = false;
          updateIconWithAnimation(btn, '📦', 'Download all post images', null);
          return;
        }

        updateIconWithAnimation(btn, '📦', `Creating ZIP (${count} images)...`, null);

        try {
          console.log('[FANBOX Post Images Downloader] Compressing with fflate...');
          const zipped = fflate.zipSync(files);
          const blob = new Blob([zipped], { type: 'application/zip' });

          const titleElement = document.querySelector('h1[class*="styled__PostTitle-sc-"]');
          const zipName = titleElement ? titleElement.textContent.trim().replace(/[\\/:*?"<>|]/g, '_') : 'fanbox_images';

          console.log('[FANBOX Post Images Downloader] Triggering GM_download...');
          GM_download({
            url: URL.createObjectURL(blob),
            name: `${zipName}.zip`,
            saveAs: true,
            onerror: err => {
              console.error('[FANBOX Post Images Downloader] ❌ GM_download failed:', err);
              alert('ZIP download failed.');
            }
          });
        } catch (e) {
          console.error('[FANBOX Post Images Downloader] ❌ ZIP compression error:', e);
          alert('ZIP creation failed. Check console for details.');
        }

        updateIconWithAnimation(btn, '✅', `${count} images downloaded`, null);
        setTimeout(() => {
          updateIconWithAnimation(btn, '📦', 'Download all post images', null);
          btn.disabled = false;
        }, 3000);
      });
    }

    addDownloadButton();

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
