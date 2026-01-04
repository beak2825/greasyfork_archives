// ==UserScript==
// @name         Guru Tools
// @description  Guru Tools for Fishtank.LIVE
// @version      1.5.0
// @author       phungus
// @homepageURL  https://fishtank.guru
// @namespace    https://fishtank.guru
// @supportURL   https://discord.gg/2pMhfu7TwF
// @license      GPL-3.0-or-later
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fishtank.live
// @match        https://www.fishtank.live/*
// @grant        GM_addStyle
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/557589/Guru%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/557589/Guru%20Tools.meta.js
// ==/UserScript==
/* jshint esversion: 11 */

(function () {
  'use strict';

  const KEY_PREFIX = 'guruTools:';
  const PLUGIN_VERSION = '1.5.0';
  const META_URL = 'https://greasyfork.org/scripts/557589-guru-tools/code/Guru%20Tools.meta.js';

  const idFor = (t, i) => `option_${t}_${i}`;
  const save = (id, val) =>
    localStorage.setItem(
      KEY_PREFIX + id,
      typeof val === 'boolean' ? (val ? 'true' : 'false') : String(val)
    );
  const load = (id) => {
    const v = localStorage.getItem(KEY_PREFIX + id);
    if (v === 'true') return true;
    if (v === 'false') return false;
    return v;
  };

  GM_addStyle(`
    #guruToolsBtn{cursor:pointer;display:flex;align-items:center;justify-content:center;text-transform:uppercase;padding:6px 8px;border:1px solid #505050;border-radius:4px;color:#fff;box-shadow:4px 4px 0 rgba(0,0,0,.5);gap:8px;letter-spacing:-1px;background-color:rgba(115,6,0,.5);border-color:rgba(243,14,0,.25);width:100%;margin:0;}
    #guruToolsBtn:hover{background-color:rgba(115,6,0,.7);}
    #guruToolsBtnIcon{width:16px;height:16px;margin-right:6px;vertical-align:middle;filter:drop-shadow(2px 2px 0 rgba(0,0,0,.75));transition:filter .2s ease;}
    #guruToolsBtn:hover #guruToolsBtnIcon{animation:guruSpin 1s linear infinite;filter:none;}
    #guruToolsBtn span{font-size:16px !important;font-weight:400 !important;line-height:20px !important;text-transform:uppercase;}
    @keyframes guruSpin{0%{transform:rotate(0deg);}100%{transform:rotate(360deg);}}
    #guruOverlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:2147483600;}
    #guruModal{display:none;position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:640px;height:420px;border-radius:10px;color:#fff;z-index:2147483601;background:linear-gradient(-45deg,#ee7752,#e73c7e,#23a6d5,#23d5ab);background-size:400% 400%;animation:gradientBG 15s ease infinite;box-shadow:0 0 25px rgba(0,0,0,0.6);overflow:hidden;display:flex;flex-direction:column;max-width:90vw;max-height:90vh;}
    #guruHeader{display:flex;justify-content:space-between;align-items:center;background:rgba(0,0,0,0.4);height:50px;padding:0;}
    #guruHeaderLeft{display:flex;align-items:center;gap:8px;padding-left:10px;}
    #guruHeaderLeft img{height:28px;display:block;}
    #guruVersion{font-size:8px;color:#fff;opacity:0.85;text-shadow:none;}
    #guruHeaderRight{display:flex;align-items:center;gap:6px;margin-left:auto;}
    #guruModalClose{cursor:pointer;font-size:22px;font-weight:bold;color:#fff;background:tomato;height:100%;padding:0 18px;line-height:50px;transition:background 0.2s ease;}
    #guruModalClose:hover{background:#e5533f;}
    #guruUpdateBtn{cursor:pointer;font-size:8px;font-family:Arial,sans-serif;font-weight:900;color:#fff;background:#4caf50;padding:3px 8px;border-radius:20px;line-height:normal;display:none;align-items:center;justify-content:center;transition:background 0.2s ease;text-shadow:none;}
    #guruUpdateBtn:hover{background:#45a049;}
    #guruTabs{display:flex;flex-wrap:wrap;background:rgba(0,0,0,0.6);gap:0;padding:0;align-content:stretch;}
    #guruTabs button{flex:1 1 auto;min-width:80px;border:none;margin:0;border-radius:0;background:transparent;color:#fff;cursor:pointer;font-family:Arial,sans-serif;font-weight:700;text-transform:uppercase;font-size:12px;line-height:50px;transition:background 0.2s ease;display:flex;align-items:center;justify-content:center;gap:8px;padding:0 6px;}
    #guruTabs button:hover{background:rgba(255,255,255,0.08);}
    #guruTabs button.active{background:rgba(0,0,0,0.8);}
    #guruTabs .tabIcon{font-size:16px;line-height:1;}
    .guruTabContent{display:none;padding:5px 20px;flex:1;overflow-y:auto;background:rgba(0,0,0,0.35);}
    .guruTabContent.active{display:block;}
    #tab2.guruTabContent,#tab3.guruTabContent,#tab4.guruTabContent,#tab5.guruTabContent{padding:0 !important;margin:0 !important;overflow:hidden;background:none;}
    #tab2.guruTabContent iframe,#tab3.guruTabContent iframe,#tab4.guruTabContent iframe,#tab5.guruTabContent iframe{width:100%;height:100%;border:none;margin:0;padding:0;display:block;background:transparent !important;}
    .guruOption{margin:14px 0;display:flex;align-items:center;cursor:pointer;padding:6px;border-radius:4px;transition:background 0.2s ease;}
    .guruOption:hover{background:rgba(255,255,255,0.10);}
    .switch{position:relative;width:50px;height:24px;flex-shrink:0;}
    .switch input{opacity:0;width:0;height:0;}
    .slider{position:absolute;inset:0;background-color:#ccc;border-radius:24px;}
    .slider:before{position:absolute;content:"";height:18px;width:18px;left:3px;bottom:3px;background-color:white;border-radius:50%;transition:.2s;}
    input:checked + .slider{background-color:#4CAF50;}
    input:checked + .slider:before{transform:translateX(26px);}
    .guruOptionText{margin-left:16px;}
    .guruOptionTitle{font-family:Arial,sans-serif;font-weight:900;font-size:14px;text-shadow:none;}
    .guruOptionDesc{font-size:11px;color:#ccc;margin-top:4px;line-height:1.4;text-shadow:none;}
    @keyframes gradientBG{0%{background-position:0% 50%;}50%{background-position:100% 50%;}100%{background-position:0% 50%;}}
    #guruSnowOverlay{position:fixed;inset:0;pointer-events:none;z-index:2147483599;}
    #guruSantaHat{position:absolute;}
    @media screen and (max-height:942px), screen and (max-width:1101px){#guruSantaHat{display:none !important;}}
    .top-bar_logo__XL0_C{position:relative;}
    body.guru-extend-inventory .inventory_slots__D4IrC{max-height:none !important;}
    body.guru-wartoy-protections .chat-message-default_shrink-ray__nGvpr{font-size:6px !important;}
    body.guru-wartoy-protections.mirror{transform:scaleY(1) !important;}
    body.guru-wartoy-protections .live-stream-player_blur__7BhBE video{filter:blur(0px) !important;}
    body.guru-wartoy-protections.blind{filter:grayscale(0) blur(0) !important;}
    body.guru-hide-season-pass .toast_season-pass__cmkhU,
    body.guru-hide-season-pass .experience-daily-login_season-pass__YTtsY:has(.icon_icon__bDzMA),
    body.guru-hide-season-pass .item-generator_item-generator__TCQ9l{display:none !important;}
    body.guru-hide-ads .ads_ads__Z1cPk{display:none !important;}
    body.guru-hide-applications .applications-alert_applications-alert__3zfnO{display:none !important;}
    #guruItemDexOptions{display:flex;justify-content:space-between;align-items:center;padding:3px 10px;background:linear-gradient(-45deg,#ee7752,#e73c7e,#23a6d5,#23d5ab);background-size:400% 400%;animation:gradientBG 15s ease infinite;border-radius:4px;color:#fff;font-size:13px;font-family:Arial,sans-serif;font-weight:700;width:100%;min-height:25px;}
    #guruItemDexOptions .leftLabel{font-size:12px;font-weight:900;letter-spacing:.5px;text-shadow:none;}
    #guruItemDexOptions .options{display:flex;gap:12px;align-items:center;flex-wrap:wrap;}
    #guruItemDexOptions .options label{display:flex;align-items:center;gap:6px;cursor:pointer;font-weight:400;text-shadow:none;}
    #guruItemDexOptions input[type="checkbox"]{transform:scale(1.1);margin:0;}
    #guruItemDexCompletion{display:flex;justify-content:space-between;align-items:center;padding:3px 10px;border-radius:4px;background:linear-gradient(-45deg,#ee7752,#e73c7e,#23a6d5,#23d5ab);background-size:400% 400%;animation:gradientBG 15s ease infinite;color:#fff;font-size:13px;font-family:Arial,sans-serif;font-weight:700;width:100%;min-height:25px;}
    #guruItemDexCompletion .leftLabel{font-size:12px;font-weight:900;letter-spacing:.5px;text-shadow:none;}
    #guruItemDexCompletion .bar{position:relative;flex:1;margin-left:12px;background:rgba(0,0,0,0.3);border-radius:6px;overflow:hidden;height:20px;}
    #guruItemDexCompletion .bar .fill{height:100%;width:0%;background:#4caf50;transition:width .3s ease;}
    #guruItemDexCompletion .bar .label{position:absolute;top:0;left:0;width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:#fff;text-shadow:0 1px 2px rgba(0,0,0,0.6);}
    .guruRecipePanel{margin-top:15px;padding:8px 10px;border-radius:6px;color:#fff;font-family:Arial,sans-serif;font-size:11px;line-height:1.5;text-shadow:none;text-align:center;background:linear-gradient(-45deg,#ee7752,#e73c7e,#23a6d5,#23d5ab);background-size:400% 400%;animation:gradientBG 15s ease infinite;}
    .queue-item-modal_queue-item-modal__nTD2t .guruRecipePanel{margin-top:0px;}
    .guruRecipeTitle{font-size:11px;font-weight:900;margin-bottom:4px;letter-spacing:.5px;text-transform:uppercase;color:#ffffff;text-align:center;}
    .guruRecipeList{margin:0;padding:0;list-style:none;}
    .guruRecipeItem{margin:1px 0;font-size:11px;color:#eee;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;text-align:center;}
    .guruRecipeTrash{color:#ffb74d;font-weight:700;display:flex;align-items:center;gap:6px;justify-content:center;}
    .guruRecipeTrashIcon{width:14px;height:14px;border-radius:50%;background:#ff9800;display:inline-flex;align-items:center;justify-content:center;font-size:11px;font-weight:900;color:#000;flex-shrink:0;}
    .guruItemSearchContainer { width: 100%; margin: 6px 0; }
    .guruItemSearchContainerInner { display: flex; align-items: center; gap: 6px; width: fit-content; margin: 0 auto; }
    .guruItemSearchContainer label {font-size: 12px;}
    .guruItemSearchContainer input {font-size: 12px;padding: 4px 6px;width: 180px;}
    .craft-item-modal_craft-item-modal__6UGqS .guruItemSearchContainer {grid-column: 1 / -1;justify-content: center;}
    `);

  const overlay = document.createElement('div');
  overlay.id = 'guruOverlay';
  document.body.appendChild(overlay);

  const modal = document.createElement('div');
  modal.id = 'guruModal';
  overlay.appendChild(modal);

  function openModal(e) {
    if (e) e.stopPropagation();
    overlay.style.display = 'block';
    modal.style.display = 'flex';
  }

  function closeModal(e) {
    if (e) e.stopPropagation();
    overlay.style.display = 'none';
    modal.style.display = 'none';
  }

  function generateOptions(tabNum) {
    if (tabNum !== 1) return '';
    const options = [
      { id: idFor(1, 8), title: 'Item Dex Completion Tracker', desc: 'Adds a progress bar to the item dex with completion percentage.' },
      { id: idFor(1, 7), title: 'Item Dex Filter', desc: 'Filter and hide items on profiles.' },
      { id: idFor(1, 9), title: 'Show Recipes When Crafting or Consuming Items', desc: 'Display available recipes when consuming or adding items to the item crafter.' },
      { id: idFor(1, 10), title: 'Item Search', desc: 'Easily search for items when crafting, trading and selling in the market.' },
      { id: idFor(1, 1), title: 'Extended Inventory Box', desc: 'Extends your inventory items list so you don’t have to scroll.' },
      { id: idFor(1, 2), title: 'Wartoy Protections', desc: 'Undo the effects of some wartoys such as Color Blind, Shrink Ray, Adjust Focus and Mirror Universe.' },
      { id: idFor(1, 3), title: 'Hide Season Pass Popups', desc: 'Blocks the Season Pass popup advertisements and buttons.' },
      { id: idFor(1, 4), title: 'Hide Advertisements', desc: 'Hides the advertisements box in the left panel.' },
      { id: idFor(1, 5), title: 'Hide Contestant Applications Popup', desc: 'Hides the popup for Season 5 contestant applications.' },
      { id: idFor(1, 6), title: 'Holiday Spirit', desc: 'Adds decorations to the site during certain times of the year.' }
    ];
    let html = '';
    for (const opt of options) {
      html += `
        <div class="guruOption" data-id="${opt.id}">
          <label class="switch">
            <input type="checkbox" id="${opt.id}">
            <span class="slider"></span>
          </label>
          <div class="guruOptionText">
            <div class="guruOptionTitle">${opt.title}</div>
            <div class="guruOptionDesc">${opt.desc}</div>
          </div>
        </div>
      `;
    }
    return html;
  }

  modal.innerHTML = `
    <div id="guruHeader">
      <div id="guruHeaderLeft">
        <a href="https://fishtank.guru" target="_blank" rel="noopener noreferrer">
          <img src="https://fishtank.guru/wp-content/uploads/2024/06/fishtank-live-guru-logo-2024.png" alt="Guru Logo">
        </a>
        <span id="guruVersion">v${PLUGIN_VERSION}</span>
      </div>
      <div id="guruHeaderRight">
        <span id="guruUpdateBtn">Update Available!</span>
        <span id="guruModalClose">✖</span>
      </div>
    </div>
    <div id="guruTabs">
      <button class="active" data-tab="tab1"><span class="tabIcon">⚙️</span><span>Options</span></button>
      <button data-tab="tab2"><span class="tabIcon">🛠️</span><span>Crafting</span></button>
      <button data-tab="tab3"><span class="tabIcon">🧸</span><span>Items</span></button>
      <button data-tab="tab4"><span class="tabIcon">🏆</span><span>Medals</span></button>
      <button data-tab="tab5"><span class="tabIcon">🫡</span><span>Emotes</span></button>
    </div>
    <div id="tab1" class="guruTabContent active">${generateOptions(1)}</div>
    <div id="tab2" class="guruTabContent"><iframe src="https://fishtank.guru/crafting/lite"></iframe></div>
    <div id="tab3" class="guruTabContent"><iframe src="https://fishtank.guru/items/lite"></iframe></div>
    <div id="tab4" class="guruTabContent"><iframe src="https://fishtank.guru/medals/lite"></iframe></div>
    <div id="tab5" class="guruTabContent"><iframe src="https://fishtank.guru/emotes/lite"></iframe></div>
  `;

  function initTabs() {
    const tabButtons = modal.querySelectorAll('#guruTabs button');
    const tabContents = modal.querySelectorAll('.guruTabContent');
    tabButtons.forEach((b) => {
      b.addEventListener('click', () => {
        tabButtons.forEach((tb) => tb.classList.remove('active'));
        tabContents.forEach((tc) => tc.classList.remove('active'));
        b.classList.add('active');
        const panel = modal.querySelector(`#${b.dataset.tab}`);
        if (panel) panel.classList.add('active');
      });
    });
  }

  modal.querySelector('#guruModalClose').addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal(e);
  });

  initTabs();

  const HOLIDAY_SNOW_ID = 'holidaySnowLink';
  const HOLIDAY_FIX_ID = 'holidaySnowFix';
  const HOLIDAY_OVERLAY_ID = 'guruSnowOverlay';
  const HOLIDAY_SNOW_URL = 'https://fishtank.guru/resources/elements/snow.css';
  const FLAKE_CLASS = 'snow';
  const FLAKE_ATTR = 'data-guru-snow';
  const FLAKE_COUNT = 200;
  const SANTA_HAT_ID = 'guruSantaHat';
  const SANTA_HAT_URL = 'https://fishtank.guru/resources/Santa%20Hat.png';

  function inHolidayWindow(d) {
    const year = d.getFullYear();
    const start = new Date(year, 10, 30, 0, 0, 0, 0);
    const end = new Date(year + 1, 0, 1, 23, 59, 59, 999);
    return d >= start && d <= end;
  }

  function ensureSnowCSS(enabled) {
    const link = document.getElementById(HOLIDAY_SNOW_ID);
    const fix = document.getElementById(HOLIDAY_FIX_ID);
    if (enabled) {
      if (!link) {
        const l = document.createElement('link');
        l.id = HOLIDAY_SNOW_ID;
        l.rel = 'stylesheet';
        l.href = HOLIDAY_SNOW_URL;
        document.head.appendChild(l);
      }
      if (!fix) {
        const f = document.createElement('style');
        f.id = HOLIDAY_FIX_ID;
        f.textContent = `.snow{pointer-events:none;}`;
        document.head.appendChild(f);
      }
    } else {
      if (link) link.remove();
      if (fix) fix.remove();
    }
  }

  function ensureSnowDOM(enabled) {
    let overlayEl = document.getElementById(HOLIDAY_OVERLAY_ID);
    if (enabled) {
      if (!overlayEl) {
        overlayEl = document.createElement('div');
        overlayEl.id = HOLIDAY_OVERLAY_ID;
        document.body.appendChild(overlayEl);
      }
      const current = overlayEl.querySelectorAll(`.${FLAKE_CLASS}[${FLAKE_ATTR}="1"]`).length;
      if (current < FLAKE_COUNT) {
        for (let i = current; i < FLAKE_COUNT; i++) {
          const flake = document.createElement('div');
          flake.className = FLAKE_CLASS;
          flake.setAttribute(FLAKE_ATTR, '1');
          overlayEl.appendChild(flake);
        }
      } else if (current > FLAKE_COUNT) {
        const flakes = overlayEl.querySelectorAll(`.${FLAKE_CLASS}[${FLAKE_ATTR}="1"]`);
        for (let i = FLAKE_COUNT; i < flakes.length; i++) flakes[i].remove();
      }
    } else {
      if (overlayEl) overlayEl.remove();
    }
  }

  function ensureSantaHat(enabled) {
    const logoBtn = document.querySelector('.top-bar_logo__XL0_C');
    if (!logoBtn) return;
    let hat = document.getElementById(SANTA_HAT_ID);
    if (enabled) {
      if (!hat) {
        hat = document.createElement('img');
        hat.id = SANTA_HAT_ID;
        hat.src = SANTA_HAT_URL;
        logoBtn.appendChild(hat);
      }
      hat.style.position = 'absolute';
      hat.style.top = '-10px';
      hat.style.left = 'calc(50% + 70px)';
      hat.style.transform = 'translateX(-50%) rotate(-10deg) scaleX(-1)';
      hat.style.width = '60px';
      hat.style.pointerEvents = 'none';
      hat.style.zIndex = '2147483602';
      hat.style.filter = 'drop-shadow(2px 2px 2px rgba(0,0,0,0.3))';
    } else {
      if (hat) hat.remove();
    }
  }

  function updateHolidaySpirit(isOn) {
    const active = isOn && inHolidayWindow(new Date());
    ensureSnowCSS(active);
    ensureSnowDOM(active);
    ensureSantaHat(active);
  }

  function applyItemFilters() {
    const hideConsumed = document.querySelector('#guruHideConsumed')?.checked;
    const hideFishtoys = document.querySelector('#guruHideFishtoys')?.checked;
    const hideUnobtainables = document.querySelector('#guruHideUnobtainables')?.checked;

    const fishtoyBlocked = [
      'Send_a_Rose','Plushie_Delivery','Toy_Delivery','Love_Letter','Snack_Delivery',
      'babel-fish','mirror','blind','shrink-ray','three-fifths-alt','heroic-sacrifice',
      'keyboard','deface','piranhas','finge-2','fishbnb-2','kamikaze-strike','assassin','military',
      'items/grenade.png','tts-token','sfx-token','hostage-situation','cease-fire'
    ];

    const unobtainableBlocked = ['Participation_Trophy','Inventory_Filler'];

    const container = document.querySelector('.user-profile-items_user-profile-items__rl_CV');
    if (!container) return;

    document.querySelectorAll('.user-profile-items_item__9ECcd').forEach(item => {
      let hide = false;

      if (hideConsumed) {
        const timesIcon = item.querySelector('.user-profile-items_times__Ko05l');
        if (timesIcon) hide = true;
      }

      if (hideFishtoys) {
        const img = item.querySelector('img.user-profile-items_icon__zK0AB');
        if (img && fishtoyBlocked.some(key => img.src.includes(key))) hide = true;
      }

      if (hideUnobtainables) {
        const img2 = item.querySelector('img.user-profile-items_icon__zK0AB');
        if (img2 && unobtainableBlocked.some(key => img2.src.includes(key))) hide = true;
      }

      item.style.display = hide ? 'none' : '';
    });

    if (load(idFor(1, 8))) updateItemDexCompletion();
  }

  function toggleItemDexFilter(enabled) {
    const container = document.querySelector('.user-profile-items_user-profile-items__rl_CV');
    const box = document.getElementById('guruItemDexOptions');

    if (enabled && container) {
      if (!box) {
        const newBox = document.createElement('div');
        newBox.id = 'guruItemDexOptions';
        newBox.innerHTML = `
          <div class="leftLabel">Filter</div>
          <div class="options">
            <label><input type="checkbox" id="guruHideConsumed"><span>Hide Consumed</span></label>
            <label><input type="checkbox" id="guruHideFishtoys"><span>Hide Fishtoys</span></label>
            <label><input type="checkbox" id="guruHideUnobtainables"><span>Hide Unobtainables</span></label>
          </div>
        `;
        const completionBox = document.getElementById('guruItemDexCompletion');
        if (completionBox) {
          completionBox.insertAdjacentElement('afterend', newBox);
        } else {
          container.insertAdjacentElement('beforebegin', newBox);
        }

        const chkConsumed = newBox.querySelector('#guruHideConsumed');
        const chkFishtoys = newBox.querySelector('#guruHideFishtoys');
        const chkUnobtainables = newBox.querySelector('#guruHideUnobtainables');

        const pConsumed = load('itemdex:hideConsumed');
        const pFishtoys = load('itemdex:hideFishtoys');
        const pUnobtainables = load('itemdex:hideUnobtainables');

        if (pConsumed === true) chkConsumed.checked = true;
        if (pFishtoys === true) chkFishtoys.checked = true;
        if (pUnobtainables === true) chkUnobtainables.checked = true;

        chkConsumed.addEventListener('change', () => {
          save('itemdex:hideConsumed', chkConsumed.checked);
          applyItemFilters();
        });

        chkFishtoys.addEventListener('change', () => {
          save('itemdex:hideFishtoys', chkFishtoys.checked);
          applyItemFilters();
        });

        chkUnobtainables.addEventListener('change', () => {
          save('itemdex:hideUnobtainables', chkUnobtainables.checked);
          applyItemFilters();
        });
      }
      applyItemFilters();
    } else {
      if (box) box.remove();
      document.querySelectorAll('.user-profile-items_item__9ECcd').forEach(item => {
        item.style.display = '';
      });
      if (load(idFor(1, 8))) updateItemDexCompletion();
    }
  }

  function toggleItemDexCompletion(enabled) {
    const container = document.querySelector('.user-profile-items_user-profile-items__rl_CV');
    let box = document.getElementById('guruItemDexCompletion');

    if (enabled && container) {
      if (!box) {
        box = document.createElement('div');
        box.id = 'guruItemDexCompletion';
        box.innerHTML = `
          <div class="leftLabel">Completion</div>
          <div class="bar">
            <div class="fill" id="guruCompletionBar"></div>
            <div class="label" id="guruCompletionText"></div>
          </div>
        `;
        const filterBox = document.getElementById('guruItemDexOptions');
        if (filterBox) {
          filterBox.insertAdjacentElement('beforebegin', box);
        } else {
          container.insertAdjacentElement('beforebegin', box);
        }
      }
      updateItemDexCompletion();
    } else {
      if (box) box.remove();
    }
  }

  function updateItemDexCompletion() {
    const enabled = load(idFor(1, 8));
    if (!enabled) return;

    const container = document.querySelector('.user-profile-items_user-profile-items__rl_CV');
    if (!container) return;

    const fishtoyBlocked = [
      'Send_a_Rose','Plushie_Delivery','Toy_Delivery','Love_Letter','Snack_Delivery',
      'babel-fish','mirror','blind','shrink-ray','three-fifths-alt','heroic-sacrifice',
      'keyboard','deface','piranhas','finge-2','fishbnb-2','kamikaze-strike','assassin','military',
      'items/grenade.png','tts-token','sfx-token','hostage-situation','cease-fire'
    ];
    const unobtainableBlocked = ['Participation_Trophy','Inventory_Filler'];

    const items = document.querySelectorAll('.user-profile-items_item__9ECcd');
    let total = 0;
    let obtained = 0;

    items.forEach(item => {
      const img = item.querySelector('img.user-profile-items_icon__zK0AB');
      if (!img) return;
      const src = img.src;
      if (fishtoyBlocked.some(key => src.includes(key))) return;
      if (unobtainableBlocked.some(key => src.includes(key))) return;
      total++;
      const timesIcon = item.querySelector('.user-profile-items_times__Ko05l');
      if (!timesIcon) return;
      obtained++;
    });

    const percent = total > 0 ? (obtained / total) * 100 : 0;
    const bar = document.getElementById('guruCompletionBar');
    const text = document.getElementById('guruCompletionText');

    if (bar) bar.style.width = percent.toFixed(2) + '%';
    if (text) text.textContent = `${obtained}/${total} items (${percent.toFixed(2)}%)`;
  }

  const RECIPES_URL = 'https://fishtank.guru/resources/recipes.json';

  let recipes = [];
  let recipesLoaded = false;
  let recipesLoading = false;

  async function loadRecipes() {
    if (recipesLoaded || recipesLoading) return;
    recipesLoading = true;
    try {
      const res = await fetch(RECIPES_URL, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          recipes = data;
          recipesLoaded = true;
        }
      }
    } catch (e) {}
    recipesLoading = false;
  }

  function ensureRecipesLoaded() {
    if (!recipesLoaded && !recipesLoading) loadRecipes();
  }

  function findRecipesForItem(name) {
    if (!recipesLoaded) return [];
    const n = name ? name.trim() : '';
    if (!n) return [];
    return recipes.filter(r => Array.isArray(r.ingredients) && r.ingredients.includes(n));
  }

  function findRecipesForPair(a, b) {
    if (!recipesLoaded) return [];
    const x = a ? a.trim() : '';
    const y = b ? b.trim() : '';
    if (!x || !y) return [];
    return recipes.filter(r => {
      const ing = r.ingredients;
      return Array.isArray(ing) &&
        ing.length === 2 &&
        ((ing[0] === x && ing[1] === y) || (ing[0] === y && ing[1] === x));
    });
  }

  let recipeFeatureEnabled = false;
  let craftPollInterval = null;
  let consumePollInterval = null;
  let lastCraftItem1 = '';
  let lastCraftItem2 = '';
  let lastConsumeItem = '';

  function clearCraftRecipePanel() {
    const p = document.getElementById('guruCraftRecipesPanel');
    if (p) p.remove();
  }

  function clearConsumeRecipePanel() {
    const p = document.getElementById('guruConsumeRecipesPanel');
    if (p) p.remove();
  }

  function normalizeCraftItemName(name) {
    if (!name) return '';
    const t = name.trim().toLowerCase();
    if (t === 'select an item') return '';
    return name.trim();
  }

  function renderCraftRecipes(item1, item2) {
    const root = document.querySelector('.craft-item-modal_craft-item-modal__6UGqS');
    if (!root) {
      clearCraftRecipePanel();
      return;
    }

    ensureRecipesLoaded();

    let panel = document.getElementById('guruCraftRecipesPanel');
    if (!panel) {
      panel = document.createElement('div');
      panel.id = 'guruCraftRecipesPanel';
      panel.className = 'guruRecipePanel';
      root.insertAdjacentElement('afterend', panel);
    }

    const hasItem1 = !!item1;
    const hasItem2 = !!item2;

    if (!hasItem1 && !hasItem2) {
      panel.innerHTML = '';
      return;
    }

    let html = '<div class="guruRecipeTitle">Crafting Recipes</div><ul class="guruRecipeList">';

    if (hasItem1 && !hasItem2) {
      const list = findRecipesForItem(item1);
      if (!recipesLoaded) {
        html += '<li class="guruRecipeItem">Loading recipes...</li>';
      } else if (list.length === 0) {
        html += `<li class="guruRecipeItem">No known recipes found for ${item1}.</li>`;
      } else {
        list.forEach(r => {
          const a = r.ingredients[0] || '';
          const b = r.ingredients[1] || '';
          html += `<li class="guruRecipeItem">${a} + ${b} = ${r.result}</li>`;
        });
      }
    } else if (hasItem1 && hasItem2) {
      const list = findRecipesForPair(item1, item2);
      if (!recipesLoaded) {
        html += '<li class="guruRecipeItem">Loading recipes...</li>';
      } else if (list.length > 0) {
        list.forEach(r => {
          const a = r.ingredients[0] || '';
          const b = r.ingredients[1] || '';
          html += `<li class="guruRecipeItem">${a} + ${b} = ${r.result}</li>`;
        });
      } else {
        const safe1 = item1;
        const safe2 = item2;
        html += `<li class="guruRecipeItem guruRecipeTrash"><span class="guruRecipeTrashIcon">!</span><span>${safe1} + ${safe2} = Trash Heap</span></li>`;
      }
    }

    html += '</ul>';
    panel.innerHTML = html;
  }

  function renderConsumeRecipes(itemName) {
    const container = document.querySelector('.queue-item-modal_queue-item-modal__nTD2t');
    if (!container) {
      clearConsumeRecipePanel();
      return;
    }

    ensureRecipesLoaded();

    const body = container.querySelector('.queue-item-modal_body__SOYYL');
    if (!body) {
      clearConsumeRecipePanel();
      return;
    }

    let panel = document.getElementById('guruConsumeRecipesPanel');
    if (!panel) {
      panel = document.createElement('div');
      panel.id = 'guruConsumeRecipesPanel';
      panel.className = 'guruRecipePanel';
      const footer = container.querySelector('.queue-item-modal_footer__qsXB7');
      if (footer) footer.insertAdjacentElement('afterend', panel);
      else container.appendChild(panel);
    }

    const name = itemName ? itemName.trim() : '';
    if (!name) {
      panel.innerHTML = '';
      return;
    }

    const list = findRecipesForItem(name);
    if (!recipesLoaded) {
      panel.innerHTML = '<div class="guruRecipeTitle">Crafting Recipes</div><ul class="guruRecipeList"><li class="guruRecipeItem">Loading recipes...</li></ul>';
      return;
    }
    if (list.length === 0) {
      panel.innerHTML = `<div class="guruRecipeTitle">Crafting Recipes</div><ul class="guruRecipeList"><li class="guruRecipeItem">No known recipes found for ${name}.</li></ul>`;
      return;
    }

    let html = '<div class="guruRecipeTitle">Crafting Recipes</div><ul class="guruRecipeList">';
    list.forEach(r => {
      const a = r.ingredients[0] || '';
      const b = r.ingredients[1] || '';
      html += `<li class="guruRecipeItem">${a} + ${b} = ${r.result}</li>`;
    });
    html += '</ul>';
    panel.innerHTML = html;
  }

  function startCraftPolling() {
    if (!recipeFeatureEnabled) return;
    if (craftPollInterval) clearInterval(craftPollInterval);
    lastCraftItem1 = '';
    lastCraftItem2 = '';
    craftPollInterval = setInterval(() => {
      if (!recipeFeatureEnabled) return;
      const container = document.querySelector('.craft-item-modal_craft-item-modal__6UGqS');
      if (!container) {
        clearCraftRecipePanel();
        return;
      }
      const names = container.querySelectorAll('.craft-item-modal_item__TZuvH .craft-item-modal_name__gMinb');
      const raw1 = names[0] ? names[0].textContent : '';
      const raw2 = names[1] ? names[1].textContent : '';
      const item1 = normalizeCraftItemName(raw1);
      const item2 = normalizeCraftItemName(raw2);
      if (item1 === lastCraftItem1 && item2 === lastCraftItem2) return;
      lastCraftItem1 = item1;
      lastCraftItem2 = item2;
      if (!item1 && !item2) {
        clearCraftRecipePanel();
        return;
      }
      renderCraftRecipes(item1, item2);
    }, 200);
  }

  function startConsumePolling() {
    if (!recipeFeatureEnabled) return;
    if (consumePollInterval) clearInterval(consumePollInterval);
    lastConsumeItem = '';
    consumePollInterval = setInterval(() => {
      if (!recipeFeatureEnabled) return;

      const container = document.querySelector('.queue-item-modal_queue-item-modal__nTD2t');
      if (!container) {
        clearConsumeRecipePanel();
        return;
      }

      const nameEl = container.querySelector('.queue-item-modal_name___WFX9');
      if (!nameEl) {
        clearConsumeRecipePanel();
        return;
      }

      const name = nameEl.textContent.trim();
      if (!name) {
        clearConsumeRecipePanel();
        return;
      }

      if (name === lastConsumeItem) return;
      lastConsumeItem = name;

      renderConsumeRecipes(name);
    }, 200);
  }

  function stopRecipePolling() {
    if (craftPollInterval) {
      clearInterval(craftPollInterval);
      craftPollInterval = null;
    }
    if (consumePollInterval) {
      clearInterval(consumePollInterval);
      consumePollInterval = null;
    }
    clearCraftRecipePanel();
    clearConsumeRecipePanel();
  }

  function disableRecipeFeature() {
    recipeFeatureEnabled = false;
    stopRecipePolling();
  }

  function enableRecipeFeature() {
    recipeFeatureEnabled = true;
    ensureRecipesLoaded();
  }

  function setRecipeFeatureEnabled(enabled) {
    if (enabled) enableRecipeFeature();
    else disableRecipeFeature();
  }

  const recipeModalObserver = new MutationObserver(() => {
    if (!recipeFeatureEnabled) return;
    if (document.querySelector('.craft-item-modal_craft-item-modal__6UGqS')) {
      startCraftPolling();
    }
    if (document.querySelector('.queue-item-modal_queue-item-modal__nTD2t')) {
      startConsumePolling();
    }
  });

  recipeModalObserver.observe(document.body, { childList: true, subtree: true });

  let itemSearchEnabled = false;
  let itemSearchObserver = null;

  function getItemNameFromImg(img) {
      if (!img) return '';
      const src = img.src || '';
      let file = src.substring(src.lastIndexOf('/') + 1);
      file = file.replace(/\.[^.]+$/, '');
      file = file.replace(/-\d+$/, '');
      file = file.replace(/[-_]/g, ' ');
      file = file.replace(/\s+/g, ' ');
      return file.trim().toLowerCase();
}

  function filterGridItems(grid, term) {
    const t = (term || '').trim().toLowerCase();
    const buttons = Array.from(grid.querySelectorAll('button'));
    if (!t) {
      buttons.forEach(btn => {
        btn.style.display = '';
      });
      return;
    }
    buttons.forEach(btn => {
      const img = btn.querySelector('img');
      const name = getItemNameFromImg(img);
      btn.style.display = name.includes(t) ? '' : 'none';
    });
  }

  function ensureSearchForGrid(gridSelector, inputId) {
      if (!itemSearchEnabled) return;
      const grid = document.querySelector(gridSelector);
      if (!grid) return;
      let input = document.getElementById(inputId);
      if (!input) {
          const wrap = document.createElement('div');
          wrap.className = 'guruItemSearchContainer';
          const inner = document.createElement('div');
          inner.className = 'guruItemSearchContainerInner';
          const label = document.createElement('label');
          label.textContent = 'Item Search:';
          const inp = document.createElement('input');
          inp.type = 'text';
          inp.id = inputId;

    inner.appendChild(label);
    inner.appendChild(inp);
    wrap.appendChild(inner);

    const parent = grid.parentElement || grid;
    parent.insertBefore(wrap, grid);

    input = inp;
    input.addEventListener('input', () => {
      filterGridItems(grid, input.value);
    });
  } else {
    const gridNow = document.querySelector(gridSelector);
    if (gridNow && input.closest('.guruItemSearchContainer')?.nextSibling !== gridNow) {
      const parent = gridNow.parentElement || gridNow;
      parent.insertBefore(input.closest('.guruItemSearchContainer'), gridNow);
    }
    filterGridItems(gridNow || grid, input.value);
  }
}


  function refreshItemSearch() {
  if (!itemSearchEnabled) return;

  const craftGrid = document.querySelector('.craft-item-modal_selectable-items___VGof');
  if (craftGrid) {
    ensureSearchForGrid('.craft-item-modal_selectable-items___VGof', 'guruCraftItemSearch');
  } else {
    removeSearchBar('guruCraftItemSearch');
  }

  const tradeGrid = document.querySelector('.trade-modal_tradable-items__RDYik');
  if (tradeGrid) {
    ensureSearchForGrid('.trade-modal_tradable-items__RDYik', 'guruTradeItemSearch');
  } else {
    removeSearchBar('guruTradeItemSearch');
  }

  const marketGrid = document.querySelector('.item-market-modal_selectable-items__Tuh4s');
  if (marketGrid) {
    ensureSearchForGrid('.item-market-modal_selectable-items__Tuh4s', 'guruMarketItemSearch');
  } else {
    removeSearchBar('guruMarketItemSearch');
  }
}


  function removeItemSearchUI() {
    ['guruCraftItemSearch', 'guruTradeItemSearch', 'guruMarketItemSearch'].forEach(id => {
      const input = document.getElementById(id);
      if (input) {
        const wrap = input.closest('.guruItemSearchContainer');
        if (wrap) wrap.remove();
      }
    });
    ['.craft-item-modal_selectable-items___VGof', '.trade-modal_tradable-items__RDYik', '.item-market-modal_selectable-items__Tuh4s'].forEach(sel => {
      const grid = document.querySelector(sel);
      if (grid) {
        Array.from(grid.querySelectorAll('button')).forEach(btn => {
          btn.style.display = '';
        });
      }
    });
  }

    function removeSearchBar(inputId) {
        const input = document.getElementById(inputId);
        if (!input) return;
        const wrap = input.closest('.guruItemSearchContainer');
        if (wrap) wrap.remove();
    }


  function enableItemSearch() {
    if (itemSearchEnabled) return;
    itemSearchEnabled = true;
    refreshItemSearch();
    if (!itemSearchObserver) {
      itemSearchObserver = new MutationObserver(() => {
        if (!itemSearchEnabled) return;
        refreshItemSearch();
      });
      itemSearchObserver.observe(document.body, { childList: true, subtree: true });
    }
  }

  function disableItemSearch() {
    itemSearchEnabled = false;
    removeItemSearchUI();
    if (itemSearchObserver) {
      itemSearchObserver.disconnect();
      itemSearchObserver = null;
    }
  }

  function setItemSearchEnabled(enabled) {
    if (enabled) enableItemSearch();
    else disableItemSearch();
  }

  function applyPersistedOptionClasses() {
    document.body.classList.toggle('guru-extend-inventory', load(idFor(1, 1)));
    document.body.classList.toggle('guru-wartoy-protections', load(idFor(1, 2)));
    document.body.classList.toggle('guru-hide-season-pass', load(idFor(1, 3)));
    document.body.classList.toggle('guru-hide-ads', load(idFor(1, 4)));
    document.body.classList.toggle('guru-hide-applications', load(idFor(1, 5)));
    updateHolidaySpirit(load(idFor(1, 6)));
    toggleItemDexFilter(load(idFor(1, 7)));
    toggleItemDexCompletion(load(idFor(1, 8)));
    setRecipeFeatureEnabled(load(idFor(1, 9)) === true);
    setItemSearchEnabled(load(idFor(1, 10)) === true);
  }

  function wireOptions() {
    const inputs = modal.querySelectorAll('input[type="checkbox"]');
    inputs.forEach((input) => {
      const id = input.id;
      const persisted = load(id);
      if (persisted === true) input.checked = true;

      input.addEventListener('change', (e) => {
        const checked = e.target.checked;
        save(id, checked);

        if (id === idFor(1, 1)) document.body.classList.toggle('guru-extend-inventory', checked);
        if (id === idFor(1, 2)) document.body.classList.toggle('guru-wartoy-protections', checked);
        if (id === idFor(1, 3)) document.body.classList.toggle('guru-hide-season-pass', checked);
        if (id === idFor(1, 4)) document.body.classList.toggle('guru-hide-ads', checked);
        if (id === idFor(1, 5)) document.body.classList.toggle('guru-hide-applications', checked);
        if (id === idFor(1, 6)) updateHolidaySpirit(checked);
        if (id === idFor(1, 7)) toggleItemDexFilter(checked);
        if (id === idFor(1, 8)) toggleItemDexCompletion(checked);
        if (id === idFor(1, 9)) setRecipeFeatureEnabled(checked);
        if (id === idFor(1, 10)) setItemSearchEnabled(checked);
      });

      const optionDiv = input.closest('.guruOption');
      if (optionDiv) {
        optionDiv.addEventListener('click', () => {
          input.checked = !input.checked;
          input.dispatchEvent(new Event('change'));
        });
        input.addEventListener('click', (e) => e.stopPropagation());
        const slider = optionDiv.querySelector('.slider');
        if (slider) slider.addEventListener('click', (e) => e.stopPropagation());
      }
    });
  }

  const overlayInit = () => {
    const container = document.querySelector('.layout_left__O2uku');
    if (!container) return;
    let btn = container.querySelector('#guruToolsBtn');
    if (!btn) {
      btn = document.createElement('button');
      btn.id = 'guruToolsBtn';
      btn.innerHTML = `
        <img id="guruToolsBtnIcon" src="https://fishtank.guru/resources/icons/gurutoolsicon.svg" alt="Guru Tools Icon" />
        <span>Guru Tools</span>
      `;
      container.insertBefore(btn, container.firstChild);
      btn.addEventListener('click', openModal);
      btn._gtBound = true;
    } else if (!btn._gtBound) {
      btn.addEventListener('click', openModal);
      btn._gtBound = true;
    }
  };

  function showUpdateButton() {
    const btn = document.getElementById('guruUpdateBtn');
    if (btn) {
      btn.style.display = 'inline-flex';
      if (!btn._gtBound) {
        btn.addEventListener('click', () => {
          window.open('https://greasyfork.org/en/scripts/557589-guru-tools', '_blank');
        });
        btn._gtBound = true;
      }
    }
  }

  async function checkForUpdate() {
    try {
      const res = await fetch(META_URL, { cache: 'no-store' });
      const text = await res.text();
      const match = text.match(/@version\s+([0-9.]+)/);
      if (match) {
        const latest = match[1];
        if (latest !== PLUGIN_VERSION) showUpdateButton();
      }
    } catch (e) {}
  }

  modal.querySelector('#guruModalClose').addEventListener('click', closeModal);

  wireOptions();
  applyPersistedOptionClasses();
  overlayInit();
  checkForUpdate();

  let domUpdateScheduled = false;
  const scheduleDomUpdate = () => {
    if (domUpdateScheduled) return;
    domUpdateScheduled = true;
    setTimeout(() => {
      domUpdateScheduled = false;
      overlayInit();
      const btnEl = document.querySelector('#guruToolsBtn');
      if (btnEl && !btnEl._gtBound) {
        btnEl.addEventListener('click', openModal);
        btnEl._gtBound = true;
      }
      if (overlay.style.display !== 'block') overlay.style.display = 'none';
      if (modal.style.display !== 'flex') modal.style.display = 'none';
      applyPersistedOptionClasses();
      if (load(idFor(1, 7))) toggleItemDexFilter(true);
      if (load(idFor(1, 8))) updateItemDexCompletion();
    }, 120);
  };

  const observer = new MutationObserver(() => {
    scheduleDomUpdate();
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });

  let profileUpdateScheduled = false;
  const scheduleProfileUpdate = () => {
    if (profileUpdateScheduled) return;
    profileUpdateScheduled = true;
    setTimeout(() => {
      profileUpdateScheduled = false;
      const filterEnabled = load(idFor(1, 7));
      toggleItemDexFilter(filterEnabled);
      if (load(idFor(1, 8))) updateItemDexCompletion();
    }, 120);
  };

  const profileObserver = new MutationObserver(() => {
    scheduleProfileUpdate();
  });
  profileObserver.observe(document.body, { childList: true, subtree: true });

  document.addEventListener('DOMContentLoaded', () => {
    applyPersistedOptionClasses();
    if (load(idFor(1, 8))) updateItemDexCompletion();
  });

  const HOLIDAY_RECHECK_MIN_MS = 60000;
  function scheduleHolidayRecheck() {
    const now = new Date();
    const nextMidnight = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1, 0, 0, 0, 0
    );
    const msUntilMidnight = nextMidnight.getTime() - now.getTime();
    setTimeout(() => {
      updateHolidaySpirit(load(idFor(1, 6)));
      scheduleHolidayRecheck();
    }, Math.max(msUntilMidnight, HOLIDAY_RECHECK_MIN_MS));
  }
  scheduleHolidayRecheck();
})();
