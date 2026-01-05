// ==UserScript==
// @name        bro3_UCsuikyo_Get
// @namespace   
// @include     http://*.3gokushi.jp/item/*
// @include     http://*.3gokushi.jp/card/deck.php*
// @description ブラウザ三国志 経験値水鏡娘移動ツール
// @require     http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js
// @grant	GM_addStyle
// @grant	GM_deleteValue
// @grant	GM_getValue
// @grant	GM_listValues
// @grant	GM_log
// @grant	GM_setValue
// @grant	GM_xmlhttpRequest
// @version     1.0.1TR
// @downloadURL https://update.greasyfork.org/scripts/8819/bro3_UCsuikyo_Get.user.js
// @updateURL https://update.greasyfork.org/scripts/8819/bro3_UCsuikyo_Get.meta.js
// ==/UserScript==

d = document;		//document
jQuery.noConflict();	//jQuery
j$ = jQuery;		//
HOST = location.hostname;	//ﾎｽﾄ名
server = HOST.split(".")[0];	//ｻｰﾊﾞ名
PATHNAME = location.pathname;	//ﾌｧｲﾙﾊﾟｽ名

////////////////////////////////////////
// 破棄ﾎﾞﾀﾝ追加
// 1にすると表示されます。
// 自己責任で！
////////////////////////////////////////
DelFlg = 0;

if (PATHNAME == "/item/" || PATHNAME == "/item/index.php") {
	var div1;
	var text1;
	var btn1;
	var div2;
	var btn2;

	var card = [['urchosen', 'UR貂蝉', 'No.4122 UR貂蝉', 'ur', 24122, 0],      // 0 みてない
                ['ucsuikyo', 'UC水鏡', 'No. 4082 UC水鏡', 'uc', 24082, 0],     // 4
                ['ucsuikyonyan', 'UC水鏡娘', 'No. 4102　UC水鏡娘', 'uc', 24102, 0], // 6
                ['csuikyonyan', 'C水鏡娘', 'No.4152 C水鏡娘', 'c', 24152, 0]   // 7 みてない
	];
	// とりあえず貂蝉
	div1 = j$("<div/>");
	div1.prop("style", "margin-top:5px;");
	text1 = j$('<input type="text"/>');
	text1.prop("style", "width:20px;text-align:right;");
	text1.prop("maxlength", "2");
	text1.prop("value", "0");
	text1.prop("id", "chosentxt");
	btn1 = j$('<input type="button"/>');
	btn1.prop("value", "移動");
	btn1.prop("id", "chosenbtn1");
	div1.append("UR貂蝉移動：").append(text1).append("枚").append(btn1).append("<br />").append(div2);
	j$("#itemInventoryLeft").append(div1);

	for(var i = 1; i < card.length; i++ ){
		div1 = j$("<div/>");
		div1.prop("style", "margin-top:5px;");
		text1 = j$('<input type="text"/>');
		text1.prop("style", "width:20px;text-align:right;");
		text1.prop("maxlength", "2");
		text1.prop("value", "0");
		text1.prop("id", card[i][0] + "txt");
		btn1 = j$('<input type="button"/>');
		btn1.prop("value", "移動");
		btn1.prop("id", card[i][0] + "btn1");
		if (card[i][5] == 1 && DelFlg == 1) {
			div2 = j$("<div/>");
			div2.prop("style", "color:#F00;");
			div2.prop("id", card[i][0] + "disp");
			btn2 = j$('<input type="button"/>');
			btn2.prop("value", "移動＆破棄");
			btn2.prop("id", card[i][0] + "btn2");
			div1.append(card[i][1] + " 移動：").append(text1).append("枚").append(btn1).append(btn2).append("<br />").append(div2);
		} else {
			div1.append(card[i][1] + " 移動：").append(text1).append("枚").append(btn1).append("<br />").append(div2);
		}
		j$("#itemInventoryLeft").append(div1);
	}

	// C水鏡娘
	j$("#csuikyonyanbtn1").click(function(){
		CSuikyo_Proc();
	});
	if (DelFlg == 1) {
		j$("#csuikyonyanbtn2").click(function(){
			CSuikyo_Proc();
		});
	}

	// よくわからんので貂蝉だけ元のソースにする
	j$("#chosenbtn1").click(function(){
		URChosen_Proc();
	});

	// UC水鏡
	j$("#ucsuikyobtn1").click(function(){
		Card_proc(card[1][0], card[1][1], card[1][2], card[1][3], card[1][4]);
	});

	// UC水鏡娘
	j$("#ucsuikyonyanbtn1").click(function(){
		Card_proc(card[2][0], card[2][1], card[2][2], card[2][3], card[2][4]);
	});
} else {
	return;
}

