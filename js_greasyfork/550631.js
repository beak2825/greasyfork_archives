// ==UserScript==
// @name         WSJ Cross-Site Google Search
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Add floating button to search WSJ English <-> Chinese versions 在 WSJ 英文/中文页面添加浮动搜索按钮，快速在 Google 上搜索对应语言站点的文章（英文 ↔ 中文）。
// @author       vacuity
// @license      MIT
// @match        https://www.wsj.com/*
// @match        https://cn.wsj.com/*
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/550631/WSJ%20Cross-Site%20Google%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/550631/WSJ%20Cross-Site%20Google%20Search.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const isEnglishSite = location.hostname === "www.wsj.com";
    const isChineseSite = location.hostname === "cn.wsj.com";

    // Helper: safely parse utag_data
    function getUtagData() {
        try {
            const script = document.querySelector("script#utag_data_script");
            if (script && script.textContent.includes("window.utag_data")) {
                const match = script.textContent.match(/window\.utag_data\s*=\s*(\{.*\})/s);
                if (match) return JSON.parse(match[1]);
            }
        } catch (e) {
            console.error("Failed to parse utag_data", e);
        }
        return null;
    }

    // Helper: extract canonical slug
    function getSlug() {
        const canonical = document.querySelector("link[rel='canonical']");
        if (!canonical) return null;
        const url = canonical.href;
        return url.split("/").pop().split("-").slice(0, 4).join("-");
    }

    // Helper: extract authors
    function getAuthors() {
        const utag = getUtagData();
        if (utag && utag.article_author) {
            const rawAuthors = utag.article_author.replace(/\//g, "|");
            return rawAuthors
                .split("|")
                .map(a => a.trim())
                .filter(a => a.length > 0)
                .map(a => `"${a}"`);
        }
        return [];
    }

    // Create a styled floating button
    function createButton(label, color, bottomOffset, onClick) {
        const btn = document.createElement("button");
        btn.innerText = label;
        Object.assign(btn.style, {
            position: "fixed",
            bottom: `${bottomOffset}px`,
            right: "20px",
            zIndex: "9999",
            padding: "10px 15px",
            background: color,
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "14px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.3)"
        });
        btn.addEventListener("click", onClick);
        document.body.appendChild(btn);
        return btn;
    }

    // ===== English site: two buttons =====
    if (isEnglishSite) {
        const targetSite = "site:cn.wsj.com";
        const authors = getAuthors();
        const slug = getSlug();

        // Button 1: Search by Authors (past week)
        createButton("🔍 WSJ CN Search by Authors", "#0071c5", 70, () => {
            if (authors.length === 0) return alert("No author information found.");
            const authorString = authors.length > 1 ? "(" + authors.join(" ") + ")" : authors[0];
            const query = `${targetSite} ${authorString}`;
            const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}&tbs=qdr:w`;
            GM_openInTab(googleUrl, { active: true });
        });

        // Button 2: Search by Slug (no time range)
        createButton("🔍 WSJ CN Search by Slug", "#28a745", 20, () => {
            if (!slug) return alert("No canonical URL found.");
            const query = `${targetSite} ("${slug}")`;
            const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
            GM_openInTab(googleUrl, { active: true });
        });
    }

    // ===== Chinese site: single button (search EN by author) =====
    else if (isChineseSite) {
        const targetSite = "site:www.wsj.com";
        const authors = getAuthors();

        createButton("🔍 WSJ EN Search", "#d0021b", 20, () => {
            if (authors.length === 0) return alert("No author information found.");
            const authorString = authors.length > 1 ? "(" + authors.join(" ") + ")" : authors[0];
            const query = `${targetSite} ${authorString}`;
            const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
            GM_openInTab(googleUrl, { active: true });
        });
    }
})();