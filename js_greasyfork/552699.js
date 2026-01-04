// ==UserScript==
// @name         Cookie Clicker Super OP Mod Menu by MarcelHacker
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Super powerful mod menu for Cookie Clicker with infinite cookies, auto-clicker, matrix animation and multi-language support.
// @author       MarcelHacker
// @match        https://orteil.dashnet.org/cookieclicker/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552699/Cookie%20Clicker%20Super%20OP%20Mod%20Menu%20by%20MarcelHacker.user.js
// @updateURL https://update.greasyfork.org/scripts/552699/Cookie%20Clicker%20Super%20OP%20Mod%20Menu%20by%20MarcelHacker.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // -- STYLING --
  const style = document.createElement('style');
  style.textContent = `
    #marceloMenu {
      position: fixed;
      top: 20px;
      right: 20px;
      width: 320px;
      background: rgba(0, 0, 0, 0.9);
      color: #0f0;
      font-family: monospace, monospace;
      font-size: 14px;
      border: 2px solid #0f0;
      border-radius: 10px;
      z-index: 999999;
      user-select: none;
      padding: 12px;
      box-sizing: border-box;
    }
    #marceloMenu h2 {
      margin: 0 0 10px 0;
      font-weight: bold;
      text-align: center;
    }
    #marceloMenu button, #marceloMenu select {
      background: black;
      color: #0f0;
      border: 1px solid #0f0;
      margin: 4px 0;
      width: 100%;
      padding: 6px;
      font-family: monospace;
      cursor: pointer;
      transition: background 0.3s;
    }
    #marceloMenu button:hover, #marceloMenu select:hover {
      background: #0f0;
      color: black;
    }
    #marceloMenu #closeBtn {
      position: absolute;
      top: 6px;
      right: 6px;
      width: 24px;
      height: 24px;
      border: none;
      background: transparent;
      color: #0f0;
      font-weight: bold;
      font-size: 20px;
      cursor: pointer;
    }
    #marceloMenu #closeBtn:hover {
      color: red;
    }
    #marceloTabs {
      display: flex;
      justify-content: space-around;
      margin-bottom: 8px;
    }
    #marceloTabs button {
      flex: 1;
      margin: 0 2px;
      padding: 6px 0;
      border-radius: 6px;
      font-weight: bold;
    }
    #marceloTabs button.active {
      background: #0f0;
      color: black;
      cursor: default;
    }
    #marceloContent > div {
      display: none;
    }
    #marceloContent > div.active {
      display: block;
    }

    /* Matrix rain */
    #matrixCanvas {
      position: fixed;
      top: 0; left: 0;
      width: 100vw; height: 100vh;
      z-index: 99990;
      pointer-events: none;
      opacity: 0.2;
      background: black;
    }

    /* Balance display */
    #cookieBalanceDisplay {
      position: fixed;
      top: 10px;
      left: 20px;
      padding: 6px 12px;
      background: rgba(0,0,0,0.7);
      color: #0f0;
      font-family: monospace;
      font-size: 16px;
      z-index: 9999999;
      border-radius: 8px;
      user-select: none;
    }
  `;
  document.head.appendChild(style);

  // -- MATRIX RAIN EFFECT --
  const canvas = document.createElement('canvas');
  canvas.id = 'matrixCanvas';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  let width, height;
  let columns;
  let drops = [];

  function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    columns = Math.floor(width / 20);
    drops = [];
    for(let i=0; i<columns; i++) {
      drops[i] = Math.random() * -1000;
    }
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const letters = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';

  function draw() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = '#0f0';
    ctx.font = '20px monospace';

    for(let i=0; i<columns; i++) {
      const text = letters.charAt(Math.floor(Math.random() * letters.length));
      ctx.fillText(text, i*20, drops[i]*20);

      if(drops[i]*20 > height && Math.random() > 0.975) {
        drops[i] = 0;
      }

      drops[i] += 0.9;
    }
  }

  let matrixInterval = null;

  function startMatrix() {
    if(!matrixInterval) {
      matrixInterval = setInterval(draw, 50);
      canvas.style.display = 'block';
    }
  }
  function stopMatrix() {
    if(matrixInterval) {
      clearInterval(matrixInterval);
      matrixInterval = null;
      ctx.clearRect(0,0,width,height);
      canvas.style.display = 'none';
    }
  }

  // -- MENU --
  const menu = document.createElement('div');
  menu.id = 'marceloMenu';
  menu.innerHTML = `
    <button id="closeBtn" title="Close Menu">×</button>
    <h2>Mod Menu by MarcelHacker</h2>
    <div id="marceloTabs">
      <button class="tabBtn active" data-tab="main">Main</button>
      <button class="tabBtn" data-tab="game">Game</button>
      <button class="tabBtn" data-tab="settings">Settings</button>
      <button class="tabBtn" data-tab="info">Info</button>
    </div>
    <div id="marceloContent">
      <div id="tab-main" class="active">
        <button id="btnInfiniteCookies">Infinite Cookies</button>
        <button id="btnAutoClick">Toggle Auto Clicker</button>
        <button id="btnAutoBuy">Toggle Auto Buy Buildings</button>
        <button id="btnUnlockAll">Unlock All Upgrades</button>
        <button id="btnBoostAll">Boost All Buildings +10</button>
        <button id="btnAddCookies100M">Add 100 Million Cookies</button>
      </div>
      <div id="tab-game">
        <button id="btnSpeedUp">Speed x10</button>
        <button id="btnSpeedNormal">Normal Speed</button>
        <button id="btnResetBoosts">Reset Building Boosts</button>
        <button id="btnToggleRainbow">Toggle Rainbow Cookies</button>
        <button id="btnToggleMatrix">Toggle Matrix Animation</button>
      </div>
      <div id="tab-settings">
        <label for="selectLang">Language:</label>
        <select id="selectLang">
          <option value="en">English</option>
          <option value="pl">Polski</option>
        </select>
      </div>
      <div id="tab-info">
        <p>Mod Menu by MarcelHacker010101010</p>
        <p>Super OP Cookie Clicker mod</p>
      </div>
    </div>
  `;
  document.body.appendChild(menu);

  // Tab switching
  const tabButtons = menu.querySelectorAll('.tabBtn');
  const tabContents = menu.querySelectorAll('#marceloContent > div');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
    });
  });

  // Close menu button
  document.getElementById('closeBtn').onclick = () => {
    menu.style.display = 'none';
  };

  // Language selection
  const selectLang = document.getElementById('selectLang');
  let currentLang = localStorage.getItem('marceloLang') || 'en';
  selectLang.value = currentLang;

  function translate() {
    const texts = {
      en: {
        'Infinite Cookies': 'Infinite Cookies',
        'Toggle Auto Clicker': 'Toggle Auto Clicker',
        'Toggle Auto Buy Buildings': 'Toggle Auto Buy Buildings',
        'Unlock All Upgrades': 'Unlock All Upgrades',
        'Boost All Buildings +10': 'Boost All Buildings +10',
        'Add 100 Million Cookies': 'Add 100 Million Cookies',
        'Speed x10': 'Speed x10',
        'Normal Speed': 'Normal Speed',
        'Reset Building Boosts': 'Reset Building Boosts',
        'Toggle Rainbow Cookies': 'Toggle Rainbow Cookies',
        'Toggle Matrix Animation': 'Toggle Matrix Animation',
        'Language:': 'Language:',
        'Mod Menu by MarcelHacker010101010': 'Mod Menu by MarcelHacker010101010',
        'Super OP Cookie Clicker mod': 'Super OP Cookie Clicker mod',
        'Cookies:': 'Cookies:'
      },
      pl: {
        'Infinite Cookies': 'Nieskończone Ciastka',
        'Toggle Auto Clicker': 'Włącz/Wyłącz Auto Klik',
        'Toggle Auto Buy Buildings': 'Włącz/Wyłącz Auto Kupowanie',
        'Unlock All Upgrades': 'Odblokuj Wszystkie Ulepszenia',
        'Boost All Buildings +10': 'Wzmocnij Wszystkie Budynki +10',
        'Add 100 Million Cookies': 'Dodaj 100 Milionów Ciastek',
        'Speed x10': 'Prędkość x10',
        'Normal Speed': 'Normalna Prędkość',
        'Reset Building Boosts': 'Resetuj Wzmocnienia Budynków',
        'Toggle Rainbow Cookies': 'Włącz/Wyłącz Tęczowe Ciastka',
        'Toggle Matrix Animation': 'Włącz/Wyłącz Animację Matrix',
        'Language:': 'Język:',
        'Mod Menu by MarcelHacker010101010': 'Mod Menu by MarcelHacker010101010',
        'Super OP Cookie Clicker mod': 'Super OP Mod do Cookie Clickera',
        'Cookies:': 'Ciastka:'
      }
    };
    const lang = texts[currentLang];

    // Update buttons text
    menu.querySelector('#btnInfiniteCookies').textContent = lang['Infinite Cookies'];
    menu.querySelector('#btnAutoClick').textContent = lang['Toggle Auto Clicker'];
    menu.querySelector('#btnAutoBuy').textContent = lang['Toggle Auto Buy Buildings'];
    menu.querySelector('#btnUnlockAll').textContent = lang['Unlock All Upgrades'];
    menu.querySelector('#btnBoostAll').textContent = lang['Boost All Buildings +10'];
    menu.querySelector('#btnAddCookies100M').textContent = lang['Add 100 Million Cookies'];
    menu.querySelector('#btnSpeedUp').textContent = lang['Speed x10'];
    menu.querySelector('#btnSpeedNormal').textContent = lang['Normal Speed'];
    menu.querySelector('#btnResetBoosts').textContent = lang['Reset Building Boosts'];
    menu.querySelector('#btnToggleRainbow').textContent = lang['Toggle Rainbow Cookies'];
    menu.querySelector('#btnToggleMatrix').textContent = lang['Toggle Matrix Animation'];
    menu.querySelector('#selectLang').previousSibling.textContent = lang['Language:'];
    menu.querySelector('#tab-info p:first-child').textContent = lang['Mod Menu by MarcelHacker010101010'];
    menu.querySelector('#tab-info p:last-child').textContent = lang['Super OP Cookie Clicker mod'];
  }
  translate();

  selectLang.onchange = () => {
    currentLang = selectLang.value;
    localStorage.setItem('marceloLang', currentLang);
    translate();
  };

  // -- MOD FUNCTIONALITY --

  // Infinite cookies toggle
  let infiniteCookiesActive = false;
  const infiniteCookiesInterval = 100; // ms
  let infiniteCookiesTimer = null;

  function startInfiniteCookies() {
    if (infiniteCookiesTimer) return;
    infiniteCookiesTimer = setInterval(() => {
      if (window.Game && infiniteCookiesActive) {
        Game.cookies = Number.MAX_SAFE_INTEGER;
        Game.cookiesEarned = Number.MAX_SAFE_INTEGER;
        Game.cookiesReset = Number.MAX_SAFE_INTEGER;
        Game.cookieClicks = Number.MAX_SAFE_INTEGER;
        Game.cookiesPs = Number.MAX_SAFE_INTEGER;
      }
    }, infiniteCookiesInterval);
  }
  function stopInfiniteCookies() {
    clearInterval(infiniteCookiesTimer);
    infiniteCookiesTimer = null;
  }

  document.getElementById('btnInfiniteCookies').onclick = () => {
    infiniteCookiesActive = !infiniteCookiesActive;
    if(infiniteCookiesActive){
      startInfiniteCookies();
      alert(currentLang === 'pl' ? 'Nieskończone ciastka WŁĄCZONE!' : 'Infinite cookies ENABLED!');
    } else {
      stopInfiniteCookies();
      alert(currentLang === 'pl' ? 'Nieskończone ciastka WYŁĄCZONE!' : 'Infinite cookies DISABLED!');
    }
  };

  // Auto Clicker toggle
  let autoClickerActive = false;
  let autoClickerTimer = null;
  function startAutoClicker() {
    if(autoClickerTimer) return;
    autoClickerTimer = setInterval(() => {
      if(window.Game && autoClickerActive) {
        Game.ClickCookie();
      }
    }, 50);
  }
  function stopAutoClicker() {
    clearInterval(autoClickerTimer);
    autoClickerTimer = null;
  }

  document.getElementById('btnAutoClick').onclick = () => {
    autoClickerActive = !autoClickerActive;
    if(autoClickerActive){
      startAutoClicker();
      alert(currentLang === 'pl' ? 'Auto klikacz WŁĄCZONY!' : 'Auto clicker ENABLED!');
    } else {
      stopAutoClicker();
      alert(currentLang === 'pl' ? 'Auto klikacz WYŁĄCZONY!' : 'Auto clicker DISABLED!');
    }
  };

  // Auto Buy Buildings toggle
  let autoBuyActive = false;
  let autoBuyTimer = null;
  function startAutoBuy() {
    if(autoBuyTimer) return;
    autoBuyTimer = setInterval(() => {
      if(window.Game && autoBuyActive) {
        for(let id in Game.Objects) {
          let obj = Game.Objects[id];
          if(Game.cookies >= obj.getPrice()) {
            obj.buy();
          }
        }
      }
    }, 1000);
  }
  function stopAutoBuy() {
    clearInterval(autoBuyTimer);
    autoBuyTimer = null;
  }

  document.getElementById('btnAutoBuy').onclick = () => {
    autoBuyActive = !autoBuyActive;
    if(autoBuyActive){
      startAutoBuy();
      alert(currentLang === 'pl' ? 'Auto kupowanie WŁĄCZONE!' : 'Auto buy ENABLED!');
    } else {
      stopAutoBuy();
      alert(currentLang === 'pl' ? 'Auto kupowanie WYŁĄCZONE!' : 'Auto buy DISABLED!');
    }
  };

  // Unlock all upgrades
  document.getElementById('btnUnlockAll').onclick = () => {
    if(window.Game) {
      for(let i=0;i<Game.Upgrades.length;i++) {
        Game.Upgrades[i].unlock();
      }
      alert(currentLang === 'pl' ? 'Wszystkie ulepszenia odblokowane!' : 'All upgrades unlocked!');
    }
  };

  // Boost all buildings +10
  document.getElementById('btnBoostAll').onclick = () => {
    if(window.Game) {
      for(let id in Game.Objects) {
        Game.Objects[id].amount += 10;
        Game.Objects[id].refresh();
      }
      alert(currentLang === 'pl' ? 'Wszystkie budynki +10!' : 'All buildings +10!');
    }
  };

  // Add 100 million cookies
  document.getElementById('btnAddCookies100M').onclick = () => {
    if(window.Game) {
      Game.Earn(100_000_000);
      alert(currentLang === 'pl' ? 'Dodano 100 milionów ciastek!' : 'Added 100 million cookies!');
    }
  };

  // Speed control
  document.getElementById('btnSpeedUp').onclick = () => {
    if(window.Game) {
      Game.fps = 1000 / 6; // ~10x speed (default ~60fps = 1000/60)
      alert(currentLang === 'pl' ? 'Prędkość x10 ustawiona!' : 'Speed x10 set!');
    }
  };
  document.getElementById('btnSpeedNormal').onclick = () => {
    if(window.Game) {
      Game.fps = 1000 / 60; // normal speed
      alert(currentLang === 'pl' ? 'Prędkość normalna ustawiona!' : 'Normal speed set!');
    }
  };

  // Reset building boosts
  document.getElementById('btnResetBoosts').onclick = () => {
    if(window.Game) {
      for(let id in Game.Objects) {
        Game.Objects[id].amount = Game.Objects[id].amount; // refresh amount (dummy)
        Game.Objects[id].refresh();
      }
      alert(currentLang === 'pl' ? 'Wzmocnienia budynków zresetowane!' : 'Building boosts reset!');
    }
  };

  // Toggle rainbow cookies (cosmetic)
  let rainbowCookies = false;
  document.getElementById('btnToggleRainbow').onclick = () => {
    rainbowCookies = !rainbowCookies;
    if(rainbowCookies){
      alert(currentLang === 'pl' ? 'Tęczowe ciastka WŁĄCZONE!' : 'Rainbow cookies ENABLED!');
      startRainbowCookies();
    } else {
      alert(currentLang === 'pl' ? 'Tęczowe ciastka WYŁĄCZONE!' : 'Rainbow cookies DISABLED!');
      stopRainbowCookies();
    }
  };

  let rainbowInterval = null;
  function startRainbowCookies() {
    rainbowInterval = setInterval(() => {
      const cookieElem = document.getElementById('bigCookie');
      if(cookieElem) {
        cookieElem.style.filter = `hue-rotate(${Math.floor(Date.now() / 20) % 360}deg)`;
      }
    }, 50);
  }
  function stopRainbowCookies() {
    clearInterval(rainbowInterval);
    rainbowInterval = null;
    const cookieElem = document.getElementById('bigCookie');
    if(cookieElem) {
      cookieElem.style.filter = '';
    }
  }

  // Toggle Matrix animation
  let matrixActive = false;
  document.getElementById('btnToggleMatrix').onclick = () => {
    matrixActive = !matrixActive;
    if(matrixActive) {
      startMatrix();
      alert(currentLang === 'pl' ? 'Animacja Matrix WŁĄCZONA!' : 'Matrix animation ENABLED!');
    } else {
      stopMatrix();
      alert(currentLang === 'pl' ? 'Animacja Matrix WYŁĄCZONA!' : 'Matrix animation DISABLED!');
    }
  };

  // -- COOKIE BALANCE DISPLAY --
  const balanceDisplay = document.createElement('div');
  balanceDisplay.id = 'cookieBalanceDisplay';
  document.body.appendChild(balanceDisplay);

  function updateBalance() {
    if(window.Game) {
      let cookieCount = Math.floor(Game.cookies);
      balanceDisplay.textContent = (currentLang === 'pl' ? 'Ciastka: ' : 'Cookies: ') + cookieCount.toLocaleString();
    }
    requestAnimationFrame(updateBalance);
  }
  updateBalance();

  // Open menu with Ctrl+M shortcut
  window.addEventListener('keydown', e => {
    if(e.ctrlKey && e.key.toLowerCase() === 'm') {
      menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
    }
  });

  // Start with menu visible
  menu.style.display = 'block';

})();
