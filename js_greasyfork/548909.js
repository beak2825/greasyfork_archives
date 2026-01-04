// ==UserScript==
// @name         Video evaluation
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  動画を評価
// @match        https://muchohentai.com/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548909/Video%20evaluation.user.js
// @updateURL https://update.greasyfork.org/scripts/548909/Video%20evaluation.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = "videoRatings";
    const SERIES_KEY = "seriesRatings";
    const FILTER_KEY = "videoFilters";
    let ratings = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    let seriesRatings = JSON.parse(localStorage.getItem(SERIES_KEY) || "{}");
    let filters = JSON.parse(localStorage.getItem(FILTER_KEY) || "{}");

    function saveRatings() { localStorage.setItem(STORAGE_KEY, JSON.stringify(ratings)); }
    function saveSeriesRatings() { localStorage.setItem(SERIES_KEY, JSON.stringify(seriesRatings)); }
    function saveFilters() { localStorage.setItem(FILTER_KEY, JSON.stringify(filters)); }

    function normalizeSeriesName(title) {
        title = title.replace(/^👍\s*|^👎\s*/, "");
        title = title.replace(/^\【.*?\】/, "");
        const match = title.match(/(.*?)(Episode\s*\d+[A-Za-z]?)/i);
        if (match) return match[1].trim();
        return title.replace(/\s+(English Subbed|En Español|Raw|PV)$/i, "").trim();
    }

    function applyRatings() {
        document.querySelectorAll("h2.entry-title a").forEach(a => {
            const id = a.getAttribute("href");
            const seriesName = normalizeSeriesName(a.textContent);
            let rating = ratings[id] || seriesRatings[seriesName];

            a.style.color = "";
            if (a.dataset.prefix) {
                a.textContent = a.textContent.replace(a.dataset.prefix, "");
                delete a.dataset.prefix;
            }

            if (rating === "high") {
                a.style.color = "red";
                a.dataset.prefix = "👍 ";
                a.textContent = a.dataset.prefix + a.textContent;
            } else if (rating === "low") {
                a.style.color = "blue";
                a.dataset.prefix = "👎 ";
                a.textContent = a.dataset.prefix + a.textContent;
            } else if (rating === "normal") {
                a.style.color = "green";
            }
        });
        applyFilters();
    }

    function applyFilters() {
        const hideHigh = filters.hideHigh;
        const hideNormal = filters.hideNormal;
        const hideLow = filters.hideLow;

        document.querySelectorAll(".item-video").forEach(item => {
            const link = item.querySelector("h2.entry-title a");
            if (!link) return;
            const id = link.getAttribute("href");
            const seriesName = normalizeSeriesName(link.textContent);
            const rating = ratings[id] || seriesRatings[seriesName];

            item.style.display = "";
            if (hideHigh && rating === "high") item.style.display = "none";
            if (hideNormal && rating === "normal") item.style.display = "none";
            if (hideLow && rating === "low") item.style.display = "none";
        });
    }

    function createMenu(x, y, link) {
        const menu = document.createElement("div");
        menu.className = "custom-menu";
        menu.style.top = y + "px";
        menu.style.left = x + "px";

        function addMenu(label, value, color, allEp) {
            const item = document.createElement("div");
            item.textContent = label;
            item.style.color = color;
            item.style.cursor = "pointer";
            item.style.display = "inline-block";
            item.style.marginRight = "8px";

            item.addEventListener("click", () => {
                ratings[link.getAttribute("href")] = value;
                saveRatings();
                applyRatings();
                menu.remove();
            });
            menu.appendChild(item);

            if (allEp) {
                const allBtn = document.createElement("button");
                allBtn.textContent = "all ep";
                allBtn.style.marginLeft = "4px";
                allBtn.style.fontSize = "10px";
                allBtn.addEventListener("click", () => {
                    const seriesName = normalizeSeriesName(link.textContent);
                    seriesRatings[seriesName] = value;
                    saveSeriesRatings();
                    // 現ページにある同シリーズも即反映
                    document.querySelectorAll("h2.entry-title a").forEach(otherLink => {
                        if (normalizeSeriesName(otherLink.textContent) === seriesName) {
                            ratings[otherLink.getAttribute("href")] = value;
                        }
                    });
                    saveRatings();
                    applyRatings();
                    menu.remove();
                });
                menu.appendChild(allBtn);
            }
        }

        addMenu("👍 高評価", "high", "red", true);
        addMenu("普通", "normal", "green", true);
        addMenu("👎 低評価", "low", "blue", true);

        document.body.appendChild(menu);
        document.addEventListener("click", () => menu.remove(), { once: true });
    }

    function addFilterUI() {
        const panel = document.createElement("div");
        panel.innerHTML = `
          <label><input type="checkbox" id="hideHigh"> 高評価を非表示</label>
          <label><input type="checkbox" id="hideNormal"> 普通を非表示</label>
          <label><input type="checkbox" id="hideLow"> 低評価を非表示</label>
        `;
        panel.style.position = "fixed";
        panel.style.top = "10px";
        panel.style.right = "10px";
        panel.style.background = "white";
        panel.style.padding = "5px";
        panel.style.border = "1px solid black";
        panel.style.zIndex = "9999";
        document.body.appendChild(panel);

        // 初期状態の反映
        ["hideHigh", "hideNormal", "hideLow"].forEach(id => {
            const checkbox = document.getElementById(id);
            checkbox.checked = filters[id] || false;
            checkbox.addEventListener("change", () => {
                filters[id] = checkbox.checked;
                saveFilters();
                applyFilters();
            });
        });
    }

    GM_addStyle(`
        .custom-menu {
            position: absolute;
            background: #fff;
            border: 1px solid #ccc;
            padding: 5px;
            z-index: 10000;
            display: flex;
            align-items: center;
        }
        .custom-menu div:hover {
            background: #eee;
        }
    `);

    document.addEventListener("contextmenu", e => {
        const link = e.target.closest("h2.entry-title a");
        if (link) {
            e.preventDefault();
            document.querySelectorAll(".custom-menu").forEach(m => m.remove());
            createMenu(e.pageX, e.pageY, link);
        }
    });

    addFilterUI();
    applyRatings();

})();
