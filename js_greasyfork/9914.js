// ==UserScript==
// @name        TISS Enhancer
// @description Let's pimp up that ol' TISS course page
// @namespace   https://greasyfork.org/users/2756
// @include     https://tiss.tuwien.ac.at/course/*
// @include     https://tiss.tuwien.ac.at/education/*
// @version     1.02
// @grant       none
// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.slim.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/locale/de.min.js
// @downloadURL https://update.greasyfork.org/scripts/9914/TISS%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/9914/TISS%20Enhancer.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

var title = $("div#content h1:first").clone().children().remove().end().text().trim();
var page = window.location.href.match(/tiss.tuwien.ac.at\/([\w\/]+)\.xhtml/i)[1];
var locale = document.cookie.match(/TISS_LANG=([\w-]+)/);
moment.locale(locale ? locale[1] : "de");

// switch to edcuationDetails if already in favorites
if (page == "course/courseDetails" &&
    $("span#watchLink:contains(In Ihren Favoriten), span#watchLink:contains(In your favorites)").length)
{
  var url = window.location.href.replace("courseDetails", "educationDetails");
  window.location.href = url;
}

// switch to newest available semester if coming from favorites
if (document.referrer.match(/education\/favorites.xhtml/) &&
    page == "course/educationDetails" && $("form#semesterForm").length)
{
  var sems = $("form#semesterForm > select");
  var newest = sems.find("option:first").val();
  var selected = sems.find("option:selected").val();

  if (newest > selected)
    $("form#semesterForm > select").val(newest).trigger("change");
}

function vowi_link(lva)
{
  return "https://vowi.fsinf.at/wiki?search=" + encodeURIComponent(lva);
}

// course page: add VoWi to bullet links
if ((page == "course/educationDetails" || page.indexOf("education/course") === 0 ) && $("ul.bulletList").length)
{
  var text = moment.locale() === 'de' ? 'Zum VoWi' : 'To VoWi';
  var a = $('<a href="' + vowi_link(title) + '" target="_blank">' + text + '</a>');
  var li = a.wrap('<li></li>').parent();
  $("ul.bulletList").first().append(li);
}

// favorites page: add VoWi link icon
if (page == "education/favorites")
{
  $("tr.ui-widget-content").each(function(index, row) {
    var lva = $("td.favoritesTitleCol a", row).text().trim();
    var img = '<img src="https://vowi.fsinf.at/logo.png" title="VoWi" width="16" height="16"></img>';
    var a = $('<a href="' + vowi_link(lva) + '" target="_blank">' + img + '</a>');
    $("td.favoritesLinks", row).append(a);
  });
}

function gcal_link(title, start, end)
{
  var gcal_format = function(ts) { return ts.toISOString().replace(/[-:]|\.000/g, ""); };
  var link = "https://www.google.com/calendar/render?action=TEMPLATE";
  link += "&text=" + encodeURIComponent(title);
  link += "&dates=" + gcal_format(start) + "/" + gcal_format(end);
  link += "&details=" + encodeURIComponent(window.location.href);
  return link;
}

function rtm_link(title, due)
{
  var link = "https://www.rememberthemilk.com/services/ext/addtask.rtm";
  link += "?t=" + encodeURIComponent(title);
  link += "&d=" + due.toISOString();
  return link;
}

// course/group/exam registration page: add timestamps to google calendar / rtm
$("li > span").each(function()
{
  var ts = $(this).text().match(/\d+\.\d+\.\d+, \d+:\d+/);
  if (!ts)
    return true;
  
  var start = moment(ts[0], "DD.MM.YYYY, HH:mm");
  var label = title + ": " + $(this).siblings("label:first").text().trim();
  var diff = $('<span style="margin-left: 6px;">(' + start.fromNow() + ')</span>');
  if (start.isBetween(moment(), moment().add(14, 'days')))
    diff.css("font-weight", "bold");
  $(this).after(diff);

  if (start.isAfter(moment()))
  {
    var gcal_img = '<img src="https://calendar.google.com/googlecalendar/images/favicon.ico" width="16" height="16" title="Google Calendar"></img>';
    var rtm_img = '<img src="https://www.rememberthemilk.com/favicon.ico" width="16" height="16" title="Remember The Milk"></img>';
    var gcal_a = $('<span style="margin-left: 6px; position: absolute;"><a href="' + gcal_link(label, start, start) + '" target="_blank">' + gcal_img + '</a></span>');
    var rtm_a = $('<span style="margin-left: 24px; position: absolute;"><a href="' + rtm_link(label, start) + '" target="_blank">' + rtm_img + '</a></span>');
    diff.after(gcal_a);
    diff.after(rtm_a);
  }
});