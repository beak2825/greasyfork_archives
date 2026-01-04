// ==UserScript==
// @name 			ESJZoneHideEmptyParagraph
// @namespace 		https://greasyfork.org/scripts/548719
// @version 		0.1.2.1
// @description 	ESJZone Hide Empty Paragraph
// @author 			DarkRover
// @include 		/^https?:\/\/(?:[^\/\.]+\.){0,}esjzone\.(?:cc|me|one)(?:\:[0-9]+)?(?:[\/\?#].*)?$/
// @run-at 			document-end
// @grant 			GM.registerMenuCommand
// @grant 			GM.unregisterMenuCommand
// @license 		MIT
// @downloadURL https://update.greasyfork.org/scripts/548719/ESJZoneHideEmptyParagraph.user.js
// @updateURL https://update.greasyfork.org/scripts/548719/ESJZoneHideEmptyParagraph.meta.js
// ==/UserScript==

(function() {
	'use strict';
	let myDbMsgLv = 0; // ## Debug-Message;
	let myMenuCommandId01;
	window.ESJZHideEmptyActive = false;
	async function myMain() {
		// ## ===[Separator/]===
		const myCheckLength = 60;
		// ## ===[Separator/]===
		if ('ESJZHideEmptyActive' in window) window.ESJZHideEmptyActive = !window.ESJZHideEmptyActive;
		else window.ESJZHideEmptyActive = true;
		if (myMenuCommandId01) GM.unregisterMenuCommand(myMenuCommandId01);
		myMenuCommandId01 = await GM.registerMenuCommand(
			`${(window.ESJZHideEmptyActive ? 'Show' : 'Hide')} Empty Paragraph`, 
			myMain, {autoClose:true}
		);
		// ## https://www.uuid.lol/cuid2
		const myStyleTagId = ['gxh5i8w1v01ogv0a1fpn0d73'];
		const myClassId = ['a6k9l7xvyqyx1e11c9aus3og', 'aaygwvxttkmysme1krx0dl38'];
		const myP00Col = document.querySelectorAll(`.${myClassId[0]}`);
		if (myP00Col.length > 0) {
			if (myDbMsgLv > 1) console.log(`■ myP00Col:[${myP00Col.length}]`);
			if (window.ESJZHideEmptyActive) {
				myP00Col.forEach((e)=>{
					if (!e.classList.contains(myClassId[1])) {
						e.classList.add(myClassId[1]);
					};
				});
			} else {
				myP00Col.forEach((e)=>{
					if (e.classList.contains(myClassId[1])) {
						e.classList.remove(myClassId[1]);
					};
				});
			};
			return;
		};
		// ## ===[Separator/]===
		const myTagCol01 = [
			'hr', 
			'input', 'textarea', 'button', 'select', 'fieldset', 'output', 
			'iframe', 
			'img', 'area', 'canvas', 'figure', 'picture', 'svg', 
			'audio', 'video', 
			'embed', 'object', 
		];
		const myBlankRe = /[\s\t\r\n\u3000]+/g;
		const myP01Col = document.querySelectorAll('.forum-content p');
		document.head.insertAdjacentHTML(
			'beforeend',
			[
				`<style id="${myStyleTagId[0]}" type="text/css">\n`, 
				//`.${myClassId[0]}{}\n`, 
				`.${myClassId[1]}{display:none};\n`, 
				`</style>\n`, 
			].join(''),
		);
		myP01Col.forEach((e)=>{
			if (myDbMsgLv > 1) console.log(`■ myTagCol01:[${myTagCol01.join(', ')}]`);
			if(e.querySelectorAll(myTagCol01.join(', ')).length !== 0) return;
			// ## ===[Separator/]===
			if(e.innerText.length > myCheckLength) return;
			if(e.innerText.replaceAll(myBlankRe, '').length !== 0) return;
			// ## ===[Separator/]===
			e.classList.add(myClassId[0], myClassId[1]);
		});
	};
	myMain();
})();