// ==UserScript==
// @name         GGn Filter Forum Posts
// @version      1.0.0
// @author       SleepingGiant
// @namespace    https://greasyfork.org/users/1395131
// @description  Adds a "Filter Posts" panel at the top of forum pages.
// @match        https://gazellegames.net/forums.php?*action=viewthread*&threadid=*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/561354/GGn%20Filter%20Forum%20Posts.user.js
// @updateURL https://update.greasyfork.org/scripts/561354/GGn%20Filter%20Forum%20Posts.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const PANEL_ID = 'sg_filterposts_panel';
  const LINK_ID  = 'sg_filterposts_link';
  const STORAGE_KEY = 'sg_filterposts_state';


  // --- persistence logic ---
    function saveState() {
    const usersRaw = document.getElementById('sg_fp_users')?.value ?? '';
    const blockedTextList = getBlockedText();
    GM_setValue(STORAGE_KEY, JSON.stringify({ usersRaw, blockedTextList }));
    }

    function loadState() {
    const raw = GM_getValue(STORAGE_KEY, '');
    if (!raw) return null;
    try {
        return JSON.parse(raw);
    } catch {
        return null;
    }
    }

  function applyStateToUI(state) {
    if (!state) return;

    const u = document.getElementById('sg_fp_users');
    if (u) u.value = state.usersRaw || '';

    const block = document.getElementById('sg_fp_text_block');
    if (!block) return;

    // Ensure enough rows for all saved "contains" strings
    const want = Math.max(1, (state.blockedTextList || []).length);
    const getRows = () => Array.from(block.querySelectorAll('.sg_fp_text_row'));

    while (getRows().length < want) {
      // mimic addRow() behavior (local to initTextBlockControls)
      block.appendChild(document.createElement('br'));
      const span = document.createElement('span');
      span.className = 'sg_fp_text_row';
      span.dataset.index = String(getRows().length);
      span.innerHTML = `<input type="search" class="sg_fp_text_input" style="width: 90%;" value="">`;
      span.style.marginTop = '5px';
      block.appendChild(span);
    }

    const inputs = Array.from(document.querySelectorAll('.sg_fp_text_input'));
    inputs.forEach((inp, i) => {
      inp.value = (state.blockedTextList && state.blockedTextList[i]) ? String(state.blockedTextList[i]) : '';
    });
  }
  // --- end persistence logic ---

  function normUsername(raw) {
    // remove the ∇ indicator anywhere, normalize whitespace
    return (raw || '').replace(/∇/g, '').trim();
  }

  function tokenizeUserList(s) {
    // comma / semicolon / newline separated
    return (s || '')
      .split(/[,;\n]+/)
      .map(x => x.trim())
      .filter(Boolean);
  }

  function getThreadHeaderCenter() {
    // Area that contains [ Report Thread ] ... [ Search This Thread ]
    return document.querySelector('.linkbox.linkbox_top .center');
  }

  function buildPanel() {
    const wrap = document.createElement('div');
    wrap.id = PANEL_ID;
    wrap.className = 'hidden center';

    wrap.innerHTML = `
      <div class="sg-filterposts-inner">
        <h3 style="margin: 0;">Filter Posts:</h3>
        <table cellpadding="6" cellspacing="1" border="0" class="layout border" style="margin: 0 auto;">
          <tbody>
            <tr>
              <td><strong>Hide user(s):</strong></td>
              <td>
                <input type="search" id="sg_fp_users" placeholder="e.g. foo,bar,test" size="70">
                <div class="sg-filterposts-hint">Comma/newline separated. Case-insensitive. Ignores ∇.</div>
              </td>
            </tr>

            <tr>
              <td><strong>Hide if contains:</strong></td>
              <td id="sg_fp_text_block">
                <span class="sg_fp_text_row" data-index="0">
                  <input type="search" class="sg_fp_text_input" style="width: 90%;" value="">
                </span>
                <a href="#" id="sg_fp_text_add">+</a>
                <a href="#" id="sg_fp_text_remove">–</a>
              </td>
            </tr>
            <tr>
              <td colspan="2" style="text-align:center;">
                <button type="button" class="sg-filterposts-btn" id="sg_fp_apply">Apply</button>
                <button type="button" class="sg-filterposts-btn" id="sg_fp_showall">Show all</button>
                <button type="button" class="sg-filterposts-btn" id="sg_fp_clear">Clear fields</button>
                <span id="sg_fp_count" class="sg-filterposts-count"></span>
              </td>
            </tr>
          </tbody>
        </table>
        <br>
      </div>
    `;

    return wrap;
  }

  function getPosts() {
    return Array.from(document.querySelectorAll('table.forum_post'));
  }

  function getPostUsername(postTable) {
    const a = postTable.querySelector('tr.colhead_dark a.username');
    return normUsername(a ? a.textContent : '');
  }

  function getPostText(postTable) {
    const body = postTable.querySelector('td.body');
    return (body ? body.textContent : '').trim();
  }

  function setHiddenForPost(postTable, hidden) {
    const maybeSub = postTable.previousElementSibling;
    if (maybeSub && maybeSub.classList && maybeSub.classList.contains('sub')) {
      maybeSub.style.display = hidden ? 'none' : '';
    }
    postTable.style.display = hidden ? 'none' : '';
  }

  function showAll() {
    getPosts().forEach(p => setHiddenForPost(p, false));
    const countEl = document.getElementById('sg_fp_count');
    if (countEl) countEl.textContent = '';
  }

  function getBlockedText() {
    return Array.from(document.querySelectorAll('.sg_fp_text_input'))
      .map(i => (i.value || '').trim().toLowerCase())
      .filter(Boolean);
  }

  function applyFilter() {
    saveState();

    const usersRaw = document.getElementById('sg_fp_users')?.value ?? '';
    const blockedUsers = tokenizeUserList(usersRaw).map(u => u.toLowerCase());
    const blockedTextList = getBlockedText();

    let hiddenCount = 0;

    getPosts().forEach(post => {
      const uname = getPostUsername(post).toLowerCase();
      const text  = getPostText(post).toLowerCase();
      const hasUserCrit = blockedUsers.length > 0;
      const hasTextCrit = blockedTextList.length > 0;
      const userMatches = hasUserCrit ? blockedUsers.some(user => user && uname === user) : false;
      const textMatches = hasTextCrit ? blockedTextList.some(blockedText => text.includes(blockedText)) : false;
      const shouldHide =(hasUserCrit && userMatches) ||(hasTextCrit && textMatches);

      setHiddenForPost(post, shouldHide);
      if (shouldHide) hiddenCount++;
    });

    const countEl = document.getElementById('sg_fp_count');
    if (countEl) countEl.textContent = hiddenCount ? `Hidden: ${hiddenCount}` : '';
  }

  function initTextBlockControls(panelEl) {
    const block = panelEl.querySelector('#sg_fp_text_block');
    const addBtn = panelEl.querySelector('#sg_fp_text_add');
    const remBtn = panelEl.querySelector('#sg_fp_text_remove');

    function getRows() {
      return Array.from(block.querySelectorAll('.sg_fp_text_row'));
    }

    function addRow() {
      const rows = getRows();
      const idx = rows.length;
      block.appendChild(document.createElement('br'));

      const span = document.createElement('span');
      span.className = 'sg_fp_text_row';
      span.dataset.index = String(idx);

      span.innerHTML = `<input type="search" class="sg_fp_text_input" style="width: 90%;" value="">`;
      span.style.marginTop = '5px';
      block.appendChild(span);
    }

    function removeRow() {
      const rows = getRows();
      if (rows.length <= 1) return;

      const last = rows[rows.length - 1];
      const input = last.querySelector('input');

      // Must be empty to remove
      if (input && input.value.trim() === '') {
        // remove the preceding <br> if present
        const prev = last.previousSibling;
        if (prev && prev.nodeName === 'BR') prev.remove();
        last.remove();
      }
    }

    addBtn.addEventListener('click', (e) => {
      e.preventDefault();
      addRow();
    });

    remBtn.addEventListener('click', (e) => {
      e.preventDefault();
      removeRow();
    });

    // Enter in any "contains" field applies
    block.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const target = e.target;
        if (target && target.classList && target.classList.contains('sg_fp_text_input')) {
          e.preventDefault();
          applyFilter();
        }
      }
    });
  }

  function wirePanelButtons(panelEl) {
    panelEl.querySelector('#sg_fp_apply')?.addEventListener('click', applyFilter);
    panelEl.querySelector('#sg_fp_showall')?.addEventListener('click', showAll);

    panelEl.querySelector('#sg_fp_clear')?.addEventListener('click', () => {
      const u = document.getElementById('sg_fp_users');
      if (u) u.value = '';

      // Clear all "contains" inputs and reduce back to a single row
      const inputs = Array.from(document.querySelectorAll('.sg_fp_text_input'));
      inputs.forEach(i => { i.value = ''; });

      const block = document.getElementById('sg_fp_text_block');
      if (block) {
        const rows = Array.from(block.querySelectorAll('.sg_fp_text_row'));
        for (let i = rows.length - 1; i >= 1; i--) {
          const row = rows[i];
          const prev = row.previousSibling;
          if (prev && prev.nodeName === 'BR') prev.remove();
          row.remove();
        }
      }
    });

    // Enter in username field applies
    panelEl.querySelector('#sg_fp_users')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        applyFilter();
      }
    });
  }

  function addHeaderLinkAndPanel() {
    const center = getThreadHeaderCenter();
    if (!center) return;
    if (document.getElementById(LINK_ID) || document.getElementById(PANEL_ID)) return;

    const filterLink = document.createElement('a');
    filterLink.id = LINK_ID;
    filterLink.href = '#';
    filterLink.textContent = '[ Filter Posts ]';

    const panel = buildPanel();
    wirePanelButtons(panel);
    initTextBlockControls(panel);

    filterLink.addEventListener('click', (e) => {
      e.preventDefault();
      panel.classList.toggle('hidden');
    });

    center.appendChild(document.createTextNode(''));
    center.appendChild(filterLink);

    // Insert the panel right after #searchthread if it exists
    const searchThreadDiv = document.getElementById('searchthread');
    if (searchThreadDiv && searchThreadDiv.parentNode) {
      searchThreadDiv.parentNode.insertBefore(panel, searchThreadDiv.nextSibling);
    } else {
      const linkboxTop = document.querySelector('.linkbox.linkbox_top');
      if (linkboxTop) linkboxTop.appendChild(panel);
      else document.body.insertBefore(panel, document.body.firstChild);
    }

    // Attempt to load previous filters.
    const state = loadState();
    if (state) {
      applyStateToUI(state);
      applyFilter();
    }
  }

  GM_addStyle(`
    #${PANEL_ID}.hidden { display: none; }
    #${PANEL_ID} { margin-top: 8px; }
    .sg-filterposts-inner { display: inline-block; }
    .sg-filterposts-btn {
      padding: 2px 8px;
      margin: 0 4px;
      cursor: pointer;
    }
    .sg-filterposts-hint {
      margin-top: 4px;
      font-size: 11px;
      opacity: 0.8;
    }
    .sg-filterposts-count {
      margin-left: 10px;
      font-weight: bold;
    }
    #sg_fp_text_block br { line-height: 10px; }
  `);

  window.addEventListener('load', addHeaderLinkAndPanel);
})();
