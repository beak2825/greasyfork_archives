// ==UserScript==
// @name         Feynman FLP: Show Download Links + Download All (Firefox)
// @namespace    https://example.local/
// @version      1.5
// @description  Setzt alle flpPlaylist-Items auf free:true, zeigt Download-Liste an und fügt "Download all" für m4a/ogg hinzu
// @match        *://feynmanlectures.caltech.edu/flptapes.html
// @match        *://www.feynmanlectures.caltech.edu/flptapes.html
// @run-at       document-start
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/548418/Feynman%20FLP%3A%20Show%20Download%20Links%20%2B%20Download%20All%20%28Firefox%29.user.js
// @updateURL https://update.greasyfork.org/scripts/548418/Feynman%20FLP%3A%20Show%20Download%20Links%20%2B%20Download%20All%20%28Firefox%29.meta.js
// ==/UserScript==

(function() {
  "use strict";

  function inject(fn) {
    const s = document.createElement('script');
    s.textContent = `(${fn})();`;
    (document.head || document.documentElement).appendChild(s);
    s.remove();
  }

  inject(function pageContext() {
    // ---- Helpers ----
    function sanitizeFilename(name) {
      return name
        .replace(/<[^>]+>/g, "") // HTML-Tags weg
        .replace(/[\\/:*?"<>|]+/g, "_") // verbotene FS-Zeichen
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 120);
    }

    function basename(path) {
      try { return path.split("?")[0].split("#")[0].split("/").pop(); } catch { return path; }
    }

    function clickDownload(url, fileName) {
      const a = document.createElement("a");
      a.href = url;
      if (fileName) a.download = fileName;
      a.rel = "noopener";
      a.target = "_blank"; // in FF hilft das oft beim Download-Flow
      document.body.appendChild(a);
      a.click();
      a.remove();
    }

    // ---- Patch + UI ----
    function patchPlaylistOnce() {
      if (window.flpPlaylist && Array.isArray(window.flpPlaylist)) {
        try {
          window.flpPlaylist.forEach(it => { it.free = true; });
          console.log("[FLP userscript] flpPlaylist gepatcht (free:true).");
        } catch (e) {
          console.warn("[FLP userscript] Patch-Fehler:", e);
        }
        return true;
      }
      return false;
    }

    (function waitForPlaylist() {
      if (!patchPlaylistOnce()) {
        setTimeout(waitForPlaylist, 150);
      } else {
        setTimeout(buildDownloadPanel, 400);
      }
    })();

    function buildDownloadPanel() {
      if (!Array.isArray(window.flpPlaylist) || window.flpPlaylist.length === 0) return;

      const base = new URL(window.location.href);

      const panel = document.createElement('div');
      panel.id = "flp-download-panel";
      Object.assign(panel.style, {
        position: "fixed",
        bottom: "16px",
        right: "16px",
        maxHeight: "70vh",
        overflow: "auto",
        background: "rgba(0,0,0,0.85)",
        color: "#fff",
        font: "14px/1.4 system-ui, sans-serif",
        padding: "12px 14px 14px",
        borderRadius: "10px",
        boxShadow: "0 6px 18px rgba(0,0,0,0.35)",
        zIndex: "99999",
        width: "420px",
      });

      // Header
      const header = document.createElement('div');
      header.textContent = "FLP Downloads (m4a | ogg)";
      header.style.fontWeight = "600";
      header.style.marginBottom = "6px";
      panel.appendChild(header);

      const info = document.createElement('div');
      info.textContent = "Rechtsklick auf Links → „Ziel speichern unter…“ oder nutze „Download all“.";
      info.style.opacity = "0.85";
      info.style.marginBottom = "8px";
      panel.appendChild(info);

      // Controls
      const controls = document.createElement('div');
      controls.style.display = "flex";
      controls.style.gap = "8px";
      controls.style.flexWrap = "wrap";
      controls.style.marginBottom = "8px";

      function makeBtn(label) {
        const b = document.createElement('button');
        b.textContent = label;
        Object.assign(b.style, {
          cursor: "pointer",
          padding: "6px 10px",
          borderRadius: "8px",
          border: "1px solid rgba(255,255,255,0.25)",
          background: "rgba(255,255,255,0.08)",
          color: "#fff",
        });
        b.onmouseenter = () => b.style.background = "rgba(255,255,255,0.14)";
        b.onmouseleave = () => b.style.background = "rgba(255,255,255,0.08)";
        return b;
      }

      const btnAllM4A = makeBtn("Download all (m4a)");
      const btnAllOGG = makeBtn("Download all (ogg)");
      const btnStop = makeBtn("Stop");
      btnStop.style.display = "none";

      // Delay input
      const delayWrap = document.createElement('div');
      delayWrap.style.display = "flex";
      delayWrap.style.alignItems = "center";
      delayWrap.style.gap = "6px";
      delayWrap.style.marginLeft = "auto";

      const delayLabel = document.createElement('label');
      delayLabel.textContent = "Delay (ms):";
      const delayInput = document.createElement('input');
      delayInput.type = "number";
      delayInput.min = "200";
      delayInput.value = "1200";
      Object.assign(delayInput.style, {
        width: "80px",
        padding: "4px 6px",
        borderRadius: "6px",
        border: "1px solid rgba(255,255,255,0.25)",
        background: "rgba(255,255,255,0.06)",
        color: "#fff",
      });

      delayWrap.appendChild(delayLabel);
      delayWrap.appendChild(delayInput);

      controls.appendChild(btnAllM4A);
      controls.appendChild(btnAllOGG);
      controls.appendChild(btnStop);
      controls.appendChild(delayWrap);
      panel.appendChild(controls);

      // Progress
      const progress = document.createElement('div');
      progress.style.marginBottom = "8px";
      progress.style.opacity = "0.9";
      panel.appendChild(progress);

      // Liste
      const list = document.createElement('ol');
      list.style.margin = "0";
      list.style.paddingLeft = "18px";

      window.flpPlaylist.forEach((item, idx) => {
        const li = document.createElement('li');
        li.style.marginBottom = "6px";

        const title = (item.title || "").replace(/<[^>]+>/g, "").trim() || `Track ${idx+1}`;
        const m4aHref = item.m4a ? new URL(item.m4a, base).href : null;
        const oggHref = item.oga ? new URL(item.oga, base).href : null;

        const titleSpan = document.createElement('span');
        titleSpan.textContent = title + " — ";
        li.appendChild(titleSpan);

        function link(href, label) {
          const a = document.createElement('a');
          a.href = href;
          a.textContent = label;
          a.style.color = "#7cc7ff";
          a.setAttribute("download", "");
          a.rel = "noopener";
          a.target = "_blank";
          return a;
        }

        if (m4aHref) li.appendChild(link(m4aHref, "m4a"));
        if (m4aHref && oggHref) li.appendChild(document.createTextNode(" | "));
        if (oggHref) li.appendChild(link(oggHref, "ogg"));

        list.appendChild(li);
      });

      panel.appendChild(list);

      // Close
      const closeBtn = document.createElement('button');
      closeBtn.textContent = "×";
      closeBtn.title = "Panel schließen";
      Object.assign(closeBtn.style, {
        position: "absolute",
        top: "4px",
        right: "8px",
        border: "none",
        background: "transparent",
        color: "#fff",
        fontSize: "18px",
        cursor: "pointer",
      });
      closeBtn.onclick = () => panel.remove();
      panel.appendChild(closeBtn);

      document.documentElement.appendChild(panel);

      // ---- Download-All Logik ----
      let stopFlag = false;
      let running = false;

      async function downloadAll(kind /* 'm4a' | 'ogg' */) {
        if (running) return;
        running = true; stopFlag = false;
        btnStop.style.display = "inline-block";
        progress.textContent = `Start: Alle ${kind.toUpperCase()}-Dateien werden nacheinander geladen…`;
        const delay = Math.max(200, parseInt(delayInput.value || "1200", 10));

        const items = window.flpPlaylist.map((item, idx) => {
          const title = sanitizeFilename(item.title || `Track ${idx+1}`);
          const href = kind === "m4a"
            ? (item.m4a ? new URL(item.m4a, base).href : null)
            : (item.oga ? new URL(item.oga, base).href : null);
          let ext = kind === "m4a" ? ".m4a" : ".ogg";
          if (href) {
            const baseName = basename(href);
            const detectedExt = (baseName.match(/\.(m4a|mp4|ogg|oga)$/i) || [])[0];
            if (detectedExt) ext = detectedExt.toLowerCase();
          }
          const fileName = `${title}${ext}`;
          return { href, fileName, idx };
        }).filter(x => x.href);

        if (items.length === 0) {
          progress.textContent = `Keine ${kind.toUpperCase()}-Links gefunden.`;
          running = false; btnStop.style.display = "none";
          return;
        }

        // Hinweis an Nutzer (Popup-Blocker)
        alert(`Ich starte ${items.length} Downloads (${kind.toUpperCase()}).\nWenn Firefox fragt, erlaube mehrere Downloads von dieser Seite.`);

        for (let i = 0; i < items.length; i++) {
          if (stopFlag) { progress.textContent = `Abgebrochen bei ${i}/${items.length}.`; break; }
          const { href, fileName } = items[i];
          progress.textContent = `(${i+1}/${items.length}) Lade: ${fileName}`;
          clickDownload(href, fileName);
          // Delay zwischen Downloads
          await new Promise(r => setTimeout(r, delay));
        }

        if (!stopFlag) progress.textContent = `Fertig (${kind.toUpperCase()}).`;
        running = false; stopFlag = false;
        btnStop.style.display = "none";
      }

      btnAllM4A.onclick = () => downloadAll("m4a");
      btnAllOGG.onclick = () => downloadAll("ogg");
      btnStop.onclick = () => { stopFlag = true; };

      console.log("[FLP userscript] Download-Panel eingefügt (mit Download-all).");
    }
  });
})();
