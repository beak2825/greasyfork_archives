// ==UserScript==
// @name         Pappers.fr Position Extractor
// @namespace    https://www.pappers.fr/
// @version      1.3.4
// @description  Extracts company positions from pappers.fr (dirigeant pages) → now skips Commissaire aux comptes titulaire & suppléant
// @author       Claude, ChatGPT, Grok
// @match        *://*.pappers.fr/*
// @icon         https://www.pappers.fr/favicon.ico
// @run-at       document-end
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/556276/Pappersfr%20Position%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/556276/Pappersfr%20Position%20Extractor.meta.js
// ==/UserScript==

(function () {
  'use strict';

  if (!/\/dirigeant\//.test(window.location.pathname)) {
    console.log('Pappers Extractor: Not a dirigeant profile → script aborted.');
    return;
  }

  function removeAccents(str) {
    if (!str) return '';
    return str
      .replace(/[éèêëÉÈÊË]/g, 'e')
      .replace(/[àâäÀÂÄ]/g, 'a')
      .replace(/[îïÎÏ]/g, 'i')
      .replace(/[ôöÔÖ]/g, 'o')
      .replace(/[ùûüÙÛÜ]/g, 'u')
      .replace(/[çÇ]/g, 'c')
      .replace(/æ/g, 'ae')
      .replace(/œ/g, 'oe');
  }

  function capitalizeCompanyName(name) {
    if (!name) return '';
    name = name.trim().replace(/\s+/g, ' ');
    const acronyms = ['SCI', 'SA', 'SARL', 'SAS', 'SASU', 'SNC', 'UK', 'ABC', 'EURL', 'GIE', 'SEM', 'SCAJ'];
    const frenchArticlesSimple = ['la', 'le', 'les', 'du', 'des', 'de', 'au', 'aux'];
    const words = name.split(' ');

    function capitalizeSimpleWord(word, index) {
      if (!word) return word;

      if (word.includes('-')) {
        return word.split('-').map(part => capitalizeSimpleWord(part, index)).join('-');
      }

      const leading = (word.match(/^[^A-Za-zÀ-ÖØ-öø-ÿ'']+/) || [''])[0];
      const trailing = (word.match(/[^A-Za-zÀ-ÖØ-öø-ÿ'']+$/) || [''])[0];
      const core = word.slice(leading.length, word.length - trailing.length);
      if (!core) return word;

      const coreLower = core.toLowerCase();
      const coreNoAccents = removeAccents(core).toUpperCase();

      const contractionMatch = coreLower.match(/^(d['']|l[''])(.*)$/);
      if (contractionMatch) {
        const prefix = contractionMatch[1];
        const rest = contractionMatch[2];
        if (index === 0) {
          return leading + prefix + rest.charAt(0).toUpperCase() + rest.slice(1).toLowerCase() + trailing;
        } else {
          return leading + prefix + rest.toLowerCase() + trailing;
        }
      }

      if (frenchArticlesSimple.includes(coreLower)) {
        if (index === 0) {
          return leading + coreLower.charAt(0).toUpperCase() + coreLower.slice(1) + trailing;
        } else {
          return leading + coreLower + trailing;
        }
      }

      if (acronyms.includes(core.toUpperCase()) || acronyms.includes(coreNoAccents)) {
        return leading + core.toUpperCase() + trailing;
      }

      if (core === 'CO') return leading + 'Co' + trailing;
      if (core === 'AND') return leading + 'and' + trailing;
      if (core === 'ET') {
        return index === 0 ? leading + 'Et' + trailing : leading + 'et' + trailing;
      }

      // ---------- FIX: prevent false acronym detection ----------
      if (core.length <= 3 && core === core.toUpperCase()) {
        if (acronyms.includes(core.toUpperCase()) || acronyms.includes(coreNoAccents)) {
          return leading + core.toUpperCase() + trailing;
        }
        return leading + core.charAt(0).toUpperCase() + core.slice(1).toLowerCase() + trailing;
      }
      // -----------------------------------------------------------

      if (core.length > 3 && core === core.toUpperCase()) {
        return leading + core.charAt(0).toUpperCase() + core.slice(1).toLowerCase() + trailing;
      }

      return leading + core.charAt(0).toUpperCase() + core.slice(1).toLowerCase() + trailing;
    }

    return words.map((w, idx) => capitalizeSimpleWord(w, idx)).join(' ');
  }

  const translateMap = {
    'président': 'Chairman',
    "président du conseil d'administration": 'Chairman of the administration committee',
    'directeur général': 'Managing Director',
    'directeur general': 'Managing Director',
    'administrateur': 'Administrator',
    'gérant': 'Director',
    'gerant': 'Director',
    'autre': 'shareholder',
    'membre du conseil de surveillance': 'Member of the surveillance committee',
    'ancien dirigeant': 'Director',
    'co-gérant': 'Co-Director',
    'cogérant': 'Co-Director'
  };

  const positionPriority = {
    'Chairman': 1,
    'Chairman of the administration committee': 2,
    'Managing Director': 3,
    'Director': 4,
    'Administrator': 5,
    'Member of the surveillance committee': 6,
    'shareholder': 7
  };

  function translatePosition(position) {
    if (!position) return '';
    const pLower = position.toLowerCase().trim();
    for (const [k, v] of Object.entries(translateMap).sort((a, b) => b[0].length - a[0].length)) {
      if (pLower === k || pLower.includes(k)) return v;
    }
    return position.charAt(0).toUpperCase() + position.slice(1);
  }

  const HARD_SKIP_ROLES = [
    'commissaire aux comptes titulaire',
    'commissaire aux comptes suppléant'
  ];

  function isHardSkipRole(text) {
    if (!text) return false;
    const t = text.toLowerCase().trim();
    return HARD_SKIP_ROLES.some(skip => t.includes(skip));
  }

  const SKIP_FRAGMENTS = [
    'associé indéfiniment responsable',
    'associé indéfiniment',
    'indéfiniment responsable',
    'liquidateur',
    'liquidation',
    'solidairement responsable',
    'contrôleur des comptes'
  ];

  function isSkippableRole(text) {
    if (!text) return false;
    const t = text.toLowerCase().trim();
    return SKIP_FRAGMENTS.some(f => t.includes(f));
  }

  function cleanAndSplitRoles(rawText) {
    if (!rawText) return [];

    if (isHardSkipRole(rawText)) return [];

    const normalized = rawText.replace(/\u2019/g, "'").trim();
    let parts = normalized.split(/\s+et\s+/i).map(p => p.trim()).filter(Boolean);
    if (!parts.length) parts = [normalized];

    parts = parts.filter(part => !isHardSkipRole(part));

    let valid = parts.filter(p => !isSkippableRole(p));

    if (valid.length === 0) return [];

    const seen = new Set();
    valid = valid.filter(v => {
      const key = v.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    return valid;
  }

  function extractPositions() {
    const positions = [];
    const companyItems = document.querySelectorAll('ul > li:not(.cessee)');

    companyItems.forEach((li) => {
      try {
        if (li.classList.contains('cessee')) return;

        const h3 = li.querySelector('h3');
        if (!h3) return;
        const companyNameRaw = h3.childNodes[0]?.textContent?.trim();
        if (!companyNameRaw) return;

        const generalDiv = li.querySelector('.general');
        if (!generalDiv) return;

        const positionDivs = generalDiv.querySelectorAll('div');
        positionDivs.forEach(div => {
          const positionSpan = div.querySelector('span.dirigeant b');
          if (!positionSpan) return;

          const positionTextRaw = positionSpan.textContent.trim();
          const roleParts = cleanAndSplitRoles(positionTextRaw);

          if (roleParts.length === 0) {
            console.log(`Skipping entire position block: ${positionTextRaw}`);
            return;
          }

          roleParts.forEach(part => {
            let category = 'current';
            const spanElement = div.querySelector('span.dirigeant');
            const divText = div.textContent || '';

            if (spanElement && spanElement.classList.contains('grey')) {
              category = 'previous';
            } else if (/du \d{2}\/\d{2}\/\d{4} au \d{2}\/\d{2}\/\d{4}/.test(divText)) {
              category = 'previous';
            } else if (/depuis le \d{2}\/\d{2}\/\d{4}/.test(divText)) {
              category = 'current';
            }

            positions.push({
              company: companyNameRaw,
              position: part,
              category
            });
          });
        });
      } catch (e) {
        console.error('Error extracting position:', e);
      }
    });

    return positions;
  }

  function groupByCompany(data) {
    const grouped = { current: {}, previous: {} };

    data.forEach(({ company, position, category }) => {
      const normalizedCompany = capitalizeCompanyName(company);
      if (!grouped[category][normalizedCompany]) grouped[category][normalizedCompany] = [];
      grouped[category][normalizedCompany].push(translatePosition(position));
    });

    ['current', 'previous'].forEach(cat => {
      Object.keys(grouped[cat]).forEach(company => {
        let positions = grouped[cat][company];
        positions = [...new Set(positions)];

        if (positions.includes('Chairman') && positions.includes('Administrator')) {
          positions = positions.filter(p => p !== 'Administrator');
        }

        positions.sort((a, b) => {
          const pa = positionPriority[a] || 999;
          const pb = positionPriority[b] || 999;
          return pa - pb;
        });

        grouped[cat][company] = positions;
      });

      Object.keys(grouped[cat]).forEach(company => {
        if (!grouped[cat][company]?.length) delete grouped[cat][company];
      });
    });

    return grouped;
  }

  function formatResults(grouped) {
    const current = [];
    const previous = [];

    Object.entries(grouped.current).forEach(([company, positions]) => {
      current.push(`- ${company}, ${positions.join(', ')}`);
    });
    Object.entries(grouped.previous).forEach(([company, positions]) => {
      previous.push(`- ${company}, ${positions.join(', ')}`);
    });

    let result = '';
    if (current.length) result += `Other positions:\n${current.join('\n')}`;
    if (previous.length) {
      if (result) result += '\n\n';
      result += `Previous positions:\n${previous.join('\n')}`;
    }
    return result || 'No positions found';
  }

  function showPopup(text) {
    const existing = document.getElementById('pappersPopupContainer');
    if (existing) existing.remove();

    const popup = document.createElement('div');
    popup.id = 'pappersPopupContainer';
    popup.innerHTML = `
      <div id="pappersPopup" style="position:fixed;top:80px;right:20px;width:450px;background:#fff;border:2px solid #444;border-radius:10px;box-shadow:0 4px 12px rgba(0,0,0,0.3);padding:15px;font-family:sans-serif;z-index:9999;transition:width 0.3s ease,right 0.3s ease;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
          <b style="font-size:16px;">Pappers.fr Extractor</b>
          <button id="closeBtn" style="background:#d32f2f2;color:white;border:none;border-radius:4px;padding:5px 10px;cursor:pointer;font-weight:bold;">X</button>
        </div>
        <textarea id="resultText" style="width:100%;height:60vh;resize:vertical;white-space:pre-wrap;font-size:13px;background:#f5f5f5;padding:10px;border-radius:4px;border:1px solid #ccc;">${text}</textarea>
        <div style="display:flex;gap:10px;margin-top:10px;">
          <button id="copyBtn" style="flex:1;background:#1976d2;color:white;border:none;border-radius:4px;padding:8px 16px;cursor:pointer;font-weight:bold;">Copy to Clipboard</button>
          <button id="editBtn" style="flex:1;background:#ff9800;color:white;border:none;border-radius:4px;padding:8px 16px;cursor:pointer;font-weight:bold;">Edit</button>
        </div>
        <div style="display:flex;gap:10px;margin-top:10px;">
          <button id="stretchBtn" style="flex:1;background:#4caf50;color:white;border:none;border-radius:4px;padding:8px 16px;cursor:pointer;font-weight:bold;">Stretch</button>
          <button id="zoomInBtn" style="background:#9c27b0;color:white;border:none;border-radius:4px;padding:8px 16px;cursor:pointer;font-weight:bold;">Zoom +</button>
          <button id="zoomOutBtn" style="background:#9c27b0;color:white;border:none;border-radius:4px;padding:8px 16px;cursor:pointer;font-weight:bold;">Zoom -</button>
        </div>
      </div>`;
    document.body.appendChild(popup);

    const popupDiv = popup.querySelector('#pappersPopup');
    const textarea = popup.querySelector('#resultText');
    textarea.readOnly = true;
    let isStretched = false;
    let currentZoom = 13;

    popup.querySelector('#closeBtn').onclick = () => popup.remove();
    popup.querySelector('#copyBtn').onclick = () => {
      GM_setClipboard(textarea.value);
      const btn = popup.querySelector('#copyBtn');
      btn.textContent = 'Copied!';
      setTimeout(() => btn.textContent = 'Copy to Clipboard', 2000);
    };
    popup.querySelector('#editBtn').onclick = (e) => {
      textarea.readOnly = !textarea.readOnly;
      textarea.style.background = textarea.readOnly ? '#f5f5f5' : '#fff8e1';
      e.target.textContent = textarea.readOnly ? 'Edit' : 'Lock';
    };
    popup.querySelector('#stretchBtn').onclick = (e) => {
      isStretched = !isStretched;
      popupDiv.style.width = isStretched ? '900px' : '450px';
      e.target.textContent = isStretched ? 'Shrink' : 'Stretch';
    };
    popup.querySelector('#zoomInBtn').onclick = () => {
      currentZoom = Math.min(currentZoom + 2, 24);
      textarea.style.fontSize = currentZoom + 'px';
    };
    popup.querySelector('#zoomOutBtn').onclick = () => {
      currentZoom = Math.max(currentZoom - 2, 8);
      textarea.style.fontSize = currentZoom + 'px';
    };
  }

  async function scrollToLoadAll() {
    window.scrollTo(0, document.documentElement.scrollHeight);
    await new Promise(r => setTimeout(r, 1000));
    window.scrollTo(0, 0);
    await new Promise(r => setTimeout(r, 500));
  }

  async function init() {
    await new Promise(r => setTimeout(r, 1500));
    await scrollToLoadAll();
    await new Promise(r => setTimeout(r, 800));

    const data = extractPositions();
    if (!data.length) {
      showPopup('No positions found on this page');
      return;
    }

    const grouped = groupByCompany(data);
    const formatted = formatResults(grouped);
    showPopup(formatted);
  }

  window.addEventListener('load', () => setTimeout(init, 1200));
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'P') init();
  });
})();
