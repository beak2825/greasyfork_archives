// ==UserScript==
// @name             reddit redact deverbalise
// @description      replace annoying redact deletion messages with just "[deleted by user]"
// @match            https://*.reddit.com/*
// @version          1.0
// @license          WTFPL
// @namespace https://greasyfork.org/users/1538977
// @downloadURL https://update.greasyfork.org/scripts/556161/reddit%20redact%20deverbalise.user.js
// @updateURL https://update.greasyfork.org/scripts/556161/reddit%20redact%20deverbalise.meta.js
// ==/UserScript==

function fuckRedactAtLeastTellMeItsDeleted() {
  const emNodeGen = document.evaluate('//em[text()="This post was mass deleted and anonymized with "]', document.body);

  while (true) {
    const nextNode = emNodeGen.iterateNext();
    if (!nextNode) { break; }

    nextNode.closest('div[slot="comment"] > div').innerHTML = '<p style="color:#bbb">[deleted by user]</p>';
  }
}

const muto = new MutationObserver(fuckRedactAtLeastTellMeItsDeleted);
muto.observe(document.body, { subtree: true, childList: true });