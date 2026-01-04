// ==UserScript==
// @name         myTT->clickTT
// @namespace    https://greasyfork.org/de/users/1521935-rr247
// @version      0.1.1
// @description  Leitet mytischtennis.de/click-tt/... früh auf click-tt.de um; fängt normale Klicks ab; funktioniert auch bei SPA-Navigation; für RTTVR-Gruppen 500207–500216 wird targetFed=RTTVR & championship=suedl.WW-RL 25/26 erzwungen.
// @author       RR
// @license      MIT
// @match        https://www.mytischtennis.de/*
// @match        https://mytischtennis.de/*
// @run-at       document-start
// @noframes
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/551467/myTT-%3EclickTT.user.js
// @updateURL https://update.greasyfork.org/scripts/551467/myTT-%3EclickTT.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // ===== Konfiguration =====
  const CLICKTT_SEG_RE = /\/(click-tt|clicktt)\//i;

  // Sonderlogik (wie von dir gewünscht)
  const SPECIAL_MIN   = 500207;
  const SPECIAL_MAX   = 500216;
  const SPECIAL_FED   = "RTTVR";         // targetFed
  const SPECIAL_LABEL = "suedl.WW-RL";   // championship-Präfix (vor " 25/26")

  // Verbandscode-Normalisierung für click-tt Subdomänen
  function normalizeAssoc(s) {
    const x = (s || "").toLowerCase();
    if (x === "byttv") return "bttv";
    if (x === "hettv") return "httv";
    if (x === "sbttv" || x === "battv") return "ttvbw";
    return x;
  }

  // "25--26" -> "25/26"
  function prettySeason(raw) {
    return (raw || "").replace(/--/g, "/");
  }

  function isMyTT(hostname) {
    const h = (hostname || "").replace(/^www\./i, "").toLowerCase();
    return h === "mytischtennis.de";
  }

  // Kern: baue Ziel-URL aus einem myTT-/click-tt/-Pfad
  function buildTargetFromPath(pathname) {
    if (!CLICKTT_SEG_RE.test(pathname)) return null;

    const parts = pathname.split("/").filter(Boolean);
    const idx   = parts.findIndex(p => p === "click-tt" || p === "clicktt");
    if (idx < 0 || parts.length < idx + 3) return null;

    const assocRaw = parts[idx + 1] || "";      // z.B. RTTVR
    const assoc    = normalizeAssoc(assocRaw);  // z.B. rttvr
    const assocUC  = assocRaw.toUpperCase();    // RTTVR
    const season   = prettySeason(parts[idx + 2] || ""); // 25/26
    const base     = `https://${assoc}.click-tt.de/cgi-bin/WebObjects/nuLigaTTDE.woa/wa/`;

    const mMeeting = pathname.match(/\/spielbericht\/(\d+)/i);
    const mGroup   = pathname.match(/\/gruppe\/(\d+)/i);
    const mClubT   = pathname.match(/\/verein\/(\d+)\/mannschaften/i);
    const mClubP   = pathname.match(/\/verein\/(\d+)\/mannschaftsmeldungen/i);

    function groupQuery(idStr) {
      const gid = parseInt(idStr, 10);
      if (!isNaN(gid) && gid >= SPECIAL_MIN && gid <= SPECIAL_MAX) {
        return `targetFed=${encodeURIComponent(SPECIAL_FED)}&championship=${encodeURIComponent(SPECIAL_LABEL + " " + season)}&group=${gid}`;
        // Ergebnis z.B.: targetFed=RTTVR&championship=suedl.WW-RL+25%2F26&group=500209
      }
      // Standard: "RTTVR 25/26"
      return `championship=${encodeURIComponent(assocUC + " " + season)}&group=${gid}`;
    }

    if (mMeeting) {
      return `${base}meetingReport?championship=${encodeURIComponent(assocUC + " " + season)}&meeting=${mMeeting[1]}`;
    }
    if (mGroup) {
      return `${base}groupPage?${groupQuery(mGroup[1])}`;
    }
    if (mClubT) {
      return `${base}clubTeams?championship=${encodeURIComponent(assocUC + " " + season)}&club=${mClubT[1]}`;
    }
    if (mClubP) {
      return `${base}clubPools?championship=${encodeURIComponent(assocUC + " " + season)}&club=${mClubP[1]}`;
    }
    return null;
  }

  // 1) Sofort-Redirect bei direktem Aufruf von .../click-tt/...
  function tryRedirectFromLocation() {
    if (!CLICKTT_SEG_RE.test(location.pathname)) return;
    const target = buildTargetFromPath(location.pathname);
    if (target && target !== location.href) {
      location.replace(target);
    }
  }
  tryRedirectFromLocation();

  // 2) Normale Klicks abfangen (auch Touch/Pointer), vor Seitenskripten
  function onPossibleClick(e) {
    const el = e.target && e.target.closest ? e.target.closest("a[href]") : null;
    if (!el) return;

    let href = el.getAttribute("href");
    if (!href) return;

    let abs;
    try { abs = new URL(href, location.href); } catch { return; }
    if (!isMyTT(abs.hostname)) return;
    if (!CLICKTT_SEG_RE.test(abs.pathname)) return;

    const target = buildTargetFromPath(abs.pathname);
    if (target) {
      e.preventDefault();
      e.stopImmediatePropagation();
      location.href = target; // same-tab
    }
  }
  ["click", "pointerup", "touchend"].forEach(type => {
    document.addEventListener(type, onPossibleClick, { capture: true, passive: false });
  });

  // 3) Alle (auch dynamisch eingefügten) Links im DOM auf direkte click-tt-URLs umschreiben
  function rewriteAnchor(a) {
    if (!a || a._nomytt_done) return;
    const href = a.getAttribute("href");
    if (!href) return;
    let abs;
    try { abs = new URL(href, location.href); } catch { return; }
    if (!isMyTT(abs.hostname)) return;
    if (!CLICKTT_SEG_RE.test(abs.pathname)) return;

    const target = buildTargetFromPath(abs.pathname);
    if (target) {
      a.removeAttribute("target");
      a.setAttribute("href", target);
      a._nomytt_done = true;
    }
  }
  function rewriteAll() {
    document.querySelectorAll("a[href]").forEach(rewriteAnchor);
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", rewriteAll, { once: true });
  } else {
    rewriteAll();
  }
  const mo = new MutationObserver(muts => {
    for (const m of muts) {
      if (m.type === "childList") {
        m.addedNodes && m.addedNodes.forEach(node => {
          if (node.nodeType === 1) {
            if (node.tagName === "A") rewriteAnchor(node);
            node.querySelectorAll && node.querySelectorAll("a[href]").forEach(rewriteAnchor);
          }
        });
      } else if (m.type === "attributes" && m.target.tagName === "A" && m.attributeName === "href") {
        rewriteAnchor(m.target);
      }
    }
  });
  mo.observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ["href"] });

  // 4) SPA-Navigation abfangen (pushState/replaceState/popstate)
  function maybeRedirectURL(urlLike) {
    let urlStr;
    if (typeof urlLike === "string") urlStr = urlLike;
    else if (urlLike && urlLike.href) urlStr = urlLike.href;
    else return;

    try {
      const u = new URL(urlStr, location.href);
      if (isMyTT(u.hostname) && CLICKTT_SEG_RE.test(u.pathname)) {
        const t = buildTargetFromPath(u.pathname);
        if (t && t !== location.href) location.replace(t);
      }
    } catch {}
  }
  const _ps = history.pushState;
  history.pushState = function (s, t, url) {
    maybeRedirectURL(url);
    return _ps.apply(this, arguments);
  };
  const _rs = history.replaceState;
  history.replaceState = function (s, t, url) {
    maybeRedirectURL(url);
    return _rs.apply(this, arguments);
  };
  window.addEventListener("popstate", () => tryRedirectFromLocation(), { capture: true });
})();