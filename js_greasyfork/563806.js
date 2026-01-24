// ==UserScript==
// @name         Jimini Cricket Assistant
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Assistant Sharewood avec validation manuelle
// @match        https://www.sharewood.tv/shout
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/563806/Jimini%20Cricket%20Assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/563806/Jimini%20Cricket%20Assistant.meta.js
// ==/UserScript==

(function() {
    'use strict';

/************************************
 * BLOC A — UI (panneau + styles)
 ************************************/

const USERNAME_TO_IGNORE = "frombxwithlove";

const panel = document.createElement("div");
panel.id = "jc-panel";
panel.innerHTML = `
    <div id="jc-header">
        <div id="jc-drag-zone"></div>
        <strong>Jimini Cricket</strong>
        <div id="jc-status">
            <span id="jc-read-status" class="jc-green">Lecture ON</span>
            <span id="jc-backend-status" class="jc-red">Backend OFF</span>
        </div>
    </div>

    <div id="jc-body">
        <div id="jc-stats">
            <span>Nouveaux : <strong id="jc-count-detected">0</strong></span>
        </div>

        <hr>

        <div id="jc-tabs">
            <button id="jc-tab-candidates" class="active">Candidats</button>
            <button id="jc-tab-ignored">Ignorés</button>
            <button id="jc-tab-archived">Archives</button>
        </div>

        <div id="jc-queue"></div>

        <hr>

        <div id="jc-ai-response"></div>

        <div id="jc-actions" style="display:none;">
            <button id="jc-insert">Insérer la réponse</button>
            <button id="jc-cancel">Annuler</button>
        </div>
    </div>
`;
document.body.appendChild(panel);
jcInjectManualPopup();

// Déplacement
let dragging = false, offsetX = 0, offsetY = 0;
document.getElementById("jc-drag-zone").addEventListener("mousedown", e => {
    dragging = true;
    offsetX = e.clientX - panel.offsetLeft;
    offsetY = e.clientY - panel.offsetTop;
    e.preventDefault();
});

document.addEventListener("mousemove", e => {
    if (!dragging) return;
    panel.style.left = (e.clientX - offsetX) + "px";
    panel.style.top  = (e.clientY - offsetY) + "px";
});

document.addEventListener("mouseup", () => {
    dragging = false;
    resizing = false;
});

// Redimensionnement du panneau
const resizeHandle = document.createElement("div");
resizeHandle.id = "jc-resize-handle";
panel.appendChild(resizeHandle);

let resizing = false, startX = 0, startY = 0, startW = 0, startH = 0;

resizeHandle.addEventListener("mousedown", e => {
    resizing = true;
    startX = e.clientX;
    startY = e.clientY;
    startW = panel.offsetWidth;
    startH = panel.offsetHeight;
    e.preventDefault();
});

document.addEventListener("mousemove", e => {
    if (!resizing) return;
    const newW = Math.max(260, startW + (e.clientX - startX));

    const maxH = window.innerHeight - 40;
    const rawH = startH + (e.clientY - startY);
    const newH = Math.min(maxH, Math.max(200, rawH));

    panel.style.width = newW + "px";
    panel.style.height = newH + "px";
});

document.addEventListener("mouseup", () => resizing = false);

function jcInjectManualPopup() {
  // Éviter les doublons si jamais la fonction est appelée plusieurs fois
  if (document.getElementById("jc-manual-overlay")) return;

  const overlay = document.createElement("div");
  overlay.id = "jc-manual-overlay";
  overlay.innerHTML = `
    <div id="jc-manual-backdrop"></div>
    <div id="jc-manual-modal">
      <div id="jc-manual-header">
        <div id="jc-manual-meta">
          <span id="jc-manual-user"></span>
          <span id="jc-manual-timestamp"></span>
        </div>
        <div id="jc-manual-close" title="Fermer">✕</div>
      </div>
      <div id="jc-manual-original">
        <div id="jc-manual-original-label">Message original :</div>
        <div id="jc-manual-original-text"></div>
      </div>
      <div id="jc-manual-input-block">
        <label for="jc-manual-textarea">Réponse manuelle :</label>
        <textarea id="jc-manual-textarea" rows="6" placeholder="Saisis ici la réponse que Jimini proposera..."></textarea>
      </div>
      <div id="jc-manual-actions">
        <button id="jc-manual-cancel">Annuler</button>
        <button id="jc-manual-insert">Insérer</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  // CSS isolé
  const style = document.createElement("style");
  style.textContent = `
    #jc-manual-overlay {
      position: fixed;
      inset: 0;
      display: none;
      align-items: center;
      justify-content: center;
      z-index: 999999;
    }

    #jc-manual-backdrop {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.55);
      backdrop-filter: blur(4px);
    }

    #jc-manual-modal {
      position: relative;
      z-index: 1;
      max-width: 640px;
      width: 90%;
      background: #1e1e24;
      color: #f5f5f5;
      border-radius: 10px;
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.6);
      padding: 16px 18px 14px;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    #jc-manual-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 4px;
    }

    #jc-manual-meta {
      display: flex;
      flex-direction: column;
      font-size: 12px;
      opacity: 0.85;
    }

    #jc-manual-user {
      font-weight: 600;
    }

    #jc-manual-timestamp {
      font-size: 11px;
      opacity: 0.8;
    }

    #jc-manual-close {
      cursor: pointer;
      font-size: 16px;
      opacity: 0.7;
      transition: opacity 0.15s ease;
    }

    #jc-manual-close:hover {
      opacity: 1;
    }

    #jc-manual-original {
      background: #262633;
      border-radius: 6px;
      padding: 8px 10px;
      font-size: 12px;
    }

    #jc-manual-original-label {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      opacity: 0.7;
      margin-bottom: 4px;
    }

    #jc-manual-original-text {
      white-space: pre-wrap;
      word-wrap: break-word;
    }

    #jc-manual-input-block {
      display: flex;
      flex-direction: column;
      gap: 4px;
      margin-top: 6px;
    }

    #jc-manual-input-block label {
      font-size: 12px;
      opacity: 0.85;
    }

    #jc-manual-textarea {
      width: 100%;
      resize: vertical;
      min-height: 90px;
      max-height: 260px;
      border-radius: 6px;
      border: 1px solid #3a3a4a;
      background: #15151c;
      color: #f5f5f5;
      padding: 8px;
      font-size: 13px;
      font-family: inherit;
      outline: none;
      box-sizing: border-box;
    }

    #jc-manual-textarea:focus {
      border-color: #4f8cff;
      box-shadow: 0 0 0 1px rgba(79, 140, 255, 0.4);
    }

    #jc-manual-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 8px;
    }

    #jc-manual-actions button {
      border-radius: 6px;
      border: none;
      padding: 6px 12px;
      font-size: 13px;
      cursor: pointer;
      font-family: inherit;
      transition: background 0.15s ease, transform 0.05s ease;
    }

    #jc-manual-cancel {
      background: #3a3a4a;
      color: #f5f5f5;
    }

    #jc-manual-cancel:hover {
      background: #4a4a5c;
    }

    #jc-manual-insert {
      background: #4f8cff;
      color: #ffffff;
    }

    #jc-manual-insert:hover {
      background: #3f78e0;
    }

    #jc-manual-actions button:active {
      transform: translateY(1px);
    }
  `;
  document.head.appendChild(style);
}

let jcManualCurrentItem = null;
let jcManualOnConfirm = null;

function jcCloseManualPopup() {
  const overlay = document.getElementById("jc-manual-overlay");
  if (!overlay) return;

  overlay.style.display = "none";
  jcManualCurrentItem = null;
  jcManualOnConfirm = null;

  const textarea = document.getElementById("jc-manual-textarea");
  if (textarea) textarea.value = "";
}

function jcOpenManualPopup(item, onConfirm) {
  jcManualCurrentItem = item || null;
  jcManualOnConfirm = typeof onConfirm === "function" ? onConfirm : null;

  const overlay = document.getElementById("jc-manual-overlay");
  if (!overlay) return;

  const userEl = document.getElementById("jc-manual-user");
  const tsEl = document.getElementById("jc-manual-timestamp");
  const msgEl = document.getElementById("jc-manual-original-text");
  const textarea = document.getElementById("jc-manual-textarea");
  const btnCancel = document.getElementById("jc-manual-cancel");
  const btnInsert = document.getElementById("jc-manual-insert");
  const btnClose = document.getElementById("jc-manual-close");

  if (userEl) userEl.textContent = item?.author || "Utilisateur inconnu";
  if (tsEl) tsEl.textContent = item?.addedLabel || "";
  if (msgEl) msgEl.textContent = item?.message || "";
  if (textarea) textarea.value = "";

  // Nettoyage des anciens listeners (au cas où)
  btnCancel?.replaceWith(btnCancel.cloneNode(true));
  btnInsert?.replaceWith(btnInsert.cloneNode(true));
  btnClose?.replaceWith(btnClose.cloneNode(true));

  const newCancel = document.getElementById("jc-manual-cancel");
  const newInsert = document.getElementById("jc-manual-insert");
  const newClose = document.getElementById("jc-manual-close");

  newCancel?.addEventListener("click", () => {
    jcCloseManualPopup(); // Annuler = aucune action backend
  });

  newClose?.addEventListener("click", () => {
    jcCloseManualPopup();
  });

  newInsert?.addEventListener("click", () => {
    const value = textarea ? textarea.value.trim() : "";
    if (!value) {
      // On pourrait afficher un petit message plus tard, pour l'instant on refuse silencieusement
      return;
    }

    // Ici, on ne fait RIEN directement côté backend.
    // On délègue à onConfirm, qui sera défini dans handleManualAnswer.
    if (jcManualOnConfirm) {
      jcManualOnConfirm(value, jcManualCurrentItem);
    }

    jcCloseManualPopup();
  });

  overlay.style.display = "flex";
}

// Styles
const style = document.createElement("style");
style.textContent = `
#jc-panel {
    position: fixed;
    top: 20px;
    right: 20px;
    width: 320px;
    background: #1e1e1e;
    color: white;
    border-radius: 10px;
    box-shadow: 0 0 12px rgba(0,0,0,0.4);
    z-index: 999999;
    font-family: Arial;
    display: flex;
    flex-direction: column;
    height: auto;
    max-height: 80vh;      /* ✅ limite à 80% de la hauteur écran */
    overflow: hidden;      /* ✅ rien ne déborde du panneau */
}
#jc-header {
    padding: 6px 10px;
    background: #2c2c2c;
    cursor: move;
    pointer-events: auto;
    border-radius: 10px 10px 0 0;
    display: flex;
    position: relative;
    justify-content: space-between;
    align-items: center;
    z-index: 30;
}
#jc-drag-zone {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    cursor: move;
    z-index: 50; /* au-dessus de tout le contenu du header */
    pointer-events: auto!important;
}
#jc-header * {
    pointer-events: none;
}
#jc-header strong {
    font-size: 14px;
}
#jc-stats {
    font-size: 12px;
    display: flex;
    align-items: center;
}
#jc-stats span strong {
    color: #2ecc40;
}
#jc-status span {
    font-size: 11px;
    margin-left: 6px;
}
#jc-ai-response {
    margin-top: 10px;
    padding: 8px;
    background: #333;
    border-radius: 6px;
    white-space: pre-wrap;
}
#jc-actions button {
    margin-right: 8px;
    margin-top: 10px;
}
#jc-stats div { font-size: 12px; margin-bottom: 2px; }
#jc-body {
    padding: 6px 10px;
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: hidden;
}
#jc-body hr {
    margin: 6px 0;
}
#jc-queue {
    flex: 1;
    overflow-y: auto;
    min-height: 60px;
    max-height: 100%; /* empêche de dépasser */
    margin-top: 6px;
}
#jc-resize-handle {
    z-index: 20;
    pointer-events: auto;
}
.jc-queue-item {
    background: #242424;
    border-left: 3px solid #444;
    padding: 6px 8px;
    font-size: 11px;
}

