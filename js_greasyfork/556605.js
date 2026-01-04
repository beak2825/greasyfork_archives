// ==UserScript==
// @name         Reformat Post Permalinks - deltaruneboards.net
// @namespace    https://greasyfork.org/en/users/766248-snarp
// @version      0.5
// @description  Turns "Posted on:" links in post headers into normal working permalinks. 2025-11-22
// @author       snarp
// @match        https://deltaruneboards.net/*
// @downloadURL https://update.greasyfork.org/scripts/556605/Reformat%20Post%20Permalinks%20-%20deltaruneboardsnet.user.js
// @updateURL https://update.greasyfork.org/scripts/556605/Reformat%20Post%20Permalinks%20-%20deltaruneboardsnet.meta.js
// ==/UserScript==

/*

This userscript reformats post permalinks to look like this:

    <a title="Permalink" href="#entry92157" style="text-decoration:underline">Posted on:</a>

By default, they look like this:

    <a title="" href="#" onclick="link_to_post(92157); return false;" style="text-decoration:underline">Posted on:</a>

Clicking one does not set the browser URL to a working permalink URL. It 
instead opens a dialog allowing the user to manually copy a URL in this format:

    https://deltaruneboards.net/index.php?showtopic=2938&view=findpost&p=92157

Which, when entered into the browser address bar, will redirect to:

    https://deltaruneboards.net/index.php?showtopic=2938&st=90&#entry92157

This is unexpected behavior that makes acquiring the permalink more 
time-consuming than using built-in browser methods (right-clicking and 
selecting 'Copy link' or left-clicking and copying from the browser address 
bar).

*/

(function() {
  'use strict';

  function reformatPostPermalinks() {
    for (const pdiv of document.querySelectorAll("div.post-normal")) {
      // post ID is stored in a node directly before the post div: `<a name="entry92157"></a>`
      let pid = pdiv.previousElementSibling.getAttribute('name');
      let plink = pdiv.querySelector('span.postdetails a');
      plink.setAttribute('href', '#'+pid);
      plink.setAttribute('title', 'Permalink');
      plink.removeAttribute('onclick');
    }
  }

  reformatPostPermalinks();

})();