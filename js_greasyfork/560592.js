// ==UserScript==
// @name         小說自動翻頁
// @namespace    https://github.com/doom4ster/autopage
// @version      1.0
// @description  小說自動翻頁 自動拼接下一章節
// @author       doom4ster@gmail.com
// @license      MIT
// @match        https://uukanshu.cc/book/*
// @match        https://tw.zhaoshuyuan.com/b/*
// @match        https://czbooks.net/n/*
// @match        https://www.dajiadu8.com/*
// @match        http://www.xianqihaotianmi.org/read/*
// @match        https://www.99txt.cc/bookinfo/*
// @match        https://www.fantixs.tw/*
// @match        https://www.uukanshu.app/*
// @match        https://tw.hjwzw.com/Book/Read/*
// @match        https://www.8book.com/read/184475/*
// @match        http://m.kanshu.tw/ls/*
// @match        https://big5.quanben5.com/n/*
// @match        https://m.xszj.org/b/*
// @match        https://www.banxia.cc/books/*
// @match        https://www.uuread.tw/chapter/*
// @match        https://twkan.com/txt/*
// @match        https://www.69shuba.com/txt/*
// @match        https://tw.piaotianwenxue.com/book/*
// @match        https://look.thisiscm.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560592/%E5%B0%8F%E8%AA%AA%E8%87%AA%E5%8B%95%E7%BF%BB%E9%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/560592/%E5%B0%8F%E8%AA%AA%E8%87%AA%E5%8B%95%E7%BF%BB%E9%A0%81.meta.js
// ==/UserScript==
var html = null;
var page = 11;
var next = null;
// 以隱藏 iframe 載入頁面，成功後回傳 { html, doc }
function loadViaIframe(url, onSuccess, onError) {
	try {
		var target = new URL(url, window.location.href);
		// 若非同源，無法讀取內容；直接回報錯誤以利外層決策
		if (target.origin !== window.location.origin) {
			throw new Error("跨網域，無法以 iframe 讀取內容: " + target.origin + " ≠ " + window.location.origin);
		}
	} catch (e) {
		// URL 解析或其他錯誤
		if (onError) onError(e);
		return;
	}

	var iframe = document.createElement('iframe');
	iframe.style.display = 'none';
	iframe.setAttribute('sandbox', 'allow-same-origin allow-scripts allow-popups allow-forms');
	iframe.src = url;

	var cleanUp = function () {
		// 延後移除，確保 onSuccess 仍可同步讀取所需資料
		setTimeout(function () {
			try { iframe.remove(); } catch (_) {}
		}, 0);
	};

	iframe.onload = function () {
		try {
			var doc = iframe.contentDocument || (iframe.contentWindow && iframe.contentWindow.document);
			if (!doc) throw new Error('無法取得 iframe document');
			var htmla = doc.documentElement.innerHTML;
			if (onSuccess) onSuccess({ html: htmla, doc: doc });
		} catch (err) {
			if (onError) onError(err);
		} finally {
			cleanUp();
		}
	};

	iframe.onerror = function (err) {
		if (onError) onError(err || new Error('iframe 載入失敗'));
		cleanUp();
	};

	// 掛在 <html> 之下可避免有些站點的 CSS 影響
	document.documentElement.appendChild(iframe);
}
function autopage (url, innerHTML, page) {
	if (0 === page) {

		return innerHTML
	}
	console.log(url, page)
	var gg = '';
	var href = '';
	loadViaIframe(url, function (res) {
		var htmla = res.html;
		var doc = res.doc;

		console.log('iframe success');
		var alinkarray = doc.getElementsByTagName('a');
		for (let index = 0; index < alinkarray.length; index++) {
			const e = alinkarray[index];
			if (e && typeof e.innerText === 'string') {
				if (e.innerText === '下一章' || e.innerText === '下一篇' || e.innerText === '下一') {
					href = e.href;
					break;
				}
			}
		}

		if (href === '') {
			console.log('找不到下一頁連結');
			return;
		}
		console.log(href)
		next = href;
		page = page - 1;
		// 在新載入內容（例如第二章）的開頭，放該章本身的連結（url），而非下一章（href）
		document.getElementsByTagName('html')[0].innerHTML = innerHTML + '<div><a href="' + url + '">' + url + '</a></div>' + htmla
		autopage(href, document.getElementsByTagName('html')[0].innerHTML, page);
	}, function (err) {
		console.log('IFRAME 載入失敗/受限', err && (err.message || err));
	});
}

(function () {
	'use strict';

	html = document.getElementsByTagName('html')[0].innerHTML;

	var alinkarray = document.getElementsByTagName('a');
	var href = '';
	for (let index = 0; index < alinkarray.length; index++) {
		const e = alinkarray[index];
		if (e.innerText === '下一章' || e.innerText === '下一篇' || e.innerText === '下一') {
			href = e.href
			break;
		}
	}
	console.log(href)
	autopage(href, html, page);
	window.addEventListener('scroll', function () {
		var viewportHeight = window.innerHeight || document.documentElement.clientHeight;
		var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
		var docHeight = Math.max(
			document.body.scrollHeight, document.documentElement.scrollHeight,
			document.body.offsetHeight, document.documentElement.offsetHeight,
			document.body.clientHeight, document.documentElement.clientHeight
		);
		// console.log('height', viewportHeight, 'scrollTop', scrollTop, 'doc', docHeight);
		if (viewportHeight + scrollTop + 50 >= docHeight) {
			if (next && !String(next).endsWith('null')) {
				setTimeout(function () {
					console.log(next)
					window.location.href = next;
				}, 30000);
			}
		}
	});
})();