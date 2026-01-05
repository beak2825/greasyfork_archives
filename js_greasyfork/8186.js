// ==UserScript==
// @name        futaba_thread_highlighter
// @namespace   https://github.com/himuro-majika
// @description スレ本文を検索してカタログでスレッド監視しちゃう
// @include     http://*.2chan.net/*/futaba.php?mode=cat*
// @include     https://*.2chan.net/*/futaba.php?mode=cat*
// @version     1.6.6
// @require     http://ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js
// @grant       GM_registerMenuCommand
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_addStyle
// @license     MIT
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAAPUExURYv4i2PQYy2aLUe0R////zorx9oAAAAFdFJOU/////8A+7YOUwAAAElJREFUeNqUj1EOwDAIQoHn/c88bX+2fq0kRsAoUXVAfwzCttWsDWzw0kNVWd2tZ5K9gqmMZB8libt4pSg6YlO3RnTzyxePAAMAzqMDgTX8hYYAAAAASUVORK5CYII=
// @downloadURL https://update.greasyfork.org/scripts/8186/futaba_thread_highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/8186/futaba_thread_highlighter.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

(function ($) {
	var serverName = document.domain.match(/^[^.]+/);
	var pathName = location.pathname.match(/[^/]+/);
	var serverFullPath = serverName + "_" + pathName;
	var akahukuloadstat;

	init();

	function init(){
		console.log("futaba_thread_highlighter commmon: " +
			GM_getValue("_futaba_thread_search_words", ""));
		console.log("futaba_thread_highlighter indivisual: " +
			getCurrentIndivValue());
		GM_registerMenuCommand("スレッド検索ワード編集", editWords);
		setStyle();
		makecontainer();
		makeConfigUI();
		highlight();
		check_akahuku_reload();
	}

	/*
	 *設定画面表示
	 */
	function editWords(){
		var word_commmon = GM_getValue("_futaba_thread_search_words", "");
		var word_indiv = getCurrentIndivValue();
		$("#GM_fth_searchword_common").val(word_commmon);
		$("#GM_fth_searchword_individual").val(word_indiv);
		var $config_container_ = $("#GM_fth_config_container");
		$config_container_.fadeIn(100);
		setRandomExample();
	}

	/*
	 * 表示中の板の個別検索ワードの取得
	 */
	function getCurrentIndivValue() {
		var indivobj = getIndivObj();
		var str_CurrentIndiv;
		if(indivobj !== "") {
			str_CurrentIndiv = indivobj[serverFullPath];
		}
		else {
			str_CurrentIndiv = "";
		}
		return str_CurrentIndiv;
	}

	/*
	 * 板毎の個別検索ワードのオブジェクトを取得
	 */
	function getIndivObj() {
		var indivVal = GM_getValue("search_words_indiv", "");
		var obj_indiv;
		if(indivVal !== "") {
			obj_indiv = JSON.parse(indivVal);
		}
		else {
			obj_indiv = "";
		}
		return obj_indiv;
	}

	/*
	 * 検索ワードを設定
	 */
	function setSearchWords() {
		var input_common = $("#GM_fth_searchword_common").val();
		var input_indiv = $("#GM_fth_searchword_individual").val();
		GM_setValue("_futaba_thread_search_words", input_common);
		console.log("futaba_thread_highlighter: common searchword updated - " + input_common);
		setIndivValue(input_indiv);
		$("#GM_fth_config_container").fadeOut(100);
		highlight(true);
		/*
		 * 板毎の個別検索ワードを保存
		 */
		function setIndivValue(val) {
			var obj_indiv = getIndivObj();
			if(obj_indiv === ""){
				obj_indiv = {};
			}
			obj_indiv[serverFullPath] = val;
			var jsonstring = JSON.stringify(obj_indiv);
			GM_setValue("search_words_indiv", jsonstring);
			console.log("futaba_thread_highlighter: indivisual searchword updated@" + serverFullPath + " - " + val);
		}
	}

	/*
	 *スレピックアップ表示エリアの設定
	 */
	function makecontainer() {
		var $pickup_thread_area = $("<div>", {
			id: "GM_fth_container"
		});
		$("body > table[border]").before($pickup_thread_area);

		var $container_header = $("<div>", {
			id: "GM_fth_container_header",
			text: "スレッド検索該当スレッド",
			css: {
				"background-color": "#F0E0D6",
				fontWeight: "bolder"
			}
		});
		$pickup_thread_area.append($container_header);
		//設定ボタン
		var $button = $("<span>", {
			id: "GM_fth_searchword",
			text: "[設定]",
			css: {
				cursor: "pointer",
			},
			click: function() {
				editWords();
			}
		});
		$button.hover(function () {
			$(this).css({ backgroundColor:"#EEAA88" });
		}, function () {
			$(this).css({ backgroundColor:"#F0E0D6" });
		});
		$container_header.append($button);

		var $pickup_thread_container = $("<div>", {
			id: "GM_fth_highlighted_threads",
			css: {
				"display": "flex",
				"flex-wrap": "wrap",
			}
		});
		$pickup_thread_area.append($pickup_thread_container);
	}

	/*
	* 設定画面
	*/
	function makeConfigUI() {
		var $config_container = $("<div>", {
			id: "GM_fth_config_container",
			css: {
				position: "fixed",
				"z-index": "1001",
				left: "50%",
				top: "50%",
				"text-align": "center",
				"margin-left": "-475px",
				"margin-top": "-50px",
				"background-color": "rgba(240, 192, 214, 0.95)",
				width: "950px",
				//height: "100px",
				display: "none",
				fontWeight: "normal",
				"box-shadow": "3px 3px 5px #853e52",
				"border": "1px outset",
				"border-radius": "10px",
				"padding": "5px",
			}
		});
		$("#GM_fth_container_header").append($config_container);
		$config_container.append(
			$("<div>").append(
				$("<div>").text("スレ本文に含まれる語句を入力してください。 | を挟むと複数指定できます。正規表現使用可。"),
				$("<div>").text("例 : ").append(
					$("<span>").attr("id", "GM_fth_example").css({
						"background-color": "#ffeeee",
						"padding": "2px",
						"font-weight": "bold"
					})
				)
			),
			$("<div>").css("margin-top", "1em").append(
				$("<div>").append(
					$("<label>").text("全板共通").attr("for", "GM_fth_searchword_common"),
					$("<input>").attr({
						"id": "GM_fth_searchword_common",
						"class": "GM_fth_input"
					}).css("width", "54em"),
					$("<span>").append(
						$("<input>", {
							class: "GM_fth_config_button",
							type: "button",
							val: "区切り文字挿入",
							click: function(){
								insertDelimiter("GM_fth_searchword_common");
							},
						})
					)
				),
				$("<div>").append(
					$("<label>").text("各板個別").attr("for", "GM_fth_searchword_individual"),
					$("<input>").attr({
						"id": "GM_fth_searchword_individual",
						"class": "GM_fth_input"
					}).css("width", "54em"),
					$("<span>").append(
						$("<input>", {
							class: "GM_fth_config_button",
							type: "button",
							val: "区切り文字挿入",
							click: function(){
								insertDelimiter("GM_fth_searchword_individual");
							},
						})
					)
				)
			),
			$("<div>").css({
				"margin-top": "1em",
			}).append(
				$("<span>").css("margin", "0 1em").append(
					$("<input>", {
						class: "GM_fth_config_button",
						type: "button",
						val: "更新",
						click: function(){
							setSearchWords();
						},
					})
				),
				$("<span>").css("margin", "0 1em").append(
					$("<input>", {
						class: "GM_fth_config_button",
						type: "button",
						val: "キャンセル",
						click: function(){
							$config_container.fadeOut(100);
						},
					})
				)
			)
		);
		$(".GM_fth_config_button").css({
			"cursor": "pointer",
			"background-color": "#FFECFD",
			"border": "2px outset #96ABFF",
			"border-radius": "5px",
		}).hover(function() {
			$(this).css("background-color", "#CCE9FF");
		}, function() {
			$(this).css("background-color", "#FFECFD");
		});
		setRandomExample();

		/*
		 * カーソル位置にデリミタ挿入
		 */
		function insertDelimiter(id){
			var $input = $("#" + id);
			var val = $input.val();
			var position = $input[0].selectionStart;
			var newval = val.substr(0, position) + "|" + val.substr(position);
			$input.val(newval);
			$input[0].setSelectionRange(position + 1 ,position + 1);
		}
	}

	function setRandomExample() {
		var exampleWords = [
			"妹がレイ",
			"悪魔がおる",
			"みなもちゃんかわいい",
			"つまんね",
			"マジか",
			"落ち着け",
			"アオいいよね",
			"いい…",
			"ﾌﾗﾜﾊﾊ",
			"(i)orz",
			"うま(み|あじ)",
			"[0-9]時から！",
			"mjpk\\!\\?",
			"よしとみくんは何が好き？",
			"焼肉！",
			"そろそろ",
			"(はじ)?まるよ?",
			"ワグナス！！",
			"ｵﾏﾝｺﾊﾟﾝﾃｨｰ",
			"ﾜｰｵ！"
		];
		var rand, randwords = [];
		for(var i = 0, l = exampleWords.length; i < 3; i++, l--) {
			rand = Math.floor(Math.random() * l);
			randwords.push(exampleWords.splice(rand, 1)[0]);
		}
		var example = randwords.join("|");
		$("#GM_fth_example").text(example);
	}

	/*
	 *赤福の動的リロードの状態を取得
	 */
	function check_akahuku_reload() {
		var target = $("html > body").get(0);
		if ($("#cat_search").length) {
			// ふたクロ
			highlight();
			target = $("html > body > table[border]").get(0);
		}
		var observer = new MutationObserver(function(mutations) {
			mutations.forEach(function(mutation) {
				var nodes = $(mutation.addedNodes);
				if ($("#cat_search").length) {
					// ふたクロ
					if (nodes.length) {
						highlight();
					}
				}
				else if (nodes.attr("border") == "1") {
					var timer = setInterval(function() {
						var status = $("#akahuku_catalog_reload_status").text();
						if(status === "" || status == "完了しました") {
							clearInterval(timer);
							highlight();
						}
					}, 10);
				}
			});
		});
		observer.observe(target, { childList: true });
	}

	/*
	 *カタログを検索して強調表示
	 */
	function highlight(isWordsChanged) {
		var Start = new Date().getTime();//count parsing time
		var words = "";
		var words_common = GM_getValue("_futaba_thread_search_words", "");
		var words_indiv = getCurrentIndivValue();
		if( words_common !== "" ) {
			words += words_common;
			if( words_indiv !== "" ) {
				words += "|" + words_indiv;
			}
		}
		else {
			words += words_indiv;
		}
		//console.log(words);
		try {
			var re = new RegExp(words, "i");
		}
		catch (e) {
			alert("検索ワードのパターンが無効です\n\n" + e);
			editWords();
			return;
		}
		if( words !== "" ) {
			removeOldHighlighted();
			$("body > table[border] td small").each(function(){
				if( $(this).text().match(re) ) {
					if ( !$(this).children(".GM_fth_matchedword").length ) {
						$(this).html($(this).html().replace(re,
							"<span class='GM_fth_matchedword'>" +
							$(this).text().match(re)[0] +
							"</span>"));
					}
					if ( $(this).parent("a").length ) {		//文字スレ
						$(this).parent().parent("td").addClass("GM_fth_highlighted");
					} else {
						$(this).parent("td").addClass("GM_fth_highlighted");
					}
				}
			});
			pickup_highlighted();
		}
		else {
			removeOldHighlighted();
			pickup_highlighted();
		}
		function removeOldHighlighted() {
			if(isWordsChanged) {
				$(".GM_fth_highlighted").removeClass("GM_fth_highlighted");
				$(".GM_fth_matchedword").each(function(){
					$(this).replaceWith($(this).text());
				});
			}
		}
		console.log('futaba_thread_highlighter - Parsing@' + serverFullPath + ': '+((new Date()).getTime()-Start) +'msec');//log parsing time
	}

	/*
	 *強調表示したスレを先頭にピックアップ
	 */
	function pickup_highlighted() {
		if ( $("#GM_fth_highlighted_threads .GM_fth_pickuped").length ) {
			$("#GM_fth_highlighted_threads .GM_fth_pickuped").remove();
		}
		var highlighted = $("body > table .GM_fth_highlighted").clone();
		$("#GM_fth_highlighted_threads").append(highlighted);
		//要素の中身を整形
		highlighted.each(function(){
			if ( !$(this).children("small").length ) {		//文字スレ
				//console.log($(this).children("a").html());
				//$(this).children("a").replaceWith("<div class='GM_fth_pickuped_caption'>" + $(this).html() + "</div>");
			} else {
				$(this).children("small:not(.aima_aimani_generated)").replaceWith("<div class='GM_fth_pickuped_caption'>" +
													  $(this).children("small").html() + "</div>");
				$(this).children("br").replaceWith();
			}
			$(this).replaceWith("<div class='GM_fth_pickuped'>" + $(this).html() + "</div>");
		});
		var $pickuped = $(".GM_fth_pickuped");
		$pickuped.each(function(){
			var width = $(this).find("img").attr("width");
			$(this).css({
				//スレ画の幅に合わせる
				width: width,
			});
		});
	}

	/*
	 *スタイル設定
	 */
	function setStyle() {
		var css =
			//マッチ文字列の背景色
			".GM_fth_matchedword {" +
			"  background-color: #ff0;" +
			"}" +
			//セルの背景色
			".GM_fth_highlighted {" +
			"  background-color: #FFDFE9 !important;" +
			"}" +
			//ピックアップスレ
			".GM_fth_pickuped {" +
			"  max-width: 250px;" +
			"  min-width: 70px;" +
			"  margin: 1px;" +
			"  background-color: #FFDFE9;" +
			"  border-radius: 5px;" +
			"  word-wrap: break-word;" +
			"}" +
			//ピックアップスレ本文
			".GM_fth_pickuped_caption {" +
			"  font-size: small;" +
			"  background-color: #ffdfe9;" +
			"}";
		GM_addStyle(css);
	}
})(jQuery);
