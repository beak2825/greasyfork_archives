// ==UserScript==
// @name         Twitch: Theatre root height override (observer only)
// @namespace    local
// @version      1.0.8
// @description  Overrides html/body/#root height only while Theatre mode is enabled (no polling).
// @match        https://www.twitch.tv/*
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/560973/Twitch%3A%20Theatre%20root%20height%20override%20%28observer%20only%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560973/Twitch%3A%20Theatre%20root%20height%20override%20%28observer%20only%29.meta.js
// ==/UserScript==

(() => {
  const ID = "twitch-theatre-root-height-override";
  const HEIGHT = "0%";
  const CSS = `html,body,#root{height:${HEIGHT}!important}`;

  let s = document.getElementById(ID);
  if (!s) { s = document.createElement("style"); s.id = ID; document.head.appendChild(s); }

  let last = null;
  const isOn = () => {
    const b = document.querySelector('button[aria-label*="Theatre Mode"]');
    return !!(b && /exit theatre mode/i.test(b.getAttribute("aria-label") || ""));
  };
  const apply = () => {
    const on = isOn();
    if (on !== last) { last = on; s.textContent = on ? CSS : ""; }
  };

  const mo = new MutationObserver(apply);
  mo.observe(document.documentElement, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ["aria-label"],
  });

  apply();
})();