// ==UserScript==
// @name         Autofill Tiktok Pros archive
// @version      1
// @description  Autofill Tiktok with Counter + CSV Preset Sync
// @match        https://www.tiktok.com/*
// @grant        GM_xmlhttpRequest
// @run-at       document-idle
// @namespace https://greasyfork.org/users/1388863
// @downloadURL https://update.greasyfork.org/scripts/558303/Autofill%20Tiktok%20Pros%20archive.user.js
// @updateURL https://update.greasyfork.org/scripts/558303/Autofill%20Tiktok%20Pros%20archive.meta.js
// ==/UserScript==


(function () {
  'use strict';

  // =========================
// BAGIAN A (PERBAIKAN): runFilling
// =========================
async function runFilling({
  searchText = 'Office',
  radioValue = 'Panduan Cepat Kuasai Microsoft Office',
  deskripsi = 'belajar office dengan mudah',
  currentdate = "2025-11-12",
  targetDate = "2025-11-13",
  targetjam = "21",
  targetmenit = "00",
  autoUpload = false, // jika true, klik tombol upload + Post now di akhir
  uploadNow = false // NEW: jika true, skip scheduling dan langsung post_now
} = {}) {

  console.log('🚀 runFilling started dengan parameter:', {
    searchText, radioValue, deskripsi, currentdate, targetDate, targetjam, targetmenit, autoUpload, uploadNow
  });

  try {
    // -------------------------
    // Helper utilities
    // -------------------------
    const sleep = ms => new Promise(r => setTimeout(r, ms));
    const rand = (min, max) => Math.random() * (max - min) + min;
    const sleepRandom = (min = 1000, max = 1500) => sleep(rand(min, max));

    function safeClick(el) {
      if (!el) return false;
      try {
        // try to enable if disabled via attributes
        try { if (el.getAttribute && el.getAttribute('aria-disabled') === 'true') el.setAttribute('aria-disabled', 'false'); } catch(e){}
        try { if (el.disabled) el.disabled = false; } catch(e){}
        el.click();
        return true;
      } catch (err) {
        try {
          // Remove the view property that's causing issues
          ['mouseover','mousedown','mouseup','click'].forEach(type => {
            el.dispatchEvent(new MouseEvent(type, { bubbles: true, cancelable: true }))
          });
          return true;
        } catch (err2) {
          console.warn('safeClick failed both methods', err, err2);
          return false;
        }
      }
    }

    function dispatchClick(el) {
      if (!el) return false;
      try {
        // Simple click first
        el.click();
      } catch (e) {
        // Fallback to mouse events without view property
        ['mousedown','mouseup','click'].forEach(type => {
          el.dispatchEvent(new MouseEvent(type, { bubbles: true, cancelable: true }))
        });
      }
      return true;
    }

    function clickButtonExact(text) {
      const btn = Array.from(document.querySelectorAll('button, [role="button"], .TUXButton'))
        .find(b => (b.textContent || '').trim().toLowerCase() === String(text).toLowerCase());
      if (!btn) return false;
      return safeClick(btn);
    }

    function findAddButton() {
      const footer = document.querySelector('.common-modal-footer');
      let btn = (footer && footer.querySelector('.TUXButton--primary')) || document.querySelector('button.TUXButton--primary');
      if (!btn) {
        btn = Array.from(document.querySelectorAll('button, [role="button"], .TUXButton'))
          .find(b => (b.textContent || '').trim().toLowerCase().includes('add'));
      }
      return btn || null;
    }

    // -------------------------
    // STEP: runAutomation (filling)
    // -------------------------
    console.log('📋 STEP 1: Menjalankan proses filling form...');

    // 1) Add (first)
    try {
      const addBtn1 = findAddButton();
      if (addBtn1) {
        const ok = safeClick(addBtn1);
        console.log('🖱️ Add (first) clicked?', !!ok, addBtn1 && {text: (addBtn1.textContent||'').trim(), classes: addBtn1.className});
      } else {
        console.warn('⚠️ Add (first) not found');
      }
    } catch (e) { console.warn('Error clicking Add (first)', e); }
    await sleepRandom();

    // 2) Next (first)
    try {
      const ok = clickButtonExact('Next');
      console.log('🖱️ Next (first) clicked?', !!ok);
    } catch (e) { console.warn('Error clicking Next (first)', e); }
    await sleepRandom();

    // 3) Fill search input
    try {
      const input = document.querySelector('input.TUXTextInputCore-input[placeholder="Search products"]');
      if (!input) { console.warn('❌ search input not found'); return; }
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      if (setter) setter.call(input, searchText); else input.value = searchText;
      input.dispatchEvent(new Event('input',{bubbles:true}));
      input.dispatchEvent(new Event('change',{bubbles:true}));
      console.log('⌨️ search filled:', searchText);
    } catch (e) { console.warn('Error filling search', e); }
    await sleepRandom();

    // 4) Press Enter on search
    try {
      const input = document.querySelector('input.TUXTextInputCore-input[placeholder="Search products"]');
      if (input) {
        const enterOpts = { bubbles: true, cancelable: true, key: 'Enter', code: 'Enter', keyCode: 13, which: 13 };
        ['keydown','keypress','keyup'].forEach(ev => input.dispatchEvent(new KeyboardEvent(ev, enterOpts)));
        console.log('↩️ Enter dispatched on search input');
      }
    } catch (e) { console.warn('Error dispatching Enter', e); }
    await sleepRandom();

    // 5) Select radio
    try {
      // PRIORITAS 1: Gunakan selector spesifik sesuai saran user (Exact Match)
      // Mencari input radio dengan value atau name yang sama persis dengan radioValue
      let radio = null;
      try {
        // Escape quotes untuk selector
        const safeVal = radioValue.replace(/\\/g, '\\\\').replace(/"/g, '\\"');

        // Coba selector value="..."
        radio = document.querySelector(`input[type="radio"][value="${safeVal}"]`);

        // Jika tidak ketemu, coba selector name="..." (sesuai contoh user)
        if (!radio) {
          radio = document.querySelector(`input[type="radio"][name="${safeVal}"]`);
        }

        if (radio) {
            console.log('✅ Radio found via direct selector!');
        }
      } catch (errSel) {
        console.warn('Direct selector check failed:', errSel);
      }

      // PRIORITAS 2: Fallback ke pencarian Robust (jika cara di atas gagal)
      if (!radio) {
        console.log('⚠️ Direct selector failed, trying robust search...');

        function normalizeForCompare(s) {
            if (s == null) return '';
            return String(s).replace(/\u00A0/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase();
        }

        function findRadioByValueRobust(targetValue) {
            const normalizedTarget = normalizeForCompare(targetValue);
            const candidates = Array.from(document.querySelectorAll('input[type="radio"].TUXRadioStandalone-input, input[type="radio"]'));

            // 1) exact normalized match on value
            let found = candidates.find(el => normalizeForCompare(el.value) === normalizedTarget);
            if (found) return found;

            // 2) match on associated label
            found = candidates.find(el => {
            try {
                const id = el.id;
                if (id) {
                const label = document.querySelector(`label[for="${CSS.escape(id)}"]`);
                if (label && normalizeForCompare(label.textContent) === normalizedTarget) return true;
                }
                const parentLabel = el.closest('label');
                if (parentLabel && normalizeForCompare(parentLabel.textContent) === normalizedTarget) return true;
            } catch (e) {}
            return false;
            });
            if (found) return found;

            return null;
        }

        radio = findRadioByValueRobust(radioValue);
      }

      if (!radio) {
        console.warn('❌ radio not found (all methods):', radioValue);
        return;
      }

      // EKSEKUSI KLIK
      // 1. Klik langsung sesuai request user
      radio.click();

      // 2. Set property checked (backup)
      try {
        radio.checked = true;
      } catch (e) {}

      // 3. Dispatch events untuk memicu listener React/Framework
      radio.dispatchEvent(new Event('input', { bubbles: true }));
      radio.dispatchEvent(new Event('change', { bubbles: true }));

      console.log('✅ radio selected:', radioValue);
    } catch (e) { console.warn('Error selecting radio', e); }
    await sleepRandom();

    // 6) Next (second)
    try {
      console.log('🔘 Finding Next (second) via code2 logic...');
      const footer = document.querySelector('.common-modal-footer');
      let nextBtn = (footer && footer.querySelector('.TUXButton--primary')) || document.querySelector('button.TUXButton--primary');
      if (!nextBtn) {
        nextBtn = Array.from(document.querySelectorAll('button, [role="button"], .TUXButton'))
          .find(b => (b.textContent || '').trim().toLowerCase().includes('next'));
      }
      if (!nextBtn) { console.warn('❌ Next (second) not found'); return; }
      const ok = safeClick(nextBtn);
      console.log('🖱️ Next (second) clicked?', !!ok, {text: (nextBtn.textContent||'').trim(), classes: nextBtn.className});
    } catch (e) { console.warn('Error clicking Next (second)', e); }
    await sleepRandom();

    // 7) Fill description
    try {
      let descInput = document.querySelector('input.TUXTextInputCore-input#\\:r2hi\\:')
        || Array.from(document.querySelectorAll('input.TUXTextInputCore-input')).find(el => (el.value || '').includes('Panduan Cepat Kuasai Microsoft'))
        || document.querySelector('.TUXTextInputCore input.TUXTextInputCore-input');
      if (!descInput) { console.warn('❌ description input not found'); return; }
      const setter2 = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      const old = descInput.value;
      if (setter2) setter2.call(descInput, deskripsi); else descInput.value = deskripsi;
      descInput.dispatchEvent(new Event('input',{bubbles:true}));
      descInput.dispatchEvent(new Event('change',{bubbles:true}));
      console.log('📝 description set:', {from: old, to: deskripsi});
    } catch (e) { console.warn('Error filling description', e); }
    await sleepRandom();

    // 8) Add (final)
    try {
      const addBtn2 = findAddButton();
      if (addBtn2) {
        const ok = safeClick(addBtn2);
        console.log('🖱️ Add (final) clicked?', !!ok, addBtn2 && {text: (addBtn2.textContent||'').trim(), classes: addBtn2.className});
      } else {
        console.warn('⚠️ Add (final) not found');
      }
    } catch (e) { console.warn('Error clicking Add (final)', e); }
    await sleepRandom();

    console.log('✅ Proses filling form selesai!');

    // -------------------------
    // STEP: runschedule (scheduling) - SKIP JIKA uploadNow = true
    // -------------------------
    if (uploadNow) {
      console.log('\n⚡ STEP 2: Upload Now mode - skipping scheduling...');

      // Klik radio post_now
      await sleepRandom();
      const postNowRadio = document.querySelector('input[type="radio"][value="post_now"]');
      if (!postNowRadio) {
        console.warn('⚠️ Radio "post_now" tidak ditemukan!');
      } else {
        safeClick(postNowRadio);
        console.log('✅ Radio "post_now" diklik.');
      }

      // Langsung lanjut ke auto upload jika enabled
      console.log('✔️ Upload Now mode selesai, lanjut ke upload...');

    } else {
      console.log('\n📅 STEP 2: Menjalankan proses scheduling...');

      const randDelay = async (min = 200, max = 500) => sleep(rand(min, max));

    // STEP 1: Klik radio "schedule"
    await randDelay();
    const scheduleRadio = document.querySelector('input[type="radio"][value="schedule"]') || document.querySelector('input[value="schedule"]');
    if (!scheduleRadio) {
      console.warn('Radio "schedule" tidak ditemukan!');
    } else {
      dispatchClick(scheduleRadio);
      console.log('✅ Radio "schedule" diklik.');
    }

    await randDelay();

    // STEP 2: Pilih tanggal
    await randDelay();
    const dateInputSelector = `input[readonly][value="${currentdate}"]`;
    let dateInput = document.querySelector(dateInputSelector);
    if (!dateInput) {
      dateInput = document.querySelector('input[readonly].TUXTextInputCore-input') || document.querySelector('input[readonly]');
    }
    if (!dateInput) {
      console.warn(`Input tanggal dengan value "${currentdate}" tidak ditemukan.`);
    } else {
      dispatchClick(dateInput);
      console.log(`✅ Input tanggal (currentValue="${currentdate}") diklik.`);
    }

    await randDelay();

    // Parse dates
    const [tY, tM, tD] = targetDate.split('-').map(Number);
    const [cY, cM] = currentdate.split('-').map(Number);
    const diff = (tY - cY) * 12 + (tM - cM);

    await randDelay();

    // Navigate months (best-effort)
    const arrows = document.querySelectorAll('.jsx-1793871833.arrow');
    if (arrows && arrows.length >= 2) {
      const arrowToClick = diff > 0 ? arrows[1] : arrows[0];
      const steps = Math.abs(diff);
      for (let i = 0; i < steps; i++) {
        await randDelay();
        dispatchClick(arrowToClick);
        console.log(`⤴︎ Navigasi bulan (${i + 1}/${steps})`);
      }
    } else {
      const nextBtn = document.querySelector('.datepicker-next, .react-datepicker__navigation--next, .dp-next');
      const prevBtn = document.querySelector('.datepicker-prev, .react-datepicker__navigation--previous, .dp-prev');
      if ((nextBtn || prevBtn) && Math.abs(diff) > 0) {
        const btn = diff > 0 ? nextBtn : prevBtn;
        for (let i = 0; i < Math.abs(diff); i++) {
          await randDelay();
          dispatchClick(btn);
          console.log(`⤴︎ Navigasi bulan (fallback) ${i + 1}/${Math.abs(diff)}`);
        }
      } else {
        console.log('ℹ️ Tombol navigasi bulan tidak ditemukan — lanjut mencoba pilih hari di tampilan saat ini.');
      }
    }

    await randDelay();

    // Pilih hari
    const dayEls = Array.from(document.querySelectorAll('span.day.valid, td.day:not(.disabled), button.day, .datepicker-day, .react-datepicker__day'))
      .filter(el => el.textContent && el.textContent.trim() === String(tD));
    if (dayEls.length > 0) {
      const targetDay = dayEls.find(el => el.offsetParent !== null) || dayEls[0];
      await randDelay();
      dispatchClick(targetDay);
      console.log(`✅ Tanggal ${targetDate} dipilih.`);
    } else {
      console.warn(`⚠️ Elemen hari "${tD}" tidak ditemukan setelah navigasi. Cek struktur datepicker.`);
    }

    // STEP 3: Pilih jam & menit
    await randDelay();

    function clickOptionByText(side, text) {
      const sel = `.tiktok-timepicker-option-text.tiktok-timepicker-${side}`;
      const els = Array.from(document.querySelectorAll(sel));
      const target = els.find(el => (el.textContent || '').trim() === text);
      if (!target) {
        const alt = Array.from(document.querySelectorAll('button, div, span'))
          .find(el => (el.textContent || '').trim() === text);
        if (alt) {
          dispatchClick(alt);
          return alt;
        }
        return null;
      }

      try {
        // Simple click first
        target.click();
      } catch (e) {
        // Fallback to mouse events without view property
        ['mousedown','mouseup','click'].forEach(type => {
          target.dispatchEvent(new MouseEvent(type, { bubbles: true, cancelable: true }))
        });
      }
      return target;
    }

    // Klik jam
    await randDelay();
    const jamEl = clickOptionByText('left', String(targetjam));
    if (jamEl) {
      console.log(`✅ Jam "${targetjam}" dipilih.`);
    } else {
      console.warn(`⚠️ Opsi jam "${targetjam}" tidak ditemukan.`);
    }

    await randDelay();

    // Klik menit
    await randDelay();
    const menitEl = clickOptionByText('right', String(targetmenit));
    if (menitEl) {
      console.log(`✅ Menit "${targetmenit}" dipilih.`);
    } else {
      console.warn(`⚠️ Opsi menit "${targetmenit}" tidak ditemukan.`);
    }

      console.log('✔️ Proses scheduling selesai.');
    } // END of if-else uploadNow

    // -------------------------
    // OPTIONAL: Auto Upload + Post Now
    // DIPINDAHKAN KE SINI - SETELAH SCHEDULING/POST_NOW SELESAI
    // -------------------------
    if (autoUpload) {
      try {
        // tunggu 0.8-1.2s dulu setelah scheduling selesai
        const delayBeforeUpload = rand(500, 1000);
        console.log(`⏱️ Waiting ${Math.round(delayBeforeUpload)}ms setelah scheduling sebelum AutoUpload...`);
        await sleep(delayBeforeUpload);

        // 1) klik button[data-e2e="post_video_button"]
        const postButton = document.querySelector('button[data-e2e="post_video_button"]');
        if (postButton) {
          const ok = safeClick(postButton);
          console.log('🖱️ post_video_button clicked?', !!ok, postButton);
        } else {
          console.warn('❌ button[data-e2e="post_video_button"] not found.');
        }

        // 2) tunggu 0.8-1.0s lalu klik "Post now"
        const delay2 = rand(500, 1000);
        console.log(`⏱️ Waiting ${Math.round(delay2)}ms before clicking "Post now"...`);
        await sleep(delay2);

        // mencari tombol Post now
        const buttons = document.querySelectorAll('button.TUXButton');
        const targetButton = Array.from(buttons).find(btn => (btn.textContent || '').trim() === 'Post now');
        if (targetButton) {
          const ok2 = safeClick(targetButton);
          console.log('✅ Tombol "Post now" clicked?', !!ok2);
        } else {
          console.warn('❌ Tombol "Post now" tidak ditemukan.');
        }

      } catch (errAuto) {
        console.error('Error during autoUpload actions', errAuto);
      }
    }

    // selesai
    console.log('\n🎉 runFilling SELESAI! Semua proses dijalankan.');
    return true;

  } catch (err) {
    console.error('❌ runFilling error:', err);
    throw err;
  }
}

// expose to window like versi sebelumnya
window.runFilling = runFilling;



    /* ============================
   BAGIAN B: UI + localStorage + increase logic + AutoUpload + keyboard triggers + COUNTER + PRESETS
   ============================ */

const LS_KEY = 'runFillingSettings';
const PRESETS_KEY = 'runFillingPresets';
const CSV_URL_KEY = 'csvUrl'; // NEW: untuk menyimpan URL GitHub
const defaultSettings = {
  searchText: 'Office',
  radioValue: 'Panduan Cepat Kuasai Microsoft Office',
  deskripsi: 'belajar office dengan mudah',
  currentdate: "2025-11-12",
  targetDate: "2025-11-13",
  targetjam: "21",
  targetmenit: "00",
  increaseDate: false,
  increaseHours: false,
  autoUpload: false,
  uploadNow: false, // NEW: skip scheduling, langsung post_now
  increaseHoursAmount: 2, // NEW: jumlah jam untuk increase (default 2)
  increaseMinutesAmount: 0, // NEW: jumlah menit untuk increase (default 0)
  counterStart: 1,
  currentCounter: 1,
  selectedPreset: '',
  csvUrl: ''
};

const defaultPresets = [
  {
    id: 'preset_1',
    name: 'Office Tutorial',
    searchText: 'Office',
    radioValue: 'Panduan Cepat Kuasai Microsoft Office',
    deskripsi: 'belajar office dengan mudah'
  },
  {
    id: 'preset_2',
    name: 'Python Tutorial',
    searchText: 'Python',
    radioValue: 'Belajar Python dari Nol',
    deskripsi: 'tutorial python pemula'
  }
];

function saveRunSettings(obj) {
  localStorage.setItem(LS_KEY, JSON.stringify(obj));
}

function loadRunSettings() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) {
      saveRunSettings(defaultSettings);
      return { ...defaultSettings };
    }
    return { ...defaultSettings, ...JSON.parse(raw) };
  } catch (e) {
    console.warn('loadRunSettings error', e);
    saveRunSettings(defaultSettings);
    return { ...defaultSettings };
  }
}

function savePresets(presets) {
  localStorage.setItem(PRESETS_KEY, JSON.stringify(presets));
}

function loadPresets() {
  try {
    const raw = localStorage.getItem(PRESETS_KEY);
    if (!raw) {
      savePresets(defaultPresets);
      return [...defaultPresets];
    }
    return JSON.parse(raw);
  } catch (e) {
    console.warn('loadPresets error', e);
    savePresets(defaultPresets);
    return [...defaultPresets];
  }
}

function addPreset(preset) {
  const presets = loadPresets();
  const newPreset = {
    id: 'preset_' + Date.now(),
    ...preset
  };
  presets.push(newPreset);
  savePresets(presets);
  return newPreset;
}

function deletePreset(presetId) {
  const presets = loadPresets();
  const filtered = presets.filter(p => p.id !== presetId);
  savePresets(filtered);
  return filtered;
}

function applyPreset(presetId) {
  const presets = loadPresets();
  const preset = presets.find(p => p.id === presetId);
  if (!preset) return false;

  const settings = loadRunSettings();
  settings.searchText = preset.searchText;
  settings.radioValue = preset.radioValue;
  settings.deskripsi = preset.deskripsi;
  settings.selectedPreset = presetId;
  saveRunSettings(settings);

  // Update UI fields
  const searchTextEl = document.getElementById('rf_searchText');
  const radioValueEl = document.getElementById('rf_radioValue');
  const deskripsiEl = document.getElementById('rf_deskripsi');
  const presetSelect = document.getElementById('rf_presetSelect');

  if (searchTextEl) searchTextEl.value = preset.searchText;
  if (radioValueEl) radioValueEl.value = preset.radioValue;
  if (deskripsiEl) deskripsiEl.value = preset.deskripsi;
  if (presetSelect) presetSelect.value = presetId;

  return true;
}

// CSV Operations Functions
function csvToArray(text) {
  console.log('Raw CSV text length:', text.length);

  const result = [];
  const rows = [];
  let currentRow = [];
  let currentVal = '';
  let inQuotes = false;

  // Robust CSV State Machine Parser
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (inQuotes) {
      if (char === '"') {
        if (nextChar === '"') {
          // Escaped quote "" inside quotes
          currentVal += '"';
          i++; // skip next quote
        } else {
          // End of quoted field
          inQuotes = false;
        }
      } else {
        // Inside quotes, preserve EVERYTHING including newlines and commas
        currentVal += char;
      }
    } else {
      // Outside quotes
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        // End of field
        currentRow.push(currentVal); // Don't trim here, let the data decide, or trim later
        currentVal = '';
      } else if (char === '\r') {
        // Ignore CR
      } else if (char === '\n') {
        // End of row
        currentRow.push(currentVal);
        rows.push(currentRow);
        currentRow = [];
        currentVal = '';
      } else {
        currentVal += char;
      }
    }
  }

  // Handle the last field/row if the file doesn't end with \n
  if (currentVal !== '' || currentRow.length > 0) {
    currentRow.push(currentVal);
    rows.push(currentRow);
  }

  console.log(`Parsed ${rows.length} rows`);

  if (rows.length < 2) {
    console.log('Not enough lines, need header + data');
    return [];
  }

  // Process rows (skip header row 0)
  for (let i = 1; i < rows.length; i++) {
    const values = rows[i].map(v => v.trim()); // Trim values here

    // Skip empty rows
    if (values.every(v => !v)) continue;

    // Ensure we have enough columns (allow partials if critical fields exist)
    // Format: name,searchText,radioValue,deskripsi
    const name = values[0] || '';
    const searchText = values[1] || '';
    const radioValue = values[2] || '';
    const deskripsi = values[3] || '';

    if (name || searchText) {
      const preset = {
        id: 'preset_' + Date.now() + '_' + i,
        name,
        searchText,
        radioValue,
        deskripsi
      };
      result.push(preset);
    }
  }

  console.log(`Generated ${result.length} presets`);
  return result;
}

