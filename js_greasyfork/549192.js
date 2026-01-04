// ==UserScript==
// @name         Force PiP: Everywhere
// @namespace    pip.fix
// @author       Senriam
// @version      3.1.1
// @description  Remove PiP blockers on any site, all frames, everywhere
// @match        *://*/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549192/Force%20PiP%3A%20Everywhere.user.js
// @updateURL https://update.greasyfork.org/scripts/549192/Force%20PiP%3A%20Everywhere.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const fixVideo = v => {
    if (!v) return;
    v.removeAttribute('disablepictureinpicture');
    const cl = v.getAttribute('controlsList');
    if (cl && /\b(no|disable)pictureinpicture\b/i.test(cl)) {
      v.setAttribute('controlsList', cl.replace(/\b(no|disable)pictureinpicture\b/ig, '').replace(/\s{2,}/g, ' ').trim());
    }
    try {
      Object.defineProperty(v, 'disablePictureInPicture', {
        get: () => false, set: () => {}, configurable: true
      });
    } catch {}
  };

  const sweep = root => {
    root.querySelectorAll?.('video').forEach(fixVideo);
    // open shadow roots
    root.querySelectorAll?.('*').forEach(el => { if (el.shadowRoot) sweep(el.shadowRoot); });
  };

  new MutationObserver(muts => {
    for (const m of muts) {
      if (m.type === 'attributes' && m.target.tagName === 'VIDEO') fixVideo(m.target);
      if (m.type === 'childList') m.addedNodes.forEach(n => { if (n.nodeType === 1) sweep(n); });
    }
  }).observe(document, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ['disablepictureinpicture', 'controlslist']
  });

  // early and late passes
  sweep(document);
  addEventListener('DOMContentLoaded', () => sweep(document));
  addEventListener('load', () => { sweep(document); setTimeout(() => sweep(document), 1000); });
})();