// ==UserScript==
// @name         116117 Arztsuche – Data Export (JSON)
// @name:en      116117 Arztsuche – Data Export (JSON)
// @name:de      116117 Arztsuche – Data Export (JSON)
// @namespace    https://github.com/Bergiu/Aerztesuche-Scripts
// @version      1.3
// @description  Adds an export button to arztsuche.116117.de to export the response of the "api/data" call as JSON.
// @description:en Adds an export button to arztsuche.116117.de to export the response of the "api/data" call as JSON.
// @description:de Fügt einen Export-Button zur Arztsuche hinzu, um die Antwort des "api/data" Aufrufs als JSON zu exportieren.
// @match        https://arztsuche.116117.de/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @author       Bergiu
// @homepageURL  https://github.com/Bergiu/Aerztesuche-Scripts
// @supportURL   https://github.com/Bergiu/Aerztesuche-Scripts/issues
// @downloadURL https://update.greasyfork.org/scripts/562284/116117%20Arztsuche%20%E2%80%93%20Data%20Export%20%28JSON%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562284/116117%20Arztsuche%20%E2%80%93%20Data%20Export%20%28JSON%29.meta.js
// ==/UserScript==

(function inject() {
  const script = document.createElement("script");
  script.textContent = `
  (function() {
    let lastCapturedData = null;

    function updateLinkState(hasData) {
      const link = document.getElementById("export-116117-link");
      if (!link) return;

      if (hasData) {
        link.style.cursor = "pointer";
        link.style.opacity = "1";
        link.title = "Klicken zum Herunterladen (JSON)";
      } else {
        link.style.cursor = "not-allowed";
        link.style.opacity = "0.5";
        link.title = "Warte auf Daten...";
      }
    }

    // --- XHR Hook ---
    const realXHR = window.XMLHttpRequest;
    window.XMLHttpRequest = function() {
      const xhr = new realXHR();
      let url = "";

      const realOpen = xhr.open;
      xhr.open = function(m, u) {
        url = u;
        return realOpen.apply(this, arguments);
      };

      xhr.addEventListener("load", () => {
        if (url && url.includes("api/data")) {
          try {
            lastCapturedData = xhr.responseText;
            console.log("[EXPORT JSON] Captured data from XHR:", url);
            updateLinkState(true);
          } catch(e) {
            console.warn("[EXPORT JSON] Failed to capture XHR data", e);
          }
        }
      });

      return xhr;
    };

    console.log("[EXPORT JSON] Hooks installed. Waiting for 'api/data'...");

    // --- Export Link Integration ---
    function createLink() {
      const link = document.createElement("div");
      link.id = "export-116117-link";
      // Use "link-like" class to match the PDF button style
      link.className = "link-like icon-text-comb-rev no-print";
      link.setAttribute("role", "button");
      link.setAttribute("tabindex", "0");

      // Layout styles to position it correctly in the flex container
      // margin-left: auto pushes it to the right (grouping with the Print button)
      // margin-right: 20px adds spacing between this link and the Print button
      link.style.marginLeft = "auto";
      link.style.marginRight = "20px";
      link.style.cursor = "not-allowed";
      link.style.opacity = "0.5";

      link.innerHTML = \`
        <span class="text-with-icon">Exportieren (JSON)
          <div class="inline-block icon-for-text">
            <!-- Simple SVG download icon -->
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" style="vertical-align: text-bottom; margin-left: 5px;">
              <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
              <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 0 0-.708.708l3 3z"/>
            </svg>
          </div>
        </span>
      \`;

      link.addEventListener("click", () => {
        if (!lastCapturedData) return;

        try {
          const blob = new Blob([lastCapturedData], { type: "application/json" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "116117-api-data.json";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          console.log("[EXPORT JSON] Download triggered");
        } catch(e) {
          alert("Error exporting data: " + e.message);
        }
      });

      return link;
    }

    function tryInsertLink() {
      const printBtn = document.getElementById("printBtn");
      // If print button is missing, we can't do anything
      if (!printBtn || !printBtn.parentNode) return;

      const exportLink = document.getElementById("export-116117-link");
      const csvLink = document.getElementById("export-116117-csv-link");

      const link = exportLink || createLink();

      // Check position: Must be before printBtn
      if (link.nextSibling !== printBtn || link.parentNode !== printBtn.parentNode) {
        console.log("[EXPORT JSON] Re-inserting export link to correct position...");
        if (link.parentNode) {
          link.parentNode.removeChild(link);
        }
        printBtn.parentNode.insertBefore(link, printBtn);
      }

      // Check margins
      if (csvLink && csvLink.parentNode === printBtn.parentNode) {
        // [CSV] [JSON] [Print] -> JSON needs marginLeft 0
        link.style.marginLeft = "0";
      } else {
        // [JSON] [Print] -> JSON needs marginLeft auto
        link.style.marginLeft = "auto";
      }

      // Update state
      updateLinkState(!!lastCapturedData);
    }

    // Observer to watch for the print button appearing or DOM changes
    const observer = new MutationObserver((mutations) => {
      // We check on every relevant mutation if the layout is correct
      tryInsertLink();
    });

    observer.observe(document.documentElement, { childList: true, subtree: true });

    // Initial check
    tryInsertLink();

  })();
  `;
  document.documentElement.appendChild(script);
  script.remove();
})();
