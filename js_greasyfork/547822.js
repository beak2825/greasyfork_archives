// ==UserScript==
// @name         CB Emote Size Checker (250x80)
// @namespace    aravvn.tools
// @version      1.2.1
// @description  Highlights oversized emotes on Chaturbate by showing actual image dimensions and changing background color (max: 250x80)
// @author       aravvn
// @license      CC-BY-NC-SA-4.0
// @match        https://chaturbate.com/*
// @match        https://*.chaturbate.com/*
// @grant        none
// @run-at       document-idle
// @icon         https://chaturbate.com/favicon.ico
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/547822/CB%20Emote%20Size%20Checker%20%28250x80%29.user.js
// @updateURL https://update.greasyfork.org/scripts/547822/CB%20Emote%20Size%20Checker%20%28250x80%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const THRESHOLD_WIDTH = 250;
  const THRESHOLD_HEIGHT = 80;
  const observedWrappers = new WeakSet();

  function createSizeLabel(wrapper) {
    let label = wrapper.querySelector('.emote-size-label');
    if (!label) {
      label = document.createElement('div');
      label.className = 'emote-size-label';
      Object.assign(label.style, {
        position: 'absolute',
        bottom: '4px',
        right: '6px',
        fontSize: '10px',
        fontFamily: 'monospace',
        padding: '2px 4px',
        background: 'rgba(0, 0, 0, 0.5)',
        color: '#fff',
        borderRadius: '3px',
        pointerEvents: 'none',
        zIndex: '10'
      });
      wrapper.style.position = 'relative';
      wrapper.appendChild(label);
    }
    return label;
  }

  function checkImageSize(wrapper, img) {
    if (!img) return;

    const evaluate = () => {
      const width = img.naturalWidth;
      const height = img.naturalHeight;
      if (!width || !height) return;

      const label = createSizeLabel(wrapper);
      label.textContent = `${width}×${height}`;

      if (width > THRESHOLD_WIDTH || height > THRESHOLD_HEIGHT) {
        wrapper.style.backgroundColor = 'rgba(255, 0, 0, 0.2)';
        label.style.backgroundColor = 'rgba(255, 0, 0, 0.6)';
      } else {
        wrapper.style.backgroundColor = 'rgba(0, 255, 0, 0.1)';
        label.style.backgroundColor = 'rgba(0, 128, 0, 0.6)';
      }
    };

    if (img.complete) {
      evaluate();
    } else {
      img.onload = evaluate;
    }
  }

  function observeImgChanges(wrapper) {
    if (observedWrappers.has(wrapper)) return;
    observedWrappers.add(wrapper);

    const img = wrapper.querySelector('img');
    if (!img) return;

    checkImageSize(wrapper, img);

    const imgObserver = new MutationObserver(() => {
      checkImageSize(wrapper, img);
    });

    imgObserver.observe(img, { attributes: true, attributeFilter: ['src'] });
  }

  function scanAndWatch() {
    document.querySelectorAll('.previewWrapper').forEach(observeImgChanges);
  }

  const domObserver = new MutationObserver(scanAndWatch);
  domObserver.observe(document.body, { childList: true, subtree: true });

  scanAndWatch();
})();