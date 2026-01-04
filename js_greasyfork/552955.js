// ==UserScript==
// @name        Export Site Term Replacements WTRLAB
// @namespace   Violentmonkey Scripts
// @match       https://wtr-lab.com/en/novel/*
// @grant       none
// @version     1.0
// @author      -
// @description 10/17/2025, 2:03:00 PM
// @downloadURL https://update.greasyfork.org/scripts/552955/Export%20Site%20Term%20Replacements%20WTRLAB.user.js
// @updateURL https://update.greasyfork.org/scripts/552955/Export%20Site%20Term%20Replacements%20WTRLAB.meta.js
// ==/UserScript==
(function() {
  // --- Add click listener to the Edit Terms button ---
  document.addEventListener('click', e => {
    const btn = e.target.closest('.term-edit-btn');
    if (!btn) return;

    // Wait for modal to render, then insert button
    setTimeout(tryAddExportButton, 400);
  });

  // --- Function to insert export button if modal exists ---
  function tryAddExportButton() {
    const toolbar = document.querySelector('.d-flex.justify-content-end.mb-2');
    if (!toolbar || toolbar.querySelector('.export-global-btn')) return;

    const exportBtn = document.createElement('button');
    exportBtn.textContent = 'Export All as Global';
    exportBtn.className = 'me-2 btn btn-outline-primary btn-sm export-global-btn';
    exportBtn.addEventListener('click', exportTermsAsGlobal);
    toolbar.prepend(exportBtn);
    console.log('[ExportAll] Added Export button to modal toolbar');
  }

  // --- Export Logic ---
  function exportTermsAsGlobal() {
    const rows = document.querySelectorAll('tbody.terms-table td[style*="max-width"]');
    if (!rows.length) {
      alert('No terms found.');
      return;
    }

    const data = {};
    const seriesKey = 'globalTerms';
    const currentFlags = {
      ignoreCapital: false,
      startOfSentence: false,
      allInstances: false,
      preserveFirstCapital: false,
      noTrailingSpace: false,
      insideDialogueOnly: false,
      outsideDialogueOnly: false
    };

    data[seriesKey] = [];

    rows.forEach(td => {
      const fromSpan = td.querySelector('div > span.table-label');
      const toSpan = td.querySelector('div.mt-2 > span.table-label');
      if (!fromSpan || !toSpan) return;

      const fromText = fromSpan.textContent.trim();
      const toText = toSpan.textContent.trim();
      if (!fromText) return;

      const variants = fromText.split('|').map(f => f.trim()).filter(Boolean);
      for (const f of variants) {
        data[seriesKey].push({
          from: f,
          to: toText,
          enabled: true,
          ignoreCapital: currentFlags.ignoreCapital,
          startOfSentence: currentFlags.startOfSentence,
          allInstances: currentFlags.allInstances,
          preserveFirstCapital: currentFlags.preserveFirstCapital,
          series: '',
          noTrailingSpace: currentFlags.noTrailingSpace,
          insideDialogueOnly: currentFlags.insideDialogueOnly,
          outsideDialogueOnly: currentFlags.outsideDialogueOnly
        });
      }
    });

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'global_terms_export.json';
    a.click();
    URL.revokeObjectURL(url);
  }
})();
