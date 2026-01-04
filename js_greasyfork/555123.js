// ==UserScript==
// @name         FMHY Base64 Auto Decoder + Toggle + Pastebin Fix
// @version      2.7
// @description  Decode base64-encoded links, make URLs clickable, add UI toggle
// @match        *://rentry.co/*
// @match        *://rentry.org/*
// @match        *://pastes.fmhy.net/*
// @match        *://bin.disroot.org/?*#*
// @match        *://privatebin.net/?*#*
// @match        *://textbin.xyz/?*#*
// @match        *://bin.idrix.fr/?*#*
// @match        *://privatebin.rinuploads.org/?*#*
// @match        *://pastebin.com/*
// @grant        none
// @namespace https://greasyfork.org/users/1535373
// @downloadURL https://update.greasyfork.org/scripts/555123/FMHY%20Base64%20Auto%20Decoder%20%2B%20Toggle%20%2B%20Pastebin%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/555123/FMHY%20Base64%20Auto%20Decoder%20%2B%20Toggle%20%2B%20Pastebin%20Fix.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* ==========================
       UI TOGGLE BUTTON
    =========================== */

    let enabled = localStorage.getItem("fmhy_decoder_enabled") !== "false";

    const btn = document.createElement("button");
    btn.textContent = enabled ? "FMHY Decoder: ON" : "FMHY Decoder: OFF";
    btn.style.position = "fixed";
    btn.style.top = "15px";
    btn.style.right = "15px";
    btn.style.zIndex = "999999";
    btn.style.padding = "8px 12px";
    btn.style.background = enabled ? "#4CAF50" : "#b33a3a";
    btn.style.color = "white";
    btn.style.border = "none";
    btn.style.borderRadius = "6px";
    btn.style.cursor = "pointer";
    btn.style.fontSize = "14px";
    btn.style.boxShadow = "0px 0px 6px rgba(0,0,0,0.3)";
    document.body.appendChild(btn);

    btn.onclick = () => {
        enabled = !enabled;
        localStorage.setItem("fmhy_decoder_enabled", enabled);
        btn.textContent = enabled ? "FMHY Decoder: ON" : "FMHY Decoder: OFF";
        btn.style.background = enabled ? "#4CAF50" : "#b33a3a";
        location.reload();
    };

    if (!enabled) return;

    /* ==========================
       BASE64 HELPERS
    =========================== */

    const base64Regex = /^[A-Za-z0-9+/]+={0,2}$/;

    function decodeBase64(encodedString) {
        return atob(encodedString);
    }

    function isURL(str) {
        const pattern = /^(https?|ftp):\/\/[^\s]+$/i;
        return pattern.test(str);
    }

    /* ==========================
       URL MATCH RULES
    =========================== */

    var currentUrl = window.location.href;

    const rentryOrSnowbinRegex = /^(https?:\/\/(?:rentry\.co|rentry\.org|pastes\.fmhy\.net)\/[\w\W]+)/;
    const FMHYmainBase64PageRegex = /^https:\/\/rentry\.(?:co|org)\/fmhybase64(?:#.*)?/i;
    const fmhyBase64RawRentryPageRegex = /^https:\/\/rentry\.(co|org)\/FMHYBase64\/raw$/i;
    const privatebinDomainsRegex = /^(https?:\/\/(?:bin\.disroot\.org|privatebin\.net|textbin\.xyz|bin\.idrix\.fr|privatebin\.rinuploads\.org)\/[\w\W]+)/;
    const pastebinComRegex = /^https:\/\/pastebin\.com\/.*/;

    /* ==========================
       PASTEBIN (IMPROVED)
    =========================== */

    if (pastebinComRegex.test(currentUrl)) {
        let elements = document.querySelectorAll('.de1');

        elements.forEach(function (element) {
            let text = element.textContent;

            // Find ALL potential Base64 substrings
            const base64Matches = text.match(/[A-Za-z0-9+/]+={0,2}/g);
            if (!base64Matches) return;

            let html = text;
            const originalColor = window.getComputedStyle(element).color;

            base64Matches.forEach(encoded => {
                if (!base64Regex.test(encoded)) return;

                let decoded;
                try {
                    decoded = atob(encoded);
                } catch {
                    return;
                }

                // Detect URLs inside decoded text
                const urls = decoded.match(/https?:\/\/[^\s]+/g);

                if (urls) {
                    urls.forEach(url => {
                        const clickable = `<a href="${url}" target="_blank">${url}</a>`;
                        decoded = decoded.replace(url, clickable);
                    });
                }

                // Replace the Base64 with decoded output
                html = html.replace(encoded, decoded.replace(/\n/g, "<br>"));
            });

            element.innerHTML = `<span style="color:${originalColor}">${html}</span>`;
        });
    }

    /* ==========================
       RENTRY / FMHY
    =========================== */

    else if (rentryOrSnowbinRegex.test(currentUrl) && !fmhyBase64RawRentryPageRegex.test(currentUrl)) {

        var elementsToCheck = FMHYmainBase64PageRegex.test(currentUrl)
            ? document.querySelectorAll('code')
            : document.querySelectorAll('code, p');

        elementsToCheck.forEach(function (element) {
            var content = element.textContent.trim();

            if (base64Regex.test(content)) {
                var decodedString = decodeBase64(content).trim();

                if (isURL(decodedString) || (decodedString.includes('http') && decodedString.includes('\n'))) {

                    if (!decodedString.includes('\n')) {
                        var link = document.createElement('a');
                        link.href = decodedString;
                        link.textContent = decodedString;
                        link.target = '_self';
                        element.textContent = '';
                        element.appendChild(link);

                    } else {
                        const lines = decodedString.split("\n");
                        const links = lines.map(line =>
                            isURL(line.trim())
                                ? "<a href='" + line.trim() + "'>" + line.trim() + "</a>"
                                : line.trim()
                        );
                        element.innerHTML = links.join("<br>");
                    }
                }
            }
        });
    }

    /* ==========================
       FMHY RAW RENTRY PAGE
    =========================== */

    else if (fmhyBase64RawRentryPageRegex.test(currentUrl)) {
        const lines = document.body.innerText.split('\n');
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (line.includes('`')) {
                const startIndex = line.indexOf('`');
                const endIndex = line.lastIndexOf('`');
                const encodedText = line.substring(startIndex + 1, endIndex).trim();
                const decodedText = atob(encodedText);
                const newLine = line.substring(0, startIndex) + decodedText + line.substring(endIndex + 1);
                lines[i] = newLine;
            }
        }
        document.body.innerText = lines.join('\n');
    }

    /* ==========================
       PRIVATEBIN
    =========================== */

    else if (privatebinDomainsRegex.test(currentUrl)) {

        function waitForDecryption() {
            const prettyPrintElement = document.getElementById('prettyprint');
            if (prettyPrintElement && prettyPrintElement.textContent.trim() !== '') {

                let decryptedText = prettyPrintElement.innerHTML.trim();
                const lines = decryptedText.split('\n');
                let modified = false;

                lines.forEach(line => {
                    if (base64Regex.test(line)) {
                        try {
                            const decoded = decodeBase64(line).trim();
                            if (isURL(decoded)) {
                                decryptedText = decryptedText.replace(line, `<a href="${decoded}">${decoded}</a>`);
                                modified = true;
                            }
                        } catch { }
                    }
                });

                if (modified) prettyPrintElement.innerHTML = decryptedText;

            } else setTimeout(waitForDecryption, 500);
        }

        waitForDecryption();
    }

})();
