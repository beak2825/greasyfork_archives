// ==UserScript==
// @name         Classic Leaderboards Tab
// @namespace    JinxedOasis (With a little help of ChatGPT)
// @version      1.1
// @description  Restores classic ROBLOX Leaderboards tab
// @match        https://www.roblox.com/games/*
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559989/Classic%20Leaderboards%20Tab.user.js
// @updateURL https://update.greasyfork.org/scripts/559989/Classic%20Leaderboards%20Tab.meta.js
// ==/UserScript==

(function () {
    "use strict";


    const leaderboardsTabHTML = `
    <li id="tab-leaderboards" class="rbx-tab tab-leaderboards">
        <a class="rbx-tab-heading" href="#leaderboards" tabindex="-1">
            <span class="rbx-lead" style="font-weight:400;font-size:18px;">
                Leaderboards
            </span>
        </a>
    </li>`;

    const leaderboardFilterHTML = `
    <div class="rbx-leaderboard-filter" data-selected="1">
        <span class="rbx-leaderboard-filtername">Past Week</span>
        <a class="rbx-menu-item">
            <span class="icon-sorting"></span>
        </a>
        <div class="popover bottom">
            <div class="arrow"></div>
            <div class="popover-content">
                <ul class="dropdown-menu">
                    <li><a data-time-filter="0">Today</a></li>
                    <li><a data-time-filter="1">Past Week</a></li>
                    <li><a data-time-filter="2">Past Month</a></li>
                    <li><a data-time-filter="3">All Time</a></li>
                </ul>
            </div>
        </div>
    </div>`;

 const leaderboardsPaneHTML = `
<div class="col-md-6">
    <div class="section rbx-leaderboard-container rbx-leaderboard-player">
        <div class="rbx-leaderboard-header">
            <h3>Players</h3>
            ${leaderboardFilterHTML}
        </div>
        <div class="section-content rbx-leaderboard-items">
            <div class="rbx-leaderboard-notification">
                <p>No results found.</p>
            </div>
        </div>
    </div>
</div>

<div class="col-md-6">
    <div class="section rbx-leaderboard-container rbx-leaderboard-clan">
        <div class="rbx-leaderboard-header">
            <h3>Clans</h3>
            ${leaderboardFilterHTML}
        </div>
        <div class="section-content rbx-leaderboard-items">
            <div class="rbx-leaderboard-notification">
                <p>No results found.</p>
            </div>
        </div>
    </div>
</div>`;



    function insertLeaderboardsTab() {
        if (document.getElementById("tab-leaderboards")) return;

        const referenceTab = document.querySelector("#tab-game-instances");
        if (!referenceTab?.parentNode) return;

        const temp = document.createElement("div");
        temp.innerHTML = leaderboardsTabHTML;
        referenceTab.parentNode.insertBefore(
            temp.firstElementChild,
            referenceTab
        );
    }


    function insertLeaderboardsPane() {
        if (document.getElementById("leaderboards")) return;

        const tabContent = document.querySelector(".tab-content");
        if (!tabContent) return;

        const pane = document.createElement("div");
        pane.className = "tab-pane";
        pane.id = "leaderboards";
        pane.innerHTML = leaderboardsPaneHTML;

        tabContent.appendChild(pane);
    }


    function activateTab(tabId) {
        document.querySelectorAll(".rbx-tab.active")
            .forEach(t => t.classList.remove("active"));

        document.querySelectorAll(".tab-pane.active")
            .forEach(p => {
                p.classList.remove("active");
                p.hidden = true;
            });

        document
            .querySelector(`.rbx-tab a[href="#${tabId}"]`)
            ?.closest(".rbx-tab")
            ?.classList.add("active");

        const pane = document.getElementById(tabId);
        if (pane) {
            pane.hidden = false;
            pane.classList.add("active");
        }
    }


    document.addEventListener("click", e => {
        const tabLink = e.target.closest(".rbx-tab a[href^='#']");
        if (!tabLink) return;

        const targetId = tabLink.getAttribute("href").slice(1);
        if (!targetId) return;

        if (targetId === "leaderboards") {
            insertLeaderboardsPane();
        }

        activateTab(targetId);
    });

    document.addEventListener("click", e => {

        const icon = e.target.closest(".rbx-leaderboard-filter .icon-sorting");
        if (icon) {
            e.preventDefault();

            const popover = icon.closest(".rbx-leaderboard-filter")
                .querySelector(".popover");

            popover.classList.toggle("show");
            return;
        }

        const option = e.target.closest(".rbx-leaderboard-filter .dropdown-menu a");
        if (option) {
            e.preventDefault();

            const filter = option.closest(".rbx-leaderboard-filter");
            filter.querySelector(".rbx-leaderboard-filtername").textContent =
                option.textContent;

            filter.querySelector(".popover").classList.remove("show");
        }

    });


    const style = document.createElement("style");
    style.textContent = `
    .rbx-leaderboard-header {
        display:flex;
        justify-content:space-between;
        align-items:center;
        margin-bottom:6px;
    }
    .rbx-leaderboard-filter {
        position:relative;
        display:flex;
        gap:6px;
        font-size:13px;
    }
    .rbx-leaderboard-filter .popover {
        position:absolute;
        top:28px;
        left:48px;
        opacity:0;
        pointer-events:none;
        transition:opacity 120ms ease;
    }
    .rbx-leaderboard-filter .popover.show {
        opacity:1;
        pointer-events:auto;
    }
    #tab-leaderboards {
        width: 242.5px!important;
    }


    `;
    document.head.appendChild(style);


    const observer = new MutationObserver(() => {
        if (document.querySelector("#tab-store")) {
            insertLeaderboardsTab();
            observer.disconnect();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();
