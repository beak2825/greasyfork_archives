// ==UserScript==
// @name         Dead Frontier Auto (ZEGA)
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  Auto Bank buttons with collapse/remember state (no QuickBuy dependency). Anchors under QuickBuy if present, else in the right column; fallback to bottom-left. Remembers and restores last Marketplace search after banking.
// @match        https://fairview.deadfrontier.com/onlinezombiemmo/index.php*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/556356/Dead%20Frontier%20Auto%20%28ZEGA%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556356/Dead%20Frontier%20Auto%20%28ZEGA%29.meta.js
// ==/UserScript==

(function() {
  'use strict';
  console.log('[AutoBank] initializing');

  const origin = window.location.origin;
  const path = window.location.pathname;
  const params = new URLSearchParams(window.location.search);
  const returnPage = params.get('originPage');
  const currentPage = params.get('page') || '';

  // --- RESTORE LAST MARKETPLACE SEARCH (PAGE-Agnostic) ---
  if (sessionStorage.getItem('df_auto_restore')) {
    console.log('[AutoBank] df_auto_restore flag found, will try to restore search');

    const last = localStorage.getItem('lastDFsearch');
    if (!last) {
      console.log('[AutoBank] No lastDFsearch in localStorage, skipping restore');
      sessionStorage.removeItem('df_auto_restore');
    } else {
      const maxAttempts = 30;
      let attempts = 0;

      const tryRestore = () => {
        attempts++;
        // Try to find the marketplace search input with several fallback selectors
        const inp =
          document.getElementById('searchField') ||
          document.querySelector("input[name='searchField']") ||
          document.querySelector("#marketSearch") ||
          document.querySelector("input[type='text'][name='item_name']");

        const btn =
          document.getElementById('makeSearch') ||
          document.querySelector("#marketForm input[type='submit'], #marketForm input[type='button']");

        if (inp) {
          console.log('[AutoBank] Found search input, restoring value:', last);
          inp.value = last;
          inp.dispatchEvent(new Event('input', { bubbles: true }));
        }

        if (inp && btn) {
          console.log('[AutoBank] Found search button, clicking it');
          setTimeout(() => btn.click(), 80);
          // Clear flag once we've successfully restored & clicked
          sessionStorage.removeItem('df_auto_restore');
        } else if (attempts < maxAttempts) {
          // Retry a few times to wait for DF DOM to fully build
          setTimeout(tryRestore, 150);
        } else {
          console.log('[AutoBank] Could not fully restore search after retries (inp:', !!inp, 'btn:', !!btn, ')');
          sessionStorage.removeItem('df_auto_restore');
        }
      };

      // Start restore attempts once DOM is at least interactive
      const startRestore = () => setTimeout(tryRestore, 100);
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startRestore);
      } else {
        startRestore();
      }
    }
  }

  // --- 1) BANK PAGE HANDLER ---
  if (currentPage === '15' && params.has('scripts')) {
    console.log('[AutoBank] bank action:', params.get('scripts'));
    const action = params.get('scripts');
    window.addEventListener('load', () => {
      setTimeout(() => {
        if (action === 'withdraw') {
          const amt = params.get('amount') || '50000';
          const input = document.querySelector('#withdraw');
          const btn = document.querySelector('#wBtn');
          if (input && btn) {
            input.value = amt;
            input.setAttribute('value', amt);
            ['input','change'].forEach(e => input.dispatchEvent(new Event(e, { bubbles:true })));
            (typeof withdraw==='function' ? withdraw() : btn.click());
          }
        } else if (action === 'withdrawAll') {
          if (typeof withdraw === 'function') withdraw(1);
          else document.querySelector("button[onclick='withdraw(1);']")?.click();
        } else if (action === 'deposit') {
          if (typeof deposit === 'function') deposit(1);
          else document.querySelector("button[onclick='deposit(1);']")?.click();
        }
      }, 200);

      // Give the action a moment to complete, then return
      setTimeout(() => {
        // Always set restore flag when coming back from bank
        sessionStorage.setItem('df_auto_restore', '1');
        const back = returnPage || '';
        console.log('[AutoBank] Returning to page:', back);
        window.location.replace(`${origin}${path}?page=${back}`);
      }, 500);
    });
    return;
  }

  // --- 2) MAIN PAGE: INJECT PANEL (NO QuickBuy REQUIRED) ---
  let repositionObservers = [];
  function cleanupObservers(){
    repositionObservers.forEach(o => { try { o.disconnect(); } catch {} });
    repositionObservers = [];
  }

  function getRightColumnCell(){
    // Same selector QuickBuy uses
    return document.querySelector("td.design2010[style*='right_margin.jpg']");
  }

  function placePanel(panel, qb, rightTd){
    // Determine position: under QuickBuy if present; else default inside right column
    panel.style.position = 'absolute';
    panel.style.left = (qb && qb.style.left) || '10px';
    const topPx = qb ? (qb.offsetTop + qb.offsetHeight + 8) : 120;
    panel.style.top = `${topPx}px`;

    // If QuickBuy is present, keep following its size changes
    if (qb) {
      const ro = new ResizeObserver(() => {
        try {
          const t = qb.offsetTop + qb.offsetHeight + 8;
          panel.style.top = `${t}px`;
        } catch {}
      });
      ro.observe(qb);
      repositionObservers.push(ro);
    }
  }

  function ensurePanelPosition(panel){
    const qb = document.getElementById('quickbuy-fieldset');
    const rightTd = qb ? qb.parentElement : getRightColumnCell();

    if (rightTd) {
      rightTd.style.position = 'relative';
      if (!panel.parentElement || panel.parentElement !== rightTd) {
        try { rightTd.appendChild(panel); } catch {}
      }
      placePanel(panel, qb, rightTd);
      return true;
    }
    return false;
  }

  function createPanel(){
    const panel = document.createElement('div');
    panel.id = 'auto-bank-panel';
    Object.assign(panel.style, {
      background: 'rgba(0,0,0,0.3)',
      border: '1px solid #666',
      borderRadius: '8px',
      color: '#ffd700',
      padding: '8px',
      width: '180px',
      zIndex: '10000'
    });

    const title = document.createElement('strong');
    title.textContent = 'Auto Bank';
    title.style.display = 'block';
    title.style.textAlign = 'center';
    title.style.marginBottom = '6px';
    panel.appendChild(title);

    return panel;
  }

  function buildButtons(panel) {
    if (panel.querySelector('#auto-bank-fieldset')) return;
    console.log('[AutoBank] Building buttons');

    const fieldset = document.createElement('fieldset');
    fieldset.id = 'auto-bank-fieldset';
    Object.assign(fieldset.style, {
      border: '1px solid #666', padding: '6px 10px', margin: '4px 0',
      background: 'rgba(0,0,0,0.35)', borderRadius: '6px'
    });
    panel.appendChild(fieldset);

    const legend = document.createElement('legend');
    legend.innerHTML = `<span>Controls</span> <button id="collapse-auto-bank" style="background:none;border:none;color:#ffd700;cursor:pointer;">[–]</button>`;
    Object.assign(legend.style,{fontSize:'12px',padding:'0 4px'});
    fieldset.appendChild(legend);

    const container = document.createElement('div');
    container.id = 'auto-bank-btn-container';
    Object.assign(container.style, { display:'flex', flexDirection:'column', gap:'4px', marginTop:'6px' });
    fieldset.appendChild(container);

    const collapse = legend.querySelector('#collapse-auto-bank');
    if (localStorage.getItem('autoBankCollapsed') === 'true') {
      container.style.display='none'; collapse.textContent='[+]';
    }
    collapse.addEventListener('click',()=>{
      const hidden = container.style.display==='none';
      container.style.display = hidden?'flex':'none';
      collapse.textContent = hidden?'[–]':'[+]';
      localStorage.setItem('autoBankCollapsed', hidden?'false':'true');
    });

    const defs = [
      ['autoWithdraw50k','Withdraw 50k','withdraw','50000'],
      ['autoWithdraw150k','Withdraw 150k','withdraw','150000'],
      ['autoWithdraw5M','Withdraw 5M','withdraw','5000000'],
      ['autoWithdrawAll','Withdraw All','withdrawAll',null],
      ['autoDepositAll','Deposit All','deposit',null]
    ];
    defs.forEach(([id,label,act,amt])=>{
      const btn = document.createElement('button'); btn.id=id; btn.textContent=label;
      Object.assign(btn.style,{
        width:'100%', padding:'4px 0', background:'#222', color:'#ffd700',
        border:'1px solid #666', borderRadius:'4px', fontSize:'12px', cursor:'pointer'
      });
      btn.addEventListener('click',()=>{
        // Save last marketplace search if we're on a market-like page
        const si =
          document.getElementById('searchField') ||
          document.querySelector("input[name='searchField']") ||
          document.querySelector("#marketSearch") ||
          document.querySelector("input[type='text'][name='item_name']");
        if (si) {
          localStorage.setItem('lastDFsearch', si.value);
          console.log('[AutoBank] Saved lastDFsearch:', si.value);
        }

        let url = `${origin}${path}?page=15&scripts=${act}`;
        if (amt) url += `&amount=${amt}`;
        if (currentPage) url += `&originPage=${currentPage}`;
        window.location.replace(url);
      });
      container.appendChild(btn);
    });
  }

  function injectPanel(attempt=0){
    cleanupObservers();

    let panel = document.getElementById('auto-bank-panel');
    if (!panel) {
      panel = createPanel();
    }

    // Try to position in the right column (under QuickBuy if present)
    const anchored = ensurePanelPosition(panel);
    if (!anchored) {
      // Fallback after several attempts: fixed bottom-left so it's always usable
      if (attempt >= 20) {
        if (!panel.parentElement) document.body.appendChild(panel);
        Object.assign(panel.style, {
          position:'fixed', left:'8px', bottom:'8px'
        });
        console.warn('[AutoBank] Right column not found; using bottom-left fallback.');
        buildButtons(panel);
        return;
      }
      // Retry shortly (page might still be constructing)
      return setTimeout(()=>injectPanel(attempt+1), 200);
    }

    // Panel is in place; build UI once
    buildButtons(panel);

    // If QuickBuy appears later, reposition under it dynamically
    const mo = new MutationObserver(() => {
      const qb = document.getElementById('quickbuy-fieldset');
      if (qb) {
        ensurePanelPosition(panel);
      }
    });
    mo.observe(document.body, { childList:true, subtree:true });
    repositionObservers.push(mo);
  }

  // initialize
  function init(){ injectPanel(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

})();
