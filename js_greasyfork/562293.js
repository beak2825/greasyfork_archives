// ==UserScript==
// @name         116117 Arztsuche – Data Export (CSV/Excel)
// @name:en      116117 Arztsuche – Data Export (CSV/Excel)
// @name:de      116117 Arztsuche – Data Export (CSV/Excel)
// @namespace    https://github.com/Bergiu/Aerztesuche-Scripts
// @version      1.2
// @description  Adds an export button to arztsuche.116117.de to export the list of doctors as CSV (Excel compatible).
// @description:en Adds an export button to arztsuche.116117.de to export the list of doctors as CSV (Excel compatible).
// @description:de Fügt einen Export-Button zur Arztsuche hinzu, um die Ärzteliste als CSV (Excel-kompatibel) zu exportieren.
// @match        https://arztsuche.116117.de/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @author       Bergiu
// @homepageURL  https://github.com/Bergiu/Aerztesuche-Scripts
// @supportURL   https://github.com/Bergiu/Aerztesuche-Scripts/issues
// @downloadURL https://update.greasyfork.org/scripts/562293/116117%20Arztsuche%20%E2%80%93%20Data%20Export%20%28CSVExcel%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562293/116117%20Arztsuche%20%E2%80%93%20Data%20Export%20%28CSVExcel%29.meta.js
// ==/UserScript==

