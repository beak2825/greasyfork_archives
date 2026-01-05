// ==UserScript==
// @name BFCondense
// @version 1.0
// @description Kondenzuje bf prispevky
// @match *.bike-forum.cz/*
// @namespace https://greasyfork.org/users/11515
// @downloadURL https://update.greasyfork.org/scripts/9950/BFCondense.user.js
// @updateURL https://update.greasyfork.org/scripts/9950/BFCondense.meta.js
// ==/UserScript==
$(document).ready(function() {
$(".comment:not(.unreadComment)").hide();
$(".unreadComment").parent().parent().parent().children(".comment").show();
$(".bar").click(function(e) {
  if (e.target.tagName.strToLower()=="div") {
    $(this).parent().children(".comment").toggle();
  }
})
});