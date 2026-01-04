// ==UserScript==
// @name         Ask First Highlighter
// @license      MIT
// @version      2.7
// @description  Highlights authors with an ask first policy
// @author       sunkitten_shash
// @require      http://code.jquery.com/jquery-3.5.1.min.js
// @include      https://archiveofourown.org/*
// @namespace https://greasyfork.org/users/847765
// @downloadURL https://update.greasyfork.org/scripts/551689/Ask%20First%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/551689/Ask%20First%20Highlighter.meta.js
// ==/UserScript==

const ASK_FIRST_USERS = [
  "psikeval",
  "bulletbulletbullet",
  "8BitSkeleton",
  "leebitcore",
  "pietrotheclown",
  "iilen",
  "LuckyDragon",
  "spacewitchbot",
  "fruti2flutie",
  "velooscuro",
  "widerthanthepacific",
  "trauma",
  "lightup",
  "magazinesoap",
  "alxndrblckbrn",
  "solarfyn",
  "TH1RDEYE",
  "idrilka",
  "violetpeche",
  "falloutgirl",
  "ozhaleegh",
  "dawnshine",
  "reasonwasoutforlunch",
  "tellmetheskyisblue",
  "collisiondust",
  "Minho_s_Socks",
  "straybees",
  "electric_stydiax",
  "violetlatte",
  "sacredonion",
  "sailorminbin",
  "dwaekinyz",
  "sideB_track2",
  "astroglia",
  "kirbysleeps",
  "bingchillen",
  "thelittlestbug",
  "naktoms",
  "finalizer",
  "polyskz",
  "judeiswriting",
  "unexploreduniverse",
  "fizzyren",
  "Wordsmith57",
];
const HIGHLIGHT_COLOR = "#f6b26b";
const user_regex =
  /https:\/\/archiveofourown\.org\/users\/([^/]+)(\/pseuds\/([^/]+))?/;

let users = {};

function waitForKeyElements(
  selectorTxt /* Required: The jQuery selector string that
                        specifies the desired element(s).
                    */,
  actionFunction /* Required: The code to run when elements are
                        found. It is passed a jNode to the matched
                        element.
                    */,
  bWaitOnce /* Optional: If false, will continue to scan for
                        new elements even after the first match is
                        found.
                    */,
  iframeSelector /* Optional: If set, identifies the iframe to
                        search.
                    */
) {
  var targetNodes, btargetsFound;

  if (typeof iframeSelector == "undefined") targetNodes = $(selectorTxt);
  else targetNodes = $(iframeSelector).contents().find(selectorTxt);

  if (targetNodes && targetNodes.length > 0) {
    btargetsFound = true;
    /*--- Found target node(s).  Go through each and act if they
            are new.
        */
    targetNodes.each(function () {
      var jThis = $(this);
      var alreadyFound = jThis.data("alreadyFound") || false;

      if (!alreadyFound) {
        //--- Call the payload function.
        var cancelFound = actionFunction(jThis);
        if (cancelFound) btargetsFound = false;
        else jThis.data("alreadyFound", true);
      }
    });
  } else {
    btargetsFound = false;
  }

  //--- Get the timer-control variable for this selector.
  var controlObj = waitForKeyElements.controlObj || {};
  var controlKey = selectorTxt.replace(/[^\w]/g, "_");
  var timeControl = controlObj[controlKey];

  //--- Now set or clear the timer as appropriate.
  if (btargetsFound && bWaitOnce && timeControl) {
    //--- The only condition where we need to clear the timer.
    clearInterval(timeControl);
    delete controlObj[controlKey];
  } else {
    //--- Set a timer, if needed.
    if (!timeControl) {
      timeControl = setInterval(function () {
        waitForKeyElements(
          selectorTxt,
          actionFunction,
          bWaitOnce,
          iframeSelector
        );
      }, 300);
      controlObj[controlKey] = timeControl;
    }
  }
  waitForKeyElements.controlObj = controlObj;
}

// Highlights the username links of bp authors, and minimises/hides works based on filtering settings
function modify_style(data) {
  if (data.exists) {
    for (const tag of this.tags) {
      $(tag).css({ color: HIGHLIGHT_COLOR });
    }
  } else {
    if (!filtering_enabled) {
      return;
    }

    for (const tag of this.tags) {
      if (!($(tag).attr("rel") === "author")) {
        continue;
      }

      var article = $(tag).closest("li[role=article]");
    }
  }
}

$(document).ready(async function () {
  // Find all mentions of archive users by iterating all links in page
  $("a").each(function () {
    let m = this.href.match(user_regex);

    // No match
    if (m === null) {
      return;
    }

    if (m[3] != undefined) {
      // Check using specific pseudonym
      if (!this.text.includes(decodeURI(m[3]))) {
        return;
      }
    } else {
      // No pseudonym, check using username
      if (!this.text.includes(decodeURI(m[1]))) {
        return;
      }
    }

    // Don't highlight usersnames that only appear in the kudos section
    if ($(this).parents("#kudos").length > 0) {
      return;
    }

    // Push username (not pseudonym) to list of users, no duplicates
    if (users.hasOwnProperty(m[1])) {
      users[m[1]].push(this);
    } else {
      users[m[1]] = [this];
    }
  });

  const found_users = Object.keys(users).filter((username) =>
    ASK_FIRST_USERS.includes(username)
  );
  found_users.forEach((user) =>
    modify_style.call({ tags: users[user] }, { exists: user })
  );
});

// Highlight users in comments after they are dynamically loaded
function check_tag(jNode) {
  var node = jNode[0];

  let m = node.href.match(user_regex);

  if (m === null) {
    return;
  }

  if (!node.text.includes(m[1])) {
    return;
  }

  if (ASK_FIRST_USERS.includes(m[1]))
    modify_style.call({ tags: [node] }, { exists: m[1] });
}

waitForKeyElements("#comments_placeholder a", check_tag, false);
