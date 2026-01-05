// ==UserScript==
// @name        Mitemin_Image_Code
// @namespace   phodra
// @description Mitemin Image to Narou Tag
// @include     http://mitemin.net/userimagesearch/search/
// @include     http://mitemin.net/imagemanage/top/icode/*
// @include     http://*.mitemin.net/userpageimagesearch/search
// @include     http://*.mitemin.net/i*
// @version     0.2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/8632/Mitemin_Image_Code.user.js
// @updateURL https://update.greasyfork.org/scripts/8632/Mitemin_Image_Code.meta.js
// ==/UserScript==

(function (){

	// 小説本文用のタグを生成
	var Tagntag = function( userid, imageid)
	{
		return "<" + imageid + "|" + userid + ">";
	}
	// 活動報告用のタグを生成
	var TagToBlog = function( userid, imageid)
	{
		return "<img src='http://"+userid+".mitemin.net/userpageimage/viewimage/icode/"+imageid+"/' width='520px' alt='"+imageid+"' />"
	}

	var AppendCode = function()
	{
		var $div = $("<div style='margin:5px 0px' />");
		var $txb = $("<input type='text' onfocus='this.select();' readonly='readonly' name='url'>");
		
		if( location.href.indexOf("http://mitemin.net/imagemanage/top/icode/")>=0 )
		{ //画像管理TOP
			var addres = $("div.manage_box>a:last").attr('href');
			var userid = addres.match(/\d+/);
			var imgid = addres.match(/i\d+/);

			var $box = $("div.manage_box");
			var $ntag = $div.clone();
			var $btag = $div.clone();
			var $nt_txb = $txb.clone();
			var $bt_txb = $txb.clone();
			
			$ntag.text("小説：");
			$btag.text("活報：");
			$nt_txb.attr('value', Tagntag(userid,imgid));
			$bt_txb.attr('value', TagToBlog(userid,imgid));
			$ntag.append($nt_txb);
			$btag.append($bt_txb);
			
			$box.append("<br>");
			$box.append("・貼付け用タグ");
			$box.append($ntag);
			$box.append($btag);
			
		}else if( location.href.indexOf("http://mitemin.net/userimagesearch/search")>=0 )
		{ // 画像情報編集
			var $sbox = $(".search_box");
			var userid = $("div#mypagelink_button>a.myuser_menu").attr('href').match(/\d+/);
			for( var i=0; i<$sbox.size(); i++)
			{
				var $item = $sbox.eq(i);
				if( $item.children("div.codetag").size() ) continue;
				
				var imgid = "i" + $item.children("a").attr('href').match(/\d+/);
				var $codetag = $("<div class='codetag'>");
				$item.append($codetag);
				
				var $ntag = $div.clone();
				$ntag.text("小説：");
				var $ntag_txb = $txb.clone();
				$ntag_txb.attr( 'value', Tagntag(userid,imgid));
				$codetag.append($ntag);
				$ntag.append($ntag_txb);
				
				var $toBlog = $div.clone();
				$toBlog.text("活報：");
				var $toBlog_txb = $txb.clone();
				$toBlog_txb.attr( 'value', TagToBlog(userid,imgid));
				$codetag.append($toBlog);
				$toBlog.append($toBlog_txb);
			}
			$("div.codetag input").css('width', '100px');
			
		}else if( location.href.search(/http:\/\/\d+\.mitemin\.net\/i\d+/i)>=0 )
		{ // 個別画像ページ
			var $input = $(".image_infomation:last td input");
			var $parent = $input.parent();
			$input.css('width','230px');

			var thisurl_val = $input.eq(0).attr('value');
			var userid = thisurl_val.match(/\d+/);
			var imgid = thisurl_val.match(/i\d+/);

			var $box = $("<div class='urlbox'>");
			
			var $thisurl = $div.clone();
			$thisurl.text("この画像の URL：");
			$thisurl.append($input.eq(0));
			$box.append($thisurl);
			
			var $tburl = $div.clone();
			$tburl.text("Track Back URL：");
			$tburl.append($input.eq(1));
			$box.append($tburl);

			var $ntag = $div.clone();
			$ntag.text("小説本文用タグ：");
			var $nt_txb = $input.eq(0).clone();
			$nt_txb.attr('value', Tagntag(userid,imgid));
			$ntag.append($nt_txb);
			$box.append($ntag);
			
			var $btag = $div.clone();
			$btag.text("活動報告用タグ：");
			var $bt_txb = $input.eq(0).clone();
			$bt_txb.attr('value', TagToBlog(userid,imgid));
			$btag.append($bt_txb);
			$box.append($btag);

			$parent.parent().append($box);
			$parent.hide();

		}else if( location.href.search(/http:\/\/\d+\.mitemin\.net\/userpageimagesearch\/search/i)>=0 )
		{ // 画像一覧
			var $sbox = $(".search_box");
			var userid = $(".profile_name>p:eq(1)").text().match(/\d+/);
			for( var i=0; i<$sbox.size(); i++)
			{
				var $item = $sbox.eq(i);
				if( $item.children("div.codetag").size() ) continue;
				
				var imgid = $item.children("a").attr('href').match(/i\d+/);
				var $codetag = $("<div class='codetag'>");
				$item.append($codetag);
				
				var $ntag = $div.clone();
				$ntag.text("小説：");
				var $ntag_txb = $txb.clone();
				$ntag_txb.attr( 'value', Tagntag(userid,imgid));
				$codetag.append($ntag);
				$ntag.append($ntag_txb);
				
				var $toBlog = $div.clone();
				$toBlog.text("活報：");
				var $toBlog_txb = $txb.clone();
				$toBlog_txb.attr( 'value', TagToBlog(userid,imgid));
				$codetag.append($toBlog);
				$toBlog.append($toBlog_txb);
			}
		}
	}

	AppendCode();
	$(document).on(
		{
//			'GM_AutoPagerizeLoaded': function()
//			{
//			},
			'GM_AutoPagerizeNextPageLoaded': function(e)
			{
				AppendCode();
			}
		}
	);

})();