(function inject() {
  const script = document.createElement("script");
  script.textContent = `
  (function() {
    let lastCapturedData = null;

    function updateLinkState(hasData) {
      const link = document.getElementById("export-116117-csv-link");
      if (!link) return;

      if (hasData) {
        link.style.cursor = "pointer";
        link.style.opacity = "1";
        link.title = "Klicken zum Herunterladen als CSV (Excel compatible)";
      } else {
        link.style.cursor = "not-allowed";
        link.style.opacity = "0.5";
        link.title = "Warte auf Daten...";
      }
    }

    // --- CSV Conversion Logic ---
    function escapeCsv(value) {
      if (value === null || value === undefined) {
        return '';
      }
      const stringValue = String(value);
      // Check for semicolon instead of comma since we are switching delimiters
      if (stringValue.includes(';') || stringValue.includes('"') || stringValue.includes('\\n')) {
        return '"' + stringValue.replace(/"/g, '""') + '"';
      }
      return stringValue;
    }

    function getDayName(dateString) {
      try {
        const date = new Date(dateString);
        return date.toLocaleDateString('de-DE', { weekday: 'short' });
      } catch (e) {
        return '';
      }
    }

    function convertToCsv(jsonData) {
      try {
        const data = JSON.parse(jsonData);
        if (!data.arztPraxisDatas || !Array.isArray(data.arztPraxisDatas)) {
            throw new Error('Invalid JSON structure: arztPraxisDatas array missing.');
        }

        const doctors = data.arztPraxisDatas;

        // 1. Collect all unique dates from all doctors
        const allDatesSet = new Set();
        doctors.forEach(doc => {
            if (doc.tsz && Array.isArray(doc.tsz)) {
                doc.tsz.forEach(day => {
                   if (day.d) allDatesSet.add(day.d);
                });
            }
        });
        // Sort dates chronologically
        const sortedDates = Array.from(allDatesSet).sort();

        // 2. Build Headers
        const baseHeaders = [
            'ID',
            'Titel',
            'Vorname',
            'Nachname',
            'Anrede',
            'Geschlecht',
            'Telefon',
            'Handy',
            'Email',
            'Webseite',
            'Strasse',
            'Hausnummer',
            'PLZ',
            'Ort',
            'Distanz (m)',
            'Fachgebiete',
            'Therapieverfahren',
            'Barrierefreiheit',
            'Sprachen'
        ];

        // Add date headers (e.g., "Mo 12.01.2026")
        const dateHeaders = sortedDates.map(d => {
            const dayName = getDayName(d);
            // Reformat YYYY-MM-DD to DD.MM.YYYY
            const parts = d.split('-');
            const formattedDate = (parts.length === 3) ? parts[2] + '.' + parts[1] + '.' + parts[0] : d;
            return dayName + ' ' + formattedDate;
        });

        const headers = [...baseHeaders, ...dateHeaders];

        // Use semicolon separator for Excel compatibility
        const csvRows = [headers.join(';')];

        // Type Mapping
        const TYPE_MAP = {
          "01": "Sprech",
          "02": "Sprech (o.T.)",
          "05": "Psych",
          "06": "Psych (o.T.)",
          "07": "Tel"
        };

        // Order for display logic
        const TYPE_ORDER = ["07", "01", "02", "05", "06"];

        doctors.forEach(doc => {
            const id = doc.id;
            const titel = doc.titel;
            const vorname = doc.vorname;
            const nachname = doc.name;
            const anrede = doc.anrede;
            const geschlecht = doc.geschlecht;
            const telefon = doc.tel;
            const handy = doc.handy;
            const email = doc.email;
            const web = doc.web;
            const strasse = doc.strasse;
            const hausnummer = doc.hausnummer;
            const plz = doc.plz;
            const ort = doc.ort;
            const distance = doc.distance;

            // Lists separated by comma
            const fachgebiete = (doc.fg || []).join(', ');

            const therapie = (doc.psy || []).map(p => {
                const heading = p.heading || '';
                const values = (p.values || []).join(', ');
                return values ? heading + ' (' + values + ')' : heading;
            }).join(', ');

            const barrierefreiheit = (doc.bf || []).map(b => b.value).join(', ');

            const sprachen = (doc.fs || []).join(', ');

            // Process Dates
            const dateCells = sortedDates.map(dateStr => {
                const dayObj = (doc.tsz || []).find(d => d.d === dateStr);
                if (!dayObj || !dayObj.typTsz || !Array.isArray(dayObj.typTsz)) {
                    return '';
                }

                // Collect lines for this cell
                const cellLines = [];

                // Group by sorted types
                TYPE_ORDER.forEach(typCode => {
                    const group = dayObj.typTsz.find(t => t.typ === typCode);
                    if (group && group.sprechzeiten && group.sprechzeiten.length > 0) {
                        const typeLabel = TYPE_MAP[typCode] || ('Type ' + typCode);
                        const times = group.sprechzeiten.map(s => s.z).join(', ');
                        cellLines.push(typeLabel + ': ' + times);
                    }
                });

                // Also check for any 'Unknown' types not in our map/order
                dayObj.typTsz.forEach(group => {
                   if (!TYPE_ORDER.includes(group.typ)) {
                        const typeLabel = TYPE_MAP[group.typ] || ('Type ' + group.typ);
                        const times = (group.sprechzeiten || []).map(s => s.z).join(', ');
                        if (times) {
                            cellLines.push(typeLabel + ': ' + times);
                        }
                   }
                });

                return cellLines.join('\\n');
            });

            const row = [
                id,
                titel,
                vorname,
                nachname,
                anrede,
                geschlecht,
                telefon,
                handy,
                email,
                web,
                strasse,
                hausnummer,
                plz,
                ort,
                distance,
                fachgebiete,
                therapie,
                barrierefreiheit,
                sprachen,
                ...dateCells
            ].map(escapeCsv).join(';');

            csvRows.push(row);
        });

        return csvRows.join('\\n');
      } catch (e) {
        console.error("CSV Conversion failed", e);
        throw e;
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
            console.log("[EXPORT CSV] Captured data from XHR:", url);
            updateLinkState(true);
          } catch(e) {
            console.warn("[EXPORT CSV] Failed to capture XHR data", e);
          }
        }
      });

      return xhr;
    };

    console.log("[EXPORT CSV] Hooks installed. Waiting for 'api/data'...");

    // --- Export Link Integration ---
    function createLink() {
      const link = document.createElement("div");
      link.id = "export-116117-csv-link";
      // Use "link-like" class to match the PDF button style
      link.className = "link-like icon-text-comb-rev no-print";
      link.setAttribute("role", "button");
      link.setAttribute("tabindex", "0");

      link.style.marginLeft = "auto";
      link.style.marginRight = "20px";
      link.style.cursor = "not-allowed";
      link.style.opacity = "0.5";

      link.innerHTML = \`
        <span class="text-with-icon">Exportieren (CSV/Excel)
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
          const csvContent = convertToCsv(lastCapturedData);
          // Add Byte Order Mark (BOM) for Excel to recognize UTF-8
          const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "116117-api-data.csv";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          console.log("[EXPORT CSV] Download triggered");
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

      const exportLink = document.getElementById("export-116117-csv-link");
      const jsonLink = document.getElementById("export-116117-link");

      // Determine the reference node (Target)
      // If JSON link exists and is in the same container, we insert before IT.
      // Otherwise we insert before the Print button.
      // This creates a stable order: [CSV Button] [JSON Button] [Print Button]
      const referenceNode = (jsonLink && jsonLink.parentNode === printBtn.parentNode)
                            ? jsonLink
                            : printBtn;

      // Check if the export link is already in the correct position
      if (exportLink && exportLink.nextSibling === referenceNode) {
        return; // Already in place
      }

      console.log("[EXPORT CSV] Re-inserting export link to correct position...");
      const link = exportLink || createLink();

      // Remove from old position if it exists elsewhere
      if (link.parentNode) {
        link.parentNode.removeChild(link);
      }

      // Insert directly before the reference node in the same container
      printBtn.parentNode.insertBefore(link, referenceNode);

      // Fix margins to ensure correct grouping on the right
      if (referenceNode === jsonLink) {
        // [CSV (auto)] [JSON (0)] [Print]
        link.style.marginLeft = "auto";    // CSV pushes everything to the right
        link.style.marginRight = "20px";   // Corrected spacing between buttons
        jsonLink.style.marginLeft = "0";   // JSON sticks to CSV
      } else {
        // [CSV (auto)] [Print]
        link.style.marginLeft = "auto";
        link.style.marginRight = "20px";
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
