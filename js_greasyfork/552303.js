// ==UserScript==
// @name         CB Chat Emote URL Cleaner + Size Cap
// @namespace    aravvn.tools
// @version      1.1.0
// @description  Remove dimension tokens from emote IMG URLs and visually cap them to 250x80. No other elements are touched.
// @author       aravvn
// @license      CC-BY-NC-SA-4.0
// @match        https://chaturbate.com/*
// @match        https://*.chaturbate.com/*
// @icon         https://chaturbate.com/favicon.ico
// @grant        none
// @run-at       document-idle
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/552303/CB%20Chat%20Emote%20URL%20Cleaner%20%2B%20Size%20Cap.user.js
// @updateURL https://update.greasyfork.org/scripts/552303/CB%20Chat%20Emote%20URL%20Cleaner%20%2B%20Size%20Cap.meta.js
// ==/UserScript==

(() => {
  "use strict";

  const CHAT_CONTAINER_SELECTOR = '.msg-list-fvm.message-list';
  const TARGET_IMG_SELECTOR     = 'img[data-testid="emoticonImg"]';
  const CLASS_CAP               = 'cb-emote-cap-250x80';

  const ensureStyle = () => {
    if (document.getElementById('cb-emote-cap-style')) return;
    const css = `
      .${CLASS_CAP} {
        max-width: 250px !important;
        max-height: 80px !important;
        width: auto !important;
        height: auto !important;
        object-fit: contain !important;
        display: inline-block !important;
        vertical-align: top !important;
      }
    `;
    const style = document.createElement('style');
    style.id = 'cb-emote-cap-style';
    style.textContent = css;
    document.head.appendChild(style);
  };

  const stripWxH = (rawUrl) => {
    if (!rawUrl) return rawUrl;
    try {
      const u = new URL(rawUrl, location.href);
      let p = u.pathname;

      p = p.replace(/\/\d{2,4}[xX]\d{2,4}\//g, '/');
      p = p.replace(/([/_-])\d{2,4}[xX]\d{2,4}(?=(?:\.[a-z0-9]+$|$))/i, '');
      p = p.replace(/([_-])\d{2,4}[xX]\d{2,4}([_-])/gi, '$2');
      p = p.replace(/--+/g, '-').replace(/__+/g, '_').replace(/^[-_]+|[-_]+$/g, '');

      u.pathname = p;
      return u.href;
    } catch {
      return rawUrl
        .replace(/\/\d{2,4}[xX]\d{2,4}\//g, '/')
        .replace(/([/_-])\d{2,4}[xX]\d{2,4}(?=(?:\.[a-z0-9]+$|$))/i, '')
        .replace(/([_-])\d{2,4}[xX]\d{2,4}([_-])/gi, '$2');
    }
  };

  const capImg = (img) => {
    if (!img.classList.contains(CLASS_CAP)) img.classList.add(CLASS_CAP);
    const s = img.style;
    if (s.maxWidth !== '250px') s.maxWidth = '250px';
    if (s.maxHeight !== '80px') s.maxHeight = '80px';
    if (s.objectFit !== 'contain') s.objectFit = 'contain';
    if (s.height === 'auto' && s.width === 'auto') return;
    if (!s.width)  s.width  = 'auto';
    if (!s.height) s.height = 'auto';
  };

  const cleanImg = (img) => {
    if (!img || !img.matches(TARGET_IMG_SELECTOR)) return;
    const root = img.closest(CHAT_CONTAINER_SELECTOR);
    if (!root) return;

    const src = img.getAttribute('src');
    if (src) {
      const cleaned = stripWxH(src);
      if (cleaned && cleaned !== src) img.setAttribute('src', cleaned);
    }

    capImg(img);
  };

  const sweep = (root) => {
    root.querySelectorAll(TARGET_IMG_SELECTOR).forEach(cleanImg);
  };

  const attachObserver = (chatRoot) => {
    if (!chatRoot || chatRoot.__cbUrlCleanerObs) return;

    sweep(chatRoot);

    const obs = new MutationObserver((muts) => {
      for (const m of muts) {
        if (m.type === 'childList') {
          m.addedNodes.forEach(n => {
            if (!(n instanceof HTMLElement)) return;
            if (n.matches?.(TARGET_IMG_SELECTOR)) cleanImg(n);
            else n.querySelectorAll?.(TARGET_IMG_SELECTOR).forEach(cleanImg);
          });
        } else if (m.type === 'attributes') {
          const t = m.target;
          if (t instanceof HTMLImageElement && t.matches(TARGET_IMG_SELECTOR)) cleanImg(t);
        }
      }
    });

    obs.observe(chatRoot, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['src', 'width', 'height', 'style']
    });

    chatRoot.__cbUrlCleanerObs = obs;
  };

  const init = () => {
    ensureStyle();
    const chatRoot = document.querySelector(CHAT_CONTAINER_SELECTOR);
    if (chatRoot) attachObserver(chatRoot);
    return !!chatRoot;
  };

  if (!init()) {
    const iv = setInterval(() => { if (init()) clearInterval(iv); }, 500);
    setTimeout(() => clearInterval(iv), 15000);
  }
})();
