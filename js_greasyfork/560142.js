// ==UserScript==
// @name         Anime Magnet Copier
// @namespace    https://github.com/under2dev
// @version      1.6
// @description  Enhanced magnet copier with isolated resolution filter for nyaa, subsplease and erai-raws.
// @autr         under2dev
// @match        https://nyaa.si/*
// @match        https://subsplease.org/*
// @match        https://www.erai-raws.info/*
// @run-at       document-end
// @grant        none
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/560142/Anime%20Magnet%20Copier.user.js
// @updateURL https://update.greasyfork.org/scripts/560142/Anime%20Magnet%20Copier.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create a container element for the Shadow DOM
    const container = document.createElement('div');
    container.style.all = 'initial'; // Reset inherited styles for the container
    const shadow = container.attachShadow({ mode: 'open' });

    // Create UI elements
    const copyBtn = document.createElement('button');
    copyBtn.className = 'copy-btn';
    copyBtn.innerHTML = '<svg width="18px" height="18px" viewBox="0 0 16 16" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"> <rect height="3.5" width="4.5" y="1.75" x="5.75"/> <path d="m5.25 2.75h-2.5v11.5h10.5v-11.5h-2.5"/> </svg> Copy Magnets';

    const countBadge = document.createElement('span');
    countBadge.className = 'count-badge';
    countBadge.style.display = 'none';
    copyBtn.appendChild(countBadge);

    const infoPanel = document.createElement('div');
    infoPanel.className = 'info-panel';

    const resolutionSelect = document.createElement('select');
    resolutionSelect.className = 'resolution-select';

    ['480p', '720p', '1080p', 'HEVC'].forEach(opt => {
        const option = document.createElement('option');
        option.value = opt;
        option.textContent = opt;
        if (opt === '1080p') option.selected = true;
        resolutionSelect.appendChild(option);
    });

    // Create a style element for our Shadow DOM and add CSS rules
    const style = document.createElement('style');
    style.textContent = `
        .copy-btn {
            position: fixed;
            bottom: 15px;
            left: 15px;
            z-index: 10000;
            background: linear-gradient(145deg, #4CAF50, #45a049);
            color: white;
            padding: 12px 24px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            font-size: 14px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .copy-btn:hover {
            background: linear-gradient(145deg, #45a049, #3d8b40);
            box-shadow: 0 6px 8px rgba(0,0,0,0.35);
        }
        .count-badge {
            position: absolute;
            bottom: 28px;
            left: 150px;
            background: #ff4444;
            color: white;
            border-radius: 50px;
            padding: 2px 8px;
            font-size: 11px;
            font-weight: 700;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            min-width: 20px;
            text-align: center;
        }
        .info-panel {
            position: fixed;
            bottom: 60px;
            left: 15px;
            background: rgba(0, 0, 0, 0.9);
            color: #fff;
            padding: 12px 20px;
            border-radius: 6px;
            font-family: monospace;
            font-size: 13px;
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
            backdrop-filter: blur(4px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }
        .resolution-select {
            position: fixed;
            bottom: 15px;
            left: 210px;
            z-index: 10000;
            background: #4CAF50;
            color: white;
            padding: 12px 24px;
            border: none;
            border-radius: 8px;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.3s ease;
            outline: none;
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
        }
        .resolution-select:hover {
            background: #45a049;
            box-shadow: 0 6px 8px rgba(0,0,0,0.35);
        }
    `;

    // Append style and UI elements to the shadow root
    shadow.appendChild(style);
    shadow.appendChild(copyBtn);
    shadow.appendChild(infoPanel);
    shadow.appendChild(resolutionSelect);

    // Append container to document body
    document.body.appendChild(container);

    // Function to update magnet count based on selected resolution
    const updateMagnetCount = () => {
        const selectedRes = resolutionSelect.value;
        const magnets = Array.from(document.querySelectorAll('a[href^="magnet:?xt=urn:btih:"]')).filter(a => {
            return a.textContent.includes(selectedRes) || a.href.includes(selectedRes);
        });

        // Remove duplicates by using Set on href values
        const uniqueMagnets = [...new Set(magnets.map(a => a.href))];
        const count = uniqueMagnets.length;

        countBadge.textContent = count;
        countBadge.style.display = count > 0 ? 'block' : 'none';
    };

    // Update count when resolution selection changes
    resolutionSelect.addEventListener('change', updateMagnetCount);

    // Click event handler to the copy button
    copyBtn.addEventListener('click', async () => {
        const selectedRes = resolutionSelect.value;
        const magnetElements = Array.from(document.querySelectorAll('a[href^="magnet:?xt=urn:btih:"]'));
        const filteredMagnets = magnetElements.filter(a => {
            return a.textContent.includes(selectedRes) || a.href.includes(selectedRes);
        }).map(a => a.href);

        if (filteredMagnets.length === 0) {
            infoPanel.textContent = `⚠️ No magnet links with "${selectedRes}" found!`;
            infoPanel.style.opacity = '1';
            setTimeout(() => infoPanel.style.opacity = '0', 2000);
            return;
        }

        try {
            await navigator.clipboard.writeText(filteredMagnets.join('\n'));
            infoPanel.innerHTML = `✅ Copied <strong>${filteredMagnets.length}</strong> magnets`;
            infoPanel.style.opacity = '1';
            copyBtn.style.background = 'linear-gradient(145deg, #00c853, #009624)';

            setTimeout(() => {
                infoPanel.style.opacity = '0';
                copyBtn.style.background = 'linear-gradient(145deg, #4CAF50, #45a049)';
                updateMagnetCount();
            }, 3000);

        } catch (err) {
            infoPanel.textContent = '❌ Failed to copy!';
            infoPanel.style.opacity = '1';
            setTimeout(() => infoPanel.style.opacity = '0', 2000);
            console.error('Copy failed:', err);
        }
    });

  // Retry logic ensuring magnets are loaded
    function waitForMagnets(maxAttempts = 10, interval = 200) {
      let attempts = 0;
      const checkMagnets = () => {
          const magnets = document.querySelectorAll('a[href^="magnet:?xt=urn:btih:"]');
          if (magnets.length > 0) {
              updateMagnetCount();
              return;
          }
          attempts++;
          if (attempts < maxAttempts) {
              setTimeout(checkMagnets, interval);
          }
      };
      checkMagnets();
    }

    waitForMagnets();
})();
