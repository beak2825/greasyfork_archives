// ==UserScript==
// @name         Bazaar Mate
// @namespace    onebazaar.zero.nao
// @version      4.0.0
// @description  Your own bazaar helper
// @author       GFOUR
// @match        https://www.torn.com/bazaar.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/552420/Bazaar%20Mate.user.js
// @updateURL https://update.greasyfork.org/scripts/552420/Bazaar%20Mate.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const NS = 'OBM4';
    const WATCH_URL_PART = '/bazaar.php?sid=bazaarData&step=getBazaarItems';

    const DEFAULTS = {
        sort: 'price-asc',
        maxPrice: Infinity,
        feePercent: 5,
        showNegatives: false,
        notifications: false,
        search: '',
        minimized: false,
        showLog: false,
        pos: {
            top: 64,
            left: null,
            right: 16
        },
        favorites: [],
        favoriteCaps: {},
        favoriteNames: {},
    };

    const SEL = {
        container: '#obm',
        header: '#obmHdr',
        list: '#obmList',
        log: '#obmLog',
        search: '#obmSearch',
        maxPrice: '#obmMax',
        cashBtn: '#obmCashBtn',
        fab: '#obmFab',
        counters: {
            items: '#obmItems',
            dollars: '#obmDollars',
            cash: '#obmCash',
            favs: '#obmFavs',
        },
        settingsBtn: '#obmSettingsBtn',
        minimizeBtn: '#obmMinimize',
        closeBtn: '#obmClose',
        settings: {
            overlay: '#obmSettingsPane',
            sort: '#obmSort',
            fee: '#obmFee',
            showNeg: '#obmShowNeg',
            notif: '#obmNotif',
            logToggle: '#obmLogToggle',
            close: '#obmSettingsBack',
            favCaps: '#obmFavCaps',
        },
    };
    const ICONS = {
  drag: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="ico" fill="currentColor" aria-hidden="true">
    <circle cx="7" cy="8" r="1.2"/><circle cx="12" cy="8" r="1.2"/><circle cx="17" cy="8" r="1.2"/>
    <circle cx="7" cy="15" r="1.2"/><circle cx="12" cy="15" r="1.2"/><circle cx="17" cy="15" r="1.2"/>
  </svg>`,
  scan: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="ico" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="7"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2"/>
  </svg>`,
  settings: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="ico" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M4 6h16M4 12h16M4 18h16"/><circle cx="8" cy="6" r="2"/><circle cx="16" cy="12" r="2"/><circle cx="10" cy="18" r="2"/>
  </svg>`,
  minimize: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="ico" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M5 12h14"/>
  </svg>`,
  restore: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="ico" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <rect x="6" y="6" width="12" height="12" rx="2"/>
  </svg>`,
  close: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="ico" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M5 5l14 14M19 5l-14 14"/>
  </svg>`,
  cash: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="ico" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <rect x="3.5" y="7" width="17" height="10" rx="2"/><circle cx="12" cy="12" r="3"/>
  </svg>`,
  back: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="ico" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M15 18l-6-6 6-6"/>
  </svg>`,
  star: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="ico" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  </svg>`,
  starFilled: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="ico" fill="currentColor" aria-hidden="true">
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
  </svg>`,
};

    let settings = loadAll();
    let items = new Map();
    let bought = new Set();
    let lastClick = 0;
    let latestSeller = null;
    let updateScheduled = false;
    let currentCash = 0;
    let hookedFetch = false;
    let hookedXHR = false;
    let cashObs = null;
    let cashIntervalId = 0;
    let scanHintDone = false;

    function stopScanHint() {
        scanHintDone = true;
        $('#obmScanBtn').removeClass('blink');
    }
    // Stop scan as soon as we see any item above the max price (for current seller).
    function shouldStopScanByMax() {
        if (!isFinite(settings.maxPrice) || !latestSeller) return false;
        const cutoff = settings.maxPrice;
        for (const it of items.values()) {
            if (it.sellerUserId === latestSeller && it.price > cutoff) {
                return true;
            }
        }
        return false;
    }

    function getSortIndicatorText() {
        // Prefer the classes you referenced; fall back to a generic search
        const el =
              document.querySelector("div.loadingSame___XWj3U .loaderText___d8TAE") ||
              document.querySelector("[class*='loaderText']");
        return (el && el.textContent ? el.textContent.trim() : '');
    }

    function getCostSortState() {
        const txt = (getSortIndicatorText() || '').toLowerCase();
        if (!txt) return 'unknown';
        const isCost = /(cost|price)/.test(txt);
        if (isCost && /ascending/.test(txt)) return 'cost-asc';
        if (isCost && /descending/.test(txt)) return 'cost-desc';
        return 'unknown';
    }

    function isCostAscending() {
        return getCostSortState() === 'cost-asc';
    }

    function findCostSortButton() {
        // Try to find the "Cost/Price" sort button (best-effort)
        return (
            document.querySelector("button[title*='Cost' i]") ||
            document.querySelector("button[title*='Price' i]") ||
            Array.from(document.querySelectorAll('button, [role="button"]'))
            .find(el => /cost|price/i.test(el.textContent || '')) ||
            document.querySelector('button.item___UN3Mg:nth-child(5)') // your original fallback
        );
    }


    function k(key) {
        return `${NS}:${key}`;
    }

    function load(key, def = DEFAULTS[key]) {
        try {
            const raw = localStorage.getItem(k(key));
            if (raw == null) return def;
            if (raw === 'Infinity') return Infinity;
            return JSON.parse(raw);
        } catch {
            return def;
        }
    }

    function save(key, val) {
        try {
            localStorage.setItem(k(key), val === Infinity ? 'Infinity' : JSON.stringify(val));
        } catch {}
    }

    function loadAll() {
        const s = {};
        for (const key of Object.keys(DEFAULTS)) s[key] = load(key);
        return s;
    }

    function formatNum(n) {
        try {
            return Math.floor(Number(n)).toLocaleString();
        } catch {
            return String(Math.floor(n));
        }
    }

    function parseMoney(str) {
        if (typeof str === 'number') return str;
        const x = parseInt(String(str || '').replace(/[^\d-]/g, ''), 10);
        return isNaN(x) ? 0 : x;
    }

    function escapeHtml(s) {
        return String(s ?? '')
            .replaceAll('&', '&amp;').replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;').replaceAll('"', '&quot;')
            .replaceAll("'", '&#39;');
    }

    function getRFC() {
        return (window.$ && $.cookie && $.cookie('rfc_v')) ||
            document.cookie.split('; ').find(r => r.startsWith('rfc_v='))?.split('=')[1] || '';
    }

    function notify(title, body) {
        try {
            if (!settings.notifications) return;
            if (!('Notification' in window)) return;
            if (Notification.permission !== 'granted') return;
            const n = new Notification(title, {
                body
            });
            n.onclick = () => window.focus();
        } catch {}
    }

    function profitPerUnit(price, mv, feePercent) {
        return (mv * (1 - feePercent / 100)) - price;
    }

    function isFavItem(itemId) {
        const arr = settings.favorites || [];
        return arr.includes(Number(itemId));
    }
    function setFavorite(itemId, on) {
        itemId = Number(itemId);
        let arr = (settings.favorites || []).map(Number).filter(n => !isNaN(n));
        const i = arr.indexOf(itemId);
        if (on && i === -1) arr.push(itemId);
        if (!on && i !== -1) arr.splice(i, 1);
        settings.favorites = arr;
        save('favorites', arr);
    }
    function toggleFavorite(itemId) {
        const nowOn = !isFavItem(itemId);
        setFavorite(itemId, nowOn);
        return nowOn;
    }
