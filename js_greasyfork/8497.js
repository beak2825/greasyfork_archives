// ==UserScript==
// @name         简易 Bilibili 播放器修正脚本
// @namespace    org.jixun.bilibili.fixer
// @version      1.0
// @description  非常简单, 有任何问题请提交 "[简易修正器] " 开头的控制台日志或信息框内容。您可以通过按下 Ctrl + C 进行复制。
// @author       Jixun
// @include      http://bilibili.tv/video/av*
// @include      http://www.bilibili.tv/video/av*

// @include      http://bilibili.com/video/av*
// @include      http://www.bilibili.com/video/av*

// @example      http://www.bilibili.com/video/av2082259/

// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/8497/%E7%AE%80%E6%98%93%20Bilibili%20%E6%92%AD%E6%94%BE%E5%99%A8%E4%BF%AE%E6%AD%A3%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/8497/%E7%AE%80%E6%98%93%20Bilibili%20%E6%92%AD%E6%94%BE%E5%99%A8%E4%BF%AE%E6%AD%A3%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

addEventListener('DOMContentLoaded', function () {
  console.info ('[简易修正器] 准备就绪, 作用于页面 %s', location.href);

  var elFixer = document.createElement('div');
  elFixer.textContent = '修正';
  elFixer.className = 'fav_btn_top';
  elFixer.style.backgroundPosition = '5px -743px';
  elFixer.addEventListener('click', clickFixer, false);
  document.querySelector('.viewbox>.info').appendChild(elFixer);

  setTimeout(function () {
	if (-1 !== getPlayer().textContent.indexOf('由于版权相关问题')) {
	  console.info ('[简易修正器] 检测到 Bilibili 正版源的地域检测. 如果修正后的播放器无法播放, 请尝试将 %chttp://interface.bilibili.com/playurl*%c 加入您的大陆代理规则.', 'color: red', 'color: initial');
	  clickFixer ();
	}
  }, 3000);

  function clickFixer (e) {
	e && e.preventDefault();

	// fadeOut(elFixer);
	beginFixer(getPlayer());
  }

  function getPlayer () {
	return document.getElementById('bofqi');
  }

  function beginFixer (domPlayer) {
	if (!domPlayer)
	  return alert('[简易修正器] 找不到播放器');

	var cids = domPlayer.innerHTML.match(/cid=(\d+)/);
	var aids = location.pathname.match(/av(\d+)(?:_(\d+))?/);

	var cid, aid, pg;
	if (cids) cid = cids[1];
	if (aids) {
	  aid = aids[1];
	  pg  = Number(aids[2]) || 1;
	}

	if (cid && aid) {
	  doReplacePlayer();
	} else if (aid) {
	  console.info ('[简易修正器] 缺失 cid 参数, 尝试抓取');
	  $.get('/widget/getPageList?aid=' + aid).done(function (str) {
		try {
		  cid = JSON.parse(str)[pg - 1].cid;
		  if (!cid)
			throw new Error('Invalid cid param');

		  doReplacePlayer();
		} catch (err) {
		  alert('[简易修正器] 抓取 cid 错误!');
		}
	  });
	} else {
	  alert ('[简易修正器] 数据缺失!');
	}

	function doReplacePlayer () {
	  domPlayer.innerHTML = [
		'<iframe height="482" width="950" class="player" src="https://secure.bilibili.com/secure,cid=',
		cid, '&aid=', aid,
		'" scrolling="no" border="0" frameborder="no" framespacing="0"></iframe>'
	  ].join('');
	}
  }

  function fadeOut (el) {
	var currentOpacity  = 1,
		currentPosition = 0;

	var nTimer = setInterval(procFade, 20);
	procFade();
	return nTimer;

	function procFade () {
	  currentPosition += 0.05;
	  el.style.opacity = currentOpacity = 1 - currentPosition * currentPosition * currentPosition;

	  if (currentPosition >= 1)
		clearInterval(nTimer);
	}
  }
}, false);