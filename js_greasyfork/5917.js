// ==UserScript==
// @name        Pferd.de quote split
// @author	withers@razzle.de
// @namespace   withers
// @description Quote split button for pferd.de
// @include     http://www.pferd.de/threads/*
// @include     http://www.pferd.de/newreply.php*
// @include	http://www.pferd.de/private.php?do=showpm*
// @include	http://www.pferd.de/private.php?do=newpm*
// @include	http://www.pferd.de/private.php?do=insertpm*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/5917/Pferdde%20quote%20split.user.js
// @updateURL https://update.greasyfork.org/scripts/5917/Pferdde%20quote%20split.meta.js
// ==/UserScript==

var repeats = 0;

window.addEventListener("load", function load(event) {
	window.removeEventListener("load", load, false);
	window.setTimeout(addButton, 100);
}, false);

function insertSplit()
{
	var txt;

	txt = document.getElementsByClassName('cke_source cke_enable_context_menu');
	if (txt.length > 0) {
		var sel = txt[0].selectionStart;
		txt[0].value = txt[0].value.substring(0, sel) + '[/QUOTE][QUOTE]' +
			txt[0].value.substring(sel);
	}
}

function addButton() 
{
	var quoteBtns;

	quoteBtns = document.getElementsByClassName('cke_off cke_button_Quote');
	if (quoteBtns.length > 0) {
		var splitBtnWrapper;
		var splitBtn;
		var splitBtnIcon;
		var qbParent;
		var splitImg;

		splitImg = document.createElement('img');
		splitImg.width = 16;
		splitImg.height = 16;
		/* overlay image to make the quote icon look split up */
		splitImg.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QAMwAzADOGP0P2AAAACXBI' +
			'WXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3goSBw8aK/WjegAAAB1pVFh0Q29tbWVudAAAAAAAQ3Jl' +
			'YXRlZCB3aXRoIEdJTVBkLmUHAAAAZ0lEQVQ4y2NgGAW0AcbGxv8JicH4jPgUnT17lhEmdubMGQYT' +
			'E5NHDAwMcjA+IyMjI1yjsbHxf3SATQwZwG0iRiO6GMxlLMhONjExQWFDnf0R6h0BExMTZC+yo/id' +
			'mIBDk+MdTW5UAgCEN4C2CPr5kwAAAABJRU5ErkJggg==';

		splitBtnWrapper = document.createElement('span');
		splitBtnWrapper.className = 'cke_button';

		splitBtn = document.createElement('a');
		splitBtn.className = 'cke_off cke_button_Quote';
		splitBtn.addEventListener('click', insertSplit, true);
		splitBtn.setAttribute('role', 'button');
		splitBtn.setAttribute('title', 'Zitat splitten');

		splitBtnWrapper.appendChild(splitBtn);
		splitBtnIcon = document.createElement('span');
		splitBtnIcon.className = 'cke_icon';
		splitBtnIcon.appendChild(splitImg);
		splitBtn.appendChild(splitBtnIcon);

		qbParent = quoteBtns[0].parentNode.parentNode;
		qbParent.appendChild(splitBtnWrapper);
	} else {
		/* 
		 * Dirty hack to make sure this executes AFTER the editor has
		 * finished loading.
		 */
		if (repeats++ < 60)
			window.setTimeout(addButton, 1000);
	}
}
