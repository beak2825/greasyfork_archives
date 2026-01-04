// ==UserScript==
// @name         Ortenskung Ortens kung script / hack 3.1
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  Automates crimes (neighborhood + car robbery) with a cleaner GUI + live stats bar
// @match        https://www.ortenskung.com/en*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/549979/Ortenskung%20Ortens%20kung%20script%20%20hack%2031.user.js
// @updateURL https://update.greasyfork.org/scripts/549979/Ortenskung%20Ortens%20kung%20script%20%20hack%2031.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // =========================
    // === Important state ====
    // =========================
    // Runtime flags and state variables used by the bot loop and UI
    let running = false;
    let loopTimer = null;
    let selectedCrimeId = 1;
    let autoClose = true;
    let mode = 'neighborhood';

    // =========================
    // === Create main panel ===
    // =========================
    // Build the floating control panel container and style it
    const panel = document.createElement('div');
    panel.id = '__ortens_crime_bot_panel';
    Object.assign(panel.style, {
      position: 'fixed',
      top: '5px',
      right: '5px',
      left: 'auto',
      width: '260px',
      background: '#111',
      color: '#eee',
      borderRadius: '8px',
      border: '1px solid rgba(255,255,255,0.05)',
      boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
      fontFamily: 'Inter, Roboto, sans-serif',
      fontSize: '13px',
      zIndex: 999999,
      userSelect: 'none',
      overflow: 'hidden'
    });

    // Panel inner HTML: header, body (tabs), stats, footer
    panel.innerHTML = `
        <div id="__header" style="display:flex;align-items:center;justify-content:space-between;padding:6px 10px;background:#0c0c0c;border-bottom:1px solid rgba(255,255,255,0.05);cursor:move;font-weight:600;font-size:13px">
            <div>Crime Bot</div>
            <div style="display:flex;gap:6px;align-items:center">
                <button id="__minBtn" title="Minimize" style="background:transparent;border:none;color:#aaa;cursor:pointer;font-size:14px">—</button>
                <button id="__closeBtn" title="Close" style="background:transparent;border:none;color:#aaa;cursor:pointer;font-size:14px">✕</button>
            </div>
        </div>
        <div id="__body" style="padding:8px;display:block">
            <div style="display:flex;gap:6px;margin-bottom:6px">
                <button class="__tab" data-tab="main" style="flex:1;padding:4px;border-radius:4px;border:0;background:#1b1b1b;color:#fff;cursor:pointer">Main</button>
                <button class="__tab" data-tab="settings" style="flex:1;padding:4px;border-radius:4px;border:0;background:#121212;color:#888;cursor:pointer">Settings</button>
            </div>

            <div id="__tab_main" class="__tabpanel">
                <label style="font-size:12px">Crime Type</label>
                <select id="__crimeType" style="width:100%;padding:4px;margin:4px 0 8px;border-radius:4px;border:1px solid rgba(255,255,255,0.06);background:#0b0b0b;color:#fff;font-size:12px">
                    <option value="neighborhood">Neighborhood</option>
                    <option value="car">Car Robbery</option>
                </select>

                <label style="font-size:12px">Crime ID</label>
                <select id="__crimeId" style="width:100%;padding:4px;margin:4px 0 8px;border-radius:4px;border:1px solid rgba(255,255,255,0.06);background:#0b0b0b;color:#fff;font-size:12px">
                    ${Array.from({length:30}, (_,i)=>i+1).map(n=>`<option value="${n}">${n}</option>`).join('')}
                </select>

                <div style="display:flex;align-items:center;gap:6px;margin-bottom:8px">
                    <label style="font-size:12px;display:flex;align-items:center;gap:4px">
                        <input type="checkbox" id="__autoClose" checked /> <span>Close dialogs</span>
                    </label>
                </div>

                <button id="__startBtn" style="width:100%;padding:6px;border-radius:6px;border:0;background:linear-gradient(180deg,#2fa84f,#208f3a);color:#fff;font-weight:600;cursor:pointer;font-size:13px">Start</button>
            </div>

            <div id="__tab_settings" class="__tabpanel" style="display:none">
                <p style="font-size:12px;color:#bbb;margin:0 0 6px">Settings</p>
                <p style="font-size:11px;color:#999;margin:0 0 6px">Loop delay (ms)</p>
                <input id="__loopDelay" type="number" value="4000" style="width:100%;padding:4px;border-radius:4px;border:1px solid rgba(255,255,255,0.06);background:#0b0b0b;color:#fff;font-size:12px" />
                <p style="font-size:11px;color:#999;margin:6px 0 0">If something breaks, stop and inspect selectors.</p>
            </div>
        </div>
        <div id="__statsBar" style="display:flex;justify-content:space-around;align-items:center;padding:6px 8px;background:#181818;border-top:1px solid rgba(255,255,255,0.05);border-bottom:1px solid rgba(255,255,255,0.05);font-size:12px;color:#eaeaea">
          <span id="__diamonds">💎 0</span>
          <span id="__cash">💵 0</span>
          <span id="__bullets">🔫 0</span>
        </div>
        <div id="__footer" style="font-size:11px;padding:5px 8px;background:#0f0f0f;border-top:1px solid rgba(255,255,255,0.03);color:#9a9a9a">
            Status: <span id="__status">Idle</span>
        </div>
    `;
    document.body.appendChild(panel);


    const header = panel.querySelector('#__header');
    const body = panel.querySelector('#__body');
    const footer = panel.querySelector('#__footer');
    const closeBtn = panel.querySelector('#__closeBtn');
    const minBtn = panel.querySelector('#__minBtn');
    const tabs = panel.querySelectorAll('.__tab');
    const tabMain = panel.querySelector('#__tab_main');
    const tabSettings = panel.querySelector('#__tab_settings');
    const startBtn = panel.querySelector('#__startBtn');
    const crimeIdEl = panel.querySelector('#__crimeId');
    const crimeTypeEl = panel.querySelector('#__crimeType');
    const autoCloseEl = panel.querySelector('#__autoClose');
    const statusEl = panel.querySelector('#__status');
    const loopDelayEl = panel.querySelector('#__loopDelay');

    // Custom sequence state
    let customSteps = [];           // [{mode:'neighborhood'|'car', id: Number}, ...]
    let currentStepIndex = 0;

    // Build Custom Loop UI
    const customContainer = document.createElement('div');
    customContainer.style = 'margin-top:8px;border-top:1px dashed rgba(255,255,255,0.04);padding-top:8px';
    customContainer.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
        <div style="font-size:12px">Custom Loop</div>
        <button id="__addStepBtn" style="padding:4px 6px;border-radius:4px;border:0;background:#253036;color:#fff;cursor:pointer;font-size:12px">Add Step</button>
      </div>
      <div id="__stepsList" style="max-height:140px;overflow:auto;display:flex;flex-direction:column;gap:6px"></div>
      <div style="font-size:11px;color:#999;margin-top:6px">Bot executes one step per loop iteration and advances through the list.</div>
    `;
    tabMain.appendChild(customContainer);

    const addStepBtn = panel.querySelector('#__addStepBtn');
    const stepsListEl = panel.querySelector('#__stepsList');

    function makeCrimeIdSelect(selected = 1) {
      const sel = document.createElement('select');
      sel.style = 'width:72px;padding:4px;border-radius:4px;border:1px solid rgba(255,255,255,0.06);background:#0b0b0b;color:#fff;font-size:12px';
      for (let i = 1; i <= 30; i++) {
        const o = document.createElement('option');
        o.value = i; o.textContent = i;
        if (i === Number(selected)) o.selected = true;
        sel.appendChild(o);
      }
      return sel;
    }

    function saveSteps() {
      try { sessionStorage.setItem('__ortens_customSteps', JSON.stringify(customSteps)); } catch {}
    }

    function loadSteps() {
      try {
        const raw = sessionStorage.getItem('__ortens_customSteps');
        if (raw) customSteps = JSON.parse(raw) || [];
      } catch (e) { customSteps = []; }
    }

    function renderSteps() {
      stepsListEl.innerHTML = '';
      if (!customSteps.length) {
        const hint = document.createElement('div');
        hint.style = 'font-size:12px;color:#888';
        hint.textContent = 'No steps yet — click "Add Step" to create a sequence.';
        stepsListEl.appendChild(hint);
        return;
      }
      customSteps.forEach((s, idx) => {
        const row = document.createElement('div');
        row.style = 'display:flex;gap:6px;align-items:center';

        const idxLabel = document.createElement('div');
        idxLabel.textContent = (idx + 1) + '.';
        idxLabel.style = 'width:18px;text-align:right;color:#bbb;font-size:12px';

        const modeSel = document.createElement('select');
        modeSel.style = 'width:110px;padding:4px;border-radius:4px;border:1px solid rgba(255,255,255,0.06);background:#0b0b0b;color:#fff;font-size:12px';
        const optN = document.createElement('option'); optN.value = 'neighborhood'; optN.textContent = 'Neighborhood';
        const optC = document.createElement('option'); optC.value = 'car'; optC.textContent = 'Car';
        modeSel.appendChild(optN); modeSel.appendChild(optC);
        modeSel.value = s.mode;

        const idSel = makeCrimeIdSelect(s.id);

        const removeBtn = document.createElement('button');
        removeBtn.textContent = '✕';
        removeBtn.title = 'Remove step';
        removeBtn.style = 'padding:4px 6px;border-radius:4px;border:0;background:#331f1f;color:#fff;cursor:pointer;font-size:12px';

        modeSel.addEventListener('change', () => { customSteps[idx].mode = modeSel.value; saveSteps(); });
        idSel.addEventListener('change', () => { customSteps[idx].id = Number(idSel.value); saveSteps(); });
        removeBtn.addEventListener('click', () => { customSteps.splice(idx,1); if (currentStepIndex>=customSteps.length) currentStepIndex=0; saveSteps(); renderSteps(); });

        row.appendChild(idxLabel);
        row.appendChild(modeSel);
        row.appendChild(idSel);
        row.appendChild(removeBtn);
        stepsListEl.appendChild(row);
      });
    }

    addStepBtn.addEventListener('click', () => {
      customSteps.push({ mode: 'neighborhood', id: 1 });
      saveSteps();
      renderSteps();
    });
    loadSteps();
    renderSteps();

    // =========================
    // === Tab switching =======
    // =========================
    tabs.forEach(t => t.addEventListener('click', () => {
      tabs.forEach(x => x.style.background = '#121212');
      t.style.background = '#1b1b1b';
      tabMain.style.display = t.dataset.tab === 'main' ? 'block' : 'none';
      tabSettings.style.display = t.dataset.tab === 'settings' ? 'block' : 'none';
    }));

    // =========================
    // === Dragging behavior ==
    // =========================
    // Allow the panel to be dragged by its header
    let dragging = false;
    let activePointerId = null;
    let startX = 0, startY = 0, origLeft = 0, origTop = 0;

    // Ensure panel has explicit left/top so dragging calculations work
    (function ensurePositionValues() {
      const rect = panel.getBoundingClientRect();
      if (!panel.style.left || panel.style.left === 'auto') panel.style.left = rect.left + 'px';
      if (!panel.style.top || panel.style.top === 'auto') panel.style.top = rect.top + 'px';
      panel.style.right = 'auto';
    })();

    // Start dragging when pointer goes down on header (not on interactive children)
    header.addEventListener('pointerdown', (ev) => {
        if (ev.target !== header) return;
        ev.preventDefault();
        dragging = true;
        activePointerId = ev.pointerId;
        startX = ev.clientX;
        startY = ev.clientY;
        const rect = panel.getBoundingClientRect();
        origLeft = rect.left;
        origTop = rect.top;
        try { header.setPointerCapture(ev.pointerId); } catch (e) {}
    });

    // Update panel position while dragging
    document.addEventListener('pointermove', (ev) => {
        if (!dragging || ev.pointerId !== activePointerId) return;
        const dx = ev.clientX - startX;
        const dy = ev.clientY - startY;
        panel.style.left = (origLeft + dx) + 'px';
        panel.style.top = (origTop + dy) + 'px';
        panel.style.position = 'fixed';
        panel.style.right = 'auto';
    });

    // End dragging on pointer up
    document.addEventListener('pointerup', (ev) => {
        if (dragging && ev.pointerId === activePointerId) {
            try { header.releasePointerCapture(ev.pointerId); } catch (e) {}
            dragging = false;
            activePointerId = null;
        }
    });

    // Prevent interactive elements (buttons/inputs) from initiating drag
    panel.querySelectorAll('button, input, select, a, textarea, label').forEach(node => {
        node.addEventListener('pointerdown', (e) => { e.stopPropagation(); });
    });

    // =========================
    // === Minimize / Close ====
    // =========================
    // Toggle minimized state to hide body/footer and shrink panel
    let minimized = false;
    minBtn.addEventListener('click', () => {
        minimized = !minimized;
        if (minimized) {
            body.style.display = 'none';
            footer.style.display = 'none';
            panel.querySelector('#__statsBar').style.display = 'none';
            panel.style.width = '140px';
            minBtn.textContent = '▢';
            minBtn.title = 'Restore';
        } else {
            body.style.display = 'block';
            footer.style.display = 'block';
            panel.querySelector('#__statsBar').style.display = 'flex';
            panel.style.width = '260px';
            minBtn.textContent = '—';
            minBtn.title = 'Minimize';
        }
    });

    // Close button stops loop (if running) and removes panel
    closeBtn.addEventListener('click', () => {
        try { stopLoop(); } catch (e) {}
        panel.remove();
    });

    // ---------------- Stats ----------------
    // updateStats: find the on-page elements that show diamonds, cash and bullets
    // and copy their formatted values into our panel display.
    function updateStats() {
      // Try to find the page element that shows diamonds (supports multiple language labels)
      const diamondEl = document.querySelector('.val[data-tip*="diamond"], .val[data-tip*="diamonds"], .val[data-tip*="diamanter"]');
      // Try to find the page element that shows cash (supports multiple language labels)
      const cashEl    = document.querySelector('.val[data-tip*="cash"], .val[data-tip*="money"], .val[data-tip*="kontanter"]');
      // Try to find the page element that shows bullets/ammo (supports multiple language labels)
      const bulletEl  = document.querySelector('.val[data-tip*="ammunition"], .val[data-tip*="bullets"], .val[data-tip*="ammunitioner"]');

      // formatWithSpaces: take a raw value (may include letters/symbols),
      // strip non-numeric characters, and insert spaces as thousand separators.
      function formatWithSpaces(raw) {
        if (raw == null) return '';
        // prefer numeric digits from data-number or strip non-digits from text
        const s = String(raw).replace(/[^\d.-]/g, ''); // keep digits, minus and decimal point
        if (s === '') return '';
        const parts = s.split('.');
        let int = parts[0];
        const sign = int.startsWith('-') ? '-' : '';
        if (sign) int = int.slice(1); // remove sign for grouping
        // add a space every three digits from the right
        int = int.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
        // reassemble sign, integer part and optional decimal part
        return sign + int + (parts[1] ? '.' + parts[1] : '');
      }

      // getText: read the value for an element. Prefer data-number attribute if present
      // (often a clean integer), otherwise use the element's text content.
      function getText(el) {
        if (!el) return '';
        // use data-number when present (clean integer), otherwise use textContent
        const raw = el.getAttribute('data-number') ?? el.textContent ?? '';
        return formatWithSpaces(raw);
      }

      // read values from the located elements
      const diamonds = getText(diamondEl);
      const cash = getText(cashEl);
      const bullets = getText(bulletEl);

      // find destination nodes inside our custom panel where we show the values
      const dNode = panel.querySelector('#__diamonds');
      const cNode = panel.querySelector('#__cash');
      const bNode = panel.querySelector('#__bullets');

      // update the panel text if both the panel node and the value exist
      if (dNode && diamonds) dNode.textContent = '💎 ' + diamonds;
      if (cNode && cash)    cNode.textContent = '💵 ' + cash;
      if (bNode && bullets) bNode.textContent = '🔫 ' + bullets;
    }

    // run once immediately and then every 2 seconds to keep stats fresh
    updateStats();
    setInterval(updateStats, 2000);

    // setStatus: update the status area of the UI with a short message
    function setStatus(text) {
        statusEl.textContent = text;
    }

    // stopLoop: stop the automation loop, clear timers and update UI
    function stopLoop() {
        running = false;
        if (loopTimer) {
            clearTimeout(loopTimer);
            loopTimer = null;
        }
        startBtn.textContent = 'Start';
        setStatus('Stopped');
    }

    // sleep: helper that returns a promise that resolves after ms milliseconds.
    // This lets code pause without blocking the whole browser.
    function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

    // startLoop: start the automation loop if not already running.
    // It sets running state, updates the UI and immediately calls performCrime once.
    async function startLoop() {
      if (running) return;
      running = true;
      startBtn.textContent = 'Stop';
      setStatus('Running');
      currentStepIndex = 0;
      autoClose = !!autoCloseEl.checked;
      await performCrime();
    }

    // add click handler to the start button to toggle start/stop
    startBtn.addEventListener('click', () => {
        if (!running) startLoop();
        else stopLoop();
    });

    // performCrime: main automation loop that navigates dialogs and clicks the correct buttons.
    async function performCrime() {
        if (!running) return;
        const delay = Math.max(50, parseInt(loopDelayEl.value, 10) || 4000);

        try {
            // --- 1. CHECK TIMERS ---
            // This is the most likely culprit! You MUST find the correct selector for the timer element.
            // Use browser dev tools (F12) to inspect and find the correct class or ID for the element that shows remaining attempts.
            // The current selectors are: #my_timers > div.val, .timers .val, .timer .val
            const timerEl = document.querySelector('#my_timers > div.val, .timers .val, .timer .val');
            if (timerEl) {
                const txt = timerEl.textContent.trim();
                const m = txt.match(/(\d+)\s*\/\s*(\d+)/);
                if (m) {
                    const used = parseInt(m[1], 10), total = parseInt(m[2], 10);
                    const avail = total - used;
                    if (avail <= 0) {
                        setStatus('No timers left — waiting');
                        loopTimer = setTimeout(performCrime, 5000);
                        return;
                    }
                }
            }

            // --- 2. APPLY CUSTOM STEP ---
            // If a custom loop is active, set the crime mode and ID for this iteration.
            // This ensures the bot always uses the settings for the current step.
            if (customSteps.length > 0) {
                const step = customSteps[currentStepIndex] || customSteps[0];
                mode = step.mode;
                selectedCrimeId = Number(step.id);
                setStatus(`Step ${currentStepIndex+1}/${customSteps.length}: ${mode} ID ${selectedCrimeId}`);
                currentStepIndex = (currentStepIndex + 1) % customSteps.length;
            } else {
                // Otherwise, use the settings from the UI controls.
                mode = crimeTypeEl.value || 'neighborhood';
                selectedCrimeId = parseInt(crimeIdEl.value, 10) || selectedCrimeId;
                setStatus(`Performing crime ID ${selectedCrimeId}`);
            }

            // --- 3. NAVIGATE TO THE CORRECT DIALOG ---
            // These selectors may also be outdated. You may need to update them.
            if (mode === 'neighborhood') {
                if (!document.querySelector('#go_crimes_dialog') && document.querySelector('#go_crimes')) {
                    try { document.querySelector('#go_crimes').click(); } catch {}
                    await sleep(300);
                }
                const nbBtn = Array.from(document.querySelectorAll('.crimes_button, .crimes_button_small, .crimes-tab, .crimes_button'))
                    .find(el => /neighborhood/i.test(el.textContent || el.innerText || ''));
                if (nbBtn && !document.querySelector('#neighborhood_crimes')) {
                    try { nbBtn.click(); } catch (e) {}
                    await sleep(250);
                }
            } else if (mode === 'car') {
                if (!document.querySelector('#dialog_cars') && document.querySelector('#go_cars')) {
                    try { document.querySelector('#go_cars').click(); } catch {}
                    await sleep(300);
                } else {
                    const carOpener = Array.from(document.querySelectorAll('a,button')).find(el =>
                        /(car|cars|vehicle|rob)/i.test((el.textContent || '') + ' ' + (el.getAttribute('title') || ''))
                    );
                    if (carOpener && !document.querySelector('#dialog_cars')) {
                        try { carOpener.click(); } catch (e) {}
                        await sleep(300);
                    }
                }
            }

            // --- 4. FIND AND CLICK THE CRIME BUTTON ---
            // This is the most critical part. You will likely need to update these selectors.
            // For both modes, the script looks for a button that matches the selected crime ID.
            let commitBtn = null;
            if (mode === 'neighborhood') {
                const btns = Array.from(document.querySelectorAll('.crime_button_small, .crime_button, a, button'))
                    .filter(el => el.getAttribute && (el.getAttribute('onclick') || '').toString().length > 0);
                commitBtn = btns.find(el => {
                    const on = (el.getAttribute('onclick') || '');
                    return new RegExp(`['"]?id['"]?\\s*[:=]\\s*['"]?${selectedCrimeId}['"]?`).test(on);
                }) || btns.find(el => (el.getAttribute('onclick') || '').includes(`'id':'${selectedCrimeId}'`));

                if (!commitBtn) {
                    const byText = Array.from(document.querySelectorAll('.crime_button_small, .crime_button, a, button'))
                        .find(el => (el.textContent || '').includes(String(selectedCrimeId)));
                    if (byText) commitBtn = byText;
                }
            } else if (mode === 'car') {
                const carCandidates = Array.from(document.querySelectorAll('#dialog_cars .crime_button_small, #dialog_cars a, #dialog_cars button, .car_list a, .car_list button'))
                    .filter(el => el.getAttribute && (el.getAttribute('onclick') || '').toString().length > 0);

                commitBtn = carCandidates.find(el => {
                    const on = (el.getAttribute('onclick') || '');
                    return new RegExp(`['"]?id['"]?\\s*[:=]\\s*['"]?${selectedCrimeId}['"]?`).test(on);
                }) || carCandidates.find(el => (el.getAttribute('onclick') || '').includes(`'id':'${selectedCrimeId}'`));

                if (!commitBtn) {
                    const byText = Array.from(document.querySelectorAll('#dialog_cars .crime_button_small, #dialog_cars a, #dialog_cars button, .car_list a, .car_list button'))
                        .find(el => (el.textContent || '').includes(String(selectedCrimeId)));
                    if (byText) commitBtn = byText;
                }
            }

            if (!commitBtn) {
                setStatus('No crime button found — retrying');
                loopTimer = setTimeout(performCrime, 5000);
                return;
            }

            try {
                commitBtn.scrollIntoView({block:'center', behavior:'auto'});
            } catch (e) {}

            try {
                commitBtn.click();
                setStatus(`Clicked ${mode} button`);
            } catch (e) {
                try { commitBtn.dispatchEvent(new MouseEvent('click', {bubbles:true,cancelable:true})); setStatus('Dispatched click'); }
                catch (err) { console.error('click failed', err); setStatus('Click failed'); }
            }

            setTimeout(() => {
                try {
                    if (typeof close_dialog === 'function') {
                        try { close_dialog('social'); } catch {}
                        try { close_dialog('levelup'); } catch {}
                        if (autoClose) try { close_dialog('crimes'); } catch {}
                        if (autoClose) try { close_dialog('cars'); } catch {}
                    }
                } catch (err) { /* ignore any errors closing dialogs */ }
                const notif = document.querySelector('.button.first, .ui-button.primary, .ui-dialog .button, .ui-dialog .ui-button');
                if (notif) {
                    try { notif.click(); } catch (e) {}
                }
            }, 800);

            loopTimer = setTimeout(performCrime, Math.max(500, delay));

        } catch (err) {
            console.error('performCrime error', err);
            setStatus('Error — retrying');
            loopTimer = setTimeout(performCrime, 5000);
        }
    }

    // expose a small control API on window so external code can start/stop the bot and read status
    window.__ortensCrimeBot = {
        stop: stopLoop,
        start: startLoop,
        status: () => ({ running, selectedCrimeId, autoClose })
    };

    // initialize selectedCrimeId from the UI control so the bot starts with the desired crime
    selectedCrimeId = parseInt(crimeIdEl.value, 10) || selectedCrimeId;

})();
