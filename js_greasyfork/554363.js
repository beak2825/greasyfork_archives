// ==UserScript==
// @name         Wider user sidebar on profile
// @namespace    https://gazellegames.net/
// @version      1.0
// @description  Increases the width of the bar with user info on the right side of user's profiles.  Allows for showing gold table without horizontal scrolling.
// @author       monkeys
// @license      MIT
// @match        https://gazellegames.net/user.php*
// @icon         https://gazellegames.net/favicon.ico
// @homepage     https://greasyfork.org/en/scripts/554363-wider-user-sidebar-on-profile
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/554363/Wider%20user%20sidebar%20on%20profile.user.js
// @updateURL https://update.greasyfork.org/scripts/554363/Wider%20user%20sidebar%20on%20profile.meta.js
// ==/UserScript==

(function () {

  GM_addStyle ( `
    div#content {
      width: 1400px;
    }
  ` );

  GM_addStyle ( `
    div.main_column {
      width: calc(100% - 420px);
    }
  ` );

  GM_addStyle ( `
    div.sidebar {
      width: 400px;
    }
  ` );

  GM_addStyle ( `
    table#box_gold_scrollbar {
      width: 380px;
    }
  ` );

})();
