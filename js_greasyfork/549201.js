// ==UserScript==
// @name         AZNude: Auto-switch to highest quality video
// @version      0.1.1
// @description  AZNude auto pick highest quality (you can edit the priority order if you have different preferences; written 
// @license MIT
// @match        https://*.aznude.com/*
// @run-at       document-idle
// @grant        none
// @namespace https://greasyfork.org/users/45933
// @downloadURL https://update.greasyfork.org/scripts/549201/AZNude%3A%20Auto-switch%20to%20highest%20quality%20video.user.js
// @updateURL https://update.greasyfork.org/scripts/549201/AZNude%3A%20Auto-switch%20to%20highest%20quality%20video.meta.js
// ==/UserScript==

/* jshint esversion: 11 */

(function () {
   // ✍️ Edit your priority list here (case-insensitive). Put most-preferred first.
   const PRIORITY_ORDER = ["2160p", "1440p", "1080p", "hd", "720p", "540p", "480p", "hq", "360p", "lq", "270p", "auto"];
   // hq=[360p..480p] [Based on what I've seen/unknown] so hq is preferred to 360 but not 480 (IF this is exhaustive)
   // lq=[360p..360p] [Based on what I've seen/unknown] GUESSING this is 270..360 but no evidence; placing in between
   // hd=[720p..1080p] [Based on what I've seen/unknown] GUESSING this is >= 720 but unsure
   // NOTE: I've never seen explicit resolutions mixed with "descriptive" ones (lq/hq/hd) so maybe this doesn't matter.
   // Auto is at end since we want to pick explicitly

   // --- helpers ---
   const n = s => (s || "").trim().toLowerCase();
   const uniq = a => Array.from(new Set(a));
   const debounce = (fn, ms = 120) => { let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); }; };

   function applyByPriority(p, why = "manual") {
      if (!p?.getQualityLevels) return false;

      const levels = p.getQualityLevels() || [];
      if (!levels.length) return false;

      // Build label arrays preserving originals
      const original = levels.map(l => l.label ?? "");
      const labelsLC = original.map(n);
      const allowedLC = PRIORITY_ORDER.map(n);

      // Validate: every seen label must be in your list (case-insensitive), but show ORIGINAL labels in the popup
      const unknownIdxs = labelsLC
      .map((lab, i) => ({ i, lab }))
      .filter(x => !allowedLC.includes(x.lab))
      .map(x => x.i);

      if (unknownIdxs.length) {
         const unknownOriginals = uniq(unknownIdxs.map(i => original[i] || "(empty)"));
         const allOriginals = uniq(original);
         alert(
            `⚠️ AZNude-HiQ: Your PRIORITY_ORDER is missing these quality entries:\n\n` +
            `  • ${unknownOriginals.join("\n  • ")}\n\n` +
            `Available on this page:\n  • ${allOriginals.join("\n  • ")}\n\n` +
            `Add the missing ones (any case) to PRIORITY_ORDER in the userscript, then reload.`
         );
         return true; // handled
      }

      // Pick the first label from your priority list that exists on this page
      const pickLC = allowedLC.find(lc => labelsLC.includes(lc));
      if (!pickLC) return false;

      const targetIndex = labelsLC.indexOf(pickLC);
      const currentIndex = p.getCurrentQuality?.();

      if (currentIndex === targetIndex) return true; // already correct

      // Try to set; guard against JW race with a verify+retry (once)
      const trySet = (attempt = 1) => {
         try {
            p.setCurrentQuality(targetIndex);
         } catch (e) {
            // swallow and retry once slightly later
         }
         // verify after a short tick
         setTimeout(() => {
            const cur = p.getCurrentQuality?.();
            if (cur !== targetIndex && attempt < 2) {
               // One more attempt after JW stabilizes
               trySet(attempt + 1);
            }
         }, attempt === 1 ? 60 : 180);
      };

      trySet(1);
      return true;
   }

   function wire() {
      if (!window.jwplayer) return;

      // Find a jwplayer instance that has levels
      const ids = ["player", ...Array.from(document.querySelectorAll("[id]")).map(e => e.id)];
      let p = null;
      for (const id of ids) {
         try { const cand = jwplayer(id); if (cand?.getQualityLevels) { p = cand; break; } } catch {}
      }
      if (!p) return;

      if (p.__hiq_v21) return; // already wired
      p.__hiq_v21 = true;

      const run = () => applyByPriority(p, "event");
      const runDebounced = debounce(run, 80);

      // Run now and on key JW milestones, but avoid recursion storms
      setTimeout(run, 0);
      p.on?.("levels", runDebounced);   // list becomes available or changes
      p.on?.("ready", runDebounced);    // player ready
      p.on?.("play",  () => setTimeout(run, 40)); // just after playback starts
   }

   const kick = () => { try { wire(); } catch {} };

   // Initial + observe SPA/lazy loads
   kick();
   const mo = new MutationObserver(debounce(kick, 120));
   mo.observe(document.documentElement, { childList: true, subtree: true });
   document.addEventListener("play", debounce(kick, 120), true);
})();