// ==UserScript==
// @name         GC Wiki Item Links
// @namespace    https://www.grundos.cafe/
// @version      1.1
// @description  Adds a GC Wiki link for items in Inventory, SDB, Item List, and Trading Post.
// @author       Rykiih
// @match        https://www.grundos.cafe/*
// @icon         https://i.ibb.co/39L9LyWF/Wiki-Mascot-Pixel.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/554383/GC%20Wiki%20Item%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/554383/GC%20Wiki%20Item%20Links.meta.js
// ==/UserScript==

(function () {
  "use strict";
  function createWikiLink(wikiArticle) {
    // Create a new anchor element for the Virtupets search link
    const newLink = document.createElement("a");
    newLink.href = `https://grundos.wiki.gg/wiki/${encodeURIComponent(
      wikiArticle,
    )}`;
    newLink.title = `Open on the Grundo's Cafe Wiki`; // Set the title correctly
    newLink.target = "_blank";

    // Create an image element for the link
    const img = document.createElement("img");
    img.src = "https://i.ibb.co/39L9LyWF/Wiki-Mascot-Pixel.png"; // Replace with appropriate icon
    img.alt = "Grundo's Cafe Wiki";
    img.className = "wiki-helper"; // Adjust class as necessary

    // Append the image to the anchor
    newLink.appendChild(img);

    return newLink;
  }

  // Function to add Wiki link to a specific item
  function addWikiLinkForItem(item, itemName) {
    // Check if the search links div already exists to avoid duplication
    let searchLinksDiv = item.querySelector(".searchhelp");
    if (!searchLinksDiv) {
      // Create a new div for the search links if it doesn't exist
      searchLinksDiv = document.createElement("div");
      searchLinksDiv.className = "searchhelp";
      item.appendChild(searchLinksDiv);
    }

    // Create a new search links element for the wiki
    const newLink = createWikiLink(itemName.replaceAll("#", "♯"));
    newLink.title = `Open Wiki for ${itemName}`; // Set the title correctly

    // Append the anchor to the search links div
    searchLinksDiv.appendChild(newLink);
  }

  // Function to process inventory items (inv-item class)
  function processInventoryItems() {
    const inventoryItems = document.querySelectorAll(".inv-item");

    inventoryItems.forEach((item) => {
      const itemNameSpan = item.querySelector(".item-info span"); // Get the span containing the item name

      if (itemNameSpan) {
        const itemName = itemNameSpan.textContent.trim();
        addWikiLinkForItem(item, itemName);
      }
    });
  }

  // Function to process SDB items (sdb-item- id)
  function processSDBItems() {
    const sdbItems = document.querySelectorAll(
      'div[id^="sdb-item-"].data.flex-column.small-gap.break',
    );

    sdbItems.forEach((item) => {
      const itemNameStrong = item.querySelector("strong"); // Get the strong tag containing the item name

      if (itemNameStrong) {
        const itemName = itemNameStrong.textContent.trim();
        addWikiLinkForItem(item, itemName);
      }
    });
  }

  // Function to process items in the item list
  function processItemList() {
    const itemListItems = document.querySelectorAll(
      ".itemList.margin-1 .inv-item",
    );

    itemListItems.forEach((item) => {
      const itemNameStrong = item.querySelector("strong"); // Get the strong tag containing the item name

      if (itemNameStrong) {
        const itemName = itemNameStrong.textContent.trim();
        addWikiLinkForItem(item, itemName);
      }
    });
  }

  // Function to process Trading Post items
  function processTradingPostItems() {
    const tradingPostItems = document.querySelectorAll(".trade-item");

    tradingPostItems.forEach((item) => {
      const itemNameSpan = item.querySelector(".item-info span"); // Get the span containing the item name

      if (itemNameSpan) {
        const itemName = itemNameSpan.textContent.trim();
        addWikiLinkForItem(item, itemName);
      }
    });
  }

  function processNeoschool() {
    const currentTaskHeaderEl = document.querySelector(
      "div.current_task > b:first-child",
    );
    if (!currentTaskHeaderEl) {
      return;
    }
    let wikiArticle = "NeoSchool";
    const welcomeMessage = document.querySelector(
      "div.teacher > p:first-child strong",
    )?.textContent;
    const match = welcomeMessage.match(/'(.+?)'$/);
    const courseTitle = match ? match[1] : null;
    if (courseTitle) {
      wikiArticle += `#${courseTitle}`;
    }
    const wikiLink = createWikiLink(wikiArticle);
    currentTaskHeaderEl.after(wikiLink);
  }

  // Function to add CSS styles
  function addCustomStyles() {
    const style = document.createElement("style");
    style.textContent = `
                .inv-item-name {
                    font-weight: bold; /* Makes item names bold */
                }
                .searchhelp a {
                    margin-right: 5px; /* Adds spacing between links */
                }
                .current_task .wiki-helper {
                    margin: -1px 0 0 5px;
                    width: 20px;
                }
            `;
    document.head.appendChild(style);
  }

  // Execute the CSS addition and all processing functions
  addCustomStyles();
  processInventoryItems();
  processSDBItems();
  processItemList(); // Process item list items
  processTradingPostItems(); // Process trading post items

  if (window.location.pathname === "/neoschool/course/") {
    processNeoschool();
  }
})();
