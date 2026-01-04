// ==UserScript==
// @name         Revive filters
// @namespace    dev.chib.torn.hospital-filters
// @version      1.1.7
// @description  Adds a simple revive filter to the hospital page + 1⇆2 page button
// @author       Chib
// @match        https://www.torn.com/hospitalview.php*
// @run-at       document-end
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551080/Revive%20filters.user.js
// @updateURL https://update.greasyfork.org/scripts/551080/Revive%20filters.meta.js
// ==/UserScript==

/* global $ */

(async () => {
    watchUrlChanges(() => {
        rebuildFilters();
        addHospitalDOMObserver();
    });

    addStyles();
    rebuildFilters();

    function watchUrlChanges(callback) {
        let lastUrl = location.href;

        const observer = new MutationObserver(() => {
            if (location.href !== lastUrl) {
                lastUrl = location.href;
                if (location.pathname === '/hospitalview.php') {
                    callback();
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        setInterval(() => {
            if (location.href !== lastUrl) {
                lastUrl = location.href;
                if (location.pathname === '/hospitalview.php') {
                    callback();
                }
            }
        }, 500);
    }

    function addHospitalDOMObserver() {
        const target = document.querySelector("div.userlist-wrapper");
        if (target) {
            const observer = new MutationObserver(() => {
                setTimeout(() => {
                    if (location.pathname === '/hospitalview.php') {
                        rebuildFilters();
                    }
                }, 50);
            });

            observer.observe(target, {
                childList: true,
                subtree: true
            });
        }
    }

    function addStyles() {
        const styles = `
            .kw--hidden {
                display: none !important;
            }

            .kw--hospital-filters-container {
                background: var(--info-msg-bg-gradient, linear-gradient(to bottom,#ffffff 0%,#e4e4e4 100%));
                color: var(--info-msg-font-color, #666);
                border-radius: 5px;
                box-shadow: var(--info-msg-box-shadow, 1px 1px 4px rgba(0,0,0,.25));
                display: flex;
                justify-content: center;
                padding: 0.5rem;
                margin-bottom: 10px;
            }
        `;
        $("head").append(`<style>${styles}</style>`);
    }

    async function rebuildFilters() {
        const container = await waitForContainer();
        disableFilters();
        addFilterElement(container);
    }

    function waitForContainer() {
        return new Promise((resolve, reject) => {
            let el = $("div.userlist-wrapper > ul.user-info-list-wrap");
            if (isReady(el)) return resolve(el);

            let count = 0;
            const id = setInterval(() => {
                el = $("div.userlist-wrapper > ul.user-info-list-wrap");
                if (isReady(el)) {
                    clearInterval(id);
                    resolve(el);
                }
                if (count++ > 50) {
                    clearInterval(id);
                    console.error("Could not find hospital list container.");
                    reject();
                }
            }, 300);
        });

        function isReady(el) {
            return el[0] && !el.find("span.ajax-preloader")[0];
        }
    }

    function disableFilters() {
        $("li.kw--hidden").removeClass("kw--hidden");
    }

    function enableFilters(container) {
        container.find("> li").filter((_, el) => {
            return $(el).find("a.revive").hasClass("reviveNotAvailable");
        }).addClass("kw--hidden");
    }

    function addFilterElement(container) {
        if (!container) return console.error("Missing container element!");
        const parent = $("div.content-wrapper > div.msg-info-wrap");
        parent.find(".kw--hospital-filters-container").remove();
        parent.children().each((_, el) => el.classList.add("kw--hidden"));

        const button = $("<button>", {
            class: "torn-btn",
            text: "Enabled revive",
            css: {
                marginRight: "6px"
            }
        }).data("enabled", true).on("click", function() {
            const enabled = button.data("enabled");
            if (enabled) {
                disableFilters(container);
                button.text("Disabled revive").data("enabled", false);
            } else {
                enableFilters(container);
                button.text("Enabled revive").data("enabled", true);
            }
        });

        const flipPageBtn = $("<button>", {
            class: "torn-btn",
            text: "⇆",
            title: "Flip between pages 1 & 2",
            css: {
                marginLeft: "6px",
                padding: "0 8px"
            }
        }).on("click", () => {
            const currentHash = window.location.hash;
            window.location.hash = currentHash === "#start=50" ? "#" : "#start=50";
        });

        parent.append(
            $("<div>", {
                class: "kw--hospital-filters-container"
            }).append(button, flipPageBtn)
        );

        enableFilters(container);
    }
})();