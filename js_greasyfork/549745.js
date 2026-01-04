// ==UserScript==
// @name         Torn Copy Loader — HTML link to loader + assisters + BS est (If BSP Subscribed)
// @namespace    smitty.torn.com
// @version      1.0
// @description  Adds "Copy loader" text + assisters box beside Attacking. Copies HTML with the CURRENT loader URL, XID (if present), and BS estimate if visible.
// @author       Smitty
// @match        https://www.torn.com/loader.php?sid=attack*
// @run-at       document-idle
// @grant        none
// @noframes
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549745/Torn%20Copy%20Loader%20%E2%80%94%20HTML%20link%20to%20loader%20%2B%20assisters%20%2B%20BS%20est%20%28If%20BSP%20Subscribed%29.user.js
// @updateURL https://update.greasyfork.org/scripts/549745/Torn%20Copy%20Loader%20%E2%80%94%20HTML%20link%20to%20loader%20%2B%20assisters%20%2B%20BS%20est%20%28If%20BSP%20Subscribed%29.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const UI = {
    WRAP_ID: 'smitty-copyloader-wrap-txt',
    LINK_ID: 'smitty-copyloader-link-txt',
    QUICK_ID: 'smitty-copyloader-quick',
    STORAGE_KEY: 'smitty_copy_loader_assisters_only'
  };

  function readAssisters() {
    try { return JSON.parse(localStorage.getItem(UI.STORAGE_KEY) || '{"assisters":""}').assisters || ''; }
    catch { return ''; }
  }
  function writeAssisters(v) { try { localStorage.setItem(UI.STORAGE_KEY, JSON.stringify({ assisters: v })); } catch {} }

  function findTitleContainer() {
    const nodes = document.querySelectorAll('div, header');
    for (const n of nodes) {
      const h4 = n.querySelector('h4');
      if (h4 && h4.textContent && h4.textContent.trim().toLowerCase() === 'attacking') return n;
    }
    return document.querySelector('.titleContainer___QrlWP') || document.querySelector('.titleContainer');
  }

  function ensureStyles() {
    if (document.getElementById('smitty-copyloader-styles-txt')) return;
    const st = document.createElement('style');
    st.id = 'smitty-copyloader-styles-txt';
    st.textContent = `
      #${UI.LINK_ID}{
        margin-left:8px; font-size:12px; color:#9a9a9a !important; text-decoration:underline; cursor:pointer;
      }
      #${UI.LINK_ID}:hover{ color:#9a9a9a !important; filter:none; }
      #${UI.LINK_ID}:visited{ color:#9a9a9a !important; }
      #${UI.LINK_ID}:active{ color:#9a9a9a !important; }
      #${UI.QUICK_ID}{
        width:46px; margin-left:6px; padding:2px 6px; border-radius:4px;
        border:1px solid rgba(0,0,0,0.25); background:#fff; font-size:12px; color:#111;
      }
      @media (prefers-color-scheme: dark){
        #${UI.QUICK_ID}{ background:#111; color:#eee; border-color: rgba(255,255,255,0.2); }
      }
    `;
    document.head.appendChild(st);
  }

  function injectControls() {
    if (document.getElementById(UI.WRAP_ID)) return;
    const container = findTitleContainer();
    if (!container) return;

    // clean older UI variants, if any
    ['smitty-copyloader-wrap','smitty-copyloader-gear','smitty-copyloader-copy','smitty-copyloader-pop'].forEach(id => {
      const el = document.getElementById(id);
      if (el && el.parentNode) el.parentNode.removeChild(el);
    });

    const wrap = document.createElement('span');
    wrap.id = UI.WRAP_ID;
    wrap.style.display = 'inline-flex';
    wrap.style.alignItems = 'center';
    wrap.style.marginLeft = '6px';

    const link = document.createElement('span');
    link.id = UI.LINK_ID;
    link.textContent = 'Copy loader';
    link.title = 'Copy "<a href=loader>Attack Loader</a> [XID], # assisters needed. BS est ..."';

    const quick = document.createElement('input');
    quick.id = UI.QUICK_ID;
    quick.type = 'number';
    quick.min = '0';
    quick.placeholder = '#';
    quick.title = 'Assisters (press Enter to copy)';
    quick.value = readAssisters();

    link.addEventListener('click', async () => {
      writeAssisters(quick.value);
      await copyHtml();
      flash(link, 'Copied');
    });

    quick.addEventListener('keydown', async (ev) => {
      if (ev.key === 'Enter') {
        writeAssisters(quick.value);
        await copyHtml();
        flash(link, 'Copied');
      }
    });

    const h4 = container.querySelector('h4') || container.firstElementChild;
    if (h4 && h4.parentNode) h4.parentNode.insertBefore(wrap, h4.nextSibling);
    else container.appendChild(wrap);

    wrap.append(link, quick);
  }

  function flash(el, txt) {
    const prev = el.textContent;
    el.textContent = txt;
    setTimeout(() => { el.textContent = prev; }, 900);
  }

  async function copyHtml() {
    const loaderUrl = new URL(window.location.href).toString();
    const xid = (new URLSearchParams(window.location.search)).get('user2ID') || (new URLSearchParams(window.location.search)).get('userID') || '';
    const assisters = readAssisters().toString().trim();
    const estInfo = readBattleStatEstimate();

    const anchor = `<a href="${escapeHtml(loaderUrl)}">Attack Loader</a>`;
    const xidPart = xid ? ` [${escapeHtml(xid)}]` : '';
    const assistPart = assisters ? `, ${escapeHtml(assisters)} assisters needed.` : '';
    const estPart = estInfo ? ` ${escapeHtml(estInfo)}` : '';

    const finalHtml = `${anchor}${xidPart}${assistPart}${estPart}`;
    await copyToClipboard(finalHtml);
  }

  function readBattleStatEstimate() {
    const el = document.querySelector('.iconStatsAttack');
    if (!el) return '';
    const estTxt = (el.textContent || '').trim();
    if (!estTxt) return '';
    let extra = '';
    const title = el.getAttribute('title') || '';
    const m = title.match(/FF\s*:\s*([0-9.]+)/i);
    if (m && m[1]) extra = ` (FF ${m[1]})`;
    return `BS est ${estTxt}${extra}.`;
  }

  async function copyToClipboard(text) {
    if (!text) return;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try { await navigator.clipboard.writeText(text); return; } catch {}
    }
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch {}
    document.body.removeChild(ta);
  }

  const escapeHtml = (s) => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

  const mo = new MutationObserver(() => {
    if (location.pathname.includes('loader.php') && location.search.includes('sid=attack')) {
      ensureStyles();
      injectControls();
    }
  });
  mo.observe(document.body, { childList:true, subtree:true });

  if (location.pathname.includes('loader.php') && location.search.includes('sid=attack')) {
    ensureStyles();
    injectControls();
  }
})();
