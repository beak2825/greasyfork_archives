// ==UserScript==
// @name        网易云音乐去收藏 999 限制
// @version     1.0
// @description 去除网页版网易云音乐收藏 999 限制而不能添加收藏的问题
// @match       *://music.163.com/*
// @include     *://music.163.com/*
// @grant       none
// @author      864907600cc
// @icon        http://1.gravatar.com/avatar/147834caf9ccb0a66b2505c753747867
// @namespace   http://ext.ccloli.com
// @downloadURL https://update.greasyfork.org/scripts/9206/%E7%BD%91%E6%98%93%E4%BA%91%E9%9F%B3%E4%B9%90%E5%8E%BB%E6%94%B6%E8%97%8F%20999%20%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/9206/%E7%BD%91%E6%98%93%E4%BA%91%E9%9F%B3%E4%B9%90%E5%8E%BB%E6%94%B6%E8%97%8F%20999%20%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==

'use strict';

// 给 .xtag.dis 添加名为 'removedis' 的 animation
var stylesheet = document.createElement('style');
stylesheet.innerHTML = '\
	@-webkit-keyframes removedis {} \
	@-moz-keyframes removedis {} \
	@keyframes removedis {} \
	.m-favgd ul li.xtag.dis { \
		-webkit-animation: removedis; \
		-moz-animation: removedis; \
		animation: removedis; \
	} \
';
document.head.appendChild(stylesheet);

// 对使用了 'removedis' 这一 animation 的指定元素移除 'dis' 这个 class
function removedis (event) {
	if (event.animationName === 'removedis' && event.target.classList.contains('dis')) event.target.classList.remove('dis');
}

// 绑定 animationstart 事件，通过监听页面内所有的 css animation 变化来找到指定元素
document.addEventListener('animationstart', removedis, false); // Firefox / W3C animation start event
document.addEventListener('MSAnimationStart', removedis, false); // IE animation start event
document.addEventListener('webkitAnimationStart', removedis, false); // Chromium / Safari animation start event