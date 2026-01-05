// ==UserScript==
// @name         Livetube Handle Cleaner
// @namespace    https://greasyfork.org/ja/users/8279-nistim
// @version      0.21
// @description  Livetube配信での目障りな緑コテによるコメントの表示／非表示設定機能を提供する
// @author       nistim
// @match        *://livetube.cc/*/*
// @match        *://*.livetube.cc/*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/7408/Livetube%20Handle%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/7408/Livetube%20Handle%20Cleaner.meta.js
// ==/UserScript==

(function()
{
    // ライブフラグ
    var liveFlag = false;
    
    // 配信画面へコテ選択セレクトボックスとボタンを追加する
    $("#comment_form").after("緑コテ名<select id='handleList'><option value='invalid'>コテ選択</option></select><button id='toggleVisible' disabled='disabled'>コテ選択</button>");
    
    // 配信がライブ状態の場合
    if($("#breadcrumbs .xright").html().indexOf("Live") != -1)
    {
        // ライブフラグを立てる
        liveFlag = true;
    }
    
    // コテ選択セレクトボックスの選択時処理
    $("#handleList").change(function()
    {
        // 表示状態コテ選択の場合
        if($("#handleList option:selected").val() == "visible")
        {
            // ボタンのテキストを「非表示」に設定し、有効化する
            $("#toggleVisible").text("非表示").removeAttr("disabled");
        }
        // 非表示状態コテ選択の場合
        else if($("#handleList option:selected").val() == "invisible")
        {
            // ボタンのテキストを「表示」に設定し、有効化する
            $("#toggleVisible").text("表示").removeAttr("disabled");
        }
        // その他の場合
        else
        {
            // ボタンのテキストを「コテ選択」に設定し、無効化する
            $("#toggleVisible").text("コテ選択").attr("disabled", "disabled");
        }
    });
    
    // コテ選択ボタンのクリック時処理
    $("#toggleVisible").click(function()
    {
        // 選択中コテが表示状態の場合
        if($("#handleList option:selected").val() == "visible")
        {
            // オプションの値を「非表示」、文字色を「赤色」に設定する
            $("#handleList option:selected").val("invisible").css("color", "red");
            // ボタンのテキストを「表示」に設定する
            $("#toggleVisible").text("表示");
        }
        // 選択中コテが非表示状態の場合
        else
        {
            // オプションの値を「表示」、文字色を「緑色」に設定する
            $("#handleList option:selected").val("visible").css("color", "green");
            // ボタンのテキストを「表示」に設定する
            $("#toggleVisible").text("非表示");
        }
        
        // コテの表示状態を変更する
        changeVisible($("#handleList option:selected").text(), null);
        
        // 自動でスクロールする場合
        if($("#auto_scroll_check").is(":checked"))
        {
            // スクロール処理を実行する
            SmoothScroll($("#right_pane"), $("#right_pane_bottom"));
        }
    });
    
    // #comments直下div要素からのコテ取得
    // target:コテ文字列
    function getHandle(target)
    {
        // Liveの場合
        if(liveFlag === true)
        {
            // 取得したコテを返す
            return(target.find("div:has(a) > a:first").text());
        }
        // 録画の場合
        else
        {
            // 取得したコテを返す
            return(target.find("div:has(a) > span:first > a:first").text());
        }
    }
    
    // コテの表示／非表示状態変更処理
    // handle:コテ文字列
    // target:#comments直下のdiv要素
    function changeVisible(handle, target)
    {
        // 一時取得用コテ
        var tmpHandle = null;
        // 表示状態値（「継承」）
        var displayValue = "inherit";
        
        // コテ選択セレクトボックス内のオプション要素分のループ処理
        $("#handleList option").each(function()
        {
            // テキストとコテが一致する場合
            if($(this).text() == handle)
            {
                // 表示状態が非表示の場合
                if($(this).val() == "invisible")
                {
                    // 表示状態値を「非表示」に設定する
                    displayValue = "none";
                }
                
                // 引数に対象が設定されている場合
                if(target)
                {
                    // 対象の表示状態を設定する
                    target.css("display", displayValue);
                }
                // 引数に対象が設定されていない場合
                else
                {
                    // #comments直下のdiv要素分のループ処理
                    $("#comments > div").each(function()
                    {
                        // コメントのdiv要素からコテを取得する
                        tmpHandle = getHandle($(this));
                        // コテが一致する場合
                        if(handle == tmpHandle)
                        {
                            // 一致したdiv要素の表示状態を設定する
                            $(this).css("display", displayValue);
                        }
                    });
                }
                
                // ループ処理を終了する
                return false;
            }
        });
    }
    
    // コメント確認処理
    // commentOBJ:#comments直下のdiv要素群
    function checkComment(commentOBJ)
    {
        // コテ
        var handle = "";
        // コテの登録有無
        var handleExist = false;
        
        // コメントオブジェクト分のループ処理
        $.each(commentOBJ, function()
        {
            // コメントからコテを取得する
            handle = getHandle($(this));
            
            // コメントにコテが含まれている場合
            if(handle)
            {
                // コテの登録有無を無しで初期化する
                handleExist = false;
                
                // コテ選択セレクトボックス内のオプション要素分のループ処理
                $("#handleList option").each(function()
                {
                    // コテ選択セレクトボックスにコテが登録済みの場合
                    if($(this).text() == handle)
                    {
                        // コテ登録有りに設定する
                        handleExist = true;
                        // ループ処理を終了する
                        return false;
                    }
                });

                // コテ選択セレクトボックスにコテが登録されていない場合
                if(handleExist === false)
                {
                    // コテ選択セレクトボックスにコテを登録する
                    $("#handleList").append($("<option>").val("visible").html(handle).css("color", "green"));
                }

                // コテの表示状態を変更する
                changeVisible(handle, $(this));
            }
        });
    }
    
    // LoadComments()を上書きするためのwindowを取得する
    var root = typeof unsafeWindow == "undefined" ? window : unsafeWindow ;
    
    // Livetubeコメントロード関数を一部改変
	root.LoadComments = function()
	{
		var http = $.ajax(
		{
			url: comment_shard_host + "/stream/" + comment_entry_id + ".comments." + $("#comments").children().length,
			type: "GET",
			cache: false
		})
		.done(function(data, text_status, xhr)
		{
			var comment_index = $("#comments").children().length;
			var initial_load = comment_index == 0;
			var header_json = $.parseJSON(xhr.getResponseHeader("X-JSON"));
			
			if(data != null && data.length > 0 && header_json.n == comment_index)
			{
                /* 追加箇所 **********************************************/
                // コメントのデータをDOM要素に変換する
                var dataOBJ = $.parseHTML(data);
                
                // 追加されるコメントを確認する
                checkComment(dataOBJ);
                /*********************************************************/

                /* 変更箇所 **********************************************/
				//$("#comments").append(data);
                // コメントのデータを追加する
				$("#comments").append(dataOBJ);
                /*********************************************************/
				
				if(!$("#display_all_comments_check").is(":checked"))
				{
					ProcessDisplayAllComment();
				}
				
				if(!initial_load && $("#auto_scroll_check").is(":checked"))
				{
					SmoothScroll($("#right_pane"), $("#right_pane_bottom"));
				}
				
                /* 変更箇所 **********************************************/
				//$("#comments_num").text(comment_index + $.parseHTML(data).length);
                // コメント数を更新する
				$("#comments_num").text(comment_index + dataOBJ.length);
                /*********************************************************/
				
				if(!$("#display_user_image_check").is(":checked"))
				{
					ToggleUserImage();
				}
				
				if(header_json.vi && $("#viewing"))
				{
					$("#viewing").text(header_json.vi);
				}
				
				if(header_json.v && $("#view"))
				{
					$("#view").text(header_json.v);
				}
				
				if(header_json.cc)
				{
					if(header_json.marks)
					{
						DisplayMarks(header_json.marks, header_json.cc);
						
						if(header_json.mark_thresh)
						{
							DisplayMarkThresh(header_json.mark_thresh);
						}
					}
					else
					{
						CoolComment(header_json.cc);
					}
				}
				
				if(header_json.m && $("#mirrors_num"))
				{
					$("#mirrors_num").text(header_json.m);
				}
				
				if(header_json.b && $("#bands"))
				{
					$("#bands").text(header_json.b);
				}
				
				if(header_json.r && $("#mirrors"))
				{
					RenderRoutes(header_json.r);
				}
			}
			
			LoadComments();
		})
		.fail(function(xhr, text_status, error)
		{
			setTimeout(LoadComments, 4000);
		});
    };
    
    // 改変前のコメントロード関数で読み込んだコメントを確認する
    // 以降のコメントは改変後のコメントロード関数で確認される
    checkComment($("#comments").children());
})();