// ==UserScript==
// @name       二次元画像詳細検索をより便利に
// @namespace  namespace
// @version    0.6
// @description  二次元画像詳細検索に便利な機能を追加する
// @match      http://www.ascii2d.net/imagesearch/*
// @require    http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js
// @copyright  2014+, qa2
// @downloadURL https://update.greasyfork.org/scripts/6580/%E4%BA%8C%E6%AC%A1%E5%85%83%E7%94%BB%E5%83%8F%E8%A9%B3%E7%B4%B0%E6%A4%9C%E7%B4%A2%E3%82%92%E3%82%88%E3%82%8A%E4%BE%BF%E5%88%A9%E3%81%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/6580/%E4%BA%8C%E6%AC%A1%E5%85%83%E7%94%BB%E5%83%8F%E8%A9%B3%E7%B4%B0%E6%A4%9C%E7%B4%A2%E3%82%92%E3%82%88%E3%82%8A%E4%BE%BF%E5%88%A9%E3%81%AB.meta.js
// ==/UserScript==

//検索された画像に、似ている画像へのリンクを追加する
//類似画像のリンクを取得し、imgタグをaタグで囲む
var links = $(".link > span:nth-child(1) > a");

for (var i = 0; i < links.length; i++) {
  var similarURL = links.eq(i).attr("href");

  var a = $("<a>").attr("href", similarURL);
  $(".image img").eq(i).wrap(a);
};


// 検索された画像のランキング(月間、今日)をサイト右上のリンクに追加する
var daily = $("<a>");
var monthly = $("<a>");

daily
  .attr("href", "/imagesearch/ranking/daily")
  .text("ランキング(今日)");
monthly
  .attr("href","/imagesearch/ranking/monthly")
  .text("ランキング(月間)");

$("#inner_navi").append(daily);
$("#inner_navi").append(monthly);
