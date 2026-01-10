// ==UserScript==
// @name         Add GitHub Releases Tab
// @namespace    https://github.com/nvbangg/nvbangg-tools
// @version      1.0
// @description  Add Releases tab after Code tab on GitHub repos
// @author       nvbangg (https://github.com/nvbangg)
// @copyright    Copyright (c) 2026 Nguyễn Văn Bằng (nvbangg, github.com/nvbangg)
// @match        https://github.com/*/*
// @icon         https://github.com/favicon.ico
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/562109/Add%20GitHub%20Releases%20Tab.user.js
// @updateURL https://update.greasyfork.org/scripts/562109/Add%20GitHub%20Releases%20Tab.meta.js
// ==/UserScript==

(() => {
  "use strict";

  const addReleasesTab = () => {
    const codeTab = document.getElementById("code-tab");
    if (!codeTab || document.getElementById("releases-tab")) return;

    const [owner, repo] = location.pathname.split("/").slice(1, 3);

    // Clone Code tab structure
    const li = codeTab.closest("li").cloneNode(true);
    const a = li.querySelector("a");

    // Update attributes
    a.id = "releases-tab";
    a.href = `/${owner}/${repo}/releases`;
    a.setAttribute("data-tab-item", "releases-tab");
    a.setAttribute("data-selected-links", `repo_releases /${owner}/${repo}/releases`);
    a.removeAttribute("aria-current");
    a.removeAttribute("data-hotkey");
    a.classList.remove("selected");

    // Update icon (tag icon)
    a.querySelector("svg").outerHTML = `<svg aria-hidden="true" height="16" width="16" viewBox="0 0 16 16" class="octicon octicon-tag UnderlineNav-octicon d-none d-sm-inline"><path d="M1 7.775V2.75C1 1.784 1.784 1 2.75 1h5.025c.464 0 .91.184 1.238.513l6.25 6.25a1.75 1.75 0 0 1 0 2.474l-5.026 5.026a1.75 1.75 0 0 1-2.474 0l-6.25-6.25A1.752 1.752 0 0 1 1 7.775Zm1.5 0c0 .066.026.13.073.177l6.25 6.25a.25.25 0 0 0 .354 0l5.025-5.025a.25.25 0 0 0 0-.354l-6.25-6.25a.25.25 0 0 0-.177-.073H2.75a.25.25 0 0 0-.25.25ZM6 5a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z"></path></svg>`;

    // Update text
    const span = a.querySelector("span[data-content]");
    span.textContent = "Releases";
    span.setAttribute("data-content", "Releases");

    codeTab.closest("li").after(li);
  };

  addReleasesTab();
  const observer = new MutationObserver(() => setTimeout(addReleasesTab, 100));
  observer.observe(document.body, { childList: true, subtree: true });
})();
