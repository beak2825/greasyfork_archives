// ==UserScript==
// @name         Neopian Pound Surfer Pro 2.0
// @namespace    Amanda Bynes@clraik and ChadGPT ai robot helper friend
// @version      4.2.2
// @description  Automatically surfs the pound and generates a log of pet names, species and colors, with direct links to view petpage and a quick adopt link. Set filters for specific PB colors or species, get alerts in real time if your selection is found. It also features list exporting, highlighting, persistent UI, storage options and more.
// @match        https://www.neopets.com/pound/adopt.phtml*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/555522/Neopian%20Pound%20Surfer%20Pro%2020.user.js
// @updateURL https://update.greasyfork.org/scripts/555522/Neopian%20Pound%20Surfer%20Pro%2020.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /* =========================
   *   STORAGE KEYS & LIMITS
   * ========================= */
  const SETTINGS_KEY     = 'np_pld_settings_v397';
  const LOG_KEY          = 'np_pld_log_v397';
  const RUN_FLAG         = 'np_pld_run_v397';
  const PAUSE_FLAG       = 'np_pld_pause_v397';
  const START_MS         = 'np_pld_start_ms_v397';
  const PAUSE_OFFSET     = 'np_pld_pause_offset_v397';
  const REFRESH_COUNT    = 'np_pld_refresh_count_v397';
  const LOG_VISIBLE_KEY  = 'np_pld_log_visible_v397';
  const SAVE_MODE_KEY    = 'np_pld_save_mode_v397';
  const LOG_TOGGLE_KEY   = 'np_pld_log_toggle_v397';
  const EDIT_MODE_KEY    = 'np_pld_edit_mode_v397';

  const DEFAULT_INTERVAL_MS = 3000;
  const MIN_INTERVAL_MS     = 2000;
  const MAX_INTERVAL_MS     = 15000;
  const DEFAULT_DURATION_MS = 10 * 60 * 1000;
  const MAX_DURATION_MS     = 60 * 60 * 1000;
  const RELOAD_REMAIN_KEY   = 'np_pld_reload_remain_v397';
  const NEXT_DUE_AT_KEY     = 'np_pld_next_due_v397';

  let nextReloadTimer = null;
  let liveTimer = null;

  /* =========================
   *   DATA
   * ========================= */
  const AVATAR_PRESETS = [
    { key: 'coconut_jubjub', label: 'Coconut JubJub', color: 'Coconut',   species: 'JubJub' },
    { key: 'fire_blumaroo',  label: 'Fire Blumaroo',  color: 'Fire',      species: 'Blumaroo' },
    { key: 'ghost_kacheek',  label: 'Ghost Kacheek',  color: 'Ghost',     species: 'Kacheek' },
    { key: 'halloween_lupe', label: 'Halloween Lupe', color: 'Halloween', species: 'Lupe' },
    { key: 'halloween_ruki', label: 'Halloween Ruki', color: 'Halloween', species: 'Ruki' },
    { key: 'island_quiggle', label: 'Island Quiggle', color: 'Island',    species: 'Quiggle' },
    { key: 'orange_grundo',  label: 'Orange Grundo',  color: 'Orange',    species: 'Grundo' },
    { key: 'pea_chia',       label: 'Pea Chia',       color: 'Pea',       species: 'Chia' },
    { key: 'yellow_chia',    label: 'Yellow Chia',    color: 'Yellow',    species: 'Chia' },
  ];

  const COLORS = [
    '8-Bit','25th Anniversary','Agueena','Alien','Apple','Asparagus','Aubergine','Avocado','Baby','Banana','Biscuit','Blue','Blueberry',
    'Brown','Burlap','Camouflage','Candy','Carrot','Checkered','Chocolate','Chokato','Christmas','Clay','Cloud','Coconut','Custard',
    'Darigan','Desert','Dimensional','Disco','Durian','Elderlyboy','Elderlygirl','Electric','Eventide','Faerie','Fire','Garlic','Ghost',
    'Glowing','Gold','Gooseberry','Grape','Green','Grey','Halloween','Ice','Invisible','Island','Jelly','Juppie Swirl','Lemon','Lime',
    'Magma','Mallow','Maractite','Maraquan','Marble','Mosaic','Msp','Mutant','Oil Paint','Onion','Orange','Origami','Pastel','Pea',
    'Peach','Pear','Pepper','Pineapple','Pink','Pirate','Plum','Plushie','Polka Dot','Potato','Purple','Quigukiboy','Quigukigirl',
    'Rainbow','Red','Relic','Robot','Royalboy','Royalgirl','Shadow','Silver','Sketch','Skunk','Snot','Snow','Speckled','Split',
    'Sponge','Spotted','Sroom','Starry','Stealthy','Steampunk','Strawberry','Striped','Swamp Gas','Thornberry','Tomato','Toy',
    'Transparent','Tyrannian','Ummagine','Usuki Boy','Usuki Girl','Valentine','Void','Water','White','Woodland','Wraith','Yellow','Zombie'
  ];

  const SPECIES = [
    'Acara','Aisha','Blumaroo','Bori','Bruce','Buzz','Chia','Chomby','Cybunny','Draik','Elephante','Eyrie','Flotsam','Gelert','Gnorbu',
    'Grarrl','Grundo','Hissi','Ixi','Jetsam','JubJub','Kacheek','Kau','Kiko','Koi','Korbat','Kougra','Krawk','Kyrii','Lenny','Lupe',
    'Lutari','Meerca','Moehog','Mynci','Nimmo','Ogrin','Peophin','Poogle','Pteri','Quiggle','Ruki','Scorchio','Shoyru','Skeith',
    'Techo','Tonu','Tuskaninny','Uni','Usul','Vandagyre','Varwolf','Wocky','Xweetok','Yurble','Zafara'
  ];

  const LIMITED_EDITION_SPECIES = [
    'Chomby','Cybunny','Draik','Hissi','Jetsam','Kiko','Koi','Krawk','Poogle','Ruki','Tonu'
  ];

  /* =========================
   *   UTIL FUNCS
   * ========================= */
  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
  const pad2 = (n) => String(n).padStart(2, '0');
  const fmtMMSS = (ms) => {
    if (!ms || ms < 0) ms = 0;
    const m = Math.floor((ms % 3600000) / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    return `${pad2(m)}:${pad2(s)}`;
  };
  const toKey = (s) => (s || '').toLowerCase().trim();

  const loadSettings = () => {
    try { return JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {}; }
    catch { return {}; }
  };
  const saveSettings = (s) => localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
  const readLog = () => {
    try { return JSON.parse(localStorage.getItem(LOG_KEY) || '[]'); }
    catch { return []; }
  };
  const writeLog = (arr) => localStorage.setItem(LOG_KEY, JSON.stringify(arr || []));

  /* =========================
   *   NOTIFICATION HELPERS
   * ========================= */
  function desktopNotify(name, color, species, iconUrl) {
    if (!('Notification' in window)) return;
    if (Notification.permission !== 'granted') return;
    console.log(`[Pound Surfer] Desktop notification: ${name} (${color} ${species})`);
    const n = new Notification('🎉 Pet Found in the Pound!', {
      body: `${color} ${species} — ${name}`,
      icon: iconUrl || 'https://images.neopets.com/themes/h5/basic/images/logo.png',
      requireInteraction: false
    });
    n.onclick = () => {
      window.open(
        `https://www.neopets.com/pound/adopt.phtml?search=${encodeURIComponent(name)}&color=${encodeURIComponent(color)}&species=${encodeURIComponent(species)}`,
        '_blank'
      );
      n.close();
    };
    setTimeout(() => n.close(), 10000);
  }

  function findPetIconSrc(petName) {
    const imgs = document.querySelectorAll('[id^="pet"][id$="_img"]');
    for (const img of imgs) {
      const id = img.id.replace('_img', '_name');
      const nameEl = document.getElementById(id);
      if (nameEl && nameEl.textContent.trim().toLowerCase() === petName.toLowerCase()) {
        return img.src;
      }
    }
    return 'https://images.neopets.com/themes/h5/basic/images/logo.png';
  }

  /* =========================
   *   MATCHING LOGIC
   * ========================= */
  function avatarMatchSelected(color, species, avatarKeys) {
    if (!avatarKeys || !avatarKeys.length) return true;
    const c = color.toLowerCase(), s = species.toLowerCase();
    return avatarKeys.some(key => {
      const preset = AVATAR_PRESETS.find(p => p.key === key);
      return preset && preset.color.toLowerCase() === c && preset.species.toLowerCase() === s;
    });
  }

  function matchesActiveFilters(name, color, species, s) {
    const cname = (color || '').toLowerCase().trim();
    const sname = (species || '').toLowerCase().trim();
    const nname = (name || '').toLowerCase().trim();

    const hasColor   = Array.isArray(s.colorsSel)   && s.colorsSel.length > 0;
    const hasSpecies = Array.isArray(s.speciesSel)  && s.speciesSel.length > 0;
    const hasNames   = Array.isArray(s.names)       && s.names.some(n => n.trim() !== '');
    const hasAvatar  = Array.isArray(s.avatarPresetKeys) && s.avatarPresetKeys.length > 0;

    const hasAnyFilter = hasColor || hasSpecies || hasNames || hasAvatar;
    if (!hasAnyFilter) return false;

    const colorMatch   = !hasColor   || s.colorsSel.some(c => c.toLowerCase().trim() === cname);
    const speciesMatch = !hasSpecies || s.speciesSel.some(sp => sp.toLowerCase().trim() === sname);
    const nameMatch    = !hasNames   || s.names.some(n => nname.includes(n.toLowerCase().trim()));

    return colorMatch && speciesMatch && nameMatch;
  }

  /* =========================
   *   HIGHLIGHT + LOWLIGHT
   * ========================= */
  function retroHighlightAndScroll() {
    const s = loadSettings();

    const norm = v => (v || '').toLowerCase().replace(/\s+/g, ' ').trim();

    const limited = new Set(
      LIMITED_EDITION_SPECIES.map(v => v.toLowerCase())
    );

    const isAvatarCombo = (colorNorm, speciesNorm) =>
      AVATAR_PRESETS.some(p => norm(p.color) === colorNorm && norm(p.species) === speciesNorm);

    document.querySelectorAll('#pld-log .pld-entry').forEach(row => {
  const leftSpan = row.querySelector('span');
  if (!leftSpan) return;

  const raw = leftSpan.textContent;

  // === Retroactive BD/SBD stat extraction ===
  // ---- FAST retroactive stat lookup by name only ----

// Create logMap ONCE (cached outside the loop)
if (!window.__pld_logMapCache) {
  const arr = readLog();
  const map = new Map();
  arr.forEach(p => map.set(p.name.toLowerCase(), p));
  window.__pld_logMapCache = map;
}

const rowName = row.getAttribute('data-name');
const logEntry = window.__pld_logMapCache.get(rowName);

let lvlVal = 0, strVal = 0, defVal = 0, movVal = 0, priceVal = 0;

if (logEntry) {
  lvlVal   = Number(logEntry.level)    || 0;
  strVal   = Number(logEntry.strength) || 0;
  defVal   = Number(logEntry.defence)  || 0;
  movVal   = Number(logEntry.movement) || 0;
  priceVal = Number(logEntry.price)    || 0;
}

// Store on dataset (for BD/SBD)
row.dataset.level    = lvlVal;
row.dataset.strength = strVal;
row.dataset.defence  = defVal;
row.dataset.movement = movVal;
row.dataset.price    = priceVal;


  // Store on row.dataset for BD/SBD highlight logic
  row.dataset.level    = lvlVal;
  row.dataset.strength = strVal;
  row.dataset.defence  = defVal;
  row.dataset.movement = movVal;
  row.dataset.price    = priceVal;

  // Parse "Name (Color Species)"
  const [nm, rest] = raw.split('(');
  const nameRaw     = (nm || '').trim();
  const inside      = rest ? rest.replace(')', '') : '';
  const parts       = inside.split(' ');
  const colorNorm   = norm(parts[0] || '');
  const speciesNorm = norm(parts.slice(1).join(' ') || '');
  const nameNorm    = norm(nameRaw);

  const matchFilter   = matchesActiveFilters(nameNorm, colorNorm, speciesNorm, s);
  const isLimited     = limited.has(speciesNorm);
  const avatarCombo   = isAvatarCombo(colorNorm, speciesNorm);

  const highlightAvatar   = s.highlightAvatar   && avatarCombo;
  const highlightFiltered = s.highlightFiltered && matchFilter;
  const highlightLimited  = s.highlightLimited  && isLimited;
  const hasHighlight      = highlightAvatar || highlightFiltered || highlightLimited;

  // ===============================
  // BD / SBD Classification
  // ===============================
  const bdToggle  = s.highlightBD  === true;
  const sbdToggle = s.highlightSBD === true;

  const isBD = (
    lvlVal >= 40 ||
    strVal >= 80 ||
    defVal >= 80
  );

  const sbdStatsMatch = [
    (lvlVal >= 10 && lvlVal <= 39),
    (strVal >= 20 && strVal <= 79),
    (defVal >= 20 && defVal <= 79)
  ].filter(Boolean).length;

  const isSBD = (!isBD && sbdStatsMatch >= 2);

// ===============================
// Highlight Priority (Avatar → BD → SBD → Filtered → Limited)
// Avatar ALWAYS overrides everything else
// ===============================

// AVATAR takes absolute priority — always blue
if (highlightAvatar) {
  leftSpan.innerHTML = `<b style="color:blue;">${raw}</b>`;
  return;
}

// BD second priority — red
if (bdToggle && isBD) {
  leftSpan.innerHTML = `<b style="color:#ff0000;">${raw}</b>`;
  return;
}

// SBD third priority — orange
if (sbdToggle && isSBD) {
  leftSpan.innerHTML = `<b style="color:#ff6600;">${raw}</b>`;
  return;
}

// Filtered fourth — green
if (highlightFiltered) {
  leftSpan.innerHTML = `<b style="color:green;">${raw}</b>`;
  return;
}

// Limited fifth — purple
if (highlightLimited) {
  leftSpan.innerHTML = `<b style="color:#000000;">${raw}</b>`;
  return;
}


      // LOWLIGHT rules — based ONLY on pet name
      const hasNumber      = /[0-9]/.test(nameRaw);
      const hasUnderscore  = /_/.test(nameRaw);
      const nameLength     = nameRaw.length;

      const lowByNumber    = s.lowlightNumbers        && hasNumber;
      const lowByUnderscore= s.lowlightUnderscores    && hasUnderscore;
      const lowByLength    = s.lowlightLengthEnabled  &&
                             typeof s.lowlightLengthMin === 'number' &&
                             s.lowlightLengthMin > 0 &&
                             nameLength > s.lowlightLengthMin;

      const isLow = (
  (s.lowlightNumbers && lowByNumber) ||
  (s.lowlightUnderscores && lowByUnderscore) ||
  (s.lowlightLengthEnabled && lowByLength)
);


      // PRIORITY: Lowlight always wins
      if (isLow) {
        if (hasHighlight) {
          // Lowlight + highlight → dim gray + bold
          leftSpan.innerHTML = `<b style="color:#5f6061;">${raw}</b>`;
        } else {
          // Pure lowlight → lighter gray
          leftSpan.innerHTML = `<span style="color:#aaa;">${raw}</span>`;
        }
        return;
      }

                  // Only evaluate purple highlight if toggles are ON
      const allowCase = s.highlightNameCase === true;
      const allowLength = (s.highlightNameMax && s.highlightNameMax > 0);

      let doNameHighlight = false;

      if (allowCase || allowLength) {

        const nameRawLower = nameRaw.toLowerCase();
        const needles = (s.names || [])
          .map(v => v.toLowerCase())
          .filter(Boolean);

        // Case match highlight
        if (allowCase && needles.length > 0) {
          if (needles.includes(nameRawLower)) {
            doNameHighlight = true;
          }
        }

// LENGTH highlight (ONLY if checkbox enabled AND a valid number chosen)
if (!doNameHighlight && allowLength) {
  if (typeof s.highlightNameMax === "number" &&
      s.highlightNameMax > 0 &&
      nameRaw.length < s.highlightNameMax &&
      s.highlightNameLengthEnabled) {
    doNameHighlight = true;
  }
}
      }


if (doNameHighlight) {
    leftSpan.innerHTML = `<b style="color:#8a12d8;">${raw}</b>`;
    return;
}

      // Regular highlighting
      if (highlightAvatar) {
        leftSpan.innerHTML = `<b style="color:blue;">${raw}</b>`;
        return;
      }

      if (highlightFiltered) {
        leftSpan.innerHTML = `<b style="color:green;">${raw}</b>`;
        return;
      }

      if (highlightLimited) {
        leftSpan.innerHTML = `<b style="color:black;">${raw}</b>`;
        return;
      }

      // Normal text
      leftSpan.innerHTML = raw;
    });
  }

  /* =========================
   *   UI BUILD HELPERS
   * ========================= */
  function summaryOrNoneSelected(list, label) {
    if (!list || !list.length) {
      return `<em style="color:#777;">${label} — none selected</em>`;
    }
    return `<em style="color:#777;">${label} — ${list.join(', ')}</em>`;
  }

  function buildCheckboxListHtml(options, selectedSet, groupId) {
    return `
      <div id="${groupId}-wrap"
           style="border:1px solid #000;background:#fff;max-height:150px;overflow:auto;padding:4px;">
        ${options.map(opt => {
          const id = `${groupId}-${toKey(opt).replace(/\s+/g,'_')}`;
          const checked = selectedSet.has(opt) ? 'checked' : '';
          return `
            <label for="${id}" style="display:block;font:9pt Verdana;text-align:left;white-space:nowrap;">
              <input type="checkbox" id="${id}" data-value="${opt}" ${checked}
                     style="vertical-align:middle;margin-right:6px;">
              ${opt}
            </label>
          `;
        }).join('')}
      </div>
    `;
  }

  const readCheckedValues = (groupId) =>
    Array.from(document.querySelectorAll(`#${groupId}-wrap input[type="checkbox"]`))
      .filter(cb => cb.checked)
      .map(cb => cb.getAttribute('data-value'));

  const setCheckedValues = (groupId, selections) => {
    const set = new Set((selections || []).map(toKey));
    document.querySelectorAll(`#${groupId}-wrap input[type="checkbox"]`).forEach(cb => {
      const val = cb.getAttribute('data-value');
      cb.checked = set.has(toKey(val));
    });
  };

  /* =========================
   *   UI BUILD
   * ========================= */
  function buildUI() {
    if (document.getElementById('pld-panel')) return;

    const s = loadSettings();
    if (typeof s.intervalMs !== 'number') s.intervalMs = DEFAULT_INTERVAL_MS;
    if (typeof s.durationMs !== 'number') s.durationMs = DEFAULT_DURATION_MS;
    if (typeof s.alertsEnabled !== 'boolean') s.alertsEnabled = false;
    if (typeof s.desktopNotify !== 'boolean') s.desktopNotify = false;

    // Filter toggles
    if (typeof s.filterAvatar !== 'boolean') s.filterAvatar = false;
    if (typeof s.filterColor !== 'boolean') s.filterColor = false;
    if (typeof s.filterSpecies !== 'boolean') s.filterSpecies = false;
    if (typeof s.filterName !== 'boolean') s.filterName = false;

    // Filter selections
    if (!Array.isArray(s.avatarPresetKeys)) s.avatarPresetKeys = [];
    if (!Array.isArray(s.colorsSel)) s.colorsSel = [];
    if (!Array.isArray(s.speciesSel)) s.speciesSel = [];
    if (!Array.isArray(s.names)) s.names = [];

    // Auto-resume
    if (typeof s.autoResume !== 'boolean') s.autoResume = false;
    if (typeof s.autoResumeDelayMs !== 'number') s.autoResumeDelayMs = 60000;

    // Highlight settings
    if (typeof s.highlightAvatar   !== 'boolean') s.highlightAvatar   = false;
    if (typeof s.highlightFiltered !== 'boolean') s.highlightFiltered = false;
    if (typeof s.highlightLimited  !== 'boolean') s.highlightLimited  = false;


    // Lowlight defaults
    if (typeof s.lowlightNumbers        !== 'boolean') s.lowlightNumbers        = false;
    if (typeof s.lowlightUnderscores    !== 'boolean') s.lowlightUnderscores    = false;
    if (typeof s.lowlightLengthEnabled  !== 'boolean') s.lowlightLengthEnabled  = false;
    if (typeof s.lowlightLengthMin !== 'number')  s.lowlightLengthMin = null;


    // Collapsed state (persist)
    const hasAvatar  = Array.isArray(s.avatarPresetKeys) && s.avatarPresetKeys.length > 0;
    const hasColors  = Array.isArray(s.colorsSel)        && s.colorsSel.length > 0;
    const hasSpecies = Array.isArray(s.speciesSel)       && s.speciesSel.length > 0;

    if (typeof s.collapsedAvatar  !== 'boolean') s.collapsedAvatar  = hasAvatar;
    if (typeof s.collapsedColor   !== 'boolean') s.collapsedColor   = hasColors;
    if (typeof s.collapsedSpecies !== 'boolean') s.collapsedSpecies = hasSpecies;

    if (hasAvatar  && s.collapsedAvatar  === false) s.collapsedAvatar  = true;
    if (hasColors  && s.collapsedColor   === false) s.collapsedColor   = true;
    if (hasSpecies && s.collapsedSpecies === false) s.collapsedSpecies = true;

    saveSettings(s);

    if (localStorage.getItem(LOG_VISIBLE_KEY) === null) localStorage.setItem(LOG_VISIBLE_KEY, 'false');
    if (localStorage.getItem(EDIT_MODE_KEY) === null)   localStorage.setItem(EDIT_MODE_KEY, 'off');

    const logVisible = JSON.parse(localStorage.getItem(LOG_VISIBLE_KEY));
    const log        = readLog();

    /* =========================
     * Panel container (FULL PANEL SCROLLS)
     * ========================= */
    const wrap = document.createElement('div');
    wrap.id = 'pld-panel';
    wrap.style.cssText = `
      position:fixed;
      top:2px;
      right:2px;
      width:305px;
      max-height:90vh;
      z-index:99999;
      background:#fff;
      border:2px solid #000;
      border-radius:10px;
      padding:10px;
      font:11px Arial, Helvetica, sans-serif;
      box-shadow:3px 3px 8px rgba(0,0,0,.4);
      display:flex;
      flex-direction:column;
      overflow-x:auto;              /* ← restores panel scrolling */
      overflow-y:hidden;
  `;

    /* =========================
     * Log entries HTML
     * ========================= */
    const entriesHTML = log.map(p => {
      const text = `${p.name} (${p.color} ${p.species})`;
      return `
        <div class="pld-entry"
          data-name="${p.name.toLowerCase()}"
          data-color="${p.color.toLowerCase()}"
          data-species="${p.species.toLowerCase()}"
          style="display:flex;justify-content:space-between;align-items:center;margin:2px 0;font:9pt Verdana;">
          <span style="text-align:left;"title="${p.timestamp ? new Date(p.timestamp).toLocaleString() : ''}">${text}</span>
          <span style="white-space:nowrap;"><a href="https://www.neopets.com/~${encodeURIComponent(p.name)}
          "target="_blank"title="${p.price || 0} NP, Lvl${p.level||0}, Str${p.strength||0}, Def${p.defence||0}, Mov${p.movement||0}">📄</a>
            <a href="https://www.neopets.com/pound/adopt.phtml?search=${encodeURIComponent(p.name)}" target="_blank">➡️</a>
          </span>
        </div>
      `;
    }).join('');

    const avatarSummary = summaryOrNoneSelected(
      s.avatarPresetKeys.map(k => {
        const f = AVATAR_PRESETS.find(p => p.key === k);
        return f ? f.label : k;
      }),
      'Avatar presets'
    );

    const colorSummary   = summaryOrNoneSelected(s.colorsSel,   'Color');
    const speciesSummary = summaryOrNoneSelected(s.speciesSel, 'Species');

    wrap.innerHTML = `
      <!-- Top Title Row -->
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <b style="font-size:11px;">Pound Surfer Pro 2.0</b>
        <div>
          <button id="pld-clear" title="1 Click—CLEAR LOG / 2 Clicks—RESET ALL">🗑️</button>
          <button id="pld-save"  title="Save/Collapse All Set Filtering">💾</button>
          <button id="pld-logtoggle" title="Toggle Log Panel">📖</button>
          <button id="pld-settings"  title="Toggle Settings">⚙️</button>
        </div>
      </div>

      <!-- Play / Pause / Stop Row -->
      <div style="margin:6px 0 8px 0;color:#555;text-align:left;">
        <span id="pld-play"  style="cursor:pointer;font-size:11pt;" title="PLAY/Start New Session">▶️</span>
        <span id="pld-pause" style="cursor:pointer;margin-left:2px;font-size:11pt;" title="PAUSE/Resume">⏸️</span>
        <span id="pld-stop"  style="cursor:pointer;margin-left:2px;font-size:11pt;" title="STOP/Clear Session">⏹️</span>
        <span id="pld-status" style="font: italic 9pt Arial; margin-left:6px;">Idle</span>
      </div>

      <!-- SETTINGS PANEL -->
            <div id="pld-settings-panel"
     style="
       display:none;
       background:#f5f5f5;
       border:1px solid #ccc;
       border-radius:6px;
       padding:6px;

       max-height:60vh;       /* keeps panel contained */
       overflow-y:auto;       /* internal scroll */
       overflow-x:hidden;     /* prevent horizontal scroll */
     ">

        <!-- Refresh controls row -->
        <div style="display:flex;align-items:center;justify-content:space-between;font:bold 9pt Arial;gap:4px;margin-bottom:6px;">
          <span>Refresh Interval:</span>
          <select id="pld-interval" style="border:1px solid #000;background:#fff;">
            ${[2,3,4,5,7,10,15].map(v => `<option value="${v*1000}">${v}s</option>`).join('')}
          </select>
          <span>Run For:</span>
          <select id="pld-duration" style="border:1px solid #000;background:#fff;">
            ${[5,10,15,20,30,45,60].map(v => `<option value="${v*60000}">${v}m</option>`).join('')}
          </select>
        </div>

        <!-- Notifications block -->
        <label style="display:block;font:9pt Arial;text-align:left;margin-top:15px;margin-bottom:4px;">
          <input id="pld-enable-alerts" type="checkbox" style="vertical-align:middle;margin-right:6px;"> Enable Notifications</label>

        <div id="pld-notify-block" style="margin:0 0 6px 0;text-align:left;">
          <label style="display:block;font:9pt Arial;margin-bottom:4px;">
            <input id="pld-desktop-alerts" type="checkbox" style="vertical-align:middle;margin-right:6px;"> Enable Desktop Notifications</label>

          <div style="display:flex;justify-content:space-between;align-items:center;font:9pt Arial;margin-bottom:6px;">
            <label style="margin:0; white-space:nowrap;">
              <input id="pld-auto-resume" type="checkbox" style="vertical-align:middle;margin-right:6px;"> Auto-Resume after Alert</label>

            <div style="display:flex;align-items:center;gap:4px; white-space:nowrap;"><span>— Delay for:</span>
              <select id="pld-auto-resume-delay" style="border:1px solid #000;background:#fff;">
  ${[
      { label: "10s",  ms: 10000 },
      { label: "15s",  ms: 15000 },
      { label: "30s",  ms: 30000 },
      { label: "1m",   ms: 60000 },
      { label: "1.5m", ms: 90000 },
      { label: "2m",   ms: 120000 },
      { label: "3m",   ms: 180000 },
      { label: "4m",   ms: 240000 },
      { label: "5m",   ms: 300000 }
    ].map(opt => `<option value="${opt.ms}">${opt.label}</option>`).join('')}
</select>
            </div>
          </div>
        </div>
                <!-- Filter By row -->
        <div style="font:9pt Arial;margin-top:15px;margin-bottom:10px;text-align:left;">
          <div style="font-weight:bold;margin-bottom:2px;">Notifications — Filter By:</div>
          <label style="margin-right:10px;"><input id="pld-filter-avatar" type="checkbox"> Avatar</label>
          <label style="margin-right:10px;"><input id="pld-filter-color" type="checkbox"> Color</label>
          <label style="margin-right:10px;"><input id="pld-filter-species" type="checkbox"> Species</label>
          <label><input id="pld-filter-name" type="checkbox"> Name</label>
        </div>

        <!-- Summaries -->
        <div id="summary-avatar"  style="text-align:left;margin:2px 0 4px 0;">${avatarSummary}</div>
        <div id="summary-color"   style="text-align:left;margin:2px 0 4px 0;">${colorSummary}</div>
        <div id="summary-species" style="text-align:left;margin:2px 0 6px 0;">${speciesSummary}</div>
        <div id="summary-name"style="text-align:left;margin:2px 0 6px 0;">${summaryOrNoneSelected((s.names || []), 'Name contains')}</div>

        <!-- Avatar Section -->
        <div id="avatar-section" style="display:none;margin-bottom:6px;">
          ${buildCheckboxListHtml(
            AVATAR_PRESETS.map(p => p.label),
            new Set((s.avatarPresetKeys || []).map(k => {
              const f = AVATAR_PRESETS.find(p => p.key === k);
              return f ? f.label : k;
            })),
            'avatar'
          )}
          <div style="display:flex;gap:6px;justify-content:flex-end;margin-top:4px;">
            <button id="avatar-clear">🗑️</button>
            <button id="avatar-save">💾</button>
          </div>
        </div>

        <!-- Color Section -->
        <div id="color-section" style="display:none;margin-bottom:6px;">
          ${buildCheckboxListHtml(COLORS, new Set(s.colorsSel || []), 'color')}
          <div style="display:flex;gap:6px;justify-content:flex-end;margin-top:4px;">
            <button id="color-clear">🗑️</button>
            <button id="color-save">💾</button>
          </div>
        </div>

        <!-- Species Section -->
        <div id="species-section" style="display:none;margin-bottom:20px;">
          ${buildCheckboxListHtml(SPECIES, new Set(s.speciesSel || []), 'species')}
          <div style="display:flex;gap:6px;justify-content:flex-end;margin-top:4px;">
            <button id="species-clear">🗑️</button>
            <button id="species-save">💾</button>
          </div>
        </div>

        <div id="name-section" style="display:none;margin-bottom:6px;">
        <input id="name-input" type="text"placeholder="Name Contains: i.e. doggie, shorty, bob"
         style="width:100%;font:7.5pt verdana;border:1px solid #000;background:#fff;padding:2px;">
        <div style="display:flex;gap:6px;justify-content:flex-end;margin-top:4px;">
            <button id="name-clear">🗑️</button>
            <button id="name-save">💾</button>
          </div>
        </div>


        <!-- Highlight toggles -->
        <div style="font:9pt Arial;font-weight:bold;margin-top:15px;margin-bottom:10px;text-align:left;">
        <div style="font-weight:bold;margin-bottom:2px;">Highlighting — Filter By:</div>
          <div style="font:6pt verdana;font-weight:normal;margin-top:10px;margin-bottom:2px;">COLOR/SPECIES:</div>
          <label style="font:9pt Arial;font-weight:bold;color: blue;margin-right:10px;"><input id="pld-highlight-avatar" type="checkbox"> Avatar</label>
          <label style="font:9pt Arial;font-weight:bold;color: green;margin-right:10px;"><input id="pld-highlight-filtered" type="checkbox"> Filtered</label>
          <label style="font:9pt Arial;font-weight:bold;color: bold;margin-right:10px;"><input id="pld-highlight-limited" type="checkbox"> Limited Edition</label>
        </div>

        <!-- NEW Highlight — Name Contains -->
        <div style="font:9pt Arial;margin-bottom:8px;text-align:left;">
        <div style="font:6pt verdana;font-weight:normal;margin-bottom:2px;">NAME CONTAINS:</div>

        <!-- CASE MATCH -->
        <label style="margin-right:10px;font-weight:bold;color:#8a12d8;">
        <input id="pld-highlight-name-case" type="checkbox">Case Match</label>

        <!-- LENGTH ENABLE + SELECT -->
        <label style="margin-right:10px;font-weight:bold;color:#8a12d8;">
        <input id="pld-highlight-name-length-enabled" type="checkbox">Less Than
        <select id="pld-highlight-name-length"style="border:1px solid #000;background:#fff;margin-left:4px;">  <option value=""></option>
        ${[5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20].map(n=>`<option value="${n}">${n}L</option>`).join('')}</select></label>
        </div>

        <!-- NEW Highlight — Stats Block -->
        <div style="font:9pt Arial;margin-bottom:15px;text-align:left;">
        <div style="font:6pt verdana;font-weight:normal;margin-bottom:2px;">STATS:</div>
        <label style="margin-right:10px;font-weight:bold;color:#ff0000;"><input id="pld-highlight-bd" type="checkbox">BD</label>
        <label style="margin-right:10px;font-weight:bold;color:#ff6600;"><input id="pld-highlight-sbd" type="checkbox">SBD</label>
        </div>

        <!-- LOWLIGHT toggles -->
        <div style="font:9pt Arial;margin-top:10px;margin-bottom:5px;text-align:left;">
        <div style="font-weight:bold;margin-bottom:2px;">Lowlighting — Filter By:</div>
          <div style="font:6pt verdana;font-weight:normal;margin-top:10px;margin-bottom:2px;">NAME CONTAINS:</div>
          <label style="margin-right:10px;"><input id="pld-lowlight-numbers" type="checkbox"> #(s)</label>
          <label style="margin-right:10px;"><input id="pld-lowlight-underscores" type="checkbox"> _(s)</label>
          <label><input id="pld-lowlight-length" type="checkbox"> More than
          <select id="pld-lowlight-length-select" style="border:1px solid #000;background:#fff;margin-left:4px;">
          <option value=""></option>${[5,6,7,8,9,10,11,12,13,14,15,16,17,18,19].map(n => `<option value="${n}">${n}L</option>`).join('')}</select></label>
        </div>


        <!-- Edit mode toggle -->
        <div style="margin-top:6px;text-align:right;">
          <button id="pld-editfilters"title="Expand/Collapse Filter Lists"style="padding:2px 6px;border:1px solid #000;border-radius:4px;
           background:#fff;cursor:pointer;font-size:10pt;"> ✏️ </button>
        </div>
      </div>

      <!-- SEARCH BAR -->
      <input type="text" id="pld-search"placeholder="🔍 Search Log Contents"style="width:95%;margin-top:6px;${logVisible ? '' : 'display:none'};font:7.5pt Verdana;">

      <!-- LOG PANEL with internal scroll -->
      <div id="pld-log" style="margin-top:6px;text-align:left;${logVisible ? '' : 'display:none'};
            font:9pt Verdana;
            overflow-y:auto;
            max-height:65vh;
            padding-bottom:40px;">${log.length ? entriesHTML : '⚠️ No pets logged yet.'}
      </div>


      <!-- FIXED EXPORT ROW (stays at bottom of panel) -->
      <div id="pld-exportrow" style="
      position:sticky;
      bottom:0;
      display:${logVisible ? 'flex' : 'none'};
      justify-content:flex-start;
      gap:6px;
      background:#fff;
      padding-top:6px;
      border-top:1px solid #ddd;
      font:6pt Verdana;">
      <button id="pld-export-csv" style="min-width:50px;padding:2px 4px;">CSV</button>
      <button id="pld-export-txt" style="min-width:50px;padding:2px 4px;">TXT</button>
      </div>

    `;

    document.body.appendChild(wrap);

    // Initialize selects (must be inside buildUI so wrap exists)
    const intervalSel = wrap.querySelector('#pld-interval');
    const durationSel = wrap.querySelector('#pld-duration');
    if (intervalSel) intervalSel.value = String(s.intervalMs);
    if (durationSel) durationSel.value = String(s.durationMs);

    const notifyChk = wrap.querySelector('#pld-enable-alerts');
    const deskChk   = wrap.querySelector('#pld-desktop-alerts');
    const autoChk   = wrap.querySelector('#pld-auto-resume');
    const autoDelay = wrap.querySelector('#pld-auto-resume-delay');

    if (notifyChk) notifyChk.checked = s.alertsEnabled;
    if (deskChk)   deskChk.checked   = s.desktopNotify;
    if (autoChk)   autoChk.checked   = s.autoResume;
    if (autoDelay) autoDelay.value   = String(s.autoResumeDelayMs);

    const nameInput = wrap.querySelector('#name-input');
    if (nameInput) nameInput.value = (s.names || []).join(', ');

    // Filter toggles – initialize state
    const fa = wrap.querySelector('#pld-filter-avatar');
    const fc = wrap.querySelector('#pld-filter-color');
    const fs = wrap.querySelector('#pld-filter-species');
    const fn = wrap.querySelector('#pld-filter-name');

    if (fa) fa.checked = !!s.filterAvatar;
    if (fc) fc.checked = !!s.filterColor;
    if (fs) fs.checked = !!s.filterSpecies;
    if (fn) fn.checked = !!s.filterName;

    // Highlight toggles – initialize
    const ha = wrap.querySelector('#pld-highlight-avatar');
    const hf = wrap.querySelector('#pld-highlight-filtered');
    const hl = wrap.querySelector('#pld-highlight-limited');

    if (ha) ha.checked = !!s.highlightAvatar;
    if (hf) hf.checked = !!s.highlightFiltered;
    if (hl) hl.checked = !!s.highlightLimited;

    // Lowlight toggles – initialize
    const lowNum    = wrap.querySelector('#pld-lowlight-numbers');
    const lowUnd    = wrap.querySelector('#pld-lowlight-underscores');
    const lowLen    = wrap.querySelector('#pld-lowlight-length');
    const lowLenSel = wrap.querySelector('#pld-lowlight-length-select');

    if (lowNum)    lowNum.checked  = !!s.lowlightNumbers;
    if (lowUnd)    lowUnd.checked  = !!s.lowlightUnderscores;
    if (lowLen)    lowLen.checked  = !!s.lowlightLengthEnabled;
    if (lowLenSel) {
    if (typeof s.lowlightLengthMin !== "number" || s.lowlightLengthMin <= 0) {
    lowLenSel.value = "";  // show blank
  } else {
    lowLenSel.value = String(s.lowlightLengthMin);
  }
}
    updateSectionVisibility();
    bindUI();
  }

  /* =========================
   *   SECTION VISIBILITY
   * ========================= */
      // NEW — Expansion helpers for filter UI
  function expandFilterSection(key) {
    const el = document.querySelector(`#${key}-section`);
    if (el) el.style.display = '';
  }
  function expandActiveFilterSections() {
    const s = loadSettings();
    if (s.filterAvatar && s.avatarPresetKeys.length) expandFilterSection('avatar');
    if (s.filterColor && s.colorsSel.length) expandFilterSection('color');
    if (s.filterSpecies && s.speciesSel.length) expandFilterSection('species');
    if (s.filterName && s.names.length) expandFilterSection('name');
  }

  function updateSectionVisibility() {
  const s = loadSettings();
  const editMode = localStorage.getItem(EDIT_MODE_KEY) === 'on';

  const show = (id, yes) => {
    const el = document.querySelector(id);
    if (el) el.style.display = yes ? '' : 'none';
  };

  // If NOT editing → show collapsed view (based on saved collapse flags)
  if (!editMode) {
    show('#avatar-section',  s.filterAvatar  && !s.collapsedAvatar);
    show('#color-section',   s.filterColor   && !s.collapsedColor);
    show('#species-section', s.filterSpecies && !s.collapsedSpecies);
    show('#name-section',    s.filterName    && !s.collapsedName);

    return;
  }

  // If editing → always force sections OPEN for all enabled filters
  show('#avatar-section',  s.filterAvatar);
  show('#color-section',   s.filterColor);
  show('#species-section', s.filterSpecies);
  show('#name-section',    s.filterName);
}

  /* =========================
   *   BIND UI
   * ========================= */
  function bindUI() {
    const s = loadSettings();

    const clearBtn = document.getElementById('pld-clear');
    const saveBtn  = document.getElementById('pld-save');
    const logTog   = document.getElementById('pld-logtoggle');
    const setBtn   = document.getElementById('pld-settings');

    const playBtn  = document.getElementById('pld-play');
    const pauseBtn = document.getElementById('pld-pause');
    const stopBtn  = document.getElementById('pld-stop');

    const statusEl = document.getElementById('pld-status');
    const searchEl = document.getElementById('pld-search');
    const logEl    = document.getElementById('pld-log');

    const intervalSel   = document.getElementById('pld-interval');
    const durationSel   = document.getElementById('pld-duration');
    const enableAlerts  = document.getElementById('pld-enable-alerts');
    const desktopChk    = document.getElementById('pld-desktop-alerts');
    const autoResumeChk = document.getElementById('pld-auto-resume');
    const autoDelaySel  = document.getElementById('pld-auto-resume-delay');

    const chkAvatar  = document.getElementById('pld-filter-avatar');
    const chkColor   = document.getElementById('pld-filter-color');
    const chkSpecies = document.getElementById('pld-filter-species');
    const chkName    = document.getElementById('pld-filter-name');
    // NAME FILTER — SAVE + CLEAR + COLLAPSE
const nameInput    = document.getElementById('name-input');
const nameSaveBtn  = document.getElementById('name-save');
const nameClearBtn = document.getElementById('name-clear');
      // NAME HIGHLIGHT TOGGLES
const hlCaseChk  = document.getElementById('pld-highlight-name-case');
const hlLenChk   = document.getElementById('pld-highlight-name-length-enabled');
const hlLenSel   = document.getElementById('pld-highlight-name-length');

// INITIAL STATE
if (hlCaseChk) hlCaseChk.checked = !!s.highlightNameCase;
if (hlLenChk)  hlLenChk.checked  = !!s.highlightNameLengthEnabled;
if (hlLenSel) {
  if (typeof s.highlightNameMax !== "number" || s.highlightNameMax <= 0) {
    hlLenSel.value = "";   // force show blank option
  } else {
    hlLenSel.value = String(s.highlightNameMax);
  }
}

// CASE MATCH TOGGLE
if (hlCaseChk) {
  hlCaseChk.onchange = () => {
    s.highlightNameCase = hlCaseChk.checked;
    saveSettings(s);
    retroHighlightAndScroll();
  };
}

// LENGTH ENABLE TOGGLE
if (hlLenChk) {
  hlLenChk.onchange = () => {
    s.highlightNameLengthEnabled = hlLenChk.checked;
    saveSettings(s);
    retroHighlightAndScroll();
  };
}

// LENGTH DROPDOWN VALUE
if (hlLenSel) {
  hlLenSel.onchange = () => {
    const val = parseInt(hlLenSel.value, 10);
    s.highlightNameMax = val > 0 ? val : null;
    saveSettings(s);
    retroHighlightAndScroll();
  };
}


if (nameSaveBtn) {
  nameSaveBtn.onclick = () => {
    s.names = (nameInput.value || "")
      .split(',')
      .map(v => v.trim())
      .filter(Boolean);

    s.collapsedName = true;
    saveSettings(s);

    // Update summary
    const sum = document.getElementById('summary-name');
    if (sum) sum.innerHTML =
      summaryOrNoneSelected(s.names, 'Name contains');

    // Collapse the section
    const sec = document.getElementById('name-section');
    if (sec) sec.style.display = 'none';

    retroHighlightAndScroll();
  };
}

if (nameClearBtn) {
  nameClearBtn.onclick = () => {
    s.names = [];
    nameInput.value = "";
    s.collapsedName = true;
    saveSettings(s);

    // Update summary
    const sum = document.getElementById('summary-name');
    if (sum) sum.innerHTML =
      summaryOrNoneSelected([], 'Name contains');

    const sec = document.getElementById('name-section');
    if (sec) sec.style.display = 'none';

    retroHighlightAndScroll();
  };
}
    // Highlight checkboxes
    const highlightAvatarChk   = document.getElementById('pld-highlight-avatar');
    const highlightFilteredChk = document.getElementById('pld-highlight-filtered');
    const highlightLimitedChk  = document.getElementById('pld-highlight-limited');
      const hlSBD = document.getElementById('pld-highlight-sbd');
const hlBD  = document.getElementById('pld-highlight-bd');

// Initialize saved states
if (hlSBD) hlSBD.checked = !!s.highlightSBD;
if (hlBD)  hlBD.checked  = !!s.highlightBD;

// Listen for changes
if (hlSBD) {
  hlSBD.onchange = () => {
    s.highlightSBD = hlSBD.checked;
    saveSettings(s);
    retroHighlightAndScroll();
  };
}

if (hlBD) {
  hlBD.onchange = () => {
    s.highlightBD = hlBD.checked;
    saveSettings(s);
    retroHighlightAndScroll();
  };
}


    // NAME HIGHLIGHTS — CASE MATCH + LENGTH
const hlNameCaseChk = document.getElementById('pld-highlight-name-case');
const hlNameLengthSel = document.getElementById('pld-highlight-name-length');

// Initialize UI from saved settings
if (hlNameCaseChk) hlNameCaseChk.checked = !!s.highlightNameCase;
if (hlNameLengthSel) {
  if (typeof s.highlightNameMax !== "number" || s.highlightNameMax <= 0) {
    hlNameLengthSel.value = "";   // show blank option
  } else {
    hlNameLengthSel.value = String(s.highlightNameMax);
  }
}

// CASE MATCH checkbox
if (hlNameCaseChk) {
  hlNameCaseChk.onchange = () => {
    s.highlightNameCase = hlNameCaseChk.checked;
    saveSettings(s);
    retroHighlightAndScroll();
  };
}

// LENGTH HIGHLIGHT dropdown
if (hlNameLengthSel) {
  hlNameLengthSel.onchange = () => {
    const val = parseInt(hlNameLengthSel.value, 10);
    s.highlightNameMax = val > 0 ? val : null;
    saveSettings(s);
    retroHighlightAndScroll();
  };
}

    // Lowlight controls
    const lowNumbersChk   = document.getElementById('pld-lowlight-numbers');
    const lowUnderscoreChk= document.getElementById('pld-lowlight-underscores');
    const lowLengthChk    = document.getElementById('pld-lowlight-length');
    const lowLengthSel    = document.getElementById('pld-lowlight-length-select');

    // Edit mode
    const editBtn = document.getElementById('pld-editfilters');
    if (editBtn) {
      const editOn = localStorage.getItem(EDIT_MODE_KEY) === 'on';
      editBtn.textContent = editOn ? '🔓' : '🔒';
      editBtn.onclick = () => {
  const on = localStorage.getItem(EDIT_MODE_KEY) === 'on';
  const newMode = !on;

  localStorage.setItem(EDIT_MODE_KEY, newMode ? 'on' : 'off');
  editBtn.textContent = newMode ? '🔓' : '🔒';

  const s = loadSettings();

  if (newMode) {
    // Entering edit mode → expand ONLY sections that have selections.
    expandActiveFilterSections();
  } else {
    // Exiting edit mode → collapse everything.
    document.querySelectorAll(
      '#avatar-section, #color-section, #species-section, #name-section'
    ).forEach(sec => sec.style.display = 'none');
  }

  updateSectionVisibility();
};
    }

    // Settings toggle
    if (setBtn) {
  setBtn.onclick = () => {
    const settings = document.getElementById('pld-settings-panel');
    const log      = document.getElementById('pld-log');
    const search   = document.getElementById('pld-search');
    const exportRow = document.getElementById('pld-exportrow');

    if (!settings) return;

    const isOpen = settings.style.display === 'block';

    // Toggle settings visibility
    settings.style.display = isOpen ? 'none' : 'block';

    if (!isOpen) {
      // SETTINGS OPEN → collapse log-related UI
      if (log)      log.style.display = 'none';
      if (search)   search.style.display = 'none';
      if (exportRow) exportRow.style.display = 'none';

      // Give settings maximum space
      settings.style.maxHeight = '70vh';
      settings.style.overflowY = 'auto';
    } else {
      // SETTINGS CLOSED → restore log UI based on visibility state
      const logVisible = JSON.parse(localStorage.getItem(LOG_VISIBLE_KEY) || 'false');

      if (log)      log.style.display = logVisible ? '' : 'none';
      if (search)   search.style.display = logVisible ? '' : 'none';
      if (exportRow) exportRow.style.display = logVisible ? '' : 'none';
    }
  };
}

    // Top SAVE = "Save / Collapse All" for filters only
    if (saveBtn) {
      saveBtn.onclick = () => {
        const s = loadSettings();

        // Delegate to per-section save buttons so behavior is identical
        const avatarSave   = document.getElementById('avatar-save');
        const colorSave    = document.getElementById('color-save');
        const speciesSave  = document.getElementById('species-save');

        if (s.filterAvatar && avatarSave)   avatarSave.click();
        if (s.filterColor && colorSave)     colorSave.click();
        if (s.filterSpecies && speciesSave) speciesSave.click();

        // Name filter: save text but don't open anything
        const nameInput = document.getElementById('name-input');
        if (nameInput && s.filterName) {
          s.names = nameInput.value
            .split(',')
            .map(v => v.trim())
            .filter(Boolean);
          saveSettings(s);
        }

        // Re-apply highlighting with the saved filters
        retroHighlightAndScroll();
      };
    }

    // Toggle log visibility
    if (logTog) {
      logTog.onclick = () => {
        const visible = JSON.parse(localStorage.getItem(LOG_VISIBLE_KEY) || 'false');
        const newVis = !visible;
        localStorage.setItem(LOG_VISIBLE_KEY, String(newVis));

        const searchEl = document.getElementById('pld-search');
        const logEl    = document.getElementById('pld-log');
        const exRow    = document.getElementById('pld-exportrow');

        [searchEl, logEl, exRow].forEach(el => {
          if (el) el.style.display = newVis ? '' : 'none';
        });
      };
    }

        // Clear button
    if (clearBtn) {
      let lastClick = 0;
      let timer = null;
      clearBtn.onclick = () => {
        const now = Date.now();
        if (now - lastClick < 1500) {
          lastClick = 0;
          if (timer) { clearTimeout(timer); timer = null; }

          localStorage.removeItem(SETTINGS_KEY);
          localStorage.removeItem(LOG_KEY);
          localStorage.removeItem(RUN_FLAG);
          localStorage.removeItem(PAUSE_FLAG);
          localStorage.removeItem(START_MS);
          localStorage.removeItem(PAUSE_OFFSET);
          localStorage.removeItem(LOG_VISIBLE_KEY);
          localStorage.removeItem(SAVE_MODE_KEY);
          localStorage.removeItem(LOG_TOGGLE_KEY);
          localStorage.removeItem(EDIT_MODE_KEY);

          alert('⚠️ All settings cleared.');
          location.reload();
          return;
        }

        lastClick = now;
        timer = setTimeout(() => {
          localStorage.removeItem(LOG_KEY);
          const logDiv = document.getElementById('pld-log');
          if (logDiv) {
            logDiv.innerHTML = '⚠️ No pets logged yet.';
            if (typeof clearHighlights === 'function') clearHighlights();
          }
        }, 300);
      };
    }


    if (intervalSel) {
      intervalSel.onchange = e => {
        s.intervalMs = clamp(+e.target.value, MIN_INTERVAL_MS, MAX_INTERVAL_MS);
        saveSettings(s);
      };
    }

    if (durationSel) {
      durationSel.onchange = e => {
        s.durationMs = clamp(+e.target.value, 60000, MAX_DURATION_MS);
        saveSettings(s);
      };
    }

    if (enableAlerts) {
      enableAlerts.onchange = () => {
        s.alertsEnabled = enableAlerts.checked;
        saveSettings(s);
        if (!s.alertsEnabled && typeof clearHighlights === 'function') {
          clearHighlights();
        } else {
          retroHighlightAndScroll();
        }
      };
    }

    if (desktopChk) {
      desktopChk.onchange = () => {
        s.desktopNotify = desktopChk.checked;
        saveSettings(s);
        if (s.desktopNotify && 'Notification' in window && Notification.permission !== 'granted') {
          Notification.requestPermission().catch(() => {});
        }
      };
    }

    if (autoResumeChk) {
      autoResumeChk.onchange = () => {
        s.autoResume = autoResumeChk.checked;
        saveSettings(s);
      };
    }

    if (autoDelaySel) {
      autoDelaySel.onchange = () => {
        s.autoResumeDelayMs = +autoDelaySel.value || 60000;
        saveSettings(s);
      };
    }

    // Highlight handlers
    if (highlightAvatarChk) {
      highlightAvatarChk.onchange = () => {
        s.highlightAvatar = highlightAvatarChk.checked;
        saveSettings(s);
        retroHighlightAndScroll();
      };
    }

    if (highlightFilteredChk) {
      highlightFilteredChk.onchange = () => {
        s.highlightFiltered = highlightFilteredChk.checked;
        saveSettings(s);
        retroHighlightAndScroll();
      };
    }

    if (highlightLimitedChk) {
      highlightLimitedChk.onchange = () => {
        s.highlightLimited = highlightLimitedChk.checked;
        saveSettings(s);
        retroHighlightAndScroll();
      };
    }

    // LOWLIGHT handlers
    if (lowNumbersChk) {
      lowNumbersChk.onchange = () => {
        s.lowlightNumbers = lowNumbersChk.checked;
        saveSettings(s);
        retroHighlightAndScroll();
      };
    }

    if (lowUnderscoreChk) {
      lowUnderscoreChk.onchange = () => {
        s.lowlightUnderscores = lowUnderscoreChk.checked;
        saveSettings(s);
        retroHighlightAndScroll();
      };
    }

    if (lowLengthChk) {
      lowLengthChk.onchange = () => {
        s.lowlightLengthEnabled = lowLengthChk.checked;
    // RESET length min when disabled so it cannot fire
    if (!lowLengthChk.checked) s.lowlightLengthMin = 0;
        saveSettings(s);
        retroHighlightAndScroll();
      };
    }

    if (lowLengthSel) {
    lowLengthSel.onchange = () => {
    const val = parseInt(lowLengthSel.value, 10);
    s.lowlightLengthMin = isNaN(val) ? null : val;
    saveSettings(s);
    retroHighlightAndScroll();
  };
}
    // NEW: enabling a filter should NOT force section open.
    // We only let edit-mode open sections.
    const openOnEnable = () => {
      // No-op for now, collapse state handled by edit mode.
    };

    const showSec = (id, on) => {
      const el = document.querySelector(id);
      if (el) el.style.display = on ? '' : 'none';
    };

    if (chkAvatar) {
      chkAvatar.onchange = () => {
        openOnEnable('filterAvatar');
        s.filterAvatar = chkAvatar.checked;
        saveSettings(s);
        updateSectionVisibility();
        retroHighlightAndScroll();
        if (!chkAvatar.checked && typeof clearHighlights === 'function') clearHighlights();
      };
    }

    if (chkColor) {
      chkColor.onchange = () => {
        openOnEnable('filterColor');
        s.filterColor = chkColor.checked;
        saveSettings(s);
        updateSectionVisibility();
        retroHighlightAndScroll();
        if (!chkColor.checked && typeof clearHighlights === 'function') clearHighlights();
      };
    }

    if (chkSpecies) {
      chkSpecies.onchange = () => {
        openOnEnable('filterSpecies');
        s.filterSpecies = chkSpecies.checked;
        saveSettings(s);
        updateSectionVisibility();
        retroHighlightAndScroll();
        if (!chkSpecies.checked && typeof clearHighlights === 'function') clearHighlights();
      };
    }

    if (chkName) {
      chkName.onchange = () => {
        s.filterName = chkName.checked;
        saveSettings(s);
        showSec('#name-section', s.filterName);
    if (s.filterName) {
         expandFilterSection('name');
}

        retroHighlightAndScroll();
        if (!chkName.checked && typeof clearHighlights === 'function') clearHighlights();
      };
    }

    if (nameInput) {
      nameInput.oninput = () => {
        s.names = nameInput.value.split(',').map(v => v.trim()).filter(Boolean);
        saveSettings(s);
        retroHighlightAndScroll();
      };
    }

    const avatarSaveBtn   = document.getElementById('avatar-save');
    const avatarClearBtn  = document.getElementById('avatar-clear');
    const colorSaveBtn    = document.getElementById('color-save');
    const colorClearBtn   = document.getElementById('color-clear');
    const speciesSaveBtn  = document.getElementById('species-save');
    const speciesClearBtn = document.getElementById('species-clear');

    if (avatarSaveBtn) {
      avatarSaveBtn.onclick = () => {
        const selectedLabels = readCheckedValues('avatar');
        const keys = selectedLabels.map(lbl => {
          const match = AVATAR_PRESETS.find(p => p.label === lbl);
          return match ? match.key : lbl.toLowerCase().replace(/\s+/g, '_');
        });
        s.avatarPresetKeys = keys;
        s.collapsedAvatar = true;
        saveSettings(s);

        const sum = document.getElementById('summary-avatar');
        if (sum) sum.innerHTML = summaryOrNoneSelected(selectedLabels, 'Avatar presets');
        const sec = document.getElementById('avatar-section');
        if (sec) sec.style.display = 'none';
        retroHighlightAndScroll();
      };
    }

    if (avatarClearBtn) {
      avatarClearBtn.onclick = () => {
        s.avatarPresetKeys = [];
        s.collapsedAvatar = true;
        saveSettings(s);
        setCheckedValues('avatar', []);
        const sum = document.getElementById('summary-avatar');
        if (sum) sum.innerHTML = summaryOrNoneSelected([], 'Avatar presets');
        const sec = document.getElementById('avatar-section');
        if (sec) sec.style.display = 'none';
        retroHighlightAndScroll();
      };
    }

    if (colorSaveBtn) {
      colorSaveBtn.onclick = () => {
        s.colorsSel = readCheckedValues('color');
        s.collapsedColor = true;
        saveSettings(s);

        const sum = document.getElementById('summary-color');
        if (sum) sum.innerHTML = summaryOrNoneSelected(s.colorsSel, 'Color');
        const sec = document.getElementById('color-section');
        if (sec) sec.style.display = 'none';
        retroHighlightAndScroll();
      };
    }

    if (colorClearBtn) {
      colorClearBtn.onclick = () => {
        s.colorsSel = [];
        s.collapsedColor = true;
        saveSettings(s);
        setCheckedValues('color', []);
        const sum = document.getElementById('summary-color');
        if (sum) sum.innerHTML = summaryOrNoneSelected([], 'Color');
        const sec = document.getElementById('color-section');
        if (sec) sec.style.display = 'none';
        retroHighlightAndScroll();
      };
    }

    if (speciesSaveBtn) {
      speciesSaveBtn.onclick = () => {
        s.speciesSel = readCheckedValues('species');
        s.collapsedSpecies = true;
        saveSettings(s);

        const sum = document.getElementById('summary-species');
        if (sum) sum.innerHTML = summaryOrNoneSelected(s.speciesSel, 'Species');
        const sec = document.getElementById('species-section');
        if (sec) sec.style.display = 'none';
        retroHighlightAndScroll();
      };
    }

    if (speciesClearBtn) {
      speciesClearBtn.onclick = () => {
        s.speciesSel = [];
        s.collapsedSpecies = true;
        saveSettings(s);
        setCheckedValues('species', []);
        const sum = document.getElementById('summary-species');
        if (sum) sum.innerHTML = summaryOrNoneSelected([], 'Species');
        const sec = document.getElementById('species-section');
        if (sec) sec.style.display = 'none';
        retroHighlightAndScroll();
      };
    }

    if (playBtn)  playBtn.onclick  = startSession;
    if (pauseBtn) pauseBtn.onclick = togglePause;
    if (stopBtn)  stopBtn.onclick  = stopSession;

    if (searchEl && logEl) {
      searchEl.oninput = () => {
        const q = searchEl.value.toLowerCase();
        logEl.querySelectorAll('.pld-entry').forEach(el => {
          el.style.display = el.textContent.toLowerCase().includes(q) ? '' : 'none';
        });
      };
    }

    renderStatus(statusEl);
  }

  /* =========================
   *   LOG / EXPORT
   * ========================= */
  function ensureNoPetsMessage() {
    const logDiv = document.getElementById('pld-log');
    if (!logDiv) return;
    if (!logDiv.innerHTML.trim()) {
      logDiv.innerHTML = '⚠️ No pets logged yet.';
    }
  }

function exportLog(fmt) {
  const arr = readLog();
  if (!arr.length) {
    alert('No pets to export.');
    return;
  }

  const lines = [];

  if (fmt === 'txt') {
    arr.forEach(p => {
      const dt  = p.timestamp ? new Date(p.timestamp).toLocaleString() : '';
      const stats = `${p.price || 0} NP | L${p.level||0} S${p.strength||0} D${p.defence||0} M${p.movement||0}`;
      const link = `https://www.neopets.com/pound/adopt.phtml?search=${encodeURIComponent(p.name)}`;

      lines.push(`${dt} — ${p.name} (${p.color} ${p.species}) — ${stats} — ${link}`);
    });
  } else {
    // CSV
    lines.push(
      'Date/Time Seen,Name,Color,Species,Price/Stats,Link'
    );

    arr.forEach(p => {
      const dt = p.timestamp ? new Date(p.timestamp).toLocaleString() : '';
      const stats = `${p.price || 0} NP | L${p.level||0} S${p.strength||0} D${p.defence||0} M${p.movement||0}`;
      const link = `https://www.neopets.com/pound/adopt.phtml?search=${encodeURIComponent(p.name)}`;

      lines.push(
        `"${dt}","${p.name}","${p.color}","${p.species}","${stats}","${link}"`
      );
    });
  }

  const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `pound_log.${fmt}`;
  a.click();
  URL.revokeObjectURL(url);
}


  document.addEventListener('click', e => {
    if (e.target && e.target.id === 'pld-export-txt') exportLog('txt');
    if (e.target && e.target.id === 'pld-export-csv') exportLog('csv');
  });

  /* =========================
   *   COLLECT / ALERT
   * ========================= */
  function collectPetsAndMaybeAlert() {
    const s = loadSettings();
    const logEl = document.getElementById('pld-log');
    if (!logEl) return;

    const stored = readLog();
    const seen = new Set(stored.map(p => `${p.name}|${p.color}|${p.species}`.toLowerCase()));

    for (let i = 0; i < 3; i++) {
      const n  = document.getElementById(`pet${i}_name`);
      const c  = document.getElementById(`pet${i}_color`);
      const sp = document.getElementById(`pet${i}_species`);
      if (!n || !c || !sp) continue;

      const name    = n.textContent.trim();
      const color   = c.textContent.trim();
      const species = sp.textContent.trim();
      if (!name || !color || !species) continue;

        // Extract stats & price from pet_arr safely
let lvl = 0, str = 0, def = 0, mov = 0, price = 0;
if (window.pet_arr && pet_arr[i]) {
  lvl   = parseInt(pet_arr[i].level, 10) || 0;
  str   = parseInt(pet_arr[i].str, 10)   || 0;
  def   = parseInt(pet_arr[i].def, 10)   || 0;
  mov   = parseInt(pet_arr[i].speed, 10) || 0;  // movement, not used in classification
  price = parseInt(pet_arr[i].price, 10) || 0;
}


      const key = `${name}|${color}|${species}`.toLowerCase();
        // --- Retroactively update stats for previously logged pets (without moving them) ---
const existing = stored.find(p =>
  p.name.toLowerCase() === name.toLowerCase() &&
  p.color.toLowerCase() === color.toLowerCase() &&
  p.species.toLowerCase() === species.toLowerCase()
);

if (existing) {
  // Only update fields that were missing or zero before
  if (!existing.level)    existing.level    = lvl;
  if (!existing.strength) existing.strength = str;
  if (!existing.defence)  existing.defence  = def;
  if (!existing.movement) existing.movement = mov;
  if (!existing.price)    existing.price    = price;

  writeLog(stored);      // save updated entry
  retroHighlightAndScroll();  // reapply BD/SBD highlighting
  continue;              // DO NOT add a duplicate entry
}

      if (seen.has(key)) continue;
      seen.add(key);

      const matched = matchesActiveFilters(name, color, species, s);

      if (matched) {
        if (s.alertsEnabled) alert(`🎉 ${name} (${color} ${species}) found!`);

        if (s.desktopNotify && 'Notification' in window) {
          const icon = findPetIconSrc(name);
          const notify = () => desktopNotify(name, color, species, icon);
          if (Notification.permission === 'granted') notify();
          else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then(p => p === 'granted' && notify());
          }
        }

        const runningNow = localStorage.getItem(RUN_FLAG) === 'true';
        const pausedNow  = localStorage.getItem(PAUSE_FLAG) === 'true';
        // Always pause when a match is found
        if (runningNow && !pausedNow) togglePause();

        // Auto-resume logic
        if (s.autoResume) {
        const delay = s.autoResumeDelayMs || 60000;

        setTimeout(() => {
        // Only resume if still paused (user may unpause manually)
        if (localStorage.getItem(PAUSE_FLAG) === 'true') {

            // Resume session
            togglePause();

            // Restart next reload timer
            scheduleNextReload();
        }
    }, delay);

} else {
    // Auto-resume disabled → keep paused
    localStorage.setItem(PAUSE_FLAG, 'true');
}

      }

      const row = document.createElement('div');
      row.className = 'pld-entry';
      row.title = new Date().toLocaleString();
      row.setAttribute('data-name', name.toLowerCase());
      row.setAttribute('data-color', color.toLowerCase());
      row.setAttribute('data-species', species.toLowerCase());

      row.style.cssText =
        'display:flex;justify-content:space-between;align-items:center;margin:2px 0;font:9pt Verdana;';

      row.innerHTML = `
        <span style="text-align:left;">${name} (${color} ${species})</span>
        <span style="white-space:nowrap;">
          <a href="https://www.neopets.com/~${encodeURIComponent(name)}" target="_blank">📄</a>
          <a href="https://www.neopets.com/pound/adopt.phtml?search=${encodeURIComponent(name)}" target="_blank">➡️</a>
        </span>
      `;

      // Prepend to top of log
      const prevScrollTop = logEl.scrollTop;
      const prevHeight    = logEl.scrollHeight;
      logEl.prepend(row);
      const newHeight = logEl.scrollHeight;
      logEl.scrollTop = prevScrollTop + (newHeight - prevHeight);

      stored.unshift({
  name, color, species,
  timestamp: Date.now(),
  level: lvl,
  strength: str,
  defence: def,
  movement: mov,
  price: price
});

    }

    writeLog(stored);
    retroHighlightAndScroll();
    ensureNoPetsMessage();
  }

  /* =========================
   *   SESSION CONTROL
   * ========================= */
  function startSession() {
    const s = loadSettings();
    s.intervalMs = clamp(s.intervalMs || DEFAULT_INTERVAL_MS, MIN_INTERVAL_MS, MAX_INTERVAL_MS);
    s.durationMs = clamp(s.durationMs || DEFAULT_DURATION_MS, 60000, MAX_DURATION_MS);
    saveSettings(s);

    const now = Date.now();
    localStorage.setItem(RUN_FLAG, 'true');
    localStorage.setItem(PAUSE_FLAG, 'false');
    localStorage.setItem(START_MS, String(now));
    localStorage.setItem(REFRESH_COUNT, '0');
    localStorage.removeItem(PAUSE_OFFSET);

    scheduleNextReload();
    renderStatus(document.getElementById('pld-status'));
    collectPetsAndMaybeAlert();
  }

  function togglePause() {
    const now = Date.now();
    const paused = localStorage.getItem(PAUSE_FLAG) === 'true';

    if (!paused) {
      const start   = +(localStorage.getItem(START_MS) || now);
      const elapsed = now - start;

      localStorage.setItem(PAUSE_OFFSET, String(elapsed));

      const dueAt  = +(localStorage.getItem(NEXT_DUE_AT_KEY) || 0);
      const remain = Math.max(0, dueAt - now);
      localStorage.setItem(RELOAD_REMAIN_KEY, String(remain || 0));

      localStorage.setItem(PAUSE_FLAG, 'true');

      if (nextReloadTimer) {
        clearTimeout(nextReloadTimer);
        nextReloadTimer = null;
      }
    } else {
      const offset    = +(localStorage.getItem(PAUSE_OFFSET) || 0);
      const resumedAt = now - offset;

      localStorage.setItem(START_MS, String(resumedAt));
      localStorage.setItem(PAUSE_FLAG, 'false');
      localStorage.removeItem(PAUSE_OFFSET);

      const remain = +(localStorage.getItem(RELOAD_REMAIN_KEY) || 0);
      localStorage.removeItem(RELOAD_REMAIN_KEY);

      scheduleNextReload(remain > 0 ? remain : null);
    }

    renderStatus(document.getElementById('pld-status'));
  }

  function stopSession() {
    if (liveTimer) clearInterval(liveTimer);
    if (nextReloadTimer) clearTimeout(nextReloadTimer);

    liveTimer = null;
    nextReloadTimer = null;

    localStorage.setItem(RUN_FLAG, 'false');
    localStorage.setItem(PAUSE_FLAG, 'false');
    localStorage.removeItem(PAUSE_OFFSET);

    renderStatus(document.getElementById('pld-status'), true);
  }

  function renderStatus(el, forceIdle = false) {
    if (!el) return;
    const running = localStorage.getItem(RUN_FLAG) === 'true';
    const paused  = localStorage.getItem(PAUSE_FLAG) === 'true';
    const s = loadSettings();
    const start = +(localStorage.getItem(START_MS) || 0);
    const now = Date.now();

    let elapsed = 0, remain = 0;

    if (start) {
      elapsed = paused ? +(localStorage.getItem(PAUSE_OFFSET) || 0) : (now - start);
      remain = Math.max(0, (s.durationMs || DEFAULT_DURATION_MS) - elapsed);
    }

    if (forceIdle || !running) {
      el.textContent = 'Idle';
      el.style.opacity = 1;
      setTimeout(() => {
        el.style.transition = 'opacity 2s';
        el.style.opacity = 0.3;
      }, 2000);

      if (liveTimer) clearInterval(liveTimer);
      liveTimer = null;
      return;
    }

    if (paused) {
      el.textContent = `Paused. Remaining Session: ${fmtMMSS(remain)}`;
      if (liveTimer) clearInterval(liveTimer);
      liveTimer = null;
      return;
    }

    el.textContent = `Active. Remaining Session: ${fmtMMSS(remain)}`;

    if (!liveTimer) {
      liveTimer = setInterval(() => {
        const runningNow = localStorage.getItem(RUN_FLAG) === 'true';
        const pausedNow  = localStorage.getItem(PAUSE_FLAG) === 'true';
        if (!runningNow || pausedNow) return;

        const startMs   = +(localStorage.getItem(START_MS) || 0);
        const nowMs     = Date.now();
        const elapsedMs = nowMs - startMs;
        const remainMs  = Math.max(0, (s.durationMs || DEFAULT_DURATION_MS) - elapsedMs);

        el.textContent = `Active. Remaining Session: ${fmtMMSS(remainMs)}`;
        if (remainMs <= 0) stopSession();
      }, 1000);
    }
  }

  function scheduleNextReload(customDelayMs) {
    if (nextReloadTimer) {
      clearTimeout(nextReloadTimer);
      nextReloadTimer = null;
    }

    const running = localStorage.getItem(RUN_FLAG) === 'true';
    const paused  = localStorage.getItem(PAUSE_FLAG) === 'true';
    if (!running || paused) return;

    const s = loadSettings();
    const interval = clamp(s.intervalMs || DEFAULT_INTERVAL_MS, MIN_INTERVAL_MS, MAX_INTERVAL_MS);
    const delay = (typeof customDelayMs === 'number' && customDelayMs > 0)
      ? customDelayMs
      : interval;

    const dueAt = Date.now() + delay;
    localStorage.setItem(NEXT_DUE_AT_KEY, String(dueAt));

    nextReloadTimer = setTimeout(() => {
      location.reload();
    }, delay);
  }

  /* =========================
   *   SAFE INIT + WATCHDOG
   * ========================= */
  function safeInit() {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().catch(() => {});
    }

    if (window.__pound_inited) return;
    window.__pound_inited = true;

    try {
      if (!document.getElementById('pld-panel')) buildUI();
    } catch (e) {
      console.warn('[Pound Surfer] UI build error:', e);
    }

    setTimeout(() => {
      try { collectPetsAndMaybeAlert(); } catch (e) {}
    }, 1000);

    startWatchdog();
  }

  function startWatchdog() {
    if (window.__pound_watchdog) clearInterval(window.__pound_watchdog);
    let glitchCount = 0;

    window.__pound_watchdog = setInterval(() => {
      try {
        const running = localStorage.getItem(RUN_FLAG) === 'true';
        const paused  = localStorage.getItem(PAUSE_FLAG) === 'true';
        if (!running || paused) return;

        if (!document.getElementById('pld-panel')) {
          try { buildUI(); } catch (e) {}
        }

        const pet0 = document.getElementById('pet0_name');
        const pet1 = document.getElementById('pet1_name');
        const pet2 = document.getElementById('pet2_name');

        if (!pet0 && !pet1 && !pet2) {
          glitchCount++;
          if (glitchCount >= 3) {
            glitchCount = 0;
            scheduleNextReload(4000);
          }
        } else glitchCount = 0;

        if (!nextReloadTimer) {
          scheduleNextReload();
        }

      } catch (err) {
        console.error('[Pound Surfer Watchdog Error]', err);
      }
    }, 3000);
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    safeInit();
  } else {
    window.addEventListener('DOMContentLoaded', safeInit);
  }

})();
