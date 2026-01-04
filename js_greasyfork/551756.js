// ==UserScript==
// @name www.roblox.com/communities/1065652/Content-Deleted-1065652
// @namespace github.com/openstyles/stylus
// @version 1.0.0
// @description A new userstyle
// @author Me
// @grant GM_addStyle
// @run-at document-start
// @match https://www.roblox.com/communities*
// @downloadURL https://update.greasyfork.org/scripts/551756/wwwrobloxcomcommunities1065652Content-Deleted-1065652.user.js
// @updateURL https://update.greasyfork.org/scripts/551756/wwwrobloxcomcommunities1065652Content-Deleted-1065652.meta.js
// ==/UserScript==

(function() {
let css = `
      .groups-list-item {
background-color: transparent!important;
}



  .groups-list-sidebar .group-react-groups-list .groups-list-new .groups-list-items-container {
    height: 649px!important;
width: 160px!important;
background-color: #efefef !important;
  padding: 7px !important;
  border: 1px solid #ccc !important;
}

#group-container {
width: 970px;
margin-left: 184px!important;
}

.group-details {
width: 800px;
}

 [data-internal-page-name="GroupDetails"] .rbx-left-col {
  background-color: #f2f2f2;
}


[data-internal-page-name="GroupDetails"].light-theme {
        background: #f00 !important;
}

[data-internal-page-name="GroupDetails"].light-theme .content {
        background: #f00 !important;
}


.group-details .rbx-tab .rbx-tab-heading {
  float: left;
  background-color: #D6D6D6!important;
  padding: 7px!important;
  border: 1px solid #9e9e9e!important;
    border-bottom-width: 0px!important;
  margin: 4px 2px 0 1px!important;
  position: relative;
  top: -1px;
  box-shadow: none!important;
  line-height: 1.428!important;
  z-index: 0!important;
}

.group-details .rbx-tabs-horizontal .rbx-tab.active .rbx-tab-heading {
  background-color: #fff!important;
  padding: 9px 7px!important;
  border-bottom: 0!important;
  position: relative;
  border-color: #ccc!important;
  z-index: 0!important;
  margin: 0 1px 0 0!important;
  top: 1px!important;
  }

.group-details .rbx-tabs-horizontal .rbx-tab.active .rbx-tab-heading:hover {
background-color: #fff!important;
}

.group-details .rbx-tabs-horizontal .rbx-tab .rbx-tab-heading:hover {
background-color: #e9e9e9!important;
}

#btr-games .rbx-tab-heading span::after {
line-height: 1.428!important;
}

.group-details .group-tab, .btr-redesign .btr-hasGames .rbx-tabs-horizontal .group-tab {
  width: unset !important;
}

.btr-redesign .rbx-tabs-horizontal #horizontal-tabs {
box-shadow: none!important;
color: transparent!important;
border-bottom: 1px solid #ccc;
}

.rbx-tab.group-tab.ng-isolate-scope.group-tab-3-buttons:nth-child(1) {
  display: block !important;
  order: 1!important;
}

.rbx-tab.group-tab.ng-isolate-scope.group-tab-2-buttons:nth-child(1) {
  display: block !important;
  order: 1!important;
}

.rbx-tab.group-tab.ng-isolate-scope.group-tab-2-buttons:nth-child(2) {
  display: block !important;
  order: 1 !important;
}

.rbx-tab.group-tab.ng-isolate-scope.group-tab-2-buttons:nth-child(3) {
  display: block !important;
  order: 4!important;
}

#btr-games.rbx-tab.group-tab.ng-scope:nth-child(2) {
  display: block !important;
  order: 0!important;
}

.rbx-tab.group-tab.ng-isolate-scope.group-tab-3-buttons:nth-child(3) {
  display: block !important;
  order: 4!important;
}


.group-details .group-members-list .member {
overflow-x: visible !important;
  overflow-y: visible !important;
  display: grid;
  width: 125px;
  height: 150px;
  gap: 20px;
  grid-template-columns: repeat(auto-fill,minmax(0px,1fr));
}

.group-details .group-members-list .member .avatar.avatar-card-fullbody {
box-shadow: none!important;
scale: 1.1;
}

.btr-redesign group-members-list .container-header.group-members-list-container-header h2 {
display: none!important;
}

.group-details .group-members-list .member .member-name {
color: #0055B3;
font-size: 14px;
line-height: 1.428;
text-decoration: none;
font-weight: 400;
}

.group-details .group-members-list .member .member-name-container {
max-width: 112%!important;
}

.group-details .group-members-list .member .member-name-parent-container {
margin-top: 10px;
justify-content: left!important;
}

group-affiliates .game-card-container.group-card-name-container {
display: none!important;
}

group-affiliates .text-overflow.game-card-name-secondary.ng-binding.ng-scope {
display: none!important;
}

group-affiliates .card-item.game-card-container {
box-shadow: none!important;
background-color: transparent!important;
}

group-affiliates .game-card-thumb-container img {
border-radius: 0px!important;
border-top-right-radius: 0px!important;
border-top-left-radius: 0px!important;
}

group-affiliates .game-card-container thumbnail-2d {
height: 42px!important;
width: 42px!important;
}

group-affiliates ul.hlist.game-cards .game-card {
width: 50px!important;
}

group-affiliates .container-header h2 {
display: none!important;
}

.group-details .avatar-container img {
  background-color: transparent!important;
}

.group-details .group-members-list .member .avatar-container span[thumbnail-type] {
height: 100px;
  width: 100px;
}

.group-details .avatar-card-fullbody .avatar-card-image {
border-radius: 0%!important;
}

.rbx-tab.group-tab.ng-isolate-scope.group-tab-3-buttons:nth-child(4) {
  display: block !important;
  order: 2!important;
}

.group-details .rbx-tabs-horizontal .group-foundation-tabs .rbx-tab {
box-shadow: none!important;
}

#btr-games [ng-bind*="'Heading.Games'"] {
  font-size: 0!important;
}

#btr-games .rbx-tab-heading span::after {
  font-size: 15px!important;
  font-weight: bold!important;
}

.group-details .rbx-tab .rbx-tab-heading span {
  font-size: 15px!important;
  font-weight: bold!important;
}

#affiliates.rbx-tab.group-tab.ng-isolate-scope span {
  font-size: 0px!important;
}

#affiliates.rbx-tab.group-tab.ng-isolate-scope span::after {
content: 'Allies';
font-size: 15px!important;
cursor: pointer!important;
}

#btr-games [ng-bind*="'Heading.Games'"]::after {
cursor: pointer!important;
}

#group-container:has(#btr-games.rbx-tab.group-tab.ng-scope.active) .group-forums-updates when (@2G = 1) {
display: none!important;
}

#group-container:has(#store.rbx-tab.group-tab.ng-scope.active) .group-forums-updates when (@2G = 1) {
display: none!important;
}

#group-container:has(#affiliates.rbx-tab.group-tab.ng-scope.active) .group-forums-updates when (@2G = 1) {
display: none!important;
}

#group-container:has(#forums.rbx-tab.group-tab.ng-scope.active) .group-forums-updates when (@2G = 1) {
display: none!important;
}

#group-container:has(#events.rbx-tab.group-tab.ng-scope.active) .group-forums-updates when (@2G = 1) {
display: none!important;
}

.group-forums-categories-list when (@2G = 1) {
  padding-left: 15px;
}

.group-forums-updates-header-title::before when (@2G = 1) {
content: "Top Group Posts";
visibility: visible!important;
}

.group-forums-updates-header-title when (@2G = 1) {
visibility: hidden!important;
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
