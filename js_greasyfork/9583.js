// ==UserScript==
// @name        Bangumi评分计算
// @namespace   https://github.com/vovict
// @description 计算bangumi的精确评分
// @include     /^https\:\/\/bangumi\.tv\/subject\/\d+$/
// @include     /^https\:\/\/bgm\.tv\/subject\/\d+$/
// @version     1.2
// @grant       none
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/9583/Bangumi%E8%AF%84%E5%88%86%E8%AE%A1%E7%AE%97.user.js
// @updateURL https://update.greasyfork.org/scripts/9583/Bangumi%E8%AF%84%E5%88%86%E8%AE%A1%E7%AE%97.meta.js
// ==/UserScript==

var scorelist = document.getElementsByClassName("count");
//alert(scorelist.length);
var users = 0;
var sum = 0;
for (var i = 0; i < scorelist.length; i++)
{
	var s =  scorelist[i].innerHTML;
  s = s.substring(1,s.length-1);
  //alert(s);
  users += parseInt(s,10);
  sum += parseInt(s,10) * (10-i);
}

var score = sum/users;

document.getElementsByClassName("number")[0].title = score;
document.getElementsByClassName("number")[0].innerHTML = score.toFixed(3);