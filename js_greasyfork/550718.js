// ==UserScript==
// @name         Elmoweb Report Enhancer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds floating indicator and sets tab title for Elmoweb reports
// @author       vacuity
// @license      MIT
// @match        http://elmoweb.prod.issapps.com/documents/*.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/550718/Elmoweb%20Report%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/550718/Elmoweb%20Report%20Enhancer.meta.js
// ==/UserScript==

(() => {
  // --- Utility functions ---

  const normalizeSpaces = (s) => (s || "").replace(/\u00A0/g, " ").replace(/\s+/g, " ").trim();

  const extractLabeledValue = (label) => {
    const candidates = Array.from(document.querySelectorAll("p.MicroforHeader"));
    for (const p of candidates) {
      const text = normalizeSpaces(p.textContent);
      if (text.toLowerCase().startsWith(label.toLowerCase() + ":")) {
        return normalizeSpaces(text.slice((label + ":").length));
      }
    }
    return null;
  };

  const MONTHS = {
    january: 1, february: 2, march: 3, april: 4, may: 5, june: 6,
    july: 7, august: 8, september: 9, october: 10, november: 11, december: 12
  };

  const toUSDate = (dstr) => {
    if (!dstr) return null;
    const s = normalizeSpaces(dstr);
    const m = s.match(/^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/);
    if (!m) return null;
    const day = parseInt(m[1], 10);
    const monthName = m[2].toLowerCase();
    const year = parseInt(m[3], 10);
    const monthNum = MONTHS[monthName];
    if (!monthNum) return null;
    const properMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);
    return `${properMonth} ${day}, ${year}`;
  };

  const getFirstFrontPageHeaderText = () => {
    const first = document.querySelector(".FrontPageHeaders");
    return first ? normalizeSpaces(first.textContent) : null;
  };

  const setDocumentTitle = (titleText) => {
    let titleEl = document.head.querySelector("title");
    if (!titleEl) {
      titleEl = document.createElement("title");
      document.head.appendChild(titleEl);
    }
    titleEl.textContent = titleText;
    document.title = titleText;
  };

  // --- Floating indicator (overlay) ---

  const INDICATOR_ID = "elmoweb-report-indicator";
  let overlayVisible = true;

  let scrolledToTopViaIndicator = false;
  let lastScrollYBeforeTop = 0;

  const smoothScrollTo = (y) => {
    const maxY = Math.max(0, (document.documentElement.scrollHeight || document.body.scrollHeight) - window.innerHeight);
    const target = Math.min(Math.max(0, y), maxY);
    window.scrollTo({ top: target, behavior: "smooth" });
  };

  const attachIndicatorClick = (box) => {
    box.addEventListener("click", (e) => {
      e.stopPropagation();
      if (!scrolledToTopViaIndicator) {
        lastScrollYBeforeTop = window.scrollY || window.pageYOffset || 0;
        scrolledToTopViaIndicator = true;
        smoothScrollTo(0);
      } else {
        scrolledToTopViaIndicator = false;
        smoothScrollTo(lastScrollYBeforeTop || 0);
      }
    });
  };

  const upsertIndicator = (text) => {
    let box = document.getElementById(INDICATOR_ID);
    if (!box) {
      box = document.createElement("div");
      box.id = INDICATOR_ID;

      box.style.position = "fixed";
      box.style.top = "8px";
      box.style.left = "50%";
      box.style.transform = "translateX(-50%)";
      box.style.zIndex = "2147483647";
      box.style.background = "rgba(255, 255, 255, 0.95)";
      box.style.color = "#111";
      box.style.fontFamily = "Segoe UI, Arial, sans-serif";
      box.style.fontSize = "10px";
      box.style.lineHeight = "1.35";
      box.style.border = "1px solid #ccc";
      box.style.borderRadius = "6px";
      box.style.boxShadow = "0 2px 8px rgba(0,0,0,0.15)";
      box.style.padding = "6px 10px";
      box.style.maxWidth = "80vw";
      box.style.textAlign = "center";
      box.style.pointerEvents = "auto";
      box.style.cursor = "pointer";
      box.style.userSelect = "none";

      document.documentElement.appendChild(box);
      attachIndicatorClick(box);
    }
    box.textContent = text;
    box.style.display = overlayVisible ? "block" : "none";
  };

  const buildTitleText = ({ reportTitle, meetingUS, publicationUS }) => {
    const details = [];
    if (meetingUS) details.push(`Meeting Date: ${meetingUS}`);
    if (publicationUS) details.push(`Publication Date: ${publicationUS}`);
    if (reportTitle && details.length) return `${reportTitle} (${details.join("; ")})`;
    if (reportTitle) return reportTitle;
    if (details.length) return details.join(" • ");
    return "Report";
  };

  const init = () => {
    const reportTitle = getFirstFrontPageHeaderText();
    const meetingRaw = extractLabeledValue("Meeting Date");
    const publicationRaw = extractLabeledValue("Publication Date");

    const meetingUS = toUSDate(meetingRaw);
    const publicationUS = toUSDate(publicationRaw);

    const titleText = buildTitleText({ reportTitle, meetingUS, publicationUS });

    setDocumentTitle(titleText);
    upsertIndicator(titleText);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
