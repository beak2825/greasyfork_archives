// ==UserScript==
// @name         TORN: Travel Sync
// @namespace    dekleinekobini.travel-sync
// @version      1.1.1
// @author       DeKleineKobini [2114440]
// @description  Send travel data to YATA and Prometheus.
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @match        https://www.torn.com/page.php?sid=travel*
// @connect      yata.yt
// @connect      prombot.co.uk
// @grant        GM_info
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/558681/TORN%3A%20Travel%20Sync.user.js
// @updateURL https://update.greasyfork.org/scripts/558681/TORN%3A%20Travel%20Sync.meta.js
// ==/UserScript==

(function () {
  'use strict';

  class FetchError extends Error {
    status;
    statusText;
    responseText;
    code;
    constructor(message, status, statusText, responseText, code) {
      super(message), this.name = "FetchError", this.status = status, this.statusText = statusText, this.responseText = responseText, this.code = code;
    }
  }
  function fetchGM(url, options) {
    const method = options?.method || "GET";
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method,
        url,
        headers: options?.headers,
        data: options?.body,
        onload: (response) => {
          if (response.status === 200)
            try {
              resolve(JSON.parse(response.responseText));
            } catch {
              reject(
                new FetchError(
                  "Response isn't in a supported format!",
                  response.status,
                  response.statusText,
                  response.responseText,
                  "INVALID_RESPONSE_FORMAT"
                )
              );
            }
          else
            reject(
              new FetchError(
                `Failed with status ${response.status}.`,
                response.status,
                response.statusText,
                response.responseText,
                `HTTP_STATUS_${response.status}`
              )
            );
        },
        onerror: (response) => {
          reject(
            new FetchError(
              `Unexpected error ${response.status}.`,
              response.status,
              response.statusText,
              response.responseText,
              `HTTP_STATUS_${response.status}`
            )
          );
        },
        ontimeout: () => reject(new FetchError("Request timed out.", null, null, null, "REQUEST_TIMED_OUT")),
        onabort: () => reject(new FetchError("Request timed out.", null, null, null, "REQUEST_ABORTED"))
      });
    });
  }
  let nextUpdate = 0;
  async function onFetchIntercept(response) {
    const page = response.url.substring(response.url.indexOf("torn.com/") + "torn.com/".length, response.url.indexOf(".php"));
    if (page !== "page") return;
    const params = new URL(response.url).searchParams;
    const sid = params.get("sid");
    if (sid !== "travelData") return;
    const step = params.get("step");
    if (step !== "shop") return;
    if (!document.hasFocus()) return;
    let json = {};
    try {
      json = await response.clone().json();
    } catch {
    }
    const data = json;
    let items;
    if ("shops" in data && data.shops) {
      items = data.shops.flatMap((shop) => shop.stock).map((s) => ({
        id: s.ID,
        quantity: s.stock,
        cost: s.price
      }));
    } else if ("stock" in data && data.stock) {
      items = data.stock.map((s) => ({ id: s.ID, quantity: s.stock, cost: s.price }));
    } else {
      throw new Error("Unexpected abroad travel data response!");
    }
    const country = json.country;
    syncData(items, country);
  }
  function syncData(items, country) {
    if (Date.now() < nextUpdate) {
      return;
    }
    nextUpdate = Date.now() + 3e4;
    const data = {
      client: "Travel Sync",
      version: GM_info.script.version,
      author_name: "DeKleineKobini",
      author_id: 2114440,
      country: country.trim().slice(0, 3).toLowerCase(),
      items
    };
    fetchGM("https://yata.yt/api/v1/travel/import/", { method: "POST", body: JSON.stringify(data) }).then((response) => console.log("Travel Sync - Updated YATA abroad prices.", response)).catch((error) => console.warn("Travel Sync - Failed to update YATA abroad prices.", error));
    fetchGM("https://api.prombot.co.uk/api/travel ", { method: "POST", body: JSON.stringify(data), headers: { "Content-Type": "application/json" } }).then((response) => console.log("Travel Sync - Updated Prometheus abroad prices.", response)).catch((error) => console.warn("Travel Sync - Failed to update Prometheus abroad prices.", error));
  }
  (() => {
    if (document.body.dataset.abroad !== "true") return;
    const oldFetch = unsafeWindow.fetch;
    unsafeWindow.fetch = function() {
      return new Promise((resolve, reject) => {
        oldFetch.apply(this, arguments).then(async (response) => {
          void onFetchIntercept(response);
          resolve(response);
        }).catch((error) => reject(error));
      });
    };
  })();

})();