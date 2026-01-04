// ==UserScript==
// @name         ChatGPT Nav
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add navigation to ChatGPT
// @author       You
// @license MIT
// @match        https://chatgpt.com/c/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=openai.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/553204/ChatGPT%20Nav.user.js
// @updateURL https://update.greasyfork.org/scripts/553204/ChatGPT%20Nav.meta.js
// ==/UserScript==

(function () {
  "use strict";
  let buttonAdded = false;
  const NavButtonId = "chatgpt-nav-button";
  const NavPopListId = "chatgpt-nav-poplist";
  const mainId = "main";
  const modelSwitchButtonCssSelector = "header#page-header button[id^='radix-']";
  const offestLeft = "--offset-left";
  const isTargetUrl = () => {
    return window.location.href.startsWith("https://chatgpt.com/c/");
  };

  const addNavButton = () => {
    if (document.getElementById("chatgpt-nav-button")) {
      console.log("Navigation button already exists.");
      return;
    }
    let modelSwitchButtonEle = document.querySelector(modelSwitchButtonCssSelector);
    if (!modelSwitchButtonEle) {
      console.log("Model switch button not found.");
      return;
    }

    let modelBtRect = modelSwitchButtonEle.getBoundingClientRect();
    document.documentElement.style.setProperty(offestLeft, `${modelBtRect.left}px`);

    const navButton = document.createElement("button");
    navButton.id = NavButtonId;
    navButton.textContent = "Nav";
    navButton.style.cssText = `
      position: absolute;
      padding: 5px 10px;
      top: ${modelBtRect.bottom + 10}px;
      left: var(${offestLeft},0px);
      font-weight: bold;
      border: solid 1px gray;
      border-radius: 5px;
      cursor: pointer;
      z-index:10;
    `;

    document.body.appendChild(navButton);

    let navBtRect = navButton.getBoundingClientRect();

    const popList = document.createElement("div");
    popList.id = NavPopListId;
    popList.style.cssText = `
      position: absolute;
      top: ${navBtRect.bottom + 10}px;
      left: var(${offestLeft},0px);
      min-width: 100px;
      max-height: 400px;
      overflow-y: auto;
      background-color: #202123;
      border: 1px solid #444;
      border-radius: 5px;
      z-index: 1000;
      display: none;
      color: white;
      padding: 10px;
      z-index:11;
    `;
    //get all article[data-turn="user"], get each of there content (when too long, substring it to 20 char) and
    // insert to popList innerHtml, when click the item, jump to the article
    const updatePopList = () => {
      popList.innerHTML = ""; // Clear existing list
      const userTurns = document.querySelectorAll("article[data-turn=\"user\"]");
      userTurns.forEach((article) => {
        const content = article.textContent.trim();
        const displayContent = content.length > 100 ? content.substring(0, 100) + "..." : content;
        const listItem = document.createElement("div");
        listItem.textContent = displayContent;
        listItem.style.cssText = `
          padding: 5px 0;
          cursor: pointer;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        `;
        listItem.addEventListener("click", () => {
          article.scrollIntoView({behavior: "instant", block: "start"});
          popList.style.display = "none";
        });
        popList.appendChild(listItem);
      });
    };

    navButton.addEventListener("click", updatePopList);
    navButton.addEventListener("click", () => {
      popList.style.display = popList.style.display === "none" ? "block" : "none";
    });
    document.body.appendChild(popList);
    buttonAdded = true;
  };

  //make MutationObserver to check if HeaderCssSelector is shown , and then add nav button
  new MutationObserver((mutationsList) => {
    if (!isTargetUrl()) {
      if (buttonAdded) {
        let element = document.querySelector(`#${NavButtonId}`);
        if (element) {
          document.querySelector(`#${NavPopListId}`)?.remove();
          element.remove();
          buttonAdded = false;
        }
      }
      return;
    }
    for (const mutation of mutationsList) {
      if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
        const header = document.querySelector(mainId);
        if (header) {
          addNavButton();
          break;
        }
      }
    }
  }).observe(document.body, {childList: true, subtree: true});

})();