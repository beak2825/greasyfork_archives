// ==UserScript==
// @name         Chzzk Clip Extension
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  치지직 클립 생성 시 플레이어 크기 수정
// @author       Nezit
// @match        https://chzzk.naver.com/clip-editor*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chzzk.naver.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/554234/Chzzk%20Clip%20Extension.user.js
// @updateURL https://update.greasyfork.org/scripts/554234/Chzzk%20Clip%20Extension.meta.js
// ==/UserScript==

(function(){
	var f = function(){
		console.log(document)
		console.log(document.getElementsByTagName('body'))
		setTimeout(() => {

		console.log(document.getElementsByClassName('.clip_editor_video_video_area__sZBNb'))

		const bodyEle = document.getElementsByTagName('body')[0]
		const playerEle = document.getElementsByClassName('clip_editor_video_video_area__sZBNb')[0]
		const selectAreaEle = document.getElementsByClassName('croper_border__Nx6GS')[0]

		playerEle.style.width = '2000px !importent'
		playerEle.style.height = '1000px !importent'
		}, 5000)
	}

	window.onload = function () {
                    console.log('start');
                    f();
	}
})();