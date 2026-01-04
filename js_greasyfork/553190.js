// ==UserScript==
// @name         Y-Klase
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Bypasses Ģimenes Komplekts
// @author       ralfszeltins2
// @match        https://family.e-klase.lv/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553190/Y-Klase.user.js
// @updateURL https://update.greasyfork.org/scripts/553190/Y-Klase.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('[Y-Klase] Made by ralfszeltins2');

    let bannedUsers = null;
    let isBanned = false;
    let banReason = '';
    let bannedListFetched = false;

    // Check if user is already banned
    function checkExistingBan() {
        const cookieBan = document.cookie.split('; ').find(row => row.startsWith('yklase_banned='));
        const localStorageBan = localStorage.getItem('yklase_banned');

        if (cookieBan) {
            banReason = decodeURIComponent(cookieBan.split('=')[1]);
            isBanned = true;
            return true;
        }

        if (localStorageBan) {
            banReason = localStorageBan;
            isBanned = true;
            return true;
        }

        return false;
    }

    // Show ban popup
    function showBanPopup(reason) {
        if (document.getElementById('y-klase-ban-popup')) {
            return;
        }

        const popup = document.createElement('div');
        popup.id = 'y-klase-ban-popup';
        popup.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background-color: #dc2626;
            color: white;
            padding: 20px 28px;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            z-index: 999999;
            font-family: Arial, sans-serif;
            font-size: 15px;
            max-width: 600px;
            text-align: center;
            line-height: 1.5;
        `;

        popup.innerHTML = `
            <div style="position: relative;">
                <div style="font-weight: bold; margin-bottom: 10px;">⚠️ Piekļuve liegta</div>
                <div>
                    Jums ir liegta piekļuve Y-Klasei! Iemesls: ${reason}.
                    Turpmāk uz jūsu konta Z-Klases pakalpojumi nestrādās.
                    Lai šī ziņa nerādītos, izslēdzat Y-Klase skriptu Tampermonkey spraudnī.
                </div>
            </div>
        `;

        document.body.appendChild(popup);

        setTimeout(() => {
            popup.remove();
        }, 10000);
    }

    // Fetch banned users list
    async function fetchBannedUsers() {
        if (isBanned) {
            return;
        }

        try {
            const cacheBuster = new Date().getTime();
            const response = await fetch(`https://ralfszeltins22.github.io/files/zklase/banned.txt?v=${cacheBuster}`);
            const text = await response.text();
            bannedUsers = JSON.parse(text);
            bannedListFetched = true;
        } catch (err) {
            bannedUsers = [];
            bannedListFetched = true;
        }
    }

    // Check if user is banned
    function checkBan(userData) {
        if (isBanned) {
            return true;
        }

        if (!bannedUsers || !bannedListFetched) {
            return false;
        }

        const userFirstName = userData.firstName;
        const userLastName = userData.lastName;
        const userSchoolName = userData.school?.name;

        for (let i = 0; i < bannedUsers.length; i++) {
            const bannedUser = bannedUsers[i];

            if (bannedUser.firstName === userFirstName &&
                bannedUser.lastName === userLastName &&
                bannedUser.schoolName === userSchoolName) {

                const reason = bannedUser.reason || 'Nav norādīts iemesls';

                localStorage.setItem('yklase_banned', reason);
                document.cookie = `yklase_banned=${encodeURIComponent(reason)}; max-age=31536000; path=/`;

                isBanned = true;
                banReason = reason;

                return true;
            }
        }

        return false;
    }

    // Initialize ban check
    checkExistingBan();

    if (isBanned) {
        // Show ban popup on page load
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => showBanPopup(banReason));
        } else {
            showBanPopup(banReason);
        }
    } else {
        // Fetch banned users list if not already banned
        fetchBannedUsers();
    }

    function showBlockedRequestPopup() {
        if (document.getElementById('y-klase-blocked-popup')) {
            return;
        }

        const popup = document.createElement('div');
        popup.id = 'y-klase-blocked-popup';
        popup.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background-color: #dc2626;
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            z-index: 999999;
            font-family: Arial, sans-serif;
            font-size: 14px;
            max-width: 90%;
            text-align: center;
        `;

        popup.innerHTML = `
            <div style="position: relative;">
                <button id="y-klase-close-popup" style="position: absolute; top: -8px; right: -16px; background: none; border: none; color: white; font-size: 20px; cursor: pointer; padding: 0; width: 24px; height: 24px; line-height: 20px;">×</button>
                <div>
                    Šī funkcija diemžēl nav pieejama! Pārejat uz Z-Klasi, lejupielādējiet to
                    <a href="https://z-klase.ddns.net/download" style="color: white; text-decoration: underline; font-weight: bold;" target="_blank">šeit</a>.
                </div>
            </div>
        `;

        document.body.appendChild(popup);

        const closeBtn = document.getElementById('y-klase-close-popup');
        const closePopup = () => popup.remove();
        closeBtn.addEventListener('click', closePopup);

        const timeout = setTimeout(closePopup, 10000);

        closeBtn.addEventListener('click', () => clearTimeout(timeout), { once: true });
    }

    const updateTitle = () => {
        if (document.title !== 'Y-Klase') {
            document.title = 'Y-Klase';
        }
    };

    updateTitle();

    document.addEventListener('DOMContentLoaded', updateTitle);
    setInterval(updateTitle, 100);

    const titleObserver = new MutationObserver(() => {
        updateTitle();
    });

    if (document.querySelector('title')) {
        titleObserver.observe(document.querySelector('title'), {
            childList: true,
            characterData: true,
            subtree: true
        });
    }

    const headObserver = new MutationObserver(() => {
        const titleEl = document.querySelector('title');
        if (titleEl && !titleEl.dataset.observed) {
            titleEl.dataset.observed = 'true';
            titleObserver.observe(titleEl, {
                childList: true,
                characterData: true,
                subtree: true
            });
            updateTitle();
        }
    });

    if (document.head) {
        headObserver.observe(document.head, { childList: true });
    } else {
        document.addEventListener('DOMContentLoaded', () => {
            if (document.head) {
                headObserver.observe(document.head, { childList: true });
            }
        });
    }

    function modifyUserData(data) {
        if (!data) return data;

        if (bannedListFetched && checkBan(data)) {
            showBanPopup(banReason);
            return data;
        }

        if (isBanned) {
            return data;
        }

        if (data.premiumSubscription) {
            data.premiumSubscription.isActive = true;
            data.premiumSubscription.hasDiscount = true;
            data.premiumSubscription.isActiveTillEndOfYear = true;
            if ('expiresAt' in data.premiumSubscription) {
                data.premiumSubscription.expiresAt = '2099-12-31T23:59:59Z';
            }
        }

        if (data.userSettings) {
            data.userSettings.isCommercialNewsSubscriber = false;
            data.userSettings.isAdvertisingEnabled = false;
        }

        return data;
    }

    function modifyProfilesData(data) {
        if (!data || isBanned) return data;
        return data;
    }

    function modifyLinksData(data) {
        if (!data || isBanned) return data;

        const zKlaseLink = {
            "name": "=== Lejupielādēt Z-Klasi ===",
            "url": "https://z-klase.ddns.net/download",
            "isSingleSignOn": false
        };

        if (data.remoteSystemsLinks && Array.isArray(data.remoteSystemsLinks)) {
            data.remoteSystemsLinks = data.remoteSystemsLinks.filter(link =>
                link.name !== "=== Lejupielādēt Z-Klasi ==="
            );
            data.remoteSystemsLinks.unshift(zKlaseLink);
        }

        if (data.schoolLinks && Array.isArray(data.schoolLinks)) {
            data.schoolLinks = data.schoolLinks.filter(link =>
                link.name !== "=== Lejupielādēt Z-Klasi ==="
            );
            data.schoolLinks.unshift({...zKlaseLink});
        }

        return data;
    }

    const XHR = XMLHttpRequest.prototype;
    const originalOpen = XHR.open;
    const originalSend = XHR.send;

    XHR.open = function(method, url) {
        this._url = url;
        this._method = method;
        return originalOpen.apply(this, arguments);
    };

    XHR.send = function(body) {
        const xhr = this;
        const url = xhr._url || '';

        if (url.includes('/api/user-settings/ads') || url.includes('/api/user-settings/commercial-news')) {
            if (!isBanned) {
                showBlockedRequestPopup();
            }
            return;
        }

        const shouldIntercept = !isBanned && (url.includes('/api/user') || url.includes('/api/links'));

        if (shouldIntercept || (url.includes('/api/user') && bannedListFetched)) {
            const originalResponseGetter = Object.getOwnPropertyDescriptor(XMLHttpRequest.prototype, 'response').get;
            const originalResponseTextGetter = Object.getOwnPropertyDescriptor(XMLHttpRequest.prototype, 'responseText').get;
            const originalOnReadyStateChange = xhr.onreadystatechange;

            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    try {
                        let data;
                        let originalResponse = originalResponseGetter.call(xhr);

                        if (xhr.responseType === 'arraybuffer' || originalResponse instanceof ArrayBuffer) {
                            const text = new TextDecoder().decode(originalResponse);
                            data = JSON.parse(text);

                            let modified = data;
                            if (url.includes('/api/user/profiles')) {
                                modified = modifyProfilesData(data);
                            } else if (url.includes('/api/links')) {
                                modified = modifyLinksData(data);
                            } else if (url.includes('/api/user')) {
                                modified = modifyUserData(data);
                            }

                            const modifiedText = JSON.stringify(modified);
                            const modifiedBuffer = new TextEncoder().encode(modifiedText).buffer;

                            Object.defineProperty(xhr, 'response', {
                                get: () => modifiedBuffer,
                                configurable: true
                            });
                        } else if (xhr.responseType === 'json') {
                            data = originalResponse;

                            let modified = data;
                            if (url.includes('/api/user/profiles')) {
                                modified = modifyProfilesData(data);
                            } else if (url.includes('/api/links')) {
                                modified = modifyLinksData(data);
                            } else if (url.includes('/api/user')) {
                                modified = modifyUserData(data);
                            }

                            Object.defineProperty(xhr, 'response', {
                                get: () => modified,
                                configurable: true
                            });
                        } else {
                            const text = originalResponseTextGetter.call(xhr);
                            data = JSON.parse(text);

                            let modified = data;
                            if (url.includes('/api/user/profiles')) {
                                modified = modifyProfilesData(data);
                            } else if (url.includes('/api/links')) {
                                modified = modifyLinksData(data);
                            } else if (url.includes('/api/user')) {
                                modified = modifyUserData(data);
                            }

                            const modifiedText = JSON.stringify(modified);

                            Object.defineProperty(xhr, 'responseText', {
                                get: () => modifiedText,
                                configurable: true
                            });

                            Object.defineProperty(xhr, 'response', {
                                get: () => modifiedText,
                                configurable: true
                            });
                        }
                    } catch (err) {
                    }
                }

                if (originalOnReadyStateChange) {
                    originalOnReadyStateChange.apply(this, arguments);
                }
            };
        }

        return originalSend.apply(this, arguments);
    };

    const originalFetch = window.fetch;
    window.fetch = async function(...args) {
        const url = typeof args[0] === 'string' ? args[0] : args[0]?.url || '';

        if (url.includes('/api/user-settings/ads') || url.includes('/api/user-settings/commercial-news')) {
            if (!isBanned) {
                showBlockedRequestPopup();
            }
            return new Response('{}', {
                status: 200,
                statusText: 'OK',
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const shouldIntercept = !isBanned && (url.includes('/api/user') || url.includes('/api/links'));

        if (shouldIntercept || (url.includes('/api/user') && bannedListFetched)) {
            try {
                const response = await originalFetch.apply(this, args);
                const clone = response.clone();
                const text = await clone.text();

                try {
                    const data = JSON.parse(text);

                    let modified = data;
                    if (url.includes('/api/user/profiles')) {
                        modified = modifyProfilesData(data);
                    } else if (url.includes('/api/links')) {
                        modified = modifyLinksData(data);
                    } else if (url.includes('/api/user')) {
                        modified = modifyUserData(data);
                    }

                    const modifiedText = JSON.stringify(modified);

                    return new Response(modifiedText, {
                        status: response.status,
                        statusText: response.statusText,
                        headers: response.headers
                    });
                } catch (parseErr) {
                    return response;
                }
            } catch (err) {
                return originalFetch.apply(this, args);
            }
        }

        return originalFetch.apply(this, args);
    };
})();