// ==UserScript==
// @name         Toolbar (DRAGGABLE Version)
// @namespace    https://example.com/
// @version      1.2
// @description  Toolbar + dragabal + Position saving
// @author       ChatGPT&Jérôme
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_setClipboard
// @grant        window.focus
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/555918/Toolbar%20%28DRAGGABLE%20Version%29.user.js
// @updateURL https://update.greasyfork.org/scripts/555918/Toolbar%20%28DRAGGABLE%20Version%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // === CSS ===
  const style = document.createElement("style");
  style.textContent = `
  .vm-toolbar {
    position: fixed;
    bottom: 15px;
    right: 15px;
    display: flex;
    gap: 6px;
    padding: 8px;
    border-radius: 12px;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    font-family: sans-serif;
    font-size: 13px;
    z-index: 999999;
    backdrop-filter: blur(6px);
    cursor: move;            /* ← Zeigt: man kann ziehen */
    user-select: none;        /* ← Text lässt sich nicht markieren */
  }
  .vm-btn {
    background: rgba(255, 255, 255, 0.1);
    border: none;
    border-radius: 8px;
    padding: 5px 8px;
    color: white;
    cursor: pointer;
  }
  .vm-btn:hover { background: rgba(255, 255, 255, 0.2); }
  `;
  document.head.appendChild(style);

  // === Toolbar herstellen ===
  const bar = document.createElement("div");
  bar.className = "vm-toolbar";

  // Gespeicherte Position laden (falls vorhanden)
  bar.style.top = GM_getValue("vm_top", "");
  bar.style.left = GM_getValue("vm_left", "");
  if (bar.style.top || bar.style.left) {
    bar.style.bottom = "auto";
    bar.style.right = "auto";
  }

  // Buttons erstellen
  function makeBtn(text, onclick) {
    const btn = document.createElement("button");
    btn.textContent = text;
    btn.className = "vm-btn";
    btn.addEventListener("click", onclick);
    bar.appendChild(btn);
  }

  // === Buttons ===

  // 📋 Titel & URL kopieren
  makeBtn("📋 copy", () => {
    const text = `${document.title} — ${location.href}`;
    if (typeof GM_setClipboard === "function") GM_setClipboard(text);
    else if (navigator.clipboard) navigator.clipboard.writeText(text);
    else {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    alert("✅ Titel & URL copied!");
  });

  // ⬆️ Nach oben scrollen
  makeBtn("⬆️ up", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // 🔗 Externe Links highlighten
  let highlightOn = false;
  let highlightStyle = null;
  makeBtn("🔗 Highlight", () => {
    if (!highlightOn) {
      highlightStyle = document.createElement("style");
      highlightStyle.textContent = `
      a[href^="http"]:not([href*="${location.host}"]) {
        background: rgba(255,255,0,0.15);
        outline: 1px solid rgba(255,255,0,0.5);
      }`;
      document.head.appendChild(highlightStyle);
      highlightOn = true;
      alert("🔗 Extern Links marked");
    } else {
      highlightStyle?.remove();
      highlightOn = false;
    }
  });

  // 🗂 Sichtbare Links öffnen (max 10)
  makeBtn("🗂 open", () => {
    const links = Array.from(document.querySelectorAll('a[href^="http"]'))
      .filter(a => a.offsetParent !== null)
      .map(a => a.href);

    const unique = [...new Set(links)];
    const LIMIT = 10;

    if (unique.length === 0) {
      alert("no links found");
      return;
    }

    if (!confirm(`Es werden ${Math.min(unique.length, LIMIT)} Tabs geöffnet. Fortfahren?`)) return;

    unique.slice(0, LIMIT).forEach(url => window.open(url, "_blank"));
  });

  document.body.appendChild(bar);

  // === DRAGGABLE / Ziehen aktivieren ===
  let dragging = false;
  let offsetX = 0, offsetY = 0;

  bar.addEventListener("mousedown", (e) => {
    dragging = true;

    const rect = bar.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    // Animation aus
    bar.style.transition = "none";

    e.preventDefault();
  });

  document.addEventListener("mousemove", (e) => {
    if (dragging) {
      bar.style.top = `${e.clientY - offsetY}px`;
      bar.style.left = `${e.clientX - offsetX}px`;
      bar.style.bottom = "auto";
      bar.style.right = "auto";
    }
  });

  document.addEventListener("mouseup", () => {
    if (dragging) {
      dragging = false;

      // Position speichern
      GM_setValue("vm_top", bar.style.top);
      GM_setValue("vm_left", bar.style.left);

      // weiche Rück-Animation
      bar.style.transition = "0.1s ease";
    }
  });
})();
