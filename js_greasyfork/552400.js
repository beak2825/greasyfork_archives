// ==UserScript==
// @name         Torn Pickpocketing Colors
// @version      0.5
// @namespace    https://github.com/Korbrm
// @description  Color codes crimes based on difficulty
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @author       TheDawgLives [3733696] tweaked from Korbrm [2931507]
// @license      MIT License
// @match        https://www.torn.com/page.php?sid=crimes*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/552400/Torn%20Pickpocketing%20Colors.user.js
// @updateURL https://update.greasyfork.org/scripts/552400/Torn%20Pickpocketing%20Colors.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const categoryColorMap = {
    Safe: "#37b24d",
    "Moderately Unsafe": "#74b816",
    Unsafe: "#f59f00",
    Risky: "#f76707",
    Dangerous: "#f03e3e",
    "Very Dangerous": "#7048e8",
  };

  const tier1 = {
    Safe: "#37b24d",
    "Moderately Unsafe": "#f76707",
    Unsafe: "#f03e3e",
    Risky: "#f03e3e",
    Dangerous: "#f03e3e",
    "Very Dangerous": "#7048e8",
  };
  const tier2 = {
    Safe: "#37b24d",
    "Moderately Unsafe": "#37b24d",
    Unsafe: "#f76707",
    Risky: "#f03e3e",
    Dangerous: "#f03e3e",
    "Very Dangerous": "#7048e8",
  };
  const tier3 = {
    Safe: "#37b24d",
    "Moderately Unsafe": "#37b24d",
    Unsafe: "#37b24d",
    Risky: "#f76707",
    Dangerous: "#f03e3e",
    "Very Dangerous": "#7048e8",
  };
  const tier4 = {
    Safe: "#37b24d",
    "Moderately Unsafe": "#37b24d",
    Unsafe: "#37b24d",
    Risky: "#37b24d",
    Dangerous: "#f76707",
    "Very Dangerous": "#7048e8",
  };
  const tier5 = {
    Safe: "#37b24d",
    "Moderately Unsafe": "#37b24d",
    Unsafe: "#37b24d",
    Risky: "#37b24d",
    Dangerous: "#37b24d",
    "Very Dangerous": "#7048e8",
  };

  const markGroups = {
    Safe: [
      "Drunk man",
      "Drunk woman",
      "Homeless person",
      "Junkie",
      "Elderly man",
      "Elderly woman",
    ],
    "Moderately Unsafe": [
      "Classy lady",
      "Laborer",
      "Postal worker",
      "Young man",
      "Young woman",
      "Student",
    ],
    Unsafe: ["Rich kid", "Sex worker", "Thug"],
    Risky: ["Jogger", "Businessman", "Businesswoman", "Gang member", "Mobster"],
    Dangerous: ["Cyclist"],
    "Very Dangerous": ["Police officer"],
  };

  const distractedBonus = ["-34px", "-68px", "-102px", "-170px"];

  function updateDivColors(targetNode) {
    const url = window.location.href;
    if (!url.includes("#/pickpocketing")) {
      return;
    }

    var spanElement = document.querySelector(
      ".value___FdkAT.copyTrigger___fsdzI"
    );

    let tier = 1;
    let pickpocketSkill = 1;
    if (spanElement) {
      const ps = Number(spanElement.textContent);
      if (!isNaN(ps)) {
        pickpocketSkill = ps;
      }
    }
    if (pickpocketSkill < 10) {
      tier = 1;
    } else if (pickpocketSkill < 35) {
      tier = 2;
    } else if (pickpocketSkill < 65) {
      tier = 3;
    } else if (pickpocketSkill < 80) {
      tier = 4;
    } else {
      tier = 5;
    }

    const divElements = targetNode.querySelectorAll(
      ".crime-option:not(.processed)"
    );
    divElements.forEach((divElement) => {
      const titleElement = divElement.querySelector(".titleAndProps___DdeVu");
      if (!titleElement) {
        return;
      }
      const divContent = titleElement
        .querySelector("div")
        .textContent.trim()
        .replace(/ \(.*\)/, "");
      const activityDiv = divElement.querySelector('div[class^="activity"]');

      if (activityDiv) {
        const iconNode = activityDiv.querySelector('div[class^="icon"]');
        const iconOffset = iconNode?.style["background-position-y"];
        const distracted = distractedBonus.indexOf(iconOffset) >= 0;

        console.debug(
          "distracted = " + distracted + " iconOffset: ",
          iconOffset
        );

        const localTier = tier + (distracted ? 1 : 0);

        let tierColorMap = categoryColorMap;

        if (localTier === 1) {
          tierColorMap = tier1;
        } else if (localTier === 2) {
          tierColorMap = tier2;
        } else if (localTier === 3) {
          tierColorMap = tier3;
        } else if (localTier === 4) {
          tierColorMap = tier4;
        } else {
          tierColorMap = tier5;
        }

        for (const category in markGroups) {
          if (
            markGroups[category].some((group) => divContent.includes(group))
          ) {
            titleElement.querySelector("div").style.color =
              tierColorMap[category];
            if (window.innerWidth > 386) {
              titleElement.querySelector("div").textContent =
                `${divContent} (${category})` +
                (distracted ? " (distracted)" : "");
            }

            const button = divElement.querySelector("button.commit-button");
            if (button) {
              button.style.color = tierColorMap[category];
            }

            divElement.classList.add("processed");
            divElement.style.borderLeft = `3px solid ${tierColorMap[category]}`;

            break;
          }
        }
      }
    });
  }

  function initMonitor() {
    const targetNode = document.querySelector(
      '.pickpocketing-root div[class^="virtualList"]'
    );

    if (!targetNode) {
      setTimeout(initMonitor, 1000);
      return;
    }

    updateDivColors(targetNode);

    // Options for the observer (which mutations to observe)
    const config = { attributes: false, childList: true, subtree: false };

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(() => updateDivColors(targetNode));

    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);
  }

  initMonitor();
})();
