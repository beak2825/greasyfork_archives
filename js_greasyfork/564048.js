// ==UserScript==
// @name         Strict nicktrick Redirect (Injected Script)
// @namespace    strict-nicktrick-redirect
// @version      1.2
// @description  Inject redirect script ONLY when ?nicktrick= exists
// @match        *://*/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/564048/Strict%20nicktrick%20Redirect%20%28Injected%20Script%29.user.js
// @updateURL https://update.greasyfork.org/scripts/564048/Strict%20nicktrick%20Redirect%20%28Injected%20Script%29.meta.js
// ==/UserScript==

(function () {
    try {
        const url = new URL(location.href);

        if (!url.searchParams.has("nicktrick")) return;

        let target = url.searchParams.get("nicktrick");
        if (!target) return;

        // Decode safely (multi-layer)
        try {
            let prev;
            do {
                prev = target;
                target = decodeURIComponent(target);
            } while (prev !== target);
        } catch (_) {}

        if (!/^https?:\/\//i.test(target)) return;
        if (location.href === target) return;

        window.stop();
        document.open();
        document.write("");
        window.location.replace(target);
        document.close();
    } catch (e) {
        console.error("[Strict nicktrick] redirect failed:", e);
    }
})();