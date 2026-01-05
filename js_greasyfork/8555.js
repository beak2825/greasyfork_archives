// ==UserScript==
// @name        www.opensubtitles.org - direct download button
// @namespace   monnef.tk
// @include     http://www.opensubtitles.org/en/subtitles/*
// @version     1
// @grant       none
// @require     http://code.jquery.com/jquery-2.1.3.min.js
// @description Adds "direct download" button, unchecks download manager and semi-hides the checkbox, its label and the old download button.
// @downloadURL https://update.greasyfork.org/scripts/8555/wwwopensubtitlesorg%20-%20direct%20download%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/8555/wwwopensubtitlesorg%20-%20direct%20download%20button.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

function semiHide(elem) {
  elem.css("opacity", "0.1");
}

$(function() {
  setTimeout(function() {
    var check = $("#cbDownloader").prop("checked", false);
    var checkLabel = check.next();
    var but = $("#bt-dwl");
    var box = but.parent().parent();
    box.prepend($("<div>").css("height", "10px").css("border-bottom", "1px solid #ddd").css("margin-bottom", "5px"));
    box.prepend($("<a />").html("Direct download").addClass("bt-dwl").attr("href", but.attr("rel")));
    [check, checkLabel, but].map(semiHide);
  }, 50);
});
