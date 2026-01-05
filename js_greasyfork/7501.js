// ==UserScript==
// @name        VectorDirectDL
// @description Vectorのページにダウンロードボタンを追加する
// @version     2.1
// @namespace   phodra
// @include     http://www.vector.co.jp/soft/*
// @include     https://www.vector.co.jp/soft/*
// @exsample    https://www.vector.co.jp/soft/dl/win95/util/se169348.html
// @exsample    https://www.vector.co.jp/soft/dl/winnt/util/se100730.html
// @downloadURL https://update.greasyfork.org/scripts/7501/VectorDirectDL.user.js
// @updateURL https://update.greasyfork.org/scripts/7501/VectorDirectDL.meta.js
// ==/UserScript==
(function (){
	// リンクを追加する関数
	var AppendLink = function(page)
	{
		var $page = $(page);

		// 挿入箇所
		$inspos = $("h1");

		// ダウンロードボタンと名前を取得
		$btns = $page.find("a.btn.download");
		$names = $page.find("td>strong.fn");

		if ($names.size() == $btns.size())
		{
			for (i=0; i<$btns.size(); i++)
			{
				// ダウンローページヘのダイレクトリンクを作成
				var $link = $("<a class='downloadlink'/>");
				$link.text($names.eq(i).text());
				$link.attr('href', $btns.eq(i).attr('href'));

				// ソフト名の下に挿入
				$inspos.after($link);
				$inspos.after(" ");
			}
		}
	};

	// ダウンロードタブのエレメント
	var $dltab = $("#v_step>.download");
	if ($dltab.size() > 0)
	{
		// ダウンロードタブページを取得
		$.ajax({
			type: 'GET',
			url: $dltab.attr('href'),
			beforeSend: function(xhr){
				xhr.overrideMimeType("text/html; charset=Shift_JIS");
			},
			success: function(data){
				AppendLink(data);
			}
		});
	}
	else
	{
		// すでにダウンロードタブページの場合
		AppendLink(document);
	}
})();