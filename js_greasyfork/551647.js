// ==UserScript==
// @name        Kemono Fixer
// @namespace   DKKKNND
// @license     WTFPL
// @match       https://kemono.cr/*
// @match       https://coomer.st/*
// @grant       GM_registerMenuCommand
// @grant       GM_unregisterMenuCommand
// @grant       GM_setValue
// @grant       GM_getValue
// @version     1.51
// @author      Kaban
// @description Allow you to blacklist creators on Kemono, and more.
// @downloadURL https://update.greasyfork.org/scripts/551647/Kemono%20Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/551647/Kemono%20Fixer.meta.js
// ==/UserScript==
(function() {
"use strict";

// ==<TO-DO>==
// 1. collect user name and display below header, allow adding custom tags
// ==</TO-DO>==

// ==<Options>==
const OPTIONS = {
  "allow_wide_post_cards": true,
  "sort_posts_by_publish_date": true,
  "hide_posts_with_no_thumbnail": true,
  "hide_posts_from_blacklisted_creators": true,
  "hide_posts_shown_on_previous_pages": true,
  "auto_next_page_if_none_shown": false,
  "remove_video_section_from_post_body": false,
  "remove_duplicate_files_from_post": true,
};
readOptions(OPTIONS, "OPTIONS");

const ADVANCED_OPTIONS = {
  "dont_allow_grid_auto_flow": false,
  "highlight_group_0_name": "Highlight",
  "highlight_group_1_name": "Red",
  "highlight_group_1_rgb": "195 0 0",
  "highlight_group_2_name": "Green",
  "highlight_group_2_rgb": "0 153 5",
  "highlight_group_3_name": "Blue",
  "highlight_group_3_rgb": "0 72 203",
  "auto_next_page_delay": 5000,
  "post_duplicate_files_keep_first": false,
  "copy_post_folder_name_template": "[{published}] {title}",
  "copy_creator_folder_name_template": "[{creator}] {service}",
  "copy_post_file_links_template": "#{index}_{filename}&t={title}&s={service}&c={creator}&p={published}",
  "copy_post_attachment_links_template": "#{filename}&t={title}&s={service}&c={creator}&p={published}",
};
readOptions(ADVANCED_OPTIONS, "ADVANCED_OPTIONS");

let BLACKLIST_MODE = false;
let BLACKLIST = JSON.parse(GM_getValue("BLACKLIST", "{}"));
let HIGHLIGHT_1 = JSON.parse(GM_getValue("HIGHLIGHT_1", "{}"));
let HIGHLIGHT_2 = JSON.parse(GM_getValue("HIGHLIGHT_2", "{}"));
let HIGHLIGHT_3 = JSON.parse(GM_getValue("HIGHLIGHT_3", "{}"));

function readOptions(defaults, storedKey) {
  const read = JSON.parse(GM_getValue(storedKey, "{}"));
  Object.keys(read).forEach(key => {
    if (defaults.hasOwnProperty(key)) defaults[key] = read[key];
  });
}
// ==</Options>==

// ==<Helper Functions>==
function gOne(id) {
  return document.getElementById(id);
}
function qOne(selector) {
  return document.querySelector(selector);
}
Element.prototype.qOne = function(selector) {
  return this.querySelector(selector);
};
function qAll(selector) {
  const results = document.querySelectorAll(selector);
  return results.length === 0 ? null : results;
}
Element.prototype.qAll = function(selector) {
  const results = this.querySelectorAll(selector);
  return results.length === 0 ? null : results;
};
function createKfElement(type, id = null, content = null) {
  const element = document.createElement(type);
  if (id) {
    element.id = `kf-${id}`;
    const oldElement = gOne(element.id);
    if (oldElement) oldElement.remove();
  }
  if (content) element.textContent = content;
  return element;
}
function createKfElementClass(type, className = null, value = null, content = null) {
  const element = document.createElement(type);
  if (className) element.classList.add(`kf-${className}`);
  if (value) element.value = value;
  if (content) element.textContent = content;
  return element;
}
function kfExist(id) {
  const element = gOne(`kf-${id}`);
  if (!element) return false;
  if (element.getKfAttr("href") === window.location.href) return true;
  element.remove();
  return false;
}
function kfExistByPath(id, segmentId = 0) {
  const element = gOne(`kf-${id}`);
  if (!element) return false;
  if (segmentId > 0) {
    if (element.getKfAttr("segment") === window.location.pathname.split('/')[segmentId]) return true;
  } else {
    if (element.getKfAttr("pathname") === window.location.pathname) return true;
  }
  element.remove();
  return false;
}
HTMLElement.prototype.addKfClass = function(className) {
  return this.classList.add(`kf-${className}`);
};
HTMLElement.prototype.removeKfClass = function(className) {
  return this.classList.remove(`kf-${className}`);
};
HTMLElement.prototype.setKfAttr = function(attributeName, value) {
  return this.setAttribute(`data-kf-${attributeName}`, value);
};
HTMLElement.prototype.getKfAttr = function(attributeName) {
  return this.getAttribute(`data-kf-${attributeName}`);
};
HTMLElement.prototype.getDataAttr = function(attributeName) {
  return this.getAttribute(`data-${attributeName}`);
};
HTMLElement.prototype.hasClass = function(className) {
  return this.classList.contains(className);
};
HTMLElement.prototype.cloneKfNode = function(id = null) {
  const clonedNode = this.cloneNode(true);
  if (id) clonedNode.id = `kf-${id}`;
  clonedNode.querySelectorAll("[id]").forEach(node => {
    node.id = `kf-${node.id}`;
  });
  return clonedNode;
};
// ==</Helper Functions>==

// ==<Mutation Observer>==
function onMutation(mutations, observer) {
  // stop observer before DOM manipulation
  observer.disconnect();
  // dispatch
  updatePageInfo();
  updateStyle();
  updateScriptMenu();
  fixPage();
  // restart observer
  observer.observe(document.body, { childList: true, subtree: true });
}

const observer = new MutationObserver(onMutation);
observer.observe(document.body, { childList: true, subtree: true });
// ==</Mutation Observer>==

// ==<Shared Info>==
let pageInfo = {};
function updatePageInfo() {
  if (pageInfo.href === window.location.href) return;
  pageInfo = {};
  const pathname = window.location.pathname;
  if (pathname === "/posts") {
    pageInfo.pageType = "Posts";

  } else if (pathname === "/posts/popular") {
    pageInfo.pageType = "Popular Posts";

  } else {
    const segments = pathname.split('/').filter(segment => segment);
    if (segments[1] === "user") {
      pageInfo.creatorKey = `${segments[0]}-${segments[2]}`;

      if (segments.length === 3) {
        // {service}/user/{user_id}
        pageInfo.pageType = "Creator Posts";
        
      } else if (segments[3] === "post") {
        if (segments.length === 5 || segments.length === 7 && segments[5] === "revision" ) {
          // {service}/user/{user_id}/post/{post_id}
          // {service}/user/{user_id}/post/{post_id}/revision/{revision_id}
          pageInfo.pageType = "Post Details";
        }
      }
    } else if (segments.length === 4 && segments[0] === "discord") {
      // discord/server/{server_id}/{room_id}
      pageInfo.pageType = "Discord";
    }
  }
  pageInfo.href = window.location.href;
}
// ==</Shared Info>==

// ==<Style>==
const CSS = {};
CSS.posts = `#kf-post_cards_container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  grid-auto-flow: row${ADVANCED_OPTIONS.dont_allow_grid_auto_flow ? "" : " dense"};
  grid-auto-rows: 1fr;
  gap: 5px;
  padding: 0 5px;
  align-items: center;
  justify-content: center;
  text-align: left; /* fix for popular posts page */
}
.card-list {
  container-type: inline-size;
  container-name: post_card_container_parent;
}
@container post_card_container_parent (min-width: 1845px) {
  #kf-post_cards_container {
    grid-template-columns: repeat(10, 1fr);
  }
}
#kf-post_cards_container article {
  aspect-ratio: 2/3;
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 2px 2px #000);
}
.kf-wide_card {
  grid-column: span 2;
  height: 100%;
}
#kf-post_cards_container .kf-wide_card article {
  aspect-ratio: 365/270; /* only used when there's not a single narrow card */
}
article a {
  border: 0;
}
.post-card__image-container {
  overflow: hidden;
}
.post-card__image {
  opacity: 0;
  transition: opacity 0.5s ease-out, filter 0.5s ease-out;
}
.kf-no_thumbnail footer::before {
  content: "No Thumbnail";
}
.kf-blacklisted .post-card__image {
  filter: blur(10px);
}
.kf-blacklisted header {
  filter: blur(3px);
}
.kf-blacklisted:hover .post-card__image,
.kf-blacklisted:hover header {
  filter: blur(0);
}
.kf-card[data-kf-highlight-group="group1"] a {
  border: solid 1px rgb(${ADVANCED_OPTIONS.highlight_group_1_rgb});
}
.kf-card[data-kf-highlight-group="group1"] header,
.kf-card[data-kf-highlight-group="group1"] footer,
.kf-card[data-kf-highlight-group="group1"] select,
.kf-card[data-kf-highlight-group="group1"] .kf-highlight_comment_button {
  background: rgb(${ADVANCED_OPTIONS.highlight_group_1_rgb} / .6);
}
.kf-card[data-kf-highlight-group="group1"] .kf-highlight_comment_button:hover {
  background: rgb(${ADVANCED_OPTIONS.highlight_group_1_rgb} / .4);
}
.kf-card[data-kf-highlight-group="group2"] a {
  border: solid 1px rgb(${ADVANCED_OPTIONS.highlight_group_2_rgb});
}
.kf-card[data-kf-highlight-group="group2"] header,
.kf-card[data-kf-highlight-group="group2"] footer,
.kf-card[data-kf-highlight-group="group2"] select,
.kf-card[data-kf-highlight-group="group2"] .kf-highlight_comment_button {
  background: rgb(${ADVANCED_OPTIONS.highlight_group_2_rgb} / .6);
}
.kf-card[data-kf-highlight-group="group2"] .kf-highlight_comment_button:hover {
  background: rgb(${ADVANCED_OPTIONS.highlight_group_2_rgb} / .4);
}
.kf-card[data-kf-highlight-group="group3"] a {
  border: solid 1px rgb(${ADVANCED_OPTIONS.highlight_group_3_rgb});
}
.kf-card[data-kf-highlight-group="group3"] header,
.kf-card[data-kf-highlight-group="group3"] footer,
.kf-card[data-kf-highlight-group="group3"] select,
.kf-card[data-kf-highlight-group="group3"] .kf-highlight_comment_button {
  background: rgb(${ADVANCED_OPTIONS.highlight_group_3_rgb} / .6);
}
.kf-card[data-kf-highlight-group="group3"] .kf-highlight_comment_button:hover {
  background: rgb(${ADVANCED_OPTIONS.highlight_group_3_rgb} / .4);
}
.kf-already_shown {
  opacity: .5;
}
.kf-already_shown:hover {
  opacity: 1;
}
#kf-no_thumbnail_msg,
#kf-blacklisted_msg,
#kf-already_shown_msg {
  display: none;
}
.kf-blacklist_control {
  z-index: 1;
  position: absolute;
  width: 100%;
  height: 100%;
  display: none;
  justify-content: center;
  align-items: center;
  cursor: default;
}
.kf-blacklist_control input {
  border: none;
  border-radius: 5px;
  margin: 5px 0;
  height: 30px;
  font-size: 15px;
  font-weight: bold;
  background: #000000;
  color: white;
}
.kf-blacklist_control input:hover {
  background: #222222;
  cursor: pointer;
}
.kf-blacklisted .kf-blacklist_control input {
  background: #666666;
}
.kf-blacklisted .kf-blacklist_control input:hover {
  background: #707070;
}
.kf-blacklist_comment_button,
.kf-unblacklist_button {
  display: none;
}
.kf-blacklisted .kf-blacklist_comment_button,
.kf-blacklisted .kf-unblacklist_button {
  display: block;
}
.kf-blacklisted .kf-blacklist_button {
  display: none;
}
.kf-blacklist_control select {
  margin: 5px 0;
  height: 30px;
  font-size: 15px;
  font-weight: bold;
}
.kf-highlight_comment_button{
  display: none;
}
.kf-card[data-kf-highlight-group="group1"] .kf-highlight_comment_button,
.kf-card[data-kf-highlight-group="group2"] .kf-highlight_comment_button,
.kf-card[data-kf-highlight-group="group3"] .kf-highlight_comment_button {
  display: block;
}
/* disable hover effect on mobile */
@media (hover: none) and (pointer: coarse) {
  menu > a.pagination-button-current:hover {
    background: var(--anchor-internal-color2-primary) !important;
    color:var(--anchor-internal-color1-secondary) !important;
  }
  menu > a:hover {
    background: transparent !important;
    color:var(--color0-secondary) !important;
  }
}`;
CSS.hideNoThumbnail = `.kf-no_thumbnail { display: none; }
#kf-no_thumbnail_msg { display: block !important; }`;
CSS.hideBlacklisted = `.kf-blacklisted { display: none; }
#kf-blacklisted_msg { display: block !important; }`;
CSS.hideAlreadyShown = `.kf-already_shown { display: none; }
#kf-already_shown_msg { display: block !important; }`;
CSS.blacklistMode = `.kf-blacklist_control {
  display: flex !important;
  flex-direction: column;
}
.kf-blacklisted .post-card__image {
  filter: blur(10px) !important;
}
.kf-blacklisted header {
  filter: blur(3px) !important;
}`;
CSS.postDetails = `#kf-post_body {
  border-left: solid hsl(0,0%,50%) 0.125em;
  border-right: solid hsl(0,0%,50%) 0.125em;
  padding: 0.5em;
  container-type: inline-size;
  container-name: post_files_parent;
}
#kf-post_attachments {
  list-style: none;
  padding: .5em;
  margin: 0;
}
#kf-post_attachments li {
  padding: .25em 0;
}
#kf-post_files {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 5px;
  justify-content: center;
}
@container post_files_parent (min-width: 725px) {
  #kf-post_files {
    grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  }
}
#kf-post_files div {
  background-image: repeating-conic-gradient(var(--color1-secondary) 0% 25%, transparent 0% 50%);
  background-size: 20px 20px;
}
#kf-post_files a {
  display: block;
  width: 100%;
  height: 100%;
  padding: 0;
  border: none;
  background: unset;
}
#kf-post_files img {
  display: block;
  width: 100%;
  height: 100%;
  max-height: 800px;
  object-fit: contain;
  opacity: 0;
  transition: opacity 0.5s ease-out, filter 0.5s ease-out;
}
.kf-wide_thumb {
  grid-column: span 2;
}
#kf-post_files .kf-embed_view_container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.kf-embed_view {
  background: var(--color1-secondary);
  padding: .5em;
}
`;

function updateStyle() {
  switch (pageInfo.pageType) {
    case "Posts":
    case "Popular Posts":
    case "Creator Posts":
      addStyle(CSS.posts);
      if (OPTIONS.hide_posts_with_no_thumbnail) {
        addStyle(CSS.hideNoThumbnail, "hide_no_thumbnail");
      } else {
        removeStyle("hide_no_thumbnail");
      }
      if (OPTIONS.hide_posts_from_blacklisted_creators) {
        addStyle(CSS.hideBlacklisted, "hide_blacklisted");
      } else {
        removeStyle("hide_blacklisted");
      }
      if (OPTIONS.hide_posts_shown_on_previous_pages) {
        addStyle(CSS.hideAlreadyShown, "hide_already_shown");
      } else {
        removeStyle("hide_already_shown");
      }
      if (BLACKLIST_MODE) {
        addStyle(CSS.blacklistMode, "blacklist_mode");
        removeStyle("hide_blacklisted");
      } else {
        removeStyle("blacklist_mode");
        if (OPTIONS.hide_posts_from_blacklisted_creators) {
          addStyle(CSS.hideBlacklisted, "hide_blacklisted");
        }
      }
      break;
    case "Post Details":
      removeStyle("hide_no_thumbnail");
      removeStyle("hide_blacklisted");
      removeStyle("hide_already_shown");
      addStyle(CSS.postDetails);
      break;
    case "Discord":
    default:
      removeStyle("hide_no_thumbnail");
      removeStyle("hide_blacklisted");
      removeStyle("hide_already_shown");
      removeStyle();
      break;
  }
}

function addStyle(css, id = "style") {
  if (kfExist(id)) return;
  const style = createKfElement("style", id, css);
  style.setKfAttr("href", window.location.href);
  document.head.append(style);
}

function removeStyle(id = "style") {
  const style = gOne(`kf-${id}`);
  if (style) style.remove();
}
// ==</Style>==

// ==<Script Menu>==
function updateScriptMenu() {
  const scriptMenuFlag = createKfElement("div", "script_menu_flag");

  switch (pageInfo.pageType) {
    case "Posts":
    case "Popular Posts":
      if (kfExistByPath("script_menu_flag")) return;
      removeAllMenuCommand();

      updateMenuCommand("Allow Wide Post Cards",
        "allow_wide_post_cards", true);
      updateMenuCommand("Sort Posts by Publish Date",
        "sort_posts_by_publish_date", true);
      updateMenuCommand("Hide Posts with No Thumbnail",
        "hide_posts_with_no_thumbnail", false);
      updateMenuCommand("Hide Posts from Blacklisted Creators",
        "hide_posts_from_blacklisted_creators", false);
      updateMenuCommand("Hide Posts Shown on Previous Pages",
        "hide_posts_shown_on_previous_pages", false);
      addMenuSeparator();
      GM_registerMenuCommand(
        "★ Blacklist / Highlight Mode", blacklistMode, { id: "blacklistMode" });
      GM_registerMenuCommand(
        "⚙ Advanced Options", advancedOptions, { id: "advancedOptions" });

      scriptMenuFlag.setKfAttr("pathname", window.location.pathname);
      break;
    case "Creator Posts":
      if (kfExistByPath("script_menu_flag")) return;
      removeAllMenuCommand();

      updateMenuCommand("Allow Wide Post Cards",
        "allow_wide_post_cards", true);
      updateMenuCommand("Sort Posts by Publish Date",
        "sort_posts_by_publish_date", true);
      updateMenuCommand("Hide Posts with No Thumbnail",
        "hide_posts_with_no_thumbnail", false);
      updateMenuCommand("Hide Posts Shown on Previous Pages",
        "hide_posts_shown_on_previous_pages", false);
      addMenuSeparator();
      GM_registerMenuCommand(
        "★ Blacklist / Highlight Mode", blacklistMode, { id: "blacklistMode" });
      GM_registerMenuCommand(
        "⚙ Advanced Options", advancedOptions, { id: "advancedOptions" });

      scriptMenuFlag.setKfAttr("pathname", window.location.pathname);
      break;
    case "Post Details":
      if (kfExistByPath("script_menu_flag", 3)) return;
      removeAllMenuCommand();

      updateMenuCommand("Allow Wide File Thumbnails",
        "allow_wide_post_cards", true);
      updateMenuCommand("Remove Duplicate Post Files",
        "remove_duplicate_files_from_post", true);
      updateMenuCommand("Remove Videos Section",
        "remove_video_section_from_post_body", true);
      addMenuSeparator();
      GM_registerMenuCommand(
        "⚙ Advanced Options", advancedOptions, { id: "advancedOptions" });

      scriptMenuFlag.setKfAttr("segment", window.location.pathname.split('/')[3]);
      break;
    case "Discord":
    default:
      if (kfExist("script_menu_flag")) return;
      removeAllMenuCommand();
      GM_registerMenuCommand(
        "⚙ Advanced Options", advancedOptions, { id: "advancedOptions" });

      scriptMenuFlag.setKfAttr("href", window.location.href);
  }
  document.body.appendChild(scriptMenuFlag);
}

function removeAllMenuCommand() {
  GM_unregisterMenuCommand("allow_wide_post_cards");
  GM_unregisterMenuCommand("sort_posts_by_publish_date");
  GM_unregisterMenuCommand("hide_posts_with_no_thumbnail");
  GM_unregisterMenuCommand("hide_posts_from_blacklisted_creators");
  GM_unregisterMenuCommand("hide_posts_shown_on_previous_pages");
  GM_unregisterMenuCommand("remove_duplicate_files_from_post");
  GM_unregisterMenuCommand("remove_video_section_from_post_body");
  GM_unregisterMenuCommand("separator");
  GM_unregisterMenuCommand("blacklistMode");
  GM_unregisterMenuCommand("advancedOptions");
}

function addMenuSeparator() {
  GM_registerMenuCommand("---------------------------------------",
    null, { id: "separator", autoClose: false }
  );
}

function updateMenuCommand(menuName, optionName, reloadPage = false) {
  GM_registerMenuCommand(`${OPTIONS[optionName] ? "☑" : "☐"} ${menuName}`,
    () => {
      toggleOption(optionName, menuName, reloadPage);
    }, {
      id: optionName,
      title: `${menuName}${reloadPage ? " (Reloads current page)" : ""}`
    }
  );
}

function toggleOption(optionName, menuName, reloadPage) {
  OPTIONS[optionName] = !OPTIONS[optionName];
  updateMenuCommand(menuName, optionName, reloadPage);
  GM_setValue("OPTIONS", JSON.stringify(OPTIONS));
  if (reloadPage) {
    window.location.reload();
  } else {
    updateStyle();
  }
}

function blacklistMode() {
  BLACKLIST_MODE = !BLACKLIST_MODE;
  updateStyle();
  if (BLACKLIST_MODE) {
    GM_registerMenuCommand(
      "☆ Exit Blacklist / Highlight Mode", blacklistMode, { id: "blacklistMode" });
  } else {
    GM_registerMenuCommand(
      "★ Blacklist / Highlight Mode", blacklistMode, { id: "blacklistMode" });
  }
}

function advancedOptions() {
  if (kfExist("advanced_options")) return;

  const advancedOptionsPage = createKfElement("div", "advanced_options");
  advancedOptionsPage.innerHTML = `<style>#kf-advanced_options {
  z-index: 99;
  position: fixed;
  overflow-y: auto;
  overscroll-behavior-y: contain;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, .8);
  backdrop-filter: blur(10px);
  line-height: 1.5em;
}
#kf-advanced_options_header {
  top: 0;
  position: sticky;
  padding: 10px;
  background: rgba(0, 0, 0, .8);
}
#kf-advanced_options form {
  padding: 10px;
}
#kf-advanced_options input[type="text"] {
  width: 100%;
}
#kf-advanced_options input[type="button"] {
  margin: 5px 0;
}</style>
<div id="kf-advanced_options_header">
  <h2>KF Advanced Options</h2>
  <input type="button" value="Save and Reload">
  <input type="button" value="Discard Changes">
  <br><label>(Put "reset" in any text field to restore default)</label>
</div>
<form>
  <fieldset>
    <legend>Blacklist / Highlight List</legend>
    <input type="button" value="Export to Clipboard">
    <input type="button" value="Import from Clipboard">
  </fieldset>
  <fieldset>
    <legend>Highlight Groups</legend>
    <table>
      <tr>
        <td>None</td>
        <td><input type="text" id="highlight_group_0_name"></td>
        <td>(color: r g b)</td>
      </tr>
      <tr>
        <td>Group 1</td>
        <td><input type="text" id="highlight_group_1_name"></td>
        <td><input type="text" id="highlight_group_1_rgb"></td>
      </tr>
      <tr>
        <td>Group 2</td>
        <td><input type="text" id="highlight_group_2_name"></td>
        <td><input type="text" id="highlight_group_2_rgb"></td>
      </tr>
      <tr>
        <td>Group 3</td>
        <td><input type="text" id="highlight_group_3_name"></td>
        <td><input type="text" id="highlight_group_3_rgb"></td>
      </tr>
    </table>
  </fieldset>
  <fieldset>
    <legend>Posts Page</legend>
    <input type="checkbox" id="dont_allow_grid_auto_flow">
    <label for="dont_allow_grid_auto_flow">Don't Allow grid-auto-flow
    <br>When "Allow Wide Post Cards" is enabled, latter post cards may move forward to fill in the gaps. Enable this option to leave the gaps unfilled if you wish the post cards to be strictly ordered.</label>
  </fieldset>
  <fieldset>
    <legend>Post Details Page</legend>
    <input type="checkbox" id="post_duplicate_files_keep_first">
    <label for="post_duplicate_files_keep_first"><b>Keep First Duplicate File</b>
    <br>When "Remove Duplicate Post Files" is enabled, by default the last one of the duplicates is kept. Enable this option if you wish to keep the first file and ignore latter duplicates. The first file is usually used as post thumbnail, and could be a copy of a latter one in sequence, hense the default to keep last one.</label>
    <br><br>
    <label for="copy_post_folder_name_template"><b>Post Folder Name Template:</b></label>
    <input type="text" id="copy_post_folder_name_template">
    <label for="copy_post_folder_name_template"><b>Creator Folder Name Template:</b></label>
    <input type="text" id="copy_creator_folder_name_template">
    <label>When you click on the title or the service name after it, a string ready to be used as Windows folder name is copied to the clipboard. Set empty to disable this feature.
    <br>Variables: {title} {service} {creator} {published}</label>
    <br><br>
    <label for="copy_post_attachment_links_template"><b>Post Attachment Links Template:</b></label>
    <input type="text" id="copy_post_attachment_links_template">
    <label for="copy_post_file_links_template"><b>Post File Links Template:</b></label>
    <input type="text" id="copy_post_file_links_template">
    <label>When you click on "Downloads" or Files", all download links are copied to the clipboard, with the above template appended to the end. Set empty to copy original links.
    <br>Variables: {index} (file links only) | {filename} {title} {service} {creator} {published}</label>
  </fieldset>
</form>`;
  const buttons = advancedOptionsPage.qAll(`input[type="button"]`);
  buttons[0].addEventListener("click", saveAdvancedOptions);
  buttons[1].addEventListener("click", discardAdvancedOptions);
  buttons[2].addEventListener("click", exportAllLists);
  buttons[3].addEventListener("click", importAllLists);
  advancedOptionsPage.setKfAttr("href", window.location.href);
  document.body.prepend(advancedOptionsPage);
  readAdvancedOptions();
}

function readAdvancedOptions() {
  Object.keys(ADVANCED_OPTIONS).forEach(key => {
    const element = gOne(key);
    if (!element) return; // "return" in forEach is continue
    const value = ADVANCED_OPTIONS[key];
    switch (typeof value) {
      case "boolean":
        if (value) element.checked = true;
        break;
      case "string":
        element.value = value;
        break;
    }
  });
}

function saveAdvancedOptions(event) {
  Object.keys(ADVANCED_OPTIONS).forEach(key => {
    const element = gOne(key);
    if (!element) return;
    const value = ADVANCED_OPTIONS[key];
    switch (typeof value) {
      case "boolean":
        ADVANCED_OPTIONS[key] = element.checked;
        break;
      case "string":
        const newValue = element.value;
        if (newValue.trim().toLowerCase() === "reset") {
          delete ADVANCED_OPTIONS[key];
        } else {
          ADVANCED_OPTIONS[key] = newValue;
        }
    }
  });
  GM_setValue("ADVANCED_OPTIONS", JSON.stringify(ADVANCED_OPTIONS));
  gOne("kf-advanced_options").remove();
  alert("Advanced options saved.\nThe page will reload to apply the changes.")
  window.location.reload();
}

function discardAdvancedOptions(event) {
  gOne("kf-advanced_options").remove();
}

function exportAllLists() {
  if (!confirm("Do you want to export all lists to clipboard?")) return;
  setTimeout(copyToClipboard, 500); // wait for confirm() to close and return focus
}

function importAllLists() {
  if (!confirm("Do you want to import all lists from clipboard?\nAll existing entries will be overwritten!")) return;
  setTimeout(readFromClipboard, 500);
}

async function copyToClipboard() {
  const exportJSON = [];
  const blacklistJSON = getAlignedJSON("blacklist", BLACKLIST);
  if (blacklistJSON) exportJSON.push(blacklistJSON);
  const highlight1JSON = getAlignedJSON("highlight_1", HIGHLIGHT_1);
  if (highlight1JSON) exportJSON.push(highlight1JSON);
  const highlight2JSON = getAlignedJSON("highlight_2", HIGHLIGHT_2);
  if (highlight2JSON) exportJSON.push(highlight2JSON);
  const highlight3JSON = getAlignedJSON("highlight_3", HIGHLIGHT_3);
  if (highlight3JSON) exportJSON.push(highlight3JSON);

  if (exportJSON.length === 0) {
    alert("All lists are empty, nothing to export.");
    return;
  }
  try {
    await navigator.clipboard.writeText(`{
${exportJSON.join(",\n")}
}`);
    alert("All lists copied to clipboard as JSON.");
  } catch (error) {
    alert(`Copy to clipboard failed:\n${error.message}`);
  }
}

function getAlignedJSON(keyString, object) {
  const keys = Object.keys(object);
  if (keys.length === 0) return null;

  let maxKeyLength = 0;
  for (let i = 0; i < keys.length; i++) {
    const keyLength = keys[i].length;
    if (keyLength > maxKeyLength) maxKeyLength = keyLength;
  }

  const lines = [];
  const entries = Object.entries(object);
  for (let i = 0; i < entries.length; i++) {
    const keyLength = entries[i][0].length;
    const padding = " ".repeat(maxKeyLength - keyLength);
    lines.push(`    "${entries[i][0]}"${padding} : "${entries[i][1]}",`);
  }
  return `  "${keyString}" : {
${lines.join("\n").slice(0, -1)}
  }`;
}

async function readFromClipboard() {
  try {
    const rawClipboard = await navigator.clipboard.readText();
    if (!rawClipboard) {
      alert("Clipboard read empty.\n(Permission denied?)");
      return;
    }
    let object;
    if (rawClipboard.startsWith('{')) {
      object = JSON.parse(rawClipboard);
    } else {
      object = readOldData(rawClipboard); // backward compatibility
    }
    if (Object.keys(object).length === 0) {
      const message = "Found no valid entry in clipboard.\nEnter \"clear\" to clear ALL lists.";
      if (prompt(message, "")?.toLowerCase() === "clear") {
        BLACKLIST = {};
        HIGHLIGHT_1 = {};
        HIGHLIGHT_2 = {};
        HIGHLIGHT_3 = {};
        GM_setValue("BLACKLIST", "{}");
        GM_setValue("HIGHLIGHT_1", "{}");
        GM_setValue("HIGHLIGHT_2", "{}");
        GM_setValue("HIGHLIGHT_3", "{}");
        alert("All lists cleared.");
      } else {
        alert("Import aborted.");
      }
      return;
    }
    BLACKLIST = object["blacklist"] || {};
    HIGHLIGHT_1 = object["highlight_1"] || {};
    HIGHLIGHT_2 = object["highlight_2"] || {};
    HIGHLIGHT_3 = object["highlight_3"] || {};
    GM_setValue("BLACKLIST", JSON.stringify(BLACKLIST));
    GM_setValue("HIGHLIGHT_1", JSON.stringify(HIGHLIGHT_1));
    GM_setValue("HIGHLIGHT_2", JSON.stringify(HIGHLIGHT_2));
    GM_setValue("HIGHLIGHT_3", JSON.stringify(HIGHLIGHT_3));
    alert("All lists imported from clipboard.\nThe page will reload to apply the changes.")
    window.location.reload();
  } catch (error) {
    alert(`Read from clipboard failed:\n${error.message}`);
  }
}

function readOldData(input) {
  const object = {};
  const lines = input.split('\n');
  const regex = /"([^"]+)"[,\s]*\/\/\s*(.*?)\s*$/;

  let keyString = "blacklist";
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith("const highlight_group_1")) {
      keyString = "highlight_1";
      continue;
    }
    if (lines[i].startsWith("const highlight_group_2")) {
      keyString = "highlight_2";
      continue;
    }
    if (lines[i].startsWith("const highlight_group_3")) {
      keyString = "highlight_3";
      continue;
    }
    if (lines[i].startsWith("const custom_header")) {
      // not implemented
      break;
    }
    const match = lines[i].match(regex);
    if (match) {
      if (!object[keyString]) object[keyString] = {};
      object[keyString][match[1]] = match[2];
    }
  }
  return object;
}
// ==</Script Menu>==

