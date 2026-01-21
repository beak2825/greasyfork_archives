// ==UserScript==
// @name         AO Tabulka s odkazy do API
// @namespace    http://tampermonkey.net/
// @version      8.5
// @author       JV
// @license      MIT
// @description  Vytvoří tlačítko pro tabulku s API odkazy + filtr dohraných + scroll k tabulce
// @match        https://ausopen.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563373/AO%20Tabulka%20s%20odkazy%20do%20API.user.js
// @updateURL https://update.greasyfork.org/scripts/563373/AO%20Tabulka%20s%20odkazy%20do%20API.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const LIVE_BASE = "https://prod-scores-api.ausopen.com/match-centre/";
  const ROOT_ID = "tm-ao-api-root";
  const PANEL_ID = "tm-ao-api-panel";
  const MOUNT_ID = "tm-ao-api-mount";
  const HIDE_DONE_KEY = "tm_ao_hide_done_matches_v1";

  function extractCodeFromHref(href) {
    try {
      const u = new URL(href, location.origin);
      const m = u.pathname.match(/-([a-z]{1,3}\d{2,4})$/i);
      return m ? m[1].toUpperCase() : null;
    } catch {
      return null;
    }
  }

  function normSpace(s) {
    return (s || "").replace(/\s+/g, " ").trim();
  }

  function playerNameFromTeamAnchor(a) {
    const p = a.querySelector("p");
    if (!p) return normSpace(a.textContent);
    const clone = p.cloneNode(true);
    clone.querySelectorAll("span").forEach((sp) => sp.remove());
    return normSpace(clone.textContent);
  }

  function teamFromPlayerRow(playerRowEl) {
    if (!playerRowEl) return "";
    const teamAnchors = Array.from(playerRowEl.querySelectorAll("a.player-row__team"));
    const names = teamAnchors.map(playerNameFromTeamAnchor).filter(Boolean);
    return names.join(" / ");
  }

  function findMatchContainerFromAnchor(anchorEl) {
    let el = anchorEl;
    for (let i = 0; i < 14 && el; i++) {
      if (el.querySelector && el.querySelector("a.player-row__team")) return el;
      el = el.parentElement;
    }
    return null;
  }

  function homeAwayFromAnchor(anchorEl) {
    const container = findMatchContainerFromAnchor(anchorEl);
    if (!container) return { home: "", away: "" };

    const playerRows = Array.from(container.querySelectorAll(".player-row"));
    let home = teamFromPlayerRow(playerRows[0]);
    let away = teamFromPlayerRow(playerRows[1]);

    if (!home && !away) {
      const allTeams = Array.from(container.querySelectorAll("a.player-row__team"))
        .map(playerNameFromTeamAnchor)
        .filter(Boolean);

      if (allTeams.length >= 2) {
        const mid = Math.ceil(allTeams.length / 2);
        home = allTeams.slice(0, mid).join(" / ");
        away = allTeams.slice(mid).join(" / ");
      }
    }

    return { home, away };
  }

  // ✅ Detekce dohraného zápasu (podle tvého screenshotu)
  function isCompletedMatchFromAnchor(anchorEl) {
    const container = findMatchContainerFromAnchor(anchorEl);
    if (!container) return false;

    const text = (container.innerText || "").toLowerCase();
    if (text.includes("live")) return false; // když je live, určitě neskrývat

    const hasWinner = !!container.querySelector(".player-row__team-wrapper--winner");
    const hasScoreTick = !!container.querySelector("svg.player-row__tick--has-score");

    return hasWinner && hasScoreTick;
  }

  function findHeader() {
    return (
      document.querySelector("header[role='banner']") ||
      document.querySelector("header") ||
      document.querySelector(".region-header") ||
      document.querySelector(".site-header") ||
      document.querySelector(".page-header") ||
      null
    );
  }

  function findContentMountPoint() {
    return (
      document.querySelector("main .container") ||
      document.querySelector("main .layout-container") ||
      document.querySelector("main .content") ||
      document.querySelector("main") ||
      null
    );
  }

  function createSmallButtonBase() {
    const b = document.createElement("button");
    b.type = "button";
    b.style.padding = "4px 8px";
    b.style.borderRadius = "0px";
    b.style.border = "1px solid rgba(0,0,0,0.18)";
    b.style.background = "#fff";
    b.style.cursor = "pointer";
    b.style.fontSize = "11px";
    b.style.fontWeight = "850";
    b.style.lineHeight = "1";
    return b;
  }

  function createYellowToggleButton() {
    const b = document.createElement("button");
    b.type = "button";
    b.style.padding = "10px 15px";
    b.style.borderRadius = "0px";
    b.style.border = "1px solid rgba(0,0,0,0.28)";
    b.style.background = "#facc15";
    b.style.color = "#1f2937";
    b.style.cursor = "pointer";
    b.style.fontSize = "13px";
    b.style.fontWeight = "900";
    b.style.lineHeight = "1";
    b.style.boxShadow = "0 5px 10px rgba(0,0,0,0.18)";
    b.style.transition = "transform 120ms ease, filter 120ms ease";
    b.addEventListener("mouseenter", () => {
      b.style.filter = "brightness(1.05)";
      b.style.transform = "translateY(-1px)";
    });
    b.addEventListener("mouseleave", () => {
      b.style.filter = "none";
      b.style.transform = "none";
    });
    return b;
  }

  function ensureMount() {
    let mount = document.getElementById(MOUNT_ID);
    if (mount) return mount;

    mount = document.createElement("div");
    mount.id = MOUNT_ID;

    mount.style.display = "block";
    mount.style.margin = "10px 0 10px 12px";
    mount.style.maxWidth = "888px";
    mount.style.width = "min(720px, calc(100vw - 24px))";

    // ✅ aby scrollIntoView neskončil pod sticky headerem
    mount.style.scrollMarginTop = "90px";

    const content = findContentMountPoint();
    if (content) {
      content.prepend(mount);
      return mount;
    }

    const header = findHeader();
    if (header && header.parentElement) {
      header.insertAdjacentElement("afterend", mount);
      return mount;
    }

    document.body.prepend(mount);
    return mount;
  }

  function ensureUI() {
    let root = document.getElementById(ROOT_ID);
    if (root) return root;

    root = document.createElement("div");
    root.id = ROOT_ID;
    root.style.display = "inline-flex";
    root.style.alignItems = "center";
    root.style.gap = "10px";
    root.style.marginLeft = "10px";
    root.style.fontFamily = "system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif";

    const toggle = createYellowToggleButton();
    toggle.dataset.tm = "toggle";
    toggle.textContent = "LIVE API (0)";

    const refresh = createSmallButtonBase();
    refresh.dataset.tm = "refresh";
    refresh.textContent = "↻";
    refresh.title = "Refresh";

    root.appendChild(toggle);
    root.appendChild(refresh);

    const header = findHeader();
    if (header) header.appendChild(root);
    else document.body.prepend(root);

    const mount = ensureMount();

    let panel = document.getElementById(PANEL_ID);
    if (!panel) {
      panel = document.createElement("div");
      panel.id = PANEL_ID;

      panel.style.borderRadius = "26px";
      panel.style.border = "2px solid #1e40af";
      panel.style.background = "#dbeafe";
      panel.style.boxShadow = "0 8px 18px rgba(0,0,0,0.12)";
      panel.style.padding = "10px";
      panel.style.fontFamily = "system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif";

      const bar = document.createElement("div");
      bar.style.display = "flex";
      bar.style.alignItems = "center";
      bar.style.justifyContent = "space-between";
      bar.style.gap = "10px";
      bar.style.marginBottom = "8px";

      const title = document.createElement("div");
      title.dataset.tm = "panel-title";
      title.textContent = "LIVE API";
      title.style.fontWeight = "1000";
      title.style.fontSize = "13px";
      title.style.color = "#0b1b4a";

      const close = createSmallButtonBase();
      close.textContent = "✕";
      close.title = "Close";

      bar.appendChild(title);
      bar.appendChild(close);

      // ✅ checkbox: skrýt dohrané
      const filterRow = document.createElement("div");
      filterRow.style.display = "flex";
      filterRow.style.alignItems = "center";
      filterRow.style.gap = "8px";
      filterRow.style.margin = "0 0 6px 2px";
      filterRow.style.fontSize = "12px";
      filterRow.style.fontWeight = "800";
      filterRow.style.color = "#0b1b4a";

      const hideDone = document.createElement("input");
      hideDone.type = "checkbox";
      hideDone.dataset.tm = "hide-done";
      hideDone.checked = localStorage.getItem(HIDE_DONE_KEY) !== "0"; // default: zapnuto

      const hideDoneLabel = document.createElement("label");
      hideDoneLabel.style.display = "inline-flex";
      hideDoneLabel.style.alignItems = "center";
      hideDoneLabel.style.gap = "8px";
      hideDoneLabel.style.cursor = "pointer";

      const labelText = document.createElement("span");
      labelText.textContent = "Skrýt dohrané";

      hideDoneLabel.appendChild(hideDone);
      hideDoneLabel.appendChild(labelText);
      filterRow.appendChild(hideDoneLabel);

      hideDone.addEventListener("change", () => {
        localStorage.setItem(HIDE_DONE_KEY, hideDone.checked ? "1" : "0");
        rebuild(true); // force rebuild
      });

      const headerRow = document.createElement("div");
      headerRow.style.display = "grid";
      headerRow.style.gridTemplateColumns = "minmax(0,1fr) minmax(0,1fr) max-content";
      headerRow.style.gap = "8px";
      headerRow.style.padding = "4px 8px 4px 6px";
      headerRow.style.marginBottom = "4px";
      headerRow.style.fontSize = "12px";
      headerRow.style.fontWeight = "900";
      headerRow.style.color = "#0b1b4a";
      headerRow.style.opacity = "0.9";

      const hHome = document.createElement("div");
      hHome.textContent = "Domácí";
      const hAway = document.createElement("div");
      hAway.textContent = "Hosté";
      const hApi = document.createElement("div");
      hApi.textContent = "API";
      hApi.style.textAlign = "right";

      headerRow.appendChild(hHome);
      headerRow.appendChild(hAway);
      headerRow.appendChild(hApi);

      const body = document.createElement("div");
      body.dataset.tm = "panel-body";
      body.style.display = "grid";
      body.style.gridAutoRows = "min-content";
      body.style.gap = "2px";

      panel.appendChild(bar);
      panel.appendChild(filterRow);
      panel.appendChild(headerRow);
      panel.appendChild(body);

      panel.style.display = "none";
      mount.appendChild(panel);

      close.addEventListener("click", () => {
        panel.style.display = "none";
      });
    }

    toggle.addEventListener("click", () => {
      const p = document.getElementById(PANEL_ID);
      if (!p) return;

      const isOpen = p.style.display !== "none";
      p.style.display = isOpen ? "none" : "block";

      // rebuild jen pokud panel byl prázdný
      const body = p.querySelector('[data-tm="panel-body"]');
      if (!isOpen && body && body.children.length === 0) {
        rebuild(true);
      }

      // ✅ po otevření odscrolluj k tabulce
      if (!isOpen) {
        requestAnimationFrame(() => {
          const mount = document.getElementById(MOUNT_ID);
          (mount || p).scrollIntoView({ behavior: "smooth", block: "start" });
        });
      }
    });

    refresh.addEventListener("click", () => rebuild(true));

    return root;
  }

  function makeRow({ home, away, apiUrl, code }) {
    const row = document.createElement("div");
    row.style.display = "grid";
    row.style.gridTemplateColumns = "minmax(0,1fr) minmax(0,1fr) max-content";
    row.style.alignItems = "center";
    row.style.gap = "6px";
    row.style.padding = "2px 4px";
    row.style.borderRadius = "8px";
    row.style.background = "rgba(255,255,255,0.45)";
    row.style.border = "1px solid rgba(30,64,175,0.16)";

    const homeEl = document.createElement("div");
    homeEl.textContent = home || "(?)";
    homeEl.style.fontSize = "14px";
    homeEl.style.fontWeight = "800";
    homeEl.style.whiteSpace = "nowrap";
    homeEl.style.overflow = "hidden";
    homeEl.style.textOverflow = "ellipsis";

    const awayEl = document.createElement("div");
    awayEl.textContent = away || "(?)";
    awayEl.style.fontSize = "14px";
    awayEl.style.fontWeight = "800";
    awayEl.style.whiteSpace = "nowrap";
    awayEl.style.overflow = "hidden";
    awayEl.style.textOverflow = "ellipsis";

    const right = document.createElement("div");
    right.style.display = "flex";
    right.style.flexDirection = "column";
    right.style.alignItems = "flex-end";
    right.style.gap = "2px";

    // CODE jako hlavní odkaz
    const codeLink = document.createElement("a");
    codeLink.href = apiUrl;
    codeLink.textContent = code;
    codeLink.target = "_blank";
    codeLink.rel = "noopener noreferrer";
    codeLink.style.fontSize = "14px";
    codeLink.style.fontWeight = "900";
    codeLink.style.color = "#1e40af";
    codeLink.style.textDecoration = "underline";
    codeLink.style.cursor = "pointer";
    codeLink.style.padding = "2px 4px";
    codeLink.style.display = "inline-block";

    right.appendChild(codeLink);

    row.appendChild(homeEl);
    row.appendChild(awayEl);
    row.appendChild(right);

    return row;
  }

  function rebuild(force) {
    const ui = document.getElementById(ROOT_ID);
    const toggle = ui?.querySelector('[data-tm="toggle"]');
    const panel = document.getElementById(PANEL_ID);
    const title = panel?.querySelector('[data-tm="panel-title"]');
    const body = panel?.querySelector('[data-tm="panel-body"]');
    const hideDone = panel?.querySelector('[data-tm="hide-done"]');
    if (!toggle || !panel || !body) return;

    // pokud není force, nebudeme zbytečně přepisovat když je panel zavřený a prázdný
    if (!force && panel.style.display === "none" && body.children.length === 0) return;

    const shouldHideDone = hideDone ? hideDone.checked : (localStorage.getItem(HIDE_DONE_KEY) !== "0");

    const anchors = Array.from(document.querySelectorAll('a.score-row__anchor[href*="/match/"]'));
    const map = new Map();

    anchors.forEach((a) => {
      // ✅ filtr dohraných
      if (shouldHideDone && isCompletedMatchFromAnchor(a)) return;

      const href = a.getAttribute("href");
      const code = extractCodeFromHref(href);
      if (!code || map.has(code)) return;

      const apiUrl = LIVE_BASE + code;
      const { home, away } = homeAwayFromAnchor(a);

      map.set(code, { home, away, apiUrl, code });
    });

    toggle.textContent = `LIVE API (${map.size})`;
    if (title) title.textContent = `LIVE API (${map.size})`;

    body.innerHTML = "";
    Array.from(map.values()).forEach((item) => body.appendChild(makeRow(item)));
  }

  const ui = ensureUI();
  rebuild(true);

  const updateObserver = new MutationObserver(() => {
    clearTimeout(window.__tmAoDebounce);
    window.__tmAoDebounce = setTimeout(() => rebuild(false), 350);
  });
  updateObserver.observe(document.documentElement, { childList: true, subtree: true });
})();