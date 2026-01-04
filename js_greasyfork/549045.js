// ==UserScript==
// @name         Einsatz-Neulader
// @namespace    leeSalami.lss
// @version      1.0.4
// @description  Lädt den Einsatz neu, falls Fahrzeuge nicht ausgewählt werden konnten.
// @author       leeSalami
// @license      All Rights Reserved
// @match        https://*.leitstellenspiel.de/missions/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        unsafeWindow
// @icon         https://www.google.com/s2/favicons?sz=64&domain=leitstellenspiel.de
// @downloadURL https://update.greasyfork.org/scripts/549045/Einsatz-Neulader.user.js
// @updateURL https://update.greasyfork.org/scripts/549045/Einsatz-Neulader.meta.js
// ==/UserScript==

(async () => {
  'use strict'

  if (!document.getElementById('missionH1') && !document.body.innerHTML.includes('Der Einsatz wurde erfolgreich abgeschlossen.')) {
    const missionId = getMissionId();

    if (!missionId) {
      return;
    }

    let retries = await GM.getValue(missionId, 0);

    if (retries >= 2) {
      await GM.deleteValue(missionId);
      return;
    }

    await GM.setValue(missionId, ++retries);
    await new Promise(r => setTimeout(r, 500));
    window.location.reload();
    return;
  }

  const alertOrig = unsafeWindow.alert;
  unsafeWindow.alert = (message) => {
    if (message.startsWith(I18n.t('javascript.missed_vehicle')) || message.startsWith('Fehler beim Nachladen')) {
      window.location.reload();
      return;
    }

    alertOrig(message);
  }

  function getMissionId() {
    const regex = /^\/missions\/(\d+)/;
    const matches = location.pathname.match(regex);
    return matches ? matches[1] : null;
  }
})();
