// ==UserScript==
// @name         Nicopedia-Smartphone-Previewer
// @namespace    https://github.com/kosh04/userscript
// @version      0.2.20190308
// @description  ニコニコ大百科の記事編集ページにスマートフォン版のプレビューを追加する
// @grant        GM_addStyle
// @match        https://dic.nicovideo.jp/p/a/*
// @match        https://dic.nicovideo.jp/p/v/*
// @match        https://dic.nicovideo.jp/p/i/*
// @match        https://dic.nicovideo.jp/p/l/*
// @match        https://dic.nicovideo.jp/p/u/*
// @match        https://dic.nicovideo.jp/p/c/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @author       kosh (mono)
// @license      Public domain
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/6389/Nicopedia-Smartphone-Previewer.user.js
// @updateURL https://update.greasyfork.org/scripts/6389/Nicopedia-Smartphone-Previewer.meta.js
// ==/UserScript==

// ChangeLog
// =========
// * 0.2.20190308 PC版サイトのデザインリニューアルに伴うCSSセレクタの修正

/* global jQuery, $ */

(function($) {
    "use strict";

    const $article = $('#nicopedia-article-textarea');

    if ($article.length === 0) {
        return;
    }

    GM_addStyle(`
.sp-window { padding: 5px; }
.sp-window h2 { font-size: 1.3em; border-bottom: double 1px #8cc700; margin: 0.4em 0; }
.resizable { overflow: auto; resize: both; }
.sp-view { background-color: #fff; border: solid 1px #66a32f; margin: 10px auto; }
.sp-view iframe { overflow: hidden; width: 100%; height: 100%; }
#sp-view { width: 375px; height: 667px; }
`);

    // デバイスサイズは以下のリンク参照
    // https://material.io/devices/
    // https://developer.apple.com/library/content/documentation/DeviceInformation/Reference/iOSDeviceCompatibility/Displays/Displays.html
    const html = `
<div class="left-box" style="margin: 5px 0; background-image: none; border: solid 1px #aaa; border-radius: 5px;">
<div class="sp-window">
<h2>スマホ版プレビュー</h2>
<p>※実際の表示とは異なる場合があります</p>
<button class="sp-rotate-button" type="button">画面の回転</button>
<select id="sp-device-list">
<option data-width="320" data-height="480">320x480 (iPhone 4S)</option>
<option data-width="375" data-height="667" selected>375x667 (iPhone 6/7/8)</option>
<option data-width="600" data-height="960">600x960 (Nexus 7)</option>
<option data-width="768" data-height="1024">768x1024 (iPad)</option>
</select>
<div id="sp-view" class="sp-view">
<iframe srcdoc=""></iframe>
</div>
</div>
</div>
`;
    const srcdoc = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width">
<link rel="stylesheet" href="/css/reset.css">
<link rel="stylesheet" href="/css/style.css">
</head>
<body>
<div id="top" class="bs-Wrapper">
<div class="bs-Wrapper_Inner">
<section class="sw-Article">
<div class="sw-Article_TitleBox"><!-- 記事名 --></div>
<div class="sw-Article_Menu"><!-- ほめる/共有/その他 --></div>
<div class="sw-Article_Body">
<div class="sw-Article_Body-inner">
<span class="article">${$article.text()}</span>
</div>
</div>
</section>
</div>
</div>
</body>
</html>
`;

    $(".article").before(html);
    // $("#sp-view").addClass("resizable");
    $("#sp-view > iframe").attr("srcdoc", srcdoc);

    const $view = $("#sp-view");

    $(".sp-rotate-button").click(() => {
        $view.css({
            width:  $view.css("height"),
            height: $view.css("width")
        });
    });

    $("#sp-device-list").change((e) => {
        const {width, height} = e.target[e.target.selectedIndex].dataset;
        $view.css({
            width:  `${width}px`,
            height: `${height}px`
        });
    });

}(jQuery));
