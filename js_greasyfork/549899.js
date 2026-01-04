// ==UserScript==
// @name         Neopets: Daily Quest Links
// @namespace    https://github.com/saahphire/NeopetsUserscripts
// @version      1.4.3
// @description  Adds links to quickly complete daily quests
// @author       saahphire
// @homepageURL  https://github.com/saahphire/NeopetsUserscripts
// @homepage     https://github.com/saahphire/NeopetsUserscripts
// @match        *://*.neopets.com/questlog/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=neopets.com
// @license      The Unlicense
// @downloadURL https://update.greasyfork.org/scripts/549899/Neopets%3A%20Daily%20Quest%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/549899/Neopets%3A%20Daily%20Quest%20Links.meta.js
// ==/UserScript==

/*
•:•.•:•.•:•:•:•:•:•:•:••:•.•:•.•:•:•:•:•:•:•:•:•.•:•.•:•:•:•:•:•:•:••:•.•:•.•:•.•:•:•:•:•:•:•:•:•.•:•:•.•:•.••:•.•
..................................................................................................................
☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠂⠄⠄⠂☆
    This userscript adds links to the description of each daily quest. That way you can complete them faster.
    Once you click "Purchase Items", you'll buy an Icy Snowball for 5NP. If you have to buy more than one item,
    a link to the General Store will be next to that one. You may buy a Blue Short Hair Brush for 50 NP there.
    Enjoy! Like all of my scripts, this is Unlicensed.

    Thank you Panda Crab for your help with waitForLogToLoad! I literally couldn't have done it without you!

    ✦ ⌇ saahphire
☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠂⠄⠄⠂☆ ⠂⠄⠄⠂⠁⠁⠂⠄⠄⠂✦ ⠂⠄⠄⠂⠁⠁⠂⠄⠂⠄⠄⠂☆
..................................................................................................................
•:•.•:•.•:•:•:•:•:•:•:••:•.•:•.•:•:•:•:•:•:•:•:•.•:•.•:•:•:•:•:•:•:••:•.•:•.•:•.•:•:•:•:•:•:•:•:•.•:•:•.•:•.••:•.•
*/

const links = {
  "Purchase Item(s)":
    "https://www.neopets.com/faerieland/process_springs.phtml?obj_info_id=8428",
  "Spin the Wheel of Misfortune":
    "https://www.neopets.com/halloween/wheel/index.phtml",
  "Spin the Wheel of Excitement":
    "https://www.neopets.com/faerieland/wheel.phtml",
  "Spin the Wheel of Knowledge":
    "https://www.neopets.com/medieval/knowledge.phtml",
  "Spin the Wheel of Mediocrity":
    "https://www.neopets.com/prehistoric/mediocrity.phtml",
  "Customise your Neopet": "https://www.neopets.com/customise/",
  "Feed your Neopet": "https://www.neopets.com/inventory.phtml",
  "Groom your Neopet":
    "https://www.neopets.com/safetydeposit.phtml?obj_name=&category=10",
  "Play a game": "https://www.neopets.com/games/favourites.phtml",
  "Fish at Ye Olde Fishing Vortex": "https://www.neopets.com/water/fishing.phtml",
  "Try on an NC Wearable": "https://ncmall.neopets.com/mall/search.phtml?type=browse&cat=43&page=1&limit=24",
  "Fight in the Battledome": "https://www.neopets.com/dome/fight.phtml",
  "Play with your Neopet": "https://www.neopets.com/safetydeposit.phtml?obj_name=&category=5",
  "Read to your Neopet": "https://www.neopets.com/safetydeposit.phtml?obj_name=&category=6"
};

const makeLink = (quest) => {
  const text = quest.innerText;
  const url = links[text];
  if (!url) return;
  quest.innerHTML = `<a href="${url}">${text}</a>`;
  if (
    text === "Purchase Item(s)" &&
    document.querySelector(".ql-task-num").innerText[2] !== "1"
  ) {
    quest.insertAdjacentHTML(
      "beforeEnd",
      '<a href="https://www.neopets.com/generalstore.phtml"> (General Store)</a>',
    );
  }
};

function waitForLogToLoad(callback) {
  const selector = "#QuestLogStreakName"; //if this element is ready, the entire log should be ready
  const container = document.querySelector("#QuestLogContent"); //this appears immediately but has no children/content
  function tryRun() {
    const el = document.querySelector(selector);
    if (el && !el.dataset.processed) {
      el.dataset.processed = "true";
      callback();
    }
  }
  tryRun();
  const observer = new MutationObserver(() => {
    tryRun();
  });
  observer.observe(container, { childList: true, subtree: true });
}

const processQuestLog = () => document.querySelectorAll(".ql-task-description").forEach((quest) => makeLink(quest));

(function () {
  "use strict";
    waitForLogToLoad(processQuestLog); //processQuestLog is another function defined elsewhere
})();
