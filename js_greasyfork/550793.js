// ==UserScript==
// @name         WB-Helper
// @namespace    wb-helper
// @version      1.10.2
// @description  MQTTChannels: копирование ячеек (по настройке); KNX configs: прокрутка списка + фильтр 1.2.3→1/2/3 + авто-нормализация (по настройке); пункт меню «WB-Helper» под «Помощь»
// @match        *://*/*
// @run-at       document-idle
// @grant        GM_setClipboard
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/550793/WB-Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/550793/WB-Helper.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ---------- утилиты ----------
  const sleep = (ms)=>new Promise(r=>setTimeout(r,ms));
  const onHash = (fn)=>{ window.addEventListener('hashchange', fn); fn(); };
  const debounce = (fn,ms)=>{ let t; return (...a)=>{ clearTimeout(t); t=setTimeout(()=>fn(...a),ms); }; };

  // ---------- настройки (persist) ----------
  const LS_KEY = 'wbhelper.settings.v1';
  const defaults = { mqttCopyEnabled: true, knxEnhancementsEnabled: true, serialConfigEnhancementsEnabled: true };
  function loadSettings() { try{ return { ...defaults, ...(JSON.parse(localStorage.getItem(LS_KEY))||{}) }; }catch{ return { ...defaults }; } }
  function saveSettings(s) { try{ localStorage.setItem(LS_KEY, JSON.stringify(s)); }catch{} }
  let settings = loadSettings();

  // ---------- нормализация строк адресов ----------
  function normalizeGAString(s){ return (s||'').toLowerCase().replace(/[^0-9]+/g,'/').replace(/\/{2,}/g,'/').replace(/^\/|\/$/g,''); }
  function softNormalizeTyping(s){ return (s||'').replace(/[.,\s]+/g,'/').replace(/\/{2,}/g,'/'); }
  function hardNormalizeOnBlur(s){ if(!s) return s; if(/^\d+$/.test(s)) return s; return s.replace(/[^0-9]+/g,'/').replace(/\/{2,}/g,'/').replace(/^\/|\/$/g,''); }

  // ---------- детект страниц ----------
  const HASH_MQTT = '#!/MQTTChannels';
  const KNX_SCHEMA_HINT = 'wb-mqtt-knx.schema.json';
  const HASH_SERIAL = '#!/serial-config';
  function isMQTTChannels(){ return (location.hash||'').startsWith(HASH_MQTT); }
  function isKnxConfigs(){ const h = location.hash||''; return h.startsWith('#!/configs/edit/') && h.includes(KNX_SCHEMA_HINT); }
  function isSerialConfig(){ return (location.hash||'').startsWith(HASH_SERIAL); }
  function isSupportedPage(){ return isMQTTChannels() || isKnxConfigs() || isSerialConfig(); }

  // ---------- UI настроек: панель + шестерёнка/пункт меню ----------
  let gearBtn, panel, menuLi;
  function ensureSettingsPanel() {
    if (panel) return panel;
    panel = document.createElement('div');
    Object.assign(panel.style, {
      position:'fixed', left:'14px', bottom:'54px', zIndex:2147483646,
      minWidth:'260px', padding:'10px 12px', background:'#fff',
      border:'1px solid rgba(0,0,0,.15)', borderRadius:'8px',
      boxShadow:'0 10px 24px rgba(0,0,0,.18)', display:'none',
      font:'13px/1.4 system-ui,Segoe UI,Roboto,Arial'
    });
    panel.id = 'wbhelper-panel';
    panel.innerHTML = `
      <div style="font-weight:600; margin-bottom:8px;">WB-Helper — Настройки</div>
      <label style="display:flex; gap:8px; align-items:center; margin:6px 0;">
        <input type="checkbox" id="wbhelper-opt-mqtt">
        <span>Копирование в “Каналы MQTT”</span>
      </label>
      <label style="display:flex; gap:8px; align-items:center; margin:6px 0;">
        <input type="checkbox" id="wbhelper-opt-knx">
        <span>Улучшения в “KNX групповые объекты”</span>
      </label>
      <label style="display:flex; gap:8px; align-items:center; margin:6px 0;">
        <input type="checkbox" id="wbhelper-opt-serial">
        <span>Мультивыбор «Опрос» в Serial config</span>
      </label>
      <div style="margin-top:8px;color:#666;">Изменения применяются сразу</div>
    `;
    document.body.appendChild(panel);

    const inpMqtt = panel.querySelector('#wbhelper-opt-mqtt');
    const inpKnx  = panel.querySelector('#wbhelper-opt-knx');
    const inpSerial = panel.querySelector('#wbhelper-opt-serial');
    inpMqtt.checked = !!settings.mqttCopyEnabled;
    inpKnx.checked  = !!settings.knxEnhancementsEnabled;
    inpSerial.checked = !!settings.serialConfigEnhancementsEnabled;

    inpMqtt.addEventListener('change', ()=>{ settings.mqttCopyEnabled = inpMqtt.checked; saveSettings(settings); route(); });
    inpKnx .addEventListener('change', ()=>{ settings.knxEnhancementsEnabled = inpKnx.checked; saveSettings(settings); route(); });
    inpSerial.addEventListener('change', ()=>{ settings.serialConfigEnhancementsEnabled = inpSerial.checked; saveSettings(settings); route(); });

    document.addEventListener('click', (e)=>{
      if (panel.style.display!=='block') return;
      const isToggle = e.target === gearBtn || e.target.closest('#wbhelper-menu-link');
      if (!isToggle && !panel.contains(e.target)) panel.style.display = 'none';
    });

    return panel;
  }
  function toggleSettingsPanel() {
    ensureSettingsPanel();
    panel.style.display = (panel.style.display==='block') ? 'none' : 'block';
  }
  function ensureGearFallback(show) {
    if (!gearBtn) {
      gearBtn = document.createElement('button');
      gearBtn.id = 'wbhelper-gear';
      gearBtn.title = 'WB-Helper — настройки';
      Object.assign(gearBtn.style, {
        position:'fixed', right:'14px', top:'14px', zIndex:2147483646,
        width:'34px', height:'34px', borderRadius:'50%',
        border:'1px solid rgba(0,0,0,.15)', background:'#fff',
        boxShadow:'0 2px 10px rgba(0,0,0,.15)', cursor:'pointer', display:'none'
      });
      gearBtn.textContent = '⚙️';
      gearBtn.addEventListener('click', toggleSettingsPanel);
      document.body.appendChild(gearBtn);
    }
    gearBtn.style.display = show ? 'block' : 'none';
  }
  function hideSettingsUI() {
    if (panel) panel.style.display = 'none';
    if (gearBtn) gearBtn.style.display = 'none';
    if (menuLi) {
      menuLi.remove();
      menuLi = null;
    }
  }
  async function ensureNavbarMenuItem() {
    // ищем <li> с <a href="#!/help">Помощь</a>
    for (let i=0;i<40;i++){
      if (!isSupportedPage()) return;
      const helpA = document.querySelector('li > a[href="#!/help"]');
      if (helpA) {
        const helpLi = helpA.closest('li');
        const ul = helpLi && helpLi.parentElement;
        if (!ul) break;

        if (!document.getElementById('wbhelper-menu-link')) {
          menuLi = document.createElement('li');
          menuLi.innerHTML = `
            <a id="wbhelper-menu-link" class="ng-binding" href="#!/wb-helper" draggable="false" data-toggle="collapse" data-target=".navbar-ex1-collapse">
              <i class="glyphicon glyphicon-cog"></i> WB-Helper
            </a>
          `;
          // вставляем сразу ПОСЛЕ «Помощь»
          if (helpLi.nextSibling) ul.insertBefore(menuLi, helpLi.nextSibling);
          else ul.appendChild(menuLi);
          // клик по пункту — открываем панель и предотвращаем навигацию
          menuLi.querySelector('#wbhelper-menu-link').addEventListener('click', (e)=>{
            e.preventDefault(); e.stopPropagation();
            toggleSettingsPanel();
          });
        }
        // если меню есть, прячем шестерёнку
        ensureGearFallback(false);
        return;
      }
      await sleep(250);
    }
    // если не нашли навбар — показываем шестерёнку как fallback
    if (!isSupportedPage()) return;
    ensureGearFallback(true);
  }

  // ---------- MQTTChannels: копирование ячеек ----------
  function initMQTTCopy() {
    if (!settings.mqttCopyEnabled) return true;
    const wrap = document.querySelector('.mqtt-table-wrapper');
    if (!wrap) return false;
    if (wrap.__wbHelperCopyBound) return true;
    wrap.__wbHelperCopyBound = true;

    let tip, tipTimer;
    function showTip(text, x, y){
      if (!tip) {
        tip = document.createElement('div');
        Object.assign(tip.style, {
          position:'fixed', zIndex:2147483647, padding:'6px 10px', borderRadius:'6px',
          background:'rgba(0,0,0,.85)', color:'#fff', fontSize:'13px',
          boxShadow:'0 2px 8px rgba(0,0,0,.35)', opacity:'0', transition:'opacity .12s ease'
        });
        document.body.appendChild(tip);
      }
      tip.textContent = 'Скопировано: ' + text;
      tip.style.left = (x - 10) + 'px';
      tip.style.top  = (y - 40) + 'px';
      tip.style.opacity = '1';
      clearTimeout(tipTimer);
      tipTimer = setTimeout(()=>{ tip.style.opacity='0'; }, 1200);
    }

    wrap.addEventListener('click', async (e) => {
      if (!settings.mqttCopyEnabled) return;
      const cell = e.target.closest('td, .mqtt-table-value'); if (!cell) return;
      const valueNode = cell.classList?.contains('mqtt-table-value') ? cell : (cell.querySelector('.mqtt-table-value') || cell);
      const text = (valueNode.textContent || '').trim(); if (!text) return;

      const sel = window.getSelection(); const r = document.createRange();
      sel.removeAllRanges(); r.selectNodeContents(valueNode); sel.addRange(r);

      try {
        if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(text);
        else if (typeof GM_setClipboard === 'function') GM_setClipboard(text, { type:'text' });
        else document.execCommand('copy');
      } catch(_) { try{ document.execCommand('copy'); }catch(_){} }

      showTip(text, e.clientX, e.clientY);
    }, false);

    return true;
  }

  // ---------- KNX: список + прокрутка + фильтр + нормализация ввода ----------
  const LIST_SEL = 'ul.nav.nav-pills.nav-stacked[role="tablist"]';
  const RIGHT_SEL = '.col-md-10.tab-content';
  const initedLists = new WeakSet();
  const roMap = new WeakMap();     // ul -> { roLeft, roRight }
  const filterMap = new WeakMap(); // ul -> { wrap, input, clearBtn }
