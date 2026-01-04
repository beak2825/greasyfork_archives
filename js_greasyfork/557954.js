// ==UserScript==
// @name         Export Cookies
// @name:zh-CN   导出 Cookies
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  Export cookies to various formats in one click!
// @description:zh-CN 一键导出多种格式的 Cookies！
// @author       PRO-2684, aspen138
// @match        *://*/*
// @run-at       context-menu
// @license      gpl-3.0
// @grant        GM_registerMenuCommand
// @grant        GM.cookie
// @grant        GM.download
// @grant        GM_setClipboard
// @icon         data:image/png;base64,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
// @downloadURL https://update.greasyfork.org/scripts/557954/Export%20Cookies.user.js
// @updateURL https://update.greasyfork.org/scripts/557954/Export%20Cookies.meta.js
// ==/UserScript==

(function () {
    "use strict";
    const log = () => { };
    // const log = console.log.bind(console, `[${GM.info.script.name}]`);
    // Adapted from https://github.com/kairi003/Get-cookies.txt-LOCALLY/blob/master/src/modules/cookie_format.mjs
    function jsonToNetscapeMapper(cookies) {
        return cookies.map(({ domain, expirationDate, path, secure, name, value }) => {
            const includeSubDomain = !!domain?.startsWith('.');
            const expiry = expirationDate?.toFixed() ?? '0';
            const arr = [domain, includeSubDomain, path, secure, expiry, name, value];
            return arr.map((v) => (typeof v === 'boolean' ? v.toString().toUpperCase() : v));
        });
    };
    const formats = {
        netscape: {
            ext: '.txt',
            mimeType: 'text/plain',
            serializer: (cookies) => {
                const netscapeTable = jsonToNetscapeMapper(cookies);
                const text = [
                    '# Netscape HTTP Cookie File',
                    '# http://curl.haxx.se/rfc/cookie_spec.html',
                    '# This file was generated by Export Cookies! Edit at your own risk.',
                    '',
                    ...netscapeTable.map((row) => row.join('\t')),
                    '' // Add a new line at the end
                ].join('\n');
                return text;
            }
        },
        json: {
            ext: '.json',
            mimeType: 'application/json',
            serializer: JSON.stringify
        }
    };
    async function blobCookies(format) {
        const { mimeType, serializer } = formats[format];
        const cookies = await GM.cookie.list({});
        log("Extracted cookies:", cookies);
        const text = serializer(cookies);
        log("Serialized cookies:", text);
        const blob = new Blob([text], { type: mimeType });
        return { blob: URL.createObjectURL(blob), text };
    }
    async function getCookiesText(format) {
        const { serializer } = formats[format];
        const cookies = await GM.cookie.list({});
        log("Extracted cookies:", cookies);
        const text = serializer(cookies);
        log("Serialized cookies:", text);
        return text;
    }
    const action = prompt(
        'Please select an action:\n\n' +
        '1. Export as Netscape format (.txt)\n' +
        '2. Export as JSON format (.json)\n' +
        '3. Copy Netscape format to clipboard\n' +
        '4. Copy JSON format to clipboard\n\n' +
        'Enter 1, 2, 3, or 4:'
    );

    if (action === '1' || action === '2') {
        const format = action === '1' ? 'netscape' : 'json';
        blobCookies(format).then(({ blob }) => {
            GM.download(blob, `cookies${formats[format].ext}`).then(() => {
                URL.revokeObjectURL(blob);
                console.log(`Cookies exported in ${format.toUpperCase()} format.`);
            }).catch((err) => {
                console.error('Failed to download the cookies.', err);
            });
        });
    } else if (action === '3' || action === '4') {
        const format = action === '3' ? 'netscape' : 'json';
        getCookiesText(format).then((text) => {
            GM_setClipboard(text, 'text');
            console.log(`Cookies copied to clipboard in ${format.toUpperCase()} format.`);
            alert(`Cookies copied to clipboard in ${format.toUpperCase()} format.`);
        }).catch((err) => {
            console.error('Failed to copy cookies to clipboard.', err);
        });
    } else if (action !== null) {
        alert('Invalid option. Please run the script again and enter 1, 2, 3, or 4.');
    }
})();