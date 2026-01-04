// ==UserScript==
// @name        Prenotazione CIE – doppia preferenza
// @namespace   Violentmonkey Scripts
// @match       https://www.prenotazionicie.interno.gov.it/cittadino/a/sc/wizardAppuntamentoCittadino*
// @grant       none
// @version     3.2
// @description Automazione CIE con due sedi preferite, log, notifiche e watchdog
// @downloadURL https://update.greasyfork.org/scripts/550351/Prenotazione%20CIE%20%E2%80%93%20doppia%20preferenza.user.js
// @updateURL https://update.greasyfork.org/scripts/550351/Prenotazione%20CIE%20%E2%80%93%20doppia%20preferenza.meta.js
// ==/UserScript==

const TIMEOUT = 2500;
const WATCHDOG_DELAY = 15000;
const MAX_ATTEMPTS = 10;

// Lista sedi disponibili
const SEDI = [
  "Municipio I - Sede Principale",
  "Municipio Ii - Sede Principale - Via Dire Daua, 11",
  "Municipio Iii - Sede Principale",
  "Municipio Iv - Sede Principale",
  "Municipio V - - Via Torre Annunziata , 1",
  "Municipio Vi - Sede Principale - Via Duilio Cambellotti, 11",
  "Municipio Vii - Sede A",
  "Municipio Vii - Sede Secondaria",
  "Municipio Viii - Sede Principale",
  "Municipio Ix - Sede Principale - Viale Ignazio Silone I Ponte, 1",
  "Municipio X - Sede Secondaria - Acilia - Piazza Capelvenere, 13"
];

// Sedi selezionate
let TARGET_SEDE = localStorage.getItem("sedePrimary") || SEDI[0];
let SECONDARY_SEDE = localStorage.getItem("sedeSecondary") || "";

// Array interno delle sedi da provare
let SEDE_PREFERITE = [TARGET_SEDE];
if(SECONDARY_SEDE && SECONDARY_SEDE!==TARGET_SEDE) SEDE_PREFERITE.push(SECONDARY_SEDE);

// Watchdog inattività
let watchdogTimer;
function resetWatchdog() {
  if (watchdogTimer) clearTimeout(watchdogTimer);
  watchdogTimer = setTimeout(() => {
    logMessage("⏱️ Inattività >15s → torno a scelta sede");
    window.location.href =
      "https://www.prenotazionicie.interno.gov.it/cittadino/a/sc/wizardAppuntamentoCittadino/sceltaSede";
  }, WATCHDOG_DELAY);
}
function activity() { resetWatchdog(); }
resetWatchdog();

// Log su schermo
function initLogPanel() {
  if (document.querySelector("#logPanel")) return;
  const panel = document.createElement("div");
  panel.id = "logPanel";
  panel.style.position = "fixed";
  panel.style.top = "15px";
  panel.style.left = "15px";
  panel.style.zIndex = "9999";
  panel.style.background = "rgba(0,0,0,0.75)";
  panel.style.color = "white";
  panel.style.padding = "10px";
  panel.style.borderRadius = "12px";
  panel.style.fontFamily = "Arial, sans-serif";
  panel.style.fontSize = "13px";
  panel.style.maxWidth = "320px";
  panel.style.maxHeight = "400px";
  panel.style.overflowY = "auto";
  document.body.appendChild(panel);
}
function logMessage(msg) {
  console.log(msg);
  initLogPanel();
  const panel = document.querySelector("#logPanel");
  const p = document.createElement("div");
  p.innerText = msg;
  panel.appendChild(p);
  panel.scrollTop = panel.scrollHeight;
}

// 🔹 Selettori per sede primaria e secondaria
function createSelector() {
  if (document.querySelector("#sedeSelectorContainer")) return;

  const container = document.createElement("div");
  container.id = "sedeSelectorContainer";
  container.style.position = "fixed";
  container.style.top = "15px";
  container.style.right = "15px";
  container.style.zIndex = "9999";
  container.style.background = "linear-gradient(145deg, #f0f8ff, #ffffff)";
  container.style.border = "2px solid #007bff";
  container.style.padding = "10px 14px";
  container.style.borderRadius = "16px";
  container.style.boxShadow = "0 6px 18px rgba(0,0,0,0.18)";
  container.style.fontFamily = "Arial, sans-serif";
  container.style.fontSize = "14px";
  container.style.display = "flex";
  container.style.flexDirection = "column";
  container.style.gap = "6px";

  container.innerHTML = `
    <div style="display:flex; align-items:center; gap:6px;">
      <label style="font-weight:bold; color:#007bff;">Sede primaria:</label>
      <select id="sedePrimary" style="font-size:14px; padding:6px 10px; border-radius:10px; border:1px solid #ccc; outline:none; cursor:pointer; min-width:250px;">
        ${SEDI.map(s => `<option value="${s}" ${s===TARGET_SEDE?"selected":""}>${s}</option>`).join('')}
      </select>
    </div>
    <div style="display:flex; align-items:center; gap:6px;">
      <label style="font-weight:bold; color:#007bff;">Sede secondaria:</label>
      <select id="sedeSecondary" style="font-size:14px; padding:6px 10px; border-radius:10px; border:1px solid #ccc; outline:none; cursor:pointer; min-width:250px;">
        <option value="">- nessuna -</option>
        ${SEDI.map(s => `<option value="${s}" ${s===SECONDARY_SEDE?"selected":""}>${s}</option>`).join('')}
      </select>
    </div>
    <button id="resetSede" style="background:#ff4d4f; border:none; color:white; padding:6px 10px; border-radius:10px; cursor:pointer; font-size:12px; margin-top:4px;">Reset</button>
  `;
  document.body.appendChild(container);

  const primary = document.querySelector("#sedePrimary");
  const secondary = document.querySelector("#sedeSecondary");

  function savePreferences(){
    TARGET_SEDE = primary.value;
    SECONDARY_SEDE = secondary.value;
    SEDE_PREFERITE = [TARGET_SEDE];
    if(SECONDARY_SEDE && SECONDARY_SEDE!==TARGET_SEDE) SEDE_PREFERITE.push(SECONDARY_SEDE);
    localStorage.setItem("sedePrimary", TARGET_SEDE);
    localStorage.setItem("sedeSecondary", SECONDARY_SEDE);
    logMessage("📌 Preferenze aggiornate: primaria="+TARGET_SEDE+" | secondaria="+SECONDARY_SEDE);
    activity();
  }

  primary.addEventListener("change", savePreferences);
  secondary.addEventListener("change", savePreferences);

  document.querySelector("#resetSede").addEventListener("click", () => {
    localStorage.removeItem("sedePrimary");
    localStorage.removeItem("sedeSecondary");
    primary.value = SEDI[0];
    secondary.value = "";
    savePreferences();
    logMessage("♻️ Preferenze resettate");
  });
}

