// ==UserScript==
// @name         X.com SearchTimeline Saver 
// @namespace    x-search-saver
// @match        https://x.com/*
// @run-at       document-start
// @grant        GM_download
// @author       vaibhav04
// @version      1.1.1
// @description  SearchTimeline Saver
// @downloadURL https://update.greasyfork.org/scripts/563469/Xcom%20SearchTimeline%20Saver.user.js
// @updateURL https://update.greasyfork.org/scripts/563469/Xcom%20SearchTimeline%20Saver.meta.js
// ==/UserScript==

(function () {
    const TARGET = "/SearchTimeline";
    const KEY = "__x_saved_id__";

// floating rate limit panel
(function () {
    const box = document.createElement("div");
    box.id = "__x_rate_box__";
    box.style = `
        position: fixed;
        top: 10px;
        left: 10px;
        z-index: 999999;
        background: rgba(0,0,0,0.85);
        color: #00ff99;
        font: 12px monospace;
        padding: 8px 12px;
        border-radius: 6px;
        box-shadow: 0 0 8px rgba(0,0,0,.5);
    `;
    box.textContent = "X Rate: waiting…";
    document.documentElement.appendChild(box);
})();


   function logRateLimit(xhr) {
    try {
        const limit = xhr.getResponseHeader("x-rate-limit-limit");
        const remaining = xhr.getResponseHeader("x-rate-limit-remaining");
        const reset = xhr.getResponseHeader("x-rate-limit-reset");

        if (limit && remaining && reset) {
            const resetDate = new Date(parseInt(reset, 10) * 1000);

            const time12 = resetDate.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                second: "2-digit",
                hour12: true,
            });

            const msg = `X RATE\n${remaining}/${limit} left\nReset at: ${time12}`;

            console.log(
                `%c[X RATE] ${remaining}/${limit} left | reset at: ${time12}`,
                "color:orange;font-weight:bold;"
            );

            const box = document.getElementById("__x_rate_box__");
            if (box) box.textContent = msg;
        }
    } catch (e) {
        console.warn("[TM] Rate limit header read failed", e);
    }
}




    // --- Save ID from URL ---
    function saveIdFromUrl() {
        const params = new URLSearchParams(location.search);
        const id = params.get("id");
        if (id) {
            sessionStorage.setItem(KEY, id);
            console.log("[TM] Saved id:", id);
        }
    }

    saveIdFromUrl();

    const _pushState = history.pushState;
    const _replaceState = history.replaceState;
    function hookHistory(fn) {
        return function () {
            const ret = fn.apply(this, arguments);
            saveIdFromUrl();
            return ret;
        };
    }
    history.pushState = hookHistory(_pushState);
    history.replaceState = hookHistory(_replaceState);
    window.addEventListener("popstate", saveIdFromUrl);

    window.getSavedXId = () => sessionStorage.getItem(KEY);

    // --- Intercept XHR ---
    const _open = XMLHttpRequest.prototype.open;
    const _send = XMLHttpRequest.prototype.send;

    let counter = 0; // for filenames

    XMLHttpRequest.prototype.open = function (method, url, ...rest) {
        this._url = url;
        this._log = typeof url === "string" && url.includes(TARGET);
        return _open.call(this, method, url, ...rest);
    };

    XMLHttpRequest.prototype.send = function (...args) {
        if (this._log) {
            this.addEventListener("load", function () {
                console.log("[XHR REQ]", this._url);
                logRateLimit(this);
                if (this.responseType === "" || this.responseType === "text") {
                    try {
                        const json = JSON.parse(this.responseText);

                        // navigate to instructions
                        const instructions =
                              json?.data?.search_by_raw_query?.search_timeline?.timeline
                        ?.instructions;

                        // check if any TimelineAddEntries has non-empty entries
                        // check if any TimelineAddEntries has at least one tweet-* entryId
                        const hasTweetEntries = instructions?.some((ins) => {
                            if (ins.type !== "TimelineAddEntries" || !Array.isArray(ins.entries)) return false;

                            return ins.entries.some((e) => typeof e?.entryId === "string" && e.entryId.startsWith("tweet-"));
                        });

                        if (!hasTweetEntries) {
                            console.log("[TM] Skipping response (no tweet-* entries)");
                            return;
                        }


                        // save the file
                        const id = window.getSavedXId() || "unknown";
                        const filename = `${id}_${counter}.json`;
                        counter++;

                        GM_download({
                            url: "data:application/json," + encodeURIComponent(this.responseText),
                            name: filename,
                            saveAs: false,
                        });

                        console.log("[TM] Saved file:", filename);
                    } catch (e) {
                        console.warn("[TM] Failed to process XHR response:", e);
                    }
                } else {
                    console.log("[XHR RES]", this._url, `[binary: ${this.responseType}]`);
                }
            });
        }
        return _send.apply(this, args);
    };

    console.log("✅ SearchTimeline XHR logger + saver attached (skip empty entries)");
    // delete saved id when tab/window is closed
    window.addEventListener("beforeunload", () => {
        sessionStorage.removeItem(KEY);
        console.log("[TM] Cleared saved id on close");
    });

})();
