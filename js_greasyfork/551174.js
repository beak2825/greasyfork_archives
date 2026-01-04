// ==UserScript==
// @name         PaperIO 2 Teams Auto respawn
// @namespace    https://paperio.site/teams/
// @version      1.0.0
// @description  A simple script that just clicks a button whenever its found
// @author       You
// @match        https://paperio.site/teams/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=paperio.site
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/551174/PaperIO%202%20Teams%20Auto%20respawn.user.js
// @updateURL https://update.greasyfork.org/scripts/551174/PaperIO%202%20Teams%20Auto%20respawn.meta.js
// ==/UserScript==

setInterval(() => {
   if (document.getElementById("again")) {
      document.getElementById("again").click()
   }
}, 100)