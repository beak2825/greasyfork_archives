// ==UserScript==
// @name        モジパフィルタ
// @namespace   http://gamebook.blog.jp/
// @description モジパのDestinyフィルタ
// @include     http://chat.mojiparty.jp
// @include     http://chat.mojiparty.jp/
// @version     1.0.0
// @author         Hav
// @license	http://creativecommons.org/licenses/by-nc/3.0/
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/7412/%E3%83%A2%E3%82%B8%E3%83%91%E3%83%95%E3%82%A3%E3%83%AB%E3%82%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/7412/%E3%83%A2%E3%82%B8%E3%83%91%E3%83%95%E3%82%A3%E3%83%AB%E3%82%BF.meta.js
// ==/UserScript==
$(function(){

var flag_all = 0;
var flag_ps4 = 0;
var flag_ps3 = 0;

$(".wrap-gametitle-tags").after("\r\t\n\
<div id='mf-wrap'>\r\t\n\
<div id='mf-all'>全て</div>\r\t\n\
<div id='mf-ps4'>PS4</div>\r\t\n\
<div id='mf-ps3'>PS3</div>\r\t\n\
</div>\r\t\n\
");

$("#mf-wrap").css({"overflow":"hidden"});
$("#mf-wrap > div").css({
	"background" : "#fff",
	"border" : "1px solid #000",
	"width" : "80px",
	"text-align" : "center",
	"float" : "left",
	"margin-right" : "6px",
	"cursor" : "pointer"
});
	
$("#mf-all").click(function(){
	flag_ps3 = 0;
	flag_ps4 = 0;
	$(".rooms .room").show();
	$("#mf-wrap > div").css("background","#fff");
	$("#mf-all").css("background","#ddd");
});
$("#mf-ps4").click(function(){
	flag_ps3 = 0;
	flag_ps4 = 1;
	$("#mf-wrap > div").css("background","#fff");
	$("#mf-ps4").css("background","#ddd");
});
$("#mf-ps3").click(function(){
	flag_ps4 = 0;
	flag_ps3 = 1;
	$("#mf-wrap > div").css("background","#fff");
	$("#mf-ps3").css("background","#ddd");
});

setInterval(function(){

if (flag_ps4 === 1){
	$(".rooms .room").show();
	$(".room_head_postion").not(":contains('【PS4】')").parents(".room").hide();
}
if (flag_ps3 === 1){
	$(".rooms .room").show();
	$(".room_head_postion").not(":contains('【PS3】')").parents(".room").hide();
}

$(".room_head_postion:contains('【PS4】')").parents(".room").css({
	"border-right-color" : "#325FBF",
	"border-right-width" : "3px"
});
$(".room_head_postion:contains('【PS3】')").parents(".room").css({
	"border-right-color" : "#777",
	"border-right-width" : "3px"
});

},1000);

});