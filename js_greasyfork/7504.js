// ==UserScript==
// @name        NarrowHome_Custom
// @namespace   phodra
// @description 小説家になろうのホームを改造する
// @version     1.5
// @grant       none
// @include     http://syosetu.com/user/top/
// @include     https://syosetu.com/user/top/
// @downloadURL https://update.greasyfork.org/scripts/7504/NarrowHome_Custom.user.js
// @updateURL https://update.greasyfork.org/scripts/7504/NarrowHome_Custom.meta.js
// ==/UserScript==

(function (){
	$("#user_info, .kokuti_box").hide();
	
	$strong = $("<strong class='news'>");
	$strong.css(
		{
			'font-weight': 'bolder',
			'color': 'red'
		}
	);
	
	// 新着メッセージをメッセージボックスに統合
	var $msgInfo = $(".message_info:first");
	if( $msgInfo.size() ){
		// メッセージボックスに新着数表示
		var num = $msgInfo.text().match(/\d+/);

		var $menu_msg = $(".menu_message>a");
		// 名前が長いのでちょっと短くする
		$menu_msg.text("メッセージ");
		$menu_msg.append( $strong.text("(" + num + ")") );
		// 元の新着通知を非表示
		$msgInfo.hide();
	}

	// 感想が書かれました
	var $news = $("div.news_box");
	if( $news.size() ){
		$("div.normal_box:eq(1) li:first>a").append(
			$strong.text(" ！")
		);
		$news.hide();
	}

	// センターカラムの順番を入れ替え
	var $main = $("#main_top");
	var $favuserblog = $("#favuserblog");
	var $writermenu = $("#writter_menu_top");
	var $userbox = $(".usertop_box");
	$main.append($favuserblog);
	$main.append($writermenu);
	$main.append($userbox);
	$main.children().css(
		{
			'margin-top': '5px',
			'margin-bottom': '5px'
		}
	);
	$main.children(":first").css( 'margin-top', 0 );

	// お知らせをコンパクト化
	$("#user_info").hide();
	var $headlog = $("#head_log");
	$headlog.css(
		{
			'width': 'auto',
			'float': 'right',
		}
	);
	var $notice = $("<div id='mini_info'>");
	$notice.css(
		{
			'overflow': 'hidden',
			'margin': "8px 3px 0 2px"
		}
	);
	$headlog.after($notice);
	var noticeWidth = $notice.width();
	
	var shrink = "●";
	var $shrink = $("<a>");
	$shrink.text( shrink );
	$notice.append($shrink);
	var shrinkWidth = $shrink.width();
	$shrink.remove();
	
	var $infos = $("#official li>a");
	var infoCount = $infos.size();
	var $ci = []; // Compact Info
	for( var i=0; i<infoCount; i++ )
	{
		$ci[i] = $infos.eq(i).clone();
		var txt = $ci[i].text();
		$ci[i].text( shrink + txt );
		$ci[i].attr( 'title', txt );
		$ci[i].css(
			{
				'display': 'inline-block',
				'width': shrinkWidth,
				'overflow': 'hidden',
				'text-overflow': 'clip',
				'white-space': 'nowrap'
			}
		);
		$notice.append($ci[i]);
	}

	const DURATION = 1000;
	const WAIT = 5000;
	var ciOpen = function(i, dur){
		if( i >= $ci.length ) return;
		console.log(noticeWidth);
		$ci[i].css(
			{
				'display': 'inline',
				'overflow': 'hidden',
			}
		);
		$ci[i].animate(
			{ 'width': noticeWidth - shrinkWidth*infoCount },
			{
				'duration': dur,
				'easing': 'linear',
				'complete': function(){
					ciWait(i);
				}
			}
		);
	};
	var ciWait = function(i){
		setTimeout(
			function()
			{
				ciClose(i);
				ciOpen(i+1, DURATION);
			}, WAIT
		);
	};
	var ciClose = function(i){
		$ci[i].animate(
			{ 'width': shrinkWidth },
			{
				'duration': DURATION,
				'easing': 'linear',
			}
		);
	};

	ciOpen(0, 0);
})();