// ==UserScript==
// @name         CryptoClicks faucet
// @namespace    CryptoClicks Auto roll
// @version      1.4
// @description  Auto-roll faucet
// @author       Shnethan
// @match        https://cryptoclicks.net/*
// @icon         https://cryptoclicks.net/static/favicon.ico
// @license      GPL-3.0-or-later
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/562412/CryptoClicks%20faucet.user.js
// @updateURL https://update.greasyfork.org/scripts/562412/CryptoClicks%20faucet.meta.js
// ==/UserScript==

(function() {
  'use strict';

  let t = 0, c = null, k = false;
  const TO = 20000, CD = 5000;

  const s = v => {
    const e = document.querySelector('select.captcha-select');
    if (!e) return;
    e.value = v;
    e.dispatchEvent(new Event('change', { bubbles: true }));
    c = v;
    t = Date.now();
  };

  const o = () =>
    c === '3'
      ? document.querySelector('input[name="cf-turnstile-response"]')?.value.length > 10
      : c === '2'
      ? document.querySelector('textarea[name="h-captcha-response"]')?.value.length > 10
      : false;

  const r = () => document.querySelector('#rollFaucet')?.disabled === false;

  const l = m => {
    if (!k && r() && o()) {
      k = true;
      document.querySelector('#rollFaucet').click();
      m.disconnect();
      setTimeout(() => location.reload(), 5000);
    }
  };

  const m = new MutationObserver(() => { if (c==='3' && Date.now()-t>TO && !o()) s('2'); l(m); });

  m.observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['disabled','value']});

  new MutationObserver(()=>{ if(!c && document.querySelector('#faucet-modal.show,#faucet-modal.in')) s('3'); }).observe(document.body,{subtree:true,childList:true});

  setTimeout(()=>document.querySelector('#btn-modal')?.click(),2000);

  setTimeout(()=>{
    const x = document.getElementById('loadingFaucet');
    const y = document.getElementById('claimFaucet');
    if(x?.offsetParent && (!y || y.classList.contains('d-none'))) location.reload();
  },CD);

})();
