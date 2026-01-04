// ==UserScript==
// @name        RW Chain Tracker
// @namespace   finally.torn.rwchain
// @match       https://www.torn.com/factions.php*
// @grant       GM_addStyle
// @version     1.4
// @author      finally [2060206]
// @description Adds chain tracker for opponent chain
// @downloadURL https://update.greasyfork.org/scripts/559691/RW%20Chain%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/559691/RW%20Chain%20Tracker.meta.js
// ==/UserScript==

let API_KEY = "<insert key here>";
if (API_KEY.length == 16) {
  localStorage["finally.torn.rwchain"] = API_KEY;
}
else {
  API_KEY = localStorage["finally.torn.rwchain"];
}

GM_addStyle(`
.__rwchain_box .chain-box-stats-block {
  display: block !important;
}
.__rwchain_box .chain-box-stats-list {
  display: none !important;
}
.__rwchain_box .chain-box-top-stat {
  display: none !important;
}
.__rwchain_link {
  color: var(--opponent-color);
  text-decoration: none;
}
.__rwchain_link:hover {
  color: var(--faction-war-default-blue-hover-color);
}
`);

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
async function waitForElement(selector, timeout) {
  const start = Date.now();
  return new Promise(async (resolve, reject) => {
    while (true) {
      const target = document.querySelector(selector);
      if (target) return resolve(target);
      await sleep(100);
      if ((Date.now() - start) >= timeout) return reject();
    }
  });
}

function getCSSRules() {
  const allRules = [];

  for (const sheet of document.styleSheets) {
    try {
      for (const rule of sheet.cssRules) {
        allRules.push(rule);
      }
    } catch (e) {}
  }

  return allRules;
}

function itemsPerRow(parent) {
  const children = [...parent.children];
  if (children.length < 2) return 1;

  const firstTop = children[0].getBoundingClientRect().top;
  let count = 0;

  for (const child of children) {
    if (child.getBoundingClientRect().top !== firstTop) break;
    count++;
  }

  return count || 1;
}

