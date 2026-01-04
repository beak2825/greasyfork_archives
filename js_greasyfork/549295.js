// ==UserScript==
// @name        Remove upshop banner
// @namespace   my script
// @include     *upshop-company.atlassian.net/*
// @exclude     none
// @version     1.0.0
// @description:en	Removes upshop banner from page
// @grant       none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/549295/Remove%20upshop%20banner.user.js
// @updateURL https://update.greasyfork.org/scripts/549295/Remove%20upshop%20banner.meta.js
// ==/UserScript==

function deleteBanner() {
    var bannerstyles = document.getElementById('page-layout.banner');
    bannerstyles.childNodes[0].innerText = bannerstyles.childNodes[0].innerText.replace('64', '0');
    bannerstyles.childNodes[1].innerText = bannerstyles.childNodes[1].innerText.replace('64', '0');
}

function worker() {
  try {
      if(!hasRun) {
          deleteBanner();
      }
      hasRun = true;
      clearInterval(2000);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
  }
}
var hasRun = false;

setInterval(worker, 2000);
