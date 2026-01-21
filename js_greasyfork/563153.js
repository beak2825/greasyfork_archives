// ==UserScript==
// @name         MoDuL's: Restore OG Car Names
// @namespace    torn.restore.og.cars
// @version      1.2.9
// @description  Restores original car names from Torn fictional ones across Torn (Racing, Item Market, Items, Bazaar, Logs) including all descriptions/text. MoDuL's Race Filter & TornPDA Compatible.
// @author       MoDuL
// @license      MIT
//
// @match        https://www.torn.com/page.php*
// @match        https://torn.com/page.php*
// @match        https://www.torn.com/loader.php*
// @match        https://torn.com/loader.php*
// @match        https://www.torn.com/item.php*
// @match        https://torn.com/item.php*
// @match        https://www.torn.com/bazaar.php*
// @match        https://torn.com/bazaar.php*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563153/MoDuL%27s%3A%20Restore%20OG%20Car%20Names.user.js
// @updateURL https://update.greasyfork.org/scripts/563153/MoDuL%27s%3A%20Restore%20OG%20Car%20Names.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const SHOW_CONSOLE_NOTICE = true;
  if (SHOW_CONSOLE_NOTICE) {
    console.info("[Restore OG Car Names] Script injected.");
  }

  function getSidLower() {
    try {
      const url = new URL(location.href);
      const sid = (url.searchParams.get("sid") || "").trim();
      return sid.toLowerCase();
    } catch (_) {
      const m = location.href.match(/[?&]sid=([^&#]+)/i);
      return (m ? decodeURIComponent(m[1]) : "").trim().toLowerCase();
    }
  }

  function isTargetArea() {
    const path = location.pathname.toLowerCase();
    const sid = getSidLower();

    if (path.endsWith("/item.php") || path.endsWith("item.php")) return true;
    if (path.endsWith("/bazaar.php") || path.endsWith("bazaar.php")) return true;

    return sid === "racing" || sid === "itemmarket" || sid === "log";
  }
function isInsideRaceFilterUI(nodeOrEl) {
  const el = nodeOrEl?.nodeType === 1 ? nodeOrEl : nodeOrEl?.parentElement;
  return !!(el && el.closest && el.closest("#modulRF"));
}

  // -------------------- Mapping: Fictional -> Original --------------------
  const REPLACEMENTS = {
    "Yotsuhada EVX": "Mitsubishi Evo X",
    "Stålhög 860": "Volvo 850",
    "Stalhog 860": "Volvo 850",
    "Alpha Milano 156": "Alfa Romeo 156",
    "Bavaria X5": "BMW X5",
    "Coche Basurero": "Seat Leon Cupra",
    "Bedford Nova": "Vauxhall Astra GSI",
    "Verpestung Sport": "Volkswagen Golf GTI",
    "Echo S3": "Audi S3",
    "Volt RS": "Ford Focus RS",
    "Edomondo S2": "Honda S2",
    "Nano Cavalier": "Mini Cooper S",
    "Colina Tanprice": "Sierra Cosworth",
    "Cosmos EX": "Lotus Exige",
    "Bedford Racer": "Vauxhall Corsa",
    "Sturmfahrt 111": "Porsche 911 GT3",
    "Tsubasa Impressor": "Subaru Impreza STI",
    "Wington GGU": "TVR Sagaris",
    "Weston Marlin 177": "Aston Martin One-77",
    "Echo R8": "Audi R8",
    "Stormatti Casteon": "Bugatti Veyron",
    "Lolo 458": "Ferrari 458",
    "Lambrini Torobravo": "Lamborghini Gallardo",
    "Veloria LFA": "Lexus LFA",
    "Mercia SLR": "Mercedes SLR",
    "Zaibatsu GT-R": "Nissan GT-R",
    "Edomondo Localé": "Honda Civic",
    "Edomondo Locale": "Honda Civic",
    "Edomondo NSX": "Honda NSX",
    "Echo Quadrato": "Audi TT Quattro",
    "Bavaria M5": "BMW M5",
    "Bavaria Z8": "BMW Z8",
    "Chevalier CZ06": "Chevrolet Corvette Z06",
    "Dart Rampager": "Dodge Charger",
    "Knight Firebrand": "Pontiac Firebird",
    "Volt GT": "Ford GT",
    "Invader H3": "Hummer H3",
    "Echo S4": "Audi S4",
    "Edomondo IR": "Honda Integra R",
    "Edomondo ACD": "Honda Accord",
    "Tabata RM2": "Toyota MR2",
    "Verpestung Insecta": "Volkswagen Beetle",
    "Chevalier CVR": "Chevrolet Cavalier",
    "Volt MNG": "Ford Mustang",
    "Trident": "Reliant Robin",
    "Oceania SS": "Holden SS",
    "Limoen Saxon": "Citroen Saxo",
    "Nano Pioneer": "Classic Mini",
    "Vita Bravo": "Fiat Punto",
    "Zaibatsu Macro": "Nissan Micra",
    "Çagoutte 10-6": "Peugeot 106",
    "Cagoutte 10-6": "Peugeot 106",
    "Papani Colé": "Renault Clio",
    "Papani Cole": "Renault Clio"
  };

  // -------------------- Replacer engine --------------------
  const KEYS = Object.keys(REPLACEMENTS);
  const ESC = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const KEY_REGEX = new RegExp(
    KEYS.sort((a, b) => b.length - a.length).map(ESC).join("|"),
    "g"
  );

  function replaceInString(str) {
    if (!str) return str;
    KEY_REGEX.lastIndex = 0;
    if (!KEY_REGEX.test(str)) return str;
    KEY_REGEX.lastIndex = 0;
    return str.replace(KEY_REGEX, (m) => REPLACEMENTS[m] || m);
  }

  function shouldSkipTextNode(node) {
  const el = node && node.parentElement;
  if (!el) return false;

  // DO NOT rewrite MoDuL Race Filter UI
  if (isInsideRaceFilterUI(node)) return true;

  const tag = el.tagName;
  return (
    tag === "SCRIPT" ||
    tag === "STYLE" ||
    tag === "TEXTAREA" ||
    tag === "INPUT" ||
    tag === "CODE" ||
    tag === "PRE" ||
    tag === "NOSCRIPT"
  );
}


  // ==========================================================
  // Compatibility fix for Race Filter:
  // Keep the *fictional* name hidden in the Racing custom list.
  // ==========================================================
  function patchRacingCarNames(root) {
    // Only needed on racing pages
    if (getSidLower() !== "racing") return;

    const scope = root && root.querySelectorAll ? root : document;
    const nodes = scope.querySelectorAll(".custom-events-wrap .event-header li.car span.t-hide");

    for (const el of nodes) {
      // Avoid re-processing
      if (el.dataset.ogCarPatched === "1") continue;

      const raw = (el.textContent || "").trim();
      if (!raw) { el.dataset.ogCarPatched = "1"; continue; }

      // If it's not a fictional key, mark and skip
      if (!Object.prototype.hasOwnProperty.call(REPLACEMENTS, raw)) {
        el.dataset.ogCarPatched = "1";
        continue;
      }

      // Store fictional once (useful for future scripts)
      if (!el.dataset.ogCarName) el.dataset.ogCarName = raw;

      // Replace visible text with OG
      const og = REPLACEMENTS[raw] || raw;
      if (og !== raw) el.textContent = og;

      // Inject hidden fictional text so li.textContent still contains it
      // (display:none still appears in textContent)
      const next = el.nextElementSibling;
      const hasHidden = next && next.classList && next.classList.contains("ogcar-hidden");

      if (!hasHidden) {
        const hidden = document.createElement("span");
        hidden.className = "ogcar-hidden";
        hidden.style.display = "none";
        hidden.textContent = " " + raw; // space helps separation
        el.insertAdjacentElement("afterend", hidden);
      }

      el.dataset.ogCarPatched = "1";
    }
  }

  function replaceTextNodes(root) {
    if (!root) return;

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!node || !node.nodeValue) return NodeFilter.FILTER_REJECT;
        if (shouldSkipTextNode(node)) return NodeFilter.FILTER_REJECT;
        KEY_REGEX.lastIndex = 0;
        return KEY_REGEX.test(node.nodeValue)
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_REJECT;
      }
    });

    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);

    for (const n of nodes) {
      const before = n.nodeValue;
      const after = replaceInString(before);
      if (after !== before) n.nodeValue = after;
    }
  }

  function replaceAttributes(root) {
    if (!root) return;

    root.querySelectorAll("[title],[aria-label],img[alt]").forEach((el) => {
      if (isInsideRaceFilterUI(el)) return;
      if (el.hasAttribute("title")) {
        const v = el.getAttribute("title") || "";
        const n = replaceInString(v);
        if (n !== v) el.setAttribute("title", n);
      }
      if (el.hasAttribute("aria-label")) {
        const v = el.getAttribute("aria-label") || "";
        const n = replaceInString(v);
        if (n !== v) el.setAttribute("aria-label", n);
      }
      if (el.tagName === "IMG" && el.hasAttribute("alt")) {
        const v = el.getAttribute("alt") || "";
        const n = replaceInString(v);
        if (n !== v) el.setAttribute("alt", n);
      }
    });
  }

  function apply() {
    if (!isTargetArea()) return;

    // 1) Do the racing-list compatibility patch first (cheap + targeted)
    patchRacingCarNames(document);

    // 2) Then do the global replacements (text + attributes)
    replaceAttributes(document.body);
    replaceTextNodes(document.body);
  }

  // -------------------- Run Strategy --------------------
  apply();

  // Burst passes for SPA/React rendering
  let burst = 0;
  const burstTimer = setInterval(() => {
    burst++;
    apply();
    if (burst >= 14) clearInterval(burstTimer);
  }, 250);

  // Navigation changes (hash routing)
  window.addEventListener("hashchange", apply, { passive: true });
  window.addEventListener("popstate", apply, { passive: true });

  // Light debounced observer
  let queued = false;
  const DEBOUNCE_MS = 900;

  function scheduleApply() {
    if (!isTargetArea()) return;
    if (queued) return;
    queued = true;
    setTimeout(() => {
      queued = false;
      apply();
    }, DEBOUNCE_MS);
  }

  const obs = new MutationObserver((muts) => {
    for (const m of muts) {
      if (m.type === "childList" && m.addedNodes && m.addedNodes.length) {
        scheduleApply();
        return;
      }
      if (m.type === "characterData") {
        scheduleApply();
        return;
      }
    }
  });

  obs.observe(document.body, { subtree: true, childList: true, characterData: true });

  // -- EOF
})();
