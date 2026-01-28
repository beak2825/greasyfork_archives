// ==UserScript==
// @name         Redmine Template Generator
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Add a button to fill redmine template automatically when open a new ticket
// @author       Rick Chen
// @match        https://marketplace-redmine.timber.zndev.link:8443/projects/zyxel-ecommerce-platform/issues/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/564295/Redmine%20Template%20Generator.user.js
// @updateURL https://update.greasyfork.org/scripts/564295/Redmine%20Template%20Generator.meta.js
// ==/UserScript==

// Injects a "Template" button into the issue jsToolbar; on click fills #issue_description with the ticket template.

(function () {
  "use strict";

  // --- config: what to fill & where ---
  /** Markdown template pasted into the description field when the button is clicked. */
  const FILL_VALUE = `### 【Basic Info】
* **發生時間 (Time)**：YYYY/MM/DD HH:MM
* **發生頻率 (Frequency)**：(每次發生 / 機率發生)
* **環境與影響範圍 (Environment / Scope)**：
\`\`\`
**MAC/SN** : (若判斷與特定機器無關，請填影響N/A)
**Org** : (若判斷與ORG無關，請填N/A)
\`\`\`
* **特定帳號/機器**：(複製Circle User Info填資料)
\`\`\`
Account:
pineyi810905@yahoo.com.tw
Circle Account ID:
15
MZC Account ID:
N/A (Dashboard only)
PAYG:
disable
POSTPAY:
false
Country:
United States of America
Current Time:

\`\`\`



### [Description]
1.
2.



### [Expectation]
1.
2.



### [Autify Scenario link]

()

### [Additional Info]
(Log, Screenshots, Video, UIUX Web Chrome...)


### [Root Cause] 

`;
  /** Redmine issue description field id (textarea / contenteditable). */
  const TARGET_ID = "issue_description";

  /** Button icon as data URI SVG (document-with-lines), same look as other jstb_* toolbar buttons. */
  const ICON_SVG =
    "data:image/svg+xml," +
    encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>'
    );

  // --- UI: button styles & DOM ---
  /** Injects CSS so the template button shows only the icon (hide text). Run once per page. */
  function injectButtonStyle() {
    if (document.getElementById("tm-fill-desc-style")) return;
    const style = document.createElement("style");
    style.id = "tm-fill-desc-style";
    style.textContent = `
      #tm-fill-desc-btn {
        background-image: url("${ICON_SVG}");
        background-repeat: no-repeat;
        background-position: center;
        background-size: 16px 16px;
        min-width: 28px;
        min-height: 28px;
        padding: 0;
      }
      #tm-fill-desc-btn span {
        display: none;
      }
    `;
    document.head.appendChild(style);
  }

  /** Writes FILL_VALUE into #issue_description, then fires input/change so Redmine treats it as user typing. */
  function fillDescription() {
    const el = document.getElementById(TARGET_ID);
    if (!el) {
      alert("Element #issue_description not found.");
      return;
    }
    const prop = el.isContentEditable ? "textContent" : "value";
    el[prop] = FILL_VALUE;
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.dispatchEvent(new Event("change", { bubbles: true }));
  }

  /** Adds the template button + spacer to .jstElements toolbar. Returns true if added, false if already there or no toolbar. */
  function addButton() {
    if (document.getElementById("tm-fill-desc-btn")) return false;
    const toolbar = document.querySelector(".jstElements");
    if (!toolbar) return false;

    injectButtonStyle();

    const spacer = document.createElement("span");
    spacer.className = "jstSpacer";
    spacer.innerHTML = "&nbsp;";

    // Match jstb_* structure: icon via CSS, span text hidden, same tabindex/title as other toolbar buttons.
    const btn = document.createElement("button");
    btn.id = "tm-fill-desc-btn";
    btn.type = "button";
    btn.tabIndex = 200;
    btn.className = "jstb_filldesc";
    btn.title = "Template";
    const span = document.createElement("span");
    span.textContent = "Template";
    btn.appendChild(span);

    btn.addEventListener("click", fillDescription);
    toolbar.append(spacer, btn);
    return true;
  }

  // --- bootstrap ---
  /** Watches DOM for .jstElements, adds the button when it appears (e.g. New issue). Stops watching after first add. */
  function init() {
    const observer = new MutationObserver(() => {
      if (addButton()) observer.disconnect();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    addButton();
  }

  // Wait for DOM if needed, then start watching for the toolbar.
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
