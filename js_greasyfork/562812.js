// ==UserScript==
// @name          AO3: Reorder Ship Tags
// @version       1.0.1
// @description   Reorders relationship tags on blurbs so platonic ships (&) appear after romantic ships (/)
// @author        BlackBatCat
// @match         *://archiveofourown.org/tags/*
// @match         *://archiveofourown.org/works
// @match         *://archiveofourown.org/works?*
// @match         *://archiveofourown.org/works/*
// @match         *://archiveofourown.org/users/*
// @match         *://archiveofourown.org/collections/*
// @match         *://archiveofourown.org/bookmarks*
// @match         *://archiveofourown.org/series/*
// @license       MIT
// @grant         none
// @namespace https://greasyfork.org/users/1498004
// @downloadURL https://update.greasyfork.org/scripts/562812/AO3%3A%20Reorder%20Ship%20Tags.user.js
// @updateURL https://update.greasyfork.org/scripts/562812/AO3%3A%20Reorder%20Ship%20Tags.meta.js
// ==/UserScript==

(function () {
  "use strict";

  console.log("[AO3: Reorder Ship Tags] loaded.");

  function reorderItems(items, container, insertBefore = null) {
    if (items.length <= 1) return;

    const romantic = [];
    const platonic = [];
    let needsReorder = false;

    for (let i = 0; i < items.length; i++) {
      const text = items[i].textContent;
      if (text.includes("/")) {
        if (platonic.length > 0) needsReorder = true;
        romantic.push(items[i]);
      } else if (text.includes("&")) {
        platonic.push(items[i]);
      }
    }

    if (!needsReorder || romantic.length === 0 || platonic.length === 0) return;

    romantic.forEach((li) => li.remove());
    platonic.forEach((li) => li.remove());

    const fragment = document.createDocumentFragment();
    romantic.forEach((li) => fragment.appendChild(li));
    platonic.forEach((li) => fragment.appendChild(li));

    if (insertBefore) {
      container.insertBefore(fragment, insertBefore);
    } else {
      container.appendChild(fragment);
    }
  }

  function reorderRelationshipTags(blurbElement) {
    const tagsContainer = blurbElement.querySelector("ul.tags");
    if (!tagsContainer) return;

    const items = tagsContainer.querySelectorAll("li.relationships");
    const referenceNode = items[0]?.nextSibling;
    reorderItems(items, tagsContainer, referenceNode);
  }

  function reorderWorkPageTags(workElement) {
    const tagsContainer = workElement.querySelector("dd.relationship.tags ul.commas");
    if (!tagsContainer) return;

    const items = tagsContainer.querySelectorAll("li");
    reorderItems(items, tagsContainer);
  }

  function reorderAllBlurbs() {
    const blurbs = document.querySelectorAll("li.blurb");
    for (let i = 0; i < blurbs.length; i++) {
      reorderRelationshipTags(blurbs[i]);
    }

    const workPages = document.querySelectorAll("dl.work.meta.group");
    for (let i = 0; i < workPages.length; i++) {
      reorderWorkPageTags(workPages[i]);
    }
  }

  // Initialize on page load
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", reorderAllBlurbs);
  } else {
    reorderAllBlurbs();
  }
})();
