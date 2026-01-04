// ==UserScript==
// @name        Carbon OC helper
// @version     1.0.6
// @description Helper for which OC to join
// @author      AllMight [1878147]
// @match       https://www.torn.com/factions.php*
// @grant       GM_addStyle
// @run-at      document-idle
// @namespace https://greasyfork.org/users/43725
// @downloadURL https://update.greasyfork.org/scripts/551373/Carbon%20OC%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/551373/Carbon%20OC%20helper.meta.js
// ==/UserScript==

(function() {
  "use strict";
  const css = ".am-irrelevant-oc {\r\n  [class^='scenario'] {\r\n    opacity: 0.3;\r\n  }\r\n}\r\n\r\n.am-irrelevant-oc-role {\r\n  & > [class^='slotHeader'] {\r\n    opacity: 0.3;\r\n  }\r\n\r\n  & > [class^='slotBody'] {\r\n    border-color: color-mix(\r\n      in srgb,\r\n      var(--oc-border-slot-player),\r\n      transparent 70%\r\n    );\r\n\r\n    [class^='planningTime'] {\r\n      opacity: 0.3;\r\n    }\r\n  }\r\n}\r\n";
  function equalOcEmptyRoleInfo(a, b) {
    return a.shouldJoin === b.shouldJoin && a.element === b.element;
  }
  function equalBaseOcInfo(a, b) {
    if (a.element !== b.element || a.level !== b.level || a.shouldJoinAnyRole !== b.shouldJoinAnyRole) {
      return false;
    }
    if (a.emptyRolesInfo.length !== b.emptyRolesInfo.length) {
      return false;
    }
    for (let i = 0; i < a.emptyRolesInfo.length; i++) {
      if (!equalOcEmptyRoleInfo(a.emptyRolesInfo[i], b.emptyRolesInfo[i])) {
        return false;
      }
    }
    return true;
  }
  function equalOcInfo(a, b) {
    if (a.isEmpty !== b.isEmpty) {
      return false;
    }
    if (!equalBaseOcInfo(a, b)) {
      return false;
    }
    return true;
  }
  function equalOcInfoList(listA, listB) {
    if (listA.length !== listB.length) {
      return false;
    }
    for (let i = 0; i < listA.length; i++) {
      if (!equalOcInfo(listA[i], listB[i])) {
        return false;
      }
    }
    return true;
  }
  function observeChain(root, selectorsChain, onReached) {
    let activeObservers = [];
    let cleanupFn = void 0;
    function observe(target, index) {
      const selector = selectorsChain[index];
      const observer = new MutationObserver(() => {
        const activeObserver = activeObservers[index];
        const selectorResult = target.querySelector(selector) ?? void 0;
        if (selectorResult === activeObserver.selectorResult) {
          return;
        }
        activeObserver.selectorResult = selectorResult;
        if (!selectorResult) {
          const obsolete = activeObservers.splice(
            index + 1,
            activeObservers.length - 1
          );
          obsolete.forEach(
            (activeObserver2) => activeObserver2.observer.disconnect()
          );
          cleanupFn?.();
          return;
        }
        if (index === selectorsChain.length - 1) {
          cleanupFn = onReached(selectorResult) ?? void 0;
          return;
        }
        observe(selectorResult, index + 1);
      });
      activeObservers.push({
        observer,
        selectorResult: void 0
      });
      observer.observe(target, { childList: true, subtree: true });
    }
    function disconnect() {
      activeObservers.forEach(
        (activeObserver) => activeObserver.observer.disconnect()
      );
      activeObservers = [];
      cleanupFn?.();
    }
    observe(root, 0);
    return { disconnect };
  }
  function compareItems(a, b, order) {
    if (typeof a === "number" && typeof b === "number") {
      return order === "desc" ? b - a : a - b;
    }
    if (typeof a === "boolean" && typeof b === "boolean") {
      return order === "desc" ? Number(b) - Number(a) : Number(a) - Number(b);
    }
    if (typeof a === "string" && typeof b === "string") {
      return order === "desc" ? b.localeCompare(a) : a.localeCompare(b);
    }
    throw new Error(`Unexpected sort value encountered!`);
  }
  function sortBy(arr, sortItem) {
    const sortItems = Array.isArray(sortItem) ? sortItem : [sortItem];
    if (sortItems.length === 0) {
      return arr;
    }
    return [...arr].sort((a, b) => {
      for (const sortItem2 of sortItems) {
        const aValue = sortItem2.valueFn(a);
        const bValue = sortItem2.valueFn(b);
        const compareResult = compareItems(aValue, bValue, sortItem2.order);
        if (compareResult === 0) {
          continue;
        }
        return compareResult;
      }
      return 0;
    });
  }
  GM_addStyle(css);
  function getOcRoleMinSuccessChanceToJoin(ocName, roleName) {
    switch (ocName) {
      case "Ace in the Hole":
        switch (roleName) {
          case "Driver":
            return 60;
          default:
            return 65;
        }
      case "Stacking the Deck":
        switch (roleName) {
          case "Driver":
            return 68;
          default:
            return 72;
        }
      case "Break the Bank":
        return 68;
      case "Clinical Precision":
        return 70;
      case "Blast from the Past":
        switch (roleName) {
          case "Muscle":
          case "Engineer":
          case "Bomber":
            return 78;
          case "Hacker":
          case "Picklock #1":
            return 70;
          default:
            return 0;
        }
      default:
        return 0;
    }
  }
  function getLastFullRolePercent(numOfEmptyRoles, phaseElement) {
    for (const cls of phaseElement.classList) {
      if (cls.startsWith("recruiting")) {
        return 0;
      }
      if (cls.startsWith("paused")) {
        return 100;
      }
      if (cls.startsWith("active")) {
        const timeText = phaseElement.querySelector('[class^="title"] > span').textContent;
        const [days, hours, mins, secs] = timeText.split(":");
        if (numOfEmptyRoles < +days) {
          return 0;
        }
        const timeOfDayLeftInSecs = +secs + +mins * 60 + +hours * 60 * 60;
        const daySecs = 24 * 60 * 60;
        return 100 - timeOfDayLeftInSecs / daySecs * 100;
      }
    }
    return 0;
  }
  function createOcInfo(ocElement) {
    const fullRolesElements = Array.from(ocElement.querySelectorAll('[class^="scenario"] + div > div:not([class*="waitingJoin"])'));
    const emptyRolesElements = Array.from(ocElement.querySelectorAll('[class^="scenario"] + div > div[class*="waitingJoin"]'));
    const ocName = ocElement.querySelector('[class^="panelTitle"]').textContent;
    const ocLevel = +ocElement.querySelector('[class^="levelValue"]').textContent;
    const emptyRolesInfo = emptyRolesElements.map((emptyRolesElement) => {
      const roleTitle = emptyRolesElement.querySelector('[class^="slotHeader"] [class^="title"]').textContent;
      const successChance = +emptyRolesElement.querySelector('[class^="slotHeader"] [class^="successChance"]').textContent;
      const minSuccessChance = getOcRoleMinSuccessChanceToJoin(ocName, roleTitle);
      return {
        element: emptyRolesElement,
        shouldJoin: successChance >= minSuccessChance
      };
    });
    const canJoinAnyEmptyRole = emptyRolesInfo.some((emptyRoleInfo) => emptyRoleInfo.shouldJoin);
    const baseOcInfo = {
      element: ocElement,
      level: ocLevel,
      emptyRolesInfo
    };
    if (fullRolesElements.length === 0) {
      return {
        ...baseOcInfo,
        shouldJoinAnyRole: canJoinAnyEmptyRole,
        isEmpty: true
      };
    }
    const lastFullRolePercent = getLastFullRolePercent(emptyRolesElements.length, ocElement.querySelector('[class^="scenario"] > [class^="wrapper"]'));
    const shouldJoinAnyRole = canJoinAnyEmptyRole && lastFullRolePercent > 0;
    return {
      ...baseOcInfo,
      shouldJoinAnyRole,
      isEmpty: false,
      lastRolePercent: lastFullRolePercent
    };
  }
  function createOcsInfo(ocsElements) {
    const ocsInfo = ocsElements.map(createOcInfo);
    const sortedOcsInfo = sortBy(ocsInfo, [{
      // First all OCs one can join at the top
      valueFn: (item) => item.shouldJoinAnyRole,
      order: "desc"
    }, {
      // Then inside paused first
      valueFn: (item) => item.isEmpty ? false : item.lastRolePercent === 100,
      order: "desc"
    }, {
      // From the non paused empty first
      valueFn: (item) => item.isEmpty,
      order: "desc"
    }, {
      // Then the rest by how close the last role is to completion
      valueFn: (item) => item.isEmpty ? 0 : item.lastRolePercent,
      order: "desc"
    }, {
      // Lastly by OC level
      valueFn: (item) => item.level,
      order: "desc"
    }]);
    return sortedOcsInfo;
  }
  function alignDomWithOcsInfo(ocsInfo) {
    for (const ocInfo of ocsInfo) {
      ocInfo.element.parentElement.appendChild(ocInfo.element);
      if (!ocInfo.shouldJoinAnyRole) {
        ocInfo.element.classList.add("am-irrelevant-oc");
      } else {
        ocInfo.element.classList.remove("am-irrelevant-oc");
      }
      for (const emptyRoleInfo of ocInfo.emptyRolesInfo) {
        if (!emptyRoleInfo.shouldJoin) {
          emptyRoleInfo.element.classList.add("am-irrelevant-oc-role");
        } else {
          emptyRoleInfo.element.classList.remove("am-irrelevant-oc-role");
        }
      }
    }
  }
  function main() {
    observeChain(document.getElementById("factions"), ['#faction-crimes-root [class^="manualSpawnerContainer"] + .page-head-delimiter + div:has( > [data-oc-id])'], (ocsContainer) => {
      let currentOcsInfo = [];
      const observer = new MutationObserver(() => {
        const ocsElements = ocsContainer.querySelectorAll(':scope > [class^="wrapper"]');
        const ocsInfo = createOcsInfo(Array.from(ocsElements));
        if (equalOcInfoList(currentOcsInfo, ocsInfo)) {
          return;
        }
        currentOcsInfo = ocsInfo;
        alignDomWithOcsInfo(ocsInfo);
      });
      observer.observe(ocsContainer, {
        childList: true,
        subtree: true,
        characterData: true
      });
      return () => observer.disconnect();
    });
  }
  main();
})();
