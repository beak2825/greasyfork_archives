// ==UserScript==
// @name         YggTorrent • Téléchargement massif de .torrent
// @namespace    https://upandclear.org/
// @version      1.1.0
// @description  Repère tous les liens engine/download_torrent?id=xxxx sur la page et les télécharge en série avec limite de débit. Fallback possible via ouverture d’onglets.
// @author       Aerya + ChatGPT
// @license MIT
// @match        https://www.yggtorrent.*/*
// @match        https://yggtorrent.*/*
// @match        https://www.yggtorrent.*/*
// @match        https://www2.yggtorrent.*/*
// @match        https://ygg.*/*
// @run-at       document-idle
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      yggtorrent.*
// @downloadURL https://update.greasyfork.org/scripts/560440/YggTorrent%20%E2%80%A2%20T%C3%A9l%C3%A9chargement%20massif%20de%20torrent.user.js
// @updateURL https://update.greasyfork.org/scripts/560440/YggTorrent%20%E2%80%A2%20T%C3%A9l%C3%A9chargement%20massif%20de%20torrent.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // ---------- Utilitaires ----------
  const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
  const uniq = (arr) => [...new Set(arr)];

  // Détecte les liens de téléchargement YGG sur la page
  function findTorrentLinks() {
    const anchors = [...document.querySelectorAll('a[href*="engine/download_torrent?id="]')];
    let urls = anchors
      .map((a) => (a.href ? a.href.trim() : ""))
      .filter((u) => /^https?:\/\/[^\/]+\/engine\/download_torrent\?id=\d+/i.test(u));
    // Uniques
    urls = uniq(urls);
    return urls;
  }

  // Récupère un nom de fichier depuis Content-Disposition (si dispo)
  function filenameFromContentDisposition(dispo, fallback) {
    if (!dispo) return fallback;
    // content-disposition: attachment; filename="My.File.torrent"
    const match = dispo.match(/filename\*?=(?:UTF-8'')?["']?([^"';]+)["']?/i);
    if (match && match[1]) {
      try {
        return decodeURIComponent(match[1]);
      } catch {
        return match[1];
      }
    }
    return fallback;
  }

  // Télécharge un .torrent via GM_download (si dispo), sinon via <a download>
  function saveBlob(blob, filename) {
    const hasGM = typeof GM_download === "function";
    if (hasGM) {
      const urlObj = URL.createObjectURL(blob);
      GM_download({
        url: urlObj,
        name: filename,
        onload: () => URL.revokeObjectURL(urlObj),
        onerror: () => URL.revokeObjectURL(urlObj),
      });
    } else {
      const urlObj = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = urlObj;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(urlObj);
    }
  }

  // Téléchargement via XHR (conserve cookies/session) + headers de politesse
  function fetchTorrent(url) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "GET",
        url,
        responseType: "blob",
        headers: {
          "Accept": "application/x-bittorrent,application/octet-stream;q=0.9,*/*;q=0.8",
          "Referer": location.href,
        },
        onload: (res) => {
          if (res.status >= 200 && res.status < 300 && res.response) {
            const dispo = res.responseHeaders || "";
            const name = filenameFromContentDisposition(
              dispo,
              // fallback: id=xxxx.torrent
              (url.match(/id=(\d+)/) ? `ygg-${RegExp.$1}` : `ygg-${Date.now()}`) + ".torrent"
            );
            resolve({ blob: res.response, filename: name });
          } else {
            reject(new Error(`HTTP ${res.status}`));
          }
        },
        onerror: (err) => reject(err),
        ontimeout: () => reject(new Error("timeout")),
        // Important pour les cookies de session
        anonymous: false,
      });
    });
  }

  // ---------- UI flottante ----------
  function createPanel() {
    const panel = document.createElement("div");
    panel.id = "ygg-bulk-panel";
    panel.style.cssText = `
      position: fixed; right: 18px; bottom: 18px; z-index: 999999;
      background: rgba(20,20,20,.9); color: #fff; font: 13px system-ui, sans-serif;
      border: 1px solid rgba(255,255,255,.15); border-radius: 12px; padding: 12px 14px;
      box-shadow: 0 8px 28px rgba(0,0,0,.35); min-width: 280px;
    `;

    const title = document.createElement("div");
    title.textContent = "YGG – Téléchargement massif";
    title.style.cssText = "font-weight:600; margin-bottom:8px;";

    const info = document.createElement("div");
    info.id = "ygg-bulk-info";
    info.style.cssText = "opacity:.85; margin-bottom:8px;";

    const delayWrap = document.createElement("label");
    delayWrap.style.cssText = "display:flex; align-items:center; gap:8px; margin:6px 0;";
    delayWrap.innerHTML = `
      Délai (ms) entre téléchargements
      <input id="ygg-bulk-delay" type="number" min="0" step="100"
             style="flex:1; margin-left:6px; padding:4px 6px; border-radius:8px; border:1px solid #333; background:#111; color:#fff;"
             />
    `;

    const retryWrap = document.createElement("label");
    retryWrap.style.cssText = "display:flex; align-items:center; gap:8px; margin:6px 0;";
    retryWrap.innerHTML = `
      Retries (si erreur)
      <input id="ygg-bulk-retries" type="number" min="0" max="5"
             style="width:70px; margin-left:auto; padding:4px 6px; border-radius:8px; border:1px solid #333; background:#111; color:#fff;"
             />
    `;

    const fallbackWrap = document.createElement("label");
    fallbackWrap.style.cssText = "display:flex; align-items:center; gap:8px; margin:6px 0;";
    fallbackWrap.innerHTML = `
      <input id="ygg-bulk-open-tabs" type="checkbox" />
      Fallback: ouvrir en onglets (si le site bloque les requêtes)
    `;
    btnScan.style.cssText = btnStyle();

    const btnGo = document.createElement("button");
    btnGo.textContent = "Télécharger sélection";
    btnGo.style.cssText = btnStyle("accent");
    btnClose.style.cssText = btnStyle();
    btnClose.onclick = () => panel.remove();

    actions.append(btnScan, btnGo, btnClose);
    panel.append(title, info, delayWrap, retryWrap, fallbackWrap, actions);
    document.body.appendChild(panel);
    const savedRetries = Number(GM_getValue("ygg_bulk_retries", 2));
    const savedOpenTabs = Boolean(GM_getValue("ygg_bulk_open_tabs", false));
    panel.querySelector("#ygg-bulk-delay").value = savedDelay;
    panel.querySelector("#ygg-bulk-retries").value = savedRetries;
    panel.querySelector("#ygg-bulk-open-tabs").checked = savedOpenTabs;

    // État interne
    let currentLinks = [];

    function refreshInfo() {
      const links = findTorrentLinks();
      currentLinks = links;
      info.textContent = links.length
        ? `Liens détectés: ${links.length}`
        : `Aucun lien de type engine/download_torrent?id=xxxx détecté sur cette page.`;
      btnGo.disabled = links.length === 0;
    }
    refreshInfo();

    btnScan.onclick = refreshInfo;

    btnGo.onclick = async () => {
      const delay = Math.max(0, Number(panel.querySelector("#ygg-bulk-delay").value || 0));
      const retries = Math.max(0, Number(panel.querySelector("#ygg-bulk-retries").value || 0));
      const openTabs = panel.querySelector("#ygg-bulk-open-tabs").checked;

      GM_setValue("ygg_bulk_delay", delay);
      GM_setValue("ygg_bulk_retries", retries);
      GM_setValue("ygg_bulk_open_tabs", openTabs);

      if (!currentLinks.length) {
        refreshInfo();
        return;
      }

      btnGo.disabled = true; btnScan.disabled = true;

      if (openTabs) {
        info.textContent = `Ouverture des ${currentLinks.length} liens en onglets…`;
        for (let i = 0; i < currentLinks.length; i++) {
          window.open(currentLinks[i], "_blank", "noopener,noreferrer");
          info.textContent = `Onglets ouverts: ${i + 1}/${currentLinks.length}`;
          if (delay) await sleep(delay);
        }
        info.textContent = `Terminé: ${currentLinks.length} onglets ouverts.`;
      } else {
        info.textContent = `Téléchargements en cours… 0/${currentLinks.length}`;
        let ok = 0, ko = 0;

        for (let i = 0; i < currentLinks.length; i++) {
          const url = currentLinks[i];

          let attempt = 0, success = false;
          while (attempt <= retries && !success) {
            try {
              const { blob, filename } = await fetchTorrent(url);
              saveBlob(blob, filename);
              success = true;
              ok++;
            } catch (e) {
              attempt++;
              if (attempt > retries) {
                console.warn("Échec:", url, e);
                ko++;
              } else {
                await sleep(Math.max(500, delay || 0));
              }
            }
          }
          info.textContent = `Téléchargements… ${ok + ko}/${currentLinks.length} (OK: ${ok}, Échecs: ${ko})`;
          if (delay) await sleep(delay);
        }
        info.textContent = `Terminé. Succès: ${ok} • Échecs: ${ko}`;
      }

      btnGo.disabled = false; btnScan.disabled = false;
    };
  }

  function btnStyle(kind) {
    const base = `
      cursor:pointer; flex:1; padding:8px 10px; border-radius:10px;
      border:1px solid rgba(255,255,255,.2); background:#1b1b1b; color:#fff;
    `;
    if (kind === "accent") {
      return base + "background:#3b82f6;border-color:#3b82f6;";
    }
    return base;
  }

  // Lance le panneau une fois la page prête
  const ready = () => {
    // Évite les doublons si la page utilise un router (SPA)
    if (!document.getElementById("ygg-bulk-panel")) createPanel();
  };

  if (document.readyState === "complete" || document.readyState === "interactive") {
    ready();
  } else {
    document.addEventListener("DOMContentLoaded", ready, { once: true });
  }
})();

    // Pré-remplissage des paramètres
    const savedDelay = Number(GM_getValue("ygg_bulk_delay", 1200));

    const btnClose = document.createElement("button");
    btnClose.textContent = "Fermer";

    const btnScan = document.createElement("button");
    btnScan.textContent = "Scanner la page";

