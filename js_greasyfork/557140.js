// ==UserScript==
// @name         ◓ Today
// @namespace    qp5.progress.weekdot
// @version      0.2
// @description  A visual birds eye view of today. Uses top of Browser as a timline of year. | NOTE: Select icon toggles outline.
// @icon         data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 60'><path d='M10 50 A40 40 0 0 1 90 50' fill='none' stroke='white' stroke-width='6'/><line x1='10' y1='50' x2='90' y2='50' stroke='white' stroke-width='6'/></svg>
// @match        *://*/*
// @run-at       document-idle
// @license      free use
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557140/%E2%97%93%20Today.user.js
// @updateURL https://update.greasyfork.org/scripts/557140/%E2%97%93%20Today.meta.js
// ==/UserScript==

// My other scripts:
// https://greasyfork.org/en/scripts/531444-tampermonkey-hide-header
// https://greasyfork.org/en/scripts/534417-refresh-script-qa-tool

(function () {
  const SIZE = 14; // px
  const DOT_ID = "__weekProgressDot__";

  if (document.getElementById(DOT_ID)) return;

  const dot = document.createElement("div");
  dot.id = DOT_ID;
  Object.assign(dot.style, {
    position: "fixed",
    top: "0px",
    left: "0px",
    width: SIZE + "px",
    height: Math.ceil(SIZE / 2) + "px",
    background: "#fff",
    borderTopLeftRadius: SIZE + "px",
    borderTopRightRadius: SIZE + "px",
    borderBottomLeftRadius: "0",
    borderBottomRightRadius: "0",
    boxSizing: "border-box",
    border: "1px solid #000",
    transform: "translateX(-50%)",
    zIndex: "2147483647",
    pointerEvents: "auto",
  });

  // toggle outline on click
  dot.addEventListener("click", (e) => {
    e.stopPropagation();
    dot.style.border = dot.style.border ? "" : "1px solid #000";
  });

  // place after body is ready
  const place = () => document.body && document.body.appendChild(dot);
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", place);
  } else {
    place();
  }

  // helper: same calendar day
  function sameDay(a, b) {
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  }

  // helper: US Thanksgiving (4th Thursday in November)
  function thanksgivingDate(year) {
    const d = new Date(year, 10, 1); // November 1
    const day = d.getDay(); // 0 = Sun ... 6 = Sat
    const offsetToThu = (4 - day + 7) % 7; // 4 = Thu
    d.setDate(1 + offsetToThu + 3 * 7); // 4th Thursday
    return d;
  }

  // list of holidays for a given year. //Month minuses 1 month
  function getHolidays(year) {
    return [
      new Date(year, 0, 1), // New Year’s
      new Date(year, 1, 14), // Valentine day
      new Date(year, 2, 17), // St. Patricks
      new Date(year, 3, 20), // Easter Sunday
      new Date(year, 4, 11), // Mother's Day
      new Date(year, 4, 26), // Mem Day
      new Date(year, 5, 15), // Father's Day
      new Date(year, 4, 26), // Mem Day
      new Date(year, 6, 4), //  Indepen Day
      new Date(year, 9, 31), // Halloween
      new Date(year, 10, 27), // Indepen Day
      new Date(year, 11, 25), // Christmas
    ];
  }

  // return info about holiday status for day 'd'
    // { color: "green"|"yellow"|null, kind: "holiday"|"pre"|null }
  function holidayInfo(d) {
    const year = d.getFullYear();
    const holidays = getHolidays(year);

    for (const h of holidays) {
      if (sameDay(d, h)) {
        return { color: "green", kind: "holiday" };
      }
      const prev = new Date(h);
      prev.setDate(prev.getDate() - 1);
      if (sameDay(d, prev)) {
        return { color: "yellow", kind: "pre" };
      }
    }

    return { color: null, kind: null };
  }

  // days until next holiday (this year or next)
  function daysUntilNextHoliday(d) {
    const start = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const msPerDay = 86400000;

    function scan(year) {
      let best = null;
      for (const h of getHolidays(year)) {
        const diff = h - start;
        if (diff >= 0 && (best === null || diff < best)) {
          best = diff;
        }
      }
      return best;
    }

    let diff = scan(start.getFullYear());
    if (diff === null) {
      diff = scan(start.getFullYear() + 1);
    }

    return diff === null ? null : Math.round(diff / msPerDay);
  }




  function weekOfYear(d) {
    // ISO-like: week starts Monday; simpler: use UTC to be stable
    const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const dayNum = t.getUTCDay() || 7;
    t.setUTCDate(t.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
    const week = Math.floor(((t - yearStart) / 86400000 + 1) / 7) + 1;
    return Math.max(1, Math.min(week, 52)); // clamp to 1..52
  }

  function positionDot() {
    const today = new Date();
    const w = Math.max(window.innerWidth, 1);
    const wk = weekOfYear(today); // 1..52
    const frac = (wk - 0.5) / 52; // middle of each week slot
    const x = Math.round(frac * w);
    dot.style.left = x + "px";

    const info = holidayInfo(today);

    if (info.color) {
      // holiday or day before
      dot.style.background = info.color;
      if (info.kind === "Holiday") {    //yellow
        dot.title = "Holiday today";    //green
      } else {
        dot.title = "Holiday tomorrow!";
      }
    } else {
      // normal day: show countdown
      dot.style.background = "#fff";
      const days = daysUntilNextHoliday(today);
      if (days === null) {
        dot.title = "No holidays found";
      } else if (days === 0) {
        dot.title = "Holiday";
      } else if (days === 1) {
        dot.title = "1 day before holiday";
      } else {
        dot.title = days + "Days before next holiday";
      }
    }
  }

  function scheduleNextDay() {
    const now = new Date();
    const next = new Date(now);
    next.setHours(24, 0, 2, 0);
    setTimeout(() => {
      positionDot();
      scheduleNextDay();
    }, next - now);
  }

  positionDot();
  scheduleNextDay();
})();
