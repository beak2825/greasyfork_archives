// ==UserScript==
// @name        bro3_url_changeTR
// @namespace   https://greasyfork.org/ja/users/9894
// @description ブラウザ三国志 URLリンク変更スクリプト
// @include     http://*.3gokushi.jp/bbs/*
// @include     http://*.3gokushi.jp/user/*
// @include     http://*.3gokushi.jp/message/*
// @include     http://*.3gokushi.jp/alliance/*
// @version     1.0.7TR
// @downloadURL https://update.greasyfork.org/scripts/8917/bro3_url_changeTR.user.js
// @updateURL https://update.greasyfork.org/scripts/8917/bro3_url_changeTR.meta.js
// ==/UserScript==

/*-----------------------------------------------------------
 【Version】
  最終更新：2013/06/27
  
　1.0.7TR　範囲を限定して改造
  1.0.7  ﾃﾞｭｴﾙﾍﾟｰｼﾞのﾊﾞｸﾞ修正
  1.0.6  その他画像表示対応
  1.0.5  https://対応
  1.0.4  ﾘﾝｸが無い場合、処理をｽﾙｰするよう修正
  1.0.3  同盟TOP＆ひとこと一覧ﾍﾟｰｼﾞにも表示するよう修正
  1.0.2  処理を大きく変更
  1.0.1  Gyazoﾘﾝｸの下に画像表示するよう修正
  1.0.0　ｽｸﾘﾌﾟﾄ作成
-----------------------------------------------------------*/

/*=======================================================
   初期処理
=========================================================*/
//現在表示URL
NowUrl = URLGet();
//現在表示ﾌｫﾙﾀﾞ
NowFolder = FolderGet();


/*=======================================================
   URL文字変更処理
=========================================================*/
wk1 = document.getElementById("commentList");
src1 = wk1.innerHTML;
wk1.innerHTML = UrlToLink(src1);

if (NowUrl == "detail.php" && NowFolder == "message") {
	//書簡ﾍﾟｰｼﾞの場合
	wk2 = document.getElementById("gray02Wrapper");
	src2 = wk2.innerHTML;
	r1 = document.getElementsByClassName("notice");
	r2 = src2.indexOf("出品したカードが落札されました");
	if (r1.length > 0 && r1[0].innerHTML == "ブラウザ三国志運営チーム" && r2 > -1) {
	} else {
		wk2.innerHTML = UrlToLink(src2);
	}
} else if (NowUrl == "res_view.php" || NowUrl == "personal_res_view.php") {
	//掲示板関連
	if (CommentCHK() != "comment") {
		wk2 = document.getElementsByClassName("commonTables");
		src2 = wk2[0].innerHTML;
		wk2[0].innerHTML = UrlToLink(src2);
	}
} else if (NowUrl == "chat_view.php") {
	//ひとこと掲示板一覧ﾍﾟｰｼﾞの場合
	/*wk2 = document.getElementsByClassName("tables");
	src2 = wk2[0].innerHTML;
	wk2[0].innerHTML = UrlToLink(src2);*/
	
	wk2 = document.getElementsByClassName("hitokoto");
	wk3 = document.getElementsByClassName("hitokoto");
	for (cnt = 0; cnt <= wk2.length; cnt++) {
		src2 = wk2[cnt].innerHTML;
		wk3[cnt].innerHTML = UrlToLink(src2);
	}
} else if (NowUrl == "info.php") {
	//同盟TOPﾍﾟｰｼﾞの場合
	wk2 = document.getElementsByClassName("commonTables");
	src2 = wk2[0].innerHTML;
	wk2[0].innerHTML = UrlToLink(src2);
} else if (NowUrl == "") {
	//ﾌﾟﾛﾌｨｰﾙ画面
	wk2 = document.getElementsByClassName("show_comment_cell");
	src2 = wk2[1].innerHTML;
	wk2[1].innerHTML = UrlToLink(src2);
	src2 = wk2[2].innerHTML;
	wk2[2].innerHTML = UrlToLink(src2);
}


/*------------+---------------------------------------------------------+
 * URL文字→ﾘﾝｸ文字に変更                                               |
 *------------+---------------------------------------------------------+
 * html       | <a></a>を付与するHTMLｿｰｽ                                |
 *------------+---------------------------------------------------------+
 * 戻り値     | HTMLｿｰｽ                                                 |
 *------------+---------------------------------------------------------*/
