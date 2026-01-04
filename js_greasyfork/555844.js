// ==UserScript==
// @name         Krawężnik v2.8
// @namespace    http://tampermonkey.net/
// @version      2.8
// @license      MIT
// @description  Zwija i rozwija wpisy + dolny przycisk + auto scroll + reset + auto cleanup
// @match        *://wykop.pl/*
// @match        *://*.wykop.pl/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/555844/Kraw%C4%99%C5%BCnik%20v28.user.js
// @updateURL https://update.greasyfork.org/scripts/555844/Kraw%C4%99%C5%BCnik%20v28.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const cacheKey = "minimized_threads";
    let database = new Map();
    const MAX_AGE = 2 * 24 * 60 * 60 * 1000; // 2 dni

    /* ---------- CSS ---------- */

    GM_addStyle(`
        .kraw-btn {
            display: inline-block;
            cursor: pointer;
            color: #71be71 !important;
            font-weight: bold;
            margin-left: 6px;
            font-size: 16px;
            line-height: 16px;
            white-space: nowrap;
            background: transparent;
            border: none;
            padding: 0;
        }

        .kraw-bottom-wrapper {
            display: flex;
            justify-content: flex-end;
            margin-top: 14px;
            margin-bottom: 6px;
        }

        /* ULTRA CHUDY widok po zwinięciu */
.entry[minimized] {
    padding: 2px 0 !important;
    margin: 4px 0 !important;   /* minimalny odstęp między wpisami */
    border-top: 1px solid #000 !important;
}

.entry[minimized] .kraw-bottom-wrapper {
    display: none !important;
}

.entry[minimized] article > *:not(header),
.entry[minimized] .content,
.entry[minimized] .entry-photo,
.entry[minimized] footer,
.entry[minimized] iframe,
.entry[minimized] .embed,
.entry[minimized] .media-content,
.entry[minimized] .thumbnail,
.entry[minimized] .entry-actions,
.entry[minimized] .row,
.entry[minimized] .comments {
    display: none !important;
}

/* Lekko zmniejszamy górny header żeby było jeszcze chudziej */
.entry[minimized] header {
    padding: 0 !important;
    margin: 0 !important;
}
.entry[minimized] header h2,
.entry[minimized] header .avatar,
.entry[minimized] header .author,
.entry[minimized] header time {
    transform: scale(0.9);
    opacity: 0.85;
}

        #kraw-reset {
            cursor: pointer;
            font-size: 20px;
            margin-left: 14px;
            opacity: 0.75;
            transition: 0.2s;
        }
        #kraw-reset:hover {
            opacity: 1;
            transform: scale(1.15);
        }
    `);

    /* ---------- STORAGE ---------- */

    function loadDatabase() {
        try {
            const stored = localStorage.getItem(cacheKey);
            if (stored) database = new Map(JSON.parse(stored));
        } catch {}
    }

    function saveDatabase() {
        localStorage.setItem(cacheKey, JSON.stringify([...database.entries()]));
    }

    function cleanupOld() {
        const now = Date.now();
        let changed = false;

        for (const [id, data] of database.entries()) {
            if (!data.timestamp || now - data.timestamp > MAX_AGE) {
                database.delete(id);
                changed = true;
            }
        }
        if (changed) saveDatabase();
    }

    function clearAll() {
        if (!confirm("Czy na pewno chcesz wyczyścić wszystkie ukryte wpisy?")) return;
        database.clear();
        saveDatabase();
        location.reload();
    }

    /* ---------- HELPERS ---------- */

    function getEntryId(entry) {
        return entry.id?.match(/\d+/)?.[0] ?? null;
    }

    function isComment(entry) {
        return entry.classList.contains("reply");
    }

    function hideEntry(entry) {
        entry.setAttribute("minimized", "1");

        const bottom = entry.querySelector(".kraw-bottom-wrapper");
        if (bottom) bottom.style.display = "none";
    }

    function showEntry(entry) {
        entry.removeAttribute("minimized");

        const bottom = entry.querySelector(".kraw-bottom-wrapper");
        if (bottom) bottom.style.display = "";
    }

    /* ---------- BUTTON CREATOR ---------- */

    function createToggleButton(entry, id) {
        const btn = document.createElement("button");
        btn.className = "kraw-btn";

        const update = () => {
            btn.textContent = database.has(id) ? "[ + ]" : "[ - ]";
        };
        update();

        btn.onclick = (ev) => {
            const isBottomButton = btn.closest(".kraw-bottom-wrapper") !== null;

            let heightBefore = 0;
            if (isBottomButton && !database.has(id)) {
                heightBefore = entry.getBoundingClientRect().height;
            }

            if (database.has(id)) {
                database.delete(id);
                showEntry(entry);
            } else {
                database.set(id, { hidden: true, timestamp: Date.now() });
                hideEntry(entry);
            }
            saveDatabase();

            entry.querySelectorAll(".kraw-btn").forEach(b => {
                b.textContent = database.has(id) ? "[ + ]" : "[ - ]";
            });

            if (isBottomButton && heightBefore > 0) {
                window.scrollBy({ top: -heightBefore, behavior: "smooth" });
            }
        };

        return btn;
    }

    /* ---------- ADD BUTTONS ---------- */

    function addButtons(entry) {
        if (isComment(entry)) return;

        const id = getEntryId(entry);
        if (!id) return;

        const article = entry.querySelector("article");
        if (!article) return;

        /* Górny przycisk */
        const topContainer = article.querySelector("button.plus")?.parentElement;
        if (topContainer && !topContainer.querySelector(".kraw-btn")) {
            topContainer.appendChild(createToggleButton(entry, id));
        }

        /* Dolny przycisk – tylko dla rozwiniętych */
        if (!entry.querySelector(".kraw-bottom-wrapper")) {
            const wrapper = document.createElement("div");
            wrapper.className = "kraw-bottom-wrapper";
            wrapper.appendChild(createToggleButton(entry, id));
            entry.appendChild(wrapper);
        }
    }

    /* ---------- PROCESSING ---------- */

    function processEntry(entry) {
        if (entry.hasAttribute("kraw-processed")) return;
        entry.setAttribute("kraw-processed", "1");

        if (isComment(entry)) return;

        const id = getEntryId(entry);
        if (!id) return;

        addButtons(entry);

        if (database.has(id)) {
            hideEntry(entry);
        }
    }

    function scanAll() {
        document.querySelectorAll("section.entry, .entry").forEach(processEntry);
    }

    const obs = new MutationObserver(scanAll);
    obs.observe(document.body, { childList: true, subtree: true });

    /* ---------- RESET BUTTON IN TOPBAR ---------- */

    function addResetButton() {
        if (document.getElementById("kraw-reset")) return;

        const topbar = document.querySelector("header nav ul");
        if (!topbar) return;

        const li = document.createElement("li");
        li.style.listStyle = "none";

        const btn = document.createElement("span");
        btn.id = "kraw-reset";
        btn.textContent = "🧹";
        btn.title = "Wyczyść ukryte wpisy";

        btn.onclick = clearAll;

        li.appendChild(btn);
        topbar.appendChild(li);
    }

    /* ---------- INIT ---------- */

    loadDatabase();
    cleanupOld();
    scanAll();

    setTimeout(addResetButton, 800);
})();