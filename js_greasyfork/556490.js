// ==UserScript==
// @name         FV - Rock Paper Scissors Mini-Game
// @namespace    https://greasyfork.org/en/users/1535374-necroam
// @version      5.8
// @description  Play rock paper scissors against the coolest grafitti crew out there. Best of 3!
// @match        https://www.furvilla.com/villager/414373
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/556490/FV%20-%20Rock%20Paper%20Scissors%20Mini-Game.user.js
// @updateURL https://update.greasyfork.org/scripts/556490/FV%20-%20Rock%20Paper%20Scissors%20Mini-Game.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Assets
  const BG_IMG = 'https://www.furvilla.com/img/villages/world.png';
  const GLOVE_IMG = 'https://www.furvilla.com/img/items/8/8258-gilded-glove.png';
  const RPS_ITEMS = {
    Rock: 'https://www.furvilla.com/img/items/6/6910-stone-of-legend-stone.png',
    Paper: 'https://www.furvilla.com/img/items/6/6223-a-rolled-up-newspaper.png',
    Scissors: 'https://www.furvilla.com/img/items/9/9207-taurish-soul-slicer.png'
  };
  const CPU_POOL = [
    { name: 'Dog', src: 'https://www.furvilla.com/img/villagers/0/476-1-th.png' },
    { name: 'Horse', src: 'https://www.furvilla.com/img/villagers/0/476-5-th.png' },
    { name: 'Cat', src: 'https://www.furvilla.com/img/villagers/0/476-10-th.png' },
    { name: 'Raptor', src: 'https://www.furvilla.com/img/villagers/0/476-22-th.png' },
    { name: 'Raccoon', src: 'https://www.furvilla.com/img/villagers/0/476-15-th.png' },
    { name: 'Lizard', src: 'https://www.furvilla.com/img/villagers/0/476-20-th.png' }
  ];
  const CHOICES = ['Rock', 'Paper', 'Scissors'];
  const RULES = { Rock: 'Scissors', Paper: 'Rock', Scissors: 'Paper' };

  // Styles
  GM_addStyle(`
    /* Container with BG and overlay */
    .fv-rps { position:relative; border:1px solid #cbd6df; border-radius:6px; margin:10px 0;
      font-family:"Open Sans", Arial, sans-serif; color:#2a3b4c; background:url("${BG_IMG}") center/cover no-repeat; overflow:hidden; }
    .fv-rps::before { content:""; position:absolute; inset:0; background:rgba(247,251,255,0.85); pointer-events:none; }
    .fv-rps > * { position:relative; z-index:1; }

    /* Splash */
    .fv-rps-splash { position:relative; background:url("${BG_IMG}") center/cover no-repeat; border:1px solid #cbd6df;
      border-radius:6px; margin:10px 0; height:240px; display:flex; justify-content:center; align-items:center; overflow:hidden; }
    .fv-rps-splash-overlay { position:absolute; inset:0; background:rgba(247,251,255,0.85);
      display:flex; flex-direction:column; justify-content:center; align-items:center; text-align:center; padding:12px; }
    .fv-rps-splash img.avatar { width:84px; height:84px; border:2px solid #cbd6df; border-radius:6px; margin-bottom:8px; background:#fff; }
    .fv-rps-splash .name { font-weight:700; font-size:16px; margin-bottom:12px; color:#2a3b4c; }
    .fv-rps-splash .btn.big { margin:0 auto; } /* native big button centered */

    /* Modal */
    .fv-rps .modal-header { border-bottom:1px solid #cbd6df; padding:6px; text-align:center; }
    .fv-rps .modal-title { font-size:16px; font-weight:700; color:#385870; }
    .fv-rps .modal-body { padding:10px; }

    /* Header with avatars and legends (avatars keep white bg) */
    .fv-rps-header { display:grid; grid-template-columns: 1fr 1fr; gap:8px; margin-bottom:6px; align-items:center; }
    .fv-rps-side { display:grid; grid-template-columns:auto 1fr; gap:8px; align-items:center; }
    .fv-rps-side img.avatar { width:60px; height:60px; border:1px solid #cbd6df; border-radius:4px; background:#fff; }
    .fv-rps-side .name { font-weight:700; font-size:14px; color:#2a3b4c; }
    .fv-rps-side.right { justify-self:end; text-align:right; grid-template-columns:1fr auto; }
    .fv-rps-side .legend { display:flex; align-items:center; gap:6px; font-size:11px; color:#6a7f90; margin-top:2px; }
    .fv-rps-dot { width:10px; height:10px; border-radius:50%; background:rgba(155,189,199,0.5); border:1px solid #9bbdc7; }
    .fv-rps-dot.cpu { background:rgba(217,102,102,0.5); border-color:#caa; }

    /* VS */
    .fv-rps-vs { text-align:center; font-weight:800; font-size:24px; margin:0 10px; color:#385870; }

    /* Idle gloves enlarged */
    .fv-rps-gloves { display:flex; justify-content:center; align-items:center; gap:40px; margin:20px 0; }
    .fv-rps-gloves img { width:96px; height:96px; filter:drop-shadow(0 1px 0 rgba(0,0,0,0.08)); }
    .fv-rps-gloves img.left { transform:scaleX(1); }
    .fv-rps-gloves img.right { transform:scaleX(-1); }

    /* Slow 2-bounce countdown with fixed orientation */
    @keyframes bounceLeft {
      0%,100% { transform:scaleX(1) translateY(0); }
      25% { transform:scaleX(1) translateY(-20px); }
      50% { transform:scaleX(1) translateY(0); }
      75% { transform:scaleX(1) translateY(-20px); }
    }
    @keyframes bounceRight {
      0%,100% { transform:scaleX(-1) translateY(0); }
      25% { transform:scaleX(-1) translateY(-20px); }
      50% { transform:scaleX(-1) translateY(0); }
      75% { transform:scaleX(-1) translateY(-20px); }
    }
    .fv-rps-bounce img.left { animation:bounceLeft 1s ease 0s 2; }
    .fv-rps-bounce img.right { animation:bounceRight 1s ease 0s 2; }

    /* Revealed items enlarged (border only on reveal) */
    .fv-rps-match { display:flex; justify-content:center; gap:60px; margin:20px 0; }
    .fv-rps-match .tile { display:flex; flex-direction:column; align-items:center; }
    .fv-rps-match .tile img.item { width:96px; height:96px; border:1px solid #cbd6df; border-radius:6px; background:none; }
    .fv-rps-match .tile.middle-right img.item { transform:scaleX(-1); }
    .fv-rps-match .label { font-size:16px; margin-top:6px; color:#385870; text-align:center; }

    /* Choice row (simple tiles, no borders) — centered labels */
    .fv-rps-options { display:flex; justify-content:center; gap:12px; margin:8px 0; flex-wrap:wrap; }
    .fv-rps-item { display:inline-block; padding:8px; border-radius:6px; cursor:pointer; transition:transform 120ms ease, background 120ms ease; text-align:center; }
    .fv-rps-item:hover { transform:translateY(-1px); background:#eef6fc; }
    .fv-rps-item img { width:64px; height:64px; border:none; border-radius:4px; background:none; } /* no border while picking */
    .fv-rps-item p { margin:4px 0 0; font-weight:600; font-size:13px; color:#2a3b4c; text-align:center; }
    .fv-rps-item.disabled { opacity:.55; pointer-events:none; }

    /* Status + rounds */
    .fv-rps-status { text-align:center; font-weight:700; margin:6px 0; color:#385870; min-height:22px; }
    .fv-rps-rounds { display:flex; justify-content:center; gap:6px; margin-top:6px; }
    .fv-rps-ball { width:10px; height:10px; border-radius:50%; background:#fff; border:1px solid #9bbdc7; }
    .fv-rps-ball.user { background:rgba(155,189,199,0.5); }
    .fv-rps-ball.cpu { background:rgba(217,102,102,0.5); border-color:#caa; }
    .fv-rps-ball.tie { background:#fff; }

    /* Footer: native big restart button centered */
    .fv-rps .modal-footer { border-top:1px solid #cbd6df; padding:6px; text-align:center; }
    .fv-rps-restart.btn.big { margin:0 auto; }
  `);

  // State
  const state = {
    userName: 'Player',
    userIcon: '',
    userLink: '#',
    cpuName: '',
    cpuIcon: '',
    rounds: [], // { userChoice, cpuChoice, result }
    locked: false,
    phase: 'splash', // 'splash' | 'idle' | 'thinking' | 'revealed'
    pendingUserChoice: null
  };

  let mountEl = null;

  // Helpers
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;');
  }

  function getUsernameFromPanel() {
    const link = document.querySelector('.user-info h4.align-center a[href*="/profile/"]');
    if (!link) return 'Player';
    const clone = link.cloneNode(true);
    const i = clone.querySelector('i'); if (i) i.remove();
    const name = (clone.textContent || '').trim();
    return name || 'Player';
  }

  function getActiveVillager() {
    const header = Array.from(document.querySelectorAll('.widget .widget-header h3'))
      .find(h => (h.textContent || '').trim().includes('Active Villager'));
    if (!header) return { src:'', link:'#', name:'Player' };
    const widgetContent = header.parentElement ? header.parentElement.nextElementSibling : null;
    const avatarLink = widgetContent ? widgetContent.querySelector('.villager-avatar a') : null;
    const img = avatarLink ? avatarLink.querySelector('img') : null;
    return {
      src: img ? (img.getAttribute('src') || '') : '',
      link: avatarLink ? (avatarLink.getAttribute('href') || '#') : '#',
      name: img ? (img.getAttribute('title') || 'Player') : 'Player'
    };
  }

  function pickCPU() {
    const r = CPU_POOL[Math.floor(Math.random() * CPU_POOL.length)];
    state.cpuName = r.name;
    state.cpuIcon = r.src;
  }

  function judge(user, cpu) {
    if (user === cpu) return 'tie';
    return RULES[user] === cpu ? 'user' : 'cpu';
  }

  function getScore() {
    let u = 0, c = 0;
    for (const r of state.rounds) {
      if (r.result === 'user') u++;
      else if (r.result === 'cpu') c++;
    }
    return { u, c };
  }

  function isGameOver() {
    const { u, c } = getScore();
    return u >= 2 || c >= 2 || state.rounds.length >= 3;
  }

  function gameResultText() {
    const { u, c } = getScore();
    if (u > c) return 'You win the match!';
    if (c > u) return 'CPU wins the match!';
    return 'It’s a tie overall!';
  }

  // UI builders
  function buildSplash() {
    return `
      <div class="fv-rps-splash">
        <div class="fv-rps-splash-overlay">
          <a href="${escapeHtml(state.userLink)}"><img class="avatar" src="${escapeHtml(state.userIcon)}" alt=""></a>
          <div class="name">${escapeHtml(state.userName)}</div>
          <a href="#" class="btn big fv-rps-start">Begin Match</a>
        </div>
      </div>
    `;
  }

  function buildHeader() {
    return `
      <div class="fv-rps-header">
        <div class="fv-rps-side">
          <a href="${escapeHtml(state.userLink)}"><img class="avatar" src="${escapeHtml(state.userIcon)}" alt=""></a>
          <div>
            <div class="name">${escapeHtml(state.userName)}</div>
            <div class="legend"><span class="fv-rps-dot"></span> You</div>
          </div>
        </div>
        <div class="fv-rps-side right">
          <div>
            <div class="name">${escapeHtml(state.cpuName)}</div>
            <div class="legend" style="justify-content:flex-end;"><span class="fv-rps-dot cpu"></span> CPU</div>
          </div>
          <img class="avatar" src="${escapeHtml(state.cpuIcon)}" alt="">
        </div>
      </div>
    `;
  }

  function buildIdleGloves() {
    const bounceClass = (state.phase === 'thinking') ? 'fv-rps-bounce' : '';
    return `
      <div class="fv-rps-gloves ${bounceClass}">
        <img class="left" src="${escapeHtml(GLOVE_IMG)}" alt="Glove">
        <div class="fv-rps-vs">VS</div>
        <img class="right" src="${escapeHtml(GLOVE_IMG)}" alt="Glove">
      </div>
    `;
  }

  function buildMatch() {
    const last = state.rounds[state.rounds.length - 1];
    const showUser = (state.phase === 'revealed' && last) ? last.userChoice : null;
    const showCpu = (state.phase === 'revealed' && last) ? last.cpuChoice : null;

    if (!showUser || !showCpu) {
      return buildIdleGloves();
    }

    return `
      <div class="fv-rps-match">
        <div class="tile middle-left">
          <img class="item" src="${escapeHtml(RPS_ITEMS[showUser])}" alt="${escapeHtml(showUser)}">
          <span class="label">${escapeHtml(showUser)}</span>
        </div>
        <div class="tile middle-right">
          <img class="item" src="${escapeHtml(RPS_ITEMS[showCpu])}" alt="${escapeHtml(showCpu)}">
          <span class="label">${escapeHtml(showCpu)}</span>
        </div>
      </div>
    `;
  }

  function buildOptions() {
    const disabled = state.locked || isGameOver();
    return `
      <div class="fv-rps-options">
        ${CHOICES.map(name => `
          <div class="fv-rps-item ${disabled ? 'disabled' : ''}" data-choice="${name}">
            <img src="${escapeHtml(RPS_ITEMS[name])}" alt="${escapeHtml(name)}">
            <p>${escapeHtml(name)}</p>
          </div>
        `).join('')}
      </div>
    `;
  }

  function buildRounds() {
    const balls = [0,1,2].map(i => {
      let cls = '';
      if (state.rounds[i]) {
        cls = state.rounds[i].result === 'user' ? 'user' :
              state.rounds[i].result === 'cpu' ? 'cpu' : 'tie';
      }
      return `<span class="fv-rps-ball ${cls}"></span>`;
    }).join('');
    return `<div class="fv-rps-rounds">${balls}</div>`;
  }

  function buildGame() {
    const over = isGameOver();
    let status = '';
    if (over) {
      status = gameResultText();
    } else {
      if (state.rounds.length === 0 && state.phase === 'idle') {
        status = 'Pick your move.';
      } else if (state.phase === 'thinking') {
        status = '3… 2…';
      } else if (state.phase === 'revealed') {
        status = `Round ${state.rounds.length} complete. Pick again.`;
      } else {
        status = `Round ${state.rounds.length + 1} — choose your move.`;
      }
    }

    return `
      <div class="fv-rps">
        <div class="modal-header"><h2 class="modal-title">Rock Paper Scissors</h2></div>
        <div class="modal-body">
          ${buildHeader()}
          ${buildMatch()}
          ${buildOptions()}
          <div class="fv-rps-status">${escapeHtml(status)}</div>
          ${buildRounds()}
        </div>
        <div class="modal-footer">
          ${over ? `<a href="#" class="btn big fv-rps-restart">Restart</a>` : `<div style="font-size:11px; color:#8ea3b5;">Reveal delay: ~2 seconds • First to 2 wins</div>`}
        </div>
      </div>
    `;
  }

  // Render
  function render() {
    if (!mountEl) return;
    mountEl.innerHTML = (state.phase === 'splash') ? buildSplash() : buildGame();

    const startBtn = mountEl.querySelector('.fv-rps-start');
    if (startBtn) {
      startBtn.addEventListener('click', function (e) {
        e.preventDefault();
        state.phase = 'idle';
        state.rounds = [];
        state.locked = false;
        state.pendingUserChoice = null;
        pickCPU();
        render();
      });
    }

    const choiceEls = mountEl.querySelectorAll('.fv-rps-item');
    choiceEls.forEach(el => {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        const choice = el.getAttribute('data-choice');
        onUserChoice(choice);
      });
    });

    const restart = mountEl.querySelector('.fv-rps-restart');
    if (restart) {
      restart.addEventListener('click', function (e) {
        e.preventDefault();
        // Restart starts immediately
        state.phase = 'idle';
        state.rounds = [];
        state.locked = false;
        state.pendingUserChoice = null;
        pickCPU();
        render();
      });
    }
  }

  function onUserChoice(userChoice) {
    if (state.locked || isGameOver() || state.phase === 'splash') return;

    state.locked = true;
    state.phase = 'thinking';
    state.pendingUserChoice = userChoice;

    const cpuChoice = CHOICES[Math.floor(Math.random() * CHOICES.length)];

    // Show slow
    render();

    setTimeout(function () {
      const result = judge(userChoice, cpuChoice);
      state.rounds.push({ userChoice, cpuChoice, result });
      state.phase = 'revealed';
      state.locked = false;
      if (isGameOver()) state.locked = true;
      render();
    }, 2000);
  }

  // Placement
  function getAboutContainer() {
    const about = document.querySelector('.villager-data-info-wide.villager-data-desc.villager-description');
    if (!about) return null;
    const pf = about.querySelector('.profanity-filter[data-profanityfilter="true"]');
    if (!pf) return null;
    return (pf.innerHTML && pf.innerHTML.includes('testGameHere')) ? pf : null;
  }

  function init() {
    const aboutPF = getAboutContainer();
    if (!aboutPF) return;

    const active = getActiveVillager();
    state.userName = getUsernameFromPanel();
    state.userIcon = active.src || CPU_POOL[0].src;
    state.userLink = active.link || '#';

    const html = aboutPF.innerHTML;
    const parts = html.split('testGameHere');
    mountEl = document.createElement('div');

    if (parts.length >= 2) {
      aboutPF.innerHTML = parts[0];
      aboutPF.appendChild(mountEl);
      const tail = document.createElement('div');
      tail.innerHTML = parts.slice(1).join('');
      aboutPF.appendChild(tail);
    } else {
      aboutPF.appendChild(mountEl);
    }

    // Start on splash initially
    state.phase = 'splash';
    state.rounds = [];
    state.locked = false;
    state.pendingUserChoice = null;

    render();
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    init();
  } else {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  }
})();