function presetsToCsv(presets) {
  const headers = 'name,searchText,radioValue,deskripsi';
  const escapeCsv = (val) => {
    if (!val) return '';
    const s = String(val);
    if (s.includes(',') || s.includes('"') || s.includes('\n')) {
      return `"${s.replace(/"/g, '""')}"`;
    }
    return s;
  };

  const rows = presets.map(p =>
    `${escapeCsv(p.name)},${escapeCsv(p.searchText)},${escapeCsv(p.radioValue)},${escapeCsv(p.deskripsi)}`
  );
  return headers + '\n' + rows.join('\n');
}

async function fetchCsvFromGitHub(url) {
  try {
    let rawUrl = url.trim();

    // Robust GitHub URL Converter
    try {
      // Helper to ensure we have a URL object (add https if missing)
      if (!rawUrl.startsWith('http')) rawUrl = 'https://' + rawUrl;

      const u = new URL(rawUrl);

      // Case 1: github.com -> raw.githubusercontent.com
      if (u.hostname === 'github.com') {
        const parts = u.pathname.split('/');
        // parts: ["", "user", "repo", "blob|raw", "branch", "path..."]

        if (parts.length >= 5) {
          const mode = parts[3]; // blob, raw, or refs
          if (mode === 'blob' || mode === 'raw') {
             u.hostname = 'raw.githubusercontent.com';
             // remove the mode (blob/raw) part
             const newPath = [parts[0], parts[1], parts[2], ...parts.slice(4)].join('/');
             u.pathname = newPath;
             rawUrl = u.toString();
          } else if (mode === 'refs') {
            // Handle /refs/heads/
             u.hostname = 'raw.githubusercontent.com';
             // remove /refs/heads/ -> usually parts[3]='refs', parts[4]='heads'
             if (parts[4] === 'heads') {
                const newPath = [parts[0], parts[1], parts[2], ...parts.slice(5)].join('/');
                u.pathname = newPath;
                rawUrl = u.toString();
             }
          }
        }
      }
    } catch (e) {
      console.warn('URL parsing failed, using original:', e);
    }

    // Add timestamp to prevent caching
    const separator = rawUrl.includes('?') ? '&' : '?';
    const timestamp = Date.now();
    const noCacheUrl = `${rawUrl}${separator}t=${timestamp}`;

    console.log('Fetching CSV via GM_xmlhttpRequest from:', noCacheUrl);

    // Use GM_xmlhttpRequest to bypass CSP
    const csvText = await new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "GET",
        url: noCacheUrl,
        onload: (response) => {
          if (response.status >= 200 && response.status < 300) {
            resolve(response.responseText);
          } else {
            reject(new Error(`HTTP ${response.status}: ${response.statusText}`));
          }
        },
        onerror: (error) => {
          console.error('GM_xmlhttpRequest error:', error);
          reject(new Error('Network error or CSP blocked request'));
        },
        ontimeout: () => {
          reject(new Error('Request timed out'));
        }
      });
    });

    // Detailed validation with preview
    if (csvText.trim().startsWith('<!DOCTYPE html') || csvText.includes('<html')) {
       console.error('Received HTML content:', csvText.substring(0, 500));
       const preview = csvText.substring(0, 100).replace(/\n/g, ' ');
       throw new Error(`Received HTML instead of CSV. content: "${preview}..."`);
    }

    if (!csvText || csvText.trim() === '') {
      throw new Error('Empty CSV file');
    }

    return csvText;
  } catch (error) {
    console.error('Error fetching CSV:', error);
    throw error;
  }
}

