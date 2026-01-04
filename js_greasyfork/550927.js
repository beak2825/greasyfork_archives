// ==UserScript==
// @name         오늘의집 미리보기 방지 해제
// @description  -
// @namespace    http://tampermonkey.net/
// @version      2025-09-28
// @match        https://*.ohou.se/*
// @match        https://ohou.se/*
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ohou.se
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/550927/%EC%98%A4%EB%8A%98%EC%9D%98%EC%A7%91%20%EB%AF%B8%EB%A6%AC%EB%B3%B4%EA%B8%B0%20%EB%B0%A9%EC%A7%80%20%ED%95%B4%EC%A0%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/550927/%EC%98%A4%EB%8A%98%EC%9D%98%EC%A7%91%20%EB%AF%B8%EB%A6%AC%EB%B3%B4%EA%B8%B0%20%EB%B0%A9%EC%A7%80%20%ED%95%B4%EC%A0%9C.meta.js
// ==/UserScript==

(() => {
  const esc = s => (window.CSS && CSS.escape) ? CSS.escape(s) : s.replace(/[^a-zA-Z0-9_-]/g, '\\$&');
  const styled = new Set();
  const inject = key => {
    if (!key || styled.has(key)) return;
    const sel = '.' + key.split('.').map(esc).join('.');
    const st = document.createElement('style');
    st.textContent = `${sel}{height:auto!important;max-height:none!important;overflow:visible!important;}`;
    (document.head || document.documentElement).appendChild(st);
    styled.add(key);
  };
  const scrub = el => {
    const key = [...el.classList].sort().join('.');
    inject(key);
    if (el.hasAttribute('height')) el.removeAttribute('height');
    if (el.style && el.style.height) el.style.removeProperty('height');
    if (el.getAttribute && el.getAttribute('style') === '') el.removeAttribute('style');
  };
  const sweep = root => root.querySelectorAll('[height]').forEach(scrub);

  sweep(document);

  const mo = new MutationObserver(muts => {
    for (const m of muts) {
      if (m.type === 'childList' && m.addedNodes.length) {
        for (const n of m.addedNodes) {
          if (!(n instanceof Element)) continue;
          if (n.matches?.('[height]')) scrub(n);
          n.querySelectorAll?.('[height]').forEach(scrub);
        }
      }
      if (m.type === 'attributes' && m.attributeName === 'height' && m.target instanceof Element) {
        if (m.target.matches?.('[height]')) scrub(m.target);
      }
    }
  });
  mo.observe(document.body, {subtree:true, childList:true, attributes:true, attributeFilter:['height']});
  setTimeout(() => { mo.disconnect(); sweep(document); window.scrollTo({top:0,left:0,behavior:'instant'}); }, 5000);
})();
