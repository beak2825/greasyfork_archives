// ==UserScript==
// @name         Add GitHub Releases Tab
// @namespace    https://github.com/nvbangg/nvbangg-tools
// @version      1.1
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
    // Find repo navigation and exit if Releases tab exists
    const nav = document.querySelector('nav[aria-label="Repository"]');
    if (!nav || nav.querySelector('a[href*="/releases"]')) return;

    const codeTabLi = nav.querySelector("li.prc-UnderlineNav-UnderlineNavItem-syRjR");
    const [owner, repo] = location.pathname.split("/").slice(1, 3);
    if (!codeTabLi || !owner || !repo) return;

    // Clone Code tab and update link
    const releasesLi = codeTabLi.cloneNode(true);
    const link = releasesLi.querySelector("a");

    link.href = `/${owner}/${repo}/releases`;
    link.removeAttribute("aria-current");
    link.removeAttribute("data-hotkey");
    link.removeAttribute("data-react-nav");
    link.removeAttribute("data-react-nav-anchor");
    link.setAttribute("data-turbo-frame", "repo-content-turbo-frame");

    // Update icon to tag
    const icon = link.querySelector('span[data-component="icon"]');
    if (icon) {
      icon.innerHTML = `<svg aria-hidden="true" focusable="false" class="octicon octicon-tag" viewBox="0 0 16 16" width="16" height="16" fill="currentColor" display="inline-block" overflow="visible" style="vertical-align:text-bottom"><path d="M1 7.775V2.75C1 1.784 1.784 1 2.75 1h5.025c.464 0 .91.184 1.238.513l6.25 6.25a1.75 1.75 0 0 1 0 2.474l-5.026 5.026a1.75 1.75 0 0 1-2.474 0l-6.25-6.25A1.752 1.752 0 0 1 1 7.775Zm1.5 0c0 .066.026.13.073.177l6.25 6.25a.25.25 0 0 0 .354 0l5.025-5.025a.25.25 0 0 0 0-.354l-6.25-6.25a.25.25 0 0 0-.177-.073H2.75a.25.25 0 0 0-.25.25ZM6 5a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z"></path></svg>`;
    }

    // Update text to "Releases"
    const text = link.querySelector('span[data-component="text"]');
    if (text) {
      text.textContent = "Releases";
      text.setAttribute("data-content", "Releases");
    }

    codeTabLi.after(releasesLi);
  };

  addReleasesTab();
  const observer = new MutationObserver(() => setTimeout(addReleasesTab, 100));
  observer.observe(document.body, { childList: true, subtree: true });
})();
