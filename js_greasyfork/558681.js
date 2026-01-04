// ==UserScript==
// @name         TORN: Travel Sync
// @namespace    dekleinekobini.travel-sync
// @version      1.1.0
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

  var _GM_info = (() => typeof GM_info != "undefined" ? GM_info : void 0)();
  var _GM_xmlhttpRequest = (() => typeof GM_xmlhttpRequest != "undefined" ? GM_xmlhttpRequest : void 0)();
  var _unsafeWindow = (() => typeof unsafeWindow != "undefined" ? unsafeWindow : void 0)();
  function fetchGM(url, options) {
    const method = options?.method || "GET";
    return new Promise((resolve, reject) => {
      _GM_xmlhttpRequest({
        method,
        url,
        headers: options?.headers,
        data: options?.body,
        onload: (response) => {
          response.status === 200 ? resolve(JSON.parse(response.responseText)) : reject(new Error(`Request failed with status: ${response.status} - ${response.statusText}`));
        },
        onerror: (response) => reject(new Error(`Request failed with status: ${response.status} - ${response.statusText} or error: ${response.error}`)),
        ontimeout: () => reject(new Error("Request timed out")),
        onabort: () => reject(new Error("Request aborted"))
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
      version: _GM_info.script.version,
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
    const oldFetch = _unsafeWindow.fetch;
    _unsafeWindow.fetch = function() {
      return new Promise((resolve, reject) => {
        oldFetch.apply(this, arguments).then(async (response) => {
          void onFetchIntercept(response);
          resolve(response);
        }).catch((error) => reject(error));
      });
    };
  })();

})();