function UrlToLink(html) {
	var html1 = html;
	//var re1 = /(http(s?):\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+)/gi;
	var re1 = /(http(s)?:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+)/gi;
	var re2 = /(http(s?):\/\/gyazo.com\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+)/gi;
	var re4 = /(http(s)?:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+(jpg|jpeg|gif|png|bmp))/gi;
	var re5 = /(https:\/\/docs.google.com\/spreadsheet\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+)/gi;
	var text = html.match(re1);
	
	if (text) {
		text = unique(text);
		
		for (i = 0; i < text.length; i++) {
			var re3 = new RegExp(text[i], "gi");
			
			if (text[i].match(re4)) {
				html1 = html1.replace(text[i], "<a href=\""+text[i]+"\" target=\"_blank\">"+text[i]+"</a><br /><a href=\""+text[i]+"\" target=\"_blank\"><img src=\""+text[i]+"\" width=\"200px\" /></a>");
			} else if (text[i].match(re2)) {
				//Gyazoの場合
				html1 = html1.replace(re3, "<a href=\""+text[i]+"\" target=\"_blank\">"+text[i]+"</a><br /><a href=\""+text[i]+"\" target=\"_blank\"><img src=\""+text[i]+".png\" width=\"200px\" /></a>");
			} else if (text[i].match(re5)) {
				html1 = html1.replace(text[i], "<a href=\""+text[i]+"\" target=\"_blank\">"+text[i]+"</a>");
			} else if (text[i].match(re1)) {
				//普通URLの場合(s無し)
				//html1 = html1.replace(re3, "<a href=\""+text[i]+"\" target=\"_blank\">"+text[i]+"</a>");
				html1 = html1.replace(re3, "<a href=\""+text[i]+"\" target=\"_blank\">"+text[i]+"</a>");
			}
		}
		
		//return html.replace(/(http(s?):\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+)/gi, "<a href=\"$1\" target=\"_blank\">$1</a>");
	}
	
	return html1;
}

/*------------+---------------------------------------------------------+
 * 現在ﾌｫﾙﾀﾞ名取得用                                                    |
 *------------+---------------------------------------------------------+
 * 戻り値     | Path                                                    |
 *------------+---------------------------------------------------------*/
function FolderGet() {
	wkurl = location.href;
	var arr = wkurl.split("/");
	wkurl = arr[arr.length-2];
	
	return wkurl;
}
/*------------+---------------------------------------------------------+
 * 現在ﾌｧｲﾙ名取得用                                                     |
 *------------+---------------------------------------------------------+
 * 戻り値     | Path                                                    |
 *------------+---------------------------------------------------------*/
function URLGet() {
	wkurl = location.href;
	var arr = wkurl.split("/");
	wkurl = arr[arr.length-1];
	arr = wkurl.split("#");
	wkurl = arr[0];
	arr = wkurl.split("?");
	wkurl = arr[0];
	
	return wkurl;
}
/*------------+---------------------------------------------------------+
 * ｺﾒﾝﾄ入力時かどうかのﾁｪｯｸ                                             |
 *------------+---------------------------------------------------------+
 * 戻り値     | 0:OK, 1:Err                                             |
 *------------+---------------------------------------------------------*/
function CommentCHK() {
	wkurl = location.href;
	var arr = wkurl.split("/");
	wkurl = arr[arr.length-1];
	arr = wkurl.split("#");
	wkurl = arr[1];
	
	return wkurl;
}

/*------------+---------------------------------------------------------+
 * 配列の重複削除処理                                                   |
 *------------+---------------------------------------------------------+
 * array      | 配列                                                    |
 *------------+---------------------------------------------------------+
 * 戻り値     | 配列                                                    |
 *------------+---------------------------------------------------------*/
function unique(array) {
	var storage = {};
	var uniqueArray = [];
	var i,value;
	for ( i=0; i<array.length; i++) {
		value = array[i];
		if (!(value in storage)) {
			storage[value] = true;
			uniqueArray.push(value);
		}
	}
	return uniqueArray;
}