// ==<Page Fixing Functions>==
function fixPage() {
  switch (pageInfo.pageType) {
    case "Posts":
    case "Popular Posts":
    case "Creator Posts":
      fixPosts();
      break;
    case "Post Details":
      fixPostDetails();
      break;
    case "Discord":
      // fixDiscord();
      break;
  }
}

function fixPosts() {
  if (kfExist("post_cards_container")) return;

  const srcPostCardContainer = qOne(".card-list__items");
  if (!srcPostCardContainer) return;
  const srcPostCards = srcPostCardContainer.qAll(".post-card");
  if (!srcPostCards) return;

  // reset all page buttons active state
  const currentPageButton = qOne(".pagination-button-current");
  if (currentPageButton) currentPageButton.focus();

  const newPostCardContainer = createKfElement("div", "post_cards_container");
  const newPostCards = [];
  for(const card of srcPostCards) {
    const newCard = card.cloneKfNode();
    if (OPTIONS.sort_posts_by_publish_date) {
      const timeStamp = new Date(newCard.qOne("time").dateTime).getTime();
      newCard.setKfAttr("published", timeStamp);
    }
    newPostCards.push(newCard);
  }
  if (OPTIONS.sort_posts_by_publish_date) {
    newPostCards.sort((a, b) => b.getKfAttr("published") - a.getKfAttr("published"));
  }

  const hiddenPosts = {
    noThumbnail: 0,
    creatorBlacklisted: 0,
    blacklistedCreators: new Set(),
    alreadyShown: 0
  };
  let shownPosts = [];
  let currentOffset = parseInt(new URLSearchParams(window.location.search).get("o")) || 0;
  if (currentOffset > parseInt(sessionStorage.getItem("lastOffset"))) {
    shownPosts = JSON.parse(sessionStorage.getItem("shownPosts")) || [];
  }

  for(const card of newPostCards) {
    const creatorKey = `${card.getDataAttr("service")}-${card.getDataAttr("user")}`;
    const newGridItem = createKfElementClass("div", "card");
    newGridItem.setKfAttr("creator-key", creatorKey);

    // no thumbnail
    const thumbnail = card.qOne(".post-card__image");
    if (!thumbnail) {
      hiddenPosts.noThumbnail++;
      newGridItem.addKfClass("no_thumbnail");
    } else {
      thumbnail.addEventListener("load", fixThumbnailAspectRatio);
    }

    // blacklist
    if (BLACKLIST.hasOwnProperty(creatorKey)) {
      hiddenPosts.creatorBlacklisted++;
      newGridItem.addKfClass("blacklisted");
      hiddenPosts.blacklistedCreators.add(creatorKey);
    }

    // highlight
    let highlightGroup;
    if (HIGHLIGHT_1.hasOwnProperty(creatorKey)) {
      highlightGroup = "group1";
    } else if (HIGHLIGHT_2.hasOwnProperty(creatorKey)) {
      highlightGroup = "group2";
    } else if (HIGHLIGHT_3.hasOwnProperty(creatorKey)) {
      highlightGroup = "group3";
    }
    if (highlightGroup) newGridItem.setKfAttr("highlight-group", highlightGroup);

    // blacklist & highlight controls
    createBlacklistControls(creatorKey, card.qOne("a"), highlightGroup);

    // shown on previous pages
    const postKey = `${creatorKey}-${card.getDataAttr("id")}`;
    if (shownPosts.includes(postKey)) {
      hiddenPosts.alreadyShown++;
      newGridItem.addKfClass("already_shown");
    } else {
      shownPosts.push(postKey);
    }

    newGridItem.appendChild(card)
    newPostCardContainer.appendChild(newGridItem);
  }
  sessionStorage.setItem("lastOffset", currentOffset);
  sessionStorage.setItem("shownPosts", JSON.stringify(shownPosts));

  // add messages about hidden posts
  const srcMessage = qOne("#paginator-top small");
  if (srcMessage) {
    const messageContainer = createKfElement("div", "post_message_container");
    srcMessage.after(messageContainer);

    if (hiddenPosts.noThumbnail > 0) {
      let message;
      if (hiddenPosts.noThumbnail === 1) {
        message = "Hid 1 post with no thumbnail.";
      } else {
        message = `Hid ${hiddenPosts.noThumbnail} posts with no thumbnail.`;
      }
      const messageNoThumbnail = createKfElement("small", "no_thumbnail_msg", message);
      messageNoThumbnail.addEventListener("click", showPostsWithNoThumbnail);
      messageContainer.appendChild(messageNoThumbnail);
    }

    if (hiddenPosts.creatorBlacklisted > 0) {
      let message;
      if (hiddenPosts.creatorBlacklisted === 1) {
        message = "Hid 1 post from a blacklisted creator.";
      } else {
        message = `Hid ${hiddenPosts.creatorBlacklisted} posts from `;
        if (hiddenPosts.blacklistedCreators.size === 1) {
          message += "a blacklisted creator.";
        } else {
          message += `${hiddenPosts.blacklistedCreators.size} blacklisted creators.`;
        }
      }
      const messageBlacklisted = createKfElement("small", "blacklisted_msg", message);
      messageBlacklisted.addEventListener("click", showPostsFromBlacklistedCreators);
      messageContainer.appendChild(messageBlacklisted);
    }

    if (hiddenPosts.alreadyShown > 0) {
      let message;
      if (hiddenPosts.alreadyShown === 1) {
        message = "Hid 1 post already shown on previous pages.";
      } else {
        message = `Hid ${hiddenPosts.alreadyShown} posts already shown on previous pages.`;
      }
      const messageAlreadyShown = createKfElement("small", "already_shown_msg", message);
      messageAlreadyShown.addEventListener("click", showPostsFromPreviousPages);
      messageContainer.appendChild(messageAlreadyShown);
    }

    // auto click on next page if all posts are hidden
    if (OPTIONS.auto_next_page_if_none_shown) {
      // find next page button first
      let nextPageButton = qOne("menu");
      if (nextPageButton) {
        nextPageButton = nextPageButton.lastChild;
        if (nextPageButton.textContent === ">>") {
          nextPageButton = nextPageButton.previousSibling;
        }
        if (nextPageButton.textContent !== ">" ||
            nextPageButton.hasClass("pagination-button-disabled")) {
          nextPageButton = null;
        }
      }

      if (nextPageButton) {
        let hidCount = 0;
        const cards = newPostCardContainer.children;
        for (const card of cards) {
          if (OPTIONS.hide_posts_with_no_thumbnail && card.hasClass("kf-no_thumbnail")) {
            hidCount++;
            continue;
          }
          if (OPTIONS.hide_posts_from_blacklisted_creators && card.hasClass("kf-blacklisted")) {
            hidCount++;
            continue;
          }
          if (OPTIONS.hide_posts_shown_on_previous_pages && card.hasClass("kf-already_shown")) {
            hidCount++;
          }
        }
        if (hidCount === cards.length) {
          let message = "Auto loading next page...";
          const messageAlreadyShown = createKfElement("small", null, message);
          messageContainer.appendChild(messageAlreadyShown);
          setTimeout(() => {
            nextPageButton.click();
          }, ADVANCED_OPTIONS.auto_next_page_delay);
        }
      }
    }
  }

  newPostCardContainer.setKfAttr("href", window.location.href);
  srcPostCardContainer.after(newPostCardContainer);
  srcPostCardContainer.style.display = "none";
}