function getFavMax(itemId) {
  const caps = settings.favoriteCaps || {};
  const v = caps[itemId];
  return (v == null || !(v >= 0)) ? Infinity : Number(v);
}
    function favCapProfit(it) {
  const cap = getFavMax(it.itemId);
  // If no cap set (Infinity), use -Infinity so it sorts last among favorites
  return isFinite(cap) ? (cap - it.price) : Number.NEGATIVE_INFINITY;
}
function setFavMax(itemId, val) {
  const caps = settings.favoriteCaps || {};
  if (val == null || !isFinite(val) || val <= 0) {
    delete caps[itemId]; // Infinity when cleared
  } else {
    caps[itemId] = Math.floor(Number(val));
  }
  settings.favoriteCaps = caps;
  save('favoriteCaps', caps);
  scheduleUI();
}
function formatCapInputLive(el, itemId) {
  const raw = el.value;
  const caret = el.selectionStart ?? raw.length;
  const digitsBefore = getDigitsBeforeCaret(raw, caret);
  const digitsOnly = raw.replace(/[^\d]/g, '');
  if (!digitsOnly.length) {
    el.value = '';
    setFavMax(itemId, Infinity);
    return;
  }
  const n = parseInt(digitsOnly, 10);
  const formatted = formatMoneyInline(n);
  el.value = formatted;
  const newPos = caretPosForDigits(formatted, digitsBefore);
  try { el.setSelectionRange(newPos, newPos); } catch {}
  setFavMax(itemId, n);
}

function setFavName(itemId, name) {
  if (!name) return;
  const m = settings.favoriteNames || {};
  if (m[itemId] !== name) {
    m[itemId] = name;
    settings.favoriteNames = m;
    save('favoriteNames', m);
  }
}
function getFavName(itemId) {
  return (settings.favoriteNames && settings.favoriteNames[itemId]) ||
         (() => {
           for (const it of items.values()) if (it.itemId === itemId) return it.name;
           return 0;
         })();
}

