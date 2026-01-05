// ==UserScript==
// @name        GameFAQs - Private Board User Profile Invite button
// @namespace   http://userscripts.org/scripts/source/181912.user.js
// @description GameFAQs - Private Board User Profile Invite button descr
// @include     http://www.gamefaqs.com/community/*/boards
// @version     1.11
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/876/GameFAQs%20-%20Private%20Board%20User%20Profile%20Invite%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/876/GameFAQs%20-%20Private%20Board%20User%20Profile%20Invite%20button.meta.js
// ==/UserScript==

var board = "848"; //Enter the board number you are admin of here

//Do not edit below this line unless you know what you're doing.

var tbody = document.getElementsByTagName('tbody')[0];
var user = tbody.getElementsByTagName('td')[1];
var username = user.innerHTML;
var user_key = document.forms[1].key.value;
document.getElementsByClassName("span12")[0].innerHTML+=' <form action="http://www.gamefaqs.com/boardaction/848-?admin=1" method="post" style="display:inline;margin:0;padding:0;" name="gm_invite">'
+ '<input type="hidden" name="target_text" value="'+username+'" /><input type="hidden" name="key" value="'+user_key+'"><input type="hidden" name="action" value="addmember" /></form>'
+ '<input type="button" onclick="document.forms[\'gm_invite\'].submit();" value="Invite" />';