function createBlacklistControls(creatorKey, target, highlightGroup) {
  const blacklistControl = createKfElementClass("div", "blacklist_control");
  blacklistControl.addEventListener("click", preventDefault);

  const blacklistButton = createKfElementClass("input", "blacklist_button", "Blacklist");
  blacklistButton.type = "button";
  blacklistButton.addEventListener("click", blacklistCreator);
  blacklistControl.appendChild(blacklistButton);

  const unblacklistButton = createKfElementClass("input", "unblacklist_button", "Unblacklist");
  unblacklistButton.type = "button";
  unblacklistButton.addEventListener("click", unblacklistCreator);
  blacklistControl.appendChild(unblacklistButton);

  const blacklistCommentButton = createKfElementClass("input", "blacklist_comment_button");
  blacklistCommentButton.type = "button";
  const blacklistComment = BLACKLIST[creatorKey] || "";
  if (blacklistComment === "") {
    blacklistCommentButton.value = "(Add Comment)";
  } else {
    blacklistCommentButton.value = blacklistComment;
  }
  blacklistCommentButton.addEventListener("click", editBlacklistComment);
  blacklistControl.appendChild(blacklistCommentButton);

  const highlightSelect = createKfElementClass("select", "highlight_dropdown");
  const highlightNone = createKfElementClass("option", null, "none", ADVANCED_OPTIONS.highlight_group_0_name);
  const highlightGroup1 = createKfElementClass("option", null, "group1", ADVANCED_OPTIONS.highlight_group_1_name);
  const highlightGroup2 = createKfElementClass("option", null, "group2", ADVANCED_OPTIONS.highlight_group_2_name);
  const highlightGroup3 = createKfElementClass("option", null, "group3", ADVANCED_OPTIONS.highlight_group_3_name);
  highlightSelect.appendChild(highlightNone);
  highlightSelect.appendChild(highlightGroup1);
  highlightSelect.appendChild(highlightGroup2);
  highlightSelect.appendChild(highlightGroup3);
  if (highlightGroup) highlightSelect.value = highlightGroup;
  highlightSelect.addEventListener("change", highlightCreator);
  blacklistControl.appendChild(highlightSelect);

  const highlightCommentButton = createKfElementClass("input", "highlight_comment_button");
  highlightCommentButton.type = "button";
  let comment = "";
  switch (highlightGroup) {
    case "group1": {
      comment = HIGHLIGHT_1[creatorKey];
      break;
    }
    case "group2": {
      comment = HIGHLIGHT_2[creatorKey];
      break;
    }
    case "group3": {
      comment = HIGHLIGHT_3[creatorKey];
      break;
    }
  }
  if (comment === "") {
    highlightCommentButton.value = "(Add Comment)";
  } else {
    highlightCommentButton.value = comment;
    highlightSelect.setKfAttr("highlight-comment", comment);
  }
  highlightCommentButton.addEventListener("click", editHighlightComment);
  blacklistControl.appendChild(highlightCommentButton);

  target.prepend(blacklistControl);
}

