// ==UserScript==
// @name         Niantic profile - inline game badges
// @namespace    http://tampermonkey.net/
// @version      2025-10-31
// @description  Show game badges inline on Niantic profile friends list
// @author       Wiinuk
// @license MIT
// @match        https://my.nianticlabs.com/friends
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nianticlabs.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/554257/Niantic%20profile%20-%20inline%20game%20badges.user.js
// @updateURL https://update.greasyfork.org/scripts/554257/Niantic%20profile%20-%20inline%20game%20badges.meta.js
// ==/UserScript==
/// @ts-check
// spell-checker: ignore PIKMIN MHNOW Niantic Wiinuk

(function () {
    "use strict";

    /**
     * @param {string | (() => Element | null)} queryOrGetElement
     */
    async function waitElement(queryOrGetElement) {
        const getElement =
            typeof queryOrGetElement === "string"
                ? () => document.querySelector(queryOrGetElement)
                : queryOrGetElement;
        let currentIntervalMs = 100;
        const maxInterval = 1000;
        while (true) {
            const e = getElement();
            if (e != null) return e;
            await sleep(
                (currentIntervalMs = Math.min(
                    currentIntervalMs * 2,
                    maxInterval
                ))
            );
        }
    }
    /**
     * @param {number} milliseconds
     * @returns {Promise<void>}
     */
    async function sleep(milliseconds) {
        return new Promise((resolve) => setTimeout(resolve, milliseconds));
    }

    /**
     * @typedef {'FRIENDS' | 'EVERYONE'} GameVisibility
     */
    /**
     * @typedef {'PIKMIN' | 'PGO' | 'MHNOW'} GameName
     */
    /**
     * @typedef {object} GameProfile
     * @property {GameName} game
     * @property {string} codename
     * @property {GameVisibility} visibility
     */
    /**
     * @typedef {object} NianticFriend
     * @property {string} userId
     * @property {string} nianticId
     * @property {string} displayName
     * @property {string} avatarUrl
     * @property {GameProfile[]} gameProfiles
     */
    /**
     * @typedef {{ data: { myNianticFriends: NianticFriend[] } }} FriendsQueryResponse
     */

    /** @type {readonly NianticFriend[]} */
    let currentFriends = [];
    /** @type {MutationObserver | null} */
    let currentObserver = null;

    /**
     * @param {Element} ionItem
     */
    function getNianticId(ionItem) {
        const idSpan = ionItem.querySelector(
            "[class^=UIUserList_userInfo] span:nth-of-type(2)"
        );
        if (idSpan?.textContent.startsWith("@")) {
            return idSpan.textContent.slice(1);
        }
    }
    /**
     * @param {Element} ionItem
     */
    function getDisplayName(ionItem) {
        const nameSpan = ionItem.querySelector(
            "[class^=UIUserList_userInfo] span:first-of-type"
        );
        return nameSpan?.textContent || "";
    }
    /**
     * @param {Element} ionItem
     */
    function getFriend(ionItem) {
        const nianticId = getNianticId(ionItem);
        if (nianticId != null) {
            return currentFriends.find((e) => e.nianticId === nianticId);
        }
        const displayName = getDisplayName(ionItem);
        return currentFriends.find((e) => e.displayName === displayName);
    }
    /**
     * @param {Element} ionItem
     * @param {NianticFriend} friend
     */
    function appendGameNameBadges(ionItem, friend) {
        const container = ionItem.querySelector("[class^=UIUserList_userInfo]");
        if (!container) return;

        const gameBadges = friend.gameProfiles.map(
            (/** @type {{ game: string | null; }} */ profile) => {
                const badge = document.createElement("span");
                badge.className = "game-badge";
                badge.textContent = profile.game;
                return badge;
            }
        );

        container.append(...gameBadges);
    }
    /**
     * @param {Element} ionItem
     */
    function onIonItemAdded(ionItem) {
        const friend = getFriend(ionItem);
        if (friend == null) {
            console.error(`broken friend: ${ionItem.outerHTML}`);
            return;
        }
        appendGameNameBadges(ionItem, friend);
    }
    /**
     * @param {FriendsQueryResponse} body
     */
    async function onFriendsQueryResponseReceived(body) {
        const userListParent = await waitElement(
            "[class^=UIUserList_itemParent]"
        );

        currentFriends = body.data.myNianticFriends;
        currentObserver?.disconnect();
        currentObserver = new MutationObserver((mutations) => {
            for (const { oldValue, target } of mutations) {
                if (
                    oldValue === null &&
                    target instanceof Element &&
                    target.nodeName === "ion-item"
                ) {
                    onIonItemAdded(target);
                }
            }
        });
        currentObserver.observe(userListParent, {
            childList: true,
            subtree: true,
        });

        for (const item of document.querySelectorAll("ion-item")) {
            onIonItemAdded(item);
        }
    }

    function injectFriendsQuery() {
        const originalFetch = window.fetch;
        window.fetch = async function (...args) {
            console.log(...args);
            const response = await originalFetch(...args);
            console.log(response);
            try {
                const [input, options] = args;
                if (
                    input ===
                        "https://niantic-social-api.nianticlabs.com/niantic/graphql" &&
                    /^\s*query\s+FriendsQuery/.test(
                        JSON.parse(options?.body?.toString() ?? "").query
                    )
                ) {
                    const body = await response.clone().json();
                    setTimeout(
                        () =>
                            onFriendsQueryResponseReceived(body).catch((e) =>
                                console.error(e)
                            ),
                        100
                    );
                }
            } catch {}
            return response;
        };
    }
    injectFriendsQuery();
})();
