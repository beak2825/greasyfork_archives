// ==UserScript==
// @name         Redirect Medium Anywhere to scribe.rip
// @version      0.5
// @match        *://*/*
// @run-at       document-start
// @namespace https://davidblue.wtf
// @description Auto-redirect Medium articles even on custom domains
// @downloadURL https://update.greasyfork.org/scripts/556938/Redirect%20Medium%20Anywhere%20to%20scriberip.user.js
// @updateURL https://update.greasyfork.org/scripts/556938/Redirect%20Medium%20Anywhere%20to%20scriberip.meta.js
// ==/UserScript==

(function() {
    if (location.href.includes("scribe.rip")) return;

    // Medium always injects a signature script: "__GRAPHQL_URI__"
    // and JSON-LD with "@type":"Article" and "publisher":{"@id":"https://medium.com/"}
    function mediumFingerprint(html) {
        return (
            html.includes('__GRAPHQL_URI__') ||
            html.includes('"publisher":{"@id":"https://medium.com/"') ||
            html.includes('"@id":"https://medium.com/#publisher"')
        );
    }

    let done = false;

    const observer = new MutationObserver(() => {
        if (done) return;

        const html = document.documentElement.innerHTML;
        if (mediumFingerprint(html)) {
            done = true;
            location.replace(
                "https://scribe.rip" +
                location.pathname +
                location.search +
                location.hash
            );
        }
    });

    observer.observe(document.documentElement, { childList: true, subtree: true });
})();