function fixThumbnailAspectRatio(event) {
  const img = event.target;
  const aspectRatio = img.naturalWidth / img.naturalHeight;
  const gridItem = img.closest("article").closest("div");

  if (OPTIONS.allow_wide_post_cards && aspectRatio > 1.25) {
    gridItem.addKfClass("wide_card");
    if (aspectRatio > 1.5) {
      img.style.objectFit = "contain";
    }
  } else {
    if (aspectRatio > 0.8 || aspectRatio < 0.5625) {
      img.style.objectFit = "contain";
    }
  }
  img.style.opacity = 1;
}

function showPostsWithNoThumbnail(event) {
  removeStyle("hide_no_thumbnail");
}

function showPostsFromBlacklistedCreators(event) {
  removeStyle("hide_blacklisted");
}

function showPostsFromPreviousPages(event) {
  removeStyle("hide_already_shown");
}

function preventDefault(event) {
  event.preventDefault();
}

function blacklistCreator(event) {
  const card = event.target.closest(".kf-card");
  const creatorKey = card.getKfAttr("creator-key");
  BLACKLIST[creatorKey] = card.getKfAttr("blacklist-comment") || "";
  GM_setValue("BLACKLIST", JSON.stringify(BLACKLIST));
  refreshCards();
}

function unblacklistCreator(event) {
  const card = event.target.closest(".kf-card");
  const creatorKey = card.getKfAttr("creator-key");
  const comment = BLACKLIST[creatorKey];
  if (comment) card.setKfAttr("blacklist-comment", comment);
  delete BLACKLIST[creatorKey];
  GM_setValue("BLACKLIST", JSON.stringify(BLACKLIST));
  refreshCards();
}

