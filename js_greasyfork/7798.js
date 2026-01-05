// ==UserScript==
// @name           Nico Autologin
// @description    ニコニコ動画の自動ログインスクリプトです。
// @namespace      http://efcl.info/ + @7coc
// @include        http://www.nicovideo.jp/watch/*
// @include        https://account.nicovideo.jp/login?*
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_getResourceText
// @require        https://greasyfork.org/scripts/1884-gm-config/code/GM_config.js?version=4836
// @version 0.0.1.20150130061238
// @downloadURL https://update.greasyfork.org/scripts/7798/Nico%20Autologin.user.js
// @updateURL https://update.greasyfork.org/scripts/7798/Nico%20Autologin.meta.js
// ==/UserScript==

//-------------------------------------
// 処理
//-------------------------------------
GM_config.init("ニコニコログイン情報設定", {
	"mail" : {
		"label" : "メールアドレス/電話番号",
		"type" : "text"
	},
	"loginpass" : {
		"label" : "パスワード",
		"type" : "password"
	}
}, {
    save: function() {
        location.reload();
    }
});

// ニコニコ動画ログイン用メールアドレス
var myMailAddress = GM_config.get('mail');
// ニコニコ動画ログイン用パスワード
var myPassword = GM_config.get('loginpass');

var nURL = location.href;
if (nURL.indexOf("http://www.nicovideo.jp/watch/") != -1) {
    var pl = document.getElementById("flvplayer_container");
    if (!pl) {
        var loginA = document.querySelector(".loginButton");
        location.href = loginA.getAttribute("href");
    } else {
        exit;
    }
} else if (nURL.indexOf("https://account.nicovideo.jp/login") != -1) {
    var mailBox = document.getElementById("input__mailtel");
    var passBox = document.getElementById("input__password");
    if (mailBox && passBox && myMailAddress && myPassword) {
        mailBox.value = myMailAddress;
        passBox.value = myPassword;
        if (document.getElementsByClassName("notice error").length == 0) {
         document.querySelector("form").submit();
        } else {GM_config.open();}
    } else {
        GM_config.open()
    }
}

