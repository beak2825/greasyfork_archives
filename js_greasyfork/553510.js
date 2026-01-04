// ==UserScript==
// @name         Auto Race
// @namespace    auto_race.biscuitius
// @version      1.0
// @description  Automatically repeats a custom 1-lap race on Industrial track
// @author       Biscuitius [1936433]
// @match        https://www.torn.com/page.php?sid=racing
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/553510/Auto%20Race.user.js
// @updateURL https://update.greasyfork.org/scripts/553510/Auto%20Race.meta.js
// ==/UserScript==

function getRFC() {
  var rfc = $.cookie("rfc_v");
  if (!rfc) {
    var cookies = document.cookie.split("; ");
    for (var i in cookies) {
      var cookie = cookies[i].split("=");
      if (cookie[0] == "rfc_v") {
        return cookie[1];
      }
    }
  }
  return rfc;
}

async function insert_buttons() {
  if (!$("#quick-race").length && $(".btn-wrap.silver.c-pointer").length) {
    let quickButtonHTML =
      "<button id='quick-race' class='torn-btn'>Quick Race</button>";
    $(".btn-wrap.silver.c-pointer").first().append(quickButtonHTML);
    $("#quick-race").on("click", () => start_race(1));
  }
  if (!$("#long-race").length && $(".btn-wrap.silver.c-pointer").length) {
    let longButtonHTML =
      "<button id='long-race' class='torn-btn'>Long Race</button>";
    $(".btn-wrap.silver.c-pointer").first().append(longButtonHTML);
    $("#long-race").on("click", () => start_race(100));
  }
  if (
    !$("#auto-race-toggle").length &&
    $(".btn-wrap.silver.c-pointer").length
  ) {
    let toggleButtonHTML =
      "<button id='auto-race-toggle' class='torn-btn'>Enable Auto Race</button>";
    $(".btn-wrap.silver.c-pointer").first().append(toggleButtonHTML);
    $("#auto-race-toggle").on("click", toggle_auto_race);
  }
}

function toggle_auto_race() {
  if ($("#auto-race-toggle").text() === "Enable Auto Race") {
    console.log("[Autorace] Autorace Enabled");
    $("#auto-race-toggle").text("Disable Auto Race");
    setInterval(() => start_race(1), 3000);
  } else {
    console.log("[Autorace] Autorace Disabled");
    $("#auto-race-toggle").text("Enable Auto Race");
    clearInterval(start_race);
  }
}

function start_race(lapCount) {
  $.post(
    `https://www.torn.com/page.php?sid=racing&tab=customrace&section=getInRace&step=getInRace&id=&carID=1129606&createRace=true&title=Quick%20Industrial&minDrivers=2&maxDrivers=2&trackID=15&laps=${lapCount}&minClass=5&carsTypeAllowed=1&carsAllowed=5&betAmount=0&waitTime=1761243018&rfcv=${getRFC()}`
  );
}

setInterval(insert_buttons, 500);