let knxMutationObserver = null;

  function setStyleIfChanged(el, prop, val){ if (el.style[prop] !== val) el.style[prop] = val; }
  function clearStyle(el, prop){ if (el.style[prop]) el.style[prop] = ''; }

  function ensureFilterForList(ul) {
    if (filterMap.has(ul)) return filterMap.get(ul);
    const wrap = document.createElement('div');
    wrap.className = 'wbhelper-filter-wrap';
    Object.assign(wrap.style, { position:'relative', marginBottom:'8px' });

    const input = document.createElement('input');
    input.type = 'search';
    input.placeholder = 'Фильтр… (имя/адрес; 1.2.3 тоже ок)';
    Object.assign(input.style, {
      width:'100%', padding:'6px 26px 6px 8px', fontSize:'13px',
      border:'1px solid #ccc', borderRadius:'4px', outline:'none',
    });

    const clearBtn = document.createElement('button');
    clearBtn.type = 'button';
    clearBtn.textContent = '×';
    Object.assign(clearBtn.style, {
      position:'absolute', right:'6px', top:'0', bottom:'0', margin:'auto',
      height:'24px', width:'24px', lineHeight:'22px',
      border:'none', background:'transparent', color:'#666', cursor:'pointer',
      fontSize:'16px', padding:'0'
    });
    clearBtn.addEventListener('click', () => { input.value=''; filterList(); input.focus(); });

    wrap.appendChild(input);
    wrap.appendChild(clearBtn);
    ul.parentNode.insertBefore(wrap, ul);

    const filterList = debounce(() => {
      if (!settings.knxEnhancementsEnabled) return;
      const raw = (input.value||'').toLowerCase().trim();
      const qNorm = normalizeGAString(raw);
      const items = ul.querySelectorAll(':scope > li');
      items.forEach(li => {
        const txtRaw = (li.textContent || '').toLowerCase();
        const txtNorm = normalizeGAString(txtRaw);
        const match = !raw || txtRaw.includes(raw) || (qNorm && txtNorm.includes(qNorm));
        const want = match ? '' : 'none';
        if (li.style.display !== want) li.style.display = want;
      });
      const right = ul.parentElement?.querySelector(RIGHT_SEL);
      if (right) applyScrollableIfTaller(ul, right);
      const active = ul.querySelector('li.active:not([style*="display: none"])');
      const firstShown = ul.querySelector('li:not([style*="display: none"])');
      (active || firstShown)?.scrollIntoView({ block:'nearest' });
    }, 120);

    input.addEventListener('input', filterList);
    input.addEventListener('keydown', (e)=>{ if (e.key === 'Escape') { e.preventDefault(); clearBtn.click(); } });

    filterMap.set(ul, { wrap, input, clearBtn });
    return filterMap.get(ul);
  }

  function currentFilterHeight(ul){ const f = filterMap.get(ul); return f ? Math.ceil(f.wrap.getBoundingClientRect().height) : 0; }

  function applyScrollableIfTaller(ul, right) {
    if (!settings.knxEnhancementsEnabled) {
      clearStyle(ul, 'overflowY'); clearStyle(ul, 'overflowX'); clearStyle(ul, 'maxHeight'); clearStyle(ul, 'paddingRight');
      return;
    }
    const filterH = currentFilterHeight(ul);
    const rightH = right.clientHeight;
    const needScroll = (filterH + ul.scrollHeight) > (rightH + 100);
    if (needScroll) {
      const maxH = Math.max(120, rightH - filterH - 10);
      setStyleIfChanged(ul, 'overflowY', 'auto');
      setStyleIfChanged(ul, 'overflowX', 'hidden');
      setStyleIfChanged(ul, 'maxHeight', maxH + 'px');
      setStyleIfChanged(ul, 'paddingRight', '6px');
    } else {
      clearStyle(ul, 'overflowY'); clearStyle(ul, 'overflowX'); clearStyle(ul, 'maxHeight'); clearStyle(ul, 'paddingRight');
    }
  }

  function scrollActiveIntoView(ul) {
    const li = ul.querySelector('li.active:not([style*="display: none"])') || ul.querySelector('li:not([style*="display: none"])');
    if (li) li.scrollIntoView({ block: 'nearest' });
  }

  function setupOneList(ul) {
    if (!settings.knxEnhancementsEnabled) return;
    if (initedLists.has(ul)) return;
    const parent = ul.parentElement; if (!parent) return;
    const right = parent.querySelector(RIGHT_SEL); if (!right) return;

    ensureFilterForList(ul);
    applyScrollableIfTaller(ul, right);
    scrollActiveIntoView(ul);

    if (!ul.__wbHelperListClickHandler) {
      const handler = (e)=>{
        if (!settings.knxEnhancementsEnabled) return;
        const a = e.target.closest(`${LIST_SEL} a[role="tab"][data-toggle="tab"]`);
        if (!a || !ul.contains(a)) return;
        setTimeout(()=>{ applyScrollableIfTaller(ul, right); scrollActiveIntoView(ul); }, 0);
      };
      ul.__wbHelperListClickHandler = handler;
      document.addEventListener('click', handler, true);
    }

    const roRight = new ResizeObserver(()=> applyScrollableIfTaller(ul, right));
    const roLeft  = new ResizeObserver(()=> applyScrollableIfTaller(ul, right));
    roRight.observe(right); roLeft.observe(ul);
    roMap.set(ul, { roRight, roLeft });

    initedLists.add(ul);
  }

  function initKnxEnhancements() {
    if (!settings.knxEnhancementsEnabled) return true;
    const lists = document.querySelectorAll(LIST_SEL);
    if (!lists.length) return false;
    lists.forEach(setupOneList);

    if (!knxMutationObserver) {
      knxMutationObserver = new MutationObserver((muts)=>{
        if (!settings.knxEnhancementsEnabled) return;
        let needScan = false;
        for (const m of muts) { if (m.addedNodes?.length || m.removedNodes?.length) { needScan = true; break; } }
        if (needScan) document.querySelectorAll(LIST_SEL).forEach(setupOneList);
      });
      knxMutationObserver.observe(document.body, { subtree:true, childList:true });
    }

    return true;
  }
  function teardownKnxEnhancements() {
    document.querySelectorAll(LIST_SEL).forEach((ul)=>{
      const filter = filterMap.get(ul);
      if (filter) {
        if (filter.wrap?.isConnected) filter.wrap.remove();
        filterMap.delete(ul);
      }
      clearStyle(ul, 'overflowY'); clearStyle(ul, 'overflowX'); clearStyle(ul, 'maxHeight'); clearStyle(ul, 'paddingRight');
      const observers = roMap.get(ul);
      if (observers) {
        observers.roLeft.disconnect();
        observers.roRight.disconnect();
        roMap.delete(ul);
      }
      if (ul.__wbHelperListClickHandler) {
        document.removeEventListener('click', ul.__wbHelperListClickHandler, true);
        delete ul.__wbHelperListClickHandler;
      }
      if (typeof initedLists.delete === 'function') initedLists.delete(ul);
    });
    if (knxMutationObserver) {
      knxMutationObserver.disconnect();
      knxMutationObserver = null;
    }
  }


  // ---------- Serial config: мультивыбор «Опрос» ----------
  const SERIAL_TABLE_SELECTOR = 'table.table.table-bordered';
  const SERIAL_MODE_SELECTOR = 'select[name$="[mode]"]';
  const serialState = {
    rows: [],
    observer: null,
    rebuildDebounced: null,
    lastIndex: null,
    syncing: false,
  };
  const serialTables = new Set();
  const serialFilterMap = new WeakMap();

  function ensureSerialStyles() {
    if (document.getElementById('wbhelper-serial-style')) return;
    const style = document.createElement('style');
    style.id = 'wbhelper-serial-style';
    style.textContent = [
      '.wbhelper-serial-row-selected > td {',
      '  background-color: rgba(41, 138, 222, 0.12) !important;',
      '}',
      '.wbhelper-serial-checkbox {',
      '  cursor: pointer;',
      '  margin: 0;',
      '  vertical-align: middle;',
      '}',
      '.wbhelper-serial-check-head {',
      '  text-align: center;',
      '  width: 42px;',
      '  vertical-align: middle;',
      '}',
      '.wbhelper-serial-shift-hint {',
      '  display: block;',
      '  font-size: 11px;',
      '  font-weight: 400;',
      '  color: #6c757d;',
      '}',
      '.wbhelper-serial-check-cell {',
      '  text-align: center;',
      '  width: 42px;',
      '}',
      '.wbhelper-serial-filter-block {',
      '  margin: 0 0 8px;',
      '}',
      '.wbhelper-serial-filter {',
      '  display: flex;',
      '  gap: 6px;',
      '  align-items: center;',
      '  font-size: 13px;',
      '}',
      '.wbhelper-serial-filter input {',
      '  flex: 1;',
      '  min-width: 0;',
      '  padding: 6px 8px;',
      '  border: 1px solid #ccc;',
      '  border-radius: 4px;',
      '  outline: none;',
      '}',
      '.wbhelper-serial-filter button {',
      '  padding: 5px 10px;',
      '  border: 1px solid #ccc;',
      '  border-radius: 4px;',
      '  background: #f4f4f4;',
      '  cursor: pointer;',
      '}',
      '.wbhelper-serial-filter button:hover {',
      '  background: #e8e8e8;',
      '}',
      '.wbhelper-serial-filter-note {',
      '  font-size: 12px;',
      '  color: #666;',
      '  margin-top: 4px;',
      '}'
    ].join('\n');
    document.head.appendChild(style);
  }

  function ensureSerialTableStructure(table) {
    if (!table) return;
    if (!table.__wbhelperSerialProcessed) {
      serialTables.add(table);
      table.__wbhelperSerialProcessed = true;
      const headRow = table.tHead?.rows?.[0];
      if (headRow && !headRow.querySelector('.wbhelper-serial-check-head')) {
        const th = document.createElement('th');
        th.className = 'wbhelper-serial-check-head';
        th.innerHTML = 'Выбор<span class="wbhelper-serial-shift-hint">Shift=диапазон</span>';
        th.title = 'Выделите несколько строк, удерживая Shift';
        headRow.insertBefore(th, headRow.firstElementChild || null);
      }
    }
    ensureSerialFilter(table);
  }

  function ensureSerialFilter(table) {
    let info = serialFilterMap.get(table);
    if (info) return info;
    const container = document.createElement('div');
    container.className = 'wbhelper-serial-filter-block';
    const filterRow = document.createElement('div');
    filterRow.className = 'wbhelper-serial-filter';
    const input = document.createElement('input');
    input.type = 'search';
    input.placeholder = 'Фильтр каналов…';
    const clearBtn = document.createElement('button');
    clearBtn.type = 'button';
    clearBtn.textContent = 'Очистить';
    filterRow.appendChild(input);
    filterRow.appendChild(clearBtn);
    const note = document.createElement('div');
    note.className = 'wbhelper-serial-filter-note';
    note.textContent = 'Нет совпадений';
    note.style.display = 'none';
    container.appendChild(filterRow);
    container.appendChild(note);
    const parent = table.parentElement;
    if (parent) parent.insertBefore(container, table);
    const applyFilterImmediate = ()=> applySerialFilter(table);
    const inputHandler = debounce(applyFilterImmediate, 150);
    input.addEventListener('input', inputHandler);
    input.__wbhelperSerialFilterHandler = inputHandler;
    const clearHandler = ()=> {
      if (!input.value) {
        applySerialFilter(table);
      } else {
        input.value = '';
        applySerialFilter(table);
      }
      input.focus();
    };
    clearBtn.addEventListener('click', clearHandler);
    clearBtn.__wbhelperSerialClearHandler = clearHandler;
    info = { container, input, clearBtn, note, applyFilterImmediate };
    serialFilterMap.set(table, info);
    applySerialFilter(table);
    return info;
  }

  function applySerialFilter(table) {
    const info = serialFilterMap.get(table);
    if (!info) return;
    const query = (info.input.value || '').trim().toLowerCase();
    const rows = [];
    for (const tbody of Array.from(table.tBodies || [])) {
      rows.push(...Array.from(tbody.rows || []));
    }
    let anyVisible = false;
    rows.forEach((tr)=>{
      const text = tr.dataset.wbhelperSerialChannel || '';
      const match = !query || text.includes(query);
      tr.style.display = match ? '' : 'none';
      if (match) anyVisible = true;
    });
    if (info.note) info.note.style.display = (!anyVisible && rows.length) ? 'block' : 'none';
  }

  function teardownSerialTable(table) {
    if (!table) return;
    const info = serialFilterMap.get(table);
    if (info) {
      if (info.input?.__wbhelperSerialFilterHandler) {
        info.input.removeEventListener('input', info.input.__wbhelperSerialFilterHandler);
        delete info.input.__wbhelperSerialFilterHandler;
      }
      if (info.clearBtn?.__wbhelperSerialClearHandler) {
        info.clearBtn.removeEventListener('click', info.clearBtn.__wbhelperSerialClearHandler);
        delete info.clearBtn.__wbhelperSerialClearHandler;
      }
      if (info.container?.isConnected) info.container.remove();
      serialFilterMap.delete(table);
    }
    const head = table.tHead?.rows?.[0]?.querySelector('.wbhelper-serial-check-head');
    if (head) head.remove();
    table.querySelectorAll('td.wbhelper-serial-check-cell').forEach((cell)=> cell.remove());
    delete table.__wbhelperSerialProcessed;
  }

  function cleanupSerialTables() {
    serialTables.forEach((table)=> teardownSerialTable(table));
    serialTables.clear();
  }

  function reapplySerialFilters() {
    const toRemove = [];
    serialTables.forEach((table)=>{
      if (!table.isConnected) {
        toRemove.push(table);
        return;
      }
      applySerialFilter(table);
    });
    toRemove.forEach((table)=>{
      teardownSerialTable(table);
      serialTables.delete(table);
    });
  }

  function cleanupSerialRows(removeCheckboxes) {
    serialState.rows.forEach((item)=>{
      const { row, checkbox, select, cell } = item;
      if (checkbox && checkbox.__wbhelperSerialHandler) {
        checkbox.removeEventListener('click', checkbox.__wbhelperSerialHandler);
        delete checkbox.__wbhelperSerialHandler;
      }
      if (select && select.__wbhelperSerialHandler) {
        select.removeEventListener('change', select.__wbhelperSerialHandler);
        delete select.__wbhelperSerialHandler;
      }
      row.classList.remove('wbhelper-serial-row-selected');
      if (removeCheckboxes) {
        if (cell?.isConnected) cell.remove();
        delete row.__wbhelperSerialCheckbox;
        delete row.__wbhelperSerialCheckCell;
        delete row.dataset.wbhelperSerialChannel;
      }
    });
    if (removeCheckboxes) serialState.lastIndex = null;
    serialState.rows = [];
  }

  function refreshSerialHighlights() {
    serialState.rows.forEach((item)=>{
      item.row.classList.toggle('wbhelper-serial-row-selected', !!(item.checkbox && item.checkbox.checked));
    });
  }

  function handleSerialCheckbox(item, event) {
    const idx = serialState.rows.indexOf(item);
    if (idx === -1) return;
    const shouldCheck = !!item.checkbox?.checked;
    if (event.shiftKey && serialState.lastIndex !== null && serialState.lastIndex !== idx) {
      const [from, to] = idx > serialState.lastIndex ? [serialState.lastIndex, idx] : [idx, serialState.lastIndex];
      const currentTable = item.row.closest('table');
      for (let i = from; i <= to; i++) {
        const target = serialState.rows[i];
        if (!target?.checkbox) continue;
        if (target.row.closest('table') !== currentTable) continue;
        target.checkbox.checked = shouldCheck;
        target.row.classList.toggle('wbhelper-serial-row-selected', shouldCheck);
      }
    } else {
      item.row.classList.toggle('wbhelper-serial-row-selected', shouldCheck);
    }
    serialState.lastIndex = idx;
  }

  function getSelectedSerialRows() {
    return serialState.rows.filter((item)=> item.checkbox?.checked);
  }

  function handleSerialSelect(item) {
    if (serialState.syncing) return;
    if (!item.checkbox?.checked) return;
    const selected = getSelectedSerialRows();
    if (selected.length <= 1) return;
    const newValue = item.select?.value;
    const targets = selected.filter((target)=> target !== item);
    if (!targets.length) return;
    serialState.syncing = true;
    try {
      targets.forEach((target)=>{
        const select = target.select;
        if (!select) return;
        if (select.value === newValue) return;
        select.value = newValue;
        select.dispatchEvent(new Event('change', { bubbles: true }));
      });
    } finally {
      serialState.syncing = false;
      setTimeout(reapplySerialFilters, 0);
    }
  }

  function rebuildSerialRows() {
    cleanupSerialRows(false);
    const tables = Array.from(document.querySelectorAll(SERIAL_TABLE_SELECTOR));
    tables.forEach((table)=> ensureSerialTableStructure(table));
    const collected = [];
    tables.forEach((table)=>{
      for (const tbody of Array.from(table.tBodies || [])) {
        for (const tr of Array.from(tbody.rows || [])) {
          const select = tr.querySelector(SERIAL_MODE_SELECTOR);
          if (!select) continue;
          let cell = tr.__wbhelperSerialCheckCell;
          if (!cell || !cell.isConnected) {
            cell = document.createElement('td');
            cell.className = 'wbhelper-serial-check-cell';
            tr.insertBefore(cell, tr.firstElementChild || null);
            tr.__wbhelperSerialCheckCell = cell;
          }
          let checkbox = tr.__wbhelperSerialCheckbox;
          if (!checkbox || !checkbox.isConnected) {
            checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'wbhelper-serial-checkbox';
            checkbox.title = 'Выделить строку; Shift — выделить диапазон';
            cell.appendChild(checkbox);
            tr.__wbhelperSerialCheckbox = checkbox;
          } else if (!cell.contains(checkbox)) {
            cell.appendChild(checkbox);
          }
          const channelCell = tr.querySelector('td:nth-child(2)');
          const channelText = (channelCell?.textContent || '').trim().toLowerCase();
          tr.dataset.wbhelperSerialChannel = channelText;
          const item = { row: tr, select, checkbox, cell };
          const checkboxHandler = (event)=> handleSerialCheckbox(item, event);
          const selectHandler = ()=> handleSerialSelect(item);
          checkbox.addEventListener('click', checkboxHandler);
          select.addEventListener('change', selectHandler);
          checkbox.__wbhelperSerialHandler = checkboxHandler;
          select.__wbhelperSerialHandler = selectHandler;
          collected.push(item);
        }
      }
    });
    serialState.rows = collected;
    serialState.lastIndex = null;
    refreshSerialHighlights();
    reapplySerialFilters();
  }

  function initSerialConfigEnhancements() {
    if (!settings.serialConfigEnhancementsEnabled) return true;
    const firstSelect = document.querySelector(SERIAL_MODE_SELECTOR);
    if (!firstSelect) return false;
    ensureSerialStyles();
    rebuildSerialRows();
    if (!serialState.observer) {
      serialState.rebuildDebounced = debounce(()=> {
        if (!settings.serialConfigEnhancementsEnabled) return;
        rebuildSerialRows();
      }, 120);
      serialState.observer = new MutationObserver((muts)=>{
        for (const m of muts) {
          if ((m.addedNodes && m.addedNodes.length) || (m.removedNodes && m.removedNodes.length)) {
            if (serialState.rebuildDebounced) serialState.rebuildDebounced();
            break;
          }
        }
      });
      const root = firstSelect.closest('.tab-content') || document.body;
      serialState.observer.observe(root, { childList:true, subtree:true });
    }
    return true;
  }

  function teardownSerialEnhancements() {
    cleanupSerialRows(true);
    cleanupSerialTables();
    if (serialState.observer) {
      serialState.observer.disconnect();
      serialState.observer = null;
    }
    serialState.rebuildDebounced = null;
    serialState.lastIndex = null;
    serialState.syncing = false;
  }


  // ---- Автонормализация ввода в полях групповых адресов ----
  const GA_INPUT_SEL = 'input[name$="[groupAddress]"], input[name$="[feedbackGroupAddress]"]';
  function bindGaNormalization() {
    if (document.__wbGaNormBound) return; // один раз
    document.__wbGaNormBound = true;

    document.addEventListener('input', (e)=>{
      if (!settings.knxEnhancementsEnabled) return;
      const el = e.target;
      if (!(el instanceof HTMLInputElement)) return;
      if (!el.matches(GA_INPUT_SEL)) return;
      const v = el.value, nv = softNormalizeTyping(v);
      if (nv !== v) {
        const pos = el.selectionStart;
        el.value = nv;
        if (typeof pos === 'number') {
          const diff = nv.length - v.length;
          el.setSelectionRange(Math.max(0, pos + diff), Math.max(0, pos + diff));
        }
      }
    }, true);

    document.addEventListener('blur', (e)=>{
      if (!settings.knxEnhancementsEnabled) return;
      const el = e.target;
      if (!(el instanceof HTMLInputElement)) return;
      if (!el.matches(GA_INPUT_SEL)) return;
      const nv = hardNormalizeOnBlur(el.value);
      if (nv !== el.value) el.value = nv;
    }, true);
  }

  // ---------- роутер ----------
  async function route() {
    const onMqtt = isMQTTChannels();
    const onKnx = isKnxConfigs();
    const onSerial = isSerialConfig();

    if (!onKnx) teardownKnxEnhancements();
    if (!onSerial) teardownSerialEnhancements();

    if (!onMqtt && !onKnx && !onSerial) {
      hideSettingsUI();
      return;
    }

    ensureSettingsPanel();
    ensureNavbarMenuItem(); // пытаемся вставить пункт меню; при неудаче включим fallback-gear

    if (onMqtt) {
      for (let i=0;i<40;i++){ if (initMQTTCopy()) break; await sleep(250); }
      return;
    }

    if (onKnx) {
      if (settings.knxEnhancementsEnabled) {
        bindGaNormalization();
        for (let i=0;i<60;i++){ if (initKnxEnhancements()) break; await sleep(250); }
      } else {
        teardownKnxEnhancements();
      }
      return;
    }

    if (onSerial) {
      if (settings.serialConfigEnhancementsEnabled) {
        for (let i=0;i<60;i++){ if (initSerialConfigEnhancements()) break; await sleep(250); }
      } else {
        teardownSerialEnhancements();
      }
      return;
    }
  }

  onHash(route);
})();