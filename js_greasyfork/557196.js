// ==UserScript==
// @name         DC - Fouille Tracker (Bleu)
// @namespace    https://greasyfork.org/
// @version      1.2
// @license @author
// @description  Minuteur fouille draggable, lock/unlock, historique déroulant, vide de l'historique, copier de l'historique (thème bleu)
// @match        https://www.dreadcast.net/Main
// @grant        none
// @author Yenzelle
// @downloadURL https://update.greasyfork.org/scripts/557196/DC%20-%20Fouille%20Tracker%20%28Bleu%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557196/DC%20-%20Fouille%20Tracker%20%28Bleu%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /* -------------------------
     Configuration / constantes
     ------------------------- */
  const STORAGE_KEY_POS = 'dc_fouille_timer_pos';
  const STORAGE_KEY_LOCK = 'dc_fouille_timer_locked';
  const STORAGE_KEY_HISTORY = 'dc_fouille_history';
  const HISTORY_LIMIT = 500;
  const EXPECTING_WINDOW_MS = 5000; // fenêtre pour associer ajout d'objet au message "Objet trouvé"

  // Eviter double injection
  if (window.__dcFouilleInjected) return;
  window.__dcFouilleInjected = true;

  /* -------------------------
     Création HUD minimal (sans barre de progression)
     ------------------------- */
  function createHUD() {
    if (document.getElementById('dc_fouille_timer')) return;
    const container = document.createElement('div');
    container.id = 'dc_fouille_timer';
    container.style.position = 'fixed';
    container.style.right = '12px';
    container.style.top = '12px';
    container.style.zIndex = '2147483000';
    container.style.width = '240px';
    container.style.minHeight = '64px';
    container.style.background = 'rgba(0,0,0,0.60)';
    container.style.borderRadius = '12px';
    container.style.padding = '10px';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.alignItems = 'center';
    container.style.justifyContent = 'center';
    container.style.color = '#27F2F5';
    container.style.fontFamily = 'Arial, Helvetica, sans-serif';
    container.style.boxShadow = '0 8px 30px rgba(0,0,0,0.6), 0 0 18px rgba(39,242,245,0.12)';
    container.style.userSelect = 'none';
    container.style.cursor = 'grab';
    container.style.touchAction = 'none';
    container.style.border = '1px solid rgba(39,242,245,0.28)';

    container.innerHTML = `
      <div style="width:100%; display:flex; flex-direction:column; gap:6px;">
        <div style="display:flex; justify-content:space-between; align-items:center; gap:8px;">
          <div id="dc_fouille_time" style="font-size:18px; text-align:left; line-height:1.05; color:#27F2F5; font-weight:800;">
            <tt>--<span style="color:#9aa">m</span>  --<span style="color:#9aa">s</span></tt>
          </div>
          <div style="display:flex; gap:6px; align-items:center;">
            <button id="dc_history_btn" title="Ouvrir l'historique" style="background:transparent;border:1px solid rgba(39,242,245,0.18);color:#27F2F5;padding:6px 10px;border-radius:8px;cursor:pointer;font-size:13px;min-width:64px;">Historique</button>
            <button id="dc_lock_btn" title="Verrouiller / Déverrouiller HUD" style="background:transparent;border:1px solid rgba(39,242,245,0.18);color:#27F2F5;padding:6px 10px;border-radius:8px;cursor:pointer;font-size:13px;min-width:64px;">Lock</button>
          </div>
        </div>

        <div id="dc_fouille_result" style="font-size:15px; text-align:center; color:#27F2F5; max-width:220px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; margin-top:6px;"></div>
      </div>
    `;

    document.body.appendChild(container);
  }

  /* -------------------------
     Styles (HUD + panneau historique déroulant) - Bleu néon
     ------------------------- */
  function injectStyles() {
    if (document.getElementById('dc_fouille_styles')) return;
    const css = `
      /* HUD base - bleu néon */
      #dc_fouille_timer {
        transition: transform .16s, box-shadow .16s;
        border: 1px solid rgba(39,242,245,0.28);
        box-shadow:
          0 8px 30px rgba(0,0,0,0.6),
          0 0 18px rgba(39,242,245,0.14),
          inset 0 1px 0 rgba(255,255,255,0.02);
        background: rgba(0,0,0,0.60);
        color: #27F2F5;
        font-family: Arial, Helvetica, sans-serif !important;
      }
      #dc_fouille_timer:hover {
        transform: translateY(-4px);
        box-shadow:
          0 18px 40px rgba(0,0,0,0.65),
          0 0 28px rgba(39,242,245,0.18);
      }

      /* Ombre bleue autour des chiffres du timer */
      #dc_fouille_time {
        font-size:18px;
        color:#27F2F5;
        font-weight:800;
        text-shadow:
          0 0 10px rgba(39,242,245,0.55),
          0 2px 6px rgba(0,0,0,0.55);
      }

      #dc_fouille_result { font-size:15px; color:#27F2F5; }

      /* Buttons style - transparent with neon border */
      #dc_fouille_timer button {
        background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
        border: 1px solid rgba(39,242,245,0.18);
        color: #27F2F5;
        padding: 6px 10px;
        border-radius: 8px;
        font-size:13px;
        cursor: pointer;
        transition: transform 120ms ease, box-shadow 120ms ease;
      }
      #dc_fouille_timer button:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 18px rgba(39,242,245,0.12);
      }
      #dc_fouille_timer button:active { transform: translateY(0); }

      /* History panel (deroulant, aligné à droite du HUD) */
      #dc_history_panel {
        position: fixed;
        right: calc(12px + 240px + 8px);
        top: 12px;
        width: 420px;
        max-height: 72vh;
        background: linear-gradient(180deg, rgba(12,6,18,0.98), rgba(6,2,10,0.95));
        border-radius: 10px;
        padding: 12px;
        z-index: 2147484000;
        box-shadow: 0 18px 48px rgba(0,0,0,0.8), 0 0 28px rgba(39,242,245,0.08);
        display:flex;
        flex-direction:column;
        gap:10px;
        overflow:hidden;
        transform-origin: right top;
        transform: translateX(12px) scaleX(0.98);
        opacity: 0;
        transition: transform 220ms cubic-bezier(.2,.9,.2,1), opacity 180ms linear;
        border: 1px solid rgba(39,242,245,0.18);
      }
      #dc_history_panel.open {
        transform: translateX(0) scaleX(1);
        opacity: 1;
      }

      /* Header: allow wrapping and ensure action buttons don't shrink */
      #dc_history_header {
        display:flex;
        justify-content:space-between;
        align-items:center;
        gap:8px;
        color:#9ff7f8;
        flex-wrap:wrap;
      }
      /* The right-side actions container (buttons) */
      #dc_history_header > div {
        display:flex;
        gap:8px;
        align-items:center;
        flex-shrink:0;
      }

      #dc_history_list { overflow:auto; padding:6px; display:flex; flex-direction:column; gap:6px; max-height: calc(72vh - 96px); }

      .dc_history_item {
        display:flex; align-items:center; gap:8px; padding:10px; border-radius:8px;
        background: linear-gradient(90deg, rgba(255,255,255,0.01), rgba(255,255,255,0.005));
        border: 1px solid rgba(255,255,255,0.02);
        font-size:14px; color:#e6f9fa;
      }
      .dc_history_time { color:#bff6f7; font-size:13px; min-width:150px; text-align:right; }
      .dc_history_status { font-size:13px; padding:6px 10px; border-radius:8px; font-weight:700; color:#0b0b0b; min-width:100px; text-align:center; }
      .dc_history_name { flex:1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; padding-left:8px; }

      .dc_status_found { background: linear-gradient(180deg,#9ff7f8,#27F2F5); color:#fff; box-shadow: 0 4px 12px rgba(39,242,245,0.12); }
      .dc_status_none  { background: linear-gradient(180deg,#6b1b1b,#a23a3a); color:#fff; box-shadow: 0 4px 12px rgba(162,31,31,0.10); }

      /* Ensure action buttons have a minimum width so they don't overlap */
      #dc_history_panel .btn {
        background:transparent;
        border:1px solid rgba(255,255,255,0.04);
        color:#9ff7f8;
        padding:6px 12px;
        border-radius:8px;
        cursor:pointer;
        font-size:13px;
        min-width:72px;
        white-space:nowrap;
      }
      #dc_history_panel .btn:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(39,242,245,0.06); }

      /* Close arrow (toggle) */
      #dc_history_toggle {
        position: absolute;
        left: -26px;
        top: 12px;
        width: 26px;
        height: 40px;
        display:flex;
        align-items:center;
        justify-content:center;
        background: linear-gradient(180deg, rgba(12,6,18,0.95), rgba(6,2,10,0.9));
        border-radius: 8px 0 0 8px;
        border: 1px solid rgba(39,242,245,0.12);
        cursor: pointer;
        box-shadow: 0 6px 18px rgba(0,0,0,0.5);
      }
      #dc_history_toggle::after {
        content: '❯';
        display:block;
        transform: rotate(180deg);
        color:#e6f9fa;
        font-size:14px;
      }
      #dc_history_panel.closed #dc_history_toggle::after { transform: rotate(0deg); }

      /* Copy feedback */
      #dc_history_copy_feedback {
        position: absolute;
        right: 14px;
        top: 56px;
        background: rgba(30,10,30,0.9);
        color: #e6f9fa;
        padding:6px 10px;
        border-radius:8px;
        font-size:13px;
        opacity:0;
        transform: translateY(-6px);
        transition: opacity 180ms linear, transform 180ms ease;
        pointer-events:none;
      }
      #dc_history_copy_feedback.show { opacity:1; transform: translateY(0); }

      @media (max-width: 900px) {
        #dc_history_panel { right: 8px; width: 360px; }
        .dc_history_time { min-width:120px; font-size:12px; }
        .dc_history_item { font-size:13px; }
        #dc_history_panel .btn { min-width:60px; padding:6px 8px; font-size:12px; }
      }
    `;
    const style = document.createElement('style');
    style.id = 'dc_fouille_styles';
    style.textContent = css;
    document.head.appendChild(style);
  }

  /* -------------------------
     Historique : stockage / rendu / copie
     ------------------------- */
  function loadHistory() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_HISTORY);
      if (!raw) return [];
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) return arr;
    } catch (e) {}
    return [];
  }
  function saveHistory(arr) {
    try {
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(arr.slice(0, HISTORY_LIMIT)));
    } catch (e) {}
  }
  function addHistoryEntryObj(entry) {
    const hist = loadHistory();
    hist.unshift(entry);
    saveHistory(hist);
    renderHistoryList();
  }

  function formatHistoryLine(e) {
    const date = new Date(e.timeISO);
    const dateStr = date.toLocaleString('fr-FR', { year:'numeric', month:'2-digit', day:'2-digit' });
    const timeStr = date.toLocaleTimeString('fr-FR', { hour:'2-digit', minute:'2-digit', second:'2-digit' });
    if (e.found) {
      return `${dateStr} ${timeStr} - Trouvé - ${e.name}`;
    } else {
      return `${dateStr} ${timeStr} - Rien trouvé`;
    }
  }

  function renderHistoryList() {
    const listEl = document.getElementById('dc_history_list');
    if (!listEl) return;
    const hist = loadHistory();
    listEl.innerHTML = '';
    if (!hist || hist.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'dc_history_item';
      empty.textContent = 'Aucun résultat enregistré.';
      listEl.appendChild(empty);
      return;
    }
    for (const e of hist) {
      const item = document.createElement('div');
      item.className = 'dc_history_item';
      const time = document.createElement('div');
      time.className = 'dc_history_time';
      const date = new Date(e.timeISO);
      time.textContent = date.toLocaleString('fr-FR', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit', second:'2-digit' });
      const status = document.createElement('div');
      status.className = 'dc_history_status ' + (e.found ? 'dc_status_found' : 'dc_status_none');
      status.textContent = e.found ? 'Trouvé' : 'Rien trouvé';
      const name = document.createElement('div');
      name.className = 'dc_history_name';
      name.textContent = e.name;
      item.appendChild(time);
      item.appendChild(status);
      item.appendChild(name);
      listEl.appendChild(item);
    }
  }

  function createHistoryPanel() {
    if (document.getElementById('dc_history_panel')) return document.getElementById('dc_history_panel');

    const panel = document.createElement('div');
    panel.id = 'dc_history_panel';
    panel.innerHTML = `
      <div id="dc_history_header">
        <strong style="font-size:15px; color:#e6f9fa">Historique des fouilles</strong>
        <div style="display:flex; gap:8px;">
          <button id="dc_history_copy" class="btn">Copier</button>
          <button id="dc_history_clear" class="btn">Vider</button>
          <button id="dc_history_close" class="btn">Fermer</button>
        </div>
      </div>
      <div id="dc_history_list"></div>
      <div id="dc_history_copy_feedback">Copié</div>
    `;
    document.body.appendChild(panel);

    // toggle arrow element (placed relative to panel)
    const toggle = document.createElement('div');
    toggle.id = 'dc_history_toggle';
    panel.appendChild(toggle);

    // events
    document.getElementById('dc_history_close').addEventListener('click', () => toggleHistoryPanel(false));
    document.getElementById('dc_history_clear').addEventListener('click', () => {
      if (!confirm("Vider l'historique des fouilles ?")) return;
      saveHistory([]);
      renderHistoryList();
    });
    document.getElementById('dc_history_copy').addEventListener('click', copyHistoryToClipboard);

    // arrow toggle click
    toggle.addEventListener('click', () => toggleHistoryPanel(false));

    renderHistoryList();
    return panel;
  }

  function toggleHistoryPanel(show) {
    const hud = document.getElementById('dc_fouille_timer');
    if (!hud) return;
    let panel = document.getElementById('dc_history_panel');
    if (show === undefined) show = !Boolean(panel && panel.classList.contains('open'));
    if (show) {
      panel = createHistoryPanel();
      const hudRect = hud.getBoundingClientRect();
      const panelWidth = Math.min(520, Math.max(320, Math.floor(window.innerWidth * 0.38)));
      panel.style.width = panelWidth + 'px';
      if (hudRect.right + 12 + panelWidth + 12 <= window.innerWidth) {
        panel.style.left = 'auto';
        panel.style.right = (window.innerWidth - hudRect.right + 12) + 'px';
      } else {
        panel.style.right = 'auto';
        panel.style.left = Math.max(12, hudRect.left - panelWidth - 12) + 'px';
      }
      panel.classList.add('open');
      panel.classList.remove('closed');
      renderHistoryList();
    } else {
      if (panel) {
        panel.classList.remove('open');
        panel.classList.add('closed');
        setTimeout(() => {
          const p = document.getElementById('dc_history_panel');
          if (p) p.remove();
        }, 240);
      }
    }
  }

  async function copyHistoryToClipboard() {
    const hist = loadHistory();
    if (!hist || hist.length === 0) {
      showCopyFeedback('Aucun élément');
      return;
    }
    const lines = hist.map(formatHistoryLine).join('\n');
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(lines);
      } else {
        const ta = document.createElement('textarea');
        ta.value = lines;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
      }
      showCopyFeedback('Copié');
    } catch (e) {
      const ta = document.createElement('textarea');
      ta.value = lines;
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      showCopyFeedback('Sélectionné (Ctrl+C)');
      setTimeout(() => ta.remove(), 6000);
    }
  }

  function showCopyFeedback(text) {
    const panel = document.getElementById('dc_history_panel');
    if (!panel) return;
    const fb = document.getElementById('dc_history_copy_feedback');
    if (!fb) return;
    fb.textContent = text;
    fb.classList.add('show');
    setTimeout(() => fb.classList.remove('show'), 1600);
  }

  /* -------------------------
     Extraction nom depuis node (best-effort)
     ------------------------- */
  function extractNameFromNode(node) {
    if (!node) return null;
    try {
      const typeinfo = node.querySelector && (node.querySelector('.typeinfo') || node.querySelector('.info_objet') || node.querySelector('.nom_objet'));
      if (typeinfo) {
        const text = typeinfo.textContent.trim();
        if (text) return text.split('\n')[0].trim();
      }
      const img = node.querySelector && node.querySelector('img');
      if (img) {
        if (img.getAttribute('title')) return img.getAttribute('title').trim();
        if (img.getAttribute('alt')) return img.getAttribute('alt').trim();
      }
      const dataName = node.getAttribute && (node.getAttribute('data-name') || node.getAttribute('data-title'));
      if (dataName) return dataName.trim();
      const txt = node.textContent && node.textContent.trim();
      if (txt) return txt.split('\n')[0].trim();
    } catch (e) {}
    return null;
  }

  /* -------------------------
     Core detection logic (timer + results)
     ------------------------- */
  // timer state
  let initialTime = 0;
  let timeLeft = 0;
  let unlimited = false;
  let tickInterval = null;
  let lastPrecisionText = null;
  let lastActionText = null;
  let lastFound = null;

  // expectingFound flag
  let expectingFound = false;
  let expectingTimeout = null;

  function setExpectingFound() {
    expectingFound = true;
    if (expectingTimeout) clearTimeout(expectingTimeout);
    expectingTimeout = setTimeout(() => { expectingFound = false; expectingTimeout = null; }, EXPECTING_WINDOW_MS);
  }
  function clearExpectingFound() {
    expectingFound = false;
    if (expectingTimeout) { clearTimeout(expectingTimeout); expectingTimeout = null; }
  }

  function formatTime(t) {
    const minutes = ('0' + Math.floor(t / 60)).slice(-2);
    const seconds = ('0' + (t % 60)).slice(-2);
    return `<tt>${minutes}<span style="color:#9aa">m</span>  ${seconds}<span style="color:#9aa">s</span></tt>`;
  }

  function setResultText(text, color) {
    const el = document.getElementById('dc_fouille_result');
    if (!el) return;
    el.textContent = text;
    el.style.color = color || '#27F2F5';
  }

  function updateUI() {
    const timeEl = document.getElementById('dc_fouille_time');
    if (!timeEl) return;
    if (unlimited) {
      timeEl.innerHTML = `<tt>∞<span style="color:#9aa">s</span></tt>`;
    } else if (timeLeft <= 0 || initialTime === 0) {
      timeEl.innerHTML = `<tt>--<span style="color:#9aa">m</span>  --<span style="color:#9aa">s</span></tt>`;
    } else {
      timeEl.innerHTML = formatTime(timeLeft);
    }
    if (lastFound === null) {
      setResultText('', '#27F2F5');
    } else if (lastFound === 'Rien trouvé') {
      setResultText('Rien trouvé…', '#ff8a8a');
    } else {
      setResultText(`Dernier: ${lastFound}`, '#27F2F5');
    }
  }

  function startTick() {
    if (tickInterval) return;
    tickInterval = setInterval(() => {
      if (unlimited) return;
      if (timeLeft > 0) {
        timeLeft = Math.max(0, timeLeft - 1);
        updateUI();
      } else {
        clearInterval(tickInterval);
        tickInterval = null;
        initialTime = 0;
        updateUI();
      }
    }, 1000);
  }

  function resetTimer() {
    initialTime = 0; timeLeft = 0; unlimited = false;
    if (tickInterval) { clearInterval(tickInterval); tickInterval = null; }
    updateUI();
  }

  function parseFouillePrecision(precisionText) {
    if (!precisionText) return null;
    const lower = precisionText.toLowerCase();
    const unlimitedKeywords = ['illimité', 'illimitée', 'illimite', '∞', 'infinite', 'infinie', 'infini'];
    for (const kw of unlimitedKeywords) if (lower.includes(kw)) return { seconds: 0, unlimited: true };
    let mins = 0, secs = 0;
    const minMatch = lower.match(/(\d+)\s*min/);
    if (minMatch) mins = parseInt(minMatch[1], 10);
    const secMatch = lower.match(/(\d+)\s*sec/);
    if (secMatch) secs = parseInt(secMatch[1], 10);
    if (!minMatch && !secMatch) {
      const nums = lower.match(/\d+/g);
      if (nums && nums.length > 0) {
        if (nums.length === 1) secs = parseInt(nums[0], 10);
        else { mins = parseInt(nums[0], 10); secs = parseInt(nums[1], 10); }
      }
    }
    if (mins === 0 && secs === 0) return null;
    return { seconds: (mins * 60) + secs, unlimited: false };
  }

  /* -------------------------
     Inventory observers (record only when expectingFound)
     ------------------------- */
  function setupInventoryObservers() {
    const selectors = ['annexe_inventaire_ext', 'zone_conteneurs_displayed', 'zone_objets_trouves', 'zone_resultats'];
    selectors.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new MutationObserver((mutations) => {
        for (const m of mutations) {
          if (!m.addedNodes || m.addedNodes.length === 0) continue;
          if (!expectingFound) continue;
          for (let i = 0; i < m.addedNodes.length; i++) {
            const node = m.addedNodes[i];
            if (!node || !(node.querySelector || node.getAttribute)) continue;
            const name = extractNameFromNode(node);
            if (name) {
              lastFound = name;
              addHistoryEntryObj({
                timeISO: new Date().toISOString(),
                timeLabel: new Date().toLocaleString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' }),
                found: true,
                name: lastFound
              });
              clearExpectingFound();
              updateUI();
              return;
            }
          }
        }
      });
      obs.observe(el, { childList: true, subtree: true });
    });
  }

  /* -------------------------
     Action observer (sur #action_actuelle)
     ------------------------- */
  function handleActionChange() {
    const actionNode = document.getElementById('action_actuelle');
    if (!actionNode) return;
    const action = actionNode.querySelector('.action')?.textContent?.trim() || '';
    const precision = actionNode.querySelector('.precision')?.textContent?.trim() || '';

    if (precision && precision.includes('Objet trouvé')) {
      lastFound = lastFound || 'Inconnu';
      setResultText(`Dernier: ${lastFound}`, '#27F2F5');
      setExpectingFound();
      if (expectingTimeout) clearTimeout(expectingTimeout);
      expectingTimeout = setTimeout(() => {
        if (expectingFound) {
          addHistoryEntryObj({
            timeISO: new Date().toISOString(),
            timeLabel: new Date().toLocaleString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' }),
            found: true,
            name: lastFound || 'Inconnu'
          });
          clearExpectingFound();
        }
      }, EXPECTING_WINDOW_MS);
    } else if (precision && precision.includes('Rien trouvé')) {
      lastFound = 'Rien trouvé';
      setResultText('Rien trouvé…', '#ff8a8a');
      addHistoryEntryObj({
        timeISO: new Date().toISOString(),
        timeLabel: new Date().toLocaleString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' }),
        found: false,
        name: 'Rien trouvé'
      });
      clearExpectingFound();
    }

    if (action === 'Vous êtes en train de fouiller la zone' && precision) {
      if (precision.includes('Objet trouvé') || precision.includes('Rien trouvé')) {
        lastPrecisionText = precision; lastActionText = action; return;
      }
      const parsed = parseFouillePrecision(precision);
      if (parsed !== null) {
        if (parsed.unlimited) {
          unlimited = true;
          initialTime = 0;
          timeLeft = 0;
        } else {
          unlimited = false;
          const secs = parsed.seconds;
          const isNew = precision !== lastPrecisionText;
          const actionJustStarted = lastActionText !== action;
          const isLonger = secs > timeLeft;
          if (isNew || actionJustStarted || isLonger || initialTime === 0) initialTime = secs;
          timeLeft = secs;
        }
        updateUI();
        startTick();
        lastPrecisionText = precision; lastActionText = action;
        return;
      }
    }

    lastPrecisionText = precision; lastActionText = action;
    if (!(precision && (precision.includes('Objet trouvé') || precision.includes('Rien trouvé')))) {
      resetTimer();
      clearExpectingFound();
    }
  }

  function setupActionObserver() {
    const actionElem = document.getElementById('action_actuelle');
    if (actionElem) {
      const observer = new MutationObserver(() => { handleActionChange(); });
      observer.observe(actionElem, { childList: true, subtree: true });
      handleActionChange();
      return true;
    }
    return false;
  }

  /* -------------------------
     HUD interactions (drag, lock, history button)
     ------------------------- */
  function setupHUDInteractions() {
    const container = document.getElementById('dc_fouille_timer');
    const lockBtn = document.getElementById('dc_lock_btn');
    const historyBtn = document.getElementById('dc_history_btn');

    // restore position & lock
    let locked = localStorage.getItem(STORAGE_KEY_LOCK) === 'true';
    const savedPos = localStorage.getItem(STORAGE_KEY_POS);
    if (savedPos) {
      try {
        const p = JSON.parse(savedPos);
        if (typeof p.left === 'number' && typeof p.top === 'number') {
          container.style.left = p.left + 'px';
          container.style.top = p.top + 'px';
          container.style.right = 'auto';
          container.style.position = 'fixed';
        }
      } catch (e) {}
    }
    function applyLockUI() {
      if (locked) { lockBtn.textContent = 'Unlock'; container.style.cursor = 'default'; }
      else { lockBtn.textContent = 'Lock'; container.style.cursor = 'grab'; }
    }
    applyLockUI();

    lockBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      locked = !locked;
      localStorage.setItem(STORAGE_KEY_LOCK, locked ? 'true' : 'false');
      applyLockUI();
    });

    historyBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleHistoryPanel();
    });

    // drag handlers
    let isDragging = false;
    let startX = 0, startY = 0, origX = 0, origY = 0;
    function savePosition() {
      try {
        const rect = container.getBoundingClientRect();
        localStorage.setItem(STORAGE_KEY_POS, JSON.stringify({ left: rect.left, top: rect.top }));
      } catch (e) {}
    }
    function onPointerDown(e) {
      if (locked) return;
      e.preventDefault();
      isDragging = true;
      container.style.cursor = 'grabbing';
      const rect = container.getBoundingClientRect();
      origX = rect.left; origY = rect.top;
      if (e.type === 'touchstart') { startX = e.touches[0].clientX; startY = e.touches[0].clientY; }
      else { startX = e.clientX; startY = e.clientY; }
      document.addEventListener('mousemove', onPointerMove);
      document.addEventListener('mouseup', onPointerUp);
      document.addEventListener('touchmove', onPointerMove, { passive: false });
      document.addEventListener('touchend', onPointerUp);
    }
    function onPointerMove(e) {
      if (!isDragging) return;
      e.preventDefault();
      const clientX = e.type.startsWith('touch') ? e.touches[0].clientX : e.clientX;
      const clientY = e.type.startsWith('touch') ? e.touches[0].clientY : e.clientY;
      const dx = clientX - startX, dy = clientY - startY;
      let newLeft = origX + dx, newTop = origY + dy;
      const pad = 6, w = container.offsetWidth, h = container.offsetHeight;
      newLeft = Math.max(pad, Math.min(window.innerWidth - w - pad, newLeft));
      newTop = Math.max(pad, Math.min(window.innerHeight - h - pad, newTop));
      container.style.left = newLeft + 'px';
      container.style.top = newTop + 'px';
      container.style.right = 'auto'; container.style.bottom = 'auto'; container.style.position = 'fixed';
    }
    function onPointerUp() {
      if (!isDragging) return;
      isDragging = false;
      container.style.cursor = locked ? 'default' : 'grab';
      document.removeEventListener('mousemove', onPointerMove);
      document.removeEventListener('mouseup', onPointerUp);
      document.removeEventListener('touchmove', onPointerMove);
      document.removeEventListener('touchend', onPointerUp);
      savePosition();
    }

    container.addEventListener('mousedown', onPointerDown);
    container.addEventListener('touchstart', onPointerDown, { passive: false });

    container.addEventListener('dblclick', () => {
      container.style.right = '12px';
      container.style.top = '12px';
      container.style.left = 'auto';
      container.style.position = 'fixed';
      savePosition();
    });
  }

  /* -------------------------
     Initialisation
     ------------------------- */
  function initWhenReady() {
    createHUD();
    injectStyles();
    setupHUDInteractions();
    setTimeout(setupInventoryObservers, 800);
    let attempts = 0;
    const maxAttempts = 40;
    const iv = setInterval(() => {
      attempts++;
      if (setupActionObserver()) {
        clearInterval(iv);
      } else if (attempts >= maxAttempts) {
        clearInterval(iv);
      }
    }, 500);
  }

  // start
  initWhenReady();

})();