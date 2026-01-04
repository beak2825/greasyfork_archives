// ==UserScript==
// @name         Lobste.rs Single click opener
// @namespace    selfdocumentingcode
// @version      0.2
// @description  Adds an [l+c] link that opens the url and the comments page in new tabs in one click. Inspired by Reddit Enhancement Suite (/r/Enhancement).
// @author       selfdocumentingcode@github
// @match        https://lobste.rs/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lobste.rs
// @license      MIT
// @grant        GM_openInTab
// @supportURL   https://github.com/selfdocumentingcode/my-random-scripts
// @homepageURL  https://github.com/selfdocumentingcode/my-random-scripts
// @downloadURL https://update.greasyfork.org/scripts/553888/Lobsters%20Single%20click%20opener.user.js
// @updateURL https://update.greasyfork.org/scripts/553888/Lobsters%20Single%20click%20opener.meta.js
// ==/UserScript==

(function () {
  "use strict";

  console.log(`Lobste.rs Single click opener script running ${new Date().toISOString()}`);

  const storiesListEl = document.querySelector("ol.stories.list");

  if(!storiesListEl) return;

  const storyListItemEls = storiesListEl.querySelectorAll("li.story");

  for (let i = 0; i < storyListItemEls.length; i++) {
    const li = storyListItemEls[i];

    const linkUrl = li.querySelector("a.u-url")?.href;

    if (!linkUrl) continue;

    const bylineEl = li.querySelector("div.byline");

    if (!bylineEl) continue;

    const commentsUrl = bylineEl.querySelector("span.comments_label > a")?.href;

    if (!commentsUrl) continue;

    const scOpenerElContainer = document.createElement("span");

    const separatorSpanEl = document.createElement("span");
    separatorSpanEl.appendChild(document.createTextNode(" | "));

    const lPlusCLink = document.createElement("a");
    lPlusCLink.href = "javascript:void(0)";
    lPlusCLink.text = "[l+c]";

    lPlusCLink.onclick = () => {
      // "active: false" opens the tab in the background
      // "insert: true" opens the tab next to the current active tab
      // https://violentmonkey.github.io/api/gm/#gm_openintab
      GM_openInTab(linkUrl, { active: false, insert: true });
      GM_openInTab(commentsUrl, { active: false, insert: true });
    };

    scOpenerElContainer.appendChild(separatorSpanEl);
    scOpenerElContainer.appendChild(lPlusCLink);

    bylineEl.appendChild(scOpenerElContainer);
  }
})();
