// ==UserScript==
// @name           futaba log search
// @namespace      https://github.com/himuro-majika
// @description    img,dat,may,junのスレが消えた時に過去ログを表示しちゃう
// @author         himuro_majika
// @include        http://img.2chan.net/b/res/*.htm
// @include        https://img.2chan.net/b/res/*.htm
// @include        http://dat.2chan.net/b/res/*.htm
// @include        https://dat.2chan.net/b/res/*.htm
// @include        http://may.2chan.net/b/res/*.htm
// @include        https://may.2chan.net/b/res/*.htm
// @include        http://jun.2chan.net/jun/res/*.htm
// @include        https://jun.2chan.net/jun/res/*.htm
// @require        http://ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/rollups/md5.js
// @version        1.3.9
// @grant          GM_xmlhttpRequest
// @license        MIT
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAAPUExURYv4i2PQYy2aLUe0R////zorx9oAAAAFdFJOU/////8A+7YOUwAAAElJREFUeNqUj1EOwDAIQoHn/c88bX+2fq0kRsAoUXVAfwzCttWsDWzw0kNVWd2tZ5K9gqmMZB8libt4pSg6YlO3RnTzyxePAAMAzqMDgTX8hYYAAAAASUVORK5CYII=
// @downloadURL https://update.greasyfork.org/scripts/8188/futaba%20log%20search.user.js
// @updateURL https://update.greasyfork.org/scripts/8188/futaba%20log%20search.meta.js
// ==/UserScript==
this.$ = this.jQuery = jQuery.noConflict(true);

(function ($) {
	var waitnum = -1;	//404時のページ遷移ウェイト[秒]:-1で無効

	var title = document.title;								//ページタイトル

	/**
	 * パターン:ex. (http://dat.2chan.net/b/res/11111111.htm)
	 */
	// フルアドレス(http://dat.2chan.net/b/res/11111111.htm)
	var $U = location.href;
	// 鯖名(dat)
	var $S = document.domain.match(/^[^.]+/);
	// ディレクトリ(b)
	var $D = location.pathname.match(/[^/]+/);
	// ファイル名(11111111.htm)
	var $F = location.pathname.match(/\d+\.htm/);
	// ファイル名の数字(11111111)
	var $N = $F[0].match(/\d+/);
	var $hash = CryptoJS.MD5($U.replace("https", "http"));

	//ログ保管サービスジャンプ先URL
	var logService = {
		img: [
			{
				site: "logbox",
				url: "http://parupunte.net/logbox/detail.html?no=" + $N,
			},
			{
				site: "FTBucket",
				url: "http://c3.ftbucket.info/" + $S + "/cont/" + $S +
					".2chan.net_" + $D + "_res_" + $N + "/index.htm",
			},
			{
				site: "futakuro",
				url: "http://kako.futakuro.com/futa/"+ $S + "_" + $D + "/" + $N + "/",
			},
			{
				site: "Futafuta",
				url: "http://futafuta.site/thread/" + $S + "/" + $F,
			},
		],
		dat: [
			{
				site: "リッチー",
				url: "http://appsweets.net/tatelog/dat/thread/" + $N,
			},
		],
		may: [
			{
				site: "FTBucket",
				url: "http://" + $S + ".ftbucket.info/" + $S + "/cont/" + $S +
					".2chan.net_" + $D + "_res_" + $N + "/index.htm",
			},
			{
				site: "futakuro",
				url: "http://kako.futakuro.com/futa/"+ $S + "_" + $D + "/" + $N + "/",
			},
			{
				site: "Futafuta",
				url: "http://futafuta.site/thread/" + $S + "/" + $F,
			},
			{
				site: "ふたばフォレスト",
				url: "http://futabaforest.net/b/res/" + $F,
			},
		],
		jun: [
			{
				site: "FTBucket",
				url: "http://c3.ftbucket.info/" + $S + "/cont/" + $S +
					".2chan.net_" + $D + "_res_" + $N + "/index.htm",
			},
			{
				site: "Futafuta",
				url: "http://futafuta.site/thread/" + $S + "/" + $F,
			},
		]
	};
	//鯖毎の振り分け
	var logService_server = logService[$S];

	//通常時
	if (title !== "404 File Not Found") {
		makelogsitebutton();
	}
	//404時
	else {
		var $h1 = $("body > h1");
		if (waitnum !== -1) {
			$h1.before("<div><span id='countdown'>" + waitnum +
			"</span>秒後に外部ログサイト(" + logService_server[0].site +
			")に移動します</div>");
			setTimeout(redirect, waitnum * 1000);
			setInterval(countdown, 1000);
		}
		$h1.before("<div>ログサイトリスト :</div>");
		$h1.before("<ul id='loglist'></ul>");
		var $li = $("#loglist");
		logService_server.forEach(function(item) {
			$li.append("<li><a href='" + item.url +
				"' target='_blank' rel=noreferrer>" + item.site + "*</a></li>");
		});
		satty();
	}

	function makelogsitebutton() {
		var toggle_flag = true;
		var $logsitelink = $("<a>", {
			id: "futaba_log_search_loglist_button",
			text: "[外部ログサイト]",
			css: {
				cursor: "pointer",
			},
			click: function() {
				showlogsitelist();
			}
		});
		$("body > table").before($logsitelink);

		function showlogsitelist() {
			if(toggle_flag) {
				$("#futaba_log_search_loglist_button").after($("<ul id='loglist'>"));
				var $li = $("#loglist");
				logService_server.forEach(function(item) {
					$li.append("<li><a href='" + item.url +
						"' target='_blank' rel=noreferrer>" + item.site + "*</a></li>");
				});
				toggle_flag = false;
			}
			else {
				$("#loglist").remove();
				toggle_flag = true;
			}
		}
	}


	/*
	 * ログ保管先にジャンプ
	 */
	function redirect() {
		location.href = logService_server[0].url;
	}

	function countdown() {
		if(waitnum > 0){
			waitnum--;
		}
		$("#countdown").text(waitnum);
	}

	/*
	 * サッチーのログを検索
	 */
	function satty(){
		var url_prefix = "http://tsumanne.net";
		var url_ss;
		var url_cgi = "indexes.php?format=json&sbmt=URL&w=";
		if ($S == "img") {
			url_ss = "/si/";
		}
		else if ($S == "dat") {
			url_ss = "/sa/";
		}
		else if ($S == "may") {
			url_ss = "/my/";
		}
		else {
			return;
		}
		var url_req = url_prefix + url_ss + url_cgi + $N;
		GM_xmlhttpRequest({
			method: "GET",
			url: url_req,
			onload: function(response) {
				var res = JSON.parse(response.responseText);
				if (res.success) {
					$li.append("<li><a href='" + url_prefix + res.path +
						"' target='_blank'>「」ッチー*</a></li>");
				}
			}
		});
	}
})(jQuery);
