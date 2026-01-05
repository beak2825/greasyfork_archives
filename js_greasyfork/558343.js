// ==UserScript==
// @name         Force http:// and Copy (GM Version)
// @version      1.0
// @description  Prepends http:// and fixes Copy button for line.kanale-shqip.com links
// @match        https://lion2.bycdn.network/devices/m3u*
// @match        https://lion-x.bycdn.network/devices/m3u*
// @match        https://bqpanel.com/devices/m3u*
// @grant        none
// @run-at       document-idle
// @namespace https://greasyfork.org/users/1516350
// @downloadURL https://update.greasyfork.org/scripts/558343/Force%20http%3A%20and%20Copy%20%28GM%20Version%29.user.js
// @updateURL https://update.greasyfork.org/scripts/558343/Force%20http%3A%20and%20Copy%20%28GM%20Version%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const HOST = "line.kanale-shqip.com/get.php";
    const PREFIX = "http://";
    const POLL = 200;

    function toast(msg) {
        let t = document.getElementById("__gm_toast");
        if (!t) {
            t = document.createElement("div");
            t.id = "__gm_toast";
            t.style.cssText =
                "position:fixed;bottom:10px;right:10px;background:black;color:white;padding:6px 10px;border-radius:6px;z-index:999999;font-size:12px;";
            document.body.appendChild(t);
        }
        t.textContent = msg;
        t.style.opacity = "1";
        clearTimeout(window.__gm_to);
        window.__gm_to = setTimeout(() => (t.style.opacity = "0"), 1500);
    }

    function findInput() {
        const inputs = document.querySelectorAll("input[type='text'], textarea");
        for (let i of inputs) {
            if (i.value.includes(HOST)) return i;
        }
        return null;
    }

    function fix(input) {
        if (!input) return;
        if (input.value.startsWith("http")) return;

        if (input.value.includes(HOST)) {
            input.value = PREFIX + input.value;
            input.dispatchEvent(new Event("input", { bubbles: true }));
            input.dispatchEvent(new Event("change", { bubbles: true }));
            toast("Fixed http://");
        }
    }

    function overrideCopy(input) {
        const btns = document.querySelectorAll("button, a");
        btns.forEach(b => {
            if (b.__gm_copy) return;
            if (!b.textContent.toLowerCase().includes("copy")) return;

            b.__gm_copy = true;
            b.addEventListener("click", () => {
                let v = input.value;
                if (!v.startsWith("http")) v = PREFIX + v;

                navigator.clipboard.writeText(v)
                    .then(() => toast("Copied"))
                    .catch(() => {
                        let ta = document.createElement("textarea");
                        ta.value = v;
                        document.body.appendChild(ta);
                        ta.select();
                        document.execCommand("copy");
                        document.body.removeChild(ta);
                        toast("Copied (fallback)");
                    });
            }, true);
        });
    }

    setInterval(() => {
        const input = findInput();
        if (input) {
            fix(input);
            overrideCopy(input);
        }
    }, POLL);

})();