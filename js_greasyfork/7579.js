// ==UserScript==
// @name         Livetube Thumbnail Filter
// @namespace    https://greasyfork.org/ja/users/8279-nistim
// @version      0.1
// @description  Livetubeトップページの配信サムネイルをフィルタリングする機能を提供する
// @author       nistim
// @match        http://livetube.cc/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/7579/Livetube%20Thumbnail%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/7579/Livetube%20Thumbnail%20Filter.meta.js
// ==/UserScript==

$(function()
{
    // サムネイル一覧のdiv要素にIDを追加する
    $("#contentBox h3:contains('配信中の動画')").next().attr('id', 'thumbnails');
    // サムネイル一覧の上部に入力フォームを追加する
    $("#thumbnails").before("フィルタ：<input type='text' id='searchForm' style='margin: 0px 0px 0.6em 0px;' size='50'>");
    
    // 入力フォームへのキー入力時処理
    $("#searchForm").keyup(function()
    {
        // フォームに文字が入力されている場合
        if(!$(this).val())
        {
            // 全サムネイルを表示する
            $('#thumbnails div:hidden').show();
        }
        // フォームに文字が入力されていない場合
        else
        {
            // フィルタの文字列一覧を取得し設定する
            var keywords = this.value.split(/\s/);
            
            // 全サムネイルを一旦消去する
            $("#thumbnails div:visible").hide();
            // 全サムネイルのうち、キーワードを含むものだけをフィルタして表示する
            $("#thumbnails div").filter(function()
            {
                // フィルタ用の戻り値
                var returnValue = true;
                // #thumbnails divのthis設定
                var _this = $(this);
                
                // フィルタに含まれるキーワードの検索用ループ処理
                jQuery.each(keywords, function(index, keyword)
                {
                    // キーワード一致有無
                    var wordMatch = false;
                    
                	// サムネイルを構成するdiv要素に含まれるa要素を検索する
                	_this.find("a").each(function()
                	{
                        // a要素のURLにキーワードが含まれる場合
                        if(RegExp(keyword, "i").test(decodeURI(this.href).replace(/http:\/\/livetube\.cc\/(tag\.)?/, "")))
                        {
                            // 表示するために戻り値をtrueに設定する
                            wordMatch = true;
                        	// a要素の検索処理を終了する
                        	return false;
                        }
                	});
                    
                    // キーワード一致有無をフィルタ用の戻り値に設定する
                    returnValue = wordMatch;
                    
                    // キーワードが一致しなかった場合
                    if(!wordMatch)
                    {
                        // キーワードの検索処理を終了する
                        return false;
                    }
                });
                
                // フィルタ用の戻り値を返す
                return returnValue;
            }).show();
            
            // デザイン用のdiv要素を表示する
            $("#thumbnails div:last-child").show();
        }
    });
});