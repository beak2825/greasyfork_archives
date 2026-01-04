// ==UserScript==
// @name         Slack Select & Export (Qui/Quand/Sujet/Lien) v1.2
// @namespace    https://flatpay-group.slack.com/
// @version      1.4
// @description  Bouton "Sélectionner" + export XLSX avec colonnes Qui ? / Quand ? / Sujet / Lien Slack
// @match        https://app.slack.com/client/*
// @match        https://app.slack.com/client/T06TFEQQ0UV/C07TKFVAYUW
// @match        https://*.slack.com/client/*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/554749/Slack%20Select%20%20Export%20%28QuiQuandSujetLien%29%20v12.user.js
// @updateURL https://update.greasyfork.org/scripts/554749/Slack%20Select%20%20Export%20%28QuiQuandSujetLien%29%20v12.meta.js
// ==/UserScript==


(function () {
  'use strict';

  // ---------- Constantes ----------
  const SELECTED_CLASS = 'tm-selected';
  const BTN_ROW_CLASS = 'tm-button-row';
  const BTN_CLASS = 'tm-select-btn';
  const BAR_ID = 'tm-bottom-bar';
  const MSG_ITEM_SEL = '.c-virtual_list__item[role="listitem"][data-item-key], [data-qa="virtual-list-item"][data-item-key]';
  const EXPAND_BTN_SEL = 'button[data-qa="block_kit_text_truncation"], .c-message_attachment__text_expander';

  // ---------- État ----------
  const selectedIds = new Set();
  // id -> {qui, quand, sujet, lien, product}
  const selectedData = new Map();
  // id -> Promise (extraction asynchrone en cours)
  const pendingExtracts = new Map();

  // ---------- Styles ----------
  injectStyles(`
    .${BTN_ROW_CLASS} { margin-top: 8px; display: flex; gap: 8px; }
    .${BTN_CLASS} {
      cursor: pointer; padding: 6px 10px; font-size: 12px;
      border: 1px solid #2d7ff9; border-radius: 8px; background: #2d7ff9; color: white;
      transition: transform .05s ease, opacity .2s ease;
    }
    .${BTN_CLASS}:active { transform: translateY(1px); }
    .${BTN_CLASS}.secondary { background: transparent; color: #2d7ff9; }
    .${SELECTED_CLASS} { outline: 2px solid #2d7ff9 !important; background: rgba(45,127,249,0.08) !important; border-radius: 10px; }
    #${BAR_ID} {
      position: fixed; left: 50%; transform: translateX(-50%); bottom: 16px; z-index: 9999;
      display: none; gap: 12px; align-items: center; background: #111827ee; color: white;
      padding: 10px 14px; border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.2); font-size: 14px;
    }
    #${BAR_ID} .tm-count { font-weight: 600; margin-right: 6px; }
    #${BAR_ID} .tm-export { cursor: pointer; padding: 8px 12px; border-radius: 10px; border: 1px solid #22c55e; background: #22c55e; color: #06250d; font-weight: 600; }
    #${BAR_ID} .tm-clear  { cursor: pointer; padding: 6px 10px; border-radius: 10px; border: 1px solid #ffffff44; background: transparent; color: white; }
  `);

  // ---------- Barre du bas ----------
  const bottomBar = createBottomBar();
  document.body.appendChild(bottomBar);

  // ---------- Observer + rescans ----------
  let rescanScheduled = false;
  const scheduleRescan = () => {
    if (rescanScheduled) return;
    rescanScheduled = true;
    setTimeout(() => { rescanScheduled = false; scanAllMessages(); }, 150);
  };
  new MutationObserver(() => scheduleRescan()).observe(document.body, { childList: true, subtree: true });
  window.addEventListener('visibilitychange', () => { if (!document.hidden) scheduleRescan(); });
  scanAllMessages();

  // ---------- Parcours ----------
  function scanAllMessages() {
    document.querySelectorAll(MSG_ITEM_SEL).forEach(ensureAugmented);
  }

  function ensureAugmented(item) {
    const content = getContentContainer(item);
    if (!content) return;

    let row = content.querySelector(':scope > .' + BTN_ROW_CLASS);
    if (!row) {
      row = buildButtonRow(item);
      content.appendChild(row);
    }

    const id = getStableId(item);
    if (selectedIds.has(id)) {
      getMessageVisualNode(item).classList.add(SELECTED_CLASS);
      const btn = row.querySelector('.' + BTN_CLASS);
      btn.textContent = 'Déselectionner';
      btn.classList.add('secondary');
    }
  }

  function buildButtonRow(item) {
    const row = document.createElement('div');
    row.className = BTN_ROW_CLASS;

    const btn = document.createElement('button');
    btn.className = BTN_CLASS;
    btn.textContent = 'Sélectionner';
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleSelect(item, btn);
    });

    row.appendChild(btn);
    return row;
  }

  function toggleSelect(item, btn) {
    const id = getStableId(item);
    const nowSelected = !selectedIds.has(id);
    const msg = getMessageVisualNode(item);

    if (nowSelected) {
      selectedIds.add(id);
      msg.classList.add(SELECTED_CLASS);
      btn.textContent = 'Déselectionner';
      btn.classList.add('secondary');
      // Extraction asynchrone (avec expansion des "See more")
      const p = extractStructuredDataAsync(item)
        .then(data => {
          selectedData.set(id, data);
          pendingExtracts.delete(id);
        })
        .catch(err => {
          console.warn('Extraction failed for', id, err);
          pendingExtracts.delete(id);
        });
      pendingExtracts.set(id, p);
    } else {
      selectedIds.delete(id);
      selectedData.delete(id);
      pendingExtracts.delete(id);
      msg.classList.remove(SELECTED_CLASS);
      btn.textContent = 'Sélectionner';
      btn.classList.remove('secondary');
    }
    updateBar();
  }

  // ---------- Sélecteurs ----------
  function getContentContainer(item) {
    return (
      item.querySelector('[data-qa="message_content"]') ||
      item.querySelector('.c-message_kit__gutter__right') ||
      item.querySelector('.c-message__message_blocks') ||
      item.querySelector('.p-rich_text_block') ||
      null
    );
  }

  function getMessageVisualNode(item) {
    return item.querySelector('.c-message_kit__message, .c-message_kit__background') || item;
  }

  function getStableId(item) {
    const dik = item.getAttribute('data-item-key');
    if (dik) return dik;
    const domId = item.id;
    if (domId) return domId;
    const tsA = item.querySelector('a.c-timestamp');
    const ts = tsA?.getAttribute('data-ts');
    if (ts) return 'ts-' + ts;
    const gen = 'tm-' + Math.random().toString(36).slice(2);
    item.id = gen;
    return gen;
  }

  // ---------- Expansion + extraction ----------
  async function extractStructuredDataAsync(item) {
    // 1) Déplier tous les "See more" dans ce message
    await expandAllTruncatedInItem(item);

    // 2) Lire champs
    const tsA = item.querySelector('a.c-timestamp');
    const permalink = tsA?.href || '';
    const tsStr = tsA?.getAttribute('data-ts') || '';
    const when = formatDateFromTs(tsStr) || guessDateFromAria(tsA?.getAttribute('aria-label')) || new Date();

    // Parcours des blocs markdown/block kit
    const blocks = Array.from(item.querySelectorAll('.p-mrkdwn_element, [data-qa="bk_markdown_element"]'));
    let suggester = '';
    let suggestionEn = '';
    let originalText = '';
    let product = '';

    for (const el of blocks) {
      const txt = (el.innerText || '').trim();

      // Product: <valeur>
      if (/^\s*Product:/i.test(txt) && !product) {
        const m = txt.match(/Product:\s*([\s\S]*?)\s*$/i);
        if (m) product = (m[1] || '').trim();
      }

      // Suggester:
      if (/^\s*Suggester:/i.test(txt)) {
        const mention = el.querySelector('a.c-member_slug');
        if (mention) {
          const raw = (mention.getAttribute('data-member-label') || mention.textContent || '').trim();
          suggester = raw.replace(/^@/, '');
        } else {
          const m = txt.match(/Suggester:\s*@?(.+)\s*$/i);
          if (m) suggester = m[1].trim().replace(/^@/, '');
        }
      }

      // What is your suggestions? (+ éventuellement "Original Text:")
      if (txt.includes('What is your suggestions?')) {
        const m1 = txt.match(/What is your suggestions\?\s*([\s\S]*?)(?:\n|$)/i);
        if (m1) suggestionEn = (m1[1] || '').trim();
        const m2 = txt.match(/Original Text:\s*([\s\S]*)$/i);
        if (m2) originalText = (m2[1] || '').trim();
      }

      // "Original Text:" dans bloc séparé
      if (/^\s*Original Text:/i.test(txt) && !originalText) {
        const m = txt.match(/Original Text:\s*([\s\S]*)$/i);
        if (m) originalText = (m[1] || '').trim();
      }
    }

    const sujet = (originalText || suggestionEn || '').trim();
    const qui = suggester || extractAuthorFallback(item) || '';
    const quand = toFrDateString(when);
    const lien = permalink;
    const prod = (product || '').trim();

    return { qui, quand, sujet, lien, product: prod };
  }

  // Déplie “See more” pour un message donné
  async function expandAllTruncatedInItem(item) {
    const MAX_ROUNDS = 5;
    for (let round = 0; round < MAX_ROUNDS; round++) {
      const buttons = Array.from(item.querySelectorAll(EXPAND_BTN_SEL))
        .filter(btn => btn.getAttribute('aria-expanded') === 'false' || btn.getAttribute('aria-expanded') === null);
      if (buttons.length === 0) break;
      buttons.forEach(btn => { try { btn.click(); } catch {} });
      await nextAnimationFrame();
      await delay(50);
    }
  }

  function extractAuthorFallback(item) {
    const node = item.querySelector(
      '[data-qa="message_sender_name"], .c-message_kit__sender, .c-message__sender, a.c-member_slug, .c-message__sender_button'
    );
    if (!node) return '';
    const raw = (node.textContent || '').trim();
    return raw.replace(/^@/, '');
  }

  // ---------- Dates ----------
  function formatDateFromTs(tsStr) {
    if (!tsStr) return null;
    const sec = parseInt(String(tsStr).split('.')[0], 10);
    if (Number.isNaN(sec)) return null;
    return new Date(sec * 1000);
  }

  function guessDateFromAria(aria) {
    if (!aria) return null;
    if (/today/i.test(aria)) return new Date();
    return null;
  }

  function toFrDateString(d) {
    try {
      return d.toLocaleDateString('fr-FR', { timeZone: 'Europe/Paris' });
    } catch {
      return new Date(d).toLocaleDateString('fr-FR');
    }
  }

  // ---------- Barre du bas ----------
  function createBottomBar() {
    const bar = document.createElement('div');
    bar.id = BAR_ID;

    const count = document.createElement('span');
    count.className = 'tm-count';
    count.textContent = '0 sélectionné';

    const clearBtn = document.createElement('button');
    clearBtn.className = 'tm-clear';
    clearBtn.textContent = 'Tout désélectionner';
    clearBtn.addEventListener('click', clearAll);

    const exportBtn = document.createElement('button');
    exportBtn.className = 'tm-export';
    exportBtn.textContent = 'Exporter';
    exportBtn.addEventListener('click', doExport);

    bar.appendChild(count);
    bar.appendChild(clearBtn);
    bar.appendChild(exportBtn);
    return bar;
  }

  function updateBar() {
    const n = selectedIds.size;
    const bar = document.getElementById(BAR_ID);
    const label = bar.querySelector('.tm-count');
    label.textContent = n + (n <= 1 ? ' sélectionné' : ' sélectionnés');
    bar.style.display = n > 0 ? 'flex' : 'none';
  }

  function clearAll() {
    selectedIds.clear();
    selectedData.clear();
    pendingExtracts.clear();
    document.querySelectorAll('.' + SELECTED_CLASS).forEach(el => el.classList.remove(SELECTED_CLASS));
    document.querySelectorAll('.' + BTN_CLASS).forEach(b => { b.textContent = 'Sélectionner'; b.classList.remove('secondary'); });
    updateBar();
  }

  // ---------- Export ----------
  async function doExport() {
    if (selectedIds.size === 0) return;

    // Attendre la fin des extractions en cours
    const pending = Array.from(pendingExtracts.values());
    if (pending.length > 0) { try { await Promise.allSettled(pending); } catch {} }

    const rows = [
      ['Qui ?', 'Quand ?', 'Sujet', 'Lien Slack', 'Product'],
      ...Array.from(selectedIds).map(id => {
        const d = selectedData.get(id) || {};
        return [d.qui || '', d.quand || '', d.sujet || '', d.lien || '', d.product || ''];
      })
    ];

    const filename = `suggestions_${new Date().toISOString().replace(/[:.]/g,'-')}.xlsx`;

    if (typeof XLSX !== 'undefined' && XLSX?.utils?.aoa_to_sheet) {
      try {
        const ws = XLSX.utils.aoa_to_sheet(rows);
        // Largeurs colonnes (A-E)
        ws['!cols'] = [
          { wch: 25 }, // Qui ?
          { wch: 12 }, // Quand ?
          { wch: 80 }, // Sujet
          { wch: 70 }, // Lien Slack
          { wch: 18 }  // Product
        ];
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Export');
        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        triggerDownload(new Blob([wbout], { type: 'application/octet-stream' }), filename);
        return;
      } catch (e) {
        console.warn('XLSX export failed, fallback CSV.', e);
      }
    }

    // Fallback CSV (UTF-8 BOM)
    const csv = rows.map(r => r.map(v => `"${String(v ?? '').replace(/"/g,'""')}"`).join(',')).join('\r\n');
    const bom = '\uFEFF';
    triggerDownload(new Blob([bom + csv], { type: 'text/csv;charset=utf-8;' }), filename.replace(/\.xlsx$/, '.csv'));
  }

  // ---------- Utils ----------
  function triggerDownload(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  }

  function injectStyles(css) {
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  }

  function delay(ms) {
    return new Promise(res => setTimeout(res, ms));
  }

  function nextAnimationFrame() {
    return new Promise(res => requestAnimationFrame(() => res()));
  }
})();
