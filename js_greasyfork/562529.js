// ==UserScript==
// @name         BBC Cricket API btn
// @namespace    tm-bbc-cricket-fixtures
// @version      2.7
// @author       JV
// @license      MIT
// @description  Přidá tlačítko do API do fixtures
// @match        https://www.bbc.com/sport/cricket/scores-fixtures*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/562529/BBC%20Cricket%20API%20btn.user.js
// @updateURL https://update.greasyfork.org/scripts/562529/BBC%20Cricket%20API%20btn.meta.js
// ==/UserScript==

(function () {

  function apiUrl(eventId) {
    return "https://web-cdn.api.bbci.co.uk/wc-poll-data/container/cricket-scorecard?eventUrn=" +
      encodeURIComponent("urn:bbc:sportsdata:cricket:event:" + eventId);
  }

  function open(url) {
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function run() {
    document.querySelectorAll('a[href^="/sport/cricket/scorecard/e-"]').forEach(cardA => {
      const m = cardA.getAttribute("href")?.match(/(e-\d+)/);
      if (!m) return;

      const li = cardA.closest("li");
      if (!li) return;

      if (li.querySelector('[data-json-badge="1"]')) return;

      const url = apiUrl(m[1]);

      li.style.position = "relative";

      const btn = document.createElement("button");
      btn.type = "button";
      btn.dataset.jsonBadge = "1";
      btn.textContent = "API";

      Object.assign(btn.style, {
        position: "absolute",
        right: "48px",
        bottom: "24px",
        padding: "8px 16px",
        background: "#FFD230",
        color: "#000",
        fontWeight: "900",
        borderRadius: "999px",
        border: "2px solid #000",
        boxShadow: "0 2px 6px rgba(0,0,0,.18)",
        letterSpacing: "0.06em",
        fontSize: "12px",
        cursor: "pointer",
        zIndex: "50"
      });

      const stop = (e) => {
        e.preventDefault();
        e.stopPropagation();
      };

      btn.addEventListener("mousedown", stop, true);

      btn.addEventListener("click", (e) => {
        stop(e);
        open(url);
      }, true);

      // middle click
      btn.addEventListener("auxclick", (e) => {
        if (e.button === 1) {
          stop(e);
          open(url);
        }
      }, true);

      li.appendChild(btn);
    });
  }

  run();
  new MutationObserver(run).observe(document.body, { childList: true, subtree: true });

})();