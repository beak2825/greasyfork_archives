// ==UserScript==
// @name         Discord Channel List Toggle (tiny)
// @description  can't be blank
// @namespace    vm
// @match        https://discord.com/channels/*
// @run-at       document-idle
// @grant        none
// @license      MIT
// @version      0.1
// @downloadURL https://update.greasyfork.org/scripts/548172/Discord%20Channel%20List%20Toggle%20%28tiny%29.user.js
// @updateURL https://update.greasyfork.org/scripts/548172/Discord%20Channel%20List%20Toggle%20%28tiny%29.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const SEL = "div[class^='sidebarList_'][class*='sidebarListRounded_'], div.sidebarList_c48ade.sidebarListRounded_c48ade";

  function findList() {
    return document.querySelector(SEL);
  }

  function makeBtn() {
    const b = document.createElement('button');
    b.textContent = 'Hide';
    Object.assign(b.style, {
      position: 'fixed', top: '8px', left: '8px', zIndex: '999999',
      padding: '6px 10px', border: 'none', borderRadius: '8px',
      background: 'rgba(32,34,37,0.9)', color: '#fff', fontSize: '12px', cursor: 'pointer'
    });
    return b;
  }

  function init() {
    if (!document.body || document.querySelector('.vm-mini-toggle')) return;

    const btn = makeBtn();
    btn.className = 'vm-mini-toggle';

    let hidden = false;
    btn.onclick = () => {
      const list = findList();
      if (!list) return;
      hidden = !hidden;
      list.style.display = hidden ? 'none' : '';
      btn.textContent = hidden ? 'Show' : 'Hide';
    };

    document.body.appendChild(btn);

    // Try a few times to ensure Discord finished mounting before first click
    let tries = 0;
    const id = setInterval(() => {
      if (findList() || tries++ > 40) clearInterval(id);
    }, 250);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