function highlightCreator(event) {
  const card = event.target.closest(".kf-card");
  const creatorKey = card.getKfAttr("creator-key");

  const oldGroup = card.getKfAttr("highlight-group");
  switch (oldGroup) {
    case "group1": {
      delete HIGHLIGHT_1[creatorKey];
      GM_setValue("HIGHLIGHT_1", JSON.stringify(HIGHLIGHT_1));
      break;
    }
    case "group2": {
      delete HIGHLIGHT_2[creatorKey];
      GM_setValue("HIGHLIGHT_2", JSON.stringify(HIGHLIGHT_2));
      break;
    }
    case "group3": {
      delete HIGHLIGHT_3[creatorKey];
      GM_setValue("HIGHLIGHT_3", JSON.stringify(HIGHLIGHT_3));
      break;
    }
  }

  const comment = event.target.getKfAttr("highlight-comment") || "";
  const newGroup = event.target.value;
  switch (newGroup) {
    case "group1": {
      HIGHLIGHT_1[creatorKey] = comment;
      GM_setValue("HIGHLIGHT_1", JSON.stringify(HIGHLIGHT_1));
      break;
    }
    case "group2": {
      HIGHLIGHT_2[creatorKey] = comment;
      GM_setValue("HIGHLIGHT_2", JSON.stringify(HIGHLIGHT_2));
      break;
    }
    case "group3": {
      HIGHLIGHT_3[creatorKey] = comment;
      GM_setValue("HIGHLIGHT_3", JSON.stringify(HIGHLIGHT_3));
      break;
    }
  }
  refreshCards();
}

