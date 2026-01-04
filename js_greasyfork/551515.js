// ==UserScript==
// @name         Ups - Item listings searcher
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Create tags to quickly filter user market listings
// @author       Upsilon [3212478]
// @match        https://www.torn.com/page.php?sid=ItemMarket
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @license      All rights reserved
// @downloadURL https://update.greasyfork.org/scripts/551515/Ups%20-%20Item%20listings%20searcher.user.js
// @updateURL https://update.greasyfork.org/scripts/551515/Ups%20-%20Item%20listings%20searcher.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const STORAGE_KEY = "quickSearchTags";
    let activeTag = null;
    const TYPING_SPEED = 50;

    function loadTags() {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    }

    function saveTags(tags) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tags));
    }

    function getReactPropsKey(el) {
        return Object.keys(el).find(k => k.startsWith("__reactProps"));
    }

    function triggerReactChange(element, value) {
        const reactKey = getReactPropsKey(element);
        if (!reactKey) {
            element.value = value;
            element.dispatchEvent(new Event("input", { bubbles: true }));
            return;
        }

        const reactProps = element[reactKey];
        if (!reactProps || typeof reactProps.onChange !== "function") {
            element.value = value;
            element.dispatchEvent(new Event("input", { bubbles: true }));
            return;
        }

        const event = new Event("input", { bubbles: true });
        Object.defineProperty(event, "target", { writable: false, value: element });
        event.stopPropagation = () => {};
        event.preventDefault = () => {};

        element.value = value;
        reactProps.onChange(event);
    }

    async function simulateTypingReact(element, text) {
        element.focus();
        triggerReactChange(element, "");

        for (const char of text) {
            const newValue = element.value + char;
            triggerReactChange(element, newValue);
            await new Promise(res => setTimeout(res, TYPING_SPEED));
        }
    }

    function clearSearchInput() {
        const input = document.querySelector('.searchInput___zruI7');
        if (!input) return;
        triggerReactChange(input, "");
    }

    async function ensureSearchInputVisible() {
        let input = document.querySelector('.searchInput___zruI7');
        if (input && input.offsetParent !== null) return true;

        const searchBtn = document.querySelector('.searchButton___LcMxK');
        if (!searchBtn) return false;

        searchBtn.click();

        for (let i = 0; i < 20; i++) {
            await new Promise(res => setTimeout(res, 100));
            input = document.querySelector('.searchInput___zruI7');
            if (input && input.offsetParent !== null) return false;
        }
        return false;
    }

    function renderTags(container) {
        container.innerHTML = "";
        const tags = loadTags();

        tags.forEach(tag => {
            const btn = document.createElement("button");
            btn.textContent = tag;
            Object.assign(btn.style, {
                padding: "5px 10px",
                margin: "3px",
                border: "1px solid #888",
                borderRadius: "8px",
                background: "#222",
                color: "#eee",
                cursor: "pointer",
                transition: "background 0.2s"
            });

            btn.addEventListener("click", async () => {
                const allBtns = container.querySelectorAll("button");

                const inputVisible = await ensureSearchInputVisible();
                if (!inputVisible) return;

                const input = document.querySelector('.searchInput___zruI7');
                if (!input) return;

                if (activeTag === tag) {
                    activeTag = null;
                    clearSearchInput();
                    allBtns.forEach(el => (el.style.outline = "none"));
                } else {
                    activeTag = tag;
                    allBtns.forEach(el => (el.style.outline = "none"));
                    btn.style.outline = "2px solid limegreen";

                    btn.style.background = "#2a2";
                    setTimeout(() => btn.style.background = "#222", 150);

                    await simulateTypingReact(input, tag);
                }
            });

            container.appendChild(btn);
        });
    }

    function createModal(tagContainer) {
        const modal = document.createElement("div");
        modal.id = "quickSearchModal";
        Object.assign(modal.style, {
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: "9999",
            visibility: "hidden"
        });

        const box = document.createElement("div");
        Object.assign(box.style, {
            background: "#333",
            padding: "20px",
            borderRadius: "10px",
            color: "#fff",
            minWidth: "300px",
            maxWidth: "500px"
        });

        const title = document.createElement("h3");
        title.textContent = "Manage tags";
        box.appendChild(title);

        const input = document.createElement("input");
        input.placeholder = "New tag...";
        Object.assign(input.style, {
            display: "block",
            width: "100%",
            padding: "8px",
            margin: "10px 0",
            borderRadius: "6px",
            border: "1px solid #666",
            background: "#222",
            color: "#fff"
        });

        const addBtn = document.createElement("button");
        addBtn.textContent = "Add";
        addBtn.className = "torn-btn";
        addBtn.style.marginBottom = "15px";

        const tagBox = document.createElement("div");
        Object.assign(tagBox.style, {
            marginTop: "15px",
            display: "flex",
            flexWrap: "wrap"
        });

        function renderModalTags() {
            tagBox.innerHTML = "";
            loadTags().forEach(tag => {
                const span = document.createElement("span");
                span.textContent = tag;
                Object.assign(span.style, {
                    padding: "5px 10px",
                    margin: "5px",
                    border: "1px solid #888",
                    borderRadius: "8px",
                    background: "#222",
                    color: "#eee",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "5px"
                });

                const del = document.createElement("button");
                del.textContent = "×";
                Object.assign(del.style, {
                    border: "none",
                    background: "transparent",
                    color: "red",
                    cursor: "pointer"
                });
                del.addEventListener("click", () => {
                    let tags = loadTags().filter(t => t !== tag);
                    saveTags(tags);
                    renderModalTags();
                    renderTags(tagContainer);
                    if (activeTag === tag) {
                        activeTag = null;
                        clearSearchInput();
                    }
                });

                span.appendChild(del);
                tagBox.appendChild(span);
            });
        }

        addBtn.addEventListener("click", () => {
            const val = input.value.trim();
            if (!val) return;
            let tags = loadTags();
            if (!tags.includes(val)) {
                tags.push(val);
                saveTags(tags);
                renderModalTags();
                renderTags(tagContainer);
            }
            input.value = "";
        });

        box.appendChild(input);
        box.appendChild(addBtn);
        box.appendChild(tagBox);

        const closeBtn = document.createElement("button");
        closeBtn.textContent = "Close";
        closeBtn.className = "torn-btn";
        closeBtn.style.marginTop = "10px";
        closeBtn.addEventListener("click", () => {
            modal.style.visibility = "hidden";
        });
        box.appendChild(closeBtn);

        modal.appendChild(box);
        document.body.appendChild(modal);

        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && modal.style.visibility === "visible") {
                modal.style.visibility = "hidden";
            }
        });

        renderModalTags();
        return modal;
    }

    function init() {
        const controls = document.querySelector(".controls___Omt5b");
        if (!controls) return;

        const tagContainer = document.createElement("div");
        Object.assign(tagContainer.style, {
            display: "inline-flex",
            flexWrap: "wrap",
            marginLeft: "10px"
        });

        const gearBtn = document.createElement("button");
        gearBtn.textContent = "⚙️";
        Object.assign(gearBtn.style, {
            marginLeft: "10px",
            cursor: "pointer"
        });

        controls.appendChild(tagContainer);
        controls.appendChild(gearBtn);

        renderTags(tagContainer);

        const modal = createModal(tagContainer);

        gearBtn.addEventListener("click", () => {
            modal.style.visibility = "visible";
            const input = modal.querySelector("input");
            if (input) input.focus();
        });
    }

    const observer = new MutationObserver(() => {
        if (document.querySelector(".controls___Omt5b") && !document.querySelector("#quickSearchInit")) {
            const marker = document.createElement("div");
            marker.id = "quickSearchInit";
            document.body.appendChild(marker);
            init();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();