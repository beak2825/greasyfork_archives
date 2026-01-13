// ==UserScript==
// @name        fweb Command for Programmable Notepad
// @namespace   ccn0
// @author      CCN0
// @version     1
// @icon        https://ccn0.net/things/notepad/favicon.png
// @match       *://ccn0.net/things/notepad/programmable*
// @match       *://127.0.0.1:8000/things/notepad/programmable*
// @grant       GM_xmlhttpRequest
// @description adds a >fweb command to fetch any file to Programmable Notepad by CCN0
// @downloadURL https://update.greasyfork.org/scripts/562347/fweb%20Command%20for%20Programmable%20Notepad.user.js
// @updateURL https://update.greasyfork.org/scripts/562347/fweb%20Command%20for%20Programmable%20Notepad.meta.js
// ==/UserScript==

(function() {
    COMMANDS.fweb = (inf) => {
        const url = inf.args.join(" ");
        if (!url) {
            insertAtCursor("error: no URL provided\n");
            return;
        };
        if (confirm(`Are you sure you want to load this file from "${url}"?`)) {
             GM_xmlhttpRequest({
                method: "GET",
                url: url,
                onload: function(response) {
                    if (response.status >= 200 && response.status < 300) {
                        replaceLine(NP.cursorPosition[0], response.responseText);
                    NP.updateXHeight();
                    } else {
                        insertAtCursor(`http error ${response.status}\n`);
                    }
                },
                onerror: function(error) {
                    insertAtCursor(`request failed: ${error.error || 'unknown error'}\n`);
                }
            });
        };
    };
    NP.help.fweb = {
        args:"<url>",
        text:"force fetches url using gm_xmlhttprequest"
    };
})();