// Normalizza testo
function normalize(text) { return text.trim().toLowerCase().replace(/\s+/g," "); }

// Popup blu (nessuna disponibilità)
function checkNoDisponibilita() {
  const alertBox = document.querySelector(".alert-info strong");
  if(alertBox && alertBox.innerText.includes("La sede non offre al momento disponibilità")){
    logMessage("⚠️ Nessuna disponibilità → ricarico...");
    const okButton = document.querySelector(".modal-footer-center button");
    if(okButton){ okButton.click(); activity(); }
    setTimeout(()=>window.location.reload(),1500);
  }
}

// Popup rosso (orario non disponibile)
function checkErroreOrario() {
  const alertBox = document.querySelector(".alert-danger strong");
  if(alertBox && alertBox.innerText.includes("Errore: L'orario scelto non è più disponibile")){
    logMessage("⚠️ Orario non disponibile → ricarico...");
    const okButton = document.querySelector(".modal-footer-center button");
    if(okButton){ okButton.click(); activity(); }
    setTimeout(()=>window.location.reload(),1500);
  }
}

// Notifica sonora
function beep(){ new Audio("https://www.soundjay.com/button/sounds/beep-07.mp3").play(); }

// Router su cambiamento pagina
(() => {
  let oldPushState = history.pushState;
  history.pushState = function(){
    let ret = oldPushState.apply(this, arguments);
    window.dispatchEvent(new Event("pushstate"));
    window.dispatchEvent(new Event("locationchange"));
    return ret;
  }
  let oldReplaceState = history.replaceState;
  history.replaceState = function(){
    let ret = oldReplaceState.apply(this, arguments);
    window.dispatchEvent(new Event("replacestate"));
    window.dispatchEvent(new Event("locationchange"));
    return ret;
  }
  window.addEventListener("popstate",()=>window.dispatchEvent(new Event("locationchange")));
})();

window.addEventListener("locationchange",()=>_cieFlow());
_cieFlow();

// Funzione principale
function _cieFlow(){
  const location = window.location.href.toString();
  logMessage("📍 Loaded "+location);

  createSelector();
  activity();

  if(location.endsWith("/sceltaSede")){
    logMessage("🏛 SCELTA SEDE");
    setInterval(()=>{
      const rows = [...document.querySelectorAll("table tbody tr")];
      if(rows.length===0) return;

      let found = false;
      for(const sede of SEDE_PREFERITE){
        for(const row of rows){
          if(normalize(row.innerText).includes(normalize(sede))){
            const radio = row.querySelector('input[type="radio"]');
            if(radio){
              logMessage("✅ Sede trovata: "+sede);
              radio.click();
              const btn = document.querySelector("button.btn:nth-child(2)");
              if(btn) btn.click();
              activity();
              found = true;
            }
            break;
          }
        }
        if(found) break;
      }
      if(!found){
        logMessage("❌ Nessuna delle sedi preferite trovata, ricarico...");
        window.location.reload();
      }
    }, TIMEOUT);

  } else if(location.endsWith("/sceltaDataOra")){
    logMessage("📅 SCELTA DATA E ORA");
    setTimeout(()=>{
      let attempts=0;
      let dataInterval = setInterval(()=>{
        checkNoDisponibilita();
        checkErroreOrario();

        const timetable = document.querySelector("#timepicker");
        if(!timetable){ logMessage("⌛ Orari non ancora caricati..."); return; }

        const choices = [...document.querySelectorAll("#timepicker .available")];
        if(choices.length===0){
          attempts++;
          logMessage(`🚫 Nessun orario disponibile (tentativo ${attempts}/${MAX_ATTEMPTS})`);
          if(attempts>=MAX_ATTEMPTS){
            logMessage("↩️ Troppa inattività, torno indietro alla scelta sede");
            clearInterval(dataInterval);
            const backBtn = document.querySelector("button.btn.btn-outline-secondary[value='continua']");
            if(backBtn){ backBtn.click(); activity(); } else { window.location.reload(); }
          }
          return;
        }

        logMessage("✅ Orario disponibile trovato, seleziono!");
        choices[0].click();
        const btn = document.querySelector("button.btn:nth-child(2)");
        if(btn) btn.click();
        beep();
        activity();
        clearInterval(dataInterval);
      },TIMEOUT);
    },3000);

  } else if(location.endsWith("/sceltaRitiro")){
    logMessage("📦 SCELTA RITIRO");
    setInterval(()=>{
      const btn = document.querySelector("button.btn:nth-child(2)");
      if(btn) btn.click();
      activity();
    }, TIMEOUT);
  }
}