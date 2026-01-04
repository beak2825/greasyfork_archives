// ==UserScript==
// @name         Work.ink bypass - Opera Compatible
// @namespace    http://tampermonkey.net/
// @version      1000001
// @description  Original owner dont update i updated
// @author       Levi
// @match        *://*.work.ink/*
// @match        https://workink.click/*
// @match        *://*/direct/?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/555420/Workink%20bypass%20-%20Opera%20Compatible.user.js
// @updateURL https://update.greasyfork.org/scripts/555420/Workink%20bypass%20-%20Opera%20Compatible.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Part 1: Ad & Popup Hiding ---
    const filters = `
        /* Blocks BSA ad zones by targeting the start of their dynamic ID */
        [id^="bsa-zone_"],

        /* Blocks the main popup/modal overlay */
        div.fixed.inset-0.bg-black\\/50.backdrop-blur-sm,

        /* Hides the "Done" banner that may appear */
        div.done-banner-container.svelte-1yjmk1g,

        /* Blocks inserted ad elements (often used by ad networks) */
        ins:nth-of-type(1),

        /* A fragile rule from your list. May break or hide the wrong thing. */
        div:nth-of-type(9),

        /* Hides a main content container or panel */
        div.fixed.top-16.left-0.right-0.bottom-0.bg-white.z-40.overflow-y-auto,

        /* A broad rule from your list. May hide legitimate text. */
        p[style] {
            display: none !important;
        }
    `;

    function addStyles(css) {
        const style = document.createElement('style');
        style.textContent = css;
        (document.head || document.documentElement).appendChild(style);
    }
    addStyles(filters);

    // --- Part 2: WebSocket Patch for Extension/App Bypass (Works on Opera and others) ---
    (async () => {
        if (window.location.hostname.includes("r.")) window.location.hostname = window.location.hostname.replace("r.", "");
        if (window.location.hostname === "work.ink") {
            const [encodedUserId, linkCustom] = decodeURIComponent(window.location.pathname.slice(1)).split("/").slice(-2);
            const BASE = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
            const loopTimes = encodedUserId.length;
            let decodedUserId = BASE.indexOf(encodedUserId[0]);
            for (let i = 1; i < loopTimes; i++) decodedUserId = 62 * decodedUserId + BASE.indexOf(encodedUserId[i]);

            const payloads = {
                social: (url) => JSON.stringify({
                    type: "c_social_started",
                    payload: {
                        url
                    }
                }),
                readArticles: {
                    1: JSON.stringify({
                        type: "c_monetization",
                        payload: {
                            type: "readArticles",
                            payload: {
                                event: "start"
                            }
                        }
                    }),
                    2: JSON.stringify({
                        type: "c_monetization",
                        payload: {
                            type: "readArticles",
                            payload: {
                                event: "closeClicked"
                            }
                        }
                    })
                },
                browserExtension: {
                    1: JSON.stringify({
                        type: "c_monetization",
                        payload: {
                            type: "browserExtension",
                            payload: {
                                event: "start"
                            }
                        }
                    }),
                    2: (token) => JSON.stringify({
                        type: "c_monetization",
                        payload: {
                            type: "browserExtension",
                            payload: {
                                event: "confirm",
                                token
                            }
                        }
                    })
                },
                captcha: JSON.stringify({
                    type: "c_recaptcha",
                    payload: {
                        token: "patched_bypass"
                    }
                })
            };

            WebSocket.prototype.oldSendImpl = WebSocket.prototype.send;
            WebSocket.prototype.send = function (data) {
                this.oldSendImpl(data);
                this.addEventListener("message", async (e) => {
                    const sleep = ms => new Promise(r => setTimeout(r, ms));
                    const data = JSON.parse(e.data);
                    if (data.error) return;
                    const payload = data.payload;

                    switch (data.type) {
                        case "s_link_info":
                            // got link info
                            if (payload.socials) socials.push(...payload.socials);
                            const monetizationTypes = ["readArticles", "browserExtension"];
                            for (const type of monetizationTypes) {
                                if (payload.monetizationScript.includes(type)) {
                                    activeMonetizationTypes.push(type);
                                }
                            }
                            break;
                        case "s_start_recaptcha_check":
                            this.oldSendImpl(payloads.captcha);
                            break;
                        case "s_recaptcha_okay":
                            if (socials.length) {
                                for (const [index, social] of socials.entries()) {
                                    // performing social #${index+1}
                                    this.oldSendImpl(payloads.social(social.url));
                                    await sleep(3 * 1000);
                                }
                            }

                            if (activeMonetizationTypes.length) {
                                for (const type of activeMonetizationTypes) {
                                    switch (type) {
                                        case "readArticles":
                                            // reading articles...
                                            this.oldSendImpl(payloads.readArticles["1"]);
                                            this.oldSendImpl(payloads.readArticles["2"]);
                                            break;
                                        case "browserExtension":
                                            // skipping browser extension step (includes fake Opera installer)
                                            if (activeMonetizationTypes.includes("readArticles")) await sleep(11 * 1000);
                                            this.oldSendImpl(payloads.browserExtension["1"]);
                                            break;
                                    }
                                }
                            }
                            break;
                        case "s_monetization":
                            if (payload.type !== "browserExtension") break;
                            this.oldSendImpl(payloads.browserExtension["2"](payload.payload.token));
                            break;
                        case "s_link_destination":
                            // done!
                            const url = new URL(payload.url);
                            localStorage.clear(window.location.href);
                            if (url.searchParams.has("duf")) {
                                window.location.href = window.atob(url.searchParams.get("duf").split("").reverse().join(""));
                            } else {
                                window.location.href = payload.url;
                            }
                            break;
                    }
                }, { once: true }); // Use once to avoid multiple listeners
            };
            // patched websocket
            let socials = [];
            let activeMonetizationTypes = [];
        } else if (window.location.hostname == "workink.click") {
            const uuid = new URLSearchParams(window.location.search).get("t");
            fetch(`https://redirect-api.work.ink/externalPopups/${uuid}/pageOpened`);
            await new Promise(r => setTimeout(r, 11 * 1000));
            const { destination } = await fetch(`https://redirect-api.work.ink/externalPopups/${uuid}/destination`).then(r => r.json());
            const url = new URL(destination);
            if (url.searchParams.has("duf")) {
                window.location.href = window.atob(url.searchParams.get("duf").split("").reverse().join(""));
            } else {
                window.location.href = destination;
            }
            // wait 11 seconds
        } else {
            if (new URL(window.location.href).searchParams.has("duf")) {
                var link = document.createElement("a");
                link.referrerPolicy = "no-referrer";
                link.rel = "noreferrer";
                link.href = window.atob(new URL(window.location.href).searchParams.get("duf").split("").reverse().join(""));
                link.click();
            }
        }
    })();

    // --- Part 3: Automatic Button Clicker (Focus Aware) ---
    const clickIntervalTime = 250; // Clicks every 250 milliseconds (4 times a second)
    let clickerInterval = null;

    function startClicking() {
        // Ensure we don't start multiple intervals
        if (clickerInterval === null) {
            clickerInterval = setInterval(() => {
                const buttons = document.querySelectorAll('.button.large.accessBtn');
                buttons.forEach(button => {
                    if (button) {
                        button.click();
                    }
                });
            }, clickIntervalTime);
        }
    }

    function stopClicking() {
        clearInterval(clickerInterval);
        clickerInterval = null;
    }

    // Listen for visibility changes
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            // Tab became hidden - stop clicking
            stopClicking();
        } else {
            // Tab became visible - start clicking
            startClicking();
        }
    });

    // Initial check: if the page is loaded and already visible, start clicking
    if (!document.hidden) {
        startClicking();
    }
})();