// ==UserScript==
// @name        Kemono Patcher
// @namespace   DKKKNND
// @license     WTFPL
// @match       https://kemono.cr/*
// @match       https://coomer.st/*
// @run-at      document-start
// @grant       GM_registerMenuCommand
// @grant       GM_unregisterMenuCommand
// @grant       GM_setValue
// @grant       GM_getValue
// @version     1.4.2
// @author      Kaban
// @description Workaround "Creator not found" error, and more.
// @downloadURL https://update.greasyfork.org/scripts/552123/Kemono%20Patcher.user.js
// @updateURL https://update.greasyfork.org/scripts/552123/Kemono%20Patcher.meta.js
// ==/UserScript==
(function() {
"use strict";

// ==<User Script>==
const MISSING_PATREON = JSON.parse(GM_getValue("MISSING_PATREON", "[]"));
const RENAME_CREATORS = JSON.parse(GM_getValue("RENAME_CREATORS", "{}"));
const PATREON_METADATA_CACHE = JSON.parse(GM_getValue("PATREON_METADATA_CACHE", '{"postIds":[]}'));

function onMutation() {
  updatePageInfo();
  observer.disconnect();
  switch (pageInfo.pageType) {
    case "Post Details":
      updateImportedTime();
      break;
  }
  observer.observe(document, { childList: true, subtree: true });
}
const observer = new MutationObserver(onMutation);
observer.observe(document, { childList: true, subtree: true });

let pageInfo = {};
function updatePageInfo() {
  if (pageInfo.href === window.location.href) return;
  pageInfo = {};
  const pathname = window.location.pathname;
  const segments = pathname.split('/').filter(segment => segment);
  switch (segments.length) {
    case 3: {
      if (segments[1] === "user") {
        pageInfo.pageType = "Creator Posts";
        const service = segments[0];
        const userId = segments[2];
        pageInfo.userKey = `${service}-${userId}`;
      }
      break;
    }
    case 4: {
      if (segments[1] === "user" && segments[3] === "community") {
        pageInfo.pageType = "Creator Community";
        const service = segments[0];
        const userId = segments[2];
        pageInfo.userKey = `${service}-${userId}`;
      }
      break;
    }
    case 5:
    case 7: {
      if (segments[1] === "user" && segments[3] === "post" &&
         (segments[5] == undefined || segments[5] === "revision")) {
        pageInfo.pageType = "Post Details";
        const service = segments[0];
        const userId = segments[2];
        const postId = segments[4];
        pageInfo.userKey = `${service}-${userId}`;
        pageInfo.postKey = `${service}-${userId}-${postId}`;
      }
    }
  }
  pageInfo.href = window.location.href;
  updateScriptMenu();
}

function updateScriptMenu() {
  switch (pageInfo.pageType) {
    case "Creator Posts":
    case "Post Details":
      GM_registerMenuCommand("✎ Rename Creator", renameCreator, { id: "renameCreator" });
      break;
    default:
      GM_unregisterMenuCommand("renameCreator");
  }
}

let postImported = {};
function loadImportedTime(event) { // called from page script
  if (postImported.restoredKey === event.detail.postKey) return;
  postImported.postKey = event.detail.postKey;
  postImported.imported = event.detail.imported;
}
document.addEventListener("kp-user:load-imported-time", loadImportedTime);

function updateImportedTime() {
  if (postImported.postKey !== pageInfo.postKey) return;
  if (postImported.imported?.[0] === null) return; // Kemono bug (Pixiv Fanbox)

  const revisionSelection = document.getElementById("post-revision-selection");
  if (revisionSelection) {
    const revisionOptions = revisionSelection.getElementsByTagName("option");
    // switching revision causes text reset, need edit again
    if (postImported.restoredKey === postImported.postKey &&
        postImported.restoredText === revisionOptions[0].textContent) {
      return;
    }
    for (let i = 0; i < revisionOptions.length; i++) {
      const date = new Date(postImported.imported[i]);
      const importedTime = date.toLocaleString("en-CA", { hourCycle: "h23" });
      const suffix = revisionOptions[i].textContent.substring(7);
      revisionOptions[i].textContent = importedTime.replace(',', '') + suffix;
    }
    postImported.restoredKey = postImported.postKey;
    postImported.restoredText = revisionOptions[0].textContent;
    return;
  }

  const revisionSpan = document.querySelector(".post__added span");
  if (revisionSpan) {
    const date = new Date(postImported.imported[0]);
    const importedTime = date.toLocaleString("en-CA", { hourCycle: "h23" });
    revisionSpan.lastChild.textContent = importedTime.replace(',', '');
    postImported = { restoredKey: postImported.postKey };
  }
}

let saveTimeout = {};
function debouncedSave(gmKey, object) {
  clearTimeout(saveTimeout[gmKey]);
  saveTimeout[gmKey] = setTimeout(() => {
    // To Do: Make this Multi-Tab Safe
    GM_setValue(gmKey, JSON.stringify(object));
  }, 500);
}

function renameCreator(event) {
  if (event.type === "visibilitychange") {
    if (document.visibilityState !== "visible") return;
    if (!pageInfo.renameCreatorFlag) return;
    pageInfo.renameCreatorFlag = null;
  }
  if (document.visibilityState === "visible") {
    const creatorName = document.querySelector(".post__user-name") ||
                        document.querySelector(`span[itemprop="name"]`);
    const userKey = pageInfo.userKey;
    const name = RENAME_CREATORS[userKey] || creatorName.textContent;

    const input = prompt(`Enter new name for ${name} (${userKey}):\n(leave empty to reset)`, name);
    if (input === null || input === name) return;
    if (input === "") {
      delete RENAME_CREATORS[userKey];
    } else {
      RENAME_CREATORS[userKey] = input;
    }
    debouncedSave("RENAME_CREATORS", RENAME_CREATORS);
    document.dispatchEvent(new CustomEvent("kp-page:rename-creator", {
      detail: { userKey: userKey, newName: input }
    }));
    creatorName.textContent = input || userKey;
  } else {
    if (!pageInfo.renameCreatorFlag) pageInfo.renameCreatorFlag = true; // mobile workaround
  }
}
document.addEventListener("visibilitychange", renameCreator);

function addMissingPatreon(event) { // called from page script
  const userId = event.detail.userId;
  MISSING_PATREON.push(userId);
  debouncedSave("MISSING_PATREON", MISSING_PATREON);
}
document.addEventListener("kp-user:add-missing-patreon", addMissingPatreon);

function addPatreonCache(event) { // called from page script
  const postId = event.detail.postId;
  PATREON_METADATA_CACHE.postIds.push(postId);
  const userId = event.detail.userId;
  if (!PATREON_METADATA_CACHE[userId]) PATREON_METADATA_CACHE[userId] = [];
  const postJson = event.detail.postJson;
  const postMetadata = {
    id: postJson.id,
    user: postJson.user,
    service: "patreon",
    title: postJson.title,
    published: postJson.published,
    file: { path: postJson.file.path },
    attachments: '~'.repeat(postJson.attachments.length)
  };
  PATREON_METADATA_CACHE[userId].push(postMetadata);
  debouncedSave("PATREON_METADATA_CACHE", PATREON_METADATA_CACHE);
}
document.addEventListener("kp-user:add-patreon-cache", addPatreonCache);

function purgePatreonCache(event) { // called from page script
  const userId = event.detail.userId;
  if (PATREON_METADATA_CACHE[userId]) {
    delete PATREON_METADATA_CACHE[userId];
    debouncedSave("PATREON_METADATA_CACHE", PATREON_METADATA_CACHE);
  }
  const missingIndex = MISSING_PATREON.indexOf(userId);
  if (missingIndex > -1) {
    MISSING_PATREON.splice(missingIndex, 1);
    debouncedSave("MISSING_PATREON", MISSING_PATREON);
  }
}
document.addEventListener("kp-user:purge-patreon-cache", purgePatreonCache);
// ==</User Script>==

// ==<Main>==
const injectScript = document.createElement("script");
injectScript.textContent = `(${patchFetch})();`;
document.documentElement.appendChild(injectScript);
document.dispatchEvent(new CustomEvent("kp-page:load-data", {
  detail: {
    missingPatreon: MISSING_PATREON,
    renameCreators: RENAME_CREATORS,
    cachedPatreonPosts: PATREON_METADATA_CACHE
  }
}));
injectScript.remove();
// ==</Main>==

// ==<Injected Function>==
function patchFetch() {
  let MISSING_PATREON;
  let RENAME_CREATORS;
  let PATREON_METADATA_CACHE;
  let PATREON_METADATA_CACHE_POST_IDS;

  function loadData(event) { // called from user script
    // v1.4.1: This kemono bug seems to be fixed, so we don't use a persist list anymore. (Will still work on 404.)
    MISSING_PATREON = new Set(); // new Set(event.detail.missingPatreon);
    RENAME_CREATORS = event.detail.renameCreators;
    PATREON_METADATA_CACHE = event.detail.cachedPatreonPosts;
    PATREON_METADATA_CACHE_POST_IDS = new Set(PATREON_METADATA_CACHE.postIds);
  }
  document.addEventListener("kp-page:load-data", loadData);

  function renameCreator(event) { // called from user script
    const userKey = event.detail.userKey;
    const newName = event.detail.newName;
    if (newName === "") {
      delete RENAME_CREATORS[userKey];
    } else {
      RENAME_CREATORS[userKey] = newName;
    }
  }
  document.addEventListener("kp-page:rename-creator", renameCreator);

  function addMissingPatreon(userId) {
    if (!MISSING_PATREON.has(userId)) {
      MISSING_PATREON.add(userId);
      // v1.4.1: This kemono bug seems to be fixed, so we don't use a persist list anymore.
      /*
      document.dispatchEvent(new CustomEvent("kp-user:add-missing-patreon", {
        detail: { userId: userId }
      }));
      */
    }
  }

  const FAKE_PATREON_PROFILE = function(userId) {
    const userKey = `patreon-${userId}`;
    const name = RENAME_CREATORS[userKey] || userKey;
    const postCount = PATREON_METADATA_CACHE[userId]?.length || 0;
    const response = {
      id: userId,
      name: name,
      has_chats: true,
      post_count: postCount,
      service: "patreon"
    };
    return new Response(JSON.stringify(response));
  };

  const FAKE_PATREON_POSTS = function(userId, offset) {
    offset = parseInt(offset) || 0;
    const cachedPosts = PATREON_METADATA_CACHE[userId] || [];
    return new Response(JSON.stringify(cachedPosts.slice(offset, offset + 50)));
  };

  const nativeFetch = window.fetch.bind(window);

  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

  const silent429Fetch = async function (input, init) {
    try {
      const response = await nativeFetch(input, init);
      if (response.status === 429) {
        const MAX_RETRIES = 3;
        let attempt = 0;
        let delay = 500;
        while (attempt < MAX_RETRIES) {
          attempt++;
          console.log(`HTTP 429: ${window.location.href}\nRetry (attempt ${attempt}/${MAX_RETRIES}) in ${delay} ms...`);
          await sleep(delay);
          delay += 500; // backoff for next retry
          const response = await nativeFetch(input, init);
          if (response.ok || response.status !== 429 || attempt === MAX_RETRIES) {
            return response;
          }
        }
      }
      return response;
    } catch (error) {
      throw error;
    }
  };

  window.fetch = async function(input, init) {
    let url;
    if (input instanceof Request) {
      url = new URL(input.url);
    } else if (typeof input === "string") {
      try {
        url = new URL(input, location.origin);
      } catch (error) {
        return nativeFetch(input, init);
      }
    } else {
      return nativeFetch(input, init);
    }
    if (!url.pathname.startsWith("/api/v1/")) {
      return nativeFetch(input, init);
    }
    switch (url.pathname) {
      case "/api/v1/posts":
      case "/api/v1/posts/popular": {
        return silent429Fetch(input, init);
      }
    }
    const segments = url.pathname.split('/').filter(segment => segment);
    if (segments.length < 6 || segments[3] !== "user") {
      return nativeFetch(input, init);
    }
    const service = segments[2];
    const userId  = segments[4];
    const apiName = segments[5];
    switch (apiName) {
      case "profile": {
        if (segments.length !== 6) {
          return nativeFetch(input, init);
        }
        if (service === "patreon" && MISSING_PATREON.has(userId)) {
          return FAKE_PATREON_PROFILE(userId);
        }
        try {
          const response = await nativeFetch(input, init);
          if (response.ok) {
            document.dispatchEvent(new CustomEvent("kp-user:purge-patreon-cache", {
              detail: { userId: userId }
            }));
            const newName = RENAME_CREATORS[`${service}-${userId}`];
            if (newName) {
              const responseJSON = await response.json();
              responseJSON.name = newName;
              return new Response(JSON.stringify(responseJSON),
                { status: response.status, headers: response.headers }
              );
            }
          } else if (response.status === 404 && service === "patreon") {
            addMissingPatreon(userId);
            return FAKE_PATREON_PROFILE(userId);
          }
          return response;
        } catch (error) {
          return nativeFetch(input, init);
        }
      }
      case "posts": {
        if (segments.length !== 6) {
          return nativeFetch(input, init);
        }

        const offset = new URLSearchParams(url.search).get("o");
        if (service === "patreon" && MISSING_PATREON.has(userId)) {
          return FAKE_PATREON_POSTS(userId, offset);
        }
        try {
          const response = await silent429Fetch(input, init);
          if (response.status === 404 && service === "patreon") {
            return FAKE_PATREON_POSTS(userId, offset);
          }
          return response;
        } catch (error) {
          return nativeFetch(input, init);
        }
      }
      case "post": {
        if (!(segments.length === 7 ||
             (segments.length === 9 && segments[7] === "revision"))) {
          return nativeFetch(input, init);
        }

        const postId = segments[6];
        try {
          const response = await nativeFetch(input, init);
          if (response.ok) {
            const responseJSON = await response.json();
            const imported = [];
            const revisions = responseJSON.props.revisions;
            for (const revision of responseJSON.props.revisions) {
              imported.push(revision[1].added); // second element is post object
            }
            // Kemono front end cuts off imported date, send raw data to user script
            document.dispatchEvent(new CustomEvent("kp-user:load-imported-time", {
              detail: { postKey: `${service}-${userId}-${postId}`, imported: imported }
            }));

            // To Do: make a "white list" for creators do exist so no need for caching
            if (service === "patreon" && !PATREON_METADATA_CACHE_POST_IDS.has(postId)) {
              document.dispatchEvent(new CustomEvent("kp-user:add-patreon-cache", {
                detail: { userId: userId, postId: postId, postJson: responseJSON["post"] }
              }));
              PATREON_METADATA_CACHE_POST_IDS.add(postId);
            }

            return new Response(JSON.stringify(responseJSON),
              { status: response.status, headers: response.headers }
            );
          }
        } catch (error) {
          return nativeFetch(input, init);
        }
      }
    }
    return nativeFetch(input, init);
  };
}
// ==</Injected Function>==
})();
