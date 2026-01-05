// ==UserScript==
// @name pixiv ID
// @description show pixiv ID in pixiv. pixiv にてユーザー ID を表示する
// @version 1.0
// @include http://www.pixiv.net/*
// @namespace https://greasyfork.org/users/8032
// @downloadURL https://update.greasyfork.org/scripts/7250/pixiv%20ID.user.js
// @updateURL https://update.greasyfork.org/scripts/7250/pixiv%20ID.meta.js
// ==/UserScript==

;(function() {
  "use strict";
  var addUIDNode = function() {
    var KEY_URL = "http://www.pixiv.net/stacc/";
    var NODE_ID = "userjs-user-id-item";
    var src = document.querySelector("a.tab-feed");
    var dst = document.querySelector(".user-relation");
    var uidnode = document.querySelector("#" + NODE_ID);
    if (!uidnode && src && dst) {
      var userID = src.href.slice(KEY_URL.length).match(/[-\w]*/)[0];
      var li = document.createElement("li");
      var a = document.createElement("a");
      li.id = NODE_ID;
      a.textContent = userID;
      a.href = "http://drawr.net/" + userID;
      a.style.display = "inline-block";
      a.style.paddingLeft = "24px";
      a.style.backgroundImage = "url(http://drawr.net/images/icon_top.gif)";
      a.style.backgroundRepeat = "no-repeat";
      li.appendChild(a);
      dst.appendChild(li);
    }
  };
  if (document.readyState === "complete") addUIDNode();
  else addEventListener("DOMContentLoaded", addUIDNode);
  addEventListener("popstate", addUIDNode);
})();
