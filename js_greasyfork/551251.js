// ==UserScript==
// @name 디시인사이드 식별코드 자동 새로고침
// @namespace http://tampermonkey.net/
// @version 0.5
// @description 디시인사이드 회원가입시 식별코드에 원하는 단어 중 하나가 뜨면 멈추고 없으면 지정된 속도로 무한 새로고침
// @match https://sign.dcinside.com/join/info*
// @run-at document-idle
// @grant none
// @noframes
// @license CC BY-NC-SA 2.0 KR
// @downloadURL https://update.greasyfork.org/scripts/551251/%EB%94%94%EC%8B%9C%EC%9D%B8%EC%82%AC%EC%9D%B4%EB%93%9C%20%EC%8B%9D%EB%B3%84%EC%BD%94%EB%93%9C%20%EC%9E%90%EB%8F%99%20%EC%83%88%EB%A1%9C%EA%B3%A0%EC%B9%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/551251/%EB%94%94%EC%8B%9C%EC%9D%B8%EC%82%AC%EC%9D%B4%EB%93%9C%20%EC%8B%9D%EB%B3%84%EC%BD%94%EB%93%9C%20%EC%9E%90%EB%8F%99%20%EC%83%88%EB%A1%9C%EA%B3%A0%EC%B9%A8.meta.js
// ==/UserScript==

(function () {
	'use strict';

	if (window.__dc_sign_running__) return;
	window.__dc_sign_running__ = true;
	
	var TARGETS = ['mind', 'finish']; //단어 니가 원하는것들로 바꾸셈
	var REFRESH_MS = 500; // 1초로 바꾸고 싶으면 1000, 0.25초로 바꾸고 싶으면 250으로 설정하면 됨(밑에 slice(0, 500)도 똑같이 바꿔주기)
	var STORAGE_STOP = 'dc_sign_refresh_stop';
	
	function readCodeValue() {
		var selectors = ['#def_user_code', 'input#def_user_code', 'input[name="def_user_code"]'];
		for (var i = 0; i < selectors.length; i++) {
		var el = document.querySelector(selectors[i]);
		if (!el) continue;
		var v = (el.value || el.getAttribute('value') || el.placeholder || el.textContent || '').trim();
		if (v) return v;
		}
		var fb = document.querySelector('.identify, .identify_code, .signup_box, body');
		return fb ? (fb.textContent || '').trim().slice(0, 500) : '';
		}
	function hasTarget(raw) {
		var lower = String(raw || '').toLowerCase();
		for (var i = 0; i < TARGETS.length; i++) {
		if (lower.indexOf(TARGETS[i]) !== -1) return true;
		}
		return false;
		}
	function scheduleReload() {1 / 1
		setTimeout(function () {
		location.reload();
		}, REFRESH_MS);
	}
	(function main() {
		try {
		if (sessionStorage.getItem(STORAGE_STOP) === 'true') return;
		setTimeout(function () {
		var value = readCodeValue();
		if (hasTarget(value)) {
		try { alert('단어 발견!\n\n' + value); } catch (_) {}
		return;
		}
		scheduleReload();
		}, 100);
		} catch (e) {
		setTimeout(function () {
		location.reload();
		}, 800);
		}
		})();
})();
