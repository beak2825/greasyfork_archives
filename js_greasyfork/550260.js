// ==UserScript==
// @name        lato citt scelta sede da menu con banner
// @namespace   Violentmonkey Scripts
// @match       https://www.prenotazionicie.interno.gov.it/cittadino/a/sc/wizardAppuntamentoCittadino*
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_registerMenuCommand
// @version     1.8
// @description Prenota in una delle sedi preimpostate selezionabili dal menu, con log e banner in pagina
// @downloadURL https://update.greasyfork.org/scripts/550260/lato%20citt%20scelta%20sede%20da%20menu%20con%20banner.user.js
// @updateURL https://update.greasyfork.org/scripts/550260/lato%20citt%20scelta%20sede%20da%20menu%20con%20banner.meta.js
// ==/UserScript==

const TIMEOUT = 2500;

// 🔹 Tutte le sedi disponibili
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

// 🔹 Recupera sede salvata o default
let TARGET_SEDE = GM_getValue("target_sede", SEDI[0]);

// 🔹 Crea menu per selezionare la sede
SEDI.forEach(sede => {
  GM_registerMenuCommand("Usa sede: " + sede, () => {
    GM_setValue("target_sede", sede);
    TARGET_SEDE = sede;
    alert("✅ Sede impostata: " + sede);
    updateBanner();
    location.reload();
  });
});

// 🔹 Aggiunge banner in alto a sinistra per mostrare la sede attuale
function createBanner() {
  const banner = document.createElement("div");
  banner.id = "sedeBanner";
  banner.style.position = "fixed";
  banner.style.top = "10px";
  banner.style.left = "10px";
  banner.style.zIndex = 9999;
  banner.style.backgroundColor = "#f0f0f0";
  banner.style.border = "1px solid #333";
  banner.style.padding = "5px 10px";
  banner.style.borderRadius = "5px";
  banner.style.fontFamily = "Arial, sans-serif";
  banner.style.fontSize = "14px";
  banner.style.color = "#000";
  banner.style.boxShadow = "1px 1px 5px rgba(0,0,0,0.3)";
  document.body.appendChild(banner);
  updateBanner();
}

function updateBanner() {
  const banner = document.getElementById("sedeBanner");
  if (banner) banner.textContent = "📌 Sede attuale: " + TARGET_SEDE;
}

// 🔹 Log iniziale
console.log("▶️ Script avviato - sede attuale:", TARGET_SEDE);

// 🔹 Creazione banner
createBanner();

(() => {
  let oldPushState = history.pushState;
  history.pushState = function pushState() {
    let ret = oldPushState.apply(this, arguments);
    window.dispatchEvent(new Event("pushstate"));
    window.dispatchEvent(new Event("locationchange"));
    return ret;
  };

  let oldReplaceState = history.replaceState;
  history.replaceState = function replaceState() {
    let ret = oldReplaceState.apply(this, arguments);
    window.dispatchEvent(new Event("replacestate"));
    window.dispatchEvent(new Event("locationchange"));
    return ret;
  };

  window.addEventListener("popstate", () => {
    window.dispatchEvent(new Event("locationchange"));
  });
})();

window.addEventListener("locationchange", () => _cieFlow());
_cieFlow();

function normalize(text) {
  return text.trim().toLowerCase().replace(/\s+/g, " ");
}

function _cieFlow() {
  const location = window.location.href.toString();
  console.log("🌍 Pagina caricata:", location);

  if (location.endsWith("/sceltaSede")) {
    console.log("🔎 Sto cercando la sede:", TARGET_SEDE);
    setInterval(() => {
      const rows = [...document.querySelectorAll("table tbody tr")];
      if (rows.length === 0) {
        console.log("⏳ Tabella sedi non ancora caricata...");
        return;
      }

      let found = false;

      for (const row of rows) {
        const sedeText = normalize(row.innerText);
        if (sedeText.includes(normalize(TARGET_SEDE))) {
          const radio = row.querySelector("input[type='radio']");
          if (radio) {
            console.log("✅ Sede trovata, seleziono:", TARGET_SEDE);
            radio.click();
            document.querySelector("button.btn:nth-child(2)").click();
            found = true;
          }
          break;
        }
      }

      if (!found) {
        console.log("❌ Sede NON trovata:", TARGET_SEDE, "→ ricarico pagina");
        window.location = window.location.href;
      }
    }, TIMEOUT);

  } else if (location.endsWith("/sceltaDataOra")) {
    console.log("📅 Scelta data e ora - attendo disponibilità...");
    setTimeout(() => {
      setInterval(() => {
        const timetable = document.querySelector("#timepicker");
        if (!timetable) {
          console.log("⌛ Orari non ancora caricati...");
          return;
        }

        const choices = [...document.querySelectorAll("#timepicker .available")];
        if (choices.length === 0) {
          console.log("🚫 Nessun orario disponibile al momento");
          return;
        }

        console.log("✅ Orario disponibile trovato, seleziono!");
        choices[0].click();
        document.querySelector("button.btn:nth-child(2)").click();
      }, TIMEOUT);
    }, 3000);

  } else if (location.endsWith("/sceltaRitiro")) {
    console.log("📦 Scelta ritiro - procedo...");
    setInterval(() => {
      document.querySelector("button.btn:nth-child(2)").click();
    }, TIMEOUT);
  }
}