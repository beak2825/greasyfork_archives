// ==UserScript==
// @name          AO3: Collapsible Comments
// @version       1.0.1
// @description   Collapse and expand comment threads on AO3 work pages. Collapse state is saved per-work.
// @author        BlackBatCat
// @match         *://archiveofourown.org/works/*
// @match         *://archiveofourown.org/chapters/*
// @license       MIT
// @grant         none
// @run-at        document-end
// @namespace https://greasyfork.org/users/1498004
// @downloadURL https://update.greasyfork.org/scripts/562922/AO3%3A%20Collapsible%20Comments.user.js
// @updateURL https://update.greasyfork.org/scripts/562922/AO3%3A%20Collapsible%20Comments.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const STORAGE_KEY = "ao3_collapsible_comments_config";

  function loadConfig() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      console.error("[AO3: Collapsible Comments] Failed to load config", e);
      return {};
    }
  }

  function saveConfig(config) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch (e) {
      console.error("[AO3: Collapsible Comments] Failed to save config", e);
    }
  }

  function getWorkId() {
    const match = window.location.pathname.match(/\/works\/(\d+)/);
    return match ? match[1] : null;
  }

  function getCommentId(element) {
    const id = element.id;
    return id ? id.replace("comment_", "") : null;
  }

  function injectStyles() {
    const style = document.createElement("style");
    style.textContent = `
      .ao3-comment-collapsed > *:not(.heading.byline) {
        display: none !important;
      }
      
      .ao3-comment-collapsed > .heading.byline {
        opacity: 0.7;
      }
      
      /* Hide nested thread when parent is collapsed */
      .ao3-comment-collapsed + li > ol.thread {
        display: none !important;
      }
      
      li.comment {
        cursor: pointer;
      }
      
      /* Keep normal cursor for interactive elements */
      li.comment a,
      li.comment button,
      li.comment input,
      li.comment textarea,
      li.comment select {
        cursor: default;
      }
    `;
    document.head.appendChild(style);
  }

  function toggleComment(commentElement, workId) {
    const commentId = getCommentId(commentElement);
    if (!commentId) return;

    const isCollapsed = commentElement.classList.toggle(
      "ao3-comment-collapsed"
    );

    const config = loadConfig();
    if (!config[workId]) {
      config[workId] = {};
    }

    if (isCollapsed) {
      config[workId][commentId] = true;
    } else {
      delete config[workId][commentId];
      if (Object.keys(config[workId]).length === 0) {
        delete config[workId];
      }
    }

    saveConfig(config);
  }

  function toggleAllComments(collapse) {
    const workId = getWorkId();
    if (!workId) return;

    const config = loadConfig();
    if (!config[workId]) {
      config[workId] = {};
    }

    const allComments = document.querySelectorAll('li.comment[id^="comment_"]');

    allComments.forEach((comment) => {
      // When collapsing, only target top-level comments (nested replies collapse with their parent)
      // When expanding, target all comments including nested ones
      if (collapse) {
        const parentThread = comment.parentElement;
        const isTopLevel =
          parentThread &&
          parentThread.tagName === "OL" &&
          parentThread.classList.contains("thread") &&
          (!parentThread.parentElement ||
            parentThread.parentElement.tagName !== "LI");

        if (!isTopLevel) return;
      }

      const commentId = getCommentId(comment);
      if (!commentId) return;

      if (collapse) {
        comment.classList.add("ao3-comment-collapsed");
        config[workId][commentId] = true;
      } else {
        comment.classList.remove("ao3-comment-collapsed");
        delete config[workId][commentId];
      }
    });

    if (Object.keys(config[workId]).length === 0) {
      delete config[workId];
    }

    saveConfig(config);
  }

  function addToggleAllButtons() {
    const paginations = document.querySelectorAll(
      "ol.pagination.actions:not(.ao3-toggle-button-added)"
    );

    paginations.forEach((pagination) => {
      pagination.classList.add("ao3-toggle-button-added");

      const collapseAllLi = document.createElement("li");
      collapseAllLi.innerHTML = '<a href="#">Collapse All</a>';
      const collapseAllLink = collapseAllLi.querySelector("a");
      collapseAllLink.addEventListener("click", (e) => {
        e.preventDefault();
        toggleAllComments(true);
      });

      const expandAllLi = document.createElement("li");
      expandAllLi.innerHTML = '<a href="#">Expand All</a>';
      const expandAllLink = expandAllLi.querySelector("a");
      expandAllLink.addEventListener("click", (e) => {
        e.preventDefault();
        toggleAllComments(false);
      });

      pagination.appendChild(expandAllLi);
      pagination.appendChild(collapseAllLi);
    });
  }

  function setupComments() {
    const workId = getWorkId();
    if (!workId) return;

    const config = loadConfig();
    const workConfig = config[workId] || {};

    const comments = document.querySelectorAll(
      'li.comment[id^="comment_"]:not(.ao3-collapse-setup)'
    );

    if (comments.length === 0) return;

    comments.forEach((comment) => {
      const commentId = getCommentId(comment);
      if (!commentId) return;

      comment.classList.add("ao3-collapse-setup");

      if (workConfig[commentId]) {
        comment.classList.add("ao3-comment-collapsed");
      }

      comment.addEventListener(
        "click",
        function (e) {
          const target = e.target;
          if (
            target.tagName === "A" ||
            target.tagName === "BUTTON" ||
            target.tagName === "INPUT" ||
            target.tagName === "TEXTAREA" ||
            target.tagName === "SELECT" ||
            target.closest("a, button, input, textarea, select, form")
          ) {
            return;
          }

          e.preventDefault();
          e.stopPropagation();
          toggleComment(comment, workId);
        },
        true
      );
    });
  }

  function init() {
    const workId = getWorkId();
    if (!workId) {
      console.log("[AO3: Collapsible Comments] No work ID found");
      return;
    }

    injectStyles();
    setupComments();
    addToggleAllButtons();

    // Watch for AJAX-loaded comments
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.addedNodes.length > 0) {
          setupComments();
          addToggleAllButtons();
          break;
        }
      }
    });

    const commentsArea = document.querySelector(
      "#feedback, #comments_placeholder"
    );
    if (commentsArea) {
      observer.observe(commentsArea, {
        childList: true,
        subtree: true,
      });
    }

    console.log("[AO3: Collapsible Comments] loaded.");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