function refreshCards() {
  const cards = qAll(".kf-card");
  for (const card of cards) {
    const creatorKey = card.getKfAttr("creator-key");
    if (BLACKLIST.hasOwnProperty(creatorKey)) {
      card.addKfClass("blacklisted");
    } else {
      card.removeKfClass("blacklisted");
    }
    if (HIGHLIGHT_1.hasOwnProperty(creatorKey)) {
      card.setKfAttr("highlight-group", "group1");
    } else if (HIGHLIGHT_2.hasOwnProperty(creatorKey)) {
      card.setKfAttr("highlight-group", "group2");
    } else if (HIGHLIGHT_3.hasOwnProperty(creatorKey)) {
      card.setKfAttr("highlight-group", "group3");
    } else {
      card.setKfAttr("highlight-group", "none");
    } 
  }  
}

function editBlacklistComment(event) {
  const card = event.target.closest(".kf-card");
  const creatorKey = card.getKfAttr("creator-key");
  const comment = event.target.value;

  const message = `Enter new comment for ${creatorKey}:`;
  const input = prompt(`Enter new comment for ${creatorKey}:`, comment);
  if (input === null || input === comment) return;

  BLACKLIST[creatorKey] = input;
  GM_setValue("BLACKLIST", JSON.stringify(BLACKLIST));
  event.target.value = input;
}