function importPresetsFromCsv(csvText) {
  console.log('Starting CSV import...');
  const newPresets = csvToArray(csvText);

  if (newPresets.length === 0) {
    console.log('No valid presets found');
    showTempNotice('No valid presets found in CSV. Check console for details.');
    showTempNotice('CSV format: name,searchText,radioValue,deskripsi', 5000);
    return false;
  }

  console.log(`Found ${newPresets.length} valid presets to import`);

  const existingPresets = loadPresets();
  let addedCount = 0;
  let duplicateCount = 0;

  // Filter duplicates
  newPresets.forEach(newP => {
    // Check if duplicate exists based on content (ignoring ID)
    const isDuplicate = existingPresets.some(existP =>
      existP.name === newP.name &&
      existP.searchText === newP.searchText &&
      existP.radioValue === newP.radioValue &&
      existP.deskripsi === newP.deskripsi
    );

    if (!isDuplicate) {
      existingPresets.push(newP);
      addedCount++;
    } else {
      duplicateCount++;
    }
  });

  if (addedCount > 0) {
    savePresets(existingPresets);
    showTempNotice(`Imported ${addedCount} new presets (${duplicateCount} duplicates skipped)`);
    console.log(`Import completed: ${addedCount} added, ${duplicateCount} skipped`);
    return true;
  } else {
    showTempNotice(`No new presets added (${duplicateCount} duplicates skipped)`);
    console.log(`Import skipped: All ${duplicateCount} presets were duplicates`);
    return true; // Return true because the operation itself was successful, just no new data
  }
}