function Card_Count(card_title, card_type) {
	var card = j$(".itemIcon" + ".item_icon_bg_" + card_type + ".itemDetailSwitch");
	var cnt = 0;
	for (i = 0; i < card.length; i++) {
		var a = card.eq(i).find('a[title="' + card_title + '"]');
		if (a.html()) {
			cnt = cnt + parseInt(card.eq(i).find(".item_icon_stack").eq(0).html());
		}
	}
	return cnt;
}


function CSuikyo_Proc() {
	var cnt = Card_Count("No.4152 C水鏡娘", 'c');
	if (cnt == 0) { alert("C水鏡娘がありません。"); return; }
	
	if (j$("#csuikyonyantxt").val() == 0 || j$("#csuikyonyantxt").val() == "") {
		alert("1枚以上を設定してください。");
		return;
	} else {
		if (j$("#csuikyonyantxt").val().match(/^[1-9][0-9]*$/)) {
			j$("#csuikyonyandisp").html("C水鏡娘移動中...");
			
			cnt1 = parseInt(j$("#csuikyonyantxt").val());
			ssid = j$("[name=ssid]").eq(0).prop("value");
			var data2 = new Array();
			if (cnt1 > cnt) {
				cnt1 = cnt;
			}
			for (i = 0; i < cnt1; i++) {
				var r = j$.post("index.php", {item_id:24152, ssid:ssid});
				data2.push(r);
			}
			
			j$.when.apply(null, data2).done(function(){
				if (DelFlg == 1) {
					j$("#csuikyonyandisp").html("C水鏡娘破棄中...");
					GM_xmlhttpRequest({
						method: "GET",
						url: "/card/deck.php",
						onload: function(r) {
							var data = document.createElement("dom");
							data.innerHTML = r.responseText;
							
							var card_cnt = j$(data).find(".sortTotal").eq(0).val();	//表示枚数
							var so0 = j$(data).find("#sort_order_0").val();
							var so1 = j$(data).find("#sort_order_1").val();
							var so2 = j$(data).find("#sort_order_2").val();
							var sot0 = j$(data).find("#sort_order_type_0").val();
							var sot1 = j$(data).find("#sort_order_type_1").val();
							var sot2 = j$(data).find("#sort_order_type_2").val();
							
							j$.post("/card/deck.php", 
								{btn_change_flg:1, show_deck_card_count:15, "sort_order[0]":2, "sort_order[1]":5, "sort_order[2]":4, "sort_order_type[0]":0, "sort_order_type[1]":0, "sort_order_type[2]":0, ssid:j$("[name=ssid]").eq(0).prop("value")}, 
								function(x) {
									data = document.createElement("dom");
									data.innerHTML = x;
									var html = j$(data).find(".cardStatusDetail" + ".label-setting-mode");
									var data1 = new Array();
									for (i = 0; i < cnt1; i++) {
										var m = html.eq(i).html().match(/operationExecution\('(.*)', (.*), '(.*)'\)/)[2];
										var param = "deck_file=&target_card=" + m + "&boost_card_flg=1&inc_point=5&mode=del&p=1&ssid=" + j$("[name=ssid]").eq(0).prop("value");
										var r = j$.ajax({
												url: "http://" + HOST + "/card/deck.php", 
												type: "post",
												data: param,
												success: function (x) {
												}
											});
										data1.push(r);
									}
									
									j$.when.apply(null, data1).done(function(){
										j$.post("/card/deck.php", {btn_change_flg:1, show_deck_card_count:card_cnt, "sort_order[0]":so0, "sort_order[1]":so1, "sort_order[2]":so2, "sort_order_type[0]":sot0, "sort_order_type[1]":sot1, "sort_order_type[2]":sot2, ssid:j$("[name=ssid]").eq(0).prop("value")});
										alert(cnt1 + "枚移動＆破棄しました");
										location.href = "index.php";
									});
								}
							);
						}
					});
				} else {
					alert(cnt1 + "枚移動しました。");
					location.href = "index.php";
				}
			});
		} else {
			alert("数値を入力してください。");
			return;
		}
	}
}

