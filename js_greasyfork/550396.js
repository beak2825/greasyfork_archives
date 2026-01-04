// ==UserScript==
// @name         iStripper features
// @description  Replace small images by their full size and add a download button
// @version      1.0.0
// @author       BreatFR
// @namespace    http://gitlab.com/breatfr
// @match        *://*.istripper.com/*
// @require      https://cdn.jsdelivr.net/npm/fflate@0.7.4/umd/index.min.js
// @copyright    2025, BreatFR (https://breat.fr)
// @icon         https://www.istripper.com/favicons/istripper/apple-icon-120x120.png
// @license      AGPL-3.0-or-later; https://www.gnu.org/licenses/agpl-3.0.txt
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/550396/iStripper%20features.user.js
// @updateURL https://update.greasyfork.org/scripts/550396/iStripper%20features.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const style = document.createElement('style');
    style.textContent = `
        a.box:hover div.img.icard {
            background-position: initial;
        }
        [src*="https://www.istripper.com/free/sets"] {
            transition: transform .2s ease-in-out;
        }
        a.box:hover [src*="https://www.istripper.com/free/sets"] {
            transform: scale(1.1);
            transition: transform .2s ease-in-out;
        }

        .istripper-download-btn {
            align-items: center;
            background-color: rgba(24, 24, 24, .2);
            border: none;
            border-radius: .5em;
            color: #fff;
            cursor: pointer;
            display: flex;
            flex-direction: column;
            font-family: poppins, cursive;
            font-size: 1.15rem;
            gap: 1em;
            justify-content: center;
            line-height: 1.5;
            padding: .5em 1em;
            position: absolute;
            transition: background-color .3s ease, box-shadow .3s ease;
            z-index: 9999;
        }
        .istripper-download-btn:hover {
            background-color: rgba(255, 80, 80, .85);
            box-shadow: 0 0 2em rgba(255, 80, 80, .85);
        }
        @keyframes spinLoop {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        .istripper-btn-icon.spin {
            animation: spinLoop 1s linear infinite;
        }
        @keyframes pulseLoop {
            0%   { transform: scale(1); opacity: 1; }
            50%  { transform: scale(1.1); opacity: 0.7; }
            100% { transform: scale(1); opacity: 1; }
        }
        .istripper-btn-icon.pulse {
            animation: pulseLoop 1.8s ease-in-out infinite;
        }
        .istripper-btn-icon {
            font-size: 3em;
            line-height: 1em;
        }
        #top {
            aspect-ratio: 1 / 1;
            background: transparent;
            border: none;
            bottom: 1em;
            cursor: pointer;
            font-size: 1.2em;
            left: 1em;
            position: fixed;
            z-index: 9999;
        }
    `;
    document.head.appendChild(style);

    function updateImagesAndOverlays() {
        let images = document.querySelectorAll('img.illustration');

        images.forEach(function(img) {
            if (!img.src.includes("_card_full")) {
                img.src = img.src.replace(".jpg", "_card_full.jpg");
            }
        });

        let divCollection = document.querySelectorAll('.collection-label');
        divCollection.forEach(function(div) {
            div.style.pointerEvents = 'none';
        });

        let divsWithOverlay = document.querySelectorAll('div[data-overlay]');

        divsWithOverlay.forEach(function(div) {
            div.removeAttribute('data-overlay');
        });

        let overlayImages = document.querySelectorAll('img.overlay');

        overlayImages.forEach(function(img) {
            img.parentNode.removeChild(img);
        });

        let icardDivs = document.querySelectorAll('div.img.icard');

        icardDivs.forEach(function(div) {
            let backgroundImageURL = div.style.backgroundImage;
            if (backgroundImageURL) {
                if (!backgroundImageURL.includes("_card_full")) {
                    div.style.alignItems = 'center';
                    div.style.backgroundPosition = 'center center';
                    div.style.backgroundSize = '0';
                    div.style.display = 'flex';
                    div.style.justifyContent = 'center';
                }
            }
        });

        let icardImg = document.querySelectorAll('div.img.icard > img');
        icardImg.forEach(function(img) {
            if (!img.src.includes("_card_full") && img.classList.contains("hidden")) {
                if (img.src.endsWith(".jpg")) {
                    img.src = img.src.replace(".jpg", "_card_full.jpg");
                    img.removeAttribute('class');
                    img.style.height = "242px";
                    img.style.opacity = '1';
                    img.style.pointerEvents = 'auto';
                    img.style.width = "auto";
                } else {
                    console.log("Image URL does not end with '.jpg':", img.src);
                }
            }
        });

        let icardOverlayDivs = document.querySelectorAll('div.icard-overlay');

        icardOverlayDivs.forEach(function(div) {
            div.style.pointerEvents = 'none';
            div.style.position = 'absolute';
            div.style.top = '0';
            div.style.left = '0';
            div.removeAttribute('onmouseover');
        });
    }

    updateImagesAndOverlays();

    setInterval(updateImagesAndOverlays, 500);

    // Download button
    async function downloadImage(url) {
      console.log(`[iStripper Collector] Fetching image: ${url}`);
      const response = await fetch(url, { mode: 'cors' });
      if (!response.ok) throw new Error(`Fetch failed for ${url}`);
      const blob = await response.blob();
      return { blob };
    }

    function extractFilename(url) {
      const match = url.match(/\/([^\/]+?\.(jpg|jpeg|png|webp|gif))(?=\/|$)/i);
      return match ? match[1] : 'image.jpg';
    }

    function blobToUint8Array(blob) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(new Uint8Array(reader.result));
        reader.onerror = reject;
        reader.readAsArrayBuffer(blob);
      });
    }

    function setButtonContent(btn, icon, label) {
      let iconEl = btn.querySelector('.istripper-btn-icon');
      let labelEl = btn.querySelector('.istripper-btn-label');

      if (!iconEl) {
        iconEl = document.createElement('div');
        iconEl.className = 'istripper-btn-icon';
        btn.appendChild(iconEl);
      }
      if (!labelEl) {
        labelEl = document.createElement('div');
        labelEl.className = 'istripper-btn-label';
        btn.appendChild(labelEl);
      }

      iconEl.textContent = icon;
      labelEl.textContent = label;
    }

    function setIconAnimation(btn, type) {
      const icon = btn.querySelector('.istripper-btn-icon');
      icon.classList.remove('spin', 'pulse');
      void icon.offsetWidth;
      if (type) icon.classList.add(type);
    }

    function updateIconWithAnimation(btn, icon, label, animationClass) {
      setButtonContent(btn, icon, label);
      requestAnimationFrame(() => setIconAnimation(btn, animationClass));
    }

    function addDownloadButton() {
      const urlMatch = location.href.match(/^https:\/\/www\.istripper\.com\/[^\/]+\/models\/[^\/]+\/[^\/]+$/);
      const isPackPage = urlMatch && document.querySelector('img.illustration') && document.querySelectorAll('a.picture').length > 0;
      const hasDownloadLink = !!document.querySelector('a > .bt-download');
      if (!isPackPage || !hasDownloadLink) return;

      console.log('[iStripper Collector] Injecting download button');
      const btn = document.createElement('button');
      const blackBox = document.querySelector('div.cta.showDetail');
      const wrapper = document.querySelector('div[style="background: #f6f6f6;"]');

      if (blackBox && wrapper) {
        wrapper.style.position = 'relative';
        wrapper.appendChild(btn); // injecte d'abord pour que offsetWidth soit dispo

        requestAnimationFrame(() => {
          const boxRect = blackBox.getBoundingClientRect();
          const wrapperRect = wrapper.getBoundingClientRect();
          const btnRect = btn.getBoundingClientRect();

          const top = boxRect.top - wrapperRect.top - btnRect.height - 32;
          const left = boxRect.left - wrapperRect.left + (boxRect.width / 2) - (btnRect.width / 2);

          btn.style.top = `${top}px`;
          btn.style.left = `${left}px`;
        });
      } else {
        console.warn('[iStripper Collector] Positioning fallback');
        document.body.appendChild(btn);
      }

      btn.className = 'istripper-download-btn';
      btn.innerHTML = `
        <div class="istripper-btn-icon">📦</div>
        <div class="istripper-btn-label">Download images pack + cover</div>
      `;

      const targetDiv = document.querySelector('div[style="background: #f6f6f6;"]');
      if (targetDiv) {
        targetDiv.appendChild(btn);
      } else {
        console.warn('[iStripper Collector] Target div not found, appending to body as fallback');
        document.body.appendChild(btn);
      }

      btn.addEventListener('click', async () => {
        btn.disabled = true;
        updateIconWithAnimation(btn, '🌀', 'Collecting images...', 'spin');

        const coverImg = document.querySelector('img.illustration');
        const pictureLinks = Array.from(document.querySelectorAll('a.picture'))
          .map(a => a.href)
          .filter(href => href.includes('.jpg'));

        const allLinks = [];
        if (coverImg && coverImg.src) allLinks.push({ url: coverImg.src, name: 'cover' });
        pictureLinks.forEach(url => allLinks.push({ url, name: null }));

        console.log(`[iStripper Collector] Found ${allLinks.length} images`);

        const files = {};
        let count = 0;

        for (const { url, name } of allLinks) {
          try {
            const { blob } = await downloadImage(url);
            if (!blob || blob.size === 0) {
              console.warn(`[iStripper Collector] Skipped empty blob: ${url}`);
              continue;
            }

            const uint8 = await blobToUint8Array(blob);
            if (!(uint8 instanceof Uint8Array) || uint8.length === 0) {
              console.warn(`[iStripper Collector] Skipped invalid Uint8Array for ${url}`);
              continue;
            }

            const originalName = extractFilename(url);
            const finalName = name === 'cover' ? `cover.${originalName.split('.').pop()}` : originalName;

            console.log(`[iStripper Collector] Preparing ZIP entry: ${finalName} (${uint8.length} bytes)`);
            files[finalName] = uint8;
            count++;
            updateIconWithAnimation(btn, '📥', `Downloading ${count}/${allLinks.length}`, 'pulse');
          } catch (e) {
            console.warn(`[iStripper Collector] Failed to download ${url}`, e);
          }
        }

        if (count === 0) {
          alert('No images downloaded.');
          btn.disabled = false;
          updateIconWithAnimation(btn, '📦', 'Download pack + cover', null);
          return;
        }

        updateIconWithAnimation(btn, '📦', `Creating ZIP (${count} images)...`, null);

        try {
          const zipped = await new Promise((resolve, reject) => {
            fflate.zip(files, {}, (err, data) => {
              if (err) {
                console.error('[ZIP async error]', err);
                reject(err);
              } else {
                resolve(data);
              }
            });
          });

          const blob = new Blob([zipped], { type: 'application/zip' });
          const h2 = document.querySelector('h2.mdlnav');
          const zipName = h2 ? h2.textContent.trim().replace(/[\\/:*?"<>|]/g, '_') : 'istripper_pack';

          GM_download({
            url: URL.createObjectURL(blob),
            name: `${zipName}.zip`,
            saveAs: true,
            onerror: err => {
              console.error('[iStripper Collector] ❌ GM_download failed:', err);
              alert('ZIP download failed.');
            }
          });
        } catch (e) {
          console.error('[iStripper Collector] ❌ ZIP creation failed:', e);
          alert(`ZIP creation failed: ${e?.message || e}`);
        }

        updateIconWithAnimation(btn, '✅', `${count} images downloaded`, null);
        setTimeout(() => {
          updateIconWithAnimation(btn, '📦', 'Download pack + cover', null);
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
