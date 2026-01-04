// ==UserScript==
// @name         Torn OC Best Role Helper (PDA minimal, OC page only, with link)
// @namespace    ace.torn.oc.ev
// @version      1.0.5
// @description  Shows the single best OC role for you based on EV (only on OC page, TornPDA friendly UI, with direct crime link)
// @author       Rat and Stez
// @match        https://www.torn.com/factions.php*
// @match        https://www.torn.com/organizedcrimes.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/550616/Torn%20OC%20Best%20Role%20Helper%20%28PDA%20minimal%2C%20OC%20page%20only%2C%20with%20link%29.user.js
// @updateURL https://update.greasyfork.org/scripts/550616/Torn%20OC%20Best%20Role%20Helper%20%28PDA%20minimal%2C%20OC%20page%20only%2C%20with%20link%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // --- Crime weights (position_id → weight) ---
  const crimeWeights = {
    "Mob Mentality" : { "P1": 0.34, "P2": 0.26, "P3": 0.18, "P4": 0.23 },
    "Pet Project" : { "P1": 0, "P2": 0, "P3": 0 },
    "Best of the Lot" : { "P1": 0, "P2": 0, "P3": 0 },
    "Cash Me if You Can" : { "P1": 0.50, "P2": 0.22, "P3": 0.28 },
    "Smoke and Wing Mirrors" : { "P1": 0.51, "P2": 0.27, "P3": 0.09, "P4": 0.13 },
    "Market Forces" : { "P1": 0.29, "P2": 0.27, "P3": 0.16, "P4": 0.05, "P5": 0.23 },
    "Gaslight the Way" : { "P1": 0.09, "P2": 0.10, "P3": 0.27, "P4": 0, "P5": 0.41, "P6": 0.13 },
    "Snow Blind" : { "P1": 0.48, "P2": 0.36, "P3": 0.08, "P4": 0.08 },
    "Stage Fright" : { "P1": 0.16, "P2": 0.20, "P3": 0.03, "P4": 0.09, "P5": 0.06, "P6": 0.46 },
    "No Reserve" : { "P1": 0.31, "P2": 0.38, "P3": 0.31 },
    "Counter Offer" : { "P1": 0.36, "P2": 0.07, "P3": 0.12, "P4": 0.17, "P5": 0.28 },
    "Leave No Trace" : { "P1": 0.29, "P2": 0.34, "P3": 0.37 },
    "Bidding War" : { "P1": 0.07, "P2": 0.13, "P3": 0.22, "P4": 0.32, "P5": 0.08, "P6": 0.18 },
    "Honey Trap" : { "P1": 0.27, "P2": 0.31, "P3": 0.42 },
    "Blast from the Past" : { "P1": 0.11, "P2": 0.12, "P3": 0.24, "P4": 0.16, "P5": 0.34, "P6": 0.03 },
    "Clinical Precision" : { "P1": 0.43, "P2": 0.19, "P3": 0.16, "P4": 0.22 },
    "Break the Bank" : { "P1": 0.13, "P2": 0.14, "P3": 0.10, "P4": 0.03, "P5": 0.32, "P6": 0.29 },
    "Stacking the Deck" : { "P1": 0.23, "P2": 0.03, "P3": 0.26, "P4": 0.48 },
    "Ace in the Hole" : { "P1": 0.21, "P2": 0.18, "P3": 0.25, "P4": 0.28, "P5": 0.08 }
  };

  // --- Crime min/max payouts ---
  const crimePayouts = {
    "Mob Mentality" : { min: 829625, max: 1371357 },
    "Pet Project" : { min: 414000, max: 800000 },
    "Best of the Lot" : { min: 810000, max: 1900000 },
    "Cash Me if You Can" : { min: 856800, max: 1555062 },
    "Smoke and Wing Mirrors" : { min: 2100000, max: 4700000 },
    "Market Forces" : { min: 4691974, max: 8453868 },
    "Gaslight the Way" : { min: 4798464, max: 7975605 },
    "Snow Blind" : { min: 6170615, max: 10331828 },
    "Stage Fright" : { min: 12450000, max: 24900000 },
    "No Reserve" : { min: 25715641, max: 42919528 },
    "Counter Offer" : { min: 12350114, max: 33918610 },
    "Leave No Trace" : { min: 7499500, max: 12990583 },
    "Bidding War" : { min: 51431283, max: 85639056 },
    "Honey Trap" : { min: 14775212, max: 25643705 },
    "Blast from the Past" : { min: 99931212, max: 167566309 },
    "Clinical Precision" : { min: 66239666, max: 117161350 },
    "Break the Bank" : { min: 216237500, max: 376145789 },
    "Stacking the Deck" : { min: 152170777, max: 250765713 },
    "Ace in the Hole" : { min: 190213472, max: 313457142 }
  };

  const P = 0.5, K = 0.5;

  // only act if the OC tab is open
  if (!location.href.includes('factions.php')) return;

  // --- UI ---
  const btn = document.createElement('button');
  btn.textContent = 'Best OC Role';
  Object.assign(btn.style, {
    position: 'fixed',
    bottom: '52px', // moved up so it's above chat
    right: '12px',
    zIndex: 99999,
    padding: '6px 10px',
    background: '#2a4cff',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '13px'
  });
  document.body.appendChild(btn);

  const panel = document.createElement('div');
  Object.assign(panel.style, {
    position: 'fixed',
    bottom: '100px', // also bumped up
    right: '12px',
    width: '90%',
    maxWidth: '360px',
    background: '#111',
    color: '#eee',
    border: '1px solid #444',
    borderRadius: '8px',
    padding: '10px',
    zIndex: 99999,
    display: 'none',
    fontSize: '13px',
    lineHeight: '1.4'
  });
  document.body.appendChild(panel);

  btn.onclick = () => {
    panel.style.display = (panel.style.display === 'none' ? 'block' : 'none');
    if (panel.style.display === 'block') fetchCrimes();
  };

  async function fetchCrimes() {
    const key = localStorage.getItem('ace.oc.key') || prompt('Enter Torn API key:');
    if (!key) return;
    localStorage.setItem('ace.oc.key', key);
    panel.innerHTML = 'Loading...';

    try {
      const res = await fetch(`https://api.torn.com/v2/faction/crimes?cat=recruiting&key=${key}`);
      const data = await res.json();
      if (!data.crimes) { panel.innerHTML = 'No recruiting OCs found.'; return; }

      const resItems = await fetch(`https://api.torn.com/v2/torn/206/items?sort=ASC&key=${key}`);
      const dataItems = await resItems.json();
      const items = dataItems.items || {};

      const { best } = process(data.crimes);
      render(best, items);
    } catch (e) {
      panel.innerHTML = 'Error: ' + e;
    }
  }

  function process(crimes) {
    const rows = [];
    for (const crime of crimes) {
      const members = crime.slots.length;
      let totalRemaining = 0, filled = 0;
      crime.slots.forEach(s => {
        if (s.user) { totalRemaining += 100 - s.user.progress; filled++; }
        else totalRemaining += 100;
      });
      const stallHours = totalRemaining * 0.24;

      for (const s of crime.slots) {
        if (s.user) continue;
        const weight = crimeWeights[crime.name]?.[s.position_id] || 0;
        const payoutMax = crimePayouts[crime.name]?.max;
        if (!payoutMax) continue;
        const ev = estPayout(weight, payoutMax, s.checkpoint_pass_rate, stallHours, members, filled);
        rows.push({
          crime_id: crime.id,
          crime: crime.name,
          role: `${s.position} ${s.position_number}`,
          ev,
          cpr: s.checkpoint_pass_rate,
          stall: stallHours.toFixed(1),
          item: s.item_requirement?.id || null
        });
      }
    }
    rows.sort((a,b)=>b.ev-a.ev);
    return { best: rows[0] };
  }

  function estPayout(weight, payoutMax, cpr, stallHours, members, filled) {
    const expectedWeight = 1/members;
    const contrib = (weight/expectedWeight)*(cpr/100);
    const indiv = payoutMax/members * Math.max(P, contrib);
    const affect = 1 - weight*(1-(cpr/100));
    const cprDamage = payoutMax - payoutMax*affect;
    const stallBonus = (stallHours===0 && filled===0)?1:(1+(K/(1+Math.sqrt(stallHours))));
    return indiv*stallBonus - cprDamage;
  }

  function render(best, items) {
    if (!best) { panel.innerHTML = 'No open roles found.'; return; }

    const crimeUrl = `https://www.torn.com/factions.php?step=your&type=1#/tab=crimes&crimeId=${best.crime_id}`;
      const itemObj = best.item ? items.find(i => i.id === best.item) : null;
      const itemText = itemObj ? `Requires: ${itemObj.name} (#${best.item})` : 'No item required';

    panel.innerHTML = `
      <div style="font-weight:600; margin-bottom:6px;">Best OC Role:</div>
      <div><a href="${crimeUrl}" target="_blank" style="color:#4af;">${best.crime}</a> — <b>${best.role}</b></div>
      <div>EV: $${Math.round(best.ev).toLocaleString()}</div>
      <div>CPR: ${best.cpr}% · Stalls in: ${best.stall} hours</div>
      <div>${best.item ? 'Requires: Item #' + best.item : 'No item required'}</div>
    `;
  }

})();