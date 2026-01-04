// ==UserScript==
// @name         Recon Dashboard ✨ Micro Compact
// @namespace    chk.diary
// @version      5.6.1
// @description  Ultra-compact premium recon tracker with refresh button
// @match        https://*.popmundo.com/World/Popmundo.aspx/Character/Notes/212115
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560871/Recon%20Dashboard%20%E2%9C%A8%20Micro%20Compact.user.js
// @updateURL https://update.greasyfork.org/scripts/560871/Recon%20Dashboard%20%E2%9C%A8%20Micro%20Compact.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const characters = [
    { id: 3620400, name: "Chuu Xxnana" },
    { id: 3616422, name: "Juan Guanare" },
    { id: 3613365, name: "JiaYan Xie" },
    { id: 3614576, name: "Ruth Kemp" },
    { id: 3579423, name: "Tomie Ito 富江" },
    { id: 3613832, name: "Kookie XXIN ア" },
    { id: 3616694, name: "Betty Doty" },
    { id: 3577905, name: "Kia Rivera" },
    { id: 3603887, name: "Keiji クーナ" },
    { id: 3579984, name: "Kai Kuno" },
    { id: 3617774, name: "Ken'ichi Yasui" },
    { id: 3612251, name: "Eva Lavender" },

  ];

  const host = location.host;
  let isRefreshing = false;
  let panelPosition = { x: 20, y: 0 };
  let isPanelInitialized = false;

  // Create refresh button
  const refreshBtn = document.createElement("button");
  refreshBtn.id = "reconToggle";
  refreshBtn.innerHTML = "🎯";
  refreshBtn.title = "Refresh Recon Dashboard";
  document.body.appendChild(refreshBtn);

  // Create panel (hidden initially)
  const panel = document.createElement("div");
  panel.id = "reconPanel";
  panel.style.display = "none";
  document.body.appendChild(panel);

  const style = document.createElement('style');
  document.head.appendChild(style);
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@500;600;700&display=swap');

    #reconToggle {
      position: fixed;
      bottom: 15px;
      left: 15px;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: linear-gradient(135deg, #fff);
      border: none;
      color: white;
      font-size: 26px;
      line-height: 2.5;
      cursor: pointer;
      z-index: 10000;
      box-shadow: 0 4px 15px rgba(100, 70, 140, 0.3);
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    #reconToggle:hover {
      transform: scale(1.05);
      box-shadow: 0 6px 20px rgba(100, 70, 140, 0.4);
      background: linear-gradient(135deg, #fff);
    }

    #reconToggle:active {
      transform: scale(0.98);
    }

    #reconToggle.refreshing::before {
      content: "🎯";

    }

    #reconToggle.refreshing:hover::before {

    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    #reconPanel {
      position: fixed;
      z-index: 9999;
      width: 210px;
      max-height: 315px;
      border-radius: 10px;
      overflow: hidden;
      font-family: 'Inter', system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
      box-shadow: 0 8px 25px rgba(70,40,100,0.15);
      background: linear-gradient(180deg, rgba(255,255,255,0.98), rgba(250,246,255,0.98));
      border: 1px solid rgba(200,180,220,0.35);
      font-size: 11px;
    }

    .panel-header {
      display:flex;
      align-items:center;
      justify-content:space-between;
      padding: 6px 9px;
      background: linear-gradient(90deg, rgba(255,255,255,0.98), rgba(250,246,255,0.98));
      border-bottom: 1px solid rgba(220,200,240,0.20);
      gap:5px;
      cursor: move;
      user-select: none;
    }

    .panel-title {
      font-weight:700;
      font-size:11px;
      color:#5b4776;
    }

    .panel-sub {
      font-size:9px;
      color:#9a86b2;
    }

    .panel-actions {
      display: flex;
      gap: 8px;
      align-items: center;
    }

    .close-btn {
      background: none;
      border: none;
      color: #9a86b2;
      cursor: pointer;
      font-size: 14px;
      padding: 0;
      border-radius: 50%;
      width: 18px;
      height: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
      line-height: 1;
    }

    .close-btn:hover {
      background: rgba(155, 134, 178, 0.1);
      color: #7a66a2;
    }

    .panel-content {
      padding: 6px;
      max-height: calc(290px - 36px);
      overflow-y: auto;
      display:flex;
      flex-direction:column;
      gap:5px;
      scrollbar-width: thin;
      scrollbar-color: rgba(150,120,190,0.42) transparent;
    }

    .panel-content::-webkit-scrollbar { width: 5px; }
    .panel-content::-webkit-scrollbar-thumb { background: rgba(150,120,190,0.42); border-radius: 5px; border: 1px solid rgba(255,255,255,0.15); }
    .panel-content::-webkit-scrollbar-track { background: transparent; }

    .char-row {
      display:flex;
      gap:6px;
      align-items:center;
      background: linear-gradient(180deg, rgba(255,255,255,0.98), rgba(248,244,250,0.98));
      border-radius: 8px;
      padding: 7px;
      border: 1px solid rgba(225,210,240,0.28);
      box-shadow: 0 3px 10px rgba(100,70,140,0.04);
      transition: transform 0.2s ease;
    }

    .char-row:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(100,70,140,0.08);
    }

    .char-info {
      flex:1;
      min-width:0;
      display:flex;
      flex-direction:column;
      gap:3px;
    }

    .char-name {
      display:flex;
      align-items:center;
      gap:5px;
      font-weight:700;
      font-size:11px;
      color:#3b2a4f;
      text-decoration:none;
      white-space:nowrap;
      overflow:hidden;
      text-overflow:ellipsis;
    }

    .char-time {
      font-size:9px;
      color:#947fb3;
      font-weight:600;
    }

    .char-marbles {
      font-size:9px;
      color:#8b7aa8;
      font-weight:600;
      display:flex;
      align-items:center;
      gap:3px;
    }

    .char-marbles::before {
      content: "🤍";
      font-size:10px;
    }

    .progress-mini {
      height:4px;
      background: rgba(160,140,200,0.12);
      border-radius: 4px;
      overflow:hidden;
      margin-top:3px;
    }

    .progress-mini-fill { height:100%; background: linear-gradient(90deg,#b592e0,#8b6bb8); transition:width 0.28s ease; }

    .status-dot {
      width:26px;
      height:26px;
      border-radius:7px;
      display:flex;
      align-items:center;
      justify-content:center;
      color:#fff;
      font-weight:700;
      font-size:10px;
      flex-shrink:0;
      box-shadow: 0 3px 8px rgba(100,70,140,0.06);
    }

    .status-dot.ready { background: linear-gradient(135deg,#48c48f,#2ea26f); }
    .status-dot.done  { background: linear-gradient(135deg,#f4a860,#e38f44); }
    .status-dot.notready { background: linear-gradient(135deg,#e58fcf,#cc6fb8); }
    .status-dot.orange { background: linear-gradient(135deg,#f5b35c,#e88f2a); }

    .loading {
      display:flex;
      gap:6px;
      align-items:center;
      justify-content:center;
      padding: 10px 0;
      color:#8b7aa8;
      font-size:11px;
    }

    .spinner { width:10px; height:10px; border:2px solid rgba(160,140,200,0.22); border-top-color:#a78cc8; border-radius:50%; animation:spin 0.8s linear infinite; }

    .error-message {
      color: #e74c3c;
      font-size: 10px;
      text-align: center;
      padding: 10px;
    }
  `;

  const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

  async function getMarbleCount(charId) {
    try {
      const response = await fetch(`https://${host}/World/Popmundo.aspx/Character/${charId}`);
      const html = await response.text();
      const doc = new DOMParser().parseFromString(html, "text/html");
      const marbleRow = [...doc.querySelectorAll('.charMainValues table tr')].find(tr =>
        tr.querySelector('img[title="Marbles"]')
      );
      if (marbleRow) {
        const marbleText = marbleRow.querySelector('td:last-child')?.innerText.trim();
        return marbleText ? parseInt(marbleText) : 0;
      }
      return 0;
    } catch {
      return 0;
    }
  }

  function positionPanel() {
    const toggleRect = refreshBtn.getBoundingClientRect();
    const panelHeight = panel.offsetHeight || 290;

    const panelTop = toggleRect.top - panelHeight - 10;
    if (panelTop < 10) {
      panel.style.top = `${toggleRect.bottom + 10}px`;
    } else {
      panel.style.top = `${panelTop}px`;
    }

    panel.style.left = `${toggleRect.left}px`;
    panelPosition = { x: toggleRect.left, y: parseInt(panel.style.top) };
  }

  async function refresh() {
    if (isRefreshing) return;

    isRefreshing = true;
    refreshBtn.classList.add('refreshing');
    refreshBtn.innerHTML = "";

    panel.querySelector('.panel-content').innerHTML = `
      <div class="loading"><span class="spinner"></span>Loading...</div>
    `;

    setTimeout(() => {
      positionPanel();
    }, 10);

    try {
      const results = [];
      for (let i = 0; i < characters.length; i++) {
        const c = characters[i];
        if (i > 0) await delay(200);

        try {
          const response = await fetch(`https://${host}/World/Popmundo.aspx/Character/Diary/${c.id}`);
          if (!response.ok) throw new Error(`HTTP ${response.status}`);

          const html = await response.text();
          const doc = new DOMParser().parseFromString(html, "text/html");
          const entries = [...doc.querySelectorAll("ul.diaryExtraspace li ul li")].reverse();
          let recon = 0, done = false, last = "", time = "?", isDoneWith = false;

          for (const li of entries) {
            const txt = li.innerText.toLowerCase();
            if (txt.includes("focus on reconnaissance") || txt.includes("best thing for my career")) {
              recon = 0; done = false; isDoneWith = false;
              continue;
            }
            if (txt.includes("i'm done with") || txt.includes("i'm done gathering information")) {
              isDoneWith = true;
              last = li.innerText.trim();
              const m = last.match(/^(\d{1,2}:\d{2}\s*(AM|PM))/i);
              if (m) time = m[1];
              continue;
            }
            if (txt.includes("swiftly") || txt.includes("gathering") || txt.includes("contemplate") || txt.includes("scouted")) {
              recon++;
              last = li.innerText.trim();
              if (txt.includes("gathering")) done = true;
              const m = last.match(/^(\d{1,2}:\d{2}\s*(AM|PM))/i);
              if (m) time = m[1];
            }
          }

          await delay(100);
          const marbles = await getMarbleCount(c.id);

          let status = `${recon}`;
          let cls = "notready";
          if (isDoneWith) {
            status = "✓";
            cls = "orange";
          } else if (done || recon >= 4) {
            status = "✓";
            cls = "ready";
          } else if (recon > 0) {
            cls = "done";
          }

          results.push({ ...c, status, cls, time, entry: last || "No recent activity", recon, marbles });
        } catch (error) {
          console.error(`Error fetching ${c.name}:`, error);
          results.push({ ...c, status: "?", cls: "notready", time: "?", entry: "Failed to load", recon: -1, marbles: 0 });
        }
      }

      const rank = r => r.status === "✓" ? (r.cls === "orange" ? 1 : 0) : r.status.match(/^(\d)/) ? 5 - +RegExp.$1 : 6;
      results.sort((a, b) => rank(a) - rank(b));

      panel.querySelector('.panel-content').innerHTML = results.map(r => {
        let progressHtml = '';
        if (r.cls === 'ready' || r.cls === 'orange') {
          progressHtml = `<div class="progress-mini"><div class="progress-mini-fill" style="width:100%"></div></div>`;
        } else if (r.cls === 'done' && r.recon > 0 && r.recon < 4) {
          progressHtml = `<div class="progress-mini"><div class="progress-mini-fill" style="width:${(r.recon/4)*100}%"></div></div>`;
        }

        return `
          <div class="char-row">
            <div class="char-info">
              <a class="char-name" href="https://${host}/World/Popmundo.aspx/Character/${r.id}" target="_blank">${r.name}</a>
              <div style="display:flex;gap:8px;align-items:center;">
                <div class="char-time">${r.time}${r.recon > 0 && r.recon < 4 ? ` · ${r.recon}/4` : ''}</div>
                <div class="char-marbles">${r.marbles}</div>
              </div>
              ${progressHtml}
            </div>
            <div class="status-dot ${r.cls}">${r.status}</div>
          </div>
        `;
      }).join('');

      const timeString = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
      panel.querySelector('.panel-sub').textContent = `Updated: ${timeString}`;

      setTimeout(() => {
        positionPanel();
      }, 10);

    } catch (error) {
      console.error('Refresh error:', error);
      panel.querySelector('.panel-content').innerHTML = `
        <div class="error-message">
          Error loading data<br>
          <small>Click refresh to try again</small>
        </div>
      `;
    } finally {
      isRefreshing = false;
      refreshBtn.classList.remove('refreshing');
      refreshBtn.innerHTML = "🎯";
    }
  }

  function initializePanel() {
    if (isPanelInitialized) return;

    panel.innerHTML = `
      <div class="panel-header">
        <div>
          <div class="panel-title">Recon Dashboard</div>
          <div class="panel-sub">Click to refresh</div>
        </div>
        <div class="panel-actions">
          <button class="close-btn" title="Hide Panel">×</button>
        </div>
      </div>
      <div class="panel-content">
        <div class="loading">Ready to load</div>
      </div>
    `;

    // Add drag functionality
    let isDragging = false;
    let offset = { x: 0, y: 0 };
    const header = panel.querySelector('.panel-header');

    header.addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDrag);

    function startDrag(e) {
      e.preventDefault();
      isDragging = true;
      const rect = panel.getBoundingClientRect();
      offset.x = e.clientX - rect.left;
      offset.y = e.clientY - rect.top;
      panel.style.cursor = 'grabbing';
    }

    function drag(e) {
      if (!isDragging) return;
      e.preventDefault();

      const newX = e.clientX - offset.x;
      const newY = e.clientY - offset.y;

      panel.style.left = `${newX}px`;
      panel.style.top = `${newY}px`;
      panel.style.bottom = 'auto';

      panelPosition = { x: newX, y: newY };
    }

    function stopDrag() {
      isDragging = false;
      panel.style.cursor = '';
    }

    panel.querySelector('.close-btn').addEventListener('click', () => {
      panel.style.display = 'none';
    });

    isPanelInitialized = true;
  }

  // Main refresh button click event
  refreshBtn.addEventListener('click', () => {
    if (!isPanelInitialized) {
      initializePanel();
    }

    if (panel.style.display === 'none') {
      panel.style.display = 'block';
      positionPanel();
    }

    refresh();
  });

  // Reposition panel on window resize
  window.addEventListener('resize', () => {
    if (panel.style.display !== 'none') {
      const toggleRect = refreshBtn.getBoundingClientRect();
      const panelRect = panel.getBoundingClientRect();

      const distance = Math.sqrt(
        Math.pow(toggleRect.left - panelRect.left, 2) +
        Math.pow(toggleRect.top - panelRect.top, 2)
      );

      if (distance < 100) {
        positionPanel();
      }
    }
  });
})();