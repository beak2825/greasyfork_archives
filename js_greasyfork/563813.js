// ==UserScript==
// @name         PrairieTest → Exam Calendar (.ics)
// @namespace    prairie-tools
// @version      1.0
// @description  Export PrairieTest exam reservations to an ICS calendar file
// @match        https://us.prairietest.com/pt*
// @grant        none
// @author       cicero.elead.apollonius@gmail.com
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/563813/PrairieTest%20%E2%86%92%20Exam%20Calendar%20%28ics%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563813/PrairieTest%20%E2%86%92%20Exam%20Calendar%20%28ics%29.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // Utility: format date for ICS (UTC, YYYYMMDDTHHMMSSZ)
  function toICSDate(date) {
    return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  }

  // Utility: parse duration like "1 h 50 min" or "50 min"
  function parseDuration(text) {
    let hours = 0,
      minutes = 0;
    const hMatch = text.match(/(\d+)\s*h/);
    const mMatch = text.match(/(\d+)\s*min/);
    if (hMatch) hours = parseInt(hMatch[1]);
    if (mMatch) minutes = parseInt(mMatch[1]);
    return (hours * 60 + minutes) * 60 * 1000;
  }

  // Main extractor
  function extractExams() {
    const exams = [];
    document.querySelectorAll("li.list-group-item").forEach((li) => {
      const name = li.querySelector('[data-testid="exam"] a')?.innerText.trim();
      // if (!name || name.includes('Proficiency Exam')) return;

      const dateEl = li.querySelector(
        '[data-testid="date"] [data-format-date]'
      );
      const dateJson = dateEl?.getAttribute("data-format-date");
      let start = null;
      if (dateJson) {
        try {
          const dateInfo = JSON.parse(dateJson);
          start = new Date(dateInfo.date);
        } catch (e) {
          console.warn("Failed to parse date:", e);
        }
      }

      const durationText =
        li.querySelector(".col-xxl-4, .col-md-6.col-xs-12:last-child")
          ?.innerText || "";
      const duration = parseDuration(durationText);

      const location =
        li
          .querySelector('[data-testid="location"]')
          ?.innerText.trim()
          .replace(/\s+/g, " ") || "Unknown location";

      if (start) {
        const end = new Date(start.getTime() + duration);
        exams.push({ name, start, end, location });
      }
    });
    return exams;
  }

  // Build ICS file text
  function buildICS(exams) {
    const header = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//PrairieTest//Exam Export//EN",
    ].join("\n");

    const events = exams
      .map((e) =>
        [
          "BEGIN:VEVENT",
          `UID:${btoa(e.name + e.start.toISOString()).replace(
            /=/g,
            ""
          )}@prairietest.com`,
          `DTSTAMP:${toICSDate(new Date())}`,
          `DTSTART:${toICSDate(e.start)}`,
          `DTEND:${toICSDate(e.end)}`,
          `SUMMARY:${e.name}`,
          `LOCATION:${e.location}`,
          "END:VEVENT",
        ].join("\n")
      )
      .join("\n");

    const footer = "END:VCALENDAR";
    return [header, events, footer].join("\n");
  }

  // Download helper
  function downloadICS(content, filename = "PrairieTest_Exams.ics") {
    const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Inject UI button
  function addExportButton() {
    if (document.getElementById("exportExamsICS")) return;
    const btn = document.createElement("button");
    btn.textContent = "📅 Export Exams (.ics)";
    btn.id = "exportExamsICS";
    btn.className = "btn btn-primary mt-3";
    btn.style.position = "fixed";
    btn.style.bottom = "20px";
    btn.style.right = "20px";
    btn.style.zIndex = "9999";
    btn.onclick = () => {
      const exams = extractExams();
      if (!exams.length) {
        alert("No exams found (or all are Proficiency Exams).");
        return;
      }
      const ics = buildICS(exams);
      downloadICS(ics);
    };
    document.body.appendChild(btn);
  }

  // Wait for the table to load
  window.addEventListener("load", () => {
    addExportButton();
  });
})();
