// ==UserScript==
// @name         Smol - Veyra Farm Extension
// @namespace    http://violentmonkey.github.io/smol-veyra-farm-extension
// @version      1.3
// @author       Smol
// @description  Automated energy farming with draggable HUD, Farming Mode, Auto Login and Auto Resume farm - integrates with Smol Veyra Script Extension Hub for sidebar control and image blocking optimization.
// @match        https://demonicscans.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=demonicscans.org
// @grant        none
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/551247/Smol%20-%20Veyra%20Farm%20Extension.user.js
// @updateURL https://update.greasyfork.org/scripts/551247/Smol%20-%20Veyra%20Farm%20Extension.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // edit this email and password value and set autologin to true if you use this script as standalone
  var YOUR_EMAIL = 'WRITE_YOUR_EMAIL_HERE'; // change into your actual email
  var YOUR_PASSWORD = 'WRITE_YOUR_PASSWORD_HERE'; // change into your actual password
  var AUTO_LOGIN = false; // change to true if you wish to enable autologin feature

  // Initialize farming localStorage if not exists
  if (localStorage.getItem('veyra-farming-automation') === null) {
    localStorage.setItem('veyra-farming-automation', 'false');
  }
  if (localStorage.getItem('minus-energy-cap') === null) {
    localStorage.setItem('minus-energy-cap', '30');
  }
  if (localStorage.getItem('target-farming-energy') === null) {
    localStorage.setItem('target-farming-energy', '150');
  }
  if (localStorage.getItem('farming-mode') === null) {
    localStorage.setItem('farming-mode', 'energy-cap');
  }
  if (localStorage.getItem('smol-script-expanded') === null) {
    localStorage.setItem('smol-script-expanded', 'false');
  }
  if (localStorage.getItem('smol-script-farm-enabled') === null) {
    localStorage.setItem('smol-script-farm-enabled', 'true');
  }
  if (localStorage.getItem('smol-script-autologin-enabled') === null) {
    localStorage.setItem('smol-script-autologin-enabled', AUTO_LOGIN.toString());
  }

  // Check if image blocking is available
  const hasImageBlocking = typeof window.smolImageBlockEnabled !== 'undefined';

  // Initialize extension
  if (window.location.hostname === 'demonicscans.org') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => setTimeout(initAsExtension, 250));
    } else {
      setTimeout(initAsExtension, 250);
    }
  }

  function initAsExtension() {
    const smolScript = window.smolScript ? window.smolScript : undefined
    const gameSidebar = document.querySelector('#game-sidebar');
    const scriptExtension = document.getElementById('script-extension');
        
    if (smolScript && gameSidebar && scriptExtension) {
      const scriptExpanded = document.getElementById('script-expanded');
      if (scriptExpanded && !document.getElementById('farm-script-toggle')) {
        const farmDiv = document.createElement('div');
        farmDiv.innerHTML = `
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <div style="font-size: 12px; color: #888;"><span>🌾 Farm Script</span></div>
            <input type="checkbox" id="farm-script-toggle" ${localStorage.getItem('smol-script-farm-enabled') === 'true' ? 'checked' : ''}></input>
          </div>
        `;
        scriptExpanded.appendChild(farmDiv);
        
        document.getElementById('farm-script-toggle').addEventListener('change', (e) => {
          localStorage.setItem('smol-script-farm-enabled', e.target.checked.toString());
          window.location.reload();
        });
      }
    }
    
    if (localStorage.getItem('smol-script-farm-enabled') === 'true' && (!window.location.pathname.includes('.php') || window.location.pathname === '/index.php')) {
      initFarmingExtension();
    } else if (localStorage.getItem('smol-script-farm-enabled') === 'true' && window.location.pathname === '/signin.php') {
      autoLogin()
    }
  }

  function autoLogin() {
    if (!window.location.href.includes("signin.php")) return false;

    const isEnabled = localStorage.getItem('smol-script-autologin-enabled') === 'true';
    if (!isEnabled) return false;

    const email = YOUR_EMAIL;
    const password = YOUR_PASSWORD;

    if (!email || !password) return false;

    const emailInput = document.evaluate('//*[@id="login-container"]/form/input[1]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    const passwordInput = document.evaluate('//*[@id="login-container"]/form/input[2]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    const loginBtn = document.evaluate('//*[@id="login-container"]/form/input[3]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

    if (emailInput && passwordInput && loginBtn) {
      emailInput.value = email;
      passwordInput.value = password;
      loginBtn.click();
      return true;
    }
    return false;
  }

  function initFarmingExtension() {
    createFarmingHUD();

    if (getFarmingAutomation()) {
      setTimeout(runFarming, 1000);
    }
  }

  function createFarmingHUD() {
    if (document.getElementById('farming-hud-main')) return;

    const hud = document.createElement('div');
    hud.id = 'farming-hud-main';
    hud.className = 'veyra-glass';
    
    // Load saved position or use default
    const savedPosition = sessionStorage.getItem('farm-hud-position');
    if (savedPosition) {
      const pos = JSON.parse(savedPosition);
      hud.style.cssText = `
        position: fixed;
        left: ${pos.left}px;
        top: ${pos.top}px;
        z-index: 2147483647;
      `;
    } else {
      hud.style.cssText = `
        position: fixed;
        bottom: 16px;
        right: 16px;
        z-index: 2147483647;
      `;
    }

    document.body.appendChild(hud);
    makeDraggable(hud);
    updateFarmingHUD();
  }

  function makeDraggable(element) {
    let isDragging = false;
    let startX, startY, startLeft, startTop;

    element.addEventListener('mousedown', (e) => {
      if (e.target.classList.contains('drag-handle')) {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        const rect = element.getBoundingClientRect();
        startLeft = rect.left;
        startTop = rect.top;
        element.style.cursor = 'grabbing';
        e.preventDefault();
      }
    });

    document.addEventListener('mousemove', (e) => {
      if (isDragging) {
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        const newLeft = startLeft + deltaX;
        const newTop = startTop + deltaY;
        element.style.left = newLeft + 'px';
        element.style.top = newTop + 'px';
        element.style.right = 'auto';
        element.style.bottom = 'auto';
      }
    });

    document.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        element.style.cursor = 'default';
        // Save position to sessionStorage
        const rect = element.getBoundingClientRect();
        sessionStorage.setItem('farm-hud-position', JSON.stringify({
          left: rect.left,
          top: rect.top
        }));
      }
    });
  }

  function updateFarmingHUD() {
    const hud = document.getElementById('farming-hud-main');
    if (!hud) return;

    const isRunning = getFarmingAutomation();
    const farmingMode = localStorage.getItem('farming-mode') || 'energy-cap';
    const energyCap = localStorage.getItem('minus-energy-cap') || '30';
    const energyTarget = localStorage.getItem('target-farming-energy') || '150';

    // Get current stamina and farm values
    const stamina = getStamina();
    const farm = getFarm();
    const staminaText = stamina ? `${stamina.current}/${stamina.max}` : '0/0';
    const farmText = farm ? `${farm.current}/${farm.max}` : '0/0';

    let statusText = 'Idle';
    if (isRunning) {
      statusText = 'Farming Energy';
    }

    const content = `
      <div class="veyra-header">
        <div class="veyra-title">Veyra — Farm</div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span class="veyra-pill ${isRunning ? 'pill-live' : 'pill-stop'}">${isRunning ? 'RUNNING' : 'PAUSED'}</span>
          <div class="drag-handle" style="width: 16px; height: 16px; background: rgba(255,255,255,0.3); border-radius: 3px; cursor: grab; display: flex; align-items: center; justify-content: center; font-size: 10px;">⋮⋮</div>
        </div>
      </div>
      <div class="veyra-body">
        <div class="veyra-row">
          <div>Mode</div>
          <div><select id="farm-mode-select" class="veyra-select" ${isRunning ? 'disabled' : ''}>
            <option value="energy-cap" ${farmingMode === 'energy-cap' ? 'selected' : ''}>Energy Cap</option>
            <option value="energy-target" ${farmingMode === 'energy-target' ? 'selected' : ''}>Energy Target</option>
          </select></div>
        </div>
        <div class="veyra-row" id="energy-cap-row" style="display: ${farmingMode === 'energy-cap' ? 'flex' : 'none'}">
          <div>Energy Cap</div>
          <div><input id="farm-energy-cap" type="number" class="veyra-input" min="0" value="${energyCap}" ${isRunning ? 'disabled' : ''}></div>
        </div>
        <div class="veyra-row" id="energy-target-row" style="display: ${farmingMode === 'energy-target' ? 'flex' : 'none'}">
          <div>Energy Target</div>
          <div><input id="farm-energy-target" type="number" class="veyra-input" min="0" value="${energyTarget}" ${isRunning ? 'disabled' : ''}></div>
        </div>
        <div class="veyra-row">
          <div>Auto Farm</div>
          <div><button id="farm-hud-toggle" class="veyra-btn">${isRunning ? 'Stop' : 'Start'}</button></div>
        </div>
        ${hasImageBlocking ? `<div class="veyra-row">
          <div>Block Images</div>
          <div><input id="farm-image-block" type="checkbox" ${localStorage.getItem('smol-script-noimage') === 'true' ? 'checked' : ''}></div>
        </div>` : ''}
        <div class="veyra-divider"></div>
        <div class="veyra-row">
          <div>Stamina</div>
          <div style="color:var(--glass-muted)">${staminaText}</div>
        </div>
        <div class="veyra-row">
          <div>Farm</div>
          <div style="color:var(--glass-muted)">${farmText}</div>
        </div>
        <div class="veyra-divider"></div>
        <div class="veyra-row">
          <div>Status</div>
          <div>${statusText}</div>
        </div>
      </div>
    `;

    hud.innerHTML = content;

    // Setup event listeners
    setTimeout(() => {
      const toggleBtn = document.getElementById('farm-hud-toggle');
      const modeSelect = document.getElementById('farm-mode-select');
      const energyCapInput = document.getElementById('farm-energy-cap');
      const energyTargetInput = document.getElementById('farm-energy-target');
      const energyCapRow = document.getElementById('energy-cap-row');
      const energyTargetRow = document.getElementById('energy-target-row');

      if (toggleBtn && !toggleBtn.hasAttribute('data-listener-added')) {
        toggleBtn.addEventListener('click', toggleFarmingFromHUD);
        toggleBtn.setAttribute('data-listener-added', 'true');
      }

      if (modeSelect && !modeSelect.hasAttribute('data-listener-added')) {
        modeSelect.addEventListener('change', (e) => {
          localStorage.setItem('farming-mode', e.target.value);
          energyCapRow.style.display = e.target.value === 'energy-cap' ? 'flex' : 'none';
          energyTargetRow.style.display = e.target.value === 'energy-target' ? 'flex' : 'none';
        });
        modeSelect.setAttribute('data-listener-added', 'true');
      }

      if (energyCapInput && !energyCapInput.hasAttribute('data-listener-added')) {
        energyCapInput.addEventListener('change', (e) => {
          const value = Math.max(0, parseInt(e.target.value) || 30);
          localStorage.setItem('minus-energy-cap', value.toString());
          e.target.value = value;
        });
        energyCapInput.setAttribute('data-listener-added', 'true');
      }

      if (energyTargetInput && !energyTargetInput.hasAttribute('data-listener-added')) {
        energyTargetInput.addEventListener('change', (e) => {
          const value = Math.max(0, parseInt(e.target.value) || 150);
          localStorage.setItem('target-farming-energy', value.toString());
          e.target.value = value;
        });
        energyTargetInput.setAttribute('data-listener-added', 'true');
      }

      const imageBlockCheckbox = document.getElementById('farm-image-block');
      if (imageBlockCheckbox && !imageBlockCheckbox.hasAttribute('data-listener-added')) {
        imageBlockCheckbox.addEventListener('change', (e) => {
          localStorage.setItem('smol-script-noimage', e.target.checked.toString());
          window.dispatchEvent(new StorageEvent('storage', {
            key: 'smol-script-noimage',
            newValue: e.target.checked.toString()
          }));
        });
        imageBlockCheckbox.setAttribute('data-listener-added', 'true');
      }
    }, 100);
  }

  function toggleFarmingFromHUD() {
    const newRunningState = !getFarmingAutomation();
    setFarmingAutomation(newRunningState);
    
    // Control image blocking during farming
    if (hasImageBlocking) {
      if (newRunningState) {
        localStorage.setItem('smol-script-noimage', 'true');
      } else {
        // Restore previous state when stopping
        const checkbox = document.getElementById('farm-image-block');
        if (checkbox) {
          localStorage.setItem('smol-script-noimage', checkbox.checked.toString());
        }
      }
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'smol-script-noimage',
        newValue: localStorage.getItem('smol-script-noimage')
      }));
    }
    
    updateFarmingHUD();

    if (newRunningState) {
      showNotification('Starting farming automation...', 'success');
      runFarming();
    } else {
      showNotification('Farming automation stopped', 'info');
    }
  }

  // Farming automation functions
  function getFarmingAutomation() {
    return localStorage.getItem('veyra-farming-automation') === 'true';
  }

  function setFarmingAutomation(value) {
    localStorage.setItem('veyra-farming-automation', value.toString());
  }

  function getStamina() {
    const staminaEl = document.evaluate(
      '//*[@id="discuscontainer"]/div[1]/div[1]/div[2]/span[1]/span',
      document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
    ).singleNodeValue;
    if (!staminaEl) return null;
    const [current, max] = staminaEl.innerText.split('/').map(s => parseInt(s.trim()));
    return { current, max };
  }

  function getFarm() {
    const farmEl = document.evaluate(
      '//*[@id="discuscontainer"]/div[1]/div[1]/div[2]/span[2]/span',
      document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
    ).singleNodeValue;
    if (!farmEl) return null;
    const [current, max] = farmEl.innerText.split('/').map(s => parseInt(s.replace(/,/g, '').trim(), 10));
    return { current, max };
  }

  function checkUserLogin(bypass = false) {
    let userInfo, loginContainer;
    
    if (bypass) {
      userInfo = false;
      loginContainer = true;
    } else {
      userInfo = document.querySelector('.comments-section .user-info');
      loginContainer = document.querySelector('#login-container');
    }

    if ((!userInfo || loginContainer) && !window.location.href.includes("signin.php")) {
      console.log('User not logged in, clearing cookies and redirecting to login');
      document.cookie.split(";").forEach(function(c) {
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
      sessionStorage.setItem("veyra_resume_page", window.location.href);
      window.location.href = "https://demonicscans.org/signin.php";
      return false;
    }
    return true;
  }

  function checkFarmingLimits() {
    const stamina = getStamina();
    const farm = getFarm();
    if (!stamina || !farm) return false;

    if (!getFarmingAutomation()) return false;

    if (!checkUserLogin()) return false;

    const farmingMode = localStorage.getItem('farming-mode') || 'energy-cap';

    if (farmingMode === 'energy-cap') {
      const minusEnergyCap = parseInt(localStorage.getItem('minus-energy-cap')) || 30;
      if (stamina.max - stamina.current <= minusEnergyCap) {
        setFarmingAutomation(false);
        updateFarmingHUD();
        return false;
      }
    } else {
      const targetEnergy = parseInt(localStorage.getItem('target-farming-energy')) || 150;
      if (stamina.current >= targetEnergy) {
        setFarmingAutomation(false);
        updateFarmingHUD();
        return false;
      }
    }

    if (farm.current >= farm.max) {
      setFarmingAutomation(false);
      startFarming();
      return false;
    }

    return true;
  }

  function clickReaction() {
    const reaction = document.evaluate(
      '/html/body/div[5]/center/div/div[1]/div[3]/div[1]',
      document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
    ).singleNodeValue;

    if (reaction) {
      reaction.scrollIntoView();
      reaction.click();
      console.log('✅ Clicked reaction on', window.location.href);
      return true;
    } else {
      console.log('⚠️ Reaction not found on', window.location.href);
      console.log('User not logged in, clearing cookies and redirecting to login');
      document.cookie.split(";").forEach(function(c) {
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
      sessionStorage.setItem("veyra_resume_page", window.location.href);
      window.location.href = "https://demonicscans.org/signin.php";
      return false;
    }
  }

  function goNextPage() {
    const nextBtn = document.querySelector('body > div.chapter-info > div > a.nextchap');

    if (nextBtn) {
      console.log('➡️ Navigating to next chapter:', nextBtn.href);
      window.location.href = nextBtn.href;
    } else {
      console.log('❌ Next button not found, picking new manga');
      startFarming();
    }
  }

  function startFarming() {
    if (!getFarmingAutomation()) return;
    window.location.href = 'https://demonicscans.org';
  }

  function pickRandomManga() {
    const owlItems = document.querySelectorAll('.owl-item .owl-element a');
    if (owlItems.length === 0) {
      setTimeout(pickRandomManga, 1000);
      return;
    }

    const randomIndex = Math.floor(Math.random() * owlItems.length);
    const randomManga = owlItems[randomIndex];
    console.log('Picked random manga:', randomManga.href);
    window.location.href = randomManga.href;
  }

  function startFromLastChapter() {
    const chapters = document.querySelectorAll('#chapters-list > li > a');
    if (chapters.length === 0) {
      setTimeout(startFromLastChapter, 1000);
      return;
    }

    const lastChapter = chapters[chapters.length - 1];
    console.log('Starting from last chapter:', lastChapter.href);
    window.location.href = lastChapter.href;
  }

  function runFarming() {
    updateFarmingHUD();

    if (!getFarmingAutomation()) return;

    const currentPath = window.location.pathname;
    const currentUrl = window.location.href;

    // If automation starts from homepage or index.php - pick random manga
    if (currentPath === '/' || currentPath === '/index.php') {
      pickRandomManga();
      return;
    }

    // If automation starts from manga page - go to last chapter
    if (currentPath.includes('/manga/')) {
      startFromLastChapter();
      return;
    }

    // If automation starts from chapter page - check limits and continue
    if (currentPath.includes('/chapter/')) {
      if (!checkFarmingLimits()) {
        if (!checkUserLogin()) return false
        setTimeout(runFarming, 5000);
        return;
      }

      const reactSuccess = clickReaction();
      if (reactSuccess) {
        setTimeout(() => {
          goNextPage();
        }, 1500);
      } else {
        if (!checkUserLogin()) return false
      }
    }
  }

  function showNotification(msg, type = 'success') {
    let note = document.getElementById('farm-notification');
    if (!note) {
      note = document.createElement('div');
      note.id = 'farm-notification';
      note.style.cssText = `position: fixed; top: 90px; right: 20px; background: #2ecc71; color: white; padding: 12px 20px; border-radius: 10px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4); font-size: 15px; display: none; z-index: 9999;`;
      document.body.appendChild(note);
    }

    let emoji = '';
    if (type === 'success') emoji = '✅ ';
    else if (type === 'error') emoji = '❌ ';
    else if (type === 'warning') emoji = '⚠️ ';
    else if (type === 'info') emoji = 'ℹ️ ';

    note.innerHTML = emoji + msg;

    if (type === 'error') {
      note.style.background = 'linear-gradient(135deg, #e74c3c, #c0392b)';
    } else if (type === 'warning') {
      note.style.background = 'linear-gradient(135deg, #f39c12, #e67e22)';
    } else if (type === 'info') {
      note.style.background = 'linear-gradient(135deg, #3498db, #2980b9)';
    } else {
      note.style.background = 'linear-gradient(135deg, #2ecc71, #27ae60)';
    }

    note.style.display = 'block';
    setTimeout(() => {
      note.style.display = 'none';
    }, 4000);
  }

  // Add CSS styles
  const style = document.createElement('style');
  style.textContent = `
    :root{
      --glass-bg: rgba(255,255,255,0.06);
      --glass-border: rgba(255,255,255,0.08);
      --glass-text: #e6eef8;
      --glass-muted: #b6c2d3;
      --accent: #3aa3ff;
      --danger: #ff6b6b;
    }

    .veyra-glass {
      background: var(--glass-bg);
      color: var(--glass-text);
      backdrop-filter: blur(12px) saturate(120%);
      -webkit-backdrop-filter: blur(12px) saturate(120%);
      border: 1px solid var(--glass-border);
      border-radius: 14px;
      padding: 12px;
      min-width: 260px;
      box-shadow: 0 8px 30px rgba(2,6,23,0.6);
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      font-size: 13px;
      user-select: none;
      box-sizing: border-box;
    }

    .veyra-header { display:flex; align-items:center; justify-content:space-between; gap:8px; margin-bottom:8px; }
    .veyra-title { font-weight:700; font-size:14px; }
    .veyra-body { display:block; }
    .veyra-row { display:flex; align-items:center; justify-content:space-between; gap:8px; margin:6px 0; }

    .veyra-btn {
      padding:6px 8px;
      border-radius:8px;
      border:none;
      cursor:pointer;
      background:linear-gradient(180deg,#3aa3ff,#1b7ed6);
      color:white;
    }

    .veyra-divider { height:1px; background:rgba(255,255,255,0.04); margin:8px 0; border-radius:2px; }

    .veyra-pill { font-size:11px; padding:4px 8px; border-radius:999px; }
    .pill-live { background:rgba(34,197,94,0.18); color:#c7ffd3; border:1px solid rgba(34,197,94,0.22); }
    .pill-stop { background:rgba(239,68,68,0.12); color:#ffd6d6; border:1px solid rgba(239,68,68,0.18); }

    .veyra-select, .veyra-input {
      padding: 4px 6px;
      border-radius: 6px;
      border: 1px solid var(--glass-border);
      background: rgba(255,255,255,0.04);
      color: var(--glass-text);
      font-size: 12px;
      width: 80px;
    }

    .veyra-select:disabled, .veyra-input:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .drag-handle:hover {
      background: rgba(255,255,255,0.5) !important;
    }
  `;
  document.head.appendChild(style);

})();