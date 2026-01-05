// ==UserScript==
// @name        Narrow_DynamicHeader
// @namespace   phodra
// @description 小説家になろうのヘッダーを便利にする
// @version     1.2
// @include     http://ncode.syosetu.com/*
// @include     http://novelcom.syosetu.com/*
// @include     http://novel18.syosetu.com/*
// @include     http://novelcom18.syosetu.com/*
// @downloadURL https://update.greasyfork.org/scripts/7502/Narrow_DynamicHeader.user.js
// @updateURL https://update.greasyfork.org/scripts/7502/Narrow_DynamicHeader.meta.js
// ==/UserScript==


(function (){
	// ユーザーID
	// 自分のIDを調べて書き換えてください。
	// 通常版のユーザーIDは、ホーム画面の右上に以下のように表示されています。
	// 　（ユーザー名）[ID:000000]でログイン中
	// １８禁サイト用のユーザーIDは、Xホーム右側の
	// 「評価をつけた作品一覧」のURLから得ることが出来ます。
	const MY_USER_ID = 0;
	const MY_XUSER_ID = 0;



	// ※そのまま移動させると元の場所が埋め立てられるので、
	// ※クローンを作成したのちにオリジナルは visibility = hidden で隠す。
	// ヘッダー（オリジナル）
	var $header_org = $("#novel_header");
	// ヘッダー（クローン）
	var $header = $header_org.clone(true);
	$header.css( 'position', 'relative');
	
	// オリジナルを隠す
	$header_org.css( 'visibility', 'hidden');
	// header Height
	var headerH = $header.outerHeight();
	
	// ヘッダーの親になるボックス
	var $box = $("<div id='box'>");
	$box.css( 'position', 'fixed');
	$box.append($header);

	// マウス検知エリア
	var $detect =  $("<div id='detect_area' />");
	$detect.css(
		{
			'position': 'fixed',
			'height': headerH,
			'top': 0
		}
	);
	// ヘッダーボックスに乗せる、外す
	$detect.hover(
		function()
		{
			_boxon = true;
			if( scTop>0 ) HeaderShow(true);
			else _show = 2;
		},
		function()
		{
			_boxon = false;
			if( scTop>0 ) HeaderHide( !_lockB && !_lockM );
			else _show = 0;
		}
	);
	$detect.append($box);
	$("body").append($detect);



	// 章タイトルとサブタイトルのラベル
	if( $(".margin_r20").size() ){
		// コンテンツinfoのクローン
		var $info_org = $(".contents1");
		var $info =  $info_org.clone(true);
		$info_org.css( 'visibility', 'hidden');
		$info.css(
			{
				'left': 0,
				'right': 0,
				'margin': 'auto',
				'opacity': '0.8'
			}
		);
	
		var $label = $("<div />");
		var $cp_title = $info.children(".chapter_title");
		$cp_title.hide();
		if( $cp_title.size() )
		{
			var $cp_title2 = $("<span class='label_chapter' />");
			$cp_title2.append($(".chapter_title").text());
			
			$label.append($cp_title2);
			$label.append(" - ");
		}
		// サブタイトル用のエレメント
		var $label_sub = $("<span class='label_subtitle' />");
		$label_sub.append($(".novel_subtitle").text());
		$label.append($label_sub);
		$info.append($label);
		$box.append($info);
	}
	var boxheight = $box.height();


	// 移動ボタン群
	const NDH_BTN = 'ndh_button';
	var move_a = "<a class='"+ NDH_BTN +"' />";
	var move_div = "<div class='"+ NDH_BTN +"' />";

	// 前ページ
	var bn_p = $("a:contains('<<')");
	if( bn_p.size() )
	{
		var $preEp = $(move_a);
		$preEp.text("＜");
		$preEp.attr(
			{
				'alt': 'Prev Episode',
				'href': bn_p.attr('href')
			}
		);
		$preEp.css('left', '15px');
		$header.append($preEp);
	}

	// 次ページ
	var bn_n = $("a:contains('>>')");
	if( bn_n.size() )
	{
		var $nxtEp = $(move_a);
		$nxtEp.text("＞");
		$nxtEp.attr(
			{
				'alt': 'Next Episode',
				'href': bn_n.attr('href')
			}
		);
		$nxtEp.css( 'left', '55px');
		$header.append($nxtEp);
	}
	
	$("#pageBottom").remove();
	$("#pageTop").remove();

	// 最上部へ移動
	var $ptop = $(move_div);
	$ptop.attr( 'alt', 'Scroll Top');
	$ptop.css( 'right', '55px');
	$ptop.text("↑");
	$ptop.click( function(e)
		{
			$("html,body").animate(
				{	'scroll-top': 0
				}, 500
			);
		}
	);
	$header.append($ptop);
	
	// 最下部へ移動
	var $pbtm = $(move_div);
	$pbtm.text("↓");
	$pbtm.attr( 'alt', 'Scroll Bottom');
	$pbtm.css( 'right', '15px');
	$pbtm.click( function(e)
		{
			$("html,body").animate(
				{	'scroll-top':
					$(document).height() -$(window).height()
				}, 500
			);
		}
	);
	$header.append($pbtm);
	
	// AutoPagerizeのページ移動
	// ※インストールしていなくても作製して非表示にしておき、
	// 　AutoPagerizeの初期化イベントで表示させる。
	// 　AP初期化イベント中ではなくこの時点で作成するのは、
	// 　高さの計算を簡略化するため。
	//  前のページ
	var $ap_prev = $(move_div)
	$ap_prev.text("△");
	$ap_prev.attr( 'alt', 'Scroll Prev Page');
	$ap_prev.css(
		{
			'display': 'none',
			'right': '140px',
		}
	);
	$ap_prev.click( function(e)
		{
			$("html,body").animate(
				{	'scroll-top':
					scTop==ap.seam[ap.page]?
					ap.seam[ap.page-1]: ap.seam[ap.page]
				}, 500
			);
		}
	);
	$header.append($ap_prev);

	// 次のページ
	var $ap_next = $(move_div);
	$ap_next.text("▽");
	$ap_next.attr( 'alt', 'Scroll Next Page');
	$ap_next.css(
		{
			'display': 'none',
			'right': '100px',
		}
	);
	$ap_next.click( function(e)
		{
			$("html,body").animate(
				{	'scroll-top':
					ap.page+1<ap.seam.length?
					ap.seam[ap.page+1]:
					$(document).height() -$(window).height()
				}, 500
			);
		}
	);
	$header.append($ap_next);

	// 移動ボタンのスタイル
	var NDH_BTN_Style = 
		"." + NDH_BTN +"{ \
			box-sizing: border-box; \
			border: solid 1px transparent; \
		}" +
		"." + NDH_BTN + ":hover{ \
			border: outset 1px black; \
		}" +
		"." + NDH_BTN + ":active{ \
			border: inset 1px black; \
			background-color: #fafafa; \
		}";
	var mb_style = $("<style type='text/css' />");
	mb_style.append(NDH_BTN_Style);
	$("head").append(mb_style);
	
	// 追加したボタンのスタイルをまとめて設定
	$( "." +NDH_BTN ).css(
		{
			'cursor': 'pointer',
			'position': 'absolute',
			'top': 0,
			'bottom': 0,
			'margin': '4px',
			'padding': '0px 10px',
			'line-height': function()
			{
				return $(this).height()+'px';
			}
		}
	);
	



	// フラグ
	var _boxon = false;
	var _lockB = 0, _lockM = 0;
	var _show = 0;
	
	// 表示設定
	var $navi_box = $("#novelnavi_right");
	if( $navi_box.size() )
	{
		$header_org.find("#novelnavi_right").remove();
		$header.find("#novelnavi_right").hide();
		var $navi = $("<div id='navi_button' class='" + NDH_BTN + "' />");
		$navi.css(
			{
				'position': 'absolute',
				'display': 'block',
				'margin': 0,
				'top': 16,
				'right': 3,
				'height': 28,
				'width': 10
			}
		);
		$navi.click( function()
			{
				if( _lockM )
				{
					$("#menu_off").click();
					_lockM = false;
				}else
				{
					$("#menu_on").click();
					_lockM = true;
				}
			}
		);
		$header.append($navi);

		var $navi_menu = $(".novelview_navi");
		$navi_menu.css(
			{
				'top': headerH,
				'right': 0
			}
		);
		$header.append($navi_menu);

		$("input[name='fix_menu_bar']").prop(
			{
				'disabled': true,
				'checked': false,
			}
		);
		
		$("#menu_off_2").click(
			function(e){ $navi.click(); }
		);
	}



	// AutoPagerize 互換
	var ap;
	// AP用変数とボタンを初期化
	var AP_Init = function()
	{
		ap =
		{
			'seam': [0],
			'page': 0,
		};
		$ap_next.show();
		$ap_prev.show();
	};
	// ページを継ぎ足した時、継ぎ目の位置を記録する
	var AP_SeamLine = function()
	{
		if( ap != null)
		{
			var $ap_sep = $(".autopagerize_page_separator");
			var $ap_sep_last = $ap_sep.eq(-1);
			ap.seam[$ap_sep.index($ap_sep_last)+1] =
				parseInt($ap_sep_last.offset().top)-boxheight;
		}
	};
	
	if( window.AutoPagerize )
	{
		console.log( 'window.AutoPagerize' );
		// 初期化
		AP_Init();
		// 継ぎ足した時
		AutoPagerize.addFilter(AP_SeamLine);
	}else
	{
		$(document).on(
			{
				'GM_AutoPagerizeLoaded': function(){
					AP_Init();
				},
				'GM_AutoPagerizeNextPageLoaded': function(){
					AP_SeamLine();
				}
			}
		);
		
	}

	var scTop = $(window).scrollTop();
	// ヘッダーを表示させる
	var HeaderShow = function(bool)
	{
		if( _show<1 && bool )
		{
			_show = 1;
			// 消えている最中でもすぐにまた表示させる
			$box.stop();
			// ヘッダーを表示させるアニメ
			$box.animate(
				{	'top': 0},
				{	'duration': 'fast',
					'easing'  : 'swing',
					'complete': function()
					{ _show = 2; }
				}
			);
		}
	}
	// ヘッダーを隠す
	var HeaderHide = function(bool)
	{
		if( _show>0 && bool )
		{
			_show = -1;
			$box.stop();
			// ヘッダーを非表示にするアニメ
			$box.animate(
				{	'top': -boxheight},
				{
					'duration': 'normal',
					'easing'  : 'linear',
					'complete': function()
					{ _show = 0; },
					'progress' : function(e)
					{
						if( parseInt($(this).css('top')) <= -scTop )
						{
							$box.stop(false,true);
							$box.css( 'top', -scTop);
						}
					}
				}
			);
		}
	}
	// スクロール位置によってヘッダー位置を調整
	// ※上端でチラ見えしてるときは絶対座標っぽくずらす
	// 　そうでなければ、画面のすぐ上で待機させる
	var HeaderPosSet = function()
	{
		if( scTop <= boxheight ||
			parseInt($box.css('top')) != -boxheight )
		{
			$box.stop();
			$box.css( 'top', scTop<=boxheight? -scTop: -boxheight );
		}
	}
	HeaderPosSet();
	
	var novel_title = $(".margin_r20:first").text();
	$(window).on(
		{
			'ready resize': function()
			{
				$detect.width($(window).width());
				$box.width($(window).width());
			},
			'scroll': function()
			{
				scTop = $(window).scrollTop();
				// ヘッダーを追従させる
				if( _show==0 && !_lockB && !_lockM ) HeaderPosSet();

				// AutoPagerize
				if( ap != null )
				{
					for( var i=ap.seam.length-1; i>=0; i-- )
					{
						if( scTop >= ap.seam[i]-1 )
						{
							if( ap.page != i )
							{
								ap.page = i;
								if( $("#novel_honbun").size() )
								{
									$label_sub.text(
										$(".novel_subtitle").eq(i).text());
									document.title =
										novel_title + " - " + $label_sub.text();
								}
							}
							break;
						}
					}
				}
				
				if( $(".novel_hyouka,#novel_footer,#footer").offset().top
					< scTop + $(window).height() )
				{
					if( !_lockB )
					{
						HeaderShow(true);
						_lockB = true;
					}
				}else
				{
					if( _lockB ) _lockB = false;
					HeaderHide( !_lockM && !_boxon );
				}
			}
		}
	);



	var href;
	// ヘッダーに「目次」を追加
	var $index_li = $("<li />");
	var $index_node = $("<a />");
	var index_href = $("#contents_main>a:first").attr('href');
	if( index_href==null ){
		// 携帯用のアドレスから生成
		var handheld = $("link[media='handheld']").attr('href');
		index_href = handheld.match(/\/n\d+?\w+?\//);
	}
	$index_node.text("目次");
	$index_node.attr( 'href', index_href);
	$index_li.append($index_node);
	$header.find("li:contains('感想')").before($index_li);

	var userid;
	// ノベルフッターから作者コードを抜く
	var user_href = $(".undernavi a:contains('マイページ')").attr('href');
	if( user_href==null ){
		// よくわからんけど作者コードっぽいので引っこ抜く
		var atom = $("link[title='Atom']").attr('href');
		if( atom ){
			userid = atom.match(/(\d+|x\d+[^\.]+?)/)[0] + "/";
			user_href = "http://mypage.syosetu.com/" + userid;
		}else{
			userid=null;
			user_href=null;
		}
	}else{
		userid = user_href.match(/(\d+\/|x\d+.+)/)[0];
	}
	
	// ヘッダーに「作者マイページ」を追加
	var $user_li = $("<li />");
	var $user_node = $("<a />");
	$user_node.text("作者");
	if( userid ){
		$user_node.attr( 'href', user_href);
	}else{
		$user_node.css( 'cssText', 'color: rgba(200,200,200,0.3) !important;');
	}
	$user_li.append($user_node);
	$header.find("li:contains('感想')").before($user_li);

	// ヘッダーに「メール」を追加
	var $mail_li = $("<li />");
	var $mail_node = $("<a />");
	$mail_node.text("メール");
	if( userid && userid[0]!="x" ){
		$mail_node.attr( 'href', 'http://syosetu.com/message/sendinput/to/' + userid);
	}else{
		$mail_node.css( 'cssText', 'color: rgba(200,200,200,0.3) !important;');
	}
	$mail_li.append($mail_node);
	$header.find("li:contains('感想')").before($mail_li);

	// N2コードを取得
	var dlurl, n2code;
	dlurl = $(".undernavi li:contains('ダウンロード')>a");
	if( dlurl.size() ){
		n2code = dlurl.attr('href').match(/\d+\//);
	}
	var bm_config = userid && userid[0]=="x"?
	"http://syosetu.com/favnovelmain18/updateinput/xidfavncode/" + MY_XUSER_ID:
	"http://syosetu.com/favnovelmain/updateinput/useridfavncode/" + MY_USER_ID;
	bm_config += "_" + n2code;
	
	var dl_prm = {
		'hankaku': '0',
		'code': 'utf-8',
		'kaigyo': 'crlf'
	};
	// テキストダウンロードボタンを追加
	var num = location.href.match( /\d+(?=\/$)/ );
	var $down_li = $("<li />");
	var $down_node = $("<a />");
	$down_node.text("DL");
	if( n2code && num ){
		var txtdl_url = userid[0]=="x"?
		"http://novel18.syosetu.com/txtdownload/dlstart/ncode/":
		"http://ncode.syosetu.com/txtdownload/dlstart/ncode/";
		$down_node.attr( 'href',
			txtdl_url + n2code +
			"?hankaku=" + dl_prm.hankaku +
			"&code=" + dl_prm.code +
			"&kaigyo=" + dl_prm.kaigyo +
			"&no=" + location.href.match( /\d+(?=\/$)/ )
		);
	}else{
		$down_node.css( 'cssText', 'color: rgba(200,200,200,0.3) !important;');
		$down_node.css( 'pointerEvents', 'none');
	}
	$down_li.append($down_node);
	$header.find("li:contains('レビュー')").after($down_li);
	
	// 「縦書で読む」を消す
	$header.find("li a.menu").parent().hide();
	
	// 「ブックマークに追加」／「ブックマークを解除」を改変
	var $fav = $("li.booklist,li.booklist_now");
	var $fav_a = $fav.children("a");
	$fav_a.css(
		'cssText',
		"color: #F4FA58 !important;"
	);
	$fav_a.css( 'font-size', '150%');
	if( $("li.booklist").size() ){
		$fav_a.text("☆");
		$fav_a.attr( 'alt', 'ブックマークに追加');
	}else{
		$fav_a.text("★");
		$fav_a.attr(
			{
				'href': bm_config,
				'alt': 'ブックマーク設定'
			}
		);
	}
	$fav.attr( 'class', null);
	
	// しおりを挿む／しおり中ボタンの改変
	var $bmark_img = $("<img>");
	var $bmark = $header.find("li.bookmark,li.bookmark_now");
	$bmark.attr(
		{
			'id': 'bookmark_icongap',
			'class': null
		}
	);
	var $bmark_a = $bmark.children("a");
	if( $bmark_a.size() ){
		$bmark_a.text( "挿栞");
		$bmark_a.attr( 'alt', 'しおりを挿む');
		$bmark_img.attr( 'src', '/novelview/img/bookmarker_now.png');
	}else{
		$bmark.text("");
		$bmark_a = $("<a />");
		$bmark_a.attr(
			{
				'href': bm_config,
				'alt': 'ブックマーク設定'
			}
		);
		$bmark_a.text("設定");
		$bmark.append($bmark_a);
		$bmark_img.attr( 'src', '/novelview/img/bookmarker.png');
	}

	var col = $header_org.find("li>a:first").css('border-left-color');
	if( $fav.size() ){
		$bmark_img.css(
			{
				'pointer-events': 'none',
				'position': 'absolute',
				'top': 0,
				'bottom': 0,
				'margin': 'auto',
				'padding': '0px 8px 0px 12px',
			}
		);
		$bmark_a.before($bmark_img);

		$bmark_a.css(
			'cssText',
			// padding-left は画像サイズから手計算。
			// ※自動計算はloadイベントを使用しなければならないので、
			// 　表示の反映に若干ラグが出る（＆コードがややこしくなる）。
			"padding-left: 33px !important;" +
			"border-left: none !important;"
		);

		// <a>要素のテキストを縦中央合わせ
		// ※heightが確定していなければ、適切なline-heightを求められない
		var Li_Fix = function($li_a){
			$li_a.outerHeight(headerH-1);
			$li_a.css(
				{
					'line-height': $li_a.height()+'px',
					'border-right': '1px solid ' + col,
				}
			);
			$li_a.parent().css('padding',0);
		};
		Li_Fix($bmark_a);
		Li_Fix($fav_a);
	}else{
		$down_node.css( 'border-right', '1px solid ' + col );
	}





	// 感想ページ
	if( location.href.indexOf("impression")>0){
		// コメントフォームをコメント一覧の上に持っていく
		var hyouka = "#hyoukalan";
		var $hyouka = $(hyouka);
		if( $hyouka.size() )
		{
			var $target = $("h1:eq(0)");
			$target.before($hyouka);
			$target.before($("<hr>"));
			
			// 横幅いっぱいにする
			$("textarea," + hyouka).css(
				{
					'box-sizing': 'border-box',
					'width': '100%'
				}
			);
			
			// "▽感想を書く"を消去
			$(".input").hide();
		}
	}
})();



// novel_headerのpositionを記録しないようにする
window.changeMenuBar = function(fixMenuBar){}
