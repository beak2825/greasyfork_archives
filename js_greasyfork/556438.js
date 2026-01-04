// ==UserScript==
// @name         FV - Sand Dollar Connect 4 Mini-Game
// @namespace    https://furvilla.com/
// @version      23.8
// @description  Play Connect 4 against a few Oceadome villagers! Who would've known they be so competitive.
// @match        https://www.furvilla.com/villager/414515
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/556438/FV%20-%20Sand%20Dollar%20Connect%204%20Mini-Game.user.js
// @updateURL https://update.greasyfork.org/scripts/556438/FV%20-%20Sand%20Dollar%20Connect%204%20Mini-Game.meta.js
// ==/UserScript==


(function () {
  'use strict';

  // Game Placement
  const TARGET_SELECTOR = '.villager-data-info-wide.villager-data-desc.villager-description .profanity-filter';

  // Game config
  const ROWS = 6, COLS = 7;
  const THINKING_MS = 2000; // CPU delay
  const RELOAD_DELAY_MS = 5000; // fallback reload delay
  const POLL_MAX_MS = 12000; // max time to poll CSV after submit
  const POLL_INTERVAL_MS = 2000; // poll interval

  // Assets
  const ASSETS = {
    userDisc: 'https://www.furvilla.com/img/items/4/4984-bronze-sand-dollar.png',
    cpuDisc:  'https://www.furvilla.com/img/items/6/6038-aquamarine-sand-dollar.png',
    cpuAvatars: [
      'https://www.furvilla.com/img/villagers/0/160-1-th.png',
      'https://www.furvilla.com/img/villagers/0/160-3-th.png',
      'https://www.furvilla.com/img/villagers/0/160-4-th.png',
      'https://www.furvilla.com/img/villagers/0/160-20-th.png'
    ],
    bgImage: 'https://cdna.artstation.com/p/assets/images/images/015/094/784/large/augustinas-raginskis-dbbmdr2-e1b578d6-9953-4988-acdd-8b04718d4ced.jpg?1547039295'
  };

  // Google Sheet CSV
  const SHEET_CSV_BASE = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRCv1H86H6kwEAxI6sebiCtbxDtartNWAwmnhMVwHAdZ8R3dVU3oniq7y_imWkXko-YPD2DTJ42WkVx/pub?gid=1797044025&single=true&output=csv';
  const csvUrl = () => `${SHEET_CSV_BASE}&cb=${Date.now()}`; // cache-buster

  // Google Form
  const FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLScM-RuUOa6_qc4sw8Ek6Ql3IMmF-s7wkwEwZV4GI1C_QWvv5Q/formResponse';
  const FORM_FIELDS = {
    username: 'entry.1848260901',
    score: 'entry.112485334'
  };

  // State
  let board, currentPlayer, movesCount, winner, gameActive;
  let cpuAvatar, userAvatar, userName;

  // DOM refs
  let widgetBox, contentBox, statusEl;

  // DOM helper
  function h(tag, attrs = {}, children = []) {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (k === 'class') el.className = v;
      else if (k === 'style') el.setAttribute('style', v);
      else el.setAttribute(k, v);
    }
    [].concat(children).forEach(c => {
      if (c == null) return;
      el.append(c.nodeType ? c : document.createTextNode(c));
    });
    return el;
  }

  function onReady(cb) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', cb);
    else cb();
  }

  // CSV parser
  function parseCSV(text) {
    const rows = [];
    let row = [];
    let cell = '';
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      const next = text[i + 1];

      if (inQuotes) {
        if (ch === '"' && next === '"') { cell += '"'; i++; }
        else if (ch === '"') { inQuotes = false; }
        else { cell += ch; }
      } else {
        if (ch === '"') inQuotes = true;
        else if (ch === ',') { row.push(cell); cell = ''; }
        else if (ch === '\n') { row.push(cell); rows.push(row); row = []; cell = ''; }
        else if (ch === '\r') { /* ignore */ }
        else { cell += ch; }
      }
    }
    row.push(cell);
    rows.push(row);
    return rows;
  }

  // Normalize usernames for dedupe (trim, collapse spaces, lowercase)
  function normalizeName(name) {
    return (name || '')
      .trim()
      .replace(/\s+/g, ' ')
      .toLowerCase();
  }

  // Fetch scores and normalize:
  async function fetchScoresFromSheet() {
    try {
      const res = await fetch(csvUrl(), { cache: 'reload' });
      const text = await res.text();
      const rows = parseCSV(text);
      if (!rows.length) return [];

      const header = rows[0].map(h => (h || '').trim().toLowerCase());
      let idxName = header.findIndex(h => h.includes('user'));
      let idxScore = header.findIndex(h => h.includes('score'));
      if (idxName === -1) idxName = Math.min(1, header.length - 1);
      if (idxScore === -1) idxScore = Math.min(2, header.length - 1);

      const raw = rows.slice(1).map(r => {
        const displayName = (r[idxName] || '').trim();
        return {
          displayName,
          key: normalizeName(displayName),
          score: parseInt((r[idxScore] || '0').trim(), 10)
        };
      }).filter(i => i.key && Number.isFinite(i.score) && i.score > 0);

      const bestMap = new Map();
      for (const i of raw) {
        const prev = bestMap.get(i.key);
        if (!prev || i.score < prev.score) {
          bestMap.set(i.key, { displayName: i.displayName, score: i.score });
        }
      }

      const items = Array.from(bestMap.values());
      items.sort((a, b) => a.score - b.score);
      return items;
    } catch {
      return [];
    }
  }

  // Poll until the current user's best score = newly submitted score
  async function pollForUpdatedScore(targetName, targetScore, startTime = Date.now()) {
    const deadline = startTime + POLL_MAX_MS;
    const key = normalizeName(targetName);

    while (Date.now() < deadline) {
      const list = await fetchScoresFromSheet();
      const found = list.find(i => normalizeName(i.displayName) === key);
      if (found && found.score <= targetScore) return true;
      await new Promise(r => setTimeout(r, POLL_INTERVAL_MS));
    }
    return false;
  }

  // Boot
  onReady(() => {
    // Pull user info from User Panel
    try {
      document.querySelectorAll('.widget-header h3').forEach(h3 => {
        if (h3.textContent.trim().toLowerCase() === 'user panel') {
          const widget = h3.closest('.widget');
          const img = widget?.querySelector('.text-center img');
          const nameLink = widget?.querySelector('.user-info h4 a');
          if (img?.src) userAvatar = img.src;
          if (nameLink?.textContent) userName = nameLink.textContent.trim();
        }
      });
    } catch {}
    if (!userAvatar) userAvatar = 'https://www.furvilla.com/img/avatars/default.png';
    if (!userName) userName = 'You';

    const target = document.querySelector(TARGET_SELECTOR);
    if (!target) return;

    // Widget scaffold with splash overlay
    target.innerHTML = '';
    widgetBox = h('div', { class: 'clearfix' }, [
      h('div', { class: 'widget' }, [
        h('div', { class: 'widget-header' }, [ h('h3', {}, 'Sand Dollar Connect 4') ]),
        h('div', { class: 'widget-content' }, [
          h('div', { style: `position:relative;background:url(${ASSETS.bgImage}) center/cover no-repeat; border-radius:8px; padding:12px;` }, [
            h('div', { style:'position:absolute;inset:0;background:rgba(0,0,0,0.42);border-radius:8px;' }),
            h('div', { style:'position:relative;color:#fff;z-index:1;' }, [
              h('p', {}, 'Drop sand dollars to connect four in a row. Fewest moves to win is best!'),
              h('div', { style:'display:flex;justify-content:center;margin-top:10px;' }, [
                h('a', { href:'#', class:'btn sd-c4-start-btn' }, 'Play Game')
              ])
            ])
          ]),
          renderLeaderboardContainer()
        ])
      ])
    ]);
    target.appendChild(widgetBox);

    contentBox = widgetBox.querySelector('.widget-content');
    renderLeaderboard();

    widgetBox.querySelector('.sd-c4-start-btn').addEventListener('click', e => {
      e.preventDefault();
      renderGame();
    });
  });

  // Leaderboard container
  function renderLeaderboardContainer() {
    return h('div', { class:'sd-c4-leaderboard', style:'margin-top:14px;width:100%;' }, [
      h('table', { class: 'table', style:'width:100%;' }, [
        h('thead', {}, [
          h('tr', {}, [
            h('th', { class: 'friends-user', style:'width:100%;text-align:left;' }, 'Leaderboard')
          ])
        ]),
        h('tbody', { style:'display:block;max-height:420px;overflow-y:auto;width:100%;' })
      ])
    ]);
  }

  // Populate leaderboard rows
  async function renderLeaderboard() {
    const tbody = contentBox.querySelector('.sd-c4-leaderboard .table tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    const list = await fetchScoresFromSheet();
    if (list.length === 0) {
      const tr = h('tr', {}, [
        h('td', { class:'friends-user', style:'display:flex;align-items:center;width:100%;' }, [
          h('div', { class:'friends-avatar', style:'width:56px;min-width:56px;margin-right:12px;' }),
          h('span', {}, 'No scores yet')
        ])
      ]);
      tbody.appendChild(tr);
      return;
    }

    list.forEach(item => {
      const isUser = normalizeName(item.displayName) === normalizeName(userName);
      const avatarDiv = h('div', { class: 'friends-avatar', style:'width:56px;min-width:56px;margin-right:12px;' }, [
      ]);
      const label = h('span', { style: 'color:#000000;font-weight:bold;' }, `${item.displayName} (${item.score} moves)`);
      const tr = h('tr', {}, [
        h('td', { class: 'friends-user', style:'display:flex;align-items:center;width:100%;' }, [ , label ])
      ]);
      tbody.appendChild(tr);
    });
  }

  // Game UI
  function renderGame() {
    contentBox.innerHTML = '';

    const gameWrap = h('div', { class:'sd-c4-game' });
    cpuAvatar = ASSETS.cpuAvatars[Math.floor(Math.random() * ASSETS.cpuAvatars.length)];

    const header = h('div', { style:'display:flex;justify-content:space-between;margin-bottom:10px;' }, [
      h('div', { style:'text-align:center;' }, [
        h('img', { src:userAvatar, alt:'User avatar', style:'width:56px;height:56px;border-radius:8px;display:block;margin-bottom:4px;' }),
        h('div', {}, userName)
      ]),
      h('div', { style:'text-align:center;' }, [
        h('img', { src:cpuAvatar, alt:'CPU avatar', style:'width:56px;height:56px;border-radius:8px;display:block;margin-bottom:4px;' }),
        h('div', {}, 'CPU')
      ])
    ]);

    statusEl = h('div', { style:'margin-bottom:8px;font-weight:bold;text-align:center;' }, 'Loading...');
    const boardWrap = renderBoard();
    const actions = renderActions();
    const lbContainer = renderLeaderboardContainer();

    gameWrap.append(header, statusEl, boardWrap, actions);
    contentBox.appendChild(gameWrap);
    contentBox.appendChild(lbContainer);

    renderLeaderboard();
    startNewGame();
  }

  function renderBoard() {
    const wrap = h('div', { style:'display:grid;grid-template-columns:repeat(7,48px);gap:8px;justify-content:center;' });
    // Column drop buttons
    for (let c = 0; c < COLS; c++) {
      const head = h('a', { href:'#', class:'btn', 'data-col':c, 'aria-label':`Drop in column ${c+1}` }, `${c+1}`);
      head.addEventListener('click', e => { e.preventDefault(); onColumnClick(c); });
      wrap.appendChild(head);
    }
    // Cells
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const cell = h('div', {
          class:'sd-c4-cell',
          'data-row':r,
          'data-col':c,
          role:'gridcell',
          'aria-label':`Row ${r+1}, Column ${c+1}`,
          style:'width:48px;height:48px;border:1px solid #cfd8dc;border-radius:50%;background:#fff;cursor:pointer;position:relative;'
        });
        cell.addEventListener('click', () => onColumnClick(c));
        wrap.appendChild(cell);
      }
    }
    return wrap;
  }

  function renderActions() {
    const wrap = h('div', { style:'display:flex;justify-content:center;gap:10px;margin-top:10px;' });
    const reset = h('a', { href:'#', class:'btn' }, 'Reset');
    reset.addEventListener('click', e => { e.preventDefault(); startNewGame(); });
    wrap.append(reset);
    return wrap;
  }

  // Lifecycle
  function startNewGame() {
    const stale = contentBox.querySelector('.sd-c4-submit-prompt');
    if (stale) stale.remove();

    board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
    currentPlayer = 1;
    movesCount = 0;
    winner = null;
    gameActive = true;
    renderDiscs();
    updateStatus();
  }

  function onColumnClick(c) {
    if (!gameActive) return;
    if (currentPlayer !== 1) return;
    if (!dropDisc(c, 1)) return;
    afterMove();
    if (gameActive) {
      statusEl.textContent = 'CPU is thinking...';
      setTimeout(cpuMove, THINKING_MS);
    }
  }

  function cpuMove() {
    if (!gameActive || currentPlayer !== 2) return;
    const c = chooseCpuColumn();
    dropDisc(c, 2);
    afterMove();
  }

  function dropDisc(c, player) {
    let placedRow = -1;
    for (let r = ROWS - 1; r >= 0; r--) {
      if (board[r][c] === 0) {
        board[r][c] = player;
        placedRow = r;
        break;
      }
    }
    if (placedRow === -1) {
      flashStatus(`Column ${c + 1} is full.`);
      return false;
    }

    movesCount++;
    renderDiscs();

    if (isWinAt(placedRow, c, player)) {
      winner = player;
      gameActive = false;
      updateStatus(true);
      return true;
    }

    if (isBoardFull()) {
      winner = 0;
      gameActive = false;
      updateStatus(true);
      return true;
    }

    currentPlayer = player === 1 ? 2 : 1;
    updateStatus();
    return true;
  }

  function afterMove() {
    if (!gameActive) updateStatus(true);
  }

  // Rendering discs
  function renderDiscs() {
    const cells = document.querySelectorAll('.sd-c4-cell');
    cells.forEach(cell => {
      cell.innerHTML = '';
      const r = +cell.getAttribute('data-row');
      const c = +cell.getAttribute('data-col');
      const val = board[r][c];
      if (val) {
        const disc = h('img', {
          src: val === 1 ? ASSETS.userDisc : ASSETS.cpuDisc,
          alt: val === 1 ? 'User sand dollar' : 'CPU sand dollar',
          style: 'position:absolute;inset:5px;border-radius:50%;width:38px;height:38px;object-fit:contain;transition:transform 180ms ease;'
        });
        disc.style.transform = 'translateY(-6px)';
        setTimeout(() => { disc.style.transform = 'translateY(0)'; }, 0);
        cell.appendChild(disc);
      }
    });
  }

  // Final messages and prompts
  function updateStatus(final = false) {
    if (final) {
      if (winner === 1) {
        statusEl.innerHTML = `<span class="final"><b>${userName} wins in ${movesCount} moves!</b></span>`;
        showSubmitPrompt(); // Yes/No submit
      } else if (winner === 2) {
        statusEl.innerHTML = `<span class="final"><b>CPU wins in ${movesCount} moves.</b></span>`;
        showRestartPrompt(); // Restart only
      } else {
        statusEl.innerHTML = `<span class="final"><b>It’s a draw.</b></span>`;
        setTimeout(startNewGame, 900);
      }
      return;
    }

    statusEl.textContent = currentPlayer === 1
      ? `${userName}'s turn (Bronze Sand Dollar).`
      : `CPU’s turn (Aquamarine Sand Dollar)...`;
  }

  function flashStatus(text) {
    statusEl.textContent = text;
    setTimeout(() => updateStatus(), 900);
  }

  // Submit prompt
  function showSubmitPrompt() {
    const existing = contentBox.querySelector('.sd-c4-submit-prompt');
    if (existing) existing.remove();

    const prompt = h('div', {
      class:'sd-c4-submit-prompt',
      style:'text-align:center;margin-top:14px;font-weight:bold;'
    }, [
      h('div', { style:'margin-bottom:10px;' }, 'Submit score to leaderboard?'),
      h('div', { style:'display:flex;justify-content:center;gap:22px;' }, [
        h('a', { href:'#', class:'btn sd-c4-submit-yes', style:'padding:6px 16px;' }, 'Yes'),
        h('a', { href:'#', class:'btn sd-c4-submit-no', style:'padding:6px 16px;' }, 'No')
      ])
    ]);

    prompt.querySelector('.sd-c4-submit-yes').addEventListener('click', async (e) => {
      e.preventDefault();

      // Fill the form
      const body =
        `entry.1848260901=${encodeURIComponent(userName)}&` +
        `entry.112485334=${encodeURIComponent(movesCount)}`;

      // POST to Google Form
      fetch(FORM_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body
      }).catch(()=>{});

      statusEl.innerHTML = `<span class="final"><b>Submitted: ${userName} — ${movesCount} moves. Updating leaderboard...</b></span>`;

      // Poll for the updated score to appear
      const start = Date.now();
      const updated = await pollForUpdatedScore(userName, movesCount, start);
      if (updated) {
        const stale = contentBox.querySelector('.sd-c4-submit-prompt');
        if (stale) stale.remove();
        await renderLeaderboard(); // live update without page reload
        statusEl.innerHTML = `<span class="final"><b>Leaderboard updated!</b></span>`;
        setTimeout(startNewGame, 1200);
      } else {
        const stale = contentBox.querySelector('.sd-c4-submit-prompt');
        if (stale) stale.remove();
        statusEl.innerHTML = `<span class="final"><b>Reloading to fetch latest placement...</b></span>`;
        setTimeout(() => location.reload(), RELOAD_DELAY_MS);
      }
    });

    prompt.querySelector('.sd-c4-submit-no').addEventListener('click', (e) => {
      e.preventDefault();
      const stale = contentBox.querySelector('.sd-c4-submit-prompt');
      if (stale) stale.remove();
      startNewGame();
    });

    statusEl.after(prompt);
  }

  // Restart-only prompt (CPU win)
  function showRestartPrompt() {
    const existing = contentBox.querySelector('.sd-c4-submit-prompt');
    if (existing) existing.remove();

    const prompt = h('div', {
      class:'sd-c4-submit-prompt',
      style:'text-align:center;margin-top:14px;font-weight:bold;'
    }, [
      h('div', { style:'margin-bottom:10px;' }, 'Restart the game?'),
      h('div', { style:'display:flex;justify-content:center;gap:22px;' }, [
        h('a', { href:'#', class:'btn sd-c4-restart-yes', style:'padding:6px 16px;' }, 'Restart')
      ])
    ]);

    prompt.querySelector('.sd-c4-restart-yes').addEventListener('click', (e) => {
      e.preventDefault();
      const stale = contentBox.querySelector('.sd-c4-submit-prompt');
      if (stale) stale.remove();
      startNewGame();
    });

    statusEl.after(prompt);
  }

  // Board checks
  function isBoardFull() {
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (board[r][c] === 0) return false;
      }
    }
    return true;
  }

  function isWinAt(r, c, p) {
    return (
      countDir(r, c, p, 0, 1) >= 4 || // horizontal
      countDir(r, c, p, 1, 0) >= 4 || // vertical
      countDir(r, c, p, 1, 1) >= 4 || // diag down-right
      countDir(r, c, p, 1, -1) >= 4 // diag down-left
    );
  }

  function countDir(r, c, p, dr, dc) {
    let total = 1;
    total += countLine(r, c, p, dr, dc);
    total += countLine(r, c, p, -dr, -dc);
    return total;
  }

  function countLine(r, c, p, dr, dc) {
    let cnt = 0;
    let rr = r + dr, cc = c + dc;
    while (rr >= 0 && rr < ROWS && cc >= 0 && cc < COLS && board[rr][cc] === p) {
      cnt++; rr += dr; cc += dc;
    }
    return cnt;
  }

  // CPU logic (win, block, center bias)
  function chooseCpuColumn() {
    // Try winning
    for (let c = 0; c < COLS; c++) {
      const r = getDropRow(c);
      if (r !== -1) {
        board[r][c] = 2;
        const win = isWinAt(r, c, 2);
        board[r][c] = 0;
        if (win) return c;
      }
    }
    // Block player
    for (let c = 0; c < COLS; c++) {
      const r = getDropRow(c);
      if (r !== -1) {
        board[r][c] = 1;
        const block = isWinAt(r, c, 1);
        board[r][c] = 0;
        if (block) return c;
      }
    }
    // Preferred area
    const order = [3, 2, 4, 1, 5, 0, 6];
    for (const c of order) {
      if (getDropRow(c) !== -1) return c;
    }
    // Fallback
    for (let c = 0; c < COLS; c++) {
      if (getDropRow(c) !== -1) return c;
    }
    return 3;
  }

  function getDropRow(c) {
    for (let r = ROWS - 1; r >= 0; r--) {
      if (board[r][c] === 0) return r;
    }
    return -1;
  }
})();