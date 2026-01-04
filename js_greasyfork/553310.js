// ==UserScript==
// @name         GitHub Follower Tracker
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Track GitHub followers&following
// @author       maanimis
// @match        https://github.com/*?tab=following
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_listValues
// @run-at       document-end
// @license MIT
// @icon https://github.githubassets.com/pinned-octocat.svg
// @downloadURL https://update.greasyfork.org/scripts/553310/GitHub%20Follower%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/553310/GitHub%20Follower%20Tracker.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const isDebugMode = false;

  const FOLLOWERS_PER_PAGE = 100;
  const API_BASE_URL = "https://api.github.com/users";

  let currentFollowers = [];
  let currentFollowing = [];
  let hasMorePages = false;
  let notFollowingBackList = [];
  let followsYouList = [];
  let notFollowingYouList = [];
  let isDataLoaded = false;

  function log(...args) {
    if (isDebugMode) {
      console.log(...args);
    }
  }

  function init() {
    const username = extractUsernameFromPage();
    if (!username) {
      log("[GitHub Tracker] Not on a user profile page");
      return;
    }

    log(`[GitHub Tracker] Tracking user: ${username}`);
    addLoadingLabels();
    processUserData(username);
  }

  function extractUsernameFromPage() {
    const href = document
      .querySelector('a[class="AppHeader-context-item"]')
      .getAttribute("href");
    return href.slice(1);
  }

  async function processUserData(username) {
    try {
      const followersUrl = `${API_BASE_URL}/${username}/followers?per_page=${FOLLOWERS_PER_PAGE}&page=`;
      const followingUrl = `${API_BASE_URL}/${username}/following?per_page=${FOLLOWERS_PER_PAGE}&page=`;

      log("[GitHub Tracker] Fetching followers...");
      currentFollowers = await fetchAllPages(followersUrl);
      log(`[GitHub Tracker] Total followers: ${currentFollowers.length}`);

      log("[GitHub Tracker] Fetching following...");
      currentFollowing = await fetchAllPages(followingUrl);
      log(`[GitHub Tracker] Total following: ${currentFollowing.length}`);

      notFollowingBackList = findNotFollowingBack();
      followsYouList = findFollowsYou();
      notFollowingYouList = findNotFollowingYou();

      logNotFollowingBack();

      const previousData = loadStoredData(username);

      if (previousData) {
        const changes = calculateChanges(previousData);
        logChanges(changes, previousData.timestamp);
      } else {
        log(`[GitHub Tracker] First time tracking ${username}`);
      }
      saveUserData(username);

      isDataLoaded = true;
      addFollowLabels();
    } catch (error) {
      log(`[GitHub Tracker] Error: ${error.message}`);
    }
  }

  async function fetchAllPages(baseUrl) {
    let page = 0;
    let allResults = [];

    do {
      hasMorePages = false;
      page++;

      const pageResults = await fetchPage(baseUrl, page);
      log(`[GitHub Tracker] Fetched page ${page}: ${pageResults.length} items`);

      allResults.push(...pageResults);

      if (pageResults.length === FOLLOWERS_PER_PAGE) {
        hasMorePages = true;
      }
    } while (hasMorePages);

    return allResults;
  }

  async function fetchPage(url, page = 1) {
    const response = await fetch(url + page);

    if (response.status === 404) {
      throw new Error("Username doesn't exist");
    }

    if (response.status === 403) {
      throw new Error("API rate limit exceeded");
    }

    return await response.json();
  }

  function saveUserData(username) {
    const dataToSave = {
      followers: currentFollowers,
      following: currentFollowing,
      timestamp: new Date().toISOString(),
    };

    GM_setValue(username, JSON.stringify(dataToSave));
    log(`[GitHub Tracker] Saved data for ${username}`);
  }

  function loadStoredData(username) {
    const storedData = GM_getValue(username);
    return storedData ? JSON.parse(storedData) : null;
  }

  function calculateChanges(previousData) {
    const removedFollowing = findRemovedUsers(
      previousData.following,
      currentFollowing
    );
    const addedFollowing = findAddedUsers(
      previousData.following,
      currentFollowing
    );
    const removedFollowers = findRemovedUsers(
      previousData.followers,
      currentFollowers
    );
    const addedFollowers = findAddedUsers(
      previousData.followers,
      currentFollowers
    );

    return {
      removedFollowing,
      addedFollowing,
      removedFollowers,
      addedFollowers,
    };
  }

  function findRemovedUsers(previousList, currentList) {
    return previousList.filter(
      (prevUser) => !currentList.some((currUser) => currUser.id === prevUser.id)
    );
  }

  function findAddedUsers(previousList, currentList) {
    return currentList.filter(
      (currUser) =>
        !previousList.some((prevUser) => prevUser.id === currUser.id)
    );
  }

  function findNotFollowingBack() {
    return currentFollowing.filter(
      (followingUser) =>
        !currentFollowers.some((follower) => follower.id === followingUser.id)
    );
  }

  function findFollowsYou() {
    return currentFollowers.filter((follower) =>
      currentFollowing.some((followingUser) => followingUser.id === follower.id)
    );
  }

  function findNotFollowingYou() {
    return currentFollowers.filter(
      (follower) =>
        !currentFollowing.some(
          (followingUser) => followingUser.id === follower.id
        )
    );
  }

  function logNotFollowingBack() {
    log(
      `\n[GitHub Tracker] 🔍 NOT FOLLOWING BACK (${notFollowingBackList.length} users):`
    );
    log("━".repeat(50));

    if (notFollowingBackList.length === 0) {
      log("   Everyone you follow is following you back! 🎉");
    } else {
      notFollowingBackList.forEach((user) => {
        log(`   • ${user.login} (${user.html_url})`);
      });
    }

    log("━".repeat(50));
  }

  function logChanges(changes, lastCheckDate) {
    const date = new Date(lastCheckDate).toLocaleString();
    log(`\n[GitHub Tracker] Changes since ${date}:`);
    log("━".repeat(50));

    log(
      `\n📊 FOLLOWING CHANGES (${
        changes.removedFollowing.length + changes.addedFollowing.length
      } total):`
    );
    logUserList("➖ Unfollowed", changes.removedFollowing);
    logUserList("➕ New Following", changes.addedFollowing);

    log(
      `\n📊 FOLLOWERS CHANGES (${
        changes.removedFollowers.length + changes.addedFollowers.length
      } total):`
    );
    logUserList("➖ Lost Followers", changes.removedFollowers);
    logUserList("➕ New Followers", changes.addedFollowers);

    log("\n" + "━".repeat(50));
  }

  function logUserList(label, userList) {
    if (userList.length === 0) {
      log(`   ${label}: None`);
      return;
    }

    log(`   ${label}: ${userList.length}`);
    userList.forEach((user) => {
      log(`      • ${user.login} (${user.html_url})`);
    });
  }

  function addLoadingLabels() {
    const usernameElements = document.querySelectorAll(
      'span[class="Link--secondary pl-1"]'
    );

    usernameElements.forEach((element) => {
      const existingLabel = element.nextElementSibling;
      if (
        existingLabel &&
        existingLabel.classList.contains("follow-status-label")
      ) {
        return;
      }

      const labelSpan = document.createElement("span");
      labelSpan.className = "follow-status-label loading-label";
      labelSpan.textContent = "loading...";
      labelSpan.style.cssText = `
        margin-left: 8px;
        padding: 3px 10px;
        background: linear-gradient(135deg, #8b949e 0%, #6e7781 100%);
        color: #ffffff;
        border-radius: 14px;
        font-size: 11px;
        font-weight: 600;
        letter-spacing: 0.3px;
        text-transform: uppercase;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
        display: inline-block;
        vertical-align: middle;
        opacity: 0.7;
        animation: pulse 1.5s ease-in-out infinite;
      `;

      element.parentNode.insertBefore(labelSpan, element.nextSibling);
    });

    const style = document.createElement("style");
    style.textContent = `
      @keyframes pulse {
        0%, 100% { opacity: 0.7; }
        50% { opacity: 0.4; }
      }
    `;
    document.head.appendChild(style);
  }

  function addFollowLabels() {
    const usernameElements = document.querySelectorAll(
      'span[class="Link--secondary pl-1"]'
    );

    usernameElements.forEach((element) => {
      const username = element.textContent.trim().toLowerCase();

      const existingLabel = element.nextElementSibling;
      if (
        existingLabel &&
        existingLabel.classList.contains("follow-status-label")
      ) {
        if (!isDataLoaded) {
          return;
        }
        if (existingLabel.classList.contains("loading-label")) {
          existingLabel.remove();
        } else {
          return;
        }
      }

      const isNotFollowingBack = notFollowingBackList.some(
        (user) => user.login.toLowerCase() === username
      );

      const isFollowsYou = followsYouList.some(
        (user) => user.login.toLowerCase() === username
      );

      const isNotFollowingYou = notFollowingYouList.some(
        (user) => user.login.toLowerCase() === username
      );

      let labelText = "";
      let backgroundColor = "";
      let textColor = "#ffffff";

      if (isNotFollowingBack) {
        labelText = "not following";
        backgroundColor = "#d73a49";
      } else if (isFollowsYou) {
        labelText = "follows you";
        backgroundColor = "#28a745";
      } else if (isNotFollowingYou) {
        labelText = "not following you";
        backgroundColor = "#6a737d";
      }

      if (labelText) {
        const labelSpan = document.createElement("span");
        labelSpan.className = "follow-status-label";
        labelSpan.textContent = labelText;
        labelSpan.style.cssText = `
          margin-left: 8px;
          padding: 3px 10px;
          background: linear-gradient(135deg, ${backgroundColor} 0%, ${adjustBrightness(
          backgroundColor,
          -15
        )} 100%);
          color: ${textColor};
          border-radius: 14px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.3px;
          text-transform: uppercase;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
          display: inline-block;
          vertical-align: middle;
          transition: all 0.2s ease;
        `;

        labelSpan.addEventListener("mouseenter", function () {
          this.style.transform = "translateY(-1px)";
          this.style.boxShadow = "0 3px 6px rgba(0, 0, 0, 0.2)";
        });

        labelSpan.addEventListener("mouseleave", function () {
          this.style.transform = "translateY(0)";
          this.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.15)";
        });

        element.parentNode.insertBefore(labelSpan, element.nextSibling);
      }
    });
  }

  function adjustBrightness(color, percent) {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = ((num >> 8) & 0x00ff) + amt;
    const B = (num & 0x0000ff) + amt;
    return (
      "#" +
      (
        0x1000000 +
        (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
        (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
        (B < 255 ? (B < 1 ? 0 : B) : 255)
      )
        .toString(16)
        .slice(1)
    );
  }

  const observer = new MutationObserver(() => {
    addFollowLabels();
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      init();
      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    });
  } else {
    init();
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }
})();
