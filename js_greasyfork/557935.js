// ==UserScript==
// @name         Popmundo - Gerenciador de Redes
// @namespace    http://tampermonkey.net/
// @version      13.17
// @description  xxx
// @author       Chris Popper
// @match        *://*.popmundo.com/World/Popmundo.aspx/Character*
// @match        *://*.popmundo.com/World/Popmundo.aspx/Artist/InviteArtist/*
// @match        *://*.popmundo.com/World/Popmundo.aspx/Company/LocaleMoneyTransfer/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/557935/Popmundo%20-%20Gerenciador%20de%20Redes.user.js
// @updateURL https://update.greasyfork.org/scripts/557935/Popmundo%20-%20Gerenciador%20de%20Redes.meta.js
// ==/UserScript==

/* global $, __doPostBack */

(async function () {
  'use strict';

  // --- Injeção do Font Awesome ---
  const faLink = document.createElement('link');
  faLink.rel = 'stylesheet';
  faLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css';
  document.head.appendChild(faLink);

  // --- Constantes ---
  const TOUR_TASKS_KEY = 'tour_tasks_queue';
  const CLUB_DATA_KEY = 'my_club_schedules_v3';
  const FINANCE_SNAPSHOT_KEY = 'popmundo_finance_snapshot_v1';

  const normalizeString = (str) =>
    str ? str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') : '';

  function normalizePopmundoUrl(url) {
    if (!url || !url.includes('popmundo.com')) return url;
    const currentHost = window.location.host;
    try {
      const urlObj = new URL(url);
      urlObj.host = currentHost;
      return urlObj.toString();
    } catch (e) {
      return url;
    }
  }

  // --- Estilos Globais (base) ---
  GM_addStyle(`
    #automation-panel-compact { background-color: #f0f0f0; border: 1px solid #dcdcdc; border-radius: 6px; padding: 15px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.08); font-family: Arial, sans-serif; font-size: 13px; }
    .panel-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
    .panel-header h2 { margin: 0; font-size: 16px; color: #333; }
    #config-container { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px; padding: 10px; border: 1px dashed #ccc; border-radius: 5px; background: #fafafa; }
    .config-item label { display: block; font-weight: bold; margin-bottom: 4px; font-size: 11px; color: #555; }
    .config-item-full { grid-column: 1 / -1; }
    .price-mode-selector { display: flex; gap: 10px; align-items: center; margin-bottom: 10px; }
    .manual-price-controls { display: flex; align-items: center; }
    .manual-price-controls button { background: none; border: none; cursor: pointer; font-size: 14px; padding: 0 8px; color: #333; }
    input[type="number"], input[type="text"], textarea, select, input[type="date"], input[type="time"] { width: 100%; padding: 6px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; }
    textarea { resize: vertical; min-height: 120px; }
    .action-buttons { display: flex; gap: 8px; margin-top: 15px; flex-wrap: wrap; align-items: center; justify-content: center; }
    .action-buttons button { display: inline-flex; align-items: center; justify-content: center; flex-grow: 0; padding: 5px 10px; border: 1px solid #555; border-radius: 4px; font-weight: bold; font-size: 11px; cursor: pointer; transition: all 0.2s; background: linear-gradient(to bottom, #f7f7f7, #e3e3e3); color: #333; text-shadow: 1px 1px 1px #fff; white-space: nowrap; }
    .action-buttons button:hover { background: linear-gradient(to bottom, #e3e3e3, #d1d1d1); border-color: #333; }
    .btn-group-nowrap { display: flex; gap: 8px; flex-wrap: nowrap; }
    button:disabled { background: #e9ecef !important; border-color: #ccc !important; color: #999 !important; cursor: not-allowed; opacity: 0.7; }
    #progress-bar-container { width: 100%; background-color: #e9ecef; border-radius: 10px; margin: 8px 0; overflow: hidden; }
    #progress-bar { width: 0%; height: 12px; background-color: #28a745; transition: width 0.5s ease; }
    .helper-links { display: flex; justify-content: space-between; margin-bottom: 10px; }
    .helper-links span, .helper-links a { color: #666; text-decoration: none; border-bottom: 1px dotted #666; font-size: 11px; cursor: pointer; }
    #mapping-status, #artist-fetch-status { font-size: 11px; color: #0056b3; margin-top: 5px; text-align: center; height: 16px; }
    #activity-log-container { display: none; background-color: #fff; border: 1px solid #ddd; border-radius: 4px; padding: 10px; margin-top: 5px; max-height: 250px; overflow-y: auto; }
    #activity-log-container ul { list-style-type: none; padding: 0; margin: 0; }
    #activity-log-container li { margin-bottom: 5px; white-space: nowrap; font-size: 12px; }
    .log-entry.success { color: #28a745; } .log-entry.failure { color: #dc3545; } .log-entry.info { color: #17a2b8; }
    .log-timestamp { color: #6c757d; font-size: 10px; margin-right: 5px; }
    #automation-iframe { display: none; border: 1px solid red; width: 100%; height: 300px; }
    #automation-panel-compact i[class*="fa-"], #automation-results-container i[class*="fa-"] { margin-right: 8px; }
    #automation-results-container { display: none; margin-top: 15px; padding: 15px; border: 1px solid #c5c5c5; border-radius: 5px; background-color: #f9f9f9; max-height: 400px; overflow-y: auto;}
    #tour-list-container { margin-top: 15px; max-height: 250px; overflow-y: auto; padding-right: 5px; }
    .tour-task-item { display: flex; justify-content: space-between; align-items: center; background-color: #fff; border: 1px solid #ddd; border-radius: 4px; padding: 8px 12px; margin-bottom: 8px; }
    .tour-task-info { font-size: 12px; }
    .tour-task-info strong { color: #0056b3; }
    .tour-task-info span { color: #666; margin-left: 10px; }
    .tour-task-actions button { background: none; border: none; cursor: pointer; font-size: 14px; padding: 2px 5px; }
    .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); z-index: 1000; display: flex; align-items: center; justify-content: center; }
    .modal-content { background: #fff; padding: 25px; border-radius: 8px; width: 90%; max-width: 500px; box-shadow: 0 5px 15px rgba(0,0,0,0.3); }
    .modal-content h3 { margin-top: 0; font-size: 16px; border-bottom: 1px solid #eee; padding-bottom: 10px; margin-bottom: 15px; }
    .modal-content textarea, .modal-content input { min-height: 100px; font-size: 13px; }
    .modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 15px; }
    .tabs-container { display: flex; gap: 5px; margin-bottom: 15px; border-bottom: 2px solid #ccc; }
    .tab-button { padding: 10px 20px; border: none; background: none; cursor: pointer; font-weight: bold; font-size: 13px; color: #666; border-bottom: 3px solid transparent; transition: all 0.2s; }
    .tab-button:hover { color: #333; background: #f0f0f0; }
    .tab-button.active { color: #0056b3; border-bottom-color: #0056b3; background: #f9f9f9; }
    .tab-content { display: none; }
    .tab-content.active { display: block; }
    /* AVAILABILITY CHECKER STYLES */
    #availability-results { margin-top: 15px; border: 1px solid #ddd; background: #fff; padding: 10px; max-height: 300px; overflow-y: auto; border-radius: 4px; }
    .check-item { display: flex; justify-content: space-between; padding: 6px; border-bottom: 1px solid #eee; font-size: 11px; }
    .check-item:last-child { border-bottom: none; }
    .check-item.ok { background: #f0fff4; }
    .check-item.error { background: #fff5f5; }
    .check-status-free { color: green; font-weight: bold; }
    .check-status-busy { color: red; font-weight: bold; }
    .check-status-unknown { color: orange; font-weight: bold; }
    /* FINANCE STYLES */
    .input-sending { background-color: #d4edda !important; border-color: #28a745 !important; }
    .input-taking { background-color: #f8d7da !important; border-color: #dc3545 !important; }
    #sum-value { font-weight: bold; font-size: 14px; }
    .profit-indicator { font-size: 10px; margin-left: 5px; font-weight: bold; padding: 1px 4px; border-radius: 3px; display: inline-block; vertical-align: middle; }
    .profit-plus { color: #155724; background-color: #d4edda; border: 1px solid #c3e6cb; }
    .profit-minus { color: #721c24; background-color: #f8d7da; border: 1px solid #f5c6cb; }
    .profit-neutral { color: #856404; background-color: #fff3cd; border: 1px solid #ffeeba; }
  `);

  // --- Estilos Compactos (override visual) ---
  GM_addStyle(`
    :root{
      --pm-bg:#f6f7f9;
      --pm-card:#ffffff;
      --pm-border:#d7dde6;
      --pm-text:#1f2937;
      --pm-muted:#6b7280;
      --pm-accent:#2563eb;
      --pm-ok:#16a34a;
      --pm-bad:#dc2626;
      --pm-radius:10px;
      --pm-gap:8px;
    }

    #automation-panel-compact{
      background:var(--pm-bg);
      border:1px solid var(--pm-border);
      border-radius:var(--pm-radius);
      padding:10px;
      margin-bottom:14px;
      box-shadow:0 1px 2px rgba(0,0,0,.06);
      font-family:system-ui,-apple-system,"Segoe UI",Arial,sans-serif;
      font-size:12px;
      color:var(--pm-text);
    }

    #automation-panel-compact i[class*="fa-"],
    #automation-results-container i[class*="fa-"]{ margin-right:6px; }

    .panel-header{ margin-bottom:8px; }
    .panel-header h2{
      margin:0;
      font-size:13px;
      display:flex;
      align-items:center;
      gap:6px;
    }

    .tabs-container{
      display:flex;
      gap:6px;
      margin-bottom:10px;
      border-bottom:1px solid var(--pm-border);
    }
    .tab-button{
      padding:6px 10px;
      font-size:11px;
      border:none;
      background:transparent;
      cursor:pointer;
      color:var(--pm-muted);
      border-bottom:2px solid transparent;
      border-radius:8px 8px 0 0;
    }
    .tab-button:hover{ background:rgba(0,0,0,.04); color:var(--pm-text); }
    .tab-button.active{ color:var(--pm-accent); border-bottom-color:var(--pm-accent); background:rgba(37,99,235,.06); }

    .pm-section{
      background:var(--pm-card);
      border:1px solid var(--pm-border);
      border-radius:var(--pm-radius);
      padding:10px;
      margin-bottom:10px;
    }
    .pm-section h3{
      margin:0 0 8px 0;
      font-size:12px;
      color:var(--pm-text);
      display:flex;
      align-items:center;
      gap:6px;
    }

    #config-container{
      display:grid;
      grid-template-columns:repeat(3, minmax(0, 1fr));
      gap:var(--pm-gap);
      margin:0;
      padding:0;
      border:none;
      background:transparent;
    }
    @media (max-width: 980px){
      #config-container{ grid-template-columns:1fr; }
    }

    .config-item label{
      font-size:10px;
      font-weight:700;
      color:#4b5563;
      margin-bottom:4px;
    }

    input[type="number"], input[type="text"], select, input[type="date"], input[type="time"]{
      width:100%;
      padding:5px 8px;
      height:28px;
      border:1px solid #cfd6e0;
      border-radius:8px;
      box-sizing:border-box;
      background:#fff;
      font-size:12px;
    }
    textarea{
      width:100%;
      padding:8px;
      border:1px solid #cfd6e0;
      border-radius:8px;
      box-sizing:border-box;
      min-height:85px;
      font-size:12px;
    }

    .price-mode-selector{ gap:8px; margin:0 0 6px 0; }
    .manual-price-controls button{ font-size:13px; padding:0 6px; }

    .action-buttons{
      display:flex;
      gap:6px;
      flex-wrap:wrap;
      align-items:center;
      justify-content:flex-start;
      margin-top:8px;
    }
    .action-buttons button{
      height:28px;
      padding:4px 10px;
      border-radius:8px;
      font-size:11px;
      border:1px solid #475569;
      background:linear-gradient(#fff,#eef2f7);
      color:#111827;
      text-shadow:none;
    }
    .action-buttons button:hover{ background:linear-gradient(#eef2f7,#e5eaf2); }

    #progress-bar-container{ margin:8px 0; }
    #progress-bar{ height:10px; }

    .tour-task-item{
      padding:6px 10px;
      margin-bottom:6px;
      border-radius:10px;
    }
    .tour-task-info{ font-size:11px; }
    .tour-task-actions button{ font-size:14px; }

    #activity-log-container{
      max-height:180px;
      padding:8px;
    }

    #availability-results{ border-radius:10px; }
    .check-item{ font-size:11px; }
  `);

  // --- Variáveis Globais (Tour Manager) ---
  let isAutomationRunning = false;
  let tourTasks = [];

  const cityCodeMap = {
    AMS: 'Amsterdã', ANK: 'Ankara', ANT: 'Antália', BAK: 'Baku', BCN: 'Barcelona', BEL: 'Belgrado', BER: 'Berlim',
    BRX: 'Bruxelas', BUC: 'Bucareste', BUD: 'Budapeste', BUE: 'Buenos Aires', CDM: 'Cidade do México', CHI: 'Chicago',
    CPH: 'Copenhague', DUB: 'Dubrovnik', DBN: 'Dublin', GLA: 'Glasgow', HEL: 'Helsinque', IST: 'Istambul', IZM: 'Izmir',
    JKT: 'Jacarta', JNB: 'Joanesburgo', KYV: 'Kyiv', LAX: 'Los Angeles', LDN: 'Londres', MAD: 'Madri', MEL: 'Melbourne',
    MIL: 'Milão', MNL: 'Manila', MOS: 'Moscou', MTL: 'Montreal', NSH: 'Nashville', NYC: 'Nova Iorque', PAR: 'Paris',
    POR: 'Porto', RIO: 'Rio de Janeiro', ROM: 'Roma', SAO: 'São Paulo', SAR: 'Sarajevo', SEA: 'Seattle', SIN: 'Cingapura',
    SOF: 'Sofia', STO: 'Estocolmo', TKY: 'Tóquio', TLL: 'Tallinn', TOR: 'Toronto', TRO: 'Tromsø', VIL: 'Vilnius',
    WAR: 'Varsóvia', XAN: 'Xangai'
  };

  const cityNameToCodeMap = Object.entries(cityCodeMap).reduce((acc, [code, name]) => {
    acc[normalizeString(name)] = code;
    if (name === 'Nova Iorque') acc['nova york'] = code;
    if (name === 'Tromsø') acc['tromso'] = code;
    return acc;
  }, {});

  const ticketPricesByFame = {
    0: '5', 1: '6', 2: '7', 3: '8', 4: '9', 5: '11', 6: '13', 7: '15', 8: '20', 9: '25',
    10: '30', 11: '40', 12: '45', 13: '50', 14: '55', 15: '60', 16: '65', 17: '70', 18: '75', 19: '80',
    20: '90', 21: '100', 22: '105', 23: '110', 24: '115', 25: '120', 26: '125'
  };

  // --- Funções de Dados ---
  async function saveTourTasks() { await GM_setValue(TOUR_TASKS_KEY, JSON.stringify(tourTasks)); }

  async function loadTourTasks() {
    const savedTasks = await GM_getValue(TOUR_TASKS_KEY, '[]');
    try { tourTasks = JSON.parse(savedTasks); } catch (e) { tourTasks = []; }
  }

  async function logActivity(status, message, artistName = '') {
    let log = JSON.parse(await GM_getValue('activity_log', '[]'));
    const artistPrefix = artistName ? `<span style="font-weight: bold; color: #0056b3;">[${artistName}]</span> ` : '';
    log.unshift({
      timestamp: new Date().toLocaleTimeString('pt-BR'),
      status,
      message: `${artistPrefix}${message}`
    });
    if (log.length > 200) log.pop();
    await GM_setValue('activity_log', JSON.stringify(log));
    displayLog();
  }

  async function displayLog() {
    const logContainer = $('#activity-log-container');
    if (!logContainer.length) return;
    let log = JSON.parse(await GM_getValue('activity_log', '[]'));
    logContainer.html(
      log.length > 0
        ? '<ul>' + log.map(e =>
          `<li class="log-entry ${e.status}"><span class="log-timestamp">[${e.timestamp}]</span>${e.message}</li>`
        ).join('') + '</ul>'
        : '<p style="color:#6b7280; margin:0;">Nenhuma atividade.</p>'
    );
    if (logContainer.is(':visible')) logContainer.scrollTop(0);
  }

  // --- Inicialização ---
  $(document).ready(async function () {
    const url = window.location.href;
    if ((url.includes('/Character') || url.includes('/Artist/InviteArtist/')) && window.self === window.top) {
      await initInviteModule();
    } else if (url.includes('/Company/LocaleMoneyTransfer/')) {
      await initFinanceModule();
    }
  });

  // =================================================================================================
  // MÓDULO 1: GERENCIADOR DE TURNÊS
  // =================================================================================================
  async function initInviteModule() {
    await loadTourTasks();
    createInviteConfigUI();
    addMenuLink();
    renderTourList();
    await populateClubNetworks();
    displayLog();
  }

  function addMenuLink() {
    const menu = $("#ppm-sidemenu h3.menu:contains('Carreira & Atividade')").next('ul');
    if (menu.length && $('#toggle-automation-panel-link').length === 0) {
      const menuItemHTML = `
        <li>
          <a id="toggle-automation-panel-link" href="#" style="color: #2563eb !important;" title="Abrir/Fechar o Gerenciador">
            Gerenciador de Turnês
          </a>
        </li>`;
      menu.append(menuItemHTML);
      $('#toggle-automation-panel-link').on('click', function (e) {
        e.preventDefault();
        $('#automation-panel-compact').slideToggle('fast', function () {
          if ($(this).is(':visible')) {
            $('html, body').animate({ scrollTop: $(this).offset().top - 70 }, 500);
          }
        });
      });
    }
  }

  function createInviteConfigUI() {
    const uiHTML = `
      <div id="automation-panel-compact" style="display:none;">
        <div class="panel-header">
          <h2><i class="fa-solid fa-plane-departure"></i> Turnês & Redes</h2>
        </div>

        <div class="tabs-container">
          <button type="button" class="tab-button active" data-tab="gerenciador-tab" title="Gerenciador">
            <i class="fa-solid fa-list-check"></i> Gerenciador
          </button>
          <button type="button" class="tab-button" data-tab="agenda-tab" title="Scanner de clubes">
            <i class="fa-solid fa-radar"></i> Scanner
          </button>
        </div>

        <!-- TAB GERENCIADOR -->
        <div id="gerenciador-tab" class="tab-content active">
          <div class="pm-section">
            <h3><i class="fa-solid fa-calendar-plus"></i> Adicionar turnê</h3>

            <div id="config-container">
              <div class="config-item-full">
                <label for="artist-url-input"><i class="fa-solid fa-user-tag"></i> URL do Artista</label>
                <input type="text" id="artist-url-input" placeholder="Cole a URL do artista">
              </div>

              <div class="config-item-full">
                <label for="club-network-select"><i class="fa-solid fa-sitemap"></i> Rede de Clubes</label>
                <select id="club-network-select"></select>
              </div>

              <div class="config-item">
                <label for="artist-cut"><i class="fa-solid fa-percent"></i> Parte do artista (%)</label>
                <input type="number" id="artist-cut" value="50" min="10" max="90">
              </div>

              <div class="config-item">
                <label for="rider-limit"><i class="fa-solid fa-file-invoice-dollar"></i> Limite do rider</label>
                <input type="number" id="rider-limit" value="1500">
              </div>

              <div class="config-item">
                <label><i class="fa-solid fa-ticket"></i> Preço do ingresso</label>
                <div class="price-mode-selector">
                  <input type="radio" id="price-mode-manual" name="price-mode" value="manual" checked>
                  <label for="price-mode-manual">Manual</label>

                  <input type="radio" id="price-mode-auto" name="price-mode" value="auto">
                  <label for="price-mode-auto">Fama</label>
                </div>

                <div id="manual-price-container" class="manual-price-controls">
                  <button type="button" id="btn-price-minus" title="Diminuir"><i class="fa-solid fa-minus"></i></button>
                  <input type="number" id="ticket-price" value="10">
                  <button type="button" id="btn-price-plus" title="Aumentar"><i class="fa-solid fa-plus"></i></button>
                </div>
              </div>

              <div class="config-item-full" style="background:#eef6ff; border:1px solid #cfe3ff; padding:10px; border-radius:10px;">
                <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; margin-bottom:8px;">
                  <label style="margin:0; font-size:14px; color:#1f2937;">
                     <i class="fa-solid fa-wand-magic-sparkles"></i> GERADOR DE DATAS
                          </label>
                  </label>
                  <label style="font-size:11px; cursor:pointer; display:flex; align-items:center; gap:6px; background:#fff; padding:3px 8px; border-radius:999px; border:1px solid #cfd6e0;">
                    <input type="checkbox" id="chk-double-mode" style="width:auto; margin:0;">
                    Modo Double Tour
                  </label>
                </div>

                <div style="display:flex; gap:8px; align-items:flex-end; flex-wrap:wrap;">
                  <div style="flex:1; min-width:140px;">
                    <label style="font-size:10px;">Data início</label>
                    <input type="date" id="auto-date-start">
                  </div>

                  <div style="width:90px;">
                    <label style="font-size:10px;">Hora 1</label>
                    <input type="time" id="auto-time-1" value="20:00">
                  </div>

                  <div id="container-time-2" style="width:90px; display:none;">
                    <label style="font-size:10px; color:#d63384;">Hora 2</label>
                    <input type="time" id="auto-time-2" value="23:00">
                  </div>

                  <div class="action-buttons" style="margin:0;">
                    <button type="button" id="btn-generate-route" title="Gerar rota">
                      <i class="fa-solid fa-bolt"></i> Gerar
                    </button>
                    <button type="button" id="btn-check-availability" title="Verificar disponibilidade" style="border-color:#2563eb;">
                      <i class="fa-solid fa-magnifying-glass"></i> Verificar
                    </button>
                  </div>
                </div>
              </div>

              <div class="config-item-full">
                <label for="route-input-compact"><i class="fa-solid fa-route"></i> Rota</label>
                <textarea id="route-input-compact" placeholder="Cidade, dd/mm/aaaa, hh:mm (uma por linha)"></textarea>
              </div>

              <div id="availability-results" style="display:none; grid-column:1 / -1;"></div>
            </div>

            <div id="artist-fetch-status" style="margin-top:6px;"></div>

            <div class="action-buttons" style="justify-content:flex-end;">
              <button type="button" id="add-tour-btn" title="Adicionar esta turnê à fila">
                <i class="fa-solid fa-plus"></i> Adicionar à fila
              </button>
            </div>
          </div>

          <div class="pm-section">
            <h3><i class="fa-solid fa-box-archive"></i> Fila (<span id="tour-count">0</span>)</h3>
            <div id="tour-list-container"></div>

            <div id="automation-results-container"></div>
            <div id="mapping-status"></div>

            <div id="progress-bar-container" style="display:none;">
              <div id="progress-bar"></div>
            </div>

            <div class="action-buttons">
              <button type="button" id="map-networks-btn" title="Mapear redes/clubes">
                <i class="fa-solid fa-map-location-dot"></i> Mapear redes
              </button>

              <button type="button" id="toggle-automation-btn" title="Iniciar/Parar fila">
                <i class="fa-solid fa-play"></i> Iniciar
              </button>

              <button type="button" id="toggle-log" title="Abrir/Fechar log">
                <i class="fa-solid fa-clipboard-list"></i> Log
              </button>

              <button type="button" id="clear-all-btn" title="Limpar fila e log">
  <i class="fa-solid fa-broom"></i> Limpar fila e log
</button>
            </div>

            <div id="activity-log-container" style="display:none; margin-top:8px;"></div>
          </div>
        </div>

        <!-- TAB SCANNER -->
        <div id="agenda-tab" class="tab-content">
          <div class="pm-section" style="text-align:center;">
            <h3 style="justify-content:center;"><i class="fa-solid fa-radar"></i> Scanner</h3>
            <p style="font-size:11px; color:var(--pm-muted); margin:0 0 10px 0;">
              Atualiza o banco de dados dos seus clubes.
            </p>

            <div style="display:flex; flex-direction:column; gap:8px; max-width:320px; margin:0 auto;">
              <button type="button" id="btn-load-companies-scan">
                <i class="fa-solid fa-building"></i> 1) Carregar empresas
              </button>

              <select id="scan-company-select" style="display:none;">
                <option value="">Selecione uma empresa...</option>
              </select>

              <button type="button" id="btn-scan-selected-company" style="display:none; border-color:var(--pm-ok);">
                <i class="fa-solid fa-radar"></i> 2) Escanear selecionada
              </button>
            </div>

            <div id="scan-status" style="margin-top:10px; font-size:11px; color:var(--pm-muted); min-height:18px;"></div>
          </div>
        </div>
      </div>

      <div id="edit-tour-modal" class="modal-overlay" style="display:none;">
        <div class="modal-content">
          <h3 id="edit-modal-title"></h3>
          <textarea id="edit-modal-textarea"></textarea>
          <div class="modal-actions">
            <button type="button" id="cancel-tour-edit-btn">Cancelar</button>
            <button type="button" id="save-tour-changes-btn">Salvar</button>
          </div>
        </div>
      </div>
    `;

    $('#ppm-content').prepend(uiHTML);

    $('.tab-button').on('click', function () {
      const targetTab = $(this).data('tab');
      $('.tab-button').removeClass('active');
      $(this).addClass('active');
      $('.tab-content').removeClass('active');
      $(`#${targetTab}`).addClass('active');
    });

    $('input[name="price-mode"]').on('change', function () {
      $('#manual-price-container').toggle(this.value === 'manual');
    });

    $('#chk-double-mode').on('change', function () {
      if ($(this).is(':checked')) $('#container-time-2').show();
      else $('#container-time-2').hide();
    });

    $('#btn-price-plus').on('click', () => $('#ticket-price').val(parseInt($('#ticket-price').val() || 0, 10) + 5));
    $('#btn-price-minus').on('click', () => $('#ticket-price').val(Math.max(0, parseInt($('#ticket-price').val() || 0, 10) - 5)));

    $('#add-tour-btn').on('click', addTourTask);

    $('#btn-generate-route').on('click', function () {
      const generated = generateRouteFromInputs();
      if (generated) {
        $('#route-input-compact').val(generated.text);
        flashButton($(this));
      }
    });

    $('#btn-check-availability').on('click', checkRouteAvailability);

    $('#toggle-automation-btn').on('click', toggleAutomation);
    $('#map-networks-btn').on('click', startBackgroundNetworkMapping);

    $('#toggle-log').on('click', () => $('#activity-log-container').slideToggle());

    $('#clear-all-btn').on('click', async () => {
  if (!confirm('Limpar toda a fila e o log?')) return;

  // limpa fila
  tourTasks = [];
  await saveTourTasks();
  renderTourList();

  // limpa log
  await GM_deleteValue('activity_log');
  await displayLog();

  // feedback sem recriar o log
  $('#mapping-status').text('Fila e log limpos.');
  setTimeout(() => $('#mapping-status').text(''), 3000);
});

    $('#btn-load-companies-scan').on('click', loadCompaniesForScanner);
    $('#btn-scan-selected-company').on('click', function () {
      const selectedUrl = $('#scan-company-select').val();
      if (selectedUrl) startClubScanner(selectedUrl);
      else alert('Selecione uma empresa na lista.');
    });

    $('#tour-list-container').on('click', '.edit-task-btn', openEditModal);
    $('#tour-list-container').on('click', '.remove-task-btn', function () {
      removeTourTask($(this).data('task-id'));
    });

    $('#save-tour-changes-btn').on('click', async function () {
      const taskId = $('#edit-tour-modal').data('current-task-id');
      const task = tourTasks.find(t => t.id == taskId);
      if (task) {
        const newRouteText = $('#edit-modal-textarea').val().trim();
        task.shows = parseRouteText(newRouteText, task.artistName);
        await saveTourTasks();
        renderTourList();
        logActivity('info', `Rota para ${task.artistName} atualizada.`);
        $('#edit-tour-modal').fadeOut(200);
      }
    });

    $('#cancel-tour-edit-btn').on('click', () => $('#edit-tour-modal').fadeOut(200));
  }

  function flashButton(btn) {
    const originalHtml = btn.html();
    btn.html('<i class="fa-solid fa-check"></i>').css('background', '#d4edda');
    setTimeout(() => { btn.html(originalHtml).css('background', ''); }, 900);
  }

  function generateRouteFromInputs() {
    const rawText = $('#route-input-compact').val().trim();
    const startDateStr = $('#auto-date-start').val();
    const time1 = $('#auto-time-1').val();
    const gap = 1;
    const isDoubleMode = $('#chk-double-mode').is(':checked');
    const time2 = $('#auto-time-2').val();

    if (!rawText) { alert('Cole as cidades na caixa de Rota.'); return null; }
    if (!startDateStr || !time1 || isNaN(gap)) { alert('Preencha Data e Intervalo.'); return null; }
    if (isDoubleMode && !time2) { alert('Preencha a Hora 2.'); return null; }

    const lines = rawText.split('\n').filter(line => line.trim() !== '');
    const newRoute = [];
    const checkList = [];

    const [year, month, day] = startDateStr.split('-').map(Number);
    let currentDate = new Date(year, month - 1, day);

    let isSecondSlot = false;

    lines.forEach(line => {
      let city = line.trim();
      if (city.includes('\t') || city.includes(';')) city = city.split(/[\t;]/)[0].trim();

      const t1Val = parseInt(time1.replace(':', ''), 10);
      const t2Val = parseInt(time2.replace(':', ''), 10);

      if (!isDoubleMode) {
        const d = String(currentDate.getDate()).padStart(2, '0');
        const m = String(currentDate.getMonth() + 1).padStart(2, '0');
        const y = currentDate.getFullYear();
        const fmtDate = `${d}/${m}/${y}`;
        newRoute.push(`${city}, ${fmtDate}, ${time1}`);
        checkList.push({ city: city, date: fmtDate, time: time1 });
        currentDate.setDate(currentDate.getDate() + gap);
      } else {
        if (!isSecondSlot) {
          const d = String(currentDate.getDate()).padStart(2, '0');
          const m = String(currentDate.getMonth() + 1).padStart(2, '0');
          const y = currentDate.getFullYear();
          const fmtDate = `${d}/${m}/${y}`;
          newRoute.push(`${city}, ${fmtDate}, ${time1}`);
          checkList.push({ city: city, date: fmtDate, time: time1 });
          isSecondSlot = true;
        } else {
          let showDate = new Date(currentDate);
          if (t2Val < t1Val) showDate.setDate(showDate.getDate() + 1);
          const d = String(showDate.getDate()).padStart(2, '0');
          const m = String(showDate.getMonth() + 1).padStart(2, '0');
          const y = showDate.getFullYear();
          const fmtDate = `${d}/${m}/${y}`;
          newRoute.push(`${city}, ${fmtDate}, ${time2}`);
          checkList.push({ city: city, date: fmtDate, time: time2 });
          isSecondSlot = false;
          currentDate.setDate(currentDate.getDate() + gap);
        }
      }
    });

    return { text: newRoute.join('\n'), list: checkList };
  }

  async function checkRouteAvailability() {
    const rawText = $('#route-input-compact').val().trim();
    const selectedNetwork = $('#club-network-select').val();

    if (!rawText) { alert('A rota está vazia.'); return; }
    if (!selectedNetwork) { alert('Selecione uma Rede de Clubes.'); return; }

    const allNetworksData = JSON.parse(await GM_getValue('all_networks_data', '{}'));
    const allowedLocaleIds = allNetworksData[selectedNetwork] || [];
    if (allowedLocaleIds.length === 0) { alert(`Rede "${selectedNetwork}" não mapeada.`); return; }

    const checkList = rawText.split('\n')
      .filter(line => line.trim())
      .map(line => {
        const parts = line.split(',').map(p => p.trim());
        if (parts.length >= 3) return { city: parts[0], date: parts[1], time: parts[2] };
        return null;
      })
      .filter(item => item !== null);

    if (checkList.length === 0) { alert('Formato inválido.'); return; }

    const rawData = await GM_getValue(CLUB_DATA_KEY, null);
    if (!rawData) { alert('Use o Scanner primeiro.'); return; }

    const data = JSON.parse(rawData);
    const localesEntries = Object.entries(data.locales);

    const resultsDiv = $('#availability-results');
    resultsDiv.show().html(`<h4 style="margin:0 0 8px 0;">Disponibilidade: <span style="color:#0056b3">${selectedNetwork}</span></h4>`);

    checkList.forEach(item => {
      const normCity = normalizeString(item.city);

      const myClubEntry = localesEntries.find(([id, clubData]) => {
        const isCorrectCity =
          normalizeString(clubData.cityName) === normCity ||
          normalizeString(clubData.cityName).includes(normCity);

        const isCorrectNetwork = allowedLocaleIds.includes(id);
        return isCorrectCity && isCorrectNetwork;
      });

      const div = $('<div class="check-item"></div>');
      let content = `<div><strong>${item.city}</strong> (${item.date} - ${item.time})</div>`;

      if (!myClubEntry) {
        div.addClass('error');
        content += `<div class="check-status-unknown"><i class="fa-solid fa-circle-question"></i> Não encontrado</div>`;
      } else {
        const [, myClub] = myClubEntry;
        const clash = myClub.bookings.find(b => b.date === item.date && b.time === item.time);
        if (clash) {
          div.addClass('error');
          content += `<div class="check-status-busy"><i class="fa-solid fa-xmark"></i> Ocupado</div>`;
        } else {
          div.addClass('ok');
          content += `<div class="check-status-free"><i class="fa-solid fa-check"></i> Livre (${myClub.name})</div>`;
        }
      }

      div.html(content);
      resultsDiv.append(div);
    });
  }

  async function loadCompaniesForScanner() {
    const btn = $('#btn-load-companies-scan');
    const status = $('#scan-status');
    btn.prop('disabled', true);
    status.text('Carregando empresas...');

    try {
      const iframe = createAndGetIframe();
      const companyWindow = await waitForIframeLoad(iframe, '/World/Popmundo.aspx/ChooseCompany');
      const companyRows = companyWindow.document.querySelectorAll('#tablecompanies tbody tr a[href*="/Company/"]');
      const select = $('#scan-company-select');
      select.empty().append('<option value="">Selecione...</option>');

      let found = false;
      companyRows.forEach(a => {
        select.append(`<option value="${a.href.replace('/Company/', '/Company/Locales/')}">${a.textContent.trim()}</option>`);
        found = true;
      });

      if (!found) {
        const localesLinkEl = companyWindow.document.querySelector('#ppm-sidemenu a[href*="/Company/Locales/"]');
        const companyName = $(companyWindow.document).find('.entityLogoNoImg h2').text().trim() || 'Minha Empresa';
        if (localesLinkEl) {
          select.append(`<option value="${localesLinkEl.href}">${companyName}</option>`);
          found = true;
        }
      }

      if (found) {
        select.show();
        $('#btn-scan-selected-company').show();
        status.text('Empresas carregadas.');
      } else {
        status.text('Nenhuma empresa encontrada.');
      }
    } catch (e) {
      console.error(e);
      status.text('Erro ao buscar empresas.');
    } finally {
      btn.prop('disabled', false);
    }
  }

  async function startClubScanner(specificCompanyUrl = null) {
    const status = $('#scan-status');
    status.text('Iniciando scan...');

    try {
      const iframe = createAndGetIframe();
      let companyUrlsToScan = [specificCompanyUrl];
      let myLocales = [];

      for (let i = 0; i < companyUrlsToScan.length; i++) {
        status.text('Buscando locais...');
        try {
          const locWindow = await waitForIframeLoad(iframe, companyUrlsToScan[i]);
          const links = locWindow.document.querySelectorAll('#tablelocales tbody tr a[href*="/Locale/Management/"]');
          links.forEach(a => myLocales.push({ id: a.href.split('/').pop(), name: a.textContent.trim() }));
        } catch (e) {
          console.warn('Erro ao ler empresa');
        }
      }

      if (myLocales.length === 0) {
        alert('Nenhum clube encontrado.');
        return;
      }

      const newSchedules = {};

      for (let i = 0; i < myLocales.length; i++) {
        const loc = myLocales[i];
        status.text(`Lendo agenda: ${loc.name} (${i + 1}/${myLocales.length})...`);
        const showUrl = `/World/Popmundo.aspx/Locale/ShowManagement/${loc.id}`;

        try {
          const showWindow = await waitForIframeLoad(iframe, showUrl);
          let cityName = 'Desconhecido';
          const cityLink = $(showWindow.document).find('div.localebox a[href^="/World/Popmundo.aspx/City/"]');
          if (cityLink.length) cityName = cityLink.text().trim();

          const booked = [];
          $(showWindow.document).find('#tableupcoming tbody tr').each(function () {
            const rawText = $(this).find('td').eq(0).text();
            const artist = $(this).find('td').eq(1).text().trim();
            const match = rawText.match(/(\d{2})\/(\d{2})\/(\d{4}),\s*(\d{2}:\d{2})/);
            if (match) booked.push({ date: `${match[1]}/${match[2]}/${match[3]}`, time: match[4], artist: artist });
          });

          newSchedules[loc.id] = { name: loc.name, cityName: cityName, bookings: booked };
          await new Promise(r => setTimeout(r, 300));
        } catch (e) {
          console.error(e);
        }
      }

      const oldRaw = await GM_getValue(CLUB_DATA_KEY, null);
      let finalData = { scanDate: new Date().getTime(), locales: {} };

      if (oldRaw) {
        try { finalData.locales = JSON.parse(oldRaw).locales || {}; } catch (e) { /* ignore */ }
      }

      finalData.locales = { ...finalData.locales, ...newSchedules };
      finalData.scanDate = new Date().getTime();

      await GM_setValue(CLUB_DATA_KEY, JSON.stringify(finalData));
      status.text('Concluído!');
      alert('Scan completo!');
    } catch (err) {
      console.error(err);
      status.text('Erro no processo.');
    }
  }

  function parseRouteText(routeText, artistName) {
    const lines = routeText.split('\n').filter(line => line.trim());
    const shows = [];

    for (const line of lines) {
      const parts = line.split(',').map(p => p.trim());
      if (parts.length < 3) continue;
      const cityName = parts[0];
      const date = parts[1];
      const time = parts[2];
      const normalizedCity = normalizeString(cityName);
      const cityCode = cityNameToCodeMap[normalizedCity];
      shows.push({ cityName: cityName, cityCode: cityCode || null, date: date, time: time, status: 'pending', artistName: artistName });
    }

    return shows;
  }

  async function addTourTask() {
    const artistUrlInput = $('#artist-url-input').val().trim();
    const artistUrl = normalizePopmundoUrl(artistUrlInput);
    const addButton = $('#add-tour-btn');
    const statusDiv = $('#artist-fetch-status');

    const artistIdMatch = artistUrlInput.match(/Artist\/(\d+)/);
    if (!artistIdMatch) { alert('URL do artista inválida.'); return; }
    const artistId = artistIdMatch[1];
    if (tourTasks.some(task => task.artistId === artistId)) { alert('Este artista já está na fila.'); return; }

    const settings = {
      selectedNetwork: $('#club-network-select').val(),
      artistCut: $('#artist-cut').val(),
      riderLimit: $('#rider-limit').val(),
      priceMode: $('input[name="price-mode"]:checked').val(),
      ticketPrice: $('#ticket-price').val()
    };

    const routeText = $('#route-input-compact').val().trim();
    if (!artistUrl || !settings.selectedNetwork || !routeText) { alert('Preencha todos os campos.'); return; }

    addButton.prop('disabled', true).html('<i class="fa-solid fa-spinner fa-spin"></i> Buscando...');
    statusDiv.text('Buscando dados...');

    try {
      const iframe = createAndGetIframe();
      const artistWindow = await waitForIframeLoad(
        iframe,
        artistUrl + (artistUrl.includes('?') ? '&' : '?') + '_=' + Date.now()
      );

      const artistName = $(artistWindow.document).find('h1').first().text().trim();
      if (!artistName) throw new Error('Nome não encontrado.');

      const shows = parseRouteText(routeText, artistName);
      const task = {
        id: Date.now(),
        artistId,
        artistName,
        settings,
        shows,
        successfulShows: [],
        failedShows: []
      };

      tourTasks.push(task);
      await saveTourTasks();
      renderTourList();

      $('#artist-url-input, #route-input-compact').val('');
      statusDiv.text(`Turnê para "${artistName}" adicionada!`).css('color', 'green');
      logActivity('info', `Turnê para ${artistName} adicionada à fila.`);
    } catch (error) {
      statusDiv.text('Falha ao buscar dados.').css('color', 'red');
      alert(`Falha: ${error.message}`);
    } finally {
      addButton.prop('disabled', false).html('<i class="fa-solid fa-plus"></i> Adicionar à fila');
      setTimeout(() => statusDiv.text(''), 5000);
    }
  }

  function renderTourList() {
    const container = $('#tour-list-container');
    container.empty();

    if (tourTasks.length === 0) {
      container.html('<p style="text-align:center; color:#6b7280; padding:12px; margin:0;">Fila vazia.</p>');
    } else {
      tourTasks.forEach(task => {
        const showCount = task.shows.length;
        const sentCount = task.shows.filter(s => s.status === 'sent').length;

        const taskHTML = `
          <div class="tour-task-item" id="task-${task.id}">
            <div class="tour-task-info">
              <strong>${task.artistName}</strong><br>
              <span><i class="fa-solid fa-road"></i>${showCount} shows (${sentCount} enviados)</span>
              <span><i class="fa-solid fa-sitemap"></i>${task.settings.selectedNetwork}</span>
            </div>
            <div class="tour-task-actions">
              <button type="button" class="edit-task-btn" data-task-id="${task.id}" title="Editar rota">
                <i class="fa-solid fa-pencil"></i>
              </button>
              <button type="button" class="remove-task-btn" data-task-id="${task.id}" title="Remover">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>
          </div>`;
        container.append(taskHTML);
      });
    }

    $('#tour-count').text(tourTasks.length);
  }

  async function removeTourTask(taskId) {
    tourTasks = tourTasks.filter(task => task.id !== taskId);
    await saveTourTasks();
    renderTourList();
  }

  function openEditModal() {
    const taskId = $(this).data('task-id');
    const task = tourTasks.find(t => t.id == taskId);
    if (task) {
      $('#edit-modal-title').text(`Editar Rota: ${task.artistName}`);
      const routeText = task.shows.map(s => `${s.cityName}, ${s.date}, ${s.time}`).join('\n');
      $('#edit-modal-textarea').val(routeText);
      $('#edit-tour-modal').data('current-task-id', taskId).fadeIn(200);
    }
  }

  async function toggleAutomation() {
    const toggleBtn = $('#toggle-automation-btn');

    if (isAutomationRunning) {
      isAutomationRunning = false;
      toggleBtn.prop('disabled', true).html('<i class="fa-solid fa-spinner fa-spin"></i> Parando...');
    } else {
      if (tourTasks.length === 0) { alert('Fila vazia.'); return; }

      for (const task of tourTasks) {
        if (task.shows.some(s => !s.cityCode)) {
          alert(`Erro: Cidade desconhecida na turnê de ${task.artistName}.`);
          return;
        }
      }

      await GM_deleteValue('activity_log');
      isAutomationRunning = true;

      $('#automation-panel-compact').find('input, textarea, select, button').not(toggleBtn).prop('disabled', true);
      toggleBtn.html('<i class="fa-solid fa-stop"></i> Parar').css({
        background: 'linear-gradient(to bottom, #ffcccc, #ff9999)',
        borderColor: '#dc3545'
      });

      $('#progress-bar-container').slideDown('fast');
      $('#activity-log-container').slideDown('fast', displayLog);

      runMasterAutomationLoop();
    }
  }

  async function runMasterAutomationLoop() {
    const totalShowsInQueue = tourTasks.flatMap(task => task.shows).length;
    let showsProcessed = 0;
    updateProgress(0, totalShowsInQueue);

    for (const task of tourTasks) {
      if (!isAutomationRunning) break;

      for (const currentShow of task.shows) {
        if (!isAutomationRunning) break;

        showsProcessed++;

        if (currentShow.status !== 'sent') {
          logActivity('info', `[${showsProcessed}/${totalShowsInQueue}] Processando: ${currentShow.cityName}`, task.artistName);

          const result = await processSingleShow(currentShow, task.settings, task.artistId);
          if (result === true) {
            task.successfulShows.push(currentShow);
            currentShow.status = 'sent';
          } else {
            task.failedShows.push(currentShow);
          }

          await saveTourTasks();
          renderTourList();
        }

        updateProgress(showsProcessed, totalShowsInQueue);

        if (isAutomationRunning && showsProcessed < totalShowsInQueue) {
          await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
        }
      }
    }

    stopAutomation(isAutomationRunning);
  }

  async function stopAutomation(graceful = true) {
    isAutomationRunning = false;
    logActivity(graceful ? 'success' : 'failure', graceful ? 'Automação concluída.' : 'Automação interrompida.');

    $('#automation-panel-compact').find('input, textarea, select, button').prop('disabled', false);

    const toggleBtn = $('#toggle-automation-btn');
    toggleBtn.html('<i class="fa-solid fa-play"></i> Iniciar').prop('disabled', false).css({ background: '', borderColor: '' });

    $('#progress-bar-container').slideUp('fast', () => updateProgress(0, 1));
  }

  function updateProgress(current, total) {
    const percent = total > 0 ? (current / total) * 100 : 0;
    $('#progress-bar').css('width', percent + '%');
  }

  function createAndGetIframe() {
    $('#automation-iframe').remove();
    $('body').append('<iframe id="automation-iframe" name="automation-iframe-name"></iframe>');
    return $('#automation-iframe')[0];
  }

  function waitForIframeLoad(iframe, url) {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('Timeout do Iframe')), 20000);

      iframe.onload = () => {
        clearTimeout(timeout);
        setTimeout(() => resolve(iframe.contentWindow), 600);
      };

      iframe.onerror = () => {
        clearTimeout(timeout);
        reject(new Error('Falha ao carregar iframe.'));
      };

      iframe.src = url;
    });
  }

  function waitForPostBack(iframe) {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('Timeout do PostBack')), 20000);

      iframe.onload = () => {
        clearTimeout(timeout);
        setTimeout(() => resolve(iframe.contentWindow), 600);
      };

      iframe.onerror = () => {
        clearTimeout(timeout);
        reject(new Error('Falha no PostBack.'));
      };
    });
  }

  async function processSingleShow(show, settings, artistId) {
    try {
      const iframe = createAndGetIframe();
      const initialWindow = await waitForIframeLoad(iframe, `/World/Popmundo.aspx/Artist/InviteArtist/${artistId}`);
      const $initialDoc = $(initialWindow.document);

      if (!$initialDoc.find('#aspnetForm').attr('action')?.includes(artistId)) throw new Error('Página incorreta.');

      const artistVenues = Array.from($initialDoc.find('#ctl00_cphLeftColumn_ctl01_ddlVenues option'))
        .map(opt => ({ id: $(opt).val(), name: $(opt).text().trim() }))
        .filter(v => v.id);

      const mappedData = JSON.parse(await GM_getValue('all_networks_data', '{}'));
      const allowedLocaleIds = mappedData[settings.selectedNetwork] || [];

      const normalizedRouteCityName = normalizeString(show.cityName);
      const targetVenue = artistVenues.find(venue =>
        allowedLocaleIds.includes(venue.id) &&
        normalizeString(venue.name).includes(`(${normalizedRouteCityName})`)
      );

      if (!targetVenue) {
        logActivity('failure', `Clube para ${show.cityName} não encontrado na rede.`, show.artistName);
        return false;
      }
      logActivity('info', `Clube: ${targetVenue.name}`, show.artistName);

      $initialDoc.find('#ctl00_cphLeftColumn_ctl01_ddlVenues').val(targetVenue.id);

      const calendarPromise = waitForPostBack(iframe);
      initialWindow.__doPostBack('ctl00$cphLeftColumn$ctl01$ddlVenues', '');
      const calendarWindow = await calendarPromise;
      const $calendarDoc = $(calendarWindow.document);

      const [day, month, year] = show.date.split('/');
      const desiredDateValue = `${year}-${month}-${day}`;

      let dateOption = $calendarDoc
        .find('#ctl00_cphLeftColumn_ctl01_ddlDay option')
        .filter((i, el) => $(el).text().trim() === show.date.trim() || $(el).val().includes(desiredDateValue));

      if (dateOption.length === 0) {
        logActivity('failure', `Data ${show.date} indisponível.`, show.artistName);
        return false;
      }

      $calendarDoc.find('#ctl00_cphLeftColumn_ctl01_ddlDay').val(dateOption.first().val());

      const hoursLoadPromise = waitForPostBack(iframe);
      calendarWindow.__doPostBack('ctl00$cphLeftColumn$ctl01$ddlDay', '');
      const hoursWindow = await hoursLoadPromise;
      const $hoursDoc = $(hoursWindow.document);

      const hourOption = $hoursDoc
        .find('#ctl00_cphLeftColumn_ctl01_ddlHours option')
        .filter((i, el) => $(el).text().trim() === show.time.trim());

      if (hourOption.length === 0) {
        logActivity('failure', `Hora ${show.time} indisponível.`, show.artistName);
        return false;
      }

      const famePrice = (() => {
        try {
          const fameEl = Array.from(hoursWindow.document.querySelectorAll("#ppm-content a[href*='/Help/Scoring/']"))
            .find(el => el.title.includes('/'));
          return ticketPricesByFame[fameEl.title.split('/')[0]] || '5';
        } catch {
          return '5';
        }
      })();

      $hoursDoc.find('#ctl00_cphLeftColumn_ctl01_ddlHours').val(hourOption.first().val());
      $hoursDoc.find('#ctl00_cphLeftColumn_ctl01_txtTicketPrice').val(settings.priceMode === 'auto' ? famePrice : settings.ticketPrice);
      $hoursDoc.find('#ctl00_cphLeftColumn_ctl01_txtArtistCut').val(settings.artistCut + '%');
      $hoursDoc.find('#ctl00_cphLeftColumn_ctl01_txtRider').val(settings.riderLimit);

      const resultPromise = waitForPostBack(iframe);
      $hoursDoc.find('#ctl00_cphLeftColumn_ctl01_btnInvite')[0].click();
      const resultWindow = await resultPromise;
      const $resultDoc = $(resultWindow.document);

      if ($resultDoc.find('.notification-success:contains("Você convidou esse artista")').length > 0) {
        logActivity('success', `Convite para ${show.cityName} enviado!`, show.artistName);
        return true;
      }

      logActivity('failure', 'Falha ao enviar.', show.artistName);
      return false;
    } catch (error) {
      logActivity('failure', `Erro crítico: ${error.message}`, show.artistName);
      return false;
    }
  }

  async function populateClubNetworks() {
    const networkSelect = $('#club-network-select');
    networkSelect.empty().append($('<option>', { value: '', text: 'Carregando...' }));

    const mappedData = JSON.parse(await GM_getValue('all_networks_data', '{}'));
    const networks = Object.keys(mappedData).sort();

    networkSelect.empty();
    if (networks.length > 0) {
      networks.forEach(name => networkSelect.append($('<option>', { value: name, text: name })));
    } else {
      networkSelect.append($('<option>', { value: '', text: 'Nenhuma rede mapeada.' }));
    }
  }

  async function startBackgroundNetworkMapping() {
    const mapButton = $('#map-networks-btn');
    const statusDiv = $('#mapping-status');

    mapButton.prop('disabled', true).html('<i class="fa-solid fa-spinner fa-spin"></i> Mapeando...');
    statusDiv.text('Iniciando...');

    const allNetworksData = {};
    try {
      const iframe = createAndGetIframe();
      const chooseCompanyWindow = await waitForIframeLoad(iframe, '/World/Popmundo.aspx/ChooseCompany');

      let companies = [];
      const companyTable = chooseCompanyWindow.document.querySelector('#tablecompanies');
      if (companyTable) {
        companies = Array.from(companyTable.querySelectorAll('tbody tr a[href*="/Company/"]'))
          .map(a => ({ name: a.textContent.trim(), href: a.getAttribute('href') }));
      } else {
        const cName = chooseCompanyWindow.document.querySelector('.entityLogoNoImg h2');
        const cLink = chooseCompanyWindow.document.querySelector('#ppm-sidemenu a[href*="/Company/Locales/"]');
        if (cName && cLink) {
          companies.push({ name: cName.textContent.trim(), href: cLink.getAttribute('href').replace('/Locales/', '/') });
        }
      }

      if (companies.length === 0) { statusDiv.text('Nenhuma companhia.'); return; }

      for (let i = 0; i < companies.length; i++) {
        const company = companies[i];
        statusDiv.text(`Mapeando ${company.name}...`);

        const localesUrl = new URL(company.href.replace('/Company/', '/Company/Locales/'), window.location.origin).href;
        const localesWindow = await waitForIframeLoad(iframe, localesUrl);

        const localeIds = Array.from(localesWindow.document.querySelectorAll('#tablelocales tbody tr a[href*="/Locale/Management/"]'))
          .map(link => link.href.split('/').pop())
          .filter(Boolean);

        if (localeIds.length > 0) allNetworksData[company.name] = localeIds;
      }

      await GM_setValue('all_networks_data', JSON.stringify(allNetworksData));
      statusDiv.text('Mapeamento concluído!');
      await populateClubNetworks();
    } catch (error) {
      console.error(error);
      statusDiv.text('Erro no mapeamento.');
    } finally {
      mapButton.html('<i class="fa-solid fa-map-location-dot"></i> Mapear redes').prop('disabled', false);
    }
  }

  // =================================================================================================
  // MÓDULO 2: GERENCIADOR FINANCEIRO AVANÇADO + TRACKER DE LUCRO
  // =================================================================================================
  async function initFinanceModule() {
    const uiHTML = `
      <div id="automation-panel-compact">
        <div class="panel-header">
          <h2><i class="fa-solid fa-cash-register"></i> Gerenciador Financeiro</h2>
        </div>

        <div id="config-container" style="grid-template-columns:repeat(2,minmax(0,1fr));">
          <div class="pm-section" style="margin:0;">
            <h3><i class="fa-solid fa-arrow-up-from-bracket"></i> Coletar (Sweep)</h3>
            <label style="font-size:10px; color:var(--pm-muted); font-weight:700;">Manter no clube</label>
            <input type="number" id="safe-balance-collect" value="100000" placeholder="Ex: 100000">
            <div class="action-buttons">
              <button type="button" id="btn-action-collect" style="width:100%; border-color:var(--pm-ok);">
                <i class="fa-solid fa-arrow-up"></i> Puxar excedentes
              </button>
            </div>
          </div>

          <div class="pm-section" style="margin:0;">
            <h3><i class="fa-solid fa-arrow-down-to-bracket"></i> Cobrir (Top-up)</h3>
            <label style="font-size:10px; color:var(--pm-muted); font-weight:700;">Levar até</label>
            <input type="number" id="safe-balance-cover" value="50000" placeholder="Ex: 50000">
            <div class="action-buttons">
              <button type="button" id="btn-action-cover" style="width:100%; border-color:var(--pm-bad);">
                <i class="fa-solid fa-arrow-down"></i> Cobrir rombos
              </button>
            </div>
          </div>
        </div>

        <div class="action-buttons" style="justify-content:space-between; margin-top:10px;">
          <button type="button" id="btn-action-balance" title="Iguala todos ao valor de Coleta">
            <i class="fa-solid fa-scale-balanced"></i> Balancear
          </button>
          <button type="button" id="btn-clear-cash" title="Limpar campos">
            <i class="fa-solid fa-eraser"></i> Limpar
          </button>
          <button type="button" id="btn-save-snapshot" title="Salvar referência (snapshot)" style="border-color:#111827;">
            <i class="fa-solid fa-camera"></i> Snapshot
          </button>
        </div>

        <div class="pm-section" style="margin-top:10px; text-align:center;">
          <div style="font-size:11px; color:var(--pm-muted); font-weight:700; margin-bottom:2px;">Total movimentado</div>
          <div id="sum-value" style="font-weight:900; font-size:14px;">R$ 0,00</div>
          <div id="sum-desc" style="font-size:11px; color:var(--pm-muted);">(Nenhuma alteração)</div>
        </div>
      </div>
    `;

    $('#ppm-content h1').first().after(uiHTML);

    $('#btn-action-collect').on('click', () => executeCalculation('collect'));
    $('#btn-action-cover').on('click', () => executeCalculation('cover'));
    $('#btn-action-balance').on('click', () => executeCalculation('balance'));
    $('#btn-clear-cash').on('click', clearCashFields);
    $('#btn-save-snapshot').on('click', saveProfitSnapshot);

    $(document).on('input', '#tablelocales input[type="text"]', function () {
      updateInputVisuals($(this));
      calculateTotalSummary();
    });

    await displayProfitIndicators();
  }

  function parseMoney(text) {
    if (!text) return 0;
    let cleaned = text.replace(/[^\d.,-]/g, '');
    if (cleaned.includes(',') && cleaned.includes('.')) {
      if (cleaned.indexOf('.') < cleaned.indexOf(',')) cleaned = cleaned.replace(/\./g, '').replace(',', '.');
      else cleaned = cleaned.replace(/,/g, '');
    } else if (cleaned.includes(',')) {
      cleaned = cleaned.replace(',', '.');
    }
    const val = parseFloat(cleaned);
    return isNaN(val) ? 0 : val;
  }

  async function saveProfitSnapshot() {
    if (!confirm('Deseja salvar os saldos atuais como referência para cálculo de lucro?')) return;
    const snapshot = {};
    $('#tablelocales tbody tr').each(function () {
      const link = $(this).find('a[href*="/Locale/"]');
      const id = link.length ? link.attr('href').split('/').pop() : null;
      if (id) snapshot[id] = getCashFromRow($(this));
    });
    await GM_setValue(FINANCE_SNAPSHOT_KEY, JSON.stringify(snapshot));
    location.reload();
  }

  async function displayProfitIndicators() {
    const rawSnapshot = await GM_getValue(FINANCE_SNAPSHOT_KEY, '{}');
    const snapshot = JSON.parse(rawSnapshot);
    const formatMoney = (n) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    $('#tablelocales tbody tr').each(function () {
      const $row = $(this);
      const link = $row.find('a[href*="/Locale/"]');
      const id = link.length ? link.attr('href').split('/').pop() : null;

      if (id && snapshot[id] !== undefined) {
        const currentCash = getCashFromRow($row);
        const diff = currentCash - snapshot[id];
        if (diff !== 0) {
          let badgeClass = diff > 0 ? 'profit-plus' : 'profit-minus';
          let sign = diff > 0 ? '+' : '';
          link.after(`<span class="profit-indicator ${badgeClass}">${sign}${formatMoney(diff)}</span>`);
        }
      }
    });
  }

  function getCashFromRow($row) {
    let currentCash = 0;
    let found = false;

    $row.find('td').each(function () {
      const text = $(this).text().trim();
      if (!found && /[0-9]/.test(text) && !$(this).find('input').length && !$(this).find('a').length) {
        currentCash = parseMoney(text);
        found = true;
      }
    });

    if (!found) currentCash = parseMoney($row.find('td').eq(1).text());
    return currentCash;
  }

  function executeCalculation(mode) {
    const safeCollect = parseFloat($('#safe-balance-collect').val()) || 0;
    const safeCover = parseFloat($('#safe-balance-cover').val()) || 0;
    const targetBalance = mode === 'balance' ? safeCollect : (mode === 'collect' ? safeCollect : safeCover);

    $('#tablelocales tbody tr').each(function () {
      const $row = $(this);
      const $input = $row.find('input[type="text"]');
      if ($input.length === 0) return;

      const currentCash = getCashFromRow($row);
      let transferAmount = 0;

      if (mode === 'collect') {
        if (currentCash > safeCollect) transferAmount = -(currentCash - safeCollect);
      } else if (mode === 'cover') {
        if (currentCash < safeCover) transferAmount = (safeCover - currentCash);
      } else if (mode === 'balance') {
        transferAmount = Math.round(targetBalance - currentCash);
      }

      transferAmount = Math.round(transferAmount);
      if (transferAmount !== 0) $input.val(transferAmount);
      else $input.val('');

      updateInputVisuals($input);
    });

    calculateTotalSummary();
  }

  function updateInputVisuals($input) {
    const val = parseFloat($input.val());
    $input.removeClass('input-sending input-taking');
    if (val > 0) $input.addClass('input-sending');
    else if (val < 0) $input.addClass('input-taking');
  }

  function calculateTotalSummary() {
    let netTotal = 0, sendingTotal = 0, takingTotal = 0;

    $('#tablelocales tbody tr input[type="text"]').each(function () {
      const val = parseFloat($(this).val()) || 0;
      netTotal += val;
      if (val > 0) sendingTotal += val;
      if (val < 0) takingTotal += val;
    });

    const sumSpan = $('#sum-value');
    const descSpan = $('#sum-desc');
    const format = (n) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }).replace('R$', '$');

    if (netTotal > 0) sumSpan.text(`Você vai gastar: ${format(netTotal)}`).css('color', '#dc3545');
    else if (netTotal < 0) sumSpan.text(`Você vai receber: ${format(Math.abs(netTotal))}`).css('color', '#28a745');
    else sumSpan.text('R$ 0,00').css('color', '#333');

    descSpan.text(`Enviando ${format(sendingTotal)} | Recebendo ${format(Math.abs(takingTotal))}`);
  }

  function clearCashFields() {
    $('#tablelocales tbody tr input[type="text"]').val('').removeClass('input-sending input-taking');
    calculateTotalSummary();
  }
})();
