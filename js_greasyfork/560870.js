// ==UserScript==
// @name         Skill Progress Dashboard 🌿 Mini Mint Edition
// @namespace    chk.pop.notes.skillbox
// @version      2.1.0
// @description  Compact pastel dashboard showing latest skill progress + stars + alert with refresh button
// @author       chk
// @match        https://*.popmundo.com/World/Popmundo.aspx/Character/Notes/211855
// @match        https://*.popmundo.com/World/Popmundo.aspx/Character/Notes/212559
// @match        https://*.popmundo.com/World/Popmundo.aspx/Character/Notes/212560
// @match        https://*.popmundo.com/World/Popmundo.aspx/Character/Notes/212885
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/560870/Skill%20Progress%20Dashboard%20%F0%9F%8C%BF%20Mini%20Mint%20Edition.user.js
// @updateURL https://update.greasyfork.org/scripts/560870/Skill%20Progress%20Dashboard%20%F0%9F%8C%BF%20Mini%20Mint%20Edition.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const processed = new WeakSet();
  const cache = new Map();
  const requestQueue = [];
  let processing = false;
  let isRefreshing = false;
  let isPanelInitialized = false;

  // Create refresh button
  const refreshBtn = document.createElement("button");
  refreshBtn.id = "skillToggle";
  refreshBtn.innerHTML = "🌿";
  refreshBtn.title = "Refresh Skill Dashboard";
  document.body.appendChild(refreshBtn);

  // Dashboard container (hidden initially)
  const box = document.createElement("div");
  box.id = "skillPanel";
  box.style.display = "none";
  document.body.appendChild(box);

  const style = document.createElement("style");
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

    #skillToggle {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: linear-gradient(135deg, #7EC999, #5EAA7A);
      border: none;
      color: white;
      font-size: 22px;
      cursor: pointer;
      z-index: 10000;
      box-shadow: 0 4px 15px rgba(94, 170, 122, 0.3);
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    #skillToggle:hover {
      transform: scale(1.05);
      box-shadow: 0 6px 20px rgba(94, 170, 122, 0.4);
      background: linear-gradient(135deg, #8ED4A9, #6EBA8A);
    }

    #skillToggle:active {
      transform: scale(0.98);
    }

    #skillToggle.refreshing::before {
      content: "⏳";
      animation: spin 1.5s linear infinite;
    }

    #skillToggle.refreshing:hover::before {
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    #skillPanel {
      position: fixed;
      bottom: 80px;
      right: 20px;
      background: #E8F7EE;
      border: 1px solid #DCEFE6;
      border-radius: 16px;
      padding: 8px 10px;
      font-family: 'Inter', Segoe UI, sans-serif;
      font-size: 12px;
      color: #1D1D1D;
      box-shadow: 0 6px 18px rgba(0,0,0,0.05);
      z-index: 9999;
      min-width: 280px;
      max-width: 400px;
      max-height: 55vh;
      overflow-y: auto;
      overflow-x: hidden;
    }

    .panel-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 6px 4px;
      margin-bottom: 8px;
      cursor: move;
      user-select: none;
    }

    .panel-title {
      font-weight: 600;
      font-size: 13px;
      color: #1D1D1D;
    }

    .close-btn {
      background: none;
      border: none;
      color: #6D6D6D;
      cursor: pointer;
      font-size: 16px;
      padding: 0;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
      line-height: 1;
    }

    .close-btn:hover {
      background: rgba(109, 109, 109, 0.1);
      color: #333;
    }

    /* Scrollbar */
    #skillPanel::-webkit-scrollbar { width: 4px; }
    #skillPanel::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 6px; }
    #skillPanel::-webkit-scrollbar-track { background: transparent; }

    .char-line {
      background: #FFFFFF;
      border-radius: 10px;
      padding: 6px 8px;
      margin-bottom: 6px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.03);
      display: flex;
      flex-direction: column;
      gap: 2px;
      transition: transform 0.1s ease;
    }
    .char-line:hover {
      transform: translateY(-1px);
    }

    .char-summary {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .char-summary .name {
      text-decoration: none;
      color: #1D1D1D;
      font-weight: 600;
      font-size: 12.5px;
    }

    .stars img {
      height: 10px;
      margin-left: 1px;
      vertical-align: middle;
    }

    .char-detail {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 11px;
    }

    .skill-name {
      color: #6D6D6D;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .alert-msg {
      font-size: 9px;
      font-weight: 700;
      border-radius: 6px;
      padding: 2px 6px;
      text-transform: uppercase;
    }
    .alert-msg.ready {
      background: #FFFDD0;
      color: #535200;
    }
    .alert-msg.notready {
      background: #FFECEC;
      color: #B60000;
    }
    .alert-msg.fail {
      background: #f5ff6a;
      color: #55573c;
    }

    .loader {
      text-align: center;
      padding: 20px;
    }
    .loader:after {
      content: '';
      width: 16px;
      height: 16px;
      border: 2px solid #DCEFE6;
      border-top-color: #333;
      border-radius: 50%;
      display: inline-block;
      animation: spin 0.8s linear infinite;
    }
  `;
  document.head.appendChild(style);

  function enqueueRequest(url, callback, errorCb) {
    requestQueue.push({ url, callback, errorCb });
    processQueue();
  }

  function processQueue() {
    if (processing || requestQueue.length === 0) return;
    processing = true;
    const { url, callback, errorCb } = requestQueue.shift();
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = url;

    iframe.onload = () => {
      try {
        callback(iframe.contentDocument);
      } catch (e) {
        if (errorCb) errorCb(e);
      } finally {
        iframe.remove();
        processing = false;
        setTimeout(processQueue, 100);
      }
    };

    iframe.onerror = () => {
      iframe.remove();
      processing = false;
      if (errorCb) errorCb(new Error("iframe load error"));
      setTimeout(processQueue, 100);
    };

    document.body.appendChild(iframe);
  }

  function initializePanel() {
    if (isPanelInitialized) return;

    box.innerHTML = `
      <div class="panel-header">
        <div class="panel-title">Skill Progress</div>
        <button class="close-btn" title="Hide Panel">×</button>
      </div>
      <div class="panel-content"></div>
    `;

    // Add drag functionality
    let isDragging = false;
    let offset = { x: 0, y: 0 };
    const header = box.querySelector('.panel-header');

    header.addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDrag);

    function startDrag(e) {
      e.preventDefault();
      isDragging = true;
      const rect = box.getBoundingClientRect();
      offset.x = e.clientX - rect.left;
      offset.y = e.clientY - rect.top;
      box.style.cursor = 'grabbing';
    }

    function drag(e) {
      if (!isDragging) return;
      e.preventDefault();

      const newX = e.clientX - offset.x;
      const newY = e.clientY - offset.y;

      box.style.right = 'auto';
      box.style.bottom = 'auto';
      box.style.left = `${newX}px`;
      box.style.top = `${newY}px`;
    }

    function stopDrag() {
      isDragging = false;
      box.style.cursor = '';
    }

    box.querySelector('.close-btn').addEventListener('click', () => {
      box.style.display = 'none';
    });

    isPanelInitialized = true;
  }

  function refreshDashboard() {
    if (isRefreshing) return;

    isRefreshing = true;
    refreshBtn.classList.add('refreshing');
    refreshBtn.innerHTML = "";

    const contentArea = box.querySelector('.panel-content') || box;
    contentArea.querySelectorAll(".char-line, .loader").forEach(el => el.remove());

    const loader = document.createElement("div");
    loader.className = "loader";
    contentArea.appendChild(loader);

    const links = Array.from(document.querySelectorAll(".notebody a[href^='/World/Popmundo.aspx/Character/']"))
      .filter(a => !processed.has(a));

    const tasks = links.map(link => {
      const href = link.getAttribute("href") || "";
      const match = href.match(/Character\/(\d+)/);
      if (!match) return null;
      processed.add(link);

      const charId = match[1];
      const charName = link.textContent.trim();
      const diaryUrl = `${location.origin}/World/Popmundo.aspx/Character/Diary/${charId}`;
      const skillsUrl = `${location.origin}/World/Popmundo.aspx/Character/Skills/${charId}`;

      return new Promise(resolve => {
        if (cache.has(charId)) return resolve(cache.get(charId));

        enqueueRequest(diaryUrl, doc => {
          const uls = doc.querySelectorAll(".diaryExtraspace ul");
          let latestSkillId = null, latestSkillName = null, alertMsg = null;

          outer: for (const ul of uls) {
            for (const li of ul.querySelectorAll("li")) {
              const text = li.textContent.toLowerCase();
              const anchor = li.querySelector("a[href*='/SkillType/']");
              const extract = () => {
                if (anchor) {
                  latestSkillName = anchor.textContent.trim();
                  const m = anchor.href.match(/SkillType\/(\d+)/);
                  if (m) latestSkillId = m[1];
                }
              };
              if (text.includes("improved my skills in") || text.includes("slowly improved my skills in") || text.includes("perfecting my skills in")) { extract(); break outer; }
              if (text.includes("went to class to study")) { extract(); break outer; }
              if (text.includes("quickly swung by the university") || text.includes("decided to spend my time at")) { extract(); alertMsg = "NOT IN UNI!"; break outer; }
              if (text.includes("finally! i've mastered")) { extract(); alertMsg = "FINISHED!"; break outer; }
              if (text.includes("failed to improve") || text.includes("wasting time")) { extract(); alertMsg = "FAIL"; break outer; }
            }
          }

          if (!latestSkillId || !latestSkillName) {
            const html = `<div class="char-line"><div class="char-summary"><a href="/World/Popmundo.aspx/Character/${charId}" class="name" target="_blank">${charName}</a></div><div class="char-detail"><span class="skill-name">No skill data</span></div></div>`;
            cache.set(charId, html);
            resolve(html);
            return;
          }

          enqueueRequest(skillsUrl, doc2 => {
            const row = Array.from(doc2.querySelectorAll("tr")).find(r =>
              r.querySelector(`a[href*='/SkillType/${latestSkillId}']`)
            );
            let rating = null;
            if (row) {
              const starDiv = row.querySelector("div[title]");
              if (starDiv) {
                const title = starDiv.getAttribute("title") || "";
                const m = title.match(/([\d.]+) of 5/);
                if (m) rating = parseFloat(m[1]);
              }
            }

            let starsHTML = "";
            if (rating != null) {
              const full = Math.floor(rating);
              const half = rating % 1 >= 0.5;
              const empty = 5 - full - (half ? 1 : 0);
              for (let i = 0; i < full; i++) starsHTML += `<img src="https://73.popmundo.com/Static/Icons/TinyStar_Gold.png">`;
              if (half) starsHTML += `<img src="https://73.popmundo.com/Static/Icons/TinyStar_White.png">`;
              for (let i = 0; i < empty; i++) starsHTML += `<img src="https://73.popmundo.com/Static/Icons/TinyStar_Grey.png">`;
            }

            let alertHtml = "";
            if (alertMsg === "FINISHED!") alertHtml = `<span class="alert-msg ready">FINISHED</span>`;
            else if (alertMsg === "NOT IN UNI!") alertHtml = `<span class="alert-msg notready">NOT IN UNI</span>`;
            else if (alertMsg === "FAIL") alertHtml = `<span class="alert-msg fail">FAIL</span>`;

            const html = `
              <div class="char-line">
                <div class="char-summary">
                  <a href="/World/Popmundo.aspx/Character/${charId}" target="_blank" class="name">${charName}</a>
                  <span class="stars">${starsHTML}</span>
                </div>
                <div class="char-detail">
                  <span class="skill-name">${latestSkillName}</span>
                  ${alertHtml}
                </div>
              </div>`;
            cache.set(charId, html);
            resolve(html);
          }, () => resolve(`<div class="char-line"><div class="char-summary"><a href="/World/Popmundo.aspx/Character/${charId}" target="_blank" class="name">${charName}</a></div><div class="char-detail"><span class="skill-name">Skill load error</span></div></div>`));
        }, () => resolve(`<div class="char-line"><div class="char-summary"><a href="/World/Popmundo.aspx/Character/${charId}" target="_blank" class="name">${charName}</a></div><div class="char-detail"><span class="skill-name">Diary error</span></div></div>`));
      });
    });

    Promise.all(tasks.filter(Boolean)).then(results => {
      loader.remove();
      contentArea.insertAdjacentHTML("beforeend", results.join(""));
      isRefreshing = false;
      refreshBtn.classList.remove('refreshing');
      refreshBtn.innerHTML = "🌿";
    }).catch(() => {
      isRefreshing = false;
      refreshBtn.classList.remove('refreshing');
      refreshBtn.innerHTML = "🌿";
    });
  }

  // Main refresh button click event
  refreshBtn.addEventListener('click', () => {
    if (!isPanelInitialized) {
      initializePanel();
    }

    if (box.style.display === 'none') {
      box.style.display = 'block';
    }

    refreshDashboard();
  });
})();