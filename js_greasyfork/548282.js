// ==UserScript==
// @name        Haraedo - ASC Menu Order
// @namespace   Violentmonkey Scripts
// @match       https://haraedo.forumpolish.com/*
// @grant       none
// @version     1.2
// @license     MIT
// @author      nal
// @description 04/09/2025, 01:00:55
// @downloadURL https://update.greasyfork.org/scripts/548288/Haraedo%20-%20ASC%20Menu%20Order.user.js
// @updateURL https://update.greasyfork.org/scripts/548288/Haraedo%20-%20ASC%20Menu%20Order.meta.js
// ==/UserScript==

$(".menu ul li:last-of-type").remove();
var mylist = $('.menu ul');
var listitems = mylist.children('li').get();
listitems.sort(function(a, b) {
   return $(a).text().toUpperCase().localeCompare($(b).text().toUpperCase());
})
$.each(listitems, function(idx, itm) { mylist.append(itm); });

$(".menu ul li:last-of-type").css({"min-width": "31%", "border": "var(--o1)", "background": "var(--b1)","box-shadow":"var(--sh)"});
$(".menu li").css({"height":"fit-content"});
$(".menu ul").css({"padding":"20px 15px"});

$('.menu-toggle').toggle(function () {
  $(".menu-container").removeClass("menu-nonactive");
  $(".menu-container").addClass("menu-active");
}, function () {
    $(".menu-container").removeClass("menu-active");
   $(".menu-container").addClass("menu-nonactive");
});

document.head.append(Object.assign(document.createElement("style"), {
    type: "text/css",
    textContent: `.menu-active {
        height:290px!important;
    }
    .menu-nonactive {
      height: 0px!important
    }`
}))