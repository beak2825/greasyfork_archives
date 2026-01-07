// ==UserScript==
// @name         Fillr - Auto-fill Forms
// @namespace    https://fillr.app
// @version      4.0.0
// @description  Auto-fill job application forms instantly. Learns from your inputs, fills forms everywhere. Works on Google Forms, Greenhouse, Lever, Workday, and more.
// @author       Fillr
// @license      MIT
// @match        *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @run-at       document-idle
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/561685/Fillr%20-%20Auto-fill%20Forms.user.js
// @updateURL https://update.greasyfork.org/scripts/561685/Fillr%20-%20Auto-fill%20Forms.meta.js
// ==/UserScript==

(function() {
'use strict';

// ============================================================================
// CONFIGURATION - ENTER YOUR GROQ API KEY HERE
// ============================================================================

const CONFIG = {
  llm: {
    url: 'https://api.groq.com/openai/v1/chat/completions',
    key: GM_getValue('groqApiKey', ''), // Will be set via settings
    model: 'llama-3.1-8b-instant'
  },
  debug: false
};

function hasGroqKey() {
  return CONFIG.llm.key && CONFIG.llm.key.startsWith('gsk_');
}

// ============================================================================
// SETTINGS UI
// ============================================================================

function showSettingsDialog() {
  const existing = document.getElementById('fillr-settings-modal');
  if (existing) existing.remove();

  const isEnabled = GM_getValue('enabled', true);

  const modal = document.createElement('div');
  modal.id = 'fillr-settings-modal';
  modal.innerHTML = `
    <div class="fillr-modal-backdrop"></div>
    <div class="fillr-modal-content">
      <h2>Fillr Settings</h2>

      <div class="fillr-field">
        <label>Auto-fill</label>
        <div class="fillr-toggle-wrapper">
          <label class="fillr-toggle">
            <input type="checkbox" id="fillr-enabled-toggle" ${isEnabled ? 'checked' : ''}>
            <span class="fillr-toggle-slider"></span>
          </label>
          <span id="fillr-toggle-label">${isEnabled ? 'Enabled' : 'Disabled'}</span>
        </div>
      </div>

      <div class="fillr-field">
        <label>Groq API Key <span class="fillr-required">Required</span></label>
        <input type="password" id="fillr-groq-key" placeholder="gsk_xxxxxxxxxxxxx" value="${CONFIG.llm.key}">
        <p class="fillr-hint">Get your free API key from <a href="https://console.groq.com/keys" target="_blank">console.groq.com/keys</a></p>
      </div>

      <div class="fillr-actions">
        <button id="fillr-save-settings" class="fillr-btn-primary">Save Settings</button>
        <button id="fillr-cancel-settings" class="fillr-btn-secondary">Cancel</button>
      </div>

      <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e5e5;">

      <div class="fillr-field">
        <label>Manage Profile Data</label>
        <div style="display: flex; gap: 10px; margin-top: 8px;">
          <button id="fillr-view-profile" class="fillr-btn-secondary">View Profile</button>
          <button id="fillr-clear-profile" class="fillr-btn-danger">Clear All Data</button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  modal.querySelector('.fillr-modal-backdrop').onclick = () => modal.remove();
  modal.querySelector('#fillr-cancel-settings').onclick = () => modal.remove();

  // Toggle change handler
  modal.querySelector('#fillr-enabled-toggle').onchange = (e) => {
    const enabled = e.target.checked;
    GM_setValue('enabled', enabled);
    state.enabled = enabled;
    modal.querySelector('#fillr-toggle-label').textContent = enabled ? 'Enabled' : 'Disabled';
    showToast(enabled ? 'Fillr enabled' : 'Fillr disabled', 'success');
  };

  modal.querySelector('#fillr-save-settings').onclick = () => {
    const groqKey = modal.querySelector('#fillr-groq-key').value.trim();

    if (groqKey && !groqKey.startsWith('gsk_')) {
      showToast('Groq API key should start with "gsk_"', 'error');
      return;
    }

    GM_setValue('groqApiKey', groqKey);
    CONFIG.llm.key = groqKey;

    showToast('Settings saved!', 'success');
    modal.remove();
  };

  modal.querySelector('#fillr-view-profile').onclick = () => {
    const profile = GM_getValue('profile', {});
    const entries = Object.entries(profile);
    if (entries.length === 0) {
      showToast('No profile data saved yet', 'info');
      return;
    }
    let msg = 'Saved Profile:\n\n';
    entries.forEach(([k, v]) => { msg += `${k}: ${v}\n`; });
    alert(msg);
  };

  modal.querySelector('#fillr-clear-profile').onclick = () => {
    if (confirm('Delete all saved profile data? This cannot be undone.')) {
      GM_setValue('profile', {});
      GM_setValue('mappingCache', {});
      showToast('All data cleared!', 'success');
    }
  };
}

GM_addStyle(`
  #fillr-settings-modal { position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 999999; font-family: system-ui, -apple-system, sans-serif; }
  .fillr-modal-backdrop { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); }
  .fillr-modal-content { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 24px; border-radius: 12px; width: 400px; max-width: 90vw; box-shadow: 0 20px 60px rgba(0,0,0,0.3); }
  .fillr-modal-content h2 { margin: 0 0 20px 0; color: #5c4a32; font-size: 20px; }
  .fillr-field { margin-bottom: 16px; }
  .fillr-field label { display: block; font-size: 13px; color: #333; margin-bottom: 6px; font-weight: 500; }
  .fillr-required { background: #5c4a32; color: white; font-size: 10px; padding: 2px 6px; border-radius: 8px; margin-left: 6px; }
  .fillr-field input { width: 100%; padding: 10px 12px; border: 1px solid #d6d3d1; border-radius: 8px; font-size: 14px; box-sizing: border-box; }
  .fillr-field input:focus { outline: none; border-color: #5c4a32; }
  .fillr-hint { font-size: 12px; color: #666; margin-top: 4px; }
  .fillr-hint a { color: #5c4a32; }
  .fillr-actions { display: flex; gap: 10px; margin-top: 20px; }
  .fillr-btn-primary { background: #5c4a32; color: white; border: none; padding: 10px 20px; border-radius: 8px; font-size: 14px; cursor: pointer; }
  .fillr-btn-primary:hover { background: #44362a; }
  .fillr-btn-secondary { background: #e7e5e4; color: #57534e; border: none; padding: 10px 20px; border-radius: 8px; font-size: 14px; cursor: pointer; }
  .fillr-btn-secondary:hover { background: #d6d3d1; }
  .fillr-btn-danger { background: #dc2626; color: white; border: none; padding: 10px 20px; border-radius: 8px; font-size: 14px; cursor: pointer; }
  .fillr-btn-danger:hover { background: #b91c1c; }
  .fillr-toggle-wrapper { display: flex; align-items: center; gap: 12px; }
  .fillr-toggle { position: relative; display: inline-block; width: 50px; height: 26px; }
  .fillr-toggle input { opacity: 0; width: 0; height: 0; }
  .fillr-toggle-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .3s; border-radius: 26px; }
  .fillr-toggle-slider:before { position: absolute; content: ""; height: 20px; width: 20px; left: 3px; bottom: 3px; background-color: white; transition: .3s; border-radius: 50%; }
  .fillr-toggle input:checked + .fillr-toggle-slider { background-color: #5c4a32; }
  .fillr-toggle input:checked + .fillr-toggle-slider:before { transform: translateX(24px); }
  #fillr-toggle-label { font-size: 14px; color: #57534e; }
`);

GM_registerMenuCommand('Fillr Settings', showSettingsDialog);
GM_registerMenuCommand('Fill Form Now', () => autoFill());
GM_registerMenuCommand('Save Form Data', () => saveProfile());

// ============================================================================
// MAPPINGS
// ============================================================================

const COMMON_MAPPINGS = {
  'name': 'name', 'fullname': 'name', 'full name': 'name', 'yourname': 'name', 'your name': 'name',
  'candidatename': 'name', 'candidate name': 'name', 'applicantname': 'name',
  'firstname': 'first name', 'first name': 'first name', 'fname': 'first name', 'givenname': 'first name',
  'lastname': 'last name', 'last name': 'last name', 'lname': 'last name', 'surname': 'last name', 'familyname': 'last name',
  'email': 'email', 'emailaddress': 'email', 'email address': 'email', 'youremail': 'email', 'mail': 'email', 'e-mail': 'email',
  'phone': 'phone', 'phonenumber': 'phone', 'phone number': 'phone', 'mobile': 'phone', 'mobilenumber': 'phone',
  'cell': 'phone', 'cellphone': 'phone', 'telephone': 'phone', 'tel': 'phone', 'contact': 'phone', 'contactnumber': 'phone',
  'currentctc': 'current ctc', 'current ctc': 'current ctc', 'currentsalary': 'current ctc', 'current salary': 'current ctc',
  'expectedctc': 'expected ctc', 'expected ctc': 'expected ctc', 'expectedsalary': 'expected ctc', 'expected salary': 'expected ctc', 'desiredsalary': 'expected ctc',
  'noticeperiod': 'notice period', 'notice period': 'notice period',
  'experience': 'experience', 'totalexperience': 'experience', 'total experience': 'experience', 'yearsofexperience': 'experience', 'workexperience': 'experience',
  'currentcompany': 'current company', 'current company': 'current company', 'currentemployer': 'current company', 'company': 'current company', 'employer': 'current company',
  'currentrole': 'current role', 'current role': 'current role', 'currenttitle': 'current role', 'jobtitle': 'current role', 'job title': 'current role',
  'designation': 'current role', 'position': 'current role', 'role': 'current role', 'title': 'current role',
  'location': 'location', 'city': 'location', 'currentlocation': 'location', 'current location': 'location',
  'linkedin': 'linkedin', 'linkedinurl': 'linkedin', 'linkedin url': 'linkedin', 'linkedinprofile': 'linkedin',
  'portfolio': 'portfolio', 'portfoliourl': 'portfolio', 'website': 'portfolio', 'personalwebsite': 'portfolio',
  'github': 'github', 'githuburl': 'github', 'github url': 'github', 'githubprofile': 'github',
  'gender': 'gender', 'sex': 'gender',
  'address': 'address', 'streetaddress': 'address', 'street address': 'address',
  'skills': 'skills', 'keyskills': 'skills', 'key skills': 'skills', 'technicalskills': 'skills'
};

const HTML_ATTR_MAPPINGS = {
  'email': 'email', 'tel': 'phone', 'url': 'portfolio', 'name': 'name',
  'given-name': 'first name', 'family-name': 'last name', 'organization': 'current company',
  'organization-title': 'current role', 'street-address': 'address'
};

// ============================================================================
// STATE
// ============================================================================

const state = {
  enabled: GM_getValue('enabled', true),
  profile: GM_getValue('profile', {}),
  mappingCache: GM_getValue('mappingCache', {}),
  hasAutoFilled: false,
  isFilling: false,
  isSaving: false
};

const log = (...args) => CONFIG.debug && console.log('[Fillr]', ...args);
const sleep = ms => new Promise(r => setTimeout(r, ms));

function loadLocalData() {
  state.profile = GM_getValue('profile', {});
  state.mappingCache = GM_getValue('mappingCache', {});
}

function saveLocalData() {
  GM_setValue('profile', state.profile);
  GM_setValue('mappingCache', state.mappingCache);
}

// ============================================================================
// UTILITIES
// ============================================================================

function showToast(message, type = 'info') {
  const existing = document.getElementById('fillr-toast');
  if (existing) existing.remove();

  const colors = { info: '#5c4a32', success: '#16a34a', error: '#dc2626' };
  const toast = document.createElement('div');
  toast.id = 'fillr-toast';
  toast.textContent = message;
  toast.style.cssText = `position: fixed; top: 20px; right: 20px; background: ${colors[type]}; color: white; padding: 12px 20px; border-radius: 8px; font-family: system-ui, sans-serif; font-size: 14px; z-index: 999999; box-shadow: 0 4px 12px rgba(0,0,0,0.2);`;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2500);
}

function normalizeText(text) { return text ? text.replace(/\s+/g, ' ').replace(/[*:]/g, '').trim() : ''; }

function normalizeLabel(label) {
  return label.toLowerCase().replace(/^(your|my|the|candidate['']?s?|applicant['']?s?)\s+/i, '').replace(/\s+/g, '').replace(/[^a-z0-9]/g, '');
}

function levenshtein(a, b) {
  const matrix = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      matrix[i][j] = b[i-1] === a[j-1] ? matrix[i-1][j-1] : Math.min(matrix[i-1][j-1]+1, matrix[i][j-1]+1, matrix[i-1][j]+1);
    }
  }
  return matrix[b.length][a.length];
}

function similarity(a, b) { const m = Math.max(a.length, b.length); return m === 0 ? 1 : 1 - levenshtein(a, b) / m; }

function isVisible(el) {
  if (!el) return false;
  try {
    const s = getComputedStyle(el);
    if (s.display === 'none' || s.visibility === 'hidden' || s.opacity === '0') return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  } catch { return false; }
}

function isInteractable(el) {
  return el && isVisible(el) && !el.disabled && !el.readOnly && el.getAttribute('aria-disabled') !== 'true';
}

function triggerEvents(el, value) {
  el.focus();
  const proto = el.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : el.tagName === 'SELECT' ? HTMLSelectElement.prototype : HTMLInputElement.prototype;
  const desc = Object.getOwnPropertyDescriptor(proto, 'value');
  if (desc?.set) desc.set.call(el, value); else el.value = value;
  if (el._valueTracker) el._valueTracker.setValue('');
  ['input', 'change'].forEach(t => el.dispatchEvent(new Event(t, { bubbles: true })));
  el.dispatchEvent(new Event('blur', { bubbles: true }));
}

function querySelectorAllDeep(selector, root = document) {
  const elements = [];
  function traverse(node) {
    try { elements.push(...node.querySelectorAll(selector)); } catch {}
    if (node.shadowRoot) traverse(node.shadowRoot);
    try { node.querySelectorAll('*').forEach(el => { if (el.shadowRoot) traverse(el.shadowRoot); }); } catch {}
  }
  traverse(root);
  return elements;
}

function extractLabel(el, doc = document) {
  if (el.id) { try { const lbl = doc.querySelector(`label[for="${CSS.escape(el.id)}"]`); if (lbl) { const t = normalizeText(lbl.textContent); if (t && t.length > 1 && t.length < 150) return t; } } catch {} }
  const aria = el.getAttribute('aria-label'); if (aria) return normalizeText(aria);
  const wrap = el.closest('label');
  if (wrap) { const clone = wrap.cloneNode(true); clone.querySelectorAll('input,select,textarea,button').forEach(e => e.remove()); const t = normalizeText(clone.textContent); if (t && t.length > 1 && t.length < 150) return t; }
  let parent = el.parentElement;
  for (let i = 0; i < 6 && parent; i++) {
    const labelEl = parent.querySelector('label, [class*="label" i], [class*="title" i], [class*="question" i]');
    if (labelEl && !labelEl.contains(el) && labelEl !== el) { const t = normalizeText(labelEl.textContent); if (t && t.length > 1 && t.length < 150) return t; }
    parent = parent.parentElement;
  }
  const ph = el.getAttribute('placeholder'); if (ph && ph.length < 100) return normalizeText(ph);
  if (el.name) return el.name.replace(/[\[\]_-]/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2').trim();
  return null;
}

// ============================================================================
// FIELD DETECTION
// ============================================================================

function detectPlatform() {
  const h = location.hostname.toLowerCase(), u = location.href.toLowerCase();
  if (u.includes('docs.google.com/forms')) return 'google_forms';
  if (h.includes('greenhouse')) return 'greenhouse';
  if (h.includes('lever')) return 'lever';
  if (h.includes('workday')) return 'workday';
  return 'standard';
}

function getFieldType(el) {
  const tag = el.tagName?.toUpperCase(), type = (el.type || '').toLowerCase();
  if (tag === 'SELECT') return 'select';
  if (tag === 'TEXTAREA') return 'textarea';
  if (type === 'radio') return 'radio';
  if (type === 'checkbox') return 'checkbox';
  if (['email', 'tel', 'url', 'number'].includes(type)) return type;
  if (type === 'file') return 'file';
  if (el.getAttribute('contenteditable') === 'true') return 'contenteditable';
  return 'text';
}

function detectGoogleFormFields() {
  const fields = [];
  document.querySelectorAll('[role="listitem"]').forEach(container => {
    const headingEl = container.querySelector('[role="heading"]');
    const label = normalizeText(headingEl?.textContent);
    if (!label) return;
    let type = 'text', options = [], element = null;
    const radios = container.querySelectorAll('[role="radio"]');
    const checkboxes = container.querySelectorAll('[role="checkbox"]');
    const listbox = container.querySelector('[role="listbox"]');
    const textInput = container.querySelector('input[type="text"], input:not([type])');
    const textArea = container.querySelector('textarea');
    if (radios.length > 0) { type = 'google-radio'; element = container; radios.forEach(r => { const val = r.getAttribute('data-value') || normalizeText(r.textContent); if (val) options.push({ value: val, text: val, element: r }); }); }
    else if (checkboxes.length > 0) { type = 'google-checkbox'; element = container; checkboxes.forEach(c => { const val = c.getAttribute('data-value') || normalizeText(c.textContent); if (val) options.push({ value: val, text: val, element: c }); }); }
    else if (listbox) { type = 'google-dropdown'; element = listbox; }
    else if (textArea) { type = 'google-textarea'; element = textArea; }
    else if (textInput) { type = 'google-text'; element = textInput; }
    else return;
    fields.push({ element, container, label, type, options, platform: 'google_forms' });
  });
  return fields;
}

function detectFormFields() {
  const platform = detectPlatform();
  if (platform === 'google_forms') return detectGoogleFormFields();
  const fields = [], seen = new WeakSet();
  const selectors = ['input:not([type="hidden"]):not([type="submit"]):not([type="button"]):not([type="reset"]):not([type="file"])', 'textarea', 'select', '[contenteditable="true"]'];
  selectors.forEach(selector => {
    try {
      querySelectorAllDeep(selector).forEach(el => {
        if (seen.has(el) || !isInteractable(el)) return;
        const type = (el.type || '').toLowerCase();
        if (type === 'search' || type === 'hidden') return;
        const label = extractLabel(el);
        if (!label) return;
        seen.add(el);
        const fieldType = getFieldType(el);
        if (fieldType === 'file') return;
        const field = { element: el, label, type: fieldType, options: [], platform };
        if (fieldType === 'select') { Array.from(el.options || []).forEach(opt => { if (opt.value && !opt.disabled) field.options.push({ value: opt.value, text: normalizeText(opt.textContent) }); }); }
        else if (fieldType === 'radio' && el.name) { document.querySelectorAll(`input[type="radio"][name="${CSS.escape(el.name)}"]`).forEach(radio => { seen.add(radio); const optLabel = extractLabel(radio) || radio.value; if (optLabel) field.options.push({ value: radio.value, text: optLabel, element: radio }); }); }
        fields.push(field);
      });
    } catch {}
  });
  return fields;
}

// ============================================================================
// MATCHING
// ============================================================================

function matchField(field) {
  const formLabel = field.label, normalized = normalizeLabel(formLabel);
  const inputType = field.element.type?.toLowerCase(), autocomplete = field.element.getAttribute('autocomplete');
  if (inputType && HTML_ATTR_MAPPINGS[inputType] && state.profile[HTML_ATTR_MAPPINGS[inputType]]) return { canonical: HTML_ATTR_MAPPINGS[inputType], value: state.profile[HTML_ATTR_MAPPINGS[inputType]] };
  if (autocomplete && HTML_ATTR_MAPPINGS[autocomplete] && state.profile[HTML_ATTR_MAPPINGS[autocomplete]]) return { canonical: HTML_ATTR_MAPPINGS[autocomplete], value: state.profile[HTML_ATTR_MAPPINGS[autocomplete]] };
  const prebuilt = COMMON_MAPPINGS[normalized] || COMMON_MAPPINGS[formLabel.toLowerCase()];
  if (prebuilt && state.profile[prebuilt]) return { canonical: prebuilt, value: state.profile[prebuilt] };
  for (const key of Object.keys(state.profile)) { if (normalizeLabel(key) === normalized) return { canonical: key, value: state.profile[key] }; }
  for (const key of Object.keys(state.profile)) { if (similarity(normalized, normalizeLabel(key)) >= 0.85) return { canonical: key, value: state.profile[key] }; }
  if (state.mappingCache[normalized] && state.profile[state.mappingCache[normalized]]) return { canonical: state.mappingCache[normalized], value: state.profile[state.mappingCache[normalized]] };
  return null;
}

async function matchWithLLM(unmatchedFields, profileLabels) {
  if (!unmatchedFields.length || !profileLabels.length || !hasGroqKey()) return {};
  const formLabels = unmatchedFields.map(f => f.label);
  const prompt = `Match form labels to profile labels. Only match if same info.\nFORM: ${JSON.stringify(formLabels)}\nPROFILE: ${JSON.stringify(profileLabels)}\nReturn JSON: {"matches": {"<form>": "<profile_or_null>", ...}}`;
  try {
    const res = await fetch(CONFIG.llm.url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${CONFIG.llm.key}` },
      body: JSON.stringify({ model: CONFIG.llm.model, messages: [{ role: 'user', content: prompt }], temperature: 0, response_format: { type: 'json_object' } })
    });
    const data = await res.json();
    const result = JSON.parse(data.choices?.[0]?.message?.content || '{}');
    if (result.matches) { for (const [f, p] of Object.entries(result.matches)) { if (p) state.mappingCache[normalizeLabel(f)] = p; } saveLocalData(); }
    return result.matches || {};
  } catch { return {}; }
}

// ============================================================================
// FILL/SAVE
// ============================================================================

async function fillField(field, value) {
  if (!value) return false;
  const { element, type, options } = field;
  try {
    switch (type) {
      case 'text': case 'email': case 'tel': case 'url': case 'number': case 'textarea':
        element.focus(); await sleep(20); triggerEvents(element, value); return true;
      case 'select': { let m = options.find(o => o.text.toLowerCase() === value.toLowerCase()) || options.find(o => o.text.toLowerCase().includes(value.toLowerCase())); if (m) { element.value = m.value; element.dispatchEvent(new Event('change', { bubbles: true })); return true; } return false; }
      case 'radio': { let m = options.find(o => o.text.toLowerCase() === value.toLowerCase()) || options.find(o => o.text.toLowerCase().includes(value.toLowerCase())); if (m?.element) { m.element.checked = true; m.element.dispatchEvent(new Event('change', { bubbles: true })); return true; } return false; }
      case 'checkbox': element.checked = ['true', 'yes', '1'].includes(value.toLowerCase()); element.dispatchEvent(new Event('change', { bubbles: true })); return true;
      case 'contenteditable': element.focus(); element.textContent = value; element.dispatchEvent(new Event('input', { bubbles: true })); return true;
      case 'google-text': case 'google-textarea': element.focus(); await sleep(50); triggerEvents(element, value); return true;
      case 'google-radio': { let m = options.find(o => o.text.toLowerCase() === value.toLowerCase()) || options.find(o => o.text.toLowerCase().includes(value.toLowerCase())); if (m?.element) { m.element.click(); return true; } return false; }
      case 'google-checkbox': { const vals = value.split(',').map(v => v.trim().toLowerCase()); let clicked = false; options.forEach(o => { if (vals.some(v => o.text.toLowerCase().includes(v)) && o.element.getAttribute('aria-checked') !== 'true') { o.element.click(); clicked = true; } }); return clicked; }
      case 'google-dropdown': { element.click(); await sleep(300); for (const opt of document.querySelectorAll('[role="option"]')) { if (opt.textContent.toLowerCase().includes(value.toLowerCase())) { opt.click(); return true; } } return false; }
      default: if ('value' in element) { triggerEvents(element, value); return true; } return false;
    }
  } catch { return false; }
}

function extractValue(field) {
  const { element, type, options } = field;
  try {
    switch (type) {
      case 'select': return element.options[element.selectedIndex]?.textContent?.trim() || '';
      case 'radio': return options.find(o => o.element?.checked)?.text || '';
      case 'checkbox': return element.checked ? 'Yes' : '';
      case 'contenteditable': return element.textContent?.trim() || '';
      case 'google-text': case 'google-textarea': return element.value?.trim() || '';
      case 'google-radio': return options.find(o => o.element?.getAttribute('aria-checked') === 'true')?.text || '';
      case 'google-checkbox': return options.filter(o => o.element?.getAttribute('aria-checked') === 'true').map(o => o.text).join(', ');
      default: return element.value?.trim() || '';
    }
  } catch { return ''; }
}

async function autoFill() {
  if (state.isFilling) return;
  state.isFilling = true;
  try {
    loadLocalData();
    const fields = detectFormFields();
    if (!fields.length) { showToast('No form fields found', 'info'); return; }
    const profileLabels = Object.keys(state.profile);
    if (!profileLabels.length) { showToast('No profile data. Fill a form first!', 'info'); return; }
    const matched = [], unmatched = [];
    for (const field of fields) { const m = matchField(field); if (m) matched.push({ field, ...m }); else unmatched.push(field); }
    let filled = 0;
    for (const { field, value } of matched) { if (await fillField(field, value)) filled++; await sleep(50); }
    if (unmatched.length && profileLabels.length) {
      const llm = await matchWithLLM(unmatched, profileLabels);
      for (const field of unmatched) { const p = llm[field.label]; if (p && state.profile[p] && await fillField(field, state.profile[p])) filled++; await sleep(50); }
    }
    showToast(filled > 0 ? `Filled ${filled}/${fields.length} fields` : 'No fields matched', filled > 0 ? 'success' : 'info');
  } finally { state.isFilling = false; }
}

async function saveProfile() {
  if (state.isSaving) return;
  state.isSaving = true;
  try {
    loadLocalData();
    const fields = detectFormFields();
    const formData = fields.map(f => ({ label: f.label, value: extractValue(f), field: f })).filter(x => x.value);
    if (!formData.length) { showToast('No data to save', 'info'); return; }
    const profileLabels = Object.keys(state.profile);
    const toSave = [], unmatchedForLLM = [];
    for (const item of formData) { const m = matchField(item.field); if (m) toSave.push({ canonical: m.canonical, value: item.value }); else unmatchedForLLM.push(item); }
    if (unmatchedForLLM.length && profileLabels.length) {
      const llm = await matchWithLLM(unmatchedForLLM.map(u => u.field), profileLabels);
      for (const item of unmatchedForLLM) { const p = llm[item.label]; if (p && state.profile[p] !== undefined) toSave.push({ canonical: p, value: item.value }); else { const n = normalizeLabel(item.label); toSave.push({ canonical: COMMON_MAPPINGS[n] || COMMON_MAPPINGS[item.label.toLowerCase()] || item.label.toLowerCase().trim(), value: item.value }); } }
    } else { for (const item of unmatchedForLLM) { const n = normalizeLabel(item.label); toSave.push({ canonical: COMMON_MAPPINGS[n] || COMMON_MAPPINGS[item.label.toLowerCase()] || item.label.toLowerCase().trim(), value: item.value }); } }
    for (const { canonical, value } of toSave) state.profile[canonical] = value;
    saveLocalData();
    showToast(`Saved ${toSave.length} fields`, 'success');
  } finally { state.isSaving = false; }
}

// ============================================================================
// AUTO-SAVE ON BLUR
// ============================================================================

function getLabelForElement(el) {
  const label = extractLabel(el);
  if (label) return label;
  let parent = el.parentElement;
  for (let i = 0; i < 15 && parent; i++) { const h = parent.querySelector('[role="heading"]'); if (h) { const t = normalizeText(h.textContent); if (t && t.length > 1) return t; } parent = parent.parentElement; }
  return null;
}

function getFieldValue(el) {
  const tag = el.tagName?.toUpperCase(), type = (el.type || '').toLowerCase();
  if (tag === 'SELECT') return el.options[el.selectedIndex]?.textContent?.trim() || '';
  if (type === 'checkbox') return el.checked ? 'Yes' : '';
  if (type === 'radio') return el.checked ? (extractLabel(el) || el.value) : '';
  if (el.getAttribute('contenteditable')) return el.textContent?.trim() || '';
  return el.value?.trim() || '';
}

function saveFieldToLocal(label, value) {
  if (!label || !value) return;
  loadLocalData();
  const n = normalizeLabel(label);
  let canonical = COMMON_MAPPINGS[n] || COMMON_MAPPINGS[label.toLowerCase()];
  if (!canonical) { for (const k of Object.keys(state.profile)) { if (normalizeLabel(k) === n || similarity(n, normalizeLabel(k)) >= 0.85) { canonical = k; break; } } }
  if (!canonical && state.mappingCache[n]) canonical = state.mappingCache[n];
  if (!canonical) canonical = label.toLowerCase().trim();
  state.profile[canonical] = value;
  saveLocalData();
}

document.addEventListener('blur', e => { const el = e.target, label = getLabelForElement(el), value = getFieldValue(el); if (label && value) saveFieldToLocal(label, value); }, true);
document.addEventListener('change', e => { const el = e.target, label = getLabelForElement(el), value = getFieldValue(el); if (label && value) saveFieldToLocal(label, value); }, true);
document.addEventListener('click', e => {
  const radio = e.target.closest('[role="radio"], [role="checkbox"]');
  if (!radio) return;
  setTimeout(() => {
    if (radio.getAttribute('aria-checked') === 'true') {
      let parent = radio.parentElement;
      for (let i = 0; i < 15 && parent; i++) { const h = parent.querySelector('[role="heading"]'); if (h) { const label = normalizeText(h.textContent), value = radio.getAttribute('data-value') || normalizeText(radio.textContent); if (label && value) saveFieldToLocal(label, value); break; } parent = parent.parentElement; }
    }
  }, 50);
}, true);

// ============================================================================
// AUTO-FILL ON JOB SITES
// ============================================================================

async function autoFillOnLoad() {
  const h = location.hostname.toLowerCase(), u = location.href.toLowerCase();
  const isJobSite = u.includes('docs.google.com/forms') || h.includes('greenhouse') || h.includes('lever') || h.includes('workday') ||
    h.includes('smartrecruiters') || h.includes('ashby') || h.includes('icims') || h.includes('jobvite') ||
    u.includes('/careers') || u.includes('/jobs') || u.includes('/apply');
  if (!isJobSite || state.hasAutoFilled) return;
  for (let i = 0; i < 15; i++) { await sleep(1000); if (detectFormFields().length > 0) break; }
  loadLocalData();
  if (Object.keys(state.profile).length === 0) return;
  state.hasAutoFilled = true;
  await autoFill();
}

// ============================================================================
// INIT
// ============================================================================

log('Fillr loaded');
if (!hasGroqKey()) console.log('[Fillr] No Groq API key. Click Tampermonkey icon > Fillr Settings to add one.');
autoFillOnLoad();

})();
