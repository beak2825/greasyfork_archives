// ==UserScript==
// @name         Anilist Anime Diff View
// @namespace    https://greasyfork.org/en/users/1544682-okabe-kiyouma
// @version      1.0.0
// @description  Generated a diff view between your anime list and another user anime list. It only adds non shared entries to already present shared entries in compare page.
// @author       Okabe Kiyouma
// @license      MIT License
// @run-at       document-end
// @connect       graphql.anilist.co
// @grant         GM_xmlhttpRequest
// @grant         GM_setValue
// @grant         GM_getValue
// @grant         GM.xmlHttpRequest
// @grant         GM.setValue
// @grant         GM.getValue
// @match        https://anilist.co/user/*/animelist/compare*
// @downloadURL https://update.greasyfork.org/scripts/558026/Anilist%20Anime%20Diff%20View.user.js
// @updateURL https://update.greasyfork.org/scripts/558026/Anilist%20Anime%20Diff%20View.meta.js
// ==/UserScript==

(async function () {
  "use strict";
  const ANILIST_API = "https://graphql.anilist.co";

  /**
   * User script manager functions.
   *
   * Provides compatibility between Tampermonkey, Greasemonkey 4+, etc...
   */
  const userScriptAPI = (() => {
    const api = {};

    if (typeof GM_xmlhttpRequest !== "undefined") {
      api.GM_xmlhttpRequest = GM_xmlhttpRequest;
    } else if (
      typeof GM !== "undefined" &&
      typeof GM.xmlHttpRequest !== "undefined"
    ) {
      api.GM_xmlhttpRequest = GM.xmlHttpRequest;
    }

    if (typeof GM_setValue !== "undefined") {
      api.GM_setValue = GM_setValue;
    } else if (
      typeof GM !== "undefined" &&
      typeof GM.setValue !== "undefined"
    ) {
      api.GM_setValue = GM.setValue;
    }

    if (typeof GM_getValue !== "undefined") {
      api.GM_getValue = GM_getValue;
    } else if (
      typeof GM !== "undefined" &&
      typeof GM.getValue !== "undefined"
    ) {
      api.GM_getValue = GM.getValue;
    }

    /** whether GM_xmlhttpRequest is supported. */
    api.supportsXHR = typeof api.GM_xmlhttpRequest !== "undefined";

    /** whether GM_setValue and GM_getValue are supported. */
    api.supportsStorage =
      typeof api.GM_getValue !== "undefined" &&
      typeof api.GM_setValue !== "undefined";

    return api;
  })();

  async function waitForElement(
    selector,
    container = document,
    timeoutSecs = 7
  ) {
    const element = container.querySelector(selector);
    if (element) {
      return Promise.resolve(element);
    }

    return new Promise((resolve, reject) => {
      const timeoutTime = Date.now() + timeoutSecs * 1000;
      const handler = () => {
        const element = document.querySelector(selector);
        if (element) {
          resolve(element);
        } else if (Date.now() > timeoutTime) {
          reject(new Error(`Timed out waiting for selector '${selector}'`));
        } else {
          setTimeout(handler, 100);
        }
      };
      setTimeout(handler, 1);
    });
  }

  async function fetchAnilist(query, variables = {}) {
    const response = await fetch(ANILIST_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/graphql-response+json",
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });
    if (!response.ok) {
      throw new Error(`${await response.text()}`);
    }
    return response.json();
  }

  const UserIdQuery = `
    query ($name: String) {
      User(name: $name) {
        id
        name
      }
    }
  `;
  async function getUserId(name) {
    const res = await fetchAnilist(UserIdQuery, { name });
    return res.data?.User?.id;
  }

  const MediaCollectionQuery = `
    query ($type: MediaType, $userId: Int) {
      MediaListCollection(type: $type, userId: $userId) {
        lists {
          name
          entries {
            id
            status
            score
            media {
              id
              title {
                romaji
              }
            }
          }
        }
      }
    }
  `;

  async function getAnimes(userId) {
    const list = await fetchAnilist(MediaCollectionQuery, {
      type: "ANIME",
      userId,
    });
    const entries = new Map();
    list.data?.MediaListCollection?.lists?.forEach((list) => {
      list?.entries?.forEach((entry) => {
        if (!entry || !entry.media || !entry.media.title) return;
        entries.set(entry.media.id, {
          id: entry.media.id,
          name: entry.media.title.romaji,
          status: entry.status,
          score: entry.score,
        });
      });
    });
    return entries;
  }

  function makeDiffFromLists(list1, list2) {
    const setA = new Set(list1.keys());
    const setB = new Set(list2.keys());

    const list1Exclusive = [];
    const list2Exclusive = [];

    setA.difference(setB).forEach((s) => {
      const { name: anime, status, score } = list1.get(s);
      list1Exclusive.push({
        id: s,
        name: anime,
        status: [status, null],
        score: [score, null],
      });
    });

    setB.difference(setA).forEach((s) => {
      const { name: anime, status, score } = list2.get(s);
      list2Exclusive.push({
        id: s,
        name: anime,
        status: [null, status],
        score: [null, score],
      });
    });
    return { list1Exclusive, list2Exclusive };
  }

  function titleCase(a) {
    return a[0].toUpperCase() + a.slice(1).toLowerCase();
  }

  await waitForElement("div.compare div.entry.header div.title");

  const button = document.createElement("button");
  button.innerText = "Diff";
  button.style.zIndex = "1000";
  button.style.padding = "10px";
  button.style.background = "rgb(147, 87, 193)";
  button.style.fontFamily =
    "Overpass, -apple-system, BlinkMacSystemFont, Segoe UI, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif";
  button.style.fontSize = "14px";
  button.style.fontWeight = "600";
  button.onmouseover = () => {
    button.style.background = "rgb(179, 104, 230)";
  };
  button.onmouseout = () => {
    button.style.background = "rgb(147, 87, 193)";
  };
  button.style.borderRadius = "4px";
  button.style.color = "white";
  button.style.borderWidth = "0px";

  document.querySelector("div.compare").prepend(button);
  button.onclick = async () => {
    if (button.innerText !== "Diff") return;
    button.innerText = "Loading";
    const user = document.querySelectorAll("div.name-wrapper h1.name")[0]
      .innerText;
    const self = document
      .querySelectorAll("div.links a.link")[1]
      .href.split("/")
      .at(-2);
    const selfId = await getUserId(self);
    const userId = await getUserId(user);
    const selfList = await getAnimes(selfId);
    const userList = await getAnimes(userId);
    const { list1Exclusive, list2Exclusive } = makeDiffFromLists(
      selfList,
      userList
    );

    const entries = document.querySelectorAll("div.compare div.entry");
    const parent = document.querySelector("div.compare");

    list1Exclusive.forEach((l) => {
      const clonedNode = entries[1].cloneNode(true);
      clonedNode.children[0].children[0].innerText = l.name;
      clonedNode.children[0].children[0].href = `/anime/${l.id}/`;
      clonedNode.children[1].innerText = l.score[0];
      clonedNode.children[2].innerText = "-";
      clonedNode.children[3].innerText = titleCase(l.status[0]);
      clonedNode.children[4].innerText = "-";
      parent.insertBefore(clonedNode, entries[1]);
    });

    list2Exclusive.forEach((l) => {
      const clonedNode = entries[1].cloneNode(true);
      clonedNode.children[0].children[0].innerText = l.name;
      clonedNode.children[0].children[0].href = `/anime/${l.id}/`;
      clonedNode.children[1].innerText = "-";
      clonedNode.children[2].innerText = l.score[1];
      clonedNode.children[3].innerText = "-";
      clonedNode.children[4].innerText = titleCase(l.status[1]);
      parent.insertBefore(clonedNode, entries[1]);
    });
    button.innerText = "Success";
  };
})();
