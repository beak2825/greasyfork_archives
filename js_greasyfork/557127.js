// ==UserScript==
// @name         Torn OC Loan Checker
// @namespace    https://torn.com
// @version      1.0
// @description  Cross references current player OCs with items loaned to them. identifying over-allocated items.
// @author       Allenone [2033011]
// @match        https://www.torn.com/factions.php?step=your
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/557127/Torn%20OC%20Loan%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/557127/Torn%20OC%20Loan%20Checker.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const API_KEY = '';
  let overAllocated = new Map();
  let highlightedRows = new Set();

  function waitForBody() {
    return new Promise(resolve => {
      if (document.body) return resolve();
      const observer = new MutationObserver(() => {
        if (document.body) {
          observer.disconnect();
          resolve();
        }
      });
      observer.observe(document.documentElement, { childList: true, subtree: true });
    });
  }

  function clearHighlights() {
    highlightedRows.forEach(li => {
      if (li?.style) {
        li.style.outline = '';
        li.style.boxShadow = '';
      }
    });
    highlightedRows.clear();
  }

  function highlightOverAllocated() {
    clearHighlights();

    const container = document.querySelector('#armoury-utilities');
    if (!container) return;

    container.querySelectorAll('li.tt-overlay-ignore').forEach(li => {
      const loanedDiv = li.querySelector('.loaned');
      if (!loanedDiv) return;

      const link = loanedDiv.querySelector('a[href^="/profiles.php?XID="]');
      if (!link) return;

      const match = link.href.match(/XID=(\d+)/);
      if (!match) return;

      const playerId = match[1];
      const itemImg = li.querySelector('.img-wrap');
      const itemId = itemImg?.getAttribute('data-itemid');
      if (!itemId) return;

      if (overAllocated.get(playerId)?.has(parseInt(itemId))) {
        li.style.outline = '4px solid #0f0';
        li.style.outlineOffset = '-2px';
        li.style.boxShadow = '0 0 15px #0f0';
        li.style.transition = 'all 0.3s';
        highlightedRows.add(li);
      }
    });
  }

  async function createUI() {
    await waitForBody();

    document.querySelectorAll('#oc-loan-btn, #oc-loan-panel').forEach(el => el.remove());

    const btn = document.createElement('button');
    btn.id = 'oc-loan-btn';
    btn.textContent = 'OC Loans';
    btn.style.cssText = `
      position:fixed;top:12px;right:12px;z-index:99999;
      padding:10px 18px;background:#000;color:#0f0;border:2px solid #0f0;
      border-radius:8px;font-family:monospace;font-weight:bold;cursor:pointer;
      box-shadow:0 0 15px #0f04;transition:all .25s;
    `;
    btn.onmouseover = () => { btn.style.background = '#0f0'; btn.style.color = '#000'; };
    btn.onmouseout = () => { btn.style.background = '#000'; btn.style.color = '#0f0'; };

    const panel = document.createElement('div');
    panel.id = 'oc-loan-panel';
    panel.style.cssText = `
      position:fixed;top:58px;right:12px;width:400px;max-height:80vh;
      background:#111;border:2px solid #0f0;border-radius:10px;
      box-shadow:0 10px 35px rgba(0,255,0,0.35);z-index:99998;
      opacity:0;visibility:hidden;transform:translateY(-12px);
      transition:all .3s cubic-bezier(0.25,0.8,0.25,1);
      font-family:monospace;color:#0f0;overflow:hidden;
    `;

    panel.innerHTML = `
      <div style="background:#000;padding:12px 16px;border-bottom:2px solid #0f0;display:flex;justify-content:space-between;align-items:center;">
        <strong>Unused Loaned Items</strong>
        <span id="oc-close" style="cursor:pointer;color:#f55;font-size:22px;font-weight:bold;">×</span>
      </div>
      <div id="oc-content" style="padding:16px;max-height:calc(80vh - 60px);overflow-y:auto;">
        <em style="color:#666;">Click to check...</em>
      </div>
    `;

    document.body.appendChild(btn);
    document.body.appendChild(panel);

    const content = panel.querySelector('#oc-content');
    let isOpen = false;

    function openPanel() {
      isOpen = true;
      panel.style.opacity = '1';
      panel.style.visibility = 'visible';
      panel.style.transform = 'translateY(0)';
      highlightOverAllocated();
    }

    function closePanel() {
      isOpen = false;
      panel.style.opacity = '0';
      panel.style.visibility = 'hidden';
      panel.style.transform = 'translateY(-12px)';
      clearHighlights();
    }

    btn.onclick = e => {
      e.stopPropagation();
      if (isOpen) closePanel();
      else {
        openPanel();
        if (content.innerHTML.includes('Click to check')) runCheck();
      }
    };

    panel.querySelector('#oc-close').onclick = e => {
      e.stopPropagation();
      closePanel();
    };

    panel.onclick = e => e.stopPropagation();

    new MutationObserver(() => {
      if (isOpen) setTimeout(highlightOverAllocated, 250);
    }).observe(document.body, { childList: true, subtree: true });

    async function runCheck() {
      content.innerHTML = '<div style="text-align:center;padding:30px;color:#0f0;">Loading data...</div>';
      overAllocated.clear();
      clearHighlights();

      const fetchAll = async (url, key = 'crimes') => {
        const items = [];
        while (url) {
          const res = await fetch(url);
          if (!res.ok) throw new Error(`API error ${res.status}`);
          const data = await res.json();
          items.push(...(data[key] || []));
          url = data._metadata?.links?.next || null;
        }
        return items;
      };

      try {
        const [crimes, utilsData, membersData] = await Promise.all([
          fetchAll(`https://api.torn.com/v2/faction/crimes?cat=available&key=${API_KEY}`, 'crimes'),
          fetch(`https://api.torn.com/faction/?selections=utilities&key=${API_KEY}`).then(r => r.json()),
          fetch(`https://api.torn.com/v2/faction/members?&key=${API_KEY}`).then(r => r.json())
        ]);

        const nameMap = new Map();
        (membersData.members || []).forEach(m => nameMap.set(String(m.id), m.name || '???'));

        const used = new Map();
        crimes.forEach(c => c.slots?.forEach(s => {
          if (s.user?.id && s.item_requirement?.id) {
            const pid = String(s.user.id);
            if (!used.has(pid)) used.set(pid, new Set());
            used.get(pid).add(s.item_requirement.id);
          }
        }));

        (utilsData.utilities || []).forEach(u => {
          if (!u.loaned) return;
          const ids = typeof u.loaned_to === 'string'
            ? u.loaned_to.split(',').map(x => x.trim()).filter(Boolean)
            : [];
          ids.forEach(pid => {
            if (!used.get(pid)?.has(u.ID)) {
              if (!overAllocated.has(pid)) overAllocated.set(pid, new Set());
              overAllocated.get(pid).add(u.ID);

              // for the table
              window.overAllocatedList = window.overAllocatedList || [];
              window.overAllocatedList.push({
                name: nameMap.get(pid) || `Unknown [${pid}]`,
                pid,
                item: u.name,
                iid: u.ID
              });
            }
          });
        });

        const over = window.overAllocatedList || [];
        over.sort((a, b) => a.name.localeCompare(b.name));

        if (over.length === 0) {
          content.innerHTML = '<div style="text-align:center;padding:50px;color:#0f0;font-size:16px;">All loaned items are in use!</div>';
        } else {
          let rows = '';
          over.forEach(e => {
            rows += `<tr style="border-bottom:1px solid #333;color:#666;">
              <td style="padding:10px;color:#0f0;">${e.name} <span style="color:#0f0;font-size:11px;">[${e.pid}]</span></td>
              <td style="padding:10px;color:#0f0;">${e.item} <span style="color:#0f0;font-size:11px;">(${e.iid})</span></td>
            </tr>`;
          });
          content.innerHTML = `
            <div style="margin-bottom:12px;"><strong>${over.length}</strong> unused loaned items</div>
            <table style="width:100%;border-collapse:collapse;">
              <thead><tr style="background:#000;border-bottom:2px solid #0f0;">
                <th style="text-align:left;padding:8px;">Player</th>
                <th style="text-align:left;padding:8px;">Item</th>
              </tr></thead>
              <tbody>${rows}</tbody>
            </table>`;
        }

        setTimeout(highlightOverAllocated, 300);

      } catch (err) {
        content.innerHTML = `<div style="color:#f55;padding:20px;">Error: ${err.message}</div>`;
        console.error(err);
      }
    }
  }

  createUI();
})();