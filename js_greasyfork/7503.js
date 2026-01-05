// ==UserScript==
// @name        NarrowBlog_PushupComment
// @namespace   phodra
// @description 小説家になろう感想・活動報告のコメントフォームをコメントの上に押し上げる
// @version     1.3
// @include     http://mypage.syosetu.com/mypageblog/view/userid/*
// @include     http://novelcom.syosetu.com/impression/list/ncode/*
// @include     https://mypage.syosetu.com/mypageblog/view/userid/*
// @include     https://novelcom.syosetu.com/impression/list/ncode/*
// @downloadURL https://update.greasyfork.org/scripts/7503/NarrowBlog_PushupComment.user.js
// @updateURL https://update.greasyfork.org/scripts/7503/NarrowBlog_PushupComment.meta.js
// ==/UserScript==

/*	// AutoPagerize互換用SITEINFO
	{
		url: "^http://mypage\\.syosetu\\.com/mypage",
		nextLink: "//a[@title='next page' or ../@class='blogcomment_r'] | id('my_blog_l')/a[not(//a[../@class='blogcomment_r'])]",
		pageElement: "//div[@class='bloglist'] | id('novellist novelpointlist novelreviewlist')/ul | id('favuser')//li | id('blogbg blog_comment_input')[not(//a[../@class='blogcomment_l'])] | id('blog_comment')",
		exampleUrl: "",
	},
*/

(function (){
	if( location.href.indexOf("blog")>0){
		// 活動報告
		const input = "blog_comment_input";
		const inspos = "blog_comment";
		
		var PushUp = function( elm, pos){
			// 活動報告
			var parent = document.getElementById("main");
			if( elm == null ){
				// コメントフォームをコメント一覧の上に持っていく
				elm = document.getElementById(input);
			}
			if( pos == null ){
				// 通常ならコメントの前、コメントがない場合本文の後
				pos = document.getElementById(inspos);
			}

			if( elm && pos ){
				parent.insertBefore( elm, pos);
				parent.insertBefore( document.createElement("br"), pos);
			}
		};
		PushUp();

		var nodes = {};
		document.addEventListener(
			'AutoPagerize_DOMNodeInserted',
			function(e){
				var node = e.input;
				nodes[node.id] = node;
			}, false
		);
		document.addEventListener(
			'GM_AutoPagerizeNextPageLoaded',
			function(e){
				if( nodes[inspos] && nodes[input] ){
					PushUp( nodes[input], nodes[inspos] );
					nodes={};
				}
			}, false
		);
	}else{
		// 小説感想ページ
		var comment = "#hyoukalan";
		var $comment = $(comment);

		// 移動
		var $pos = $("h1:eq(0)");
		$pos.before($comment);
		$pos.before($("<hr>"));
		
		// 横幅いっぱいにする
		$("textarea," + comment).css(
			{
				'box-sizing': 'border-box',
				'width': '100%'
			}
		);

		// "▽感想を書く"を消去
		$(".input").hide();
	}
})();