// ==UserScript==
// @name        CDRomance/RetroGameTalk -> Repo
// @description Automatically get redirected from old CDRomance/RetroGameTalk URLs to the current repo.
// @version     1.0
// @author      Blast Master
// @match       https://cdromance.org
// @match       https://cdromance.org/*
// @match       https://cdromance.com
// @match       https://cdromance.com/*
// @match       https://retrogametalk.com/repository
// @match       https://retrogametalk.com/repository/*
// @exclude		https://cdromance.org/news/moving-on/
// @run-at      document-start
// @license     MIT
// @namespace   https://greasyfork.org/users/700340
// @downloadURL https://update.greasyfork.org/scripts/562035/CDRomanceRetroGameTalk%20-%3E%20Repo.user.js
// @updateURL https://update.greasyfork.org/scripts/562035/CDRomanceRetroGameTalk%20-%3E%20Repo.meta.js
// ==/UserScript==

(function() {
    let newUrl = location.href;
    newUrl = newUrl.replace("retrogametalk.com/repository", "retrogametalk.com/repo");
    newUrl = newUrl.replace("cdromance.com", "retrogametalk.com/repo");
    newUrl = newUrl.replace("cdromance.org", "retrogametalk.com/repo");
    location.replace(newUrl);
})();