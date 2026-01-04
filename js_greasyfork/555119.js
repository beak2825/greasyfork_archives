// ==UserScript==
// @name         GreasyFork Helper: Copy Install URL + Quick Filter
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Adds a "Copy Install URL" button on script pages and a quick filter box on listings.
// @author       you
// @match        https://greasyfork.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/555119/GreasyFork%20Helper%3A%20Copy%20Install%20URL%20%2B%20Quick%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/555119/GreasyFork%20Helper%3A%20Copy%20Install%20URL%20%2B%20Quick%20Filter.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const onReady = (fn) => {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  };

  function addCopyInstallButton() {
    // Script pages usually have an Install button with href ending in .user.js
    const installLink = document.querySelector('a[href$=".user.js"]');
    if (!installLink) return;

    // Avoid duplicates
    if (document.querySelector("#copy-install-url-btn")) return;

    const btn = document.createElement("button");
    btn.id = "copy-install-url-btn";
    btn.textContent = "Copy Install URL";
    btn.style.marginLeft = "8px";
    btn.style.padding = "6px 10px";
    btn.style.borderRadius = "8px";
    btn.style.border = "1px solid #ccc";
    btn.style.cursor = "pointer";
    btn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(installLink.href);
        btn.textContent = "Copied!";
        setTimeout(() => (btn.textContent = "Copy Install URL"), 1200);
      } catch (e) {
        alert("Could not copy to clipboard. URL:\n" + installLink.href);
      }
    });

    // Place it right after the Install button
    installLink.insertAdjacentElement("afterend", btn);
  }

  function addQuickFilterOnListings() {
    // listing pages include /scripts or have multiple script cards
    const scriptCards = document.querySelectorAll(
      'ul.script-list li, ul.user-script-list li, article[data-script-id]'
    );
    if (!scriptCards.length) return;

    // Avoid duplicates
    if (document.querySelector("#gf-quick-filter")) return;

    // Create filter UI
    const container =
      document.querySelector("main h2, main h1, header h1") ||
      document.querySelector("main") ||
      document.body;

    const wrapper = document.createElement("div");
    wrapper.style.display = "flex";
    wrapper.style.gap = "8px";
    wrapper.style.alignItems = "center";
    wrapper.style.margin = "8px 0 12px";

    const label = document.createElement("label");
    label.textContent = "Quick filter:";
    label.style.fontWeight = "600";

    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Type to filter by title or description…";
    input.id = "gf-quick-filter";
    input.style.flex = "1";
    input.style.padding = "6px 10px";
    input.style.border = "1px solid #ccc";
    input.style.borderRadius = "8px";

    wrapper.appendChild(label);
    wrapper.appendChild(input);
    container.parentNode.insertBefore(wrapper, container.nextSibling);

    const normalize = (s) => (s || "").toLowerCase();

    const getCardText = (card) => {
      const title =
        card.querySelector("a.link-overlay, h2 a, h3 a, .script-name a")?.textContent ||
        card.querySelector("h2, h3")?.textContent ||
        "";
      const desc =
        card.querySelector(".description, .script-description")?.textContent || "";
      return normalize(title + " " + desc);
    };

    const cache = new Map();
    scriptCards.forEach((c) => cache.set(c, getCardText(c)));

    const applyFilter = () => {
      const q = normalize(input.value.trim());
      scriptCards.forEach((c) => {
        const txt = cache.get(c);
        const show = !q || txt.includes(q);
        c.style.display = show ? "" : "none";
      });
    };

    input.addEventListener("input", applyFilter);
  }

  onReady(() => {
    addCopyInstallButton();
    addQuickFilterOnListings();

    // If GreasyFork dynamically navigates, observe for changes
    const obs = new MutationObserver(() => {
      addCopyInstallButton();
      addQuickFilterOnListings();
    });
    obs.observe(document.body, { childList: true, subtree: true });
  });
})();