function resetAllPresets() {
  if (!confirm('Are you sure you want to delete ALL presets? This action cannot be undone!')) {
    return false;
  }

  const presets = loadPresets();
  const count = presets.length;

  // Clear all presets
  savePresets([]);

  // Update dropdown if popup is open
  updatePresetSelect();

  showTempNotice(`Reset complete: Deleted ${count} presets`);
  console.log(`Reset complete: Deleted ${count} presets`);

  return true;
}

function exportPresetsToCsv() {
  const presets = loadPresets();
  if (presets.length === 0) {
    showTempNotice('No presets to export');
    return;
  }

  const csvContent = presetsToCsv(presets);

  // Create download
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'tiktok_presets_' + new Date().toISOString().split('T')[0] + '.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);

  showTempNotice(`Exported ${presets.length} presets to CSV`);
}

async function syncPresetsFromGitHub() {
  const settings = loadRunSettings();
  if (!settings.csvUrl) {
    showTempNotice('No GitHub CSV URL configured');
    return false;
  }

  try {
    showTempNotice('Syncing presets from GitHub...', 0);
    const csvText = await fetchCsvFromGitHub(settings.csvUrl);
    const success = importPresetsFromCsv(csvText);

    if (success) {
      updatePresetSelect();
      showTempNotice('Presets synced successfully', 2000);
    } else {
      showTempNotice('Failed to sync presets', 2000);
    }

    return success;
  } catch (error) {
    showTempNotice('Error: ' + error.message, 3000);
    return false;
  }
}

