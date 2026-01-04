// ==UserScript==
// @name 			ESJZoneModifyTextColor
// @namespace 		https://greasyfork.org/scripts/548348
// @version 		0.2.1.1
// @description 	ESJ Zone Modify Text Color with OKLCh(@CSS)
// @author 			DarkRover
// @include 		/^https?:\/\/(?:[^\/\.]+\.){0,}esjzone\.(?:cc|me|one)(?:\:[0-9]+)?(?:[\/\?#].*)?$/
// @run-at 			document-end
// @grant 			GM.registerMenuCommand
// @grant 			GM.unregisterMenuCommand
// @license 		MIT
// @downloadURL https://update.greasyfork.org/scripts/548348/ESJZoneModifyTextColor.user.js
// @updateURL https://update.greasyfork.org/scripts/548348/ESJZoneModifyTextColor.meta.js
// ==/UserScript==

(function() {
	'use strict';
	let myDbMsgLv = 0; // ## Debug-Message;
	let myMenuCommandId01;
	window.ESJZModTxtClrActive = false;
	async function myMain() {
		// ## ===[Separator/]===
		const myPrefLightness = '.625'; // ## The perceived lightness of OKLCh;
		// ## ===[Separator/]===
		if ('ESJZModTxtClrActive' in window) window.ESJZModTxtClrActive = !window.ESJZModTxtClrActive;
		else window.ESJZModTxtClrActive = true;
		if (myMenuCommandId01) GM.unregisterMenuCommand(myMenuCommandId01);
		myMenuCommandId01 = await GM.registerMenuCommand(
			`Modify (Now: ${(window.ESJZModTxtClrActive ? 'Active' : 'Inactive')})`, 
			myMain, {autoClose:true}
		);
		// ## https://www.uuid.lol/cuid2
		const myCUId2Col = ['g3ab9pc3nr3n2zsota8zxwvd'];
		const myEle01Col = Array.from(document.querySelectorAll(`:is(#details, #integration, .forum-content) [style*="color:"]`));
		if (myEle01Col.length > 0) {
			if (myDbMsgLv > 1) console.log(`■ myEle01Col:[${myEle01Col.length}];`);
			if (window.ESJZModTxtClrActive) {
				myEle01Col.forEach((e)=>{
					if (e.style.getPropertyValue('background-color')) return;
					const myCSSRGBA = window.getComputedStyle(e).getPropertyValue('color');
					if (myDbMsgLv > 1) console.log(`■ myCSSRGBA:[${myCSSRGBA}]`);
					if (!e.hasAttribute(`data-OldColor-${myCUId2Col[0]}`)) e.setAttribute(`data-OldColor-${myCUId2Col[0]}`, myCSSRGBA);
					e.style.setProperty('color', `oklch(from ${myCSSRGBA} ${myPrefLightness} c h / alpha)`);
				});
			} else {
				myEle01Col.forEach((e)=>{
					if (e.style.getPropertyValue('background-color')) return;
					e.style.setProperty('color', e.getAttribute(`data-OldColor-${myCUId2Col[0]}`));
				});
			}
			return;
		};
	};
	myMain();
})();