function editHighlightComment(event) {
  const card = event.target.closest(".kf-card");
  const creatorKey = card.getKfAttr("creator-key");
  const comment = event.target.value;

  const message = `Enter new comment for ${creatorKey}:`;
  const input = prompt(`Enter new comment for ${creatorKey}:`, comment);
  if (input === null || input === comment) return;

  const highlightGroup = card.getKfAttr("highlight-group");
  switch (highlightGroup) {
    case "group1": {
      HIGHLIGHT_1[creatorKey] = input;
      GM_setValue("HIGHLIGHT_1", JSON.stringify(HIGHLIGHT_1));
      break;
    }
    case "group2": {
      HIGHLIGHT_2[creatorKey] = input;
      GM_setValue("HIGHLIGHT_2", JSON.stringify(HIGHLIGHT_2));
      break;
    }
    case "group3": {
      HIGHLIGHT_3[creatorKey] = input;
      GM_setValue("HIGHLIGHT_3", JSON.stringify(HIGHLIGHT_3));
      break;
    }
  }
  event.target.value = input;
}

function fixPostDetails() {
  updatePostInfo();
  fixPostBody();
}

let postInfo = {};
function updatePostInfo() {
  if (postInfo.path === window.location.pathname) return;

  const postTitle = qAll(".post__title span");
  if (!postTitle) return;

  postInfo = {};
  postInfo.title = postTitle[0].textContent;
  postInfo.service = postTitle[1].textContent.replace(/^\(|\)$/g, '');
  postInfo.creator = qOne(".post__user-name").textContent;
  postInfo.published = qOne(".post__published time").textContent;

  postTitle[0].addEventListener("click", copyPostFolderName);
  postTitle[0].style.cursor = "pointer";
  postTitle[1].addEventListener("click", copyCreatorFolderName);
  postTitle[1].style.cursor = "pointer";

  postInfo.path = window.location.pathname;
}

function glow(target) {
  target.style.transition = "filter 0.5s ease-out";
  target.style.filter = "drop-shadow(0 0 5px #fff)";
  setTimeout(() => {
    target.style.filter = "";
  }, 500);
}

function copyPostFolderName(event) {
  const template = ADVANCED_OPTIONS.copy_post_folder_name_template;
  if (template === "") return;

  const name = template.replace("{title}",     postInfo.title)
                       .replace("{service}",   postInfo.service)
                       .replace("{creator}",   postInfo.creator)
                       .replace("{published}", postInfo.published);
  navigator.clipboard.writeText(getLegalWindowsFileName(name));
  glow(event.target);
}

function copyCreatorFolderName(event) {
  const template = ADVANCED_OPTIONS.copy_creator_folder_name_template;
  if (template === "") return;

  const name = template.replace("{title}",     postInfo.title)
                       .replace("{service}",   postInfo.service)
                       .replace("{creator}",   postInfo.creator)
                       .replace("{published}", postInfo.published);
  navigator.clipboard.writeText(getLegalWindowsFileName(name));
  glow(event.target);
}

