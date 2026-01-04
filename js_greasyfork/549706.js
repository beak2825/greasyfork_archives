// ==UserScript==
// @name         Google -> Dog Logo
// @namespace    https://example.local/
// @version      1.0
// @description  Replace the "Google" logo with a dog picture (inline SVG) on google.com
// @match        https://www.google.*/*
// @match        http://www.google.*/*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549706/Google%20-%3E%20Dog%20Logo.user.js
// @updateURL https://update.greasyfork.org/scripts/549706/Google%20-%3E%20Dog%20Logo.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Inline SVG data URL containing a dog emoji
  const dogDataUrl = "data:image/svg+xml;utf8," +
    encodeURIComponent(
      `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 272 92' width='272' height='92'>
         <rect width='100%' height='100%' fill='transparent'/>
         <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='Segoe UI Emoji, Noto Color Emoji, Apple Color Emoji, emoji' font-size='72'>🐶</text>
       </svg>`
    );

  function makeDogImg() {
    const img = document.createElement('img');
    img.src = dogDataUrl;
    img.alt = 'Dog';
    img.title = 'Dog logo';
    img.style.height = '92px';
    img.style.display = 'block';
    img.style.cursor = 'pointer';
    img.id = 'dog-logo-replacement';
    return img;
  }

  function replaceLogo() {
    const candidates = [
      document.getElementById('hplogo'),
      document.querySelector('#logo'),
      document.querySelector('img[alt="Google"]'),
      document.querySelector('.lnXdpd'),
      document.querySelector('a[aria-label*="Google"]')
    ];

    for (const node of candidates) {
      if (!node) continue;

      if (node.tagName === 'IMG') {
        const img = makeDogImg();
        node.parentNode.replaceChild(img, node);
        img.addEventListener('click', () => (window.location.href = '/'));
        return true;
      }

      const existing = node.querySelector('#dog-logo-replacement');
      if (existing) return true;

      const link = node.tagName === 'A' ? node : node.querySelector('a') || node;
      const dogImg = makeDogImg();

      try {
        if (link && link.tagName === 'A') {
          while (link.firstChild) link.removeChild(link.firstChild);
          link.appendChild(dogImg);
          return true;
        } else {
          node.innerHTML = '';
          node.appendChild(dogImg);
          dogImg.addEventListener('click', () => (window.location.href = '/'));
          return true;
        }
      } catch (e) {
        console.warn('logo replace error', e);
      }
    }
    return false;
  }

  function start() {
    replaceLogo();

    const observer = new MutationObserver(() => {
      replaceLogo();
    });

    observer.observe(document.documentElement || document.body, {
      childList: true,
      subtree: true,
    });

    let tries = 0;
    const interval = setInterval(() => {
      tries += 1;
      replaceLogo();
      if (tries > 10) clearInterval(interval);
    }, 700);
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    start();
  } else {
    window.addEventListener('DOMContentLoaded', start);
  }
})();
