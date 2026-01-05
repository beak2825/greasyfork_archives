// ==UserScript==
// @name        chieNG
// @namespace   http://chiebukuro.yahoo.co.jp/my/gbjyn273
// @author Syakku
// @description	Yahoo! 知恵袋の邪魔な質問を非表示にします (Alt + N キーで設定画面)
// @match     *://chiebukuro.yahoo.co.jp/dir/list*
// @version     2.2
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/8552/chieNG.user.js
// @updateURL https://update.greasyfork.org/scripts/8552/chieNG.meta.js
// ==/UserScript==

var _NG = "";
var _shoki =  "意外と知らない; http://note; 大喜利; クイズ"

main();

// ================≪ メイン処理 ≫================
function main(){
	_NG = GM_getValue("chieNG");
	if (typeof _NG == "undefined" || _NG == "") firstRun();
	if (_NG == " ") return;
	
	var _list =_NG.split("; ");
	var _qalst = document.getElementById("qalst");
	var _li = _qalst.getElementsByTagName("li");

	list:	for (l=0; l<_li.length; l++){
		var _a = _li[l].getElementsByTagName("a");
		
		for (m=0; m<_a.length; m++){
			
			for (n=0; n<_NG.length; n++){
				if (_a[m].text.indexOf(_list[n]) != -1){	
					_li[l].style.display = "none";
					continue list;
				}
			}
		}
	}
}


// ================≪ ホットキー ≫================
document.addEventListener("keydown", function(event){
    if (event.altKey && event.keyCode == 78) {	// code78 : n
		_NG = GM_getValue("chieNG");
		if (typeof _NG == "undefined" || _NG == " ") _NG = "";
		
		switch (prompt("1 : NGをリストに追加\n2 : NGをリストから削除\n3 : NGリストを直接編集", 1)){
			case "1":
				while (true){
					var _add = prompt ("【" +_NG + "】\n\n追加するNGワード :");
					if (_add != "" && _add != null) {
						if (_NG != "") _NG += "; ";
						_NG += _add;
						GM_setValue("chieNG", _NG);
						alert("【" + _add + "】 を追加しました");
					} else {break;}
				}
			break;
			
			case "2":
				var _list =_NG.split("; ");

				while(true) {
					var _del = prompt ("【" + addNum(_list) + "】\n\n削除するNGワードの番号 :");
					if (_del == null) {
						break;
						
					} else if (_del.match(/[^0-9]+/)){
						 alert("数値を入力してください");
						
					} else if (_del > _list.length - 1){
						 alert("存在しない番号です");
						
					} else {
						var _t = _list[_del];
						if (confirm("【" + _t + "】 を削除しますか？")) {
							_list.splice(_del, 1);
							_NG = _list.join("; ");
							GM_setValue("chieNG", _NG);
							alert("【" + _t + "】 を削除しました");

						} else {
							alert("キャンセルされました");
						}
					}
				}

			break;
			case "3":
				while (true){
					var _direct = prompt("* 区切り文字はセミコロン ( ; ) + 半角スペース ( ) です", _NG); 
					if (_direct == null) break;
					if (_direct != "") {
						var _da = _direct.split("; ");
						if (confirm("【" + addNum(_da) + "】\n\nこの内容で上書きしますか?")){
							_NG = _direct;
							GM_setValue("chieNG", _NG);
							alert("上書きしました");
							break;
						}
					} else {
						if (confirm("空白の文字列が入力されました\nNGリストを初期化しますか?")){
							_NG = "";
							GM_deleteValue("chieNG");
							alert("初期化しました");
							break;
						}
					}
				}
			break;
		}
    }
}, true);


// ================≪ 引数の配列に先頭数字を付けて繋げて返す関数 ≫================
function addNum(_ar){
	var _view = "";
	var _k = (_ar.length - 1 + "").length * -1;
	for (l=0; l<_ar.length; l++){
		_view += "["+ l + "] " + _ar[l] + "  ";
	}
	_view = _view.trimRight();
	return(_view);
}

// ================≪ 初回起動 ≫================
function firstRun(){
	
	if (confirm("保存されたNGリストが見つかりませんでした\n初期リストを読み込みますか?\n\n【" + _shoki + "】")){
		_NG = _shoki;
		alert("初期リストを読み込みました");
		
	} else {
		_NG = " ";
		
	}
	GM_setValue("chieNG", _NG);
}