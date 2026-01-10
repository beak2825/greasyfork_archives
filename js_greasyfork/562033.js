// ==UserScript==
// @name         "newest" filter restorer
// @namespace    http://tampermonkey.net/
// @version      v0.1
// @description  well, what do you think it does, buddy?
// @author       cv
// @match        *://*.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/562033/%22newest%22%20filter%20restorer.user.js
// @updateURL https://update.greasyfork.org/scripts/562033/%22newest%22%20filter%20restorer.meta.js
// ==/UserScript==

(function() {
    "use strict";

    let isnewestselected = false;
    let newestfilterelement = null;

    function checkurlfornewest() {
        try {
            const url = new URL(window.location.href);
            const spparam = url.searchParams.get("sp");
            isnewestselected = (spparam === "CAI%3D" || spparam === "CAI%253D" ||
                               decodeURIComponent(spparam || "") === "CAI=" ||
                               decodeURIComponent(decodeURIComponent(spparam || "")) === "CAI=");
        } catch (e) {
            isnewestselected = false;
        }
    }
    checkurlfornewest();

    function addnewestfilter() {
        const dialog = document.querySelector("ytd-search-filter-options-dialog-renderer");
        if (!dialog) return false;
        const isopen = dialog.hasAttribute("opened") ||
            (window.getComputedStyle(dialog).display !== "none" &&
            window.getComputedStyle(dialog).visibility !== "hidden");
        if (!isopen) return false;
        let filtergoops = dialog.querySelectorAll("ytd-search-filter-group-renderer");
        let filtergoop = null;
        for (const group of filtergoops) {
            const header = group.querySelector("h4 yt-formatted-string");
            if (header && header.textContent.trim() === "Prioritize") {
                filtergoop = group;
                break;
            }
        }
        if (!filtergoop) {
            filtergoops = document.querySelectorAll("ytd-search-filter-group-renderer");
            for (const group of filtergoops) {
                const header = group.querySelector("h4 yt-formatted-string");
                if (header && header.textContent.trim() === "Prioritize") {
                    filtergoop = group;
                    break;
                }
            }
        }
        if (!filtergoop) return false;
        const existingnewest = filtergoop.querySelector("[data-filter='newest']");
        if (existingnewest) {
            const fs = existingnewest.querySelector("yt-formatted-string");
            if (fs) {
                fs.removeAttribute("is-empty");
                if (!fs.textContent || fs.textContent.trim() === "") {
                    const as = fs.querySelector("yt-attributed-string");
                    if (as && (!as.textContent || as.textContent.trim() === "")) as.remove();
                    fs.textContent = "Newest";
                }
            }
            checkurlfornewest();
            if (isnewestselected) {
                existingnewest.classList.add("selected");
                const link = existingnewest.querySelector("a");
                if (link) {
                    link.setAttribute("aria-selected", "true");
                }
                const dismissicon = existingnewest.querySelector("#dismiss-x");
                if (dismissicon) {
                    dismissicon.setAttribute("hidden", "");
                }
            } else {
                existingnewest.classList.remove("selected");
                const link = existingnewest.querySelector("a");
                if (link) {
                    link.removeAttribute("aria-selected");
                }
                const dismissicon = existingnewest.querySelector("#dismiss-x");
                if (dismissicon) {
                    dismissicon.removeAttribute("hidden");
                }
            }

            const filters = filtergoop.querySelectorAll("ytd-search-filter-renderer:not([data-filter='newest'])");
            const firstfilter = filters[0];
            if (firstfilter && existingnewest.nextSibling !== firstfilter && existingnewest.previousSibling !== firstfilter) {
                firstfilter.parentNode.insertBefore(existingnewest, firstfilter);
            }
            return true;
        }
        const filters = filtergoop.querySelectorAll("ytd-search-filter-renderer");
        let filtertoclone = null;
        for (const filter of filters) {
            const fs = filter.querySelector("yt-formatted-string");
            if (fs && fs.textContent && fs.textContent.trim() !== "" && !fs.hasAttribute("is-empty")) {
                filtertoclone = filter;
                break;
            }
        }
        if (!filtertoclone) filtertoclone = filters[0];
        if (!filtertoclone) return false;
        const firstfilter = filters[0];
        try {
            const currenturl = new URL(window.location.href);
            const spparam = currenturl.searchParams.get("sp");
            isnewestselected = (spparam === "CAI%3D" || spparam === "CAI%253D" ||
                               decodeURIComponent(spparam || "") === "CAI=" ||
                               decodeURIComponent(decodeURIComponent(spparam || "")) === "CAI=");
        } catch (e) {
            isnewestselected = false;
        }
        const newestfilter = filtertoclone.cloneNode(true);
        newestfilter.setAttribute("data-filter", "newest");
        newestfilter.classList.remove("selected");
        if (isnewestselected) {
            newestfilter.classList.add("selected");
            const link = newestfilter.querySelector("a");
            if (link) {
                link.setAttribute("aria-selected", "true");
            }
            const dismissicon = newestfilter.querySelector("#dismiss-x");
            if (dismissicon) {
                dismissicon.setAttribute("hidden", "");
            }
            filtergoop.querySelectorAll("ytd-search-filter-renderer").forEach(filter => {
                if (filter !== newestfilter) {
                    filter.classList.remove("selected");
                    const otherlink = filter.querySelector("a");
                    if (otherlink) {
                        otherlink.removeAttribute("aria-selected");
                    }
                }
            });
        } else {
            newestfilter.classList.remove("selected");
            const link = newestfilter.querySelector("a");
            if (link) {
                link.removeAttribute("aria-selected");
            }
            const dismissicon = newestfilter.querySelector("#dismiss-x");
            if (dismissicon && !isnewestselected) {
                dismissicon.removeAttribute("hidden");
            }
        }
        const formattedstring = newestfilter.querySelector("yt-formatted-string");
        if (formattedstring) {
            formattedstring.removeAttribute("is-empty");
            const attributedstring = formattedstring.querySelector("yt-attributed-string");
            if (attributedstring) attributedstring.remove();
            formattedstring.textContent = "Newest";
            if (!formattedstring.textContent || formattedstring.textContent.trim() === "") {
                formattedstring.innerHTML = "Newest";
            }
        }
        const label = newestfilter.querySelector("#label");
        if (label) {label.setAttribute("title", "Prioritize by upload date")}
        const link = newestfilter.querySelector("a");
        if (link) {
            const currenturl = new URL(window.location.href);
            const searchquery = currenturl.searchParams.get("search_query") || "";
            const newhref = `/results?search_query=${encodeURIComponent(searchquery)}&sp=CAI%253D`; // CAI= stands for.. uh.. CneAwestI=.. according to youtube
            link.href = newhref;
            link.setAttribute("href", newhref);
            if (!link.classList.contains("yt-simple-endpoint")) {
                link.classList.add("yt-simple-endpoint");
            }
            const otherlink = filtergoop.querySelector("ytd-search-filter-renderer:not([data-filter='newest']) a");
            if (otherlink && otherlink.hasAttribute("endpoint")) {
                try {
                    const endpointdata = otherlink.getAttribute("endpoint");
                    if (endpointdata) link.setAttribute("endpoint", endpointdata);
                } catch (e) {}
            }
            link.addEventListener("click", (e) => {
                isnewestselected = true;
                setTimeout(() => {
                    const currenturl = window.location.href;
                    if (!currenturl.includes("sp=CAI") && !currenturl.includes("sp=CAI%3D")) {
                        const url = new URL(window.location.href);
                        url.searchParams.set("sp", "CAI%3D");
                        window.location.href = url.href;
                    }
                }, 100);
            }, false);
        }
        try {
            firstfilter.parentNode.insertBefore(newestfilter, firstfilter);
            newestfilterelement = newestfilter;
            for (let delay of [10, 50, 100, 200]) {
                setTimeout(() => {
                    const fs = newestfilter.querySelector("yt-formatted-string");
                    if (fs) {
                        fs.removeAttribute("is-empty");
                        const as = fs.querySelector("yt-attributed-string");
                        if (as && (!as.textContent || as.textContent.trim() === "")) as.remove();
                        if (!fs.textContent || fs.textContent.trim() === "") {
                            fs.textContent = "Newest";
                        }
                    }
                    const linkafter = newestfilter.querySelector("a");
                    if (linkafter) {
                        const currenturl = new URL(window.location.href);
                        const searchquery = currenturl.searchParams.get("search_query") || "";
                        const newhref = `/results?search_query=${encodeURIComponent(searchquery)}&sp=CAI%253D`;
                        linkafter.href = newhref;
                        linkafter.setAttribute("href", newhref);
                    }
                    const currenturl = new URL(window.location.href);
                    const spparam = currenturl.searchParams.get("sp");
                    const isselected = (spparam === "CAI%3D" || spparam === "CAI%253D" ||
                                       decodeURIComponent(spparam || "") === "CAI=" ||
                                       decodeURIComponent(decodeURIComponent(spparam || "")) === "CAI=");

                    if (isselected) {
                        newestfilter.classList.add("selected");
                        const linkafter = newestfilter.querySelector("a");
                        if (linkafter) {
                            linkafter.setAttribute("aria-selected", "true");
                        }
                        const dismissicon = newestfilter.querySelector("#dismiss-x");
                        if (dismissicon) {
                            dismissicon.setAttribute("hidden", "");
                        }
                    } else {
                        newestfilter.classList.remove("selected");
                        const linkafter = newestfilter.querySelector("a");
                        if (linkafter) {
                            linkafter.removeAttribute("aria-selected");
                        }
                        const dismissicon = newestfilter.querySelector("#dismiss-x");
                        if (dismissicon) {
                            dismissicon.removeAttribute("hidden");
                        }
                    }
                }, delay);
            }
            const goopobserver = new MutationObserver((mutations) => {
                const currentgroup = document.querySelector("ytd-search-filter-group-renderer");
                const currentnewest = currentgroup && currentgroup.querySelector("[data-filter='newest']");
                const currentfirst = currentgroup && currentgroup.querySelector("ytd-search-filter-renderer:not([data-filter='newest'])");
                if (!currentnewest && currentfirst) {
                    setTimeout(() => addnewestfilter(), 50);
                }
            });
            if (filtergoop.parentNode) {
                goopobserver.observe(filtergoop, {
                    childList: true,
                    subtree: false
                });
                setTimeout(() => goopobserver.disconnect(), 10000);
            }
            return true;
        } catch (e) {return false}
    }

    function startfilter() {
        requestAnimationFrame(() => {
            let attempts = 0;
            const maxattempts = 10;
            const tryadd = () => {
                attempts++;
                if (addnewestfilter()) return true;
                if (attempts < maxattempts) {
                    setTimeout(tryadd, 150);
                } else {
                    const waitforbody = () => {
                        if (!document.body) {
                            setTimeout(waitforbody, 100);
                            return;
                        }
                        const observer = new MutationObserver(() => {
                            if (addnewestfilter()) {
                                observer.disconnect();
                            }
                        });
                        observer.observe(document.body, {
                            childList: true,
                            subtree: true
                        });
                        setTimeout(() => observer.disconnect(), 5000);
                    }; waitforbody();
                }
                return false;
            }; tryadd();
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", startfilter);
    } else {
        startfilter();
    }

    function setupobservers() {
        if (document.documentElement) {
            let lasturl = location.href;
            const navobserver = new MutationObserver(() => {
                const currenturl = location.href;
                if (currenturl !== lasturl) {
                    lasturl = currenturl;
                    checkurlfornewest();
                    setTimeout(startfilter, 300);
                }
            });
            navobserver.observe(document.documentElement, {
                subtree: true,
                childList: true
            });
        }
        const waitforbody = setInterval(() => {
            if (document.body) {
                clearInterval(waitforbody);
                const filterobserver = new MutationObserver((mutations) => {
                    const filterdialog = document.querySelector("ytd-search-filter-options-dialog-renderer");
                    const isopen = filterdialog && (
                        filterdialog.hasAttribute("opened") ||
                        window.getComputedStyle(filterdialog).display !== "none"
                    );
                    if (isopen) {
                        requestAnimationFrame(() => {
                            requestAnimationFrame(() => {
                                for (let i = 0; i < 8; i++) {
                                    setTimeout(() => {
                                        addnewestfilter();
                                    }, i * 100 + 50);
                                }
                            });
                        });
                    }
                    const filtergoop = document.querySelector("ytd-search-filter-group-renderer");
                    if (filtergoop && isopen) {
                        requestAnimationFrame(() => {
                            setTimeout(() => addnewestfilter(), 50);
                        });
                    }
                });
                filterobserver.observe(document.body, {
                    childList: true,
                    subtree: true,
                    attributes: true,
                    attributeFilter: ["opened", "style", "class"]
                });
                const dialogobserver = new MutationObserver(() => {
                    const filterdialog = document.querySelector("ytd-search-filter-options-dialog-renderer");
                    if (filterdialog) {
                        const dialogopenobserver = new MutationObserver(() => {
                            if (filterdialog.hasAttribute("opened")) {
                                requestAnimationFrame(() => {
                                    requestAnimationFrame(() => {
                                        for (let i = 0; i < 8; i++) {
                                            setTimeout(() => addnewestfilter(), i * 100 + 50);
                                        }
                                    });
                                });
                            }
                        });
                        dialogopenobserver.observe(filterdialog, {
                            attributes: true,
                            attributeFilter: ["opened"]
                        });
                    }
                });
                dialogobserver.observe(document.body, {
                    childList: true,
                    subtree: true
                });
            }
        }, 100);
        setTimeout(() => clearInterval(waitforbody), 10000);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", setupobservers);
    } else {
        setupobservers();
    }

})();