function addChainTracker(chainElement) {
  if (!chainElement?.parentNode?.classList || chainElement.parentNode.classList.contains("__rwchain")) return;
  chainElement.parentNode.classList.add("__rwchain");

  const cssSelectors = getCSSRules().map(rule => rule.selectorText);
  const lastClass = cssSelectors.filter(selector => selector && ["warListItem", "lastInRow"].every(v => selector.indexOf(v) !== -1))?.[0]?.match(/\.(lastInRow[\_\w]+)/)?.[1];
  const firstClass = cssSelectors.filter(selector => selector && ["warListItem", "firstInRow"].every(v => selector.indexOf(v) !== -1))?.[0]?.match(/\.(firstInRow[\_\w]+)/)?.[1];

  const parent = chainElement.parentNode;
  function fixPositioning() {
    for (let i = 0; i < parent.children.length; i++) {
      let node = parent.children[i];
      let p = i % 3;
      if (p == 0) {
        node.classList.remove(lastClass);
        node.classList.add("first-in-row");
        node.classList.add(firstClass);
      }
      else if (p == 2) {
        node.classList.remove("first-in-row");
        node.classList.remove(firstClass);
        node.classList.add(lastClass);
      }
      else {
        node.classList.remove(lastClass);
        node.classList.remove("first-in-row");
        node.classList.remove(firstClass);
      }
    }

    const descriptions = parent.querySelector(".descriptions");
    const active = parent.querySelector("[class*='active__']:not(.___chain_tracker)");
    if (!descriptions || !active) return;
    active.classList.add("___chain_tracker");
    const perRow = itemsPerRow(parent);
    const posActive = [...parent.children].indexOf(active);
    //let posDescription = Math.floor(posActive / 3) * 3 + 3;
    let posDescription = perRow == 1 ? posActive + 1 : posActive - (posActive % perRow) + perRow;
    if ([...parent.children].indexOf(descriptions) < posDescription) posDescription++;
    parent.insertBefore(descriptions, parent.children[posDescription]);
  }

  new MutationObserver(_ => {
    fixPositioning();
  }).observe(parent, { subtree: true, childList: true });

  const lastElement = parent.querySelector(".clear");

  const opponentChainElement = chainElement.cloneNode(true);
  const index = [...parent.children].indexOf(lastElement);
  opponentChainElement.classList.remove([...opponentChainElement.classList].filter(c => c.startsWith("link__"))?.[0]);
  opponentChainElement.classList.add("__rwchain_box");
  opponentChainElement.classList.add("red");
  opponentChainElement.classList.add("no-active");
  opponentChainElement.classList.remove("green");
  parent.insertBefore(opponentChainElement, parent.children[1]);

  const chainTitle = opponentChainElement.querySelector(".chain-box-title");
  const chainCounter = opponentChainElement.querySelector(".chain-box-center-stat");
  const chainTimer = opponentChainElement.querySelector(".chain-box-timeleft");
  let chainEnd = 0;
  let chainZeroFlag = false;
  function updateChainAtZero() {
    if (chainEnd < Math.round(Date.now()/1000) && !chainZeroFlag) {
      chainZeroFlag = true;
      updateChain();
    }
  }
  function updateChainTimer() {
    let secondsLeft = Math.max(0, (chainEnd - Math.round(Date.now()/1000)));
    const minutesLeft = Math.floor(secondsLeft / 60);
    secondsLeft -= minutesLeft * 60;
    chainTimer.innerText = `${String(minutesLeft).padStart(2, "0")}:${String(secondsLeft).padStart(2, "0")}`;
    requestAnimationFrame(updateChainTimer);
  }
  async function updateChain(init) {
    const opponent = parent.querySelector("[class*='rankBox__'] [class*='opponentFactionName']");
    const opponentName = opponent?.innerText;
    const opponentId = parseInt(opponent?.href.replace(/.*\&ID\=(\d+).*/gm, "$1")) || 0;
    const opponentClass = opponent?.className;
    const chainInfo = {
      ...{
        "id": 0,
        "current": 0,
        "max": 10,
        "timeout": 0,
        "modifier": 1,
        "cooldown": 0,
        "start": 0,
        "end": 0
      },
      ...(!init && opponentId > 0 ? (await fetch(`https://api.torn.com/v2/faction/${opponentId}/chain?key=${API_KEY}&timestamp=${Date.now()}`).then(r => r.json()).catch(console.error)) : {})?.chain
    };

    chainEnd = chainInfo.cooldown || chainInfo.end;
    if (chainEnd > (Date.now()/1000)) {
      chainEndFlag = false;
    }

    if (opponentId == 0) {
      chainTitle.innerText = "No opponent";
    }
    else {
      let status = "Chain";
      if (chainInfo.cooldown > 0) status += " in cooldown";
      else if (chainInfo.end > Math.round(Date.now()/1000)) status += " active";
      chainTitle.innerHTML = `${status} - <a class="__rwchain_link" href="/factions.php?step=profile&ID=${opponentId}">${opponentName}</a>`;
    }

    if (chainInfo.current > 0) {
      opponentChainElement.classList.remove("no-active");
    }
    else {
      opponentChainElement.classList.add("no-active");
    }
    if (chainInfo.cooldown > 0) {
      opponentChainElement.classList.add("blue");
    }
    else {
      opponentChainElement.classList.remove("blue");
    }

    chainCounter.innerText = chainInfo.current.toLocaleString("en-US");
  }
  requestAnimationFrame(updateChainTimer);
  setInterval(updateChainAtZero, 100);
  setInterval(updateChain, 5000);
  updateChain(true);
  updateChain();
  fixPositioning();

  [...parent.querySelectorAll(".inactive")].forEach(node => node.remove());
  const count = parent.querySelectorAll(":scope > li:not(.descriptions)").length - 1;
  const missing = (3 - (count % 3)) % 3;
  for (let i = 0; i < missing; i++) {
    const inactive = document.createElement("li");
    inactive.className = "inactive";
    parent.insertBefore(inactive, lastElement);
  }
}

(async () => {
  const uw = (typeof unsafeWindow !== 'undefined') ? unsafeWindow : window;
  if (uw.__RWCHAIN_RUNNING) return;
  uw.__RWCHAIN_RUNNING = true;

  const factionElement = await waitForElement("#factions", 10000).catch(console.error);
  if (!factionElement) return;

  new MutationObserver(_ => {
    addChainTracker(factionElement.querySelector("#faction_war_list_id > li"));
  }).observe(factionElement, { subtree: true, childList: true });
  addChainTracker(factionElement.querySelector("#faction_war_list_id > li"));
})();