// ==UserScript==
// @name         Torn OC - Role Weights and Time Remaining to Plan
// @namespace    TornOCTimeLeft
// @author       Qfiffle based on JohnNash's script
// @version      6.0
// @description  Adds a weight box under each role in Organized Crimes (only if config exists) and highlights/sorts OCs by time left until a new member is needed.
// @match        https://www.torn.com/factions.php*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/548037/Torn%20OC%20-%20Role%20Weights%20and%20Time%20Remaining%20to%20Plan.user.js
// @updateURL https://update.greasyfork.org/scripts/548037/Torn%20OC%20-%20Role%20Weights%20and%20Time%20Remaining%20to%20Plan.meta.js
// ==/UserScript==

(function () {
  "use strict";

  /** CONFIGURATION OF WEIGHTS **/
  const WEIGHT_CONFIG = {
    "Mob Mentality": {
      "Looter 1": 34,
      "Looter 2": 26,
      "Looter 4": 23,
      "Looter 3": 18,
    },

    "Pet Project": {
      // no roles yet
    },

    "Cash Me If You Can": {
      "Thief 1": 50,
      "Lookout": 28,
      "Thief 2": 22,
    },

    "Best of the Lot": {},

    "Smoke and Wing Mirrors": {
      "Car Thief": 50,
      "Imitator": 24,
      "Hustler #2": 17,
      "Hustler #1": 9,
    },

    "Market Forces": {
      "Enforcer": 24,
      "Negotiator": 22,
      "Muscle": 20,
      "Lookout": 15,
      "Arsonist": 4,
    },

    "Gaslight the Way": {
      "Imitator #3": 42,
      "Imitator #2": 27,
      "Looter #3": 13,
      "Imitator #1": 9,
      "Looter #1": 9,
      "Looter #2": 0,
    },

    "Snow Blind": {
      "Hustler": 50,
      "Impersonator": 31,
      "Muscle #1": 10,
      "Muscle #2": 10,
    },

    "Stage Fright": {
      "Sniper": 44,
      "Muscle #1": 21,
      "Enforcer": 17,
      "Muscle #3": 10,
      "Lookout": 7,
      "Muscle #2": 2,
    },

    "Leave No Trace": {
      "Impersonator": 44,
      "Negotiator": 30,
      "Techie": 26,
    },

    "Counter Offer": {
      "Robber": 50,
      "Looter": 28,
      "Hacker": 22,
      "Picklock": 22,
      "Engineer": 22,
    },

    "No Reserve": {
      "Techie": 46,
      "Engineer": 39,
      "Car Thief": 39,
    },

    "Bidding War": {
      "Robber #3": 28,
      "Robber #2": 21,
      "Driver": 18,
      "Bomber #2": 16,
      "Bomber #1": 9,
      "Robber #1": 7,
    },

    "Honey Trap": {
      "Muscle #2": 43,
      "Muscle #1": 32,
      "Enforcer": 25,
    },

    "Clinical Precision": {
      "Imitator": 43,
      "Cleaner": 22,
      "Cat Burglar": 19,
      "Assassin": 16,
    },

    "Blast from the Past": {
      "Muscle": 36,
      "Engineer": 25,
      "Bomber": 19,
      "Picklock #1": 10,
      "Hacker": 9,
      "Picklock #2": 2,
    },

    "Break the Bank": {
      "Muscle #3": 32,
      "Thief #2": 29,
      "Muscle #1": 14,
      "Robber": 13,
      "Muscle #2": 11,
      "Thief #1": 2,
    },

    "Stacking the Deck": {
      "Imitator": 42,
      "Cat Burglar": 29,
      "Hacker": 25,
      "Driver": 4,
    },

    "Ace in the Hole": {
      "Hacker": 28,
      "Imitator": 23,
      "Muscle #2": 22,
      "Muscle #1": 20,
      "Driver": 7,
    },
  };

  /** HIDE THESE OCs COMPLETELY **/
  const HIDE_OC_NAMES = new Set(["Manifest Cruelty"]);

  /** STYLES **/
  const STYLE_ID = "oc-weights-style";
  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const css = `
      .oc-weight-box {
        margin-top: 6px;
        padding: 6px;
        text-align: center;
        border: 1px solid rgba(255,255,255,0.15);
        border-radius: 6px;
        background: rgba(255,255,255,0.03);
      }
      .oc-weight-box .label {
        display: block;
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: .05em;
        opacity: .8;
        padding-bottom: 3px;
        margin-bottom: 4px;
        border-bottom: 1px solid rgba(255,255,255,0.2);
      }
      .oc-weight-box .value {
        display: block;
        font-size: 16px;
        font-weight: 700;
        margin-top: 2px;
      }
      .oc-urgent {
        border: 2px solid #ff4d4d !important;
        box-shadow: 0 0 8px rgba(255,0,0,0.6);
      }
      .oc-needed-text { color: #ff4d4d; font-weight: bold; margin-top: 4px; }
      .oc-mine {
        outline: 2px solid rgba(255, 215, 0, 0.9);
        box-shadow: 0 0 10px rgba(255, 215, 0, 0.35);
        border-radius: 6px;
      }
    `;
    const st = document.createElement("style");
    st.id = STYLE_ID;
    st.textContent = css;
    document.head.appendChild(st);
  }

  // Shortcuts
  const q = (s, r = document) => r.querySelector(s);
  const qa = (s, r = document) => Array.from(r.querySelectorAll(s));

  // Debug switch
  const DEBUG = false;

  // Weak cache for expensive calculations
  const HOURS_CACHE = new WeakMap();

  // Observer & scheduling
  let obs = null;
  let rafScheduled = false;

  // Robustly read player name once from Torn's inline script tag or UI
  function getPlayerName() {
    const s = document.querySelector("script[playername]");
    if (s && s.getAttribute("playername")) {
      return s.getAttribute("playername").trim();
    }
    return null;
  }

  // Does this OC contain the current player?
  function ocContainsPlayer(ocRoot, playerName) {
    if (!playerName) return false;
    const nodes = ocRoot.querySelectorAll("a, span, div");
    for (const n of nodes) {
      const t = (n.textContent || "").trim();
      if (t === playerName) return true;
    }
    return false;
  }

  function getOCRootContainer() {
    return document.getElementById("faction-crimes-root") || document.body;
  }

  function scheduleScan() {
    if (rafScheduled) return;
    rafScheduled = true;
    requestAnimationFrame(() => {
      rafScheduled = false;
      scanPage();
    });
  }

  function getOCName(ocRoot) {
    const el = q(".panelTitle___aoGuV", ocRoot);
    return el ? el.textContent.trim() : null;
  }

  function shouldHideOC(ocRoot) {
    const name = getOCName(ocRoot);
    return !!(name && HIDE_OC_NAMES.has(name));
  }

  /**
   * Completed tab detector:
   * - You said every crime on the Completed tab shows SUCCESS or FAIL.
   * - So if any OC phase title contains exactly 'success' or 'fail', we skip sorting/reorder.
   */
  function isCompletedTab(root) {
    const spans = root.querySelectorAll(".phase___LcbAX .title___pB5FU span");
    for (const s of spans) {
      const t = (s.textContent || "").trim().toLowerCase();
      if (t === "success" || t === "fail") return true;
    }
    return false;
  }

  // Parse things like "24 hours" / "24hrs" / "1 hour" / "90 minutes"
  function parseDurationHours(text) {
    if (!text) return null;
    const t = String(text).trim().toLowerCase();

    // common "24hrs"
    const hrsShort = t.match(/(\d+(?:\.\d+)?)\s*hr?s\b/);
    if (hrsShort) return parseFloat(hrsShort[1]);

    const days = t.match(/(\d+(?:\.\d+)?)\s*day?s?\b/);
    const hours = t.match(/(\d+(?:\.\d+)?)\s*hour?s?\b/);
    const minutes = t.match(/(\d+(?:\.\d+)?)\s*minute?s?\b/);
    const seconds = t.match(/(\d+(?:\.\d+)?)\s*second?s?\b/);

    const d = days ? parseFloat(days[1]) : 0;
    const h = hours ? parseFloat(hours[1]) : 0;
    const m = minutes ? parseFloat(minutes[1]) : 0;
    const s = seconds ? parseFloat(seconds[1]) : 0;

    // If we found no units at all, bail
    if (!days && !hours && !minutes && !seconds) return null;

    return d * 24 + h + m / 60 + s / 3600;
  }

  /**
   * Read the "time until ready" from the OC phase element.
   * Example aria-label: "4 days 21 hours 59 minutes 34 seconds"
   * Returns hours (number) or Infinity if stalled.
   */
  function getTimeUntilReadyHours(ocRoot) {
    const title = ocRoot.querySelector('.phase___LcbAX .title___pB5FU[aria-label]');
    if (title) {
      const label = (title.getAttribute("aria-label") || "").trim();
      if (label && /stalled/i.test(label)) return Infinity;
      const parsed = parseDurationHours(label);
      if (parsed != null) return parsed;
    }

    // Fallback: some views may not have aria-label; try visible text
    const visible = ocRoot.querySelector(".phase___LcbAX .title___pB5FU");
    if (visible) {
      const txt = (visible.textContent || "").trim();
      if (txt && /stalled/i.test(txt)) return Infinity;
    }

    return null; // unknown
  }

  /**
   * Empty slot detection:
   * Your empty slot body contains .joinContainer___huqrk and a planningTime aria-label "24 hours"
   */
  function getEmptySlotsPlanningHours(ocRoot) {
    const slots = qa(".slotBody___oxizq", ocRoot);
    let total = 0;
    let emptyCount = 0;

    for (const s of slots) {
      const join = s.querySelector(".joinContainer___huqrk");
      if (!join) continue;

      emptyCount++;

      // Prefer the explicit planning time label (futureproof if not always 24h)
      const pt = join.querySelector(".planningTime___AqKIJ[aria-label]");
      const label = pt ? pt.getAttribute("aria-label") : null;
      const hours = parseDurationHours(label) ?? 24;
      total += hours;
    }

    return { emptyCount, totalHours: total };
  }

  /**
   * NEW time-needed logic (sequential planning):
   * timeUntilNeeded = timeUntilReady - sum(planningHours for empty slots)
   * - If no empty slots: Infinity (nobody needed)
   * - If ready time unknown: Infinity (don’t break sort; treat as bottom)
   * - If stalled and empty slots exist: 0 (needed now)
   */
    function calculateTimeUntilNeeded(ocRoot) {
        const { emptyCount, totalHours: emptyHours } = getEmptySlotsPlanningHours(ocRoot);
        if (emptyCount === 0) return Infinity;

        const readyHours = getTimeUntilReadyHours(ocRoot);

        // If the crime has no countdown yet (often completely empty / not started),
        // and there are empty slots, someone is needed now.
        if (readyHours == null) return 0;

        // If stalled and there are empty slots, needed now
        if (!isFinite(readyHours)) return 0;

        return Math.max(0, readyHours - emptyHours);
    }



  function calculateTimeUntilNeededCached(ocRoot) {
    const now = performance.now();
    const cached = HOURS_CACHE.get(ocRoot);
    if (cached && (now - cached.t < 250)) return cached.v;
    const v = calculateTimeUntilNeeded(ocRoot);
    HOURS_CACHE.set(ocRoot, { v, t: now });
    return v;
  }

  /**
   * Always show the "Needed in Xh" line on every OC.
   * Only red-outline when urgent.
   */
    function updateUrgentMarker(ocRoot, hours) {
        const isFiniteHours = Number.isFinite(hours);
        const urgent = isFiniteHours && hours <= 48 && hours >= 0;
        ocRoot.classList.toggle("oc-urgent", urgent);

        const titleEl = q(".panelTitle___aoGuV", ocRoot);
        if (!titleEl) return;

        let neededEl = q(".oc-needed-text", ocRoot);

        // If time is infinite, remove the text entirely
        if (!isFiniteHours) {
            if (neededEl) {
                neededEl.remove();
                delete ocRoot.dataset.ocUrgencyText;
            }
            return;
        }

        // Otherwise ensure the element exists
        if (!neededEl) {
            neededEl = document.createElement("div");
            neededEl.className = "oc-needed-text";
            titleEl.insertAdjacentElement("afterend", neededEl);
        }

        const display = `Needed in ${(Math.round(hours * 10) / 10).toFixed(1)}h`;

        if (ocRoot.dataset.ocUrgencyText !== display) {
            neededEl.textContent = display;
            ocRoot.dataset.ocUrgencyText = display;
        }
    }


  function addWeightBoxes(ocRoot) {
    const ocName = getOCName(ocRoot);
    if (!ocName) return;
    const weights = WEIGHT_CONFIG[ocName];
    if (!weights) return;

    const roles = qa(".wrapper___Lpz_D", ocRoot);
    for (const role of roles) {
      if (role.querySelector(".oc-weight-box")) continue;
      const roleName = (q(".title___UqFNy", role)?.textContent || "").trim();
      if (weights[roleName] == null) continue;

      const weight = weights[roleName];
      const box = document.createElement("div");
      box.className = "oc-weight-box";
      box.innerHTML = `
        <span class="label">Weight</span>
        <span class="value">${weight}%</span>
      `;
      role.appendChild(box);
    }
  }

  function reorder(container, orderedNodes) {
    const current = Array.from(container.children).filter((n) =>
      n.matches('div.wrapper___U2Ap7[data-oc-id]')
    );
    for (let i = 0; i < orderedNodes.length; i++) {
      const desired = orderedNodes[i];
      if (current[i] !== desired) {
        container.insertBefore(desired, current[i] || null);
        const from = current.indexOf(desired);
        if (from !== -1) current.splice(from, 1);
        current.splice(i, 0, desired);
      }
    }
  }

  function scanPage() {
    if (obs) obs.disconnect();

    try {
      injectStyles();

      const playerName = getPlayerName();
      const root = getOCRootContainer();
      const completedTab = isCompletedTab(root);

      const ocs = qa('div.wrapper___U2Ap7[data-oc-id]', root);

      const ocWithTimes = ocs
        .map((ocRoot) => {
          // Hide specific OCs completely
          if (shouldHideOC(ocRoot)) {
            ocRoot.style.display = "none";
            return null;
          } else if (ocRoot.style.display === "none") {
            ocRoot.style.display = "";
          }

          if (!ocRoot.dataset.ocProcessed) {
            ocRoot.dataset.ocProcessed = "true";
            addWeightBoxes(ocRoot);
          }

          const hours = calculateTimeUntilNeededCached(ocRoot);
          updateUrgentMarker(ocRoot, hours);

          const hasMe = ocContainsPlayer(ocRoot, playerName);
          ocRoot.classList.toggle("oc-mine", hasMe);

          if (DEBUG) {
            const name = getOCName(ocRoot) || "(unknown)";
            console.log(
              "OC:",
              name,
              "Needed in:",
              isFinite(hours) ? hours.toFixed(2) + "h" : "∞",
              "HasMe:",
              hasMe,
              "CompletedTab:",
              completedTab
            );
          }

          return { ocRoot, hours, hasMe };
        })
        .filter(Boolean);

      // Skip sort/reorder on Completed tab
      if (!completedTab) {
        ocWithTimes.sort((a, b) => {
          if (a.hasMe !== b.hasMe) return b.hasMe - a.hasMe; // mine first
          // Infinity sorts to end naturally
          return a.hours - b.hours;
        });

        const container = ocs[0]?.parentNode;
        if (container) reorder(container, ocWithTimes.map((x) => x.ocRoot));
      } else if (DEBUG) {
        console.log("OC script: Completed tab detected; skipping reorder.");
      }
    } finally {
      const root = getOCRootContainer();
      obs && obs.observe(root, { childList: true, subtree: true });
    }
  }

  // Initialize observer
  obs = new MutationObserver(() => scheduleScan());

  // Kick off once and start observing
  scheduleScan();
  obs.observe(getOCRootContainer(), { childList: true, subtree: true });
})();
