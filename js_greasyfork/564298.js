// ==UserScript==
// @name        TensorArt Downloader
// @namespace   https://gist.github.com/angrytoenail/bef6d23f43430f857e5c94cfc241954e
// @author      Angry Toenail
// @description Download images/videos flagged as inappropriate.
// @match       https://tensor.art/
// @match       https://tensor.art/*
// @version     0.2
// @run-at      document-start
// @icon        https://www.google.com/s2/favicons?sz=64&domain=tensor.art
// @downloadURL https://update.greasyfork.org/scripts/564298/TensorArt%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/564298/TensorArt%20Downloader.meta.js
// ==/UserScript==

(async () => {
  "use strict";

  const print = console.log.bind(window.console);
  const win = typeof unsafeWindow !== "undefined" ? unsafeWindow : window;
  const token = await getToken();

  async function getToken() {
    const token = await win.cookieStore.get("ta_token_prod");
    return token.value;
  }

  // Intercept fetch to listen for requests to `/works/tasks/query`
  const _fetch = win.fetch;
  win.fetch = async function (...args) {
    const response = await _fetch.apply(this, args);
    const url = typeof args[0] === "string" ? args[0] : args[0].url;
    if (url.includes("/query")) {
      const clonedResponse = response.clone();
      clonedResponse
        .json()
        .then((data) => window.dispatchEvent(new CustomEvent("reloadQuery", { detail: data })))
        .catch((err) => print("🍆 Error intercepting query response:", err));
    }
    return response;
  };

  // Event handler for query data when tasks reloaded
  window.removeEventListener("reloadQuery", queryEventHandler, false);
  window.addEventListener("reloadQuery", queryEventHandler, false);

  async function queryEventHandler(event) {
    print("🌈 Query data event received", event.detail);
    const tasks = event.detail.data.tasks;
    for (const task of tasks) {
      // The "Task ID" on the page is actually the routeId
      const taskEl = findTaskElement(task.routeId);
      if (!taskEl) {
        continue;
      }
      const taskItems = taskEl.querySelectorAll(".group.cursor-not-allowed");
      for (const [idx, itemEl] of taskItems.entries()) {
        const item = task.items[idx];
        const url = await getDownloadUrl(item.imageId);
        if (url) {
          const downloadBtn = createDownloadButton(url);
          itemEl.querySelector(".cursor-not-allowed>button").replaceWith(downloadBtn);
        }
      }
    }
  }

  function findTaskElement(taskId) {
    const taskList = document.querySelector("div.space-y-12:has(>div:not([class]))");
    const taskIds = taskList.querySelectorAll(".space-y-8>.items-center:has(span):first-child>div:first-of-type>span");
    for (const taskEl of taskIds) {
      if (taskEl.textContent.trim() === taskId) {
        return taskEl.closest("div:not(div[class])");
      }
    }
  }

  function createDownloadButton(href) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = "🖕 Download";
    btn.classList.add("mt-12", "vi-button", "vi-button--size-medium", "vi-button--type-dark");
    btn.onclick = () => win.open(href, "_blank");
    return btn;
  }

  async function getDownloadUrl(id) {
    const baseUrl = "https://api.tensor.art/works/v1";
    const res = await _fetch(baseUrl + "/generation/image/download", {
      method: "POST",
      body: JSON.stringify({ ids: [id] }),
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "X-Request-Package-Sign-Version": "0.0.1",
        "X-Request-Package-Id": "3000",
        "X-Request-Timestamp": "1766394106674",
        "X-Request-Sign": "NDc3MTZiZDc2MDlhOWJlMTQ1YTMxNjgwYzE4NzljMDRjNTQ3ZTgzMjUyNjk1YTE5YzkzYzdhOGNmYWJiYTI1NA==",
        "X-Request-Lang": "en-US",
        "X-Request-Sign-Type": "HMAC_SHA256",
        "X-Request-Sign-Version": "v1",
      },
    });
    if (!res.ok) return null;

    const data = await res.json();
    if (data.data.images.length > 0) {
      const item = data.data.images[0];
      return item.url;
    }
    return null;
  }
})();
