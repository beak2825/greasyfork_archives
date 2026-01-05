// ==UserScript==
// @name       TwitterプロフィールページにTwitter関連サイトのリンクを追加
// @namespace  namespace
// @version    0.7
// @description  TwitterのプロフィールページにTwitter関連サイトを開くリンクを付け加える
// @require http://code.jquery.com/jquery-2.1.1.min.js
// @match    https://twitter.com/*
// @copyright  2014+, qa2
// @downloadURL https://update.greasyfork.org/scripts/5896/Twitter%E3%83%97%E3%83%AD%E3%83%95%E3%82%A3%E3%83%BC%E3%83%AB%E3%83%9A%E3%83%BC%E3%82%B8%E3%81%ABTwitter%E9%96%A2%E9%80%A3%E3%82%B5%E3%82%A4%E3%83%88%E3%81%AE%E3%83%AA%E3%83%B3%E3%82%AF%E3%82%92%E8%BF%BD%E5%8A%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/5896/Twitter%E3%83%97%E3%83%AD%E3%83%95%E3%82%A3%E3%83%BC%E3%83%AB%E3%83%9A%E3%83%BC%E3%82%B8%E3%81%ABTwitter%E9%96%A2%E9%80%A3%E3%82%B5%E3%82%A4%E3%83%88%E3%81%AE%E3%83%AA%E3%83%B3%E3%82%AF%E3%82%92%E8%BF%BD%E5%8A%A0.meta.js
// ==/UserScript==

$(function() {
    
// urls 
var links = {
  "Mobile Site": "https://mobile.twitter.com/",
  "twilog": "http://twilog.org/",
  "twisave": "http://twisave.com/",
  "whotwi": "http://whotwi.com/",  
  "favotter": "http://favotter.net/user/",
  "favstar": "http://ja.favstar.fm/users/",
  "twipf": "http://twpf.jp/",
  "seartwi": "http://ja.seartwi.com/user/",
  "twiree": "http://twiree.com/a/",
  "togetter": "http://togetter.com/id/",
  "favlog": "http://favolog.org/",
  "twistar": "http://twistar.cc/",
  "twinavi": "http://twinavi.jp/twitter/conversation/",
  "twitcasting": "http://twitcasting.tv/",
  "pakumori": "http://pakumori.net/",
  "ask.fm": "http://ask.fm/",
  "Tweet Tunnel": "http://ten.tweettunnel.com/reverse2.php?textfield=",
  "sleeping time": "http://sleepingtime.org/",
  "topsy": "http://topsy.com/s?q=",
  "g_search": "https://www.google.co.jp/?gws_rd=ssl#q=",
  "g_img": "https://www.google.com/search?site=imghp&tbm=isch&q=",
  "youtube": "https://www.youtube.com/results?search_query=",
  "twitter内検索": "https://www.google.com/search?q=site:twitter.com+",
  "foursquare": "https://ja.foursquare.com/",
  "instagram": "http://instagram.com/"
};

// screen name
var sn = $(".u-linkComplex-target").html();

for(key in links) {
  links[key] += sn;
}

//投稿画像一覧
links.pic_list = "http://app-mgng.rhcloud.com/misc/kusounko.html#"+sn+":100";

//google cache
links.g_cache = "http://webcache.googleusercontent.com/search?q=cache:https://twitter.com/"+sn;

//wayback machine
links.wayback = "http://web.archive.org/web/*/https://twitter.com/"+sn;

//ニコ動　キーワード検索
links.nico_kwd = "http://www.nicovideo.jp/search/"+sn+"?track=nicouni_search_keyword";

for(var key in links) {
  tag = $("<a>");
  tag
    .attr("href", links[key])
    .attr("target", "_blank")
    .attr("name", "tlnk")
    .text(key + " ");
  $(".ProfileHeaderCard").after(tag);
}

});
