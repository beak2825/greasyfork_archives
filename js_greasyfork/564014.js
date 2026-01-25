// ==UserScript==
// @name         AtCoder この問題の提出一覧に移動
// @namespace    https://atcoder.jp/
// @version      2025-01-25
// @description  magurofly
// @author       You
// @match        https://atcoder.jp/contests/*/tasks/*
// @match        https://atcoder.jp/contests/*/submissions/*
// @match        https://atcoder.jp/contests/*/editorial/*
// @license      CC0-1.0 Universal
// @icon         https://www.google.com/s2/favicons?sz=64&domain=atcoder.jp
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/564014/AtCoder%20%E3%81%93%E3%81%AE%E5%95%8F%E9%A1%8C%E3%81%AE%E6%8F%90%E5%87%BA%E4%B8%80%E8%A6%A7%E3%81%AB%E7%A7%BB%E5%8B%95.user.js
// @updateURL https://update.greasyfork.org/scripts/564014/AtCoder%20%E3%81%93%E3%81%AE%E5%95%8F%E9%A1%8C%E3%81%AE%E6%8F%90%E5%87%BA%E4%B8%80%E8%A6%A7%E3%81%AB%E7%A7%BB%E5%8B%95.meta.js
// ==/UserScript==

window.addEventListener("load", () => {
    'use strict';

    function addSubmissionsByTaskLink(contest, task) {
        const links = [
            ["すべての提出（この問題）", "glyphicon glyphicon-globe", `/contests/${contest}/submissions?f.Task=${task}&f.LanguageName=&f.Status=&f.User=`],
            ["自分の提出（この問題）", "glyphicon glyphicon-user", `/contests/${contest}/submissions/me?f.Task=${task}&f.LanguageName=&f.Status=&f.User=`],
        ];
        const submissionDropdownMenu = document.querySelector("#contest-nav-tabs > ul > li:nth-child(5) > ul");
        const divider = submissionDropdownMenu.querySelector(".divider");

        const newDivider = document.createElement("li");
        newDivider.className = "divider";
        submissionDropdownMenu.insertBefore(newDivider, divider);
        for (const [text, className, link] of links) {
            const span = document.createElement("span");
            span.textContent = text;
            span.className = className;
            span.setAttribute("aria-hidden", "true");
            const a = document.createElement("a");
            a.href = link;
            a.appendChild(span);
            const li = document.createElement("li");
            li.appendChild(a);
            submissionDropdownMenu.insertBefore(li, divider);
        }
    }

    let match;
    if (match = /^\/contests\/([^\/?#]+)\/tasks\/([^\/?#]+)/.exec(location.pathname)) {
        addSubmissionsByTaskLink(match[1], match[2]);
    } else if (/^\/contests\/([^\/?#]+)\/submissions\/\d+/.test(location.pathname)) {
        const link = document.querySelector("#main-container > div.row > div:nth-child(2) > div:nth-child(8) > table > tbody > tr:nth-child(2) > td > a");
        match = /\/contests\/([^\/?#]+)\/tasks\/([^\/?#]+)/.exec(link.href);
        addSubmissionsByTaskLink(match[1], match[2]);
    } else if (/^\/contests\/([^\/?#]+)\/editorial\/\d+/.test(location.pathname)) {
        const link = document.querySelector("#main-container > div.row > div:nth-child(2) > h2 > a");
        match = /\/contests\/([^\/?#]+)\/tasks\/([^\/?#]+)/.exec(link.href);
        addSubmissionsByTaskLink(match[1], match[2]);
    }
});