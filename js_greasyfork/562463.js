// ==UserScript==
// @name        Redirect github-wiki-see.page to github.com
// @namespace   Violentmonkey Scripts
// @match       https://github-wiki-see.page/m/*
// @grant       none
// @version     1.0
// @author      binarynoise
// @description 12.1.2026, 23:58:06
// @license     EUPL 1.2
// @downloadURL https://update.greasyfork.org/scripts/562463/Redirect%20github-wiki-seepage%20to%20githubcom.user.js
// @updateURL https://update.greasyfork.org/scripts/562463/Redirect%20github-wiki-seepage%20to%20githubcom.meta.js
// ==/UserScript==

window.location.href = window.location.href.replace("https://github-wiki-see.page/m/", "https://github.com/");
