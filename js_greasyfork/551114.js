// ==UserScript==
// @name         autocomplete datentyp "sonstige"
// @namespace    https://greasyfork.org/de/users/1516523-martink
// @version      1.4.5
// @description  Autocomplete für Titel-Felder inkl. Firefox-Fixes (native Setter + composed Events)
// @author       Martin Kaiser
// @match        https://opus.geizhals.at/pv-edit/such.pl*
// @match        https://opus.geizhals.at/kalif/artikel/link*
// @match        https://opus.geizhals.at/kalif/artikel?id=*
// @match        https://opus.geizhals.at/kalif/artikel?clone_id=*
// @run-at       document-idle
// @grant        none
// @license      MIT
// @icon         https://666kb.com/i/fxfm86s1jawf7ztn7.jpg
// @downloadURL https://update.greasyfork.org/scripts/551114/autocomplete%20datentyp%20%22sonstige%22.user.js
// @updateURL https://update.greasyfork.org/scripts/551114/autocomplete%20datentyp%20%22sonstige%22.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // -------------------- Vorschläge --------------------
  const suggestions = [
    'Datenblatt (Serie)',
    'Datenblatt (Erweiterung)',
    'Datenblatt (Broschüre)',
    'Datenblatt (Erweiterung - Declaration of Conformity)',
    'Kurzanleitung',
    'Bedienungsanleitung (Erweiterung)',
    'Serviceanleitung',
    'Serviceanleitung (erweitert)',
    'Installationsanleitung',
    'Maßzeichnung',
    'Katalog',
    'Energielabel (Erweiterung)'
  ];

  // -------------------- Seitenerkennung --------------------
  const href = location.href;
  const isEdneuPage = href.includes('edneu.pl');
  const isSuchPage = href.includes('such.pl');
  const isKalifLinkPage = href.includes('/kalif/artikel/link');
  const isKalifArtikelPage = href.includes('/kalif/artikel?') && (href.includes('id=') || href.includes('clone_id='));
  const isFirefox = navigator.userAgent.toLowerCase().includes('firefox');

  // -------------------- FF/Framework-safe Value Setter --------------------
  function setInputValueAndNotify(input, value, { doBlurFocus = true } = {}) {
    if (!input) return;

    // 1) über nativen Setter setzen (wichtig für FF/controlled inputs)
    const proto = Object.getPrototypeOf(input);
    const desc = Object.getOwnPropertyDescriptor(proto, 'value');
    if (desc && typeof desc.set === 'function') {
      desc.set.call(input, value);
    } else {
      // Fallback (sollte selten nötig sein)
      input.value = value;
    }

    // Caret ans Ende (optional)
    try { input.setSelectionRange(value.length, value.length); } catch (_) {}

    // 2) Events feuern – **composed** damit sie Shadow DOM-Grenzen passieren
    const eventInit = { bubbles: true, composed: true };
    input.dispatchEvent(new InputEvent('input', eventInit));
    input.dispatchEvent(new Event('change', eventInit));
    // kurzer Keyup-Impuls, manche Listener hängen daran
    try { input.dispatchEvent(new KeyboardEvent('keyup', { key: 'Unidentified', bubbles: true, composed: true })); } catch (_) {}

    // 3) In Firefox hilft oft ein kurzer blur/focus, damit WebComponents state syncen
    if (isFirefox && doBlurFocus) {
      const active = document.activeElement;
      input.blur();
      // minimal verzögert erneut fokussieren
      setTimeout(() => {
        if (active === input || input.autofocus) input.focus({ preventScroll: true });
      }, 0);
    }
  }

  // -------------------- Manuelles Dropdown (FF, aber auch als Fallback okay) --------------------
  function addManualAutocomplete(inputField, _hostNode, doc) {
    if (!inputField || inputField.hasAttribute('data-manual-autocomplete-added')) return;

    let dropdown = doc.querySelector('[data-autocomplete-dropdown="true"]');
    if (!dropdown) {
      dropdown = doc.createElement('div');
      dropdown.setAttribute('data-autocomplete-dropdown', 'true');
      dropdown.style.cssText = `
        position: fixed !important;
        background: white !important;
        border: 2px solid #333 !important;
        max-height: 200px !important;
        min-height: 50px !important;
        overflow-y: auto !important;
        z-index: 999999 !important;
        display: none !important;
        box-shadow: 0 4px 12px rgba(0,0,0,0.5) !important;
        margin: 0 !important;
        padding: 0 !important;
      `;
      doc.body.appendChild(dropdown);
    }

    let selectedIndex = -1;
    let isSelecting = false;

    function updateDropdownPosition() {
      const rect = inputField.getBoundingClientRect();
      const scrollY = window.scrollY || window.pageYOffset;
      dropdown.style.setProperty('left', rect.left + 'px', 'important');
      dropdown.style.setProperty('top', rect.bottom + scrollY + 'px', 'important');
      dropdown.style.setProperty('width', rect.width + 'px', 'important');
    }

    function showSuggestions(value) {
      if (isSelecting) return;

      const filtered = value === ''
        ? suggestions
        : suggestions.filter(s => s.toLowerCase().includes(value.toLowerCase()));

      if (filtered.length === 0) {
        dropdown.style.setProperty('display', 'none', 'important');
        return;
      }

      dropdown.innerHTML = '';
      selectedIndex = -1;

      filtered.forEach(suggestion => {
        const item = doc.createElement('div');
        item.textContent = suggestion;
        item.style.cssText = `
          padding: 10px 12px !important;
          cursor: pointer !important;
          border-bottom: 1px solid #ddd !important;
          background-color: white !important;
          color: black !important;
          margin: 0 !important;
          display: block !important;
          font-size: 14px !important;
          line-height: 1.4 !important;
          font-family: Arial, sans-serif !important;
        `;
        item.addEventListener('mouseenter', () => item.style.setProperty('background-color', '#e3f2fd', 'important'));
        item.addEventListener('mouseleave', () => item.style.setProperty('background-color', 'white', 'important'));
        item.addEventListener('mousedown', (e) => {
          e.preventDefault();
          isSelecting = true;
          setInputValueAndNotify(inputField, suggestion);
          dropdown.style.setProperty('display', 'none', 'important');
          setTimeout(() => { isSelecting = false; }, 100);
        });
        dropdown.appendChild(item);
      });

      updateDropdownPosition();
      dropdown.style.setProperty('display', 'block', 'important');
    }

    ['input', 'keyup'].forEach(type => {
      inputField.addEventListener(type, (e) => showSuggestions(e.target.value), true);
    });

    let pollingInterval = null;
    let lastValue = inputField.value;

    inputField.addEventListener('focus', (e) => {
      showSuggestions(e.target.value);
      lastValue = inputField.value;
      pollingInterval = setInterval(() => {
        if (inputField.value !== lastValue) {
          lastValue = inputField.value;
          showSuggestions(inputField.value);
        }
      }, 100);
    }, true);

    inputField.addEventListener('blur', () => {
      if (pollingInterval) { clearInterval(pollingInterval); pollingInterval = null; }
      setTimeout(() => dropdown.style.setProperty('display', 'none', 'important'), 200);
    }, true);

    inputField.addEventListener('keydown', (e) => {
      const items = dropdown.querySelectorAll('div');
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (dropdown.style.display === 'none' || items.length === 0) {
          showSuggestions(inputField.value);
        } else if (selectedIndex < items.length - 1) {
          if (selectedIndex >= 0) items[selectedIndex].style.setProperty('background-color', 'white', 'important');
          selectedIndex++;
          items[selectedIndex].style.setProperty('background-color', '#e3f2fd', 'important');
          items[selectedIndex].scrollIntoView({ block: 'nearest' });
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (selectedIndex > 0) {
          items[selectedIndex].style.setProperty('background-color', 'white', 'important');
          selectedIndex--;
          items[selectedIndex].style.setProperty('background-color', '#e3f2fd', 'important');
          items[selectedIndex].scrollIntoView({ block: 'nearest' });
        }
      } else if (e.key === 'Enter') {
        if (selectedIndex >= 0 && items[selectedIndex]) {
          e.preventDefault();
          isSelecting = true;
          setInputValueAndNotify(inputField, items[selectedIndex].textContent);
          dropdown.style.setProperty('display', 'none', 'important');
          setTimeout(() => { isSelecting = false; }, 100);
        }
      } else if (e.key === 'Escape') {
        dropdown.style.setProperty('display', 'none', 'important');
      }
    }, true);

    const updateOnScroll = () => { if (dropdown.style.display !== 'none') updateDropdownPosition(); };
    window.addEventListener('scroll', updateOnScroll, true);
    window.addEventListener('resize', updateOnScroll);

    inputField.setAttribute('data-manual-autocomplete-added', 'true');
  }

  // -------------------- Datalist (Chromium) --------------------
  function addNativeAutocompleteShadow(inputField, shadowRoot, doc) {
    if (!inputField || inputField.hasAttribute('data-autocomplete-added')) return;
    const datalistId = 'title-suggestions-list';
    let datalist = shadowRoot.getElementById(datalistId);
    if (!datalist) {
      datalist = doc.createElement('datalist');
      datalist.id = datalistId;
      suggestions.forEach(s => {
        const o = doc.createElement('option');
        o.value = s; datalist.appendChild(o);
      });
      shadowRoot.appendChild(datalist);
    }
    inputField.setAttribute('list', datalistId);
    inputField.setAttribute('data-autocomplete-added', 'true');
  }

  function addNativeAutocompleteRegular(inputField, doc) {
    if (!inputField || inputField.hasAttribute('data-autocomplete-added')) return;
    const datalistId = (inputField.id || 'title') + '-suggestions-list';
    let datalist = doc.getElementById(datalistId);
    if (!datalist) {
      datalist = doc.createElement('datalist');
      datalist.id = datalistId;
      suggestions.forEach(s => {
        const o = doc.createElement('option');
        o.value = s; datalist.appendChild(o);
      });
      doc.body.appendChild(datalist);
    }
    inputField.setAttribute('list', datalistId);
    inputField.setAttribute('data-autocomplete-added', 'true');
  }

  // -------------------- Seiten-spezifisch --------------------
  function addAutocompleteToShadowDOM(doc = document) {
    const wc = doc.querySelector('artikel-link-form-webcomponent');
    if (!wc || !wc.shadowRoot) return false;
    const shadowRoot = wc.shadowRoot;
    const inputField = shadowRoot.getElementById('new_title');
    if (!inputField) return false;
    if (isFirefox) addManualAutocomplete(inputField, shadowRoot, doc);
    else addNativeAutocompleteShadow(inputField, shadowRoot, doc);
    return true;
  }

  function searchInFrames() {
    if (addAutocompleteToShadowDOM(document)) return true;
    try {
      const frames = window.frames;
      for (let i = 0; i < frames.length; i++) {
        try { if (addAutocompleteToShadowDOM(frames[i].document)) return true; } catch (_) {}
      }
    } catch (_) {}
    return false;
  }

  function addAutocompleteToKalif(doc = document) {
    const selector = 'input[id$="_title"][name="title"], input[type="text"][id$="_title"][name="title"]';
    const inputField = doc.querySelector(selector);
    if (!inputField) return false;
    if (isFirefox) addManualAutocomplete(inputField, doc, doc);
    else addNativeAutocompleteRegular(inputField, doc);
    return true;
  }

  function addAutocompleteToKalifArtikel(doc = document) {
    const selector = 'input#new_link_title[name="title"]';
    const inputField = doc.querySelector(selector);
    if (!inputField) return false;
    if (isFirefox) addManualAutocomplete(inputField, doc, doc);
    else addNativeAutocompleteRegular(inputField, doc);
    return true;
  }

  // -------------------- Init / Retry --------------------
  let attempts = 0;
  const maxAttempts = 30;
  const interval = setInterval(() => {
    attempts++;
    let ok = false;
    if (isEdneuPage) ok = addAutocompleteToShadowDOM();
    else if (isSuchPage) ok = searchInFrames();
    else if (isKalifLinkPage) ok = addAutocompleteToKalif();
    else if (isKalifArtikelPage) ok = addAutocompleteToKalifArtikel();
    if (ok || attempts >= maxAttempts) clearInterval(interval);
  }, 300);
})();