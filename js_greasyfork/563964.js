// ==UserScript==
// @name         LibMAL
// @version      1.0.0
// @description  Utility library for my MAL userscript collection
// @author       SuperTouch
// @license      GPL-3.0
// ==/UserScript==

const libMAL = (function() {
  'use strict';

  const SCRIPT_PREFIX = 'cfg';
  const DEBUG = false;
  
  function debug(...args) { if (DEBUG) console.log(`[LibMAL]`, ...args); }

  function newElement(tag, props, children) {
    const el = document.createElement(tag);
    if (props) Object.assign(el, props);
    if (children) children.forEach(c => c && el.appendChild(typeof c === 'string' ? document.createTextNode(c) : c));
    return el;
  }

  function applyDefaults(opts, defaults) {
    return opts ? { ...defaults, ...opts } : { ...defaults };
  }

  function isDarkMode() {
    return document.documentElement.classList.contains('dark-mode') || document.body?.dataset?.skin === 'dark';
  }

  function getPageInfo() {
    const match = window.location.pathname.match(/^\/(anime|manga)\/(\d+)/);
    return match ? { type: match[1], id: match[2] } : { type: null, id: null };
  }

  function onReady(callback) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', callback);
    else callback();
  }

  function fetch(url, options = {}) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: options.method || 'GET',
        url,
        headers: options.headers,
        data: options.body,
        onload: response => {
          if (response.status >= 200 && response.status < 300) {
            try {
              const data = options.responseType === 'text' ? response.responseText : JSON.parse(response.responseText);
              resolve({ ok: true, status: response.status, data });
            } catch (e) { resolve({ ok: true, status: response.status, data: response.responseText }); }
          } else {
            resolve({ ok: false, status: response.status, data: null });
          }
        },
        onerror: () => reject(new Error('Network error'))
      });
    });
  }

  const utilities = { newElement, applyDefaults, isDarkMode, getPageInfo, onReady, fetch };

  let stylesInjected = false;
  function injectStyles() {
    if (stylesInjected) return;
    stylesInjected = true;
    debug('Injecting styles');

    const css = `
      .libmal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); z-index: 99999; display: flex; align-items: center; justify-content: center; }
      .libmal-modal {
        background: var(--libmal-bg); color: var(--libmal-text); border-radius: 4px; width: 800px; max-width: 95vw; height: 70vh;
        display: flex; flex-direction: column; box-shadow: 0 4px 20px rgba(0,0,0,0.3); font: 11px Verdana, Arial, sans-serif;
        --libmal-bg: #fff; --libmal-bg-alt: #f5f5f5; --libmal-bg-hover: #eee; --libmal-text: #333; --libmal-muted: #666;
        --libmal-border: #ddd; --libmal-accent: #2e51a2; --libmal-accent-hover: #1d439b; --libmal-danger: #d9534f;
        --libmal-input-bg: #fff; --libmal-input-border: #ccc;
      }
      html.dark-mode .libmal-modal, [data-skin="dark"] .libmal-modal {
        --libmal-bg: #1c1c1c; --libmal-bg-alt: #252525; --libmal-bg-hover: #333; --libmal-text: #e0e0e0; --libmal-muted: #999;
        --libmal-border: #444; --libmal-input-bg: #2a2a2a; --libmal-input-border: #555;
      }
      .libmal-header { background: var(--libmal-accent); color: #fff; padding: 12px 16px; display: flex; justify-content: space-between; align-items: center; border-radius: 4px 4px 0 0; }
      .libmal-header h2 { margin: 0; font-size: 14px; font-weight: bold; border-style: none !important; }
      .libmal-close { background: none; border: none; color: #fff; font-size: 20px; cursor: pointer; }
      .libmal-body { display: flex; flex: 1; overflow: hidden; }
      .libmal-sidebar { width: 180px; background: var(--libmal-bg-alt); border-right: 1px solid var(--libmal-border); overflow-y: auto; flex-shrink: 0; }
      .libmal-script-btn { display: block; width: 100%; padding: 10px 12px; border: none; background: transparent; text-align: left; cursor: pointer; font: inherit; color: var(--libmal-text); border-bottom: 1px solid var(--libmal-border); }
      .libmal-script-btn:hover { background: var(--libmal-bg-hover); }
      .libmal-script-btn.active { background: var(--libmal-bg); font-weight: bold; border-left: 3px solid var(--libmal-accent); }
      .libmal-content { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
      .libmal-tabs { display: flex; background: var(--libmal-bg-alt); border-bottom: 1px solid var(--libmal-border); flex-shrink: 0; overflow-x: auto; }
      .libmal-tab { padding: 8px 14px; border: none; background: transparent; cursor: pointer; font: inherit; color: var(--libmal-text); border-bottom: 2px solid transparent; }
      .libmal-tab:hover { background: var(--libmal-bg-hover); }
      .libmal-tab.active { background: var(--libmal-bg); border-bottom-color: var(--libmal-accent); font-weight: bold; }
      .libmal-panel { flex: 1; overflow-y: auto; padding: 16px; background: var(--libmal-bg); }
      .libmal-panel[hidden] { display: none; }
      .libmal-row { display: flex; align-items: flex-start; padding: 12px 0; border-bottom: 1px solid var(--libmal-border); }
      .libmal-row:last-child { border-bottom: none; }
      .libmal-label { min-width: 160px; flex-shrink: 0; font-weight: bold; padding-top: 6px; padding-right: 16px; text-align: left; }
      .libmal-control { flex: 1; display: flex; flex-direction: column; align-items: flex-start; gap: 2px; }
      .libmal-desc { color: var(--libmal-muted); font-size: 10px; line-height: 1.4; }
      .libmal-input { padding: 5px 8px; border: 1px solid var(--libmal-input-border); border-radius: 3px; font: inherit; background: var(--libmal-input-bg); color: var(--libmal-text); }
      .libmal-input:focus { outline: none; border-color: var(--libmal-accent); }
      .libmal-check { display: inline-flex; align-items: center; gap: 8px; cursor: pointer; min-height: 20px; padding-top: 3px; }
      .libmal-check input { width: 14px; height: 14px; margin: 0; cursor: pointer; position: relative; top: 1px; }
      .libmal-btn { padding: 6px 12px; border: none; border-radius: 3px; cursor: pointer; font: inherit; }
      .libmal-btn-primary { background: var(--libmal-accent); color: #fff; }
      .libmal-btn-primary:hover { background: var(--libmal-accent-hover); }
      .libmal-btn-secondary { background: #6c757d; color: #fff; }
      .libmal-btn-secondary:hover { background: #5a6268; }
      .libmal-btn-danger { background: var(--libmal-danger); color: #fff; }
      .libmal-footer { padding: 12px 16px; border-top: 1px solid var(--libmal-border); display: flex; justify-content: space-between; background: var(--libmal-bg-alt); border-radius: 0 0 4px 4px; }
      .libmal-footer-left, .libmal-footer-right { display: flex; gap: 8px; }
      .libmal-table { width: 100%; border-collapse: collapse; }
      .libmal-table th { background: var(--libmal-accent); color: #fff; padding: 8px; }
      .libmal-table td { padding: 6px 8px; border-bottom: 1px solid var(--libmal-border); }
      .libmal-table tr:nth-child(odd) td { background: var(--libmal-bg-alt); }
      .libmal-table tr:hover td { background: var(--libmal-bg-hover); }
      .libmal-section-header { font-weight: bold; font-size: 12px; padding: 12px 0 8px; margin-top: 16px; border-bottom: 1px solid var(--libmal-border); color: var(--libmal-text); }
      .libmal-section-header:first-child { margin-top: 0; }
      .libmal-empty { text-align: center; padding: 20px; color: var(--libmal-muted); }
      .libmal-description { margin: 0 0 12px !important; color: var(--libmal-muted); line-height: 1.4 !important; }
      .libmal-checkbox-grid { column-gap: 24px; }
      .libmal-checkbox-grid label { display: flex; padding: 5px 0; break-inside: avoid; }
      .libmal-form-row { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; padding: 12px; background: var(--libmal-bg-alt); border-radius: 4px; margin-top: 12px; }
      .libmal-export-menu { position: relative; display: inline-block; }
      .libmal-export-dropdown { position: absolute; bottom: 100%; left: 0; background: var(--libmal-bg); border: 1px solid var(--libmal-border); border-radius: 3px; box-shadow: 0 2px 8px rgba(0,0,0,0.15); display: none; min-width: 140px; }
      .libmal-export-menu.open .libmal-export-dropdown { display: block; }
      .libmal-export-item { display: block; width: 100%; padding: 8px 12px; border: none; background: transparent; text-align: left; cursor: pointer; font: inherit; color: var(--libmal-text); }
      .libmal-export-item:hover { background: var(--libmal-bg-hover); }
    `;

    if (typeof GM_addStyle !== 'undefined') GM_addStyle(css);
    else document.head.appendChild(newElement('style', { textContent: css }));
  }

  const pageWindow = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
  
  if (!pageWindow.__libmal_queue__) {
    pageWindow.__libmal_queue__ = [];
    debug('Created global registration queue on', typeof unsafeWindow !== 'undefined' ? 'unsafeWindow' : 'window');
  }

  const localScripts = new Map();
  let modal = null;
  let activeScriptId = null;

  class Tab {
    constructor(section, name) {
      this.section = section;
      this.name = name;
      this.controls = [];
    }

    get(key, def) { return this.section.get(key, def); }
    set(key, val) { this.section.set(key, val); }

    addCheckbox(key, label, opts = {}) {
      opts = applyDefaults(opts, { default: true, description: null });
      this.controls.push({ type: 'checkbox', key, label, opts });
      return this;
    }

    addInput(key, label, opts = {}) {
      opts = applyDefaults(opts, { inputType: 'text', default: '', description: null, placeholder: '', width: null, min: null, max: null });
      this.controls.push({ type: 'input', key, label, opts });
      return this;
    }

    addDropdown(key, label, opts = {}) {
      opts = applyDefaults(opts, { options: [], default: null, description: null });
      this.controls.push({ type: 'dropdown', key, label, opts });
      return this;
    }

    addHeader(text) {
      this.controls.push({ type: 'header', text });
      return this;
    }

    addDescription(text) {
      this.controls.push({ type: 'description', text });
      return this;
    }

    addCheckboxGrid(key, label, opts = {}) {
      opts = applyDefaults(opts, { items: [], columns: 3, description: null });
      this.controls.push({ type: 'checkboxGrid', key, label, opts });
      return this;
    }

    addValueTable(key, label, opts = {}) {
      opts = applyDefaults(opts, { rows: [], inputType: 'number', inputWidth: '60px', description: null });
      this.controls.push({ type: 'valueTable', key, label, opts });
      return this;
    }

    addList(key, label, opts = {}) {
      opts = applyDefaults(opts, { columns: [], addFields: [], emptyText: 'No items', description: null });
      this.controls.push({ type: 'list', key, label, opts });
      return this;
    }

    addCustom(renderFn, saveFn = null) {
      this.controls.push({ type: 'custom', render: renderFn, save: saveFn });
      return this;
    }

    render() {
      const panel = newElement('div', { className: 'libmal-panel' });
      this.controls.forEach(c => {
        let el;
        if (c.type === 'checkbox') el = this._checkbox(c);
        else if (c.type === 'input') el = this._input(c);
        else if (c.type === 'dropdown') el = this._dropdown(c);
        else if (c.type === 'header') el = newElement('div', { className: 'libmal-section-header', textContent: c.text });
        else if (c.type === 'description') el = newElement('p', { className: 'libmal-description', innerHTML: c.text });
        else if (c.type === 'checkboxGrid') el = this._checkboxGrid(c);
        else if (c.type === 'valueTable') el = this._valueTable(c);
        else if (c.type === 'list') el = this._list(c);
        else if (c.type === 'custom') el = c.render(this);
        if (el) panel.appendChild(el);
      });
      return panel;
    }

    save(container) {
      container.querySelectorAll('[data-libmal-key]').forEach(el => {
        const key = el.dataset.dlcKey;
        let val;
        if (el.type === 'checkbox') val = el.checked;
        else if (el.type === 'number') val = parseFloat(el.value) || 0;
        else val = el.value;
        this.set(key, val);
      });
      this.controls.filter(c => c.type === 'custom' && c.save).forEach(c => c.save(container, this));
      this.controls.filter(c => c.type === 'checkboxGrid').forEach(c => {
        const checked = [];
        container.querySelectorAll(`[data-libmal-grid="${c.key}"] input:checked`).forEach(cb => checked.push(cb.value));
        this.set(c.key, checked);
      });
      this.controls.filter(c => c.type === 'valueTable').forEach(c => {
        const values = {};
        container.querySelectorAll(`[data-libmal-table="${c.key}"] input`).forEach(inp => { values[inp.dataset.row] = parseFloat(inp.value) || 0; });
        this.set(c.key, values);
      });
      this.controls.filter(c => c.type === 'list').forEach(c => {
        const listEl = container.querySelector(`[data-libmal-list="${c.key}"]`);
        if (listEl && listEl._dlcItems) this.set(c.key, listEl._dlcItems);
      });
    }

    _row(label, content) {
      return newElement('div', { className: 'libmal-row' }, [
        newElement('div', { className: 'libmal-label' }, [label]),
        newElement('div', { className: 'libmal-control' }, [content])
      ]);
    }

    _checkbox(c) {
      const cb = newElement('input', { type: 'checkbox', checked: this.get(c.key, c.opts.default) });
      cb.dataset.dlcKey = c.key;
      return this._row(c.label, newElement('label', { className: 'libmal-check' }, [cb, c.opts.description || '']));
    }

    _input(c) {
      const inp = newElement('input', { type: c.opts.inputType, className: 'libmal-input', value: this.get(c.key, c.opts.default), placeholder: c.opts.placeholder });
      inp.dataset.dlcKey = c.key;
      if (c.opts.inputType === 'number') { if (c.opts.min != null) inp.min = c.opts.min; if (c.opts.max != null) inp.max = c.opts.max; }
      if (c.opts.width) inp.style.width = c.opts.width;
      const frag = document.createDocumentFragment();
      frag.appendChild(inp);
      if (c.opts.description) frag.appendChild(newElement('div', { className: 'libmal-desc', textContent: c.opts.description }));
      return this._row(c.label, frag);
    }

    _dropdown(c) {
      const sel = newElement('select', { className: 'libmal-input' });
      sel.dataset.dlcKey = c.key;
      const cur = this.get(c.key, c.opts.default);
      c.opts.options.forEach(([text, val]) => {
        const opt = newElement('option', { value: val, textContent: text });
        if (val === cur) opt.selected = true;
        sel.appendChild(opt);
      });
      const frag = document.createDocumentFragment();
      frag.appendChild(sel);
      if (c.opts.description) frag.appendChild(newElement('div', { className: 'libmal-desc', textContent: c.opts.description }));
      return this._row(c.label, frag);
    }

    _checkboxGrid(c) {
      const container = newElement('div');
      if (c.opts.description) container.appendChild(newElement('p', { className: 'libmal-description', textContent: c.opts.description }));
      const grid = newElement('div', { className: 'libmal-checkbox-grid' });
      grid.style.columnCount = c.opts.columns;
      grid.dataset.dlcGrid = c.key;
      const current = this.get(c.key, []);
      const items = typeof c.opts.items === 'function' ? c.opts.items() : c.opts.items;
      items.forEach(item => {
        const label = newElement('label', { className: 'libmal-check' });
        const cb = newElement('input', { type: 'checkbox', value: item, checked: current.includes(item) });
        label.appendChild(cb);
        label.appendChild(document.createTextNode(item));
        grid.appendChild(label);
      });
      container.appendChild(grid);
      return container;
    }

    _valueTable(c) {
      const container = newElement('div');
      if (c.opts.description) container.appendChild(newElement('p', { className: 'libmal-description', textContent: c.opts.description }));
      const table = newElement('table', { className: 'libmal-table' });
      table.dataset.dlcTable = c.key;
      table.innerHTML = `<thead><tr><th>${c.label}</th><th style="width:${c.opts.inputWidth}">Value</th></tr></thead><tbody></tbody>`;
      const tbody = table.querySelector('tbody');
      const current = this.get(c.key, {});
      const rows = typeof c.opts.rows === 'function' ? c.opts.rows() : c.opts.rows;
      rows.forEach(row => {
        const tr = newElement('tr');
        const val = current[row.key] ?? row.default ?? 50;
        tr.innerHTML = `<td>${row.label}</td><td><input type="${c.opts.inputType}" class="libmal-input" data-row="${row.key}" value="${val}" style="width:${c.opts.inputWidth}"></td>`;
        tbody.appendChild(tr);
      });
      container.appendChild(table);
      return container;
    }

    _list(c) {
      const container = newElement('div');
      if (c.opts.description) container.appendChild(newElement('p', { className: 'libmal-description', textContent: c.opts.description }));
      const table = newElement('table', { className: 'libmal-table' });
      table.dataset.dlcList = c.key;
      const headerRow = c.opts.columns.map(col => `<th>${col}</th>`).join('') + '<th style="width:60px">Action</th>';
      table.innerHTML = `<thead><tr>${headerRow}</tr></thead><tbody></tbody>`;
      const tbody = table.querySelector('tbody');
      let items = [...this.get(c.key, [])];
      table._dlcItems = items;

      function renderList() {
        tbody.innerHTML = '';
        if (items.length === 0) {
          tbody.innerHTML = `<tr><td colspan="${c.opts.columns.length + 1}" class="libmal-empty">${c.opts.emptyText}</td></tr>`;
          return;
        }
        items.forEach((item, i) => {
          const tr = newElement('tr');
          const cells = c.opts.columns.map((_, ci) => `<td>${Object.values(item)[ci] || ''}</td>`).join('');
          tr.innerHTML = `${cells}<td><button class="libmal-btn libmal-btn-danger" data-remove="${i}" style="padding:3px 8px;font-size:10px">Remove</button></td>`;
          tbody.appendChild(tr);
        });
      }
      renderList();

      tbody.onclick = e => {
        if (e.target.dataset.remove !== undefined) {
          items.splice(parseInt(e.target.dataset.remove, 10), 1);
          table._dlcItems = items;
          renderList();
        }
      };

      if (c.opts.addFields.length > 0) {
        const form = newElement('div', { className: 'libmal-form-row' });
        const inputs = [];
        c.opts.addFields.forEach(field => {
          if (field.type === 'text') {
            const inp = newElement('input', { type: 'text', className: 'libmal-input', placeholder: field.placeholder || '' });
            if (field.flex) inp.style.flex = field.flex;
            if (field.minWidth) inp.style.minWidth = field.minWidth;
            inputs.push({ el: inp, field });
            form.appendChild(inp);
          } else if (field.type === 'select') {
            const sel = newElement('select', { className: 'libmal-input' });
            const options = typeof field.options === 'function' ? field.options() : field.options;
            sel.innerHTML = options.map(([text, val]) => `<option value="${val}">${text}</option>`).join('');
            inputs.push({ el: sel, field });
            form.appendChild(sel);
          }
        });
        const addBtn = newElement('button', { className: 'libmal-btn libmal-btn-primary', textContent: 'Add' });
        addBtn.onclick = () => {
          const newItem = {};
          inputs.forEach((inp, i) => { newItem[c.opts.addFields[i].key || `field${i}`] = inp.el.value; });
          if (Object.values(newItem).some(v => !v && v !== 0)) { alert('Please fill all fields'); return; }
          items.push(newItem);
          table._dlcItems = items;
          inputs.forEach(inp => { inp.el.value = ''; });
          renderList();
        };
        form.appendChild(addBtn);
        container.appendChild(table);
        container.appendChild(form);
      } else {
        container.appendChild(table);
      }
      return container;
    }
  }

  class Section {
    constructor(id, opts) {
      this.id = id;
      this.opts = applyDefaults(opts, { title: id });
      this.tabs = new Map();
      this._defaultTab = new Tab(this, 'Settings');
      this._knownKeys = new Set();
      debug(`Section created: ${id}`);
    }

    get(key, def) {
      const stored = GM_getValue(`${SCRIPT_PREFIX}_${key}`, undefined);
      if (stored === undefined) return def;
      this._knownKeys.add(key);
      return stored;
    }

    set(key, val) {
      this._knownKeys.add(key);
      GM_setValue(`${SCRIPT_PREFIX}_${key}`, val);
    }

    tab(name) {
      if (!this.tabs.has(name)) this.tabs.set(name, new Tab(this, name));
      return this.tabs.get(name);
    }

    addCheckbox(k, l, o) { this._defaultTab.addCheckbox(k, l, o); return this; }
    addInput(k, l, o) { this._defaultTab.addInput(k, l, o); return this; }
    addDropdown(k, l, o) { this._defaultTab.addDropdown(k, l, o); return this; }
    addHeader(t) { this._defaultTab.addHeader(t); return this; }
    addDescription(t) { this._defaultTab.addDescription(t); return this; }
    addCheckboxGrid(k, l, o) { this._defaultTab.addCheckboxGrid(k, l, o); return this; }
    addValueTable(k, l, o) { this._defaultTab.addValueTable(k, l, o); return this; }
    addList(k, l, o) { this._defaultTab.addList(k, l, o); return this; }
    addCustom(r, s) { this._defaultTab.addCustom(r, s); return this; }

    getTabs() {
      if (this.tabs.size > 0) return Array.from(this.tabs.values());
      if (this._defaultTab.controls.length > 0) return [this._defaultTab];
      return [];
    }

    exportData() {
      const data = {};
      this.getTabs().forEach(tab => {
        tab.controls.forEach(c => {
          if (c.key) this._knownKeys.add(c.key);
        });
      });
      this._knownKeys.forEach(key => {
        const val = this.get(key, undefined);
        if (val !== undefined) data[key] = val;
      });
      return data;
    }

    importData(data) {
      Object.entries(data).forEach(([k, v]) => this.set(k, v));
    }
  }

  // Collect all scripts from global queue
  function getAllScripts() {
    const all = new Map();
    // Add from global queue
    pageWindow.__libmal_queue__.forEach(s => {
      if (!all.has(s.id)) {
        all.set(s.id, s);
        debug(`Collected from queue: ${s.id}`);
      }
    });
    // Add local scripts
    localScripts.forEach((s, id) => {
      if (!all.has(id)) {
        all.set(id, s);
        debug(`Collected from local: ${id}`);
      }
    });
    debug(`Total scripts: ${all.size}`);
    return all;
  }

  const settings = {
    registerScript(id, opts = {}) {
      debug(`registerScript called: ${id}`);
      
      const existing = pageWindow.__libmal_queue__.find(s => s.id === id);
      if (existing) {
        debug(`Already registered in queue: ${id}`);
        return existing;
      }

      if (localScripts.has(id)) {
        debug(`Already registered locally: ${id}`);
        return localScripts.get(id);
      }

      const section = new Section(id, opts);
      localScripts.set(id, section);
      pageWindow.__libmal_queue__.push(section);
      debug(`Registered and queued: ${id}, queue size: ${pageWindow.__libmal_queue__.length}`);
      return section;
    },

    get(scriptId, key, def) {
      const s = localScripts.get(scriptId) || pageWindow.__libmal_queue__.find(s => s.id === scriptId);
      return s ? s.get(key, def) : def;
    },

    set(scriptId, key, val) {
      const s = localScripts.get(scriptId) || pageWindow.__libmal_queue__.find(s => s.id === scriptId);
      if (s) s.set(key, val);
    },

    showModal() {
      injectStyles();
      if (modal) modal.remove();
      
      const scripts = getAllScripts();
      debug(`showModal: ${scripts.size} scripts`);
      
      if (scripts.size === 0) {
        debug('No scripts registered!');
        return;
      }
      
      activeScriptId = scripts.keys().next().value;
      modal = createModal(scripts);
      document.body.appendChild(modal);
    },

    hideModal() {
      if (modal) { modal.remove(); modal = null; }
    },

    injectDropdownLink() {
      debug('injectDropdownLink called');
      
      const dropdown = document.querySelector('.header-profile-dropdown ul');
      if (!dropdown) {
        debug('Dropdown not found');
        return;
      }
      
      if (dropdown.querySelector('#libmal-settings-link')) {
        debug('Link already exists');
        return;
      }

      const logout = dropdown.querySelector('form[action*="logout"]');
      if (!logout) {
        debug('Logout form not found');
        return;
      }

      const li = newElement('li');
      li.innerHTML = `<a href="javascript:void(0);" id="libmal-settings-link"><i class="fa-solid fa-fw fa-gear mr4"></i>Userscript Settings</a>`;
      dropdown.insertBefore(li, logout.parentElement);
      li.querySelector('#libmal-settings-link').onclick = e => { e.preventDefault(); settings.showModal(); };
      debug('Dropdown link injected');
    }
  };

  function createModal(scripts) {
    debug('createModal called');
    const overlay = newElement('div', { className: 'libmal-overlay' });
    const m = newElement('div', { className: 'libmal-modal' });
    overlay.appendChild(m);

    const header = newElement('div', { className: 'libmal-header' }, [
      newElement('h2', {}, [newElement('i', { className: 'fa-solid fa-gear' }), ' Userscript Settings']),
      newElement('button', { className: 'libmal-close', textContent: '×', onclick: () => settings.hideModal() })
    ]);
    m.appendChild(header);

    const body = newElement('div', { className: 'libmal-body' });
    const sidebar = newElement('div', { className: 'libmal-sidebar' });
    const content = newElement('div', { className: 'libmal-content' });
    body.appendChild(sidebar);
    body.appendChild(content);
    m.appendChild(body);

    const scriptList = Array.from(scripts.entries()).sort((a, b) => a[1].opts.title.localeCompare(b[1].opts.title));
    debug(`Rendering ${scriptList.length} scripts in sidebar`);

    scriptList.forEach(([id, section], i) => {
      const btn = newElement('button', { className: `libmal-script-btn${i === 0 ? ' active' : ''}`, textContent: section.opts.title });
      btn.dataset.id = id;
      btn.onclick = () => selectScript(id);
      sidebar.appendChild(btn);
    });

    function selectScript(id) {
      activeScriptId = id;
      sidebar.querySelectorAll('.libmal-script-btn').forEach(b => b.classList.toggle('active', b.dataset.id === id));
      renderScriptContent(id);
    }

    function renderScriptContent(id) {
      content.innerHTML = '';
      const section = scripts.get(id);
      if (!section) return;

      const tabs = section.getTabs();
      debug(`Script ${id} has ${tabs.length} tabs`);
      
      if (tabs.length === 0) {
        content.appendChild(newElement('div', { className: 'libmal-panel libmal-empty', textContent: 'No settings configured.' }));
        return;
      }

      if (tabs.length > 1) {
        const tabBar = newElement('div', { className: 'libmal-tabs' });
        tabs.forEach((tab, i) => {
          const btn = newElement('button', { className: `libmal-tab${i === 0 ? ' active' : ''}`, textContent: tab.name });
          btn.dataset.tab = tab.name;
          btn.onclick = () => {
            tabBar.querySelectorAll('.libmal-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab.name));
            content.querySelectorAll('.libmal-panel').forEach(p => p.hidden = p.dataset.tab !== tab.name);
          };
          tabBar.appendChild(btn);
        });
        content.appendChild(tabBar);
      }

      tabs.forEach((tab, i) => {
        const panel = tab.render();
        panel.dataset.tab = tab.name;
        panel.dataset.scriptId = id;
        if (tabs.length > 1 && i > 0) panel.hidden = true;
        content.appendChild(panel);
      });
    }

    if (scriptList.length > 0) renderScriptContent(scriptList[0][0]);

    const footer = newElement('div', { className: 'libmal-footer' });
    const left = newElement('div', { className: 'libmal-footer-left' });
    const right = newElement('div', { className: 'libmal-footer-right' });

    const exportMenu = newElement('div', { className: 'libmal-export-menu' });
    const exportBtn = newElement('button', { className: 'libmal-btn libmal-btn-secondary', textContent: 'Export ▾' });
    const exportDropdown = newElement('div', { className: 'libmal-export-dropdown' });
    exportDropdown.appendChild(newElement('button', { className: 'libmal-export-item', textContent: 'This Script', onclick: () => exportScript(activeScriptId, scripts) }));
    exportDropdown.appendChild(newElement('button', { className: 'libmal-export-item', textContent: 'All Scripts', onclick: () => exportAll(scripts) }));
    exportBtn.onclick = () => exportMenu.classList.toggle('open');
    exportMenu.appendChild(exportBtn);
    exportMenu.appendChild(exportDropdown);
    left.appendChild(exportMenu);

    const importBtn = newElement('button', { className: 'libmal-btn libmal-btn-secondary', textContent: 'Import', onclick: () => importSettings(scripts) });
    left.appendChild(importBtn);

    const cancelBtn = newElement('button', { className: 'libmal-btn libmal-btn-secondary', textContent: 'Cancel', onclick: () => settings.hideModal() });
    const saveBtn = newElement('button', { className: 'libmal-btn libmal-btn-primary', textContent: 'Save & Reload', onclick: () => saveAll(scripts) });
    right.appendChild(cancelBtn);
    right.appendChild(saveBtn);

    footer.appendChild(left);
    footer.appendChild(right);
    m.appendChild(footer);

    overlay.onclick = e => { if (e.target === overlay) settings.hideModal(); };
    document.addEventListener('click', e => { if (!exportMenu.contains(e.target)) exportMenu.classList.remove('open'); });

    return overlay;
  }

  function saveAll(scripts) {
    const panels = modal.querySelectorAll('.libmal-panel[data-script-id]');
    panels.forEach(panel => {
      const id = panel.dataset.scriptId;
      const tabName = panel.dataset.tab;
      const section = scripts.get(id);
      if (!section) return;
      const tab = section.tabs.get(tabName) || section._defaultTab;
      tab.save(panel);
    });
    settings.hideModal();
    location.reload();
  }

  function exportScript(id, scripts) {
    debug(`Exporting script: ${id}`);
    const section = scripts.get(id);
    if (!section) {
      debug(`Script not found for export: ${id}`);
      return;
    }
    const data = { [id]: section.exportData() };
    debug(`Export data for ${id}:`, data);
    downloadJson(`${id}-settings.json`, data);
  }

  function exportAll(scripts) {
    const data = {};
    scripts.forEach((section, id) => { data[id] = section.exportData(); });
    downloadJson('mal-userscript-settings.json', data);
  }

  function downloadJson(filename, data) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function importSettings(scripts) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = e => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = ev => {
        try {
          const data = JSON.parse(ev.target.result);
          const imported = [];
          const skipped = [];
          Object.entries(data).forEach(([id, vals]) => {
            const section = scripts.get(id);
            if (section) {
              section.importData(vals);
              imported.push(id);
            } else {
              skipped.push(id);
            }
          });
          if (imported.length === 0) {
            alert(`No matching scripts found in import file.\nFile contains: ${Object.keys(data).join(', ')}`);
            return;
          }
          if (skipped.length > 0) {
            alert(`Imported settings for: ${imported.join(', ')}\nSkipped (not installed): ${skipped.join(', ')}`);
          }
          settings.hideModal();
          location.reload();
        } catch { alert('Invalid settings file - could not parse JSON'); }
      };
      reader.readAsText(file);
    };
    input.click();
  }

  debug('Library loaded');
  return { settings, utilities, Tab, Section };
})();
