// ==UserScript==
// @name         Poki Better Fullscreen
// @namespace    https://poki.com/
// @version      1.0
// @description  Adds a smart fullscreen button and hides navbar.
// @match        https://poki.com/*
// @run-at       document-idle
// @grant        none
// @noframes
// @license      MIT
// @author       giovane2230
// @downloadURL https://update.greasyfork.org/scripts/551000/Poki%20Better%20Fullscreen.user.js
// @updateURL https://update.greasyfork.org/scripts/551000/Poki%20Better%20Fullscreen.meta.js
// ==/UserScript==

(() => {
    "use strict";

    // ========================
    // UTILITY FUNCTIONS
    // ========================

    // Shortcut for requestAnimationFrame
    const raf = (fn) => requestAnimationFrame(fn);

    // Add an event listener that triggers only once
    const once = (el, type, fn) => el.addEventListener(type, fn, { once: true });

    // ========================
    // SPA URL CHANGE DETECTION
    // ========================

    // Detect URL changes in Single Page Applications (SPA)
    const initUrlChangeHook = () => {
        const originalPush = history.pushState;
        const originalReplace = history.replaceState;
        const triggerEvent = () => window.dispatchEvent(new Event("poki-urlchange"));

        history.pushState = function () {
            originalPush.apply(this, arguments);
            triggerEvent();
        };

        history.replaceState = function () {
            originalReplace.apply(this, arguments);
            triggerEvent();
        };

        window.addEventListener("popstate", triggerEvent);
    };

    // ========================
    // FULLSCREEN BUTTON
    // ========================

    // Find Poki's "report bug" button for reference
    const findReportButton = () => {
        const useEl = document.querySelector(
            "button use[href='#reportIcon'], button use[xlink\\:href='#reportIcon']"
        );
        return useEl ? useEl.closest("button") : null;
    };

    // Check if a fullscreen button already exists
    const fullscreenButtonExists = () =>
        !!document.querySelector(
            "#fullscreen-button, button[aria-label*='ullscreen'], button[aria-label*='inimize']"
        );

    // Create a fullscreen button with native Poki styling
    const createFullscreenButton = () => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.id = "fullscreen-button";
        btn.className =
            "HPn_GzeLxs8_4nNebuj1 mDTrvHhilj2xlIvo_kXA phlaiC_iad_lookW5__d";
        btn.setAttribute("aria-label", "Fullscreen");
        btn.title = "Toggle Fullscreen";

        // Icon container
        const iconDiv = document.createElement("div");
        iconDiv.className = "tqh57qBcKxMV9EdZQoAb";
        iconDiv.innerHTML = `
            <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" class="AUcJqk5uLaoXL0jqRGuH">
                <use xlink:href="#enterFullscreenIcon" href="#enterFullscreenIcon"></use>
            </svg>
        `;
        btn.append(iconDiv);

        // Text container
        const textDiv = document.createElement("div");
        textDiv.className = "aAJE6r6D5rwwQuTmZqYG";

        const emptySpan = document.createElement("span");
        emptySpan.className = "L6WSODmebiIqJJOEi46E Vlw13G6cUIC6W9LiGC_X";
        textDiv.append(emptySpan);

        const label = document.createElement("span");
        label.className = "L6WSODmebiIqJJOEi46E tz2DEu5qBC9Yd6hJGjoW";
        label.textContent = "Fullscreen";
        textDiv.append(label);

        btn.append(textDiv);

        // Toggle fullscreen on click
        btn.addEventListener("click", () => {
            const elem = document.documentElement;

            if (!document.fullscreenElement) {
                // Request fullscreen
                (elem.requestFullscreen ||
                    elem.webkitRequestFullscreen ||
                    elem.msRequestFullscreen)?.call(elem);
            } else {
                // Exit fullscreen
                (document.exitFullscreen ||
                    document.webkitExitFullscreen ||
                    document.msExitFullscreen)?.call(document);
            }
        });

        return btn;
    };

    // Insert a new node after a reference node
    const insertAfter = (newNode, referenceNode) => {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    };

    // ========================
    // GAME MAXIMIZATION
    // ========================

    // Hide navbar and other navigation elements only in fullscreen
    const hideNavbarInFullscreen = () => {
        if (!document.fullscreenElement) return;

        const selectors = [
            'nav#nav.qoMYGbBhf9dsbaBGBphh.DJT17TB5hYo14sdLEAwk',
            '.J91n1ymJasoch_FZq89b',
            'nav',
            '[role="navigation"]',
            '.navbar',
            '.navigation',
            '.nav',
            'header nav',
        ];

        selectors.forEach((selector) => {
            try {
                const elements = document.querySelectorAll(selector);
                elements.forEach((el) => {
                    if (!el.hasAttribute("data-hidden-in-fullscreen")) {
                        el.style.cssText =
                            "display: none !important; visibility: hidden !important;";
                        el.setAttribute("data-hidden-in-fullscreen", "true");
                    }
                });
            } catch (e) {
                // Ignore invalid selectors
            }
        });

        // Remove Poki-specific nav completely
        const pokiNav = document.querySelector(
            'nav#nav.qoMYGbBhf9dsbaBGBphh.DJT17TB5hYo14sdLEAwk'
        );
        if (pokiNav && !pokiNav.hasAttribute("data-removed-in-fullscreen")) {
            pokiNav.remove();
            pokiNav.setAttribute("data-removed-in-fullscreen", "true");
        }
    };

    // Restore navbar when leaving fullscreen
    const restoreNavbarFromFullscreen = () => {
        if (document.fullscreenElement) return;

        const hiddenElements = document.querySelectorAll("[data-hidden-in-fullscreen]");
        hiddenElements.forEach((el) => {
            el.style.cssText = "";
            el.removeAttribute("data-hidden-in-fullscreen");
        });
    };

    // ========================
    // FULLSCREEN BUTTON MANAGEMENT
    // ========================

    let localObserver = null;

    // Ensure a fullscreen button exists and is functional
    const ensureFullscreenButton = () => {
        if (fullscreenButtonExists()) return;

        const reportBtn = findReportButton();
        if (!reportBtn) return;

        const btn = createFullscreenButton();
        insertAfter(btn, reportBtn);

        // Observer to keep the button alive if DOM changes
        if (localObserver) localObserver.disconnect();
        localObserver = new MutationObserver(() => {
            if (!fullscreenButtonExists()) {
                localObserver.disconnect();
                Promise.resolve().then(() => raf(ensureFullscreenButton));
            }
        });

        const scope = reportBtn.parentElement || reportBtn;
        localObserver.observe(scope, { childList: true });

        // Remove our button if Poki adds a native fullscreen button
        const removeIfNativeAppears = () => {
            if (
                fullscreenButtonExists() &&
                btn.isConnected &&
                btn !== document.querySelector("#fullscreen-button")
            ) {
                btn.remove();
                localObserver?.disconnect();
            }
        };
        once(document, "fullscreenchange", removeIfNativeAppears);
    };

    // ========================
    // INITIALIZATION
    // ========================

    initUrlChangeHook();

    // Ensure button after DOM is ready
    document.addEventListener("readystatechange", () => raf(ensureFullscreenButton));

    // Handle fullscreen changes
    document.addEventListener(
        "fullscreenchange",
        () => {
            if (document.fullscreenElement) {
                setTimeout(() => hideNavbarInFullscreen(), 100);
            } else {
                setTimeout(() => restoreNavbarFromFullscreen(), 100);
            }
            raf(ensureFullscreenButton);
        },
        { passive: true }
    );

    // Handle SPA route changes
    window.addEventListener(
        "poki-urlchange",
        () => {
            setTimeout(() => raf(ensureFullscreenButton), 100);
        },
        { passive: true }
    );

    // Safety interval to maintain fullscreen button and hide navbar
    setInterval(() => {
        if (!fullscreenButtonExists()) ensureFullscreenButton();
        if (document.fullscreenElement) hideNavbarInFullscreen();
    }, 2000);

    raf(ensureFullscreenButton);

    // ========================
    // ADDITIONAL STYLES
    // ========================

    const style = document.createElement("style");
    style.textContent = `
html:fullscreen, html:-webkit-full-screen, html:-moz-full-screen { overflow:hidden !important; }
html:fullscreen body, html:-webkit-full-screen body, html:-moz-full-screen body { margin:0 !important; padding:0 !important; overflow:hidden !important; }
#fullscreen-button:hover { opacity:0.8 !important; transform:scale(1.05) !important; transition:all 0.2s ease !important; }
#game-player[data-enhanced] { box-sizing: border-box !important; }
html:fullscreen nav, html:-webkit-full-screen nav, html:-moz-full-screen nav,
html:fullscreen [role="navigation"], html:-webkit-full-screen [role="navigation"], html:-moz-full-screen [role="navigation"],
html:fullscreen .navbar, html:-webkit-full-screen .navbar, html:-moz-full-screen .navbar { display:none !important; visibility:hidden !important; }
html:fullscreen [class*="qoMYGbBhf9dsbaBGBphh"], html:-webkit-full-screen [class*="qoMYGbBhf9dsbaBGBphh"], html:-moz-full-screen [class*="qoMYGbBhf9dsbaBGBphh"],
html:fullscreen [class*="DJT17TB5hYo14sdLEAwk"], html:-webkit-full-screen [class*="DJT17TB5hYo14sdLEAwk"], html:-moz-full-screen [class*="DJT17TB5hYo14sdLEAwk"] { display:none !important; visibility:hidden !important; }
`;
    document.head.appendChild(style);

    console.log(
        "betterfullscreen loaded"
    );
})();
