// ==UserScript==
// @name         Scribd Blur Bypass
// @namespace    @reinaldyalaratte
// @version      1.5
// @description  Redirect automatic to embed viewer
// @author       Reinaldy Alaratte
// @license      CC-BY-NC
// @match        https://*.scribd.com/*
// @icon         https://cdn-1.webcatalog.io/catalog/scribd/scribd-icon-filled-256.png?v=1760921437282
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/555681/Scribd%20Blur%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/555681/Scribd%20Blur%20Bypass.meta.js
// ==/UserScript==

/* ============================================================
   BAGIAN 1: Redirect otomatis Scribd ke halaman embed
   ============================================================ */
(function() {
  'use strict';

  const EMBED_URL_TEMPLATE = "https://www.scribd.com/embeds/{id}/content?start_page=1&view_mode=scroll";

  function extractScribdId(url) {
    try {
      const u = new URL(url, window.location.origin);
      const path = u.pathname;
      let m = path.match(/\/(?:doc|document|book)\/(\d+)/i);
      if (m && m[1]) return m[1];
      m = path.match(/\/embeds\/(\d+)/i);
      if (m && m[1]) return m[1];
      m = path.match(/\/(\d+)(?:$|\/)/);
      if (m && m[1]) return m[1];
    } catch (e) {}
    return null;
  }

  function buildEmbedUrl(id) {
    return EMBED_URL_TEMPLATE.replace("{id}", id);
  }

  // Intercept klik ke link Scribd
  document.addEventListener('click', function(e) {
    let el = e.target;
    while (el && el !== document.body) {
      if (el.tagName && el.tagName.toLowerCase() === 'a' && el.href) break;
      el = el.parentElement;
    }
    if (!el || !el.href) return;
    const href = el.href;
    if (!/scribd\.com/i.test(href)) return;
    const id = extractScribdId(href);
    if (!id) return;
    e.preventDefault();
    e.stopPropagation();
    const embed = buildEmbedUrl(id);
    window.location.href = embed;
  }, true);

  // Redirect otomatis jika buka dokumen langsung
  (function redirectIfOnDocPage() {
    const id = extractScribdId(window.location.href);
    if (!id) return;
    if (/\/embeds\//i.test(window.location.pathname)) return;
    const embed = buildEmbedUrl(id);
    if (embed && embed !== window.location.href) {
      window.location.replace(embed);
    }
  })();
})();

/* ============================================================
   BAGIAN 2: Enhancer tampilan di halaman embed
   ============================================================ */
(function () {
  'use strict';

  if (!/\/embeds\//i.test(window.location.pathname)) return;

  // === Watermark IG kiri atas (Clean Minimalist) ===
    const igLogo = "https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png";
    const watermark = document.createElement("div");

    watermark.innerHTML = `
  <a href="https://www.instagram.com/reinaldyalaratte/" target="_blank" style="
    display:flex;
    align-items:center;
    gap:6px;
    padding:5px 10px;
    background:rgba(0,0,0,0.99);
    border-radius:10px;
    backdrop-filter:blur(4px);
    text-decoration:none;
  ">
    <img src='${igLogo}' style="width:18px;height:18px;">
    <span style="
  color:white;
  font-weight:500;
  font-size:13px;
  font-family:'Poppins', sans-serif;
  letter-spacing:0.6px;
">
  @reinaldyalaratte
</span>

  </a>
`;

    Object.assign(watermark.style, {
        position: "fixed",
        top: "12px",
        left: "12px",
        zIndex: "99999",
        opacity: "1",          // Full opacity
        transition: "none"     // Tidak ada efek fade
    });

    document.body.appendChild(watermark);

  // === Header Auto Hide ===
  let lastScroll = 0;
  const header = document.querySelector("header, .header, .site_header") || document.createElement("div");
  header.style.transition = "transform 0.3s ease";
  window.addEventListener("scroll", () => {
    const currentScroll = window.scrollY;
    if (currentScroll > lastScroll && currentScroll > 60) {
      header.style.transform = "translateY(-100%)"; // hide
    } else {
      header.style.transform = "translateY(0)"; // show
    }
    lastScroll = currentScroll;
  });

  // === Control Panel (kanan atas) ===
  const panel = document.createElement("div");
  panel.style.position = "fixed";
  panel.style.top = "15px";
  panel.style.right = "15px";
  panel.style.zIndex = "99999";
  panel.style.display = "flex";
  panel.style.gap = "10px";
  panel.style.transition = "opacity 0.3s ease";
  panel.style.opacity = "1";
  panel.innerHTML = `
    <button id="darkToggle" title="Tema Gelap/Terang" style="padding:6px 10px;border:none;border-radius:8px;cursor:pointer;">🌓</button>
    <button id="fullBtn" title="Fullscreen" style="padding:6px 10px;border:none;border-radius:8px;cursor:pointer;">⛶</button>
    <button id="downloadBtn" title="Unduh Resmi" style="padding:6px 10px;border:none;border-radius:8px;cursor:pointer;">⬇️</button>
  `;
  document.body.appendChild(panel);

  // === Auto-hide panel saat scroll ===
  let panelTimeout;
  window.addEventListener("scroll", () => {
    panel.style.opacity = "0";
    clearTimeout(panelTimeout);
    panelTimeout = setTimeout(() => {
      panel.style.opacity = "1";
    }, 600);
  });

  // === Dark mode toggle ===
  const darkToggle = panel.querySelector("#darkToggle");
  let isDark = localStorage.getItem("scribdDarkMode") === "true";
  function applyDarkMode(active) {
    if (active) {
      document.body.style.background = "#111";
      document.body.style.color = "#eee";
      localStorage.setItem("scribdDarkMode", true);
    } else {
      document.body.style.background = "";
      document.body.style.color = "";
      localStorage.setItem("scribdDarkMode", false);
    }
  }
  applyDarkMode(isDark);
  darkToggle.onclick = () => {
    isDark = !isDark;
    applyDarkMode(isDark);
  };

  // === Fullscreen toggle (bersih total) ===
  const fullBtn = panel.querySelector("#fullBtn");
  fullBtn.onclick = () => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen();
    else document.exitFullscreen();
  };

  // --- Bersihkan UI saat fullscreen aktif ---
  function toggleFullscreenUI(hide) {
    const bottomBar = document.querySelector("footer, .footer, .bottom-bar");
    if (hide) {
      watermark.style.opacity = "0";
      panel.style.opacity = "0";
      header.style.opacity = "0";
      bottomBar && (bottomBar.style.opacity = "0");
    } else {
      watermark.style.opacity = "1";
      panel.style.opacity = "1";
      header.style.opacity = "1";
      bottomBar && (bottomBar.style.opacity = "1");
    }
  }

  document.addEventListener("mousemove", () => {
    if (document.fullscreenElement) toggleFullscreenUI(false);
    clearTimeout(window.hideUITimeout);
    window.hideUITimeout = setTimeout(() => {
      if (document.fullscreenElement) toggleFullscreenUI(true);
    }, 2000);
  });

  // === Official download redirect ===
  panel.querySelector("#downloadBtn").onclick = () => {
    const currentUrl = window.location.href;
    const match = currentUrl.match(/\/document\/(\d+)/) || currentUrl.match(/\/embeds\/(\d+)/);
    if (match) {
      const id = match[1];
      const downloadUrl = `https://www.scribd.com/document_downloads/${id}`;
      window.open(downloadUrl, "_blank");
    } else {
      alert("Tidak dapat menemukan ID dokumen di halaman ini.");
    }
  };

})();