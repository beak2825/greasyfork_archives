// ==UserScript==
// @name        Hoshizora_Header
// @namespace   phodra
// @description 星空文庫にヘッダーを追加する
// @version     1.3
// @include     http://slib.net/*
// @downloadURL https://update.greasyfork.org/scripts/8109/Hoshizora_Header.user.js
// @updateURL https://update.greasyfork.org/scripts/8109/Hoshizora_Header.meta.js
// ==/UserScript==


(function (){
	if( !$("#overview").size() )
	{
		return;
	}
	
	var $detect = $("<div id='detect_area' />");
	$("body").append($detect);
	
	var $header_org = $("#identity");
	var $header = $header_org.clone(true);
	$detect.append($header);
	$header_org.css( 'visibility', 'hidden');
	$header.css(
		{
			'position': 'absolute',
			'margin': 0,
			'padding': 0,
			'top': 0,
			'height': $header_org.outerHeight(),
			'backgroundColor': '#fdfdfd',
			'borderBottom': '1px solid #eeeeee'
		}
	);
	
	var $hz = $header.children("div");
	$hz.css(
		{
			'position': 'absolute',
			'display': 'block',
			'width': $hz.outerWidth(),
			'height': $hz.outerHeight(),
			'top': 0,
			'bottom': 0,
			'left': 10,
			'margin': 'auto'
		}
	);



	const HZH_MENU = "hzHeader_menu";
	const HZH_BUTTON = "hzHeader_button";
	var hzh_menu = "<div class=" + HZH_MENU + " />";
	var hzh_btn = "<div class=" + HZH_BUTTON + " />";
	var hzh_a  = "<a class=" + HZH_BUTTON + " />";
	
	var $ov_org = $("#overview");
	
	// 保存メニュー
	var $file_ul = $(".files");
	$file_ul.children(":eq(-1)").css( 'margin', 0);
	var $file_menu = $(hzh_menu);
	$file_menu.attr("id", "overview");
	$file_menu.append($file_ul);
	
	var $file_a = $(hzh_a);
	$file_a.text("保存");
	
	var $file_btn = $(hzh_btn);
	$file_btn.append($file_a);
	$file_btn.append($file_menu);
	$file_btn.hover(
		function()
		{
			$file_menu.show();
		},
		function()
		{
			$file_menu.hide();
		}
	);

	// 目次メニュー
	//  チャプタージャンプ
	var $chapter_ol = $(".chapter");
	var $chapter_a = $chapter_ol.find("a");
	$chapter_a.css('cursor','pointer');
	$chapter_a.attr("href", null);
	$chapter_a.click( function()
		{
			var i = $("#detect_area .chapter a").index($(this));
			console.log(i);
			$("html,body").animate(
				{
					'scrollTop': $("section").eq(i).offset().top -$header.outerHeight() -10
				}, "normal"
			);
		}
	);
	
	//  情報欄ジャンプ
	var $data_ul = $(".data");
	$data_ul.css('display','block');
	var $data_a = $data_ul.find("a");
	$data_a.css('cursor','pointer');
	$data_a.attr("href", null);
	$data_a.click( function()
		{
			$("html,body").animate(
				{
					'scrollTop': $("#data").offset().top
						-$header.outerHeight()
				}, "normal"
			);
		}
	);
	
	var $jump_menu = $(hzh_menu);
	$jump_menu.attr("id", "overview");
	$jump_menu.append($chapter_ol);
	$jump_menu.append($data_ul);

	var $jump_a = $(hzh_a);
	$jump_a.text("目次");
	$jump_a.attr("href", "#");
	
	var $jump_btn = $(hzh_btn);
	$jump_btn.append($jump_a);
	$jump_btn.append($jump_menu);
	$jump_btn.hover(
		function(){
			$jump_menu.show();
		},
		function(){
			$jump_menu.hide();
		}
	);

	var $menu = $("<div />");
	$header.append($menu);
	$menu.append($file_btn);
	$menu.append($jump_btn);
	
	$("div."+HZH_MENU).css(
		{
			'display': 'none',
			'position': 'absolute',
			'backgroundColor': '#fdfdfd',
			'margin': 0,
			'padding': 5,
			'right': 10,
			'minWidth': 70
		}
	);
	$("div."+HZH_BUTTON).css(
		{
			'float': 'left',
			'backgroundColor': 'lightgray',
			'margin': '0px 5px',
			'position': 'relative'
		}
	);
	$("a."+HZH_BUTTON).css(
		{
			'color': '#333',
			'padding': '5px 10px',
			'textDecoration': 'none'
		}
	);
	$menu.css(
		{
			'position': 'absolute',
			'display': 'block',
			'height': $menu.children().outerHeight(),
			'top': 0,
			'bottom': 0,
			'right': 10,
			'margin': 'auto'
		}
	);
	
	// フラグ
	var _show = 0, _boxon = 0, _lock = 0;
	$detect.css(
		{
			'position': 'fixed',
			'height': $header.outerHeight(),
			'width': $header.outerWidth(),
			'top': 0
		}
	);
	// 感知領域にマウスが侵入
	$detect.hover(
		function(){
			_boxon=1;
			HeaderShow(!_lock);
		},
		function(){
			_boxon=0;
			HeaderClose(!_lock);
		}
	);

	// ヘッダーを表示させる
	var HeaderShow = function(bool)
	{
		if( _show <= 0 && bool )
		{
			// 消えている最中でもすぐにまた表示させる
			$header.stop();
			// ヘッダーを表示させるアニメ
			$header.animate(
				{	'top': 0},
				{	'duration': 'fast',
					'easing'  : 'swing',
					'complete': function()
					{
						_show = 2;
					}
				}
			);
			_show = 1;
		}
	}
	// ヘッダーを隠す
	var HeaderClose = function(bool)
	{
		if( _show > 0 && bool )
		{
			$header.stop();
			// ヘッダーを非表示にするアニメ
			$header.animate(
				{	'top': -$header.outerHeight()},
				{
					'duration': 'normal',
					'easing'  : 'linear',
					'complete': function()
					{
						_show = 0;
					},
					// 途中で目標位置に到達した場合
					'progress' : function(s)
					{
						var scTop = -$(window).scrollTop();
						if( parseInt($(this).css('top')) <= scTop )
						{
							$(this).stop();
							$(this).css( 'top', scTop);
							_show = 0;
						}
					}
				}
			);
			_show = -1;
		}
	}
	
	// スクロール位置によってヘッダー位置を調整
	var HeaderPosSet = function()
	{
		var scTop = $(window).scrollTop();
		var hHgt = $header.outerHeight();
		if( scTop <= hHgt )
		{
			// 上端ならスクロール位置に合わせて絶対座標っぽく
			$header.css( 'top', -scTop);
		}else if( parseInt($header.css('top')) != -hHgt )
		{
			// 上部の表示される位置でなければ、画面のすぐ上
			$header.css( 'top', -hHgt);
		}
	}
	HeaderPosSet();
	
	// ウィンドウのスクロールが発生した時
	$(window).on(
		{
			'ready resize': function()
			{
				$header.width($(window).width());
				$detect.width($(window).width());
			},
			'scroll': function(event)
			{
				if( _show == 0 )
				{
					HeaderPosSet();
				}
				
				var scTop = $(window).scrollTop();
				var btmline = $("#data");
				if( !btmline.size() ) btmline = $('.information');
				if( btmline.offset().top < scTop + $(window).height() )
				{
					if(!_lock)
					{
						HeaderShow(!_boxon);
						_lock=1;
					}
				}else if(_lock)
				{
					HeaderClose(!_boxon);
					_lock=0;
				}
			}
		}
	);
})();