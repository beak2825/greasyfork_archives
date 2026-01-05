// ==UserScript==
// @name        Better Hacker News
// @namespace   ycombinator.com
// @description Fixes the hideous looking interface
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js
// @include     https://news.ycombinator.com/*
// @version     0.0.2
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/9829/Better%20Hacker%20News.user.js
// @updateURL https://update.greasyfork.org/scripts/9829/Better%20Hacker%20News.meta.js
// ==/UserScript==

// various better-looking styles (subjective, I know)
GM_addStyle('table { border-collapse: collapse; }');
GM_addStyle('.title a { font-size: 22px; }');
GM_addStyle('tr.spacer { display: none; }');
GM_addStyle('.rank { color: navy; }');

// add target: _blank to links
var links = $("a[href]:not([target])");
var numLinks = links.length;
for (var j = 0; j < numLinks; ++j) {
  links[j].setAttribute("target", "_blank");
}

// we don't need the spacer rows
$('tr.spacer').remove();

// highlight the title row background
var arTableRows = document.getElementsByTagName('tr');
  var bHighlight = true;
  for (var i = arTableRows.length - 2; i >= 0; i--) {
    var elmRow = arTableRows[i];
    elmRow.style.backgroundColor = bHighlight ? '#eee' : '#fff';
    elmRow.style.color = '#000';
    bHighlight = !bHighlight;
  }
