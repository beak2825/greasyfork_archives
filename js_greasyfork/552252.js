// ==UserScript==
// @name         KCMC Mission Importer
// @namespace    http://tampermonkey.net/
// @version      2025-10-11.03
// @description  Allow import quest data exported from the Quest Plugin 2 for Poi Browser into Tsunkit Mission Control site. Also export data for TsukinoHashi site.
// @author       You
// @match        https://tsunkit.net/quests/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tsunkit.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/552252/KCMC%20Mission%20Importer.user.js
// @updateURL https://update.greasyfork.org/scripts/552252/KCMC%20Mission%20Importer.meta.js
// ==/UserScript==

function _importQuests(questList, unlocksMap, allQuests) {
  // build requirements map
  const requirementsMap = {};
  for (const [questId, unlocks] of Object.entries(unlocksMap)) {
    for (const unlockId of unlocks) {
      if (!(unlockId in requirementsMap)) {
        requirementsMap[unlockId] = [];
      }
      requirementsMap[unlockId].push(Number(questId));
    }
  }
  // initialize quest statuses
  const questStatuses = {};
  for (const quest of questList) {
    questStatuses[quest.api_no.toString()] = "unlocked";
  }
  while (true) {
    let before = JSON.stringify(questStatuses);
    // if a quest is unlocked or completed, mark its prerequisites as completed
    for (const [quest, status] of Object.entries(questStatuses)) {
      if (status === "unlocked" || status === "completed") {
        let prevQuests = requirementsMap[quest] || [];
        for (const prevQuest of prevQuests) {
          console.log(
            `Unlocking ${prevQuest} because of the succeesor ${quest} is ${status}`
          );

          questStatuses[prevQuest.toString()] = "completed";
        }
      }
    }

    if (before === JSON.stringify(questStatuses)) {
      break;
    }
    // if a quest should be unlocked(all its prerequisites are completed), but it is not unlocked or completed, mark it as completed
    for (const quest of allQuests) {
      if (
        questStatuses[quest] !== "unlocked" &&
        questStatuses[quest] !== "completed"
      ) {
        let prevQuests = requirementsMap[quest] || [];
        if (
          prevQuests.every((q) => questStatuses[q.toString()] === "completed")
        ) {
          console.log(
            `Unlocking ${quest} because all prerequisites ${prevQuests.join(
              ", "
            )} are completed`
          );
          questStatuses[quest] = "completed";
        }
      }
    }
    if (before === JSON.stringify(questStatuses)) {
      break;
    }
  }
  return Object.entries(questStatuses)
    .filter(([_, status]) => status === "completed")
    .map(([quest, status]) => Number(quest));
}

function importQuests() {
  let questListJson = window.prompt(
    "Please paste the quest list JSON exported from poi plugin Quest Info 2:"
  );
  if (!questListJson) {
    return;
  }
  let questList = JSON.parse(questListJson);
  let unlocksMap = window.localStorage.quests_unlocks;
  unlocksMap = JSON.parse(unlocksMap);
  if (!unlocksMap) {
    alert("No unlocks map found in localStorage.");
    return;
  }
  // manual fixes for unlocksMap
  {
    // remove 874 from 186
    if (unlocksMap["186"]) {
      unlocksMap["186"] = unlocksMap["186"].filter((id) => id !== 874);
    }
  }
  let allQuests = Object.values(
    JSON.parse(window.localStorage.quests_ja || window.localStorage.quests_en)
  )
    .filter(
      (q) =>
        !q.unimported &&
        !q.unavailable &&
        !q.unverified &&
        q.catagory !== "expedition"
    )
    .map((q) => q.game_id.toString());
  window.localStorage.quests_completed = JSON.stringify(
    _importQuests(questList, unlocksMap, allQuests)
  );
  alert("Quest import completed.");
  window.location.reload();
}

function waitUntilElement(selector, timeout = 60_000) {
  return new Promise((resolve, reject) => {
    const interval = 100;
    let elapsed = 0;
    const timer = setInterval(() => {
      const element = document.querySelector(selector);
      if (element) {
        clearInterval(timer);
        resolve(element);
      }
      elapsed += interval;
      if (elapsed >= timeout) {
        clearInterval(timer);
        reject(new Error("Element not found: " + selector));
      }
    }, interval);
  });
}

function exportForTsukinoHashi() {
  let completedIds = JSON.parse(window.localStorage.quests_completed || "[]");
  let completedQuestWikiId = Object.values(
    JSON.parse(window.localStorage.quests_ja || window.localStorage.quests_en)
  )
    .filter(
      (q) =>
        !q.unimported &&
        !q.unavailable &&
        !q.unverified &&
        q.catagory !== "expedition" &&
        q.frequency === "onetime" &&
        completedIds.includes(q.game_id)
    )
    .map((q) => q.wiki_id.toString());
  let recorder = Object.fromEntries([..."ABCDEFG"].map((c) => [c, []]));
  for (const id of completedQuestWikiId) {
    let firstChar = id.charAt(0);
    if (!(firstChar in recorder)) {
      continue;
    }
    let remaining = id.slice(1);
    let numId = parseInt(remaining, 10) - 1;
    let bucket = Math.floor(numId / 4);
    // extend the recorder array if necessary
    while (recorder[firstChar].length <= bucket) {
      recorder[firstChar].push(0);
    }
    recorder[firstChar][bucket] |= 1 << (3 - (numId % 4));
  }
  console.log(recorder);

  let result = `https://tsukinohashi.com/mission-manager/?`;
  for (const [char, buckets] of Object.entries(recorder)) {
    if (buckets.length % 2 === 1) {
      buckets.push(0);
    }
    result += `${char.toLowerCase()}=`;
    result += buckets.map((b) => b.toString(16)).join("");
    result += "&";
  }
  result = result.slice(0, -1); // remove last &
  prompt("Here is the URL to import into TsukinoHashi:", result);
}

async function main() {
  await waitUntilElement(".ribbon-tabwell");
  if (
    document.querySelector("#kcmc-importer-btn") ||
    !window.localStorage.quests_unlocks ||
    !document.querySelector(".ribbon-tabwell")
  ) {
    return;
  }
  let btn = Object.assign(document.createElement("button"), {
    id: "kcmc-importer-btn",
    className: "ribbon-apply",
    style: "font-size: 12px;",
    innerText: "Import Quests",
    onclick: importQuests,
  });
  let exportBtn = Object.assign(document.createElement("button"), {
    id: "kcmc-exporter-btn",
    className: "ribbon-apply",
    style: "font-size: 12px; margin-left: 4px;",
    innerText: "Export for TsukinoHashi",
    onclick: exportForTsukinoHashi,
  });
  btn.style.marginRight = "4px";
  document.querySelector(".ribbon-tabwell").appendChild(exportBtn);
  document.querySelector(".ribbon-tabwell").appendChild(btn);
}

main();