function printProperties(obj) {
	var properties = '';
	for (var prop in obj){
		properties += prop + "=" + obj[prop] + "\n";
	}
	alert(properties);
}

function Card_proc(id_txt, card_name, card_title, card_type, item_id) {
	//残り数ﾁｪｯｸ
	var cnt = Card_Count(card_title, card_type);
	if (cnt == 0) { alert(card_name + "がありません。"); return; }

	var divid = id_txt + "txt";
	var dividdisp = id_txt + "disp";
	if (j$("#" + divid).val() == 0 || j$("#" + divid).val() == "") {
		alert("1枚以上を設定してください。");
		return;
	}else if (j$("#" + divid).val() > cnt) {
		alert("所有枚数(" + cnt + "枚)を超えています。");
		return;
	} else {
		if (j$("#" + divid).val().match(/^[1-9][0-9]*$/)) {
			j$("#" + dividdisp).html(card_name + "移動中...");
			
			cnt1 = parseInt(j$("#" + divid).val());
			ssid = j$("[name=ssid]").eq(0).prop("value");
			var data2 = new Array();
			if (cnt1 > cnt) {
				cnt1 = cnt;
			}
			for (i = 0; i < cnt1; i++) {
				var r = j$.post("index.php", {item_id:item_id, ssid:ssid});
				data2.push(r);
			}
			
			j$.when.apply(null, data2).done(function(){
				alert(cnt1 + "枚移動しました。");
				location.href = "index.php";
			});
		} else {
			alert("数値を入力してください。");
			return;
		}
	}
}

function URChosen_Proc() {
	//UR貂蝉の残り数ﾁｪｯｸ
	var card = j$(".itemIcon" + ".item_icon_bg_ur" + ".itemDetailSwitch");
	var cnt = 0;
	for (i = 0; i < card.length; i++) {
		var a = card.eq(i).find('a[title="No.4122 UR貂蝉"]');
		if (a.html()) {
			cnt = cnt + parseInt(card.eq(i).find(".item_icon_stack").eq(0).html());
		}
	}

	if (cnt == 0) { alert("UR貂蝉がありません。"); return; }
	
	if (j$("#chosentxt").val() == 0 || j$("#chosentxt").val() == "") {
		alert("1枚以上を設定してください。");
		return;
	} else {
		if (j$("#chosentxt").val().match(/^[1-9][0-9]*$/)) {
			j$("#chosendisp").html("UR貂蝉移動中...");
			
			cnt1 = parseInt(j$("#chosentxt").val());
			ssid = j$("[name=ssid]").eq(0).prop("value");
			var data2 = new Array();
			if (cnt1 > cnt) {
				cnt1 = cnt;
			}
			for (i = 0; i < cnt1; i++) {
				var r = j$.post("index.php", {item_id:24122, ssid:ssid});
				data2.push(r);
			}
			
			j$.when.apply(null, data2).done(function(){
				alert(cnt1 + "枚移動しました。");
				location.href = "index.php";
			});
		} else {
			alert("数値を入力してください。");
			return;
		}
	}
}