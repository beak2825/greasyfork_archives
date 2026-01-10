// ==UserScript==
// @name         Semprot Dark Mode + Remove Cosmetics
// @description  beautify
// @match        https://www.semprot.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=semprot.com
// @grant        GM_addStyle
// @version 0.0.1.20260110071035
// @namespace https://greasyfork.org/users/1558525
// @downloadURL https://update.greasyfork.org/scripts/562070/Semprot%20Dark%20Mode%20%2B%20Remove%20Cosmetics.user.js
// @updateURL https://update.greasyfork.org/scripts/562070/Semprot%20Dark%20Mode%20%2B%20Remove%20Cosmetics.meta.js
// ==/UserScript==
(function() {
    'use strict';
    const css = `
    /* footer */
div#semprotnenenmontok_f {
  display: none;
}
.warning {
  display: none;
}
.p-footer {
  background: #00000;
}
.p-footer {
  font-size: 13px;
  color: #ffffff;
  background: #0b4065;
}
/* reaction */
.reactionsBar {
  display: none;
  opacity: 0;
  -webkit-transition: all 0.25s ease, -xf-opacity 0.25s ease;
  transition: all 0.25s ease, -xf-opacity 0.25s ease;
  overflow-y: hidden;
  height: 0;
  -webkit-transition-property: all, -xf-height;
  transition-property: all, -xf-height;
  align-items: center;
  background: #050505;
  border: 1px solid #e0e0e0;
  border-left: 2px solid #6c6d6e;
  padding: 6px;
  font-size: 12px;
  margin-top: 6px;
}
/* gradient expand reply */
.bbCodeBlock-expandLink {
  display: none;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 75px;
  cursor: pointer;
  z-index: 100;
  background: transparent;
  background: linear-gradient(
    to bottom,
    rgba(245, 245, 245, 0) 0%,
    #000000 50%
  );
}
/* button post */
.bbWrapper a.link {
  color: #818181;
}
/* bg */
.p-pageWrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #4c4b4b;
}
/* bg post */
.myLiTS {
  background: #1a1a19;
}
/* font post */
.block--messages .message,
.block--messages .block-row {
  color: #ffffff;
  background: #fff;
  border-width: 1px;
  border-style: solid;
  border-top-color: #e0e0e0;
  border-right-color: #d6d6d6;
  border-bottom-color: #ccc;
  border-left-color: #d6d6d6;
  border-radius: 4px;
}
/* user-info */
.message-cell.message-cell--user,
.message-cell.message-cell--action {
  position: relative;
  background: #000000;
  border-right: 1px solid #ffffff;
  min-width: 0;
}
/* tag-item */
.tagItem {
  display: inline-block;
  max-width: 100%;
  padding: 0 6px 1px;
  margin: 0 0 2px;
  border-radius: 4px;
  font-size: 12px;
  color: #e4e4e4;
  background: #000000;
  border: 1px solid #d6d6d6;
}
/* nav paging */
.pageNav-page {
  display: table-cell;
  white-space: nowrap;
  border-width: 1px;
  border-style: solid;
  border-top-color: #e0e0e0;
  border-right-color: #d6d6d6;
  border-bottom-color: #ccc;
  border-left-color: #d6d6d6;
  font-size: 13px;
  color: #ffffff;
  text-decoration: none;
  background: #0a0a0a;
}
/* selected nav */
.pageNav-page.pageNav-page--current {
  color: #000000;
  background: #ffffff;
  border: 1px solid #000000;
  cursor: pointer;
}
/* title post */
html {
  font: 15px / 1.4 sans-serif;
  font-family: "Segoe UI", "Helvetica Neue", Helvetica, Roboto, Oxygen, Ubuntu,
    Cantarell, "Fira Sans", "Droid Sans", sans-serif;
  font-weight: 400;
  color: #ffffff;
  margin: 0;
  padding: 0;
  word-wrap: break-word;
  background-color: #fd0000;
  --js-display: block;
}
/* path text */
a,
.block-minorHeader,
.block-minorHeader a {
  color: #ffffff;
}
/* next */
.pageNav-jump {
  display: inline-block;
  white-space: nowrap;
  border-width: 1px;
  border-style: solid;
  border-top-color: #e0e0e0;
  border-right-color: #d6d6d6;
  border-bottom-color: #ccc;
  border-left-color: #d6d6d6;
  font-size: 13px;
  color: #ffffff;
  text-decoration: none;
  background: #000000;
  border-radius: 2px;
  padding: 5px 8px;
}
.pageNav-jump:hover,
.pageNav-jump:active {
  background: #ffffff;
  color: #0f0f0f;
  text-decoration: none;
}
/* reply bg */
.block--messages .message,
.block--messages .block-row {
  color: #fff4f4;
  background: #1a1a19;
  border-width: 1px;
  border-style: solid;
  border-top-color: #e0e0e0;
  border-right-color: #d6d6d6;
  border-bottom-color: #ccc;
  border-left-color: #d6d6d6;
  border-radius: 4px;
}
/* reply quoted name */
.bbCodeBlock-title {
  padding: 6px 10px;
  font-size: 13px;
  color: #ffffff;
  background: #000000;
}
/* bb reply msg */
.bbCodeBlock {
  display: flow-root;
  margin: 0.5em 0;
  background: #1a1a19;
  border: 1px solid #ffffff;
  border-left: 3px solid #ffffff;
}
/* reply container bottom */
.block-container {
  color: #ffffff;
  background: #1a1a19;
  border-width: 1px;
  border-style: solid;
  border-top-color: #e0e0e0;
  border-right-color: #d6d6d6;
  border-bottom-color: #ccc;
  border-left-color: #d6d6d6;
  border-radius: 4px;
}
/* nav */
.p-nav {
  background: #000000;
}
/* remove ads */
.notices {
  display: none;
  list-style: none;
  margin: 0;
  padding: 0;
}
/* remove padding top */
.semprotnenenmontok_adalah_pujaan_hatiku {
  display: none;
}
/* remove iklan contact */
element.style {
  display: none;
  background-color: rgb(0, 0, 0);
  color: rgb(255, 255, 255);
  font-size: 0.7em;
  margin-bottom: 0.3em;
  padding: 0.2em;
  text-align: center;
}
/* header liner */
.p-header {
  background: #000000;
}
/* topsection */
.p-sectionLinks {
  font-size: 13px;
  background: #f5f5f5;
  border-bottom: 1px solid #ccc;
  color: #000000;
}
`
    GM_addStyle(css);
})();