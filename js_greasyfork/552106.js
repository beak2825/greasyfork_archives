// ==UserScript==
// @name         Torn Advanced Search: Mail Emoji (start/end position)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @license      GNU
// @description  Adds a ✉️ compose link to each user row; place at start or end; mobile tap = new tab
// @match        https://www.torn.com/page.php?sid=UserList*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/552106/Torn%20Advanced%20Search%3A%20Mail%20Emoji%20%28startend%20position%29.user.js
// @updateURL https://update.greasyfork.org/scripts/552106/Torn%20Advanced%20Search%3A%20Mail%20Emoji%20%28startend%20position%29.meta.js
// ==/UserScript==

(function () {
  'use strict';
  console.log('📬 Mail Emoji v1.2 loaded');

  // ======= CONFIG =======
  const EMOJI = '✉️';
  // Choose: "start" to put it at the far left of the row,
  //         "end"   to put it at the far right (before the > arrow)
  const POSITION = 'start';
  // ======================

  const CLASS = 'gh-mail-emoji';

  // Larger touch target, fixed height so rows never grow
  const style = document.createElement('style');
  style.textContent = `
    .${CLASS}{
      display:inline-flex;
      align-items:center;
      justify-content:center;
      width:26px;              /* bigger tap target */
      height:22px;             /* small but fixed so row height stays stable */
      line-height:1;
      font-size:16px;
      text-decoration:none;
      border-radius:4px;
      opacity:.9;
      vertical-align:middle;
      user-select:none;
      -webkit-tap-highlight-color: transparent;
    }
    .${CLASS}.pos-start{ margin:0 8px 0 4px; }
    .${CLASS}.pos-end  { margin:0 4px 0 8px; }
    .${CLASS}:active,
    .${CLASS}:hover{ opacity:1 }
  `;
  document.documentElement.appendChild(style);

  function getUserIdFromLi(li){
    for (const c of li.classList){
      if (c.startsWith('user')){
        const id = c.slice(4);
        if (/^\d+$/.test(id)) return id;
      }
    }
    return null;
  }

  function buildLink(uid){
    const a = document.createElement('a');
    a.className = CLASS + (POSITION === 'start' ? ' pos-start' : ' pos-end');
    a.href = `https://www.torn.com/messages.php#/p=compose&XID=${uid}`;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.title = `Mail ${uid}`;
    a.textContent = EMOJI;

    // Force new tab on mobile too
    a.addEventListener('click', function(e){
      e.preventDefault();
      window.open(this.href, '_blank');
    });

    return a;
  }

  function insertAtStart(header, link){
    // Put as the first thing in the header bar (left edge).
    // If there’s a leading “minus” button element, our link will appear right after it.
    header.insertBefore(link, header.firstChild);
  }

  function insertAtEnd(header, link){
    // Place just before the chevron/expand element if present, otherwise append.
    const expand = header.querySelector('.expand') || header.querySelector('.collapse-arrow');
    if (expand) {
      expand.insertAdjacentElement('beforebegin', link);
    } else {
      header.appendChild(link);
    }
  }

  function insertButton(li){
    if (li.querySelector(`.${CLASS}`)) return; // already done

    const uid = getUserIdFromLi(li);
    if (!uid) return;

    const header = li.querySelector('.expander');
    if (!header) return;

    const link = buildLink(uid);
    if (POSITION === 'end') {
      insertAtEnd(header, link);
    } else {
      insertAtStart(header, link);
    }
  }

  function addButtons(root=document){
    root.querySelectorAll('li[class^="user"]').forEach(insertButton);
  }

  // Initial + watch for SPA/pagination/accordion changes
  addButtons();
  const mo = new MutationObserver(list=>{
    for (const m of list){
      if (m.addedNodes && m.addedNodes.length){
        addButtons(m.target instanceof Element ? m.target : document);
      }
    }
  });
  mo.observe(document.body, { childList:true, subtree:true });

  setTimeout(addButtons, 800);
})();