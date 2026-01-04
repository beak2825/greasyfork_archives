// ==UserScript==
// @name Discourse - 自动去模糊剧透
// @namespace https://github.com/utags
// @version 1.0.1
// @description 自动去模糊剧透。
// @author Pipecraft
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*.meta.discourse.org/*
// @match *://*.linux.do/*
// @match *://*.idcflare.com/*
// @match *://*.www.nodeloc.com/*
// @match *://*.meta.appinn.net/*
// @match *://*.community.openai.com/*
// @match *://*.community.cloudflare.com/*
// @match *://*.community.wanikani.com/*
// @match *://*.forum.cursor.com/*
// @match *://*.forum.obsidian.md/*
// @match *://*.forum-zh.obsidian.md/*
// @match *://*.www.uscardforum.com/*
// @downloadURL https://update.greasyfork.org/scripts/556933/Discourse%20-%20%E8%87%AA%E5%8A%A8%E5%8E%BB%E6%A8%A1%E7%B3%8A%E5%89%A7%E9%80%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/556933/Discourse%20-%20%E8%87%AA%E5%8A%A8%E5%8E%BB%E6%A8%A1%E7%B3%8A%E5%89%A7%E9%80%8F.meta.js
// ==/UserScript==

(function() {
let css = `
  .spoiler-blurred {
    filter: none !important;
  }
  .spoiler-blurred img {
    filter: none !important;
  }
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
