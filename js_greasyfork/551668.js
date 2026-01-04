// ==UserScript==
// @name         BG Magic World - Fonts (Safe)
// @namespace    https://your.namespace
// @version      1.5.0
// @description  Stable custom + standard fonts dropdown (HTML <span style="..."> with justify), no mutation loops, no page freeze
// @match        https://*.forumotion.com/*
// @match        https://*.bg-magic-world.com/*
// @run-at       document-idle
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/551668/BG%20Magic%20World%20-%20Fonts%20%28Safe%29.user.js
// @updateURL https://update.greasyfork.org/scripts/551668/BG%20Magic%20World%20-%20Fonts%20%28Safe%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  if (window.__sc_fonts_custom_inited__) return;
  window.__sc_fonts_custom_inited__ = true;

  // ---------- CONFIG ----------
  // Стандартни шрифтове (горе) — всеки със собствен размер и justify
  const STANDARD_FONTS = [
    { label: 'Arial (15)',            css: 'font-family: Arial; font-size: 15px; text-align: justify' },
    { label: 'Georgia (16)',          css: 'font-family: Georgia; font-size: 16px; text-align: justify' },
    { label: 'Times New Roman (16)',  css: 'font-family: "Times New Roman"; font-size: 16px; text-align: justify' },
    { label: 'Verdana (14)',          css: 'font-family: Verdana; font-size: 14px; text-align: justify' },
    { label: 'Trebuchet MS (15)',     css: 'font-family: "Trebuchet MS"; font-size: 15px; text-align: justify' },
    { label: 'Courier New (15)',      css: 'font-family: "Courier New"; font-size: 15px; text-align: justify' },
    { label: 'Comic Sans MS (16)',    css: 'font-family: "Comic Sans MS"; font-size: 16px; text-align: justify' },
    { label: 'Arial Black (16)',      css: 'font-family: "Arial Black"; font-size: 16px; text-align: justify' },
    { label: 'Impact (17)',           css: 'font-family: Impact; font-size: 17px; text-align: justify' },
    { label: 'Serif (16)',            css: 'font-family: Serif; font-size: 16px; text-align: justify' },
    { label: 'Sans-serif (15)',       css: 'font-family: Sans-serif; font-size: 15px; text-align: justify' }
  ];

  // Къстъм шрифтове (долу)
  const CUSTOM_FONTS = [
    { label: 'Prata (15)',           css: 'font-family: Prata; font-size: 15px; text-align: justify' },
    { label: 'Philosopher (16)',     css: 'font-family: Philosopher; font-size: 16px; text-align: justify' },
    { label: 'Montserrat (14)',      css: 'font-family: Montserrat; font-size: 14px; text-align: justify' },
    { label: 'Oranienbaum (16)',     css: 'font-family: Oranienbaum; font-size: 16px; text-align: justify' },
    { label: 'Marck Script (16)',    css: 'font-family: "Marck Script"; font-size: 16px; text-align: justify' },
    { label: 'Lobster (18)',         css: 'font-family: Lobster; font-size: 18px; text-align: justify' },
    { label: 'Forum (18)',           css: 'font-family: Forum; font-size: 18px; text-align: justify' },
    { label: 'STIX Two Text (16)',   css: 'font-family: "STIX Two Text"; font-size: 16px; text-align: justify' },
    { label: 'Amatic SC (16)',       css: 'font-family: "Amatic SC"; font-size: 16px; text-align: justify' }
  ];

  const $ = window.jQuery || window.$;

  function waitFor(cond, { interval = 150, timeout = 15000 } = {}) {
    return new Promise((resolve, reject) => {
      const t0 = Date.now();
      (function tick() {
        try { if (cond()) return resolve(true); } catch {}
        if (Date.now() - t0 > timeout) return reject(new Error('Timeout'));
        setTimeout(tick, interval);
      })();
    });
  }

  function getEditorInstance() {
    try {
      if (!$ || !$.fn || !$.fn.sceditor) return null;
      const $candidates = $('#text_editor_textarea, textarea').filter(function () {
        try { return !!$(this).data('sceditor'); } catch { return false; }
      });
      if ($candidates.length) return $($candidates[0]).sceditor('instance');
    } catch {}
    return null;
  }

  // --- Cleaners (пазим ги, за да не се наслагва font-family)
  function stripFontBBCode(text) {
    return text.replace(/\[font=[^\]]+\]/gi, '').replace(/\[\/font\]/gi, '');
  }
  function stripFontFamilySpans(html) {
    html = html.replace(/<span([^>]*?)style="([^"]*?)"([^>]*)>([\s\S]*?)<\/span>/gi, (m, a1, style, a3, inner) => {
      if (!/font-family\s*:/i.test(style)) return m;
      const cleaned = style.replace(/font-family\s*:[^;"]*;?/ig, '').trim();
      return cleaned ? `<span${a1}style="${cleaned}"${a3}>${inner}</span>` : inner;
    });
    html = html.replace(/<font[^>]*face="[^"]*"[^>]*>([\s\S]*?)<\/font>/gi, '$1');
    return html;
  }

  function inSourceMode(editor) {
    try {
      if (typeof editor.inSourceMode === 'function') return !!editor.inSourceMode();
      if (typeof editor.sourceMode === 'function')   return editor.sourceMode() === true;
    } catch {}
    return false;
  }

  function applyFont(editor, cssText) {
    const isSource = inSourceMode(editor);
    const rh = editor.getRangeHelper && editor.getRangeHelper();

    if (isSource) {
      const selected = (rh && rh.selectedText && rh.selectedText()) || '';
      const cleaned = selected ? stripFontBBCode(selected) : '';
      editor.insert(cleaned
        ? `<span style="${cssText}">${cleaned}</span>`
        : `<span style="${cssText}"><p>ТЕКСТ</p></span>`
      );
    } else {
      const selectedHtml = (rh && rh.selectedHtml && rh.selectedHtml()) || '';
      const cleaned = selectedHtml ? stripFontFamilySpans(selectedHtml) : '';
      if (editor.insertHtml) {
        editor.insertHtml(cleaned
          ? `<span style="${cssText}">${cleaned}</span>`
          : `<span style="${cssText}"><p>ТЕКСТ</p></span>`
        );
      } else {
        editor.insert(`<span style="${cssText}">`, `</span>`);
      }
    }
    try { editor.focus(); } catch {}
  }

  // --- Styles (бутонът винаги да изглежда активен, без да се борим с class-ове)
  const EXTRA_CSS = `
    .sceditor-button-fontcustom div { background-position: 0 -432px; }
    .sceditor-button-fontcustom { opacity: 1 !important; pointer-events: auto !important; filter: none !important; }

    .cfonts-dd {
      position: absolute; display: none; z-index: 1000000;
      background: #fff; border: 1px solid #bbb; border-radius: 3px;
      box-shadow: 0 6px 18px rgba(0,0,0,.18); min-width: 260px; max-height: 480px; overflow: auto;
      font: inherit; color: inherit;
    }
    .cfonts-dd .cfont-title   { padding: 8px 10px; font-size: 11px; color: #666; text-transform: uppercase; letter-spacing: .04em; }
    .cfonts-dd .cfont-divider { margin: 6px 0; border-top: 1px solid #e5e5e5; }
    .cfonts-dd .cfont-grid    { display: grid; grid-template-columns: 1fr 1fr; gap: 0 8px; padding: 4px 6px 8px; }
    .cfonts-dd .cfont-item    { padding: 6px 10px; line-height: 1.4; cursor: pointer; white-space: nowrap; user-select: none; border-radius: 2px; }
    .cfonts-dd .cfont-item:hover { background: #f0f0f0; }
  `;
  const style = document.createElement('style');
  style.textContent = EXTRA_CSS;
  document.head.appendChild(style);

  function createButton(toolbar) {
    const group = document.createElement('div');
    group.className = 'sceditor-group';

    const btn = document.createElement('a');
    btn.className = 'sceditor-button sceditor-button-fontcustom';
    btn.setAttribute('data-sceditor-command', 'fontcustom');
    btn.setAttribute('title', 'Fonts');

    const inner = document.createElement('div');
    btn.appendChild(inner);
    group.appendChild(btn);

    // вкарай след нативния Font, ако го има
    const fontBtn = toolbar.querySelector('.sceditor-button-font');
    const refGroup = fontBtn ? fontBtn.closest('.sceditor-group') : null;
    toolbar.insertBefore(group, refGroup ? refGroup.nextSibling : toolbar.lastElementChild);

    return btn;
  }

  function buildDropdown(editor) {
    const dd = document.createElement('div');
    dd.className = 'cfonts-dd';

    // Standard
    const titleStd = document.createElement('div');
    titleStd.className = 'cfont-title';
    titleStd.textContent = 'Standard Fonts';

    const gridStd = document.createElement('div');
    gridStd.className = 'cfont-grid';

    STANDARD_FONTS.forEach(cfg => {
      const item = document.createElement('div');
      item.className = 'cfont-item';
      item.textContent = cfg.label;
      const fam = (cfg.css.match(/font-family\s*:\s*([^;]+)/i)||[])[1];
      const fsz = (cfg.css.match(/font-size\s*:\s*([^;]+)/i)||[])[1];
      if (fam) item.style.fontFamily = fam.trim();
      if (fsz) item.style.fontSize = fsz.trim();
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        applyFont(editor, cfg.css);
        hideDropdown(dd);
      });
      gridStd.appendChild(item);
    });

    // Divider
    const divider = document.createElement('div');
    divider.className = 'cfont-divider';

    // Custom
    const titleC = document.createElement('div');
    titleC.className = 'cfont-title';
    titleC.textContent = 'Custom Fonts';

    const gridC = document.createElement('div');
    gridC.className = 'cfont-grid';

    CUSTOM_FONTS.forEach(cfg => {
      const item = document.createElement('div');
      item.className = 'cfont-item';
      item.textContent = cfg.label;
      const fam = (cfg.css.match(/font-family\s*:\s*([^;]+)/i)||[])[1];
      const fsz = (cfg.css.match(/font-size\s*:\s*([^;]+)/i)||[])[1];
      if (fam) item.style.fontFamily = fam.trim();
      if (fsz) item.style.fontSize = fsz.trim();
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        applyFont(editor, cfg.css);
        hideDropdown(dd);
      });
      gridC.appendChild(item);
    });

    dd.append(titleStd, gridStd, divider, titleC, gridC);
    document.body.appendChild(dd);
    return dd;
  }

  function closeNativeDropdowns() {
    document.querySelectorAll('.sceditor-dropdown').forEach(el => el.style.display = 'none');
  }
  function showDropdown(dd, btn) {
    const r = btn.getBoundingClientRect();
    dd.style.left = Math.round(window.scrollX + r.left) + 'px';
    dd.style.top  = Math.round(window.scrollY + r.bottom) + 'px';
    dd.style.display = 'block';
  }
  function hideDropdown(dd) { dd.style.display = 'none'; }

  function wireGlobalClosers(dropdown, editor, button) {
    document.addEventListener('keydown', e => { if (e.key === 'Escape') hideDropdown(dropdown); }, true);
    const container = editor.getContainer && editor.getContainer();
    const iframeOrArea = container ? container.querySelector('.sceditor-container') : null;
    if (iframeOrArea) {
      iframeOrArea.addEventListener('mousedown', () => hideDropdown(dropdown), true);
      iframeOrArea.addEventListener('keydown', () => hideDropdown(dropdown), true);
    }
    document.addEventListener('mousedown', e => {
      if (dropdown.style.display !== 'block') return;
      if (!dropdown.contains(e.target) && !button.contains(e.target)) hideDropdown(dropdown);
    }, true);
  }

  async function init() {
    await waitFor(() => window.jQuery && $.fn && $.fn.sceditor);
    await waitFor(() => document.querySelector('.sceditor-toolbar'));

    const editor = getEditorInstance();
    if (!editor) return;

    // вземи toolbar-а от самата инстанция (по-стабилно при много редактори на страница)
    const container = editor.getContainer && editor.getContainer();
    const toolbar = container ? container.querySelector('.sceditor-toolbar')
                              : document.querySelector('.sceditor-toolbar');
    if (!toolbar) return;

    const customBtn = createButton(toolbar);
    const dropdown = buildDropdown(editor);

    wireGlobalClosers(dropdown, editor, customBtn);

    customBtn.addEventListener('click', (e) => {
      e.preventDefault(); e.stopPropagation();
      if (dropdown.style.display === 'block') hideDropdown(dropdown);
      else { closeNativeDropdowns(); showDropdown(dropdown, customBtn); }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => init().catch(console.warn));
  } else {
    init().catch(console.warn);
  }
})();