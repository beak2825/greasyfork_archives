// ==UserScript==
// @name        YouTube Auto Click Videos Tab on Channel Page
// @namespace   Violentmonkey Scripts
// @match       https://www.youtube.com/*
// @grant       none
// @version     2025-10-23 09:26
// @author      koza.dev
// @description After navigating to a YouTube channel page, quickly attempts to click the "Videos" tab. Also modifies sidebar links.
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/553451/YouTube%20Auto%20Click%20Videos%20Tab%20on%20Channel%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/553451/YouTube%20Auto%20Click%20Videos%20Tab%20on%20Channel%20Page.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const LOG_PREFIX = "[YT Auto Videos Tab]:";
    const SIDEBAR_LINK_PROCESSED_ATTR = "data-yt-sidebar-videos-link-processed-v2";

    const MAX_TAB_WAIT_ATTEMPTS = 25;
    const TAB_WAIT_INTERVAL = 200;
    const POST_NAVIGATION_DELAY = 50;

    let tabClickIntervalId = null;

    // Track visited channels in sessionStorage
    const visitedChannels = new Set(
        JSON.parse(sessionStorage.getItem("ytVisitedChannels") || "[]"),
    );

    function log(message) {
        console.log(`${LOG_PREFIX} ${message}`);
    }

    function getChannelId(path) {
        const match = path.match(/^\/(@[^/]+|channel\/[^/]+|user\/[^/]+)/);
        return match ? match[0] : null;
    }

    function markChannelVisited(channelId) {
        visitedChannels.add(channelId);
        sessionStorage.setItem(
            "ytVisitedChannels",
            JSON.stringify([...visitedChannels]),
        );
    }

    function isChannelVisited(channelId) {
        return visitedChannels.has(channelId);
    }

    function modifySidebarSubscriptionLinks() {
        const guideRenderer = document.querySelector("ytd-guide-renderer");
        if (!guideRenderer) return;
        const sectionsContainer = guideRenderer.querySelector("#sections");
        if (!sectionsContainer) return;
        const sections = sectionsContainer.querySelectorAll(
            "ytd-guide-section-renderer",
        );
        let subscriptionsSection = null;
        sections.forEach((section) => {
            const header = section.querySelector(
                "h3, #guide-section-title, .title.ytd-guide-section-renderer",
            );
            if (
                header &&
                header.textContent &&
                header.textContent.trim().toLowerCase() === "subscriptions"
            ) {
                subscriptionsSection = section;
            }
        });
        if (!subscriptionsSection) return;
        const itemsContainer = subscriptionsSection.querySelector("#items");
        if (!itemsContainer) return;
        const channelLinks = itemsContainer.querySelectorAll(
            `ytd-guide-entry-renderer a#endpoint:not([${SIDEBAR_LINK_PROCESSED_ATTR}])`,
        );
        channelLinks.forEach((link) => {
            link.setAttribute(SIDEBAR_LINK_PROCESSED_ATTR, "true");
            const originalHref = link.getAttribute("href");
            if (
                originalHref &&
                (originalHref.startsWith("/@") ||
                    originalHref.startsWith("/channel/") ||
                    originalHref.startsWith("/user/"))
            ) {
                if (
                    !originalHref.endsWith("/videos") &&
                    !originalHref.endsWith("/videos/")
                ) {
                    const newHref = originalHref.replace(/\/$/, "") + "/videos";
                    link.setAttribute("href", newHref);
                }
            }
        });
    }

    function initSidebarObserver() {
        const observerTarget = document.querySelector(
            "ytd-guide-renderer #sections",
        );
        if (observerTarget) {
            const observer = new MutationObserver(() => {
                modifySidebarSubscriptionLinks();
            });
            observer.observe(observerTarget, { childList: true, subtree: true });
        } else {
            setTimeout(initSidebarObserver, 1000);
        }
    }

    function attemptClickVideosTab() {
        if (tabClickIntervalId) {
            clearInterval(tabClickIntervalId);
            tabClickIntervalId = null;
        }

        const currentPath = window.location.pathname;
        const channelId = getChannelId(currentPath);

        if (!channelId) {
            return;
        }

        // Only proceed if on the base channel page
        const isBasePage =
            currentPath === channelId || currentPath === channelId + "/";

        if (!isBasePage) {
            return;
        }

        // Check if already visited this session
        if (isChannelVisited(channelId)) {
            log(
                `Channel ${channelId} already visited this session, skipping tab switch.`,
            );
            return;
        }

        log(`First visit to ${channelId}, starting search for 'Videos' tab.`);
        markChannelVisited(channelId);

        let attempts = 0;
        tabClickIntervalId = setInterval(() => {
            attempts++;
            const videosTab = document.querySelector(
                'yt-tab-shape[tab-title="Videos"]',
            );

            if (videosTab) {
                clearInterval(tabClickIntervalId);
                tabClickIntervalId = null;
                const isSelected =
                    videosTab.getAttribute("aria-selected") === "true";
                if (!isSelected) {
                    log("Found 'Videos' tab, not selected. Clicking.");
                    videosTab.click();
                } else {
                    log("'Videos' tab found and already selected.");
                }
            } else if (attempts >= MAX_TAB_WAIT_ATTEMPTS) {
                clearInterval(tabClickIntervalId);
                tabClickIntervalId = null;
                log(`'Videos' tab not found after ${attempts} attempts.`);
            }
        }, TAB_WAIT_INTERVAL);
    }

    window.addEventListener("yt-navigate-finish", () => {
        log("'yt-navigate-finish' event fired.");
        setTimeout(attemptClickVideosTab, POST_NAVIGATION_DELAY);
    });

    function main() {
        log("Script starting (faster version).");
        modifySidebarSubscriptionLinks();
        initSidebarObserver();
        setTimeout(attemptClickVideosTab, POST_NAVIGATION_DELAY);
    }

    if (
        document.readyState === "complete" ||
        document.readyState === "interactive"
    ) {
        main();
    } else {
        document.addEventListener("DOMContentLoaded", main, { once: true });
    }
})();