function getLegalWindowsFileName(input) {
  const reservedHalfToFull = {
    '<': '＜', // U+FF1C
    '>': '＞', // U+FF1E
    ':': '：', // U+FF1A
    '"': '＂', // U+FF02
    '/': '／', // U+FF0F
   '\\': '＼', // U+FF3C
    '|': '｜', // U+FF5C
    '?': '？', // U+FF1F
    '*': '＊'  // U+FF0A
  };
  // return input.replace(/[\x00-\x1F]/g, '') // already sanitized by browser
  return input.replace(/[<>:"\/\\|?*]/g, (match) => reservedHalfToFull[match])
              .replace(/\s(?=[＜＞：＂／＼｜？＊])|(?<=[＜＞：＂／＼｜？＊])\s/g, '')
              .replace(/[.\s]+$/, '');
}

function fixPostBody() {
  if (kfExist("post_body")) return;

  const srcPostBody = qOne(".post__body");
  if (!srcPostBody) return;

  const newPostBody = createKfElement("div", "post_body");

  for (const srcNode of srcPostBody.childNodes) {
    let newNode;
    switch (srcNode.tagName) {
      case "H2":
        switch (srcNode.textContent) {
          case "Downloads":
            newNode = srcNode.cloneKfNode();
            newNode.style.cursor = "pointer";
            newNode.addEventListener("click", copyAllDownloadLinks);
            break;
          case "Files":
            newNode = srcNode.cloneKfNode("files");
            newNode.style.cursor = "pointer";
            newNode.addEventListener("click", copyAllFileLinks);
            break;
          case "Videos":
            if (OPTIONS.remove_video_section_from_post_body) continue;
          case "Content":
          default:
            newNode = srcNode.cloneKfNode();
        }
        break;
      case "DIV":
        if (srcNode.hasClass("post__content")) {
          /* WIP */
          newNode = srcNode.cloneKfNode();
          /* WIP */
        } else if (srcNode.hasClass("post__files")) {
          const postFiles = srcNode.children;
          if (postFiles.length === 0) {
            const h2Files = newPostBody.qOne("#kf-files");
            if (h2Files) h2Files.remove();
            continue;
          }
          newNode = createKfElement("div", "post_files");

          let fileLinks = [];
          let fileNames = [];
          let thumbLinks = [];
          const thumbnails = srcNode.qAll(".fileThumb");
          for (const thumbnail of thumbnails) {
            const fileLink = thumbnail.href;
            const fileName = thumbnail.download;
            const thumbLink = thumbnail.qOne("img").src;
            const index = fileLinks.indexOf(fileLink);
            if (index === -1) {
              fileLinks.push(fileLink);
              fileNames.push(fileName);
              thumbLinks.push(thumbLink);
            } else if (!ADVANCED_OPTIONS.post_duplicate_files_keep_first) {
              fileLinks[index] = null;
              fileNames[index] = null;
              thumbLinks[index] = null;
              fileLinks.push(fileLink);
              fileNames.push(fileName);
              thumbLinks.push(thumbLink);
            }
          }
          if (!ADVANCED_OPTIONS.post_duplicate_files_keep_first) {
            fileLinks = fileLinks.filter(link => link);
            fileNames = fileNames.filter(link => link);
            thumbLinks = thumbLinks.filter(link => link);
          }

          if (OPTIONS.remove_duplicate_files_from_post) {
            for (let i = 0; i < fileLinks.length; i++) {
              const newGridItem = createKfElement("div");
              const newThumbnail = createKfElement("a");
              newThumbnail.href = fileLinks[i];
              newThumbnail.download = fileNames[i];
              newThumbnail.target = "_blank";
              const newImg = createKfElement("img");
              newImg.src = thumbLinks[i];
              newImg.loading = "lazy";
              newImg.addEventListener("load", postDetailsWideThumbnail);
              newThumbnail.appendChild(newImg);
              newGridItem.appendChild(newThumbnail);
              newNode.appendChild(newGridItem);
            }
          } else {
            for (const thumbnail of thumbnails) {
              const newGridItem = createKfElement("div");
              const newThumbnail = thumbnail.cloneKfNode();
              newThumbnail.target = "_blank";
              newThumbnail.qOne("img").addEventListener("load", postDetailsWideThumbnail);
              newGridItem.appendChild(newThumbnail);
              newNode.appendChild(newGridItem);
            }
          }

          postInfo.fileLinks = [];
          const padding = fileLinks.length > 99 ? 3 : 2;
          const template = ADVANCED_OPTIONS.copy_post_file_links_template;
          if (template === "") {
            postInfo.fileLinks = fileLinks;
          } else {
            for (let i = 0; i < fileLinks.length; i++) {
              const append = template
                .replace("{index}",     `${(i + 1).toString().padStart(padding, '0')}`)
                .replace("{filename}",  getLegalWindowsURIComponent(fileNames[i], true))
                .replace("{title}",     getLegalWindowsURIComponent(postInfo.title))
                .replace("{service}",   postInfo.service)
                .replace("{creator}",   getLegalWindowsURIComponent(postInfo.creator))
                .replace("{published}", postInfo.published);
              postInfo.fileLinks[i] = fileLinks[i] + append;
            }
          }

          const embedViews = srcNode.qAll(".embed-view");
          if (embedViews) {
            for (const embedView of embedViews) {
              const newGridItem = createKfElement("div");
              const newThumbnail = createKfElement("a");
              newThumbnail.href = embedView.closest("a").href;
              newThumbnail.target = "_blank";
              newThumbnail.addKfClass("embed_view_container");
              const newEmbedView = embedView.cloneKfNode();
              newEmbedView.addKfClass("embed_view");
              newThumbnail.appendChild(newEmbedView);
              newGridItem.appendChild(newThumbnail);
              newNode.appendChild(newGridItem);
            }
          }
        }
        break;
      case "UL":
        if (OPTIONS.remove_video_section_from_post_body && srcNode.qOne("video")) continue;

        if (srcNode.hasClass("post__attachments")) {
          newNode = createKfElement("ul", "post_attachments");
          const attachments = srcNode.qAll(".post__attachment");

          const attachmentLinks = [];
          const fileNames = [];
          const browseLinks = [];
          for (const attachment of attachments) {
            const a = attachment.qAll("a");
            const attachmentLink = a[0].href;
            const index = attachmentLinks.indexOf(attachmentLink);
            if (index === -1) {
              attachmentLinks.push(attachmentLink);
              fileNames.push(a[0].download);
              if (a[1]) browseLinks.push(a[1].getAttribute("href")); // .getAttribute for raw value (relative path)
            }
          }

          const attachmentNodes = [];
          for (let i = 0; i < attachmentLinks.length; i++) {
            const newAttachment = createKfElement("li");
            const aAttachment = createKfElement("a");
            aAttachment.href = attachmentLinks[i];
            aAttachment.download = fileNames[i];
            aAttachment.textContent = `Download ${fileNames[i]}`;
            newAttachment.appendChild(aAttachment);
            if (browseLinks[i]) {
              const aBrowse = createKfElement("a");
              aBrowse.href = browseLinks[i];
              aBrowse.target = "_blank";
              aBrowse.textContent = "(Browse >>)";
              newAttachment.appendChild(aBrowse);
            }
            newAttachment.setKfAttr("filename", fileNames[i]);
            attachmentNodes.push(newAttachment);
          }
          attachmentNodes.sort((a, b) => a.getKfAttr("filename").localeCompare(b.getKfAttr("filename")));

          postInfo.attachmentLinks = [];
          const template = ADVANCED_OPTIONS.copy_post_attachment_links_template;
          if (template === "") {
            postInfo.attachmentLinks = attachmentLinks;
            for (let i = 0; i < attachmentNodes.length; i++) {
              newNode.appendChild(attachmentNodes[i]);
            }
          } else {
            for (let i = 0; i < attachmentNodes.length; i++) {
              const append = template
                .replace("{filename}",  getLegalWindowsURIComponent(fileNames[i], true))
                .replace("{title}",     getLegalWindowsURIComponent(postInfo.title))
                .replace("{service}",   postInfo.service)
                .replace("{creator}",   getLegalWindowsURIComponent(postInfo.creator))
                .replace("{published}", postInfo.published);
              postInfo.attachmentLinks[i] = attachmentLinks[i] + append;
              newNode.appendChild(attachmentNodes[i]);
            }
          }
        } else {
          newNode = srcNode.cloneKfNode();
        }
        break;
      case "SCRIPT":
        continue;
    }
    if (newNode) newPostBody.appendChild(newNode);
  }

  newPostBody.setKfAttr("href", window.location.href);
  srcPostBody.after(newPostBody);
  srcPostBody.style.display = "none";
}

function postDetailsWideThumbnail(event) {
  const img = event.target;
  const aspectRatio = img.naturalWidth / img.naturalHeight;
  const gridItem = img.closest("div");
  if (OPTIONS.allow_wide_post_cards && aspectRatio > 1.25) {
    gridItem.addKfClass("wide_thumb");
  }
  img.style.opacity = 1;
}

function copyAllDownloadLinks(event) {
  navigator.clipboard.writeText(postInfo.attachmentLinks.join("\n"));
  glow(event.target);
}

function copyAllFileLinks(event) {
  navigator.clipboard.writeText(postInfo.fileLinks.join("\n"));
  glow(event.target);
}

function getLegalWindowsURIComponent(input, check = false) {
  let decodedInput = input;
  if (check) {
    try {
      const temp = decodeURIComponent(input);
      if (encodeURIComponent(temp) === input) decodedInput = temp;
    } catch (error) {
      // decoding failed, decodedInput still holds input
    }
  }
  return encodeURIComponent(getLegalWindowsFileName(decodedInput));
}
// ==</Page Fixing Functions>==
})();
