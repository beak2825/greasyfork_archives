// ==UserScript==
// @name        TornPDA_Utility_Quick_Faction_Attack
// @namespace   Violentmonkey Scripts
// @match       https://www.torn.com/factions.php*
// @grant       none
// @version     1.01
// @author      bilbosaggings[2323763]
// @description makes member list statuses into clicky links to initiate an attack against the user. for pda mostly
// @downloadURL https://update.greasyfork.org/scripts/563052/TornPDA_Utility_Quick_Faction_Attack.user.js
// @updateURL https://update.greasyfork.org/scripts/563052/TornPDA_Utility_Quick_Faction_Attack.meta.js
// ==/UserScript==

const scriptKey = 'TornPDA_Utility_Quick_Faction_Attack'

const log = (...args) => console.log(`[${scriptKey}]: `, ...args);

const err = (...args) => console.error(`[${scriptKey}]: `, ...args);

const waitForElement = async (selector, target = document.body) => {
  return new Promise((resolve) => {
    if (target.querySelector(selector)) {
      resolve(target.querySelector(selector));
    }

    const observer = new MutationObserver(() => {
      if (target.querySelector(selector)) {
        resolve(target.querySelector(selector));
        observer.disconnect();
      }
    });

    observer.observe(target, {
      subtree: true,
      childList: true,
    });
  });
};


(() => {
  waitForElement('.faction-info-wrap > .members-list > .table-body').then(el => {
    const rows = el.querySelectorAll('.table-row')
    for(const r of rows){
      const l = r.querySelector('[class*="honorWrap"] > a')?.href

      const u = parseInt(l.split('XID=')[1].trim());

      const s = r.querySelector('.table-cell.status');
      s.innerHTML = `<a href="https://www.torn.com/loader.php?sid=attack&user2ID=${u}" target="_blank">${s.innerHTML}</a>`;
    }
  })
})()