.jc-queue-item:hover { background: #3a3a3a; }
#jc-resize-handle {
    position: absolute;
    width: 14px;
    height: 14px;
    right: 4px;
    bottom: 4px;
    cursor: se-resize;
    background: linear-gradient(135deg, transparent 0%, transparent 50%, #666 50%, #666 100%);
    border-radius: 2px;
}
.jc-insert-btn {
    background: #2ecc40;
    border: none;
    padding: 4px 8px;
    border-radius: 4px;
    color: white;
    cursor: pointer;
    margin-right: 4px;
}
.jc-insert-btn:hover {
    background: #3ee652;
}

.jc-ignore-btn {
    background: #e74c3c;
    border: none;
    padding: 2px 6px;     /* 🔥 réduit pour harmoniser avec 👍 👎 ✏️ */
    border-radius: 4px;
    color: white;
    cursor: pointer;
    font-size: 12px;      /* 🔥 même taille que les autres boutons */
    margin-right: 4px;    /* 🔥 cohérence visuelle */
}
.jc-ignore-btn:hover {
    background: #ff6b5a;
}
.jc-good-btn,
.jc-bad-btn,
.jc-manual-btn {
    background: #444;
    border: none;
    padding: 2px 4px;
    border-radius: 4px;
    color: white;
    cursor: pointer;
    font-size: 12px;
    margin-right: 4px;
}

.jc-good-btn { background: #2ecc40; }
.jc-good-btn:hover { background: #3ee652; }

.jc-bad-btn { background: #e67e22; }
.jc-bad-btn:hover { background: #ff9f43; }

.jc-manual-btn { background: #3498db; }
.jc-manual-btn:hover { background: #5dade2; }

.jc-learning-actions {
    margin-top: 4px;
    display: flex;
    flex-direction: row;
    gap: 4px;              /* espace entre les boutons */
    align-items: center;
}
.jc-reclass-btn {
    background: #3498db;        /* bleu Sharewood */
    border: none;
    width: 22px;                /* taille fixe */
    height: 22px;
    border-radius: 4px;
    color: white;
    cursor: pointer;
    font-size: 13px;            /* lisible mais compact */
    line-height: 22px;          /* centre le symbole */
    text-align: center;
    padding: 0;

    position: absolute;
    right: 6px;
    top: 50%;
    transform: translateY(-50%);
}

.jc-reclass-btn:hover {
    background: #5dade2;        /* bleu clair au survol */
}
.jc-queue-item {
    background: #242424;
    border-left: 3px solid #444;
    padding: 6px 48px 6px 8px;
    font-size: 11px;
    position: relative;
}

.jc-reply {
    background: #333;
    padding: 6px;
    margin-top: 4px;
    border-radius: 4px;
    border-left: 3px solid #2ecc40;
}

.jc-reply-pending {
    background: #2a2a2a;
    padding: 6px;
    margin-top: 4px;
    border-radius: 4px;
    border-left: 3px solid #888;
}
.jc-ignored-script {
    background: #202020;      /* très proche du fond, discret */
    border-left-color: #555;
}

.jc-ignored-user {
    background: #2a1f1f;      /* léger ton rouge/brun, sans agresser */
    border-left-color: #e74c3c;
}
/* Scrollbar custom pour la file d'attente */
#jc-queue::-webkit-scrollbar {
    width: 6px;
}

#jc-queue::-webkit-scrollbar-track {
    background: #1e1e1e;
}

#jc-queue::-webkit-scrollbar-thumb {
    background: #555;
    border-radius: 3px;
}

#jc-queue::-webkit-scrollbar-thumb:hover {
    background: #777;
}

/* Firefox */
#jc-queue {
    scrollbar-width: thin;
    scrollbar-color: #555 #1e1e1e;
}
#jc-tabs {
    display: flex;
    gap: 6px;
    margin-bottom: 6px;
}

#jc-tabs button {
    flex: 1;
    padding: 4px;
    background: #333;
    border: none;
    border-radius: 4px;
    color: white;
    cursor: pointer;
    font-size: 11px;
}

