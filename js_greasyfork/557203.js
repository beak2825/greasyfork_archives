// ==UserScript==
// @name         play-time-advanced-search
// @namespace    play-time-advanced-search.zero.nao
// @version      0.3
// @description  shows play time of users in torn.com
// @author       nao [2669774]
// @match        https://www.torn.com/page.php?sid=UserList*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @license      GPLv3

// @downloadURL https://update.greasyfork.org/scripts/557203/play-time-advanced-search.user.js
// @updateURL https://update.greasyfork.org/scripts/557203/play-time-advanced-search.meta.js
// ==/UserScript==

let api = "";
let rfc = getRFC();

async function getTime(id) {
  const url = `https://api.torn.com/v2/user/${id}/personalstats?key=${api}&stat=timeplayed&timestamp=`;

  const currentTimeSeconds = Math.floor(Date.now() / 1000);
  const prevDay1 = currentTimeSeconds - 86400;
  const prevDay2 = prevDay1 - 2592000;

  const playtime1Res = await $.getJSON(url + prevDay1);
  const playtime2Res = await $.getJSON(url + prevDay2);

  const playtime1 = playtime1Res.personalstats[0].value;
  const playtime2 = playtime2Res.personalstats[0].value;

  const t = playtime1 - playtime2;

  const average = t/30

  return average;
}

function convertTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  return minutes;
}

if (window.location.href.includes("UserList")) {
  $(document).on("click", ".level", async function () {
    const parent = $(this).parents("li");
    if (parent.length > 0) {
      const id = $("a[href*='profiles.php?XID=']", parent)
        .attr("href")
        .split("XID=")[1];
      const playtime = await getTime(id);
      const time = convertTime(playtime);
      $(this).attr("title", `Time played: ${time} minutes`);
      $(this).focus();
    }
  });
}
