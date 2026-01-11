// ==UserScript==
// @name         Request Blocker (Menu Editor)
// @author       beak2825 / jarivivi
// @namespace    tm-request-blocker
// @version      1.1.0
// @description  Block network requests using editable regex & URL lists via menu button
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @license      MIT
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/562270/Request%20Blocker%20%28Menu%20Editor%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562270/Request%20Blocker%20%28Menu%20Editor%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* =========================
       Persistent Storage Keys
       ========================= */
    const STORAGE_KEY = "request_blocker_rules";

    /* =========================
       Default Rules (editable)
       ========================= */
    const DEFAULT_RULES = {
        exact: [
            "https://example.com/bad.js",
            "https://cdn.perfops.net/rom3/rom3.min.js"
        ],
        regex: [
            ".*\\/ads\\/.*",
            "https?:\\/\\/.*analytics.*"
        ]
    };

    /* =========================
       Load / Save Rules
       ========================= */
    function loadRules() {
        return GM_getValue(STORAGE_KEY, DEFAULT_RULES);
    }

    function saveRules(rules) {
        GM_setValue(STORAGE_KEY, rules);
    }

    /* =========================
       Rule Matching
       ========================= */
    function isBlocked(url) {
        const rules = loadRules();

        if (rules.exact.includes(url)) return true;

        for (const pattern of rules.regex) {
            try {
                if (new RegExp(pattern).test(url)) return true;
            } catch (e) {
                console.warn("Invalid regex:", pattern);
            }
        }
        return false;
    }

    /* =========================
       Network Interception
       ========================= */
    const originalFetch = window.fetch;
    window.fetch = function (input, init) {
        const url = typeof input === "string" ? input : input.url;
        if (isBlocked(url)) {
            console.warn("[Request Blocker] Blocked fetch:", url);
            return Promise.resolve(
                new Response(null, { status: 403, statusText: "Blocked" })
            );
        }
        return originalFetch(input, init);
    };

    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url, ...rest) {
        if (isBlocked(url)) {
            console.warn("[Request Blocker] Blocked XHR:", url);
            return;
        }
        return originalOpen.call(this, method, url, ...rest);
    };

    /* =========================
       Menu Command UI
       ========================= */
    GM_registerMenuCommand("Edit Blocked Requests", openEditor);

    function openEditor() {
        const rules = loadRules();

        const win = window.open("", "_blank", "width=800,height=600");
        win.document.write(`
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Request Blocker Editor</title>
<style>
body { font-family: monospace; background:#111; color:#eee; padding:20px }
textarea { width:100%; height:180px; background:#000; color:#0f0 }
button { margin-top:10px; padding:8px 14px; font-size:14px }
h2 { color:#6cf }
</style>
</head>
<body>

<h2>Exact URL Matches</h2>
<textarea id="exact">${rules.exact.join("\n")}</textarea>

<h2>Regex Rules (one per line)</h2>
<textarea id="regex">${rules.regex.join("\n")}</textarea>

<button onclick="save()">Save Rules</button>
<button onclick="close()">Close</button>

<script>
function save() {
    const exact = document.getElementById("exact").value
        .split("\\n").map(v => v.trim()).filter(Boolean);
    const regex = document.getElementById("regex").value
        .split("\\n").map(v => v.trim()).filter(Boolean);

    window.opener.postMessage({
        type: "SAVE_RULES",
        rules: { exact, regex }
    }, "*");

    alert("Rules saved. Reload pages to apply.");
}
</script>

</body>
</html>
        `);
    }

    /* =========================
       Receive Rules from UI
       ========================= */
    window.addEventListener("message", event => {
        if (event.data?.type === "SAVE_RULES") {
            saveRules(event.data.rules);
            console.log("[Request Blocker] Rules updated:", event.data.rules);
        }
    });

})();