function parseYMD(s) {
  const p = String(s).split('-').map(Number);
  if (p.length !== 3 || p.some(isNaN)) return null;
  return new Date(p[0], p[1] - 1, p[2]);
}
function formatYMD(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function escapeHtml(str) {
  return String(str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

let noticeTimeout = null;
function showTempNotice(text, ms = 1400) {
  let el = document.getElementById('rf_notice');
  if (!el) {
    el = document.createElement('div');
    el.id = 'rf_notice';
    Object.assign(el.style, {
      position: 'fixed', left: '160px', bottom: '80px', zIndex: 12000,
      padding: '8px 12px', background: 'rgba(0,0,0,0.85)', color: '#fff',
      borderRadius: '6px', fontSize: '13px', opacity: '0', transition: 'opacity 0.3s'
    });
    document.body.appendChild(el);
  }

  // Clear any existing timeout
  if (noticeTimeout) {
    clearTimeout(noticeTimeout);
    noticeTimeout = null;
  }

  el.textContent = text;
  el.style.opacity = '1';

  // Only auto-hide if timeout is specified
  if (ms > 0) {
    noticeTimeout = setTimeout(() => {
      el.style.opacity = '0';
      noticeTimeout = null;
    }, ms);
  }
}

function safeClick(el) {
  if (!el) return false;
  try { el.disabled = false; el.click(); return true; }
  catch {
    try {
      ['mousedown','mouseup','click'].forEach(t =>
        el.dispatchEvent(new MouseEvent(t, { bubbles: true, cancelable: true }))
      );
      return true;
    } catch { return false; }
  }
}

async function triggerAutoUpload() {
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const rand = (min, max) => Math.random() * (max - min) + min;
  try {
    showTempNotice('AutoUpload...');
    await sleep(rand(800, 1200));
    const postBtn = document.querySelector('button[data-e2e="post_video_button"]');
    if (postBtn) {
      safeClick(postBtn);
      console.log('🖱️ Clicked post_video_button');
    } else {
      console.warn('❌ post_video_button not found');
    }

    await sleep(rand(800, 1000));
    const btns = document.querySelectorAll('button.TUXButton');
    const postNow = Array.from(btns).find(b => (b.textContent || '').trim() === 'Post now');
    if (postNow) {
      safeClick(postNow);
      console.log('✅ Clicked "Post now"');
      showTempNotice('Posted successfully');
    } else {
      console.warn('❌ "Post now" not found');
      showTempNotice('"Post now" not found');
    }
  } catch (err) {
    console.error('AutoUpload error', err);
    showTempNotice('AutoUpload error (console)');
  }
}

let settingsPopup = null;
let presetPopup = null;

function togglePresetPopup() {
  if (presetPopup) { presetPopup.remove(); presetPopup = null; return; }

  presetPopup = document.createElement('div');
  Object.assign(presetPopup.style, {
    position: 'fixed', bottom: '100px', left: '160px', background: '#111', color: '#fff',
    padding: '14px', borderRadius: '10px', width: '360px', zIndex: 11000, boxShadow: '0 4px 14px rgba(0,0,0,0.5)'
  });

  presetPopup.innerHTML = `
    <div style="display:flex;justify-content:space-between;margin-bottom:8px">
      <strong>Add New Preset</strong>
      <button id="closePresetPopup" style="background:none;border:none;color:#fff;cursor:pointer">✖</button>
    </div>
    <label>Preset Name<input id="preset_name" placeholder="Enter preset name" style="width:100%;margin:4px 0;background:#222;color:#fff;border:1px solid #333;border-radius:4px;padding:4px"></label>
    <label>Search Text<input id="preset_searchText" placeholder="Enter search text" style="width:100%;margin:4px 0;background:#222;color:#fff;border:1px solid #333;border-radius:4px;padding:4px"></label>
    <label>Radio Value<input id="preset_radioValue" placeholder="Enter radio value" style="width:100%;margin:4px 0;background:#222;color:#fff;border:1px solid #333;border-radius:4px;padding:4px"></label>
    <label>Description<input id="preset_deskripsi" placeholder="Enter description" style="width:100%;margin:4px 0;background:#222;color:#fff;border:1px solid #333;border-radius:4px;padding:4px"></label>
    <div style="display:flex;gap:8px;margin-top:10px">
      <button id="preset_save" style="flex:1;background:#007bff;color:#fff;border:none;border-radius:6px;padding:6px">Save Preset</button>
      <button id="preset_cancel" style="flex:1;background:#6c757d;color:#fff;border:none;border-radius:6px;padding:6px">Cancel</button>
    </div>
  `;
  document.body.appendChild(presetPopup);

  document.getElementById('closePresetPopup').onclick = togglePresetPopup;
  document.getElementById('preset_cancel').onclick = togglePresetPopup;
  document.getElementById('preset_save').onclick = () => {
    const name = preset_name.value.trim();
    const searchText = preset_searchText.value.trim();
    const radioValue = preset_radioValue.value.trim();
    const deskripsi = preset_deskripsi.value.trim();

    if (!name || !searchText || !radioValue || !deskripsi) {
      showTempNotice('All fields are required');
      return;
    }

    const newPreset = addPreset({ name, searchText, radioValue, deskripsi });
    togglePresetPopup();
    updatePresetSelect(); // Update dropdown di settings

    // Auto-apply the new preset in settings
    setTimeout(() => {
      if (settingsPopup) {
        const presetSelect = document.getElementById('rf_presetSelect');
        if (presetSelect) {
          presetSelect.value = newPreset.id;
          // Trigger change event to apply the preset
          presetSelect.dispatchEvent(new Event('change'));
        }
      }
    }, 100);

    showTempNotice(`Preset "${name}" added and applied`);

    // Clear form fields
    document.getElementById('preset_name').value = '';
    document.getElementById('preset_searchText').value = '';
    document.getElementById('preset_radioValue').value = '';
    document.getElementById('preset_deskripsi').value = '';
  };
}

function updatePresetSelect() {
  const presets = loadPresets();
  const presetSelect = document.getElementById('rf_presetSelect');
  if (!presetSelect) return;

  // Clear existing options
  presetSelect.innerHTML = '';

  // Add default option
  const defaultOption = document.createElement('option');
  defaultOption.value = '';
  defaultOption.textContent = '-- Select Preset --';
  presetSelect.appendChild(defaultOption);

  // Add presets
  presets.forEach(preset => {
    const option = document.createElement('option');
    option.value = preset.id;
    option.textContent = preset.name;
    presetSelect.appendChild(option);
  });
}

function toggleRunSettingsPopup() {
  if (settingsPopup) { settingsPopup.remove(); settingsPopup = null; return; }

  const s = loadRunSettings();
  settingsPopup = document.createElement('div');
  Object.assign(settingsPopup.style, {
    position: 'fixed', bottom: '100px', left: '160px', background: '#111', color: '#fff',
    padding: '14px', borderRadius: '10px', width: '360px', zIndex: 11000, boxShadow: '0 4px 14px rgba(0,0,0,0.5)'
  });

  settingsPopup.innerHTML = `
    <div style="display:flex;justify-content:space-between;margin-bottom:8px">
      <strong>RunFilling Settings</strong>
      <button id="closeRunSettings" style="background:none;border:none;color:#fff;cursor:pointer">✖</button>
    </div>

    <!-- Preset Selection -->
    <label>Preset Selection
      <div style="display:flex;gap:8px;margin:4px 0">
        <select id="rf_presetSelect" style="flex:1;background:#222;color:#fff;border:1px solid #333;border-radius:4px;padding:4px">
          <option value="">-- Select Preset --</option>
        </select>
        <button id="rf_addPreset" style="background:#007bff;color:#fff;border:none;border-radius:4px;padding:4px 8px;cursor:pointer">+</button>
        <button id="rf_deletePreset" style="background:#dc3545;color:#fff;border:none;border-radius:4px;padding:4px 8px;cursor:pointer">-</button>
      </div>
    </label>

    <!-- CSV Import/Export -->
    <label>CSV Import/Export
      <div style="margin:4px 0">
        <input id="rf_csvUrl" placeholder="GitHub CSV URL (e.g., raw.githubusercontent.com/user/repo/main/presets.csv)"
          value="${escapeHtml(s.csvUrl || '')}"
          style="width:100%;margin-bottom:4px;background:#222;color:#fff;border:1px solid #333;border-radius:4px;padding:4px">

        <!-- Hidden file input for local CSV import -->
        <input type="file" id="rf_csvFile" accept=".csv" style="display:none">

        <div style="display:flex;gap:4px">
          <button id="rf_syncCsv" style="flex:1;background:#17a2b8;color:#fff;border:none;border-radius:4px;padding:4px 8px;cursor:pointer">🔄 Sync</button>
          <button id="rf_importCsv" style="flex:1;background:#28a745;color:#fff;border:none;border-radius:4px;padding:4px 8px;cursor:pointer">📁 Import</button>
          <button id="rf_exportCsv" style="flex:1;background:#6f42c1;color:#fff;border:none;border-radius:4px;padding:4px 8px;cursor:pointer">📥 Export</button>
          <button id="rf_resetPresets" style="flex:1;background:#dc3545;color:#fff;border:none;border-radius:4px;padding:4px 8px;cursor:pointer">🗑️ Reset</button>
        </div>
        <div style="font-size:11px;color:#888;margin-top:4px">Sync: GitHub | Import: Local File | Export: Download | Reset: Clear Presets</div>
      </div>
    </label>

    <label>Search Text<input id="rf_searchText" value="${escapeHtml(s.searchText)}" style="width:100%;margin:4px 0;background:#222;color:#fff;border:1px solid #333;border-radius:4px;padding:4px"></label>
    <label>Radio Value<input id="rf_radioValue" value="${escapeHtml(s.radioValue)}" style="width:100%;margin:4px 0;background:#222;color:#fff;border:1px solid #333;border-radius:4px;padding:4px"></label>
    <label>Deskripsi<input id="rf_deskripsi" value="${escapeHtml(s.deskripsi)}" style="width:100%;margin:4px 0;background:#222;color:#fff;border:1px solid #333;border-radius:4px;padding:4px"></label>
    <div style="display:flex;gap:8px">
      <label style="flex:1">Current<input id="rf_currentdate" value="${s.currentdate}" style="width:100%;margin:4px 0;background:#222;color:#fff;border:1px solid #333;border-radius:4px;padding:4px"></label>
      <label style="flex:1">Target<input id="rf_targetDate" value="${s.targetDate}" style="width:100%;margin:4px 0;background:#222;color:#fff;border:1px solid #333;border-radius:4px;padding:4px"></label>
    </div>
    <div style="display:flex;gap:8px;margin-bottom:8px">
      <label style="flex:1">Jam<input id="rf_targetjam" value="${s.targetjam}" style="width:100%;margin:4px 0;background:#222;color:#fff;border:1px solid #333;border-radius:4px;padding:4px"></label>
      <label style="flex:1">Menit<input id="rf_targetmenit" value="${s.targetmenit}" style="width:100%;margin:4px 0;background:#222;color:#fff;border:1px solid #333;border-radius:4px;padding:4px"></label>
    </div>
    <label style="display:block;margin-bottom:4px">Counter Start Value<input type="number" id="rf_counterStart" value="${s.currentCounter}" min="1" style="width:100%;margin:4px 0;background:#222;color:#fff;border:1px solid #333;border-radius:4px;padding:4px"></label>

    <div style="margin:8px 0;padding:8px;background:#1a1a1a;border-radius:4px">
      <strong style="display:block;margin-bottom:6px">Upload Options</strong>
      <label><input type="checkbox" id="rf_uploadNow" ${s.uploadNow?'checked':''}> Upload Now (skip scheduling)</label><br>
      <label><input type="checkbox" id="rf_autoUpload" ${s.autoUpload?'checked':''}> Auto Upload (click Post button)</label>
    </div>

    <div style="margin:8px 0;padding:8px;background:#1a1a1a;border-radius:4px">
      <strong style="display:block;margin-bottom:6px">Auto Increase Options</strong>
      <label><input type="checkbox" id="rf_increaseDate" ${s.increaseDate?'checked':''}> Increase Date (+1 day)</label><br>
      <label><input type="checkbox" id="rf_increaseHours" ${s.increaseHours?'checked':''}> Increase Time</label><br>
      <div style="margin-left:20px;margin-top:4px;display:flex;gap:8px">
        <label style="flex:1">Hours<input type="number" id="rf_increaseHoursAmount" value="${s.increaseHoursAmount||2}" min="0" max="23" style="width:100%;margin:2px 0;background:#222;color:#fff;border:1px solid #333;border-radius:4px;padding:4px"></label>
        <label style="flex:1">Minutes<input type="number" id="rf_increaseMinutesAmount" value="${s.increaseMinutesAmount||0}" min="0" max="59" style="width:100%;margin:2px 0;background:#222;color:#fff;border:1px solid #333;border-radius:4px;padding:4px"></label>
      </div>
      <div style="font-size:11px;color:#888;margin-top:4px">Example: 1h 40m = Next time +1:40</div>
    </div>

    <div style="display:flex;gap:8px;margin-top:10px">
      <button id="rf_save" style="flex:1;background:#28a745;color:#fff;border:none;border-radius:6px;padding:6px">Save</button>
      <button id="rf_reset" style="flex:1;background:#6c757d;color:#fff;border:none;border-radius:6px;padding:6px">Reset Settings</button>
    </div>
  `;
  document.body.appendChild(settingsPopup);

  // Update preset dropdown
  updatePresetSelect();

  // Event listeners
  document.getElementById('closeRunSettings').onclick = toggleRunSettingsPopup;
  document.getElementById('rf_addPreset').onclick = togglePresetPopup;

  document.getElementById('rf_deletePreset').onclick = () => {
    const presetSelect = document.getElementById('rf_presetSelect');
    const selectedId = presetSelect.value;
    if (!selectedId) {
      showTempNotice('Select a preset to delete');
      return;
    }

    deletePreset(selectedId);
    updatePresetSelect();
    showTempNotice('Preset deleted');
  };

  document.getElementById('rf_presetSelect').onchange = (e) => {
    const selectedId = e.target.value;
    if (selectedId && applyPreset(selectedId)) {
      showTempNotice('Preset applied');
    }
  };

  // CSV event listeners
  document.getElementById('rf_syncCsv').onclick = async () => {
    const csvUrl = document.getElementById('rf_csvUrl').value.trim();
    if (!csvUrl) {
      showTempNotice('Please enter GitHub CSV URL');
      return;
    }

    // Save URL to settings
    const settings = loadRunSettings();
    settings.csvUrl = csvUrl;
    saveRunSettings(settings);

    await syncPresetsFromGitHub();
  };

  document.getElementById('rf_importCsv').onclick = () => {
    document.getElementById('rf_csvFile').click();
  };

  document.getElementById('rf_exportCsv').onclick = () => {
    exportPresetsToCsv();
  };

  document.getElementById('rf_csvFile').onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.csv')) {
      showTempNotice('Please select a CSV file');
      return;
    }

    try {
      showTempNotice('Reading CSV file...', 0);

      const csvText = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsText(file);
      });

      showTempNotice('Importing presets...', 0);
      const success = importPresetsFromCsv(csvText);

      if (success) {
        updatePresetSelect();
        showTempNotice('CSV file imported successfully', 2000);
      } else {
        showTempNotice('Failed to import CSV file', 2000);
      }

      // Clear the file input
      e.target.value = '';

    } catch (error) {
      console.error('Error importing CSV file:', error);
      showTempNotice('Error: ' + error.message, 3000);
      // Clear the file input
      e.target.value = '';
    }
  };

  // Create sample CSV function (still available for future use)
  function createSampleCsv() {
    const sampleData = [
      {
        name: 'Tutorial Excel',
        searchText: 'Excel',
        radioValue: 'Tutorial Excel Lengkap',
        deskripsi: 'Belajar Excel dengan mudah dan cepat'
      },
      {
        name: 'Tutorial Word',
        searchText: 'Word',
        radioValue: 'Tutorial Word Pemula',
        deskripsi: 'Panduan lengkap untuk belajar Microsoft Word'
      },
      {
        name: 'Tutorial PowerPoint',
        searchText: 'PowerPoint',
        radioValue: 'Tutorial PowerPoint Keren',
        deskripsi: 'Buat presentasi yang menarik dengan PowerPoint'
      }
    ];

    const csvContent = presetsToCsv(sampleData);
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_tiktok_presets.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    showTempNotice('Sample CSV downloaded');
  }

  // Reset Presets event listener
  document.getElementById('rf_resetPresets').onclick = () => {
    if (resetAllPresets()) {
      // Optional: Clear any selected preset in dropdown
      const presetSelect = document.getElementById('rf_presetSelect');
      if (presetSelect) {
        presetSelect.value = '';
      }
    }
  };

  document.getElementById('rf_save').onclick = () => {
    const newS = {
      searchText: rf_searchText.value.trim() || defaultSettings.searchText,
      radioValue: rf_radioValue.value.trim() || defaultSettings.radioValue,
      deskripsi: rf_deskripsi.value.trim() || defaultSettings.deskripsi,
      currentdate: rf_currentdate.value.trim(),
      targetDate: rf_targetDate.value.trim(),
      targetjam: rf_targetjam.value.trim(),
      targetmenit: rf_targetmenit.value.trim(),
      increaseDate: rf_increaseDate.checked,
      increaseHours: rf_increaseHours.checked,
      autoUpload: rf_autoUpload.checked,
      uploadNow: rf_uploadNow.checked,
      increaseHoursAmount: parseInt(rf_increaseHoursAmount.value, 10) || 0,
      increaseMinutesAmount: parseInt(rf_increaseMinutesAmount.value, 10) || 0,
      counterStart: parseInt(rf_counterStart.value, 10) || 1,
      currentCounter: parseInt(rf_counterStart.value, 10) || 1, // reset currentCounter saat save
      selectedPreset: rf_presetSelect.value,
      csvUrl: rf_csvUrl.value.trim()
    };
    saveRunSettings(newS);
    updateCounterDisplay(); // update tampilan counter
    toggleRunSettingsPopup();
    showTempNotice('Settings saved');
  };

  document.getElementById('rf_reset').onclick = () => {
    saveRunSettings(defaultSettings);
    updateCounterDisplay(); // update tampilan counter
    toggleRunSettingsPopup();
    showTempNotice('Reset');
  };
}

