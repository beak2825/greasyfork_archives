// ==UserScript==
// @name         OpenFront.io - Control Panel Enhancement
// @namespace    https://github.com/antigrid/openfront-control-panel-enhancement
// @version      0.0.1
// @description  Displays current and remaining troop percentages in the control panel
// @author       antigrid (Discord: webdev.js)
// @match        https://*.openfront.io/*
// @match        https://*.openfront.dev/*
// @icon         https://cdnjs.cloudflare.com/ajax/libs/twemoji/16.0.1/svg/1f39b.svg
// @grant        none
// @license      MIT
// @homepageURL  https://github.com/antigrid/openfront-control-panel-enhancement
// @supportURL   https://github.com/antigrid/openfront-control-panel-enhancement/issues
// @downloadURL https://update.greasyfork.org/scripts/563121/OpenFrontio%20-%20Control%20Panel%20Enhancement.user.js
// @updateURL https://update.greasyfork.org/scripts/563121/OpenFrontio%20-%20Control%20Panel%20Enhancement.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const COLORS = {
    CRITICAL: "#f87171", // rgb(248,113,113) - Warm Red
    WARNING: "#fb923c",
    CAUTION: "#eab308", // rgb(234,179,8) - Sunflower
    GOOD: "#22c55e", // rgb(34,197,94) - Emerald
    EXCELLENT: "#22d3ee",
  };

  const THRESHOLDS = {
    LOW_CRITICAL: 9,
    LOW_WARNING: 18,
    LOW_CAUTION: 23,
    LOW_GOOD: 31,
    HIGH_GOOD: 54,
    HIGH_CAUTION: 64,
    HIGH_WARNING: 70,
    HIGH_CRITICAL: 82,
    REMAINING_CRITICAL: 15,
    REMAINING_WARNING: 23,
  };

  let cachedElements = {
    troopsRow: null,
    attackRatioContainer: null,
    currentPercentSpan: null,
    remainingPercentSpan: null,
  };

  function renderTroops(troops, fixedPoints) {
    let num = Number(troops) / 10;
    num = Math.max(num, 0);

    if (num >= 10_000_000) {
      const value = Math.floor(num / 100000) / 10;
      return value.toFixed(fixedPoints ?? 0) + "M";
    } else if (num >= 1_000_000) {
      const value = Math.floor(num / 10000) / 100;
      return value.toFixed(fixedPoints ?? 1) + "M";
    } else if (num >= 100000) {
      return Math.floor(num / 1000) + "K";
    } else if (num >= 10000) {
      const value = Math.floor(num / 100) / 10;
      return value.toFixed(fixedPoints ?? 0) + "K";
    } else if (num >= 1000) {
      const value = Math.floor(num / 10) / 100;
      return value.toFixed(fixedPoints ?? 1) + "K";
    } else {
      return Math.floor(num).toString();
    }
  }

  function getPercentageColor(percentage) {
    if (percentage < THRESHOLDS.LOW_CRITICAL || percentage > THRESHOLDS.HIGH_CRITICAL) {
      return COLORS.CRITICAL;
    }
    if (percentage < THRESHOLDS.LOW_WARNING || percentage > THRESHOLDS.HIGH_WARNING) {
      return COLORS.WARNING;
    }
    if (percentage < THRESHOLDS.LOW_CAUTION || percentage > THRESHOLDS.HIGH_CAUTION) {
      return COLORS.CAUTION;
    }
    if (percentage < THRESHOLDS.LOW_GOOD || percentage > THRESHOLDS.HIGH_GOOD) {
      return COLORS.GOOD;
    }
    return COLORS.EXCELLENT;
  }

  function findTroopsRow(panel) {
    const rows = panel.querySelectorAll(".flex.justify-between");
    for (const row of rows) {
      const valueSpan = row.querySelector('span[translate="no"]');
      if (valueSpan) {
        const rateSpan = valueSpan.querySelector('span[translate="no"]');
        if (rateSpan && rateSpan.textContent.includes("(+")) {
          return row;
        }
      }
    }
    return null;
  }

  function findAttackRatioContainer(panel) {
    const attackRatioInput = panel.querySelector("#attack-ratio");
    if (!attackRatioInput) return null;
    const container = attackRatioInput.closest(".relative.mb-0, .relative.mb-4");
    return container?.querySelector("label") || null;
  }

  function getOrCreateSpan(className, parent, position = "append") {
    let span = parent.querySelector(`.${className}`);
    if (!span) {
      span = document.createElement("span");
      span.className = className;
      span.style.fontSize = "12px";
      span.style.fontWeight = "normal";
      if (position === "prepend") {
        parent.insertBefore(span, parent.firstChild);
      } else {
        parent.appendChild(span);
      }
    }
    return span;
  }

  function updateDisplay(panel) {
    const player = panel.game?.myPlayer?.();
    if (!player) return;

    const troops = panel._troops ?? player.troops();
    const maxTroops = panel._maxTroops ?? panel.game.config().maxTroops(player);
    const attackRatio = panel.uiState?.attackRatio ?? panel.attackRatio ?? 0.2;

    const currentPct = (troops / maxTroops) * 100;
    const remainingTroops = troops * (1 - attackRatio);
    const remainingPct = (remainingTroops / maxTroops) * 100;

    if (!cachedElements.troopsRow || !panel.contains(cachedElements.troopsRow)) {
      cachedElements.troopsRow = findTroopsRow(panel);
      cachedElements.currentPercentSpan = null;
    }

    if (cachedElements.troopsRow) {
      const valueSpan = cachedElements.troopsRow.querySelector('span[translate="no"]');
      if (valueSpan) {
        cachedElements.currentPercentSpan = getOrCreateSpan("ofio-current-pct", valueSpan, "prepend");
        cachedElements.currentPercentSpan.textContent = `${currentPct.toFixed(0)}% `;
        cachedElements.currentPercentSpan.style.color = getPercentageColor(currentPct);
      }
    }

    if (!cachedElements.attackRatioContainer || !panel.contains(cachedElements.attackRatioContainer)) {
      cachedElements.attackRatioContainer = findAttackRatioContainer(panel);
      cachedElements.remainingPercentSpan = null;
    }

    if (cachedElements.attackRatioContainer) {
      const translateSpan = cachedElements.attackRatioContainer.querySelector('span[translate="no"]');
      if (translateSpan) {
        cachedElements.remainingPercentSpan = getOrCreateSpan("ofio-remaining-pct", translateSpan, "append");
        cachedElements.remainingPercentSpan.textContent = ` → ${remainingPct.toFixed(0)}% (${renderTroops(remainingTroops)})`;
        cachedElements.remainingPercentSpan.style.color =
          remainingPct > 55 ? COLORS.GOOD : getPercentageColor(remainingPct);
      }
    }
  }

  function patchControlPanel() {
    customElements.whenDefined("control-panel").then(() => {
      const panel = document.querySelector("control-panel");
      if (!panel) {
        const observer = new MutationObserver((_, obs) => {
          const el = document.querySelector("control-panel");
          if (el) {
            obs.disconnect();
            applyPatch(el);
          }
        });
        observer.observe(document.body, { childList: true, subtree: true });
        return;
      }
      applyPatch(panel);
    });
  }

  function applyPatch(panel) {
    const proto = panel.constructor.prototype;
    if (proto._ofioPatched) return;

    const originalUpdated = proto.updated;
    proto.updated = function (changedProps) {
      if (originalUpdated) originalUpdated.call(this, changedProps);
      try {
        updateDisplay(this);
      } catch (_) {}
    };

    proto._ofioPatched = true;
  }

  patchControlPanel();
})();
