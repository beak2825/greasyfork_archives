// ==UserScript==
// @name         Chain Watch
// @namespace    TheDawgLives.ChainWatcher
// @version      1.3
// @description  Alerts when the chain timer drops below a certain number.
// @author       TheDawgLives [3733696]
// @license      MIT
// @match        https://www.torn.com/*
// @exclude      https://www.torn.com/loader.php?sid=attack*
// @inject-into content
// @downloadURL https://update.greasyfork.org/scripts/553874/Chain%20Watch.user.js
// @updateURL https://update.greasyfork.org/scripts/553874/Chain%20Watch.meta.js
// ==/UserScript==

(function () {
  const styleNode = document.createElement("style");
  styleNode.innerText = `
  a[class^="chain-bar"] p[class^="bar-timeleft"] {
    font-size: 12pt;
  }
  a.time-ok, a.time-ok p[class^="bar-timeleft"], a.time-ok[class^="chain-bar"][class^="bar-desktop"] div[class^="bar-stats"] p[class^="bar-timeleft"]  {
    color: #189e18ff;
  }
  a.time-warn, a.time-warn p[class^="bar-timeleft"], a.time-warn[class^="chain-bar"][class^="bar-desktop"] div[class^="bar-stats"] p[class^="bar-timeleft"] {
    color: #9e8818ff;
    border: 2px solid #9e8818ff;
    animation: border-flash-warn 2s infinite alternate;
  }
  a.time-danger, a.time-danger p[class^="bar-timeleft"], a.time-danger[class^="chain-bar"][class^="bar-desktop"] div[class^="bar-stats"] p[class^="bar-timeleft"] {
    color: #9e1818ff;
    border: 2px solid #9e1818ff;
    animation: border-flash-danger 2s infinite alternate;
  }
  body.chain-danger {
    border: 10px solid #9e1818ff;
    animation: border-flash-danger 2s infinite alternate;
  }

@keyframes border-flash-warn {
  0% {
    border-color: #7d6b13b3;
  }
  50% {
    border-color: #ffdb2aff;
  }
  100% {
    border-color: #7d6b13b3;
  }
}

@keyframes border-flash-danger {
  0% {
    border-color: #8f191998;
  }
  50% {
    border-color: #ff2727ff;
  }
  100% {
    border-color: #8f191998;
  }
}
`;
  styleNode.id = "chain-watcher-styles";
  document.head.appendChild(styleNode);
  console.debug("Starting Chain Watcher");

  setInterval(() => {
    const chainBar = document.querySelector('a[class^="chain-bar"]');
    const chainValueNode = chainBar.querySelector('p[class^="bar-value"]');
    const chainValues = chainValueNode?.textContent?.split("/");

    if (
      !chainValues?.length ||
      Number(chainValues[1].replace(/[^\d]/, "")) < 1000
    ) {
      return;
    }

    const timeNode = chainBar.querySelector('p[class^="bar-timeleft"]');

    const timeLeft = timeNode.textContent;

    if (timeLeft === "00:00") {
      chainBar.classList.remove("time-danger");
      body.classList.remove("chain-danger");
      chainBar.classList.remove("time-ok");
      chainBar.classList.remove("time-warn");
    } else if (timeLeft.startsWith("00:")) {
      chainBar.classList.add("time-danger");
      body.classList.add("chain-danger");
      chainBar.classList.remove("time-ok");
      chainBar.classList.remove("time-warn");
    } else if (timeLeft.startsWith("01:")) {
      chainBar.classList.add("time-warn");
      body.classList.remove("chain-danger");
      chainBar.classList.remove("time-ok");
      chainBar.classList.remove("time-danger");
    } else {
      chainBar.classList.add("time-ok");
      body.classList.remove("chain-danger");
      chainBar.classList.remove("time-warn");
      chainBar.classList.remove("time-danger");
    }
  }, 1000);
})();
