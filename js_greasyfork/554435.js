// ==UserScript==
// @name         Global Text Remover (FR/EN)
// @name:fr      Masqueur global de texte (FR/EN)
// @namespace    https://example.com
// @version      3.4
// @description  Removes specified words/phrases from all sites (case-insensitive, persistent globally, bilingual UI).
// @description:fr  Script ChatGPT qui enlève des mots/phrases de tous les sites (ne respecte pas la casse, persiste).
// @match        *://*/*
// @license MIT
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/554435/Global%20Text%20Remover%20%28FREN%29.user.js
// @updateURL https://update.greasyfork.org/scripts/554435/Global%20Text%20Remover%20%28FREN%29.meta.js
// ==/UserScript==

(function() {
  "use strict";

  /** 🌐 Language auto-detect **/
  const lang = navigator.language.startsWith("fr") ? "fr" : "en";

  const T = {
    addPlaceholder: lang === "fr" ? "Mot ou phrase à supprimer" : "Word or phrase to remove",
    addButton: lang === "fr" ? "Ajouter" : "Add",
    panelTitle: lang === "fr" ? "Liste de mots masqués" : "Hidden words list",
    deleteTip: lang === "fr" ? "Supprimer ce mot" : "Delete this word"
  };

  const STORAGE_KEY = "masqueur_global_list";
  let filtres = GM_getValue(STORAGE_KEY, []);

  /** Utils **/
  const escapeRegex = s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const isIgnored = el => {
    if (!el) return true;
    if (el.closest("#masqueur-panel") || el.closest("#masqueur-toggle")) return true;
    const tag = el.tagName ? el.tagName.toLowerCase() : "";
    return ["input","textarea","select","script","style","noscript"].includes(tag);
  };

  /** Masquage **/
  function maskNodeText(node) {
    if (node.nodeType !== Node.TEXT_NODE) return;
    if (isIgnored(node.parentElement)) return;
    const txt = node.nodeValue;
    if (!txt || !txt.trim()) return;

    let newTxt = txt;
    for (const f of filtres) {
      if (!f) continue;
      const regex = new RegExp(escapeRegex(f), "gi");
      newTxt = newTxt.replace(regex, "");
    }
    if (newTxt !== txt) node.nodeValue = newTxt;
  }

  function maskAll(root = document.body) {
    if (!filtres.length || !root) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
    let n;
    while ((n = walker.nextNode())) maskNodeText(n);
  }

  /** Observer **/
  const observer = new MutationObserver(mutations => {
    for (const m of mutations) {
      for (const n of m.addedNodes) {
        if (n.nodeType === Node.TEXT_NODE) maskNodeText(n);
        else if (n.nodeType === Node.ELEMENT_NODE && !isIgnored(n))
          maskAll(n);
      }
    }
  });

  /** Interface **/
  // --- Bouton rond ---
  const toggle = document.createElement("div");
  toggle.id = "masqueur-toggle";
  toggle.textContent = "🕵️";
  Object.assign(toggle.style, {
    position: "fixed",
    bottom: "14px",
    left: "14px",
    width: "32px",
    height: "32px",
    lineHeight: "28px",
    textAlign: "center",
    background: "rgba(0,0,0,0.7)",
    color: "white",
    borderRadius: "50%",
    cursor: "pointer",
    zIndex: "999999999",
    fontSize: "18px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.4)",
    transition: "background 0.2s ease",
    userSelect: "none"
  });
  toggle.onmouseenter = () => (toggle.style.background = "rgba(0,0,0,0.9)");
  toggle.onmouseleave = () => (toggle.style.background = "rgba(0,0,0,0.7)");

  // --- Panneau ---
  const panel = document.createElement("div");
  panel.id = "masqueur-panel";
  Object.assign(panel.style, {
    position: "fixed",
    bottom: "60px",
    left: "10px",
    background: "rgba(0,0,0,0.85)",
    color: "#fff",
    padding: "10px",
    borderRadius: "10px",
    fontFamily: "sans-serif",
    zIndex: "999999998",
    width: "260px", // élargie un peu plus pour le champ texte
    boxShadow: "0 2px 6px rgba(0,0,0,0.35)",
    display: "none"
  });

  const title = document.createElement("div");
  title.textContent = T.panelTitle;
  Object.assign(title.style, {
    fontWeight: "bold",
    fontSize: "13px",
    marginBottom: "6px",
    textAlign: "center"
  });

  const input = document.createElement("input");
  Object.assign(input, {
    type: "text",
    placeholder: T.addPlaceholder
  });
  Object.assign(input.style, {
    width: "100%",
    padding: "6px",
    borderRadius: "4px",
    border: "none",
    marginBottom: "6px",
    fontSize: "12px",
    boxSizing: "border-box"
  });

  const addBtn = document.createElement("button");
  addBtn.textContent = T.addButton;
  Object.assign(addBtn.style, {
    width: "100%",
    padding: "6px",
    background: "#2e8b57",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "12px",
    marginBottom: "6px"
  });

  const list = document.createElement("ul");
  Object.assign(list.style, {
    listStyle: "none",
    padding: 0,
    margin: 0,
    maxHeight: "150px",
    overflowY: "auto",
    fontSize: "12px"
  });

  function renderList() {
    list.innerHTML = "";
    filtres.forEach((f, i) => {
      const li = document.createElement("li");
      Object.assign(li.style, {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "3px 0",
        borderBottom: "1px solid rgba(255,255,255,0.1)"
      });
      const span = document.createElement("span");
      span.textContent = f;
      const del = document.createElement("button");
      del.textContent = "✖";
      del.title = T.deleteTip;
      Object.assign(del.style, {
        background: "none",
        border: "none",
        color: "#ff6666",
        cursor: "pointer",
        fontSize: "12px"
      });
      del.onclick = () => {
        filtres.splice(i, 1);
        GM_setValue(STORAGE_KEY, filtres);
        maskAll();
        renderList();
      };
      li.appendChild(span);
      li.appendChild(del);
      list.appendChild(li);
    });
  }

  addBtn.onclick = () => {
    const val = input.value.trim();
    if (!val) return;
    if (!filtres.includes(val)) {
      filtres.push(val);
      GM_setValue(STORAGE_KEY, filtres);
      maskAll();
      renderList();
    }
    input.value = "";
  };

  toggle.onclick = () => {
    panel.style.display = panel.style.display === "none" ? "block" : "none";
  };

  panel.appendChild(title);
  panel.appendChild(input);
  panel.appendChild(addBtn);
  panel.appendChild(list);
  document.body.appendChild(panel);
  document.body.appendChild(toggle);

  /** Initialisation **/
  function init() {
    renderList();
    maskAll();
    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
