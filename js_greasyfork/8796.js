// ==UserScript==
// @name          What.CD: Move userclass(es) to Stats box
// @namespace     what.cd-5m
// @description   Moves userclass(es) to Stats box on What.CD profiles
// @include       https://what.cd/user.php?id*
// @include       https://ssl.what.cd/user.php?id*
// @version       1.4.17
// @icon          https://what.cd/favicon.ico
// @author        5moufl
// @author        pinguen
// @downloadURL https://update.greasyfork.org/scripts/8796/WhatCD%3A%20Move%20userclass%28es%29%20to%20Stats%20box.user.js
// @updateURL https://update.greasyfork.org/scripts/8796/WhatCD%3A%20Move%20userclass%28es%29%20to%20Stats%20box.meta.js
// ==/UserScript==


var personal_box = document.getElementsByClassName('box_userinfo_personal')[0],
    userclass = personal_box.getElementsByTagName('li')[0];

var stat_box = document.getElementsByClassName('box_userinfo_stats')[0],
    stat_list = stat_box.getElementsByTagName('ul')[0];

stat_list.appendChild(userclass);

//Special userclasss
if (personal_box.getElementsByTagName('li').length == 3 || personal_box.getElementsByTagName('li').length == 6) {
	var special_userclasses = personal_box.getElementsByTagName('li')[0];
	stat_list.appendChild(special_userclasses);
}