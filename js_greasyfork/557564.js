// ==UserScript==
// @name         Supercell Store Ultimate Claimer
// @namespace    http://tampermonkey.net/
// @version      7.11
// @description  Fetches and claims free Supercell Store rewards on store.supercell.com via a floating widget.
// @author       http://github.com/anhdung98
// @match        https://store.supercell.com/*
// @grant        GM_xmlhttpRequest
// @inject-into  content
// @connect      supercell.xpromo.net
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557564/Supercell%20Store%20Ultimate%20Claimer.user.js
// @updateURL https://update.greasyfork.org/scripts/557564/Supercell%20Store%20Ultimate%20Claimer.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // --- CONFIG ---
  const API_BASE = 'https://supercell.xpromo.net';
  const STORE_ORIGIN = 'https://store.supercell.com';
  const LOGIN_URL = 'https://store.supercell.com/vi/oauth/begin';
  const STORAGE_KEY_MAIN = 'sc_v7_main_collapsed';

  const CUSTOM_HEADERS = {};

  let GAMES_LIST = [];

  // --- NATIVE CSS ---
  function addCustomStyle(css) {
    const style = document.createElement('style');
    style.textContent = css;
    (document.head || document.documentElement).appendChild(style);
  }

  addCustomStyle(`
        :root {
            --sc-bg: rgba(18, 18, 20, 0.98);
            --sc-overlay: rgba(0, 0, 0, 0.7);
            --sc-panel: #222;
            --sc-item-bg: rgba(255,255,255,0.05);
            --sc-text: #ffffff;
            --sc-text-muted: #999;
            --sc-gold-grad: linear-gradient(135deg, #ffd700, #e6ac00);
            --sc-blue-grad: linear-gradient(135deg, #3498db, #2980b9);
            --sc-green: #2ecc71;
            --sc-red: #e74c3c;
            --sc-border: rgba(255, 255, 255, 0.1);
            --sc-font-head: 'SupercellHeadline-Bold', 'Supercell-Magic', system-ui, sans-serif;
            --sc-font-body: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }

        #sc-dashboard {
            position: fixed; top: 90px; right: 20px; z-index: 100000;
            font-family: var(--sc-font-body); -webkit-font-smoothing: antialiased;
        }

        /* --- MAIN CARD --- */
        .sc-main-card {
            width: 340px; background: var(--sc-bg);
            backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 215, 0, 0.2); border-radius: 14px;
            overflow: hidden; box-shadow: 0 15px 40px rgba(0,0,0,0.6);
            display: flex; flex-direction: column;
            animation: slideUpFade 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .sc-main-header {
            padding: 12px 16px; background: var(--sc-gold-grad);
            display: flex; justify-content: space-between; align-items: center;
        }

        .sc-main-title {
            font-family: var(--sc-font-head); font-size: 16px; color: #111;
            text-transform: uppercase; letter-spacing: 0.5px;
            display: flex; align-items: center; gap: 6px;
        }

        .sc-controls { display: flex; align-items: center; gap: 6px; }
        .sc-controls button {
            background: rgba(0,0,0,0.08); border: none; color: #111; cursor: pointer;
            width: 26px; height: 26px; border-radius: 50%;
            display: flex; align-items: center; justify-content: center; transition: all 0.2s;
        }
        .sc-controls button:hover { background: rgba(0,0,0,0.2); transform: scale(1.05); }

        /* --- BODY --- */
        .sc-body { max-height: 55vh; overflow-y: auto; padding: 10px; }
        .sc-body::-webkit-scrollbar { width: 4px; }
        .sc-body::-webkit-scrollbar-thumb { background: #444; border-radius: 2px; }

        /* --- FOOTER --- */
        .sc-main-footer {
            padding: 12px;
            background: rgba(0,0,0,0.3);
            border-top: 1px solid var(--sc-border);
            display: flex; gap: 10px;
        }

        .sc-footer-btn {
            flex: 1; padding: 10px; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px;
            font-family: var(--sc-font-head); font-size: 11px; text-transform: uppercase;
            cursor: pointer; display: flex; align-items: center; justify-content: center;
            transition: all 0.2s; box-shadow: 0 2px 4px rgba(0,0,0,0.2); letter-spacing: 0.5px;
            background: #333; color: #ccc;
        }
        .sc-footer-btn:hover { background: #444; color: #fff; border-color: rgba(255,255,255,0.3); }
        .sc-footer-btn:active { transform: scale(0.96); }

        /* --- GAME LIST STYLES --- */
        .sc-game-section {
            margin-bottom: 8px; background: rgba(255,255,255,0.02);
            border: 1px solid var(--sc-border); border-radius: 8px; overflow: hidden;
        }
        .sc-game-section:last-child { margin-bottom: 0; }

        .sc-game-header { padding: 8px 12px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; user-select: none; background: linear-gradient(to bottom, rgba(255,255,255,0.05), rgba(255,255,255,0.01)); }
        .sc-game-info { display: flex; align-items: center; gap: 10px; }
        .sc-game-icon { width: 20px; height: 20px; border-radius: 5px; background: #333; object-fit: cover; }
        .sc-game-name { font-weight: 700; font-size: 13px; color: #eee; }
        .sc-game-count { background: #333; color: #ddd; font-size: 9px; padding: 2px 6px; border-radius: 8px; font-weight: 700; }

        .sc-items-container { max-height: 500px; padding: 0 8px 8px 8px; overflow: hidden; transition: max-height 0.3s ease-out, padding 0.3s ease; }
        .sc-items-container.collapsed { max-height: 0; padding: 0; pointer-events: none; }

        .sc-item-row { display: flex; justify-content: space-between; align-items: center; background: var(--sc-item-bg); padding: 6px 10px; margin-top: 6px; border-radius: 6px; border-left: 2px solid transparent; }
        .sc-item-meta { display: flex; flex-direction: column; }
        .sc-item-name { font-size: 12px; font-weight: 500; color: #ddd; }
        .sc-item-msg { font-size: 9px; color: var(--sc-text-muted); }

        .btn-claim {
            background: #3a3a3a; color: #fff; border: none; padding: 6px 0;
            width: 72px; text-align: center; justify-content: center;
            font-size: 10px; border-radius: 4px; cursor: pointer; font-weight: 600;
        }

        .btn-claim-all { background: var(--sc-blue-grad); color: #fff; border: none; padding: 4px 10px; font-size: 10px; font-weight: 700; border-radius: 4px; cursor: pointer; }
        .btn-claim-all:disabled { background: #444; color: #888; box-shadow: none; cursor: not-allowed; }

        .sc-toggle-icon { font-size: 10px; color: #666; width: 24px; text-align: center; display: inline-block; transition: transform 0.3s ease; }
        .sc-game-section.open .sc-toggle-icon { transform: rotate(180deg); }

        .status-processing { border-color: #ffd700; } .status-success { border-color: var(--sc-green); } .status-error { border-color: var(--sc-red); } .status-done { opacity: 0.5; }
        .sc-fab { width: 52px; height: 52px; background: var(--sc-gold-grad); border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 15px rgba(255, 170, 0, 0.5); cursor: pointer; z-index: 100000; animation: bounceIn 0.5s; }
        .sc-fab:hover { transform: scale(1.1); } .sc-fab svg { width: 24px; height: 24px; fill: #111; }

        /* --- MODAL SYSTEM --- */
        .sc-modal-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: var(--sc-overlay); backdrop-filter: blur(5px);
            z-index: 200000; display: flex; align-items: center; justify-content: center;
            opacity: 0; animation: fadeIn 0.3s forwards;
        }

        .sc-modal {
            width: 380px;
            background: var(--sc-bg);
            border: 1px solid var(--sc-gold-grad);
            border-radius: 16px;
            overflow: visible;
            box-shadow: 0 20px 50px rgba(0,0,0,0.8);
            transform: scale(0.9); animation: scaleUp 0.3s forwards;
            display: flex; flex-direction: column;
        }

        .sc-modal-header {
            background: var(--sc-gold-grad); padding: 12px 16px;
            display: flex; justify-content: space-between; align-items: center;
            border-top-left-radius: 15px; border-top-right-radius: 15px;
        }

        .sc-modal-title { font-family: var(--sc-font-head); font-size: 16px; color: #111; text-transform: uppercase; }
        .sc-modal-close { background: none; border: none; font-size: 20px; cursor: pointer; color: #111; }

        .sc-modal-body {
            padding: 16px; display: flex; flex-direction: column; gap: 12px;
            border-bottom-left-radius: 15px; border-bottom-right-radius: 15px;
            background: var(--sc-bg);
        }

        /* --- CUSTOM DROPDOWN --- */
        .sc-dropdown { position: relative; width: 100%; font-family: -apple-system, sans-serif; }
        .sc-dropdown-btn {
            width: 100%; padding: 10px; background: rgba(0,0,0,0.3);
            border: 1px solid var(--sc-border); border-radius: 8px;
            color: #fff; cursor: pointer; display: flex; justify-content: space-between; align-items: center;
            font-size: 13px; box-sizing: border-box; transition: border-color 0.2s;
        }
        .sc-dropdown-btn:hover { border-color: rgba(255,255,255,0.3); }
        .sc-dropdown-btn.active { border-color: #ffd700; }

        .sc-dropdown-content {
            position: absolute; top: 105%; left: 0; width: 100%;
            background: #222; border: 1px solid rgba(255,255,255,0.15);
            border-radius: 8px; max-height: 250px; overflow-y: auto;
            z-index: 9999; display: none; box-shadow: 0 10px 30px rgba(0,0,0,0.9);
        }

        .sc-dropdown-content::-webkit-scrollbar { width: 4px; }
        .sc-dropdown-content::-webkit-scrollbar-thumb { background: #555; border-radius: 2px; }

        .sc-dropdown-content.show { display: block; animation: fadeIn 0.2s; }
        .sc-dropdown-item {
            padding: 10px; display: flex; align-items: center; gap: 10px;
            cursor: pointer; transition: background 0.2s; border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .sc-dropdown-item:hover { background: rgba(255,255,255,0.1); }
        .sc-dropdown-item:last-child { border-bottom: none; }
        .sc-select-img { width: 20px; height: 20px; border-radius: 4px; object-fit: cover; background: #333; }
        .sc-select-text { font-size: 13px; color: #eee; font-weight: 500; }

        .sc-input { width: 100%; background: rgba(0,0,0,0.3); border: 1px solid var(--sc-border); color: #fff; padding: 10px; border-radius: 8px; font-family: monospace; font-size: 16px; outline: none; box-sizing: border-box; }
        .sc-input:focus { border-color: #ffd700; }
        #code-input { text-align: center; letter-spacing: 4px; text-transform: uppercase; font-weight: bold; font-size: 18px; }
        .sc-textarea { width: 100%; height: 100px; background: rgba(0,0,0,0.3); border: 1px solid var(--sc-border); color: #fff; padding: 10px; border-radius: 8px; font-size: 16px; resize: none; outline: none; box-sizing: border-box; }
        .sc-btn-main { width: 100%; padding: 12px; border: none; border-radius: 8px; font-family: var(--sc-font-head); font-size: 14px; text-transform: uppercase; cursor: pointer; transition: all 0.2s; background: var(--sc-gold-grad); color: #111; }
        .sc-btn-main:disabled { background: #444; color: #888; cursor: not-allowed; }
        .sc-disclaimer { font-size: 11px; color: #777; font-style: italic; text-align: center; }


        @keyframes slideUpFade { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeOut { from { opacity: 1; transform: scale(1); } to { opacity: 0; transform: scale(0.9); } }
        @keyframes scaleUp { from { transform: scale(0.9); } to { transform: scale(1); } }
        @keyframes bounceIn { 0% { transform: scale(0); opacity: 0; } 60% { transform: scale(1.1); } 100% { transform: scale(1); } }
        .hidden { display: none !important; }
        .sc-closing { animation: fadeOut 0.3s forwards; pointer-events: none; }
        .sc-fab { cursor: grab; }
        .sc-fab:active { cursor: grabbing; }
        .sc-main-header { cursor: grab; }
        .sc-main-header:active { cursor: grabbing; }
    `);

  // --- LOGIC ---

  function init() {
    GM_xmlhttpRequest({
      method: "GET",
      url: `${API_BASE}/api/games`,
      onload: (res) => {
        if (res.status === 200) {
          try {
            GAMES_LIST = JSON.parse(res.responseText);
          } catch (e) { }
        }
      }
    });
    fetchRewards();
  }

  function fetchRewards() {
    try {
      GM_xmlhttpRequest({
        method: "GET",
        url: `${API_BASE}/api/v2/store/data`,
        headers: CUSTOM_HEADERS,
        onload: function (response) {
          if (response.status === 200) {
            try {
              renderDashboard(JSON.parse(response.responseText));
            } catch (e) {
              console.error("JSON Error", e);
            }
          }
        }
      });
    } catch (e) {
      console.error("GM Error", e);
    }
  }

  // --- DASHBOARD ---
  function renderDashboard(gamesData) {
    if (document.getElementById('sc-dashboard')) return;
    const isMainCollapsed = localStorage.getItem(STORAGE_KEY_MAIN) === 'true';

    const root = document.createElement('div');
    root.id = 'sc-dashboard';

    const card = document.createElement('div');
    card.className = `sc-main-card ${isMainCollapsed ? 'hidden' : ''}`;

    const header = document.createElement('div');
    header.className = 'sc-main-header';
    header.innerHTML = `
            <div class="sc-main-title">
                <svg viewBox="0 0 24 24" width="16" height="16" style="margin-right:5px"><path d="M20,6H16V5C16,3.89 15.1,3 14,3H10C8.9,3 8,3.89 8,5V6H4C2.89,6 2,6.89 2,8V19C2,20.11 2.89,21 4,21H20C21.11,21 22,20.11 22,19V8C22,6.89 21.11,6 20,6M15,5C15,4.45 14.55,4 14,4H10C9.45,4 9,4.45 9,5V6H15V5M20,19H4V8H20V19Z" fill="#1a1a1a"/></svg>
                Store Rewards
            </div>
            <div class="sc-controls">
                <button id="btn-min" title="Minimize">─</button>
                <button id="btn-close" title="Close">✕</button>
            </div>
        `;

    const body = document.createElement('div');
    body.className = 'sc-body';

    gamesData.forEach(game => {
      if (!game.items || game.items.length === 0) return;
      const gameSection = document.createElement('div');
      gameSection.className = 'sc-game-section';

      const gHeader = document.createElement('div');
      gHeader.className = 'sc-game-header';
      gHeader.innerHTML = `
                <div class="sc-game-info">
                    <img src="${game.image || ''}" class="sc-game-icon" onerror="this.style.display='none'">
                    <span class="sc-game-name">${game.name}</span>
                    <span class="sc-game-count">${game.items.length}</span>
                </div>
                <div class="sc-game-actions">
                    <button class="btn-claim-all">Claim All</button>
                    <span class="sc-toggle-icon">▼</span>
                </div>
            `;

      const iContainer = document.createElement('div');
      iContainer.className = 'sc-items-container collapsed';

      game.items.forEach(item => {
        const row = document.createElement('div');
        row.className = 'sc-item-row';
        row.innerHTML = `
                    <div class="sc-item-meta">
                        <span class="sc-item-name">${item.item_name}</span>
                        <span class="sc-item-msg">Ready</span>
                    </div>
                    <button class="btn-claim" data-sku="${item.item_value}">Claim</button>
                `;
        const btn = row.querySelector('.btn-claim');
        btn.onclick = (e) => {
          e.stopPropagation();
          handleClaim(game.slug, item, btn, row.querySelector('.sc-item-msg'), row);
        };
        iContainer.appendChild(row);
      });

      // Toggle Logic
      gHeader.onclick = (e) => {
        if (e.target.classList.contains('btn-claim-all')) return;
        const isCollapsed = iContainer.classList.contains('collapsed');
        if (isCollapsed) {
          iContainer.classList.remove('collapsed');
          gameSection.classList.add('open');
        } else {
          iContainer.classList.add('collapsed');
          gameSection.classList.remove('open');
        }
      };

      const btnClaimAll = gHeader.querySelector('.btn-claim-all');
      btnClaimAll.onclick = async () => {
        btnClaimAll.disabled = true;
        btnClaimAll.innerText = '...';
        iContainer.classList.remove('collapsed');
        gameSection.classList.add('open');
        const allBtns = Array.from(iContainer.querySelectorAll('.btn-claim')).filter(btn => !btn.disabled && !btn.classList.contains('sc-done'));
        if (allBtns.length === 0) btnClaimAll.innerText = 'Empty';
        else {
          for (let btn of allBtns) {
            btn.click();
            await new Promise(r => setTimeout(r, Math.floor(Math.random() * 600) + 700));
          }
          btnClaimAll.innerText = 'Done';
        }
        setTimeout(() => {
          btnClaimAll.disabled = false;
          btnClaimAll.innerText = 'Claim All';
        }, 2000);
      };

      gameSection.appendChild(gHeader);
      gameSection.appendChild(iContainer);
      body.appendChild(gameSection);
    });

    if (body.children.length === 0) body.innerHTML = '<div style="color:#888;text-align:center;padding:15px;font-size:12px">No active rewards</div>';

    // --- FOOTER ---
    const footer = document.createElement('div');
    footer.className = 'sc-main-footer';
    footer.innerHTML = `
            <button id="btn-manual" class="sc-footer-btn">MANUAL CODE</button>
            <button id="btn-contribute" class="sc-footer-btn">CONTRIBUTE</button>
        `;

    card.appendChild(header);
    card.appendChild(body);
    card.appendChild(footer);

    // FAB
    const fab = document.createElement('div');
    fab.className = `sc-fab ${!isMainCollapsed ? 'hidden' : ''}`;
    fab.innerHTML = `<svg viewBox="0 0 24 24"><path d="M20,6H16V5C16,3.89 15.1,3 14,3H10C8.9,3 8,3.89 8,5V6H4C2.89,6 2,6.89 2,8V19C2,20.11 2.89,21 4,21H20C21.11,21 22,20.11 22,19V8C22,6.89 21.11,6 20,6M15,5C15,4.45 14.55,4 14,4H10C9.45,4 9,4.45 9,5V6H15V5M20,19H4V8H20V19Z"/></svg>`;

    // Events
    const toggleMain = () => {
      const isHidden = card.classList.contains('hidden');
      if (isHidden) {
        card.classList.remove('hidden');
        fab.classList.add('hidden');
        localStorage.setItem(STORAGE_KEY_MAIN, 'false');
        snapToEdge(root);
      } else {
        card.classList.add('sc-closing');
        setTimeout(() => {
          card.classList.add('hidden');
          card.classList.remove('sc-closing');
          fab.classList.remove('hidden');
          localStorage.setItem(STORAGE_KEY_MAIN, 'true');
          snapToEdge(root);
        }, 280);
      }
    };

    header.querySelector('#btn-min').onclick = toggleMain;
    header.querySelector('#btn-close').onclick = () => {
      card.classList.add('sc-closing');
      setTimeout(() => {
        root.remove();
      }, 280);
    };
    fab.onclick = toggleMain;

    footer.querySelector('#btn-manual').onclick = () => showModal('manual');
    footer.querySelector('#btn-contribute').onclick = () => showModal('contribute');

    root.appendChild(card);
    root.appendChild(fab);
    document.body.appendChild(root);

    // --- DRAG LOGIC ---
    function snapToEdge(element) {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      let newLeft = element.style.left;
      let newTop = parseFloat(element.style.top) || rect.top;

      if (centerX < windowWidth / 2) {
        newLeft = '20px';
      } else {
        newLeft = (windowWidth - rect.width - 20) + 'px';
      }

      if (newTop < 10) newTop = 10;
      if (newTop + rect.height > windowHeight - 10) newTop = windowHeight - rect.height - 10;

      element.style.transition = 'all 0.3s cubic-bezier(0.25, 1, 0.5, 1)';
      element.style.left = newLeft;
      element.style.top = newTop + 'px';

      setTimeout(() => {
        element.style.transition = '';
      }, 300);
    }

    function makeDraggable(element, handle) {
      let isDragging = false;
      let startX, startY, initialLeft, initialTop;
      let hasMoved = false;

      const onStart = (e) => {
        if (e.type === 'mousedown' && e.button !== 0) return;
        if (e.type === 'touchstart') {
          // Prevent default scroll on touch
        }

        const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        const clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;

        if (e.type === 'mousedown') e.preventDefault();

        isDragging = true;
        hasMoved = false;
        startX = clientX;
        startY = clientY;

        const rect = element.getBoundingClientRect();
        if (element.style.left === '') {
          element.style.left = rect.left + 'px';
          element.style.top = rect.top + 'px';
          element.style.right = 'auto';
        }

        initialLeft = parseFloat(element.style.left);
        initialTop = parseFloat(element.style.top);

        handle.style.cursor = 'grabbing';
        element.style.transition = 'none';
      };

      const onMove = (e) => {
        if (!isDragging) return;

        const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        const clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;

        if (e.type === 'touchmove') e.preventDefault();

        const dx = clientX - startX;
        const dy = clientY - startY;

        if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
          hasMoved = true;
        }

        let newLeft = initialLeft + dx;
        let newTop = initialTop + dy;

        // Constrain Vertical
        const h = element.offsetHeight;
        const windowHeight = window.innerHeight;

        if (newTop < 10) newTop = 10;
        if (newTop + h > windowHeight - 10) newTop = windowHeight - h - 10;

        element.style.left = `${newLeft}px`;
        element.style.top = `${newTop}px`;
      };

      const onEnd = (e) => {
        if (isDragging) {
          isDragging = false;
          handle.style.cursor = 'grab';

          if (hasMoved) {
            snapToEdge(element);
          }
        }
      };

      // Mouse Events
      handle.addEventListener('mousedown', onStart);
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onEnd);

      // Touch Events
      handle.addEventListener('touchstart', onStart, { passive: false });
      document.addEventListener('touchmove', onMove, { passive: false });
      document.addEventListener('touchend', onEnd);

      handle.addEventListener('click', (e) => {
        if (hasMoved) {
          e.preventDefault();
          e.stopPropagation();
        }
      }, true);
    }

    makeDraggable(root, header);
    makeDraggable(root, fab);
  }

  // --- MODAL BUILDER ---
  function showModal(type) {
    const overlay = document.createElement('div');
    overlay.className = 'sc-modal-overlay';
    const modal = document.createElement('div');
    modal.className = 'sc-modal';
    let title = type === 'manual' ? 'Manual Code' : 'Contribute';

    let bodyHtml = `
            <div class="sc-dropdown" id="game-dropdown">
                <div class="sc-dropdown-btn" id="game-trigger">
                    <span id="game-selected-text">Select Game...</span>
                    <span>▼</span>
                </div>
                <div class="sc-dropdown-content" id="game-menu"></div>
            </div>
        `;

    if (type === 'manual') bodyHtml += `<input type="text" class="sc-input" id="code-input" maxlength="12" placeholder="Enter code"><button class="sc-btn-main" id="btn-submit" disabled>Claim</button>`;
    else bodyHtml += `<textarea class="sc-textarea" id="contrib-input" maxlength="3928" placeholder="Enter your contribution description..."></textarea><div class="sc-disclaimer">Clicking Send will not collect any of your personal information, only the content you contribute.</div><button class="sc-btn-main" id="btn-submit" disabled>Send</button>`;

    modal.innerHTML = `<div class="sc-modal-header"><span class="sc-modal-title">${title}</span><button class="sc-modal-close">✕</button></div><div class="sc-modal-body">${bodyHtml}</div>`;
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    const closeModal = () => {
      modal.classList.add('sc-closing');
      setTimeout(() => overlay.remove(), 280);
    };
    modal.querySelector('.sc-modal-close').onclick = closeModal;
    overlay.onclick = (e) => {
      if (e.target === overlay) closeModal();
    };

    // --- DROPDOWN LOGIC ---
    let selectedGameSlug = null;
    const trigger = modal.querySelector('#game-trigger');
    const menu = modal.querySelector('#game-menu');
    const selectedText = modal.querySelector('#game-selected-text');

    trigger.onclick = () => {
      menu.classList.toggle('show');
      trigger.classList.toggle('active');
    };

    GAMES_LIST.forEach(game => {
      const item = document.createElement('div');
      item.className = 'sc-dropdown-item';
      const imgUrl = game.image_url || '';
      const imgDisplay = imgUrl ? `<img src="${imgUrl}" class="sc-select-img">` : '';
      item.innerHTML = `${imgDisplay}<span class="sc-select-text">${game.name}</span>`;
      item.onclick = () => {
        selectedGameSlug = game.slug;
        selectedText.innerHTML = `${imgDisplay} ${game.name}`;
        selectedText.style.display = 'flex';
        selectedText.style.alignItems = 'center';
        selectedText.style.gap = '8px';
        menu.classList.remove('show');
        trigger.classList.remove('active');
        checkValid();
      };
      menu.appendChild(item);
    });

    window.addEventListener('click', (e) => {
      if (!trigger.contains(e.target) && !menu.contains(e.target)) {
        menu.classList.remove('show');
        trigger.classList.remove('active');
      }
    });

    const btnSubmit = modal.querySelector('#btn-submit');
    const input = type === 'manual' ? modal.querySelector('#code-input') : modal.querySelector('#contrib-input');

    function checkValid() {
      if (type === 'manual') {
        input.value = input.value.toUpperCase();
        btnSubmit.disabled = !(selectedGameSlug && input.value.length === 12);
      }
      else btnSubmit.disabled = !(input.value.length > 0);
    }
    input.oninput = checkValid;

    btnSubmit.onclick = async () => {
      btnSubmit.disabled = true;
      btnSubmit.innerText = 'Processing...';
      if (type === 'manual') {
        const fakeItem = {
          item_type: 'code',
          item_value: input.value,
          item_name: 'Manual Code'
        };
        const fakeBtn = document.createElement('button');
        const fakeStatus = document.createElement('span');
        const fakeRow = document.createElement('div');
        await handleClaim(selectedGameSlug, fakeItem, fakeBtn, fakeStatus, fakeRow);
        btnSubmit.innerText = fakeStatus.innerText;
        setTimeout(() => {
          btnSubmit.innerText = 'Claim';
          checkValid();
        }, 2000);
      } else {
        try {
          const res = await fetch(`${API_BASE}/api/contribute`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              gameSlug: selectedGameSlug,
              content: input.value
            })
          });
          if (res.ok) {
            btnSubmit.innerText = 'Sent!';
            setTimeout(closeModal, 1000);
          } else {
            btnSubmit.innerText = 'Error';
            setTimeout(() => {
              btnSubmit.disabled = false;
              btnSubmit.innerText = 'Send';
            }, 2000);
          }
        } catch (e) {
          btnSubmit.innerText = 'Network Error';
        }
      }
    };
  }

  // --- CLAIM LOGIC ---
  async function handleClaim(gameSlug, item, btn, statusEl, rowEl) {
    if (btn.disabled && !btn.innerText.includes('Success')) return;
    btn.disabled = true;
    btn.innerText = '...';
    statusEl.innerText = 'Wait...';
    statusEl.style.color = '#ffd700';
    rowEl.className = 'sc-item-row status-processing';

    let url = '';
    let body = {};
    const baseUrl = `${STORE_ORIGIN}/api/v3/${gameSlug}`;
    switch (item.item_type) {
      case 'voucher':
        url = `${baseUrl}/store-codes/${item.item_value}/vouchers/claim`;
        body = {
          "selectedSKU": 0
        };
        break;
      case 'reward':
        url = `${baseUrl}/rewards/claim`;
        body = {
          "offerId": item.item_value
        };
        break;
      case 'offer':
        url = `${baseUrl}/offer/claim`;
        body = {
          "skus": [item.item_value]
        };
        break;
      case 'code':
        url = `${baseUrl}/store-codes/${item.item_value}/claim`;
        body = {
          "accountName": ""
        };
        break;
    }

    const finish = (msg, color, btnTxt, isDone) => {
      statusEl.innerText = msg;
      statusEl.style.color = color;
      btn.innerText = btnTxt;
      if (btnTxt === 'Login') {
        btn.classList.remove('sc-done');
        btn.style.background = '#e67e22';
        btn.style.color = '#fff';
        btn.disabled = false;
        btn.onclick = (e) => {
          e.stopPropagation();
          window.location.href = LOGIN_URL;
        };
        rowEl.className = 'sc-item-row status-error';
        return;
      }
      if (isDone) {
        btn.classList.add('sc-done');
        btn.style.background = 'var(--sc-green)';
        btn.style.color = '#fff';
        if (btnTxt === 'Taken') {
          btn.style.background = '#444';
          rowEl.className = 'sc-item-row status-done';
        } else {
          rowEl.className = 'sc-item-row status-success';
        }
      } else {
        btn.disabled = false;
        rowEl.className = 'sc-item-row status-error';
      }
    };

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=UTF-8'
        },
        body: JSON.stringify(body)
      });
      if ((item.item_type === 'voucher' || item.item_type === 'code') && res.status === 404) {
        finish('Expired or Invalid IP Location', 'var(--sc-red)', 'Retry', false);
        return;
      }
      if (res.status === 401 || res.status === 403) {
        finish('Login Required', '#e67e22', 'Login', false);
        return;
      }
      if ((item.item_type === 'voucher' && res.status === 400) || (item.item_type === 'code' && res.status === 500)) {
        finish('Already Claimed', '#999', 'Taken', true);
        return;
      }
      const data = await res.json().catch(() => ({}));
      if (res.status === 200) {
        if (data.ok === false) {
          const err = data.error || '';
          if (err.includes('already_claimed')) finish('Already Claimed', '#999', 'Taken', true);
          else finish('Error', 'var(--sc-red)', 'Retry', false);
        } else finish('Success', 'var(--sc-green)', '✔', true);
      } else finish(`Error ${res.status}`, 'var(--sc-red)', 'Retry', false);
    } catch (e) {
      console.error(e);
      finish('Network Error', 'var(--sc-red)', 'Retry', false);
    }
  }

  setTimeout(init, 500);
})();