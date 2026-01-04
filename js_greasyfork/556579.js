// ==UserScript==
// @name         GitHub → DeepWiki Button (Desktop + Mobile)
// @namespace    https://tampermonkey.net/
// @version      1.2
// @description  Add a DeepWiki button to GitHub repo pages (desktop & mobile)
// @author       Jackson
// @match        https://github.com/*/*
// @match        https://m.github.com/*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/556579/GitHub%20%E2%86%92%20DeepWiki%20Button%20%28Desktop%20%2B%20Mobile%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556579/GitHub%20%E2%86%92%20DeepWiki%20Button%20%28Desktop%20%2B%20Mobile%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function isRepoPage() {
        const parts = location.pathname.split("/");
        return parts.length >= 3 && parts[1] && parts[2];
    }

    function getRepoPath() {
        const p = location.pathname.split("/");
        return { owner: p[1], repo: p[2] };
    }

    function isPrivateRepo() {
        // Desktop badge
        const privateBadge =
            document.querySelector('h1 .Label--secondary') ||
            document.querySelector('[data-testid="repo-visibility"]');

        return privateBadge && privateBadge.innerText.includes("Private");
    }

    function insertButton() {
        if (!isRepoPage()) return;
        if (isPrivateRepo()) return;

        const { owner, repo } = getRepoPath();

        // Avoid duplicates
        if (document.getElementById("deepwiki-button")) return;

        const url = `https://deepwiki.com/${owner}/${repo}`;

        // Mobile GitHub (m.github.com)
        const isMobile = location.host.startsWith("m.") || window.innerWidth < 768;

        if (isMobile) {
            const mobileHeader = document.querySelector("header div:nth-child(1)");
            if (!mobileHeader) return;

            const btn = document.createElement("a");
            btn.id = "deepwiki-button";
            btn.href = url;
            btn.target = "_blank";
            btn.innerText = "DeepWiki";
            btn.style.marginLeft = "12px";
            btn.style.padding = "6px 10px";
            btn.style.border = "1px solid #0366d6";
            btn.style.borderRadius = "6px";
            btn.style.color = "#0366d6";
            btn.style.fontSize = "14px";
            btn.style.textDecoration = "none";

            mobileHeader.appendChild(btn);
            return;
        }

        // Desktop GitHub
        const actionBar =
            document.querySelector('ul.pagehead-actions') ||
            document.querySelector('div[data-view-component="true"].hx_pagehead-actions');

        if (!actionBar) return;

        const li = document.createElement("li");
        li.style.marginLeft = "8px";

        const a = document.createElement("a");
        a.id = "deepwiki-button";
        a.className = "btn btn-sm btn-primary";
        a.innerText = "Open in DeepWiki";
        a.href = url;
        a.target = "_blank";

        li.appendChild(a);

        // New GitHub UI uses <div>, old UI uses <ul>
        if (actionBar.tagName.toLowerCase() === "div") {
            actionBar.appendChild(li);
        } else {
            actionBar.insertBefore(li, actionBar.firstChild);
        }
    }

    // Initial load
    insertButton();

    // Desktop PJAX navigation
    document.addEventListener("pjax:end", insertButton);

    // Mobile URL changes (GitHub mobile uses SPA router)
    let lastUrl = location.href;
    setInterval(() => {
        if (lastUrl !== location.href) {
            lastUrl = location.href;
            setTimeout(insertButton, 300);
        }
    }, 300);

})();