#jc-tabs button.active {
    background: #2ecc40;
}
.jc-green { color: #4caf50; }
.jc-red { color: #f44336; }
`;
document.head.appendChild(style);

/************************************
 * BLOC B — Lecture & détection (large)
 ************************************/

let reading = true;
let backendConnected = false;

const readStatus = document.getElementById("jc-read-status");
const backendStatus = document.getElementById("jc-backend-status");

const countDetectedSpan = document.getElementById("jc-count-detected");
const countCandidatesSpan = document.getElementById("jc-count-candidates");

let countDetected = 0;
let countCandidates = 0;
let lastProcessedDate = 0; // timestamp (ms) du dernier message traité

function incDetected() {
    countDetected++;
    countDetectedSpan.textContent = countDetected;
}
function incCandidates() {
    countCandidates++;
    if (countCandidatesSpan) {
        countCandidatesSpan.textContent = countCandidates;
    }
}

function setBackendStatus(ok) {
    backendConnected = ok;
    backendStatus.textContent = ok ? "Backend ON" : "Backend OFF";
    backendStatus.className = ok ? "jc-green" : "jc-red";
}

function setReadingStatus(ok) {
    reading = ok;
    readStatus.textContent = ok ? "Lecture ON" : "Lecture OFF";
    readStatus.className = ok ? "jc-green" : "jc-red";
}

// Détection large
const sharewoodKeywords = [
    "torrent","seed","ratio","freeleech","h&r","bonus","upload","download",
    "refusé","erreur","bloqué","clé api","tracker","port","qbittorrent","vpn",
    "avertissement","compte","problème","bug","souci","galère","impossible"
];

function cleanMessage(msg) {
    return msg
        .replace(/<[^>]+>/g, "")   // retire HTML
        .replace(/\s+/g, " ")      // normalise espaces
        .trim()
        .toLowerCase();
}

function jcRgbToHex(color) {
    if (!color || color.startsWith("#")) return color || "#6fa8dc";

    // On utilise un canvas pour normaliser la couleur en hex
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return "#6fa8dc";

    ctx.fillStyle = color;
    return ctx.fillStyle || "#6fa8dc";
}

function jcBuildUserMentionBBCode(username) {
    if (!username) return "";

    // On cherche le dernier message de cet utilisateur dans la shoutbox
    const nodes = [...document.querySelectorAll(".messages ul.list-group li.sent")];
    const match = nodes.reverse().find(n => {
        const name = n.querySelector(".badge-user a")?.textContent?.trim();
        return name && name.toLowerCase() === username.toLowerCase();
    });

    let color = "#6fa8dc"; // fallback
    if (match) {
        const link = match.querySelector(".badge-user a");
        if (link) {
            const cssColor = getComputedStyle(link).color;
            color = jcRgbToHex(cssColor);
        }
    }

    return `[color=${color}]@${username} [/color] `;
}

function jcInsertIntoShoutbox(text) {
    // 1. Essayer via WysiBB (méthode propre)
    const $txt = window.$ ? window.$("#chat-message") : null;
    if ($txt && $txt.data("wbb")) {
        const wbb = $txt.data("wbb");
        wbb.insertAtCursor(text);
        wbb.sync();
        return;
    }

    // 2. Fallback : textarea brut (rarement utilisé)
    const textarea = document.querySelector("#shoutbox textarea, textarea[name='message']");
    if (textarea) {
        textarea.value = text;
    }
}

function isQuestionLikely(msg) {
    const lower = cleanMessage(msg);

    // 1. Vrai point d'interrogation → on garde
    if (lower.includes("?")) return true;

    // 2. Mots-clés "techniques" (déjà en place)
    if (sharewoodKeywords.some(k => lower.includes(k))) return true;

    // 3. Expressions de galère, avec tolérance aux fautes courantes
    const patterns = [
        "ça marche pas",
        "ca marche pas",
        "ne fonctionne pas",
        "fonctionne pas",
        "je comprends pas",
        "je comprend pas",
        "bizarre",
        "refusé",
        "refuse",
        "impossible",
        "erreur",
        "bloqué",
        "bloque",
        "problème",
        "probleme",
        "souci",
        "bug"
    ];
    if (patterns.some(p => lower.includes(p))) return true;

    // 4. Heuristique simple : message un peu long + mention d'un autre pseudo
    //    → souvent une explication ou une demande
    if (lower.length > 80 && lower.includes("@")) return true;

    return false;
}

const seen = new Set();

/************************************
 * BLOC — Store persistant (localStorage)
 ************************************/
const JC_STORE_KEY = "jc_message_store_v1";

// TTL des messages dans le store : 7 jours
const JC_TTL_MS = 7 * 24 * 60 * 60 * 1000;

// Génère une clé unique pour chaque message
function jcBuildKey(author, message) {
    return (author || "").trim() + "::" + (message || "").trim();
}

// Chargement du store
let jcStore = {};
try {
    const raw = localStorage.getItem(JC_STORE_KEY);
    if (raw) {
        jcStore = JSON.parse(raw);
    }
} catch (e) {
    console.error("JC store load error:", e);
    jcStore = {};
}

jcPurgeStore();

function jcPurgeStore() {
    const now = Date.now();
    let changed = false;

    for (const key in jcStore) {
        const rec = jcStore[key];
        if (!rec) {
            delete jcStore[key];
            changed = true;
            continue;
        }

        const addedAt = typeof rec.addedAt === "number" ? rec.addedAt : null;
        if (!addedAt) continue; // pas de date => on garde (compatibilité ancienne)

        if (now - addedAt > JC_TTL_MS) {
            // Trop vieux → on supprime
            delete jcStore[key];
            changed = true;
        }
    }

    if (changed) {
        try {
            localStorage.setItem(JC_STORE_KEY, JSON.stringify(jcStore));
        } catch (e) {
            console.error("JC store purge save error:", e);
        }
    }
}

// Sauvegarde du store
function jcSaveStore() {
    try {
        localStorage.setItem(JC_STORE_KEY, JSON.stringify(jcStore));
    } catch (e) {
        console.error("JC store save error:", e);
    }
}

function processMessage(pseudo, message, ts) {
    if (!reading) return;
    if (!pseudo || !message) return;
    if (pseudo.toLowerCase() === USERNAME_TO_IGNORE) return;

    const key = pseudo + "::" + message;
    if (seen.has(key)) return;
    seen.add(key);

    incDetected();

    // 🔥 si le script juge que ce n'est pas une question → on l'envoie dans "ignorés" (script)
    if (!isQuestionLikely(message)) {
        addIgnored(pseudo, message, ts, "script");
        return;
    }

    incCandidates();

    const id = addCandidate(pseudo, message, ts);
    sendToBackend(pseudo, message, id);
}

// Scan initial large
function scanExistingMessages() {
    const items = [...document.querySelectorAll(".messages ul.list-group li.sent")];

    // 1. Prendre les 20 derniers messages
    const last20 = items.slice(-20);

    const now = Date.now();
    const ONE_HOUR = 60 * 60 * 1000;

    // 2. Garder ceux de moins d'une heure
    let recent = last20.filter(node => {
        const ts = extractTimestamp(node);
        if (!ts || !ts.date) return false;
        return now - ts.date.getTime() <= ONE_HOUR;
    });

    // 3. Si aucun message récent → prendre les 20 derniers
    if (recent.length === 0) {
        recent = last20;
    }

    // 4. Si moins de 20 messages récents → compléter avec les plus anciens des 20
    if (recent.length < 20) {
        const missing = 20 - recent.length;
        const older = last20
            .filter(n => !recent.includes(n))
            .slice(0, missing);
        recent = recent.concat(older);
    }

    // 5. Trier par date réelle (du plus ancien au plus récent)
    const selected = [...recent];
    selected.sort((a, b) => {
        const ta = extractTimestamp(a)?.date?.getTime() || 0;
        const tb = extractTimestamp(b)?.date?.getTime() || 0;
        return ta - tb;
    });

    // 6. Traiter les messages sélectionnés dans l'ordre chronologique
    selected.forEach(node => {
        const pseudo = node.querySelector(".badge-user a")?.textContent?.trim();
        const msg = node.querySelector(".messages-container .align-left")?.textContent?.trim();
        const ts = extractTimestamp(node);
        if (pseudo && msg && ts) processMessage(pseudo, msg, ts);
    });

}

// Observer large sur tout le body (comme avant)
function setupObserver() {
    // On cherche le UL réel contenant les messages
    const target = document.querySelector("div.messages");

    if (!target) {
        console.warn("Shoutbox introuvable, nouvelle tentative...");
        return setTimeout(setupObserver, 500); // on retente jusqu'à ce que Vue ait monté le DOM
    }

    console.log("Observer connecté à la shoutbox.");

    const observer = new MutationObserver(mutations => {
        const relevant = mutations.some(m =>
            [...m.addedNodes].some(n => n.nodeType === 1 && n.matches("li.sent"))
        );

        if (relevant) {
            rescanLastMessages();
        }
    });

    observer.observe(target, {
        childList: true,
        subtree: true
    });
}

// Réattacher automatiquement l'observer si Sharewood remplace le DOM
const rootObserver = new MutationObserver(() => {
    const newTarget = document.querySelector("div.messages");
    if (newTarget && !newTarget.__jcObserverAttached) {
        setupObserver();
        newTarget.__jcObserverAttached = true;
    }
});

rootObserver.observe(document.body, { childList: true, subtree: true });

function extractTimestamp(node) {
    const timeNode = node.querySelector(".text-muted");
    if (!timeNode) return null;

    const rawText = timeNode.textContent.trim(); // texte brut "il y a 1h", etc.

    // Nettoyage agressif du texte
    let txt = rawText
        .replace(/\s+/g, " ")        // remplace tous les espaces multiples par un seul
        .replace(/\u00A0/g, " ")     // remplace les espaces insécables
        .trim()
        .toLowerCase();

    const now = Date.now();

    // quelques secondes
    if (txt.includes("quelques secondes")) {
        return { date: new Date(now - 10 * 1000), label: rawText };
    }

    // 🔥 cas "une minute"
    if (txt.includes("il y a une minute")) {
        return { date: new Date(now - 1 * 60 * 1000), label: rawText };
    }

    // minutes (2, 3, 10, 38 minutes, etc.)
    let m = txt.match(/il y a (\d+)\s*minute/);
    if (m) {
        const minutes = parseInt(m[1], 10);
        return { date: new Date(now - minutes * 60 * 1000), label: rawText };
    }

    // 🔥 cas "une heure"
    if (txt.includes("il y a une heure")) {
        return { date: new Date(now - 1 * 60 * 60 * 1000), label: rawText };
    }

    // heures (2, 3, 4 heures, etc.)
    let h = txt.match(/il y a (\d+)\s*heure/);
    if (h) {
        const hours = parseInt(h[1], 10);
        return { date: new Date(now - hours * 60 * 60 * 1000), label: rawText };
    }

    // jours
    let d = txt.match(/il y a (\d+)\s*jour/);
    if (d) {
        const days = parseInt(d[1], 10);
        return { date: new Date(now - days * 24 * 60 * 60 * 1000), label: rawText };
    }

    return { date: null, label: rawText };
}

function rescanLastMessages() {
    const items = [...document.querySelectorAll(".messages ul.list-group li.sent")];

    // 1. Prendre les 20 derniers messages
    const last20 = items.slice(-20);

    const now = Date.now();
    const ONE_HOUR = 60 * 60 * 1000;

    // 2. Filtrer ceux de moins d'une heure
    let recent = last20.filter(node => {
        const ts = extractTimestamp(node);
        if (!ts || !ts.date) return false;
        return now - ts.date.getTime() <= ONE_HOUR;
    });

    // 3. Ne garder que les messages strictement plus récents
    recent = recent.filter(node => {
        const ts = extractTimestamp(node);
        if (!ts || !ts.date) return false;
        return ts.date.getTime() > lastProcessedDate;
    });

    // 4. Trier par date réelle (du plus ancien au plus récent)
    const selected = [...recent];
    selected.sort((a, b) => {
        const ta = extractTimestamp(a)?.date?.getTime() || 0;
        const tb = extractTimestamp(b)?.date?.getTime() || 0;
        return ta - tb;
    });

    // 5. Traiter les messages sélectionnés dans l'ordre chronologique
    selected.forEach(node => {
        const pseudo = node.querySelector(".badge-user a")?.textContent?.trim();
        const msg = node.querySelector(".messages-container .align-left")?.textContent?.trim();
        const ts = extractTimestamp(node);
        if (pseudo && msg && ts) processMessage(pseudo, msg, ts);
    });
}

setTimeout(() => {
    scanExistingMessages();
    setupObserver();
}, 1000);

/************************************
 * BLOC C — Communication backend
 ************************************/

async function sendToBackend(author, message, id) {
    try {
        const res = await fetch("http://localhost:3000/shout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ author, message, timestamp: Date.now() })
        });

        const data = await res.json();
        setBackendStatus(true);

        attachReplyToCandidate(id, data.reply);

        // 🔥 Persistance : marquer comme "answered" dans jcStore
        const item = queue.find(q => q.id === id);
        if (item) {
            const key = jcBuildKey(item.author, item.message);
            const existing = jcStore[key] || {};
            jcStore[key] = {
                ...existing,
                author: item.author,
                message: item.message,
                addedAt: item.addedAt instanceof Date ? item.addedAt.getTime() : Date.now(),
                addedLabel: item.addedLabel || "",
                status: "answered",
                reply: data.reply,
                usedReply: existing.usedReply || null,
                feedbackType: existing.feedbackType || null,
                ignoredBy: null
            };
            jcSaveStore();
        }

    } catch (err) {
        console.error("Backend error:", err);
        setBackendStatus(false);
    }
}

async function sendLearningFeedback(payload) {
    try {
        const res = await fetch("http://localhost:3000/feedback/manual", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        const data = await res.json();
        console.log("Learning feedback OK:", data);
        setBackendStatus(true);
    } catch (err) {
        console.error("Learning feedback error:", err);
        setBackendStatus(false);
    }
}

function archiveItem(item) {
    item.ignoredBy = null;
    archived.push(item);
    queue = queue.filter(q => q.id !== item.id);
    ignored = ignored.filter(q => q.id !== item.id);
    renderQueue();

    // 🔥 Persistance : marquer comme "archived"
    const key = jcBuildKey(item.author, item.message);
    const existing = jcStore[key] || {};
    jcStore[key] = {
        ...existing,
        author: item.author,
        message: item.message,
        addedAt: item.addedAt instanceof Date ? item.addedAt.getTime() : Date.now(),
        addedLabel: item.addedLabel || "",
        status: "archived",
        reply: item.reply || existing.reply || null,
        usedReply: item.usedReply || existing.usedReply || null,
        feedbackType: item.feedbackType || existing.feedbackType || null,
        ignoredBy: null
    };
    jcSaveStore();
}

function handleGoodAnswer(item) {
    // 1. Insérer la réponse dans la shoutbox
    const textarea = document.querySelector("#shoutbox textarea, textarea[name='message']");
    if (textarea) {
        let finalText = item.reply || "";

        try {
            const mention = jcBuildUserMentionBBCode(item.author);
            if (mention) {
                finalText = mention + finalText;
            }
        } catch (e) {
            console.error("Erreur lors de la construction de la mention @Pseudo :", e);
            // En cas d'erreur, on continue quand même avec la réponse seule
        }

        jcInsertIntoShoutbox(finalText);
    }

    // 2. Enregistrer la réponse utilisée
    item.usedReply = item.reply;
    item.feedbackType = "good";

    // 3. Envoyer le feedback au backend
    const payload = {
        question: item.message,
        answer: item.reply,
        feedbackType: "good"
    };

    sendLearningFeedback(payload);

    // 4. Archiver le message
    archiveItem(item);
}

function handleBadAnswer(item) {
    const corrected = prompt("Corrige la réponse :", item.reply || "");
    if (!corrected) return;

    item.usedReply = corrected;
    item.feedbackType = "bad";

    const payload = {
        question: item.message,
        answer: corrected,
        feedbackType: "bad"
    };

    sendLearningFeedback(payload);
    archiveItem(item);
}

function handleManualAnswer(item) {
  jcOpenManualPopup(item, (manualText, originalItem) => {
    // Insérer @Pseudo + réponse dans la shoutbox
    const textarea = document.querySelector("#shoutbox textarea, textarea[name='message']");
    if (textarea) {
        let finalText = manualText;

        try {
            const mention = jcBuildUserMentionBBCode(originalItem.author);
            if (mention) {
                finalText = mention + finalText;
            }
        } catch (e) {
            console.error("Erreur lors de la construction de la mention @Pseudo (manuel) :", e);
        }

        jcInsertIntoShoutbox(finalText);
    }

    // Ce bloc est exécuté UNIQUEMENT si l’utilisateur clique sur "Insérer"
    originalItem.usedReply = manualText;
    originalItem.feedbackType = "manual";

    const payload = {
      question: originalItem.message,
      answer: manualText,
      feedbackType: "manual"
    };

    sendLearningFeedback(payload);
    archiveItem(originalItem);
  });
}

/************************************
 * BLOC D — File d'attente complète
 ************************************/

const aiRespDiv = document.getElementById("jc-ai-response");
const actionsDiv = document.getElementById("jc-actions");
const queueDiv = document.getElementById("jc-queue");

let queue = [];
let queueOrderCounter = 0; // ordre strict d'arrivée dans la file
let ignored = [];          // liste des messages ignorés
let currentTab = "candidates"; // "candidates" ou "ignored"
let archived = []; // 🔥 nouveaux messages archivés

// Gestion des onglets
const tabCandidates = document.getElementById("jc-tab-candidates");
const tabIgnored = document.getElementById("jc-tab-ignored");
const tabArchived = document.getElementById("jc-tab-archived");

/************************************
 * Reconstruction initiale depuis jcStore
 ************************************/

for (const key in jcStore) {
    const rec = jcStore[key];
    if (!rec || !rec.author || !rec.message) continue;

    const item = {
        id: Date.now() + Math.random(),
        author: rec.author,
        message: rec.message,
        reply: rec.reply || null,
        usedReply: rec.usedReply || null,
        feedbackType: rec.feedbackType || null,
        order: ++queueOrderCounter,
        addedAt: rec.addedAt ? new Date(rec.addedAt) : new Date(),
        addedLabel: rec.addedLabel || "",
        ignoredBy: rec.ignoredBy || null
    };

    // Marquer ce message comme déjà vu pour éviter re-traitement + re-backend
    const seenKey = jcBuildKey(item.author, item.message);
    seen.add(seenKey);

    // Mise à jour du lastProcessedDate
    if (item.addedAt instanceof Date) {
        const t = item.addedAt.getTime();
        if (t > lastProcessedDate) lastProcessedDate = t;
    }

    // Répartition dans les bons onglets
    if (rec.status === "archived") {
        archived.push(item);
    } else if (rec.status === "ignored") {
        ignored.push(item);
    } else if (rec.status === "candidate" || rec.status === "answered") {
        queue.push(item);
    }
}

// Affichage initial
renderQueue();

function addCandidate(author, message, ts) {
    const item = {
        id: Date.now() + Math.random(),
        author,
        message,
        reply: null,
        order: ++queueOrderCounter,
        addedAt: ts?.date || new Date(),
        addedLabel: ts?.label || "",
        ignoredBy: null, // pas ignoré au départ
        usedReply: null,
        feedbackType: null
    };

    if (item.addedAt instanceof Date) {
        const t = item.addedAt.getTime();
        if (t > lastProcessedDate) lastProcessedDate = t;
    }

    queue.push(item);

    // 🔥 Persistance : enregistrer le candidat dans jcStore
    const key = jcBuildKey(item.author, item.message);
    const existing = jcStore[key] || {};
    jcStore[key] = {
        ...existing,
        author: item.author,
        message: item.message,
        addedAt: item.addedAt instanceof Date ? item.addedAt.getTime() : Date.now(),
        addedLabel: item.addedLabel || "",
        status: "candidate",
        reply: existing.reply || null,
        usedReply: existing.usedReply || null,
        feedbackType: existing.feedbackType || null,
        ignoredBy: null
    };
    jcSaveStore();

    renderQueue();
    return item.id;
}

function addIgnored(author, message, ts, ignoredBy = "script") {
    const item = {
        id: Date.now() + Math.random(),
        author,
        message,
        reply: null,
        order: ++queueOrderCounter,
        addedAt: ts?.date || new Date(),
        addedLabel: ts?.label || "",
        ignoredBy // "script" ou "user"
    };

    ignored.push(item);

    // 🔥 Persistance : enregistrer comme ignoré
    const key = jcBuildKey(item.author, item.message);
    const existing = jcStore[key] || {};
    jcStore[key] = {
        ...existing,
        author: item.author,
        message: item.message,
        addedAt: item.addedAt instanceof Date ? item.addedAt.getTime() : Date.now(),
        addedLabel: item.addedLabel || "",
        status: "ignored",
        reply: existing.reply || null,
        usedReply: existing.usedReply || null,
        feedbackType: existing.feedbackType || null,
        ignoredBy
    };
    jcSaveStore();

    if (currentTab === "ignored") {
        renderQueue();
    }
}

function attachReplyToCandidate(id, reply) {
    const item = queue.find(i => i.id === id);
    if (!item) return;
    item.reply = reply;
    renderQueue();
}

function renderQueue() {
    queueDiv.innerHTML = "";
    updateTabCounters();

    // Tri strict par date réelle : du plus récent au plus ancien
    let source = queue;
    if (currentTab === "ignored") source = ignored;
    if (currentTab === "archived") source = archived;

    const sorted = [...source].sort((a, b) => {
        const ta = a.addedAt instanceof Date ? a.addedAt.getTime() : 0;
        const tb = b.addedAt instanceof Date ? b.addedAt.getTime() : 0;
        return tb - ta; // plus récent en haut
    });

    sorted.forEach(item => {
        const div = document.createElement("div");
        div.className = "jc-queue-item";

        if (item.ignoredBy === "script") {
            div.classList.add("jc-ignored-script");
        } else if (item.ignoredBy === "user") {
            div.classList.add("jc-ignored-user");
        }

        div.innerHTML = `
            <div style="font-size:11px; color:#aaa;">${item.addedLabel || ""}</div>
            <strong>${item.author}</strong> : ${item.message}
            ${currentTab === "candidates"
                ? (
                    item.reply
                        ? `<div class="jc-reply">${item.reply}</div>`
                        : `<div class="jc-reply-pending">⏳ En attente de réponse...</div>`
                )
                : currentTab === "archived" && (item.usedReply || item.reply)
                    ? `<div class="jc-reply">${item.usedReply || item.reply}</div>`
                    : ""
            }

            ${currentTab === "candidates" && item.reply ? `
                <div class="jc-learning-actions">
                    <button class="jc-good-btn">👍</button>
                    <button class="jc-bad-btn">👎</button>
                    <button class="jc-manual-btn">✏️</button>
                    <button class="jc-ignore-btn">🚫</button>
                </div>
            ` : ""}

            ${currentTab === "ignored" ? `
            <button class="jc-reclass-btn">↺</button>
            ` : ""}

            ${currentTab === "archived" ? `
            <button class="jc-reclass-btn">↺</button>
            ` : ""}
        `;

        // Bouton reclasser (onglet ignorés)
const reclassBtn = div.querySelector(".jc-reclass-btn");
if (reclassBtn && currentTab === "archived") {
    reclassBtn.onclick = () => {
        archived = archived.filter(i => i.id !== item.id);
        item.ignoredBy = null;
        queue.push(item);
        renderQueue();
    };
}
if (reclassBtn && currentTab === "ignored") {
    reclassBtn.onclick = () => {
        ignored = ignored.filter(i => i.id !== item.id);
        item.ignoredBy = null;
        queue.push(item);
        sendToBackend(item.author, item.message, item.id);
        renderQueue();
    };
}

// Boutons candidats (ignorer)
if (item.reply && currentTab === "candidates") {
    const ignoreBtn = div.querySelector(".jc-ignore-btn");

    if (ignoreBtn) {
        ignoreBtn.onclick = () => {
            item.ignoredBy = "user";
            ignored.push(item);
            queue = queue.filter(q => q.id !== item.id);
            renderQueue();

            // 🔥 Persistance : marquer comme "ignored" par l'utilisateur
            const key = jcBuildKey(item.author, item.message);
            const existing = jcStore[key] || {};
            jcStore[key] = {
                ...existing,
                author: item.author,
                message: item.message,
                addedAt: item.addedAt instanceof Date ? item.addedAt.getTime() : Date.now(),
                addedLabel: item.addedLabel || "",
                status: "ignored",
                reply: item.reply || existing.reply || null,
                usedReply: existing.usedReply || null,
                feedbackType: existing.feedbackType || null,
                ignoredBy: "user"
            };
            jcSaveStore();
        };
    }
}

const goodBtn = div.querySelector(".jc-good-btn");
const badBtn = div.querySelector(".jc-bad-btn");
const manualBtn = div.querySelector(".jc-manual-btn");

if (goodBtn) {
    goodBtn.onclick = () => {
        handleGoodAnswer(item);
    };
}

if (badBtn) {
    badBtn.onclick = () => {
        handleBadAnswer(item);
    };
}

if (manualBtn) {
    manualBtn.onclick = () => {
        handleManualAnswer(item);
    };
}

    if (goodBtn) {
        goodBtn.onclick = () => {
            handleGoodAnswer(item);
        };
    }

    if (badBtn) {
        badBtn.onclick = () => {
            handleBadAnswer(item);
        };
    }

    if (manualBtn) {
        manualBtn.onclick = () => {
            handleManualAnswer(item);
        };
    }
        queueDiv.appendChild(div);
    });
}

function updateTabCounters() {
    tabCandidates.innerHTML = `Candidats (${queue.length})`;
    tabIgnored.innerHTML = `Ignorés (${ignored.length})`;
    tabArchived.innerHTML = `Archives (${archived.length})`;
}

if (tabCandidates && tabIgnored) {
    tabCandidates.onclick = () => {
        currentTab = "candidates";
        tabCandidates.classList.add("active");
        tabIgnored.classList.remove("active");
        tabArchived.classList.remove("active");
        renderQueue();
    };

    tabIgnored.onclick = () => {
        currentTab = "ignored";
        tabCandidates.classList.remove("active");
        tabIgnored.classList.add("active");
        tabArchived.classList.remove("active");
        renderQueue();
    };
}
if (tabArchived) {
    tabArchived.onclick = () => {
        currentTab = "archived";
        tabCandidates.classList.remove("active");
        tabIgnored.classList.remove("active");
        tabArchived.classList.add("active");
        renderQueue();
    };
}

})()