// ==UserScript==
// @name        Weibo_v6_Custom
// @namespace   http://weibo.com/raiwhiz
// @description 自定义微博v6版本的颜色
// @include     http*://weibo.com/*/home*
// @include     http*://weibo.com/*/profile*
// @version     beta 0.3.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/6110/Weibo_v6_Custom.user.js
// @updateURL https://update.greasyfork.org/scripts/6110/Weibo_v6_Custom.meta.js
// ==/UserScript==
//by raiwhiz


//  var box = document.getElementById('v6_pl_content_homefeed');
//  box.style.backgroundColor = '#c7edcc';

//  var box_bg = document.getElementsByClassName('WB_cardwrap WB_feed_type S_bg2');
//  for(var i = 0 ; i <= box_bg.length; ++i)
//  {
//    box_bg[i].style.backgroundColor = '#c7edcc';
//  }

function addGlobalStyle(css) 
{
	var head, style;
	head = document.getElementsByTagName('head')[0];
	if (!head) { return; }
	style = document.createElement('style');
	style.type = 'text/css';
	style.innerHTML = css;
	head.appendChild(style);
}

//主区域背景颜色
addGlobalStyle('body.FRAME_main.B_index { background-color:#FFF38A }');
//微博方块背景颜色
addGlobalStyle('div.WB_cardwrap.WB_feed_type.S_bg2 { background-color:#c7edcc }');
addGlobalStyle('div.WB_text.W_f14 { font-size:14px ; color:#000000 }');
//原PO方块背景颜色
addGlobalStyle('div.WB_expand.S_bg1 { background-color:#d7fddc }');
//原PO方块文字和评论文字
addGlobalStyle('div.WB_text { font-size:12px ; color:#000000 }');
//左边栏背景颜色
addGlobalStyle('div.WB_frame { background-color: RGBA(139,78,0,0.25) }');
//左边栏文字颜色
addGlobalStyle('span.levtxt{ color:#000000 }');
//左边栏“更多”文字颜色
addGlobalStyle('a.more.S_txt1{ color:#000000 }');
//超链接颜色
addGlobalStyle('.WB_text a{ color:#009cff !important;}');
//带框超链接颜色
addGlobalStyle('.S_link1{ color:#ff0000 }');
//评论背景颜色
addGlobalStyle('div.WB_repeat.S_line1 { background-color:#c7edcc }');
//好友转发背景颜色
addGlobalStyle('div.WB_feed_together.S_line1.S_bg1{ background-color:#d7fddc }');
//“还有N条对原微博的转发”文字的背景颜色
addGlobalStyle('span.W_fl.wft_info.S_bg1{ background-color:#d7fddc }');
