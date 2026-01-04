// ==UserScript==
// @name         Mebuki catalog popup
// @namespace    http://tampermonkey.net/
// @version      2025-11-04
// @description  catalog popup img & title
// @author       You
// @match        https://mebuki.moe/app
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mebuki.moe
// @license      MIT
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/554717/Mebuki%20catalog%20popup.user.js
// @updateURL https://update.greasyfork.org/scripts/554717/Mebuki%20catalog%20popup.meta.js
// ==/UserScript==

(function() {
	'use strict';

	// Your code here...
	let css = '';
	css += 'div#xxxpopup { display: none; position: absolute; z-index: 100; background-color: transparent; pointer-events: none; will-change: transform; backface-visibility: hidden; -webkit-font-smoothing: antialiased;}';
	css += 'div#xxxpopup img {';
	css += ' box-shadow: 0 0 15px rgba(0,0,0,.5); background: rgb(204, 204, 204); ';
	css += ' background-image: linear-gradient(45deg, rgb(255, 255, 255) 25%, transparent 0), linear-gradient(45deg, transparent 75%, rgb(255, 255, 255) 0), linear-gradient(45deg, rgb(255, 255, 255) 25%, transparent 0), linear-gradient(45deg, transparent 75%, rgb(255, 255, 255) 0);';
	css += ' background-size: 16px 16px; background-position: 0 0, 8px 8px, 8px 8px, 16px 16px;';
  css += '}';
	css += 'div#xxxpopup div { background-color: var(--background); color: var(--foreground); position: absolute; border-radius: 0 0 3px 3px; box-shadow: 0 0 15px rgba(0,0,0,.5);}';
	GM_addStyle(css);

	const popup = document.createElement('div');
	popup.id = 'xxxpopup';
	const img = document.createElement('img');
	//popup.appendChild(img);
	const text = document.createElement('div');
	text.classList.add('text-sm');
	popup.appendChild(text);
	popup.insertBefore(img, text);
	document.body.appendChild(popup);
	//console.log(popup);

	document.addEventListener('mouseover', (e) => {
		//console.log(e.target);
		if (e.target.matches('img')) {
			//console.log(`(${e.pageX},${e.pageY})`);
			img.src = e.target.src;
			const crect = e.target.getBoundingClientRect();
			let px = crect.left; let py = crect.top;
			if (px + img.naturalWidth > window.innerWidth) {
				//console.log(`px:crect.left:${px} + img.naturalWidth:${img.naturalWidth} > window.innerWidth:${window.innerWidth}`);
				px -= img.naturalWidth-crect.width;
				//console.log(`px -= img.naturalWidth-crect.width:${crect.width}`);
			}
			px += window.pageXOffset;
			if (py + img.naturalHeight > window.innerHeight) {
				//console.log(`py:crect.top:${py}, img.naturalHeight:${img.naturalHeight} > window.innerHeight:${window.innerHeight}`);
				py -= img.naturalHeight-crect.height;
				//console.log(`py -= img.naturalHeight-crect.height:${crect.height}`);
			}
			py += window.pageYOffset;
			//console.log(`crect (${crect.left},${crect.top}) img.natural (${img.naturalWidth},${img.naturalHeight}) window.inner (${window.innerWidth},${window.innerHeight})`);
			//console.log(`window.page Offset (${window.pageXOffset},${window.pageYOffset})`);
			//console.log(`px,py (${px},${py})`);

			popup.style.top = `${py}px`;
			popup.style.left = `${px}px`;
			const p = e.target.closest('a').querySelector('div.text-sm');
			text.textContent = p.textContent;
			//text.style.top = `${(img.naturalHeight+5)}px`;
			//text.style.left = '0px';
			//console.log(`px,py (${px},${py}) getBoundingClientRect (${crect.left},${crect.top})`);
			popup.style.display = 'block';
		} else if (e.target.matches('div') && e.target.classList.contains("text-sm")) {
			e.target.title = e.target.textContent;
		}
	});
	document.addEventListener('mouseout', (e) => {
		if (e.target.matches('img')) {
			popup.style.display = 'none';
		}
	});
})();