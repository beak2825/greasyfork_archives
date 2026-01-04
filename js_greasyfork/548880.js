// ==UserScript==
// @name         WME Permalink Layer Guard
// @namespace    https://github.com/majormarcin
// @version      0.2.0
// @description  Ostrzega przy kopiowaniu permalinku, gdy w panelu „Udostępnij lokalizację” zaznaczono „Uwzględnij ustawienia warstw”, i pozwala skopiować link bez warstw (usuwa parametr `s`).
// @author      TheMiskov (idea) / ChatGPT (kod)
// @include         https://*.waze.com/*/editor*
// @include         https://*.waze.com/editor*
// @include         https://*.waze.com/map-editor*
// @include         https://*.waze.com/beta_editor*
// @run-at       document-start
// @grant        none
// @icon            https://www.google.com/s2/favicons?sz=64&domain=waze.com
// @downloadURL https://update.greasyfork.org/scripts/548880/WME%20Permalink%20Layer%20Guard.user.js
// @updateURL https://update.greasyfork.org/scripts/548880/WME%20Permalink%20Layer%20Guard.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // --- TEKSTY UI ---
  const UI_TEXT = {
    title: 'Masz zaznaczone własne warstwy',
    body: 'W panelu „Udostępnij lokalizację” zaznaczono opcję „Uwzględnij ustawienia warstw”. Skopiować permalink bez warstw?',
    cancel: 'Anuluj',
    proceed: 'Skopiuj bez warstw',
  };

  // --- NARZĘDZIA ---
  const isPolish = true; // tylko podpowiedź dla ewentualnych selektorów tekstowych

  function isWMEPermalink(urlStr) {
    try {
      const u = new URL(urlStr);
      const hostOk = /(^|\.)waze\.com$/i.test(u.hostname.replace(/^www\./, ''));
      const pathOk = /\/editor(\/|$)/.test(u.pathname);
      return hostOk && pathOk;
    } catch (e) {
      return false;
    }
  }

  function hasLayerParam(urlStr) {
    try {
      const u = new URL(urlStr);
      return u.searchParams.has('s');
    } catch (e) {
      return /[?&]s=/.test(urlStr);
    }
  }

  function stripLayerParam(urlStr) {
    try {
      const u = new URL(urlStr);
      u.searchParams.delete('s');
      let out = u.toString();
      out = out.replace(/\?$/, '');
      return out;
    } catch (e) {
      return urlStr
        .replace(/([?&])s=[^&#]*&?/, '$1')
        .replace(/\?&/, '?')
        .replace(/\?$/, '');
    }
  }

  // --- MODAL ---
  function ensureStyles() {
    if (document.getElementById('wme-pl-layer-guard-style')) return;
    const style = document.createElement('style');
    style.id = 'wme-pl-layer-guard-style';
    style.textContent = `
      .wmePLG-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,.35); display: flex; align-items: center; justify-content: center; z-index: 100000; }
      .wmePLG-modal { background: #fff; color: #111; border-radius: 14px; width: min(520px, 92vw); box-shadow: 0 10px 30px rgba(0,0,0,.25); overflow: hidden; font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; }
      .wmePLG-header { padding: 14px 18px; font-weight: 700; font-size: 17px; background: #f3f4f6; border-bottom: 1px solid #e5e7eb; }
      .wmePLG-body { padding: 16px 18px; font-size: 14px; line-height: 1.4; }
      .wmePLG-actions { display: flex; gap: 10px; padding: 12px 18px 18px; justify-content: flex-end; }
      .wmePLG-btn { border: 0; border-radius: 10px; padding: 10px 14px; font-size: 14px; cursor: pointer; }
      .wmePLG-cancel { background: #eef2ff; color: #1f2937; }
      .wmePLG-proceed { background: linear-gradient(135deg, #22d3ee, #a78bfa, #f472b6); color: #fff; font-weight: 700; }
    `;
    document.documentElement.appendChild(style);
  }

  function askUser() {
    return new Promise((resolve, reject) => {
      ensureStyles();
      const backdrop = document.createElement('div');
      backdrop.className = 'wmePLG-backdrop';
      const modal = document.createElement('div');
      modal.className = 'wmePLG-modal';
      modal.innerHTML = `
        <div class="wmePLG-header">${UI_TEXT.title}</div>
        <div class="wmePLG-body">${UI_TEXT.body}</div>
        <div class="wmePLG-actions">
          <button class="wmePLG-btn wmePLG-cancel">${UI_TEXT.cancel}</button>
          <button class="wmePLG-btn wmePLG-proceed">${UI_TEXT.proceed}</button>
        </div>`;
      backdrop.appendChild(modal);
      document.body.appendChild(backdrop);

      function cleanup() { backdrop.remove(); }

      modal.querySelector('.wmePLG-cancel').addEventListener('click', () => { cleanup(); reject(new Error('User cancelled')); });
      modal.querySelector('.wmePLG-proceed').addEventListener('click', () => { cleanup(); resolve(true); });
      backdrop.addEventListener('click', (e) => { if (e.target === backdrop) { cleanup(); reject(new Error('User cancelled')); } });
    });
  }

  // --- WYSZUKIWANIE PANELU „UDOSTĘPNIJ LOKALIZACJĘ” ---
  function findSharePanel(root = document) {
    // Szukamy kontenera zawierającego tekst checkboxa
    const marker = Array.from(root.querySelectorAll('label, div, span, p'))
      .find(el => /Uwzględnij ustawienia warstw/i.test(el.textContent || ''));
    if (!marker) return null;
    // panel = najbliższy dialog/panel
    let panel = marker.closest('[role="dialog"], [data-testid*="dialog"], .modal, .mat-dialog-container, .mdc-dialog, .waze-dialog, .share-dialog');
    if (!panel) panel = marker.closest('div');
    return panel || null;
  }

  function getPanelParts(panel) {
    if (!panel) return {};
    // Checkbox
    const checkbox = panel.querySelector('input[type="checkbox"]');
    // Pole permalinku (input/textarea) — wybieramy pierwsze w panelu z wartością zaczynającą się od https
    let linkInput = Array.from(panel.querySelectorAll('input[type="text"], input[type="url"], textarea'))
      .find(el => /^https?:\/\//.test(el.value || '')) || null;
    // Przycisk(i) kopiowania w panelu
    const copyBtns = Array.from(panel.querySelectorAll('button, a, div[role="button"]')).filter(el => {
      const t = (el.innerText || el.getAttribute('aria-label') || el.title || '').toLowerCase();
      return /(copy|kopiuj)/.test(t) || /fa-copy|icon-copy|copy/i.test(el.className || '');
    });
    return { checkbox, linkInput, copyBtns };
  }

  async function handleShareCopy(panel, evTarget) {
    const { checkbox, linkInput } = getPanelParts(panel);
    // jeśli nie znaleziono checkboxa lub inputu, lecimy starym trybem przez schowek
    let url = linkInput?.value;
    let checkboxChecked = !!checkbox?.checked;

    // Jeżeli link jeszcze nie jest w polu (czasem WME wypełnia po kliknięciu), daj mu ułamek sekundy
    if (!url) {
      await new Promise(r => setTimeout(r, 50));
      if (linkInput) url = linkInput.value;
    }

    // Jeżeli checkbox zaznaczony i/lub w linku jest `s=`, pytamy użytkownika
    const suspect = checkboxChecked || (typeof url === 'string' && hasLayerParam(url));

    if (suspect) {
      // blokujemy domyślne kopiowanie WME
      if (evTarget) {
        try { evTarget.preventDefault?.(); evTarget.stopPropagation?.(); evTarget.stopImmediatePropagation?.(); } catch {}
      }
      try {
        await askUser();
        // Mamy akcept — budujemy końcowy link
        let finalUrl = url;
        if (!finalUrl) {
          // fallback: odczyt ze schowka (jeśli kliknięcie zdążyło skopiować)
          try { finalUrl = await navigator.clipboard.readText(); } catch {}
        }
        if (finalUrl && isWMEPermalink(finalUrl)) {
          finalUrl = stripLayerParam(finalUrl);
          await navigator.clipboard.writeText(finalUrl);
        }
        return true; // obsłużone
      } catch (e) {
        // Anulowano — nie kopiujemy nic
        return true; // też traktujemy jako obsłużone, żeby WME nie robił nic dalej
      }
    }
    return false; // nie ingerujemy
  }

  // --- GŁÓWNY OBSERWATOR UI ---
  function hookSharePanel() {
    const seen = new WeakSet();
    const observe = new MutationObserver(() => {
      const panel = findSharePanel(document);
      if (!panel || seen.has(panel)) return;
      seen.add(panel);

      const { copyBtns } = getPanelParts(panel);
      copyBtns.forEach(btn => {
        if (btn._wmePLG_hooked) return;
        btn._wmePLG_hooked = true;
        btn.addEventListener('click', async (ev) => {
          const handled = await handleShareCopy(panel, ev);
          if (handled) return; // zrobiliśmy swoje
        }, true);
      });
    });
    observe.observe(document.documentElement, { childList: true, subtree: true });
  }

  // --- DODATKOWE BEZPIECZNIKI (poza panelem) ---
  function wrapClipboardWriteText() {
    if (!navigator.clipboard || !navigator.clipboard.writeText) return;
    const orig = navigator.clipboard.writeText.bind(navigator.clipboard);
    navigator.clipboard.writeText = async function (text) {
      try {
        if (typeof text === 'string' && isWMEPermalink(text) && hasLayerParam(text)) {
          await askUser();
          const cleaned = stripLayerParam(text);
          return orig(cleaned);
        }
      } catch {}
      return orig(text);
    };
  }

  function interceptCopyEvent() {
    document.addEventListener('copy', async function (e) {
      try {
        const sel = document.getSelection();
        const clipText = e.clipboardData?.getData('text/plain') || sel?.toString() || '';
        if (clipText && isWMEPermalink(clipText) && hasLayerParam(clipText)) {
          e.preventDefault();
          try {
            await askUser();
            const cleaned = stripLayerParam(clipText);
            e.clipboardData.setData('text/plain', cleaned);
          } catch {}
        }
      } catch {}
    }, true);
  }

  function init() {
    hookSharePanel();
    wrapClipboardWriteText();
    interceptCopyEvent();
    console.log('[WME PL Guard] aktywny');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
