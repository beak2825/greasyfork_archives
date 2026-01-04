// ==UserScript==
// @name            Reddit - Restore subscribers counter
// @namespace       https://greasyfork.org/users/821661
// @version         1.0.6
// @description     restore subscribers counter on reddit
// @author          hdyzen
// @grant           GM_registerMenuCommand
// @grant           GM_xmlhttpRequest
// @match           https://www.reddit.com/*
// @match           https://old.reddit.com/*
// @icon            https://www.google.com/s2/favicons?domain=www.reddit.com/&sz=64
// @license         GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/550856/Reddit%20-%20Restore%20subscribers%20counter.user.js
// @updateURL https://update.greasyfork.org/scripts/550856/Reddit%20-%20Restore%20subscribers%20counter.meta.js
// ==/UserScript==

const formatState = localStorage.getItem("restore-counter-format") === "local";

GM_registerMenuCommand(`[${formatState ? "ON" : "OFF"}] Format counter to local language in old.reddit`, () => {
    const state = localStorage.getItem("restore-counter-format");
    if (state === "local") {
        localStorage.removeItem("restore-counter-format");
        reloadPage();
        return;
    }
    localStorage.setItem("restore-counter-format", "local");
    reloadPage();
});

GM_registerMenuCommand("Force separator for format number in old.reddit", () => {
    const separator = prompt("Enter your desired thousands separator (e.g., ',' or '.' or leave empty to use default):");

    if (separator !== null) localStorage.setItem("restore-counter-separator", separator);
    if (separator === "") localStorage.removeItem("restore-counter-separator");

    reloadPage();
});

function reloadPage() {
    window.location.reload();
}

function formatNumber(number) {
    const customSeparator = localStorage.getItem("restore-counter-separator");

    if (customSeparator !== null) {
        let newNumber = "";

        for (let i = number.length - 1; i >= 0; i--) {
            newNumber = number[i] + newNumber;
            if ((number.length - i) % 3 === 0 && i !== 0) {
                newNumber = customSeparator + newNumber;
            }
        }

        return newNumber;
    }

    if (formatState) {
        const lang = navigator.language || document.documentElement.lang || "en-US";
        return new Intl.NumberFormat(lang).format(number);
    }

    return number;
}

async function setCountersDesktop() {
    const isOldReddit = window.location.hostname.startsWith("old.");

    if (isOldReddit) {
        const subscribeButton = document.querySelector(".subscribe-button");
        const { subscribers, online } = await getCountNumbers();

        const html = `
            <span class="subscribers"><span class="number">${formatNumber(subscribers)}</span> <span class="word">readers</span></span>
            <p class="users-online"><span class="number">${formatNumber(online)}</span> <span class="word">users here now</span></p>    
        `;

        subscribeButton.insertAdjacentHTML("afterend", html);

        return;
    }

    const observer = new MutationObserver(() => {
        const node = document.querySelector("shreddit-subreddit-header:not([subscribers])");
        if (!node) return;

        const membersCount = document.querySelector("#subgrid-container div.xs\\:hidden > :nth-child(1) [number]")?.getAttribute("number");
        const onlineCount = document.querySelector("#subgrid-container div.xs\\:hidden > :nth-child(2) [number]")?.getAttribute("number");

        node.setAttribute("subscribers", membersCount);
        node.setAttribute("active", onlineCount);
        node.removeAttribute("activity-indicators-enabled");
    });

    observer.observe(document.body, { childList: true });
}

async function setCounterMobile() {
    const observer = new MutationObserver(async () => {
        const node = document.querySelector("#subgrid-container div.lowercase:not([processing])");
        if (!node) return;

        node.setAttribute("processing", "");

        node.outerHTML = await getCountersHTML();
    });

    observer.observe(document.body, { childList: true });
}

async function getCountersHTML() {
    return new Promise((resolve, reject) => {
        GM_xmlHttpRequest({
            url: window.location.href,
            responseType: "document",
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:143.0) Gecko/20100101 Firefox/143.0",
            },
            onload(event) {
                try {
                    const doc = event.response;
                    const counters = doc.querySelector("#subgrid-container div.xs\\:hidden");

                    if (counters) {
                        resolve(counters.outerHTML);
                    } else {
                        reject("Counters not found");
                    }
                } catch (err) {
                    reject(err);
                }
            },
            onerror(err) {
                reject(err);
            },
        });
    });
}

async function getCountNumbers() {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            url: window.location.href.replace("old.reddit.com", "www.reddit.com"),
            responseType: "document",
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:143.0) Gecko/20100101 Firefox/143.0",
            },
            onload(event) {
                try {
                    console.log("Load", event);

                    const doc = event.response;
                    const counters = doc.querySelectorAll("#subgrid-container div.xs\\:hidden faceplate-number");
                    const subscribers = counters[0].getAttribute("number");
                    const online = counters[1].getAttribute("number");

                    console.log("Counters", counters);
                    console.log(`Subscribers: ${subscribers}, Online: ${online}`);

                    if (counters) {
                        resolve({ subscribers, online });
                    } else {
                        reject("Counters not found");
                    }
                } catch (err) {
                    reject(err);
                }
            },
            onerror(err) {
                reject(err);
            },
        });
    });
}

const isMobile = GM_info?.platform?.mobile || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

if (isMobile) {
    setCounterMobile();
} else {
    setCountersDesktop();
}