function isFavActiveForPin(item) {
  return isFavItem(item.itemId) && item.price <= getFavMax(item.itemId);
}

    function renderFavCapsList() {
  const $wrap = $(SEL.settings.favCaps);
  if (!$wrap.length) return;

  const favIds = (settings.favorites || []).map(Number).filter(n => !isNaN(n));
  if (!favIds.length) {
    $wrap.html('<div class="muted">No favorites yet. Star items to manage caps here.</div>');
    return;
  }

  const rows = favIds.map(id => {
    const name = escapeHtml(getFavName(id));
    const cap = getFavMax(id);
    const val = isFinite(cap) ? formatMoneyInline(cap) : '';
      if (name == 0) return;
      return `
  <div class="caprow" data-itemid="${id}">
    <div class="iname" title="${name}">${name}</div>
    <input class="input capinput" data-itemid="${id}" placeholder="∞" value="${val}" title="Max price">
    <button class="btn-icon removefav" data-itemid="${id}" title="Remove">${ICONS.close}</button>
  </div>
`;

  }).join('');

  $wrap.html(rows);
}
    function buildUI() {
  $(SEL.container).remove();
  $('#obmStyles').remove();
  $(SEL.fab).remove();

  const top = settings.pos?.top ?? DEFAULTS.pos.top;
  const right = settings.pos?.right ?? DEFAULTS.pos.right;
  const left = settings.pos?.left;

  const fabPos = `${left != null ? `left:${left}px;` : ''}${right != null ? `right:${right}px;` : ''}top:${top}px;`;

  const styles = `
    <style id="obmStyles">
      #obm, #obm * { box-sizing: border-box; }
      ${SEL.container}{
        position: fixed;
        ${left != null ? `left:${left}px;` : ''}
        ${right != null ? `right:${right}px;` : ''}
        top:${top}px;
        width:340px; height:60vh; max-height:80vh; min-width:300px;
        display:flex; flex-direction:column; overflow:hidden;
        background:#1f1f1f; border:1px solid #3a3a3a; border-radius:10px; color:#eaeaea;
        font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif;
        box-shadow:0 10px 26px rgba(0,0,0,0.35); z-index:9999;
      }
      ${SEL.header}{
        display:flex; align-items:center; gap:6px; padding:6px 8px;
        background:#2b2b2b; border-bottom:1px solid #3a3a3a; user-select:none;
      }
      #obmDrag{ display:flex; align-items:center; gap:8px; font-weight:600; color:#ddd; cursor:move; -webkit-app-region:drag; }
      #obmHdr .spacer{flex:1;}

      /* Views */
      #obmMain{display:flex; flex-direction:column; min-height:0; flex:1;}
      #obmSettingsPane{display:none; flex:1; overflow:auto; padding:8px; background:#1b1b1b;}
      .mode-settings #obmMain{display:none;}
      .mode-settings #obmSettingsPane{display:flex; flex-direction:column;}

      /* Controls, list, status */
      #obmCtrls{ display:flex; align-items:center; gap:6px; padding:6px 8px; background:#262626; border-bottom:1px solid #333; }
      ${SEL.list}{flex:1; overflow:auto; padding:8px; background:#1b1b1b;}
      #obmStatus{ display:flex; align-items:center; justify-content:space-between; gap:8px; padding:6px 8px; background:#202020; border-top:1px solid #333; }

      .chip{font-size:11px; padding:2px 6px; border-radius:999px; background:#444; color:#fff; font-weight:600;}
      #obmDollars{background:#a53939;}
      #obmCash{background:#385a38;}
      #obmFavs{background:#5a43a5;}
      .input{ background:#2a2a2a; border:1px solid #444; color:#fff; border-radius:6px; padding:5px 7px; font-size:12px; outline:none; }
      .input::placeholder{color:#aaa;}
      .btn{ background:#2a2a2a; border:1px solid #444; color:#ddd; border-radius:6px; padding:5px 7px; font-size:12px; cursor:pointer; }
      .btn:hover{background:#383838;}
      .btn-icon{width:28px; height:28px; display:flex; align-items:center; justify-content:center; padding:0;}

      /* Items */
      .it{ background:#2a2a2a; border:1px solid #3a3a3a; border-radius:8px; padding:8px; margin:0 0 6px; color:#eee; cursor:pointer; position:relative; }
      .it:hover{background:#313131; border-color:#4a4a4a;}
      .it.dollar{border-left:4px solid #ff4747; background:#332626;}
      .it.fav{border-left:4px solid #8f6bff; background:linear-gradient(0deg, #2b2640, #2a2a2a);}
      .it .top{display:flex; justify-content:space-between; gap:8px; align-items:center;}
      .it .name{font-weight:700; font-size:12px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;}
      .tag{font-size:10px; padding:0 6px; border-radius:999px; background:#3a3a3a; color:#ccc; border:1px solid #4a4a4a;}
      .tag.price{background:#3a3a3a;}
      .tag.profit{background:#214a2a; color:#9ae39a; border-color:#2f6b3b;}
      .una{opacity:0.55;}
      .act{display:flex; gap:6px; align-items:center; margin-top:6px;}
      .act .qty{width:66px; text-align:right;}
      .act .hint{margin-left:auto; font-size:10px; color:#aaa; pointer-events:none;}
      .lack{ margin-top:4px; font-size:11px; color:#f15a5a; }
      .it.inflight{opacity:0.6; pointer-events:none;}

      /* Fav button */
      .favtoggle { border:none; background:transparent; color:#b9b1e6; padding:0; width:24px; height:24px; display:flex; align-items:center; justify-content:center; cursor:pointer; }
      .favtoggle:hover{ color:#e6d8ff; }
      .favtoggle.on{ color:#ffd666; }

      /* In-panel settings */
      #obmSettingsPane .panel{ background:#222; border:1px solid #3a3a3a; color:#eee; border-radius:10px; width:100%; max-width:360px; margin:0 auto; padding:10px; }
      #obmSettingsPane .h{display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;}
      #obmSettingsPane .row{display:flex; gap:8px; align-items:center; margin:6px 0;}
      #obmSettingsPane label{font-size:12px; color:#bbb; min-width:90px;}

      /* Log */
      #obmLog{display:none; height:80px; overflow:auto; padding:6px 8px; background:#1a1a1a; border-top:1px solid #333;}
      #obmLog .count { color:#9ae39a; font-weight:700; }
      #obmLog .total { color:#f6d98a; font-weight:700; }
      .show-log #obmLog{display:block;}
      .loge{margin:2px 0; font-size:11px;}
      .ok{color:#7ad07a;} .err{color:#f15a5a;} .info{color:#8ab4f8;}

      .mini #obmCtrls, .mini #obmLog, .mini #obmStatus{display:none;}
      .mini #obmSettingsPane{display:none;}

      .ico { width:16px; height:16px; }
      .btn-icon svg { width:16px; height:16px; }
      #obmDrag .ico { margin-right:6px; }

      /* Floating mini icon */
      #obmFab{
        position:fixed; ${fabPos}
        width:44px; height:44px; border-radius:50%;
        background:#2b2b2b; border:1px solid #3a3a3a; color:#ddd;
        display:flex; align-items:center; justify-content:center;
        box-shadow:0 10px 26px rgba(0,0,0,0.35); z-index:9999; cursor:pointer;
      }
      #obmFab:hover{ background:#343434; }
      #obmFab .ico{ width:18px; height:18px; }
      #obmSettingsPane .favcaps .caprow{display:flex; align-items:center; gap:8px; margin:4px 0;}
#obmSettingsPane .favcaps .iname{flex:1; font-size:12px; color:#ddd; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;}
#obmSettingsPane .favcaps .capinput{width:120px;}
#obmSettingsPane .favcaps .muted{font-size:12px; color:#888; padding:6px 0;}
#obmSettingsPane .favcaps .removefav {
  width: 24px;
  height: 24px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
/* Make item cards unselectable */
#obmList .it {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  -webkit-touch-callout: none; /* iOS long-press menu */
}

/* Re-enable selection where you need it (inputs/textareas) */
#obmList .it input,
#obmList .it textarea {
  -webkit-user-select: text;
  -moz-user-select: text;
  -ms-user-select: text;
  user-select: text;
}
    </style>
  `;

  const html = `
    <div id="obm" class="${settings.minimized ? '' : ''} ${settings.showLog ? 'show-log' : ''}">
      <div id="obmHdr" title="Bar">
        <div id="obmDrag" title="Drag">${ICONS.drag} One Bazaar</div>
        <div class="spacer"></div>
        <button id="obmScanBtn" class="btn btn-icon" title="Scan">${ICONS.scan}</button>
        <button id="obmSettingsBtn" class="btn btn-icon" title="Settings">${ICONS.settings}</button>
        <button id="obmMinimize" class="btn btn-icon" title="Minimize">${ICONS.minimize}</button>
        <button id="obmClose" class="btn btn-icon" title="Close">${ICONS.close}</button>
      </div>

      <div id="obmMain">
        <div id="obmCtrls" title="Filters">
          <input id="obmSearch" class="input" placeholder="Search" title="Search" value="${escapeHtml(settings.search || '')}" style="flex:1;">
          <input id="obmMax" class="input" type="text" inputmode="numeric" placeholder="Max $" title="Max price" style="width:110px;">
          <button id="obmCashBtn" class="btn btn-icon" title="Cash">${ICONS.cash}</button>
        </div>
        <div id="obmList" title="Items"></div>
        <div id="obmStatus" title="Status">
          <div style="display:flex; gap:6px; align-items:center; flex-wrap:wrap;">
            <span id="obmItems" class="chip" title="Items">0</span>
            <span id="obmDollars" class="chip" title="$1">0</span>
            <span id="obmFavs" class="chip" title="Favorites">0</span>
          </div>
          <span id="obmCash" class="chip" title="Cash">$0</span>
        </div>
        <div id="obmLog" title="Log"><div class="loge info">Ready — listening for bazaar updates</div></div>
      </div>

      <div id="obmSettingsPane" title="Settings">
        <div class="panel">
          <div class="h">
            <div>Settings</div>
            <button id="obmSettingsBack" class="btn btn-icon" title="Back">${ICONS.back}</button>
          </div>
          <div class="row">
            <label>Sort</label>
            <select id="obmSort" class="input" style="flex:1;" title="Sort">
              <option value="price-asc">Price ↑</option>
              <option value="price-desc">Price ↓</option>
              <option value="profit-desc">Profit/u ↓</option>
              <option value="totalprofit-desc">Total profit ↓</option>
              <option value="gain-desc">Gain % ↓</option>
              <option value="name-asc">Name ↑</option>
            </select>
          </div>
          <div class="row">
            <label>Fee %</label>
            <input id="obmFee" class="input" type="number" min="0" max="20" step="0.5" style="width:80px;" title="Fee %">
          </div>
          <div class="row">
            <label>Negatives</label>
            <input id="obmShowNeg" type="checkbox" title="Negatives">
          </div>
          <div class="row">
            <label>Notify</label>
            <input id="obmNotif" type="checkbox" title="Notify">
          </div>
          <div class="row">
            <label>Log</label>
            <input id="obmLogToggle" type="checkbox" title="Log">
          </div>
          <div class="row">
  <label>Fav caps</label>
  <div style="flex:1; font-size:12px; color:#888;">Only pin/highlight favorites priced at or under their cap.</div>
</div>
<div id="obmFavCaps" class="favcaps"></div>
        </div>
      </div>
    </div>

    <button id="obmFab" title="Open One Bazaar" style="display:${settings.minimized ? 'flex' : 'none'};">
      ${ICONS.restore}
    </button>
  `;

  $('head').append(styles);
  $('body').append(html);

  $(SEL.settings.sort).val(settings.sort);
  $(SEL.settings.fee).val(settings.feePercent);
  $(SEL.settings.showNeg).prop('checked', !!settings.showNegatives);
  $(SEL.settings.notif).prop('checked', !!settings.notifications);
  $(SEL.settings.logToggle).prop('checked', !!settings.showLog);


  setMaxInputFromSettings();

  // Drag full panel
  let dragging = false;
  let offset = { x: 0, y: 0 };
  $('#obmDrag').on('mousedown', (e) => {
    dragging = true;
    const r = $(SEL.container)[0].getBoundingClientRect();
    offset.x = e.clientX - r.left;
    offset.y = e.clientY - r.top;
  });
  $(document).off('mousemove.obm mouseup.obm')
    .on('mousemove.obm', (e) => {
      if (!dragging) return;
      $(SEL.container).css({ left: e.clientX - offset.x, right: '', top: e.clientY - offset.y });
    })
    .on('mouseup.obm', () => {
      if (!dragging) return;
      dragging = false;
      const r = $(SEL.container)[0].getBoundingClientRect();
      settings.pos.left = r.left;
      settings.pos.top = r.top;
      settings.pos.right = null;
      save('pos', settings.pos);
      // also move fab accordingly
      $(SEL.fab).css({ left: r.left, right: '', top: r.top });
    });

  // Drag FAB
  let fabDragging = false;
  let fabOffset = { x: 0, y: 0 };
  $(SEL.fab).on('mousedown', (e) => {
    fabDragging = true;
    const r = $(SEL.fab)[0].getBoundingClientRect();
    fabOffset.x = e.clientX - r.left;
    fabOffset.y = e.clientY - r.top;
    e.preventDefault();
  });
  $(document)
    .on('mousemove.obmFab', (e) => {
      if (!fabDragging) return;
      $(SEL.fab).css({ left: e.clientX - fabOffset.x, right: '', top: e.clientY - fabOffset.y });
    })
    .on('mouseup.obmFab', () => {
      if (!fabDragging) return;
      fabDragging = false;
      const r = $(SEL.fab)[0].getBoundingClientRect();
      settings.pos.left = r.left;
      settings.pos.top = r.top;
      settings.pos.right = null;
      save('pos', settings.pos);
    });

  // Filters and UI controls
  $(SEL.search).on('input', (e) => { settings.search = e.target.value || ''; save('search', settings.search); scheduleUI(); });
  $(SEL.maxPrice).on('input', (e) => { formatMaxInputLive(e.target); });
  $(SEL.maxPrice).on('focus', (e) => { setTimeout(() => { try { e.target.select(); } catch {} }, 0); });
  $(SEL.cashBtn).on('click', () => { settings.maxPrice = currentCash || 0; save('maxPrice', settings.maxPrice); setMaxInputFromSettings(); scheduleUI(); });
  $('#obmScanBtn').on('click', async () => { stopScanHint?.(); await runScan(); });

  $(SEL.settingsBtn).on('click', () => showSettings());
  $(SEL.settings.close).on('click', () => showSettings(false));

  // Minimize to FAB
  $(SEL.minimizeBtn).off('click').on('click', () => {
    $(SEL.container).hide();
    $(SEL.fab).show();
    settings.minimized = true;
    save('minimized', true);
  });
  // Restore from FAB
  $(SEL.fab).on('click', (e) => {
    // ignore if we just dragged (mouse moved > few px handled inherently by mousedown/mouseup)
    $(SEL.fab).hide();
    $(SEL.container).show();
    settings.minimized = false;
    save('minimized', false);
  });

  $(SEL.closeBtn).on('click', () => $(SEL.container).hide());
        $(SEL.list).on('selectstart', '.it', function (e) {
  if (!$(e.target).is('input,textarea')) e.preventDefault();
});

  $(SEL.settings.sort).on('change', (e) => { settings.sort = e.target.value; save('sort', settings.sort); scheduleUI(); });
  $(SEL.settings.fee).on('input', (e) => { settings.feePercent = Math.max(0, Math.min(20, Number(e.target.value) || 0)); save('feePercent', settings.feePercent); recomputeProfits(); scheduleUI(); });
  $(SEL.settings.showNeg).on('change', (e) => { settings.showNegatives = !!e.target.checked; save('showNegatives', settings.showNegatives); scheduleUI(); });
  $(SEL.settings.notif).on('change', async (e) => {
    if (e.target.checked) {
      if ('Notification' in window) {
        const perm = await Notification.requestPermission().catch(() => 'denied');
        settings.notifications = perm === 'granted';
      } else settings.notifications = false;
    } else settings.notifications = false;
    save('notifications', settings.notifications);
    log(`Notifications ${settings.notifications ? 'enabled' : 'disabled'}`, 'info');
  });
  $(SEL.settings.logToggle).on('change', (e) => {
    settings.showLog = !!e.target.checked;
    save('showLog', settings.showLog);
    $(SEL.container).toggleClass('show-log', settings.showLog);
  });

        renderFavCapsList();

$(SEL.settings.overlay) // '#obmSettingsPane'
  .off('input.obmCap click.obmCap')
  .on('input.obmCap', '.capinput', function () {
    const itemId = Number(this.dataset.itemid);
    if (!itemId) return;
    formatCapInputLive(this, itemId);
  })
  .on('click', '.removefav', function () {
    const id = Number($(this).data('itemid'));
    setFavorite(id, false); // remove from favorites
    scheduleUI(); // re-render UI
});

  // Buy handlers
  $(SEL.list).on('click', '.it', async function (e) {
    if ($(e.target).closest('.buyqty, .qty, .favtoggle').length) return;
    const id = Number(this.getAttribute('data-id'));
    const data = items.get(id);
    if (!data) return;
    const enoughForFull = (data.price * data.amount) <= currentCash;
    if (!enoughForFull) return;
    const t = Date.now();
    if (t - lastClick < 800) return;
    lastClick = t;
    $(this).addClass('inflight');
    await buyItem(data, data.amount);
  });
  $(SEL.list).on('click', '.buyqty', async function (e) {
    e.preventDefault(); e.stopPropagation();
    const $it = $(this).closest('.it');
    const id = Number($it.attr('data-id'));
    const data = items.get(id);
    if (!data) return;
    const qty = Math.max(1, Math.min(data.amount, parseMoney($it.find('.qty').val() || 0)));
    const cost = qty * data.price;
    if (cost > currentCash) return;
    const t = Date.now();
    if (t - lastClick < 800) return;
    lastClick = t;
    $it.addClass('inflight');
    await buyItem(data, qty);
  });
  $(SEL.list).on('input', '.qty', function () {
    const $it = $(this).closest('.it');
    const id = Number($it.attr('data-id'));
    const data = items.get(id);
    if (!data) return;
    let qty = parseMoney($(this).val() || 0);
    qty = Math.max(1, Math.min(data.amount, qty));
    const cost = qty * data.price;
    $it.find('.buyqty').prop('disabled', cost > currentCash || qty < 1);
  });

  // Favorite toggle
  $(SEL.list).on('click', '.favtoggle', function (e) {
  e.preventDefault(); e.stopPropagation();
  const $it = $(this).closest('.it');
  const id = Number($it.attr('data-id'));
  const data = items.get(id);
  if (!data) return;

  const nowOn = toggleFavorite(data.itemId);
  if (nowOn) setFavName(data.itemId, data.name);
  log(`${nowOn ? '⭐ Added to' : '☆ Removed from'} favorites: ${data.name}`, 'info');

  // If settings is open, refresh the list
  if ($(SEL.container).hasClass('mode-settings')) renderFavCapsList();

  scheduleUI();
});

  if (typeof scanHintDone !== 'undefined' && !scanHintDone) $('#obmScanBtn').addClass('blink');
  log('Settings now open inline. Click ⚙️ to toggle.', 'info');

  // Panel / FAB initial visibility
  if (settings.minimized) {
    $(SEL.container).hide();
    $(SEL.fab).show();
  } else {
    $(SEL.container).show();
    $(SEL.fab).hide();
  }
}

    function scheduleUI() {
        if (updateScheduled) return;
        updateScheduled = true;
        requestAnimationFrame(() => {
            updateUI();
            updateScheduled = false;
        });
    }

    function formatMoneyInline(n) {
        try {
            return Number(n).toLocaleString();
        } catch {
            return String(n || '');
        }
    }

    function getDigitsBeforeCaret(str, caret) {
        return (str.slice(0, caret).match(/\d/g) || []).length;
    }

    function caretPosForDigits(formatted, targetDigits) {
        let pos = 0,
            seen = 0;
        while (pos < formatted.length && seen < targetDigits) {
            if (/\d/.test(formatted[pos])) seen++;
            pos++;
        }
        return pos;
    }

    function formatMaxInputLive(el) {
        const raw = el.value;
        const caret = el.selectionStart ?? raw.length;
        const digitsBefore = getDigitsBeforeCaret(raw, caret);
        const digitsOnly = raw.replace(/[^\d]/g, '');
        if (!digitsOnly.length) {
            el.value = '';
            settings.maxPrice = Infinity;
            save('maxPrice', settings.maxPrice);
            scheduleUI();
            return;
        }
        const n = parseInt(digitsOnly, 10);
        const formatted = formatMoneyInline(n);
        el.value = formatted;
        const newPos = caretPosForDigits(formatted, digitsBefore);
        try {
            el.setSelectionRange(newPos, newPos);
        } catch {}
        settings.maxPrice = n;
        save('maxPrice', n);
        scheduleUI();
    }

    function setMaxInputFromSettings() {
        const $el = $(SEL.maxPrice);
        const v = isFinite(settings.maxPrice) ? settings.maxPrice : '';
        $el.val(v === '' ? '' : formatMoneyInline(v));
    }

    const sleep = (ms) => new Promise(r => setTimeout(r, ms));

    function scrollEl() {
        return document.scrollingElement || document.documentElement || document.body;
    }

    async function scrollToBottomLoad(maxLoops = 80, stopWhen) {
        const s = scrollEl();
        let lastH = -1, stable = 0;
        for (let i = 0; i < maxLoops; i++) {
            if (typeof stopWhen === 'function' && stopWhen()) break;

            window.scrollTo(0, s.scrollHeight);
            await sleep(200);

            if (typeof stopWhen === 'function' && stopWhen()) break;

            const h = s.scrollHeight;
            if (h === lastH) {
                if (++stable >= 3) break;
            } else {
                stable = 0;
                lastH = h;
            }
        }
    }

    async function scrollToTopSmooth() {
        const s = scrollEl();
        for (let i = 0; i < 40 && s.scrollTop > 0; i++) {
            window.scrollBy(0, -Math.max(200, window.innerHeight * 0.8));
            await sleep(30);
        }
        window.scrollTo(0, 0);
    }

    async function runScan() {
        try {
            stopScanHint();

            const wasAsc = isCostAscending();
            let clicked = false;

            if (!wasAsc) {
                const btn = findCostSortButton();
                if (btn) {
                    // One click max (compliant)
                    btn.click();
                    clicked = true;
                    await sleep(250);
                }
            }

            const asc = isCostAscending();
            if (asc) {
                log(`Scanning (Cost ↑ ${clicked ? 'after 1 click' : 'detected'})`, 'info');
            } else {
                log(`Scanning (Cost ↑ not detected${clicked ? ' after 1 click' : ''}). Early-stop disabled.`, 'info');
            }

            const hasMax = isFinite(settings.maxPrice);
            const canEarlyStop = asc && hasMax;

            if (hasMax) {
                log(`Max price: $${formatNum(settings.maxPrice)}${canEarlyStop ? ' — early-stop enabled' : ''}`, 'info');
            }

            await scrollToBottomLoad(80, () => canEarlyStop && shouldStopScanByMax());
            await sleep(250);
            await scrollToTopSmooth();

            if (canEarlyStop && shouldStopScanByMax()) {
                log(`Scan stopped early — reached first item above $${formatNum(settings.maxPrice)}.`, 'ok');
            } else {
                log('Scan complete', 'ok');
            }
        } catch (e) {
            log(`Scan error: ${e.message}`, 'err');
        }
    }

    function sortItems(arr) {
        const fns = {
            'price-asc': (a, b) => a.price - b.price,
            'price-desc': (a, b) => b.price - a.price,
            'profit-desc': (a, b) => b.profit - a.profit,
            'totalprofit-desc': (a, b) => b.totalProfit - a.totalProfit,
            'gain-desc': (a, b) => b.gainPct - a.gainPct,
            'name-asc': (a, b) => a.name.localeCompare(b.name),
        };
        const cmp = fns[settings.sort] || fns['price-asc'];
        arr.sort((a, b) => {
            if (a.price === 1 && b.price !== 1) return -1;
            if (b.price === 1 && a.price !== 1) return 1;
            return cmp(a, b);
        });
        return arr;
    }

    function updateUI() {
  $(SEL.counters.cash).text(`$${formatNum(currentCash)}`);

  let arr = Array.from(items.values());

  // Filters
  if (settings.search) {
    const s = settings.search.toLowerCase();
    arr = arr.filter(x => x.name && x.name.toLowerCase().includes(s));
  }
  if (!settings.showNegatives) arr = arr.filter(x => x.profit >= 0 && x.gainPct >= 0);
  if (isFinite(settings.maxPrice)) arr = arr.filter(x => x.price <= settings.maxPrice);

  // Grouping: $1 first, then favorites (only if price <= cap), then the rest
const dollars = arr.filter(x => x.price === 1);
const favPinned = arr.filter(x => x.price !== 1 && isFavActiveForPin(x));
const rest = arr.filter(x => x.price !== 1 && !isFavActiveForPin(x));

// Sort $1 and rest with your chosen sort, favorites by cap-profit desc
sortItems(dollars);
favPinned.sort((a, b) => {
  const db = favCapProfit(b);
  const da = favCapProfit(a);
  if (db !== da) return db - da;                // cap diff (desc)
  // tie-breakers to keep things stable
  if (a.price !== b.price) return a.price - b.price;
  return a.name.localeCompare(b.name);
});
sortItems(rest);

// Final order
arr = [...dollars, ...favPinned, ...rest];

  $(SEL.counters.items).text(arr.length);
$(SEL.counters.dollars).text(dollars.length);
const totalFavIds = (settings.favorites || []).length;
$(SEL.counters.favs).text(favPinned.length).attr('title', `Favorites pinned: ${favPinned.length}/${totalFavIds}`);

  const html = arr.map(x => {
    const fullCost = x.price * x.amount;
    const affordableFull = fullCost <= currentCash;
    const maxQtyAffordable = Math.min(x.amount, Math.floor((currentCash || 0) / x.price));
    const favOn = isFavItem(x.itemId);
const cap = getFavMax(x.itemId);
const favPinnedNow = favOn && x.price <= cap;
const capProfitVal = isFinite(cap) ? (cap - x.price) : null;

const profitTag = (favOn && isFinite(cap) && capProfitVal > 0)
  ? `<span class="tag profit" title="Profit vs cap">+$${formatNum(capProfitVal)}</span>`
  : (x.profit > 0
     ? `<span class="tag profit" title="Profit/u (MV-based)">+$${formatNum(x.profit)}</span>`
     : ``);
      return `
  <div class="it ${x.price === 1 ? 'dollar' : ''} ${favPinnedNow ? 'fav' : ''} ${affordableFull ? '' : 'una'}"
       data-id="${x.id}"
       title="${escapeHtml(x.name)}">
    <div class="top">
      <div class="name" title="Name">${escapeHtml(x.name)}</div>
      <div class="row" style="display:flex; gap:6px; align-items:center;">
        <button class="favtoggle ${favOn ? 'on' : ''}" title="${favOn ? 'Unfavorite' : 'Favorite'}">
          ${favOn ? ICONS.starFilled : ICONS.star}
        </button>
        <span class="tag" title="Qty">${x.amount}×</span>
        <span class="tag price" title="Price">$${formatNum(x.price)}</span>
        ${profitTag}
      </div>
    </div>
        <div class="act" title="Buy qty">
          <input class="input qty" type="number" min="1" max="${x.amount}"
                 value="${Math.min( Math.max(1, maxQtyAffordable || 1), x.amount)}"
                 title="Qty (max ${x.amount})">
          <button class="btn buyqty" ${maxQtyAffordable < 1 ? 'disabled' : ''} title="Buy">Buy</button>
          ${affordableFull ? `<span class="hint" title="Buy all">Click card to buy all</span>` : ``}
        </div>
        ${affordableFull ? `` : `<div class="lack" title="Need cash">Not enough cash</div>`}
      </div>
    `;
  }).join('');

  $(SEL.list).html(html);
}

    function recomputeProfits() {
        for (const it of items.values()) {
            it.profit = profitPerUnit(it.price, it.marketValue, settings.feePercent);
            it.totalProfit = it.profit * it.amount;
            it.gainPct = it.price > 0 ? (it.profit / it.price) * 100 : 0;
        }
    }

    function log(msg, level = 'ok', opts = {}) {
        const time = new Date().toLocaleTimeString([], {
            hour12: false
        });
        const cls = level === 'err' ? 'err' : level === 'info' ? 'info' : 'ok';
        const asHtml = !!opts.html;
        const content = asHtml ? sanitizeLogHTML(String(msg)) : escapeHtml(String(msg));
        $(SEL.log).prepend(`<div class="loge ${cls}">[${time}] ${content}</div>`);
        const kids = $(SEL.log).children();
        if (kids.length > 60) kids.slice(60).remove();
    }

    function sanitizeLogHTML(s) {
        try {
            const tpl = document.createElement('template');
            tpl.innerHTML = String(s);

            function clean(node) {
                const kids = Array.from(node.childNodes);
                for (const n of kids) {
                    if (n.nodeType === Node.TEXT_NODE) continue;
                    if (n.nodeType === Node.ELEMENT_NODE) {
                        const el = n;
                        const tag = el.tagName;
                        const spanAllowed = tag === 'SPAN' && (el.classList.contains('count') || el.classList.contains('total'));
                        const allowBr = tag === 'BR';
                        const allowEm = tag === 'B' || tag === 'STRONG' || tag === 'EM' || tag === 'I' || tag === 'U' || tag === 'S';
                        if (spanAllowed || allowBr || allowEm) {
                            if (spanAllowed) {
                                const keep = ['count', 'total'].filter(c => el.classList.contains(c)).join(' ');
                                el.setAttribute('class', keep);
                                [...el.attributes].forEach(a => {
                                    if (a.name !== 'class') el.removeAttribute(a.name);
                                });
                            } else {
                                [...el.attributes].forEach(a => el.removeAttribute(a.name));
                            }
                            clean(el);
                        } else {
                            el.replaceWith(document.createTextNode(el.textContent || ''));
                        }
                    } else {
                        n.remove();
                    }
                }
            }
            clean(tpl.content);
            tpl.content.querySelectorAll('span.total').forEach(span => {
                const prev = span.previousSibling;
                if (prev && prev.nodeType === Node.TEXT_NODE) {
                    const m = /(.*?)(\s*)\$(\s*)$/.exec(prev.textContent || '');
                    if (m) {
                        prev.textContent = (m[1] || '') + (m[2] || '');
                        span.insertBefore(document.createTextNode('$'), span.firstChild);
                    }
                }
            });
            return tpl.innerHTML;
        } catch {
            return escapeHtml(String(s));
        }
    }

    function htmlToText(s) {
        const div = document.createElement('div');
        div.innerHTML = String(s || '');
        return (div.textContent || '').trim();
    }

    function showSettings(force) {
  const on = force === undefined ? !$(SEL.container).hasClass('mode-settings') : !!force;
  $(SEL.container).toggleClass('mode-settings', on);
  $(SEL.settingsBtn).attr('title', on ? 'Items' : 'Settings');
  if (on) renderFavCapsList();
}

    async function buyItem(it, qty) {
        try {
            qty = Math.max(1, Math.min(it.amount, Number(qty) || 1));
            const url = `https://www.torn.com/bazaar.php?sid=bazaarData&step=buyItem&rfcv=${getRFC()}`;
            const body = new URLSearchParams({
                userID: String(it.sellerUserId),
                id: String(it.id),
                itemid: String(it.itemId),
                amount: String(qty),
                price: String(it.price),
                beforeval: String(it.price * qty),
            });

            let data = null;
            try {
                const res = await fetch(url, {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                    body: body.toString(),
                });
                data = await res.json();
            } catch {
                if (window.$ && $.post) {
                    const raw = await $.post(url, Object.fromEntries(body));
                    data = JSON.parse(raw);
                } else {
                    throw new Error('Could not post buy request');
                }
            }

            if (data?.success) {
                if (data?.text) log(data.text, 'ok', {
                    html: true
                });
                else log(`Bought ${it.name} x${qty} @ $${formatNum(it.price)}`, 'ok');
                if (qty >= it.amount) {
                    bought.add(it.id);
                    items.delete(it.id);
                } else {
                    it.amount -= qty;
                    it.totalProfit = it.profit * it.amount;
                }
                scheduleUI();
            } else {
                const text = data?.text ? htmlToText(data.text) : 'Buy failed';
                log(text, 'err');
                if (text.toLowerCase().includes('someone else') || text.toLowerCase().includes('no longer available')) {
                    items.delete(it.id);
                    scheduleUI();
                }
            }
        } catch (e) {
            log(`Error: ${e.message}`, 'err');
        } finally {
            $(`.it[data-id="${it.id}"]`).removeClass('inflight');
        }
    }

    function onBazaarData(payload) {
        try {
            latestSeller = payload?.ID ?? latestSeller;
            const list = Array.isArray(payload?.list) ? payload.list : [];
            let newDollar = 0;

            for (const x of list) {
                const id = Number(x?.bazaarID ?? x?.id);
                if (!id || bought.has(id)) continue;
                if (x?.isBlockedForBuying) continue;

                const price = parseMoney(x?.price);
                const amount = Number(x?.amount) || 1;
                const mv = Number(x?.averageprice ?? 0);
                const name = x?.name || 'Unknown';
                const sellerUserId = Number(payload?.ID) || latestSeller || 0;

                const ppu = profitPerUnit(price, mv, settings.feePercent);
                const item = {
                    id,
                    itemId: Number(x?.ID ?? 0),
                    sellerUserId,
                    price,
                    amount,
                    marketValue: mv,
                    profit: ppu,
                    totalProfit: ppu * amount,
                    gainPct: price > 0 ? (ppu / price) * 100 : 0,
                    name,
                };

                items.set(id, item);
                if (isFavItem(item.itemId)) setFavName(item.itemId, item.name);

                if (price === 1) {
                    newDollar++;
                    if (settings.notifications) notify('One Bazaar: $1 item', `${name} x${amount}`);
                }
            }

            if (newDollar > 0) log(`${newDollar} new $1 item(s)`, 'info');
            scheduleUI();
        } catch {}
    }

    function hookFetch() {
        if (hookedFetch || !window.fetch) return;
        hookedFetch = true;
        const orig = window.fetch;
        window.fetch = async function(...args) {
            const res = await orig.apply(this, args);
            try {
                const url = res?.url || (args[0] && args[0].url) || '';
                if (url.includes(WATCH_URL_PART)) {
                    const clone = res.clone();
                    const data = await clone.json();
                    onBazaarData(data);
                }
            } catch {}
            return res;
        };
    }

    function hookXHR() {
        if (hookedXHR) return;
        hookedXHR = true;
        const oOpen = XMLHttpRequest.prototype.open;
        const oSend = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.open = function(...args) {
            this._obm_url = args[1];
            return oOpen.apply(this, args);
        };
        XMLHttpRequest.prototype.send = function(...args) {
            this.addEventListener('readystatechange', function() {
                try {
                    if (this.readyState === 4) {
                        const url = this.responseURL || this._obm_url || '';
                        if (url.includes(WATCH_URL_PART)) {
                            try {
                                onBazaarData(JSON.parse(this.responseText));
                            } catch {}
                        }
                    }
                } catch {}
            });
            return oSend.apply(this, args);
        };
    }

    function updateCashFromDOM() {
        try {
            const moneyEls = $(".user-info .money, .money, [class*='money'], [data-money]");
            let best = 0;
            moneyEls.each(function() {
                const text = $(this).text() || $(this).attr('data-money') || '';
                const val = parseMoney(text);
                if (!isNaN(val) && val > best) best = val;
            });
            if (best !== currentCash) {
                currentCash = best;
                scheduleUI();
            }
        } catch {}
    }

    function initCashWatcher() {
        if (cashObs) return;
        updateCashFromDOM();
        cashObs = new MutationObserver(() => {
            if (updateScheduled) setTimeout(updateCashFromDOM, 150);
            else updateCashFromDOM();
        });
        cashObs.observe(document.body, {
            subtree: true,
            childList: true,
            characterData: true
        });
        cashIntervalId = window.setInterval(updateCashFromDOM, 3000);
    }

    function init() {
        if (!/bazaar\.php.*userId=/.test(location.href)) return;
        buildUI();
        hookFetch();
        hookXHR();
        initCashWatcher();
    }

    function onReady(fn) {
        if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn, {
            once: true
        });
        else fn();
    }

    onReady(() => {
        init();
        window.addEventListener('popstate', () => setTimeout(init, 150));
        window.addEventListener('hashchange', () => setTimeout(init, 150));
    });
})();