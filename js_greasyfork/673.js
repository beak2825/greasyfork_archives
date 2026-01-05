// ==UserScript==
// @name        HarajukuPlayer
// @namespace   none-none
// @description NicoPlayer4,LivePlayer 最終更新版
// @include     http://www.nicovideo.jp/watch/*
// @include     http://live.nicovideo.jp/watch/*
// @version     1.3.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/673/HarajukuPlayer.user.js
// @updateURL https://update.greasyfork.org/scripts/673/HarajukuPlayer.meta.js
// ==/UserScript==

//v1.3.0 クエリ文字列を削除するように修正
//
//v1.2.8 Nsenで生放送プレイヤーが読み込めない問題を修正
//       live2サーバに対応
//
//v1.2.7 動画が再生できなくなる問題を修正
//
//v1.2.6 自動再生部分のソースコードを修正
//
//v1.2.5 SWFObject部分のソースコードを修正
//
//v1.2.4 自動再生部分のソースコードを修正
//
//v1.2.3 v1.2.2によって発生した複数の不具合を修正
//
//v1.2.2 ソースコードを修正
//
//v1.2.1 パラメータ"quality"の値の変更が反映されるように修正
//
//v1.2.0 Opera, Safari, Sleipnirに対応
//
//v1.1.5 ※GINZAプレイヤー更新の影響により自動再生が効かなくなったため自動再生できるよう修正
//       ※ニコ割を表示・非表示選択できるように修正
//
//       ※変数　要変更
//
//v1.1.4 ニコ割を再生できるように修正
//
//v1.1.3 動画プレイヤー内のおすすめタブの中にある動画を押してもページが遷移されないバグを修正
//       動画・生放送プレイヤーの「モニタサイズで拡大する」が正常に動作しないバグを修正
//
//v1.1.2 生放送プレイヤーをブラウザサイズにした際にコメント投稿欄がズレるのを修正
//
//v1.1.1 生放送プレイヤーのサイズとCSSを修正
//
//v1.1.0 chromeに対応
//
//v1.0.0 初版

/******** 例外 クエリ文字列 ********/

	var eqs = ["eco", "lo", "low"];

//

/************ 自動再生 ************/

	//自動再生on → Video_autoPlay = true;

	//自動再生off → Video_autoPlay = false;

	var Video_autoPlay = false;

//

/************* ニコ割 *************/

	//ニコ割on → marq = "0";

	//ニコ割off → marq = "1";

	var marq = "0";

//

(function(){

	var url = location.href;
	var url_res = url.split("?");
	var url_value = url_res[0].split("/watch/");
	var flvplayer = document.getElementById("flvplayer");

	if(flvplayer){
		var player_value = (flvplayer.getAttribute("flashvars")).split("&");

        if(url_res.length===2 && eqs_match(url_res[1])===false){
			history.replaceState(null, null, url_res[0]);
		}

		if(url_value[0]==="http://www.nicovideo.jp"){
			var so = new window.SWFObject("http://res.nimg.jp/swf/player/nicoplayer.swf", "flvplayer", "976", "504", 9, "#FFFFFF");
			so.addVariable("videoDetail","{}");
			if(Video_autoPlay===true){
				window.NicoPlayerReady.register(AutoPlay);
			}
		}else if(url_value[0]==="http://live.nicovideo.jp"){
			var so = new window.SWFObject("http://live.nicovideo.jp/liveplayer.swf", "flvplayer", "950", "520", 9, "#FFFFFF");
		}

		for(var i=0;i<=player_value.length-1;i++){
			player_value[i] = player_value[i].split("=");
			player_value[i][1]=(player_value[i][0]==="noMarquee"?marq:player_value[i][1]);
			so.addVariable(player_value[i][0],player_value[i][1]);
		}

		so.addParam("allowScriptAccess", "always");
		so.addParam("allowFullScreen", "true");
		so.addParam("quality",flvplayer.getAttribute("quality"));
		so.write("flvplayer_container");
	}

})();

function AutoPlay(){
	var flvplayer = document.getElementById("flvplayer");
	setTimeout(function(){
		flvplayer.ext_play(true);
	},1);
}

function eqs_match(qs){
	var isExceQs = false;
	for(var i=0;i<eqs.length;i++){
		isExceQs |= (qs.indexOf(eqs[i]+"=")===-1?false:true);
	}
	return Boolean(isExceQs);
}