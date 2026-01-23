// ==UserScript==
// @name        Element - Hide Activity-Only Notifications
// @namespace   https://github.com/Enzime
// @match       https://app.element.io/*
// @grant       none
// @version     1.0
// @author      Enzime
// @description Only show unread indicators for "Mentions and keywords" rooms when mentioned
// @license     MIT
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/563644/Element%20-%20Hide%20Activity-Only%20Notifications.user.js
// @updateURL https://update.greasyfork.org/scripts/563644/Element%20-%20Hide%20Activity-Only%20Notifications.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // Room notification indicators in Element:
    // - _unread_* (dot only): Activity level, no notification - HIDE
    // - _unread-counter_*: Has count badge (DMs, regular messages) - KEEP
    // - SVG @ icon + counter: Mentions/highlights - KEEP

    // === CSS: Hide only the dot indicator, keep counter badges ===
    function injectStyles() {
        var style = document.createElement("style");
        style.id = "element-suppress-unread";
        style.textContent = [
            "/* Hide unread dot indicators (Activity level) */",
            "/* Match _unread_ but NOT _unread-counter_ */",
            ".mx_RoomListItemView [class^='_unread_']:not([class*='counter']),",
            ".mx_RoomListItemView [class*=' _unread_']:not([class*='counter']),",
            ".mx_RoomTile [class^='_unread_']:not([class*='counter']),",
            ".mx_RoomTile [class*=' _unread_']:not([class*='counter']),",
            ".mx_NotificationBadge_dot {",
            "    display: none !important;",
            "}",
        ].join("\n");

        if (document.head) {
            document.head.appendChild(style);
        } else {
            document.addEventListener("DOMContentLoaded", function () {
                document.head.appendChild(style);
            });
        }
    }

    // === MutationObserver: Remove bold class from room tiles ===
    function setupRoomTileObserver() {
        var observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                if (mutation.type === "attributes" && mutation.attributeName === "class") {
                    var target = mutation.target;
                    if (target.classList && target.classList.contains("mx_RoomListItemView_bold")) {
                        checkAndRemoveBold(target);
                    }
                }

                if (mutation.type === "childList") {
                    mutation.addedNodes.forEach(function (node) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            processElement(node);
                        }
                    });
                }
            });
        });

        function hasCounterOrMention(roomTile) {
            // Use aria-label which reliably indicates unread status
            // e.g. "with 1 unread message." or "with 1 unread mention."
            var ariaLabel = roomTile.getAttribute("aria-label") || "";
            if (ariaLabel.includes("unread message") || ariaLabel.includes("unread mention")) {
                return true;
            }

            // Fallback: Check for counter badge (_unread-counter_*)
            var hasCounter = roomTile.querySelector("[class*='_unread-counter']");
            if (hasCounter) return true;

            // Check for old-style badges
            var hasOldBadge = roomTile.querySelector(
                ".mx_NotificationBadge_level_notification, .mx_NotificationBadge_level_highlight"
            );
            if (hasOldBadge) return true;

            return false;
        }

        function checkAndRemoveBold(target) {
            var roomTile = target.closest(".mx_RoomListItemView, .mx_RoomTile");
            if (!roomTile) {
                roomTile = target;
            }
            // Only remove bold if there's no counter badge (just a dot or nothing)
            if (!hasCounterOrMention(roomTile)) {
                target.classList.remove("mx_RoomListItemView_bold");
            }
        }

        function processElement(element) {
            var boldTiles = [];
            if (element.querySelectorAll) {
                boldTiles = Array.from(element.querySelectorAll(".mx_RoomListItemView_bold"));
            }
            if (element.classList && element.classList.contains("mx_RoomListItemView_bold")) {
                boldTiles.push(element);
            }

            boldTiles.forEach(function (tile) {
                checkAndRemoveBold(tile);
            });
        }

        function startObserving() {
            var container = document.querySelector("[class*='LeftPanel'], .mx_LeftPanel, #matrixchat");
            if (container) {
                observer.observe(container, {
                    childList: true,
                    subtree: true,
                    attributes: true,
                    attributeFilter: ["class"]
                });
                processElement(container);
            } else {
                setTimeout(startObserving, 500);
            }
        }

        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", startObserving);
        } else {
            startObserving();
        }
    }

    // === Title Observer: Remove asterisk from page title ===
    function setupTitleObserver() {
        function cleanTitle() {
            var title = document.title;
            if (title.includes("*")) {
                // Format: "Element * | room name" -> "Element | room name"
                var cleaned = title.replace(" * ", " ");
                if (cleaned !== title) {
                    document.title = cleaned;
                }
            }
        }

        var titleObserver = new MutationObserver(function (mutations) {
            cleanTitle();
        });

        function startTitleObserver() {
            cleanTitle();
            var head = document.head || document.querySelector("head");
            if (head) {
                titleObserver.observe(head, {
                    childList: true,
                    subtree: true,
                    characterData: true
                });
            }
            var titleEl = document.querySelector("title");
            if (titleEl) {
                titleObserver.observe(titleEl, {
                    childList: true,
                    characterData: true,
                    subtree: true
                });
            }
        }

        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", startTitleObserver);
        } else {
            startTitleObserver();
        }
    }

    // === Space notification suppression ===
    function injectSpaceStyles() {
        var style = document.createElement("style");
        style.id = "element-suppress-space-unread";
        style.textContent = [
            "/* Hide unread dots on spaces (not counters) */",
            ".mx_SpaceButton [class^='_unread_']:not([class*='counter']),",
            ".mx_SpaceButton [class*=' _unread_']:not([class*='counter']),",
            ".mx_SpacePanel [class^='_unread_']:not([class*='counter']),",
            ".mx_SpacePanel [class*=' _unread_']:not([class*='counter']),",
            ".mx_SpaceButton .mx_NotificationBadge_dot,",
            ".mx_SpacePanel .mx_NotificationBadge_dot {",
            "    display: none !important;",
            "}"
        ].join("\n");

        if (document.head) {
            document.head.appendChild(style);
        } else {
            document.addEventListener("DOMContentLoaded", function () {
                document.head.appendChild(style);
            });
        }
    }

    injectStyles();
    injectSpaceStyles();
    setupRoomTileObserver();
    setupTitleObserver();
})();