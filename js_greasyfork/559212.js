// ==UserScript==
// @name         Autofill Tiktok Multi-Product 
// @version      1.2
// @description  Autofill Tiktok with Multi-Product Support + CSV Sync
// @match        https://www.tiktok.com/*
// @grant        GM_xmlhttpRequest
// @run-at       document-idle
// @namespace https://greasyfork.org/users/1388863
// @downloadURL https://update.greasyfork.org/scripts/559212/Autofill%20Tiktok%20Multi-Product.user.js
// @updateURL https://update.greasyfork.org/scripts/559212/Autofill%20Tiktok%20Multi-Product.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const rand = (min, max) => Math.random() * (max - min) + min;
  const sleepRandom = (min = 1000, max = 1500) => sleep(rand(min, max));

  // ===== FUNGSI UTAMA: runFilling untuk 1 produk =====
  async function runFillingForOneProduct({
    searchText = 'Office',
    radioValue = 'Panduan Cepat Kuasai Microsoft Office',
    deskripsi = 'belajar office dengan mudah',
    productIndex = 1
  } = {}) {
    console.log(`🚀 runFilling Product ${productIndex}:`, {searchText, radioValue, deskripsi});

    try {
      function safeClick(el) {
        if (!el) return false;
        try {
          try { if (el.getAttribute && el.getAttribute('aria-disabled') === 'true') el.setAttribute('aria-disabled', 'false'); } catch(e){}
          try { if (el.disabled) el.disabled = false; } catch(e){}
          el.click();
          return true;
        } catch (err) {
          try {
            ['mouseover','mousedown','mouseup','click'].forEach(type => {
              el.dispatchEvent(new MouseEvent(type, { bubbles: true, cancelable: true }))
            });
            return true;
          } catch (err2) {
            console.warn('safeClick failed', err, err2);
            return false;
          }
        }
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

      console.log(`📋 Product ${productIndex}: Starting filling process...`);

      // 1) Add (first)
      try {
        const addBtn1 = findAddButton();
        if (addBtn1) {
          const ok = safeClick(addBtn1);
          console.log(`🖱️ Product ${productIndex}: Add (first) clicked?`, !!ok);
        } else {
          console.warn(`⚠️ Product ${productIndex}: Add (first) not found`);
        }
      } catch (e) { console.warn('Error clicking Add (first)', e); }
      await sleepRandom();

      // 2) Next (first)
      try {
        const ok = clickButtonExact('Next');
        console.log(`🖱️ Product ${productIndex}: Next (first) clicked?`, !!ok);
      } catch (e) { console.warn('Error clicking Next (first)', e); }
      await sleepRandom();

      // 3) Fill search input
      try {
        const input = document.querySelector('input.TUXTextInputCore-input[placeholder="Search products"]');
        if (!input) { console.warn(`❌ Product ${productIndex}: search input not found`); return false; }
        const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        if (setter) setter.call(input, searchText); else input.value = searchText;
        input.dispatchEvent(new Event('input',{bubbles:true}));
        input.dispatchEvent(new Event('change',{bubbles:true}));
        console.log(`⌨️ Product ${productIndex}: search filled:`, searchText);
      } catch (e) { console.warn('Error filling search', e); return false; }
      await sleepRandom();

      // 4) Press Enter on search
      try {
        const input = document.querySelector('input.TUXTextInputCore-input[placeholder="Search products"]');
        if (input) {
          const enterOpts = { bubbles: true, cancelable: true, key: 'Enter', code: 'Enter', keyCode: 13, which: 13 };
          ['keydown','keypress','keyup'].forEach(ev => input.dispatchEvent(new KeyboardEvent(ev, enterOpts)));
          console.log(`↩️ Product ${productIndex}: Enter dispatched on search input`);
        }
      } catch (e) { console.warn('Error dispatching Enter', e); }
      await sleepRandom();

      // 5) Select radio
      try {
        let radio = null;
        try {
          const safeVal = radioValue.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
          radio = document.querySelector(`input[type="radio"][value="${safeVal}"]`);
          if (!radio) {
            radio = document.querySelector(`input[type="radio"][name="${safeVal}"]`);
          }
          if (radio) {
            console.log(`✅ Product ${productIndex}: Radio found via direct selector!`);
          }
        } catch (errSel) {
          console.warn('Direct selector check failed:', errSel);
        }

        if (!radio) {
          console.log(`⚠️ Product ${productIndex}: Direct selector failed, trying robust search...`);

          function normalizeForCompare(s) {
            if (s == null) return '';
            return String(s).replace(/\u00A0/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase();
          }

          function findRadioByValueRobust(targetValue) {
            const normalizedTarget = normalizeForCompare(targetValue);
            const candidates = Array.from(document.querySelectorAll('input[type="radio"].TUXRadioStandalone-input, input[type="radio"]'));

            let found = candidates.find(el => normalizeForCompare(el.value) === normalizedTarget);
            if (found) return found;

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
          console.warn(`❌ Product ${productIndex}: radio not found (all methods):`, radioValue);
          return false;
        }

        radio.click();
        try {
          radio.checked = true;
        } catch (e) {}
        radio.dispatchEvent(new Event('input', { bubbles: true }));
        radio.dispatchEvent(new Event('change', { bubbles: true }));

        console.log(`✅ Product ${productIndex}: radio selected:`, radioValue);
      } catch (e) { console.warn('Error selecting radio', e); return false; }
      await sleepRandom();

      // 6) Next (second)
      try {
        console.log(`🔘 Product ${productIndex}: Finding Next (second) via code2 logic...`);
        const footer = document.querySelector('.common-modal-footer');
        let nextBtn = (footer && footer.querySelector('.TUXButton--primary')) || document.querySelector('button.TUXButton--primary');
        if (!nextBtn) {
          nextBtn = Array.from(document.querySelectorAll('button, [role="button"], .TUXButton'))
            .find(b => (b.textContent || '').trim().toLowerCase().includes('next'));
        }
        if (!nextBtn) { console.warn(`❌ Product ${productIndex}: Next (second) not found`); return false; }
        const ok = safeClick(nextBtn);
        console.log(`🖱️ Product ${productIndex}: Next (second) clicked?`, !!ok, {text: (nextBtn.textContent||'').trim(), classes: nextBtn.className});
      } catch (e) { console.warn('Error clicking Next (second)', e); return false; }
      await sleepRandom();

      // 7) Fill description
      try {
        let descInput = document.querySelector('input.TUXTextInputCore-input#\\:r2hi\\:')
          || Array.from(document.querySelectorAll('input.TUXTextInputCore-input')).find(el => (el.value || '').includes('Panduan Cepat Kuasai Microsoft'))
          || document.querySelector('.TUXTextInputCore input.TUXTextInputCore-input');
        if (!descInput) { console.warn(`❌ Product ${productIndex}: description input not found`); return false; }
        const setter2 = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        const old = descInput.value;
        if (setter2) setter2.call(descInput, deskripsi); else descInput.value = deskripsi;
        descInput.dispatchEvent(new Event('input',{bubbles:true}));
        descInput.dispatchEvent(new Event('change',{bubbles:true}));
        console.log(`📝 Product ${productIndex}: description set:`, {from: old, to: deskripsi});
      } catch (e) { console.warn('Error filling description', e); return false; }
      await sleepRandom();

      // 8) Add (final)
      try {
        const addBtn2 = findAddButton();
        if (addBtn2) {
          const ok = safeClick(addBtn2);
          console.log(`🖱️ Product ${productIndex}: Add (final) clicked?`, !!ok, addBtn2 && {text: (addBtn2.textContent||'').trim(), classes: addBtn2.className});
        } else {
          console.warn(`⚠️ Product ${productIndex}: Add (final) not found`);
        }
      } catch (e) { console.warn('Error clicking Add (final)', e); return false; }
      await sleepRandom();

      console.log(`✅ Product ${productIndex}: Filling process complete!`);
      return true;

    } catch (err) {
      console.error(`❌ Product ${productIndex}: runFilling error:`, err);
      return false;
    }
  }

  // ===== FUNGSI WRAPPER: runAutomation untuk multi-product =====
  async function runAutomation({
    products = [],
    currentdate = "2025-11-12",
    targetDate = "2025-11-13",
    targetjam = "21",
    targetmenit = "00",
    autoUpload = false,
    uploadNow = false
  } = {}) {
    console.log('🎬 runAutomation started with', products.length, 'products');

    try {
      // Loop through all products
      for (let i = 0; i < products.length; i++) {
        const product = products[i];
        const productIndex = i + 1;

        console.log(`\n🔄 Processing Product ${productIndex}/${products.length}`);
        showTempNotice(`Processing Product ${productIndex}/${products.length}`, 0);

        // Run filling for this product
        const success = await runFillingForOneProduct({
          searchText: product.searchText,
          radioValue: product.radioValue,
          deskripsi: product.deskripsi,
          productIndex: productIndex
        });

        if (!success) {
          console.error(`❌ Product ${productIndex} failed, stopping automation`);
          showTempNotice(`❌ Product ${productIndex} failed`, 3000);
          return false;
        }

        // Delay 2 detik sebelum produk berikutnya (kecuali produk terakhir)
        if (i < products.length - 1) {
          console.log(`⏱️ Waiting 2 seconds before next product...`);
          await sleepRandom();
        }
      }

      console.log('\n✅ All products filled successfully!');

      // ===== SCHEDULING/POST NOW (dilakukan sekali setelah semua produk) =====
      if (uploadNow) {
        console.log('\n⚡ Upload Now mode - skipping scheduling...');
        await sleepRandom();
        const postNowRadio = document.querySelector('input[type="radio"][value="post_now"]');
        if (!postNowRadio) {
          console.warn('⚠️ Radio "post_now" tidak ditemukan!');
        } else {
          postNowRadio.click();
          console.log('✅ Radio "post_now" diklik.');
        }
        console.log('✔️ Upload Now mode complete.');
      } else {
        console.log('\n📅 Running scheduling process...');
        await runScheduling({currentdate, targetDate, targetjam, targetmenit});
        console.log('✔️ Scheduling complete.');
      }

      // ===== AUTO UPLOAD (jika enabled) =====
      if (autoUpload) {
        await triggerAutoUpload();
      }

      console.log('\n🎉 runAutomation COMPLETE!');
      showTempNotice('✅ Automation Complete!', 2000);
      return true;

    } catch (err) {
      console.error('❌ runAutomation error:', err);
      showTempNotice('❌ Automation Error', 3000);
      return false;
    }
  }

  // ===== FUNGSI SCHEDULING (dipanggil sekali setelah semua produk) =====
  async function runScheduling({currentdate, targetDate, targetjam, targetmenit}) {
    const randDelay = async (min = 200, max = 500) => sleep(rand(min, max));

    // Klik radio "schedule"
    await randDelay();
    const scheduleRadio = document.querySelector('input[type="radio"][value="schedule"]');
    if (!scheduleRadio) {
      console.warn('Radio "schedule" tidak ditemukan!');
    } else {
      scheduleRadio.click();
      console.log('✅ Radio "schedule" diklik.');
    }

    await randDelay();

    // Pilih tanggal
    const dateInputSelector = `input[readonly][value="${currentdate}"]`;
    let dateInput = document.querySelector(dateInputSelector);
    if (!dateInput) {
      dateInput = document.querySelector('input[readonly].TUXTextInputCore-input') || document.querySelector('input[readonly]');
    }
    if (!dateInput) {
      console.warn(`Input tanggal dengan value "${currentdate}" tidak ditemukan.`);
    } else {
      dateInput.click();
      console.log(`✅ Input tanggal (currentValue="${currentdate}") diklik.`);
    }

    await randDelay();

    // Parse dates
    const [tY, tM, tD] = targetDate.split('-').map(Number);
    const [cY, cM] = currentdate.split('-').map(Number);
    const diff = (tY - cY) * 12 + (tM - cM);

    await randDelay();

    // Navigate months
    const arrows = document.querySelectorAll('.jsx-1793871833.arrow');
    if (arrows && arrows.length >= 2) {
      const arrowToClick = diff > 0 ? arrows[1] : arrows[0];
      const steps = Math.abs(diff);
      for (let i = 0; i < steps; i++) {
        await randDelay();
        arrowToClick.click();
        console.log(`⤴︎ Navigasi bulan (${i + 1}/${steps})`);
      }
    }

    await randDelay();

    // Pilih hari
    const dayEls = Array.from(document.querySelectorAll('span.day.valid, td.day:not(.disabled), button.day, .datepicker-day, .react-datepicker__day'))
      .filter(el => el.textContent && el.textContent.trim() === String(tD));
    if (dayEls.length > 0) {
      const targetDay = dayEls.find(el => el.offsetParent !== null) || dayEls[0];
      await randDelay();
      targetDay.click();
      console.log(`✅ Tanggal ${targetDate} dipilih.`);
    } else {
      console.warn(`⚠️ Elemen hari "${tD}" tidak ditemukan.`);
    }

    await randDelay();

    // Pilih jam & menit
    function clickOptionByText(side, text) {
      const sel = `.tiktok-timepicker-option-text.tiktok-timepicker-${side}`;
      const els = Array.from(document.querySelectorAll(sel));
      const target = els.find(el => (el.textContent || '').trim() === text);
      if (!target) return null;
      try {
        target.click();
      } catch (e) {
        ['mousedown','mouseup','click'].forEach(type => {
          target.dispatchEvent(new MouseEvent(type, { bubbles: true, cancelable: true }))
        });
      }
      return target;
    }

    await randDelay();
    const jamEl = clickOptionByText('left', String(targetjam));
    if (jamEl) {
      console.log(`✅ Jam "${targetjam}" dipilih.`);
    } else {
      console.warn(`⚠️ Opsi jam "${targetjam}" tidak ditemukan.`);
    }

    await randDelay();
    const menitEl = clickOptionByText('right', String(targetmenit));
    if (menitEl) {
      console.log(`✅ Menit "${targetmenit}" dipilih.`);
    } else {
      console.warn(`⚠️ Opsi menit "${targetmenit}" tidak ditemukan.`);
    }
  }

  async function triggerAutoUpload() {
    try {
      const delayBeforeUpload = rand(500, 1000);
      console.log(`⏱️ Waiting ${Math.round(delayBeforeUpload)}ms before AutoUpload...`);
      await sleep(delayBeforeUpload);

      const postButton = document.querySelector('button[data-e2e="post_video_button"]');
      if (postButton) {
        postButton.click();
        console.log('🖱️ post_video_button clicked');
      } else {
        console.warn('❌ post_video_button not found');
      }

      const delay2 = rand(500, 1000);
      console.log(`⏱️ Waiting ${Math.round(delay2)}ms before clicking "Post now"...`);
      await sleep(delay2);

      const buttons = document.querySelectorAll('button.TUXButton');
      const targetButton = Array.from(buttons).find(btn => (btn.textContent || '').trim() === 'Post now');
      if (targetButton) {
        targetButton.click();
        console.log('✅ "Post now" clicked');
      } else {
        console.warn('❌ "Post now" not found');
      }
    } catch (errAuto) {
      console.error('Error during autoUpload', errAuto);
    }
  }

  // Expose to window
  window.runAutomation = runAutomation;

  /* ============================
     UI + localStorage + Multi-Product Management
     ============================ */

  const LS_KEY = 'runFillingSettings';
  const PRESETS_KEY = 'runFillingPresets';
  const CSV_URL_KEY = 'csvUrl';

  const defaultSettings = {
    totalProduct: 1,
    products: [
      {
        searchText: 'Office',
        radioValue: 'Panduan Cepat Kuasai Microsoft Office',
        deskripsi: 'belajar office dengan mudah'
      }
    ],
    currentdate: "2025-11-12",
    targetDate: "2025-11-13",
    targetjam: "21",
    targetmenit: "00",
    increaseDate: false,
    increaseHours: false,
    autoUpload: false,
    uploadNow: false,
    increaseHoursAmount: 2,
    increaseMinutesAmount: 0,
    counterStart: 1,
    currentCounter: 1,
    selectedPreset: '',
    csvUrl: ''
  };

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
        position: 'fixed',
        left: '20px',
        bottom: '60px',
        zIndex: 13000,
        padding: '10px 12px',
        background: '#007bff',
        color: '#fff',
        borderRadius: '4px',
        fontSize: '12px',
        opacity: '0',
        transition: 'opacity 0.3s ease',
        boxShadow: '0 4px 12px rgba(0, 123, 255, 0.3)',
        maxWidth: '220px',
        fontWeight: '500'
      });
      document.body.appendChild(el);
    }

    if (noticeTimeout) {
      clearTimeout(noticeTimeout);
      noticeTimeout = null;
    }

    el.textContent = text;
    el.style.opacity = '1';

    if (ms > 0) {
      noticeTimeout = setTimeout(() => {
        el.style.opacity = '0';
        noticeTimeout = null;
      }, ms);
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

  let settingsPopup = null;

  function updateCounterDisplay() {
    const s = loadRunSettings();
    const counterEl = document.getElementById('rf_counter');
    if (counterEl) {
      counterEl.textContent = `#${s.currentCounter}`;
    }
  }

  function toggleRunSettingsPopup() {
    if (settingsPopup) {
      settingsPopup.remove();
      settingsPopup = null;
      return;
    }

    const s = loadRunSettings();
    settingsPopup = document.createElement('div');
    Object.assign(settingsPopup.style, {
      position: 'fixed',
      bottom: '80px',
      left: '20px',
      background: '#1a1a1a',
      color: '#fff',
      borderRadius: '6px',
      padding: '16px',
      width: '380px',
      maxHeight: '600px',
      overflowY: 'auto',
      zIndex: 11000,
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
      border: '1px solid #333'
    });

    settingsPopup.innerHTML = `
      <div style="display:flex;justify-content:space-between;margin-bottom:16px">
        <strong style="font-size:18px">Multi-Product Settings</strong>
        <button id="closeRunSettings" style="background:none;border:none;color:#fff;cursor:pointer;font-size:20px;padding:0">✖</button>
      </div>

      <!-- Total Product Input -->
      <div style="margin-bottom:16px">
        <label style="display:block;margin-bottom:8px">
          <span style="display:block;font-size:13px;color:#aaa;margin-bottom:4px">Total Product</span>
          <input type="number" id="rf_totalProduct" value="${s.totalProduct}" min="1" max="10"
            style="width:100%;background:#2d2d2d;color:#fff;border:1px solid #444;border-radius:4px;padding:8px;font-size:13px">
        </label>
        <button id="rf_updateProductCards" style="width:100%;background:#007bff;color:#fff;border:none;border-radius:4px;padding:8px;cursor:pointer;font-size:13px;font-weight:600;margin-top:4px">
          Update Product Cards
        </button>
      </div>

      <!-- Product Cards Container -->
      <div id="rf_productCardsContainer" style="margin-bottom:16px">
      </div>

      <!-- Scheduling Settings -->
      <div style="margin-bottom:16px;padding:12px;background:#2d2d2d;border-radius:4px">
        <strong style="display:block;margin-bottom:8px;font-size:14px">Scheduling</strong>

        <div style="display:flex;gap:8px;margin-bottom:8px">
          <label style="flex:1">
            <span style="display:block;font-size:11px;color:#aaa;margin-bottom:2px">Current Date</span>
            <input id="rf_currentdate" value="${s.currentdate}"
              style="width:100%;background:#1a1a1a;color:#fff;border:1px solid #444;border-radius:4px;padding:6px;font-size:12px">
          </label>
          <label style="flex:1">
            <span style="display:block;font-size:11px;color:#aaa;margin-bottom:2px">Target Date</span>
            <input id="rf_targetDate" value="${s.targetDate}"
              style="width:100%;background:#1a1a1a;color:#fff;border:1px solid #444;border-radius:4px;padding:6px;font-size:12px">
          </label>
        </div>

        <div style="display:flex;gap:8px;margin-bottom:8px">
          <label style="flex:1">
            <span style="display:block;font-size:11px;color:#aaa;margin-bottom:2px">Hour</span>
            <input id="rf_targetjam" value="${s.targetjam}"
              style="width:100%;background:#1a1a1a;color:#fff;border:1px solid #444;border-radius:4px;padding:6px;font-size:12px">
          </label>
          <label style="flex:1">
            <span style="display:block;font-size:11px;color:#aaa;margin-bottom:2px">Minute</span>
            <input id="rf_targetmenit" value="${s.targetmenit}"
              style="width:100%;background:#1a1a1a;color:#fff;border:1px solid #444;border-radius:4px;padding:6px;font-size:12px">
          </label>
        </div>

        <label style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
          <input type="checkbox" id="rf_uploadNow" ${s.uploadNow?'checked':''} style="width:16px;height:16px">
          <span style="font-size:12px">Upload Now (skip scheduling)</span>
        </label>

        <label style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
          <input type="checkbox" id="rf_autoUpload" ${s.autoUpload?'checked':''} style="width:16px;height:16px">
          <span style="font-size:12px">Auto Upload</span>
        </label>

        <label style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
          <input type="checkbox" id="rf_increaseDate" ${s.increaseDate?'checked':''} style="width:16px;height:16px">
          <span style="font-size:12px">Increase Date (+1 day)</span>
        </label>

        <label style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
          <input type="checkbox" id="rf_increaseHours" ${s.increaseHours?'checked':''} style="width:16px;height:16px">
          <span style="font-size:12px">Increase Time</span>
        </label>

        <div style="display:flex;gap:8px;margin-bottom:8px">
          <label style="flex:1">
            <span style="display:block;font-size:11px;color:#aaa;margin-bottom:2px">+ Hours</span>
            <input type="number" id="rf_increaseHoursAmount" value="${s.increaseHoursAmount||2}" min="0" max="23"
              style="width:100%;background:#1a1a1a;color:#fff;border:1px solid #444;border-radius:4px;padding:6px;font-size:12px">
          </label>
          <label style="flex:1">
            <span style="display:block;font-size:11px;color:#aaa;margin-bottom:2px">+ Minutes</span>
            <input type="number" id="rf_increaseMinutesAmount" value="${s.increaseMinutesAmount||0}" min="0" max="59"
              style="width:100%;background:#1a1a1a;color:#fff;border:1px solid #444;border-radius:4px;padding:6px;font-size:12px">
          </label>
        </div>

        <div style="font-size:10px;color:#888;margin-bottom:8px">
          Example: 1h 40m = Next time +1:40<br>
          ⚠️ Time > 21:xx resets to 08:00 next day
        </div>
      </div>

      <!-- Counter -->
      <div style="margin-bottom:16px">
        <label style="display:block">
          <span style="display:block;font-size:11px;color:#aaa;margin-bottom:4px">Counter</span>
          <input type="number" id="rf_counterStart" value="${s.currentCounter}" min="1"
            style="width:100%;background:#2d2d2d;color:#fff;border:1px solid #444;border-radius:4px;padding:8px;font-size:13px">
        </label>
      </div>

      <!-- Action Buttons -->
      <div style="display:flex;gap:8px">
        <button id="rf_saveSettings" style="flex:1;background:#28a745;color:#fff;border:none;border-radius:4px;padding:10px;cursor:pointer;font-size:13px;font-weight:600">
          Save Settings
        </button>
        <button id="rf_runAutomation" style="flex:1;background:#007bff;color:#fff;border:none;border-radius:4px;padding:10px;cursor:pointer;font-size:13px;font-weight:600" disabled>
          Run Automation
        </button>
      </div>
    `;

    document.body.appendChild(settingsPopup);

    // Render initial product cards
    renderProductCards();

    // Event Listeners
    document.getElementById('closeRunSettings').onclick = toggleRunSettingsPopup;

    document.getElementById('rf_updateProductCards').onclick = () => {
      const totalProduct = parseInt(document.getElementById('rf_totalProduct').value, 10);
      if (isNaN(totalProduct) || totalProduct < 1) {
        showTempNotice('Invalid Total Product', 2000);
        return;
      }
      const s = loadRunSettings();
      s.totalProduct = totalProduct;

      // Adjust products array
      while (s.products.length < totalProduct) {
        s.products.push({
          searchText: '',
          radioValue: '',
          deskripsi: ''
        });
      }
      while (s.products.length > totalProduct) {
        s.products.pop();
      }

      saveRunSettings(s);
      renderProductCards();
      showTempNotice(`Updated to ${totalProduct} product(s)`, 2000);
    };

    document.getElementById('rf_saveSettings').onclick = () => {
      toggleRunSettingsPopup();
      saveAllSettings();
      showTempNotice('Settings saved', 2000);
    };

    document.getElementById('rf_runAutomation').onclick = async () => {
      const btn = document.getElementById('rf_runAutomation');
      if (btn.disabled) return;

      const s = loadRunSettings();

      // Collect all product data
      const products = [];
      for (let i = 0; i < s.totalProduct; i++) {
        const searchText = document.getElementById(`rf_product_${i}_searchText`)?.value.trim() || '';
        const radioValue = document.getElementById(`rf_product_${i}_radioValue`)?.value.trim() || '';
        const deskripsi = document.getElementById(`rf_product_${i}_deskripsi`)?.value.trim() || '';
        products.push({ searchText, radioValue, deskripsi });
      }

      // Save before running
      s.products = products;
      saveRunSettings(s);

      // Close popup
      toggleRunSettingsPopup();

      // Run automation
      showTempNotice('Starting automation...', 0);

      try {
        const success = await window.runAutomation({
          products: products,
          currentdate: s.currentdate,
          targetDate: s.targetDate,
          targetjam: s.targetjam,
          targetmenit: s.targetmenit,
          autoUpload: s.autoUpload,
          uploadNow: s.uploadNow
        });

        if (success) {
          // Increase logic + counter increment
          let changed = false;
          const newS = { ...s };

          if (s.increaseDate) {
            const td = parseYMD(s.targetDate);
            if (td) {
              td.setDate(td.getDate() + 1);
              newS.targetDate = formatYMD(td);
              changed = true;
            }
          }

          if (s.increaseHours) {
            const currentHours = parseInt(s.targetjam, 10);
            const currentMinutes = parseInt(s.targetmenit, 10);
            const increaseHours = parseInt(s.increaseHoursAmount, 10) || 0;
            const increaseMinutes = parseInt(s.increaseMinutesAmount, 10) || 0;

            if (!isNaN(currentHours) && !isNaN(currentMinutes)) {
              let totalMinutes = (currentHours * 60) + currentMinutes + (increaseHours * 60) + increaseMinutes;

              // Handle day overflow
              if (totalMinutes >= 24 * 60) {
                totalMinutes = totalMinutes % (24 * 60);
                if (s.increaseDate) {
                  const td = parseYMD(s.targetDate);
                  if (td) {
                    td.setDate(td.getDate() + 1);
                    newS.targetDate = formatYMD(td);
                  }
                }
              }

              let newHours = Math.floor(totalMinutes / 60);
              const newMinutes = totalMinutes % 60;

              // Reset to 08:00 if exceeds 21:xx
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

          newS.currentCounter = s.currentCounter + 1;
          changed = true;

          if (changed) {
            saveRunSettings(newS);
            updateCounterDisplay();
            showTempNotice('✅ Success - Next: #' + newS.currentCounter, 2000);
          }
        }
      } catch (err) {
        console.error('❌ Error during automation:', err);
        showTempNotice('❌ Automation Error', 3000);
      }
    };

    // Initial validation check
    validateAllProducts();
  }

  function renderProductCards() {
    const s = loadRunSettings();
    const container = document.getElementById('rf_productCardsContainer');
    if (!container) return;

    container.innerHTML = '';

    for (let i = 0; i < s.totalProduct; i++) {
      const product = s.products[i] || { searchText: '', radioValue: '', deskripsi: '' };

      const card = document.createElement('div');
      card.style.cssText = 'background:#2d2d2d;border-radius:4px;padding:12px;margin-bottom:12px;border:1px solid #444';

      card.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
          <strong style="font-size:14px;color:#007bff">Product ${i + 1}</strong>
          ${s.totalProduct > 1 ? `<button class="rf_removeProduct" data-index="${i}" style="background:#dc3545;color:#fff;border:none;border-radius:3px;padding:4px 8px;cursor:pointer;font-size:11px">Remove</button>` : ''}
        </div>

        <label style="display:block;margin-bottom:8px">
          <span style="display:block;font-size:11px;color:#aaa;margin-bottom:2px">Search Text *</span>
          <input id="rf_product_${i}_searchText" value="${escapeHtml(product.searchText)}" placeholder="e.g. Office"
            style="width:100%;background:#1a1a1a;color:#fff;border:1px solid #444;border-radius:4px;padding:6px;font-size:12px"
            class="rf_productInput">
        </label>

        <label style="display:block;margin-bottom:8px">
          <span style="display:block;font-size:11px;color:#aaa;margin-bottom:2px">Radio Value *</span>
          <input id="rf_product_${i}_radioValue" value="${escapeHtml(product.radioValue)}" placeholder="e.g. Panduan Cepat..."
            style="width:100%;background:#1a1a1a;color:#fff;border:1px solid #444;border-radius:4px;padding:6px;font-size:12px"
            class="rf_productInput">
        </label>

        <label style="display:block">
          <span style="display:block;font-size:11px;color:#aaa;margin-bottom:2px">Description *</span>
          <input id="rf_product_${i}_deskripsi" value="${escapeHtml(product.deskripsi)}" placeholder="e.g. belajar office..."
            style="width:100%;background:#1a1a1a;color:#fff;border:1px solid #444;border-radius:4px;padding:6px;font-size:12px"
            class="rf_productInput">
        </label>
      `;

      container.appendChild(card);
    }

    // Attach remove handlers
    container.querySelectorAll('.rf_removeProduct').forEach(btn => {
      btn.onclick = () => {
        const index = parseInt(btn.dataset.index, 10);
        removeProduct(index);
      };
    });

    // Attach input validation handlers
    container.querySelectorAll('.rf_productInput').forEach(input => {
      input.addEventListener('input', validateAllProducts);
    });
  }

  function removeProduct(index) {
    const s = loadRunSettings();
    if (s.totalProduct <= 1) {
      showTempNotice('Cannot remove last product', 2000);
      return;
    }

    s.products.splice(index, 1);
    s.totalProduct = s.products.length;

    document.getElementById('rf_totalProduct').value = s.totalProduct;

    saveRunSettings(s);
    renderProductCards();
    showTempNotice(`Product ${index + 1} removed`, 2000);
  }

  function validateAllProducts() {
    const s = loadRunSettings();
    const totalProductInput = document.getElementById('rf_totalProduct');
    const totalProduct = parseInt(totalProductInput?.value, 10) || 0;

    let allValid = true;

    // Check if total product matches card count
    if (s.products.length !== totalProduct) {
      allValid = false;
    }

    // Validate each product has all required fields
    for (let i = 0; i < s.totalProduct; i++) {
      const searchText = document.getElementById(`rf_product_${i}_searchText`)?.value.trim() || '';
      const radioValue = document.getElementById(`rf_product_${i}_radioValue`)?.value.trim() || '';
      const deskripsi = document.getElementById(`rf_product_${i}_deskripsi`)?.value.trim() || '';

      if (!searchText || !radioValue || !deskripsi) {
        allValid = false;
        break;
      }
    }

    // Enable/disable run button
    const runBtn = document.getElementById('rf_runAutomation');
    if (runBtn) {
      runBtn.disabled = !allValid;
      runBtn.style.opacity = allValid ? '1' : '0.5';
      runBtn.style.cursor = allValid ? 'pointer' : 'not-allowed';
    }

    return allValid;
  }

  function saveAllSettings() {
    const s = loadRunSettings();

    // Save scheduling settings
    s.currentdate = document.getElementById('rf_currentdate').value.trim();
    s.targetDate = document.getElementById('rf_targetDate').value.trim();
    s.targetjam = document.getElementById('rf_targetjam').value.trim();
    s.targetmenit = document.getElementById('rf_targetmenit').value.trim();
    s.uploadNow = document.getElementById('rf_uploadNow').checked;
    s.autoUpload = document.getElementById('rf_autoUpload').checked;
    s.increaseDate = document.getElementById('rf_increaseDate').checked;
    s.increaseHours = document.getElementById('rf_increaseHours').checked;
    s.increaseHoursAmount = parseInt(document.getElementById('rf_increaseHoursAmount')?.value || '2', 10) || 2;
    s.increaseMinutesAmount = parseInt(document.getElementById('rf_increaseMinutesAmount')?.value || '0', 10) || 0;
    s.currentCounter = parseInt(document.getElementById('rf_counterStart').value, 10) || 1;

    // Save product data
    const products = [];
    for (let i = 0; i < s.totalProduct; i++) {
      const searchText = document.getElementById(`rf_product_${i}_searchText`)?.value.trim() || '';
      const radioValue = document.getElementById(`rf_product_${i}_radioValue`)?.value.trim() || '';
      const deskripsi = document.getElementById(`rf_product_${i}_deskripsi`)?.value.trim() || '';
      products.push({ searchText, radioValue, deskripsi });
    }
    s.products = products;

    saveRunSettings(s);
    updateCounterDisplay();
  }

  function createRunUI() {
    if (document.getElementById('runFillingPanel')) return;

    const panel = document.createElement('div');
    panel.id = 'runFillingPanel';
    Object.assign(panel.style, {
      position: 'fixed',
      bottom: '20px',
      left: '20px',
      background: '#1a1a1a',
      color: '#fff',
      borderRadius: '4px',
      padding: '6px',
      display: 'flex',
      gap: '4px',
      alignItems: 'center',
      zIndex: 12000,
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
      border: '1px solid #333'
    });

    const s = loadRunSettings();
    const counterDiv = document.createElement('div');
    counterDiv.id = 'rf_counter';
    counterDiv.textContent = `#${s.currentCounter}`;
    Object.assign(counterDiv.style, {
      background: '#007bff',
      color: '#fff',
      padding: '2px 6px',
      borderRadius: '3px',
      fontWeight: 'bold',
      fontSize: '11px',
      minWidth: '35px',
      textAlign: 'center'
    });

    const startBtn = document.createElement('button');
    startBtn.id = 'runFillingStart';
    startBtn.textContent = 'Start';
    Object.assign(startBtn.style, {
      background: '#28a745',
      color: '#fff',
      border: 'none',
      padding: '4px 8px',
      borderRadius: '3px',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '11px',
      minWidth: '45px'
    });

    const gearBtn = document.createElement('button');
    gearBtn.innerHTML = '⚙';
    Object.assign(gearBtn.style, {
      background: '#6c757d',
      color: '#fff',
      border: 'none',
      cursor: 'pointer',
      fontSize: '12px',
      width: '24px',
      height: '24px',
      borderRadius: '3px'
    });

    startBtn.onclick = async () => {
      const s = loadRunSettings();

      // Validate products
      let allValid = true;
      for (let i = 0; i < s.products.length; i++) {
        const p = s.products[i];
        if (!p.searchText || !p.radioValue || !p.deskripsi) {
          allValid = false;
          break;
        }
      }

      if (!allValid) {
        showTempNotice('⚠️ Please configure products first', 2000);
        toggleRunSettingsPopup();
        return;
      }

      if (typeof window.runAutomation !== 'function') {
        showTempNotice('runAutomation missing', 2000);
        return;
      }

      showTempNotice(`Running... #${s.currentCounter}`, 0);

      try {
        const success = await window.runAutomation({
          products: s.products,
          currentdate: s.currentdate,
          targetDate: s.targetDate,
          targetjam: s.targetjam,
          targetmenit: s.targetmenit,
          autoUpload: s.autoUpload,
          uploadNow: s.uploadNow
        });

        if (success) {
          let changed = false;
          const newS = { ...s };

          if (s.increaseDate) {
            const td = parseYMD(s.targetDate);
            if (td) {
              td.setDate(td.getDate() + 1);
              newS.targetDate = formatYMD(td);
              changed = true;
            }
          }

          if (s.increaseHours) {
            const currentHours = parseInt(s.targetjam, 10);
            const currentMinutes = parseInt(s.targetmenit, 10);
            const increaseHours = parseInt(s.increaseHoursAmount, 10) || 0;
            const increaseMinutes = parseInt(s.increaseMinutesAmount, 10) || 0;

            if (!isNaN(currentHours) && !isNaN(currentMinutes)) {
              let totalMinutes = (currentHours * 60) + currentMinutes + (increaseHours * 60) + increaseMinutes;

              // Handle day overflow
              if (totalMinutes >= 24 * 60) {
                totalMinutes = totalMinutes % (24 * 60);
                if (s.increaseDate) {
                  const td = parseYMD(s.targetDate);
                  if (td) {
                    td.setDate(td.getDate() + 1);
                    newS.targetDate = formatYMD(td);
                  }
                }
              }

              let newHours = Math.floor(totalMinutes / 60);
              const newMinutes = totalMinutes % 60;

              // Reset to 08:00 if exceeds 21:xx
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

          newS.currentCounter = s.currentCounter + 1;
          changed = true;

          if (changed) {
            saveRunSettings(newS);
            updateCounterDisplay();
            showTempNotice('✅ Success - Next: #' + newS.currentCounter, 2000);
          }
        }
      } catch (err) {
        console.error('❌ Error during automation:', err);
        showTempNotice('❌ Automation Error', 3000);
      }
    };

    gearBtn.onclick = toggleRunSettingsPopup;

    panel.append(counterDiv, startBtn, gearBtn);
    document.body.appendChild(panel);

    // Keyboard shortcuts
    document.addEventListener('keydown', e => {
      const active = document.activeElement;
      const typing = active && /INPUT|TEXTAREA/.test(active.tagName);
      if (!typing && e.code === 'Space') {
        e.preventDefault();
        toggleRunSettingsPopup();
      }
    });
  }

  try {
    createRunUI();
  } catch (e) {
    console.error(e);
  }

})();