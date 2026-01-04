// ==UserScript==
// @name         enhanced such.pl
// @namespace    https://greasyfork.org/de/users/1516523-martink
// @version      1.6.6
// @description  Checkboxen steuern die Linkgenerierung für "Vergleichen" / "IDs kopieren" / "Bezeichnungen kopieren" / "Ersetzer" / "mass-image", Custom-Button für Extract, Toggle Master Checkbox, Copy Icons Toggle (normal und maskiert), Button-Sichtbarkeit konfigurierbar, such.pl Button, Broken MR öffnen
// @author       Martin Kaiser
// @match        https://opus.geizhals.at/pv-edit/such.pl*
// @run-at       document-idle
// @grant        none
// @license      MIT
// @icon         http://666kb.com/i/fxfm86s1jawf7ztn7.jpg
// @downloadURL https://update.greasyfork.org/scripts/551749/enhanced%20suchpl.user.js
// @updateURL https://update.greasyfork.org/scripts/551749/enhanced%20suchpl.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // CRITICAL: Only run on such.pl pages
  if (!window.location.href.includes('such.pl')) {
    return;
  }

  const MAX_ITEMS = 12;
  const CUSTOM_REGEX_COOKIE = 'gh_custom_regex';
  const EXTRACT_FIELD_COOKIE = 'gh_extract_field';
  const COPY_ICONS_ENABLED_KEY = 'gh_copy_icons_enabled';
  const COPY_ICONS_MASKED_ENABLED_KEY = 'gh_copy_icons_masked_enabled';
  const COPY_ICONS_ARTICLE_ID_KEY = 'gh_copy_icons_article_id_enabled';


  // ---------- CSS ----------
  function injectStyles() {
    if (document.getElementById('gh-selected-style')) return;
    const css = `
button.top_button{
  appearance:none;font-weight:600;border-radius:10px;border:1px solid #d1d5db;
  background:#f3f4f6;color:#111827;padding:8px 12px;line-height:1.2;
  transition:background .18s ease,color .18s ease,box-shadow .18s ease,transform .18s ease,border-color .18s ease,opacity .18s ease;
  opacity:.95; position:relative;
}
button.top_button + .top_button{margin-left:6px}
button.top_button:hover{background:#e5e7eb}
button.top_button:focus-visible{outline:3px solid #93c5fd;outline-offset:2px}

/* Blau bei aktiver Auswahl */
body.gh-has-selection .btn-clipboard,
body.gh-has-selection .btn-ersetzer,
body.gh-has-selection .btn-mass-image,
body.gh-has-selection .btn-labels,
body.gh-has-selection .btn-compare,
body.gh-has-selection .btn-suchpl{
  background:#2563eb;color:#fff;border-color:#1d4ed8;
  box-shadow:0 6px 14px rgba(37,99,235,.25);
  transform:translateY(-1px);opacity:1
}
body.gh-has-selection .btn-clipboard:hover,
body.gh-has-selection .btn-ersetzer:hover,
body.gh-has-selection .btn-mass-image:hover,
body.gh-has-selection .btn-labels:hover,
body.gh-has-selection .btn-compare:hover,
body.gh-has-selection .btn-suchpl:hover{ background:#1d4ed8 }

/* Ausgegraut wenn zu viele Artikel */
button.top_button.is-disabled{
  background:#e5e7eb;
  color:#9ca3af;
  border-color:#d1d5db;
  opacity:.6;
  cursor:not-allowed;
  box-shadow:none;
  transform:none;
}
body.gh-has-selection button.top_button.is-disabled{
  background:#e5e7eb;
  color:#9ca3af;
  border-color:#d1d5db;
  box-shadow:none;
  transform:none;
}
button.top_button.is-disabled:hover{
  background:#e5e7eb;
}

/* Checkbox-Optik */
.product-checkbox{
  width:18px;height:18px;margin-right:6px;vertical-align:middle;position:relative;top:1px;
  accent-color:#2563eb
}

/* Toggle Switch */
.gh-toggle-switch {
  position: relative;
  display: inline-block;
  width: 42px;
  height: 22px;
}

.gh-toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.gh-toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #d1d5db;
  transition: .3s;
  border-radius: 22px;
}

.gh-toggle-slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: .3s;
  border-radius: 50%;
}

input:checked + .gh-toggle-slider {
  background-color: #2563eb;
}

input:checked + .gh-toggle-slider:before {
  transform: translateX(20px);
}

/* Master-Checkbox – kompakt, steht VOR der Tabelle */
.gh-master-wrap {
  margin: 6px 0 4px 0;
  display: inline-flex;
  align-items: center;
  gap: 0;
  line-height: 1;
}

.gh-master {
  width: 18px;
  height: 18px;
  accent-color: #2563eb;
  vertical-align: middle;
  cursor: pointer;
}

/* Settings Icon */
.gh-settings-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  margin-right: 12px;
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  vertical-align: middle;
  font-size: 18px;
}

.gh-settings-icon:hover {
  background: #e5e7eb;
}

/* Settings Overlay */
.gh-settings-overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 10000;
  padding-top: 80px;
  overflow-y: auto;
}

.gh-settings-overlay.active {
  display: block;
}

.gh-settings-dialog {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
  padding: 24px;
  min-width: 400px;
  max-width: 500px;
  margin: 0 auto;
}

.gh-settings-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.gh-settings-title {
  font-size: 20px;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.gh-settings-close {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.15s ease;
}

.gh-settings-close:hover {
  background: #f3f4f6;
}

.gh-settings-close svg {
  width: 20px;
  height: 20px;
  stroke: #6b7280;
  stroke-width: 2;
}

.gh-settings-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.gh-settings-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
}

.gh-settings-item-left {
  display: flex;
  align-items: center;
}

.gh-settings-item-text {
  flex: 1;
}

.gh-settings-item-label {
  font-size: 15px;
  font-weight: 500;
  color: #374151;
  user-select: none;
}

.gh-settings-item-description {
  font-size: 13px;
  color: #6b7280;
  margin-top: 4px;
}

/* Copy Icons Section */
.gh-copy-icons-section {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 12px;
  background: #fafafa;
}

.gh-copy-icons-title {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 12px;
}

.gh-copy-icons-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.gh-copy-icons-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 10px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  transition: background 0.15s ease;
}

.gh-copy-icons-item:hover {
  background: #f9fafb;
}

.gh-copy-icons-item-text {
  flex: 1;
}

.gh-copy-icons-item-label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  user-select: none;
}

.gh-copy-icons-item-description {
  font-size: 12px;
  color: #6b7280;
  margin-top: 2px;
}

/* Copy Icons Toggle */
.gh-copy-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  margin-left: 6px;
  padding: 0;
  background: transparent;
  border: none;
  cursor: pointer;
  opacity: 0.5;
  transition: opacity 0.2s ease, transform 0.1s ease;
  vertical-align: middle;
}

.gh-copy-icon:hover {
  opacity: 1;
  transform: scale(1.1);
}

.gh-copy-icon svg {
  width: 16px;
  height: 16px;
  stroke: #374151;
  stroke-width: 2;
  fill: none;
}

.gh-copy-icon.masked svg {
  stroke: #2563eb;
}

.gh-copy-icon.copied svg {
  stroke: #16a34a;
}

.gh-copy-icon.copied {
  opacity: 1;
}

/* Copy Icon for Article IDs (inside brackets) */
.gh-copy-icon-article-id {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  margin-left: 2px;
  padding: 0;
  background: transparent;
  border: none;
  cursor: pointer;
  opacity: 0.5;
  transition: opacity 0.2s ease, transform 0.1s ease;
  vertical-align: middle;
}

.gh-copy-icon-article-id:hover {
  opacity: 1;
  transform: scale(1.1);
}

.gh-copy-icon-article-id svg {
  width: 12px;
  height: 12px;
  stroke: #374151;
  stroke-width: 2;
  fill: none;
}

.gh-copy-icon-article-id.copied svg {
  stroke: #16a34a;
}

.gh-copy-icon-article-id.copied {
  opacity: 1;
}

/* Dropdowns */
.gh-dropdown{
  display:none;position:absolute;background:#fff;border:1px solid #d1d5db;
  box-shadow:0 8px 20px rgba(0,0,0,.15);z-index:1000;min-width:340px;border-radius:8px;overflow:hidden
}
.gh-dropdown__item{ padding:10px 12px;cursor:pointer;background:#fff }
.gh-dropdown__item + .gh-dropdown__item{border-top:1px solid #eee}
.gh-dropdown__item:hover{background:#f3f4f6}
.gh-dropdown__item.is-disabled{
  opacity:0.6;
  cursor:not-allowed;
  pointer-events:none;
}

/* Dropdown Items mit Input */
.gh-dropdown__item-with-input {
  padding: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  border-top: 1px solid #eee;
  background: #fff;
  transition: opacity 0.15s ease;
}

.gh-dropdown__item-label {
  flex: 0 0 auto;
  font-size: 13px;
  font-weight: 500;
  color: #374151;
  white-space: nowrap;
  min-width: 140px;
  user-select: none;
  transition: color 0.15s ease, opacity 0.15s ease;
}

.gh-dropdown__item-with-input.is-disabled .gh-dropdown__item-label {
  color: #9ca3af;
  opacity: 0.55;
}

/* Check-Animation (Häkchen-Pop) */
@keyframes ghTickPop {0%{transform:scale(0);opacity:0} 60%{transform:scale(1.15);opacity:1} 100%{transform:scale(1)}}
button.top_button.is-success{ background:#16a34a; border-color:#15803d; color:#fff; }
button.top_button.is-success::before{
  content:""; width:16px; height:16px; position:absolute; left:10px; top:50%; transform:translateY(-50%);
  background:currentColor;
  -webkit-mask:url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>') no-repeat center/contain;
          mask:url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>') no-repeat center/contain;
  animation: ghTickPop .42s ease-out;
}

/* Regex Buttons */
.gh-regex-btn{
  appearance:none;font-weight:500;border-radius:6px;border:1px solid #d1d5db;
  background:#fff;color:#374151;padding:6px 10px;font-size:13px;
  margin-left:6px;cursor:pointer;
  transition:all .15s ease;
}
.gh-regex-btn:hover{
  background:#f9fafb;border-color:#9ca3af;
}
.gh-regex-btn.is-custom{
  background:#fef3c7;border-color:#fbbf24;color:#92400e;
}
.gh-regex-btn.is-custom:hover{
  background:#fde68a;
}

/* Edit Dialog */
.gh-edit-dialog{
  display:none;position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);
  background:#fff;border:1px solid #d1d5db;box-shadow:0 20px 50px rgba(0,0,0,.3);
  border-radius:12px;padding:24px;min-width:400px;z-index:10000;
}
.gh-edit-dialog__title{
  font-size:18px;font-weight:600;margin-bottom:16px;color:#111827;
}
.gh-edit-dialog__input{
  width:100%;padding:10px 12px;border:1px solid #d1d5db;border-radius:6px;
  font-family:monospace;font-size:14px;margin-bottom:16px;
}
.gh-edit-dialog__radio-group{
  margin-bottom:16px;
}
.gh-edit-dialog__radio-label{
  display:block;margin-bottom:8px;font-size:14px;font-weight:500;color:#374151;
}
.gh-edit-dialog__radio-option{
  display:flex;align-items:center;margin-bottom:8px;cursor:pointer;
}
.gh-edit-dialog__radio-option input[type="radio"]{
  width:16px;height:16px;margin-right:8px;cursor:pointer;accent-color:#2563eb;
}
.gh-edit-dialog__radio-option label{
  cursor:pointer;font-size:14px;color:#374151;
}
.gh-edit-dialog__buttons{
  display:flex;gap:8px;justify-content:flex-end;
}
.gh-edit-dialog__btn{
  padding:8px 16px;border-radius:6px;border:1px solid #d1d5db;
  font-weight:500;cursor:pointer;transition:all .15s ease;
}
.gh-edit-dialog__btn--primary{
  background:#2563eb;color:#fff;border-color:#1d4ed8;
}
.gh-edit-dialog__btn--primary:hover{
  background:#1d4ed8;
}
.gh-edit-dialog__btn--secondary{
  background:#fff;color:#374151;
}
.gh-edit-dialog__btn--secondary:hover{
  background:#f3f4f6;
}
.gh-edit-dialog-overlay{
  display:none;position:fixed;top:0;left:0;right:0;bottom:0;
  background:rgba(0,0,0,.4);z-index:9999;
}

/* Button Visibility Control */
.gh-btn-visibility {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 12px;
  background: #fafafa;
}

.gh-btn-visibility-title {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 12px;
}

.gh-btn-visibility-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.gh-btn-visibility-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 10px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  transition: background 0.15s ease;
}

.gh-btn-visibility-item:hover {
  background: #f9fafb;
}

.gh-btn-visibility-label {
  font-size: 14px;
  color: #374151;
  user-select: none;
}

.gh-btn-visibility-controls {
  display: flex;
  gap: 4px;
}

.gh-btn-visibility-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.15s ease;
  padding: 0;
}

.gh-btn-visibility-icon:hover:not(.disabled) {
  background: #f3f4f6;
  border-color: #9ca3af;
}

.gh-btn-visibility-icon.disabled {
  opacity: 0.3;
  cursor: not-allowed;
  border-color: #e5e7eb;
}

.gh-btn-visibility-icon svg {
  width: 14px;
  height: 14px;
  stroke: #374151;
  stroke-width: 2;
}

.gh-btn-visibility-icon.disabled svg {
  stroke: #d1d5db;
}

/* Broken MR Overlay */
.gh-broken-mr-overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 10000;
  padding-top: 80px;
  overflow-y: auto;
}

.gh-broken-mr-overlay.active {
  display: block;
}

.gh-broken-mr-dialog {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
  padding: 24px;
  min-width: 400px;
  max-width: 500px;
  margin: 0 auto;
}

.gh-broken-mr-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.gh-broken-mr-title {
  font-size: 20px;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.gh-broken-mr-close {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.15s ease;
}

.gh-broken-mr-close:hover {
  background: #f3f4f6;
}

.gh-broken-mr-close svg {
  width: 20px;
  height: 20px;
  stroke: #6b7280;
  stroke-width: 2;
}

.gh-broken-mr-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 60vh;
  overflow-y: auto;
}

.gh-broken-mr-item {
  display: flex;
  align-items: center;
  padding: 12px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  transition: all 0.15s ease;
}

.gh-broken-mr-item:hover {
  background: #f3f4f6;
  border-color: #d1d5db;
}

.gh-broken-mr-item a {
  flex: 1;
  color: #2563eb;
  text-decoration: none;
  font-weight: 500;
  word-break: break-all;
}

.gh-broken-mr-item a:hover {
  text-decoration: underline;
}

.gh-broken-mr-count {
  font-size: 13px;
  color: #6b7280;
  padding: 12px 0;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 12px;
}
`;
    const style = document.createElement('style');
    style.id = 'gh-selected-style';
    style.textContent = css;
    document.head.appendChild(style);
  }

  // ---------- Cookie Storage Utilities ----------
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return decodeURIComponent(parts.pop().split(';').shift());
    return null;
  }

  function setCookie(name, value, days = 365) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${encodeURIComponent(value)};${expires};path=/`;
  }

  function getCustomRegex() {
    return getCookie(CUSTOM_REGEX_COOKIE) || 'Key: (.*)';
  }

  function setCustomRegex(value) {
    setCookie(CUSTOM_REGEX_COOKIE, value);
  }

  function getExtractField() {
    return getCookie(EXTRACT_FIELD_COOKIE) || 'beschreibung';
  }

  function setExtractField(value) {
    setCookie(EXTRACT_FIELD_COOKIE, value);
  }

  function getMasterCheckboxEnabled() {
    return getCookie('gh_master_checkbox_enabled') === 'true';
  }

  function setMasterCheckboxEnabled(value) {
    setCookie('gh_master_checkbox_enabled', value ? 'true' : 'false');
  }

  // ---------- Button Visibility Storage ----------
  const BUTTON_VISIBILITY_KEY = 'gh_button_visibility';
  const BUTTON_CONFIGS = {
    'brokenMr': { label: 'Broken MR öffnen', selector: '.btn-broken-mr' },
    'compare': { label: 'Vergleichen', selector: '.btn-compare' },
    'templates': { label: 'Templates-Rendern', selector: 'button.top_button', textMatch: 'rendern' },
    'clipboard': { label: 'IDs kopieren', selector: '.btn-clipboard' },
    'labels': { label: 'Bezeichnungen kopieren', selector: '.btn-labels' },
    'erstzuordnung': { label: 'Erstzuordnungen testen', selector: 'button.top_button', textMatch: 'erstzuordnung' },
    'massimage': { label: 'mass-image', selector: '.btn-mass-image' },
    'suchpl': { label: 'such.pl', selector: '.btn-suchpl' },
    'ersetzer': { label: 'Artikel-Ersetzer', selector: 'button.top_button', textMatch: 'ersetzer' }
  };

  function getButtonVisibility() {
    const stored = localStorage.getItem(BUTTON_VISIBILITY_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    const defaultVisibility = {};
    Object.keys(BUTTON_CONFIGS).forEach(key => {
      defaultVisibility[key] = true;
    });
    return defaultVisibility;
  }

  function setButtonVisibility(key, visible) {
    const current = getButtonVisibility();
    current[key] = visible;
    localStorage.setItem(BUTTON_VISIBILITY_KEY, JSON.stringify(current));
  }

  function applyButtonVisibility() {
    const visibility = getButtonVisibility();
    Object.entries(BUTTON_CONFIGS).forEach(([key, config]) => {
      const isVisible = visibility[key] !== false;
      let button;

      if (config.textMatch) {
        button = $$('button.top_button').find(b =>
          (b.textContent || '').toLowerCase().includes(config.textMatch)
        );
      } else {
        button = $(config.selector);
      }

      if (button) {
        button.style.display = isVisible ? '' : 'none';
      }
    });
  }

  function updateExtractFieldDropdown() {
    const dropdown = document.querySelector('select[name="extract_field"]');
    if (dropdown) {
      dropdown.value = getExtractField();
    }
  }

  // ---------- Utilities ----------
  const formatId = (id) => (id || '').toString().replace(/^0+/, '') || '0';
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function getSelectedIds() { return $$('.product-checkbox:checked').map(cb => formatId(cb.dataset.productId)); }
  function getAllIds() { return $$('.product-checkbox').map(cb => formatId(cb.dataset.productId)); }

  function updateSelectionState() {
    document.body.classList.toggle('gh-has-selection', getSelectedIds().length > 0);
    updateCompareButtonState();
    updateMasterCheckboxState();
  }
  function bindSelectionListeners() {
    $$('.product-checkbox').forEach(cb => {
      if (cb.dataset.ghBound) return;
      cb.addEventListener('change', updateSelectionState);
      cb.dataset.ghBound = 'true';
    });
    updateSelectionState();
  }

  // ---------- Checkboxen einbauen ----------
  function replaceRadiosWithCheckboxes() {
    const radios = $$('input[type="radio"][name="a_id"]');
    if (radios.length === 0) return;
    radios.forEach(r => {
      const val = (r.value || '').trim();
      if (val === '') { r.remove(); return; }
      const pid = formatId(val);
      if (!/^\d+$/.test(pid)) { r.remove(); return; }
      if (r.previousElementSibling && r.previousElementSibling.classList?.contains('product-checkbox')) { r.remove(); return; }
      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.className = 'product-checkbox';
      cb.dataset.productId = pid;
      cb.style.marginRight = '5px';
      cb.style.verticalAlign = 'middle';
      cb.style.position = 'relative';
      cb.style.top = '1px';
      r.parentNode.insertBefore(cb, r);
      r.remove();
    });
  }

  // ---------- OPTIMIZED: ID->Label Map Cache ----------
  let labelMapCache = null;
  let labelMapCacheTimestamp = 0;
  const CACHE_LIFETIME = 5000; // 5 Sekunden Cache

  function buildLabelMap() {
    const now = Date.now();
    // Cache-Check
    if (labelMapCache && (now - labelMapCacheTimestamp < CACHE_LIFETIME)) {
      return labelMapCache;
    }

    const map = new Map();

    // Alle Rows einmal durchgehen und Map aufbauen
    const rows = $$('tr');
    rows.forEach(row => {
      const checkbox = row.querySelector('.product-checkbox');
      if (!checkbox) return;

      const id = formatId(checkbox.dataset.productId);

      // Die 4. Spalte enthält die Produktbezeichnung
      const cells = row.querySelectorAll('td');
      if (cells.length >= 4) {
        const labelCell = cells[3]; // 0-indexed: 4. Spalte
        // Text nach "Bild  " extrahieren
        let fullText = labelCell.textContent.trim();
        // Entferne "URL  Bild  " am Anfang
        let text = fullText.replace(/^.*?Bild\s+/, '');
        if (text) {
          map.set(id, text);
        }
      }
    });

    labelMapCache = map;
    labelMapCacheTimestamp = now;

    return map;
  }

  function cutAtNthComma(text, n) {
    let count = 0;
    for (let i = 0; i < text.length; i++) {
      if (text[i] === ',') {
        count++;
        if (count === n) return text.substring(0, i).trim();
      }
    }
    return text;
  }

  // ---------- OPTIMIZED: Bezeichnung kopieren (Async mit verschiedenen Modi) ----------
  async function copyBezeichnungenOptimized(mode) {
    if (!mode) return;

    const selected = getSelectedIds();
    const all = getAllIds();
    const ids = selected.length > 0 ? selected : all;

    if (ids.length === 0) {
      alert('Keine Artikel vorhanden');
      return false;
    }

    // 1. Label-Map einmalig aufbauen
    const labelMap = buildLabelMap();

    // 2. Labels aus Map extrahieren und formatieren
    let list = ids.map(id => {
      const label = labelMap.get(id);
      if (!label) return null;

      let text = label;

      // Mode: vollständig mit ID
      if (mode === 'fullWithId') {
        return `[${id}] ${text}`;
      }

	  // Mode: ohne MPN
	  if (mode === 'noMPN') {
	    text = text.replace(/\s*\([^)]+\)$/, '');
	  }

      // Mode: bis zum 1./2./3. Komma
      if (mode === 'comma1' || mode === 'comma2' || mode === 'comma3') {
        const n = mode === 'comma1' ? 1 : mode === 'comma2' ? 2 : 3;
        text = cutAtNthComma(text, n);
      }

      // Mode: ohne Referenz-Tag
      if (mode === 'noRefTag') {
        text = text.replace(/^\[.*?\]\s*/, '');
      }

      return text;
    }).filter(Boolean); // null-Werte entfernen

    if (list.length === 0) {
      alert('Keine Bezeichnungen gefunden');
      return false;
    }

    // 3. In Clipboard kopieren
    try {
      await navigator.clipboard.writeText(list.join('\r\n'));
      return true;
    } catch (err) {
      console.error('Clipboard-Fehler:', err);
      alert('Fehler beim Kopieren in die Zwischenablage');
      return false;
    }
  }

  // ---------- Labels-Button mit Dropdown ----------
  let labelsBtnCreated = false;
  let labelsMainBtn = null;
  let labelsDropdown = null;

  function createLabelsButton() {
    if (labelsBtnCreated) return;
    const anchorBtn = $$('button.top_button').find(b => (b.textContent || '').includes('IDs kopieren'));
    if (!anchorBtn) return;

    // Prüfe ob es Produktzeilen gibt (mit mindestens 4 Spalten)
    const hasProductRows = $$('tr').some(row => {
      const cells = row.querySelectorAll('td');
      return cells.length >= 4 && row.querySelector('.product-checkbox');
    });
    if (!hasProductRows) return;

    const newBtn = document.createElement('button');
    newBtn.type = 'button';
    newBtn.className = 'top_button btn-labels';
    newBtn.textContent = 'Bezeichnungen kopieren';
    newBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleDropdown(newBtn, labelsDropdown);
    });

    anchorBtn.parentNode.insertBefore(newBtn, anchorBtn.nextSibling);
    labelsMainBtn = newBtn;

    const dd = document.createElement('div');
    dd.className = 'gh-dropdown';
    dd.innerHTML = `
      <div class="gh-dropdown__item" data-mode="fullWithId">Vollständig mit ID</div>
      <div class="gh-dropdown__item" data-mode="full">Vollständig</div>
      <div class="gh-dropdown__item" data-mode="noMPN">ohne MPN</div>
      <div class="gh-dropdown__item" data-mode="comma1">bis zum 1. Komma</div>
      <div class="gh-dropdown__item" data-mode="comma2">bis zum 2. Komma</div>
      <div class="gh-dropdown__item" data-mode="comma3">bis zum 3. Komma</div>
      <div class="gh-dropdown__item" data-mode="noRefTag">ohne Referenz-Tag [ ]</div>
    `;
    document.body.appendChild(dd);
    labelsDropdown = dd;

    dd.addEventListener('click', async (e) => {
      const item = e.target.closest('.gh-dropdown__item');
      if (!item) return;

      hideDropdown(labelsDropdown);

      const mode = item.dataset.mode;
      const success = await copyBezeichnungenOptimized(mode);

      if (success && labelsMainBtn) {
        flashSuccess(labelsMainBtn, '✓ Kopiert!');
      }
    });

    document.addEventListener('click', () => hideDropdown(labelsDropdown));

    labelsBtnCreated = true;
  }

  // ---------- IDs kopieren ----------
  function modifyClipboardButton() {
    const button = $$('button.top_button').find(b => (b.textContent || '').toLowerCase().includes('ids kopieren'));
    if (!button || button.dataset.modified === 'true') return;
    button.onclick = null;
    button.removeAttribute('onclick');
    button.dataset.modified = 'true';
    button.classList.add('btn-clipboard');
    button.addEventListener('click', function (e) {
      e.preventDefault();
      const selected = getSelectedIds();
      const all = getAllIds();
      const ids = selected.length > 0 ? selected : all;
      if (ids.length === 0) return alert('Keine Artikel vorhanden');
      navigator.clipboard.writeText(ids.join('\n'))
        .then(() => flashSuccess(button, '✓ Kopiert!'))
        .catch(() => alert('Fehler beim Kopieren in die Zwischenablage'));
    });
  }

  // ---------- Ersetzer ----------
  function modifyErsetzerButton() {
    const button = $$('button.top_button').find(b => (b.textContent || '').toLowerCase().includes('ersetzer'));
    if (!button || button.dataset.modified === 'true') return;
    button.onclick = null;
    button.removeAttribute('onclick');
    button.dataset.modified = 'true';
    button.classList.add('btn-ersetzer');
    button.addEventListener('click', function (e) {
      e.preventDefault();
      const selected = getSelectedIds();
      const all = getAllIds();
      const ids = selected.length > 0 ? selected : all;
      if (ids.length === 0) return alert('Keine Artikel vorhanden');
      window.open(createErsetzerUrl(ids), '_blank');
    });
  }

  // ---------- mass-image ----------
  let massImageBtnCreated = false;

  function createMassImageButton() {
    if (massImageBtnCreated) return;

    const ersetzerBtn = $$('button.top_button').find(b => (b.textContent || '').toLowerCase().includes('ersetzer'));
    if (!ersetzerBtn) return;

    const newBtn = document.createElement('button');
    newBtn.type = 'button';
    newBtn.className = 'top_button btn-mass-image';
    newBtn.textContent = 'mass-image';
    newBtn.addEventListener('click', function (e) {
      e.preventDefault();
      const selected = getSelectedIds();
      const all = getAllIds();
      const ids = selected.length > 0 ? selected : all;
      if (ids.length === 0) return alert('Keine Artikel vorhanden');
      window.open(createMassimgUrl(ids), '_blank');
      flashSuccess(newBtn, '✓');
    });

    ersetzerBtn.parentNode.insertBefore(newBtn, ersetzerBtn);
    massImageBtnCreated = true;
  }

  // ---------- such.pl ----------
  let suchPlBtnCreated = false;

  function createSuchPlButton() {
    if (suchPlBtnCreated) return;

    const ersetzerBtn = $$('button.top_button').find(b => (b.textContent || '').toLowerCase().includes('ersetzer'));
    if (!ersetzerBtn) return;

    const newBtn = document.createElement('button');
    newBtn.type = 'button';
    newBtn.className = 'top_button btn-suchpl';
    newBtn.textContent = 'such.pl';
    newBtn.addEventListener('click', function (e) {
      e.preventDefault();
      const selected = getSelectedIds();
      const all = getAllIds();
      const ids = selected.length > 0 ? selected : all;
      if (ids.length === 0) return alert('Keine Artikel vorhanden');
      window.open(createSuchPlUrl(ids), '_blank');
      flashSuccess(newBtn, '✓');
    });

    ersetzerBtn.parentNode.insertBefore(newBtn, ersetzerBtn);
    suchPlBtnCreated = true;
  }

  // ---------- Broken MR öffnen - mit Overlay ----------
  let brokenMrBtnCreated = false;
  let brokenMrMainBtn = null;
  let brokenMrOverlay = null;

  function getBrokenMRIds() {
    try {
      const elements = document.querySelectorAll('a.matchrule__test.err');
      console.log(`Found ${elements.length} broken MR elements`);

      const ids = [];
      elements.forEach((el, idx) => {
        // Versuche zuerst, die ID aus dem id-Attribut zu bekommen
        let id = el.id || el.getAttribute('id');

        // Fallback: Extrahiere ID aus dem href-Attribut
        if (!id) {
          const href = el.getAttribute('href') || el.href;
          const match = href ? href.match(/id=(\d+)/) : null;
          id = match ? match[1] : null;
        }

        if (id) {
          const formatted = formatId(id);
          if (/^\d+$/.test(formatted)) {
            ids.push(formatted);
            console.log(`  [${idx}] Extracted ID: ${formatted}`);
          }
        }
      });

      console.log(`Total broken MR IDs: ${ids.length}`, ids);
      return ids;
    } catch (err) {
      console.error('getBrokenMRIds error:', err);
      return [];
    }
  }

  function createBrokenMrButton() {
    if (brokenMrBtnCreated) return;

    const settingsIcon = document.querySelector('.gh-settings-icon');
    if (!settingsIcon) return;

    const ids = getBrokenMRIds();
    const count = ids.length;

    const newBtn = document.createElement('button');
    newBtn.type = 'button';
    newBtn.className = 'top_button btn-broken-mr';
    newBtn.textContent = `Broken MR anzeigen (${count})`;
    newBtn.dataset.broken_mr_count = count;

    newBtn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();

      try {
        const ids = getBrokenMRIds();
        console.log('Broken MR IDs found:', ids);

        if (ids.length === 0) {
          return;
        }

        showBrokenMrOverlay(ids);
        flashSuccess(newBtn, '✓');
      } catch (err) {
        console.error('Button click error:', err);
        alert('Fehler beim Öffnen des Overlays');
      }
    });

    settingsIcon.parentNode.insertBefore(newBtn, settingsIcon.nextSibling);
    brokenMrMainBtn = newBtn;
    brokenMrBtnCreated = true;
    updateBrokenMrButtonState();
  }

  function createBrokenMrOverlay() {
    if (brokenMrOverlay) return;

    const overlay = document.createElement('div');
    overlay.className = 'gh-broken-mr-overlay';
    overlay.id = 'gh-broken-mr-overlay';
    overlay.innerHTML = `
      <div class="gh-broken-mr-dialog">
        <div class="gh-broken-mr-header">
          <h2 class="gh-broken-mr-title">Broken MR öffnen</h2>
          <button class="gh-broken-mr-close" type="button">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="gh-broken-mr-count" id="gh-broken-mr-count"></div>
        <div class="gh-broken-mr-list" id="gh-broken-mr-list"></div>
      </div>
    `;

    document.body.appendChild(overlay);
    brokenMrOverlay = overlay;

    const closeBtn = overlay.querySelector('.gh-broken-mr-close');
    closeBtn.addEventListener('click', closeBrokenMrOverlay);

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeBrokenMrOverlay();
      }
    });
  }

  function showBrokenMrOverlay(ids) {
    if (!brokenMrOverlay) createBrokenMrOverlay();

    const list = brokenMrOverlay.querySelector('#gh-broken-mr-list');
    const countEl = brokenMrOverlay.querySelector('#gh-broken-mr-count');

    countEl.textContent = `${ids.length} Artikel gefunden`;

    list.innerHTML = '';
    ids.forEach((id, index) => {
      const url = `https://opus.geizhals.at/pv-edit/rulematcher.pl?id=${id}&rm=match`;
      const item = document.createElement('div');
      item.className = 'gh-broken-mr-item';
      item.innerHTML = `
        <a href="${url}" target="_blank" title="In neuem Tab öffnen (Strg+Click für mehrere)">
          ${index + 1}. Artikel ${id}
        </a>
      `;
      list.appendChild(item);
    });

    brokenMrOverlay.classList.add('active');
  }

  function closeBrokenMrOverlay() {
    if (brokenMrOverlay) {
      brokenMrOverlay.classList.remove('active');
    }
  }

  function updateBrokenMrButtonState() {
    if (!brokenMrMainBtn) return;
    try {
      const ids = getBrokenMRIds();
      const count = ids.length;
      brokenMrMainBtn.textContent = `Broken MR anzeigen (${count})`;
      if (count === 0) {
        brokenMrMainBtn.classList.add('is-disabled');
      } else {
        brokenMrMainBtn.classList.remove('is-disabled');
      }
    } catch (err) {
      console.error('updateBrokenMrButtonState error:', err);
    }
  }

  function modifyErstzuordnungButton() {
    const button = $$('button.top_button').find(b => (b.textContent || '').toLowerCase().includes('erstzuordnung'));
    if (!button || button.dataset.modified === 'true') return;

    const originalOnclick = button.onclick;
    const originalHref = button.getAttribute('onclick');

    button.onclick = null;
    button.removeAttribute('onclick');
    button.dataset.modified = 'true';

    button.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();

      const confirmed = confirm('Erstzuordnung testen ausführen?');
      if (confirmed) {
        if (originalOnclick) {
          originalOnclick.call(button);
        } else if (originalHref) {
          eval(originalHref);
        }
      }
    });
  }

  function createErsetzerUrl(ids) {
    return `https://opus.geizhals.at/kalif/artikel/ersetzer#${ids.join(',')}`;
  }

  function createMassimgUrl(ids) {
    const params = ids.map(id => `artikel=${id}`).join('&');
    return `https://opus.geizhals.at/kalif/artikel/mass-image?${params}`;
  }

  function createSuchPlUrl(ids) {
    const encoded = ids.join('%2C');
    return `https://opus.geizhals.at/pv-edit/such.pl?&syntax=a.id%3D${encoded}`;
  }

  // ---------- Parse Additional IDs ----------
  function parseAdditionalIds(text) {
    if (!text || text.trim().length === 0) return [];

    text = text.trim();
    let ids = [];

    // Format 1: Zeilenumbruch getrennt
    if (text.includes('\n') || text.includes('\r\n')) {
      ids = text.split(/[\r\n]+/).filter(line => line.trim().length > 0);
    }
    // Format 2: Komma getrennt
    else if (text.includes(',')) {
      ids = text.split(',').filter(id => id.trim().length > 0);
    }
    // Format 3: Leerzeichen getrennt
    else if (text.includes(' ')) {
      ids = text.split(/\s+/).filter(id => id.trim().length > 0);
    }
    // Format 4: Einzelne ID
    else {
      ids = [text];
    }

    // Bereinige und formatiere IDs
    return ids.map(id => formatId(id.trim())).filter(id => /^\d+$/.test(id));
  }

  // ---------- Vergleichen / Kalif ----------
  function createCompareUrl(ids) {
    const base = 'https://geizhals.de/?';
    const params = ids.map(id => `cmp=${id}`).join('&');
    return `${base}${params}&active=0`;
  }
  function createKalifUrl(ids) {
    const base = 'https://opus.geizhals.at/kalif/artikel/diff#';
    const params = ids.map(id => `id=${id}`).join('&');
    const primary = ids[0];
    return `${base}${params}&primary=${primary}`;
  }

  let compareBtnCreated = false;
  let compareDropdown = null;
  let compareMainBtn = null;
  let additionalPvInput = null;
  let additionalKalifInput = null;

  function createCompareButton() {
    if (compareBtnCreated) return;

    const pvBtn = $$('button.top_button').find(b => (b.textContent || '').toLowerCase().includes('vergleichen pv'));
    const kalifBtn = $$('button.top_button').find(b => (b.textContent || '').toLowerCase().includes('vergleichen kalif'));
    let anchor = pvBtn || kalifBtn || $$('button.top_button').find(b => (b.textContent || '').includes('IDs kopieren'));
    if (!anchor) return;

    if (pvBtn) pvBtn.style.display = 'none';
    if (kalifBtn) kalifBtn.style.display = 'none';

    const newBtn = document.createElement('button');
    newBtn.type = 'button';
    newBtn.className = 'top_button btn-compare';
    newBtn.textContent = 'Vergleichen';
    newBtn.addEventListener('click', (e) => { e.stopPropagation(); toggleDropdown(newBtn, compareDropdown); });

    anchor.parentNode.insertBefore(newBtn, anchor);

    const dd = document.createElement('div');
    dd.className = 'gh-dropdown';
    dd.innerHTML = `
      <div class="gh-dropdown__item" data-mode="pv">Vergleichen PV</div>
      <div class="gh-dropdown__item" data-mode="kalif">Vergleichen Kalif</div>
      <div class="gh-dropdown__item-with-input is-disabled" data-mode="pv-additional">
        <label class="gh-dropdown__item-label">Vergleichen PV mit zus. IDs:</label>
        <input type="text" class="gh-dropdown__item-input" id="gh-additional-pv-input" placeholder="IDs eingeben...">
      </div>
      <div class="gh-dropdown__item-with-input is-disabled" data-mode="kalif-additional">
        <label class="gh-dropdown__item-label">Vergleichen Kalif mit zus. IDs:</label>
        <input type="text" class="gh-dropdown__item-input" id="gh-additional-kalif-input" placeholder="IDs eingeben...">
      </div>
    `;
    document.body.appendChild(dd);

    additionalPvInput = dd.querySelector('#gh-additional-pv-input');
    additionalKalifInput = dd.querySelector('#gh-additional-kalif-input');

    // Event Listener für Input-Felder
    additionalPvInput.addEventListener('input', () => {
      const pvContainer = dd.querySelector('[data-mode="pv-additional"]');
      const hasIds = parseAdditionalIds(additionalPvInput.value).length > 0;

      if (hasIds) {
        pvContainer.classList.remove('is-disabled');
      } else {
        pvContainer.classList.add('is-disabled');
      }
    });

    additionalPvInput.addEventListener('click', (e) => e.stopPropagation());
    additionalPvInput.addEventListener('keydown', (e) => e.stopPropagation());

    additionalKalifInput.addEventListener('input', () => {
      const kalifContainer = dd.querySelector('[data-mode="kalif-additional"]');
      const hasIds = parseAdditionalIds(additionalKalifInput.value).length > 0;

      if (hasIds) {
        kalifContainer.classList.remove('is-disabled');
      } else {
        kalifContainer.classList.add('is-disabled');
      }
    });

    additionalKalifInput.addEventListener('click', (e) => e.stopPropagation());
    additionalKalifInput.addEventListener('keydown', (e) => e.stopPropagation());

    compareDropdown = dd;
    compareMainBtn = newBtn;

    dd.addEventListener('click', (e) => {
      // Ignoriere Klicks auf Input-Felder selbst
      if (e.target.closest('.gh-dropdown__item-input')) {
        e.stopPropagation();
        return;
      }

      // Suche nach sowohl .gh-dropdown__item als auch .gh-dropdown__item-with-input
      const item = e.target.closest('.gh-dropdown__item, .gh-dropdown__item-with-input');
      if (!item) return;

      const mode = item.dataset.mode;
      if (mode === 'pv-additional' || mode === 'kalif-additional') {
        // Nur wenn aktiv (nicht disabled) ausführen
        if (!item.classList.contains('is-disabled')) {
          runCompareWithAdditional(mode, newBtn);
        }
      } else {
        runCompare(mode, newBtn);
      }
    });

    document.addEventListener('click', (e) => {
      if (!dd.contains(e.target) && e.target !== newBtn) hideDropdown(dd);
    });

    compareBtnCreated = true;
    updateCompareButtonState();
  }

  function runCompare(mode, buttonForSuccess) {
    const selected = getSelectedIds();
    const all = getAllIds();

    if (mode === 'pv') {
      if (selected.length === 0) {
        if (all.length > MAX_ITEMS) return alert(`Es können maximal ${MAX_ITEMS} Artikel verglichen werden.`);
        window.open(createCompareUrl(all), '_blank');
      } else if (selected.length === 1) {
        return alert('Nur ein Artikel ausgewählt');
      } else {
        if (selected.length > MAX_ITEMS) return alert(`Es können maximal ${MAX_ITEMS} Artikel verglichen werden.`);
        window.open(createCompareUrl(selected), '_blank');
      }
    } else if (mode === 'kalif') {
      if (selected.length === 0) {
        if (all.length > MAX_ITEMS) return alert(`Es können maximal ${MAX_ITEMS} Artikel verglichen werden.`);
        window.open(createKalifUrl(all), '_blank');
      } else if (selected.length === 1) {
        return alert('Nur ein Artikel ausgewählt');
      } else {
        if (selected.length > MAX_ITEMS) return alert(`Es können maximal ${MAX_ITEMS} Artikel verglichen werden.`);
        window.open(createKalifUrl(selected), '_blank');
      }
    }
    hideDropdown(compareDropdown);
    if (buttonForSuccess) flashSuccess(buttonForSuccess, '✓');
  }

  function runCompareWithAdditional(mode, buttonForSuccess) {
    const isKalif = mode === 'kalif-additional';
    const inputField = isKalif ? additionalKalifInput : additionalPvInput;

    // Parse additional IDs
    const additionalIds = parseAdditionalIds(inputField.value);
    if (additionalIds.length === 0) {
      alert('Keine gültigen IDs eingegeben');
      return;
    }

    // Get selected or all IDs (wie bei bestehenden Funktionen)
    const selected = getSelectedIds();
    const all = getAllIds();
    const baseIds = selected.length > 0 ? selected : all;

    // Combine: base IDs + additional IDs (Duplikate entfernen)
    const combinedSet = new Set([...baseIds, ...additionalIds]);
    const combinedIds = Array.from(combinedSet);

    // Check limit
    if (combinedIds.length > MAX_ITEMS) {
      return alert(`Es können maximal ${MAX_ITEMS} Artikel verglichen werden.`);
    }

    // Open compare
    if (isKalif) {
      window.open(createKalifUrl(combinedIds), '_blank');
    } else {
      window.open(createCompareUrl(combinedIds), '_blank');
    }

    hideDropdown(compareDropdown);
    if (buttonForSuccess) flashSuccess(buttonForSuccess, '✓');
  }

  function updateCompareButtonState() {
    if (!compareMainBtn) return;

    const selected = getSelectedIds();
    const all = getAllIds();
    const relevantCount = selected.length > 0 ? selected.length : all.length;

    if (relevantCount > MAX_ITEMS) {
      compareMainBtn.classList.add('is-disabled');
    } else {
      compareMainBtn.classList.remove('is-disabled');
    }
  }

  function toggleDropdown(button, dd) {
    if (!dd) return;
    if (dd.style.display === 'block') {
      hideDropdown(dd);
    } else {
      const rect = button.getBoundingClientRect();
      dd.style.display = 'block';
      dd.style.top = (rect.bottom + window.scrollY) + 'px';
      dd.style.left = rect.left + 'px';
    }
  }

  function hideDropdown(dd) {
    if (dd) dd.style.display = 'none';
  }

  // ---------- Settings Overlay ----------
  let settingsOverlay = null;
  let settingsIcon = null;

  function createSettingsIcon() {
    const firstButton = document.querySelector('button.top_button');
    if (!firstButton || settingsIcon) return;

    // Erstelle Settings Icon
    settingsIcon = document.createElement('button');
    settingsIcon.type = 'button';
    settingsIcon.className = 'gh-settings-icon';
    settingsIcon.title = 'Einstellungen';
    settingsIcon.textContent = '⚙️';

    firstButton.parentNode.insertBefore(settingsIcon, firstButton);

    settingsIcon.addEventListener('click', (e) => {
      e.stopPropagation();
      openSettingsOverlay();
    });

    createSettingsOverlay();
  }

  function createSettingsOverlay() {
    if (settingsOverlay) return;

    const overlay = document.createElement('div');
    overlay.className = 'gh-settings-overlay';
    overlay.innerHTML = `
      <div class="gh-settings-dialog">
        <div class="gh-settings-header">
          <h2 class="gh-settings-title">Einstellungen</h2>
          <button class="gh-settings-close" type="button">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="gh-settings-content">
          <div class="gh-btn-visibility">
            <div class="gh-btn-visibility-title">Button-Sichtbarkeit</div>
            <div class="gh-btn-visibility-list" id="gh-btn-visibility-list">
              <!-- Will be populated by JavaScript -->
            </div>
          </div>
          <div class="gh-settings-item">
            <div class="gh-settings-item-left">
              <div class="gh-settings-item-text">
                <div class="gh-settings-item-label">Master Checkbox</div>
                <div class="gh-settings-item-description">Zeigt eine Master-Checkbox an</div>
              </div>
            </div>
            <label class="gh-toggle-switch">
              <input type="checkbox" id="gh-master-toggle" ${getMasterCheckboxEnabled() ? 'checked' : ''}>
              <span class="gh-toggle-slider"></span>
            </label>
          </div>
          <div class="gh-copy-icons-section">
            <div class="gh-copy-icons-title">Copy Icons</div>
            <div class="gh-copy-icons-list">
              <div class="gh-copy-icons-item">
                <div class="gh-copy-icons-item-text">
                  <div class="gh-copy-icons-item-label">
                    Bezeichnung
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" style="stroke: #374151; stroke-width: 2; fill: none; opacity: 0.5; margin-left: 4px; vertical-align: middle;">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                  </div>
                  <div class="gh-copy-icons-item-description">Kopier-Icons neben Artikelbezeichnungen</div>
                </div>
                <label class="gh-toggle-switch">
                  <input type="checkbox" id="gh-copy-toggle" ${getCopyIconsEnabled() ? 'checked' : ''}>
                  <span class="gh-toggle-slider"></span>
                </label>
              </div>
              <div class="gh-copy-icons-item">
                <div class="gh-copy-icons-item-text">
                  <div class="gh-copy-icons-item-label">
                    Bezeichnung (maskiert)
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" style="stroke: #2563eb; stroke-width: 2; fill: none; opacity: 0.5; margin-left: 4px; vertical-align: middle;">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                  </div>
                  <div class="gh-copy-icons-item-description">Sonderzeichen werden escaped</div>
                </div>
                <label class="gh-toggle-switch">
                  <input type="checkbox" id="gh-copy-masked-toggle" ${getCopyIconsMaskedEnabled() ? 'checked' : ''}>
                  <span class="gh-toggle-slider"></span>
                </label>
              </div>
              <div class="gh-copy-icons-item">
                <div class="gh-copy-icons-item-text">
                  <div class="gh-copy-icons-item-label">
                    Artikel-ID
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" style="stroke: #374151; stroke-width: 2; fill: none; opacity: 0.5; margin-left: 4px; vertical-align: middle;">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                  </div>
                  <div class="gh-copy-icons-item-description">Kopier-Icons in Artikel-ID Links [ID]</div>
                </div>
                <label class="gh-toggle-switch">
                  <input type="checkbox" id="gh-copy-article-id-toggle" ${getCopyIconsArticleIdEnabled() ? 'checked' : ''}>
                  <span class="gh-toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    settingsOverlay = overlay;

    // Populate Button Visibility List
    populateButtonVisibilityList();

    // Event Listeners
    const closeBtn = overlay.querySelector('.gh-settings-close');
    closeBtn.addEventListener('click', closeSettingsOverlay);

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeSettingsOverlay();
      }
    });

    // Master Checkbox Toggle
    const masterToggle = overlay.querySelector('#gh-master-toggle');
    masterToggle.addEventListener('change', () => {
      const enabled = masterToggle.checked;
      setMasterCheckboxEnabled(enabled);
      if (enabled) {
        setupMasterCheckbox();
      } else {
        removeMasterCheckbox();
      }
    });

    // Copy Icons Toggle
    const copyToggle = overlay.querySelector('#gh-copy-toggle');
    copyToggle.addEventListener('change', () => {
      const enabled = copyToggle.checked;
      setCopyIconsEnabled(enabled);
      updateCopyIcons();
    });

    // Copy Icons Masked Toggle
    const copyMaskedToggle = overlay.querySelector('#gh-copy-masked-toggle');
    copyMaskedToggle.addEventListener('change', () => {
      const enabled = copyMaskedToggle.checked;
      setCopyIconsMaskedEnabled(enabled);
      updateCopyIcons();
    });

    // Copy Icons Article ID Toggle
    const copyArticleIdToggle = overlay.querySelector('#gh-copy-article-id-toggle');
    copyArticleIdToggle.addEventListener('change', () => {
      const enabled = copyArticleIdToggle.checked;
      setCopyIconsArticleIdEnabled(enabled);
      updateArticleIdCopyIcons();
    });

    // Initial setup
    if (getMasterCheckboxEnabled()) {
      setupMasterCheckbox();
    }
    updateCopyIcons();
    updateArticleIdCopyIcons();
  }

  function populateButtonVisibilityList() {
    const list = $('#gh-btn-visibility-list');
    if (!list) return;

    const visibility = getButtonVisibility();

    list.innerHTML = '';
    Object.entries(BUTTON_CONFIGS).forEach(([key, config]) => {
      const isVisible = visibility[key] !== false;

      const item = document.createElement('div');
      item.className = 'gh-btn-visibility-item';
      item.innerHTML = `
        <span class="gh-btn-visibility-label">${config.label}</span>
        <div class="gh-btn-visibility-controls">
          <button type="button" class="gh-btn-visibility-icon ${isVisible ? 'disabled' : ''}" data-action="show" data-key="${key}">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
          <button type="button" class="gh-btn-visibility-icon ${!isVisible ? 'disabled' : ''}" data-action="hide" data-key="${key}">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
        </div>
      `;
      list.appendChild(item);
    });

    // Add event listeners
    list.querySelectorAll('.gh-btn-visibility-icon').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const button = e.currentTarget;
        if (button.classList.contains('disabled')) return;

        const action = button.dataset.action;
        const key = button.dataset.key;
        const shouldShow = action === 'show';

        setButtonVisibility(key, shouldShow);
        applyButtonVisibility();
        populateButtonVisibilityList();
      });
    });
  }

  function openSettingsOverlay() {
    if (settingsOverlay) {
      settingsOverlay.classList.add('active');
    }
  }

  function closeSettingsOverlay() {
    if (settingsOverlay) {
      settingsOverlay.classList.remove('active');
    }
  }

  // ---------- Master-Checkbox Funktionalität ----------
  let masterWrap = null;
  let masterCheckbox = null;

  function createMasterToggle() {
    // This function is now replaced by createSettingsIcon
    // Keeping for backwards compatibility but it does nothing
  }

  function setupMasterCheckbox() {
    const allCbs = $$('.product-checkbox');

    // Bei 0-1 Artikeln: nicht erstellen
    if (allCbs.length <= 1) {
      removeMasterCheckbox();
      return;
    }

    // Wenn schon vorhanden: neu platzieren + Status syncen
    if (masterWrap && masterCheckbox) {
      placeMasterBeforeTable();
      updateMasterCheckboxState();
      return;
    }

    // Neu erstellen - Default AUS, ohne Label-Text (nur Tooltip)
    masterWrap = document.createElement('div');
    masterWrap.className = 'gh-master-wrap';
    masterWrap.innerHTML = `
      <input type="checkbox" class="gh-master" id="gh-master" title="Alle auswählen">
    `;
    masterCheckbox = masterWrap.querySelector('#gh-master');
    masterCheckbox.checked = false;
    masterCheckbox.setAttribute('aria-label', 'Alle auswählen');

    masterCheckbox.addEventListener('change', () => {
      const all = $$('.product-checkbox');
      const shouldCheck = !!masterCheckbox.checked;
      all.forEach(cb => {
        if (cb.checked !== shouldCheck) {
          cb.checked = shouldCheck;
          cb.dispatchEvent(new Event('change', { bubbles: true }));
        }
      });
      masterCheckbox.indeterminate = false;
    });

    placeMasterBeforeTable();
    updateMasterCheckboxState();
  }

  function removeMasterCheckbox() {
    if (masterWrap?.parentNode) {
      masterWrap.parentNode.removeChild(masterWrap);
    }
    masterWrap = null;
    masterCheckbox = null;
  }

  // Vor die Ergebnistabelle einfügen
  function placeMasterBeforeTable() {
    const firstCb = $('.product-checkbox');
    if (!firstCb || !masterWrap) return;
    const table = firstCb.closest('table');
    if (table) {
      if (table.previousElementSibling === masterWrap) return;
      table.parentNode.insertBefore(masterWrap, table);
    } else {
      const anchor = firstCb.closest('label') || firstCb;
      if (masterWrap.nextElementSibling === anchor) return;
      anchor.parentNode.insertBefore(masterWrap, anchor);
    }
  }

  // Sync: indeterminate / auto-checked wenn alle an
  function updateMasterCheckboxState() {
    if (!masterCheckbox) return;
    const all = $$('.product-checkbox');
    const checked = $$('.product-checkbox:checked');

    if (all.length === 0) {
      masterCheckbox.checked = false;
      masterCheckbox.indeterminate = false;
      return;
    }
    if (checked.length === 0) {
      masterCheckbox.checked = false;
      masterCheckbox.indeterminate = false;
    } else if (checked.length === all.length) {
      masterCheckbox.checked = true;
      masterCheckbox.indeterminate = false;
    } else {
      masterCheckbox.checked = false;
      masterCheckbox.indeterminate = true;
    }
  }

  // ---------- Copy Icons Toggle ----------
  function getCopyIconsEnabled() {
    const stored = localStorage.getItem(COPY_ICONS_ENABLED_KEY);
    if (stored === null) return true; // Default: AN
    return stored === 'true';
  }

  function setCopyIconsEnabled(enabled) {
    localStorage.setItem(COPY_ICONS_ENABLED_KEY, enabled ? 'true' : 'false');
  }

  function getCopyIconsMaskedEnabled() {
    const stored = localStorage.getItem(COPY_ICONS_MASKED_ENABLED_KEY);
    if (stored === null) return false; // Default: AUS
    return stored === 'true';
  }

  function setCopyIconsMaskedEnabled(enabled) {
    localStorage.setItem(COPY_ICONS_MASKED_ENABLED_KEY, enabled ? 'true' : 'false');
  }

  function getCopyIconsArticleIdEnabled() {
    const stored = localStorage.getItem(COPY_ICONS_ARTICLE_ID_KEY);
    if (stored === null) return true; // Default: AN
    return stored === 'true';
  }

  function setCopyIconsArticleIdEnabled(enabled) {
    localStorage.setItem(COPY_ICONS_ARTICLE_ID_KEY, enabled ? 'true' : 'false');
  }

  function updateCopyIcons() {
    const enabled = getCopyIconsEnabled();
    const maskedEnabled = getCopyIconsMaskedEnabled();

    // Entferne alle bestehenden Icons (aber nicht die Article-ID Icons)
    $$('.gh-copy-icon').forEach(icon => icon.remove());

    if (!enabled && !maskedEnabled) return;

    // Alle Rows durchgehen und Icons bei den Produktlinks hinzufügen
    const rows = $$('tr');
    rows.forEach(row => {
      const checkbox = row.querySelector('.product-checkbox');
      if (!checkbox) return;

      const cells = row.querySelectorAll('td');
      if (cells.length < 4) return;

      const labelCell = cells[3]; // 4. Spalte (0-indexed)

      // Text extrahieren (gleiche Logik wie buildLabelMap)
      let fullText = labelCell.textContent.trim();
      let text = fullText.replace(/^.*?Bild\s+/, '');

      // Wende "ohne Referenz-Tag []" Regel an - entfernt eckige Klammern am ANFANG
      text = text.replace(/^\[.*?\]\s*/, '').trim();

      if (!text) return;

      // Normales Copy Icon
      if (enabled) {
        const copyBtn = document.createElement('button');
        copyBtn.className = 'gh-copy-icon';
        copyBtn.type = 'button';
        copyBtn.title = 'Bezeichnung kopieren';
        copyBtn.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
        `;

        copyBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();

          navigator.clipboard.writeText(text).then(() => {
            copyBtn.classList.add('copied');
            setTimeout(() => {
              copyBtn.classList.remove('copied');
            }, 1000);
          });
        });

        labelCell.appendChild(copyBtn);
      }

      // Maskiertes Copy Icon
      if (maskedEnabled) {
        let escapedText = text;
        escapedText = escapedText.replace(/\+/g, '\\+');
        escapedText = escapedText.replace(/\(/g, '\\(');
        escapedText = escapedText.replace(/\)/g, '\\)');
        escapedText = escapedText.replace(/\[/g, '\\[');
        escapedText = escapedText.replace(/\]/g, '\\]');
        escapedText = escapedText.replace(/\./g, '\\.');
        escapedText = escapedText.replace(/\//g, '\\/');

        const maskedBtn = document.createElement('button');
        maskedBtn.className = 'gh-copy-icon masked';
        maskedBtn.type = 'button';
        maskedBtn.title = 'Bezeichnung kopieren (maskiert)';
        maskedBtn.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
        `;

        maskedBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();

          navigator.clipboard.writeText(escapedText).then(() => {
            maskedBtn.classList.add('copied');
            setTimeout(() => {
              maskedBtn.classList.remove('copied');
            }, 1000);
          });
        });

        labelCell.appendChild(maskedBtn);
      }
    });
  }

  // ---------- Article ID Copy Icons ----------
  function updateArticleIdCopyIcons() {
    const enabled = getCopyIconsArticleIdEnabled();

    // Entferne alle bestehenden Article-ID Icons
    $$('.gh-copy-icon-article-id').forEach(icon => icon.remove());

    if (!enabled) return;

    // Finde alle Links die zur kalif/artikel Seite führen und nur Ziffern enthalten
    // Format im HTML: [<a href="...kalif/artikel?id=1481177">1481177</a>]
    const allLinks = $$('a');
    allLinks.forEach(link => {
      const href = link.getAttribute('href') || '';
      const text = link.textContent.trim();

      // Prüfe ob der Link zur kalif/artikel Seite führt
      if (!href.includes('kalif/artikel?id=')) return;

      // Prüfe ob der Link-Text nur aus Ziffern besteht
      if (!/^\d+$/.test(text)) return;

      // Prüfe ob nach dem Link schon ein Icon vorhanden ist
      if (link.nextElementSibling?.classList?.contains('gh-copy-icon-article-id')) return;

      // Prüfe ob nach dem Link eine schließende Klammer kommt
      const nextNode = link.nextSibling;
      if (!nextNode || nextNode.nodeType !== Node.TEXT_NODE) return;
      if (!nextNode.textContent.startsWith(']')) return;

      const articleId = text;

      // Erstelle einen Wrapper-Span für Icon + Klammer (verhindert Umbruch)
      const wrapper = document.createElement('span');
      wrapper.style.whiteSpace = 'nowrap';

      // Erstelle das Copy Icon
      const copyBtn = document.createElement('button');
      copyBtn.className = 'gh-copy-icon-article-id';
      copyBtn.type = 'button';
      copyBtn.title = 'Artikel-ID kopieren';
      copyBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
      `;

      copyBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        navigator.clipboard.writeText(articleId).then(() => {
          copyBtn.classList.add('copied');
          setTimeout(() => {
            copyBtn.classList.remove('copied');
          }, 1000);
        });
      });

      // Füge Icon in Wrapper ein
      wrapper.appendChild(copyBtn);

      // Extrahiere "]" aus dem Text-Node und füge es in den Wrapper
      wrapper.appendChild(document.createTextNode(']'));

      // Entferne die "]" aus dem ursprünglichen Text-Node
      nextNode.textContent = nextNode.textContent.substring(1);

      // Füge den Wrapper nach dem Link ein
      link.parentNode.insertBefore(wrapper, nextNode);
    });
  }

  // ---------- Regex Quick-Buttons ----------
  let regexButtonsCreated = false;

  function createRegexButtons() {
    if (regexButtonsCreated) return;

    const input = $('#extract_values_regex');
    if (!input) return;

    // Standard "Key: (.*)" Button
    const defaultBtn = document.createElement('button');
    defaultBtn.type = 'button';
    defaultBtn.className = 'gh-regex-btn';
    defaultBtn.textContent = 'Key: (.*)';
    defaultBtn.title = 'Standard-Regex einfügen';
    defaultBtn.addEventListener('click', (e) => {
      e.preventDefault();
      input.value = 'Key: (.*)';
      input.focus();
    });

    // Custom Button
    const customBtn = document.createElement('button');
    customBtn.type = 'button';
    customBtn.className = 'gh-regex-btn is-custom';
    const customRegex = getCustomRegex();
    customBtn.textContent = `Custom: ${customRegex}`;
    customBtn.title = 'Custom-Regex einfügen (Rechtsklick zum Bearbeiten)';

    customBtn.addEventListener('click', (e) => {
      e.preventDefault();
      input.value = getCustomRegex();
      updateExtractFieldDropdown();
      input.focus();
    });

    customBtn.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      showEditDialog(customBtn);
    });

    // Buttons nach dem Input einfügen
    input.parentNode.insertBefore(defaultBtn, input.nextSibling);
    input.parentNode.insertBefore(customBtn, defaultBtn.nextSibling);

    regexButtonsCreated = true;
  }

  // ---------- Edit Dialog für Custom Button ----------
  let editDialogCreated = false;
  let editDialog = null;
  let editOverlay = null;

  function createEditDialog() {
    if (editDialogCreated) return;

    const overlay = document.createElement('div');
    overlay.className = 'gh-edit-dialog-overlay';
    document.body.appendChild(overlay);

    const dialog = document.createElement('div');
    dialog.className = 'gh-edit-dialog';
    dialog.innerHTML = `
      <div class="gh-edit-dialog__title">Custom Regex bearbeiten</div>
      <input type="text" class="gh-edit-dialog__input" id="gh-edit-input" placeholder="Key: (.*)">
      <div class="gh-edit-dialog__radio-group">
        <div class="gh-edit-dialog__radio-label">Dropdown-Feld:</div>
        <div class="gh-edit-dialog__radio-option">
          <input type="radio" name="gh-extract-field" id="gh-radio-beschreibung" value="beschreibung" checked>
          <label for="gh-radio-beschreibung">Beschreibung</label>
        </div>
        <div class="gh-edit-dialog__radio-option">
          <input type="radio" name="gh-extract-field" id="gh-radio-comment" value="comment">
          <label for="gh-radio-comment">Hinweis</label>
        </div>
      </div>
      <div class="gh-edit-dialog__buttons">
        <button class="gh-edit-dialog__btn gh-edit-dialog__btn--secondary" id="gh-edit-cancel">Abbrechen</button>
        <button class="gh-edit-dialog__btn gh-edit-dialog__btn--primary" id="gh-edit-save">Speichern</button>
      </div>
    `;
    document.body.appendChild(dialog);

    editDialog = dialog;
    editOverlay = overlay;
    editDialogCreated = true;
  }

  function showEditDialog(customBtn) {
    if (!editDialog) createEditDialog();

    const input = editDialog.querySelector('#gh-edit-input');
    input.value = getCustomRegex();

    // Gespeicherten Wert für extract_field setzen
    const savedField = getExtractField();
    const radioBeschreibung = editDialog.querySelector('#gh-radio-beschreibung');
    const radioComment = editDialog.querySelector('#gh-radio-comment');

    if (savedField === 'comment') {
      radioComment.checked = true;
    } else {
      radioBeschreibung.checked = true;
    }

    editOverlay.style.display = 'block';
    editDialog.style.display = 'block';
    input.focus();
    input.select();

    const saveBtn = editDialog.querySelector('#gh-edit-save');
    const cancelBtn = editDialog.querySelector('#gh-edit-cancel');

    const closeDialog = () => {
      editOverlay.style.display = 'none';
      editDialog.style.display = 'none';
    };

    const saveHandler = () => {
      const newValue = input.value.trim();
      if (newValue) {
        setCustomRegex(newValue);
        customBtn.textContent = `Custom: ${newValue}`;
        customBtn.title = 'Custom-Regex einfügen (Rechtsklick zum Bearbeiten)';
      }

      // Speichere die Radiobutton-Auswahl
      const selectedRadio = editDialog.querySelector('input[name="gh-extract-field"]:checked');
      if (selectedRadio) {
        setExtractField(selectedRadio.value);
        updateExtractFieldDropdown();
      }

      closeDialog();
      saveBtn.removeEventListener('click', saveHandler);
      cancelBtn.removeEventListener('click', cancelHandler);
      editOverlay.removeEventListener('click', cancelHandler);
    };

    const cancelHandler = () => {
      closeDialog();
      saveBtn.removeEventListener('click', saveHandler);
      cancelBtn.removeEventListener('click', cancelHandler);
      editOverlay.removeEventListener('click', cancelHandler);
    };

    saveBtn.addEventListener('click', saveHandler);
    cancelBtn.addEventListener('click', cancelHandler);
    editOverlay.addEventListener('click', cancelHandler);

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        saveHandler();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        cancelHandler();
      }
    });
  }

  // ---------- Erfolgseffekt ----------
  function flashSuccess(button, okText = '✓') {
    const oldText = button.textContent;
    button.classList.add('is-success');
    if (!oldText.startsWith('  ')) button.style.paddingLeft = '30px';
    button.textContent = okText;
    setTimeout(() => {
      button.classList.remove('is-success');
      button.style.paddingLeft = '';
      button.textContent = oldText;
    }, 1000);
  }

  // ---------- Init ----------
  function initialize() {
    injectStyles();

    replaceRadiosWithCheckboxes();
    bindSelectionListeners();

    modifyClipboardButton();
    modifyErsetzerButton();
    modifyErstzuordnungButton();

    createMassImageButton();
    createSuchPlButton();
    createLabelsButton();

    createCompareButton();

    createRegexButtons();

    createSettingsIcon();
    createBrokenMrButton();

    applyButtonVisibility();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize);
  else initialize();

})();