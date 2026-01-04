// ==UserScript==
// @name         Misskey Remote Follow Helper
// @namespace    https://controlnet.space/
// @version      0.1
// @description  Remote follow the user of the current page on your Misskey instance via a Tampermonkey menu item.
// @author       ControlNet
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @connect      *
// @license      agpl-3.0
// @downloadURL https://update.greasyfork.org/scripts/556144/Misskey%20Remote%20Follow%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/556144/Misskey%20Remote%20Follow%20Helper.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /******************************************************************
     * CONFIG STORAGE (user input via menu)
     ******************************************************************/
    const KEY_INSTANCE = 'mrh_instance_host';
    const KEY_TOKEN    = 'mrh_api_token';

    function getInstance() {
        return GM_getValue(KEY_INSTANCE, '');
    }

    function getToken() {
        return GM_getValue(KEY_TOKEN, '');
    }

    function setInstance() {
        const current = getInstance() || '';
        const input = prompt(
            'Enter your Misskey instance URL (required, e.g. https://misskey.io):',
            current
        );
        if (input !== null) {
            const trimmed = input.trim().replace(/\/$/, ''); // remove trailing slash
            if (trimmed) {
                GM_setValue(KEY_INSTANCE, trimmed);
                alert('[Misskey Remote Follow]\nInstance saved:\n' + trimmed);
            } else {
                alert('[Misskey Remote Follow]\nInstance not changed (empty).');
            }
        }
    }

    function setToken() {
        const current = getToken() || '';
        const input = prompt(
            'Enter your Misskey API token (required; stored locally in Tampermonkey):',
            current
        );
        if (input !== null) {
            const trimmed = input.trim();
            if (trimmed) {
                GM_setValue(KEY_TOKEN, trimmed);
                alert('[Misskey Remote Follow]\nAPI token saved.');
            } else {
                alert('[Misskey Remote Follow]\nToken not changed (empty).');
            }
        }
    }

    function ensureConfig() {
        const inst = (getInstance() || '').trim();
        const tok  = (getToken() || '').trim();

        if (!inst && !tok) {
            throw new Error(
                '[Misskey Remote Follow] Misskey instance and API token are not set.\n' +
                'Use Tampermonkey menu:\n' +
                '  - "Set Misskey instance"\n' +
                '  - "Set Misskey API token"'
            );
        }
        if (!inst) {
            throw new Error(
                '[Misskey Remote Follow] Misskey instance is not set.\n' +
                'Use Tampermonkey menu: "Set Misskey instance".'
            );
        }
        if (!tok) {
            throw new Error(
                '[Misskey Remote Follow] Misskey API token is not set.\n' +
                'Use Tampermonkey menu: "Set Misskey API token".'
            );
        }
        return true;
    }

    /******************************************************************
     * UTIL: Misskey API wrapper
     ******************************************************************/
    function misskeyApi(path, payload) {
        const HOME_INSTANCE = getInstance().trim();
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: HOME_INSTANCE.replace(/\/$/, '') + path,
                headers: { 'Content-Type': 'application/json' },
                data: JSON.stringify(payload),
                onload: (res) => {
                    if (res.status >= 200 && res.status < 300) {
                        try {
                            const json = JSON.parse(res.responseText);
                            resolve(json);
                        } catch (e) {
                            reject(new Error('Failed to parse JSON: ' + e.message));
                        }
                    } else {
                        reject(new Error('HTTP ' + res.status + ' ' + res.responseText));
                    }
                },
                onerror: (err) => {
                    reject(new Error('Network error: ' + JSON.stringify(err)));
                }
            });
        });
    }

    /******************************************************************
     * UTIL: Extract remote user from URL
     *
     * Format 1: https://${remote_host}/@${remote_username}
     *   - Example: https://remote.host/@user
     *   => host = remote.host (from URL), username = user
     *
     * Format 2: https://xxx.yyy/@${remote_username}@${remote_host}
     *   - Example: https://mastodon.example/@alice@social.controlnet.space
     *   => username = alice, host = social.controlnet.space
     ******************************************************************/
    function extractFromUrl(urlString) {
        let url;
        try {
            url = new URL(urlString);
        } catch (e) {
            return null;
        }

        const path = url.pathname;

        // Match /@something
        const m = path.match(/^\/@([^\/]+)$/);
        if (!m) {
            // OPTIONAL: /users/username support (delete if unwanted)
            const userMatch = path.match(/^\/users\/([^\/]+)$/);
            if (userMatch) {
                return {
                    host: url.hostname,
                    username: userMatch[1],
                    source: 'url-users'
                };
            }
            return null;
        }

        const handle = m[1]; // "user" OR "user@host"

        // If no inner '@', it's format 1: https://${remote_host}/@${remote_username}
        if (!handle.includes('@')) {
            return {
                host: url.hostname,
                username: handle,
                source: 'url-format1'
            };
        }

        // Format 2: strictly username first, host second
        // handle = "${remote_username}@${remote_host}"
        const parts = handle.split('@').filter(Boolean);
        if (parts.length < 2) {
            return null;
        }

        const username = parts[0];
        const host = parts.slice(1).join('@'); // mostly parts[1], but join for safety

        return {
            host,
            username,
            source: 'url-format2'
        };
    }

    function getRemoteUserInfo() {
        return extractFromUrl(location.href);
    }

    /******************************************************************
     * MAIN: remote follow
     ******************************************************************/
    async function remoteFollowCurrentUser() {
        try {
            ensureConfig();
        } catch (err) {
            alert(err.message);
            console.error(err);
            return;
        }

        const MISSKEY_TOKEN = getToken().trim();
        const info = getRemoteUserInfo();

        if (!info) {
            const errMsg =
                '[Misskey Remote Follow]\n' +
                'Could not detect a user from this page.\n\n' +
                'Supported URL formats:\n' +
                '  1) https://${remote_host}/@${remote_username}\n' +
                '  2) https://xxx.yyy/@${remote_username}@${remote_host}\n';
            alert(errMsg);
            console.error(new Error(errMsg));
            return;
        }

        const remoteHandle = `${info.username}@${info.host}`;
        console.log('[Misskey Remote Follow] Parsed remote user:', info);

        try {
            // 1) Resolve / ensure user exists on your instance
            const user = await misskeyApi('/api/users/show', {
                i: MISSKEY_TOKEN,
                username: info.username,
                host: info.host
            });

            if (!user || !user.id) {
                throw new Error('users/show did not return a user id');
            }

            // 2) Send follow
            const followRes = await misskeyApi('/api/following/create', {
                i: MISSKEY_TOKEN,
                userId: user.id
            });

            console.log('[Misskey Remote Follow] follow result:', followRes);
            alert(
                `[Misskey Remote Follow]\n` +
                `Sent follow request to ${remoteHandle}.`
            );
        } catch (err) {
            console.error('[Misskey Remote Follow] error:', err);
            alert(
                '[Misskey Remote Follow]\nFailed to follow ' +
                remoteHandle + ':\n' + err.message
            );
        }
    }

    /******************************************************************
     * Tampermonkey menu
     ******************************************************************/
    GM_registerMenuCommand('Remote follow on Misskey', remoteFollowCurrentUser);
    GM_registerMenuCommand('Set Misskey instance', setInstance);
    GM_registerMenuCommand('Set Misskey API token', setToken);
})();