function updateCounterDisplay() {
  const s = loadRunSettings();
  const counterEl = document.getElementById('rf_counter');
  if (counterEl) {
    counterEl.textContent = `#${s.currentCounter}`;
  }
}



function createRunUI() {
  if (document.getElementById('runFillingPanel')) return;
  const panel = document.createElement('div');
  Object.assign(panel.style, {
    position: 'fixed', bottom: '20px', left: '160px', background: '#111', color: '#fff',
    borderRadius: '8px', padding: '8px', display: 'flex', gap: '8px', alignItems: 'center', zIndex: 12000
  });

  // Counter display
  const s = loadRunSettings();
  const counterDiv = document.createElement('div');
  counterDiv.id = 'rf_counter';
  counterDiv.textContent = `#${s.currentCounter}`;
  Object.assign(counterDiv.style, {
    background: '#222',
    color: '#ffc107',
    padding: '8px 12px',
    borderRadius: '6px',
    fontWeight: 'bold',
    fontSize: '14px',
    minWidth: '50px',
    textAlign: 'center'
  });

  const startBtn = document.createElement('button');
  startBtn.id = 'runFillingStart';
  startBtn.textContent = 'Start';
  Object.assign(startBtn.style, { background:'#007bff', color:'#fff', border:'none', padding:'8px 14px', borderRadius:'6px', cursor:'pointer' });

  const gearBtn = document.createElement('button');
  gearBtn.innerHTML = '⚙';
  Object.assign(gearBtn.style, { background:'transparent', color:'#fff', border:'none', cursor:'pointer', fontSize:'16px' });

  startBtn.onclick = async () => {
    const s = loadRunSettings();
    if (typeof window.runFilling !== 'function') return showTempNotice('runFilling missing');
    showTempNotice(`Running... #${s.currentCounter}`, 0); // Tidak auto-hide

    try {
      // Panggil runFilling dengan parameter autoUpload dan uploadNow
      await window.runFilling({
        searchText: s.searchText,
        radioValue: s.radioValue,
        deskripsi: s.deskripsi,
        currentdate: s.currentdate,
        targetDate: s.targetDate,
        targetjam: s.targetjam,
        targetmenit: s.targetmenit,
        autoUpload: s.autoUpload,
        uploadNow: s.uploadNow
      });

      // increase logic + counter increment - HANYA JIKA SUKSES
      let changed = false;
      const newS = { ...s };

      if (s.increaseDate) {
        const cd = parseYMD(s.currentdate); const td = parseYMD(s.targetDate);
        if (td) { td.setDate(td.getDate()+1); newS.targetDate=formatYMD(td); changed=true; }
      }

      if (s.increaseHours) {
        // NEW: Support flexible hours + minutes increase
        const currentHours = parseInt(s.targetjam, 10);
        const currentMinutes = parseInt(s.targetmenit, 10);
        const increaseHours = parseInt(s.increaseHoursAmount, 10) || 0;
        const increaseMinutes = parseInt(s.increaseMinutesAmount, 10) || 0;

        if (!isNaN(currentHours) && !isNaN(currentMinutes)) {
          // Calculate total minutes
          let totalMinutes = (currentHours * 60) + currentMinutes + (increaseHours * 60) + increaseMinutes;

          // Handle day overflow (24 hour cycle)
          if (totalMinutes >= 24 * 60) {
            totalMinutes = totalMinutes % (24 * 60);
            // Optionally increase date if time wraps around
            if (s.increaseDate) {
              const td = parseYMD(s.targetDate);
              if (td) {
                td.setDate(td.getDate() + 1);
                newS.targetDate = formatYMD(td);
              }
            }
          }

          // Convert back to hours and minutes
          const newHours = Math.floor(totalMinutes / 60);
          const newMinutes = totalMinutes % 60;

          if (newHours > 21) {
                newHours = 8;
                // Increase date by 1 day when resetting to 08:00
                const td = parseYMD(newS.targetDate);
                if (td) {
                  td.setDate(td.getDate() + 1);
                  newS.targetDate = formatYMD(td);
                }
              }

          newS.targetjam = String(newHours).padStart(2, '0');
          newS.targetmenit = String(newMinutes).padStart(2, '0');
          changed = true;
        }
      }

      // Increment counter setelah proses selesai
      newS.currentCounter = s.currentCounter + 1;
      changed = true;

      if (changed) {
        saveRunSettings(newS);
        updateCounterDisplay(); // update tampilan counter
        showTempNotice('✅ Success - Next: #' + newS.currentCounter, 2000); // Hilang setelah 2 detik
      } else {
        showTempNotice('Done!', 1400);
      }
    } catch (err) {
      console.error('❌ Error during runFilling:', err);
      showTempNotice('❌ Error - No settings changed', 2000);
      // IMPORTANT: Tidak ada perubahan settings jika error
      // Counter dan time tidak increase jika gagal
    }
  };

  gearBtn.onclick = toggleRunSettingsPopup;

  panel.append(counterDiv, startBtn, gearBtn);
  document.body.appendChild(panel);

  // keyboard shortcuts
  document.addEventListener('keydown', e => {
    const active = document.activeElement;
    const typing = active && /INPUT|TEXTAREA/.test(active.tagName);
    if (!typing && e.code === 'Space') {
      e.preventDefault(); startBtn.click();
    }
    if (!typing && (e.code === 'ShiftLeft' || e.code === 'ShiftRight')) {
      e.preventDefault();
      const s = loadRunSettings();
      if (s.autoUpload) triggerAutoUpload();
      else showTempNotice('AutoUpload disabled');
    }
  });
}

try { createRunUI(); } catch(e){ console.error(e); }

})();